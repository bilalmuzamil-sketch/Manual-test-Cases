"""Story 4 — Authorizer list when someone else pays (SV-12306): order of the list and the customer name on a second line, a payer's
contact saved and printed as Authorizer, clearing on a Bill To change and on Change Customer, today's list when the customer pays for
itself, a customer's Authorizer that stays, a contact of any other customer refused (two tabs), and the phone list."""
from bt_lib import C, HOLD
from common import *

S = "S4"
A2 = cust("A", ", with two contacts, contact A1 and contact A2, that can be picked as Authorizer")
B2 = cust("B", ", the payer, with two contacts, contact B1 and contact B2, that can be picked as Authorizer")
AUTH = "Click the Authorizer field."

C("S4-01", S, "Authorizer list: No authorizer, the customer's contacts, then the payer's",
  [ADMIN, A2, B2, wo(1, "A", "in Estimate", "B")],
  [OPEN_WO, EXPAND, AUTH],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['The list starts with "No authorizer".', "Contact A1 and contact A2 come next.", "Contact B1 and contact B2 come last.",
    "Each contact shows its customer's name on a second line: customer A's name under contacts A1 and A2, customer B's name under contacts B1 and B2."]],
  ["S4-R1", "S4-R2", "KD-AUTH"])
C("S4-02", S, "A payer's contact can be saved as Authorizer and prints on the estimate",
  [ADMIN, cust("A"), B2, wo(1, "A", "in Estimate", "B", ", with one line, so the estimate has something to print")],
  [OPEN_WO, EXPAND, AUTH, "Pick contact B1.", RELOAD, FIN],
  [["Work order 1 opens for customer A."], [bt_reads("B")], ["Contact B1 is in the list, with customer B's name on its second line."],
   ["Authorizer shows contact B1."], ["After the reload, Authorizer still shows contact B1."],
   ["The estimate on the Finance tab names contact B1 as the authorizer."]],
  ["S4-R3"])
C("S4-03", S, "Changing the Bill To clears an Authorizer from the previous payer",
  [ADMIN, cust("A"), B2, cust("C"), wo(1, "A", "in Estimate", "B", ", with contact B1 saved as Authorizer")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer C in the list."],
  [["Work order 1 opens for customer A."], ["Authorizer shows contact B1.", bt_reads("B")], ["The list opens."],
   [bt_reads("C"), 'Authorizer is cleared and reads "No authorizer".', "No message shows about the Authorizer."]],
  ["S4-R4"])
C("S4-04", S, "Change Customer clears an Authorizer from a payer that stays",
  [ADMIN, cust("A", ", that bills itself"), B2, cust("D", ", that bills itself"),
   wo(1, "A", "in Estimate", "B", ", where customer B was picked on the Customer card, with contact B1 saved as Authorizer")],
  [OPEN_WO, EXPAND, "Click Change Customer (the two arrows at the top right of the Customer card).", "Pick customer D.", "Confirm the change."],
  [["Work order 1 opens for customer A."], ["Authorizer shows contact B1.", bt_reads("B")], ["The customer picker opens."], ["Customer D is picked."],
   ["The work order's customer is customer D.", bt_reads("B"), 'Authorizer is cleared and reads "No authorizer".']],
  ["S4-R5", "S6-R2"])
C("S4-05", S, "When the customer pays for itself the Authorizer list is one line per contact",
  [ADMIN, cust("A", ", that bills itself, with two contacts, contact A1 and contact A2, that can be picked as Authorizer"), wo(1, "A")],
  [OPEN_WO, EXPAND, AUTH],
  [["Work order 1 opens for customer A."], [BT_SELF],
   ['The list shows "No authorizer", then contact A1 and contact A2.', "Each contact shows on one line, with no customer name under it."]],
  ["S4-N1"])
C("S4-06", S, "An Authorizer from the customer stays when the Bill To changes",
  [ADMIN, A2, cust("B"), wo(1, "A", "in Estimate", None, ", with contact A1 saved as Authorizer")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Work order 1 opens for customer A."], ["Authorizer shows contact A1."], ["The list opens."], [bt_reads("B"), "Authorizer still shows contact A1."]],
  ["S4-N2"])
C("S4-07", S, "A contact of a customer that no longer pays is refused as Authorizer",
  [ADMIN, cust("A"), B2, cust("C"), wo(1, "A", "in Estimate", "B"), "Open work order 1 in two browser tabs."],
  ["In the first tab, expand the Customer card.", "In the first tab, click the Authorizer field.", "Switch to the second tab.", EXPAND,
   CLICK_BT, "Pick customer C in the list.", "Switch to the first tab.", "Pick contact B1 in the Authorizer list."],
  [[bt_reads("B")], ["Contact B1 is offered."], ["The second tab shows work order 1 for customer A."], [bt_reads("B")], ["The list opens."],
   [bt_reads("C")], ["The first tab still shows the open Authorizer list."],
   ["The pick is refused, as a contact of any other customer is refused today.", "After a reload, Authorizer does not show contact B1."]],
  ["S4-N3"])
C("S4-08", S, "On a phone the Authorizer list shows the payer's contacts with names",
  [ADMIN, "Use a phone, or a browser window 390 pixels wide.", A2, B2, wo(1, "A", "in Estimate", "B")],
  [OPEN_WO, "Tap to open the work order details.", "Tap the Authorizer field."],
  [["Work order 1 opens for customer A, in the phone layout."], [bt_reads("B")],
   ['The list shows "No authorizer", contacts A1 and A2, then contacts B1 and B2.', "Each contact shows its customer's name on a second line."]],
  ["FF-S4", "S4-R1", "S4-R2"])
