"""Cases for testable behaviour the tech plan adds beyond the PRD (review/TECHPLAN-JIRA-REVIEW.md section c), quoted from the tech plan."""
from ssr_lib import C, prd_line, AQ
from common import *

C("S4-23", "S4", "Saving a customer with a rep turned off in another tab is refused",
  [ADMIN, REPS2, CUST, START("{Customer-A}'s page is open in a desktop browser at least 1024 px wide, and Settings > Staff is open in a second tab")],
  ["In the first tab, open Edit Customer and click the Sales Representative field so {Sales-rep-B} is listed.",
   "In the second tab, turn {Sales-rep-B}'s \"Sales Representative\" switch off and save.",
   "In the first tab, pick {Sales-rep-B} and save the customer."],
  ["Step 1: the dropdown lists {Sales-rep-B}.",
   "Step 2: the staff record saves.",
   "Step 3: the save is refused with \"The selected staff member is not a sales representative.\" and {Customer-A} keeps no representative."],
  ["S1-N2", ("Tech plan, customer validation (D5)", "A `user_id` the customer does not already hold on any side must also be an active user with a staff row flagged `is_sales_rep`. Both failures return 400 \"The selected staff member is not a sales representative.\"")],
  stories=[4])

C("S4-24", "S4", "A work-orders-only user adding a customer from a work order sees the reps",
  [('You are signed in as {User-B}, whose role has "Work Orders — Create & Edit" but not "Customers — Create & Edit", at {Location-A}.',
    "For example: {User-B} is ZZAUTOTEST SSR WO Only with the custom role ZZAUTOTEST SSR WO Only; {Location-A} is Staging Heavy Duty - 9919."),
   REPS2, START("the Work Orders page is open in a desktop browser at least 1024 px wide")],
  ["Start a New Work Order and choose to add a new customer from it.",
   "Click the Sales Representative field in the New Customer window.",
   "Pick {Sales-rep-A}, fill in the required details and save the customer."],
  ["Step 1: the New Customer window opens and stays open (no access-denied message), with a Sales Representative field.",
   "Step 2: \"Unassigned\" is first, then the active sales representatives including {Sales-rep-A} and {Sales-rep-B}.",
   "Step 3: the customer is created with {Sales-rep-A}, and the new work order can carry on with it."],
  ["S4-R1", "S4-R3", ("Story 4 prerequisites", prd_line("User has 'Customers — Create & Edit' enabled, or 'Work Orders — Create & Edit'")),
   ("Tech plan, Phase 3 browser walk", "From a work order → New Work Order → add customer **as a user holding only 'Work Orders — Create & Edit'**: the dialog stays open (no Access Denied) and lists reps (D14).")])

C("S5-15", "S5", "The Summary export has no Sales Type column and rep rows leave it blank",
  [ADMIN, REPS2, CUST, WO('it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}'),
   START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide")],
  ["Export the Summary CSV and look at its columns.",
   "Export the Expanded CSV and read the Sales Type cell on {Sales-rep-A}'s representative row and on the totals row."],
  ["Step 1: the Summary export has no Sales Type column.",
   "Step 2: the Sales Type cell is blank on the representative row and on the totals row; only invoice rows carry Labor, Parts, Part Sales or \"Labor, Parts\"."],
  ["S5-R23", ("Tech plan, export column", "in `expanded()` only, never in `summary()`."),
   ("Tech plan, Expanded export values", "\"Labor\" / \"Parts\" / \"Part Sales\" / \"Labor, Parts\" (blank on rep and total rows).")])

C("S5-16", "DATA", "Line fees stay with their side and a processing fee is shared by size",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 3.00 hours at $100.00 ($300.00) with a labor-line discount of $30.00, one part sold at $100.00 with a part-line fee of $10.00, and a whole-invoice fee of $38.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   WO_START],
  ["Invoice {Work-order-1}.",
   "Open Reports > Sales By Representative for today with Show Unassigned on and the Sales Type column on.",
   "Read the Labor row.",
   "Read the Parts row.",
   "Add the two rows' subtotals."],
  ["Step 1: the invoice total before tax is $418.00 (300.00 − 30.00 + 100.00 + 10.00 + 38.00).",
   "Step 2: two rows show for the invoice.",
   "Step 3: Labor row: labor $270.00 after its own discount, and its share of the whole-invoice fee in its Adjustments column, $27.00 (270 ÷ 380 × 38); subtotal $297.00.",
   "Step 4: Parts row: parts $110.00 after its own fee, and its share of the whole-invoice fee in its Adjustments column, $11.00 (110 ÷ 380 × 38); subtotal $121.00.",
   "Step 5: $297.00 + $121.00 = $418.00, the invoice total before tax."],
  ["S5-R4", "S5-R5", "S5-R6", AQ(22),
   ("Tech plan, line fees and discounts", "Functional test: an invoice with a labor-line discount and a part-line fee credits each to its own row")])

C("S5-17", "DATA", "Every report row adds up to the report totals to the cent",
  [ADMIN, REPS2, ("Today {Location-A} has at least three invoices: one split work order, one work order with one person on both sides and one part sale.", None),
   START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on")],
  ["Add up every invoice row's Labor Invoiced, Parts Invoiced, Shop Supplies and Hrs Invoiced by hand.",
   "Compare each sum with the representatives' summary rows and the report totals."],
  ["Step 1: you have the four sums.",
   "Step 2: each representative's summary row equals the sum of its invoice rows, and the report totals equal the sum of all invoice rows, to the cent (hours to two decimals)."],
  ["S5-R16", "S5-R14", ("Tech plan, rounding", "Σ rows = totals holds to the cent.")])

C("S7-04", "S7", "The Audit Log finds an entry by the Parts person's name",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}, and the Parts side was changed to {Sales-rep-B} today'), WO_START],
  ["Open the work order's menu and click Audit Log.",
   "Search the log for {Sales-rep-B}'s name."],
  ["Step 1: the log opens.",
   "Step 2: the \"Sales representative changed\" entry that set Parts to {Sales-rep-B} is found."],
  ["S7-R3", ("Tech plan, Phase 5 log search", "MODIFY `Application/Service/History/WorkOrderHistorySearch.php`: add `originalPartsSalesRepName` and `newPartsSalesRepName` to the searchable fields.")])

C("S2-13", "S2", "Moving lines into an existing work order does not change its reps",
  [ADMIN, REPS3, CUST,
   ('Work order {Work-order-1} for {Customer-A} has two approved lines and Labor {Sales-rep-A}, Parts {Sales-rep-B}; work order {Work-order-2} for {Customer-A} has one Sales Representative {Sales-rep-C}.',
    "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   WO_START],
  ["Move one line of {Work-order-1} to the existing work order {Work-order-2}.",
   "Open {Work-order-2}.",
   "Open {Work-order-1}."],
  ["Step 1: the line moves.",
   "Step 2: {Work-order-2} still has one Sales Representative, {Sales-rep-C}.",
   "Step 3: {Work-order-1} still has Labor {Sales-rep-A} and Parts {Sales-rep-B}."],
  ["S4-R29", ("Tech plan, Phase 6 split and move", "Moving lines to an EXISTING target WO does not touch reps.")])
