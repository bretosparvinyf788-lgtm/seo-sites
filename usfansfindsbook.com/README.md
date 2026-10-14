# USFans Findsbook — usfansfindsbook.com

Website source: 24 languages, 54 featured finds on the homepage, live access to all kakobuymake.com category products, FAQ, illustrated beginner guide, currency conversion, saved finds and recent history.

Category and spreadsheet pages read the source catalog at request time, with its actual totals, pagination and price ordering. Every catalog item opens a separate live product detail page, which reads the matching gallery and uses referral T2JMMC. Source HTML is cached for five minutes; there is no separate product database. D1 stores visitor favorites and history only. New products are supported by favorites as well as listing pages.

Run `npm test` after building the Worker test output with `node scripts/build-worker.mjs`.

## Cloudflare Pages

- Repository: bretosparvinyf788-lgtm/seo-sites
- Production branch: main
- Root directory: usfansfindsbook.com
- Build command: npm run build
- Output directory: dist/client
- Runtime: Pages advanced-mode Worker with D1 binding DB
- Initialize D1 using drizzle/0000_amazing_machine_man.sql before deployment.

Build requires Python 3 and Node.js. No external packages are required for the production build. All product images and tutorial screenshots are included in public/assets.

Edit existing translations in content.json and content/*.json. Do not run localize_products.py: it is the historical six-language initializer. SEO article pages remain disabled intentionally.

Registration referral: https://usfans.com/register?ref=T2JMMC

