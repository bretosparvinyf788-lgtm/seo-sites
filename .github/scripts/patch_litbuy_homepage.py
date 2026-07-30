from hashlib import sha256
from pathlib import Path
import re

homepage = Path("litbuyvip.shop/index.html")
asset = Path("litbuyvip.shop/assets/latest-guides.js")

html = homepage.read_text(encoding="utf-8")
version = sha256(asset.read_bytes()).hexdigest()[:12]
tag = f'<script src="/assets/latest-guides.js?v={version}" defer></script>'

pattern = re.compile(
    r'\s*<script src="/assets/latest-guides(?:-\d{8})?\.js(?:\?v=[^"]+)?" defer></script>\s*'
)
html = pattern.sub("\n", html)

if "</body>" not in html:
    raise SystemExit("litbuyvip.shop/index.html has no closing body tag")

html = html.replace("</body>", f"  {tag}\n</body>", 1)
homepage.write_text(html, encoding="utf-8")
