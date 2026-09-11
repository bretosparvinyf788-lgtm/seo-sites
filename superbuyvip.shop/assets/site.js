(()=>{
  const BUILD='20260911-seo-ctr';
  const send=(name,params={})=>{
    if(typeof window.gtag==='function') window.gtag('event',name,{page_path:location.pathname,...params});
  };
  const hashMap={
    '#/spreadsheet':'/spreadsheet/','#/w2c':'/w2c/','#/qc':'/qc/','#/shipping':'/shipping/',
    '#/shipping-usa':'/shipping-usa/','#/shipping-uk':'/shipping-uk/','#/shipping-canada':'/shipping-canada/',
    '#/shipping-australia':'/shipping-australia/','#/coupons':'/coupons/','#/fees':'/fees/',
    '#/guides':'/guides/','#/about':'/about/','#/article/shipping':'/guides/superbuy-shipping-costs-2026/',
    '#/article/qc':'/guides/superbuy-qc-photos/','#/article/w2c':'/guides/superbuy-w2c/'
  };
  if(location.pathname==='/'&&hashMap[location.hash]){location.replace(hashMap[location.hash]);return;}
  const logoSvg="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23e53935'/%3E%3Cpath d='M47 13H27c-8 0-13 4-13 11 0 6 4 9 11 11l9 2c3 1 4 2 4 4 0 3-2 5-7 5H13l-2 8h20c10 0 16-5 16-13 0-6-4-10-12-12l-8-2c-3-1-4-2-4-4 0-2 2-3 6-3h16l2-7Z' fill='white'/%3E%3C/svg%3E";
  document.querySelectorAll('.brand-mark').forEach(mark=>{
    mark.textContent='';mark.setAttribute('aria-hidden','true');
    Object.assign(mark.style,{width:'40px',height:'40px',borderRadius:'10px',display:'inline-block',flex:'0 0 40px',background:'#e53935 url("'+logoSvg+'") center/100% 100% no-repeat',color:'transparent',fontSize:'0',boxShadow:'none'});
  });
  const toggle=document.querySelector('.mobile-toggle');
  const menu=document.querySelector('.mobile-menu');
  if(toggle&&menu){
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
    menu.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');});
  }
  document.querySelectorAll('.faq-q').forEach(button=>button.addEventListener('click',()=>{
    const item=button.closest('.faq-item');const willOpen=!item.classList.contains('open');
    item.classList.toggle('open',willOpen);button.setAttribute('aria-expanded',String(willOpen));
    if(willOpen)send('faq_expand',{question:(button.querySelector('span')?.textContent||'').trim()});
  }));
  document.querySelectorAll('.search-box').forEach(form=>form.addEventListener('submit',()=>{
    const query=(form.querySelector('[name="keywords"]')?.value||'').trim();
    send('spreadsheet_search',{search_term:query,query_length:query.length});
  }));
  document.querySelectorAll('a[href]').forEach(link=>{
    let url;try{url=new URL(link.href,location.href);}catch{return;}
    if(url.hostname==='kakobuymake.com'){
      url.searchParams.set('utm_source','superbuyvip');
      url.searchParams.set('utm_medium','referral');
      url.searchParams.set('utm_campaign','seo_content');
      url.searchParams.set('utm_content',link.classList.contains('product')||link.classList.contains('directory-item')?'product':link.classList.contains('category')?'category':link.classList.contains('nav-cta')?'nav_cta':'text_link');
      link.href=url.toString();
      link.addEventListener('click',()=>{
        const label=(link.querySelector('b')?.textContent||link.textContent||'').trim().slice(0,100);
        const type=link.classList.contains('product')||link.classList.contains('directory-item')?'product_click':link.classList.contains('category')?'category_click':'outbound_to_kakobuymake';
        send(type,{link_text:label,link_url:url.pathname});
        if(type!=='outbound_to_kakobuymake')send('outbound_to_kakobuymake',{link_text:label,link_type:type});
      });
    }else if(link.classList.contains('guide')){
      link.addEventListener('click',()=>send('guide_open',{guide_path:url.pathname,guide_title:(link.querySelector('strong')?.textContent||'').trim()}));
    }
  });
})();