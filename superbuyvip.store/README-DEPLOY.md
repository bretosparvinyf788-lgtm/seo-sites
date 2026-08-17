# superbuyvip.store deployment package

This folder is a complete static website. No build command, database, API key,
or server-side runtime is required.

## Included files

- `index.html` — the complete production homepage, including all seven languages,
  ten featured products, tools, FAQs, and three full buyer guides.
- `404.html` — fallback copy of the site for static hosts.
- `favicon.svg` — standalone browser icon fallback.
- `robots.txt` and `sitemap.xml` — search-engine discovery files.
- `_headers` — safe response headers for hosts that support this file.
- `.nojekyll` — prevents GitHub Pages from filtering static files.
- `CNAME` — custom-domain declaration for GitHub Pages.

## GitHub Pages

1. Upload every file in this folder to the root of a repository.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/ (root)` folder.
4. Add the DNS records requested by GitHub for `superbuyvip.store`.

## Cloudflare Pages

1. Connect the repository or use Direct Upload.
2. Leave the build command empty.
3. Set the output directory to the repository root (`.`).
4. Add `superbuyvip.store` under Custom Domains.

## Other static hosts

Upload the contents of this folder as the site root. The host must serve
`index.html` for `/`. The page is self-contained and does not require the
source project or `node_modules`.

