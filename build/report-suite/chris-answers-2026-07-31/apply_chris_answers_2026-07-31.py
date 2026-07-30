#!/usr/bin/env python3
"""Apply the Chris-Ward-2026-07-31 answers + the 2026-07-29 spec changelog to the
Report Suite case bodies. LOCAL ONLY — no TestRail writes.

Backs every touched file up to chris-answers-2026-07-31/backup/ first and writes
a MANIFEST.md. Idempotent-safe to re-run only from a clean checkout.
"""
import json, os, re, shutil, sys, glob, csv, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # build/report-suite
CASEDIR = os.path.join(ROOT, "cases")
OUT = os.path.join(ROOT, "chris-answers-2026-07-31")
BACKUP = os.path.join(OUT, "backup")

ANSWER_SRC = "Chris Ward answer 2026-07-31"
SPEC_SRC = "spec 2026-07-29"

# ----------------------------------------------------------------- load
files = sorted(glob.glob(os.path.join(CASEDIR, "*.json")))
data = {f: json.load(open(f, encoding="utf-8")) for f in files}
byid = {}
for f, lst in data.items():
    for c in lst:
        byid[c["id"]] = (f, c)
idmap = {r["internal_id"]: r["testrail_case_id"]
         for r in csv.DictReader(open(os.path.join(ROOT, "testrail-id-map.csv"), encoding="utf-8"))}

def active(cid):
    f, c = byid[cid]
    assert not str(c.get("viu_status", "")).startswith("Retired"), cid
    return c

TOUCHED = {}          # cid -> list of change descriptions
BEFORE = {}           # cid -> dict snapshot of the 5 pushed fields

PUSH_FIELDS = ("title", "preconditions", "steps", "expected", "spec_ref")

def snap(cid):
    if cid not in BEFORE:
        c = active(cid)
        BEFORE[cid] = {k: json.loads(json.dumps(c.get(k))) for k in PUSH_FIELDS}

def note(cid, msg):
    snap(cid)
    TOUCHED.setdefault(cid, []).append(msg)

def add_note(cid, text):
    c = active(cid)
    c["notes"] = ((c.get("notes") or "").rstrip() + " " + text).strip()

# --------------------------------------------------- 1. mechanical renames
def sub_fields(cid, pairs, regex=False):
    """Apply (old,new) substitutions across the tester-facing fields."""
    c = active(cid)
    changed = False
    for k in ("title", "preconditions", "steps", "expected"):
        v = c.get(k)
        if isinstance(v, str):
            nv = v
            for a, b in pairs:
                nv = re.sub(a, b, nv) if regex else nv.replace(a, b)
            if nv != v:
                c[k] = nv; changed = True
        elif isinstance(v, list):
            nl = []
            for ln in v:
                nn = ln
                for a, b in pairs:
                    nn = re.sub(a, b, nn) if regex else nn.replace(a, b)
                nl.append(nn)
            if nl != v:
                c[k] = nl; changed = True
    return changed

# --- D1: Q2 one suite-wide too-large message -------------------------------
RULED_MSG = ("This report is too large to export. Narrow the date range or filters, "
             "then try again.")
for cid in ("SBC-EXP-14", "SBR-EXP-15"):
    snap(cid)
    ok = sub_fields(cid, [
        (r"This export is too large to generate\. Narrow the date range or filters,?(?: then| and)? try again\.",
         RULED_MSG)], regex=True)
    assert ok, cid
    note(cid, "D1 Q2: the too-large message replaced with the one ruled suite-wide string")
    add_note(cid, f"Q2 RULED 2026-07-31 ({ANSWER_SRC}, option A 'great catch'): ONE message across all six "
                  f"reports — \"{RULED_MSG}\" The Sales By Customer spec text still carries the retired "
                  "\"This export is too large to generate…\" wording; Chris's spec edit is pending.")

# --- D5: Q5 the full word "Sales Representative" everywhere ----------------
Q5 = ["SBR-WO-01", "SBR-WO-02", "SBR-WO-03", "SBR-WO-04", "SBR-WO-05", "SBR-WO-06",
      "SBR-ASGN-01", "SBR-ASGN-02", "SBR-ASGN-03", "SBR-ASGN-04", "SBR-ASGN-05", "SBR-ASGN-06",
      "SBR-DEACT-02", "SBR-DEACT-05", "SBR-DEACT-06", "SBR-DEACT-07",
      "SBR-UNAS-01", "SBR-EXP-10", "SBR-EXP-11", "SBR-EXP-12", "SBR-EXP-13",
      "SBR-PERM-02", "SBR-TYPE-02", "SBR-API-06"]
Q5_PAIRS = [
    (r"Sales Rep Assignments", "Sales Representative Assignments"),
    (r"sales-rep-assignments\.csv", "sales-representative-assignments.csv"),
    (r"\bSales Rep\b", "Sales Representative"),
    (r"\bsales rep\b", "sales representative"),
    (r"\bsales-rep\b", "sales-representative"),
]
for cid in Q5:
    snap(cid)
    if sub_fields(cid, Q5_PAIRS, regex=True):
        note(cid, "D5 Q5: short-form \"Sales Rep\" replaced with the full word \"Sales Representative\"")
    add_note(cid, f"Q5 RULED 2026-07-31 ({ANSWER_SRC}, option A): \"Rep is too much slang, let's do "
                  "representative everywhere\" — every UI-visible string uses the full word "
                  "\"Sales Representative\" (label, column header, dropdown entry, dialog sentence, "
                  "accessible name, file name). The build and the SBR spec text (S19-R1/R7/R8, Story 15) "
                  "still use the short form — Chris's spec edit + a build change are pending. NOT changed: "
                  "the second short-form header \"Rep is active?\", which he did not name (queued as an "
                  "open question, DELTAS.md A2).")

# label-assertion cases get the plain tester note
Q5_LABEL_CASES = ["SBR-WO-01", "SBR-WO-02", "SBR-WO-04", "SBR-WO-06",
                  "SBR-ASGN-01", "SBR-ASGN-02", "SBR-ASGN-05",
                  "SBR-EXP-10", "SBR-EXP-11", "SBR-EXP-12", "SBR-EXP-13"]
Q5_TESTER_NOTE = ("Note for the tester: the product owner has ruled that the full word "
                  "\"Sales Representative\" replaces the short \"Sales Rep\" everywhere. If the screen "
                  "or file still shows \"Sales Rep\", mark this test Failed and report it as the pending "
                  "rename — do not change the test.")
for cid in Q5_LABEL_CASES:
    c = active(cid)
    if Q5_TESTER_NOTE not in " ".join(c["expected"]):
        c["expected"].append(f"{len(c['expected'])+1}. {Q5_TESTER_NOTE}")
        note(cid, "D5 Q5: plain tester note added (the rename is pending in the build)")

# SBR-ASGN-02: the derived file name must not be asserted as a certainty (DELTAS A3)
c = active("SBR-ASGN-02")
c["expected"] = [re.sub(r"sales-representative-assignments\.csv",
                        "sales-representative-assignments.csv (the short form \"rep\" is gone from the "
                        "file name — confirm the exact final file name in the build)", ln, count=1)
                 if "sales-representative-assignments.csv" in ln else ln for ln in c["expected"]]
note("SBR-ASGN-02", "D5/A3: the renamed download file name is flagged for live confirmation, not asserted blind")

# --- D6: PV "Sold via WO" -> "Sold (WO)" -----------------------------------
D6 = ["PV-COL-01", "PV-COL-02", "PV-COL-03", "PV-ROW-08", "PV-CALC-05", "PV-CALC-11",
      "PV-CALC-13", "PV-CALC-15", "PV-CALC-16"]
for cid in D6:
    snap(cid)
    if sub_fields(cid, [("Sold via WO", "Sold (WO)"), ("Sold via Parts Sale", "Sold (Parts Sale)")]):
        note(cid, "D6: PV column labels renamed to \"Sold (WO)\" / \"Sold (Parts Sale)\"")
    add_note(cid, f"COLUMN RENAME per the Parts Velocity spec v4 changelog 2026-07-29 (verbatim: "
                  "\"renamed the 'Sold via WO' / 'Sold via Parts Sale' columns to 'Sold (WO)' / "
                  "'Sold (Parts Sale)'\"; S3-R9, S4-R3, S4-R4, S5-R4 table, S5-R4b, S5-R7, §4). "
                  "Newest source, last-update-wins.")

# --- D7: PV "Catalogue" -> "Special Order" (ratified) ----------------------
D7 = ["PV-ROW-02", "PV-ROW-03", "PV-ROW-04", "PV-ROW-08", "PV-ROW-09", "PV-COL-06",
      "PV-CALC-02", "PV-CALC-06", "PV-CALC-07", "PV-CALC-09", "PV-CALC-10", "PV-CALC-11",
      "PV-CALC-14", "PV-CALC-15", "PV-EXP-04", "PV-EXP-07"]
D7_PAIRS = [(r"\bCatalogue\b", "Special Order"), (r"\bcatalogue\b", "special-order")]
for cid in D7:
    snap(cid)
    if sub_fields(cid, D7_PAIRS, regex=True):
        note(cid, "D7: \"Catalogue\" renamed to the ratified \"Special Order\"")
    add_note(cid, "CATALOGUE RENAME now RATIFIED by the Parts Velocity spec v4 2026-07-29 — S2-R1 Type "
                  "filter options are \"Both, Inventory, Special Order\" and S3-R5 the Type column "
                  "displays \"Inventory\" or \"Special Order\". (SPEC-WATCH item 7 CLOSED.)")
# refs/notes-only rename (LOCAL only, never pushed)
for cid in ["PV-CALC-03", "PV-FILT-01", "PV-FILT-08", "PV-FILT-09", "PV-ROW-05"]:
    c = active(cid)
    for k in ("notes", "permissions_required"):
        if isinstance(c.get(k), str):
            c[k] = re.sub(r"\bCatalogue\b", "Special Order", re.sub(r"\bcatalogue\b", "special-order", c[k]))

# permissions_required metadata is local-only (gen_import does not emit it)
for cid in list(byid):
    f, c = byid[cid]
    if isinstance(c.get("permissions_required"), str):
        if cid.startswith("PV"):
            c["permissions_required"] = re.sub(r"\bCatalogue\b", "Special Order", c["permissions_required"])
        if cid.startswith("SBR"):
            c["permissions_required"] = re.sub(r"\bSales Rep\b", "Sales Representative", c["permissions_required"])
        if cid.startswith("SBC"):
            c["permissions_required"] = re.sub(
                r"(?:the )?dedicated Sales By Customer report View permission[^.;]*",
                "the ordinary reports access (Reports section View)", c["permissions_required"])
            c["permissions_required"] = c["permissions_required"].replace(
                "Sales By Customer report View permission",
                "the ordinary reports access (Reports section View)")

# ------------------------------------------------- 2. structural edits
def set_fields(cid, **kw):
    snap(cid)
    c = active(cid)
    for k, v in kw.items():
        c[k] = v

def renumber(lst):
    return [re.sub(r"^\d+\.\s*", f"{i}. ", ln) for i, ln in enumerate(lst, 1)]

# --- D2: Q1 refs upgraded to cite the PO's own answer ---------------------
D2_REFS = {
 "SBR-LOC-04": "SV-8638 (SBR spec S21-N1 — RULED HIDDEN by Chris Ward answer 2026-07-31 Q1=A "
               "\"classic spec drift\"; the S21-N1 \"still sees the filter\" note is stale, spec edit pending)",
 "TU-LOC-05":  "SV-8656 (TU spec S9-N1 — RULED HIDDEN by Chris Ward answer 2026-07-31 Q1=A "
               "\"classic spec drift\"; the S9-N1 \"still sees the filter\" note is stale, spec edit pending)",
 "IV-LOC-04":  "SV-8674 (IV spec Story 7 S7-N1 — RULED HIDDEN by Chris Ward answer 2026-07-31 Q1=A "
               "\"classic spec drift\"; the S7-N1 \"still sees the filter\" note is stale, spec edit pending)",
 "PV-FILT-13": "SV-8642 (PV spec S2-E4 — RULED HIDDEN by Chris Ward answer 2026-07-31 Q1=A "
               "\"classic spec drift\"; the S2-E4 \"still sees the filter\" note is stale, spec edit pending)",
}
for cid, refs in D2_REFS.items():
    set_fields(cid, spec_ref=refs)
    note(cid, "D2 Q1: traceability upgraded from \"kickoff video, pending the PO\" to the PO's own answer")
    add_note(cid, f"Q1 RULED 2026-07-31 ({ANSWER_SRC}, option A \"classic spec drift\"): the Location filter "
                  "is HIDDEN for a user with access to only one location. This CONFIRMS the video-based flip "
                  "and closes the \"pending his answer\" caveat; the tester-facing wording did not change. "
                  "The four spec notes that still say the opposite need Chris's edit.")

# --- D3: Q1 applied to the two reports that had no single-location case ----
c = active("SBC-LOC-01")
snap("SBC-LOC-01")
c["title"] = "Location filter: rightmost, lists accessible locations, All locations on top"
c["steps"] = renumber(c["steps"] + [
    "4. Then sign in as a user with access to only ONE location, open the report and look for the "
    "Location filter again."])
c["expected"] = renumber(c["expected"] + [
    "5. For a user with access to only one location the Location filter is NOT shown at all — the report "
    "simply shows that one location's data."])
c["spec_ref"] = ("SV-8600 (SBC spec Story 4 S4-R1; S4-R2; S4-R3 + single-location filter HIDDEN per "
                 "Chris Ward answer 2026-07-31 Q1=A, applied suite-wide)")
note("SBC-LOC-01", "D3 Q1: single-location \"filter hidden\" expectation added; title trimmed to 80")
add_note("SBC-LOC-01", f"Q1 RULED 2026-07-31 ({ANSWER_SRC}, option A): the Location filter is hidden for a "
                       "one-location user. His ruling is suite-wide; Sales By Customer had no case for it, so "
                       "the assertion is folded into this existing filter case rather than authored as a "
                       "near-duplicate (Rule 28).")

c = active("WIP-FLT-06")
snap("WIP-FLT-06")
c["steps"] = renumber(c["steps"] + [
    "5. Then sign in as a user with access to only ONE location, open the report and look for the "
    "Location filter again."])
c["expected"] = renumber(c["expected"] + [
    "5. For a user with access to only one location the Location filter is NOT shown at all — the report "
    "simply shows that one location's work orders."])
c["spec_ref"] = ("SV-8663 (WIP spec Story 7 S7-R9; S7-R10 + on-screen location-scope indicator, spec v6 "
                 "2026-07-29; single-location filter HIDDEN per Chris Ward answer 2026-07-31 Q1=A)")
note("WIP-FLT-06", "D3 Q1: single-location \"filter hidden\" expectation added")
add_note("WIP-FLT-06", f"Q1 RULED 2026-07-31 ({ANSWER_SRC}, option A): the Location filter is hidden for a "
                       "one-location user — applied suite-wide; folded into this existing filter case (Rule 28).")

# --- D4: Q4 the permission model ------------------------------------------
set_fields("SBC-PERM-01",
    title="Ordinary reports access opens Sales By Customer — no separate permission",
    preconditions=[
        "1. A test user exists whose role has the ordinary reports access (the standard \"can this person see "
        "reports\" setting) and NO report-specific permission (create a ZZAUTOTEST custom role if needed; "
        "restore afterwards).",
        "2. You are signed in as that user."],
    steps=["1. Open the Reports area.",
           "2. Click \"Sales By Customer\" in the left-side navigation."],
    expected=[
        "1. The \"Sales By Customer\" entry is visible in the Reports navigation.",
        "2. The report opens and shows its data.",
        "3. Ordinary reports access alone is enough — this report does NOT need a permission of its own.",
        "4. Note for the tester: the product owner has ruled that every report in this suite opens with the "
        "ordinary reports access. If the build still demands a separate Sales By Customer permission, mark "
        "this test Failed and report it as the known pending change — do not change the test."],
    spec_ref="SV-8601 (SBC spec Story 1 S1-R2 — OVERRULED by Chris Ward answer 2026-07-31 Q4=A "
             "\"the intention is to not hide these from normal reports access\"; S1-R2 + the build still "
             "use a dedicated permission, dev change ticket raised)")
note("SBC-PERM-01", "D4 Q4: re-based on the ordinary reports access; the \"dedicated permission\" expectation inverted")

set_fields("SBC-PERM-02",
    title="Without reports access, Sales By Customer is not listed and cannot open",
    preconditions=[
        "1. A test user exists whose role does NOT have reports access (use/create a ZZAUTOTEST role; restore "
        "afterwards).",
        "2. You know the report's direct page address (copy it from a permitted session first).",
        "3. You are signed in as the unpermitted user."],
    steps=["1. Open the Reports area and look through the left-side navigation.",
           "2. Paste the report's direct page address into the browser and try to open it."],
    expected=[
        "1. \"Sales By Customer\" does not appear in the Reports navigation.",
        "2. Opening the report by direct link does not show the report (the application blocks it with its "
        "standard access-denied handling).",
        "3. The gate is the ordinary reports access — there is no separate Sales By Customer permission to "
        "remove."],
    spec_ref="SV-8601 (SBC spec Story 1 S1-N1 — permission model RULED to the ordinary reports access by "
             "Chris Ward answer 2026-07-31 Q4=A; the build still ships a dedicated permission)")
note("SBC-PERM-02", "D4 Q4: negative case re-based on the ordinary reports access")

c = active("SBC-NAV-01")
snap("SBC-NAV-01")
c["preconditions"] = ["1. You are signed in to the ShopView App on a desktop browser.",
                      "2. Your role has the ordinary reports access (the standard \"can this person see "
                      "reports\" setting)."]
c["spec_ref"] = ("SV-8600 (SBC spec Story 1 S1-R1; S1-R3; S1-R4 — Performance group + below-the-anchors "
                 "placement per the PRD companion video 2026-07-30; access = ordinary reports permission per "
                 "Chris Ward answer 2026-07-31 Q4=A)")
note("SBC-NAV-01", "D4 Q4: precondition moved from the dedicated permission to the ordinary reports access")
for cid in ("SBC-PERM-01", "SBC-PERM-02", "SBC-NAV-01"):
    add_note(cid, f"Q4 RULED 2026-07-31 ({ANSWER_SRC}, option A, verbatim: \"the intention is to not hide "
                  "these from normal reports access. These were specced before CRP was built\"): every report "
                  "in the suite is gated by the ORDINARY reports permission; no report gets its own. THE BUILD "
                  "DIFFERS — the engineering tech plan §B5.3 gates every Sales By Customer endpoint on a new "
                  "dedicated atom ROLE_SALES_BY_CUSTOMER_REPORT::VIEW, and SBC spec S1-R2 still states the "
                  "dedicated model. Dev change ticket + spec correction raised in "
                  "chris-answers-2026-07-31/Q4-permission-dev-note-2026-07-31.md. Not live-verified (Rule 12).")

# --- D8: Technician Utilization -------------------------------------------
set_fields("TU-COL-01",
    title="Column Selection: Technician always on, the other five toggleable, remembered",
    preconditions=[
        "1. You are on the Technician Utilization report with rows loaded.",
        "2. This browser has never saved settings for this report (fresh visit), so every column is at its "
        "default."],
    steps=[
        "1. Find the column-selection button in the toolbar and hover it to read its tooltip.",
        "2. Note its position relative to the three-dot download menu.",
        "3. Open it and read every toggle in the list, and which ones are on.",
        "4. Turn Est. Lost Labor off, then turn Internal Hours off, watching the table each time.",
        "5. Turn both back on and check where each column lands.",
        "6. Reload the page, then close the browser, reopen it and return to the report."],
    expected=[
        "1. The control is an icon button whose tooltip reads \"Column Selection\", sitting immediately after "
        "the three-dot download menu in the toolbar.",
        "2. The list offers five toggles — Total Hours, WO Hours, Internal Hours, Utilization % and Est. Lost "
        "Labor — and all five are on by default.",
        "3. Technician is always shown and cannot be turned off (it is not offered as a toggle).",
        "4. The Location column is never listed here — it appears on its own whenever more than one location is "
        "in scope.",
        "5. Turning a toggle off hides that column (header and cells) immediately, with no reload; turning it "
        "back on returns it to its usual place in the fixed left-to-right order — the remaining columns never "
        "reorder.",
        "6. Est. Lost Labor can now be hidden like any other column (it used to be always on).",
        "7. Your column choice is remembered in this browser and is still applied when you come back."],
    spec_ref="SV-8655 (TU spec v5 2026-07-29 NEW Story 10 S10-R1; S10-R2; S10-R3; S10-R4; S10-R5; S10-R6 — "
             "column selector RATIFIED, replacing the placeholder written from the 2026-07-29 group message)")
note("TU-COL-01", "D8: placeholder replaced with the ratified Story 10 detail (S10-R1..R6)")
add_note("TU-COL-01", "RATIFIED by the TU spec v5 changelog 2026-07-29 (\"Added the suite-standard column "
                      "selector; made Est. Lost Labor a toggleable (hideable) column\") — the group-message "
                      "placeholder is superseded. Persistence is per browser, not per account.")

c = active("TU-ELL-02")
snap("TU-ELL-02")
c["title"] = "Est. Lost Labor, when shown, is pinned right and bold with the info icon"
c["preconditions"] = c["preconditions"] + [
    "2. Est. Lost Labor is turned ON in the Column Selection control (it is on by default)."]
c["preconditions"] = renumber(c["preconditions"])
c["expected"] = renumber([
    "1. While Est. Lost Labor is shown, the column is pinned to the far right; its cells are bold and its "
    "header is bold, matching.",
    "2. The information icon shows exactly: \"Internal hours valued at each location's default labor rate\" — "
    "on hover, on keyboard focus, and on tap; it is dismissible.",
    "3. NO column header other than Est. Lost Labor shows the information icon.",
    "4. Est. Lost Labor can be turned OFF in the Column Selection control; when it is off the column, its bold "
    "styling and its information icon are all absent, and the report still works normally."])
c["steps"] = renumber(c["steps"] + [
    "4. Turn Est. Lost Labor off in the Column Selection control and look at the table again."])
c["spec_ref"] = ("SV-8652 (TU spec v5 2026-07-29 S2-R10; S2-R11; S8-R4; S8-R6; S8-R7; S8-N1 — each re-worded "
                 "\"When shown\" now that Est. Lost Labor is a hideable column, new Story 10 S10-R3)")
note("TU-ELL-02", "D8: \"when shown\" qualifier added — Est. Lost Labor is no longer always on; title trimmed")
add_note("TU-ELL-02", "CHANGED by the TU spec v5 2026-07-29: S2-R10/S2-R11/S8-R4/S8-R6 all now read \"When "
                      "shown…\" and S10-R3 makes Est. Lost Labor hideable (verbatim: \"Est. Lost Labor was "
                      "previously always-on; it is now a hideable column like the others\").")

c = active("TU-VIS-01")
snap("TU-VIS-01")
c["title"] = "All-white table with no row shading; toolbar controls in the fixed order"
c["expected"][1] = ("2. The toolbar controls run, left to right: the three-dot download menu, the Column "
                    "Selection control, the date-range picker, the technician filter, and the Location filter "
                    "(rightmost).")
c["spec_ref"] = "SV-8655 (TU spec v5 2026-07-29 S8-R1; S8-R2; S8-R3 — toolbar order rewritten: Column Selection inserted after the three-dot menu, and the date-range picker now precedes the technician filter)"
note("TU-VIS-01", "D8: toolbar order corrected (Column Selection inserted; date-range and technician filter swapped); title trimmed")
add_note("TU-VIS-01", "CHANGED by the TU spec v5 2026-07-29 S8-R3 (was: \"the three-dot download menu, the "
                      "technician filter, the date-range picker, and the location filter\"; now: \"the "
                      "three-dot download menu, the Column Selection control, the date-range picker, the "
                      "technician filter, and the location filter (rightmost)\").")

c = active("TU-EXP-01")
snap("TU-EXP-01")
c["title"] = "Three-dot menu is leftmost, then Column Selection; three download options"
c["expected"][0] = ("1. The three-dot download menu sits LEFTMOST in the toolbar's action cluster, with the "
                    "Column Selection control immediately after it.")
c["spec_ref"] = "SV-8654 (TU spec v5 2026-07-29 S7-R1; S7-R2; S7-R3; S7-R4; S8-R2 — S8-R2 now adds \"followed by the Column Selection control\")"
note("TU-EXP-01", "D8: the Column Selection control's position added; title trimmed")
add_note("TU-EXP-01", "CHANGED by the TU spec v5 2026-07-29 S8-R2 (\"…sits leftmost in the toolbar's action "
                      "cluster, followed by the Column Selection control\").")

c = active("TU-EXP-06")
snap("TU-EXP-06")
c["title"] = "PDF logo: the uploaded logo, else the bundled ShopView logo; CSV never"
c["expected"] = renumber([
    "1. With an uploaded logo, BOTH PDF views show that logo at the top of the report.",
    "2. The CSV never includes the logo.",
    "3. With NO uploaded logo, the PDF views show the bundled ShopView logo instead — not a blank space and "
    "not an error."])
c["spec_ref"] = "SV-8654 (TU spec v5 2026-07-29 S7-R11; S7-N2; S7-N3 — logo now resolved by the shared resolver: the organization's uploaded logo, else the bundled ShopView default)"
note("TU-EXP-06", "D8: the no-logo expectation INVERTED — the bundled ShopView logo now shows; title trimmed")
add_note("TU-EXP-06", "INVERTED by the TU spec v5 2026-07-29. Was S7-N2 \"If the shop has no logo set, the PDF "
                      "views show no logo\"; now S7-N2 \"If the organization has no uploaded logo, the PDF "
                      "views show the bundled ShopView default logo (not a blank space)\" and S7-R11 names the "
                      "shared resolver.")

c = active("TU-EXP-04")
snap("TU-EXP-04")
c["expected"] = renumber(c["expected"] + [
    "5. Every download also mirrors the columns currently shown on screen — a column hidden in the Column "
    "Selection control is absent from the files, and a re-shown column comes back."])
c["steps"] = renumber(c["steps"] + [
    "5. Hide one column in the Column Selection control, download again and compare the file's columns."])
c["spec_ref"] = "SV-8654 (TU spec v5 2026-07-29 S7-R8; S7-R9; S7-R10; S7-E1; S9-R8 — S7-R10 now says the downloads include the columns currently shown, mirroring the column selector)"
note("TU-EXP-04", "D8: downloads now mirror the selected columns (S7-R10 rewritten)")
add_note("TU-EXP-04", "CHANGED by the TU spec v5 2026-07-29 S7-R10 (\"The downloaded files include the same "
                      "columns that are currently shown on screen — mirroring the column-selector visibility "
                      "(Story 10)…\").")

# --- D9: Sales By Customer exports ----------------------------------------
set_fields("SBC-EXP-02",
    title="Download file names carry the version and the active date range",
    preconditions=["1. You are on the report with data."],
    steps=[
        "1. Set the range to This Month, choose \"Download Summary (CSV)\" and note the downloaded file name.",
        "2. Choose \"Download Expanded View (CSV)\" and note that file name.",
        "3. Repeat both for at least Today, Last Quarter, and a Custom range.",
        "4. Open a downloaded file in a text editor and in a spreadsheet.",
        "5. Repeat steps 1-3 for \"Download Summary (PDF)\" and \"Download Expanded View (PDF)\"."],
    expected=[
        "1. The Summary file name is sales-by-customer-summary-{range}.csv and the Expanded file name is "
        "sales-by-customer-expanded-{range}.csv — so the file says which version it is.",
        "2. {range} follows this map: Today → today; Yesterday → yesterday; This Week → this_week; Last Week → "
        "last_week; This Month → this_month; Last Month → last_month; This Year → this_year; Last Year → "
        "last_year; This Quarter → this_quarter; Last Quarter → last_quarter; Custom → custom.",
        "3. For Custom the literal word \"custom\" is used — the actual start and end dates are not in the "
        "file name.",
        "4. The file is plain comma-separated text with a .csv extension that opens as rows and columns in a "
        "spreadsheet — not an .xlsx workbook and not a JSON file.",
        "5. The two PDF downloads follow the same names with a .pdf extension — for example, "
        "sales-by-customer-summary-this_month.pdf and sales-by-customer-expanded-custom.pdf."],
    spec_ref="SV-8612; SV-8613 (SBC spec v12 2026-07-29 S14-R14; S15-R6 — file names now carry the Summary/Expanded version; the old flat sales-by-customer-{range} map is superseded)")
note("SBC-EXP-02", "D9: file names re-based on the ratified Summary/Expanded naming; menu items updated; title trimmed")
add_note("SBC-EXP-02", "CHANGED by the SBC spec v12 2026-07-29 S14-R14 / S15-R6 (Summary and Expanded file "
                       "names). SPEC-WATCH item 3 CLOSED — the Summary/Expanded split is now spec-ratified.")

c = active("SBC-EXP-03")
snap("SBC-EXP-03")
c["expected"] = renumber([
    "1. The Expanded View CSV has these thirteen columns in this exact order: Customer, Asset, Invoice #, "
    "Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, "
    "Margin %, Subtotal.",
    "2. A customer row fills the Customer cell and leaves Asset, Invoice # and Date blank.",
    "3. An asset row leaves Customer blank, fills Asset, and leaves Invoice # and Date blank.",
    "4. An invoice row leaves Customer and Asset blank and fills Invoice # and Date.",
    "5. Customer names are plain — the \"(N)\" invoice count is not included.",
    "6. Work with no vehicle appears as an asset row named \"Parts Sales\".",
    "7. The file carries a \"Locations:\" line naming the location or locations the report was scoped to, or "
    "\"All locations\" when every location you can access is selected — as a leading line above the column "
    "headers."])
c["spec_ref"] = ("SV-8612 (SBC spec v12 2026-07-29 Story 14 S14-R5; S14-R6; S14-R7; S14-R13 — the Expanded "
                 "CSV now has thirteen columns INCLUDING Asset, with per-level blank-cell rules; the old flat "
                 "twelve-column shape is superseded)")
note("SBC-EXP-03", "D9: Expanded CSV is now 13 columns including Asset; per-level blank rules and the Parts Sales asset row pinned")
add_note("SBC-EXP-03", "RATIFIED + EXTENDED by the SBC spec v12 2026-07-29: S14-R5 gives the exact thirteen-"
                       "column Expanded order (Asset added), S14-R6 the per-level row shape, S14-R7 the "
                       "\"Parts Sales\" asset row, S14-R13 the \"Locations:\" line.")

c = active("SBC-EXP-16")
snap("SBC-EXP-16")
c["expected"] = renumber(c["expected"] + [
    "5. The Summary files have these ten columns in this exact order: Customer, Inv. Hrs, Labor Invoiced, "
    "Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal — no Asset, "
    "Invoice # or Date columns."])
c["spec_ref"] = ("SV-8612; SV-8613 (SBC spec v12 2026-07-29 Story 14 S14-R1/R2/R4 + Story 15 S15-R1/R2/R4/R5 — "
                 "the four-item Summary/Expanded menu and the Summary column list are now spec-ratified)")
note("SBC-EXP-16", "D9: the ratified Summary column list added")
add_note("SBC-EXP-16", "RATIFIED by the SBC spec v12 2026-07-29 (S14-R4 Summary columns). SPEC-WATCH item 3 CLOSED.")

c = active("SBC-EXP-11")
snap("SBC-EXP-11")
c["expected"][0] = ("1. The Expanded View PDF's body table has the same thirteen columns, in the same order "
                    "and with the same labels, as the Expanded View CSV — including the Asset column — and "
                    "shows the full Customer, then Asset, then Invoice breakdown, one block per customer.")
c["expected"][2] = "3. The Date cell is blank on customer rows and on asset rows, matching the screen."
c["expected"] = renumber(c["expected"] + [
    "7. The PDF header title reads \"Sales By Customer Report\" on the Summary and Expanded versions alike — "
    "which version you have is told by the file name and the contents, not by a different title."])
c["spec_ref"] = ("SV-8613 (SBC spec v12 2026-07-29 Story 15 S15-R5; S15-R13; S15-R19; S15-R20; S15-R21; "
                 "S15-R22; S15-R23; S15-R24 — Expanded PDF body = the Expanded columns with the asset layer, "
                 "one block per customer; the title is the same for both versions)")
note("SBC-EXP-11", "D9: Expanded PDF body re-based on the ratified 13 columns + per-version title rule")
add_note("SBC-EXP-11", "RATIFIED by the SBC spec v12 2026-07-29 (S15-R5 Expanded body \"one block per "
                       "customer\", S15-R13 same header title for both versions, S15-R19 column labels match "
                       "the CSV, S15-R21 Date blank on customer AND asset rows).")

set_fields("SBC-EXP-06",
    title="Each download item shows a loading state and its own export-failed toast",
    preconditions=["1. You are on the report with a large enough data set that a download takes a visible moment."],
    steps=[
        "1. Choose \"Download Summary (CSV)\" and immediately look at that menu item.",
        "2. To provoke a failure, disconnect the network (or use the browser's offline mode) and choose "
        "\"Download Summary (CSV)\" again.",
        "3. Repeat both checks for \"Download Expanded View (CSV)\", \"Download Summary (PDF)\" and "
        "\"Download Expanded View (PDF)\"."],
    expected=[
        "1. While a download is in progress, ONLY that menu item shows a loading state and is "
        "non-interactive; the other three items are unaffected.",
        "2. If a CSV download fails, an error toast is shown: \"CSV export failed.\" (dismissed by the user).",
        "3. If a PDF download fails, the toast reads \"PDF export failed.\" — identical behaviour, different "
        "wording."],
    spec_ref="SV-8612; SV-8613 (SBC spec v12 2026-07-29 Story 14 S14-E1; S14-N1; Story 15 S15-E1; S15-N1; §7 — the loading state is now per menu item, four items)")
note("SBC-EXP-06", "D9: loading state is per menu item across the four ratified items; title trimmed")
add_note("SBC-EXP-06", "CHANGED by the SBC spec v12 2026-07-29 (S14-E1/S15-E1 now read \"While a CSV/PDF "
                       "download is in progress, THAT menu item shows a loading state\").")

# --- D10: WIP Location out of the column selector -------------------------
c = active("WIP-COL-01")
snap("WIP-COL-01")
c["title"] = "With all toggleable columns on, the fixed column order and alignment hold"
c["preconditions"] = renumber([
    "1. You are signed in to the ShopView App on a desktop browser.",
    "2. The Work In Progress report is open with rows loaded.",
    "3. Every toggleable column is turned on in the column-selection control.",
    "4. More than one location is in scope, so the automatic Location column is showing."])
c["spec_ref"] = ("SV-8659 (WIP spec v6 2026-07-29 Story 4 S4-R1; S4-R3; S4-R4 — the Location column is no "
                 "longer in the column selector; it shows automatically when more than one location is in scope)")
note("WIP-COL-01", "D10: precondition reworded — Location is automatic, not a toggle; title trimmed")

c = active("WIP-COL-02")
snap("WIP-COL-02")
c["title"] = "First visit shows the default columns; the rest are in the column selector"
c["expected"] = renumber([
    "1. The visible columns on first visit are: WO #, Status, Customer, Asset, Advisor, Days Open, Earned, "
    "Remaining, and Total.",
    "2. Every other column (VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, "
    "Inv. Hrs) is available in the column-selection control and off by default.",
    "3. Location is NOT offered in the column-selection control — it appears on its own whenever more than one "
    "location is in scope, and is hidden when a single location is in scope."])
c["spec_ref"] = ("SV-8659; SV-8664 (WIP spec v6 2026-07-29 Story 4 S4-R2; S4-R3 + Story 8 S8-R3; S8-R4 — "
                 "S4-R3 verbatim: \"The Location column is not offered in the column selector; its visibility "
                 "is automatic\")")
note("WIP-COL-02", "D10: Location removed from the selector-offered list; automatic visibility stated; title trimmed")
for cid in ("WIP-COL-01", "WIP-COL-02"):
    add_note(cid, "CHANGED by the WIP spec v6 2026-07-29 S4-R3 (verbatim: \"The Location column is not offered "
                  "in the column selector; its visibility is automatic — shown only when more than one "
                  "location is in scope (Story 7)\").")

# --- refs condensed for touched cases whose refs exceed the TestRail 250-char cap ---
set_fields("SBR-WO-06",
    spec_ref="SV-8636 (SBR spec Story 19 S19-R7; S19-E1 — customer-card label RE-RULED to the full "
             "\"Sales Representative\" per the PRD companion video 2026-07-30 + Chris Ward answer 2026-07-31 "
             "Q5=A; the spec text still says \"Sales Rep\")")
note("SBR-WO-06", "refs condensed to the TestRail 250-character cap and re-cited to Chris's Q5 answer")

# ------------------------------------------------- 3. title trims (≤80)
TRIMS = {
 "SBR-EXP-15": "Over-cap Expanded View PDF is refused with the too-large message",
 "SBR-WO-01": "Sales Representative selector: on WO and Part Sale, hidden on imported",
 "SBR-WO-02": "Selector offers only reps whose sales-representative toggle is on",
 "SBR-WO-03": "A new WO opens with Sales Representative unassigned; a change saves at once",
 "SBR-WO-04": "The Sales Representative selector is read-only when Invoiced or Paid",
 "SBR-WO-05": "Invoice credit snapshot: WO rep, else customer rep, else unassigned",
 "SBR-ASGN-01": "Report Name dropdown lists Sales Representative Assignments at the bottom",
 "SBR-ASGN-02": "Sales Representative Assignments CSV: file name, headers, success toast",
 "SBR-ASGN-03": "Assignments CSV: one row per assigned customer, sorted customer then rep",
 "SBR-ASGN-04": "\"Rep is active?\" tracks the staff-active status, not the toggle",
 "SBR-ASGN-05": "A deleted rep record still exports one row from the stored name, marked No",
 "SBR-ASGN-06": "Assignments export failure and nothing-to-export use the dialog's messages",
 "SBR-DEACT-02": "Deactivate dialog: counted pluralized headline, reassurance, focus trap",
 "SBR-DEACT-06": "After deactivation: toggle unchanged, CSV shows No, report credit intact",
 "SBR-UNAS-01": "Show Unassigned sits between the column selector and the date picker, off",
 "SBR-EXP-10": "Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep",
 "SBR-EXP-11": "Expanded CSV: file name, verbatim headers, one row per invoice",
 "SBR-EXP-12": "CSV cells: plain numbers, signed Inv. Hrs, empty Margin %, (Inactive)",
 "SBR-EXP-13": "The Unassigned row appears in all four downloads only when the toggle is on",
 "SBR-PERM-02": "Without Reports access: no navigation, no export menu, no Export dialog",
 "SBR-API-06": "Deactivating a rep first runs a server pre-check returning the count",
 "PV-COL-01": "Column picker lists all 20 columns and never offers the internal cost",
 "PV-COL-03": "A re-enabled column returns to its canonical slot, with no reload",
 "PV-ROW-08": "Em-dash only in nullable fields; counts and Revenue/Margin are never null",
 "PV-CALC-05": "Sold (WO) counts Service work orders, Sold (Parts Sale) counts Parts",
 "PV-CALC-11": "A reversed or voided sale is excluded from every billed-line column",
 "PV-CALC-13": "Number formats match the spec per column; rounding is half away from zero",
 "PV-CALC-15": "Movement and billed bases may differ; Sold (WO) + Sold (Parts Sale) = billed",
 "PV-CALC-16": "Window anchors: movement uses the event date, billed uses the WO date",
 "PV-ROW-02": "A Special Order part is one merged row summed across selected locations",
 "PV-ROW-03": "Rows load ranked by Demand descending, indicator on the Demand header",
 "PV-ROW-04": "A header click sorts ascending first, toggles, and places nulls by direction",
 "PV-ROW-09": "An inventory part drops out only with no movement, no stock and no revenue",
 "PV-CALC-02": "Special Order Units Sold = in-window request quantity, net of reversals",
 "PV-CALC-06": "Demand counts each transaction once; a reversal neither adds nor subtracts",
 "PV-CALC-07": "Last Sale is whole days since the most recent sale over all-time history",
 "PV-CALC-09": "Turns / Yr annualizes the sales rate, is 0.00 at zero stock, can be negative",
 "PV-CALC-10": "Revenue, Margin, Unit Cost, Sell Price and Margin % use the billed formulas",
 "PV-EXP-04": "Exports reflect the active sort, including Min/Max and null placement",
 "PV-EXP-07": "Em-dash in both exports; Last Sale reads \"N days\" in the PDF",
}
for cid, t in TRIMS.items():
    c = active(cid)
    if c["title"] != t:
        snap(cid)
        c["title"] = t
        TOUCHED.setdefault(cid, []).append("title trimmed to ≤ 80 characters (concise-title rule, case touched this pass)")

# ------------------------------------------------- 4. NEW cases
DESIGN = "none — design not yet available (spec-only authoring)"
LOCFILTER_WIDTH = ("The Location filter control keeps the same width whichever label it shows — one location, "
                   "several, or \"All locations\" — so the toolbar does not shift as you change the selection.")

def newcase(cid, area, title, priority, ctype, perms, pre, steps, exp, refs, notes, api=False):
    assert len(title) <= 80, (cid, len(title))
    return {"id": cid, "area": area, "title": title, "priority": priority, "type": ctype,
            "permissions_required": perms,
            "preconditions": renumber(pre), "steps": renumber(steps), "expected": renumber(exp),
            "design_ref": DESIGN, "spec_ref": refs, "viu_status": "VIU-Pending",
            "notes": notes, "api_related": api}

NEW = []

NEW.append(newcase("SBC-LOC-04", "SBC — Location Filter",
 "The Location column shows only with more than one location; Multiple on totals",
 "High", "Functional", "The ordinary reports access (Reports section View).",
 ["1. You are on the Sales By Customer report as a user with access to two or more locations.",
  "2. At least one customer has invoices at two different locations, and at least one asset has invoices at "
  "two different locations."],
 ["1. Select two or more locations in the Location filter and read the column headers.",
  "2. Read the Location cell on a customer row whose invoices are all at one location.",
  "3. Read the Location cell on a customer row and an asset row whose invoices span two locations.",
  "4. Expand to an invoice row and read its Location cell.",
  "5. Open the column selector and look for Location in the list.",
  "6. Narrow the Location filter to a single location and read the headers again.",
  "7. Change the Location selection between one location, several, and \"All locations\", watching the "
  "filter control's width."],
 ["1. With more than one location in scope a Location column is shown, positioned immediately after the Date "
  "column.",
  "2. A customer or asset row whose invoices are all at one location shows that location's name.",
  "3. A customer or asset row whose invoices come from more than one location shows \"Multiple\".",
  "4. An invoice row always shows its own exact location — never \"Multiple\".",
  "5. Location is NOT offered in the column selector — it appears and disappears on its own, following the "
  "location scope.",
  "6. With a single location in scope the Location column is hidden and the surrounding columns close up with "
  "no gap.",
  "7. " + LOCFILTER_WIDTH],
 "SV-8600 (SBC spec v12 2026-07-29 S4-R12; S4-R12a; S20-R19 — per-row Location column with automatic "
 "visibility, \"Multiple\" on aggregating rows)",
 "NEW 2026-07-31. The per-row Location column is a suite-wide addition in Chris Ward's 2026-07-29 spec "
 "changelog (SBC v12 change-log row: \"added a per-row Location column (shown when more than one location is "
 "in scope; 'Multiple' on aggregating rows, exact on invoice rows) plus a 'Locations:' export line\"). The "
 "suite had NO coverage of this column. The \"Locations:\" export line itself is already covered by SBC-EXP-03 "
 "and SBC-EXP-09. Exact on-screen header capitalisation is VIU-confirm. Not live-verified (Rule 12)."))

NEW.append(newcase("SBR-LOC-05", "SBR — Location Filter",
 "The Location column shows only with more than one location; rep rows Multiple",
 "High", "Functional", "Reports access (Reports section View).",
 ["1. You are on the Sales By Representative report as a user with access to two or more locations.",
  "2. One rep has invoices at a single location and another rep has invoices at two different locations.",
  "3. Show Unassigned is turned on and at least one unassigned invoice exists."],
 ["1. Select two or more locations and read the column headers.",
  "2. Read the Location cell on the single-location rep's summary row.",
  "3. Read the Location cell on the rep whose invoices span two locations.",
  "4. Expand that rep and read an invoice detail row's Location cell.",
  "5. Read the Location cell on the Unassigned summary row.",
  "6. Check that the pinned Subtotal column is still the rightmost column.",
  "7. Narrow to a single location and read the headers again.",
  "8. Change the selection between one location, several, and \"All Locations\", watching the filter "
  "control's width."],
 ["1. With more than one location in scope a Location column is shown, positioned immediately after the "
  "Status column and before Inv. Hrs.",
  "2. A rep summary row whose invoices are all at one location shows that location's name.",
  "3. A rep summary row whose invoices span more than one location shows \"Multiple\".",
  "4. An invoice detail row shows that invoice's own exact location — never \"Multiple\".",
  "5. The Unassigned summary row follows the same rule as any rep summary row.",
  "6. The pinned Subtotal column is still rightmost — the Location column never displaces it.",
  "7. With a single location in scope the Location column is hidden.",
  "8. " + LOCFILTER_WIDTH],
 "SV-8638 (SBR spec v15 2026-07-29 S21-R7; S21-R8; S18-R13 — per-row Location column, \"Multiple\" verbatim "
 "on a rep row spanning locations, position after Status, constant-width filter)",
 "NEW 2026-07-31. Added by Chris Ward's 2026-07-29 spec changelog (SBR v15 change-log row: \"Added a per-row "
 "Location column, shown only when the current view spans more than one location…\"). \"Multiple\" is used "
 "verbatim per S21-R8. The \"Locations:\" export line is already covered by SBR-EXP-02. Not live-verified "
 "(Rule 12)."))

NEW.append(newcase("PV-FILT-14", "PV — Filters",
 "The Location column shows only with more than one location, leftmost before Type",
 "High", "Functional",
 "Manager or Office User role (Reports section access) plus the Inventory Reports → View permission.",
 ["1. You are on the Parts Velocity report as a user with access to two or more locations, with data loaded.",
  "2. The same inventory part is stocked at two of those locations, and at least one Special Order part has "
  "vendor requests at two of them."],
 ["1. Select two or more locations and read the column headers from the left.",
  "2. Read the Location cell on each of the two inventory rows for the part stocked at both locations.",
  "3. Read the Location cell on the merged Special Order row.",
  "4. Open the column picker and look for Location in the list.",
  "5. Narrow to a single location and read the headers again.",
  "6. Change the selection between one location, several, and \"All Locations\", watching the filter "
  "control's width."],
 ["1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.",
  "2. Each inventory row shows its own location's name (an inventory row is one part at one location).",
  "3. The merged Special Order row shows \"Multiple\", because it is summed across the selected locations.",
  "4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.",
  "5. With a single location in scope the Location column is hidden.",
  "6. " + LOCFILTER_WIDTH],
 "SV-8642 (PV spec v4 2026-07-29 S2-R12; S3-R10; S7-R8 — per-row Location column, leftmost before Type, "
 "\"Multiple\" on the merged special-order row, not in the picker)",
 "NEW 2026-07-31. Added by Chris Ward's 2026-07-29 spec changelog (PV v4 change-log row: \"added a per-row "
 "Location column (shown when more than one location is in scope; 'Multiple' on rows spanning locations)\"). "
 "The per-row rule follows the report's row model (S3-R1a): inventory rows are per-location, special-order "
 "rows are merged. The \"Locations:\" export line is already covered by PV-EXP-02. Not live-verified (Rule 12)."))

NEW.append(newcase("TU-LOC-06", "TU — Location Filter",
 "The Location column shows only with more than one location; Summary row blank",
 "High", "Functional",
 "The permission that grants access to the timesheet reports (same as Timesheet Activities).",
 ["1. You are on the Technician Utilization report as a user with access to two or more locations.",
  "2. One technician clocked time at a single location in the range and another clocked time at two "
  "different locations.",
  "3. One of those days has hours at two locations (for the per-day check)."],
 ["1. Select two or more locations and read the column headers from the left.",
  "2. Read the Location cell on the single-location technician's row.",
  "3. Read the Location cell on the technician whose hours span two locations.",
  "4. Expand that technician and read the Location cell on a single-location day and on the mixed day.",
  "5. Read the Location cell on the Summary row at the bottom.",
  "6. Open the Column Selection control and look for Location in the list.",
  "7. Narrow to a single location and read the headers again.",
  "8. Change the selection between one location, several, and \"All Locations\", watching the filter "
  "control's width."],
 ["1. With more than one location in scope a Location column is shown as the LEFTMOST column, before "
  "Technician.",
  "2. A technician whose hours were all clocked at one location shows that location's name.",
  "3. A technician whose hours span more than one selected location shows \"Multiple\".",
  "4. An expanded day row shows the exact location when that day's hours were all at one location, and "
  "\"Multiple\" when the day spans more than one.",
  "5. The Summary row leaves the Location cell blank.",
  "6. Location is never listed in the Column Selection control — it follows the location scope on its own.",
  "7. With a single location in scope the Location column is hidden.",
  "8. " + LOCFILTER_WIDTH],
 "SV-8656 (TU spec v5 2026-07-29 S9-R9; S9-R10; S8-R15; S10-R4 — per-row Location column, leftmost before "
 "Technician, \"Multiple\" on a spanning row, Summary row blank, never in the selector)",
 "NEW 2026-07-31. Added by Chris Ward's 2026-07-29 spec changelog (TU v5 change-log row: \"added a per-row "
 "Location column (shown when more than one location is in scope)\"). The blank Summary cell is explicit in "
 "S9-R10 (\"The Summary row leaves the Location column blank\"). The \"Locations:\" export line is already "
 "covered by TU-EXP-04. Not live-verified (Rule 12)."))

NEW.append(newcase("WIP-FLT-09", "WIP — Filters",
 "The Location column is automatic and never reads Multiple on a work-order row",
 "High", "Functional",
 "A user with access to at least two locations and the Work In Progress reports permission.",
 ["1. You are signed in on a desktop browser as a user with access to at least two locations.",
  "2. Open work orders exist at two different locations.",
  "3. The Work In Progress report is open."],
 ["1. Select two or more locations in the Location filter and read the column headers.",
  "2. Read the Location cell on rows from each of the two locations, on every tab.",
  "3. Look for any row showing \"Multiple\".",
  "4. Open the column-selection control and look for Location in the list.",
  "5. Narrow to a single location and read the headers again.",
  "6. Download the tab as a CSV and a PDF and read the Location column's header in the files.",
  "7. Change the selection between one location, several, and \"All locations\", watching the filter "
  "control's width."],
 ["1. With more than one location in scope a Location column is shown, in its fixed position between VIN and "
  "Advisor, left-aligned.",
  "2. Each row names its own work order's location.",
  "3. NO row ever shows \"Multiple\" — a work order belongs to exactly one location, and this report has no "
  "grouped or drill-down rows.",
  "4. Location is NOT offered in the column-selection control — its visibility follows the location scope "
  "automatically.",
  "5. With a single location in scope the Location column is hidden.",
  "6. In both downloads the column is headed \"Branch\" (a known naming difference from the screen — do not "
  "raise it as a bug).",
  "7. " + LOCFILTER_WIDTH],
 "SV-8663 (WIP spec v6 2026-07-29 S7-R13; S7-R14; S4-R3; S9-E1; §4 Location (column) — automatic visibility, "
 "never \"Multiple\", export header \"Branch\")",
 "NEW 2026-07-31. WIP already HAD a Location column, but spec v6 2026-07-29 changed it from a user-toggled "
 "column to an automatic, scope-driven one and pinned the never-\"Multiple\" rule (§3 Key Decision verbatim: "
 "\"Because a work order belongs to exactly one location, each WIP row names its own location — a WIP row "
 "never shows 'Multiple'\"). The \"Branch\" export header is the pre-existing documented difference also "
 "covered by WIP-EXP-07. Not live-verified (Rule 12)."))

NEW.append(newcase("IV-LOC-06", "IV — Location Filter",
 "The Location column is automatic, sits after Vendor, and never reads Multiple",
 "High", "Functional",
 "A user with access to at least two locations and the inventory-reports permission.",
 ["1. You are signed in on a desktop browser as a user with access to at least two locations.",
  "2. The same part is in stock at two of those locations.",
  "3. The Inventory Value report is open with rows loaded."],
 ["1. Select two or more locations and read the column headers from the left.",
  "2. Read the Location cell on each of the two rows for the part stocked at both locations.",
  "3. Look for any row showing \"Multiple\".",
  "4. Open the column-selection control and look for Location in the list.",
  "5. Narrow to a single location and read the headers again.",
  "6. Change the selection between one location, several, and \"All locations\", watching the filter "
  "control's width."],
 ["1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on "
  "Hand.",
  "2. Each row names the location that row's stock is held at.",
  "3. NO row ever shows \"Multiple\" — each row is one part at one location.",
  "4. Location is NOT offered in the column-selection control — its visibility follows the location scope "
  "automatically.",
  "5. With a single location in scope the Location column is hidden and the surrounding columns close up.",
  "6. " + LOCFILTER_WIDTH],
 "SV-8674 (IV spec v3 2026-07-29 S7-R6; S7-R7; S3-R1; S12-R10 — Location column inserted between Vendor and "
 "Qty on Hand, automatic visibility, never \"Multiple\")",
 "NEW 2026-07-31. Added by Chris Ward's 2026-07-29 spec changelog (IV v3 change-log row: \"Added a per-row "
 "Location column (shown only when more than one location is in scope)\"). §4 Terminology verbatim: \"every "
 "row maps to exactly one location name — this report never shows an aggregated 'Multiple' value in the "
 "column.\" Pairs with IV-SCOPE-02 (a part at two locations = two rows). The \"Locations:\" export line is "
 "already covered by IV-EXP-02. Not live-verified (Rule 12)."))

NEW.append(newcase("WIP-EXP-10", "WIP — Exports",
 "An over-cap Work In Progress download is refused with the too-large message",
 "Medium", "Negative",
 "A user with access to the Work In Progress reports permission.",
 ["1. A filter combination exists whose work-order rows on one tab exceed 10,000 (widest date range, all "
  "locations, no advisor/customer/asset narrowing). If the environment cannot reach 10,000 rows even fully "
  "widened, record the maximum reachable and mark the case Blocked-Env with that reason."],
 ["1. With the over-cap filter set, download the tab as a CSV.",
  "2. Download the same tab as a PDF.",
  "3. Narrow the filters below the cap and download once more."],
 ["1. For both the CSV and the PDF: no file is generated and no download starts.",
  "2. An error toast is shown each time, reading exactly: \"This report is too large to export. Narrow the "
  "date range or filters, then try again.\" (dismissed by the user).",
  "3. Below the cap the download works normally."],
 "SV-8665 (WIP spec Story 9 — the 10,000-row export cap applies to ALL SIX reports per Chris Ward answer "
 "2026-07-31 Q3=A; the WIP spec page still has no cap line, his spec edit is pending)",
 "NEW 2026-07-31. Q3 RULED 2026-07-31 (Chris Ward answer, option A, verbatim: \"this was not well thought out "
 "by me (the specs were written at different times)\"): the 10,000-row export cap applies to all six reports, "
 "including the three whose spec pages never mentioned it. Parts Velocity (PV-EXP-11 = C38885) and Technician "
 "Utilization (TU-EXP-09 = C38887) already had a cap case from the tech-plan pass; Work In Progress had none. "
 "The message is the one ruled suite-wide by his Q2 answer. The exact cap counting basis for a per-tab WIP "
 "download is not spelled out in the spec — confirm it live at VIU. Not live-verified (Rule 12)."))

# --------------------------------------------------- 5. write out
os.makedirs(BACKUP, exist_ok=True)
NEWFILE_MAP = {"SBC-LOC-04": "cases-sbc-A-access-filters.json",
               "SBR-LOC-05": "cases-sbr-A-access-filters.json",
               "PV-FILT-14": "cases-pv-A-access-permissions-filters.json",
               "TU-LOC-06": "cases-tu-C-links-exports-location.json",
               "WIP-FLT-09": "cases-wip-C-summary-totals-filters.json",
               "IV-LOC-06": "cases-iv-C-asof-filters-location.json",
               "WIP-EXP-10": "cases-wip-D-persistence-exports.json"}
for nc in NEW:
    tgt = os.path.join(CASEDIR, NEWFILE_MAP[nc["id"]])
    assert nc["id"] not in byid, nc["id"]
    data[tgt].append(nc)

changed_files = set()
for cid in TOUCHED:
    changed_files.add(byid[cid][0])
for nc in NEW:
    changed_files.add(os.path.join(CASEDIR, NEWFILE_MAP[nc["id"]]))
# permissions_required sweep may have touched more files
for f, lst in data.items():
    changed_files.add(f)

for f in sorted(changed_files):
    shutil.copy2(f, os.path.join(BACKUP, os.path.basename(f) + ".orig")) if not os.path.exists(
        os.path.join(BACKUP, os.path.basename(f) + ".orig")) else None

# validate + save
for f, lst in data.items():
    for c in lst:
        if str(c.get("viu_status", "")).startswith("Retired"):
            continue
        if c["id"] in TOUCHED or c["id"] in {n["id"] for n in NEW}:
            assert len(c["title"]) <= 80, (c["id"], len(c["title"]), c["title"])
        if c["id"] in TOUCHED or c["id"] in {n["id"] for n in NEW}:
            assert len(c["spec_ref"]) <= 250, (c["id"], len(c["spec_ref"]))
        assert c["spec_ref"].strip(), c["id"]
    json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a", encoding="utf-8").write("\n")

# manifest
man = [f"# Chris-answers 2026-07-31 — edit MANIFEST (LOCAL ONLY, no TestRail writes)\n",
       f"Generated {datetime.date.today()} by `apply_chris_answers_2026-07-31.py`.",
       "Pre-edit copies of every touched case file are in `backup/*.orig` (restore = copy back over "
       "`../cases/`).\n",
       f"**Cases edited: {len(TOUCHED)} · new cases authored: {len(NEW)}**\n",
       "## Edited cases\n",
       "| Internal ID | TestRail | Changes |", "|---|---|---|"]
for cid in sorted(TOUCHED):
    man.append(f"| {cid} | {idmap.get(cid,'?')} | " + "; ".join(TOUCHED[cid]) + " |")
man += ["\n## New cases (need `add_case`)\n", "| Internal ID | Section (area) | Title |", "|---|---|---|"]
for nc in NEW:
    man.append(f"| {nc['id']} | {nc['area']} | {nc['title']} |")
man += ["\n## Before/after of the five pushed fields\n"]
for cid in sorted(BEFORE):
    f, c = byid[cid]
    man.append(f"### {cid} ({idmap.get(cid,'?')})")
    for k in PUSH_FIELDS:
        b, a = BEFORE[cid][k], c.get(k)
        if b != a:
            man.append(f"- **{k}** BEFORE: `{json.dumps(b, ensure_ascii=False)}`")
            man.append(f"- **{k}** AFTER:  `{json.dumps(a, ensure_ascii=False)}`")
    man.append("")
open(os.path.join(OUT, "MANIFEST.md"), "w", encoding="utf-8").write("\n".join(man) + "\n")

json.dump({"edited": sorted(TOUCHED), "new": [n["id"] for n in NEW]},
          open(os.path.join(OUT, "edit-set.json"), "w"), indent=1)
print(f"edited={len(TOUCHED)} new={len(NEW)} files={len(data)}")
print("edited:", " ".join(sorted(TOUCHED)))
