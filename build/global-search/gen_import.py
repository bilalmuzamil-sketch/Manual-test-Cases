#!/usr/bin/env python3
"""Generate the Global Search v2 TestRail import file (CSV + XLSX) from the
authored per-case JSON in build/global-search/cases/.

CANONICAL FORMAT (matches testrail-import/fees-discounts-v1-testrail-import.csv
and testrail-import/simple-flow-v1-testrail-import.csv exactly):
  The first EIGHT columns are IDENTICAL in name and order to the other two
  project imports:
      Title, Section, Type, Priority, Preconditions, Steps, Expected Result,
      References
  The other two imports leave two trailing UNNAMED columns blank. Global Search
  uses that trailing space for the Standing-Rule-8 traceability trio (the feature
  is not yet pushed to TestRail, so the Case ID / Link are pending):
      Internal ID, TestRail Case ID, TestRail Link
  These three are the only Global-Search-specific columns; the canonical 8 match
  the other imports 1:1.

CONTENT RULES enforced here (same as the other two generators):
  1. VIU-word-free: internal `viu_status`, `notes`, `design_ref` are NOT emitted;
     any "(see GS-...)" internal cross-refs are stripped.
  2. Feature-flag-free: no feature-flag phrasing survives (Global Search has none
     in the reader-facing case text; a sanity check confirms 0 occurrences).
  3. Sections = leaf area names; API-related cases route to an "API — <leaf>"
     section (STANDING RULE 4) using the same em-dash convention as the other
     imports.
  4. References = spec reference only (no internal GS- ids, no VIU text).
  5/6. Preconditions/Steps/Expected kept as authored (numbered, line-broken),
     cleaned per rule 1.

Outputs (canonical location + naming, matching the other projects):
  testrail-import/global-search-v2-testrail-import.csv
  testrail-import/global-search-v2-testrail-import.xlsx
"""
import csv, json, glob, os, re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))          # build/global-search/
BASE = os.path.dirname(HERE)                               # build/
ROOT = os.path.dirname(BASE)                               # repo root
CASES_DIR = os.path.join(HERE, "cases")
MAP_CSV = os.path.join(HERE, "testrail-id-map.csv")
OUT_CSV = os.path.join(ROOT, "testrail-import", "global-search-v2-testrail-import.csv")
OUT_XLSX = os.path.join(ROOT, "testrail-import", "global-search-v2-testrail-import.xlsx")

# First 8 columns are byte-identical (name + order) to the fees-discounts and
# simple-flow imports. The trailing 3 are the Standing-Rule-8 traceability trio
# (the other imports leave two trailing columns blank instead).
HEADER = [
    "Title", "Section", "Type", "Priority",
    "Preconditions", "Steps", "Expected Result", "References",
    "Internal ID", "TestRail Case ID", "TestRail Link",
]

# Deterministic, tidy section order (functional first, API last).
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
    "API — Global Search Endpoint",
]


def clean(s):
    """Strip internal authoring markers; keep functional content (mirrors the
    other two project generators)."""
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:GS|SF|FD)-[A-Z0-9-]+\)", "", s)
    s = re.sub(r"feature[ -]flags?", "Global Search feature", s, flags=re.I)
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in (lst or []))


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
    """Leaf area name; API-related cases route to an 'API — <leaf>' section
    (STANDING RULE 4), using the same em-dash convention as the other imports."""
    area = c["area"].strip()
    if c.get("api_related"):
        leaf = re.sub(r"^API\s*[—-]\s*", "", area).strip()
        return "API — " + leaf
    return area


def main():
    cases = load_cases()
    idmap = load_map()

    order = {s: i for i, s in enumerate(SECTION_ORDER)}
    cases.sort(key=lambda c: (order.get(section_for(c), 999), c["id"]))

    rows = []
    titles = []
    api_sections = set()
    api_moved = 0
    for c in cases:
        title = clean(c["title"].strip())
        titles.append(title)
        section = section_for(c)
        if c.get("api_related"):
            api_sections.add(section)
            api_moved += 1
        cid = idmap.get(c["id"], "")
        link = ("https://shopview.testrail.io/index.php?/cases/view/" + cid) if cid else ""
        rows.append([
            title,
            section,
            c.get("type", "Functional"),
            c["priority"].strip(),
            joinlines(c.get("preconditions")),
            joinlines(c.get("steps")),
            joinlines(c.get("expected")),
            clean((c.get("spec_ref") or "").strip()),
            c["id"],
            cid if cid else "pending push",
            link,
        ])

    with open(OUT_CSV, "w", newline="") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\r\n")
        w.writerow(HEADER)
        w.writerows(rows)
    print("Wrote CSV:", OUT_CSV, "rows(data):", len(rows))

    # --- Sanity checks (must be zero / clean) ---
    dupes = [t for t, n in Counter(titles).items() if n > 1]
    print("Duplicate titles:", dupes if dupes else "NONE")
    ids = [r[8] for r in rows]
    dupids = [i for i, n in Counter(ids).items() if n > 1]
    print("Duplicate internal ids:", dupids if dupids else "NONE")
    blob = "\n".join("\t".join(str(x) for x in r) for r in rows).lower()
    print("VIU occurrences:", blob.count("viu"))
    print("'feature flag' occurrences:", blob.count("feature flag"))
    print("'flag on' occurrences:", blob.count("flag on"))
    print("'flag off' occurrences:", blob.count("flag off"))
    print("API sections created:", sorted(api_sections), "| API cases:", api_moved)
    empties = [r[8] for r in rows if not (r[4].strip() and r[5].strip() and r[6].strip())]
    print("Rows missing Preconditions/Steps/Expected:", empties if empties else "NONE")

    # --- xlsx review copy ---
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

    widths = {"Title": 50, "Section": 40, "Type": 12, "Priority": 10,
              "Preconditions": 60, "Steps": 60, "Expected Result": 60,
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
