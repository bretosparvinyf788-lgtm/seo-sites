import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {parseSourceCatalog,parseSourceProduct,serveLivePage} from '../dist/server/source-catalog.js';
import worker from '../dist/server/index.js';
const fixture=async name=>readFile(new URL(`./fixtures/${name}.html`,import.meta.url),'utf8');
const first=await fixture('pants-first'),last=await fixture('pants-last'),low=await fixture('pants-low'),product=await fixture('product');
test('source catalog retains every returned item and real pagination totals',()=>{
 const a=parseSourceCatalog(first,'pants'),b=parseSourceCatalog(last,'pants');
 assert.equal(a.totalItems,432);assert.equal(a.totalPages,9);assert.equal(a.products.length,50);assert.equal(b.products.length,32);
 assert.equal(a.products[0].id,'3294');assert.equal(b.products[0].id,'264');assert.equal(new Set([...a.products,...b.products].map(p=>p.id)).size,82);
 assert(a.products.every(p=>p.category==='pants'&&p.image.startsWith('https://www.kakobuymake.com/uploads/')));
 assert.throws(()=>parseSourceCatalog('<h1>Challenge page</h1>','pants'));
});
test('source detail uses its actual category, gallery and correct referral',()=>{
 const p=parseSourceProduct(product,'3294');assert.equal(p.category,'pants');assert(p.images.length>1);assert(p.buy.includes('ref=T2JMMC'));assert(!p.buy.includes('ZG4JNV'));assert(p.item_id);assert.equal(p.qc_images.length,0,'unidentified gallery images must not be relabeled QC');
});
test('live route serves page 9, preserves language/page/sort and resets sort through navigation',async()=>{
 const originalFetch=globalThis.fetch,calls=[];
 globalThis.fetch=async url=>{url=new URL(url);calls.push(url);return new Response(url.searchParams.get('page')==='9'?last:url.searchParams.get('sort_asc')==='asc'?low:first);};
 const env={ASSETS:{async fetch(request){return new Response(await readFile(`dist/client${new URL(request.url).pathname}index.html`,'utf8'));}}};
 try{
  let response=await serveLivePage(new Request('https://example.test/zh/categories/pants/?page=9&sort=0'),env);
  assert.equal(response.status,200);let {document}=parseHTML(await response.text());assert.equal(document.querySelectorAll('.listing .product').length,32);assert.equal(document.querySelector('[data-live-total]').dataset.liveTotal,'432');
  assert.equal(document.querySelector('.live-pagination [aria-current]').textContent,'9');assert(document.querySelector('.live-pagination [rel=prev]').getAttribute('href').includes('page=8'));
  assert(document.querySelector('link[rel=canonical]').href.endsWith('/zh/categories/pants/?page=9&sort=0'));assert(document.querySelector('.language a[lang=fr]').href.includes('/fr/categories/pants/?page=9&sort=0'));
  assert.equal(calls.at(-1).searchParams.get('tid'),'6');assert.equal(calls.at(-1).searchParams.get('page'),'9');
  response=await serveLivePage(new Request('https://example.test/categories/pants/?sort=1'),env);({document}=parseHTML(await response.text()));const prices=[...document.querySelectorAll('.listing [data-price]')].map(x=>Number(x.dataset.price));assert.deepEqual(prices,[...prices].sort((a,b)=>a-b));assert.equal(document.querySelector('#sort option[selected]').value,'1');
  response=await serveLivePage(new Request('https://example.test/categories/pants/?page=10'),env);assert.equal(response.status,404);
  globalThis.fetch=async()=>new Response('upstream error',{status:503});response=await serveLivePage(new Request('https://example.test/categories/pants/'),env);assert.equal(response.status,503);assert(!(await response.text()).includes('data-id="2662"'),'no curated subset should masquerade as full category on failure');
 }finally{globalThis.fetch=originalFetch;}
});
test('previously unlisted product has a separate live detail and can be saved',async()=>{
 const originalFetch=globalThis.fetch;globalThis.fetch=async()=>new Response(product);
 const env={
  ASSETS:{async fetch(){return new Response(await readFile('dist/client/zh/spreadsheet/index.html','utf8'));}},
  DB:{prepare(){return {bind(){return {async all(){return {results:[{product:'3294',saved_at:1,viewed_at:null}]};},async run(){return {};}};}};}}
 };
 try{
  const response=await worker.fetch(new Request('https://example.test/zh/products/3294/'),env);assert.equal(response.status,200);const {document}=parseHTML(await response.text());assert.equal(document.querySelector('[data-current-product]').dataset.currentProduct,'3294');assert(document.querySelector('.button.wide').href.includes('ref=T2JMMC'));assert(document.querySelector('link[rel=canonical]').href.endsWith('/zh/products/3294/'));assert(document.querySelector('.language a[lang=fr]').href.endsWith('/fr/products/3294/'));assert(document.querySelectorAll('.thumbnails button').length>1);
  const saved=await worker.fetch(new Request('https://example.test/api/finds',{method:'POST',headers:{Origin:'https://example.test','Content-Type':'application/json'},body:JSON.stringify({action:'save',id:'3294'})}),env);assert.equal(saved.status,200);assert.deepEqual((await saved.json()).saved,['3294']);
  const cards=await worker.fetch(new Request('https://example.test/api/products?lang=zh&ids=3294'),env);const data=await cards.json();assert.equal(data.cards.length,1);assert(data.cards[0].includes('/zh/products/3294/'));
 }finally{globalThis.fetch=originalFetch;}
});
