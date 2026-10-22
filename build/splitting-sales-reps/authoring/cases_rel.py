"""Release day and what must not change (Rule 96 invariants with a quotable PRD sentence; baseline/V1-BASELINE-AND-INVARIANTS.md)."""
from ssr_lib import C, prd_line, AQ
from common import *

PRE_REL = "AUTOMATION: HOLD - needs data and a report captured before the release is installed on the test site"

C("REL-01", "REL", "On release day an existing customer keeps its one representative",
  [ADMIN, REPS2,
   ("Before the release was installed, customer {Customer-A} had {Sales-rep-A} as its sales representative, customer {Customer-B} had none, and customer {Customer-C} had a representative who was no longer a user of the shop; you noted how the three customer pages looked.", "For example: {Customer-A} is ZZAUTOTEST SSR Before, {Customer-B} is ZZAUTOTEST SSR Before None and {Customer-C} is ZZAUTOTEST SSR Before Gone User."),
   START("the release is installed and {Customer-A}'s page is open in a desktop browser at least 1024 px wide")],
  ["Read {Customer-A}'s page.",
   "Open Edit Customer for {Customer-A}.",
   "Open {Customer-B}'s page.",
   "Open {Customer-C}'s page."],
  ["Step 1: \"Sales Representative\" reads {Sales-rep-A}; the page reads as before.",
   "Step 2: one \"Sales Representative\" field reading {Sales-rep-A}, with no Service Parts or Part Sales field.",
   "Step 3: \"Sales Representative\" reads \"Unassigned\" where it used to read \"N/A\".",
   "Step 4: \"Sales Representative\" reads \"Unassigned\"; this is one of the few customers whose representative was no longer a user of the shop."],
  ["S4-E1", "S4-R19", ("Release day", prd_line("Every existing customer keeps its one sales representative and is not split")), AQ(19)],
  marker=PRE_REL, stories=[4])

C("REL-02", "REL", "On release day an open work order keeps its one representative",
  [ADMIN, REPS2, CUST,
   ("Before the release was installed, work order {Work-order-1} for {Customer-A} was open (not invoiced) with {Sales-rep-A} as its sales representative.", "For example: {Work-order-1} is S2-39001."),
   START("the release is installed and {Work-order-1} is open in a desktop browser at least 1024 px wide")],
  ["Look at the work order card.",
   "Invoice {Work-order-1} and open Reports > Sales By Representative for today."],
  ["Step 1: one \"Sales Representative\" field reading {Sales-rep-A}; the card is not split and reads as before.",
   "Step 2: the whole invoice is credited to {Sales-rep-A} as one \"Labor, Parts\" row when the Sales Type column is on."],
  [("Release day", prd_line("Every open work order keeps its one sales representative on both sides")), "S5-R10",
   ("Feature Overview", prd_line("A shop that never adds a field sees one Sales Representative field"))],
  marker=PRE_REL, stories=[1, 5])

C("REL-03", "REL", "Sales By Representative for a past date shows the same totals",
  [ADMIN, ("Before the release was installed, you exported Sales By Representative (Expanded CSV) for a past date range with invoices, with Show Unassigned on.", "For example: the range is 1 Aug 2026 to 31 Aug 2026."),
   START("the release is installed and Reports > Sales By Representative is open in a desktop browser at least 1024 px wide")],
  ["Open the same date range with Show Unassigned on and turn the Sales Type column on.",
   "Compare each representative's summary row and the report totals with the export made before the release.",
   "Read the Sales Type of the past invoice rows."],
  ["Step 1: the report shows the same representatives.",
   "Step 2: every summary row and every total is the same as before, to the cent.",
   "Step 3: each past work-order invoice is one \"Labor, Parts\" row under the person it had before; part sales read \"Part Sales\"."],
  ["S5-E2", ("Release day", prd_line("Past invoices do not change.")),
   ("Story 5 context note", prd_line("* Context note: the report already adds up labor and parts separately on every invoice."))],
  marker=PRE_REL, stories=[5])

C("REL-04", "REL", "Invoices from before 29 Jul 2026 stay Unassigned on both sides",
  [ADMIN, ("{Location-A} has invoices dated before 29 Jul 2026.", "For example: invoices from June 2026."),
   START("Reports > Sales By Representative is open in a desktop browser at least 1024 px wide")],
  ["Set a date range before 29 Jul 2026 that holds invoices, turn Show Unassigned on and the Sales Type column on.",
   "Read the rows."],
  ["Step 1: the report shows the range.",
   "Step 2: those invoices are credited to Unassigned on both sides; no representative has been added to them."],
  ["S5-E2"], stories=[5])

C("REL-05", "REL", "Saved report columns reset once and an old Product Type link shows all types",
  [ADMIN, ("Before the release was installed, you changed the columns and the sort of Sales By Representative and bookmarked a link that narrowed it by Product Type.", None),
   START("the release is installed and you open Reports > Sales By Representative in the same browser, desktop width at least 1024 px")],
  ["Look at the columns and the sort.",
   "Change a column and the sort, leave the report and open it again.",
   "Open the link bookmarked before the release."],
  ["Step 1: the columns and the sort are back to the defaults, and the Sales Type column is off.",
   "Step 2: your new choices are kept; the reset happened only once.",
   "Step 3: the report opens with every Sales Type selected (\"Sales Type: All\")."],
  [("Release day", prd_line("Each user's saved column choices and sort on Sales By Representative reset once to the defaults."))],
  marker=PRE_REL, stories=[5, 8])

C("REL-06", "REL", "A Sales By Customer filter from before the release keeps its options",
  [ADMIN, ("Before the release was installed, you bookmarked Sales By Customer with only one Product Type option selected.", "For example: only the parts option selected."),
   START("the release is installed and the bookmark is ready in a desktop browser at least 1024 px wide")],
  ["Open the bookmarked Sales By Customer link.",
   "Open the Sales Type filter."],
  ["Step 1: the report opens with the same choice applied.",
   "Step 2: the same option is selected under its new name (for example only \"Part Sales\"), and the filter reads \"Sales Type: Part Sales\"."],
  ["S8-E1", "S8-R8", AQ(29)], marker=PRE_REL)

C("REL-07", "REL", "Imported work orders still have no sales representative",
  [ADMIN, ("{Location-A} has an imported work order, {Work-order-1}.", "For example: {Work-order-1} is an imported work order from the previous system."),
   START("{Work-order-1} is open in a desktop browser at least 1024 px wide")],
  ["Look at the work order card."],
  ["Step 1: there is no Sales Representative field and no + button; the imported work order looks as it did before."],
  [("Out of scope", prd_line("Imported work orders."))], stories=[1])

C("REL-08", "REL", "Customer invoice and estimate documents still show no representative",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'), WO_START],
  ["Open the customer-facing estimate document.",
   "Invoice the work order and open the customer-facing invoice document."],
  ["Step 1: the estimate shows no sales representative.",
   "Step 2: the invoice document shows no sales representative."],
  [("Out of scope", prd_line("The customer-facing invoice and estimate documents."))], stories=[5, 6])

C("REL-09", "REL", "Credit memos stay out of Sales By Representative",
  [ADMIN, REPS2, CUST, ("Today {Customer-A} has an invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and a credit memo of $20.00.", None),
   START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide")],
  ["Turn Show Unassigned on and read the rows for {Customer-A}."],
  ["Step 1: the work order's Labor and Parts rows show; the $20.00 credit memo is not in the report."],
  [("Out of scope", prd_line("Credit memos in Sales By Representative."))], stories=[5])

C("REL-10", "REL", "The Sales Follow-Up report is still not in the Reports menu",
  [ADMIN, START("any page is open in a desktop browser at least 1024 px wide")],
  ["Open the Reports menu and look for Sales Follow-Up."],
  ["Step 1: there is no Sales Follow-Up report in the menu."],
  [("Out of scope", prd_line("The Sales Follow-Up report."))], stories=[5])

C("REL-11", "REL", "No sales representative is sent to QuickBooks",
  [ADMIN, REPS2, CUST, ("{Location-A} is connected to a QuickBooks test company.", None), WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'), WO_START],
  ["Invoice {Work-order-1} and let it sync to QuickBooks.",
   "Open the invoice in QuickBooks."],
  ["Step 1: the invoice syncs.",
   "Step 2: no sales representative appears on the QuickBooks invoice."],
  [("Out of scope", prd_line("QuickBooks."))], stories=[5],
  marker="AUTOMATION: HOLD - needs access to a QuickBooks test company")

C("REL-12", "REL", "On a phone Lead Technician and Service Advisor keep today's arrow behaviour",
  [ADMIN, CUST, WO(), "Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer)."],
  ["Tap the card's edit button to expand it.",
   "Look at Lead Technician and Service Advisor without tapping them.",
   "Tap Lead Technician."],
  ["Step 1: the card expands with the same control as before.",
   "Step 2: they look as they do today: no arrow until tapped (while the Sales Representative field already shows its arrow).",
   "Step 3: the arrow shows once the field is tapped, and its dropdown opens as today."],
  ["S3-R4", "S3-R6"])

C("REL-13", "REL", "A user without Reports access still cannot open Sales By Representative",
  [('You are signed in as {User-B}, whose role does not have "Reports — Page Access", at {Location-A}.', "For example: {User-B} is ZZAUTOTEST SSR No Reports; {Location-A} is Staging Heavy Duty - 9919."),
   START("any page is open in a desktop browser at least 1024 px wide")],
  ["Look for Reports > Sales By Representative.",
   "Open the Sales By Representative report's address directly in the browser."],
  ["Step 1: the report is not offered.",
   "Step 2: the report does not open for {User-B}; neither the screen nor its exports are available."],
  [("Story 5 prerequisites", prd_line("User has 'Reports — Page Access' enabled. It governs the Sales By Representative report"))], stories=[5])

C("REL-14", "REL", "A work order that is never split is credited exactly as before",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   WO('it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; its one Sales Representative reads {Sales-rep-A}'), WO_START],
  ["Invoice {Work-order-1}.",
   "Open Reports > Sales By Representative for today with the Sales Type column off.",
   "Turn the Sales Type column on."],
  ["Step 1: the invoice is created.",
   "Step 2: {Sales-rep-A} has one row for the invoice with Labor Invoiced $200.00, Parts Invoiced $50.00, Parts Margin $20.00, all figures as before the release.",
   "Step 3: the same one row, with Sales Type \"Labor, Parts\"."],
  [("Feature Overview", prd_line("A shop that never adds a field sees one Sales Representative field")), "S5-R10",
   ("Story 5 context note", prd_line("* Context note: the report already adds up labor and parts separately on every invoice.")),
   ("Goals", prd_line("A shop that never splits sees no visible change."))], stories=[5])

# ---------------- 22 Oct 2026, tech plan pass (Rule 134): new cases ----------------
C("REL-17", "REL", "Filter labels on other reports read as before",
  [ADMIN, ("At least three locations are open to you: {Location-A}, {Location-B} and {Location-C}.", "For example: Staging Heavy Duty - 9919, QA Testing and ZZAUTOTEST SSR Third Location."),
   START("Reports > Parts Velocity is open in a desktop browser at least 1024 px wide")],
  ["Open a filter on the report that lets you tick several options (for example Location) and tick every option.",
   "Close the filter and read its label in the toolbar.",
   "Open the same filter again and untick options until exactly two remain ticked.",
   "Close the filter and read its label in the toolbar."],
  ["Step 1: every option is ticked.",
   "Step 2: the label reads \"All\" followed by the filter's own word, as before the release (for example \"All locations\").",
   "Step 3: two options are ticked.",
   "Step 4: the label reads the count and the filter's own word, as before the release (for example \"2 locations\"); it does not list the two option names the way the new Sales Type filter does."],
  [("Tech plan, decision D9", "None exist; the shared chip must not change on ~15 other screens."),
   ("Tech plan, Phase 1 browser walk", "any report other than SBC (e.g. `/reports/parts-velocity`) — every chip text unchanged (opt-in proof)."),
   ("Tech plan, Phase 1 filter-chip tests", "regression: a def without the flags still reads `All <noun>` / `<n> <noun>`.")],
  stories=[8])

C("REL-18", "REL", "A unit's invoice list and the invoice preview still open after a split",
  [ADMIN, REPS2, CUST,
   ("Customer {Customer-A} has a unit (vehicle), {Unit-A}.", "For example: {Unit-A} is ZZAUTOTEST SSR Truck 1."),
   ('Work order {Work-order-1} for {Customer-A} on {Unit-A} is open and not invoiced; it has one labor line and one part; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}.', "For example: {Work-order-1} is S2-40001."),
   WO_START],
  ["On {Work-order-1}'s Finance tab, open the invoice preview.",
   "Invoice {Work-order-1}.",
   "Open {Unit-A}'s page and its list of invoices."],
  ["Step 1: the preview opens with the work order's lines and totals, and no error message shows.",
   "Step 2: the invoice is created.",
   "Step 3: the list opens with no error message and includes {Work-order-1}'s new invoice."],
  [("Tech plan, non-functional requirement NFR-004", "Endpoints that select `i.*` from `invoice` must not leak the new BINARY(16) column into JSON (the SV-9496 regression class; `ListVehicleInvoices`)."),
   ("Tech plan, Phase 7 smoke check", "plus the vehicle invoices list on a vehicle that has a split invoice (must be 200), invoice preview, a part-sale invoice."),
   ("Tech plan, risk R-12", "Regressions to verify: the part-sale rep change, lock message and log are unchanged; part-sale invoices are captured as before; invoice preview works;")],
  stories=[5])

C("REL-19", "REL", "Log entries and history saved before the release read one representative",
  [ADMIN, REPS2, CUST,
   ("Before the release was installed, work order {Work-order-1} for {Customer-A} had its Sales Representative changed from {Sales-rep-A} to {Sales-rep-B}, which wrote a \"Sales representative changed\" entry, and a version of it was saved to its history with {Sales-rep-B}; it is still open and not invoiced.", "For example: {Work-order-1} is S2-39002."),
   START("the release is installed and {Work-order-1} is open in a desktop browser at least 1024 px wide")],
  ["Open the work order's menu, click Audit Log and find the entry written before the release.",
   "Close the log, open {Work-order-1}'s history and open the version saved before the release."],
  ["Step 1: the entry still reads \"Sales Representative: {Sales-rep-A} → {Sales-rep-B}\", one name on each side of the arrow, with no (Parts) or (Labor).",
   "Step 2: that version shows one \"Sales Representative\" field reading {Sales-rep-B} as plain text; it is not split."],
  ["S7-R2", "S2-R17",
   ("Tech plan, history log entry (section 5, 0.5)", "`null` split (every entry before this release) reads as not split."),
   ("Tech plan, frontend risks", "Old WO history snapshots lack `sales_rep_split`; treated as not split. Old history entries lack C4 fields; rendered as today.")],
  marker=PRE_REL, stories=[2, 7],
  note="The pre-release log entry exists only if Part Sales Update v1 (SV-10266, which adds that entry) was on the site before this release. If it was not, mark this case Blocked and say so.")
