# hipobuysheetnotes.com

Astro application with Cloudflare Workers hosting. Current UI source is in worker/page.html and worker/client.js. worker/index.js provides the catalog, detail and exchange-rate APIs. Astro routes requests to this handler.

19 language/region options, independent 15-currency selection, 16 expanded FAQ answers, product carousels, and sticky mobile navigation. The four mobile navigation entries are grouped in a hamburger menu. Registration follows currency selection.

## Deployment

Use Node.js 22.12 or newer. Run npm ci and npm run build. Authenticate with Cloudflare and run npm run deploy.

Cloudflare Workers Git settings: repository bretosparvinyf788-lgtm/seo-sites, branch main, root directory hipobuysheetnotes.com, build command npm run build, deploy command npx wrangler deploy. Bind hipobuysheetnotes.com as a custom domain after the domain is available in the account.

Catalog source: kakobuymake.com. Exchange rates: Frankfurter. Registration links retain the existing Hipobuy referral.
