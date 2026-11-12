"""Story 8 — AccountingHub, the closed work order and its parts cost (SV-11765), read in ShopView's Accounting area (Sales > Invoices,
Journal Entries, Accounting Events, Invoice List report): the Closed record and its page, the parts cost entries and their source, the
shop supplies entry, vendor bill lines and the held move with its lifecycle, Reopen, the status filters, a billable invoice with
no-charge lines, the Held reasons with Retry and automatic retry, the event order of Close and Reopen, and an inactive account."""
from iwo_lib import C, NOMAN
from common import *

S = "S8"
INV = "Open Accounting > Sales > Invoices."
EVENTS = "Open Accounting > Accounting Events."
JE = "Open Accounting > Journal Entries."
MAPS = "Open Accounting > Account Mappings."
CLOSE_IT = [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE]
CLOSE_RES = [["Work order 1 opens."], ["The Close confirmation opens."], ["The work order shows the status Closed."]]
REOPEN = [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window."]
REOPEN_RES = [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".']]

C("S8-01", S, "A closed work order shows in Sales > Invoices as a Closed record",
  [ADMIN, ON, AH, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}, whose Shop supplies amount is $15.00")],
  CLOSE_IT + [INV],
  CLOSE_RES + [['Work order 1 is listed with a "Closed" pill and the "Internal" badge, "No Charge" in place of a total.']],
  ["S8-R1", "S8-R6"])
C("S8-02", S, "The Closed record's page shows its summary and entries, no lines or payments",
  [ADMIN, ON, AH, REVIEW_OFF, cust("A", ", with one asset, asset 1"), "Have a new invoiced work order for this test, work order 2, for customer A on asset 1.",
   ncwo(1, "A", "Warranty", "Complete", f", on asset 1, with {STOCK_PART}, Shop supplies $15.00 and work order 2 as its original work order")],
  CLOSE_IT + [INV, "Open work order 1's record."],
  CLOSE_RES + [["Work order 1's Closed record is listed."],
               ["The header has the link to the work order in ShopView.",
                "The summary shows the number, customer A, asset 1, No Charge, Warranty, work order 2 as the original, the posting date, \"No Charge\", Parts cost $80.00 and Shop supplies $15.00.",
                "The journal entry section lists the entries of the Close.", "There are no lines, no payment, credit memo or write-off tabs and no Void."]],
  ["S8-R1"])
C("S8-03", S, "Close posts the parts cost to the mapped account with its source",
  [ADMIN, ON, AH, REVIEW_OFF, icust("A", ", whose default internal category is General Internal"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  CLOSE_IT + [JE],
  CLOSE_RES + [['An entry dated the posting date debits 6500 Vehicle Expenses (General Internal\'s starting account) $80.00 and credits Inventory $80.00, with the source "Internal work order", linked to the Closed record.',
                "No revenue, receivable or tax is posted for it."]],
  ["S8-R2", "S8-R1"])
C("S8-04", S, "A no-charge close posts with the source No-charge work order",
  [ADMIN, ON, AH, REVIEW_OFF, cust("A"), ncwo(1, "A", "Comeback", "Complete", f", with {STOCK_PART} and Not in ShopView as its original")],
  CLOSE_IT + [JE],
  CLOSE_RES + [['The entry debits 6440 Comeback Expense $80.00 and credits Inventory $80.00, with the source "No-charge work order".']],
  ["S8-R2"])
C("S8-05", S, "The shop supplies entry credits the Shop supplies expense row",
  [ADMIN, ON, AH, REVIEW_OFF, "Make sure the Shop supplies expense row is mapped to its starting account, 5100 Shop Supplies COGS.", icust("A"),
   iwo(1, "A", "Complete", ", whose Shop supplies amount is $15.00")],
  CLOSE_IT + [JE],
  CLOSE_RES + [["An entry debits 6500 Vehicle Expenses $15.00 and credits 5100 Shop Supplies COGS $15.00."]],
  ["S8-R3", "S10-R4", "T-SSACCT"])
C("S8-06", S, "A vendor bill line on no-charge work posts straight to the category's account",
  [ADMIN, ON, AH, cust("A"), ncwo(1, "A", "Goodwill", "Approved", ", with one special-order part received, no bill yet")],
  ["Enter the vendor bill for work order 1's special-order part at $125.00.", JE],
  [["The bill is saved."], ["The bill line posts $125.00 to 6430 Warranty & Goodwill Expense inside the bill, not first to cost of goods sold."]],
  ["S8-R3", ("Jira SV-11978", "A vendor bill line on internal or no-charge work posts straight to the category's account inside the bill (no COGS-then-reclass);")])
C("S8-07", S, "With the category row empty the bill posts and only its move is held",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, whose Account Mappings row is empty.", cust("A"),
   ncwo(1, "A", "category A", "Approved", ", with one special-order part received, no bill yet")],
  ["Enter the vendor bill for work order 1's special-order part at $125.00.", EVENTS],
  [["The bill is saved and can be paid as usual."],
   ['A move of that bill line is listed with the status Held, the reason "No Charge: [category A\'s name] row not mapped", a Retry action and a link to the bill and its line.']],
  ["S8-R3", "S8-N2", "UFS-20"], note=NAME_NOTE)
C("S8-08", S, "Saving the mapping posts a held move on its own",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, whose Account Mappings row is empty.", cust("A"),
   ncwo(1, "A", "category A", "Approved", ", whose vendor bill line move of $125.00 is Held for the empty row")],
  [MAPS, "Pick an expense account in category A's row.", SAVE, EVENTS],
  [["The rows show."], ["The account shows."], ["The mapping is saved."], ["The held move is now posted: it is retried automatically when the mapping is saved."]],
  ["S8-R3", "S6-R4", "S8-N2"])
C("S8-09", S, "Amending a bill while its move is held dismisses the move",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, whose Account Mappings row is empty.", cust("A"),
   ncwo(1, "A", "category A", "Approved", ", whose vendor bill, bill 1, of $125.00 has a Held line move")],
  ["Change the line amount of bill 1, work order 1's bill, to $110.00.", EVENTS],
  [["Bill 1 is saved."],
   ["The first move shows the status Dismissed with a reason naming bill 1 as amended.", "A new Held move for $110.00 is listed for the updated bill, since category A's row is still empty."]],
  ["S8-R3", ("Jira SV-11978", 'a dismissed move says why ("Withdrawn: vendor bill [number] amended" or "… voided")')])
C("S8-10", S, "Voiding a bill while its move is held dismisses the move with no replacement",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, whose Account Mappings row is empty.", cust("A"),
   ncwo(1, "A", "category A", "Approved", ", whose vendor bill, bill 1, of $125.00 has a Held line move")],
  ["Void bill 1, work order 1's bill.", EVENTS],
  [["Bill 1 is voided."], ["The move shows the status Dismissed with a reason naming bill 1 as voided.", "No new move is listed for bill 1, although category A's row is still empty."]],
  ["S8-R3"])
C("S8-11", S, "Amending a bill after its move posted reverses it and posts an updated move",
  [ADMIN, ON, AH, cust("A"), ncwo(1, "A", "Goodwill", "Approved", ", whose vendor bill, bill 1, of $125.00 posted to 6430 Warranty & Goodwill Expense")],
  ["Change the line amount of bill 1, work order 1's bill, to $110.00.", JE],
  [["Bill 1 is saved."], ["6430 carries $110.00 for bill 1 after the change: the $125.00 is reversed once and $110.00 posted, never reversed twice."]],
  ["S8-R3"])
C("S8-12", S, "Reopen reverses the entries and voids the Closed record",
  [ADMIN, ON, AH, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}, whose Close posted $80.00 to 6500 Vehicle Expenses")],
  REOPEN + [JE, INV],
  REOPEN_RES + [["A reversing entry for $80.00 is linked to the Close through the Reversal links, dated today."], ["Work order 1's Closed record is voided, as a reversed invoice is today."]],
  ["S8-R4", "S4-R3"])
C("S8-13", S, "The Invoice list report's status filter has Closed, unselected by default",
  [ADMIN, ON, AH, icust("A"), iwo(1, "A", "closed")],
  ["Open the Invoice list report in Accounting.", "Open its status filter.", 'Select "Closed".'],
  [["The report opens with its default totals; work order 1 is not in them."], ['"Closed" is a value of the filter and is not selected.'], ["Work order 1 is listed."]],
  ["S8-R6"])
C("S8-14", S, "The Sales Invoices Status filter has Closed and no Classification filter",
  [ADMIN, ON, AH, icust("A"), iwo(1, "A", "closed"), cust("B"), wo(2, "B", "invoiced")],
  [INV, 'Set the Status filter to "Closed".'],
  [['The Status filter shows "All" by default.', "There is no Classification filter."], ["Work order 1 is listed; work order 2 is not."]],
  ["S8-R6"])
C("S8-15", S, "A billable invoice with a no-charge line shows the No Charge lines block",
  [ADMIN, ON, AH, cust("A"), "Have a new invoiced work order for this test, work order 2, for customer A, with line 1 done by technician A.",
   wo(1, "A", "Complete", ", billable, with line 1 billable and line 2 of 1.5 hours marked No Charge under Comeback with one stock part costing $40.00 and work order 2's line 1 as its original")],
  [OPEN_WO, CREATE_INV, INV, "Open work order 1's invoice record."],
  [["Work order 1 opens."], ["The invoice is created."], ["The invoice is listed as an ordinary invoice with its revenue."],
   ['A "No Charge lines" block shows line 2 with its number and title, Comeback, work order 2 and its line 1, technician A, 1.5 hours, parts cost $40.00 and 6440 Comeback Expense.']],
  ["S8-R7", "S12-R11"])
C("S8-16", S, "The invoice splits parts cost between the line's category and cost of goods",
  [ADMIN, ON, AH, cust("A"),
   wo(1, "A", "Complete", ", billable, with line 1 billable with one stock part costing $30.00 and line 2 marked No Charge under Goodwill with one stock part costing $40.00")],
  [OPEN_WO, CREATE_INV, JE],
  [["Work order 1 opens."], ["The invoice is created."],
   ['$30.00 posts to the parts cost of goods sold account as today.', '$40.00 posts to 6430 Warranty & Goodwill Expense with the source "No Charge line".']],
  ["S8-R7", "S12-R8"])
C("S8-17", S, "With a line's category row empty only that line's cost is held",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, whose Account Mappings row is empty.", cust("A"),
   wo(1, "A", "Complete", ", billable, with line 1 billable and line 2 marked No Charge under category A with one stock part costing $40.00")],
  [OPEN_WO, CREATE_INV, INV, EVENTS],
  [["Work order 1 opens."], ["The invoice is created."], ["The invoice, its revenue and its receivable are posted at once."],
   ['Only line 2\'s cost entry is Held, with the reason "No Charge: [category A\'s name] row not mapped".']],
  ["S8-R7", "S8-N2", "UFS-20"], note=NAME_NOTE)
C("S8-18", S, "An empty Internal category row holds the Close with Retry",
  [ADMIN, ON, AH, REVIEW_OFF, "Have a new Internal category for this test, category A, whose Account Mappings row is empty.",
   icust("A", ", whose default internal category is category A"), iwo(1, "A", "Complete", f", with {STOCK_PART}"),
   icust("B"), iwo(2, "B", "closed", ", closed earlier, so another event of the organization can be seen flowing")],
  CLOSE_IT + [EVENTS],
  CLOSE_RES + [['Work order 1\'s Close shows the status Held with the reason "Internal: [category A\'s name] row not mapped" and a Retry action.',
                "Work order 2's events are posted: other events keep flowing."]],
  ["S8-N2", "EH-S8", "KD-ALWAYS"], note=NAME_NOTE)
C("S8-19", S, "An empty Shop supplies expense row holds the Close",
  [ADMIN, ON, AH, REVIEW_OFF, "Make sure the Shop supplies expense row on Account Mappings is empty.", icust("A"), iwo(1, "A", "Complete", ", whose Shop supplies amount is $15.00")],
  CLOSE_IT + [EVENTS],
  CLOSE_RES + [['The Close shows Held with the reason "Shop supplies expense is not mapped".']],
  ["S8-N2", "UFS-20", "S10-N2"])
C("S8-20", S, "A Close in a closed period is held and retried when the period opens",
  [ADMIN, ON, AH, REVIEW_OFF, "Make sure last month's fiscal period, period A, is closed in Accounting.", icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, "Set the posting date to a day of last month.", CONFIRM_CLOSE, EVENTS, "Reopen period A in Accounting.", EVENTS],
  [["Work order 1 opens."], ["The confirmation opens."], ["The date shows."], ["The work order is Closed: Close succeeds."],
   ['The Close shows Held with the reason "Period [period A\'s name] is closed".'], ["Period A is open."], ["The Close is retried on its own and is posted."]],
  ["S8-N2", "UFS-20", "S3-E3"], note=NAME_NOTE)
C("S8-21", S, "A posting date with no fiscal period is held with the hub's reason",
  [ADMIN, ON, AH, REVIEW_OFF, "Make sure no fiscal period covers a date two years ago.", icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, "Set the posting date to a day two years ago.", CONFIRM_CLOSE, EVENTS],
  [["Work order 1 opens."], ["The confirmation opens."], ["The date shows."], ["The work order is Closed."],
   ['The Close shows Held with the reason "No open fiscal period covers [date]."']],
  ["S8-N2"], note=NAME_NOTE)
C("S8-22", S, "An unmapped Inventory asset row holds the Close with its reason",
  [ADMIN, ON, AH, REVIEW_OFF, "Make sure the Inventory asset row on Account Mappings is empty.", icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  CLOSE_IT + [EVENTS],
  CLOSE_RES + [['The Close shows Held with the reason "Inventory asset is not mapped".']],
  ["S8-N2"])
C("S8-23", S, "Retry posts a held Close once the problem is fixed",
  [ADMIN, ON, AH, "Have a new Internal category for this test, category A, whose Account Mappings row is empty.", icust("A", ", whose default internal category is category A"),
   iwo(1, "A", "closed", f", with {STOCK_PART}, whose Close is Held for the empty row")],
  [MAPS, "Pick an expense account in category A's row.", SAVE, EVENTS, "Click Retry on the Close if it is still Held."],
  [["The rows show."], ["The account shows."], ["The mapping is saved."], ["The Close is posted or shows Retry."], ["The Close is posted, $80.00 to the picked account."]],
  ["S8-N2", "S6-R4"])
C("S8-24", S, "Reopening while the Close is held withdraws it with no reversal",
  [ADMIN, ON, AH, "Have a new Internal category for this test, category A, whose Account Mappings row is empty.", icust("A", ", whose default internal category is category A"),
   iwo(1, "A", "closed", f", with {STOCK_PART}, whose Close is Held for the empty row")],
  REOPEN + [EVENTS],
  REOPEN_RES + [['The Close shows the status Dismissed with the reason "Withdrawn: work order reopened".', "No reversal is posted.", "A Dismissed event offers no Retry."]],
  ["S4-E1", "S8-E2", "S4-R3"])
C("S8-25", S, "A new Close waits behind a held reversal of the same work order",
  [ADMIN, ON, AH, "Make sure this month's fiscal period, period A, is closed in Accounting.", icust("A"),
   iwo(1, "A", "closed", f", with {STOCK_PART}, closed last month and posted")],
  REOPEN + [CLOSE_BTN, "Set the posting date to a day of last month.", CONFIRM_CLOSE, EVENTS],
  REOPEN_RES + [["The confirmation opens."], ["The date shows."], ["The work order is Closed again."],
                ['The reversal shows Held with the reason "Period [period A\'s name] is closed", dated the reopen date.',
                 'The new Close shows Held with the reason "Waiting for an earlier held entry of work order [n]".']],
  ["S4-R3", "S4-E2"], note=NAME_NOTE)
C("S8-26", S, "A mapped account made inactive holds the event",
  [ADMIN, ON, AH, REVIEW_OFF, "Have a new No Charge category for this test, category A, mapped to an expense account, account A, and make account A inactive in Accounting.",
   cust("A"), ncwo(1, "A", "category A", "Complete", f", with {STOCK_PART}")],
  CLOSE_IT + [EVENTS],
  CLOSE_RES + [["The Close shows Held with a reason naming the inactive account, and a Retry action."]],
  ["S6-E1", "S8-N2"])
C("S8-27", S, "A replay of history never turns a closed internal work order into revenue",
  [ADMIN, ON, AH, icust("A"), iwo(1, "A", "closed")],
  [INV],
  [["After a replay of historical events, work order 1 is still a Closed record with no revenue."]],
  ["S8-R5", "S8-E1"], marker=NOMAN("a replay of historical events is run by the AccountingHub team, not from the screens"))
