"""
Business: Отправляет уведомления о новых заявках в MAX-мессенджер через Bot API.
Args: event с httpMethod, body (заявка), context
Returns: JSON со статусом отправки и chat_id
"""
import json
import os
import urllib.request
import urllib.error


MAX_API_BASE = "https://botapi.max.ru"


def cors_headers() -> dict:
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }


def http_request(method: str, url: str, body: dict | None = None, token: str | None = None) -> tuple[int, dict]:
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = token
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            txt = resp.read().decode("utf-8", errors="replace")
            try:
                return resp.status, json.loads(txt)
            except Exception:
                return resp.status, {"raw": txt}
    except urllib.error.HTTPError as e:
        txt = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(txt)
        except Exception:
            return e.code, {"raw": txt}
    except Exception as e:
        return 0, {"error": str(e)}


def get_chat_id_from_updates(token: str) -> tuple[str | None, dict]:
    """Достаёт chat_id из последнего сообщения или из списка чатов."""
    # Способ 1 — updates
    status, data = http_request("GET", f"{MAX_API_BASE}/updates?limit=100&timeout=0", token=token)
    if status == 200:
        updates = data.get("updates") or []
        for upd in reversed(updates):
            msg = upd.get("message") or {}
            recipient = msg.get("recipient") or {}
            chat_id = recipient.get("chat_id") or recipient.get("user_id")
            if chat_id:
                return str(chat_id), {"source": "updates", "updates_count": len(updates)}
            sender = msg.get("sender") or {}
            sid = sender.get("user_id")
            if sid:
                return str(sid), {"source": "updates_sender", "updates_count": len(updates)}

    # Способ 2 — список чатов где бот состоит
    status2, data2 = http_request("GET", f"{MAX_API_BASE}/chats?count=50", token=token)
    if status2 == 200:
        chats = data2.get("chats") or []
        for ch in chats:
            chat_id = ch.get("chat_id")
            if chat_id:
                return str(chat_id), {"source": "chats", "chats_count": len(chats), "chat_type": ch.get("type")}
        return None, {"source": "chats_empty", "chats_count": 0, "raw": data2}

    return None, {"source": "all_failed", "updates_status": status, "chats_status": status2,
                  "updates_raw": data, "chats_raw": data2}


def send_max_message(token: str, chat_id: str, text: str) -> tuple[bool, dict]:
    """Отправка текстового сообщения через MAX Bot API."""
    url = f"{MAX_API_BASE}/messages?chat_id={chat_id}"
    status, data = http_request("POST", url, {"text": text}, token=token)
    return (200 <= status < 300), {"status": status, "response": data}


def format_booking(b: dict) -> str:
    lines = [
        "🔔 Новая заявка с сайта",
        "",
        f"👤 Имя: {b.get('name', '—')}",
        f"📞 Телефон: {b.get('phone', '—')}",
        f"🔧 Услуга: {b.get('service') or 'Не указана'}",
    ]
    if b.get("date") or b.get("time"):
        lines.append(f"📅 Дата/время: {b.get('date', '—')} {b.get('time', '')}".strip())
    if b.get("comment"):
        lines.append(f"💬 Комментарий: {b.get('comment')}")
    if b.get("id"):
        lines.append("")
        lines.append(f"ID заявки: #{b.get('id')}")
    return "\n".join(lines)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    token = os.environ.get("MAX_BOT_TOKEN", "").strip()
    if not token:
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps({"ok": False, "error": "MAX_BOT_TOKEN не задан"}),
        }

    method = event.get("httpMethod", "POST")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    if method == "GET" and action == "diagnose":
        chat_id_env = os.environ.get("MAX_CHAT_ID", "").strip()
        status, me = http_request("GET", f"{MAX_API_BASE}/me", token=token)
        chat_id, info = get_chat_id_from_updates(token)
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps({
                "token_len": len(token),
                "me_status": status,
                "me": me,
                "chat_id_from_env": chat_id_env or None,
                "chat_id_from_updates": chat_id,
                "updates_info": info,
            }, ensure_ascii=False),
        }

    if method == "GET" and action == "test":
        chat_id = os.environ.get("MAX_CHAT_ID", "").strip()
        if not chat_id:
            chat_id, _ = get_chat_id_from_updates(token)
        if not chat_id:
            return {"statusCode": 200, "headers": cors_headers(),
                    "body": json.dumps({"ok": False, "error": "chat_id неизвестен — напиши боту в MAX любое сообщение"})}
        ok, resp = send_max_message(token, chat_id, "✅ Тестовое сообщение от Страйк Сервис")
        return {"statusCode": 200, "headers": cors_headers(),
                "body": json.dumps({"ok": ok, "chat_id": chat_id, "response": resp}, ensure_ascii=False)}

    if method == "POST":
        try:
            body = json.loads(event.get("body") or "{}")
        except Exception:
            return {"statusCode": 400, "headers": cors_headers(),
                    "body": json.dumps({"ok": False, "error": "Invalid JSON"})}

        chat_id = (body.get("chat_id") or os.environ.get("MAX_CHAT_ID", "")).strip()
        if not chat_id:
            chat_id, _ = get_chat_id_from_updates(token)
        if not chat_id:
            return {"statusCode": 200, "headers": cors_headers(),
                    "body": json.dumps({"ok": False, "error": "chat_id неизвестен"})}

        text = body.get("text") or format_booking(body)
        ok, resp = send_max_message(token, chat_id, text)
        return {"statusCode": 200, "headers": cors_headers(),
                "body": json.dumps({"ok": ok, "chat_id": chat_id, "response": resp}, ensure_ascii=False)}

    return {"statusCode": 405, "headers": cors_headers(),
            "body": json.dumps({"error": "Method not allowed"})}