"""Story 17 — QuickBooks sync (SV-12319): the invoice under the payer, a linked customer keeps its link whatever the names, an unlinked one
is matched by exact name and linked, a same-name QuickBooks customer already linked elsewhere puts the invoice on the Unexported report,
Reverse deletes and the re-issued invoice is sent as new, no QuickBooks connection, before-release invoices (held for production), and
the self-billed invoice as today. The tester signs in to the QuickBooks Online sandbox company connected to the test organization."""
from bt_lib import C, PRE_REL, UFS
from common import *

S = "S17"
QB = "Use a test organization connected to a QuickBooks Online sandbox company that you can sign in to."
A = cust("A", ", the customer the work is for")
READY = "in Complete, ready to invoice,"
QBINV = "In QuickBooks, open the invoice with work order 1's invoice number."

C("S17-01", S, "The invoice reaches QuickBooks under the payer",
  [ADMIN, QB, A, cust("B", ", the payer, already linked to a QuickBooks customer"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, QBINV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The QuickBooks invoice's customer is customer B's linked QuickBooks customer.", "Its total equals the ShopView invoice total."]],
  ["S17-R1", "INT-1", "CORE-3"])
C("S17-02", S, "A linked payer syncs to its QuickBooks customer even after a rename",
  [ADMIN, QB, A, cust("B", ", the payer, linked to a QuickBooks customer of the same name"), wo(1, "A", READY, "B")],
  ["Open customer B's Edit Customer window.", "Change customer B's name to a new name.", SAVE, OPEN_WO, FIN, CREATE_INV, QBINV],
  [["Customer B's Edit Customer window opens."], ["The name field shows the new name."], ["The window closes."], ["Work order 1 opens for customer A."],
   ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The QuickBooks invoice is on the QuickBooks customer customer B was linked to, under its old name.", "No new QuickBooks customer was made."]],
  ["S17-R2"])
C("S17-03", S, "An unlinked payer is matched to the QuickBooks customer with its exact name",
  [ADMIN, QB, A, cust("B", ", the payer, not linked to QuickBooks, whose name matches exactly one QuickBooks customer that is linked to nothing"),
   wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, QBINV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The QuickBooks invoice is on the QuickBooks customer with customer B's exact name.", "That QuickBooks customer is now linked to customer B."]],
  ["S17-R3"])
C("S17-04", S, "A same-name QuickBooks customer linked elsewhere puts the invoice on Unexported",
  [ADMIN, QB, A, cust("D", ", already linked to a QuickBooks customer"),
   cust("B", ", the payer, not linked to QuickBooks, whose name is exactly the name of customer D's QuickBooks customer"),
   wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the Unexported report.", QBINV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created in ShopView."],
   ["Work order 1's invoice, billed to customer B, is listed with the reason \"QuickBooks customer [that QuickBooks customer's name] is already linked to another ShopView customer.\""],
   ["No QuickBooks invoice exists with that number: the invoice was not sent, and customer D's QuickBooks customer has no new invoice."]],
  ["S17-R4", UFS["Q1"], "EH-S17"], note=NAME_NOTE)
C("S17-05", S, "Reverse deletes the QuickBooks invoice and the new one is sent fresh",
  [ADMIN, QB, A, cust("B", ", the payer, linked to a QuickBooks customer"), cust("C", ", the new payer, linked to a QuickBooks customer"),
   wo(1, "A", "invoiced and sent to QuickBooks (no payment, deposit or credit applied)", "B")],
  [OPEN_WO, FIN, "Reverse the invoice.", QBINV, EXPAND, CLICK_BT, "Pick customer C in the list.", FIN, CREATE_INV, QBINV],
  [["Work order 1 opens for customer A."], ["The Finance tab lists the invoice."], ["Work order 1 is back to Complete."],
   ["QuickBooks no longer has the invoice: it was deleted."], [bt_reads("B")], ["The list opens."], [bt_reads("C")],
   ["The Finance tab shows Create Invoice."], ["The invoice is created again with the same number."],
   ["QuickBooks has a new invoice with that number on customer C's QuickBooks customer."]],
  ["S17-R5", "KD-LOCK"])
C("S17-06", S, "Without QuickBooks connected, invoicing to a payer works and nothing is sent",
  [ADMIN, "Use a test organization with no QuickBooks connection.", A, cust("B", ", the payer"), wo(1, "A", READY, "B"),
   "Make sure the Unexported report is empty, so a new entry would show."],
  [OPEN_WO, FIN, CREATE_INV, "Open the Unexported report."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created, billed to customer B."],
   ["The Unexported report is still empty: nothing was sent and nothing failed."]],
  ["S17-N1"])
C("S17-07", S, "Invoices created before the release are not sent again",
  [ADMIN, "Use the production test account, connected to its QuickBooks Online company.", cust("A", ", created on production before the release"),
   "Have a new work order for this test, work order 1, for customer A, invoiced and sent to QuickBooks on production before the release."],
  [QBINV],
  [["The QuickBooks invoice for customer A is still the one sent before the release: there is no second copy and it was not changed on release day."]],
  ["S17-N2"], marker=PRE_REL)
C("S17-08", S, "A self-billed invoice reaches QuickBooks under its own customer",
  [ADMIN, QB, cust("A", ", that bills itself, linked to a QuickBooks customer"), wo(1, "A", READY)],
  [OPEN_WO, FIN, CREATE_INV, QBINV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The QuickBooks invoice is on customer A's linked QuickBooks customer, as today."]],
  ["S17-R1", "GOAL-4"])
