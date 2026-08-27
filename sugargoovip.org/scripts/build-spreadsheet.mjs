import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const categories = [
  [2, "Shoes / Slippers"], [3, "T-Shirts"], [4, "Fashion Clothing"],
  [5, "Hoodies"], [6, "Pants / Trousers"], [7, "Leather Belts"],
  [8, "Fashion Bags"], [9, "Perfume"], [10, "Electronics"], [11, "Other Finds"],
];

const textDecode = (value) => value
  .replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"')
  .replaceAll(/<[^>]*>/g, "").replaceAll(/\s+/g, " ").trim();
const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const records = [];
for (const [tid, category] of categories) {
  const categoryRecords = [];
  for (const page of [1, 2, 6, 10]) {
    const url = `https://kakobuymake.com/?a=index&c=Lists&m=home&tid=${tid}&page=${page}`;
    const response = await fetch(url);
    if (response.status === 404) continue;
    if (!response.ok) throw new Error(`Could not read ${url}: ${response.status}`);
    const html = await response.text();
    const pattern = /<a href="\/\?m=home&c=View&a=index&aid=(\d+)" class="product-card"[\s\S]*?<img src="([^"]+)"[\s\S]*?<h3 class="product-title">([\s\S]*?)<\/h3>[\s\S]*?<span class="price">\$([\d.]+)<\/span>/g;
    for (const match of html.matchAll(pattern)) {
      categoryRecords.push({
        id: Number(match[1]), name: textDecode(match[3]), category,
        price: Number(match[4]), image: new URL(match[2], "https://kakobuymake.com/").href,
        href: `https://kakobuymake.com/?m=home&c=View&a=index&aid=${match[1]}`,
      });
    }
  }
  records.push(...[...new Map(categoryRecords.map((item) => [item.id, item])).values()].slice(0, 18));
}

const products = [...new Map(records.map((item) => [item.id, item])).values()];
if (products.length < 100 || new Set(products.map((item) => item.category)).size !== 10) {
  throw new Error(`Catalog validation failed: ${products.length} products across ${new Set(products.map((item) => item.category)).size} categories.`);
}

const checked = new Date().toISOString().slice(0, 10);
const maxPrice = Math.max(100, Math.ceil(Math.max(...products.map((item) => item.price)) / 25) * 25);
const counts = Object.fromEntries(categories.map(([, name]) => [name, products.filter((item) => item.category === name).length]));
const productMarkup = products.map((product) => `
          <article class="product" data-name="${esc(product.name.toLowerCase())}" data-category="${esc(product.category)}" data-price="${product.price}" data-status="listed">
            <a class="product-link" href="${esc(product.href)}" target="_blank" rel="noopener" aria-label="Open ${esc(product.name)} on KakobuyMake">
              <span class="product-main"><img src="${esc(product.image)}" alt="${esc(product.name)}" width="96" height="96" loading="lazy"><span class="product-copy"><strong>${esc(product.name)}</strong><small>FIND #${product.id}</small></span></span>
              <span class="product-category">${esc(product.category)}</span>
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <time datetime="${checked}">${checked}</time>
              <span class="status"><i></i>Listed</span>
              <span class="open" aria-hidden="true">↗</span>
            </a>
          </article>`).join("");

const itemList = products.map((product, index) => ({
  "@type": "ListItem", position: index + 1, name: product.name, url: product.href,
}));

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Sugargoo Spreadsheet 2026: ${products.length} Product Finds | SugargooVIP</title>
  <meta name="description" content="Search ${products.length} current Sugargoo spreadsheet finds across 10 categories. Filter by product, category and price, then open the live KakobuyMake listing.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://sugargoovip.org/spreadsheet/">
  <link rel="icon" href="../favicon.png" type="image/png">
  <meta property="og:type" content="website"><meta property="og:url" content="https://sugargoovip.org/spreadsheet/">
  <meta property="og:title" content="Sugargoo Spreadsheet 2026: ${products.length} Product Finds">
  <meta property="og:description" content="A searchable Sugargoo product directory with 10 categories, current prices and direct listing routes.">
  <meta property="og:image" content="https://sugargoovip.org/assets/image-6f0e9cf8a7e9.jpg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://sugargoovip.org/assets/image-6f0e9cf8a7e9.jpg">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@graph": [
      { "@type": "CollectionPage", "@id": "https://sugargoovip.org/spreadsheet/#page", name: `Sugargoo Spreadsheet 2026: ${products.length} Product Finds`, url: "https://sugargoovip.org/spreadsheet/", description: "A searchable independent product directory with category, price and catalog-review information.", isPartOf: { "@id": "https://sugargoovip.org/#website" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://sugargoovip.org/" },
        { "@type": "ListItem", position: 2, name: "Sugargoo Spreadsheet", item: "https://sugargoovip.org/spreadsheet/" },
      ] },
      { "@type": "ItemList", name: "Sugargoo Spreadsheet Product Finds", numberOfItems: products.length, itemListElement: itemList },
    ],
  })}</script>
  <style>
    :root{--paper:#f3f1eb;--ink:#171714;--signal:#ff5c35;--green:#24734c;--line:rgba(23,23,20,.13);--muted:#6f6d65}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif;text-rendering:optimizeLegibility}a{color:inherit}.shell{width:min(1500px,calc(100% - 48px));margin:auto}.header{position:sticky;top:0;z-index:40;height:66px;background:rgba(243,241,235,.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}.header .shell{height:100%;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:11px;text-decoration:none;font-size:19px;font-weight:900;letter-spacing:-.05em}.brand img{width:39px;height:39px;object-fit:contain;border-radius:50%}.brand b{color:var(--signal)}.updated{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em}.updated:before{content:"";width:8px;height:8px;border-radius:50%;background:#27a46b;box-shadow:0 0 0 4px rgba(39,164,107,.13)}.back{text-decoration:none;font-size:12px;font-weight:800}.hero{background:var(--ink);color:#fff;border-bottom:1px solid #000}.hero .shell{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:36px;align-items:end;padding:46px 0}.tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.tag{border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:7px 11px;color:rgba(255,255,255,.65);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.16em}.tag:first-child{background:var(--signal);border-color:var(--signal);color:#fff}.hero h1{max-width:880px;margin:0;font-size:clamp(43px,5.8vw,79px);line-height:.94;letter-spacing:-.065em}.hero p{max-width:710px;margin:19px 0 0;color:rgba(255,255,255,.64);font-size:15px;line-height:1.6}.stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(255,255,255,.16);border-radius:17px;background:rgba(255,255,255,.04);padding:15px 4px}.stat{min-width:105px;text-align:center;border-right:1px solid rgba(255,255,255,.14)}.stat:last-child{border:0}.stat strong{display:block;font-size:25px}.stat small{display:block;margin-top:5px;color:rgba(255,255,255,.5);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.15em}.breadcrumb{padding:16px 0 0;color:var(--muted);font-size:11px}.breadcrumb a{text-decoration:none}.layout{display:grid;grid-template-columns:240px minmax(0,1fr);gap:24px;padding:22px 0 55px}.sidebar{position:sticky;top:88px;align-self:start}.side-title{display:flex;align-items:center;gap:8px;margin:0 0 10px;color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.15em}.category-nav{overflow:hidden;border:1px solid var(--line);border-radius:17px;background:#fff}.category-nav button{width:100%;display:flex;justify-content:space-between;border:0;border-bottom:1px solid var(--line);background:#fff;padding:13px 14px;text-align:left;font-size:12px;cursor:pointer}.category-nav button:last-child{border:0}.category-nav button:hover{background:#f6f4ee}.category-nav button.active{background:var(--ink);color:#fff;font-weight:800}.category-nav button:first-child.active{background:var(--signal)}.category-nav small{opacity:.45}.side-note{margin-top:16px;border:1px solid var(--line);border-radius:17px;background:#dce8dd;padding:17px}.side-note b{display:block;margin-bottom:7px}.side-note p{margin:0;color:#4f6255;font-size:11px;line-height:1.55}.controls{border:1px solid var(--line);border-radius:18px;background:#fff;padding:14px;box-shadow:0 12px 45px rgba(30,25,18,.05)}.control-grid{display:grid;grid-template-columns:minmax(250px,1fr) 160px 175px;gap:10px}.search{position:relative}.search:before{content:"⌕";position:absolute;left:13px;top:8px;color:#777;font-size:21px}.control{width:100%;height:43px;border:1px solid var(--line);border-radius:11px;background:#f7f6f2;padding:0 12px;color:var(--ink);font:600 12px Arial}.search .control{padding-left:41px}.mobile-category{display:none}.price-control{display:grid;grid-template-columns:auto 1fr auto;gap:13px;align-items:center;margin-top:13px;padding-top:13px;border-top:1px solid var(--line)}.price-label{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);white-space:nowrap}.ranges{position:relative;height:24px}.ranges input{position:absolute;inset:0;width:100%;margin:0;pointer-events:none;accent-color:var(--signal);background:transparent}.ranges input::-webkit-slider-thumb{pointer-events:auto}.ranges input::-moz-range-thumb{pointer-events:auto}.reset{border:0;background:transparent;color:var(--muted);font-size:11px;font-weight:800;cursor:pointer}.results-head{display:flex;align-items:center;justify-content:space-between;padding:18px 3px 10px}.results-head strong{font-size:25px;letter-spacing:-.04em}.results-head span{color:var(--muted);font-size:12px}.page-info{font-size:9px!important;font-weight:800;text-transform:uppercase;letter-spacing:.12em}.table-head,.product-link{display:grid;grid-template-columns:minmax(280px,2.1fr) minmax(135px,.9fr) 90px 110px 105px 40px;gap:8px;align-items:center}.table-head{border:1px solid var(--line);border-radius:16px 16px 0 0;background:#e8e4da;padding:12px 15px;color:var(--muted);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.items{overflow:hidden;border:1px solid var(--line);border-top:0;border-radius:0 0 16px 16px;background:#fff}.product{border-bottom:1px solid var(--line)}.product:last-child{border:0}.product[hidden]{display:none}.product-link{min-height:71px;padding:9px 15px;text-decoration:none;transition:.18s}.product-link:hover{background:#fff8f2}.product-main{min-width:0;display:flex;align-items:center;gap:12px}.product-main img{width:52px;height:52px;flex:0 0 52px;object-fit:cover;border-radius:11px;background:#ebe7de}.product-copy{min-width:0}.product-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.product-copy small{display:block;margin-top:5px;color:#96928a;font-size:9px;font-weight:800;letter-spacing:.08em}.product-category{color:var(--muted);font-size:11px}.product-price{font-size:14px;font-weight:900}.product time{color:var(--muted);font:10px ui-monospace,monospace}.status{display:inline-flex;width:max-content;align-items:center;gap:6px;border-radius:999px;background:#e0f4e8;color:var(--green);padding:7px 9px;font-size:10px;font-weight:800}.status i{width:6px;height:6px;border-radius:50%;background:#25a267}.open{display:grid;width:32px;height:32px;place-items:center;border:1px solid var(--line);border-radius:50%;font-size:14px}.product-link:hover .open{background:var(--signal);border-color:var(--signal);color:#fff}.empty{display:none;border:1px dashed rgba(23,23,20,.25);border-radius:16px;background:#fff;padding:55px 20px;text-align:center}.pagination{display:flex;justify-content:space-between;align-items:center;margin-top:16px;border:1px solid var(--line);border-radius:15px;background:#fff;padding:10px}.pagination button{border:1px solid var(--line);border-radius:9px;background:#fff;padding:9px 13px;font-size:11px;font-weight:800;cursor:pointer}.pagination button:disabled{opacity:.35;cursor:default}.pages{display:flex;gap:4px}.pages button{min-width:34px;padding:9px}.pages button.active{background:var(--ink);color:#fff}.disclaimer{max-width:780px;margin:20px auto 0;color:var(--muted);font-size:10px;line-height:1.6;text-align:center}.footer{border-top:1px solid var(--line);background:#fff}.footer .shell{display:flex;justify-content:space-between;gap:24px;padding:25px 0;color:var(--muted);font-size:10px}.footer a{font-weight:800;text-decoration:none}
    @media(max-width:1000px){.hero .shell{grid-template-columns:1fr}.stats{width:max-content}.layout{grid-template-columns:1fr}.sidebar{display:none}.control-grid{grid-template-columns:1fr 1fr}.search{grid-column:1/-1}.mobile-category{display:block}.table-head,.product-link{grid-template-columns:minmax(240px,1.8fr) 125px 80px 105px 35px}.table-head span:nth-child(5),.product .status{display:none}}
    @media(max-width:680px){.shell{width:min(100% - 28px,1500px)}.header{height:62px}.updated{display:none}.brand{font-size:16px}.brand img{width:35px;height:35px}.hero .shell{padding:31px 0}.hero h1{font-size:42px}.hero p{font-size:13px}.stats{width:100%}.stat{min-width:0}.breadcrumb{padding-top:12px}.layout{padding-top:16px}.control-grid{grid-template-columns:1fr}.search{grid-column:auto}.price-control{grid-template-columns:1fr auto}.ranges{grid-column:1/-1;grid-row:2}.table-head{display:none}.items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;border:0;border-radius:0;background:transparent}.product{border:1px solid var(--line);border-radius:15px;background:#fff;overflow:hidden}.product-link{display:flex;min-height:0;height:100%;padding:0;flex-direction:column;align-items:stretch}.product-main{display:block}.product-main img{width:100%;height:auto;aspect-ratio:1/1;border-radius:0}.product-copy{display:block;padding:11px 10px 6px}.product-copy strong{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;min-height:32px;font-size:11px;line-height:1.4}.product-copy small{font-size:8px}.product-category{order:2;padding:0 10px;color:#777;font-size:9px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.product-price{order:3;padding:8px 10px 11px;font-size:16px}.product time,.product .status{display:none}.open{position:absolute;right:8px;bottom:8px}.product-link{position:relative}.results-head{padding-top:14px}.pages{display:none}.footer .shell{display:block}.footer p{margin:0 0 8px}}
  </style>
</head>
<body>
  <header class="header"><div class="shell"><a class="brand" href="../"><img src="../sugargoo-logo.png" alt="SugargooVIP logo" width="39" height="39"><span>SUGARGOO<b>VIP</b></span></a><div class="updated">Directory synced ${checked}</div><a class="back" href="../">← Back to homepage</a></div></header>
  <section class="hero"><div class="shell"><div><div class="tags"><span class="tag">Live directory</span><span class="tag">Independent product index</span></div><h1>The full Sugargoo spreadsheet, built for fast decisions.</h1><p>Search ${products.length} current product finds, narrow the directory by category and price, then open the live KakobuyMake listing before you decide.</p></div><div class="stats"><div class="stat"><strong>${products.length}</strong><small>Finds</small></div><div class="stat"><strong>10</strong><small>Categories</small></div><div class="stat"><strong>${products.length}</strong><small>Listed</small></div></div></div></section>
  <div class="shell breadcrumb"><a href="../">Home</a> / <strong>Sugargoo Spreadsheet</strong></div>
  <div class="shell layout">
    <aside class="sidebar"><p class="side-title">☷ Categories</p><nav class="category-nav" aria-label="Product categories"><button class="active" data-category="all"><span>All finds</span><small>${products.length}</small></button>${categories.map(([, name]) => `<button data-category="${esc(name)}"><span>${esc(name)}</span><small>${counts[name]}</small></button>`).join("")}</nav><div class="side-note"><b>Catalog status, not guesswork.</b><p>“Listed” means the product appeared in the KakobuyMake catalog during the latest directory sync. Confirm the live seller page before payment.</p></div></aside>
    <main>
      <section class="controls" aria-label="Spreadsheet filters"><div class="control-grid"><label class="search"><span hidden>Search products</span><input class="control" id="search" type="search" placeholder="Search shoes, hoodies, watches…" autocomplete="off"></label><select class="control mobile-category" id="mobileCategory" aria-label="Category"><option value="all">All categories</option>${categories.map(([, name]) => `<option value="${esc(name)}">${esc(name)}</option>`).join("")}</select><select class="control" id="status" aria-label="Catalog status"><option value="all">All statuses</option><option value="listed">Listed</option></select><select class="control" id="sort" aria-label="Sort products"><option value="recent">Recently synced</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></div><div class="price-control"><span class="price-label" id="priceLabel">Price $0–$${maxPrice}</span><div class="ranges"><input id="minPrice" type="range" min="0" max="${maxPrice}" value="0" step="5" aria-label="Minimum price"><input id="maxPrice" type="range" min="0" max="${maxPrice}" value="${maxPrice}" step="5" aria-label="Maximum price"></div><button class="reset" id="reset" type="button">↻ Reset filters</button></div></section>
      <div class="results-head"><div><strong id="resultCount">${products.length}</strong> <span>matching finds</span></div><span class="page-info" id="pageInfo">Page 1</span></div>
      <div class="table-head" aria-hidden="true"><span>Product</span><span>Category</span><span>Price</span><span>Last synced</span><span>Status</span><span>Open</span></div>
      <section class="items" id="items" aria-live="polite">${productMarkup}</section>
      <div class="empty" id="empty"><strong>No matching finds</strong><p>Try another keyword or clear the filters.</p></div>
      <nav class="pagination" aria-label="Product pages"><button id="previous" type="button">← Previous</button><div class="pages" id="pages"></div><button id="next" type="button">Next →</button></nav>
      <p class="disclaimer">Product names, images, prices and links were synchronized from the current KakobuyMake catalog on ${checked}. Marketplace listings can change after publication. Verify the live product page, selected variation and current price before ordering.</p>
    </main>
  </div>
  <footer class="footer"><div class="shell"><p>Independent directory — not affiliated with Sugargoo or the marketplaces and brands referenced.</p><p><a href="../guides/">Buyer guides</a> · <a href="../">SugargooVIP home</a></p></div></footer>
  <script>
    document.documentElement.classList.add('js');
    const allProducts=[...document.querySelectorAll('.product')],search=document.getElementById('search'),status=document.getElementById('status'),sort=document.getElementById('sort'),minPrice=document.getElementById('minPrice'),maxPrice=document.getElementById('maxPrice'),priceLabel=document.getElementById('priceLabel'),items=document.getElementById('items'),resultCount=document.getElementById('resultCount'),pageInfo=document.getElementById('pageInfo'),pagesNode=document.getElementById('pages'),previous=document.getElementById('previous'),next=document.getElementById('next'),empty=document.getElementById('empty'),mobileCategory=document.getElementById('mobileCategory');
    const pageSize=24;let category='all',page=1,filtered=[];
    const categoryButtons=[...document.querySelectorAll('[data-category]')];
    function setCategory(value){category=value;mobileCategory.value=value;categoryButtons.forEach(button=>button.classList.toggle('active',button.dataset.category===value));page=1;render()}
    function filterProducts(){const query=search.value.trim().toLowerCase(),min=Math.min(+minPrice.value,+maxPrice.value),max=Math.max(+minPrice.value,+maxPrice.value);priceLabel.textContent='Price $'+min+'–$'+max;filtered=allProducts.filter(product=>(!query||(product.dataset.name+' '+product.dataset.category.toLowerCase()).includes(query))&&(category==='all'||product.dataset.category===category)&&(status.value==='all'||product.dataset.status===status.value)&&+product.dataset.price>=min&&+product.dataset.price<=max);filtered.sort((a,b)=>sort.value==='price-low'?+a.dataset.price-+b.dataset.price:sort.value==='price-high'?+b.dataset.price-+a.dataset.price:sort.value==='name'?a.dataset.name.localeCompare(b.dataset.name):+b.querySelector('.product-copy small').textContent.replace(/\D/g,'')-+a.querySelector('.product-copy small').textContent.replace(/\D/g,''));}
    function renderPages(total){pagesNode.innerHTML='';const start=Math.max(1,Math.min(page-2,total-4));for(let number=start;number<=Math.min(total,start+4);number++){const button=document.createElement('button');button.type='button';button.textContent=number;button.className=number===page?'active':'';button.addEventListener('click',()=>{page=number;render();scrollToResults()});pagesNode.append(button)}}
    function render(){filterProducts();const total=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,total);allProducts.forEach(product=>product.hidden=true);filtered.slice((page-1)*pageSize,page*pageSize).forEach(product=>product.hidden=false);resultCount.textContent=filtered.length;pageInfo.textContent='Page '+page+' of '+total;previous.disabled=page===1;next.disabled=page===total;empty.style.display=filtered.length?'none':'block';items.style.display=filtered.length?'':'none';renderPages(total)}
    function scrollToResults(){document.querySelector('.results-head').scrollIntoView({behavior:'smooth',block:'start'})}
    categoryButtons.forEach(button=>button.addEventListener('click',()=>setCategory(button.dataset.category)));mobileCategory.addEventListener('change',event=>setCategory(event.target.value));[search,status,sort,minPrice,maxPrice].forEach(control=>control.addEventListener('input',()=>{page=1;render()}));previous.addEventListener('click',()=>{if(page>1){page--;render();scrollToResults()}});next.addEventListener('click',()=>{if(page<Math.ceil(filtered.length/pageSize)){page++;render();scrollToResults()}});document.getElementById('reset').addEventListener('click',()=>{search.value='';status.value='all';sort.value='recent';minPrice.value=0;maxPrice.value=${maxPrice};setCategory('all')});const initialQuery=new URLSearchParams(location.search).get('q');if(initialQuery)search.value=initialQuery;render();
  </script>
</body>
</html>`;

await mkdir(path.join(root, "spreadsheet"), { recursive: true });
await writeFile(path.join(root, "spreadsheet", "index.html"), html);
console.log(`Wrote ${products.length} products across 10 categories to spreadsheet/index.html`);
