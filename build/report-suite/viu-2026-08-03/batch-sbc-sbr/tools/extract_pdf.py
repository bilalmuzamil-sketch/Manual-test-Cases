#!/usr/bin/env python3
"""extract_pdf.py — read the TEXT out of a downloaded report PDF so the export contents can be
verified, not assumed (Rule 12). This closes the "PDF is an external dependency" gap: it is not
external, it just needed a text extractor.

Extractor: pypdf (pip install pypdf) — proven working on the sv8582 report PDFs 2026-08-04.

Usage: python3 extract_pdf.py <file.pdf> [more.pdf ...]
Writes <file>.txt next to each PDF and prints a structured summary:
  page count · the first page's lines · a Location-column verdict · the Totals line.
"""
import re
import sys
from pathlib import Path

from pypdf import PdfReader


def extract(path: Path) -> dict:
    reader = PdfReader(str(path))
    pages = [(p.extract_text() or "") for p in reader.pages]
    full = "\n".join(pages)
    path.with_suffix(path.suffix + ".txt").write_text(full, encoding="utf-8")
    lines = [ln.strip() for ln in pages[0].splitlines() if ln.strip()] if pages else []
    return {
        "file": path.name,
        "pages": len(pages),
        "chars": len(full),
        "firstPageLines": lines[:40],
        "locationsMetaLine": next((ln for ln in full.splitlines() if ln.strip().lower().startswith("locations:")), None),
        "asOfLine": next((ln for ln in full.splitlines() if ln.strip().lower().startswith("as of")), None),
        # A per-row Location column shows up as the workplace name repeated on data rows.
        "locationNameHits": len(re.findall(r"Staging (Heavy Duty|Lethbridge)", full)),
        "hasLocationHeaderWord": bool(re.search(r"\bLocation\b", full)),
        "totalsLines": [ln for ln in full.splitlines() if ln.strip().startswith("Totals")][:3],
        "fullText": full,
    }


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        p = Path(arg)
        try:
            r = extract(p)
        except Exception as exc:  # noqa: BLE001 - report the real failure, never hide it
            print(f"=== {p.name}: EXTRACTION FAILED: {type(exc).__name__}: {exc}")
            continue
        print(f"=== {r['file']}  pages={r['pages']}  chars={r['chars']}")
        print(f"    Locations meta line : {r['locationsMetaLine']!r}")
        if r["asOfLine"]:
            print(f"    As-of line          : {r['asOfLine']!r}")
        print(f"    'Location' word present: {r['hasLocationHeaderWord']}   "
              f"workplace-name occurrences: {r['locationNameHits']}")
        print(f"    Totals line(s)      : {r['totalsLines']}")
        print("    --- first page lines ---")
        for ln in r["firstPageLines"]:
            print("      " + ln[:200])
        print()
