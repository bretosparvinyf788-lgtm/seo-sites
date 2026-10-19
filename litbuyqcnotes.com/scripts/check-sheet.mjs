import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../worker/index.js';
const client='let sheetFilter'+fs.readFileSync('src/client.js','utf8').split('let sheetFilter')[1];
for(const lang of ['en','zh','de','fr','es','it','pt','pl','nl','sv','da','no','fi','cs','ru','uk','ro','hu','el','tr','ja','ko','ar','he']){
 const html=await(await worker.fetch(new Request('https://litbuyqcnotes.test/?lang='+lang))).text();
 const d=JSON.parse(html.match(/id="site-data">(.*?)<\/script>/s)[1]);
 assert.equal((html.match(/class="sheet-row"/g)||[]).length,12);assert(!html.includes('<table'));assert(!html.includes('sheet-scroll'));assert(!html.includes('shopping-hero-products'));assert(html.includes('beginner-open-v21'));const categoryNav=html.match(/<nav class="shopping-category-buttons"[^>]*>(.*?)<\/nav>/s)[1];const categoryLinks=[...categoryNav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);assert.equal(categoryLinks.length,11);assert.equal(new URL(categoryLinks[0],'https://litbuyqcnotes.test').pathname,'/products');assert.deepEqual(categoryLinks.slice(1).map(h=>new URL(h,'https://litbuyqcnotes.test').pathname),d.slugs.map(slug=>'/category/'+slug));assert(categoryLinks.every(h=>(new URL(h,'https://litbuyqcnotes.test').searchParams.get('lang')||'en')===lang));assert(!html.includes('data-category-pick'));
 const nodes=new Map(),handler=new Map();let ordered=[];const rows=d.snapshot.map((p,i)=>({dataset:{product:JSON.stringify(p),category:p.category,id:p.id,order:i},hidden:false,number:{textContent:''},querySelector(){return this.number}}));
 const make=id=>{const attrs={};const node={value:'',textContent:'',hidden:false,addEventListener(type,fn){handler.set(id+':'+type,fn)},setAttribute(k,v){attrs[k]=v},removeAttribute(k){delete attrs[k]},attrs};nodes.set(id,node);return node};
 const table=make('#home-products');table.querySelectorAll=()=>rows;table.append=row=>{ordered=ordered.filter(r=>r!==row);ordered.push(row)};
 make('#home-sort').value='newest';make('#sheet-category').value='0';make('#sheet-row-count');make('#sheet-empty');
 const tabs=['all','saved'].map(value=>{const b=make('tab-'+value);b.dataset={sheetFilter:value};return b});
 const picks=d.categories.map((_,i)=>{const b=make('category-'+(i+2));b.dataset={categoryPick:String(i+2)};return b});const context=vm.createContext({d,saved:{},q:s=>nodes.get(s),qa:s=>s==='[data-category-pick]'?picks:tabs});vm.runInContext(client,context);
 assert.equal(nodes.get('#sheet-row-count').textContent,12);
 nodes.get('#home-sort').value='price-low';handler.get('#home-sort:change')();assert.deepEqual(ordered.map(r=>JSON.parse(r.dataset.product).price),d.snapshot.map(p=>p.price).sort((a,b)=>a-b));
 nodes.get('#home-sort').value='price-high';handler.get('#home-sort:change')();assert.equal(JSON.parse(ordered[0].dataset.product).price,Math.max(...d.snapshot.map(p=>p.price)));
 handler.get('tab-saved:click')();assert.equal(nodes.get('#sheet-row-count').textContent,0);assert.equal(nodes.get('#sheet-empty').hidden,false);
 context.saved[d.snapshot[0].id]=d.snapshot[0];vm.runInContext('refreshSheet()',context);assert.equal(nodes.get('#sheet-row-count').textContent,1);assert.equal(rows.find(r=>!r.hidden).number.textContent,'01');
 delete context.saved[d.snapshot[0].id];vm.runInContext('refreshSheet()',context);assert.equal(nodes.get('#sheet-row-count').textContent,0);

 const saved=await(await worker.fetch(new Request('https://litbuyqcnotes.test/saved?lang='+lang))).text();assert(saved.includes('id="saved-table"'));assert(saved.includes('id="saved-grid"'));
}
console.log('Passed worksheet checks in 24 languages: shopping markup, ascending/descending prices, all category destinations/languages, saved filters, empty states, row numbering and saved collection. DOM adapter only; visual browser QA unverified.');
