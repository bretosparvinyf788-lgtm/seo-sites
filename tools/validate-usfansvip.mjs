import { access, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'usfansvip.store');
const failures = [];
const pass = message => console.log(`PASS  ${message}`);
const fail = message => { failures.push(message); console.error(`FAIL  ${message}`); };
const expect = (condition, message) => condition ? pass(message) : fail(message);
const words = html => ((html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)) || []).length;

const homePath = join(root, 'index.html');
const home = await readFile(homePath, 'utf8');
const homeSize = (await stat(homePath)).size;
expect(homeSize < 100_000, `homepage HTML is ${homeSize.toLocaleString()} bytes (<100 KB)`);
expect(!home.includes('data:image'), 'homepage has no embedded data images');
expect((home.match(/\['[^\n]*?\]/g) || []).length >= 20, 'homepage data arrays are present');
expect((home.match(/class="town-stop"/g) || []).length === 1, 'category template is defined once');
expect((home.match(/class="product"/g) || []).length === 1, 'product template is defined once');
expect((home.match(/\['What |\['How |\['Does |\['Are |\['Can /g) || []).length === 10, 'homepage includes exactly 10 FAQ entries');
expect(home.includes('loading="lazy"') && home.includes('width="500" height="500"'), 'product images reserve space and lazy-load');
expect(home.includes("'product_click'") && home.includes("'category_click'") && home.includes("'guide_click'"), 'GA4 click events are present');

const guideRoot = join(root, 'guides');
const guideEntries = (await readdir(guideRoot, { withFileTypes: true })).filter(entry => entry.isDirectory());
expect(guideEntries.length === 13, `guide library contains ${guideEntries.length} article directories`);

for (const entry of guideEntries) {
  const page = await readFile(join(guideRoot, entry.name, 'index.html'), 'utf8');
  const body = page.match(/<article class="copy">([\s\S]*?)<\/article>/)?.[1] || '';
  const count = words(body);
  expect(count >= 1500 && count <= 1800, `${entry.name}: ${count} article words`);
  expect(!/<a\s/i.test(body), `${entry.name}: no links inside article body`);
  expect(/<figure class="(?:cover|article-cover)">/.test(page), `${entry.name}: distinct guide cover is present`);
  expect((page.match(/<h1[ >]/g) || []).length === 1, `${entry.name}: exactly one H1`);
  expect(/<link[\s\S]{0,120}?rel="canonical"/.test(page), `${entry.name}: canonical URL is present`);
  expect(page.includes('application/ld+json'), `${entry.name}: structured data is present`);
}

const guideIndex = await readFile(join(guideRoot, 'index.html'), 'utf8');
expect((guideIndex.match(/class="guide-card"/g) || []).length === 13, 'guide index lists all 13 articles');
expect(guideIndex.includes('grid-template-columns:repeat(3'), 'guide index uses a three-column desktop grid');

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/usfansvip\.store(.*?)<\/loc>/g)].map(match => match[1] || '/');
expect(urls.length === 15, `sitemap lists ${urls.length} canonical URLs`);
for (const url of urls) {
  const localPath = url === '/' ? homePath : join(root, url.replace(/^\//, ''), 'index.html');
  try { await access(localPath); pass(`sitemap target exists: ${url}`); } catch { fail(`missing sitemap target: ${url}`); }
}

const htmlFiles = [homePath, join(guideRoot, 'index.html'), ...guideEntries.map(entry => join(guideRoot, entry.name, 'index.html'))];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|usfans-logo\.png|favicon\.png)[^"]*)"/g)) {
    const path = match[1].split(/[?#]/)[0];
    try { await access(join(root, path.slice(1))); } catch { fail(`missing local asset ${path} referenced by ${file.slice(root.length + 1)}`); }
  }
}
if (!failures.some(message => message.startsWith('missing local asset'))) pass('all referenced local assets exist');

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s).`);
  process.exit(1);
}
console.log('\nAll USFansVIP checks passed.');
