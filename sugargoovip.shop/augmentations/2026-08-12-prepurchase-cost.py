#!/usr/bin/env python3
from __future__ import annotations
import html, json, re, sys
from pathlib import Path

ROOT=Path(sys.argv[1] if len(sys.argv)>1 else 'dist')
SLUG='guide-sugargoo-prepurchase-cost-check.html'
TITLE='Sugargoo Pre-Purchase Cost Check 2026: Decide What Is Worth Buying Before You Pay'
SHORT='Sugargoo Pre-Purchase Cost Check 2026'
DATE='2026-08-12'
DISPLAY='August 12, 2026'
META='A practical Sugargoo pre-purchase cost check for testing live listings, domestic delivery, shipping estimates, QC limits, returns and parcel risk before payment.'
DECK='A buyer-side screening system for testing the real cost and correctability of a China purchase before a low listing price turns into an expensive parcel.'
TAGS=['Sugargoo pre-purchase check','Sugargoo shipping estimate','Sugargoo QC photos','Sugargoo returns','Sugargoo W2C','China shopping agent','reverse purchasing cost']
SOURCES=['https://blog.sugargoo.com/','https://blog.sugargoo.com/how-to-use-taobao-product-link-with-sugargoo/','https://blog.sugargoo.com/sugargoo-freight-calculator/','https://blog.sugargoo.com/sugargoo-quality-check-service-the-ultimate-qc-guide-for-overseas-buyers/','https://blog.sugargoo.com/sugargoo-returns-refunds-guide/','https://blog.sugargoo.com/how-does-package-consolidation-work-at-sugargoo/']
SECTIONS=[
('Start with a landed-cost hypothesis, not the sticker price', '''A low product price can be the least important number in a reverse-purchasing order. Before paying for an item through Sugargoo, treat the listing price as only the first input in a landed-cost hypothesis. You still need to consider seller-to-warehouse delivery, payment-related costs shown at checkout, optional warehouse services, international freight, and any destination-side taxes or charges that may apply.

Sugargoo’s current official buying flow separates the product purchase from the international parcel stage. You first submit a product and pay for the order; after the seller ships to the Sugargoo warehouse and the item is processed, you later select warehouse goods, choose an international route, and pay the parcel shipping charge. That two-stage structure is useful because it prevents a false sense that the product checkout is the final cost.

Before buying, write a three-line estimate: product-stage cost, warehouse-stage contingency, and international-shipping range. The goal is not to predict the final cent. It is to decide whether the item still makes sense when realistic downstream costs are added. If the purchase only looks attractive when you assume free domestic delivery, zero volumetric impact and the cheapest route, the margin for error is too small.'''),
('Verify the live source link before you estimate anything', '''Sugargoo’s official instructions support pasting product links from major Chinese marketplaces into its search bar. A valid source link gives you a current starting point for title, available variants, seller information and the original listing. Do this verification before budgeting, because an old W2C post, spreadsheet or social-media screenshot can preserve a product that has changed price, changed options or disappeared.

Open the live seller page and record the exact variant you intend to buy: size, color, model, quantity and any bundle or accessory choice. Confirm whether the displayed price changes when you choose that variant. Check the seller’s domestic shipping charge instead of assuming it is included. If the page uses tiered quantity pricing, make sure the price you copy matches your actual quantity.

Then preserve the original URL and a short description of the selection in your order notes. This is not busywork. It gives you a stable reference when the purchasing team asks a question or when the warehouse item later needs to be compared with what you ordered. A cost estimate built on the wrong variant is not an estimate; it is noise.'''),
('Model international freight before the item reaches the warehouse', '''Sugargoo provides a shipping fee estimation tool that can be used before parcel submission. Official guidance says the estimator uses details such as destination, product category, weight and, when relevant, dimensions. That makes it valuable before purchase, especially for items whose shipping exposure may be larger than their product price.

Use a range rather than one guessed weight. For a T-shirt or dense accessory, the range can be relatively narrow. For shoes with boxes, padded jackets, pillows, toys or other bulky goods, volume can matter as much as mass. Run a lower case with compact packaging and a higher case with conservative dimensions. If the result changes dramatically, mark the item as shipping-sensitive.

Do not interpret the estimator as a price guarantee. The final parcel does not yet exist, and the available routes, packing dimensions, chargeable-weight method and current rates can change. The pre-purchase question is simpler: does the item remain worthwhile across several plausible shipping outcomes? If yes, you have a robust purchase. If no, investigate packaging, route restrictions or an alternative product before paying.'''),
('Price the risk of QC limitations, not just the promise of QC', '''Sugargoo’s current official materials state that shopping-agent items receive five free QC photos after warehouse receipt, with additional photography services available in some cases. Those photos can help confirm visible details, but they do not turn a risky listing into a guaranteed purchase.

Before paying, list the facts that standard photographs can and cannot answer. They can usually help with visible color, shape, quantity, obvious damage, labels and some size markings. Sugargoo’s own QC guidance also notes limitations for electronics and other characteristics that cannot be established through normal visual inspection. Standard photos do not prove long-term durability, personal fit or every internal function.

Translate that uncertainty into a buying rule. If one measurement is essential, plan to request it promptly after warehouse arrival. If functionality is the core reason for buying an electronic item, do not assume free photos will prove it. If a sealed collectible loses value when opened, decide what inspection level is acceptable before ordering. Good pre-purchase planning does not demand perfect certainty; it identifies which uncertainties could make you return the item.'''),
('Check return practicality before the seller ships', '''A cheap item is expensive if it becomes difficult to correct. Sugargoo’s official returns guidance describes a time-sensitive domestic after-sales process in which eligibility, responsibility, seller rules, item condition and the reason for return can affect whether a request succeeds and who bears domestic costs.

Before buying, check whether the seller appears to support returns for the product type and whether the item is customized, hygiene-sensitive, activated, used or otherwise likely to have special restrictions. Avoid building a plan around a return that the seller may not accept. Once the item reaches the warehouse, review QC quickly rather than letting it sit simply because warehouse storage is available.

For budgeting, create a small “correction allowance” for products with uncertain sizing, fragile construction or inconsistent seller information. That does not mean a return will cost a fixed amount; it means you recognize that domestic return shipping or non-refundable services may exist depending on responsibility and current terms. The best savings often come from preventing a bad order rather than negotiating one after it arrives.'''),
('Use warehouse storage as flexibility, not as permission to overbuy', '''Sugargoo’s current official landing page advertises 90 days of free and secure warehouse storage. That time can be useful when you are waiting for several sellers, comparing parcel combinations or resolving after-sales issues. It should not be treated as an invitation to keep adding products without a shipping plan.

Before the first purchase, decide what closes the haul. It might be a target date, a maximum estimated parcel weight, a fixed product budget, or the arrival of two core items. Every new item should pass the same landed-cost test rather than being justified because it can sit in the warehouse.

This matters because consolidation creates both efficiencies and dependencies. Combining compatible items may reduce repeated packaging or base shipping costs, but one bulky or route-sensitive product can change the parcel options for everything else. Keep a simple warehouse plan with “ship together,” “possible separate parcel,” and “do not buy yet” categories. Storage then becomes planning capacity instead of a place where marginal purchases accumulate unnoticed.'''),
('Build a buy / wait / reject decision table', '''The most useful pre-purchase tool is a one-page decision table. Give each candidate product six fields: live item price, domestic shipping, expected packed weight or volume, route sensitivity, QC-critical question, and return difficulty. Add a seventh field for the international-shipping range from the live estimator.

Now assign one of three decisions. Buy means the live listing is verified, the variant is clear, the shipping range is acceptable and the remaining uncertainties can be checked in the warehouse. Wait means one material fact is missing, such as a seller measurement, restock date, battery specification or packaging size. Reject means the order only works if several optimistic assumptions all turn out true.

This framework is deliberately conservative. It reduces impulse purchases while still allowing uncertain products when the uncertainty is measurable. A ¥50 item that may add substantial volumetric weight can be a worse buy than a ¥150 compact item with predictable shipping. Reverse purchasing becomes easier when you compare total decision quality rather than product prices alone.'''),
('Recheck the numbers at each handoff', '''A pre-purchase plan is useful only if you update it when better information arrives. After the purchasing team confirms the order, record any seller price or domestic-shipping change. When the warehouse signs in the item, replace guessed weight and dimensions with the available warehouse data. Review the five QC photos and resolve any keep-or-return question before adding the item to a parcel.

At parcel-planning time, use the current shipping estimator or route list again rather than relying on the screenshot you saved before purchase. Select only approved items. Compare one consolidated parcel with a split scenario when a bulky, restricted or fragile item materially changes route choices. Then review the final payable details in the live account before payment.

After delivery, save the actual product-stage cost, final chargeable weight, international freight and any destination-side charges. That history improves the next estimate more than generic online averages. The practical advantage of a shopping agent is not that it makes every cost predictable in advance; it gives you checkpoints where guesses can be replaced by real data before the next commitment.''')]
FAQ=[
('Can I know the final Sugargoo shipping price before I buy an item?','No. You can use Sugargoo’s shipping estimator to model plausible costs, but the final parcel weight, dimensions, route availability, services and current rates are only known later. Use a range rather than a single promised figure.'),
('How many free QC photos does Sugargoo currently provide?','Sugargoo’s current official materials state that shopping-agent items receive five free QC photos after warehouse receipt. Additional or specialized inspection services can vary, so check the live account when you need a specific measurement or angle.'),
('Does Sugargoo warehouse storage mean I can delay every decision?','No. The current official landing page advertises 90 days of free warehouse storage, but after-sales opportunities can be much shorter and depend on seller rules and order status. Review QC promptly.'),
('Should I always combine every item into one parcel?','No. Consolidation is useful for compatible goods, but bulky, restricted, fragile or otherwise route-sensitive items can make a split parcel worth comparing. Use current route and estimator information before submission.'),
('What is the most important thing to verify on a W2C or marketplace link?','Verify the live seller page, exact variant, current price, quantity and domestic shipping. A saved link or screenshot can be outdated, so the current listing should control the purchase decision.'),
('Can QC photos prove electronics work correctly?','Do not assume that. Sugargoo’s QC guidance describes limits for electronics and characteristics that normal visual inspection cannot establish. If function is essential, check what service is currently available before ordering.'),
('How should I budget for returns?','Do not invent a fixed return fee. Instead, keep a small correction allowance and verify seller eligibility, responsibility and domestic return terms. Costs and refund treatment can differ by reason and current seller rules.'),
('What is a good signal to reject a purchase before paying?','Reject it when the deal only makes sense if several uncertain assumptions all go your way—for example, no domestic shipping, minimal parcel volume, the cheapest route remaining available and an easy return.')]

def esc(s): return html.escape(str(s),quote=True)
def sid(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
PROSE='\n'.join(t for _,t in SECTIONS)+'\n'+'\n'.join(q+' '+a for q,a in FAQ)
WORD_COUNT=len(re.findall(r"\b[\w’'-]+\b",PROSE))
if not 1500<=WORD_COUNT<=1800: raise RuntimeError(f'Article word count out of range: {WORD_COUNT}')

def render_article():
    toc=''.join(f'<a href="#{sid(h)}">{i:02d}. {esc(h)}</a>' for i,(h,_) in enumerate(SECTIONS,1))+'<a href="#faq">FAQ</a>'
    body=''
    for h,t in SECTIONS:
        body+=f'<section><h2 id="{sid(h)}">{esc(h)}</h2>'+''.join(f'<p>{esc(p.strip())}</p>' for p in t.split('\n\n'))+'</section>'
    faq_html=''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q,a in FAQ)
    faq_schema=[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in FAQ]
    schema={'@context':'https://schema.org','@graph':[{'@type':'Article','headline':TITLE,'description':META,'datePublished':DATE,'dateModified':DATE,'wordCount':WORD_COUNT,'inLanguage':'en','keywords':', '.join(TAGS),'mainEntityOfPage':{'@type':'WebPage','@id':'https://sugargoovip.shop/'+SLUG},'author':{'@type':'Organization','name':'SugargooVIP Editorial Team'},'publisher':{'@type':'Organization','name':'SugargooVIP','url':'https://sugargoovip.shop/'},'citation':SOURCES},{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://sugargoovip.shop/'},{'@type':'ListItem','position':2,'name':'Buyer Guides','item':'https://sugargoovip.shop/guides.html'},{'@type':'ListItem','position':3,'name':SHORT,'item':'https://sugargoovip.shop/'+SLUG}]},{'@type':'FAQPage','mainEntity':faq_schema}]}
    return f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/><title>{esc(TITLE)} | SugargooVIP</title><meta content="{esc(META)}" name="description"/><meta content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"/><link href="https://sugargoovip.shop/{SLUG}" rel="canonical"/><link href="assets/css/category-hub-v5.css" rel="stylesheet"/><link href="assets/css/article-v1.css" rel="stylesheet"/><meta content="article" property="og:type"/><meta content="{esc(TITLE)}" property="og:title"/><meta content="{esc(META)}" property="og:description"/><meta content="https://sugargoovip.shop/{SLUG}" property="og:url"/><meta content="summary_large_image" name="twitter:card"/><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False,separators=(',',':'))}</script><link href="assets/css/unified-blue-v11.css" rel="stylesheet"/><link href="assets/css/borderless-v13.css" rel="stylesheet"/><link href="assets/img/favicon.png" rel="icon" sizes="192x192" type="image/png"/><link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180"/><link href="assets/css/logo-v20.css" rel="stylesheet"/><link href="assets/css/article-back-nav-v30.css" rel="stylesheet"/><style>.article-faq details{{border:1px solid rgba(30,80,150,.18);border-radius:14px;padding:1rem 1.1rem;margin:.8rem 0;background:#fff}}.article-faq summary{{font-weight:800;cursor:pointer}}.article-faq p{{margin:.75rem 0 0}}.article-tags{{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(30,80,150,.15)}}.article-tags span{{padding:.45rem .75rem;border-radius:999px;background:#eef6ff;font-size:.88rem}}</style></head><body class="article-page" style="--article-accent:#88c7ff"><div class="notice"><div class="frame"><span>Independent Sugargoo buyer resource</span><span>Facts checked August 12, 2026 · Independent buyer resource</span></div></div><header class="hub-header"><div class="frame nav-row"><a class="hub-brand brand-wordmark" href="index.html"><img alt="Sugargoo" class="brand-wordmark-img" src="assets/img/sugargoo-wordmark.png"/><span class="brand-accessible">SugargooVIP</span></a><nav><a href="index.html#departments">Categories</a><a href="spreadsheet.html">Spreadsheet</a><a href="w2c.html">W2C</a><a href="qc.html">QC</a><a href="shipping.html">Shipping</a><a href="guides.html">Guides</a></nav><div class="nav-end"><a class="main-link" href="https://kakobuymake.com/" rel="noopener" target="_blank">Product catalog ↗</a><button aria-label="Toggle navigation" class="mobile-toggle" type="button">☰</button></div></div></header><div aria-label="Article navigation" class="article-return-bar"><div class="article-return-inner"><div class="article-return-actions"><a class="article-return-link primary" href="guides.html">← Back to all guides</a><a class="article-return-link" href="index.html">Home</a></div><span class="article-return-label">SugargooVIP buyer guide</span></div></div><main><section class="article-hero"><div class="frame article-hero-grid"><div><span class="article-label">Pre-Purchase Cost Check · Fact checked</span><h1>{esc(TITLE)}</h1><p class="article-deck">{esc(DECK)}</p><div class="article-meta"><span>Published {DISPLAY}</span><span>12 min read</span><span>{WORD_COUNT:,} words</span></div></div><div class="article-hero-card"><small>Independent buyer guide</small><strong>10</strong><p>Original English editorial content based on current Sugargoo official documentation. Live seller terms, route availability, prices and service rules should be rechecked before payment.</p></div></div></section><div class="frame article-shell"><aside class="article-toc"><span>On this page</span><nav>{toc}</nav></aside><article class="article-main"><p class="article-intro">The cheapest moment to discover a bad buying assumption is before payment. This guide turns a product link into a simple cost-and-risk test before you commit money to the domestic order.</p><div class="article-factbox"><b>Research standard</b><p>Facts were checked against Sugargoo’s current official website and official buyer guides on August 12, 2026. The cost model, examples, wording and decision framework below were written from scratch for SugargooVIP.</p></div>{body}<section class="article-faq" id="faq"><h2>FAQ: Sugargoo pre-purchase cost checks</h2>{faq_html}</section><div class="article-tags">{''.join(f'<span>{esc(t)}</span>' for t in TAGS)}</div><div class="article-bottom-nav"><a href="guides.html">← View all buyer guides</a><a href="index.html">Back to homepage →</a></div></article></div></main><footer class="hub-footer"><div class="frame footer-grid"><div><a class="hub-brand footer-logo brand-wordmark" href="index.html"><img alt="Sugargoo" class="brand-wordmark-img" src="assets/img/sugargoo-wordmark.png"/><span class="brand-accessible">SugargooVIP</span></a><p>An independent product-discovery and buyer-education resource. Not affiliated with Sugargoo.</p></div><div><b>Discover</b><a href="index.html#departments">Categories</a><a href="spreadsheet.html">Spreadsheet</a><a href="w2c.html">W2C</a></div><div><b>Plan</b><a href="qc.html">QC Guide</a><a href="shipping.html">Shipping</a><a href="coupons.html">Coupons &amp; Fees</a></div><div><b>Site</b><a href="guides.html">Guides</a><a href="about.html">About</a><a href="privacy.html">Privacy</a></div></div><div class="frame footer-bottom"><span>© 2026 SugargooVIP</span><span>Independent buyer resource</span></div></footer><script src="assets/js/category-hub-v5.js"></script></body></html>'''

def replace_first_jsonld(page,updater):
    m=re.search(r'<script type="application/ld\+json">(.*?)</script>',page,re.S)
    if not m: raise RuntimeError('JSON-LD block not found')
    data=updater(json.loads(m.group(1)))
    return page[:m.start(1)]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+page[m.end(1):]

def patch_guides():
    p=ROOT/'guides.html'; page=p.read_text(encoding='utf-8')
    def upd(data):
        ent=data['mainEntity']; url='https://sugargoovip.shop/'+SLUG
        items=[x for x in ent.get('itemListElement',[]) if x.get('item',{}).get('url')!=url]
        items.insert(0,{'@type':'ListItem','position':1,'item':{'@type':'Article','headline':TITLE,'url':url,'datePublished':DATE}})
        for i,x in enumerate(items,1): x['position']=i
        ent['numberOfItems']=len(items); ent['itemListElement']=items; return data
    page=replace_first_jsonld(page,upd)
    page=re.sub(r'<title>.*?</title>','<title>Sugargoo Buyer Guides 2026: Pre-Purchase Planning, Warehouse, QC, Shipping and W2C</title>',page,count=1,flags=re.S)
    page=re.sub(r'<meta content="[^"]*" name="description"/>','<meta content="Read ten original Sugargoo buyer guides covering pre-purchase cost checks, warehouse timing, order evidence, payments, packing, returns, shipping, QC and W2C." name="description"/>',page,count=1)
    page=page.replace('Facts checked August 7, 2026','Facts checked August 12, 2026')
    page=re.sub(r'<p>Nine long-form reverse-shopping guides.*?</p>','<p>Ten long-form reverse-shopping guides written from scratch after checking Sugargoo’s current official documentation. Every historical article remains available, newest first.</p>',page,count=1,flags=re.S)
    if SLUG not in page.split('<div class="guide-directory">',1)[1]:
        card=f'<article><a class="guide-directory-cover shipping" href="{SLUG}"><span>Pre-purchase cost guide</span><b>01</b></a><div class="guide-directory-body"><h2><a href="{SLUG}">{esc(TITLE)}</a></h2><p>{esc(META)}</p><div class="guide-directory-meta"><span>{DISPLAY}</span><span>12 min read</span></div><a href="{SLUG}">Read the full {WORD_COUNT:,}-word guide →</a></div></article>'
        page=page.replace('<div class="guide-directory">','<div class="guide-directory">'+card,1)
    s=page.index('<div class="guide-directory">'); e=page.index('</div></div></main>',s); d=page[s:e]; n=iter(range(1,100)); d=re.sub(r'<b>\d{2}</b>',lambda m:f'<b>{next(n):02d}</b>',d); page=page[:s]+d+page[e:]
    p.write_text(page,encoding='utf-8')

def patch_home():
    p=ROOT/'index.html'; page=p.read_text(encoding='utf-8')
    def upd(data):
        for node in data.get('@graph',[]):
            if node.get('@type')=='CollectionPage':
                for ent in node.get('mainEntity',[]):
                    if ent.get('@type')=='ItemList' and ent.get('name')=='Latest Sugargoo buyer guides':
                        url='https://sugargoovip.shop/'+SLUG; items=[x for x in ent.get('itemListElement',[]) if x.get('item',{}).get('url')!=url]
                        items.insert(0,{'@type':'ListItem','position':1,'item':{'@type':'Article','headline':TITLE,'url':url,'datePublished':DATE}}); items=items[:3]
                        for i,x in enumerate(items,1): x['position']=i
                        ent['numberOfItems']=3; ent['itemListElement']=items; return data
        raise RuntimeError('Latest guides JSON-LD not found')
    page=replace_first_jsonld(page,upd)
    s=page.index('<section aria-labelledby="latest-guides-title"'); e=page.index('<section class="finder',s); sec=page[s:e]
    cards=[c for c in re.findall(r'<article class="latest-guide-card[^>]*>.*?</article>',sec,re.S) if SLUG not in c][:2]
    if len(cards)<2: raise RuntimeError('Previous homepage guide cards not found')
    cards=[c.replace(' latest-guide-featured','').replace('<span class="latest-guide-badge">Latest guide</span>','') for c in cards]
    new=f'<article class="latest-guide-card latest-guide-featured"><a aria-label="Read {esc(SHORT)}" class="latest-guide-cover latest-guide-shipping" href="{SLUG}"><span class="latest-guide-badge">Latest guide</span><svg aria-hidden="true" viewBox="0 0 220 160"><rect x="43" y="37" width="134" height="88" rx="14"></rect><path d="M68 62h84M68 82h84M68 102h38"></path><circle cx="151" cy="103" r="23"></circle><path d="m143 103 6 6 12-15"></path></svg><strong>Pre-Purchase Cost Check</strong><small>Listing · Freight · Risk</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="{DATE}">{DISPLAY}</time><span>12 min read</span></div><h3><a href="{SLUG}">{esc(SHORT)}</a></h3><p>Test a live listing against domestic delivery, shipping range, QC limits and return risk before you pay for the order.</p><a class="latest-guide-link" href="{SLUG}">Read pre-purchase guide <span>→</span></a></div></article>'
    gs=sec.index('<div class="latest-guides-grid">')+len('<div class="latest-guides-grid">'); ge=sec.rindex('</div></div></section>'); sec=sec[:gs]+new+''.join(cards)+sec[ge:]
    sec=re.sub(r'<div class="latest-guides-intro"><p>.*?</p>','<div class="latest-guides-intro"><p>Three practical Sugargoo guides covering pre-purchase cost control, warehouse timing and order evidence. Newest articles appear first.</p>',sec,count=1,flags=re.S)
    page=page[:s]+sec+page[e:]; p.write_text(page,encoding='utf-8')

def patch_sitemap():
    p=ROOT/'sitemap.xml'; x=p.read_text(encoding='utf-8'); x=re.sub(r'(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+',r'\g<1>'+DATE,x); x=re.sub(r'(<loc>https://sugargoovip\.shop/guides\.html</loc><lastmod>)[^<]+',r'\g<1>'+DATE,x)
    if SLUG not in x:
        marker='  <url><loc>https://sugargoovip.shop/guide-sugargoo-warehouse-storage-timing.html'; entry=f'  <url><loc>https://sugargoovip.shop/{SLUG}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
        if marker not in x: raise RuntimeError('Sitemap marker not found')
        x=x.replace(marker,entry+marker,1)
    p.write_text(x,encoding='utf-8')

(ROOT/SLUG).write_text(render_article(),encoding='utf-8'); patch_guides(); patch_home(); patch_sitemap()
a=(ROOT/SLUG).read_text(encoding='utf-8'); g=(ROOT/'guides.html').read_text(encoding='utf-8'); h=(ROOT/'index.html').read_text(encoding='utf-8'); sm=(ROOT/'sitemap.xml').read_text(encoding='utf-8'); ls=h[h.index('<section aria-labelledby="latest-guides-title"'):h.index('<section class="finder',h.index('<section aria-labelledby="latest-guides-title"'))]
checks={'word_count':WORD_COUNT,'faq':a.count('<details>')>=8,'homepage_latest_three':ls.count('class="latest-guide-card')==3,'homepage_new':SLUG in ls,'guides_new':SLUG in g,'guides_cards':g.count('<article>')>=10,'sitemap':SLUG in sm}
if not all(v for k,v in checks.items() if k!='word_count'): raise RuntimeError(checks)
print(json.dumps(checks,separators=(',',':')))
