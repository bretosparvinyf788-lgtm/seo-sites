const SOURCE_ORIGIN = "https://kakobuymake.com";
const SITE_ORIGIN = "https://kakobuylab.com";
const AFFCODE = "9qtwd";

const SOURCE_CATEGORIES = [
  { id: 2, name: "Shoes/slippers" },
  { id: 3, name: "T-shirt" },
  { id: 4, name: "Fashion Clothing" },
  { id: 5, name: "Hoodies" },
  { id: 6, name: "Pants/Trousers" },
  { id: 7, name: "Leather Belt" },
  { id: 8, name: "Fashion Bag" },
  { id: 9, name: "Perfume" },
  { id: 10, name: "Electronics" },
  { id: 11, name: "Other Stuff" }
];

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
  "x-content-type-options": "nosniff",
  "x-kakobuylab-data-source": SOURCE_ORIGIN
};

function decodeEntities(value = "") {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:0*39|x0*27);/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function stripTags(value = "") {
  return decodeEntities(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value = "") {
  return escapeHtml(value);
}

function sourceUrl(path = "") {
  try {
    return new URL(decodeEntities(path), `${SOURCE_ORIGIN}/`).href;
  } catch {
    return "";
  }
}

function firstMatch(input, expression, group = 1) {
  const match = input.match(expression);
  return match ? match[group] || "" : "";
}

function extractAttr(tag, attr) {
  const expression = new RegExp(`\\b${attr}\\s*=\\s*["']([^"']+)["']`, "i");
  return decodeEntities(firstMatch(tag, expression));
}

function classBlock(html, tag, className) {
  const expression = new RegExp(
    `<${tag}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tag}>`,
    "i"
  );
  return firstMatch(html, expression);
}

function parsePages(html) {
  let maxPage = 1;
  for (const match of html.matchAll(/[?&amp;]page=(\d+)/gi)) {
    maxPage = Math.max(maxPage, Number(match[1]) || 1);
  }
  return maxPage;
}

export function parseProducts(html, categoryId = null) {
  const products = [];
  const expression = /<a\b([^>]*class=["'][^"']*\bproduct-card\b[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(expression)) {
    const opening = match[1];
    const body = match[2];
    const href = extractAttr(opening, "href");
    const aid = firstMatch(href, /[?&]aid=(\d+)/i);
    if (!aid) continue;
    const imageTag = firstMatch(body, /(<img\b[^>]*>)/i);
    const image = sourceUrl(extractAttr(imageTag, "data-src") || extractAttr(imageTag, "src"));
    const title = stripTags(classBlock(body, "h3", "product-title") || extractAttr(imageTag, "alt"));
    let price = stripTags(classBlock(body, "span", "price"));
    if (price && !price.startsWith("$")) price = `$${price}`;
    if (!title || !image) continue;
    products.push({
      aid,
      title,
      price,
      image,
      categoryId: categoryId ? Number(categoryId) : null,
      sourceUrl: `${SOURCE_ORIGIN}/?m=home&c=View&a=index&aid=${aid}`,
      detailUrl: `/products/source/${aid}/`
    });
  }
  return products;
}

function normalizeKakobuyLink(value) {
  if (!value) return "";
  try {
    const url = new URL(decodeEntities(value));
    if (!/(^|\.)kakobuy\.com$/i.test(url.hostname)) return "";
    url.hostname = "www.kakobuy.com";
    url.searchParams.set("affcode", AFFCODE);
    return url.href;
  } catch {
    return "";
  }
}

function marketplaceDetails(kakobuyUrl) {
  if (!kakobuyUrl) return { marketplace: "Source listing", itemId: "" };
  try {
    const kakobuy = new URL(kakobuyUrl);
    const sellerValue = kakobuy.searchParams.get("url") || "";
    const seller = new URL(sellerValue);
    const host = seller.hostname.toLowerCase();
    const marketplace = host.includes("weidian") ? "Weidian" : host.includes("taobao") ? "Taobao" : host.includes("1688") ? "1688" : host.includes("tmall") ? "Tmall" : "Source listing";
    const itemId = seller.searchParams.get("itemID") || seller.searchParams.get("itemId") || seller.searchParams.get("id") || firstMatch(seller.pathname, /(\d{6,})/);
    return { marketplace, itemId, sellerUrl: seller.href };
  } catch {
    return { marketplace: "Source listing", itemId: "" };
  }
}

export function parseProductDetail(html, aid) {
  const title = stripTags(classBlock(html, "h1", "product-title"));
  const priceBlock = classBlock(html, "div", "product-price");
  let price = stripTags(classBlock(priceBlock, "span", "price") || priceBlock);
  if (price && !price.startsWith("$")) price = `$${price}`;

  const breadcrumb = classBlock(html, "div", "product-breadcrumb");
  const category = stripTags(firstMatch(breadcrumb, /<span\b[^>]*>([\s\S]*?)<\/span>/i));

  const gallery = classBlock(html, "div", "thumbnail-carousel");
  const images = [];
  for (const imageMatch of gallery.matchAll(/<img\b[^>]*>/gi)) {
    const src = sourceUrl(extractAttr(imageMatch[0], "src"));
    if (src && !images.includes(src)) images.push(src);
  }
  if (!images.length) {
    const mainTag = firstMatch(html, /(<img\b[^>]*id=["']mainImage["'][^>]*>)/i);
    const mainImage = sourceUrl(extractAttr(mainTag, "src"));
    if (mainImage) images.push(mainImage);
  }

  const kakobuyTag = firstMatch(html, /(<a\b[^>]*href=["'][^"']*kakobuy\.com\/item\/details[^"']*["'][^>]*>)/i);
  const kakobuyUrl = normalizeKakobuyLink(extractAttr(kakobuyTag, "href"));
  const marketplace = marketplaceDetails(kakobuyUrl);
  if (!title || !images.length || !kakobuyUrl) return null;

  return {
    aid: String(aid),
    title,
    price,
    category,
    images,
    kakobuyUrl,
    marketplace: marketplace.marketplace,
    itemId: marketplace.itemId,
    sellerUrl: marketplace.sellerUrl || "",
    sourceUrl: `${SOURCE_ORIGIN}/?m=home&c=View&a=index&aid=${aid}`
  };
}

async function fetchSource(url) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "accept-language": "en-US,en;q=0.9",
      "user-agent": "KakobuyLab source reader/1.0 (+https://kakobuylab.com/)"
    },
    cf: { cacheEverything: true, cacheTtl: 180 }
  });
  if (!response.ok) throw new Error(`KakobuyMake returned ${response.status}`);
  return response.text();
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

async function catalogResponse(url) {
  const query = (url.searchParams.get("q") || "").trim().slice(0, 80);
  const requestedCategory = Number(url.searchParams.get("category") || 1);
  const category = Number.isInteger(requestedCategory) && requestedCategory >= 1 && requestedCategory <= 11 ? requestedCategory : 1;
  const requestedPage = Number(url.searchParams.get("page") || 1);
  const page = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), 100) : 1;
  const upstream = query
    ? `${SOURCE_ORIGIN}/?m=home&c=Search&a=lists&keywords=${encodeURIComponent(query)}&page=${page}`
    : `${SOURCE_ORIGIN}/?m=home&c=Lists&a=index&tid=${category}&page=${page}`;
  try {
    const html = await fetchSource(upstream);
    return jsonResponse({
      ok: true,
      source: SOURCE_ORIGIN,
      sourceUrl: upstream,
      query,
      category,
      page,
      totalPages: parsePages(html),
      products: parseProducts(html, query ? null : category)
    });
  } catch (error) {
    return jsonResponse({ ok: false, source: SOURCE_ORIGIN, error: "KakobuyMake data is temporarily unavailable." }, 502);
  }
}

async function categoriesResponse() {
  try {
    const categories = await Promise.all(SOURCE_CATEGORIES.map(async category => {
      const upstream = `${SOURCE_ORIGIN}/?m=home&c=Lists&a=index&tid=${category.id}`;
      const html = await fetchSource(upstream);
      const first = parseProducts(html, category.id)[0] || null;
      return {
        ...category,
        image: first?.image || "",
        productCount: parseProducts(html, category.id).length,
        sourceUrl: upstream,
        browseUrl: `/products/?category=${category.id}`
      };
    }));
    return jsonResponse({ ok: true, source: SOURCE_ORIGIN, categories });
  } catch {
    return jsonResponse({ ok: false, source: SOURCE_ORIGIN, error: "KakobuyMake categories are temporarily unavailable." }, 502);
  }
}

async function productResponse(aid) {
  try {
    const upstream = `${SOURCE_ORIGIN}/?m=home&c=View&a=index&aid=${aid}`;
    const html = await fetchSource(upstream);
    const product = parseProductDetail(html, aid);
    if (!product) return jsonResponse({ ok: false, source: SOURCE_ORIGIN, error: "Product was not found in KakobuyMake." }, 404);
    return jsonResponse({ ok: true, source: SOURCE_ORIGIN, product });
  } catch {
    return jsonResponse({ ok: false, source: SOURCE_ORIGIN, error: "KakobuyMake product data is temporarily unavailable." }, 502);
  }
}

function productPage(product) {
  const title = escapeHtml(product.title);
  const category = escapeHtml(product.category || "KakobuyMake catalog");
  const price = escapeHtml(product.price || "Check live price");
  const mainImage = escapeHtml(product.images[0]);
  const canonical = `${SITE_ORIGIN}/products/source/${encodeURIComponent(product.aid)}/`;
  const gallery = product.images.map((image, index) => `
    <button class="source-gallery-thumb${index === 0 ? " active" : ""}" type="button" data-source-thumb="${escapeHtml(image)}" aria-label="View source image ${index + 1}">
      <img src="${escapeHtml(image)}" alt="${title} — KakobuyMake source image ${index + 1}" loading="${index ? "lazy" : "eager"}">
    </button>`).join("");
  const qcGallery = product.images.map((image, index) => `
    <a class="qc-source-image" href="${escapeHtml(image)}" target="_blank" rel="noopener">
      <img src="${escapeHtml(image)}" alt="${title} — source reference ${index + 1}" loading="lazy">
      <span>Source image ${index + 1}</span>
    </a>`).join("");
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: product.title, url: canonical, image: product.images, isBasedOn: product.sourceUrl },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_ORIGIN}/products/` },
        { "@type": "ListItem", position: 3, name: product.title, item: canonical }
      ] }
    ]
  }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} | KakobuyMake Source Details | KakobuyLab</title>
  <meta name="description" content="Live product details, source images and purchase link synchronized from KakobuyMake.">
  <link rel="canonical" href="${canonical}"><link rel="icon" href="${SOURCE_ORIGIN}/favicon.ico"><link rel="stylesheet" href="/style.css?v=20260924-3">
  <meta property="og:title" content="${title} | KakobuyLab"><meta property="og:description" content="Live product details synchronized from KakobuyMake."><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${mainImage}">
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <div data-site-header></div>
  <main id="main" data-source-product-page>
    <section class="product-detail-shell"><div class="container">
      <div class="breadcrumbs"><a href="/">Home</a> / <a href="/products/">Products</a> / Live source details</div>
      <div class="source-sync-bar"><span class="source-live-dot"></span><strong>Live from KakobuyMake</strong><span>Product data and images are read from the main site.</span><a href="${escapeHtml(product.sourceUrl)}" target="_blank" rel="noopener">View source ↗</a></div>
      <div class="product-detail-grid">
        <div class="product-detail-media">
          <div class="product-detail-image"><img id="sourceMainImage" src="${mainImage}" alt="${title} — KakobuyMake source image"></div>
          <div class="source-gallery-strip">${gallery}</div>
          <span class="product-detail-count">${product.images.length} IMAGE${product.images.length === 1 ? "" : "S"} · KAKOBUYMAKE SOURCE</span>
        </div>
        <div class="product-detail-copy"><div class="kicker">KakobuyMake live listing</div><h1>${title}</h1><div class="detail-price-label">Source price</div><div class="detail-price">${price}</div>
          <dl class="detail-facts"><div><dt>Marketplace</dt><dd>${escapeHtml(product.marketplace)}</dd></div><div><dt>Category</dt><dd>${category}</dd></div><div><dt>Seller item ID</dt><dd>${escapeHtml(product.itemId || "See source")}</dd></div><div><dt>Main-site record</dt><dd>${escapeHtml(product.aid)}</dd></div></dl>
          <a class="button detail-primary" href="${escapeHtml(product.kakobuyUrl)}" target="_blank" rel="sponsored noopener">Open Kakobuy Link ↗</a>
          <p class="detail-note">The product title, price, images and seller link above are synchronized from KakobuyMake. Confirm live variants, stock and domestic shipping before paying.</p>
        </div>
      </div>
    </div></section>
    <section class="product-qc-section" aria-labelledby="product-qc-heading"><div class="container">
      <div class="product-qc-heading"><div><div class="kicker">KakobuyMake source gallery</div><h2 id="product-qc-heading">Product images &amp; QC reference</h2><p>Every image below is loaded directly from this product's KakobuyMake record.</p></div><span class="qc-status source">Source-synced</span></div>
      <div class="qc-source-grid">${qcGallery}</div>
      <p class="source-boundary-note">These images are displayed exactly as supplied by KakobuyMake. Their presence does not authenticate a product; warehouse photos for your own order may differ.</p>
    </div></section>
    <section class="section alt"><div class="container product-info-grid">
      <article class="product-info-card"><div class="kicker">Before you order</div><h2>Check the live Kakobuy page</h2><ul><li>Match the product image and seller item ID.</li><li>Choose the intended style, color and size.</li><li>Review your own warehouse QC photos before international shipping.</li></ul></article>
      <aside class="product-info-card"><div class="kicker">Single source of truth</div><h2>No separate product database</h2><p>KakobuyLab renders this page from KakobuyMake and does not maintain a copied product catalog.</p><a class="button secondary" href="/products/">Back to live products</a></aside>
    </div></section>
  </main>
  <div data-site-footer></div><script src="/translations.js?v=20260924-3" defer></script><script src="/app.js?v=20260924-3" defer></script><script src="/source-catalog.js?v=20260924-3" defer></script>
</body></html>`;
}

async function productPageResponse(aid) {
  try {
    const html = await fetchSource(`${SOURCE_ORIGIN}/?m=home&c=View&a=index&aid=${aid}`);
    const product = parseProductDetail(html, aid);
    if (!product) return new Response("Product not found in KakobuyMake", { status: 404 });
    return new Response(productPage(product), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        "x-content-type-options": "nosniff",
        "x-kakobuylab-data-source": SOURCE_ORIGIN
      }
    });
  } catch {
    return new Response("KakobuyMake product data is temporarily unavailable.", { status: 502 });
  }
}

async function sourceSitemapResponse() {
  try {
    const pages = await Promise.all([1, ...SOURCE_CATEGORIES.map(category => category.id)].map(async category => {
      const html = await fetchSource(`${SOURCE_ORIGIN}/?m=home&c=Lists&a=index&tid=${category}`);
      return parseProducts(html, category);
    }));
    const ids = [...new Set(pages.flat().map(product => product.aid))];
    const today = new Date().toISOString().slice(0, 10);
    const entries = ids.map(aid => `<url><loc>${escapeXml(`${SITE_ORIGIN}/products/source/${aid}/`)}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq></url>`).join("");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, {
      headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=1800" }
    });
  } catch {
    return new Response("Source sitemap unavailable", { status: 502 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/source/catalog") return catalogResponse(url);
    if (url.pathname === "/api/source/categories") return categoriesResponse();
    if (url.pathname === "/api/source/product") {
      const aid = url.searchParams.get("aid") || "";
      return /^\d{1,12}$/.test(aid) ? productResponse(aid) : jsonResponse({ ok: false, error: "Invalid product record." }, 400);
    }
    if (url.pathname === "/sitemap-source.xml") return sourceSitemapResponse();

    const productMatch = url.pathname.match(/^\/products\/source\/(\d{1,12})\/?$/);
    if (productMatch) return productPageResponse(productMatch[1]);
    if (/^\/products\/weidian\/\d+\/?$/.test(url.pathname)) {
      return Response.redirect(`${url.origin}/products/`, 301);
    }
    return env.ASSETS.fetch(request);
  }
};
