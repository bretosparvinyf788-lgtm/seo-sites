(function () {
  'use strict';

  function cleanText(element) {
    return (element.getAttribute('aria-label') || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);
  }

  function send(eventName, parameters) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({
      page_path: window.location.pathname,
      transport_type: 'beacon'
    }, parameters || {}));
  }

  function classifyLink(anchor) {
    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (_) {
      return null;
    }

    if (/^(www\.)?kakobuymake\.com$/.test(url.hostname)) {
      const controller = url.searchParams.get('c');
      const id = url.searchParams.get(controller === 'View' ? 'aid' : 'tid') || 'unknown';
      const eventName = controller === 'View' ? 'product_click' : 'category_click';
      const content = `${controller === 'View' ? 'product' : 'category'}_${id}`;
      url.searchParams.set('utm_source', 'cssbuyvip.org');
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', 'cssbuy_spreadsheet_2026');
      url.searchParams.set('utm_content', content);
      anchor.href = url.toString();
      return { eventName, url, itemId: content, outbound: true };
    }

    if (url.origin === window.location.origin && /^\/guides\/[^/]+\/?$/.test(url.pathname)) {
      return {
        eventName: 'guide_open',
        url,
        itemId: url.pathname.split('/').filter(Boolean).pop(),
        outbound: false
      };
    }

    return null;
  }

  document.addEventListener('click', function (event) {
    const anchor = event.target.closest('a[href]');
    if (anchor) {
      const hit = classifyLink(anchor);
      if (hit) {
        send(hit.eventName, {
          link_url: hit.url.toString(),
          link_text: cleanText(anchor),
          item_id: hit.itemId,
          outbound: hit.outbound
        });
      }
    }

    const guideButton = event.target.closest('.article-open');
    if (guideButton) {
      send('guide_open', {
        link_text: cleanText(guideButton),
        item_id: guideButton.dataset.article || 'embedded_guide',
        outbound: false
      });
    }

    const calculatorButton = event.target.closest('#plan');
    if (calculatorButton) {
      send('calculator_use', {
        destination: document.getElementById('country')?.value || '',
        weight_kg: Number(document.getElementById('weight')?.value || 0),
        parcel_type: document.getElementById('parcel')?.value || '',
        priority: document.getElementById('priority')?.value || ''
      });
    }
  });

  document.addEventListener('change', function (event) {
    const selector = event.target.closest('#language, .mobile-language-select');
    if (!selector) return;
    send('language_change', { language: selector.value || 'unknown' });
  });
}());
