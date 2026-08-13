# SuperbuyVIP.net deployment package

This folder is ready for static hosting. The website requires no build command.

## GitHub Pages

1. Upload every file and the `assets` folder to the repository root.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, choose the branch and `/ (root)`.
4. Keep the included `CNAME` file when using `superbuyvip.net`.

## Cloudflare Pages

1. Upload this folder or connect the repository containing these files.
2. Framework preset: **None**.
3. Build command: leave empty.
4. Output directory: `.` when these files are at the repository root.

## Included files

- `index.html`: complete website and interactions.
- `404.html`: fallback page for static hosts.
- `favicon.ico`, `favicon.png`, `site.webmanifest`: browser and search favicon support.
- `robots.txt`, `sitemap.xml`: crawler discovery files.
- `CNAME`: GitHub Pages custom domain.
- `_headers`, `_redirects`: Cloudflare Pages configuration.
- `assets/`: logo and app icons.

Product images are loaded from `kakobuymake.com`; all product and category buttons retain their main-site destinations.
