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
 "TPX-36": ("Both halves are timing or failure states: \"no empty state shows before the first load finishes\" is a moment too short to judge by eye, and \"a failed load never says there are no results\" needs a forced failure (" + FORCED + "); the empty state after a normal load is checked (RPT-17)."),
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

STRESS = {
 "tier names on Sales by Tier rows and in the Priced By filter": "D-460",
 "customer names in opened rows and in the Customer filter": "D-461",
 "category names on Sales by Category and in the Category filter": "D-462",
 "names in the PDF and CSV downloads (and the CSV-injection guard)": "D-463",
 "tier names in the Part Sale Priced By column and its price details": "D-464",
 "tier names in the work order toasts (Part added)": "D-465",
}
MOVEMENT = {
 "Sales by Tier columns when a row and a customer open (20.2 vs 20.3, 20.4; held on Q42)": "D-450",
 "Sales by Tier headings on the empty states (20.2 vs 20.11, 20.21-20.23; held on Q42)": "D-451",
 "Sales by Category columns when a category opens (20.16 vs 20.17; held on Q42)": "D-452",
 "work order lines table while Quick Add is open (10.5 vs 10.6, 10.7, 10.9; held on Q42)": "D-453",
 "report filter chips when a chip widens (20.2 vs 20.9; held on Q42)": "D-454",
 "Sales by Tier sort keeps columns (20.12 vs 20.13)": "D-455",
 "Totals row and columns as more rows load (S1-R7, S1-R12)": "D-456",
}
NUMBERS = {
 "N1 % Off per range on a line": "S10-01", "N1 Markup % from cost": "S10-03", "N1 Margin % rounding": "S10-04", "N1 + $ per unit": "S10-05",
 "N1 $ Off": "S10-06", "N1 $ Off floor at $0.00": "S10-07", "N1 chain through two tiers": "S10-08", "N1 chain skips an archived tier": "S10-09",
 "N1 chain ends at Default": "S10-10", "N1 no borrowing from the General Matrix": "S10-12", "N1 range boundaries both sides and the open last range": "S10-13",
 "N1 half-cent tie and simulator parity": "S10-14", "N1 % Off rounds Default first ($10.005)": "S10-15", "N1 Part Sale side": "S10-18",
 "N2 line total = unit × quantity": "S10-05", "N2 quantity change keeps unit price": "S11-12", "N3 negative margin below cost": "S10-28",
 "N4 tier line received at a new cost (recorded tier)": "S11-26", "N4 recorded tier, not the current one": "S11-27", "N4 Default keeps margin": "S11-28",
 "N4 Manual keeps margin ($2 → $3 on $4 = $6)": "S11-29", "N5 fixed line total parts amount": "S10-23", "N5 leftover cent on a quantity-1 part": "INV-23",
 "N6 % Off details show the Default price": "D-413", "N10 Stats, invoice and tax from saved prices": "S17-01", "N10 customer discount after tier price": "S17-06",
 "R1 Parts Invoiced per row from seeded invoices": "RPT-03", "R1 tie to Sales by Customer to the cent": "RPT-07", "R1 single-part discount": "RPT-25",
 "R1 void never counts, open counts once invoiced": "RPT-02", "R1 date boundary both sides (invoice created date)": "RPT-37",
 "R1 fixed line total amount and one cent less": "RPT-21", "R1 fixed line total no quantity-1 part": "RPT-22",
 "R2 Parts Cost and margin parity": "RPT-07", "R3 credits after restocking fee, before tax": "RPT-27", "R3 goodwill and void credits excluded": "RPT-28",
 "R3 reissued invoice credit": "RPT-30", "R4 Parts Net": "RPT-06", "R5 $0.00 margin and negatives on screen and in downloads": "RPT-14",
 "R6 Margin % pooled, not averaged": "RPT-06", "R6 and R7 zero and negative denominators show a dash": "RPT-15", "R7 % of Total at every level": "RPT-32",
 "R8 Sales by Category Totals = Sales by Tier Totals": "RPT-65", "R9 levels add up": "RPT-32", "R9 customer under two tiers, no double count": "RPT-33",
 "R10 fixed line total split by cost": "RPT-72", "R10 split by quantity when parts cost $0": "RPT-73", "R11 Same as previous tier in the customer's tier row": "RPT-26",
 "R12 Sales Type filter effect": "RPT-42", "R12 Location filter effect and Multiple": "RPT-43", "R13 downloads equal the screen": "RPT-59",
 "R14 number sort cycle": "RPT-52", "R14 Parts Credits largest credit first": "RPT-53",
}

# Invariant rows of INVARIANTS.md §A, §E, §F (not requirement rows; listed for the report, checked by check_batch_b_coverage).
INV_VERDICTS = {
 **{f"INV-{n:02d}": f"regression case INV-{n:02d} (folder Must not change)" for n in
    (1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 29, 34, 35, 36, 37, 38, 40, 41, 42, 43,
     80, 81, 82, 83, 85, 86, 87, 88, 89, 90, 91, 92, 93)},
 "INV-04": "superseded (CHANGED: half-cent ties round up) — new-behaviour case S10-14; every non-tie price unchanged is covered with INV-03",
 "INV-19": "superseded (REPLACED: a rule-less category matrix gets a copy of the General Matrix on release day) — Story 1 release-day cases (phase 1)",
 "INV-24": "superseded (CHANGED: a fixed line total of $0 parts splits by quantity) — new-behaviour case RPT-73 (split by quantity)",
 "INV-30": "superseded (CHANGED: clearing a sell price restores the calculated price) — new-behaviour case S11-13",
 "INV-31": "superseded (CHANGED: a typed catalog part number is priced by its own category) — new-behaviour case S10-19",
 "INV-32": "superseded (CHANGED: a cost edited to $0.00 sells at $0.00) — new-behaviour case S10-25",
 "INV-33": "superseded (CHANGED: retyping the same cost reprices) — new-behaviour cases S11-07, S11-08",
 "INV-39": ("not testable by hand: a Maintenance Reminder canned line added at another location (appendCopy) is known only from engineering's code "
            "read in the tech plan; neither the PRD nor the design says how a tester makes it happen; listed for the developers"),
 "INV-84": "not testable by hand: the Open API is checked with API calls (Rule 114); listed for the automation owner",
 "INV-82 (failure half)": "sync failures read as today: a forced failure (Rule 114, L-14); the no-integration half is INV-82",
}
