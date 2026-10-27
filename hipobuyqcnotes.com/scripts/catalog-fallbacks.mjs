import fs from 'node:fs';

// Reuse the UI's translations. All listing/detail data is read from the main store.
export function catalogFallbackSource(page,client,siteName){
 const data=JSON.parse(page.match(/const DATA=(\{[\s\S]*?\});/)[1]);
 const names=client.match(/const productTypeTranslations=[^\n]+;/)[0]+'\n'+['sourceDisplayTitle','productName'].map(name=>client.match(new RegExp('function '+name+'\\([\\s\\S]*?\\n  }'))[0]).join('\n');
 const categoryNames=client.match(/const categoryNames=(\{[^\n]+\});/)[1];
 return 'const CATALOG_COPY='+JSON.stringify(data.copy)+';\nconst CATALOG_LANGS='+JSON.stringify(data.languages)+';\nconst CATALOG_SITE_NAME='+JSON.stringify(siteName)+';\nconst CATALOG_CATEGORY_NAMES='+categoryNames+';\n'+String(renderCatalogFallback).replace('/* PRODUCT_NAMES */',()=>names)+'\n';
}

async function renderCatalogFallback(html,url){
 const languageBases={'en-GB':'en','en-AU':'en','en-NZ':'en','en-CA':'en','pt-BR':'pt','es-MX':'es','de-CH':'de'};
 const lang=Object.hasOwn(CATALOG_LANGS,url.searchParams.get('lang'))?url.searchParams.get('lang'):'en';
 const state={lang},baseLang=()=>languageBases[lang]||lang,t=CATALOG_COPY[baseLang()];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 /* PRODUCT_NAMES */
 const href=(path,params={})=>{const q=new URLSearchParams(params);if(lang!=='en')q.set('lang',lang);return path+(q.size?'?'+q:'');};
 const navigation='<nav aria-label="'+esc(t.categories)+'"><a href="'+href('/')+'">'+esc(t.nav[0])+'</a> · <a href="'+href('/products')+'">'+esc(t.nav[1])+'</a> · <a href="'+href('/categories')+'">'+esc(t.categories)+'</a></nav>';
 const categoryId=Number(url.pathname.match(/^\/category\/(\d+)$/)?.[1]||0);
 const id=url.pathname.match(/^\/product\/(\d+)$/)?.[1];
 const page=Number(url.searchParams.get('page')||1),sort=url.searchParams.get('sort')||'',query=(url.searchParams.get('q')||'').trim().slice(0,100);
 const sorts={newest:['new','desc'],price_asc:['price','asc'],price_desc:['price','desc'],views:['click','desc']};
 let title=t.nav[1],body='',status=200;
 if(!Number.isSafeInteger(page)||page<1||page>1000||(sort&&!Object.hasOwn(sorts,sort)))return {html:'Invalid filters',status:400};
 try{
  if(id){
   const p=detail(await source(ORIGIN+'/?m=home&c=View&a=index&aid='+id),id);
   title=productName(p);
   body='<div class="detail-layout"><img src="'+esc(p.image)+'" alt="'+esc(title)+'" style="max-width:100%;height:auto"><div><h1>'+esc(title)+'</h1><p>'+esc(p.price)+'</p><p>'+esc(t.sourceNote)+'</p>'+(p.buy?'<a class="primary-button" href="'+esc(p.buy)+'" rel="sponsored noopener">'+esc(t.buy)+'</a>':'')+'</div></div>';
  }else{
   const target=new URL(ORIGIN);target.search=new URLSearchParams({m:'home',c:query?'Search':'Lists',a:query?'lists':'index',tid:String(categoryId||1),page:String(page)});
   if(query){target.searchParams.set('keywords',query);target.searchParams.set('method','1');target.searchParams.set('channelid','2');}
   if(sort&&!query){target.searchParams.set('sort',sorts[sort][0]);target.searchParams.set('sort_asc',sorts[sort][1]);}
   const sourceHtml=await source(target.href),cats=categories(sourceHtml),items=products(sourceHtml),info=pagination(sourceHtml);
   const catName=x=>CATALOG_CATEGORY_NAMES[x.id]?.[baseLang()]||x.name;
   if(categoryId&&!cats.some(x=>x.id===categoryId))return {html:'Not found',status:404};
   if(page>1&&info.totalPages&&page>info.totalPages)return {html:'Not found',status:404};
   if(url.pathname==='/categories'){
    title=t.categories;body='<h1>'+esc(title)+'</h1><div class="category-grid">'+cats.map(c=>'<a href="'+href('/category/'+c.id)+'">'+esc(catName(c))+'</a>').join('')+'</div>';
   }else{
    if(categoryId)title=catName(cats.find(x=>x.id===categoryId));
    if(page>1)title+=' — '+t.page+' '+page;
    body='<h1>'+esc(title)+'</h1><p>'+esc(t.intro)+'</p><div class="product-grid">'+items.map(p=>'<a class="product-card" href="'+href('/product/'+p.id)+'"><div class="product-image"><img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(productName(p))+'"></div><div class="product-body"><h2>'+esc(productName(p))+'</h2><strong>'+esc(p.price)+'</strong></div></a>').join('')+'</div>';
    if(!items.length)body+='<p>'+esc(t.noResults)+'</p>';
    const params={...(sort?{sort}:{}),...(query?{q:query}:{})};
    body+='<nav class="catalog-pagination" aria-label="Pagination">'+(page>1?'<a href="'+esc(href(url.pathname,{...params,page:page-1}))+'">'+esc(t.previous)+'</a>':'')+' <span>'+esc(t.page)+' '+page+' / '+info.totalPages+'</span> '+(page<info.totalPages?'<a href="'+esc(href(url.pathname,{...params,page:page+1}))+'">'+esc(t.next)+'</a>':'')+'</nav>';
   }
  }
 }catch{status=503;body='<h1>'+esc(t.nav[1])+'</h1><p>'+esc(t.unavailable)+'</p>';}
 html=html.replace('<div id="app"></div>','<div id="app"><main class="section shell">'+navigation+body+'</main></div>')
  .replace(/<title>[\s\S]*?<\/title>/i,()=>'<title>'+esc(title+' | '+CATALOG_SITE_NAME)+'</title>')
  .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/i,()=>'<meta name="description" content="'+esc(title+'. '+t.sourceNote)+'">')
  .replace(/<html lang="[^"]*"/i,'<html lang="'+lang+'"');
 return {html,status};
}
