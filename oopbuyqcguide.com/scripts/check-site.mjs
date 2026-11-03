import ts from 'typescript';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='/tmp/oopbuy-site-check';mkdirSync(dir,{recursive:true});
for(const name of ['i18n','catalog','site']){let s=readFileSync('lib/'+name+'.ts','utf8').replace("import seed from './seed.json';",'const seed='+readFileSync('lib/seed.json','utf8')+';').replace("import imageRepairs from './image-repairs.json';",'const imageRepairs='+readFileSync('lib/image-repairs.json','utf8')+';').replace("import faqCopy from './faq-copy.json';",'const faqCopy='+readFileSync('lib/faq-copy.json','utf8')+';').replace(/from '\.\/(i18n|catalog)'/g,"from './$1.mjs'");writeFileSync(dir+'/'+name+'.mjs',ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText)}
const {copy}=await import(dir+'/i18n.mjs');const {handle}=await import(dir+'/site.mjs');const {parseDetail,buyLink,REGISTER,homeProducts}=await import(dir+'/catalog.mjs');
assert.equal(Object.keys(copy).length,24);assert.equal(new Set(homeProducts.map(p=>p.image)).size,12);assert.equal(REGISTER,'https://oopbuy.com/register?inviteCode=VH4XVEESR');assert.equal(buyLink('7878252297'),'https://oopbuy.com/product/weidian/7878252297?inviteCode=M8WW8HUO2');
for(const [lang,t] of Object.entries(copy)){assert.equal(t.ui.length,67,lang+' UI');assert.equal(t.cats.length,10,lang+' categories');assert.equal(t.steps.length,8,lang+' guide');assert.equal(t.faq.length,12,lang+' FAQ');const r=await handle(new Request('https://oopbuyqcguide.com/?lang='+lang));const html=await r.text();assert.equal(r.status,200);assert.equal((html.match(/<h1>/g)||[]).length,1);assert(html.includes(t.hero[1].replace(/&/g,'&amp;')));assert(html.includes('inviteCode=VH4XVEESR'));assert.equal((html.match(/class="product-photo"/g)||[]).length,12);assert(html.includes('id="faq"'));const ld=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);const faqSchema=ld.find(x=>x['@type']==='FAQPage');assert.equal(faqSchema.mainEntity.length,12);for(const entity of faqSchema.mainEntity){const escaped=entity.name.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));assert(html.includes('<h4>'+escaped+'</h4>'),lang+' FAQ structured data must match visible questions')}}
const p=parseDetail(readFileSync('scripts/fixtures/product-3371.html','utf8'),'3371');assert.equal(p.weidianId,'7876473192');assert(p.qcPhotos.length>0);assert(!p.images.some(x=>p.qcPhotos.includes(x)));
for(const route of ['/guide','/categories','/sitemap.xml','/sitemaps/pages.xml','/robots.txt']){const r=await handle(new Request('https://oopbuyqcguide.com'+route));assert.equal(r.status,200,route)}
assert.equal((await handle(new Request('https://oopbuyqcguide.com/missing'))).status,404);assert.equal((await handle(new Request('https://oopbuyqcguide.com/category/999'))).status,404);assert.equal((await handle(new Request('https://oopbuyqcguide.com/api/gallery?id=bad'))).status,400);
console.log('Passed: 24 locales, source parsing, 12 unique products, affiliate links, core routes, sitemap, error handling.');

const previousFetch=globalThis.fetch;
try{
 globalThis.fetch=async()=>new Response(readFileSync('scripts/fixtures/product-3228.html','utf8'),{headers:{'content-type':'text/html'}});
 const response=await handle(new Request('https://oopbuyqcguide.com/product/3228'));
 const repairedHtml=await response.text();
 assert.equal(response.status,200);
 assert.equal((repairedHtml.match(/src="\/qc-repairs\/3228\//g)||[]).length,4);
 assert(!repairedHtml.includes('1-261009155U6235.jpg'));
 assert(repairedHtml.includes('https://oopbuy.com/product/weidian/7869096829?inviteCode=M8WW8HUO2'));
 console.log('Passed: reported product renders all four recovered QC images and retains its matching purchase link.');
}finally{globalThis.fetch=previousFetch}
