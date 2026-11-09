"""Story 10 — Receivables follow the Bill To (SV-12312): the receivable on the payer's Invoices tab, A/R Aging and statement; deposits on
the payer's account; a part sale returned-parts credit; one payment over several invoices across customers; the refusal of a payment
applied to another customer's invoice (two tabs) and of a payment using another customer's deposit or credit (held); the "Service For"
column (shown, blank, hidden, decided before a search); the customer's own tab; revenue reduced by a credit; before-release payments
(held for production). Amounts exact (Rule 116)."""
from bt_lib import C, HOLD, PRE_REL, UFS
from common import *

S = "S10"
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer")
INV_A = "Have a new work order for this test, work order 1, for customer A, invoiced for $210.00, billed to customer B, unpaid."

C("S10-01", S, "The invoice sits on the payer's Invoices tab, not the customer's",
  [ADMIN, A, B, INV_A],
  ["Open customer B's Invoices tab.", "Open customer A's Invoices tab."],
  [["Work order 1's invoice is listed with Total $210.00 and Balance $210.00."],
   ["Work order 1's invoice is not listed on customer A's tab, so it cannot be paid from customer A's side."]],
  ["S10-R1", "S10-N2", "CORE-3", "GOAL-1"])
C("S10-02", S, "A/R Aging shows the receivable under the payer",
  [ADMIN, A, B, INV_A, "Make sure customer A and customer B owe nothing else."],
  ["Open the A/R Aging report for today.", "Find customer B's row.", "Find customer A's row."],
  [["The report opens."], ["Customer B's row shows $210.00 owed (work order 1's invoice), in the bucket for today's invoice."],
   ["Customer A has no row, or a row with $0.00 owed: the receivable is customer B's."]],
  ["S10-R1"])
C("S10-03", S, "The payer's statement lists the invoice",
  [ADMIN, A, B, INV_A, "Make sure customer B owes nothing else."],
  ["Open customer B's statement.", "Open customer A's statement."],
  [["Customer B's statement lists work order 1's invoice for $210.00 and a balance of $210.00."],
   ["Customer A's statement does not list work order 1's invoice."]],
  ["S10-R1"])
C("S10-04", S, "A deposit is taken on the account of the current Bill To",
  [ADMIN, A, B, wo(1, "A", "in Approved", "B")],
  [OPEN_WO, FIN, "Click Add Deposit.", "Pick a Payment Method.", "Enter 50.00 as the Deposit Amount.", "Click Submit Deposit.",
   "Open customer B's Deposits tab.", "Open customer A's Deposits tab."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Add Deposit."], ["The Create Deposit window opens."], ["The Payment Method is picked."],
   ["Deposit Amount shows 50.00."], ["The deposit is recorded."], ["The $50.00 deposit for work order 1 is listed."],
   ["The $50.00 deposit is not listed on customer A's tab."]],
  ["S10-R2", "SBA-DEP", "CORE-3"])
C("S10-05", S, "A returned-parts credit on a part sale goes to the payer",
  [ADMIN, A, B, ps(1, "A", "invoiced for one part sold at $80.00, unpaid", "B")],
  [OPEN_PS, FIN, "Click Issue Credit on the invoice.", "Tick the part to return.", "Confirm the credit.", "Open customer B's page.",
   "Open customer A's page."],
  [["Part sale 1 opens for customer A."], ["The Finance tab lists the invoice."], ["The Issue Credit window opens."], ["The part is ticked."],
   ["The credit for the returned part is made."], ["Customer B's credits show the $80.00 credit for part sale 1."], ["Customer A's credits show no credit for part sale 1."]],
  ["S10-R3"])
C("S10-06", S, "One payment covers the payer's invoices for two customers",
  [ADMIN, A, B, cust("C", ", a second customer the payer pays for"),
   "Have a new work order for this test, work order 1, for customer A, invoiced for $120.00, billed to customer B, unpaid.",
   "Have a new work order for this test, work order 2, for customer C, invoiced for $80.50, billed to customer B, unpaid."],
  ["Open customer B's Invoices tab.", "Tick work order 1's invoice.", "Tick work order 2's invoice.", "Click New Payment.", "Pick Cash as the method.",
   "Click Make Payment."],
  [["Both invoices are listed: work order 1 is customer A's work and work order 2 is customer C's."], ["Work order 1's invoice is ticked."], ["Work order 2's invoice is ticked."],
   ["The New Customer Payment window shows both invoices and a payment amount of $200.50 ($120.00 + $80.50)."], ["Cash is picked."],
   ["The payment is recorded.", "Both invoices show Balance $0.00 on customer B's tab."]],
  ["S10-R4", "SBA-PAY", "KD-PAY"])
C("S10-07", S, "Paying an invoice that moved to another payer is refused",
  [ADMIN, A, B, cust("C", ", the new payer"), INV_A, "Open customer B's Invoices tab in a first browser tab and work order 1 in a second tab."],
  ["In the first tab, tick work order 1's invoice.", "Click New Payment.", "Switch to the second tab.", FIN, "Reverse the invoice.", EXPAND,
   CLICK_BT, "Pick customer C in the list.", "Click Create Invoice on the Finance tab.", "Switch to the first tab.", "Click Make Payment."],
  [["The invoice is ticked."], ["The New Customer Payment window shows the invoice for $210.00."], ["The second tab shows work order 1 for customer A."],
   ["The Finance tab lists the invoice."], ["The invoice is removed and work order 1 is back to Complete."], ['"Bill To" reads customer B\'s name.'],
   ["The list opens."], [bt_reads("C")], ["The invoice is created again for customer C."], ["The payment window is still open."],
   ['The payment is refused with "This payment can only be applied to invoices billed to [customer B\'s name]." as the app\'s standard error toast, captioned "Please try to resolve this."',
    "The toast fades after 3 seconds.", "No payment is recorded: customer B's Payments tab shows no new payment."]],
  ["S10-R5", UFS["M3"], "EH-S10", "UFS-H2", "KD-PAY", "SBA-PAY"], note=NAME_NOTE)
C("S10-08", S, "A payment that uses another customer's deposit or credit is refused",
  [ADMIN, A, B, cust("C", ", who holds a $25.00 credit"), INV_A],
  ["Try to record a payment from customer B for work order 1's invoice that uses customer C's $25.00 credit."],
  [['The payment is refused with "This payment can only use deposits and credits held by [customer B\'s name]." as the app\'s standard error toast.',
    "No payment is recorded on work order 1's invoice (customer A's work) and customer C's credit is unchanged."]],
  ["S10-R9", UFS["M5"], "EH-S10", "KD-DEP"], note=NAME_NOTE,
  marker=HOLD("the payment window offers only the paying customer's own deposits and credits, so another customer's cannot be picked on screen"))
C("S10-09", S, "The payer's Invoices tab names the service customer in Service For",
  [ADMIN, A, B, INV_A, "Have a new work order for this test, work order 2, for customer B, invoiced, that bills itself."],
  ["Open customer B's Invoices tab."],
  [['A "Service For" column shows after No.', "Work order 1's invoice reads customer A's name under Service For.",
    "Work order 2's invoice, customer B's own work, is blank under Service For."]],
  ["S10-R6", "S10-R7"])
C("S10-10", S, "No Service For column when nothing on the tab is billed for someone else",
  [ADMIN, cust("B", ", with two invoices of its own and none for anyone else, so the tab has rows")],
  ["Open customer B's Invoices tab."],
  [["Customer B's two invoices are listed with the columns No., Total, Balance and Status.", 'No "Service For" column shows.']],
  ["S10-N1"])
C("S10-11", S, "The Service For column stays after a search narrows to own invoices",
  [ADMIN, A, B, INV_A, "Have a new work order for this test, work order 2, for customer B, invoiced, that bills itself."],
  ["Open customer B's Invoices tab.", "Search the tab for work order 2's invoice number."],
  [['The "Service For" column shows, reading customer A\'s name on work order 1\'s invoice.'],
   ["Only work order 2's invoice is listed.", 'The "Service For" column still shows, blank on that row: whether it shows is decided before any search.']],
  ["S10-N1", "S10-R7"])
C("S10-12", S, "A credit from an invoice reduces the revenue of the service customer",
  [ADMIN, A, B, "Make sure customer A and customer B have no other sales today.",
   "Have a new work order for this test, work order 1, for customer A, created after the release, billed to customer B, invoiced today for two parts: part 1 sold at $260.00 and part 2 sold at $40.00 ($300.00)."],
  [OPEN_WO, FIN, "Click Issue Credit on the invoice.", "Tick part 2 to return.", "Confirm the credit.",
   "Open the Sales By Customer report for today."],
  [["Work order 1 opens for customer A."], ["The Finance tab lists the invoice."], ["The Issue Credit window opens."], ["Part 2 ($40.00) is ticked."],
   ["The credit is made."],
   ["Customer A's sales read $260.00 ($300.00 − $40.00).", "Customer B shows no sales for work order 1 and no reduction."]],
  ["S10-R8", "KD-CREDIT", "KD-REPORTS"])
C("S10-13", S, "Payments applied before the release are not checked again",
  [ADMIN, "Use the production test account.", cust("A", ", created on production before the release"),
   "Have a new work order for this test, work order 1, for customer A, invoiced and paid by customer A on production before the release."],
  [OPEN_WO, FIN],
  [["Work order 1 opens for customer A."], ["The payment applied before the release is still applied, with its amount unchanged.",
    "No refusal or warning shows about it."]],
  ["S10-N3", "KD-PAY"], marker=PRE_REL)
