#!/usr/bin/env python3
"""PHASE 2 — close the ONE genuine coverage gap the SV-8582 epic re-check found.

SV-8589 (status In Progress since 2026-07-29) names its own tests verbatim:
    "**Tests:** fractional-quantity round-trip regression; QB journal amount exact
     from fractional movement."
Neither is covered: a grep of all 529 local case bodies returns 0 hits for
"quickbooks" and 0 for "fractional".

WHY EXACTLY TWO CASES (Rule 28 — no padding):
  * The story lists exactly two tests, and they are two genuinely different
    observable behaviours in two different systems:
      1) ShopView side — the fraction survives storage and reaches Units Sold
         un-truncated (round-trip regression).
      2) QuickBooks side — the journal-entry DOLLAR amount built from that
         fractional movement is exact, not inflated by the truncation.
    A truncation bug can be fixed on one side and still be wrong on the other, so
    neither case can absorb the other.
  * A third "negative / reversed fractional" variant was considered and REJECTED as
    padding: PV-ROW-10 (C30350) and PV-CALC-01 (C30359) already own reversal netting,
    and case 1 proves the precision of the stored quantity regardless of sign.

LOCAL ONLY. No TestRail writes. Both are VIU-Pending.
"""
import json, os, glob, csv

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CALC = os.path.join(ROOT, "cases", "cases-pv-C-calculations.json")
APIF = os.path.join(ROOT, "cases", "cases-pv-D-exports-visual-api.json")

PREC01 = {
 "id": "PV-PREC-01",
 "area": "PV — Columns & Calculations",
 "title": "Units Sold keeps an exact part-of-a-unit quantity and is never rounded off",
 "priority": "Critical",
 "type": "Functional",
 "permissions_required": "A role with the existing Inventory Reports to View permission (the report adds no new permission).",
 "preconditions": [
  "1. You can sign in with a role that opens the Parts Velocity report.",
  "2. A ZZAUTOTEST inventory part is in stock with a known unit cost, and there is enough on the shelf to sell a part-of-a-unit quantity such as 2.5.",
  "3. Today's date falls inside the date range you will use on the report."
 ],
 "steps": [
  "1. Open a ZZAUTOTEST work order and add that part to it with the quantity 2.5.",
  "2. Approve the part line, then invoice the work order.",
  "3. Sign out and sign back in, so nothing is being read from the browser's memory.",
  "4. Open the Parts Velocity report for a date range that includes today and find that part's row.",
  "5. Read the Units Sold value, then switch the On Hand column on and read that too."
 ],
 "expected": [
  "1. Units Sold reads exactly 2.50 — not 2.00, not 3.00, not blank and not a dash.",
  "2. It still reads exactly 2.50 after the sign-out and sign-back-in, which proves the part-of-a-unit quantity was really stored and not just shown once.",
  "3. On Hand has gone down by exactly 2.50 from what it was before the sale.",
  "4. No value anywhere on the row has been quietly rounded to a whole number."
 ],
 "design_ref": "none — design not yet available (spec-only authoring)",
 "spec_ref": "SV-8589 (PV spec S5-R1 Units Sold net stock movement + S5-R5 two-decimal movement format; tech-plan-2026-07-29 Phase 0 / PR-1 D2; SV-8589 verbatim Tests: 'fractional-quantity round-trip regression')",
 "viu_status": "VIU-Pending",
 "notes": "DRIVER SV-8589 (In Progress 2026-07-29) — Goal verbatim: 'Fix the live QuickBooks-corruption bug caused by inventory_changes.old_quantity/new_quantity being mapped integer while the domain types them float - fractional units are truncated at hydrate/persist'. Tests verbatim: 'fractional-quantity round-trip regression'. SV-8589 'Blocks: B3 (PV - Units Sold precision)'. VIU-confirm live: (a) whether the part-line quantity field actually accepts a fractional value and its exact on-screen label, (b) the exact On Hand column label and the column-picker label, (c) the fix is FORWARD-ONLY per the story ('historical truncation unreconstructible') so use a movement made AFTER the migration, never pre-migration history.",
 "api_related": False,
}

PREC02 = {
 "id": "PV-PREC-02",
 "area": "PV — API",
 "title": "QuickBooks amount for a part-of-a-unit sale is exact and never inflated",
 "priority": "Critical",
 "type": "Functional",
 "permissions_required": "A role that can invoice a work order, plus access to the connected QuickBooks company.",
 "preconditions": [
  "1. The test company is connected to QuickBooks.",
  "2. The part-of-a-unit sale has been made and invoiced — a ZZAUTOTEST part sold in a quantity such as 2.5, at a known unit cost such as $10.00.",
  "3. You can sign in to that QuickBooks company and look at its journal entries."
 ],
 "steps": [
  "1. Write down the quantity sold and the part's unit cost, and work out the correct amount by hand (2.5 x $10.00 = $25.00).",
  "2. Let the invoice go across to QuickBooks the normal way the shop does it.",
  "3. In QuickBooks, open the journal entry that was created for that invoice.",
  "4. Read the inventory / cost amount on that journal entry.",
  "5. Go back to the Parts Velocity report and read the same part's Units Sold value."
 ],
 "expected": [
  "1. The QuickBooks amount is exactly the hand-worked figure to the cent — $25.00 for 2.5 at $10.00.",
  "2. It is NOT a whole-unit amount such as $20.00 or $30.00, and it is NOT a bigger, multiplied figure.",
  "3. The quantity behind the QuickBooks amount matches the Units Sold value on the report (2.50) — the two systems agree.",
  "4. No second or correcting journal entry is created to patch up a wrong amount."
 ],
 "design_ref": "none — design not yet available (spec-only authoring)",
 "spec_ref": "SV-8589 (verbatim Tests: 'QB journal amount exact from fractional movement'; Goal: 'QB journal-entry sync multiplies these into dollar amounts'; tech-plan-2026-07-29 Phase 0 / PR-1 D2 - no report spec covers QuickBooks)",
 "viu_status": "VIU-Pending",
 "notes": "DRIVER SV-8589 (In Progress 2026-07-29) — Scope verbatim: 'Verify QB sync read paths (JournalEntry/Services/ReportGenerator.php, JournalEntrySyncService.php) receive un-truncated quantities.' Placed in a section titled API per Standing Rule 4: this is a back-end/integration regression across two systems, not a UI-only check. Per Standing Rule 6 QuickBooks is a DISPOSABLE test account, so the sync must actually be exercised end-to-end and the real journal entry read — do not skip because it writes to a third party. VIU-confirm live: the exact QuickBooks journal-entry account/line labels, and how the sync is triggered in this build (automatic on invoice vs a manual push).",
 "api_related": True,
}

calc = json.load(open(CALC, encoding="utf-8"))
apif = json.load(open(APIF, encoding="utf-8"))
existing = set()
for f in glob.glob(os.path.join(ROOT, "cases", "cases-*.json")):
    for c in json.load(open(f, encoding="utf-8")):
        existing.add(c["id"])
assert "PV-PREC-01" not in existing and "PV-PREC-02" not in existing
for c in (PREC01, PREC02):
    assert len(c["title"]) <= 80, (c["id"], len(c["title"]))
    assert len(c["spec_ref"]) <= 250, (c["id"], len(c["spec_ref"]))
    assert "," not in c["spec_ref"], c["id"]
calc.append(PREC01); apif.append(PREC02)
for f, lst in ((CALC, calc), (APIF, apif)):
    json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a").write("\n")

# id-map rows (blank C-id — they need add_case)
p = os.path.join(ROOT, "testrail-id-map.csv")
rows = list(csv.DictReader(open(p, encoding="utf-8")))
flds = rows[0].keys()
rows.append({"internal_id": "PV-PREC-01", "testrail_case_id": "", "title": PREC01["title"], "section": PREC01["area"]})
rows.append({"internal_id": "PV-PREC-02", "testrail_case_id": "", "title": PREC02["title"], "section": PREC02["area"]})
w = csv.DictWriter(open(p, "w", newline="", encoding="utf-8"), fieldnames=list(flds))
w.writeheader(); w.writerows(rows)
print("added PV-PREC-01 (%d chars title) + PV-PREC-02 (%d chars title); id-map rows now %d"
      % (len(PREC01["title"]), len(PREC02["title"]), len(rows)))
