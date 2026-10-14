import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {parseSourceCatalog,parseSourceProduct,parseWeidianGallery,serveLivePage} from '../dist/server/source-catalog.js';
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
 const env={ASSETS:{async fetch(request){return new Response(await readFile(`dist/client${new URL(request.url).pathname}`,'utf8'));}}};
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
 const originalFetch=globalThis.fetch;globalThis.fetch=async url=>{url=new URL(url);if(url.hostname==='weidian.com')return new Response(`<script id="__rocker-render-inject__" data-obj="${JSON.stringify({result:{default_model:{item_info:{item_id:url.searchParams.get('itemID'),imgs:['https://si.geilicdn.com/seller-1.jpg','https://si.geilicdn.com/seller-2.jpg']}}}}).replace(/"/g,'&quot;')}"></script>`);return new Response(product);};
 const env={
  ASSETS:{async fetch(){return new Response(await readFile('dist/client/live-templates/zh/all.txt','utf8'));}},
  DB:{prepare(){return {bind(){return {async all(){return {results:[{product:'3294',saved_at:1,viewed_at:null}]};},async run(){return {};}};}};}}
 };
 try{
  const response=await worker.fetch(new Request('https://example.test/zh/products/3294/'),env);assert.equal(response.status,200);const {document}=parseHTML(await response.text());assert.equal(document.querySelector('[data-current-product]').dataset.currentProduct,'3294');assert(document.querySelector('.button.wide').href.includes('ref=T2JMMC'));assert(document.querySelector('link[rel=canonical]').href.endsWith('/zh/products/3294/'));assert(document.querySelector('.language a[lang=fr]').href.endsWith('/fr/products/3294/'));assert(document.querySelectorAll('.thumbnails button').length>1);
  const saved=await worker.fetch(new Request('https://example.test/api/finds',{method:'POST',headers:{Origin:'https://example.test','Content-Type':'application/json'},body:JSON.stringify({action:'save',id:'3294'})}),env);assert.equal(saved.status,200);assert.deepEqual((await saved.json()).saved,['3294']);
  const cards=await worker.fetch(new Request('https://example.test/api/products?lang=zh&ids=3294'),env);const data=await cards.json();assert.equal(data.cards.length,1);assert(data.cards[0].includes('/zh/products/3294/'));
 }finally{globalThis.fetch=originalFetch;}
});
test('Weidian gallery preserves the seller carousel order and verifies the item ID',async()=>{
 const html=await fixture('weidian-gallery'),gallery=parseWeidianGallery(html,'7756924526');assert.equal(gallery.images.length,9);assert(gallery.images.every(u=>new URL(u).hostname==='si.geilicdn.com'));assert(gallery.images[0].includes('295e0000019d281e47aa0a8115c2'));assert.throws(()=>parseWeidianGallery(html,'7756924527'),/mismatch/);
});
test('reported item 2654 has nine Weidian carousel pictures with main-site QC below; seller failure never substitutes QC',async()=>{
 const originalFetch=globalThis.fetch,main=await fixture('product-2654'),seller=await fixture('weidian-gallery');
 const env={ASSETS:{async fetch(){return new Response(await readFile('dist/client/live-templates/en/all.txt','utf8'));}}};
 try{
  globalThis.fetch=async url=>new Response(new URL(url).hostname==='weidian.com'?seller:main);
  let response=await serveLivePage(new Request('https://example.test/products/2654/'),env);assert.equal(response.status,200);let {document}=parseHTML(await response.text());
  assert.equal(document.querySelector('[data-gallery-source=weidian]').dataset.sellerItem,'7756924526');assert.equal(document.querySelectorAll('.thumbnails button').length,9);assert(new URL(document.getElementById('mainPhoto').src).hostname==='si.geilicdn.com');assert([...document.querySelectorAll('.thumbnails img')].every(im=>new URL(im.src).hostname==='si.geilicdn.com'));
  const qc=[...document.querySelectorAll('[data-gallery-source=main-qc-reference] img')];assert(qc.length>=3);assert(qc.every(im=>new URL(im.src).hostname.endsWith('kakobuymake.com')));assert.equal(document.querySelector('.qc-panel h2').textContent,'QC & reference photos');
  globalThis.fetch=async url=>new URL(url).hostname==='weidian.com'?new Response('Unavailable',{status:503}):new Response(main);
  response=await serveLivePage(new Request('https://example.test/products/2654/'),env);({document}=parseHTML(await response.text()));assert.equal(response.status,200);assert.equal(document.getElementById('mainPhoto'),null);assert(document.querySelector('.gallery-unavailable'));assert(document.querySelectorAll('[data-gallery-source=main-qc-reference] img').length>=3);
 }finally{globalThis.fetch=originalFetch;}
});
