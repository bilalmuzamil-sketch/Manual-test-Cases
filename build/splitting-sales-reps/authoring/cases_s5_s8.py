from ssr_lib import C, prd_line
from common import *

SBR = START("Reports > Sales By Representative is open in a desktop browser at least 1024 px wide")
SBR_STEP = "Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector."
LOC0 = ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None)

# ---------------- Story 5: credit on the invoice and in Sales By Representative ----------------
C("S5-01", "S5", "A split invoice gives the Labor rep a Labor row and the Parts rep a Parts row",
  [ADMIN, REPS2, CUST, LOC0,
   WO('it has one labor line of 2.00 hours at $100.00 an hour (Tech Time 2.00) and one part sold at $50.00; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   SBR_STEP,
   "Read {Sales-rep-A}'s invoice row for {Work-order-1}.",
   "Read {Sales-rep-B}'s invoice row for {Work-order-1}.",
   "Read each representative's summary row and invoice count."],
  ["Step 1: the invoice is created.",
   "Step 2: the report shows two rows for {Work-order-1}'s invoice, one under {Sales-rep-A} and one under {Sales-rep-B}; the Sales Type column shows after Status.",
   "Step 3: Sales Type \"Labor\"; Labor Invoiced $200.00, Hrs Invoiced 2.00, labor columns filled; Parts Invoiced and Parts Margin show a dash, not $0.00.",
   "Step 4: Sales Type \"Parts\"; Parts Invoiced $50.00; Labor Invoiced, Labor Margin, Hrs Worked, Hrs Invoiced, Labor Delta and Shop Supplies show a dash.",
   "Step 5: each summary row shows real sums (no dashes): {Sales-rep-A} $200.00 of labor, {Sales-rep-B} $50.00 of parts; each counts the invoice once."],
  ["S5-R1", "S5-R3", "S5-R4", "S5-R5", "S5-R11", "S5-R13", "S5-R15", "S5-R16", "S5-R19", "S2-R13"])

C("S5-02", "S5", "All shop supplies, including a hand-typed amount, go to the Labor row",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 10% of labor, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  ["On the work order's Finance tab, type a shop supplies amount of $15.00 by hand in place of the calculated $20.00.",
   "Invoice {Work-order-1}.",
   SBR_STEP,
   "Read the Shop Supplies column on both rows for the invoice."],
  ["Step 1: the work order shows Shop Supplies $15.00.",
   "Step 2: the invoice is created.",
   "Step 3: {Sales-rep-A} has a \"Labor\" row and {Sales-rep-B} a \"Parts\" row for the invoice.",
   "Step 4: the Labor row shows Shop Supplies $15.00; the Parts row shows a dash."],
  ["S5-R4", "S5-R15", ("Key Decisions, shop supplies", prd_line("Shop supplies go to the Labor side."))])

C("S5-03", "DATA", "A whole-invoice discount is shared by the size of each side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line); Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   SBR_STEP,
   "Read {Sales-rep-A}'s Labor row for the invoice.",
   "Read {Sales-rep-B}'s Parts row for the invoice.",
   "Add the two rows' subtotals."],
  ["Step 1: the invoice total before tax is $980.00 (600.00 + 400.00 + 30.00 − 50.00).",
   "Step 2: two rows show for the invoice.",
   "Step 3: Labor row: Labor Invoiced $600.00, Shop Supplies $30.00, its share of the discount ($30.00) (600 ÷ 1,000 × 50), subtotal $600.00.",
   "Step 4: Parts row: Parts Invoiced $400.00, its share of the discount ($20.00) (400 ÷ 1,000 × 50), subtotal $380.00.",
   "Step 5: $600.00 + $380.00 = $980.00, the invoice's total before tax."],
  ["S5-R6"])

C("S5-04", "DATA", "A negative side still shares a discount by size",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one returned part credited at $100.00 (a part line of -$100.00) and a whole-invoice discount of $70.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   SBR_STEP,
   "Read the Labor row and the Parts row for the invoice.",
   "Add the two rows' subtotals."],
  ["Step 1: the invoice total before tax is $430.00 (600.00 − 100.00 − 70.00).",
   "Step 2: two rows show for the invoice.",
   "Step 3: the shares are six sevenths and one seventh by size: Labor row ($60.00), subtotal $540.00; Parts row ($10.00), subtotal ($110.00). The returned part reduces {Sales-rep-B}; it is not dropped.",
   "Step 4: $540.00 + ($110.00) = $430.00, the invoice total."],
  ["S5-E1", "S5-N2", "S5-R6"])

C("S5-05", "DATA", "A cent left over by rounding the shares goes to the Labor row",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $100.00 and a whole-invoice discount of $0.01; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   SBR_STEP,
   "Read the discount share on the Labor row and on the Parts row."],
  ["Step 1: the invoice is created.",
   "Step 2: two rows show for the invoice.",
   "Step 3: the two shares add up to exactly ($0.01), and the cent is on the Labor row: Labor ($0.01), Parts $0.00."],
  ["S5-R7", "S5-R6"],
  note="Each side's exact share is half a cent, so this tie lands on the Labor row under every reading of the rounding rule. How a share that is not a tie is rounded is a question for the product owner.")

C("S5-06", "DATA", "A whole-invoice fee with no labor or parts dollars goes to one side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ('Three work orders for {Customer-A} each have only a whole-invoice fee of $25.00 and no labor or parts dollars: {Work-order-1} with Labor {Sales-rep-A} and Parts {Sales-rep-B}; {Work-order-2} with Labor "Unassigned" and Parts {Sales-rep-B}; {Work-order-3} with both sides "Unassigned" and a customer with no representative.',
    "For example: {Work-order-1} is S2-40001, {Work-order-2} is S2-40002 and {Work-order-3} is S2-40003."),
   START("the Work Orders page is open in a desktop browser at least 1024 px wide")],
  ["Invoice {Work-order-1}, {Work-order-2} and {Work-order-3}.",
   SBR_STEP,
   "Find each invoice's fee in the report."],
  ["Step 1: three invoices are created.",
   "Step 2: the report shows today's invoices.",
   "Step 3: {Work-order-1}'s $25.00 is credited to {Sales-rep-A} (the labor representative); {Work-order-2}'s $25.00 to {Sales-rep-B} (the parts representative, because the labor side is empty); {Work-order-3}'s $25.00 to Unassigned."],
  ["S5-R8"])

C("S5-07", "S5", "A part sale is one Part Sales row holding the whole sale",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ("Part sale {Part-sale-1} for {Customer-A} has one part at $80.00 and shop supplies of $5.00, and its Sales Representative reads {Sales-rep-A}; part sale {Part-sale-2} has one part at $40.00, no shop supplies and Sales Representative {Sales-rep-A}.",
    "For example: {Part-sale-1} is P-30001 and {Part-sale-2} is P-30002."),
   START("the Part Sales page is open in a desktop browser at least 1024 px wide")],
  ["Invoice {Part-sale-1} and {Part-sale-2}.",
   SBR_STEP,
   "Read {Sales-rep-A}'s rows for the two part sales."],
  ["Step 1: both are invoiced.",
   "Step 2: the report shows today's invoices.",
   "Step 3: each part sale is one row with Sales Type \"Part Sales\" holding every dollar: {Part-sale-1} $80.00 of parts with Shop Supplies $5.00; {Part-sale-2} $40.00 with Shop Supplies showing a dash."],
  ["S5-R9", "S5-R15a", "S5-R3"])

C("S5-08", "S5", "One person on both sides shows one Labor, Parts row",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; "Sales Representative - Labor" and "Sales Representative - Parts" both read {Sales-rep-A}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   SBR_STEP,
   "Read {Sales-rep-A}'s rows for the invoice.",
   "Set the Sales Type filter to Labor only.",
   "Set the Sales Type filter to Parts only."],
  ["Step 1: the invoice is created.",
   "Step 2: the report shows today's invoices.",
   "Step 3: one row, Sales Type \"Labor, Parts\", with the sum of both sides: Labor Invoiced $200.00 and Parts Invoiced $50.00; the invoice counts once.",
   "Step 4: only a \"Labor\" row shows, with $200.00 of labor.",
   "Step 5: only a \"Parts\" row shows, with $50.00 of parts."],
  ["S5-R10", "S5-R12", "S5-R13"])

C("S5-09", "DATA", "Report totals are the same split or not when Show Unassigned is on",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; its one "Sales Representative" reads {Sales-rep-A}; it is ready to invoice'),
   WO_START],
  ["Invoice {Work-order-1}, then open Sales By Representative for today with Show Unassigned on and write down the report total.",
   "Reverse the invoice, add the Parts field, set \"Sales Representative - Parts\" to \"Unassigned\" and invoice again.",
   "Open Sales By Representative for today with Show Unassigned on and read the report total.",
   "Turn Show Unassigned off and read the report total."],
  ["Step 1: the total is $250.00 (200.00 + 50.00).",
   "Step 2: the new invoice is created with Labor {Sales-rep-A} and Parts Unassigned.",
   "Step 3: the total is still $250.00: {Sales-rep-A} has a $200.00 Labor row and Unassigned a $50.00 Parts row.",
   "Step 4: the total is $200.00; the Unassigned parts side is left out."],
  ["S5-R14", "S5-R18", ("Goals", prd_line("Every dollar of an invoice is credited to exactly one side"))])

C("S5-10", "DATA", "Margin % on an invoice row uses only that row's side",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   SBR_STEP,
   "Read the Parts row's Parts Margin and Margin %.",
   "Read the Labor row's Labor Invoiced, Labor Margin and Margin %."],
  ["Step 1: the invoice is created.",
   "Step 2: two rows show for the invoice.",
   "Step 3: Parts Margin $20.00 and Margin % 40.00% (20 ÷ 50 × 100); labor plays no part.",
   "Step 4: Margin % equals Labor Margin ÷ $200.00 × 100, from the labor figures only."],
  ["S5-R17"])

C("S5-11", "S5", "The Sales Type column is off by default, first in the list and remembered",
  [ADMIN, ("You have never changed the columns of Sales By Representative since the release.", None), SBR],
  ["Look at the report's columns.",
   "Open the column selector.",
   "Turn Sales Type on and close the selector.",
   "Sign out, sign in again and open Sales By Representative."],
  ["Step 1: there is no Sales Type column.",
   "Step 2: \"Sales Type\" is first in the list and is off.",
   "Step 3: a Sales Type column shows after Status; it holds words only (no money).",
   "Step 4: the Sales Type column is still on."],
  ["S5-R19", "S5-R20", "S5-R21", "S5-R22", "S5-R24"])

C("S5-12", "S5", "Expanded CSV and PDF always carry the Sales Type column",
  [ADMIN, REPS2, CUST,
   WO('it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}'),
   SBR + " The Sales Type column is off on screen"],
  ["Set the date range to today and export the Expanded CSV.",
   "Open the CSV and find the rows for {Work-order-1}'s invoice.",
   "Export the Expanded PDF and find the same rows."],
  ["Step 1: the CSV downloads.",
   "Step 2: it has a Sales Type column after Status; the Labor row reads \"Labor\" with blank parts cells; the Parts row reads \"Parts\" with blank labor, hours and Shop Supplies cells.",
   "Step 3: the PDF has the Sales Type column after Status; the cells of the side a row is not credited with show a dash."],
  ["S5-R23"])

C("S5-13", "DATA", "A zero-dollar side or invoice still counts for its representative",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ('Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 and no parts, with Labor {Sales-rep-A} and Parts {Sales-rep-B}; work order {Work-order-2} totals $0.00 (one labor line at $0.00) with its one Sales Representative {Sales-rep-A}.',
    "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   START("the Work Orders page is open in a desktop browser at least 1024 px wide")],
  ["Invoice {Work-order-1} and {Work-order-2}.",
   SBR_STEP,
   "Read {Sales-rep-B}'s row for {Work-order-1} and invoice count.",
   "Read {Sales-rep-A}'s row for {Work-order-2}."],
  ["Step 1: both are invoiced.",
   "Step 2: the report shows today's invoices.",
   "Step 3: {Sales-rep-B} has a \"Parts\" row of $0.00 for {Work-order-1}, and the invoice counts once for {Sales-rep-B}.",
   "Step 4: {Sales-rep-A} has a $0.00 row for {Work-order-2}, counted once."],
  ["S5-N1"])

C("S5-14", "S5", "A renamed rep stays one row under the current name in the report",
  [ADMIN, REPS2, CUST,
   WO('it has a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}; it was invoiced today'),
   START("Settings > Staff is open in a desktop browser at least 1024 px wide")],
  ["Change {Sales-rep-B}'s last name (for example to \"Brook\") and save.",
   "Open Sales By Representative for today.",
   "Open {Work-order-1}."],
  ["Step 1: the staff record saves.",
   "Step 2: the invoice's Parts row is under {Sales-rep-B}'s new name, in one row group (not split into an old-name and a new-name group).",
   "Step 3: the invoiced work order still shows the representatives captured when it was invoiced."],
  ["S5-R2", "S5-R1"])

# ---------------- Story 6: print ----------------
PR = "Open the work order's menu, click Print Work Order and read the Sales Representative row."
C("S6-01", "S6", "Printed work order names the one person who holds both sides",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" reads {Sales-rep-A}'), WO_START],
  [PR, "Turn {Sales-rep-A}'s \"Sales Representative\" switch off in Settings > Staff, then print {Work-order-1} again."],
  ["Step 1: the row reads {Sales-rep-A} (one name).",
   "Step 2: the row reads \"{Sales-rep-A} (Inactive)\"."],
  ["S6-R1"])

C("S6-02", "S6", "Printed work order names both people, Parts first",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'), WO_START],
  [PR, "Turn {Sales-rep-B}'s \"Sales Representative\" switch off in Settings > Staff, then print {Work-order-1} again."],
  ["Step 1: the row reads \"{Sales-rep-B} (Parts) · {Sales-rep-A} (Labor)\".",
   "Step 2: the row reads \"{Sales-rep-B} (Parts, inactive) · {Sales-rep-A} (Labor)\"."],
  ["S6-R2"])

C("S6-03", "S6", "Printed work order shows Unassigned for an empty side",
  [ADMIN, REPS2, CUST,
   ('Work order {Work-order-1} for {Customer-A} has Labor "Unassigned" and Parts {Sales-rep-B}; work order {Work-order-2} has Labor {Sales-rep-A} and Parts "Unassigned".', "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   WO_START],
  [PR, "Open {Work-order-2} and print it the same way."],
  ["Step 1: the row reads \"{Sales-rep-B} (Parts) · Unassigned (Labor)\".",
   "Step 2: the row reads \"Unassigned (Parts) · {Sales-rep-A} (Labor)\"."],
  ["S6-R3"])

C("S6-04", "S6", "Printed work order leaves the row off when nobody is on it",
  [ADMIN, CUST, WO(), WO_START],
  [PR],
  ["Step 1: there is no Sales Representative row on the printout."],
  ["S6-R4"])

C("S6-05", "S6", "A side whose staff member no longer exists prints as Unassigned",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts held {Sales-rep-B}, whose staff record no longer exists'), WO_START],
  [PR],
  ["Step 1: the row reads \"Unassigned (Parts) · {Sales-rep-A} (Labor)\"; it never reads a bare \"(Inactive)\"."],
  ["S6-N1"], marker="AUTOMATION: HOLD - needs a staff record that no longer exists; if staff cannot be deleted in the app, check with the developers")

# ---------------- Story 7: log ----------------
LOG = "Open the work order's menu and click Audit Log."
C("S7-01", "S7", "Each representative change writes one log entry with before and after",
  [ADMIN, REPS2, CUST, WO(), WO_START],
  ["Change Sales Representative to {Sales-rep-A}.", LOG,
   "Close the log, click the + and add \"Sales Representative - Parts\", then set Parts to {Sales-rep-B}.", LOG,
   "Close the log, click the remove x beside Parts.", LOG],
  ["Step 1: the field reads {Sales-rep-A}.",
   "Step 2: the newest entry is \"Sales representative changed\" reading \"Sales Representative: Unassigned → {Sales-rep-A}\".",
   "Step 3: Labor reads {Sales-rep-A} and Parts {Sales-rep-B}.",
   "Step 4: two new entries: adding the field \"Sales Representative: {Sales-rep-A} → {Sales-rep-A} (Parts) · {Sales-rep-A} (Labor)\", then \"{Sales-rep-A} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-B} (Parts) · {Sales-rep-A} (Labor)\".",
   "Step 5: one \"Sales Representative\" field reads {Sales-rep-A}.",
   "Step 6: a new entry reads \"Sales Representative: {Sales-rep-B} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-A}\"."],
  ["S7-R1", "S7-R2", "S7-R3"],
  note="Step 4: whether adding the Parts field with the same person on both sides writes an entry is a question for the product owner (S7-R1 says adding the field writes one; S7-R4 says a change that leaves the representatives as they were writes none). Until answered, judge the entry for setting Parts to {Sales-rep-B} and record what you see for the add.")

C("S7-02", "S7", "A split work order's log entry shows Unassigned for an empty side",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'), WO_START],
  ["Set \"Sales Representative - Labor\" to \"Unassigned\".", LOG],
  ["Step 1: Labor reads \"Unassigned\".",
   "Step 2: the newest entry reads \"Sales Representative: {Sales-rep-B} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-B} (Parts) · Unassigned (Labor)\"."],
  ["S7-R3", "S7-R1"])

C("S7-03", "S7", "Picking the person already in the field writes no log entry",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" reads {Sales-rep-A}'), WO_START],
  [LOG + " Count the \"Sales representative changed\" entries.",
   "Close the log, click the Sales Representative field and pick {Sales-rep-A} again.", LOG],
  ["Step 1: you have the count.",
   "Step 2: the field still reads {Sales-rep-A}.",
   "Step 3: the count is the same; no new entry."],
  ["S7-R4"])

# ---------------- Story 8: Sales Type filters ----------------
C("S8-01", "S8", "Sales By Representative has a Sales Type filter, all selected",
  [ADMIN, SBR],
  ["Open the Sales Type filter.",
   "Read the filter's label with all options selected.",
   "Untick Part Sales.",
   "Untick Labor and Parts too."],
  ["Step 1: three options in this order: \"Labor\", \"Parts\", \"Part Sales\"; all three are selected.",
   "Step 2: it reads \"Sales Type: All\".",
   "Step 3: it reads \"Sales Type: Labor, Parts\"; Part Sales rows leave the report and the totals and counts follow.",
   "Step 4: it reads \"Sales Type: None\" and the report shows its empty state with no invoices."],
  ["S8-R1", "S8-R2", "S8-R3", "S8-R5"])

C("S8-02", "S8", "Sales By Representative exports name the Sales Type selection",
  [ADMIN, SBR],
  ["With all Sales Types selected, export the PDF and the CSV and read the filter line at the top of each.",
   "Select only Parts and Part Sales, export again and read the filter line.",
   "Untick every Sales Type and click Export."],
  ["Step 1: both read \"Sales Type: All\".",
   "Step 2: both read \"Sales Type: Parts, Part Sales\".",
   "Step 3: \"Empty export\" shows and no file is made."],
  ["S8-R4"])

C("S8-03", "S8", "Sales By Customer's Product Type filter now reads Sales Type",
  [ADMIN, START("Reports > Sales By Customer is open in a desktop browser at least 1024 px wide")],
  ["Find the filter that used to read \"Product Type\" and open it.",
   "Read its label with both options selected.",
   "Untick Service Sales.",
   "Untick Part Sales too."],
  ["Step 1: it is labelled \"Sales Type\", with two options, \"Part Sales\" and \"Service Sales\".",
   "Step 2: it reads \"Sales Type: All Sales\".",
   "Step 3: it reads \"Sales Type: Part Sales\".",
   "Step 4: it reads \"Sales Type: No sales\"."],
  ["S8-R6", "S8-R7", "S8-R8"])

C("S8-04", "S8", "Sales By Customer exports name the Sales Type selection",
  [ADMIN, START("Reports > Sales By Customer is open in a desktop browser at least 1024 px wide")],
  ["With both options selected, export the PDF and the CSV and read the filter line.",
   "Select only Part Sales and export both again.",
   "Select only Service Sales and export both again.",
   "Untick both options and click Export."],
  ["Step 1: both read \"Sales Type: All Sales\".",
   "Step 2: both read \"Sales Type: Part Sales only\".",
   "Step 3: both read \"Sales Type: Service Sales only\".",
   "Step 4: \"Empty export\" shows and no file is made."],
  ["S8-R9"])

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
