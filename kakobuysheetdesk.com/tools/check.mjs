import app from '../worker/index.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
globalThis.fetch=async()=>{throw Error('Offline snapshot verification');};
const langs=JSON.parse(fs.readFileSync('tools/content.json','utf8'));
const cat=JSON.parse(fs.readFileSync('tools/catalog-full.json','utf8'));
assert.equal(Object.values(cat).reduce((n,v)=>n+v.items.length,0),4355);
for(const [l,t] of Object.entries(langs)){
 assert.equal(t.questions.length,12);assert.equal(t.steps.length,8);
 assert.deepEqual(Object.keys(t).sort(),Object.keys(langs.en).sort());
 const response=await app.fetch(new Request('https://kakobuysheetdesk.com/?lang='+l),{},{});
 assert.equal(response.status,200);const html=await response.text();assert(html.includes('lang="'+l+'"'));assert(!html.includes('undefined'));assert(html.includes(t.questions[0][0].replace(/&/g,'&amp;')));
 const schema=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);assert.equal(JSON.parse(schema[1]).mainEntity.length,12);
}
const page=await app.fetch(new Request('https://kakobuysheetdesk.com/category/shoes?sort=low'),{},{});const html=await page.text();const prices=[...html.matchAll(/data-usd="([\d.]+)"/g)].map(m=>+m[1]);assert.equal(prices.length,48);assert(prices.every((x,i)=>!i||x>=prices[i-1]));
const detail=await (await app.fetch(new Request('https://kakobuysheetdesk.com/product/7894400057'),{},{})).text();assert(detail.includes('item2.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7894400057&affcode=wtqaa'));assert.equal([...detail.matchAll(/data-gallery="/g)].length,4);assert(detail.indexOf('qc-section')<detail.indexOf('qc-grid'));
const guide=await(await app.fetch(new Request('https://kakobuysheetdesk.com/guide'),{},{})).text();assert.equal([...guide.matchAll(/<section class="step"/g)].length,8);assert.equal([...guide.matchAll(/src="\/guide-image\//g)].length,8);
const sitemap=await(await app.fetch(new Request('https://kakobuysheetdesk.com/sitemap.xml'),{},{})).text();assert.equal([...sitemap.matchAll(/<url>/g)].length,4369);
console.log('Passed: 24 locales, 4,355 listings, global sorting, gallery separation, referral links, eight illustrated guide steps, sitemap.');
