#!/usr/bin/env python3
from pathlib import Path


INDEX = Path("index.html")
REPLACEMENTS = {
    '<meta name="description" content="Independent Sugargoo product discovery, QC inspection and international parcel planning guides.">':
        '<meta name="description" content="Use the Sugargoo VIP spreadsheet to find product links, review warehouse QC photos and plan lower-risk international parcels with independent buyer guides.">',
    '<meta property="og:title" content="SugargooVIP — Product Finds, QC &amp; Shipping Guides">':
        '<meta property="og:title" content="Sugargoo VIP Spreadsheet 2026 | QC Photos &amp; Shipping Guide">',
    '<meta property="og:description" content="Independent Sugargoo product discovery, QC inspection and international parcel planning guides.">':
        '<meta property="og:description" content="Find product links, review Sugargoo warehouse QC photos and plan international parcels with independent buyer guides.">',
    '<title>SugargooVIP — Product Finds, QC &amp; Shipping Guides</title>':
        '<title>Sugargoo VIP Spreadsheet 2026 | QC Photos &amp; Shipping Guide</title>',
    '>Open spreadsheet ↗</a>':
        '>Open Sugargoo spreadsheet ↗</a>',
    '<p class="eyebrow">INDEPENDENT SUGARGOO SHOPPING COMPANION</p><h1>The Smarter Sugargoo Spreadsheet for Better Finds.</h1><p class="hero-text">Discover current product links, compare QC evidence, and plan international parcels with clearer decisions from first click to shipment.</p>':
        '<p class="eyebrow">INDEPENDENT SUGARGOO BUYER GUIDE · 2026</p><h1>Sugargoo VIP Spreadsheet: Find, Check and Ship Smarter.</h1><p class="hero-text">Use current product links to build a shortlist, compare warehouse QC evidence with the saved listing, and plan parcel weight, restrictions and shipping before submission.</p>',
}


page = INDEX.read_text(encoding="utf-8")
for old, new in REPLACEMENTS.items():
    if old in page:
        page = page.replace(old, new, 1)
    elif new not in page:
        raise RuntimeError(f"Expected homepage fragment not found: {old[:90]}")

INDEX.write_text(page, encoding="utf-8")
print("Retargeted SugargooVIP.com to spreadsheet, QC and shipping intent.")
