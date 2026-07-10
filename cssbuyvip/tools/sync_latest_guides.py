from pathlib import Path
import re

p = Path('cssbuyvip/index.html')
html = p.read_text(encoding='utf-8')
original = html

core_markers = ['function header()', 'function footer()', '</head>', '</style>', 'category-grid', 'product-grid', 'featured-products']
missing = [m for m in core_markers if m not in html]
if missing:
    raise SystemExit('Safety stop: missing markers: ' + ', '.join(missing))

logo_path = '/assets/cssbuy-logo.svg'

# Add browser tab favicon links so the logo appears at the front of the webpage/tab.
favicon_block = '''
<link rel="icon" type="image/svg+xml" href="/assets/cssbuy-logo.svg">
<link rel="shortcut icon" href="/assets/cssbuy-logo.svg">
<link rel="apple-touch-icon" href="/assets/cssbuy-logo.svg">
'''
head_part = html.split('</head>', 1)[0]
if logo_path not in head_part:
    html = html.replace('</head>', favicon_block + '</head>', 1)

# Add compact logo CSS. Keep the original header layout, only change the brand mark.
logo_css = '''
/* CSSBuy header logo */
.brand-logo-img{height:39px;width:auto;display:block;object-fit:contain}
.brand .mark.logo-mark{width:auto;height:auto;border-radius:0;background:transparent;color:inherit;display:flex;place-items:unset}
.brand .brand-text{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.footer-brand .brand-logo-img{height:39px}
@media(max-width:760px){.brand-logo-img{height:34px}.footer-brand .brand-logo-img{height:34px}}
'''
if 'brand-logo-img' not in html:
    html = html.replace('</style>', logo_css + '\n</style>', 1)

brand_img = '<span class="mark logo-mark"><img class="brand-logo-img" src="/assets/cssbuy-logo.svg" alt="CSS Buy"></span><span class="brand-text">CSSBuyVip</span>'

# Replace header/footer old text logo variants.
html = html.replace('<span class="mark">CSS</span><span>CSSBuyVip</span>', brand_img)
html = html.replace('<span class="mark">CSS</span><span>CSSBuyVip</span>', brand_img)

# Regex fallback for minified / slightly varied brand snippets.
html = re.sub(r'<span class="mark">CSS</span>\s*<span>CSSBuyVip</span>', brand_img, html)

# Safety checks.
for marker in [logo_path, 'brand-logo-img', 'category-grid', 'product-grid', 'featured-products', 'function home()', 'function header()']:
    if marker not in html:
        raise SystemExit('Safety stop after edit: missing marker ' + marker)

if html != original:
    p.write_text(html, encoding='utf-8')
    print('Applied CSSBuy logo to header/footer and favicon')
else:
    print('No changes needed')
