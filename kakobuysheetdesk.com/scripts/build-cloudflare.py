"""Build Cloudflare Pages with the same eight guide images as the preview."""
from pathlib import Path
import base64
import json
import shutil
import gzip

root = Path(__file__).resolve().parent.parent
out = root / 'cloudflare-dist'
guides = json.loads((root / 'tools/guide-images.json').read_text())
content = json.loads((root / 'tools/content.json').read_text())
if len(guides) != 8 or any(len(t['steps']) != len(guides) for t in content.values()):
    raise ValueError('All eight guide screenshots are required for every language')
assets = json.loads((root / 'tools/assets.json').read_text())
if out.exists():
    shutil.rmtree(out)
out.mkdir()
for directory in ['asset', 'guide-image']:
    (out / directory).mkdir()
for i, encoded in enumerate(guides):
    data = base64.b64decode(encoded, validate=True)
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        raise ValueError(f'Invalid guide screenshot {i + 1}')
    (out / 'guide-image' / str(i)).write_bytes(data)
for asset in assets.values():
    (out / 'asset' / asset['key']).write_bytes(base64.b64decode(asset['data'], validate=True))
source = (root / 'worker/template.js').read_text()
values = {
    'MAIN_QC': json.loads((root / 'tools/main-qc.json').read_text()),
    'CATALOG': json.loads((root / 'tools/catalog-full.json').read_text()),
    'FEATURES': json.loads((root / 'tools/featured.json').read_text()),
    'I18N': content,
    'GUIDE_IMAGES': [True] * len(guides),
    'ASSETS': {url: {'key': asset['key']} for url, asset in assets.items()},
    'BLOCKED_IMAGES': json.loads((root / 'tools/blocked-images.json').read_text()),
    'CSS': (root / 'worker/style.css').read_text(),
    'CLIENT': (root / 'worker/client.js').read_text(),
}
for key, value in values.items():
    source = source.replace('__' + key + '__', json.dumps(value, ensure_ascii=False, separators=(',', ':')))
source = source.replace('__ICON__', base64.b64encode((root / 'tools/favicon.ico').read_bytes()).decode())
# These paths normally bypass the Worker; also handle direct Worker requests.
source = source.replace("const data=ASSET_KEYS[u.pathname.split('/').pop()];return data?imageFromBase64(data,'image/webp'):new Response('Not found',{status:404});", "return env.ASSETS.fetch(request);")
source = source.replace("const data=GUIDE_IMAGES[+u.pathname.split('/').pop()];return data?imageFromBase64(data,'image/webp'):new Response('Not found',{status:404});", "return env.ASSETS.fetch(request);")
(out / '_worker.js').write_text(source)
(out / '_routes.json').write_text(json.dumps({'version': 1, 'include': ['/*'], 'exclude': ['/asset/*', '/guide-image/*']}))
(out / '_headers').write_text('/guide-image/*\n  Content-Type: image/webp\n  Cache-Control: public, max-age=86400\n/asset/*\n  Content-Type: image/webp\n  Cache-Control: public, max-age=86400\n')
(out / 'index.html').write_text('<!doctype html><title>Kakobuy Sheetdesk</title>')
size = len(gzip.compress(source.encode()))
if size > 3 * 1024 * 1024:
    raise ValueError('Worker exceeds Cloudflare Free compressed-size limit')
print(f'Built Pages: {len(guides)} guide images, {len(assets)} product images, Worker gzip {size} bytes')
