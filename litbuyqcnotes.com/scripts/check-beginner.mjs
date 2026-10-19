import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../worker/index.js';
const copy=JSON.parse(fs.readFileSync('src/beginner.json','utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const origin='https://litbuyqcnotes.test';
assert.equal(Object.keys(copy).length,24);
let images=new Set();
for(const [l,g] of Object.entries(copy)){
 assert.equal(g.steps.length,8);assert.equal(g.phases.length,3);
 for(const step of g.steps){assert.equal(step.length,3);assert(step.every(s=>s.trim().length>5));}
 const response=await worker.fetch(new Request(origin+'/beginner-guide?lang='+l));assert.equal(response.status,200);const html=await response.text();assert(!html.includes('undefined'));assert.equal((html.match(/data-guide-step/g)||[]).length,8);assert.equal((html.match(/<section class="walkthrough-step"[^>]*>/g)||[]).length,8);assert(!html.includes('<details'));assert(!html.includes('<summary'));assert(!html.includes('walkthrough-toggle'));for(let i=1;i<=8;i++){assert(html.includes('id="guide-step-'+i+'"'));assert(html.includes('href="#guide-step-'+i+'"'));assert(html.includes('aria-labelledby="guide-heading-'+i+'"'));assert(html.includes('<h2 id="guide-heading-'+i+'">'));}
 assert(html.includes('<h1>'+esc(g.title)+'</h1>'));assert(html.includes('dir="'+(['ar','he'].includes(l)?'rtl':'ltr')+'"'));for(const step of g.steps)for(const text of step)assert(html.includes(esc(text)),l+': incomplete guide body');
 const canonical=new URL(html.match(/rel="canonical" href="([^"]+)/)[1]);assert.equal(canonical.pathname,'/beginner-guide');assert.equal(canonical.searchParams.get('lang')||'en',l);assert.equal((html.match(/hreflang=/g)||[]).length,25);
 const schema=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]).find(x=>x['@type']==='HowTo');assert(schema);assert.equal(schema.inLanguage,l);assert.equal(schema.step.length,8);
 for(let i=0;i<8;i++){const step=schema.step[i];assert.equal(step.name,g.steps[i][0]);assert.equal(step.text,g.steps[i][1]+' '+g.steps[i][2]);const u=new URL(step.url);assert.equal(u.searchParams.get('lang')||'en',l);assert.equal(u.hash,'#guide-step-'+(i+1));assert(step.image.length>0);step.image.forEach(src=>images.add(new URL(src).pathname));}
 const pictureLinks=[...html.matchAll(/href="(\/guide-images\/[^\"]+)"/g)].map(m=>m[1]);assert.equal(new Set(pictureLinks).size,11);assert.equal((html.match(/<img src="\/guide-images\//g)||[]).length,11);assert.equal((html.match(/width="\d+" height="\d+" alt=/g)||[]).length,11);
 const home=await(await worker.fetch(new Request(origin+'/?lang='+l))).text();assert(home.indexOf('id="beginner-guide"')<home.indexOf('id="faq"'));assert(home.includes(esc(g.open)));assert(!home.includes('src="/guide-images/'));const entry=home.match(/<section class="beginner-entry".*?<\/section>/s)[0];for(const m of entry.matchAll(/href="([^"]+)"/g)){const u=new URL(m[1].replaceAll('&amp;','&'),origin);assert.equal(u.pathname,'/beginner-guide');assert.equal(u.searchParams.get('lang')||'en',l);}
}
for(const path of images){const response=await worker.fetch(new Request(origin+path));assert.equal(response.status,200);assert(response.headers.get('content-type').startsWith('image/'));assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync('fixtures/guide-shots/'+path.split('/').at(-1)));const head=await worker.fetch(new Request(origin+path,{method:'HEAD'}));assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);}
assert.equal(images.size,11);const head=await worker.fetch(new Request(origin+'/beginner-guide?lang=ar',{method:'HEAD'}));assert.equal(head.status,200);assert.equal(await head.text(),'');
const xml=await(await worker.fetch(new Request(origin+'/sitemap.xml'))).text();assert.equal((xml.match(/\/beginner-guide/g)||[]).length,24);
console.log('Passed beginner guide: 24 complete translations, eight permanently visible steps without collapse controls, native step links, matching HowTo data, homepage entries and 11 original image responses/HEAD requests. Browser visual QA not covered.');
