# SugargooVIP GitHub deployment package

This folder is ready for a static GitHub or Cloudflare Pages deployment.

## Deploy with GitHub

1. Upload every file in this folder to the root of the target repository.
2. Keep `index.html` at the repository root.
3. Commit the files to the publishing branch.
4. For GitHub Pages, select **Deploy from a branch** and choose the repository root.

No build command or framework is required. The homepage remains in `index.html`; the buyer-guide library is available at `guides/index.html`, and every guide has its own crawlable directory URL.

The deployment package also includes an XML sitemap, per-page canonical URLs, structured data, an editorial and data policy, and visible review metadata. Keep the complete directory structure when publishing so `/guides/`, all seven article URLs and `/editorial-policy/` continue to resolve correctly.
