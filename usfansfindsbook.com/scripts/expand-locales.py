import ast,json,pathlib,copy
R=pathlib.Path(__file__).resolve().parents[1]
def read(f):return json.loads((R/f).read_text())
def write(f,d):(R/f).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
C=read('content.json');B=read('content/beginner-guide.json');I=read('content/guide-pictures.json');G=read('content/category-guides.json');F=read('content/faq.json');P=read('catalog.json')
constants={n.targets[0].id:ast.literal_eval(n.value) for n in ast.parse((R/'localize_products.py').read_text()).body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in ['M','labels']}
bracelets=dict(zip('it nl pl sv da nb fi cs sk hu ro el tr uk ru ja ko ar'.split(),'Bracciale|Armband|Bransoletka|Armband|Armbånd|Armbånd|Rannekoru|Náramek|Náramok|Karkötő|Brățară|Βραχιόλι|Bileklik|Браслет|Браслет|ブレスレット|팔찌|سوار'.split('|')))
config={k:{'currency':v} for k,v in dict(en='USD',de='EUR',es='EUR',fr='EUR',pt='EUR',zh='CNY').items()}
for file in sorted((R/'content/locales').glob('*.json')):
 l=file.stem;d=json.loads(file.read_text());n=d['nav'];a=d['labels'];x=d['explore'];q=d['faq'];s=d['steps'];z=d['notes'];t=copy.deepcopy(C['en'])
 t.update(name=d['name'],nav=[n[0],n[1],n[2],n[3],n[4]],cats=d['cats'],join=n[5],language=n[6],currency=n[7],intro=z[0],featured=n[1],featuredSub=z[0],catSub=z[0],faq=n[4],steps=[v[0] for v in s[:3]],stepBody=[v[1] for v in s[:3]],sort=a[16:19],estimate='',checks=[q[2][1],q[1][1]],registerTitle=n[5],registerBody=z[1],categoryTitle=n[2])
 for key,idx in {'all':0,'details':1,'price':2,'priceNote':3,'how':4,'back':5,'source':6,'buy':7,'copy':8,'copied':9,'photos':10,'qc':11,'noqc':12,'check':13,'footer':14,'disclosure':15,'empty':19,'categorySource':20,'qcNote':21,'itemId':22,'viewImage':23,'closeImage':24,'refLabel':25}.items():t[key]=a[idx]
 w=t['explorer']
 for key,idx in {'explore':0,'saved':1,'recent':2,'save':3,'savedAction':4,'qcOnly':5,'budget':6,'anyBudget':7,'reset':8,'more':9,'results':10,'retry':11,'clearRecent':12,'allCategories':13,'sortLabel':14,'loading':15,'savedToast':3,'removedToast':4,'qcCount':5,'filterLabel':8,'browseAgain':0}.items():w[key]=x[idx]
 w.update(introExplore=z[0],storageNote=z[2],storageError=z[3],emptyFilter=z[4],emptySaved=z[5],emptyRecent=z[6],registerStrip=n[5],registerStripBody=z[1],catalogCount=n[1]);C[l]=t
 F[l]=dict(tabs=[a[13],a[11],s[6][0]],intro=z[0],note=a[15],help='USFans · '+n[4],register=n[5],items=q)
 B[l]=dict(nav=n[3],title=n[3]+' · USFans',intro=a[4],toc=n[3],onSite='USFans',onAgent='USFans',check=a[13],open=n[3],official=n[3],browse=n[1],register=n[5],faq=n[4],note=a[15],payments=[a[3],s[2][0],q[1][1],s[6][0],q[8][1]],steps=[v+[q[[2,2,1,11,5,6,8,10,10,7][i]][1]] for i,v in enumerate(s)])
 # Button names match the English controls visible in the actual screenshots.
 I[l]=dict(enlarge=a[23],site=['','','',n[1],a[1],a[7]],sameItem=P[0]['titles']['en'],realCapture='USFans · 2026-10-09 · '+a[3],qcExample=a[21],screenTitles=[s[1][0]+' · Style','Size · Quantity · Buy now'],clickSteps=['Style · '+d['tips'][4],'Size · '+q[2][1],'Quantity · − / +','Total · Buy now · '+a[3]],loginTitle='Login · USFans',loginSteps=[q[3][1],z[1]],siteSteps=[s[0][1],a[21],a[7]],account=dict(confirm=[s[2][1],q[1][1],q[2][1]],confirmTitle=s[2][0],loginHelp='Login · USFans',nav='USFans → {label}',tab='{label} → '+n[1],search='{label} → Search',empty=z[9],entry='USFans',warehouse=s[4][1],submit=s[5][1],payment=s[6][1],dispatch=s[7][1],transit=s[8][1],received=s[9][1]))
 G[l]=dict(title=n[2],intro=z[0],labels=[a[28],a[29],a[13]],browse=a[27],detailTitle=a[26],items={cat:dict(intro=d['tips'][i],choose=q[2][1],photos=q[5][1],confirm=q[1][1]) for i,cat in enumerate(G['en']['items'])})
 types=dict(zip(constants['labels'],d['types']+[bracelets[l]]))
 for p in P:
  brand,typ,_=constants['M'][p['id']];p['titles'][l]=(brand+' — ' if brand else '')+types[typ]
 I[l]['sameItem']=P[0]['titles'][l]
 config[l]=dict(currency=d['currency'],words=dict(date=x[16],saved=x[16],base='USD',notice=z[7],unavailable=z[8]))
for f,d in [('content.json',C),('content/beginner-guide.json',B),('content/guide-pictures.json',I),('content/category-guides.json',G),('content/faq.json',F),('catalog.json',P),('content/locale-config.json',config)]:write(f,d)
print('Prepared',len(C),'languages')
