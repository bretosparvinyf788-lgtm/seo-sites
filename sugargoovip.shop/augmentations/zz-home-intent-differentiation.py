#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
INDEX = ROOT / "index.html"

page = INDEX.read_text(encoding="utf-8")
title = "Sugargoo Spreadsheet 2026 | Updated W2C Finds &amp; QC Photos"
description = "Browse updated Sugargoo spreadsheet finds by category, open verified W2C product links, compare QC details, and plan shipping before ordering."
page = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", page, count=1)
page = re.sub(
    r'<meta content="[^"]*" name="description"/>',
    f'<meta content="{description}" name="description"/>',
    page,
    count=1,
)
page = re.sub(r'<meta content="[^"]*" property="og:title"/>', f'<meta content="{title}" property="og:title"/>', page, count=1)
page = re.sub(r'<meta content="[^"]*" property="og:description"/>', f'<meta content="{description}" property="og:description"/>', page, count=1)
page = re.sub(
    r'"name":"Sugargoo[^"]+","isPartOf"',
    '"name":"Sugargoo Spreadsheet 2026 | Updated W2C Finds & QC Photos","isPartOf"',
    page,
    count=1,
)
page = re.sub(
    r'<a data-home-nav="" href="#finds">.*?</a>',
    '<a data-home-nav="" href="#finds">Spreadsheet</a>',
    page,
    count=1,
)
page = re.sub(
    r'<h1 id="hero-title">.*?</h1>',
    '<h1 id="hero-title">Sugargoo Spreadsheet 2026<br/><em>Shop smarter.</em></h1>',
    page,
    count=1,
)

INDEX.write_text(page, encoding="utf-8")
print("Kept the SugargooVIP.shop homepage aligned to spreadsheet search intent.")
