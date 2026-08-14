(() => {
  const supported = new Set(["zh", "es", "de", "fr", "it", "pt", "nl", "ja", "ko", "ru"]);
  const targetCodes = { zh: "zh-CN", es: "es", de: "de", fr: "fr", it: "it", pt: "pt", nl: "nl", ja: "ja", ko: "ko", ru: "ru" };
  const lang = new URLSearchParams(location.search).get("lang") || "en";
  if (!supported.has(lang)) return;
  document.documentElement.lang = targetCodes[lang];
  document.querySelectorAll("a[href]").forEach((link) => {
    try {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      url.searchParams.set("lang", lang);
      link.href = url.pathname + url.search + url.hash;
    } catch {}
  });
  const blocked = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || blocked.has(parent.tagName) || parent.closest(".brand,[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      const value = node.nodeValue || "";
      if (!value.trim() || /^[\d\s.,:+%–—·©↗←→↓]+$/.test(value.trim())) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const hash = (value) => {
    let result = 2166136261;
    for (let i = 0; i < value.length; i += 1) result = Math.imul(result ^ value.charCodeAt(i), 16777619);
    return (result >>> 0).toString(36);
  };
  const translate = async (text) => {
    const key = "sbv-static-" + lang + "-" + hash(text);
    try { const cached = sessionStorage.getItem(key); if (cached) return cached; } catch {}
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", targetCodes[lang]);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);
    const response = await fetch(url, { referrerPolicy: "no-referrer" });
    if (!response.ok) throw new Error("Translation request failed");
    const data = await response.json();
    const result = data[0].map((part) => part[0]).join("");
    try { sessionStorage.setItem(key, result); } catch {}
    return result;
  };
  const run = async () => {
    document.documentElement.dataset.translating = "true";
    try {
      for (let i = 0; i < nodes.length; i += 4) {
        const batch = nodes.slice(i, i + 4);
        const values = await Promise.all(batch.map((node) => translate((node.nodeValue || "").trim())));
        batch.forEach((node, index) => {
          const original = node.nodeValue || "";
          const leading = original.match(/^\s*/)?.[0] || "";
          const trailing = original.match(/\s*$/)?.[0] || "";
          node.nodeValue = leading + values[index] + trailing;
        });
      }
    } catch {
      // Keep the complete English source if live translation is unavailable.
    } finally {
      delete document.documentElement.dataset.translating;
    }
  };
  setTimeout(() => void run(), 250);
})();