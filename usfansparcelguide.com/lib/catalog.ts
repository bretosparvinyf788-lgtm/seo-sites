export type Product = { id: string; title: string; originalTitle: string; image: string; price: number; category: number; sourceUrl: string; gallery?: string[]; qc?: string[]; buy?: string; marketplaceUrl?: string };
export const SOURCE = 'https://www.kakobuymake.com';
export const REGISTER = 'https://usfans.com/register?ref=T2JMMC';
export const SITE = 'https://usfansparcelguide.com';
export const categories = [
 { id: 2, slug: 'shoes', en: 'Shoes & slippers', zh: '鞋子与拖鞋', icon: 'shoe' },
 { id: 3, slug: 't-shirts', en: 'T-shirts', zh: 'T恤', icon: 'shirt' },
 { id: 4, slug: 'clothing', en: 'Fashion clothing', zh: '时尚服装', icon: 'clothes' },
 { id: 5, slug: 'hoodies', en: 'Hoodies', zh: '卫衣', icon: 'hoodie' },
 { id: 6, slug: 'pants', en: 'Pants & trousers', zh: '裤子', icon: 'pants' },
 { id: 7, slug: 'belts', en: 'Belts', zh: '腰带', icon: 'belt' },
 { id: 8, slug: 'bags', en: 'Bags', zh: '包袋', icon: 'bag' },
 { id: 9, slug: 'perfume', en: 'Perfume', zh: '香水', icon: 'perfume' },
 { id: 10, slug: 'electronics', en: 'Electronics', zh: '电子产品', icon: 'electronics' },
 { id: 11, slug: 'accessories', en: 'Other finds', zh: '其他商品', icon: 'other' },
];
export function decode(s = '') { return s.replace(/&(?:amp|quot|#39|lt|gt|nbsp);|&#(?:x[0-9a-f]+|\d+);/gi, m => { const names: Record<string,string> = {'&amp;':'&','&quot;':'"','&#39;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' '}; if(names[m.toLowerCase()]) return names[m.toLowerCase()]; const n = m.startsWith('&#x') ? parseInt(m.slice(3,-1),16) : parseInt(m.slice(2,-1),10); return Number.isFinite(n) && n < 0x110000 ? String.fromCodePoint(n) : ''; }); }
const clean = (s='') => decode(s.replace(/<[^>]*>/g,'').trim());
const capture = (s:string,re:RegExp) => s.match(re)?.[1] || '';
function image(s:string) { try { const u = new URL(decode(s), SOURCE); return ['kakobuymake.com','www.kakobuymake.com'].includes(u.hostname) && u.pathname.startsWith('/uploads/') ? u.href : ''; } catch { return ''; } }
export function inferCategory(title:string) { if(/内裤|短裤|长裤|牛仔裤|卫裤|trousers|shorts|jeans/i.test(title) && !/套装/.test(title)) return 6; if(/鞋|slipper|sneaker|spez|gel-nyc/i.test(title)) return 2; if(/卫衣|hoodie/i.test(title)) return 5; if(/T-Shirt|T恤|短袖|球衣|tee/i.test(title)) return 3; if(/腰带|皮带|belt/i.test(title)) return 7; if(/包|wallet|bag/i.test(title)) return 8; if(/香水|perfume/i.test(title)) return 9; if(/耳机|手机|electronics|headphone/i.test(title)) return 10; if(/服|夹克|套装|衬衫|clothing|jacket/i.test(title)) return 4; return 11; }
export function englishTitle(raw:string, category:number) {
 const text=raw.replace(/^DJ[-—]*/i,'').replace(/(?:reptz\d+|repai|OMGBUY|jump\d+[a-z]?|phbsy|phb\d+|HD-mryp\d+|mryp\d+|OMG)(?:[-—]*)/gi,'').trim();
 if(/TECH\s*F[LI]EECE/i.test(text)) return 'TECH FLEECE jacket & pants set';
 if(/Gel-NYC/i.test(text)) return 'GEL-NYC sneakers';
 if(/Hanes.*Boxer/i.test(text)) return 'Hanes boxer briefs';
 const latin=(text.match(/[A-Za-z][A-Za-z0-9 .&’'-]*/g)||[]).map(s=>s.trim()).filter(s=>s.length>2 && !/^(?:TOP|RT|SS|With box|brand|men|Batch)$/i.test(s)).join(' ').replace(/\s+/g,' ').slice(0,65);
 const noun:Record<number,string>={2:/拖鞋|slipper/i.test(text)?'Slippers':'Sneakers',3:/球衣|足球/i.test(text)?'Football shirt':'T-shirt',4:/套装/.test(text)?'Clothing set':/夹克/.test(text)?'Jacket':'Clothing',5:/拉链|开衫|zip/i.test(text)?'Zip-up hoodie':'Hoodie',6:/内裤/.test(text)?'Boxer briefs':/短裤|shorts/i.test(text)?'Shorts':/牛仔|jeans/i.test(text)?'Jeans':'Trousers',7:'Belt',8:/钱包|wallet/i.test(text)?'Wallet':'Bag',9:'Perfume',10:'Electronics',11:/墨镜|太阳镜/.test(text)?'Sunglasses':/眼镜/.test(text)?'Eyeglass frames':/腕表/.test(text)?'Watch':'Accessory'};
 if(latin && /[a-z]{3}/i.test(latin) && !/^(Fashion|Casual|quality|luxury brand)$/i.test(latin)) return latin.toLowerCase().includes(noun[category]?.toLowerCase()) ? latin : `${latin} ${noun[category] || 'Find'}`;
 const style=/水洗/.test(text)?'Washed ':/刺绣/.test(text)?'Embroidered ':/印花|图案/.test(text)?'Graphic ':/宽松/.test(text)?'Relaxed-fit ':'';
 return `${style}${noun[category] || 'Find'}`;
}
export function parseCatalog(html:string,category=0) {
 const products:Product[]=[];
 for(const m of html.matchAll(/<a\b[^>]*href="[^"]*[?&]aid=(\d+)[^"]*"[^>]*class="product-card[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)) {
  const b=m[2],originalTitle=clean(capture(b,/<h3\b[^>]*class="product-title"[^>]*>([\s\S]*?)<\/h3>/i));
  const img=image(capture(b,/<img\b[^>]*data-src="([^"]+)"/i)||capture(b,/<img\b[^>]*src="([^"]+)"/i));
  const price=Number(clean(capture(b,/<span\b[^>]*class="price"[^>]*>([\s\S]*?)<\/span>/i)).replace(/[^0-9.]/g,'')); const cid=category||inferCategory(originalTitle);
  if(img&&originalTitle&&!products.some(p=>p.id===m[1])) products.push({id:m[1],originalTitle,title:englishTitle(originalTitle,cid),image:img,price,category:cid,sourceUrl:`${SOURCE}/?m=home&c=View&a=index&aid=${m[1]}`});
 }
 const pages=html.match(/共\s*<strong>(\d+)<\/strong>\s*页\s*<strong>(\d+)<\/strong>\s*条/i);
 return {products,totalPages:pages?Number(pages[1]):1,totalItems:pages?Number(pages[2]):products.length};
}
export function parseDetail(html:string,id:string):Product {
 const originalTitle=clean(capture(html,/<h1\b[^>]*class="product-title"[^>]*>([\s\S]*?)<\/h1>/i)); const cover=image(capture(html,/<img\b[^>]*id="mainImage"[^>]*src="([^"]+)"/i));
 if(!originalTitle||!cover) throw new Error('Product unavailable');
 const block=capture(html,/<div\b[^>]*class="thumbnail-carousel"[^>]*>([\s\S]*?)<\/div>/i); const gallery=[...new Set([cover,...[...block.matchAll(/<img\b[^>]*src="([^"]+)"/gi)].map(m=>image(m[1]))].filter(Boolean))];
 const qc:string[]=[];for(const section of html.matchAll(/<(?:section|div)\b[^>]*(?:id|class)="[^"]*(?:qc[-_ ]?(?:photos|gallery)|quality[-_ ]?control)[^"]*"[^>]*>([\s\S]*?)<\/(?:section|div)>/gi)) for(const im of section[1].matchAll(/<img\b[^>]*(?:data-src|src)="([^"]+)"/gi)){const src=image(im[1]);if(src&&!qc.includes(src))qc.push(src);}
 let buy='';for(const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/gi))try{const u=new URL(decode(m[1]));if(['usfans.com','www.usfans.com'].includes(u.hostname)&&/^\/product\/\d+\/\d+$/.test(u.pathname)){u.searchParams.set('ref','T2JMMC');buy=u.href;break;}}catch{}
 const cat=inferCategory(originalTitle);const price=Number(clean(capture(html,/<span\b[^>]*class="current-price price"[^>]*>([\s\S]*?)<\/span>/i)).replace(/[^0-9.]/g,''));
 const itemId=buy.match(/\/product\/3\/(\d+)/)?.[1];
 return {id,originalTitle,title:englishTitle(originalTitle,cat),image:cover,price,category:cat,gallery,qc,buy,marketplaceUrl:itemId?`https://weidian.com/item.html?itemID=${itemId}`:undefined,sourceUrl:`${SOURCE}/?m=home&c=View&a=index&aid=${id}`};
}
export async function readSource(url:URL|string) {
 let edgeCache:Cache|undefined;const key=new Request(String(url));
 try{if(typeof caches!=='undefined'){edgeCache=await caches.open('usfans-source-v1');const hit=await edgeCache.match(key);if(hit)return await hit.text();}}catch{}
 const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'},signal:AbortSignal.timeout(15000),next:{revalidate:300}} as RequestInit); if(!r.ok) throw new Error('Catalog temporarily unavailable');const text=await r.text();if(text.length>3000000)throw new Error('Source too large');
 if(edgeCache)try{await edgeCache.put(key,new Response(text,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300'}}));}catch{}
 return text;
}
export async function getCatalog(category=0,page=1,sort='newest') {const u=new URL(SOURCE);u.searchParams.set('m','home');u.searchParams.set('c','Lists');u.searchParams.set('a','index');u.searchParams.set('tid',String(category||1));u.searchParams.set('page',String(page));if(sort==='price-low'||sort==='price-high'){u.searchParams.set('sort','price');u.searchParams.set('sort_asc',sort==='price-low'?'asc':'desc');}else {u.searchParams.set('sort','new');u.searchParams.set('sort_asc','desc');}return parseCatalog(await readSource(u),category);}
export async function getProduct(id:string) {if(!/^[1-9]\d{0,9}$/.test(id))throw new Error('Invalid product');return parseDetail(await readSource(`${SOURCE}/?m=home&c=View&a=index&aid=${id}`),id);}
