(()=>{
const {l,t}=JSON.parse(document.querySelector('#site-data').textContent),key='joyagoo-atlas-saved-v1';
const imageAttempts=new WeakMap();
function originalImage(image){try{const current=new URL(image.getAttribute('src'),location.origin);const original=image.dataset.original||(current.pathname==='/image'?current.searchParams.get('src'):'');const u=new URL(original);return u.protocol==='https:'&&((u.hostname==='kakobuymake.com'&&u.pathname.startsWith('/uploads/'))||u.hostname==='si.geilicdn.com')?u.href:''}catch{return ''}}
function recoverImage(image){if(!(image instanceof HTMLImageElement))return;const original=originalImage(image);if(!original)return;const stage=imageAttempts.get(image)||0;if(stage>=2){image.dataset.imageExhausted='true';const media=image.closest('.card-media');if(media&&!media.querySelector('.image-retry')){const button=document.createElement('button');button.className='image-retry';button.textContent=t.retry+' ↻';button.addEventListener('click',()=>{imageAttempts.delete(image);delete image.dataset.imageExhausted;button.remove();image.src='/image?v=2&reload='+Date.now()+'&src='+encodeURIComponent(original)});media.append(button)}return}imageAttempts.set(image,stage+1);image.dataset.original=original;setTimeout(()=>{if(!image.isConnected)return;image.referrerPolicy='no-referrer';image.src=stage===0?'/image?v=2&retry=1&src='+encodeURIComponent(original):original},stage===0?250:500)}
document.addEventListener('error',e=>recoverImage(e.target),true);
document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement){delete e.target.dataset.imageExhausted;imageAttempts.delete(e.target);e.target.closest('.card-media')?.querySelector('.image-retry')?.remove()}},true);
function checkImages(root=document){root.querySelectorAll('img').forEach(image=>{if(image.complete&&!image.naturalWidth)recoverImage(image)})}
checkImages();

function read(){try{const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data.filter(x=>/^\d{1,10}$/.test(x)):[]}catch{return []}}
let saved=read();const refresh=()=>{document.querySelectorAll('.saved-count').forEach(x=>x.textContent=saved.length);document.querySelectorAll('[data-save]').forEach(x=>{const yes=saved.includes(x.dataset.save);x.setAttribute('aria-pressed',yes);x.textContent=yes?'♥':'♡'});if(location.pathname==='/saved'){let visible=0;document.querySelectorAll('.card').forEach(x=>{x.hidden=!saved.includes(x.dataset.id);if(!x.hidden)visible++});const empty=document.querySelector('.empty-saved');if(empty)empty.hidden=visible>0}};
function toast(msg){document.querySelector('.toast')?.remove();const x=document.createElement('div');x.className='toast';x.setAttribute('role','status');x.textContent=msg;document.body.append(x);setTimeout(()=>x.remove(),2200)}
refresh();
document.addEventListener('click',e=>{const b=e.target.closest('[data-save]');if(b){const id=b.dataset.save,exists=saved.includes(id);saved=exists?saved.filter(x=>x!==id):[...saved,id];try{localStorage.setItem(key,JSON.stringify(saved))}catch{}refresh();toast(exists?t.removedToast:t.savedToast)}const a=e.target.closest('[data-photo]');if(a){e.preventDefault();const d=document.querySelector('#photo');d.querySelector('img').src=a.dataset.photo;d.querySelector('img').alt=a.querySelector('img')?.alt||t.qc;d.showModal()}});
document.querySelector('#photo button')?.addEventListener('click',()=>document.querySelector('#photo').close());
document.querySelector('.menu').addEventListener('click',e=>{const open=document.querySelector('#navlinks').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)});
document.querySelector('#language').addEventListener('change',e=>{const u=new URL(location.href);u.searchParams.set('lang',e.target.value);try{localStorage.setItem('joyagoo-atlas-lang',e.target.value)}catch{}location.href=u.href});
document.querySelector('#sort')?.addEventListener('change',e=>e.target.form.requestSubmit());
const curr=document.querySelector('#currency');let rates=null;
function convertedPrice(amount,base,target,feed){const from=feed?.rates?.[base],to=feed?.rates?.[target];return Number.isFinite(amount)&&amount>0&&Number.isFinite(from)&&from>0&&Number.isFinite(to)&&to>0?amount/from*to:null;}
function convert(c){if(!rates?.rates[c])return;document.querySelectorAll('[data-usd],[data-cny]').forEach(x=>{const base=x.hasAttribute('data-cny')?'CNY':'USD',amount=Number(base==='CNY'?x.dataset.cny:x.dataset.usd),value=convertedPrice(amount,base,c,rates);if(value!==null)x.textContent=new Intl.NumberFormat(l==='zh'?'zh-CN':l,{style:'currency',currency:c}).format(value)});document.querySelectorAll('[data-rate-note]').forEach(x=>x.hidden=c==='USD'&&!document.querySelector('[data-cny]'));try{localStorage.setItem('joyagoo-atlas-currency',c)}catch{}}
const priceRequests=new Set();
async function recoverPrices(root=document){
 const ids=[...new Set(Array.from(root.querySelectorAll('[data-price-id]')).map(x=>x.dataset.priceId))].filter(id=>/^[1-9]\d{0,9}$/.test(id)&&!priceRequests.has(id));
 ids.forEach(id=>priceRequests.add(id));
 async function next(){let id;while((id=ids.shift())){try{
  const response=await fetch('/api/price?id='+id);if(!response.ok)continue;const p=await response.json();
  if(p.id!==id||!['USD','CNY'].includes(p.currency)||!Number.isFinite(p.amount)||p.amount<=0)continue;
  document.querySelectorAll('[data-price-id="'+id+'"]').forEach(x=>{delete x.dataset.priceId;x.dataset[p.currency==='CNY'?'cny':'usd']=String(p.amount);x.dataset.priceSource=p.source;x.classList.remove('price-unavailable');x.removeAttribute('title');x.textContent=new Intl.NumberFormat(l==='zh'?'zh-CN':l,{style:'currency',currency:p.currency,currencyDisplay:p.currency==='CNY'?'code':'symbol'}).format(p.amount);x.closest('.detailcopy')?.querySelector('.price-status')?.remove()});
  if(rates)convert(curr.value);
 }catch{}}}
 await Promise.all(Array.from({length:Math.min(3,ids.length)},()=>next()));
}
curr.addEventListener('change',e=>convert(e.target.value));
fetch('/api/rates?version=3').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(data.base!=='USD'||!data.rates?.USD)return;rates=data;document.querySelectorAll('[data-rate-credit]').forEach(link=>{if(data.provider==='frankfurter'){link.href='https://frankfurter.dev';link.textContent='Frankfurter'}});Array.from(curr.options).forEach(x=>x.disabled=!data.rates[x.value]);document.querySelectorAll('[data-rate-date]').forEach(x=>x.textContent=data.date);let c='USD';try{c=localStorage.getItem('joyagoo-atlas-currency')||c}catch{}if(data.rates[c]){curr.value=c;convert(c)}refreshPickers()}).catch(()=>{});
const gallery=document.querySelector('[data-seller-gallery]');
if(gallery){const id=gallery.dataset.sellerGallery;const fail=()=>{gallery.querySelector('.empty').hidden=false;gallery.querySelector('.empty').textContent=t.sellerMissing;document.querySelector('#gallery-status').textContent=t.sellerMissing};if(!/^\d{5,15}$/.test(id))fail();else fetch('/api/gallery?itemId='+id).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(!data.images?.length)throw Error();const main=document.createElement('img');main.alt=t.seller;main.src='/image?src='+encodeURIComponent(data.images[0]);main.onerror=()=>{if(main.dataset.imageExhausted==='true'){main.remove();fail()}};gallery.append(main);gallery.querySelector('.empty').hidden=true;const thumbs=document.querySelector('.thumbs');data.images.forEach((url,i)=>{const b=document.createElement('button'),im=document.createElement('img');b.setAttribute('aria-label',t.seller+' '+(i+1));im.src='/image?src='+encodeURIComponent(url);im.alt=t.seller+' '+(i+1);b.append(im);b.addEventListener('click',()=>{if(!main.isConnected)gallery.append(main);gallery.querySelector('.empty').hidden=true;main.src=im.src});thumbs.append(b)});document.querySelector('#gallery-status').textContent=t.seller+' · '+data.images.length}).catch(fail)}
if(location.pathname==='/saved'){
const host=document.querySelector('#saved-grid');if(saved.length)fetch('/api/saved?ids='+saved.join(',')+'&lang='+l).then(r=>r.text()).then(html=>{host.innerHTML=html;checkImages(host);refresh();recoverPrices(host);if(rates)convert(curr.value)}).catch(()=>{host.textContent=t.error});
}
const compactPickers=[];
function refreshPickers(){compactPickers.forEach(picker=>picker.sync())}
function enhancePicker(select,kind){
 const language=kind==='language',label=language?t.language:t.currency;
 const wrapper=document.createElement('div');wrapper.className='compact-picker picker-'+kind;
 select.before(wrapper);wrapper.append(select);
 const trigger=document.createElement('button');trigger.type='button';trigger.id=kind+'-trigger';trigger.className='picker-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',kind+'-choices');
 const name=document.createElement('span');name.className='picker-native-name';
 const code=document.createElement('span');code.className='picker-code';
 const arrow=document.createElement('span');arrow.className='picker-chevron';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
 if(language)trigger.append(name);trigger.append(code,arrow);
 const panel=document.createElement('div');panel.id=kind+'-panel';panel.className='picker-panel';panel.hidden=true;
 const heading=document.createElement('div');heading.className='picker-heading';heading.dir='auto';heading.textContent=label;
 const count=document.createElement('span');count.textContent=select.options.length;heading.append(count);
 const list=document.createElement('div');list.id=kind+'-choices';list.className='picker-grid';list.setAttribute('role','listbox');list.setAttribute('aria-label',label);
 const options=Array.from(select.options),buttons=[];
 options.forEach(option=>{
  const button=document.createElement('button');button.type='button';button.className='picker-option';button.setAttribute('role','option');button.dataset.value=option.value;button.tabIndex=-1;
  const optionName=document.createElement('bdi');optionName.dir='auto';optionName.textContent=language?option.textContent.replace(new RegExp('\\s+'+option.value.toUpperCase()+'$'),''):option.value;
  if(!language){let currencyName=option.value;try{currencyName=new Intl.DisplayNames([l==='zh'?'zh-CN':l],{type:'currency'}).of(option.value)||option.value}catch{}const title=document.createElement('span');title.className='currency-name';title.textContent=currencyName;optionName.append(title);button.dataset.search=(option.value+' '+currencyName).toLocaleLowerCase();button.setAttribute('aria-label',option.value+' '+currencyName)}
  const optionCode=document.createElement('span');optionCode.className='picker-option-code';
  if(language)optionCode.textContent=option.value.toUpperCase();else{try{optionCode.textContent=new Intl.NumberFormat(l,{style:'currency',currency:option.value,currencyDisplay:'narrowSymbol'}).formatToParts(0).find(part=>part.type==='currency')?.value||''}catch{optionCode.textContent=''}}
  button.append(optionName,optionCode);buttons.push(button);list.append(button);
  button.addEventListener('click',()=>{if(option.disabled)return;select.value=option.value;close(true);sync();select.dispatchEvent(new Event('change',{bubbles:true}))});
 });
 let search=null;
 if(!language){search=document.createElement('input');search.type='search';search.className='currency-search';search.placeholder='USD / EUR / CNY…';search.setAttribute('aria-label',label);search.autocomplete='off';search.spellcheck=false;count.setAttribute('aria-live','polite');panel.append(heading,search,list);search.addEventListener('input',filterOptions);search.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close(true)}else if(event.key==='ArrowDown'){event.preventDefault();buttons.find(button=>!button.disabled&&!button.hidden)?.focus({preventScroll:true})}})}else panel.append(heading,list);
 wrapper.append(trigger,panel);select.hidden=true;
 function filterOptions(){if(!search)return;const query=search.value.trim().toLocaleLowerCase();let shown=0;buttons.forEach(button=>{button.hidden=!button.dataset.search.includes(query);if(!button.hidden)shown++});count.textContent=query?shown+' / '+options.length:options.length;list.scrollTop=0}

 function sync(){
  const option=options.find(option=>option.value===select.value)||options[0];
  name.textContent=option.textContent.replace(new RegExp('\\s+'+option.value.toUpperCase()+'$'),'');code.textContent=option.value.toUpperCase();
  trigger.setAttribute('aria-label',label+': '+option.textContent);
  buttons.forEach((button,i)=>{const selected=options[i].value===select.value;button.disabled=options[i].disabled;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected&&!panel.hidden?0:-1});
 }
 function close(focus=false){panel.hidden=true;trigger.setAttribute('aria-expanded','false');buttons.forEach(button=>button.tabIndex=-1);if(focus)trigger.focus({preventScroll:true})}
 function positionPanel(){const rect=trigger.getBoundingClientRect(),width=Math.min(340,innerWidth-24),left=Math.max(12,Math.min(rect.right-width,innerWidth-width-12)),available=Math.max(150,innerHeight-rect.bottom-28);panel.style.width=width+'px';panel.style.left=left+'px';panel.style.top=(rect.bottom+8)+'px';list.style.maxHeight=Math.min(language?280:222,available-(search?95:45))+'px'}
 function open(){
  compactPickers.forEach(picker=>picker.close());sync();if(search){search.value='';filterOptions()}positionPanel();panel.hidden=false;trigger.setAttribute('aria-expanded','true');
  const selected=buttons.find(button=>button.getAttribute('aria-selected')==='true'&&!button.disabled)||buttons.find(button=>!button.disabled);if(selected){selected.tabIndex=0;selected.focus({preventScroll:true});list.scrollTop=Math.max(0,selected.offsetTop-list.offsetTop-list.clientHeight/2)}
 }
 trigger.addEventListener('click',()=>panel.hidden?open():close());
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();open()}});
 list.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close(true);return}
  const moves={ArrowDown:2,ArrowUp:-2,ArrowRight:1,ArrowLeft:-1};if(!(event.key in moves)&&event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();const availableButtons=buttons.filter(button=>!button.hidden&&!button.disabled);if(!availableButtons.length)return;const current=Math.max(0,availableButtons.indexOf(document.activeElement));let target=event.key==='Home'?0:event.key==='End'?availableButtons.length-1:current+moves[event.key];target=Math.max(0,Math.min(availableButtons.length-1,target));const button=availableButtons[target];buttons.forEach(button=>button.tabIndex=-1);button.tabIndex=0;button.focus({preventScroll:true});const top=button.offsetTop-list.offsetTop;if(top<list.scrollTop)list.scrollTop=top;else if(top+button.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=top+button.offsetHeight-list.clientHeight;
 });
 document.addEventListener('click',event=>{if(!wrapper.contains(event.target))close()});
 document.addEventListener('focusin',event=>{if(!wrapper.contains(event.target))close()});
 let viewportWidth=innerWidth;window.addEventListener('resize',()=>{if(innerWidth!==viewportWidth){viewportWidth=innerWidth;close()}else if(!panel.hidden)positionPanel()});window.addEventListener('scroll',event=>{if(!panel.contains(event.target))close()},{capture:true,passive:true});
 select.addEventListener('change',sync);sync();return {sync,close};
}
compactPickers.push(enhancePicker(document.querySelector('#language'),'language'),enhancePicker(curr,'currency'));

recoverPrices();
})();
