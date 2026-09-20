import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'usfansvip.store');
const coverDir = join(root, 'assets', 'guides');
const guides = [
  ['usfans-1688-batch-buying-moq-variants-warehouse-evidence', '1688 BATCH CONTROL', 'MOQ, variants and warehouse evidence', '#ff6533', 'grid'],
  ['usfans-parcel-submission-audit-address-route-packaging', 'PARCEL AUDIT', 'Address, route and packaging', '#2778ff', 'parcel'],
  ['usfans-warehouse-calendar-90-day-consolidation', 'WAREHOUSE CALENDAR', '90-day consolidation plan', '#7b4ee8', 'calendar'],
  ['usfans-spreadsheet-price-audit-before-payment', 'PRICE AUDIT', 'Calculate the real order cost', '#f4aa00', 'calculator'],
  ['usfans-restricted-items-route-check-before-buying', 'ROUTE RESTRICTIONS', 'Check the exit route before buying', '#e44646', 'stop'],
  ['evidence-first-usfans-buying-workflow', 'BUYING WORKFLOW', 'Evidence from link to warehouse', '#19a974', 'folder'],
  ['usfans-qc-photos-return-window', 'QC AND RETURNS', 'Read QC before the return window closes', '#d34bc8', 'magnifier'],
  ['usfans-shipping-cost-volumetric-weight-customs', 'SHIPPING PLANNING', 'Volumetric weight and customs risk', '#0d9caf', 'dimensions'],
];

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const drawings = {
  grid: accent => '<g stroke="#211f36" stroke-width="7"><rect x="744" y="175" width="110" height="110" rx="17" fill="' + accent + '"/><rect x="875" y="175" width="110" height="110" rx="17" fill="#ffd960"/><rect x="1006" y="175" width="110" height="110" rx="17" fill="#fff"/><rect x="744" y="306" width="110" height="110" rx="17" fill="#fff"/><rect x="875" y="306" width="110" height="110" rx="17" fill="' + accent + '"/><rect x="1006" y="306" width="110" height="110" rx="17" fill="#ffd960"/></g><path d="M770 468h318" stroke="#211f36" stroke-width="12" stroke-linecap="round"/><path d="m1051 441 37 27-37 27" fill="none" stroke="' + accent + '" stroke-width="12"/>',
  parcel: accent => '<path d="m774 225 138-73 168 81-148 78-158-86Z" fill="#ffd960" stroke="#211f36" stroke-width="8"/><path d="m774 225 158 86v203l-158-88V225Z" fill="#fff" stroke="#211f36" stroke-width="8"/><path d="m1080 233-148 78v203l148-88V233Z" fill="' + accent + '" stroke="#211f36" stroke-width="8"/><path d="m863 179 163 82v75" fill="none" stroke="#211f36" stroke-width="8"/><path d="m974 407 28 28 54-69" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>',
  calendar: accent => '<rect x="744" y="166" width="358" height="350" rx="28" fill="#fff" stroke="#211f36" stroke-width="9"/><path d="M744 248h358" stroke="#211f36" stroke-width="9"/><path d="M820 135v65M1026 135v65" stroke="' + accent + '" stroke-width="18" stroke-linecap="round"/><g fill="#ffd960" stroke="#211f36" stroke-width="5"><rect x="790" y="290" width="62" height="62" rx="10"/><rect x="892" y="290" width="62" height="62" rx="10"/><rect x="994" y="290" width="62" height="62" rx="10"/><rect x="790" y="392" width="62" height="62" rx="10"/></g><path d="m902 422 35 35 92-105" fill="none" stroke="' + accent + '" stroke-width="17" stroke-linecap="round"/>',
  calculator: accent => '<rect x="781" y="137" width="286" height="416" rx="35" fill="#fff" stroke="#211f36" stroke-width="9"/><rect x="820" y="186" width="208" height="78" rx="15" fill="' + accent + '" stroke="#211f36" stroke-width="7"/><g fill="#ffd960" stroke="#211f36" stroke-width="5"><circle cx="845" cy="325" r="26"/><circle cx="924" cy="325" r="26"/><circle cx="1003" cy="325" r="26"/><circle cx="845" cy="408" r="26"/><circle cx="924" cy="408" r="26"/><circle cx="1003" cy="408" r="26"/><circle cx="845" cy="491" r="26"/><rect x="898" y="465" width="131" height="52" rx="18" fill="' + accent + '"/></g>',
  stop: accent => '<path d="m920 128 142 59 59 142-59 142-142 59-142-59-59-142 59-142 142-59Z" fill="' + accent + '" stroke="#211f36" stroke-width="10"/><rect x="797" y="295" width="246" height="68" rx="29" fill="#fff"/><circle cx="1081" cy="486" r="53" fill="#ffd960" stroke="#211f36" stroke-width="9"/><path d="m1056 486 18 18 36-44" fill="none" stroke="#211f36" stroke-width="10" stroke-linecap="round"/>',
  folder: accent => '<path d="M741 231h151l45 50h178v248H741V231Z" fill="#ffd960" stroke="#211f36" stroke-width="9"/><path d="M741 306h374l-46 223H787l-46-223Z" fill="#fff" stroke="#211f36" stroke-width="9"/><rect x="827" y="163" width="225" height="267" rx="22" fill="' + accent + '" stroke="#211f36" stroke-width="8"/><path d="m865 298 42 42 95-119" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/><path d="M812 529h282" stroke="#211f36" stroke-width="9"/>',
  magnifier: accent => '<circle cx="893" cy="293" r="137" fill="#fff" stroke="#211f36" stroke-width="11"/><circle cx="893" cy="293" r="87" fill="' + accent + '" opacity=".3"/><path d="m991 391 117 117" stroke="#211f36" stroke-width="31" stroke-linecap="round"/><path d="m835 294 38 38 79-93" fill="none" stroke="' + accent + '" stroke-width="17" stroke-linecap="round"/><rect x="735" y="464" width="178" height="75" rx="22" fill="#ffd960" stroke="#211f36" stroke-width="8"/>',
  dimensions: accent => '<rect x="815" y="213" width="240" height="240" rx="25" fill="#fff" stroke="#211f36" stroke-width="9"/><path d="m815 213 120-72 120 72-120 74-120-74Z" fill="#ffd960" stroke="#211f36" stroke-width="9"/><path d="M935 287v166" stroke="#211f36" stroke-width="9"/><path d="M760 186v298M728 220l32-34 32 34M728 450l32 34 32-34" fill="none" stroke="' + accent + '" stroke-width="11" stroke-linecap="round"/><path d="M819 511h232M849 479l-30 32 30 32M1021 479l30 32-30 32" fill="none" stroke="' + accent + '" stroke-width="11" stroke-linecap="round"/>'
};

await mkdir(coverDir, { recursive: true });
for (const [slug, label, title, accent, drawing] of guides) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="t d"><title id="t">' + esc(title) + '</title><desc id="d">' + esc(label) + ' guide cover</desc><rect width="1200" height="675" rx="36" fill="#fff8ec"/><circle cx="1035" cy="110" r="250" fill="' + accent + '" opacity=".14"/><text x="72" y="106" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="' + accent + '" letter-spacing="3">' + esc(label) + ' · 2026</text><text x="72" y="224" font-family="Arial,sans-serif" font-size="58" font-weight="900" fill="#211f36">' + esc(title.split(' ').slice(0, 4).join(' ')) + '</text><text x="72" y="296" font-family="Arial,sans-serif" font-size="58" font-weight="900" fill="#211f36">' + esc(title.split(' ').slice(4).join(' ')) + '</text><text x="72" y="405" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#615e70">Evidence before payment. Control before shipping.</text><rect x="72" y="482" width="330" height="72" rx="22" fill="' + accent + '" stroke="#211f36" stroke-width="6"/><text x="102" y="528" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="#fff">USFANSVIP.STORE</text>' + drawings[drawing](accent) + '</svg>';
  await writeFile(join(coverDir, slug + '.svg'), svg);

  const pagePath = join(root, 'guides', slug, 'index.html');
  let html = await readFile(pagePath, 'utf8');
  const imagePath = '/assets/guides/' + slug + '.svg';
  if (!html.includes('/assets/guide-cover.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/assets/guide-cover.css">\n</head>');
  }
  if (!html.includes('class="article-cover"')) {
    html = html.replace(/(<section class="hero"[\s\S]*?<\/section>)/, '$1\n    <figure class="article-cover"><img src="' + imagePath + '" alt="' + esc(title) + ' guide cover" width="1200" height="675" fetchpriority="high"></figure>');
  }
  if (!html.includes('property="og:image"')) {
    html = html.replace('<meta property="og:url"', '<meta property="og:image" content="https://usfansvip.store' + imagePath + '">\n  <meta property="og:url"');
  }
  html = html.replace(/<div class="cta">([\s\S]*?)<\/div><\/article><\/div>/, '</article></div><div class="cta article-end-cta">$1</div>');
  await writeFile(pagePath, html);
}

console.log('Added distinct covers to ' + guides.length + ' existing guides.');
