(() => {
  let applying = false;

  const apply = () => {
    if (applying) return;
    applying = true;

    document.querySelectorAll('a[href*="kakobuymake.com"]').forEach((link) => {
      if (link.getAttribute("rel") !== "noopener") link.setAttribute("rel", "noopener");
    });

    document.querySelectorAll(".product-card img").forEach((image) => {
      if (image.getAttribute("width") !== "600") image.setAttribute("width", "600");
      if (image.getAttribute("height") !== "600") image.setAttribute("height", "600");
      if (image.getAttribute("loading") !== "lazy") image.setAttribute("loading", "lazy");
      if (image.getAttribute("decoding") !== "async") image.setAttribute("decoding", "async");
    });

    const language = document.querySelector('select[aria-label="Language"]')?.value || "en";
    const updated = document.querySelector(".hero .eyebrow");
    if (language === "en" && updated && updated.textContent !== "Independent Superbuy discovery desk · Updated September 20, 2026") {
      updated.textContent = "Independent Superbuy discovery desk · Updated September 20, 2026";
    }

    applying = false;
  };

  const start = () => {
    apply();
    const root = document.querySelector("main");
    if (root) {
      const observer = new MutationObserver(apply);
      observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true });
      setTimeout(() => observer.disconnect(), 5000);
    }
    [250, 1200, 2500, 4000].forEach((delay) => setTimeout(apply, delay));
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
