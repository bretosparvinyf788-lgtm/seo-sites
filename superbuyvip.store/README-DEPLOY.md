# superbuyvip.store deployment package

This folder is a complete static website. No build command, database, API key,
or server-side runtime is required.

## Included files

- `index.html` — the complete production homepage, including all seven languages,
  ten featured products, tools, FAQs, and links to three independent buyer-guide pages.
- `guides/` — an indexable guide library plus three standalone long-form article pages.
- `assets/guide.css` — shared styles for the article library.
- `404.html` — lightweight noindex error page; it is not a duplicate of the homepage.
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
5. Enable **Enforce HTTPS**. Point `www` to the Pages hostname and configure a permanent redirect from `www.superbuyvip.store/*` to `https://superbuyvip.store/:splat` at the DNS/CDN layer.

## Cloudflare Pages

1. Connect the repository or use Direct Upload.
2. Leave the build command empty.
3. Set the output directory to the repository root (`.`).
4. Add both `superbuyvip.store` and `www.superbuyvip.store` under Custom Domains.
5. Create a Cloudflare Bulk Redirect with status **301** from `https://www.superbuyvip.store/*` to `https://superbuyvip.store/:splat`, preserving the path and query string.
6. Enable **Always Use HTTPS** for the zone.

## Other static hosts

Upload the contents of this folder as the site root. The host must serve
`index.html` for `/`. The page is self-contained and does not require the
source project or `node_modules`.

