from pathlib import Path
import json,re,html
root=Path('dist/client');languages=json.loads(Path('content/beginner-guide.json').read_text())
for lang in languages:
 p=root/('' if lang=='en' else lang)/'beginner-guide/index.html';s=p.read_text()
 steps=re.findall(r'<section class="beginner-step" id="step-(\d+)">(.*?)</section>',s,re.S)
 assert [int(i) for i,_ in steps]==list(range(1,16)),lang
 for i,body in steps:
  images=re.findall(r'<img\b[^>]*src="([^"]+)"',body)
  assert images,(lang,i,'missing image')
  assert '<details' not in body,(lang,i,'hidden step')
  for src in images:
   if src.startswith('/') and not src.startswith('//'):assert (root/html.unescape(src).lstrip('/')).is_file(),(lang,i,src)
  if int(i)<15:assert f'href="#step-{int(i)+1}"' in body,(lang,i,'missing next step')
  if int(i)>1:assert f'href="#step-{int(i)-1}"' in body,(lang,i,'missing previous step')
 for i in range(1,16):assert f'href="#step-{i}"' in s
print(f'PASS: 15 visible illustrated steps, original image files, directory and adjacent navigation in {len(languages)} languages.')
