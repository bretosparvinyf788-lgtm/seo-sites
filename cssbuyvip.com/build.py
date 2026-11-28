from pathlib import Path
import json,html,re,hashlib
from urllib.parse import quote,urlsplit,urlunsplit,parse_qsl,urlencode
root=Path(__file__).parent/'dist';template=(root/'index.html').read_text();data=json.loads((root/'catalog.json').read_text());origin='https://cssbuyvip.com'
config=json.loads((root.parent/'site-config.json').read_text())
agents=json.loads((root/'platforms.json').read_text())
def agent_url(a,item):
 if a.get('status')!='active':return None
 return a['template'].replace('{id}',quote(item,safe='')).replace('{url}',quote('https://weidian.com/item.html?itemID='+item,safe=''))
def other_agents(p):
 rows=[]
 for a in sorted(agents,key=lambda a:a['id']!='cssbuy'):
  image='<img src="'+html.escape(a['icon'])+'" alt="" width="40" height="40">'
  url=agent_url(a,p['id'])
  note='<small>Current platform</small>' if a['id']=='cssbuy' else '<small>Purchase link unavailable</small>' if not url else ''
  inner=image+'<span class="agent-name"><strong>'+html.escape(a['name'])+'</strong>'+note+'</span>'
  if url:link='<a class="agent-link" data-agent="'+a['id']+'" href="'+html.escape(url,quote=True)+'" target="_blank" rel="sponsored noopener noreferrer">'+inner+'<span class="agent-open">Open</span></a>'
  else:link='<button class="agent-link" data-agent="'+a['id']+'" type="button" disabled>'+inner+'</button>'
  copy='<button class="agent-copy" type="button" '+('data-copy-agent="'+html.escape(url,quote=True)+'"' if url else 'disabled')+'>Copy link</button>'
  rows.append('<div class="agent-row '+('is-current' if a['id']=='cssbuy' else '')+'" data-agent-name="'+a['name'].lower()+'">'+link+copy+'</div>')
 return '<div class="agent-options"><button class="agents-trigger" type="button" aria-haspopup="dialog" aria-controls="agent-dialog">Other purchasing agents</button></div><dialog class="agent-dialog" id="agent-dialog" aria-labelledby="agent-dialog-title"><div class="agent-dialog-heading"><h2 id="agent-dialog-title">Other purchasing agents</h2><button class="agent-close" type="button" aria-label="Close">×</button></div><p id="agent-dialog-description">Open this same item with your preferred agent. Each platform calculates its own final price and shipping.</p><input class="agent-search" type="search" aria-label="Search purchasing agents" placeholder="Search purchasing agents"><div class="agent-list">'+''.join(rows)+'<p class="agent-empty" hidden>No matching platforms</p></div><p class="agent-copy-status" role="status"></p><input class="agent-copy-fallback" readonly hidden aria-label="Select and copy this link"></dialog>'

def thumbnail_url(image):
 u=urlsplit(image);q=dict(parse_qsl(u.query));q.update(w='180',h='180',cp='0');return urlunsplit((u.scheme,u.netloc,u.path,urlencode(q),u.fragment))

def static_gallery(p):
 path=root/'data/galleries'/(p['id']+'.json')
 g=json.loads(path.read_text()) if path.exists() else {}
 images=g.get('carousel',[]);styles=g.get('styles',[])
 cover=images[0] if images else styles[0]['image'] if styles else p['image']
 result='<div class="product-gallery"><img referrerpolicy="no-referrer" class="cover" width="500" src="'+html.escape(cover,quote=True)+'" alt="'+html.escape(p['name'],quote=True)+'">'
 if images:result+='<div class="gallery-strip">'+''.join('<img referrerpolicy="no-referrer" width="80" height="80" loading="lazy" data-original-src="'+html.escape(u,quote=True)+'" src="'+html.escape(thumbnail_url(u),quote=True)+'" alt="Product photo '+str(i+1)+'">' for i,u in enumerate(images))+'</div>'
 return result+'</div>'

def static_styles(p):
 path=root/'data/galleries'/(p['id']+'.json')
 g=json.loads(path.read_text()) if path.exists() else {}
 if not g.get('styles'):
  note='The source does not currently provide separate style photos for this item.' if g.get('status') in ['available','no_images'] else 'Style photos have not been imported for this item yet.'
  return '<div class="gallery-styles"><p class="gallery-note">'+note+'</p></div>'
 return '<section class="gallery-styles"><h2>Styles &amp; colours <span class="style-count">'+str(len(g['styles']))+'</span></h2><div class="style-grid">'+''.join('<div class="gallery-thumb"><img referrerpolicy="no-referrer" loading="lazy" data-original-src="'+html.escape(x['image'],quote=True)+'" src="'+html.escape(thumbnail_url(x['image']),quote=True)+'" alt="'+html.escape(x['label'],quote=True)+'"></div>' for x in g['styles'])+'</div></section>'

# Export independent locales so one language switch does not fetch every translation.
locale_data=json.loads((root/'translations.json').read_text());(root/'locales').mkdir(exist_ok=True)
for code,values in locale_data.items():(root/'locales'/(code+'.json')).write_text(json.dumps(values,ensure_ascii=False,separators=(',',':')))
versions={name:hashlib.sha256((root/name).read_bytes()).hexdigest()[:12] for name in ['catalog.json','guide.json','guide-mobile.json','platforms.json','gallery-index.json']}
locale_version=hashlib.sha256((root/'translations.json').read_bytes()).hexdigest()[:12]
versions.update({'locales/'+code+'.json':locale_version for code in locale_data})
# Gallery content shares one version stamp; each request still loads only that product.
gallery_hash=hashlib.sha256()
for gallery_file in sorted((root/'data/galleries').glob('*.json')):gallery_hash.update(gallery_file.name.encode()+gallery_file.read_bytes())
versions['galleries']=gallery_hash.hexdigest()[:12]
visual_version=hashlib.sha256((root/'visual/index.json').read_bytes()+(root/'visual/embeddings.i8').read_bytes()).hexdigest()[:12]
visual_script=(root/'visual-search.js').read_text()
visual_script=re.sub(r"const INDEX_VERSION='[^']*';","const INDEX_VERSION='"+visual_version+"';",visual_script)
(root/'visual-search.js').write_text(visual_script)
visual_js_version=hashlib.sha256(visual_script.encode()).hexdigest()[:12]
app_source=(root/'app.js').read_text()
app_source=re.sub(r"import\('/visual-search\.js(?:\?[^']*)?'\)","import('/visual-search.js?v="+visual_js_version+"')",app_source)
app_source=re.sub(r'const DATA_VERSIONS=\{[^;]*\};','const DATA_VERSIONS='+json.dumps(versions,separators=(',',':'))+';',app_source)
(root/'app.js').write_text(app_source)
experience_version=hashlib.sha256((root/'experience.js').read_bytes()).hexdigest()[:12]
template=re.sub(r'src="/experience\.js(?:\?[^"]*)?"', 'src="/experience.js?v='+experience_version+'"',template)
app_bytes=(root/'app.js').read_bytes();app_version=hashlib.sha256(app_bytes).hexdigest()[:12]
app_path='assets/app-'+app_version+'.js';(root/app_path).write_bytes(app_bytes)
template=re.sub(r'src="/(?:app\.js|assets/app-[a-f0-9]{12}\.js)"', 'src="/'+app_path+'"',template)
template=re.sub(r'<meta name="site-build" content="[^"]+">','',template).replace('</head>','<meta name="site-build" content="'+app_version+'"></head>')
style_bytes=(root/'style.css').read_bytes();style_version=hashlib.sha256(style_bytes).hexdigest()[:12]
style_path='assets/style-'+style_version+'.css';(root/style_path).write_bytes(style_bytes)
template=re.sub(r'href="/(?:style\.css|assets/style-[a-f0-9]{12}\.css)"','href="/'+style_path+'"',template)
(root/'index.html').write_text(template)
def page(path,title,body=''):
 content=template.replace('<title>CSSBuy Spreadsheet | CSSBuy VIP</title>','<title>'+html.escape(title)+'</title>').replace('</head>',f'<link rel="canonical" href="{origin}/{path}"></head>')
 if body:content=re.sub(r'<main id="app">.*?</main>',lambda m:'<main id="app">'+body+'</main>',content,flags=re.S)
 target=root/path/'index.html';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(content)
for path in ['spreadsheet','categories','guide','image-search']+[f'category/{i}' for i in range(10)]:page(path+'/',path.split('/')[0].title()+' | CSSBuy VIP')
for p in data:
 price=('USD '+format(p['price'],'.2f')) if p['price']>0 else 'Check current price on CSSBuy'
 purchase_url=config['purchase_template'].format(weidian_id=p['id'])
 purchase='<p>Purchase link unavailable in the source catalogue.</p>' if p.get('purchaseUnavailable') else f'<a href="{purchase_url}" rel="sponsored">Buy on CSSBuy</a>'
 page('product/'+p['id']+'/',p['name']+' | CSSBuy VIP',f'<section class="detail">'+static_gallery(p)+f'<div class="product-info"><h1>{html.escape(p["name"])}</h1><p>{price}</p>{purchase}'+other_agents(p)+static_styles(p)+'</div></section>')
for p in data:
 for legacy in p.get('legacyIds',[]):
  alias=root/'product'/legacy/'index.html';alias.parent.mkdir(parents=True,exist_ok=True);alias.write_text((root/'product'/p['id']/'index.html').read_text())
paths=['','spreadsheet/','categories/','guide/','image-search/']+[f'category/{i}/' for i in range(10)]+['product/'+p['id']+'/' for p in data]
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+origin+'/'+p+'</loc></url>' for p in paths)+'</urlset>')
(root/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n')
assert not any('googletagmanager.com' in p.read_text() or 'gtag(' in p.read_text() for p in root.rglob('*.html')),'Preview analytics must stay disabled'
print('Generated',len(paths),'routes; preview analytics disabled')

(root/'404.html').write_text(template.replace('<div class="loading">Loading the finds…</div>','<section class="hero"><h1>Page not found</h1><a href="/spreadsheet/">Browse the spreadsheet</a></section>'))
