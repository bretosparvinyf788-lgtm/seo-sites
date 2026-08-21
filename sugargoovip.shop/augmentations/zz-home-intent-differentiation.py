#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
INDEX = ROOT / "index.html"

REPLACEMENTS = {
    "<title>Sugargoo Spreadsheet 2026 – Categories, W2C Finds &amp; QC Guide</title>":
        "<title>Sugargoo W2C Finds &amp; Category Shopping Guide 2026 | SugargooVIP</title>",
    '<meta content="Browse a category-first Sugargoo spreadsheet with real product images, direct category links, W2C guidance, QC checks, shipping tools and saved finds." name="description"/>':
        '<meta content="Browse Sugargoo W2C finds by category, verify original product links and use practical QC and shipping guidance before ordering." name="description"/>',
    '<meta content="Sugargoo Spreadsheet 2026 – Category Shopping Hub" property="og:title"/>':
        '<meta content="Sugargoo W2C Finds &amp; Category Shopping Guide 2026" property="og:title"/>',
    '<meta content="Browse real categories, product finds, W2C guidance, QC checks and shipping resources." property="og:description"/>':
        '<meta content="Browse category-led W2C finds, verify original product links and use practical QC and shipping guidance." property="og:description"/>',
    '"name":"Sugargoo Spreadsheet 2026 – Category Shopping Hub"':
        '"name":"Sugargoo W2C Finds & Category Shopping Guide 2026"',
    '<a data-home-nav="" href="#finds">Spreadsheet</a>':
        '<a data-home-nav="" href="#finds">Product finds</a>',
    '<h1 id="hero-title">Sugargoo Spreadsheet 2026<br/><em>Shop smarter.</em></h1>':
        '<h1 id="hero-title">Sugargoo W2C Finds 2026<br/><em>Shop by category.</em></h1>',
}


page = INDEX.read_text(encoding="utf-8")
for old, new in REPLACEMENTS.items():
    if old not in page:
        raise RuntimeError(f"Expected homepage fragment not found: {old[:80]}")
    page = page.replace(old, new, 1)

INDEX.write_text(page, encoding="utf-8")
print("Retargeted the SugargooVIP.shop homepage to W2C and category-shopping intent.")
