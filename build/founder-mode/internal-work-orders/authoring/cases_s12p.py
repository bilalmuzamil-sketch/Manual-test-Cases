"""Story 12 (portal) — The no-charge line and the no-charge estimate in the customer portal (SV-12296; requirements S2-R11, S2-E6,
S1-R11, S3-R4, S12-R4, S12-R7): a no-charge estimate's line cards, stamp and category, Approve and Decline, the "Approval Required"
email, after Convert to Billable, an estimate changed after it was sent, a pending estimate made internal, a no-charge line on a billable
estimate and invoice, and closed records on the portal's lists."""
from iwo_lib import C
from common import *

S = "S12P"
PORTAL = "Have a portal contact for this test for customer A, whose portal login and email the tester can use."
OPEN_P = "Sign in to the customer portal as customer A's contact."
OPEN_EST = "Open work order 1's estimate in the portal."
NOTICE = "This estimate changed after it was sent. The lines above are current."

C("S12P-01", S, "A no-charge estimate in the portal shows hours and quantities, no prices",
  [ADMIN, ON, cust("A"), PORTAL, ncwo(1, "A", "Goodwill", "in Estimate", f", with {LABOR_2H} and {STOCK_PART}, sent to the portal")],
  [OPEN_P, OPEN_EST],
  [["The portal opens."],
   ["The line cards show the 2.0 hours and the part's quantity 2.", "No price, cost or total shows.", 'The NO CHARGE stamp shows with "Category: Goodwill".']],
  ["S2-R11", "S2-R16"])
C("S12P-02", S, "Approve and Decline work on a no-charge estimate in the portal",
  [ADMIN, ON, cust("A"), PORTAL, ncwo(1, "A", "Goodwill", "in Estimate", f", with {LABOR_2H}, sent to the portal")],
  [OPEN_P, OPEN_EST, "Click Approve.", OPEN_WO],
  [["The portal opens."], ["The estimate shows Approve and Decline."], ["The approval is recorded, as today."], ["Work order 1's line shows as approved."]],
  ["S2-R11"])
C("S12P-03", S, "Approval Required email of a no-charge estimate shows no amounts",
  [ADMIN, ON, cust("A"), PORTAL, ncwo(1, "A", "Warranty", "in Estimate", f", with {LABOR_2H}, with Not in ShopView as its original")],
  [OPEN_WO, "Click Send to Portal.", 'Open the "Approval Required" email in the contact\'s mailbox.'],
  [["Work order 1 opens."], ["The estimate is sent."],
   ['The email shows no amounts or totals, and shows the NO CHARGE stamp with "Category: Warranty" ("Not in ShopView" is not shown).']],
  ["S2-R11", "S2-R16"])
C("S12P-04", S, "Approval Required email of a billable estimate shows the line at $0.00",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), PORTAL,
   wo(1, "A", "in Estimate", ", billable, with line 1 of 2.0 hours and line 2 of 1.5 hours marked No Charge under Goodwill")],
  [OPEN_WO, "Click Send to Portal.", 'Open the "Approval Required" email in the contact\'s mailbox.'],
  [["Work order 1 opens."], ["The estimate is sent."], ['Line 2 shows $0.00 with "Goodwill"; line 1 shows $240.00 and the total is $240.00.']],
  ["S2-R11", "S12-R4"])
C("S12P-05", S, "After Convert to Billable the portal shows the live prices and no stamp",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), PORTAL, ncwo(1, "A", "Goodwill", "in Estimate", f", with {LABOR_2H}, sent to the portal")],
  [OPEN_WO, MENU, 'Click "Convert to Billable".', "Click the confirming Convert to Billable button.", OPEN_P, OPEN_EST, "Click Approve."],
  [["Work order 1 opens."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."], ["The work order is billable."], ["The portal opens."],
   ["The NO CHARGE stamp is gone.", "The price summary shows $240.00 (2.0 h × $120.00)."], ["Approve works as today."]],
  ["S2-R6", "S2-R11"])
C("S12P-06", S, "An estimate sent before Convert to No Charge shows the change on its next open",
  [ADMIN, ON, cust("A"), PORTAL, wo(1, "A", "in Estimate", f", billable, with {LABOR_2H}, sent to the portal")],
  [OPEN_WO, MENU, 'Click "Convert to No Charge".', 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", OPEN_P, OPEN_EST],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."], ['The "No Charge" badge shows.'],
   ["The portal opens.", "No new email has arrived in the contact's mailbox."],
   ["The same estimate shows the NO CHARGE stamp and no prices.", f'Under the lines the notice reads "{NOTICE}"']],
  ["S2-E6", "UFS-42"])
C("S12P-07", S, "A pending estimate whose work order was made internal cannot be approved",
  [ADMIN, ON, cust("A"), PORTAL, wo(1, "A", "in Estimate", ", billable, sent to the portal"),
   "Sign in to the customer portal as customer A's contact and leave work order 1's estimate open in a browser tab, tab 1."],
  ["In ShopView, open customer A's page.", "Click Edit Customer.", 'Tick "Internal customer".', SAVE, 'Click "Make internal".', "In tab 1, click Approve.", "Reload tab 1."],
  [["Customer A's page opens."], ["The window opens."], ["The checkbox is ticked."], ["The Make internal window lists work order 1."], ["Work order 1 is internal."],
   ['The approval is refused with "This estimate is no longer available."'], ["The estimate shows the existing obsolete banner with no Approve or Decline."]],
  ["S1-R11", "UFS-41", "OOS-10"])
C("S12P-08", S, "A billable estimate shows a line marked after sending at $0.00 with the notice",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), PORTAL,
   wo(1, "A", "in Estimate", ", billable, with line 1 of 2.0 hours and line 2 of 1.5 hours, sent to the portal")],
  [OPEN_WO, "Open line 2's three-dots menu.", 'Click "Mark as No Charge".', 'Pick "Goodwill" in Category.', "Click the confirming Mark as No Charge button.", OPEN_P, OPEN_EST],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."], ["Line 2 shows $0.00."], ["The portal opens."],
   ['Line 2 shows $0.00 with "Goodwill" under its title.', "The price summary reads $240.00.", f'Under the lines the notice reads "{NOTICE}"']],
  ["S12-R4", "UFS-42"])
C("S12P-09", S, "The portal invoice shows the no-charge line at $0.00 with its category",
  [ADMIN, ON, cust("A"), PORTAL, wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Goodwill")],
  [OPEN_P, "Open work order 1's invoice in the portal."],
  [["The portal opens."], ['Line 2 shows $0.00 with "Goodwill" under its title; there is no stamp and no badge.']],
  ["S12-R7", "UFS-37"])
C("S12P-10", S, "A closed internal work order is not listed but counts on the vehicle list",
  [ADMIN, ON, icust("A", ", with one asset, asset 1"), PORTAL, iwo(1, "A", "closed today", ", on asset 1")],
  [OPEN_P, "Open the portal's invoices.", "Open the portal's vehicle list."],
  [["The portal opens."], ["Work order 1's document is not listed."], ["Asset 1 shows today as Last Service and work order 1 counted under Completed, with $0.00 owed."]],
  ["S3-R4", "PM-15"])
