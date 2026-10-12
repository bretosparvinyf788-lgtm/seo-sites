# USFans Findsbook — usfansfindsbook.com

Complete website source: 24 languages, 54 products, category pages, FAQ, illustrated beginner guide, currency conversion, saved finds and recent history.

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
