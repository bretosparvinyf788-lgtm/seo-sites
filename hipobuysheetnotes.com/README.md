# hipobuysheetnotes.com

Astro application with Cloudflare Workers hosting. Current UI source is in worker/page.html and worker/client.js. worker/index.js provides the catalog, detail and exchange-rate APIs. Astro routes requests to this handler.

19 language/region options, independent 15-currency selection, 16 expanded FAQ answers, product carousels, and sticky mobile navigation. The four mobile navigation entries are grouped in a hamburger menu. Registration follows currency selection.

## Deployment

Use Node.js 22.12 or newer. Run npm ci and npm run build. Authenticate with Cloudflare and run npm run deploy.

Cloudflare Workers Git settings: repository bretosparvinyf788-lgtm/seo-sites, branch main, root directory hipobuysheetnotes.com, build command npm run build, deploy command npx wrangler deploy. Bind hipobuysheetnotes.com as a custom domain after the domain is available in the account.

Catalog source: kakobuymake.com. Exchange rates: Frankfurter. Registration links retain the existing Hipobuy referral.

## Search and Analytics

- GA4 account: VIP Sites Analytics (405490942); measurement ID: G-LL32T68DHC.
- Google Search Console and Bing verification meta tags are included in every page.
- `/sitemap.xml` is an XML sitemap index. `/sitemaps/pages.xml` contains the home, catalog and current categories. Product sitemaps follow the current source catalog pagination and list actual product URLs. No language, currency, search or sort duplicates are included.
- `/robots.txt` advertises the sitemap and excludes API endpoints.
- After Cloudflare deploys this commit, verify the URL-prefix property `https://hipobuysheetnotes.com/` in Search Console and Bing, submit `/sitemap.xml`, and request indexing for the homepage.
