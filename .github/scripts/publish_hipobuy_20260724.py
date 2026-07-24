from pathlib import Path

path = Path("hipobuyvip.shop/index.html")
text = path.read_text(encoding="utf-8")
original = text

section_marker = '<section class="section guide-edition" id="buyer-stories">'
story_start_marker = '<div class="story-grid">'
story_end_marker = '</div><button class="mobile-all-guides"'
assert text.count(section_marker) == 1, "buyer-stories section is missing or duplicated"
section_start = text.index(section_marker)
story_start = text.index(story_start_marker, section_start)
story_end = text.index(story_end_marker, story_start)
story_block = '<div class="story-grid">\n<article class="story-card feature">\n<a aria-label="Open Hipobuy W2C link control guide" class="story-art numeral" href="/guides/hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026/">05</a>\n<small>W2C ORDER CONTROL · 14 MIN</small>\n<h3><a class="story-title-link" href="/guides/hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026/">Hipobuy W2C Link Control 2026: Lock Variants, Seller Instructions and Warehouse Exceptions</a></h3>\n<p>A link-to-parcel control system for exact variants, seller questions, payment checks and warehouse exceptions.</p>\n<a href="/guides/hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026/">READ STORY →</a>\n</article>\n<article class="story-card">\n<a aria-label="Open Hipobuy two-payment workflow guide" class="story-art checker" href="/guides/hipobuy-two-payment-workflow-shipping-budget-2026/">PAY</a>\n<small>PAYMENT WORKFLOW · 15 MIN</small>\n<h3><a class="story-title-link" href="/guides/hipobuy-two-payment-workflow-shipping-budget-2026/">Hipobuy Two-Payment Workflow 2026: Avoid Shipping Cost Surprises</a></h3>\n<p>Separate merchandise, domestic delivery and international freight while preventing duplicate-payment mistakes.</p>\n<a href="/guides/hipobuy-two-payment-workflow-shipping-budget-2026/">READ STORY →</a>\n</article>\n<article class="story-card">\n<a aria-label="Open Hipobuy buying workflow guide" class="story-art percentage" href="/guides/hipobuy-buying-workflow-2026/">01</a>\n<small>BEGINNER GUIDE · 12 MIN</small>\n<h3><a class="story-title-link" href="/guides/hipobuy-buying-workflow-2026/">Hipobuy Buying Workflow 2026: From Taobao or 1688 Link to Global Parcel</a></h3>\n<p>A control-tower workflow for purchasing, warehouse review, storage, QC decisions and route selection.</p>\n<a href="/guides/hipobuy-buying-workflow-2026/">READ STORY →</a>\n</article>\n'
text = text[:story_start] + story_block + text[story_end:]

hub_start_marker = '<article class="embedded-panel seo-guide-panel guide-hub-panel" data-panel="guide-hub">'
hub_end_marker = '<article class="embedded-panel seo-guide-panel" data-panel="article-beginner">'
assert text.count(hub_start_marker) == 1, "guide hub is missing or duplicated"
hub_start = text.index(hub_start_marker)
hub_end = text.index(hub_end_marker, hub_start)
hub_block = '<article class="embedded-panel seo-guide-panel guide-hub-panel" data-panel="guide-hub">\n<div class="embedded-kicker">ALL BUYER GUIDES · HIPO BUY RESEARCH</div>\n<h2>All Buyer Guides</h2>\n<p class="embedded-intro">Every published Hipobuy guide, ordered newest first. The homepage highlights only the latest three.</p>\n<div class="guide-hub-grid">\n<button onclick="window.location.href=\'/guides/hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026/\'" type="button">\n<span>05 · JULY 24, 2026 · W2C ORDER CONTROL</span>\n<b>Hipobuy W2C Link Control 2026: Lock Variants, Seller Instructions and Warehouse Exceptions</b>\n<small>Variant locks, seller questions, payment checks, warehouse exceptions and parcel compatibility.</small>\n</button>\n<button onclick="window.location.href=\'/guides/hipobuy-two-payment-workflow-shipping-budget-2026/\'" type="button">\n<span>04 · JULY 22, 2026 · PAYMENT WORKFLOW</span>\n<b>Hipobuy Two-Payment Workflow 2026: Avoid Shipping Cost Surprises</b>\n<small>Two-stage payment planning, shipping budgets, coupon checks and refund records.</small>\n</button>\n<button onclick="window.location.href=\'/guides/hipobuy-buying-workflow-2026/\'" type="button">\n<span>03 · JULY 17, 2026 · OFFICIAL-SOURCE WORKFLOW</span>\n<b>Hipobuy Buying Workflow 2026: From Taobao or 1688 Link to Global Parcel</b>\n<small>Purchasing, warehouse control, 90-day storage, QC decisions and route selection.</small>\n</button>\n<button onclick="window.location.href=\'/guides/hipobuy-qc-photos-explained/\'" type="button">\n<span>02 · JULY 17, 2026 · QC EVIDENCE ENGINEERING</span>\n<b>Hipobuy QC Photos Explained: A Decision Protocol for Shoes and Clothing</b>\n<small>Identity, measurements, construction evidence, targeted requests and approval thresholds.</small>\n</button>\n<button onclick="window.location.href=\'/guides/hipobuy-shipping-coupons-costs/\'" type="button">\n<span>01 · JULY 17, 2026 · COST &amp; CLAIM AUDIT</span>\n<b>Hipobuy Shipping, Coupons and Costs: What Official Information Confirms</b>\n<small>Coupon interpretation, displayed payments, storage scope, parcel billing and unconfirmed fees.</small>\n</button>\n</div>\n</article>\n'
text = text[:hub_start] + hub_block + text[hub_end:]

new_slug = "hipobuy-w2c-link-variant-seller-warehouse-exception-workflow-2026"
second_slug = "hipobuy-two-payment-workflow-shipping-budget-2026"
third_slug = "hipobuy-buying-workflow-2026"

updated_section_start = text.index(section_marker)
updated_story_start = text.index(story_start_marker, updated_section_start)
updated_story_end = text.index(story_end_marker, updated_story_start)
latest = text[updated_story_start:updated_story_end]
assert latest.count('<article class="story-card') == 3, "homepage must contain exactly three latest guide cards"
positions = [latest.index(new_slug), latest.index(second_slug), latest.index(third_slug)]
assert positions == sorted(positions), "homepage guide order is not newest first"
assert latest.count(new_slug) >= 3
assert latest.count(second_slug) >= 3
assert latest.count(third_slug) >= 3

updated_hub_start = text.index(hub_start_marker)
updated_hub_end = text.index(hub_end_marker, updated_hub_start)
hub = text[updated_hub_start:updated_hub_end]
assert hub.count("<button ") == 5, "All Buyer Guides must contain all five published guides"
for slug in [
    new_slug,
    second_slug,
    third_slug,
    "hipobuy-qc-photos-explained",
    "hipobuy-shipping-coupons-costs",
]:
    assert hub.count(slug) == 1, f"guide hub slug missing or duplicated: {slug}"

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

assert text != original, "homepage patch produced no change"
path.write_text(text, encoding="utf-8")
print("Patched homepage with latest three guides and five-guide hub.")
