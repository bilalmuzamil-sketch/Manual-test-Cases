"""Cases for testable behaviour the updated report specs add for this feature (report-specs/REPORT-SPECS-REVIEW-2026-10-19.md, ADD rows)."""
import re, os
from ssr_lib import C, P, prd_line, AQ
from common import *

def spec(path, code):
    for line in open(f"{P}/report-specs/{path}").read().split("\n"):
        m = re.match(r"^-?\s*" + re.escape(code) + r":\s*(.*)$", line)
        if m: return m.group(1).strip()
    raise KeyError(code)
SBR = lambda c: (f"Sales By Representative spec, {c}", spec("SBR-585629698-v28-2026-10-19.txt", c))
SBC = lambda c: (f"Sales By Customer spec, {c}", spec("SBC-577634305-v21-2026-10-19.txt", c))
SBR_OPEN = START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on")
SBC_OPEN = START("Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide")

C("S8-06", "S8", "A rep with no invoice of the chosen Sales Type leaves the report",
  [ADMIN, REPS2, CUST,
   ("Today {Sales-rep-A} holds only the Labor side of one invoiced split work order, and {Sales-rep-B} holds its Parts side; neither has other invoices today.", None),
   SBR_OPEN + " The Sales Type column is on"],
  ["Select only \"Parts\" in the Sales Type filter.",
   "Click the Sales Type column header.",
   "Select only \"Labor\"."],
  ["Step 1: {Sales-rep-A} disappears (no blank row); {Sales-rep-B} shows with the Parts row.",
   "Step 2: nothing happens; the Sales Type column cannot be sorted.",
   "Step 3: {Sales-rep-A} shows with the Labor row and {Sales-rep-B} disappears."],
  ["S8-R2", SBR("S5-R1"), SBR("S11-R6")])

C("S8-07", "S8", "Going back from an invoice keeps the Sales Type selection",
  [ADMIN, REPS2, CUST, ("Today has at least one invoiced split work order with Labor {Sales-rep-A} and Parts {Sales-rep-B}.", None), SBR_OPEN],
  ["Select only \"Parts\" in the Sales Type filter and expand {Sales-rep-B}.",
   "Open the invoice from {Sales-rep-B}'s row.",
   "Press the browser's back button."],
  ["Step 1: the filter reads \"Sales Type: Parts\" and {Sales-rep-B}'s invoice rows show.",
   "Step 2: the invoice opens.",
   "Step 3: the report returns with \"Sales Type: Parts\" still selected, {Sales-rep-B} still expanded and the same scroll position, without a full reload."],
  [SBR("S12-R3a")], stories=[8])

C("S8-08", "S8", "Sales By Customer's Sales Type menu has Select all and Clear selection",
  [ADMIN, SBC_OPEN],
  ["Open the Sales Type filter on first load.",
   "Click \"Clear selection\".",
   "Click \"Select all\"."],
  ["Step 1: \"Part Sales\" and \"Service Sales\" each have a checkbox and both are ticked; a \"Select all\" row is above them and \"Clear selection\" at the bottom.",
   "Step 2: both options are cleared and the filter reads \"Sales Type: No sales\".",
   "Step 3: both options are ticked again and the filter reads \"Sales Type: All Sales\"."],
  ["S8-R7", "S8-R8", SBC("S3-R2"), SBC("S3-R3")])

C("S8-09", "S8", "Changing Sales Type on Sales By Customer collapses rows and survives Back",
  [ADMIN, CUST, ("Today {Customer-A} has an invoiced part sale and an invoiced work order.", None), SBC_OPEN],
  ["Expand {Customer-A}'s row.",
   "Select only \"Service Sales\".",
   "Expand {Customer-A} again and open the work order's invoice from it.",
   "Press the browser's back button."],
  ["Step 1: the row expands.",
   "Step 2: every expanded row collapses and {Customer-A} shows only the work order's figures.",
   "Step 3: the invoice opens.",
   "Step 4: the report returns with \"Sales Type: Service Sales\" still selected."],
  [SBC("S8-R20"), SBC("S9-R3")], stories=[8])

C("S8-10", "S8", "The Customer filter sits after Sales Type and searches within it",
  [ADMIN, ("Today customer {Customer-A} has only an invoiced part sale and customer {Customer-B} only an invoiced work order; both names start with the same text, {Search-A}.", "For example: {Customer-A} is ZZAUTOTEST SSR Parts Only, {Customer-B} is ZZAUTOTEST SSR Service Only and {Search-A} is ZZAUTOTEST SSR."), SBC_OPEN],
  ["Look at the toolbar.",
   "Select only \"Part Sales\", open the Customer filter and type {Search-A}."],
  ["Step 1: the Customer filter sits between the Sales Type filter and the Location filter.",
   "Step 2: {Customer-A} is offered and {Customer-B} is not, because the search follows the Sales Type selection."],
  [SBC("S18-R1"), SBC("S18-R2")], stories=[8])

C("S8-11", "S8", "Both reports' Sales Type filters work on a touch screen",
  [ADMIN, START("Reports > Sales By Representative is open on a phone or tablet (a touch screen with no mouse pointer)")],
  ["Tap the Sales Type filter and untick \"Part Sales\".",
   "Open Reports > Sales By Customer, tap the Sales Type filter and untick \"Service Sales\"."],
  ["Step 1: the filter opens on tap and reads \"Sales Type: Labor, Parts\".",
   "Step 2: the filter opens on tap and reads \"Sales Type: Part Sales\"."],
  ["S8-R3", "S8-R8", SBR("S17-R1"), SBC("S21-R1")])

C("REL-15", "REL", "Reversed invoices stay out of Sales By Customer with both types selected",
  [ADMIN, CUST, ("Today {Customer-A} has one invoiced work order and one invoice that was reversed.", None), SBC_OPEN],
  ["Make sure both Sales Type options are selected and read {Customer-A}'s row."],
  ["Step 1: only the invoiced work order counts; the reversed invoice is not a row and adds nothing to any count or total."],
  ["S8-N1", SBC("S7-N2")], stories=[8])

C("REL-16", "REL", "Part sale rows show a dash in the labor columns and the totals do not change",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ("Part sale {Part-sale-1} (one part at $80.00) and work order {Work-order-1} (one labor line of 2.00 hours at $100.00 an hour) for {Customer-A} both have Sales Representative {Sales-rep-A}.", "For example: {Part-sale-1} is P-30001 and {Work-order-1} is S2-40001."),
   START("the Part Sales page is open in a desktop browser at least 1024 px wide")],
  ["Invoice {Part-sale-1} and {Work-order-1}.",
   "Open Reports > Sales By Representative for today and read the part sale's row.",
   "Read {Sales-rep-A}'s Labor Invoiced total and Parts Invoiced total."],
  ["Step 1: both are invoiced.",
   "Step 2: Labor Delta, Labor Invoiced and Labor Margin show a dash where the report used to show 0.00 and $0.00.",
   "Step 3: Labor Invoiced is $200.00 and Parts Invoiced is $80.00, the same totals as before the release."],
  [("Release day", prd_line("One display change on Sales By Representative")), "S5-R15b", AQ(39)], stories=[5])
