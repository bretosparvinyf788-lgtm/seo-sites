# litbuyqcnotes.com

Complete Litbuy QC Notes website. Default language: English. Current edition includes 24 languages, 12 homepage products, ten live main-site categories, independent product details, seller images above separate QC references, saved products, recent visits and local QC notes. The illustrated beginner guide contains eight permanently visible steps and 11 original interface screenshots. The homepage has a compact text hero and a guide entry above ten independently collapsible FAQs. No SEO article feed is included.

## Data and destinations

Products, original item IDs and QC references come from https://kakobuymake.com. Category inventory and nonfeatured details load from that source at runtime. Captured source fixtures are reference fallbacks with explicit outage messages, not a stock guarantee. No independent product database is used.

Registration: https://litbuy.com/register?inviteCode=E32JME4UQ

Purchases use the matching item ID: `https://litbuy.com/product/2/<itemId>?inviteCode=7N6D4Y6EE`.

Saved products, recent history and personal notes remain in the visitor’s browser, under `litbuyqcnotes:*`; these are not an official shopping cart or inspection approval. Currency prices are estimates; checkout is on Litbuy.

## Cloudflare Pages / GitHub deployment

- Repository: `bretosparvinyf788-lgtm/seo-sites`, branch `main`.
- Project directory: `litbuyqcnotes.com`.
- Build command: `npm run build:pages`.
- Output directory: `dist`.
- Public domain: https://litbuyqcnotes.com; `www` and HTTP redirect to HTTPS apex.

`build:pages` rebuilds the original Worker, extracts all 73 original image assets into native static files, and emits a small advanced-mode `_worker.js`, `_headers` and `_routes.json`. Live category fetching, seller-gallery validation, multilingual pages, original images and local-storage behavior are retained. No dependency installation is required. The generated `worker/index.js` is reproducible from `src`, scripts and fixtures; it is omitted from the external source export to avoid duplicating embedded images.

## Verification

```sh
node scripts/assemble.mjs
node scripts/check.mjs
node scripts/check-sheet.mjs
node scripts/check-retention.mjs
node scripts/check-locales.mjs
node scripts/check-beginner.mjs
npm run build:pages
node scripts/check-pages.mjs
```

Checks cover 24 languages, complete guide content, all 11 guide images, native step anchors, 648 sitemap URLs, product/category links, source outage behavior, saved/currency/history/note controls, HTTPS redirects and static-asset MIME types. Canonical URLs and hreflang follow the served origin. Private preview and Pages preview hosts remain noindex; only the exact custom domain is indexable. Saved pages and error responses are not indexed.

The retained `.openai/hosting.json` identifies the separate private Sites preview and does not contain credentials. `npm run build` continues to build that preview artifact; `build:pages` is the external Cloudflare target. Keep domain verification codes and the site’s dedicated Analytics measurement in the source when configured; never add account credentials.

## Dedicated Analytics

GA4 measurement: `G-9HK1RS4WJZ`, web stream `16156581128` in the VIP Sites Analytics account. The tag is emitted only on the canonical public origin, so private development and Pages preview traffic are not sent to the public site’s property. No credentials, visitor notes or order data are embedded in the tag.
