import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value);

const priorityGuides = [
  {
    slug: 'is-sugargoo-legit-safe-review-2026',
    title: 'Is Sugargoo Legit and Safe in 2026? An Evidence-Based Buyer Review',
    description: 'A risk-by-risk review of ordering, QC photos, payments, returns, shipping and the controls a buyer should verify.',
    words: '1,601',
    minutes: 9
  },
  {
    slug: 'sugargoo-shipping-calculator-cost-estimate-2026',
    title: 'Sugargoo Shipping Calculator 2026: Estimate Billable Weight and Cost',
    description: 'Calculate actual versus volumetric weight, model packaging changes and understand why a final quote can differ.',
    words: '1,554',
    minutes: 8
  },
  {
    slug: 'sugargoo-shipping-to-usa-cost-time-2026',
    title: 'Sugargoo Shipping to the USA 2026: Cost, Time and Route Checklist',
    description: 'A USA-focused method for comparing eligible routes, complete cost, tracking and customs-ready parcel records.',
    words: '1,620',
    minutes: 9
  }
];

const conciseTitles = {
  'how-to-read-sugargoo-qc-photos': 'Sugargoo QC Photos Guide 2026: What to Check',
  'sugargoo-1688-sample-to-bulk-2026': 'Buy from 1688 with Sugargoo: Sample-to-Bulk Guide',
  'sugargoo-customs-declaration-record-2026': 'Sugargoo Customs Declaration Guide 2026',
  'sugargoo-diy-order-purchase-brief-2026': 'Sugargoo DIY Order Guide 2026: Manual Purchase Tips',
  'sugargoo-forwarding-order-intake-2026': 'Sugargoo Forwarding Order Guide 2026',
  'sugargoo-order-status-control-2026': 'Sugargoo Order Status Guide 2026: What Each Means',
  'sugargoo-packaging-add-ons-2026': 'Sugargoo Packaging Guide 2026: Boxes, Vacuum & Foam',
  'sugargoo-payment-methods-refund-records-2026': 'Sugargoo Payment Methods & Refund Guide 2026',
  'sugargoo-returns-refunds-evidence-2026': 'Sugargoo Returns & Refunds Guide 2026',
  'sugargoo-sensitive-goods-route-eligibility-2026': 'Sugargoo Sensitive Goods & Shipping Restrictions',
  'sugargoo-shipping-guide-2026': 'Sugargoo Shipping Guide 2026: Cost, Weight & Routes',
  'sugargoo-shipping-insurance-claims-2026': 'Sugargoo Shipping Insurance & Claims Guide 2026',
  'sugargoo-spreadsheet-workflow-2026': 'How to Use a Sugargoo Spreadsheet in 2026',
  'sugargoo-warehouse-timing-2026': 'Sugargoo Warehouse Guide 2026: Storage & Timing',
  'sugargoo-weidian-sku-order-checklist-2026': 'Buy from Weidian with Sugargoo: 2026 SKU Checklist'
};

function updateGuideHub() {
  let html = read('guides/index.html');
  html = html
    .replaceAll('Read 15 original Sugargoo spreadsheet buyer guides', 'Read 18 original Sugargoo buyer guides')
    .replaceAll('Read 15 original guides', 'Read 18 original guides')
    .replaceAll('15 original guides covering', '18 original guides covering')
    .replaceAll('15 original guides', '18 original guides')
    .replaceAll('Fifteen original, detailed guides', 'Eighteen original, detailed guides');

  const newRows = priorityGuides.map(guide => `<article class="guide-row"><div class="guide-number">00</div><div><div class="tag">September 17, 2026 · ${guide.words} words</div><h2><a href="${guide.slug}/">${guide.title}</a></h2><p>${guide.description}</p></div><a class="read" href="${guide.slug}/">Read full guide →</a></article>`).join('');
  if (!html.includes('href="is-sugargoo-legit-safe-review-2026/"')) {
    html = html.replace(/(<section class="guides-shell guide-list">)/, `$1${newRows}`);
  }
  let row = 0;
  html = html.replace(/<div class="guide-number">\d{2}<\/div>/g, () => `<div class="guide-number">${String(++row).padStart(2, '0')}</div>`);

  const urls = [...html.matchAll(/<h2><a href="([^"]+)"/g)].map(match => new URL(match[1], 'https://sugargoovip.org/guides/').href);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Sugargoo Spreadsheet', item: 'https://sugargoovip.org/'},
        {'@type': 'ListItem', position: 2, name: 'Buyer Guides', item: 'https://sugargoovip.org/guides/'}
      ]},
      {'@type': 'ItemList', name: 'Sugargoo Buyer Guides 2026', numberOfItems: urls.length, itemListElement: urls.map((url, index) => ({'@type': 'ListItem', position: index + 1, url}))}
    ]
  };
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script><style>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script><style>`);
  write('guides/index.html', html);
}

function updateHome() {
  let html = read('index.html');
  const cards = priorityGuides.map((guide, index) => `<article class="guide-card"><div class="guide-cover"><div class="guide-no">0${index + 1}</div></div><div class="guide-body"><div class="guide-meta"><span>September 17, 2026</span><span>•</span><span>${guide.minutes} min read</span><span>•</span><span class="guide-word-count">${guide.words} words</span></div><h3><a href="guides/${guide.slug}/">${guide.title}</a></h3><p>${guide.description}</p><a class="text-btn" href="guides/${guide.slug}/" aria-label="Read ${guide.title}">Read full guide →</a></div></article>`).join('\n        ');
  html = html.replace(/(<div class="guides-grid" id="guideGrid">)[\s\S]*?(\s*<\/div><div class="all-guides">)/, `$1\n        ${cards}$2`);
  html = html
    .replaceAll('View all buyer guides (15)', 'View all buyer guides (18)')
    .replaceAll('查看全部买家指南（13篇）', '查看全部买家指南（18篇）');

  const faqMatch = html.match(/const faqs=(\[[\s\S]*?\]);\s*const translations=/);
  if (!faqMatch) throw new Error('Could not locate homepage FAQ data');
  const faqs = Function(`return ${faqMatch[1]}`)();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({'@type': 'Question', name: question, acceptedAnswer: {'@type': 'Answer', text: answer}}))
  };
  html = html.replace(/\s*<script id="homepage-faq-schema"[\s\S]*?<\/script>/, '');
  html = html.replace('</head>', `  <script id="homepage-faq-schema" type="application/ld+json">${JSON.stringify(faqSchema).replace(/</g, '\\u003c')}</script>\n</head>`);
  write('index.html', html);
}

function updateSitemap() {
  const existing = new Map([...read('sitemap.xml').matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(match => [match[1], match[2]]));
  const core = [
    ['https://sugargoovip.org/', 'daily', '1.0'],
    ['https://sugargoovip.org/spreadsheet/', 'daily', '0.9'],
    ['https://sugargoovip.org/guides/', 'daily', '0.9']
  ];
  const articleFiles = fs.readdirSync(path.join(root, 'guides'), {withFileTypes: true})
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort((a, b) => {
      const ai = priorityGuides.findIndex(guide => guide.slug === a);
      const bi = priorityGuides.findIndex(guide => guide.slug === b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return a.localeCompare(b);
    });
  const urls = core.map(([url, changefreq, priority]) => ({url, lastmod: '2026-09-17', changefreq, priority}));
  for (const slug of articleFiles) {
    const url = `https://sugargoovip.org/guides/${slug}/`;
    urls.push({url, lastmod: priorityGuides.some(guide => guide.slug === slug) ? '2026-09-17' : (existing.get(url) || '2026-08-27'), changefreq: 'monthly', priority: '0.8'});
  }
  const body = urls.map(item => `  <url><loc>${item.url}</loc><lastmod>${item.lastmod}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}

function updateArticleTitles() {
  for (const [slug, title] of Object.entries(conciseTitles)) {
    const file = `guides/${slug}/index.html`;
    const html = read(file).replace(/<title>[\s\S]*?<\/title>/, `<title>${title.replaceAll('&', '&amp;')}</title>`);
    write(file, html);
  }
}

updateGuideHub();
updateHome();
updateSitemap();
updateArticleTitles();
console.log('Updated homepage, guide hub and sitemap.');
