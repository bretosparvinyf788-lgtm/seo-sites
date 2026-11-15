import urllib.request,urllib.parse,re,json,html,concurrent.futures,pathlib,time
BASE='https://kakobuymake.com'
def get(u):
 req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'})
 with urllib.request.urlopen(req,timeout=30) as r:return r.read(2500000).decode('utf-8','replace')
def txt(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
def cards(s,cat):
 out=[]
 for block in re.findall(r'<a\b[^>]*class="product-card"[^>]*>.*?</a>',s,re.S):
  aid=re.search(r'aid=(\d+)',block); title=re.search(r'<h3[^>]*>(.*?)</h3>',block,re.S);img=re.search(r'<img[^>]+src="([^"]+)"',block);price=re.search(r'\$\s*([\d.]+)',block)
  if aid and title and img:out.append(dict(id=aid[1],title=txt(title[1]),image=urllib.parse.urljoin(BASE,html.unescape(img[1])),price=float(price[1]) if price else None,cat=cat))
 return out
def page(c,p):
 u=BASE+f'/?m=home&c=Lists&a=index&tid={c}&page={p}'
 try:
  s=get(u); total=re.search(r'共(?:<[^>]+>|\s)*(\d+)(?:<[^>]+>|\s)*页',s);return c,p,cards(s,c),int(total[1]) if total else 1
 except Exception as e:print('FAIL',c,p,str(e),flush=True);return c,p,[],1
products={};first=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for c,p,rows,total in pool.map(lambda c:page(c,1),range(2,12)):
  for r in rows:products[r['id']]=r
  first.append((c,total));print('category',c,'pages',total,'rows',len(rows),flush=True)
 tasks=[(c,p) for c,total in first for p in range(2,total+1)]
 for i,(c,p,rows,total) in enumerate(pool.map(lambda t:page(*t),tasks)):
  for r in rows:products[r['id']]=r
  if i%10==0:print('listing pages',i+1,'/',len(tasks),'products',len(products),flush=True)
pathlib.Path('src/catalogue.json').write_text(json.dumps(list(products.values()),ensure_ascii=False))
print('CATALOGUE',len(products),flush=True)
def detail(p):
 try:
  s=get(BASE+'/?m=home&c=View&a=index&aid='+p['id']);ids=re.findall(r'itemID(?:=|%3D)(\d{8,12})',html.unescape(s));p['weidian']=ids[0] if ids else None
  gal=s.split('<div class="thumbnail-carousel">')[-1].split('</div>')[0];p['qc']=list(dict.fromkeys(urllib.parse.urljoin(BASE,x) for x in re.findall(r'<img[^>]+src="([^"]+)"',gal)))
  p['gallery']=[]
  if p['weidian']:
   wd=html.unescape(get('https://weidian.com/item.html?itemID='+p['weidian']))
   match=re.search(r'"imgs"\s*:\s*(\[[^\]]+\])',wd)
   if match:p['gallery']=json.loads(match[1])
  return p
 except Exception as e:print('DETAILFAIL',p['id'],str(e),flush=True);return p
# A balanced first edition; the remaining detail pages resolve on demand.
picks=[]
for c,n in [(2,8),(3,4),(4,4),(5,4),(6,4),(7,2),(8,4),(9,2),(10,2),(11,2)]:picks += [p.copy() for p in products.values() if p['cat']==c][:n]
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 for i,p in enumerate(pool.map(detail,picks)):
  pathlib.Path('src/details').mkdir(exist_ok=True);pathlib.Path('src/details/'+p['id']+'.json').write_text(json.dumps(p,ensure_ascii=False));print('detail',i+1,p['id'],'gallery',len(p.get('gallery',[])),'qc',len(p.get('qc',[])),flush=True)
