from __future__ import annotations

import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
AUTO = SITE / ".automation"
ROOT_INDEX = SITE / "index.html"
ARTICLES_INDEX = SITE / "articles" / "index.html"
SITEMAP = SITE / "sitemap.xml"

# This guide predates the dated-manifest flow.
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


def dated_manifests() -> list[dict]:
    manifests = []
    for path in sorted(AUTO.glob("20??-??-??.json")):
        manifests.append(json.loads(path.read_text(encoding="utf-8")))
    if not manifests:
        raise SystemExit("No dated HipoBuyVIP guide manifest found")
    return manifests


def known_guides() -> list[dict]:
    guides = dated_manifests() + [LEGACY_ORDER_GUIDE]
    by_slug = {g["slug"]: g for g in guides}
    return sorted(by_slug.values(), key=lambda g: (g["date"], g["slug"]), reverse=True)


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


def card_slug(card: str) -> str | None:
    match = re.search(r'href="(?:/articles/)?([^"/]+)\.html"', card)
    return match.group(1) if match else None


def patch_homepage(text: str, guides: list[dict]) -> str:
    pattern = re.compile(
        r'(<div class="guide-grid">)(.*?)(</div>\n  </div>\n</section>\n\n<section class="content-section faq")',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit("Could not locate homepage guide grid")

    existing = re.findall(r'<a class="guide-card guide-link-card".*?</a>', match.group(2), flags=re.S)
    known_slugs = {g["slug"] for g in guides}
    cards = [homepage_card(g) for g in guides]
    cards.extend(c for c in existing if card_slug(c) not in known_slugs)

    seen = set()
    newest = []
    for card in cards:
        slug = card_slug(card)
        if not slug or slug in seen:
            continue
        seen.add(slug)
        newest.append(card)
        if len(newest) == 3:
            break

    replacement = match.group(1) + "\n" + "\n".join(newest) + match.group(3)
    return text[: match.start()] + replacement + text[match.end() :]


def patch_articles_index(text: str, guides: list[dict]) -> str:
    pattern = re.compile(
        r'(<div class="container guide-list-grid">)(.*?)(</div>\n</section>\n</main>)',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit("Could not locate articles guide list")

    existing = re.findall(r'<a class="guide-list-card".*?</a>', match.group(2), flags=re.S)
    known_slugs = {g["slug"] for g in guides}
    cards = [list_card(g) for g in guides]
    cards.extend(c for c in existing if card_slug(c) not in known_slugs)

    seen = set()
    unique = []
    for card in cards:
        slug = card_slug(card)
        if not slug or slug in seen:
            continue
        seen.add(slug)
        unique.append(card)

    replacement = match.group(1) + "\n" + "\n".join(unique) + match.group(3)
    updated = text[: match.start()] + replacement + text[match.end() :]

    latest = guides[0]
    updated = re.sub(
        r'Information checked [A-Z][a-z]+ \d{1,2}, \d{4}\.',
        f'Information checked {latest["display_date"]}.',
        updated,
    )
    return updated


def ensure_sitemap_article(text: str, article: dict) -> str:
    article_url = f"https://hipobuyvip.net/articles/{article['slug']}.html"
    if article_url in text:
        return text

    block = f'''  <url>\n    <loc>{article_url}</loc>\n    <lastmod>{article['date']}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n'''
    marker = "  <url>\n    <loc>https://hipobuyvip.net/contact/</loc>"
    pos = text.find(marker)
    if pos == -1:
        pos = text.find("</urlset>")
    return text[:pos] + block + text[pos:]


def patch_sitemap(text: str, guides: list[dict]) -> str:
    latest = guides[0]
    date = latest["date"]

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

    for guide in guides:
        text = ensure_sitemap_article(text, guide)
    return text


def validate_manifest(m: dict) -> None:
    required = {
        "date",
        "display_date",
        "slug",
        "title",
        "short_title",
        "category",
        "description",
        "word_count",
        "cover",
        "alt",
    }
    missing = required.difference(m)
    if missing:
        raise SystemExit(f"Manifest missing fields for {m.get('slug', 'unknown')}: {sorted(missing)}")


def main() -> None:
    guides = known_guides()
    for guide in guides:
        validate_manifest(guide)

    root = ROOT_INDEX.read_text(encoding="utf-8")
    articles = ARTICLES_INDEX.read_text(encoding="utf-8")
    sitemap = SITEMAP.read_text(encoding="utf-8")

    ROOT_INDEX.write_text(patch_homepage(root, guides), encoding="utf-8")
    ARTICLES_INDEX.write_text(patch_articles_index(articles, guides), encoding="utf-8")
    SITEMAP.write_text(patch_sitemap(sitemap, guides), encoding="utf-8")


if __name__ == "__main__":
    main()
