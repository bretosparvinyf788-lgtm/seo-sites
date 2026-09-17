(function () {
  "use strict";

  const send = (name, params) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  };

  const labelFor = (element) =>
    (element.getAttribute("aria-label") || element.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a, button");
    if (!target) return;

    if (target.matches(".category-card")) {
      send("category_click", {
        category_name: labelFor(target),
        link_url: target.href,
      });
      return;
    }

    if (target.matches(".heart")) {
      send("product_save_click", { product_name: labelFor(target) });
      return;
    }

    if (target.matches("a")) {
      const href = target.getAttribute("href") || "";
      let url;
      try {
        url = new URL(target.href, window.location.href);
      } catch (_) {
        url = null;
      }

      if (url && url.hostname === "kakobuymake.com") {
        const productCard = target.closest(".card");
        send(productCard ? "outbound_product_click" : "main_catalogue_click", {
          link_text: labelFor(target),
          link_url: url.href,
          product_name:
            productCard?.querySelector("h3")?.textContent?.trim() || undefined,
        });
      } else if (url && url.pathname.startsWith("/guides/")) {
        send("guide_open", {
          guide_path: url.pathname,
          link_text: labelFor(target),
        });
      }

      if (["#desk", "#spreadsheet", "#shop"].includes(url?.hash)) {
        send("spreadsheet_cta_click", {
          cta_text: labelFor(target),
          destination: url.hash,
        });
      }

      if (target.closest(".hero-search")) {
        const query = document.querySelector(".searchInput")?.value.trim();
        if (query) send("site_search", { search_term: query });
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches(".searchInput")) {
      const query = event.target.value.trim();
      if (query) send("site_search", { search_term: query });
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("#lang")) {
      send("language_change", { language: event.target.value });
    }
    if (event.target.matches("#destination, #shippingLine, #weight, #volume")) {
      send("estimator_use", {
        field_name: event.target.id,
        field_value: String(event.target.value).slice(0, 50),
      });
    }
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });
})();
