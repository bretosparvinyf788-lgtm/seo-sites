import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../worker/index.js';
const snapshot=JSON.parse(fs.readFileSync('fixtures/snapshot.json'));
const locales=['en','zh','de','fr','es','it','pt','pl','nl','sv','da','no','fi','cs','ru','uk','ro','hu','el','tr','ja','ko','ar','he'];
const req=(p,host='litbuyqcnotes.com')=>worker.fetch(new Request('https://'+host+p),{}, {waitUntil(){}});
let count=0;
for(const lang of locales){for(const path of ['/','/categories','/product/2878','/faq','/saved','/beginner-guide']){const r=await req(path+'?lang='+lang);assert.equal(r.status,200);const h=await r.text();assert(!h.includes('undefined'));assert(h.includes('Litbuy QC Notes'));assert(!/href="\/guides?(?:[/?#"])/.test(h));assert(!h.includes('id="guide"'));assert(!/litbuysheetbook|hipobuy|usfans/i.test(h));assert(h.includes('https://litbuy.com/register?inviteCode=E32JME4UQ'));assert.equal((h.match(/<h1\b/g)||[]).length,1);if(path==='/'){assert.equal((h.match(/class="sheet-row"/g)||[]).length,snapshot.length);assert.equal((h.match(/<details>/g)||[]).length,10);assert.equal((h.match(/<link rel="alternate"/g)||[]).length,25)}if(path==='/product/2878'){assert(h.indexOf('id="qc"')>h.indexOf('class="detail-layout"'));assert(h.includes('https://litbuy.com/product/2/'+snapshot.find(p=>p.id==='2878').itemId+'?inviteCode=7N6D4Y6EE'))}count++}}
assert.equal((await req('/product/2932')).status,200);
let r=await req('/sitemap.xml');const xml=await r.text();assert.equal((xml.match(/<url>/g)||[]).length,648);assert(!xml.includes('/saved'));assert(!xml.includes('/guide'));assert.equal((await req('/guide')).status,404);assert((await(await req('/robots.txt')).text()).includes('Allow: /'));assert((await(await req('/robots.txt','preview.test')).text()).includes('Disallow: /'));assert.equal((await req('/','preview.test')).headers.get('x-robots-tag'),'noindex, nofollow');assert.equal((await req('/not-real')).status,404);assert.equal((await req('/products?page=-1')).status,400);assert.equal((await req('/image?src=https://attacker.test/x')).status,400);assert.equal((await req('/api/gallery?id=bad')).status,400);
const nativeFetch=globalThis.fetch;
// Controlled source outage verifies the fallback is explicit and never invented live stock.
globalThis.fetch=async()=>{throw Error('Controlled upstream failure')};
r=await req('/category/pants?sort=price-low');let h=await r.text();assert.equal(r.status,503);assert(h.includes('Showing the saved source selection'));assert(h.includes('Nike x Nocta'));assert(!h.includes('undefined'));
r=await req('/api/rates');assert.equal((await r.json()).date,'2026-10-09');
// Real captured source markup verifies parser and category/sort query routing.
const fixture=fs.readFileSync('fixtures/source-catalog-test.html','utf8');let observed='';globalThis.fetch=async url=>{observed=String(url);return new Response(fixture,{headers:{'content-type':'text/html'}})};
r=await req('/category/pants?sort=price-low');h=await r.text();assert.equal(r.status,200);assert(new URL(observed).searchParams.get('tid')==='6');assert(new URL(observed).searchParams.get('sort_asc')==='asc');assert((h.match(/class="sheet-row"/g)||[]).length>10);assert(!h.includes('class="notice"'));
globalThis.fetch=nativeFetch;
console.log('Passed',count,'localized route checks, affiliate destinations, twelve products/ten FAQs, 648 sitemap URLs, live-source parsing/sorting, error fallbacks and image allowlist.');
