import json,pathlib,re,html,subprocess,concurrent.futures,time
r=pathlib.Path('/workspace/sites/kakobuysheetdesk.com');cats=json.load(open(r/'tools/catalog.json'));cache=r/'tools/pages-cache';cache.mkdir(exist_ok=True)
def parse(s,c):
 a=[]
 for m in re.finditer(r'<a[^>]*href="[^"]*aid=(\d+)"[^>]*class="product-card"[^>]*>(.*?)</a>',s,re.S):
  b=m.group(2);im=re.search(r'<img[^>]*src="([^"]+)"',b);t=re.search(r'<h3[^>]*>(.*?)</h3>',b,re.S);p=re.search(r'class="price"[^>]*>\$?([\d.]+)',b)
  if im and t and p:a.append(dict(aid=m[1],title=html.unescape(re.sub('<[^>]+>','',t[1])).strip(),image='https://kakobuymake.com'+im[1] if im[1].startswith('/') else im[1],price=float(p[1]),cat=int(c)))
 return a
def one(task):
 c,page=task;path=cache/(c+'-'+str(page)+'.json')
 if path.exists():return c,json.load(open(path))
 try:
  s=subprocess.check_output(['curl','-s','-L','--max-time','40','https://kakobuymake.com/?m=home&c=Lists&a=index&tid='+c+'&page='+str(page)]).decode();a=parse(s,c)
  if a:json.dump(a,open(path,'w'),ensure_ascii=False)
  return c,a
 except:return c,[]
tasks=[(c,p) for c,v in cats.items() for p in range(2,v['pages']+1)]
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
 for c,a in ex.map(one,tasks):cats[c]['items']+=a
for c,v in cats.items():
 v['items']=list({p['aid']:p for p in v['items']}.values());print(c,len(v['items']),v['total'])
json.dump(cats,open(r/'tools/catalog-full.json','w'),ensure_ascii=False)
