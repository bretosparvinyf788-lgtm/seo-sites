import json,pathlib,html,shutil
SHOW_GUIDES = False
shutil.rmtree(pathlib.Path(__file__).parent/'dist/client', ignore_errors=True)
shutil.copytree(pathlib.Path(__file__).parent/'public', pathlib.Path(__file__).parent/'dist/client', dirs_exist_ok=True)
R=pathlib.Path(__file__).parent;D=R/'dist/client'; C=json.loads((R/'content.json').read_text());P=json.loads((R/'catalog.json').read_text());cats=['shoes','shirts','clothing','hoodies','pants','belts','bags','perfume','electronics','other'];slugs=['first-usfans-order','product-photos-and-qc','shipping-budget'];iconpaths=['M3 15l5-2 2-6 4 1 2 6 5 2v4H3z M4 17h16 M10 10l4 2','M8 4l4 2 4-2 6 4-3 5-3-2v10H8V11l-3 2-3-5z','M8 3h8l4 5-2 5-2-2v11H8V11l-2 2-2-5z M12 5v17 M9 3l3 5 3-5','M8 7q0-7 4-7t4 7l5 3-3 5-2-2v9H8v-9l-2 2-3-5z M10 17h4','M6 3h12l2 19h-6l-2-13-2 13H4z M6 6h12','M3 8h18v8H3z M6 7h6v10H6z M9 12h7','M4 8h16l1 14H3z M8 8V6a4 4 0 018 0v2','M7 8h10v14H7z M9 3h6v5H9z M9 13h6v4H9z','M7 2h10v20H7z M10 5h4 M11 19h2','M12 2l3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z'];icons=['<svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>' for d in iconpaths];reg='https://usfans.com/register?ref=T2JMMC';origin='https://usfansfindsbook.com'
G=json.loads((R/'content/category-guides.json').read_text())
B=json.loads((R/'content/beginner-guide.json').read_text())
I=json.loads((R/'content/guide-pictures.json').read_text())
L=json.loads((R/'content/locale-config.json').read_text())
F=json.loads((R/'content/faq.json').read_text())
for lang, data in F.items():
 C[lang].update(faqTabs=data['tabs'], questions=[x[0] for x in data['items']], answers=[x[1] for x in data['items']], faqIntro=data['intro'], faqNote=data['note'], faqHelp=data['help'], faqRegister=data['register'])
def name(p,l):return p['titles'][l]
def e(s):return html.escape(str(s),quote=True)
def url(lang,path=''):return '/'+('' if lang=='en' else lang+'/')+path

def breadcrumbs(t,l,items):
 links=[(t['nav'][0],url(l))]+items
 return '<div class="breadcrumbs" role="navigation" aria-label="'+e(t['nav'][2])+'"><ol>'+''.join('<li>'+('<a href="'+e(href)+'">'+e(label)+'</a>' if href else '<span aria-current="page">'+e(label)+'</span>')+'</li>' for label,href in links)+'</ol></div>'

heart='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/></svg>'
def savebutton(p,t):
 return f'<button class="save-item" data-save="{p["id"]}" aria-pressed="false" aria-label="{e(t["explorer"]["save"])}: {e(p["titles"]["en"])}" disabled>{heart}</button>'
def product(p,t,l):
 return f'<article class="product" data-id="{p["id"]}" data-category="{p["category"]}" data-cost="{p["price"]}" data-qc="{int(bool(p.get("qc_images")))}"><div class="product-img"><a href="{url(l,"products/"+p["id"]+"/")}"><img src="{p["image"]}" alt="{e(name(p,l))}" loading="lazy" width="360" height="360"></a>{savebutton(p,t)}</div><div class="card-copy"><div class="product-meta"><span>{t["cats"][cats.index(p["category"])]}</span><span class="qc-count">{"QC · "+str(len(p.get("qc_images",[]))) if p.get("qc_images") else ""}</span></div><h3><a href="{url(l,"products/"+p["id"]+"/")}">{e(name(p,l))}</a></h3><strong data-price="{p["price"]}">${p["price"]:.2f}</strong></div></article>'
def explorer(t,l):
 w=t['explorer']
 return f'''<section class="explorer" id="discover"><div class="view-tabs" aria-label="{e(w['explore'])}"><button data-view="discover" aria-pressed="true" class="active">{w['explore']}</button><button data-view="saved" aria-pressed="false">{w['saved']} <span data-saved-count>0</span></button><button data-view="recent" aria-pressed="false">{w['recent']}</button></div><div role="navigation" class="category-rail" aria-label="{e(w['allCategories'])}"><a class="active" href="{url(l,'spreadsheet/')}">{w['allCategories']}</a>{''.join(f'<a href="{url(l,"categories/"+cat+"/")}">{icons[i]}{t["cats"][i]}</a>' for i,cat in enumerate(cats))}</div><div class="filter-tools"><label>{w['sortLabel']}<select id="exploreSort">{''.join(f'<option value="{i}">{x}</option>' for i,x in enumerate(t['sort']))}</select></label><button class="reset-filters" id="resetFilters">{w['reset']}</button></div><div class="result-heading"><p id="resultCount" role="status">{w['results'].format(shown=10,total=len(P))}</p><button id="clearRecent" hidden>{w['clearRecent']}</button></div><div class="list-state" id="listState" hidden><p id="listStateText"></p><button class="secondary" id="retryList" hidden>{w['retry']}</button><button class="secondary" id="backDiscover" hidden>{w['browseAgain']}</button></div><div class="product-grid explore-grid" id="exploreGrid">{''.join(product(p,t,l).replace('<article ', '<article hidden ' if i>=10 else '<article ',1) for i,p in enumerate(P))}</div><div class="load-more"><a class="secondary" id="browseAll" href="{url(l,'spreadsheet/')}">{t['all']}</a><button class="secondary" id="loadMore" hidden>{w['more']}</button><p>{t['priceNote']}</p></div><p class="storage-note" id="storageNote" hidden>{w['storageNote']}</p><noscript><p><a href="{url(l,'spreadsheet/')}">{t['all']}</a></p></noscript></section>'''
def guidecards(t,l):
 return '<div class="guides-grid">'+''.join(f'<a class="guide-card" href="{url(l,"guides/"+s+"/")}"><div class="guide-art art-{i}"><span class="art-number">0{i+1}</span><span class="art-symbol">{["↗","⊙","▱"][i]}</span><span class="art-label">FINDSBOOK / NOTES</span></div><div class="kicker">{t["articleKickers"][i]}</div><h3>{t["articleTitles"][i]}</h3><span class="text-link">{t["read"]}</span></a>' for i,s in enumerate(slugs))+'</div>'
def faq(t):
 return '<p class="faq-intro">'+e(t['faqIntro'])+'</p><div class="faq-columns">'+''.join(f'<section class="faq-column" aria-labelledby="faq-heading-{j}"><h3 id="faq-heading-{j}">{e(t["faqTabs"][j])}</h3><div class="faq-group">'+''.join(f'<details><summary>{e(t["questions"][i])}</summary><p>{e(t["answers"][i])}</p></details>' for i in range(j*4,j*4+4))+'</div></section>' for j in range(3))+'</div><div class="faq-support"><p>'+e(t['faqNote'])+'</p></div>'
def guide_screen(l,file,labels,marks,title):
 w=I[l];src='/assets/beginner/'+file
 pins=''.join(f'<span class="guide-pin" style="left:{x}%;top:{y}%" aria-hidden="true">{n}</span>' for n,x,y in marks)
 return f'<div class="guide-real-screen"><h3>{e(title)}</h3><div class="guide-shot"><img src="{src}" alt="{e(title)}" loading="lazy" width="1365" height="926">{pins}</div><a class="text-link" href="{src}" target="_blank" rel="noopener">{e(w["enlarge"])}</a><ol class="guide-click-list">'+''.join(f'<li><span>{n}</span><p>{e(text)}</p></li>' for n,text in labels)+'</ol></div>'
def guide_picture(l,i):
 w=I[l];p=next(x for x in P if x.get('qc_images'));t=C[l];b=B[l]
 href=url(l,'products/'+p['id']+'/')
 identity=f'<div class="guide-item-identity"><img src="{p["image"]}" alt="{e(name(p,l))}" loading="lazy"><div><small>{e(w["sameItem"])}</small><h3><a href="{href}">{e(name(p,l))}</a></h3></div></div>'
 if i==0:
  visual=f'<div class="guide-site-example"><span class="eyebrow">{e(w["site"][3])}</span><div class="guide-example-product"><a href="{href}"><img src="{p["image"]}" alt="{e(name(p,l))}" loading="lazy"></a><div><h3><a href="{href}">{e(name(p,l))}</a></h3><p>{e(t["priceNote"])}</p><a class="secondary" href="{href}">{e(w["site"][4])}</a></div></div></div>';credit=w['site'][3]
  visual+='<ol class="guide-click-list">'+''.join(f'<li><span>{j+1}</span><p>{e(text.format(buy=t["buy"]))}</p></li>' for j,text in enumerate(w['siteSteps']))+'</ol>'
 elif i==1:
  visual=guide_screen(l,'shorts-options.jpg',[(1,w['clickSteps'][0])],[(1,49,43)],w['screenTitles'][0])+guide_screen(l,'shorts-quantity.jpg',list(enumerate(w['clickSteps'][1:],2)),[(2,49,55),(3,49,65),(4,49,91)],w['screenTitles'][1]);credit=w['realCapture']
 elif i==2:
  a=w['account'];visual=guide_screen(l,'shorts-confirm.jpg',list(enumerate(a['confirm'],1)),[(1,40,43),(2,72,35),(3,72,60)],a['confirmTitle']);credit=w['realCapture']
  visual+='<details class="guide-login-help"><summary>'+e(a['loginHelp'])+'</summary>'+guide_screen(l,'login.jpg',list(enumerate(w['loginSteps'],1)),[],w['loginTitle'])+'</details>'
 else:
  a=w['account'];nav='Order' if i==3 else ('Warehouse' if i in [4,5] else 'Parcel')
  files={3:'orders.jpg',4:'warehouse.jpg',5:'warehouse.jpg',6:'parcel-payment.jpg',7:'parcel.jpg',8:'parcel-transit.jpg',9:'parcel-received.jpg'}
  labels=[a['nav'].format(label=nav)];marks=[(1,17,43 if i==3 else (48 if i in [4,5] else 53))]
  if i==3:
   labels.extend([a['tab'].format(label='All / Payment Pending / Pending Additional Payment / Confirm Pending'),a['search'].format(label='Product Name/Order Number')]);marks.extend([(2,30,23),(3,29,34)])
  elif i in [4,5]:
   labels.extend([a['search'].format(label='Product Name/Order Number'),a['warehouse' if i==4 else 'submit']]);marks.extend([(2,40,24),(3,60,53)])
  else:
   tab={6:'Payment Pending',7:'All Parcel',8:'In transit',9:'Received'}[i]
   labels.extend([a['tab'].format(label=tab),a[{6:'payment',7:'dispatch',8:'transit',9:'received'}[i]]]);marks.append((2,{6:34,7:23,8:65,9:74}[i],23))
  visual=guide_screen(l,files[i],list(enumerate(labels,1)),marks,a['entry']+' · '+nav);credit=a['empty']
  if i==4:
   visual+='<div class="guide-site-example">'+identity+'<div class="guide-example-qc">'+''.join(f'<a href="{im}" target="_blank" rel="noopener"><img src="{im}" alt="{e(name(p,l))} — QC {j+1}" loading="lazy"></a>' for j,im in enumerate(p['qc_images'][:3]))+'</div><p>'+e(w['qcExample'])+'</p></div>'
 return f'<figure class="guide-figure">{visual}<figcaption><p>{e(b["steps"][i][0])}</p><small>{e(credit)}</small></figcaption></figure>'
def beginner(l):
 b=B[l];pay=b['payments'];w=I[l];t=C[l];a=w['account']
 p=next(x for x in P if x.get('qc_images'));detail=url(l,'products/'+p['id']+'/')
 refs='<figure class="guide-figure"><div class="guide-example-qc">'+''.join(f'<a href="{im}" target="_blank" rel="noopener"><img src="{im}" alt="{e(name(p,l))} — {j+1}" loading="lazy"></a>' for j,im in enumerate(p['qc_images'][:3]))+'</div><figcaption>'+e(w['qcExample'])+'</figcaption></figure>'
 def shot(file,title,labels):
  return '<figure class="guide-figure">'+guide_screen(l,file,list(enumerate(labels,1)),[],title)+'<figcaption>'+e(w['realCapture'])+'</figcaption></figure>'
 original=b['steps']
 entries=[
  (*original[0],guide_picture(l,0),(detail,w['site'][4],False)),
  (t['qc'],w['siteSteps'][1],original[1][2],refs,None),
  (t['buy'],w['siteSteps'][2].format(buy=t['buy']),original[1][2],shot('shorts-options.jpg',w['screenTitles'][0],[w['siteSteps'][2].format(buy=t['buy'])]),(detail,w['site'][4],False)),
  (w['loginTitle'],' '.join(w['loginSteps']),original[2][2],shot('login.jpg',w['loginTitle'],w['loginSteps']),(reg,b['register'],True)),
  (w['screenTitles'][0],w['clickSteps'][0],original[1][2],shot('shorts-options.jpg',w['screenTitles'][0],[w['clickSteps'][0]]),None),
  (w['screenTitles'][1],' '.join(w['clickSteps'][1:]),original[1][2],shot('shorts-quantity.jpg',w['screenTitles'][1],w['clickSteps'][1:]),None),
  (a['confirmTitle'],' '.join(a['confirm']),original[2][2],shot('shorts-confirm.jpg',a['confirmTitle'],a['confirm']),None),
  (*original[2],shot('shorts-confirm.jpg',a['confirmTitle'],a['confirm']),None),
 ]+[(v[0],v[1],v[2],guide_picture(l,i),None) for i,v in enumerate(original) if i>=3]
 assert len(entries)==15
 rail='<aside class="beginner-index" aria-label="'+e(b['toc'])+'"><p>'+e(b['toc'])+'</p><ol>'+''.join(f'<li><a href="#step-{i+1}"><span>{i+1:02}</span>{e(v[0])}</a></li>' for i,v in enumerate(entries))+'</ol></aside>'
 steps=''
 for i,(title,body,check,visual,action) in enumerate(entries):
  button=''
  if action:
   href,label,external=action;attrs=' target="_blank" rel="sponsored noopener"' if external else ''
   button=f'<a class="secondary" href="{href}"{attrs}>{e(label)}</a>'
  nav='<nav class="guide-step-nav" aria-label="'+e(b['toc'])+'">'
  if i>0:nav+=f'<a href="#step-{i}">← {i:02} · {e(entries[i-1][0])}</a>'
  if i+1<len(entries):nav+=f'<a href="#step-{i+2}">{i+2:02} · {e(entries[i+1][0])} →</a>'
  nav+='</nav>'
  steps+=f'<section class="beginner-step" id="step-{i+1}"><div class="beginner-step-top"><span class="beginner-number">{i+1:02}</span><span class="eyebrow">{e(b["onSite"] if i<3 else b["onAgent"])}</span></div><h2>{e(title)}</h2><p>{e(body)}</p>{visual}<div class="beginner-check"><h3>{e(b["check"])}</h3><p>{e(check)}</p></div>{button}{nav}</section>'
 return f'<section class="section beginner-heading"><span class="eyebrow">FINDSBOOK / USFANS</span><h1>{e(b["title"])}</h1><p>{e(b["intro"])}</p></section><section class="section beginner-budget"><h2>{e(pay[0])}</h2><div class="beginner-payments"><div><span>01</span><h3>{e(pay[1])}</h3><p>{e(pay[2])}</p></div><div><span>02</span><h3>{e(pay[3])}</h3><p>{e(pay[4])}</p></div></div></section><div class="section beginner-layout">'+rail+'<div class="beginner-steps">'+steps+f'<div class="beginner-end"><p>{e(b["note"])}</p><div><a class="text-link" href="{url(l,"faq/")}">{e(b["faq"])}</a></div></div></div></div>'

def categories(t,l):
 return '<div class="categories">'+''.join(f'<a href="{url(l,"categories/"+c+"/")}"><img src="{next(p["image"] for p in P if p["category"]==c)}" alt="" loading="lazy" width="180" height="180"><span>{t["cats"][i]}</span></a>' for i,c in enumerate(cats))+'</div>'
def category_advice(t,l,cat):
 g=G[l];v=g['items'][cat]
 return '<div class="category-advice">'+''.join(f'<section><h3>{e(label)}</h3><p>{e(v[key])}</p></section>' for label,key in zip(g['labels'],['choose','photos','confirm']))+'</div>'
def category_guides(t,l):
 g=G[l]
 return f'<section class="section category-guide-section" id="category-guide"><div class="category-guide-heading"><h2>{e(g["title"])}</h2><p>{e(g["intro"])}</p></div><div class="category-guide-grid">'+''.join(f'<details class="category-guide-card"><summary><span class="category-guide-icon">{icons[i]}</span><span><span class="category-guide-name">{e(t["cats"][i])}</span></span></summary><p class="category-guide-intro">{e(g["items"][cat]["intro"])}</p>'+category_advice(t,l,cat)+f'<a class="text-link category-guide-link" href="{url(l,"categories/"+cat+"/")}">{e(g["browse"])}</a></details>' for i,cat in enumerate(cats))+'</div></section>'
def qc_section(p,t,l):
 photos=p.get('qc_images',[])
 if not photos:return f'<div class="qc-panel"><h2>{t["qc"]}</h2><p>{t["noqc"]}</p></div>'
 return f'<section class="qc-panel has-qc"><h2>{t["qc"]} <small>{len(photos)}</small></h2><p>{t["qcNote"]}</p><div class="qc-grid">'+''.join(f'<button data-zoom="{im}" aria-label="{t["viewImage"]} {j+1}"><img src="{im}" loading="lazy" width="400" height="400" alt="{e(name(p,l))} — QC {j+1}"></button>' for j,im in enumerate(photos))+'</div></section>'
def shell(body,t,l,path,title,desc,schema=None):
 navpaths=['','spreadsheet/','categories/','guides/','faq/']
 nav=''.join(f'<a class="{"selected" if path==p or (p=="categories/" and path.startswith(p)) else ""}" href="{url(l,p)}">{n}</a>' for n,p in zip(t['nav'],navpaths) if SHOW_GUIDES or p != 'guides/')
 nav+=f'<a class="{"selected" if path=="beginner-guide/" else ""}" href="{url(l,"beginner-guide/")}">{e(B[l]["nav"])}</a>'
 langs=''.join(f'<a href="{url(k,path)}" lang="{k}" class="{"active" if l==k else ""}">{v["name"]}<span>{L[k]["currency"]}</span></a>' for k,v in C.items())
 return f'''<!doctype html><html lang="{l}" dir="{'rtl' if l=='ar' else 'ltr'}"><head><meta charset="utf-8"><script async src="https://www.googletagmanager.com/gtag/js?id=G-KBG9HJZ2QR"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-KBG9HJZ2QR');</script><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} | USFans Findsbook</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{origin}{url(l,path)}">{''.join(f'<link rel="alternate" hreflang="{k}" href="{origin}{url(k,path)}">' for k in C)}<link rel="alternate" hreflang="x-default" href="{origin}{url('en',path)}"><link rel="icon" href="/assets/favicon.png"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="{origin}{url(l,path)}"><link rel="stylesheet" href="/style.css?v=live-main-1"><script defer src="/app.js?v=live-main-1"></script><script id="explorerWords" type="application/json">{json.dumps(t["explorer"],ensure_ascii=False).replace("<", "\\u003c")}</script><script defer src="/explorer.js?v=live-main-1"></script><script id="localeConfig" type="application/json">{json.dumps(L[l],ensure_ascii=False)}</script><script defer src="/fx.js?v=languages-24"></script>{'<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>' if schema else ''}</head><body><a class="skip-link" href="#main">{t["explorer"]["explore"]}</a><header><a class="brand" href="{url(l)}"><img src="/assets/wordmark.webp" width="128" height="40" alt="USFans"></a><nav id="nav">{nav}<a href="{url(l)}#saved" class="saved-nav">{t["explorer"]["saved"]} <span data-saved-count>0</span></a></nav><div class="controls"><details class="selector language"><summary aria-label="{t['language']}">◎ <span>{l.upper()}</span></summary><div class="dropdown">{langs}</div></details><details class="selector"><summary aria-label="{t['currency']}"><span id="currencyLabel">USD</span>⌄</summary><div class="dropdown currencies">{''.join(f'<button data-currency="{v}">{v}</button>' for v in sorted(set(v['currency'] for v in L.values()) | {'GBP','CAD','AUD'}))}</div></details><a class="button small" href="{reg}" target="_blank" rel="sponsored noopener">{t['join']}</a><button class="menu" aria-label="{e(t['nav'][2])}" aria-expanded="false" aria-controls="nav">☰</button></div></header><main id="main">{body}</main><footer><div class="footer-top"><a class="brand" href="{url(l)}"><img src="/assets/wordmark.webp" width="128" height="40" alt="USFans"></a><p>{t['footer']}</p><a class="text-link" href="{reg}" target="_blank" rel="sponsored noopener">{t['join']}</a></div><div class="footer-bottom"><span>© 2026 usfansfindsbook.com</span><p>{t['disclosure']}</p><p data-fx-status role="status"></p></div></footer><dialog id="imageDialog"><button id="closeImage" aria-label="{t['closeImage']}">×</button><img id="expandedImage" alt=""><p id="imageCaption"></p></dialog><div id="toast" role="status"></div></body></html>'''
def write(l,path,body,title,desc,schema=None):
 if not SHOW_GUIDES and path.startswith("guides/"): return
 d=D/url(l,path).lstrip('/');d.mkdir(parents=True,exist_ok=True);(d/'index.html').write_text(shell(body,C[l],l,path,title,desc,schema))
for l,t in C.items():
 product_dir=D/url(l,'products/').lstrip('/')
 if product_dir.exists():
  for old in product_dir.iterdir():
   if old.is_dir() and old.name not in {p['id'] for p in P}: shutil.rmtree(old)
 if not SHOW_GUIDES:
  old_guides=D/url(l,"guides/").lstrip("/")
  if old_guides.exists(): shutil.rmtree(old_guides)
 section=lambda kick,title,sub:f'<div class="section-head"><div><div class="kicker">{kick}</div><h2>{title}</h2><p>{sub}</p></div></div>'
 w=t['explorer']
 body=f'<section class="browse-masthead"><div class="masthead-top"><span>FINDSBOOK</span><span>{len(P)} {t["featured"]} / {sum(bool(p.get("qc_images")) for p in P)} {w["qcCount"]}</span></div><h1><span>USFans</span> {e(t["nav"][1])}<span class="title-period">.</span></h1><p>{w["introExplore"]}</p></section>'+explorer(t,l)
 body+=f'<section class="join-strip"><div><span class="eyebrow">USFANS / T2JMMC</span><h2>{w["registerStrip"]}</h2><p>{w["registerStripBody"]}</p></div><a class="button" href="{reg}" target="_blank" rel="sponsored noopener">{t["join"]}</a></section>'
 body+=f'<section id="how" class="section buying-section"><div class="section-head"><span class="eyebrow">01 / FINDSBOOK</span><h2>{t["how"]}</h2></div><div class="process-steps">'+''.join(f'<div class="process-step"><span>0{j+1}</span><h3>{t["steps"][j]}</h3><p>{t["stepBody"][j]}</p></div>' for j in range(3))+'</div></section>'
 body+=f'<div class="beginner-home-link"><a class="secondary" href="{url(l,"beginner-guide/")}">{e(B[l]["open"])}</a></div>'
 if SHOW_GUIDES: body+='<section class="section guides-section">'+section('',t['guides'],t['guidesSub'])+guidecards(t,l)+'</section>'
 body+=category_guides(t,l)
 body+='<section class="section faq-section">'+section('',t['faq'],'')+faq(t)+'</section>'
 write(l,'',body,'USFans '+t['nav'][1],t['intro'],{'@context':'https://schema.org','@type':'WebSite','name':'USFans Findsbook','url':origin+url(l)})
 for cat in [None]+cats:
  ix=cats.index(cat) if cat else None; selected=[];title=t['cats'][ix] if cat else t['nav'][1];path='categories/'+cat+'/' if cat else 'spreadsheet/'
  description=G[l]['items'][cat]['intro'] if cat else t['featuredSub']
  trail=[(t["nav"][2],url(l,"categories/")),(title,None)] if cat else [(title,None)]
  body=f'<section class="section page-heading">{breadcrumbs(t,l,trail)}<div class="kicker">USFANS FINDSBOOK / {t["nav"][1]}</div><h1>{title}</h1><p>{e(description)}</p></section><section class="section listing"><div class="filterbar"><div class="chips"><a class="{"active" if not cat else ""}" href="{url(l,"spreadsheet/")}">{t["all"]}</a>'+''.join(f'<a class="{"active" if cat==c else ""}" href="{url(l,"categories/"+c+"/")}">{t["cats"][i]}</a>' for i,c in enumerate(cats))+f'</div><select id="sort" aria-label="{e(w["sortLabel"])}">'+''.join(f'<option value="{i}">{s}</option>' for i,s in enumerate(t['sort']))+'</select></div><!--LIVE_LIST--><p class="fine">'+e(w['loading'])+'</p><!--END_LIVE_LIST-->'

  if cat:body+=f'<section class="category-detail-advice"><h2>{e(G[l]["detailTitle"])}</h2>'+category_advice(t,l,cat)+'</section>'
  if cat:body+=f'<p><a class="text-link" href="{url(l,"spreadsheet/")}">{t["all"]} →</a></p>'
  body+=f'<p class="fine">{t["priceNote"]}</p><p class="fine">{t["estimate"]}</p></section>';write(l,path,body,'USFans '+title,description)
 write(l,'categories/','<section class="section page-heading">'+breadcrumbs(t,l,[(t["nav"][2],None)])+'<h1>'+t['nav'][2]+'</h1><p>'+t['catSub']+'</p>'+categories(t,l)+'</section>'+category_guides(t,l),t['nav'][2],t['catSub'])
 write(l,'guides/','<section class="section page-heading"><div class="kicker">FINDSBOOK / NOTES</div><h1>'+t['guides']+'</h1><p>'+t['guidesSub']+'</p>'+guidecards(t,l)+'</section>',t['nav'][3],t['guidesSub'])
 write(l,'beginner-guide/',beginner(l),B[l]['nav']+' — USFans',B[l]['intro'])
 write(l,'faq/','<section class="section page-heading"><h1>'+t['faq']+'</h1>'+faq(t)+'</section>',t['nav'][4],t['faq'],{'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in zip(t['questions'],t['answers'])]})
 for i,slug in enumerate(slugs):
  b=t['articleBodies'][i];body=f'<article class="article"><a class="text-link" href="{url(l,"guides/")}">{t["nav"][3]}</a><div class="kicker">{t["articleKickers"][i]} · 2026-10-05</div><h1>{t["articleTitles"][i]}</h1><div class="guide-art art-{i}"><span class="art-number">0{i+1}</span><span class="art-symbol">{["↗","⊙","▱"][i]}</span><span class="art-label">FINDSBOOK / NOTES</span></div><div class="article-body">'+''.join(f'<h2>{b[j]}</h2><p>{b[j+1]}</p>' for j in range(0,len(b),2))+f'</div></article><section class="section more-guides">{guidecards(t,l)}</section>'
  write(l,'guides/'+slug+'/',body,t['articleTitles'][i],b[1],{'@context':'https://schema.org','@type':'Article','headline':t['articleTitles'][i],'datePublished':'2026-10-05','inLanguage':l,'author':{'@type':'Organization','name':'USFans Findsbook'},'publisher':{'@type':'Organization','name':'USFans Findsbook'}})
 for p in P:
  trail=[(t["nav"][2],url(l,"categories/")),(t["cats"][cats.index(p["category"])],url(l,"categories/"+p["category"]+"/")),(name(p,l),None)]
  imgs=p['images'];body=f'<section class="section detail-page" data-current-product="{p["id"]}">{breadcrumbs(t,l,trail)}<div class="detail-grid"><div><div class="main-photo"><button class="main-image-zoom" data-zoom="{p["image"]}" aria-label="{t["viewImage"]}"><img id="mainPhoto" src="{p["image"]}" alt="{e(name(p,l))}"></button></div><div class="thumbnails"><button data-image="{p["image"]}"><img src="{p["image"]}" alt="1"></button>'+''.join(f'<button data-image="{e(x)}"><img src="{e(x)}" alt="{j+2}" loading="lazy"></button>' for j,x in enumerate(imgs[1:]))+f'</div></div><div class="detail-copy"><div class="detail-save">{savebutton(p,t)}<span>{t["explorer"]["saved"]}</span></div><div class="kicker">{t["cats"][cats.index(p["category"])]}</div><h1>{e(name(p,l))}</h1><p class="detail-price" data-price="{p["price"]}">${p["price"]:.2f}</p><p class="fine">{t["price"]} · {p['recorded_at']}</p><p>{t["priceNote"]}</p><p class="source-id">{t["itemId"]}: <strong>{p.get("item_id", "")}</strong></p>'
  if p['buy']:body+=f'<a class="button wide" href="{e(p["buy"])}" target="_blank" rel="sponsored noopener">{t["buy"]}</a>'
  body+=f'<a class="secondary wide" href="{e(p["source"])}" target="_blank" rel="noopener">{t["source"]}</a>'
  if p['market']:body+=f'<button class="copy text-link" data-copy="{e(p["market"])}" data-copied="{t["copied"]}">{t["copy"]} ⧉</button>'
  body+=f'<div class="checklist"><h3>{t["check"]}</h3>'+''.join(f'<p>✓ {x}</p>' for x in t['checks'])+f'</div></div></div>{qc_section(p,t,l)}<h2>{t["featured"]}</h2><div class="product-grid related">'+''.join(product(x,t,l) for x in P if x['id']!=p['id'])[:0]+'</div></section>'
  # related cards are generated separately to avoid truncating HTML
  body=body.replace('<div class="product-grid related"></div>','<div class="product-grid related">'+''.join(product(x,t,l) for x in [x for x in P if x['id']!=p['id']][:4])+'</div>')
  write(l,'products/'+p['id']+'/',body,name(p,l),t['priceNote'])
urls=[origin+'/'+str(x.relative_to(D)).replace('index.html','') for x in D.rglob('index.html')];(D/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+e(u)+'</loc></url>' for u in urls)+'</urlset>');(D/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');print('Generated',len(urls),'pages')
