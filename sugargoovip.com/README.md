# SugargooVIP GitHub deployment package

This folder is ready for a static GitHub or Cloudflare Pages deployment.

## Deploy with GitHub

1. Upload every file in this folder to the root of the target repository.
2. Keep `index.html` at the repository root.
3. Commit the files to the publishing branch.
4. For GitHub Pages, select **Deploy from a branch** and choose the repository root.

No build command or framework is required. The homepage, all-guides view, three complete articles, translations, images, logo, VIP badge and favicon are embedded in `index.html`.

The site uses hash-based article routes so every guide works on GitHub Pages and when `index.html` is opened locally.
