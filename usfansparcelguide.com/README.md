# USFans Parcel Guide

Full USFans catalog website for https://usfansparcelguide.com. Includes 24 languages and currencies, ten catalog categories, independent product details, QC images, a beginner guide, FAQ, sitemap and robots.txt. Product data comes from kakobuymake.com.

## Build
Requires Node 22.13+ and pnpm 11.25. Install from pnpm-lock.yaml, then run npm run build. Commit both source changes and the refreshed cloudflare-output/ output. npm run verify rejects stale output.

## Cloudflare Pages
Repository: bretosparvinyf788-lgtm/seo-sites, branch main. Root directory: usfansparcelguide.com. Build command: node scripts/verify-pages.mjs. Output directory: cloudflare-output. Set SKIP_DEPENDENCY_INSTALL=true. Runtime uses nodejs_compat and compatibility date 2026-05-15. cloudflare-output/_worker.js is the full server-rendered application; other files are static assets. Git pushes to this directory automatically deploy the verified output.

Registration link: https://usfans.com/register?ref=T2JMMC. English is the default language.

GA4 measurement ID: G-SKZ3SM2V0G. Independent web stream under VIP Sites Analytics. Reporting timezone: China Time (UTC+8); reporting currency: USD. Sitemap and robots.txt are generated and served as static assets.
