const ARTICLE_MARKER = '"articles":{"en":[';

function decodeText(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function loadArticle(env, origin, config) {
  const response = await env.ASSETS.fetch(new Request(origin + config.path));
  if (!response.ok) return null;
  const page = await response.text();
  const body = [];
  const sectionPattern = /<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = sectionPattern.exec(page)) !== null) {
    body.push([decodeText(match[1]), decodeText(match[2])]);
  }
  if (!body.length) return null;
  return {
    key: config.key,
    slug: config.key,
    title: config.title,
    excerpt: config.excerpt,
    seo_title: config.seo_title,
    seo_description: config.seo_description,
    tags: config.tags,
    publish_date: config.publish_date,
    body
  };
}

const latestArticles = [
  {
    key: 'cssbuy-ship-for-me-forwarding-consolidation-guide-2026',
    path: '/guides/cssbuy-ship-for-me-forwarding-consolidation-guide-2026/',
    title: 'CSSBuy Ship For Me 2026: A Forwarding, Consolidation and Packaging Workflow',
    excerpt: 'A practical forwarding workflow for self-purchased China parcels: identify inbound packages, use QC, consolidate intelligently, choose packaging, and plan international shipping.',
    seo_title: 'CSSBuy Ship For Me 2026: Forwarding & Consolidation Guide',
    seo_description: 'A practical CSSBuy Ship For Me 2026 guide for self-purchased China parcels, warehouse receiving, QC, consolidation, vacuum packing, reinforcement and route planning.',
    tags: 'CSSBuy Ship For Me, CSSBuy forwarding, package consolidation, CSSBuy QC, vacuum packaging, reinforced packaging, warehouse forwarding, international parcel',
    publish_date: '2026-08-12'
  },
  {
    key: 'cssbuy-new-website-order-parcel-migration-guide-2026',
    path: '/guides/cssbuy-new-website-order-parcel-migration-guide-2026/',
    title: 'CSSBuy New Website 2026: A Buyer’s Migration Checklist for Orders, Parcels and Seller Notes',
    excerpt: 'Use CSSBuy’s redesigned 2026 website without losing order control: verify seller questions, Add Note records, warehouse decisions, price edits, 1688 quantities and parcel enquiries.',
    seo_title: 'CSSBuy New Website 2026: Order & Parcel Migration Guide',
    seo_description: 'A practical CSSBuy new website 2026 guide for Buy For Me orders, Contact Seller, Add Note, price edits, warehouse checks, returns and parcel enquiries.',
    tags: 'CSSBuy new website, CSSBuy Buy For Me, CSSBuy Contact Seller, CSSBuy Add Note, CSSBuy order enquiry, CSSBuy parcel enquiry, 1688 minimum order, CSSBuy price edit',
    publish_date: '2026-08-07'
  }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET' || (url.pathname !== '/' && url.pathname !== '/index.html')) {
      return env.ASSETS.fetch(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (!assetResponse.ok) return assetResponse;

    let html = await assetResponse.text();
    if (!html.includes(ARTICLE_MARKER)) {
      return new Response(html, assetResponse);
    }

    const parsed = [];
    for (const config of latestArticles) {
      if (!html.includes(`"key":"${config.key}"`)) {
        const article = await loadArticle(env, url.origin, config);
        if (article) parsed.push(article);
      }
    }

    if (parsed.length) {
      html = html.replace(ARTICLE_MARKER, ARTICLE_MARKER + parsed.map(JSON.stringify).join(',') + ',');
    }

    const headers = new Headers(assetResponse.headers);
    headers.delete('content-length');
    return new Response(html, {status: assetResponse.status, statusText: assetResponse.statusText, headers});
  },
};
