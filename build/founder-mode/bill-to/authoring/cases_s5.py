"""Story 5 — Locked Bill To: invoiced and deposits (SV-12307): the invoiced lock (tooltip, error toast with "Go To Invoice", Finance tab,
Paid counts as Invoiced), the deposit lock (one deposit, several, the part sale wording, "Open Deposits", partial reversal), unlocking,
permissions (both missing runnable; one of two held on the PO), users who cannot change the Bill To, changes refused while the page
is open (two tabs), invoiced with deposits, phones, and the error toast timing. Amounts are exact (Rule 116)."""
from bt_lib import C, HOLD, UFS
from common import *

S = "S5"
A = cust("A")
B = cust("B", ", the payer")
CC = cust("C", ", another customer to try as Bill To")
INVD = wo(1, "A", "invoiced (not paid)", "B")
DEP1 = wo(1, "A", "in Approved", "B", ", holding one deposit of $10.00 taken on its Finance tab after customer B was picked")
WAIT10 = "Wait 10 seconds without clicking anything."

C("S5-01", S, "An invoiced work order's Bill To is read-only with the invoiced tooltip",
  [ADMIN, A, B, INVD],
  [OPEN_WO, EXPAND, HOVER_BT],
  [["Work order 1 opens for customer A, with status Invoiced."], [bt_reads("B")], [f'The tooltip reads "{M4}"']],
  ["S5-R1", UFS["M4"], "CORE-6", "KD-LOCK", "SBA-PICK", "S3-N3"])
C("S5-02", S, "Clicking an invoiced Bill To shows an error toast with Go To Invoice",
  [ADMIN, A, B, INVD],
  [OPEN_WO, EXPAND, CLICK_BT, WAIT10],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   [f'An error toast shows "{M4}"', 'The toast has a "Go To Invoice" button.', "No list opens."],
   ["The toast fades away after 10 seconds."]],
  ["S5-R2", UFS["M4"], "UFS-H1"])
C("S5-03", S, "Go To Invoice opens the Finance tab and reverses nothing",
  [ADMIN, A, B, INVD],
  [OPEN_WO, EXPAND, CLICK_BT, 'Click "Go To Invoice" in the toast.'],
  [["Work order 1 opens for customer A, with status Invoiced."], [bt_reads("B")], ['The error toast shows with "Go To Invoice".'],
   ["Work order 1's Finance tab opens.", "The invoice is still there and the work order's status is still Invoiced."]],
  ["S5-R3"])
C("S5-04", S, "An invoiced part sale's Bill To is locked with Go To Invoice",
  [ADMIN, A, B, ps(1, "A", "invoiced (not paid)", "B")],
  [OPEN_PS, EXPAND, HOVER_BT, CLICK_BT, 'Click "Go To Invoice" in the toast.'],
  [["Part sale 1 opens for customer A."], [bt_reads("B")], [f'The tooltip reads "{M4}"'], [f'An error toast shows "{M4}" with a "Go To Invoice" button.'],
   ["Part sale 1's Finance tab opens and the invoice is still there."]],
  ["S5-R1", "S5-R2", "S5-R3"])
C("S5-05", S, "A Paid work order's Bill To is locked like an invoiced one",
  [ADMIN, A, B, wo(1, "A", "invoiced and paid in full by customer B", "B")],
  [OPEN_WO, EXPAND, HOVER_BT],
  [["Work order 1 opens for customer A, with status Paid."], [bt_reads("B")], [f'The tooltip reads "{M4}"']],
  ["S5-R1", "T-OPEN"])
C("S5-06", S, "A held deposit locks the Bill To with the deposit tooltip",
  [ADMIN, A, B, DEP1],
  [OPEN_WO, EXPAND, HOVER_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")], ['The tooltip reads "' + M1_ONE.format(amt="$10.00", c="B") + '"']],
  ["S5-R4", "S5-R7", UFS["M1-one"], "KD-DEP", "SBA-PICK"], note=NAME_NOTE)
C("S5-07", S, "Clicking a deposit-locked Bill To shows an error toast with Open Deposits",
  [ADMIN, A, B, DEP1],
  [OPEN_WO, EXPAND, CLICK_BT, WAIT10],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['An error toast shows "' + M1_ONE.format(amt="$10.00", c="B") + '"', 'The toast has an "Open Deposits" button.', "No list opens."],
   ["The toast fades away after 10 seconds."]],
  ["S5-R5", UFS["M1-one"], "UFS-H1"], note=NAME_NOTE)
C("S5-08", S, "Open Deposits opens the Deposits tab of the customer holding the deposit",
  [ADMIN, A, B, DEP1],
  [OPEN_WO, EXPAND, CLICK_BT, 'Click "Open Deposits" in the toast.'],
  [["Work order 1 opens for customer A."], [bt_reads("B")], ['The error toast shows with "Open Deposits".'],
   ["Customer B's Deposits tab opens.", "It lists the $10.00 deposit."]],
  ["S5-R6", "KD-DEP"])
C("S5-09", S, "Two deposits show their total in the deposit message",
  [ADMIN, A, B, wo(1, "A", "in Approved", "B", ", holding two deposits taken under customer B, $10.00 and $15.50")],
  [OPEN_WO, EXPAND, HOVER_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['The tooltip reads "' + M1_MANY.format(amt="$25.50", c="B") + '"', "The total is $10.00 + $15.50 = $25.50."]],
  ["S5-R7", UFS["M1-several"]], note=NAME_NOTE)
C("S5-10", S, "On a part sale the deposit message says part sale",
  [ADMIN, A, B, ps(1, "A", "open", "B", ", holding one deposit of $20.00 taken after customer B was picked")],
  [OPEN_PS, EXPAND, HOVER_BT],
  [["Part sale 1 opens for customer A."], [bt_reads("B")],
   ['The tooltip reads "This part sale has a $20.00 deposit from [customer B\'s name]. Reverse it, change the Bill To, then take the deposit again under the new Bill To."']],
  ["S5-R4", UFS["M1-partsale"], UFS["M1-one"]], note=NAME_NOTE)
C("S5-11", S, "Deposits from two customers name the number of customers",
  [ADMIN, A, B, cust("C", ", so the work order holds a deposit from a second customer"),
   wo(1, "A", "in Approved", "B", ", holding a $30.00 deposit taken from customer B and a $10.00 deposit taken from customer C")],
  [OPEN_WO, EXPAND, HOVER_BT, CLICK_BT, 'Click "Open Deposits" in the toast.'],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['The tooltip reads "This work order has $40.00 in deposits from 2 customers. Reverse them, change the Bill To, then take the deposits again under the new Bill To."',
    "The total is $30.00 + $10.00 = $40.00."],
   ['The same words show as an error toast with "Open Deposits".'],
   ["Customer B's Deposits tab opens: customer B holds the larger share ($30.00 of $40.00)."]],
  ["S5-R6", "S5-R7", UFS["M1-customers"], UFS["M1-several"]],
  marker=HOLD("deposits from two different customers on one work order cannot be made through the screens, because a held deposit locks the Bill To"))
C("S5-12", S, "Reversing one of two deposits keeps the lock and names what is left",
  [ADMIN, A, B, wo(1, "A", "in Approved", "B", ", holding two deposits taken under customer B, $10.00 and $15.50")],
  [OPEN_WO, FIN, "Reverse the $10.00 deposit.", EXPAND, HOVER_BT],
  [["Work order 1 opens for customer A."], ["The Finance tab lists both deposits."], ["The $10.00 deposit is reversed; the $15.50 deposit stays."],
   [bt_reads("B")],
   ['The tooltip reads "' + M1_ONE.format(amt="$15.50", c="B") + '"', "Only the deposit not reversed is counted: $25.50 − $10.00 = $15.50."]],
  ["S5-R7", "S5-R8"], note=NAME_NOTE)
C("S5-13", S, "Reversing every deposit unlocks the Bill To",
  [ADMIN, A, B, CC, DEP1],
  [OPEN_WO, FIN, "Reverse the $10.00 deposit.", EXPAND, CLICK_BT, "Pick customer C in the list."],
  [["Work order 1 opens for customer A."], ["The Finance tab lists the $10.00 deposit."], ["The deposit is reversed."], [bt_reads("B")],
   ["The list opens: the field is no longer locked."], [bt_reads("C")]],
  ["S5-R8"])
C("S5-14", S, "Without Invoicing View and See Financial Data the invoiced toast has no button",
  [role("has 'Work orders → Create & Edit' but neither 'Invoicing & payments → View' nor 'See Financial Data'"), A, B, INVD],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")], [f'An error toast shows "{M4}"', 'The toast has no "Go To Invoice" button.']],
  ["S5-N1"])
C("S5-15", S, "Without AP/AR Data and Customers View the deposit toast has no button",
  [role("has 'Work orders → Create & Edit' but neither 'View and Manage AP/AR Data' nor 'Customers → View'"), A, B, DEP1],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['An error toast shows "' + M1_ONE.format(amt="$10.00", c="B") + '"', 'The toast has no "Open Deposits" button.']],
  ["S5-N2"], note=NAME_NOTE)
C("S5-16", S, "With Invoicing View but not See Financial Data the invoiced toast",
  [role("has 'Work orders → Create & Edit' and 'Invoicing & payments → View' but not 'See Financial Data'"), A, B, INVD],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")], [f'An error toast shows "{M4}"', 'The toast has no "Go To Invoice" button.']],
  ["S5-N1"], marker="PO:one-of-two-permissions")
C("S5-17", S, "With See Financial Data but not Invoicing View the invoiced toast",
  [role("has 'Work orders → Create & Edit' and 'See Financial Data' but not 'Invoicing & payments → View'"), A, B, INVD],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")], [f'An error toast shows "{M4}"', 'The toast has no "Go To Invoice" button.']],
  ["S5-N1"], marker="PO:one-of-two-permissions")
C("S5-18", S, "With Customers View but not AP/AR Data the deposit toast",
  [role("has 'Work orders → Create & Edit' and 'Customers → View' but not 'View and Manage AP/AR Data'"), A, B, DEP1],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['An error toast shows "' + M1_ONE.format(amt="$10.00", c="B") + '"', 'The toast has no "Open Deposits" button.']],
  ["S5-N2"], marker="PO:one-of-two-permissions", note=NAME_NOTE)
C("S5-19", S, "With AP/AR Data but not Customers View the deposit toast",
  [role("has 'Work orders → Create & Edit' and 'View and Manage AP/AR Data' but not 'Customers → View'"), A, B, DEP1],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['An error toast shows "' + M1_ONE.format(amt="$10.00", c="B") + '"', 'The toast has no "Open Deposits" button.']],
  ["S5-N2"], marker="PO:one-of-two-permissions", note=NAME_NOTE)
C("S5-20", S, "A user who cannot change the Bill To gets the invoiced toast with no button",
  [role("has 'Work orders → View', 'Invoicing & payments → View' and 'See Financial Data' but not 'Work orders → Create & Edit'"), A, B, INVD],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")], [f'An error toast shows "{M4}"', "The toast has no button to go anywhere."]],
  ["S5-N3"])
C("S5-21", S, "A user who cannot change the Bill To gets the deposit toast with no button",
  [role("has 'Work orders → View', 'View and Manage AP/AR Data' and 'Customers → View' but not 'Work orders → Create & Edit'"), A, B, DEP1],
  [OPEN_WO, EXPAND, CLICK_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['An error toast shows "' + M1_ONE.format(amt="$10.00", c="B") + '"', "The toast has no button to go anywhere."]],
  ["S5-N3"], note=NAME_NOTE)
C("S5-22", S, "A change after the work order was invoiced in another tab is refused",
  [ADMIN, A, B, CC, wo(1, "A", "in Complete, ready to invoice,", "B"), "Open work order 1 in two browser tabs."],
  ["In the first tab, expand the Customer card.", "Switch to the second tab.", FIN, CREATE_INV, "Switch to the first tab.", CLICK_BT,
   "Pick customer C in the list."],
  [[bt_reads("B")], ["The second tab shows work order 1 for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created."],
   ["The first tab still shows the field as changeable."], ["The list opens (the page has not refreshed)."],
   [f'The change is refused with "{M4}"', "The field refreshes to its locked state, still reading customer B's name."]],
  ["S5-E1"])
C("S5-23", S, "A change after a deposit was taken in another tab is refused",
  [ADMIN, A, B, CC, wo(1, "A", "in Approved", "B"), "Open work order 1 in two browser tabs."],
  ["In the first tab, expand the Customer card.", "Switch to the second tab.", FIN, "Click Add Deposit.", "Pick a Payment Method.",
   "Enter 10.00 as the Deposit Amount.", "Click Submit Deposit.", "Switch to the first tab.", CLICK_BT, "Pick customer C in the list."],
  [[bt_reads("B")], ["The second tab shows work order 1 for customer A."], ["The Finance tab shows Add Deposit."], ["The Create Deposit window opens."],
   ["The Payment Method is picked."], ["Deposit Amount shows 10.00."], ["The $10.00 deposit is recorded."], ["The first tab still shows the field as changeable."], ["The list opens (the page has not refreshed)."],
   ['The change is refused with "' + M1_ONE.format(amt="$10.00", c="B") + '"', 'The message has its "Open Deposits" button.',
    "The field refreshes to its locked state, still reading customer B's name."]],
  ["S5-E2"], note=NAME_NOTE)
C("S5-24", S, "An invoiced work order that also holds a deposit shows the invoiced message",
  [ADMIN, A, B, wo(1, "A", "invoiced (not paid)", "B", ", with a $10.00 deposit taken before it was invoiced and not reversed")],
  [OPEN_WO, EXPAND, HOVER_BT, CLICK_BT],
  [["Work order 1 opens for customer A, with status Invoiced."], [bt_reads("B")], [f'The tooltip reads "{M4}"', "The deposit message does not show."],
   [f'The error toast shows "{M4}" with "Go To Invoice".']],
  ["S5-E3"])
C("S5-25", S, "On a phone, tapping a locked Bill To shows the toast with no hover",
  [ADMIN, "Use a phone, or a browser window 390 pixels wide.", A, B, DEP1],
  [OPEN_WO, "Tap to open the work order details.", "Tap the Bill To field."],
  [["Work order 1 opens for customer A, in the phone layout."], [bt_reads("B")],
   ['An error toast shows "' + M1_ONE.format(amt="$10.00", c="B") + '" with "Open Deposits".', "No hover was needed to see the message."]],
  ["FF-S5", "S5-R5"], note=NAME_NOTE)
