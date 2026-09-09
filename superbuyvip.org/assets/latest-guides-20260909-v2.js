(() => {
  const guides = [
    {
      slug: "superbuy-shipping-cost-chargeable-weight",
      number: "09",
      image: "/assets/superbuy-shipping-cost-chargeable-weight-2026.webp",
      month: "sep",
      titles: {
        en: "Superbuy Shipping Cost Guide: Compare Chargeable Weight Before Parcel Submission",
        zh: "Superbuy 运费指南：提交包裹前比较计费重量",
        es: "Guía de costes de envío de Superbuy: compara el peso facturable",
        de: "Superbuy-Versandkosten: Abrechnungsgewicht vor dem Absenden vergleichen",
        fr: "Coût d’expédition Superbuy : comparer le poids facturable",
        it: "Costi di spedizione Superbuy: confrontare il peso addebitabile",
        pt: "Custos de envio Superbuy: compare o peso cobrável",
        nl: "Superbuy-verzendkosten: vergelijk het factureerbare gewicht",
        ja: "Superbuy送料ガイド：荷物提出前に請求重量を比較する",
        ko: "Superbuy 배송비 가이드: 제출 전 청구 중량 비교",
        ru: "Стоимость доставки Superbuy: сравнение расчётного веса"
      }
    },
    {
      slug: "superbuy-order-status-control",
      number: "08",
      image: "/assets/superbuy-order-status-guide-2026.webp",
      month: "sep",
      titles: {
        en: "Superbuy Order Status Guide: Control the Purchase Before Warehouse Arrival",
        zh: "Superbuy 订单状态指南：商品入库前的流程控制",
        es: "Guía de estados de pedido de Superbuy",
        de: "Superbuy-Bestellstatus: Kontrolle bis zur Lagereinlagerung",
        fr: "Statut de commande Superbuy : contrôler le parcours avant l’entrepôt",
        it: "Stato dell’ordine Superbuy: controllo prima dell’arrivo in magazzino",
        pt: "Status do pedido Superbuy: controle antes da chegada ao armazém",
        nl: "Superbuy-bestelstatus: controle vóór aankomst in het magazijn",
        ja: "Superbuy注文状況ガイド：倉庫到着前の流れを管理する",
        ko: "Superbuy 주문 상태 가이드: 창고 도착 전 과정 관리",
        ru: "Статус заказа Superbuy: контроль до поступления на склад"
      }
    },
    {
      slug: "superbuy-parcel-insurance-claim-evidence",
      number: "07",
      image: "/assets/superbuy-parcel-insurance-evidence-guide-2026.webp",
      month: "aug",
      titles: {
        en: "Superbuy Parcel Insurance Guide: Build a Claim-Ready Evidence File",
        zh: "Superbuy 包裹保险指南：建立可用于理赔的证据档案",
        es: "Guía de seguro de paquetes de Superbuy",
        de: "Superbuy-Paketversicherung: Beweise für einen Anspruch sichern",
        fr: "Assurance colis Superbuy : préparer un dossier de preuves",
        it: "Assicurazione pacchi Superbuy: preparare le prove per il reclamo",
        pt: "Seguro de encomenda Superbuy: prepare provas para a reclamação",
        nl: "Superbuy-pakketverzekering: bouw een bewijsdossier",
        ja: "Superbuy荷物保険ガイド：請求に備えた証拠を残す",
        ko: "Superbuy 배송 보험 가이드: 청구용 증거 준비",
        ru: "Страхование посылки Superbuy: подготовка доказательств"
      }
    }
  ];

  const labels = { en: "Guide", zh: "指南", es: "Guía", de: "Ratgeber", fr: "Guide", it: "Guida", pt: "Guia", nl: "Gids", ja: "ガイド", ko: "가이드", ru: "Гайд" };
  const dates = {
    en: { sep: "September 2026 · 13 min read", aug: "August 2026 · 13 min read" },
    zh: { sep: "2026年9月 · 13 分钟阅读", aug: "2026年8月 · 13 分钟阅读" },
    es: { sep: "Septiembre de 2026 · 13 min de lectura", aug: "Agosto de 2026 · 13 min de lectura" },
    de: { sep: "September 2026 · 13 Min. Lesezeit", aug: "August 2026 · 13 Min. Lesezeit" },
    fr: { sep: "Septembre 2026 · 13 min de lecture", aug: "Août 2026 · 13 min de lecture" },
    it: { sep: "Settembre 2026 · 13 min di lettura", aug: "Agosto 2026 · 13 min di lettura" },
    pt: { sep: "Setembro de 2026 · 13 min de leitura", aug: "Agosto de 2026 · 13 min de leitura" },
    nl: { sep: "September 2026 · 13 min leestijd", aug: "Augustus 2026 · 13 min leestijd" },
    ja: { sep: "2026年9月 · 13分で読めます", aug: "2026年8月 · 13分で読めます" },
    ko: { sep: "2026년 9월 · 13분 읽기", aug: "2026년 8월 · 13분 읽기" },
    ru: { sep: "Сентябрь 2026 · 13 мин чтения", aug: "Август 2026 · 13 мин чтения" }
  };

  let applying = false;
  const currentLanguage = () => document.querySelector("select[aria-label=\"Language\"]")?.value || "en";

  function applyLatestGuides() {
    if (applying) return;
    const cards = document.querySelectorAll(".guide-grid > .guide-card");
    if (cards.length !== 3) return;
    applying = true;
    const lang = currentLanguage();
    cards.forEach((card, index) => {
      const guide = guides[index];
      const expectedHref = `/guides/${guide.slug}?lang=${lang}`;
      if (card.getAttribute("href") !== expectedHref) card.setAttribute("href", expectedHref);
      const number = card.querySelector(".guide-art span");
      const expectedNumber = `${labels[lang] || labels.en} ${guide.number}`;
      if (number && number.textContent !== expectedNumber) number.textContent = expectedNumber;
      const art = card.querySelector(".guide-art");
      const expectedImage = `linear-gradient(180deg,rgba(5,35,43,.12),rgba(5,35,43,.82)),url(${guide.image})`;
      if (art && !art.style.backgroundImage.includes(guide.image)) {
        art.style.backgroundImage = expectedImage;
        art.style.backgroundSize = "cover";
        art.style.backgroundPosition = "center";
      }
      const date = card.querySelector(".guide-body p");
      const expectedDate = (dates[lang] || dates.en)[guide.month];
      if (date && date.textContent !== expectedDate) date.textContent = expectedDate;
      const title = card.querySelector(".guide-body h3");
      const expectedTitle = guide.titles[lang] || guide.titles.en;
      if (title && title.textContent !== expectedTitle) title.textContent = expectedTitle;
    });
    applying = false;
  }

  function start() {
    applyLatestGuides();
    const grid = document.querySelector(".guide-grid");
    if (grid) new MutationObserver(applyLatestGuides).observe(grid, { childList: true, subtree: true, characterData: true, attributes: true });
    document.querySelector("select[aria-label=\"Language\"]")?.addEventListener("change", () => setTimeout(applyLatestGuides, 0));
    setTimeout(applyLatestGuides, 250);
    setTimeout(applyLatestGuides, 1200);
    setInterval(applyLatestGuides, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
