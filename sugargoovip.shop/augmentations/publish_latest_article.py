#!/usr/bin/env python3
"""Publish one article-data JSON into an extracted SugargooVIP site archive."""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

if len(sys.argv) == 3:
    data_path = Path(sys.argv[1])
    ROOT = Path(sys.argv[2])
elif len(sys.argv) == 2:
    # Cloudflare invokes every augmentation as: python SCRIPT.py dist
    data_path = (
        Path(__file__).resolve().parent.parent
        / "article-data"
        / "2026-09-08-sensitive-prohibited-items.json"
    )
    ROOT = Path(sys.argv[1])
else:
    raise SystemExit("usage: publish_latest_article.py [ARTICLE_JSON] EXTRACTED_SITE")

DATA = json.loads(data_path.read_text(encoding="utf-8"))
SLUG, TITLE, SHORT, DATE, DISPLAY, META, DECK = (
    DATA[k] for k in ("SLUG", "TITLE", "SHORT", "DATE", "DISPLAY", "META", "DECK")
)
PUBLIC_SLUG = SLUG.removesuffix(".html")
if (ROOT / SLUG).exists():
    print(f"{SLUG} already present; skipping")
    raise SystemExit(0)
TAGS, SOURCES, SECTIONS, FAQ = (DATA[k] for k in ("TAGS", "SOURCES", "SECTIONS", "FAQ"))
PROSE = "\n".join(t for _, t in SECTIONS) + "\n" + "\n".join(q + " " + a for q, a in FAQ)
WORD_COUNT = len(re.findall(r"\b[\w’'-]+\b", PROSE))
if not 1500 <= WORD_COUNT <= 1800:
    raise RuntimeError(f"Article word count out of range: {WORD_COUNT}")
if len(FAQ) != 10:
    raise RuntimeError(f"Expected 10 FAQs, found {len(FAQ)}")


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def sid(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def first_jsonld(page: str, update) -> str:
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    if not match:
        raise RuntimeError("JSON-LD block not found")
    encoded = json.dumps(update(json.loads(match.group(1))), ensure_ascii=False, separators=(",", ":"))
    return page[:match.start(1)] + encoded + page[match.end(1):]


def render_article() -> str:
    template = (ROOT / "guide-sugargoo-customs-declaration.html").read_text(encoding="utf-8")
    toc = "".join(
        f'<a href="#{sid(h)}">{i:02d}. {esc(h)}</a>'
        for i, (h, _) in enumerate(SECTIONS, 1)
    ) + '<a href="#faq">FAQ</a>'
    body = "".join(
        f'<section><h2 id="{sid(h)}">{esc(h)}</h2>'
        + "".join(f"<p>{esc(p.strip())}</p>" for p in text.strip().split("\n\n"))
        + "</section>"
        for h, text in SECTIONS
    )
    faq_html = "".join(
        f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in FAQ
    )
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article", "headline": TITLE, "description": META,
                "datePublished": DATE, "dateModified": DATE, "wordCount": WORD_COUNT,
                "inLanguage": "en", "keywords": ", ".join(TAGS),
                "mainEntityOfPage": {"@type": "WebPage", "@id": "https://sugargoovip.shop/" + PUBLIC_SLUG},
                "author": {"@type": "Organization", "name": "SugargooVIP Editorial Team"},
                "publisher": {"@type": "Organization", "name": "SugargooVIP", "url": "https://sugargoovip.shop/"},
                "citation": SOURCES,
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sugargoovip.shop/"},
                    {"@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": "https://sugargoovip.shop/guides"},
                    {"@type": "ListItem", "position": 3, "name": SHORT, "item": "https://sugargoovip.shop/" + PUBLIC_SLUG},
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                    for q, a in FAQ
                ],
            },
        ],
    }
    replacements = [
        (r"<title>.*?</title>", f"<title>{esc(TITLE)} | SugargooVIP</title>"),
        (r'<meta content="[^"]*" name="description"/>', f'<meta content="{esc(META)}" name="description"/>'),
        (r'<link href="https://sugargoovip\.shop/[^"]+" rel="canonical"/>', f'<link href="https://sugargoovip.shop/{PUBLIC_SLUG}" rel="canonical"/>'),
        (r'<meta content="[^"]*" property="og:title"/>', f'<meta content="{esc(TITLE)}" property="og:title"/>'),
        (r'<meta content="[^"]*" property="og:description"/>', f'<meta content="{esc(META)}" property="og:description"/>'),
        (r'<meta content="https://sugargoovip\.shop/[^"]+" property="og:url"/>', f'<meta content="https://sugargoovip.shop/{PUBLIC_SLUG}" property="og:url"/>'),
    ]
    for pattern, replacement in replacements:
        template, count = re.subn(pattern, replacement, template, count=1, flags=re.S)
        if count != 1:
            raise RuntimeError(f"Required metadata pattern missing: {pattern}")
    template = re.sub(
        r'<script type="application/ld\+json">.*?</script>',
        '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False, separators=(",", ":")) + "</script>",
        template, count=1, flags=re.S,
    )
    template = re.sub(
        r"Facts checked [A-Z][a-z]+ \d{1,2}, 2026 · Independent buyer resource",
        f"Facts checked {DISPLAY} · Independent buyer resource", template, count=1,
    )
    hero = f'''<section class="article-hero"><div class="frame article-hero-grid"><div><span class="article-label">Restricted Items &amp; Route Eligibility · Fact checked</span><h1>{esc(TITLE)}</h1><p class="article-deck">{esc(DECK)}</p><div class="article-meta"><span>Published {DISPLAY}</span><span>12 min read</span><span>{WORD_COUNT:,} words</span></div></div><div class="article-hero-card"><small>Independent buyer guide</small><strong>15</strong><p>Original English editorial content based on current Sugargoo official guidance. Product classification, route availability and destination import rules must be rechecked before purchase and parcel submission.</p></div></div></section>'''
    template = re.sub(r'<section class="article-hero">.*?</section>', hero, template, count=1, flags=re.S)
    intro = "A product is not a bargain when its transport category makes it impossible, uneconomic or unlawful to ship to your destination."
    related = '<div class="article-bottom-nav"><a href="guide-sugargoo-packing-center-parcel.html">Packing Center guide</a><a href="guide-sugargoo-customs-declaration.html">Customs declaration guide</a><a href="guides.html">All buyer guides →</a></div>'
    shell = f'''<div class="frame article-shell"><aside class="article-toc"><span>On this page</span><nav>{toc}</nav></aside><article class="article-main"><p class="article-intro">{intro}</p><div class="article-factbox"><b>Research standard</b><p>Facts were checked against Sugargoo's official restriction, route-selection and international shipping guidance on {DISPLAY}. The screening workflow below was written from scratch for SugargooVIP.</p></div>{body}<section class="article-faq" id="faq"><h2>FAQ: Sugargoo restricted and prohibited items</h2>{faq_html}</section><div class="article-tags">{''.join(f'<span>{esc(t)}</span>' for t in TAGS)}</div>{related}</article></div>'''
    template, count = re.subn(r'<div class="frame article-shell">.*?</div></main>', shell + "</main>", template, count=1, flags=re.S)
    if count != 1 or template.count("<details>") != 10:
        raise RuntimeError("Article render failed")
    return template


def patch_guides() -> None:
    path = ROOT / "guides.html"
    page = path.read_text(encoding="utf-8")

    def update(data):
        entity = data["mainEntity"]
        url = "https://sugargoovip.shop/" + PUBLIC_SLUG
        items = [x for x in entity.get("itemListElement", []) if x.get("item", {}).get("url") != url]
        items.insert(0, {"@type": "ListItem", "position": 1, "item": {"@type": "Article", "headline": TITLE, "url": url, "datePublished": DATE}})
        for i, item in enumerate(items, 1): item["position"] = i
        entity["numberOfItems"] = len(items)
        entity["itemListElement"] = items
        return data

    page = first_jsonld(page, update)
    page = re.sub(r"<title>.*?</title>", "<title>Sugargoo Buyer Guides 2026: Restricted Items, Customs, Tracking, Insurance, QC and Shipping</title>", page, count=1, flags=re.S)
    page = re.sub(r'<meta content="[^"]*" name="description"/>', '<meta content="Read fifteen original Sugargoo buyer guides covering restricted items, customs, tracking, insurance, warehouse decisions, shipping, QC and W2C." name="description"/>', page, count=1)
    page = re.sub(r"Facts checked [A-Z][a-z]+ \d{1,2}, 2026", f"Facts checked {DISPLAY}", page)
    page, count = re.subn(r"<p>(?:Fourteen|Fifteen|14|15) long-form reverse-shopping guides.*?</p>", "<p>Fifteen long-form reverse-shopping guides written from scratch after checking Sugargoo's current official documentation. Every historical article remains available, newest first.</p>", page, count=1, flags=re.S)
    if count != 1: raise RuntimeError("Guide count introduction not found")
    if PUBLIC_SLUG not in page.split('<div class="guide-directory">', 1)[1]:
        card = f'''<article><a class="guide-directory-cover shipping" href="{SLUG}"><span>Restricted items &amp; route checks</span><b>01</b></a><div class="guide-directory-body"><h2><a href="{SLUG}">{esc(TITLE)}</a></h2><p>{esc(META)}</p><div class="guide-directory-meta"><span>{DISPLAY}</span><span>12 min read</span></div><a href="{SLUG}">Read the full {WORD_COUNT:,}-word guide →</a></div></article>'''
        page = page.replace('<div class="guide-directory">', '<div class="guide-directory">' + card, 1)
    start = page.index('<div class="guide-directory">')
    end = page.index("</div></div></main>", start)
    block = page[start:end]
    nums = iter(range(1, 100))
    block = re.sub(r"<b>\d{2}</b>", lambda _: f"<b>{next(nums):02d}</b>", block)
    path.write_text(page[:start] + block + page[end:], encoding="utf-8")


def patch_home() -> None:
    path = ROOT / "index.html"
    page = path.read_text(encoding="utf-8")

    def update(data):
        for node in data.get("@graph", []):
            if node.get("@type") != "CollectionPage": continue
            for entity in node.get("mainEntity", []):
                if entity.get("@type") == "ItemList" and entity.get("name") == "Latest Sugargoo buyer guides":
                    url = "https://sugargoovip.shop/" + PUBLIC_SLUG
                    items = [
                        {"@type": "ListItem", "position": 1, "item": {"@type": "Article", "headline": TITLE, "url": url, "datePublished": DATE}},
                        {"@type": "ListItem", "position": 2, "item": {"@type": "Article", "headline": "Sugargoo Customs Declaration Guide 2026: Values, Descriptions and Proof", "url": "https://sugargoovip.shop/guide-sugargoo-customs-declaration.html", "datePublished": "2026-09-06"}},
                        {"@type": "ListItem", "position": 3, "item": {"@type": "Article", "headline": "Sugargoo Tracking Guide 2026: Decode Parcel Updates and Handle Delivery Delays", "url": "https://sugargoovip.shop/guide-sugargoo-tracking-not-updating.html", "datePublished": "2026-08-21"}},
                    ]
                    entity["numberOfItems"] = 3
                    entity["itemListElement"] = items
                    return data
        raise RuntimeError("Latest guides JSON-LD not found")

    page = first_jsonld(page, update)
    start = page.index('<section aria-labelledby="latest-guides-title"')
    end = page.index('<section class="finder', start)
    section = page[start:end]
    available_cards = re.findall(r'<article class="latest-guide-card[^>]*>.*?</article>', section, re.S)
    tracking = next((c for c in available_cards if "guide-sugargoo-tracking-not-updating" in c), None)
    if not tracking: raise RuntimeError("Tracking homepage guide card not found")
    tracking = tracking.replace(" latest-guide-featured", "").replace('<span class="latest-guide-badge">Latest guide</span>', "")
    customs = '''<article class="latest-guide-card"><a aria-label="Read Sugargoo Customs Declaration Guide 2026" class="latest-guide-cover latest-guide-shipping" href="guide-sugargoo-customs-declaration.html"><svg aria-hidden="true" viewBox="0 0 220 160"><rect x="54" y="28" width="112" height="104" rx="12"></rect><path d="M76 55h68M76 75h52M76 95h36"></path><path d="m126 104 10 10 20-24"></path></svg><strong>Customs Declaration &amp; Proof</strong><small>Values · Descriptions · Records</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="2026-09-06">September 6, 2026</time><span>12 min read</span></div><h3><a href="guide-sugargoo-customs-declaration.html">Sugargoo Customs Declaration Guide 2026</a></h3><p>Build a realistic declaration ledger, understand route tax handling and prepare useful payment proof before international dispatch.</p><a class="latest-guide-link" href="guide-sugargoo-customs-declaration.html">Read customs guide <span>→</span></a></div></article>'''
    new = f'''<article class="latest-guide-card latest-guide-featured"><a aria-label="Read {esc(SHORT)}" class="latest-guide-cover latest-guide-shipping" href="{SLUG}"><span class="latest-guide-badge">Latest guide</span><svg aria-hidden="true" viewBox="0 0 220 160"><rect x="54" y="28" width="112" height="104" rx="12"></rect><path d="M76 55h68M76 75h52M76 95h36"></path><path d="m126 104 10 10 20-24"></path></svg><strong>Restricted Items &amp; Route Checks</strong><small>Batteries · Liquids · Special cargo</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="{DATE}">{DISPLAY}</time><span>12 min read</span></div><h3><a href="{SLUG}">{esc(SHORT)}</a></h3><p>Classify batteries, liquids, food, magnets and oversized goods before they become expensive warehouse problems.</p><a class="latest-guide-link" href="{SLUG}">Read restricted items guide <span>→</span></a></div></article>'''
    grid_start = section.index('<div class="latest-guides-grid">') + len('<div class="latest-guides-grid">')
    grid_end = section.rindex("</div></div></section>")
    section = section[:grid_start] + new + customs + tracking + section[grid_end:]
    section = re.sub(r'<div class="latest-guides-intro"><p>.*?</p>', '<div class="latest-guides-intro"><p>Three practical Sugargoo guides covering restricted-item screening, customs declarations and parcel tracking. Newest articles appear first.</p>', section, count=1, flags=re.S)
    path.write_text(page[:start] + section + page[end:], encoding="utf-8")


def patch_sitemap() -> None:
    path = ROOT / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")
    xml = re.sub(r"(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+", r"\g<1>" + DATE, xml)
    xml = re.sub(r"(<loc>https://sugargoovip\.shop/guides</loc><lastmod>)[^<]+", r"\g<1>" + DATE, xml)
    if PUBLIC_SLUG not in xml:
        marker = '  <url><loc>https://sugargoovip.shop/guide-sugargoo-customs-declaration'
        entry = f'  <url><loc>https://sugargoovip.shop/{PUBLIC_SLUG}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
        if marker not in xml: raise RuntimeError("Sitemap insertion marker not found")
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


(ROOT / SLUG).write_text(render_article(), encoding="utf-8")
patch_guides()
patch_home()
patch_sitemap()
normalize_public_urls()

article = (ROOT / SLUG).read_text(encoding="utf-8")
guides = (ROOT / "guides.html").read_text(encoding="utf-8")
home = (ROOT / "index.html").read_text(encoding="utf-8")
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
latest_start = home.index('<section aria-labelledby="latest-guides-title"')
latest = home[latest_start:home.index('<section class="finder', latest_start)]
checks = {
    "word_count": WORD_COUNT, "faq_count": article.count("<details>"),
    "canonical": f"https://sugargoovip.shop/{PUBLIC_SLUG}" in article,
    "article_schema": '"@type":"Article"' in article,
    "faq_schema": '"@type":"FAQPage"' in article,
    "homepage_latest_three": latest.count('class="latest-guide-card') == 3,
    "homepage_new": PUBLIC_SLUG in latest, "guides_new": PUBLIC_SLUG in guides,
    "guides_cards": guides.count("<article>") == 15,
    "guides_schema_count": '"numberOfItems":15' in guides,
    "sitemap": PUBLIC_SLUG in sitemap,
}
if not all(v for k, v in checks.items() if k not in {"word_count", "faq_count"}):
    raise RuntimeError(checks)
print(json.dumps(checks, separators=(",", ":")))
