(() => {
  const guides = [{"title": "CSSBuy Warehouse Storage Guide 2026: Deadlines, Returns and Parcel Timing", "description": "A practical CSSBuy deadline system for warehouse arrivals, return decisions, storage extensions, shipping deposits and parcel submission.", "slug": "cssbuy-warehouse-storage-deadlines-2026.html", "tag": "Warehouse Guide"}, {"title": "Best CSSBuy Spreadsheet 2026 Guide: Build Safer Hauls with QC Photos, Seller Filtering and Shipping Planning", "description": "A full English SEO guide explaining how to use CSSBuy spreadsheet finds with warehouse QC photos, category research, shipping estimates and smarter reverse-shopping decisions.", "slug": "best-cssbuy-spreadsheet-2026-guide.html", "tag": "Featured"}, {"title": "CSSBuy Shipping Cost Guide: Estimate Parcel Weight, Avoid Expensive Mistakes and Ship Smarter", "description": "A detailed CSSBuy shipping guide covering parcel planning, cost estimation, packaging choices, warehouse timing and when to split or simplify a haul.", "slug": "cssbuy-shipping-cost-guide.html", "tag": "Shipping"}];

  function renderLatestGuides() {
    const list = document.querySelector('#articles .article-list');
    if (!list) return;

    const cards = guides.map((guide) => {
      const link = document.createElement('a');
      link.className = 'article';
      link.href = '/' + guide.slug;

      const tag = document.createElement('small');
      tag.textContent = guide.tag;
      const title = document.createElement('b');
      title.textContent = guide.title;
      const description = document.createElement('span');
      description.textContent = guide.description;

      link.append(tag, title, description);
      return link;
    });

    list.replaceChildren(...cards);
    const viewAll = document.querySelector('#articles .view-all-btn');
    if (viewAll) viewAll.href = '/all-seo-articles.html';
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderLatestGuides();
    setTimeout(renderLatestGuides, 140);
  });
  window.addEventListener('load', () => setTimeout(renderLatestGuides, 220));
  document.addEventListener('click', (event) => {
    if (event.target.closest('.langs a, .lang-switch a')) {
      setTimeout(renderLatestGuides, 260);
    }
  });
})();
