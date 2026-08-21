import fs from "node:fs";
import path from "node:path";
import { guideCardLocales } from "./sugargoovip-guide-card-locales.mjs";

const root = path.resolve("sugargoovip.net");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");

const locales = {
  de: { lang: "de", og: "de_DE", title: "Sugargoo Tabelle 2026: Funde, QC & Versand | SugargooVIP", description: "Entdecke kuratierte Sugargoo-Produkte, prüfe QC-Fotos und plane Versandkosten und Pakete mit unabhängigen Ratgebern.", h1: "Sugargoo Tabelle 2026: Produktfunde, QC-Prüfung und Versandplanung" },
  es: { lang: "es", og: "es_ES", title: "Hoja Sugargoo 2026: Productos, QC y Envíos | SugargooVIP", description: "Explora productos seleccionados, revisa fotos QC y planifica costes de envío y paquetes con guías independientes.", h1: "Hoja Sugargoo 2026: productos, revisión QC y herramientas de envío" },
  fr: { lang: "fr", og: "fr_FR", title: "Tableau Sugargoo 2026 : Produits, QC et Livraison | SugargooVIP", description: "Explorez des produits sélectionnés, vérifiez les photos QC et planifiez les frais d’envoi avec des guides indépendants.", h1: "Tableau Sugargoo 2026 : produits, contrôle QC et outils d’expédition" },
  it: { lang: "it", og: "it_IT", title: "Foglio Sugargoo 2026: Prodotti, QC e Spedizione | SugargooVIP", description: "Esplora prodotti selezionati, controlla le foto QC e pianifica costi e pacchi con guide indipendenti.", h1: "Foglio Sugargoo 2026: prodotti, controlli QC e strumenti di spedizione" },
  pt: { lang: "pt", og: "pt_PT", title: "Planilha Sugargoo 2026: Produtos, QC e Envio | SugargooVIP", description: "Explore produtos selecionados, verifique fotos QC e planeje custos de envio e pacotes com guias independentes.", h1: "Planilha Sugargoo 2026: produtos, verificação QC e ferramentas de envio" },
  nl: { lang: "nl", og: "nl_NL", title: "Sugargoo Spreadsheet 2026: Producten, QC en Verzending | SugargooVIP", description: "Ontdek geselecteerde producten, controleer QC-foto’s en plan verzendkosten en pakketten met onafhankelijke gidsen.", h1: "Sugargoo Spreadsheet 2026: producten, QC-controle en verzendtools" },
  pl: { lang: "pl", og: "pl_PL", title: "Arkusz Sugargoo 2026: Produkty, QC i Wysyłka | SugargooVIP", description: "Przeglądaj wybrane produkty, sprawdzaj zdjęcia QC i planuj koszty wysyłki z niezależnymi poradnikami.", h1: "Arkusz Sugargoo 2026: produkty, kontrola QC i narzędzia wysyłkowe" },
  tr: { lang: "tr", og: "tr_TR", title: "Sugargoo Tablosu 2026: Ürünler, QC ve Kargo | SugargooVIP", description: "Seçilmiş ürünleri keşfedin, QC fotoğraflarını kontrol edin ve bağımsız rehberlerle kargo maliyetini planlayın.", h1: "Sugargoo Tablosu 2026: ürünler, QC kontrolü ve kargo araçları" },
  ru: { lang: "ru", og: "ru_RU", title: "Таблица Sugargoo 2026: Товары, QC и Доставка | SugargooVIP", description: "Изучайте отобранные товары, проверяйте QC-фото и планируйте стоимость доставки с независимыми гайдами.", h1: "Таблица Sugargoo 2026: товары, проверка QC и инструменты доставки" },
  ja: { lang: "ja", og: "ja_JP", title: "Sugargooスプレッドシート2026：商品・QC・送料 | SugargooVIP", description: "厳選商品を探し、QC写真を確認し、独立したガイドで国際送料と梱包を計画できます。", h1: "Sugargooスプレッドシート2026：厳選商品・QC確認・配送ツール" },
  ko: { lang: "ko", og: "ko_KR", title: "Sugargoo 스프레드시트 2026: 상품·QC·배송 | SugargooVIP", description: "선별 상품을 찾고 QC 사진을 확인하며 독립 가이드로 국제 배송비와 포장을 계획하세요.", h1: "Sugargoo 스프레드시트 2026: 선별 상품, QC 확인 및 배송 도구" },
  zh: { lang: "zh-CN", og: "zh_CN", title: "Sugargoo Spreadsheet 2026：选品、QC 与国际运费 | SugargooVIP", description: "浏览精选商品线索，检查 QC 图片，估算国际运费，并使用独立买家指南规划包裹。", h1: "Sugargoo Spreadsheet 2026：精选商品、QC 检查与运费工具" },
  ar: { lang: "ar", og: "ar_AR", title: "جدول Sugargoo 2026: المنتجات وفحص QC والشحن | SugargooVIP", description: "استكشف منتجات مختارة وافحص صور الجودة وخطط لتكلفة الشحن والطرد باستخدام أدلة مستقلة.", h1: "جدول Sugargoo 2026: منتجات مختارة وفحص الجودة وأدوات الشحن", dir: "rtl" },
  vi: { lang: "vi", og: "vi_VN", title: "Bảng Sugargoo 2026: Sản phẩm, QC và Vận chuyển | SugargooVIP", description: "Khám phá sản phẩm chọn lọc, kiểm tra ảnh QC và lập kế hoạch chi phí vận chuyển với hướng dẫn độc lập.", h1: "Bảng Sugargoo 2026: sản phẩm chọn lọc, kiểm tra QC và công cụ vận chuyển" },
};

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const replaceGuideCard = (page, key, card) => {
  const cardPattern = new RegExp(`(<a(?=[^>]*data-guide-card="${key}")[\\s\\S]*?</a)`, "m");
  return page.replace(cardPattern, (block) => {
    for (const [field, value] of Object.entries(card)) {
      const fieldPattern = new RegExp(`(<(?:small|h3|p|time)\\s+data-guide-field="${field}">)[\\s\\S]*?(</(?:small|h3|p|time)>)`, "m");
      block = block.replace(fieldPattern, `$1${escapeHtml(value)}$2`);
    }
    return block;
  });
};

for (const [route, locale] of Object.entries(locales)) {
  const url = `https://sugargoovip.net/${route}/`;
  let page = source;
  page = page.replace('<html lang="en">', `<html lang="${locale.lang}"${locale.dir ? ` dir="${locale.dir}"` : ""}>`);
  page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(locale.title)}</title>`);
  page = page.replace(/<link rel="canonical" href="[^"]+" \/>/, `<link rel="canonical" href="${url}" />`);
  page = page.replace(/<meta property="og:locale" content="[^"]+" \/>/, `<meta property="og:locale" content="${locale.og}" />`);
  page = page.replace(/<meta property="og:title" content="[^"]+" \/>/, `<meta property="og:title" content="${escapeHtml(locale.title)}" />`);
  page = page.replace(/<meta property="og:description" content="[^"]+" \/>/, `<meta property="og:description" content="${escapeHtml(locale.description)}" />`);
  page = page.replace(/<meta property="og:url" content="[^"]+" \/>/, `<meta property="og:url" content="${url}" />`);
  page = page.replace(/<meta name="twitter:title" content="[^"]+" \/>/, `<meta name="twitter:title" content="${escapeHtml(locale.title)}" />`);
  page = page.replace(/<meta name="twitter:description" content="[^"]+" \/>/, `<meta name="twitter:description" content="${escapeHtml(locale.description)}" />`);
  page = page.replace(/<meta\s+name="description"\s+content="[^"]+"\s*\/>/, `<meta name="description" content="${escapeHtml(locale.description)}" />`);
  page = page.replace(/<h1 data-copy="title">[\s\S]*?<\/h1>/, `<h1 data-copy="title">${escapeHtml(locale.h1)}</h1>`);
  page = page.replace(/<p data-copy="desc">[\s\S]*?<\/p>/, `<p data-copy="desc">${escapeHtml(locale.description)}</p>`);
  page = page.replace('"inLanguage": "en"', `"inLanguage": "${locale.lang}"`);
  for (const [key, card] of Object.entries(guideCardLocales[route])) {
    page = replaceGuideCard(page, key, card);
  }
  fs.mkdirSync(path.join(root, route), { recursive: true });
  fs.writeFileSync(path.join(root, route, "index.html"), page);
}
