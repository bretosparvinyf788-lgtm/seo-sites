from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "cssbuyvip.com"
DATE = "2026-08-05"
SLUG = "cssbuy-clothing-size-verification-workflow-2026"
URL = f"https://cssbuyvip.com/guides/{SLUG}/"


def write_if_changed(path: Path, text: str) -> bool:
    current = path.read_text(encoding="utf-8")
    if current == text:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def patch_homepage() -> bool:
    path = SITE / "index.html"
    text = path.read_text(encoding="utf-8")

    latest_cards = """<div class=\"article-list\">\n        <a class=\"article\" href=\"/guides/cssbuy-clothing-size-verification-workflow-2026/\"><small>Sizing Guide</small><b>CSSBuy Clothing Size Verification Workflow 2026: From Seller Chart to Warehouse Measurements</b><span>Compare a reference garment, seller chart, warehouse tag and key measurements before approving, exchanging or returning clothing.</span></a>\n        <a class=\"article\" href=\"/guides/cssbuy-delivery-day-evidence-protocol-2026/\"><small>Parcel Evidence</small><b>CSSBuy Delivery-Day Evidence Protocol 2026</b><span>Record the unopened carton, opening sequence and item count before reporting missing or damaged parcel contents.</span></a>\n        <a class=\"article\" href=\"/guides/cssbuy-restricted-item-route-filter-2026/\"><small>Route Planning</small><b>CSSBuy Restricted Item Route Filter 2026</b><span>Filter batteries, liquids, powders, branded goods and unknown materials before they restrict an entire parcel.</span></a>\n      </div>"""

    section_start = text.find('<section id="articles"')
    if section_start == -1:
        raise RuntimeError("Homepage article section not found")
    list_start = text.find('<div class="article-list">', section_start)
    if list_start == -1:
        raise RuntimeError("Homepage article list not found")
    list_end = text.find('</div>', list_start)
    if list_end == -1:
        raise RuntimeError("Homepage article list closing tag not found")
    list_end += len('</div>')
    text = text[:list_start] + latest_cards + text[list_end:]

    marker = "SEO_LATEST_PATCH_20260805"
    if marker not in text:
        patch_script = r'''
<script id="SEO_LATEST_PATCH_20260805">
(function(){
  const latest = [
    {href:'/guides/cssbuy-clothing-size-verification-workflow-2026/', tag:'Sizing Guide', title:'CSSBuy Clothing Size Verification Workflow 2026: From Seller Chart to Warehouse Measurements', desc:'Compare a reference garment, seller chart, warehouse tag and key measurements before approving, exchanging or returning clothing.'},
    {href:'/guides/cssbuy-delivery-day-evidence-protocol-2026/', tag:'Parcel Evidence', title:'CSSBuy Delivery-Day Evidence Protocol 2026', desc:'Record the unopened carton, opening sequence and item count before reporting missing or damaged parcel contents.'},
    {href:'/guides/cssbuy-restricted-item-route-filter-2026/', tag:'Route Planning', title:'CSSBuy Restricted Item Route Filter 2026', desc:'Filter batteries, liquids, powders, branded goods and unknown materials before they restrict an entire parcel.'}
  ];
  function applyLatest(){
    document.querySelectorAll('#articles .article').forEach(function(card,i){
      const item=latest[i]; if(!item) return;
      card.setAttribute('href',item.href);
      const small=card.querySelector('small'), title=card.querySelector('b'), desc=card.querySelector('span');
      if(small) small.textContent=item.tag;
      if(title) title.textContent=item.title;
      if(desc) desc.textContent=item.desc;
    });
    const viewAll=document.querySelector('#articles .view-all-btn');
    if(viewAll) viewAll.setAttribute('href','/all-seo-articles/');
  }
  document.addEventListener('DOMContentLoaded',function(){
    [0,80,250,800].forEach(function(ms){setTimeout(applyLatest,ms)});
    document.querySelectorAll('.langs a,.lang-switch a').forEach(function(a){
      a.addEventListener('click',function(){setTimeout(applyLatest,120)});
    });
  });
})();
</script>
'''
        text = text.replace('</body>', patch_script + '\n</body>', 1)

    return write_if_changed(path, text)


def patch_archive() -> bool:
    path = SITE / "all-seo-articles" / "index.html"
    text = path.read_text(encoding="utf-8")
    card = '<a class="card" href="/guides/cssbuy-clothing-size-verification-workflow-2026/"><span class="date">August 5, 2026</span><h2>CSSBuy Clothing Size Verification Workflow 2026</h2><p>Compare seller charts, reference garments, warehouse tags and key measurements before approving, exchanging or returning clothing.</p></a>\n'
    if SLUG not in text:
        anchor = '<section class="grid wrap">\n'
        if anchor not in text:
            raise RuntimeError("Archive grid not found")
        text = text.replace(anchor, anchor + card, 1)
    text = text.replace('delivery evidence, restricted items, Ship For Me, Buy For Me, returns, seller communication, fees, shipping, QC and warehouse decisions.', 'clothing sizing, delivery evidence, restricted items, Ship For Me, Buy For Me, returns, fees, shipping, QC and warehouse decisions.')
    return write_if_changed(path, text)


def patch_guides_index() -> bool:
    path = SITE / "guides" / "index.html"
    text = path.read_text(encoding="utf-8")
    card = '<a class="card" href="/guides/cssbuy-clothing-size-verification-workflow-2026/"><small>Clothing Sizing</small><h2>CSSBuy Clothing Size Verification Workflow 2026</h2><p>Compare seller charts with warehouse tags and measurements before approving, exchanging or returning clothing.</p><span class="read">Read guide →</span></a>\n'
    if SLUG not in text:
        anchor = '<section class="grid">\n'
        if anchor not in text:
            raise RuntimeError("Guides grid not found")
        text = text.replace(anchor, anchor + card, 1)
    if '<a href="/all-seo-articles/">All Articles</a>' not in text:
        text = text.replace('<div class="links">', '<div class="links"><a href="/all-seo-articles/">All Articles</a>', 1)
    return write_if_changed(path, text)


def patch_sitemap() -> bool:
    path = SITE / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    for loc in [
        'https://cssbuyvip.com/',
        'https://cssbuyvip.com/guides/',
        'https://cssbuyvip.com/all-seo-articles/'
    ]:
        pattern = re.compile(rf'(<url><loc>{re.escape(loc)}</loc><lastmod>)([^<]+)(</lastmod></url>)')
        text = pattern.sub(rf'\g<1>{DATE}\g<3>', text)
    entry = f'  <url><loc>{URL}</loc><lastmod>{DATE}</lastmod></url>\n'
    if URL not in text:
        text = text.replace('</urlset>', entry + '</urlset>')
    return write_if_changed(path, text)


changed = []
for name, fn in [
    ("homepage", patch_homepage),
    ("article archive", patch_archive),
    ("guides index", patch_guides_index),
    ("sitemap", patch_sitemap),
]:
    if fn():
        changed.append(name)

print("Updated: " + (", ".join(changed) if changed else "nothing; already current"))
