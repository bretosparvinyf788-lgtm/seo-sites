#!/usr/bin/env python3
"""Build static pages from versioned content. No services or database required."""
import argparse, copy, html as escape, json, re, shutil
from pathlib import Path
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'maintenance/content'
BASE = 'https://litbuyvip.shop'
LANGS = ['en','zh','es','fr','de','pt','ja','ko','ar']
LANG_ATTR = {'zh':'zh-CN','pt':'pt-BR'}
NAMES = {'en':'English','zh':'简体中文','es':'Español','fr':'Français','de':'Deutsch','pt':'Português','ja':'日本語','ko':'한국어','ar':'العربية'}
DATE = '2026-10-08'
CALC_LABELS = {
 'en':['Actual weight','Volumetric weight','Chargeable weight'],
 'zh':['实际重量','体积重量','计费重量'],
 'es':['Peso real','Peso volumétrico','Peso facturable'],
 'fr':['Poids réel','Poids volumétrique','Poids facturable'],
 'de':['Tatsächliches Gewicht','Volumengewicht','Abrechnungsgewicht'],
 'pt':['Peso real','Peso volumétrico','Peso faturável'],
 'ja':['実重量','容積重量','請求重量'],
 'ko':['실제 무게','부피 무게','청구 무게'],
 'ar':['الوزن الفعلي','الوزن الحجمي','الوزن المحتسب']}
PRODUCT_LABELS = {'en':'Products','zh':'商品','es':'Productos','fr':'Produits','de':'Produkte','pt':'Produtos','ja':'商品','ko':'상품','ar':'المنتجات'}
load = lambda name: json.loads((CONTENT / (name+'.json')).read_text())
UI, SLUGS, OLD, NEW, UPDATES = (load(x) for x in ['ui','slugs','original-articles','new-en','updates-en'])
TEXT, ATTRS, FAQ, TEMPLATES = (load(x) for x in ['main_text','attrs','faq_data','templates'])
META = load('seo_meta')
PRODUCTS = load('products')
PRIORITY = ['rehearsal','spreadsheet','us-shipping','sizing','tracking','returns','weight']
ORDER = PRIORITY + [key for key in SLUGS if key not in PRIORITY]

def prefix(lang): return '' if lang=='en' else '/'+lang
def url(lang,key=None): return prefix(lang) + ('/guides/'+SLUGS[key] if key else '/')
def index_url(lang): return prefix(lang)+'/guides/'
def text(s): return escape.escape(str(s),quote=True)
def fragment(markup): return html.fragment_fromstring(markup,create_parent='div')
def replace(node,markup):
    attributes=dict(node.attrib);node.clear();node.attrib.update(attributes)
    f=fragment(markup); node.text=f.text
    for child in f: node.append(child)
def add(parent,markup):
    f=fragment(markup)
    for child in f: parent.append(child)
def paragraphs(content): return ''.join('<p>'+text(p)+'</p>' for p in content.split('\n') if p.strip())
def sections(items): return ''.join('<section><h2>'+text(h)+'</h2>'+paragraphs(p)+'</section>' for h,p in items)
def json_script(obj): return '<script type="application/ld+json">'+json.dumps(obj,ensure_ascii=False).replace('</','<\\/')+'</script>'
def alternates(lang,key=None,index=False):
    def target(l): return index_url(l) if index else url(l,key)
    return ''.join('<link rel="alternate" hreflang="'+LANG_ATTR.get(l,l)+'" href="'+BASE+target(l)+'">' for l in LANGS)+ '<link rel="alternate" hreflang="x-default" href="'+BASE+target('en')+'">'
def language_select(lang,key=None,index=False):
    return '<select class="langSelect" aria-label="'+text(UI[lang][38])+'">'+''.join('<option value="'+(index_url(l) if index else url(l,key))+'"'+(' selected' if l==lang else '')+'>'+NAMES[l]+'</option>' for l in LANGS)+'</select>'
def analytics():
    return '<script async src="https://www.googletagmanager.com/gtag/js?id=G-4PTG8H4RH6"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-4PTG8H4RH6");</script><script src="/assets/site.js?v=20261008" defer></script>'
CSS='''
:root{--bg:#090b10;--panel:#11151d;--ink:#f5f7fa;--muted:#aab3c2;--line:#252c38;--accent:#ff7a45;--soft:#171d27}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:linear-gradient(180deg,#0b0e14,#090b10 420px);color:var(--ink);font:17px/1.75 system-ui,sans-serif}a{color:inherit}a:hover{color:#ffb18c}.top{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--line)}.nav{max-width:1120px;margin:auto;padding:18px 24px;display:flex;gap:24px;align-items:center;justify-content:space-between;flex-wrap:wrap}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-size:24px;font-weight:850}.brand img{border-radius:12px}.brand b{color:var(--accent)}.navlinks{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.navlinks a{text-decoration:none;font-size:14px}.langSelect{max-width:180px;border:1px solid #697080;border-radius:9px;padding:9px;background:#11151d;color:white}.hero{max-width:1000px;margin:auto;padding:64px 24px 36px}.hero h1{font-size:clamp(30px,5vw,56px);line-height:1.13;letter-spacing:-.035em;margin:12px 0 24px}.eyebrow,.meta,.dek{color:var(--muted)}.eyebrow{font-size:13px;text-transform:uppercase;letter-spacing:.1em}.dek{font-size:21px;max-width:850px}.meta{font-size:14px}.layout{max-width:1000px;margin:auto;padding:0 24px 64px;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:38px}article p{margin:0 0 22px}article h2{font-size:27px;line-height:1.3;margin:42px 0 18px}article h3{font-size:21px}article li{margin-bottom:10px}aside{align-self:start;position:sticky;top:24px;font-size:14px}aside a{display:block;margin:10px 0;color:#bdc6d4}aside h2{font-size:17px}.note,.weight-calculator{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:22px;margin:26px 0}.weight-inputs{display:grid;grid-template-columns:1fr 1fr;gap:16px}.weight-inputs label{display:flex;flex-direction:column;font-size:14px}.weight-inputs input{width:100%;background:white;color:#111;padding:10px;border:1px solid #aaa;border-radius:8px;font:inherit}output{display:block;color:#fcb688;margin-top:18px;font-weight:750}.sources{border-top:1px solid var(--line);margin-top:42px;padding-top:20px;font-size:14px}.guide-grid{max-width:1120px;margin:auto;padding:20px 24px 70px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.card{display:flex;flex-direction:column;gap:12px;padding:24px;border:1px solid var(--line);border-radius:18px;background:var(--panel);text-decoration:none}.card h2{font-size:23px;line-height:1.3;margin:0}.card p{font-size:15px;color:var(--muted);margin:0}.card .read{margin-top:auto;color:#ffb18c}.faq details{border-top:1px solid var(--line);padding:16px 0}.faq summary{cursor:pointer;font-weight:700}.faq p{margin:12px 0}.related{border-top:1px solid var(--line);margin-top:40px;padding-top:20px}.related a{display:block;margin:10px 0}footer{border-top:1px solid var(--line);max-width:1120px;margin:auto;padding:28px 24px;color:var(--muted);font-size:14px}img{max-width:100%}table{width:100%;border-collapse:collapse}th,td{padding:10px;border:1px solid var(--line)}.calc-note{font-size:14px;color:var(--muted)}@media(max-width:760px){.layout{grid-template-columns:1fr}.layout aside{position:static}.guide-grid{grid-template-columns:1fr}.hero{padding-top:38px}.navlinks{gap:12px}.weight-inputs{grid-template-columns:1fr 1fr}}'''

def calculator(lang):
    u=UI[lang]
    fields=[('actual',u[28],4),('length',u[29],40),('width',u[30],30),('height',u[31],25),('divisor',u[32],6000)]
    return '<section class="weight-calculator"><h2>'+text(u[27])+'</h2><div class="weight-inputs">'+''.join('<label>'+text(label)+'<input name="'+name+'" type="number" min="0.01" step="any" value="'+str(v)+'" required></label>' for name,label,v in fields)+'</div><output aria-live="polite" data-actual="'+text(CALC_LABELS[lang][0])+'" data-volume="'+text(CALC_LABELS[lang][1])+'" data-billed="'+text(CALC_LABELS[lang][2])+'"></output><p class="calc-note">'+text(u[33])+'. '+text(u[34])+'</p></section>'

LOCAL_HEADINGS={
 'zh':['操作步骤','计算或判断示例','确认前检查','保存哪些记录'],
 'es':['Pasos prácticos','Ejemplo de decisión','Antes de confirmar','Registros útiles'],
 'fr':['Étapes pratiques','Exemple de décision','Avant de confirmer','Informations à conserver'],
 'de':['Praktische Schritte','Rechen- oder Entscheidungsbeispiel','Vor der Bestätigung','Unterlagen aufbewahren'],
 'pt':['Passos práticos','Exemplo de decisão','Antes de confirmar','Registros úteis'],
 'ja':['実際の手順','計算・判断の例','確定前の確認','保存する記録'],
 'ko':['실제 절차','계산과 판단 예시','확정 전 확인','보관할 기록'],
 'ar':['الخطوات العملية','مثال للحساب أو القرار','قبل التأكيد','السجلات المطلوبة']}

def content(lang,key):
    if lang=='en':
        if key in NEW:
            a=NEW[key];return a['title'],a['description'],sections(a['sections']),DATE,DATE
        old=copy.deepcopy(OLD[SLUGS[key]])
        title,description=old['title'],old['description']
        body=html.fromstring(old['body'])
        # Stale precise promotions and storage promises are not live account terms.
        for p in list(body.xpath('.//p')):
            t=p.text_content()
            if any(v in t for v in ['120 days','90 days','up to 30%','free-shipping reward','recent official event rule','recent event rule']):
                # Keep useful context and list numbering when removing dated promises.
                stale=['120 days','90 days','up to 30%','free-shipping reward','recent official event rule','recent event rule']
                kept=[sentence for sentence in re.split(r'(?<=[.!?])\s+(?=[A-Z])',t) if not any(v in sentence for v in stale)]
                clean=' '.join(kept).strip()
                if not clean:
                    clean='Check the storage allowance, fees, promotion eligibility and deadlines currently shown in your account before making a decision.'
                replace(p,text(clean))
        if key in UPDATES:
            a=UPDATES[key];title,description=a['title'],a['description']
            intro=fragment(sections(a['sections']))
            for i,node in enumerate(list(intro)):body.insert(i,node)
        return title,description,html.tostring(body,encoding='unicode'),old['date'],DATE
    if key in ['qc','weight','coupons']:
        d=TEMPLATES[lang][{'qc':'qc','weight':'shipping','coupons':'coupon'}[key]]
        return d['title'],d['dek'],d['html'],OLD[SLUGS[key]]['date'],DATE
    data=load(lang)[key]
    body=paragraphs(data[1])+sections(zip(LOCAL_HEADINGS[lang],data[2:]))
    return data[0],data[1],body,(OLD[SLUGS[key]]['date'] if SLUGS[key] in OLD else DATE),DATE

def head(lang,title,description,target,key=None,index=False):
    return '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+text(title)+'</title><meta name="description" content="'+text(description)+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+BASE+target+'">'+alternates(lang,key,index)+'<meta property="og:type" content="'+('article' if key else 'website')+'"><meta property="og:title" content="'+text(title)+'"><meta property="og:description" content="'+text(description)+'"><meta property="og:url" content="'+BASE+target+'"><meta property="og:image" content="'+BASE+'/assets/products/litbuyvip-logo.webp"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="'+text(title)+'"><meta name="twitter:description" content="'+text(description)+'"><link rel="icon" href="/assets/products/litbuyvip-favicon.png">'
def nav(lang,key=None,index=False):
    u=UI[lang]
    return '<header class="top"><nav class="nav"><a class="brand" href="'+url(lang)+'"><img src="/assets/products/litbuyvip-logo.webp" alt="LitBuyVIP" width="40" height="40"><span><b>LitBuy</b>VIP</span></a><div class="navlinks"><a href="'+url(lang)+'#spreadsheet">'+text(u[15])+'</a><a href="'+index_url(lang)+'">'+text(u[16])+'</a>'+language_select(lang,key,index)+'</div></nav></header>'
def related(lang,key):
    relations={'rehearsal':['weight','consolidation','us-shipping','tracking'],'spreadsheet':['links','sizing','qc','budget'],'sizing':['qc','returns','spreadsheet'],'us-shipping':['weight','rehearsal','routes','tracking'],'tracking':['warehouse','forwarding','returns'],'returns':['qc','warehouse','balance'],'weight':['rehearsal','us-shipping','consolidation']}
    keys=relations.get(key,['spreadsheet','qc','rehearsal','budget'])
    return '<section class="related"><h2>'+text(UI[lang][14])+'</h2>'+''.join('<a href="'+url(lang,k)+'">'+text(content(lang,k)[0])+'</a>' for k in keys if k!=key)+'</section>'
def faq_from_dom(article):
    result=[]
    for detail in article.xpath('.//details[summary]'):
        q=detail.xpath('./summary')[0].text_content().strip()
        a=' '.join(p.text_content().strip() for p in detail.xpath('./p'))
        if q and a:result.append({'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}})
    return result

def article(lang,key):
    u=UI[lang]; title,description,body,published,modified=content(lang,key)
    parsed=fragment(body)
    # Old bodies may already have an article wrapper.
    if len(parsed)==1 and parsed[0].tag=='article':parsed=parsed[0]
    body=''.join(html.tostring(c,encoding='unicode') for c in parsed)
    if key in ['weight','rehearsal','us-shipping']:body+=calculator(lang)
    body+=related(lang,key)
    body+='<section class="sources"><h2>'+text(u[35])+'</h2><p>'+text(u[24])+'</p><p><a href="https://www.litbuy.com/" target="_blank" rel="noopener noreferrer">'+text(u[36])+'</a></p><p><a href="https://kakobuymake.com/" target="_blank" rel="noopener noreferrer">'+text(u[37])+'</a></p></section>'
    schema={'@context':'https://schema.org','@type':'Article','headline':title,'description':description,'datePublished':published,'dateModified':modified,'inLanguage':LANG_ATTR.get(lang,lang),'author':{'@type':'Organization','name':'LitBuyVIP Editorial Team'},'publisher':{'@type':'Organization','name':'LitBuyVIP'},'mainEntityOfPage':BASE+url(lang,key)}
    data=json_script(schema)
    faqs=faq_from_dom(parsed)
    if faqs:data+=json_script({'@context':'https://schema.org','@type':'FAQPage','mainEntity':faqs})
    # Breadcrumbs describe real destinations.
    data+=json_script({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'LitBuyVIP','item':BASE+url(lang)},{'@type':'ListItem','position':2,'name':u[16],'item':BASE+index_url(lang)},{'@type':'ListItem','position':3,'name':title,'item':BASE+url(lang,key)}]})
    return '<!doctype html><html lang="'+LANG_ATTR.get(lang,lang)+'" dir="'+('rtl' if lang=='ar' else 'ltr')+'"><head>'+head(lang,title,description,url(lang,key),key)+ '<style>'+CSS+'</style>'+data+analytics()+'</head><body>'+nav(lang,key)+'<section class="hero"><div class="eyebrow">LitBuyVIP · '+NAMES[lang]+'</div><h1>'+text(title)+'</h1><p class="dek">'+text(description)+'</p><div class="meta">'+text(u[13])+': <time datetime="'+modified+'">'+modified+'</time> · '+NAMES[lang]+'</div></section><main class="layout"><article>'+body+'</article><aside><h2>'+text(u[14])+'</h2>'+''.join('<a href="'+url(lang,k)+'">'+text(content(lang,k)[0])+'</a>' for k in PRIORITY if k!=key)+'</aside></main><footer>'+text(u[24])+'</footer></body></html>'

def guide_index(lang):
    u=UI[lang]; title='LitBuy '+u[16]+' 2026'; cards=[]; items=[]
    for n,key in enumerate(ORDER,1):
        title_a,desc,_,_,modified=content(lang,key)
        cards.append('<a class="card" href="'+url(lang,key)+'"><span class="meta">'+text(u[13])+': '+modified+'</span><h2>'+text(title_a)+'</h2><p>'+text(desc)+'</p><span class="read">'+text(u[17])+' →</span></a>')
        items.append({'@type':'ListItem','position':n,'url':BASE+url(lang,key),'name':title_a})
    return '<!doctype html><html lang="'+LANG_ATTR.get(lang,lang)+'" dir="'+('rtl' if lang=='ar' else 'ltr')+'"><head>'+head(lang,title,u[12],index_url(lang),index=True)+'<style>'+CSS+'</style>'+json_script({'@context':'https://schema.org','@type':'ItemList','name':title,'itemListElement':items})+analytics()+'</head><body>'+nav(lang,index=True)+'<main><section class="hero"><h1>'+text(u[12])+'</h1><p class="dek">'+text(u[2])+'</p></section><section class="guide-grid">'+''.join(cards)+'</section></main><footer>'+text(u[24])+'</footer></body></html>'

def homepage(lang):
    u=UI[lang];doc=html.fromstring((ROOT/'maintenance/templates/home-original.html').read_text())
    nodes=doc.xpath('//body//text()[normalize-space() and not(ancestor::script or ancestor::style or ancestor::template)]')
    assert len(nodes)==len(TEXT[lang]),(len(nodes),len(TEXT[lang]))
    # Translate before changing structure so text-node positions remain deterministic.
    substitutions={'QC Finder':u[0],'Trending this week':u[3],'Link active':u[4],'Editor pick · July 2026':u[5],'14 QC refs · Accessories':u[6],'QC coverage':u[6],'14 photos':u[4],'Last checked':u[7],'Today, 14:32':u[8],'Useful pages, not filler':u[1],'Search, inspect and understand before you buy.':u[48],'SEO-ready structure':u[49],'A spreadsheet Google can actually understand.':u[50],'161':str(len(SLUGS)),'QC refs':u[45],'Category':u[44],'Daily':u[47],'Checked':u[8],'Today':DATE,'Live link':u[4],'Pages that capture the searches basic spreadsheet sites miss.':u[12],'Content cluster':u[16]}
    for i,node in enumerate(nodes):
        value=substitutions.get(TEXT['en'][i],TEXT[lang][i])
        if node.is_text:node.getparent().text=value
        else:node.getparent().tail=value
    for attr, translations in ATTRS.items():
        found=doc.xpath('//body//*[@'+attr+' and not(ancestor::template or ancestor::script or ancestor::style)]')
        for i,node in enumerate(found):
            if i<len(translations[lang]):node.set(attr,translations[lang][i])
    doc.set('lang',LANG_ATTR.get(lang,lang));doc.set('dir','rtl' if lang=='ar' else 'ltr')
    if lang=='ar':doc.xpath('//body')[0].set('class','rtl')
    for element in list(doc.xpath('//body/script | //template | //*[@id="guideReader" or @id="guideLibrary" or @id="toast"] | //*[@class="preview-bar"]')):
        if element.getparent() is not None:element.getparent().remove(element)
    for a in doc.xpath('//a[@data-guide]'):
        key={'qc':'qc','shipping':'weight','coupon':'coupons'}[a.get('data-guide')]
        a.set('href',url(lang,key));a.attrib.pop('data-guide',None)
    for s in doc.xpath('//select[contains(@class,"langSelect")]'):
        replace(s,''.join('<option value="'+url(l)+'"'+(' selected' if l==lang else '')+'>'+NAMES[l]+'</option>' for l in LANGS));s.set('class','language-select langSelect');s.set('aria-label',u[38])
    h1=doc.xpath('//h1')[0];replace(h1,'LitBuy Spreadsheet 2026: <span class="hero-accent">'+text(u[1])+'</span>')
    doc.xpath('//*[contains(@class,"hero-copy")]')[0].text=u[2]
    notes=doc.xpath('//*[contains(@class,"hero-notes")]/span')
    for element,value in zip(notes,[u[44],u[4],u[16]]):element.text=value
    doc.get_element_by_id('heroSearch').set('placeholder',u[19]);doc.get_element_by_id('heroSearch').set('aria-label',u[18])
    doc.get_element_by_id('heroSearchBtn').text=u[20]
    qc=doc.get_element_by_id('qc');qc.set('id','catalog-search')
    replace(qc,'<div class="wrap"><div class="section-head"><div><div class="section-kicker">'+text(u[0])+'</div><h2>'+text(u[18])+'</h2></div></div><div class="bento"><div class="qc-panel"><div class="main-search-module"><p>'+text(u[19])+'</p><form class="main-search-form" id="catalogSearchForm"><label class="main-search-field"><input id="catalogSearchInput" aria-label="'+text(u[18])+'" placeholder="'+text(u[19])+'"></label><button type="submit">'+text(u[20])+'</button></form><p id="searchStatus" role="status" aria-live="polite">'+text(u[53])+'</p><div id="mainSearchResults" class="main-search-results"></div><a href="https://kakobuymake.com/" rel="noopener" target="_blank">'+text(u[25])+' ↗</a></div></div><div class="side-stack"><a class="side-card orange" href="'+url(lang,'spreadsheet')+'"><h3>'+text(u[26])+'</h3><p>'+text(u[49])+'</p></a><a class="side-card cyan" href="'+url(lang,'rehearsal')+'"><h3>'+text(content(lang,'rehearsal')[0])+'</h3><p>'+text(u[12])+'</p></a></div></div></div>')
    for a in doc.xpath('//a[@href="#qc"]'):a.set('href','#catalog-search');a.text=u[0]
    from urllib.parse import urlparse, parse_qs
    for row in doc.xpath('//*[@id="spreadsheet"]//a[contains(@class,"sheet-row")]'):
        product=PRODUCTS[parse_qs(urlparse(row.get('href')).query)['aid'][0]]
        row.xpath('.//b')[0].text=product['names'][lang]
        row.xpath('.//img')[0].set('alt',product['names'][lang])
        row[1].text=product['categories'][lang]
        row[2].text=product['price']
        row[3].text=u[6];row[4].text=u[4]
    hero_product=PRODUCTS['2815']
    for node in doc.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," product-name ")]'):node.text=hero_product['names'][lang]
    for node in doc.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," product-price ")]'):node.text=hero_product['price']
    for node in doc.xpath('//img[contains(@class,"hero-product-img")]'):node.set('alt',hero_product['names'][lang])
    headers=doc.xpath('//*[contains(@class,"sheet-head")]/span')
    for el,value in zip(headers,[u[39],u[40],u[41],u[42],u[43]]):el.text=value
    doc.xpath('//*[contains(@class,"sheet-status")]')[0].text=u[10]
    spreadsheet=doc.get_element_by_id('spreadsheet')
    metrics=spreadsheet.xpath('.//div[@class="metrics"]')[0]
    replace(metrics,''.join('<div class="metric"><strong>'+text(v)+'</strong><span>'+text(label)+'</span></div>' for v,label in [('12',PRODUCT_LABELS[lang]),('10',u[45]),(str(len(SLUGS)),u[46]),(DATE,u[13])]))
    add(spreadsheet,'<div class="wrap"><p class="reference-note">'+text(u[23])+' '+text(u[48])+'</p><a href="'+url(lang,'spreadsheet')+'">'+text(u[26])+' →</a></div>')
    guides=doc.get_element_by_id('guides');grid=guides.xpath('.//div[@class="guides"]')[0]
    replace(grid,''.join('<article class="guide'+(' feature' if i==0 else '')+'"><div><span class="meta">'+text(u[13])+': '+DATE+'</span><h3>'+text(content(lang,k)[0])+'</h3><p>'+text(content(lang,k)[1])+'</p></div><a class="text-link" href="'+url(lang,k)+'">'+text(u[17])+' ↗</a></article>' for i,k in enumerate(['rehearsal','spreadsheet','us-shipping'])))
    button=doc.get_element_by_id('allGuidesBtn');button.tag='a';button.attrib.clear();button.set('href',index_url(lang));button.set('class','all-guides-btn');button.text=u[11]
    faq=FAQ[lang];mount=doc.get_element_by_id('reverseFaqMount')
    replace(mount,'<div class="reverse-faq-shell"><div class="reverse-faq-head"><div><div class="reverse-faq-kicker">'+text(faq['kicker'])+'</div><h2 class="reverse-faq-title">'+text(faq['title'])+' <span>FAQ</span></h2></div><p class="reverse-faq-intro">'+text(faq['intro'])+'</p></div><div class="reverse-faq-grid">'+''.join('<details class="reverse-faq-item"><summary class="reverse-faq-question"><span class="reverse-faq-num">'+str(i+1).zfill(2)+'</span><span>'+text(q)+'</span><span class="reverse-faq-plus">+</span></summary><div class="reverse-faq-answer">'+text(a)+'</div></details>' for i,(q,a) in enumerate(faq['items']))+'</div></div>')
    # All FAQ rows remain available on mobile as well as desktop.
    for p in doc.xpath('//footer//p'):p.text=u[24]
    for el in doc.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," disclaimer ")]'):el.text=u[24]
    headnode=doc.xpath('//head')[0]
    styles=''.join(html.tostring(s,encoding='unicode') for s in headnode.xpath('./style'))
    title='LitBuy Spreadsheet 2026 | '+u[1]
    replace(headnode,head(lang,title,u[2],url(lang))+styles+'<style>[hidden]{display:none!important}.main-search-form button{flex-shrink:0;border:0;background:var(--ink);color:white;border-radius:12px;padding:12px 18px;cursor:pointer;font-weight:800}.metrics .metric strong{overflow-wrap:anywhere}.reference-note{font-size:14px;color:#aab3c2;line-height:1.6;margin-top:20px}.reverse-faq-grid .reverse-faq-item{display:block!important}.main-search-module{padding:28px}.main-search-form{display:flex;gap:10px}.main-search-field{flex:1;min-width:0}.main-search-field input{width:100%;padding:14px;border-radius:10px}.all-guides-btn{text-decoration:none}.main-search-results{display:grid;gap:12px}.main-search-result{display:flex;gap:12px;padding:12px;border:1px solid #ccc;border-radius:12px;text-decoration:none}.main-search-result img{width:70px;height:70px;object-fit:contain}.main-search-result small{display:block}.catalog-search .wrap{display:block}@media(max-width:760px){.main-search-module{padding:18px}.main-search-form{flex-wrap:wrap}.main-search-field{flex-basis:100%}.main-search-form button{width:100%}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style>'+json_script({'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in faq['items']]})+analytics())
    doc.get_element_by_id('searchStatus').set('data-empty',u[21]);doc.get_element_by_id('searchStatus').set('data-count',u[54])
    return html.tostring(doc,encoding='unicode',doctype='<!doctype html>')

def write(path,body):
    p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(body)
def main():
    for lang in LANGS:
        write((prefix(lang).lstrip('/')+'/' if lang!='en' else '')+'index.html',homepage(lang))
        write(prefix(lang).lstrip('/')+'/guides/index.html' if lang!='en' else 'guides/index.html',guide_index(lang))
        for key in SLUGS:
            write(url(lang,key).lstrip('/')+'.html',article(lang,key))
    write('404.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | LitBuyVIP</title><style>'+CSS+'</style></head><body>'+nav('en')+'<main class="hero"><h1>Page not found</h1><p>This address does not point to a current page.</p><p><a href="/guides/">Browse all buyer guides</a></p><p><a href="/">Return to the spreadsheet</a></p></main>'+analytics()+'</body></html>')
    # Pages natively maps .html resources to extensionless URLs with a redirect.
    # Keep that behavior; an inverse rewrite would create a loop.
    write('_redirects','/en/ / 301\n/en/guides/ /guides/ 301\n/en/guides/* /guides/:splat 301\n')
    write('_headers','/assets/*\n  Cache-Control: public, max-age=86400\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n')
    write('robots.txt','User-agent: *\nAllow: /\n\nSitemap: '+BASE+'/sitemap.xml\n')
    ns='http://www.sitemaps.org/schemas/sitemap/0.9';xmlns='http://www.w3.org/1999/xhtml'
    sm=etree.Element('{'+ns+'}urlset',nsmap={None:ns,'xhtml':xmlns})
    for lang in LANGS:
        for key in [None,'INDEX']+list(SLUGS):
            target=index_url(lang) if key=='INDEX' else url(lang,key)
            entry=etree.SubElement(sm,'{'+ns+'}url');etree.SubElement(entry,'{'+ns+'}loc').text=BASE+target;etree.SubElement(entry,'{'+ns+'}lastmod').text=DATE
            for alternate in LANGS+['x-default']:
                l='en' if alternate=='x-default' else alternate
                at=index_url(l) if key=='INDEX' else url(l,key)
                etree.SubElement(entry,'{'+xmlns+'}link',rel='alternate',hreflang=LANG_ATTR.get(alternate,alternate),href=BASE+at)
    write('sitemap.xml',etree.tostring(sm,encoding='unicode',pretty_print=True))
    args=argparse.ArgumentParser();args.add_argument('--output');options=args.parse_args()
    if options.output:
        out=ROOT/options.output
        if out.exists():shutil.rmtree(out)
        out.mkdir()
        for name in ['index.html','404.html','assets','guides',*LANGS[1:],'robots.txt','sitemap.xml','_redirects','_headers']:
            source=ROOT/name;target=out/name
            if source.is_dir():shutil.copytree(source,target)
            else:shutil.copy2(source,target)
    print('Built 189 static pages: 9 homepages, 9 guide indexes, 171 articles.')
if __name__=='__main__':main()
