import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const guidesRoot = path.join(root, 'guides');

for (const slug of fs.readdirSync(guidesRoot)) {
  const file = path.join(guidesRoot, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  if (!description) continue;
  html = html.replace(/<script type="application\/ld\+json">([^<]+)<\/script>/g, (block, jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      if (data['@type'] !== 'Article') return block;
      data.description = description;
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    } catch {
      return block;
    }
  });
  fs.writeFileSync(file, html);
}

const collectionFile = path.join(root, 'buyer-guides', 'index.html');
let collection = fs.readFileSync(collectionFile, 'utf8');
const hasPart = [...collection.matchAll(/<article class="guide card"><a href="\.\.\/guides\/([^/]+)\/"[\s\S]*?<h3>([^<]+)<\/h3>/g)].map((match) => ({
  '@type': 'Article',
  headline: match[2].replaceAll('&amp;', '&'),
  url: `https://cssbuyvip.net/guides/${match[1]}/`
}));
collection = collection.replace(/<script type="application\/ld\+json">([^<]+)<\/script>/, () => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'CSSBuy Buyer Guides',
  url: 'https://cssbuyvip.net/buyer-guides/',
  hasPart
})}</script>`);
fs.writeFileSync(collectionFile, collection);

console.log(`Synced ${hasPart.length} buyer guides and Article descriptions.`);
