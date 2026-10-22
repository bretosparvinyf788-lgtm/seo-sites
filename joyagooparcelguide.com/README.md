# joyagooparcelguide.com

Complete Joyagoo spreadsheet and parcel guide, exported from the approved preview.

## Features

- Live kakobuymake.com catalogue, ten categories, sorting, pagination and independent product pages; no separate product database.
- Homepage: twelve source products, comparison panel, prominent buying-guide entry and ten FAQ answers.
- Buying tutorial: eight illustrated steps and twenty-four actions on `/how-to-buy`, with all images visible. Tutorial screenshots are not displayed on the homepage.
- Twenty-four languages, supported currency conversion, browser-local bookmarks and original matched Weidian seller galleries, separate from source reference photographs.
- Joyagoo affiliate registration and product links preserved.

## Cloudflare Pages

Repository directory: `joyagooparcelguide.com` in `bretosparvinyf788-lgtm/seo-sites`, branch `main`.

Build command: `npm run build:pages`. Output directory: `dist`. No dependencies are required. `scripts/assemble.mjs` builds the Worker from source and embeds the complete tutorial images. `scripts/build-pages.mjs` emits `dist/_worker.js` for Pages advanced mode.

Production origin: `https://joyagooparcelguide.com`. The `www` hostname redirects to the apex. Public pages allow indexing. Saved items and API endpoints are excluded from indexing. `robots.txt` includes the sitemap URL. Source prices and photographs remain references; order, QC and payment actions take place on Joyagoo.

Update source files and push to `main` to trigger the connected Pages build. Product catalogue data remains live from the upstream source. Development-only fixtures, credentials and Sites hosting identifiers are excluded from this export.
