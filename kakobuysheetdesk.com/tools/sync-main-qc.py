"""Snapshot every catalog listing's public main-site gallery; resume successful requests."""
import concurrent.futures,datetime,html,json,pathlib,re,time,urllib.request,urllib.error,subprocess
from html.parser import HTMLParser
from urllib.parse import urljoin,urlparse
ROOT=pathlib.Path(__file__).resolve().parent.parent
CACHE=ROOT/'tools/pages-cache/main-qc';CACHE.mkdir(parents=True,exist_ok=True)
class Gallery(HTMLParser):
 def __init__(self):super().__init__();self.active=False;self.found=False;self.ended=False;self.images=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);classes=a.get('class','').split()
  if tag=='div' and 'product-gallery' in classes:self.active=True;self.found=True
  if tag=='div' and 'product-details' in classes:self.active=False;self.ended=True
  if tag=='img' and self.active:
   u=urljoin('https://kakobuymake.com',a.get('src',''));p=urlparse(u)
   if p.scheme=='https' and p.netloc=='kakobuymake.com' and re.fullmatch(r'/uploads/.+\.(?:jpe?g|png|webp)',p.path,re.I) and u not in self.images:self.images.append(u)
def parse(s):
 s=re.sub(r'<!--[\s\S]*?-->','',s);g=Gallery();g.feed(s)
 if not g.found or not g.ended or not g.images:raise ValueError('main gallery missing or incomplete')
 m=re.search(r'itemID(?:%3D|=)(\d+)',s)
 return dict(id=m[1] if m else None,qc=g.images[1:],status='available' if len(g.images)>1 else 'missing',cover=g.images[0] if g.images else None)
def get(aid):
 path=CACHE/(aid+'.json')
 if path.exists():return aid,json.loads(path.read_text())
 error=None
 for attempt in range(3):
  try:
   url='https://kakobuymake.com/?m=home&c=View&a=index&aid='+aid
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as response:s=response.read().decode('utf-8')
   value=parse(s);value['checkedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat();path.write_text(json.dumps(value,ensure_ascii=False));return aid,value
  except urllib.error.HTTPError as e:
   error=str(e)
   if e.code in (403,429):return aid,dict(status='error',error=error)
  except Exception as e:error=str(e)
  time.sleep(attempt+1)
 return aid,dict(status='error',error=error)
if __name__=='__main__':
 catalog=json.load(open(ROOT/'tools/catalog-full.json'));aids=list(dict.fromkeys(p['aid'] for v in catalog.values() for p in v['items']))
 # Homepage entries first, including the issue reported by the user.
 front=['4298','4296','4283']+[p['aid'] for p in json.load(open(ROOT/'tools/featured.json'))['featured'] if p['aid'] in aids]
 aids=list(dict.fromkeys(front+aids));out={};start=time.monotonic()
 # A single curl process reuses its HTTPS connections instead of reconnecting per item.
 pending=[a for a in aids if not (CACHE/(a+'.json')).exists()]
 raw=CACHE/'raw';raw.mkdir(exist_ok=True)
 config=CACHE/'requests.conf'
 config.write_text('\nnext\n'.join('url = "https://kakobuymake.com/?m=home&c=View&a=index&aid='+a+'"\noutput = "'+str(raw/(a+'.html'))+'"' for a in pending)+'\n')
 process=subprocess.Popen(['curl','--parallel','--parallel-max','8','--fail','--silent','--show-error','--location','--max-time','25','--retry','1','--config',str(config)],stderr=open(CACHE/'curl-errors.log','w')) if pending else None
 last=0
 while True:
  for path in raw.glob('*.html'):
   # curl atomically finishes only at transfer completion; incomplete HTML is retried next pass.
   try:
    text=path.read_text();
    if '</html>' not in text.lower():continue
    value=parse(text);value['checkedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    (CACHE/(path.stem+'.json')).write_text(json.dumps(value,ensure_ascii=False));path.unlink()
   except (ValueError,UnicodeDecodeError):pass
  completed=list(CACHE.glob('*.json'))
  if len(completed)//100>last or not process or process.poll() is not None:
   last=len(completed)//100;print(json.dumps(dict(checked=len(completed),total=len(aids),seconds=round(time.monotonic()-start))),flush=True)
  if not process or process.poll() is not None:break
  time.sleep(2)
 # Retry and record any failed or incomplete listing without treating it as an empty gallery.
 for a in aids:
  aid,value=get(a);out[aid]=value
 snapshot=dict(source='https://kakobuymake.com/',syncedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),items=dict(sorted(out.items(),key=lambda x:int(x[0]))))
 (ROOT/'tools/main-qc.json').write_text(json.dumps(snapshot,ensure_ascii=False,separators=(',',':'))+'\n')
 print('COMPLETE',len(out),'photos',sum(len(v.get('qc',[])) for v in out.values()),'missingID',sum(not v.get('id') for v in out.values()),flush=True)
