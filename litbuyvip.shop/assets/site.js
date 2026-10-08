/* Static multilingual pages: progressive enhancement only. */
(() => {
  'use strict';
  const language = document.documentElement.lang;
  const send = (name, params = {}) => {
    if (!['litbuyvip.shop', 'www.litbuyvip.shop'].includes(location.hostname)) return;
    if (typeof window.gtag === 'function') window.gtag('event', name, {
      site_hostname: 'litbuyvip.shop', content_language: language,
      page_path: location.pathname, transport_type: 'beacon', ...params
    });
  };
  const menu = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  };
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-controls', 'mobileMenu');
  menu?.addEventListener('click', () => {
    const open = document.getElementById('mobileMenu')?.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });
  mobileMenu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.querySelectorAll('.langSelect').forEach(select => select.addEventListener('change', () => {
    const destination = new URL(select.value, location.origin);
    if (destination.origin !== location.origin) return;
    send('language_change', {destination_path: destination.pathname});
    location.assign(destination.pathname);
  }));
  const records = Array.from(document.querySelectorAll('#spreadsheet a.sheet-row')).map(row => {
    const destination = new URL(row.href);
    return {href: row.href, id: destination.searchParams.get('aid'),
      name: row.querySelector('b')?.textContent.trim() || '',
      category: row.children[1]?.textContent.trim() || '',
      image: row.querySelector('img')?.getAttribute('src'),
      price: row.children[2]?.textContent.trim() || '', row};
  });
  const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();
  function search(raw, area) {
    let query = raw.trim();
    // An aid is a catalog record ID. Never reinterpret a marketplace ID as aid.
    try {
      const pasted = new URL(query);
      if (pasted.hostname === 'kakobuymake.com' || pasted.hostname === 'www.kakobuymake.com') {
        query = pasted.searchParams.get('aid') || query;
      }
    } catch (_) { /* Text searches are expected. */ }
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    const found = records.filter(p => tokens.every(t => normalize([p.name,p.category,p.id].join(' ')).includes(t)));
    const list = document.getElementById('mainSearchResults');
    const status = document.getElementById('searchStatus');
    if (list) {
      list.replaceChildren();
      found.forEach(p => {
        const link = document.createElement('a');
        link.className = 'main-search-result';link.href=p.href;link.target='_blank';link.rel='noopener';
        const image=document.createElement('img');image.src=p.image;image.alt=p.name;image.width=70;image.height=70;image.loading='lazy';
        const copy=document.createElement('span');const title=document.createElement('strong');title.textContent=p.name;
        const detail=document.createElement('small');detail.textContent=`ID ${p.id} · ${p.category} · ${p.price}`;
        copy.append(title,detail);link.append(image,copy);list.append(link);
      });
    }
    if (status) status.textContent = found.length ? status.dataset.count + found.length : status.dataset.empty;
    records.forEach(p => {p.row.hidden = !found.includes(p);});
    send('site_search_submit', {search_area:area, result_count:found.length});
    // Search text is intentionally not sent: it may contain a pasted URL or personal data.
    document.getElementById('catalog-search')?.scrollIntoView({behavior:'smooth'});
  }
  document.getElementById('catalogSearchForm')?.addEventListener('submit', event => {
    event.preventDefault();search(document.getElementById('catalogSearchInput').value,'catalog');
  });
  document.getElementById('heroSearchBtn')?.addEventListener('click',()=>search(document.getElementById('heroSearch').value,'hero'));
  document.getElementById('heroSearch')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();search(event.currentTarget.value,'hero');}});
  // Preserve the old QC hash as a navigation shortcut to the accurately named search.
  if(location.hash==='#qc') document.getElementById('catalog-search')?.scrollIntoView();
  document.addEventListener('click', event => {
    const link = event.target.closest('a');if(!link)return;
    const destination=new URL(link.href,location.href);
    if (['kakobuymake.com','www.kakobuymake.com'].includes(destination.hostname)) {
      const aid=destination.searchParams.get('aid');const tid=destination.searchParams.get('tid');
      send('main_catalog_click',{destination_path:destination.pathname,link_type:aid?'product':tid?'category':'catalog'});
      if(aid)send('product_click',{catalog_item_id:aid});
      else if(tid)send('category_click',{catalog_category_id:tid});
    } else if(destination.origin===location.origin && /\/guides\//.test(destination.pathname)) {
      send('guide_click',{guide_path:destination.pathname});
    }
  });
  if(/\/guides\/[^/]+\/?$/.test(location.pathname) && !/\/guides\/index\.html$/.test(location.pathname))send('article_open');
  document.querySelectorAll('.weight-calculator').forEach(calculator=>{
    const compute=()=>{
      const value=name=>Number(calculator.querySelector(`[name="${name}"]`).value);
      const actual=value('actual'),l=value('length'),w=value('width'),h=value('height'),divisor=value('divisor');
      const output=calculator.querySelector('output');
      if(![actual,l,w,h,divisor].every(v=>Number.isFinite(v)&&v>0)){output.textContent='—';return;}
      const volume=l*w*h/divisor;const billed=Math.max(actual,volume);
      const format=n=>new Intl.NumberFormat(language,{maximumFractionDigits:2}).format(n);
      output.textContent=`${output.dataset.actual}: ${format(actual)} kg · ${output.dataset.volume}: ${format(volume)} kg · ${output.dataset.billed}: ${format(billed)} kg`;
    };
    calculator.addEventListener('input',compute);compute();
  });
})();
