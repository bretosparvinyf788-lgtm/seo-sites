from pathlib import Path
import re

p = Path('cssbuyvip/index.html')
html = p.read_text(encoding='utf-8')
original = html

core_missing = [m for m in ['function header()', 'function footer()', 'brand', '</head>', '</style>', 'category-grid', 'product-grid', 'featured-products'] if m not in html]
if core_missing:
    raise SystemExit('Safety stop: missing markers: ' + ', '.join(core_missing))

favicon = '''\n<link rel="icon" type="image/svg+xml" href="/assets/cssbuy-logo.svg">\n<link rel="shortcut icon" href="/assets/cssbuy-logo.svg">\n<link rel="apple-touch-icon" href="/assets/cssbuy-logo.svg">\n'''
if '/assets/cssbuy-logo.svg' not in html.split('</head>')[0]:
    html = html.replace('</head>', favicon + '</head>', 1)

inline_logo = '''<svg class="brand-inline-logo" xmlns="http://www.w3.org/2000/svg" width="145" height="39" viewBox="0 0 145 39" role="img" aria-label="CSS Buy"><rect x="0" y="0" width="72" height="39" rx="4" fill="#65bd25"/><text x="8" y="28" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="900" fill="#ffffff">CSS</text><text x="78" y="29" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" font-style="italic" fill="#65bd25">Buy</text></svg>'''

force_css = '''\n/* CSSBuy header logo - inline forced visible */\n.brand{display:flex!important;align-items:center!important;gap:12px!important;min-width:145px!important}\n.brand .mark.logo-mark{width:145px!important;height:39px!important;min-width:145px!important;min-height:39px!important;border-radius:0!important;background:transparent!important;color:inherit!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;box-shadow:none!important;padding:0!important;overflow:visible!important}\n.brand-inline-logo{display:block!important;width:145px!important;height:39px!important;opacity:1!important;visibility:visible!important;overflow:visible!important}\n.brand .brand-text{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}\n.footer-brand .brand-inline-logo{width:145px!important;height:39px!important}\n@media(max-width:760px){.brand{min-width:126px!important}.brand .mark.logo-mark{width:126px!important;height:34px!important;min-width:126px!important;min-height:34px!important}.brand-inline-logo{width:126px!important;height:34px!important}.footer-brand .brand-inline-logo{width:126px!important;height:34px!important}}\n'''
if 'CSSBuy header logo - inline forced visible' not in html:
    html = html.replace('</style>', force_css + '\n</style>', 1)

new_a = '<a class="brand" href="#home" onclick="event.preventDefault();setView(\'home\')"><span class="mark logo-mark">' + inline_logo + '</span><span class="brand-text">CSSBuyVip</span></a>'
new_div = '<div class="brand"><span class="mark logo-mark">' + inline_logo + '</span><span class="brand-text">CSSBuyVip</span></div>'

html = re.sub(r'<a class="brand" href="(?:#|#home)" onclick="event\.preventDefault\(\);setView\(\'home\'\)"><span class="mark(?: logo-mark)?">(?:CSS|<img class="brand-logo-img" src="/assets/cssbuy-logo\.svg" alt="CSS Buy">|<svg.*?</svg>)</span><span(?: class="brand-text")?>CSSBuyVip</span></a>', new_a, html, flags=re.S)
html = re.sub(r'<a class="brand" href="#" onclick="event\.preventDefault\(\);setView\(\'home\'\)"><span class="mark(?: logo-mark)?">(?:CSS|<img class="brand-logo-img" src="/assets/cssbuy-logo\.svg" alt="CSS Buy">|<svg.*?</svg>)</span><span(?: class="brand-text")?>CSSBuyVip</span></a>', new_a, html, flags=re.S)
html = re.sub(r'<div class="brand"><span class="mark(?: logo-mark)?">(?:CSS|<img class="brand-logo-img" src="/assets/cssbuy-logo\.svg" alt="CSS Buy">|<svg.*?</svg>)</span><span(?: class="brand-text")?>CSSBuyVip</span></div>', new_div, html, flags=re.S)

for marker in ['brand-inline-logo', 'CSSBuy header logo - inline forced visible', 'category-grid', 'product-grid', 'featured-products', 'function header()', 'function home()']:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Applied inline CSSBuy logo to header/footer/favicon through existing workflow')
else:
    print('No changes needed')
