#!/usr/bin/env python3
"""Run the CSSBuyVip refactor with tolerant multilingual cleanup and strict final checks."""

from __future__ import annotations

import json
import re
from pathlib import Path

import refactor_cssbuyvip_sources as base

_original_refactor_com = base.refactor_com
_original_validate = base.validate


def tolerant_string_values(text: str, key: str, values: list[str]) -> str:
    """Update available language entries without assuming a fixed language count."""
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
    print(f"Updated {index} multilingual values for {key}")
    return updated


def refactor_com_with_cleanup() -> None:
    # Historical versions contain a variable number of translated blocks.
    # The base refactor remains strict about homepage structure and links, while
    # these two copy helpers update whatever language entries are actually present.
    base.replace_i18n_string_values = tolerant_string_values
    base.replace_i18n_benefits = lambda text: text

    _original_refactor_com()
    path = Path("cssbuyvip.com/index.html")
    text = path.read_text(encoding="utf-8")

    # Product source URLs use lowercase kakobuymake.com and remain untouched.
    # This removes only visible, case-sensitive brand wording in multilingual copy.
    text = text.replace("KakobuyMake", "CSSBuy")

    # Soften unsupported English and Chinese claims in historical translation data.
    replacements = {
        "Extensive selection": "Product research range",
        "Transparent pricing & QC": "Pricing and QC context",
        "Vetted sellers, secure checkout": "Seller and link checks",
        "From bags, shoes and watches to sneakers and streetwear — curated finds updated with the latest drops.": "Browse selected links across several categories. Availability, pricing and listing status can change without notice.",
        "Clear pricing plus real QC photos of your actual item, so you verify quality before it ships.": "Pricing and warehouse QC information can support a pre-shipping review when those details are available.",
        "Seller quality, service checks and an agent workflow with familiar payment options.": "Seller and link information is reviewed when available, but seller performance and product pages can change.",
        "International parcel planning with tracking and smarter shipping decisions.": "Compare parcel options and route constraints; tracking and delivery estimates depend on the selected shipping line.",
        "丰富选择": "产品研究范围",
        "透明价格与 QC": "价格与 QC 参考",
        "卖家筛选与安全流程": "卖家与链接核查",
        "从包袋、鞋子、手表到球鞋和街头服饰，持续更新精选好物。": "覆盖多个商品分类与精选链接；库存、价格和页面状态可能随时变化。",
        "清晰价格加真实 QC 图片，发货前先确认实际商品质量。": "价格和仓库 QC 信息可帮助发货前检查商品，但应以当前页面和个人仓库照片为准。",
        "卖家服务检查和代购流程，让下单与付款更熟悉。": "在可获得信息的情况下核查卖家和链接，但卖家表现与商品页面可能发生变化。",
        "国际包裹规划、物流追踪和更聪明的运输决策。": "提供包裹与线路比较；追踪和时效取决于实际选择的运输线路。",
        "Your trusted CSSBuy spreadsheet guide with curated finds, QC information and shopping workflow support.": "Independent CSSBuy spreadsheet guide with selected finds, QC context and shopping workflow support.",
        "你值得信赖的 CSSBuy 电子表格指南，提供精选商品、QC 信息和购物流程支持。": "独立的 CSSBuy 电子表格指南，提供精选商品、QC 参考和购物流程说明。",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    path.write_text(text, encoding="utf-8")


def validate_with_static_links() -> None:
    _original_validate()
    shop = Path("cssbuyvip/index.html").read_text(encoding="utf-8")
    static_anchor = 'href="${STATIC_GUIDE_URLS[i] || \'/guides/\'}"'
    if shop.count(static_anchor) < 2:
        raise SystemExit("Shop validation failed: homepage and guide-view links were not converted to static URLs")
    if 'setView(\'article\'' in shop and static_anchor not in shop:
        raise SystemExit("Shop validation failed: only hash article navigation remains")


base.refactor_com = refactor_com_with_cleanup
base.validate = validate_with_static_links
base.main()
