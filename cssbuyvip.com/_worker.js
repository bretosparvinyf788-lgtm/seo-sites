// Serve static article routes directly and refresh the three newest homepage guides.
// Deployment marker: 2026-08-14 order-processing publication.
const HOME_PATHS = new Set(["/", "/index.html"]);

const LATEST = [
  {
    href: "/guides/cssbuy-order-processing-timeline-2026/",
    label: "New · August 14, 2026",
    title: "CSSBuy Order Processing Timeline 2026",
    desc: "Separate CSSBuy handling, seller dispatch, domestic tracking, warehouse intake and QC so you know which missing event actually needs action.",
  },
  {
    href: "/guides/cssbuy-warehouse-storage-deadline-planner-2026/",
    label: "August 12, 2026",
    title: "CSSBuy Warehouse Storage Deadline Planner 2026",
    desc: "Track each In Warehouse date, separate return and storage clocks, flag sensitive items, and decide when to ship or extend storage.",
  },
  {
    href: "/guides/cssbuy-packaging-decision-matrix-2026/",
    label: "August 7, 2026",
    title: "CSSBuy Packaging Decision Matrix 2026",
    desc: "Choose consolidation, clothing compression, fragile-item reinforcement and box removal according to dimensional weight and product risk.",
  },
];

function latestCards() {
  return LATEST.map(
    (item) =>
      `<a class="article" href="${item.href}"><small>${item.label}</small><b>${item.title}</b><span>${item.desc}</span></a>`,
  ).join("");
}

function transformHomepage(html) {
  html = html.replace(
    /(<section id="articles" class="panel">[\s\S]*?<div class="article-list">)[\s\S]*?(<\/div>\s*<\/section>)/,
    `$1${latestCards()}$2`,
  );
  html = html.replaceAll('href="#all-seo-articles"', 'href="/all-seo-articles/"');

  if (!html.includes('id="cssbuyvip-daily-latest"')) {
    const payload = JSON.stringify(LATEST).replace(/</g, "\\u003c");
    const script = `<script id="cssbuyvip-daily-latest">(()=>{const latest=${payload};function apply(){const cards=document.querySelectorAll('#articles .article');latest.forEach((item,i)=>{const card=cards[i];if(!card)return;card.href=item.href;const small=card.querySelector('small'),title=card.querySelector('b'),desc=card.querySelector('span');if(small)small.textContent=item.label;if(title)title.textContent=item.title;if(desc)desc.textContent=item.desc;});const all=document.querySelector('#articles .view-all-btn');if(all)all.href='/all-seo-articles/';}document.addEventListener('DOMContentLoaded',()=>{apply();setTimeout(apply,120);setTimeout(apply,360);document.querySelectorAll('.langs a,.lang-switch a').forEach(a=>a.addEventListener('click',()=>setTimeout(apply,160)));});})();<\/script>`;
    html = html.replace("</body>", script + "</body>");
  }
  return html;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get("content-type") || "";

    if (
      request.method !== "GET" ||
      response.status !== 200 ||
      !type.includes("text/html") ||
      !HOME_PATHS.has(url.pathname)
    ) {
      return response;
    }

    const transformed = transformHomepage(await response.text());
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("x-cssbuyvip-daily-seo", "2026-08-14-order-processing");

    return new Response(transformed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
