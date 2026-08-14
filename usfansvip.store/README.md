# USFansVIP.store

Complete deployable source package for the USFansVIP.store buyer-guide website.

## Included

- Responsive homepage with the USFans + VIP header and footer branding
- Ten product-category links and ten featured product cards
- Three full English SEO buyer guides (1,500–1,800 words each)
- A complete `/guides` article directory
- Three independent article routes under `/guides/[slug]`
- Ten detailed reverse-purchasing FAQs
- Product, logo, favicon and hero image assets
- `robots.txt` and XML sitemap generation
- Cloudflare/OpenAI Sites build configuration

## Main routes

- `/` — homepage
- `/guides` — all buyer guides
- `/guides/evidence-first-usfans-buying-workflow`
- `/guides/usfans-qc-photos-return-window`
- `/guides/usfans-shipping-cost-volumetric-weight-customs`

## Local installation

Node.js 22.13 or newer is recommended.

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

The build command generates and validates the deployable output in `dist/`.

## GitHub deployment

Upload all files and folders from this package to the selected repository or domain directory, including hidden files such as `.openai/hosting.json`. Do not upload `node_modules`, `.sites-runtime`, `.wrangler`, or a locally generated `dist` folder.

The deployment platform should run:

```text
npm ci
npm run build
```

The domain can be connected after the repository build succeeds. No GitHub deployment has been performed from this package.
