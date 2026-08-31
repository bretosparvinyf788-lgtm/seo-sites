const BUILD='20260817-0945';
const SECURITY_HEADERS={
  'x-content-type-options':'nosniff',
  'referrer-policy':'strict-origin-when-cross-origin',
  'permissions-policy':'camera=(), microphone=(), geolocation=()',
  'x-frame-options':'SAMEORIGIN',
  'x-superbuyvip-build':BUILD
};

const HASH_REPLACEMENTS=[
  ['/#/spreadsheet','/spreadsheet/'],['#/spreadsheet','/spreadsheet/'],
  ['/#/w2c','/w2c/'],['#/w2c','/w2c/'],
  ['/#/qc','/qc/'],['#/qc','/qc/'],
  ['/#/shipping','/shipping/'],['#/shipping','/shipping/'],
  ['/#/shipping-usa','/shipping-usa/'],['#/shipping-usa','/shipping-usa/'],
  ['/#/shipping-uk','/shipping-uk/'],['#/shipping-uk','/shipping-uk/'],
  ['/#/shipping-canada','/shipping-canada/'],['#/shipping-canada','/shipping-canada/'],
  ['/#/shipping-australia','/shipping-australia/'],['#/shipping-australia','/shipping-australia/'],
  ['/#/coupons','/coupons/'],['#/coupons','/coupons/'],
  ['/#/fees','/fees/'],['#/fees','/fees/'],
  ['/#/guides','/guides/'],['#/guides','/guides/'],
  ['/#/about','/about/'],['#/about','/about/'],
  ['/#/article/shipping','/guides/superbuy-shipping-costs-2026/'],['#/article/shipping','/guides/superbuy-shipping-costs-2026/'],
  ['/#/article/qc','/guides/superbuy-qc-photos/'],['#/article/qc','/guides/superbuy-qc-photos/'],
  ['/#/article/w2c','/guides/superbuy-w2c/'],['#/article/w2c','/guides/superbuy-w2c/']
];

function headersFor(response){
  const headers=new Headers(response.headers);
  for(const[name,value]of Object.entries(SECURITY_HEADERS))headers.set(name,value);
  headers.set('cache-control','no-cache, no-store, must-revalidate');
  headers.set('pragma','no-cache');
  headers.set('expires','0');
  return headers;
}

async function transformHtml(response,method){
  let html=await response.text();
  for(const[from,to]of HASH_REPLACEMENTS){
    html=html.split(`href="${from}"`).join(`href="${to}"`).split(`href='${from}'`).join(`href='${to}'`);
  }

  html=html
    .replace(/<a class="nav-cta" href="[^"]*"(?: target="_blank")?(?: rel="noopener")?>Browse Finds ↗<\/a>/g,'<a class="nav-cta" href="https://kakobuymake.com/">Browse Finds ↗</a>')
    .replace(/href="\/assets\/site\.css(?:\?[^\"]*)?"/g,`href="/assets/site.css?v=${BUILD}"`)
    .replace(/src="\/assets\/site\.js(?:\?[^\"]*)?"/g,`src="/assets/site.js?v=${BUILD}"`)
    .replace(/<link rel="stylesheet" href="\/assets\/header-fix\.css[^\"]*">\s*/g,'')
    .replace('</head>',`<link rel="stylesheet" href="/assets/header-fix.css?v=${BUILD}">\n</head>`);

  return new Response(method==='HEAD'?null:html,{
    status:response.status,
    statusText:response.statusText,
    headers:headersFor(response)
  });
}

export default{
  async fetch(request,env){
    const url=new URL(request.url);

    if(url.protocol==='http:'||url.hostname==='www.superbuyvip.shop'){
      url.protocol='https:';
      url.hostname='superbuyvip.shop';
      return Response.redirect(url.toString(),301);
    }

    if((request.method==='GET'||request.method==='HEAD')&&url.pathname!=='/'&&!url.pathname.endsWith('/')&&!url.pathname.split('/').pop().includes('.')){
      url.pathname+='/';
      return Response.redirect(url.toString(),301);
    }

    let response=await env.ASSETS.fetch(request);
    if(response.status===404&&url.pathname.endsWith('/')){
      const assetUrl=new URL(request.url);
      assetUrl.pathname=url.pathname+'index.html';
      response=await env.ASSETS.fetch(new Request(assetUrl.toString(),request));
    }

    if(response.status===404){
      return new Response('Not found',{status:404,headers:{'content-type':'text/plain; charset=UTF-8',...SECURITY_HEADERS}});
    }

    const type=response.headers.get('content-type')||'';
    if(type.includes('text/html'))return transformHtml(response,request.method);

    return new Response(request.method==='HEAD'?null:response.body,{
      status:response.status,
      statusText:response.statusText,
      headers:headersFor(response)
    });
  }
};
