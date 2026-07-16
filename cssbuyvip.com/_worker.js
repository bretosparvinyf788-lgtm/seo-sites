const HOMEPAGE_PATHS = new Set(["/", "/index.html"]);

const HOMEPAGE_SEO = `
<meta property="og:type" content="website">
<meta property="og:title" content="CSSBuy Spreadsheet Guide 2026 – QC, Shipping, Coupons & W2C Help">
<meta property="og:description" content="Learn how to use CSSBuy spreadsheet links, review QC photos, plan shipping, understand coupons and make better haul decisions.">
<meta property="og:url" content="https://cssbuyvip.com/">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"CSSBuyVip Guide","url":"https://cssbuyvip.com/","description":"An independent CSSBuy tutorial hub covering spreadsheet use, QC photos, shipping, coupons, W2C links and agent workflows."}</script>
`;

function transformHomepage(html) {
  html = html.replace(
    /<title>[^<]*<\/title>/i,
    "<title>CSSBuy Spreadsheet Guide 2026 – QC, Shipping, Coupons & W2C Help</title>",
  );
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?\s*>/i,
    '<meta name="description" content="Independent CSSBuy guide for spreadsheet use, QC photo checks, shipping planning, coupons, W2C links and smarter haul decisions in 2026.">',
  );

  if (!html.includes('property="og:title"')) {
    html = html.replace("</head>", `${HOMEPAGE_SEO}</head>`);
  }

  html = html.replaceAll(
    "Best CSSBuy Spreadsheet for QC-ready finds and smarter shipping.",
    "CSSBuy Spreadsheet, QC and Shipping Guide for 2026.",
  );
  html = html.replaceAll(
    "Browse a cleaner CSSBuy resource hub built for KakobuyMake: selected finds, QC photo checks, shipping guidance, category pages and daily SEO article updates.",
    "Use an independent CSSBuy guide hub for spreadsheet research, QC photo checks, shipping planning, coupons, W2C links and daily educational updates.",
  );

  html = html.replace(
    '<a class="btn" href="https://kakobuymake.com/" target="_blank" rel="noopener">Spreadsheet</a>',
    '<a class="btn" href="/cssbuy-spreadsheet-guide.html">CSSBuy Guide</a>',
  );
  html = html.replace(
    '<a class="btn alt dark-alt" href="#workflow">How it works</a>',
    '<a class="btn alt dark-alt" href="#workflow">How it works</a><a class="btn alt dark-alt" href="https://cssbuyvip.shop/cssbuy-spreadsheet/" rel="noopener">Browse Product Spreadsheet</a>',
  );
  html = html.replaceAll(
    'href="https://kakobuymake.com/" target="_blank" rel="noopener">Open KakobuyMake Spreadsheet</a>',
    'href="/cssbuy-spreadsheet-guide.html">Open CSSBuy Spreadsheet Guide</a>',
  );

  const wording = [
    ["built for KakobuyMake", "built for CSSBuy product research"],
    ["Curated KakobuyMake links", "Curated CSSBuy product links"],
    ["main KakobuyMake sections", "main CSSBuy product categories"],
    ["KakobuyMake product discovery pages", "CSSBuy product research pages"],
    ["KakobuyMake discovery resources", "CSSBuy research and shipping resources"],
    ["KakobuyMake source pages", "product source pages"],
    ["KakobuyMake links", "CSSBuy product links"],
    ["KakobuyMake Spreadsheet", "CSSBuy Spreadsheet Guide"],
    ["KakobuyMake 电子表格", "CSSBuy 商品指南"],
    ["KakobuyMake 链接", "CSSBuy 商品链接"],
    ["KakobuyMake 的主要分类板块", "CSSBuy 商品主要分类板块"],
    ["KakobuyMake 发现资源", "CSSBuy 商品研究资源"],
    ["KakobuyMake 来源页面", "CSSBuy 商品来源页面"],
    ["para KakobuyMake", "para investigar productos con CSSBuy"],
    ["de KakobuyMake", "del catálogo de productos CSSBuy"],
    ["für KakobuyMake", "für die CSSBuy-Produktrecherche"],
    ["KakobuyMake-Bereiche", "CSSBuy-Produktkategorien"],
    ["KakobuyMake-Ressourcen", "CSSBuy-Recherche-Ressourcen"],
    ["pour KakobuyMake", "pour la recherche de produits CSSBuy"],
    ["de KakobuyMake", "du catalogue de produits CSSBuy"],
  ];
  for (const [from, to] of wording) html = html.replaceAll(from, to);

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
    headers.set("x-cssbuyvip-seo", "com-home-v2");

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
