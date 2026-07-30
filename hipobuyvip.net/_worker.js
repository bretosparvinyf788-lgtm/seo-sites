const ARTICLE_LINKS = {
  'how-to-use-hipobuy-spreadsheet-2026': '/articles/how-to-use-hipobuy-spreadsheet-2026.html',
  'are-hipobuy-qc-photos-free': '/articles/are-hipobuy-qc-photos-free.html',
  'how-hipobuy-shipping-cost-works': '/articles/how-hipobuy-shipping-cost-works.html'
};

class LinkRewriter {
  constructor(href, attributesToRemove = []) {
    this.href = href;
    this.attributesToRemove = attributesToRemove;
  }

  element(element) {
    element.setAttribute('href', this.href);
    for (const attribute of this.attributesToRemove) {
      element.removeAttribute(attribute);
    }
  }
}

class CalculatorHeadingRewriter {
  element(element) {
    element.setInnerContent('HipoBuy Chargeable Weight Calculator');
  }
}

class CalculatorNoteInjector {
  element(element) {
    element.after(
      '<p id="chargeableWeightScopeNote" class="calculator-scope-note">Estimates chargeable weight only, not the final shipping price.</p>',
      { html: true }
    );
  }
}

class HeadInjector {
  element(element) {
    element.append(
      '<style>.calculator-scope-note{margin:-8px 0 20px;color:#607392;font-size:13px;line-height:1.55}.footer-links a[href^="/"]{text-decoration-thickness:1px;text-underline-offset:3px}</style>',
      { html: true }
    );
  }
}

class BodyInjector {
  element(element) {
    element.append(
      `<script>
(() => {
  const calculatorLabels = {
    en: 'HipoBuy Chargeable Weight Calculator',
    zh: 'HipoBuy 计费重量计算器',
    'zh-Hant': 'HipoBuy 計費重量計算器',
    es: 'Calculadora de peso facturable de HipoBuy',
    de: 'HipoBuy-Rechner für abrechnungsfähiges Gewicht',
    fr: 'Calculateur de poids facturable HipoBuy',
    pt: 'Calculadora de peso faturável HipoBuy',
    it: 'Calcolatore del peso addebitabile HipoBuy',
    ja: 'HipoBuy 課金重量計算機',
    ko: 'HipoBuy 청구 중량 계산기',
    ru: 'Калькулятор оплачиваемого веса HipoBuy'
  };

  const scopeNotes = {
    en: 'Estimates chargeable weight only, not the final shipping price.',
    zh: '仅估算计费重量，不代表最终国际运费。',
    'zh-Hant': '僅估算計費重量，不代表最終國際運費。',
    es: 'Solo estima el peso facturable, no el precio final del envío.',
    de: 'Schätzt nur das abrechnungsfähige Gewicht, nicht den endgültigen Versandpreis.',
    fr: 'Estime uniquement le poids facturable, pas le prix final de l’expédition.',
    pt: 'Estima apenas o peso faturável, não o preço final do frete.',
    it: 'Stima solo il peso addebitabile, non il prezzo finale della spedizione.',
    ja: '課金重量のみを推定し、最終送料を示すものではありません。',
    ko: '청구 중량만 추정하며 최종 배송비를 의미하지 않습니다.',
    ru: 'Оценивает только оплачиваемый вес, а не окончательную стоимость доставки.'
  };

  function refreshCalculatorCopy(language) {
    const selected = language || document.getElementById('languageSelect')?.value || 'en';
    const heading = document.querySelector('#shipping .calculator > h3');
    const note = document.getElementById('chargeableWeightScopeNote');
    if (heading) heading.textContent = calculatorLabels[selected] || calculatorLabels.en;
    if (note) note.textContent = scopeNotes[selected] || scopeNotes.en;
  }

  document.addEventListener('DOMContentLoaded', () => refreshCalculatorCopy(), { once: true });
  document.addEventListener('hipobuyvip:languagechange', event => {
    refreshCalculatorCopy(event.detail?.language);
  });
})();
</script>`,
      { html: true }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      return response;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    let rewriter = new HTMLRewriter()
      .on('head', new HeadInjector())
      .on('#shipping .calculator > h3', new CalculatorHeadingRewriter())
      .on('#shipping .calculator > h3', new CalculatorNoteInjector())
      .on('a[data-open-all-guides]', new LinkRewriter('/articles/', ['data-open-all-guides']))
      .on('.footer a[data-i18n="allGuides"]', new LinkRewriter('/articles/'))
      .on('.footer a[data-i18n="contact"]', new LinkRewriter('/contact/'))
      .on('.footer a[data-i18n="privacy"]', new LinkRewriter('/privacy-policy/'))
      .on('.footer a[data-i18n="terms"]', new LinkRewriter('/terms/'))
      .on('.footer a[data-i18n="disclaimer"]', new LinkRewriter('/disclaimer/'))
      .on('body', new BodyInjector());

    for (const [slug, href] of Object.entries(ARTICLE_LINKS)) {
      rewriter = rewriter.on(
        `a[data-open-article="${slug}"]`,
        new LinkRewriter(href, ['data-open-article'])
      );
    }

    return rewriter.transform(response);
  }
};
