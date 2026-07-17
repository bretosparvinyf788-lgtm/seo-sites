#!/usr/bin/env python3
"""Remove public source/reference boxes from cssbuyvip.com article pages.

Research sources may be used during writing, but daily SEO pages should finish with
FAQ, tags and internal navigation rather than a visible source-link list.
"""

from __future__ import annotations

import re
from pathlib import Path

SITE_DIR = Path("cssbuyvip.com")

ARTICLE_MARKERS = (
    'name="article:published_time"',
    "name='article:published_time'",
    'property="article:published_time"',
    "property='article:published_time'",
)

BLOCK_PATTERNS = (
    re.compile(
        r"\s*<(div|section)\b[^>]*class=[\"'][^\"']*\bsource-box\b[^\"']*[\"'][^>]*>.*?</\1>\s*",
        re.IGNORECASE | re.DOTALL,
    ),
    re.compile(
        r"\s*<h[2-4][^>]*>\s*(?:Official\s+sources(?:\s+checked[^<]*)?|Sources|References|资料来源|官方消息来源[^<]*|核实来源[^<]*)\s*</h[2-4]>\s*<(?:ul|ol)[^>]*>.*?</(?:ul|ol)>\s*",
        re.IGNORECASE | re.DOTALL,
    ),
)

FORBIDDEN_MARKERS = (
    "source-box",
    "Official sources checked",
    "官方消息来源",
    "核实来源",
)


def is_daily_article(text: str) -> bool:
    return any(marker in text for marker in ARTICLE_MARKERS)


def clean(text: str) -> str:
    cleaned = text
    for pattern in BLOCK_PATTERNS:
        cleaned = pattern.sub("\n", cleaned)

    # Remove now-unused source-box styling without affecting the Tags block.
    cleaned = re.sub(
        r"\.source-box\s*,\s*\.tags\s*\{",
        ".tags{",
        cleaned,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(
        r"\.source-box\s*\{[^}]*\}",
        "",
        cleaned,
        flags=re.IGNORECASE | re.DOTALL,
    )
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned


def main() -> None:
    if not SITE_DIR.is_dir():
        raise SystemExit(f"Site directory not found: {SITE_DIR}")

    changed: list[Path] = []
    checked = 0

    for path in sorted(SITE_DIR.rglob("*.html")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if not is_daily_article(text):
            continue
        checked += 1
        updated = clean(text)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            changed.append(path)

    # Validate after cleanup so future template changes cannot silently re-add it.
    failures: list[str] = []
    for path in sorted(SITE_DIR.rglob("*.html")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if not is_daily_article(text):
            continue
        for marker in FORBIDDEN_MARKERS:
            if marker.lower() in text.lower():
                failures.append(f"{path}: forbidden public source marker {marker!r}")

    if failures:
        raise SystemExit("\n".join(failures))

    print(f"Checked {checked} daily article page(s); cleaned {len(changed)} file(s)")
    for path in changed:
        print(path)


if __name__ == "__main__":
    main()
