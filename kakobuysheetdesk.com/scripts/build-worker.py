"""Reuse the production Pages build for Workers with the same images and headers."""
from pathlib import Path
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(root / 'scripts/build-cloudflare.py')], check=True, cwd=root)
out = root / 'worker-public'
if out.exists():
    shutil.rmtree(out)
out.mkdir()
for name in ['asset', 'guide-image']:
    shutil.copytree(root / 'cloudflare-dist' / name, out / name)
shutil.copy2(root / 'cloudflare-dist/_headers', out / '_headers')
assert not (out / '_worker.js').exists()
print('Packaged Workers assets; application source is excluded from public files')
