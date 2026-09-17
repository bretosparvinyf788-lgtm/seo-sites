(function () {
  'use strict';

  function send(name, parameters) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({ transport_type: 'beacon' }, parameters || {}));
  }

  document.addEventListener('click', function (event) {
    var element = event.target.closest('a,button');
    if (!element) return;

    if (element.matches('.faq-q')) {
      send('faq_open', { faq_question: (element.textContent || '').trim().slice(0, 100) });
      return;
    }

    if (element.matches('.v21-lang-option')) {
      send('language_change', { language: element.getAttribute('data-lang') || 'unknown' });
      return;
    }

    if (element.matches('.calcbtn')) {
      send('calculator_use', { calculator_name: 'shipping_weight' });
      return;
    }

    if (element.tagName !== 'A') return;
    var href = element.getAttribute('href') || '';
    var label = (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100);

    if (/kakobuymake\.com/i.test(href)) {
      send('product_click', { link_url: href, link_text: label, content_group: 'w2c_finds' });
    } else if (/^\/?oopbuy-[a-z0-9-]+/.test(href) || href.indexOf('/guides') === 0) {
      send('guide_click', { link_url: href, link_text: label });
    } else if (href.charAt(0) === '#') {
      send('navigation_click', { destination: href, link_text: label });
    }
  });

  document.addEventListener('submit', function (event) {
    if (event.target.matches('#v21SearchForm')) {
      var input = event.target.querySelector('input[type="search"]');
      send('search', { search_term: input ? input.value.trim().slice(0, 100) : '' });
    } else if (event.target.matches('.newsletter')) {
      send('newsletter_signup_intent', { form_location: 'footer' });
    }
  });
})();
