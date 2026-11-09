"""Story 19 — IBS and invoice export (SV-12321; its Public API requirements are in cases_api.py, section API, Rule 4): the payer's IBS
account, the IBS number saved on the invoice and printed after the payer's name, no IBS when the payer has none, later IBS changes,
before-release invoices (held for production), the CSV export's Customer, Terms and Service Customer columns, and before-release exports
(held). The tester uses an organization connected to IBS."""
from bt_lib import C, PRE_REL
from common import *

S = "S19"
IBS = "Use a test organization connected to IBS."
A = cust("A", ", the customer the work is for, with its own IBS account number")
READY = "in Complete, ready to invoice,"
EXPORT = "Export the invoice list to CSV."

C("S19-01", S, "The invoice uses the payer's IBS account and prints its IBS number",
  [ADMIN, IBS, A, cust("B", ", the payer, with an IBS account number different from customer A's"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the new invoice's document."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created and goes through IBS."],
   ['The Bill To block shows customer B\'s name followed by "(IBS#: [customer B\'s IBS number])".',
    "The remit-to is customer B's IBS remit-to.", "Customer A's IBS number does not show."]],
  ["S19-R1", "S19-R2", "S19-R3", "INT-3", "CORE-3"], note=NAME_NOTE)
C("S19-02", S, "The invoice goes into the payer's IBS batch",
  [ADMIN, IBS, A, cust("B", ", the payer, with an IBS account number different from customer A's"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the IBS batch the invoice was added to."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["Work order 1's invoice is in the batch under customer B's IBS number.", "It is not under customer A's IBS number."]],
  ["S19-R1", "S19-R3"])
C("S19-03", S, "No IBS when the payer has no IBS account, even if the customer has one",
  [ADMIN, IBS, A, cust("B", ", the payer, with no IBS account"), wo(1, "A", READY, "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the new invoice's document."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created and does not go through IBS."],
   ['No "(IBS#: …)" shows after customer B\'s name: the saved IBS number is blank.', "Customer A's IBS number does not show."]],
  ["S19-R4", "S19-R2"])
C("S19-04", S, "A later change to the payer's IBS account does not change the invoice",
  [ADMIN, IBS, A, cust("B", ", the payer, with an IBS account number"), wo(1, "A", "invoiced through IBS", "B")],
  ["Open customer B's Edit Customer window.", "Change customer B's IBS account number to a new one.", SAVE, OPEN_WO, FIN, "Open the invoice's document."],
  [["Customer B's Edit Customer window opens."], ["The IBS field shows the new number."], ["The window closes."], ["Work order 1 opens for customer A."],
   ["The Finance tab lists the invoice."], ['The Bill To block still shows "(IBS#: [customer B\'s old IBS number])".']],
  ["S19-N4", "S19-R3"], note=NAME_NOTE)
C("S19-05", S, "Invoices made before the release read the payer's current IBS account",
  [ADMIN, "Use the production test account, connected to IBS.", cust("A", ", created on production before the release, with an IBS account number"),
   "Have a new work order for this test, work order 1, for customer A, invoiced through IBS on production before the release."],
  ["Open customer A's Edit Customer window.", "Change customer A's IBS account number to a new one.", SAVE, OPEN_WO, FIN, "Open the invoice's document."],
  [["Customer A's Edit Customer window opens."], ["The IBS field shows the new number."], ["The window closes."], ["Work order 1 opens for customer A."],
   ["The Finance tab lists the invoice."], ['The invoice shows "(IBS#: [customer A\'s new IBS number])": invoices created before the release read the current account.']],
  ["S19-N4"], marker=PRE_REL, note=NAME_NOTE)
C("S19-06", S, "The CSV export names the payer as Customer with the saved term",
  [ADMIN, A, cust("B", ", the payer, on the Net 30 credit term"), wo(1, "A", "invoiced today", "B"),
   "Start on the page that exports the invoice list."],
  [EXPORT, "Open the CSV file."],
  [["A CSV file downloads."], ['Work order 1\'s invoice row, customer A\'s work, reads customer B\'s name under "Customer".', 'Its "Terms" reads Net 30.']],
  ["S19-R5"])
C("S19-07", S, "Service Customer, the export's last column, names the customer the work was for",
  [ADMIN, A, cust("B", ", the payer"), wo(1, "A", "invoiced today", "B"),
   "Have a new work order for this test, work order 2, for customer B, invoiced today, that bills itself.", "Start on the page that exports the invoice list."],
  [EXPORT, "Open the CSV file."],
  [["A CSV file downloads."],
   ['The last column is "Service Customer".', "Work order 1's invoice row reads customer B's name under Customer and customer A's name under Service Customer.",
    "Work order 2's invoice row is blank under Service Customer."]],
  ["S19-R6", "S19-N1", "REL-5"])
C("S19-08", S, "Invoices created before the release export as before",
  [ADMIN, "Use the production test account.", "Have a CSV export of the invoice list taken on production shortly before the release, kept for comparison."],
  [EXPORT, "Open the CSV file."],
  [["A CSV file downloads."],
   ["Every invoice created before the release has the same Customer, Terms and every other value as in the export taken before the release.",
    'The only change is the new last column, "Service Customer", blank on those rows.']],
  ["S19-N2", "S19-N1", "REL-5", "REL-0a"], marker=PRE_REL)
