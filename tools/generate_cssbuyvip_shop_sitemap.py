#!/usr/bin/env python3
"""Generate cssbuyvip/sitemap.xml from indexable static HTML files."""

from __future__ import annotations

import re
import subprocess
from datetime import date
from pathlib import Path
from urllib.parse import quote, urlparse
from xml.sax.saxutils import escape

SITE_DIR = Path("cssbuyvip")
OUTPUT = SITE_DIR / "sitemap.xml"
BASE_URL = "https://cssbuyvip.shop"
EXCLUDED_FILENAMES = {"404.html", "500.html"}

ROBOTS_RE = re.compile(
    r'<meta\b[^>]*\bname=["\']robots["\'][^>]*\bcontent=["\']([^"\']*)["\'][^>]*>',
    re.IGNORECASE,
)
ROBOTS_RE_REVERSED = re.compile(
    r'<meta\b[^>]*\bcontent=["\']([^"\']*)["\'][^>]*\bname=["\']robots["\'][^>]*>',
    re.IGNORECASE,
)
REFRESH_RE = re.compile(
    r'<meta\b[^>]*\bhttp-equiv=["\']refresh["\'][^>]*>', re.IGNORECASE
)
CANONICAL_RE = re.compile(
    r'<link\b(?=[^>]*\brel=["\'][^"\']*canonical[^"\']*["\'])(?=[^>]*\bhref=["\']([^"\']+)["\'])[^>]*>',
    re.IGNORECASE,
)
CANONICAL_RE_REVERSED = re.compile(
    r'<link\b(?=[^>]*\bhref=["\']([^"\']+)["\'])(?=[^>]*\brel=["\'][^"\']*canonical[^"\']*["\'])[^>]*>',
    re.IGNORECASE,
)


def git_lastmod(path: Path) -> str:
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", path.as_posix()],
        check=False,
        capture_output=True,
        text=True,
    )
    value = result.stdout.strip()
    return value if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value) else date.today().isoformat()


def constructed_url(path: Path) -> str:
    relative = path.relative_to(SITE_DIR).as_posix()
    if relative == "index.html":
        route = "/"
    elif relative.endswith("/index.html"):
        route = "/" + relative[: -len("index.html")]
    else:
        route = "/" + relative
    return BASE_URL + quote(route, safe="/-._~")


def canonical_url(html: str) -> str | None:
    match = CANONICAL_RE.search(html) or CANONICAL_RE_REVERSED.search(html)
    if not match:
        return None
    value = match.group(1).strip()
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() not in {
        "cssbuyvip.shop",
        "www.cssbuyvip.shop",
    }:
        return None
    normalized_path = parsed.path or "/"
    return BASE_URL + normalized_path + (("?" + parsed.query) if parsed.query else "")


def is_indexable(path: Path, html: str) -> bool:
    if path.name in EXCLUDED_FILENAMES:
        return False
    if any(part.startswith((".", "_")) for part in path.relative_to(SITE_DIR).parts):
        return False
    if REFRESH_RE.search(html):
        return False
    robots_match = ROBOTS_RE.search(html) or ROBOTS_RE_REVERSED.search(html)
    if robots_match and "noindex" in robots_match.group(1).lower():
        return False
    return True


def main() -> None:
    if not SITE_DIR.is_dir():
        raise SystemExit(f"Site directory not found: {SITE_DIR}")

    entries: list[tuple[str, str]] = []
    seen: set[str] = set()

    for path in sorted(SITE_DIR.rglob("*.html")):
        html = path.read_text(encoding="utf-8", errors="ignore")
        if not is_indexable(path, html):
            continue
        url = canonical_url(html) or constructed_url(path)
        if url in seen:
            continue
        seen.add(url)
        entries.append((url, git_lastmod(path)))

    entries.sort(key=lambda item: (item[0] != BASE_URL + "/", item[1], item[0]))
    if not entries or entries[0][0] != BASE_URL + "/":
        raise SystemExit("Safety stop: homepage was not included in the sitemap")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, lastmod in entries:
        lines.extend(
            [
                "  <url>",
                f"    <loc>{escape(url)}</loc>",
                f"    <lastmod>{lastmod}</lastmod>",
                "  </url>",
            ]
        )
    lines.append("</urlset>")
    OUTPUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generated {OUTPUT} with {len(entries)} indexable URLs")


if __name__ == "__main__":
    main()
