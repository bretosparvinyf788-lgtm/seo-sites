import {runtimeData} from './catalog-runtime-data.js';

export const sourceOrigin='https://www.kakobuymake.com';
export const categorySlugs=['shoes','shirts','clothing','hoodies','pants','belts','bags','perfume','electronics','other'];
const sourceNames=['Shoes/slippers','T-shirt','Fashion Clothing','Hoodies','Pants/Trousers','Leather Belt','Fashion Bag','Perfume','Electronics','Other Stuff'];
export const validProductId=id=>typeof id==='string'&&/^[1-9]\d{0,9}$/.test(id);
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function decode(s=''){return s.replace(/&(?:amp|quot|apos|lt|gt|nbsp);|&#(?:x[0-9a-f]+|\d+);/gi,m=>{const entities={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' '};if(entities[m.toLowerCase()])return entities[m.toLowerCase()];const n=m.slice(2,3).toLowerCase()==='x'?parseInt(m.slice(3,-1),16):parseInt(m.slice(2,-1),10);return n>=0&&n<0x110000?String.fromCodePoint(n):'';});}
const clean=s=>decode((s||'').replace(/<[^>]*>/g,'').trim());
const capture=(s,re)=>s.match(re)?.[1]||'';
function sourceImage(s){try{const u=new URL(decode(s),sourceOrigin);return ['www.kakobuymake.com','kakobuymake.com'].includes(u.hostname)&&u.pathname.startsWith('/uploads/')?u.href:'';}catch{return '';}}
function inferCategory(title){if(/内裤|短裤|长裤|牛仔裤|卫裤|trousers|shorts|jeans/i.test(title)&&!/套装/.test(title))return 'pants';if(/鞋|slipper|sneaker|gel-nyc/i.test(title))return 'shoes';if(/卫衣|hoodie/i.test(title))return 'hoodies';if(/T-Shirt|T恤|短袖|球衣|tee/i.test(title))return 'shirts';if(/腰带|皮带|belt/i.test(title))return 'belts';if(/包|wallet|bag/i.test(title))return 'bags';if(/香水|perfume/i.test(title))return 'perfume';if(/耳机|手机|electronics|headphone/i.test(title))return 'electronics';if(/服|夹克|套装|衬衫|clothing|jacket/i.test(title))return 'clothing';return 'other';}
export function parseSourceCatalog(html,category){
 const products=[];
 for(const m of html.matchAll(/<a\b[^>]*href="[^"]*[?&]aid=(\d+)[^"]*"[^>]*class="product-card[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)){
  const original=clean(capture(m[2],/<h3\b[^>]*class="product-title"[^>]*>([\s\S]*?)<\/h3>/i));
  const image=sourceImage(capture(m[2],/<img\b[^>]*data-src="([^"]+)"/i)||capture(m[2],/<img\b[^>]*src="([^"]+)"/i));
  const price=Number(clean(capture(m[2],/<span\b[^>]*class="price"[^>]*>([\s\S]*?)<\/span>/i)).replace(/[^0-9.]/g,''));
  if(original&&image&&!products.some(p=>p.id===m[1]))products.push({id:m[1],original_title:original,image,price,category:category||inferCategory(original)});
 }
 const totals=html.match(/共\s*<strong>(\d+)<\/strong>\s*页\s*<strong>(\d+)<\/strong>\s*条/i);
 if(!totals)throw Error('Source pagination missing');
 return {products,totalPages:Number(totals[1]),totalItems:Number(totals[2])};
}
export function parseSourceProduct(html,id){
 const original=clean(capture(html,/<h1\b[^>]*class="product-title"[^>]*>([\s\S]*?)<\/h1>/i));
 const image=sourceImage(capture(html,/<img\b[^>]*id="mainImage"[^>]*src="([^"]+)"/i));
 if(!original||!image)throw Error('Product missing');
 const breadcrumb=clean(capture(html,/<div\b[^>]*class="product-breadcrumb"[^>]*>([\s\S]*?)<\/div>/i));
 const index=sourceNames.findIndex(s=>breadcrumb.includes(s));
 const galleryBlock=capture(html,/<div\b[^>]*class="thumbnail-carousel"[^>]*>([\s\S]*?)<\/div>/i);
 const images=[...new Set([image,...Array.from(galleryBlock.matchAll(/<img\b[^>]*src="([^"]+)"/gi),m=>sourceImage(m[1]))].filter(Boolean))];
 let buy='',item_id='',market='';
 for(const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi))try{const u=new URL(decode(m[1]));if(['www.usfans.com','usfans.com'].includes(u.hostname)&&/^\/product\/\d+\/\d+$/.test(u.pathname)){u.hostname='usfans.com';u.searchParams.set('ref','T2JMMC');buy=u.href;item_id=u.pathname.split('/').at(-1);if(u.pathname.startsWith('/product/3/'))market=`https://weidian.com/item.html?itemID=${item_id}`;break;}}catch{}
 const qc=[];for(const section of html.matchAll(/<(?:section|div)\b[^>]*(?:id|class)="[^"]*(?:qc[-_ ]?(?:photos|gallery)|quality[-_ ]?control)[^"]*"[^>]*>([\s\S]*?)<\/(?:section|div)>/gi))for(const im of section[1].matchAll(/<img\b[^>]*(?:data-src|src)="([^"]+)"/gi)){const u=sourceImage(im[1]);if(u&&!qc.includes(u))qc.push(u);}
 return {id,original_title:original,image,images,qc_images:qc,category:index>=0?categorySlugs[index]:inferCategory(original),price:Number(clean(capture(html,/<span\b[^>]*class="current-price price"[^>]*>([\s\S]*?)<\/span>/i)).replace(/[^0-9.]/g,'')),buy,item_id,market,source:`${sourceOrigin}/?m=home&c=View&a=index&aid=${id}`};
}
export async function boundedText(response,max=3000000){
 const reader=response.body?.getReader();if(!reader)return '';const chunks=[];let size=0;
 for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw Error('Source too large');}chunks.push(value);}
 const data=new Uint8Array(size);let at=0;for(const c of chunks){data.set(c,at);at+=c.length;}return new TextDecoder().decode(data);
}
async function readSource(url,ctx){
 let cache;const key=new Request(url.href);try{if(typeof caches!=='undefined'){cache=caches.default;const hit=await cache.match(key);if(hit)return boundedText(hit);}}catch{}
 const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'},signal:AbortSignal.timeout(18000)});
 if(!response.ok)throw Error(`Source status ${response.status}`);const text=await boundedText(response);
 // Never cache upstream errors or an HTML challenge page.
 if(!/class="(?:product-card|product-title)"|共\s*<strong>\d+<\/strong>/.test(text))throw Error('Invalid source response');
 if(cache){const put=cache.put(key,new Response(text,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=300'}})).catch(()=>{});if(ctx)ctx.waitUntil(put);else await put;}
 return text;
}
export async function getLiveCatalog(category,page=1,sort='0',ctx){
 const u=new URL(sourceOrigin);u.searchParams.set('m','home');u.searchParams.set('c','Lists');u.searchParams.set('a','index');u.searchParams.set('tid',String(category?categorySlugs.indexOf(category)+2:1));u.searchParams.set('page',String(page));
 u.searchParams.set('sort',sort==='0'?'new':'price');u.searchParams.set('sort_asc',sort==='1'?'asc':'desc');
 return parseSourceCatalog(await readSource(u,ctx),category);
}
export async function getLiveProduct(id,ctx){if(!validProductId(id))throw Error('Invalid ID');return parseSourceProduct(await readSource(new URL(`/?m=home&c=View&a=index&aid=${id}`,sourceOrigin),ctx),id);}
export function localizedTitle(p,lang){
 const known=runtimeData.featured[p.id]?.titles?.[lang];if(known)return known;
 const words=runtimeData.locales[lang]||runtimeData.locales.en;
 const latin=(p.original_title.replace(/\b(?:DJ|jump\d+[a-z]?|reptz\d+|repai|phbsy|phb\d+|HD-mryp\d+|mryp\d+|OMG)\b[-—]*/gi,'').match(/[A-Za-z][A-Za-z0-9 .&’'-]*/g)||[]).map(s=>s.trim()).filter(s=>s.length>2&&!/^(?:TOP|RT|SS|With box|brand|men|quality)$/i.test(s)).join(' ').replace(/\s+/g,' ').slice(0,75);
 const category=words.cats[categorySlugs.indexOf(p.category)]||words.cats[9];
 return (lang==='zh'?p.original_title.replace(/^DJ[-—]*/i,''):latin?`${latin} — ${category}`:category)+` · #${p.id}`;
}
const pathFor=(lang,path)=>'/'+(lang==='en'?'':lang+'/')+path;
function heart(p,t){return `<button class="save-item" data-save="${p.id}" aria-pressed="false" aria-label="${escapeHTML(t.explorer.save)}" disabled><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/></svg></button>`;}
export function liveProductCard(p,lang){const t=runtimeData.locales[lang]||runtimeData.locales.en;const title=escapeHTML(localizedTitle(p,lang)),href=pathFor(lang,`products/${p.id}/`);return `<article class="product" data-id="${p.id}" data-category="${p.category}" data-cost="${p.price}"><div class="product-img"><a href="${href}"><img src="${escapeHTML(p.image)}" alt="${title}" loading="lazy" width="360" height="360"></a>${heart(p,t)}</div><div class="card-copy"><div class="product-meta"><span>${escapeHTML(t.cats[categorySlugs.indexOf(p.category)])}</span></div><h3><a href="${href}">${title}</a></h3><strong data-price="${p.price}">$${p.price.toFixed(2)}</strong></div></article>`;}
function pageNavigation(url,page,total,t){
 const link=p=>{const u=new URL(url);u.searchParams.set('page',String(p));return escapeHTML(u.pathname+u.search);};
 const numbers=[...new Set([1,...Array.from({length:5},(_,i)=>page-2+i).filter(p=>p>=1&&p<=total),total])].sort((a,b)=>a-b);let prev=0;
 return `<nav class="live-pagination" aria-label="${escapeHTML(t.pagination.page)}">${page>1?`<a href="${link(page-1)}" rel="prev">${escapeHTML(t.pagination.previous)}</a>`:''}${numbers.map(p=>{const html=(p>prev+1&&prev?'<span>…</span>':'')+(p===page?`<span class="active" aria-current="page">${p}</span>`:`<a href="${link(p)}">${p}</a>`);prev=p;return html;}).join('')}${page<total?`<a href="${link(page+1)}" rel="next">${escapeHTML(t.pagination.next)}</a>`:''}</nav>`;
}
function withQuery(html,url){
 const params=new URLSearchParams();for(const key of ['page','sort'])if(url.searchParams.has(key))params.set(key,url.searchParams.get(key));const suffix=params.size?'?'+escapeHTML(params.toString()):'';
 return html.replace(/(<link\b[^>]*(?:rel="canonical"|rel="alternate")[^>]*href=")([^"]+)(")/g,(m,a,b,c)=>a+b.split('?')[0]+suffix+c).replace(/(<div class="dropdown">)([\s\S]*?)(<\/div>)/,(m,a,b,c)=>a+b.replace(/href="([^"]+)"/g,(m,h)=>`href="${h.split('?')[0]}${suffix}"`)+c);
}
function responseHTML(html,status=200){return new Response(html,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':status===200?'public, max-age=0, must-revalidate':'no-store','X-Content-Type-Options':'nosniff','X-Findsbook-Catalog':'live-main-v1'}});}
export async function serveLivePage(request,env,ctx){
 const u=new URL(request.url);const segments=u.pathname.split('/').filter(Boolean);let lang='en';if(runtimeData.locales[segments[0]])lang=segments.shift();
 const t=runtimeData.locales[lang];const listing=segments.length===1&&segments[0]==='spreadsheet'||segments.length===2&&segments[0]==='categories'&&categorySlugs.includes(segments[1]);
 const detail=segments.length===2&&segments[0]==='products'&&validProductId(segments[1]);if(!listing&&!detail)return null;
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 if(!u.pathname.endsWith('/')){u.pathname+='/';return Response.redirect(u.href,301);}
 const assetURL=new URL(request.url);assetURL.search='';assetURL.pathname=listing?u.pathname:pathFor(lang,'spreadsheet/');
 const asset=await env.ASSETS.fetch(new Request(assetURL));if(!asset.ok)return asset;
 let html=await boundedText(asset);
 try{
  if(listing){
   const raw=u.searchParams.get('page')||'1',page=/^[1-9]\d{0,3}$/.test(raw)?Number(raw):1;const sort=['0','1','2'].includes(u.searchParams.get('sort'))?u.searchParams.get('sort'):'0';
   const data=await getLiveCatalog(segments[0]==='categories'?segments[1]:undefined,page,sort,ctx);
   if(page>Math.max(1,data.totalPages))return responseHTML(html.replace(/<!--LIVE_LIST-->[\s\S]*?<!--END_LIVE_LIST-->/,`<p class="empty">${escapeHTML(t.empty)} <a href="${escapeHTML(u.pathname)}">${escapeHTML(t.explorer.retry)}</a></p>`),404);
   const content=`<div class="result-heading"><p data-live-total="${data.totalItems}" data-live-pages="${data.totalPages}">${escapeHTML(t.explorer.results.replace('{shown}',data.products.length).replace('{total}',data.totalItems))} · ${escapeHTML(t.pagination.page)} ${page} / ${data.totalPages}</p></div><div class="product-grid">${data.products.map(p=>liveProductCard(p,lang)).join('')}</div>${pageNavigation(u,page,data.totalPages,t)}`;
   html=html.replace(/<!--LIVE_LIST-->[\s\S]*?<!--END_LIVE_LIST-->/,content).replace(/<option value="([012])"[^>]*>/g,(m,value)=>`<option value="${value}"${sort===value?' selected':''}>`).replace('id="sort"','id="sort" data-live-sort');
   html=withQuery(html,u);if(page>1)html=html.replace(/<title>(.*?)<\/title>/,`<title>$1 · ${escapeHTML(t.pagination.page)} ${page}</title>`);
  }else{
   const p=await getLiveProduct(segments[1],ctx),title=localizedTitle(p,lang),category=t.cats[categorySlugs.indexOf(p.category)];
   if(!p.qc_images.length)p.qc_images=runtimeData.featured[p.id]?.qc_images||[];
   const images=p.images.map((im,i)=>`<button data-image="${escapeHTML(im)}"><img src="${escapeHTML(im)}" alt="${escapeHTML(title)} ${i+1}" loading="lazy"></button>`).join('');
   const refs=p.images.slice(1);
   const zooms=photos=>photos.map((im,i)=>`<button data-zoom="${escapeHTML(im)}" aria-label="${escapeHTML(t.viewImage)} ${i+1}"><img src="${escapeHTML(im)}" alt="${escapeHTML(title)} ${i+1}" width="400" height="400" loading="lazy"></button>`).join('');
   const body=`<section class="section detail-page" data-current-product="${p.id}"><div class="breadcrumbs"><ol><li><a href="${pathFor(lang,'spreadsheet/')}">${escapeHTML(t.nav[1])}</a></li><li><a href="${pathFor(lang,`categories/${p.category}/`)}">${escapeHTML(category)}</a></li><li aria-current="page">#${p.id}</li></ol></div><div class="detail-grid"><div><div class="main-photo"><button class="main-image-zoom" data-zoom="${escapeHTML(p.image)}" aria-label="${escapeHTML(t.viewImage)}"><img id="mainPhoto" src="${escapeHTML(p.image)}" alt="${escapeHTML(title)}"></button></div><div class="thumbnails">${images}</div></div><div class="detail-copy"><div class="detail-save">${heart(p,t)}<span>${escapeHTML(t.explorer.saved)}</span></div><div class="kicker">${escapeHTML(category)}</div><h1>${escapeHTML(title)}</h1><p class="detail-price" data-price="${p.price}">$${p.price.toFixed(2)}</p><p class="fine">${escapeHTML(t.priceNote)}</p><p class="source-id">${escapeHTML(t.itemId)}: <strong>${escapeHTML(p.item_id||p.id)}</strong></p>${p.buy?`<a class="button wide" href="${escapeHTML(p.buy)}" target="_blank" rel="sponsored noopener">${escapeHTML(t.buy)}</a>`:''}${p.market?`<button class="copy text-link" data-copy="${escapeHTML(p.market)}" data-copied="${escapeHTML(t.copied)}">${escapeHTML(t.copy)} ⧉</button>`:''}<div class="checklist"><h3>${escapeHTML(t.check)}</h3>${t.checks.map(s=>`<p>✓ ${escapeHTML(s)}</p>`).join('')}</div><p class="source-original">${escapeHTML(p.original_title)}</p></div></div><section class="qc-panel"><h2>${escapeHTML(t.qc)}</h2><p>${escapeHTML(p.qc_images.length?t.qcNote:t.noqc)}</p>${p.qc_images.length?`<div class="qc-grid">${zooms(p.qc_images)}</div>`:''}</section>${refs.length?`<section class="qc-panel"><h2>${escapeHTML(t.photos)}</h2><p>${escapeHTML(t.referenceNote)}</p><div class="qc-grid">${zooms(refs)}</div></section>`:''}<a class="secondary" href="${pathFor(lang,`categories/${p.category}/`)}">${escapeHTML(category)} →</a></section>`;
   const path=`products/${p.id}/`;
   html=html.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${body}</main>`).replace(/<title>[\s\S]*?<\/title>/,`<title>${escapeHTML(title)} | USFans Findsbook</title>`).replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${escapeHTML(title)}</h1>`);
   html=html.replace(/(<link\b[^>]*(?:rel="canonical"|rel="alternate")[^>]*href=")([^"]+)(")/g,(m,a,b,c)=>a+b.replace(/spreadsheet\/$/,path)+c).replace(/(<div class="dropdown">)([\s\S]*?)(<\/div>)/,(m,a,b,c)=>a+b.replace(/spreadsheet\//g,path)+c).replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${escapeHTML(title)}">`).replace(/(<meta property="og:url" content=")[^"]+"/,`$1https://usfansfindsbook.com${pathFor(lang,path)}"`);
  }
  return request.method==='HEAD'?new Response(null,{headers:responseHTML('').headers}):responseHTML(html);
 }catch(error){
  console.error(JSON.stringify({event:'source_catalog_error',path:u.pathname,message:String(error.message)}));
  const body=`<section class="section empty"><h1>${escapeHTML(t.sourceError)}</h1><p>${escapeHTML(t.explorer.storageError)}</p><a class="secondary" href="${escapeHTML(u.pathname+u.search)}">${escapeHTML(t.explorer.retry)}</a></section>`;
  return responseHTML(html.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${body}</main>`),503);
 }
}
export async function serveSavedProducts(request,ctx){const u=new URL(request.url);if(u.pathname!=='/api/products')return null;const lang=runtimeData.locales[u.searchParams.get('lang')]?u.searchParams.get('lang'):'en';const ids=[...new Set((u.searchParams.get('ids')||'').split(','))].filter(validProductId).slice(0,24);const results=[];for(let i=0;i<ids.length;i+=5){const items=await Promise.allSettled(ids.slice(i,i+5).map(id=>getLiveProduct(id,ctx)));for(const item of items)if(item.status==='fulfilled')results.push(liveProductCard(item.value,lang));}return new Response(JSON.stringify({cards:results}),{headers:{'Content-Type':'application/json','Cache-Control':'private, no-store'}});}
