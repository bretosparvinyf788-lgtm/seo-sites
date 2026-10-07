(() => {
  const send = (name, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, { ...params, transport_type: 'beacon' });
  };
  const textOf = (element) => (element?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);

  document.addEventListener('click', (event) => {
    const product = event.target.closest('[data-product-url]');
    if (product) {
      const productUrl = product.getAttribute('data-product-url');
      send('product_open', { link_url: productUrl, link_text: textOf(product), page_path: window.location.pathname });
    }
    const link = event.target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    const linkData = { link_url: url.href, link_text: textOf(link), page_path: window.location.pathname };
    if (url.origin !== window.location.origin) {
      send('outbound_click', { ...linkData, link_domain: url.hostname });
    } else if (url.pathname.startsWith('/guides/')) {
      send('guide_open', { ...linkData, guide_path: url.pathname });
    }
    if (link.matches('[data-product-link]')) {
      send('product_open', { ...linkData, link_domain: url.hostname });
    }
    if (link.matches('[data-search-submit], .search-submit')) {
      const input = document.querySelector('input[type="search"], .hero-search input, [data-search-input]');
      send('search_submit', { search_term: (input?.value || '').trim().slice(0, 100), page_path: window.location.pathname });
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const input = form.querySelector('input[type="search"], [name="q"], [name="keywords"], [data-search-input]');
    if (!input) return;
    send('search_submit', { search_term: (input.value || '').trim().slice(0, 100), page_path: window.location.pathname });
  });

  let calculatorRecorded = false;
  document.addEventListener('input', (event) => {
    if (calculatorRecorded || !event.target.closest('.calc-box')) return;
    calculatorRecorded = true;
    send('calculator_use', { calculator_name: 'chargeable_weight', page_path: window.location.pathname });
  });
})();
