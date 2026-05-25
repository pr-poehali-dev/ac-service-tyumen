import json
import os
import psycopg2
from datetime import datetime


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
}

ALLOWED_STATUSES = {"new", "in_progress", "done", "rejected"}


def check_auth(event: dict) -> bool:
    expected = os.environ.get("ADMIN_PASSWORD", "")
    if not expected:
        return False
    headers = event.get("headers") or {}
    pwd = headers.get("X-Admin-Password") or headers.get("x-admin-password") or ""
    return pwd == expected


def handler(event: dict, context) -> dict:
    """Админ-функция: список заявок, смена статуса, удаление. Требует пароль в заголовке X-Admin-Password."""
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
            status_filter = (params.get("status") or "").strip()
            where = ""
            if status_filter and status_filter in ALLOWED_STATUSES:
                where = f"WHERE status = '{status_filter}'"

            with conn.cursor() as cur:
                cur.execute(
                    f"""SELECT id, name, phone, service, comment, booking_date, booking_time,
                               status, source, created_at, email_status, email_error
                        FROM bookings {where}
                        ORDER BY created_at DESC
                        LIMIT 500"""
                )
                rows = cur.fetchall()

                cur.execute(
                    """SELECT status, COUNT(*) FROM bookings GROUP BY status"""
                )
                counts = {r[0]: r[1] for r in cur.fetchall()}

                cur.execute(
                    """SELECT
                        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') AS day,
                        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS week,
                        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS month,
                        COUNT(*) AS total,
                        COUNT(*) FILTER (WHERE email_status = 'sent') AS emails_sent,
                        COUNT(*) FILTER (WHERE email_status = 'failed' OR email_status = 'not_configured') AS emails_failed
                    FROM bookings"""
                )
                s = cur.fetchone()
                stats = {
                    "day": s[0], "week": s[1], "month": s[2], "total": s[3],
                    "emails_sent": s[4], "emails_failed": s[5],
                }

            items = []
            for r in rows:
                items.append({
                    "id": r[0],
                    "name": r[1],
                    "phone": r[2],
                    "service": r[3] or "",
                    "comment": r[4] or "",
                    "date": r[5] or "",
                    "time": r[6] or "",
                    "status": r[7] or "new",
                    "source": r[8] or "site",
                    "created_at": r[9].isoformat() if isinstance(r[9], datetime) else str(r[9]),
                    "email_status": r[10] or "pending",
                    "email_error": r[11] or "",
                })

            conn.close()
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"items": items, "counts": counts, "stats": stats})}

        if method == "POST":
            try:
                body = json.loads(event.get("body") or "{}")
            except Exception:
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid JSON"})}

            action = body.get("action", "update_status")
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
                        f"UPDATE bookings SET status = '{new_status}' WHERE id = {booking_id}"
                    )
                conn.close()
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True})}

            if action == "delete":
                with conn.cursor() as cur:
                    cur.execute(f"DELETE FROM bookings WHERE id = {booking_id}")
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