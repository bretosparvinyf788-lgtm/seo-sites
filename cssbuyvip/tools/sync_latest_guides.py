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

latest = {
    'key': 'cssbuy-transaction-guide-2026',
    'title': 'CSSBuy Transaction Guide: W2C Links, QC Photos, Warehouse Checks and Safer Shipping',
    'excerpt': 'A complete CSSBuy transaction guide covering W2C links, seller checks, QC photos, warehouse inspection, returns, coupons, shipping estimates, and safer haul planning.',
    'body': [
        ['CSSBuy Transaction Guide: W2C Links, QC Photos, Warehouse Checks and Safer Shipping', 'Using CSSBuy well is not simply a matter of copying a product link and waiting for an international parcel. A safer haul is built through a sequence of small decisions: verifying the W2C source, confirming seller details, paying attention to domestic delivery, reading warehouse updates, checking QC photos, choosing a realistic shipping line, and knowing when to request a return or exchange. This guide is written for buyers who want fewer surprises between the moment they submit a product and the moment a parcel leaves the warehouse. The goal is not to make every purchase risk free; no agent can do that. The goal is to slow the process down enough that each important checkpoint is visible before money is locked into the next stage.'],
        ['Start With the W2C Link, Not the Product Photo', 'Many CSSBuy orders begin from a spreadsheet, a social media post, a seller album, a marketplace page, or a shared W2C link. The mistake new buyers make is treating the screenshot as proof of what they will receive. The active source page matters more. Before submitting anything, open the current link and write down the exact option: size, color, version, model, package type, price, domestic freight, and any seller notes. If the page has several similar variants, copy the option name into your order remark. If the link is dead, redirected, or shows a different item, do not submit it just because it appeared in an older spreadsheet. A good transaction starts with a verified source, not a hopeful guess.'],
        ['Use Seller Communication Before You Pay', 'CSSBuy can help buyers communicate with sellers when a listing is unclear. This step is worth using before payment, especially for products with multiple versions, vague sizing, hidden stock status, custom options, or unclear accessories. Ask simple questions: Is this size available? Does the item include the box? Is the color the same as the photo? Can the seller accept a return if the warehouse finds the wrong item? Does the product have domestic shipping fees? The answer may not be perfect, but it gives you a written reference if the order later becomes disputed. For high-risk items, seller communication is not a delay; it is part of the transaction check.'],
        ['Understand the Two Payment Stages', 'A common budgeting mistake is thinking the item price is the final price. With CSSBuy and similar agent workflows, the first payment normally covers the product and delivery to the warehouse. International shipping is paid later, after the item arrives, is processed, and can be packed. That second payment depends on weight, volume, destination, shipping route, packaging choice, and sometimes item category restrictions. If you build a haul only by adding product prices, your final cost estimate will be wrong. Track product price, domestic shipping, estimated weight, expected packaging, and likely route before you submit too many items. A cheap product can become expensive if it is bulky, fragile, or difficult to ship.'],
        ['Treat the Warehouse as Your Inspection Window', 'The warehouse stage is the buyer’s best opportunity to stop a bad order from becoming an international shipping problem. Once the item arrives at the warehouse, review status updates and QC photos carefully. Check whether the item matches the source page, whether the selected option is correct, whether the quantity is right, and whether visible defects are present. Do not rush to submit a parcel simply because the item arrived. If a photo is unclear, ask for an additional photo. If sizing matters, request measurement photos where appropriate. If accessories or packaging matter, check that they are visible. The warehouse cannot guarantee every hidden detail, but it gives you a chance to catch obvious errors.'],
        ['How to Read QC Photos Properly', 'QC photos should be compared against your saved order notes. First verify the basic match: item type, color, size, model, version, and quantity. Then check visible condition: stains, scratches, damaged corners, missing parts, printing errors, loose stitching, broken packaging, or obvious shape problems. Finally, check transaction details: did the seller send the correct option, did the item include promised accessories, and does the package look reasonable for international shipping? If you are unsure, do not approve the parcel immediately. A short delay for clarification is usually better than paying international shipping for the wrong item.'],
        ['Returns and Exchanges Must Be Fast', 'Returns and exchanges depend on seller policy, platform rules, item condition, timing, and communication. They are much easier before international shipping. If the warehouse photos show a wrong item, wrong size, missing accessory, visible damage, or a seller mistake, contact support quickly and explain the problem with clear references. Use order number, source link, and QC evidence. Avoid vague messages such as “this looks bad.” Instead say exactly what is wrong: the size label is different, the color does not match, the left shoe has a stain, the accessory shown in the listing is missing, or the seller sent the wrong version. Precise claims are easier for support and sellers to handle.'],
        ['Plan Shipping Before the Parcel Stage', 'Do not wait until all items are sitting in the warehouse to think about shipping. A better approach is to plan routes while building the haul. Shoes, thick hoodies, electronics, liquids, cosmetics, bags, and boxed goods can affect available lines. Some buyers remove boxes to reduce volume; others keep packaging for protection. Neither choice is always correct. If the item is fragile or resale packaging matters, protection may be worth the cost. If the item is soft clothing, removing excess packaging may save money. Compare routes by price, speed, tracking, restrictions, and reliability, not price alone.'],
        ['Coupons and Cost Control', 'Coupons can help, but they should not distract from the bigger cost structure. A small coupon will not fix an oversized parcel, poor route choice, or avoidable return. Before using a coupon, estimate the total cost: product price, local delivery, possible service costs, international freight, packaging, and any route-specific fees. Then decide whether to consolidate items, split parcels, remove packaging, or wait for another item. The best savings usually come from better planning, not from chasing the largest discount code.'],
        ['A Practical CSSBuy Transaction Workflow', 'Use this workflow for each order: save the active W2C link, record the exact option, check seller notes, ask questions if unclear, submit through CSSBuy, pay only after the details make sense, wait for warehouse arrival, review QC photos, request extra evidence if needed, decide on return or exchange quickly, consolidate only approved items, estimate shipping by weight and volume, choose a route based on restrictions and reliability, and finally submit the parcel. This process may sound slow, but it prevents the most common agent shopping mistakes. A buyer who checks each stage usually spends less time fixing problems later.'],
        ['FAQ: Can I use CSSBuy with spreadsheet W2C links?', 'Yes. A spreadsheet can help you discover items, but every link should still be opened and checked before ordering. Confirm the active source page, option, size, color, seller notes, price, and domestic shipping before submitting the order.'],
        ['FAQ: Why do I need seller checks?', 'Seller checks reduce confusion before payment. They are useful when stock, sizing, version, accessories, packaging, or return rules are unclear. A short question before payment can prevent a long dispute later.'],
        ['FAQ: Are QC photos enough to guarantee quality?', 'No. QC photos reduce risk but cannot guarantee every hidden detail. They are best for checking visible condition, correct option, basic measurements, missing accessories, and obvious seller mistakes.'],
        ['FAQ: What should I do if QC photos show the wrong item?', 'Contact support quickly with the order number, source link, and a clear explanation of what is wrong. Ask for return, exchange, or seller confirmation before paying international shipping.'],
        ['FAQ: Should I always choose the cheapest shipping line?', 'No. Compare restrictions, tracking, estimated delivery speed, reliability, and item category limits. The cheapest line can become expensive if it causes delays, rejects the parcel, or lacks proper tracking.'],
        ['FAQ: How can I avoid surprise shipping costs?', 'Estimate weight and volume before the warehouse stage. Track bulky items, boxes, shoes, electronics, and heavy clothing. Build your haul around likely shipping routes instead of only product prices.'],
        ['FAQ: When should I request extra photos?', 'Request extra photos when a label, size tag, measurement, accessory, flaw, color, or packaging detail is not visible. Extra evidence is most useful before parcel submission.'],
        ['FAQ: Can I return an item after international shipping?', 'Once an item leaves the warehouse, returns become much harder and may be impractical. Handle return and exchange questions while the product is still in the warehouse.'],
        ['FAQ: What is the safest habit for new CSSBuy users?', 'Keep written notes for every order: source link, selected option, seller question, price, QC status, return deadline, estimated weight, and shipping plan. Good records make every later decision easier.']
    ],
    'tags': 'CSSBuy, CSSBuy transaction guide, W2C links, CSSBuy QC photos, CSSBuy warehouse, CSSBuy shipping, CSSBuy returns, agent shopping, reverse purchasing',
    'seo_title': 'CSSBuy Transaction Guide: W2C Links, QC Photos, Warehouse Checks and Shipping'
}

fallbacks_en = [
    {'key':'spreadsheet','title':'How to Use a CSSBuy Spreadsheet to Build a Smarter Shopping List','excerpt':'Use a CSSBuy spreadsheet to find W2C links, compare seller notes, check QC photos, shipping clues, and organize a safer shopping list.','body':[['How to Use a CSSBuy Spreadsheet to Build a Smarter Shopping List','A CSSBuy spreadsheet is most useful when you treat it as a planning tool instead of a random link dump. Before you submit a product, compare the source link, seller notes, size options, shipping clues, and available QC information.'],['Check W2C Links Before Ordering','A W2C link can change, go out of stock, or show different options over time. Open the active source page and confirm the exact color, size, and version before submitting through CSSBuy.'],['FAQ','A spreadsheet helps discovery, but the active source page and QC photos still decide whether the order is safe.']],'tags':'CSSBuy spreadsheet, W2C links, CSSBuy guide, QC photos'},
    {'key':'shipping','title':'CSSBuy Shipping Tips: How to Save Money Before Submitting Your Parcel','excerpt':'Learn how CSSBuy users can compare routes, estimate package weight, review volume, choose packaging, and avoid costly shipping mistakes.','body':[['CSSBuy Shipping Tips: How to Save Money Before Submitting Your Parcel','Shipping is where many new agent shoppers lose control of their budget. Product prices may look cheap, but the final cost depends on weight, volume, destination, route restrictions, and packaging choices.'],['Compare Routes, Not Just Prices','The cheapest route is not always the best. Review tracking, restrictions, delivery speed, reliability, and item category limits before submitting your parcel.'],['FAQ','Consolidation can save money, but only ship items after QC approval and route comparison.']],'tags':'CSSBuy shipping, CSSBuy parcel, shipping estimate'},
    {'key':'qc','title':'CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul','excerpt':'Use CSSBuy QC photos to inspect seller promises, product details, size, flaws, missing accessories, packaging, and transaction risk before shipment.','body':[['CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul','QC photos are your last major checkpoint before international shipping. Once a parcel leaves the warehouse, fixing wrong items or visible flaws becomes much harder.'],['Inspect Visible Details','Look for stains, damaged packaging, missing accessories, wrong size labels, color issues, and obvious product defects before approving shipment.'],['FAQ','QC photos cannot guarantee every hidden detail, but they are essential for catching obvious problems.']],'tags':'CSSBuy QC photos, warehouse inspection, CSSBuy returns'}
]

localized_latest = {
    'zh': {'title':'CSSBuy 最新交易与购物指南','excerpt':'完整 CSSBuy 交易指南，覆盖 W2C 链接、QC 照片、仓库检查、退换货、运费估算和更安全的购物流程。','tags':'CSSBuy, CSSBuy 指南, W2C 链接, QC 照片, CSSBuy 运输'},
    'es': {'title':'Guía completa de transacciones CSSBuy','excerpt':'Guía práctica sobre enlaces W2C, fotos QC, revisión de almacén, devoluciones, envíos y compras más seguras con CSSBuy.','tags':'CSSBuy, guía CSSBuy, enlaces W2C, fotos QC, envíos CSSBuy'},
    'de': {'title':'Vollständiger CSSBuy Transaktionsleitfaden','excerpt':'Praktischer CSSBuy Guide zu W2C Links, QC Fotos, Lagerprüfung, Rückgaben, Versand und sichererer Bestellung.','tags':'CSSBuy, CSSBuy Guide, W2C Links, QC Fotos, Versand'},
    'pt': {'title':'Guia completo de transações CSSBuy','excerpt':'Guia prático sobre links W2C, fotos QC, verificação de armazém, devoluções, envio e compras mais seguras com CSSBuy.','tags':'CSSBuy, guia CSSBuy, links W2C, fotos QC, envio CSSBuy'}
}

fallback_titles = {
    'zh': [('如何用 CSSBuy 电子表格打造更聪明的购物清单','使用 CSSBuy 电子表格查找 W2C 链接、判断卖家信息、检查 QC 照片，并规划更安全的购物清单。'),('CSSBuy 运输技巧：提交包裹前如何省钱','了解如何比较线路、预估重量、检查体积、选择包装，并避免常见 CSSBuy 运费错误。'),('CSSBuy QC 照片指南：发货前应该检查什么','用 CSSBuy QC 照片检查卖家承诺、商品细节、尺码、瑕疵、缺失配件、包装和交易风险。')],
    'es': [('Cómo usar una hoja CSSBuy para crear una lista de compras inteligente','Usa una hoja CSSBuy para encontrar enlaces W2C, comparar notas del vendedor, revisar fotos QC y organizar una compra más segura.'),('Consejos de envío CSSBuy: cómo ahorrar antes de enviar el paquete','Compara rutas, peso estimado, volumen, embalaje y errores comunes antes de enviar tu paquete CSSBuy.'),('Guía de fotos QC CSSBuy: qué revisar antes del envío','Usa fotos QC para revisar detalles del producto, talla, defectos, accesorios, embalaje y riesgo antes del envío.')],
    'de': [('So nutzt du ein CSSBuy Spreadsheet für eine bessere Einkaufsliste','Nutze ein CSSBuy Spreadsheet für W2C Links, Verkäuferhinweise, QC Fotos und eine sicherere Einkaufsliste.'),('CSSBuy Versandtipps: Geld sparen vor dem Paketversand','Vergleiche Routen, Gewicht, Volumen, Verpackung und typische Versandfehler vor dem CSSBuy Paketversand.'),('CSSBuy QC Foto Guide: Was du vor dem Versand prüfen solltest','Prüfe Produktdetails, Größe, Fehler, Zubehör, Verpackung und Risiko mithilfe von CSSBuy QC Fotos.')],
    'pt': [('Como usar uma planilha CSSBuy para montar uma lista melhor','Use uma planilha CSSBuy para encontrar links W2C, comparar notas do vendedor, revisar fotos QC e organizar uma compra mais segura.'),('Dicas de envio CSSBuy: como economizar antes de enviar o pacote','Compare rotas, peso estimado, volume, embalagem e erros comuns antes de enviar seu pacote CSSBuy.'),('Guia de fotos QC CSSBuy: o que verificar antes do envio','Use fotos QC para verificar detalhes, tamanho, defeitos, acessórios, embalagem e riscos antes do envio.')]
}

def localize_defaults(lang):
    if lang == 'en':
        return deepcopy(fallbacks_en)
    out = []
    for base, (title, excerpt) in zip(fallbacks_en, fallback_titles[lang]):
        item = deepcopy(base)
        item['title'] = title
        item['excerpt'] = excerpt
        out.append(item)
    return out

for lang in ['en','zh','es','de','pt']:
    item = deepcopy(latest)
    if lang != 'en':
        item.update(localized_latest[lang])
    articles[lang] = [item] + localize_defaults(lang)

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

for marker in ['category-grid','product-grid','featured-products','function home()','function guides()','cssbuy-transaction-guide-2026','spreadsheet','shipping','qc']:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)
if 'function guides() {\n  const u = SITE_DATA.ui[currentLang];\n  const cards = SITE_DATA.articles[currentLang].slice(0,3).map' in html:
    raise SystemExit('Safety stop: guides() is still limited')

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Fixed guides to exactly four articles with long latest article')
else:
    print('No changes needed')