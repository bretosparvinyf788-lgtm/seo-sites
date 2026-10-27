import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../worker/index.js';

const origin='https://joyagooparcelguide.com';
const catalog='<a href="/?aid=123" class="product-card"><img src="/uploads/test.jpg"><h3 class="product-title">Stussy Shorts</h3><span class="price">$12.00</span></a>共 <strong>2</strong> 页 <strong>100</strong> 条';
const detail='<h1 class="product-title">Stussy Shorts</h1><img id="mainImage" src="/uploads/test.jpg"><span class="current-price price">$12.00</span><a href="https://joyagoo.com/product/?shop_type=weidian&amp;id=7754708483&amp;ref=300189539">Buy</a>';

test('each pagination page and language variant retains its own canonical and reciprocal alternates',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>new Response(catalog);
 try{
  const response=await app.fetch(new Request(origin+'/products?page=2&lang=fr&sort=price-low'));
  assert.equal(response.status,200);const html=await response.text();
  assert.ok(html.includes('rel="canonical" href="'+origin+'/products?page=2&amp;lang=fr"'));
  assert.ok(html.includes('hreflang="de" href="'+origin+'/products?page=2&amp;lang=de"'));
 }finally{globalThis.fetch=original;}
});

test('product snippet uses only the visible price and exact item purchase link; missing price is not an offer',async()=>{
 const original=globalThis.fetch;let body=detail;globalThis.fetch=async()=>new Response(body);
 const schemas=async()=>{const html=await(await app.fetch(new Request(origin+'/product/123'))).text();return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));};
 try{
  const product=(await schemas()).find(p=>p['@type']==='Product');
  assert.equal(product.offers.price,'12.00');assert.equal(product.offers.priceCurrency,'USD');
  assert.equal(new URL(product.offers.url).searchParams.get('id'),'7754708483');
  assert.equal(product.offers.availability,undefined);assert.equal(product.aggregateRating,undefined);
  body=detail.replace('$12.00','');assert.ok(!(await schemas()).some(p=>p['@type']==='Product'));
 }finally{globalThis.fetch=original;}
});
