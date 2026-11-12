# Kakobuy Sheetdesk

New website for **kakobuysheetdesk.com**. The preview is hosted privately until a public/custom-domain deployment is requested.

- English default; 24 complete text locales; independent compact selector for 36 currencies.
- 4,282 listings in ten categories, captured from kakobuymake.com on 2026-11-11. Full-category sorting, 48-item pagination, and local product details.
- A red catalog cover with a paged product atlas: twelve curated finds in two six-item pages, selectable category chapters, another-selection control, and links to complete category pages. FAQ topics use three accessible tabs with four questions each.
- Verified signup redirect: `https://ikako.vip/r/wtqaa` → Kakobuy registration with `affcode=wtqaa`.
- Product URLs use the provided `item2.kakobuy.com` format with original Weidian IDs and the same referral code.
- Seller carousel and QC archive are separate. Curated photos are embedded; uncertain or promotional images are excluded. Two QC images are available for the supplied listing 7894400057.
- Eight guide steps shown in full, with screenshots of the public registration/item/estimator/help interfaces and this site's catalog and QC archive. The final tracking image is an official help reference, not a screenshot of a logged-in parcel account.
- Product titles in translated locales use localized category/type labels with the listing identifier. The original seller title remains available on the detail page.
- Currency estimates use the ExchangeRate-API public USD feed. Checkout prices and fees remain the agent's current values.

## Build and verify

```sh
bash scripts/build.sh
node tools/check.mjs
node scripts/validate-artifact.mjs
```

The Worker runs from `dist/server/index.js`. Source is `worker/template.js`, `worker/style.css`, `worker/client.js`, and the JSON files under `tools/`. `tools/bundle.py` produces the self-contained Worker.

The catalog is a dated snapshot. Product details outside the curated selection are retrieved from the main site and original Weidian listing on demand; source pages and rates are cached. No automatic scheduled catalog refresh has been enabled.

## Update data

`tools/collect.py` and `tools/full-catalog.py` collect public listings. Review new photos before including them in the curated selection. Do not rerun the curation helper on already-curated data; it documents the initial source-image audit. Source-image proxying is restricted to HTTPS and the approved `kakobuymake.com` and `si.geilicdn.com` hosts.
