(() => {
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
    fields.forEach((field) => field.addEventListener('input', calculate));
    calculate();
  }
})();
