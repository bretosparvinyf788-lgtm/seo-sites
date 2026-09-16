(function () {
  'use strict';

  const campaign = 'cssbuy_spreadsheet';

  function textOf(anchor) {
    return (anchor.getAttribute('aria-label') || anchor.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);
  }

  function send(name, anchor, extra) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      link_url: anchor && anchor.href ? anchor.href : window.location.href,
      link_text: anchor ? textOf(anchor) : '',
      page_path: window.location.pathname,
      transport_type: 'beacon'
    }, extra || {}));
  }

  function classify(anchor) {
    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (_) {
      return null;
    }

    if (url.hostname === 'kakobuymake.com' || url.hostname === 'www.kakobuymake.com') {
      const controller = url.searchParams.get('c');
      let eventName = 'spreadsheet_click';
      let content = 'spreadsheet';
      if (controller === 'View') {
        eventName = 'product_click';
        content = 'product_' + (url.searchParams.get('aid') || 'unknown');
      } else if (controller === 'Lists') {
        eventName = 'category_click';
        content = 'category_' + (url.searchParams.get('tid') || 'unknown');
      }

      url.searchParams.set('utm_source', 'cssbuyvip.com');
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', campaign);
      url.searchParams.set('utm_content', content);
      anchor.href = url.toString();
      return { eventName, extra: { outbound: true, item_id: content } };
    }

    if (url.origin === window.location.origin &&
        (/^\/guides\//.test(url.pathname) ||
         url.pathname === '/all-seo-articles/' ||
         /^\/(?:best-)?cssbuy-/.test(url.pathname) ||
         url.pathname === '/how-to-check-cssbuy-qc-photos')) {
      return { eventName: 'guide_click', extra: { outbound: false } };
    }

    return null;
  }

  function bind() {
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      if (anchor.dataset.analyticsBound === 'true') return;
      const classification = classify(anchor);
      if (!classification) return;
      anchor.dataset.analyticsBound = 'true';
      anchor.addEventListener('click', function () {
        send(classification.eventName, anchor, classification.extra);
      });
    });

    document.querySelectorAll('.langs a, .lang-switch a').forEach(function (anchor) {
      if (anchor.dataset.languageAnalyticsBound === 'true') return;
      anchor.dataset.languageAnalyticsBound = 'true';
      anchor.addEventListener('click', function () {
        let language = anchor.getAttribute('data-lang') || textOf(anchor).toLowerCase();
        if (language === '中') language = 'zh';
        send('language_change', anchor, { language: language });
      });
    });

    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    if (requestedLanguage && typeof window.i18nApply === 'function' &&
        /^(en|es|de|fr|zh)$/.test(requestedLanguage)) {
      window.i18nApply(requestedLanguage);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
}());
