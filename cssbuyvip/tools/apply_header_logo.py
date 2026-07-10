from pathlib import Path
import re

p = Path('cssbuyvip/index.html')
html = p.read_text(encoding='utf-8')
original = html

required = ['function header()', 'function footer()', 'brand', '</head>', 'cssbuyvip/assets/cssbuy-logo.svg']
# The logo file marker may not exist in html yet, so check core markers separately.
core_missing = [m for m in ['function header()', 'function footer()', 'brand', '</head>'] if m not in html]
if core_missing:
    raise SystemExit('Safety stop: missing markers: ' + ', '.join(core_missing))

# Add favicon / apple icon links before </head>.
favicon = '''\n<link rel="icon" type="image/svg+xml" href="/assets/cssbuy-logo.svg">\n<link rel="shortcut icon" href="/assets/cssbuy-logo.svg">\n<link rel="apple-touch-icon" href="/assets/cssbuy-logo.svg">\n'''
if '/assets/cssbuy-logo.svg' not in html.split('</head>')[0]:
    html = html.replace('</head>', favicon + '</head>', 1)

# Add logo CSS without disturbing existing layout.
logo_css = '''\n/* CSSBuy brand logo */\n.brand-logo-img{height:39px;width:auto;display:block;object-fit:contain}\n.brand .mark.logo-mark{width:auto;height:auto;border-radius:0;background:transparent;color:inherit;display:flex;place-items:unset}\n.brand .brand-text{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}\n.footer-brand .brand-logo-img{height:39px}\n@media(max-width:760px){.brand-logo-img{height:34px}.footer-brand .brand-logo-img{height:34px}}\n'''
if 'brand-logo-img' not in html:
    html = html.replace('</style>', logo_css + '\n</style>', 1)

# Replace visible brand markup variants in header/footer.
old_variants = [
    '<div class="brand"><span class="mark">CSS</span><span>CSSBuyVip</span></div>',
    '<a class="brand" href="#" onclick="event.preventDefault();setView(\'home\')"><span class="mark">CSS</span><span>CSSBuyVip</span></a>',
    '<a class="brand" href="#home" onclick="event.preventDefault();setView(\'home\')"><span class="mark">CSS</span><span>CSSBuyVip</span></a>',
]
new_div = '<div class="brand"><span class="mark logo-mark"><img class="brand-logo-img" src="/assets/cssbuy-logo.svg" alt="CSS Buy"></span><span class="brand-text">CSSBuyVip</span></div>'
new_a = '<a class="brand" href="#home" onclick="event.preventDefault();setView(\'home\')"><span class="mark logo-mark"><img class="brand-logo-img" src="/assets/cssbuy-logo.svg" alt="CSS Buy"></span><span class="brand-text">CSSBuyVip</span></a>'

for old in old_variants:
    if old.startswith('<div'):
        html = html.replace(old, new_div)
    else:
        html = html.replace(old, new_a)

# Regex fallback for minified header/footer brand snippets.
html = re.sub(r'<a class="brand" href="#" onclick="event\.preventDefault\(\);setView\(\'home\'\)"><span class="mark">CSS</span><span>CSSBuyVip</span></a>', new_a, html)
html = re.sub(r'<a class="brand" href="#home" onclick="event\.preventDefault\(\);setView\(\'home\'\)"><span class="mark">CSS</span><span>CSSBuyVip</span></a>', new_a, html)
html = re.sub(r'<div class="brand"><span class="mark">CSS</span><span>CSSBuyVip</span></div>', new_div, html)

# Safety: ensure logo is present and critical page sections remain.
for marker in ['/assets/cssbuy-logo.svg', 'category-grid', 'product-grid', 'featured-products', 'function header()', 'function home()']:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Applied CSSBuy logo to header/footer and favicon')
else:
    print('No changes needed')
