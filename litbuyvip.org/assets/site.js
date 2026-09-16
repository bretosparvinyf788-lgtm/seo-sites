(() => {
  const track = (eventName, parameters = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      transport_type: 'beacon',
      ...parameters,
    });
  };

  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.nav');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menu.classList.toggle('active', Boolean(open));
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu?.classList.remove('active');
      menu?.setAttribute('aria-expanded', 'false');
    });
  });

  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    item.querySelector('button')?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      faqItems.forEach((candidate) => {
        candidate.classList.remove('open');
        const button = candidate.querySelector('button');
        button?.setAttribute('aria-expanded', 'false');
        const icon = button?.querySelector('i');
        if (icon) icon.textContent = '+';
      });
      if (willOpen) {
        item.classList.add('open');
        const button = item.querySelector('button');
        button?.setAttribute('aria-expanded', 'true');
        const icon = button?.querySelector('i');
        if (icon) icon.textContent = '−';
        track('faq_open', { faq_question: item.querySelector('b')?.textContent?.trim() || 'unknown' });
      }
    });
  });

  const calculator = document.querySelector('.calculator');
  if (calculator) {
    const fields = [...calculator.querySelectorAll('input, select')];
    const outputs = calculator.querySelectorAll('.calc-result b');
    const calculate = () => {
      const [actual, length, width, height, divisor] = fields.map((field) => Number(field.value) || 0);
      const dimensional = divisor ? (length * width * height) / divisor : 0;
      const planning = Math.max(actual, dimensional);
      if (outputs[0]) outputs[0].textContent = `${dimensional.toFixed(2)} kg`;
      if (outputs[1]) outputs[1].textContent = `${planning.toFixed(2)} kg`;
    };
    let trackedCalculator = false;
    fields.forEach((field) => field.addEventListener('input', () => {
      calculate();
      if (!trackedCalculator) {
        track('shipping_calculator_use');
        trackedCalculator = true;
      }
    }));
    calculate();
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    const text = link.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100) || 'unlabelled';
    if (url.hostname === 'kakobuymake.com') {
      const type = link.classList.contains('product-card') ? 'product' :
        link.classList.contains('category-card') ? 'category' : 'sheet';
      track('outbound_sheet_click', { link_type: type, link_text: text, destination_path: url.pathname });
    } else if (url.origin === window.location.origin && url.pathname.startsWith('/guides/')) {
      track('guide_click', { link_text: text, destination_path: url.pathname });
    }
  });

  document.querySelectorAll('.language-select select').forEach((select) => {
    select.addEventListener('change', () => {
      if (!select.value) return;
      track('language_change', { destination_path: select.value });
      window.location.href = select.value;
    });
  });

  const reached = new Set();
  const trackDepth = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (height <= 0) return;
    const percent = Math.round((window.scrollY / height) * 100);
    [50, 90].forEach((depth) => {
      if (percent >= depth && !reached.has(depth)) {
        reached.add(depth);
        track('scroll_depth', { percent_scrolled: depth });
      }
    });
  };
  window.addEventListener('scroll', trackDepth, { passive: true });
})();
