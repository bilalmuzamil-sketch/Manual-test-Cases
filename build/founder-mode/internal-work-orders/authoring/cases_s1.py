"""Story 1 — Turn on Internal Work Orders, flag internal customers, manage categories (SV-11758): the toggle and its description, the
one-time turn-on modal, the hint lines, the Internal customer checkbox and badge, the Make internal and Remove flag dialogs, the
categories page and dialog, the asset's Internal category, archiving and restoring, permissions, edge cases, and the Error Handling
lines (held: a tester cannot make a save fail)."""
from iwo_lib import C, HOLD, NOMAN, PO_HOLD
from common import *

S = "S1"
NEWORG = "Use a new organization in which the Internal Work Orders setting has never been switched on."
SET = "Open Settings > Work Orders."
TOGGLE = 'Switch the "Internal Work Orders" toggle on.'
SAVESET = "Click Save settings."
CATS = "Open Administration > Service > Internal Work Orders."
EDITC = "Click Edit Customer on customer A's page."
OPEN_A = "Open customer A's page."
TICK = 'Tick the "Internal customer" checkbox.'
UNTICK = 'Untick the "Internal customer" checkbox.'
MODAL_TITLE = "Which customers are your own company?"
MI = "[n] open work orders for [customer] are billable. Make them internal? Prices, fees and discounts are removed; costs and hours are kept."

# ---- the toggle and the one-time modal -----------------------------------------------------------------------------------------
C("S1-01", S, "Settings shows the Internal Work Orders toggle, off, with its description",
  [ADMIN, NEWORG],
  [SET],
  [['A toggle "Internal Work Orders" shows on the tab, written in Title Case like the other toggles.', "The toggle is off.",
    'Its description reads "Lets you flag your own company as an internal customer and mark a customer\'s work order, or a single line of a '
    'billable work order, as No Charge (warranty, goodwill, comeback). Internal and no-charge work orders close without an invoice; their '
    'parts cost posts to the expense account of their category instead of Cost of Parts."']],
  ["S1-R1", "OV-0", "T-NAME"])
C("S1-02", S, "First turn-on opens the customer picker window with Save disabled",
  [ADMIN, NEWORG],
  [SET, TOGGLE],
  [['The toggle "Internal Work Orders" is off.'],
   [f'A window titled "{MODAL_TITLE}" opens.', "It has a customer picker with search, and no customer is picked.",
    'Under the picker the hint reads "Pick up to 50 customers here. Flag more from Edit Customer."',
    'The line "You can change this any time: Customers > Edit Customer > Internal customer." shows.',
    'It has the buttons "Do this later" and "Save"; "Save" is disabled.', "The window lists no customer as already flagged."]],
  ["S1-R2", "UFS-39", "ENTRY"])
C("S1-02b", S, "First turn-on window shows its explanation text",
  [ADMIN, NEWORG],
  [SET, TOGGLE],
  [['The toggle "Internal Work Orders" is off.'],
   [f'A window titled "{MODAL_TITLE}" opens.',
    'Its text reads "Work orders for these customers are internal: no prices and no invoice; parts cost posts to the expense account of '
    'their category when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the '
    'names can differ. Pick one or more, or do it later from the customer page."']],
  ["S1-R2", "UFS-01"], marker="PO:modal-text",
  note="The PRD's story text and its message summary give this window two different texts; this case follows the story text until the PO answers.")
C("S1-03", S, "Picking two customers and Save turns the setting on and flags both",
  [ADMIN, NEWORG, cust("A", " with no open work orders"), cust("B", " with no open work orders")],
  [SET, TOGGLE, "Type customer A's name in the customer picker.", "Pick customer A.", "Type customer B's name in the customer picker.",
   "Pick customer B.", SAVE, "Open the Customers list."],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["Customer A is offered."],
   ["Customer A shows as a chip with a remove control.", '"Save" becomes enabled.'], ["Customer B is offered."],
   ["Customer B shows as a second chip with a remove control."],
   ["The window closes.", "The toggle shows on.", "The hint lines show under the description.",
    "Nothing is left to save for this setting: leaving the page asks nothing about unsaved changes for it."],
   ['Customer A and customer B each show an "Internal" badge next to their name.']],
  ["S1-R2", "S1-R9", "GOAL-5", "PM-02"])
C("S1-03b", S, "A chip's remove control takes the customer out of the picker",
  [ADMIN, NEWORG, cust("A")],
  [SET, TOGGLE, "Type customer A's name in the customer picker.", "Pick customer A.", "Click the remove control on customer A's chip."],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["Customer A is offered."], ['Customer A shows as a chip and "Save" is enabled.'],
   ["Customer A's chip disappears.", '"Save" is disabled again.']],
  ["S1-R2"])
C("S1-04", S, "Do this later turns the setting on without flagging anyone",
  [ADMIN, NEWORG],
  [SET, TOGGLE, 'Click "Do this later".', RELOAD],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'],
   ["The window closes and the toggle shows on.",
    'Under the description the first hint reads "No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer > Internal customer. No Charge on customer work orders works now."'],
   ["The toggle is still on after the reload, so it was saved.", "The same \"No internal customer yet\" hint shows."]],
  ["S1-R5", "S1-R4", "UFS-03"])
C("S1-05", S, "Closing the window with X acts as Do this later",
  [ADMIN, NEWORG],
  [SET, TOGGLE, "Click the X at the top right of the window.", RELOAD],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["The window closes and the toggle shows on."],
   ["The toggle is still on after the reload.", 'The hint "No internal customer yet. …" shows under the description.']],
  ["S1-R2", "S1-R5"])
C("S1-06", S, "Esc and a click outside do not close the turn-on window",
  [ADMIN, NEWORG],
  [SET, TOGGLE, "Press Esc.", "Click outside the window, on the page behind it."],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["The window stays open."], ["The window stays open."]],
  ["S1-R2"])
C("S1-07", S, "The turn-on window opens only the first time",
  [ADMIN, NEWORG],
  [SET, TOGGLE, 'Click "Do this later".', 'Switch the "Internal Work Orders" toggle off.', SAVESET, TOGGLE],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["The window closes and the toggle shows on."],
   ["No window opens when the toggle goes off."], ["The setting is saved off and the hint lines are gone."],
   ["The toggle shows on and no window opens."]],
  ["S1-R2", "S1-R10"])
C("S1-08", S, "Save in the turn-on window saves only the toggle and the flags",
  [ADMIN, NEWORG, cust("A"), REVIEW_OFF],
  [SET, 'Switch "Require Review Before Completion" on, without saving.', TOGGLE, "Type customer A's name in the customer picker.", "Pick customer A.",
   SAVE, RELOAD],
  [["Settings > Work Orders opens."], ['"Require Review Before Completion" shows on but is not saved yet.'], [f'The "{MODAL_TITLE}" window opens.'],
   ["Customer A is offered."], ["Customer A shows as a chip."], ["The window closes and the toggle shows on."],
   ['"Internal Work Orders" is still on.', '"Require Review Before Completion" is back off: it waited for Save settings and was never saved.']],
  ["S1-R2"])
C("S1-09", S, "After Save, the Make internal window shows for each picked customer in turn",
  [ADMIN, NEWORG, cust("A", ", with one open work order, work order 1, in Estimate"), cust("B", ", with one open work order, work order 2, in Estimate")],
  [SET, TOGGLE, "Pick customer A in the customer picker.", "Pick customer B in the customer picker.", SAVE, 'Click "Keep billable".'],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["Customer A shows as a chip."], ["Customer B shows as a chip."],
   ["The turn-on window closes.", "A window opens reading \"1 open work orders for [customer A's name] are billable. Make them internal? Prices, fees and discounts are removed; costs and hours are kept.\"",
    "It lists work order 1."],
   ["A second window opens for customer B, with the same text naming customer B, and lists work order 2."]],
  ["S1-R2", "S1-R11", "UFS-04"], note=NAME_NOTE)
C("S1-10", S, "With QuickBooks connected, both hint lines show with their links",
  [ADMIN, ON, QB_ONLY, cust("A", ", flagged as an Internal customer, so the no-customer hint is not shown")],
  [SET, 'Click the "Internal Work Orders" link in the first hint line.'],
  [['Under the description two hint lines show, each with an info icon.',
    'The first reads "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set on each category."',
    'The second reads "Map their expense accounts in Integrations > QuickBooks." with the green QuickBooks mark, and "QuickBooks" is a link.'],
   ["Administration > Service > Internal Work Orders opens."]],
  ["S1-R3", "S1-R16"])
C("S1-10b", S, "The QuickBooks link in the hint opens Integrations > QuickBooks",
  [ADMIN, ON, QB_ONLY],
  [SET, 'Click the "QuickBooks" link in the second hint line.'],
  [['The second hint reads "Map their expense accounts in Integrations > QuickBooks."'], ["Integrations > QuickBooks opens."]],
  ["S1-R3"])
C("S1-11", S, "With AccountingHub only, the second hint names Account Mappings",
  [ADMIN, ON, AH],
  [SET],
  [["The second hint line names Accounting > Account Mappings instead of Integrations > QuickBooks.", "No QuickBooks mark or link shows in it."]],
  ["S1-R3"])
C("S1-12", S, "With both integrations, the second hint names both",
  [ADMIN, ON, "Make sure AccountingHub is enabled for the organization and the test location is also connected to QuickBooks Online."],
  [SET],
  [["The second hint line names both Integrations > QuickBooks and Accounting > Account Mappings."]],
  ["S1-R3"])
C("S1-13", S, "With no accounting integration, the second hint line is left out",
  [ADMIN, ON, NO_ACCT, "Make sure no other location of the organization is connected to QuickBooks Online."],
  [SET],
  [['Only one hint line shows under the description: "Manage categories in Internal Work Orders (Administration > Service). …" (or the no-customer hint).',
    "No line about mapping expense accounts shows."]],
  ["S1-R3"])
C("S1-14", S, "The no-customer hint goes away once a customer is flagged",
  [ADMIN, ON, "Make sure no customer of the organization carries the Internal customer flag.", cust("A")],
  [SET, EDITC, TICK, SAVE, SET],
  [['The first hint reads "No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer > Internal customer. No Charge on customer work orders works now."',
    "Nothing on the tab is required or blocked: Save settings works as usual."],
   ["The Edit Customer window opens."], ['The checkbox is ticked and "Default internal category" appears under it.'],
   ["The window closes and customer A shows the \"Internal\" badge."],
   ['The first hint now reads "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set on each category."']],
  ["S1-R4", "S1-R5", "UFS-03"])

# ---- Edit Customer checkbox, badge and the Make internal / Remove flag windows --------------------------------------------------
C("S1-15", S, "Edit Customer shows Internal customer as its last field with its helper",
  [ADMIN, ON, cust("A")],
  [OPEN_A, EDITC, TICK],
  [["Customer A's page opens."],
   ['The last field of the window is the checkbox "Internal customer", below "PO is required", unticked.',
    'Its helper reads "Work orders for this customer are internal: no prices, no invoice, parts cost posts to the expense account of the internal category."'],
   ['The select "Default internal category" appears under the checkbox with "General Internal" preselected.',
    "Its list holds the active Internal categories only."]],
  ["S1-R7", "PM-03"])
C("S1-16", S, "New Customer does not show the Internal customer checkbox",
  [ADMIN, ON],
  ["Open the Customers list.", "Click New Customer."],
  [["The Customers list opens."], ['The New Customer window opens with its usual fields, including "PO is required".',
    'There is no "Internal customer" checkbox and no "Default internal category" select.']],
  ["S1-R7", "ENTRY"])
C("S1-17", S, "Ticking Internal customer and saving flags the customer with a badge",
  [ADMIN, ON, cust("A", " with no open work orders")],
  [OPEN_A, EDITC, TICK, SAVE, "Open the Customers list."],
  [["The customer header shows no \"Internal\" badge."], ["The Edit Customer window opens."], ['"Default internal category" appears with "General Internal".'],
   ["The window closes with no Make internal window, since customer A has no open work orders.", 'The customer header shows an "Internal" badge next to customer A\'s name.'],
   ['Customer A\'s row shows the "Internal" badge next to its name.']],
  ["S1-R7", "S1-R8", "S1-R11", "PM-04", "T-IC", "OV-IC"])
C("S1-18", S, "The Internal badge shows on the customers list mobile card",
  [ON, PHONE, icust("A")],
  ["Open the Customers list.", "Search for customer A."],
  [["The customers list shows as cards."], ['Customer A\'s card shows the "Internal" badge next to its name.']],
  ["S1-R8", "FF-S1"])
C("S1-19", S, "Several customers can be flagged and search finds them",
  [ADMIN, ON, icust("A"), icust("B")],
  ["Open the Customers list.", "Search for customer B's name."],
  [["Customer A and customer B both show the \"Internal\" badge in the list.", "The list has no filter for internal customers."],
   ['Customer B is found and shows the "Internal" badge.']],
  ["S1-R9", "OOS-11"])
C("S1-20", S, "Settings never lists the flagged customers",
  [ADMIN, ON, icust("A")],
  [SET],
  [["The tab shows the toggle, its description and the hint lines.", "Customer A's name does not appear anywhere on the tab, while the Customers list shows customer A with its badge."]],
  ["S1-R2", "S1-R9", "KD-ORG"])
C("S1-21", S, "Unticking Internal customer asks first, and Cancel keeps it ticked",
  [ADMIN, ON, icust("A", " with no open work orders")],
  [OPEN_A, EDITC, UNTICK, "Click Cancel in the Remove the Internal flag window."],
  [['The header shows the "Internal" badge.'], ['"Internal customer" is ticked.'],
   ["Before anything is saved, a window opens titled \"Remove the Internal flag from [customer A's name]?\"",
    'Its text reads "New work orders for [customer A\'s name] will be billable." with no sentence about open internal work orders, since there are none.',
    'Its buttons are "Cancel" and "Remove flag".'],
   ['The window closes and "Internal customer" is still ticked.']],
  ["S1-R6", "S1-R12", "UFS-06"], note=NAME_NOTE)
C("S1-22", S, "Remove flag names the open internal work orders that stay internal",
  [ADMIN, ON, icust("A"), iwo(1, "A"), iwo(2, "A", "Approved")],
  [OPEN_A, EDITC, UNTICK, 'Click "Remove flag".', SAVE, OPEN_WO],
  [['The header shows the "Internal" badge.'], ['"Internal customer" is ticked.'],
   ["A window opens titled \"Remove the Internal flag from [customer A's name]?\"",
    "Its text reads \"2 open internal work orders for [customer A's name] stay internal and close without an invoice. New work orders for [customer A's name] will be billable.\""],
   ['The window closes and "Internal customer" is unticked.'],
   ['The Edit Customer window closes and the header no longer shows the "Internal" badge.'],
   ['Work order 1 still shows the "Internal" badge next to its status.', "Its lines still show no prices."]],
  ["S1-R6", "S1-R12", "S1-N5", "UFS-06", "KD-OFFER"], note=NAME_NOTE)
C("S1-23", S, "Closed and declined work orders are not counted when the flag is removed",
  [ADMIN, ON, icust("A"), iwo(1, "A"), iwo(2, "A", "closed"), iwo(3, "A", "Declined")],
  [OPEN_A, EDITC, UNTICK],
  [["Customer A's page opens."], ['"Internal customer" is ticked.'],
   ["The window's text reads \"1 open internal work orders for [customer A's name] stay internal …\": only work order 1 is counted.",
    "The window offers \"Remove flag\": removing the flag is not refused."]],
  ["S1-N5", "S1-R12"], note=NAME_NOTE)
C("S1-24", S, "After the flag is removed, closed and open internal work orders stay internal",
  [ADMIN, ON, icust("A"), iwo(1, "A"), iwo(2, "A", "closed")],
  [OPEN_A, EDITC, UNTICK, 'Click "Remove flag".', SAVE, "Open the work orders list.", "Open work order 2."],
  [["Customer A's page opens."], ['"Internal customer" is ticked.'], ["The Remove the Internal flag window opens."], ['"Internal customer" is unticked.'],
   ["The Edit Customer window closes."],
   ['Work order 1 shows the "Internal" badge.', 'Work order 2 shows the status "Closed" with the "Internal" badge.'],
   ['Work order 2 shows the status Closed with the "Internal" badge.']],
  ["S1-E1", "KD-WRITTEN", "S2-R13"])
C("S1-25", S, "Make internal window lists open billable work orders with their details",
  [ADMIN, ON, cust("A"), wo(1, "A", "in Estimate"), wo(2, "A", "Approved"), "Note each work order's number, location, unit and status."],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ['"Default internal category" appears.'],
   [f'A window reads "{MI}" with [n] = 2 and [customer] = customer A\'s name.',
    "Under the text it lists work order 1 and work order 2, one line each, with number, location, unit and status.",
    'Its buttons are "Keep billable" and "Make internal".']],
  ["S1-R11", "UFS-04", "PM-05"], note=NAME_NOTE)
C("S1-26", S, "Make internal makes the listed work orders internal",
  [ADMIN, ON, cust("A"), wo(1, "A", "in Estimate", ", with one approved labor line priced at the customer's labor rate")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Make internal".', OPEN_WO],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."], ["The Make internal window lists work order 1."],
   ["The window closes."],
   ['Work order 1 shows the "Internal" badge next to its status.', "Its labor line shows its hours and no Rate or Total.",
    "The work order shows no total, tax, fee or discount block."]],
  ["S1-R11", "S2-R7", "KD-OFFER", "S2-R13"])
C("S1-27", S, "Make internal counts Estimates and leaves out invoiced, paid and declined",
  [ADMIN, ON, cust("A"), wo(1, "A", "in Estimate"), wo(2, "A", "invoiced"), wo(3, "A", "paid"), wo(4, "A", "Declined")],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["The Make internal window reads \"1 open work orders for [customer A's name] are billable. …\".",
    "It lists work order 1 only.", "Work order 2, work order 3 and work order 4 are not listed."]],
  ["S1-R11"], note=NAME_NOTE)
C("S1-28", S, "Make internal shows ten rows and then and n more",
  [ADMIN, ON, cust("A"), "Have twelve new work orders for this test for customer A, all in Estimate."],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["The window reads \"12 open work orders for [customer A's name] are billable. …\".", "It lists ten work orders.",
    'Under the ten rows it reads "and 2 more".']],
  ["S1-R11", "UFS-04"], note=NAME_NOTE)
C("S1-29", S, "A work order with a deposit is noted and stays billable",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", with a deposit taken"), wo(2, "A", "in Estimate")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Make internal".', OPEN_WO],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ['Work order 1\'s row carries the note "Deposit: stays billable".', "Work order 2's row has no note."],
   ["The window closes."], ['Work order 1 shows no "Internal" badge and keeps its prices.', 'Work order 2 shows the "Internal" badge (open it to compare).']],
  ["S1-R11", "UFS-05"])
C("S1-30", S, "A work order with a posted vendor bill is noted in the Make internal window",
  [ADMIN, ON, QB_ONLY, cust("A"), wo(1, "A", "Approved", ", with a special-order part received against it and its vendor bill entered")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Make internal".', OPEN_WO],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ['Work order 1\'s row carries the note "Vendor bill: cost moves at Close".'],
   ['The window closes with no "Change where the cost is posted?" window for work order 1.'], ['Work order 1 shows the "Internal" badge.']],
  ["S1-R11", "UFS-05"])
C("S1-31", S, "Keep billable leaves the work orders billable",
  [ADMIN, ON, cust("A"), wo(1, "A", "in Estimate", ", with one approved labor line")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Keep billable".', OPEN_WO],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."], ["The Make internal window lists work order 1."],
   ["The window closes and customer A shows the \"Internal\" badge."],
   ['Work order 1 shows no "Internal" badge.', "Its labor line still shows its Rate and Total.", '"Create invoice" is still how it finishes.']],
  ["S1-R11"])
C("S1-32", S, "Saving Edit Customer again offers Make internal again",
  [ADMIN, ON, icust("A"), wo(1, "A", "in Estimate", ", left billable when customer A was flagged")],
  [OPEN_A, EDITC, SAVE, 'Click "Make internal".', OPEN_WO],
  [["Customer A shows the \"Internal\" badge."], ['"Internal customer" is ticked.'],
   ["The Make internal window opens again and lists work order 1."], ["The window closes."], ['Work order 1 shows the "Internal" badge.']],
  ["S1-R11"])
C("S1-33", S, "Open no-charge work orders are not listed and stay no charge",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill"), wo(2, "A", "in Estimate")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Make internal".', OPEN_WO, MENU],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["The Make internal window lists work order 2 only.", "Work order 1 is not listed."], ["The window closes."],
   ['Work order 1 still shows the "No Charge" badge, not "Internal".'],
   ['The menu still offers "Change category" and "Convert to Billable".']],
  ["S1-R11", "S2-N3"])
C("S1-34", S, "With no open billable work orders the Make internal window does not show",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced", ", so customer A has history but nothing open")],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["The Edit Customer window closes and customer A shows the \"Internal\" badge.", "No Make internal window opens."]],
  ["S1-R11"])
C("S1-35", S, "Make internal converts work orders at another location the user can access",
  [ADMIN, ON, "Use an organization with two locations, location A and location B, and a user with access to both.", cust("A"),
   wo(1, "A", "in Estimate", " at location B"), "Work at location A."],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Make internal".', "Switch to location B.", OPEN_WO],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["The Make internal window lists work order 1 with location B on its line."],
   ["The window closes and the app stays at location A."], ["Location B is current."], ['Work order 1 shows the "Internal" badge.']],
  ["S1-R11", "S1-E3"])
C("S1-36", S, "Work orders at locations the user cannot access are counted, not listed",
  [ADMIN, "Use an organization with two locations, location A and location B.", ON, cust("A"),
   wo(1, "A", "in Estimate", " at location A"), wo(2, "A", "in Estimate", " at location B"),
   "Sign in as a user who has access to location A only, with 'Customers — Create & Edit' and 'Work Orders — Create & Edit'."],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["The Make internal window lists work order 1 only.",
    'Under the list it reads "1 more at locations you don\'t have access to."', "Work order 2 is not listed."]],
  ["S1-R11"])
C("S1-37", S, "Without Work Orders Create & Edit the Make internal window only offers OK",
  [ON, cust("A"), wo(1, "A", "in Estimate"),
   role("has 'Customers — Create & Edit' but not 'Work Orders — Create & Edit'")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "OK".', OPEN_WO],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   [f'The window shows the same text ("{MI}") and lists work order 1.', 'Its only button is "OK".'],
   ['The window closes and customer A shows the "Internal" badge: the flag is saved.'],
   ['Work order 1 shows no "Internal" badge: it stays billable.']],
  ["S1-N6", "S1-R11", "UFS-04", "PM-05"], note=NAME_NOTE)

# ---- setting off and on again --------------------------------------------------------------------------------------------------
C("S1-38", S, "Turning the setting off hides the hints and badges and keeps the flags",
  [ADMIN, ON, icust("A"), iwo(1, "A")],
  [SET, 'Switch the "Internal Work Orders" toggle off.', SAVESET, OPEN_A, OPEN_WO],
  [["The hint lines show under the toggle's description."], ["No window opens."], ["The hint lines are gone."],
   ['The customer header shows no "Internal" badge.'],
   ['Work order 1 still shows the "Internal" badge next to its status.', 'It still offers "Close Work Order" where a billable work order offers "Create invoice".']],
  ["S1-R10", "S1-R8", "S2-N1"])
C("S1-39", S, "With the setting off, the customers list and mobile card show no Internal badge",
  [OFF, icust("A", ", flagged while the setting was on"), PHONE],
  ["Open the Customers list.", "Search for customer A."],
  [["The list shows as cards."], ['Customer A\'s card shows no "Internal" badge.']],
  ["S1-N4", "S1-R8"])
C("S1-40", S, "With the setting off, Edit Customer shows the flag ticked and read-only",
  [ADMIN, OFF, icust("A", ", flagged while the setting was on"), cust("B", ", not flagged, so the two windows can be compared")],
  [OPEN_A, EDITC, 'Click the "Settings" link in the line under the checkbox.', "Open customer B's page.", "Click Edit Customer on customer B's page."],
  [['The header shows no "Internal" badge.'],
   ['"Internal customer" shows ticked and cannot be changed.', 'Under it the line reads "Turn on Internal Work Orders in Settings to change this."'],
   ["Settings > Work Orders opens."], ["Customer B's page opens."], ['Customer B\'s Edit Customer window shows no "Internal customer" checkbox.']],
  ["S1-N4", "UFS-02"])
C("S1-41", S, "New work orders for a flagged customer are billable while the setting is off",
  [ADMIN, OFF, icust("A", ", flagged while the setting was on, with one asset, asset 1")],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Save the new work order."],
  [["The New Work Order window opens."], ['No "Internal" badge and no info icon show next to customer A.'], ["Asset 1 is picked."],
   ['The work order opens with no "Internal" badge.', 'It finishes with "Create invoice".']],
  ["S1-R10", "S2-N1"])
C("S1-42", S, "Turning the setting on again offers Make internal for flagged customers",
  [ADMIN, OFF, icust("A", ", flagged while the setting was on"), wo(1, "A", "in Estimate", ", created while the setting was off")],
  [SET, TOGGLE, SAVESET, 'Click "Make internal".', OPEN_WO],
  [["The toggle is off."], ["The toggle shows on and no turn-on window opens."],
   ["The hint lines show again.", "The Make internal window opens for customer A and lists work order 1."],
   ["The window closes."], ['Work order 1 shows the "Internal" badge.']],
  ["S1-R10", "S1-E4", "S1-R11", "UFS-04"])
C("S1-43", S, "A flagged customer is internal at every location",
  [ADMIN, ON, "Use an organization with two locations, location A and location B.", icust("A", ", with one asset, asset 1"), "Work at location B."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Save the new work order."],
  [["The New Work Order window opens."], ['The "Internal" badge shows next to customer A.'], ["Asset 1 is picked."],
   ['The new work order at location B shows the "Internal" badge.']],
  ["S1-E3", "KD-ORG"])
C("S1-44", S, "Deleting a flagged customer with no work orders removes it as usual",
  [ADMIN, ON, icust("A", " with no work orders"), icust("B", ", with one open internal work order, so a refused delete can be seen")],
  [OPEN_A, "Delete customer A.", "Open customer B's page.", "Delete customer B."],
  [["Customer A's page opens."], ["Customer A is deleted and is no longer in the Customers list."],
   ["Customer B's page opens."], ["The delete is refused as today for a customer with open work orders."]],
  ["S1-E2"])

# ---- categories page ------------------------------------------------------------------------------------------------------------
C("S1-45", S, "Internal categories tab lists its columns and General Internal as default",
  [ADMIN, ON, QB_ONLY],
  [CATS],
  [["The page has two tabs, Internal categories and No Charge categories.",
    "The Internal categories tab shows the columns Category, QuickBooks expense account (with the green QuickBooks mark), Internal customers using it, and Work orders.",
    'General Internal is listed with a "Default" badge.', "Each row has a menu with Edit and Archive.",
    'The buttons "New Internal Category" and "New No Charge Category" show.']],
  ["S1-R13", "S1-R16", "T-CAT", "KD-CAT"])
C("S1-46", S, "No Charge categories tab lists the three starting categories",
  [ADMIN, ON, QB_ONLY],
  [CATS, "Open the No Charge categories tab."],
  [["The Internal categories tab shows."],
   ["The tab shows the columns Category, QuickBooks expense account, Original work order and Work orders, and a row menu.",
    'Warranty and Comeback show "Required" under Original work order.', 'Goodwill shows "Not asked".',
    "No category named Policy is listed among the starting ones."]],
  ["S1-R13", "OOS-15", "T-CAT"])
C("S1-47", S, "An unmapped category shows Not set with a warning icon",
  [ADMIN, ON, QB_ONLY, "Have a new Internal category for this test, category A, with no QuickBooks expense account."],
  [CATS],
  [['Category A\'s QuickBooks expense account cell reads "Not set" with a warning icon.']],
  ["S1-R13"])
C("S1-48", S, "Work orders count includes a billable work order with a no-charge line",
  [ADMIN, ON, "Have a new No Charge category for this test, category A, used by nothing yet.", cust("A"),
   wo(1, "A", "in Estimate", ", billable, with one line marked No Charge under category A"),
   ncwo(2, "A", "category A", "in Estimate")],
  [CATS, "Open the No Charge categories tab."],
  [["The Internal categories tab shows."], ["Category A's Work orders count is 2: work order 2 and work order 1, the billable one with a no-charge line."]],
  ["S1-R13"])
C("S1-49", S, "The Internal customers using it column counts customers on the category",
  [ADMIN, ON, "Have a new Internal category for this test, category A.", icust("A", ", whose default internal category is category A"),
   icust("B", ", whose default internal category is category A")],
  [CATS],
  [["Category A shows 2 under Internal customers using it, counting customer A and customer B."]],
  ["S1-R13"])
C("S1-50", S, "General Internal cannot be archived",
  [ADMIN, ON],
  [CATS, "Open the row menu of General Internal."],
  [["General Internal shows the \"Default\" badge."], ["Archive is not available for General Internal, while Edit is."]],
  ["S1-R13", "S1-R16"])
C("S1-51", S, "Archived categories show under Show archived and can be restored",
  [ADMIN, ON, "Have a new No Charge category for this test, category A."],
  [CATS, "Open the No Charge categories tab.", "Open the row menu of category A.", "Click Archive.", 'Click the "Show archived (1)" link.', "Click Restore on category A."],
  [["The categories page opens."], ["Category A is listed."], ["The menu shows Edit and Archive."],
   ["Category A leaves the active list.", 'A link "Show archived (1)" shows.'], ["Category A is listed with Restore."],
   ["Category A is back in the active list."]],
  ["S1-R13", "S1-R16"])
C("S1-52", S, "With the setting off the categories page shows a notice and stays editable",
  [ADMIN, OFF],
  [CATS, 'Click "New No Charge Category".'],
  [['A notice reads "Internal Work Orders is off. Turn it on in Settings > Work Orders."', "Both tabs still list the categories."],
   ['The "New No Charge Category" window opens: the lists stay editable.']],
  ["S1-R13"])
C("S1-53", S, "At 100 active categories the New button is disabled with a message",
  [ADMIN, ON, "Have 100 active No Charge categories in the organization (the three starting ones and 97 new ones made for this test)."],
  [CATS, "Open the No Charge categories tab.", 'Hover over the "New No Charge Category" button.'],
  [["The categories page opens."], ["The list holds 100 active categories."],
   ['The button is disabled with the message "You can have up to 100 active categories in this list. Archive one to add another."']],
  ["S1-R13", "UFS-38"])
C("S1-54", S, "The QuickBooks column shows only at a location connected to QuickBooks",
  [ADMIN, ON, "Use an organization with two locations: location A connected to QuickBooks Online, location B not connected."],
  ["Work at location A.", CATS, "Switch to location B.", RELOAD],
  [["Location A is current."], ["The QuickBooks expense account column shows."], ["Location B is current."],
   ["The QuickBooks expense account column is not shown; the other columns stay."]],
  ["S1-R13"])
C("S1-55", S, "The categories page needs Settings — Service",
  [ON, role("has every setting except 'Settings — Service'")],
  [CATS],
  [["The page is not available to this user, as every Administration > Service page is not."]],
  ["PM-R2", "S1-R13"])

# ---- category dialog -----------------------------------------------------------------------------------------------------------
C("S1-56", S, "New No Charge Category shows its fields and helpers",
  [ADMIN, ON, QB_ONLY],
  [CATS, 'Click "New No Charge Category".'],
  [["The categories page opens."],
   ['A window titled "New No Charge Category" opens with Name (required).',
    'It has "QuickBooks expense account", one picker for each connected location, with the green QuickBooks mark and the helper "One per connected location, picked from the chart that is already in QuickBooks. Parts cost of this category posts here instead of Cost of Parts. Empty: posts to the ShopView Review account until you pick one."',
    'It has the checkbox "Requires the original work order" with the helper "The work order asks which earlier work order the job comes from, or Not in ShopView. Optional when the work order is created, required at Close."']],
  ["S1-R14", "S1-R16"])
C("S1-57", S, "New Internal Category shows the Default category checkbox",
  [ADMIN, ON, QB_ONLY],
  [CATS, 'Click "New Internal Category".'],
  [["The categories page opens."],
   ['A window titled "New Internal Category" opens with Name and the QuickBooks expense account pickers.',
    'It has the checkbox "Default category" with the helper "Used by internal customers that have no category of their own. One default at a time; it cannot be archived."',
    'It has no "Requires the original work order" checkbox.']],
  ["S1-R14"])
C("S1-58", S, "A new No Charge category is saved and offered on work orders",
  [ADMIN, ON, cust("A")],
  [CATS, 'Click "New No Charge Category".', "Type a new name in Name.", SAVE, "Click New Work Order.", "Pick customer A.", 'Tick "No Charge".', "Open the Category select."],
  [["The categories page opens."], ["The window opens."], ["The name shows in Name."], ["The window closes and the new category is listed on the No Charge categories tab."],
   ["The New Work Order window opens."], ['The "No Charge" checkbox shows.'], ['The "Category" select appears.'], ["The new category is offered with Warranty, Goodwill and Comeback."]],
  ["S1-R14", "T-CAT"])
C("S1-59", S, "A name used by an archived category is refused",
  [ADMIN, ON, "Have a new No Charge category for this test, category A, archived."],
  [CATS, 'Click "New No Charge Category".', "Type category A's name in Name.", SAVE],
  [["The categories page opens."], ["The window opens."], ["The name shows."],
   ['The save is refused with "A category with this name is archived. Restore it instead."', "The window stays open."]],
  ["S1-R14"])
C("S1-60", S, "A name used by an active category in the same list is refused",
  [ADMIN, ON],
  [CATS, 'Click "New No Charge Category".', 'Type "Goodwill" in Name.', SAVE],
  [["The categories page opens."], ["The window opens."], ['"Goodwill" shows.'], ["The category is not saved and the window stays open.", "The No Charge list still holds one Goodwill."]],
  ["S1-R14"])
C("S1-61", S, "A category name takes at most 60 characters",
  [ADMIN, ON],
  [CATS, 'Click "New Internal Category".', "Type a name of 61 characters in Name."],
  [["The categories page opens."], ["The window opens."], ["Name holds at most 60 characters: the 61st is not accepted."]],
  ["S1-R14"])
C("S1-62", S, "Without Settings — Integrations the account pickers are read-only",
  [ON, QB_ONLY, role("has 'Settings — Service' but not 'Settings — Integrations'")],
  [CATS, "Open the row menu of General Internal.", "Click Edit."],
  [["The categories page opens."], ["The menu shows Edit."],
   ['The QuickBooks expense account shows as read-only with the text "Set in Integrations > QuickBooks".', "The Name can still be edited."]],
  ["S1-R14", "PM-R2"])
C("S1-63", S, "With AccountingHub on, the category dialog shows the hub mapping read-only",
  [ADMIN, ON, AH],
  [CATS, "Open the row menu of General Internal.", "Click Edit."],
  [["The categories page opens."], ["The menu shows Edit."],
   ["The window shows the AccountingHub account of General Internal as read-only text, not as a picker."]],
  ["S1-R14", "S6-R1"])
C("S1-64", S, "A user sees the account pickers of the locations they can access only",
  [ON, "Use an organization with two locations, location A and location B, both connected to QuickBooks Online.",
   role("has 'Settings — Service' and 'Settings — Integrations', with access to location A only"),
   "Have a second user with access to both locations, so the mapping at location B can be checked after."],
  [CATS, "Open the row menu of Goodwill.", "Click Edit.", "Pick an expense account in location A's picker.", SAVE],
  [["The categories page opens."], ["The menu shows Edit."], ["The window shows one QuickBooks expense account picker, for location A.", "No picker shows for location B."],
   ["The account shows in location A's picker."], ["The window closes. Signed in as the second user, Goodwill's account at location B is unchanged."]],
  ["S1-R14"])
C("S1-65", S, "Making a new category the default moves the Default badge",
  [ADMIN, ON, "Have a new Internal category for this test, category A.", icust("A", ", whose default internal category is General Internal")],
  [CATS, "Open the row menu of category A.", "Click Edit.", 'Tick "Default category".', SAVE, OPEN_A, EDITC],
  [["The categories page opens."], ["The menu shows Edit."], ["The window opens."], ["The checkbox is ticked."],
   ['Category A shows the "Default" badge.', 'General Internal no longer shows it.'], ["Customer A's page opens."],
   ['Customer A\'s "Default internal category" still shows General Internal: changing the default moved nothing on existing customers.']],
  ["S1-R14", "S1-R16"])
C("S1-66", S, "Renaming a category keeps it on closed work orders and in the report filter",
  [ADMIN, ON, "Have a new No Charge category for this test, category A.", cust("A"), ncwo(1, "A", "category A", "closed")],
  [CATS, "Open the No Charge categories tab.", "Open the row menu of category A.", "Click Edit.", "Change the Name to a new name.", SAVE, OPEN_WO, FIN],
  [["The categories page opens."], ["Category A is listed."], ["The menu shows Edit."], ["The window opens with category A's name."], ["The new name shows."],
   ["The list shows the new name."], ["Work order 1 opens."], ['The NO CHARGE document reads "Category: [new name]".']],
  ["S1-R16"], note=NAME_NOTE)
C("S1-67", S, "An archived category stays on work orders and is no longer offered",
  [ADMIN, ON, "Have a new No Charge category for this test, category A.", cust("A"), ncwo(1, "A", "category A")],
  [CATS, "Open the No Charge categories tab.", "Open the row menu of category A.", "Click Archive.", OPEN_WO, MENU, "Click Change category.", "Open the Category select."],
  [["The categories page opens."], ["Category A is listed."], ["The menu shows Archive."], ["Category A leaves the active list."], ["Work order 1 opens."],
   ['The menu shows "Change category".'], ['The window opens with category A preselected.'], ["Category A is not offered in the list; the active No Charge categories are."]],
  ["S1-R16", "S12-E4"])
C("S1-68", S, "Archiving a category used as a default warns and names the counts",
  [ADMIN, ON, "Have a new Internal category for this test, category A.", icust("A", ", whose default internal category is category A"),
   icust("B", ", with one asset, asset 1, whose Internal category is category A")],
  [CATS, "Open the row menu of category A.", "Click Archive."],
  [["The categories page opens."], ["The menu shows Archive."],
   ['Before archiving, a message reads "1 internal customers and 1 assets use this category as their default. Their new work orders will use the next category in line."']],
  ["S1-R16"], note="Customer A uses category A as its default and customer B's asset 1 uses it as the asset's category.")
C("S1-69", S, "An archived default shows as archived on the customer with a hint",
  [ADMIN, ON, "Have a new Internal category for this test, category A, archived after it was set on customer A.",
   icust("A", ", whose default internal category is category A")],
  [OPEN_A, EDITC],
  [["Customer A's page opens."],
   ['"Default internal category" shows "[category A\'s name] (archived)" with the hint "Archived. Pick an active category."']],
  ["S1-R16"], note=NAME_NOTE)
C("S1-70", S, "A new work order skips an archived category and uses the next in line",
  [ADMIN, ON, "Have two new Internal categories for this test, category A and category B; category A was archived after it was set on asset 1.",
   icust("A", ", whose default internal category is category B, with one asset, asset 1, whose Internal category is category A")],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Hover over the info icon next to the Internal badge."],
  [["The New Work Order window opens."], ['The "Internal" badge shows next to customer A.'], ["Asset 1 is picked."],
   ['The tooltip reads "Internal customer: no prices, no invoice. Posts to [category B\'s name], from the customer.": the archived asset category is skipped.']],
  ["S1-R16", "S2-R1"], note=NAME_NOTE)
C("S1-71", S, "Restoring a category puts it back on the customer as before",
  [ADMIN, ON, "Have a new Internal category for this test, category A, archived after it was set on customer A.",
   icust("A", ", whose default internal category is category A")],
  [CATS, 'Click the "Show archived" link.', "Click Restore on category A.", OPEN_A, EDITC],
  [["The categories page opens."], ["Category A is listed with Restore."], ["Category A is back in the active list."], ["Customer A's page opens."],
   ['"Default internal category" shows category A\'s name with no "(archived)" and no hint.']],
  ["S1-R16"])
C("S1-72", S, "The green QuickBooks mark shows wherever a field maps to QuickBooks",
  [ADMIN, ON, QB_ONLY, icust("A", ", with one asset, asset 1")],
  [SET, CATS, "Open the row menu of General Internal.", "Click Edit.", "Open asset 1's Edit Asset window."],
  [["The QuickBooks hint line shows the green QuickBooks mark."], ["The QuickBooks expense account column shows the mark."],
   ["The menu shows Edit."], ["The account picker shows the mark."], ['The "Internal category" helper is led by the mark.']],
  ["S1-R16"])

# ---- asset Internal category ---------------------------------------------------------------------------------------------------
C("S1-73", S, "Edit Asset of an internal customer shows the Internal category field",
  [ADMIN, ON, icust("A", ", whose default internal category is General Internal, with one asset, asset 1")],
  ["Open asset 1's page.", "Click Edit Asset.", 'Open the "Internal category" select.'],
  [["Asset 1's page opens."],
   ['After the existing fields and under a divider, the select "Internal category" shows empty.',
    'Its helper, led by the green QuickBooks mark, reads "Categories are mapped to QuickBooks expense accounts. This one is where the asset\'s internal work orders post. Leave it empty to use the customer\'s category, General Internal."'],
   ["It lists the active Internal categories."]],
  ["S1-R15"])
C("S1-74", S, "Edit Asset of a regular customer shows no Internal category field",
  [ADMIN, ON, cust("A", ", not flagged, with one asset, asset 1"), icust("B", ", with one asset, asset 2, so the two windows can be compared")],
  ["Open asset 1's page.", "Click Edit Asset.", "Open asset 2's page.", "Click Edit Asset."],
  [["Asset 1's page opens."], ['The window shows no "Internal category" field.'], ["Asset 2's page opens."], ['The window shows the "Internal category" field.']],
  ["S1-R15"])
C("S1-75", S, "Edit Asset hides the Internal category field while the setting is off",
  [ADMIN, OFF, icust("A", ", flagged while the setting was on, with one asset, asset 1")],
  ["Open asset 1's page.", "Click Edit Asset."],
  [["Asset 1's page opens."], ['The window shows its existing fields and no "Internal category" field.']],
  ["S1-R15"])

# ---- permissions ---------------------------------------------------------------------------------------------------------------
C("S1-76", S, "Without Settings — App, Settings > Work Orders is not available",
  [ON, role("has every setting except 'Settings — App'")],
  ["Open Settings."],
  [["Settings > Work Orders is not available to this user, as today."]],
  ["S1-N1", "PM-01", "KD-PERM"])
C("S1-77", S, "With Settings — App only, the turn-on window still flags customers",
  [NEWORG, cust("A", " with no open work orders"), role("has 'Settings — App' but not 'Customers — Create & Edit'")],
  [SET, TOGGLE, "Pick customer A in the customer picker.", SAVE, "Open the Customers list."],
  [["The toggle is off."], [f'The "{MODAL_TITLE}" window opens.'], ["Customer A shows as a chip."], ["The window closes and the toggle shows on."],
   ['Customer A shows the "Internal" badge.', "Customer A's page offers no Edit Customer to this user."]],
  ["S1-N2", "PM-02"])
C("S1-78", S, "Without Customers Create & Edit, Edit Customer is not available",
  [ON, cust("A"), role("has 'Customers — View' but not 'Customers — Create & Edit'")],
  [OPEN_A],
  [["Customer A's page opens with no Edit Customer, as today, so the Internal customer checkbox cannot be reached."]],
  ["S1-N3", "PM-03"])

# ---- Error Handling (held: no screen can make a save fail; see NO-MANUAL-PROPOSAL.md) ---------------------------------------------
C("S1-79", S, "A failed flag save shows an alert and keeps the window open",
  [ADMIN, ON, cust("A")],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ['When the save fails, an alert toast that must be dismissed reads "Could not save the internal customer. Try again."', "The window stays open with the checkbox ticked."]],
  ["EH-S1-1", "UFS-42"], marker=NOMAN("the save has to fail, which only a developer can make happen"))
C("S1-80", S, "A partly failed Make internal keeps the flag and names the count",
  [ADMIN, ON, cust("A"), wo(1, "A", "in Estimate"), wo(2, "A", "in Estimate")],
  [OPEN_A, EDITC, TICK, SAVE, 'Click "Make internal".'],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."], ["The Make internal window lists two work orders."],
   ['When some conversions fail, an alert toast that must be dismissed reads "[n] work orders could not be made internal. Open Edit Customer and save to try again."',
    "The flag stays saved and the work orders already changed stay internal."]],
  ["EH-S1-2"], marker=NOMAN("some conversions have to fail, which only a developer can make happen"), note=NAME_NOTE)
C("S1-81", S, "While a flag save runs, the button shows a spinner and ignores a second press",
  [ADMIN, ON, cust("A")],
  [OPEN_A, EDITC, TICK, SAVE],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."],
   ["While the save runs, Save shows a spinner and is disabled.", "A second press does nothing."]],
  ["EH-S1-3"], marker=NOMAN("the save finishes too fast to press twice; it needs a slowed connection a developer sets up"))
C("S1-82", S, "Every flag write is refused without the permission",
  [cust("A"), role("has 'Customers — View' but not 'Customers — Create & Edit'")],
  [OPEN_A],
  [["Customer A's page offers no Edit Customer.", "A request to set the flag made outside the screens is refused with 403."]],
  ["PM-R1"], marker=NOMAN("the refusal is only reachable with a request sent outside the page"))
