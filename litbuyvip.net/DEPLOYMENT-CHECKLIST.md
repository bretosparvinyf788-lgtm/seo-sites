# Production deployment checklist

## Before GitHub upload

- [ ] Replace any temporary wording or prices that should not be published.
- [ ] Confirm all 120 external product links and images still load.
- [ ] Confirm the main-site search form returns KakobuyMake search results.
- [ ] Test English and at least three translated UI options on desktop and mobile.
- [ ] Test `/guides/` and all three article pages.

## After Cloudflare deployment

- [ ] Add `litbuyvip.net` as the custom domain.
- [ ] Confirm HTTPS is active and both apex and preferred hostname resolve consistently.
- [ ] Confirm `/robots.txt`, `/sitemap.xml`, `/404.html` and article pages return 200.
- [ ] Confirm Cloudflare preview URLs send `X-Robots-Tag: noindex`.
- [ ] Confirm the custom domain does not send `X-Robots-Tag: noindex`.

## Google Search Console

- [ ] Verify the property.
- [ ] Submit the sitemap.
- [ ] Inspect the homepage, guide archive and three articles.
- [ ] Request indexing only after canonical URLs and live rendering are correct.
