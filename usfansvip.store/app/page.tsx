"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, BriefcaseBusiness, Boxes, CheckCircle2, ChevronDown,
  CircleDot, ClipboardCheck, ExternalLink, Footprints, Headphones, Layers,
  Menu, PackageCheck, PanelTop, Search, Shirt, Sparkles, X,
} from "lucide-react";
import { categories, faqs, guides, mainSite, products } from "./site-data";

const iconMap={Footprints,Shirt,Sparkles,Layers,PanelTop,CircleDot,BriefcaseBusiness,Sparkles2:Sparkles,Headphones,Boxes};
const copy={
  EN:{nav:["Categories","Products","How it works","Guides","FAQ"],eyebrow:"YOUR FRIENDLY USFANS SPREADSHEET GUIDE",title:["The USFans","spreadsheet,","made easier."],desc:"A playful route into the USFans spreadsheet with direct categories, ten current finds and practical buyer guidance before you approve an international parcel.",search:"Search a brand, product or style",sheet:"Spreadsheet",explore:"Explore the directory",cats:"Choose your shopping lane",catsSub:"Ten colorful entrances to the matching sections on kakobuymake.com.",picks:"Fresh finds have landed",picksSub:"Ten current product leads arranged in a clean two-row shop window.",method:"Your parcel’s four-stop journey",guides:"Buyer guides worth saving",faq:"Clear answers before checkout",all:"View all buyer guides"},
  ES:{nav:["Categorías","Productos","Cómo funciona","Guías","Preguntas"],eyebrow:"DIRECTORIO INDEPENDIENTE DE USFANS",title:["La hoja USFans,","más clara,","más fácil."],desc:"Accesos directos al catálogo USFans, diez productos actuales y orientación práctica antes de aprobar un paquete internacional.",search:"Buscar marca, producto o estilo",sheet:"Hoja",explore:"Explorar directorio",cats:"Compra por categoría",catsSub:"Diez grandes entradas a las secciones correspondientes de kakobuymake.com.",picks:"Novedades de la hoja",picksSub:"Diez productos actuales en un escaparate de dos filas.",method:"Del hallazgo al paquete",guides:"Guías que vale la pena guardar",faq:"Respuestas antes de comprar",all:"Ver todas las guías"},
  FR:{nav:["Catégories","Produits","Fonctionnement","Guides","FAQ"],eyebrow:"RÉPERTOIRE USFANS INDÉPENDANT",title:["Le tableur USFans,","plus clair,","plus simple."],desc:"Accès directs au tableur USFans, dix trouvailles actuelles et conseils pratiques avant d’approuver un colis international.",search:"Rechercher une marque ou un article",sheet:"Tableur",explore:"Explorer le répertoire",cats:"Acheter par catégorie",catsSub:"Dix grands accès aux sections correspondantes de kakobuymake.com.",picks:"Nouveautés du tableur",picksSub:"Dix produits actuels dans une vitrine en deux rangées.",method:"Du produit au colis",guides:"Guides à conserver",faq:"Réponses avant l’achat",all:"Voir tous les guides"},
  DE:{nav:["Kategorien","Produkte","Ablauf","Ratgeber","FAQ"],eyebrow:"UNABHÄNGIGES USFANS-VERZEICHNIS",title:["Die USFans-Tabelle,","klarer,","einfacher."],desc:"Direkte Wege zur USFans-Tabelle, zehn aktuelle Funde und praktische Hinweise vor der Freigabe eines internationalen Pakets.",search:"Marke, Produkt oder Stil suchen",sheet:"Tabelle",explore:"Verzeichnis öffnen",cats:"Nach Kategorie kaufen",catsSub:"Zehn große Einstiege in die passenden Bereiche von kakobuymake.com.",picks:"Neu aus der Tabelle",picksSub:"Zehn aktuelle Produkte in einem Schaufenster mit zwei Reihen.",method:"Vom Fund zum Paket",guides:"Ratgeber zum Speichern",faq:"Antworten vor dem Kauf",all:"Alle Ratgeber ansehen"},
  IT:{nav:["Categorie","Prodotti","Come funziona","Guide","FAQ"],eyebrow:"DIRECTORY INDIPENDENTE USFANS",title:["Il foglio USFans,","più chiaro,","più semplice."],desc:"Accessi diretti al foglio USFans, dieci prodotti attuali e consigli pratici prima di approvare un pacco internazionale.",search:"Cerca marca, prodotto o stile",sheet:"Foglio",explore:"Esplora la directory",cats:"Acquista per categoria",catsSub:"Dieci grandi ingressi alle sezioni corrispondenti di kakobuymake.com.",picks:"Novità dal foglio",picksSub:"Dieci prodotti attuali in una vetrina su due righe.",method:"Dal prodotto al pacco",guides:"Guide da salvare",faq:"Risposte prima dell’acquisto",all:"Vedi tutte le guide"},
  PT:{nav:["Categorias","Produtos","Como funciona","Guias","FAQ"],eyebrow:"DIRETÓRIO INDEPENDENTE USFANS",title:["A planilha USFans,","mais clara,","mais fácil."],desc:"Rotas diretas para a planilha USFans, dez achados atuais e orientação prática antes de aprovar um pacote internacional.",search:"Buscar marca, produto ou estilo",sheet:"Planilha",explore:"Explorar diretório",cats:"Compre por categoria",catsSub:"Dez grandes entradas para as seções correspondentes de kakobuymake.com.",picks:"Novidades da planilha",picksSub:"Dez produtos atuais em uma vitrine de duas linhas.",method:"Do achado ao pacote",guides:"Guias para guardar",faq:"Respostas antes de comprar",all:"Ver todos os guias"},
  PL:{nav:["Kategorie","Produkty","Jak to działa","Poradniki","FAQ"],eyebrow:"NIEZALEŻNY KATALOG USFANS",title:["Arkusz USFans,","czytelniej,","prościej."],desc:"Bezpośrednie przejścia do arkusza USFans, dziesięć aktualnych ofert i praktyczne wskazówki przed wysyłką.",search:"Szukaj marki, produktu lub stylu",sheet:"Arkusz",explore:"Przeglądaj katalog",cats:"Kupuj według kategorii",catsSub:"Dziesięć dużych wejść do odpowiednich sekcji kakobuymake.com.",picks:"Nowości z arkusza",picksSub:"Dziesięć aktualnych produktów w dwurzędowej witrynie.",method:"Od produktu do paczki",guides:"Poradniki warte zapisania",faq:"Odpowiedzi przed zakupem",all:"Zobacz wszystkie poradniki"},
  ZH:{nav:["商品分类","精选商品","购买流程","买家指南","常见问题"],eyebrow:"独立 USFANS 商品目录",title:["USFans 电子表格，","更清晰，","更好用。"],desc:"直达 USFans 电子表格对应分类，展示十件当前商品，并在确认国际包裹前提供实用购买指南。",search:"搜索品牌、商品或款式",sheet:"电子表格",explore:"浏览商品目录",cats:"按分类浏览",catsSub:"十个大型入口直达 kakobuymake.com 对应分类。",picks:"电子表格最新精选",picksSub:"十件当前商品，以两行橱窗形式展示。",method:"从发现商品到提交包裹",guides:"值得保存的买家指南",faq:"下单前需要了解的问题",all:"查看全部买家指南"},
};

const steps=[
  ["01","DISCOVER","Open the live category or product page and confirm it still matches the find."],
  ["02","DOCUMENT","Save the seller URL, chosen version, color, size, price and size chart."],
  ["03","INSPECT","Use warehouse QC photos to compare labels, measurements and visible condition."],
  ["04","CONSOLIDATE","Choose packaging and a shipping route after weight and dimensions are known."],
];

export default function Home(){
  const [lang,setLang]=useState<keyof typeof copy>("EN");
  const [menu,setMenu]=useState(false);
  const [query,setQuery]=useState("");
  const [openFaq,setOpenFaq]=useState<number|null>(0);
  const t=copy[lang];
  const navLinks=useMemo(()=>["#categories","#products","#method","#guides","#faq"],[]);
  function submitSearch(e:React.FormEvent){e.preventDefault();const q=query.trim();window.open(q?`https://kakobuymake.com/?m=home&c=Search&a=lists&method=1&channelid=2&keywords=${encodeURIComponent(q)}`:mainSite,"_blank","noopener,noreferrer")}
  return <main className="cartoon-site" id="top">
    <section className="character-hero">
      <header className="floating-nav">
        <a className="brand" href="#top"><img className="brand-logo" src="/usfans-logo.png" alt="USFans"/><b>VIP</b></a>
        <nav className={menu?"open":""}>{t.nav.map((item,i)=><a href={navLinks[i]} key={item} onClick={()=>setMenu(false)}>{item}</a>)}</nav>
        <div className="nav-actions"><label><select value={lang} onChange={e=>setLang(e.target.value as keyof typeof copy)} aria-label="Language">{Object.keys(copy).map(x=><option key={x}>{x}</option>)}</select><ChevronDown size={13}/></label><a href={mainSite} target="_blank" rel="noreferrer">{t.sheet}<ExternalLink size={15}/></a><button onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X/>:<Menu/>}</button></div>
      </header>
      <div className="hero-copy">
        <p className="hero-kicker"><span>●</span>{t.eyebrow}</p>
        <h1>{t.title.map((line,i)=><span key={line} className={i===1?"violet":""}>{line}</span>)}</h1>
        <p className="hero-description">{t.desc}</p>
        <form className="hero-search" onSubmit={submitSearch}><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/><button>SEARCH <ArrowRight size={17}/></button></form>
        <div className="hero-actions"><a href="#categories">{t.explore}<ArrowDown size={17}/></a><a href={mainSite} target="_blank" rel="noreferrer">{t.sheet}<ExternalLink size={16}/></a></div>
      </div>
      <div className="character-stage" aria-hidden="true">
        <div className="stage-blob"></div><div className="stage-dots"></div>
        <img src="/usfansvip-character-hero-v2.png" alt=""/>
        <div className="float-card card-qc"><ClipboardCheck size={22}/><span><b>QC FIRST</b><small>Check before shipping</small></span></div>
        <div className="float-card card-find"><Sparkles size={22}/><span><b>10 FRESH FINDS</b><small>Current spreadsheet leads</small></span></div>
        <div className="float-card card-route"><PackageCheck size={22}/><span><b>4-STOP ROUTE</b><small>From find to parcel</small></span></div>
      </div>
      <div className="hero-wave"></div>
    </section>

    <section className="service-strip" aria-label="Quick buyer services">
      <a href="#categories"><span>01</span><div><small>START WITH</small><b>Category finder</b></div><ArrowRight/></a>
      <a href="#products"><span>02</span><div><small>BROWSE</small><b>Fresh arrivals</b></div><ArrowRight/></a>
      <a href="#method"><span>03</span><div><small>LEARN</small><b>QC & parcel route</b></div><ArrowRight/></a>
      <a href="#guides"><span>04</span><div><small>READ</small><b>Buyer field notes</b></div><ArrowRight/></a>
    </section>

    <div className="moving-lane"><div>SHOES <i>●</i> T-SHIRTS <i>●</i> OUTERWEAR <i>●</i> HOODIES <i>●</i> PANTS <i>●</i> BAGS <i>●</i> ELECTRONICS <i>●</i> QC PHOTOS <i>●</i> SHIPPING <i>●</i></div></div>

    <section className="town-section" id="categories">
      <header className="town-heading"><div><span>01</span><p>CHOOSE A DOOR</p></div><h2>{t.cats}</h2><p>{t.catsSub}</p></header>
      <div className="town-grid">{categories.map((cat,i)=>{const Icon=iconMap[cat.icon as keyof typeof iconMap]||Boxes;return <a href={cat.href} target="_blank" rel="noreferrer" key={cat.name} className={`town-stop stop-${i+1}`}><div className="category-number">{String(i+1).padStart(2,"0")}</div><div className="shop-window"><Icon/><i></i></div><div><h3>{cat.name}</h3><p>{cat.note}</p></div><ArrowRight className="category-arrow" size={18}/></a>})}</div>
    </section>

    <section className="conveyor-section" id="products">
      <header className="conveyor-heading"><div><span>02</span><p>MASCOT&apos;S PICKS</p></div><h2>{t.picks}</h2><p>{t.picksSub}</p></header>
      {[products.slice(0,5),products.slice(5,10)].map((row,r)=><div className="conveyor-row" key={r}><div className="belt-track">{row.map((p,i)=><a href={p.href} target="_blank" rel="noreferrer" key={p.name}><figure><img src={p.image} alt={p.name}/><span>{String(r*5+i+1).padStart(2,"0")}</span></figure><small>{p.category}</small><h3>{p.name}</h3><div><b>{p.price}</b><i>OPEN ↗</i></div></a>)}</div><div className="shelf-line"><span></span><span></span><span></span></div></div>)}
      <div className="conveyor-note"><p>Reference prices only. Confirm the live listing, option and availability before payment.</p><a href={mainSite} target="_blank" rel="noreferrer">OPEN ALL PRODUCTS <ArrowRight size={17}/></a></div>
    </section>

    <section className="route-section" id="method">
      <div className="route-copy"><span>03 / PARCEL ROUTE</span><h2>{t.method}</h2><p>One path, four checks. Each stop prevents a different kind of expensive mistake.</p><Link href="/guides/usfans-spreadsheet-buying-workflow">READ THE COMPLETE WORKFLOW <ArrowRight size={16}/></Link></div>
      <div className="route-map">{steps.map((s,i)=><article key={s[1]}><span>{s[0]}</span><div><small>STATION {i+1}</small><h3>{s[1]}</h3><p>{s[2]}</p></div><CheckCircle2 size={20}/></article>)}</div>
    </section>

    <section className="story-section" id="guides">
      <header><span>04 / BUYER STORIES</span><h2>{t.guides}</h2><p>Three practical field guides for the decisions between “found it” and “shipped it.”</p></header>
      <div className="story-layout"><Link className="lead-story" href={`/guides/${guides[0].slug}`}><span>FEATURED GUIDE · {guides[0].readTime}</span><b>01</b><h3>{guides[0].title}</h3><p>{guides[0].excerpt}</p><strong>READ FEATURE <ArrowRight size={17}/></strong></Link><div>{guides.slice(1).map((g,i)=><Link href={`/guides/${g.slug}`} key={g.slug}><span>FIELD NOTE 0{i+2}</span><div><small>{g.tag} · {g.readTime}</small><h3>{g.title}</h3><p>{g.excerpt}</p></div><ArrowRight/></Link>)}</div></div>
      <Link className="story-all" href="/guides">{t.all}<ArrowRight size={17}/></Link>
    </section>

    <section className="help-section" id="faq">
      <div className="help-card"><span>05 / HELP DESK</span><h2>{t.faq}</h2><p>Ten direct answers about product links, warehouse QC, returns, prices and international shipping.</p><div className="mini-mascot"><i>✓</i><b>Need a checklist?</b><span>Open one answer at a time and keep the details useful.</span></div></div>
      <div className="help-list">{faqs.map((faq,i)=><article className={openFaq===i?"active":""} key={faq.q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>{String(i+1).padStart(2,"0")}</span><b>{faq.q}</b><i>{openFaq===i?"−":"+"}</i></button><div><p>{faq.a}</p></div></article>)}</div>
    </section>

    <section className="departure"><span>READY FOR DEPARTURE?</span><h2>Your next find<br/>starts here.</h2><a href={mainSite} target="_blank" rel="noreferrer">{t.sheet}<ExternalLink size={18}/></a></section>
    <footer><a className="brand brand-on-dark" href="#top"><img className="brand-logo" src="/usfans-logo.png" alt="USFans"/><b>VIP</b></a><p>Independent product discovery and buyer education. Not affiliated with USFans, Taobao, Weidian, 1688 or the brands shown. Verify all live information before payment or shipment.</p><small>© 2026 USFansVIP.store</small></footer>
  </main>;
}
