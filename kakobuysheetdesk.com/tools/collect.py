import urllib.request,concurrent.futures,json,re,html,pathlib
root=pathlib.Path('/workspace/sites/kakobuysheetdesk.com')
def get(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read().decode()
def cards(s,c):
 out=[]
 for m in re.finditer(r'<a[^>]*href="[^"]*aid=(\d+)"[^>]*class="product-card"[^>]*>(.*?)</a>',s,re.S):
  b=m.group(2);i=re.search(r'<img[^>]*src="([^"]+)"',b);t=re.search(r'<h3[^>]*>(.*?)</h3>',b,re.S);p=re.search(r'class="price"[^>]*>\$?([\d.]+)',b)
  if i and t and p:out.append(dict(aid=m.group(1),title=html.unescape(re.sub('<[^>]+>','',t.group(1))),image='https://kakobuymake.com'+i.group(1) if i.group(1).startswith('/') else i.group(1),price=float(p.group(1)),cat=c))
 return out
def cat(c):
 s=get('https://kakobuymake.com/?m=home&c=Lists&a=index&tid='+str(c));m=re.search(r'共<strong>(\d+)</strong>页\s*<strong>(\d+)</strong>条',s)
 return str(c),dict(items=cards(s,c),pages=int(m.group(1)) if m else 1,total=int(m.group(2)) if m else 0)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:cats=dict(ex.map(cat,range(2,12)))
json.dump(cats,open(root/'tools/catalog.json','w'),ensure_ascii=False)
print('catalog',[(c,len(d['items']),d['total']) for c,d in cats.items()])
def article(i):
 data=json.dumps({'req_code':1,'data':json.dumps({'versionCode':'256','from':'1201','device_type':'web','id':i})}).encode()
 req=urllib.request.Request('https://v1.kakoapi.com/api/article/item',data=data,headers={'Content-Type':'application/json','lang':'en','Origin':'https://www.kakobuy.com'})
 d=json.loads(urllib.request.urlopen(req,timeout=30).read());return str(i),d.get('data',{})
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:arts=dict(ex.map(article,[8,45,80,84,100,111,117,114,7,55]))
json.dump(arts,open(root/'tools/articles.json','w'),ensure_ascii=False)
for i,d in arts.items():
 item=d.get('item',{});s=item.get('content','');imgs=re.findall(r'<img[^>]*src=["\']([^"\']+)',s);print(i,item.get('title'),len(imgs),imgs[:2]);
