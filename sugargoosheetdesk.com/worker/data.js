const CATALOG=__CATALOG__, FEATURES=__FEATURES__, I18N=__I18N__, ICON='__ICON__', GUIDE_IMAGES=__GUIDE_IMAGES__, ASSETS=__ASSETS__, BLOCKED_IMAGES=__BLOCKED_IMAGES__, MAIN_QC=__MAIN_QC__;
const QC_AID_BY_ID=Object.fromEntries(Object.entries(MAIN_QC.items).filter(([,p])=>p.id).map(([aid,p])=>[p.id,aid]));
const SLUGS=['shoes','t-shirts','clothing','hoodies','pants','belts','bags','perfume','electronics','other'];
const SIGNUP='https://www.sugargoo.com/register?memberId=3914891758646228603';
const CSS=__CSS__, CLIENT=__CLIENT__, RATES=__RATES__;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode=s=>String(s).replace(/&#(\d+);/g,(_,v)=>String.fromCharCode(+v)).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const strip=s=>decode(String(s).replace(/<[^>]*>/g,'')).trim();
const abs=s=>new URL(decode(s),'https://kakobuymake.com').href;
const ASSET_KEYS=Object.fromEntries(Object.values(ASSETS).map(v=>[v.key,v]));
const imageURL=u=>ASSETS[u]?'/asset/'+ASSETS[u].key:'/image?url='+encodeURIComponent(u);
const RAM=new Map();
async function remote(url,ttl=900){const old=RAM.get(url);if(old&&Date.now()-old.time<ttl*1000)return old.value;const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(7500),cf:{cacheTtl:ttl,cacheEverything:true}});if(!r.ok)throw Error('Source '+r.status);const value=await r.text();if(RAM.size>150)RAM.delete(RAM.keys().next().value);RAM.set(url,{time:Date.now(),value});return value;}
function parseCards(s,cat){let a=[];for(const m of s.matchAll(/<a[^>]*href="[^"]*aid=(\d+)"[^>]*class="product-card"[^>]*>([\s\S]*?)<\/a>/g)){const b=m[2],im=b.match(/<img[^>]*src="([^"]+)"/),t=b.match(/<h3[^>]*>([\s\S]*?)<\/h3>/),p=b.match(/class="price"[^>]*>\$?([\d.]+)/);if(im&&t&&p)a.push({aid:m[1],title:strip(t[1]),image:abs(im[1]),price:+p[1],cat});}const total=s.match(/共<strong>(\d+)<\/strong>页\s*<strong>(\d+)<\/strong>条/);return{items:a,pages:total?+total[1]:1,total:total?+total[2]:a.length};}
async function category(cat,page=1){const fallback=CATALOG[cat];if(fallback.items.length>=fallback.total)return {...fallback,items:fallback.items.slice((page-1)*48,page*48),pages:Math.ceil(fallback.items.length/48)};if(page===1)return fallback;try{return await remote('https://kakobuymake.com/index.php?m=home&c=Lists&a=index&tid='+cat+'&page='+page).then(s=>parseCards(s,cat));}catch{return{items:[],pages:fallback.pages,total:fallback.total,error:true};}}
function fromWeidian(html){let m=html.match(/id="__rocker-render-inject__" data-obj="([^"]+)"/);if(!m)throw Error('Seller unavailable');const d=JSON.parse(decode(m[1])).result.default_model.item_info;return{gallery:(d.imgs||[]).filter(u=>!BLOCKED_IMAGES.includes(u)),sourceName:d.item_name,cny:parseFloat(d.price||d.origin_price),sourceAvailable:true};}
// Import warehouse references from the matching main-site listing, separately from seller images.
function fromMainListing(html,expectedId){
 const clean=html.replace(/<!--[\s\S]*?-->/g,''),id=clean.match(/itemID(?:%3D|=)(\d+)/)?.[1];
 if(expectedId&&id&&id!==expectedId)throw Error('QC listing identity mismatch');
 const gallery=clean.match(/<div\b[^>]*class=["']product-gallery["'][^>]*>([\s\S]*?)<div\b[^>]*class=["']product-details["'][^>]*>/i)?.[1];
 if(!gallery)throw Error('QC gallery unavailable');
 const images=[];
 for(const match of gallery.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)){
  try{const url=new URL(decode(match[1]),'https://kakobuymake.com');
   if(url.protocol!=='https:'||url.hostname!=='kakobuymake.com'||url.username||url.password||!/^\/uploads\/.+\.(?:jpe?g|png|webp)$/i.test(url.pathname)||BLOCKED_IMAGES.includes(url.href))continue;
   if(!images.includes(url.href))images.push(url.href);
  }catch{}
 }
 if(!images.length)throw Error('QC gallery contains no source images');
 // First image is the catalog cover, also repeated by its active thumbnail.
 return {...(id?{id}:{}),sourceQc:images.slice(1),qcStatus:images.length>1?'available':'missing'};
}
async function product(aid){
 const known=aid==='7899577122'?FEATURES.sample:FEATURES.featured.find(x=>x.aid===aid);
 let catalog;for(const v of Object.values(CATALOG)){catalog=v.items.find(x=>x.aid===aid);if(catalog)break;}
 const sourceAid=MAIN_QC.items[aid]?aid:known?QC_AID_BY_ID[known.id]:aid;
 const saved=MAIN_QC.items[sourceAid];
 if(!known&&!catalog&&!saved)return null;
 let p={...(catalog||{}),...(known||{}),aid,sourceQc:saved?.qc||[],qcStatus:saved?.status==='error'?'unavailable':saved?.status||'unavailable'};
 if(saved?.id)p.id=saved.id;
 p.cat=p.cat||2;
 // Every listing uses the main-site QC gallery, including curated homepage products.
 // Keep seller carousel metadata separate; it never supplies warehouse references.
 if(!known&&p.id){
  try{Object.assign(p,fromWeidian(await remote('https://weidian.com/item.html?itemID='+p.id,3600)));if(p.gallery.length)p.image=p.gallery[0];}catch{p.gallery=[];p.sourceAvailable=false;}
 }
 return p;
}
function makeContext(req){const u=new URL(req.url),lang=I18N[u.searchParams.get('lang')]?u.searchParams.get('lang'):'en',t={...I18N.en,...I18N[lang]};const curr=(u.searchParams.get('currency')||'USD').toUpperCase();return{u,lang,t,curr:/^[A-Z]{3}$/.test(curr)?curr:'USD',link:(path,extras={})=>{const url=new URL(path,u.origin);if(lang!=='en')url.searchParams.set('lang',lang);if(curr!=='USD')url.searchParams.set('currency',curr);for(const [k,v]of Object.entries(extras))if(v!=null&&v!=='')url.searchParams.set(k,v);return url.pathname+url.search+url.hash;}};}
