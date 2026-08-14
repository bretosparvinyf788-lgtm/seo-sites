#!/usr/bin/env python3
from __future__ import annotations
import html, json, re, sys
from pathlib import Path

ROOT=Path(sys.argv[1] if len(sys.argv)>1 else 'dist')
DATA_PATH=Path(__file__).resolve().parent.parent/'article-data'/'2026-08-14-diy-order-link-rescue.json'
D=json.loads(DATA_PATH.read_text(encoding='utf-8'))
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
    template=(ROOT/'guide-sugargoo-prepurchase-cost-check.html').read_text(encoding='utf-8')
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
    hero=f'''<section class="article-hero"><div class="frame article-hero-grid"><div><span class="article-label">DIY Order &amp; Link Rescue · Fact checked</span><h1>{esc(TITLE)}</h1><p class="article-deck">{esc(DECK)}</p><div class="article-meta"><span>Published {DISPLAY}</span><span>12 min read</span><span>{WORD_COUNT:,} words</span></div></div><div class="article-hero-card"><small>Independent buyer guide</small><strong>11</strong><p>Original English editorial content based on current Sugargoo official documentation. Live seller terms, item availability, route restrictions and service rules should be rechecked before payment.</p></div></div></section>'''
    template=re.sub(r'<section class="article-hero">.*?</section>',hero,template,count=1,flags=re.S)
    shell=f'''<div class="frame article-shell"><aside class="article-toc"><span>On this page</span><nav>{toc}</nav></aside><article class="article-main"><p class="article-intro">When a Taobao or 1688 link refuses to import, the real task is not finding a different converter. It is preserving enough product data to place the right order manually and verify it later.</p><div class="article-factbox"><b>Research standard</b><p>Facts were checked against Sugargoo’s current official website and official buyer guides on {DISPLAY}. The workflow, examples, wording and SKU-packet method below were written from scratch for SugargooVIP.</p></div>{body}<section class="article-faq" id="faq"><h2>FAQ: Sugargoo DIY Order and broken-link recovery</h2>{faq_html}</section><div class="article-tags">{''.join(f'<span>{esc(t)}</span>' for t in TAGS)}</div><div class="article-bottom-nav"><a href="guides.html">← View all buyer guides</a><a href="index.html">Back to homepage →</a></div></article></div>'''
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
    page=re.sub(r'<title>.*?</title>','<title>Sugargoo Buyer Guides 2026: DIY Orders, Pre-Purchase Planning, Warehouse, QC, Shipping and W2C</title>',page,count=1,flags=re.S)
    page=re.sub(r'<meta content="[^"]*" name="description"/>','<meta content="Read eleven original Sugargoo buyer guides covering DIY orders, broken links, pre-purchase checks, warehouse timing, payments, packing, returns, shipping, QC and W2C." name="description"/>',page,count=1)
    page=re.sub(r'Facts checked [A-Z][a-z]+ \d{1,2}, 2026',f'Facts checked {DISPLAY}',page)
    page=re.sub(r'<p>Ten long-form reverse-shopping guides.*?</p>','<p>Eleven long-form reverse-shopping guides written from scratch after checking Sugargoo’s current official documentation. Every historical article remains available, newest first.</p>',page,count=1,flags=re.S)
    directory=page.split('<div class="guide-directory">',1)
    if len(directory)!=2: raise RuntimeError('Guide directory not found')
    if SLUG not in directory[1]:
        card=f'<article><a class="guide-directory-cover w2c" href="{SLUG}"><span>DIY order &amp; link rescue</span><b>01</b></a><div class="guide-directory-body"><h2><a href="{SLUG}">{esc(TITLE)}</a></h2><p>{esc(META)}</p><div class="guide-directory-meta"><span>{DISPLAY}</span><span>12 min read</span></div><a href="{SLUG}">Read the full {WORD_COUNT:,}-word guide →</a></div></article>'
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
    new=f'<article class="latest-guide-card latest-guide-featured"><a aria-label="Read {esc(SHORT)}" class="latest-guide-cover latest-guide-w2c" href="{SLUG}"><span class="latest-guide-badge">Latest guide</span><svg aria-hidden="true" viewBox="0 0 220 160"><rect x="42" y="35" width="136" height="90" rx="14"></rect><path d="M66 61h88M66 82h52M66 103h72"></path><path d="m146 93 17 17M163 93l-17 17"></path></svg><strong>DIY Order &amp; Link Rescue</strong><small>Links · SKU · QC</small></a><div class="latest-guide-body"><div class="latest-guide-meta"><time datetime="{DATE}">{DISPLAY}</time><span>12 min read</span></div><h3><a href="{SLUG}">{esc(SHORT)}</a></h3><p>Turn a failed Taobao or 1688 import into a precise manual order with preserved SKU, price, shipping-risk and QC instructions.</p><a class="latest-guide-link" href="{SLUG}">Read DIY order guide <span>→</span></a></div></article>'
    gs=sec.index('<div class="latest-guides-grid">')+len('<div class="latest-guides-grid">'); ge=sec.rindex('</div></div></section>'); sec=sec[:gs]+new+''.join(cards)+sec[ge:]
    sec=re.sub(r'<div class="latest-guides-intro"><p>.*?</p>','<div class="latest-guides-intro"><p>Three practical Sugargoo guides covering DIY order recovery, pre-purchase cost control and warehouse timing. Newest articles appear first.</p>',sec,count=1,flags=re.S)
    page=page[:s]+sec+page[e:]; p.write_text(page,encoding='utf-8')

def patch_sitemap():
    p=ROOT/'sitemap.xml'; x=p.read_text(encoding='utf-8')
    x=re.sub(r'(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+',r'\g<1>'+DATE,x)
    x=re.sub(r'(<loc>https://sugargoovip\.shop/guides\.html</loc><lastmod>)[^<]+',r'\g<1>'+DATE,x)
    if SLUG not in x:
        marker='  <url><loc>https://sugargoovip.shop/guide-sugargoo-prepurchase-cost-check.html'
        entry=f'  <url><loc>https://sugargoovip.shop/{SLUG}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
        if marker not in x: raise RuntimeError('Sitemap marker not found')
        x=x.replace(marker,entry+marker,1)
    p.write_text(x,encoding='utf-8')

(ROOT/SLUG).write_text(render_article(),encoding='utf-8')
patch_guides(); patch_home(); patch_sitemap()
a=(ROOT/SLUG).read_text(encoding='utf-8'); g=(ROOT/'guides.html').read_text(encoding='utf-8'); h=(ROOT/'index.html').read_text(encoding='utf-8'); sm=(ROOT/'sitemap.xml').read_text(encoding='utf-8')
ls=h[h.index('<section aria-labelledby="latest-guides-title"'):h.index('<section class="finder',h.index('<section aria-labelledby="latest-guides-title"'))]
checks={'word_count':WORD_COUNT,'faq':a.count('<details>')>=8,'homepage_latest_three':ls.count('class="latest-guide-card')==3,'homepage_new':SLUG in ls,'guides_new':SLUG in g,'guides_cards':g.count('<article>')>=11,'sitemap':SLUG in sm}
if not all(v for k,v in checks.items() if k!='word_count'): raise RuntimeError(checks)
print(json.dumps(checks,separators=(',',':')))
