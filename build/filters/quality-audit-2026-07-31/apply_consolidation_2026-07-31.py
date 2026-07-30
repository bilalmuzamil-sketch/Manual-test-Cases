#!/usr/bin/env python3
"""Apply the USER-AUTHORIZED PARTIAL subset of the 2026-07-31 Filters Ruthless
Usefulness Audit recommendations to the local case bodies.

AUTHORIZED SCOPE (user, 2026-07-31) — nothing else is touched:
  (a) The 12 FIX-WORDING repairs (USEFULNESS-AUDIT-2026-07-31.md "The FIX-WORDING
      list"). 3 are applied directly (FLT-BAR-02, FLT-ASSET-02, FLT-RPTS-21); the
      other 9 are Reports cases inside MG15 and are repaired BY the merge (the
      survivor gains renumbered expected lines + explicit switch-tab steps), exactly
      as the audit states ("approving that merge repairs them for free").
  (b) The PRESENCE-MATRIX merge groups: MG14-PARTS-CHIP-MATRIX (survivor
      FLT-PARTS-01, 8 members) + MG15-REPORTS-CHIP-MATRIX (survivor FLT-RPTS-01,
      19 members) = 29 cases, 27 members retired into 2 survivors. ALL of these are
      design-level cases with BLANK TestRail C-ids -> LOCAL-ONLY consolidation.
  (c) The single NONSENSE case FLT-SRCH-09 -> Retired (blank C-id -> local only).

EXPLICITLY HELD (NOT touched by this script):
  (d) MG1 / MG2 / MG5 / MG6 dropdown merges (19 cases) — awaiting live VIU of the
      "five dropdowns are one shared component" assumption.
  (e) FLT-SRCH-01..08 cross-project CUTs — awaiting Branko Q6 ownership ruling.
  (f) The 39 over-80-char title trims.
  (g) The optional MG16 / MG17 / MG18 under-merge findings.
  Also NOT executed: the 2 in-suite duplicate CUTs (FLT-BAR-03, FLT-COLL-03) and
  merge groups MG3/MG4/MG7/MG8/MG10/MG11/MG12/MG13 — not in this authorization.

Run from the repo root:  python3 build/filters/quality-audit-2026-07-31/apply_consolidation_2026-07-31.py
"""
import json, os, sys, shutil

HERE = os.path.dirname(os.path.abspath(__file__))            # build/filters/quality-audit-2026-07-31
FILTERS = os.path.dirname(HERE)                              # build/filters
CASES_DIR = os.path.join(FILTERS, "cases")
BACKUP = os.path.join(FILTERS, "consolidation-backup-2026-07-31")
BODIES = os.path.join(BACKUP, "pre-edit-bodies")

DATE = "2026-07-31"

# ---------------------------------------------------------------- retirements
MG14_MEMBERS = ["FLT-PARTS-02", "FLT-PARTS-03", "FLT-PARTS-04", "FLT-PARTS-05",
                "FLT-PARTS-06", "FLT-PARTS-07", "FLT-PARTS-08", "FLT-PARTS-10"]
MG15_MEMBERS = ["FLT-RPTS-%02d" % n for n in range(2, 21)]   # FLT-RPTS-02..20 (19)
REPAIRS_DIRECT = ["FLT-BAR-02", "FLT-ASSET-02", "FLT-RPTS-21"]
SURVIVORS = ["FLT-PARTS-01", "FLT-RPTS-01"]
CUT_NONSENSE = ["FLT-SRCH-09"]

TOUCHED = REPAIRS_DIRECT + SURVIVORS + MG14_MEMBERS + MG15_MEMBERS + CUT_NONSENSE


def load_all():
    files = {}
    for fn in sorted(os.listdir(CASES_DIR)):
        if fn.startswith("cases-") and fn.endswith(".json"):
            files[fn] = json.load(open(os.path.join(CASES_DIR, fn)))
    return files


def find(files, cid):
    for fn, cases in files.items():
        for c in cases:
            if c["id"] == cid:
                return fn, c
    raise KeyError(cid)


def retire(c, reason, detail):
    c["viu_status"] = "Retired — " + reason
    c["notes"] = detail + " | " + (c.get("notes") or "")


# ================================================================ main
def main():
    files = load_all()

    # ---- guard: refuse to run twice -------------------------------------
    _, parts01 = find(files, "FLT-PARTS-01")
    if str(parts01.get("viu_status", "")).startswith("Retired") or \
       parts01["title"].startswith("Every Parts list page"):
        sys.exit("ALREADY APPLIED — aborting (FLT-PARTS-01 already consolidated).")

    # ---- backups --------------------------------------------------------
    os.makedirs(BODIES, exist_ok=True)
    for cid in TOUCHED:
        _, c = find(files, cid)
        with open(os.path.join(BODIES, cid + ".json"), "w") as f:
            json.dump(c, f, indent=1, ensure_ascii=False)
            f.write("\n")
    # whole-file backups too (belt and braces)
    for fn in ("cases-A-bar-status-collapse.json", "cases-B-people-asset-filters.json",
               "cases-E-parts-filters.json", "cases-F-reports-filters.json",
               "cases-G-page-search.json"):
        shutil.copy2(os.path.join(CASES_DIR, fn), os.path.join(BACKUP, fn + ".pre-edit"))
    print("Backed up %d case bodies + 5 source files -> %s" % (len(TOUCHED), BACKUP))

    # =================================================================
    # (a) DIRECT FIX-WORDING REPAIRS
    # =================================================================
    # --- FLT-BAR-02 (C29558): pin the tab in the preconditions.
    _, bar02 = find(files, "FLT-BAR-02")
    assert bar02["preconditions"][1].startswith("2. You are on the Work Orders page")
    bar02["preconditions"] = [
        "1. You are signed in to the ShopView App on a desktop browser.",
        "2. You are on the Work Orders page with the filter bar visible.",
        "3. You are on the All tab (on the Estimates and Completed tabs the Status chip "
        "is shown greyed out and already filled in, so the chips do not all look the same there).",
    ]
    bar02["notes"] = ("WORDING REPAIR %s (Rule-28 audit FIX-WORDING, user-authorized): "
                      "added precondition 3 'You are on the All tab' — the default landing tab is "
                      "Estimates (FLT-TAB-06) where the Status chip renders greyed/pre-filled, so the "
                      "five-identical-chips expectation only reads cleanly on the All tab. | " % DATE
                      ) + (bar02.get("notes") or "")

    # --- FLT-ASSET-02 (C29590): drop expected 3 (the 'No' direction = FLT-ASSET-07).
    _, asset02 = find(files, "FLT-ASSET-02")
    assert asset02["expected"][2].startswith("3. Choosing No instead")
    asset02["expected"] = asset02["expected"][:2]
    asset02["notes"] = ("WORDING REPAIR %s (Rule-28 audit FIX-WORDING, user-authorized): removed the "
                        "old expected 3 ('Choosing No instead shows only the not-on-site work orders') "
                        "— the steps only choose Yes, and the No direction is FLT-ASSET-07's subject "
                        "(C38878). | " % DATE) + (asset02.get("notes") or "")

    # --- FLT-RPTS-21: insert the missing select-a-value step + grammar fix.
    _, rpts21 = find(files, "FLT-RPTS-21")
    assert "go to the any" in rpts21["steps"][0]
    rpts21["steps"] = [
        "1. Open the Reports area and go to any report — for example the Sales report.",
        "2. Open one of the filter buttons shown above the report table and choose one value.",
        "3. Look at the report table below.",
    ]
    rpts21["notes"] = ("WORDING REPAIR %s (Rule-28 audit FIX-WORDING, user-authorized): the steps only "
                       "looked at the buttons while expected 1 asserted filtered results — added a "
                       "choose-a-value step (mirrors FLT-PARTS-11 step 2) and fixed the grammar 'go to "
                       "the any (for example Sales) report'. | " % DATE) + (rpts21.get("notes") or "")

    # =================================================================
    # (b) MG14-PARTS-CHIP-MATRIX  — survivor FLT-PARTS-01
    # =================================================================
    _, p01 = find(files, "FLT-PARTS-01")
    p01["title"] = "Every Parts list page shows its designed filter buttons"
    p01["preconditions"] = [
        "1. You are signed in to the ShopView App on a desktop browser.",
        "2. You are on the Parts area of the app with some sample data present.",
    ]
    p01["steps"] = [
        "1. Open the Parts area and go to the Inventory page, and look at the filter buttons shown above the table.",
        "2. Go to the Part Sales page and look at the filter buttons.",
        "3. Go to the Catalog page and look at the filter buttons.",
        "4. Go to the Returns page, make sure the Returns tab is selected, and look at the filter buttons.",
        "5. Select the Credits tab on the same page and look at the filter buttons.",
        "6. Go to the Purchase Orders page and look at the filter buttons.",
        "7. Go to the Vendor Invoices page and look at the filter buttons.",
        "8. Go to the Vendors list page and look at the filter buttons.",
        "9. On any one of these pages, look at the small icons on the right-hand side of the toolbar.",
    ]
    p01["expected"] = [
        "1. Inventory shows four filter buttons: Bin Location, Category, Supply and Vendor.",
        "2. Part Sales shows four filter buttons: Status, Customer, Created by and Date.",
        "3. Catalog shows two filter buttons: Manufacturer and Category.",
        "4. The Returns tab shows three filter buttons: Vendor, Category and Part Type.",
        "5. The Credits tab shows three filter buttons: Vendor, Date and Processed by.",
        "6. Purchase Orders shows four filter buttons: Vendor, Status, Date and Ordered by.",
        "7. Vendor Invoices shows four filter buttons: Vendor, Invoice date, Date received and Received by.",
        "8. The Vendors list page shows two filter buttons: Vendor and State/Province. Note: the "
        "developers have not been given a design for the Vendors page filters yet, so this page may "
        "not have them — write down what you actually see instead of failing the whole test.",
        "9. On every page above, each filter button shows a small icon, the filter name and a down arrow.",
        "10. Every Parts list page also shows a Search (magnifier) icon and a filter (funnel) icon in "
        "the toolbar; some pages (for example Inventory) also show a column/layout toggle icon.",
        "11. Behaviour to confirm — pending Branko's product write-up; to be checked live once the "
        "feature is available. (which filters actually apply on each Parts page, their full option "
        "lists, and what the funnel and column icons do).",
    ]
    p01["design_ref"] = "design-notes.md B.5 #1-#9 + B.5 shared shell (11894:21846; 11902:8517; " \
                        "11902:9736; 11902:9852; 11903:10067; 11903:10188; 11903:10312; 11903:10461)"
    p01["spec_ref"] = "Filters (Epic key TBD); Figma 11884-16885 (Parts filters); " \
                      "design-notes.md §B.5 #1-#8 and §B.5 shared shell"
    p01["notes"] = (
        "MERGE SURVIVOR %s — MG14-PARTS-CHIP-MATRIX (Rule-28 audit, user-authorized partial "
        "execution). Absorbed FLT-PARTS-02/03/04/05/06/07/08/10 (all design-level, blank C-ids, so "
        "LOCAL-ONLY — no TestRail delete was needed). One Parts walk with a per-view checklist of the "
        "designed filter buttons instead of nine near-identical presence cases. "
        "Per the audit, the per-view TABLE COLUMN lists and 'New ...' button assertions were demoted "
        "to reference notes (they are outside the Filters scope): Inventory — Description, Part number, "
        "Tags, Category, Manufacturer, Vendor, Bin Location / Quantity, Action (+ New Inventory Part); "
        "Part Sales — Number, Status, Customer, Asset, VIN/Serial #, Created By, Total Price, Created "
        "On, Parts, Returns (+ New Part Sale); Catalog — checkbox, Description, Part Number, Tags, "
        "Category (+ New Catalog Part); Returns — Work Order, Vendor Invoice, Vendor, Part Number, "
        "Description, Quantity, Cost, Total Cost, Return Reason, Status, Requested (+ Create Return); "
        "Credits — Credit Memo Number, Vendor, Work Order, Vendor Invoice, Date, Processed By, Total "
        "Cost, Notes (+ Create Credit); Purchase Orders — Work Order, Purchase Order Number, Vendor, "
        "Order Status, Created On, Ordered By, Total Price, Note (+ New Purchase Order); Vendor "
        "Invoices — Work Order, Invoice Number, Order Number, Received By, Vendor Name, Date Received, "
        "Invoice Date, Due Date, Total Cost, Note (NO New button); Vendors — Name, Telephone, Email, "
        "Address 1, Address 2, City, State/Province, Zip/Postal Code (+ New Vendor). "
        "VENDORS CONFLICT CARRIED OVER from FLT-PARTS-08 (Questions Q6 / tech-plan deltas C7): "
        "engineering found NO Figma frame for the Parts Vendors view (they read frame 11903:10461 as "
        "Vendor Invoices, not a Vendors typo) and will NOT build Vendors filters until a design is "
        "delivered — hold that line against the requested design + PRD. Part Type menu contents stay "
        "with FLT-PARTS-09; apply/multi-select behaviour stays with FLT-PARTS-11 / FLT-PARTS-12. | "
        % DATE) + (p01.get("notes") or "")

    for cid in MG14_MEMBERS:
        _, c = find(files, cid)
        retire(c, "merged into FLT-PARTS-01 (MG14 presence-matrix consolidation, user-authorized %s)" % DATE,
               "RETIRED %s (user-authorized partial execution of the %s Ruthless Usefulness Audit, "
               "group MG14-PARTS-CHIP-MATRIX): this case's filter-button checks are folded into the "
               "FLT-PARTS-01 per-view checklist; table-column / New-button assertions demoted to "
               "reference notes there. NEVER PUSHED TO TESTRAIL (blank C-id), so no delete_case was "
               "required — LOCAL-ONLY retirement. Pre-edit body preserved in "
               "build/filters/consolidation-backup-2026-07-31/pre-edit-bodies/%s.json. EXCLUDED from "
               "active deliverables + tally; body kept for the record." % (DATE, DATE, cid))

    # =================================================================
    # (b) MG15-REPORTS-CHIP-MATRIX — survivor FLT-RPTS-01
    #     (also delivers the 9 in-group FIX-WORDING repairs:
    #      renumbered expected list + explicit switch-tab steps)
    # =================================================================
    _, r01 = find(files, "FLT-RPTS-01")
    r01["title"] = "Every report page shows its designed filter buttons"
    r01["preconditions"] = [
        "1. You are signed in to the ShopView App on a desktop browser.",
        "2. You are on the Reports area of the app with some sample data present.",
    ]
    r01["steps"] = [
        "1. Open the Reports area and go to the Timesheet Activities report, and look at the filter buttons shown above the report table.",
        "2. Go to the Timesheets (Payroll Timesheet) report and look at the filter buttons.",
        "3. Go to the Sales report and look at the filter buttons.",
        "4. Go to the Technician Efficiency report. Look at the filter buttons on the Invoiced tab, then open the Completed tab and look at them again.",
        "5. Go to the Advisor Analysis report and look at the filter buttons.",
        "6. Go to the Shop Efficiency report and look at the filter buttons.",
        "7. Go to the Work in Progress report and look at the filter buttons.",
        "8. Go to the Sales Follow Up report and look at the filter buttons.",
        "9. Go to the Sales Tax report. Look at the filter buttons on the Collected tab, then open the All Tax Rates tab and look at them again.",
        "10. Go to the A/R Aging Summary report, then the A/R Aging Detail report, then the A/R Aging Collection report, looking at the filter buttons on each.",
        "11. Go to the A/P Aging Summary report, then the A/P Aging Detail report, then the A/P Unpaid Invoices report, looking at the filter buttons on each.",
        "12. Go to the Notes report and look at the filter buttons and the toolbar icons.",
        "13. Go to the Reminders report and look at the filter buttons.",
        "14. Go to the IBS Batch Transactions report and look at the filter buttons and the view tabs.",
        "15. Go to the QB Unexported report. Look at the filter buttons on the Customers tab, then switch to the Vendors tab, then to the Journal Entries tab, looking at the filter buttons on each.",
    ]
    r01["expected"] = [
        "1. Timesheet Activities shows four filter buttons: Staff, Date, Status and Modified by.",
        "2. Payroll Timesheet shows two filter buttons: Employee and Date.",
        "3. Sales shows two filter buttons: Customer and Date.",
        "4. Technician Efficiency shows three filter buttons: Customer, Technician and Date — the same "
        "three on both of its view tabs, Invoiced and Completed. 'Technician' is spelled correctly here.",
        "5. Advisor Analysis shows three filter buttons: Customer, Date and Advisor.",
        "6. Shop Efficiency shows a single filter button: Date.",
        "7. Work in Progress shows three filter buttons: Status, Date and Customer.",
        "8. Sales Follow Up shows three filter buttons: Customer, Date and Contact.",
        "9. Sales Tax has two view tabs: on the Collected tab it shows three filter buttons — Date, "
        "Invoice Status and Customer; on the All Tax Rates tab it shows a single filter button — Invoice Status.",
        "10. A/R Aging Summary shows two filter buttons: Customer and Date.",
        "11. A/R Aging Detail shows four filter buttons: Customer, Date, Location and Transaction Type.",
        "12. A/R Aging Collection shows four filter buttons: Customer, Date, Location and Transaction Type.",
        "13. A/P Aging Summary shows two filter buttons: Vendor and Date.",
        "14. A/P Aging Detail shows four filter buttons: Vendor, Date, Location and Transaction Type.",
        "15. A/P Unpaid Invoices shows four filter buttons: Vendor, Date, Location and Transaction Type.",
        "16. Notes shows three filter buttons: Author, Date and Mention (the Mention button uses an @ "
        "icon), and its toolbar also shows a search icon, a filter icon and a sort icon.",
        "17. Reminders shows a single filter button: Date, and when nothing matches the chosen dates the "
        "report shows the message 'There are no reminders for selected date range'.",
        "18. IBS Batch Transactions shows three filter buttons: Customer, Date and Status, and has three "
        "view tabs: Ready To Send, Sent and Payments.",
        "19. QB Unexported shows three filter buttons and the first one changes with the tab: Customer, "
        "Date and Type on the Customers tab; Vendor, Date and Type on the Vendors tab; User, Date and "
        "Type on the Journal Entries tab.",
        "20. Each of the six A/R and A/P aging reports also shows a print icon in its toolbar.",
        "21. On every report above, each filter button shows its name and a down arrow.",
        "22. Behaviour to confirm — pending Branko's product write-up; to be checked live once the "
        "feature is available. (the option lists behind each filter button; and because several report "
        "bodies in the design are sample placeholders, the real report columns come from the same "
        "product write-up).",
    ]
    r01["design_ref"] = ("design-notes.md B.6 #1-#23 (11906:12519; 11984:9560; 11951:30535; "
                         "11955:30653 / 11955:31069; 11955:30786; 11955:30951; 11955:31355; 11984:9457; "
                         "11955:31458; 11955:31573; 11955:31691; 11955:31802; 11955:31901; 11955:32006; "
                         "11955:32097; 11955:32215; 11982:9225; 11982:9338; 11974:33068; 11981:8749 / "
                         "11982:8879 / 11982:8998)")
    r01["spec_ref"] = "Filters (Epic key TBD); Figma 11903-10573 (Reports filters); " \
                      "design-notes.md §B.6 #1-#23"
    r01["notes"] = (
        "MERGE SURVIVOR %s — MG15-REPORTS-CHIP-MATRIX (Rule-28 audit, user-authorized partial "
        "execution). Absorbed FLT-RPTS-02..FLT-RPTS-20 (19 cases, all design-level with blank C-ids, so "
        "LOCAL-ONLY — no TestRail delete was needed). One Reports walk with a per-report checklist of "
        "the designed filter buttons instead of twenty near-identical presence cases. "
        "This ALSO delivers 9 of the 12 audit FIX-WORDING repairs, as the audit predicted: the expected "
        "list is now numbered 1-22 with no repeated '2.' (was broken in FLT-RPTS-09/11/12/13/14/15/16) "
        "and the tab-bearing reports now carry explicit switch-tab steps (FLT-RPTS-04 Invoiced/Completed, "
        "FLT-RPTS-20 Customers/Vendors/Journal Entries, plus Sales Tax Collected/All Tax Rates). "
        "Per the audit, report TABLE COLUMN lists were demoted to reference notes: Timesheet Activities — "
        "Date, Employee, Work Order, Clock In Activity, Clock In, Clock Out, Total Hours, WO Hours, "
        "Internal Hours, Modified By, Modified Date/Time; Payroll Timesheet — Employee Name, Date, Clock "
        "In Time, Lunch, Clock Out Time, Hours; Sales — Invoice Date, Invoice, Customer, Inv. Hrs, "
        "Billing Efficiency, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Cost, Parts Margin, "
        "Profit, Subtotal; Advisor Analysis — Date, Invoice, Customer, Advisor, Days Open, Lines, Hrs "
        "Worked, Hrs Invoiced, Hrs Profit, Billing Efficiency, ELR, Parts Cost, Parts Invoiced, Parts "
        "Margin, Subtotal; Shop Efficiency — Total Clocked Hours, Total Invoiced Hours, Difference, "
        "Efficiency; Work in Progress — rows grouped by status (Pending Authorization, In Progress, Ready "
        "To Invoice) with Sales, Cost, Profit $, Profit %%; Sales Follow Up — Customer, Sales "
        "Representative, Number Of Work Orders, Total Spend, Last Visit; IBS Batch Transactions — "
        "checkbox, Date, Type, No., Customer, Total, Balance, Status. The Sales Tax and both aging "
        "families use SAMPLE PLACEHOLDER bodies in the design, so their real columns are unknown until "
        "Branko's PRD. On-screen title notes carried over: 'Payroll Timesheet' (menu says Timesheets) and "
        "'Work in Progress' (lower-case 'in'). The new filter TYPES (Location, Transaction Type, Invoice "
        "Status, Type, User, Mention) keep their own behaviour case FLT-RPTS-22; apply behaviour stays "
        "with FLT-RPTS-21 and the date-range chip with FLT-RPTS-23. | " % DATE) + (r01.get("notes") or "")

    for cid in MG15_MEMBERS:
        _, c = find(files, cid)
        retire(c, "merged into FLT-RPTS-01 (MG15 presence-matrix consolidation, user-authorized %s)" % DATE,
               "RETIRED %s (user-authorized partial execution of the %s Ruthless Usefulness Audit, "
               "group MG15-REPORTS-CHIP-MATRIX): this case's filter-button checks are folded into the "
               "FLT-RPTS-01 per-report checklist (with the switch-tab steps and the renumbered expected "
               "list that the audit's FIX-WORDING list asked for); table-column assertions demoted to "
               "reference notes there. NEVER PUSHED TO TESTRAIL (blank C-id), so no delete_case was "
               "required — LOCAL-ONLY retirement. Pre-edit body preserved in "
               "build/filters/consolidation-backup-2026-07-31/pre-edit-bodies/%s.json. EXCLUDED from "
               "active deliverables + tally; body kept for the record." % (DATE, DATE, cid))

    # =================================================================
    # (c) The single NONSENSE case -> Retired
    # =================================================================
    _, s09 = find(files, "FLT-SRCH-09")
    retire(s09, "not a test case (Rule-28 audit NONSENSE + CUT, user-authorized %s)" % DATE,
           "RETIRED %s (user-authorized partial execution of the %s Ruthless Usefulness Audit — the "
           "single NONSENSE verdict, already in the CUT list): the case asked a tester to execute a "
           "QA/PO scope agreement ('the page-search component is agreed to belong to either the Filters "
           "test suite or the Global Search test suite'), which fails audit fail-conditions F6 (not "
           "actionable) and F1 (not executable). The decision itself is unchanged and still lives where "
           "it belongs — Branko question Q6 in "
           "PO-Questions-Branko-Filters-TechPlan_2026-07-30 — and the sibling cases FLT-SRCH-01..08 are "
           "DELIBERATELY UNTOUCHED, held pending his ownership ruling. NEVER PUSHED TO TESTRAIL (blank "
           "C-id), so no delete_case was required — LOCAL-ONLY retirement. Pre-edit body preserved in "
           "build/filters/consolidation-backup-2026-07-31/pre-edit-bodies/FLT-SRCH-09.json. EXCLUDED "
           "from active deliverables + tally; body kept for the record." % (DATE, DATE))

    # ---- write back -----------------------------------------------------
    for fn, cases in files.items():
        with open(os.path.join(CASES_DIR, fn), "w") as f:
            json.dump(cases, f, indent=1, ensure_ascii=False)
            f.write("\n")

    # ---- report ---------------------------------------------------------
    allc = [c for cases in load_all().values() for c in cases]
    retired = [c for c in allc if str(c.get("viu_status", "")).startswith("Retired")]
    print("Repairs applied directly : %s" % ", ".join(REPAIRS_DIRECT))
    print("Survivors rewritten      : %s" % ", ".join(SURVIVORS))
    print("Retired (MG14)           : %d -> %s" % (len(MG14_MEMBERS), ", ".join(MG14_MEMBERS)))
    print("Retired (MG15)           : %d -> %s" % (len(MG15_MEMBERS), ", ".join(MG15_MEMBERS)))
    print("Retired (NONSENSE cut)   : %s" % ", ".join(CUT_NONSENSE))
    print("TOTAL authored           : %d" % len(allc))
    print("TOTAL retired            : %d" % len(retired))
    print("TOTAL active             : %d" % (len(allc) - len(retired)))
    for cid in SURVIVORS + REPAIRS_DIRECT:
        _, c = find(load_all(), cid)
        print("  title len %-14s %3d  %s" % (cid, len(c["title"]), c["title"]))


if __name__ == "__main__":
    main()
