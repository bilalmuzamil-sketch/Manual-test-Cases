"""Story 4 — Reopen a closed internal or no-charge work order (SV-11761): Reopen Work Order in the Finance tab's invoice menu, its
window, what Reopen does (Complete, classification, shop supplies, Convert and Change category back, parts back to stock), closing again,
vendor bills, the flag or setting removed after Close, the permission, and the Error Handling lines. The books side of Reopen is in
Stories 7 and 8."""
from iwo_lib import C, NOMAN
from common import *

S = "S4"
INVMENU = "Open the invoice menu on the Finance tab."
REOPEN = 'Click "Reopen Work Order".'
REOPEN_OK = "Click Reopen Work Order in the window."
BODY = "The work order leaves Closed · Internal and goes back to Complete. The parts cost and shop supplies entries are reversed in your books."

C("S4-01", S, "Reopen Work Order sits in the invoice menu where Reverse would be",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed"), cust("B"), wo(2, "B", "invoiced", ", billable, so Reverse can be compared")],
  [OPEN_WO, FIN, INVMENU, "Open work order 2.", FIN, INVMENU],
  [['The header shows the "Closed on …" line and no Reopen button.'], ["The document shows."],
   ['The menu offers "Reopen Work Order" and no "Issue Credit".'], ["Work order 2 opens."], ["The document shows."], ['The menu offers "Reverse".']],
  ["S4-R1", "S4-N2"])
C("S4-02", S, "Reopen opens its window with the reversal sentence",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, FIN, INVMENU, REOPEN],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'],
   ["A window titled \"Reopen work order [number]?\" opens.", f'Its text reads "{BODY}"', 'Its buttons are "Cancel" and "Reopen Work Order".']],
  ["S4-R2", "UFS-24"], note=NAME_NOTE)
C("S4-03", S, "A no-charge work order's Reopen window says Closed · No Charge",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "closed")],
  [OPEN_WO, FIN, INVMENU, REOPEN],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'],
   ['The text reads "The work order leaves Closed · No Charge and goes back to Complete. The parts cost and shop supplies entries are reversed in your books."']],
  ["S4-R2"])
C("S4-04", S, "Dismissing the Reopen window with Esc does nothing",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, FIN, INVMENU, REOPEN, "Press Esc.", "Click Cancel."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ["The window stays open."],
   ["The window closes and the work order is still Closed."]],
  ["S4-R2"])
C("S4-05", S, "Reopen returns an internal work order to Complete with its shop supplies",
  [ADMIN, ON, NO_ACCT, icust("A"), iwo(1, "A", "closed", ", whose Shop supplies amount is $15.00")],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK, "Open the Notes tab."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['The status reads "Complete" with the "Internal" badge.', '"Shop supplies" still reads $15.00.', "The NO CHARGE document is gone from the Finance tab.",
    '"Close Work Order" is offered again.'],
   ["A system note records the Reopen with the user and the time."]],
  ["S4-R3", "S2-R18", "S2-R13"])
C("S4-06", S, "Reopen gives a no-charge work order back its Convert and Change category",
  [ADMIN, ON, NO_ACCT, cust("A"), ncwo(1, "A", "Goodwill", "closed")],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK, MENU],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['The status reads "Complete" with the "No Charge" badge.'], ['The menu offers "Change category" and "Convert to Billable" again.']],
  ["S4-R3", "S2-R9"])
C("S4-07", S, "Reopen returns the picked parts to inventory",
  [ADMIN, ON, NO_ACCT, "Have a new inventory part for this test, part A, at a cost of $40.00.", icust("A"),
   iwo(1, "A", "closed", ", closed with 2 of part A picked from stock"), "Note part A's quantity on hand."],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK, "Open part A in Inventory."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'],
   ["Part A's quantity on hand is the noted figure plus 2, as Reverse returns parts today."]],
  ["S4-R3"])
C("S4-08", S, "Closing again after Reopen uses the new posting date",
  [ADMIN, ON, NO_ACCT, icust("A"), iwo(1, "A", "closed", ", closed with a posting date of the first day of this month")],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK, CLOSE_BTN, CONFIRM_CLOSE, FIN],
  [["Work order 1 opens."], ["The document shows the first day of this month."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['The status reads "Complete".'], ["The confirmation opens with today's date."], ["The work order shows the status Closed."],
   ["The document is dated today."]],
  ["S4-R4", "S4-R3"])
C("S4-09", S, "Vendor bills are not touched by Reopen",
  [ADMIN, ON, QB, icust("A"), iwo(1, "A", "closed", ", with one special-order part whose vendor bill of $125.00 was entered before Close")],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK, "Open the vendor bill."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'],
   ["The vendor bill is still there for $125.00, unchanged."]],
  ["S4-E3"])
C("S4-10", S, "Reopen keeps a work order internal after its customer lost the flag",
  [ADMIN, ON, NO_ACCT, icust("A"), iwo(1, "A", "closed"), "After work order 1 was closed, remove customer A's Internal flag (Edit Customer)."],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK, CLOSE_BTN],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['The work order is Complete and still shows the "Internal" badge.'], ['"Close Work Order" opens the Close confirmation again: it closes as internal.']],
  ["S4-E4", "S1-E1"])
C("S4-11", S, "Reopen keeps a work order internal after the setting was turned off",
  [ADMIN, NO_ACCT, icust("A"), iwo(1, "A", "closed"), "After work order 1 was closed, turn the Internal Work Orders setting off."],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['The work order is Complete and still shows the "Internal" badge.', 'It offers "Close Work Order", not "Create invoice".']],
  ["S4-E4", "S2-N1"])
C("S4-12", S, "Without Work Orders — Delete, Reopen is not shown",
  [ON, icust("A"), iwo(1, "A", "closed"), role("has 'Invoicing & Payments — Create & Edit' but not 'Work Orders — Delete'")],
  [OPEN_WO, FIN, INVMENU],
  [["Work order 1 opens."], ["The document shows."], ['The menu does not offer "Reopen Work Order", as it would not offer "Reverse".']],
  ["S4-N1", "PM-10"])
C("S4-13", S, "A failed Reopen shows an alert and leaves the work order closed",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['When Reopen fails, an alert toast that must be dismissed reads "Could not reopen the work order. Try again."', "The work order stays closed and nothing is reversed."]],
  ["EH-S4-1", "UFS-43"], marker=NOMAN("Reopen has to fail, which only a developer can make happen"))
C("S4-14", S, "While Reopen runs, its button shows a spinner and ignores a second press",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, FIN, INVMENU, REOPEN, REOPEN_OK],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."],
   ['"Reopen Work Order" shows a spinner and is disabled; a second press does nothing.']],
  ["EH-S4-2"], marker=NOMAN("Reopen finishes too fast to press twice; it needs a slowed connection a developer sets up"))
