(() => {
  const SOURCE_HOME = "https://kakobuymake.com/";
  const categoryNames = {
    en: {2:"Shoes & slippers",3:"T-shirts",4:"Fashion clothing",5:"Hoodies",6:"Pants & trousers",7:"Leather belts",8:"Fashion bags",9:"Perfume",10:"Electronics",11:"Other stuff"},
    zh: {2:"鞋类与拖鞋",3:"T恤",4:"时尚服饰",5:"连帽衫",6:"裤装",7:"皮带",8:"时尚包袋",9:"香水",10:"电子产品",11:"其他商品"},
    de: {2:"Schuhe & Hausschuhe",3:"T-Shirts",4:"Modebekleidung",5:"Hoodies",6:"Hosen",7:"Ledergürtel",8:"Mode-Taschen",9:"Parfüm",10:"Elektronik",11:"Sonstiges"},
    fr: {2:"Chaussures",3:"T-shirts",4:"Vêtements",5:"Sweats à capuche",6:"Pantalons",7:"Ceintures",8:"Sacs",9:"Parfum",10:"Électronique",11:"Autres articles"},
    es: {2:"Zapatos",3:"Camisetas",4:"Ropa de moda",5:"Sudaderas",6:"Pantalones",7:"Cinturones",8:"Bolsos",9:"Perfume",10:"Electrónica",11:"Otros artículos"},
    it: {2:"Scarpe",3:"T-shirt",4:"Abbigliamento",5:"Felpe",6:"Pantaloni",7:"Cinture",8:"Borse",9:"Profumi",10:"Elettronica",11:"Altri articoli"},
    pt: {2:"Calçados",3:"Camisetas",4:"Roupas",5:"Moletons",6:"Calças",7:"Cintos",8:"Bolsas",9:"Perfume",10:"Eletrônicos",11:"Outros itens"}
  };

  const copy = {
    en: {loading:"Loading live data from KakobuyMake…",error:"KakobuyMake data is temporarily unavailable.",retry:"Retry",view:"View details →",source:"KakobuyMake source",search:"Search KakobuyMake products",searchPlaceholder:"Search names from KakobuyMake",all:"Latest",sortLatest:"Source order",sortLow:"Price: low to high",sortHigh:"Price: high to low",sortName:"Name: A–Z",previous:"Previous",next:"Next",page:"Page",results:"live products",synced:"Live source",categoryHint:"Browse live products →"},
    zh: {loading:"正在从 KakobuyMake 读取实时数据…",error:"KakobuyMake 数据暂时无法读取。",retry:"重试",view:"查看详情 →",source:"KakobuyMake 数据源",search:"搜索 KakobuyMake 商品",searchPlaceholder:"搜索 KakobuyMake 商品名称",all:"最新",sortLatest:"主站顺序",sortLow:"价格：从低到高",sortHigh:"价格：从高到低",sortName:"名称：A–Z",previous:"上一页",next:"下一页",page:"第",results:"个实时商品",synced:"主站实时同步",categoryHint:"浏览实时商品 →"},
    de: {loading:"Live-Daten von KakobuyMake werden geladen…",error:"KakobuyMake-Daten sind vorübergehend nicht verfügbar.",retry:"Erneut versuchen",view:"Details ansehen →",source:"KakobuyMake-Quelle",search:"KakobuyMake-Produkte suchen",searchPlaceholder:"Produkte bei KakobuyMake suchen",all:"Neueste",sortLatest:"Quellreihenfolge",sortLow:"Preis: aufsteigend",sortHigh:"Preis: absteigend",sortName:"Name: A–Z",previous:"Zurück",next:"Weiter",page:"Seite",results:"Live-Produkte",synced:"Live-Quelle",categoryHint:"Live-Produkte ansehen →"},
    fr: {loading:"Chargement des données KakobuyMake…",error:"Les données KakobuyMake sont temporairement indisponibles.",retry:"Réessayer",view:"Voir les détails →",source:"Source KakobuyMake",search:"Rechercher des produits KakobuyMake",searchPlaceholder:"Rechercher sur KakobuyMake",all:"Nouveautés",sortLatest:"Ordre de la source",sortLow:"Prix croissant",sortHigh:"Prix décroissant",sortName:"Nom : A–Z",previous:"Précédent",next:"Suivant",page:"Page",results:"produits en direct",synced:"Source en direct",categoryHint:"Voir les produits →"},
    es: {loading:"Cargando datos en vivo de KakobuyMake…",error:"Los datos de KakobuyMake no están disponibles temporalmente.",retry:"Reintentar",view:"Ver detalles →",source:"Fuente KakobuyMake",search:"Buscar productos de KakobuyMake",searchPlaceholder:"Buscar en KakobuyMake",all:"Recientes",sortLatest:"Orden de la fuente",sortLow:"Precio: menor a mayor",sortHigh:"Precio: mayor a menor",sortName:"Nombre: A–Z",previous:"Anterior",next:"Siguiente",page:"Página",results:"productos en vivo",synced:"Fuente en vivo",categoryHint:"Ver productos →"},
    it: {loading:"Caricamento dati live da KakobuyMake…",error:"I dati KakobuyMake non sono temporaneamente disponibili.",retry:"Riprova",view:"Vedi dettagli →",source:"Fonte KakobuyMake",search:"Cerca prodotti KakobuyMake",searchPlaceholder:"Cerca su KakobuyMake",all:"Recenti",sortLatest:"Ordine sorgente",sortLow:"Prezzo crescente",sortHigh:"Prezzo decrescente",sortName:"Nome: A–Z",previous:"Precedente",next:"Successivo",page:"Pagina",results:"prodotti live",synced:"Fonte live",categoryHint:"Sfoglia prodotti →"},
    pt: {loading:"Carregando dados ao vivo da KakobuyMake…",error:"Os dados da KakobuyMake estão temporariamente indisponíveis.",retry:"Tentar novamente",view:"Ver detalhes →",source:"Fonte KakobuyMake",search:"Pesquisar produtos KakobuyMake",searchPlaceholder:"Pesquisar na KakobuyMake",all:"Recentes",sortLatest:"Ordem da fonte",sortLow:"Preço: menor para maior",sortHigh:"Preço: maior para menor",sortName:"Nome: A–Z",previous:"Anterior",next:"Próxima",page:"Página",results:"produtos ao vivo",synced:"Fonte ao vivo",categoryHint:"Ver produtos →"}
  };

  const safeLang = () => {
    const selected = localStorage.getItem("kakobuylab-lang") || document.documentElement.lang || "en";
    const short = selected.toLowerCase().split("-")[0];
    return copy[short] ? short : "en";
  };
  const t = key => copy[safeLang()][key] || copy.en[key] || key;
  const catName = id => categoryNames[safeLang()][id] || categoryNames.en[id] || "KakobuyMake";
  const money = value => Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
  const escape = value => String(value || "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

  function loadingMarkup() {
    return `<div class="source-loading" role="status"><span class="source-spinner"></span>${escape(t("loading"))}</div>`;
  }

  function errorMarkup() {
    return `<div class="source-error" role="alert"><strong>${escape(t("error"))}</strong><a href="${SOURCE_HOME}" target="_blank" rel="noopener">${escape(t("source"))} ↗</a></div>`;
  }

  function productCard(product, categoryId = null, preserveHomepageStyle = false) {
    const category = preserveHomepageStyle ? null : (product.categoryId || categoryId);
    const sourceMarker = preserveHomepageStyle ? "" : '<span class="source-live-dot"></span>';
    return `<a class="product-card source-product-card" data-source-aid="${escape(product.aid)}" href="${escape(product.detailUrl)}">
      <div class="product-image"><img src="${escape(product.image)}" alt="${escape(product.title)} — KakobuyMake" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></div>
      <div class="product-meta"><span class="product-cat">${sourceMarker}${escape(category ? catName(category) : t("synced"))}</span><h3>${escape(product.title)}</h3><div class="product-foot"><span class="product-price">${escape(product.price || "—")}</span><span class="product-link">${escape(t("view"))}</span></div></div>
    </a>`;
  }

  async function getJson(path) {
    const response = await fetch(path, {headers:{accept:"application/json"}});
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "Source request failed");
    return payload;
  }

  async function loadHomepageProducts() {
    const root = document.querySelector("[data-source-home-products]");
    if (!root) return;
    root.innerHTML = loadingMarkup();
    try {
      const payload = await getJson("/api/source/catalog?category=1&page=3");
      const products = payload.products.slice(0, Number(root.dataset.limit || 10));
      root.dataset.sourceUrl = payload.sourceUrl;
      root.innerHTML = products.map(product => productCard(product, null, true)).join("");
      const count = document.querySelector("[data-source-live-count]");
      if (count) count.textContent = String(products.length);
    } catch {
      root.innerHTML = errorMarkup();
    }
  }

  async function loadCategories() {
    const root = document.querySelector("[data-source-categories]");
    if (!root) return;
    const preserveIcons = root.dataset.preserveLayout === "icons";
    if (preserveIcons) root.setAttribute("aria-busy", "true");
    else root.innerHTML = loadingMarkup();
    try {
      const payload = await getJson("/api/source/categories");
      if (preserveIcons) {
        const byId = new Map(payload.categories.map(category => [Number(category.id), category]));
        root.querySelectorAll("[data-source-category]").forEach(card => {
          const id = Number(card.dataset.sourceCategory);
          const category = byId.get(id);
          if (!category) return;
          card.href = category.browseUrl;
          card.dataset.sourceUrl = category.sourceUrl;
          const label = card.querySelector("strong");
          if (label) label.textContent = catName(id);
        });
        root.removeAttribute("aria-busy");
        return;
      }
      root.innerHTML = payload.categories.map(category => `<a class="category-card source-category-card" href="${escape(category.browseUrl)}" data-source-category="${category.id}">
        <span class="source-category-image"><img src="${escape(category.image)}" alt="${escape(category.name)} — KakobuyMake" loading="lazy"></span>
        <strong>${escape(catName(category.id))}</strong><span>${escape(t("categoryHint"))}</span>
      </a>`).join("");
    } catch {
      if (preserveIcons) root.removeAttribute("aria-busy");
      else root.innerHTML = errorMarkup();
    }
  }

  function initSourceProductGallery() {
    const mainImage = document.getElementById("sourceMainImage");
    if (!mainImage) return;
    document.querySelectorAll("[data-source-thumb]").forEach(button => button.addEventListener("click", () => {
      mainImage.src = button.dataset.sourceThumb;
      document.querySelectorAll("[data-source-thumb]").forEach(item => item.classList.toggle("active", item === button));
    }));
  }

  function initCatalogPage() {
    const root = document.querySelector("[data-source-catalog]");
    if (!root) return;
    const form = document.querySelector("[data-source-search]");
    const input = form?.querySelector("input[name='q']");
    const sort = document.querySelector("[data-source-sort]");
    const filters = [...document.querySelectorAll("[data-source-category-filter]")];
    const pagination = document.querySelector("[data-source-pagination]");
    const summary = document.querySelector("[data-source-summary]");
    let state = {category:1,page:1,q:"",products:[],totalPages:1,sourceUrl:SOURCE_HOME};

    const params = new URLSearchParams(location.search);
    const initialCategory = Number(params.get("category") || 1);
    state.category = initialCategory >= 1 && initialCategory <= 11 ? initialCategory : 1;
    state.page = Math.max(1, Number(params.get("page") || 1));
    state.q = (params.get("q") || "").slice(0,80);
    if (input) input.value = state.q;

    function setUrl() {
      const next = new URL(location.href);
      next.search = "";
      if (state.q) next.searchParams.set("q", state.q);
      else if (state.category !== 1) next.searchParams.set("category", state.category);
      if (state.page > 1) next.searchParams.set("page", state.page);
      history.replaceState({}, "", next);
    }

    function updateFilters() {
      filters.forEach(button => {
        const active = !state.q && Number(button.dataset.sourceCategoryFilter) === state.category;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    function sortedProducts() {
      const products = [...state.products];
      if (sort?.value === "price-low") products.sort((a,b)=>money(a.price)-money(b.price));
      if (sort?.value === "price-high") products.sort((a,b)=>money(b.price)-money(a.price));
      if (sort?.value === "name") products.sort((a,b)=>a.title.localeCompare(b.title));
      return products;
    }

    function renderProducts() {
      const products = sortedProducts();
      root.innerHTML = products.length ? products.map(product => productCard(product, state.q ? null : state.category)).join("") : errorMarkup();
      if (summary) summary.innerHTML = `<strong>${products.length}</strong> ${escape(t("results"))} · <a href="${escape(state.sourceUrl)}" target="_blank" rel="noopener">${escape(t("source"))} ↗</a>`;
      if (pagination) {
        pagination.innerHTML = `<button type="button" data-page="${state.page - 1}" ${state.page <= 1 ? "disabled" : ""}>← ${escape(t("previous"))}</button><span>${escape(t("page"))} ${state.page} / ${state.totalPages}</span><button type="button" data-page="${state.page + 1}" ${state.page >= state.totalPages ? "disabled" : ""}>${escape(t("next"))} →</button>`;
        pagination.querySelectorAll("button:not([disabled])").forEach(button => button.addEventListener("click", () => {
          state.page = Number(button.dataset.page);
          load();
          window.scrollTo({top:root.offsetTop - 130,behavior:"smooth"});
        }));
      }
    }

    async function load() {
      setUrl();
      updateFilters();
      root.innerHTML = loadingMarkup();
      if (summary) summary.textContent = t("loading");
      const query = state.q ? `q=${encodeURIComponent(state.q)}` : `category=${state.category}`;
      try {
        const payload = await getJson(`/api/source/catalog?${query}&page=${state.page}`);
        state.products = payload.products;
        state.totalPages = payload.totalPages || 1;
        state.sourceUrl = payload.sourceUrl;
        renderProducts();
      } catch {
        root.innerHTML = errorMarkup();
        if (summary) summary.textContent = t("error");
      }
    }

    form?.addEventListener("submit", event => {
      event.preventDefault();
      state.q = (input?.value || "").trim().slice(0,80);
      state.page = 1;
      load();
    });
    filters.forEach(button => button.addEventListener("click", () => {
      state.category = Number(button.dataset.sourceCategoryFilter);
      state.q = "";
      state.page = 1;
      if (input) input.value = "";
      load();
    }));
    sort?.addEventListener("change", renderProducts);
    load();
  }

  function localizeSourceControls() {
    document.querySelectorAll("[data-source-search-label]").forEach(element => element.textContent = t("search"));
    document.querySelectorAll("[data-source-search-placeholder]").forEach(element => element.placeholder = t("searchPlaceholder"));
    document.querySelectorAll("[data-source-sort-option]").forEach(option => option.textContent = t(option.dataset.sourceSortOption));
    document.querySelectorAll("[data-source-category-filter]").forEach(button => {
      const id = Number(button.dataset.sourceCategoryFilter);
      button.textContent = id === 1 ? t("all") : catName(id);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    localizeSourceControls();
    loadHomepageProducts();
    loadCategories();
    initCatalogPage();
    initSourceProductGallery();
    document.getElementById("langSelect")?.addEventListener("change", () => setTimeout(() => {
      localizeSourceControls();
      loadHomepageProducts();
      loadCategories();
    }, 0));
  });
})();
