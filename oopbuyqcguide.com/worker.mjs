import { handle } from './lib/site.ts';
export default {
  async fetch(request, env) {
    const u = new URL(request.url);
    if (u.hostname === 'www.oopbuyqcguide.com' || (u.hostname === 'oopbuyqcguide.com' && u.protocol !== 'https:')) {
      u.hostname = 'oopbuyqcguide.com'; u.protocol = 'https:';
      return Response.redirect(u.href, 301);
    }
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405, headers:{Allow:'GET, HEAD'}});
    if (/^\/(?:favicon(?:-16|-32)?\.(?:png|svg|ico)|apple-touch-icon\.png|oopbuy-logo\.png|site\.(?:css|js)|guide\/[^/]+\.png|qc-repairs\/\d+\/[^/]+\.webp)$/.test(u.pathname)) return env.ASSETS.fetch(request);
    let response = await handle(request);
    if (response.headers.get('content-type')?.includes('text/html')) {
      response = new HTMLRewriter().on('head', {element(head) {
        for (const [key,name] of [['GOOGLE_SITE_VERIFICATION','google-site-verification'],['BING_SITE_VERIFICATION','msvalidate.01']]) {
          const value=env[key];
          if (typeof value==='string' && /^[A-Za-z0-9_-]+$/.test(value)) head.append(`<meta name="${name}" content="${value}">`,{html:true});
        }
        const id=env.GA_MEASUREMENT_ID;
        if (u.hostname==='oopbuyqcguide.com' && typeof id==='string' && /^G-[A-Z0-9]+$/.test(id)) head.append(`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`,{html:true});
      }}).transform(response);
    }
    if(request.method==='HEAD') return new Response(null,{status:response.status,headers:response.headers});
    return response;
  }
};
