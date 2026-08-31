const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const image = 'https://cssbuyvip.shop/assets/og-cssbuy-spreadsheet.png';

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    if (entry.name === 'maintenance' || entry.name === 'assets') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

let updated = 0;
for (const file of walk(root).filter((file) => file.endsWith('.html'))) {
  if (file === path.join(root, 'index.html')) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('property="og:image"')) {
    const block = `  <meta property="og:image" content="${image}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n`;
    html = html.replace(/(\s*<meta name="twitter:card")/, `\n${block}$1`);
    if (!html.includes('property="og:image"')) html = html.replace('</head>', `${block}</head>`);
  }
  if (!html.includes('name="twitter:image"')) {
    html = html.replace(/(<meta name="twitter:card"[^>]*>)/, `$1\n  <meta name="twitter:image" content="${image}">`);
    if (!html.includes('name="twitter:image"')) html = html.replace('</head>', `  <meta name="twitter:image" content="${image}">\n</head>`);
  }
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`Ensured social preview images on ${updated} HTML pages.`);
