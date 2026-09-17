(() => {
  const sent = new Set();
  const textOf = element => (element?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  const send = (name, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, {...params, page_path: location.pathname, transport_type: 'beacon'});
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = new URL(link.href, location.href);
    const details = {link_text: textOf(link), link_url: href.href.slice(0, 300)};
    if (link.matches('.product-card')) return send('product_click', details);
    if (href.hostname === 'kakobuymake.com' && /(?:tid=1|\/spreadsheet)/.test(href.href)) return send('open_spreadsheet', details);
    if (href.origin === location.origin && href.pathname.startsWith('/guides/')) return send('guide_open', details);
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const input = form.querySelector('input[type="search"], #hero-query');
    if (input?.value.trim()) send('site_search', {search_term: input.value.trim().slice(0, 100)});
  });
  document.addEventListener('change', event => {
    if (event.target.matches('#language')) send('language_change', {language: event.target.value});
  });
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) send('faq_expand', {item_name: textOf(detail.querySelector('summary'))});
  }));
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max > 0 && scrollY / max >= .75 && !sent.has('scroll_75')) {
      sent.add('scroll_75');
      send('scroll_75');
    }
  }, {passive: true});
})();
