import json,pathlib,subprocess,concurrent.futures,hashlib,io,base64
from PIL import Image,ImageOps,ImageDraw
r=pathlib.Path('/workspace/sites/kakobuysheetdesk.com');out=r/'tools/image-cache';out.mkdir(exist_ok=True);f=json.load(open(r/'tools/featured.json'));urls=list(dict.fromkeys([u for p in f['featured']+[f['sample']] for u in p.get('gallery',[])[:4]]))
def one(u):
 key=hashlib.sha256(u.encode()).hexdigest()[:18];p=out/(key+'.webp')
 try:
  if not p.exists():
   raw=subprocess.check_output(['curl','-s','-L','--max-time','55',u]);im=Image.open(io.BytesIO(raw)).convert('RGB');im.thumbnail((850,850));im.save(p,format='WEBP',quality=80)
  return u,dict(key=key,data=base64.b64encode(p.read_bytes()).decode())
 except Exception as e:print('asset error',u,str(e));return u,None
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:assets={u:a for u,a in ex.map(one,urls) if a}
json.dump(assets,open(r/'tools/assets.json','w'));print('Saved seller images',len(assets))
ims=[(p['aid'],assets.get(p['image'])) for p in f['featured']];can=Image.new('RGB',(1200,660),'#eee');dr=ImageDraw.Draw(can)
for i,(aid,a) in enumerate(ims):
 if a:
  im=Image.open(out/(a['key']+'.webp'));im.thumbnail((200,280));can.paste(im,(i%6*200,i//6*330+22))
 dr.text((i%6*200+4,i//6*330+4),aid,fill='black')
can.save('/tmp/featured-audit.jpg')
