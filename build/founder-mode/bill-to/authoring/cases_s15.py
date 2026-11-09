"""Story 15 — Internal and No Charge work orders (SV-12317). Every case is BLOCKED ON RELEASE of Internal Work Orders (SV-11665): the
banner opens its Preconditions and it is held out of any run until SV-11665 ships (QA lead, 4 Nov 2026; example C913771). S15-N1
(nothing to act on before SV-11665) has no screen and is listed as not testable."""
from bt_lib import C, IWO_BANNER as BAN, IWO_HOLD as H
from common import *

S = "S15"
INTERNAL = cust("I", ", an internal customer")

C("S15-01", S, "An internal work order has no Bill To field",
  [ADMIN, INTERNAL, wo(1, "I")],
  [OPEN_WO, EXPAND],
  [["Work order 1 opens for customer I as an internal work order."], ["The Customer card shows Authorizer.", 'No "Bill To" field shows.']],
  ["S15-R1", "SBA-PICK", "SBA-INV"], banner=BAN, marker=H)
C("S15-02", S, "Converting to No Charge hides the Bill To and resets it to the customer",
  [ADMIN, cust("A", ", that bills itself"), cust("C", ", picked by hand as the payer"),
   wo(1, "A", "in Approved", "C", ", where customer C was picked on the Customer card")],
  [OPEN_WO, "Convert work order 1 to No Charge.", EXPAND, "Convert work order 1 back to billable.", EXPAND],
  [["Work order 1 opens for customer A."], ["Work order 1 is No Charge."], ['No "Bill To" field shows.'], ["Work order 1 is billable again."],
   ['"Bill To" reads "This customer": the No Charge conversion reset it to customer A, and customer C did not come back.']],
  ["S15-R1", "S15-R2", "S15-R3"], banner=BAN, marker=H)
C("S15-03", S, "Converting back to billable starts from the customer's saved default",
  [ADMIN, cust("B", ", customer A's payer"), cust("A", ", whose Bill Invoices To is saved as customer B"), cust("C", ", picked by hand as the payer"),
   wo(1, "A", "in Approved", "C", ", where customer C was picked on the Customer card")],
  [OPEN_WO, "Convert work order 1 to No Charge.", "Convert work order 1 back to billable.", EXPAND],
  [["Work order 1 opens for customer A."], ["Work order 1 is No Charge."], ["Work order 1 is billable again."], [bt_reads("B")]],
  ["S15-R3"], banner=BAN, marker=H)
C("S15-04", S, "Changing to an internal customer removes the Bill To",
  [ADMIN, cust("A"), cust("C", ", picked by hand as the payer"), INTERNAL,
   wo(1, "A", "in Approved", "C", ", where customer C was picked on the Customer card")],
  [OPEN_WO, "Click Change Customer (the two arrows at the top right of the Customer card).", "Pick customer I.", "Confirm the change.", EXPAND],
  [["Work order 1 opens for customer A."], ["The customer picker opens."], ["Customer I is picked."],
   ["Work order 1's customer is customer I and it is internal."], ['No "Bill To" field shows: the Bill To was reset to customer I.']],
  ["S15-R2", "S15-R5"], banner=BAN, marker=H)
C("S15-05", S, "An internal customer is never offered as a Bill To",
  [ADMIN, cust("A", ", that bills itself"), INTERNAL, wo(1, "A")],
  [OPEN_WO, EXPAND, "Type customer I's name in the Bill To field."],
  [["Work order 1 opens for customer A."], [BT_SELF], ['Only "[customer A\'s name] (this customer)" is listed: customer I is not offered.']],
  ["S15-R4"], banner=BAN, marker=H, note=NAME_NOTE)
C("S15-06", S, "Billing a payer does not make a billable work order internal",
  [ADMIN, cust("A", ", a billable customer that bills itself"), cust("B", ", a billable payer"), wo(1, "A", "in Approved")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Work order 1 opens for customer A as a billable work order."], [BT_SELF], ["The list opens."],
   [bt_reads("B"), "Work order 1 is still billable: only customer A decides whether it is internal."]],
  ["S15-R5", "DEP-S15"], banner=BAN, marker=H)
