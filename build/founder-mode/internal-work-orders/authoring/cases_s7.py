"""Story 7 — QuickBooks Online sync (SV-11764), read in the shop's QuickBooks Online company and on ShopView's QB Unexported page:
no invoice or customer for these work orders, one inventory journal entry per picked stock part on the category's account, memo, date
and Class, vendor bills and credits, reclass entries, the shop supplies entry, the Reopen reversal, the sync whatever the user's
permission, a billable invoice with no-charge lines, the Create invoice window for a cost move, ShopView Review, QB Unexported, closed
periods, a location without inventory accounts, Mark as Exported and the withdrawn row."""
from iwo_lib import C, NOMAN
from common import *

S = "S7"
QBJ = "In QuickBooks Online, open the journal entries for work order 1's number."
TWO_PARTS = ", with two stock parts picked from inventory: part A, quantity 2 at a cost of $40.00, and part B, quantity 1 at a cost of $25.00"
MAP_GI = "Make sure the General Internal category is mapped to an expense account, account X, at the test location."
CLOSE_IT = [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE]
CLOSE_RES = [["Work order 1 opens."], ["The Close confirmation opens."], ["The work order shows the status Closed."]]

C("S7-01", S, "Closing sends no invoice and no customer to QuickBooks",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A", ", never sent to QuickBooks before"), iwo(1, "A", "Complete", f"{TWO_PARTS}, whose Shop supplies amount is $15.00")],
  CLOSE_IT + ["In QuickBooks Online, search the invoices, sales receipts and payments for work order 1's number.", "In QuickBooks Online, search the customers for customer A's name."],
  CLOSE_RES + [["No invoice, sales receipt or payment for work order 1 is found, while its journal entries are found (see the next cases)."],
               ["Customer A is not in QuickBooks."]],
  ["S7-R1", "S3-R4"])
C("S7-02", S, "Close sends one journal entry per stock part on the category's account",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A", ", whose default internal category is General Internal"), iwo(1, "A", "Complete", TWO_PARTS)],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["Two inventory journal entries are found, one per stock part, numbered as invoicing numbers them today.",
                "Part A's entry debits account X $80.00 (2 × $40.00) and credits the inventory account the invoice would credit for that part's category and stock location.",
                "Part B's entry debits account X $25.00 and credits its inventory account.", "Nothing is debited to Cost of Parts.",
                "Together they post $105.00, the Stock parts figure of the confirmation, with no invoice: no month-end reclass is needed."]],
  ["S7-R2", "KD-COST", "GOAL-3", "T-CATACCT"])
C("S7-03", S, "The journal entry memo names the work order, classification and category",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, cust("A"), ncwo(1, "A", "Goodwill", "Complete", f", with {STOCK_PART}"),
   "Make sure Goodwill is mapped to an expense account at the test location."],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["The entry's memo carries work order 1's number, the classification No Charge and the category Goodwill."]],
  ["S7-R2"])
C("S7-04", S, "The journal entries are dated the posting date",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, "Set the posting date to the first day of this month.", CONFIRM_CLOSE, QBJ],
  [["Work order 1 opens."], ["The confirmation opens."], ["The posting date shows the first day of this month."], ["The work order is Closed."],
   ["The entry is dated the first day of this month."]],
  ["S7-R2", "T-PDATE"])
C("S7-05", S, "The entries take the QuickBooks Class of the work order's location",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, "Make sure the test location uses a QuickBooks Class, class A, for its entries.", icust("A"),
   iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["The entry carries class A."]],
  ["S7-R2"])
C("S7-06", S, "Without a Class on the location the entries carry none",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, "Make sure the test location has no QuickBooks Class set.", icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["The entry is posted with no Class."]],
  ["S7-R2"])
C("S7-07", S, "A vendor bill on an internal work order posts to the category's account",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, icust("A"), iwo(1, "A", "Approved", ", with one special-order part received against it, no bill yet")],
  ["Enter the vendor bill for work order 1's special-order part at $125.00.", "In QuickBooks Online, open that vendor bill."],
  [["The bill is saved."], ["The bill line is posted to account X instead of Cost of Parts.", "The vendor, the bill and Accounts Payable are as usual."]],
  ["S7-R3", "T-PARTS"])
C("S7-08", S, "A vendor's core charge on the bill posts as cost with the bill line",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, icust("A"), iwo(1, "A", "Approved", ", with one special-order part with a core, received, no bill yet")],
  ["Enter the vendor bill for work order 1's special-order part at $125.00 with a core charge of $30.00.", "In QuickBooks Online, open that vendor bill."],
  [["The bill is saved."], ["The part line and the $30.00 core charge both post to account X."]],
  ["S7-R3", "S2-E7"])
C("S7-09", S, "A vendor credit for an internal work order's part posts where the bill did",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, icust("A"), iwo(1, "A", "Approved", ", with one special-order part whose vendor bill of $125.00 posted to account X")],
  ["Enter a vendor credit of $125.00 returning work order 1's special-order part.", "In QuickBooks Online, open that vendor credit."],
  [["The credit is saved."], ["The credit line posts to account X, where the bill line was posted."]],
  ["S7-R3a"])
C("S7-10", S, "Close moves an earlier bill from Cost of Parts to the category's account",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, cust("A"), icust("B"),
   wo(1, "A", "Complete", ", with one special-order part whose vendor bill of $125.00 posted to Cost of Parts while billable, then moved to customer B, so it is internal")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["A reclass entry debits account X $125.00 and credits Cost of Parts $125.00."]],
  ["S7-R4", "S2-R8"])
C("S7-11", S, "No reclass when the bill already sits on the work order's account",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", ", with one special-order part whose vendor bill of $125.00 posted to account X")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["No reclass entry is sent for the bill.", "The bill line stays on account X."]],
  ["S7-R4"])
C("S7-12", S, "Invoicing moves a bill back when the work order became billable",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A"), cust("B"),
   iwo(1, "A", "Complete", ", with one special-order part whose vendor bill of $125.00 posted to account X, then moved to customer B, so it is billable")],
  [OPEN_WO, CREATE_INV, "Click Create invoice in the window.", QBJ],
  [["Work order 1 opens, billable."], ['A window "Create invoice [number]?" opens with the row "Moved from [account X] to Cost of Parts".'],
   ["The invoice is created."], ["An entry debits Cost of Parts $125.00 and credits account X $125.00."]],
  ["S7-R4", "S7-R8", "UFS-15"], note=NAME_NOTE)
C("S7-13", S, "Close posts the shop supplies entry to the Shop supplies income account",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, "Make sure the Shop supplies item in QuickBooks Products And Services has its income account, account S.",
   icust("A"), iwo(1, "A", "Complete", ", whose Shop supplies amount is $15.00")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [['One entry dated the posting date debits account X $15.00 and credits account S $15.00, with a memo carrying the work order number and "Shop supplies".']],
  ["S7-R4a", "S10-R4", "T-SSACCT", "KD-SUPPLIES"])
C("S7-14", S, "An unmapped Shop supplies item credits ShopView Review",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, "Make sure the Shop supplies item has no income account mapped.", icust("A"),
   iwo(1, "A", "Complete", ", whose Shop supplies amount is $15.00")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["The shop supplies entry debits account X $15.00 and credits the ShopView Review account $15.00."]],
  ["S7-R4a", "S10-N2"])
C("S7-15", S, "Reopen sends reversing entries dated the reopen date",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, icust("A"), iwo(1, "A", "closed", f"{TWO_PARTS}, whose Shop supplies amount was $15.00, closed with a posting date of the first day of this month")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window.", QBJ],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'],
   ['Reversing entries dated today with the memo "Reopened [number]" credit account X $80.00, $25.00 and $15.00 and debit the same accounts the Close credited.',
    "After them account X carries $0.00 from this work order."]],
  ["S7-R5", "S4-R3", "S10-R4"], note=NAME_NOTE)
C("S7-16", S, "Closing again after Reopen sends new entries with the new date",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}, closed once and reopened")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, QBJ],
  [["Work order 1 opens, Complete."], ["The confirmation opens with today's date."], ["The work order is Closed."],
   ["A new entry dated today debits account X $80.00; the first Close and its reversal are still there."]],
  ["S4-R4", "S7-R2"])
C("S7-17", S, "The entries are sent although the closing user has no Settings — Integrations",
  [ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}"),
   role("has 'Invoicing & Payments — Create & Edit' and 'See Financial Data' but not 'Settings — Integrations'")],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["The entry debiting account X $80.00 is in QuickBooks."]],
  ["S7-R7"])
C("S7-18", S, "An invoice with a no-charge line reaches QuickBooks with the line at 0.00",
  [ADMIN, ON, QB, QB_VIEW, REVIEW_OFF, "Make sure Goodwill is mapped to an expense account, account G, at the test location.", cust("A"),
   wo(1, "A", "Complete", f", billable, with line 1 billable ({LABOR_2H}) and line 2 marked No Charge under Goodwill with one stock part costing $40.00")],
  [OPEN_WO, CREATE_INV, "In QuickBooks Online, open the invoice for work order 1."],
  [["Work order 1 opens."], ["The invoice is created as today."],
   ["Line 2 is on the invoice with its labor and part items, its quantities and price 0.00, the same tax code, and \"Goodwill\" in its description.",
    "Line 1 is invoiced as today."]],
  ["S7-R8", "S12-R8"])
C("S7-19", S, "A no-charge line's part cost debits its category's account at invoicing",
  [ADMIN, ON, QB, QB_VIEW, REVIEW_OFF, "Make sure Goodwill is mapped to an expense account, account G, at the test location.", cust("A"),
   wo(1, "A", "Complete", ", billable, with line 1 billable with one stock part costing $30.00 and line 2 marked No Charge under Goodwill with one stock part costing $40.00")],
  [OPEN_WO, CREATE_INV, QBJ],
  [["Work order 1 opens."], ["The invoice is created."],
   ["Line 2's part entry debits account G $40.00 and credits its inventory account.", "Line 1's part entry debits Cost of Parts $30.00, as today."]],
  ["S7-R8", "S12-R8", "KD-LINE"])
C("S7-20", S, "Reversing the invoice reverses the no-charge line's entries too",
  [ADMIN, ON, QB, QB_VIEW, "Make sure Goodwill is mapped to account G at the test location.", cust("A"),
   wo(1, "A", "invoiced", ", whose line 2 was No Charge under Goodwill with one stock part costing $40.00 when invoiced")],
  [OPEN_WO, FIN, "Reverse the invoice.", QBJ],
  [["Work order 1 opens."], ["The invoice shows."], ['Line 2 still shows its "No Charge · Goodwill" chip on the reopened work order.'],
   ["A reversing entry credits account G $40.00 with the rest of the invoice's reversal."]],
  ["S7-R8", "S12-R8"])
C("S7-21", S, "A bill entered while a line is No Charge posts to the line's category",
  [ADMIN, ON, QB, QB_VIEW, "Make sure Comeback is mapped to account C at the test location.", cust("A"),
   wo(1, "A", "Approved", ", billable, with line 1 marked No Charge under Comeback holding one special-order part received, no bill yet")],
  ["Enter the vendor bill for work order 1's special-order part at $90.00.", "In QuickBooks Online, open that vendor bill."],
  [["The bill is saved."], ["The bill line posts to account C instead of Cost of Parts."]],
  ["S7-R8", "S7-R3"])
C("S7-22", S, "Create invoice asks first when a line's bill cost will move",
  [ADMIN, ON, QB, QB_VIEW, "Make sure Comeback is mapped to account C at the test location.", cust("A"),
   wo(1, "A", "Complete", ", billable, whose line 1 holds a special-order part with a vendor bill of $90.00 posted to Cost of Parts, then marked No Charge under Comeback")],
  [OPEN_WO, CREATE_INV, "Click Create invoice in the window.", QBJ],
  [["Work order 1 opens."],
   ['A window titled "Create invoice [number]?" opens with the row "Moved from Cost of Parts to [account C]" and the buttons "Cancel" and "Create invoice".'],
   ["The invoice is created."], ["A reclass entry debits account C $90.00 and credits Cost of Parts $90.00."]],
  ["S7-R8", "UFS-15"], note=NAME_NOTE)
C("S7-23", S, "Mark as Billable after a bill moves it back at invoicing",
  [ADMIN, ON, QB, QB_VIEW, "Make sure Comeback is mapped to account C at the test location.", cust("A"),
   wo(1, "A", "Complete", ", billable, whose line 1 was No Charge under Comeback when its vendor bill of $90.00 posted to account C, then marked Billable")],
  [OPEN_WO, CREATE_INV, "Click Create invoice in the window.", QBJ],
  [["Work order 1 opens."], ['The "Create invoice [number]?" window shows the row "Moved from [account C] to Cost of Parts".'], ["The invoice is created."],
   ["A reclass entry debits Cost of Parts $90.00 and credits account C $90.00."]],
  ["S7-R8"], note=NAME_NOTE)
C("S7-24", S, "A category with no account posts to ShopView Review",
  [ADMIN, ON, QB, QB_VIEW, REVIEW_OFF, "Have a new No Charge category for this test, category A, with no QuickBooks account.", cust("A"),
   ncwo(1, "A", "category A", "Complete", f", with {STOCK_PART}"), "Make sure Goodwill is mapped to an account, so another category's row is filled."],
  CLOSE_IT + [QBJ],
  CLOSE_RES + [["The entry debits the ShopView Review account $80.00, not Goodwill's account."]],
  ["S7-N2", "S5-E2", "S5-R4", "T-REVIEW"])
C("S7-25", S, "Entries already on ShopView Review stay there after the row is mapped",
  [ADMIN, ON, QB, QB_VIEW, "Have a new No Charge category for this test, category A, with no QuickBooks account.", cust("A"),
   ncwo(1, "A", "category A", "closed", f", with {STOCK_PART}, whose entry posted to ShopView Review")],
  ["Open Integrations > QuickBooks.", "Pick an expense account in category A's row.", SAVE, QBJ],
  [["The QuickBooks page opens."], ["The account shows."], ["The mapping is saved."], ["The $80.00 entry is still on the ShopView Review account."]],
  ["S5-R3"])
C("S7-26", S, "An entry to an inactive account lands in QB Unexported",
  [ADMIN, ON, QB, QB_VIEW, REVIEW_OFF, "Make sure Goodwill is mapped to an expense account, account G, at the test location, and make account G inactive in QuickBooks Online.",
   cust("A"), ncwo(1, "A", "Goodwill", "Complete", f", with {STOCK_PART}")],
  CLOSE_IT + ["Open QB Unexported in ShopView."],
  CLOSE_RES + [["The entry is listed under Journal Entries with the QuickBooks error text, work order 1's number and its classification, with Export and Mark as Exported."]],
  ["S7-N2", "S5-E1", "EH-S7"])
C("S7-27", S, "A posting date in a closed period lands in QB Unexported",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, "Make sure QuickBooks Online's closing date is the last day of last month.", icust("A"),
   iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, "Set the posting date to a day of last month.", CONFIRM_CLOSE, "Open QB Unexported in ShopView."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The date shows."], ["The work order is Closed: Close succeeds."],
   ['The entry is under Journal Entries with QuickBooks\'s closed-period error, work order 1\'s number, its classification and the type "Internal Work Order Close", with Export and Mark as Exported.']],
  ["S7-N3", "S3-E3"])
C("S7-28", S, "Nothing to post means no journal entry",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {LABOR_2H} only and Shop supplies $0.00"),
   iwo(2, "A", "closed", f", with {STOCK_PART}, so an entry for a closed work order can be seen")],
  CLOSE_IT + [QBJ, "In QuickBooks Online, open the journal entries for work order 2's number."],
  CLOSE_RES + [["No journal entry exists for work order 1."], ["Work order 2's $80.00 entry is there."]],
  ["S7-N4", "S3-E1"])
C("S7-29", S, "Without inventory accounts mapped no parts entry is sent, shop supplies still is",
  [ADMIN, ON, QB_ONLY, QB_VIEW, MAP_GI, REVIEW_OFF, "Make sure Inventory Asset is not mapped on the test location's ShopView Accounts page.", icust("A"),
   iwo(1, "A", "Complete", f", with {STOCK_PART}, whose Shop supplies amount is $15.00")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, QBJ],
  [["Work order 1 opens."], ['The Stock parts row carries the note "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped."'],
   ["The work order is Closed."], ["Only the $15.00 shop supplies entry is in QuickBooks; there is no parts entry."]],
  ["S7-N5", "S3-N4"])
C("S7-30", S, "Reopen sends no reversal for an entry that was never sent",
  [ADMIN, ON, QB_ONLY, QB_VIEW, "Make sure Inventory Asset is not mapped at the test location.", icust("A"),
   iwo(1, "A", "closed", f", with {STOCK_PART} and Shop supplies $15.00, closed while Inventory Asset was not mapped")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window.", QBJ],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'],
   ["Only the shop supplies entry is reversed; no parts reversal is sent."]],
  ["S7-R5", "S4-E1"])
C("S7-31", S, "Reopen withdraws an entry still waiting in QB Unexported",
  [ADMIN, ON, QB, QB_VIEW, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}, whose Close entry is waiting in QB Unexported")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window.", "Open QB Unexported in ShopView."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'],
   ['The waiting row reads "Withdrawn: work order reopened" with no actions, and no reversal is sent.']],
  ["S4-E1", ("Jira SV-11977", 'QB Unexported shows the classification, the category and the type (Internal Work Order Close, Internal Work Order Reopen, No Charge line), the Close\'s stock-part entries included; a row withdrawn by Reopen reads "Withdrawn: work order reopened" with no actions.')])
C("S7-32", S, "An entry marked as exported by hand is still reversed on Reopen",
  [ADMIN, ON, QB, QB_VIEW, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}, whose Close entry was Marked as Exported in QB Unexported")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window.", QBJ],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'],
   ['A reversing entry "Reopened [number]" for $80.00 is in QuickBooks.']],
  ["S7-E2", "S4-E1"], note=NAME_NOTE)
C("S7-33", S, "A reversal in a closed period lands in QB Unexported and the work order reopens",
  [ADMIN, ON, QB, QB_VIEW, MAP_GI, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}, closed last month"),
   "Make sure QuickBooks Online's closing date is today, so today is in a closed period."],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window.", "Open QB Unexported in ShopView."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete": the work order still reopens.'],
   ['The reversal is listed with the closed-period error and the type "Internal Work Order Reopen".']],
  ["S4-E2", "S7-N3"])
C("S7-34", S, "A retried entry never creates a second entry in QuickBooks",
  [ADMIN, ON, QB, QB_VIEW, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}")],
  [QBJ],
  [["One entry of $80.00 exists, even when the same Close reaches the sync twice."]],
  ["S7-R6", "S7-E1"], marker=NOMAN("the same Close has to reach the sync twice, which only a developer can make happen"))
C("S7-35", S, "At a location without QuickBooks nothing is sent and Close works as usual",
  [ADMIN, ON, REVIEW_OFF, QB_VIEW, "Use an organization with two locations: location A connected to QuickBooks Online, location B not connected.",
   icust("A"), iwo(1, "A", "Complete", f" at location B, with {STOCK_PART}"), "Work at location B."],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "In location A's QuickBooks Online company, search the journal entries for work order 1's number."],
  [["Work order 1 opens."], ["The confirmation shows no account notes, as without an integration."], ["The work order is Closed."],
   ["No entry for work order 1 is found."]],
  ["S7-N1", "S3-E4"])
