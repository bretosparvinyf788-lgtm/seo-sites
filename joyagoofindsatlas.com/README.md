# Joyagoo Finds Atlas

Complete multilingual website for https://joyagoofindsatlas.com.

## Build and deployment

- Repository directory: `joyagoofindsatlas.com`
- Cloudflare Pages project: `joyagoofindsatlas-com`
- Production branch: `main`
- Root directory: `joyagoofindsatlas.com`
- Build command: `npm run build:pages`
- Output directory: `dist`
- Node.js 22 or later. No dependencies or installation are required.

Run `npm run build:pages` followed by `npm run validate`. The build assembles the source modules into a Pages advanced-mode ES module at `dist/_worker.js`; every route is handled by that worker.

## Included features

24 languages, 46 display currencies with dated reference rates, ten full category pages, product details, original Weidian seller galleries, separate source QC references, local bookmarks, illustrated buying guide and ten tailored FAQs. All guide screenshots are embedded in the source and served by the worker. The official logo has no added suffix.

Products and category ordering are read from kakobuymake.com without a separate database. If its price is missing, a verified matching Weidian item may supply a CNY reference price, converted using the same daily reference rates. Actual order options and charges must be confirmed on Joyagoo.

Registration: https://joyagoo.com/register?ref=301109190

Purchase links use `shop_type=weidian`, the verified item ID and `ref=300189539`.

## Search and measurement

The production domain permits indexing and exposes `/sitemap.xml` and `/robots.txt`. Preview hosts remain noindex. `www` redirects to the HTTPS apex domain. Default language is English.

Google Analytics uses measurement ID `G-CQGHN6TB40` only on the production origin. Source configuration is in `worker/site-config.js`. Google Search Console ownership is verified with a DNS TXT record; verification records should remain in DNS.

Edit individual modules under `worker/`, then rebuild. `worker/index.js` is generated. Do not add secrets or API credentials to this public repository.
