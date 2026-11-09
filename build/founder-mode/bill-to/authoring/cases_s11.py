"""Story 11 — Reverse and invoice again (SV-12313): Reverse as today, the Bill To unlocked after it, invoicing again to the current Bill To
with its current term and PO rule, the same invoice number, Reverse refused while a payment is applied, and a deposit under the wrong
Bill To reversed and taken again under the new one."""
from bt_lib import C
from common import *

S = "S11"
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer, on the Net 30 credit term")
INVB = wo(1, "A", "invoiced today (no payment, deposit or credit applied)", "B")
REV = "Reverse the invoice."

C("S11-01", S, "Reverse removes the invoice and puts the work order back to Complete",
  [ADMIN, A, B, INVB],
  [OPEN_WO, FIN, REV],
  [["Work order 1 opens for customer A, with status Invoiced."], ["The Finance tab lists the invoice, billed to customer B."],
   ["The invoice is removed.", "Work order 1's status is Complete.", "Create Invoice shows again."]],
  ["S11-R1", "T-REV", "SBA-REV", "OOS-14"])
C("S11-02", S, "After Reverse the Bill To can be changed",
  [ADMIN, A, B, cust("C"), INVB],
  [OPEN_WO, FIN, REV, EXPAND, CLICK_BT, "Pick customer C in the list."],
  [["Work order 1 opens for customer A, with status Invoiced."], ["The Finance tab lists the invoice."], ["Work order 1 is back to Complete."],
   [bt_reads("B")], ["The list opens: the field is unlocked."], [bt_reads("C")]],
  ["S11-R2", "S5-R8", "SBA-AGAIN"])
C("S11-03", S, "Invoicing again bills the new payer with its own term and PO rule",
  [ADMIN, A, B, cust("C", ", the new payer, on the Net 15 credit term, with PO is required on"), INVB],
  [OPEN_WO, FIN, REV, EXPAND, CLICK_BT, "Pick customer C in the list.", FIN, "Type a purchase order number in Customer PO.", CREATE_INV,
   "Open the new invoice's document."],
  [["Work order 1 opens for customer A, with status Invoiced."], ["The Finance tab lists the invoice."], ["Work order 1 is back to Complete."],
   [bt_reads("B")], ["The list opens."], [bt_reads("C")], ["The Finance tab shows Customer PO and Create Invoice."], ["Customer PO shows the number."],
   ["The invoice is created."],
   ["The Bill To block names customer C.", "The term is Net 15 and the due date is today plus 15 days."]],
  ["S11-R3", "SBA-AGAIN", "KD-LOCK"])
C("S11-04", S, "The invoice made again keeps the same invoice number",
  [ADMIN, A, B, cust("C"), INVB],
  [OPEN_WO, FIN, "Note the invoice number.", REV, EXPAND, CLICK_BT, "Pick customer C in the list.", FIN, CREATE_INV],
  [["Work order 1 opens for customer A, with status Invoiced."], ["The Finance tab lists the invoice."], ["The invoice number is noted."],
   ["Work order 1 is back to Complete."], [bt_reads("B")], ["The list opens."], [bt_reads("C")], ["The Finance tab shows Create Invoice."],
   ["The new invoice has the same invoice number as the one noted.", "Its Bill To block names customer C."]],
  ["S11-R4", "SBA-AGAIN", "KD-LOCK"])
C("S11-05", S, "Reverse is refused while a payment is applied",
  [ADMIN, A, B, wo(1, "A", "invoiced for $100.00 with a $40.00 payment from customer B applied", "B")],
  [OPEN_WO, FIN, REV],
  [["Work order 1 opens for customer A."], ["The Finance tab lists customer B's invoice with Balance $60.00 ($100.00 − $40.00)."],
   ["Reverse is refused, as it is today while a payment is applied.", "The invoice stays and work order 1 stays Invoiced."]],
  ["S11-N1", "SBA-REV"])
C("S11-06", S, "A deposit under the wrong payer is reversed and taken again under the new one",
  [ADMIN, A, cust("B", ", picked by mistake as the payer"), cust("C", ", the right payer"),
   wo(1, "A", "in Approved", "B", ", holding one $10.00 deposit taken under customer B")],
  [OPEN_WO, EXPAND, HOVER_BT, FIN, "Reverse the $10.00 deposit.", EXPAND, CLICK_BT, "Pick customer C in the list.", FIN, "Click Add Deposit.",
   "Pick a Payment Method.", "Enter 10.00 as the Deposit Amount.", "Click Submit Deposit.", "Open customer C's Deposits tab."],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['The tooltip reads "' + M1_ONE.format(amt="$10.00", c="B") + '"'], ["The Finance tab lists the $10.00 deposit."], ["The deposit is reversed."],
   [bt_reads("B")], ["The list opens: the field is unlocked."], [bt_reads("C")], ["The Finance tab shows Add Deposit."],
   ["The Create Deposit window opens."], ["The Payment Method is picked."], ["Deposit Amount shows 10.00."], ["The deposit is recorded."],
   ["The $10.00 deposit for work order 1 is listed on customer C's Deposits tab."]],
  ["S11-E1", "KD-DEP", "SBA-PICK"], note=NAME_NOTE)
C("S11-07", S, "Reverse is refused while a deposit is applied to the invoice",
  [ADMIN, A, B, wo(1, "A", "invoiced for $100.00 with a $30.00 deposit taken under customer B applied to the invoice", "B")],
  [OPEN_WO, FIN, REV],
  [["Work order 1 opens for customer A."], ["The Finance tab lists customer B's invoice with Balance $70.00 ($100.00 − $30.00)."],
   ["Reverse is refused, as it is today while a deposit is applied.", "The invoice stays and work order 1 stays Invoiced."]],
  ["S11-N1", "SBA-REV"])
C("S11-08", S, "Reverse is refused while a credit is applied to the invoice",
  [ADMIN, A, B, wo(1, "A", "invoiced for $100.00 with a $20.00 credit issued from it for a returned part", "B")],
  [OPEN_WO, FIN, REV],
  [["Work order 1 opens for customer A."], ["The Finance tab lists customer B's invoice and the $20.00 credit."],
   ["Reverse is refused, as it is today while a credit is applied.", "The invoice stays and work order 1 stays Invoiced."]],
  ["S11-N1", "SBA-REV"])
