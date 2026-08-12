from __future__ import annotations

import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
AUTO = SITE / ".automation"
ROOT_INDEX = SITE / "index.html"
ARTICLES_INDEX = SITE / "articles" / "index.html"
SITEMAP = SITE / "sitemap.xml"

# This guide was published before the dated-manifest flow was introduced.
# Keep it in the all-guides list and sitemap on every future build.
LEGACY_ORDER_GUIDE = {
    "date": "2026-08-05",
    "display_date": "August 5, 2026",
    "slug": "how-to-order-with-hipobuy-link-to-warehouse-2026",
    "title": "How to Order with HipoBuy in 2026: A Link-to-Warehouse Verification System",
    "short_title": "How to Order with HipoBuy in 2026",
    "category": "Order Workflow",
    "description": "A practical HipoBuy ordering system for verifying live product links, variants, buyer notes, warehouse evidence, and parcel compatibility.",
    "word_count": 1773,
    "cover": "guide-order-workflow.svg",
    "alt": "HipoBuy product link, purchasing note, warehouse inspection and parcel workflow guide cover image",
}


def latest_manifest() -> dict:
    manifests = sorted(AUTO.glob("20??-??-??.json"))
    if not manifests:
        raise SystemExit("No dated HipoBuyVIP guide manifest found")
    return json.loads(manifests[-1].read_text(encoding="utf-8"))


def homepage_card(m: dict) -> str:
    return f'''<a class="guide-card guide-link-card" href="/articles/{m['slug']}.html">
      <div class="guide-art"><img src="assets/{m['cover']}?v=hipobuy-{m['date'].replace('-', '')}" alt="{m['alt']}"></div>
      <div class="guide-body">
        <small>{m['category'].upper()}</small>
        <h3>{m['short_title']}</h3>
        <p>{m['description']}</p>
        <div class="guide-card-meta"><span>{m['word_count']:,} words</span><span>Read guide →</span></div>
      </div>
    </a>'''


def list_card(m: dict) -> str:
    return f'''<a class="guide-list-card" href="{m['slug']}.html">
      <div class="guide-visual"><img src="../assets/{m['cover']}?v=hipobuy-{m['date'].replace('-', '')}" alt="{m['alt']}"></div>
      <div class="guide-list-body">
        <small>{m['category'].upper()}</small>
        <h2>{m['title']}</h2>
        <p>{m['description']}</p>
        <div class="guide-list-meta"><span>{m['word_count']:,} words</span><span>Read guide →</span></div>
      </div>
    </a>'''


def patch_homepage(text: str, m: dict) -> str:
    pattern = re.compile(
        r'(<div class="guide-grid">)(.*?)(</div>\n  </div>\n</section>\n\n<section class="content-section faq")',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit("Could not locate homepage guide grid")

    old_inner = match.group(2)
    existing = re.findall(r'<a class="guide-card guide-link-card".*?</a>', old_inner, flags=re.S)
    new = homepage_card(m)
    kept = []
    for card in existing:
        if f'/articles/{m["slug"]}.html' in card:
            continue
        kept.append(card)
    # Homepage intentionally displays the newest three guides only.
    cards = [new] + kept[:2]
    replacement = match.group(1) + "\n" + "\n".join(cards) + match.group(3)
    return text[: match.start()] + replacement + text[match.end() :]


def patch_articles_index(text: str, m: dict) -> str:
    pattern = re.compile(
        r'(<div class="container guide-list-grid">)(.*?)(</div>\n</section>\n</main>)',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit("Could not locate articles guide list")

    old_inner = match.group(2)
    existing = re.findall(r'<a class="guide-list-card".*?</a>', old_inner, flags=re.S)
    new = list_card(m)
    cards = [new] + [c for c in existing if f'href="{m["slug"]}.html"' not in c]

    legacy_href = f'href="{LEGACY_ORDER_GUIDE["slug"]}.html"'
    if not any(legacy_href in card for card in cards):
        # New guide, Aug 7 guide, then the Aug 5 order guide: newest-first ordering.
        insert_at = min(2, len(cards))
        cards.insert(insert_at, list_card(LEGACY_ORDER_GUIDE))

    replacement = match.group(1) + "\n" + "\n".join(cards) + match.group(3)
    updated = text[: match.start()] + replacement + text[match.end() :]
    updated = re.sub(
        r'Information checked [A-Z][a-z]+ \d{1,2}, \d{4}\.',
        f'Information checked {m["display_date"]}.',
        updated,
    )
    return updated


def ensure_sitemap_article(text: str, article: dict, before_slug: str | None = None) -> str:
    article_url = f"https://hipobuyvip.net/articles/{article['slug']}.html"
    if article_url in text:
        return text
    block = f'''  <url>\n    <loc>{article_url}</loc>\n    <lastmod>{article['date']}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n'''
    marker = None
    if before_slug:
        marker = f'  <url>\n    <loc>https://hipobuyvip.net/articles/{before_slug}.html</loc>'
    pos = text.find(marker) if marker else -1
    if pos == -1:
        pos = text.find('</urlset>')
    return text[:pos] + block + text[pos:]


def patch_sitemap(text: str, m: dict) -> str:
    date = m["date"]
    text = re.sub(
        r'(<loc>https://hipobuyvip\.net/</loc>\s*<lastmod>)\d{4}-\d{2}-\d{2}(</lastmod>)',
        rf'\g<1>{date}\2',
        text,
        count=1,
    )
    text = re.sub(
        r'(<loc>https://hipobuyvip\.net/articles/</loc>\s*<lastmod>)\d{4}-\d{2}-\d{2}(</lastmod>)',
        rf'\g<1>{date}\2',
        text,
        count=1,
    )
    text = ensure_sitemap_article(text, m, "hipobuy-reverse-purchasing-control-point-workflow-2026")
    text = ensure_sitemap_article(text, LEGACY_ORDER_GUIDE, "hipobuy-90-day-free-storage-consolidation-guide")
    return text


def main() -> None:
    m = latest_manifest()
    required = {"date", "display_date", "slug", "title", "short_title", "category", "description", "word_count", "cover", "alt"}
    missing = required.difference(m)
    if missing:
        raise SystemExit(f"Manifest missing fields: {sorted(missing)}")

    root = ROOT_INDEX.read_text(encoding="utf-8")
    articles = ARTICLES_INDEX.read_text(encoding="utf-8")
    sitemap = SITEMAP.read_text(encoding="utf-8")

    ROOT_INDEX.write_text(patch_homepage(root, m), encoding="utf-8")
    ARTICLES_INDEX.write_text(patch_articles_index(articles, m), encoding="utf-8")
    SITEMAP.write_text(patch_sitemap(sitemap, m), encoding="utf-8")


if __name__ == "__main__":
    main()
