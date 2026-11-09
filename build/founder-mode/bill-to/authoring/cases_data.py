"""Totals and balances follow the Bill To (Rule 116): the same money shown on every surface for the same records, with the arithmetic
written out. Payer B owes $210.00 for customer A's work and $95.50 for its own; customer A owes $40.00 for its own. Each case makes its
own records (Rule 137)."""
from bt_lib import C
from common import *

S = "DATA"
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer")
SET = ["Have a new work order for this test, work order 1, for customer A, invoiced today for $210.00, billed to customer B, unpaid.",
       "Have a new work order for this test, work order 2, for customer B, invoiced today for $95.50, that bills itself, unpaid.",
       "Have a new work order for this test, work order 3, for customer A, invoiced today for $40.00, that bills itself, unpaid."]

C("DATA-01", S, "The payer's balance is the same on its Invoices tab, A/R Aging and statement",
  [ADMIN, A, B] + SET,
  ["Open customer B's Invoices tab.", "Open the A/R Aging report for today.", "Open customer B's statement."],
  [["Work order 1's invoice ($210.00) and work order 2's invoice ($95.50) are listed.", "The balances add up to $305.50 ($210.00 + $95.50)."],
   ["Customer B's row shows $305.50.", "Customer A's row shows $40.00 (work order 3 only)."],
   ["Customer B's statement lists both invoices and a balance of $305.50."]],
  ["S10-R1", "CORE-3"])
C("DATA-02", S, "A part payment lowers the payer's balance the same way everywhere",
  [ADMIN, A, B] + SET,
  ["Open customer B's Invoices tab.", "Tick work order 1's invoice.", "Click New Payment.", "Enter 100.00 as the payment amount.", "Click Make Payment.",
   "Open the A/R Aging report for today.", "Open customer A's Invoices tab."],
  [["Both of customer B's invoices are listed."], ["Work order 1's invoice is ticked."], ["The New Customer Payment window opens."], ["The amount shows 100.00."],
   ["The payment is recorded.", "Work order 1's invoice shows Balance $110.00 ($210.00 − $100.00).", "Customer B's balances add up to $205.50 ($110.00 + $95.50 for work order 2)."],
   ["Customer B's row shows $205.50.", "Customer A's row still shows $40.00."],
   ["Only work order 3's invoice is listed, Balance $40.00: the payment did not touch customer A."]],
  ["S10-R1", "S10-R4", "KD-PAY"])
C("DATA-03", S, "A deposit taken under the payer reduces what the payer owes",
  [ADMIN, A, B, wo(1, "A", "in Approved, with a part sold at $210.00 and a $50.00 deposit taken under customer B,", "B")],
  [OPEN_WO, FIN, CREATE_INV, "Apply the $50.00 deposit to the invoice.", "Open customer B's Invoices tab."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the $50.00 deposit and Create Invoice."], ["The invoice for $210.00 is created."],
   ["The invoice's balance is $160.00 ($210.00 − $50.00)."], ["Work order 1's invoice shows Total $210.00 and Balance $160.00."]],
  ["S10-R2", "S10-R9", "SBA-DEP"])
C("DATA-04", S, "Sales stay with the customer the work was for",
  [ADMIN, A, B, "Make sure customer A and customer B have no other sales today."] + SET,
  ["Open the Sales By Customer report for today."],
  [["Customer A's sales read $250.00 ($210.00 for work order 1 + $40.00 for work order 3).",
    "Customer B's sales read $95.50 (work order 2 only): the $210.00 it owes for customer A's work is not counted as its sales."]],
  ["KD-REPORTS", "OOS-10", "GOAL-2", "KD-SPLIT", "CORE-2"])
