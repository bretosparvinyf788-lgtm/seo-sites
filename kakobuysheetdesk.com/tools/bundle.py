import pathlib,json,base64
r=pathlib.Path(__file__).resolve().parent.parent;s=(r/'worker/template.js').read_text()
vals={'MAIN_QC':json.load(open(r/'tools/main-qc.json')),'CATALOG':json.load(open(r/'tools/catalog-full.json')),'FEATURES':json.load(open(r/'tools/featured.json')),'I18N':json.load(open(r/'tools/content.json')),'GUIDE_IMAGES':json.load(open(r/'tools/guide-images.json')) if (r/'tools/guide-images.json').exists() else [],'BLOCKED_IMAGES':json.load(open(r/'tools/blocked-images.json')),'ASSETS':json.load(open(r/'tools/assets.json')) if (r/'tools/assets.json').exists() else {},'CSS':(r/'worker/style.css').read_text(),'CLIENT':(r/'worker/client.js').read_text()}
for k,v in vals.items():s=s.replace('__'+k+'__',json.dumps(v,ensure_ascii=False,separators=(',',':')))
s=s.replace('__ICON__',base64.b64encode((r/'tools/favicon.ico').read_bytes()).decode())
(r/'worker/index.js').write_text(s)
print('Worker bytes:',len(s.encode()))
