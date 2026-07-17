const GUIDE_ROUTES = {
  'article-beginner': '/guides/hipobuy-buying-workflow-2026/',
  'article-qc': '/guides/hipobuy-qc-photos-explained/',
  'article-fees': '/guides/hipobuy-shipping-coupons-costs/'
};

const INDEXABLE_ROUTES = new Set([
  '/hipobuy-spreadsheet',
  '/hipobuy-qc-photos',
  '/hipobuy-shipping-calculator',
  '/hipobuy-fees',
  '/hipobuy-coupons',
  '/guides/hipobuy-buying-workflow-2026',
  '/guides/hipobuy-qc-photos-explained',
  '/guides/hipobuy-shipping-coupons-costs'
]);

function canonicalRedirect(request) {
  const url = new URL(request.url);
  let changed = false;

  if (url.protocol !== 'https:') {
    url.protocol = 'https:';
    changed = true;
  }

  if (url.hostname === 'www.hipobuyvip.shop' || url.hostname === 'hipobuyvip-shop.pages.dev') {
    url.hostname = 'hipobuyvip.shop';
    changed = true;
  }

  if (INDEXABLE_ROUTES.has(url.pathname)) {
    url.pathname += '/';
    changed = true;
  }

  return changed ? Response.redirect(url.toString(), 301) : null;
}

function transformHomepage(html) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://hipobuyvip.shop/#website',
        name: 'HipoBuyVIP',
        alternateName: 'Hipobuy Spreadsheet 2026',
        url: 'https://hipobuyvip.shop/',
        description: 'Independent Hipobuy spreadsheet research with W2C finds, QC photo guidance, shipping tools, fee analysis and coupon checks.'
      },
      {
        '@type': 'Organization',
        '@id': 'https://hipobuyvip.shop/#organization',
        name: 'HipoBuyVIP',
        url: 'https://hipobuyvip.shop/',
        description: 'Independent buyer education and product discovery resource. Not the official Hipobuy website.'
      },
      {
        '@type': 'ItemList',
        name: 'Hipobuy Spreadsheet Research Tools',
        itemListElement: [
          {'@type': 'ListItem', position: 1, url: 'https://hipobuyvip.shop/hipobuy-spreadsheet/', name: 'Hipobuy Spreadsheet 2026'},
          {'@type': 'ListItem', position: 2, url: 'https://hipobuyvip.shop/hipobuy-qc-photos/', name: 'Hipobuy QC Photos'},
          {'@type': 'ListItem', position: 3, url: 'https://hipobuyvip.shop/hipobuy-shipping-calculator/', name: 'Hipobuy Shipping Calculator'},
          {'@type': 'ListItem', position: 4, url: 'https://hipobuyvip.shop/hipobuy-fees/', name: 'Hipobuy Fees'},
          {'@type': 'ListItem', position: 5, url: 'https://hipobuyvip.shop/hipobuy-coupons/', name: 'Hipobuy Coupons'}
        ]
      }
    ]
  };

  const navScript = `<script>
  function setActiveNav(hash){
    if(hash === '#coupons') document.querySelector('#coupons')?.classList.add('open');
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  }
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link=>{
    link.addEventListener('click', event=>{
      const target = document.querySelector(link.getAttribute('href'));
      if(!target) return;
      event.preventDefault();
      if(link.getAttribute('href') === '#coupons') target.classList.add('open');
      target.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null,'',link.getAttribute('href'));
      setActiveNav(link.getAttribute('href'));
      const nav = document.querySelector('.nav-links');
      if(window.innerWidth <= 760 && nav) nav.removeAttribute('style');
    });
  });
  window.addEventListener('load', ()=>{
    if(location.hash){
      setActiveNav(location.hash);
      setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'start'}),80);
    }
  });
  </script>`;

  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>Hipobuy Spreadsheet 2026 — W2C Finds, QC Photos & Shipping Guide</title>')
    .replace(
      /<meta\s+content="[^"]*"\s+name="description"\s*\/?>/i,
      '<meta content="Explore the Hipobuy Spreadsheet 2026 with organized W2C finds, QC photo guidance, shipping tools, fee analysis, coupon checks and independent buyer guides." name="description"/>'
    )
    .replace(
      /<meta\s+content="noindex,nofollow"\s+name="robots"\s*\/?>/i,
      '<meta content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"/>'
    )
    .replace(
      /<meta\s+content="[^"]*"\s+property="og:title"\s*\/?>/i,
      '<meta content="Hipobuy Spreadsheet 2026 — W2C Finds, QC Photos & Shipping Guide" property="og:title"/>'
    )
    .replace(
      /<meta\s+content="[^"]*"\s+property="og:description"\s*\/?>/i,
      '<meta content="Independent Hipobuy spreadsheet research with W2C finds, QC photo guidance, shipping tools, fees, coupons and practical buyer guides." property="og:description"/>'
    )
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>${navScript}`
    )
    .replace(
      '<span class="story-label">THE BUYER\'S FRONT PAGE</span>',
      '<span class="story-label">HIPOBUY SPREADSHEET · 2026 EDITION</span>'
    )
    .replace(
      '<h1>Find it.<br/><em>Check it.</em><br/>Ship it smarter.</h1>',
      '<h1>Hipobuy<br/><em>Spreadsheet</em><br/>2026.</h1>'
    )
    .replace(
      'HipoBuyVIP turns scattered product links into useful buying context: W2C discovery, QC evidence, parcel-cost estimates and clear fee explanations.',
      'Explore the Hipobuy Spreadsheet 2026 for organized W2C finds, QC photo guidance, shipping estimates, fee analysis and coupon checks. HipoBuyVIP is an independent research site, not the official Hipobuy website.'
    )
    .replace(/aria-label="Search SPREADSHEET products"/g, 'aria-label="Search the linked external product catalog"')
    .replace(/aria-label="Search products on SPREADSHEET"/g, 'aria-label="Search the linked external product catalog"')
    .replace(/aria-label="Search SPREADSHEET"/g, 'aria-label="Search external product catalog"')
    .replace(
      'Search opens matching products in the SPREADSHEET catalog.',
      'Search opens matching products in an external product catalog. HipoBuyVIP provides independent research and does not operate that catalog.'
    )
    .replace('Browse the exact main-site categories', 'Browse Hipobuy spreadsheet categories')
    .replace(
      'These labels and links mirror the current KakobuyMake category navigation.',
      'Use these category shortcuts to explore the linked external product database, then return here for QC, fees and shipping checks.'
    )
    .replace(/OPEN PRODUCT ON SPREADSHEET ↗/g, 'OPEN EXTERNAL PRODUCT ↗')
    .replace(/VISIT SPREADSHEET ↗/g, 'OPEN PRODUCT DATABASE ↗')
    .replace(/KAKOBUYMAKE PRODUCT FILE/g, 'EXTERNAL PRODUCT FILE')
    .replace(/OPEN PRODUCT ON KAKOBUYMAKE ↗/g, 'OPEN EXTERNAL PRODUCT ↗')
    .replace(
      'Current colors, sizes, price and stock must be checked on KakobuyMake.',
      'Current colors, sizes, price and stock must be checked on the linked external product page.'
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

  const seoHub = `<section class="seo-topic-hub" aria-labelledby="seo-topic-title">
    <div class="container">
      <div class="seo-topic-heading">
        <div><span>CORE HIPOBUY RESOURCES</span><h2 id="seo-topic-title">Start with the question you need answered</h2></div>
        <p>Five indexable research pages separate product discovery, warehouse evidence, shipping estimates, fees and coupons instead of mixing every search intent on one page.</p>
      </div>
      <div class="seo-topic-grid">
        <a href="/hipobuy-spreadsheet/"><span>01</span><b>Hipobuy Spreadsheet 2026</b><small>How to use W2C links, categories and QC evidence together.</small></a>
        <a href="/hipobuy-qc-photos/"><span>02</span><b>Hipobuy QC Photos</b><small>What warehouse photos prove and what to request next.</small></a>
        <a href="/hipobuy-shipping-calculator/"><span>03</span><b>Shipping Calculator</b><small>Estimate chargeable weight from packed weight and dimensions.</small></a>
        <a href="/hipobuy-fees/"><span>04</span><b>Hipobuy Fees</b><small>Separate item price, payment, add-ons and international shipping.</small></a>
        <a href="/hipobuy-coupons/"><span>05</span><b>Hipobuy Coupons</b><small>Understand bundle values, thresholds, route scope and checkout validation.</small></a>
      </div>
    </div>
  </section>`;

  if (!html.includes('class="seo-topic-hub"')) {
    html = html.replace(
      '<section aria-label="Popular categories" class="ticker">',
      `${seoHub}<section aria-label="Popular categories" class="ticker">`
    );
  }

  const guideStyles = `<style>
    .guide-hub-grid a.guide-static-link{border:1px solid #111;background:#fff;padding:20px;text-align:left;cursor:pointer;display:grid;gap:8px;box-shadow:5px 5px 0 rgba(17,17,17,.14);text-decoration:none;color:inherit}
    .guide-hub-grid a.guide-static-link:hover{background:#bcff2e}
    .guide-hub-grid a.guide-static-link span{font:900 9px/1 Arial,sans-serif;text-transform:uppercase}
    .guide-hub-grid a.guide-static-link b{font:700 25px/1.08 Georgia,serif}
    .guide-hub-grid a.guide-static-link small{font:15px/1.4 Georgia,serif}
    .seo-topic-hub{padding:70px 0;background:#fffdf8;border-top:2px solid #101010;border-bottom:2px solid #101010}
    .seo-topic-heading{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:end;margin-bottom:28px}
    .seo-topic-heading span{font:900 10px/1 Arial,sans-serif;letter-spacing:1px}
    .seo-topic-heading h2{font:700 44px/1 Georgia,serif;margin:8px 0 0}
    .seo-topic-heading p{font:17px/1.5 Georgia,serif;color:#5e584f;margin:0}
    .seo-topic-grid{display:grid;grid-template-columns:repeat(5,1fr);border-left:2px solid #101010;border-top:2px solid #101010}
    .seo-topic-grid a{min-height:210px;padding:18px;display:flex;flex-direction:column;border-right:2px solid #101010;border-bottom:2px solid #101010;text-decoration:none;color:inherit}
    .seo-topic-grid a:hover{background:#c8f43d}
    .seo-topic-grid span{font:900 10px/1 Arial,sans-serif}
    .seo-topic-grid b{font:700 25px/1.05 Georgia,serif;margin:24px 0 12px}
    .seo-topic-grid small{font:15px/1.45 Georgia,serif;color:#5e584f}
    @media(max-width:980px){.seo-topic-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:700px){.seo-topic-heading{grid-template-columns:1fr}.seo-topic-grid{grid-template-columns:1fr}.seo-topic-heading h2{font-size:36px}}
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
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.delete('content-length');

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
