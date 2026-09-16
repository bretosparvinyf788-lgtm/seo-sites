(function(){
  function track(name,params){
    if(typeof window.gtag==='function') window.gtag('event',name,params||{});
  }
  function cleanText(node){return (node&&node.textContent||'').trim().replace(/\s+/g,' ').slice(0,100)}
  document.addEventListener('click',function(event){
    const target=event.target.closest('a,button');
    if(!target)return;
    const href=target.href||'';
    const params={link_text:cleanText(target),link_url:href||undefined,page_path:location.pathname};
    if(target.closest('.product-card')) track('product_click',params);
    else if(target.matches('[data-filter],.category-card')||target.closest('.category-card,.category-links')) track('category_click',params);
    else if(target.closest('.guide-card,.archive-card,.related-guides')||href.includes('/guides/')) track('guide_click',params);
    else if(href.includes('/litbuy-spreadsheet/')) track('spreadsheet_click',params);
    else if(href.includes('/litbuy-qc-finder/')) track('qc_finder_click',params);
    else if(href.includes('/litbuy-shipping-calculator/')) track('shipping_calculator_click',params);
    if(href.includes('kakobuymake.com')) track('main_site_click',params);
    if(target.matches('[data-lang],.language-option')) track('language_change',{language:target.dataset.lang||cleanText(target)});
  });
  const qcButton=document.getElementById('qcButton')||document.getElementById('landingQcButton');
  if(qcButton)qcButton.addEventListener('click',function(){
    const input=document.getElementById('qcQuery')||document.getElementById('landingQcQuery');
    track('qc_finder_use',{query_length:(input&&input.value||'').trim().length,page_path:location.pathname});
  });
  let calculatorTracked=false;
  ['actualWeight','parcelLength','parcelWidth','parcelHeight','parcelDivisor','exampleRate','landingActual','landingLength','landingWidth','landingHeight','landingDivisor'].forEach(function(id){
    const field=document.getElementById(id);
    if(field)field.addEventListener('change',function(){
      if(!calculatorTracked){track('shipping_calculator_use',{page_path:location.pathname});calculatorTracked=true;}
    });
  });
  const requested=new URLSearchParams(location.search).get('category');
  if(requested&&location.pathname==='/'){
    const button=[...document.querySelectorAll('[data-filter]')].find(function(el){return el.dataset.filter.toLowerCase()===requested.toLowerCase()});
    if(button)setTimeout(function(){button.click()},0);
  }
})();
