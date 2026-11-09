"""Story 13 — Work Order Log (SV-12315): a "Bill To changed" entry with the old and new customer as links, on a work order and on a part
sale; a Change Customer that moves the Bill To other than with the customer; a plain Change Customer on a self-billed document; names
without links for a user without 'Customers → View'."""
from bt_lib import C
from common import *

S = "S13"
A = cust("A", ", that bills itself")
B = cust("B", ", the payer")
LOG = "Open the Work Order Log."
CCB = "Click Change Customer (the two arrows at the top right of the Customer card)."

C("S13-01", S, "Changing the Bill To adds a Bill To changed entry to the log",
  [ADMIN, A, B, wo(1, "A")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list.", LOG],
  [["Work order 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B")],
   ['The newest entry is "Bill To changed".', 'Its details read "Bill To" with customer A\'s name as the old value and customer B\'s name as the new value.',
    "Both names are links."]],
  ["S13-R1", "S13-R2"])
C("S13-02", S, "A customer name in the Bill To changed entry opens its page",
  [ADMIN, A, B, wo(1, "A")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list.", LOG, "Click customer B's name in the Bill To changed entry."],
  [["Work order 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B")], ['The "Bill To changed" entry shows.'],
   ["Customer B's page opens."]],
  ["S13-R2"])
C("S13-03", S, "Changing a part sale's Bill To adds the entry to its log",
  [ADMIN, A, B, ps(1, "A")],
  [OPEN_PS, EXPAND, CLICK_BT, "Pick customer B in the list.", "Open the part sale's log."],
  [["Part sale 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B")],
   ['The newest entry is "Bill To changed", with "Bill To" from customer A\'s name to customer B\'s name, each a link.']],
  ["S13-R1", "S13-R2"])
C("S13-04", S, "Change Customer that moves the Bill To to a new default logs it",
  [ADMIN, B, cust("A", ", whose Bill Invoices To is saved as customer B"), cust("E", ", customer D's payer"),
   cust("D", ", whose Bill Invoices To is saved as customer E"),
   wo(1, "A", "in Estimate", "B", ", created after customer A's default was saved")],
  [OPEN_WO, CCB, "Pick customer D.", "Confirm the change.", LOG],
  [["Work order 1 opens for customer A."], ["The customer picker opens."], ["Customer D is picked."], ["The work order's customer is customer D."],
   ["The log shows today's customer change entry.",
    'It also shows a "Bill To changed" entry with "Bill To" from customer B\'s name to customer E\'s name, each a link.']],
  ["S13-R3"])
C("S13-05", S, "Plain Change Customer on a self-billed work order logs only that change",
  [ADMIN, A, cust("D", ", that bills itself"), wo(1, "A")],
  [OPEN_WO, CCB, "Pick customer D.", "Confirm the change.", LOG],
  [["Work order 1 opens for customer A."], ["The customer picker opens."], ["Customer D is picked."],
   ["The work order's customer is customer D.", '"Bill To" reads "This customer".'],
   ["The log shows today's customer change entry from customer A to customer D.", 'No "Bill To changed" entry was added.']],
  ["S13-N1"])
C("S13-06", S, "Without Customers View the log shows the names without links",
  [role("has 'Work orders → View' and 'View History Logs' but not 'Customers → View'"), A, B,
   wo(1, "A", "in Estimate", "B", ", whose Bill To was changed from customer A to customer B")],
  [OPEN_WO, LOG],
  [["Work order 1 opens for customer A."],
   ['The "Bill To changed" entry shows customer A\'s name and customer B\'s name.', "Neither name is a link."]],
  ["S13-N2"])
