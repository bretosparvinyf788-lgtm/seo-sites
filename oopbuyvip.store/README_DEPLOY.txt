OOPBuyVIP.store — production static build v85

DEPLOYMENT TARGET
- Cloudflare Pages or GitHub Pages-compatible static hosting.
- No build command is required.
- Publish/output directory: the repository root containing index.html.

REQUIRED FILES
- index.html
- guides.html
- three article HTML files
- assets/
- robots.txt
- sitemap.xml
- 404.html
- _headers and _redirects (Cloudflare Pages)

CLOUDFLARE PAGES
1. Upload all files in this folder to the repository root.
2. Connect the repository to Cloudflare Pages.
3. Framework preset: None.
4. Build command: leave empty.
5. Build output directory: / (repository root).
6. Add custom domain oopbuyvip.store after deployment.
7. Verify /robots.txt, /sitemap.xml, /guides.html and all three article URLs.

IMPORTANT
- Do not upload the enclosing folder as a nested subfolder. index.html must be at the deployed root.
- The website uses relative internal links and can be served from any normal static web server.
