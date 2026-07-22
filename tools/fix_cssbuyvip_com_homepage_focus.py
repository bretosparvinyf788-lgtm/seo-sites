#!/usr/bin/env python3
"""Fix cssbuyvip.com homepage intent while preserving all standalone article bodies."""

from __future__ import annotations

import json
import re
from pathlib import Path

INDEX = Path("cssbuyvip.com/index.html")
GUIDES = Path("cssbuyvip.com/guides/index.html")
ARTICLE_FILES = (
    Path("cssbuyvip.com/best-cssbuy-spreadsheet-2026-guide.html"),
    Path("cssbuyvip.com/cssbuy-shipping-cost-guide.html"),
    Path("cssbuyvip.com/how-to-check-cssbuy-qc-photos.html"),
)
ARTICLE_URLS = (
    "/best-cssbuy-spreadsheet-2026-guide.html",
    "/cssbuy-shipping-cost-guide.html",
    "/how-to-check-cssbuy-qc-photos.html",
)


def replace_language_values(text: str, key: str, values: list[str]) -> str:
    pattern = re.compile(rf'("{re.escape(key)}"\s*:\s*)"[^"]*"')
    index = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal index
        if index >= len(values):
            return match.group(0)
        value = json.dumps(values[index], ensure_ascii=False)
        index += 1
        return match.group(1) + value

    updated = pattern.sub(repl, text)
    print(f"{key}: updated {index} language entries")
    return updated


def remove_embedded_articles(text: str) -> str:
    body_marker = '<body id="top">'
    home_marker = '<div id="home-root">'
    body = text.find(body_marker)
    home = text.find(home_marker)
    if body == -1 or home == -1 or home <= body:
        raise SystemExit("Homepage body markers not found")
    embedded = text[body + len(body_marker):home]
    if '<section id="all-seo-articles"' in embedded or '<section id="article-' in embedded:
        text = text[: body + len(body_marker)] + "\n\n" + text[home:]
    return text


def main() -> None:
    for path in ARTICLE_FILES:
        if not path.exists():
            raise SystemExit(f"Standalone article is missing: {path}")
    if not GUIDES.exists():
        raise SystemExit("The real /guides/ archive is missing")

    text = INDEX.read_text(encoding="utf-8")
    text = remove_embedded_articles(text)

    # Homepage cards now use crawlable standalone article URLs.
    text = text.replace('href="#all-seo-articles"', 'href="/guides/"')
    text = text.replace('href="#article-best"', f'href="{ARTICLE_URLS[0]}"')
    text = text.replace('href="#article-shipping"', f'href="{ARTICLE_URLS[1]}"')
    text = text.replace('href="#article-qc"', f'href="{ARTICLE_URLS[2]}"')

    # Replace search-engine-facing visible wording with user-facing wording.
    text = text.replace("Latest SEO articles", "Latest CSSBuy Guides")
    text = text.replace(
        "Use this module for daily CSSBuy SEO updates and long-tail keyword growth.",
        "Practical guides for QC checks, shipping planning and safer haul decisions.",
    )
    text = replace_language_values(
        text,
        "articles_title",
        ["Latest CSSBuy Guides", "最新 CSSBuy 指南", "Guías recientes de CSSBuy", "Aktuelle CSSBuy-Guides", "Guides CSSBuy récents"],
    )
    text = replace_language_values(
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

    # Replace unsupported absolute claims with accurate conditional language.
    replacements = {
        "Extensive selection": "Product research range",
        "Transparent pricing &amp; QC": "Pricing and QC context",
        "Transparent pricing & QC": "Pricing and QC context",
        "Vetted sellers, secure checkout": "Seller and link checks",
        "From luxury-inspired bags, shoes and watches to sneakers and streetwear — thousands of curated finds, updated with the latest drops.": "Browse selected links across several product categories. Availability, pricing and listing status can change without notice.",
        "From bags, shoes and watches to sneakers and streetwear — curated finds updated with the latest drops.": "Browse selected links across several categories. Availability, pricing and listing status can change without notice.",
        "Clear, upfront pricing plus real QC photos of your actual item, so you verify quality before it ever ships.": "Pricing and warehouse QC information can support a pre-shipping review when those details are available.",
        "Clear pricing plus real QC photos of your actual item, so you verify quality before it ships.": "Pricing and warehouse QC information can support a pre-shipping review when those details are available.",
        "Every seller is vetted for quality and service, and orders run through an agent workflow with safe, familiar payment options.": "Seller and link information is reviewed when available, but listings and seller performance can change. Verify current details before ordering.",
        "Seller quality, service checks and an agent workflow with familiar payment options.": "Seller and link information is reviewed when available, but seller performance and product pages can change.",
        "Consolidated international shipping to North America, Europe, Australia and beyond — with tracking all the way to your door.": "Use route and parcel-planning information as a starting point; tracking and delivery estimates depend on the selected shipping line.",
        "International parcel planning with tracking and smarter shipping decisions.": "Compare parcel options and route constraints; tracking and delivery estimates depend on the selected shipping line.",
        "Your trusted CSSBuy spreadsheet guide with curated finds, QC information and shopping workflow support.": "Independent CSSBuy spreadsheet guide with selected finds, QC context and shopping workflow support.",
        "丰富选择": "产品研究范围",
        "透明价格与 QC": "价格与 QC 参考",
        "卖家筛选与安全流程": "卖家与链接核查",
        "从包袋、鞋子、手表到球鞋和街头服饰，持续更新精选好物。": "覆盖多个商品分类与精选链接；库存、价格和页面状态可能随时变化。",
        "清晰价格加真实 QC 图片，发货前先确认实际商品质量。": "价格和仓库 QC 信息可帮助发货前检查商品，但应以当前页面和个人仓库照片为准。",
        "卖家服务检查和代购流程，让下单与付款更熟悉。": "在可获得信息的情况下核查卖家和链接，但卖家表现与商品页面可能发生变化。",
        "国际包裹规划、物流追踪和更聪明的运输决策。": "提供包裹与线路比较；追踪和时效取决于实际选择的运输线路。",
        "你值得信赖的 CSSBuy 电子表格指南，提供精选商品、QC 信息和购物流程支持。": "独立的 CSSBuy 电子表格指南，提供精选商品、QC 参考和购物流程说明。",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    forbidden = (
        '<section id="all-seo-articles"',
        '<section id="article-best"',
        '<section id="article-shipping"',
        '<section id="article-qc"',
        "Latest SEO articles",
        "long-tail keyword growth",
        "最新 SEO 文章",
        "长尾关键词增长",
        "Every seller is vetted",
        "real QC photos of your actual item",
        "Your trusted CSSBuy spreadsheet guide",
    )
    for item in forbidden:
        if item in text:
            raise SystemExit(f"Legacy homepage content remains: {item}")
    for url in ("/guides/", *ARTICLE_URLS):
        if url not in text:
            raise SystemExit(f"Homepage link missing: {url}")
    if '<div id="home-root">' not in text:
        raise SystemExit("Homepage root was removed unexpectedly")

    INDEX.write_text(text, encoding="utf-8")
    print("cssbuyvip.com homepage focus cleanup completed")


if __name__ == "__main__":
    main()
