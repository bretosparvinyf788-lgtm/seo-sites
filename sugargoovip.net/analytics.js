(function(){
  function send(name,params){
    if(typeof window.gtag==='function') window.gtag('event',name,Object.assign({page_path:location.pathname},params||{}));
  }
  document.addEventListener('click',function(event){
    var link=event.target.closest('a');
    if(!link) return;
    var href=link.getAttribute('href')||'';
    var label=(link.textContent||'').trim().replace(/\s+/g,' ').slice(0,100);
    if(/^https?:\/\//.test(href)&&!href.includes(location.hostname)) send('outbound_click',{link_url:href,link_text:label});
    if(href.indexOf('/articles/')===0||href==='/guides') send('guide_click',{link_url:href,link_text:label});
    if(link.closest('.product-card,.product-item,[data-product]')) send('product_click',{link_url:href,link_text:label});
    if(link.closest('[data-language],.language-menu,.lang-menu')) send('language_select',{link_url:href,link_text:label});
  });
  document.addEventListener('toggle',function(event){
    if(event.target.tagName==='DETAILS'&&event.target.open){
      var summary=event.target.querySelector('summary');
      send('faq_open',{faq_question:summary?(summary.textContent||'').trim().slice(0,120):''});
    }
  },true);
  document.addEventListener('change',function(event){
    if(event.target.matches('#weight,#items,[data-pack]')) send('parcel_planner_change',{control_id:event.target.id||event.target.getAttribute('data-pack')||'packing'});
  });
  var sent={};
  function depth(){
    var max=document.documentElement.scrollHeight-innerHeight;
    if(max<=0) return;
    var pct=Math.round(scrollY/max*100);
    [50,90].forEach(function(mark){if(pct>=mark&&!sent[mark]){sent[mark]=true;send('scroll_depth',{percent_scrolled:mark});}});
  }
  addEventListener('scroll',depth,{passive:true});
})();
