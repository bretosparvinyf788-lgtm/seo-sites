(() => {
  const send = (name, params = {}) => {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  };

  const mainSiteLinks = document.querySelectorAll('a[href*="kakobuymake.com"]');
  mainSiteLinks.forEach((link) => {
    try {
      const url = new URL(link.href, window.location.href);
      url.searchParams.set("utm_source", "spreadsheets-hipobuy.net");
      url.searchParams.set("utm_medium", "referral");
      url.searchParams.set("utm_campaign", "hipobuy_spreadsheet");
      link.href = url.toString();
      if (link.target === "_blank") link.rel = "noopener noreferrer";
    } catch (_) {}
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const label = (link.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100);

    if (href.includes("kakobuymake.com")) {
      const base = { link_text: label, link_url: link.href };
      send("main_site_outbound_click", base);
      if (link.closest(".cats")) send("category_click", base);
      else if (link.closest(".products")) send("product_click", base);
      else send("spreadsheet_click", base);
    }
    if (href.includes("wa.me/")) send("whatsapp_click", { link_text: label });
    if (/^\/guides\/.+/.test(href)) send("guide_open", { link_text: label, guide_path: href });
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("#preview-language")) {
      send("language_change", { language: event.target.value });
    }
  });

  if (/^\/guides\/.+/.test(window.location.pathname) && !document.querySelector("#breadcrumb-schema")) {
    const title = document.querySelector("h1")?.textContent.trim() || document.title;
    const schema = document.createElement("script");
    schema.id = "breadcrumb-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://spreadsheets-hipobuy.net/" },
        { "@type": "ListItem", position: 2, name: "HipoBuy Guides", item: "https://spreadsheets-hipobuy.net/guides/" },
        { "@type": "ListItem", position: 3, name: title, item: window.location.href.split("#")[0] }
      ]
    });
    document.head.appendChild(schema);
  }
})();
