const GA_MEASUREMENT_ID = "G-PDS2PMY5LZ";

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", GA_MEASUREMENT_ID);

const googleTag = document.createElement("script");
googleTag.async = true;
googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
document.head.appendChild(googleTag);

const KAKO_MAIN = "https://kakobuymake.com/";

const ui = {
  en: {
    navProducts: "Finds", navShipping: "Shipping", navCoupons: "Coupons", navGuides: "Buyer Guides", navFaq: "FAQ", navCta: "KakobuyMake ↗",
    heroTag: "Buy smarter. Inspect everything.", heroTitle: "Kakobuy Spreadsheet, W2C Links & QC Guide", heroCopy: "A practical Kakobuy research hub for W2C links, QC checks, shipping estimates, coupons and fee clarity.", heroPrimary: "Shop KakobuyMake ↗", heroSecondary: "WhatsApp Support ↗",
    searchPlaceholder: "Paste a Taobao, Weidian, 1688 or Tmall link", searchButton: "Check W2C link", searchHint: "We identify the source and send you to Kakobuy to complete the purchase.",
    catTitle: "Browse the Kakobuy Spreadsheet by Category", catCopy: "Ten useful paths into the current product catalog—without a noisy “hot” category.",
    productsTitle: "Current Kakobuy Spreadsheet Finds", productsCopy: "Open any item to review its product details first, then continue to the matching seller listing in Kakobuy.",
    feesTitle: "Kakobuy Shipping Cost & Service Fee Calculator", feesCopy: "Model chargeable weight, see the fee stack and separate a headline coupon from real delivered cost.",
    guidesTitle: "Kakobuy Guides: W2C, QC Photos, Shipping & Coupons", guidesCopy: "Long-form answers for the questions shoppers actually type: QC, W2C and shipping fees.",
    faqTitle: "Kakobuy FAQ: Shipping, QC Photos, Coupons & Fees", faqCopy: "Policies and live prices can change. We show what to verify instead of pretending a static number is permanent.",
    readGuide: "Read guide", allGuides: "View all guides", estimate: "Estimate", calcTitle: "Estimate Kakobuy Shipping Cost", feeTitle: "Kakobuy Cost Breakdown",
    footerCopy: "Independent research and discovery site for Kakobuy shoppers. Not the official Kakobuy website and not a seller.", ctaButton: "Visit KakobuyMake ↗",
    disclaimer: "Independent information only. Verify live prices, coupons, routes, restrictions and service terms on Kakobuy before paying.",
    w2cDetected: "{source} link detected. Opening Kakobuy in a new tab—paste the same link there to confirm the live item."
  },
  zh: {
    navProducts: "商品发现", navShipping: "运费", navCoupons: "优惠券", navGuides: "购买指南", navFaq: "常见问题", navCta: "KakobuyMake 主站 ↗",
    heroTag: "买得更聪明，验得更仔细。", heroTitle: "Kakobuy 表格、W2C 链接与 QC 验货指南", heroCopy: "围绕 Kakobuy 的 W2C 链接、QC 验货、运费预估、优惠券和费用说明，提供一站式实用信息。", heroPrimary: "前往 KakobuyMake ↗", heroSecondary: "WhatsApp 联系我们 ↗",
    searchPlaceholder: "粘贴淘宝、微店、1688 或天猫链接", searchButton: "识别 W2C 链接", searchHint: "我们会识别来源，然后引导你前往 Kakobuy 完成购买。",
    catTitle: "按品类浏览 Kakobuy 商品表格", catCopy: "十个清晰的商品入口，不设置干扰用户的“热门”分类。",
    productsTitle: "当前 Kakobuy 表格精选", productsCopy: "先打开站内商品详情页查看图片、价格与商品编号，再前往 Kakobuy 核对卖家页面。",
    feesTitle: "Kakobuy 运费与服务费估算器", feesCopy: "估算计费重量，拆解费用，并区分宣传优惠与真实到手成本。",
    guidesTitle: "Kakobuy 指南：W2C、QC 照片、运费与优惠券", guidesCopy: "针对用户真正搜索的 QC、W2C、运费和服务费问题给出系统答案。",
    faqTitle: "Kakobuy 常见问题：运费、QC 照片、优惠券与费用", faqCopy: "政策和价格会变化，因此我们提示需要核验的项目，不把动态数据写成永久承诺。",
    readGuide: "阅读指南", allGuides: "查看全部指南", estimate: "开始估算", calcTitle: "估算 Kakobuy 运费", feeTitle: "Kakobuy 费用明细",
    footerCopy: "面向 Kakobuy 用户的独立研究与商品发现站。不是 Kakobuy 官方网站，也不直接销售商品。", ctaButton: "前往 KakobuyMake ↗",
    disclaimer: "仅供独立信息参考。付款前请在 Kakobuy 核对实时价格、优惠券、线路、限制和服务条款。",
    w2cDetected: "已识别为 {source} 链接。正在新标签页打开 Kakobuy，请在那里粘贴同一链接并核对实时商品。"
  },
  de: {
    navProducts:"Funde",navShipping:"Versand",navCoupons:"Gutscheine",navGuides:"Ratgeber",navFaq:"FAQ",navCta:"KakobuyMake ↗",
    heroTag:"Smarter kaufen. Alles prüfen.",heroTitle:"Kakobuy Spreadsheet, W2C-Links & QC-Ratgeber",heroCopy:"Praxiswissen zu W2C-Links, QC-Fotos, Versand, Gutscheinen und Gebühren bei Kakobuy.",heroPrimary:"Bei KakobuyMake shoppen ↗",heroSecondary:"WhatsApp-Kontakt ↗",
    searchPlaceholder:"Taobao-, Weidian-, 1688- oder Tmall-Link einfügen",searchButton:"W2C-Link prüfen",searchHint:"Wir erkennen die Quelle und leiten für den Kauf zu Kakobuy weiter.",
    catTitle:"Kakobuy Spreadsheet nach Kategorie durchsuchen",catCopy:"Zehn klare Wege durch den aktuellen Katalog.",productsTitle:"Aktuelle Funde im Kakobuy Spreadsheet",productsCopy:"Öffne zuerst die Produktdetailseite und gehe danach zum passenden Verkäuferangebot in Kakobuy.",
    feesTitle:"Kakobuy-Versandkosten- & Gebührenrechner",feesCopy:"Schätzgewicht, Gebühren und reale Gesamtkosten auf einen Blick.",guidesTitle:"Kakobuy-Ratgeber: W2C, QC-Fotos, Versand & Gutscheine",guidesCopy:"Ausführliche Antworten zu QC, W2C und Versand.",faqTitle:"Kakobuy FAQ: Versand, QC-Fotos, Gutscheine & Gebühren",faqCopy:"Preise und Regeln können sich ändern; bitte live prüfen.",readGuide:"Ratgeber lesen",allGuides:"Alle Ratgeber",estimate:"Berechnen",calcTitle:"Kakobuy-Versandkosten schätzen",feeTitle:"Kakobuy-Kostenübersicht",footerCopy:"Unabhängige Informationsseite für Kakobuy-Nutzer. Nicht die offizielle Website.",ctaButton:"Zu KakobuyMake ↗",disclaimer:"Angaben unverbindlich. Live-Preise und Bedingungen vor Zahlung prüfen.",w2cDetected:"{source}-Link erkannt. Kakobuy wird in einem neuen Tab geöffnet; füge dort denselben Link ein und prüfe den aktuellen Artikel."
  },
  fr: {
    navProducts:"Trouvailles",navShipping:"Livraison",navCoupons:"Coupons",navGuides:"Guides",navFaq:"FAQ",navCta:"KakobuyMake ↗",
    heroTag:"Achetez mieux. Vérifiez tout.",heroTitle:"Tableur Kakobuy, liens W2C et guide QC",heroCopy:"Un guide pratique des liens W2C, photos QC, frais de port, coupons et tarifs Kakobuy.",heroPrimary:"Acheter sur KakobuyMake ↗",heroSecondary:"Contacter sur WhatsApp ↗",
    searchPlaceholder:"Collez un lien Taobao, Weidian, 1688 ou Tmall",searchButton:"Vérifier le lien W2C",searchHint:"Nous identifions la source puis vous dirigeons vers Kakobuy.",
    catTitle:"Parcourir le tableur Kakobuy par catégorie",catCopy:"Dix accès simples au catalogue actuel.",productsTitle:"Sélection actuelle du tableur Kakobuy",productsCopy:"Ouvrez d’abord la fiche produit, puis continuez vers l’annonce correspondante dans Kakobuy.",feesTitle:"Calculateur des frais de livraison Kakobuy",feesCopy:"Estimez le poids facturable et les frais avant paiement.",guidesTitle:"Guides Kakobuy : W2C, photos QC, livraison et coupons",guidesCopy:"Réponses détaillées sur QC, W2C et livraison.",faqTitle:"FAQ Kakobuy : livraison, photos QC, coupons et frais",faqCopy:"Les politiques évoluent : vérifiez toujours les données en direct.",readGuide:"Lire le guide",allGuides:"Tous les guides",estimate:"Estimer",calcTitle:"Estimer les frais de livraison Kakobuy",feeTitle:"Détail des coûts Kakobuy",footerCopy:"Site indépendant pour les utilisateurs de Kakobuy. Non officiel.",ctaButton:"Continuer sur KakobuyMake ↗",disclaimer:"Informations indicatives. Vérifiez tarifs et conditions sur Kakobuy.",w2cDetected:"Lien {source} détecté. Kakobuy s’ouvre dans un nouvel onglet ; collez-y le même lien pour vérifier l’article actuel."
  },
  es: {
    navProducts:"Hallazgos",navShipping:"Envíos",navCoupons:"Cupones",navGuides:"Guías",navFaq:"FAQ",navCta:"KakobuyMake ↗",
    heroTag:"Compra mejor. Revisa todo.",heroTitle:"Hoja de cálculo Kakobuy, enlaces W2C y guía QC",heroCopy:"Guía práctica de enlaces W2C, fotos QC, envíos, cupones y comisiones de Kakobuy.",heroPrimary:"Comprar en KakobuyMake ↗",heroSecondary:"Contactar por WhatsApp ↗",
    searchPlaceholder:"Pega un enlace de Taobao, Weidian, 1688 o Tmall",searchButton:"Revisar enlace W2C",searchHint:"Detectamos la fuente y te llevamos a Kakobuy para comprar.",
    catTitle:"Explora la hoja de cálculo Kakobuy por categoría",catCopy:"Diez rutas claras por el catálogo actual.",productsTitle:"Hallazgos actuales de la hoja Kakobuy",productsCopy:"Abre primero la ficha del producto y después continúa al anuncio correspondiente en Kakobuy.",feesTitle:"Calculadora de envío y tarifas de Kakobuy",feesCopy:"Calcula peso cobrable, cargos y coste real.",guidesTitle:"Guías Kakobuy: W2C, fotos QC, envíos y cupones",guidesCopy:"Respuestas extensas sobre QC, W2C y envíos.",faqTitle:"Preguntas de Kakobuy: envíos, fotos QC, cupones y tarifas",faqCopy:"Las políticas cambian; comprueba siempre los datos actuales.",readGuide:"Leer guía",allGuides:"Ver todas",estimate:"Calcular",calcTitle:"Calcula el coste de envío Kakobuy",feeTitle:"Desglose de costes Kakobuy",footerCopy:"Sitio independiente para usuarios de Kakobuy. No es oficial.",ctaButton:"Ir a KakobuyMake ↗",disclaimer:"Información orientativa. Confirma precios y condiciones en Kakobuy.",w2cDetected:"Enlace de {source} detectado. Kakobuy se abrirá en otra pestaña; pega allí el mismo enlace y comprueba el artículo actual."
  },
  it: {
    navProducts:"Prodotti",navShipping:"Spedizione",navCoupons:"Coupon",navGuides:"Guide",navFaq:"FAQ",navCta:"KakobuyMake ↗",
    heroTag:"Compra meglio. Controlla tutto.",heroTitle:"Spreadsheet Kakobuy, link W2C e guida QC",heroCopy:"Guida pratica a link W2C, foto QC, spedizioni, coupon e commissioni Kakobuy.",heroPrimary:"Acquista su KakobuyMake ↗",heroSecondary:"Contatta su WhatsApp ↗",
    searchPlaceholder:"Incolla un link Taobao, Weidian, 1688 o Tmall",searchButton:"Controlla link W2C",searchHint:"Identifichiamo la fonte e ti portiamo su Kakobuy.",
    catTitle:"Sfoglia lo spreadsheet Kakobuy per categoria",catCopy:"Dieci percorsi chiari nel catalogo.",productsTitle:"Prodotti attuali dallo spreadsheet Kakobuy",productsCopy:"Apri prima la scheda prodotto, poi continua verso l’inserzione corrispondente in Kakobuy.",feesTitle:"Calcolatore di spedizione e commissioni Kakobuy",feesCopy:"Stima peso fatturabile, spese e costo reale.",guidesTitle:"Guide Kakobuy: W2C, foto QC, spedizioni e coupon",guidesCopy:"Risposte complete su QC, W2C e spedizioni.",faqTitle:"FAQ Kakobuy: spedizione, foto QC, coupon e commissioni",faqCopy:"Regole e prezzi cambiano: verifica i dati live.",readGuide:"Leggi la guida",allGuides:"Tutte le guide",estimate:"Stima",calcTitle:"Stima il costo di spedizione Kakobuy",feeTitle:"Dettaglio dei costi Kakobuy",footerCopy:"Sito indipendente per utenti Kakobuy. Non ufficiale.",ctaButton:"Vai su KakobuyMake ↗",disclaimer:"Informazioni indicative. Verifica prezzi e condizioni su Kakobuy.",w2cDetected:"Link {source} rilevato. Kakobuy si aprirà in una nuova scheda; incolla lì lo stesso link e verifica l’articolo aggiornato."
  },
  pt: {
    navProducts:"Achados",navShipping:"Envio",navCoupons:"Cupons",navGuides:"Guias",navFaq:"FAQ",navCta:"KakobuyMake ↗",
    heroTag:"Compre melhor. Verifique tudo.",heroTitle:"Planilha Kakobuy, links W2C e guia de QC",heroCopy:"Guia prático de links W2C, fotos QC, frete, cupons e taxas Kakobuy.",heroPrimary:"Comprar na KakobuyMake ↗",heroSecondary:"Contato pelo WhatsApp ↗",
    searchPlaceholder:"Cole um link Taobao, Weidian, 1688 ou Tmall",searchButton:"Verificar link W2C",searchHint:"Identificamos a origem e enviamos você ao Kakobuy.",
    catTitle:"Explore a planilha Kakobuy por categoria",catCopy:"Dez caminhos claros pelo catálogo atual.",productsTitle:"Achados atuais da planilha Kakobuy",productsCopy:"Abra primeiro a página de detalhes e depois continue para o anúncio correspondente no Kakobuy.",feesTitle:"Calculadora de frete e taxas Kakobuy",feesCopy:"Estime peso cobrado, taxas e custo real.",guidesTitle:"Guias Kakobuy: W2C, fotos de QC, frete e cupons",guidesCopy:"Respostas completas sobre QC, W2C e envio.",faqTitle:"FAQ Kakobuy: frete, fotos de QC, cupons e taxas",faqCopy:"Políticas mudam; confirme sempre os dados atuais.",readGuide:"Ler guia",allGuides:"Todos os guias",estimate:"Estimar",calcTitle:"Estime o frete Kakobuy",feeTitle:"Detalhamento de custos Kakobuy",footerCopy:"Site independente para usuários Kakobuy. Não oficial.",ctaButton:"Ir para KakobuyMake ↗",disclaimer:"Informações estimadas. Confirme preços e condições no Kakobuy.",w2cDetected:"Link da {source} detectado. O Kakobuy será aberto em uma nova aba; cole o mesmo link lá e confirme o item atual."
  }
};

let activeLang = "en";
let phraseNodes = [];
let articleNodes = [];
let articleSlug = "";
let articleLocale = "en";
let articleOriginalTitle = document.title;
let articleOriginalDescription = document.querySelector('meta[name="description"]')?.content || "";

const articleLanguages = new Set(["en", "zh", "de", "fr", "es", "it", "pt"]);

function getArticleRoute() {
  const match = location.pathname.match(/^\/(?:(zh|de|fr|es|it|pt)\/)?guides\/([^/]+)\/?$/);
  if (!match) return null;
  return { lang: match[1] || "en", slug: match[2] };
}

function articleHref(slug, lang = articleLocale) {
  return lang === "en" ? `/guides/${slug}/` : `/${lang}/guides/${slug}/`;
}

function syncArticleLinks(lang) {
  document.querySelectorAll('a[href*="/guides/kakobuy-"]').forEach(link => {
    const match = link.getAttribute("href")?.match(/\/(?:(?:zh|de|fr|es|it|pt)\/)?guides\/(kakobuy-(?:qc-photos|shipping-fees|w2c-guide))\/?$/);
    if (match) link.setAttribute("href", articleHref(match[1], lang));
  });
}

function captureArticleNodes() {
  const route = getArticleRoute();
  if (!route) return;
  articleSlug = route.slug;
  articleLocale = route.lang;
  document.querySelectorAll(".page-hero, .article-wrap").forEach(root => {
    root.dataset.articleI18nRoot = "";
    if (route.lang !== "en") return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue.trim();
      if (!original) continue;
      articleNodes.push({
        node,
        original,
        leading: node.nodeValue.match(/^\s*/)?.[0] || "",
        trailing: node.nodeValue.match(/\s*$/)?.[0] || ""
      });
    }
  });
}

function applyArticleLanguage(lang) {
  if (!articleSlug || !articleNodes.length) return;
  const translated = window.KL_ARTICLE_TRANSLATIONS?.[lang]?.[articleSlug];
  articleNodes.forEach((item, index) => {
    if (!item.node.isConnected) return;
    const value = translated?.[index] || item.original;
    item.node.nodeValue = item.leading + value + item.trailing;
  });
  const description = document.querySelector('meta[name="description"]');
  if (translated) {
    const cleanTitle = (translated[5] || articleNodes[5]?.original || "KakobuyLab").replace(/[.。]$/, "");
    document.title = `${cleanTitle} | KakobuyLab`;
    if (description && translated[6]) description.content = translated[6];
  } else {
    document.title = articleOriginalTitle;
    if (description) description.content = articleOriginalDescription;
  }
}

function capturePhraseNodes() {
  phraseNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    const original = node.nodeValue.trim();
    if (!original || !parent || parent.closest("script, style, [data-i18n], [data-article-i18n-root]")) continue;
    phraseNodes.push({
      node,
      original,
      leading: node.nodeValue.match(/^\s*/)?.[0] || "",
      trailing: node.nodeValue.match(/\s*$/)?.[0] || ""
    });
  }
}

function applyPhraseLanguage(lang) {
  const dict = window.KL_TRANSLATIONS?.[lang] || {};
  phraseNodes.forEach(item => {
    if (!item.node.isConnected) return;
    item.node.nodeValue = item.leading + (dict[item.original] || item.original) + item.trailing;
  });
  const localizedTitle = window.KL_TITLES?.[lang]?.[location.pathname];
  if (localizedTitle) document.title = localizedTitle;
}

function headerTemplate() {
  const path = location.pathname;
  const current = p => (path.startsWith(p) || (p === "/guides" && getArticleRoute())) ? ' aria-current="page"' : "";
  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="/" aria-label="KakobuyLab home"><span class="brand-mark brand-mark-logo" aria-hidden="true">K</span><span>KakobuyLab</span></a>
        <nav class="nav-links" id="navLinks" aria-label="Primary">
          <a href="/products/"${current("/products")} data-i18n="navProducts">Finds</a>
          <a href="/shipping/"${current("/shipping")} data-i18n="navShipping">Shipping</a>
          <a href="/coupons/"${current("/coupons")} data-i18n="navCoupons">Coupons</a>
          <a href="/guides/"${current("/guides")} data-i18n="navGuides">Buyer Guides</a>
          <a href="/#faq" data-i18n="navFaq">FAQ</a>
        </nav>
        <div class="nav-actions">
          <select class="lang-select" id="langSelect" aria-label="Language">
            <option value="en">EN</option><option value="de">DE</option><option value="fr">FR</option>
            <option value="es">ES</option><option value="it">IT</option><option value="pt">PT</option><option value="zh">中文</option>
          </select>
          <a class="button small desktop-cta" href="${KAKO_MAIN}" target="_blank" rel="noopener" data-i18n="navCta">KakobuyMake ↗</a>
          <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">☰</button>
        </div>
      </div>
    </header>`;
}

function footerTemplate() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="/"><span class="brand-mark brand-mark-logo" aria-hidden="true">K</span><span>KakobuyLab</span></a>
            <p class="footer-copy" data-i18n="footerCopy">Independent research and discovery site for Kakobuy shoppers. Not the official Kakobuy website and not a seller.</p>
          </div>
          <div class="footer-col"><strong>Research</strong><a href="${articleHref("kakobuy-qc-photos")}">QC photos</a><a href="${articleHref("kakobuy-w2c-guide")}">W2C guide</a><a href="${articleHref("kakobuy-shipping-fees")}">Shipping costs</a></div>
          <div class="footer-col"><strong>Tools</strong><a href="/products/">Product finds</a><a href="/shipping/">Shipping calculator</a><a href="/coupons/">Coupon tracker</a></div>
          <div class="footer-col"><strong>Source sites</strong><a href="${KAKO_MAIN}" target="_blank" rel="noopener">KakobuyMake</a></div>
        </div>
        <div class="footer-bottom"><span>© 2026 KakobuyLab</span><span data-i18n="disclaimer">Independent information only. Verify live prices, coupons, routes, restrictions and service terms on Kakobuy before paying.</span></div>
      </div>
    </footer>`;
}

function applyLanguage(lang) {
  const route = getArticleRoute();
  if (route && articleLanguages.has(lang) && lang !== route.lang) {
    localStorage.setItem("kakobuylab-lang", lang);
    location.assign(articleHref(route.slug, lang));
    return;
  }
  activeLang = lang;
  const dict = ui[lang] || ui.en;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const value = dict[el.dataset.i18n];
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const value = dict[el.dataset.i18nPlaceholder];
    if (value) el.placeholder = value;
  });
  applyPhraseLanguage(lang);
  applyArticleLanguage(lang);
  syncArticleLinks(lang);
  localStorage.setItem("kakobuylab-lang", lang);
}

function initShell() {
  articleLocale = getArticleRoute()?.lang || "en";
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (header) header.innerHTML = headerTemplate();
  if (footer) footer.innerHTML = footerTemplate();
  captureArticleNodes();
  capturePhraseNodes();
  const lang = getArticleRoute()?.lang || localStorage.getItem("kakobuylab-lang") || "en";
  const select = document.getElementById("langSelect");
  if (select) {
    select.value = lang;
    select.addEventListener("change", e => applyLanguage(e.target.value));
  }
  applyLanguage(lang);
  const menu = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  menu?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "×" : "☰";
    document.body.classList.toggle("menu-open", open);
  });
  links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    document.body.classList.remove("menu-open");
  }));
}

function initFaq() {
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const answer = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-question").forEach(other => {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls"))?.classList.remove("open");
      });
      if (!open) {
        button.setAttribute("aria-expanded", "true");
        answer?.classList.add("open");
      }
    });
  });
}

function initFilters() {
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll(".product-card");
  const empty = document.querySelector(".empty-state");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    let count = 0;
    cards.forEach(card => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) count++;
    });
    if (empty) empty.style.display = count ? "none" : "block";
  }));
}

function initCalculator() {
  const form = document.getElementById("shippingForm");
  if (!form) return;
  const update = () => {
    const weight = Math.max(0.1, Number(document.getElementById("weight")?.value || 1));
    const length = Math.max(1, Number(document.getElementById("length")?.value || 20));
    const width = Math.max(1, Number(document.getElementById("width")?.value || 20));
    const height = Math.max(1, Number(document.getElementById("height")?.value || 15));
    const country = document.getElementById("country")?.value || "us";
    const factor = { us: 1, uk: .96, de: 1.06, fr: 1.04, ca: 1.13, au: 1.18 }[country] || 1;
    const dimensional = (length * width * height) / 6000;
    const chargeable = Math.max(weight, dimensional);
    const low = (9.5 + chargeable * 8.4) * factor;
    const high = (14 + chargeable * 12.8) * factor;
    document.getElementById("chargeable").textContent = `${chargeable.toFixed(2)} kg`;
    document.getElementById("estimateValue").textContent = `$ ${low.toFixed(0)}–${high.toFixed(0)}`;
  };
  form.addEventListener("submit", e => { e.preventDefault(); update(); });
  form.querySelectorAll("input, select").forEach(el => el.addEventListener("input", update));
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  initFaq();
  initFilters();
  initCalculator();
});
