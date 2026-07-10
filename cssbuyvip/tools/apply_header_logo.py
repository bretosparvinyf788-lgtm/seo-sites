from pathlib import Path
import re

p = Path('cssbuyvip/index.html')
html = p.read_text(encoding='utf-8')
original = html

core_missing = [m for m in ['function header()', 'function footer()', 'brand', '</head>', '</style>'] if m not in html]
if core_missing:
    raise SystemExit('Safety stop: missing markers: ' + ', '.join(core_missing))

favicon = '''\n<link rel="icon" type="image/svg+xml" href="/assets/cssbuy-logo.svg">\n<link rel="shortcut icon" href="/assets/cssbuy-logo.svg">\n<link rel="apple-touch-icon" href="/assets/cssbuy-logo.svg">\n'''
if '/assets/cssbuy-logo.svg' not in html.split('</head>')[0]:
    html = html.replace('</head>', favicon + '</head>', 1)

force_css = '''\n/* CSSBuy header logo - forced visible */\n.brand{display:flex!important;align-items:center!important;gap:12px!important}\n.brand .mark.logo-mark{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;border-radius:0!important;background:transparent!important;color:inherit!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:none!important;padding:0!important}\n.brand-logo-img{display:block!important;height:39px!important;width:auto!important;max-width:145px!important;min-width:145px!important;object-fit:contain!important;opacity:1!important;visibility:visible!important}\n.brand .brand-text{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}\n.footer-brand .brand-logo-img{height:39px!important}\n@media(max-width:760px){.brand-logo-img{height:34px!important;max-width:126px!important;min-width:126px!important}.footer-brand .brand-logo-img{height:34px!important}}\n'''
if 'CSSBuy header logo - forced visible' not in html:
    html = html.replace('</style>', force_css + '\n</style>', 1)

new_a = '<a class="brand" href="#home" onclick="event.preventDefault();setView(\'home\')"><span class="mark logo-mark"><img class="brand-logo-img" src="/assets/cssbuy-logo.svg" alt="CSS Buy"></span><span class="brand-text">CSSBuyVip</span></a>'
new_div = '<div class="brand"><span class="mark logo-mark"><img class="brand-logo-img" src="/assets/cssbuy-logo.svg" alt="CSS Buy"></span><span class="brand-text">CSSBuyVip</span></div>'

html = re.sub(r'<a class="brand" href="(?:#|#home)" onclick="event\.preventDefault\(\);setView\(\'home\'\)"><span class="mark(?: logo-mark)?">(?:CSS|<img class="brand-logo-img" src="/assets/cssbuy-logo\.svg" alt="CSS Buy">)</span><span(?: class="brand-text")?>CSSBuyVip</span></a>', new_a, html)
html = re.sub(r'<a class="brand" href="#" onclick="event\.preventDefault\(\);setView\(\'home\'\)"><span class="mark(?: logo-mark)?">(?:CSS|<img class="brand-logo-img" src="/assets/cssbuy-logo\.svg" alt="CSS Buy">)</span><span(?: class="brand-text")?>CSSBuyVip</span></a>', new_a, html)
html = re.sub(r'<div class="brand"><span class="mark(?: logo-mark)?">(?:CSS|<img class="brand-logo-img" src="/assets/cssbuy-logo\.svg" alt="CSS Buy">)</span><span(?: class="brand-text")?>CSSBuyVip</span></div>', new_div, html)

for marker in ['/assets/cssbuy-logo.svg', 'brand-logo-img', 'CSSBuy header logo - forced visible', 'category-grid', 'product-grid', 'featured-products', 'function header()', 'function home()']:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Forced CSSBuy logo visibility in header/footer/favicon')
else:
    print('No changes needed')