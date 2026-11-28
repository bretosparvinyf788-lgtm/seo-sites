from pathlib import Path
import json
root=Path(__file__).parent/'dist'
images={}
for name in ['guide.json','guide-mobile.json']:
 g=json.loads((root/name).read_text())
 assert len(g['steps'])==12
 images[name]=set()
 for s in g['steps']:
  for k in ['title','titleZh','where','whereZh','actions','actionsZh','check','checkZh']: assert s.get(k),(name,k)
  assert len(s['actions'])==len(s['actionsZh'])
  if s.get('image'):
   assert (root/s['image'].lstrip('/')).is_file()
   images[name].add(s['image'])
assert not images['guide.json'] & images['guide-mobile.json'], 'Phone guide must not reuse desktop screenshots'
assert len(images['guide-mobile.json'])>=8
mobile=json.loads((root/'guide-mobile.json').read_text())
for i,s in enumerate(mobile['steps'],1):
 assert s.get('image') and s.get('imageAction') and s.get('imageActionZh'), ('Missing phone step image',i)
 assert s.get('imageCaption') and s.get('imageHotspots'), ('Missing phone step provenance/callouts',i)
 for h in s['imageHotspots']:
  assert 0 <= h['x'] < 100 and 0 <= h['y'] < 100 and h['x']+h['w'] <= 100 and h['y']+h['h'] <= 100
assert 'const data=mobile?mobileGuideData:guideData;' in (root/'experience.js').read_text()
print('Validated separate 12-step desktop and phone guides; every phone step has an actual interface image, operation instructions and callouts; no desktop image reuse')
