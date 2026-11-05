import { handle } from './lib/site.ts';
const staticPaths = new Set(['/site.css','/layout.css','/site.js','/lovegobuy-icon.png']);
export default {
 async fetch(request, env) {
  const u = new URL(request.url);
  if (u.hostname === 'www.lovegobuysheetlab.com' || (u.hostname === 'lovegobuysheetlab.com' && u.protocol !== 'https:')) {
   u.hostname='lovegobuysheetlab.com';u.protocol='https:';return Response.redirect(u.href,301);
  }
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  let response;
  if (staticPaths.has(u.pathname)) response=await env.ASSETS.fetch(request);
  else response=await handle(request);
  if(response.headers.get('content-type')?.includes('text/html')) {
   response=new HTMLRewriter().on('head',{element(head){
    for(const [key,name] of [['GOOGLE_SITE_VERIFICATION','google-site-verification'],['BING_SITE_VERIFICATION','msvalidate.01']]) {
     const value=env[key];if(typeof value==='string'&&/^[A-Za-z0-9_-]+$/.test(value))head.append(`<meta name="${name}" content="${value}">`,{html:true});
    }
    const id=env.GA_MEASUREMENT_ID;
    if(u.hostname==='lovegobuysheetlab.com'&&typeof id==='string'&&/^G-[A-Z0-9]+$/.test(id))head.append(`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`,{html:true});
   }}).transform(response);
  }
  const headers=new Headers(response.headers);headers.set('X-Deployment-Source','seo-sites/lovegobuysheetlab.com');
  return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers});
 }
};
