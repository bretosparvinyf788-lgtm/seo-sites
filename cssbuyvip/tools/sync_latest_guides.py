import json
import re
from copy import deepcopy
from pathlib import Path

p = Path('cssbuyvip/index.html')
html = p.read_text(encoding='utf-8')
original = html

required = ['const SITE_DATA = ', 'SITE_DATA.articles', 'function home()', 'function guides()', 'category-grid', 'product-grid', 'featured-products']
missing = [m for m in required if m not in html]
if missing:
    raise SystemExit('Safety stop: missing markers: ' + ', '.join(missing))

m = re.search(r'const SITE_DATA = (\{.*?\});\nlet currentLang', html, re.S)
if not m:
    raise SystemExit('Could not find SITE_DATA block')

data = json.loads(m.group(1))
articles = data.setdefault('articles', {})
if not articles.get('en'):
    raise SystemExit('No English articles found')

latest = deepcopy(articles['en'][0])
key = latest.get('key') or 'latest-cssbuy-guide'

localized = {
    'zh': {'title': 'CSSBuy 最新交易与购物指南','excerpt': '最新 CSSBuy 实用文章，覆盖 W2C 链接、QC 照片、仓库检查、退换货、运输规划和安全下单流程。','tags': 'CSSBuy, CSSBuy 指南, W2C 链接, QC 照片, CSSBuy 运输, 代购, 反向代购'},
    'es': {'title': 'Guía actualizada de compras y transacciones CSSBuy','excerpt': 'Artículo práctico sobre enlaces W2C, fotos QC, revisión de almacén, devoluciones, envíos y planificación segura con CSSBuy.','tags': 'CSSBuy, guía CSSBuy, enlaces W2C, fotos QC, envíos CSSBuy, compras con agente'},
    'de': {'title': 'Aktueller CSSBuy Einkaufs- und Transaktionsleitfaden','excerpt': 'Praktischer CSSBuy-Artikel zu W2C Links, QC Fotos, Lagerprüfung, Rückgaben, Versandplanung und sicherem Bestellablauf.','tags': 'CSSBuy, CSSBuy Guide, W2C Links, QC Fotos, CSSBuy Versand, Agent Shopping'},
    'pt': {'title': 'Guia atualizado de compras e transações CSSBuy','excerpt': 'Artigo prático sobre links W2C, fotos QC, verificação de armazém, devoluções, envio e planejamento seguro com CSSBuy.','tags': 'CSSBuy, guia CSSBuy, links W2C, fotos QC, envio CSSBuy, compras com agente'}
}

for lang in ['en', 'zh', 'es', 'de', 'pt']:
    arr = articles.setdefault(lang, [])
    arr = [a for a in arr if a.get('key') != key]
    item = latest if lang == 'en' else deepcopy(latest)
    if lang != 'en':
        item.update(localized[lang])
    articles[lang] = [item] + arr

new_json = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
html = html[:m.start(1)] + new_json + html[m.end(1):]

# Force exact rendering rule: home() is limited to 3, guides() is unlimited.
home_pat = r"function home\(\) \{(.*?)function guides\(\) \{"
home_m = re.search(home_pat, html, re.S)
if not home_m:
    raise SystemExit('Could not isolate home() block')
home_block = home_m.group(1)
home_block = home_block.replace('SITE_DATA.articles[currentLang].slice(0,3).map', 'SITE_DATA.articles[currentLang].map')
home_block = home_block.replace('SITE_DATA.articles[currentLang].map', 'SITE_DATA.articles[currentLang].slice(0,3).map', 1)
home_block = home_block.replace('<a class="outline-link" href="/blog/">${u.viewAll}</a>', '<a class="outline-link" href="#" onclick="event.preventDefault();setView(\'guides\')">${u.viewAll}</a>')
html = html[:home_m.start(1)] + home_block + html[home_m.end(1):]

guides_pat = r"function guides\(\) \{(.*?)function article\(\) \{"
guides_m = re.search(guides_pat, html, re.S)
if not guides_m:
    raise SystemExit('Could not isolate guides() block')
guides_block = guides_m.group(1).replace('SITE_DATA.articles[currentLang].slice(0,3).map', 'SITE_DATA.articles[currentLang].map')
html = html[:guides_m.start(1)] + guides_block + html[guides_m.end(1):]

html = html.replace('<a href="/blog/">${pages.blog || \'Blog\'}</a>', '<a href="#" onclick="event.preventDefault();setView(\'guides\')">${pages.blog || \'Blog\'}</a>')

for marker in ['category-grid', 'product-grid', 'featured-products', 'function home()', 'function guides()', "setView('guides')", key]:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)
if 'function guides()' in html and 'function guides() {\n  const u = SITE_DATA.ui[currentLang];\n  const cards = SITE_DATA.articles[currentLang].slice(0,3).map' in html:
    raise SystemExit('Safety stop: guides() is still limited')

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Updated homepage latest 3, guides all, all languages:', key)
else:
    print('No changes needed')
