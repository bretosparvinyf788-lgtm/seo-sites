# Oopbuy QC Guide

Production website: https://oopbuyqcguide.com

This directory contains the complete application, official brand assets, buying guide screenshots, and restored QC images. Product catalog, sorting, search and detail data are read from kakobuymake.com; seller photos are read from the matching Weidian listing. No database is required.

## Cloudflare Pages

- Account: wengxianxian2@gmail.com
- GitHub repository: bretosparvinyf788-lgtm/seo-sites
- Production branch: main
- Root directory: oopbuyqcguide.com
- Framework preset: None
- Build command: npm run build
- Output directory: dist
- Node version: 22
- Compatibility date: 2026-11-03

Use `npm install`, `npm test`, and `npm run build` locally. The build bundles the existing application into Pages advanced-mode `_worker.js` and copies all static assets. Set the production environment variables `GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`, and `BING_SITE_VERIFICATION` to their values from the respective service. Preview hosts are excluded from search indexing and analytics. Add oopbuyqcguide.com and www.oopbuyqcguide.com as custom domains; www redirects to the canonical apex domain.

The site has 24 locale choices, independent currency selection, ten catalog categories, internal product detail pages, an eight-step guide, and twelve expanded FAQ answers. Affiliate registration and purchase parameters are preserved.
