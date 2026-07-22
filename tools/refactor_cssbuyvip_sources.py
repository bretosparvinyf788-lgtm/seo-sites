#!/usr/bin/env python3
"""Make the CSSBuyVip source HTML authoritative and remove fragile edge rewrites."""

from __future__ import annotations

import json
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

COM_ARTICLE_URLS = (
    "/best-cssbuy-spreadsheet-2026-guide.html",
    "/cssbuy-shipping-cost-guide.html",
    "/how-to-check-cssbuy-qc-photos.html",
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


def remove_embedded_com_article_routes(text: str) -> str:
    """Keep article copy on its standalone URLs, not inside the homepage document."""
    body_marker = '<body id="top">'
    home_marker = '<div id="home-root">'
    body_pos = text.find(body_marker)
    home_pos = text.find(home_marker)
    if body_pos == -1 or home_pos == -1 or home_pos < body_pos:
        raise SystemExit("Safety stop: cssbuyvip.com body or home root not found")
    between = text[body_pos + len(body_marker):home_pos]
    if '<section id="all-seo-articles"' in between or '<section id="article-' in between:
        text = text[: body_pos + len(body_marker)] + "\n\n" + text[home_pos:]
    return text


def replace_i18n_string_values(text: str, key: str, values: list[str]) -> str:
    pattern = re.compile(rf'("{re.escape(key)}"\s*:\s*)"[^"]*"')
    index = 0

    def replacement(match: re.Match[str]) -> str:
        nonlocal index
        if index >= len(values):
            return match.group(0)
        value = json.dumps(values[index], ensure_ascii=False)
        index += 1
        return match.group(1) + value

    updated = pattern.sub(replacement, text)
    if index < len(values):
        raise SystemExit(f"Safety stop: expected {len(values)} values for {key}, found {index}")
    return updated


def replace_i18n_benefits(text: str) -> str:
    benefit_sets = [
        [
            ["Product research range", "Browse selected links across several categories. Availability, pricing and listing status can change without notice."],
            ["Pricing and QC context", "Pricing and warehouse QC information can support a pre-shipping review when those details are available."],
            ["Seller and link checks", "Seller and link information is reviewed when available, but seller performance and product pages can change."],
            ["Shipping planning", "Compare parcel options and route constraints; tracking and delivery estimates depend on the selected shipping line."],
        ],
        [
            ["产品研究范围", "覆盖多个商品分类与精选链接；库存、价格和页面状态可能随时变化。"],
            ["价格与 QC 参考", "价格和仓库 QC 信息可帮助发货前检查商品，但应以当前页面和个人仓库照片为准。"],
            ["卖家与链接核查", "在可获得信息的情况下核查卖家和链接，但卖家表现与商品页面可能发生变化。"],
            ["运输规划", "提供包裹与线路比较；追踪和时效取决于实际选择的运输线路。"],
        ],
        [
            ["Alcance de investigación", "Consulta enlaces seleccionados de varias categorías; el stock, el precio y el estado del anuncio pueden cambiar."],
            ["Contexto de precio y QC", "La información de precio y QC del almacén puede ayudar a revisar el artículo antes del envío cuando esté disponible."],
            ["Revisión de vendedores y enlaces", "Se revisa la información disponible, pero el rendimiento del vendedor y los anuncios pueden cambiar."],
            ["Planificación del envío", "Compara opciones y restricciones; el seguimiento y los plazos dependen de la línea elegida."],
        ],
        [
            ["Produktrecherche", "Ausgewählte Links aus mehreren Kategorien; Bestand, Preis und Angebotsstatus können sich ändern."],
            ["Preis- und QC-Kontext", "Preis- und Lager-QC-Informationen können die Prüfung vor dem Versand unterstützen, sofern sie verfügbar sind."],
            ["Verkäufer- und Linkprüfung", "Verfügbare Informationen werden geprüft, aber Verkäuferleistung und Produktseiten können sich ändern."],
            ["Versandplanung", "Vergleiche Optionen und Einschränkungen; Tracking und Laufzeit hängen von der gewählten Linie ab."],
        ],
        [
            ["Champ de recherche", "Consultez des liens sélectionnés dans plusieurs catégories; stock, prix et annonces peuvent changer."],
            ["Contexte prix et QC", "Les informations de prix et de QC d’entrepôt peuvent aider avant l’expédition lorsqu’elles sont disponibles."],
            ["Vérification vendeurs et liens", "Les informations disponibles sont examinées, mais les vendeurs et les annonces peuvent évoluer."],
            ["Planification de l’envoi", "Comparez les options et restrictions; le suivi et les délais dépendent de la ligne choisie."],
        ],
    ]
    pattern = re.compile(r'"benefits"\s*:\s*\[\[.*?\]\]', re.DOTALL)
    index = 0

    def replacement(match: re.Match[str]) -> str:
        nonlocal index
        if index >= len(benefit_sets):
            return match.group(0)
        block = json.dumps(benefit_sets[index], ensure_ascii=False, separators=(",", ":"))
        index += 1
        return '"benefits":' + block

    updated = pattern.sub(replacement, text)
    if index < len(benefit_sets):
        raise SystemExit(f"Safety stop: expected {len(benefit_sets)} benefit blocks, found {index}")
    return updated


def improve_com_user_facing_copy(text: str) -> str:
    text = text.replace("Latest SEO articles", "Latest CSSBuy Guides")
    text = text.replace(
        "Use this module for daily CSSBuy SEO updates and long-tail keyword growth.",
        "Practical guides for QC checks, shipping planning and safer haul decisions.",
    )
    text = text.replace('href="#all-seo-articles"', 'href="/guides/"')
    text = text.replace('href="#article-best"', f'href="{COM_ARTICLE_URLS[0]}"')
    text = text.replace('href="#article-shipping"', f'href="{COM_ARTICLE_URLS[1]}"')
    text = text.replace('href="#article-qc"', f'href="{COM_ARTICLE_URLS[2]}"')
    text = text.replace("Transparent pricing &amp; QC", "Pricing and QC context")
    text = text.replace("Vetted sellers, secure checkout", "Seller and link checks")
    text = text.replace(
        "Clear, upfront pricing plus real QC photos of your actual item, so you verify quality before it ever ships.",
        "Pricing and warehouse QC information can support a pre-shipping review when those details are available.",
    )
    text = text.replace(
        "Every seller is vetted for quality and service, and orders run through an agent workflow with safe, familiar payment options.",
        "Seller and link information is reviewed when available, but listings and seller performance can change. Verify current details before ordering.",
    )
    text = text.replace(
        "From luxury-inspired bags, shoes and watches to sneakers and streetwear — thousands of curated finds, updated with the latest drops.",
        "Browse selected links across several product categories. Availability, pricing and listing status can change without notice.",
    )
    text = text.replace(
        "Consolidated international shipping to North America, Europe, Australia and beyond — with tracking all the way to your door.",
        "Use route and parcel-planning information as a starting point; tracking and delivery estimates depend on the selected shipping line.",
    )
    text = replace_i18n_string_values(
        text,
        "articles_title",
        ["Latest CSSBuy Guides", "最新 CSSBuy 指南", "Guías recientes de CSSBuy", "Aktuelle CSSBuy-Guides", "Guides CSSBuy récents"],
    )
    text = replace_i18n_string_values(
        text,
        "articles_sub",
        [
            "Practical guides for QC checks, shipping planning and safer haul decisions.",
            "提供 QC 检查、运输规划和更安全购物决策的实用指南。",
            "Guías prácticas para revisar el QC, planificar envíos y tomar decisiones de compra más seguras.",
            "Praktische Guides für QC-Prüfungen, Versandplanung und sicherere Kaufentscheidungen.",
            "Guides pratiques pour le contrôle QC, la planification des envois et des achats plus sûrs.",
        ],
    )
    text = replace_i18n_string_values(
        text,
        "sheet_float_1",
        ["✓ QC research links", "✓ QC 研究链接", "✓ Enlaces para investigar QC", "✓ QC-Recherchelinks", "✓ Liens de recherche QC"],
    )
    text = replace_i18n_string_values(
        text,
        "footer_desc",
        [
            "Independent CSSBuy spreadsheet guide with selected finds, QC context and shopping workflow support.",
            "独立的 CSSBuy 电子表格指南，提供精选商品、QC 参考和购物流程说明。",
            "Guía independiente de CSSBuy con productos seleccionados, contexto QC y apoyo para el proceso de compra.",
            "Unabhängiger CSSBuy-Guide mit ausgewählten Produkten, QC-Kontext und Hilfe zum Einkaufsablauf.",
            "Guide CSSBuy indépendant avec sélections de produits, contexte QC et aide au processus d’achat.",
        ],
    )
    text = replace_i18n_benefits(text)
    return text


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
    text = remove_embedded_com_article_routes(text)
    text = improve_com_user_facing_copy(text)
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
    for item in ["CSSBuy QC & Shipping Guide 2026 – Coupons, Fees and Agent Help", 'rel="canonical" href="https://cssbuyvip.com/"', "Latest CSSBuy Guides", "/guides/", *COM_ARTICLE_URLS]:
        if item not in com:
            raise SystemExit(f"Com validation failed: {item}")
    for path in (
        COM_DIR / "cssbuy-qc-finder.html",
        COM_DIR / "cssbuy-shipping-calculator.html",
        COM_DIR / "best-cssbuy-spreadsheet-2026-guide.html",
        COM_DIR / "cssbuy-shipping-cost-guide.html",
        COM_DIR / "how-to-check-cssbuy-qc-photos.html",
    ):
        if not path.exists():
            raise SystemExit(f"Com content page missing: {path}")
    hero = re.search(
        r'<section class="hero full-bleed-hero">.*?<div class="actions">(.*?)</div>',
        com,
        re.DOTALL,
    )
    if not hero or len(re.findall(r'<a\b', hero.group(1))) != 2:
        raise SystemExit("Com validation failed: homepage hero must contain exactly two buttons")
    if "/cssbuy-qc-finder.html" in hero.group(1) or "/cssbuy-shipping-calculator.html" in hero.group(1):
        raise SystemExit("Com validation failed: tool buttons must not appear in the first screen")
    forbidden = [
        '<section id="all-seo-articles"',
        '<section id="article-best"',
        '<section id="article-shipping"',
        '<section id="article-qc"',
        "Latest SEO articles",
        "long-tail keyword growth",
        "Every seller is vetted",
        "real QC photos of your actual item",
        "Your trusted CSSBuy spreadsheet guide",
    ]
    for item in forbidden:
        if item in com:
            raise SystemExit(f"Com validation failed: legacy or unsupported copy remains: {item}")
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
