"""Story 16 — Customer portal (SV-12318). The payer's portal contacts see and pay the invoice (S16-R1, R5, R6 and the self-billed case run
with today's portal). S16-R2 to S16-R4 and the deposit-link check (G3) ship in the customer portal app's own release (the PRD's release
dependency): those cases open with the BLOCKED ON RELEASE banner and are held. The portal is not shot in the design."""
from bt_lib import C, PORTAL_BANNER as BAN, PORTAL_HOLD as H, UFS
from common import *

S = "S16"
PORTAL = "Use a shop that uses the customer portal."
A = cust("A", ", the customer the work is for, with contact A1, who can sign in to the customer portal")
B = cust("B", ", the payer, with contact B1, who can sign in to the customer portal")
INVB = wo(1, "A", "invoiced for $150.00, unpaid", "B")
SIGN_B1 = "Sign in to the customer portal as contact B1."
SIGN_A1 = "Sign in to the customer portal as contact A1."

C("S16-01", S, "The payer's portal contact sees the invoice and can pay it",
  [PORTAL, A, B, INVB],
  [SIGN_B1, "Open work order 1's invoice.", "Click Pay."],
  [["Contact B1, customer B's contact, is signed in."], ["The $150.00 invoice for work order 1, customer A's work, shows.", "It has a Pay button."], ["The payment form for $150.00 opens."]],
  ["S16-R1", "INT-4", "CORE-3"])
C("S16-02", S, "The customer's portal contact sees the invoice read-only with Billed to",
  [PORTAL, A, B, INVB],
  [SIGN_A1, "Open work order 1's invoice."],
  [["Contact A1, customer A's contact, is signed in."], ["The invoice shows read-only.", 'Where Pay would be, it reads "Billed to [customer B\'s name]".', "There is no Pay button."]],
  ["S16-R2", UFS["Portal"], "INT-4"], banner=BAN, marker=H, note=NAME_NOTE)
C("S16-03", S, "The invoice created email goes only to the payer's portal contacts",
  [ADMIN, PORTAL, A, B, wo(1, "A", "in Complete, ready to invoice,", "B")],
  [OPEN_WO, FIN, CREATE_INV, "Check contact B1's mailbox.", "Check contact A1's mailbox."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ['Contact B1, customer B\'s portal contact, has the "invoice created" email for work order 1.'], ['Contact A1 has no "invoice created" email for work order 1.']],
  ["S16-R3"], banner=BAN, marker=H)
C("S16-04", S, "Paying several invoices at once includes only what the viewer's customer owes",
  [PORTAL, A, B,
   "Have a new work order for this test, work order 1, for customer A, invoiced for $150.00, unpaid, billed to customer B.",
   "Have a new work order for this test, work order 2, for customer A, invoiced for $60.00, unpaid, that bills itself."],
  [SIGN_A1, "Choose to pay several invoices at once."],
  [["Contact A1, customer A's contact, is signed in."], ["Only work order 2's invoice ($60.00) is included.", "Work order 1's invoice, owed by customer B, is not included."]],
  ["S16-R4"], banner=BAN, marker=H)
C("S16-05", S, "The payer's contact sees only invoices that name the payer",
  [PORTAL, A, B, INVB,
   "Have a new work order for this test, work order 2, for customer A, invoiced, that bills itself, so customer A has another job the payer must not see."],
  [SIGN_B1, "Open the list of invoices and jobs."],
  [["Contact B1, customer B's contact, is signed in."],
   ["Work order 1's invoice is listed.", "Work order 2 is not listed.", "Customer A's assets are not shown."]],
  ["S16-R5"])
C("S16-06", S, "A deposit link paid after the Bill To changed is refused",
  [ADMIN, PORTAL, A, B, cust("C", ", the new payer"), wo(1, "A", "in Approved", "B", ", with no deposit taken")],
  [OPEN_WO, FIN, "Create a deposit link for $25.00.", EXPAND, CLICK_BT, "Pick customer C in the list.", "Open the deposit link in another browser.",
   "Pay the $25.00 with a test card.", "Switch back to work order 1's Finance tab.", RELOAD],
  [["Work order 1 opens for customer A."], ["The Finance tab shows its deposit actions."], ["A deposit link for $25.00 is made while customer B is the Bill To."],
   [bt_reads("B")], ["The list opens."], [bt_reads("C")], ["The portal payment page for $25.00 opens."],
   ['The payment is refused with "This work order is now billed to another customer. Contact the shop."', "No card is charged."],
   ["The Finance tab is open."], ["No deposit is recorded on work order 1."]],
  ["S16-R6", "S16-R7", UFS["G3"], "DEP-S16"], banner=BAN, marker=H)
C("S16-07", S, "A deposit link paid with the Bill To unchanged lands on the payer",
  [ADMIN, PORTAL, A, B, wo(1, "A", "in Approved", "B", ", with no deposit taken")],
  [OPEN_WO, FIN, "Create a deposit link for $25.00.", "Open the deposit link in another browser.", "Pay the $25.00 with a test card.",
   "Open customer B's Deposits tab."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows its deposit actions."], ["A deposit link for $25.00 is made."],
   ["The portal payment page for $25.00 opens."], ["The payment goes through."], ["The $25.00 deposit for work order 1 is listed."]],
  ["S16-R6", "S10-R2"])
C("S16-08", S, "When the customer pays for itself the portal works as today",
  [PORTAL, cust("A", ", that bills itself, with contact A1, who can sign in to the customer portal"), wo(1, "A", "invoiced for $90.00, unpaid")],
  [SIGN_A1, "Open work order 1's invoice."],
  [["Contact A1, customer A's contact, is signed in."], ["The $90.00 invoice shows with its Pay button, as today.", 'No "Billed to" line shows.']],
  ["S16-N1"])
