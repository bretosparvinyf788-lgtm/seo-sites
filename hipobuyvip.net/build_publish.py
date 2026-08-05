from pathlib import Path
import re

site = Path(__file__).resolve().parent
slug = "how-to-order-with-hipobuy-link-to-warehouse-2026"
article_path = site / "articles" / f"{slug}.html"
cover_path = site / "assets" / "guide-order-workflow.svg"
home_path = site / "index.html"
archive_path = site / "articles" / "index.html"
sitemap_path = site / "sitemap.xml"

home_cards = '''<a class="guide-card guide-link-card" href="/articles/how-to-order-with-hipobuy-link-to-warehouse-2026.html">
      <div class="guide-art"><img src="assets/guide-order-workflow.svg" alt="HipoBuy product link, purchasing note, warehouse inspection and parcel workflow guide cover image"></div>
      <div class="guide-body">
        <small>ORDER WORKFLOW</small>
        <h3>How to Order with HipoBuy: Link-to-Warehouse Verification</h3>
        <p>A seven-checkpoint system for verifying product links, variants, buyer notes, warehouse evidence, and parcel compatibility.</p>
        <div class="guide-card-meta"><span>1,773 words</span><span>Read guide →</span></div>
      </div>
    </a>
<a class="guide-card guide-link-card" href="/articles/hipobuy-90-day-free-storage-consolidation-guide.html">
      <div class="guide-art"><img src="assets/guide-storage-consolidation.svg" alt="HipoBuy warehouse storage and parcel consolidation guide cover image"></div>
      <div class="guide-body">
        <small>WAREHOUSE STRATEGY</small>
        <h3>How to Use HipoBuy’s 90-Day Free Storage</h3>
        <p>A time-boxed warehouse plan for coordinating seller arrivals, QC decisions, returns, compatible packing, and parcel submission.</p>
        <div class="guide-card-meta"><span>1,772 words</span><span>Read guide →</span></div>
      </div>
    </a>
<a class="guide-card guide-link-card" href="/articles/how-to-use-hipobuy-spreadsheet-2026.html">
      <div class="guide-art"><img src="assets/generated/88b48672060c890a.png" alt="Spreadsheet strategy guide cover image"></div>
      <div class="guide-body">
        <small>SPREADSHEET STRATEGY</small>
        <h3>How to Use a HipoBuy Spreadsheet in 2026</h3>
        <p>A decision-led workflow for using HipoBuy spreadsheet links, checking live listings, reviewing QC evidence, and building an efficient parcel.</p>
        <div class="guide-card-meta"><span>1,739 words</span><span>Read guide →</span></div>
      </div>
    </a>'''

home = home_path.read_text(encoding="utf-8")
pattern = re.compile(r'(<section class="content-section guides" id="guides">[\s\S]*?<div class="guide-grid">)[\s\S]*?(</div>\s*</div>\s*</section>)')
match = pattern.search(home)
assert match, "Homepage guide section was not found"
home = home[:match.start()] + match.group(1) + home_cards + match.group(2) + home[match.end():]
latest = pattern.search(home).group(0)
assert latest.count('class="guide-card guide-link-card"') == 3
assert latest.index(slug) < latest.index("hipobuy-90-day-free-storage-consolidation-guide") < latest.index("how-to-use-hipobuy-spreadsheet-2026")
home_path.write_text(home, encoding="utf-8")

archive_card = '''<a class="guide-list-card" href="how-to-order-with-hipobuy-link-to-warehouse-2026.html">
      <div class="guide-visual"><img src="../assets/guide-order-workflow.svg" alt="HipoBuy product link, purchasing note, warehouse inspection and parcel workflow guide cover image"></div>
      <div class="guide-list-body">
        <small>ORDER WORKFLOW</small>
        <h2>How to Order with HipoBuy in 2026: A Link-to-Warehouse Verification System</h2>
        <p>A seven-checkpoint system for verifying product links, variants, buyer notes, warehouse evidence, and parcel compatibility.</p>
        <div class="guide-list-meta"><span>1,773 words</span><span>Read guide →</span></div>
      </div>
    </a>
'''
archive = archive_path.read_text(encoding="utf-8")
marker = '<div class="container guide-list-grid">'
assert archive.count(marker) == 1
if f'href="{slug}.html"' not in archive:
    archive = archive.replace(marker, marker + archive_card, 1)
assert archive.count(f'href="{slug}.html"') == 1
for old_slug in ["hipobuy-90-day-free-storage-consolidation-guide.html", "how-to-use-hipobuy-spreadsheet-2026.html", "are-hipobuy-qc-photos-free.html", "how-hipobuy-shipping-cost-works.html"]:
    assert old_slug in archive
archive_path.write_text(archive, encoding="utf-8")

sitemap = sitemap_path.read_text(encoding="utf-8")
new_url = f"https://hipobuyvip.net/articles/{slug}.html"
if new_url not in sitemap:
    entry = f'''  <url>\n    <loc>{new_url}</loc>\n    <lastmod>2026-08-05</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n'''
    anchor = '  <url>\n    <loc>https://hipobuyvip.net/articles/hipobuy-90-day-free-storage-consolidation-guide.html</loc>'
    assert anchor in sitemap
    sitemap = sitemap.replace(anchor, entry + anchor, 1)
assert sitemap.count(new_url) == 1
sitemap_path.write_text(sitemap, encoding="utf-8")

article = article_path.read_text(encoding="utf-8")
assert '<link rel="canonical" href="https://hipobuyvip.net/articles/how-to-order-with-hipobuy-link-to-warehouse-2026.html">' in article
assert 'datePublished' in article and '2026-08-05' in article
body_match = re.search(r'<article class="body">([\s\S]*?)<div class="article-nav">', article)
assert body_match
body = body_match.group(1)
assert 'href=' not in body
plain = re.sub(r'<[^>]+>', ' ', body)
word_count = len(re.findall(r"\b[\w’'-]+\b", plain))
assert 1500 <= word_count <= 1800, word_count
cover = cover_path.read_text(encoding="utf-8")
assert cover.startswith('<svg') and 'width="1200" height="675"' in cover
print(f"HipoBuyVIP publication ready; article body word count: {word_count}")
Path(__file__).unlink(missing_ok=True)
