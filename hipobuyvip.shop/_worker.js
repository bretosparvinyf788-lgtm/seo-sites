const GUIDE_ROUTES = {
  'article-beginner': '/guides/hipobuy-buying-workflow-2026/',
  'article-qc': '/guides/hipobuy-qc-photos-explained/',
  'article-fees': '/guides/hipobuy-shipping-coupons-costs/'
};

function canonicalRedirect(request) {
  const url = new URL(request.url);
  let changed = false;

  if (url.protocol !== 'https:') {
    url.protocol = 'https:';
    changed = true;
  }

  if (url.hostname === 'www.hipobuyvip.shop') {
    url.hostname = 'hipobuyvip.shop';
    changed = true;
  }

  return changed ? Response.redirect(url.toString(), 301) : null;
}

function transformHomepage(html) {
  html = html
    .replace(
      /<meta\s+content="noindex,nofollow"\s+name="robots"\s*\/?>/i,
      '<meta content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"/>'
    )
    .replace(/PREVIEW MODE\s*·\s*NOINDEX ENABLED/g, 'LIVE SITE · INDEXING ENABLED');

  for (const [panel, route] of Object.entries(GUIDE_ROUTES)) {
    const anchorA = new RegExp(`data-open-panel="${panel}"\\s+href="#${panel}"`, 'g');
    const anchorB = new RegExp(`href="#${panel}"\\s+data-open-panel="${panel}"`, 'g');
    html = html
      .replace(anchorA, `href="${route}"`)
      .replace(anchorB, `href="${route}"`);
  }

  for (const panel of Object.keys(GUIDE_ROUTES)) {
    const embeddedArticle = new RegExp(
      `<article class="embedded-panel seo-guide-panel" data-panel="${panel}">[\\s\\S]*?<\\/article>`,
      'g'
    );
    html = html.replace(embeddedArticle, '');
  }

  for (const [panel, route] of Object.entries(GUIDE_ROUTES)) {
    const hubButton = new RegExp(
      `<button data-switch-panel="${panel}" type="button">([\\s\\S]*?)<\\/button>`,
      'g'
    );
    html = html.replace(hubButton, `<a class="guide-static-link" href="${route}">$1</a>`);
  }

  const guideStyles = `<style>
    .guide-hub-grid a.guide-static-link{border:1px solid #111;background:#fff;padding:20px;text-align:left;cursor:pointer;display:grid;gap:8px;box-shadow:5px 5px 0 rgba(17,17,17,.14);text-decoration:none;color:inherit}
    .guide-hub-grid a.guide-static-link:hover{background:#bcff2e}
    .guide-hub-grid a.guide-static-link span{font:900 9px/1 Arial,sans-serif;text-transform:uppercase}
    .guide-hub-grid a.guide-static-link b{font:700 25px/1.08 Georgia,serif}
    .guide-hub-grid a.guide-static-link small{font:15px/1.4 Georgia,serif}
  </style>`;

  return html.replace('</head>', `${guideStyles}</head>`);
}

export default {
  async fetch(request, env) {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;

    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) return response;

    let html = await response.text();
    if (url.pathname === '/' || url.pathname === '/index.html') {
      html = transformHomepage(html);
    }

    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'index, follow');
    headers.delete('content-length');

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
