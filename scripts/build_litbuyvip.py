#!/usr/bin/env python3
"""Build LitBuyVIP article pages and SEO discovery surfaces from one data file."""

from __future__ import annotations

import html
import json
import re
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "litbuyvip.org"
ARTICLES_PATH = SITE / "content" / "articles.json"
KEYWORD_ARTICLES_PATH = SITE / "content" / "keyword-gap-articles.json"
SUPPORT_ARTICLES_PATH = SITE / "content" / "support-keyword-articles.json"
BASE = "https://litbuyvip.org"
LANGUAGES = ["de", "fr", "es", "it", "pt", "nl", "pl", "ru", "zh"]
ARTICLE_OVERRIDES = {
    "litbuy-insurance-compensation-claim-preparation": {
        "title": "LitBuy Insurance Guide 2026: Claims for Damage & Loss",
        "seo_title": "LitBuy Insurance Guide 2026: Damage & Loss Claims",
        "modified": "September 16, 2026",
    },
    "litbuy-shipping-address-audit-before-parcel-payment": {
        "title": "LitBuy Shipping Address Guide 2026: Check Before Payment",
        "seo_title": "LitBuy Shipping Address Guide 2026: Check Before Payment",
        "modified": "September 16, 2026",
    },
    "litbuy-seller-listing-due-diligence-before-purchase": {
        "title": "LitBuy Seller Check 2026: Verify Listings Before You Buy",
        "seo_title": "LitBuy Seller Check 2026: Verify Listings Before You Buy",
        "modified": "September 16, 2026",
    },
    "litbuy-forwarding-order-tracking-warehouse-intake": {
        "title": "LitBuy Forwarding Guide 2026: Tracking & Warehouse Intake",
        "seo_title": "LitBuy Forwarding Guide 2026: Tracking & Warehouse Intake",
        "modified": "September 16, 2026",
    },
    "litbuy-customs-declaration-parcel-contents-reconciliation": {
        "title": "LitBuy Customs Declaration Guide 2026: Parcel Checklist",
        "seo_title": "LitBuy Customs Declaration Guide 2026: Parcel Checklist",
        "modified": "September 16, 2026",
    },
    "litbuy-order-status-seller-dispatch-warehouse-arrival": {
        "title": "LitBuy Order Status Guide 2026: Seller to Warehouse",
        "seo_title": "LitBuy Order Status Guide 2026: Seller to Warehouse",
        "modified": "September 16, 2026",
    },
    "litbuy-international-parcel-tracking-evidence-timeline": {
        "title": "LitBuy Tracking Guide 2026: Build a Parcel Timeline",
        "seo_title": "LitBuy Tracking Guide 2026: Build a Parcel Timeline",
        "modified": "September 16, 2026",
    },
    "litbuy-warehouse-storage-consolidation-calendar": {
        "title": "LitBuy Warehouse Storage Guide 2026: Plan 90 Free Days",
        "seo_title": "LitBuy Warehouse Storage Guide 2026: Plan 90 Free Days",
        "modified": "September 16, 2026",
    },
    "litbuy-warehouse-return-exchange-evidence": {
        "title": "LitBuy Return Policy & Exchange Guide 2026",
        "seo_title": "LitBuy Return Policy & Exchange Guide 2026 | Warehouse QC",
        "excerpt": "Understand the LitBuy return policy workflow, document a warehouse mismatch and choose clarification, exchange or return before international shipping.",
        "modified": "September 16, 2026",
    },
    "litbuy-parcel-preflight-audit": {
        "title": "LitBuy Parcel Checklist 2026: QC, Packing & Shipping",
        "seo_title": "LitBuy Parcel Checklist 2026: QC, Packing & Shipping",
        "excerpt": "Run a final LitBuy parcel checklist for item identity, warehouse QC, packaging, route eligibility and evidence before paying for shipping.",
        "modified": "September 16, 2026",
    },
    "litbuy-restricted-items-shipping-eligibility-screening": {
        "title": "LitBuy Restricted Items Guide 2026: What Can You Ship?",
        "seo_title": "LitBuy Restricted Items Guide 2026: What Can You Ship?",
        "excerpt": "Check whether a LitBuy item is accepted by the platform, the selected shipping route and the destination before you buy or submit a parcel.",
        "modified": "September 16, 2026",
    },
    "litbuy-shipping-cost-parcel-engineering": {
        "title": "LitBuy Shipping Cost Guide 2026: Weight, Volume & Packing",
        "seo_title": "LitBuy Shipping Cost Guide 2026: Weight, Volume & Packing",
        "excerpt": "Estimate LitBuy shipping cost by comparing actual and volumetric weight, packaging volume, route rules and the warehouse's final live quote.",
        "modified": "September 16, 2026",
    },
    "litbuy-qc-photo-reading-protocol": {
        "title": "LitBuy QC Checker 2026: How to Review Warehouse Photos",
        "seo_title": "LitBuy QC Checker 2026: Review Warehouse Photos",
        "excerpt": "Use a repeatable LitBuy QC checker for identity, measurements, symmetry, construction and visible damage before accepting a warehouse item.",
        "modified": "September 16, 2026",
    },
    "litbuy-purchasing-vs-forwarding-workflow": {
        "title": "LitBuy Purchasing vs Forwarding Guide 2026",
        "seo_title": "LitBuy Purchasing vs Forwarding Guide 2026",
        "modified": "September 16, 2026",
    },
    "litbuy-spreadsheet-decision-ledger": {
        "title": "LitBuy Spreadsheet Guide 2026: From Link to Parcel",
        "seo_title": "LitBuy Spreadsheet Guide 2026: From Link to Parcel",
        "modified": "September 16, 2026",
    },
}


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def iso_date(value: str) -> str:
    return datetime.strptime(value, "%B %d, %Y").strftime("%Y-%m-%d")


def json_script(data: object) -> str:
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "</script>"


def header() -> str:
    return (
        '<header class="site-header scrolled"><a class="brand brand-button" aria-label="LitBuy home" href="/">'
        '<img src="/assets/litbuy-logo.png" alt="LITBUY"></a><nav class="nav" aria-label="Toggle menu">'
        '<a href="/spreadsheet/">Spreadsheet</a><a href="/#categories">Categories</a>'
        '<a href="/guides/">Buyer Guides</a><a href="/#faq">FAQ</a></nav><div class="header-actions">'
        '<label class="language-select"><span class="sr-only">Language</span>'
        '<select aria-label="Language"><option value="/" selected>EN</option>'
        + "".join(f'<option value="/{lang}/">{lang.upper()}</option>' for lang in LANGUAGES)
        + '</select></label><a class="header-cta" href="https://kakobuymake.com" target="_blank" '
        'rel="noopener noreferrer">Explore sheet<span>↗</span></a><button class="menu-button" '
        'aria-expanded="false" aria-label="Toggle menu"><i></i><i></i></button></div></header>'
    )


def footer() -> str:
    return (
        '<footer><div class="footer-top"><div><div class="brand"><img src="/assets/litbuy-logo.png" alt="LITBUY"></div>'
        '<p>Independent product discovery and parcel-planning guidance for international buyers.</p></div>'
        '<div><b>DISCOVER</b><a href="/#categories">Categories</a><a href="/spreadsheet/">Curated sheet</a>'
        '<a href="/guides/">Buyer guides</a></div><div><b>TOOLS</b><a href="/qc-finder/">QC checker</a>'
        '<a href="/shipping-guide/">Shipping guide</a><a href="/#faq">Buyer FAQ</a></div>'
        '<div><b>NOTICE</b><p>Independent informational site. Not the official LitBuy platform.</p></div></div>'
        '<div class="footer-bottom"><span>© 2026 LitBuyVIP.org</span><span>Find what\'s worth the heat.</span></div></footer>'
    )


def tracking_head() -> str:
    return """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DM8KQCQYB1"></script>
<script>
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','G-DM8KQCQYB1');
</script>"""


def article_page(article: dict) -> str:
    slug = article["slug"]
    url = f"{BASE}/guides/{slug}/"
    title = article["title"]
    seo_title = article.get("seo_title", f"{title} | LitBuyVIP")
    description = article.get("meta_description", article["excerpt"])
    published = iso_date(article["date"])
    modified = iso_date(article.get("modified", article["date"]))
    cover = f'{BASE}{article["cover"]}'
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": f"{url}#article",
                "headline": title,
                "description": description,
                "image": cover,
                "datePublished": published,
                "dateModified": modified,
                "inLanguage": "en",
                "mainEntityOfPage": {"@id": url},
                "author": {"@type": "Organization", "name": "LitBuyVIP Editorial"},
                "publisher": {"@type": "Organization", "name": "LitBuyVIP", "url": f"{BASE}/"},
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{url}#breadcrumb",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
                    {"@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": f"{BASE}/guides/"},
                    {"@type": "ListItem", "position": 3, "name": title, "item": url},
                ],
            },
        ],
    }
    sections = []
    toc = []
    for index, section in enumerate(article["sections"], 1):
        paragraphs = "".join(f"<p>{esc(text)}</p>" for text in section["paragraphs"])
        sections.append(f'<section id="section-{index}"><h2>{esc(section["heading"])}</h2>{paragraphs}</section>')
        toc.append(f'<a href="#section-{index}">{index:02d}. {esc(section["heading"])}</a>')
    body = "".join(sections)
    toc_html = "".join(toc)
    return f'''<!DOCTYPE html><html lang="en"><head>
{tracking_head()}
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(seo_title)}</title><meta name="description" content="{esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="LitBuyVIP"><meta property="og:title" content="{esc(seo_title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{cover}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(seo_title)}"><meta name="twitter:description" content="{esc(description)}"><meta name="twitter:image" content="{cover}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="stylesheet" href="/assets/site.css"><script defer src="/assets/site.js"></script>
{json_script(schema)}</head><body class="compact-header">{header()}<main>
<article><header class="content-hero"><div class="breadcrumbs"><a href="/">Home</a> / <a href="/guides/">Buyer guides</a> / {esc(article['label'])}</div><p class="kicker">{esc(article['label'])} · {esc(article['date'])} · {esc(article['read'])}</p><h1>{esc(title)}</h1><p>{esc(article['excerpt'])}</p></header>
<div class="content-shell content-grid"><div class="article-body"><img class="article-cover" src="{esc(article['cover'])}" alt="{esc(title)}" width="1200" height="675" decoding="async"><p class="lead">{esc(article['intro'])}</p>{body}<aside class="buyer-note"><b>Independent buyer note</b><p>Product listings, route rules, prices and platform features can change. Confirm current information inside the ordering service before paying or submitting a parcel.</p></aside></div><aside class="toc"><b>IN THIS GUIDE</b>{toc_html}<a href="/guides/">← All buyer guides</a></aside></div></article></main>{footer()}</body></html>'''


def guide_card(article: dict, heading: str = "h2") -> str:
    return (
        f'<a class="all-guide-row" href="/guides/{esc(article["slug"])}/">'
        f'<img src="{esc(article["cover"])}" alt="{esc(article["title"])}" loading="lazy" width="720" height="405">'
        f'<div><small>{esc(article["label"])} · {esc(article["date"])} · {esc(article["read"])}</small>'
        f'<{heading}>{esc(article["title"])}</{heading}><p>{esc(article["excerpt"])}</p></div><span>Read ↗</span></a>'
    )


def guides_index(articles: list[dict]) -> str:
    url = f"{BASE}/guides/"
    title = "LitBuy Guides 2026: Shipping, QC, Returns & Warehouse"
    description = "Independent LitBuy guides for ordering, payments, QC photos, returns, warehouse storage, parcel planning and international shipping in 2026."
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "CollectionPage", "@id": url, "name": title, "url": url, "description": description, "numberOfItems": len(articles)},
            {"@type": "ItemList", "itemListElement": [
                {"@type": "ListItem", "position": i, "url": f'{BASE}/guides/{a["slug"]}/', "name": a["title"]}
                for i, a in enumerate(articles, 1)
            ]},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
                {"@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": url},
            ]},
        ],
    }
    cards = "".join(guide_card(article) for article in articles)
    return f'''<!DOCTYPE html><html lang="en"><head>
{tracking_head()}
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{url}"><meta property="og:type" content="website"><meta property="og:site_name" content="LitBuyVIP"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}/litbuy-hero.webp">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(description)}"><meta name="twitter:image" content="{BASE}/litbuy-hero.webp">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="stylesheet" href="/assets/site.css"><script defer src="/assets/site.js"></script>{json_script(schema)}</head>
<body class="compact-header">{header()}<main><section class="content-hero"><div class="breadcrumbs"><a href="/">Home</a> / Buyer guides</div><p class="kicker">2026 RESEARCH LIBRARY</p><h1>LitBuy guides for every buying decision.</h1><p>{len(articles)} independent, long-form guides covering product discovery, payment, ordering, QC, returns, warehouse decisions and international shipping.</p></section><section class="content-shell"><div class="guide-library">{cards}</div></section></main>{footer()}</body></html>'''


def homepage_cards(articles: list[dict]) -> str:
    cards = []
    for index, article in enumerate(articles[:3], 1):
        cards.append(
            f'<article class="guide-card {esc(article["theme"])}"><a class="guide-image" href="/guides/{esc(article["slug"])}/" '
            f'style="background-image:url(\'{esc(article["cover"])}\')" aria-label="Open {esc(article["title"])}"><span>{esc(article["label"])}</span><b>{index:02d}</b></a>'
            f'<div class="guide-info"><small>{esc(article["date"])}</small><h3><a href="/guides/{esc(article["slug"])}/">{esc(article["title"])}</a></h3>'
            f'<p>{esc(article["excerpt"])}</p><a class="text-link" href="/guides/{esc(article["slug"])}/">Read full article ↗</a></div></article>'
        )
    return (
        '<section class="guides section" id="guides"><div class="section-heading"><div><p class="kicker">LATEST BUYER GUIDES</p>'
        '<h2>Original research for smarter parcels.</h2></div><a class="outline-button" href="/guides/">View all buyer guides ↗</a></div>'
        '<div class="guide-grid">' + "".join(cards) + "</div></section>"
    )


def update_homepage(articles: list[dict]) -> None:
    path = SITE / "index.html"
    source = path.read_text(encoding="utf-8")
    title = "LitBuy Spreadsheet 2026: 2,400+ Finds, QC & Shipping"
    description = "Explore 2,400+ curated LitBuy spreadsheet finds, compare QC evidence and plan shipping with independent 2026 buyer guides and parcel tools."
    source = re.sub(r"<title>.*?</title>", f"<title>{esc(title)}</title>", source, count=1)
    source = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(description)}">', source, count=1)
    source = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{esc(title)}">', source, count=1)
    source = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{esc(description)}">', source, count=1)
    source = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{esc(title)}">', source, count=1)
    source = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{esc(description)}">', source, count=1)
    source = re.sub(r'<h1>.*?</h1>', '<h1>LitBuy Spreadsheet 2026:<br><em>Find better pieces. Build a sharper haul.</em></h1>', source, count=1)
    source = re.sub(
        r'<section class="guides section" id="guides">.*?</section><section class="faq',
        homepage_cards(articles) + '<section class="faq',
        source,
        count=1,
        flags=re.DOTALL,
    )
    faq_pairs = re.findall(r'<div class="faq-item"><button[^>]*>.*?<b>(.*?)</b>.*?</button><p>(.*?)</p></div>', source, flags=re.DOTALL)
    faq_entities = [
        {"@type": "Question", "name": html.unescape(re.sub("<.*?>", "", q)), "acceptedAnswer": {"@type": "Answer", "text": html.unescape(re.sub("<.*?>", "", a))}}
        for q, a in faq_pairs
    ]
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "WebSite", "@id": f"{BASE}/#website", "name": "LitBuyVIP", "url": f"{BASE}/", "inLanguage": "en"},
            {"@type": "WebPage", "@id": f"{BASE}/#webpage", "name": title, "url": f"{BASE}/", "description": description, "isPartOf": {"@id": f"{BASE}/#website"}, "inLanguage": "en"},
            {"@type": "FAQPage", "@id": f"{BASE}/#faq", "mainEntity": faq_entities},
        ],
    }
    source = re.sub(r'<script type="application/ld\+json">.*?</script>', json_script(graph), source, count=1, flags=re.DOTALL)
    path.write_text(source, encoding="utf-8")


def update_resource_pages() -> None:
    changes = {
        "qc-finder/index.html": (
            "LitBuy QC Checker 2026: Review Warehouse Photos",
            "Use the LitBuy QC checker to review warehouse photos for identity, size, symmetry, damage and visible construction before accepting an item.",
        ),
        "shipping-guide/index.html": (
            "LitBuy Shipping Calculator Guide 2026: Weight & Freight",
            "Use this LitBuy shipping calculator guide to compare actual and volumetric weight, packaging choices, route limits and the final live freight quote.",
        ),
        "spreadsheet/index.html": (
            "LitBuy Spreadsheet 2026: Curated Finds, QC & Shipping",
            "Browse the LitBuy spreadsheet by category, verify current listings and use QC-aware checks before ordering, consolidating and shipping a parcel.",
        ),
    }
    for relative, (title, description) in changes.items():
        path = SITE / relative
        source = path.read_text(encoding="utf-8")
        source = re.sub(r"<title>.*?</title>", f"<title>{esc(title)}</title>", source, count=1)
        source = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(description)}">', source, count=1)
        source = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{esc(title)}">', source, count=1)
        source = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{esc(description)}">', source, count=1)
        source = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{esc(title)}">', source, count=1)
        source = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{esc(description)}">', source, count=1)
        source = re.sub(r'<h1>.*?</h1>', f'<h1>{esc(title)}</h1>', source, count=1)
        schema = {"@context": "https://schema.org", "@type": "WebPage", "name": title, "url": f"{BASE}/{relative.removesuffix('index.html')}", "description": description}
        source = re.sub(r'<script type="application/ld\+json">.*?</script>', json_script(schema), source, count=1, flags=re.DOTALL)
        path.write_text(source, encoding="utf-8")


def build_sitemap(articles: list[dict]) -> None:
    fixed = [
        ("/", "2026-09-16", "1.0"),
        *[(f"/{lang}/", "2026-09-16", "0.8") for lang in LANGUAGES],
        ("/spreadsheet/", "2026-09-16", "0.9"),
        ("/qc-finder/", "2026-09-16", "0.9"),
        ("/shipping-guide/", "2026-09-16", "0.9"),
        ("/guides/", "2026-09-16", "0.9"),
    ]
    article_urls = [(f'/guides/{a["slug"]}/', iso_date(a.get("modified", a["date"])), "0.8") for a in articles]
    rows = "\n".join(f"  <url><loc>{BASE}{path}</loc><lastmod>{lastmod}</lastmod><priority>{priority}</priority></url>" for path, lastmod, priority in fixed + article_urls)
    (SITE / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{rows}\n</urlset>\n', encoding="utf-8")


def build_redirects(articles: list[dict]) -> None:
    fixed = ["guides", "spreadsheet", "qc-finder", "shipping-guide", *LANGUAGES]
    rows = ["https://www.litbuyvip.org/* https://litbuyvip.org/:splat 301", *[f"/{path} /{path}/ 301" for path in fixed]]
    rows.extend(f'/guides/{a["slug"]} /guides/{a["slug"]}/ 301' for a in articles)
    (SITE / "_redirects").write_text("\n".join(rows) + "\n", encoding="utf-8")


def normalize_language_selects() -> None:
    inline = ' onchange="if(this.value) location.href=this.value"'
    for path in SITE.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        if inline in source:
            path.write_text(source.replace(inline, ""), encoding="utf-8")


def main() -> None:
    articles = (
        json.loads(KEYWORD_ARTICLES_PATH.read_text(encoding="utf-8"))
        + json.loads(SUPPORT_ARTICLES_PATH.read_text(encoding="utf-8"))
        + json.loads(ARTICLES_PATH.read_text(encoding="utf-8"))
    )
    for article in articles:
        article.update(ARTICLE_OVERRIDES.get(article["slug"], {}))
    for article in articles:
        output = SITE / "guides" / article["slug"] / "index.html"
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(article_page(article), encoding="utf-8")
    (SITE / "guides" / "index.html").write_text(guides_index(articles), encoding="utf-8")
    update_homepage(articles)
    update_resource_pages()
    build_sitemap(articles)
    build_redirects(articles)
    normalize_language_selects()
    print(f"Built {len(articles)} LitBuyVIP guides")


if __name__ == "__main__":
    main()
