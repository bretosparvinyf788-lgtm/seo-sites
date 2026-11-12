import json,pathlib,base64,hashlib,io
from PIL import Image
r=pathlib.Path('/workspace/sites/kakobuysheetdesk.com');f=json.load(open(r/'tools/featured.json'));a=json.load(open(r/'tools/assets.json'));items=list(a);blocked=[items[i] for i in [0,12,27]]
(r/'tools/blocked-images.json').write_text(json.dumps(blocked))
for u in blocked:a.pop(u,None)
for p in f['featured']+[f['sample']]:
 p['gallery']=[u for u in p.get('gallery',[])[:4] if u in a]
 if p['gallery']:p['image']=p['gallery'][0]
# Do not present seller catalogue images or visibly mismatched garments as warehouse QC.
qcmap={'4245':[0,1,2],'4282':[0,1,2],'4124':[0,1,2],'4122':[0,1,2],'3916':[0,1,2,3],'3915':[0,1,2],'3483':[0,1,2],'4289':[0,1,2]}
for p in f['featured']:
 p['auditedQc']=[]
 for i in qcmap.get(p['aid'],[]):
  u=p['qc'][i];raw=pathlib.Path('/tmp/desk-audit/'+p['aid']+'-'+str(i)+'.jpg');im=Image.open(raw).convert('RGB');im.thumbnail((1100,1100));out=io.BytesIO();im.save(out,format='WEBP',quality=82);key=hashlib.sha256(u.encode()).hexdigest()[:18];a[u]={'key':key,'data':base64.b64encode(out.getvalue()).decode()};p['auditedQc'].append(u)
f['sample']['aid']='7894400057';f['featured'][0]=f['sample']
json.dump(f,open(r/'tools/featured.json','w'),ensure_ascii=False);json.dump(a,open(r/'tools/assets.json','w'))
print('Curated',len(a),'images; featured',len(f['featured']),'QC photos',sum(len(p.get('auditedQc',[])) for p in f['featured']))
