# hipobuyqcnotes.com

Complete source for the current Hipobuy QC Notes website, published with Cloudflare Pages advanced mode.

## Deployment
- Repository: bretosparvinyf788-lgtm/seo-sites
- Project: hipobuyqcnotes-com
- Production branch: main
- Root directory: hipobuyqcnotes.com
- Build command: npm run build
- Output directory: dist
- Node.js: 22 or newer; no package dependencies.

Run npm run build after editing worker source. The committed dist/_worker.js is also reproducible from the source. Routes, product APIs and image galleries are served by this Worker; uploading the HTML alone is insufficient.

## Current content
- Homepage: 10 products from source catalog page 9, 10 categories, detailed photo-review notes, 16 FAQ answers.
- Categories, catalog, search, sorting, product details, seller gallery and separate source reference photos.
- 19 locale choices, product-type translations and 15 independent currencies.
- Three existing short guides in English and Chinese; full-length multilingual SEO articles remain future work.
- Source data comes from kakobuymake.com; no invented QC results or local product database.
- robots.txt, sitemap.xml, canonical URLs and HTTPS/www normalization included.
- Google Search Console and Bing ownership verified through DNS. Sitemap submitted to both.
- GA4: VIP Sites Analytics (405490942), web stream 16052158854, measurement ID G-YXWSVE47YC. Tag is injected into all HTML pages at build time.
