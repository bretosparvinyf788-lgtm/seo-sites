const fs = require('fs');

const path = 'index.html';
const marker = '"articles":{"en":[';

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

function articleFromStaticPage(config) {
  const page = fs.readFileSync(config.file, 'utf8');
  const body = [];
  const sectionPattern = /<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = sectionPattern.exec(page)) !== null) {
    body.push([decodeText(match[1]), decodeText(match[2])]);
  }
  if (!body.length) throw new Error(`Could not parse article sections from ${config.file}`);
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

const automationArticles = [
  articleFromStaticPage({
    key: 'cssbuy-ship-for-me-forwarding-consolidation-guide-2026',
    file: 'guides/cssbuy-ship-for-me-forwarding-consolidation-guide-2026/index.html',
    title: 'CSSBuy Ship For Me 2026: A Forwarding, Consolidation and Packaging Workflow',
    excerpt: 'A practical forwarding workflow for self-purchased China parcels: identify inbound packages, use QC, consolidate intelligently, choose packaging, and plan international shipping.',
    seo_title: 'CSSBuy Ship For Me 2026: Forwarding & Consolidation Guide',
    seo_description: 'A practical CSSBuy Ship For Me 2026 guide for self-purchased China parcels, warehouse receiving, QC, consolidation, vacuum packing, reinforcement and route planning.',
    tags: 'CSSBuy Ship For Me, CSSBuy forwarding, package consolidation, CSSBuy QC, vacuum packaging, reinforced packaging, warehouse forwarding, international parcel',
    publish_date: '2026-08-12'
  }),
  articleFromStaticPage({
    key: 'cssbuy-new-website-order-parcel-migration-guide-2026',
    file: 'guides/cssbuy-new-website-order-parcel-migration-guide-2026/index.html',
    title: 'CSSBuy New Website 2026: A Buyer’s Migration Checklist for Orders, Parcels and Seller Notes',
    excerpt: 'Use CSSBuy’s redesigned 2026 website without losing order control: verify seller questions, Add Note records, warehouse decisions, price edits, 1688 quantities and parcel enquiries.',
    seo_title: 'CSSBuy New Website 2026: Order & Parcel Migration Guide',
    seo_description: 'A practical CSSBuy new website 2026 guide for Buy For Me orders, Contact Seller, Add Note, price edits, warehouse checks, returns and parcel enquiries.',
    tags: 'CSSBuy new website, CSSBuy Buy For Me, CSSBuy Contact Seller, CSSBuy Add Note, CSSBuy order enquiry, CSSBuy parcel enquiry, 1688 minimum order, CSSBuy price edit',
    publish_date: '2026-08-07'
  })
];

let html = fs.readFileSync(path, 'utf8');
if (!html.includes(marker)) {
  throw new Error('Could not find the English article array in index.html');
}

for (const article of [...automationArticles].reverse()) {
  const needle = `"key":"${article.key}"`;
  if (!html.includes(needle)) {
    html = html.replace(marker, marker + JSON.stringify(article) + ',');
  }
}

fs.writeFileSync(path, html, 'utf8');
console.log(`Injected ${automationArticles.length} scheduled CSSBuy article(s) into homepage data.`);
