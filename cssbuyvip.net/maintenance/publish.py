from pathlib import Path
import re

REPO_ROOT = Path(__file__).resolve().parents[2]
SITE_ROOT = REPO_ROOT / "cssbuyvip.net"
DATE = "2026-08-05"
SLUG = "cssbuy-reverse-purchasing-guide-2026"


def update_homepage() -> None:
    path = SITE_ROOT / "index.html"
    html = path.read_text(encoding="utf-8")

    html = re.sub(
        r'<meta name="cssbuyvip-build" content="[^"]+">',
        '<meta name="cssbuyvip-build" content="2026-08-05-reverse-purchasing-guide">',
        html,
        count=1,
    )

    latest_cards = '''<article class="guide card">
  <a href="guides/cssbuy-reverse-purchasing-guide-2026/">
    <div class="guide-image"><img src="assets/images/guides/reverse-purchasing.svg" alt="CSSBuy Reverse Purchasing Guide"></div>
    <div class="guide-body"><small>Reverse Purchasing • Updated August 2026 • 1,769 words • 11 min read</small><h3>CSSBuy Reverse Purchasing Guide 2026: The Two-Checkout Workflow</h3><p>A reverse purchase is not one checkout. It is a controlled sequence of acquisition, warehouse verification and parcel release. This guide shows how to keep every decision connected…</p><span class="read-more">Read Full Article →</span></div>
  </a>
</article>

<article class="guide card">
  <a href="guides/cssbuy-qc-photos-guide-2026/">
    <div class="guide-image"><img src="assets/images/guides/qc.webp" alt="QC Photos Guide"></div>
    <div class="guide-body"><small>Quality Control • Updated July 2026 • 1,798 words • 11 min read</small><h3>CSSBuy QC Photos Guide 2026: A Warehouse Risk-Control Workflow</h3><p>Most buyers treat warehouse photos as a quick thumbs-up or thumbs-down moment. That is the wrong mental model. A CSSBuy quality-control review is better understood as a s…</p><span class="read-more">Read Full Article →</span></div>
  </a>
</article>

<article class="guide card">
  <a href="guides/cssbuy-spreadsheet-guide-2026/">
    <div class="guide-image"><img src="assets/images/guides/w2c.webp" alt="Spreadsheet Guide"></div>
    <div class="guide-body"><small>Spreadsheet Strategy • Updated July 2026 • 1,735 words • 10 min read</small><h3>CSSBuy Spreadsheet Guide 2026: From W2C Link to Controlled Purchase</h3><p>A spreadsheet is often presented as a shortcut: open a row, copy a link, buy the item. That description is convenient but incomplete. A useful CSSBuy spreadsheet is not a…</p><span class="read-more">Read Full Article →</span></div>
  </a>
</article>'''

    pattern = re.compile(
        r'(<section id="guides"><div class="container"><div class="section-title">.*?</div><div class="guides">\s*).*?(\s*</div><div class="view-all">)',
        re.DOTALL,
    )
    html, replacements = pattern.subn(r'\1' + latest_cards + r'\2', html, count=1)
    if replacements != 1:
        raise RuntimeError("Could not locate the homepage Latest Buyer Guides block")

    path.write_text(html, encoding="utf-8")


def update_sitemap() -> None:
    path = SITE_ROOT / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")

    xml = re.sub(
        r'(<loc>https://cssbuyvip\.net/</loc><lastmod>)[^<]+',
        rf'\g<1>{DATE}',
        xml,
        count=1,
    )
    xml = re.sub(
        r'(<loc>https://cssbuyvip\.net/buyer-guides/</loc><lastmod>)[^<]+',
        rf'\g<1>{DATE}',
        xml,
        count=1,
    )

    article_url = f"https://cssbuyvip.net/guides/{SLUG}/"
    if article_url not in xml:
        entry = (
            f'  <url><loc>{article_url}</loc><lastmod>{DATE}</lastmod>'
            '<changefreq>weekly</changefreq><priority>0.9</priority></url>\n'
        )
        marker = re.search(
            r'(  <url><loc>https://cssbuyvip\.net/buyer-guides/</loc>.*?</url>\n)',
            xml,
        )
        if not marker:
            raise RuntimeError("Could not locate the buyer-guides sitemap entry")
        xml = xml[: marker.end()] + entry + xml[marker.end() :]

    path.write_text(xml, encoding="utf-8")


if __name__ == "__main__":
    update_homepage()
    update_sitemap()
    print("CSSBuyVIP reverse purchasing guide publication files updated.")
