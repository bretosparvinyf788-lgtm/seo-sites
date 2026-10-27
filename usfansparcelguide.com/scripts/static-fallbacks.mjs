import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// Public HTML and its assets must survive Pages Functions fail-open mode.
// The live Worker remains responsible for language queries, sorting and fresh data.
export async function writeStaticFallbacks({out,worker,origin,productLimit=60}) {
  const directory=path.resolve(out);
  const {default:app}=await import(pathToFileURL(path.resolve(worker)).href+'?static-export');
  const nativeFetch=globalThis.fetch;
  const responses=new Map();
  globalThis.fetch=async (input,options)=>{
    const url=String(input instanceof Request?input.url:input);
    if(!url.startsWith('https://kakobuymake.com/'))return nativeFetch(input,options);
    if(!responses.has(url))responses.set(url,nativeFetch(input,options).then(async r=>({body:await r.arrayBuffer(),status:r.status,headers:[...r.headers]})));
    const r=await responses.get(url);return new Response(r.body.slice(0),r);
  };
  const env={BUILD_STATIC:true,ASSETS:{async fetch(request){
    const pathname=decodeURIComponent(new URL(request.url).pathname);
    const file=path.resolve(directory,'.'+pathname);
    if(!file.startsWith(directory+path.sep))return new Response(null,{status:404});
    for(const candidate of [file,path.join(file,'index.html')])try{return new Response(await fs.readFile(candidate));}catch{}
    return new Response(null,{status:404});
  }}};
  const pending=[];
  const context={waitUntil(promise){pending.push(Promise.resolve(promise).catch(()=>{}));}};
  const fetchPage=pathname=>app.fetch(new Request(origin+pathname),env,context);
  const safeFile=pathname=>path.join(directory,pathname==='/'?'index.html':pathname.replace(/^\//,'')+'/index.html');
  const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"');
  const xml=await fs.readFile(path.join(directory,'sitemap.xml'),'utf8');
  const paths=new Set(['/']);
  for(const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
    const url=new URL(decode(m[1]));if(url.origin===origin)paths.add(url.pathname);
  }
  const queue=[...paths];const products=new Set(queue.filter(p=>/^\/products?\/\d+\/?$/.test(p)));
  const assets=new Set(['/style.css','/client.js','/logo.png','/favicon.png']);
  let count=0;
  try{
    for(let i=0;i<queue.length;i++){
      const pathname=queue[i];
      if(pathname.includes('..')||pathname.startsWith('/api/')||pathname==='/saved')continue;
      const response=await fetchPage(pathname);
      if(response.status!==200)throw new Error('Static page failed: '+origin+pathname+' '+response.status);
      if(!response.headers.get('content-type')?.includes('text/html'))throw new Error('Expected HTML: '+pathname);
      let html=await response.text();
      if(!/<h1[\s>]/i.test(html)||!/rel=["']canonical["']/i.test(html)||/noindex/i.test(response.headers.get('x-robots-tag')||''))throw new Error('Unindexable public fallback: '+pathname);
      // Source images can load without invoking a per-image Worker proxy.
      html=html.replace(/(["'])\/image\?([^"']+)\1/g,(all,quote,query)=>{
        const value=new URLSearchParams(decode(query)).get('src');
        try{const url=new URL(value);if(url.protocol==='https:'&&['kakobuymake.com','si.geilicdn.com'].includes(url.hostname))return quote+url.href.replaceAll('&','&amp;')+quote;}catch{}
        return all;
      });
      for(const m of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
        let url;try{url=new URL(decode(m[1]),origin+pathname);}catch{continue;}
        if(url.origin!==origin)continue;
        if(/^\/product\/\d+$/.test(url.pathname)&&!products.has(url.pathname)&&products.size<productLimit){products.add(url.pathname);queue.push(url.pathname);}
        if(/\.(?:css|js|png|svg|jpe?g|webp|ico)$/i.test(url.pathname)||/^\/(?:cover|reference|guide-shots)\//.test(url.pathname))assets.add(url.pathname);
      }
      if(origin.includes('hipobuy')){
        const api=new URL('/api/catalog',origin);
        if(pathname==='/'){api.searchParams.set('category','1');api.searchParams.set('page',origin.includes('sheetnotes')?'12':'9');}
        if(pathname==='/products')api.searchParams.set('category','1');
        const category=pathname.match(/^\/category\/(\d+)$/),product=pathname.match(/^\/product\/(\d+)$/);
        if(category)api.searchParams.set('category',category[1]);
        if(product){api.pathname='/api/detail';api.searchParams.set('id',product[1]);}
        const r=await app.fetch(new Request(api),env,context);
        if(r.status!==200)throw new Error('Static API snapshot failed: '+api+' '+r.status);
        api.searchParams.sort();const key=api.pathname+(api.search?'?'+api.searchParams:'');
        const data=JSON.stringify({[key]:await r.json()}).replaceAll('<','\\u003c');
        html=html.replace('<head>','<head><script>window.__STATIC_API__='+data+'</script>');
      }
      const file=safeFile(pathname);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);count++;
    }
    let assetCount=0;
    for(const pathname of assets){
      const file=path.join(directory,pathname.slice(1));
      try{await fs.access(file);continue;}catch{}
      const r=await fetchPage(pathname);if(r.status!==200||r.headers.get('content-type')?.includes('text/html'))continue;
      await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,Buffer.from(await r.arrayBuffer()));assetCount++;
    }
    const routeFile=path.join(directory,'_routes.json'),routes=JSON.parse(await fs.readFile(routeFile,'utf8'));
    routes.exclude=[...new Set([...routes.exclude,'/*.css','/*.js','/cover/*','/reference/*','/guide-shots/*','/assets/*','/logo.png','/favicon.png','/favicon.svg'])];
    if(routes.exclude.length+routes.include.length>100)throw new Error('Pages route limit exceeded');
    await fs.writeFile(routeFile,JSON.stringify(routes,null,2)+'\n');
    await fs.writeFile(path.join(directory,'404.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found</title><h1>Page not found</h1><p><a href="/">Return to the spreadsheet</a></p></html>');
    console.log(`Static fallbacks: ${count} public pages, ${assetCount} assets; live routing preserved.`);
  }finally{globalThis.fetch=nativeFetch;await Promise.allSettled(pending);}
}
