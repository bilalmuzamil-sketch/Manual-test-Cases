"""Batch B verdicts (Tiered Pricing phase 2, 14 Nov 2026): stories 10, 11, 13, 17, 18, the Sales by Tier and Sales by Category PRD (RPT rows,
covered by RPT, INV and page-20 DESIGN cases), design pages 10, 11, 13 and 20, tech-plan rows TPX-01, 04-06, 08-10, 23-40.
Merged by verdicts.py. RPT rows and the TPX rows tied only to RPT rows are not gated by build.py's in-scope check (story numbers 1-5 of the
reports PRD would clash with the Tiered Pricing stories), so check_batch_b_coverage() below proves them; BATCH-B-REPORT.md lists each row."""
FORCED = ("a manual tester cannot make the server fail on purpose; listed for the developers' and the automation owner's checks "
          "(Rule 114, lesson L-14)")

IN_SCOPE_STORIES = {10, 11, 13, 17, 18, 20}

NOT_TESTABLE = {
 "TP-S10-EH1": "States that pricing has no error handling of its own (\"Not applicable: pricing runs when a part is saved on a line\"); nothing to look at.",
 "TP-S11-EH1": "States that repricing has no error handling of its own (\"Not applicable\"); nothing to look at.",
 "TP-S13-EH1": "States \"Not applicable beyond Part Sales' own errors, as today\"; nothing new to look at.",
 "TP-S17-N1": "States there is no negative case (\"None. Totals only read saved prices, so there is nothing to refuse.\").",
 "TP-S17-EH1": "States \"Not applicable: totals and reports behave as today\"; nothing new to look at.",
 "TP-S18-R4": "The Open API is checked with API calls, not in the product screens (Rule 114): listed for the automation owner (INV-84).",
 "TP-S18-N2": ("What internal and no-charge work orders send is set by the Internal Work Orders PRD (skill 07 §6.0 f: another owner); this suite holds no "
               "expected result for it. The tier half (\"tiers add nothing to what is sent\") is the no-new-fields check of the QuickBooks case."),
 "TP-S18-EH1": "Sync failures: " + FORCED + ".",
 "RPT-S1-EH1": "Report load failure: " + FORCED + ".",
 "RPT-S2-EH1": "A row's customers or invoices failing to load: " + FORCED + ".",
 "RPT-S3-EH1": "States \"Not applicable beyond the report's own load error\"; nothing to look at.",
 "RPT-S4-EH1": "Download failure: " + FORCED + ".",
 "RPT-S5-EH1": "Sales by Category load failure: " + FORCED + ".",
 "RPT-S2-E1": ("A customer can't be deleted while they have work orders or Part Sales (Tiered Pricing S9-E3), so a tester can't make a customer with "
               "invoices deleted; listed for the developers (invoice snapshot of the customer's name)."),
 "RPT-S4-N1": ("Refusing a download over its limit, with no file: the PDF half needs more than 2,000 rows and the CSV half more than 50,000; the PDF "
               "refusal is checked where staging has a location with that many rows (RPT-64 cites S4-R5 for the message), the CSV half needs "
               "50,001 rows, which a tester cannot make; listed for the automation owner."),
 "TPX-35": "Loading the next 30 rows failing: " + FORCED + ".",
 "TPX-38": ("Held by engineering (tech plan 2 Phase 2 has not reported whether imported invoices with no part lines exist); nothing a tester can set up; "
            "listed in the open points."),
 "TPX-39": "A process step (the RPT-S1-R7 list of invoices that don't add up, tech plan 2 Appendix C, empty on 14 Nov 2026): no screen to test.",
}

HELD = {
 "TPX-01": "Q1",
}

PARTIAL = {
 "TP-S10-R14": "Everything but a reopened paid work order is checked (S10-34 to S10-38); which tier prices parts added after reopening is held on Q1 (S10-39).",
 "TP-S11-R7": ("Quick Add, the inline row, catalog search, the part request modal, Tech View, the phone part request, canned lines (tier and Default "
               "work orders, no-cost parts, labor) and inspections are checked; ShopCoach and canned lines added by Maintenance Reminders are not "
               "checked by hand: neither the PRD, the design nor the tech plan says how a tester makes them add a part; listed for the developers. "
               "Imported invoices and the Open API create no part lines (nothing to check by hand)."),
 "TP-S18-R6": "Checked where AccountingHub is connected (staging, else the production test account after release, read only).",
 "TP-S10-R22": "The fill is observed; the 0.3-second target at the largest client's size is an engineering measurement (S10-33 marked HOLD for that part).",
 "RPT-S1-R7": "The tie-out to Sales by Customer is checked; \"engineering lists ... the owning PM signs off each\" is a process step (TPX-39).",
 "RPT-S4-R5": "The PDF limit and its message are checked on a staging location with more than 2,000 rows; the CSV limit (50,000 rows) can't be reached by hand.",
 "RPT-S4-R7": "The header lines' content and wording are checked (RPT-66); their ORDER (Category before Priced By) is held on Q4 (RPT-67, D-443).",
 "TPX-31": "The all-wording is checked (RPT-66); the line order is held on Q4.",
 "TPX-36": "\"A failed load never says there are no results\" needs a forced failure (" + FORCED + "); the empty state after a normal load is checked (RPT-17).",
 "TPX-33": "The voided-then-reissued half is checked (RPT-30); a credit on a part line of a reversed invoice is checked where a credit can name a line of a reversed invoice.",
}

UNUSED_BOARDS = {
 "10.1": "A \"Today\" board (production before the release); its screenshot is attached as today:10.1, not the empty board render.",
 "10.2": "A \"Today\" board; its screenshot is attached as today:10.2.",
 "10.3": "A \"Today\" board; its screenshot is attached as today:10.3.",
 "13.1": "A \"Today\" board; its screenshot is attached as today:13.1.",
 "20.1": "A \"Today\" board; its screenshot is attached as today:20.1.",
 "10.4": ("The prototype's entry list (\"Open one to try its pricing, or start a new one for any customer.\") with a Work Order Tier column; the PRD's "
          "Out of Scope keeps the work order's tier off the work order in this release (register TPD-B410): no case expects that column."),
 "13.2": ("The prototype's entry list for Part Sales with a Part Sales Tier column; the PRD's Out of Scope keeps the tier off the work order and Part "
          "Sale (register TPD-B410): no case expects that column."),
}

STRESS = {}
MOVEMENT = {}
NUMBERS = {}

# Invariant rows of INVARIANTS.md §A, §E, §F (not requirement rows; listed for the report, checked by check_batch_b_coverage).
INV_VERDICTS = {}
