"""Story 18 — AccountingHub (SV-12320): the invoice under the payer, AR, aging and balances grouped by the payer, Reverse keeps the
reversal record and the re-issued invoice arrives as a new event, payments, deposits and credits under the payer, and the self-billed
invoice as today. The tester signs in to the AccountingHub company the test organization sends to. S18-R2 (message format, no screen)
is listed as not testable. Amounts exact (Rule 116)."""
from bt_lib import C
from common import *

S = "S18"
AH = "Use a test organization whose invoices go to AccountingHub, and sign in to its AccountingHub company in a second tab."
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer, which owes nothing else")
READY = "in Complete, ready to invoice,"

C("S18-01", S, "The invoice reaches AccountingHub under the payer",
  [ADMIN, AH, A, B, wo(1, "A", READY + " for $210.00,", "B")],
  [OPEN_WO, FIN, CREATE_INV, "In AccountingHub, open the invoice with work order 1's invoice number."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The AccountingHub invoice's customer is customer B.", "Its total is $210.00."]],
  ["S18-R1", "INT-2", "KD-AH"], marker="PO:accountinghub-change")
C("S18-02", S, "AccountingHub AR and aging group the invoice under the payer",
  [ADMIN, AH, A, B, wo(1, "A", "invoiced today for $210.00, unpaid", "B")],
  ["In AccountingHub, open the AR aging for today.", "Find customer B's row.", "Find customer A's row."],
  [["The AR aging opens."], ["Customer B's row shows $210.00 owed for work order 1's invoice in the current bucket, and customer B's balance is $210.00."],
   ["Customer A has no row, or a row with $0.00 for this invoice."]],
  ["S18-R3", "KD-AH"], marker="PO:accountinghub-change")
C("S18-03", S, "Reverse keeps the reversal in AccountingHub and the new invoice arrives as new",
  [ADMIN, AH, A, B, cust("C", ", the new payer"), wo(1, "A", "invoiced for $210.00 (no payment, deposit or credit applied)", "B")],
  [OPEN_WO, FIN, "Reverse the invoice.", EXPAND, CLICK_BT, "Pick customer C in the list.", FIN, CREATE_INV,
   "In AccountingHub, open the history of work order 1's invoice number."],
  [["Work order 1 opens for customer A."], ["The Finance tab lists the invoice."], ["Work order 1 is back to Complete."], [bt_reads("B")],
   ["The list opens."], [bt_reads("C")], ["The Finance tab shows Create Invoice."], ["The invoice is created again."],
   ["AccountingHub keeps the reversal record of the first invoice, under customer B.", "The new invoice arrived as a new event, under customer C."]],
  ["S18-R4", "KD-LOCK"], marker="PO:accountinghub-change")
C("S18-04", S, "Payments, deposits and credits reach AccountingHub under the payer",
  [ADMIN, AH, A, B, wo(1, "A", "in Approved, with a part sold at $210.00 and a $50.00 deposit taken under customer B,", "B")],
  [OPEN_WO, FIN, CREATE_INV, "Pay the $160.00 balance from customer B.", "In AccountingHub, open customer B's account."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the $50.00 deposit."], ["The invoice is created with $160.00 left to pay ($210.00 − $50.00)."],
   ["The payment is recorded and the invoice is paid."],
   ["Customer B's account shows the $50.00 deposit, the $210.00 invoice and the $160.00 payment.", "Customer A's account shows none of them."]],
  ["S18-R5", "KD-AH"], marker="PO:accountinghub-change")
C("S18-05", S, "A self-billed invoice reaches AccountingHub as today",
  [ADMIN, AH, cust("A", ", that bills itself"), wo(1, "A", READY + " for $90.00,")],
  [OPEN_WO, FIN, CREATE_INV, "In AccountingHub, open the invoice with work order 1's invoice number."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The AccountingHub invoice is on customer A for $90.00, as it would be today."]],
  ["S18-N1", "GOAL-4"])
