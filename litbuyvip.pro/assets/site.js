

document.addEventListener('DOMContentLoaded', function () {
  var headerLogo = document.querySelector('.header-logo');
  var footerLogo = document.querySelector('.footer-logo');
  if (headerLogo && footerLogo) footerLogo.src = headerLogo.src;

  var menuButton = document.querySelector('.menu-button');
  var nav = document.querySelector('.nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  document.querySelectorAll('.faq button').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.faq');
      var wasOpen = item.classList.contains('active');
      document.querySelectorAll('.faq').forEach(function (faq) {
        faq.classList.remove('active');
        var otherButton = faq.querySelector('button');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        var icon = faq.querySelector('button i');
        if (icon) icon.textContent = '+';
      });
      if (!wasOpen) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        var icon = button.querySelector('i');
        if (icon) icon.textContent = '−';
      }
    });
  });

  var form = document.querySelector('.hero-search');
  var input = form && form.querySelector('input');
  var cards = Array.from(document.querySelectorAll('.product-card'));
  var count = document.querySelector('.filter-line > span');
  if (form && input) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var match = card.textContent.toLowerCase().includes(query);
        card.style.display = match ? '' : 'none';
        if (match) visible += 1;
      });
      if (count) count.textContent = visible + ' current main-site finds';
      var finds = document.getElementById('finds');
      if (finds) finds.scrollIntoView({ behavior: 'smooth' });
    });
  }

  var select = document.querySelector('.language select');
  var localePaths = {EN:'/',ES:'/es/',DE:'/de/',FR:'/fr/',PT:'/pt/',IT:'/it/',PL:'/pl/',ZH:'/zh/'};
  if (select) select.addEventListener('change', function () {
    window.location.href = localePaths[select.value] || '/';
  });
});
