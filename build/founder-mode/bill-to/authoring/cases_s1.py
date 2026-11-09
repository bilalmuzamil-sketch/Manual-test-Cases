"""Story 1 — Saved default Bill To on the customer page (SV-12303): the "Bill Invoices To" line and Change, the Bill Invoices To window
(help line, searchable field, first option, clearing), new jobs only, the "Pays for" counter, tooltip and window, permissions, Counter
Sale, one hop, and the three Error Handling lines (held: a tester cannot reach them through the screens)."""
from bt_lib import C, HOLD, UFS
from common import *

S = "S1"
DEF_AB = cust("A", ", whose Bill Invoices To is saved as customer B in Edit Customer")
B = cust("B", ", the payer")
OPEN_A = "Open customer A's page."
OPEN_B = "Open customer B's page."
CHANGE = 'Click "Change" beside "Bill Invoices To" on the left card.'
FIELD = 'Click the "Bill Invoices To" field.'

C("S1-01", S, "Customer page shows Bill Invoices To with the payer's name",
  [ADMIN, B, DEF_AB],
  [OPEN_A],
  [['The left card shows a "Bill Invoices To" line with customer B\'s name.', '"Change" shows beside customer B\'s name.']],
  ["S1-R1", "S1-R2", "CORE-4", "T-DEF"])
C("S1-02", S, "Change opens the Bill Invoices To window with its help line and Save",
  [ADMIN, B, DEF_AB],
  [OPEN_A, CHANGE],
  [['The left card shows "Bill Invoices To" with customer B\'s name and "Change".'],
   ['A window titled "Bill Invoices To" opens.',
    'It shows the line "New work orders and part sales for [customer A\'s name] will be billed to this customer. Existing ones don\'t change."',
    'It has a "Bill Invoices To" field showing customer B\'s name.', 'It has a "Save" button.']],
  ["S1-R2", "S1-R3", "S1-R4", UFS["Help-window"]], note=NAME_NOTE)
C("S1-03", S, "The Bill Invoices To field searches customers by name",
  [ADMIN, cust("B", ", so customer A has a default and its card shows Change"), DEF_AB, cust("C", ", whose name contains a word no other customer's name contains")],
  [OPEN_A, CHANGE, "Type that word from customer C's name in the \"Bill Invoices To\" field."],
  [["The left card shows \"Bill Invoices To\" and \"Change\"."], ['The "Bill Invoices To" window opens.'],
   ['The list narrows to "[customer A\'s name] (this customer)" first, then customer C.', "No customer whose name lacks that word is listed."]],
  ["S1-R4", "S1-R5"], note=NAME_NOTE)
C("S1-04", S, "Picking (this customer) and saving clears the default",
  [ADMIN, B, DEF_AB],
  [OPEN_A, CHANGE, FIELD, 'Pick "[customer A\'s name] (this customer)".', SAVE],
  [["The left card shows \"Bill Invoices To\" with customer B's name."], ['The "Bill Invoices To" window opens.'],
   ['The first option reads "[customer A\'s name] (this customer)".'], ['The field shows "[customer A\'s name] (this customer)".'],
   ["The window closes.", 'Customer A\'s left card no longer shows a "Bill Invoices To" line or "Change".']],
  ["S1-R5", "S1-N1", "KD-SHOW"], note=NAME_NOTE)
C("S1-05", S, "A new default does not change an existing work order",
  [ADMIN, B, cust("A", ", that bills itself"), wo(1, "A", "in Estimate", None, ", created before the default is saved"), "Start on customer A's page."],
  ["Open customer A's Edit Customer window.", 'In "Bill Invoices To", pick customer B.', SAVE, OPEN_WO, EXPAND],
  [['"Bill Invoices To" reads "This customer".'], ["The field shows customer B's name."],
   ['The window closes and customer A\'s left card shows "Bill Invoices To" with customer B\'s name.'], ["Work order 1 opens."],
   [BT_SELF, "Work order 1 still bills customer A, although customer A now has a default."]],
  ["S1-R6", "T-DEF", "KD-DEF"])
C("S1-06", S, "Pays for counter shows the number of customers billed to the payer",
  [ADMIN, B, cust("A", ", whose Bill Invoices To is saved as customer B, so customer B pays for customer A"),
   cust("C", ", whose Bill Invoices To is also saved as customer B, so customer B pays for two customers")],
  [OPEN_B, 'Hover over the "Pays for" counter.'],
  [['A "Pays for" counter shows beside Contacts and Assets on customer B\'s card.', "The counter shows 2."],
   ['The tooltip reads "Customers billed to this customer by default".']],
  ["S1-R7", "S1-R8", UFS["Pays for"]])
C("S1-07", S, "Pays for window lists the customers A to Z with a line and Close",
  [ADMIN, B, cust("A", ", whose name starts with a letter after customer C's, and whose Bill Invoices To is saved as customer B"),
   cust("C", ", whose name starts with a letter before customer A's, and whose Bill Invoices To is saved as customer B")],
  [OPEN_B, 'Click the "Pays for" counter.', 'Click "Close".'],
  [['The "Pays for" counter shows 2.'],
   ['A window titled "[customer B\'s name] pays for" opens.', "It lists customer C first, then customer A (A to Z).",
    "Each name is a link.",
    'It shows the line "These customers bill new work orders and part sales to [customer B\'s name] by default."',
    'It has a "Close" button.'],
   ["The window closes and customer B's page stays open."]],
  ["S1-R9", "S1-R10", UFS["Pays for"]], note=NAME_NOTE)
C("S1-08", S, "A name in the Pays for window opens that customer's page",
  [ADMIN, B, DEF_AB],
  [OPEN_B, 'Click the "Pays for" counter.', "Click customer A's name in the window."],
  [['The "Pays for" counter shows 1.'], ["The window lists customer A as a link."], ["Customer A's page opens."]],
  ["S1-R9"])
C("S1-09", S, "A long Pays for list scrolls inside the window",
  [ADMIN, DESK, B, "Have twenty new customers for this test whose Bill Invoices To is saved as customer B, so the list is longer than the window."],
  [OPEN_B, 'Click the "Pays for" counter.', "Scroll the list inside the window to its end."],
  [['The "Pays for" counter shows 20.'],
   ["The window shows the first names of the list, A to Z, and a scroll bar inside the window.", 'The "Close" button stays visible.'],
   ["The list scrolls inside the window while the window's title and its \"Close\" button stay in place.", "The twentieth name, the last in A to Z order, shows."]],
  ["S1-R9"])
C("S1-10", S, "A customer that bills itself shows no Bill Invoices To line",
  [ADMIN, cust("A", ", that bills itself and has one contact, so the card has a Contacts counter to compare with")],
  [OPEN_A, "Open customer A's Edit Customer window."],
  [["The left card shows the Contacts counter.", 'The left card shows no "Bill Invoices To" line and no "Change".'],
   ['The "Bill Invoices To" field shows "This customer": the default is set here, not on the card.']],
  ["S1-N1", "KD-SHOW", "CORE-8"])
C("S1-11", S, "Without View and Manage AP/AR Data, Change is hidden",
  [role("has 'Customers → Create & Edit' but not 'View and Manage AP/AR Data'"), B, DEF_AB],
  [OPEN_A],
  [['The left card shows "Bill Invoices To" with customer B\'s name.', 'No "Change" shows beside the name.']],
  ["S1-N2", "KD-PERM-DEF", "KD-PERM-SEE"])
C("S1-12", S, "Without Customers Create & Edit, Change is hidden",
  [role("has 'Customers → View' and 'View and Manage AP/AR Data' but not 'Customers → Create & Edit'"), B, DEF_AB],
  [OPEN_A],
  [['The left card shows "Bill Invoices To" with customer B\'s name.', 'No "Change" shows beside the name.']],
  ["S1-N2", "KD-PERM-DEF", "KD-PERM-SEE"])
C("S1-13", S, "Counter Sale's page shows no Change for Bill Invoices To",
  [ADMIN, "Use the organization's Counter Sale customer."],
  ["Open the Counter Sale customer's page."],
  [["The Counter Sale customer's left card shows its usual details and counters.",
    'It shows no "Bill Invoices To" line and no "Change".']],
  ["S1-N3", "KD-CS", "T-CS"])
C("S1-14", S, "Pays for counter disappears when the count drops to 0",
  [ADMIN, B, DEF_AB],
  [OPEN_B, "Open customer A's Edit Customer window.", 'In "Bill Invoices To", pick "[customer A\'s name] (this customer)".', SAVE, OPEN_B],
  [['The "Pays for" counter shows 1.'], ['"Bill Invoices To" shows customer B\'s name.'], ['The field shows "[customer A\'s name] (this customer)".'],
   ["The window closes."], ["Customer B's page shows Contacts and Assets.", 'No "Pays for" counter shows.']],
  ["S1-N4", "S1-R5"], note=NAME_NOTE)
C("S1-15", S, "Counter Sale is never offered in the Bill Invoices To window",
  [ADMIN, B, DEF_AB, "Use the organization's Counter Sale customer, so its name can be typed."],
  [OPEN_A, CHANGE, "Type the Counter Sale customer's name in the \"Bill Invoices To\" field."],
  [["\"Change\" shows beside customer B's name."], ['The "Bill Invoices To" window opens.'],
   ['Only "[customer A\'s name] (this customer)" is listed.', "The Counter Sale customer is not offered."]],
  ["S1-N5", "KD-CS", "T-CS"], note=NAME_NOTE)
C("S1-16", S, "A new work order bills the payer, not the payer's own default",
  [ADMIN, cust("C"), cust("B", ", whose Bill Invoices To is saved as customer C"),
   cust("A", ", whose Bill Invoices To is saved as customer B, with one asset, asset 1"), "Start on the Work Orders page."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Save the new work order.", EXPAND],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The new work order opens."],
   [bt_reads("B"), "The Bill To is not customer C: one hop only."]],
  ["S1-E1", "KD-DEF", "S3-R6"])

# ---- Error Handling (held: no screen offers these, see NO-MANUAL-PROPOSAL.md) ------------------------------------------------------
C("S1-17", S, "Saving a default on Counter Sale is refused",
  [ADMIN, B, "Use the organization's Counter Sale customer."],
  ["Try to save customer B as the Counter Sale customer's Bill Invoices To."],
  [[f'The save is refused with "{CS_SAVE}" as the app\'s standard error toast, captioned "Please try to resolve this."',
    "The Counter Sale customer still bills itself."]],
  ["EH-S1-2", UFS["D3-save"], "KD-CS", "UFS-H2"],
  marker=HOLD("no screen offers a default on Counter Sale (the field is hidden there), so only a request sent from outside the screens reaches this refusal"))
C("S1-18", S, "Picking Counter Sale as another customer's default is refused",
  [ADMIN, cust("A"), "Use the organization's Counter Sale customer."],
  ["Try to save the Counter Sale customer as customer A's Bill Invoices To."],
  [[f'The save is refused with "{CS_PICK}" as the app\'s standard error toast.', 'Customer A\'s "Bill Invoices To" still reads "This customer".']],
  ["EH-S1-3", UFS["D3-pick"], "KD-CS"],
  marker=HOLD("the Counter Sale customer is never offered in the field, so only a request sent from outside the screens reaches this refusal"))
C("S1-19", S, "If saving a default fails, an error toast shows and the window stays open",
  [ADMIN, B, DEF_AB, cust("C")],
  [OPEN_A, CHANGE, 'In "Bill Invoices To", pick customer C.', "Click Save while the save cannot go through."],
  [["\"Change\" shows."], ['The "Bill Invoices To" window opens.'], ["The field shows customer C's name."],
   ["The app's standard error toast shows.", 'The "Bill Invoices To" window stays open with customer C picked.',
    'After a reload, customer A\'s card still shows "Bill Invoices To" with customer B\'s name.']],
  ["EH-S1-1"], marker=HOLD("a save failure cannot be caused from the screens; it needs the save to be made to fail"))
