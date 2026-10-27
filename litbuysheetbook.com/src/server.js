function catalogOffer(p){return Number.isFinite(p.price)&&p.price>0&&p.buy?{offers:{'@type':'Offer',price:p.price.toFixed(2),priceCurrency:'USD',url:p.buy}}:{'@type':'WebPage'};}
const htmlHeaders={'content-type':'text/html; charset=utf-8','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','cache-control':'private, no-cache'};
const faqSchema=l=>({'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ[l].map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
export default {async fetch(request,env,ctx){
const u=new URL(request.url),path=u.pathname.replace(/\/$/,'')||'/',l=Object.hasOwn(LOCALES,u.searchParams.get('lang'))?u.searchParams.get('lang'):'en',t=UI[l],origin=u.origin;
if(u.hostname==='www.litbuysheetbook.com'||u.hostname==='litbuysheetbook.com'&&u.protocol!=='https:'){u.protocol='https:';u.hostname='litbuysheetbook.com';return Response.redirect(u.href,301);}
if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
if(ASSETS[path]){const a=ASSETS[path];return new Response(Uint8Array.from(atob(a.data),c=>c.charCodeAt(0)),{headers:{'content-type':a.type,'cache-control':'public, max-age=86400','x-content-type-options':'nosniff'}})}
if(path==='/style.css'||path==='/client.js')return new Response(path==='/style.css'?CSS:CLIENT,{headers:{'content-type':path==='/style.css'?'text/css; charset=utf-8':'application/javascript; charset=utf-8','cache-control':'public, max-age=3600'}});
if(path==='/image'){
 const input=u.searchParams.get('src')||'',safe=sourceImage(input);
 if(!safe||safe!==input)return new Response('Invalid image',{status:400});
 const key=new Request(u.href);let cache;
 // Cache support is optional. A cache outage must never prevent source images loading.
 try{cache=globalThis.caches?.default;const hit=await cache?.match(key);if(hit)return hit;}catch{}
 try{
  const r=await fetch(safe,{headers:{'User-Agent':'Mozilla/5.0',Accept:'image/avif,image/webp,image/*,*/*;q=0.8'},signal:AbortSignal.timeout(15000)});
  if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw Error('Upstream image status '+r.status);
  const res=new Response(r.body,{headers:{'content-type':r.headers.get('content-type'),'cache-control':'public, max-age=86400','x-content-type-options':'nosniff'}});
  if(cache&&ctx)try{ctx.waitUntil(Promise.resolve(cache.put(key,res.clone())).catch(()=>{}));}catch{}
  return res;
 }catch(error){console.error('Source image load failed:',error?.message||'Unknown error');return new Response('Image unavailable',{status:502,headers:{'cache-control':'no-store'}})}
}
if(path==='/api/gallery'){const id=u.searchParams.get('id')||'';if(!/^[1-9]\d{0,9}$/.test(id))return Response.json({error:'Invalid product ID'},{status:400});try{const p=SNAPSHOT.find(x=>x.id===id)||parseDetail(await readSource(ORIGIN+'/?m=home&c=View&a=index&aid='+id),id);return Response.json(await sellerGallery(p),{headers:{'cache-control':'public, max-age=300'}})}catch{return Response.json({error:'Gallery unavailable'},{status:502,headers:{'cache-control':'no-store'}})}}
if(path==='/api/rates'){try{const key=new Request(origin+'/api/rates');const cache=globalThis.caches?.default;const hit=await cache?.match(key);if(hit)return hit;const r=await fetch('https://api.frankfurter.dev/v1/latest?base=USD',{signal:AbortSignal.timeout(7000)});if(!r.ok)throw Error('Rates unavailable');const data=await r.json();if(data.base!=='USD'||!data.rates?.EUR||!/^\d{4}-\d{2}-\d{2}$/.test(data.date))throw Error('Invalid rates');data.rates.USD=1;const response=Response.json(data,{headers:{'cache-control':'public, max-age=14400'}});if(cache&&ctx)ctx.waitUntil(cache.put(key,response.clone()));return response;}catch{return Response.json(RATES,{headers:{'cache-control':'public, max-age=600'}})}}
if(path==='/robots.txt')return new Response(u.hostname==='litbuysheetbook.com'||u.hostname==='www.litbuysheetbook.com'?'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /saved\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n',{headers:{'content-type':'text/plain; charset=utf-8'}});
if(path==='/sitemap.xml'){const paths=['/','/products','/categories','/faq',...SLUGS.map(s=>'/category/'+s),...GUIDE_SLUGS.slice(0,1).map(s=>'/guides/'+s),...SNAPSHOT.map(p=>'/product/'+p.id)];return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.flatMap(p=>Object.keys(LOCALES).map(lang=>'<url><loc>'+esc(origin+href(p,lang))+'</loc></url>')).join('')+'</urlset>',{headers:{'content-type':'application/xml; charset=utf-8'}})}
let body='',pageTitle='',desc='',schema=[],status=200,canonicalPath=path;
if(path==='/'){body=home(l);pageTitle='Litbuy '+t.spreadsheet+' — '+t.finds+' & QC';schema=[faqSchema(l),{'@context':'https://schema.org','@type':'ItemList',itemListElement:SNAPSHOT.map((p,i)=>({'@type':'ListItem',position:i+1,url:origin+href('/product/'+p.id,l),name:title(p,l)}))}];}
else if(path==='/categories'){pageTitle=t.categories;body='<div class="wrap">'+heading(l,t.categoryTitle,t.categoryIntro)+'<section class="section">'+cats(l,true)+'</section></div>';}
else if(path==='/products'||/^\/category\/[a-z-]+$/.test(path)){const slug=path.split('/')[2],cid=slug?SLUGS.indexOf(slug)+2:0;if(slug&&!SLUGS.includes(slug)){status=404;}else{let page=Number(u.searchParams.get('page')||1),sort=u.searchParams.get('sort')||'newest';if(!Number.isInteger(page)||page<1||page>1000||!['newest','price-low','price-high'].includes(sort))return new Response('Invalid filters',{status:400});let data,error=false;try{data=await catalog(cid,page,sort);}catch{data={products:[],totalItems:0,totalPages:1};error=true;status=503;}pageTitle=cid?CAT[l][cid-2]+' — Litbuy '+t.spreadsheet:t.all;body=listing(l,cid,data,page,sort,path,error);if(page>1)canonicalPath=path+'?page='+page;}}
else if(/^\/product\/[1-9]\d{0,9}$/.test(path)){const id=path.split('/')[2];let p=SNAPSHOT.find(p=>p.id===id);if(!p)try{p=parseDetail(await readSource(ORIGIN+'/?m=home&c=View&a=index&aid='+id),id)}catch{status=503}if(p){body=productPage(p,l);pageTitle=title(p,l)+' — Litbuy';desc=t.galleryNote;schema=[{'@context':'https://schema.org','@type':'Product',...catalogOffer(p),name:title(p,l),image:p.image,description:t.galleryNote,sku:p.itemId||p.id,url:origin+href(path,l)},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:t.home,item:origin+href('/',l)},{'@type':'ListItem',position:2,name:CAT[l][p.category-2],item:origin+href('/category/'+SLUGS[p.category-2],l)},{'@type':'ListItem',position:3,name:title(p,l),item:origin+href(path,l)}]}];}}
else if(path==='/guides')return new Response(null,{status:302,headers:{Location:href('/guides/'+GUIDE_SLUGS[0],l),'cache-control':'no-store'}});
else if(path.startsWith('/guides/')){const i=GUIDE_SLUGS.indexOf(path.split('/')[2]);if(i!==0)status=404;else{body=articlePage(i,l);pageTitle=ARTICLES[l][i].title;desc=ARTICLES[l][i].subtitle;schema=[{'@context':'https://schema.org','@type':'Article',headline:pageTitle,description:desc,author:{'@type':'Organization',name:'Litbuy Sheetbook'},datePublished:'2026-10-12',dateModified:i===0?'2026-10-13':'2026-10-12',inLanguage:l,mainEntityOfPage:origin+href(path,l)}];}}
else if(path==='/faq'){pageTitle=t.faq;body='<div class="wrap" style="max-width:900px">'+heading(l,t.faqTitle,SITE_FAQ[l].intro)+'<section class="section">'+faq(l)+'</section></div>';schema=[faqSchema(l)];}
else if(path==='/saved'){pageTitle=t.saved;body='<div class="wrap">'+heading(l,t.saved)+'<section class="section"><div class="grid" id="saved-grid"></div><noscript>'+t.nothing+'</noscript></section></div>';}
else status=404;
if(!body){body='<div class="wrap">'+heading(l,status===404?'404':t.unavailable)+'<section class="section"><a class="button" href="'+href('/products',l)+'">'+t.back+'</a></section></div>';pageTitle=status===404?'404':t.unavailable;}
const headers={...htmlHeaders};if(u.hostname!=='litbuysheetbook.com'&&u.hostname!=='www.litbuysheetbook.com'||path==='/saved'||status!==200)headers['x-robots-tag']='noindex, nofollow';
let result=layout(body,l,canonicalPath,pageTitle,desc,origin,schema);
return new Response(request.method==='HEAD'?null:result,{status,headers});
}};
