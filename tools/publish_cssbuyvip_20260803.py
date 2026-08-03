#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

INDEX = Path("cssbuyvip/index.html")
EN_DATA = Path("tools/cssbuyvip_20260803_en.json")
LOCALIZED_DATA = Path("tools/cssbuyvip_20260803_localized.json")
KEY = "cssbuy-parcel-release-checklist-final-24-hours-2026"


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    marker = "const SITE_DATA = "
    start = text.index(marker) + len(marker)
    end = text.index(";\nlet currentLang", start)
    data = json.loads(text[start:end])

    entries = {"en": json.loads(EN_DATA.read_text(encoding="utf-8"))}
    entries.update(json.loads(LOCALIZED_DATA.read_text(encoding="utf-8")))

    for lang in ("en", "zh", "es", "de", "pt"):
        articles = data["articles"][lang]
        articles[:] = [article for article in articles if article.get("key") != KEY]
        articles.insert(0, entries[lang])

    english = entries["en"]
    words = re.findall(
        r"\b[\w’'-]+\b",
        " ".join(" ".join(item) for item in english["body"]),
    )
    if not 1200 <= len(words) <= 1800:
        raise SystemExit(f"English article word count out of range: {len(words)}")

    for lang in ("en", "zh", "es", "de", "pt"):
        articles = data["articles"][lang]
        if articles[0].get("key") != KEY:
            raise SystemExit(f"Newest article not at index 0 for {lang}")
        keys = [article.get("key") for article in articles]
        if len(keys) != len(set(keys)):
            raise SystemExit(f"Duplicate article key in {lang}")
        latest_dates = [article.get("publish_date", "") for article in articles[:3]]
        if latest_dates != sorted(latest_dates, reverse=True):
            raise SystemExit(f"Latest three not newest-first in {lang}: {latest_dates}")

    required = (
        "SITE_DATA.articles[currentLang].slice(0,3)",
        "SITE_DATA.articles[currentLang].map",
        "category-grid",
        "product-grid",
        "featured-products",
        "overviewCards",
        "lang-switch",
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
