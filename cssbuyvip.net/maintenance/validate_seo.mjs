import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const walk = (dir) => fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
const errors = [];
const warnings = [];

function textContent(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');
  if (relative !== '404.html') {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
    const h1Count = (html.match(/<h1[ >]/g) || []).length;
    if (!title) errors.push(`${relative}: missing title`);
    if (!description) errors.push(`${relative}: missing description`);
    if (h1Count !== 1) errors.push(`${relative}: expected 1 H1, found ${h1Count}`);
    if (title.length > 65) warnings.push(`${relative}: title is ${title.length} characters`);
    if (description.length > 165) warnings.push(`${relative}: description is ${description.length} characters`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    const resolved = clean.startsWith('/') ? path.join(root, clean) : path.resolve(path.dirname(file), clean);
    const candidates = [resolved, path.join(resolved, 'index.html')];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) errors.push(`${relative}: broken local reference ${ref}`);
  }
}

for (const file of htmlFiles.filter((item) => item.includes(`${path.sep}guides${path.sep}`))) {
  const html = fs.readFileSync(file, 'utf8');
  const article = html.match(/<article class="card content-card">([\s\S]*?)<\/article>/)?.[1] || '';
  if (/<h4[ >]/.test(article)) errors.push(`${path.relative(root, file)}: H4 remains in article body`);
  const words = textContent(article).split(/\s+/).filter(Boolean).length;
  console.log(`${path.relative(root, file)}: ${words} rendered words`);
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const guideIndex = fs.readFileSync(path.join(root, 'buyer-guides', 'index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
if ((home.match(/class="product-card card"/g) || []).length !== 10) errors.push('index.html: expected 10 product cards');
if ((guideIndex.match(/class="guide card"/g) || []).length !== 17) errors.push('buyer-guides/index.html: expected 17 guide cards');
if ((sitemap.match(/<url>/g) || []).length !== 25) errors.push('sitemap.xml: expected 25 URLs');

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} HTML files, 25 sitemap URLs, 17 guides and 10 products.`);
