"use client";

import { useEffect, useMemo, useState } from "react";
import locales from "./content.json";
import longGuides from "./articles.json";
import deGuides from "./articles-de.json";
import frGuides from "./articles-fr.json";
import esGuides from "./articles-es.json";
import itGuides from "./articles-it.json";
import ptGuides from "./articles-pt.json";
import zhGuides from "./articles-zh.json";
import articleFaqs from "./article-faqs.json";

type Lang = keyof typeof locales;

const products = [
  { n:"01", category:"T-Shirts", price:"$20.09", image:"/products/product-01.webp", link:"https://kakobuymake.com/?a=index&aid=2511&c=View&m=home" },
  { n:"02", category:"Pants", price:"$10.04", image:"/products/product-02.webp", link:"https://kakobuymake.com/?a=index&aid=2510&c=View&m=home" },
  { n:"03", category:"Shoes", price:"$18.20", image:"/products/product-03.webp", link:"https://kakobuymake.com/?a=index&aid=2507&c=View&m=home" },
  { n:"04", category:"Hoodies", price:"$19.00", image:"/products/product-04.webp", link:"https://kakobuymake.com/?a=index&aid=2506&c=View&m=home" },
  { n:"05", category:"Shoes", price:"$44.24", image:"/products/product-05.webp", link:"https://kakobuymake.com/?a=index&aid=2505&c=View&m=home" },
  { n:"06", category:"Jackets", price:"$21.23", image:"/products/product-06.webp", link:"https://kakobuymake.com/?a=index&aid=2498&c=View&m=home" },
  { n:"07", category:"Other finds", price:"$22.67", image:"/products/product-07.webp", link:"https://kakobuymake.com/?a=index&aid=2497&c=View&m=home" },
  { n:"08", category:"Jackets", price:"$28.55", image:"/products/product-08.webp", link:"https://kakobuymake.com/?a=index&aid=2491&c=View&m=home" },
  { n:"09", category:"Bags", price:"$9.33", image:"/products/product-09.webp", link:"https://kakobuymake.com/?a=index&aid=2483&c=View&m=home" },
  { n:"10", category:"Accessories", price:"$1.08", image:"/products/product-10.webp", link:"https://kakobuymake.com/?a=index&aid=2480&c=View&m=home" },
];

const categoryKeys = ["Shoes","Hoodies","T-Shirts","Jackets","Pants","Bags","Accessories","Electronics","Headwear","Other finds"] as const;
const categoryLinks = [
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=2",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=5",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=3",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=4",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=6",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=8",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=7",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=10",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=11",
  "https://kakobuymake.com/?a=index&c=Lists&m=home&tid=11"
];
const languageCodes = Object.keys(locales) as Lang[];
const allGuideLabels: Record<Lang,string> = {
  en:"VIEW ALL BUYER GUIDES", de:"ALLE RATGEBER ANZEIGEN", fr:"VOIR TOUS LES GUIDES", es:"VER TODAS LAS GUÍAS",
  it:"VEDI TUTTE LE GUIDE", pt:"VER TODOS OS GUIAS", zh:"查看全部购买指南"
};
const guideLibraryTitles: Record<Lang,string> = {
  en:"All buyer guides", de:"Alle Kaufratgeber", fr:"Tous les guides d’achat", es:"Todas las guías de compra",
  it:"Tutte le guide all’acquisto", pt:"Todos os guias de compra", zh:"全部购买指南"
};
const guideLibraryDescriptions: Record<Lang,string> = {
  en:"Six original, evidence-led Superbuy guides researched from the current official shopping, warehouse and shipping workflow.",
  de:"Sechs eigenständige, belegbasierte Superbuy-Ratgeber auf Grundlage des aktuellen offiziellen Einkaufs-, Lager- und Versandablaufs.",
  fr:"Six guides Superbuy originaux et fondés sur des preuves, issus du parcours officiel actuel d’achat, d’entrepôt et d’expédition.",
  es:"Seis guías originales de Superbuy, basadas en pruebas y en el flujo oficial actual de compra, almacén y envío.",
  it:"Sei guide originali Superbuy, basate su prove e sull’attuale flusso ufficiale di acquisto, magazzino e spedizione.",
  pt:"Seis guias originais da Superbuy, baseados em evidências e no fluxo oficial atual de compra, armazém e envio.",
  zh:"六篇基于 Superbuy 当前官方购买、仓储和国际运输流程研究的原创实用指南。"
};
const editionLabels: Record<Lang,string> = {
  en:"WORDS",de:"VOLLSTÄNDIGE ÜBERSETZUNG",fr:"VERSION INTÉGRALE",es:"TRADUCCIÓN COMPLETA",it:"TRADUZIONE COMPLETA",pt:"TRADUÇÃO COMPLETA",zh:"完整译文"
};
const guidesByLanguage: Record<Lang,typeof longGuides> = {en:longGuides,de:[longGuides[0],...deGuides],fr:[longGuides[0],...frGuides],es:[longGuides[0],...esGuides],it:[longGuides[0],...itGuides],pt:[longGuides[0],...ptGuides],zh:[longGuides[0],...zhGuides]};
const articleFaqsByLanguage: Record<Lang,typeof articleFaqs.en> = {en:articleFaqs.en,de:[articleFaqs.en[0],...articleFaqs.de],fr:[articleFaqs.en[0],...articleFaqs.fr],es:[articleFaqs.en[0],...articleFaqs.es],it:[articleFaqs.en[0],...articleFaqs.it],pt:[articleFaqs.en[0],...articleFaqs.pt],zh:[articleFaqs.en[0],...articleFaqs.zh]};
const guideUrls = [
  "/guides/superbuy-parcel-forwarding-intake-playbook/",
  "/guides/superbuy-1688-buying-risk-playbook/",
  "/guides/superbuy-consolidation-packaging-playbook/",
  "/guides/superbuy-warehouse-qc-system/",
  "/guides/superbuy-landed-cost-framework/",
  "/guides/superbuy-spreadsheet-operating-system/"
];
const articleDates = ["2026-08-28","2026-08-27","2026-08-21","2026-08-17","2026-08-17","2026-08-17"];
const articleWordCounts = longGuides.map((guide,index) => [guide.title,guide.intro,...guide.body,articleFaqs.en[index].title,...articleFaqs.en[index].items.flat()].join(" ").replaceAll("## ","").match(/[A-Za-z0-9’'-]+/g)?.length || 0);
const articleSchema = {
  "@context":"https://schema.org",
  "@graph":longGuides.map((guide,index)=>({
    "@type":"Article",
    headline:guide.title,
    description:guide.intro,
    datePublished:articleDates[index],
    dateModified:articleDates[index],
    inLanguage:"en",
    author:{"@type":"Organization",name:"SuperBuyVIP"},
    publisher:{"@type":"Organization",name:"SuperBuyVIP"},
    mainEntityOfPage:`https://superbuyvip.pro${guideUrls[index]}`,
    hasPart:articleFaqs.en[index].items.map(item=>({"@type":"Question",name:item[0],acceptedAnswer:{"@type":"Answer",text:item[1]}}))
  }))
};
const researchNotes: Record<Lang,string> = {
  en:"Research basis: current Superbuy official shopping-agent, warehousing and fee guidance. Confirm live policy details inside your account.",
  de:"Recherchebasis: aktuelle offizielle Superbuy-Hinweise zu Einkaufsservice, Lagerung und Gebühren. Prüfe die aktuellen Bedingungen in deinem Konto.",
  fr:"Base de recherche : directives officielles actuelles de Superbuy sur l’achat, l’entreposage et les frais. Vérifiez les conditions dans votre compte.",
  es:"Base de la investigación: orientación oficial actual de Superbuy sobre compras, almacén y tarifas. Confirma las condiciones vigentes en tu cuenta.",
  it:"Base della ricerca: indicazioni ufficiali attuali di Superbuy su acquisti, magazzino e tariffe. Verifica le condizioni nel tuo account.",
  pt:"Base da pesquisa: orientações oficiais atuais da Superbuy sobre compras, armazenamento e taxas. Confirme os termos atuais na sua conta.",
  zh:"研究依据：Superbuy 当前公开的代购、仓储和费用说明。实际操作前请在个人账户中确认最新政策。"
};

function Arrow(){ return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>; }

const categoryPaths: Record<typeof categoryKeys[number],string[]> = {
  Shoes:["M3.5 14.5c3.5.2 5.7-1 7.1-3.7l2.5 2.3c1.6 1.5 3.4 2.3 5.4 2.4 1.2.1 2 .8 2 1.8v1.2H4.7c-1.3 0-2.2-.8-2.2-2 0-.7.3-1.4 1-2Z","M8.8 12.9l2.3 1.8m1.3-2.3 2.1 1.7"],
  Hoodies:["M8 5.4A4.6 4.6 0 0 1 12 3a4.6 4.6 0 0 1 4 2.4l3.4 3.2-2.3 3.1-1.4-1.1v9H8.3v-9l-1.4 1.1-2.3-3.1L8 5.4Z","M9.1 6.2c.7 1.3 1.7 2 2.9 2s2.2-.7 2.9-2M12 8.2v4.1m-2 0h4"],
  "T-Shirts":["m8.1 4.4 3.9 1.8 3.9-1.8 4.2 3.2-2.3 3.1-2-1.3v10.2H8.2V9.4l-2 1.3-2.3-3.1 4.2-3.2Z","M10.1 5.3c.4 1.1 1 1.6 1.9 1.6s1.5-.5 1.9-1.6"],
  Jackets:["m8.4 4.2 3.6 1.9 3.6-1.9 2.9 2.6 2 11.8-4.7 1V9.5l-1.4 1.3H9.6L8.2 9.5v10.1l-4.7-1 2-11.8 2.9-2.6Z","M12 6.2v13.2m0-8.6-2.4-2.4m2.4 2.4 2.4-2.4"],
  Pants:["M8 4h8l1 6.1-2.1 9.9h-4l1.1-9.4L13.1 20h-4L7 10.1 8 4Z","M12 4v6.6"],
  Bags:["M5 8h14l1 11H4L5 8Z","M9 8V6.5C9 5.1 10.2 4 12 4s3 1.1 3 2.5V8","M8 12h8"],
  Accessories:["M8.5 6.4V3.5h7v2.9m0 11.2v2.9h-7v-2.9","M7 7.8c0-.8.7-1.4 1.5-1.4h7c.8 0 1.5.6 1.5 1.4v8.4c0 .8-.7 1.4-1.5 1.4h-7c-.8 0-1.5-.6-1.5-1.4V7.8Z","M12 9v3l2 1.2"],
  Electronics:["M7.5 3.5h9c.8 0 1.5.7 1.5 1.5v14c0 .8-.7 1.5-1.5 1.5h-9C6.7 20.5 6 19.8 6 19V5c0-.8.7-1.5 1.5-1.5Z","M9 6h6m-4 11h2"],
  Headwear:["M4 13c1.2-4.7 4-7 8.2-7 4 0 6.4 2.3 7.3 7H4Z","M4 13h16.5c.8 0 1.5.6 1.5 1.4 0 .9-.7 1.6-1.5 1.6h-6.3","M12.2 6v7"],
  "Other finds":["m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z","m4 7.2 8 4.3 8-4.3M12 11.5V21","m8.2 5.1 8 4.3"]
};

function CategoryIcon({category}:{category:typeof categoryKeys[number]}){
  return <span className="category-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{categoryPaths[category].map((path,index)=><path key={index} d={path}/>)}</svg></span>;
}

export default function Home(){
  const [lang,setLang]=useState<Lang>("en");
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState("number");
  const [menu,setMenu]=useState(false);
  const [article,setArticle]=useState<number|null>(null);
  const [guideLibrary,setGuideLibrary]=useState(false);
  const [faq,setFaq]=useState<number|null>(0);
  const [parcel,setParcel]=useState({weight:"3200",length:"42",width:"31",height:"24"});
  const copy=locales[lang];
  const guides=guidesByLanguage[lang];
  const articleMeta=(index:number)=>lang==="en"?`${articleWordCounts[index].toLocaleString("en-US")} ${editionLabels.en}`:editionLabels[lang];

  useEffect(()=>{ const saved=window.localStorage.getItem("sbvip-language") as Lang|null; const timer=window.setTimeout(()=>{ if(saved&&saved in locales)setLang(saved); },0); return()=>window.clearTimeout(timer); },[]);
  useEffect(()=>{ document.documentElement.lang=lang; window.localStorage.setItem("sbvip-language",lang); },[lang]);

  const productView=useMemo(()=>products.map((product,index)=>({
    ...product,index,title:copy.products[index][0],check:copy.products[index][1],displayCategory:copy.categories[categoryKeys.indexOf(product.category as typeof categoryKeys[number])]?.[0]||product.category
  })),[copy]);
  const filtered=useMemo(()=>productView
    .filter(p=>`${p.title} ${p.displayCategory} ${p.check}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b)=>sort==="name"?a.title.localeCompare(b.title,lang):sort==="category"?a.displayCategory.localeCompare(b.displayCategory,lang):a.n.localeCompare(b.n)),[productView,query,sort,lang]);
  const actual=(Number(parcel.weight)||0)/1000;
  const volume=((Number(parcel.length)||0)*(Number(parcel.width)||0)*(Number(parcel.height)||0))/6000;
  const planned=Math.max(actual,volume);
  const setLanguage=(value:string)=>{ setLang(value as Lang); setArticle(null); setGuideLibrary(false); };

  return <main id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}} />
    <header>
      <a className="logo" href="#top"><span>S</span><b>SUPERBUY <i>VIP</i></b></a>
      <nav className={menu?"open":""}>{copy.nav.map((item,index)=><a key={item} data-i18n={`nav.${index}`} href={["#categories","#index","#calculator","#guides","#faq"][index]} onClick={()=>setMenu(false)}>{item}</a>)}</nav>
      <div className="header-actions">
        <span className="live-dot"><i></i><span data-i18n="online">{copy.online}</span></span>
        <label className="language-select" aria-label="Language"><span>{lang.toUpperCase()}</span><select value={lang} onChange={e=>setLanguage(e.target.value)}>{languageCodes.map(code=><option key={code} value={code}>{locales[code].label}</option>)}</select></label>
        <a className="spreadsheet-link" href="https://kakobuymake.com/" target="_blank" rel="noreferrer"><span data-i18n="spreadsheet">{copy.spreadsheet}</span> <Arrow/></a>
      </div>
      <button className="menu" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu"><i></i><i></i></button>
    </header>

    <section className="finder-hero">
      <div className="sheet-columns" aria-hidden="true"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span></div>
      <div className="hero-cell-mark" aria-hidden="true">A1</div>
      <div className="hero-core">
        <p><i></i> <span data-i18n="heroKicker">{copy.heroKicker}</span></p>
        <h1><span data-i18n="heroTitle.0">{copy.heroTitle[0]}</span><br/><em data-i18n="heroTitle.1">{copy.heroTitle[1]}</em></h1>
        <span data-i18n="heroText">{copy.heroText}</span>
        <div className="hero-search"><label><b>⌕</b><input value={query} onChange={e=>setQuery(e.target.value)} data-i18n-placeholder="heroSearch" placeholder={copy.heroSearch}/></label><a href="#index"><span data-i18n="heroButton">{copy.heroButton}</span> <Arrow/></a></div>
        <div className="hero-filters"><span data-i18n="popular">{copy.popular}</span>{[0,1,5,7].map(index=><a key={categoryKeys[index]} href="#index" data-i18n={`categories.${index}.0`}>{copy.categories[index][0]}</a>)}</div>
      </div>
      <div className="hero-records">
        <div className="record-label"><span data-i18n="recent">{copy.recent}</span><b data-i18n="recordCount">{copy.recordCount}</b></div>
        {productView.slice(0,4).map(p=><a key={p.n} href={p.link} target="_blank" rel="noreferrer" data-index={p.index}><span>{p.n}</span><img src={p.image} alt={p.title}/><div><b data-i18n={`products.${p.index}.0`}>{p.title}</b><small><span data-category={p.category}>{p.displayCategory}</span> · {p.price}</small></div></a>)}
      </div>
      <dl className="hero-stats">{copy.stats.map((label,index)=><div key={index}><dt data-i18n={`stats.${index}`}>{label}</dt><dd>{["10","10","10","AUG 17"][index]}</dd></div>)}</dl>
    </section>

    <section className="category-directory" id="categories">
      <div className="category-heading"><div><span data-i18n="categoryLabel">{copy.categoryLabel}</span><h2 data-i18n="categoryTitle">{copy.categoryTitle}</h2></div><p data-i18n="categoryText">{copy.categoryText}</p></div>
      <div className="category-board">{categoryKeys.map((key,index)=><a key={key} data-index={index} href={categoryLinks[index]} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,"0")}</span><CategoryIcon category={key}/><div><b data-i18n={`categories.${index}.0`}>{copy.categories[index][0]}</b><small data-i18n={`categories.${index}.1`}>{copy.categories[index][1]}</small></div><i>↗</i></a>)}</div>
    </section>

    <div className="sheet-shell">
      <section className="index-panel" id="index">
        <div className="panel-bar"><div><i></i><b>PRODUCT_INDEX.csv</b><span data-i18n="filePreview">{copy.filePreview}</span></div><a href="https://kakobuymake.com/" target="_blank" rel="noreferrer"><span data-i18n="master">{copy.master}</span> ↗</a></div>
        <div className="find-tools sort-only">
          <div className="sort-box"><span data-i18n="sort">{copy.sort}</span><select value={sort} onChange={e=>setSort(e.target.value)}>{copy.sortOptions.map((item,index)=><option key={index} data-i18n={`sortOptions.${index}`} value={["number","name","category"][index]}>{item}</option>)}</select></div>
        </div>
        <div className="table-wrap">
          <div className="table-head">{copy.tableHeaders.map((item,index)=><span key={index} data-i18n={`tableHeaders.${index}`}>{item}</span>)}<span></span></div>
          <div className="product-grid">{filtered.map(p=><article key={p.n} data-index={p.index} data-category={p.category}>
            <span className="row-number">{p.n}</span>
            <a className="product-photo" href={p.link} target="_blank" rel="noreferrer"><img src={p.image} alt={p.title}/><h3 data-i18n={`products.${p.index}.0`}>{p.title}</h3></a>
            <div className="product-line"><span data-category={p.category}>{p.displayCategory}</span></div>
            <b className="product-price">{p.price}</b>
            <p data-i18n={`products.${p.index}.1`}>{p.check}</p>
            <time dateTime="2026-08-17">2026-08-17</time>
            <a className="product-link" href={p.link} target="_blank" rel="noreferrer" aria-label={`View ${p.title}`}><Arrow/></a>
          </article>)}</div>
          <p className="no-results" data-i18n="noResults" style={{display:filtered.length?"none":"block"}}>{copy.noResults}</p>
        </div>
        <div className="table-status"><span>{copy.showing.replace("{shown}",String(filtered.length)).replace("{total}",String(products.length))}</span><span data-i18n="illustrative">{copy.illustrative}</span></div>
      </section>

      <section className="utility-grid">
        <div className="calculator" id="calculator">
          <div className="utility-title"><span data-i18n="calculator.label">{copy.calculator.label}</span><h2 data-i18n="calculator.title">{copy.calculator.title}</h2><p data-i18n="calculator.text">{copy.calculator.text}</p></div>
          <div className="calc-form">
            <div className="calc-inputs">{[["weight","g"],["length","cm"],["width","cm"],["height","cm"]].map((item,index)=><label key={item[0]}><span data-i18n={`calculator.inputs.${index}`}>{copy.calculator.inputs[index]}</span><div><input type="number" value={parcel[item[0] as keyof typeof parcel]} onChange={e=>setParcel({...parcel,[item[0]]:e.target.value})}/><b>{item[1]}</b></div></label>)}</div>
            <div className="calc-results">{[actual,volume,planned].map((value,index)=><div key={index}><span data-i18n={`calculator.results.${index}`}>{copy.calculator.results[index]}</span><b>{value.toFixed(2)} kg</b></div>)}</div>
            <p data-planner-advice>{volume>actual?copy.calculator.box:copy.calculator.scale}</p>
          </div>
        </div>

        <div className="workflow" id="method">
          <div className="utility-title"><span data-i18n="workflowLabel">{copy.workflowLabel}</span><h2 data-i18n="workflowTitle">{copy.workflowTitle}</h2></div>
          <ol>{copy.workflow.map((item,index)=><li key={index}><span>{String(index+1).padStart(2,"0")}</span><div><b data-i18n={`workflow.${index}.0`}>{item[0]}</b><p data-i18n={`workflow.${index}.1`}>{item[1]}</p></div><i>□</i></li>)}</ol>
        </div>
      </section>

      <section className="guides" id="guides">
        <div className="section-row"><div><span data-i18n="guidesLabel">{copy.guidesLabel}</span><h2 data-i18n="guidesTitle">{copy.guidesTitle}</h2></div><p data-i18n="guidesText">{copy.guidesText}</p></div>
        <div className="guide-list">{guides.slice(0,3).map((guide,index)=><article key={index} data-index={index}><span>DOC-0{index+1}</span><div><b>{guide.tag}</b><h3>{guide.title}</h3><p>{guide.intro}</p></div><button onClick={()=>{window.location.href=guideUrls[index];}}><span data-i18n="open">{copy.open}</span> <Arrow/></button></article>)}</div>
        <div className="all-guides-bar"><button data-open-all-guides onClick={()=>{window.location.href="/guides/";}}><span data-all-guides-label>{allGuideLabels[lang]}</span> <Arrow/></button></div>
      </section>

      <section className="faq" id="faq">
        <div className="section-row"><div><span data-i18n="faqLabel">{copy.faqLabel}</span><h2 data-i18n="faqTitle">{copy.faqTitle}</h2></div><p data-i18n="faqText">{copy.faqText}</p></div>
        <div className="faq-list">{copy.faqs.map((item,index)=><article key={index} data-index={index} className={faq===index?"open":""}><button onClick={()=>setFaq(faq===index?null:index)} aria-expanded={faq===index}><span>{String(index+1).padStart(2,"0")}</span><b data-i18n={`faqs.${index}.0`}>{item[0]}</b><i>{faq===index?"−":"+"}</i></button><div><p data-i18n={`faqs.${index}.1`}>{item[1]}</p></div></article>)}</div>
      </section>
    </div>

    <footer><a className="logo" href="#top"><span>S</span><b>SUPERBUY <i>VIP</i></b></a><p data-i18n="footer">{copy.footer}</p><div>{[1,2,3,4].map(index=><a key={index} data-i18n={`nav.${index}`} href={["#top","#index","#calculator","#guides","#faq"][index]}>{copy.nav[index]}</a>)}</div><small>© 2026 SUPERBUYVIP.PRO</small></footer>

    <div className={`modal ${guideLibrary?"":"is-hidden"}`} onMouseDown={()=>setGuideLibrary(false)}><article className="library-modal" onMouseDown={e=>e.stopPropagation()}><button onClick={()=>setGuideLibrary(false)} aria-label="Close guide library">×</button><span>DOCUMENT LIBRARY / 06</span><h2 data-guide-library-title>{guideLibraryTitles[lang]}</h2><p className="lead" data-guide-library-description>{guideLibraryDescriptions[lang]}</p><div className="guide-library">{guides.map((guide,index)=><article key={index}><span>DOC-0{index+1}</span><div><b>{guide.tag}</b><h3>{guide.title}</h3><p>{guide.intro}</p><small>{articleMeta(index)} · {articleDates[index]}</small></div><button onClick={()=>{window.location.href=guideUrls[index];}}><span data-i18n="open">{copy.open}</span> <Arrow/></button></article>)}</div></article></div>
    {guides.map((guide,guideIndex)=><div key={guideIndex} id={`guide-${guideIndex+1}`} className={`modal ${article===guideIndex?"":"is-hidden"}`} onMouseDown={()=>setArticle(null)}><article className="article-modal" onMouseDown={e=>e.stopPropagation()}><button onClick={()=>setArticle(null)} aria-label="Close article">×</button><span>{guide.tag} · {articleMeta(guideIndex)}</span><h2>{guide.title}</h2><p className="lead">{guide.intro}</p><section className="article-body">{guide.body.map((paragraph,index)=>paragraph.startsWith("## ")?<h3 key={index}>{paragraph.slice(3)}</h3>:<p key={index}>{paragraph}</p>)}</section><section className="article-faqs" data-article-faqs><h3>{articleFaqsByLanguage[lang][guideIndex].title}</h3>{articleFaqsByLanguage[lang][guideIndex].items.map((item,index)=><details key={index}><summary><span>{String(index+1).padStart(2,"0")}</span><b>{item[0]}</b><i>+</i></summary><p>{item[1]}</p></details>)}</section><div>{researchNotes[lang]}</div></article></div>)}
  </main>;
}
