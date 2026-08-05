#!/usr/bin/env python3
"""Publish a SugargooVIP article described by job.json using the existing archive engine."""
from __future__ import annotations

import base64
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JOB = ROOT / "job.json"
ENGINE = ROOT / "archive_tool.py"


def load_engine():
    spec = importlib.util.spec_from_file_location("sugargoo_archive_engine", ENGINE)
    if spec is None or spec.loader is None:
        raise RuntimeError("Cannot load archive_tool.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> None:
    trigger = json.loads(JOB.read_text(encoding="utf-8"))
    if trigger.get("payload_base64_parts"):
        encoded = "".join(
            (ROOT / part).read_text(encoding="utf-8")
            for part in trigger["payload_base64_parts"]
        )
        job = json.loads(base64.b64decode(encoded).decode("utf-8"))
    elif trigger.get("payload_base64"):
        encoded = (ROOT / trigger["payload_base64"]).read_text(encoding="utf-8")
        job = json.loads(base64.b64decode(encoded).decode("utf-8"))
    elif trigger.get("parts"):
        payload = "".join((ROOT / part).read_text(encoding="utf-8") for part in trigger["parts"])
        job = json.loads(payload)
    else:
        job = trigger
    if job.get("action") != "publish_article":
        raise SystemExit("publish_job.py requires action=publish_article")

    mod = load_engine()
    # The archive engine's built-in ARTICLE is itself an existing historical guide.
    # Preserve it before replacing ARTICLE with the newly queued publication.
    engine_primary_guide = mod.all_guides()[0]

    article = job["article"]
    guide = job["guide"]
    previous = job.get("existing_prepend", [])
    citations = job.get("official_citations", [])
    facts_date = job.get("facts_date", article["display_date"])
    article_number = str(job.get("article_number", len(previous) + len(mod.EXISTING_GUIDES) + 1)).zfill(2)
    next_link = job.get("next_link", "guide-sugargoo-packing-center-parcel.html")
    next_text = job.get("next_text", "Continue to the next buyer guide →")
    guide_title = job.get("guides_title", "Sugargoo Buyer Guides 2026")
    guide_description = job.get("guides_description", "Read original, fact-checked Sugargoo buyer guides.")
    home_intro = job.get("home_intro", "Three practical Sugargoo buyer guides. Newest articles appear first.")

    mod.ARTICLE = article
    mod.OFFICIAL_CITATIONS = citations

    # Merge caller-supplied recent guides, the engine's original primary guide,
    # and the remaining archive guides. Dedupe by slug so every historical
    # article remains visible without duplicate cards on repeated runs.
    merged_guides = [*previous, engine_primary_guide, *mod.EXISTING_GUIDES]
    deduped_guides = []
    seen_slugs = {article["slug"]}
    for existing in merged_guides:
        slug = existing["slug"]
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)
        deduped_guides.append(existing)
    mod.EXISTING_GUIDES = deduped_guides

    def all_guides():
        newest = {
            "title": article["title"],
            "short_title": article["short_title"],
            "slug": article["slug"],
            "date": article["date"],
            "display_date": article["display_date"],
            "read_time": article["read_time"],
            "word_count": f"{article['word_count']:,}",
            "category": guide["category"],
            "cover": guide["cover"],
            "summary": article["description"],
            "home_label": guide["home_label"],
            "home_detail": guide["home_detail"],
            "home_summary": guide["home_summary"],
            "home_link": guide["home_link"],
        }
        return [newest, *mod.EXISTING_GUIDES]

    mod.all_guides = all_guides

    original_jsonld = mod.article_jsonld

    def article_jsonld():
        encoded = original_jsonld()
        data = json.loads(encoded)
        for node in data.get("@graph", []):
            if node.get("@type") == "BreadcrumbList":
                items = node.get("itemListElement", [])
                if len(items) >= 3:
                    items[2]["name"] = article["short_title"]
        return json.dumps(data, ensure_ascii=False, separators=(",", ":"))

    mod.article_jsonld = article_jsonld

    original_render_article = mod.render_article

    def render_article():
        page = original_render_article()
        page = page.replace("Facts checked July 30, 2026", f"Facts checked {facts_date}")
        page = page.replace("<strong>05</strong>", f"<strong>{article_number}</strong>")
        page = page.replace(
            "Facts were checked against Sugargoo’s current official website and official blog on July 30, 2026.",
            f"Facts were checked against Sugargoo’s current official website and official blog on {facts_date}.",
        )
        page = re.sub(
            r'<div class="article-next"><a href="[^"]+">.*?</a></div>',
            f'<div class="article-next"><a href="{next_link}">{mod.esc(next_text)}</a></div>',
            page,
            flags=re.S,
        )
        page = page.replace(
            "Route availability, service pricing, coupons and storage timing must be rechecked in the live account.",
            "Product availability, seller terms, payment conditions and service rules must be rechecked in the live account.",
        )
        return page

    mod.render_article = render_article

    original_render_home = mod.render_home_section

    def render_home_section():
        page = original_render_home()
        return re.sub(
            r'<div class="latest-guides-intro"><p>.*?</p><a ',
            f'<div class="latest-guides-intro"><p>{mod.esc(home_intro)}</p><a ',
            page,
            count=1,
            flags=re.S,
        )

    mod.render_home_section = render_home_section

    original_render_guides = mod.render_guides

    def render_guides():
        page = original_render_guides()
        count = len(all_guides())
        words = {5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten"}
        count_word = words.get(count, str(count))
        page = re.sub(r"<title>.*?</title>", f"<title>{mod.esc(guide_title)}</title>", page, count=1)
        page = re.sub(
            r'<meta content="[^"]*" name="description"/>',
            f'<meta content="{mod.esc(guide_description)}" name="description"/>',
            page,
            count=1,
        )
        page = page.replace("Facts checked July 30, 2026", f"Facts checked {facts_date}")
        page = re.sub(
            r'<div class="guides-page-head"><span class="article-label">Original English research</span><h1>Sugargoo Buyer Guides</h1><p>.*?</p></div>',
            f'<div class="guides-page-head"><span class="article-label">Original English research</span><h1>Sugargoo Buyer Guides</h1><p>{count_word} long-form reverse-shopping guides written from scratch after checking Sugargoo’s current official documentation. Every historical article remains available, newest first.</p></div>',
            page,
            count=1,
            flags=re.S,
        )
        return page

    mod.render_guides = render_guides

    def patch_sitemap(root: Path) -> None:
        path = root / "sitemap.xml"
        xml = path.read_text(encoding="utf-8")
        xml = re.sub(r'(<loc>https://sugargoovip\.shop/</loc><lastmod>)[^<]+', rf'\g<1>{article["date"]}', xml)
        xml = re.sub(r'(<loc>https://sugargoovip\.shop/guides\.html</loc><lastmod>)[^<]+', rf'\g<1>{article["date"]}', xml)
        if article["slug"] not in xml:
            entry = f'  <url><loc>https://sugargoovip.shop/{article["slug"]}</loc><lastmod>{article["date"]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
            marker = f'  <url><loc>https://sugargoovip.shop/{previous[0]["slug"]}' if previous else '  <url><loc>https://sugargoovip.shop/guide-sugargoo-packing-center-parcel.html'
            if marker not in xml:
                raise RuntimeError("Sitemap insertion marker not found")
            xml = xml.replace(marker, entry + marker, 1)
        path.write_text(xml, encoding="utf-8")

    mod.patch_sitemap = patch_sitemap
    mod.publish()


if __name__ == "__main__":
    main()
