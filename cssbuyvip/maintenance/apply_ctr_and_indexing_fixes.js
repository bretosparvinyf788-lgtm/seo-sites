const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const analyticsTag = '<script defer src="/assets/analytics.js?v=20260911"></script>';

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'maintenance') return walk(full);
    return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
  });
}

function replaceAll(text, pairs) {
  for (const [from, to] of pairs) text = text.split(from).join(to);
  return text;
}

const siteJsPath = path.join(root, 'assets/site.js');
let siteJs = fs.readFileSync(siteJsPath, 'utf8');
siteJs = replaceAll(siteJs, [
  ['Independent CSSBuy resource hub · Full multilingual version', 'Independent CSSBuy spreadsheet · Reviewed September 2026'],
  ['The Best CSSBuy Spreadsheet for W2C Links, QC Photos and Latest Finds.', 'CSSBuy Spreadsheet 2026: Updated W2C Finds and QC Photos'],
  ['Browse a product-first CSSBuy spreadsheet hub with organized categories, live source links, QC guidance, pricing context and shipping-relevant details before building your haul.', 'Browse 10 reviewed CSSBuy finds with live product destinations, real images, visible prices, QC checks and shipping notes before you build a haul.'],
  ['Quick overview: shipping, coupons, QC photos, W2C links, how to use and service fees.', 'Quick overview: product links, categories, QC notes, shipping notes, order status and research reminders.'],
  ['Hot Products', '10 Featured CSSBuy Spreadsheet Finds'],
  ['Trending picks curated for you', 'Reviewed product destinations with visible prices and real images'],
  ['Hot Pick', 'CSSBuy Find'],
  ['独立 CSSBuy 资源站 · 全页面多语言版本', '独立 CSSBuy 电子表格 · 2026 年 9 月复核'],
  ['快速概览：运输、优惠券、QC 照片、W2C 链接、使用方法和服务费。', '快速概览：产品链接、分类、QC 备注、运输说明、订单状态和研究提醒。'],
  ['热门产品', '10 个 CSSBuy 精选商品'],
  ['热门精选', 'CSSBuy 精选'],
  ['Productos populares', '10 productos seleccionados de CSSBuy'],
  ['Resumen rápido: envíos, cupones, fotos QC, enlaces W2C, uso y tarifas de servicio.', 'Resumen rápido: enlaces, categorías, notas QC, envíos, estado del pedido y recordatorios.'],
  ['Selección popular', 'Selección CSSBuy'],
  ['Beliebte Produkte', '10 ausgewählte CSSBuy-Produkte'],
  ['Kurzüberblick: Versand, Gutscheine, QC-Fotos, W2C Links, Anleitung und Servicegebühren.', 'Kurzüberblick: Produktlinks, Kategorien, QC-Notizen, Versand, Bestellstatus und Recherchehinweise.'],
  ['Beliebter Pick', 'CSSBuy-Auswahl'],
  ['Produtos populares', '10 produtos selecionados da CSSBuy'],
  ['Resumo rápido: envios, cupons, fotos QC, links W2C, uso e taxas de serviço.', 'Resumo rápido: links, categorias, notas QC, envio, status do pedido e lembretes.'],
  ['Seleção popular', 'Seleção CSSBuy']
]);
fs.writeFileSync(siteJsPath, siteJs);

const related = [
  ['/guides/cssbuy-product-link-not-working-guide-2026/', 'Recover a CSSBuy Product Link'],
  ['/guides/cssbuy-qc-photos-guide/', 'Check CSSBuy QC Photos'],
  ['/guides/cssbuy-shipping-cost-guide/', 'Plan CSSBuy Shipping Cost'],
  ['/guides/cssbuy-return-exchange-decision-workflow-2026/', 'Use the CSSBuy Return and Exchange Workflow'],
  ['/guides/cssbuy-parcel-insurance-claim-evidence-guide-2026/', 'Prepare CSSBuy Parcel Insurance Evidence']
];

for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.split('/blog/2026-07-10-cssbuy-transaction-safe-haul-planning.html').join('/blog/2026-07-10-cssbuy-transaction-safe-haul-planning');
  if (file.includes(`${path.sep}guides${path.sep}`)) {
    html = html.split('<a href="/blog/">Blog</a>').join('<a href="/about/">About</a>');
  }

  if (file.includes(`${path.sep}guides${path.sep}`) && !file.endsWith(`${path.sep}guides${path.sep}index.html`) && !html.includes('class="related-guides"')) {
    const current = '/' + path.relative(root, path.dirname(file)).split(path.sep).join('/') + '/';
    const links = related.filter(([href]) => href !== current).slice(0, 4);
    const block = `<aside class="related-guides"><h2>Related CSSBuy Guides</h2><ul>${links.map(([href,label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></aside>`;
    const at = html.lastIndexOf('</article>');
    if (at !== -1) html = html.slice(0, at) + block + html.slice(at);
  }

  if (!html.includes('/assets/analytics.js')) {
    html = html.replace('</body>', `${analyticsTag}\n</body>`);
  }
  fs.writeFileSync(file, html);
}

const spreadsheetGuide = path.join(root, 'guides/best-cssbuy-spreadsheet-2026/index.html');
let guide = fs.readFileSync(spreadsheetGuide, 'utf8');
guide = replaceAll(guide, [
  ['Best CSSBuy Spreadsheet 2026: W2C Links, QC Checks and Safer Haul Planning', 'How to Use a CSSBuy Spreadsheet: W2C, QC and Haul Planning'],
  ['A practical 2026 guide to using a CSSBuy spreadsheet for W2C research, seller checks, QC evidence, sizing, weight estimates and safer haul planning.', 'Learn how to use a CSSBuy spreadsheet to verify W2C links, compare exact variants, review QC evidence and plan a safer, shipping-aware haul.']
]);
fs.writeFileSync(spreadsheetGuide, guide);

const guideIndexPath = path.join(root, 'guides/index.html');
let guideIndex = fs.readFileSync(guideIndexPath, 'utf8');
guideIndex = guideIndex.split('"headline":"Best CSSBuy Spreadsheet 2026: W2C Links, QC Checks and Safer Haul Planning"').join('"headline":"How to Use a CSSBuy Spreadsheet: W2C, QC and Haul Planning"');
guideIndex = guideIndex.replace(
  /<h2>(?!<a)([^<]+)<\/h2><p>([\s\S]*?)<\/p><a class="guide-link" href="([^"]+)">Read Guide →<\/a>/g,
  (_match, title, excerpt, href) => `<h2><a href="${href}">${title}</a></h2><p>${excerpt}</p><a class="guide-link" href="${href}">Read ${title} →</a>`
);
fs.writeFileSync(guideIndexPath, guideIndex);

console.log('Applied CTR metadata, clean links, analytics hooks and related-guide links.');
