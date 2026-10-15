import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../worker/index.js';
const snapshot=JSON.parse(fs.readFileSync('fixtures/snapshot.json','utf8'));
const expected=[['2929','2932','2931'],['2933','2934','2935'],['2944','2936','2931']];
for(const lang of ['en','zh','de','fr','es','it','pt','pl','da','no','sv','ko','en-GB','en-AU','en-NZ','en-CA','de-CH','pt-BR','es-MX']){
 const res=await worker.fetch(new Request('https://litbuysheetbook.com/?lang='+lang));
 assert.equal(res.status,200);
 const html=await res.text(),main=html.slice(html.indexOf('<main>'),html.indexOf('</main>'));
 assert.equal((main.match(/<h1\b/g)||[]).length,1);
 assert.ok(!/spotlight|story-card|collection-spread/.test(main));
 assert.equal((main.match(/class="product"/g)||[]).length,10);
 assert.equal((main.match(/<details open>/g)||[]).length,16);
 for(const id of ['shortlist-total','recent-products','clear-recent'])assert.ok(main.includes('id="'+id+'"'));
 assert.ok(main.indexOf('id="directory"')<main.indexOf('id="finds"'));
 assert.ok(main.indexOf('id="finds"')<main.indexOf('id="saved-desk"'));
 const nav=main.match(/<nav class="home-category-nav"[\s\S]*?<\/nav>/)[0];
 assert.equal((nav.match(/href="/g)||[]).length,10);
 assert.ok(!/index-hero|selection-notes|compare-section|id="journey"|\/guides\/|type="search"/.test(main));
 assert.ok(!main.includes('undefined'));
 for(const id of ['directory','finds','photo-room','saved-desk','faq'])assert.ok(main.includes('id="'+id+'"'));

 const qcSection=main.match(/<section class="photo-room"[\s\S]*?<\/section>/)[0];
 assert.equal((qcSection.match(/data-gallery="qc"/g)||[]).length,2);
 const qcLink=qcSection.match(/href="(\/product\/[^"]+)"/)[1].replaceAll('&amp;','&');
 const detail=await worker.fetch(new Request(new URL(qcLink,'https://litbuysheetbook.com')));
 assert.equal(detail.status,200);assert.ok((await detail.text()).includes('id="qc-photos"'));
 for(const match of main.matchAll(/href="#([^"]+)"/g))assert.ok(main.includes('id="'+match[1]+'"'));
 if(lang==='zh')assert.ok(main.includes('商品金额合计'));
 if(lang==='fr')assert.ok(main.includes('Au-delà de la photo principale'));
 if(lang!=='en'&&!lang.startsWith('en-'))assert.ok(!main.includes('Save all 3 pieces'));
}
for(const id of new Set(expected.flat())){const r=await worker.fetch(new Request('https://litbuysheetbook.com/cover/'+id));assert.equal(r.status,200);assert.ok(r.headers.get('content-type').startsWith('image/'));}
console.log('PASS compact desk: 19 locales, ten categories/products, sixteen FAQ answers, totals and recent history UI.');

for(const n of [0,1]){const res=await worker.fetch(new Request('https://litbuysheetbook.com/reference/stussy-'+n+'.jpg'));assert.equal(res.status,200);assert.equal(res.headers.get('content-type'),'image/jpeg');const bytes=Buffer.from(await res.arrayBuffer());assert.ok(bytes.equals(fs.readFileSync('fixtures/qc-studio-'+n+'.jpg')));assert.equal(bytes.readUInt16BE(0),0xffd8);}
console.log('PASS expanded home: section navigation, localized content, source QC assets, product QC anchor and saved shelf markup.');
