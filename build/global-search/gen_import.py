#!/usr/bin/env python3
"""Generate the Global Search TestRail import file (CSV + XLSX) from the authored
per-case JSON in build/global-search/cases/.

CONTENT RULES (per the user's standing rules for imports):
  - VIU-word-free: internal `viu_status`, `notes`, `design_ref` are NOT emitted.
  - Feature-flag-free: no feature-flag phrasing (Global Search has none in the
    reader-facing case text; a sanity check confirms 0 occurrences).
  - Standing Rule 4: any case with api_related=true is routed to a section whose
    title includes 'API'.
  - Standing Rule 8: the import carries the internal GS- id, a TestRail Case ID
    column (blank / 'pending push' until pushed) and a TestRail Link column.

Outputs:
  build/global-search/GlobalSearch_TestRail-Import.csv
  build/global-search/GlobalSearch_TestRail-Import.xlsx
"""
import csv, json, glob, os
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
CASES_DIR = os.path.join(HERE, "cases")
OUT_CSV = os.path.join(HERE, "GlobalSearch_TestRail-Import.csv")
OUT_XLSX = os.path.join(HERE, "GlobalSearch_TestRail-Import.xlsx")
MAP_CSV = os.path.join(HERE, "testrail-id-map.csv")

HEADER = [
    "Section", "Title", "Type", "Priority",
    "Preconditions", "Steps", "Expected Result",
    "References", "Internal ID", "TestRail Case ID", "TestRail Link",
]

# Fixed section order for a tidy import (functional first, API last).
SECTION_ORDER = [
    "Palette Open, Close and Keyboard",
    "Scope Tabs",
    "Grouped Results and Counts",
    "Per-Entity Result Shape",
    "Fuzzy Matching",
    "Ranking and Prioritization",
    "Empty and First-Time State",
    "Recent Activity Default State",
    "Persisting Query",
    "No-Results State",
    "Hover Quick-Actions",
    "In-Page Work Orders List Search",
    "Error State",
    "Permissions and Role-Based Scoping",
    "API - Global Search Endpoint",
]


def joinlines(lst):
    return "\n".join(x.rstrip() for x in (lst or []))


def load_cases():
    cases = []
    for f in sorted(glob.glob(os.path.join(CASES_DIR, "cases-*.json"))):
        cases += json.load(open(f))
    return cases


def load_map():
    """internal_id -> testrail_case_id (blank until pushed)."""
    m = {}
    if os.path.exists(MAP_CSV):
        with open(MAP_CSV, newline="") as f:
            for row in csv.DictReader(f):
                if row.get("internal_id"):
                    m[row["internal_id"].strip()] = (row.get("testrail_case_id") or "").strip()
    return m


def section_for(c):
    """API cases MUST live under an API-titled section (Standing Rule 4)."""
    area = c["area"].strip()
    if c.get("api_related") and "API" not in area:
        return "API - " + area
    return area


def main():
    cases = load_cases()
    idmap = load_map()

    order = {s: i for i, s in enumerate(SECTION_ORDER)}
    cases.sort(key=lambda c: (order.get(section_for(c), 999), c["id"]))

    rows = []
    api_sections = set()
    for c in cases:
        section = section_for(c)
        if c.get("api_related"):
            api_sections.add(section)
        cid = idmap.get(c["id"], "")
        link = ("https://shopview.testrail.io/index.php?/cases/view/" + cid) if cid else ""
        rows.append([
            section,
            c["title"].strip(),
            c.get("type", "Functional"),
            c["priority"].strip(),
            joinlines(c.get("preconditions")),
            joinlines(c.get("steps")),
            joinlines(c.get("expected")),
            c.get("spec_ref", "").strip(),
            c["id"],
            cid if cid else "pending push",
            link,
        ])

    with open(OUT_CSV, "w", newline="") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\r\n")
        w.writerow(HEADER)
        w.writerows(rows)
    print("Wrote CSV:", OUT_CSV, "rows(data):", len(rows))

    # Sanity checks
    titles = [r[1] for r in rows]
    dupes = [t for t, n in Counter(titles).items() if n > 1]
    print("Duplicate titles:", dupes if dupes else "NONE")
    blob = "\n".join("\t".join(str(x) for x in r) for r in rows).lower()
    print("VIU occurrences:", blob.count("viu"))
    print("'feature flag' occurrences:", blob.count("feature flag"))
    api_flagged = sum(1 for c in cases if c.get("api_related"))
    print("API sections:", sorted(api_sections), "| API cases:", api_flagged)
    non_api_in_api = [r[8] for r in rows if r[0].startswith("API") and "API" not in r[0]]
    print("API section title check: all API cases under an 'API' section:",
          "OK" if all("API" in r[0] for r in rows
                      if r[8].startswith("GS-API")) else "FAIL")

    try:
        from openpyxl import Workbook
        from openpyxl.styles import Font, Alignment, PatternFill
        from openpyxl.utils import get_column_letter
    except ImportError:
        print("openpyxl not available - skipped XLSX.")
        return

    wb = Workbook()
    ws = wb.active
    ws.title = "Global Search V2"
    ws.append(HEADER)
    for r in rows:
        ws.append(r)

    hdr_font = Font(bold=True, color="FFFFFF")
    hdr_fill = PatternFill("solid", fgColor="305496")
    for col in range(1, len(HEADER) + 1):
        cell = ws.cell(row=1, column=col)
        cell.font = hdr_font
        cell.fill = hdr_fill
        cell.alignment = Alignment(vertical="center", horizontal="left")

    widths = {"Section": 34, "Title": 52, "Type": 12, "Priority": 10,
              "Preconditions": 55, "Steps": 55, "Expected Result": 55,
              "References": 34, "Internal ID": 14, "TestRail Case ID": 16,
              "TestRail Link": 40}
    for i, name in enumerate(HEADER, start=1):
        ws.column_dimensions[get_column_letter(i)].width = widths.get(name, 12)

    wrap = Alignment(wrap_text=True, vertical="top")
    for r in range(2, len(rows) + 2):
        for cidx in range(1, len(HEADER) + 1):
            ws.cell(row=r, column=cidx).alignment = wrap
    ws.freeze_panes = "A2"
    wb.save(OUT_XLSX)
    print("Wrote XLSX:", OUT_XLSX)


if __name__ == "__main__":
    main()
