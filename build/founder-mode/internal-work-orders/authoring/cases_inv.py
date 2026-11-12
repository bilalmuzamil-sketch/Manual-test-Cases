"""What must not change (Rule 96, skill 17): Internal Work Orders changes how some work orders close and post; billable work orders, part
sales, invoicing, payments, credits, the portal and the existing reports must behave exactly as before. Each case quotes the PRD's own
"as today" / "unchanged" / Out of Scope sentence (silence is not assumed: every behaviour here is one the PRD names as unchanged). The V1
baseline beyond the PRD (product source code) is not available to this worker: see REPORT.md, honest limit."""
from iwo_lib import C
from common import *

S = "INV"
C("INV-01", S, "A billable work order is created, priced and invoiced as before",
  [ADMIN, ON, REVIEW_OFF, cust("A", ", not flagged, with its own labor rate of $120.00 an hour and one asset, asset 1")],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Click Save in the New Work Order window.", "Add a labor line of 2.0 hours.", "Complete the line.", CREATE_INV],
  [["The New Work Order window opens."], ['No "Internal" badge shows; the "No Charge" checkbox shows unticked.'], ["Asset 1 is picked."],
   ["The work order opens with no badge and no orange header card."], ["The line shows Rate $120.00 and Total $240.00."], ["The line is Complete."],
   ["The invoice is created as today, with no confirmation window, for $240.00 plus the usual tax and shop supplies."]],
  ["S3-N1", "OOS-14", "S7-R8"])
C("INV-02", S, "Reverse on an invoiced billable work order works as before",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced", ", billable")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reverse".'],
  [["Work order 1 opens."], ["The invoice shows."], ['The menu offers "Reverse" and "Issue Credit", with no "Reopen Work Order".'], ["The invoice is reversed as today."]],
  ["S4-N2", "S3-N1"])
C("INV-03", S, "A part sale to an internal customer stays a billable part sale",
  [ADMIN, ON, icust("A")],
  ["Open Part Sales.", "Start a New Part Sale.", "Pick customer A.", "Add a part with a sell price."],
  [["Part Sales opens."], ["The new part sale opens."], ['No "Internal" badge shows next to customer A.'],
   ['The part shows its sell price; the part sale offers no Convert action, no "Close Work Order" and no NO CHARGE stamp, and is invoiced as today.']],
  ["OOS-12"])
C("INV-04", S, "Parts ordering, picking, clocking and approvals work on an internal work order",
  [ADMIN, ON, icust("A"), iwo(1, "A", "in Estimate", ", with one line that needs approval and one inventory part")],
  [OPEN_WO, "Approve the line.", "Pick the part from stock.", "Clock in a technician on the line.", "Clock the technician out."],
  [["Work order 1 opens."], ["The line is approved as on a billable work order."], ["The part is picked and leaves stock."], ["The clock-in starts."], ["The hours are recorded on the line."]],
  ["S2-R11", "OV-LOOK"])
C("INV-05", S, "Print Work Order of an internal work order prints as today",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, "Click Print Work Order."],
  [["Work order 1 opens."], ["The shop-floor print shows the lines and hours with no prices, as it does today."]],
  ["S2-R4"])
C("INV-06", S, "With the setting off a shop sees no change",
  [ADMIN, OFF, cust("A", ", with one asset, asset 1")],
  ["Open the work orders list.", "Click New Work Order.", "Pick customer A.", "Open Settings > Work Orders."],
  [['No "Classification" chip shows.'], ["The New Work Order window opens."], ['No "No Charge" checkbox and no badge show.'],
   ['The toggle "Internal Work Orders" is off and no hint lines show.']],
  ["KD-NOFLAG", "S2-N1", "S1-R1"])
C("INV-07", S, "A labor rate change prices billable work as before, internal work stays unpriced",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", f", with {LABOR_2H}"), cust("B", " with no labor rate of its own")],
  ["Change the test location's labor rate to $150.00 an hour.", OPEN_WO, "Create a new work order for customer B with a labor line of 2.0 hours."],
  [["The rate is saved."], ["Work order 1's labor line still shows 2.0 hours and no price: nothing is updated."], ["The new line shows Total $300.00 (2.0 h × $150.00), as today."]],
  ["S2-E1"])
C("INV-08", S, "The billable invoice document carries no stamp or category",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced", f", billable, with {LABOR_2H}")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ["The invoice shows its prices and totals as today, with no NO CHARGE stamp and no category line."]],
  ["S3-N1", "S12-R7"])
C("INV-09", S, "Inventory Value does not move when an internal work order closes",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}"), "Open Reports > Inventory Value and note its total."],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Open Reports > Inventory Value."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The work order is Closed."], ["The total is the noted figure: the parts left stock when they were picked."]],
  ["S9-R9", "KD-CLOSE"])
C("INV-10", S, "Deposits on a billable work order work as before",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable")],
  [OPEN_WO, FIN, "Click Add Deposit.", "Submit a deposit of $50.00."],
  [["Work order 1 opens."], ['"Add Deposit" is offered.'], ["The deposit window opens as today."], ["The $50.00 deposit is recorded as today."]],
  ["S2-N5", "OOS-14"])
C("INV-11", S, "Shop supplies on a billable work order follow the percentage as before",
  [ADMIN, ON, "Make sure the test location charges shop supplies at 10% of labor.", cust("A", ", with its own labor rate of $120.00 an hour and no shop supplies rule"),
   wo(1, "A", "Approved", f", billable, with {LABOR_2H}")],
  [OPEN_WO],
  [["Shop supplies reads $24.00 (10% of $240.00), as today."]],
  ["S10-R2", "OOS-14"])
C("INV-12", S, "Issue Credit on a billable invoice works as before",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced", ", billable, with one part sold at $60.00")],
  [OPEN_WO, FIN, "Click Issue Credit."],
  [["Work order 1 opens."], ["The invoice shows."], ["The part is listed at its $60.00 credit, editable, with the restocking fee option, as today."]],
  ["OOS-14", "S12-E7"])
C("INV-13", S, "A billable estimate in the portal shows its prices as before",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), "Have a portal contact for this test for customer A, whose portal login the tester can use.",
   wo(1, "A", "in Estimate", f", billable, with {LABOR_2H}, sent to the portal")],
  ["Sign in to the customer portal as customer A's contact.", "Open work order 1's estimate in the portal."],
  [["The portal opens."], ["The line card shows $240.00 and the price summary as today, with no stamp, no category and no changed-estimate notice."]],
  ["S2-R11", "OOS-14"])
C("INV-14", S, "Review before completion works on billable work orders as before",
  [ADMIN, ON, REVIEW_ON, cust("A"), wo(1, "A", "in Review, not yet marked reviewed, billable")],
  [OPEN_WO, "Click Mark Reviewed."],
  [['Work order 1 shows no "Create invoice" yet.'], ['"Create invoice" is offered, as today.']],
  ["S3-R7", "KD-REVIEW"])
