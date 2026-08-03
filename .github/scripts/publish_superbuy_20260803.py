from pathlib import Path
import re

slug = "superbuy-restricted-items-parcel-risk-checklist-2026"
route = f"/guides/{slug}/"
article_path = Path(f"superbuyvip.shop/guides/{slug}/index.html")
index_path = Path("superbuyvip.shop/index.html")
guides_path = Path("superbuyvip.shop/guides/index.html")
sitemap_path = Path("superbuyvip.shop/sitemap.xml")

assert article_path.exists(), "new Superbuy article file is missing"

# Update the homepage latest-guides area while preserving all unrelated sections.
index = index_path.read_text(encoding="utf-8")
original_index = index
index = index.replace("<span>Updated July 30, 2026</span>", "<span>Updated August 3, 2026</span>", 1)
old_latest = '''<div class="grid guides"><a class="guide" href="/guides/superbuy-warehouse-storage-strategy-2026/"><div class="guide-cover"><small>JULY 28, 2026</small><strong>Superbuy Warehouse Strategy 2026</strong></div><div class="guide-body"><p>Storage deadlines, QC decisions and smarter consolidation.</p><div class="read"><span>14 min</span><span>Read →</span></div></div></a><a class="guide" href="/guides/superbuy-shipping-costs-2026/"><div class="guide-cover"><small>JULY 24, 2026</small><strong>Superbuy Shipping Costs & Parcel Planning</strong></div><div class="guide-body"><p>Chargeable weight, route compatibility and packaging choices.</p><div class="read"><span>14 min</span><span>Read →</span></div></div></a><a class="guide" href="/guides/superbuy-qc-photos/"><div class="guide-cover"><small>JULY 24, 2026</small><strong>Superbuy QC Photos Guide</strong></div><div class="guide-body"><p>Free images, detailed requests and return decisions.</p><div class="read"><span>14 min</span><span>Read →</span></div></div></a></div>'''
new_latest = '''<div class="grid guides"><a class="guide" href="/guides/superbuy-restricted-items-parcel-risk-checklist-2026/"><div class="guide-cover"><small>AUGUST 3, 2026</small><strong>Superbuy Restricted Items & Parcel Risk Checklist</strong></div><div class="guide-body"><p>Route restrictions, QC evidence, return timing and safer parcel release.</p><div class="read"><span>13 min</span><span>Read →</span></div></div></a><a class="guide" href="/guides/superbuy-warehouse-storage-strategy-2026/"><div class="guide-cover"><small>JULY 28, 2026</small><strong>Superbuy Warehouse Strategy 2026</strong></div><div class="guide-body"><p>Storage deadlines, QC decisions and smarter consolidation.</p><div class="read"><span>14 min</span><span>Read →</span></div></div></a><a class="guide" href="/guides/superbuy-shipping-costs-2026/"><div class="guide-cover"><small>JULY 24, 2026</small><strong>Superbuy Shipping Costs & Parcel Planning</strong></div><div class="guide-body"><p>Chargeable weight, route compatibility and packaging choices.</p><div class="read"><span>14 min</span><span>Read →</span></div></div></a></div>'''
assert index.count(old_latest) == 1, "homepage latest-guide block missing or changed"
index = index.replace(old_latest, new_latest, 1)
latest_start = index.index('<span class="kicker">Latest buyer guides</span>')
latest_end = index.index('<section class="section soft">', latest_start)
latest_segment = index[latest_start:latest_end]
assert latest_segment.count('class="guide"') == 3, "homepage must show exactly three guides"
for required in [slug, "superbuy-warehouse-storage-strategy-2026", "superbuy-shipping-costs-2026"]:
    assert required in latest_segment, f"missing homepage guide: {required}"
positions = [latest_segment.index(x) for x in [slug, "superbuy-warehouse-storage-strategy-2026", "superbuy-shipping-costs-2026"]]
assert positions == sorted(positions), "homepage guides are not newest first"
assert index != original_index, "homepage patch produced no change"
index_path.write_text(index, encoding="utf-8")

# Add the new guide to the complete archive, newest first.
guides = guides_path.read_text(encoding="utf-8")
original_guides = guides
archive_card = '''<a class="guide" href="/guides/superbuy-restricted-items-parcel-risk-checklist-2026/"><div class="guide-cover"><small>AUGUST 3, 2026</small><strong>Superbuy Restricted Items & Parcel Risk Checklist 2026</strong></div><div class="guide-body"><p>Route restrictions, marketplace fees, QC evidence, returns, packaging and parcel release.</p><div class="read"><span>1,598 words</span><span>Read →</span></div></div></a>'''
archive_marker = '<div class="grid guides">'
assert guides.count(archive_marker) == 1, "archive grid marker missing or duplicated"
if slug not in guides:
    guides = guides.replace(archive_marker, archive_marker + archive_card, 1)
guides = guides.replace('warehouse storage, shipping costs, QC photos, W2C research, fees, coupons and country-specific parcel planning.', 'restricted items, warehouse storage, shipping costs, QC photos, W2C research, fees, coupons and country-specific parcel planning.', 1)
assert guides.count(route) == 1, "new guide must appear once in archive"
for preserved in ["superbuy-warehouse-storage-strategy-2026", "superbuy-shipping-costs-2026", "superbuy-qc-photos", "superbuy-w2c"]:
    assert preserved in guides, f"historical guide missing from archive: {preserved}"
assert guides != original_guides, "archive patch produced no change"
guides_path.write_text(guides, encoding="utf-8")

# Refresh sitemap dates and add the new canonical URL.
sitemap = sitemap_path.read_text(encoding="utf-8")
original_sitemap = sitemap
sitemap = re.sub(r'(<loc>https://superbuyvip\.shop/</loc><lastmod>)\d{4}-\d{2}-\d{2}', r'\g<1>2026-08-03', sitemap, count=1)
sitemap = re.sub(r'(<loc>https://superbuyvip\.shop/guides/</loc><lastmod>)\d{4}-\d{2}-\d{2}', r'\g<1>2026-08-03', sitemap, count=1)
entry = f'<url><loc>https://superbuyvip.shop{route}</loc><lastmod>2026-08-03</lastmod><priority>0.9</priority></url>\n'
if route not in sitemap:
    sitemap = sitemap.replace('</urlset>', entry + '</urlset>', 1)
assert sitemap.count(route) == 1, "new sitemap URL missing or duplicated"
assert sitemap != original_sitemap, "sitemap patch produced no change"
sitemap_path.write_text(sitemap, encoding="utf-8")

# Validate the article's technical SEO and body-link rule.
article = article_path.read_text(encoding="utf-8")
assert f'<link rel="canonical" href="https://superbuyvip.shop{route}">' in article
assert '<meta name="description"' in article
assert '<meta name="viewport"' in article
assert 'datePublished":"2026-08-03"' in article
body_match = re.search(r'<article class="article">([\s\S]*?)</article>', article)
assert body_match, "article body missing"
body = body_match.group(1)
# The only body link is the internal back-to-guides navigation after the editorial text.
links = re.findall(r'href="([^"]+)"', body)
assert links == ['/guides/'], f"unexpected links in article body: {links}"
plain = re.sub(r'<[^>]+>', ' ', body)
plain = re.sub(r'\s+', ' ', plain)
word_count = len(re.findall(r"\b[\w¥’'-]+\b", plain))
assert 1500 <= word_count <= 1800, f"article word count outside target range: {word_count}"

print(f"Published {slug}; article body word count: {word_count}")
