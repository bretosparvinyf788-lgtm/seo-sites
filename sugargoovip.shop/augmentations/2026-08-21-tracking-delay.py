#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
LOCAL_DATA_PATH = Path(__file__).with_suffix(".json")
REPOSITORY_DATA_PATH = (
    Path(__file__).resolve().parent.parent
    / "article-data"
    / "2026-08-21-tracking-delay.json"
)
DATA_PATH = LOCAL_DATA_PATH if LOCAL_DATA_PATH.exists() else REPOSITORY_DATA_PATH
DATA = json.loads(DATA_PATH.read_text(encoding="utf-8"))

SLUG, TITLE, SHORT, DATE, DISPLAY, META, DECK = (
    DATA[key]
    for key in ("SLUG", "TITLE", "SHORT", "DATE", "DISPLAY", "META", "DECK")
)
TAGS, SOURCES, SECTIONS, FAQ = (
    DATA["TAGS"],
    DATA["SOURCES"],
    DATA["SECTIONS"],
    DATA["FAQ"],
)


def esc(value):
    return html.escape(str(value), quote=True)


def sid(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


PROSE = "\n".join(text for _, text in SECTIONS) + "\n" + "\n".join(
    question + " " + answer for question, answer in FAQ
)
WORD_COUNT = len(re.findall(r"\b[\w’'-]+\b", PROSE))
if not 1500 <= WORD_COUNT <= 1800:
    raise RuntimeError(f"Article word count out of range: {WORD_COUNT}")


def replace_first_jsonld(page, updater):
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    if not match:
        raise RuntimeError("JSON-LD block not found")
    data = updater(json.loads(match.group(1)))
    encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return page[: match.start(1)] + encoded + page[match.end(1) :]


def render_article():
    template = (ROOT / "guide-sugargoo-parcel-insurance-claim-ready.html").read_text(
        encoding="utf-8"
    )
    toc = "".join(
        f'<a href="#{sid(heading)}">{index:02d}. {esc(heading)}</a>'
        for index, (heading, _) in enumerate(SECTIONS, 1)
    ) + '<a href="#faq">FAQ</a>'
    body = "".join(
        f'<section><h2 id="{sid(heading)}">{esc(heading)}</h2>'
        + "".join(
            f"<p>{esc(paragraph.strip())}</p>"
            for paragraph in text.strip().split("\n\n")
        )
        + "</section>"
        for heading, text in SECTIONS
    )
    faq_html = "".join(
        f"<details><summary>{esc(question)}</summary><p>{esc(answer)}</p></details>"
        for question, answer in FAQ
    )
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": TITLE,
                "description": META,
                "datePublished": DATE,
                "dateModified": DATE,
                "wordCount": WORD_COUNT,
                "inLanguage": "en",
                "keywords": ", ".join(TAGS),
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": "https://sugargoovip.shop/" + SLUG,
                },
                "author": {
                    "@type": "Organization",
                    "name": "SugargooVIP Editorial Team",
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "SugargooVIP",
                    "url": "https://sugargoovip.shop/",
                },
                "citation": SOURCES,
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://sugargoovip.shop/",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Buyer Guides",
                        "item": "https://sugargoovip.shop/guides.html",
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": SHORT,
                        "item": "https://sugargoovip.shop/" + SLUG,
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
                    for question, answer in FAQ
                ],
            },
        ],
    }
    template = re.sub(
        r"<title>.*?</title>",
        f"<title>{esc(TITLE)} | SugargooVIP</title>",
        template,
        count=1,
        flags=re.S,
    )
    template = re.sub(
        r'<meta content="[^"]*" name="description"/>',
        f'<meta content="{esc(META)}" name="description"/>',
        template,
        count=1,
    )
    template = re.sub(
        r'<link href="https://sugargoovip\.shop/[^"]+" rel="canonical"/>',
        f'<link href="https://sugargoovip.shop/{SLUG}" rel="canonical"/>',
        template,
        count=1,
    )
    template = re.sub(
        r'<meta content="[^"]*" property="og:title"/>',
        f'<meta content="{esc(TITLE)}" property="og:title"/>',
        template,
        count=1,
    )
    template = re.sub(
        r'<meta content="[^"]*" property="og:description"/>',
        f'<meta content="{esc(META)}" property="og:description"/>',
        template,
        count=1,
    )
    template = re.sub(
        r'<meta content="https://sugargoovip\.shop/[^"]+" property="og:url"/>',
        f'<meta content="https://sugargoovip.shop/{SLUG}" property="og:url"/>',
        template,
        count=1,
    )
    template = re.sub(
        r'<script type="application/ld\+json">.*?</script>',
        '<script type="application/ld+json">'
        + json.dumps(schema, ensure_ascii=False, separators=(",", ":"))
        + "</script>",
        template,
        count=1,
        flags=re.S,
    )
    template = re.sub(
        r"Facts checked [A-Z][a-z]+ \d{1,2}, 2026 · Independent buyer resource",
        f"Facts checked {DISPLAY} · Independent buyer resource",
        template,
        count=1,
    )
    hero = f'''<section class="article-hero"><div class="frame article-hero-grid"><div><span class="article-label">Tracking &amp; Delivery Delays · Fact checked</span><h1>{esc(TITLE)}</h1><p class="article-deck">{esc(DECK)}</p><div class="article-meta"><span>Published {DISPLAY}</span><span>12 min read</span><span>{WORD_COUNT:,} words</span></div></div><div class="article-hero-card"><small>Independent buyer guide</small><strong>13</strong><p>Original English editorial content based on current Sugargoo official documentation. Route estimates, carrier handoffs, customs requirements and support procedures should be rechecked in the live account.</p></div></div></section>'''
    template = re.sub(
        r'<section class="article-hero">.*?</section>',
        hero,
        template,
        count=1,
        flags=re.S,
    )
    shell = f'''<div class="frame article-shell"><aside class="article-toc"><span>On this page</span><nav>{toc}</nav></aside><article class="article-main"><p class="article-intro">A quiet tracking page is a signal to identify the current logistics stage, not proof that a parcel has disappeared.</p><div class="article-factbox"><b>Research standard</b><p>Facts were checked against Sugargoo's current official parcel-tracking, delivery-exception and customer-support guidance on {DISPLAY}. The status-led workflow below was written from scratch for SugargooVIP.</p></div>{body}<section class="article-faq" id="faq"><h2>FAQ: Sugargoo tracking and delivery delays</h2>{faq_html}</section><div class="article-tags">{''.join(f'<span>{esc(tag)}</span>' for tag in TAGS)}</div><div class="article-bottom-nav"><a href="guides.html">← View all buyer guides</a><a href="index.html">Back to homepage →</a></div></article></div>'''
    template = re.sub(
        r'<div class="frame article-shell">.*?</div></main>',
        shell + "</main>",
        template,
        count=1,
        flags=re.S,
    )
    if TITLE not in template or template.count("<details>") < 8:
        raise RuntimeError("Article render failed")
    return template


def patch_guides():
    path = ROOT / "guides.html"
    page = path.read_text(encoding="utf-8")

    def update_schema(data):
        entity = data["mainEntity"]
        url = "https://sugargoovip.shop/" + SLUG
        items = [
            item
            for item in entity.get("itemListElement", [])
            if item.get("item", {}).get("url") != url
        ]
        items.insert(
            0,
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Article",
                    "headline": TITLE,
                    "url": url,
                    "datePublished": DATE,
                },
            },
        )
        for index, item in enumerate(items, 1):
            item["position"] = index
        entity["numberOfItems"] = len(items)
        entity["itemListElement"] = items
        return data

    page = replace_first_jsonld(page, update_schema)
    page = re.sub(
        r"<title>.*?</title>",
        "<title>Sugargoo Buyer Guides 2026: Tracking, Insurance, DIY Orders, Warehouse, QC and Shipping</title>",
        page,
        count=1,
        flags=re.S,
    )
    page = re.sub(
        r'<meta content="[^"]*" name="description"/>',
        '<meta content="Read thirteen original Sugargoo buyer guides covering tracking delays, parcel insurance, DIY orders, pre-purchase checks, warehouse timing, payments, packing, returns, shipping, QC and W2C." name="description"/>',
        page,
        count=1,
    )
    page = re.sub(
        r"Facts checked [A-Z][a-z]+ \d{1,2}, 2026",
        f"Facts checked {DISPLAY}",
        page,
    )
    page = re.sub(
        r"<p>Twelve long-form reverse-shopping guides.*?</p>",
        "<p>Thirteen long-form reverse-shopping guides written from scratch after checking Sugargoo's current official documentation. Every historical article remains available, newest first.</p>",
        page,
        count=1,
        flags=re.S,
    )
    if '<div class="guide-directory">' not in page:
        raise RuntimeError("Guide directory not found")
    if SLUG not in page.split('<div class="guide-directory">', 1)[1]:
        card = f'''<article><a class="guide-directory-cover shipping" href="{SLUG}"><span>Tracking &amp; delivery delays</span><b>01</b></a><div class="guide-directory-body"><h2><a href="{SLUG}">{esc(TITLE)}</a></h2><p>{esc(META)}</p><div class="guide-directory-meta"><span>{DISPLAY}</span><span>12 min read</span></div><a href="{SLUG}">Read the full {WORD_COUNT:,}-word guide →</a></div></article>'''
        page = page.replace(
            '<div class="guide-directory">',
            '<div class="guide-directory">' + card,
            1,
        )
    start = page.index('<div class="guide-directory">')
    end = page.index("</div></div></main>", start)
    block = page[start:end]
    numbers = iter(range(1, 100))
    block = re.sub(
        r"<b>\d{2}</b>", lambda _: f"<b>{next(numbers):02d}</b>", block
    )
    path.write_text(page[:start] + block + page[end:], encoding="utf-8")


def patch_home():
    path = ROOT / "index.html"
    page = path.read_text(encoding="utf-8")

    def update_schema(data):
        for node in data.get("@graph", []):
            if node.get("@type") != "CollectionPage":
                continue
            for entity in node.get("mainEntity", []):
                if (
                    entity.get("@type") == "ItemList"
                    and entity.get("name") == "Latest Sugargoo buyer guides"
                ):
                    url = "https://sugargoovip.shop/" + SLUG
                    items = [
                        item
                        for item in entity.get("itemListElement", [])
                        if item.get("item", {}).get("url") != url
                    ]
                    items.insert(
                        0,
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "item": {
                                "@type": "Article",
                                "headline": TITLE,
                                "url": url,
                                "datePublished": DATE,
                            },
                        },
                    )
                    items = items[:3]
                    for index, item in enumerate(items, 1):
                        item["position"] = index
                    entity["numberOfItems"] = 3
                    entity["itemListElement"] = items
                    return data
        raise RuntimeError("Latest guides JSON-LD not found")

    page = replace_first_jsonld(page, update_schema)
    start = page.index('<section aria-labelledby="latest-guides-title"')
    end = page.index('<section class="finder', start)
    section = page[start:end]
    cards = [
        card
        for card in re.findall(
            r'<article class="latest-guide-card[^>]*>.*?</article>', section, re.S
        )
        if SLUG not in card
    ][:2]
    if len(cards) < 2:
        raise RuntimeError("Previous homepage guide cards not found")
    cards = [
        card.replace(" latest-guide-featured", "").replace(
            '<span class="latest-guide-badge">Latest guide</span>', ""
        )
        for card in cards
    ]
    new_card = f'''<article class="latest-guide-card latest-guide-featured"><a aria-label="Read {esc(SHORT)}" class="latest-guide-cover latest-guide-shipping" href="{SLUG}"><span class="latest-guide-badge">Latest guide</span><svg aria-hidden="true" viewBox="0 0 220 160"><path d="M42 88h32l18-32 28 62 20-38h38"></path><circle cx="42" cy="88" r="8"></circle><circle cx="178" cy="80" r="8"></circle></svg><strong>Tracking &amp; Delivery Delays</strong><small>Scans · Handoffs · Delivery</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="{DATE}">{DISPLAY}</time><span>12 min read</span></div><h3><a href="{SLUG}">{esc(SHORT)}</a></h3><p>Decode parcel scans, identify carrier handoffs, respond to customs or last-mile exceptions and send support a useful evidence packet.</p><a class="latest-guide-link" href="{SLUG}">Read tracking guide <span>→</span></a></div></article>'''
    grid_start = section.index('<div class="latest-guides-grid">') + len(
        '<div class="latest-guides-grid">'
    )
    grid_end = section.rindex("</div></div></section>")
    section = (
        section[:grid_start]
        + new_card
        + "".join(cards)
        + section[grid_end:]
    )
    section = re.sub(
        r'<div class="latest-guides-intro"><p>.*?</p>',
        '<div class="latest-guides-intro"><p>Three practical Sugargoo guides covering parcel tracking, shipping risk and DIY order recovery. Newest articles appear first.</p>',
        section,
        count=1,
        flags=re.S,
    )
    path.write_text(page[:start] + section + page[end:], encoding="utf-8")


def patch_sitemap():
    path = ROOT / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")
    xml = re.sub(
        r"(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+",
        r"\g<1>" + DATE,
        xml,
    )
    xml = re.sub(
        r"(<loc>https://sugargoovip\.shop/guides\.html</loc><lastmod>)[^<]+",
        r"\g<1>" + DATE,
        xml,
    )
    if SLUG not in xml:
        marker = (
            "  <url><loc>https://sugargoovip.shop/"
            "guide-sugargoo-parcel-insurance-claim-ready.html"
        )
        entry = (
            f"  <url><loc>https://sugargoovip.shop/{SLUG}</loc>"
            f"<lastmod>{DATE}</lastmod><changefreq>monthly</changefreq>"
            "<priority>0.8</priority></url>\n"
        )
        if marker not in xml:
            raise RuntimeError("Sitemap marker not found")
        xml = xml.replace(marker, entry + marker, 1)
    path.write_text(xml, encoding="utf-8")


(ROOT / SLUG).write_text(render_article(), encoding="utf-8")
patch_guides()
patch_home()
patch_sitemap()

article = (ROOT / SLUG).read_text(encoding="utf-8")
guides = (ROOT / "guides.html").read_text(encoding="utf-8")
home = (ROOT / "index.html").read_text(encoding="utf-8")
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
latest = home[
    home.index('<section aria-labelledby="latest-guides-title"') : home.index(
        '<section class="finder',
        home.index('<section aria-labelledby="latest-guides-title"'),
    )
]
checks = {
    "word_count": WORD_COUNT,
    "faq": article.count("<details>") >= 8,
    "canonical": f'https://sugargoovip.shop/{SLUG}' in article,
    "homepage_latest_three": latest.count('class="latest-guide-card') == 3,
    "homepage_new": SLUG in latest,
    "guides_new": SLUG in guides,
    "guides_cards": guides.count("<article>") >= 13,
    "sitemap": SLUG in sitemap,
}
if not all(value for key, value in checks.items() if key != "word_count"):
    raise RuntimeError(checks)
print(json.dumps(checks, separators=(",", ":")))
