import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../dist/_worker.js';

const origin='https://hipobuyqcnotes.com';
const catalog='<a href="/?tid=6" class="filter-option">Pants</a><a href="/?aid=123" class="product-card"><img src="/uploads/test.jpg"><h3 class="product-title">Stussy Shorts</h3><span class="price">$12.00</span></a>共 <strong>2</strong> 页 <strong>100</strong> 条';
const detail='<h1 class="product-title">Stussy Shorts</h1><img id="mainImage" src="/uploads/test.jpg"><span class="current-price price">$12.00</span><a href="https://hipobuy.com/product/weidian/7754708483?inviteCode=7INJEO667">Buy</a>';

test('catalog HTML exposes translated links, distinct titles, page navigation and the exact purchase destination',async()=>{
 const original=globalThis.fetch;let upstream;
 globalThis.fetch=async value=>{upstream=new URL(value);return new Response(upstream.searchParams.has('aid')?detail:catalog)};
 try{
  const response=await app.fetch(new Request(origin+'/category/6?page=2&lang=fr&sort=price_asc'));
  const fullHtml=await response.text();const html=fullHtml.match(/<div id="app">([\s\S]*?)<script/)[1];
  assert.equal(response.status,200);
  assert.match(html,/<h1>Pantalons — Page 2<\/h1>/);
  assert.match(html,/href="\/product\/123\?lang=fr"/);
  assert.match(html,/Short/);
  assert.equal(upstream.searchParams.get('sort'),'price');
  assert.equal(upstream.searchParams.get('sort_asc'),'asc');
  assert.equal(upstream.searchParams.get('page'),'2');
  const product=await app.fetch(new Request(origin+'/product/123'));
  const full=await product.text();const content=full.match(/<div id="app">([\s\S]*?)<script/)[1];
  assert.match(content,/<h1>Stussy Shorts<\/h1>/);
  assert.match(content,/https:\/\/hipobuy.com\/product\/weidian\/7754708483\?inviteCode=7INJEO667/);
  assert.equal((await app.fetch(new Request(origin+'/category/6?page=3'))).status,404);
  assert.equal((await app.fetch(new Request(origin+'/category/999'))).status,404);
 }finally{globalThis.fetch=original;}
});

test('upstream outages return a retryable 503 rather than indexable empty catalog content',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>{throw Error('offline')};
 try{const response=await app.fetch(new Request(origin+'/products'));assert.equal(response.status,503);assert.match(response.headers.get('x-robots-tag'),/noindex/);assert.equal(response.headers.get('retry-after'),'60');}finally{globalThis.fetch=original;}
});
