from pathlib import Path
import re

slug = "hipobuy-size-verification-seller-chart-qc-measurement-2026"
route = f"/guides/{slug}/"
article_path = Path(f"hipobuyvip.shop/guides/{slug}/index.html")
index_path = Path("hipobuyvip.shop/index.html")
worker_path = Path("hipobuyvip.shop/_worker.js")
sitemap_path = Path("hipobuyvip.shop/sitemap.xml")

assert article_path.exists(), "new Hipobuy article file is missing"

# Patch the static homepage without touching unrelated sections.
text = index_path.read_text(encoding="utf-8")
original_index = text
start_marker = '<!-- Latest 3 buyer guides only. Keep this section capped at three cards; the full ordered list lives in #guide-hub below. -->'
end_marker = '        <!-- More complete category cards -->'
assert text.count(start_marker) == 1, "latest-guides start marker missing or duplicated"
assert text.count(end_marker) == 1, "latest-guides end marker missing or duplicated"

latest_block = '''<!-- Latest 3 buyer guides only. Keep this section capped at three cards; the full ordered list lives in #guide-hub below. -->
        <section class="latest-guides" id="blog">
            <div class="section-header">
                <div>
                    <div class="eyebrow">Editorial Guides</div>
                    <h2>Latest Buyer Guides &amp; Reviews</h2>
                    <p>Practical reads for reverse-purchasing more safely, reducing avoidable sizing mistakes, and making better Hipobuy warehouse decisions.</p>
                </div>
                <a class="section-link" href="#guide-hub">View All Buyer Guides →</a>
            </div>
            <div class="guide-grid">
                <article class="guide-card" data-filter-text="hipobuy size guide clothing seller chart qc measurements exchange warehouse">
                    <div class="thumb">
                        <span class="guide-badge">Sizing</span>
                        <span class="thumb-icon">📏</span>
                        <span>Fit Protocol</span>
                    </div>
                    <div class="guide-card-body">
                        <div class="guide-meta"><span>Size Verification</span><span>August 3, 2026</span></div>
                        <h3><a href="/guides/hipobuy-size-verification-seller-chart-qc-measurement-2026/">Hipobuy Size Verification Protocol 2026</a></h3>
                        <p>Convert seller charts into measurable purchase notes, targeted warehouse QC, return deadlines, and a release gate before international shipping.</p>
                    </div>
                </article>
                <article class="guide-card" data-filter-text="hipobuy shipping estimate parcel compact protected split warehouse consolidation">
                    <div class="thumb">
                        <span class="guide-badge">Shipping</span>
                        <span class="thumb-icon">📦</span>
                        <span>Scenario Planner</span>
                    </div>
                    <div class="guide-card-body">
                        <div class="guide-meta"><span>Parcel Planning</span><span>July 30, 2026</span></div>
                        <h3><a href="/guides/hipobuy-parcel-scenario-planning-shipping-estimate-2026/">Hipobuy Parcel Scenario Planning 2026</a></h3>
                        <p>Compare compact, protected, and split parcel plans with approved warehouse inventory, live route quotes, coupon checks, and a traceable checkout record.</p>
                    </div>
                </article>
                <article class="guide-card" data-filter-text="hipobuy return exchange seller evidence warehouse release">
                    <div class="thumb">
                        <span class="guide-badge">Returns</span>
                        <span class="thumb-icon">↩️</span>
                        <span>Decision Desk</span>
                    </div>
                    <div class="guide-card-body">
                        <div class="guide-meta"><span>Return &amp; Exchange</span><span>July 28, 2026</span></div>
                        <h3><a href="/guides/hipobuy-return-exchange-evidence-warehouse-release-workflow-2026/">Hipobuy Return &amp; Exchange Decision Desk 2026</a></h3>
                        <p>Build a claim-ready QC evidence pack, compare exchange and return paths, reconcile refunds, and keep unresolved goods out of an international parcel.</p>
                    </div>
                </article>
            </div>
        </section>

'''
before, rest = text.split(start_marker, 1)
_, after = rest.split(end_marker, 1)
text = before + latest_block + end_marker + after

hub_marker = '<!-- Full buyer guide hub. Keep every published guide here, newest first, with no three-card limit. -->'
grid_marker = '            <div class="category-grid">'
assert text.count(hub_marker) == 1, "All Buyer Guides marker missing or duplicated"
hub_pos = text.index(hub_marker)
grid_pos = text.index(grid_marker, hub_pos)
new_hub_card = '''
                <a class="category-card" href="/guides/hipobuy-size-verification-seller-chart-qc-measurement-2026/">
                    <div class="category-icon">📏</div>
                    <h3>Size Verification Protocol 2026</h3>
                    <p>Verify seller charts with targeted QC measurements, exchange gates, and a personal fit record.</p>
                    <span class="category-cta">Read guide →</span>
                </a>'''
if slug not in text[grid_pos:]:
    insert_at = grid_pos + len(grid_marker)
    text = text[:insert_at] + new_hub_card + text[insert_at:]

text = text.replace("UPDATED JULY 2026 · INDEPENDENT HIPOBUY BUYER RESEARCH · CHECK LIVE TERMS BEFORE ORDERING", "UPDATED AUGUST 2026 · INDEPENDENT HIPOBUY BUYER RESEARCH · CHECK LIVE TERMS BEFORE ORDERING")
text = text.replace("UPDATED JULY 30, 2026", "UPDATED AUGUST 3, 2026")

latest_segment = text[text.index(start_marker):text.index(end_marker)]
assert latest_segment.count('<article class="guide-card"') == 3, "homepage Latest Guides must contain exactly three cards"
latest_slugs = [
    slug,
    "hipobuy-parcel-scenario-planning-shipping-estimate-2026",
    "hipobuy-return-exchange-evidence-warehouse-release-workflow-2026",
]
positions = [latest_segment.index(item) for item in latest_slugs]
assert positions == sorted(positions), "homepage guide order is not newest first"
assert text.count(route) == 2, "new guide should appear once in Latest Guides and once in All Buyer Guides"
for preserved in [
    'id="recently-checked"',
    'id="qc-case"',
    'id="shipping-lab"',
    'id="buyer-stories"',
    'id="buyer-reviews"',
    'class="section faq-section"',
    'class="main-category-grid"',
]:
    assert preserved in text, f"preserved homepage structure missing: {preserved}"
assert text != original_index, "homepage patch produced no change"
index_path.write_text(text, encoding="utf-8")

# Patch the Cloudflare worker that normalizes the visible homepage guide system.
worker = worker_path.read_text(encoding="utf-8")
original_worker = worker
route_line = f"  'article-size': '{route}',\n"
if "'article-size':" not in worker:
    worker = worker.replace("const ROUTES = {\n", "const ROUTES = {\n" + route_line, 1)

latest_worker = '''const latest = `<div class="story-grid"><article class="story-card feature"><a aria-label="Read Hipobuy size verification guide" class="story-art numeral" href="${ROUTES['article-size']}">08</a><small>SIZE VERIFICATION · 14 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-size']}">Hipobuy Size Verification Protocol 2026: Seller Charts, QC Measurements and Exchange Gates</a></h3><p>Turn size labels into measurement evidence with seller-chart checks, targeted warehouse QC, exchange timing and a parcel release gate.</p><a href="${ROUTES['article-size']}">READ STORY →</a></article><article class="story-card"><a aria-label="Read Hipobuy parcel scenario planning guide" class="story-art numeral" href="${ROUTES['article-parcel']}">07</a><small>PARCEL SCENARIO PLANNING · 13 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-parcel']}">Hipobuy Parcel Scenario Planning 2026: Compare Compact, Protected and Split Shipping Plans</a></h3><p>Compare three warehouse-to-door parcel plans with live route quotes, packing trade-offs, coupon checks and a traceable checkout record.</p><a href="${ROUTES['article-parcel']}">READ STORY →</a></article><article class="story-card"><a aria-label="Read Hipobuy returns and exchanges guide" class="story-art checker" href="${ROUTES['article-returns']}">06</a><small>RETURN &amp; EXCHANGE CONTROL · 14 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-returns']}">Hipobuy Return &amp; Exchange Decision Desk 2026: Evidence, Seller Timing and Warehouse Release</a></h3><p>Build a warehouse evidence packet, track seller decisions and release only resolved inventory into a parcel.</p><a href="${ROUTES['article-returns']}">READ STORY →</a></article></div><button class="mobile-all-guides" data-open-panel="guide-hub" type="button">VIEW ALL SEO ARTICLES →</button>`;'''
worker, count = re.subn(r"const latest = `[\s\S]*?`;\n\nconst allGuides =", latest_worker + "\n\nconst allGuides =", worker, count=1)
assert count == 1, "worker latest-guide block was not found exactly once"

all_guides_worker = '''const allGuides = `<div class="guide-hub-grid"><a class="guide-static-link" href="${ROUTES['article-size']}"><span>08 · AUGUST 3, 2026 · SIZE VERIFICATION</span><b>Hipobuy Size Verification Protocol 2026: Seller Charts, QC Measurements and Exchange Gates</b><small>Seller charts, measurement-focused QC, return timing, replacement checks and parcel release control.</small></a><a class="guide-static-link" href="${ROUTES['article-parcel']}"><span>07 · JULY 30, 2026 · PARCEL SCENARIO PLANNING</span><b>Hipobuy Parcel Scenario Planning 2026: Compare Compact, Protected and Split Shipping Plans</b><small>Warehouse inventory, packing trade-offs, route comparisons, coupons and a traceable shipping checkout.</small></a><a class="guide-static-link" href="${ROUTES['article-returns']}"><span>06 · JULY 28, 2026 · RETURN &amp; EXCHANGE CONTROL</span><b>Hipobuy Return &amp; Exchange Decision Desk 2026: Evidence, Seller Timing and Warehouse Release</b><small>Warehouse evidence, seller timing, return and exchange decisions, refund tracking and safe parcel release.</small></a><a class="guide-static-link" href="${ROUTES['article-w2c']}"><span>05 · JULY 24, 2026 · W2C ORDER CONTROL</span><b>Hipobuy W2C Link Control 2026: Lock Variants, Seller Instructions and Warehouse Exceptions</b><small>Variant locks, seller questions, payment checks, warehouse exceptions and parcel compatibility.</small></a><a class="guide-static-link" href="${ROUTES['article-payments']}"><span>04 · JULY 22, 2026 · TWO-STAGE PAYMENT CONTROL</span><b>Hipobuy Two-Payment Workflow 2026: Avoid Shipping Cost Surprises</b><small>Merchandise payment, domestic delivery, warehouse decisions, international freight, duplicate-payment checks and refund tracking.</small></a><a class="guide-static-link" href="${ROUTES['article-beginner']}"><span>03 · JULY 17, 2026 · OFFICIAL-SOURCE WORKFLOW</span><b>Hipobuy Buying Workflow 2026: From Taobao or 1688 Link to Global Parcel</b><small>Purchasing, warehouse control, 90-day storage, QC decisions and route selection.</small></a><a class="guide-static-link" href="${ROUTES['article-qc']}"><span>02 · JULY 17, 2026 · QC EVIDENCE ENGINEERING</span><b>Hipobuy QC Photos Explained: A Decision Protocol for Shoes and Clothing</b><small>Identity, measurements, construction evidence, targeted requests and approval thresholds.</small></a><a class="guide-static-link" href="${ROUTES['article-fees']}"><span>01 · JULY 17, 2026 · COST & CLAIM AUDIT</span><b>Hipobuy Shipping, Coupons and Costs: What Official Information Confirms</b><small>Coupon interpretation, displayed payments, storage scope, parcel billing and unconfirmed fees.</small></a></div>`;'''
worker, count = re.subn(r"const allGuides = `[\s\S]*?`;\n\nconst schema =", all_guides_worker + "\n\nconst schema =", worker, count=1)
assert count == 1, "worker All Buyer Guides block was not found exactly once"
worker = worker.replace("UPDATED JULY 2026 · INDEPENDENT HIPOBUY BUYER RESEARCH · CHECK LIVE TERMS BEFORE ORDERING", "UPDATED AUGUST 2026 · INDEPENDENT HIPOBUY BUYER RESEARCH · CHECK LIVE TERMS BEFORE ORDERING")
worker = worker.replace("UPDATED JULY 30, 2026", "UPDATED AUGUST 3, 2026")

worker_latest = re.search(r"const latest = `([\s\S]*?)`;\n\nconst allGuides", worker)
worker_all = re.search(r"const allGuides = `([\s\S]*?)`;\n\nconst schema", worker)
assert worker_latest and worker_latest.group(1).count('<article class="story-card') == 3, "worker homepage must show exactly three guides"
worker_positions = [worker_latest.group(1).index(item) for item in latest_slugs]
assert worker_positions == sorted(worker_positions), "worker homepage guide order is not newest first"
assert worker_all and worker_all.group(1).count('class="guide-static-link"') == 8, "worker guide hub must contain all eight guides"
assert worker.count("'article-size':") == 1, "new worker route missing or duplicated"
assert worker != original_worker, "worker patch produced no change"
worker_path.write_text(worker, encoding="utf-8")

# Add the new URL to the sitemap and refresh the homepage date.
sitemap = sitemap_path.read_text(encoding="utf-8")
original_sitemap = sitemap
sitemap = re.sub(r'(<loc>https://hipobuyvip\.shop/</loc><lastmod>)\d{4}-\d{2}-\d{2}', r'\g<1>2026-08-03', sitemap, count=1)
entry = f'  <url><loc>https://hipobuyvip.shop{route}</loc><lastmod>2026-08-03</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n'
anchor = '  <url><loc>https://hipobuyvip.shop/guides/hipobuy-parcel-scenario-planning-shipping-estimate-2026/'
assert anchor in sitemap, "sitemap article anchor missing"
if route not in sitemap:
    sitemap = sitemap.replace(anchor, entry + anchor, 1)
assert sitemap.count(route) == 1, "new sitemap URL missing or duplicated"
assert sitemap != original_sitemap, "sitemap patch produced no change"
sitemap_path.write_text(sitemap, encoding="utf-8")

print("Hipobuy August 3 article synchronized safely across homepage, worker and sitemap.")