# SuperBuyVIP.pro — complete deployable source

This package contains the production source for **superbuyvip.pro**. It includes the responsive site, seven-language interface content, ten local product images, five long-form buyer guides, topic-specific FAQs, SEO metadata, sitemap, robots rules, favicon, tests and Cloudflare Worker deployment configuration.

## Requirements

- Node.js 22.13 or newer
- npm
- A Cloudflare account when publishing

## Local preview

```bash
npm ci
npm run dev
```

Open the local address printed by the development server.

## Production build

```bash
npm ci
npm run build
npm test
```

The deployable Worker is written to `dist/server/index.js`; static assets are written to `dist/client`.

## Deploy to Cloudflare Workers

```bash
npm ci
npx wrangler login
npm run deploy
```

The included `wrangler.jsonc` publishes the server Worker and its static assets. After the first deployment, add `superbuyvip.pro` as a custom domain in Cloudflare and configure the DNS record Cloudflare requests.

## Deploy from GitHub

1. Create a repository and upload the contents of this package at the repository root.
2. In Cloudflare Workers & Pages, choose **Create application → Import a repository**.
3. Use `npm ci && npm run build` as the build command.
4. Use `npx wrangler deploy --config wrangler.jsonc` as the deploy command when your Cloudflare workflow asks for it.
5. Store `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as protected repository or platform secrets if automated deployment requires them.

Do not commit passwords, API tokens, account IDs or `.env` files.

## Google Search Console

- Verify the domain property with the DNS TXT record supplied by Google Search Console.
- Submit `https://superbuyvip.pro/sitemap.xml` after the domain is live.
- `robots.txt`, the canonical URL, English default language, favicon and index/follow metadata are already included.
- If Google supplies an HTML verification file instead of DNS verification, place that exact file in `public/` before rebuilding.

## Content maintenance

- General interface translations: `app/content.json`
- English buyer guides: `app/articles.json`
- Other-language guides: `app/articles-*.json`
- Article FAQs in seven languages: `app/article-faqs.json`
- Product records and links: `app/page.tsx`
- Local product images: `public/products/`

Every future English guide should remain between 1,500 and 1,800 words and include 10–15 topic-specific FAQs. The homepage shows the three newest guides and the full library page preserves the complete list.

## Useful commands

```bash
npm run products:refresh  # refresh the ten product images from the recorded source URLs
npm run deploy:dry        # validate Cloudflare packaging without publishing
npm run validate:artifact # verify the generated Worker artifact
```
