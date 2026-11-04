import app from './app/index.js';
import config from './config.js';
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  const productionHost=url.hostname===new URL(config.origin).hostname;
  if(url.hostname==='www.cssbuyfindshub.com')return Response.redirect(config.origin+url.pathname+url.search,301);
  const response=await app.fetch(request,env,ctx);
  const headers=new Headers(response.headers);
  if(!productionHost||url.pathname.startsWith('/api/'))headers.set('X-Robots-Tag','noindex, nofollow');
  let result=new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  if(response.headers.get('content-type')?.includes('text/html')){
   const additions=[];
   if(config.googleSiteVerification)additions.push(`<meta name="google-site-verification" content="${config.googleSiteVerification}">`);
   if(config.bingSiteVerification)additions.push(`<meta name="msvalidate.01" content="${config.bingSiteVerification}">`);
   if(productionHost&&/^G-[A-Z0-9]+$/.test(config.analyticsMeasurementId)){
    const id=config.analyticsMeasurementId;
    additions.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`);
   }
   if(additions.length)result=new HTMLRewriter().on('head',{element(e){e.append(additions.join(''),{html:true});}}).transform(result);
  }
  return result;
 }
};
