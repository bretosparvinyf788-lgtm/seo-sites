const fs = require('fs');

const host = 'cssbuyvip.shop';
const key = 'de69af3106ac857d2d00b6a6e09ac0bd';
const keyLocation = `https://${host}/${key}.txt`;

async function main() {
  if (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main') {
    console.log(`Skipping IndexNow for preview branch ${process.env.CF_PAGES_BRANCH}`);
    return;
  }

  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = [...new Set([...sitemap.matchAll(/<loc>(https:\/\/cssbuyvip\.shop[^<]+)<\/loc>/g)].map(match => match[1]))];
  if (!urls.length) throw new Error('No cssbuyvip.shop URLs found in sitemap.xml');

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {'content-type': 'application/json; charset=utf-8'},
    body: JSON.stringify({host, key, keyLocation, urlList: urls})
  });

  if (!response.ok) throw new Error(`IndexNow returned HTTP ${response.status}`);
  console.log(`Submitted ${urls.length} canonical URLs to IndexNow in one batch`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
