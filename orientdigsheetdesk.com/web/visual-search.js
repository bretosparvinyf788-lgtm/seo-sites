function isImageSearchRoute(path=location.pathname){return /^\/image-search\/?$/.test(path.split('?')[0])}
const visualSearch={preview:'',file:null,descriptor:null,results:[],resultPage:1,busy:false,phase:'',run:0,error:''};
let visualCore,visualWorker,visualWorkerSequence=0;
const visualPending=new Map(),visualEmbeddingCache=new Map();
async function visualEngine(blob,prototypes){
 if(!visualCore)visualCore=await import('/visual-core.js?v=__VISUAL_REVISION__');
 if(!visualWorker){
  visualWorker=new Worker('/visual-engine.js?v=__VISUAL_REVISION__',{type:'module'});
  visualWorker.onmessage=({data})=>{const job=visualPending.get(data.id);if(!job)return;clearTimeout(job.timer);visualPending.delete(data.id);data.error?job.reject(Error(data.error)):job.resolve(data.result)};
  visualWorker.onerror=()=>{for(const job of visualPending.values()){clearTimeout(job.timer);job.reject(Error('recognition-unavailable'))}visualPending.clear();visualWorker.terminate();visualWorker=null};
 }
 return new Promise((resolve,reject)=>{const id=++visualWorkerSequence,timer=setTimeout(()=>{visualPending.delete(id);reject(Error('recognition-timeout'))},180000);visualPending.set(id,{resolve,reject,timer});visualWorker.postMessage({id,blob,prototypes})});
}

let visualIndexPromise;
async function getVisualIndex(){
 if(!visualIndexPromise)visualIndexPromise=fetch('/api/visual-index?v=__VISUAL_REVISION__',{signal:AbortSignal.timeout(45000)}).then(async r=>{if(!r.ok)throw Error('index-unavailable');const index=await r.json();if(index.version!==2||index.source!=='https://kakobuymake.com'||!Array.isArray(index.items)||!Array.isArray(index.prototypes))throw Error('index-unavailable');return index}).catch(e=>{visualIndexPromise=null;throw e});
 return visualIndexPromise;
}
async function optimizeVisualFile(file){const bitmap=await createImageBitmap(file);try{const scale=Math.min(1,1024/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.86));if(!blob)throw Error('invalid-image');return blob}finally{bitmap.close()}}
function visualResultCard(p){return `<article class="visual-product"><a href="/product/${p.id}/"><div class="product-photo"><img src="${esc(media(p.cover))}" alt="${esc(productName(p))}" loading="lazy" decoding="async"></div><h3>${esc(productName(p))}</h3><strong class="product-price">${esc(money(p.price))}</strong></a></article>`}
function imageSearchPage(){
 const s=visualSearch,count=s.results.length,pages=Math.ceil(count/18),page=Math.max(1,Math.min(s.resultPage,pages||1));
 return `<div class="wrap image-search-page"><div class="page-header"><h1 class="page-title">${t('imageSearch')}</h1><p class="image-search-intro">${t('imageSearchIntro')}</p></div><div class="visual-search-controls ${s.preview?'has-image':''}" aria-busy="${s.busy}">
 ${s.preview?`<label class="visual-preview" for="visual-file"><img src="${esc(s.preview)}" alt="${esc(t('uploadedImage'))}"><span>${t('chooseAnotherPhoto')}</span></label>`:''}
 <div class="visual-upload-main"><label class="upload-box" for="visual-file" id="visual-dropzone"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 16V3m-6 6 6-6 6 6M3 15v6h18v-6"/></svg><strong>${t(s.preview?'chooseAnotherPhoto':'uploadImage')}</strong><span class="drop-hint">${t('imageDropHint')}</span><span>${t('imageFormats')}</span><input id="visual-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif"></label>
 <div role="status" aria-live="polite" class="visual-status">${s.busy?`<span class="visual-spinner" aria-hidden="true"></span>${t(s.phase==='preparing'?'preparingPhoto':s.phase==='loading'?'loadingRecognition':s.phase==='identifying'?'identifyingProduct':'matchingImages')}`:s.preview&&!s.error?count+' '+t('imageResultCount'):''}${s.error?`<p>${esc(s.error)}</p>`:''}${s.busy?` <button id="visual-stop">${t('cancelImageSearch')}</button>`:s.error&&s.file?` <button id="visual-retry">${t('retryImageSearch')}</button>`:''}</div></div></div>
 ${!s.busy&&s.descriptor&&!count&&!s.error?`<p class="visual-empty">${t('noSimilarProducts')}</p>`:''}
 ${count?`<section class="visual-result-section" aria-labelledby="visual-result-heading"><h2 id="visual-result-heading">${t('similarFinds')}</h2><div class="grid visual-results">${s.results.slice((page-1)*18,page*18).map(visualResultCard).join('')}</div>${pages>1?`<nav class="visual-pagination" aria-label="${esc(t('imageResultPages'))}">${Array.from({length:pages},(_,i)=>`<button data-visual-page="${i+1}" aria-label="${esc(t('imageResultPage'))} ${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}</nav>`:''}</section>`:''}</div>`;
}
function renderVisualSearch(){if(isImageSearchRoute()){document.querySelector('#app').innerHTML=imageSearchPage();bind()}}
async function receiveVisualFile(file){
 if(!file)return;const s=visualSearch,run=++s.run;s.busy=false;s.descriptor=null;s.results=[];s.resultPage=1;s.error='';s.file=file;
 if(s.preview){URL.revokeObjectURL(s.preview);s.preview=''}
 if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)||file.size>20*1024*1024){s.file=null;s.error=t('invalidSearchImage');renderVisualSearch();return}
 s.busy=true;s.phase='preparing';renderVisualSearch();
 try{
  const optimized=await optimizeVisualFile(file);if(run!==s.run)return;s.preview=URL.createObjectURL(optimized);s.phase='loading';renderVisualSearch();
  const [,index]=await Promise.all([visualEngine(),getVisualIndex()]);if(run!==s.run)return;s.phase='identifying';renderVisualSearch();
  const embedded=await visualEngine(optimized,index.prototypes);if(run!==s.run)return;const query=visualCore.resolveVisualQuery(embedded,index);s.descriptor=embedded;
  if(!query)return
  s.phase='matching';renderVisualSearch();
  const matches=[];
  for(const row of index.items){if(row[5]!==query.kind)continue;const candidate=visualCore.indexVisualCandidate(row);const similarity=visualCore.visualMatch(query,candidate,row[1]);if(similarity!==null)matches.push({id:row[0],title:row[1],price:row[2],cover:row[3],cat:row[4],kind:row[5],similarity})}
  if(run!==s.run)return;s.results=visualCore.rankedVisualResults(matches);
 }catch(e){console.error('visual-recognition:',e.message);if(run!==s.run)return;s.error=t(e.message==='index-unavailable'?'imageIndexUnavailable':'recognitionUnavailable')}
 finally{if(run===s.run){s.busy=false;renderVisualSearch()}}
}
function bindVisualSearch(){
 document.querySelector('#visual-file')?.addEventListener('change',e=>receiveVisualFile(e.target.files?.[0]));
 const drop=document.querySelector('#visual-dropzone');drop?.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-active')});drop?.addEventListener('dragleave',e=>{if(!drop.contains(e.relatedTarget))drop.classList.remove('drag-active')});drop?.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-active');receiveVisualFile(e.dataTransfer?.files?.[0])});
 document.querySelector('#visual-retry')?.addEventListener('click',()=>receiveVisualFile(visualSearch.file));
 document.querySelector('#visual-stop')?.addEventListener('click',()=>{++visualSearch.run;visualSearch.busy=false;visualSearch.error=t('imageSearchCancelled');renderVisualSearch()});
 document.querySelectorAll('[data-visual-page]').forEach(button=>button.addEventListener('click',()=>{visualSearch.resultPage=Number(button.dataset.visualPage);renderVisualSearch();document.querySelector('#visual-result-heading')?.scrollIntoView({block:'start'})}));
}
document.addEventListener('paste',e=>{if(!isImageSearchRoute())return;const file=Array.from(e.clipboardData?.files||[]).find(f=>f.type.startsWith('image/'));if(file){e.preventDefault();receiveVisualFile(file)}});
