# CSSBuy VIP

Full source for https://cssbuyvip.com.

## Cloudflare Pages

- Existing project: `cssbuyvip-com`
- Repository: `bretosparvinyf788-lgtm/seo-sites`, branch `main`
- Root directory: `cssbuyvip.com`
- Build command: `python3 build.py`
- Build output directory: `dist`
- Watched path: `cssbuyvip.com/*`

The site lives inside `dist`. Publishing the repository root (`.`) uses the wrong output and must not be restored. These settings were corrected on 2026-11-28 after the public domain continued to show the old site.

## Validation

```sh
python3 build.py
node --check dist/app.js
node --check dist/visual-search.js
python3 verify_site.py
```

The imported snapshot contains 4,771 products from 4,777 source records. The source image audit and native-speaker translation review remain incomplete; deployment does not change those limitations.

The private Sites preview retains its own identity and analytics configuration. This repository is the source for the existing public Cloudflare Pages project.
