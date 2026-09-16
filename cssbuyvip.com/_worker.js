// Serve static article routes directly and refresh the three newest homepage guides.
// Deployment marker: 2026-09-16 coupon and fee guide publication.
const HOME_PATHS = new Set(["/", "/index.html"]);

const LATEST = [
  {
    href: "/guides/cssbuy-coupon-fee-verification-2026/",
    label: "New · September 16, 2026",
    title: "CSSBuy Coupon and Fee Guide 2026",
    desc: "Verify coupon eligibility, shipping discounts and every visible fee before committing to a top-up, order or parcel payment.",
  },
  {
    href: "/guides/cssbuy-tracking-not-updating-2026/",
    label: "Parcel Tracking · September 6, 2026",
    title: "CSSBuy Order Tracker Not Updating?",
    desc: "Identify the last confirmed scan, current parcel owner and next missing handoff before opening a focused enquiry.",
  },
  {
    href: "/guides/cssbuy-top-up-not-received-payment-recovery-2026/",
    label: "August 17, 2026",
    title: "CSSBuy Top-Up Not Received 2026",
    desc: "Recover a charged-bank, missing-balance payment incident with a clean evidence packet, the right support route and duplicate-payment controls.",
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
    if (url.hostname === "www.cssbuyvip.com") {
      url.hostname = "cssbuyvip.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
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
    headers.set("x-cssbuyvip-daily-seo", "2026-09-16-coupon-fee-guide");

    return new Response(transformed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
