(function () {
  function sendEvent(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      page_path: window.location.pathname,
      transport_type: 'beacon'
    }, params || {}));
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var target;
    try { target = new URL(link.href, window.location.href); } catch (_) { return; }
    var label = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    var params = {link_url: target.href, link_text: label};

    if (target.hostname === 'kakobuymake.com' && /[?&]aid=\d+/.test(target.search)) {
      sendEvent('product_click', params);
    }
    if (target.origin === window.location.origin && target.pathname === '/cssbuy-spreadsheet/' && window.location.pathname !== '/cssbuy-spreadsheet/') {
      sendEvent('open_spreadsheet', params);
    }
    if (target.origin === window.location.origin && /^\/guides\//.test(target.pathname)) {
      sendEvent('guide_click', params);
    }
    if (target.origin !== window.location.origin) {
      sendEvent('outbound_click', Object.assign({link_domain: target.hostname}, params));
    }
  });

  document.addEventListener('change', function (event) {
    if (!event.target.matches('.lang-select')) return;
    sendEvent('language_change', {language: event.target.value || event.target.textContent});
  });
})();
