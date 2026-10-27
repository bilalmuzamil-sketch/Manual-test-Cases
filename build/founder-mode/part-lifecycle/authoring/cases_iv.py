"""SV-10380 — Inventory Value net quantity (bin quantities below zero), ships with this epic. Section 54274.
Phase C, 27 Oct 2026: every live case rewritten top to bottom in the QA lead's pattern, against bug SV-10380 as read on 27 Oct 2026
(description, reproduction table, acceptance criteria and its 6 comments) and PRD v33 §2 Accounting (ACC-4: the count of bins below zero
ships with this release and applies from release on). Rule 116 in full: every figure is computed from known inputs with the arithmetic
shown, row and Totals reconcile, the export matches the screen (CSV and PDF, IV-08 / IV-08b), filters scope the figures (IV-09), and the
footer Margin % is the pooled ratio, total margin ÷ total sell, never an average of rows (Chris Ward's answer of 23 Oct 2026 on the
SV-10380 comment "Footer Margin % when some rows are negative": IV-12 above 100%, IV-13 below 0; a single negative row shows the dash).
Report labels (Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost, Totals, Location filter, three-dot menu with
Download (CSV) / Download (PDF)) are the report's own, observed by the Report Suite build verification of 18 Aug 2026.
A bin goes below zero the way the QA lead described on 9 Oct 2026 (situation 1): take the part to a work order line from a bin that holds 0.

SV-11756 (duplicate-part merge tool and past Inventory Value) gets NO MANUAL CASE: the merge tool is a console command an operator runs
(app:inventory:delete-duplicate-part); no screen runs it, and Chris Ward ruled on 26 Oct 2026 that Parts Lifecycle ships without the fix and
the tool must not be run where the two copies have different tracking. Recorded in ../full-pass-2026-10-27/PHASE-C-REQUESTS.json (ledger row)."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from pc_common import *

WRITTEN = True
SECTION = "IV"
S0 = [0]                                   # no PRD story: the From line names bug SV-10380 (pc_common.py)
J = "SV-10380, description, "
AC_MIX = ("JIRA", J + "Acceptance criteria", "At $10 unit cost, +5 and -2 bins produce quantity 3 and cost value $30.")
AC_NEG = ("JIRA", J + "Acceptance criteria", "A -2-only part appears with quantity -2 and cost value -$20 and reduces report totals accordingly.")
AC_ZERO = ("JIRA", J + "Acceptance criteria", "+5 and -5 bins contribute zero value, not $50.")
AC_POS = ("JIRA", J + "Acceptance criteria", "All-positive quantities retain existing results.")
AC_FRAC = ("JIRA", J + "Acceptance criteria", "Fractional quantities retain supported precision and existing monetary rounding rules.")
AC_SAME = ("JIRA", J + "Acceptance criteria", "Report rows, aggregate totals, exports and newly captured snapshots use the same net quantity basis for the same scope and cutoff. Quantity-dependent displayed values use that same basis.")
AC_HIST = ("JIRA", J + "Acceptance criteria", "Existing historical snapshots captured with positive-only quantities are explicitly addressed; changing the live calculation must not be described as repairing old captured values automatically.")
AC_SCOPE = ("JIRA", J + "Acceptance criteria", "Existing location access, organization isolation and report filters remain enforced.")
AC_PICK = ("JIRA", J + "Acceptance criteria", "The parts list's available-to-pick quantity and supply filters retain their existing behavior.")
AC_PAST = ("JIRA", J + "Acceptance criteria", "Inventory Value figures saved for dates before release keep their saved values. Only dates from release on count bins below zero.")
EXP_NET = ("JIRA", J + "Expected behavior", "Use the net sum of all bin quantities, including negatives, for Inventory Value report quantities and valuation. Include negative-quantity parts with their signed values. A net-zero part contributes zero; this bug does not mandate displaying a zero-quantity row.")
EXP_PICK = ("JIRA", J + "Expected behavior", "Keep the shop-floor availability calculation unchanged.")
SUPPLY_CODE = ("JIRA", J + "Code evidence", "positive-only availability is also used for operational supply filtering; preserve that behavior.")
TABLE_MIX = ("JIRA", J + "Reproduction table", "+5 and -2 | 5 / $50 | 3 / $30")
TABLE_POS = ("JIRA", J + "Reproduction table", "+5 and +3 | 8 / $80 | 8 / $80")
MARGIN_EX = ("JIRA", "SV-10380, comment, Nemanja Djuric, 23 Oct 2026",
             "Inventory Value now uses the net of all bins, so a part below zero shows a negative quantity, cost and sell value. On a single row that's fine: a negative row's Margin % shows \"—\", as it does today. The footer, however, is total margin ÷ total sell, and with mixed signs it can go above 100%.")
MARGIN_A = ("JIRA", "SV-10380, comment, Chris Ward, 23 Oct 2026",
            "The footer Margin % stays the true aggregate (total margin divided by total sell), even when that goes above 100% or below 0. A single negative row keeps showing the dash, as today.")
MARGIN_NUMS = ("JIRA", "SV-10380, comment, Nemanja Djuric, 23 Oct 2026", "one part at +1 (cost $10, sell $100) and one at −1 (cost $50, sell $60);")
LOC = "Pick the test location only in the Location filter."
SEARCH_A = "Type part A's part number in the report's Search box."
SEARCH_SH = "Type the shared start of the part numbers in the report's Search box."
SHOWS_LOC = "The report shows the test location only."
NEG_B = "so bin location B goes to -2"
IVNOTE = "no board draws the Inventory Value report; the expected results above come from the quotes above."
DES = dict(note=IVNOTE)

C("IV-01", "IV", "Bins of +5 and -2 show quantity 3 and $30 in Inventory Value",
  [ADMIN, "Create a tracked part, part A, for this test at a cost of $10.00 and a Sell Price of $20.00, with 5 in bin location A and 0 in bin location B, so the report has two bins to add up.",
   "Add 2 of part A to a work order line from bin location B while it holds 0, " + NEG_B + " and part A's net is 3 (5 + (-2)).", START_IV],
  [LOC, SEARCH_A],
  [[SHOWS_LOC],
   ["One row is listed for part A: Qty 3.00, Unit Cost $10.00 and Total Cost $30.00 (5 + (-2) = 3; 3 × $10.00 = $30.00).",
    "Its Unit Sell is $20.00, Total Sell $60.00 (3 × $20.00) and Margin $30.00 ($60.00 − $30.00): every figure uses the net 3.",
    "It does not show Qty 5.00 or Total Cost $50.00, the positive bin alone.",
    "The Totals row reads Qty 3.00 and Total Cost $30.00."]],
  ["ACC-4", AC_MIX, TABLE_MIX, EXP_NET, AC_SAME, QA1], stories=S0, design=DES)

C("IV-02", "IV", "A part with only a -2 bin shows -2 and -$20 and lowers the totals",
  [ADMIN, "Create two tracked parts for this test at a cost of $10.00 and a Sell Price of $20.00: part A with 0 in its only bin and part B with 4 in its only bin.",
   "Add 2 of part A to a work order line while its bin holds 0, so part A's bin goes to -2.", SHARED("parts A and B"), START_IV],
  [LOC, SEARCH_SH],
  [[SHOWS_LOC],
   ["Part A is listed, not left out: Qty -2.00, Unit Cost $10.00 and Total Cost -$20.00 (-2 × $10.00).",
    "Part A's row has Total Sell -$40.00 (-2 × $20.00) and Margin -$20.00, and its Margin % shows the dash \"—\" because the row is negative.",
    "Part B is listed with Qty 4.00 and Total Cost $40.00.",
    "The Totals row reads Qty 2.00 and Total Cost $20.00 (4 + (-2) = 2; $40.00 + (-$20.00) = $20.00), not 4.00 and $40.00, which would mean part A was left out."]],
  ["ACC-4", AC_NEG, EXP_NET, MARGIN_A, QA1], stories=S0, design=DES)

C("IV-03", "IV", "Bins of +5 and -5 add nothing to the Inventory Value totals",
  [ADMIN, "Create two tracked parts for this test at a cost of $10.00: part A with 5 in bin location A and 0 in bin location B, and part B with 4 in its bin, so part A has two bins to add up.",
   "Add 5 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -5 and part A's net is 0.",
   SHARED("parts A and B"), START_IV],
  [LOC, SEARCH_SH],
  [[SHOWS_LOC],
   ["Part B is listed with Qty 4.00 and Total Cost $40.00.",
    "Part A is either not listed or listed with Qty 0.00 and Total Cost $0.00; it never shows Qty 5.00 or Total Cost $50.00.",
    "The Totals row reads Qty 4.00 and Total Cost $40.00: 5 + (-5) = 0, so part A adds $0.00, and $40.00 + $0.00 = $40.00, not $90.00."]],
  ["ACC-4", AC_ZERO, EXP_NET], stories=S0, design=DES)

C("IV-04", "IV", "Bins of +5 and +3 still show quantity 8 and $80 in Inventory Value",
  [ADMIN, "Create a tracked part, part A, for this test at a cost of $10.00, with 5 in bin location A and 3 in bin location B, so the report has two bins to add up.", START_IV],
  [LOC, SEARCH_A],
  [[SHOWS_LOC],
   ["Part A is listed with Qty 8.00, Unit Cost $10.00 and Total Cost $80.00 (5 + 3 = 8; 8 × $10.00 = $80.00), the result the report gave before this fix.",
    "The Totals row reads Qty 8.00 and Total Cost $80.00."]],
  ["ACC-4", AC_POS, TABLE_POS], stories=S0, design=DES)

C("IV-05", "IV", "The Inventory list's available quantity still leaves out a negative bin",
  [ADMIN, "Create a tracked part, part A, for this test at a cost of $10.00, with 5 in bin location A and 0 in bin location B, so the report has two bins to add up.",
   "Add 2 of part A to a work order line from bin location B while it holds 0, " + NEG_B + ".", START],
  [TYPE_A, "Click Reports in the top bar.", "Click Inventory Value.", LOC, SEARCH_A],
  [["Part A's Total Qty reads \"5 Available\", the positive bin only: the -2 in bin location B is not taken off what can be picked."],
   ["The Reports page opens."], ["The Inventory Value report opens."], [SHOWS_LOC],
   ["The Inventory Value report, by contrast, shows Qty 3.00 for part A (5 + (-2)): only the report moved to the net figure."]],
  ["ACC-4", EXP_PICK, AC_PICK, ("JIRA", J + "Summary", "The Inventory Value report uses positive-bin availability rather than net recorded stock to calculate inventory value.")],
  stories=S0, design=DES,
  claude=["Question Q7 (still open) asks Product to confirm \"5 Available\" (unchanged availability) for bins +5 and -2; the ticket's own words say the shop-floor availability is unchanged and positive-only."])

C("IV-06", "IV", "The Supply filter still uses the positive bins for a part with a negative bin",
  [ADMIN, "Create a tracked part, part A, for this test with Min 4 and Max 10, 5 in bin location A and 0 in bin location B, so it has a positive and a second bin.",
   "Add 2 of part A to a work order line from bin location B while it holds 0, " + NEG_B + ": on its positive bin (5) part A sits between Min and Max, on the net (3) it would be below Min.",
   START_A],
  ["Pick Under-supplied in the Supply filter.", "Pick Well-supplied in the Supply filter."],
  [["Part A is not listed under Under-supplied: the net 3 is not used by the Supply filter."],
   ["Part A is listed under Well-supplied, because its positive bin (5) lies between Min 4 and Max 10."]],
  ["ACC-4", AC_PICK, SUPPLY_CODE], stories=S0, design=DES)

C("IV-07", "IV", "Fractional bins of +2.5 and -1.25 show quantity 1.25 and $12.50",
  [ADMIN, "Create a tracked part, part A, for this test whose quantities allow fractions, at a cost of $10.00, with 2.5 in bin location A and 0 in bin location B, so the report has two bins to add up.",
   "Add 1.25 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -1.25 and part A's net is 1.25.", START_IV],
  [LOC, SEARCH_A],
  [[SHOWS_LOC],
   ["Part A shows Qty 1.25, Unit Cost $10.00 and Total Cost $12.50 (2.5 + (-1.25) = 1.25; 1.25 × $10.00 = $12.50).",
    "The Totals row reads Qty 1.25 and Total Cost $12.50."]],
  ["ACC-4", AC_FRAC, EXP_NET], stories=S0, design=DES)

C("IV-08", "IV", "The Inventory Value CSV download shows the same net figures as the screen",
  [ADMIN, "Create two tracked parts for this test at a cost of $10.00: part A with 5 in bin location A and 0 in bin location B, and part B with 0 in its only bin, so part A has two bins to add up.",
   "Add 2 of part A to a work order line from bin location B while it holds 0, and 2 of part B while its bin holds 0, so part A's net is 3 and part B's is -2.",
   SHARED("parts A and B"), FILEAPP, START_IV],
  [LOC, SEARCH_SH, "Click the three-dot menu of the report.", "Click Download (CSV).", "Open the downloaded file in a spreadsheet program."],
  [[SHOWS_LOC],
   ["Part A shows Qty 3.00 and Total Cost $30.00; part B shows Qty -2.00 and Total Cost -$20.00.",
    "The Totals row reads Qty 1.00 and Total Cost $10.00 (3 + (-2) = 1; $30.00 + (-$20.00) = $10.00)."],
   ["The menu offers Download (PDF) and Download (CSV)."], ["A CSV file downloads."],
   ["The file's row for part A holds quantity 3 and total cost 30.00, and its row for part B quantity -2 and total cost -20.00: the same net figures as the screen."]],
  ["ACC-4", AC_SAME, EXP_NET], stories=S0, design=DES)

C("IV-08b", "IV", "The Inventory Value PDF download shows the same net figures as the screen",
  [ADMIN, "Create two tracked parts for this test at a cost of $10.00: part A with 5 in bin location A and 0 in bin location B, and part B with 0 in its only bin, so part A has two bins to add up.",
   "Add 2 of part A to a work order line from bin location B while it holds 0, and 2 of part B while its bin holds 0, so part A's net is 3 and part B's is -2.",
   SHARED("parts A and B"), "Use a computer that can open a PDF file.", START_IV],
  [LOC, SEARCH_SH, "Click the three-dot menu of the report.", "Click Download (PDF).", "Open the downloaded PDF file."],
  [[SHOWS_LOC],
   ["Part A shows Qty 3.00 and Total Cost $30.00; part B shows Qty -2.00 and Total Cost -$20.00."],
   ["The menu offers Download (PDF) and Download (CSV)."], ["A PDF file downloads."],
   ["The PDF's row for part A shows quantity 3 and total cost $30.00, and its row for part B quantity -2 and total cost -$20.00: the same net figures as the screen."]],
  ["ACC-4", AC_SAME], stories=S0, design=DES, part_of="IV-08")

C("IV-09", "IV", "Inventory Value location and category filters still scope the net figures",
  [ADMIN_TWO, "Create a category for this test, category A, used by no other part.",
   "Create a tracked part, part A, for this test at the test location in category A, at a cost of $10.00, with 0 in its only bin.",
   "Create a tracked part, part B, for this test at location B in another category, at a cost of $10.00, with 5 in bin location A and 0 in bin location B, so the report has two bins to add up.",
   "Add 2 of part A to a work order line at the test location while its bin holds 0, and 2 of part B to a work order line at location B from bin location B while it holds 0, so part A's net is -2 and part B's is 3.",
   SHARED("parts A and B"), START_IV],
  [LOC, SEARCH_SH, "Pick location B only in the Location filter.", "Pick both the test location and location B in the Location filter.",
   "Pick category A only in the Category filter."],
  [[SHOWS_LOC],
   ["Only part A is listed: Qty -2.00 and Total Cost -$20.00, and the Totals row reads -2.00 and -$20.00. Part B, at location B, is left out."],
   ["Only part B is listed: Qty 3.00 (5 + (-2)) and Total Cost $30.00, and the Totals row reads 3.00 and $30.00."],
   ["Both rows are listed, and the Totals row reads Qty 1.00 and Total Cost $10.00 (-2 + 3 = 1; -$20.00 + $30.00 = $10.00)."],
   ["Only part A, the only part in category A, is listed, and the Totals row reads -2.00 and -$20.00."]],
  ["ACC-4", AC_SCOPE, EXP_NET], stories=S0, design=DES)

C("IV-10", "IV", "Inventory Value for a day after release counts a bin below zero",
  [ADMIN, "Create a tracked part, part A, for this test on an earlier day after this release, date A, at a cost of $10.00, with 0 in its only bin.",
   "Add 2 of part A to a work order line on date A while its bin holds 0, so part A ended date A at -2 and the report saved that figure for date A.", START_IV],
  [LOC, "Set the as-of date to date A.", SEARCH_A],
  [[SHOWS_LOC], ["The report shows date A."],
   ["Part A is listed for date A with Qty -2.00, Unit Cost $10.00 and Total Cost -$20.00 (-2 × $10.00), and the Totals row reads Qty -2.00 and Total Cost -$20.00.",
    "The row is not left out and does not read 0.00 or $0.00: the figures saved for a date from release on count the bin below zero."]],
  ["ACC-4", AC_PAST, AC_NEG], stories=S0, design=DES)

C("IV-11", "IV", "Inventory Value for a date before release keeps its saved figures",
  [ADMIN, "Use a tracked part from before this release, part A, at the test location, that has held 5 in bin location A and -2 in bin location B at a cost of $10.00 since before date A, with no change since, so the net of its bins is 3.",
   "Use date A, a date before this release that the Inventory Value report has saved figures for.", START_IV],
  [LOC, "Set the as-of date to date A.", SEARCH_A, "Set the as-of date to today."],
  [[SHOWS_LOC], ["The report shows date A."],
   ["For date A, part A shows the figures saved before the release: Qty 5.00 and Total Cost $50.00 (5 × $10.00), the positive bin location A only, as the report counted them then.",
    "The release did not rework that date to the net figure."],
   ["For today, part A shows Qty 3.00 and Total Cost $30.00 (5 + (-2) = 3; 3 × $10.00): dates from release on count the bin below zero."]],
  ["ACC-4", AC_PAST, AC_HIST, TABLE_MIX], stories=S0, design=DES)

C("IV-12", "IV", "The Totals row's Margin % stays the true total and can go above 100%",
  [ADMIN, "Create two tracked parts for this test: part A at a cost of $10.00 and a Sell Price of $100.00 with 1 in its bin, and part B at a cost of $50.00 "
   "and a Sell Price of $60.00 with 0 in its bin.",
   "Add 1 of part B to a work order line while its bin holds 0, so part B's bin goes to -1.", SHARED("parts A and B"), START_IV],
  [LOC, SEARCH_SH],
  [[SHOWS_LOC],
   ["Part A's row reads Qty 1.00, Unit Cost $10.00, Unit Sell $100.00, Total Cost $10.00, Total Sell $100.00, Margin $90.00 and Margin % 90.0% ($90.00 ÷ $100.00).",
    "Part B's row reads Qty -1.00, Unit Cost $50.00, Unit Sell $60.00, Total Cost -$50.00, Total Sell -$60.00 and Margin -$10.00 (-$60.00 − (-$50.00)), "
    "and its Margin % shows the dash \"—\" because the row is negative.",
    "The Totals row reads Qty 0.00 (1 + (-1)), Total Cost -$40.00 ($10.00 + (-$50.00)), Total Sell $40.00 ($100.00 + (-$60.00)) and Margin $80.00 ($90.00 + (-$10.00)).",
    "The Totals row's Margin % reads 200.0% ($80.00 ÷ $40.00 × 100): it is not capped at 100%, not a dash, and not part A's 90.0%."]],
  ["ACC-4", MARGIN_A, MARGIN_EX, MARGIN_NUMS, EXP_NET], stories=S0, design=DES)

C("IV-13", "IV", "The Totals row's Margin % stays the true total and can go below zero",
  [ADMIN, "Create two tracked parts for this test: part A at a cost of $10.00 and a Sell Price of $20.00 with 3 in its bin, and part B at a cost of $5.00 "
   "and a Sell Price of $40.00 with 0 in its bin.",
   "Add 1 of part B to a work order line while its bin holds 0, so part B's bin goes to -1.", SHARED("parts A and B"), START_IV],
  [LOC, SEARCH_SH],
  [[SHOWS_LOC],
   ["Part A's row reads Qty 3.00, Total Cost $30.00, Total Sell $60.00, Margin $30.00 and Margin % 50.0% ($30.00 ÷ $60.00).",
    "Part B's row reads Qty -1.00, Total Cost -$5.00, Total Sell -$40.00 and Margin -$35.00 (-$40.00 − (-$5.00)), and its Margin % shows the dash \"—\".",
    "The Totals row reads Qty 2.00 (3 + (-1)), Total Cost $25.00 ($30.00 + (-$5.00)), Total Sell $20.00 ($60.00 + (-$40.00)) and Margin -$5.00 ($30.00 + (-$35.00)).",
    "The Totals row's Margin % reads -25.0% (-$5.00 ÷ $20.00 × 100): a value below zero, not a dash and not part A's 50.0%."]],
  ["ACC-4", MARGIN_A, MARGIN_EX, EXP_NET], stories=S0, design=DES)
