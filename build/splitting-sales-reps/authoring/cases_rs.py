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

# 22 Oct 2026, Rule 136 split: a representative leaving the report when the Sales Type filter excludes their rows (S8-R2) and the Sales
# Type column header not sorting (SBR spec S11-R6) are separate behaviours; S8-06b uses the same records, which neither part changes.
SPLIT_TODAY = ("Today {Sales-rep-A} holds only the Labor side of one invoiced split work order, and {Sales-rep-B} holds its Parts side; neither has other invoices today.", None)
C("S8-06", "S8", "A rep with no invoice of the chosen Sales Type leaves the report",
  [ADMIN, REPS2, CUST, SPLIT_TODAY, START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on")],
  ["Select only \"Parts\" in the Sales Type filter.",
   "Select only \"Labor\"."],
  ["Step 1: {Sales-rep-A} disappears (no blank row); {Sales-rep-B} shows with the Parts row.",
   "Step 2: {Sales-rep-A} shows with the Labor row and {Sales-rep-B} disappears."],
  ["S8-R2", SBR("S5-R1")])

C("S8-06b", "S8", "The Sales Type column header does not sort the report",
  [ADMIN, REPS2, CUST, SPLIT_TODAY, START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on")],
  ["Click the Sales Type column header."],
  ["Step 1: nothing happens; the Sales Type column cannot be sorted."],
  [SBR("S11-R6")], stories=[8])

C("S8-07", "S8", "Going back from an invoice keeps the Sales Type selection",
  [ADMIN, REPS2, CUST, ("Today has at least one invoiced split work order with Labor {Sales-rep-A} and Parts {Sales-rep-B}.", None), SBR_OPEN],
  ["Select only \"Parts\" in the Sales Type filter.",
   "Expand {Sales-rep-B}.",
   "Open the invoice from {Sales-rep-B}'s row.",
   "Press the browser's back button."],
  ["Step 1: the filter reads \"Sales Type: Parts\".",
   "Step 2: {Sales-rep-B}'s invoice rows show.",
   "Step 3: the invoice opens.",
   "Step 4: the report returns with \"Sales Type: Parts\" still selected, {Sales-rep-B} still expanded and the same scroll position, without a full reload."],
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

# 22 Oct 2026, Rule 136 split: rows collapsing when Sales Type changes (SBC spec S8-R20) and the choice surviving Back (SBC spec S9-R3)
# are separate behaviours; both read the same records and change none.
SBC_TWO = ("Today {Customer-A} has an invoiced part sale and an invoiced work order.", None)
C("S8-09", "S8", "Changing Sales Type on Sales By Customer collapses expanded rows",
  [ADMIN, CUST, SBC_TWO, SBC_OPEN],
  ["Expand {Customer-A}'s row.",
   "Select only \"Service Sales\"."],
  ["Step 1: the row expands.",
   "Step 2: every expanded row collapses and {Customer-A} shows only the work order's figures."],
  [SBC("S8-R20")], stories=[8])

C("S8-09b", "S8", "Sales By Customer keeps its Sales Type choice when you go back",
  [ADMIN, CUST, SBC_TWO, SBC_OPEN],
  ["Select only \"Service Sales\".",
   "Expand {Customer-A}'s row.",
   "Open the work order's invoice from {Customer-A}'s row.",
   "Press the browser's back button."],
  ["Step 1: the filter reads \"Sales Type: Service Sales\".",
   "Step 2: the row expands.",
   "Step 3: the invoice opens.",
   "Step 4: the report returns with \"Sales Type: Service Sales\" still selected."],
  [SBC("S9-R3"), "S8-R8"], stories=[8])

# 22 Oct 2026, Rule 136 split: where the Customer filter sits (SBC spec S18-R1) and its search following the Sales Type choice (S18-R2)
# are separate behaviours; S8-10b needs no records.
C("S8-10", "S8", "The Customer filter searches only within the chosen Sales Type",
  [ADMIN, ("Today customer {Customer-A} has only an invoiced part sale and customer {Customer-B} only an invoiced work order; both names start with the same text, {Search-A}.", "For example: {Customer-A} is ZZAUTOTEST SSR Parts Only, {Customer-B} is ZZAUTOTEST SSR Service Only and {Search-A} is ZZAUTOTEST SSR."), SBC_OPEN],
  ["Select only \"Part Sales\" in the Sales Type filter.",
   "Open the Customer filter.",
   "Type {Search-A}."],
  ["Step 1: only Part Sales is ticked.",
   "Step 2: the Customer filter opens.",
   "Step 3: {Customer-A} is offered and {Customer-B} is not, because the search follows the Sales Type selection."],
  [SBC("S18-R2")], stories=[8])

C("S8-10b", "S8", "The Customer filter sits between Sales Type and Location",
  [ADMIN, SBC_OPEN],
  ["Look at the toolbar."],
  ["Step 1: the Customer filter sits between the Sales Type filter and the Location filter."],
  [SBC("S18-R1")], stories=[8])

# 22 Oct 2026, Rule 136 split: each report's filter on a touch screen is its own behaviour with its own requirement (SBR spec S17-R1,
# SBC spec S21-R1).
C("S8-11", "S8", "Sales By Representative's Sales Type filter works on a touch screen",
  [ADMIN, START("Reports > Sales By Representative is open on a phone or tablet (a touch screen with no mouse pointer)")],
  *SR(("Tap the Sales Type filter.", "the filter opens on tap."),
      ("Untick \"Part Sales\".", "the filter reads \"Sales Type: Labor, Parts\".")),
  ["S8-R3", SBR("S17-R1")])

C("S8-11b", "S8", "Sales By Customer's Sales Type filter works on a touch screen",
  [ADMIN, START("Reports > Sales By Customer is open on a phone or tablet (a touch screen with no mouse pointer)")],
  *SR(("Tap the Sales Type filter.", "the filter opens on tap."),
      ("Untick \"Service Sales\".", "the filter reads \"Sales Type: Part Sales\".")),
  ["S8-R8", SBC("S21-R1")])

C("REL-15", "REL", "Reversed invoices stay out of Sales By Customer with both types selected",
  [ADMIN, CUST, ("Today {Customer-A} has one invoiced work order and one invoice that was reversed.", None), SBC_OPEN],
  ["Make sure both Sales Type options are selected and read {Customer-A}'s row."],
  ["Step 1: only the invoiced work order counts; the reversed invoice is not a row and adds nothing to any count or total."],
  ["S8-N1", SBC("S7-N2")], stories=[8])

C("REL-16", "REL", "Part sale rows show a dash in the labor columns and the totals do not change",
  [ADMIN, REPS2, CUST, ("{Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.", None),
   ("Part sale {Part-sale-1} (one part at $80.00) and work order {Work-order-1} (one labor line of 2.00 hours at $100.00 an hour) for {Customer-A} both have Sales Representative {Sales-rep-A}, and both were invoiced today.", "For example: {Part-sale-1} is P-30001 and {Work-order-1} is S2-40001."),
   SBR_TODAY()],
  *SR(EXPAND("{Sales-rep-A}", "on {Part-sale-1}'s row Labor Delta, Labor Invoiced and Labor Margin show a dash where the report used to show 0.00 and $0.00. {Sales-rep-A}'s summary row reads Labor Invoiced $200.00 and Parts Invoiced $80.00, the same totals as before the release.")),
  [("Release day", prd_line("One display change on Sales By Representative")), "S5-R15b", AQ(39)], stories=[5])
