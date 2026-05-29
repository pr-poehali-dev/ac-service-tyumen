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


MAX_API_BASE = "https://botapi.max.ru"


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
    "Чтобы вызвать живого менеджера, напишите «менеджер»."
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


def notify_manager(token: str, manager_chat_id: str, sender_name: str, sender_id, text: str, username: str = ""):
    if not manager_chat_id:
        return
    if username:
        link = f"https://max.ru/u/{username}"
    else:
        link = f"https://max.ru/u/{sender_id}"
    msg = (
        "💬 Новое сообщение боту в MAX\n\n"
        f"👤 Клиент: {sender_name or '—'}\n"
        f"📝 Текст: {text[:500]}\n\n"
        f"➡️ Открыть диалог с клиентом:\n{link}"
    )
    send_message(token, manager_chat_id, msg)


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

        # Старт диалога
        if update_type == "bot_started" or not text:
            send_message(token, chat_id, GREETING)
            return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

        low = text.lower()

        # Запрос менеджера
        if any(kw in low for kw in MANAGER_KEYWORDS):
            send_message(token, chat_id,
                "✅ Передал ваше сообщение менеджеру. С вами свяжутся в ближайшее время.\n\n"
                "Для срочной связи: +7 (932) 624-06-66")
            if str(sender_id) != str(manager_chat):
                notify_manager(token, manager_chat, sender_name, sender_id, text, sender_username)
            return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

        # FAQ-ответ
        answer = find_answer(text)
        if answer:
            send_message(token, chat_id, answer)
        else:
            send_message(token, chat_id,
                "Я бот «Страйк Сервис» 🤖 Понимаю ключевые слова:\n"
                "цена • выезд • адрес • гарантия • график • услуги • контакты • записаться\n\n"
                "Если нужен живой ответ — напишите «менеджер» или позвоните +7 (932) 624-06-66.")
            # Дублируем менеджеру что был непонятый запрос
            if str(sender_id) != str(manager_chat):
                notify_manager(token, manager_chat, sender_name, sender_id, text, sender_username)

        return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}

    return {"statusCode": 200, "headers": cors(), "body": json.dumps({"ok": True})}