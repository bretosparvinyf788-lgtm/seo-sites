(() => {
  const send = (name, params = {}) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.href;
    const label = (link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
    if (link.matches(".product-card")) {
      send("product_click", { link_url: href, link_text: label });
    } else if (link.matches(".category-card")) {
      send("category_click", { link_url: href, link_text: label });
    } else if (link.matches(".guide-card, .index-guide, .related-guides a")) {
      send("guide_open", { link_url: href, link_text: label });
    } else if (new URL(href, location.href).hostname === "kakobuymake.com") {
      send("spreadsheet_open", { link_url: href, link_text: label });
    }
  });

  document.addEventListener("toggle", (event) => {
    if (event.target.matches(".faq-list details") && event.target.open) {
      send("faq_open", {
        faq_question: (event.target.querySelector("summary")?.textContent || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 100),
      });
    }
  }, true);

  document.querySelector('select[aria-label="Language"]')?.addEventListener("change", (event) => {
    send("language_change", { language: event.target.value });
  });

  const sentDepths = new Set();
  const recordDepth = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return;
    const depth = Math.round((scrollY / max) * 100);
    [50, 90].forEach((threshold) => {
      if (depth >= threshold && !sentDepths.has(threshold)) {
        sentDepths.add(threshold);
        send("content_depth", { percent_scrolled: threshold });
      }
    });
  };
  addEventListener("scroll", recordDepth, { passive: true });
})();
