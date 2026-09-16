import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const failures = [];
const notes = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'maintenance' && entry.name !== 'seo-data') return walk(full);
    return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
  });
}

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function plainWords(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const redirectSources = new Set(
  fs.readFileSync(path.join(root, '_redirects'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/)[0])
    .filter((value) => value && value.startsWith('/') && !value.includes('*'))
);
const files = walk(root);
for (const file of files) {
  const rel = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');
  if (count(html, /<title\b/gi) !== 1) failures.push(`${rel}: expected one title`);
  if (!html.includes('rel="canonical"')) failures.push(`${rel}: missing canonical`);
  if (!html.includes('/assets/analytics.js')) failures.push(`${rel}: missing custom analytics`);
  if (!html.includes('G-S0L11KHDQ7')) failures.push(`${rel}: missing GA4 tag`);
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch (error) { failures.push(`${rel}: invalid JSON-LD (${error.message})`); }
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/gi)) {
    const href = match[1];
    if (!href || href === '/') continue;
    if (redirectSources.has(href)) continue;
    if (href.endsWith('.html')) failures.push(`${rel}: internal link uses redirecting .html URL (${href})`);
    let target;
    if (href.endsWith('/')) target = path.join(root, href, 'index.html');
    else if (path.extname(href)) target = path.join(root, href);
    else {
      const flat = path.join(root, `${href}.html`);
      const nested = path.join(root, href, 'index.html');
      target = fs.existsSync(flat) ? flat : nested;
    }
    if (!fs.existsSync(target)) failures.push(`${rel}: broken internal link (${href})`);
  }
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const categories = home.match(/<div class="category-grid">([\s\S]*?)<\/div>/)?.[1] || '';
const products = home.match(/<div class="clean-product-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/)?.[1] || '';
const latest = home.match(/<section id="articles"[\s\S]*?<div class="article-list">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || '';
const faq = home.match(/<div id="faq"[\s\S]*?<\/div>\s*<\/section>/)?.[0] || '';
if (count(categories, /class="cat category-tile"/g) !== 10) failures.push('homepage: category count is not 10');
if (count(products, /class="product-card"/g) !== 10) failures.push('homepage: product count is not 10');
if (count(latest, /class="article"/g) !== 3) failures.push('homepage: latest guide count is not 3');
if (count(faq, /<details\b/g) !== 10) failures.push('homepage: FAQ count is not 10');

const newArticlePath = path.join(root, 'guides/cssbuy-coupon-fee-verification-2026/index.html');
const newArticle = fs.readFileSync(newArticlePath, 'utf8');
const articleBody = newArticle.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1] || '';
const articleWords = plainWords(articleBody);
if (articleWords < 1500 || articleWords > 1800) failures.push(`new article: ${articleWords} words, expected 1500-1800`);
if (/<a\b/i.test(articleBody)) failures.push('new article: body contains a link');
notes.push(`new article words: ${articleWords}`);

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (locs.some((url) => url.endsWith('.html'))) failures.push('sitemap: contains redirecting .html URL');
if (new Set(locs).size !== locs.length) failures.push('sitemap: duplicate URL');
for (const value of locs) {
  const url = new URL(value);
  let local;
  if (url.pathname === '/') local = path.join(root, 'index.html');
  else if (url.pathname.endsWith('/')) local = path.join(root, url.pathname, 'index.html');
  else local = path.join(root, `${url.pathname}.html`);
  if (!fs.existsSync(local)) failures.push(`sitemap: no source file for ${value}`);
}
notes.push(`sitemap URLs: ${locs.length}`);

const visibleLeaks = /Not deployed|Editorial note|right SEO angle|original long-form SEO|Independent long-form SEO/i;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (visibleLeaks.test(html)) failures.push(`${path.relative(root, file)}: editorial or deployment note remains`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(['SEO release validation passed.', ...notes, `HTML pages: ${files.length}`].join('\n'));
