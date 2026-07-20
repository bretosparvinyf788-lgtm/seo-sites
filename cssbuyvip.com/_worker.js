import articleA from "./seo-data/article-20260719-a.js";
import articleB from "./seo-data/article-20260719-b.js";
import articleC from "./seo-data/article-20260719-c.js";
import articleD from "./seo-data/article-20260719-d.js";

const HOME_PATHS = new Set(["/", "/index.html"]);
const ARTICLE_GZIP_B64 = articleA + articleB + articleC + articleD;

const LATEST = [
  {
    href: "/guides/cssbuy-cost-ledger-2026/",
    label: "New · July 20, 2026",
    title: "CSSBuy Cost Ledger 2026: Fees, Deposits and Final Charges",
    desc: "Track product payments, domestic freight, warehouse decisions, shipping deposits, dimensional billing and final account adjustments.",
  },
  {
    href: "/guides/cssbuy-parcel-audit-2026/",
    label: "July 19, 2026",
    title: "CSSBuy Parcel Audit 2026: Seven Gates Before Shipping",
    desc: "Audit order accuracy, QC evidence, storage timing, packaging, chargeable weight, route eligibility and landed cost.",
  },
  {
    href: "/cssbuy-spreadsheet-guide.html",
    label: "July 17, 2026",
    title: "CSSBuy Spreadsheet Guide 2026: QC, Shipping and W2C Help",
    desc: "Move from product-link research to warehouse QC, weight planning and a more controlled buying workflow.",
  },
];

async function decodeGzipBase64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

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

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "x-robots-tag": "index, follow",
      "cache-control": "public, max-age=300",
      "x-content-type-options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      request.method === "GET" &&
      (url.pathname === "/guides/cssbuy-parcel-audit-2026" ||
        url.pathname === "/guides/cssbuy-parcel-audit-2026/")
    ) {
      return htmlResponse(await decodeGzipBase64(ARTICLE_GZIP_B64));
    }

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
    headers.set("x-cssbuyvip-daily-seo", "2026-07-20");

    return new Response(transformed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};