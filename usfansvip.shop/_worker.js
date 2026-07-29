const mobileFixCss = `
@media (max-width:680px){
  #categories .collection-grid{
    display:grid!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:8px!important;
    margin:0!important;
    padding:0!important;
    overflow:visible!important;
    scroll-snap-type:none!important;
  }
  #categories .collection-card{
    min-width:0!important;
    width:100%!important;
    min-height:174px!important;
    border-radius:16px!important;
    scroll-snap-align:none!important;
  }
  #categories .collection-top{left:9px!important;right:9px!important;top:9px!important;gap:5px!important}
  #categories .collection-icon{width:31px!important;height:31px!important;border-radius:10px!important}
  #categories .collection-icon svg{width:17px!important;height:17px!important}
  #categories .collection-index{font-size:7px!important}
  #categories .collection-arrow{width:27px!important;height:27px!important;font-size:11px!important}
  #categories .collection-copy{left:10px!important;right:10px!important;bottom:10px!important}
  #categories .collection-copy h3{font-size:14px!important;line-height:1.08!important}
  #categories .collection-copy p{margin:4px 0 0!important;font-size:8px!important;line-height:1.25!important}
  #categories .collection-copy>span{display:none!important}
  #categories .collection-actions{margin-top:14px!important}

  #finds .product-grid{
    display:grid!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:9px!important;
    margin:0!important;
    padding:0!important;
    overflow:visible!important;
    scroll-snap-type:none!important;
  }
  #finds .product-card{min-width:0!important;width:100%!important;scroll-snap-align:none!important;border-radius:16px!important}
  #finds .product-image{aspect-ratio:1/1!important}
  #finds .product-no,#finds .product-category{top:6px!important;padding:4px 6px!important;font-size:7px!important}
  #finds .product-no{left:6px!important}
  #finds .product-category{right:6px!important;max-width:60%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
  #finds .product-body{min-height:118px!important;padding:10px!important}
  #finds .product-body small{font-size:7px!important}
  #finds .product-body h3{font-size:12px!important;line-height:1.22!important;margin:5px 0 10px!important}
  #finds .product-foot{align-items:flex-start!important;flex-direction:column!important;gap:2px!important;padding-top:8px!important}
  #finds .product-foot strong{font-size:15px!important}
  #finds .product-foot span{font-size:7px!important}

  #tools .tool-buttons{
    display:grid!important;
    grid-template-columns:1fr!important;
    gap:7px!important;
    overflow:visible!important;
    margin-right:0!important;
    padding-right:0!important;
  }
  #tools .tool-button{min-width:0!important;width:100%!important;min-height:46px!important}
  #tools .tool-stage{min-width:0!important;width:100%!important;overflow:visible!important;padding:20px 15px!important}
  #tools .tool-panel{min-width:0!important;width:100%!important}
  #tools .tool-direct-grid{grid-template-columns:1fr!important;gap:8px!important}
  #tools .tool-direct-card{min-width:0!important;width:100%!important;min-height:88px!important;padding:13px!important}
  #tools .qc-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  #tools .dims{grid-template-columns:1fr!important}
  #tools .field input{min-width:0!important;width:100%!important}
}
`;

const walletImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900' viewBox='0 0 900 900'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23ead9c5'/%3E%3Cstop offset='1' stop-color='%23d8e5de'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='900' rx='48' fill='url(%23g)'/%3E%3Crect x='160' y='270' width='580' height='330' rx='64' fill='%23fff' fill-opacity='.52'/%3E%3Ctext x='450' y='455' text-anchor='middle' font-family='Arial' font-size='58' font-weight='700' fill='%2318211f'%3EWallet + Belt%3C/text%3E%3C/svg%3E`;
const pantsImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900' viewBox='0 0 900 900'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23d8e2ed'/%3E%3Cstop offset='1' stop-color='%23eee2d6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='900' rx='48' fill='url(%23g)'/%3E%3Cpath d='M310 180h280l65 540H505l-55-265-55 265H245z' fill='%2318211f' fill-opacity='.23'/%3E%3Ctext x='450' y='790' text-anchor='middle' font-family='Arial' font-size='54' font-weight='700' fill='%2318211f'%3EGallery Pants%3C/text%3E%3C/svg%3E`;

const extraProducts = `
<a aria-label="Wallet + belt set" class="product-card" data-filter="accessories" data-search="wallet belt set leather accessories" href="https://kakobuymake.com/?a=index&amp;aid=2990&amp;c=View&amp;m=home" rel="noopener" target="_blank">
  <div class="product-image"><img alt="Wallet and belt set product image" loading="lazy" src="${walletImage}"/><span class="product-no">09</span><span class="product-category">Accessories</span></div>
  <div class="product-body"><div><small>Selected product</small><h3>Wallet + belt set</h3></div><div class="product-foot"><strong>$10</strong><span>Open product ↗</span></div></div>
</a>
<a aria-label="Gallery Dept pants" class="product-card" data-filter="bottoms" data-search="gallery dept pants bottoms trousers streetwear" href="https://kakobuymake.com/?a=index&amp;aid=2987&amp;c=View&amp;m=home" rel="noopener" target="_blank">
  <div class="product-image"><img alt="Gallery Dept pants product image" loading="lazy" src="${pantsImage}"/><span class="product-no">10</span><span class="product-category">Bottoms</span></div>
  <div class="product-body"><div><small>Selected product</small><h3>Gallery Dept pants</h3></div><div class="product-foot"><strong>$18</strong><span>Open product ↗</span></div></div>
</a>`;

class HeadHandler {
  element(element) {
    element.append(`<style id="usfansvip-mobile-grid-fix">${mobileFixCss}</style>`, { html: true });
  }
}

class ProductGridHandler {
  element(element) {
    element.append(extraProducts, { html: true });
  }
}

class AllFilterHandler {
  element(element) {
    element.setInnerContent('All 10');
  }
}

class FeaturedCountHandler {
  element(element) {
    element.setInnerContent('Open the ten selected product cards');
  }
}

class AccessoriesFilterHandler {
  element(element) {
    element.append(`<button class="filter" onclick="filterProducts('accessories',this)">Accessories</button>`, { html: true });
  }
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const type = response.headers.get('content-type') || '';

    if (!type.includes('text/html') || (url.pathname !== '/' && url.pathname !== '/index.html')) {
      return response;
    }

    return new HTMLRewriter()
      .on('head', new HeadHandler())
      .on('#productGrid', new ProductGridHandler())
      .on('#finds .filter.active', new AllFilterHandler())
      .on('#finds .filters', new AccessoriesFilterHandler())
      .on('#searchTool .tool-direct-card:first-child small', new FeaturedCountHandler())
      .transform(response);
  }
};
