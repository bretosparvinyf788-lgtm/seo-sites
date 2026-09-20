import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve();
const articles = JSON.parse(await fs.readFile(path.join(root, "app/articles.json"), "utf8"));
const faqs = JSON.parse(await fs.readFile(path.join(root, "app/article-faqs.json"), "utf8")).en;
const meta = JSON.parse(await fs.readFile(path.join(root, "app/guide-meta.json"), "utf8"));

if (articles.length !== faqs.length || articles.length !== meta.length) {
  throw new Error(`Guide data mismatch: ${articles.length} articles, ${faqs.length} FAQ sets, ${meta.length} metadata rows`);
}

const site = "https://superbuyvip.pro";
const outputRoot = path.join(root, "public/guides");
const mediaRoot = path.join(outputRoot, "media");
const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const safeJson = value => JSON.stringify(value).replaceAll("</", "<\\/");
const words = value => String(value).replace(/<[^>]+>/g, " ").replace(/&[#A-Za-z0-9]+;/g, " ").match(/[A-Za-z0-9’'-]+/g)?.length ?? 0;
const guideUrl = index => `/guides/${meta[index].slug}/`;
const guideImage = index => `/guides/media/${meta[index].slug}.svg`;
const palettes = [
  ["#0f2f55", "#e33d32", "#f5d85e"], ["#173c2d", "#2aa774", "#e8f3c7"], ["#402d55", "#f05d5e", "#ffd166"],
  ["#263238", "#ef5350", "#eceff1"], ["#182848", "#4b6cb7", "#d7e3fc"], ["#4a2c2a", "#dc6b3c", "#f6d7b0"],
  ["#153243", "#00a7a5", "#d5f5f4"], ["#33261d", "#bc6c25", "#fefae0"], ["#22223b", "#9a8c98", "#f2e9e4"],
  ["#233d4d", "#fe7f2d", "#fcca46"], ["#2b2d42", "#ef233c", "#edf2f4"], ["#253237", "#5c6b73", "#c2dfe3"]
];

const sharedCss = `:root{--ink:#191919;--muted:#68706c;--line:#d9ddda;--soft:#f3f5f2;--red:#e43d30;--blue:#265ed7}*{box-sizing:border-box}body{margin:0;background:var(--soft);color:var(--ink);font:16px/1.72 Arial,Helvetica,sans-serif}a{color:inherit;text-decoration:none}.top{position:sticky;top:0;z-index:10;background:#fff;border-bottom:1px solid var(--line)}.nav{max-width:1180px;margin:auto;height:64px;padding:0 22px;display:flex;align-items:center;justify-content:space-between}.brand{font-size:13px;font-weight:800;letter-spacing:.08em}.brand i{color:var(--red);font-style:normal}.navlinks{display:flex;gap:22px;font-size:11px;font-weight:700}.hero{background:#fff;border-bottom:1px solid var(--line);padding:72px 22px 58px}.hero-inner,.layout{max-width:1080px;margin:auto}.eyebrow{font:700 10px/1.2 "Courier New",monospace;letter-spacing:.12em;color:var(--red);text-transform:uppercase}.hero h1{font-size:clamp(40px,6vw,72px);line-height:1.02;letter-spacing:-.055em;max-width:980px;margin:18px 0}.dek{font-size:18px;color:var(--muted);max-width:820px}.meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.meta span,.tag{border:1px solid var(--line);background:var(--soft);padding:7px 10px;font:700 10px/1 "Courier New",monospace}.layout{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:34px;padding:42px 22px 80px}.article{background:#fff;border:1px solid var(--line);padding:clamp(24px,5vw,62px)}.article h2{font-size:28px;line-height:1.15;letter-spacing:-.025em;margin:48px 0 12px}.article h2:first-child{margin-top:0}.article p{margin:0 0 18px}.article .lead{font-size:19px;color:#454b48;border-left:3px solid var(--red);padding-left:18px}.faq{margin-top:54px;border-top:1px solid var(--line)}.faq details{border-bottom:1px solid var(--line);padding:17px 0}.faq summary{cursor:pointer;font-weight:700}.faq details p{color:var(--muted);margin:10px 0 0}.side{align-self:start;position:sticky;top:86px;background:#fff;border:1px solid var(--line);padding:22px}.side b{font-size:12px}.side a{display:block;color:var(--blue);font-size:12px;line-height:1.45;margin-top:13px}.side hr{border:0;border-top:1px solid var(--line);margin:20px 0}.cover{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border:1px solid var(--line);margin-bottom:26px}footer{border-top:1px solid var(--line);background:#fff;text-align:center;padding:28px 22px;color:var(--muted);font-size:11px}.archive{max-width:1180px;margin:auto;padding:56px 22px 90px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.archive>article{background:#fff;border:1px solid var(--line);display:flex;flex-direction:column;min-width:0}.archive article img{width:100%;aspect-ratio:16/9;object-fit:cover;border-bottom:1px solid var(--line)}.archive-card{padding:22px;display:flex;flex:1;flex-direction:column}.archive article time{font:700 10px 'Courier New',monospace;color:var(--red)}.archive article h2{font-size:21px;line-height:1.22;margin:10px 0}.archive article p{color:var(--muted);font-size:14px}.read{color:var(--blue);font-size:11px;font-weight:800;margin-top:auto}.source-note{background:#fff8df;border-left:3px solid #ddb529;padding:15px;margin:24px 0;font-size:13px}@media(max-width:900px){.archive{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:800px){.layout{grid-template-columns:1fr}.side{position:static;order:-1}.navlinks{display:none}.hero{padding-top:48px}.article{padding:26px 20px}}@media(max-width:580px){.archive{grid-template-columns:1fr}.hero h1{font-size:40px}}`;

await fs.mkdir(mediaRoot, { recursive: true });

for (let index = 0; index < articles.length; index += 1) {
  const article = articles[index];
  const faq = faqs[index];
  const details = meta[index];
  const combined = [article.title, article.intro, ...article.body, faq.title, ...faq.items.flat()].join(" ").replaceAll("## ", "");
  const wordCount = words(combined);
  if (index < 3 && (wordCount < 1500 || wordCount > 1800)) throw new Error(`${details.slug} has ${wordCount} words; expected 1500–1800`);

  const [background, accent, paper] = palettes[index % palettes.length];
  const ordinal = String(index + 1).padStart(2, "0");
  const cover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc"><title id="title">${escapeHtml(article.title)}</title><desc id="desc">SuperBuyVIP buyer guide cover</desc><rect width="1200" height="675" fill="${background}"/><path d="M0 92H1200M0 583H1200" stroke="${paper}" stroke-opacity=".28"/><path d="M88 0V675M1112 0V675" stroke="${paper}" stroke-opacity=".28"/><rect x="88" y="92" width="1024" height="491" rx="8" fill="${paper}"/><rect x="88" y="92" width="18" height="491" fill="${accent}"/><text x="148" y="160" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" letter-spacing="3">SUPERBUYVIP GUIDE ${ordinal}</text><text x="148" y="248" fill="${background}" font-family="Georgia,serif" font-size="58" font-weight="700">${escapeHtml(article.tag)}</text><text x="148" y="329" fill="${background}" font-family="Arial,Helvetica,sans-serif" font-size="30">Evidence-led buyer research</text><path d="M148 392H870" stroke="${accent}" stroke-width="8"/><circle cx="997" cy="448" r="66" fill="${accent}"/><path d="M962 448h70m-28-28 28 28-28 28" fill="none" stroke="${paper}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><text x="148" y="515" fill="${background}" font-family="Courier New,monospace" font-size="24">UPDATED ${details.date}</text></svg>`;
  await fs.writeFile(path.join(mediaRoot, `${details.slug}.svg`), cover, "utf8");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {"@type":"Article",headline:article.title,description:article.intro,datePublished:details.date,dateModified:details.date,inLanguage:"en",image:`${site}${guideImage(index)}`,mainEntityOfPage:`${site}${guideUrl(index)}`,author:{"@type":"Organization",name:"SuperBuyVIP Editorial"},publisher:{"@type":"Organization",name:"SuperBuyVIP"}},
      {"@type":"FAQPage",mainEntity:faq.items.map(item=>({"@type":"Question",name:item[0],acceptedAnswer:{"@type":"Answer",text:item[1]}}))}
    ]
  };
  const articleHtml = article.body.map(block => block.startsWith("## ") ? `<h2>${escapeHtml(block.slice(3))}</h2>` : `<p>${escapeHtml(block)}</p>`).join("");
  const faqHtml = faq.items.map(item => `<details><summary>${escapeHtml(item[0])}</summary><p>${escapeHtml(item[1])}</p></details>`).join("");
  const relatedIndexes = [1, 2, 3].map(offset => (index + offset) % articles.length);
  const relatedHtml = relatedIndexes.map(related => `<a href="${guideUrl(related)}">${escapeHtml(articles[related].title)}</a>`).join("");
  const html = `<!doctype html><html lang="en"><head>
<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-VD0JLQGX7K"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VD0JLQGX7K');</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(article.title)} | SuperBuyVIP</title><meta name="description" content="${escapeHtml(article.intro)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${site}${guideUrl(index)}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(article.title)}"><meta property="og:description" content="${escapeHtml(article.intro)}"><meta property="og:url" content="${site}${guideUrl(index)}"><meta property="og:image" content="${site}/products/product-01.webp"><meta property="article:published_time" content="${details.date}"><meta property="article:modified_time" content="${details.date}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(article.title)}"><meta name="twitter:description" content="${escapeHtml(article.intro)}"><meta name="twitter:image" content="${site}/products/product-01.webp"><style>${sharedCss}</style><script type="application/ld+json">${safeJson(schema)}</script></head><body><header class="top"><nav class="nav"><a class="brand" href="/">SUPERBUY <i>VIP</i></a><div class="navlinks"><a href="/#guides">LATEST GUIDES</a><a href="/guides/">ALL GUIDES</a></div></nav></header><section class="hero"><div class="hero-inner"><div class="eyebrow">${escapeHtml(article.tag)}</div><h1>${escapeHtml(article.title)}</h1><p class="dek">${escapeHtml(article.intro)}</p><div class="meta"><span>PUBLISHED <time datetime="${details.date}">${details.date}</time></span><span>${wordCount.toLocaleString("en-US")} WORDS</span><span>INDEPENDENT BUYER RESEARCH</span></div></div></section><main class="layout"><article class="article"><img class="cover" src="${guideImage(index)}" alt="${escapeHtml(article.title)} guide cover" width="1200" height="675"><p class="lead">${escapeHtml(article.intro)}</p>${articleHtml}<section class="faq"><h2>${escapeHtml(faq.title)}</h2>${faqHtml}</section></article><aside class="side"><b>RELATED GUIDES</b>${relatedHtml}<hr><a href="/">Superbuy spreadsheet</a><a href="/guides/">All buyer guides</a><div class="source-note">Research basis: current official Superbuy shopping, warehouse and shipping guidance. Confirm live prices, routes and policies inside your account.</div></aside></main><footer>SuperBuyVIP is an independent buyer-research website and is not affiliated with Superbuy.</footer></body></html>`;
  const articleDir = path.join(outputRoot, details.slug);
  await fs.mkdir(articleDir, { recursive: true });
  await fs.writeFile(path.join(articleDir, "index.html"), html, "utf8");
}

const collectionSchema = {"@context":"https://schema.org","@type":"CollectionPage",name:"All SuperBuyVIP Buyer Guides",url:`${site}/guides/`,hasPart:articles.map((article,index)=>({"@type":"Article",headline:article.title,url:`${site}${guideUrl(index)}`,datePublished:meta[index].date,image:`${site}${guideImage(index)}`}))};
const archiveCards = articles.map((article,index)=>`<article><img src="${guideImage(index)}" alt="" width="1200" height="675" loading="lazy"><div class="archive-card"><time datetime="${meta[index].date}">${meta[index].date}</time><h2><a href="${guideUrl(index)}">${escapeHtml(article.title)}</a></h2><p>${escapeHtml(article.intro)}</p><a class="read" href="${guideUrl(index)}">READ FULL GUIDE →</a></div></article>`).join("");
const archive = `<!doctype html><html lang="en"><head><!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-VD0JLQGX7K"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VD0JLQGX7K');</script><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>All Superbuy Buyer Guides 2026 | SuperBuyVIP</title><meta name="description" content="Browse 12 evidence-led Superbuy guides covering shipping cost, fees, Taobao and 1688 ordering, warehouse QC, customs and parcel planning."><meta name="robots" content="index,follow"><link rel="canonical" href="${site}/guides/"><meta property="og:type" content="website"><meta property="og:title" content="All Superbuy Buyer Guides 2026"><meta property="og:description" content="Twelve evidence-led guides for better Superbuy buying, warehouse and shipping decisions."><meta property="og:url" content="${site}/guides/"><meta property="og:image" content="${site}/products/product-01.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${site}/products/product-01.webp"><style>${sharedCss}</style><script type="application/ld+json">${safeJson(collectionSchema)}</script></head><body><header class="top"><nav class="nav"><a class="brand" href="/">SUPERBUY <i>VIP</i></a><div class="navlinks"><a href="/">PRODUCT INDEX</a><a href="/#guides">LATEST GUIDES</a></div></nav></header><section class="hero"><div class="hero-inner"><div class="eyebrow">DOCUMENT LIBRARY / 12</div><h1>All Superbuy buyer guides</h1><p class="dek">Twelve evidence-led guides for shipping cost, fees, marketplace ordering, warehouse QC, customs and parcel decisions.</p><div class="meta"><span>UPDATED 2026-09-20</span><span>3-COLUMN DESKTOP LIBRARY</span></div></div></section><main class="archive">${archiveCards}</main><footer>SuperBuyVIP is an independent buyer-research website and is not affiliated with Superbuy.</footer></body></html>`;
await fs.writeFile(path.join(outputRoot, "index.html"), archive, "utf8");

const sitemapRows = [
  `  <url><loc>${site}/</loc><lastmod>${meta[0].date}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
  `  <url><loc>${site}/guides/</loc><lastmod>${meta[0].date}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
  ...meta.map((details,index)=>`  <url><loc>${site}${guideUrl(index)}</loc><lastmod>${details.date}</lastmod><changefreq>monthly</changefreq><priority>${index < 6 ? "0.9" : "0.8"}</priority></url>`)
];
await fs.writeFile(path.join(root, "public/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRows.join("\n")}\n</urlset>\n`, "utf8");

console.log(`Generated ${articles.length} guides, covers, archive and sitemap.`);
