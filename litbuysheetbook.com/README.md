# litbuysheetbook.com

Complete source exported from approved preview version 25 on 2026-10-15.

## Cloudflare Pages deployment

- Repository: `bretosparvinyf788-lgtm/seo-sites`
- Production branch: `main`
- Root directory: `litbuysheetbook.com`
- Build command: `npm run build`
- Output directory: `dist`
- Runtime: Node.js 22 for builds; Pages Functions advanced mode.
- No npm dependencies, database or API secrets required.
- Production domains: `litbuysheetbook.com` and `www.litbuysheetbook.com`.
- HTTP and www redirect to `https://litbuysheetbook.com`, preserving paths and query parameters.

The build assembles the Worker, runs 66 route checks, and emits `dist/_worker.js`, `_routes.json`, and a favicon. The Worker handles all routes, including images and dynamic catalog requests. Do not publish the source tree as build output. Generated `worker/` and `dist/` are excluded from Git and are reproducibly built from source and fixtures.

## Complete website

Compact product desk, ten featured products, ten complete categories, standalone details, actual Weidian seller galleries, separate QC references, browser-local saved list/subtotal and recent views, 12-step illustrated beginner guide, and 16 detailed independent FAQs in four topics.

The mobile header always displays language, currency and registration. The footer spreadsheet link is removed. SEO articles remain unpublished; the beginner guide stays available. English is default. All 19 regional choices use 12 translated interface/guide/FAQ languages; 15 currencies are independently selectable.

Catalog and QC data come from https://kakobuymake.com, with no separate product database. Homepage fixtures preserve the selection. Categories read the source dynamically. Seller carousel images come from the matching Weidian listing; QC is never substituted into that carousel. Official tutorial screenshots are labeled as examples; provenance is in `fixtures/guide-shots/README.md`.

Registration: https://litbuy.com/register?inviteCode=E32JME4UQ

Purchase: https://litbuy.com/product/2/{verified_item_id}?inviteCode=7N6D4Y6EE

## Search metadata

Server-rendered HTML, canonicals, hreflang, robots.txt, sitemap.xml and structured data are included. Only the production domains permit indexing; preview domains are noindex and robots-disallowed. Sitemap covers core pages, categories, the beginner guide and curated products in all locales. GSC, Bing and Google Analytics are not configured by this export.

## Maintenance

Edit `src/` and commit within this folder to trigger Pages. Assets and catalog fixtures are in `fixtures/`. `scripts/assemble.mjs` combines them into the Worker. Run `npm run build` before publishing. Browser visual QA is separate from build and route checks.
