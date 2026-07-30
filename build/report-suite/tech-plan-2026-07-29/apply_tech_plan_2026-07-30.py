#!/usr/bin/env python3
"""Report Suite tech-plan reconciliation — Phase 3 apply script (2026-07-30).

LOCAL ONLY — no TestRail writes. Applies 7 edits + authors 5 new cases per
tech-plan-2026-07-29/TECH-PLAN-DELTAS.md. Pre-edit backups to backup/.
Idempotent: skips an edit if the marker text is already present.
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))          # tech-plan-2026-07-29/
CASES = os.path.join(BASE, '..', 'cases')
BACKUP = os.path.join(BASE, 'backup')
os.makedirs(BACKUP, exist_ok=True)

CIDS = {"WIP-API-01": "C30528", "SBR-STAT-02": "C30209", "SBR-BADGE-01": "C30226",
        "PV-CALC-07": "C30365", "SBC-API-02": "C30191", "WIP-FLT-05": "C30502",
        "IV-EXP-07": "C30593"}


def load(fname):
    p = os.path.join(CASES, fname)
    with open(p) as f:
        return p, json.load(f)


def save(p, data):
    with open(p, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")


def backup_case(case):
    dest = os.path.join(BACKUP, "%s_%s_pre-edit.json" % (case["id"], CIDS.get(case["id"], "noCID")))
    if not os.path.exists(dest):
        with open(dest, "w") as f:
            json.dump(case, f, indent=1, ensure_ascii=False)
            f.write("\n")


def find(data, cid):
    for c in data:
        if c["id"] == cid and not str(c.get("viu_status", "")).startswith("Retired"):
            return c
    raise SystemExit("case %s not found" % cid)


changed = []

# ---------- E1 WIP-API-01 ----------
p, d = load("cases-wip-E-visual-permissions-api.json")
c = find(d, "WIP-API-01")
if "replaces that date" not in " ".join(c["expected"]):
    backup_case(json.loads(json.dumps(c)))
    c["steps"].append("4. If a manual re-run of the capture is available, re-run it for the same date and inspect that date's rows again.")
    c["expected"].append("3. Re-running the capture for the SAME date replaces that date's rows — the day's existing rows are removed and re-recorded from current data, never duplicated.")
    c["spec_ref"] += "; tech-plan-2026-07-29 B1.2 (idempotent re-run — WIP spec Story 11 is silent on re-runs)"
    c["notes"] += " TECH-PLAN EDIT 2026-07-30: re-run idempotency (delete-and-re-record per location/work order/date) comes from the engineering plan B1.2 — the WIP spec is silent on it (the IV spec's S11-R3 twin has it); confirm live and flag to Chris if the spec re-diff still lacks it."
    save(p, d)
    changed.append("WIP-API-01 (E1)")

# ---------- E2 SBR-STAT-02 ----------
p, d = load("cases-sbr-A-access-filters.json")
c = find(d, "SBR-STAT-02")
if "DEPOSIT" not in " ".join(c["preconditions"]):
    backup_case(json.loads(json.dumps(c)))
    c["preconditions"].append("2. Seed the prepaid-with-zero-balance situation the realistic way: the customer pays a DEPOSIT up front that fully covers the work, so the invoice is created with nothing left to pay.")
    c["notes"] += " TECH-PLAN NOTE 2026-07-30: the balance-owed math behind \"prepaid\" is the bug-prone spot — deposits are handled specially in the app's payment totals, so a deposit-covered prepaid invoice wrongly showing \"Partially Paid\" is exactly the failure to watch for (engineering plan B6.2)."
    save(p, d)
    changed.append("SBR-STAT-02 (E2)")

# ---------- E3 SBR-BADGE-01 ----------
p, d = load("cases-sbr-B-rows-badge-calcs-totals-sorting.json")
c = find(d, "SBR-BADGE-01")
if "deposit-covered" not in c["notes"]:
    backup_case(json.loads(json.dumps(c)))
    c["notes"] += " TECH-PLAN NOTE 2026-07-30: include the deposit-covered prepaid invoice from SBR-STAT-02's seeding — that badge reading \"Partially Paid\" instead of \"Paid\" is the known bug-prone failure (engineering plan B6.2)."
    save(p, d)
    changed.append("SBR-BADGE-01 (E3)")

# ---------- E4 PV-CALC-07 ----------
p, d = load("cases-pv-C-calculations.json")
c = find(d, "PV-CALC-07")
if "re-anchors" not in " ".join(c["expected"]):
    backup_case(json.loads(json.dumps(c)))
    c["preconditions"].append("4. For the reversal check: a ZZAUTOTEST part whose MOST RECENT sale can be reversed, and an older sale of the same part also exists.")
    c["steps"].append("3. Reverse the part's most recent sale invoice and re-read Last Sale.")
    c["expected"].append("5. When the most recent sale is reversed, Last Sale re-anchors to the previous remaining sale (the day count grows accordingly); if no other sale remains it shows —.")
    c["spec_ref"] += "; tech-plan-2026-07-29 B3.1 (last-sale re-anchor on reversal — spec-silent)"
    c["notes"] += " TECH-PLAN EDIT 2026-07-30: the reversal re-anchor expectation comes from the engineering plan B3.1 (the spec's Last Sale rule is silent on reversal) — confirm live and flag any deviation."
    save(p, d)
    changed.append("PV-CALC-07 (E4)")

# ---------- E5 SBC-API-02 ----------
p, d = load("cases-sbc-D-states-visual-mobile-api.json")
c = find(d, "SBC-API-02")
if "does not offer" not in " ".join(c["expected"]):
    backup_case(json.loads(json.dumps(c)))
    c["steps"].append("3. Optional (API tooling): repeat the request with a made-up sort column name and read the response.")
    c["expected"].append("4. A sort request naming a column the report does not offer is safely refused or ignored — never an error page or a crash; sorting works only on the report's own columns.")
    c["spec_ref"] += "; tech-plan-2026-07-29 A2 (server sort whitelist)"
    save(p, d)
    changed.append("SBC-API-02 (E5)")

# ---------- E6 WIP-FLT-05 (notes only) ----------
p, d = load("cases-wip-C-summary-totals-filters.json")
c = find(d, "WIP-FLT-05")
if "START DATE" not in c["notes"]:
    backup_case(json.loads(json.dumps(c)))
    c["notes"] += " TECH-PLAN SEEDING AID 2026-07-30: in the build the work order's \"created\" date is its START DATE (there is no separate created timestamp) — to seed in-range/out-of-range work orders, set or backdate the start date (engineering plan B1.2)."
    save(p, d)
    changed.append("WIP-FLT-05 (E6)")

# ---------- E7 IV-EXP-07 ----------
p, d = load("cases-iv-D-persistence-sorting-exports.json")
c = find(d, "IV-EXP-07")
if "pending owner confirmation" in c["title"]:
    backup_case(json.loads(json.dumps(c)))
    c["title"] = "An over-cap filtered set produces no file and shows the too-large-to-export message"
    c["notes"] = ("CAP VALUE: the spec's 10,000-row cap was written as a proposed default; the engineering plan "
                  "(2026-07-21, A3/FR-F4) records 10,000 as the single suite-wide export cap \"locked by Chris 07-21\". "
                  "Verify the capped BEHAVIOR and the verbatim message live, and record the actual cap value observed. "
                  "TECH-PLAN EDIT 2026-07-30 (title trimmed — the pending-confirmation clause is resolved by the plan; still VIU-confirm).")
    save(p, d)
    changed.append("IV-EXP-07 (E7)")

# ---------- New cases ----------
NEW = [
 ("cases-pv-D-exports-visual-api.json", {
  "id": "PV-EXP-11", "area": "PV — Exports",
  "title": "An over-cap Parts Velocity export is refused with the too-large message",
  "priority": "High", "type": "Negative",
  "permissions_required": "Manager or Office User role (Reports section access) plus the Inventory Reports → View permission (S1-R4).",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. A filter/location combination exists whose filtered set EXCEEDS the export row cap (widest date range + all locations; seed ZZAUTOTEST parts in bulk if needed, or use the largest available data set)."],
  "steps": [
   "1. Set the filters so the filtered set exceeds the export row cap.",
   "2. Request the CSV download and read what happens.",
   "3. Request the PDF download and read what happens.",
   "4. Narrow the date range or filters below the cap and request a download again."],
  "expected": [
   "1. Neither the CSV nor the PDF is produced — no download starts.",
   "2. A clear too-large message appears telling the user to narrow the date range or filters, then try again — the standard wording is \"This report is too large to export. Narrow the date range or filters, then try again.\"",
   "3. After narrowing below the cap, the downloads work again."],
  "design_ref": "none - SPEC-ONLY (Report Suite: no designs yet; design-reconciliation later if Figma arrives)",
  "spec_ref": "SV-8646 (specs/parts-velocity.md Story 6 exports — spec silent on a cap; tech-plan-2026-07-29 A3/FR-F4: suite-wide 10,000-row export cap, locked by Chris 2026-07-21)",
  "viu_status": "VIU-Pending",
  "notes": "SPEC-SILENT: the Parts Velocity spec page carries no export-cap text; the cap comes from the engineering plan's suite-wide 10,000-row export guard (locked by Chris 2026-07-21; the plan's own PV test list includes the over-cap toast). Flagged to Chris to ratify into the spec (Questions-for-Chris-dev Q3). VIU-confirm the behavior, the exact message text, and the actual cap value.",
  "api_related": False}),
 ("cases-tu-C-links-exports-location.json", {
  "id": "TU-EXP-09", "area": "TU — Exports",
  "title": "An over-cap Technician Utilization export is refused with the too-large message",
  "priority": "High", "type": "Negative",
  "permissions_required": "The permission that grants access to the timesheet reports (same as Timesheet Activities - no new permission).",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. A range/location combination exists whose filtered set EXCEEDS the export row cap (widest date range + all locations; seed ZZAUTOTEST clock records in bulk if needed, or use the largest available data set)."],
  "steps": [
   "1. Set the date range and locations so the filtered set exceeds the export row cap.",
   "2. Request the CSV download and read what happens.",
   "3. Request the PDF download and read what happens.",
   "4. Narrow the date range or filters below the cap and request a download again."],
  "expected": [
   "1. Neither the CSV nor the PDF is produced — no download starts.",
   "2. A clear too-large message appears telling the user to narrow the date range or filters, then try again — the standard wording is \"This report is too large to export. Narrow the date range or filters, then try again.\"",
   "3. After narrowing below the cap, the downloads work again."],
  "design_ref": "none - SPEC-ONLY (Report Suite: no designs yet; design-reconciliation later if Figma arrives)",
  "spec_ref": "SV-8654 (specs/technician-utilization.md Story 7 exports — spec silent on a cap; tech-plan-2026-07-29 A3/FR-F4: suite-wide 10,000-row export cap, locked by Chris 2026-07-21)",
  "viu_status": "VIU-Pending",
  "notes": "SPEC-SILENT: the Technician Utilization spec page carries no export-cap text; the cap comes from the engineering plan's suite-wide 10,000-row export guard (locked by Chris 2026-07-21; the plan's FR-F4 explicitly lists TU Story 7). Flagged to Chris to ratify into the spec (Questions-for-Chris-dev Q3). VIU-confirm the behavior, the exact message text, and the actual cap value.",
  "api_related": False}),
 ("cases-wip-B-columns-calc-sorting.json", {
  "id": "WIP-CALC-10", "area": "WIP — Earned & Remaining",
  "title": "A technician still clocked in counts toward Labor Earned, capped at the quote",
  "priority": "High", "type": "Functional",
  "permissions_required": "A role with the permission that grants access to Work In Progress reports (the report reuses one existing reporting permission — Story 1 prerequisite).",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. The Labor Earned column is turned on.",
   "3. A ZZAUTOTEST open work order exists with one approved labor line quoted at a known time and rate (for example 2.0 hours at $100/hour = $200 quoted).",
   "4. A technician is CURRENTLY CLOCKED IN on that line and has not clocked out."],
  "steps": [
   "1. Read the work order's Labor Earned value while the technician is still clocked in.",
   "2. Wait a while (let more time accrue on the running clock), refresh the report, and re-read Labor Earned.",
   "3. Leave the clock running well past the line's quoted time (or simulate it), refresh, and re-read."],
  "expected": [
   "1. The running (not-yet-clocked-out) time counts toward Labor Earned — the line's earned share reflects the time clocked up to now, not only closed clock records.",
   "2. After more time accrues, a refresh shows a larger earned share for that line.",
   "3. Labor Earned never exceeds the line's full quoted value, no matter how long the clock keeps running — the per-line cap still applies."],
  "design_ref": "none — design not yet available (spec-only authoring)",
  "spec_ref": "SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R15; §4 Terminology (Earned) — spec silent on running clocks; tech-plan-2026-07-29 B1.2 open-clock policy)",
  "viu_status": "VIU-Pending",
  "notes": "REGRESSION GUARD: the old WIP report's clocked-time math DROPPED still-open clock records entirely (the engineering plan B1.2 warns the legacy sums lose open rows) — a still-clocked-in technician contributing $0.00 is exactly the failure to catch. The spec is silent on running clocks; the expectation (value running time up to now, capped at the quote) comes from the engineering plan — confirm live.",
  "api_related": False}),
 ("cases-iv-C-asof-filters-location.json", {
  "id": "IV-DATE-09", "area": "IV — As-of Date & Snapshots",
  "title": "A recorded day keeps its category and vendor names after a rename or delete",
  "priority": "Medium", "type": "Functional",
  "permissions_required": "A role with the existing inventory-reports permission (Story 1 prerequisite) plus rights to manage part categories and vendors.",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. A recorded (overnight-captured) day exists that includes ZZAUTOTEST parts under a known category and a known vendor."],
  "steps": [
   "1. Rename that part category (and/or rename or delete the vendor) in administration.",
   "2. Set the report's date range so it shows the earlier recorded day (the \"As of\" indicator names that earlier date).",
   "3. Read the affected rows' Category and Vendor cells on the recorded day.",
   "4. Move the range back to include today (live view) and re-read a renamed category's rows."],
  "expected": [
   "1. The earlier recorded day still shows the category and vendor names AS THEY WERE RECORDED that day — a recorded day equals what the live report showed that day, even after the rename/delete.",
   "2. The rename/delete causes no blank Category/Vendor cells and no dropped rows on the recorded day.",
   "3. The live view (window reaching today) shows the NEW name for the renamed category."],
  "design_ref": "none — design not yet available (spec-only authoring)",
  "spec_ref": "SV-8678 (specs/inventory-value.md Story 11 S11-R2; Story 5 S5-R4; tech-plan-2026-07-29 B4.1 — names stored with the recorded rows on purpose)",
  "viu_status": "VIU-Pending",
  "notes": "The recorded rows carry their own copies of the category/vendor names (engineering plan B4.1: denormalized on purpose — survive category/vendor rename/delete on as-of replay), so later renames/deletes cannot corrupt history. Derived from S11-R2 (a recorded day equals what the live report showed that day); confirm live.",
  "api_related": False}),
 ("cases-sbr-B-rows-badge-calcs-totals-sorting.json", {
  "id": "SBR-CALC-09", "area": "SBR — Inv. Hrs & Calculations",
  "title": "A clock-record edit after invoicing updates Inv. Hrs; billed money stays put",
  "priority": "High", "type": "Functional",
  "permissions_required": "Reports/Performance access plus rights to edit technician clock records.",
  "preconditions": [
   "1. A ZZAUTOTEST invoiced (not reversed, not void) work order exists with billed labor and clocked technician hours, and its invoice row is visible under its rep in the report."],
  "steps": [
   "1. Note the invoice row's Inv. Hrs value and its money columns.",
   "2. Edit a technician clock record on that work order (change its length), or delete one.",
   "3. Reload the report and re-read the same invoice row."],
  "expected": [
   "1. The worked-hours side updates — Inv. Hrs (hours invoiced minus hours worked) reflects the edited clock time after the reload.",
   "2. The billed SELL values (Labor, Parts, Subtotal) stay unchanged — a clock edit never rewrites what was billed.",
   "3. The figures tied to worked time move together consistently (Margin uses the labor cost behind the worked hours, so it may change too) — nothing is left stale."],
  "design_ref": "none - SPEC-ONLY (Report Suite has no designs yet)",
  "spec_ref": "SV-8626 (specs/sbr-sales-by-representative.md §3 (hours worked = technician clocked hours recorded against that work order); Story 9 S9-R2; tech-plan-2026-07-29 Phase 4 FR-F7 clock-change rebuild)",
  "viu_status": "VIU-Pending",
  "notes": "The spec defines hours worked as the WO's clocked hours but does not say what happens when a clock record changes AFTER invoicing; the engineering plan (Phase 4 FR-F7 + drift correction #3) rebuilds the worked-hours/labor-cost side on any NON-VOID invoice while leaving the billed sell values untouched. Confirm live. The same stored values feed Sales By Customer, so a failure would show there too — one case guards both (kept single on purpose, Rule 28).",
  "api_related": False}),
]

for fname, case in NEW:
    p = os.path.join(CASES, fname)
    with open(p) as f:
        d = json.load(f)
    if any(x["id"] == case["id"] for x in d):
        continue
    d.append(case)
    save(p, d)
    changed.append(case["id"] + " (NEW)")

print("APPLIED:", len(changed))
for x in changed:
    print(" -", x)
