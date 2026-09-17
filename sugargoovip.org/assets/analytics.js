(() => {
  const sendEvent = (name, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, {
      ...params,
      page_path: window.location.pathname,
      transport_type: 'beacon'
    });
  };

  const cleanText = element => (element?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);

  document.addEventListener('click', event => {
    const faqButton = event.target.closest('.faq-q');
    if (faqButton) {
      queueMicrotask(() => {
        if (faqButton.getAttribute('aria-expanded') === 'true') {
          sendEvent('faq_open', { item_name: cleanText(faqButton) });
        }
      });
    }

    const categoryControl = event.target.closest('[data-category]');
    if (categoryControl) {
      sendEvent('category_click', {
        item_name: categoryControl.dataset.category || cleanText(categoryControl)
      });
    }

    const link = event.target.closest('a[href]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const details = {
      link_text: cleanText(link),
      link_url: url.href.slice(0, 300)
    };

    if (link.matches('.product-card, .product-link') || link.closest('.product-card, .product-link')) {
      sendEvent('product_click', details);
      return;
    }

    if (link.matches('.category-card') && !categoryControl) {
      sendEvent('category_click', details);
      return;
    }

    if (url.origin === window.location.origin && url.pathname.startsWith('/guides/')) {
      sendEvent('guide_click', details);
      return;
    }

    if (url.origin === window.location.origin && url.pathname.startsWith('/spreadsheet/')) {
      sendEvent('spreadsheet_open', details);
      return;
    }

    if (url.origin !== window.location.origin) {
      sendEvent('outbound_click', {
        ...details,
        link_domain: url.hostname
      });
    }
  });

  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const searchInput = form.querySelector('input[type="search"], input[name="q"]');
    if (searchInput?.value.trim()) {
      sendEvent('search', { search_term: searchInput.value.trim().slice(0, 100) });
    }
  });

  document.addEventListener('change', event => {
    const control = event.target;
    if (control.matches('#language, [name="language"]')) {
      sendEvent('language_change', { language: control.value });
    }
    if (control.closest('.controls') && !control.matches('input[type="search"]')) {
      sendEvent('filter_use', {
        filter_name: control.id || control.name || control.type,
        filter_value: String(control.value).slice(0, 80)
      });
    }
  });
})();
