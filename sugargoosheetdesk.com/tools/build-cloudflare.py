from pathlib import Path
import json, base64, gzip, shutil
r = Path(__file__).resolve().parent.parent
out = r / 'cloudflare-dist'
if out.exists(): shutil.rmtree(out)
(out / 'public' / 'asset').mkdir(parents=True)
(out / 'public' / 'guide-image').mkdir()
assets = json.loads((r/'tools/assets.json').read_text())
guides = json.loads((r/'tools/guide-images.json').read_text())
for item in assets.values():
    (out/'public'/'asset'/item['key']).write_bytes(base64.b64decode(item['data']))
for i, data in enumerate(guides):
    (out/'public'/'guide-image'/str(i)).write_bytes(base64.b64decode(data))
s=(r/'worker/data.js').read_text()+(r/'worker/views.js').read_text()
vals={k:json.loads((r/'tools'/f).read_text()) for k,f in {'RATES':'rates.json','MAIN_QC':'main-qc.json','CATALOG':'catalog-full.json','FEATURES':'featured.json','I18N':'content.json','BLOCKED_IMAGES':'blocked-images.json'}.items()}
vals.update(GUIDE_IMAGES=[True]*len(guides),ASSETS={url:{'key':a['key']} for url,a in assets.items()},CSS=(r/'worker/style.css').read_text(),CLIENT=(r/'worker/client.js').read_text())
for k,v in vals.items(): s=s.replace('__'+k+'__',json.dumps(v,ensure_ascii=False,separators=(',',':')))
s=s.replace('__ICON__',base64.b64encode((r/'tools/favicon.ico').read_bytes()).decode())
old="return data?imageFromBase64(data.data,data.mime||'image/webp'):new Response('Not found',{status:404});"
assert old in s
s=s.replace(old,"return data?env.ASSETS.fetch(request):new Response('Not found',{status:404});")
old="return data?imageFromBase64(data,'image/png'):new Response('Not found',{status:404});"
assert old in s
s=s.replace(old,"return data?env.ASSETS.fetch(request):new Response('Not found',{status:404});")
(out/'index.js').write_text(s)
config={'name':'sugargoosheetdesk-com','main':'cloudflare-dist/index.js','compatibility_date':'2026-11-13','assets':{'directory':'cloudflare-dist/public','binding':'ASSETS','run_worker_first':True},'observability':{'enabled':True}}
(r/'wrangler.generated.json').write_text(json.dumps(config))
assert len(gzip.compress(s.encode())) < 3*1024*1024
print('Built Worker and external assets')
