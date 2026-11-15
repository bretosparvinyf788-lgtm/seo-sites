import pathlib,json,subprocess,concurrent.futures,html,re,urllib.parse
BASE='https://kakobuymake.com'
def get(u):
 r=subprocess.run(['curl','--fail','--max-time','25','-sL','-A','Mozilla/5.0',u],capture_output=True)
 if r.returncode:raise RuntimeError('source unavailable')
 return r.stdout.decode('utf-8','replace')
def f(path):
 p=json.loads(path.read_text())
 if p.get('gallery'):return
 try:
  s=get(BASE+'/?m=home&c=View&a=index&aid='+p['id']);ids=re.findall(r'itemID(?:=|%3D)(\d{8,12})',html.unescape(s));p['weidian']=ids[0] if ids else None
  gal=s.split('<div class="thumbnail-carousel">')[-1].split('</div>')[0];p['qc']=list(dict.fromkeys(urllib.parse.urljoin(BASE,x) for x in re.findall(r'<img[^>]+src="([^"]+)"',gal)))
  if p['weidian']:
   wd=html.unescape(get('https://weidian.com/item.html?itemID='+p['weidian']));m=re.search(r'"imgs"\s*:\s*(\[[^\]]+\])',wd);p['gallery']=json.loads(m[1]) if m else []
  path.write_text(json.dumps(p,ensure_ascii=False));print(p['id'],'seller',len(p.get('gallery',[])),'QC',len(p['qc']),flush=True)
 except Exception as e: print(p['id'],str(e),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:list(ex.map(f,pathlib.Path('src/details').glob('*.json')))
