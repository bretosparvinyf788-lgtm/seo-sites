#!/usr/bin/env python3
"""Inspect or update the SugargooVIP production archive.

The workflow is intentionally driven by job.json so scheduled publishing can
prepare changes without unpacking the binary archive through the GitHub API.
"""
from __future__ import annotations

import json
import shutil
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JOB = ROOT / "job.json"
ARCHIVE = ROOT / "site.tar.gz"
INSPECTION = ROOT / "inspection"


def inspect_archive() -> None:
    if INSPECTION.exists():
        shutil.rmtree(INSPECTION)
    INSPECTION.mkdir(parents=True)

    with tempfile.TemporaryDirectory() as td:
        extract_root = Path(td) / "site"
        extract_root.mkdir()
        with tarfile.open(ARCHIVE, "r:gz") as tf:
            tf.extractall(extract_root)

        files = sorted(p for p in extract_root.rglob("*") if p.is_file())
        manifest = []
        for path in files:
            rel = path.relative_to(extract_root)
            manifest.append({"path": rel.as_posix(), "size": path.stat().st_size})

        preferred = []
        for name in ("index.html", "guides.html", "sitemap.xml", "robots.txt", "_redirects", "styles.css", "style.css", "script.js"):
            exact = extract_root / name
            if exact.is_file():
                preferred.append(exact)

        preferred.extend(sorted(extract_root.glob("guide-*.html"))[:2])
        preferred.extend(sorted(extract_root.glob("*.css"))[:4])
        preferred.extend(sorted(extract_root.glob("*.js"))[:4])

        seen = set()
        for src in preferred:
            rel = src.relative_to(extract_root)
            if rel in seen:
                continue
            seen.add(rel)
            dest = INSPECTION / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)

        (INSPECTION / "manifest.json").write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )


def main() -> None:
    job = json.loads(JOB.read_text(encoding="utf-8"))
    action = job.get("action")
    if action == "inspect":
        inspect_archive()
        return
    raise SystemExit(f"Unsupported action: {action!r}")


if __name__ == "__main__":
    main()
