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

function keepNavigationOnShop(html) {
  const replacements = [
    ["https://cssbuyvip.com/cssbuy-spreadsheet-guide.html", "/cssbuy-spreadsheet/"],
    ["https://cssbuyvip.com/cssbuy-qc-finder.html", "/cssbuy-spreadsheet/"],
    ["https://cssbuyvip.com/cssbuy-shipping-calculator.html", "/cssbuy-spreadsheet/"],
    ["https://cssbuyvip.com/cssbuy-shipping-cost-guide.html", "/cssbuy-spreadsheet/"],
    ["https://cssbuyvip.com/how-to-check-cssbuy-qc-photos.html", "/cssbuy-spreadsheet/"],
    ["https://cssbuyvip.com/", "/cssbuy-spreadsheet/"],
  ];
  for (const [from, to] of replacements) html = html.replaceAll(from, to);

  html = html.replaceAll("Complete CSSBuy Guide", "CSSBuy Spreadsheet Guide");
  html = html.replaceAll("Read the Complete CSSBuy Guide", "Open the CSSBuy Spreadsheet Guide");
  html = html.replaceAll("Open the Guide and QC Workflow", "Open the Spreadsheet Workflow");
  html = html.replaceAll("Use the independent guide at cssbuyvip.com for detailed explanations of ordering, QC review and shipping planning.", "Use the guides and spreadsheet workflow on this site for product research, QC review and haul planning.");
  return html;
}

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
  html = html.replaceAll("real KakobuyMake source pages", "live product source pages");
  return html;
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const contentType = response.headers.get("content-type") || "";

    if (
      request.method !== "GET" ||
      !contentType.includes("text/html") ||
      response.status !== 200
    ) {
      return response;
    }

    let html = await response.text();
    if (HOMEPAGE_PATHS.has(url.pathname)) html = transformHomepage(html);
    html = keepNavigationOnShop(html);

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("x-cssbuyvip-seo", "shop-no-cross-domain-v3");

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
