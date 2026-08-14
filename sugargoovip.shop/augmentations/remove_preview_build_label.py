from pathlib import Path
import re

OUTPUT_DIR = Path("dist")
PATTERN = re.compile(r"\s*Undeployed\s+preview\s+build\s*", re.IGNORECASE)

changed = 0
for path in OUTPUT_DIR.rglob("*.html"):
    original = path.read_text(encoding="utf-8")
    cleaned = PATTERN.sub("", original)
    if cleaned != original:
        path.write_text(cleaned, encoding="utf-8")
        changed += 1

print(f"Removed preview-build label from {changed} HTML file(s).")
