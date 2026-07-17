#!/usr/bin/env python3
"""Make the CSSBuyVip source HTML authoritative and remove fragile edge rewrites."""

from __future__ import annotations

import re
from pathlib import Path

SHOP_DIR = Path("cssbuyvip")
COM_DIR = Path("cssbuyvip.com")
SHOP_INDEX = SHOP_DIR / "index.html"
COM_INDEX = COM_DIR / "index.html"

STATIC_GUIDE_URLS = (
    "/guides/best-cssbuy-spreadsheet-2026/",
    "/guides/cssbuy-shipping-cost-guide/",
    "/guides/cssbuy-qc-photos-guide/",
)


def replace_if_present(text: str, old: str, new: str) -> str:
    if new in text:
        return text
    if old in text:
        return text.replace(old, new)
    print(f"Pattern not found and replacement not present: {old[:90]!r}")
    return text


def replace_once_if_present(text: str, old: str, new: str) -> str:
    if new in text:
        return text
    if old in text:
        return text.replace(old, new, 1)
    print(f"One-time pattern not found: {old[:90]!r}")
    return text


def refactor_shop() -> None:
    text = SHOP_INDEX.read_text(encoding="utf-8")
    text = replace_if_present(text, "<title>CSSBuyVip — Full Multilingual CSSBuy Spreadsheet Guide</title>", "<title>CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds</title>")
    text = replace_if_present(text, '<meta name="description" content="Full multilingual CSSBuy resource hub with categories, products, FAQ and SEO guide articles.">', '<meta name="description" content="Browse the latest CSSBuy spreadsheet with organized W2C links, QC guidance, product categories, prices and shipping-relevant details for smarter haul planning.">')
    canonical_block = ('<link rel="canonical" href="https://cssbuyvip.shop/">\n<meta property="og:type" content="website">\n<meta property="og:title" content="CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds">\n<meta property="og:description" content="Browse updated CSSBuy spreadsheet finds with W2C links, QC guidance, product categories and shipping-relevant details.">\n<meta property="og:url" content="https://cssbuyvip.shop/">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"CSSBuyVip Spreadsheet","url":"https://cssbuyvip.shop/","description":"A product-first CSSBuy spreadsheet resource for W2C links, QC photos, product finds and category research."}</script>\n')
    if 'rel="canonical" href="https://cssbuyvip.shop/"' not in text:
        marker = '<meta name="description" content="Browse the latest CSSBuy spreadsheet with organized W2C links, QC guidance, product categories, prices and shipping-relevant details for smarter haul planning.">\n'
        if marker not in text:
            raise SystemExit("Safety stop: updated shop description marker missing")
        text = text.replace(marker, marker + canonical_block, 1)
    text = replace_if_present(text, '"h1":"CSSBuy Spreadsheet, W2C Links, QC Photos, Shipping Tips & Product Picks."', '"h1":"The Best CSSBuy Spreadsheet for W2C Links, QC Photos and Latest Finds."')
    text = replace_if_present(text, '"lead":"This external site helps users coming from CSSBuy and spreadsheet-related searches. It includes real product images, direct product links, category browsing, QC guidance and a simple contact path."', '"lead":"Browse a product-first CSSBuy spreadsheet hub with organized categories, live source links, QC guidance, pricing context and shipping-relevant details before building your haul."')
    text = replace_if_present(text, '"sheet":"Spreadsheet"', '"sheet":"Open Spreadsheet"')
    text = replace_if_present(text, 'href="https://kakobuymake.com/" rel="noopener">${u.sheet}', 'href="/cssbuy-spreadsheet/" rel="noopener">${u.sheet}')
    text = text.replace("real KakobuyMake source pages", "live product source pages")
    static_js = "const STATIC_GUIDE_URLS=" + repr(list(STATIC_GUIDE_URLS)).replace("'", '"') + ";\n"
    if "const STATIC_GUIDE_URLS=" not in text:
        if "function home() {" not in text:
            raise SystemExit("Safety stop: shop home function missing")
        text = text.replace("function home() {", static_js + "function home() {", 1)
    text = replace_once_if_present(text, "const cards = SITE_DATA.articles[currentLang].slice(0,3).map(a=>", "const cards = SITE_DATA.articles[currentLang].slice(0,3).map((a,i)=>")
    article_anchor = 'href="#" onclick="event.preventDefault();setView(\'article\',\'${a.key}\')"'
    static_anchor = 'href="${STATIC_GUIDE_URLS[i] || \'/guides/\'}"'
    if article_anchor in text:
        text = text.replace(article_anchor, static_anchor, 1)
    text = replace_once_if_present(text, "const cards = SITE_DATA.articles[currentLang].map(a=>", "const cards = SITE_DATA.articles[currentLang].map((a,i)=>")
    if article_anchor in text:
        text = text.replace(article_anchor, static_anchor, 1)
    text = text.replace('<a class="outline-link" href="#" onclick="event.preventDefault();setView(\'guides\')">${u.viewAll}</a>', '<a class="outline-link" href="/guides/">${u.viewAll}</a>')
    text = text.replace('href="#" onclick="event.preventDefault();setView(\'guides\')"', 'href="/guides/"')
    SHOP_INDEX.write_text(text, encoding="utf-8")


def normalize_com_hero_actions(text: str) -> str:
    """Keep the guide homepage focused: exactly two actions in the first screen."""
    pattern = re.compile(
        r'(<section class="hero full-bleed-hero">.*?<div class="actions">)'
        r'\s*(?:<a\b[^>]*>.*?</a>\s*)+'
        r'(</div>)',
        re.DOTALL,
    )
    replacement = (
        r'\1\n'
        '        <a class="btn" href="/cssbuy-spreadsheet-guide.html">CSSBuy Guide</a>\n'
        '        <a class="btn alt dark-alt" href="#workflow">How it works</a>\n'
        r'      \2'
    )
    updated, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        raise SystemExit("Safety stop: cssbuyvip.com hero action group not found")
    return updated


def refactor_com() -> None:
    text = COM_INDEX.read_text(encoding="utf-8")
    text = replace_if_present(text, "<title>CSSBuy VIP | Spacious CSSBuy Spreadsheet Guide</title>", "<title>CSSBuy QC & Shipping Guide 2026 – Coupons, Fees and Agent Help</title>")
    text = replace_if_present(text, '<meta name="description" content="CSSBuy VIP is a spacious light-green CSSBuy guide hub with KakobuyMake finds, QC photo tips, shipping advice, SEO articles and multilingual pages.">', '<meta name="description" content="Independent CSSBuy guide covering QC photo checks, shipping planning, coupons, service fees, W2C links and safer agent-shopping decisions in 2026.">')
    og_block = ('<meta property="og:type" content="website">\n<meta property="og:title" content="CSSBuy QC & Shipping Guide 2026 – Coupons, Fees and Agent Help">\n<meta property="og:description" content="Use independent CSSBuy tutorials for QC, shipping, coupons, fees and agent-shopping decisions.">\n<meta property="og:url" content="https://cssbuyvip.com/">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"CSSBuyVip Guide","url":"https://cssbuyvip.com/","description":"An independent CSSBuy tutorial hub covering QC photos, shipping, coupons, fees, W2C links and agent workflows."}</script>\n')
    if 'property="og:title"' not in text:
        marker = '<link rel="canonical" href="https://cssbuyvip.com/">\n'
        if marker not in text:
            raise SystemExit("Safety stop: com canonical marker missing")
        text = text.replace(marker, marker + og_block, 1)
    text = text.replace("Best CSSBuy Spreadsheet for QC-ready finds and smarter shipping.", "CSSBuy QC, Shipping, Coupons and Agent Guide for 2026.")
    text = text.replace("Browse a cleaner CSSBuy resource hub built for KakobuyMake: selected finds, QC photo checks, shipping guidance, category pages and daily SEO article updates.", "Use an independent CSSBuy guide hub for QC photo checks, shipping planning, coupons, service fees, W2C links and daily educational updates.")
    text = text.replace('<a class="btn" href="https://kakobuymake.com/" target="_blank" rel="noopener">Spreadsheet</a>', '<a class="btn" href="/cssbuy-spreadsheet-guide.html">CSSBuy Guide</a>')
    text = normalize_com_hero_actions(text)
    text = text.replace('href="https://kakobuymake.com/" target="_blank" rel="noopener">Open KakobuyMake Spreadsheet</a>', 'href="/cssbuy-spreadsheet-guide.html">Open CSSBuy Spreadsheet Guide</a>')
    wording = [("built for KakobuyMake", "built for CSSBuy product research"), ("Curated KakobuyMake links", "Curated CSSBuy product links"), ("main KakobuyMake sections", "main CSSBuy product categories"), ("KakobuyMake product discovery pages", "CSSBuy product research pages"), ("KakobuyMake discovery resources", "CSSBuy research and shipping resources"), ("KakobuyMake source pages", "product source pages"), ("KakobuyMake links", "CSSBuy product links"), ("KakobuyMake Spreadsheet", "CSSBuy Spreadsheet Guide"), ("KakobuyMake 电子表格", "CSSBuy 商品指南"), ("KakobuyMake 链接", "CSSBuy 商品链接"), ("KakobuyMake 的主要分类板块", "CSSBuy 商品主要分类板块"), ("KakobuyMake 发现资源", "CSSBuy 商品研究资源"), ("KakobuyMake 来源页面", "CSSBuy 商品来源页面"), ("para KakobuyMake", "para investigar productos con CSSBuy"), ("de KakobuyMake", "del catálogo de productos CSSBuy"), ("für KakobuyMake", "für die CSSBuy-Produktrecherche"), ("KakobuyMake-Bereiche", "CSSBuy-Produktkategorien"), ("KakobuyMake-Ressourcen", "CSSBuy-Recherche-Ressourcen"), ("pour KakobuyMake", "pour la recherche de produits CSSBuy")]
    for old, new in wording:
        text = text.replace(old, new)
    COM_INDEX.write_text(text, encoding="utf-8")


def keep_domains_separate() -> None:
    shop_replacements = {"https://cssbuyvip.com/cssbuy-spreadsheet-guide.html": "/cssbuy-spreadsheet/", "https://cssbuyvip.com/cssbuy-qc-finder.html": "/cssbuy-spreadsheet/", "https://cssbuyvip.com/cssbuy-shipping-calculator.html": "/cssbuy-spreadsheet/", "https://cssbuyvip.com/cssbuy-shipping-cost-guide.html": "/cssbuy-spreadsheet/", "https://cssbuyvip.com/how-to-check-cssbuy-qc-photos.html": "/cssbuy-spreadsheet/", "https://cssbuyvip.com/": "/cssbuy-spreadsheet/"}
    com_replacements = {"https://cssbuyvip.shop/cssbuy-spreadsheet-shoes/": "/cssbuy-qc-finder.html", "https://cssbuyvip.shop/cssbuy-spreadsheet-categories/": "/cssbuy-spreadsheet-guide.html", "https://cssbuyvip.shop/cssbuy-spreadsheet/": "/cssbuy-spreadsheet-guide.html", "https://cssbuyvip.shop/": "/cssbuy-spreadsheet-guide.html"}
    for path in SHOP_DIR.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        for old, new in shop_replacements.items():
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")
    for path in COM_DIR.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        for old, new in com_replacements.items():
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")


def simplify_workers() -> None:
    worker = 'export default {\n  fetch(request, env) {\n    return env.ASSETS.fetch(request);\n  },\n};\n'
    (SHOP_DIR / "_worker.js").write_text(worker, encoding="utf-8")
    (COM_DIR / "_worker.js").write_text(worker, encoding="utf-8")


def validate() -> None:
    shop = SHOP_INDEX.read_text(encoding="utf-8")
    com = COM_INDEX.read_text(encoding="utf-8")
    for item in ["CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds", 'rel="canonical" href="https://cssbuyvip.shop/"', "const STATIC_GUIDE_URLS=", "/guides/best-cssbuy-spreadsheet-2026/", "/guides/cssbuy-shipping-cost-guide/", "/guides/cssbuy-qc-photos-guide/"]:
        if item not in shop:
            raise SystemExit(f"Shop validation failed: {item}")
    for item in ["CSSBuy QC & Shipping Guide 2026 – Coupons, Fees and Agent Help", 'rel="canonical" href="https://cssbuyvip.com/"']:
        if item not in com:
            raise SystemExit(f"Com validation failed: {item}")
    for path in (COM_DIR / "cssbuy-qc-finder.html", COM_DIR / "cssbuy-shipping-calculator.html"):
        if not path.exists():
            raise SystemExit(f"Com tool page missing: {path}")
    hero = re.search(
        r'<section class="hero full-bleed-hero">.*?<div class="actions">(.*?)</div>',
        com,
        re.DOTALL,
    )
    if not hero or len(re.findall(r'<a\b', hero.group(1))) != 2:
        raise SystemExit("Com validation failed: homepage hero must contain exactly two buttons")
    if "/cssbuy-qc-finder.html" in hero.group(1) or "/cssbuy-shipping-calculator.html" in hero.group(1):
        raise SystemExit("Com validation failed: tool buttons must not appear in the first screen")
    if "KakobuyMake" in com:
        raise SystemExit("Com validation failed: visible KakobuyMake wording remains")
    shop_html = " ".join(p.read_text(encoding="utf-8", errors="ignore") for p in SHOP_DIR.rglob("*.html"))
    com_html = " ".join(p.read_text(encoding="utf-8", errors="ignore") for p in COM_DIR.rglob("*.html"))
    if "https://cssbuyvip.com/" in shop_html:
        raise SystemExit("Shop validation failed: cross-domain link remains")
    if "https://cssbuyvip.shop/" in com_html:
        raise SystemExit("Com validation failed: cross-domain link remains")
    for path in (SHOP_DIR / "_worker.js", COM_DIR / "_worker.js"):
        if "replaceAll" in path.read_text(encoding="utf-8"):
            raise SystemExit(f"Worker validation failed: {path}")


def main() -> None:
    refactor_shop()
    refactor_com()
    keep_domains_separate()
    simplify_workers()
    validate()
    print("CSSBuyVip source refactor completed successfully")


if __name__ == "__main__":
    main()
