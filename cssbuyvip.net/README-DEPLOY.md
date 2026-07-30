# cssbuyvip.net — GitHub / Cloudflare Pages / GSC package

This folder is deployment-ready static HTML. No build command is required.

## Repository placement

Target repository discussed in the project:
`bretosparvinyf788-lgtm/seo-sites`

Place this complete folder at:
`cssbuyvip.net/`

Commit the folder to the `main` branch when deployment is requested.

## Cloudflare Pages

Recommended settings:

- Framework preset: None
- Build command: leave empty
- Build output directory: `cssbuyvip.net`
- Production branch: `main`
- Custom domain: `cssbuyvip.net`

After deployment, verify:

- `/`
- `/robots.txt`
- `/sitemap.xml`
- `/buyer-guides/`
- all three article URLs
- mobile navigation and language selector

## Google Search Console

When the domain is live:

1. Add a Domain property for `cssbuyvip.net`.
2. Complete the DNS TXT verification supplied by Google.
3. Submit `https://cssbuyvip.net/sitemap.xml`.
4. Inspect the homepage and each guide URL.
5. Request indexing after the live pages return HTTP 200.
6. Check Pages, Core Web Vitals and HTTPS reports after data becomes available.

Do not add a fake Google verification token. Use the exact token generated in the site's GSC property.

## SEO files included

- `robots.txt`
- `sitemap.xml`
- canonical URLs
- Open Graph tags
- Article schema
- FAQPage schema
- WebSite / Organization schema
- `404.html`
- Cloudflare `_headers`
- Cloudflare `_redirects`
- favicon, manifest and Apple touch icon

## Important note

The visible site does not name the external product catalog brand, but selected product-card URLs still open the configured external product pages.
