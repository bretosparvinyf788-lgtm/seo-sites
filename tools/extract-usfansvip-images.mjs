import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = join(repoRoot, 'usfansvip.store', 'index.html');
const imageDir = join(repoRoot, 'usfansvip.store', 'assets', 'images');
const names = [
  'homepage-hero.webp',
  'product-01-lv-sneakers.webp',
  'product-02-jacquemus-bag.webp',
  'product-03-dior-slippers.webp',
  'product-04-football-tee.webp',
  'product-05-chrome-hearts-hoodie.webp',
  'product-06-prada-hat.webp',
  'product-07-essentials-shorts.webp',
  'product-08-arcteryx-jacket.webp',
  'product-09-ralph-lauren-coat.webp',
  'product-10-necklace-collection.webp',
];

let html = await readFile(pagePath, 'utf8');
const dataImage = /data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)/g;
const matches = [...html.matchAll(dataImage)];

if (matches.length === 0) {
  console.log('No embedded images found; nothing to extract.');
  process.exit(0);
}

if (matches.length !== names.length) {
  throw new Error(`Expected ${names.length} embedded images, found ${matches.length}.`);
}

await mkdir(imageDir, { recursive: true });
for (let index = 0; index < matches.length; index += 1) {
  const [, , payload] = matches[index];
  const filename = names[index];
  await writeFile(join(imageDir, filename), Buffer.from(payload, 'base64'));
  html = html.replace(matches[index][0], `/assets/images/${filename}`);
}

await writeFile(pagePath, html);
console.log(`Extracted ${matches.length} images and updated the homepage.`);
