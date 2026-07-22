const ROUTES = {
  'article-payments': '/guides/hipobuy-two-payment-workflow-shipping-budget-2026/',
  'article-beginner': '/guides/hipobuy-buying-workflow-2026/',
  'article-qc': '/guides/hipobuy-qc-photos-explained/',
  'article-fees': '/guides/hipobuy-shipping-coupons-costs/'
};

const SLASH = new Set([
  '/hipobuy-spreadsheet',
  '/hipobuy-qc-photos',
  '/hipobuy-shipping-calculator',
  '/hipobuy-fees',
  '/hipobuy-coupons',
  ...Object.values(ROUTES).map((x) => x.slice(0, -1))
]);

function redirect(request) {
  const url = new URL(request.url);
  let changed = false;

  if (url.protocol !== 'https:') {
    url.protocol = 'https:';
    changed = true;
  }

  if (['www.hipobuyvip.shop', 'hipobuyvip-shop.pages.dev'].includes(url.hostname)) {
    url.hostname = 'hipobuyvip.shop';
    changed = true;
  }

  if (SLASH.has(url.pathname)) {
    url.pathname += '/';
    changed = true;
  }

  return changed ? Response.redirect(url.toString(), 301) : null;
}

const latest = `<div class="story-grid"><article class="story-card feature"><a aria-label="Read Hipobuy two-payment workflow" class="story-art numeral" href="${ROUTES['article-payments']}">PAY</a><small>PAYMENT WORKFLOW · 15 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-payments']}">Hipobuy Two-Payment Workflow 2026: Avoid Shipping Cost Surprises</a></h3><p>Separate merchandise, domestic delivery and international freight before paying, then track coupons, corrections and refunds.</p><a href="${ROUTES['article-payments']}">READ STORY →</a></article><article class="story-card"><a aria-label="Read Hipobuy buying workflow" class="story-art numeral" href="${ROUTES['article-beginner']}">01</a><small>BEGINNER GUIDE · 12 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-beginner']}">Hipobuy Buying Workflow 2026: From Taobao or 1688 Link to Global Parcel</a></h3><p>A control-tower workflow built from Hipobuy’s purchasing, storage and global-shipping descriptions.</p><a href="${ROUTES['article-beginner']}">READ STORY →</a></article><article class="story-card"><a aria-label="Read Hipobuy QC guide" class="story-art checker" href="${ROUTES['article-qc']}">QC</a><small>QUALITY CONTROL · 9 MIN</small><h3><a class="story-title-link" href="${ROUTES['article-qc']}">Hipobuy QC Photos Explained: A Decision Protocol for Shoes and Clothing</a></h3><p>What official pages confirm, what they leave undefined and how to request decision-grade evidence.</p><a href="${ROUTES['article-qc']}">READ STORY →</a></article></div><button class="mobile-all-guides" data-open-panel="guide-hub" type="button">VIEW ALL SEO ARTICLES →</button>`;

const allGuides = `<div class="guide-hub-grid"><a class="guide-static-link" href="${ROUTES['article-payments']}"><span>04 · TWO-STAGE PAYMENT CONTROL</span><b>Hipobuy Two-Payment Workflow 2026: Avoid Shipping Cost Surprises</b><small>Merchandise payment, domestic delivery, warehouse decisions, international freight, duplicate-payment checks and refund tracking.</small></a><a class="guide-static-link" href="${ROUTES['article-beginner']}"><span>01 · OFFICIAL-SOURCE WORKFLOW</span><b>Hipobuy Buying Workflow 2026: From Taobao or 1688 Link to Global Parcel</b><small>Purchasing, warehouse control, 90-day storage, QC decisions and route selection.</small></a><a class="guide-static-link" href="${ROUTES['article-qc']}"><span>02 · QC EVIDENCE ENGINEERING</span><b>Hipobuy QC Photos Explained: A Decision Protocol for Shoes and Clothing</b><small>Identity, measurements, construction evidence, targeted requests and approval thresholds.</small></a><a class="guide-static-link" href="${ROUTES['article-fees']}"><span>03 · COST & CLAIM AUDIT</span><b>Hipobuy Shipping, Coupons and Costs: What Official Information Confirms</b><small>Coupon interpretation, displayed payments, storage scope, parcel billing and unconfirmed fees.</small></a></div>`;

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://hipobuyvip.shop/#website',
      name: 'HipoBuyVIP',
      alternateName: 'Hipobuy Spreadsheet 2026',
      url: 'https://hipobuyvip.shop/',
      description: 'Independent Hipobuy spreadsheet research with updated W2C finds, QC photo guidance, shipping tools, fee analysis and coupon checks.'
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
      name: 'Hipobuy Buyer Guides',
      itemListElement: Object.entries(ROUTES).map(([key, url], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://hipobuyvip.shop${url}`,
        name: key
      }))
    }
  ]
};

const hub = `<section class="seo-topic-hub" aria-labelledby="seo-topic-title"><div class="container"><div class="seo-topic-heading"><div><span>CORE HIPOBUY RESOURCES</span><h2 id="seo-topic-title">Everything to check before placing an order</h2></div><p>Start with updated finds, then review warehouse evidence, chargeable weight, fees and coupon conditions using a separate focused tool.</p></div><div class="seo-topic-grid"><a href="/hipobuy-spreadsheet/"><span>01</span><b>Hipobuy Spreadsheet 2026</b><small>W2C links, categories and QC evidence.</small></a><a href="/hipobuy-qc-photos/"><span>02</span><b>Hipobuy QC Photos</b><small>What warehouse photos prove.</small></a><a href="/hipobuy-shipping-calculator/"><span>03</span><b>Shipping Calculator</b><small>Estimate chargeable weight.</small></a><a href="/hipobuy-fees/"><span>04</span><b>Hipobuy Fees</b><small>Separate every cost layer.</small></a><a href="/hipobuy-coupons/"><span>05</span><b>Hipobuy Coupons</b><small>Check thresholds and route scope.</small></a></div></div></section>`;

const navScript = `<script>function setActiveNav(hash){if(hash==='#coupons')document.querySelector('#coupons')?.classList.add('open');document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===hash))}document.querySelectorAll('.nav-links a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.getAttribute('href'));if(!target)return;event.preventDefault();if(link.getAttribute('href')==='#coupons')target.classList.add('open');target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',link.getAttribute('href'));setActiveNav(link.getAttribute('href'));const nav=document.querySelector('.nav-links');if(window.innerWidth<=760&&nav)nav.removeAttribute('style')}));window.addEventListener('load',()=>{if(location.hash){setActiveNav(location.hash);setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'start'}),80)}});</script>`;

const style = `<style>
.review-independent-note{font:700 12px/1.5 Arial,sans-serif!important;color:#6e695f!important;border-left:5px solid #ff5538;padding-left:12px;margin:-12px 0 25px!important;max-width:650px}
.guide-hub-grid a.guide-static-link{border:1px solid #111;background:#fff;padding:20px;text-align:left;display:grid;gap:8px;box-shadow:5px 5px 0 rgba(17,17,17,.14);text-decoration:none;color:inherit}
.guide-hub-grid a.guide-static-link:hover{background:#bcff2e}
.guide-hub-grid a span{font:900 9px/1 Arial,sans-serif}
.guide-hub-grid a b{font:700 25px/1.08 Georgia,serif}
.guide-hub-grid a small{font:15px/1.4 Georgia,serif}
.story-grid a.story-art{display:grid;place-items:center;color:inherit;text-decoration:none}
.seo-topic-hub{padding:70px 0;background:#fffdf8;border-block:2px solid #101010}
.seo-topic-heading{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:end;margin-bottom:28px}
.seo-topic-heading h2{font:700 44px/1 Georgia,serif;margin:8px 0 0}
.seo-topic-grid{display:grid;grid-template-columns:repeat(5,1fr);border-left:2px solid #101010;border-top:2px solid #101010}
.seo-topic-grid a{min-height:180px;padding:18px;display:flex;flex-direction:column;border-right:2px solid #101010;border-bottom:2px solid #101010}
.seo-topic-grid b{font:700 23px/1.05 Georgia,serif;margin:22px 0 10px}
@media(max-width:980px){.seo-topic-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){
  .review-independent-note{font-size:10px!important;line-height:1.4!important;margin:-8px 0 18px!important}
  .lead-story h1{font-size:54px!important;letter-spacing:-3.5px!important}
  .seo-topic-hub{padding:36px 0}
  .seo-topic-heading{grid-template-columns:1fr;gap:8px;margin-bottom:15px}
  .seo-topic-heading h2{font-size:30px;line-height:1.03;margin-top:5px}
  .seo-topic-heading p{font-size:13px;line-height:1.38;margin:0}
  .seo-topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .seo-topic-grid a{min-height:108px;padding:11px 12px}
  .seo-topic-grid a:last-child{grid-column:1/-1;min-height:82px}
  .seo-topic-grid b{font-size:17px;line-height:1.05;margin:11px 0 5px}
  .seo-topic-grid small{font-size:11px;line-height:1.28}
}
</style>`;

function home(html) {
  html = html
    .replace(/<div class="story-grid">[\s\S]*?<\/article>\s*<\/div><button class="mobile-all-guides"[\s\S]*?<\/button>/, latest)
    .replace('Three guides worth reading first', 'Latest three Hipobuy buyer guides')
    .replace('Latest three buyer guides', 'Latest three Hipobuy buyer guides')
    .replace('<h2>Three complete guides</h2>', '<h2>All buyer guides</h2>')
    .replace(/<div class="guide-hub-grid">[\s\S]*?<\/div>\s*<\/article>/, `${allGuides}</article>`);

  for (const [panel, route] of Object.entries(ROUTES)) {
    html = html
      .replaceAll(`data-open-panel="${panel}" href="#${panel}"`, `href="${route}"`)
      .replaceAll(`href="#${panel}" data-open-panel="${panel}"`, `href="${route}"`)
      .replace(new RegExp(`<article class="embedded-panel seo-guide-panel" data-panel="${panel}">[\\s\\S]*?<\\/article>`, 'g'), '');
  }

  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>Hipobuy Spreadsheet 2026: Updated W2C Finds & QC Tools</title>')
    .replace(/<meta\s+content="[^"]*"\s+name="description"\s*\/?>/i, '<meta content="Browse updated Hipobuy W2C finds, category links, QC guidance, fee checks and a volumetric shipping calculator. Independent buyer research for 2026." name="description"/>')
    .replace(/<meta\s+content="noindex,nofollow"\s+name="robots"\s*\/?>/i, '<meta content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"/>')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${JSON.stringify(schema)}</script>${navScript}`)
    .replace(/<div class="topbar">[\s\S]*?<\/div>/i, '<div class="topbar">UPDATED JULY 2026 · INDEPENDENT HIPOBUY BUYER RESEARCH · CHECK LIVE TERMS BEFORE ORDERING</div>')
    .replace(/<span class="edition">[\s\S]*?<\/span>/i, '<span class="edition">UPDATED JULY 22, 2026</span>')
    .replace('<span class="story-label">THE BUYER\'S FRONT PAGE</span>', '<span class="story-label">UPDATED HIPOBUY SPREADSHEET · 2026</span>')
    .replace('<span class="story-label">HIPOBUY SPREADSHEET · 2026 EDITION</span>', '<span class="story-label">UPDATED HIPOBUY SPREADSHEET · 2026</span>')
    .replace('<h1>Find it.<br/><em>Check it.</em><br/>Ship it smarter.</h1>', '<h1>Hipobuy<br/><em>Spreadsheet</em><br/>2026.</h1>')
    .replace('Explore the Hipobuy Spreadsheet 2026 for organized W2C finds, QC photo guidance, shipping estimates, fee analysis and coupon checks. HipoBuyVIP is an independent research site, not the official Hipobuy website.', 'Browse updated Hipobuy W2C finds, product categories, QC checks and shipping tools. Compare links, inspect warehouse evidence and estimate chargeable parcel weight before ordering.')
    .replace('HipoBuyVIP turns scattered product links into useful buying context: W2C discovery, QC evidence, parcel-cost estimates and clear fee explanations.', 'Browse updated Hipobuy W2C finds, product categories, QC checks and shipping tools. Compare links, inspect warehouse evidence and estimate chargeable parcel weight before ordering.')
    .replace(/aria-label="Search SPREADSHEET products"/g, 'aria-label="Search the linked external product catalog"')
    .replace(/aria-label="Search products on SPREADSHEET"/g, 'aria-label="Search the linked external product catalog"')
    .replace(/aria-label="Search SPREADSHEET"/g, 'aria-label="Search external product catalog"')
    .replace('Search opens matching products in the SPREADSHEET catalog.', 'Search opens matching products in the linked external catalog. Return here to check QC, fees and shipping assumptions.')
    .replace('Search opens matching products in an external product catalog. HipoBuyVIP provides independent research and does not operate that catalog.', 'Search opens matching products in the linked external catalog. Return here to check QC, fees and shipping assumptions.')
    .replace('Browse the exact main-site categories', 'Browse Hipobuy spreadsheet categories')
    .replace('These labels and links mirror the current KakobuyMake category navigation.', 'Use these category shortcuts to explore the linked external product database, then return here for QC, fees and shipping checks.')
    .replace(/OPEN PRODUCT ON SPREADSHEET ↗/g, 'OPEN EXTERNAL PRODUCT ↗')
    .replace(/VISIT SPREADSHEET ↗/g, 'OPEN PRODUCT DATABASE ↗')
    .replace(/KAKOBUYMAKE PRODUCT FILE/g, 'EXTERNAL PRODUCT FILE')
    .replace(/OPEN PRODUCT ON KAKOBUYMAKE ↗/g, 'OPEN EXTERNAL PRODUCT ↗')
    .replace('Current colors, sizes, price and stock must be checked on KakobuyMake.', 'Current colors, sizes, price and stock must be checked on the linked external product page.')
    .replace(/<meta\s+content="[^"]*"\s+property="og:title"\s*\/?>/i, '<meta content="Hipobuy Spreadsheet 2026: Updated W2C Finds & QC Tools" property="og:title"/>')
    .replace(/<meta\s+content="[^"]*"\s+property="og:description"\s*\/?>/i, '<meta content="Updated Hipobuy spreadsheet research with W2C finds, QC checks, shipping tools, fee guidance and buyer guides." property="og:description"/>')
    .replace(/PREVIEW MODE\s*·\s*NOINDEX ENABLED/g, 'LIVE SITE · INDEXING ENABLED');

  const lead = '<p>Browse updated Hipobuy W2C finds, product categories, QC checks and shipping tools. Compare links, inspect warehouse evidence and estimate chargeable parcel weight before ordering.</p>';
  const note = '<p class="review-independent-note">HipoBuyVIP is an independent research resource and is not the official Hipobuy website.</p>';
  if (!html.includes('class="review-independent-note"')) {
    html = html.replace(lead, `${lead}${note}`);
  }

  if (!html.includes('class="seo-topic-hub"')) {
    html = html.replace('<section aria-label="Popular categories" class="ticker">', `${hub}<section aria-label="Popular categories" class="ticker">`);
  } else {
    html = html
      .replace(/<h2 id="seo-topic-title">[\s\S]*?<\/h2>/i, '<h2 id="seo-topic-title">Everything to check before placing an order</h2>')
      .replace(/<div class="seo-topic-heading">([\s\S]*?)<p>[\s\S]*?<\/p><\/div>/i, '<div class="seo-topic-heading">$1<p>Start with updated finds, then review warehouse evidence, chargeable weight, fees and coupon conditions using a separate focused tool.</p></div>');
  }

  return html.replace('</head>', `${style}</head>`);
}

export default {
  async fetch(request, env) {
    const responseRedirect = redirect(request);
    if (responseRedirect) return responseRedirect;

    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    let html = await response.text();
    if (url.pathname === '/' || url.pathname === '/index.html') html = home(html);

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
