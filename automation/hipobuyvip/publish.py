#!/usr/bin/env python3
"""Run the August 5, 2026 HipoBuyVIP publication payload."""
from pathlib import Path
import base64
import subprocess
import zlib

HERE = Path(__file__).resolve().parent
parts = [(HERE / f"payload_{i:02d}.txt").read_text(encoding="utf-8").strip() for i in range(4)]
payload = "".join(parts)
source = zlib.decompress(base64.b64decode(payload)).decode("utf-8")
exec(compile(source, "hipobuyvip_publish_payload.py", "exec"))

# The legacy workflow stages hipobuyvip.net only. Stage the requested .shop
# publication here so the workflow commit includes the generated article,
# homepage guide ordering, and sitemap update without touching other sections.
subprocess.run(["git", "add", "hipobuyvip.shop"], cwd=HERE.parents[1], check=True)
