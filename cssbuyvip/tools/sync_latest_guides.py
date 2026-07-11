import base64
import json
import lzma
import re
from pathlib import Path

PAGE = Path("cssbuyvip/index.html")
TRIGGERS = Path(".github").glob("cssbuy-sync-guides-all-langs-trigger-*.txt")
LANGS = ("en", "zh", "es", "de", "pt")

html = PAGE.read_text(encoding="utf-8")
original = html
required = (
    "const SITE_DATA = ",
    "SITE_DATA.articles[currentLang].slice(0,3)",
    "SITE_DATA.articles[currentLang].map",
    "function home()",
    "function guides()",
    "function article()",
    "category-grid",
    "product-grid",
    "featured-products",
    "latest-guides",
)
missing = [marker for marker in required if marker not in html]
if missing:
    raise SystemExit("Safety stop: missing homepage markers: " + ", ".join(missing))

trigger_files = sorted(TRIGGERS)
if not trigger_files:
    raise SystemExit("Safety stop: no article trigger payload found")
trigger = trigger_files[-1]
text = trigger.read_text(encoding="utf-8").strip()
prefix = "CSSBUY_ARTICLE_LZMA_BASE64\n"
if not text.startswith(prefix):
    raise SystemExit("Safety stop: newest trigger is not an article payload: " + str(trigger))
try:
    payload = json.loads(lzma.decompress(base64.b64decode(text[len(prefix):])).decode("utf-8"))
except Exception as exc:
    raise SystemExit("Safety stop: invalid article payload: " + str(exc))

match = re.search(r"const SITE_DATA = (\{.*?\});\nlet currentLang", html, re.S)
if not match:
    raise SystemExit("Safety stop: SITE_DATA object was not found")
data = json.loads(match.group(1))
if not isinstance(data.get("articles"), dict):
    raise SystemExit("Safety stop: SITE_DATA.articles is not an object")

slug = payload.get("en", {}).get("key")
if not slug or payload.get("en", {}).get("slug") != slug:
    raise SystemExit("Safety stop: English article key/slug is invalid")
english_body = payload["en"].get("body")
if not isinstance(english_body, list):
    raise SystemExit("Safety stop: English body is invalid")
word_count = sum(len(str(section[1]).split()) for section in english_body if isinstance(section, list) and len(section) == 2)
if not 1200 <= word_count <= 1800:
    raise SystemExit(f"Safety stop: English body word count is {word_count}")

for lang in LANGS:
    article = payload.get(lang)
    existing = data["articles"].get(lang)
    if not isinstance(article, dict) or not isinstance(existing, list):
        raise SystemExit("Safety stop: missing article data for " + lang)
    if article.get("key") != slug or article.get("slug") != slug:
        raise SystemExit("Safety stop: localized slug mismatch for " + lang)
    for field in ("title", "excerpt", "body", "seo_title", "seo_description", "tags", "publish_date"):
        if not article.get(field):
            raise SystemExit(f"Safety stop: {lang} article missing {field}")
    if not isinstance(article["body"], list) or len(article["body"]) < 4:
        raise SystemExit("Safety stop: localized body is not usable for " + lang)
    deduped = [item for item in existing if item.get("key") != slug and item.get("slug") != slug and item.get("title") != article["title"]]
    data["articles"][lang] = [article] + deduped
    if [item.get("key") for item in data["articles"][lang]].count(slug) != 1:
        raise SystemExit("Safety stop: duplicate article key in " + lang)

payload_text = json.dumps(payload, ensure_ascii=False)
if "/blog/" in payload_text:
    raise SystemExit("Safety stop: article payload must not use /blog/")
new_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
html = html[:match.start(1)] + new_json + html[match.end(1):]
for marker in required + (slug,):
    if marker not in html:
        raise SystemExit("Safety stop after update: missing marker " + marker)

if html == original:
    print("No changes needed")
else:
    PAGE.write_text(html, encoding="utf-8")
    print(f"Added {slug} to all language arrays; English body words: {word_count}; payload: {trigger.name}")
