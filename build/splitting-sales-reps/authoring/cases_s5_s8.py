from ssr_lib import C, prd_line, AQ
from common import *

SBR = START("Reports > Sales By Representative is open in a desktop browser at least 1024 px wide")
LOC0 = ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None)

# ---------------- Story 5: credit on the invoice and in Sales By Representative ----------------
# 22 Oct 2026, Rule 136 pass: the invoice rows of the report show only once a representative is expanded, so every case that reads an
# invoice row now expands that representative (one step each). Where invoicing is only the setup (its own result was "the invoice is
# created"), the work order is invoiced in the preconditions and the case starts on the report; where the invoice's own total is
# checked (S5-03, S5-04, S5-16, S5-20) invoicing stays step 1. Steps that only read a row are folded into the step that shows it.
# 22 Oct 2026, tech plan pass (Rule 134): rewritten top to bottom; new step 6 from the tech plan (Phase 9: the representative's row and
# the Totals row have no single Sales Type, so their merged cells span the Sales Type column) — moved to S5-01b by the Rule 136 split.
SPLIT_INV = 'it has one labor line of 2.00 hours at $100.00 an hour (Tech Time 2.00) and one part sold at $50.00; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}; it was invoiced today'
C("S5-01", "S5", "A split invoice gives the Labor rep a Labor row and the Parts rep a Parts row",
  [ADMIN, REPS2, CUST, LOC0, WO(SPLIT_INV), SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-A}", "{Work-order-1}'s invoice shows one row under {Sales-rep-A}: Sales Type \"Labor\"; Labor Invoiced $200.00, Hrs Invoiced 2.00, labor columns filled; Parts Invoiced and Parts Margin show a dash, not $0.00. {Sales-rep-A}'s summary row shows real sums (no dashes), $200.00 of labor, and counts the invoice once."),
      EXPAND("{Sales-rep-B}", "{Work-order-1}'s invoice shows one row under {Sales-rep-B}: Sales Type \"Parts\"; Parts Invoiced $50.00; Labor Invoiced, Labor Margin, Hrs Worked, Hrs Invoiced, Labor Delta and Shop Supplies show a dash. {Sales-rep-B}'s summary row shows real sums (no dashes), $50.00 of parts, and counts the invoice once. The invoice is two rows, one under each representative.")),
  ["S5-R1", "S5-R3", "S5-R4", "S5-R5", "S5-R11", "S5-R13", "S5-R15", "S5-R16", "S2-R13", AQ(24)],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, S9-N1), shows Labor Delta as 0.0 on a Parts row. Chris Ward ruled on 19 Oct 2026 for the PRD (answer 24, quoted below): a dash on the Parts row. This case follows PRD version 11.")

# 22 Oct 2026, Rule 136 split from S5-01: where the Sales Type column appears and how the summary and Totals rows fill it (S5-R19,
# answer 26, tech plan Phase 9) is its own behaviour; it reads the same kind of invoice and changes nothing.
C("S5-01b", "S5", "The Sales Type column shows after Status, with no value on summary rows",
  [ADMIN, REPS2, CUST, LOC0, WO(SPLIT_INV), SBR_TODAY(", with the Sales Type column off")],
  ["Turn the Sales Type column on in the column selector."],
  ["Step 1: a Sales Type column shows right after Status, and before Location when the Location column shows. Neither representative's summary row nor the Totals row shows a Sales Type value: the representative's name cell and the Totals cell stretch across the Sales Type column."],
  ["S5-R19", AQ(26),
   ("Tech plan, Phase 9 browser walk", "turn on → column after Status, rep and Totals merged cells span it")],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, S18-R13), places Location right after Status. Chris Ward ruled on 19 Oct 2026 for the PRD (answer 26, quoted below): the order is Status, Sales Type, Location. This case follows PRD version 11.")

C("S5-02", "S5", "All shop supplies, including a hand-typed amount, go to the Labor row",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 10% of labor, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00, and on its Finance tab shop supplies were typed by hand as $15.00 in place of the calculated $20.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it was invoiced today'),
   SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-A}", "{Work-order-1}'s invoice has a \"Labor\" row under {Sales-rep-A} that shows Shop Supplies $15.00, the amount typed by hand."),
      EXPAND("{Sales-rep-B}", "its \"Parts\" row under {Sales-rep-B} shows a dash under Shop Supplies.")),
  ["S5-R4", "S5-R15", ("Key Decisions, shop supplies", prd_line("Shop supplies go to the Labor side."))])

C("S5-03", "DATA", "A whole-invoice discount is shared by the size of each side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line); Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  *SR(("Invoice {Work-order-1}.", "the invoice total before tax is $980.00 (600.00 + 400.00 + 30.00 − 50.00)."),
      OPEN_SBR, TODAY,
      EXPAND("{Sales-rep-A}", "{Work-order-1}'s invoice has one row under {Sales-rep-A}, its Labor row: Labor Invoiced $600.00, Shop Supplies $30.00, Adjustments ($30.00), its share of the discount (600 ÷ 1,000 × 50), subtotal $600.00."),
      EXPAND("{Sales-rep-B}", "its Parts row under {Sales-rep-B}: Parts Invoiced $400.00, Adjustments ($20.00), its share of the discount (400 ÷ 1,000 × 50), subtotal $380.00. The two subtotals add up to the invoice's total before tax: $600.00 + $380.00 = $980.00.")),
  ["S5-R6", AQ(22)],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, S5-R11), still keeps whole-invoice fees and discounts out of the Labor and Parts columns. Chris Ward ruled on 19 Oct 2026 that each row shows its own share in its Adjustments column (answer 22, quoted below); this case follows PRD version 10.")

C("S5-04", "DATA", "A negative side still shares a discount by size",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one returned part credited at $100.00 (a part line of -$100.00) and a whole-invoice discount of $70.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  *SR(("Invoice {Work-order-1}.", "the invoice total before tax is $430.00 (600.00 − 100.00 − 70.00)."),
      OPEN_SBR, TODAY,
      EXPAND("{Sales-rep-A}", "{Work-order-1}'s Labor row under {Sales-rep-A} has six sevenths of the discount, by size: Adjustments ($60.00), subtotal $540.00."),
      EXPAND("{Sales-rep-B}", "its Parts row under {Sales-rep-B} has one seventh: Adjustments ($10.00), subtotal ($110.00). The returned part reduces {Sales-rep-B}; it is not dropped. The two subtotals add up to the invoice total: $540.00 + ($110.00) = $430.00.")),
  ["S5-E1", "S5-N2", "S5-R6", AQ(22)])

C("S5-05", "DATA", "The Parts share is rounded to the cent and the Labor row gets the rest",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ('Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $200.00 and a whole-invoice discount of $1.00; work order {Work-order-2} for {Customer-A} has one labor line of 1.00 hour at $100.00, one part sold at $100.00 and a whole-invoice discount of $0.01. On both, Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}, and both were invoiced today.',
    "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   SBR_TODAY()],
  *SR(EXPAND("{Sales-rep-A}", "{Sales-rep-A} has a Labor row for each invoice. Adjustments: ($0.33) on {Work-order-1}'s, the rest of the $1.00 after the Parts share; ($0.01) on {Work-order-2}'s, because each exact share is half a cent and the Labor row gets the extra cent."),
      EXPAND("{Sales-rep-B}", "{Sales-rep-B} has a Parts row for each invoice. Adjustments: ($0.67) on {Work-order-1}'s (the exact share 200 ÷ 300 × 1.00 = 0.666… rounded to the nearest cent), so together ($1.00); $0.00 on {Work-order-2}'s, so together ($0.01).")),
  ["S5-R7", "S5-R6", AQ(21)],
  note="Chris Ward answered on 19 Oct 2026 how the shares are rounded (answer 21, quoted below); PRD version 10 replaced the earlier rule \"A cent left over by rounding the share goes to the Labor row.\"")

C("S5-06", "DATA", "A whole-invoice fee with no labor or parts dollars goes to one side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ('Three work orders for {Customer-A} each have only a whole-invoice fee of $25.00 and no labor or parts dollars, and all three were invoiced today: {Work-order-1} with Labor {Sales-rep-A} and Parts {Sales-rep-B}; {Work-order-2} with Labor "Unassigned" and Parts {Sales-rep-B}; {Work-order-3} with both sides "Unassigned" and a customer with no representative.',
    "For example: {Work-order-1} is S2-40001, {Work-order-2} is S2-40002 and {Work-order-3} is S2-40003."),
   SBR_TODAY(", with Show Unassigned on")],
  *SR(EXPAND("{Sales-rep-A}", "{Work-order-1}'s $25.00 is credited to {Sales-rep-A}, the labor representative."),
      EXPAND("{Sales-rep-B}", "{Work-order-2}'s $25.00 is credited to {Sales-rep-B}, the parts representative, because its labor side has no representative."),
      EXPAND_UNASSIGNED("{Work-order-3}'s $25.00 is credited to Unassigned.")),
  ["S5-R8", AQ(23)])

C("S5-07", "S5", "A part sale is one Part Sales row holding the whole sale",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ("Three part sales for {Customer-A} have Sales Representative {Sales-rep-A} and were invoiced today: {Part-sale-1} has one part at $80.00 and shop supplies of $5.00; {Part-sale-2} has one part at $40.00 and no shop supplies charge; {Part-sale-3} has one part at $30.00 and a shop supplies charge of $0.00.",
    "For example: {Part-sale-1} is P-30001, {Part-sale-2} is P-30002 and {Part-sale-3} is P-30003."),
   SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-A}", "each part sale is one row with Sales Type \"Part Sales\" holding every dollar: {Part-sale-1} $80.00 of parts with Shop Supplies $5.00; {Part-sale-2} $40.00 with Shop Supplies showing a dash; {Part-sale-3} $30.00 with Shop Supplies $0.00. On all three rows Labor Delta, Labor Invoiced and Labor Margin show a dash, not 0.00 or $0.00.")),
  ["S5-R9", "S5-R15a", "S5-R15b", "S5-R3", AQ(25), AQ(39)])

# 22 Oct 2026, Rule 136 split: one person on both sides reading as one "Labor, Parts" row (S5-R10) and the Sales Type filter narrowing
# it to one side (S5-R12) are separate behaviours; S5-08b reads one work order of the same kind and changes nothing.
C("S5-08", "S5", "One person on both sides shows one Labor, Parts row",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ('Work order {Work-order-1} for {Customer-A} has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; work order {Work-order-2} for {Customer-A} has one part sold at $50.00 and no labor. On both, "Sales Representative - Labor" and "Sales Representative - Parts" read {Sales-rep-A}, and both were invoiced today.',
    "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-A}", "{Work-order-1}'s invoice is one row, Sales Type \"Labor, Parts\", with the sum of both sides: Labor Invoiced $200.00 and Parts Invoiced $50.00; it counts once. {Work-order-2}'s invoice is one row, Sales Type \"Labor, Parts\", with Parts Invoiced $50.00 and Labor Delta 0.0 (not a dash), because the invoice has no labor.")),
  ["S5-R10", "S5-R13", "S5-R15", AQ(24)])

C("S5-08b", "S5", "Narrowing Sales Type to Labor or Parts shows only that side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; "Sales Representative - Labor" and "Sales Representative - Parts" both read {Sales-rep-A}; it was invoiced today'),
   SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-A}", "{Work-order-1}'s invoice is one row, Sales Type \"Labor, Parts\"."),
      ("Set the Sales Type filter to Labor only.", "only the \"Labor\" side shows: {Work-order-1}'s row reads \"Labor\" with $200.00 of labor."),
      ("Set the Sales Type filter to Parts only.", "only the \"Parts\" side shows: {Work-order-1}'s row reads \"Parts\" with $50.00 of parts.")),
  ["S5-R12", "S5-R10"])

C("S5-09", "DATA", "Report totals are the same split or not when Show Unassigned is on",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; its one "Sales Representative" reads {Sales-rep-A}; it was invoiced today'),
   SBR_TODAY()],
  *SR(("Turn Show Unassigned on and write down the report total.", "the total is $250.00 (200.00 + 50.00)."),
      ("Reverse the invoice of {Work-order-1}.", "the invoice is reversed."),
      ("Add the \"Sales Representative - Parts\" field to {Work-order-1}.", "the card shows \"Sales Representative - Labor\" and \"Sales Representative - Parts\"."),
      ("Set \"Sales Representative - Parts\" to \"Unassigned\".", "\"Sales Representative - Parts\" reads \"Unassigned\"."),
      ("Invoice {Work-order-1} again.", "the new invoice is created with Labor {Sales-rep-A} and Parts Unassigned."),
      OPEN_SBR, TODAY,
      ("Turn Show Unassigned on and read the report total.", "the total is still $250.00: {Sales-rep-A} has a $200.00 Labor row and Unassigned a $50.00 Parts row."),
      ("Turn Show Unassigned off and read the report total.", "the total is $200.00; the Unassigned parts side is left out.")),
  ["S5-R14", "S5-R18", ("Goals", prd_line("Every dollar of an invoice is credited to exactly one side"))])

C("S5-10", "DATA", "Margin % on an invoice row uses only that row's side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it was invoiced today'),
   SBR_TODAY()],
  *SR(EXPAND("{Sales-rep-B}", "{Work-order-1}'s Parts row under {Sales-rep-B}: Parts Margin $20.00 and Margin % 40.00% (20 ÷ 50 × 100); labor plays no part."),
      EXPAND("{Sales-rep-A}", "{Work-order-1}'s Labor row under {Sales-rep-A}: Margin % equals Labor Margin ÷ $200.00 × 100, from the labor figures only.")),
  ["S5-R17"])

# 22 Oct 2026, Rule 136 split: the column being off by default and first in the list (S5-R20, S5-R21) and a column turned on being
# placed after Status and kept for later visits (S5-R19, S5-R22, S5-R24) are separate behaviours; each part starts with the column off.
C("S5-11", "S5", "The Sales Type column is off by default and first in the column list",
  [ADMIN, ("You have never changed the columns of Sales By Representative since the release.", None), SBR],
  ["Look at the report's columns.",
   "Open the column selector."],
  ["Step 1: there is no Sales Type column.",
   "Step 2: \"Sales Type\" is first in the list and is off."],
  ["S5-R20", "S5-R21"])

C("S5-11b", "S5", "A Sales Type column you turn on stays on when you sign in again",
  [ADMIN, ("The Sales Type column of Sales By Representative is off for you.", None), SBR],
  ["Open the column selector.",
   "Turn Sales Type on.",
   "Sign out.",
   "Sign in again.",
   "Open Reports > Sales By Representative."],
  ["Step 1: the column selector opens, with Sales Type off.",
   "Step 2: a Sales Type column shows right after Status, and before Location when the Location column shows; it holds words only (no money).",
   "Step 3: you are signed out.",
   "Step 4: you are signed in.",
   "Step 5: the Sales Type column is still on."],
  ["S5-R19", "S5-R22", "S5-R24", AQ(26)])

C("S5-12", "S5", "Expanded CSV and PDF always carry the Sales Type column",
  [ADMIN, REPS2, CUST,
   WO('it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}'),
   SBR_TODAY(", with the Sales Type column off on screen")],
  ["Export the Expanded CSV.",
   "Open the CSV and find the rows for {Work-order-1}'s invoice.",
   "Export the Expanded PDF and find the same rows."],
  ["Step 1: the CSV downloads.",
   "Step 2: it has a Sales Type column right after Status, and before Location when the file has a Location column; the Labor row reads \"Labor\" with blank parts cells; the Parts row reads \"Parts\" with blank labor, hours and Shop Supplies cells.",
   "Step 3: the PDF has the Sales Type column in the same place, right after Status and before any Location column; the cells of the side a row is not credited with show a dash."],
  ["S5-R23", AQ(24), AQ(26)])

C("S5-13", "DATA", "A zero-dollar side or invoice still counts for its representative",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ('Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 and no parts, with Labor {Sales-rep-A} and Parts {Sales-rep-B}; work order {Work-order-2} totals $0.00 (one labor line at $0.00) with its one Sales Representative {Sales-rep-A}. Both were invoiced today.',
    "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-B}", "{Sales-rep-B} has a \"Parts\" row of $0.00 for {Work-order-1}, and {Sales-rep-B}'s summary row counts that invoice once."),
      EXPAND("{Sales-rep-A}", "{Sales-rep-A} has a $0.00 row for {Work-order-2}, counted once.")),
  ["S5-N1"])

# 22 Oct 2026, Rule 136 pass: the rename is the setup; the case checks its effect on the report and on the invoiced work order.
C("S5-14", "S5", "A renamed rep stays one row under the current name in the report",
  [ADMIN, REPS2, CUST,
   WO('it has a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}; it was invoiced today'),
   ("Since that invoice, {Sales-rep-B}'s last name has been changed.", "For example: from \"Able\" to \"Brook\"."),
   SBR_TODAY()],
  *SR(EXPAND("{Sales-rep-B}", "{Sales-rep-B} is listed under the new name, and the invoice's Parts row is under it, in one row group (not split into an old-name and a new-name group)."),
      ("Open {Work-order-1}.", "the invoiced work order still shows the representatives captured when it was invoiced.")),
  ["S5-R2", "S5-R1"])

# ---------------- Story 6: print ----------------
PRINT = "Click Print Work Order and read the Sales Representative row of the printout."
# 22 Oct 2026, tech plan pass (Rule 134): rewritten top to bottom; a SPLIT work order with the same person on both sides now prints the
# one name too (tech plan Phase 5 print: "one person both sides (split or not) -> one name"; PRD S6-R1 "when one person holds both sides").
# 22 Oct 2026, Rule 136 pass: the split work order with one person on both sides (tech plan Phase 5) is now S6-01b. The inactive person
# is a second work order whose representative's switch was turned off during setup, so no step changes a staff record.
STAFF_AC = ('Staff member {Sales-rep-A} is active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-C} is active and had the switch on, and it has since been turned off.',
            "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.")
C("S6-01", "S6", "Printed work order names the one person who holds both sides",
  [ADMIN, STAFF_AC, CUST,
   ('Work order {Work-order-1} for {Customer-A} has one "Sales Representative" field reading {Sales-rep-A}; work order {Work-order-2} for {Customer-A} has one "Sales Representative" field holding {Sales-rep-C}, picked before their switch was turned off.', "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   WO_START],
  *SR(MENU,
      (PRINT, "the printout opens and the row reads {Sales-rep-A} (one name)."),
      ("Open {Work-order-2}.", "{Work-order-2} opens."),
      MENU,
      (PRINT, "the printout opens and the row reads \"{Sales-rep-C} (Inactive)\".")),
  ["S6-R1"])

C("S6-01b", "S6", "A split work order with one person on both sides prints one name",
  [ADMIN, REPS2, CUST, WO('its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}'), WO_START],
  *SR(MENU,
      (PRINT, "the printout opens and the row reads {Sales-rep-A} (one name), not \"{Sales-rep-A} (Parts) · {Sales-rep-A} (Labor)\".")),
  ["S6-R1",
   ("Tech plan, print tests (Phase 5)", "one person both sides (split or not) -> one name"),
   ("Tech plan, print and audit log (Phase 5)", "Note the deliberate difference from print: a split entry reads both sides even when one person holds both (S7-R3 says \"a split work order reads both sides\"; S6-R1 collapses only on paper).")])

C("S6-02", "S6", "Printed work order names both people, Parts first",
  [ADMIN,
   ('Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-C} is active and had the switch on, and it has since been turned off.',
    "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able."),
   CUST,
   ('Work order {Work-order-1} for {Customer-A} has Labor {Sales-rep-A} and Parts {Sales-rep-B}; work order {Work-order-2} for {Customer-A} has Labor {Sales-rep-A} and Parts {Sales-rep-C}, picked before their switch was turned off.', "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   WO_START],
  *SR(MENU,
      (PRINT, "the row reads \"{Sales-rep-B} (Parts) · {Sales-rep-A} (Labor)\"."),
      ("Open {Work-order-2}.", "{Work-order-2} opens."),
      MENU,
      (PRINT, "the row reads \"{Sales-rep-C} (Parts, inactive) · {Sales-rep-A} (Labor)\".")),
  ["S6-R2"])

C("S6-03", "S6", "Printed work order shows Unassigned for an empty side",
  [ADMIN, REPS2, CUST,
   ('Work order {Work-order-1} for {Customer-A} has Labor "Unassigned" and Parts {Sales-rep-B}; work order {Work-order-2} has Labor {Sales-rep-A} and Parts "Unassigned".', "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   WO_START],
  *SR(MENU,
      (PRINT, "the row reads \"{Sales-rep-B} (Parts) · Unassigned (Labor)\"."),
      ("Open {Work-order-2}.", "{Work-order-2} opens."),
      MENU,
      (PRINT, "the row reads \"Unassigned (Parts) · {Sales-rep-A} (Labor)\".")),
  ["S6-R3"])

C("S6-04", "S6", "Printed work order leaves the row off when nobody is on it",
  [ADMIN, CUST, WO(), WO_START],
  *SR(MENU,
      ("Click Print Work Order and look for a Sales Representative row on the printout.", "there is no Sales Representative row on the printout.")),
  ["S6-R4"])

C("S6-05", "S6", "A side whose staff member no longer exists prints as Unassigned",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts held {Sales-rep-B}, whose staff record no longer exists'), WO_START],
  *SR(MENU,
      (PRINT, "the row reads \"Unassigned (Parts) · {Sales-rep-A} (Labor)\"; it never reads a bare \"(Inactive)\".")),
  ["S6-N1", ("Story 6 context note (S6-N1, S1-E3, S7-R6)", prd_line("* Context note (S6-N1, S1-E3, S7-R6)")), AQ(30)],
  marker="AUTOMATION: HOLD - only a data repair makes a staff record stop existing; developers check this, manual QA cannot set it up",
  note="A manual tester cannot set up this case: a staff record stops existing only through a data repair. The developers check it.")

# ---------------- Story 7: log ----------------
LOG = "Click Audit Log."
# 22 Oct 2026, Rule 136 split (was 13 steps): a change to the one field, adding the Parts field and changing it, and removing the Parts
# field each write their own entry in their own wording (S7-R2, answer 31, S7-R3). Each part starts from its own work order in the
# state the change needs, and keeps its change and the log entry it writes together.
C("S7-01", "S7", "Changing the one field writes a log entry with before and after",
  [ADMIN, REPS2, CUST, WO(), WO_START],
  *SR(("Change Sales Representative to {Sales-rep-A}.", "the field reads {Sales-rep-A}."),
      MENU,
      (LOG, "the newest entry is \"Sales representative changed\" reading \"Sales Representative: Unassigned → {Sales-rep-A}\".")),
  ["S7-R1", "S7-R2"])

C("S7-01b", "S7", "Adding the Parts field and changing it each write one log entry",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), WO_START],
  *SR(("Click the + button.", "a menu opens."),
      ("Click \"Sales Representative - Parts\".", "the card shows \"Sales Representative - Labor\" and \"Sales Representative - Parts\"."),
      ("Set \"Sales Representative - Parts\" to {Sales-rep-B}.", "Labor reads {Sales-rep-A} and Parts {Sales-rep-B}."),
      MENU,
      (LOG, "two new entries: adding the field \"Sales Representative: {Sales-rep-A} → {Sales-rep-A} (Parts) · {Sales-rep-A} (Labor)\", then \"{Sales-rep-A} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-B} (Parts) · {Sales-rep-A} (Labor)\".")),
  ["S7-R1", "S7-R3", AQ(31)])

C("S7-01c", "S7", "Removing the Parts field writes a log entry",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'), WO_START],
  *SR(("Click the remove x beside \"Sales Representative - Parts\".", "one \"Sales Representative\" field reads {Sales-rep-A}."),
      MENU,
      (LOG, "the newest entry reads \"Sales Representative: {Sales-rep-B} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-A}\".")),
  ["S7-R1", "S7-R2", "S7-R3"])

C("S7-02", "S7", "A split work order's log entry shows Unassigned for an empty side",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'), WO_START],
  *SR(("Set \"Sales Representative - Labor\" to \"Unassigned\".", "Labor reads \"Unassigned\"."),
      MENU,
      (LOG, "the newest entry reads \"Sales Representative: {Sales-rep-B} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-B} (Parts) · Unassigned (Labor)\".")),
  ["S7-R3", "S7-R1"])

C("S7-03", "S7", "Picking the person already in the field writes no log entry",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" reads {Sales-rep-A}'), WO_START],
  *SR(MENU,
      ("Click Audit Log and count the \"Sales representative changed\" entries.", "the log opens and you have the count."),
      CLOSE_LOG,
      ("Click the Sales Representative field.", "the dropdown opens."),
      ("Click {Sales-rep-A} again.", "the field still reads {Sales-rep-A}."),
      MENU,
      ("Click Audit Log and count the \"Sales representative changed\" entries.", "the count is the same; no new entry.")),
  ["S7-R4"])

C("S7-05", "S7", "A log entry reads Unassigned for a rep who no longer exists",
  [ADMIN, REPS2, CUST,
   ('Work order {Work-order-1} for {Customer-A} is open and not invoiced; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" holds {Staff-member-C}, whose staff record no longer exists.',
    "For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep."),
   ('Work order {Work-order-2} for {Customer-A} is open and not invoiced; its one "Sales Representative" field holds {Staff-member-D}, a staff member of another organization.',
    "For example: {Work-order-2} is S2-40002 and {Staff-member-D} is ZZAUTOTEST Other Org Rep."),
   WO_START],
  *SR(("Set \"Sales Representative - Labor\" to {Sales-rep-B}.", "Labor reads {Sales-rep-B}."),
      MENU,
      (LOG, "the newest entry reads \"Sales Representative: Unassigned (Parts) · {Sales-rep-A} (Labor) → Unassigned (Parts) · {Sales-rep-B} (Labor)\"; the Parts side never reads a bare \"(Inactive)\"."),
      CLOSE_LOG,
      ("Open {Work-order-2}.", "{Work-order-2} opens."),
      ("Set its Sales Representative to {Sales-rep-A}.", "the field reads {Sales-rep-A}."),
      MENU,
      (LOG, "the newest entry reads \"Sales Representative: Unassigned → {Sales-rep-A}\".")),
  ["S7-R6", "S7-R2", "S7-R3", ("Story 6 context note (S6-N1, S1-E3, S7-R6)", prd_line("* Context note (S6-N1, S1-E3, S7-R6)")), AQ(5), AQ(30)],
  stories=[7],
  marker="AUTOMATION: HOLD - only a data repair makes a staff record stop existing or belong to another organization; developers check this, manual QA cannot set it up",
  note="A manual tester cannot set up this case: a staff record stops existing, or sits in another organization, only through a data repair. The developers check it.")

# ---------------- Story 8: Sales Type filters ----------------
C("S8-01", "S8", "Sales By Representative has a Sales Type filter, all selected",
  [ADMIN, SBR],
  ["Open the Sales Type filter.",
   "Untick Part Sales.",
   "Untick Labor.",
   "Untick Parts."],
  ["Step 1: three options in this order: \"Labor\", \"Parts\", \"Part Sales\"; all three are selected, and the filter's label reads \"Sales Type: All\".",
   "Step 2: it reads \"Sales Type: Labor, Parts\"; Part Sales rows leave the report and the totals and counts follow.",
   "Step 3: it reads \"Sales Type: Parts\".",
   "Step 4: it reads \"Sales Type: None\" and the report shows its empty state with no invoices."],
  ["S8-R1", "S8-R2", "S8-R3", "S8-R5"])

# 22 Oct 2026, Rule 136 split: the filter line of the exports (S8-R4, first sentences) and Export with no Sales Type selected (S8-R4,
# answer 27) are separate behaviours; S8-02b starts from the report as it opens.
C("S8-02", "S8", "Sales By Representative exports name the Sales Type selection",
  [ADMIN, SBR],
  *SR(("With all Sales Types selected, export the PDF and read the filter line at the top.", "it reads \"Sales Type: All\"."),
      ("Export the CSV and read the filter line at the top.", "it reads \"Sales Type: All\"."),
      ("Select only Parts and Part Sales in the Sales Type filter.", "only Parts and Part Sales are ticked."),
      ("Export the PDF and read the filter line.", "it reads \"Sales Type: Parts, Part Sales\"."),
      ("Export the CSV and read the filter line.", "it reads \"Sales Type: Parts, Part Sales\".")),
  ["S8-R4"])

C("S8-02b", "S8", "With no Sales Type ticked, Sales By Representative export makes no file",
  [ADMIN, SBR],
  *SR(("Untick every Sales Type.", "no Sales Type is ticked."),
      ("Click Export.", "\"Empty export\" shows and no file is made.")),
  ["S8-R4", AQ(27)],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, S3-R10 and S14-E3), still makes a file with a \"Sales Type: None\" line when no option is selected. Chris Ward ruled on 19 Oct 2026 for the PRD (answer 27, quoted below): Export shows \"Empty export\" and makes no file. This case follows PRD version 10.")

C("S8-03", "S8", "Sales By Customer's Product Type filter now reads Sales Type",
  [ADMIN, START("Reports > Sales By Customer is open in a desktop browser at least 1024 px wide")],
  ["Open the filter that used to read \"Product Type\".",
   "Untick Service Sales.",
   "Untick Part Sales too."],
  ["Step 1: it is labelled \"Sales Type\", with two options, \"Part Sales\" and \"Service Sales\"; with both options selected its label reads \"Sales Type: All Sales\".",
   "Step 2: it reads \"Sales Type: Part Sales\".",
   "Step 3: it reads \"Sales Type: No sales\"."],
  ["S8-R6", "S8-R7", "S8-R8", AQ(28)])

# 22 Oct 2026, Rule 136 split, as S8-02: the filter line of the exports (S8-R9) and Export with no option selected (S8-R9, answer 27).
C("S8-04", "S8", "Sales By Customer exports name the Sales Type selection",
  [ADMIN, START("Reports > Sales By Customer is open in a desktop browser at least 1024 px wide")],
  *SR(("With both options selected, export the PDF and read the filter line.", "it reads \"Sales Type: All Sales\"."),
      ("Export the CSV and read the filter line.", "it reads \"Sales Type: All Sales\"."),
      ("Select only Part Sales in the Sales Type filter.", "only Part Sales is ticked."),
      ("Export the PDF and read the filter line.", "it reads \"Sales Type: Part Sales only\"."),
      ("Export the CSV and read the filter line.", "it reads \"Sales Type: Part Sales only\"."),
      ("Select only Service Sales in the Sales Type filter.", "only Service Sales is ticked."),
      ("Export the PDF and read the filter line.", "it reads \"Sales Type: Service Sales only\"."),
      ("Export the CSV and read the filter line.", "it reads \"Sales Type: Service Sales only\".")),
  ["S8-R9"])

C("S8-04b", "S8", "With no Sales Type ticked, Sales By Customer export makes no file",
  [ADMIN, START("Reports > Sales By Customer is open in a desktop browser at least 1024 px wide")],
  *SR(("Untick both options.", "no option is ticked."),
      ("Click Export.", "\"Empty export\" shows and no file is made.")),
  ["S8-R9", AQ(27)],
  note="The Sales By Customer spec, version 21 (6 Oct 2026, S3-R7, S15-R10 and S18-R10), still makes a file with a \"No sales\" line when no option is selected. Chris Ward ruled on 19 Oct 2026 for the PRD on both reports (answer 27, quoted below): Export shows \"Empty export\" and makes no file. This case follows PRD version 10.")

C("S8-05", "S8", "Sales By Customer figures do not change with the new wording",
  [ADMIN, REPS2,
   ("Today customer {Customer-A} has one invoiced part sale of $40.00 and one invoiced work order of $250.00 that includes a part.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide")],
  ["Select only Part Sales and read {Customer-A}'s row.",
   "Select only Service Sales and read {Customer-A}'s row.",
   "Select both and read {Customer-A}'s row."],
  ["Step 1: it holds only the part sale, $40.00.",
   "Step 2: it holds only the work order, $250.00, including the part sold on it.",
   "Step 3: it holds both, $290.00."],
  ["S8-R10", "S8-N1"])

# 22 Oct 2026, Rule 136 split: an export with no rows on Sales By Representative (S8-R4) and on Sales By Customer (S8-R9) are each
# their own behaviour; the empty date range is part of each starting screen, not a step.
NODATE = ("{Location-A} has no invoices on {Date-A}.", "For example: {Date-A} is 1 Jan 2026.")
C("S8-12", "S8", "Sales By Representative exports with no rows still have the headings",
  [ADMIN, NODATE, START("Reports > Sales By Representative is open for {Date-A} in a desktop browser at least 1024 px wide, showing no invoices")],
  ["With all three Sales Types selected, export the CSV.",
   "Export the PDF."],
  ["Step 1: \"Empty export\" does not show; a CSV downloads with the filter line \"Sales Type: All\", the column headings and no rows.",
   "Step 2: a PDF downloads with the filter line \"Sales Type: All\", the column headings and no rows."],
  ["S8-R4", AQ(27)])

C("S8-12b", "S8", "Sales By Customer exports with no rows still have the headings",
  [ADMIN, NODATE, START("Reports > Sales By Customer is open for {Date-A} in a desktop browser at least 1024 px wide, showing no invoices")],
  ["With both Sales Types selected, export the CSV.",
   "Export the PDF."],
  ["Step 1: \"Empty export\" does not show; a CSV downloads with the filter line \"Sales Type: All Sales\", the column headings and no rows.",
   "Step 2: a PDF downloads with the filter line \"Sales Type: All Sales\", the column headings and no rows."],
  ["S8-R9", AQ(27)])

# ---------------- 22 Oct 2026, tech plan pass (Rule 134): new cases ----------------
C("S5-19", "S5", "A rep whose staff record is gone shows the name kept on the invoice",
  [ADMIN, REPS2, CUST, LOC0,
   ('Work order {Work-order-1} for {Customer-A} was invoiced today with "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Staff-member-C}; since then {Staff-member-C}\'s staff record no longer exists.',
    "For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep."),
   SBR_TODAY(", with Show Unassigned on and the Sales Type column turned on")],
  *SR(EXPAND("{Staff-member-C}", "{Work-order-1}'s Parts row is listed under the name captured on the invoice, {Staff-member-C}; it is not moved to Unassigned and not dropped.")),
  ["S5-R2", "S5-R1", ("Story 6 context note (S6-N1, S1-E3, S7-R6)", prd_line("* Context note (S6-N1, S1-E3, S7-R6)")), AQ(30),
   ("Tech plan, Phase 8 fetcher tests (section 8.4)", "A cross-org staff id on an invoice gives a null live name and falls back to the captured name with inactive set (D4).")],
  marker="AUTOMATION: HOLD - only a data repair makes a staff record stop existing; developers check this, manual QA cannot set it up",
  note="A manual tester cannot set up this case: a staff record stops existing only through a data repair. The developers check it.")

C("S5-20", "DATA", "A discount bigger than the invoice is shared by size and both rows end at $0.00",
  [ADMIN, REPS2, ("Customer {Customer-A} has no sales representative, and no tax applies to its invoices.", "For example: {Customer-A} is ZZAUTOTEST SSR Tax Exempt, set as tax exempt."),
   ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $50.00 and a non-taxable whole-invoice discount of $200.00 (not on any line); Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  *SR(("Invoice {Work-order-1}.", "the invoice total is $0.00: the discount does not take it below zero (100.00 + 50.00 − 200.00 would be −50.00, so $50.00 is added back)."),
      OPEN_SBR, TODAY,
      EXPAND("{Sales-rep-A}", "{Work-order-1}'s invoice has one row under {Sales-rep-A}, its Labor row: Labor Invoiced $100.00, Adjustments ($100.00), its share of the −$150.00 net whole-invoice amount (100 ÷ 150 × 150), subtotal $0.00."),
      EXPAND("{Sales-rep-B}", "its Parts row under {Sales-rep-B}: Parts Invoiced $50.00, Adjustments ($50.00) (50 ÷ 150 × 150), subtotal $0.00. $0.00 + $0.00 = $0.00, the invoice total; neither row goes below zero and the report total for the invoice is $0.00.")),
  ["S5-R6", AQ(22),
   ("Tech plan, line fees and the whole-invoice pool (section 8.2)", "`invoice_level_adjustments` holds only the whole-invoice pool (`Invoice.orm.xml:58-68`: \"scopes whole_wo / whole_parts_sale, the processing fee, the legacy invoice.discount rate and the §5 subtotal floor\")"),
   ("Tech plan, end-to-end test N1 (section 7)", "a whole-work-order $50 flat taxable discount (avoids the non-taxable clamp)")])
