import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';

const source=fs.readFileSync('dist/server/index.js','utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const expected=new Set(JSON.parse(gunzipSync(fs.readFileSync('data/visual-index.json.gz'))).items.map(p=>String(Array.isArray(p)?p[0]:p.id)));
assert([...expected].every(id=>/^\d+$/.test(id)));
const origin='https://orientdigsheetdesk.com';
const root=await worker.fetch(new Request(origin+'/sitemap.xml'),{},{});
assert.equal(root.status,200);
const maps=[...(await root.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
assert.equal(maps.length,24);
for(const map of maps){
  const response=await worker.fetch(new Request(map),{},{});
  assert.equal(response.status,200);
  assert(response.headers.get('Content-Type').includes('application/xml'));
  const urls=[...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1].replaceAll('&amp;','&'));
  assert.equal(urls.length,expected.size+15,map);
  assert.equal(new Set(urls).size,urls.length,map);
  const lang=map.match(/sitemap-([a-z]+)\.xml$/)[1];
  const ids=new Set();
  for(const raw of urls){
    const url=new URL(raw);
    assert.equal(url.origin,origin);
    assert.equal(url.searchParams.get('lang'),lang==='en'?null:lang);
    if(url.pathname.startsWith('/product/')){
      const id=url.pathname.match(/^\/product\/(\d+)\/$/)?.[1];
      assert(id&&expected.has(id),'Invalid product URL: '+raw);
      ids.add(id);
    }
  }
  assert.equal(ids.size,expected.size,map);
}
console.log(JSON.stringify({languageSitemaps:maps.length,validProductsPerLanguage:expected.size,uniqueUrlsPerLanguage:expected.size+15}));
