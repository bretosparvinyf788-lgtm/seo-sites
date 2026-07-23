# sugargoovip.shop

Production static website for SugargooVIP.

Cloudflare Pages build settings:

- Root directory: `sugargoovip.shop`
- Build command: `rm -rf dist && mkdir -p dist && python3 -c "import tarfile; tarfile.open('site.tar.gz').extractall('dist')"`
- Build output directory: `dist`
- Production branch: `main`

The production archive contains the homepage, product catalog, buyer guides, SEO metadata, sitemap, robots.txt, favicon, responsive styles and scripts.
