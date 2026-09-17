import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const key = '4f693ea78d6241a8b27894e39b731b40';

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {'content-type': 'application/json; charset=utf-8'},
  body: JSON.stringify({
    host: 'sugargoovip.org',
    key,
    keyLocation: `https://sugargoovip.org/indexnow-${key}.txt`,
    urlList
  })
});

if (!response.ok && response.status !== 202) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
