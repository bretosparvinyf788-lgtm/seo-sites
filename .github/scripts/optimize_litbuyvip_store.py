from __future__ import annotations
import base64, hashlib, json, re
from collections import Counter
from pathlib import Path

SITE = Path('litbuyvip.store')
HOME = SITE / 'index.html'
ASSET_DIR = SITE / 'assets' / 'embedded'
ASSET_DIR.mkdir(parents=True, exist_ok=True)

DATA_URI = re.compile(r'data:image/(?P<subtype>png|jpe?g|gif|webp|svg\+xml);base64,(?P<data>[A-Za-z0-9+/=]+)', re.I)
KAKOBUY = re.compile(r'https://kakobuymake\.com/[^\s"\'<>]+')
EXT = {'png':'png','jpg':'jpg','jpeg':'jpg','gif':'gif','webp':'webp','svg+xml':'svg'}

def externalize(text: str) -> tuple[str, int]:
    count = 0
    def repl(m: re.Match) -> str:
        nonlocal count
        raw = base64.b64decode(m.group('data'))
        ext = EXT[m.group('subtype').lower()]
        digest = hashlib.sha256(raw).hexdigest()[:20]
        out = ASSET_DIR / f'{digest}.{ext}'
        if not out.exists():
            out.write_bytes(raw)
        count += 1
        return f'/assets/embedded/{out.name}'
    return DATA_URI.sub(repl, text), count

def replace_one(text: str, pattern: str, replacement: str) -> str:
    return re.sub(pattern, replacement, text, count=1, flags=re.I | re.S)

for html in SITE.rglob('*.html'):
    original = html.read_text(encoding='utf-8')
    old_links = Counter(KAKOBUY.findall(original))
    updated, count = externalize(original)
    if html == HOME:
        updated = replace_one(updated, r'<title>.*?</title>', '<title>LitBuy Spreadsheet 2026 | Curated Finds, QC &amp; Buyer Guides</title>')
        updated = replace_one(updated, r'<meta\s+name="description"\s+content="[^"]*"\s*/?>', '<meta name="description" content="Browse the LitBuy Spreadsheet 2026 with curated product finds, QC guidance, warehouse planning, shipping resources and practical buyer guides." />')
        updated = replace_one(updated, r'<meta\s+property="og:title"\s+content="[^"]*"\s*/?>', '<meta property="og:title" content="LitBuy Spreadsheet 2026 | Curated Finds, QC &amp; Buyer Guides" />')
        updated = replace_one(updated, r'<meta\s+property="og:description"\s+content="[^"]*"\s*/?>', '<meta property="og:description" content="Curated LitBuy finds plus practical QC, warehouse, shipping and buyer-guide resources." />')
        if 'seo-home-schema' not in updated:
            graph = {"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"https://litbuyvip.store/#website","url":"https://litbuyvip.store/","name":"LitBuyVIP","inLanguage":"en"},{"@type":"CollectionPage","@id":"https://litbuyvip.store/#webpage","url":"https://litbuyvip.store/","name":"LitBuy Spreadsheet 2026","description":"Curated product discovery with LitBuy QC, warehouse, shipping and buyer guides.","isPartOf":{"@id":"https://litbuyvip.store/#website"},"inLanguage":"en"}]}
            schema = '<script id="seo-home-schema" type="application/ld+json">' + json.dumps(graph, separators=(',',':')) + '</script>\n'
            updated = updated.replace('</head>', schema + '</head>', 1)
        if 'id="seo-resource-hub"' not in updated:
            hub = '''\n<section id="seo-resource-hub" aria-labelledby="seo-resource-title" style="max-width:1180px;margin:54px auto;padding:0 22px"><div style="border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:28px;background:rgba(255,255,255,.035)"><p style="margin:0 0 8px;opacity:.72;text-transform:uppercase;letter-spacing:.12em;font-size:.78rem">Buyer resources</p><h2 id="seo-resource-title" style="margin:0 0 10px">Plan beyond the spreadsheet</h2><p style="margin:0 0 20px;max-width:760px;opacity:.82">Use the spreadsheet for discovery, then review the practical checkpoints that affect warehouse decisions, QC evidence and parcel planning.</p><nav aria-label="LitBuy resource links" style="display:flex;flex-wrap:wrap;gap:10px"><a href="/qc/">LitBuy QC guide</a><a href="/shipping/">LitBuy shipping guide</a><a href="/warehouse/">LitBuy warehouse guide</a><a href="/guides/">All buyer guides</a></nav></div></section>\n'''
            updated = updated.replace('<footer', hub + '<footer', 1)
    if Counter(KAKOBUY.findall(updated)) != old_links:
        raise RuntimeError(f'Outbound kakobuymake links changed in {html}')
    if updated != original:
        html.write_text(updated, encoding='utf-8')
        print(f'updated {html}: externalized {count} inline image(s), {len(original)} -> {len(updated)} chars')

print('Optimization complete; kakobuymake outbound URLs preserved exactly.')
# Trigger the optimization workflow after workflow installation.
