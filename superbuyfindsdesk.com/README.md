# Superbuy Finds Desk

Production: https://superbuyfindsdesk.com

This directory contains the complete website source, product catalogue, seeded product details, translated help content, and build scripts.

Cloudflare Worker: `superbuyfindsdesk-com`

## Automatic deployment

Cloudflare Workers Builds watches `main` in `bretosparvinyf788-lgtm/seo-sites`, limited to changes in `superbuyfindsdesk.com/`.

- Root directory: `superbuyfindsdesk.com`
- Build command: `npm run check && npm run build`
- Deploy command: `npm run deploy:cloudflare`
- Runtime: Node.js 22 or later

The deploy script uses the Cloudflare API token injected by Workers Builds and `CLOUDFLARE_ACCOUNT_ID`. No credentials are stored in this repository. Existing domain bindings are preserved during deployment.

## Local validation

```sh
npm run check
npm run build
```
