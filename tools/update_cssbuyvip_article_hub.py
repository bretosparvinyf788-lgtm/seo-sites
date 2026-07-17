#!/usr/bin/env python3
"""Update cssbuyvip.com article hubs from a small JSON manifest."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path("cssbuyvip.com")
MANIFEST = ROOT / "article-manifest.json"
HOME = ROOT / "index.html"
ALL_PAGE = ROOT / "all-seo-articles.html"
LEGACY_PAGE = ROOT / "articles.html"
LATEST_JS = ROOT / "latest-guides.js"


def load_articles() -> list[dict[str, object]]:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        raise SystemExit("article-manifest.json must contain a non-empty list")

    required = {"title", "description", "slug", "published", "tag", "tags"}
    seen: set[str] = set()
    articles: list[dict[str, object]] = []
    for item in data:
        if not isinstance(item, dict) or not required.issubset(item):
            raise SystemExit(f"Invalid article manifest entry: {item!r}")
        slug = str(item["slug"]).strip()
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*\.html", slug):
            raise SystemExit(f"Invalid article slug: {slug}")
        if slug in seen:
            raise SystemExit(f"Duplicate article slug: {slug}")
        if not (ROOT / slug).is_file():
            raise SystemExit(f"Article file does not exist: {ROOT / slug}")
        seen.add(slug)
        articles.append(item)

    articles.sort(key=lambda x: str(x["published"]), reverse=True)
    return articles


def card_markup(article: dict[str, object]) -> str:
    return (
        f'<a class="article" href="/{html.escape(str(article["slug"]))}">'
        f'<small>{html.escape(str(article["tag"]))}</small>'
        f'<b>{html.escape(str(article["title"]))}</b>'
        f'<span>{html.escape(str(article["description"]))}</span>'
        "</a>"
    )


def update_home(articles: list[dict[str, object]]) -> None:
    latest = articles[:3]
    source = HOME.read_text(encoding="utf-8")
    pattern = re.compile(
        r'(<section class="section"><div class="wrap"><section id="articles" class="panel">.*?'
        r'<div class="article-list">).*?(</div>\s*</section></div></section>)',
        re.DOTALL,
    )
    cards = "\n          " + "\n          ".join(card_markup(a) for a in latest) + "\n        "
    updated, count = pattern.subn(r"\1" + cards + r"\2", source, count=1)
    if count != 1:
        raise SystemExit("Could not locate the homepage Latest SEO articles block")

    section_pattern = re.compile(
        r'(<section class="section"><div class="wrap"><section id="articles" class="panel">)'
        r'(.*?)(</section></div></section>)',
        re.DOTALL,
    )

    def patch_section(match: re.Match[str]) -> str:
        middle = re.sub(
            r'(<a class="view-all-btn" href=")[^"]+("\>)',
            r'\1/all-seo-articles.html\2',
            match.group(2),
            count=1,
        )
        return match.group(1) + middle + match.group(3)

    updated, section_count = section_pattern.subn(patch_section, updated, count=1)
    if section_count != 1:
        raise SystemExit("Could not update the homepage View All link")

    script_tag = '<script src="/latest-guides.js"></script>'
    if script_tag not in updated:
        updated = updated.replace("</body>", f"{script_tag}\n</body>", 1)

    HOME.write_text(updated, encoding="utf-8")


def write_latest_js(articles: list[dict[str, object]]) -> None:
    latest = [
        {
            "title": str(a["title"]),
            "description": str(a["description"]),
            "slug": str(a["slug"]),
            "tag": str(a["tag"]),
        }
        for a in articles[:3]
    ]
    payload = json.dumps(latest, ensure_ascii=False)
    code = f"""(() => {{
  const guides = {payload};

  function renderLatestGuides() {{
    const list = document.querySelector('#articles .article-list');
    if (!list) return;

    const cards = guides.map((guide) => {{
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
    }});

    list.replaceChildren(...cards);
    const viewAll = document.querySelector('#articles .view-all-btn');
    if (viewAll) viewAll.href = '/all-seo-articles.html';
  }}

  document.addEventListener('DOMContentLoaded', () => {{
    renderLatestGuides();
    setTimeout(renderLatestGuides, 140);
  }});
  window.addEventListener('load', () => setTimeout(renderLatestGuides, 220));
  document.addEventListener('click', (event) => {{
    if (event.target.closest('.langs a, .lang-switch a')) {{
      setTimeout(renderLatestGuides, 260);
    }}
  }});
}})();
"""
    LATEST_JS.write_text(code, encoding="utf-8")


def write_all_page(articles: list[dict[str, object]]) -> None:
    cards = []
    for article in articles:
        tags = " · ".join(html.escape(str(tag)) for tag in article["tags"])
        cards.append(
            f"""<article class="card">
  <div class="card-meta"><span>{html.escape(str(article["tag"]))}</span><time datetime="{html.escape(str(article["published"]))}">{html.escape(str(article["published"]))}</time></div>
  <h2><a href="/{html.escape(str(article["slug"]))}">{html.escape(str(article["title"]))}</a></h2>
  <p>{html.escape(str(article["description"]))}</p>
  <div class="tagline">{tags}</div>
  <a class="read" href="/{html.escape(str(article["slug"]))}">Read full article →</a>
</article>"""
        )

    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>All CSSBuy SEO Articles and Guides | CSSBuy VIP</title>
<meta name="description" content="Browse every independent CSSBuy VIP guide about spreadsheets, QC photos, shipping costs, warehouse storage, returns and parcel planning.">
<link rel="canonical" href="https://cssbuyvip.com/all-seo-articles.html">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:title" content="All CSSBuy SEO Articles and Guides | CSSBuy VIP">
<meta property="og:description" content="The complete CSSBuy VIP educational article archive.">
<meta property="og:url" content="https://cssbuyvip.com/all-seo-articles.html">
<script type="application/ld+json">{json.dumps({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All CSSBuy SEO Articles and Guides",
    "url": "https://cssbuyvip.com/all-seo-articles.html",
    "hasPart": [
        {
            "@type": "Article",
            "headline": str(a["title"]),
            "url": "https://cssbuyvip.com/" + str(a["slug"]),
            "datePublished": str(a["published"]),
        }
        for a in articles
    ],
}, ensure_ascii=False)}</script>
<style>
:root{{--ink:#142019;--muted:#68776c;--line:#dfebdf;--green:#25b86a;--soft:#f1faf3}}
*{{box-sizing:border-box}}body{{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--ink);background:linear-gradient(180deg,#f6fbf7,#fff);line-height:1.65}}a{{color:inherit}}.top{{background:#fff;border-bottom:1px solid var(--line)}}.nav{{width:min(1160px,calc(100% - 32px));height:70px;margin:auto;display:flex;justify-content:space-between;align-items:center}}.brand{{font-weight:950;text-decoration:none}}.navlinks{{display:flex;gap:18px}}.navlinks a{{font-size:14px;font-weight:800;text-decoration:none;color:#4f6757}}.hero{{padding:72px 20px 54px;background:linear-gradient(120deg,#0c2b18,#1e6735);color:#fff}}.hero-inner{{width:min(1100px,100%);margin:auto}}.hero span{{font-size:12px;font-weight:950;letter-spacing:.12em;color:#aee5bd}}h1{{font-size:clamp(42px,7vw,76px);line-height:1;letter-spacing:-.06em;margin:16px 0}}.hero p{{max-width:750px;color:#d7eddd;font-size:18px}}.wrap{{width:min(1100px,calc(100% - 32px));margin:44px auto 70px}}.grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}}.card{{background:#fff;border:1px solid var(--line);border-radius:26px;padding:26px;box-shadow:0 16px 44px rgba(34,86,48,.07)}}.card-meta{{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:13px}}.card-meta span{{background:var(--soft);color:#178c4e;border-radius:999px;padding:5px 9px;font-weight:900}}.card h2{{font-size:25px;line-height:1.2;letter-spacing:-.03em;margin:18px 0 10px}}.card h2 a{{text-decoration:none}}.card p{{color:#4d6053}}.tagline{{font-size:12px;color:var(--muted);margin:18px 0}}.read{{font-weight:900;color:#168b4d;text-decoration:none}}footer{{padding:30px 20px;text-align:center;border-top:1px solid var(--line);color:var(--muted);font-size:14px}}@media(max-width:760px){{.grid{{grid-template-columns:1fr}}.navlinks a:last-child{{display:none}}}}
</style>
</head>
<body>
<header class="top"><nav class="nav"><a class="brand" href="/">CSSBuy VIP</a><div class="navlinks"><a href="/">Home</a><a href="/cssbuy-shipping-calculator.html">Shipping Calculator</a></div></nav></header>
<section class="hero"><div class="hero-inner"><span>COMPLETE ARTICLE ARCHIVE</span><h1>All CSSBuy SEO articles</h1><p>Every independent CSSBuy VIP guide remains available here. New articles are added to the top while the homepage highlights only the latest three.</p></div></section>
<main class="wrap"><div class="grid">
{chr(10).join(cards)}
</div></main>
<footer>© 2026 CSSBuy VIP · Independent educational content. CSSBuy VIP is not the official CSSBuy website.</footer>
</body>
</html>
"""
    ALL_PAGE.write_text(page, encoding="utf-8")


def write_legacy_redirect() -> None:
    LEGACY_PAGE.write_text(
        """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CSSBuy VIP Articles</title>
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="https://cssbuyvip.com/all-seo-articles.html">
<meta http-equiv="refresh" content="0; url=/all-seo-articles.html">
</head>
<body><p>Opening the complete article archive… <a href="/all-seo-articles.html">Continue</a>.</p></body>
</html>
""",
        encoding="utf-8",
    )


def main() -> None:
    articles = load_articles()
    update_home(articles)
    write_latest_js(articles)
    write_all_page(articles)
    write_legacy_redirect()
    print(f"Updated homepage latest 3 and archive with {len(articles)} articles")


if __name__ == "__main__":
    main()
