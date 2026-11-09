"""Story 7 — Invoicing to the Bill To (SV-12309): the invoice's Bill To block and its saved details, the payer's credit term and due date,
the customer's pricing and an unchanged total, the payer's "PO is required", the Over Credit warning (warns, never blocks), the Credit
Hold banner with "Change Bill To" (work order header, part sale Finance tab, phone), Create Invoice disabled, refused when reached anyway
(two tabs), badges, the customer's own Credit Hold, today's wording when self-billed, no button without permission, invoiced banner,
and the capitalization case (held). Amounts and dates are exact (Rule 116)."""
from bt_lib import C, HOLD, UFS
from common import *

S = "S7"
A = cust("A", ", the customer the work is for, on the COD credit term")
READY = "in Complete, ready to invoice,"
HOLD_B = cust("B", ", the payer, on the Credit Hold credit term")
M2B = M2.format(c="B")

C("S7-01", S, "The invoice's Bill To block prints the payer's name, address and phone",
  [ADMIN, A, cust("B", ", the payer, with an address and a phone number different from customer A's"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the new invoice's document."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The Bill To block shows customer B's name, address and phone number.", "Customer A's address and phone are not in the Bill To block."]],
  ["S7-R1", "SBA-INV", "GOAL-1", "CORE-3"])
C("S7-02", S, "Later changes to the payer do not change an existing invoice",
  [ADMIN, cust("A"), cust("B", ", the payer, on the Net 30 credit term, with an address and a phone number"),
   wo(1, "A", "invoiced today (no payment applied)", "B")],
  ["Open customer B's Edit Customer window.", "Change customer B's name to a new name.", "Change customer B's first address line to a new one.",
   "Change customer B's Credit Terms to Net 15.", SAVE, OPEN_WO, FIN, "Open the invoice's document."],
  [["Customer B's Edit Customer window opens."], ["The name field shows the new name."], ["Address 1 shows the new line."],
   ["Credit Terms shows Net 15."], ["The window closes."], ["Work order 1 opens for customer A."], ["The Finance tab lists the invoice."],
   ["The Bill To block still shows customer B's old name and old address line.", "The due date is still 30 days after the invoice date."]],
  ["S7-E1", "S7-R1", "S7-R2"])
C("S7-03", S, "The payer's credit term sets the invoice's due date",
  [ADMIN, A, cust("B", ", the payer, on the Net 30 credit term"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the new invoice's document."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created with today's date."],
   ["The invoice shows customer B's term, Net 30.", "The due date is today plus 30 days (for an invoice dated 9 Nov 2026 it is 9 Dec 2026)."]],
  ["S7-R2", "CORE-3"])
C("S7-04", S, "Changing the Bill To does not change the work order's total",
  [ADMIN, cust("A", ", taxable at the test location's 5% tax"), cust("B", ", the payer, with its own labor rate and discount settings"),
   wo(1, "A", "in Approved", None, ", with one part sold at $100.00, so the estimate reads Parts $100.00, tax $5.00, Total $105.00")],
  [OPEN_WO, FIN, EXPAND, CLICK_BT, "Pick customer B in the list.", FIN],
  [["Work order 1 opens for customer A."], ["The estimate shows Parts $100.00, tax $5.00 and Total $105.00 (100.00 × 5% = 5.00)."],
   [BT_SELF], ["The list opens."], [bt_reads("B")],
   ["The estimate still shows Parts $100.00, tax $5.00 and Total $105.00: the total did not change."]],
  ["S7-R3", "KD-SPLIT", "CORE-2"])
C("S7-05", S, "The payer's PO is required rule blocks invoicing with no Customer PO",
  [ADMIN, cust("A", ", with PO is required off"), cust("B", ", the payer, with PO is required on"),
   wo(1, "A", READY, "B", ", with Customer PO empty")],
  [OPEN_WO, FIN, CREATE_INV, "Type a purchase order number in Customer PO.", CREATE_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows an empty Customer PO."],
   ["No invoice is created: customer B's PO rule applies and the work order asks for a Customer PO, as it does today for a customer whose PO is required."],
   ["Customer PO shows the number."], ["The invoice is created."]],
  ["S7-R4", "SBA-INV", "CORE-3"])
C("S7-06", S, "The customer's own PO is required rule does not apply when someone else pays",
  [ADMIN, cust("A", ", with PO is required on"), cust("B", ", the payer, with PO is required off"),
   wo(1, "A", READY, "B", ", with Customer PO empty")],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A."], ["Customer PO is empty."], ["The invoice is created without a Customer PO: customer B's rule applies."]],
  ["S7-R4", "KD-SPLIT"])
C("S7-07", S, "Over Credit warns against the payer's limit and still lets you invoice",
  [ADMIN, cust("A", ", with no credit limit"), cust("B", ", the payer, on Net 30 with a $500.00 credit limit"),
   "Have a new invoice for this test, invoice 1, billed to customer B for $600.00 and unpaid, so customer B already owes more than its limit.",
   wo(1, "A", READY, "B", ", with a total of $150.00")],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."],
   ["The Over Credit warning shows for customer B: customer B owes $600.00 on invoice 1 against a $500.00 limit.",
    "The warning does not block: the invoice is created, and customer B then owes $600.00 + $150.00 = $750.00."]],
  ["S7-R5", "KD-CH", "CORE-3"])
C("S7-08", S, "No Over Credit warning when the payer is far under its limit",
  [ADMIN, cust("A", ", with a $100.00 credit limit and an unpaid invoice of $400.00, so customer A alone is over its own limit"),
   cust("B", ", the payer, on Net 30 with a $500.00 credit limit"),
   "Have a new invoice for this test, invoice 1, billed to customer B for $100.00 and unpaid, so customer B owes something.",
   wo(1, "A", READY, "B", ", with a total of $150.00")],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."],
   ["No Over Credit warning shows: customer B owes $100.00 on invoice 1, and $100.00 + $150.00 = $250.00 is under its $500.00 limit.",
    "Customer A being over its own limit plays no part.", "The invoice is created."]],
  ["S7-R5"])
C("S7-09", S, "A payer on Credit Hold shows the banner with Change Bill To on the work order",
  [ADMIN, A, HOLD_B, wo(1, "A", READY, "B")],
  [OPEN_WO],
  [[f'A banner at the top of the work order page reads "{M2B}"', 'The banner has a "Change Bill To" button.', "Customer A is on COD: the banner is about customer B."]],
  ["S7-R6", UFS["M2"], "KD-CH"], note=NAME_NOTE)
C("S7-10", S, "A part sale whose payer is on Credit Hold shows the banner on its Finance tab",
  [ADMIN, A, HOLD_B, ps(1, "A", "open, with one part ready to invoice", "B")],
  [OPEN_PS, FIN],
  [["Part sale 1 opens for customer A."], [f'The Finance tab shows a banner reading "{M2B}"', 'The banner has a "Change Bill To" button.']],
  ["S7-R6", UFS["M2"]], note=NAME_NOTE)
C("S7-11", S, "Change Bill To opens and focuses the Customer card's Bill To field",
  [ADMIN, A, HOLD_B, wo(1, "A", READY, "B")],
  [OPEN_WO, 'Click "Change Bill To" in the banner.'],
  [["Work order 1 opens for customer A, with customer B's Credit Hold banner and \"Change Bill To\"."],
   ["The page scrolls to the Customer card.", "The Bill To field is focused and its list is open."]],
  ["S7-R7"])
C("S7-12", S, "On a phone Change Bill To opens the details first, then the Bill To field",
  [ADMIN, "Use a phone, or a browser window 390 pixels wide.", A, HOLD_B, wo(1, "A", READY, "B")],
  [OPEN_WO, 'Tap "Change Bill To" in the banner.'],
  [["Work order 1 opens for customer A, in the phone layout, with customer B's Credit Hold banner and \"Change Bill To\" above the lines."],
   ["The work order details open.", "The page scrolls to the Bill To field and its list opens."]],
  ["S7-R7", "FF-S7"])
C("S7-13", S, "Create Invoice is disabled with the Credit Hold tooltip",
  [ADMIN, A, HOLD_B, wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, "Hover over Create Invoice."],
  [["Work order 1 opens for customer A."], ["Create Invoice is disabled."], [f'The tooltip reads "{M2B}"']],
  ["S7-R8", UFS["M2"], "SBA-INV"], note=NAME_NOTE)
C("S7-14", S, "Create Invoice reached before the page knew about the hold is refused",
  [ADMIN, A, cust("B", ", the payer, on the COD credit term"), wo(1, "A", READY, "B"), "Open work order 1 in two browser tabs."],
  ["In the first tab, open the Finance tab.", "Switch to the second tab.", "Open customer B's Edit Customer window.",
   "Change Credit Terms to Credit Hold.", SAVE, "Switch to the first tab.", CREATE_INV],
  [["Create Invoice is enabled."], ["The second tab shows work order 1 for customer A."], ["Customer B's Edit Customer window opens."],
   ["Credit Terms shows Credit Hold."], ["Customer B is saved on Credit Hold."], ["The first tab still shows Create Invoice enabled."],
   [f'An error toast shows "{M2B}"', 'The toast has a "Change Bill To" button.', "No invoice is created: the Finance tab lists no invoice after a reload."]],
  ["S7-R9", UFS["M2"], "KD-CH"], note=NAME_NOTE)
C("S7-15", S, "Credit Hold is caught whatever the capitalization of its term",
  [ADMIN, A, cust("B", ", the payer, whose Credit Hold term is stored with different capitals (for instance all lower case)"),
   wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A with customer B's Credit Hold banner."], ["Create Invoice is disabled."],
   [f'If the action is reached, it is refused with "{M2B}" and no invoice is created.']],
  ["S7-R10"], note=NAME_NOTE,
  marker=HOLD("a credit term with different capitals cannot be made through the screens; it exists only in older stored data"))
C("S7-16", S, "The work order's Credit Hold badge describes the payer",
  [ADMIN, A, HOLD_B, wo(1, "A", "in Approved", "B")],
  [OPEN_WO],
  [["The work order header shows a \"Credit Hold\" badge, although customer A is on COD: it describes customer B."]],
  ["S7-R11"])
C("S7-17", S, "The work order's Over Limit badge describes the payer",
  [ADMIN, cust("A", ", with no credit limit and nothing owed"), cust("B", ", the payer, on Net 30 with a $500.00 credit limit"),
   "Have a new invoice for this test, invoice 1, billed to customer B for $600.00 and unpaid, so customer B is over its limit.",
   wo(1, "A", "in Approved", "B")],
  [OPEN_WO],
  [["The work order header shows an \"Over Limit\" badge: customer B owes $600.00 on invoice 1 against its $500.00 limit, although customer A owes nothing."]],
  ["S7-R11"])
C("S7-18", S, "The customer's own Credit Hold does not block when someone else pays",
  [ADMIN, cust("A", ", on the Credit Hold credit term"), cust("B", ", the payer, on the COD credit term"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A.", "No Credit Hold banner shows."], ["Create Invoice is enabled."], ["The invoice is created, billed to customer B."]],
  ["S7-N1"])
C("S7-19", S, "A self-billed customer on Credit Hold reads and blocks as today",
  [ADMIN, cust("A", ", that bills itself, on the Credit Hold credit term"), wo(1, "A", READY)],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A.", 'The banner reads "This customer is on Credit Hold!"'],
   ["The Finance tab shows Create Invoice as it does today for a customer on Credit Hold."],
   ['Invoicing is blocked with "Cannot invoice this customer. Customer is on Credit Hold"', "No invoice is created."]],
  ["S7-N2", "GOAL-4"])
C("S7-20", S, "Without permission to change the Bill To the Credit Hold banner has no button",
  [role("has 'Work orders → View' but not 'Work orders → Create & Edit'"), A, HOLD_B, wo(1, "A", READY, "B")],
  [OPEN_WO],
  [["Work order 1 opens for customer A.", f'The banner reads "{M2B}"', 'The banner has no "Change Bill To" button.']],
  ["S7-N3"], note=NAME_NOTE)
C("S7-21", S, "Once invoiced, the payer's Credit Hold banner no longer shows",
  [ADMIN, A, cust("B", ", the payer, on the COD credit term"), wo(1, "A", "invoiced (not paid)", "B")],
  ["Open customer B's Edit Customer window.", "Change Credit Terms to Credit Hold.", SAVE, OPEN_WO],
  [["Customer B's Edit Customer window opens."], ["Credit Terms shows Credit Hold."], ["Customer B is saved on Credit Hold."],
   ["Work order 1 opens for customer A, with status Invoiced.",
    'No banner reading "Cannot invoice. The Bill To customer, [customer B\'s name], is on Credit Hold" shows and there is no "Change Bill To" button.',
    "The banner reads as today for an invoiced work order whose customer, customer A, is on COD."]],
  ["S7-N4"], note=NAME_NOTE)
C("S7-22", S, "Invoiced work order whose customer is on Credit Hold and payer is not",
  [ADMIN, cust("A", ", on the COD credit term"), cust("B", ", the payer, on the COD credit term"), wo(1, "A", "invoiced (not paid)", "B")],
  ["Open customer A's Edit Customer window.", "Change Credit Terms to Credit Hold.", SAVE, OPEN_WO],
  [["Customer A's Edit Customer window opens."], ["Credit Terms shows Credit Hold."], ["Customer A is saved on Credit Hold."],
   ["Work order 1 opens for customer A, with status Invoiced.", 'The banner reads "This customer is on Credit Hold!", as today.', "Customer B, the payer, is still on COD."]],
  ["S7-N4", "S7-N1"], marker="PO:invoiced-banner-customer-on-hold")
C("S7-23", S, "A part sale's Credit Hold badge follows the payer",
  [ADMIN, A, HOLD_B, ps(1, "A", "open", "B")],
  [OPEN_PS],
  [["Part sale 1 opens for customer A.", "The part sale header shows a \"Credit Hold\" badge for customer B, as the work order's badge does."]],
  ["S7-R11"], marker="PO:part-sale-badges")
