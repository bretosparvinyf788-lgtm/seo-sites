#!/usr/bin/env python3
from pathlib import Path


INDEX = Path("index.html")
REPLACEMENTS = {
    '<meta name="description" content="Independent Sugargoo product discovery, QC inspection and international parcel planning guides.">':
        '<meta name="description" content="Learn how to inspect Sugargoo QC photos, compare measurements and decide whether to keep, exchange or return an item before international shipping.">',
    '<meta property="og:title" content="SugargooVIP — Product Finds, QC &amp; Shipping Guides">':
        '<meta property="og:title" content="Sugargoo QC Photo Guide &amp; Warehouse Inspection | SugargooVIP">',
    '<meta property="og:description" content="Independent Sugargoo product discovery, QC inspection and international parcel planning guides.">':
        '<meta property="og:description" content="Inspect Sugargoo QC photos, compare measurements and make a clear warehouse decision before international shipping.">',
    '<title>SugargooVIP — Product Finds, QC &amp; Shipping Guides</title>':
        '<title>Sugargoo QC Photo Guide &amp; Warehouse Inspection | SugargooVIP</title>',
    '>Open spreadsheet ↗</a>':
        '>Open product catalogue ↗</a>',
    '<p class="eyebrow">INDEPENDENT SUGARGOO SHOPPING COMPANION</p><h1>The Smarter Sugargoo Spreadsheet for Better Finds.</h1><p class="hero-text">Discover current product links, compare QC evidence, and plan international parcels with clearer decisions from first click to shipment.</p>':
        '<p class="eyebrow">INDEPENDENT SUGARGOO QC INSPECTION GUIDE</p><h1>Sugargoo QC Photo Guide for Warehouse Decisions.</h1><p class="hero-text">Inspect warehouse photos, compare measurements and decide whether to keep, exchange or return an item before international shipping.</p>',
}


page = INDEX.read_text(encoding="utf-8")
for old, new in REPLACEMENTS.items():
    if old not in page:
        raise RuntimeError(f"Expected homepage fragment not found: {old[:90]}")
    page = page.replace(old, new, 1)

INDEX.write_text(page, encoding="utf-8")
print("Retargeted SugargooVIP.com to QC photo and warehouse-inspection intent.")
