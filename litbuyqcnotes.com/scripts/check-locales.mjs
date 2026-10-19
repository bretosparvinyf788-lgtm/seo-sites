import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../worker/index.js';
const ctx=vm.createContext({URL,URLSearchParams});
for(const file of ['data','content','notes','retention','sheet'])vm.runInContext(fs.readFileSync('src/'+file+'.js','utf8'),ctx);
const faqContent=JSON.parse(fs.readFileSync('src/faq.json','utf8'));
const additions=Object.fromEntries(['nl','sv','da','no','fi','cs','ru','uk','ro','hu','el','tr','ja','ko','ar','he'].map(l=>[l,JSON.parse(fs.readFileSync('src/locales/'+l+'.json','utf8'))]));
vm.runInContext('const EXTRA_LOCALES='+JSON.stringify(additions)+';'+fs.readFileSync('src/locale-extension.js','utf8'),ctx);
const locales=vm.runInContext('Object.keys(LOCALES)',ctx),names=vm.runInContext('LOCALES',ctx);assert.equal(locales.length,24);
for(const locale of locales){
 for(const group of ['UI','NOTES','RETENTION','SHEET']){const current=vm.runInContext(group+'["'+locale+'"]',ctx),english=vm.runInContext(group+'.en',ctx);assert.deepEqual(Object.keys(current).sort(),Object.keys(english).sort(),group+' missing key: '+locale);for(const [key,value]of Object.entries(current))if(typeof english[key]==='string')assert(typeof value==='string'&&value.trim(),locale+':'+group+'.'+key);}
 assert.equal(vm.runInContext('TERMS["'+locale+'"].length',ctx),23);
 const response=await worker.fetch(new Request('https://litbuyqcnotes.test/?lang='+locale));const html=await response.text();const menu=html.match(/<select id="language"[^>]*>(.*?)<\/select>/s)[1];assert.equal((menu.match(/<option/g)||[]).length,24);assert(menu.includes('value="'+locale+'" selected'));assert(menu.includes(names[locale]));assert.equal((html.match(/hreflang=/g)||[]).length,25);
 assert(html.includes('<html lang="'+(locale==='zh'?'zh-CN':locale)+'" dir="'+(['ar','he'].includes(locale)?'rtl':'ltr')+'">'));assert(html.includes('id="review-note" dir="auto"'));
 const data=JSON.parse(html.match(/id="site-data">(.*?)<\/script>/s)[1]);assert.equal(data.l,locale);assert(data.snapshot.every(p=>p.name&&p.name!==undefined));
 if(additions[locale]){const copy=additions[locale];assert.equal(data.t.qcNote,copy.ui[32]);assert.equal(data.retention.placeholder,copy.retention[12]);assert.equal(data.n.savedLocal,copy.notes[9]);for(const [question,answer]of faqContent[locale].items){assert(html.includes(question.replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('"','&quot;')));assert(answer.length>80);}assert(!html.includes('What is a Litbuy spreadsheet?'));assert.notEqual(data.t.language,'Language');}
}
// FAQ structured data must match the translated content shown to shoppers.
for(const locale of locales){const html=await(await worker.fetch(new Request('https://litbuyqcnotes.test/faq?lang='+locale))).text();const schemas=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]);const schema=schemas.find(x=>x['@type']==='FAQPage');assert.equal(schema.mainEntity.length,10);for(let i=0;i<10;i++){assert.equal(schema.mainEntity[i].name,faqContent[locale].items[i][0]);assert.equal(schema.mainEntity[i].acceptedAnswer.text,faqContent[locale].items[i][1]);}}
const nativeFetch=globalThis.fetch;globalThis.fetch=async()=>new Response(fs.readFileSync('fixtures/source-catalog-test.html','utf8'),{headers:{'content-type':'text/html'}});
for(const locale of locales){const response=await worker.fetch(new Request('https://litbuyqcnotes.test/category/pants?page=2&sort=price-low&lang='+locale));assert.equal(response.status,200);const html=await response.text();assert(!html.includes('undefined'));assert(html.includes('value="'+locale+'" selected'));const links=[...html.matchAll(/href="(\/category\/[^\"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),'https://litbuyqcnotes.test'));assert(links.every(u=>(u.searchParams.get('lang')||'en')===locale));}
globalThis.fetch=nativeFetch;
const client=await(await worker.fetch(new Request('https://litbuyqcnotes.test/client.js'))).text();const browserCtx=vm.createContext({});vm.runInContext(client.split('const d=JSON.parse')[0],browserCtx);for(const locale of locales)assert.equal(vm.runInContext('TERMS["'+locale+'"].length',browserCtx),23);
console.log('Passed 24-locale coverage: complete content dictionaries, 23 product terms, language menu/selection, translated FAQ bodies and local-storage messages, category pagination language retention and browser-side titles.');
