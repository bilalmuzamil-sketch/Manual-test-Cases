"""Story 3 — Bill To on the work order and part sale Customer card (SV-12305): the field and its two readings, the list (first option,
A to Z, first 50, search, no match, never Counter Sale), saving at once, the saved default on new jobs, Split Work Order / Split Part
Sale / reopening a paid work order, New Work Order and New Part Sale unchanged, Counter Sale jobs, permissions, history mode, Open
statuses (Declined counts as Open), phones, and the two Error Handling lines (held)."""
from bt_lib import C, HOLD, UFS
from common import *

S = "S3"
A_SELF = cust("A", ", that bills itself")
B = cust("B", ", the payer")
NOW = "Make sure no customer's name contains \"zzqx\"."

C("S3-01", S, "Work order Customer card shows Bill To reading This customer",
  [ADMIN, A_SELF, wo(1, "A")],
  [OPEN_WO, EXPAND],
  [["Work order 1 opens for customer A."], [BT_SELF]],
  ["S3-R1", "S3-R2", "REL-2", "CORE-1", "T-BILL"])
C("S3-02", S, "Part sale Customer card shows Bill To reading This customer",
  [ADMIN, A_SELF, ps(1, "A")],
  [OPEN_PS, EXPAND],
  [["Part sale 1 opens for customer A."], [BT_SELF]],
  ["S3-R1", "S3-R2", "REL-2", "CORE-1"])
C("S3-03", S, "Bill To reads the payer's name when someone else pays",
  [ADMIN, A_SELF, B, wo(1, "A", "in Estimate", "B")],
  [OPEN_WO, EXPAND],
  [["Work order 1 opens for customer A."], [bt_reads("B"), "The customer shown at the top of the card is still customer A."]],
  ["S3-R2", "CORE-1", "T-CUST"])
C("S3-04", S, "Bill To list starts with (this customer), then customers A to Z",
  [ADMIN, A_SELF, wo(1, "A")],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [BT_SELF],
   ['The first option reads "[customer A\'s name] (this customer)".', "The customers after it are in A to Z order by name.",
    "The Counter Sale customer is not in the list."]],
  ["S3-R3", "CORE-5"], note=NAME_NOTE)
C("S3-05", S, "The Bill To list shows at most the first 50 customers",
  [ADMIN, A_SELF, wo(1, "A"), "Use an organization with more than 50 customers, so the list has more names than it can show."],
  [OPEN_WO, EXPAND, CLICK_BT, "Scroll to the end of the list."],
  [["Work order 1 opens for customer A."], [BT_SELF], ['The first option reads "[customer A\'s name] (this customer)".'],
   ["After the first option the list holds exactly 50 customers, the first 50 of the organization's customers A to Z."]],
  ["S3-R3"], note=NAME_NOTE)
C("S3-06", S, "Typing in Bill To narrows the list and keeps (this customer) first",
  [ADMIN, A_SELF, wo(1, "A"), cust("C", ", whose name contains a word that only one other new customer's name also contains"),
   cust("D", ", whose name contains the same word as customer C's")],
  [OPEN_WO, EXPAND, "Type that word in the Bill To field."],
  [["Work order 1 opens for customer A."], [BT_SELF],
   ['The list shows "[customer A\'s name] (this customer)" first, then customer C and customer D in A to Z order.',
    "No other customer is listed."]],
  ["S3-R3"], note=NAME_NOTE)
C("S3-07", S, "With no match the Bill To list shows only (this customer)",
  [ADMIN, A_SELF, wo(1, "A"), NOW],
  [OPEN_WO, EXPAND, 'Type "zzqx" in the Bill To field.'],
  [["Work order 1 opens for customer A."], [BT_SELF], ['Only "[customer A\'s name] (this customer)" is listed: the list is never empty.']],
  ["S3-R4"], note=NAME_NOTE)
C("S3-08", S, "Picking a customer saves the Bill To at once",
  [ADMIN, A_SELF, B, wo(1, "A")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list.", RELOAD, EXPAND],
  [["Work order 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B"), "No Save button is needed."],
   ["The page reloads."], [bt_reads("B")]],
  ["S3-R5", "CORE-5", "SBA-PICK"])
C("S3-09", S, "Picking (this customer) makes the customer pay for itself",
  [ADMIN, A_SELF, B, wo(1, "A", "in Estimate", "B")],
  [OPEN_WO, EXPAND, CLICK_BT, 'Pick "[customer A\'s name] (this customer)".', RELOAD, EXPAND],
  [["Work order 1 opens for customer A."], [bt_reads("B")], ["The list opens."], ['The "Bill To" field reads "This customer".'],
   ["The page reloads."], ['The "Bill To" field reads "This customer".']],
  ["S3-R5"], note=NAME_NOTE)
C("S3-10", S, "A new work order starts billed to the customer's saved default",
  [ADMIN, B, cust("A", ", whose Bill Invoices To is saved as customer B, with one asset, asset 1"), "Start on the Work Orders page."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Save the new work order.", EXPAND],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The new work order opens."], [bt_reads("B")]],
  ["S3-R6", "KD-DEF", "CORE-4", "GOAL-3"])
C("S3-11", S, "A new part sale starts billed to the customer's saved default",
  [ADMIN, B, cust("A", ", whose Bill Invoices To is saved as customer B"), "Start on the Part Sales page."],
  ["Click New Part Sale.", "Pick customer A.", "Save the new part sale.", EXPAND],
  [["The New Part Sale window opens."], ["Customer A is picked."], ["The new part sale opens."], [bt_reads("B")]],
  ["S3-R6", "KD-DEF", "GOAL-3"])
C("S3-12", S, "A new work order for a customer with no default bills that customer",
  [ADMIN, cust("A", ", that bills itself, with one asset, asset 1"), "Start on the Work Orders page."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Save the new work order.", EXPAND],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The new work order opens."], [BT_SELF]],
  ["S3-R6"])
C("S3-13", S, "New Work Order shows no Bill To field",
  [ADMIN, cust("A", ", whose Bill Invoices To is saved as another customer, so a default exists that the window could show"),
   "Start on the Work Orders page."],
  ["Click New Work Order.", "Pick customer A."],
  [["The New Work Order window opens."], ["Customer A is picked.", 'The window shows no "Bill To" or "Bill Invoices To" field.']],
  ["S3-R8", "OOS-04"])
C("S3-14", S, "New Part Sale shows no Bill To field",
  [ADMIN, cust("A", ", whose Bill Invoices To is saved as another customer, so a default exists that the window could show"),
   "Start on the Part Sales page."],
  ["Click New Part Sale.", "Pick customer A."],
  [["The New Part Sale window opens."], ["Customer A is picked.", 'The window shows no "Bill To" or "Bill Invoices To" field.']],
  ["S3-R8", "OOS-04"])
C("S3-15", S, "Split Work Order copies the Bill To to the new work order",
  [ADMIN, A_SELF, B, wo(1, "A", "in Approved", "B", ", with two approved lines, line 1 and line 2")],
  [OPEN_WO, "Open Split Work Order.", "Tick line 2.", "Confirm the split.", "Open the new work order made by the split.", EXPAND],
  [["Work order 1 opens for customer A."], ["The Split Work Order window opens."], ["Line 2 is ticked."], ["A new work order is made with line 2."],
   ["The new work order opens with customer A."], [bt_reads("B")]],
  ["S3-R7"])
C("S3-16", S, "Split Part Sale copies the Bill To to the new part sale",
  [ADMIN, A_SELF, B, ps(1, "A", "open", "B", ", with two parts, part 1 and part 2")],
  [OPEN_PS, "Open Split Part Sale.", "Tick part 2.", "Confirm the split.", "Open the new part sale made by the split.", EXPAND],
  [["Part sale 1 opens for customer A."], ["The Split Part Sale window opens."], ["Part 2 is ticked."], ["A new part sale is made with part 2."],
   ["The new part sale opens with customer A."], [bt_reads("B")]],
  ["S3-R7"])
C("S3-17", S, "Reopening a paid work order copies its Bill To to the new one",
  [ADMIN, A_SELF, B, wo(1, "A", "invoiced and paid in full by customer B", "B")],
  [OPEN_WO, "Reopen work order 1 onto a new work order.", "Open the new work order.", EXPAND],
  [["Work order 1 opens for customer A, with status Paid."], ["A new work order is made from work order 1."], ["The new work order opens with customer A."],
   [bt_reads("B"), "The Bill To field can be changed (the new work order is Open)."]],
  ["S3-R7"])
C("S3-18", S, "A Counter Sale work order can bill any other customer",
  [ADMIN, "Use the organization's Counter Sale customer.", B,
   "Have a new work order for this test, work order 1, for the Counter Sale customer, in Estimate, that bills itself."],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Work order 1 opens for the Counter Sale customer."], [BT_SELF], ['The first option reads "[Counter Sale customer\'s name] (this customer)".', "Customer B is offered."],
   [bt_reads("B")]],
  ["S3-R9"], note=NAME_NOTE)
C("S3-19", S, "A Counter Sale part sale can bill any other customer",
  [ADMIN, "Use the organization's Counter Sale customer.", B,
   "Have a new part sale for this test, part sale 1, for the Counter Sale customer, open, that bills itself."],
  [OPEN_PS, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Part sale 1 opens for the Counter Sale customer."], [BT_SELF], ["Customer B is offered."], [bt_reads("B")]],
  ["S3-R9"])
C("S3-20", S, "Counter Sale is never offered in the Bill To list",
  [ADMIN, A_SELF, wo(1, "A"), "Use the organization's Counter Sale customer, so its name can be typed."],
  [OPEN_WO, EXPAND, "Type the Counter Sale customer's name in the Bill To field."],
  [["Work order 1 opens for customer A."], [BT_SELF], ['Only "[customer A\'s name] (this customer)" is listed.', "The Counter Sale customer is not offered."]],
  ["S3-R3", "KD-CS", "T-CS"], note=NAME_NOTE)
C("S3-21", S, "Picking Counter Sale as a Bill To is refused",
  [ADMIN, A_SELF, wo(1, "A"), "Use the organization's Counter Sale customer."],
  [OPEN_WO, "Try to save the Counter Sale customer as work order 1's Bill To."],
  [["Work order 1 opens for customer A."],
   [f'The save is refused with "{CS_PICK}" as the app\'s standard error toast.', '"Bill To" still reads "This customer".']],
  ["EH-S3-1", UFS["D3-pick"], "KD-CS"],
  marker=HOLD("the Counter Sale customer is never offered in the field, so only a request sent from outside the screens reaches this refusal"))
C("S3-22", S, "Without Work orders Create & Edit, Bill To is read-only when someone else pays",
  [role("has 'Work orders → View' but not 'Work orders → Create & Edit'"), cust("A"), B, wo(1, "A", "in Estimate", "B")],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")], ["No list opens and the Bill To does not change: the field is read-only."]],
  ["S3-N1", "KD-PERM-WO", "KD-PERM-SEE", "KD-PERM-NONEW"])
C("S3-23", S, "Without Work orders Create & Edit, a self-billed card shows no Bill To",
  [role("has 'Work orders → View' but not 'Work orders → Create & Edit'"), A_SELF, wo(1, "A")],
  [OPEN_WO, EXPAND],
  [["Work order 1 opens for customer A."], ["The Customer card shows Authorizer.", 'No "Bill To" field shows.']],
  ["S3-N1", "KD-SHOW"])
C("S3-24", S, "Part sales Create & Edit alone is enough to change a part sale's Bill To",
  [role("has 'Part sales → Create & Edit' but not 'Work orders → Create & Edit'"), A_SELF, B, ps(1, "A")],
  [OPEN_PS, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Part sale 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B")]],
  ["KD-PERM-WO"], stories=[3])
C("S3-25", S, "Work orders Create & Edit alone is enough to change a part sale's Bill To",
  [role("has 'Work orders → Create & Edit' and 'Part sales → View' but not 'Part sales → Create & Edit'"), A_SELF, B, ps(1, "A")],
  [OPEN_PS, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Part sale 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B")]],
  ["KD-PERM-WO"], stories=[3])
C("S3-26", S, "Without either Create & Edit permission, a part sale's Bill To is read-only",
  [role("has 'Part sales → View' but neither 'Part sales → Create & Edit' nor 'Work orders → Create & Edit'"), cust("A"), B,
   ps(1, "A", "open", "B")],
  [OPEN_PS, EXPAND, CLICK_BT],
  [["Part sale 1 opens for customer A."], [bt_reads("B")], ["No list opens and the Bill To does not change."]],
  ["S3-N1", "KD-PERM-WO"])
C("S3-27", S, "In history mode the Bill To is read-only with no lock message",
  [ADMIN, cust("A"), B, wo(1, "A", "in Estimate", "B", ", with at least one earlier version in its history")],
  [OPEN_WO, "Open work order 1 in history mode.", EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], ["The work order shows in history mode."], [bt_reads("B")],
   ["No list opens, no tooltip shows and no error toast shows."]],
  ["S3-N2"])
C("S3-28", S, "In history mode a self-billed work order shows no Bill To",
  [ADMIN, A_SELF, wo(1, "A", "in Estimate", None, ", with at least one earlier version in its history")],
  [OPEN_WO, "Open work order 1 in history mode.", EXPAND],
  [["Work order 1 opens for customer A."], ["The work order shows in history mode."], ["The Customer card shows Authorizer.", 'No "Bill To" field shows.']],
  ["S3-N2"])
C("S3-29", S, "A Declined work order's Bill To can still be changed",
  [ADMIN, A_SELF, B, wo(1, "A", "in Declined")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list."],
  [["Work order 1 opens for customer A, with status Declined."], [BT_SELF], ["The list opens."], [bt_reads("B")]],
  ["T-OPEN", "SBA-PICK"], stories=[3])
C("S3-30", S, "If the Bill To save fails, an error toast shows and the old value stays",
  [ADMIN, A_SELF, B, wo(1, "A")],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B while the save cannot go through."],
  [["Work order 1 opens for customer A."], [BT_SELF], ["The list opens."],
   ["The app's standard error toast shows.", '"Bill To" goes back to "This customer".']],
  ["EH-S3-2"], marker=HOLD("a save failure cannot be caused from the screens; it needs the save to be made to fail"))
C("S3-31", S, "On a phone the Customer card shows the same Bill To field",
  [ADMIN, "Use a phone, or a browser window 390 pixels wide.", cust("A"), B, cust("C"), wo(1, "A", "in Estimate", "B")],
  [OPEN_WO, "Tap to open the work order details.", "Tap the Bill To field.", "Tap customer C in the list."],
  [["Work order 1 opens for customer A, in the phone layout."], ["The Customer card shows \"Bill To\" under Authorizer, reading customer B's name."],
   ["The searchable list opens without any hover."], ["\"Bill To\" reads customer C's name."]],
  ["FF-S3", "S3-R1", "S3-R5"])
