(function () {
  'use strict';

  const sent = new Set();

  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      page_path: window.location.pathname
    }, params || {}));
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    const faqButton = event.target.closest('.faq-item button');

    if (faqButton) {
      send('faq_expand', {
        faq_question: (faqButton.querySelector('strong') || faqButton).textContent.trim(),
        expanded: faqButton.getAttribute('aria-expanded') !== 'true'
      });
    }

    if (!link) return;

    const href = link.href;
    const label = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);

    if (link.classList.contains('product-card')) {
      send('product_click', { link_url: href, link_text: label });
    } else if (link.classList.contains('category-row')) {
      send('category_click', { link_url: href, link_text: label });
    } else if (/\/guides\//.test(link.pathname) && link.hostname === window.location.hostname) {
      send('guide_open', { link_url: href, link_text: label });
    }

    if (/^(www\.)?kakobuymake\.com$/i.test(link.hostname)) {
      send('outbound_kakobuy_click', { link_url: href, link_text: label });
      if (!link.classList.contains('product-card') && !link.classList.contains('category-row')) {
        send('spreadsheet_cta_click', { link_url: href, link_text: label });
      }
    }
  });

  const search = document.querySelector('#search');
  if (search) {
    let searchTimer;
    search.addEventListener('input', function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        const term = search.value.trim().toLowerCase();
        if (term.length > 1) send('onsite_search', { search_term: term.slice(0, 80) });
      }, 800);
    });
  }

  const language = document.querySelector('#lang');
  if (language) {
    language.addEventListener('change', function () {
      send('language_change', { language: language.value });
    });
  }

  const crumbs = document.querySelector('.crumbs');
  const hasBreadcrumbData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .some(function (script) { return script.textContent.indexOf('BreadcrumbList') !== -1; });
  if (crumbs && !hasBreadcrumbData) {
    const elements = [];
    let position = 1;
    crumbs.querySelectorAll('a, span').forEach(function (node) {
      const name = node.textContent.trim();
      if (!name || name === '/') return;
      const item = node.matches('a') ? node.href : (document.querySelector('link[rel="canonical"]') || {}).href;
      if (!item) return;
      elements.push({ '@type': 'ListItem', position: position++, name: name, item: item });
    });
    if (elements.length > 1) {
      const schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: elements
      });
      document.head.appendChild(schema);
    }
  }

  window.addEventListener('scroll', function () {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0 && window.scrollY / total >= 0.75 && !sent.has('scroll_75')) {
      sent.add('scroll_75');
      send('scroll_75');
    }
  }, { passive: true });
})();
