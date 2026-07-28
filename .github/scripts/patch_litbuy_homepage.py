from pathlib import Path

homepage = Path("litbuyvip.shop/index.html")
html = homepage.read_text(encoding="utf-8")
tag = '<script src="/assets/latest-guides-20260728.js?v=20260728" defer></script>'

if tag not in html:
    if "</body>" not in html:
        raise SystemExit("litbuyvip.shop/index.html has no closing body tag")
    html = html.replace("</body>", f"  {tag}\n</body>", 1)
    homepage.write_text(html, encoding="utf-8")
