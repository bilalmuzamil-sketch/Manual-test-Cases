"""Release day (PRD section 2, "Release day"): nothing migrated, no feature flag, before-release credits keep their revenue, the server-side
Credit Hold check for self-billed work orders (two tabs, runnable now), and the release-day screens. The visible release-day changes
(asset tab, Bill To field, Bill Invoices To, Address 2, CSV column, Public API refusal) are each checked in their story's cases, which
quote the release-day line too. Cases that need records made before the release run on production (Credit terms precedent)."""
from bt_lib import C, PRE_REL
from common import *

S = "REL"
PROD = "Use the production test account."

C("REL-01", S, "Existing work orders bill their own customer after the release",
  [ADMIN, PROD, cust("A", ", created on production before the release"),
   "Have a new work order for this test, work order 1, for customer A, open, made on production before the release, with its estimate total noted before the release."],
  [OPEN_WO, EXPAND, FIN],
  [["Work order 1 opens for customer A."], [BT_SELF], ["The estimate total equals the total noted before the release."]],
  ["REL-0a", "REL-2", "GOAL-4"], marker=PRE_REL)
C("REL-02", S, "Existing invoices and balances are unchanged after the release",
  [ADMIN, PROD, cust("A", ", created on production before the release, with an invoice and a balance noted before the release"),
   "Have a new work order for this test, work order 1, for customer A, invoiced on production before the release."],
  ["Open customer A's Invoices tab.", OPEN_WO, FIN, "Open the invoice's PDF."],
  [["Work order 1's invoice is listed with the same total and balance as noted before the release.", 'No "Service For" column shows.'],
   ["Work order 1 opens for customer A."], ["The Finance tab lists the invoice."],
   ["The Bill To block names customer A and no Service For band prints: the document matches the day before."]],
  ["REL-0a", "GOAL-4", "S8-N2"], marker=PRE_REL)
C("REL-03", S, "Bill To is on for every shop at release with no setting to switch",
  [ADMIN, PROD, cust("A", ", that bills itself"), wo(1, "A"), "Make sure no setting was changed for Bill To on the production test account."],
  [OPEN_WO, EXPAND],
  [["Work order 1 opens for customer A."], [BT_SELF, "No setting had to be switched on to see it."]],
  ["REL-0c", "REL-2"], marker=PRE_REL)
C("REL-04", S, "A credit on an invoice from before the release keeps today's revenue split",
  [ADMIN, PROD, cust("A", ", created on production before the release"),
   "Have a new work order for this test, work order 1, for customer A, invoiced on production before the release for two parts, part 1 at $260.00 and part 2 at $40.00 ($300.00).",
   "Make sure customer A has no other sales on the day of the credit."],
  [OPEN_WO, FIN, "Click Issue Credit on the invoice.", "Tick part 2 to return.", "Confirm the credit.", "Open the Sales By Customer report for the day of the credit."],
  [["Work order 1 opens for customer A."], ["The Finance tab lists the invoice."], ["The Issue Credit window opens."], ["Part 2 ($40.00) is ticked."],
   ["The credit is made."], ["The $40.00 credit is attributed as it would have been before the release (customer A's credit, as today).",
    "No existing revenue figure moved."]],
  ["REL-0b", "S10-R8", "KD-CREDIT"], marker=PRE_REL)
C("REL-05", S, "Credit Hold is also checked when invoicing a self-billed work order",
  [ADMIN, cust("A", ", that bills itself, on the COD credit term"), wo(1, "A", "in Complete, ready to invoice,"), "Open work order 1 in two browser tabs."],
  ["In the first tab, open the Finance tab.", "Switch to the second tab.", "Open customer A's Edit Customer window.", "Change Credit Terms to Credit Hold.",
   SAVE, "Switch to the first tab.", CREATE_INV],
  [["Create Invoice is enabled."], ["The second tab shows work order 1 for customer A."], ["Customer A's Edit Customer window opens."],
   ["Credit Terms shows Credit Hold."], ["Customer A is saved on Credit Hold."], ["The first tab still shows Create Invoice enabled."],
   ['Invoicing is refused with the same message as today: "Cannot invoice this customer. Customer is on Credit Hold"', "No invoice is created."]],
  ["REL-6", "S7-N2", "KD-CH"])
