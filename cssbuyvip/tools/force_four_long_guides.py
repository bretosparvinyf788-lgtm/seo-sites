import json
import re
from pathlib import Path

p = Path('cssbuyvip/index.html')
html = p.read_text(encoding='utf-8')
required = ['const SITE_DATA = ', 'SITE_DATA.articles', 'function home()', 'function guides()', 'category-grid', 'product-grid', 'featured-products']
missing = [x for x in required if x not in html]
if missing:
    raise SystemExit('Safety stop: missing ' + ', '.join(missing))

m = re.search(r'const SITE_DATA = (\{.*?\});\nlet currentLang', html, re.S)
if not m:
    raise SystemExit('Could not find SITE_DATA')
data = json.loads(m.group(1))

def make_body(title, focus, problem, workflow, faq_focus):
    sections = [
        ('Introduction', f'{title} is designed for CSSBuy users who want a practical article rather than a short card summary. The main problem is that many shoppers discover a useful W2C link, paste it into an agent form, and then move too quickly through payment, warehouse inspection, and international shipping. A safer {focus} workflow needs more structure. It should explain what to check before ordering, how to read seller information, when to use CSSBuy support, how to evaluate QC photos, and how to avoid turning a small mistake into an expensive parcel problem.'),
        ('Why this topic matters for CSSBuy shoppers', f'{problem} matters because CSSBuy shopping is a staged process. Product discovery, order submission, domestic delivery, warehouse handling, QC review, parcel preparation, and international shipping are separate decisions. A buyer who treats them as one simple checkout loses control over cost and risk. This article breaks the process into checkpoints so users can make better decisions before money is committed to the next stage. The purpose is not to promise perfect results, but to create a repeatable routine that prevents avoidable mistakes.'),
        ('Start with the source link', f'Every useful CSSBuy order begins with a verified source link. A spreadsheet entry, seller album, shared W2C post, or social media recommendation is only a starting point. Open the current product page and check whether the item still exists, whether the price has changed, whether the seller shows several options, and whether the chosen size or color is available. Record the exact option in your notes. If the link redirects, shows a different product, or has confusing variants, pause before submitting it through CSSBuy.'),
        ('Read seller details before payment', f'Seller details can change the entire transaction. Look for stock notes, domestic freight, version names, measurements, package contents, return limits, and any warning about special products. When details are unclear, ask CSSBuy to contact the seller before payment. A short question about stock, sizing, included accessories, or return rules can save days of dispute later. Good buyers do not ask vague questions. They write clear notes such as: confirm black size L, confirm boxed package, confirm return accepted if warehouse receives wrong color.'),
        ('Use CSSBuy order remarks carefully', f'Order remarks are small but important. Use them to repeat the exact option, not to write general hopes. A useful remark might say: order the grey 800g hoodie, size XL, no substitute color, ask seller before changing size. Another useful remark might say: confirm player version jersey, not fan version, and include name set. These details help CSSBuy staff and reduce ambiguity. If the source page contains several similar products, remarks can prevent the seller from sending the easiest available option instead of the one you wanted.'),
        ('Understand the warehouse checkpoint', f'The warehouse stage is your most important inspection window. After the item arrives, do not submit international shipping immediately. Review status updates and QC photos. Compare the received item with the original source page and your saved notes. Check color, size, quantity, option, packaging, accessories, visible flaws, and labels. If the photos do not show a detail that matters, request additional photos. This extra step may feel slow, but it is far easier than discovering a problem after the parcel has already left the warehouse.'),
        ('How to judge QC photos', f'QC photos should be read in layers. First, confirm the basic match: item type, color, size tag, model, version, and quantity. Second, inspect visible condition: stains, scratches, wrong print placement, damaged packaging, missing accessories, crooked stitching, broken parts, or unusual shape. Third, check transaction risk: did the seller send what was promised, and is the item worth shipping internationally? QC photos cannot reveal every hidden issue, but they are the best chance to catch obvious mistakes before final parcel payment.'),
        ('Returns and exchanges', f'Returns and exchanges should be handled quickly. If QC photos show the wrong item, wrong size, damaged product, missing accessory, or seller mistake, contact support while the item is still in the warehouse. Use order number, source link, and a clear explanation. Do not say only that the item is bad. Explain the precise mismatch. For example, the seller sent size M instead of L, the box is missing, the color is different from the selected option, or the print is visibly damaged. Clear claims are easier to process.'),
        ('Shipping and cost planning', f'{workflow} should include shipping planning before the parcel page. Product price is only one part of total cost. Weight, volume, packaging, route restrictions, destination country, and product category all affect final shipping. Shoes, thick hoodies, electronics, cosmetics, bags, and boxed products can change the route choice. Compare shipping lines by restrictions, tracking, speed, reliability, and price. The cheapest line is not always the best if it rejects the parcel, has weak tracking, or handles your item category poorly.'),
        ('Coupon and budget control', f'Coupons can reduce cost, but they cannot fix poor planning. Before using any discount, estimate item price, domestic freight, service-related costs, international shipping, packaging choices, and possible return fees. A buyer who understands the full cost structure can decide whether to split parcels, remove packaging, consolidate more items, or stop adding products. Budget control is a habit, not a code. It begins when you choose the item and continues until the parcel leaves the warehouse.'),
        ('Common mistakes to avoid', f'The most common mistake is rushing. Buyers rush the link check, rush payment, rush QC, and rush parcel submission. Another mistake is trusting an old spreadsheet entry without opening the live source page. A third mistake is ignoring domestic freight and later blaming international shipping for the whole cost. Many problems can be avoided by saving the source link, recording the option, asking seller questions early, reading QC photos slowly, and approving only items that match the plan.'),
        ('A practical checklist', f'Use this checklist before every CSSBuy shipment: verify the live source link, record exact option, check seller notes, use order remarks, ask questions if unclear, wait for warehouse arrival, review QC photos, request extra photos when needed, decide on return or exchange quickly, estimate weight and volume, compare shipping routes, choose packaging based on item type, apply coupons only after cost planning, and submit the parcel only when all approved items make sense together.'),
        ('FAQ: Is this enough to remove all risk?', f'No. {faq_focus} reduces risk, but no guide can remove every problem from cross-border agent shopping. Sellers can make mistakes, product pages can change, and shipping routes can have restrictions. The goal is to reduce avoidable errors by checking each stage carefully. A buyer who documents options, reviews QC photos, and plans shipping usually has fewer surprises than a buyer who clicks through every step without notes.'),
        ('FAQ: When should I ask CSSBuy support for help?', f'Ask for help when the seller page is unclear, the selected option is confusing, QC photos do not show the needed detail, the received product does not match the order, or shipping restrictions are uncertain. Support works best when your message includes the order number, source link, selected option, and a specific question. Clear context makes it easier for staff to contact the seller or explain what can be done next.'),
        ('Final recommendation', f'The best CSSBuy users are not the fastest buyers. They are the buyers who keep notes, compare details, and only move forward when the next step is clear. Whether your focus is spreadsheets, shipping, QC photos, or transaction safety, the habit is the same: verify before payment, inspect before shipping, and calculate before submitting a parcel. That routine turns CSSBuy from a risky guessing process into a controlled shopping workflow.')
    ]
    return sections

articles_en = [
    {
        'key': 'cssbuy-transaction-guide-2026',
        'title': 'CSSBuy Transaction Guide: W2C Links, QC Photos, Warehouse Checks and Safer Shipping',
        'excerpt': 'A complete CSSBuy transaction guide covering W2C links, seller checks, QC photos, warehouse inspection, returns, coupons, shipping estimates, and safer haul planning.',
        'body': make_body('CSSBuy Transaction Guide: W2C Links, QC Photos, Warehouse Checks and Safer Shipping', 'transaction safety', 'Transaction safety', 'A complete transaction workflow', 'Transaction planning'),
        'tags': 'CSSBuy, W2C links, QC photos, CSSBuy warehouse, CSSBuy shipping, CSSBuy returns, agent shopping',
        'seo_title': 'CSSBuy Transaction Guide: W2C Links, QC Photos, Warehouse Checks and Shipping'
    },
    {
        'key': 'spreadsheet',
        'title': 'How to Use a CSSBuy Spreadsheet to Build a Smarter Shopping List',
        'excerpt': 'Use a CSSBuy spreadsheet to find W2C links, compare seller notes, check QC photos, shipping clues, and organize a safer shopping list.',
        'body': make_body('How to Use a CSSBuy Spreadsheet to Build a Smarter Shopping List', 'spreadsheet planning', 'Spreadsheet planning', 'A spreadsheet-based planning workflow', 'Spreadsheet research'),
        'tags': 'CSSBuy spreadsheet, W2C links, shopping list, CSSBuy guide, QC photos',
        'seo_title': 'How to Use a CSSBuy Spreadsheet for W2C Links and Safer Shopping'
    },
    {
        'key': 'shipping',
        'title': 'CSSBuy Shipping Tips: How to Save Money Before Submitting Your Parcel',
        'excerpt': 'Learn how CSSBuy users can compare routes, estimate package weight, review volume, choose packaging, and avoid costly shipping mistakes.',
        'body': make_body('CSSBuy Shipping Tips: How to Save Money Before Submitting Your Parcel', 'shipping cost control', 'Shipping cost control', 'A shipping-focused parcel workflow', 'Shipping planning'),
        'tags': 'CSSBuy shipping, CSSBuy parcel, shipping estimate, package weight, international delivery',
        'seo_title': 'CSSBuy Shipping Tips: Save Money Before Submitting Your Parcel'
    },
    {
        'key': 'qc',
        'title': 'CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul',
        'excerpt': 'Use CSSBuy QC photos to inspect seller promises, product details, size, flaws, missing accessories, packaging, and transaction risk before shipment.',
        'body': make_body('CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul', 'QC photo review', 'QC photo review', 'A QC-based approval workflow', 'QC inspection'),
        'tags': 'CSSBuy QC photos, warehouse inspection, CSSBuy returns, product check, agent shopping',
        'seo_title': 'CSSBuy QC Photo Guide: What to Check Before Shipping Your Haul'
    }
]

localized = {
    'zh': [
        ('CSSBuy 最新交易与购物指南', '最新 CSSBuy 实用文章，覆盖 W2C 链接、QC 照片、仓库检查、退换货、运输规划和安全下单流程。'),
        ('如何用 CSSBuy 电子表格打造更聪明的购物清单', '使用 CSSBuy 电子表格查找 W2C 链接、判断卖家信息、检查 QC 照片，并规划更安全的购物清单。'),
        ('CSSBuy 运输技巧：提交包裹前如何省钱', '了解如何比较线路、预估重量、检查体积、选择包装，并避免常见 CSSBuy 运费错误。'),
        ('CSSBuy QC 照片指南：发货前应该检查什么', '用 CSSBuy QC 照片检查卖家承诺、商品细节、尺码、瑕疵、缺失配件、包装和交易风险。')
    ],
    'es': [
        ('Guía actualizada de compras y transacciones CSSBuy', 'Artículo práctico sobre enlaces W2C, fotos QC, revisión de almacén, devoluciones, envíos y planificación segura con CSSBuy.'),
        ('Cómo usar una hoja CSSBuy para crear una lista de compras inteligente', 'Usa una hoja CSSBuy para encontrar enlaces W2C, comparar notas del vendedor, revisar fotos QC y organizar una compra más segura.'),
        ('Consejos de envío CSSBuy: cómo ahorrar antes de enviar el paquete', 'Compara rutas, peso estimado, volumen, embalaje y errores comunes antes de enviar tu paquete CSSBuy.'),
        ('Guía de fotos QC CSSBuy: qué revisar antes del envío', 'Usa fotos QC para revisar detalles del producto, talla, defectos, accesorios, embalaje y riesgo antes del envío.')
    ],
    'de': [
        ('Aktueller CSSBuy Einkaufs- und Transaktionsleitfaden', 'Praktischer CSSBuy-Artikel zu W2C Links, QC Fotos, Lagerprüfung, Rückgaben, Versandplanung und sicherem Bestellablauf.'),
        ('So nutzt du ein CSSBuy Spreadsheet für eine bessere Einkaufsliste', 'Nutze ein CSSBuy Spreadsheet für W2C Links, Verkäuferhinweise, QC Fotos und eine sicherere Einkaufsliste.'),
        ('CSSBuy Versandtipps: Geld sparen vor dem Paketversand', 'Vergleiche Routen, Gewicht, Volumen, Verpackung und typische Versandfehler vor dem CSSBuy Paketversand.'),
        ('CSSBuy QC Foto Guide: Was du vor dem Versand prüfen solltest', 'Prüfe Produktdetails, Größe, Fehler, Zubehör, Verpackung und Risiko mithilfe von CSSBuy QC Fotos.')
    ],
    'pt': [
        ('Guia atualizado de compras e transações CSSBuy', 'Artigo prático sobre links W2C, fotos QC, verificação de armazém, devoluções, envio e planejamento seguro com CSSBuy.'),
        ('Como usar uma planilha CSSBuy para montar uma lista melhor', 'Use uma planilha CSSBuy para encontrar links W2C, comparar notas do vendedor, revisar fotos QC e organizar uma compra mais segura.'),
        ('Dicas de envio CSSBuy: como economizar antes de enviar o pacote', 'Compare rotas, peso estimado, volume, embalagem e erros comuns antes de enviar seu pacote CSSBuy.'),
        ('Guia de fotos QC CSSBuy: o que verificar antes do envio', 'Use fotos QC para verificar detalhes, tamanho, defeitos, acessórios, embalagem e riscos antes do envio.')
    ]
}

data['articles'] = {'en': articles_en}
for lang, pairs in localized.items():
    arr = []
    for base, (title, excerpt) in zip(articles_en, pairs):
        item = dict(base)
        item['title'] = title
        item['excerpt'] = excerpt
        arr.append(item)
    data['articles'][lang] = arr

new_json = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
html = html[:m.start(1)] + new_json + html[m.end(1):]

home_m = re.search(r'function home\(\) \{(.*?)function guides\(\) \{', html, re.S)
if not home_m:
    raise SystemExit('Could not isolate home')
home_block = home_m.group(1).replace('SITE_DATA.articles[currentLang].map', 'SITE_DATA.articles[currentLang].slice(0,3).map', 1)
home_block = home_block.replace('<a class="outline-link" href="/blog/">${u.viewAll}</a>', '<a class="outline-link" href="#" onclick="event.preventDefault();setView(\'guides\')">${u.viewAll}</a>')
html = html[:home_m.start(1)] + home_block + html[home_m.end(1):]

guides_m = re.search(r'function guides\(\) \{(.*?)function article\(\) \{', html, re.S)
if not guides_m:
    raise SystemExit('Could not isolate guides')
guides_block = guides_m.group(1).replace('SITE_DATA.articles[currentLang].slice(0,3).map', 'SITE_DATA.articles[currentLang].map')
html = html[:guides_m.start(1)] + guides_block + html[guides_m.end(1):]
html = html.replace('<a href="/blog/">${pages.blog || \'Blog\'}</a>', '<a href="#" onclick="event.preventDefault();setView(\'guides\')">${pages.blog || \'Blog\'}</a>')

for marker in ['category-grid', 'product-grid', 'featured-products', 'function home()', 'function guides()', "setView('guides')", 'cssbuy-transaction-guide-2026', 'spreadsheet', 'shipping', 'qc']:
    if marker not in html:
        raise SystemExit('Safety stop missing ' + marker)

p.write_text(html, encoding='utf-8')
print('Forced four long guides with exact article count:', {k: len(v) for k, v in data['articles'].items()})
