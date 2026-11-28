# CSSBuy VIP / kakobuymake.com
Read site-config.json, project-memory.json and catalog-coverage.json. Preserve this Site identity. This is a newly built CSSBuy site; USFans is only the verified catalogue/gallery data source, not this site's brand.

- Domain cssbuyvip.com; preview does not imply domain binding or search console setup.
- Register https://cssb.uy/2JLm. Current user supplied promotionCode=b949d0d72e6d7314. This overrides the older 7cdb0223a163d67c value for THIS site only. Canonical link browser verified: /item-micro-{id}.html?promotionCode=b949d0d72e6d7314. Preserve each actual item ID; do not reuse the opaque encoded example ID.
- Analytics G-S0L11KHDQ7 is config only, disabled in preview. Enable for formal production release only.
- Full catalogue: 4,777 published source records, 4,771 products, ten categories. Imported snapshot 2026-11-26. Images and mappings must stay traceable; don't claim current live stock.
- Original carousel/SKU photos are separate from QC; QC at bottom. The source has 31 products with no separate style images, 3 QC gaps. Contact/QR audit incomplete; never claim all images checked.
- New green/white directory design, compact heading CSSBuy Spreadsheet, 12 featured items, no screenshots on homepage, no hero right card.
- 24 full-name language menu, two columns; separate currency; Join CSSBuy adjacent. Latest request: phone language/currency/Join controls stay visible in the sticky header independently of the hamburger. Phone currency trigger shows its code only; menu retains symbols. Hamburger contains five navigation links including Search by photo, Home first. Desktop stays sticky.
- Internal product routes before outgoing purchase links. Category descriptions clickable; sorting/grid controls. No Hot/brand/favourites. Catalogue/category/search lists use48items per numbered page, total/current page, Previous/Next and page jump. Keep q/sort in page URLs, reset page on new sorting/search, clamp invalid pages. Do not restore Show more.
- Image search must be real. Never fabricate similar items from random or unrelated products.
- CSSBuy guide uses independent guide.json (desktop) and guide-mobile.json (phone) data. Phone mode must never fall back to desktop images. Every one of the 12 phone steps must retain an actual interface image, action text and numbered callouts. Three own-site phone captures and five distinct official historical app sources are clearly labelled. Photo/Track/selection entry views must not be described as downstream forms or transaction receipts. Historical address/route submission views are not current authenticated order captures. Never USFans screenshots.
- Update project-memory.json as work proceeds. Build with python build.py and node --check both JS files. Browser QA at desktop and narrow widths, menus, exact-ID search, gallery and outgoing links.

- Image search is implemented in dist/visual-search.js with CLIP4771-ID vectors. Photos stay in browser; first use downloads approx90MB cached model. Pin onnxruntime-web1.23.2; do not use1.32 or add telemetry. Index provenance in visual-search-provenance.json.
- 24-language guide/FAQ/interface translations generated with offline M2M100 plus curated existing translations; do not claim native proofreading. Build exports per-language JSON. Preserve full natural guide image ratios; no imageFrame cropping.

- Photo search presentation (2026-11-28): compact upload card, no demo buttons or empty results block. Desktop navigation camera/text and phone44pxcamera shortcut plus menu entry. Keep language/currency/Join visible.

- Regression2026-11-28: Keep app script in404document so preferences work; unknown paths must showtranslated404; do not render initial currency changes beforedataready. Visual search decodes the photo before model download; invalidphotos have no broken preview. Ranking must not include other category families even for high-score outliers. Reviewed translation overrides apply last.
