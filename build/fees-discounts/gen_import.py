#!/usr/bin/env python3
"""Emit Fees & Discounts V1 cases in the user's exact TestRail import CSV format
(matched to testrail-import/sv5319-testrail-import-MATCHED.csv), plus a review xlsx."""
import csv, json, re, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # build/
ROOT = os.path.dirname(BASE)
CASES_DIR = os.path.join(BASE, "fees-discounts", "cases")
REF = os.path.join(ROOT, "testrail-import", "sv5319-testrail-import-MATCHED.csv")
OUT_CSV = os.path.join(ROOT, "testrail-import", "fees-discounts-v1-testrail-import.csv")
OUT_XLSX = os.path.join(ROOT, "testrail-import", "fees-discounts-v1-testrail-import.xlsx")

FILES = [
    "group-A-wo-parts.json",
    "group-B-customer-admin-finance.json",
    "group-C-calc-permissions-validation.json",
]

# --- Read reference header exactly ---
with open(REF, newline="") as f:
    REF_HEADER = next(csv.reader(f))
print("REFERENCE HEADER:", REF_HEADER)

cases = []
for fn in FILES:
    with open(os.path.join(CASES_DIR, fn)) as f:
        cases += json.load(f)
print("Total cases loaded:", len(cases))


def joinlines(lst):
    return "\n".join(s.rstrip() for s in lst)


def build_refs(c):
    parts = []
    sr = (c.get("story_ref") or "").strip()
    if sr:
        parts.append(sr)
    blob = " ".join([str(c.get("notes", "")), str(c.get("design_ref", "")),
                     str(c.get("story_ref", ""))])
    for jira in sorted(set(re.findall(r"SV-\d+", blob))):
        if jira not in " ".join(parts):
            parts.append(jira)
    return " ".join(parts).strip()


def build_preconditions(c):
    lines = list(c.get("preconditions", []))
    viu = (c.get("viu_status") or "").strip()
    # normalize: "Pending — verify on staging once deployed" -> "VIU pending: verify on staging once deployed."
    if viu:
        viu_txt = viu
        if viu_txt.lower().startswith("pending"):
            rest = viu_txt.split("—", 1)
            tail = rest[1].strip() if len(rest) > 1 else ""
            viu_txt = "VIU pending: " + tail if tail else "VIU pending"
        viu_txt = viu_txt.rstrip(".") + "."
    else:
        viu_txt = "VIU pending."
    lines.append("(Ref: {} — {})".format(c.get("id", ""), viu_txt))
    note = (c.get("notes") or "").strip()
    if note:
        lines.append("Note: " + note)
    return "\n".join(s.rstrip() for s in lines)


rows = []
titles = []
for c in cases:
    title = c["title"].strip()
    titles.append(title)
    section = "Fees and Discounts V1 > " + c["area"].strip()
    row = [
        title,
        section,
        "Functional",
        c["priority"].strip(),
        build_preconditions(c),
        joinlines(c.get("steps", [])),
        joinlines(c.get("expected", [])),
        build_refs(c),
        "",
        "",
    ]
    rows.append(row)

# --- Write CSV matching reference: CRLF row endings, LF inside cells, minimal quoting ---
with open(OUT_CSV, "w", newline="") as f:
    w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\r\n")
    w.writerow(REF_HEADER)
    for r in rows:
        w.writerow(r)

print("Wrote CSV:", OUT_CSV, "rows(data):", len(rows))

# --- Duplicate title check ---
from collections import Counter
dupes = [t for t, n in Counter(titles).items() if n > 1]
print("Duplicate titles:", dupes if dupes else "NONE")

# --- xlsx review copy ---
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Fees & Discounts V1"
ws.append(REF_HEADER)
for r in rows:
    ws.append(r)

hdr_font = Font(bold=True, color="FFFFFF")
hdr_fill = PatternFill("solid", fgColor="305496")
for col in range(1, len(REF_HEADER) + 1):
    cell = ws.cell(row=1, column=col)
    cell.font = hdr_font
    cell.fill = hdr_fill
    cell.alignment = Alignment(vertical="center", horizontal="left")

widths = {"Title": 50, "Section": 40, "Type": 12, "Priority": 10,
          "Preconditions": 60, "Steps": 60, "Expected Result": 60,
          "References": 18}
for i, name in enumerate(REF_HEADER, start=1):
    ws.column_dimensions[get_column_letter(i)].width = widths.get(name, 10)

wrap = Alignment(wrap_text=True, vertical="top")
for r in range(2, len(rows) + 2):
    for cidx in range(1, len(REF_HEADER) + 1):
        ws.cell(row=r, column=cidx).alignment = wrap

ws.freeze_panes = "A2"
wb.save(OUT_XLSX)
print("Wrote XLSX:", OUT_XLSX)
