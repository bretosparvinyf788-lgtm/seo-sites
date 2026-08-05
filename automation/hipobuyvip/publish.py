#!/usr/bin/env python3
"""Run the August 5, 2026 HipoBuyVIP publication payload."""
from pathlib import Path
import base64
import zlib

HERE = Path(__file__).resolve().parent
parts = [(HERE / f"payload_{i:02d}.txt").read_text(encoding="utf-8").strip() for i in range(4)]
payload = "".join(parts)
source = zlib.decompress(base64.b64decode(payload)).decode("utf-8")
exec(compile(source, "hipobuyvip_publish_payload.py", "exec"))
