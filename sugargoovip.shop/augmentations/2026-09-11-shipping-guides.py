#!/usr/bin/env python3
"""Publish the USA shipping and shipping-calculator guides into an extracted site."""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: 2026-09-11-shipping-guides.py EXTRACTED_SITE")

ROOT = Path(sys.argv[1])
DATA_DIR = Path(__file__).resolve().parent.parent / "article-data"
DATA_FILES = [
    DATA_DIR / "2026-09-11-shipping-calculator.json",
    DATA_DIR / "2026-09-10-shipping-to-usa.json",
]
ARTICLES = [json.loads(path.read_text(encoding="utf-8")) for path in DATA_FILES]


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def slug_id(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def public_slug(article: dict) -> str:
    return article["SLUG"].removesuffix(".html")


def prose_word_count(article: dict) -> int:
    text = " ".join(
        paragraph
        for section in article["SECTIONS"]
        for paragraph in section["paragraphs"]
    )
    text += " " + " ".join(question + " " + answer for question, answer in article["FAQ"])
    return len(re.findall(r"\b[\w’'-]+\b", text))


def update_first_jsonld(page: str, update) -> str:
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    if not match:
        raise RuntimeError("JSON-LD block not found")
    data = update(json.loads(match.group(1)))
    encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return page[: match.start(1)] + encoded + page[match.end(1) :]


def article_schema(article: dict, word_count: int) -> dict:
    slug = public_slug(article)
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": article["TITLE"],
                "description": article["META"],
                "datePublished": article["DATE"],
                "dateModified": article["DATE"],
                "wordCount": word_count,
                "inLanguage": "en",
                "keywords": ", ".join(article["TAGS"]),
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": f"https://sugargoovip.shop/{slug}",
                },
                "author": {"@type": "Organization", "name": "SugargooVIP Editorial Team"},
                "publisher": {
                    "@type": "Organization",
                    "name": "SugargooVIP",
                    "url": "https://sugargoovip.shop/",
                },
                "citation": article["SOURCES"],
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sugargoovip.shop/"},
                    {"@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": "https://sugargoovip.shop/guides"},
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": article["SHORT"],
                        "item": f"https://sugargoovip.shop/{slug}",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": question,
                        "acceptedAnswer": {"@type": "Answer", "text": answer},
                    }
                    for question, answer in article["FAQ"]
                ],
            },
        ],
    }


def render_article(article: dict) -> None:
    word_count = prose_word_count(article)
    if not 1500 <= word_count <= 1800:
        raise RuntimeError(f'{article["SLUG"]} word count out of range: {word_count}')
    if len(article["FAQ"]) != 10:
        raise RuntimeError(f'{article["SLUG"]} must contain exactly 10 FAQs')

    template = (ROOT / "guide-sugargoo-sensitive-prohibited-items.html").read_text(encoding="utf-8")
    slug = public_slug(article)
    seo_title = article.get("SEO_TITLE", article["TITLE"])
    metadata_replacements = [
        (r"<title>.*?</title>", f"<title>{esc(seo_title)} | SugargooVIP</title>"),
        (r'<meta content="[^"]*" name="description"/>', f'<meta content="{esc(article["META"])}" name="description"/>'),
        (r'<link href="https://sugargoovip\.shop/[^"]+" rel="canonical"/>', f'<link href="https://sugargoovip.shop/{slug}" rel="canonical"/>'),
        (r'<meta content="[^"]*" property="og:title"/>', f'<meta content="{esc(article["TITLE"])}" property="og:title"/>'),
        (r'<meta content="[^"]*" property="og:description"/>', f'<meta content="{esc(article["META"])}" property="og:description"/>'),
        (r'<meta content="https://sugargoovip\.shop/[^"]+" property="og:url"/>', f'<meta content="https://sugargoovip.shop/{slug}" property="og:url"/>'),
    ]
    for pattern, replacement in metadata_replacements:
        template, count = re.subn(pattern, replacement, template, count=1, flags=re.S)
        if count != 1:
            raise RuntimeError(f"metadata pattern missing: {pattern}")

    schema = json.dumps(article_schema(article, word_count), ensure_ascii=False, separators=(",", ":"))
    template, count = re.subn(
        r'<script type="application/ld\+json">.*?</script>',
        f'<script type="application/ld+json">{schema}</script>',
        template,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise RuntimeError("article schema replacement failed")
    template = re.sub(
        r"Facts checked [A-Z][a-z]+ \d{1,2}, 2026 · Independent buyer resource",
        f'Facts checked {article["DISPLAY"]} · Independent buyer resource',
        template,
        count=1,
    )

    hero = (
        '<section class="article-hero"><div class="frame article-hero-grid"><div>'
        f'<span class="article-label">{esc(article["LABEL"])} · Fact checked</span>'
        f'<h1>{esc(article["TITLE"])}</h1><p class="article-deck">{esc(article["DECK"])}</p>'
        f'<div class="article-meta"><span>Published {esc(article["DISPLAY"])}</span>'
        f'<span>12 min read</span><span>{word_count:,} words</span></div></div>'
        '<div class="article-hero-card"><small>Independent buyer guide</small>'
        f'<strong>{esc(article["HERO_NUMBER"])}</strong><p>{esc(article["HERO_NOTE"])}</p>'
        '</div></div></section>'
    )
    template, count = re.subn(r'<section class="article-hero">.*?</section>', hero, template, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError("article hero replacement failed")

    toc = "".join(
        f'<a href="#{slug_id(section["heading"])}">{index:02d}. {esc(section["heading"])}</a>'
        for index, section in enumerate(article["SECTIONS"], 1)
    ) + '<a href="#faq">FAQ</a>'
    body = "".join(
        f'<section><h2 id="{slug_id(section["heading"])}">{esc(section["heading"])}</h2>'
        + "".join(f'<p>{esc(paragraph)}</p>' for paragraph in section["paragraphs"])
        + "</section>"
        for section in article["SECTIONS"]
    )
    faq = "".join(
        f'<details><summary>{esc(question)}</summary><p>{esc(answer)}</p></details>'
        for question, answer in article["FAQ"]
    )
    tags = "".join(f'<span>{esc(tag)}</span>' for tag in article["TAGS"])
    related = (
        '<div class="article-bottom-nav">'
        '<a href="/shipping">Shipping overview</a>'
        '<a href="/guide-shipping-cost">Shipping cost guide</a>'
        '<a href="/guides">All buyer guides →</a></div>'
    )
    shell = (
        '<div class="frame article-shell"><aside class="article-toc"><span>On this page</span>'
        f'<nav>{toc}</nav></aside><article class="article-main">'
        f'<p class="article-intro">{esc(article["INTRO"])}</p>'
        f'<div class="article-factbox"><b>Research standard</b><p>{esc(article["FACTBOX"])}</p></div>'
        f'{body}<section class="article-faq" id="faq"><h2>FAQ: {esc(article["SHORT"])}</h2>{faq}</section>'
        f'<div class="article-tags">{tags}</div>{related}</article></div>'
    )
    template, count = re.subn(
        r'<div class="frame article-shell">.*?</div></main>',
        shell + "</main>",
        template,
        count=1,
        flags=re.S,
    )
    if count != 1 or template.count("<details>") != 10:
        raise RuntimeError("article content replacement failed")
    (ROOT / article["SLUG"]).write_text(template, encoding="utf-8")


def guide_card(article: dict, index: int) -> str:
    count = prose_word_count(article)
    slug = public_slug(article)
    return (
        f'<article><a class="guide-directory-cover {esc(article["DIRECTORY_CLASS"])}" href="/{slug}">'
        f'<span>{esc(article["DIRECTORY_LABEL"])}</span><b>{index:02d}</b></a>'
        f'<div class="guide-directory-body"><h2><a href="/{slug}">{esc(article["TITLE"])}</a></h2>'
        f'<p>{esc(article["META"])}</p><div class="guide-directory-meta">'
        f'<span>{esc(article["DISPLAY"])}</span><span>12 min read</span></div>'
        f'<a href="/{slug}">Read the full {count:,}-word guide →</a></div></article>'
    )


def patch_guides() -> None:
    path = ROOT / "guides.html"
    page = path.read_text(encoding="utf-8")

    def update(data: dict) -> dict:
        entity = data["mainEntity"]
        new_urls = {f'https://sugargoovip.shop/{public_slug(article)}' for article in ARTICLES}
        items = [item for item in entity["itemListElement"] if item["item"]["url"] not in new_urls]
        newest = [
            {
                "@type": "ListItem",
                "position": index,
                "item": {
                    "@type": "Article",
                    "headline": article["TITLE"],
                    "url": f'https://sugargoovip.shop/{public_slug(article)}',
                    "datePublished": article["DATE"],
                },
            }
            for index, article in enumerate(ARTICLES, 1)
        ]
        items = newest + items
        for index, item in enumerate(items, 1):
            item["position"] = index
        entity["numberOfItems"] = len(items)
        entity["itemListElement"] = items
        return data

    page = update_first_jsonld(page, update)
    page = re.sub(
        r"<title>.*?</title>",
        "<title>Sugargoo Buyer Guides 2026: Shipping Calculator, USA Routes, QC & W2C</title>",
        page,
        count=1,
        flags=re.S,
    )
    page = re.sub(
        r'<meta content="[^"]*" name="description"/>',
        '<meta content="Read seventeen original Sugargoo buyer guides covering the shipping calculator, USA routes, restricted items, customs, tracking, QC and W2C." name="description"/>',
        page,
        count=1,
    )
    page = re.sub(r"Facts checked [A-Z][a-z]+ \d{1,2}, 2026", "Facts checked September 11, 2026", page)
    page, count = re.subn(
        r"<p>(?:Fourteen|Fifteen|Sixteen|Seventeen|14|15|16|17) long-form reverse-shopping guides.*?</p>",
        "<p>Seventeen long-form reverse-shopping guides written from scratch after checking Sugargoo's current official documentation. Every historical article remains available, newest first.</p>",
        page,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise RuntimeError("guide introduction not found")
    start = page.index('<div class="guide-directory">') + len('<div class="guide-directory">')
    end = page.index("</div></div></main>", start)
    block = page[start:end]
    for article in ARTICLES:
        slug = public_slug(article)
        block = re.sub(
            rf'<article>.*?href="/{re.escape(slug)}".*?</article>',
            "",
            block,
            flags=re.S,
        )
    block = "".join(guide_card(article, index) for index, article in enumerate(ARTICLES, 1)) + block
    counter = iter(range(1, 100))
    block = re.sub(r"<b>\d{2}</b>", lambda _: f"<b>{next(counter):02d}</b>", block)
    page = page[:start] + block + page[end:]
    path.write_text(page, encoding="utf-8")


def home_card(article: dict, featured: bool = False) -> str:
    slug = public_slug(article)
    featured_class = " latest-guide-featured" if featured else ""
    badge = '<span class="latest-guide-badge">Latest guide</span>' if featured else ""
    if "calculator" in slug:
        svg = '<svg aria-hidden="true" viewBox="0 0 220 160"><rect x="55" y="24" width="110" height="112" rx="14"></rect><path d="M76 48h68v22H76zM78 92h12m18 0h12m18 0h12M78 116h12m18 0h12m18 0h12"></path></svg>'
    elif "usa" in slug:
        svg = '<svg aria-hidden="true" viewBox="0 0 220 160"><path d="M48 112h124M58 112V72l52-30 52 30v40M83 112V85h54v27"></path><path d="M110 42v70"></path></svg>'
    else:
        svg = '<svg aria-hidden="true" viewBox="0 0 220 160"><path d="M52 48h116v78H52zM72 68h76M72 88h56M72 108h42"></path></svg>'
    return (
        f'<article class="latest-guide-card{featured_class}"><a aria-label="Read {esc(article["SHORT"])}" '
        f'class="latest-guide-cover latest-guide-shipping" href="/{slug}">{badge}{svg}'
        f'<strong>{esc(article["HOME_LABEL"])}</strong><small>{esc(article["HOME_SMALL"])}</small></a>'
        '<div class="latest-guide-body"><div class="latest-guide-meta">'
        f'<time datetime="{article["DATE"]}">{esc(article["DISPLAY"])}</time><span>12 min read</span></div>'
        f'<h3><a href="/{slug}">{esc(article["SHORT"])}</a></h3><p>{esc(article["HOME_DESCRIPTION"])}</p>'
        f'<a class="latest-guide-link" href="/{slug}">{esc(article["HOME_LINK_TEXT"])} <span>→</span></a>'
        '</div></article>'
    )


def patch_home() -> None:
    path = ROOT / "index.html"
    page = path.read_text(encoding="utf-8")
    restricted = {
        "SLUG": "guide-sugargoo-sensitive-prohibited-items.html",
        "SHORT": "Sugargoo Restricted Items Guide 2026",
        "DATE": "2026-09-08",
        "DISPLAY": "September 8, 2026",
        "HOME_LABEL": "Restricted Items",
        "HOME_SMALL": "Batteries · Liquids · Special cargo",
        "HOME_DESCRIPTION": "Classify batteries, liquids, food, magnets and oversized goods before they become expensive warehouse problems.",
        "HOME_LINK_TEXT": "Read restricted items guide",
    }
    latest = ARTICLES + [restricted]

    def update(data: dict) -> dict:
        for node in data.get("@graph", []):
            if node.get("@type") != "CollectionPage":
                continue
            for entity in node.get("mainEntity", []):
                if entity.get("@type") == "ItemList" and entity.get("name") == "Latest Sugargoo buyer guides":
                    entity["numberOfItems"] = 3
                    entity["itemListElement"] = [
                        {
                            "@type": "ListItem",
                            "position": index,
                            "item": {
                                "@type": "Article",
                                "headline": article["SHORT"],
                                "url": f'https://sugargoovip.shop/{public_slug(article)}',
                                "datePublished": article["DATE"],
                            },
                        }
                        for index, article in enumerate(latest, 1)
                    ]
                    return data
        raise RuntimeError("homepage latest-guides JSON-LD not found")

    page = update_first_jsonld(page, update)
    start = page.index('<section aria-labelledby="latest-guides-title"')
    end = page.index('<section class="finder', start)
    old = page[start:end]
    opening_end = old.index('<div class="latest-guides-grid">')
    grid_start = opening_end + len('<div class="latest-guides-grid">')
    grid_end = old.rindex("</div></div></section>")
    opening = old[:opening_end]
    opening = re.sub(
        r'<div class="latest-guides-intro"><p>.*?</p>',
        '<div class="latest-guides-intro"><p>Three practical Sugargoo guides for estimating shipping, planning a US parcel and screening restricted products. Newest articles appear first.</p>',
        opening,
        count=1,
        flags=re.S,
    )
    cards = "".join(home_card(article, index == 0) for index, article in enumerate(latest))
    section = opening + '<div class="latest-guides-grid">' + cards + old[grid_end:]
    page = page[:start] + section + page[end:]
    path.write_text(page, encoding="utf-8")


def patch_sitemap() -> None:
    path = ROOT / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")
    for loc in ("", "guides"):
        xml = re.sub(
            rf"(<loc>https://sugargoovip\.shop/{loc}</loc><lastmod>)[^<]+",
            r"\g<1>2026-09-11",
            xml,
            count=1,
        )
    for article in reversed(ARTICLES):
        slug = public_slug(article)
        if f"<loc>https://sugargoovip.shop/{slug}</loc>" in xml:
            continue
        marker = "  <url><loc>https://sugargoovip.shop/guide-sugargoo-sensitive-prohibited-items"
        entry = (
            f'  <url><loc>https://sugargoovip.shop/{slug}</loc><lastmod>{article["DATE"]}</lastmod>'
            '<changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
        )
        if marker not in xml:
            raise RuntimeError("sitemap insertion marker not found")
        xml = xml.replace(marker, entry + marker, 1)
    path.write_text(xml, encoding="utf-8")


def normalize_public_urls() -> None:
    for path in ROOT.glob("*.html"):
        page = path.read_text(encoding="utf-8")
        page = re.sub(r"https://sugargoovip\.shop/([a-z0-9-]+)\.html", r"https://sugargoovip.shop/\1", page)
        page = re.sub(r'href="index\.html#', 'href="/#', page)
        page = page.replace('href="index.html"', 'href="/"')
        page = re.sub(r'href="([a-z0-9-]+)\.html([^\"]*)"', r'href="/\1\2"', page)
        if "assets/js/analytics-v1.js" not in page:
            page = page.replace("</body>", '<script src="/assets/js/analytics-v1.js" defer></script></body>')
        path.write_text(page, encoding="utf-8")


expected_slugs = [public_slug(article) for article in ARTICLES]
guides_existing = (ROOT / "guides.html").read_text(encoding="utf-8")
home_existing = (ROOT / "index.html").read_text(encoding="utf-8")
if (
    all((ROOT / article["SLUG"]).exists() for article in ARTICLES)
    and all(slug in guides_existing for slug in expected_slugs)
    and all(slug in home_existing for slug in expected_slugs)
    and '"numberOfItems":17' in guides_existing
):
    print("Shipping guides already present; skipping")
    raise SystemExit(0)

for item in ARTICLES:
    render_article(item)
patch_guides()
patch_home()
patch_sitemap()
normalize_public_urls()

guides = (ROOT / "guides.html").read_text(encoding="utf-8")
home = (ROOT / "index.html").read_text(encoding="utf-8")
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
latest_start = home.index('<section aria-labelledby="latest-guides-title"')
latest_end = home.index('<section class="finder', latest_start)
latest = home[latest_start:latest_end]
checks = {
    "word_counts": {article["SLUG"]: prose_word_count(article) for article in ARTICLES},
    "guide_cards": guides.count("<article>"),
    "guide_schema_17": '"numberOfItems":17' in guides,
    "homepage_latest_3": latest.count('class="latest-guide-card') == 3,
    "sitemap_entries": all(slug in sitemap for slug in expected_slugs),
    "canonical_pages": all(
        f'<link href="https://sugargoovip.shop/{public_slug(article)}" rel="canonical"/>'
        in (ROOT / article["SLUG"]).read_text(encoding="utf-8")
        for article in ARTICLES
    ),
}
if checks["guide_cards"] != 17 or not all(value for key, value in checks.items() if key != "word_counts"):
    raise RuntimeError(checks)
print(json.dumps(checks, ensure_ascii=False, separators=(",", ":")))
