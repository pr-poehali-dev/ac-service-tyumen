"""
Business: ИИ-генератор SEO-статей для блога. GET — список статей, POST с action=generate — нейросеть пишет новую статью по теме и сохраняет в БД.
Args: event с httpMethod, queryStringParameters (slug), body (action, topic, admin_password), context
Returns: JSON со списком статей или сгенерированной статьёй
"""
import json
import os
import re
import urllib.request
import urllib.error
import psycopg2


def cors() -> dict:
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
        "Content-Type": "application/json",
    }


def db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def esc(v) -> str:
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"


def slugify(title: str) -> str:
    translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-',
    }
    s = "".join(translit.get(c, c) for c in title.lower())
    s = re.sub(r"[^a-z0-9\-]", "", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:140] or "statya"


def list_articles(slug=None):
    conn = db()
    try:
        cur = conn.cursor()
        if slug:
            cur.execute(
                f"SELECT slug, title, category, seo_description, keywords, intro, sections, image, created_at "
                f"FROM seo_articles WHERE slug = {esc(slug)} AND published = TRUE"
            )
        else:
            cur.execute(
                "SELECT slug, title, category, seo_description, keywords, intro, sections, image, created_at "
                "FROM seo_articles WHERE published = TRUE ORDER BY created_at DESC LIMIT 50"
            )
        rows = cur.fetchall()
        out = []
        for r in rows:
            out.append({
                "slug": r[0], "title": r[1], "category": r[2], "seoText": r[3],
                "keywords": r[4], "intro": r[5],
                "sections": r[6] if isinstance(r[6], list) else json.loads(r[6] or "[]"),
                "image": r[7], "date": r[8].strftime("%d.%m.%Y") if r[8] else "",
            })
        return out
    finally:
        conn.close()


def generate_article(topic: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY не настроен")

    system = (
        "Ты — SEO-копирайтер компании «Страйк Сервис» из Тюмени, которая занимается "
        "монтажом, обслуживанием и ремонтом кондиционеров и систем вентиляции. "
        "Пиши экспертные, полезные, уникальные статьи на русском языке для блога. "
        "Естественно упоминай Тюмень и услуги компании. Верни СТРОГО JSON."
    )
    user = (
        f"Напиши SEO-статью на тему: «{topic}».\n"
        "Формат ответа — JSON-объект со строго такими полями:\n"
        '{\n'
        '  "title": "заголовок статьи (до 70 символов, с упоминанием Тюмени где уместно)",\n'
        '  "category": "короткая категория, 1-2 слова",\n'
        '  "seo_description": "мета-описание до 160 символов",\n'
        '  "keywords": "5-7 ключевых фраз через запятую с упоминанием Тюмени",\n'
        '  "intro": "вводный абзац 2-3 предложения",\n'
        '  "sections": [ {"heading": "подзаголовок", "body": "2-4 абзаца текста"} ]\n'
        '}\n'
        "Сделай 4-5 секций. Только валидный JSON без markdown."
    )

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.7,
        "response_format": {"type": "json_object"},
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload, method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = data["choices"][0]["message"]["content"]
    article = json.loads(content)

    title = (article.get("title") or topic)[:160]
    slug = slugify(title)

    conn = db()
    try:
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM seo_articles WHERE slug = {esc(slug)}")
        if cur.fetchone():
            slug = slug[:130] + "-" + os.urandom(2).hex()
        sections = json.dumps(article.get("sections", []), ensure_ascii=False)
        cur.execute(
            f"""INSERT INTO seo_articles (slug, title, category, seo_description, keywords, intro, sections, image)
                VALUES ({esc(slug)}, {esc(title)}, {esc(article.get('category', 'Статья'))},
                        {esc(article.get('seo_description', ''))}, {esc(article.get('keywords', ''))},
                        {esc(article.get('intro', ''))}, {esc(sections)}, NULL)
                RETURNING slug"""
        )
        new_slug = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    return {"slug": new_slug, "title": title}


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    params = event.get("queryStringParameters") or {}

    if method == "GET" and params.get("format") == "sitemap":
        conn = db()
        try:
            cur = conn.cursor()
            cur.execute("SELECT slug FROM seo_articles WHERE published = TRUE ORDER BY created_at DESC")
            slugs = [r[0] for r in cur.fetchall()]
        finally:
            conn.close()
        urls = "".join(
            f"<url><loc>https://straikservis.ru/blog/{s}</loc>"
            f"<changefreq>monthly</changefreq><priority>0.6</priority></url>"
            for s in slugs
        )
        xml = (
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            f"{urls}</urlset>"
        )
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/xml"},
            "body": xml,
        }

    if method == "GET":
        slug = params.get("slug")
        articles = list_articles(slug)
        if slug:
            if not articles:
                return {"statusCode": 404, "headers": cors(), "body": json.dumps({"error": "not found"})}
            return {"statusCode": 200, "headers": cors(), "body": json.dumps(articles[0], ensure_ascii=False)}
        return {"statusCode": 200, "headers": cors(), "body": json.dumps({"articles": articles}, ensure_ascii=False)}

    if method == "POST":
        try:
            body = json.loads(event.get("body") or "{}")
        except Exception:
            return {"statusCode": 400, "headers": cors(), "body": json.dumps({"error": "invalid json"})}

        admin_pwd = os.environ.get("ADMIN_PASSWORD", "")
        if body.get("admin_password") != admin_pwd or not admin_pwd:
            return {"statusCode": 403, "headers": cors(), "body": json.dumps({"error": "Доступ запрещён"})}

        if body.get("action") == "generate":
            topic = (body.get("topic") or "").strip()
            if not topic:
                return {"statusCode": 400, "headers": cors(), "body": json.dumps({"error": "Укажите тему статьи"})}
            try:
                result = generate_article(topic)
            except urllib.error.HTTPError as e:
                detail = e.read().decode("utf-8", errors="replace")[:300]
                return {"statusCode": 502, "headers": cors(),
                        "body": json.dumps({"error": "Ошибка нейросети", "details": detail}, ensure_ascii=False)}
            except Exception as e:
                return {"statusCode": 500, "headers": cors(),
                        "body": json.dumps({"error": str(e)[:300]}, ensure_ascii=False)}
            return {"statusCode": 200, "headers": cors(),
                    "body": json.dumps({"success": True, **result}, ensure_ascii=False)}

        return {"statusCode": 400, "headers": cors(), "body": json.dumps({"error": "unknown action"})}

    return {"statusCode": 405, "headers": cors(), "body": json.dumps({"error": "method not allowed"})}