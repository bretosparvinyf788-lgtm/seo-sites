"""Translate this site's own source strings offline, preserving curated and exact shared translations."""
from pathlib import Path
import os,re,json,time,concurrent.futures
os.environ['UCX_VFS_ENABLE']='n'
import ctranslate2,sentencepiece
R=Path(__file__).parent;D=R/'dist';M=os.environ.get('CSSBUY_TRANSLATION_MODEL_DIR','/workspace/scratch/8c0b3880b3f9/models/m2m');C=R/'locale-checkpoints';C.mkdir(exist_ok=True)
dictionary=json.loads((D/'translations.json').read_text());strings=set();zh=dictionary.setdefault('zh-CN',{})
for name in ['guide.json','guide-mobile.json']:
 g=json.loads((D/name).read_text())
 for s in g['steps']:
  for k in ['title','where','check','imageTitle','imageAction','imageCaption','phoneTip']:
   if s.get(k):strings.add(s[k]);zh[s[k]]=s.get(k+'Zh') or zh.get(s[k],s[k])
  for en,cn in zip(s['actions'],s['actionsZh']):strings.add(en);zh[en]=cn
app=(D/'app.js').read_text();faqs=json.loads(app.split('const faqs=',1)[1].split(';\nfunction money',1)[0])
for q,answers in faqs:strings.add(q);strings.update(answers)
for name in ['app.js','experience.js','visual-search.js']:
 js=(D/name).read_text()
 for m in re.finditer(r"(?<![\w])(?:t|tr|l)\('((?:\\.|[^'\\])*)'",js):strings.add(m.group(1).replace("\\'","'"))
strings.update(['Language','Currency','Open menu','Close menu','Search products','Choose another photo','Upload a product photo','Product pages','Previous','Next','Go','Go to page','Try again','Image search could not load. Please try again.'])
for variable in ['cats','descriptions']:
 arr=app.split('const '+variable+'=',1)[1].split(';',1)[0]
 strings.update(re.findall(r"'([^']+)'",arr))
strings.update(['YOUR NEXT FIND STARTS HERE','THE FINDS DIRECTORY','The spreadsheet.','On the desk today','Search results','Explore the finds','A fresh edit for your next rotation.','Find & compare','Order on CSSBuy','Inspect & ship','Choose another photo','No matching products. Try another search.'])
strings.update(re.findall(r'data-t="([^"]+)"',(D/'index.html').read_text()))
strings.update(['Loading image search…','Download progress','Matching your photo…','No confident visual matches. Try a clearer photo of one item.','Find your piece','Browse the spreadsheet or explore a category.','Check the details','Use reference photos to take a closer look.','Make it yours','Confirm options and checkout on CSSBuy.'])
strings.update(key for rows in json.loads((R/'translation-editorial-overrides.json').read_text()).values() for key in rows)
strings.discard('');source=sorted(strings);(R/'locale-source.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
sp=sentencepiece.SentencePieceProcessor(model_file=M+'/sentencepiece.bpe.model');engine=ctranslate2.Translator(M,device='cpu',compute_type='int8',inter_threads=2,intra_threads=3)
languages=['de','fr','es','it','pt','nl','pl','sv','da','no','fi','cs','ro','hu','el','tr','ru','uk','ar','ja','ko','th','zh-CN']
labels=['CSSBuy VIP','CSSBuy','Weidian','Join CSSBuy','Buy on CSSBuy','Contact support','Delivery address','Shipping method','In Warehouse','Processing','Recharge','Cost Estimate','Pay now','Account','Home','Photo','Track','Orders','Estimate','Edit','QC']
def encode(s):return ['__en__']+sp.encode(s,out_type=str)+['</s>']
def decode(r):return sp.decode([x for x in r.hypotheses[0] if not x.startswith('__') and x not in ['<s>','</s>']])
def protected(s):
 names=labels if len(s)>55 else ['CSSBuy VIP','CSSBuy','Weidian']
 pattern=re.compile('|'.join(map(re.escape,sorted(names,key=len,reverse=True)))+r'|\d{4,}');values=[]
 def repl(m):values.append(m.group());return 'ZXQ'+str(len(values)-1)+'ZXQ'
 return pattern.sub(repl,s),values

def run(code):
 token='zh' if code=='zh-CN' else code;path=C/(code+'.json');done=dict(dictionary.get(code,{}));done.update(json.loads(path.read_text()) if path.exists() else {});pending=[x for x in source if x not in done or not done[x]];start=time.time();print(code,'pending',len(pending),flush=True)
 for offset in range(0,len(pending),24):
  batch=pending[offset:offset+24];data=[protected(x) for x in batch];results=engine.translate_batch([encode(x) for x,v in data],target_prefix=[['__'+token+'__']]*len(batch),beam_size=1,max_batch_size=24,max_decoding_length=384,repetition_penalty=1.05)
  for original,(text,values),r in zip(batch,data,results):
   translated=decode(r)
   if any('ZXQ'+str(i)+'ZXQ' not in translated for i in range(len(values))):
    parts=re.split(r'(ZXQ\d+ZXQ)',text);fragments=[x for x in parts if re.search('[A-Za-z]',x) and not re.fullmatch(r'ZXQ\d+ZXQ',x)];fr=engine.translate_batch([encode(x) for x in fragments],target_prefix=[['__'+token+'__']]*len(fragments),beam_size=1,max_decoding_length=384) if fragments else [];it=iter(decode(x) for x in fr);translated=' '.join(next(it) if re.search('[A-Za-z]',x) and not re.fullmatch(r'ZXQ\d+ZXQ',x) else x for x in parts)
   for i,value in enumerate(values):translated=translated.replace('ZXQ'+str(i)+'ZXQ',value)
   if not translated.strip() or re.search(r'ZXQ\d',translated):raise RuntimeError(code+' invalid translation')
   done[original]=translated
  path.write_text(json.dumps(done,ensure_ascii=False,indent=2)+'\n');print(code,min(offset+24,len(pending)),'/',len(pending),'seconds',round(time.time()-start),flush=True)
 return code,done
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for code,done in pool.map(run,languages):dictionary.setdefault(code,{}).update({s:done[s] for s in source})
# Curated EN/ZH data remains authoritative.
for k,v in zh.items():dictionary['zh-CN'][k]=v
for code,rows in json.loads((R/'translation-editorial-overrides.json').read_text()).items():dictionary[code].update(rows)
(D/'translations.json').write_text(json.dumps(dictionary,ensure_ascii=False,separators=(',',':'))+'\n')
(R/'localization-coverage.json').write_text(json.dumps({'languages':24,'source_strings':len(source),'complete_string_coverage':all(all(d.get(s) for s in source) for d in dictionary.values()),'method':'Offline M2M100 int8, protected original control names, curated Chinese and existing exact translations retained','native_speaker_proofread':False},indent=2)+'\n')
print('Complete',len(source),'strings in24languages',flush=True)
