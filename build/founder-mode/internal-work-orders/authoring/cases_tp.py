"""Round 2a (12 Nov 2026): the tech plan (tech-plan-2026-11-12/: TECH-PLAN-TESTABLE.json, INVARIANTS-FROM-PLAN.md,
TECH-PLAN-DIVERGENCES.md). Loaded after every story module, it
  1. adds to existing cases the result bullets that ADD statements make checkable, with the plan quote under its own "From:" line
     (each change listed in TP_CHANGES, so REPORT.md can show what changed per case, Rule 134);
  2. holds the cases a DIVERGE item 1-4 decides, on the matching PO question (items 5-9: the cases follow the PRD, no hold);
  3. writes the new cases: ADD statements a tester can observe, and the plan's invariants (INVARIANTS-FROM-PLAN.md) no INV/REL case
     covered yet. Every new case still quotes the PRD (the plan informs, never overrules: Rules 30, 57);
  4. lists in TP_OUT every ADD statement left out, with the reason. build.py fails if an ADD statement is neither quoted nor listed."""
from iwo_lib import C, CASES, NOMAN, PRE_REL, PO_HOLD, API_BANNER, API_HOLD
from po_questions import QN
from common import *

BY = {c["key"]: c for c in CASES}
TP_CHANGES = {}


def _log(key, what): TP_CHANGES.setdefault(key, []).append(what)


def add(key, step, bullets, q=()):
    c = BY[key]; c["res"][step - 1] += list(bullets)
    c["q"] += [x for x in q if x not in c["q"]]; _log(key, f"step {step}: added {len(bullets)} result bullet(s); quotes {', '.join(q) or 'none'}")


def swap(key, old, new, q=()):
    c = BY[key]
    for r in c["res"]:
        for i, b in enumerate(r):
            if b == old: r[i] = new; break
        else: continue
        break
    else: raise KeyError(f"{key}: bullet not found: {old[:60]}")
    c["q"] += [x for x in q if x not in c["q"]]; _log(key, f"result rewritten from the plan; quotes {', '.join(q)}")


def cite(key, *q):
    c = BY[key]; c["q"] += [x for x in q if x not in c["q"]]; _log(key, f"plan quote added: {', '.join(q)}")


def step(key, s, res, q=()):
    c = BY[key]; c["steps"].append(s); c["res"].append(list(res))
    c["q"] += [x for x in q if x not in c["q"]]; _log(key, f"step added: {s!r}; quotes {', '.join(q)}")


def hold(key, slug, why):
    c = BY[key]; c["marker"] = PO_HOLD(QN[slug]); c["held"] = True; _log(key, f"held on PO question '{slug}' ({why})")


# ---- 1. bullets and quotes added to existing cases ----------------------------------------------------------------------------
add("S1-28", 4, ["The work orders are listed newest first."], ["TP-272"])
step("S1-50", "Hover over Archive in the menu.", ['Archive shows disabled with the tooltip "One default at a time; it cannot be archived."'], ["TP-409"])
BY["S1-51"].update(steps=[s for s in [
    "Open Administration > Service > Internal Work Orders.", "Open the No Charge categories tab.", "Open the row menu of category A.", "Click Archive.",
    "Confirm the archive.", 'Click the "Show archived (1)" link.', "Click Restore on category A.", 'Click the "Show active" link.']],
  res=[["The categories page opens."], ["Category A is listed."], ["The menu shows Edit and Archive."],
       ["A confirmation reads \"Archive [category A's name]? It stays on the work orders and lines that used it.\""],
       ["Category A leaves the active list.", 'A link "Show archived (1)" shows.'], ["The table shows the archived rows: category A with Restore."],
       ["Category A is no longer in the archived list."], ["The active list shows again, with category A in it."]],
  note=NAME_NOTE)
cite("S1-51", "TP-418", "TP-410", "TP-128")
add("S1-62", 3, ['The window is titled "Edit Category".'], ["TP-411"])
add("S1-63", 3, ['The window is titled "Edit Category".'], ["TP-411"])
cite("S1-67", "TP-347")
add("S2-13", 6, ['The groups are headed "Same asset", "Other work orders" and "Other"; each option reads "number · date · first line".'], ["TP-401", "TP-142"])
add("S2-22", 2, ['The "Internal" badge is filled orange; the "No Charge" badge is outlined in orange.'], ["TP-398"])
add("S2-24", 1, ['The third column is headed "Cost"; no Labour type column shows.'], ["TP-453", "TP-528"])
cite("S2-52", "TP-043")
swap("S2-53", "The window says the prices will be removed.", 'The window reads "Prices are removed; costs and hours are kept."', ["TP-152"])
swap("S2-54", "The window says the lines will be priced.", 'The window reads "Lines are priced as a new line would be today."', ["TP-450"])
add("S2-67", 2, ['The "Closed" status shows in a neutral grey; the orange is only on the badge.'], ["TP-397"])
add("S3-18", 3, ["The page moves to the Finance tab, showing the document."], ["TP-463"])
add("S3-26", 2, ["Work order 2's number reads as work order 2 shows it in ShopView (its display number)."], ["TP-679"])
swap("S3-43", "Create invoice is refused for the credit hold, as today.",
     'Create invoice is refused, as today, with "Cannot invoice this customer. Customer is on Credit Hold".', ["TP-475"])
add("S4-05", 5, ["The page stays on the Finance tab."], ["TP-473"])
add("S5-01", 2, ['General Internal\'s row carries a "Default" badge.', "Under each header the rows follow the name order: Comeback, Goodwill, Warranty.",
                 "The other ShopView Accounts rows keep their place and grouping; none moved under \"Other\"."], ["TP-421", "TP-247", "TP-130"])
add("S5-02", 3, ["Its accounts are those of the QuickBooks types Expense, Other Expense and Cost of Goods Sold."], ["TP-037", "TP-351"])
cite("S5-09", "TP-349")
add("S6-01", 1, ["The Internal row comes first, then the No Charge rows by name: Comeback, Goodwill, Warranty."], ["TP-600"])
add("S7-03", 4, ['The memo reads "[description]; WO #[number] · No Charge · Goodwill".'], ["TP-249"])
cite("S7-31", "TP-029", "TP-085")
add("S8-01", 4, ['The "Closed" pill is grey.'], ["TP-635"])
add("S8-03", 4, ["The credit side is account 1300 (Inventory).", 'Its source document reads "Internal work order [number]".',
                 "The entry date is the posting date at the location, not the day before."], ["TP-614", "TP-604", "TP-631"])
add("S8-04", 4, ['Its source document reads "No-charge work order [number]".'], ["TP-604"])
add("S8-07", 2, ['The Held pill is amber.', 'The row is labelled "Cost move to [category A\'s name] · Vendor bill [number], line 1" with a "Source document" field.'],
    ["TP-497", "TP-395", "TP-500"])
swap("S8-09", "The first move shows the status Dismissed with a reason naming bill 1 as amended.",
     'The first move shows the status Dismissed with the reason "Withdrawn: vendor bill [bill 1\'s number] amended".', ["TP-056", "TP-598"])
swap("S8-10", "The move shows the status Dismissed with a reason naming bill 1 as voided.",
     'The move shows the status Dismissed with the reason "Withdrawn: vendor bill [bill 1\'s number] voided".', ["TP-056"])
add("S8-16", 3, ["The revenue is one entry and each part's cost is its own entry.", "Each cost entry's memo carries work order 1's number, the category and, for line 2, the line number."],
    ["TP-557", "TP-585"])
add("S8-18", 4, ['The event is labelled "Work order closed · [number] · Internal".'], ["TP-498"])
add("S8-23", 5, ["Retry answers with the event Completed, or Held again with its latest reason."], ["TP-592"])
cite("S8-25", "TP-638")
add("S9-09", 2, ['The date presets include "Last 12 months".'], ["TP-507", "TP-344", "TP-098"])
add("S9-11", 2, ['Each card writes its count as "[n] work orders, [m] lines": General Internal "1 work orders, 0 lines", Goodwill "0 work orders, 1 lines".'], ["TP-509"])
swap("S9-17", "A note under the table says a line with several technicians counts once for each of them and once in the totals.",
     'A note under the table reads "A line with several technicians counts once for each of them; the totals row counts every line once."', ["TP-511"])
add("S9-26", 4, ["It sits directly after Sales By Representative, in the Performance group."], ["TP-021", "TP-097"])
add("S9-39", 1, ['Its value cells read "—".'], ["TP-516"])
add("S12-18", 2, ["The message shows for about five seconds and no completion step runs."], ["TP-489"])
swap("S12-26", 'The menu offers neither "Mark as No Charge" nor "Mark as Billable".',
     '"Mark as No Charge" and "Mark as Billable" show disabled: neither can be used.', ["TP-328", "TP-481"])
add("S12-33", 3, ['Under the part\'s name it reads "No Charge · Goodwill".'], ["TP-490"])
add("S12P-06", 7, ["The \"Approval Required\" email the contact received before the conversion still shows the old prices.",
                   "The print preview of the portal estimate shows no stale document with prices."], ["TP-673", "TP-658"])
add("S12P-10", 2, ['The invoices list\'s Status filter has no "Closed" value.'], ["TP-650"])
add("REL-03", 2, ["An existing account was reused when its name matched ignoring letter case, spaces and \"&\" against \"and\".",
                  "A renamed 6500 was not reused: a new \"Vehicle Expenses\" sits at a free number."], ["TP-608", "TP-636", "TP-613"])

# ---- 2. DIVERGE items 1-4: hold the cases they decide (items 5-9: the cases follow the PRD, no hold) ------------------------------
hold("S2-90", "import", "DIVERGE D-4: the plan says no live work order import exists")
hold("S8-26", "hub-inactive-account", "DIVERGE-adjacent code fact: the hub refuses to deactivate a mapped account")

# ---- 3. new cases --------------------------------------------------------------------------------------------------------------
CATS = "Open Administration > Service > Internal Work Orders."
C("S1-83", "S1", "At 100 active categories Restore is disabled too",
  [ADMIN, ON, "Have 100 active No Charge categories in the organization and one more, category A, archived, all made for this test."],
  [CATS, "Open the No Charge categories tab.", 'Click the "Show archived (1)" link.', "Hover over Restore on category A."],
  [["The categories page opens."], ["The list holds 100 active categories."], ["Category A is listed with Restore."],
   ['Restore is disabled with "You can have up to 100 active categories in this list. Archive one to add another."']],
  ["S1-R13", "TP-066", "TP-350"])
C("S1-84", "S1", "The Internal Work Orders tab sits after Fees & Discounts",
  [ADMIN, ON],
  ["Open Administration > Service."],
  [['The "Internal Work Orders" tab sits directly after "Fees & Discounts".', "The other Service tabs are where they were."]],
  ["S1-R13", "TP-405", "TP-199"])
C("S1-85", "S1", "An asset shared with an internal customer shows the Internal category field",
  [ADMIN, ON, icust("A"), cust("B"), "Have a new asset for this test, asset 1, owned by both customer A and customer B."],
  ["Open asset 1's page.", "Click Edit Asset."],
  [["Asset 1's page opens, listing customer A and customer B."], ['The "Internal category" field shows, because one owner, customer A, is flagged.']],
  ["S1-R15", "TP-270"])
C("S1-86", "S1", "After turning the setting on again, Make internal windows follow name order",
  [ADMIN, OFF, icust("A", ", whose name starts with a letter after customer B's, with one open billable work order"),
   icust("B", ", whose name starts with a letter before customer A's, with one open billable work order")],
  ["Open Settings > Work Orders.", 'Switch the "Internal Work Orders" toggle on.', "Click Save settings.", 'Click "Keep billable".'],
  [["The toggle is off."], ["The toggle shows on."], ["The first Make internal window names customer B."], ["The next window names customer A."]],
  ["S1-R10", "S1-R11", "TP-336", "TP-432"])
C("S1-87", "S1", "The hint lines appear only after Save settings",
  [ADMIN, OFF, "Use an organization in which the setting was switched on before, so no turn-on window opens."],
  ["Open Settings > Work Orders.", 'Switch the "Internal Work Orders" toggle on.', "Click Save settings."],
  [["The toggle is off and no hint lines show."], ["The toggle shows on, and the hint lines are not shown yet."], ["The hint lines show under the description."]],
  ["S1-R3", "TP-554"])
C("S1-88", "S1", "Without any QuickBooks location the category window has no account pickers",
  [ADMIN, ON, NO_ACCT, "Make sure no location of the organization is connected to QuickBooks Online."],
  [CATS, 'Click "New No Charge Category".'],
  [["The categories page opens with no QuickBooks expense account column."], ['The window shows Name and "Requires the original work order", and no QuickBooks expense account pickers.']],
  ["S1-R14", "TP-413"])
C("S1-89", "S1", "Default category cannot be unticked on the current default",
  [ADMIN, ON],
  [CATS, "Open the row menu of General Internal.", "Click Edit.", 'Click the "Default category" checkbox.'],
  [["The categories page opens."], ["The menu shows Edit."], ['The "Edit Category" window shows "Default category" ticked.'], ['"Default category" stays ticked: it cannot be unticked here.']],
  ["S1-R14", "TP-414"])
C("S1-90", "S1", "The turn-on window does not take a 51st customer",
  [ADMIN, "Use a new organization in which the Internal Work Orders setting has never been switched on.", "Have 51 new customers for this test."],
  ["Open Settings > Work Orders.", 'Switch the "Internal Work Orders" toggle on.', "Pick 50 customers in the customer picker.", "Try to pick a 51st customer."],
  [["The toggle is off."], ['The "Which customers are your own company?" window opens.'], ["50 chips show."],
   ["The 51st customer is not added; 50 chips show.", 'The hint reads "Pick up to 50 customers here. Flag more from Edit Customer."']],
  ["S1-R2", "TP-428", "TP-334"])
C("S1-91", "S1", "A failed category save shows an alert and keeps the window open",
  [ADMIN, ON],
  [CATS, 'Click "New No Charge Category".', "Type a new name in Name.", SAVE],
  [["The categories page opens."], ["The window opens."], ["The name shows."],
   ['When the save fails, an alert that must be dismissed reads "Could not save the category. Try again." and the window stays open.']],
  ["S1-R14", "TP-416"], marker=NOMAN("the save has to fail, which only a developer can make happen"))
C("S2-98", "S2", "An original line with no technician names the original work order's lead",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"),
   "Have a new invoiced work order for this test, work order 2, for customer A on asset 1, with lead technician A and a line, line 1, with no technician of its own."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", 'Tick the "No Charge" checkbox.', 'Pick "Comeback" in Category.', 'Pick work order 2 in "Original work order".', "Pick line 1 in \"Original line\"."],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."], ["The original selects appear."],
   ["Work order 2 is picked."], ['The line reads "Original technician: [technician A]": the line shows its lead when it has no technician.']],
  ["S2-R17", "TP-039"], note=NAME_NOTE)
C("S2-99", "S2", "The Classification filter stays set after opening a work order and going back",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved")],
  ["Open the work orders list.", 'Set the "Classification" chip to "Internal".', "Open work order 1.", "Go back with the browser's Back button."],
  [["The list opens."], ["Work order 1 is listed."], ["Work order 1 opens."], ['The list shows "Classification: Internal" still applied.']],
  ["S2-R14", "TP-151"])
C("S2-100", "S2", "After Convert to No Charge and back, earlier line marks do not return",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable, with line 1 marked No Charge under Comeback and line 2 billable")],
  [OPEN_WO, MENU, 'Click "Convert to No Charge".', 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button.", MENU, 'Click "Convert to Billable".',
   "Click the confirming Convert to Billable button."],
  [["Line 1 shows \"No Charge · Comeback\"."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."], ['The "No Charge" badge shows.'],
   ['The menu shows "Convert to Billable".'], ["The confirmation opens."], ["Line 1 and line 2 are both billable and priced; line 1 has no \"No Charge · Comeback\" chip."]],
  ["S2-R5", "S2-R6", "TP-224"], marker="PO:line-marks-after-convert")
C("S2-101", "S2", "Original work order lists at most 25 and finds others by number",
  [ADMIN, ON, cust("A", ", with one asset, asset 1"), "Have 26 new invoiced work orders for this test for customer A on asset 1; note the oldest one's number, work order 2."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", 'Tick the "No Charge" checkbox.', 'Pick "Warranty" in Category.', 'Open the "Original work order" select.',
   "Type work order 2's number in the select."],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The Category select appears."], ['"Original work order" appears.'],
   ["25 work orders are listed, newest first; work order 2, the oldest, is not among them."], ["Work order 2 is found."]],
  ["S2-R2", "TP-288", "TP-353"])
C("S2-102", "S2", "Switching to an internal customer clears a ticked No Charge",
  [ADMIN, ON, cust("A"), icust("B")],
  ["Click New Work Order.", "Pick customer A.", 'Tick the "No Charge" checkbox.', 'Pick "Goodwill" in Category.', "Pick customer B instead."],
  [["The New Work Order window opens."], ['The "No Charge" checkbox shows.'], ["The Category select appears."], ["Goodwill is picked."],
   ['The "Internal" badge shows next to customer B, and no "No Charge" checkbox or Category select shows.']],
  ["S2-N3", "TP-443"])
C("S2-103", "S2", "The Finance tab of an internal work order offers no payment or deposit actions",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved"), cust("B"), wo(2, "B", "Approved", ", billable, so the usual actions can be compared")],
  [OPEN_WO, FIN, "Open work order 2.", FIN],
  [["Work order 1 opens."], ["The Finance tab shows no discount and tax Settings button, no Add Deposit, no New Payment, no Issue Credit and no IBS action."],
   ["Work order 2 opens."], ["Work order 2's Finance tab shows its usual actions."]],
  ["S2-N5", "S2-R4", "TP-535", "TP-457"])
C("S2-104", "S2", "The receive notice follows the row last edited",
  [ADMIN, ON, icust("A"), cust("B"), "Have a new purchase order for this test with two special-order parts: part 1 for internal work order 1 of customer A, part 2 for billable work order 2 of customer B."],
  ["Open the purchase order's receive screen.", "Change part 1's cost.", "Change part 2's cost."],
  [["The receive screen opens."], ['The notice reads "Internal work order: cost only, no sell price", and part 1\'s Sell column shows no price (work order 1 is internal, for customer A).'],
   ['The notice reads "Updating the cost also updates the sell price" (part 2 is for work order 2, billable, for customer B).']],
  ["S2-R19", "TP-494"])
C("S2-105", "S2", "The list footer total counts internal work orders as $0",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", f", with {LABOR_2H}"), cust("B", ", with its own labor rate of $120.00 an hour"), wo(2, "B", "Approved", f", billable, with {LABOR_2H}")],
  ["Open the work orders list.", "Search for work order 1 and work order 2 together by their customers' names."],
  [["The list opens."], ['Work order 1 shows "No Charge" in Total Price and work order 2 $240.00.', "The footer total of the two rows reads $240.00."]],
  ["S2-R10", "TP-522"])
C("S2-106", "S2", "Closed in the Status filter of a shop that never used the feature",
  [ADMIN, "Use a new organization that has never switched Internal Work Orders on nor closed a work order."],
  ["Open the work orders list.", "Open the All tab.", "Open the Status chip."],
  [["The list opens."], ["The All tab shows."], ['The Status chip offers its usual values and no "Closed".']],
  ["S2-R10"], marker="PO:closed-chip")
C("S3-55", "S3", "An original picked in the Close window is saved with the Close",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, cust("A", ", with one asset, asset 1"), "Have a new invoiced work order for this test, work order 2, for customer A on asset 1.",
   ncwo(1, "A", "Warranty", "Complete", ", on asset 1, with no original work order")],
  [OPEN_WO, CLOSE_BTN, 'Pick work order 2 in "Original work order".', CONFIRM_CLOSE],
  [["Work order 1 opens."], ['"Original work order *" shows and "Close Work Order" is disabled.'], ['"Close Work Order" is enabled.'],
   ['The work order is Closed and the document reads "Category: Warranty · Original work order [work order 2\'s number]".']],
  ["S3-R2", "S3-R5", "TP-018"], note=NAME_NOTE)
C("S3-56", "S3", "A shop on the legacy invoice design gets the NO CHARGE document in that design",
  [ADMIN, ON, "Make sure the test location uses the legacy invoice design.", cust("A"), ncwo(1, "A", "Goodwill", "closed", f", with {STOCK_PART}")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ['The document is in the legacy design and shows the NO CHARGE stamp, "No Charge Work Order [number]", "Category: Goodwill" and Parts cost $80.00.']],
  ["S3-R5", "TP-301"], note=NAME_NOTE)
C("S6-09", "S6", "Clearing a category row keeps the row, empty",
  [ADMIN, ON, AH],
  ["Open Accounting > Account Mappings.", 'Clear the account of "No Charge: Goodwill".', SAVE, RELOAD],
  [["The rows show."], ["The account is cleared."], ["The mapping is saved."], ['"No Charge: Goodwill" is still listed, empty.']],
  ["S6-R1", "TP-093", "TP-601", "TP-496"])
C("S6-10", "S6", "Deactivating an account a category row uses is refused",
  [ADMIN, ON, AH, "Make sure \"No Charge: Goodwill\" is mapped to 6430 Warranty & Goodwill Expense."],
  ["Open Accounting's chart of accounts.", "Deactivate 6430 Warranty & Goodwill Expense."],
  [["The chart opens."], ["The deactivation is refused with a message naming \"category mapping 'No Charge: Goodwill'\"."]],
  ["S6-E1", "TP-558", "TP-576"], marker="PO:hub-inactive-account")
C("S7-36", "S7", "A category change after a direct-posted bill shows one move entry",
  [ADMIN, ON, QB, QB_VIEW, REVIEW_OFF, "Make sure Goodwill is mapped to account G and Comeback to account C at the test location.", cust("A"),
   ncwo(1, "A", "Goodwill", "Complete", ", whose special-order part's vendor bill of $125.00 posted straight to account G")],
  [OPEN_WO, MENU, 'Click "Change category".', 'Pick "Comeback" in Category.', SAVE, 'Click "Continue".', CLOSE_BTN, CONFIRM_CLOSE,
   "In QuickBooks Online, open the journal entries for work order 1's number."],
  [["Work order 1 opens."], ['The menu shows "Change category".'], ["The window opens."], ["Comeback is picked."], ['"Change where the cost is posted?" opens.'],
   ["The category is Comeback."], ["The confirmation opens."], ["The work order is Closed."],
   ["One entry moves $125.00 from account G to account C; there is no pair of entries for it."]],
  ["S7-R4", "S2-R8", "TP-052"])
C("S7-37", "S7", "Reversing an invoice withdraws its waiting no-charge line entry",
  [ADMIN, ON, QB, QB_VIEW, cust("A"),
   wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Goodwill and whose line entry is waiting in QB Unexported")],
  [OPEN_WO, FIN, "Reverse the invoice.", "Open QB Unexported in ShopView."],
  [["Work order 1 opens."], ["The invoice shows."], ["The invoice is reversed."],
   ['The waiting row reads "Withdrawn: invoice [number] reversed" with no Export or Mark as Exported.']],
  ["S7-R8", "S12-R8", "TP-251", "TP-250"], note=NAME_NOTE)
C("S7-38", "S7", "Two lines moving the same way show in the Create invoice window",
  [ADMIN, ON, QB, "Make sure Comeback is mapped to account C at the test location.", cust("A"),
   wo(1, "A", "Complete", ", billable, whose line 1 and line 2 each hold a special-order part with a vendor bill posted to Cost of Parts ($90.00 and $60.00), then both marked No Charge under Comeback")],
  [OPEN_WO, CREATE_INV],
  [["Work order 1 opens."], ['"Create invoice [number]?" opens with the move from Cost of Parts to [account C] for line 1 and line 2 ($90.00 and $60.00, $150.00 together), shown as the PO rules.']],
  ["S7-R8", "UFS-15"], marker="PO:rows-per-move", note=NAME_NOTE)
C("S8-28", "S8", "A held reason shows the category's new name after a rename",
  [ADMIN, ON, AH, "Have a new Internal category for this test, category A, whose Account Mappings row is empty.", icust("A", ", whose default internal category is category A"),
   iwo(1, "A", "closed", f", with {STOCK_PART}, whose Close is Held for the empty row")],
  [CATS, "Rename category A.", "Open Accounting > Accounting Events."],
  [["The categories page opens."], ["Category A shows its new name."], ['Work order 1\'s Close reads "Internal: [new name] row not mapped".']],
  ["S8-N2", "TP-570"], note=NAME_NOTE)
C("S8-29", "S8", "The Closed record shows the category's new name after a rename",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, mapped to an account.", cust("A"), ncwo(1, "A", "category A", "closed")],
  [CATS, "Rename category A.", "Open Accounting > Sales > Invoices.", "Open work order 1's record."],
  [["The categories page opens."], ["Category A shows its new name."], ["Work order 1's Closed record is listed."], ["Its summary shows the category's new name."]],
  ["S8-R1", "S1-R16", "TP-575"])
C("S8-30", "S8", "Closing again after Reopen voids the old record and adds a new one",
  [ADMIN, ON, AH, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}")],
  [OPEN_WO, FIN, "Open the invoice menu on the Finance tab.", 'Click "Reopen Work Order".', "Click Reopen Work Order in the window.", CLOSE_BTN, CONFIRM_CLOSE, "Open Accounting > Sales > Invoices."],
  [["Work order 1 opens."], ["The document shows."], ['The menu offers "Reopen Work Order".'], ["The window opens."], ['The status reads "Complete".'], ["The confirmation opens."],
   ["The work order is Closed again."], ["The first record is Void with its number suffixed; a new Closed record carries work order 1's number."]],
  ["S8-R4", "S4-R4", "TP-579", "TP-626"])
C("S8-31", "S8", "A bill entered after Close counts in the hub record's Parts cost",
  [ADMIN, ON, AH, icust("A"), iwo(1, "A", "closed", ", with one special-order part received at a cost of $90.00 and no vendor bill before Close")],
  ["Enter the vendor bill for work order 1's special-order part at $100.00.", OPEN_WO, FIN, "Open Accounting > Sales > Invoices.", "Open work order 1's record."],
  [["The bill is saved."], ["Work order 1 opens."], ['The NO CHARGE document still reads "Parts cost $90.00".'], ["The record is listed."],
   ["The record's posted Parts cost includes the bill's $100.00 posted to the category's account."]],
  ["S3-R5", "S8-R1", "TP-602"])
C("S9-45", "S9", "The report explains that Parts cost is the amount at Close",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed", ", closed this month")],
  ["Open Reports > Internal Work Orders."],
  [['The report shows the helper "Parts cost is the amount at Close. A special order billed after Close at a different amount is not updated here; with QuickBooks or AccountingHub the bill posts its own amount."',
    "Work order 1 is listed."]],
  ["S3-R5", "S9-R2", "TP-009"])
C("S9-46", "S9", "A no-charge line adds no tax and nothing owed",
  [ADMIN, ON, "Make sure the test location charges a 5% tax on labor.", "Open Reports > Sales Tax Collected and Reports > A/R Aging Summary for today and note the totals.",
   cust("A", ", with its own labor rate of $120.00 an hour"),
   wo(1, "A", "invoiced today", ", billable, invoiced after the totals were noted and left unpaid, with line 1 of 2.0 hours ($240.00) and line 2 of 1.5 hours No Charge under Goodwill")],
  ["Open Reports > Sales Tax Collected.", "Open Reports > A/R Aging Summary."],
  [["Taxable sales are the noted figure plus $240.00 and tax collected the noted figure plus $12.00: line 2 adds $0.00."],
   ["Customer A owes $252.00 ($240.00 + $12.00): line 2 adds nothing owed."]],
  ["S9-R12"])
C("S10-15", "S10", "While the setting is off, Min needs a percentage again",
  [ADMIN, OFF, icust("A", ", flagged while the setting was on, with no shop supplies percentage")],
  ["Open customer A's page.", "Click Edit Customer."],
  [["Customer A's page opens."], ["The Min shop supplies field is disabled until a percentage is entered, as for any customer."]],
  ["S10-R1", "TP-517"])
C("S12-44", "S12", "Marking a line on a sent estimate lets it be sent again",
  [ADMIN, ON, cust("A", ", with a portal contact"), wo(1, "A", "in Estimate", ", billable, with two lines, sent to the portal")],
  [OPEN_WO, "Open line 2's three-dots menu.", 'Click "Mark as No Charge".', 'Pick "Goodwill" in Category.', "Click the confirming Mark as No Charge button."],
  [['"Send to Portal" shows as already sent.'], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."],
   ["Line 2 shows $0.00.", '"Send to Portal" can be used again, since the estimate changed.']],
  ["S12-R4", "TP-050"])
C("S12-45", "S12", "The legacy invoice design shows the no-charge line at $0.00",
  [ADMIN, ON, "Make sure the test location uses the legacy invoice design.", cust("A"), wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Goodwill")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ['The invoice, in the legacy design, shows line 2 at $0.00 with "Goodwill" under its title.']],
  ["S12-R7", "TP-081"])
C("S12-46", "S12", "Editing a no-charge line's hours keeps its mark",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable, whose line 2 of 1.0 hour is No Charge under Goodwill")],
  [OPEN_WO, "Change line 2's hours to 2.0 with Edit Labor.", RELOAD],
  [["Line 2 shows \"No Charge · Goodwill\"."], ["The hours read 2.0."], ['Line 2 still shows "No Charge · Goodwill" and $0.00.']],
  ["S12-R1", "TP-107", "TP-162", "TP-289"])
C("S12-47", "S12", "Shop supplies by percentage leave the no-charge line's labor out",
  [ADMIN, ON, "Make sure the test location charges shop supplies at 10% of labor.", cust("A", ", with its own labor rate of $120.00 an hour and no shop supplies rule"),
   wo(1, "A", "Approved", ", billable, with line 1 of 2.0 hours ($240.00) and line 2 of 1.5 hours ($180.00)")],
  [OPEN_WO, "Open line 2's three-dots menu.", 'Click "Mark as No Charge".', 'Pick "Goodwill" in Category.', "Click the confirming Mark as No Charge button."],
  [["Shop supplies reads $42.00 (10% of $420.00)."], ['The menu shows "Mark as No Charge".'], ["The dialog opens."], ["Goodwill is picked."],
   ["Shop supplies reads $24.00 (10% of $240.00)."]],
  ["S12-R4", "TP-236"])
C("S12-48", "S12", "Marking in Edit Line with a large deposit shows the deposit message",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), wo(1, "A", "Approved", ", billable, with line 1 of 2.0 hours ($240.00), line 2 of 1.5 hours ($180.00) and a deposit of $300.00")],
  [OPEN_WO, "Open line 2's three-dots menu.", 'Click "Edit line".', 'Tick the "No Charge" checkbox.', 'Pick "Goodwill" in Category.', SAVE],
  [["Work order 1 opens."], ['The menu shows "Edit line".'], ["Edit Line opens."], ["The Category select appears."], ["Goodwill is picked."],
   ['After the save a message that must be dismissed reads "Deposit $300.00 exceeds the new total $240.00. The difference stays on the customer\'s account as a deposit when the invoice is created."']],
  ["S12-R4", "TP-488"])
C("S12P-11", "S12P", "A deposit paid on the portal after Convert to No Charge is refused",
  [ADMIN, ON, cust("A"), "Have a portal contact for this test for customer A, whose portal login the tester can use, and a test card.",
   wo(1, "A", "in Estimate", ", billable, sent to the portal with a deposit request")],
  ["Sign in to the customer portal as customer A's contact.", "Open the deposit checkout of work order 1.", "In ShopView, convert work order 1 to No Charge under Goodwill.",
   "In the portal, pay the deposit with the test card.", OPEN_WO],
  [["The portal opens."], ["The checkout shows."], ['Work order 1 shows the "No Charge" badge.'], ['The deposit is refused with "Deposits are not available on internal or no-charge work orders."'],
   ["The refused deposit is recorded with its own reason and the existing refund action is offered."]],
  ["S2-N5", "TP-674", "TP-382", "TP-668", "TP-040"], marker="PO:portal-deposit")
C("S12P-12", "S12P", "A work order made internal leaves the portal approvals list",
  [ADMIN, ON, cust("A"), "Have a portal contact for this test for customer A, whose portal login the tester can use.", wo(1, "A", "in Estimate", ", billable, sent to the portal")],
  ["Sign in to the customer portal as customer A's contact.", "Open the pending approvals.", "In ShopView, save customer A's Edit Customer with \"Internal customer\" ticked.",
   'Click "Make internal".', "Wait one minute.", "Reload the portal's pending approvals."],
  [["The portal opens; the pending approvals badge counts work order 1."], ["Work order 1 is in the list."], ["The Make internal window lists work order 1."],
   ['Work order 1 shows the "Internal" badge.'], ["A minute has passed."],
   ["Work order 1 is no longer in the list and the badge no longer counts it."]],
  ["S1-R11", "S2-R11", "TP-659", "TP-675"])
C("S12P-13", "S12P", "The shop's approval email shows the no-charge line's category",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), "Have a portal contact for this test for customer A, whose portal login the tester can use.",
   wo(1, "A", "in Estimate", ", billable, with line 1 and line 2 marked No Charge under Goodwill, sent to the portal")],
  ["Sign in to the customer portal as customer A's contact.", "Approve work order 1's estimate.", "Open the approval email the shop receives."],
  [["The portal opens."], ["The approval is recorded."], ['Line 2 shows "Goodwill" under its name, with the amounts as stored.']],
  ["S2-R11", "TP-664"])

KEY = "Use an Open API key for the test organization, the Open API documentation, and a tool that sends API requests."
HOOK = "Have a webhook subscription for the test organization pointed at a request-catching page the tester can read."
C("API-25", "API", "A refused Close sends no status webhook",
  [KEY, ON, NO_ACCT, REVIEW_OFF, HOOK + " Subscribe it to work_order.status_changed.", icust("A"), iwo(1, "A", "Complete", ", whose Shop supplies amount is $15.00"),
   "Open work order 1 in two browser tabs, tab 1 and tab 2."],
  ["In tab 1, open Close Work Order.", 'In tab 2, change "Shop supplies" to $20.00.', "In tab 1, confirm Close Work Order.", "Open the request-catching page to read the webhook requests."],
  [["The confirmation opens."], ["The amount is saved."], ['Tab 1 shows "This work order changed. Review and close again."'], ["No work_order.status_changed arrived for work order 1."]],
  ["S3-E5", "S11-R3", "TP-034"], api=True, banner=API_BANNER, marker=API_HOLD)
C("API-26", "API", "Billable invoices still send their invoice webhooks, $0 included",
  [KEY, ON, HOOK + " Subscribe it to invoice.created and invoice.paid.", cust("A"), wo(1, "A", "Complete", ", billable, with one line at $0.00 priced by hand")],
  ["In ShopView, invoice work order 1.", "Open the request-catching page to read the webhook requests."],
  [["The $0 invoice is created and paid as today."], ["invoice.created and invoice.paid arrived for work order 1."]],
  ["S11-N2", "OOS-14", "TP-304", "TP-007"], api=True)
C("API-27", "API", "Lines that carried the warranty flag before the release keep it",
  [KEY, "Use the production test account.", "Before the release, note a line whose is_warranty is true, line 1 of work order 1."],
  ["After the release, send GET for work order 1 through the Open API."],
  [["Line 1 still reads is_warranty true and is not priced, marked or changed."]],
  ["S2-R22", "TP-057"], api=True, marker=PRE_REL)

C("INV-15", "INV", "Work order and part sale status labels read as before",
  [ADMIN, ON, cust("A"), wo(1, "A", "in Review, billable"), "Have a new part sale for this test for customer A, open."],
  [OPEN_WO, "Open the part sale."],
  [["The header status reads as before (Review)."], ["The part sale header reads as before."]],
  ["T-STATUS", "OOS-12", "TP-019", "TP-541"])
C("INV-16", "INV", "Other Work Orders settings save as before",
  [ADMIN, OFF, REVIEW_OFF],
  ["Open Settings > Work Orders.", 'Switch "Require Review Before Completion" on.', "Click Save settings.", RELOAD],
  [["The tab opens."], ["The toggle shows on."], ["The settings are saved as before."], ['"Require Review Before Completion" is on and "Internal Work Orders" is still off.']],
  ["KD-ORG", "OOS-14", "TP-020", "TP-547"])
C("INV-17", "INV", "Administration sections are where they were",
  [ADMIN, ON],
  ["Open Administration."],
  [["Every section shows where it was before; only the Internal Work Orders tab under Service is new."]],
  ["S1-R13", "TP-199"])
C("INV-18", "INV", "A Min without a percentage charges nothing on a billable work order",
  [ADMIN, ON, icust("A", ", with a Min shop supplies charge of $15.00 and no percentage"), wo(1, "A", "Approved", f", billable, left billable when customer A was flagged, with {LABOR_2H}")],
  [OPEN_WO],
  [["Shop supplies reads $0.00 on the billable work order: the Min alone charges nothing."]],
  ["S10-R1", "TP-259", "TP-274"])
C("INV-19", "INV", "Create invoice from the menu and the Finance tab works as before",
  [ADMIN, ON, REVIEW_OFF, cust("A"), wo(1, "A", "In Progress", ", billable, with one line not yet Complete"), wo(2, "A", "Complete", ", billable")],
  [OPEN_WO, MENU, "Open work order 2.", FIN, "Click Create invoice on the Finance tab."],
  [["Work order 1 opens."], ['The menu offers "Create invoice", as today.'], ["Work order 2 opens."], ['The Finance tab offers "Create invoice".'], ["The invoice is created as today."]],
  ["S3-N1", "TP-404", "TP-125"])
C("INV-20", "INV", "Simple Mode's wizard on a billable work order reads as before",
  [ADMIN, ON, "Make sure the test location uses Simple Mode.", cust("A"), wo(1, "A", "In Progress", ", billable, with one part that carries a core")],
  [OPEN_WO, "Start the completion wizard.", "Go to the wizard's last step."],
  [["Work order 1 opens."], ["The core step shows the core amount, as today."], ['The last step offers "Create invoice".']],
  ["S3-N1", "TP-540"])
C("INV-21", "INV", "A billable work order's menu is as before plus Convert to No Charge",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable")],
  [OPEN_WO, MENU],
  [["Work order 1 opens."], ['The menu shows Audit Log, Timesheets, "Add Work Order Fee / Discount", Print and Delete as before, plus "Convert to No Charge".']],
  ["S2-R5", "TP-544"])
C("INV-22", "INV", "Change Customer on a billable work order behaves as before",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable, with a deposit taken"), wo(2, "A", "invoiced", ", billable")],
  [OPEN_WO, 'Hover over "Change Customer" on the customer card.', "Open work order 2."],
  [["Work order 1 opens."], ["Change Customer is refused for the deposit, as today."], ["Work order 2's customer card offers no Change Customer, as today."]],
  ["S2-R7", "TP-374", "TP-545"])
C("INV-23", "INV", "A line added to an invoiced billable work order starts a new work order",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced", ", billable")],
  [OPEN_WO, "Add a new line."],
  [["Work order 1 opens."], ["A new billable work order is created for the line, as today."]],
  ["S3-R3", "TP-373"])
C("INV-24", "INV", "Splitting a billable work order keeps its prices",
  [ADMIN, ON, cust("A", ", with its own labor rate of $120.00 an hour"), wo(1, "A", "Approved", ", billable, with two labor lines of 2.0 hours each")],
  [OPEN_WO, "Split work order 1, moving its second line to a new work order.", "Open the new work order."],
  [["Work order 1 opens."], ["A new work order is created."], ["The moved line shows $240.00, as before the split, and no badge."]],
  ["S2-E2", "OOS-14", "TP-375"])
C("INV-25", "INV", "Auto-apply fees and the default discount still apply to billable work",
  [ADMIN, ON, "Make sure the organization has an auto-apply fee template of $10.00 on new work orders.", cust("A", ", with a default discount of 5% and one asset, asset 1")],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Click Save in the New Work Order window."],
  [["The New Work Order window opens."], ["Customer A is picked."], ["Asset 1 is picked."], ["The work order opens with the $10.00 fee and the 5% discount, as today."]],
  ["S2-R21", "TP-286", "TP-371"])
C("INV-26", "INV", "Receiving on a billable work order still updates the sell price",
  [ADMIN, ON, cust("A"), wo(1, "A", "Approved", ", billable, with one special-order part, part 1, ordered and not received")],
  [OPEN_WO, "Open the receive screen for part 1.", "Enter a cost of $60.00."],
  [["Work order 1 opens."], ['The notice reads "Updating the cost also updates the sell price", as today.'], ["The sell price preview updates from the new cost, as today."]],
  ["S2-R19", "TP-550", "TP-285"])
C("INV-27", "INV", "Ordinary notes on an internal work order read and edit as before",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved", ", with a note written by the tester")],
  [OPEN_WO, "Open the Notes tab."],
  [["Work order 1 opens."], ["The tester's note shows with its author and its edit menu, as today; only the ShopView system notes are read-only."]],
  ["S2-R18", "TP-551", "TP-452"])
C("INV-28", "INV", "Invoiced and Paid filters and the Completed tab list billable work as before",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced", ", billable"), wo(2, "A", "paid", ", billable"), wo(3, "A", "Complete", ", billable")],
  ["Open the work orders list.", "Open the All tab.", 'Set the Status chip to "Invoiced".', 'Set the Status chip to "Paid".', "Open the Completed tab."],
  [["The list opens."], ["The All tab shows."], ["Work order 1 is listed."], ["Work order 2 is listed."], ["Work order 3 is listed, as today."]],
  ["S2-R10", "TP-372"])
C("INV-29", "INV", "New Asset and New Customer windows are as before",
  [ADMIN, ON, icust("A")],
  ["Open customer A's page.", "Click New Asset.", "Open the Customers list.", "Click New Customer."],
  [["Customer A's page opens."], ['New Asset shows its usual fields and no "Internal category".'], ["The list opens."], ['New Customer shows its usual fields and no "Internal customer".']],
  ["S1-R7", "S1-R15", "TP-546"])
C("INV-30", "INV", "A vendor bill on a billable work order posts to Cost of Parts as before",
  [ADMIN, ON, QB, QB_VIEW, cust("A"), wo(1, "A", "Approved", ", billable, with one special-order part received, no bill yet")],
  ["Enter the vendor bill for work order 1's special-order part at $125.00.", "In QuickBooks Online, open that vendor bill."],
  [["The bill is saved."], ["The bill line is on Cost of Parts, as today."]],
  ["S7-R8", "TP-376"])
C("INV-31", "INV", "A billable entry in QB Unexported keeps its type",
  [ADMIN, ON, QB, "Make sure QuickBooks Online's closing date is the last day of last month.", cust("A"), wo(1, "A", "Complete", f", billable, with {STOCK_PART}")],
  [OPEN_WO, FIN, "Set the Invoice Date to a day of last month.", "Click Create invoice on the Finance tab.", "Open QB Unexported in ShopView."],
  [["Work order 1 opens."], ["The Finance tab shows Create invoice with its Invoice Date."], ["The date shows."], ["The invoice is created."], ['Work order 1\'s entry shows the type "Work Order Create", as today.']],
  ["S7-N3", "TP-307"])
C("INV-32", "INV", "A billable invoice reaches AccountingHub as before",
  [ADMIN, ON, AH, cust("A"), wo(1, "A", "Complete", ", billable")],
  [OPEN_WO, CREATE_INV, "Open Accounting > Sales > Invoices.", "Open work order 1's record."],
  [["Work order 1 opens."], ["The invoice is created."], ["The record is listed with its status as today."], ['The record has no "No Charge lines" block and its entries post as today.']],
  ["S8-R3", "TP-584", "TP-582"])
C("INV-33", "INV", "The hub's sales tax report does not move when a work order closes",
  [ADMIN, ON, AH, REVIEW_OFF, "Open Accounting's sales tax report for today and note its totals.", icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Open Accounting's sales tax report for today."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The work order is Closed."], ["The totals are the noted figures."]],
  ["S9-R5", "TP-606"])
C("INV-34", "INV", "Paying a billable invoice on the portal works as before",
  [ADMIN, ON, cust("A"), "Have a portal contact for this test for customer A, whose portal login the tester can use, and a test card.", wo(1, "A", "invoiced", ", billable, unpaid")],
  ["Sign in to the customer portal as customer A's contact.", "Pay work order 1's invoice with the test card."],
  [["The portal opens with work order 1's invoice."], ["The payment is taken and recorded in ShopView, as today."]],
  ["OOS-14", "TP-646"])
C("INV-35", "INV", "A billable invoice still sends the portal's new invoice email",
  [ADMIN, ON, cust("A"), "Have a portal contact for this test for customer A, whose mailbox the tester can read.", wo(1, "A", "Complete", ", billable")],
  [OPEN_WO, CREATE_INV, "Open the contact's mailbox."],
  [["Work order 1 opens."], ["The invoice is created."], ["The portal's new invoice email has arrived, as today."]],
  ["OOS-14", "TP-007", "TP-647"])
C("REL-06", "REL", "A bill posted before the release is moved at Close after it",
  [ADMIN, "Use the production test account.", QB_VIEW, cust("A"),
   wo(1, "A", "Approved", ", billable, whose special-order part's vendor bill of $125.00 was posted to Cost of Parts before the release")],
  ["After the release, make work order 1 internal by moving it to an internal customer.", CLOSE_BTN, CONFIRM_CLOSE, "In QuickBooks Online, open the journal entries for work order 1's number."],
  [['Work order 1 shows the "Internal" badge.'], ["The confirmation shows the special order as moved from Cost of Parts."], ["The work order is Closed."],
   ["A reclass entry moves $125.00 from Cost of Parts to the category's account."]],
  ["S7-R4", "TP-633"], marker=PRE_REL)
C("REL-07", "REL", "Create invoice refusals on billable work orders read as before",
  [ADMIN, "Use the production test account.", "Before the release, note the message Create invoice shows on a billable work order with an incomplete line."],
  ["After the release, click Create invoice on the same kind of work order."],
  [["The message is word for word the one noted before the release."]],
  ["S3-N1", "TP-064", "TP-233"], marker=PRE_REL)

# ---- 4. ADD statements left out, with the reason (build.py checks every ADD is quoted or listed here) ---------------------------
TP_OUT = {
 "TP-003": "10,000-row export cap per tab: a tester would need more than 10,000 report rows.",
 "TP-005": "500 work orders per Make internal call: an internal batching detail; seen only with more than 500 open work orders.",
 "TP-112": "A customer with more than 500 open work orders: not a setup a tester can make by hand.",
 "TP-345": "Export refused above 10,000 rows: not a setup a tester can make by hand.",
 "TP-228": "The VIN-change path re-resolving the category: a code path; the asset-change case (S2-05) checks what a tester sees.",
 "TP-252": "An entry that posts nothing never reaches QB Unexported: nothing to look at.",
 "TP-256": "The hub creating a missing category row from a message: only reachable with a message a tester cannot send.",
 "TP-293": "The review-required refusal copy: with review on, Close is not offered (S3-36), so the message cannot be reached through the screens.",
 "TP-357": "System notes never customer-visible: no portal screen shows work order notes, so there is nothing to look at.",
 "TP-363": "A manual payment change on a closed record refused: New Payment is not offered (S2-103), so only a request outside the screens reaches it.",
 "TP-364": "Search reindex is a release step; S2-73 checks the badge in search after the release.",
 "TP-402": "Header card colour tokens: token names are not visible; the design round compares the colours with the design.",
 "TP-462": "Mobile Close icon name (task_alt): the icon is compared in the design round; S3-04 checks its tooltip.",
 "TP-506": "Hub register short codes IWO, NCWO, NCL: the plan does not say which screen shows them.",
 "TP-525": "Schedule compact block label: checked in the design round against the schedule board.",
 "TP-594": "Held rows in the hub's reconciliation run: an operator command output, not a screen.",
 "TP-605": "Hub write-off refused on a Closed record: the record has no write-off tab (S8-02), so only a request outside the screens reaches it.",
 "TP-607": "A rerun never refills a cleared starting row: the operator command is run by engineering (S13-06).",
 "TP-624": "A rerun re-maps an inactive starting account: the operator command is run by engineering.",
 "TP-639": "Vendor credit amend and void: the plan says they cannot happen; nothing to test.",
 "TP-648": "A direct portal link to a closed record's invoice: a tester has no such link (the record is never listed).",
 "TP-652": "Portal batch pay naming a closed record: the record is never listed, so it cannot be picked.",
 "TP-419": "A direct link to the categories page while the release switch is off: only before launch; not on a build a tester gets.",
}
