#!/usr/bin/env python3
from pathlib import Path
import json

SHOP = Path("cssbuyvip/index.html")
COM = Path("cssbuyvip.com/index.html")

EXTERNAL_CATEGORY_URLS = [
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=2",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=3",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=4",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=5",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=6",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=7",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=8",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=9",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=10",
    "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=11",
]


def read_site_data(text: str):
    marker = "const SITE_DATA = "
    start = text.find(marker)
    if start == -1:
        raise SystemExit("SITE_DATA marker not found")
    json_start = start + len(marker)
    data, length = json.JSONDecoder().raw_decode(text[json_start:])
    return data, json_start, json_start + length


def update_shop():
    text = SHOP.read_text(encoding="utf-8")
    data, start, end = read_site_data(text)

    categories = data.get("categories", {})
    if not categories:
        raise SystemExit("Shop category data missing")

    for lang, items in categories.items():
        if len(items) != len(EXTERNAL_CATEGORY_URLS):
            raise SystemExit(f"Unexpected category count for {lang}: {len(items)}")
        for item, url in zip(items, EXTERNAL_CATEGORY_URLS):
            item["url"] = url

    serialized = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    text = text[:start] + serialized + text[end:]

    text = text.replace(
        '<a href="#" onclick="event.preventDefault();setView(\'home\')">${pages.about || \'About Us\'}</a>',
        '<a href="/about/">${pages.about || \'About Us\'}</a>'
    )
    text = text.replace(
        '<a href="#" onclick="event.preventDefault();setView(\'home\')">${pages.policy || \'Cookie Policy\'}</a>',
        '<a href="/privacy/">${pages.policy || \'Privacy Policy\'}</a><a href="/methodology/">Methodology</a><a href="/terms/">Terms & Disclaimer</a>'
    )
    SHOP.write_text(text, encoding="utf-8")


def update_com():
    text = COM.read_text(encoding="utf-8")
    text = text.replace('href="#all-seo-articles"', 'href="/guides/"')
    text = text.replace('href="#articles"', 'href="/guides/"')
    guide_button = '<a class="btn alt dark-alt" href="/guides/">Guides</a>'
    if guide_button not in text:
        marker = '<a class="btn alt dark-alt" href="/cssbuy-shipping-calculator.html">Shipping Calculator</a>'
        if marker in text:
            text = text.replace(marker, marker + guide_button, 1)
    trust = '<div class="wrap" style="padding-top:18px"><div class="navlinks" style="justify-content:center"><a href="/about/">About</a><a href="/methodology/">Methodology</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms & Disclaimer</a><a href="/guides/">Guides</a></div></div>'
    if trust not in text:
        pos = text.rfind("</footer>")
        if pos == -1:
            raise SystemExit("CSSBuyVip.com footer not found")
        text = text[:pos] + trust + text[pos:]
    COM.write_text(text, encoding="utf-8")


def validate():
    shop = SHOP.read_text(encoding="utf-8")
    com = COM.read_text(encoding="utf-8")
    data, _, _ = read_site_data(shop)

    for lang, items in data["categories"].items():
        urls = [item.get("url") for item in items]
        if urls != EXTERNAL_CATEGORY_URLS:
            raise SystemExit(f"External category routes invalid for {lang}")

    for path in ["/about/", "/privacy/", "/methodology/", "/terms/"]:
        if path not in shop:
            raise SystemExit(f"Shop trust architecture missing: {path}")
    for path in ["/guides/", "/about/", "/methodology/", "/privacy/", "/terms/"]:
        if path not in com:
            raise SystemExit(f"Com architecture missing: {path}")
    if 'href="#all-seo-articles"' in com:
        raise SystemExit("Legacy com article hash link remains")
    print("Architecture extension validated with external category routing")


def main():
    update_shop()
    update_com()
    validate()


if __name__ == "__main__":
    main()
