import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import app from '../worker/index.js';
const data=async f=>JSON.parse(await readFile(new URL('./'+f,import.meta.url),'utf8'));
const catalogue=await data('catalog-full.json'),locales=await data('content.json'),features=await data('featured.json'),qc=await data('main-qc.json');
const get=path=>app.fetch(new Request('https://sugargoosheetdesk.com'+path),{},{});
const text=async path=>{const r=await get(path);assert.equal(r.status,200,path);return r.text()};
assert.equal(Object.keys(catalogue).length,10);assert.equal(Object.keys(locales).length,24);assert.equal(features.featured.length,12);
const count=Object.values(catalogue).reduce((n,v)=>n+v.items.length,0);assert.equal(count,4467);
for(const cat of Object.values(catalogue))for(const p of cat.items){assert.ok(qc.items[p.aid],'QC mapping for '+p.aid)}
for(const[lang,t]of Object.entries(locales)){assert.equal(t.steps.length,8);assert.equal(t.questions.length,12);assert.equal(t.categories.length,10);const s=await text('/?lang='+lang);assert.ok(s.includes('lang="'+lang+'"'));assert.ok(s.includes(t.register));assert.ok(!s.includes('Kakobuy'));assert.equal((s.match(/<article class="product">/g)||[]).length,12)}
const homepage=await text('/'),second=await text('/?selection=1');assert.notEqual(homepage.match(/href="\/product\/(\d+)"/)[1],second.match(/href="\/product\/(\d+)"/)[1]);
const s=await text('/product/7899577122');const href=s.match(/href="(https:\/\/www\.sugargoo\.com\/products[^\"]+)"/)[1].replaceAll('&amp;','&');const buy=new URL(href);assert.equal(buy.searchParams.get('memberId'),'2064761237850680307');assert.equal(buy.searchParams.get('productLink'),'https://weidian.com/item.html?itemID=7899577122');assert.ok(s.includes('memberId=3914891758646228603'));
const gallery=JSON.parse(s.match(/id="gallery-data">([^<]+)/)[1]);assert.equal(gallery.length,1);assert.ok(s.indexOf('class="qc-section"')>s.indexOf('class="detail-layout"'));assert.ok(!gallery.some(u=>u.includes('kakobuymake.com')));
assert.equal((s.match(/<a href="\/image\?url=/g)||[]).length,2);
assert.equal((await get('/product/9999999999999')).status,404);assert.equal((await get('/category/nonexistent')).status,404);
for(const cat of ['shoes','t-shirts','clothing','hoodies','pants','belts','bags','perfume','electronics','other'])assert.ok((await text('/category/'+cat)).includes('id="sort"'));
const sorted=await text('/finds?sort=low'),prices=[...sorted.matchAll(/data-usd="([\d.]+)"/g)].map(m=>+m[1]);assert.ok(prices.every((v,i)=>i===0||v>=prices[i-1]));assert.ok((await text('/finds?q=7899577122')).includes('/product/4478'));
const g=await text('/guide');assert.equal((g.match(/<section class="step"/g)||[]).length,8);assert.equal((g.match(/src="\/guide-image\//g)||[]).length,8);assert.ok(g.includes('/guide-image/9'));
const asset=await get('/asset/sugargoo-sample-7899577122');assert.equal(asset.status,200);assert.equal(asset.headers.get('content-type'),'image/jpeg');assert.ok((await asset.arrayBuffer()).byteLength>10000);
assert.equal((await get('/image?url=https://example.com/x.jpg')).status,403);assert.equal((await get('/image?url=https://kakobuymake.com.evil.example/x.jpg')).status,403);assert.equal((await get('/image?url=http://kakobuymake.com/x.jpg')).status,403);
const sitemap=await text('/sitemap.xml');assert.ok(sitemap.includes('https://sugargoosheetdesk.com/product/7899577122'));assert.ok(!sitemap.includes('test.invalid'));assert.ok((await text('/robots.txt')).includes('https://sugargoosheetdesk.com/sitemap.xml'));
const oldFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('offline')};const rates=await (await get('/api/rates')).json();assert.ok(rates.rates.EUR&&rates.rates.CNY&&rates.rates.USD===1);assert.ok(rates.updated);globalThis.fetch=oldFetch;
console.log(JSON.stringify({passed:true,categories:10,languages:24,homeProducts:12,catalogueRecords:count,referrals:'exact',sellerQcSeparation:'passed',guideSteps:8,currencyFallback:'dated snapshot'}));
