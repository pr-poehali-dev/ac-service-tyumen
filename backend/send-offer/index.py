import json
import os
import re
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from typing import Any

FROM_NAME = "Страйк Сервис"


SERVICES = [
    {"title": "Техническое обслуживание кондиционеров", "desc": "Плановое ТО кондиционеров по регламенту производителя. Продляем срок службы техники.", "price": "от 2 000 ₽"},
    {"title": "Монтаж/Установка кондиционеров и систем вентиляции", "desc": "Профессиональный монтаж кондиционеров и систем вентиляции под ключ любой сложности.", "price": "от 13 000 ₽"},
    {"title": "Купить кондиционеры у нас", "desc": "Широкий выбор кондиционеров от ведущих производителей с гарантией и доставкой.", "price": "от 18 000 ₽"},
    {"title": "Гарантийный сервис", "desc": "Гарантийное и постгарантийное обслуживание всех марок и моделей оборудования.", "price": "Бесплатно"},
    {"title": "Экстренный выезд", "desc": "Выезд специалиста в течение 2 часов при срочных поломках и авариях, 365 дней в году.", "price": "от 5 000 ₽"},
    {"title": "Дезинфекция систем вентиляции", "desc": "Профессиональная дезинфекция воздуховодов и систем вентиляции с выдачей официального заключения.", "price": "от 4 000 ₽"},
]

MANAGER_EMAIL = "Straikpro72.tmn@yandex.ru"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
}


def build_offer_html(name: str) -> str:
    from datetime import datetime
    months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    now = datetime.now()
    date_str = f"{now.day} {months[now.month - 1]} {now.year} г."

    rows = ""
    for i, s in enumerate(SERVICES, 1):
        rows += f"""
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-weight:700;vertical-align:top;">{i}</td>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
            <div style="font-weight:700;color:#0f172a;margin-bottom:4px;">{s['title']}</div>
            <div style="color:#64748b;font-size:13px;line-height:1.45;">{s['desc']}</div>
          </td>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:800;color:#0ea5e9;white-space:nowrap;vertical-align:top;">{s['price']}</td>
        </tr>"""

    greeting = f"Уважаемый(ая) {name}!" if name else "Уважаемый клиент!"

    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f1f5f9;">
<div style="max-width:720px;margin:0 auto;background:#ffffff;padding:32px 28px;">
  <div style="border-bottom:3px solid #0ea5e9;padding-bottom:16px;margin-bottom:24px;">
    <div style="font-size:24px;font-weight:900;color:#0ea5e9;letter-spacing:1px;">СТРАЙК <span style="color:#0f172a;">СЕРВИС</span></div>
    <div style="color:#64748b;font-size:13px;margin-top:4px;">Климатические системы под ключ • г. Тюмень</div>
  </div>

  <h1 style="font-size:24px;color:#0f172a;margin:0 0 6px;text-transform:uppercase;">Коммерческое предложение</h1>
  <div style="color:#64748b;margin-bottom:20px;">от {date_str}</div>

  <p style="color:#334155;font-size:15px;">{greeting}</p>
  <div style="background:#f0f9ff;border-left:4px solid #0ea5e9;padding:14px 18px;margin-bottom:22px;color:#334155;font-size:14px;border-radius:4px;">
    Благодарим за интерес к нашим услугам. Ниже представлен перечень работ по обслуживанию, монтажу и ремонту климатического оборудования с актуальной стоимостью.
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
    <thead>
      <tr style="background:#0f172a;color:#fff;">
        <th style="padding:12px;text-align:center;width:40px;font-size:12px;text-transform:uppercase;">№</th>
        <th style="padding:12px;text-align:left;font-size:12px;text-transform:uppercase;">Услуга</th>
        <th style="padding:12px;text-align:right;width:130px;font-size:12px;text-transform:uppercase;">Стоимость</th>
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>

  <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:22px;">
    <h3 style="margin:0 0 10px;font-size:15px;color:#0f172a;">Почему выбирают нас</h3>
    <ul style="margin:0;padding-left:20px;color:#334155;font-size:14px;line-height:1.7;">
      <li>Авторизованный сервисный центр ведущих производителей</li>
      <li>Выезд мастера в течение 2 часов, работаем 365 дней в году</li>
      <li>Гарантия на все виды работ до 3 лет</li>
      <li>Оригинальные запчасти и сертифицированные материалы</li>
      <li>Более 5000 довольных клиентов в Тюмени и области</li>
    </ul>
  </div>

  <div style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);color:#fff;border-radius:10px;padding:18px 22px;margin-bottom:22px;">
    <h3 style="margin:0 0 10px;font-size:16px;">Связаться с нами</h3>
    <div style="font-size:14px;line-height:1.8;">
      <div><b>Телефон:</b> +7 (932) 624-06-66</div>
      <div><b>Email:</b> Straikpro72.tmn@yandex.ru</div>
      <div><b>Адрес:</b> г. Тюмень, ул. Широтная, 165 к.3</div>
      <div><b>Сайт:</b> straikservis.ru</div>
    </div>
  </div>

  <div style="border-top:1px solid #e2e8f0;padding-top:14px;font-size:12px;color:#64748b;line-height:1.7;">
    <div style="color:#94a3b8;text-transform:uppercase;font-size:11px;margin-bottom:4px;">Реквизиты организации</div>
    <div><b>ООО «Страйк Сервис»</b></div>
    <div><b>ИНН / КПП:</b> 7203487449 / 720301001</div>
    <div><b>ОГРН:</b> 1197232021832</div>
    <div><b>Лицензия:</b> 72.ОЦ.04.003.Л.000033.04.26 (ЕРУЛ № Л064-00111-72/04921336)</div>
  </div>

  <div style="text-align:center;margin-top:24px;color:#94a3b8;font-size:12px;">
    Предложение действительно в течение 30 дней с даты составления
  </div>
</div>
</body></html>"""


def send_via_smtp(to_email: str, subject: str, html: str, reply_to: str = None) -> tuple[bool, str]:
    host = os.environ.get("SMTP_HOST", "").strip() or "smtp.yandex.ru"
    raw_port = (os.environ.get("SMTP_PORT", "") or "").strip()
    try:
        port = int(raw_port) if raw_port else 465
    except ValueError:
        port = 465
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASSWORD", "").strip()

    if not host or not user or not password:
        return False, "SMTP не настроен"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = formataddr((FROM_NAME, user))
    msg["To"] = to_email
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(html, "html", "utf-8"))

    try:
        if port == 465:
            ctx = ssl.create_default_context()
            with smtplib.SMTP_SSL(host, port, timeout=20, context=ctx) as server:
                server.login(user, password)
                server.sendmail(user, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(host, port, timeout=20) as server:
                server.starttls(context=ssl.create_default_context())
                server.login(user, password)
                server.sendmail(user, [to_email], msg.as_string())
        return True, "ok"
    except smtplib.SMTPAuthenticationError as e:
        return False, f"SMTP auth error: {str(e)[:200]}"
    except Exception as e:
        return False, f"SMTP error: {str(e)[:200]}"


def handler(event: dict, context) -> dict:
    """Отправляет коммерческое предложение клиенту на email и копию менеджеру."""
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
    email = (body.get("email") or "").strip().lower()[:120]
    phone = (body.get("phone") or "").strip()[:30]

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Некорректный email"})}

    if not os.environ.get("SMTP_HOST") or not os.environ.get("SMTP_USER") or not os.environ.get("SMTP_PASSWORD"):
        return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"error": "Email service is not configured"})}

    html = build_offer_html(name)

    ok, err = send_via_smtp(email, "Коммерческое предложение — Страйк Сервис", html, reply_to=MANAGER_EMAIL)
    if not ok:
        return {"statusCode": 502, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не удалось отправить письмо", "details": err})}

    manager_html = f"""<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;padding:20px;">
    <h2 style="color:#0ea5e9;">Новая заявка на КП</h2>
    <p><b>Имя:</b> {name or '—'}<br>
    <b>Email клиента:</b> {email}<br>
    <b>Телефон:</b> {phone or '—'}</p>
    <p>Коммерческое предложение уже отправлено клиенту автоматически.</p>
    </body></html>"""

    send_via_smtp(MANAGER_EMAIL, f"Заявка на КП от {name or email}", manager_html, reply_to=email)

    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True})}