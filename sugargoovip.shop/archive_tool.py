#!/usr/bin/env python3
"""Inspect or publish the SugargooVIP production archive."""
from __future__ import annotations

import html
import json
import re
import shutil
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JOB = ROOT / "job.json"
ARCHIVE = ROOT / "site.tar.gz"
INSPECTION = ROOT / "inspection"

ARTICLE = {'title': 'Sugargoo Packing Center Guide 2026: Build a Route-Ready Parcel Before You Pay',
 'short_title': 'Sugargoo Packing Center Guide 2026',
 'description': 'A practical Sugargoo Packing Center workflow for consolidating warehouse items, checking route restrictions, estimating chargeable weight and reviewing a parcel before international shipping.',
 'slug': 'guide-sugargoo-packing-center-parcel.html',
 'date': '2026-07-30',
 'display_date': 'July 30, 2026',
 'read_time': '12 min read',
 'label': 'Packing Center · Fact checked',
 'deck': 'A route-first system for turning approved warehouse items into a compatible, measurable and well-documented international parcel.',
 'intro': 'A parcel is not ready because every item has arrived. It is ready when the contents, route, packaging, address and payment details agree with one another.',
 'tags': ['Sugargoo Packing Center',
          'Sugargoo submit parcel',
          'Sugargoo parcel consolidation',
          'Sugargoo warehouse shipping',
          'Sugargoo shipping route',
          'reverse purchasing guide',
          'China shopping agent parcel'],
 'sections': [('Treat the parcel as a shipping specification, not a pile of products',
               'The easiest way to make an expensive mistake with a China shopping agent is to think the job is finished once every product has passed QC. You still have warehouse items with different weights, dimensions, materials and route restrictions. The Packing Center is where those separate items become one shipping specification.\n\nSugargoo’s current official workflow is straightforward: select eligible warehouse items, choose Submit Parcel, enter the delivery address and contact details, add any available packaging services, select a logistics route and pay the international shipping charge. A good parcel must satisfy three things at the same time: every item is approved, the selected route accepts the contents, and the packed size makes economic sense.\n\nPlan backward from a route-ready parcel. Do not automatically select everything that has arrived. First decide what can travel together, what still needs evidence, what creates a restriction and what may turn a light parcel into a bulky one. This guide treats parcel submission as a controlled exit process rather than a final checkout click.'),
              ('Freeze the approved inventory before touching Submit Parcel',
               'Start by creating a clean warehouse list. Mark each item as approved, disputed, waiting for an extra photo, waiting for an exchange, or not intended for this parcel. Only approved items should enter the packing plan. A product with an open return request or unclear QC result should stay outside the parcel, even when including it would make the shipment look more efficient.\n\nSugargoo’s official materials currently describe five free QC photos for shopping-agent items after warehouse receipt. They support visible checks but do not prove authenticity, durability, electronic function or fit. Before consolidation, compare the product identity, selected variation, quantity, visible condition and essential accessories with the original order record. Request a targeted measurement or close-up only when it can change your keep-or-return decision.\n\nCheck storage timing separately. Sugargoo’s current official site advertises 90 days of free warehouse storage, while older official articles may show different periods. The account countdown for the specific order is the safer operational reference. Do not rush a questionable item because of storage time; review older arrivals first and set a shipping date.'),
              ('Build a route-compatibility matrix before you consolidate',
               'A single restricted item can change the routes available to an entire parcel. Batteries, liquids, cosmetics, magnets, branded goods, fragile objects and oversized products may be treated differently by different lines and destinations. Rules change, so an old tutorial cannot promise current availability.\n\nCreate a simple matrix with one row per item and columns for product category, battery or liquid status, approximate weight, approximate dimensions, fragility, original packaging requirement and declared purpose. Then open Sugargoo’s live shipping estimator or route list for your destination and compare the mailing restrictions. If one item removes the routes you would otherwise use, calculate two scenarios: one mixed parcel and one split shipment.\n\nSplitting is not automatically more expensive. Two parcels create two base charges and more handling, but a separate restricted or bulky item may allow the remaining goods to use a cheaper or more suitable line. Compare total delivered cost and risk, not box count. Do not split merely because products came from different sellers; consolidation exists precisely to combine compatible warehouse orders. Split when contents, size, value concentration or route rules create a practical reason.'),
              ('Estimate chargeable weight without pretending the estimate is final',
               'Sugargoo’s official shipping estimator asks for destination, product category, weight and, for bulky goods, parcel dimensions. This is useful before submission because international lines may charge by actual weight, volumetric weight or another route-specific calculation. A light puffer jacket can occupy more billable space than a denser item that weighs more.\n\nBuild a low and high estimate. For the low case, use the warehouse item weights plus a realistic allowance for the outer carton and protective material. For the high case, include the original boxes and use conservative combined dimensions. Run both cases through the live estimator. The range is more useful than a precise-looking number based on guessed dimensions.\n\nAfter packing, measured weight and size can differ from the estimate. That does not mean the calculator failed; it means the final parcel did not exist when you estimated it. Sugargoo also describes a pre-shipment package simulation service that can provide packed measurements before final shipment. Availability and price should be checked in the live account because service terms may change. It is most useful when bulky packaging, multiple shoe boxes, fragile goods or a volumetric route could materially change the bill.'),
              ('Choose packaging services by failure mode, not by habit',
               'Official Sugargoo consolidation guidance lists optional services such as waterproofing, reinforcement and vacuum packaging. The useful question is not “Which extras are popular?” but “What specific failure am I trying to prevent?” Packaging should solve a defined risk without needless weight or volume.\n\nWaterproofing is relevant when moisture exposure would damage the contents. Reinforcement may make sense for fragile goods, heavy mixed parcels or boxes that need better structural protection. Vacuum packaging can reduce the volume of compressible textiles, but it is not suitable for every product and may crease garments or affect shaped items. Removing an original shoe box can reduce volume, while keeping it may matter for protection, resale presentation or collecting.\n\nWrite instructions that are operational. “Protect the corners of the boxed item and keep it separate from the metal hardware” is clearer than “pack well.” Decide which retail boxes, tags and accessories must remain before submission. Once discarded, packaging cannot be reconstructed. Protection can also increase dimensions. The goal is not the smallest possible parcel at any cost; it is the lowest reasonable chargeable weight that still protects the approved contents.'),
              ('Use a three-gate check for route, address and money',
               'Before payment, stop at three separate gates. First is the route gate. Read the live route details for maximum weight, size limits, accepted product types, tracking characteristics, estimated transit range, declaration rules and after-sales or compensation conditions. Choose based on the contents and your risk tolerance, not solely on the lowest displayed price.\n\nSecond is the address gate. Enter the recipient name, street details, apartment or unit, city, region, postal code, country and telephone number in the format required for the destination. Compare it with a successful local delivery label when possible. A route cannot fix an incomplete address. If the recipient name must match identification or customs records in the destination, confirm that before paying.\n\nThird is the money gate. Separate product cost, Chinese domestic delivery, optional warehouse services, international freight, payment-related costs and possible destination taxes. Apply only a coupon that is eligible for the chosen route and parcel, and check its expiry and minimum-spend conditions in the account. Do not redesign a sensible parcel just to use a coupon. A discount is valuable only when the underlying route and packaging plan remain appropriate.'),
              ('Review the packed result before release',
               'When final measurements or parcel photos become available, compare them with the plan. Check that the selected items are present, excluded items are absent, required boxes or accessories were retained, and requested packaging services appear to have been applied. Sugargoo’s official QC guidance says a parcel photo is provided for the final packed condition; treat it as a record of the package exterior, not an x-ray of the contents.\n\nRe-run the route decision if the packed weight or dimensions move into a different pricing band or violate a line limit. A parcel that looked efficient before packing may become volumetric after reinforcement or retained boxes. If the account allows a change before dispatch, compare the cost and risk of adjusting the package rather than accepting a poor result out of impatience.\n\nKeep screenshots of the selected items, parcel number, final weight and dimensions, route, declared information, paid amount, coupon, add-ons and parcel photo. This record makes later questions much easier to resolve. It also gives you real data for the next haul, replacing generic online estimates with your own destination- and product-specific history.'),
              ('Track the handoff and learn from the completed shipment',
               'After payment and dispatch, Sugargoo’s official workflow directs users to My Parcel and Check Logistics for tracking. Early tracking can remain unchanged while the parcel is being handed to the logistics provider or moved to an export hub. Read the route’s normal process before treating every quiet period as a loss.\n\nRecord the actual timeline in stages: parcel submitted, packed, paid, dispatched, first carrier scan, export movement, destination customs, local carrier handoff and delivery. Keep the shipping amount and final chargeable weight beside those dates. This turns one shipment into a useful benchmark. For the next parcel, you can compare cost per kilogram, volumetric impact, route consistency and which packaging choices were genuinely helpful.\n\nThe best Packing Center workflow is therefore a loop. Approve only verified goods, test route compatibility, model size uncertainty, choose packaging for specific risks, verify the address and payment details, preserve the final record and use the delivery result to improve the next plan. Reverse purchasing becomes predictable when each parcel produces better evidence for the one that follows.')],
 'faq': [('Can I combine products from different sellers in one Sugargoo parcel?',
          'Generally, yes. Eligible items that have arrived in the Packing Center can be selected for consolidation. Route restrictions, product type, size or an unresolved after-sales case may justify leaving an item out.'),
         ('Should every warehouse item be shipped as soon as it arrives?',
          'No. Review QC and order details first. Approved items can wait for compatible arrivals within the storage period shown in the account, while disputed items should stay outside any parcel submission.'),
         ('Does the shipping estimator show the final price?',
          'It is a planning estimate based on the information entered. Final packed weight, dimensions, route rules, services and measurement methods can change the amount.'),
         ('When is pre-shipment package simulation useful?',
          'It is most valuable when volume is uncertain, such as parcels with coats, bedding, shoe boxes, fragile protection or several items whose combined dimensions are difficult to predict. Check current availability and pricing in the account.'),
         ('Is one large parcel always cheaper than two smaller parcels?',
          'No. One parcel can reduce repeated base charges, but a restricted, oversized or high-value item may make a split safer or open better routes for the remaining goods. Compare both total scenarios.'),
         ('Which Sugargoo packaging add-ons should I choose?',
          'Choose services for a defined risk. Waterproofing addresses moisture, reinforcement addresses structural damage, and vacuum packaging may reduce compressible textile volume. Availability and suitability depend on the parcel.'),
         ('Can a shipping coupon be used on any route?',
          'Coupon eligibility, expiry, minimum spend and route conditions can vary. Confirm the live terms before payment and do not choose an unsuitable route merely to use a discount.'),
         ('What should I save after submitting the parcel?',
          'Keep the parcel number, selected item list, address, route, declaration details, final weight and dimensions, paid amount, coupon, add-ons, parcel photo and tracking history.')],
 'word_count': 1758}

EXISTING_GUIDES = [{'title': 'Sugargoo Returns & Exchanges Guide 2026: Fix Warehouse Problems Before Shipping',
  'short_title': 'Sugargoo Returns & Exchanges Guide 2026',
  'slug': 'guide-sugargoo-returns-exchanges.html',
  'date': '2026-07-28',
  'display_date': 'July 28, 2026',
  'read_time': '12 min read',
  'word_count': '1,734',
  'category': 'Returns & exchanges guide',
  'cover': 'w2c',
  'summary': 'A warehouse-first system for documenting problems, choosing return or exchange, understanding responsibility and keeping disputed items out of international parcels.',
  'home_label': 'Returns & Exchanges',
  'home_detail': 'Evidence · Responsibility · Resolution',
  'home_summary': 'How to document a warehouse problem, choose exchange or return, protect eligibility and avoid shipping a disputed item overseas.',
  'home_link': 'Read returns guide'},
 {'title': 'Sugargoo Shipping Cost Guide 2026: Weight, Volume, Routes and Real Fees',
  'short_title': 'Sugargoo Shipping Cost Guide 2026',
  'slug': 'guide-shipping-cost.html',
  'date': '2026-07-23',
  'display_date': 'July 23, 2026',
  'read_time': '11 min read',
  'word_count': '1,682',
  'category': 'Shipping guide',
  'cover': 'shipping',
  'summary': 'A fact-checked guide to actual and volumetric weight, route restrictions, consolidation, pre-packaging, coupons, customs and practical ways to control the final bill.',
  'home_label': 'Shipping',
  'home_detail': 'Actual weight · Volume · Route choice',
  'home_summary': 'A practical breakdown of chargeable weight, parcel volume, route rules, consolidation, pre-packaging, coupons and destination costs.',
  'home_link': 'Read shipping guide'},
 {'title': 'Sugargoo QC Photos Guide 2026: How to Inspect 5 Free Warehouse Photos',
  'short_title': 'How to Inspect 5 Free Sugargoo QC Photos',
  'slug': 'guide-qc-photos.html',
  'date': '2026-07-22',
  'display_date': 'July 22, 2026',
  'read_time': '12 min read',
  'word_count': '1,656',
  'category': 'QC guide',
  'cover': 'qc',
  'summary': 'A practical guide to five free warehouse photos, targeted measurements, visible defects and the keep, exchange or return decision.',
  'home_label': 'QC Photos',
  'home_detail': 'Shape · Measurements · Visible defects',
  'home_summary': 'How to use five free warehouse photos, request precise measurements and decide whether to keep, exchange or return an item.',
  'home_link': 'Read QC guide'},
 {'title': 'Sugargoo W2C Guide 2026: From Taobao or Weidian Link to Warehouse Approval',
  'short_title': 'Sugargoo W2C Guide: From Link to Warehouse',
  'slug': 'guide-w2c-workflow.html',
  'date': '2026-07-21',
  'display_date': 'July 21, 2026',
  'read_time': '12 min read',
  'word_count': '1,643',
  'category': 'W2C buying guide',
  'cover': 'w2c',
  'summary': 'A practical workflow from live Taobao or Weidian verification through warehouse approval, consolidation and international tracking.',
  'home_label': 'W2C Workflow',
  'home_detail': 'Source links · Verification · Warehouse',
  'home_summary': 'A complete workflow from live Taobao or Weidian verification through warehouse approval, consolidation and international tracking.',
  'home_link': 'Read W2C guide'}]

OFFICIAL_CITATIONS = [
    "https://blog.sugargoo.com/",
    "https://blog.sugargoo.com/how-does-package-consolidation-work-at-sugargoo/",
    "https://blog.sugargoo.com/estimate-international-shipping-costs-sugargoo/",
    "https://blog.sugargoo.com/sugargoo-qc-service-quality-check-guide/",
    "https://blog.sugargoo.com/sugargoo-returns-refunds-guide/",
]


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def section_id(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def all_guides() -> list[dict]:
    newest = {
        "title": ARTICLE["title"],
        "short_title": ARTICLE["short_title"],
        "slug": ARTICLE["slug"],
        "date": ARTICLE["date"],
        "display_date": ARTICLE["display_date"],
        "read_time": ARTICLE["read_time"],
        "word_count": f"{ARTICLE['word_count']:,}",
        "category": "Packing Center guide",
        "cover": "shipping",
        "summary": ARTICLE["description"],
        "home_label": "Packing Center",
        "home_detail": "Contents · Route · Final review",
        "home_summary": "A route-first checklist for consolidating approved items, controlling parcel size and reviewing every detail before payment.",
        "home_link": "Read packing guide",
    }
    return [newest, *EXISTING_GUIDES]


def article_jsonld() -> str:
    faq_entities = [
        {"@type": "Question", "name": question, "acceptedAnswer": {"@type": "Answer", "text": answer}}
        for question, answer in ARTICLE["faq"]
    ]
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": ARTICLE["title"],
                "description": ARTICLE["description"],
                "datePublished": ARTICLE["date"],
                "dateModified": ARTICLE["date"],
                "wordCount": ARTICLE["word_count"],
                "inLanguage": "en",
                "keywords": ", ".join(ARTICLE["tags"]),
                "mainEntityOfPage": {"@type": "WebPage", "@id": f"https://sugargoovip.shop/{ARTICLE['slug']}"},
                "author": {"@type": "Organization", "name": "SugargooVIP Editorial Team"},
                "publisher": {"@type": "Organization", "name": "SugargooVIP", "url": "https://sugargoovip.shop/"},
                "citation": OFFICIAL_CITATIONS,
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sugargoovip.shop/"},
                    {"@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": "https://sugargoovip.shop/guides.html"},
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Sugargoo Packing Center Guide",
                        "item": f"https://sugargoovip.shop/{ARTICLE['slug']}",
                    },
                ],
            },
            {"@type": "FAQPage", "mainEntity": faq_entities},
        ],
    }
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def render_article() -> str:
    toc = "".join(
        f'<a href="#{section_id(title)}">{index:02d}. {esc(title)}</a>'
        for index, (title, _) in enumerate(ARTICLE["sections"], 1)
    ) + '<a href="#faq">FAQ</a>'
    body = []
    for title, text in ARTICLE["sections"]:
        paragraphs = "".join(f"<p>{esc(paragraph.strip())}</p>" for paragraph in text.split("\n\n") if paragraph.strip())
        body.append(f'<section><h2 id="{section_id(title)}">{esc(title)}</h2>{paragraphs}</section>')
    faq_html = "".join(
        f'<details><summary>{esc(question)}</summary><p>{esc(answer)}</p></details>'
        for question, answer in ARTICLE["faq"]
    )
    tags_html = "".join(f"<span>{esc(tag)}</span>" for tag in ARTICLE["tags"])
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/><title>{esc(ARTICLE['title'])} | SugargooVIP</title><meta content="{esc(ARTICLE['description'])}" name="description"/><meta content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"/><link href="https://sugargoovip.shop/{esc(ARTICLE['slug'])}" rel="canonical"/><link href="assets/css/category-hub-v5.css" rel="stylesheet"/><link href="assets/css/article-v1.css" rel="stylesheet"/><meta content="article" property="og:type"/><meta content="{esc(ARTICLE['title'])}" property="og:title"/><meta content="{esc(ARTICLE['description'])}" property="og:description"/><meta content="https://sugargoovip.shop/{esc(ARTICLE['slug'])}" property="og:url"/><meta content="summary_large_image" name="twitter:card"/><script type="application/ld+json">{article_jsonld()}</script><link href="assets/css/unified-blue-v11.css" rel="stylesheet"/><link href="assets/css/borderless-v13.css" rel="stylesheet"/><link href="assets/img/favicon.png" rel="icon" sizes="192x192" type="image/png"/><link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180"/><link href="assets/css/logo-v20.css" rel="stylesheet"/><link href="assets/css/article-back-nav-v30.css" rel="stylesheet"/><style>.article-faq details{{border:1px solid rgba(30,80,150,.18);border-radius:14px;padding:1rem 1.1rem;margin:.8rem 0;background:#fff}}.article-faq summary{{font-weight:800;cursor:pointer}}.article-faq p{{margin:.75rem 0 0}}.article-tags{{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(30,80,150,.15)}}.article-tags span{{padding:.45rem .75rem;border-radius:999px;background:#eef6ff;font-size:.88rem}}</style></head><body class="article-page" style="--article-accent:#88c7ff"><div class="notice"><div class="frame"><span>Independent Sugargoo buyer resource</span><span>Facts checked July 30, 2026 · Independent buyer resource</span></div></div><header class="hub-header"><div class="frame nav-row"><a class="hub-brand brand-wordmark" href="index.html"><img alt="Sugargoo" class="brand-wordmark-img" src="assets/img/sugargoo-wordmark.png"/><span class="brand-accessible">SugargooVIP</span></a><nav><a href="index.html#departments">Categories</a><a href="spreadsheet.html">Spreadsheet</a><a href="w2c.html">W2C</a><a href="qc.html">QC</a><a href="shipping.html">Shipping</a><a href="guides.html">Guides</a></nav><div class="nav-end"><a class="main-link" href="https://kakobuymake.com/" rel="noopener" target="_blank">Product catalog ↗</a><button aria-label="Toggle navigation" class="mobile-toggle" type="button">☰</button></div></div></header><div aria-label="Article navigation" class="article-return-bar"><div class="article-return-inner"><div class="article-return-actions"><a class="article-return-link primary" href="guides.html">← Back to all guides</a><a class="article-return-link" href="index.html">Home</a></div><span class="article-return-label">SugargooVIP buyer guide</span></div></div><main><section class="article-hero"><div class="frame article-hero-grid"><div><span class="article-label">{esc(ARTICLE['label'])}</span><h1>{esc(ARTICLE['title'])}</h1><p class="article-deck">{esc(ARTICLE['deck'])}</p><div class="article-meta"><span>Published {esc(ARTICLE['display_date'])}</span><span>{esc(ARTICLE['read_time'])}</span><span>{ARTICLE['word_count']:,} words</span></div></div><div class="article-hero-card"><small>Independent buyer guide</small><strong>05</strong><p>Original English editorial content based on current Sugargoo official documentation. Route availability, service pricing, coupons and storage timing must be rechecked in the live account.</p></div></div></section><div class="frame article-shell"><aside class="article-toc"><span>On this page</span><nav>{toc}</nav></aside><article class="article-main"><p class="article-intro">{esc(ARTICLE['intro'])}</p><div class="article-factbox"><b>Research standard</b><p>Facts were checked against Sugargoo’s current official website and official blog on July 30, 2026. The analysis, examples, wording and parcel-planning framework below were written from scratch for SugargooVIP.</p></div>{''.join(body)}<section class="article-faq" id="faq"><h2>Frequently asked questions</h2>{faq_html}</section><div class="article-tags">{tags_html}</div><div class="article-next"><a href="guide-sugargoo-returns-exchanges.html">Next: resolve warehouse problems before parcel submission →</a></div></article></div></main><footer class="hub-footer"><div class="frame footer-grid"><div><a class="hub-brand footer-logo brand-wordmark" href="index.html"><img alt="Sugargoo" class="brand-wordmark-img" src="assets/img/sugargoo-wordmark.png"/><span class="brand-accessible">SugargooVIP</span></a><p>An independent product-discovery and buyer-education resource. Not affiliated with Sugargoo.</p></div><div><b>Discover</b><a href="index.html#departments">Categories</a><a href="spreadsheet.html">Spreadsheet</a><a href="w2c.html">W2C</a></div><div><b>Plan</b><a href="qc.html">QC Guide</a><a href="shipping.html">Shipping</a><a href="coupons.html">Coupons &amp; Fees</a></div><div><b>Site</b><a href="guides.html">Guides</a><a href="about.html">About</a><a href="privacy.html">Privacy</a></div></div><div class="frame footer-bottom"><span>© 2026 SugargooVIP</span><span>Independent buyer resource</span></div></footer><script src="assets/js/category-hub-v5.js"></script></body></html>"""


def home_item_list() -> list[dict]:
    guides = all_guides()[:3]
    return [
        {
            "@type": "ListItem",
            "position": index,
            "item": {
                "@type": "Article",
                "headline": guide["title"],
                "url": f"https://sugargoovip.shop/{guide['slug']}",
                "datePublished": guide["date"],
            },
        }
        for index, guide in enumerate(guides, 1)
    ]


def update_home_jsonld(page: str) -> str:
    matches = list(re.finditer(r'(<script type="application/ld\+json">)(.*?)(</script>)', page, re.S))
    if not matches:
        raise RuntimeError("Homepage JSON-LD was not found")
    for match in matches:
        try:
            data = json.loads(match.group(2))
        except json.JSONDecodeError:
            continue
        changed = False
        nodes = data.get("@graph", []) if isinstance(data, dict) else []
        for node in nodes:
            if node.get("@type") == "CollectionPage":
                for entity in node.get("mainEntity", []):
                    if entity.get("@type") == "ItemList" and entity.get("name") == "Latest Sugargoo buyer guides":
                        entity["numberOfItems"] = 3
                        entity["itemListElement"] = home_item_list()
                        changed = True
        if changed:
            encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
            return page[:match.start(2)] + encoded + page[match.end(2):]
    raise RuntimeError("Homepage Latest Guides JSON-LD was not found")


def card_svg(kind: str) -> str:
    if kind == "qc":
        return '<svg aria-hidden="true" viewBox="0 0 220 160"><rect height="78" rx="14" width="114" x="38" y="42"></rect><path d="m65 42 10-18h42l10 18"></path><circle cx="95" cy="81" r="24"></circle><path d="m145 113 34 31M156 103l30 30"></path><circle cx="149" cy="96" r="31"></circle></svg>'
    if kind == "w2c":
        return '<svg aria-hidden="true" viewBox="0 0 220 160"><path d="M54 48h112v72H54z"></path><path d="M78 48V31h64v17M72 82h76"></path><path d="m91 104-20 20 20 20M71 124h78"></path></svg>'
    return '<svg aria-hidden="true" viewBox="0 0 220 160"><path d="M42 54 110 21l68 33-68 34-68-34Z"></path><path d="M42 54v57l68 32 68-32V54M110 88v55"></path><path d="M76 37l68 34M144 37 76 71"></path><circle cx="176" cy="122" r="26"></circle><path d="M176 106v17l11 7"></path></svg>'


def render_home_card(guide: dict, featured: bool = False) -> str:
    classes = "latest-guide-card latest-guide-featured" if featured else "latest-guide-card"
    cover_class = f"latest-guide-cover latest-guide-{guide['cover']}"
    badge = '<span class="latest-guide-badge">Latest guide</span>' if featured else ""
    return f"""<article class="{classes}"><a aria-label="Read {esc(guide['short_title'])}" class="{cover_class}" href="{esc(guide['slug'])}">{badge}{card_svg(guide['cover'])}<strong>{esc(guide['home_label'])}</strong><small>{esc(guide['home_detail'])}</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="{esc(guide['date'])}">{esc(guide['display_date'])}</time><span>{esc(guide['read_time'])}</span></div><h3><a href="{esc(guide['slug'])}">{esc(guide['short_title'])}</a></h3><p>{esc(guide['home_summary'])}</p><a class="latest-guide-link" href="{esc(guide['slug'])}">{esc(guide['home_link'])} <span>→</span></a></div></article>"""


def render_home_section() -> str:
    latest = all_guides()[:3]
    cards = "".join(render_home_card(guide, index == 0) for index, guide in enumerate(latest))
    return f"""<section aria-labelledby="latest-guides-title" class="latest-guides section-space" id="latest-guides"><div class="frame"><div class="latest-guides-head"><div><span>LATEST SUGARGOO GUIDES</span><h2 id="latest-guides-title">Guides that improve every purchase.</h2></div><div class="latest-guides-intro"><p>Three practical buyer guides covering parcel planning, warehouse returns and shipping costs. Newest articles appear first.</p><a aria-label="Open the complete Sugargoo buyer guides list" data-open-guides="true" href="guides.html" role="link">View all buyer guides <b>↗</b></a></div></div><div class="latest-guides-grid">{cards}</div></div></section>"""


def render_guides() -> str:
    guides = all_guides()
    items = [
        {
            "@type": "ListItem",
            "position": index,
            "item": {
                "@type": "Article",
                "headline": guide["title"],
                "url": f"https://sugargoovip.shop/{guide['slug']}",
                "datePublished": guide["date"],
            },
        }
        for index, guide in enumerate(guides, 1)
    ]
    structured = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Sugargoo Buyer Guides",
            "url": "https://sugargoovip.shop/guides.html",
            "mainEntity": {"@type": "ItemList", "numberOfItems": len(guides), "itemListElement": items},
        },
        ensure_ascii=False,
        separators=(",", ":"),
    )
    cards = []
    for index, guide in enumerate(guides, 1):
        cards.append(
            f'<article><a class="guide-directory-cover {guide["cover"]}" href="{esc(guide["slug"])}"><span>{esc(guide["category"])}</span><b>{index:02d}</b></a><div class="guide-directory-body"><h2><a href="{esc(guide["slug"])}">{esc(guide["title"])}</a></h2><p>{esc(guide["summary"])}</p><div class="guide-directory-meta"><span>{esc(guide["display_date"])}</span><span>{esc(guide["read_time"])}</span></div><a href="{esc(guide["slug"])}">Read the full {esc(guide["word_count"])}-word guide →</a></div></article>'
        )
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/><title>Sugargoo Buyer Guides 2026: Packing Center, Returns, Shipping, QC and W2C</title><meta content="Read five original, fact-checked Sugargoo buyer guides covering Packing Center parcel planning, returns, shipping costs, warehouse QC photos and W2C." name="description"/><meta content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"/><link href="https://sugargoovip.shop/guides.html" rel="canonical"/><link href="assets/css/category-hub-v5.css" rel="stylesheet"/><link href="assets/css/article-v1.css" rel="stylesheet"/><script type="application/ld+json">{structured}</script><link href="assets/css/unified-blue-v11.css" rel="stylesheet"/><link href="assets/css/borderless-v13.css" rel="stylesheet"/><link href="assets/img/favicon.png" rel="icon" sizes="192x192" type="image/png"/><link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180"/><link href="assets/css/logo-v20.css" rel="stylesheet"/><link href="assets/css/guides-back-nav-v31.css" rel="stylesheet"/></head><body><div class="notice"><div class="frame"><span>Independent Sugargoo buyer resource</span><span>Facts checked July 30, 2026 · Independent buyer resource</span></div></div><header class="hub-header"><div class="frame nav-row"><a class="hub-brand brand-wordmark" href="index.html"><img alt="Sugargoo" class="brand-wordmark-img" src="assets/img/sugargoo-wordmark.png"/><span class="brand-accessible">SugargooVIP</span></a><nav><a href="index.html#departments">Categories</a><a href="spreadsheet.html">Spreadsheet</a><a href="w2c.html">W2C</a><a href="qc.html">QC</a><a href="shipping.html">Shipping</a><a href="guides.html">Guides</a></nav><div class="nav-end"><a class="main-link" href="https://kakobuymake.com/" rel="noopener" target="_blank">Product catalog ↗</a><button aria-label="Toggle navigation" class="mobile-toggle" type="button">☰</button></div></div></header><div aria-label="Guide directory navigation" class="guides-return-bar"><div class="guides-return-inner"><a class="guides-return-link" href="index.html">← Back to Home</a><span class="guides-return-label">All SugargooVIP buyer guides</span></div></div><main class="guides-page"><div class="frame"><div class="guides-page-head"><span class="article-label">Original English research</span><h1>Sugargoo Buyer Guides</h1><p>Five long-form reverse-shopping guides written from scratch after checking Sugargoo’s current official documentation. Every historical article remains available, newest first.</p></div><div class="guide-directory">{''.join(cards)}</div></div></main><footer class="hub-footer"><div class="frame footer-grid"><div><a class="hub-brand footer-logo brand-wordmark" href="index.html"><img alt="Sugargoo" class="brand-wordmark-img" src="assets/img/sugargoo-wordmark.png"/><span class="brand-accessible">SugargooVIP</span></a><p>An independent product-discovery and buyer-education resource. Not affiliated with Sugargoo.</p></div><div><b>Discover</b><a href="index.html#departments">Categories</a><a href="spreadsheet.html">Spreadsheet</a><a href="w2c.html">W2C</a></div><div><b>Plan</b><a href="qc.html">QC Guide</a><a href="shipping.html">Shipping</a><a href="coupons.html">Coupons &amp; Fees</a></div><div><b>Site</b><a href="guides.html">Guides</a><a href="about.html">About</a><a href="privacy.html">Privacy</a></div></div><div class="frame footer-bottom"><span>© 2026 SugargooVIP</span><span>Independent buyer resource</span></div></footer><script src="assets/js/category-hub-v5.js"></script></body></html>"""


def patch_home(root: Path) -> None:
    path = root / "index.html"
    page = update_home_jsonld(path.read_text(encoding="utf-8"))
    start = page.index('<section aria-labelledby="latest-guides-title"')
    end = page.index('<section class="finder', start)
    path.write_text(page[:start] + render_home_section() + page[end:], encoding="utf-8")


def patch_sitemap(root: Path) -> None:
    path = root / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")
    xml = re.sub(r'(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+', rf'\g<1>{ARTICLE["date"]}', xml)
    xml = re.sub(r'(<loc>https://sugargoovip\.shop/guides\.html</loc><lastmod>)[^<]+', rf'\g<1>{ARTICLE["date"]}', xml)
    entry = f'  <url><loc>https://sugargoovip.shop/{ARTICLE["slug"]}</loc><lastmod>{ARTICLE["date"]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
    if ARTICLE["slug"] not in xml:
        marker = '  <url><loc>https://sugargoovip.shop/guide-sugargoo-returns-exchanges.html'
        if marker not in xml:
            marker = '  <url><loc>https://sugargoovip.shop/guide-shipping-cost.html'
        if marker not in xml:
            raise RuntimeError("Sitemap guide insertion marker was not found")
        xml = xml.replace(marker, entry + marker, 1)
    path.write_text(xml, encoding="utf-8")


def validate(root: Path) -> dict:
    article = (root / ARTICLE["slug"]).read_text(encoding="utf-8")
    home = (root / "index.html").read_text(encoding="utf-8")
    guides = (root / "guides.html").read_text(encoding="utf-8")
    sitemap = (root / "sitemap.xml").read_text(encoding="utf-8")
    prose = "\n".join(text for _, text in ARTICLE["sections"]) + "\n" + "\n".join(
        question + " " + answer for question, answer in ARTICLE["faq"]
    )
    count = len(re.findall(r"\b[\w’'-]+\b", prose))
    latest_start = home.index('<section aria-labelledby="latest-guides-title"')
    latest_end = home.index('<section class="finder', latest_start)
    latest = home[latest_start:latest_end]
    slugs = [guide["slug"] for guide in all_guides()]
    positions = [latest.find(slug) for slug in slugs[:3]]
    checks = {
        "article_word_count": count,
        "word_count_in_range": 1500 <= count <= 1800,
        "article_h1_present": f"<h1>{esc(ARTICLE['title'])}</h1>" in article,
        "article_meta_description": ARTICLE["description"] in article,
        "article_faq_present": 'id="faq"' in article and article.count("<details>") >= 8,
        "article_canonical": f"https://sugargoovip.shop/{ARTICLE['slug']}" in article,
        "homepage_latest_count": latest.count('class="latest-guide-card') == 3,
        "homepage_newest_first": all(position >= 0 for position in positions) and positions == sorted(positions),
        "homepage_no_old_fourth": slugs[3] not in latest and slugs[4] not in latest,
        "guides_all_articles": all(slug in guides for slug in slugs),
        "guides_exact_card_count": guides.count("<article>") == len(slugs),
        "guide_files_present": all((root / slug).is_file() for slug in slugs),
        "sitemap_has_article": ARTICLE["slug"] in sitemap,
    }
    if not all(value for key, value in checks.items() if key != "article_word_count"):
        raise RuntimeError(f"Validation failed: {checks}")
    return checks


def copy_inspection(root: Path, report: dict | None = None) -> None:
    if INSPECTION.exists():
        shutil.rmtree(INSPECTION)
    INSPECTION.mkdir(parents=True)
    files = sorted(path for path in root.rglob("*") if path.is_file())
    manifest = [{"path": path.relative_to(root).as_posix(), "size": path.stat().st_size} for path in files]
    preferred = [root / name for name in ("index.html", "guides.html", "sitemap.xml", "robots.txt", "_redirects")]
    preferred.extend(sorted(root.glob("guide-*.html")))
    for source in preferred:
        if source.is_file():
            destination = INSPECTION / source.relative_to(root)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
    (INSPECTION / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if report is not None:
        (INSPECTION / "publish-report.json").write_text(
            json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )


def repack(root: Path) -> None:
    temporary = ARCHIVE.with_suffix(".tmp.gz")
    with tarfile.open(temporary, "w:gz", compresslevel=9) as archive:
        for path in sorted(root.rglob("*")):
            archive.add(path, arcname=path.relative_to(root), recursive=False)
    temporary.replace(ARCHIVE)


def inspect_archive() -> None:
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory) / "site"
        root.mkdir()
        with tarfile.open(ARCHIVE, "r:gz") as archive:
            archive.extractall(root)
        copy_inspection(root)


def publish() -> None:
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory) / "site"
        root.mkdir()
        with tarfile.open(ARCHIVE, "r:gz") as archive:
            archive.extractall(root)
        (root / ARTICLE["slug"]).write_text(render_article(), encoding="utf-8")
        (root / "guides.html").write_text(render_guides(), encoding="utf-8")
        patch_home(root)
        patch_sitemap(root)
        checks = validate(root)
        report = {
            "status": "archive_validated",
            "published_at": ARTICLE["date"],
            "article": ARTICLE["slug"],
            "title": ARTICLE["title"],
            "checks": checks,
        }
        repack(root)
        copy_inspection(root, report)


def main() -> None:
    action = json.loads(JOB.read_text(encoding="utf-8")).get("action")
    if action == "inspect":
        inspect_archive()
    elif action == "publish":
        publish()
    else:
        raise SystemExit(f"Unsupported action: {action!r}")


if __name__ == "__main__":
    main()
