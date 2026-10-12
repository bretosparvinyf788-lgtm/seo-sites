(()=>{
'use strict';
const words=JSON.parse(document.getElementById('explorerWords').textContent);
const grid=document.getElementById('exploreGrid');
const cards=grid?[...grid.children]:[];
const state={view:'discover',category:'all',limit:10,saved:[],recent:[],ready:false,error:false};
const el=id=>document.getElementById(id);
let toastTimer;
function toast(message){const target=el('toast');target.textContent=message;target.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>target.style.display='none',3200)}
async function api(method='GET',body){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{const response=await fetch('/api/finds',{method,credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal});if(!response.ok)throw Error('List request failed');return await response.json()}finally{clearTimeout(timer)}}
function paintSaved(){document.querySelectorAll('[data-saved-count]').forEach(node=>node.textContent=state.ready?state.saved.length:'—');document.querySelectorAll('[data-save]').forEach(button=>{const saved=state.saved.includes(button.dataset.save);button.disabled=!state.ready&&!state.error;button.setAttribute('aria-pressed',String(saved));const title=button.closest('.product')?.querySelector('h3')?.textContent||document.querySelector('.detail-copy h1')?.textContent||'';button.setAttribute('aria-label',(saved?words.savedAction:words.save)+(title?': '+title:''))})}
function render(){
 paintSaved();if(!grid)return;
 document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===state.view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 document.querySelectorAll('[data-category-filter]').forEach(b=>{const active=b.dataset.categoryFilter===state.category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 const personal=state.view!=='discover';el('storageNote').hidden=!personal;el('clearRecent').hidden=state.view!=='recent'||!state.ready||!state.recent.length;
 const sort=el('exploreSort').value;
 let matches=cards.filter(card=>(state.view==='discover'||state[state.view].includes(card.dataset.id))&&(state.category==='all'||card.dataset.category===state.category));
 if(sort!=='0')matches.sort((a,b)=>(Number(a.dataset.cost)-Number(b.dataset.cost))*(sort==='1'?1:-1));
 else if(personal)matches.sort((a,b)=>state[state.view].indexOf(a.dataset.id)-state[state.view].indexOf(b.dataset.id));
 cards.forEach(card=>card.hidden=true);grid.append(...matches);matches.slice(0,state.limit).forEach(card=>card.hidden=false);
 const waiting=personal&&!state.ready;
 el('resultCount').textContent=words.results.replace('{shown}',Math.min(state.limit,matches.length)).replace('{total}',matches.length);
 el('loadMore').hidden=waiting||matches.length<=state.limit;
 el('listState').hidden=matches.length>0&&!waiting;
 el('listStateText').textContent=waiting?(state.error?words.storageError:words.loading):state.view==='saved'&&!state.saved.length?words.emptySaved:state.view==='recent'&&!state.recent.length?words.emptyRecent:words.emptyFilter;
 el('retryList').hidden=!waiting||!state.error;
 el('backDiscover').hidden=waiting||matches.length>0;
 if(waiting)cards.forEach(card=>card.hidden=true);
}
function reset(){state.category='all';state.limit=10;el('exploreSort').value='0'}
function changeView(view){state.view=['saved','recent'].includes(view)?view:'discover';reset();render()}
function accept(data){if(!Array.isArray(data.saved)||!Array.isArray(data.recent))throw Error('Invalid list');state.saved=data.saved;state.recent=data.recent;state.ready=true;state.error=false;render()}
async function load(){state.error=false;render();try{accept(await api());const current=document.querySelector('[data-current-product]')?.dataset.currentProduct;if(current)accept(await api('POST',{action:'view',id:current}))}catch{state.error=true;render()}}
if(grid){
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{history.replaceState(null,'','#'+b.dataset.view);changeView(b.dataset.view)}));
 document.querySelectorAll('[data-category-filter]').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.categoryFilter;state.limit=10;render()}));
 ['exploreSort'].forEach(id=>el(id).addEventListener('change',()=>{state.limit=10;render()}));
 el('resetFilters').addEventListener('click',()=>{reset();render()});
 el('loadMore').addEventListener('click',()=>{state.limit+=10;render()});
 el('backDiscover').addEventListener('click',()=>{history.replaceState(null,'','#discover');changeView('discover')});
 el('retryList').addEventListener('click',load);
 el('clearRecent').addEventListener('click',async()=>{el('clearRecent').disabled=true;try{accept(await api('POST',{action:'clear-recent'}))}catch{toast(words.storageError)}finally{el('clearRecent').disabled=false}});
 addEventListener('hashchange',()=>changeView(location.hash.slice(1)));
 changeView(location.hash.slice(1));
}
document.querySelectorAll('[data-save]').forEach(button=>button.addEventListener('click',async()=>{
 if(!state.ready){await load();if(!state.ready){toast(words.storageError);return}}
 const id=button.dataset.save,remove=state.saved.includes(id);document.querySelectorAll('[data-save]').forEach(b=>b.disabled=true);
 try{accept(await api('POST',{action:remove?'unsave':'save',id}));toast(remove?words.removedToast:words.savedToast)}catch{toast(words.storageError);paintSaved()}
}));
load();
})();
