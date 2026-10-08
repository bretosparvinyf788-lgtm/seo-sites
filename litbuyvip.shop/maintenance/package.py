#!/usr/bin/env python3
"""Publish only generated pages and assets, using the Python standard library."""
from pathlib import Path
import shutil
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
out=root/'dist'
languages=['zh','es','fr','de','pt','ja','ko','ar']
pages=[root/'index.html',*sorted((root/'guides').glob('*.html'))]
for lang in languages:
    pages.extend([root/lang/'index.html',*sorted((root/lang/'guides').glob('*.html'))])
assert len(pages)==189, f'Expected 189 generated pages; got {len(pages)}'
for page in pages:
    content=page.read_text()
    assert '<h1' in content and 'rel="canonical"' in content, str(page)
    assert 'G-4PTG8H4RH6' in content, str(page)
assert len(ET.parse(root/'sitemap.xml').findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url'))==189
if out.exists():shutil.rmtree(out)
out.mkdir()
for name in ['index.html','404.html','assets','guides',*languages,'robots.txt','sitemap.xml','_redirects','_headers']:
    source=root/name;target=out/name
    if source.is_dir():shutil.copytree(source,target)
    else:shutil.copy2(source,target)
print('Packaged 189 pages; editorial sources and maintenance scripts excluded.')
