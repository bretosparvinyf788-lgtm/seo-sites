# lovegobuysheetlab.com

Independent Lovegobuy product directory, with live server-side reads from kakobuymake.com. No product database is created.

- Registration: https://www.lovegobuy.com/?invite_code=HR595U
- Product destination: https://www.lovegobuy.com/product?id={WEIDIAN_ID}&shop_type=weidian&invite_code=WIP8S9
- Flow: catalogue → internal detail → corresponding Lovegobuy product.
- Ten source categories; catalogue search, sorting and pagination use the source site.
- Homepage: three latest finds plus four distinct products in each of the shoes, T-shirts and bags previews; ten source categories remain available. Source snapshots are labelled if live reads are unavailable.
- The upper seller gallery is retrieved from the exact Weidian ID. Source cover fallback is labelled; lower reference QC remains separate.
- Default English. Twenty-four complete interface languages; compact two-column language and three-column currency menus, with 24 display currencies with live reference rates and USD fallback.
- Illustrated eight-step guide, expanded FAQ in three groups, browser-local QC checklist.
- Canonical URLs target lovegobuysheetlab.com, with robots.txt and sitemap.xml. Domain DNS and search-console integrations are not configured by this development preview.
- Official logo and tutorial images are loaded from Lovegobuy's public asset URLs. The primary favicon is a self-contained PNG of the official favicon artwork. Official ICO and 48/96 px PNG compatibility routes remain available; the starter icon has been removed.

Build with `node /root/.codex/plugins/cache/openai-curated-remote/sites/1.1.3/scripts/build-site.mjs` in the supported Sites environment.

## GitHub and Cloudflare production

Production deploys from `seo-sites/lovegobuysheetlab.com` using `npm install`, `npm run build`, and `npm run deploy`. `wrangler.jsonc` owns the Worker, static assets, apex/www domains, verification and Analytics variables. The full original preview framework source is retained; its package metadata is in `package.sites.json` and `pnpm-lock.sites.yaml`. No credentials or native preview identity are included.
