"""Story 6 — Change Customer with a Bill To (SV-12308): the Bill To follows when it was the old customer or the old customer's default,
a picked Bill To stays, the picked Bill To becoming the new customer, the deposit block only when the Bill To would change, and invoiced
documents (the invoice keeps its Bill To; after Reverse, invoicing again bills the new customer, as today)."""
from bt_lib import C, HOLD
from common import *

S = "S6"
CCB = "Click Change Customer (the two arrows at the top right of the Customer card)."
PICK_D = "Pick customer D."
CONFIRM = "Confirm the change."
STEPS = [OPEN_WO, EXPAND, CCB, PICK_D, CONFIRM]
R_OPEN = ["Work order 1 opens for customer A."]
R_PICKER = ["The customer picker opens."]
R_D = ["Customer D is picked."]
D_DEF = cust("D", ", the new customer, whose Bill Invoices To is saved as customer E")
D_SELF = cust("D", ", the new customer, that bills itself")
E = cust("E", ", customer D's payer")

C("S6-01", S, "A self-billed work order follows the new customer's saved default",
  [ADMIN, cust("A", ", that bills itself"), E, D_DEF, wo(1, "A")],
  STEPS,
  [R_OPEN, [BT_SELF], R_PICKER, R_D, ["The work order's customer is customer D.", bt_reads("E")]],
  ["S6-R1", "SBA-CC"])
C("S6-02", S, "A self-billed work order bills the new customer when it has no default",
  [ADMIN, cust("A", ", that bills itself"), D_SELF, wo(1, "A")],
  STEPS,
  [R_OPEN, [BT_SELF], R_PICKER, R_D, ["The work order's customer is customer D.", '"Bill To" reads "This customer": customer D now pays.']],
  ["S6-R1", "KD-CC"])
C("S6-03", S, "A Bill To that came from the old default follows the new default",
  [ADMIN, cust("B", ", customer A's payer"), cust("A", ", whose Bill Invoices To is saved as customer B"), E, D_DEF,
   wo(1, "A", "in Estimate", "B", ", created after customer A's default was saved, so its Bill To came from the default")],
  STEPS,
  [R_OPEN, [bt_reads("B")], R_PICKER, R_D, ["The work order's customer is customer D.", bt_reads("E")]],
  ["S6-R1", "SBA-CC"])
C("S6-04", S, "A Bill To from the old default becomes the new customer when it has none",
  [ADMIN, cust("B", ", customer A's payer"), cust("A", ", whose Bill Invoices To is saved as customer B"), D_SELF,
   wo(1, "A", "in Estimate", "B", ", created after customer A's default was saved, so its Bill To came from the default")],
  STEPS,
  [R_OPEN, [bt_reads("B")], R_PICKER, R_D, ["The work order's customer is customer D.", '"Bill To" reads "This customer".']],
  ["S6-R1"])
C("S6-05", S, "A Bill To picked on purpose stays after Change Customer",
  [ADMIN, cust("A", ", that bills itself"), cust("C", ", picked by hand as the payer"), E, D_DEF,
   wo(1, "A", "in Estimate", "C", ", where customer C was picked on the Customer card")],
  STEPS,
  [R_OPEN, [bt_reads("C")], R_PICKER, R_D, ["The work order's customer is customer D.", bt_reads("C"), "Customer D's default, customer E, was not applied."]],
  ["S6-R2", "SBA-CC"])
C("S6-06", S, "Changing to the customer that was the picked Bill To makes it self-billed",
  [ADMIN, cust("A", ", that bills itself"), cust("D", ", picked by hand as the payer, that bills itself"),
   wo(1, "A", "in Estimate", "D", ", where customer D was picked on the Customer card")],
  STEPS,
  [R_OPEN, [bt_reads("D")], R_PICKER, R_D, ["The work order's customer is customer D.", '"Bill To" reads "This customer".']],
  ["S6-E1"])
C("S6-07", S, "With a deposit held, Change Customer that keeps the Bill To goes through",
  [ADMIN, cust("A", ", that bills itself"), cust("C", ", picked by hand as the payer"), D_SELF,
   wo(1, "A", "in Approved", "C", ", where customer C was picked on the Customer card, holding a $10.00 deposit taken under customer C")],
  STEPS,
  [R_OPEN, [bt_reads("C")], ["The Change Customer button is enabled and the customer picker opens."], R_D,
   ["The change goes through: the work order's customer is customer D.", bt_reads("C"), "The $10.00 deposit is still on customer C's Deposits tab."]],
  ["S6-R3", "SBA-CC", "KD-DEP"])
C("S6-08", S, "With a deposit held, Change Customer that would move the Bill To is refused",
  [ADMIN, cust("A", ", that bills itself"), D_SELF, wo(1, "A", "in Approved", None, ", holding a $10.00 deposit taken under customer A")],
  STEPS,
  [R_OPEN, [BT_SELF], ["The Change Customer button is enabled and the customer picker opens."], R_D,
   ["The change is refused with the deposit refusal shown today for Change Customer.", "The work order's customer is still customer A.",
    '"Bill To" still reads "This customer".']],
  ["S6-R3", "SBA-CC"])
C("S6-09", S, "After Change Customer and Reverse, invoicing again bills the new customer",
  [ADMIN, cust("A", ", that bills itself"), D_SELF, wo(1, "A", "invoiced (no payment, deposit or credit applied)")],
  [OPEN_WO, CCB, PICK_D, CONFIRM, FIN, "Reverse the invoice.", CREATE_INV],
  [R_OPEN, R_PICKER, R_D, ["The work order's customer is customer D."],
   ["The existing invoice's Bill To block still names customer A: the invoice keeps its Bill To."],
   ["The invoice is removed and work order 1 goes back to Complete."],
   ["The new invoice's Bill To block names customer D: invoicing again bills the new customer, as today."]],
  ["S6-N1", "KD-CC", "SBA-CC"])
C("S6-10", S, "Change Customer on an invoiced work order keeps the invoice's payer",
  [ADMIN, cust("A"), cust("C", ", picked by hand as the payer"), D_SELF,
   wo(1, "A", "invoiced (no payment, deposit or credit applied)", "C", ", where customer C was picked on the Customer card")],
  [OPEN_WO, CCB, PICK_D, CONFIRM, FIN],
  [R_OPEN, R_PICKER, R_D, ["The work order's customer is customer D.", bt_reads("C")],
   ["The invoice's Bill To block still names customer C."]],
  ["S6-N1", "S6-R2"])
