from pathlib import Path
from urllib.parse import quote,urlsplit,parse_qs,unquote
import json,re,hashlib,math
from datetime import date
R=Path(__file__).parent;D=R/'dist';catalog=json.loads((D/'catalog.json').read_text());coverage=json.loads((R/'catalog-coverage.json').read_text());config=json.loads((R/'site-config.json').read_text());agents=json.loads((D/'platforms.json').read_text());failures=[]
def check(test,note):
 if not test:failures.append(note)
ids={p['id'] for p in catalog};check(len(catalog)==len(ids)==4771,'Catalogue unique ID scope');check(len(coverage['source_aid_to_route_id'])==4777,'Source records coverage');check(set(coverage['source_aid_to_route_id'].values())==ids,'Source ID mapping')
counts={'products':len(catalog),'source_records':len(coverage['source_aid_to_route_id']),'legacy_routes':0,'platform_urls':0,'carousel_images':0,'style_images':0,'no_styles':0,'no_qc':0,'unknown_price':0};seen_assets=set()
for p in catalog:
 item=p['id'];check(bool(re.fullmatch(r'\d{9,12}',item)),item+' ID');page=D/'product'/item/'index.html';check(page.exists(),item+' route')
 if not page.exists():continue
 text=page.read_text();url=config['purchase_template'].format(weidian_id=item);check(url.replace('&','&amp;') in text or url in text,item+' purchase link')
 check('googletagmanager.com' not in text and 'gtag(' not in text,item+' preview tracking')
 for alias in p.get('legacyIds',[]):
  old=D/'product'/alias/'index.html';check(old.exists() and item in old.read_text(),alias+' legacy route');counts['legacy_routes']+=1
 g=json.loads((D/'data/galleries'/(item+'.json')).read_text());check(g['id']==item,item+' gallery mapping');counts['carousel_images']+=len(g.get('carousel',[]));counts['style_images']+=len(g.get('styles',[]));counts['no_styles']+=not bool(g.get('styles'));counts['no_qc']+=not bool(p['qc']);counts['unknown_price']+=not bool(p['price'])
 check(g.get('source') and g.get('captured'),item+' gallery provenance')
 for agent in agents:
  if agent['status']!='active':continue
  dest=agent['template'].replace('{id}',quote(item,safe='')).replace('{url}',quote('https://weidian.com/item.html?itemID='+item,safe=''));counts['platform_urls']+=1;check(item in unquote(dest),item+' '+agent['id']+' same item');check(not re.search(r'\{(?:id|url)\}',dest),item+' unexpanded template')
  if agent['id']=='cssbuy':check(parse_qs(urlsplit(dest).query).get('promotionCode')==['b949d0d72e6d7314'],item+' CSSBuy referral')
 for asset in re.findall(r'(?:src|href)="(/[^"?#]+)(?:[?#][^"]*)?"',text):
  if asset in seen_assets:continue
  seen_assets.add(asset);target=D/asset.lstrip('/');check(target.exists() or (target/'index.html').exists(),'Missing internal asset/route '+asset)
for agent in agents:check((D/agent['icon'].lstrip('/')).exists(),'Platform icon '+agent['id'])
for name in ['guide.json','guide-mobile.json']:
 guide=json.loads((D/name).read_text());check(len(guide['steps'])==12,name+' step count')
 for i,s in enumerate(guide['steps'],1):
  check(len(s['actions'])==len(s['actionsZh']),name+' action mapping '+str(i));check('imageFrame' not in s,name+' clipped illustration '+str(i))
  if s.get('image'):check((D/s['image'].lstrip('/')).exists(),name+' image '+str(i))
meta=json.loads((D/'visual/index.json').read_text());check(set(x['id'] for x in meta['items'])==ids,'Visual index IDs');check(meta['count']==len(ids),'Visual index scope');check((D/'visual/embeddings.i8').stat().st_size==meta['count']*512,'Visual vector size');check(meta.get('encoder_runtime')=='onnxruntime1.23.2','Visual runtime consistency')
check(config['analytics']['enabled'] is False,'Preview analytics disabled');check(config['registration_url']=='https://cssb.uy/2JLm','Registration URL');check('referrerpolicy="no-referrer"' in (D/'app.js').read_text(),'External photo referrer handling')
locales=json.loads((D/'translations.json').read_text());source_strings=json.loads((R/'locale-source.json').read_text())
for code,rows in locales.items():
 check(all(rows.get(key) for key in source_strings),'Missing locale source strings '+code)
 check(json.loads((D/'locales'/(code+'.json')).read_text())==rows,'Stale locale shard '+code)
 for key,value in rows.items():check(set(re.findall(r'\{\w+\}',key))==set(re.findall(r'\{\w+\}',value)),'Broken translation placeholder '+code+' '+key)
check(bool(re.search(r'<script src="/assets/app-[a-f0-9]+.js"', (D/'404.html').read_text())),'404 interactive header script')
check('class="nav-photo"' in (D/'index.html').read_text() and 'class="header-photo-quick"' in (D/'index.html').read_text(),'Desktop/phone photo navigation')
result={'date':date.today().isoformat(),'scope':'Full local source integrity and generated route/link checks, not live inventory or a paid transaction test','counts':counts,'unique_internal_assets_and_routes_checked':len(seen_assets),'failures':failures,'visual_index':{'count':meta['count'],'bytes':(D/'visual/embeddings.i8').stat().st_size,'sha256':hashlib.sha256((D/'visual/embeddings.i8').read_bytes()).hexdigest()},'source_limitations':{'no_qc':counts['no_qc'],'no_styles':counts['no_styles'],'all_images_contact_qr_content_audited':False}}
(R/'full-static-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'counts':counts,'failures':failures[:10],'failure_count':len(failures)},ensure_ascii=False));assert not failures
