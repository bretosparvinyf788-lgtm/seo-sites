#!/usr/bin/env python3
from pathlib import Path

SHOP = Path("cssbuyvip/index.html")
COM = Path("cssbuyvip.com/index.html")

def update_shop():
    text = SHOP.read_text(encoding="utf-8")
    replacements = {
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=2": "/cssbuy-spreadsheet-shoes/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=3": "/cssbuy-spreadsheet-clothing/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=4": "/cssbuy-spreadsheet-clothing/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=5": "/cssbuy-spreadsheet-hoodies/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=6": "/cssbuy-spreadsheet-clothing/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=7": "/cssbuy-spreadsheet-accessories/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=8": "/cssbuy-spreadsheet-bags/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=9": "/cssbuy-spreadsheet-categories/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=10": "/cssbuy-spreadsheet-categories/",
        "https://kakobuymake.com/?m=home&c=Lists&a=index&tid=11": "/cssbuy-spreadsheet-categories/",
    }
    for old,new in replacements.items():
        text = text.replace(old,new)
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
    for path in ["/cssbuy-spreadsheet-shoes/","/cssbuy-spreadsheet-clothing/","/cssbuy-spreadsheet-hoodies/","/cssbuy-spreadsheet-bags/","/cssbuy-spreadsheet-accessories/","/about/","/privacy/","/methodology/"]:
        if path not in shop:
            raise SystemExit(f"Shop architecture missing: {path}")
    for path in ["/guides/","/about/","/methodology/","/privacy/","/terms/"]:
        if path not in com:
            raise SystemExit(f"Com architecture missing: {path}")
    if 'href="#all-seo-articles"' in com:
        raise SystemExit("Legacy com article hash link remains")
    print("Architecture extension validated")

def main():
    update_shop()
    update_com()
    validate()

if __name__ == "__main__":
    main()
