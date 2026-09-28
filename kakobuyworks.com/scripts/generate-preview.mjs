import { writeFile } from 'node:fs/promises';
import { getCategories, getProduct, getProductPage, getProducts } from '../src/lib/source.ts';
import { getCopy, getQcCopy, languageOrder, languages } from '../src/lib/i18n.ts';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

async function mapConcurrent(items, limit, task) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function withRetry(task, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await task(); } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    }
  }
  throw lastError;
}

const categories = (await getCategories()).filter((category) => category.id !== '1').slice(0, 10);
const sourceProducts = (await getProducts({ categoryId: '1', page: 2 })).slice(0, 12);
const firstCategoryPages = await mapConcurrent(categories, 4, async (category) => [
  category.id,
  await withRetry(() => getProductPage({ categoryId: category.id, page: 1 }))
]);
const pageJobs = firstCategoryPages.flatMap(([categoryId, result]) =>
  Array.from({ length: Math.max(0, result.totalPages - 1) }, (_, index) => ({ categoryId, page: index + 2 }))
);
const remainingCategoryPages = await mapConcurrent(pageJobs, 8, async ({ categoryId, page }) => ({
  categoryId,
  page,
  products: (await withRetry(() => getProductPage({ categoryId, page }))).products
}));
const categorySources = Object.fromEntries(firstCategoryPages.map(([categoryId, result]) => [
  categoryId,
  [
    ...result.products,
    ...remainingCategoryPages.filter((entry) => entry.categoryId === categoryId).sort((a, b) => a.page - b.page).flatMap((entry) => entry.products)
  ]
]));
const allSummaries = Array.from(new Map(
  [...sourceProducts, ...Object.values(categorySources).flat()].map((product) => [product.id, product])
).values());
let detailProgress = 0;
const details = (await mapConcurrent(allSummaries, 12, async (product) => {
  try { return await withRetry(() => getProduct(product.id), 3); } catch { return null; }
  finally {
    detailProgress += 1;
    if (detailProgress % 100 === 0 || detailProgress === allSummaries.length) console.log(`Loaded ${detailProgress}/${allSummaries.length} product details`);
  }
})).filter(Boolean);
const detailById = new Map(details.map((product) => [product.id, product]));
const products = sourceProducts.filter((product) => detailById.get(product.id)?.kakobuyUrl);
const categoryProducts = Object.fromEntries(categories.map((category) => [
  category.id,
  categorySources[category.id].filter((product) => detailById.get(product.id)?.kakobuyUrl)
]));
const en = getCopy('en');

const localeData = Object.fromEntries(languageOrder.map((code) => {
  const copy = getCopy(code);
  const qc = getQcCopy(code);
  return [code, {
    values: {
      'nav-home': copy.nav.home,
      'nav-sheet': copy.nav.spreadsheet,
      'nav-categories': copy.nav.categories,
      'nav-faq': copy.nav.faq,
      'hero-eyebrow': copy.hero.eyebrow,
      'hero-title': copy.hero.title,
      'hero-body': copy.hero.body,
      'search-label': copy.hero.search,
      'quick-label': copy.sections.categories,
      'categories-kicker': copy.sections.sourceLive,
      'categories-title': copy.sections.categories,
      'categories-body': copy.sections.categoriesBody,
      'products-kicker': copy.sections.sourceLive,
      'products-title': copy.sections.recent,
      'products-body': copy.sections.recentBody,
      'products-link': copy.sections.viewAll,
      'about-title': copy.seo.title,
      'about-body': copy.seo.body,
      'feature-search-title': copy.seo.searchTitle,
      'feature-search-body': copy.seo.searchBody,
      'feature-photos-title': copy.seo.photosTitle,
      'feature-photos-body': copy.seo.photosBody,
      'feature-checkout-title': copy.seo.checkoutTitle,
      'feature-checkout-body': copy.seo.checkoutBody,
      'faq-title': copy.faqTitle,
      'faq-body': copy.seo.body,
      'cta-kicker': copy.sections.sourceLive,
      'cta-title': copy.hero.browse,
      'cta-link': copy.sections.viewAll,
      'footer-copy': copy.seo.body,
      'detail-back': `← ${copy.nav.spreadsheet}`,
      'detail-gallery': copy.product.gallery,
      'detail-notice': copy.product.currentNotice,
      'detail-buy': copy.product.openKakobuy,
      'detail-listing': qc.listing,
      'detail-qc-title': qc.title,
      'detail-qc-body': qc.body
    },
    placeholder: copy.hero.placeholder,
    category: {
      back: `← ${copy.nav.home}`,
      kicker: copy.sections.sourceLive,
      body: copy.listing.body,
      all: copy.sections.viewAll,
      details: copy.sections.details
    },
    qcPhotos: qc.photos,
    faqs: copy.faqs
  }];
}));
const localeJson = JSON.stringify(localeData).replaceAll('<', '\\u003c');
const previewProductJson = JSON.stringify(Object.fromEntries(allSummaries.filter((product) => detailById.get(product.id)?.kakobuyUrl).map((product) => {
  const detail = detailById.get(product.id);
  return [product.id, {
    id: product.id,
    title: product.title,
    price: product.priceLabel,
    category: detail.category,
    marketplaceId: detail.marketplaceId,
    gallery: detail.gallery.length ? detail.gallery : [product.image],
    kakobuyUrl: detail.kakobuyUrl
  }];
}))).replaceAll('<', '\\u003c');

const languageOptions = languageOrder
  .map((code) => {
    const item = languages[code];
    return `<option value="${code}">${escapeHtml(item.label)} · ${escapeHtml(item.short)}</option>`;
  })
  .join('');

const languageButtons = languageOrder
  .map((code) => {
    const item = languages[code];
    return `<button type="button" data-language="${code}"><span>${escapeHtml(item.label)}</span><small>${escapeHtml(item.short)}</small></button>`;
  })
  .join('');

const categoryHtml = categories.map((category, index) => `
  <a class="category" href="#category-${category.id}" aria-label="${escapeHtml(category.name)}">
    <span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(en.sections.details)} →</small>
  </a>`).join('');

const quickCategoryHtml = categories.slice(0, 3)
  .map((category) => `<a href="#category-${category.id}">${escapeHtml(category.name)} →</a>`)
  .join('');

const renderProductCard = (product, searchable = false, href = `#product-${product.id}`, attributes = '') => `
  <a class="product" ${searchable ? `data-product="${product.id}" data-title="${escapeHtml(product.title.toLowerCase())}"` : ''} ${attributes} href="${escapeHtml(href)}">
    <span class="photo"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy" referrerpolicy="no-referrer"></span>
    <span class="copy"><small>kakobuymake.com</small><strong>${escapeHtml(product.title)}</strong><span><b>${escapeHtml(product.priceLabel)}</b></span></span>
  </a>`;

const productHtml = products.map((product) => renderProductCard(product, true)).join('');

const categoryChipHtml = categories
  .map((category) => `<a href="#category-${category.id}">${escapeHtml(category.name)}</a>`)
  .join('');

const categoryViewHtml = categories.map((category) => `
  <section class="category-page" data-category-page="${category.id}" hidden>
    <div class="category-page-hero"><div class="shell">
      <a class="category-back" href="#categories" data-category-copy="back">← Home</a>
      <span class="kicker" data-category-copy="kicker">Live source</span>
      <h1>${escapeHtml(category.name)} Kakobuy Spreadsheet</h1>
      <p><span data-category-copy="body">Browse the current public catalog from kakobuymake.com.</span> ${escapeHtml(category.name)}.</p>
    </div></div>
    <div class="section"><div class="shell">
      <nav class="category-chips" aria-label="Categories">${categoryChipHtml}</nav>
      <div class="category-toolbar"><strong data-category-summary>Page 1 of ${Math.ceil(categoryProducts[category.id].length / 50)} · ${categoryProducts[category.id].length} products</strong><a href="#products" data-category-copy="all">View all products</a></div>
      <div class="products">${categoryProducts[category.id].map((product, index) => renderProductCard(product, false, `#product-${product.id}`, `data-catalog-card data-catalog-page="${Math.floor(index / 50) + 1}"${index >= 50 ? ' hidden' : ''}`)).join('')}</div>
      <nav class="catalog-pagination" aria-label="Catalog pagination" data-category-pagination>${Array.from({ length: Math.ceil(categoryProducts[category.id].length / 50) }, (_, index) => index === 0 ? `<span aria-current="page">1</span>` : `<a href="#category-${category.id}-page-${index + 1}">${index + 1}</a>`).join('')}</nav>
      <div class="category-seo"><span class="kicker">${escapeHtml(category.name)} FINDS</span><h2>Compare ${escapeHtml(category.name)} listings before opening Kakobuy</h2><p>Review prices, source photos and available QC references on this site. Open a product page for the full gallery, then continue to Kakobuy only when you are ready to verify the seller listing.</p></div>
    </div></div>
  </section>`).join('');

const faqHtml = en.faqs.map(([question, answer]) => `
  <details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kakobuy Spreadsheet — kakobuyworks.com preview</title><link rel="icon" href="https://www.kakobuy.com/favicon.ico">
<style>
:root{--ink:#171717;--muted:#69625f;--line:#e8e3df;--soft:#faf7f4;--brand:#c84618;--accent:#ef3150;--shadow:0 18px 44px #4e2f2117}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:#fff;font:16px/1.62 Arial,sans-serif}a{text-decoration:none;color:inherit}img{display:block;max-width:100%}[hidden]{display:none!important}.shell{width:min(1280px,calc(100% - 48px));margin:auto}.top{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid var(--line)}.nav{min-height:76px;display:flex;align-items:center;gap:25px}.brand{display:flex;align-items:center;gap:9px;flex:none}.brand img{width:146px}.brand b{padding-left:9px;border-left:1px solid var(--line);font-size:11px;letter-spacing:.15em}.nav nav{display:flex;align-self:stretch;align-items:center;gap:25px;margin-left:auto;font-size:14px;font-weight:700}.nav nav a:first-child{height:100%;display:flex;align-items:center;color:var(--brand);border-bottom:3px solid var(--accent)}.nav-search{width:min(260px,20vw);display:flex;padding:5px 5px 5px 12px;border:1px solid var(--line);border-radius:11px}.nav-search input{min-width:0;width:100%;border:0;outline:0}.nav-search button{width:38px;border:0;border-radius:8px;color:#fff;background:var(--brand)}.nav select,.nav .cta{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:#fff}.nav .cta{color:#fff;background:var(--brand);border-color:var(--brand);font-weight:700}.hero{position:relative;overflow:hidden;min-height:520px;display:grid;place-items:center;text-align:center;background:#fffaf7;border-bottom:1px solid var(--line)}.hero:before,.hero:after{content:'';position:absolute;background:#f3f8fb}.hero:before{left:8%;top:25%;width:88px;height:88px;border-radius:50%}.hero:after{right:10%;top:45%;width:86px;height:86px;border-radius:24px;background:#fff0eb;transform:rotate(18deg)}.hero>div{position:relative;z-index:1;max-width:920px;padding:72px 0 35px}.eyebrow,.kicker{color:var(--brand);font-weight:800;font-size:12px;letter-spacing:.11em;text-transform:uppercase}.hero h1{font-size:clamp(46px,7vw,77px);line-height:1.02;letter-spacing:-.05em;margin:17px 0}.hero p{max-width:710px;margin:0 auto 30px;color:var(--muted);font-size:18px}.search{display:grid;grid-template-columns:1fr auto;max-width:750px;margin:auto;padding:8px;background:#fff;border:1px solid var(--line);border-radius:15px;box-shadow:0 16px 44px #783f221a}.search input{min-width:0;border:0;outline:0;padding:12px 16px;font-size:16px}.search button{border:0;border-radius:10px;padding:13px 24px;color:#fff;background:var(--brand);font-weight:800}.quick{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:9px;margin-top:43px}.quick span{color:var(--muted);font-size:13px}.quick a{padding:7px 12px;background:#fff;border:1px solid var(--line);border-radius:9px;font-size:13px;font-weight:700}.section{padding:82px 0}.soft{background:var(--soft)}.head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:30px}.head h2{font-size:clamp(30px,4vw,43px);line-height:1.1;letter-spacing:-.035em;margin:7px 0}.head p{max-width:670px;margin:0;color:var(--muted)}.head>a{color:var(--brand);font-weight:800}.categories{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.category{min-height:164px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center;background:#fff;border:1px solid var(--line);border-radius:15px;transition:.2s}.category:hover,.product:hover{transform:translateY(-3px);box-shadow:var(--shadow)}.category>span{width:42px;height:42px;display:grid;place-items:center;color:var(--brand);background:#fff3ed;border-radius:12px;font-weight:800}.category strong{line-height:1.25}.category small{color:var(--muted);font-size:12px}.products{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.product{overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:15px;transition:.2s}.photo{display:block;aspect-ratio:1;background:#f1f2f5;overflow:hidden}.photo img{width:100%;height:100%;object-fit:cover}.copy{display:block;padding:17px}.copy>small{color:#77716e;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}.copy>strong{display:block;min-height:49px;margin:10px 0 14px;line-height:1.5}.copy>span{display:block;padding-top:13px;border-top:1px solid var(--line);color:var(--accent)}.features{display:grid;grid-template-columns:1.25fr repeat(3,.75fr);gap:18px}.features article{padding:28px;background:#fff;border:1px solid var(--line);border-radius:18px}.features article:first-child{background:#fffaf7}.features h2{font-size:34px;line-height:1.15;letter-spacing:-.035em;margin:0 0 13px}.features h3{margin:18px 0 8px}.features p{margin:0;color:var(--muted)}.features i{width:42px;height:42px;display:grid;place-items:center;color:var(--brand);background:#fff3ed;border-radius:12px;font-style:normal;font-weight:800}.faq{display:grid;gap:10px;max-width:900px;margin:auto}.faq details{background:#fff;border:1px solid var(--line);border-radius:14px}.faq summary{cursor:pointer;padding:19px 22px;font-weight:700}.faq summary::marker{color:var(--brand)}.faq p{margin:0;padding:0 22px 20px;color:var(--muted)}.bottom-cta{padding:0 0 82px}.bottom-cta>div{padding:50px 24px;text-align:center;color:#fff;background:var(--ink);border-radius:20px}.bottom-cta h2{font-size:clamp(31px,4vw,48px);line-height:1.1;margin:7px 0 20px}.bottom-cta a{display:inline-flex;padding:13px 21px;border-radius:10px;background:var(--accent);font-weight:800}.detail-view{min-height:calc(100vh - 76px);padding:56px 0 84px}.detail-back{display:inline-flex;margin-bottom:22px;color:var(--brand);font-weight:800}.detail-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(330px,.95fr);gap:54px;align-items:start}.detail-main{aspect-ratio:1;overflow:hidden;background:var(--soft);border:1px solid var(--line);border-radius:20px}.detail-main img{width:100%;height:100%;object-fit:contain}.detail-thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-top:10px}.detail-thumbs img{width:100%;aspect-ratio:1;object-fit:cover;background:var(--soft);border:1px solid var(--line);border-radius:10px}.detail-info small{color:#77716e;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}.detail-info h1{font-size:clamp(32px,5vw,58px);line-height:1.05;letter-spacing:-.04em;margin:13px 0 18px}.detail-price{font-size:29px;font-weight:800;margin:18px 0}.detail-facts{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.detail-facts span{padding:7px 11px;color:#5f5956;background:var(--soft);border:1px solid var(--line);border-radius:999px;font-size:12px;font-weight:700}.detail-notice{padding:15px 17px;color:#684738;background:#fff6f1;border:1px solid #f1d3c5;border-radius:12px}.detail-buy{display:flex;justify-content:center;margin-top:22px;padding:14px 20px;color:#fff;background:var(--brand);border-radius:11px;font-weight:800}.detail-qc{margin-top:82px;padding-top:62px;border-top:1px solid var(--line)}.detail-qc-head{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:26px}.detail-qc-head h2{font-size:clamp(30px,4vw,43px);line-height:1.1;letter-spacing:-.035em;margin:7px 0}.detail-qc-head p{max-width:720px;margin:0;color:var(--muted)}.detail-qc-head>strong{flex:0 0 auto;color:var(--brand)}.detail-qc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.detail-qc-grid img{width:100%;aspect-ratio:1;object-fit:cover;background:var(--soft);border:1px solid var(--line);border-radius:14px}.footer{padding:50px 0 24px;color:#aeb0bc;background:#181922}.footer img{width:145px;filter:brightness(0) invert(1)}.footer p{max-width:700px}.empty{padding:30px;text-align:center;color:var(--muted)}
@media(max-width:1050px){.nav-search{display:none}.products{grid-template-columns:repeat(3,1fr)}.categories{grid-template-columns:repeat(3,1fr)}.features{grid-template-columns:1fr 1fr}.detail-qc-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:760px){.shell{width:min(100% - 24px,1280px)}.nav{min-height:66px;gap:10px}.brand img{width:116px}.brand b,.nav nav,.nav .cta{display:none}.nav select{margin-left:auto;max-width:100px}.hero{min-height:470px}.hero>div{padding:56px 0}.hero h1{font-size:clamp(42px,15vw,66px)}.search{grid-template-columns:1fr;padding:11px}.search button{width:100%}.section{padding:58px 0}.head{display:block}.head>a{display:inline-block;margin-top:12px}.categories,.products{grid-template-columns:repeat(2,1fr);gap:10px}.category{min-height:130px;padding:14px}.features,.detail-grid{grid-template-columns:1fr}.detail-view{padding:35px 0 58px}.detail-grid{gap:28px}.detail-info h1{font-size:36px}.detail-qc{margin-top:58px;padding-top:44px}.detail-qc-head{display:block}.detail-qc-head>strong{display:block;margin-top:12px}.copy{padding:12px}.copy>strong{min-height:64px;font-size:14px}.bottom-cta{padding-bottom:58px}.bottom-cta>div{border-radius:15px}}
/* Distinct editorial catalog theme */
:root{--ink:#101116;--muted:#62656d;--line:#d9dce2;--soft:#f2f3f5;--brand:#f02f55;--accent:#f02f55;--shadow:8px 8px 0 #10111614}
.top{background:#101116;border-bottom-color:#2d3038}.brand b,.nav nav a{color:#fff}.brand b{border-left-color:#3b3e47}.nav nav a:first-child{color:#ff6d89;border-bottom:4px solid var(--brand)}.nav select{color:#fff;background:#101116;border-color:#3b3e47;border-radius:3px}.nav .cta{border-radius:3px}.nav-search{background:#fff;border-radius:3px}
.hero{min-height:560px;place-items:stretch;text-align:left;background:#101116;border-bottom:8px solid var(--brand)}.hero:before{left:auto;right:7%;top:0;width:18%;height:100%;border-radius:0;background:#181a20}.hero:after{right:19%;top:0;width:3px;height:100%;border-radius:0;background:var(--brand);transform:none}.hero>div{width:min(1280px,calc(100% - 48px));max-width:none;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;margin:auto;padding:78px 0 58px}.hero .eyebrow{color:#ff6d89}.hero h1{max-width:850px;color:#fff;font-size:clamp(52px,7.2vw,98px);letter-spacing:-.065em}.hero p{max-width:720px;margin:0 0 30px;color:#c3c5cc}.search{width:min(750px,100%);margin:0;border:0;border-radius:3px;box-shadow:none}.search button{border-radius:2px}.quick{justify-content:flex-start;margin-top:36px}.quick span{color:#8f929b}.quick a{color:#fff;background:transparent;border-color:#3b3e47;border-radius:2px}.quick a:hover{background:var(--brand);border-color:var(--brand)}
.section{padding:88px 0}.head{padding-bottom:18px;border-bottom:2px solid var(--ink)}.head h2{font-size:clamp(32px,4vw,50px)}.categories{gap:0;border-top:1px solid var(--line);border-left:1px solid var(--line)}.category{min-height:172px;align-items:flex-start;justify-content:space-between;padding:22px;text-align:left;border-width:0 1px 1px 0;border-radius:0}.category:hover{transform:translate(-3px,-3px);border-color:var(--line);box-shadow:7px 7px 0 var(--brand)}.category>span{width:auto;height:auto;color:var(--brand);background:transparent;border-radius:0;font-size:12px;letter-spacing:.14em}.products{gap:16px}.product{border-radius:0}.product:hover{transform:translate(-3px,-3px);border-color:var(--ink);box-shadow:var(--shadow)}.photo{border-bottom:1px solid var(--line)}.copy{padding:18px}.copy>small{color:var(--brand)}.copy>span b{color:var(--ink)}
.features article{border-radius:0}.features article:first-child{color:#fff;background:var(--ink);border-color:var(--ink)}.features article:first-child p{color:#bfc1c9}.features i{color:var(--brand);background:transparent;border:1px solid var(--brand);border-radius:50%}.faq details{border-radius:0;border-left:4px solid var(--ink)}.faq details[open]{border-left-color:var(--brand)}.bottom-cta>div{background:var(--ink);border-radius:0;border-left:8px solid var(--brand)}
.detail-main,.detail-thumbs img,.detail-notice,.detail-qc-grid img{border-radius:0}.detail-info{padding:32px;color:#fff;background:var(--ink);border-top:8px solid var(--brand)}.detail-info small,.detail-price{color:#ff6d89}.detail-facts span{color:#d8dae0;background:#22242b;border-color:#383b44;border-radius:2px}.detail-notice{color:#d8dae0;background:#22242b;border-color:#383b44}.detail-buy{border-radius:2px}.footer{border-top:8px solid var(--brand)}
@media(max-width:760px){.hero{min-height:540px}.hero>div{width:min(100% - 24px,1280px);padding:62px 0 48px}.hero h1{font-size:clamp(48px,15vw,75px)}.hero:before{right:0;width:24%}.hero:after{right:24%}.category{min-height:145px;border-radius:0}.product{border-radius:0}.detail-info{padding:24px 18px}}
/* Centered Kakobuy brand hero */
.top{background:#fff;border-bottom-color:var(--line)}.brand b,.nav nav a{color:var(--ink)}.brand b{border-left-color:var(--line)}.nav nav a:first-child{color:var(--brand)}.nav select{color:var(--ink);background:#fff;border-color:var(--line)}
.hero{min-height:520px;place-items:center;text-align:center;background:var(--brand);border-bottom:8px solid var(--ink)}.hero:before,.hero:after{display:none}.hero>div{width:min(980px,calc(100% - 48px));max-width:980px;display:flex;flex-direction:column;justify-content:center;align-items:center;margin:auto;padding:72px 0 48px}.hero .eyebrow{padding:7px 12px;color:#fff;background:var(--ink);border-radius:2px}.hero h1{max-width:900px;margin:20px 0 18px;color:#fff;font-size:clamp(48px,7vw,93px);letter-spacing:-.06em}.hero p{max-width:730px;margin:0 auto 30px;color:#fff}.search{width:min(760px,100%);margin:auto;border:3px solid var(--ink);border-radius:3px;box-shadow:8px 8px 0 var(--ink)}.search button{background:var(--ink)}.quick{justify-content:center;margin-top:38px}.quick span{color:#fff}.quick a{color:#fff;background:transparent;border-color:#ffffffb3}.quick a:hover{color:var(--ink);background:#fff;border-color:#fff}
@media(max-width:760px){.hero{min-height:510px}.hero>div{width:min(100% - 24px,980px);padding:54px 0 42px}.hero h1{font-size:clamp(44px,14vw,68px)}.search{box-shadow:5px 5px 0 var(--ink)}}
.preview-language{position:relative}.preview-language summary{min-width:122px;display:flex;align-items:center;gap:6px;cursor:pointer;list-style:none;padding:10px 11px;background:#fff;border:1px solid var(--line);border-radius:3px;font-size:14px;font-weight:700}.preview-language summary::-webkit-details-marker{display:none}.preview-language summary small{color:var(--muted);font-size:11px}.preview-language summary b{margin-left:auto;font-weight:700}.preview-language-list{position:absolute;right:0;top:calc(100% + 10px);width:min(430px,calc(100vw - 24px));max-height:430px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;overflow:auto;padding:8px;background:#fff;border:1px solid var(--line);box-shadow:8px 8px 0 #10111614;z-index:60}.preview-language-list button{display:flex;justify-content:space-between;gap:12px;padding:10px;border:0;background:#fff;color:var(--ink);font:inherit;text-align:left;cursor:pointer}.preview-language-list button:hover{color:var(--brand);background:var(--soft)}.preview-language-list button small{color:var(--muted);font-size:11px}.preview-language-list button:last-child{grid-column:1/-1;margin-top:6px;padding-top:12px;border-top:1px solid var(--line)}
@media(max-width:760px){.preview-language{margin-left:auto}.preview-language summary{min-width:108px;padding:9px}.preview-language-list{right:0;width:min(410px,calc(100vw - 24px));max-height:70vh}}
.category-view{min-height:calc(100vh - 76px)}.category-page-hero{padding:62px 0 54px;color:#fff;background:var(--ink);border-bottom:8px solid var(--brand)}.category-page-hero h1{max-width:920px;margin:12px 0 14px;font-size:clamp(42px,7vw,78px);line-height:1.02;letter-spacing:-.055em}.category-page-hero p{max-width:740px;margin:0;color:#c3c5cc}.category-back{display:inline-flex;margin-bottom:28px;color:#ff6d89;font-weight:800}.category-chips{display:flex;gap:8px;overflow-x:auto;margin-bottom:24px;padding-bottom:6px}.category-chips a{flex:0 0 auto;padding:8px 13px;border:1px solid var(--line);font-size:13px;font-weight:700}.category-chips a:hover{color:#fff;background:var(--brand);border-color:var(--brand)}.category-toolbar{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:24px;padding:16px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}.category-toolbar a{color:var(--brand);font-weight:800}.category-seo{margin-top:58px;padding:34px;border-left:8px solid var(--brand);background:var(--soft)}.category-seo h2{max-width:780px;margin:8px 0 12px;font-size:clamp(28px,4vw,44px);line-height:1.12;letter-spacing:-.035em}.category-seo p{max-width:780px;margin:0;color:var(--muted)}
.catalog-pagination{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;margin-top:36px}.catalog-pagination a,.catalog-pagination span{min-width:43px;padding:10px 14px;text-align:center;border:1px solid var(--line);font-weight:800}.catalog-pagination span{color:#fff;background:var(--brand);border-color:var(--brand)}.catalog-pagination a:hover{color:#fff;background:var(--ink);border-color:var(--ink)}
@media(max-width:760px){.category-view{min-height:calc(100vh - 66px)}.category-page-hero{padding:42px 0 38px}.category-page-hero h1{font-size:clamp(38px,13vw,58px)}.category-toolbar{align-items:flex-start}.category-seo{margin-top:40px;padding:26px 20px}}
</style></head><body>
<header class="top"><div class="shell nav"><a class="brand" href="#top"><img src="https://nstatic.kakobuy.com/www/pic/kkb/logo.png" alt="Kakobuy"><b>SPREADSHEET</b></a><nav><a id="nav-home" href="#top">${escapeHtml(en.nav.home)}</a><a id="nav-sheet" href="#products">${escapeHtml(en.nav.spreadsheet)}</a><a id="nav-categories" href="#categories">${escapeHtml(en.nav.categories)}</a><a id="nav-faq" href="#faq">${escapeHtml(en.nav.faq)}</a></nav><form class="nav-search" id="header-search"><input id="header-query" placeholder="${escapeHtml(en.hero.placeholder)}"><button aria-label="${escapeHtml(en.hero.search)}">→</button></form><select id="language" aria-label="Language" hidden>${languageOptions}</select><details class="preview-language" id="language-menu"><summary id="language-summary"><span>English</span><small>EN</small><b aria-hidden="true">⌄</b></summary><div class="preview-language-list">${languageButtons}</div></details></div></header>
<main id="catalog"><section class="hero" id="top"><div class="shell"><div id="hero-eyebrow" class="eyebrow">${escapeHtml(en.hero.eyebrow)}</div><h1 id="hero-title">${escapeHtml(en.hero.title)}</h1><p id="hero-body">${escapeHtml(en.hero.body)}</p><form class="search" id="preview-search"><input id="query" placeholder="${escapeHtml(en.hero.placeholder)}"><button id="search-label">${escapeHtml(en.hero.search)}</button></form><div class="quick"><span id="quick-label">${escapeHtml(en.sections.categories)}</span>${quickCategoryHtml}</div></div></section>
<section class="section" id="categories"><div class="shell"><div class="head"><div><span id="categories-kicker" class="kicker">${escapeHtml(en.sections.sourceLive)}</span><h2 id="categories-title">${escapeHtml(en.sections.categories)}</h2><p id="categories-body">${escapeHtml(en.sections.categoriesBody)}</p></div></div><div class="categories">${categoryHtml}</div></div></section>
<section class="section soft" id="products"><div class="shell"><div class="head"><div><span id="products-kicker" class="kicker">${escapeHtml(en.sections.sourceLive)}</span><h2 id="products-title">${escapeHtml(en.sections.recent)}</h2><p id="products-body">${escapeHtml(en.sections.recentBody)}</p></div><a id="products-link" href="#products">${escapeHtml(en.sections.viewAll)} →</a></div><div class="products" id="product-grid">${productHtml}</div><p class="empty" id="no-results" hidden>${escapeHtml(en.listing.noResults)}</p></div></section>
<section class="section"><div class="shell features"><article><h2 id="about-title">${escapeHtml(en.seo.title)}</h2><p id="about-body">${escapeHtml(en.seo.body)}</p></article><article><i>01</i><h3 id="feature-search-title">${escapeHtml(en.seo.searchTitle)}</h3><p id="feature-search-body">${escapeHtml(en.seo.searchBody)}</p></article><article><i>02</i><h3 id="feature-photos-title">${escapeHtml(en.seo.photosTitle)}</h3><p id="feature-photos-body">${escapeHtml(en.seo.photosBody)}</p></article><article><i>03</i><h3 id="feature-checkout-title">${escapeHtml(en.seo.checkoutTitle)}</h3><p id="feature-checkout-body">${escapeHtml(en.seo.checkoutBody)}</p></article></div></section>
<section class="section soft" id="faq"><div class="shell"><div class="head"><div><span class="kicker">FAQ</span><h2 id="faq-title">${escapeHtml(en.faqTitle)}</h2><p id="faq-body">${escapeHtml(en.seo.body)}</p></div></div><div class="faq">${faqHtml}</div></div></section>
<section class="bottom-cta"><div class="shell"><span id="cta-kicker" class="kicker">${escapeHtml(en.sections.sourceLive)}</span><h2 id="cta-title">${escapeHtml(en.hero.browse)}</h2><a id="cta-link" href="#products">${escapeHtml(en.sections.viewAll)} →</a></div></section></main>
<main class="category-view" id="category-view" hidden>${categoryViewHtml}</main>
<main class="detail-view" id="detail-view" hidden><div class="shell"><a class="detail-back" id="detail-back" href="#products">← ${escapeHtml(en.nav.spreadsheet)}</a><div class="detail-grid"><div><div class="detail-main"><img id="detail-image" alt=""></div><h2 class="kicker" id="detail-gallery">${escapeHtml(en.product.gallery)}</h2><div class="detail-thumbs" id="detail-thumbs"></div></div><div class="detail-info"><small id="detail-listing">Kakobuy Spreadsheet listing</small><h1 id="detail-title"></h1><div class="detail-price" id="detail-price"></div><div class="detail-facts" id="detail-facts"></div><p class="detail-notice" id="detail-notice">${escapeHtml(en.product.currentNotice)}</p><a class="detail-buy" id="detail-buy" href="#" target="_blank" rel="nofollow sponsored">${escapeHtml(en.product.openKakobuy)} →</a></div></div><section class="detail-qc"><div class="detail-qc-head"><div><span class="kicker">QC PHOTO REFERENCE</span><h2 id="detail-qc-title">Available QC photo references</h2><p id="detail-qc-body">Review the source reference photos before opening Kakobuy. Your own warehouse QC photos may differ.</p></div><strong id="detail-qc-count"></strong></div><div class="detail-qc-grid" id="detail-qc-grid"></div></section></div></main>
<footer class="footer"><div class="shell"><img src="https://nstatic.kakobuy.com/www/pic/kkb/logo.png" alt="Kakobuy"><p id="footer-copy">${escapeHtml(en.seo.body)}</p></div></footer>
<script>
const locales=${localeJson};
const previewProducts=${previewProductJson};
const catalog=document.querySelector('#catalog');const categoryView=document.querySelector('#category-view');const detailView=document.querySelector('#detail-view');const baseTitle=document.title;let lastCollectionHash='#products';
const showCatalog=()=>{catalog.hidden=false;categoryView.hidden=true;detailView.hidden=true;document.title=baseTitle};
const showCategory=(id,pageNumber=1)=>{const page=categoryView.querySelector('[data-category-page="'+id+'"]');if(!page){showCatalog();return}const cards=[...page.querySelectorAll('[data-catalog-card]')];const totalPages=Math.max(1,Math.ceil(cards.length/50));const activePage=Math.min(Math.max(1,pageNumber),totalPages);catalog.hidden=true;categoryView.hidden=false;detailView.hidden=true;categoryView.querySelectorAll('[data-category-page]').forEach(item=>item.hidden=item!==page);cards.forEach(card=>card.hidden=Number(card.dataset.catalogPage)!==activePage);const summary=page.querySelector('[data-category-summary]');if(summary)summary.textContent='Page '+activePage+' of '+totalPages+' · '+cards.length+' products';const pagination=page.querySelector('[data-category-pagination]');if(pagination)pagination.innerHTML=Array.from({length:totalPages},(_,index)=>{const number=index+1;return number===activePage?'<span aria-current="page">'+number+'</span>':'<a href="#category-'+id+'-page-'+number+'">'+number+'</a>'}).join('');document.title=page.querySelector('h1').textContent+' — Page '+activePage+' | Kakobuy Works';scrollTo({top:0,behavior:'smooth'})};
const makeImages=(product)=>product.gallery.map((src,index)=>{const img=document.createElement('img');img.src=src;img.alt=product.title+' — QC reference '+(index+1);img.referrerPolicy='no-referrer';img.loading='lazy';return img});
const showDetail=(id)=>{const product=previewProducts[id];if(!product){showCatalog();return}catalog.hidden=true;categoryView.hidden=true;detailView.hidden=false;document.querySelector('#detail-back').href=lastCollectionHash;document.querySelector('#detail-title').textContent=product.title;document.querySelector('#detail-price').textContent=product.price;const facts=document.querySelector('#detail-facts');facts.replaceChildren(...[product.category,product.marketplaceId?'Weidian · '+product.marketplaceId:''].filter(Boolean).map(value=>{const span=document.createElement('span');span.textContent=value;return span}));const image=document.querySelector('#detail-image');image.src=product.gallery[0]||'';image.alt=product.title;document.querySelector('#detail-thumbs').replaceChildren(...makeImages(product));document.querySelector('#detail-qc-grid').replaceChildren(...makeImages(product));const locale=locales[document.querySelector('#language').value]||locales.en;const count=document.querySelector('#detail-qc-count');count.dataset.count=String(product.gallery.length);count.textContent=product.gallery.length+' '+locale.qcPhotos;document.querySelector('#detail-buy').href=product.kakobuyUrl;document.title=product.title+' | Kakobuy Spreadsheet';scrollTo({top:0,behavior:'smooth'})};
const renderRoute=()=>{const productMatch=location.hash.match(/^#product-(\\d+)$/);const categoryMatch=location.hash.match(/^#category-(\\d+)(?:-page-(\\d+))?$/);if(productMatch)showDetail(productMatch[1]);else if(categoryMatch)showCategory(categoryMatch[1],Number(categoryMatch[2]||1));else{showCatalog();if(location.hash){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView(),0)}}};
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#product-"]');if(link)lastCollectionHash=/^#category-\\d+(?:-page-\\d+)?$/.test(location.hash)?location.hash:'#products'});
addEventListener('hashchange',renderRoute);renderRoute();
const filterProducts=(raw)=>{showCatalog();const q=raw.toLowerCase().trim();let count=0;document.querySelectorAll('[data-product]').forEach(card=>{const show=!q||(card.dataset.title||'').includes(q);card.hidden=!show;if(show)count++});document.querySelector('#no-results').hidden=count>0;document.querySelector('#products').scrollIntoView({behavior:'smooth'})};
document.querySelector('#preview-search').addEventListener('submit',event=>{event.preventDefault();filterProducts(document.querySelector('#query').value)});
document.querySelector('#header-search').addEventListener('submit',event=>{event.preventDefault();const q=document.querySelector('#header-query').value;document.querySelector('#query').value=q;filterProducts(q)});
document.querySelector('#language').addEventListener('change',event=>{const locale=locales[event.target.value];if(!locale)return;document.documentElement.lang=event.target.value;Object.entries(locale.values).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value+(['products-link','cta-link','detail-buy'].includes(id)?' →':'')});const count=document.querySelector('#detail-qc-count');if(count.dataset.count)count.textContent=count.dataset.count+' '+locale.qcPhotos;document.querySelector('#query').placeholder=locale.placeholder;document.querySelector('#header-query').placeholder=locale.placeholder;document.querySelectorAll('.faq details').forEach((detail,index)=>{const pair=locale.faqs[index];if(!pair)return;detail.querySelector('summary').textContent=pair[0];detail.querySelector('p').textContent=pair[1]})});
document.querySelector('#language').addEventListener('change',event=>{const categoryCopy=locales[event.target.value]?.category;if(!categoryCopy)return;document.querySelectorAll('[data-category-copy]').forEach(element=>{const value=categoryCopy[element.dataset.categoryCopy];if(value)element.textContent=value})});
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{const code=button.dataset.language;const select=document.querySelector('#language');select.value=code;select.dispatchEvent(new Event('change',{bubbles:true}));const summary=document.querySelector('#language-summary');summary.querySelector('span').textContent=button.querySelector('span').textContent;summary.querySelector('small').textContent=button.querySelector('small').textContent;document.querySelectorAll('[data-language]').forEach(item=>item.removeAttribute('aria-current'));button.setAttribute('aria-current','page');document.querySelector('#language-menu').open=false}));
</script></body></html>`;

await writeFile(new URL('../kakobuyworks-all-products-preview.html', import.meta.url), html);
console.log(`Preview generated with ${categories.length} source categories, ${Object.values(categoryProducts).flat().length} live category listings and ${products.length} embedded home product details.`);
