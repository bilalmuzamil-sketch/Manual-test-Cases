"""Story 3 — Close an internal or no-charge work order (SV-11760): every place Close Work Order replaces Create invoice, the confirmation
(posting date, Stock parts, Special orders and sublet in its three states, Labor, Shop supplies, the sentence variants, the original work
order, the account notes), what Close does and does not do, the NO CHARGE document, the asset Invoices tab, review, permissions, the
unmapped notes, credit hold, the edge cases and the Error Handling lines."""
from iwo_lib import C, HOLD, NOMAN
from common import *

S = "S3"
DONE = "Complete"
SENT_DONE = "This posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later."
SENT_OPEN = ("This completes the work order, posts the parts cost and shop supplies to your books and marks it Closed · Internal. You can "
             "reopen it later.")
SS15 = ", whose Shop supplies amount is $15.00"
MAPPED = "Make sure the General Internal category has a QuickBooks expense account at the test location (note its name)."

C("S3-01", S, "The header offers Close Work Order where Create invoice would be",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", DONE), cust("B"), wo(2, "B", DONE, ", billable, so the two buttons can be compared")],
  [OPEN_WO, "Open work order 2."],
  [['The header button reads "Close Work Order", written in Title Case.', 'No "Create invoice" is offered anywhere on work order 1.'],
   ['Work order 2\'s header button reads "Create invoice".']],
  ["S3-R1", "S3-N1", "T-CLOSE", "OV-CLOSE"])
C("S3-02", S, "The Finance tab offers Close Work Order on an internal work order",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", DONE)],
  [OPEN_WO, FIN, "Click Close Work Order on the Finance tab."],
  [["Work order 1 opens."], ['The Finance tab offers "Close Work Order" where a billable work order offers "Create invoice".'],
   ["The Close confirmation opens."]],
  ["S3-R1"])
C("S3-03", S, "The lines bulk bar finishes with Close Work Order",
  [ADMIN, ON, REVIEW_OFF, cust("A"), ncwo(1, "A", "Goodwill", "Approved", ", with two approved lines")],
  [OPEN_WO, "Select both lines with their checkboxes.", "Open the finish action of the lines bulk bar."],
  [["Work order 1 opens."], ["The lines bulk bar shows."], ['The finish action reads "Close Work Order".']],
  ["S3-R1"])
C("S3-04", S, "On a phone the header shows the Close Work Order icon button",
  [ON, REVIEW_OFF, PHONE, icust("A"), iwo(1, "A", DONE)],
  [OPEN_WO, "Long-press the finish icon button in the header."],
  [["Work order 1 opens in the mobile layout."], ['The icon button\'s tooltip reads "Close Work Order".']],
  ["S3-R1", "FF-S3"])
C("S3-05", S, "With open lines Close Work Order sits in the menu, then moves to the header",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", "In Progress", ", with one line not yet Complete")],
  [OPEN_WO, MENU, "Mark the line Complete.", MENU],
  [['The header shows no "Close Work Order" button.'], ['The menu shows "Close Work Order".'], ['"Close Work Order" shows as the header button.'],
   ['The menu no longer shows "Close Work Order".']],
  ["S3-N2", "S3-R1"])
C("S3-06", S, "Simple Mode's completion wizard finishes with Close Work Order",
  [ADMIN, ON, "Make sure the test location uses Simple Mode.", icust("A"), iwo(1, "A", "In Progress", ", with one part that carries a core")],
  [OPEN_WO, "Start the completion wizard.", "Go to the wizard's last step."],
  [["Work order 1 opens."], ['The wizard opens with no "to invoice" wording.', "Its core step shows no core amount."],
   ['The last step offers "Close Work Order" instead of "Create invoice".']],
  ["S3-R1", "S2-E7"])
C("S3-07", S, "Close confirmation shows posting date, parts, labor and shop supplies",
  [ADMIN, ON, QB, MAPPED, REVIEW_OFF, icust("A", ", whose default internal category is General Internal"),
   iwo(1, "A", DONE, f", with {LABOR_2H} and {STOCK_PART}{SS15}")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."],
   ["A window titled \"Close work order [number]?\" opens with a posting date field set to today.",
    'A row reads "Stock parts $80.00" (2 × $40.00) with the note "Posted to [General Internal\'s account]".',
    'A row reads "Labor 2.0 h" with the note "Hours only, nothing posted".',
    'A row reads "Shop supplies $15.00" with the note "Posted to [General Internal\'s account], credited to [the income account of the Shop supplies item]".',
    "No special orders row shows, since there are none.",
    f'Under the rows it reads "{SENT_DONE}"', 'Its buttons are "Cancel" and "Close Work Order".']],
  ["S3-R2", "S10-R3", "UFS-16", "T-PDATE", "T-HOURS"], note=NAME_NOTE)
C("S3-08", S, "Closing a work order that is not Complete says it completes it",
  [ADMIN, ON, QB, REVIEW_OFF, icust("A"), iwo(1, "A", "In Progress", ", with all its lines done, not yet marked Complete")],
  [OPEN_WO, MENU, "Click Close Work Order in the menu."],
  [["Work order 1 opens."], ['The menu shows "Close Work Order".'], [f'The confirmation\'s sentence reads "{SENT_OPEN}"']],
  ["S3-R2", "UFS-16"])
C("S3-09", S, "A no-charge work order's confirmation says Closed · No Charge",
  [ADMIN, ON, QB, REVIEW_OFF, cust("A"), ncwo(1, "A", "Goodwill", DONE, f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."],
   ['The sentence reads "This posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later."',
    "No Original work order select shows: Goodwill never asks for it."]],
  ["S3-R2"])
C("S3-10", S, "A bill posted to the work order's account shows as already posted",
  [ADMIN, ON, QB, MAPPED, REVIEW_OFF, icust("A"),
   iwo(1, "A", DONE, ", with one special-order part received against it and its vendor bill of $125.00 entered after the work order was internal")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."],
   ['A row reads "Special orders and sublet $125.00" with the note "Already posted to [General Internal\'s account] at the vendor bill".']],
  ["S3-R2", "T-PARTS"], note=NAME_NOTE)
C("S3-11", S, "A bill posted to Cost of Parts shows as moved at Close",
  [ADMIN, ON, QB, MAPPED, REVIEW_OFF, cust("A"),
   wo(1, "A", DONE, ", with one special-order part received against it and its vendor bill of $125.00 entered while billable, then made internal by moving it to an internal customer")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens with the \"Internal\" badge."],
   ['A row reads "Special orders and sublet $125.00" with the note "Moved from Cost of Parts to [General Internal\'s account]".']],
  ["S3-R2"], note=NAME_NOTE)
C("S3-12", S, "A special-order part not yet billed shows its line cost and when it posts",
  [ADMIN, ON, QB, MAPPED, REVIEW_OFF, icust("A"),
   iwo(1, "A", DONE, ", with one special-order part received at a cost of $90.00 and no vendor bill entered yet")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."],
   ['A row reads "Special orders and sublet $90.00", the line cost, with the note "Posts to [General Internal\'s account] when the vendor bill is entered".']],
  ["S3-R2"], note=NAME_NOTE)
C("S3-13", S, "Shop supplies of $0.00 shows no row in the confirmation",
  [ADMIN, ON, QB, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {STOCK_PART}, whose Shop supplies amount is $0.00")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."], ['The confirmation shows "Stock parts $80.00" and "Labor" rows.', 'No "Shop supplies" row shows.']],
  ["S3-R2", "S10-N1"])
C("S3-14", S, "With both integrations each note names both accounts",
  [ADMIN, ON, "Make sure AccountingHub is enabled for the organization and the test location is also connected to QuickBooks Online, with General Internal mapped in both.",
   REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {STOCK_PART}{SS15}")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."], ["The Stock parts note names the QuickBooks account and the AccountingHub account.", "The Shop supplies note names both as well."]],
  ["S3-R2"])
C("S3-15", S, "Warranty without an original asks for it and keeps Close disabled",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, cust("A"), ncwo(1, "A", "Warranty", DONE, ", with no original work order")],
  [OPEN_WO, CLOSE_BTN, 'Pick "Not in ShopView" in "Original work order".'],
  [["Work order 1 opens."],
   ['Above the rows the select "Original work order *" and "Original line" show.',
    'The warning reads "Warranty requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView."',
    '"Close Work Order" is disabled.'],
   ['"Close Work Order" is enabled.']],
  ["S3-R2", "S2-R17"])
C("S3-16", S, "On AccountingHub a Warranty close posts to 6430 Warranty & Goodwill Expense",
  [ADMIN, ON, AH, "Make sure the Warranty mapping on Accounting > Account Mappings is the starting one.", REVIEW_OFF, cust("A"),
   ncwo(1, "A", "Warranty", DONE, f", with {STOCK_PART} and Not in ShopView as its original work order")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."], ['The Stock parts note reads "Posted to 6430 Warranty & Goodwill Expense".']],
  ["S3-R2", "S6-R2"])
C("S3-17", S, "A part with a core shows its core cost in the Stock parts row",
  [ADMIN, ON, QB, MAPPED, REVIEW_OFF, icust("A"),
   iwo(1, "A", DONE, ", with one stock part picked at a cost of $40.00 that carries a core costing $30.00, answered Core OK")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN],
  [["Work order 1 opens."],
   ['The row reads "Stock parts $70.00, includes $30.00 core cost" ($40.00 + $30.00) with the note "Posted to [General Internal\'s account]".'],
   ["The work order shows the status Closed."], ['The document\'s Summary reads "Parts cost $40.00": the core cost is left out.']],
  ["S3-R2", "S2-E7", "S3-R5"], note=NAME_NOTE)
C("S3-18", S, "Confirming Close shows the alert and the status Closed",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {LABOR_2H}")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Click the X on the alert."],
  [["Work order 1 opens."], ["The confirmation opens."],
   ["An alert reads \"Work order [number] is Closed · Internal.\" with an X.", 'The status reads "Closed" with one "Internal" badge next to it.',
    "The lines can no longer be edited, as on an invoiced work order."],
   ["The alert closes."]],
  ["S3-R3", "UFS-22", "KD-CLOSE", "T-CLOSED", "T-STATUS"], note=NAME_NOTE)
C("S3-19", S, "Closing a no-charge work order shows Closed · No Charge",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, cust("A"), ncwo(1, "A", "Goodwill", DONE, f", with {LABOR_2H}")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE],
  [["Work order 1 opens."], ["The confirmation opens."],
   ["An alert reads \"Work order [number] is Closed · No Charge.\"", 'The status reads "Closed" with the "No Charge" badge.']],
  ["S3-R3", "UFS-22"], note=NAME_NOTE)
C("S3-20", S, "The Closed alert fades on its own",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE)],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Wait ten seconds without clicking."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The Closed alert shows."], ["The alert has faded away on its own."]],
  ["UFS-22"])
C("S3-21", S, "Close runs the missing details step first and ends with Close Work Order",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, "Make sure the organization asks for the VIN before invoicing.", icust("A", ", with one asset, asset 1, that has no VIN"),
   iwo(1, "A", "In Progress", ", on asset 1, with all lines done")],
  [OPEN_WO, MENU, "Click Close Work Order in the menu.", "Enter a VIN.", "Click the step's Close Work Order button."],
  [["Work order 1 opens."], ['The menu shows "Close Work Order".'], ["A Missing Details step opens first and asks for the VIN."],
   ['The step\'s last button reads "Close Work Order".'], ["The Close confirmation opens."]],
  ["S3-R3"])
C("S3-22", S, "Adding a line to a closed internal work order starts a new internal work order",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, "Add a new line."],
  [["Work order 1 opens, Closed."], ['A new work order is created for the new line, as on an invoiced work order, and it shows the "Internal" badge.']],
  ["S3-R3"])
C("S3-23", S, "Adding a line to a closed no-charge work order starts a billable work order",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "closed")],
  [OPEN_WO, "Add a new line."],
  [["Work order 1 opens, Closed."], ['A new work order is created for the new line with no "No Charge" badge: it is billable on a regular customer.']],
  ["S3-R3"])
C("S3-24", S, "Close records no payment and no receivable",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {STOCK_PART}{SS15}"), "Note customer A's balance."],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN, "Open work order 1's log.", "Open customer A's Invoices tab."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The status reads Closed."],
   ["The Finance tab shows the document and no payment, balance or $0 payment."],
   ['The log has a Close entry where invoice created would be, and no "Invoice paid" entry.'],
   ["Work order 1 is not listed.", "Customer A's balance is the same as before: the $15.00 of shop supplies is not charged."]],
  ["S3-R4", "S3-R6", "GOAL-2", "T-INV"])
C("S3-25", S, "The NO CHARGE document of an internal work order shows cost and hours",
  [ADMIN, ON, NO_ACCT, icust("A", ", with one asset, asset 1"),
   iwo(1, "A", "closed", f", on asset 1, closed with {LABOR_2H}, {STOCK_PART}, one special-order part billed at $125.00{SS15}")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."],
   ['The masthead shows the letterhead left, the shop logo in the centre and "Internal Work Order [number]" with the date right.',
    'Under the masthead line, on the left and not over the logo, the INTERNAL stamp shows with "Category: General Internal".',
    "Bill to shows customer A; the asset block shows asset 1.", "The labor line shows 2.0 hours only; the parts show quantity and cost only.",
    'The Summary reads "Parts cost $205.00" ($80.00 + $125.00), "Shop supplies $15.00" and "Labor hours 2.0".',
    "There is no tax, total, payments, balance or signature block.", 'The document offers "Download", "Print" and "Email".']],
  ["S3-R5", "S10-R3", "T-HOURS"], note=NAME_NOTE)
C("S3-26", S, "A Warranty document links the original work order",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"), "Have a new invoiced work order for this test, work order 2, for customer A on asset 1.",
   ncwo(1, "A", "Warranty", "closed", ", with work order 2 as its original work order")],
  [OPEN_WO, FIN, "Click the original work order's number on the document."],
  [["Work order 1 opens."],
   ['The document block reads "No Charge Work Order [number]".', 'The NO CHARGE stamp shows with "Category: Warranty · Original work order [work order 2\'s number]".'],
   ["Work order 2 opens: the number is a link in ShopView."]],
  ["S3-R5", "S2-R16", "S2-R17"], note=NAME_NOTE)
C("S3-27", S, "With Not in ShopView the document shows the category only",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Comeback", "closed", ", with Not in ShopView as its original work order")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ['The stamp line reads "Category: Comeback" with no "· Original work order" part and no "Not in ShopView".']],
  ["S2-R16", "S3-R5"])
C("S3-28", S, "The downloaded document shows the original work order as plain text",
  [ADMIN, ON, cust("A"), "Have a new invoiced work order for this test, work order 2, for customer A.",
   ncwo(1, "A", "Warranty", "closed", ", with work order 2 as its original work order")],
  [OPEN_WO, FIN, "Click Download.", "Open the downloaded file."],
  [["Work order 1 opens."], ["The document shows."], ["A file is downloaded."],
   ["The file shows the same document, with work order 2's number as plain text, not a link."]],
  ["S3-R5"])
C("S3-29", S, "Email opens with an empty recipient and the document's subject",
  [ADMIN, ON, icust("A", ", with a contact whose email is saved"), iwo(1, "A", "closed")],
  [OPEN_WO, FIN, "Click Email."],
  [["Work order 1 opens."], ["The document shows."],
   ["The email window opens with the recipient field empty: no address is filled in.", 'The subject reads "Internal Work Order [number]".',
    "Nothing is sent until the user types an address and sends it."]],
  ["S3-R5"], note=NAME_NOTE)
C("S3-30", S, "A No Charge document's email subject names No Charge Work Order",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "closed")],
  [OPEN_WO, FIN, "Click Email."],
  [["Work order 1 opens."], ["The document shows."], ['The subject reads "No Charge Work Order [number]".']],
  ["S3-R5"], note=NAME_NOTE)
C("S3-31", S, "A customer that requires a PO does not block Close",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A", ", with \"PO is required\" ticked"), iwo(1, "A", DONE, ", with no Customer PO")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE],
  [["Work order 1 opens."], ["The confirmation opens without asking for a Customer PO."], ["The work order shows the status Closed."]],
  ["S3-R5"])
C("S3-32", S, "Without See Financial Data the document shows quantities and hours only",
  [ON, icust("A"), iwo(1, "A", "closed", f", with {LABOR_2H} and {STOCK_PART}"), role("has 'Work Orders — View' but not 'See Financial Data'")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ["The document shows the labor hours and the part's quantity.", "No cost shows."]],
  ["S3-R5", "PM-11"])
C("S3-33", S, "A vendor bill entered after Close does not change the document",
  [ADMIN, ON, NO_ACCT, icust("A"), iwo(1, "A", "closed", ", with one special-order part received at a cost of $90.00 and no vendor bill entered before Close")],
  [OPEN_WO, FIN, "Enter the vendor bill for that part at $100.00.", OPEN_WO, FIN],
  [["Work order 1 opens."], ['The Summary reads "Parts cost $90.00".'], ["The bill is saved."], ["Work order 1 opens."],
   ['The Summary still reads "Parts cost $90.00": parts cost is fixed at Close.']],
  ["S3-R5"])
C("S3-34", S, "The asset Invoices tab lists the closed work order",
  [ADMIN, ON, icust("A", ", with one asset, asset 1"), iwo(1, "A", "closed", ", on asset 1, closed with a posting date of yesterday")],
  ["Open asset 1's Invoices tab."],
  [['Work order 1 is listed with status Closed and the "Internal" badge.', 'Total balance reads "No Charge".', "Discount and Tax rate are empty.",
    "The row is dated yesterday, the posting date, and has no actions.", "The tab has no cost or hours columns."]],
  ["S3-R6", "S9-R10", "OOS-07", "TP-174"])
C("S3-35", S, "The Finance tab menu of a closed work order offers Reopen only",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order" only; there is no "Issue Credit" and no "Reverse".']],
  ["S3-R6", "S4-R1"])
C("S3-36", S, "With review required, Close waits for Mark Reviewed",
  [ADMIN, ON, REVIEW_ON, icust("A"), iwo(1, "A", "in Review, not yet marked reviewed")],
  [OPEN_WO, MENU, "Click Mark Reviewed.", RELOAD],
  [['Work order 1 shows no "Close Work Order" in the header.'], ['The menu does not offer "Close Work Order" either.'],
   ['"Mark Reviewed" works as today.'], ['"Close Work Order" is now offered where "Create invoice" would be.']],
  ["S3-R7", "S3-N2", "KD-REVIEW"])
C("S3-37", S, "When every line is declined, Close Work Order is not offered",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", "in Estimate", ", whose only line is declined")],
  [OPEN_WO, MENU],
  [['The header shows no "Close Work Order".'], ['The menu does not offer "Close Work Order".']],
  ["S3-N2"])
C("S3-38", S, "Without the invoicing permissions Close Work Order is hidden",
  [ON, REVIEW_OFF, icust("A"), iwo(1, "A", DONE), role("has 'See Financial Data' but not 'Invoicing & Payments — Create & Edit'")],
  [OPEN_WO, MENU],
  [['The header shows no "Close Work Order", as it would show no "Create invoice".'], ['The menu does not offer it.']],
  ["S3-N3", "PM-09"])
C("S3-39", S, "An unmapped category warns that QuickBooks posts to ShopView Review",
  [ADMIN, ON, QB, REVIEW_OFF, "Have a new No Charge category for this test, category A, with no QuickBooks expense account.", cust("A"),
   ncwo(1, "A", "category A", DONE, f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, 'Click the "Set account" link.'],
  [["Work order 1 opens."],
   ['The Stock parts note reads "No account set for [category A\'s name]. The entry posts to the ShopView Review account until you set one." with a "Set account" link.',
    'The button still reads "Close Work Order".'],
   ["Integrations > QuickBooks opens."]],
  ["S3-N4", "UFS-17", "KD-ALWAYS"], note=NAME_NOTE)
C("S3-40", S, "Without Settings — Integrations the unmapped note has no link",
  [ON, QB, REVIEW_OFF, "Have a new No Charge category for this test, category A, with no QuickBooks expense account.", cust("A"),
   ncwo(1, "A", "category A", DONE, f", with {STOCK_PART}"), role("has 'Invoicing & Payments — Create & Edit' and 'See Financial Data' but not 'Settings — Integrations'")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."], ['The note "No account set for [category A\'s name]. …" shows with no "Set account" link.']],
  ["S3-N4"], note=NAME_NOTE)
C("S3-41", S, "An unmapped AccountingHub row warns that the entry is held",
  [ADMIN, ON, AH, REVIEW_OFF, "Have a new No Charge category for this test, category A, whose Account Mappings row is empty.", cust("A"),
   ncwo(1, "A", "category A", DONE, f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, "Click the link in the note."],
  [["Work order 1 opens."],
   ['The note reads "No account set for [category A\'s name]. The entry is held in Accounting Events until you set one." with a link.'],
   ["Accounting > Account Mappings opens."]],
  ["S3-N4", "UFS-18", "UFS-21"], note=NAME_NOTE)
C("S3-42", S, "An unmapped Shop supplies item shows the warning on the Shop supplies row",
  [ADMIN, ON, QB, MAPPED, REVIEW_OFF, "Make sure the Shop supplies item in QuickBooks Products And Services has no income account mapped.", icust("A"),
   iwo(1, "A", DONE, SS15)],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."], ["The Shop supplies row carries the warning that the entry posts to the ShopView Review account until an account is set."]],
  ["S3-N4", "S10-N2", "UFS-18"])
C("S3-43", S, "A customer on credit hold does not block Close",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A", ", on credit hold"), iwo(1, "A", DONE), cust("B", ", on credit hold"), wo(2, "B", DONE, ", billable, so the refusal can be compared")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Open work order 2.", CREATE_INV],
  [["Work order 1 opens."], ["The confirmation opens."], ["Work order 1 shows the status Closed."], ["Work order 2 opens."], ["Create invoice is refused for the credit hold, as today."]],
  ["S3-N5", ("Jira SV-11976", "A customer on credit hold does not block Close; Create invoice on a billable work order for that customer is still refused.")])
C("S3-44", S, "A work order with no parts shows Parts cost $0.00 and still closes",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {LABOR_2H} only{SS15}")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE],
  [["Work order 1 opens."], ['The confirmation shows "Parts cost $0.00".', 'It shows "Shop supplies $15.00".'], ["The work order shows the status Closed with its document."]],
  ["S3-E1", "S10-E2"])
C("S3-45", S, "A part with no cost is listed under Parts with no cost",
  [ADMIN, ON, QB, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {STOCK_PART} and a second part picked with no cost recorded")],
  [OPEN_WO, CLOSE_BTN],
  [["Work order 1 opens."], ['The confirmation lists the second part under "Parts with no cost".', 'The Stock parts row reads "$80.00": only the costed part.']],
  ["S3-E2"])
C("S3-46", S, "Without an accounting integration the confirmation names the report",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, f", with {STOCK_PART}"), iwo(2, "A", "In Progress", ", with all lines done, not yet Complete")],
  [OPEN_WO, CLOSE_BTN, "Click Cancel.", "Open work order 2.", MENU, "Click Close Work Order in the menu."],
  [["Work order 1 opens."],
   ['The rows show no account notes.', 'The sentence reads "This marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report."'],
   ["The window closes."], ["Work order 2 opens."], ['The menu shows "Close Work Order".'],
   ['The sentence begins "This completes the work order and marks it …".']],
  ["S3-E4", "UFS-19"])
C("S3-47", S, "Close is refused when the work order changed under the open confirmation",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE, SS15), "Open work order 1 in two browser tabs, tab 1 and tab 2."],
  ["In tab 1, click Close Work Order in the header.", 'In tab 2, change "Shop supplies" to $20.00.', "In tab 1, click Close Work Order in the confirmation."],
  [["The confirmation opens in tab 1 showing Shop supplies $15.00."], ["Tab 2 saves the new amount."],
   ['Tab 1 shows the inline error "This work order changed. Review and close again."', "Work order 1 is not closed."]],
  ["S3-E5", "UFS-29", "KD-ALWAYS"])
C("S3-48", S, "A refused Close leaves a not yet Complete work order where it was",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", "In Progress", f", with all lines done, not yet Complete{SS15}"),
   "Open work order 1 in two browser tabs, tab 1 and tab 2."],
  ["In tab 1, click Close Work Order in the menu.", 'In tab 2, change "Shop supplies" to $20.00.', "In tab 1, click Close Work Order in the confirmation.", RELOAD],
  [["The confirmation opens in tab 1."], ["Tab 2 saves the new amount."], ['Tab 1 shows "This work order changed. Review and close again."'],
   ["Work order 1 is still In Progress, not Complete and not Closed."]],
  ["S3-E5", ("Jira SV-11976", "A refused or failed Close leaves the work order where it was (not Complete), even when Close ran the completion steps.")])
C("S3-49", S, "Closing is one press and posts with today's date by default",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", DONE)],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN],
  [["Work order 1 opens."], ["One confirmation opens, with today's date as the posting date and no preview step."], ["The work order is Closed at once."],
   ["The document's date is today."]],
  ["KD-ONEPRESS", "S3-R2", "T-PDATE"])
C("S3-50", S, "A posting date in the past dates the document and the asset tab",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A", ", with one asset, asset 1"), iwo(1, "A", DONE, ", on asset 1")],
  [OPEN_WO, CLOSE_BTN, "Set the posting date to the first day of this month.", CONFIRM_CLOSE, FIN, "Open asset 1's Invoices tab."],
  [["Work order 1 opens."], ["The confirmation opens with today's date."], ["The posting date shows the first day of this month."], ["The work order shows the status Closed."],
   ["The document's date is the first day of this month."], ["Work order 1's row is dated the first day of this month."]],
  ["S3-R2", "S9-R11"])
C("S3-51", S, "Each work order is closed on its own",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", DONE), iwo(2, "A", DONE)],
  ["Open the work orders list.", "Select work order 1 and work order 2 with their checkboxes."],
  [["The list opens."], ["The list's bulk actions offer no way to close both at once."]],
  ["OOS-13"])
C("S3-52", S, "The document serves as proof of repair with parts and hours",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Warranty", "closed", f", with {LABOR_2H}, {STOCK_PART} and Not in ShopView as its original work order")],
  [OPEN_WO, FIN, "Click Print."],
  [["Work order 1 opens."], ["The document shows the parts and the 2.0 hours."], ["The print view shows the same document with the NO CHARGE stamp, parts and hours."]],
  ["OOS-02", "S3-R5"])

# ---- Error Handling (held) --------------------------------------------------------------------------------------------------
C("S3-53", S, "A failed Close shows an alert and posts nothing",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", DONE)],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE],
  [["Work order 1 opens."], ["The confirmation opens."],
   ['When Close fails, an alert toast that must be dismissed reads "Could not close the work order. Try again."', "The work order stays where it was and nothing is posted."]],
  ["EH-S3-1", "UFS-43"], marker=NOMAN("Close has to fail, which only a developer can make happen"))
C("S3-54", S, "While Close runs, its button shows a spinner and ignores a second press",
  [ADMIN, ON, REVIEW_OFF, icust("A"), iwo(1, "A", DONE)],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE],
  [["Work order 1 opens."], ["The confirmation opens."], ['"Close Work Order" shows a spinner and is disabled; a second press does nothing.']],
  ["EH-S3-2"], marker=NOMAN("Close finishes too fast to press twice; it needs a slowed connection a developer sets up"))
