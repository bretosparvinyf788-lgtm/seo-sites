import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {parseHTML} from 'linkedom';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
const sqlite=new DatabaseSync(':memory:');sqlite.exec(await readFile('drizzle/0000_amazing_machine_man.sql','utf8'));
const db={prepare(sql){return {bind(...values){return {async all(){return {results:sqlite.prepare(sql).all(...values)}},async run(){return sqlite.prepare(sql).run(...values)}}}}},async batch(queries){sqlite.exec('BEGIN');try{const out=[];for(const q of queries)out.push(await q.run());sqlite.exec('COMMIT');return out}catch(e){sqlite.exec('ROLLBACK');throw e}}};
const env={DB:db,ASSETS:{fetch:()=>new Response('asset')}};
function client(){let cookie='';return async(path,options={})=>{const headers=new Headers(options.headers);headers.set('Origin','https://example.test');if(cookie)headers.set('Cookie',cookie);const response=await worker.fetch(new Request('https://example.test'+path,{...options,headers}),env);if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return response}}
const fetch=client(),post=body=>fetch('/api/finds',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const catalog=JSON.parse(await readFile('catalog.json','utf8')),id=catalog[0].id;
assert.equal((await worker.fetch(new Request('https://example.test/api/finds',{method:'POST',headers:{Origin:'https://evil.test'}}),env)).status,403);
assert.equal((await post({action:'save',id:'not-a-product'})).status,400);
const source=await readFile('public/explorer.js','utf8');
async function dom(path,hash='',currentId){
 let html=await readFile(path,'utf8');if(currentId)html=html.replace('<main id="main">',`<main id="main" data-current-product="${currentId}">`);
 const {window,document}=parseHTML(html);let pending=[];
 // Linkedom's select.value is getter-only; model the browser select state for these interactions.
 document.querySelectorAll('select').forEach(s=>{let value=s.querySelector('option')?.value||'';Object.defineProperty(s,'value',{get:()=>value,set:v=>{value=v},configurable:true})});
 const location={hash};const history={replaceState(a,b,h){location.hash=h}};
 const context=vm.createContext({document,location,history,fetch:(...args)=>{const promise=fetch(...args);pending.push(promise);return promise},AbortController,setTimeout,clearTimeout,addEventListener:window.addEventListener.bind(window),console});
 vm.runInContext(source,context);await settle();
 async function settle(){for(let n=0;n<8;n++){await Promise.all(pending);pending=[];await new Promise(r=>setTimeout(r,1))}}
 async function click(sel){const b=document.querySelector(sel);assert(b,sel);b.dispatchEvent(new window.Event('click'));await settle()}
 async function change(sel,value){const x=document.querySelector(sel);if(x.tagName==='INPUT')x.checked=value;else x.value=value;x.dispatchEvent(new window.Event('change'));await settle()}
 const visible=()=>[...document.querySelectorAll('#exploreGrid>.product')].filter(x=>!x.hidden);
 return {document,click,change,visible};
}
let page=await dom('dist/client/index.html');assert.equal(page.visible().length,10);
await page.click('#loadMore');assert.equal(page.visible().length,20);
await page.click('#resetFilters');assert.equal(page.visible().length,10);
await page.click(`[data-save="${id}"]`);assert.equal(page.document.querySelector(`[data-save="${id}"]`).getAttribute('aria-pressed'),'true');
page=await dom('dist/client/index.html','#saved');assert.equal(page.visible().length,1);assert.equal(page.visible()[0].dataset.id,id);
assert.deepEqual((await (await client()('/api/finds')).json()).saved,[],'visitors must be isolated');
await dom('dist/client/index.html','',id);
page=await dom('dist/client/zh/index.html','#recent');assert.equal(page.visible()[0].dataset.id,id);
await page.click('#clearRecent');assert.equal(page.visible().length,0);
await page.click('[data-view="saved"]');assert.equal(page.visible().length,1,'clearing history keeps favorites');
await page.click(`[data-save="${id}"]`);assert.equal(page.visible().length,0);
assert.equal(page.document.getElementById('listState').hidden,false);
console.log('PASS: filters, pagination, saved-state reload, recent views, history clearing, language change, visitor isolation and CSRF checks.');
