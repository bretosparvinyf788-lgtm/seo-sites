# vigorbuysheetdesk.com

Independent VigorBuy discovery website, retaining the existing private Site identity and audience.

## Runtime and data

- `node scripts/build.mjs` bundles the interface and source adapter into `dist/server/index.js`.
- `node scripts/validate-artifact.mjs` validates the deployable Worker.
- Catalog, category and keyword search read kakobuymake.com on demand, with upstream page counts and totals. There is no separate product database, bundled product snapshot or copied product image catalog.
- `/api/detail?id=MAIN_AID` reads that exact main-site product. Its verified Weidian ID selects the original seller gallery and the VigorBuy `/product/2/ITEM_ID` purchase route.
- The lower QC/source gallery contains the same main-site product’s images. A source gallery is explicitly distinguished from a dedicated QC record; missing metadata is never invented.
- The image endpoint permits only the main site’s `/uploads/` files and Weidian’s image CDN. HTTP edge caching is temporary; no external image library is used.
- Source HTML parsing is a temporary compatibility adapter and can break if the main-site template changes. A controlled read-only JSON API is the preferred production source.

## Interface

- Default English; 24 authored UI, guide and FAQ language bundles. Original source product names are preserved rather than replaced with fabricated translations.
- Separate currency selector with indicative fixed display rates; 4 controls together on mobile, complete hamburger navigation, sticky header.
- Homepage has 12 live-source picks. Independent categories and product pages, server-backed search and pagination, favorites in this browser. Sorting is clearly scoped to the visible source page, not represented as global sorting.
- Four FAQ groups with four entries each; answers expand in place. Guide has eight fully expanded steps on an independent page.
- Guide visuals for the first three steps are explicitly labeled interface demonstrations. Verified VigorBuy account screenshots for later steps remain unavailable because its current Cloudflare verification fails in this browser. No other platform’s screenshots are substituted.
- Official favicon retained, wordmark suffix removed and accent color matched to the official pink icon.
- Supplied registration URL and invitation code preserved. No unprovided purchase invitation parameter is invented.
- GA4 G-Q1QMYKSCX9, analytics denied until consent, advertising storage denied.
- Dynamic sitemap index covers category pages and all source product pages. Saved and search-result states are excluded from indexing.

## Verification

Real-format source checks: 50 products per catalog page and complete source pagination; exact Weidian ID matching; distinct upper seller and lower source galleries; rejection of a mismatched seller ID; 24 language bundles and 16 FAQ entries. Browser checks cover live catalog, product photo display and in-place controls. This is not a claim of a manual watermark/QC audit of every source product.

Custom domain, external GitHub seo-sites repository, Cloudflare account, GSC and Bing bindings are not changed by this private preview revision.

## Layout revision

Homepage follows the reference structure: compact centered heading and search, three departments with four live products each, twelve recent finds, ten category links, a compact guide entry and four FAQ groups. Desktop uses three departments side by side; mobile stacks them with two product columns. Existing identity, catalog adapter, detail galleries, analytics and multilingual behavior are retained.

## Buying guide removal

The buying guide page and all homepage, navigation and footer entry points are removed. Old /guide links redirect to /catalog/. The sitemap no longer lists the guide. Product discovery, FAQ and QC galleries are retained.

## Other purchasing agents

Product details include an expandable list of the exact matching main-site agent links, including referral parameters. Only known HTTPS agent domains and links containing the verified product ID are accepted; missing or mismatched links are omitted. The VigorBuy primary button is retained. The label is localized across all 24 languages.

## Agent icons

All 15 agent links display the corresponding platform favicon, bundled under brand/agents and served by the same-origin icon endpoint. The VigorBuy purchase button also displays its existing official favicon. No runtime third-party icon service is required.

## Agent dialog

The product agent button opens a centered searchable modal with locally bundled logos, a highlighted current VigorBuy row, external product links, and per-platform clipboard buttons. Native dialog focus trapping, Escape, close button and backdrop dismissal are supported. Labels use all 24 locales; the list scrolls within the viewport.

## Style thumbnails

Product details read distinct SKU image attributes from the verified Weidian item, deduplicating size repetitions by image URL. A separate scrollable style grid previews each style in the main photo without selecting a purchasable SKU. Seller carousel and QC/source photos remain separate. Products without SKU images omit the grid. Style labels and preview guidance support all 24 languages.

## Reference language and currency pickers

Header controls show a globe and full native language name, with separate two-column language and currency panels. Options and their order follow the supplied reference site: 24 languages and 31 currency labels. Five additional locale bundles are included. Reference currency ratios are used as indicative display conversions normalized to the main-site USD prices, including the reference’s nonstandard ZWN label; these are not live payment quotes. Panels close on selection, outside click and Escape and fit the mobile viewport.

## Hierarchical category directory

The reference-style directory has nine expandable departments and 43 department/subcategory routes, including the all-products entry for each department. Existing numeric source category URLs remain available. Products still come from the main site: virtual categories use source categories plus title-based classification. Cursor pagination scans bounded batches and does not claim an exact category total. Specific subcategories match explicit title terms; ambiguous titles may remain only in the broader department. English and all 23 selectable locale bundles have translated category labels. The homepage uses Shoes, Tops and Accessories showcases and the expandable directory.

## Main-site category correction

The visible directory and list filters now use the ten original main-site categories, each with a distinct always-visible description in all 24 selected languages. Numeric category routes read the corresponding main-site category directly. Reference-derived department and subcategory routes are removed from the sitemap and redirect to main-site categories. Homepage showcases use shoes, fashion clothing and bags.

## Cloudflare production

Domain: https://vigorbuysheetdesk.com
Source: seo-sites/main, vigorbuysheetdesk.com/
Worker: vigorbuysheetdesk-com in Cloudflare account 957cff16ad6c8cfb15c078cded9ac3dc.
Workers Builds runs `npm run check && npm run build && npm run validate`, then `npm run deploy:cloudflare` on changes to this directory. Deployment credentials are supplied by Cloudflare Builds and must never be committed.
