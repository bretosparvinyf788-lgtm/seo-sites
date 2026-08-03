# LitBuyVIP production website

Production-ready static site for **https://litbuyvip.net/**.

## Included

- Responsive homepage with 120 product records, category filters, pagination, QC finder, shipping tools and multilingual UI
- Independent crawlable Buyer Guides archive and three long-form English articles
- `robots.txt`, `sitemap.xml`, canonical URLs, Open Graph metadata, structured data and a custom 404 page
- Cloudflare Pages `_headers` and `_redirects`
- PWA manifest, icons, `.nojekyll`, Git attributes and deployment checklist

## GitHub

Upload the contents of this folder to the root of the repository and commit to `main`.

Command-line example:

```bash
git init
git add .
git commit -m "Deploy LitBuyVIP production site"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

## Cloudflare Pages

Connect the GitHub repository to Cloudflare Pages.

- Production branch: `main`
- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/` (repository root)
- Custom domain: `litbuyvip.net`

The `_headers` file prevents `*.pages.dev` preview URLs from being indexed while allowing the custom production domain to be indexed.

## Google Search Console

1. Add `litbuyvip.net` as a Domain property and complete DNS verification, or use a URL-prefix property.
2. Verify these URLs after deployment:
   - `https://litbuyvip.net/robots.txt`
   - `https://litbuyvip.net/sitemap.xml`
3. Submit `https://litbuyvip.net/sitemap.xml` in Search Console.
4. Inspect the homepage and the three article URLs and request indexing after the live deployment is confirmed.

## Important

The site links to product images and product detail pages on `kakobuymake.com`. Confirm that those URLs remain available before each production release.
