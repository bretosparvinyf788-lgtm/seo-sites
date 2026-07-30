(()=>{
  const BUILD='20260730-1748';
  const hashMap={
    '#/spreadsheet':'/spreadsheet/','#/w2c':'/w2c/','#/qc':'/qc/','#/shipping':'/shipping/',
    '#/shipping-usa':'/shipping-usa/','#/shipping-uk':'/shipping-uk/','#/shipping-canada':'/shipping-canada/',
    '#/shipping-australia':'/shipping-australia/','#/coupons':'/coupons/','#/fees':'/fees/',
    '#/guides':'/guides/','#/about':'/about/','#/article/shipping':'/guides/superbuy-shipping-costs-2026/',
    '#/article/qc':'/guides/superbuy-qc-photos/','#/article/w2c':'/guides/superbuy-w2c/'
  };

  if(location.pathname==='/'&&hashMap[location.hash]){
    location.replace(hashMap[location.hash]);
    return;
  }

  const logoSvg="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23e53935'/%3E%3Cpath d='M47 13H27c-8 0-13 4-13 11 0 6 4 9 11 11l9 2c3 1 4 2 4 4 0 3-2 5-7 5H13l-2 8h20c10 0 16-5 16-13 0-6-4-10-12-12l-8-2c-3-1-4-2-4-4 0-2 2-3 6-3h16l2-7Z' fill='white'/%3E%3C/svg%3E";

  document.querySelectorAll('.brand-mark').forEach(mark=>{
    mark.textContent='';
    mark.setAttribute('aria-hidden','true');
    Object.assign(mark.style,{
      width:'40px',height:'40px',borderRadius:'10px',display:'inline-block',flex:'0 0 40px',
      background:'#e53935 url("'+logoSvg+'") center/100% 100% no-repeat',color:'transparent',fontSize:'0',boxShadow:'none'
    });
  });

  document.querySelectorAll('.nav-cta').forEach(link=>{
    link.href='https://kakobuymake.com/';
    link.target='_self';
    link.removeAttribute('rel');
    link.style.pointerEvents='auto';
    link.style.position='relative';
    link.style.zIndex='100';
    link.dataset.build=BUILD;
    link.addEventListener('click',event=>{
      event.preventDefault();
      window.location.assign('https://kakobuymake.com/');
    });
  });

  const toggle=document.querySelector('.mobile-toggle');
  const menu=document.querySelector('.mobile-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',()=>menu.classList.toggle('open'));
    menu.addEventListener('click',()=>menu.classList.remove('open'));
  }
  document.querySelectorAll('.faq-q').forEach(button=>button.addEventListener('click',()=>button.parentElement.classList.toggle('open')));
})();
