import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('src/client.js','utf8');
const shelf=source.slice(source.indexOf('// The homepage shelf'),source.indexOf('// End homepage shelf.'));
const recent=source.slice(source.indexOf('// Recent history'),source.indexOf('// End recent history.'));
const click=source.slice(source.indexOf("document.addEventListener('click',e=>{const b=e.target.closest('[data-save]')"),source.indexOf('// The homepage shelf'));
const panels=Object.fromEntries(['home-saved-preview','home-saved-count','home-saved-empty','shortlist-total','recent-products','recent-empty','clear-recent'].map(id=>[id,{dataset:{},innerHTML:'',textContent:'',hidden:false,addEventListener(t,fn){this[t]=fn}}]));
const p={id:'2932',price:16,title:'Shorts',image:'https://example.com/a.jpg'},q={id:'2939',price:18.13,title:'Polo',cover:'/cover/2939'};
const stored={};let moneyCalls=0,clickHandler,viewed=null;
const context=vm.createContext({saved:{},d:{snapshot:[p,q],lang:'zh',ui:{unsave:'移除'}},langQuery:'?lang=zh',title:x=>x.title,esc:String,price(){moneyCalls++;panels['shortlist-total'].textContent=(Number(panels['shortlist-total'].dataset.usd)*7).toFixed(2)},read(k,f){return stored[k]??f},write(k,v){stored[k]=JSON.parse(JSON.stringify(v))},renderSaved(){},updateSaved(){vm.runInContext('renderHomeSaved()',context)},window:{addEventListener(){}},document:{getElementById:id=>panels[id],querySelector:()=>viewed,addEventListener(t,fn){clickHandler=fn}}});
vm.runInContext(shelf+click,context);
assert.equal(panels['shortlist-total'].dataset.usd,'0');
const tap=id=>clickHandler({target:{closest(){return {dataset:{save:id},closest(){return null}}}}});
tap('2932');tap('2939');assert.equal(panels['home-saved-count'].textContent,'2');assert.equal(panels['shortlist-total'].dataset.usd,'34.13');assert.equal(panels['shortlist-total'].textContent,'238.91');assert.ok(stored['litbuy-sheetbook:saved']['2932']);
assert.ok(panels['home-saved-preview'].innerHTML.includes('/product/2939?lang=zh'));
tap('2932');assert.equal(panels['shortlist-total'].dataset.usd,'18.13');tap('2939');assert.equal(panels['shortlist-total'].dataset.usd,'0');assert.equal(panels['home-saved-empty'].hidden,false);assert.equal(panels['home-saved-preview'].hidden,true);assert.ok(moneyCalls>=5);
vm.runInContext(recent,context);assert.equal(panels['recent-empty'].hidden,false);assert.equal(panels['clear-recent'].hidden,true);
// Re-execute the actual recording block as separate product visits.
const record=recent.slice(recent.indexOf('if(viewed){'),recent.indexOf("document.getElementById('clear-recent')",recent.indexOf('if(viewed){')));
function visit(item){context.visitItem={dataset:{recentProduct:JSON.stringify(item)}};vm.runInContext('{const viewed=visitItem;'+record+'}',context)}
visit(p);visit(q);visit(p);assert.deepEqual(stored['litbuy-sheetbook:recent'].map(x=>x.id),['2932','2939']);
vm.runInContext('renderRecent()',context);assert.ok(panels['recent-products'].innerHTML.includes('/product/2932?lang=zh'));assert.equal(panels['recent-empty'].hidden,true);
for(let i=0;i<10;i++)visit({...p,id:String(100+i)});
assert.equal(stored['litbuy-sheetbook:recent'].length,8);vm.runInContext('renderRecent()',context);assert.equal((panels['recent-products'].innerHTML.match(/class="recent-item"/g)||[]).length,4);
panels['clear-recent'].click();assert.deepEqual(stored['litbuy-sheetbook:recent'],[]);assert.equal(panels['recent-empty'].hidden,false);assert.equal(panels['recent-products'].innerHTML,'');
console.log('PASS desk interactions: actual save/remove handlers, exact subtotal, currency formatting hook, localized links, empty states, recent visit order, deduplication, history limits and clearing.');
