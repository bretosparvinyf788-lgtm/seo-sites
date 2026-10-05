# hipobuysheetnotes.com

Astro application packaged for Cloudflare Pages advanced mode. Current UI source is in worker/page.html and worker/client.js. worker/index.js provides the catalog, detail and exchange-rate APIs. The Pages build emits this handler as dist/_worker.js so homepage, deep routes, APIs, robots and sitemaps all execute on Pages.

19 language/region options, independent 15-currency selection, 16 expanded FAQ answers, product carousels, and sticky mobile navigation. The four mobile navigation entries are grouped in a hamburger menu. Registration follows currency selection.

## Deployment

Use Node.js 22.19 or newer. The .node-version file pins the Cloudflare build runtime to 22.19.0. Verified Pages output (dist/_worker.js, dist/_routes.json and dist/_headers) is committed alongside the source. This supports the existing Pages build command exit 0 without requiring Astro compilation in the Cloudflare build container. After source changes, run npm run build and commit the regenerated output. npm run build remains supported as an explicit dashboard build step. Run npm ci and npm run build. The deployment output directory is dist, including _worker.js and _routes.json. Authenticate with Cloudflare and run npm run deploy for manual CLI deployment.

Cloudflare Pages Git settings:
- Repository: bretosparvinyf788-lgtm/seo-sites
- Production branch: main
- Root directory: hipobuysheetnotes.com
- Build command: npm run build
- Build output directory: dist
- Node version: 22.19 or newer

Keep the existing Pages project hipobuysheetnotes-com. Add both hipobuysheetnotes.com and www.hipobuysheetnotes.com in its Custom domains screen, and wait until the domains are Active. Do not point the domain at a different Worker project. A successful build alone does not confirm DNS or TLS activation.

Catalog source: kakobuymake.com. Exchange rates: Frankfurter. Registration links retain the existing Hipobuy referral.

## Search and Analytics

- GA4 account: VIP Sites Analytics (405490942); measurement ID: G-LL32T68DHC.
- Google Search Console and Bing verification meta tags are included in every page.
- `/sitemap.xml` is an XML sitemap index. `/sitemaps/pages.xml` contains the home, catalog and current categories. Product sitemaps follow the current source catalog pagination and list actual product URLs. No language, currency, search or sort duplicates are included.
- `/robots.txt` advertises the sitemap and excludes API endpoints.
- After Cloudflare deploys this commit, verify the URL-prefix property `https://hipobuysheetnotes.com/` in Search Console and Bing, submit `/sitemap.xml`, and request indexing for the homepage.
