import json,re,html,urllib.request,concurrent.futures,pathlib
r=pathlib.Path('/workspace/sites/kakobuysheetdesk.com');cats=json.load(open(r/'tools/catalog.json'))
featured=[cats[c]['items'][i] for c,inds in [('2',[1,3]),('3',[0,1]),('5',[0,2]),('6',[0,2]),('8',[1,2]),('7',[0]),('4',[0])] for i in inds]
def get(u):return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read().decode()
def detail(p):
 try:
  s=get('https://kakobuymake.com/?m=home&c=View&a=index&aid='+p['aid']);m=re.search(r'itemID(?:%3D|=)(\d+)',s);p['id']=m.group(1) if m else None
  imgs=re.findall(r'<img[^>]*src="([^"]+)"',s[s.find('<div class="product-gallery">'):s.find('<div class="product-details">')]);p['qc']=list(dict.fromkeys('https://kakobuymake.com'+x if x.startswith('/') else x for x in imgs))[1:]
  w=get('https://weidian.com/item.html?itemID='+p['id']);m=re.search(r'id="__rocker-render-inject__" data-obj="([^"]+)"',w);d=json.loads(html.unescape(m.group(1)))['result']['default_model']['item_info'];p['gallery']=d['imgs'];p['image']=d['imgs'][0];p['sourceName']=d['item_name'];p['cny']=float(d.get('price',d.get('origin_price',0)));return p
 except Exception as e:print('ERR',p['aid'],str(e));return p
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:out=list(ex.map(detail,featured))
w=json.load(open('/tmp/weidian-data.json'))['result']['default_model']['item_info'];sample={'aid':'sample','id':'7894400057','title':w['item_name'],'sourceName':w['item_name'],'cat':2,'cny':float(w.get('price',w.get('origin_price',256))),'price':None,'image':w['imgs'][0],'gallery':w['imgs'],'qc':[]}
json.dump({'featured':out,'sample':sample},open(r/'tools/featured.json','w'),ensure_ascii=False)
for p in out:print(p['aid'],p.get('id'),len(p.get('gallery',[])),len(p.get('qc',[])),p.get('sourceName'))
