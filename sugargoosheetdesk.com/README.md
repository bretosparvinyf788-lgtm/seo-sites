# sugargoosheetdesk.com

Independent Sugargoo product directory, built as a server-rendered Worker with 24 interface languages and 35 display currencies. Product data is a snapshot of kakobuymake.com. Seller galleries are requested from the matching Weidian listing and never used as warehouse QC photos. The QC snapshot is keyed by main-site listing ID and original Weidian ID. Missing source photos remain explicitly unavailable.

- `npm run build`: generate the Worker in `dist/server/index.js`.
- `npm run dev -- --port 3000`: local preview with source reload.
- `node tools/verify.mjs`: route, catalogue, language, referral, and image-boundary checks.
- Source and deployment identity: `.openai/hosting.json`.

Registration referral member ID: `3914891758646228603`.
Product referral member ID: `2064761237850680307`.
The nested Weidian URL is URL-encoded independently of the product referral parameter.

Catalogue and QC records include 4,467 listings after the 2026-11-13 increment. 23 source records have no additional QC photos and 11 records lack a parsed Weidian ID. Listings without an ID have no purchase button. The catalogue is a snapshot; this project does not claim automatic daily catalogue synchronization. Runtime seller galleries and exchange rates refresh through cached external requests. Exchange conversions fall back to the dated rate snapshot if the provider is unavailable.

Preview publication uses owner-only Sites access. The custom domain, GitHub seo-sites repository, Cloudflare account, Google Search Console, Bing and Analytics have not been connected in this development task.
