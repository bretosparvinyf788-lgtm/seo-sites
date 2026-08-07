from pathlib import Path
import re

slug = "hipobuy-shipping-requote-price-cut-volumetric-coupon-audit-2026"
route = f"/guides/{slug}/"
article_path = Path(f"hipobuyvip.shop/guides/{slug}/index.html")
index_path = Path("hipobuyvip.shop/index.html")
worker_path = Path("hipobuyvip.shop/_worker.js")
sitemap_path = Path("hipobuyvip.shop/sitemap.xml")

assert article_path.exists(), "August 7 article file is missing"

newest = [
    ("10", "SHIPPING RE-QUOTE AUDIT", "14 MIN", route,
     "Hipobuy Shipping Re-Quote Audit 2026: Price Cuts, Volumetric Weight and Coupon Fit",
     "Re-price a stored haul after route changes by comparing live estimates, chargeable weight, packaging, coupons and item restrictions."),
    ("09", "ELECTRONICS CONTROL", "15 MIN", "/guides/hipobuy-electronics-spec-qc-battery-shipping-workflow-2026/",
     "Hipobuy Electronics Buying Protocol 2026: Specs, QC Tests, Batteries and Shipping Compatibility",
     "Lock specifications, confirm labels, test key functions, check batteries and choose a compatible Hipobuy shipping route."),
    ("08", "CLOTHING SIZE CONTROL", "14 MIN", "/guides/hipobuy-size-verification-seller-chart-qc-measurement-2026/",
     "Hipobuy Size Verification Protocol 2026: Seller Charts, QC Measurements and Exchange Gates",
     "Turn size labels into measurable evidence with seller-chart checks, targeted warehouse QC, exchange deadlines and a release gate.")
]

all_guides = [
    ("10", "AUGUST 7, 2026", "SHIPPING RE-QUOTE AUDIT", route,
     "Hipobuy Shipping Re-Quote Audit 2026: Price Cuts, Volumetric Weight and Coupon Fit",
     "Current route quotes, chargeable weight, packaging tests, coupon fit and restricted-item checks."),
    ("09", "AUGUST 5, 2026", "ELECTRONICS CONTROL", "/guides/hipobuy-electronics-spec-qc-battery-shipping-workflow-2026/",
     "Hipobuy Electronics Buying Protocol 2026: Specs, QC Tests, Batteries and Shipping Compatibility",
     "Specifications, labels, function tests, battery checks and route compatibility."),
    ("08", "AUGUST 3, 2026", "CLOTHING SIZE CONTROL", "/guides/hipobuy-size-verification-seller-chart-qc-measurement-2026/",
     "Hipobuy Size Verification Protocol 2026: Seller Charts, QC Measurements and Exchange Gates",
     "Seller charts, W2C records, targeted QC measurements, exchange deadlines and parcel-release checks."),
    ("07", "JULY 30, 2026", "PARCEL SCENARIO PLANNING", "/guides/hipobuy-parcel-scenario-planning-shipping-estimate-2026/",
     "Hipobuy Parcel Scenario Planning 2026: Compare Compact, Protected and Split Shipping Plans",
     "Compact, protected and split parcel comparisons using warehouse evidence, live routes and coupon checks."),
    ("06", "JULY 28, 2026", "RETURN & EXCHANGE CONTROL", "/guides/hipobuy-return-exchange-evidence-warehouse-release-workflow-2026/",
     "Hipobuy Return & Exchange Decision Desk 2026: Evidence, Seller Timing and Warehouse Release",
     "Warehouse evidence, seller timing, return and exchange decisions, refund tracking and safe parcel release."),
    ("05", "JULY 24, 2026", "W2C ORDER CONTROL", "/guides/hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026/",
     "Hipobuy W2C Link Control 2026: Lock Variants, Seller Instructions and Warehouse Exceptions",
     "Variant locks, seller questions, payment checks, warehouse exceptions and parcel compatibility."),
    ("04", "JULY 22, 2026", "PAYMENT WORKFLOW", "/guides/hipobuy-two-payment-workflow-shipping-budget-2026/",
     "Hipobuy Two-Payment Workflow 2026: Avoid Shipping Cost Surprises",
     "Two-stage payment planning, shipping budgets, coupon checks and refund records."),
    ("03", "JULY 17, 2026", "OFFICIAL-SOURCE WORKFLOW", "/guides/hipobuy-buying-workflow-2026/",
     "Hipobuy Buying Workflow 2026: From Taobao or 1688 Link to Global Parcel",
     "Purchasing, warehouse control, 90-day storage, QC decisions and route selection."),
    ("02", "JULY 17, 2026", "QC EVIDENCE ENGINEERING", "/guides/hipobuy-qc-photos-explained/",
     "Hipobuy QC Photos Explained: A Decision Protocol for Shoes and Clothing",
     "Identity, measurements, construction evidence, targeted requests and approval thresholds."),
    ("01", "JULY 17, 2026", "COST & CLAIM AUDIT", "/guides/hipobuy-shipping-coupons-costs/",
     "Hipobuy Shipping, Coupons and Costs: What Official Information Confirms",
     "Coupon interpretation, displayed payments, storage scope, parcel billing and unconfirmed fees."),
]

# Static homepage: patch only the article surfaces and update label date.
text = index_path.read_text(encoding="utf-8")
original_index = text

latest_cards = []
classes = ["story-card feature", "story-card", "story-card"]
arts = ["numeral", "checker", "percentage"]
for (num, label, read, url, title, excerpt), cls, art in zip(newest, classes, arts):
    latest_cards.append(
        f'<article class="{cls}">\n'
        f'<a aria-label="Open {title}" class="story-art {art}" href="{url}">{num}</a>\n'
        f'<small>{label} · {read}</small>\n'
        f'<h3><a class="story-title-link" href="{url}">{title}</a></h3>\n'
        f'<p>{excerpt}</p>\n'
        f'<a href="{url}">READ STORY →</a>\n'
        f'</article>'
    )
latest_html = "\n".join(latest_cards)

latest_pattern = re.compile(
    r'(<section class="section guide-edition" id="buyer-stories">[\s\S]*?<div class="story-grid">)'
    r'[\s\S]*?'
    r'(</div><button class="mobile-all-guides" data-open-panel="guide-hub" type="button">VIEW ALL SEO ARTICLES →</button>)'
)
text, count = latest_pattern.subn(lambda m: m.group(1) + "\n" + latest_html + "\n" + m.group(2), text, count=1)
assert count == 1, "static Latest Guides block was not found exactly once"

hub_buttons = []
for num, date, label, url, title, excerpt in all_guides:
    hub_buttons.append(
        f'<button onclick="window.location.href=\'{url}\'" type="button">\n'
        f'<span>{num} · {date} · {label}</span>\n'
        f'<b>{title.replace("&", "&amp;")}</b>\n'
        f'<small>{excerpt}</small>\n'
        f'</button>'
    )
hub_html = "\n".join(hub_buttons)
hub_pattern = re.compile(
    r'(<article class="embedded-panel seo-guide-panel guide-hub-panel" data-panel="guide-hub">[\s\S]*?<div class="guide-hub-grid">)'
    r'[\s\S]*?'
    r'(</div>\s*</article>)'
)
text, count = hub_pattern.subn(lambda m: m.group(1) + "\n" + hub_html + "\n" + m.group(2), text, count=1)
assert count == 1, "static All Buyer Guides block was not found exactly once"

text = re.sub(r'UPDATED AUGUST \d{1,2}, 2026', 'UPDATED AUGUST 7, 2026', text)
assert text != original_index, "static homepage patch produced no change"

segment = re.search(r'<section class="section guide-edition" id="buyer-stories">([\s\S]*?)</section>', text)
assert segment, "buyer-stories section missing after patch"
assert segment.group(1).count('<article class="story-card') == 3, "homepage must show exactly three guide cards"
positions = [segment.group(1).index(item[3]) for item in newest]
assert positions == sorted(positions), "homepage newest-three order is wrong"
hub_segment = re.search(r'<article class="embedded-panel seo-guide-panel guide-hub-panel" data-panel="guide-hub">([\s\S]*?)</article>', text)
assert hub_segment and hub_segment.group(1).count('<button onclick="window.location.href=') == 10, "All Buyer Guides must contain all ten guides"
for token in [
    'id="recently-checked"', 'id="qc-case"', 'id="shipping-lab"', 'id="buyer-stories"',
    'id="buyer-reviews"', 'class="section faq-section"', 'category-grid', 'product-grid',
    'featured-products'
]:
    assert text.count(token) == original_index.count(token), f"preserved homepage token changed: {token}"
index_path.write_text(text, encoding="utf-8")

# Cloudflare worker: it overwrites the homepage guide surfaces, so keep it in sync.
worker = worker_path.read_text(encoding="utf-8")
original_worker = worker

routes_block = """const ROUTES = {
  'article-requote': '/guides/hipobuy-shipping-requote-price-cut-volumetric-coupon-audit-2026/',
  'article-electronics': '/guides/hipobuy-electronics-spec-qc-battery-shipping-workflow-2026/',
  'article-size': '/guides/hipobuy-size-verification-seller-chart-qc-measurement-2026/',
  'article-parcel': '/guides/hipobuy-parcel-scenario-planning-shipping-estimate-2026/',
  'article-returns': '/guides/hipobuy-return-exchange-evidence-warehouse-release-workflow-2026/',
  'article-w2c': '/guides/hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026/',
  'article-payments': '/guides/hipobuy-two-payment-workflow-shipping-budget-2026/',
  'article-beginner': '/guides/hipobuy-buying-workflow-2026/',
  'article-qc': '/guides/hipobuy-qc-photos-explained/',
  'article-fees': '/guides/hipobuy-shipping-coupons-costs/'
};"""
worker, count = re.subn(r'const ROUTES = \{[\s\S]*?\};', routes_block, worker, count=1)
assert count == 1, "worker ROUTES block not found"

latest_worker = """const latest = `<div class="story-grid"><article class="story-card feature"><a aria-label="Read Hipobuy shipping re-quote guide" class="story-art numeral" href="${ROUTES['article-requote']}">10</a><small>SHIPPING RE-QUOTE AUDIT · 14 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-requote']}">Hipobuy Shipping Re-Quote Audit 2026: Price Cuts, Volumetric Weight and Coupon Fit</a></h3><p>Re-price a stored haul after route changes by comparing live estimates, chargeable weight, packaging, coupons and item restrictions.</p><a href="${ROUTES['article-requote']}">READ STORY →</a></article><article class="story-card"><a aria-label="Read Hipobuy electronics guide" class="story-art checker" href="${ROUTES['article-electronics']}">09</a><small>ELECTRONICS CONTROL · 15 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-electronics']}">Hipobuy Electronics Buying Protocol 2026: Specs, QC Tests, Batteries and Shipping Compatibility</a></h3><p>Lock specifications, confirm labels, test key functions, check batteries and choose a compatible Hipobuy shipping route.</p><a href="${ROUTES['article-electronics']}">READ STORY →</a></article><article class="story-card"><a aria-label="Read Hipobuy size verification guide" class="story-art percentage" href="${ROUTES['article-size']}">08</a><small>CLOTHING SIZE CONTROL · 14 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-size']}">Hipobuy Size Verification Protocol 2026: Seller Charts, QC Measurements and Exchange Gates</a></h3><p>Turn size labels into measurable evidence with seller-chart checks, targeted warehouse QC, exchange deadlines and a release gate.</p><a href="${ROUTES['article-size']}">READ STORY →</a></article></div><button class="mobile-all-guides" data-open-panel="guide-hub" type="button">VIEW ALL SEO ARTICLES →</button>`;"""
worker, count = re.subn(r'const latest = `[\s\S]*?`;\n\nconst allGuides =', latest_worker + "\n\nconst allGuides =", worker, count=1)
assert count == 1, "worker Latest Guides block not found"

wg = []
route_keys = ['article-requote','article-electronics','article-size','article-parcel','article-returns','article-w2c','article-payments','article-beginner','article-qc','article-fees']
for (num, date, label, _url, title, excerpt), key in zip(all_guides, route_keys):
    wg.append(
        f'<a class="guide-static-link" href="${{ROUTES[\'{key}\']}}"><span>{num} · {date} · {label}</span>'
        f'<b>{title.replace("&", "&amp;")}</b><small>{excerpt}</small></a>'
    )
all_worker = "const allGuides = `" + '<div class="guide-hub-grid">' + "".join(wg) + "</div>`;"
worker, count = re.subn(r'const allGuides = `[\s\S]*?`;\n\nconst schema =', all_worker + "\n\nconst schema =", worker, count=1)
assert count == 1, "worker All Buyer Guides block not found"
worker = re.sub(r'UPDATED AUGUST \d{1,2}, 2026', 'UPDATED AUGUST 7, 2026', worker)
assert worker != original_worker, "worker patch produced no change"

worker_latest = re.search(r'const latest = `([\s\S]*?)`;\n\nconst allGuides', worker)
worker_all = re.search(r'const allGuides = `([\s\S]*?)`;\n\nconst schema', worker)
assert worker_latest and worker_latest.group(1).count('<article class="story-card') == 3, "worker must render exactly three latest guides"
for route_key in route_keys[:3]:
    assert route_key in worker_latest.group(1), f"missing worker latest route {route_key}"
assert worker_all and worker_all.group(1).count('class="guide-static-link"') == 10, "worker must render all ten guides"
for route_key in route_keys:
    assert worker.count(f"'{route_key}':") == 1, f"worker route missing or duplicated: {route_key}"
worker_path.write_text(worker, encoding="utf-8")

# Sitemap: prepend the new guide before existing guides and refresh homepage date.
sitemap = sitemap_path.read_text(encoding="utf-8")
original_sitemap = sitemap
sitemap = re.sub(r'(<loc>https://hipobuyvip\.shop/</loc><lastmod>)\d{4}-\d{2}-\d{2}', r'\g<1>2026-08-07', sitemap, count=1)
entry = f'  <url><loc>https://hipobuyvip.shop{route}</loc><lastmod>2026-08-07</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n'
if f'https://hipobuyvip.shop{route}' not in sitemap:
    anchor = '  <url><loc>https://hipobuyvip.shop/guides/hipobuy-electronics-spec-qc-battery-shipping-workflow-2026/'
    assert anchor in sitemap, "sitemap electronics guide anchor missing"
    sitemap = sitemap.replace(anchor, entry + anchor, 1)
assert sitemap.count(f'https://hipobuyvip.shop{route}') == 1, "new sitemap URL missing or duplicated"
assert sitemap != original_sitemap, "sitemap patch produced no change"
sitemap_path.write_text(sitemap, encoding="utf-8")

print("Hipobuy August 7 publication patched and validated.")
