"""
Business: Webhook для MAX-бота "СтрайкСервис". Отвечает на сообщения клиентов по ключевым словам (FAQ) и зовёт менеджера по команде.
Args: event с httpMethod, body (update от MAX), context
Returns: 200 OK всегда (MAX требует быстрый ответ)
"""
import json
import os
import re
import urllib.request
import urllib.error
import psycopg2


MAX_API_BASE = "https://botapi.max.ru"


def db_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def esc(v: str) -> str:
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"


def get_session(user_id) -> dict:
    conn = db_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            f"SELECT step, service, client_name, phone, preferred_time FROM max_bot_sessions WHERE user_id = {int(user_id)}"
        )
        row = cur.fetchone()
        if not row:
            return {"step": "idle", "service": None, "client_name": None, "phone": None, "preferred_time": None}
        return {"step": row[0], "service": row[1], "client_name": row[2], "phone": row[3], "preferred_time": row[4]}
    finally:
        conn.close()


def save_session(user_id, chat_id, step, service=None, client_name=None, phone=None, preferred_time=None):
    conn = db_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO max_bot_sessions (user_id, chat_id, step, service, client_name, phone, preferred_time, updated_at)
                VALUES ({int(user_id)}, {int(chat_id)}, {esc(step)}, {esc(service)}, {esc(client_name)}, {esc(phone)}, {esc(preferred_time)}, NOW())
                ON CONFLICT (user_id) DO UPDATE SET
                    chat_id = EXCLUDED.chat_id, step = EXCLUDED.step, service = EXCLUDED.service,
                    client_name = EXCLUDED.client_name, phone = EXCLUDED.phone,
                    preferred_time = EXCLUDED.preferred_time, updated_at = NOW()"""
        )
        conn.commit()
    finally:
        conn.close()


def reset_session(user_id, chat_id):
    save_session(user_id, chat_id, "idle", None, None, None, None)


SERVICE_OPTIONS = [
    "Техобслуживание кондиционера",
    "Монтаж/установка кондиционера",
    "Покупка кондиционера",
    "Ремонт / гарантийный сервис",
    "Экстренный выезд",
    "Дезинфекция вентиляции",
]


def services_text() -> str:
    lines = "\n".join(f"{i}. {s}" for i, s in enumerate(SERVICE_OPTIONS, 1))
    return (
        "Отлично! Давайте оформим заявку 📝\n\n"
        "Какая услуга вас интересует? Напишите номер или название:\n\n"
        f"{lines}"
    )


def match_service(text: str) -> str | None:
    t = text.strip().lower()
    if t.isdigit():
        idx = int(t)
        if 1 <= idx <= len(SERVICE_OPTIONS):
            return SERVICE_OPTIONS[idx - 1]
    keymap = {
        "Техобслуживание кондиционера": ["обслуж", "то ", "техобслуж", "профилакт", "чистк"],
        "Монтаж/установка кондиционера": ["монтаж", "установ", "поставить", "повесить"],
        "Покупка кондиционера": ["купить", "покупк", "приобрест", "продаж"],
        "Ремонт / гарантийный сервис": ["ремонт", "почин", "не работает", "сломал", "гаранти", "не охлаж", "течет", "течёт"],
        "Экстренный выезд": ["экстрен", "срочн", "авари", "сейчас"],
        "Дезинфекция вентиляции": ["дезинфек", "вентиляц", "воздуховод", "запах"],
    }
    for service, kws in keymap.items():
        for kw in kws:
            if kw in t:
                return service
    return None


def cors() -> dict:
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }


def send_message(token: str, chat_id, text: str) -> tuple[int, dict]:
    try:
        data = json.dumps({"text": text}).encode("utf-8")
        req = urllib.request.Request(
            f"{MAX_API_BASE}/messages?chat_id={chat_id}",
            data=data, method="POST",
            headers={"Content-Type": "application/json", "Authorization": token},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, {}
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8", errors="replace"))
        except Exception:
            return e.code, {}
    except Exception as e:
        return 0, {"error": str(e)[:200]}


GREETING = (
    "Здравствуйте! Я бот компании «Страйк Сервис» 🛠\n\n"
    "Помогу с информацией:\n"
    "• Напишите «цена» — стоимость услуг\n"
    "• «выезд» — условия выезда мастера\n"
    "• «адрес» — где мы находимся\n"
    "• «гарантия» — про гарантию\n"
    "• «график» — часы работы\n"
    "• «услуги» — что мы делаем\n"
    "• «контакты» — телефон и email\n\n"
    "📝 Чтобы оставить заявку и чтобы менеджер перезвонил — напишите «заявка» или «менеджер»."
)

ANSWERS = [
    (
        ["цена", "цены", "стоимост", "прайс", "сколько стоит", "стоит"],
        "💰 Наши цены:\n\n"
        "• ТО кондиционера — от 2 000 ₽\n"
        "• Монтаж кондиционера — от 13 000 ₽\n"
        "• Покупка кондиционера — от 18 000 ₽\n"
        "• Экстренный выезд — от 5 000 ₽\n"
        "• Дезинфекция вентиляции — от 4 000 ₽\n"
        "• Гарантийный сервис — бесплатно\n\n"
        "Точную смету посчитаем после диагностики. Напишите «менеджер» для расчёта."
    ),
    (
        ["выезд", "приехать", "приедет", "вызват", "выезжа"],
        "🚗 Выезд мастера в Тюмени и области:\n\n"
        "• По городу — в течение 2 часов\n"
        "• Работаем 365 дней в году\n"
        "• Экстренный выезд — круглосуточно\n\n"
        "Для вызова: +7 (932) 624-06-66 или напишите «менеджер»."
    ),
    (
        ["адрес", "где наход", "офис", "куда подъе", "приехать к вам"],
        "📍 Наш адрес:\n"
        "г. Тюмень, ул. Широтная, 165 к.3\n\n"
        "Телефон: +7 (932) 624-06-66"
    ),
    (
        ["гарант"],
        "🛡 Гарантия:\n\n"
        "• На монтаж — до 3 лет\n"
        "• На ремонт — до 1 года\n"
        "• На запчасти — производителя\n\n"
        "Все работы документируются актом."
    ),
    (
        ["график", "режим", "часы работ", "когда работ", "выходн"],
        "🕘 График работы:\n\n"
        "Пн–Вс: круглосуточно\n"
        "Экстренные вызовы — 365 дней в году\n"
        "Офис: 9:00–20:00"
    ),
    (
        ["услуг", "что делает", "чем занимает", "что умеет"],
        "🔧 Наши услуги:\n\n"
        "1. Техническое обслуживание кондиционеров\n"
        "2. Монтаж/установка кондиционеров и вентиляции\n"
        "3. Продажа кондиционеров\n"
        "4. Гарантийный сервис\n"
        "5. Экстренный выезд\n"
        "6. Дезинфекция систем вентиляции\n\n"
        "Подробнее: straikservis.ru"
    ),
    (
        ["контакт", "телефон", "позвонить", "номер", "email", "почт", "связаться"],
        "📞 Контакты «Страйк Сервис»:\n\n"
        "Телефон: +7 (932) 624-06-66\n"
        "Email: Straikpro72.tmn@yandex.ru\n"
        "Адрес: г. Тюмень, ул. Широтная, 165 к.3\n"
        "Сайт: straikservis.ru"
    ),
    (
        ["записать", "запись", "записаться", "забронир"],
        "📅 Записаться на обслуживание:\n\n"
        "1) На сайте: straikservis.ru/#booking — выбор даты и времени онлайн\n"
        "2) По телефону: +7 (932) 624-06-66\n"
        "3) Напишите «менеджер» — свяжемся с вами"
    ),
    (
        ["спасибо", "благодарю"],
        "Всегда пожалуйста! 🤝 Если будут вопросы — пишите."
    ),
    (
        ["привет", "здравствуй", "добрый день", "добрый вечер", "доброе утро", "здаров"],
        GREETING
    ),
    (
        ["помощь", "help", "/help", "/start", "старт"],
        GREETING
    ),
]

MANAGER_KEYWORDS = ["менеджер", "оператор", "живой человек", "сотрудник", "консультант", "позовите", "помогите"]


def find_answer(text: str) -> str | None:
    low = text.lower().strip()
    if not low:
        return None
    for keywords, answer in ANSWERS:
        for kw in keywords:
            if kw in low:
                return answer
    return None


def extract_phone(text: str) -> str:
    digits = re.sub(r"[^\d+]", "", text or "")
    m = re.search(r"(\+?\d[\d]{9,14})", digits)
    if not m:
        return ""
    num = m.group(1)
    raw = re.sub(r"\D", "", num)
    if len(raw) == 11 and raw[0] in ("7", "8"):
        return "+7" + raw[1:]
    if len(raw) == 10:
        return "+7" + raw
    if num.startswith("+"):
        return num
    return "+" + raw


def notify_manager(token: str, manager_chat_id: str, sender_name: str, sender_id, text: str, phone: str = ""):
    if not manager_chat_id:
        return
    lines = [
        "💬 Новое обращение в MAX-боте\n",
        f"👤 Клиент: {sender_name or '—'}",
        f"📝 Сообщение: {text[:500]}",
    ]
    if phone:
        lines.append(f"\n📞 Телефон клиента: {phone}")
        lines.append(f"☎️ Позвонить: tel:{phone}")
    else:
        lines.append("\n📞 Телефон клиент пока не оставил — бот запросил его.")
    send_message(token, manager_chat_id, "\n".join(lines))


def notify_lead(token: str, manager_chat_id: str, sess: dict, sender_name: str):
    if not manager_chat_id:
        return
    phone = sess.get("phone") or ""
    lines = [
        "🔥 НОВАЯ ЗАЯВКА из MAX-бота\n",
        f"🛠 Услуга: {sess.get('service') or '—'}",
        f"👤 Имя: {sess.get('client_name') or sender_name or '—'}",
        f"📞 Телефон: {phone or '—'}",
        f"🕒 Удобное время: {sess.get('preferred_time') or '—'}",
    ]
    if phone:
        lines.append(f"\n☎️ Позвонить: tel:{phone}")
    send_message(token, manager_chat_id, "\n".join(lines))


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    token = os.environ.get("MAX_BOT_TOKEN", "").strip()
    manager_chat = os.environ.get("MAX_CHAT_ID", "").strip()

    if event.get("httpMethod") == "GET":
        return {"statusCode": 200, "headers": cors(),
                "body": json.dumps({"ok": True, "service": "max-webhook"})}

    if not token:
        return {"statusCode": 200, "headers": cors(),
                "body": json.dumps({"ok": False, "error": "no token"})}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

    update_type = body.get("update_type") or body.get("type")

    if update_type in ("message_created", "bot_started"):
        msg = body.get("message") or {}
        sender = msg.get("sender") or {}
        recipient = msg.get("recipient") or {}
        body_part = msg.get("body") or {}
        text = (body_part.get("text") or "").strip()
        chat_id = recipient.get("chat_id") or sender.get("user_id")
        sender_id = sender.get("user_id")
        sender_name = sender.get("name") or sender.get("first_name") or "—"
        sender_username = sender.get("username") or ""

        # Не отвечаем самому себе
        if sender.get("is_bot"):
            return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

        if not chat_id:
            return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

        ok_resp = {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

        # Старт диалога
        if update_type == "bot_started" or not text:
            reset_session(sender_id, chat_id)
            send_message(token, chat_id, GREETING)
            return ok_resp

        low = text.lower()

        try:
            sess = get_session(sender_id)
        except Exception:
            sess = {"step": "idle"}
        step = sess.get("step", "idle")

        # Отмена в любой момент
        if low in ("отмена", "отменить", "стоп", "/cancel", "хватит"):
            reset_session(sender_id, chat_id)
            send_message(token, chat_id, "Заявка отменена. Если что — пишите «заявка», и начнём заново 🙂")
            return ok_resp

        START_LEAD_KW = ["заявка", "заявку", "оставить заявку", "записать", "запись", "записаться", "оформить"]

        # === Пошаговый сбор заявки ===
        if step == "service":
            service = match_service(text)
            if not service:
                send_message(token, chat_id,
                    "Не совсем понял услугу 🤔 Напишите, пожалуйста, номер из списка (1–6) или название:\n\n"
                    + "\n".join(f"{i}. {s}" for i, s in enumerate(SERVICE_OPTIONS, 1)))
                return ok_resp
            save_session(sender_id, chat_id, "name", service=service)
            send_message(token, chat_id, f"Записал: «{service}» ✅\n\nКак к вам обращаться? Напишите ваше имя.")
            return ok_resp

        if step == "name":
            name = text.strip()[:80]
            save_session(sender_id, chat_id, "phone", service=sess.get("service"), client_name=name)
            send_message(token, chat_id,
                f"Приятно познакомиться, {name}! 📞\n\nОставьте номер телефона для связи (например: +7 900 123-45-67).")
            return ok_resp

        if step == "phone":
            phone = extract_phone(text)
            if not phone:
                send_message(token, chat_id,
                    "Не похоже на номер телефона 🤔 Напишите его в формате +7 900 123-45-67.")
                return ok_resp
            save_session(sender_id, chat_id, "time",
                         service=sess.get("service"), client_name=sess.get("client_name"), phone=phone)
            send_message(token, chat_id,
                "Отлично! 🕒 В какое время вам удобно, чтобы менеджер перезвонил?\n\n"
                "Например: «сегодня после 18:00» или «завтра утром». Можно написать «в любое».")
            return ok_resp

        if step == "time":
            pref = text.strip()[:120]
            sess["preferred_time"] = pref
            sess["step"] = "idle"
            save_session(sender_id, chat_id, "idle",
                         service=sess.get("service"), client_name=sess.get("client_name"),
                         phone=sess.get("phone"), preferred_time=pref)
            send_message(token, chat_id,
                "Спасибо! 🎉 Заявка оформлена.\n\n"
                f"🛠 Услуга: {sess.get('service')}\n"
                f"👤 Имя: {sess.get('client_name')}\n"
                f"📞 Телефон: {sess.get('phone')}\n"
                f"🕒 Время: {pref}\n\n"
                "Менеджер свяжется с вами в указанное время. Срочная связь: +7 (932) 624-06-66.")
            if str(sender_id) != str(manager_chat):
                notify_lead(token, manager_chat, sess, sender_name)
            reset_session(sender_id, chat_id)
            return ok_resp

        # === Старт заявки ===
        if any(kw in low for kw in START_LEAD_KW) or any(kw in low for kw in MANAGER_KEYWORDS):
            save_session(sender_id, chat_id, "service")
            send_message(token, chat_id, services_text())
            return ok_resp

        # Клиент сразу прислал телефон вне сценария
        phone = extract_phone(text)
        if phone:
            send_message(token, chat_id,
                "✅ Спасибо! Ваш телефон передан менеджеру — мы перезвоним в ближайшее время.\n\n"
                "Для срочной связи: +7 (932) 624-06-66")
            if str(sender_id) != str(manager_chat):
                notify_manager(token, manager_chat, sender_name, sender_id, text, phone)
            return ok_resp

        # FAQ-ответ
        answer = find_answer(text)
        if answer:
            send_message(token, chat_id, answer)
        else:
            send_message(token, chat_id,
                "Я бот «Страйк Сервис» 🤖 Понимаю ключевые слова:\n"
                "цена • выезд • адрес • гарантия • график • услуги • контакты\n\n"
                "📝 Хотите оставить заявку? Напишите «заявка» — задам пару вопросов и передам менеджеру.\n"
                "Срочная связь: +7 (932) 624-06-66.")
            if str(sender_id) != str(manager_chat):
                notify_manager(token, manager_chat, sender_name, sender_id, text, "")

        return ok_resp

    return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}