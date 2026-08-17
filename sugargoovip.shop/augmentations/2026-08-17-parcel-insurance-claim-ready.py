#!/usr/bin/env python3
from __future__ import annotations
import html, json, re, sys, base64, zlib
from pathlib import Path

ROOT=Path(sys.argv[1] if len(sys.argv)>1 else 'dist')
DATA_Z='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'
D=json.loads(zlib.decompress(base64.b64decode(DATA_Z)).decode('utf-8'))
SLUG,TITLE,SHORT,DATE,DISPLAY,META,DECK=(D[k] for k in ('SLUG','TITLE','SHORT','DATE','DISPLAY','META','DECK'))
TAGS,SOURCES,SECTIONS,FAQ=D['TAGS'],D['SOURCES'],D['SECTIONS'],D['FAQ']

def esc(s): return html.escape(str(s),quote=True)
def sid(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
PROSE='\n'.join(t for _,t in SECTIONS)+'\n'+'\n'.join(q+' '+a for q,a in FAQ)
WORD_COUNT=len(re.findall(r"\b[\w’'-]+\b",PROSE))
if not 1500<=WORD_COUNT<=1800: raise RuntimeError(f'Article word count out of range: {WORD_COUNT}')

def replace_first_jsonld(page,updater):
    m=re.search(r'<script type="application/ld\+json">(.*?)</script>',page,re.S)
    if not m: raise RuntimeError('JSON-LD block not found')
    data=updater(json.loads(m.group(1)))
    return page[:m.start(1)]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+page[m.end(1):]

def render_article():
    template=(ROOT/'guide-sugargoo-diy-order-link-rescue.html').read_text(encoding='utf-8')
    toc=''.join(f'<a href="#{sid(h)}">{i:02d}. {esc(h)}</a>' for i,(h,_) in enumerate(SECTIONS,1))+'<a href="#faq">FAQ</a>'
    body=''.join(f'<section><h2 id="{sid(h)}">{esc(h)}</h2>'+''.join(f'<p>{esc(p.strip())}</p>' for p in t.strip().split('\n\n'))+'</section>' for h,t in SECTIONS)
    faq_html=''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q,a in FAQ)
    schema={'@context':'https://schema.org','@graph':[
      {'@type':'Article','headline':TITLE,'description':META,'datePublished':DATE,'dateModified':DATE,'wordCount':WORD_COUNT,'inLanguage':'en','keywords':', '.join(TAGS),'mainEntityOfPage':{'@type':'WebPage','@id':'https://sugargoovip.shop/'+SLUG},'author':{'@type':'Organization','name':'SugargooVIP Editorial Team'},'publisher':{'@type':'Organization','name':'SugargooVIP','url':'https://sugargoovip.shop/'},'citation':SOURCES},
      {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://sugargoovip.shop/'},{'@type':'ListItem','position':2,'name':'Buyer Guides','item':'https://sugargoovip.shop/guides.html'},{'@type':'ListItem','position':3,'name':SHORT,'item':'https://sugargoovip.shop/'+SLUG}]},
      {'@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in FAQ]}
    ]}
    template=re.sub(r'<title>.*?</title>',f'<title>{esc(TITLE)} | SugargooVIP</title>',template,count=1,flags=re.S)
    template=re.sub(r'<meta content="[^"]*" name="description"/>',f'<meta content="{esc(META)}" name="description"/>',template,count=1)
    template=re.sub(r'<link href="https://sugargoovip\.shop/[^"]+" rel="canonical"/>',f'<link href="https://sugargoovip.shop/{SLUG}" rel="canonical"/>',template,count=1)
    template=re.sub(r'<meta content="[^"]*" property="og:title"/>',f'<meta content="{esc(TITLE)}" property="og:title"/>',template,count=1)
    template=re.sub(r'<meta content="[^"]*" property="og:description"/>',f'<meta content="{esc(META)}" property="og:description"/>',template,count=1)
    template=re.sub(r'<meta content="https://sugargoovip\.shop/[^"]+" property="og:url"/>',f'<meta content="https://sugargoovip.shop/{SLUG}" property="og:url"/>',template,count=1)
    template=re.sub(r'<script type="application/ld\+json">.*?</script>',f'<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False,separators=(",",":"))}</script>',template,count=1,flags=re.S)
    template=re.sub(r'Facts checked [A-Z][a-z]+ \d{1,2}, 2026 · Independent buyer resource',f'Facts checked {DISPLAY} · Independent buyer resource',template,count=1)
    hero=f'''<section class="article-hero"><div class="frame article-hero-grid"><div><span class="article-label">Parcel Insurance &amp; Claim Readiness · Fact checked</span><h1>{esc(TITLE)}</h1><p class="article-deck">{esc(DECK)}</p><div class="article-meta"><span>Published {DISPLAY}</span><span>12 min read</span><span>{WORD_COUNT:,} words</span></div></div><div class="article-hero-card"><small>Independent buyer guide</small><strong>12</strong><p>Original English editorial content based on current Sugargoo official documentation. Insurance eligibility, route rules, rates and claim requirements should be rechecked on the live parcel page before payment.</p></div></div></section>'''
    template=re.sub(r'<section class="article-hero">.*?</section>',hero,template,count=1,flags=re.S)
    shell=f'''<div class="frame article-shell"><aside class="article-toc"><span>On this page</span><nav>{toc}</nav></aside><article class="article-main"><p class="article-intro">Parcel insurance is most useful when it is the last layer of a documented shipping plan, not the first thing you think about after tracking stops moving.</p><div class="article-factbox"><b>Research standard</b><p>Facts were checked against Sugargoo’s current official insurance, packaging, tracking, consolidation, QC and shipping-restriction guidance on {DISPLAY}. The risk-led workflow and claim-packet method below were written from scratch for SugargooVIP.</p></div>{body}<section class="article-faq" id="faq"><h2>FAQ: Sugargoo parcel insurance and claim-ready shipping</h2>{faq_html}</section><div class="article-tags">{''.join(f'<span>{esc(t)}</span>' for t in TAGS)}</div><div class="article-bottom-nav"><a href="guides.html">← View all buyer guides</a><a href="index.html">Back to homepage →</a></div></article></div>'''
    template=re.sub(r'<div class="frame article-shell">.*?</div></main>',shell+'</main>',template,count=1,flags=re.S)
    if TITLE not in template or template.count('<details>')<8: raise RuntimeError('Article render failed')
    return template

def patch_guides():
    p=ROOT/'guides.html'; page=p.read_text(encoding='utf-8')
    def upd(data):
        ent=data['mainEntity']; url='https://sugargoovip.shop/'+SLUG
        items=[x for x in ent.get('itemListElement',[]) if x.get('item',{}).get('url')!=url]
        items.insert(0,{'@type':'ListItem','position':1,'item':{'@type':'Article','headline':TITLE,'url':url,'datePublished':DATE}})
        for i,x in enumerate(items,1): x['position']=i
        ent['numberOfItems']=len(items); ent['itemListElement']=items; return data
    page=replace_first_jsonld(page,upd)
    page=re.sub(r'<title>.*?</title>','<title>Sugargoo Buyer Guides 2026: Insurance, DIY Orders, Warehouse, QC, Shipping and W2C</title>',page,count=1,flags=re.S)
    page=re.sub(r'<meta content="[^"]*" name="description"/>','<meta content="Read twelve original Sugargoo buyer guides covering parcel insurance, DIY orders, pre-purchase checks, warehouse timing, payments, packing, returns, shipping, QC and W2C." name="description"/>',page,count=1)
    page=re.sub(r'Facts checked [A-Z][a-z]+ \d{1,2}, 2026',f'Facts checked {DISPLAY}',page)
    page=re.sub(r'<p>Eleven long-form reverse-shopping guides.*?</p>','<p>Twelve long-form reverse-shopping guides written from scratch after checking Sugargoo’s current official documentation. Every historical article remains available, newest first.</p>',page,count=1,flags=re.S)
    directory=page.split('<div class="guide-directory">',1)
    if len(directory)!=2: raise RuntimeError('Guide directory not found')
    if SLUG not in directory[1]:
        card=f'<article><a class="guide-directory-cover w2c" href="{SLUG}"><span>Parcel insurance &amp; claim readiness</span><b>01</b></a><div class="guide-directory-body"><h2><a href="{SLUG}">{esc(TITLE)}</a></h2><p>{esc(META)}</p><div class="guide-directory-meta"><span>{DISPLAY}</span><span>12 min read</span></div><a href="{SLUG}">Read the full {WORD_COUNT:,}-word guide →</a></div></article>'
        page=page.replace('<div class="guide-directory">','<div class="guide-directory">'+card,1)
    s=page.index('<div class="guide-directory">'); e=page.index('</div></div></main>',s); block=page[s:e]; n=iter(range(1,100)); block=re.sub(r'<b>\d{2}</b>',lambda m:f'<b>{next(n):02d}</b>',block); page=page[:s]+block+page[e:]
    p.write_text(page,encoding='utf-8')

def patch_home():
    p=ROOT/'index.html'; page=p.read_text(encoding='utf-8')
    def upd(data):
        for node in data.get('@graph',[]):
            if node.get('@type')=='CollectionPage':
                for ent in node.get('mainEntity',[]):
                    if ent.get('@type')=='ItemList' and ent.get('name')=='Latest Sugargoo buyer guides':
                        url='https://sugargoovip.shop/'+SLUG
                        items=[x for x in ent.get('itemListElement',[]) if x.get('item',{}).get('url')!=url]
                        items.insert(0,{'@type':'ListItem','position':1,'item':{'@type':'Article','headline':TITLE,'url':url,'datePublished':DATE}}); items=items[:3]
                        for i,x in enumerate(items,1): x['position']=i
                        ent['numberOfItems']=3; ent['itemListElement']=items; return data
        raise RuntimeError('Latest guides JSON-LD not found')
    page=replace_first_jsonld(page,upd)
    s=page.index('<section aria-labelledby="latest-guides-title"'); e=page.index('<section class="finder',s); sec=page[s:e]
    cards=[c for c in re.findall(r'<article class="latest-guide-card[^>]*>.*?</article>',sec,re.S) if SLUG not in c][:2]
    if len(cards)<2: raise RuntimeError('Previous homepage guide cards not found')
    cards=[c.replace(' latest-guide-featured','').replace('<span class="latest-guide-badge">Latest guide</span>','') for c in cards]
    new=f'<article class="latest-guide-card latest-guide-featured"><a aria-label="Read {esc(SHORT)}" class="latest-guide-cover latest-guide-w2c" href="{SLUG}"><span class="latest-guide-badge">Latest guide</span><svg aria-hidden="true" viewBox="0 0 220 160"><rect x="42" y="35" width="136" height="90" rx="14"></rect><path d="M66 61h88M66 82h72M66 103h52"></path><path d="M148 50v24M136 62h24"></path></svg><strong>Parcel Insurance &amp; Claim Readiness</strong><small>Risk · Evidence · Tracking</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="{DATE}">{DISPLAY}</time><span>12 min read</span></div><h3><a href="{SLUG}">{esc(SHORT)}</a></h3><p>Build an insurance-ready Sugargoo parcel with a value ledger, pre-shipment evidence, packaging records, tracking checkpoints and a structured claim packet.</p><a class="latest-guide-link" href="{SLUG}">Read parcel insurance guide <span>→</span></a></div></article>'
    gs=sec.index('<div class="latest-guides-grid">')+len('<div class="latest-guides-grid">'); ge=sec.rindex('</div></div></section>'); sec=sec[:gs]+new+''.join(cards)+sec[ge:]
    sec=re.sub(r'<div class="latest-guides-intro"><p>.*?</p>','<div class="latest-guides-intro"><p>Three practical Sugargoo guides covering parcel risk, DIY order recovery and pre-purchase cost control. Newest articles appear first.</p>',sec,count=1,flags=re.S)
    page=page[:s]+sec+page[e:]; p.write_text(page,encoding='utf-8')

def patch_sitemap():
    p=ROOT/'sitemap.xml'; x=p.read_text(encoding='utf-8')
    x=re.sub(r'(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+',r'\g<1>'+DATE,x)
    x=re.sub(r'(<loc>https://sugargoovip\.shop/guides\.html</loc><lastmod>)[^<]+',r'\g<1>'+DATE,x)
    if SLUG not in x:
        marker='  <url><loc>https://sugargoovip.shop/guide-sugargoo-diy-order-link-rescue.html'
        entry=f'  <url><loc>https://sugargoovip.shop/{SLUG}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
        if marker not in x: raise RuntimeError('Sitemap marker not found')
        x=x.replace(marker,entry+marker,1)
    p.write_text(x,encoding='utf-8')

(ROOT/SLUG).write_text(render_article(),encoding='utf-8')
patch_guides(); patch_home(); patch_sitemap()
a=(ROOT/SLUG).read_text(encoding='utf-8'); g=(ROOT/'guides.html').read_text(encoding='utf-8'); h=(ROOT/'index.html').read_text(encoding='utf-8'); sm=(ROOT/'sitemap.xml').read_text(encoding='utf-8')
ls=h[h.index('<section aria-labelledby="latest-guides-title"'):h.index('<section class="finder',h.index('<section aria-labelledby="latest-guides-title"'))]
checks={'word_count':WORD_COUNT,'faq':a.count('<details>')>=8,'homepage_latest_three':ls.count('class="latest-guide-card')==3,'homepage_new':SLUG in ls,'guides_new':SLUG in g,'guides_cards':g.count('<article>')>=12,'sitemap':SLUG in sm}
if not all(v for k,v in checks.items() if k!='word_count'): raise RuntimeError(checks)
print(json.dumps(checks,separators=(',',':')))
