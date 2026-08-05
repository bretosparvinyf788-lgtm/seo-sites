#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

INDEX = Path("cssbuyvip/index.html")
EN_DATA = Path("tools/cssbuyvip_20260805_en.json")
LOCALIZED_DATA = Path("tools/cssbuyvip_20260805_localized.json")
KEY = "cssbuy-warehouse-calendar-return-storage-deadlines-2026"


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    marker = "const SITE_DATA = "
    start = text.index(marker) + len(marker)
    end = text.index(";\nlet currentLang", start)
    data = json.loads(text[start:end])

    entries = {"en": json.loads(EN_DATA.read_text(encoding="utf-8"))}
    entries.update(json.loads(LOCALIZED_DATA.read_text(encoding="utf-8")))

    required_langs = ("en", "zh", "es", "de", "pt")
    for lang in required_langs:
        if lang not in entries:
            raise SystemExit(f"Missing localized article: {lang}")
        articles = data["articles"][lang]
        articles[:] = [article for article in articles if article.get("key") != KEY]
        articles.insert(0, entries[lang])

    english = entries["en"]
    words = re.findall(
        r"\b[\w’'-]+\b",
        " ".join(" ".join(item) for item in english["body"]),
    )
    if not 1500 <= len(words) <= 1800:
        raise SystemExit(f"English article word count out of range: {len(words)}")

    body_text = " ".join(" ".join(item) for item in english["body"]).lower()
    forbidden = ("http://", "https://", "www.")
    for token in forbidden:
        if token in body_text:
            raise SystemExit(f"Article body contains a forbidden link token: {token}")

    if english.get("publish_date") != "2026-08-05":
        raise SystemExit("Unexpected publish date")

    required = (
        "SITE_DATA.articles[currentLang].slice(0,3)",
        "SITE_DATA.articles[currentLang].map",
        "category-grid",
        "product-grid",
        "featured-products",
    )
    for token in required:
        if token not in text:
            raise SystemExit(f"Protected structure missing: {token}")

    encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    INDEX.write_text(text[:start] + encoded + text[end:], encoding="utf-8")
    print(f"Published {KEY}; English article words: {len(words)}")
    print("Latest English dates:", [a.get("publish_date") for a in data["articles"]["en"][:3]])


if __name__ == "__main__":
    main()
