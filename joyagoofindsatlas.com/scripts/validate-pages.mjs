import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=(await import('data:text/javascript;base64,'+fs.readFileSync('dist/_worker.js').toString('base64'))).default;
const call=(path,origin='https://joyagoofindsatlas.com')=>app.fetch(new Request(origin+path),{},{});
const robots=await (await call('/robots.txt')).text();assert.ok(robots.includes('Allow: /'));assert.ok(robots.includes('Sitemap: https://joyagoofindsatlas.com/sitemap.xml'));
const sitemap=await (await call('/sitemap.xml')).text();assert.equal((sitemap.match(/<url>/g)||[]).length,384);assert.ok(!sitemap.includes('chatgpt.site'));
for(const lang of 'en zh de fr es it pt pl nl sv da no fi cs ro hu ru uk tr el ja ko ar he'.split(' ')){
 const html=await (await call('/faq?lang='+lang)).text();assert.ok(html.includes('content="index,follow"'));assert.ok(html.includes('G-CQGHN6TB40'));assert.equal((html.match(/class="faq-number"/g)||[]).length,10);assert.ok(!html.includes('class="brand-type"'));
}
const preview=await (await call('/faq','https://joyagoofindsatlas-com.pages.dev')).text();assert.ok(preview.includes('content="noindex,nofollow"'));assert.ok(!preview.includes('gtag/js'));
assert.equal((await call('/faq?lang=zh','https://www.joyagoofindsatlas.com')).headers.get('location'),'https://joyagoofindsatlas.com/faq?lang=zh');
for(const name of ['register','catalog','detail','options','payment','warehouse','shipping','parcels']){
 const r=await call('/guide/screens/'+name+'.jpg');if(r.status===200)assert.ok((await r.arrayBuffer()).byteLength>1000);
}
console.log('Pages build valid: 24 languages, 384 sitemap URLs, public indexing, preview exclusion, GA tag, www redirect and official logos.');
