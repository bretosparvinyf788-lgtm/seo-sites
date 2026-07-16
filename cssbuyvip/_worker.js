const HOMEPAGE_PATHS = new Set(["/", "/index.html"]);

const HOMEPAGE_SEO = `
<link rel="canonical" href="https://cssbuyvip.shop/">
<meta property="og:type" content="website">
<meta property="og:title" content="CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds">
<meta property="og:description" content="Browse updated CSSBuy spreadsheet finds with W2C links, QC guidance, product categories, prices and shipping-relevant details.">
<meta property="og:url" content="https://cssbuyvip.shop/">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"CSSBuyVip Spreadsheet","url":"https://cssbuyvip.shop/","description":"A product-first CSSBuy spreadsheet resource for W2C links, QC photos, product finds and category research.","potentialAction":{"@type":"SearchAction","target":"https://cssbuyvip.shop/#products","query-input":"required name=search_term_string"}}</script>
`;

function transformHomepage(html) {
  html = html.replace(
    /<title>[^<]*<\/title>/i,
    "<title>CSSBuy Spreadsheet 2026 – W2C Links, QC Photos & Latest Finds</title>",
  );
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?\s*>/i,
    '<meta name="description" content="Browse the latest CSSBuy spreadsheet with organized W2C links, QC guidance, product categories, prices and shipping-relevant details for smarter haul planning.">',
  );

  if (!/<link\s+rel=["']canonical["']/i.test(html)) {
    html = html.replace("</head>", `${HOMEPAGE_SEO}</head>`);
  }

  html = html.replace(
    '"h1":"CSSBuy Spreadsheet, W2C Links, QC Photos, Shipping Tips & Product Picks."',
    '"h1":"The Best CSSBuy Spreadsheet for W2C Links, QC Photos and Latest Finds."',
  );
  html = html.replace(
    '"lead":"This external site helps users coming from CSSBuy and spreadsheet-related searches. It includes real product images, direct product links, category browsing, QC guidance and a simple contact path."',
    '"lead":"Browse a product-first CSSBuy spreadsheet hub with organized categories, live source links, QC guidance, pricing context and shipping-relevant details before building your haul."',
  );
  html = html.replace('"sheet":"Spreadsheet"', '"sheet":"Open Spreadsheet"');
  html = html.replace(
    'href="https://kakobuymake.com/" rel="noopener">${u.sheet}',
    'href="/cssbuy-spreadsheet/" rel="noopener">${u.sheet}',
  );
  html = html.replace(
    '<a class="btn secondary" href="https://wa.me/15980058367" rel="noopener">${u.whatsapp}</a>',
    '<a class="btn secondary" href="https://wa.me/15980058367" rel="noopener">${u.whatsapp}</a><a class="btn secondary" href="https://cssbuyvip.com/cssbuy-spreadsheet-guide.html" rel="noopener">Complete CSSBuy Guide</a>',
  );
  html = html.replaceAll(
    "real KakobuyMake source pages",
    "live product source pages",
  );

  return html;
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const contentType = response.headers.get("content-type") || "";

    if (
      request.method !== "GET" ||
      !HOMEPAGE_PATHS.has(url.pathname) ||
      !contentType.includes("text/html") ||
      response.status !== 200
    ) {
      return response;
    }

    const html = transformHomepage(await response.text());
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("x-cssbuyvip-seo", "shop-home-v2");

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
