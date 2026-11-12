"""Story 12 — A no-charge line on a billable work order (SV-12226): Mark as No Charge in the line menu and the No Charge checkbox in Edit
Line and New Line, the dialog, the chip and $0.00, totals on the billable lines, the line discount, the deposit message, the estimate,
Change category and Mark as Billable, the notes, the invoice, the original work order before invoicing, every line No Charge, the
permissions, the setting off, invoiced and whole no-charge work orders, the edge cases (split, customer change, cores, archived and deleted
originals, a moved part, Issue Credit, declined lines, Board, Print Work Order, fees history), the vendor bill window, the cost-only
receive notice and the Error Handling line. Posting is in Stories 7 and 8, reports in Story 9, the portal in its own section."""
from iwo_lib import C, NOMAN
from common import *

S = "S12"
LMENU = "Open line 2's three-dots menu."
MARK = 'Click "Mark as No Charge".'
MARK_OK = "Click the confirming Mark as No Charge button."
PICKC = 'Pick "Comeback" in Category.'
PICKG = 'Pick "Goodwill" in Category.'
BILL2 = wo(1, "A", "Approved", ", billable, with line 1 of 2.0 hours and line 2 of 1.5 hours with one stock part costing $40.00, both at the customer's labor rate of $120.00 an hour")
CUST = cust("A", ", with its own labor rate of $120.00 an hour")
NCL2 = wo(1, "A", "Approved", ", billable, with line 1 of 2.0 hours at $120.00 an hour and line 2 of 1.5 hours with one stock part costing $40.00, line 2 marked No Charge under Goodwill")
BODY = ("The line stays on this work order and shows $0.00 on the invoice. Hours, parts and the story stay; the technician works it like any other line. "
        "When the invoice is created, the parts cost of this line posts to the expense account of the category instead of Cost of Parts.")

C("S12-01", S, "Every line's menu offers Mark as No Charge between Edit line and Delete line",
  [ADMIN, ON, CUST, BILL2],
  [OPEN_WO, LMENU],
  [["Work order 1 opens."], ['The menu shows "Edit line", "Mark as No Charge" and "Delete line", in that order.', "The menu offers no way to move the line to a separate work order."]],
  ["S12-R1", "OOS-16"])
C("S12-02", S, "Mark as No Charge opens its dialog with the line summary and body",
  [ADMIN, ON, CUST, BILL2],
  [OPEN_WO, LMENU, MARK, MARK_OK, 'Open the "Category" select.'],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'],
   ['A window titled "Mark this line as No Charge?" opens with line 2\'s title, 1.5 hours, its part, its technician and its current price $180.00 (1.5 h × $120.00).',
    f'Its text reads "{BODY}"', 'It has a required "Category" select, empty, and the buttons "Cancel" and "Mark as No Charge".'],
   ['The mark is refused and "Pick a category" shows under Category.'], ["The active No Charge categories are listed."]],
  ["S12-R2", "UFS-30", "UFS-09"])
C("S12-03", S, "A category that needs the original shows the selects, required before invoicing",
  [ADMIN, ON, CUST, BILL2],
  [OPEN_WO, LMENU, MARK, PICKC],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."],
   ['"Original work order" and "Original line" appear, optional here.', 'The helper says the original is "required before the invoice is created".',
    'A line "Original technician: …" shows once an original is picked.']],
  ["S12-R2", "S2-R17"])
C("S12-04", S, "A marked line shows the chip and $0.00, the work order stays billable",
  [ADMIN, ON, DESK, CUST, BILL2],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."],
   ['Line 2 shows the chip "No Charge · Goodwill" next to its title.', "Its Rate, Total and part show $0.00; Margin shows nothing.",
    "Its 1.5 hours, technician and status stay.", 'The work order shows no badge and no orange header card.',
    "The original work order and line are not shown on the line."]],
  ["S12-R3", "S12-R4", "UFS-32", "T-NCL", "KD-LINE", "S2-R3"])
C("S12-05", S, "Totals and tax are computed on the billable lines only",
  [ADMIN, ON, "Make sure the test location charges a 5% tax on labor.", CUST, BILL2],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK],
  [["Work order 1's totals read labor $420.00 ($240.00 + $180.00)."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."],
   ["The totals read labor $240.00, tax $12.00 (5% of $240.00) and total $252.00.", "Financial Info, the cost view, is unchanged."]],
  ["S12-R4"])
C("S12-06", S, "Work order fees stay and are computed on the billable amounts",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, with line 1 of 2.0 hours ($240.00), line 2 of 1.5 hours ($180.00), and a work order fee of 10%")],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK],
  [["The fee reads $42.00 (10% of $420.00)."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."],
   ["The fee stays and reads $24.00 (10% of $240.00)."]],
  ["S2-R21", "S12-R4"])
C("S12-07", S, "A line discount is removed when marked and not restored",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, whose line 2 of 1.5 hours carries a 10% line discount")],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK, LMENU, 'Click "Mark as Billable".', "Click the confirming Mark as Billable button."],
  [["Line 2 shows its 10% discount."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."], ["Line 2's discount is gone."],
   ['The menu shows "Mark as Billable".'], ["The confirmation opens."], ["Line 2 is priced at $180.00 with no discount: it is not restored."]],
  ["S12-R4", "S12-R5"])
C("S12-08", S, "A deposit larger than the new total is explained in the dialog",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, with line 1 of 2.0 hours ($240.00) and line 2 of 1.5 hours ($180.00), with a deposit of $300.00")],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK],
  [["Work order 1 opens."], ['"Mark as No Charge" is offered: the deposit does not block it.'],
   ['The dialog says "Deposit $300.00 exceeds the new total $240.00. The difference stays on the customer\'s account as a deposit when the invoice is created."'],
   ["Goodwill is picked."], ["Line 2 shows $0.00."]],
  ["S12-R4"])
C("S12-09", S, "The estimate shows the no-charge line at $0.00 with its category",
  [ADMIN, ON, CUST, NCL2],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ['The estimate shows line 2 at $0.00 with "Goodwill" under its title.', "Its totals are computed on line 1."]],
  ["S12-R4", "S12-R7"])
C("S12-10", S, "Edit Line shows the No Charge checkbox with its helper",
  [ADMIN, ON, CUST, BILL2],
  [OPEN_WO, LMENU, 'Click "Edit line".', 'Tick the "No Charge" checkbox.'],
  [["Work order 1 opens."], ['The menu shows "Edit line".'],
   ['At the bottom, under a divider, the checkbox "No Charge" shows with the helper "This line shows $0.00 on the invoice. Hours and parts stay; the parts cost posts to the category\'s expense account."'],
   ['"Category *", "Original work order" and "Original line" appear.']],
  ["S12-R1", "UFS-31"])
C("S12-11", S, "A new line can be created No Charge from New Line",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable")],
  [OPEN_WO, "Click New Line.", "Type a line title.", 'Tick the "No Charge" checkbox.', PICKG, SAVE],
  [["Work order 1 opens."], ["The New Line window opens with the No Charge checkbox at the bottom."], ["The title shows."], ["The Category select appears."], ["Goodwill is picked."],
   ['The new line shows the chip "No Charge · Goodwill" and $0.00.']],
  ["S12-R1"])
C("S12-12", S, "A Line Builder line is marked afterwards from its menu",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, with line 2 made with the Line Builder")],
  [OPEN_WO, LMENU],
  [["Work order 1 opens."], ['Line 2\'s menu offers "Mark as No Charge".']],
  ["S12-R1"])
C("S12-13", S, "Change category on a no-charge line saves the new category",
  [ADMIN, ON, CUST, NCL2],
  [OPEN_WO, LMENU, 'Click "Change category".', PICKC, SAVE, "Open the Notes tab."],
  [["Work order 1 opens."], ['The menu shows "Change category" and "Mark as Billable".'],
   ['The dialog opens with Goodwill preselected and "Save" disabled.'], ['"Save" is enabled.'], ['Line 2\'s chip reads "No Charge · Comeback".'],
   ["A note reads \"Category of line '[line 2's title]' changed from Goodwill to Comeback by [user].\""]],
  ["S12-R5", "S12-R6", "UFS-37"], note=NAME_NOTE)
C("S12-14", S, "Mark as Billable prices the line as a new line would be",
  [ADMIN, ON, CUST, NCL2],
  [OPEN_WO, LMENU, 'Click "Mark as Billable".', "Click the confirming Mark as Billable button.", "Open the Notes tab."],
  [["Work order 1 opens."], ['The menu shows "Mark as Billable".'],
   ['A window titled "Mark line as billable?" reads "The line is priced as a new line would be today. You can mark it No Charge again until the work order is invoiced."',
    'Its buttons are "Cancel" and "Mark as Billable".'],
   ["The chip is gone.", "Line 2's labor reads $180.00 (1.5 h × $120.00) and its part is priced by the pricing rules from its $40.00 cost."],
   ["A note reads \"Line '[line 2's title]' marked Billable by [user]. Priced as a new line would be today: $[price]. Category Goodwill removed.\""]],
  ["S12-R5", "S12-R6", "UFS-33", "UFS-37"], note=NAME_NOTE)
C("S12-15", S, "Marking a line writes a note with its price, cost and hours",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour and one asset, asset 1"), "Have a new invoiced work order for this test, work order 2, for customer A on asset 1.",
   wo(1, "A", "Approved", ", billable, on asset 1, with line 2 of 1.5 hours and one stock part costing $40.00, priced $180.00 for labor only")],
  [OPEN_WO, LMENU, MARK, PICKC, 'Pick work order 2 in "Original work order".', 'Pick its first line in "Original line".', MARK_OK, "Open the Notes tab.", "Open the work order's Audit Log."],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["The original selects appear."], ["Work order 2 is picked."], ["The line is picked."],
   ['Line 2 shows "No Charge · Comeback".'],
   ["A system note by ShopView reads \"Line '[line 2's title]' marked No Charge by [user]. Category Comeback, original work order [work order 2's number], original line [its line number]. Line price $180.00 removed; cost $40.00 and 1.5 h kept. The work order stays billable.\""],
   ["The Audit Log has a row for the mark with the user and the time."]],
  ["S12-R6", "S2-R18", "UFS-37"], note=NAME_NOTE)
C("S12-16", S, "The invoice shows the no-charge line at $0.00 with its category only",
  [ADMIN, ON, CUST, NCL2, "Make sure work order 1 is Complete."],
  [OPEN_WO, CREATE_INV, FIN],
  [["Work order 1 opens."], ["The invoice is created as today."],
   ['The invoice preview shows line 2 with its 1.5 hours and its part at $0.00 and "Goodwill" as a line under its title.',
    'There is no stamp, no badge and no "No Charge" wording elsewhere on the document.']],
  ["S12-R7", "UFS-36"])
C("S12-17", S, "The invoice PDF and email show the no-charge line the same way",
  [ADMIN, ON, cust("A", ", with a contact whose email the tester can read"), NCL2.replace("Approved", "invoiced")],
  [OPEN_WO, FIN, "Download the invoice PDF.", "Email the invoice to the contact."],
  [["Work order 1 opens."], ["The invoice shows."], ['The PDF shows line 2 at $0.00 with "Goodwill" under its title.'],
   ['The email\'s invoice shows line 2 at $0.00 with "Goodwill" under its title.']],
  ["S12-R7", "UFS-36"])
C("S12-18", S, "Create invoice is refused while a required original is missing",
  [ADMIN, ON, CUST, wo(1, "A", "Complete", ", billable, whose line 2 is No Charge under Comeback with no original work order")],
  [OPEN_WO, CREATE_INV, 'Pick "Not in ShopView" in "Original work order".', SAVE, CREATE_INV],
  [["Work order 1 opens."],
   ["Create invoice is refused with \"Line '[line 2's title]' needs its original work order (or Not in ShopView) before the invoice.\"", "Edit Line opens on line 2."],
   ['"Not in ShopView" is picked.'], ["Edit Line closes."], ["The invoice is created."]],
  ["S12-R9", "UFS-35", "S2-R17"], note=NAME_NOTE)
C("S12-19", S, "When every line is No Charge the dialog says to convert instead",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, with line 1 already No Charge under Goodwill and line 2 billable")],
  [OPEN_WO, LMENU, MARK],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'],
   ['The dialog shows the hint "All lines are No Charge. To close without an invoice and get the NO CHARGE document, convert the work order instead."']],
  ["S12-R10", "UFS-34"])
C("S12-20", S, "A billable work order with every line No Charge invoices at $0.00",
  [ADMIN, ON, REVIEW_OFF, CUST, wo(1, "A", "Complete", ", billable, whose only two lines are both No Charge under Goodwill")],
  [OPEN_WO, CREATE_INV, FIN],
  [['Work order 1 shows no badge and offers "Create invoice", not "Close Work Order".'], ["The invoice is created."],
   ["The invoice reads $0.00 with nothing owed, as a $0 invoice is today."]],
  ["S12-R10"])
C("S12-21", S, "Without See Financial Data the chip shows and prices stay hidden",
  [ON, CUST, NCL2, role("has 'Work Orders — Create & Edit' but not 'See Financial Data'")],
  [OPEN_WO, LMENU],
  [['Line 2 shows the chip "No Charge · Goodwill" and no prices, as prices are hidden today.'],
   ['The menu offers no "Change category" and no "Mark as Billable".']],
  ["S12-R12", "S12-N4"])
C("S12-22", S, "Without See Financial Data Mark as No Charge and the checkbox are hidden",
  [ON, CUST, BILL2, role("has 'Work Orders — Create & Edit' but not 'See Financial Data'")],
  [OPEN_WO, LMENU, 'Click "Edit line".'],
  [["Work order 1 opens."], ['The menu offers no "Mark as No Charge".'], ['Edit Line shows no "No Charge" checkbox.']],
  ["S12-N4", "S12-R12"])
C("S12-23", S, "A billable work order with no-charge lines is listed as billable",
  [ADMIN, ON, CUST, NCL2],
  ["Open the work orders list.", 'Set the "Classification" chip to "Billable".', "Open the Board."],
  [["Work order 1 shows no badge."], ["Work order 1 is listed."],
   ["Work order 1's card shows no badge and the billable total $240.00, the stored total."]],
  ["S12-R12", "S12-E8"])
C("S12-24", S, "While the setting is off no line can be marked, existing ones can be unmarked",
  [ADMIN, OFF, CUST, NCL2.replace("Goodwill", "Goodwill while the setting was on")],
  [OPEN_WO, "Open line 1's three-dots menu.", 'Click "Edit line".', LMENU],
  [['Line 2 keeps its chip and $0.00.'], ['Line 1\'s menu offers no "Mark as No Charge".'], ['Edit Line shows no "No Charge" checkbox.'],
   ['Line 2\'s menu offers "Mark as Billable" and "Change category".']],
  ["S12-N1"])
C("S12-25", S, "Lines of a whole internal or no-charge work order offer no Mark as No Charge",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "Approved", ", with two lines, line 1 and line 2")],
  [OPEN_WO, LMENU],
  [["Work order 1 shows the \"No Charge\" badge; line 1 is listed."], ['Line 2\'s menu offers no "Mark as No Charge".']],
  ["S12-N2", "S12-E8"])
C("S12-26", S, "On an invoiced work order the line menu offers neither action",
  [ADMIN, ON, CUST, NCL2.replace("Approved", "invoiced")],
  [OPEN_WO, LMENU, 'Hover over the line actions in the menu.'],
  [["Work order 1 opens."], ['The menu offers neither "Mark as No Charge" nor "Mark as Billable".'], ['The tooltip reads "Reverse the invoice first."']],
  ["S12-N3", "S12-R5"])
C("S12-27", S, "Splitting moves a no-charge line with its mark and notes on both",
  [ADMIN, ON, CUST, NCL2],
  [OPEN_WO, "Split work order 1, moving line 2 to a new work order.", "Open the new work order.", "Open the Notes tab.", OPEN_WO, "Open the Notes tab."],
  [["Work order 1 opens."], ["A new work order is created."], ['Line 2 shows "No Charge · Goodwill" on the new work order.'], ["The note about line 2 is there."],
   ["Work order 1 opens."], ["The same note is on work order 1 as well."]],
  ["S12-E1"])
C("S12-28", S, "A customer change keeps the line's mark and offers new originals",
  [ADMIN, ON, CUST, cust("B"), "Have a new invoiced work order for this test, work order 2, for customer B.", NCL2.replace("Goodwill", "Comeback")],
  [OPEN_WO, 'Click "Change Customer" on the customer card.', "Pick customer B.", "Confirm the change.", LMENU, 'Click "Change category".', 'Open the "Original work order" select.'],
  [["Work order 1 opens."], ["The window opens."], ["Customer B is picked."], ['Line 2 still shows "No Charge · Comeback".'], ['The menu shows "Change category".'],
   ["The dialog opens."], ["Work order 2, customer B's, is offered."]],
  ["S12-E2"])
C("S12-29", S, "A core on a no-charge line charges nobody and stays at $0.00",
  [ADMIN, ON, REVIEW_OFF, cust("A"), wo(1, "A", "In Progress", ", billable, whose line 2 is No Charge under Warranty with Not in ShopView as its original and holds a part with a core, all lines done")],
  [OPEN_WO, CREATE_INV, 'Answer the core "Not OK".', "Finish the completion steps."],
  [["The core row on line 2 shows $0.00."], ["The completion steps ask OK or NOT OK for line 2's core."], ["No charge is added for the core."],
   ["The invoice is created with line 2 and its core at $0.00."]],
  ["S12-E3"])
C("S12-30", S, "A line keeps its category after the category is archived",
  [ADMIN, ON, "Have a new No Charge category for this test, category A.", CUST,
   wo(1, "A", "Approved", ", billable, whose line 2 is No Charge under category A"), "Archive category A after line 2 was marked."],
  [OPEN_WO, LMENU, 'Click "Change category".', 'Open the "Category" select.'],
  [['Line 2 still shows "No Charge · [category A\'s name]".'], ['The menu shows "Change category".'], ["The dialog opens."], ["Category A is not offered; only active categories are."]],
  ["S12-E4"], note=NAME_NOTE)
C("S12-31", S, "A deleted original work order stays as plain text",
  [ADMIN, ON, CUST, "Have a new work order for this test, work order 2, for customer A, which is deleted after it was picked as line 2's original.",
   wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Comeback with work order 2 as its original")],
  [OPEN_WO, "Open the Notes tab.", "Open Reports > Internal Work Orders.", "Set the date range to this month."],
  [["Work order 1 opens."], ["The note still shows work order 2's number."], ["The report opens."], ["Line 2's row shows work order 2's number with no link."]],
  ["S12-E5"])
C("S12-32", S, "A part moved onto a no-charge line loses its price and keeps its cost",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, with line 1 holding one stock part costing $40.00 and priced $60.00, and line 2 No Charge under Goodwill")],
  [OPEN_WO, "Move line 1's part onto line 2.", "Open the Notes tab."],
  [["Line 1's part shows $60.00."], ["On line 2 the part shows $0.00 and its cost $40.00."], ["A note records the move and the price."]],
  ["S12-E6"])
C("S12-33", S, "Issue Credit lists a no-charge line's part at a fixed $0.00",
  [ADMIN, ON, QB, QB_VIEW, "Make sure Goodwill is mapped to account G at the test location.", CUST,
   wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Goodwill with one stock part, part A, costing $40.00"), "Note part A's quantity on hand."],
  [OPEN_WO, FIN, "Click Issue Credit.", "Credit part A.", "Open part A in Inventory.", "In QuickBooks Online, open the entries for the credit."],
  [["Work order 1 opens."], ["The invoice shows."], ["Part A is listed at a $0.00 credit that cannot be edited and with no restocking fee."], ["The credit is saved."],
   ["Part A's quantity on hand is the noted figure plus 1."], ["An entry debits Inventory Asset $40.00 and credits account G $40.00."]],
  ["S12-E7", ("Jira SV-11977", "Issue Credit of a no-charge line's part: the restock posts Dr Inventory Asset / Cr the category account; its void posts the reverse.")])
C("S12-34", S, "A $0.00 credit never blocks reversing the invoice",
  [ADMIN, ON, CUST, wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Goodwill, with a $0.00 credit issued for line 2's part")],
  [OPEN_WO, FIN, "Reverse the invoice."],
  [["Work order 1 opens."], ["The invoice shows."], ["The invoice is reversed."]],
  ["S12-E7"])
C("S12-35", S, "Mark as No Charge is not offered on a declined line or one with a credit",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable, with line 1 declined and line 2 approved, so an offering line can be compared"),
   wo(2, "A", "Approved", ", billable, reversed after an invoice, whose line 1 has a return")],
  [OPEN_WO, "Open line 1's three-dots menu.", LMENU, "Open work order 2.", "Open line 1's three-dots menu."],
  [["Work order 1 opens."], ['Line 1\'s menu offers no "Mark as No Charge".'], ['Line 2\'s menu offers "Mark as No Charge".'], ["Work order 2 opens."],
   ['Line 1\'s menu offers no "Mark as No Charge".']],
  ["S12-E8"])
C("S12-36", S, "Print Work Order prints the chip next to the no-charge line",
  [ADMIN, ON, CUST, NCL2],
  [OPEN_WO, "Click Print Work Order."],
  [["Work order 1 opens."], ['The print shows "No Charge · Goodwill" next to line 2; line 1 prints as today.']],
  ["S12-E8", "S2-R22"])
C("S12-37", S, "An asset's Internal category is hidden on a regular customer",
  [ADMIN, ON, icust("A", ", with one asset, asset 1, whose Internal category is General Internal"), cust("B")],
  ["Move asset 1 to customer B.", "Open asset 1's Edit Asset window."],
  [["Asset 1 belongs to customer B."], ['No "Internal category" field shows; the stored value is kept for when the customer is flagged.']],
  ["S12-E8"])
C("S12-38", S, "Reopen then Close keeps an archived category",
  [ADMIN, ON, NO_ACCT, "Have a new No Charge category for this test, category A.", cust("A"), ncwo(1, "A", "category A", "closed"),
   "Archive category A after work order 1 was closed."],
  [OPEN_WO, "Reopen work order 1 from the Finance tab.", CLOSE_BTN, CONFIRM_CLOSE, FIN],
  [["Work order 1 opens."], ["Work order 1 is Complete."], ["The confirmation opens."], ["The work order is Closed."],
   ['The document reads "Category: [category A\'s name]".']],
  ["S12-E8"], note=NAME_NOTE)
C("S12-39", S, "The customer's Fees & Discounts tab keeps removed adjustments",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, whose line 2 carries a 10% line discount")],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK, "Open customer A's Fees & Discounts tab."],
  [["Line 2 shows its discount."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."], ["Line 2's discount is gone."],
   ["The removed discount stays in the history, as deleted ones do today."]],
  ["S12-E8"])
C("S12-40", S, "A line with a posted vendor bill asks where the cost goes first",
  [ADMIN, ON, QB, "Make sure Goodwill is mapped to an expense account at the test location.", CUST,
   wo(1, "A", "Approved", ", billable, whose line 2 holds a special-order part, part 1, with its vendor bill of $90.00 posted")],
  [OPEN_WO, LMENU, MARK],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'],
   ['"Change where the cost is posted?" opens first: "The vendor bill for [part 1] ($90.00) was posted to Cost of Parts. If you continue, that cost moves to [account] when this work order is invoiced."']],
  ["S2-R8", "UFS-14"], note=NAME_NOTE)
C("S12-41", S, "Receiving a part on a no-charge line shows the cost-only notice",
  [ADMIN, ON, CUST, wo(1, "A", "Approved", ", billable, whose line 2 is No Charge under Goodwill with a special-order part, part 1, ordered and not received")],
  [OPEN_WO, "Open the receive screen for part 1."],
  [["Work order 1 opens."], ['The notice reads "No Charge line: cost only".']],
  ["S2-R19"])
C("S12-42", S, "A failed mark leaves the line as it was",
  [ADMIN, ON, CUST, BILL2],
  [OPEN_WO, LMENU, MARK, PICKG, MARK_OK],
  [["Work order 1 opens."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."],
   ['When the change fails, "Could not change the line. Try again." shows and line 2 stays as it was.']],
  ["EH-S12"], marker=NOMAN("the change has to fail, which only a developer can make happen"))
C("S12-43", S, "The chip shows in Tech View and on the phone",
  [ON, PHONE, CUST, NCL2],
  [OPEN_WO, "Switch to the Tech View display."],
  [['Line 2 shows the chip "No Charge · Goodwill" and $0.00 on the phone layout.'], ['Line 2 shows the chip in Tech View.']],
  ["S12-R3", "FF-S12"])
