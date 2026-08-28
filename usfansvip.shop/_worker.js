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

const latestGuidesHtml = `<a class="guide" href="/guides/usfans-1688-buying-guide-moq-domestic-freight-qc-2026.html"><small>1688 Buying · 28 August 2026</small><h3>USFans 1688 Buying Guide 2026: MOQ, Domestic Freight &amp; QC Rules Before You Order</h3><p>Read MOQ, Chinese domestic freight, variations, 1688-specific QC, return timing and parcel economics before placing a supplier-style order.</p><span>Read English guide →</span></a><a class="guide" href="/guides/usfans-restricted-items-sensitive-goods-shipping-guide-2026.html"><small>Restricted Goods · 26 August 2026</small><h3>USFans Restricted Items Guide 2026: Batteries, Liquids, Cosmetics &amp; Food Before You Buy</h3><p>Screen batteries, liquids, cosmetics, food, glass, blades and other sensitive goods before payment, then match route and destination rules.</p><span>Read English guide →</span></a><a class="guide" href="/guides/usfans-order-processing-payment-remarks-enquiry-guide-2026.html"><small>Order Processing · 24 August 2026</small><h3>USFans Order Processing Guide 2026: Payments, Remarks &amp; Order Enquiry Before Warehouse Arrival</h3><p>Use payment, Chinese domestic delivery, concise remarks, order enquiry, purchasing hours, warehouse QC and return timing as clear control points.</p><span>Read English guide →</span></a>`;

class HeadHandler {
  element(element) {
    element.append(`<style id="usfansvip-mobile-grid-fix">${mobileFixCss}</style>`, { html: true });
  }
}

class GuidesHandler {
  element(element) {
    element.setInnerContent(latestGuidesHtml, { html: true });
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
      .on('#guides .guide-grid', new GuidesHandler())
      .transform(response);
  }
};
