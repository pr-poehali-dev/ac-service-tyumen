import json
import os
import re
import urllib.request
import urllib.error
from datetime import datetime

import psycopg2


MANAGER_EMAIL = "Straikpro72.tmn@yandex.ru"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
}


def escape_html(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def send_via_sendgrid(api_key: str, from_email: str, to_email: str, subject: str, html: str, reply_to: str = None) -> tuple[bool, str]:
    payload = {
        "personalizations": [{"to": [{"email": to_email}], "subject": subject}],
        "from": {"email": from_email, "name": "Страйк Сервис"},
        "content": [{"type": "text/html", "value": html}],
    }
    if reply_to:
        payload["reply_to"] = {"email": reply_to}

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.sendgrid.com/v3/mail/send",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            if 200 <= resp.status < 300:
                return True, "ok"
            return False, f"SendGrid HTTP {resp.status}"
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        return False, f"SendGrid {e.code}: {body[:200]}"
    except Exception as e:
        return False, f"Error: {e}"


def build_manager_html(data: dict) -> str:
    name = escape_html(data.get("name", "—"))
    phone = escape_html(data.get("phone", "—"))
    service = escape_html(data.get("service", "—") or "Не указана")
    comment = escape_html(data.get("comment", "") or "—")
    date = escape_html(data.get("date", "—") or "Не выбрана")
    time_slot = escape_html(data.get("time", "—") or "Не выбрано")

    now = datetime.now().strftime("%d.%m.%Y %H:%M")

    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f1f5f9;">
<div style="max-width:600px;margin:0 auto;background:#fff;padding:28px;">
  <div style="border-bottom:3px solid #0ea5e9;padding-bottom:14px;margin-bottom:20px;">
    <div style="font-size:20px;font-weight:900;color:#0ea5e9;letter-spacing:1px;">СТРАЙК <span style="color:#0f172a;">СЕРВИС</span></div>
    <div style="color:#64748b;font-size:12px;margin-top:4px;">Заявка с сайта straikservis.ru</div>
  </div>

  <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;margin-bottom:20px;border-radius:4px;color:#78350f;font-weight:600;">
    🔔 Новая заявка на обслуживание!
  </div>

  <h2 style="color:#0f172a;font-size:20px;margin:0 0 16px;">Данные клиента</h2>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
    <tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;width:140px;">Имя</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">{name}</td></tr>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Телефон</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;"><a href="tel:{phone}" style="color:#0ea5e9;text-decoration:none;">{phone}</a></td></tr>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Услуга</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">{service}</td></tr>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Желаемая дата</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">{date}</td></tr>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Время</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">{time_slot}</td></tr>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;vertical-align:top;">Комментарий</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">{comment}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Поступила</td><td style="padding:10px 12px;color:#94a3b8;font-size:12px;">{now}</td></tr>
  </table>

  <a href="tel:{phone}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">📞 Позвонить клиенту</a>

  <p style="color:#94a3b8;font-size:12px;margin-top:24px;line-height:1.6;">
    Перезвоните в течение 30 минут для подтверждения записи.
  </p>
</div>
</body></html>"""


def handler(event: dict, context) -> dict:
    """Принимает заявку на обслуживание с сайта и отправляет её менеджеру на email."""
    method = event.get("httpMethod", "POST")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if method != "POST":
        return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Method not allowed"})}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid JSON"})}

    name = (body.get("name") or "").strip()[:100]
    phone = (body.get("phone") or "").strip()[:30]
    service = (body.get("service") or "").strip()[:200]
    comment = (body.get("comment") or "").strip()[:1000]
    date = (body.get("date") or "").strip()[:50]
    time_slot = (body.get("time") or "").strip()[:20]

    if not name or not phone:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Имя и телефон обязательны"})}

    digits = re.sub(r"\D", "", phone)
    if len(digits) < 10:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Некорректный телефон"})}

    booking_id = None
    db_url = os.environ.get("DATABASE_URL", "")

    def esc(s: str) -> str:
        return (s or "").replace("'", "''")

    if db_url:
        try:
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cur:
                cur.execute(
                    f"""INSERT INTO bookings (name, phone, service, comment, booking_date, booking_time, source, email_status)
                        VALUES ('{esc(name)}', '{esc(phone)}', '{esc(service)}', '{esc(comment)}',
                                '{esc(date)}', '{esc(time_slot)}', 'site', 'pending')
                        RETURNING id"""
                )
                row = cur.fetchone()
                booking_id = row[0] if row else None
            conn.close()
        except Exception as e:
            print(f"DB save error: {e}")

    api_key = os.environ.get("SENDGRID_API_KEY", "")
    from_email = os.environ.get("SENDGRID_FROM_EMAIL", "")

    email_status = "pending"
    email_error = ""

    if not api_key or not from_email:
        email_status = "not_configured"
        email_error = "SENDGRID_API_KEY или SENDGRID_FROM_EMAIL не настроены"
    else:
        html = build_manager_html({
            "name": name, "phone": phone, "service": service,
            "comment": comment, "date": date, "time": time_slot,
        })
        ok, err = send_via_sendgrid(
            api_key, from_email, MANAGER_EMAIL,
            f"Новая заявка с сайта — {name} ({phone})",
            html,
        )
        if ok:
            email_status = "sent"
        else:
            email_status = "failed"
            email_error = err

    if booking_id and db_url:
        try:
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cur:
                cur.execute(
                    f"""UPDATE bookings SET email_status='{esc(email_status)}', email_error='{esc(email_error)}'
                        WHERE id={booking_id}"""
                )
            conn.close()
        except Exception as e:
            print(f"DB update error: {e}")

    if email_status == "failed" and not booking_id:
        return {"statusCode": 502, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не удалось отправить заявку", "details": email_error})}

    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True, "id": booking_id, "email_status": email_status})}