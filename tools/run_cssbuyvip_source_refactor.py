#!/usr/bin/env python3
"""Run the CSSBuyVip refactor with final multilingual cleanup and stricter checks."""

from __future__ import annotations

from pathlib import Path

import refactor_cssbuyvip_sources as base

_original_refactor_com = base.refactor_com
_original_validate = base.validate


def refactor_com_with_cleanup() -> None:
    _original_refactor_com()
    path = Path("cssbuyvip.com/index.html")
    text = path.read_text(encoding="utf-8")
    # Product source URLs use lowercase kakobuymake.com and remain untouched.
    # This removes only visible, case-sensitive brand wording in multilingual copy.
    text = text.replace("KakobuyMake", "CSSBuy")
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
