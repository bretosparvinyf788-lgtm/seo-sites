import fs from "node:fs/promises";
import path from "node:path";
import worker from "../dist/server/index.js";

const response = await worker.fetch(new Request("https://superbuyvip.pro/"), {}, { waitUntil() {}, passThroughOnException() {} });
if (!response.ok) throw new Error(`Unable to render page: ${response.status}`);

let html = await response.text();
const assets = path.resolve("dist/client/assets");
const cssName = (await fs.readdir(assets)).find(name => name.endsWith(".css"));
if (!cssName) throw new Error("Built stylesheet was not found");
const css = await fs.readFile(path.join(assets, cssName), "utf8");
const translations = JSON.parse(await fs.readFile(path.resolve("app/content.json"), "utf8"));
const longGuides = JSON.parse(await fs.readFile(path.resolve("app/articles.json"), "utf8"));
const articleFaqs = JSON.parse(await fs.readFile(path.resolve("app/article-faqs.json"), "utf8"));
const guidesByLanguage = {
  en: longGuides,
  de: JSON.parse(await fs.readFile(path.resolve("app/articles-de.json"), "utf8")),
  fr: JSON.parse(await fs.readFile(path.resolve("app/articles-fr.json"), "utf8")),
  es: JSON.parse(await fs.readFile(path.resolve("app/articles-es.json"), "utf8")),
  it: JSON.parse(await fs.readFile(path.resolve("app/articles-it.json"), "utf8")),
  pt: JSON.parse(await fs.readFile(path.resolve("app/articles-pt.json"), "utf8")),
  zh: JSON.parse(await fs.readFile(path.resolve("app/articles-zh.json"), "utf8"))
};
Object.entries(translations).forEach(([code, locale]) => {
  locale.guides = guidesByLanguage[code];
  locale.articleFaqs = articleFaqs[code];
});
const safeTranslations = JSON.stringify(translations).replaceAll("</", "<\\/");
const articleSchema = JSON.stringify({
  "@context":"https://schema.org",
  "@graph":longGuides.map((guide,index)=>({"@type":"Article",headline:guide.title,description:guide.intro,datePublished:"2026-08-17",dateModified:"2026-08-17",inLanguage:"en",author:{"@type":"Organization",name:"SuperBuyVIP"},publisher:{"@type":"Organization",name:"SuperBuyVIP"},mainEntityOfPage:`https://superbuyvip.pro/#guide-${index+1}`,hasPart:articleFaqs.en[index].items.map(item=>({"@type":"Question",name:item[0],acceptedAnswer:{"@type":"Answer",text:item[1]}}))}))
}).replaceAll("</", "<\\/");

html = html
  .replace(/<link[^>]+href="[^"]+\.css"[^>]*>/g, "")
  .replace(/<link[^>]+rel="modulepreload"[^>]*>/g, "")
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace("<head>", `<head><style>${css}</style>`)
  .replace("</head>", `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23e63b2e'/%3E%3Ctext x='18' y='45' fill='white' font-family='Georgia' font-size='38' font-style='italic' font-weight='700'%3ES%3C/text%3E%3C/svg%3E"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"SuperBuyVIP","url":"https://superbuyvip.pro/","description":"Independent Superbuy spreadsheet research, QC checklists and parcel planning."}</script><script type="application/ld+json">${articleSchema}</script></head>`);

const behavior = String.raw`
(() => {
  const translations = ${safeTranslations};
  const categoryKeys = ['Shoes','Hoodies','T-Shirts','Jackets','Pants','Bags','Accessories','Electronics','Headwear','Other finds'];
  const researchNotes = {
    en:'Research basis: current Superbuy official shopping-agent, warehousing and fee guidance. Confirm live policy details inside your account.',
    de:'Recherchebasis: aktuelle offizielle Superbuy-Hinweise zu Einkaufsservice, Lagerung und Gebühren. Prüfe die aktuellen Bedingungen in deinem Konto.',
    fr:'Base de recherche : directives officielles actuelles de Superbuy sur l’achat, l’entreposage et les frais. Vérifiez les conditions dans votre compte.',
    es:'Base de la investigación: orientación oficial actual de Superbuy sobre compras, almacén y tarifas. Confirma las condiciones vigentes en tu cuenta.',
    it:'Base della ricerca: indicazioni ufficiali attuali di Superbuy su acquisti, magazzino e tariffe. Verifica le condizioni nel tuo account.',
    pt:'Base da pesquisa: orientações oficiais atuais da Superbuy sobre compras, armazenamento e taxas. Confirme os termos atuais na sua conta.',
    zh:'研究依据：Superbuy 当前公开的代购、仓储和费用说明。实际操作前请在个人账户中确认最新政策。'
  };
  const allGuideLabels = {en:'VIEW ALL BUYER GUIDES',de:'ALLE RATGEBER ANZEIGEN',fr:'VOIR TOUS LES GUIDES',es:'VER TODAS LAS GUÍAS',it:'VEDI TUTTE LE GUIDE',pt:'VER TODOS OS GUIAS',zh:'查看全部购买指南'};
  const guideLibraryTitles = {en:'All buyer guides',de:'Alle Kaufratgeber',fr:'Tous les guides d’achat',es:'Todas las guías de compra',it:'Tutte le guide all’acquisto',pt:'Todos os guias de compra',zh:'全部购买指南'};
  const guideLibraryDescriptions = {
    en:'Three long-form, evidence-led operating guides for buyers who want cleaner QC decisions, more predictable parcel costs and a spreadsheet that survives repeat use.',
    de:'Drei vollständige, faktenbasierte Leitfäden für bessere QC-Entscheidungen, planbarere Paketkosten und eine Tabelle, die auch bei wiederholter Nutzung zuverlässig bleibt.',
    fr:'Trois guides complets fondés sur des faits pour mieux décider lors du contrôle qualité, prévoir le coût des colis et conserver un tableau fiable à chaque commande.',
    es:'Tres guías completas basadas en hechos para tomar mejores decisiones de control de calidad, prever el coste del paquete y mantener una hoja fiable en cada compra.',
    it:'Tre guide complete basate sui fatti per migliorare le decisioni di controllo qualità, prevedere i costi del pacco e mantenere un foglio affidabile nel tempo.',
    pt:'Três guias completos baseados em fatos para melhorar decisões de controle de qualidade, prever custos do pacote e manter uma planilha confiável em compras recorrentes.',
    zh:'三篇完整、以事实为依据的实操指南，帮助买家做好质检判断、预估包裹成本，并建立可长期复用的采购表格。'
  };
  const editionLabels = {en:'WORDS',de:'VOLLSTÄNDIGE ÜBERSETZUNG',fr:'VERSION INTÉGRALE',es:'TRADUCCIÓN COMPLETA',it:'TRADUZIONE COMPLETA',pt:'TRADUÇÃO COMPLETA',zh:'完整译文'};
  const articleWordCounts = translations.en.guides.map((guide,index) => [guide.title,guide.intro,...guide.body.slice(0,-2),translations.en.articleFaqs[index].title,...translations.en.articleFaqs[index].items.flat()].join(' ').match(/[A-Za-z0-9’'-]+/g)?.length || 0);
  const cards = [...document.querySelectorAll('.product-grid article')];
  const searches = [...document.querySelectorAll('.hero-search input')];
  const sortSelect = document.querySelector('.sort-box select');
  const languageSelect = document.querySelector('.language-select select');
  const languageCode = document.querySelector('.language-select > span');
  const grid = document.querySelector('.product-grid');
  const status = document.querySelector('.table-status span');
  const noResults = document.querySelector('.no-results');
  const plannerInputs = [...document.querySelectorAll('.calc-inputs input')];
  const plannerValues = [...document.querySelectorAll('.calc-results b')];
  const plannerAdvice = document.querySelector('[data-planner-advice]');
  let currentLang = 'en';

  const getPath = (object, path) => path.split('.').reduce((value, key) => value == null ? value : value[key], object);
  const updateStatus = shown => {
    const copy = translations[currentLang];
    if (status) status.textContent = copy.showing.replace('{shown}', String(shown)).replace('{total}', String(cards.length));
  };
  const filterCards = () => {
    const q = (searches.find(input => input.value)?.value || '').trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const visible = card.textContent.toLowerCase().includes(q);
      card.style.display = visible ? '' : 'none';
      if (visible) shown += 1;
    });
    if (noResults) noResults.style.display = shown ? 'none' : 'block';
    updateStatus(shown);
  };
  const updatePlanner = () => {
    const [grams, length, width, height] = plannerInputs.map(input => Number(input.value) || 0);
    const actual = grams / 1000;
    const dimensional = length * width * height / 6000;
    const planning = Math.max(actual, dimensional);
    [actual, dimensional, planning].forEach((value, index) => { if (plannerValues[index]) plannerValues[index].textContent = value.toFixed(2) + ' kg'; });
    if (plannerAdvice) plannerAdvice.textContent = dimensional > actual ? translations[currentLang].calculator.box : translations[currentLang].calculator.scale;
  };
  const articleMeta = index => currentLang === 'en' ? articleWordCounts[index].toLocaleString('en-US') + ' ' + editionLabels.en : editionLabels[currentLang];
  const updateGuides = copy => {
    const guides = copy.guides;
    document.querySelectorAll('.guide-list > article').forEach((card,index) => {
      const guide = guides[index];
      if (!guide) return;
      const tag = card.querySelector('b');
      const title = card.querySelector('h3');
      const intro = card.querySelector('p');
      if (tag) tag.textContent = guide.tag;
      if (title) title.textContent = guide.title;
      if (intro) intro.textContent = guide.intro;
    });
    const libraryDescription = document.querySelector('[data-guide-library-description]');
    if (libraryDescription) libraryDescription.textContent = guideLibraryDescriptions[currentLang];
    document.querySelectorAll('.guide-library > article').forEach((card,index) => {
      const guide = guides[index];
      if (!guide) return;
      const tag = card.querySelector('b');
      const title = card.querySelector('h3');
      const intro = card.querySelector('p');
      const meta = card.querySelector('small');
      if (tag) tag.textContent = guide.tag;
      if (title) title.textContent = guide.title;
      if (intro) intro.textContent = guide.intro;
      if (meta) meta.textContent = articleMeta(index) + ' · 2026-08-17';
    });
    document.querySelectorAll('.article-modal').forEach((modal,index) => {
      const guide = guides[index];
      if (!guide) return;
      const meta = modal.querySelector(':scope > span');
      const title = modal.querySelector(':scope > h2');
      const lead = modal.querySelector(':scope > .lead');
      const body = modal.querySelector(':scope > .article-body');
      const faqBlock = modal.querySelector(':scope > .article-faqs');
      const note = modal.querySelector(':scope > div');
      if (meta) meta.textContent = guide.tag + ' · ' + articleMeta(index);
      if (title) title.textContent = guide.title;
      if (lead) lead.textContent = guide.intro;
      if (body) {
        body.replaceChildren(...guide.body.slice(0,-2).map(paragraph => {
          const heading = paragraph.startsWith('## ');
          const element = document.createElement(heading ? 'h3' : 'p');
          element.textContent = heading ? paragraph.slice(3) : paragraph;
          return element;
        }));
      }
      if (faqBlock) {
        const faq = copy.articleFaqs[index];
        const heading = document.createElement('h3');
        heading.textContent = faq.title;
        const entries = faq.items.map((item,itemIndex) => {
          const details = document.createElement('details');
          const summary = document.createElement('summary');
          const number = document.createElement('span');
          const question = document.createElement('b');
          const marker = document.createElement('i');
          const answer = document.createElement('p');
          number.textContent = String(itemIndex + 1).padStart(2,'0');
          question.textContent = item[0];
          marker.textContent = '+';
          answer.textContent = item[1];
          summary.append(number,question,marker);
          details.append(summary,answer);
          return details;
        });
        faqBlock.replaceChildren(heading,...entries);
      }
      if (note) note.textContent = researchNotes[currentLang];
    });
  };
  const applyLanguage = code => {
    currentLang = translations[code] ? code : 'en';
    const copy = translations[currentLang];
    document.documentElement.lang = currentLang;
    if (languageSelect) languageSelect.value = currentLang;
    if (languageCode) languageCode.textContent = currentLang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = getPath(copy, element.dataset.i18n);
      if (typeof value === 'string') element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const value = getPath(copy, element.dataset.i18nPlaceholder);
      if (typeof value === 'string') element.setAttribute('placeholder', value);
    });
    document.querySelectorAll('span[data-category]').forEach(element => {
      const index = categoryKeys.indexOf(element.dataset.category);
      if (index >= 0) element.textContent = copy.categories[index][0];
    });
    const allGuidesLabel = document.querySelector('[data-all-guides-label]');
    const guideLibraryTitle = document.querySelector('[data-guide-library-title]');
    if (allGuidesLabel) allGuidesLabel.textContent = allGuideLabels[currentLang];
    if (guideLibraryTitle) guideLibraryTitle.textContent = guideLibraryTitles[currentLang];
    updateGuides(copy);
    try { localStorage.setItem('sbvip-language', currentLang); } catch {}
    updatePlanner();
    filterCards();
  };

  searches.forEach(search => search.addEventListener('input', () => {
    searches.forEach(other => { if (other !== search) other.value = search.value; });
    filterCards();
  }));
  sortSelect?.addEventListener('change', () => {
    const value = sortSelect.value;
    cards.sort((a, b) => {
      if (value === 'name') return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent, currentLang);
      if (value === 'category') return a.querySelector('.product-line span').textContent.localeCompare(b.querySelector('.product-line span').textContent, currentLang);
      return a.querySelector('.row-number').textContent.localeCompare(b.querySelector('.row-number').textContent);
    }).forEach(card => grid.appendChild(card));
  });
  languageSelect?.addEventListener('change', () => applyLanguage(languageSelect.value));

  document.querySelectorAll('.faq-list article').forEach(article => {
    const button = article.querySelector('button');
    button?.addEventListener('click', () => {
      const next = !article.classList.contains('open');
      document.querySelectorAll('.faq-list article').forEach(item => item.classList.remove('open'));
      if (next) article.classList.add('open');
      document.querySelectorAll('.faq-list article button').forEach(item => item.setAttribute('aria-expanded', item.closest('article').classList.contains('open')));
    });
  });
  plannerInputs.forEach(input => input.addEventListener('input', updatePlanner));

  const articleBackdrops = [...document.querySelectorAll('.article-modal')].map(article => article.closest('.modal'));
  const libraryBackdrop = document.querySelector('.library-modal')?.closest('.modal');
  const closeGuides = () => {
    articleBackdrops.forEach(backdrop => backdrop?.classList.add('is-hidden'));
    libraryBackdrop?.classList.add('is-hidden');
  };
  const openGuide = index => {
    closeGuides();
    articleBackdrops[index]?.classList.remove('is-hidden');
  };
  document.querySelectorAll('.guide-list article').forEach((card, index) => card.querySelector('button')?.addEventListener('click', () => openGuide(index)));
  document.querySelector('[data-open-all-guides]')?.addEventListener('click', () => {
    closeGuides();
    libraryBackdrop?.classList.remove('is-hidden');
  });
  document.querySelectorAll('.guide-library > article').forEach((card, index) => card.querySelector('button')?.addEventListener('click', () => openGuide(index)));
  document.querySelectorAll('[aria-label="Close article"],[aria-label="Close guide library"]').forEach(button => button.addEventListener('click', closeGuides));
  [...articleBackdrops,libraryBackdrop].forEach(backdrop => backdrop?.addEventListener('click', event => { if (event.target === backdrop) closeGuides(); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeGuides(); });

  const menuButton = document.querySelector('.menu');
  const nav = document.querySelector('header nav');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

  try { currentLang = translations[localStorage.getItem('sbvip-language')] ? localStorage.getItem('sbvip-language') : 'en'; } catch {}
  applyLanguage(currentLang);
})();`;

html = html.replace("</body>", `<script>${behavior}</script></body>`);

// Keep the review file genuinely self-contained while the deployable source
// uses local product assets that do not depend on upstream hotlinking.
const productImagePaths = [...new Set(html.match(/\/products\/product-\d+\.webp/g) || [])];
for (const imagePath of productImagePaths) {
  const image = await fs.readFile(path.resolve("public", imagePath.slice(1)));
  html = html.replaceAll(imagePath, `data:image/webp;base64,${image.toString("base64")}`);
}

const output = path.resolve("superbuyvip-pro-single-file.html");
await fs.writeFile(output, html, "utf8");
console.log(output);
