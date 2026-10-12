import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseHTML} from 'linkedom';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync('public/fx.js','utf8');
async function page(lang,store=new Map(),rates=true){
 const {document}=parseHTML(readFileSync(`dist/client/${lang==='en'?'':lang+'/'}index.html`,'utf8'));
 const date=new Date().toISOString().slice(0,10);
 vm.runInNewContext(code,{document,localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},Intl,Date,AbortController,setTimeout,clearTimeout,fetch:async url=>({ok:rates,json:async()=>url.startsWith('/')?{rates:{USD:1},dates:{}}:['EUR','JPY','KRW','SAR'].map(quote=>({base:'USD',quote,rate:quote==='JPY'?150:2,date}))})});
 await new Promise(r=>setTimeout(r,10));return document;
}
test('language default, manual persistence and language change',async()=>{
 const store=new Map();let doc=await page('ja',store);assert.equal(doc.getElementById('currencyLabel').textContent,'JPY');
 doc.querySelector('[data-currency="EUR"]').click();assert.equal(doc.getElementById('currencyLabel').textContent,'EUR');
 doc=await page('ja',store);assert.equal(doc.getElementById('currencyLabel').textContent,'EUR');
 doc=await page('ko',store);assert.equal(doc.getElementById('currencyLabel').textContent,'KRW');
});
test('missing rates safely show USD without losing desired currency',async()=>{const store=new Map();const doc=await page('ja',store,false);assert.equal(doc.getElementById('currencyLabel').textContent,'USD');assert.equal(store.get('findsbook-currency'),'JPY');});
test('Arabic direction and all locale choices',async()=>{const doc=await page('ar');assert.equal(doc.documentElement.dir,'rtl');assert.equal(doc.querySelectorAll('.language a').length,24);assert.equal(doc.getElementById('currencyLabel').textContent,'SAR');});
