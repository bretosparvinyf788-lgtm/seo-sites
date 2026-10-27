import {catalogFallbackSource} from './catalog-fallbacks.mjs';
import {homeFallbackSource} from './home-fallbacks.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const [template,page,client,guides,guideClient]=await Promise.all(['worker/index.js','worker/page.html','worker/client.js','worker/guides-page.html','worker/guides-client.js'].map(read));
const tag=`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YXWSVE47YC"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YXWSVE47YC');</script>`;
const embed=(html,script)=>html.replace('<head>','<head>'+tag).replace('__CLIENT_SCRIPT__',()=>script.replace(/<\/script/gi,'<\\/script')).replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'');
let code=homeFallbackSource(page,'Hipobuy QC Notes')+catalogFallbackSource(page,client,'Hipobuy QC Notes')+template.replace('__PAGE__',()=>JSON.stringify(embed(page,client))).replace('__GUIDE_PAGE__',()=>JSON.stringify(embed(guides,guideClient))).replace('export default {async fetch(request)', 'const application={async fetch(request)');
code+=`\nconst PUBLIC_ORIGIN='https://hipobuyqcnotes.com';
const paths=['/','/products','/categories','/guides','/guides/reading-qc-photos','/guides/measurement-checks','/guides/extra-photo-requests',...Array.from({length:10},(_,i)=>'/category/'+(i+2))];
export default {async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(url.hostname==='www.hipobuyqcnotes.com'||(url.hostname==='hipobuyqcnotes.com'&&url.protocol==='http:'))return Response.redirect(PUBLIC_ORIGIN+url.pathname+url.search,301);
 if(url.pathname==='/robots.txt')return new Response('User-agent: *\\nAllow: /\\nDisallow: /api/\\nSitemap: '+PUBLIC_ORIGIN+'/sitemap.xml\\n',{headers:{'content-type':'text/plain; charset=utf-8'}});
 if(url.pathname==='/sitemap.xml')return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+PUBLIC_ORIGIN+path+'</loc></url>').join('')+'</urlset>',{headers:{'content-type':'application/xml; charset=utf-8'}});
 const response=await application.fetch(request,env,ctx);
 if(!(response.headers.get('content-type')||'').includes('text/html'))return response;
 const headers=new Headers(response.headers);headers.delete('x-robots-tag');
 if(url.hostname!=='hipobuyqcnotes.com')headers.set('x-robots-tag','noindex');
 const canonicalUrl=new URL(PUBLIC_ORIGIN+url.pathname);
 const lang=url.searchParams.get('lang');if(["en", "en-GB", "en-AU", "en-NZ", "en-CA", "zh", "fr", "de", "de-CH", "it", "pl", "pt", "pt-BR", "es", "es-MX", "da", "no", "sv", "ko"].includes(lang)&&lang!=='en')canonicalUrl.searchParams.set('lang',lang);
 const page=Number(url.searchParams.get('page'));if(Number.isSafeInteger(page)&&page>1)canonicalUrl.searchParams.set('page',String(page));
 const canonical=canonicalUrl.href.replaceAll('&','&amp;');
 if(url.searchParams.get('q'))headers.set('x-robots-tag','noindex,follow');
 let html=await response.text(),status=response.status;
 if(url.pathname!=='/'&&['/products','/categories'].includes(url.pathname)||/^\\/(?:category|product)\\/\\d+$/.test(url.pathname)){const rendered=await renderCatalogFallback(html,url);html=rendered.html;status=rendered.status;if(status!==200){headers.set('x-robots-tag','noindex,follow');headers.set('retry-after','60');}}
 if(url.pathname==='/')html=renderHomeFallback(html,lang||'en');
 html=html.replace(/<link\\b[^>]*rel=["']canonical["'][^>]*>/gi,'');
 html=html.replace('</head>','<link rel="canonical" href="'+canonical+'"></head>');
 return new Response(html,{status,headers});
}};\n`;
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/_worker.js',root),code);
await writeFile(new URL('dist/_routes.json',root),JSON.stringify({version:1,include:['/*'],exclude:[]}));
console.log('Built Cloudflare Pages advanced-mode Worker.');
import {writeCrawlerAssets} from './crawler-assets.mjs';

await writeCrawlerAssets({out:'dist',worker:'dist/_worker.js',origin:'https://hipobuyqcnotes.com'});

await import('./prepare-indexnow.mjs');
