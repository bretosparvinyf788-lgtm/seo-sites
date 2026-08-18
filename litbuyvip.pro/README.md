# LitBuyVIP Pro deployment package

Static, build-free deployment package for `https://litbuyvip.pro/`.

## Deploy

Publish the complete `litbuyvip.pro` directory as the site root. No package
installation or build command is required.

## Structure

- `index.html` — optimized English homepage
- `spreadsheet/` — crawlable current product preview
- `guides/` — guide archive and four independent long-form articles
- `es/`, `de/`, `fr/`, `pt/`, `it/`, `pl/`, `zh/` — localized landing pages
- `assets/` — cacheable styles, scripts, logos, product images and article art
- `favicon.png`, `favicon.ico`, `apple-touch-icon.png` — stable site icons
- `robots.txt`, `sitemap.xml` — crawler discovery files
- `_headers`, `_redirects` — Cloudflare Pages headers and canonical redirects

The `www` hostname rule is included in `_redirects`. The custom domain must also
be attached to the same Cloudflare Pages project so requests reach this rule.
