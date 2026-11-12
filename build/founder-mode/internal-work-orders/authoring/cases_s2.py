"""Story 2 — An internal or no-charge work order from creation to Close (SV-11759): New Work Order (Internal badge and tooltip, the No
Charge checkbox, Category, Original work order and line, original technician), the one badge and the orange header card, lines with
cost and hours and no prices, Convert to No Charge, Change category, Convert to Billable, Change Customer, the vendor bill window, the
lock after Close, lists, Board, Schedule and search, the Classification chip, notes and the Audit Log, fees, discounts, fixed prices,
the cost-only notices, the setting off, permissions, deposits, edge cases and the Error Handling lines."""
from iwo_lib import C, HOLD, NOMAN, MR_BANNER, MR_HOLD
from common import *

S = "S2"
NWO = "Click New Work Order."
PICK_A = "Pick customer A."
PICK_1 = "Pick asset 1."
SAVE_NWO = "Click Save in the New Work Order window."
TICK_NC = 'Tick the "No Charge" checkbox.'
CAT_SEL = 'Open the "Category" select.'
CONV_NC = 'Click "Convert to No Charge".'
CONV_B = 'Click "Convert to Billable".'
CHG_CAT = 'Click "Change category".'
NOTES = "Open the Notes tab."
AUDIT = "Open the work order's Audit Log."
TIP = "Hover over the info icon next to the Internal badge."
INT_TIP_ASSET = 'The tooltip reads "Internal customer: no prices, no invoice. Posts to [category], from the asset."'
NC_BODY_B = "Every line is priced as a new line would be today. You can convert it to no charge again until it is invoiced."
QB_ORIG = "Have a new invoiced work order for this test, work order 2, for customer A on asset 1, with one line, line 1, assigned to technician A."

# ---- New Work Order, internal customer ---------------------------------------------------------------------------------------
C("S2-01", S, "New Work Order shows the Internal badge and the asset's category",
  [ADMIN, ON, "Have a new Internal category for this test, category A.",
   icust("A", ", with one asset, asset 1, whose Internal category is category A")],
  [NWO, PICK_A, PICK_1, TIP],
  [["The New Work Order window opens."], ['The "Internal" badge shows next to customer A\'s name, with an info icon.'], ["Asset 1 is picked."],
   [INT_TIP_ASSET.replace("[category]", "[category A's name]")]],
  ["S2-R1", "UFS-07", "KD-CAT"], note=NAME_NOTE)
C("S2-02", S, "New Work Order names the customer's category when the asset has none",
  [ADMIN, ON, "Have a new Internal category for this test, category B.",
   icust("A", ", whose default internal category is category B, with one asset, asset 1, that has no Internal category")],
  [NWO, PICK_A, PICK_1, TIP],
  [["The New Work Order window opens."], ['The "Internal" badge shows next to customer A.'], ["Asset 1 is picked."],
   ['The tooltip reads "Internal customer: no prices, no invoice. Posts to [category B\'s name], from the customer."']],
  ["S2-R1", "UFS-07"], note=NAME_NOTE)
C("S2-03", S, "With no category of its own, the default category is named from the customer",
  [ADMIN, ON, icust("A", ", whose default internal category is General Internal, with one asset, asset 1, that has no Internal category")],
  [NWO, PICK_A, PICK_1, TIP],
  [["The New Work Order window opens."], ['The "Internal" badge shows next to customer A.'], ["Asset 1 is picked."],
   ['The tooltip reads "Internal customer: no prices, no invoice. Posts to General Internal, from the customer."']],
  ["S2-R1", "UFS-07"])
C("S2-04", S, "A work order for an internal customer is created internal",
  [ADMIN, ON, icust("A", ", with one asset, asset 1"), DESK],
  [NWO, PICK_A, PICK_1, SAVE_NWO],
  [["The New Work Order window opens."],
   ['The "Internal" badge shows next to customer A.', 'There is no "No Charge" checkbox and no category select in the window.'],
   ["Asset 1 is picked."],
   ['The new work order opens with one "Internal" badge next to its status.', 'It offers "Close Work Order" where a billable work order offers "Create invoice".']],
  ["S2-R1", "S2-N3", "KD-FLAG", "T-IWO", "OV-IC"])
C("S2-05", S, "Changing the asset of an open internal work order changes its category",
  [ADMIN, ON, NO_ACCT, "Have two new Internal categories for this test, category A and category B.",
   icust("A", ", with two assets: asset 1 whose Internal category is category A, and asset 2 whose Internal category is category B"),
   iwo(1, "A", "Complete", ", on asset 1"), REVIEW_OFF],
  [OPEN_WO, "Change the work order's asset to asset 2.", CLOSE_BTN, CONFIRM_CLOSE, FIN],
  [["Work order 1 opens."], ["Asset 2 shows on the work order."], ["The Close confirmation opens."], ["The work order shows the status Closed."],
   ['The INTERNAL document reads "Category: [category B\'s name]": the category followed the new asset.']],
  ["S2-R1", "S3-R5"], note=NAME_NOTE)
C("S2-06", S, "Editing the customer's category changes an open internal work order",
  [ADMIN, ON, NO_ACCT, "Have a new Internal category for this test, category B.",
   icust("A", ", whose default internal category is General Internal, with one asset, asset 1, that has no Internal category"),
   iwo(1, "A", "Complete", ", on asset 1"), REVIEW_OFF],
  ["Open customer A's page.", "Click Edit Customer.", 'Pick category B in "Default internal category".', SAVE, OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["Category B is picked."], ["The window closes."], ["Work order 1 opens."],
   ["The Close confirmation opens."], ["The work order shows the status Closed."], ['The INTERNAL document reads "Category: [category B\'s name]".']],
  ["S2-R1"], note=NAME_NOTE)
C("S2-07", S, "Editing the customer's category does not change a closed work order",
  [ADMIN, ON, "Have a new Internal category for this test, category B.",
   icust("A", ", whose default internal category is General Internal, with one asset, asset 1, that has no Internal category"),
   iwo(1, "A", "closed", ", on asset 1")],
  ["Open customer A's page.", "Click Edit Customer.", 'Pick category B in "Default internal category".', SAVE, OPEN_WO, FIN],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["Category B is picked."], ["The window closes."], ["Work order 1 opens, Closed."],
   ['The INTERNAL document still reads "Category: General Internal".']],
  ["S2-R1", "S2-R13"])
C("S2-08", S, "A work order created from an inspection on an internal customer is internal",
  [ADMIN, ON, icust("A", ", with one asset, asset 1, that has a completed inspection, inspection 1, with a failed item")],
  ["Open inspection 1.", "Create a work order from inspection 1.", "Open the new work order."],
  [["Inspection 1 opens."], ["A work order is created."], ['The work order shows the "Internal" badge and its lines show no prices.']],
  ["S2-R1"])
C("S2-09", S, "A work order from a maintenance reminder on an internal customer is internal",
  [ADMIN, ON, icust("A", ", with one asset, asset 1, that has a due maintenance reminder, reminder 1")],
  ["Open reminder 1.", "Create a work order from reminder 1.", "Open the new work order."],
  [["Reminder 1 opens."], ["A work order is created."], ['The work order shows the "Internal" badge.']],
  ["S2-R1"], banner=MR_BANNER, marker=MR_HOLD)

# ---- New Work Order, No Charge -------------------------------------------------------------------------------------------------
C("S2-10", S, "New Work Order shows the No Charge checkbox at the bottom with its tooltip",
  [ADMIN, ON, cust("A", ", not flagged, with one asset, asset 1")],
  [NWO, PICK_A, 'Hover over the info icon next to "No Charge".'],
  [["The New Work Order window opens."],
   ['At the bottom of the window, below the "Asset Here?" checkbox and a divider, an unticked "No Charge" checkbox shows with an info icon.'],
   ['The tooltip reads "Warranty, goodwill or comeback work. Closes without an invoice; parts cost posts to the expense account of the category."']],
  ["S2-R2", "UFS-08", "OV-NC"])
C("S2-11", S, "No Charge needs a category before the work order can be saved",
  [ADMIN, ON, cust("A", ", with one asset, asset 1")],
  [NWO, PICK_A, PICK_1, TICK_NC, SAVE_NWO, CAT_SEL],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."],
   ['A required select "Category" appears, empty.'], ['The save is refused and the field message "Pick a category" shows under Category.'],
   ["The list holds the active No Charge categories: Warranty, Goodwill and Comeback and any the shop added."]],
  ["S2-R2", "UFS-09", "S2-R16"])
C("S2-12", S, "A Goodwill work order is created No Charge with no original asked",
  [ADMIN, ON, cust("A", ", with one asset, asset 1")],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Goodwill" in Category.', SAVE_NWO],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."],
   ['No "Original work order" select appears.'],
   ['The work order opens with one "No Charge" badge next to its status.', "The category is not shown on the work order."]],
  ["S2-R2", "S2-R3", "S2-R16", "T-NCWO", "KD-NC"])
C("S2-13", S, "Warranty asks for the original work order, optional at creation",
  [ADMIN, ON, cust("A", ", with two assets, asset 1 and asset 2"),
   "Have two new work orders for this test for customer A: work order 2, invoiced, on asset 2, and work order 3, invoiced, on asset 1."],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Warranty" in Category.', 'Open the "Original work order" select.'],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."],
   ['The select "Original work order" appears under Category with the helper "Which earlier work order this job comes from, or Not in ShopView, and the line on it. The line sets the original technician for the comeback and warranty numbers. Optional here, required at Close."'],
   ["Work order 3 (same asset) is listed before work order 2.", "Each shows its number, date and first line.", '"Not in ShopView" is listed under Other.']],
  ["S2-R2", "S2-R17", "T-ORIG"])
C("S2-14", S, "Warranty work order can be saved without an original",
  [ADMIN, ON, cust("A", ", with one asset, asset 1")],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Warranty" in Category.', SAVE_NWO],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."],
   ['"Original work order" appears, empty.'], ['The work order is saved and opens with the "No Charge" badge.']],
  ["S2-R2", "S2-R17"])
C("S2-15", S, "Picking an original line shows its technicians",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"),
   "Have a new invoiced work order for this test, work order 2, for customer A on asset 1, whose line 1 has two technicians, technician A and technician B."],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Comeback" in Category.', 'Pick work order 2 in "Original work order".', 'Open the "Original line" select.', "Pick line 1."],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."],
   ['"Original work order" appears.'], ['The optional select "Original line" appears.', 'A line "Original technician: …" shows under the selects.'],
   ["It lists work order 2's lines, each with number, title and technician."],
   ['The line reads "Original technician: [technician A], [technician B]" with both names.']],
  ["S2-R2", "S2-R17", "T-ORIGL"], note=NAME_NOTE)
C("S2-16", S, "Without an original line, the original work order's technician is named",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"),
   "Have a new invoiced work order for this test, work order 2, for customer A on asset 1, assigned to technician A."],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Comeback" in Category.', 'Pick work order 2 in "Original work order".'],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."], ['"Original work order" appears.'],
   ['The line "Original technician: [technician A]" shows under the selects.']],
  ["S2-R2", "S2-R17"], note=NAME_NOTE)
C("S2-17", S, "Not in ShopView shows Original technician: none",
  [ADMIN, ON, cust("A", ", with one asset, asset 1")],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Comeback" in Category.', 'Pick "Not in ShopView" in "Original work order".'],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."], ['"Original work order" appears.'],
   ['The line "Original technician: none" shows under the selects.', 'No "Original line" select is offered for Not in ShopView.']],
  ["S2-R2", "S2-R17"])
C("S2-18", S, "Edit Work Order does not show the No Charge checkbox",
  [ADMIN, ON, cust("A"), wo(1, "A")],
  [OPEN_WO, "Open the Edit Work Order window."],
  [["Work order 1 opens."], ['The window shows its usual fields and no "No Charge" checkbox.']],
  ["S2-R2"])
C("S2-19", S, "No Charge works when no customer is flagged",
  [ADMIN, ON, "Make sure no customer of the organization carries the Internal customer flag.", cust("A", ", with one asset, asset 1")],
  [NWO, PICK_A, PICK_1, TICK_NC, 'Pick "Goodwill" in Category.', SAVE_NWO],
  [["The New Work Order window opens."], ['The "No Charge" checkbox shows.'], ["Asset 1 is picked."], ["The Category select appears."], ["Goodwill is picked."],
   ['The work order opens with the "No Charge" badge.']],
  ["S2-R2", "S1-R5"])
C("S2-20", S, "Without See Financial Data the No Charge checkbox is hidden",
  [ON, cust("A", ", with one asset, asset 1"), role("has 'Work Orders — Create & Edit' but not 'See Financial Data'")],
  [NWO, PICK_A],
  [["The New Work Order window opens."], ['No "No Charge" checkbox shows at the bottom of the window.']],
  ["S2-R2", "S2-N2", "PM-07"])

# ---- the badge, header card and lines without prices -------------------------------------------------------------------------
C("S2-21", S, "An internal work order shows one badge and an orange header card",
  [ADMIN, ON, DESK, icust("A"), iwo(1, "A")],
  [OPEN_WO],
  [['One "Internal" badge shows next to the status.', "The header card has an orange outline and a light orange background.",
    "No hint sentence shows under the header.", "The customer card shows no badge and no category."]],
  ["S2-R3", "OV-LOOK"])
C("S2-22", S, "A no-charge work order shows the No Charge badge and no category",
  [ADMIN, ON, DESK, cust("A"), ncwo(1, "A", "Goodwill"), icust("B"), iwo(2, "B", "in Estimate", ", so the two badges can be compared")],
  [OPEN_WO, "Open work order 2."],
  [['One "No Charge" badge shows next to the status.', "The header card has an orange outline and a light orange background.",
    '"Goodwill" is not shown anywhere on the work order page.'],
   ['Work order 2\'s "Internal" badge has a different style from work order 1\'s "No Charge" badge.']],
  ["S2-R3", "S2-R16"])
C("S2-23", S, "The mobile header shows the badge and the orange card",
  [ON, PHONE, icust("A"), iwo(1, "A")],
  [OPEN_WO],
  [['The mobile header shows the "Internal" badge next to the status.', "The header card has an orange outline and a light orange background."]],
  ["S2-R3", "FF-S2"])
C("S2-24", S, "Lines of an internal work order show quantity, cost and hours and no prices",
  [ADMIN, ON, DESK, icust("A"), iwo(1, "A", "in Estimate", f", with {LABOR_2H} and {STOCK_PART}")],
  [OPEN_WO],
  [["The lines table shows the labor line's 2.0 hours and the part's quantity 2 and cost $40.00.",
    "The Rate, Margin and Total columns are not shown.", "There is no work order total, tax, fee or discount block.",
    'In their place the block shows the single "Shop supplies" amount.']],
  ["S2-R4", "KD-NOPRICE", "OOS-05"])
C("S2-25", S, "The part window of an internal work order has no sell price fields",
  [ADMIN, ON, icust("A"), iwo(1, "A", "in Estimate", ", with one approved line, line 1")],
  [OPEN_WO, "Open Add Part on line 1.", "Pick an inventory part.", "Click Save in the part window."],
  [["Work order 1 opens."], ["The part window opens with no Sell price, Rate or Margin field."], ["The part is picked with its cost."],
   ["The part is added without asking for a sell price."]],
  ["S2-R4"])
C("S2-26", S, "Without See Financial Data a user sees quantity and hours, no cost",
  [ON, icust("A"), iwo(1, "A", "in Estimate", f", with {LABOR_2H} and {STOCK_PART}"),
   role("has 'Work Orders — View' but not 'See Financial Data'")],
  [OPEN_WO],
  [["The lines show the 2.0 hours and the part's quantity 2.", "No cost and no price shows."]],
  ["S2-R4", "PM-11"])
C("S2-27", S, "A no-charge estimate shows the NO CHARGE stamp and the category line",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "in Estimate", f", with {LABOR_2H} and {STOCK_PART}")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."],
   ['The estimate shows the NO CHARGE stamp and under it "Category: Goodwill".', "The labor line shows its hours; the part shows quantity and cost.",
    "No price, total, tax, fee or discount shows."]],
  ["S2-R4", "S2-R16"])
C("S2-28", S, "An internal estimate shows its stamp",
  [ADMIN, ON, icust("A"), iwo(1, "A", "in Estimate", f", with {LABOR_2H}")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ["The estimate shows the stamp for an internal work order and no prices or totals."]],
  ["S2-R4", "S3-R5"], marker="PO:internal-estimate-stamp",
  note="The PRD says the estimate of these work orders carries the NO CHARGE stamp and that the closed document of an internal work order carries the INTERNAL stamp; which word the internal estimate shows waits on the PO.")
C("S2-29", S, "Board cards show No Charge in place of the amount",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", f", with {LABOR_2H}"), cust("B"), wo(2, "B", "Approved", ", billable, so a card with an amount can be compared")],
  ["Open the Board."],
  [['Work order 1\'s card shows "No Charge" where work order 2\'s card shows its amount.', 'Work order 1\'s card shows the "Internal" badge.']],
  ["S2-R4", "S2-R10"])
C("S2-30", S, "The Statistics total of a no-charge work order reads No Charge",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, "Open the work order's Statistics."],
  [["Work order 1 opens."], ['Where Statistics shows a work order total, it reads "No Charge".']],
  ["S2-R4", ("Jira SV-11975", 'Prices, fees, discounts and deposits are hidden or refused on internal and No Charge work orders, and the IBS approval card is hidden; board cards and the Statistics total show "No Charge"; Shop supplies field per Story 10.')])

# ---- Convert to No Charge ----------------------------------------------------------------------------------------------------
C("S2-31", S, "The menu offers Convert to No Charge next to Add Work Order Fee / Discount",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved")],
  [OPEN_WO, MENU],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge" next to "Add Work Order Fee / Discount".']],
  ["S2-R5"])
C("S2-32", S, "Convert to No Charge opens its confirmation with Category and buttons",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved")],
  [OPEN_WO, MENU, CONV_NC, "Click the confirming Convert to No Charge button.", CAT_SEL],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'],
   ["A window titled \"Convert work order [number] to No Charge?\" opens.", 'It has a required "Category" select, empty.', 'Its buttons are "Cancel" and "Convert to No Charge".'],
   ['The conversion is refused and "Pick a category" shows under Category.'], ["The active No Charge categories are listed."]],
  ["S2-R5", "UFS-09"], note=NAME_NOTE)
C("S2-32b", S, "Convert to No Charge confirmation shows its explanation text",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved")],
  [OPEN_WO, MENU, CONV_NC],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'],
   ['The window\'s text reads "Prices, fees and discounts are removed from every line; costs and hours are kept. It closes with a NO CHARGE document instead of an invoice. You can convert it back until it is closed."']],
  ["S2-R5", "UFS-10"], marker="PO:no-charge-document-case",
  note="The PRD's story text writes NO CHARGE document and its message summary writes No Charge document; this case follows the story text until the PO answers.")
C("S2-33", S, "Converting to No Charge removes prices and writes a note",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", f", with {LABOR_2H} priced at the customer's labor rate")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", NOTES],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ['The work order shows the "No Charge" badge and the orange header card.', "The labor line shows 2.0 hours and no Rate or Total."],
   ['A read-only system note by ShopView, with the user and the time, reads "Converted to No Charge by [user]. Category Goodwill, original work order [number]. Prices, fees and discounts removed; costs and hours kept."']],
  ["S2-R5", "S2-R18", "S2-R13", "PM-07"], note=NAME_NOTE + " With Goodwill no original work order is picked, so that part of the note names none.")
C("S2-34", S, "Converting to Warranty stores the original and links it in the note",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"), wo(1, "A", "Approved", ", on asset 1"), QB_ORIG],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Warranty" in Category.', 'Pick work order 2 in "Original work order".', "Click the confirming Convert to No Charge button.", NOTES,
   "Click work order 2's number in the note."],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."],
   ['"Original work order" and "Original line" appear.'], ['"Original technician: [technician A]" shows.'], ['The "No Charge" badge shows.'],
   ['The note reads "Converted to No Charge by [user]. Category Warranty, original work order [work order 2\'s number]. Prices, fees and discounts removed; costs and hours kept."'],
   ["Work order 2 opens: the number in the note is a link."]],
  ["S2-R5", "S2-R18", "S2-R17"], note=NAME_NOTE)
C("S2-35", S, "Converting a work order with no-charge lines replaces their categories",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", with two approved lines: line 1 marked No Charge under Comeback and line 2 billable")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", NOTES],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ['The work order shows the "No Charge" badge.', 'Line 1 no longer shows its "No Charge · Comeback" chip: every line is now No Charge under Goodwill.'],
   ["The conversion note names line 1's replaced category, Comeback."]],
  ["S2-R5", "S12-R9"])
C("S2-36", S, "Convert to No Charge is not offered once the work order is invoiced",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced"), wo(2, "A", "Approved", ", so a menu that offers it can be compared")],
  [OPEN_WO, MENU, "Open work order 2.", MENU],
  [["Work order 1 opens."], ['The menu does not offer "Convert to No Charge".'], ["Work order 2 opens."], ['The menu offers "Convert to No Charge".']],
  ["S2-R5", "KD-LOCK"])
C("S2-37", S, "Convert to No Charge is disabled while a deposit is on the work order",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", with a deposit taken")],
  [OPEN_WO, MENU, 'Hover over "Convert to No Charge".'],
  [["Work order 1 opens."], ['"Convert to No Charge" shows disabled.'], ['The tooltip reads "Reverse the deposit first".']],
  ["S2-N4", "UFS-13"])
C("S2-38", S, "Add Deposit is not shown on internal and no-charge work orders",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved"), cust("B"), ncwo(2, "B", "Goodwill", "Approved"), wo(3, "B", "Approved", ", billable, so Add Deposit can be seen")],
  [OPEN_WO, FIN, "Open work order 2.", FIN, "Open work order 3.", FIN],
  [["Work order 1 opens."], ['"Add Deposit" is not shown.'], ["Work order 2 opens."], ['"Add Deposit" is not shown.'], ["Work order 3 opens."], ['"Add Deposit" is shown.']],
  ["S2-N5"])

# ---- Change category and Convert to Billable ---------------------------------------------------------------------------------
C("S2-39", S, "A no-charge work order's menu offers Change category and Convert to Billable",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill")],
  [OPEN_WO, MENU],
  [["Work order 1 opens."], ['The menu shows "Change category" and "Convert to Billable".', 'It does not show "Convert to No Charge" or "Add Work Order Fee / Discount".']],
  ["S2-R6", "S2-R15"])
C("S2-40", S, "Change category opens with the current category and Save disabled",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill")],
  [OPEN_WO, MENU, CHG_CAT, 'Pick "Comeback" in Category.'],
  [["Work order 1 opens."], ['The menu shows "Change category".'],
   ["A window titled \"Change category for work order [number]\" opens with Goodwill preselected.", 'Its buttons are "Cancel" and "Save"; "Save" is disabled.'],
   ['"Original work order" and "Original line" appear.', '"Save" is enabled.']],
  ["S2-R6", "UFS-11", "S2-R17"], note=NAME_NOTE)
C("S2-41", S, "Change category to Goodwill clears the original and writes a note",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"), QB_ORIG, ncwo(1, "A", "Warranty", "in Estimate", ", on asset 1, with work order 2 as its original work order")],
  [OPEN_WO, MENU, CHG_CAT, 'Pick "Goodwill" in Category.', SAVE, NOTES],
  [["Work order 1 opens."], ['The menu shows "Change category".'], ["The window opens with Warranty and work order 2."],
   ['"Original work order" and "Original line" disappear.'], ["The window closes; the badge still reads \"No Charge\"."],
   ["A system note records the change from Warranty to Goodwill and that the original work order was cleared."]],
  ["S2-R6", "S2-R18"])
C("S2-42", S, "Change category can add a missing original without changing the category",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"), QB_ORIG, ncwo(1, "A", "Warranty", "in Estimate", ", on asset 1, with no original work order")],
  [OPEN_WO, MENU, CHG_CAT, 'Pick work order 2 in "Original work order".', SAVE, MENU, CHG_CAT],
  [["Work order 1 opens."], ['The menu shows "Change category".'], ['The window opens with Warranty; "Save" is disabled.'],
   ['"Save" is enabled although the category is unchanged.'], ["The window closes."], ['The menu shows "Change category".'],
   ['The window shows Warranty and work order 2 in "Original work order".']],
  ["S2-R6"])
C("S2-43", S, "Cancel in Change category leaves the work order as it was",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill")],
  [OPEN_WO, MENU, CHG_CAT, 'Pick "Comeback" in Category.', "Click Cancel.", MENU, CHG_CAT],
  [["Work order 1 opens."], ['The menu shows "Change category".'], ["The window opens with Goodwill."], ["Comeback is picked."], ["The window closes."],
   ['The menu shows "Change category".'], ["The window opens with Goodwill still preselected."]],
  ["S2-R6"])
C("S2-44", S, "Convert to Billable opens its confirmation",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill")],
  [OPEN_WO, MENU, CONV_B],
  [["Work order 1 opens."], ['The menu shows "Convert to Billable".'],
   ["A window titled \"Convert work order [number] to billable?\" opens.", f'Its text reads "{NC_BODY_B}"', 'Its buttons are "Cancel" and "Convert to Billable".']],
  ["S2-R6", "UFS-12"], note=NAME_NOTE)
C("S2-45", S, "Convert to Billable prices labor at the customer's labor rate",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), ncwo(1, "A", "Goodwill", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, MENU, CONV_B, "Click the confirming Convert to Billable button.", NOTES],
  [["Work order 1 opens."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."],
   ['The "No Charge" badge and the orange header card are gone.', "The labor line shows Rate $120.00 and Total $240.00 (2.0 h × $120.00)."],
   ['A system note reads "Every line priced as a new line would be today. Category Goodwill removed."']],
  ["S2-R6", "S2-R18"])
C("S2-46", S, "Convert to Billable uses the location's labor rate when the customer has none",
  [ADMIN, ON, "Make sure the test location's labor rate is $100.00 an hour.", cust("A", " with no labor rate of its own"),
   ncwo(1, "A", "Goodwill", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, MENU, CONV_B, "Click the confirming Convert to Billable button."],
  [["Work order 1 opens."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."], ["The labor line shows Rate $100.00 and Total $200.00 (2.0 h × $100.00)."]],
  ["S2-R6"])
C("S2-47", S, "Convert to Billable prices a part from the cost on the line",
  [ADMIN, ON, "Make sure the parts pricing rule of the test location marks a part up from its cost (note the rule).",
   cust("A", " that uses the location's parts pricing"), ncwo(1, "A", "Goodwill", "Approved", f", with {STOCK_PART}"),
   "After the part was added, change that part's catalogue cost to $55.00, so the line's cost and the catalogue cost differ."],
  [OPEN_WO, MENU, CONV_B, "Click the confirming Convert to Billable button."],
  [["Work order 1 opens."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."],
   ["The part's sell price is the pricing rule applied to $40.00, the cost on the line, not to $55.00.", "Its quantity stays 2 and its cost $40.00."]],
  ["S2-R6", "S2-E4", "KD-PRICE"])
C("S2-48", S, "A line priced by hand earlier is priced as a new line after Convert to Billable",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"),
   wo(1, "A", "Approved", f", with {LABOR_2H} whose price was set by hand to $500.00 before it was converted to No Charge (Goodwill)")],
  [OPEN_WO, MENU, CONV_B, "Click the confirming Convert to Billable button."],
  [["Work order 1 opens with the \"No Charge\" badge."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."],
   ["The labor line shows Total $240.00 (2.0 h × $120.00), not the old $500.00."]],
  ["S2-E4", "S2-R6"])
C("S2-49", S, "Fees and discounts are removed on conversion and not restored",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", f", with {LABOR_2H}, a work order fee of $25.00 and a 10% line discount on the labor line")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", MENU, CONV_B,
   "Click the confirming Convert to Billable button."],
  [["Work order 1 shows the $25.00 fee and the discount."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ["The fee and the discount are gone."], ['The menu does not show "Add Work Order Fee / Discount".'], ["The confirmation opens."],
   ["The labor line is priced again; the $25.00 fee and the 10% discount do not come back."]],
  ["S2-R15"])
C("S2-50", S, "A new internal work order gets no automatic fees or default discount",
  [ADMIN, ON, "Make sure the organization has an auto-apply fee template of $10.00 on new work orders.",
   icust("A", ", with a default discount of 5% and one asset, asset 1")],
  [NWO, PICK_A, PICK_1, SAVE_NWO],
  [["The New Work Order window opens."], ['The "Internal" badge shows.'], ["Asset 1 is picked."],
   ["The work order opens with no $10.00 fee and no 5% discount.", 'Its menu offers no "Add Work Order Fee / Discount".']],
  ["S2-R21", "S2-R15"])
C("S2-51", S, "A fixed line total is removed when the work order becomes No Charge",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", with one approved line, line 1, with a Fixed Line Total of $1,250.00, 2.0 hours and one part costing $40.00")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", "Open Edit Line on line 1.", NOTES],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ["Line 1 shows 2.0 hours and the part's cost $40.00 and no total."], ["The fixed-price fields are not shown in the line window."],
   ['The note records "Fixed line total $1,250.00 removed".']],
  ["S2-R20"])
C("S2-52", S, "Convert to Billable does not restore a fixed line total",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"),
   wo(1, "A", "Approved", ", with line 1 of 2.0 hours that had a Fixed Line Total of $1,250.00 before it was converted to No Charge (Goodwill)")],
  [OPEN_WO, MENU, CONV_B, "Click the confirming Convert to Billable button."],
  [["Work order 1 opens with the \"No Charge\" badge."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."],
   ["Line 1's labor is priced at $240.00 (2.0 h × $120.00); the $1,250.00 fixed total does not come back."]],
  ["S2-R20"])

# ---- Change Customer -----------------------------------------------------------------------------------------------------------
CC = 'Click "Change Customer" on the customer card.'
C("S2-53", S, "Changing to an internal customer makes the work order internal",
  [ADMIN, ON, cust("A"), icust("B", ", with a Min shop supplies charge of $15.00"), wo(1, "A", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, CC, "Pick customer B.", "Confirm the change."],
  [["Work order 1 opens."], ["The Change Customer window opens."],
   ["The window says the prices will be removed.", "It adds \"Shop supplies resets to [customer B's name]'s minimum ($15.00).\""],
   ['The work order shows the "Internal" badge.', "The labor line shows 2.0 hours and no price.", 'The menu offers no "Convert to No Charge".', '"Shop supplies" reads $15.00.']],
  ["S2-R7", "S10-R2", "PM-06"], note=NAME_NOTE)
C("S2-54", S, "Changing from an internal customer to a regular one makes it billable",
  [ADMIN, ON, icust("A"), cust("B", ", with its own labor rate of $120.00 an hour"), iwo(1, "A", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, CC, "Pick customer B.", "Confirm the change."],
  [["Work order 1 opens with the \"Internal\" badge."], ["The Change Customer window opens."], ["The window says the lines will be priced."],
   ['The "Internal" badge is gone.', "The labor line shows Total $240.00 (2.0 h × $120.00)."]],
  ["S2-R7"])
C("S2-55", S, "A No Charge mark survives a change to another regular customer",
  [ADMIN, ON, cust("A"), cust("B", ", with a Min shop supplies charge of $12.00"), ncwo(1, "A", "Comeback")],
  [OPEN_WO, CC, "Pick customer B.", "Confirm the change.", MENU, CHG_CAT],
  [["Work order 1 opens."], ["The Change Customer window opens."], ["It adds \"Shop supplies resets to [customer B's name]'s minimum ($12.00).\""],
   ['The work order keeps the "No Charge" badge.', '"Shop supplies" reads $12.00.'], ['The menu shows "Change category".'], ["The window shows Comeback."]],
  ["S2-R7", "S10-R2"], note=NAME_NOTE)
C("S2-56", S, "A no-charge work order moved to an internal customer becomes internal",
  [ADMIN, ON, cust("A"), icust("B"), ncwo(1, "A", "Goodwill")],
  [OPEN_WO, CC, "Pick customer B.", "Confirm the change.", MENU],
  [["Work order 1 opens."], ["The Change Customer window opens."], ["Customer B is picked."],
   ['The badge reads "Internal" instead of "No Charge".'], ['The menu offers no "Change category" and no "Convert to Billable": the category is gone.']],
  ["S2-R7"])
C("S2-57", S, "Without See Financial Data the reset sentence leaves out the amount",
  [ON, cust("A"), icust("B", ", with a Min shop supplies charge of $15.00"), ncwo(1, "A", "Goodwill"),
   role("has 'Work Orders — Create & Edit' but not 'See Financial Data'")],
  [OPEN_WO, CC, "Pick customer B."],
  [["Work order 1 opens."], ["The Change Customer window opens."],
   ["The window adds \"Shop supplies resets to [customer B's name]'s minimum\" with no dollar amount."]],
  ["S2-R7"], note=NAME_NOTE)
C("S2-58", S, "While the setting is off, a change of customer makes the work order billable",
  [ADMIN, OFF, cust("A"), icust("B", ", flagged while the setting was on"), cust("C"),
   wo(1, "A", "Approved", ", billable"), ncwo(2, "A", "Goodwill", "Approved", ", made while the setting was on")],
  [OPEN_WO, CC, "Pick customer B.", "Confirm the change.", "Open work order 2.", CC, "Pick customer C.", "Confirm the change."],
  [["Work order 1 opens."], ["The window opens."], ["Customer B is picked."], ['Work order 1 stays billable with no "Internal" badge.'],
   ["Work order 2 opens."], ["The window opens."], ["Customer C is picked."], ['Work order 2 keeps the "No Charge" badge.']],
  ["S2-N1"])

# ---- vendor bill window ---------------------------------------------------------------------------------------------------------
VB = "with one special-order part, part 1, received against it and its vendor bill of $125.00 entered"
C("S2-59", S, "A vendor bill makes Convert to No Charge ask where the cost goes",
  [ADMIN, ON, QB, "Make sure the Goodwill category has a QuickBooks expense account at the test location.", cust("A"),
   wo(1, "A", "Approved", f", {VB}")],
  [OPEN_WO, MENU, CONV_NC],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'],
   ['First a window titled "Change where the cost is posted?" opens.',
    'Its text reads "The vendor bill for [part 1] ($125.00) was posted to Cost of Parts. If you continue, that cost moves to [account] when this work order is closed."',
    'Its buttons are "Cancel" and "Continue".']],
  ["S2-R8", "UFS-14"], note=NAME_NOTE + " [account] is the account the category picked in the next window is mapped to.")
C("S2-60", S, "Cancel in the vendor bill window leaves the work order billable",
  [ADMIN, ON, QB, cust("A"), wo(1, "A", "Approved", f", {VB}")],
  [OPEN_WO, MENU, CONV_NC, "Click Cancel."],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ['"Change where the cost is posted?" opens.'],
   ['The window closes and the work order stays billable with no "No Charge" badge.']],
  ["S2-R8", "S2-R6"])
C("S2-61", S, "Several vendor bills are named together in the window",
  [ADMIN, ON, QB, cust("A"),
   wo(1, "A", "Approved", ", with two special-order parts received against it and their vendor bills of $125.00 and $75.00 entered")],
  [OPEN_WO, MENU, CONV_NC],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'],
   ['The window\'s text reads "The vendor bills for 2 parts ($200.00) were posted to Cost of Parts. …" ($125.00 + $75.00 = $200.00).']],
  ["S2-R8"])
C("S2-62", S, "Between two categories the vendor bill window names both accounts",
  [ADMIN, ON, QB, "Make sure Goodwill and Comeback each have their own QuickBooks expense account at the test location.", cust("A"),
   ncwo(1, "A", "Goodwill", "Approved", f", {VB} after it was made No Charge")],
  [OPEN_WO, MENU, CHG_CAT, 'Pick "Comeback" in Category.', SAVE],
  [["Work order 1 opens."], ['The menu shows "Change category".'], ["The window opens with Goodwill."], ["Comeback is picked."],
   ['"Change where the cost is posted?" opens and names Goodwill\'s expense account as where the bill was posted and Comeback\'s as where it moves.']],
  ["S2-R8"])
C("S2-63", S, "Without an accounting integration no vendor bill window shows",
  [ADMIN, ON, NO_ACCT, cust("A"), wo(1, "A", "Approved", f", {VB}")],
  [OPEN_WO, MENU, CONV_NC],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'],
   ['The "Convert work order [number] to No Charge?" window opens directly, with no "Change where the cost is posted?" window first.']],
  ["S2-R8"], note=NAME_NOTE)

# ---- lock after Close ----------------------------------------------------------------------------------------------------------
C("S2-64", S, "A closed no-charge work order offers no Convert or Change category",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "closed")],
  [OPEN_WO, MENU],
  [['The work order shows the status Closed with the "No Charge" badge.', 'The header card reads "Closed on [posting date]. To change it, reopen it from the Finance tab."',
    "There is no Reopen button on the work order header."],
   ['The menu offers no "Change category", "Convert to Billable" or "Convert to No Charge".']],
  ["S2-R9", "UFS-23", "KD-LOCK"], note=NAME_NOTE)
C("S2-65", S, "Change Customer is disabled on a closed internal work order",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  [OPEN_WO, 'Hover over "Change Customer" on the customer card.'],
  [["Work order 1 opens, Closed."], ['"Change Customer" is disabled with the tooltip "Reopen the work order to change the customer."']],
  ["S2-R9", "S2-R7"])

# ---- lists, Board, Schedule, search ----------------------------------------------------------------------------------------------
C("S2-66", S, "The work orders list shows the badge and No Charge in Total Price",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved"), cust("B"), ncwo(2, "B", "Goodwill", "Approved")],
  ["Open the work orders list.", "Open the Approved tab."],
  [["The list opens."],
   ['Work order 1 shows the "Internal" badge in the status column and "No Charge" in Total Price.',
    'Work order 2 shows the "No Charge" badge in the status column and "No Charge" in Total Price.']],
  ["S2-R10", "T-NC"])
C("S2-67", S, "A closed internal work order is listed under All with status Closed",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed")],
  ["Open the work orders list.", "Open the All tab.", "Open the Completed tab."],
  [["The list opens."], ['Work order 1 shows the status "Closed" with the "Internal" badge, where invoiced work orders show.'],
   ["Work order 1 is not in the Completed tab, which lists work waiting for an invoice."]],
  ["S2-R10", "T-CLOSED"])
C("S2-68", S, "The Status chip value Closed matches only closed internal and no-charge work orders",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed"), cust("B"), ncwo(2, "B", "Goodwill", "closed"), wo(3, "B", "invoiced"), wo(4, "B", "paid")],
  ["Open the work orders list.", "Open the All tab.", 'Set the Status chip to "Closed".', 'Set the Status chip to "Invoiced".', 'Set the Status chip to "Paid".'],
  [["The list opens."], ["The All tab shows."], ["Work order 1 and work order 2 are listed.", "Work order 3 and work order 4 are not."],
   ["Work order 3 is listed.", "Work order 1 and work order 2 are not."], ["Work order 4 is listed.", "Work order 1 and work order 2 are not."]],
  ["S2-R10"])
C("S2-69", S, "Total Price shows only with See Financial Data, the badge always",
  [ON, icust("A"), iwo(1, "A", "Approved"), role("has 'Work Orders — View' but not 'See Financial Data'")],
  ["Open the work orders list."],
  [['Work order 1 shows the "Internal" badge in the status column.', "There is no Total Price column."]],
  ["S2-R10"])
C("S2-70", S, "Tech View and the mobile work order card show the badge",
  [ON, PHONE, cust("A"), ncwo(1, "A", "Goodwill", "Approved")],
  ["Open the work orders list.", "Switch to the Tech View display."],
  [['Work order 1\'s card shows the "No Charge" badge.'], ['Work order 1 shows the "No Charge" badge in Tech View.']],
  ["S2-R10", "FF-S2"])
C("S2-71", S, "A closed internal work order sits where an invoiced one sits on the Board",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed"), cust("B"), wo(2, "B", "invoiced", ", so the invoiced place can be compared")],
  ["Open the Board."],
  [['Work order 1\'s card shows the "Internal" badge and sits in the same place as work order 2\'s invoiced card.']],
  ["S2-R10"])
C("S2-72", S, "Schedule cards show the badge next to the work order number",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", ", scheduled today for a technician")],
  ["Open the Schedule for today."],
  [['Work order 1\'s card shows the "Internal" badge next to its number.']],
  ["S2-R10"])
C("S2-73", S, "Global search shows the badge next to the status",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "Approved")],
  ["Search for work order 1's number in global search."],
  [['Work order 1\'s result shows the "No Charge" badge next to its status.']],
  ["S2-R10"])
C("S2-74", S, "The customer's and the asset's Work Orders tabs show the badge",
  [ADMIN, ON, icust("A", ", with one asset, asset 1"), iwo(1, "A", "Approved", ", on asset 1")],
  ["Open customer A's Work Orders tab.", "Open asset 1's Work Orders tab."],
  [['Work order 1 shows the "Internal" badge.'], ['Work order 1 shows the "Internal" badge.']],
  ["S2-R10"])
C("S2-75", S, "The Classification chip filters the list by classification",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved"), cust("B"), ncwo(2, "B", "Goodwill", "Approved"), wo(3, "B", "Approved", ", billable")],
  ["Open the work orders list.", 'Set the "Classification" chip to "Internal".', 'Set the chip to "No Charge".', 'Set the chip to "Billable".', 'Set the chip to "All".'],
  [['A chip "Classification: All" shows.'], ["Work order 1 is listed; work order 2 and work order 3 are not."], ["Work order 2 is listed; work order 1 and work order 3 are not."],
   ["Work order 3 is listed; work order 1 and work order 2 are not."], ["All three work orders are listed."]],
  ["S2-R14", "T-CLASS"])
C("S2-76", S, "The Classification chip is in the mobile filter sheet",
  [ON, PHONE],
  ["Open the work orders list.", "Open the filter sheet."],
  [["The list shows as cards."], ['The filter sheet offers "Classification" with All, Billable, Internal and No Charge.']],
  ["S2-R14"])
C("S2-77", S, "While the setting is off, the Classification chip is hidden and badges stay",
  [ADMIN, OFF, icust("A"), iwo(1, "A", "Approved", ", made while the setting was on")],
  ["Open the work orders list."],
  [['No "Classification" chip shows.', 'Work order 1 still shows the "Internal" badge.']],
  ["S2-R14"])

# ---- portal and IBS buttons --------------------------------------------------------------------------------------------------
C("S2-78", S, "An internal work order offers no Send to Portal or Request IBS Approval",
  [ADMIN, ON, icust("A"), iwo(1, "A", "in Estimate"), cust("B"), wo(2, "B", "in Estimate", ", billable, so the two actions can be seen")],
  [OPEN_WO, "Open work order 2."],
  [['Work order 1 shows no "Send to Portal" and no "Request IBS Approval".'], ['Work order 2 shows "Send to Portal".']],
  ["S2-R11", "OOS-10"])
C("S2-79", S, "A no-charge estimate can be sent to the portal until it is closed",
  [ADMIN, ON, cust("A", ", with a portal contact"), ncwo(1, "A", "Goodwill", "in Estimate"), ncwo(2, "A", "Goodwill", "closed")],
  [OPEN_WO, "Click Send to Portal.", "Open work order 2."],
  [['Work order 1 shows "Send to Portal" and no "Request IBS Approval".'], ["The estimate is sent to the portal as today."],
   ['Work order 2 shows no "Send to Portal".']],
  ["S2-R11"])
C("S2-80", S, "The IBS approval card is hidden after converting to No Charge",
  [ADMIN, ON, cust("A", ", with an IBS account"), wo(1, "A", "Approved", ", with an IBS approval already requested")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button."],
  [["Work order 1 shows its IBS card."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ['The IBS card is hidden and "Request IBS Approval" is not offered.']],
  ["S2-E6", "S2-R11"])

# ---- Audit Log, cost-only notices, splits and copies --------------------------------------------------------------------------
C("S2-81", S, "Converting and changing the category are recorded in the Audit Log",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", MENU, CHG_CAT, 'Pick "Comeback" in Category.', SAVE, AUDIT],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."], ['The "No Charge" badge shows.'],
   ['The menu shows "Change category".'], ["The window opens."], ["Comeback is picked."], ["The window closes."],
   ["The Audit Log has a row for Convert to No Charge and a row for Change category, each with the user and the time."]],
  ["S2-R13", "S2-R18"])
C("S2-82", S, "Adding and removing a customer's Internal flag are in the customer Audit Log",
  [ADMIN, ON, cust("A")],
  ["Open customer A's page.", "Click Edit Customer.", 'Tick "Internal customer".', SAVE, "Click Edit Customer.", 'Untick "Internal customer".', 'Click "Remove flag".', SAVE,
   "Open customer A's Audit Log."],
  [["Customer A's page opens."], ["The window opens."], ["The checkbox is ticked."], ['The "Internal" badge shows.'], ["The window opens."],
   ["The Remove the Internal flag window opens."], ["The checkbox is unticked."], ["The badge is gone."],
   ["The Audit Log shows the flag added and the flag removed, each with the user and the time."]],
  ["S2-R13"])
C("S2-83", S, "Receiving a special-order part on an internal work order writes cost only",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", ", with one special-order part, part 1, ordered from a vendor and not yet received")],
  [OPEN_WO, "Open the receive screen for part 1.", "Enter a cost of $60.00.", "Click Receive."],
  [["Work order 1 opens."], ['The notice reads "Internal work order: cost only, no sell price" instead of "Updating the cost also updates the sell price".'],
   ["The cost shows $60.00."], ["Part 1 is received with cost $60.00 and no sell price shows on the line."]],
  ["S2-R19", "KD-PRICE"])
C("S2-84", S, "Receiving on a no-charge work order shows its own cost-only notice",
  [ADMIN, ON, cust("A"), ncwo(1, "A", "Goodwill", "Approved", ", with one special-order part, part 1, ordered and not yet received")],
  [OPEN_WO, "Open the receive screen for part 1."],
  [["Work order 1 opens."], ['The notice reads "No Charge work order: cost only, no sell price".']],
  ["S2-R19"])
C("S2-85", S, "Editing a vendor invoice item of an internal work order shows the notice",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", ", with one special-order part, part 1, received and on a vendor invoice, invoice 1")],
  ["Open invoice 1's item for part 1.", "Change its cost to $70.00.", SAVE, OPEN_WO],
  [['The item shows the notice "Internal work order: cost only, no sell price".'], ["The cost shows $70.00."], ["The item is saved."],
   ["Part 1 shows cost $70.00 and still no sell price."]],
  ["S2-R19"])
C("S2-86", S, "A core charge change writes no price on an internal work order",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", ", with one part, part 1, that carries a core")],
  [OPEN_WO, "Change part 1's core charge to $30.00.", RELOAD],
  [["Work order 1 opens; the core row shows with no price."], ["The core charge is saved."], ["Part 1 and its core row still show no sell price."]],
  ["S2-R19", "S2-E7"])
C("S2-87", S, "A canned line added to an internal work order loses its prices",
  [ADMIN, ON, "Have a new canned line for this test with a labor price and a part with a sell price.", icust("A"), iwo(1, "A")],
  [OPEN_WO, "Add the canned line to work order 1."],
  [["Work order 1 opens."], ["The line shows its hours, the part's quantity and cost, and no price."]],
  ["S2-E1", "S2-E5"])
C("S2-88", S, "Splitting a no-charge work order keeps No Charge with $0.00 shop supplies",
  [ADMIN, ON, cust("A", ", with a Min shop supplies charge of $15.00"), ncwo(1, "A", "Comeback", "Approved", ", with two approved lines")],
  [OPEN_WO, "Split work order 1, moving its second line to a new work order.", "Open the new work order.", MENU, CHG_CAT],
  [["Work order 1 opens."], ["A new work order is created."],
   ['It shows the "No Charge" badge.', '"Shop supplies" reads $0.00.', "The moved line shows cost and hours and no price, and no fee or discount was added."],
   ['The menu shows "Change category".'], ["The window shows Comeback."]],
  ["S2-E2"])
C("S2-89", S, "Lines copied from an internal work order into a billable one get prices",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", f", with {LABOR_2H}"), cust("B", ", with its own labor rate of $120.00 an hour"), wo(2, "B", "Approved")],
  ["Open work order 2.", "Copy the labor line of work order 1 into work order 2."],
  [["Work order 2 opens."], ["The copied line shows Total $240.00 (2.0 h × $120.00), priced from customer B's pricing."]],
  ["S2-E5"])
C("S2-90", S, "An imported work order of a flagged customer is internal",
  [ADMIN, ON, icust("A", ", with one asset, asset 1"), "Have a work order import file for this test with one work order for customer A on asset 1."],
  ["Import the file through the work order import.", "Open the imported work order."],
  [["The import finishes."], ['The work order shows the "Internal" badge.', 'Its menu offers no "Convert to No Charge".']],
  ["S2-E3"])
C("S2-91", S, "A core on an internal work order must be answered before Close",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", "Approved", ", with one part that carries a core, all lines done but not completed")],
  [OPEN_WO, CLOSE_BTN, 'Answer the core "Core OK".'],
  [["Work order 1 opens; the core row shows with no price."],
   ["The completion steps start and ask Core OK or Not OK for the core.", "No core amount is shown in the steps."],
   ['The last button of the steps reads "Close Work Order".']],
  ["S2-E7", "S3-R3"])

# ---- setting off, permissions, end-to-end goal --------------------------------------------------------------------------------
C("S2-92", S, "While the setting is off, New Work Order shows no badge or No Charge",
  [ADMIN, OFF, icust("A", ", flagged while the setting was on"), cust("B")],
  [NWO, PICK_A, "Pick customer B instead."],
  [["The New Work Order window opens."], ['No "Internal" badge or info icon shows next to customer A.'], ['No "No Charge" checkbox shows.']],
  ["S2-N1"])
C("S2-93", S, "While the setting is off, a no-charge work order can still be made billable",
  [ADMIN, OFF, cust("A"), ncwo(1, "A", "Goodwill", "Approved", ", made while the setting was on"), wo(2, "A", "Approved", ", billable")],
  [OPEN_WO, MENU, CONV_B, "Open work order 2.", MENU],
  [['Work order 1 keeps the "No Charge" badge and the orange header card.'], ['The menu offers "Change category" and "Convert to Billable".'],
   ['The confirmation reads "Every line is priced as a new line would be today." with no second sentence.'],
   ["Work order 2 opens."], ['The menu offers no "Convert to No Charge".']],
  ["S2-N1", "S2-R6"])
C("S2-94", S, "Without See Financial Data the Convert and Change category actions are hidden",
  [ON, cust("A"), wo(1, "A", "Approved"), ncwo(2, "A", "Goodwill", "Approved"),
   role("has 'Work Orders — Create & Edit' but not 'See Financial Data'")],
  [OPEN_WO, MENU, "Open work order 2.", MENU],
  [["Work order 1 opens."], ['The menu offers no "Convert to No Charge", as it offers no "Add Work Order Fee / Discount".'], ["Work order 2 opens."],
   ['The menu offers no "Convert to Billable" and no "Change category".']],
  ["S2-N2", "PM-07"])
C("S2-95", S, "An internal job goes from creation to Closed without editing a price",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A", ", with one asset, asset 1")],
  [NWO, PICK_A, PICK_1, SAVE_NWO, "Add a labor line of 1.5 hours.", "Complete the line.", CLOSE_BTN, CONFIRM_CLOSE],
  [["The New Work Order window opens."], ['The "Internal" badge shows.'], ["Asset 1 is picked."], ['The work order opens with the "Internal" badge.'],
   ["The line shows 1.5 hours and no price field was asked for."], ["The line is Complete."], ["The Close confirmation opens."],
   ['The work order shows the status Closed with the "Internal" badge; no sell price was ever entered.']],
  ["GOAL-1", "OV-CLOSE"])

# ---- Error Handling (held: no screen can make the change fail) --------------------------------------------------------------
C("S2-96", S, "A failed conversion shows an alert and keeps the classification",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button."],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ['When the change fails, an alert toast that must be dismissed reads "Could not change the work order. Try again."', "The work order stays billable."]],
  ["EH-S2-1", "UFS-42"], marker=NOMAN("the change has to fail, which only a developer can make happen"))
C("S2-97", S, "While a conversion runs, the button shows a spinner and ignores a second press",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved")],
  [OPEN_WO, MENU, CONV_NC, 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button."],
  [["Work order 1 opens."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   ["While the change runs, the button shows a spinner and is disabled; a second press does nothing."]],
  ["EH-S2-2"], marker=NOMAN("the change finishes too fast to press twice; it needs a slowed connection a developer sets up"))
