import pathlib,json,base64
r=pathlib.Path(__file__).resolve().parent.parent
s=(r/'worker/data.js').read_text()+(r/'worker/views.js').read_text()
vals={'RATES':json.load(open(r/'tools/rates.json')),'MAIN_QC':json.load(open(r/'tools/main-qc.json')),'CATALOG':json.load(open(r/'tools/catalog-full.json')),'FEATURES':json.load(open(r/'tools/featured.json')),'I18N':json.load(open(r/'tools/content.json')),'GUIDE_IMAGES':json.load(open(r/'tools/guide-images.json')) if (r/'tools/guide-images.json').exists() else [],'BLOCKED_IMAGES':json.load(open(r/'tools/blocked-images.json')),'ASSETS':json.load(open(r/'tools/assets.json')),'CSS':(r/'worker/style.css').read_text(),'CLIENT':(r/'worker/client.js').read_text()}
for k,v in vals.items():s=s.replace('__'+k+'__',json.dumps(v,ensure_ascii=False,separators=(',',':')))
s=s.replace('__ICON__',base64.b64encode((r/'tools/favicon.ico').read_bytes()).decode())
(r/'worker/index.js').write_text(s)
(r/'dist/server').mkdir(parents=True,exist_ok=True)
(r/'dist/server/index.js').write_text(s)
print('Built',len(s.encode()),'bytes;',sum(len(v['items']) for v in vals['CATALOG'].values()),'listings;',len(vals['I18N']),'languages')
