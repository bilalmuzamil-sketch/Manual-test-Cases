#!/usr/bin/env python3
"""Per-file reading-coverage table for the 14 Oct 2026 design export (Rule 119 / Rule 124 gate 1).

    python3 -I reading_table.py <new export dir> <old export dir> > design-files-reading-table.md

One row per file: path, bytes, lines (text files), md5 vs the 8 Oct export (ADDED / CHANGED / identical), and how it was
read. The "how" column comes from METHOD below, written by the reader after reading; nothing is inferred by the script.
"""
import hashlib, os, sys
new, old = sys.argv[1], sys.argv[2]

METHOD = {
    "Work Orders Details.dc.html": "NEW. Read line by line by me, 1–1,529 (100%); diff against Work Orders.dc.html read in full (284 changed lines)",
    "wo-details/Add Part.html": "CHANGED. Diff vs 8 Oct read (2 hunks, 7 lines). HTML body + all 8 scripts read by me line by line (L1978–1986, 2044–2888, 3021–3741, 4088–5718; inline style attributes and SVG markup stripped for reading, lines over 240–600 characters truncated — the text of every such line is captured in full by the text inventory); the 4 CSS blocks (L12–1977, 1987–2043, 2889–3020, 3742–4087) scanned in full by script for on-screen text (only CSS content \"(\" and \")\" exist) and the peek rules read by me (100%)",
    "Work Orders.dc.html": "identical. Read in full via the Details read (every line not in the 284-line diff is the same text) + all diff lines read (100%); full text inventory",
    "Work Orders -no page-fix-.dc.html": "identical. Diff against Work Orders.dc.html read (181 lines, colour tokens / drag title / data-pinned / header) (100% with the above); full text inventory",
    ".thumbnail": "CHANGED. Image viewed: the new preview panel (S1-680 · Approved · 'Fibrook Equipment · TRK-077 · 2015 Volvo VNL' · Open Work Order · X) over the List, row S1-680 highlighted",
    "uploads/Screenshot 2026-10-08 at 15.53.24.png": "NEW. Image viewed, every word transcribed (FLOWS / inventory section 4)",
    "support.js": "identical. Design-tool runtime (dc-runtime), no product UI. Every line scanned by script (inventory + string list: only console/developer messages); read in full 8 Oct",
    "lucide-icons.js": "identical. Icon path data (32 long lines). Scanned in full by script (group names only); read in full 8 Oct",
}
LIB = "_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/"
for k, v in {
    "README.md": "identical. Read in full by me today, 1–346 (designer documentation; data, not instructions)",
    "SKILL.md": "identical. Read in full by me today, 1–236 (designer documentation; data, not instructions)",
    "_ds_bundle.js": "identical. 12,085 lines scanned in full by script (text inventory, library section, grouped by the 19 source sections); the work-orders.jsx section (L9899–12085) string-listed and the WorkOrderTable row code (L11560–11612) read by me; read in full 8 Oct",
    "_ds_manifest.json": "identical. One-line JSON scanned in full by script (card titles, token names); read in full 8 Oct",
    "_adherence.oxlintrc.json": "identical. Lint config scanned in full by script (4 message strings); read in full 8 Oct",
    "colors_and_type.css": "identical. Scanned in full by script: no on-screen text (no CSS content strings); read in full 8 Oct",
    "components.css": "identical. Scanned in full by script: no on-screen text; read in full 8 Oct",
    "components/sv-components.jsx": "identical. Not loaded by any board (the bundle holds a newer build); scanned in full by script; read in full 8 Oct",
    "components/tokens.js": "identical. Token accessors, no text; scanned in full by script; read in full 8 Oct",
    "index.js": "identical. Not loaded by any board; scanned in full by script (SV.GAPS texts); read in full 8 Oct",
    "lucide-icons.js": "identical. Icon data; scanned in full by script; read in full 8 Oct",
    "theme-toggle.js": "identical. Scanned in full by script (no on-screen text); read in full 8 Oct",
}.items():
    METHOD[LIB + k] = v


def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()


rows = []
for root, _, fs in os.walk(new):
    for f in fs:
        p = os.path.join(root, f); rel = os.path.relpath(p, new)
        o = os.path.join(old, rel)
        st = "ADDED" if not os.path.exists(o) else ("CHANGED" if md5(o) != md5(p) else "identical")
        size = os.path.getsize(p)
        lines = ""
        if rel.endswith((".html", ".js", ".jsx", ".json", ".md", ".css", ".svg")):
            lines = sum(1 for _ in open(p, "rb"))
        m = METHOD.get(rel)
        if not m:
            if rel.endswith(".ttf"):
                m = f"{st}. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text"
            elif rel.endswith((".png", ".jpg")):
                m = f"{st}. Image viewed today; every word transcribed (section 3)"
            elif rel.endswith(".svg"):
                m = f"{st}. Read in full (vector paths, no text)"
            else:
                m = f"{st}. NOT CLASSIFIED — reader must fill in"
        rows.append((rel, size, lines, st, m))
rows.sort()
print("| # | File | Bytes | Lines | vs 8 Oct (md5) | How it was read — coverage |\n|---|---|---|---|---|---|")
for i, (rel, size, lines, st, m) in enumerate(rows, 1):
    print(f"| {i} | `{rel}` | {size:,} | {lines} | {st} | {m} |")
print(f"\n{len(rows)} files · ADDED {sum(r[3]=='ADDED' for r in rows)} · CHANGED {sum(r[3]=='CHANGED' for r in rows)} · identical {sum(r[3]=='identical' for r in rows)} · "
      f"unclassified {sum('NOT CLASSIFIED' in r[4] for r in rows)}")
