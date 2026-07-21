const HOME_PATHS = new Set(["/", "/index.html"]);

const LATEST = [
  {
    href: "/guides/cssbuy-seller-communication-playbook-2026/",
    label: "New · July 21, 2026",
    title: "CSSBuy Seller Communication Playbook 2026",
    desc: "Use Contact Seller, Expert Buy and Add Note to control W2C variants, prices, evidence, returns and parcel handoffs.",
  },
  {
    href: "/guides/cssbuy-cost-ledger-2026/",
    label: "July 20, 2026",
    title: "CSSBuy Cost Ledger 2026: Fees, Deposits and Final Charges",
    desc: "Track product payments, domestic freight, warehouse decisions, shipping deposits, dimensional billing and final account adjustments.",
  },
  {
    href: "/guides/cssbuy-parcel-audit-2026/",
    label: "July 19, 2026",
    title: "CSSBuy Parcel Audit 2026: Seven Gates Before Shipping",
    desc: "Audit order accuracy, QC evidence, storage timing, packaging, chargeable weight, route eligibility and landed cost.",
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
    headers.set("x-cssbuyvip-daily-seo", "2026-07-21-static-routes");

    return new Response(transformed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
