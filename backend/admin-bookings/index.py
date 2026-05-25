import json
import os
import psycopg2
from datetime import datetime
from decimal import Decimal


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
}

ALLOWED_STATUSES = {"new", "in_progress", "done", "rejected"}
EDITABLE_FIELDS = {"name", "phone", "service", "address", "price", "manager_note", "assignee", "scheduled_at", "status"}


def esc(s) -> str:
    if s is None:
        return ""
    return str(s).replace("'", "''")


def check_auth(event: dict) -> bool:
    expected = os.environ.get("ADMIN_PASSWORD", "")
    if not expected:
        return False
    headers = event.get("headers") or {}
    pwd = headers.get("X-Admin-Password") or headers.get("x-admin-password") or ""
    return pwd == expected


def serialize_value(v):
    if isinstance(v, datetime):
        return v.isoformat()
    if isinstance(v, Decimal):
        return float(v)
    return v


def fetch_booking(cur, booking_id: int) -> dict | None:
    cur.execute(
        f"""SELECT id, name, phone, service, comment, booking_date, booking_time,
                   status, source, created_at, email_status, email_error,
                   price, manager_note, address, scheduled_at, assignee, updated_at
            FROM bookings WHERE id = {booking_id}"""
    )
    r = cur.fetchone()
    if not r:
        return None
    return {
        "id": r[0], "name": r[1], "phone": r[2], "service": r[3] or "",
        "comment": r[4] or "", "date": r[5] or "", "time": r[6] or "",
        "status": r[7] or "new", "source": r[8] or "site",
        "created_at": serialize_value(r[9]),
        "email_status": r[10] or "pending", "email_error": r[11] or "",
        "price": serialize_value(r[12]), "manager_note": r[13] or "",
        "address": r[14] or "", "scheduled_at": serialize_value(r[15]),
        "assignee": r[16] or "", "updated_at": serialize_value(r[17]),
    }


def fetch_notes(cur, booking_id: int) -> list[dict]:
    cur.execute(
        f"""SELECT id, author, text, created_at FROM booking_notes
            WHERE booking_id = {booking_id} ORDER BY created_at DESC"""
    )
    return [
        {"id": r[0], "author": r[1] or "manager", "text": r[2] or "",
         "created_at": serialize_value(r[3])}
        for r in cur.fetchall()
    ]


def handler(event: dict, context) -> dict:
    """Админ-функция CRM: заявки, статусы, цены, заметки менеджера, комментарии. Требует X-Admin-Password."""
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if not check_auth(event):
        return {"statusCode": 401, "headers": CORS_HEADERS, "body": json.dumps({"error": "Неверный пароль"})}

    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"error": "БД не настроена"})}

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
    except Exception as e:
        return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"error": f"DB connect: {e}"})}

    try:
        if method == "GET":
            params = event.get("queryStringParameters") or {}
            booking_id = params.get("id")

            if booking_id:
                try:
                    bid = int(booking_id)
                except Exception:
                    conn.close()
                    return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "id должен быть числом"})}
                with conn.cursor() as cur:
                    booking = fetch_booking(cur, bid)
                    if not booking:
                        conn.close()
                        return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Заявка не найдена"})}
                    notes = fetch_notes(cur, bid)
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"item": booking, "notes": notes})}

            status_filter = (params.get("status") or "").strip()
            source_filter = (params.get("source") or "").strip()
            search = (params.get("q") or "").strip()
            where_parts = []
            if status_filter and status_filter in ALLOWED_STATUSES:
                where_parts.append(f"status = '{status_filter}'")
            if source_filter in ("site", "manual"):
                where_parts.append(f"source = '{source_filter}'")
            if search:
                s = esc(search.lower())
                where_parts.append(f"(LOWER(name) LIKE '%{s}%' OR phone LIKE '%{s}%' OR LOWER(COALESCE(address, '')) LIKE '%{s}%')")
            where = "WHERE " + " AND ".join(where_parts) if where_parts else ""

            with conn.cursor() as cur:
                cur.execute(
                    f"""SELECT id, name, phone, service, comment, booking_date, booking_time,
                               status, source, created_at, email_status, email_error,
                               price, manager_note, address, scheduled_at, assignee
                        FROM bookings {where}
                        ORDER BY created_at DESC LIMIT 500"""
                )
                rows = cur.fetchall()

                cur.execute("SELECT status, COUNT(*) FROM bookings GROUP BY status")
                counts = {r[0]: r[1] for r in cur.fetchall()}

                cur.execute("SELECT COALESCE(source, 'site'), COUNT(*) FROM bookings GROUP BY source")
                source_counts = {r[0]: r[1] for r in cur.fetchall()}

                cur.execute(
                    """SELECT
                        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') AS day,
                        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS week,
                        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS month,
                        COUNT(*) AS total,
                        COUNT(*) FILTER (WHERE email_status = 'sent') AS emails_sent,
                        COUNT(*) FILTER (WHERE email_status = 'failed' OR email_status = 'not_configured') AS emails_failed,
                        COALESCE(SUM(price) FILTER (WHERE status = 'done'), 0) AS revenue
                    FROM bookings"""
                )
                s = cur.fetchone()
                stats = {
                    "day": s[0], "week": s[1], "month": s[2], "total": s[3],
                    "emails_sent": s[4], "emails_failed": s[5],
                    "revenue": float(s[6]) if s[6] is not None else 0,
                }

            items = []
            for r in rows:
                items.append({
                    "id": r[0], "name": r[1], "phone": r[2], "service": r[3] or "",
                    "comment": r[4] or "", "date": r[5] or "", "time": r[6] or "",
                    "status": r[7] or "new", "source": r[8] or "site",
                    "created_at": serialize_value(r[9]),
                    "email_status": r[10] or "pending", "email_error": r[11] or "",
                    "price": serialize_value(r[12]), "manager_note": r[13] or "",
                    "address": r[14] or "", "scheduled_at": serialize_value(r[15]),
                    "assignee": r[16] or "",
                })

            conn.close()
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"items": items, "counts": counts, "source_counts": source_counts, "stats": stats})}

        if method == "POST":
            try:
                body = json.loads(event.get("body") or "{}")
            except Exception:
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid JSON"})}

            action = body.get("action", "update_status")

            if action == "create":
                name = (body.get("name") or "").strip()[:100]
                phone = (body.get("phone") or "").strip()[:40]
                if not name or not phone:
                    conn.close()
                    return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Имя и телефон обязательны"})}
                service = (body.get("service") or "").strip()[:200]
                address = (body.get("address") or "").strip()[:255]
                comment = (body.get("comment") or "").strip()[:1000]
                manager_note = (body.get("manager_note") or "").strip()[:1000]
                date = (body.get("date") or "").strip()[:50]
                time_slot = (body.get("time") or "").strip()[:20]
                price_val = body.get("price")
                price_sql = "NULL"
                if price_val not in (None, "", 0):
                    try:
                        price_sql = str(float(price_val))
                    except Exception:
                        price_sql = "NULL"
                with conn.cursor() as cur:
                    cur.execute(
                        f"""INSERT INTO bookings (name, phone, service, address, comment, manager_note,
                                                  booking_date, booking_time, price, source, status, email_status)
                            VALUES ('{esc(name)}', '{esc(phone)}', '{esc(service)}', '{esc(address)}',
                                    '{esc(comment)}', '{esc(manager_note)}',
                                    '{esc(date)}', '{esc(time_slot)}', {price_sql}, 'manual', 'new', 'not_sent')
                            RETURNING id"""
                    )
                    new_id = cur.fetchone()[0]
                    item = fetch_booking(cur, new_id)
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True, "id": new_id, "item": item})}

            booking_id = body.get("id")

            if not isinstance(booking_id, int):
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "id обязателен"})}

            if action == "update_status":
                new_status = body.get("status", "")
                if new_status not in ALLOWED_STATUSES:
                    conn.close()
                    return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Недопустимый статус"})}
                with conn.cursor() as cur:
                    cur.execute(
                        f"UPDATE bookings SET status='{new_status}', updated_at=NOW() WHERE id={booking_id}"
                    )
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True})}

            if action == "update_fields":
                fields = body.get("fields") or {}
                set_parts = []
                for key, val in fields.items():
                    if key not in EDITABLE_FIELDS:
                        continue
                    if key == "status" and val not in ALLOWED_STATUSES:
                        continue
                    if val is None or val == "":
                        if key == "price" or key == "scheduled_at":
                            set_parts.append(f"{key}=NULL")
                        else:
                            set_parts.append(f"{key}=''")
                    elif key == "price":
                        try:
                            num = float(val)
                            set_parts.append(f"price={num}")
                        except Exception:
                            continue
                    elif key == "scheduled_at":
                        set_parts.append(f"scheduled_at='{esc(val)}'")
                    else:
                        set_parts.append(f"{key}='{esc(val)}'")
                if not set_parts:
                    conn.close()
                    return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет полей для обновления"})}
                set_parts.append("updated_at=NOW()")
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE bookings SET {', '.join(set_parts)} WHERE id={booking_id}")
                    item = fetch_booking(cur, booking_id)
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True, "item": item})}

            if action == "add_note":
                text = (body.get("text") or "").strip()
                author = (body.get("author") or "manager").strip()[:80]
                if not text:
                    conn.close()
                    return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Текст обязателен"})}
                with conn.cursor() as cur:
                    cur.execute(
                        f"""INSERT INTO booking_notes (booking_id, author, text)
                            VALUES ({booking_id}, '{esc(author)}', '{esc(text)}')
                            RETURNING id, created_at"""
                    )
                    row = cur.fetchone()
                    note = {"id": row[0], "author": author, "text": text, "created_at": serialize_value(row[1])}
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True, "note": note})}

            if action == "delete":
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE bookings SET status='rejected', updated_at=NOW() WHERE id={booking_id}")
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True})}

            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Неизвестное действие"})}

        conn.close()
        return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Method not allowed"})}

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"error": str(e)})}