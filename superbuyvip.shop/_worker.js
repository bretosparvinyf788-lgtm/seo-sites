const ROUTES = {
  '/spreadsheet/': {
    hash: '#/spreadsheet',
    title: 'Superbuy Spreadsheet 2026: Curated Finds & Product Research | SuperbuyVIP',
    description: 'Browse organized Superbuy spreadsheet finds and learn how to verify product details before ordering.'
  },
  '/w2c/': {
    hash: '#/w2c',
    title: 'Superbuy W2C Guide 2026: Find and Verify Product Links | SuperbuyVIP',
    description: 'A practical Superbuy W2C workflow for finding source links, checking listings and preparing orders.'
  },
  '/qc/': {
    hash: '#/qc',
    title: 'Superbuy QC Photos Guide 2026: Inspection and Photo Requests | SuperbuyVIP',
    description: 'Learn how to review Superbuy QC photos, request useful details and make timely return decisions.'
  },
  '/shipping/': {
    hash: '#/shipping',
    title: 'Superbuy Shipping Guide 2026: Routes, Weight and Parcel Planning | SuperbuyVIP',
    description: 'Plan Superbuy international shipping around chargeable weight, route restrictions, packaging and consolidation.'
  },
  '/shipping-usa/': {
    hash: '#/shipping-usa',
    title: 'Superbuy Shipping to the USA 2026 | SuperbuyVIP',
    description: 'Practical Superbuy parcel planning guidance for buyers shipping from China to the United States.'
  },
  '/shipping-uk/': {
    hash: '#/shipping-uk',
    title: 'Superbuy Shipping to the UK 2026 | SuperbuyVIP',
    description: 'Practical Superbuy parcel planning guidance for buyers shipping from China to the United Kingdom.'
  },
  '/shipping-canada/': {
    hash: '#/shipping-canada',
    title: 'Superbuy Shipping to Canada 2026 | SuperbuyVIP',
    description: 'Practical Superbuy parcel planning guidance for buyers shipping from China to Canada.'
  },
  '/shipping-australia/': {
    hash: '#/shipping-australia',
    title: 'Superbuy Shipping to Australia 2026 | SuperbuyVIP',
    description: 'Practical Superbuy parcel planning guidance for buyers shipping from China to Australia.'
  },
  '/coupons/': {
    hash: '#/coupons',
    title: 'Superbuy Coupons 2026: How Shipping Discounts Work | SuperbuyVIP',
    description: 'Understand how Superbuy shipping coupons, thresholds and validity periods affect parcel costs.'
  },
  '/fees/': {
    hash: '#/fees',
    title: 'Superbuy Fees 2026: Purchasing, Photos, Storage and Shipping | SuperbuyVIP',
    description: 'A transparent explanation of Superbuy purchasing fees, optional services, storage and international shipping charges.'
  },
  '/guides/': {
    hash: '#/guides',
    title: 'All Superbuy Buyer Guides 2026 | SuperbuyVIP',
    description: 'Browse every SuperbuyVIP buyer guide covering W2C research, QC photos, warehouse planning and international shipping.'
  },
  '/about/': {
    hash: '#/about',
    title: 'About SuperbuyVIP: Independent Editorial Policy',
    description: 'Read the independent editorial policy and research standards used by SuperbuyVIP.'
  },
  '/guides/superbuy-shipping-costs-2026/': {
    hash: '#/article/shipping',
    title: 'Superbuy Shipping Guide 2026: Costs, Volumetric Weight & Parcel Planning | SuperbuyVIP',
    description: 'A practical Superbuy shipping guide to chargeable weight, route compatibility, packaging decisions and realistic cost estimates.'
  },
  '/guides/superbuy-qc-photos/': {
    hash: '#/article/qc',
    title: 'Superbuy QC Photos Guide 2026: Free Images and Return Decisions | SuperbuyVIP',
    description: 'Turn Superbuy warehouse photos into useful evidence for sizing, condition checks and after-sales decisions.'
  },
  '/guides/superbuy-w2c/': {
    hash: '#/article/w2c',
    title: 'Superbuy W2C Guide 2026: Find Links and Order with Confidence | SuperbuyVIP',
    description: 'A complete Superbuy W2C path from product discovery and source-link verification to warehouse inspection.'
  }
};

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'x-frame-options': 'SAMEORIGIN'
};

function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function applyRouteMetadata(html, route, pathname) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = `https://superbuyvip.shop${pathname}`;

  html = html
    .replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);

  if (route.hash) {
    const script = `<script>if(!location.hash) location.hash=${JSON.stringify(route.hash)};<\/script>`;
    html = html.replace('</head>', `${script}\n</head>`);
  }
  return html;
}

async function fetchAsset(env, request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url.toString(), request));
}

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);

    let response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return addSecurityHeaders(response);

    if (url.pathname.endsWith('/')) {
      const directoryIndex = await fetchAsset(env, request, `${url.pathname}index.html`);
      if (directoryIndex.status !== 404) return addSecurityHeaders(directoryIndex);
    }

    const normalized = url.pathname === '/'
      ? '/'
      : `${url.pathname.replace(/\/+$/, '')}/`;
    const route = ROUTES[normalized];
    if (!route) return addSecurityHeaders(response);

    const homepage = await fetchAsset(env, request, '/index.html');
    if (homepage.status === 404) return addSecurityHeaders(homepage);

    const html = applyRouteMetadata(await homepage.text(), route, normalized);
    return new Response(request.method === 'HEAD' ? null : html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        ...SECURITY_HEADERS
      }
    });
  }
};
