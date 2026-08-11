# LitBuyVIP Pro deployment package

This folder is ready for a static deployment on Cloudflare Pages, GitHub Pages,
Netlify, or another static host.

## Deploy

Upload every file in this folder to the root of the website repository or static
hosting project. No build command is required. If the platform asks for an output
directory, choose the repository root (`.`).

## Included

- `index.html` — complete self-contained website
- `robots.txt` — crawler access rules
- `sitemap.xml` — canonical sitemap for `https://litbuyvip.pro/`
- `_headers` — recommended Cloudflare Pages response headers
- `_redirects` — redirects `/index.html` to the canonical homepage

The website images, favicon, styling, scripts, multilingual content, buyer-guide
list, and three full articles are embedded in `index.html`, so no asset folder or
package installation is required.
