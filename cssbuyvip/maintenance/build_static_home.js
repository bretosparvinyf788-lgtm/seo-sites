const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'assets', 'site.css');
const jsPath = path.join(root, 'assets', 'site.js');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function extractAssets() {
  const source = fs.readFileSync(indexPath, 'utf8');
  if (!fs.existsSync(cssPath)) {
    const style = source.match(/<style>([\s\S]*?)<\/style>/);
    if (!style) throw new Error('Inline stylesheet not found');
    fs.writeFileSync(cssPath, `${style[1].trim()}\n`, 'utf8');
  }
  if (!fs.existsSync(jsPath)) {
    const script = source.match(/<body>[\s\S]*?<script>([\s\S]*?)<\/script>\s*<\/body>/);
    if (!script) throw new Error('Inline site script not found');
    fs.writeFileSync(jsPath, `${script[1].trim()}\n`, 'utf8');
  }
}

function readSiteData() {
  const script = fs.readFileSync(jsPath, 'utf8');
  const match = script.match(/const SITE_DATA = (\{[\s\S]*\});\nlet currentLang/);
  if (!match) throw new Error('SITE_DATA not found in assets/site.js');
  return JSON.parse(match[1]);
}

function articleUrl(key) {
  const legacy = {
    spreadsheet: '/guides/best-cssbuy-spreadsheet-2026/',
    shipping: '/guides/cssbuy-shipping-cost-guide/',
    qc: '/guides/cssbuy-qc-photos-guide/',
    'cssbuy-transaction-safe-haul-planning': '/blog/2026-07-10-cssbuy-transaction-safe-haul-planning'
  };
  return legacy[key] || `/guides/${key}/`;
}

function logo() {
  return '<img class="brand-inline-logo" src="/assets/cssbuy-logo.svg" width="145" height="39" alt="CSSBuyVip">';
}

function renderHome(data) {
  const categories = data.categories.en.map((category) => `
        <a class="category-card card" href="${esc(category.url)}" rel="noopener">
          <span class="category-icon" aria-hidden="true">${category.icon}</span>
          <h3>${esc(category.title)}</h3><p>${esc(category.desc)}</p>
          <span class="category-link">Open category →</span>
        </a>`).join('');
  const products = data.products.en.map((product, index) => `
        <article class="product-card card">
          <a href="${esc(product.link)}" rel="noopener" aria-label="${esc(product.title)}">
            <div class="product-media"><img src="${esc(product.img)}" width="520" height="520" loading="lazy" decoding="async" alt="${esc(product.title)} CSSBuy spreadsheet find"></div>
          </a>
          <div class="product-body"><div class="product-meta"><span>CSSBuy Find</span><span>Pick ${String(index + 1).padStart(2, '0')}</span></div>
            <h3>${esc(product.title)}</h3><div class="product-price">${esc(product.price)}</div>
            <div class="product-cta-row single-cta"><a class="outline-link primary-open" href="${esc(product.link)}" rel="noopener">View product</a></div>
          </div>
        </article>`).join('');
  const overview = data.overviewCards.en.map((card) => `
        <article class="overview-card"><div class="overview-icon" aria-hidden="true">${card.icon}</div><h3>${esc(card.title)}</h3><p>${esc(card.desc)}</p></article>`).join('');
  const faqs = data.faq.en.map((faq, index) => `
        <details${index === 0 ? ' open' : ''}><summary>${esc(faq[0])}</summary><p>${esc(faq[1])}</p></details>`).join('');
  const guides = data.articles.en.slice(0, 3).map((article) => `
        <article class="guide-card"><h3>${esc(article.title)}</h3><p>${esc(article.excerpt)}</p><a class="guide-link" href="${articleUrl(article.key)}">Read full article →</a></article>`).join('');
  const itemList = data.products.en.map((product, index) => ({
    '@type': 'ListItem', position: index + 1, url: product.link, name: product.title
  }));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds</title>
<meta name="description" content="Browse 10 current CSSBuy spreadsheet finds with real product images, organized categories, W2C destinations, QC guidance, prices and practical buyer guides.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="https://cssbuyvip.shop/">
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=cssbuy-20260831">
<link rel="apple-touch-icon" href="/favicon.svg?v=cssbuy-20260831">
<link rel="preconnect" href="https://kakobuymake.com" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=20260831">
<meta property="og:type" content="website">
<meta property="og:title" content="CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds">
<meta property="og:description" content="Browse current CSSBuy spreadsheet finds with product images, categories, prices, W2C destinations and QC guidance.">
<meta property="og:url" content="https://cssbuyvip.shop/">
<meta property="og:image" content="https://cssbuyvip.shop/assets/og-cssbuy-spreadsheet.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://cssbuyvip.shop/assets/og-cssbuy-spreadsheet.png">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'CSSBuyVip Spreadsheet',
    url: 'https://cssbuyvip.shop/', description: 'A product-first CSSBuy spreadsheet resource for W2C links, QC photos, product finds and category research.'
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Featured CSSBuy Spreadsheet Finds', itemListElement: itemList
  })}</script>
</head>
<body>
<div id="app" class="app-view">
  <header class="top"><div class="wrap nav">
    <a class="brand" href="/"><span class="mark logo-mark">${logo()}</span><span class="brand-text">CSSBuyVip</span></a>
    <nav class="links" aria-label="Primary navigation"><a href="/">Home</a><a href="#quick-overview">Overview</a><a href="#categories">Categories</a><a href="#featured-products">Products</a><a href="#faq">FAQ</a><a href="/guides/">Guides</a></nav>
    <div class="lang-switch"><label class="lang-select-wrap"><span class="sr-only">Select language</span><select class="lang-select" aria-label="Select language"><option>English</option><option>Español</option><option>Deutsch</option><option>Português</option><option>中文</option></select><span class="lang-select-arrow">▾</span></label></div>
  </div></header>
  <main>
    <section class="hero" id="home"><div class="wrap grid"><div><span class="eyebrow">Independent CSSBuy spreadsheet · Updated August 2026</span><h1>The Best CSSBuy Spreadsheet for W2C Links, QC Photos and Latest Finds.</h1><p class="lead">Browse a product-first CSSBuy spreadsheet hub with 10 current finds, real product images, organized categories, W2C destinations, QC guidance and shipping-relevant details.</p><div class="btns"><a class="btn" href="/cssbuy-spreadsheet/">Open Spreadsheet</a><a class="btn secondary" href="/guides/">Buyer Guides</a></div></div></div></section>
    <section class="section" id="quick-overview"><div class="wrap"><div class="section-head"><div><div class="products-bigpill h2like">CSSBuy Spreadsheet Overview</div><p class="products-subtitle">Use live product destinations, current prices, QC checks and shipping notes to shortlist each find.</p></div></div><div class="overview-panel"><div class="overview-card-grid">${overview}</div></div></div></section>
    <section class="section" id="categories"><div class="wrap"><div class="section-head"><div><div class="category-bigpill h2like">Browse CSSBuy Finds by Category</div><p class="category-subtitle">Ten product categories connected to the main catalog.</p></div></div><div class="category-grid">${categories}</div></div></section>
    <section class="section" id="featured-products"><div class="wrap"><div class="section-head"><div><div class="products-bigpill h2like">10 Featured CSSBuy Spreadsheet Finds</div><p class="products-subtitle">Real product images, prices and direct product destinations. Recheck every live listing before ordering.</p></div></div><div class="product-grid">${products}</div></div></section>
    <section class="section faq" id="faq"><div class="wrap"><h2>CSSBuy Spreadsheet FAQ</h2>${faqs}</div></section>
    <section class="latest-guides" id="latest-guides"><div class="wrap"><div class="guides-head"><div><h2>Latest CSSBuy Buyer Guides</h2><p>The three newest independent walkthroughs, ordered newest first.</p></div><a class="outline-link" href="/guides/">View All Buyer Guides</a></div><div class="guide-grid">${guides}</div></div></section>
  </main>
  <footer class="foot"><div class="wrap"><div class="footer-grid"><div class="footer-brand"><div class="brand"><span class="mark logo-mark">${logo()}</span><span class="brand-text">CSSBuyVip</span></div><p>Independent CSSBuy spreadsheet, product discovery and buyer-guide resource.</p></div><div class="footer-col"><h3>Explore</h3><a href="#quick-overview">Overview</a><a href="#categories">Categories</a><a href="#featured-products">Products</a></div><div class="footer-col"><h3>Guides</h3><a href="/guides/">All Buyer Guides</a><a href="/blog/">Article Archive</a><a href="#faq">FAQ</a></div></div><div class="footer-bottom"><span>© 2026 CSSBuyVip</span><span>Independent guide hub · Not affiliated with CSSBuy.</span></div></div></footer>
</div>
<script defer src="/assets/site.js?v=20260831"></script>
</body>
</html>`;
}

extractAssets();
const data = readSiteData();
fs.writeFileSync(indexPath, renderHome(data), 'utf8');
console.log('Generated a crawlable static homepage and externalized CSS/JavaScript assets.');
