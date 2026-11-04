# Oopbuy QC Guide

Production website: https://oopbuyqcguide.com

This directory contains the complete application, official brand assets, buying guide screenshots, and restored QC images. Product catalog, sorting, search and detail data are read from kakobuymake.com; seller photos are read from the matching Weidian listing. No database is required.

## Production: Cloudflare Workers Builds

- Account: wengxianxian2@gmail.com
- GitHub repository: bretosparvinyf788-lgtm/seo-sites
- Production branch: main
- Root directory: oopbuyqcguide.com
- Build command: npm test && npm run build
- Deploy command: npx wrangler@4.92.0 deploy --config wrangler.worker.jsonc
- Worker name: oopbuyqcguide-com
- Static assets directory: public
- Node version: 22
- Compatibility date: 2026-11-04

Use `npm install`, `npm test`, and `npm run build` locally. The build bundles the existing application into Pages advanced-mode `_worker.js` and copies all static assets. Set the production environment variables `GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`, and `BING_SITE_VERIFICATION` to their values from the respective service. Preview hosts are excluded from search indexing and analytics. Add oopbuyqcguide.com and www.oopbuyqcguide.com as custom domains; www redirects to the canonical apex domain.

The site has 24 locale choices, independent currency selection, ten catalog categories, internal product detail pages, an eight-step guide, and twelve expanded FAQ answers. Affiliate registration and purchase parameters are preserved.

The production Worker serves every path on oopbuyqcguide.com and www.oopbuyqcguide.com using the corresponding zone routes. The existing proxied DNS records and certificates are retained during the source migration. Analytics and Bing verification identifiers are carried over unchanged. The legacy Pages project remains available as a rollback target. All production changes are maintained in seo-sites/oopbuyqcguide.com.
