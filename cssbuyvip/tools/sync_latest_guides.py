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
latest_key = latest.get('key') or 'latest-cssbuy-guide'

fallbacks = {
    'en': [
        {
            'key': 'spreadsheet',
            'title': 'How to Use a CSSBuy Spreadsheet to Build a Smarter Shopping List',
            'excerpt': 'Use a CSSBuy spreadsheet to find W2C links, compare seller notes, check QC photos, shipping clues, and organize a safer shopping list.',
            'body': [
                ['How to Use a CSSBuy Spreadsheet to Build a Smarter Shopping List', 'A CSSBuy spreadsheet is most useful when you treat it as a planning tool instead of a random link dump. Before you submit a product, compare the source link, seller notes, size options, shipping clues, and available QC information. This helps you avoid wrong options, dead links, and rushed purchases.'],
                ['Start With Category and Intent', 'Open the category that matches your haul goal, such as shoes, clothing, bags, electronics, or accessories. Save only items that fit your budget, size needs, and shipping plan. A good spreadsheet workflow should reduce confusion, not create a bigger cart of uncertain products.'],
                ['Check W2C Links Before Ordering', 'A W2C link can change, go out of stock, or show different options over time. Open the active source page, confirm the product option, read seller notes, and write down the exact color, size, and version you want before submitting through CSSBuy.'],
                ['Use QC Photos as Your Final Filter', 'When your item reaches the warehouse, compare QC photos with the original listing. Check labels, measurements, colors, stains, accessories, and packaging. If something looks wrong, request extra photos or contact support before international shipping.'],
                ['FAQ: Is a CSSBuy spreadsheet enough by itself?', 'No. It is a discovery and planning tool. You still need to verify the source page, order details, QC photos, and shipping options before final approval.']
            ],
            'tags': 'CSSBuy spreadsheet, W2C links, CSSBuy guide, QC photos, shopping list'
        },
        {
            'key': 'shipping',
            'title': 'CSSBuy Shipping Tips: How to Save Money Before Submitting Your Parcel',
            'excerpt': 'Learn how CSSBuy users can compare routes, estimate package weight, review volume, choose packaging, and avoid costly shipping mistakes.',
            'body': [
                ['CSSBuy Shipping Tips: How to Save Money Before Submitting Your Parcel', 'Shipping is where many new agent shoppers lose control of their budget. Product prices may look cheap, but the final cost depends on weight, volume, destination, route restrictions, and packaging choices. Before submitting a parcel, build a simple shipping plan.'],
                ['Estimate Weight Early', 'Shoes, hoodies, bags, electronics, and boxed items can change your parcel cost quickly. Record estimated weight while building your haul so you are not surprised after everything reaches the warehouse.'],
                ['Compare Routes, Not Just Prices', 'The cheapest route is not always the best. Review tracking, restrictions, delivery speed, reliability, and item category limits. Some routes may not accept certain goods, packaging types, or product materials.'],
                ['Use Packaging Choices Carefully', 'Removing boxes can reduce volume, but it may reduce protection. Reinforced packaging can add cost but may protect fragile or high-value items. Choose based on the item, not only the cheapest number.'],
                ['FAQ: Should I ship every item separately?', 'Usually no. Consolidation can save money, but only ship items after QC approval and after checking whether the combined weight and volume still fit a good route.']
            ],
            'tags': 'CSSBuy shipping, CSSBuy parcel, shipping estimate, international delivery, haul planning'
        },
        {
            'key': 'qc',
            'title': 'CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul',
            'excerpt': 'Use CSSBuy QC photos to inspect seller promises, product details, size, flaws, missing accessories, packaging, and transaction risk before shipment.',
            'body': [
                ['CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul', 'QC photos are your last major checkpoint before international shipping. Once a parcel leaves the warehouse, fixing wrong items or visible flaws becomes much harder. Review every photo carefully and compare it with the source listing.'],
                ['Check the Basic Match First', 'Confirm the item type, color, size, quantity, and selected version. Many mistakes come from wrong options rather than obvious defects.'],
                ['Inspect Visible Details', 'Look for stains, damaged packaging, crooked prints, missing accessories, broken parts, wrong logos, and measurement issues. Ask for extra photos when a detail is hidden or unclear.'],
                ['Act Quickly on Problems', 'If QC reveals an issue, contact support quickly while the product is still in the warehouse. Returns and exchanges depend on seller rules, timing, and item condition.'],
                ['FAQ: Can QC photos guarantee product quality?', 'No. QC photos reduce risk but cannot guarantee every hidden detail. They are still essential for catching obvious errors before shipping.']
            ],
            'tags': 'CSSBuy QC photos, warehouse inspection, CSSBuy returns, product check, agent shopping'
        }
    ]
}

# Localized article cards for the original three guides. Bodies stay practical and compact.
fallbacks['zh'] = [
    {**deepcopy(fallbacks['en'][0]), 'title': '如何用 CSSBuy 电子表格打造更聪明的购物清单', 'excerpt': '使用 CSSBuy 电子表格查找 W2C 链接、判断卖家信息、检查 QC 照片，并规划更安全的购物清单。', 'tags': 'CSSBuy 电子表格, W2C 链接, CSSBuy 指南, QC 照片'},
    {**deepcopy(fallbacks['en'][1]), 'title': 'CSSBuy 运输技巧：提交包裹前如何省钱', 'excerpt': '了解如何比较线路、预估重量、检查体积、选择包装，并避免常见 CSSBuy 运费错误。', 'tags': 'CSSBuy 运输, CSSBuy 包裹, 运费估算, 国际运输'},
    {**deepcopy(fallbacks['en'][2]), 'title': 'CSSBuy QC 照片指南：发货前应该检查什么', 'excerpt': '用 CSSBuy QC 照片检查卖家承诺、商品细节、尺码、瑕疵、缺失配件、包装和交易风险。', 'tags': 'CSSBuy QC 照片, 仓库检查, CSSBuy 退换货'}
]
fallbacks['es'] = [
    {**deepcopy(fallbacks['en'][0]), 'title': 'Cómo usar una hoja CSSBuy para crear una lista de compras inteligente', 'excerpt': 'Usa una hoja CSSBuy para encontrar enlaces W2C, comparar notas del vendedor, revisar fotos QC y organizar una compra más segura.', 'tags': 'CSSBuy spreadsheet, enlaces W2C, guía CSSBuy, fotos QC'},
    {**deepcopy(fallbacks['en'][1]), 'title': 'Consejos de envío CSSBuy: cómo ahorrar antes de enviar el paquete', 'excerpt': 'Compara rutas, peso estimado, volumen, embalaje y errores comunes antes de enviar tu paquete CSSBuy.', 'tags': 'envío CSSBuy, paquete CSSBuy, estimación de envío'},
    {**deepcopy(fallbacks['en'][2]), 'title': 'Guía de fotos QC CSSBuy: qué revisar antes del envío', 'excerpt': 'Usa fotos QC para revisar detalles del producto, talla, defectos, accesorios, embalaje y riesgo antes del envío.', 'tags': 'fotos QC CSSBuy, inspección de almacén, devoluciones CSSBuy'}
]
fallbacks['de'] = [
    {**deepcopy(fallbacks['en'][0]), 'title': 'So nutzt du ein CSSBuy Spreadsheet für eine bessere Einkaufsliste', 'excerpt': 'Nutze ein CSSBuy Spreadsheet für W2C Links, Verkäuferhinweise, QC Fotos und eine sicherere Einkaufsliste.', 'tags': 'CSSBuy Spreadsheet, W2C Links, CSSBuy Guide, QC Fotos'},
    {**deepcopy(fallbacks['en'][1]), 'title': 'CSSBuy Versandtipps: Geld sparen vor dem Paketversand', 'excerpt': 'Vergleiche Routen, Gewicht, Volumen, Verpackung und typische Versandfehler vor dem CSSBuy Paketversand.', 'tags': 'CSSBuy Versand, CSSBuy Paket, Versandkosten'},
    {**deepcopy(fallbacks['en'][2]), 'title': 'CSSBuy QC Foto Guide: Was du vor dem Versand prüfen solltest', 'excerpt': 'Prüfe Produktdetails, Größe, Fehler, Zubehör, Verpackung und Risiko mithilfe von CSSBuy QC Fotos.', 'tags': 'CSSBuy QC Fotos, Lagerprüfung, CSSBuy Rückgabe'}
]
fallbacks['pt'] = [
    {**deepcopy(fallbacks['en'][0]), 'title': 'Como usar uma planilha CSSBuy para montar uma lista melhor', 'excerpt': 'Use uma planilha CSSBuy para encontrar links W2C, comparar notas do vendedor, revisar fotos QC e organizar uma compra mais segura.', 'tags': 'CSSBuy spreadsheet, links W2C, guia CSSBuy, fotos QC'},
    {**deepcopy(fallbacks['en'][1]), 'title': 'Dicas de envio CSSBuy: como economizar antes de enviar o pacote', 'excerpt': 'Compare rotas, peso estimado, volume, embalagem e erros comuns antes de enviar seu pacote CSSBuy.', 'tags': 'envio CSSBuy, pacote CSSBuy, estimativa de envio'},
    {**deepcopy(fallbacks['en'][2]), 'title': 'Guia de fotos QC CSSBuy: o que verificar antes do envio', 'excerpt': 'Use fotos QC para verificar detalhes, tamanho, defeitos, acessórios, embalagem e riscos antes do envio.', 'tags': 'fotos QC CSSBuy, inspeção de armazém, devoluções CSSBuy'}
]

# Localized latest cards, while keeping latest full body.
latest_localized = {
    'zh': {'title': 'CSSBuy 最新交易与购物指南', 'excerpt': '最新 CSSBuy 实用文章，覆盖 W2C 链接、QC 照片、仓库检查、退换货、运输规划和安全下单流程。', 'tags': 'CSSBuy, CSSBuy 指南, W2C 链接, QC 照片, CSSBuy 运输, 代购, 反向代购'},
    'es': {'title': 'Guía actualizada de compras y transacciones CSSBuy', 'excerpt': 'Artículo práctico sobre enlaces W2C, fotos QC, revisión de almacén, devoluciones, envíos y planificación segura con CSSBuy.', 'tags': 'CSSBuy, guía CSSBuy, enlaces W2C, fotos QC, envíos CSSBuy, compras con agente'},
    'de': {'title': 'Aktueller CSSBuy Einkaufs- und Transaktionsleitfaden', 'excerpt': 'Praktischer CSSBuy-Artikel zu W2C Links, QC Fotos, Lagerprüfung, Rückgaben, Versandplanung und sicherem Bestellablauf.', 'tags': 'CSSBuy, CSSBuy Guide, W2C Links, QC Fotos, CSSBuy Versand, Agent Shopping'},
    'pt': {'title': 'Guia atualizado de compras e transações CSSBuy', 'excerpt': 'Artigo prático sobre links W2C, fotos QC, verificação de armazém, devoluções, envio e planejamento seguro com CSSBuy.', 'tags': 'CSSBuy, guia CSSBuy, links W2C, fotos QC, envio CSSBuy, compras com agente'}
}

def sig(article):
    return str(article.get('key') or article.get('title') or '').strip().lower()

def dedupe(arr):
    seen = set()
    out = []
    for a in arr:
        s = sig(a)
        if s and s not in seen:
            seen.add(s)
            out.append(a)
    return out

for lang in ['en', 'zh', 'es', 'de', 'pt']:
    existing = dedupe(articles.get(lang, []))
    latest_item = deepcopy(latest)
    if lang != 'en':
        latest_item.update(latest_localized[lang])
    # Remove any duplicate of latest and default keys, then append safe defaults.
    protected_keys = {sig(latest_item), 'spreadsheet', 'shipping', 'qc'}
    remaining = [a for a in existing if sig(a) not in protected_keys]
    articles[lang] = dedupe([latest_item] + fallbacks[lang] + remaining)

new_json = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
html = html[:m.start(1)] + new_json + html[m.end(1):]

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

for marker in ['category-grid', 'product-grid', 'featured-products', 'function home()', 'function guides()', "setView('guides')", 'spreadsheet', 'shipping', 'qc']:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)
if 'function guides() {\n  const u = SITE_DATA.ui[currentLang];\n  const cards = SITE_DATA.articles[currentLang].slice(0,3).map' in html:
    raise SystemExit('Safety stop: guides() is still limited')

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Restored latest guide plus original three articles in all languages')
else:
    print('No changes needed')