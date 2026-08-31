#!/usr/bin/env python3
"""Install one GA4 measurement tag across every HTML page for each site."""

from pathlib import Path
import io
import os
import re
import tarfile


ROOT = Path(__file__).resolve().parents[1]

MEASUREMENT_IDS = {
    "cssbuyvip": "G-14RD8H62DL",  # cssbuyvip.shop
    "hipobuyvip.shop": "G-2MNW8PN3Z5",
    "litbuyvip.shop": "G-4PTG8H4RH6",
    "sugargoovip.shop": "G-L8NRH3110G",
    "superbuyvip.shop": "G-8NYY2WGRW3",
    "usfansvip.shop": "G-T3RN4V9741",
    "cssbuyvip.com": "G-S0L11KHDQ7",
    "cssbuyvip.net": "G-FW5Q8QN8LS",
    "cssbuyvip.org": "G-GG4Z5C3H5Y",
    "cssbuyvip.pro": "G-SLG5JSTY84",
    "cssbuyvip.store": "G-14PZLKV3L4",
    "hipobuyvip.net": "G-QQJZK6CMPL",
    "litbuyvip.net": "G-GSFDB3SB4S",
    "litbuyvip.org": "G-DM8KQCQYB1",
    "litbuyvip.pro": "G-B7JRYJB3EJ",
    "litbuyvip.store": "G-J57RTF97BE",
    "oopbuyvip.store": "G-J221S42B2H",
    "sugargoovip.com": "G-LL73Y33TVB",
    "sugargoovip.net": "G-BDLN5XQTEF",
    "sugargoovip.org": "G-TKW7HB637Y",
    "sugargoovip.pro": "G-YY82F5YKSC",
    "sugargoovip.store": "G-4PD6X6C881",
    "superbuyvip.com": "G-3P42TLCTMG",
    "superbuyvip.net": "G-CEQT2GJBN2",
    "superbuyvip.org": "G-GY55R5HXSQ",
    "superbuyvip.pro": "G-VD0JLQGX7K",
    "superbuyvip.store": "G-BMKCCC6C3J",
    "usfansvip.com": "G-N02E12R0P6",
    "usfansvip.pro": "G-T1ZD3N9ZEY",
    "usfansvip.store": "G-4T8DSVP0L9",
    "spreadsheets-superbuy.com": "G-SYMD1K4YTZ",
    "spreadsheets-hipobuy.net": "G-4XWTZDYJS7",
}


def snippet(measurement_id: str) -> str:
    return f"""<!-- Google tag (gtag.js) -->
<script async src=\"https://www.googletagmanager.com/gtag/js?id={measurement_id}\"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', '{measurement_id}');
</script>"""


def install_text(text: str, measurement_id: str, source: str) -> tuple[str, bool, bool]:
    existing_ids = set(re.findall(r"G-[A-Z0-9]{6,}", text))
    if existing_ids == {measurement_id}:
        if text.count(f"gtag/js?id={measurement_id}") != 1:
            raise RuntimeError(f"{source}: expected exactly one GA4 loader")
        if text.count(f"gtag('config', '{measurement_id}')") != 1:
            raise RuntimeError(f"{source}: expected exactly one GA4 config")
        return text, False, False
    if existing_ids:
        raise RuntimeError(f"{source}: unexpected GA4 ID(s): {sorted(existing_ids)}")
    updated, count = re.subn(
        r"<head(\s[^>]*)?>",
        lambda match: match.group(0) + "\n" + snippet(measurement_id) + "\n",
        text,
        count=1,
        flags=re.IGNORECASE,
    )
    return updated, count == 1, count == 0


def install(site_dir: str, measurement_id: str) -> tuple[int, int, int]:
    changed = 0
    total = 0
    skipped = 0
    for path in sorted((ROOT / site_dir).rglob("*.html")):
        total += 1
        text = path.read_text(encoding="utf-8")
        updated, did_change, did_skip = install_text(text, measurement_id, str(path))
        if did_skip:
            skipped += 1
            continue
        if did_change:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    if total == 0:
        raise RuntimeError(f"{site_dir}: no HTML files found")
    return changed, total, skipped


def install_archive(archive_path: Path, measurement_id: str) -> tuple[int, int, int]:
    changed = 0
    total = 0
    skipped = 0
    temp_path = archive_path.with_name(archive_path.name + ".tmp")
    with tarfile.open(archive_path, "r:gz") as source, tarfile.open(temp_path, "w:gz") as target:
        for member in source.getmembers():
            if not member.isfile():
                target.addfile(member)
                continue
            source_file = source.extractfile(member)
            if source_file is None:
                raise RuntimeError(f"{archive_path}:{member.name}: unreadable member")
            data = source_file.read()
            if member.name.lower().endswith(".html"):
                total += 1
                text = data.decode("utf-8")
                updated, did_change, did_skip = install_text(
                    text, measurement_id, f"{archive_path}:{member.name}"
                )
                if did_change:
                    data = updated.encode("utf-8")
                    changed += 1
                if did_skip:
                    skipped += 1
            member.size = len(data)
            target.addfile(member, io.BytesIO(data))
    if changed:
        os.replace(temp_path, archive_path)
    else:
        temp_path.unlink()
    return changed, total, skipped


def install_superbuyvip_pro_app(measurement_id: str) -> bool:
    path = ROOT / "superbuyvip.pro" / "app" / "layout.tsx"
    text = path.read_text(encoding="utf-8")
    if text.count(measurement_id) == 2 and 'import Script from "next/script";' in text:
        return False
    existing_ids = set(re.findall(r"G-[A-Z0-9]{6,}", text))
    if existing_ids:
        raise RuntimeError(f"{path}: unexpected GA4 ID(s): {sorted(existing_ids)}")
    text = text.replace(
        'import type { Metadata } from "next";\n',
        'import type { Metadata } from "next";\nimport Script from "next/script";\n',
        1,
    )
    old_return = '  return <html lang="en"><body>{children}</body></html>;'
    new_return = f'''  return (
    <html lang="en">
      <body>{{children}}</body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id={measurement_id}"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {{`window.dataLayer = window.dataLayer || [];
function gtag(){{dataLayer.push(arguments);}}
gtag('js', new Date());
gtag('config', '{measurement_id}');`}}
      </Script>
    </html>
  );'''
    if old_return not in text:
        raise RuntimeError(f"{path}: RootLayout return shape changed")
    path.write_text(text.replace(old_return, new_return, 1), encoding="utf-8")
    return True


def main() -> None:
    changed_total = 0
    tagged_total = 0
    page_total = 0
    for site_dir, measurement_id in MEASUREMENT_IDS.items():
        changed, total, skipped = install(site_dir, measurement_id)
        changed_total += changed
        tagged_total += total - skipped
        page_total += total
        print(f"{site_dir}: {measurement_id} ({changed}/{total} changed, {skipped} skipped)")
    archive_changed, archive_total, archive_skipped = install_archive(
        ROOT / "sugargoovip.shop" / "site.tar.gz",
        MEASUREMENT_IDS["sugargoovip.shop"],
    )
    app_changed = install_superbuyvip_pro_app(MEASUREMENT_IDS["superbuyvip.pro"])
    print(
        "sugargoovip.shop/site.tar.gz: "
        f"{MEASUREMENT_IDS['sugargoovip.shop']} "
        f"({archive_changed}/{archive_total} changed, {archive_skipped} skipped)"
    )
    print(
        "superbuyvip.pro/app/layout.tsx: "
        f"{MEASUREMENT_IDS['superbuyvip.pro']} ({int(app_changed)} changed)"
    )
    print(
        f"Verified GA4 on {tagged_total}/{page_total} HTML pages across "
        f"{len(MEASUREMENT_IDS)} sites ({changed_total} changed this run)"
    )


if __name__ == "__main__":
    main()
