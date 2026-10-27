# Eight-site SEO review — 2026-10-27

Scope is limited to the eight domains below. GSC uses its selected three-month report; these young properties only have data since launch. Performance data currently ends on October 24. Indexed-page counts come from each property's latest Overview, and do not share the performance-report date range. GA4 figures are active users for the displayed last seven days, including all channels, not just search.

| Domain | Google clicks | Impressions | CTR | Indexed pages | GA4 active users |
|---|---:|---:|---:|---:|---:|
| hipobuysheetnotes.com | 0 | 7 | 0% | 2 | 2 |
| hipobuyqcnotes.com | 0 | 5 | 0% | 1 | 84 |
| usfansfindsbook.com | 68 | 455 | 14.9% | 579 | 104 |
| usfansparcelguide.com | 11 | 164 | 6.7% | 288 | 16 |
| litbuysheetbook.com | 37 | 494 | 7.5% | 908 | 77 |
| litbuyqcnotes.com | 4 | 26 | 15.4% | 35 | 35 |
| joyagoofindsatlas.com | 0 | 0 | 0% | 0 | 33 |
| joyagooparcelguide.com | 0 | 74 | 0% | 3 | 12 |

## Confirmed issues and corrections

- Hipobuy: initial category/listing/product HTML was an empty client app shell. Render translated category names, item titles, images, visible source prices, detail links and pagination on the server from the existing main-store reader. Preserve the established client UI. Unknown categories and out-of-range pages return 404; source failures return a retryable, non-indexable 503. No separate product database is added.
- Joyagoo: pagination canonical and language alternates discarded the page number. Preserve page numbers on both sites, with query-aware language links.
- Litbuy Sheetbook: GSC reports 25 invalid Product snippets, missing offers/review/aggregateRating. Both Litbuy and both Joyagoo sites now include an Offer only when a positive visible USD source price and exact purchase destination are present. Missing-price records use WebPage instead. No ratings, inventory status or shipping prices are invented.
- Resume the pending PR #183: eight separate public IndexNow ownership files and validation-first submission commands; static Hipobuy catalog sitemap index. Production submission remains conditional on successful deployment and live verification.

## Search-engine observations

- Hipobuy Sheet Notes: GSC read both core and catalog sitemaps successfully on October 26; 13 core URLs and 3,502 catalog URLs discovered. Discovery has not yet translated into broad indexing.
- Hipobuy QC Notes: 33 crawled-but-not-indexed URLs and two Google-selected alternate canonicals. Sitemap report still shows seven discovered URLs from October 20; re-read the current sitemap after deployment.
- Joyagoo Finds Atlas: report updated October 23 still lists 161 noindex exclusions. The sample URLs were last crawled October 21, before the October 22 fix. Request revalidation; do not claim these historic exclusions prove a current noindex response.
- USFans Findsbook: 579 indexed pages versus the October 22 recorded baseline of 197. Search visibility remains strongest here among these eight sites.
- Bing home reports inspected for the two Hipobuy and two USFans sites show zero clicks/impressions for July 27–October 26. This is not a statement that no pages are indexed.

## Validation

- All eight actual Pages build/artifact-validation paths pass. USFans Parcel Guide uses its committed application artifact and source-hash verification.
- Both Hipobuy initial-HTML regression tests pass, including source outages, exact item purchase destination, translated French titles, filters, pagination and 404s. Existing Sheet Notes crawler and product-name tests also pass.
- Litbuy Sheetbook: 66 existing route checks and deployment artifact validation pass. Litbuy QC Notes: Pages checks pass for 648 sitemap URLs, redirects, guide steps, product page and static image responses. Its legacy server-bundle validator expects a separate build output and is not the configured Pages validation path.
- Both Joyagoo pagination/offer tests pass, including absence of fabricated offers for missing prices. All four product schema implementations were checked against rendered HTML and the existing source fixtures.
- All eight IndexNow dry runs pass: 4,225 same-origin canonical URLs in total. The Sheet Notes dry run contains 13 core URLs; its separate 72-child product sitemap remains the discovery path for the full catalog.
- Direct browsing of several production homepages was blocked by the connected browser; the shell also returned empty 404 responses for several dynamic pages. Those observations do not establish a public outage. Full production visual/mobile verification remains unconfirmed in this environment. Check deployment status and crawler assets separately.

## Follow-up priorities

Check Google revalidation results, new canonical selection and actual search impressions after recrawl. Prioritize Hipobuy rendering and Joyagoo Atlas recovery. Preserve existing layouts, registration referrals, main-store data and guide-only content preferences. Do not infer ranking gains from successful deployment or IndexNow receipt.
