import { readFile } from 'node:fs/promises';

const host = 'usfansvip.shop';
const key = '619826f57967c08711316cf8b2eb3d98';
const sitemap = await readFile(new URL('./sitemap.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/usfansvip\.shop\/[^<]*)<\/loc>/g)].map(match => match[1]);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList
  })
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed with HTTP ${response.status}`);
}

console.log(`Submitted ${urlList.length} canonical URLs to IndexNow.`);
