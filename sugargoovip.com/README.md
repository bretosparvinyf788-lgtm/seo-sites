# SugargooVIP GitHub deployment package

This folder is ready for a static Cloudflare Pages deployment.

## Deploy with GitHub

Cloudflare Pages publishes this directory from the repository `main` branch. No build command or framework is required.

- `index.html` is the interactive homepage.
- `guides/index.html` is the crawlable guide library.
- Each article lives at its own trailing-slash URL under `guides/`.
- `_redirects` enforces the HTTPS apex host and canonical trailing slashes.
- `_headers` adds baseline security and long-lived asset caching.
- `sitemap.xml` lists the homepage, guide library and all articles.
- `e397484eaa79e12fd7bfc06e640a0cdf.txt` verifies IndexNow submissions for Bing and participating search engines.

The site intentionally avoids hash-based article routes so search engines can crawl, index and report every guide separately.
