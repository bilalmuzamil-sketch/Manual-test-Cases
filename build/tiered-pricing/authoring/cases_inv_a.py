"""Must not change: today's pricing — batch A invariants (INVARIANTS.md §B settings, §C customers, §D work order and Part Sale screens) and
the linked-ticket candidates SV-3398 (green "Fixed sell price" label; clearing a fixed price recalculates) and SV-3411 (a category change
mirrors to the catalog and every location). Batch A, 14 Nov 2026. Rule 96: silence defaults to "must not change"; each case rests on the
PRD's own "as today" / "today" sentence (or the tech plan's code read where the PRD is silent) and, where one exists, attaches the matching
Today picture (production before the release) as the visible baseline.
Where to run (QA lead, 14 Nov 2026): staging first; the Tiered Pricing QA site too once it exists (its address is not known yet:
sv11692.qa.shopview.com does not resolve); production only when neither can show it — none of these needs production.
Superseded rows (their new behaviour is a story case): INV-50 → S6-01, INV-52 → S7-01 / D-140, INV-53 → S7-16, INV-57 → S8-09, INV-60 → the
Story 3 margin check (phase 1). INV-78 is written by the consolidation worker (14 Nov 2026) on tech plan 1's own words with the new QI helper.
Not written: INV-76 (existing screens' empty-state and load-error wording): tech plan 1 names no screen that uses "No X found" / "Clear all
filters", so a tester's expected words would be invented, and the load-error half needs a forced failure (not testable by hand); engineering
plans its own snapshot check ("defaults render identically (snapshot one consumer)", tech plan 1 §8)."""
from tp_lib import C, R, B, S, QP, QD, QL, QT, QJ, QI
from common import *

K = "INV"
WHERE = "Use the staging site with the Tiered Pricing release (and the Tiered Pricing QA site too, once it exists); production is not needed."
MX = ("Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00 and "
      "Default on Markup % 50.")

# ---- §B settings ----------------------------------------------------------------------------------------------------------------
C("INV-44", K, "The General Matrix still prices categories with no matrix of their own",
  [ADMIN, STAGING, "Use a staging client whose default matrix had rules before the release (for example $24.01 to $55.00 at 150% markup).",
   "Have a new category for this test, category A, on the General Matrix, so it has no matrix of its own.", DESK],
  [MATRICES, "Click the General Matrix's name.", CATEGORIES, "Click category A's row."],
  [R(S("S1-R1", "On release day, the client's existing default matrix is renamed the General Matrix, with its rules unchanged."), "The General Matrix is listed first."),
   R(S("S1-R1", "with its rules unchanged"), "Its grid shows the rules the default matrix had before the release (for example $24.01 to $55.00 at 150% markup)."),
   R(S("S1-R1", "It prices every category that has no matrix of its own, as it does today."), "Category A is listed on the General Matrix."),
   R(S("S1-R1", "It prices every category that has no matrix of its own, as it does today."), "Category A's page shows the General Matrix's grid.")],
  pics=["1.2", "today:6.1"])

C("INV-45", K, "Uncategorized still uses the General Matrix and new parts start in it",
  [ADMIN, WHERE, DESK],
  [CATEGORIES, "Click Uncategorized's row.", "Start a new inventory part from Parts › Inventory."],
  [R(S("S1-R11", "Uncategorized already uses the default matrix and can't be renamed today"), "Uncategorized is listed first, on the General Matrix."),
   R(S("S1-R11", "can't be renamed today, so the rename to General Matrix changes nothing for it"), "Uncategorized's page shows the General Matrix's grid.", "Its name cannot be renamed."),
   R(S("S8-R3", "Every new part starts in Uncategorized."), "The new part's category reads Uncategorized.")],
  pics=["8.2", "8.3", "7.1"])

C("INV-46", K, "A matrix name still needs 3 to 127 characters and must be unique",
  [ADMIN, WHERE, "Have a new matrix for this test, matrix A, named for example Stop 40.", DESK],
  [MATRICES, "Click New Matrix.", "Type ab in the name.", "Click Create Matrix.", "Replace the name with matrix A's name in capitals.", "Click Create Matrix."],
  [R(S("S3-R6"), "The Matrices list shows matrix A."), R(S("S3-R6"), "The New Matrix page opens."), R(S("S3-R6"), "The name reads ab."),
   R(S("S3-R6", "a new matrix's name is empty, under 3 or over 127 characters, as today"), "Save is blocked with an error under the name.", "The New Matrix page stays open."),
   R(S("S3-R6"), "The name shows in capitals."),
   R(S("S3-R6", "or another matrix has it, ignoring case (an inline error under the name)"), "Save is blocked with an error under the name.", "No second matrix with matrix A's name is created.")],
  pics=["3.24", "3.25"])

C("INV-47", K, "A category name still needs 3 characters and must be unique",
  [ADMIN, WHERE, category("A", ", named for example Wheel Seals"), DESK],
  [CATEGORIES, "Click New Category.", "Type category A's name in capitals.", SAVE, "Replace the name with ab.", SAVE],
  [R(S("S8-N3"), "The Categories page lists category A."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-N3"), "The name shows in capitals."),
   R(S("S8-N3", "Category names are unique, ignoring capitals: \"A category called <name> already exists\"."), "An error reads \"A category called\", the typed name, \"already exists\".", "No category is created."),
   R(S("S8-N3"), "The name reads ab."),
   R(S("S8-N3", "They need at least 3 characters, as today."), "An error shows on the name.", "The New Category page stays open.")],
  pics=["8.4", "8.7", "7.2"])

C("INV-48", K, "A matrix still allows no gap between ranges",
  [ADMIN, WHERE, matrix("A", ", with two ranges, $0.00 to $100.00 and from $100.01"), DESK],
  [MATRICES, open_matrix("A"), EDIT],
  [R(S("S1-E11"), "Matrix A is listed."), R(S("S1-E11"), "Matrix A's page opens with two ranges."),
   R([S("S1-E11", "Today's matrix editor doesn't allow gaps or overlaps between ranges"), S("S3-R16")],
     "Each range starts one cent after the one before it ($100.00, then $100.01).", "The second range's start is not a box that can be typed in.")],
  pics=["4.6", "4.19"])

C("INV-49", K, "The Fixed Rules tab still creates, edits and deletes a fixed rule",
  [ADMIN, WHERE, "Have a new inventory part for this test, part A, with no fixed sell price.", DESK],
  ["Open Settings › Pricing.", "Click the Fixed Rules tab.", "Open the add fixed rule dialog.", "Pick part A in the dialog.", "Type 40 as the fixed sell price.", "Save the dialog.",
   "Open the fixed rule's edit dialog.", "Replace the fixed sell price with 45.", "Save the dialog.", "Delete the fixed rule."],
  [R(S("S6-R11"), "Settings › Pricing opens with Tiers, Matrices and Fixed Rules tabs."),
   R(S("S6-R11", "The Fixed Rules tab lists only fixed rules, as today."), "The Fixed Rules tab lists the client's fixed rules as production does today."),
   R(S("S1-R6"), "The fixed rule dialog opens as today."), R(S("S1-R6"), "Part A is picked."), R(S("S1-R6"), "The price reads 40."),
   R(S("S1-R6", "Fixed rules are unchanged on release day and work as today."), "The fixed rule for part A at $40.00 is listed."),
   R(S("S1-R6"), "The edit dialog opens with $40.00."), R(S("S1-R6"), "The price reads 45."),
   R(S("S1-R6"), "The fixed rule reads $45.00."),
   R(S("S1-R6", "Fixed rules are unchanged on release day and work as today."), "The fixed rule is gone from the list.", "The tab still lists the other fixed rules.")],
  pics=["today:6.1"])

C("INV-51", K, "A category keeps every Edit Category field, each saving as today",
  [ADMIN, WHERE, "Use a client connected to QuickBooks.", category("A", ", with Tax Exempt off"), DESK],
  [CATEGORIES, "Click category A's row.", "Tick Tax Exempt.", "Pick an item in QuickBooks Products and Services.", RELOAD],
  [R(S("S7-R6"), "Category A is listed."),
   R(S("S7-R6", "Every field today's Edit Category has stays on the page."), "Category A's page shows its name, QuickBooks Products and Services and Tax Exempt, the fields of today's Edit Category."),
   R(S("S7-R12"), "Tax Exempt is ticked."), R(S("S7-R12"), "The picked item shows."),
   R(S("S7-R12", "each save as soon as they are changed"), "After the reload Tax Exempt is still ticked and the QuickBooks item is still picked.")],
  pics=["7.2", "7.8"])

C("INV-54", K, "Bin Locations still opens from the Parts group",
  [ADMIN, WHERE, DESK],
  ["Open Settings.", "Click Bin Locations."],
  [R(S("S7-R14", "In Settings, the Parts group lists Categories, then Pricing, then Bin Locations."), "Bin Locations is the third item of the Parts group."),
   R(S("S7-R14"), "The Bin Locations page opens and lists the location's bin locations, as production does today.", "It shows no tier or matrix.")],
  nopic="no design board draws the Bin Locations page")

C("INV-55", K, "Fixed Rules still opens with Settings — Parts alone",
  ["Sign in as a user whose role has 'Settings — Parts' but not 'See Financial Data'. An Admin makes the records below before the test.", WHERE, DESK],
  ["Open Settings › Pricing."],
  [R(S("TP-PERM-3", "Settings › Pricing: the Fixed Rules tab — 'Settings — Parts', as today"), "Settings › Pricing opens on the Fixed Rules tab with its fixed rules.")
   + R(S("S16-R11", "Settings › Pricing shows only the Fixed Rules tab. (Today Settings › Pricing needs only 'Settings — Parts'.)"), "The Tiers and Matrices tabs are hidden.")],
  pics=["today:6.1"])

C("INV-56", K, "Without Settings — Parts the Parts group stays hidden",
  ["Sign in as a user whose role has 'See Financial Data' but not 'Settings — Parts'. An Admin makes the records below before the test.", WHERE, "Have the address of Settings › Categories copied from an Admin session.", DESK],
  ["Open Settings.", "Open the copied Settings › Categories address."],
  [R(S("S7-N1", "Without 'Settings — Parts', there is no Categories page, as today (S16-R8)."), "Settings opens.", "It has no Parts group and no Categories item."),
   R(S("S16-N1", "\"Access restricted\""), "The page reads \"Access restricted\" with Go to home.")],
  nopic="no design board draws the restricted page")

C("INV-58", K, "Deleting a category still moves its parts and removes its QuickBooks mapping",
  [ADMIN, "Use the staging site with the QuickBooks sandbox connected (and the Tiered Pricing QA site too if QuickBooks is connected there); production is not needed.",
   category("A", ", mapped to a QuickBooks Products and Services item, with a part in the inventory, part A"), DESK],
  [CATEGORIES, "Click category A's row.", "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", "Open part A in the inventory."],
  [R(S("S8-R8"), "Category A is listed."), R(S("S8-R8"), "Category A's page shows its QuickBooks item."), R(S("S8-R8"), "The menu lists Delete."), R(S("S8-R8"), "The delete question opens."),
   R(S("S8-R8", "its QuickBooks product and service mapping is removed, as today"), "Category A is deleted and no longer listed.", "The Categories page still lists Uncategorized first."),
   R(S("S8-E1", "If a category is deleted, every part in it moves to Uncategorized, as today"), "Part A's category reads Uncategorized.")],
  pics=["8.11", "8.12"])

C("INV-59", K, "A category made from the inventory part dialog is priced for every tier",
  [ADMIN, WHERE, tier("A", ", so the Categories list has a tier column to read"), "Have a new inventory part for this test, part A.", DESK],
  ["Open part A in the inventory.", "Create a new category from part A's category field, named with a name no other category uses.", "Save the part.", CATEGORIES],
  [R(S("S8-R3"), "Part A's dialog opens with its category field."), R(S("S8-R3"), "The new category is created and picked for part A."), R(S("S8-R3"), "Part A saves in the new category."),
   R(S("S8-R10", "A new category is priced for every tier from the start."), "The new category is listed.", "Its Default and tier A cells show a rule or \"Uses previous tier\", none empty.")],
  nopic="no design board draws the inventory part dialog")

# ---- §C customers -----------------------------------------------------------------------------------------------------------------
C("INV-61", K, "The Customers list is unchanged",
  [ADMIN_CUST, WHERE, DESK],
  ["Open Customers."],
  [R(S("S9-R11", "The Customers list is unchanged."), "The list shows the same columns, filters and buttons as today's list in the Today picture.", "It has no tier column.")],
  pics=["9.28", "today:9.25"])

C("INV-62", K, "Edit Customer's existing fields keep their place",
  [ADMIN_CUST, WHERE, tier("A", ", so the tier fields show"), customer("A"), DESK],
  ["Open customer A's page from Customers.", "Click the edit pencil on the customer card."],
  [R(S("S9-R12"), "Customer A's page opens."),
   R(S("S9-R3", "None of Edit Customer's existing fields move."), "Every field of today's Edit Customer (Today picture) shows in the same order.",
     "The two tier fields are added under Default Shop Supplies and before Notes.")],
  pics=["9.31", "today:9.27"])

C("INV-63", K, "A customer with records still cannot be deleted",
  [ADMIN_CUST, WHERE, customer("A", ", with a vehicle"), DESK],
  ["Open customer A's page from Customers.", "Delete customer A from its page."],
  [R(S("S9-E3"), "Customer A's page opens."),
   R(S("S9-E3", "A customer can't be deleted when they have work orders or Part Sales, vehicles, linked contacts, transactions, payments or open credit, as today."),
     "The delete is refused as today.", "Customer A's page still shows.")],
  nopic="no design board draws deleting a customer")

C("INV-64", K, "The customer card on a work order is unchanged",
  [ADMIN_WO, WHERE, tier("A"), customer("A", ", on tier A for work orders"), "Have a new work order for this test, work order 1, for customer A.", DESK],
  ["Open work order 1."],
  [R(S("S9-R12", "This is the card on the customer page, not the customer card on work orders, Part Sales and imported work orders."),
     "Work order 1's customer card shows the same rows as today (Today picture).", "It has no Pricing section and no tier rows.")],
  pics=["today:10.1"])

C("INV-65", K, "A customer with no address still hides the card's other rows",
  [ADMIN_CUST, "Sign in with 'View and Manage AP/AR Data' too.", WHERE, customer("A", ", with no address and an IBS value"), DESK],
  ["Open customer A's page from Customers."],
  [R(S("S9-R16", "Today the card hides every row, IBS included, for a customer with no address."), "The card's other rows, IBS included, stay hidden as today (compare the Today picture).")
   + R(S("S9-R16", "The pricing rows show even when the customer has no address."), "The Pricing rows show.")],
  pics=["9.30", "today:9.26"])

C("INV-66", K, "Without AP/AR data Edit Customer still hides labor rate and shop supplies",
  ["Sign in as a user whose role has 'Customers — View' and 'Customers — Create & Edit' but not 'View and Manage AP/AR Data'. An Admin makes the records below before the test.", WHERE, customer("A"), DESK],
  ["Open customer A's page from Customers.", "Click the edit pencil on the customer card."],
  [R(S("S9-R14"), "Customer A's page opens."),
   R(S("TP-PERM-9", "'View and Manage AP/AR Data', which already hides a customer's labor rate and shop supplies in Edit Customer today"),
     "Edit Customer shows the customer's other fields.", "It has no Default Labor Rate or Default Shop Supplies field.")],
  pics=["today:9.27"])

C("INV-67", K, "A customer made from New Work Order starts on Default",
  [ADMIN_WO, WHERE, tier("A", ", so the client has more than one active tier"), DESK],
  ["Open Work Orders.", "Click New Work Order.", "Create a new customer from the dialog's customer field, with a name no other customer uses.", "Finish creating the work order.", "Open the new customer's page."],
  [R(S("S9-R2"), "The Work Orders list shows."), R(S("S9-R2"), "The New Work Order dialog opens."), R(S("S9-R2"), "The customer is created and picked in the dialog."),
   R(S("S9-R2"), "The work order opens for the new customer."),
   R(S("S9-R2", "A new customer, an imported one included, starts on Default for both channels."), "The card shows Work Order Tier and Part Sales Tier as 1 · Default.")],
  nopic="no design board draws New Work Order")

C("INV-68", K, "Each account still has its built-in Counter Sale customer",
  [ADMIN_CUST, WHERE, DESK],
  ["Open Customers.", "Open the built-in Counter Sale customer's page."],
  [R(S("S9-R8", "The built-in Counter Sale customer"), "The list shows the built-in Counter Sale customer."),
   R(S("S9-R8", "the Counter Sale customer ShopView created when the account was set up"), "Its page opens as today, with its card and tabs.")],
  pics=["9.28", "9.36"])

# ---- §D work order and Part Sale screens ------------------------------------------------------------------------------------------
C("INV-69", K, "The Parts and Lines tabs keep their columns, status and inline edits",
  [ADMIN_WO, WHERE, tier("A"), MX, customer("A", ", on tier A for work orders"),
   "Have a new work order for this test, work order 1, for customer A, with a category A part at a cost of $10.00 and a special-order part that is requested.", DESK],
  ["Open work order 1.", "Click the Parts tab.", "Change the category A part's quantity to 2 in its row.", "Click the Lines tab."],
  [R(S("S12-R7"), "Work order 1 opens."),
   R(S("S12-R3", "The work order Parts tab and the Part Sale parts table get a Priced by column after Sell Price."), "The Parts tab shows today's columns with Priced by added right after Sell Price; every heading sits over its own cells."),
   R(S("S12-R7", "The Parts and Lines tables keep today's status."), "The quantity saves in the row as today.", "The special-order part still shows its status (for example Requested)."),
   R(S("S12-R7", "The Parts and Lines tables keep today's status."), "The Lines tab shows today's columns and the part statuses.", "It has no Priced by column.")],
  pics=["12.4", "today:10.1"])

C("INV-70", K, "The part number's hover still shows Inventory or the vendor bill",
  [ADMIN_WO, WHERE, customer("A"), "Have a new work order for this test, work order 1, for customer A, with an inventory part and a special-order part received on a vendor bill.", DESK],
  ["Open work order 1.", "Point at the inventory part's part number.", "Point at the special-order part's part number."],
  [R(S("S12-R2"), "Work order 1 opens."),
   R(S("S12-R2", "(today the part number's hover shows \"Inventory\" with no bin)"), "The hover reads \"Inventory\" as today."),
   R(S("S12-R2", "or \"<vendor> - <vendor bill #>\" for a special-order part, as the part number's hover shows today"), "The hover reads the vendor's name, \" - \" and the vendor bill number, as today.")],
  pics=["today:10.1"])

C("INV-71", K, "Without See Financial Data line prices and margins stay hidden",
  ["Sign in as a user whose role has 'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit' but not 'See Financial Data'. An Admin makes the records below before the test.", WHERE, customer("A"),
   "Have a new work order for this test, work order 1, for customer A, with a part line.", DESK],
  ["Open work order 1."],
  [R(S("S10-N2", "If the user lacks 'See Financial Data', the price, margin, Manual icon, Priced by column and details are hidden, as prices are today."),
     "The part line shows its description and quantity.", "Its price and margin are hidden, as today.")],
  pics=["today:10.1"])

C("INV-72", K, "Line permissions still decide the Parts tab and typing",
  ["Sign in as a user whose role has 'See Financial Data' and 'Work Orders — Order Parts' but not 'Work Order Lines — Create & Edit'. An Admin makes the records below before the test.", WHERE, customer("A"),
   "Have a new work order for this test, work order 1, for customer A, with a part line.", DESK],
  ["Open work order 1.", "Click the Parts tab."],
  [R(S("S16-R2", "Controls a user may not use are hidden, not greyed, as today"), "Work order 1 opens."),
   R(S("TP-PERM-11", "Typing a price or a cost on a line — The existing line permissions ('Work Order Lines — Create & Edit'; 'Part Sales — Create & Edit') plus 'See Financial Data'"),
     "The Parts tab lists the part with its price.", "The price and cost cannot be typed in, as today without the line permission.")],
  pics=["12.4"])

C("INV-73", K, "Work order totals and taxes still come from the saved line prices",
  [ADMIN_WO, WHERE, tier("A"), MX.replace("Default on Markup % 50", "Default on Markup % 50 and tier A on Markup % 20"), customer("A", ", on tier A for work orders"),
   "Have a tax set up for this test at 5%, picked on customer A, with category A not tax exempt.",
   "Have a new work order for this test, work order 1, for customer A, with two category A parts at a cost of $10.00 each and no labor.", DESK],
  ["Open work order 1.", "Click the Stats tab.", "Invoice work order 1."],
  [R(S("S17-R1"), "The two parts sell at $12.00 each ($10.00 × 1.20 = $12.00)."),
   R(S("S17-R1", "Work order and Part Sale Stats, invoice totals and taxes calculate from the saved line prices, as today."), "Stats show parts of $24.00 ($12.00 + $12.00 = $24.00)."),
   R(QP("Totals, invoices and accounting use the saved line prices, as today.", "S17-R1"), "The invoice shows parts $24.00, tax $1.20 ($24.00 × 5% = $1.20) and a total of $25.20 ($24.00 + $1.20 = $25.20).")],
  pics=["today:10.1"], flags=["numbers"])

C("INV-74", K, "The receive window still works, with the new notice words",
  [ADMIN_WO, WHERE, customer("A"), "Have a new work order for this test, work order 1, for customer A, with a special-order part ordered and not yet received.", DESK],
  ["Open work order 1.", "Receive the special-order part at a new cost."],
  [R(S("S11-R15"), "Work order 1 opens."),
   R(S("S11-R15", "Its 6-second notice reads \"Updating the cost also updates the sell price.\", replacing today's \"Updating the cost also updates the sell price to keep the margin.\""),
     "The receive window works as today and its notice reads \"Updating the cost also updates the sell price.\"", "It no longer adds \"to keep the margin\".")
   + R(S("S11-R15", "The receive window says nothing about tiers."), "The part is received at the new cost.")],
  nopic="no design board draws the receive window")

C("INV-75", K, "The work order lines bulk bar still counts the selected lines",
  [ADMIN_WO, WHERE, customer("A"), "Have a new work order for this test, work order 1, for customer A, with two lines.", DESK],
  ["Open work order 1.", "Tick both lines."],
  [R(S("S9-R18"), "Work order 1 opens."),
   R(S("S9-R18", "the design system's dark bulk action bar at the top of the dialog, above the search and the list, as on a work order's lines"),
     "The dark bulk action bar appears above the lines, as today.", "It reads \"2 selected\".")],
  pics=["9.6"])

C("INV-77", K, "The work order history dialog opens as today",
  [ADMIN_WO, WHERE, customer("A"), "Have a new work order for this test, work order 1, for customer A, with a line changed after it was made.", DESK],
  ["Open work order 1.", "Open work order 1's three-dot menu.", "Click the history (audit log) entry."],
  [R(S("S19-R19"), "Work order 1 opens."), R(S("S19-R19"), "The menu opens as today."),
   R(S("S19-R19", "It opens ShopView's existing history dialog as it is today"), "The history dialog opens as today, with its search box and columns (Line included).", "It lists the line change.")],
  pics=["2.6"])

C("INV-79", K, "Without See Financial Data a part's category still changes in place",
  ["Sign in as a user whose role can edit inventory parts but has no 'See Financial Data'. An Admin makes the records below before the test.", WHERE, category("A", ", so part A starts in it"), category("B"),
   "Have a new inventory part for this test, part A, in category A, so the test can move it.", DESK],
  ["Open part A in the inventory.", "Pick category B as part A's category.", "Save the part."],
  [R(S("S16-N4"), "Part A's dialog opens."),
   R([S("S16-N4", "change a part's category"), QT("no Access Denied page", "TPX-07")], "Category B is picked.", "No Access Denied page appears."),
   R(S("S16-N4"), "Part A saves in category B and the user stays on the inventory page.")],
  nopic="no design board draws the inventory part dialog")

# ---- linked-ticket candidates (SV-3398, SV-3411) ---------------------------------------------------------------------------------
C("INV-101", K, "A fixed sell price still shows the green Fixed sell price label",
  [ADMIN, WHERE, "Have a new inventory part for this test, part A, with a fixed sell price of $40.00.", DESK],
  ["Open Parts › Inventory.", "Find part A in the list."],
  [R(S("S1-R6"), "The inventory list shows."),
   R(QJ("Add ‘Fixed sell price’ underneath the sell price in the column. Keep the text in green.", "SV-3398", "S1-R6"),
     "Part A's sell price reads $40.00 with \"Fixed sell price\" in green underneath, as today.")
   + R(QP("A customer's tier price on the inventory and catalog screens.** Their Sell price stays the fixed or Default price, as today.", "S1-R6"), "No tier price shows in the inventory list.")],
  nopic="no design board draws the inventory list")

C("INV-102", K, "Clearing a fixed sell price still recalculates from the matrix",
  [ADMIN, WHERE, category("A", ", on matrix A"), MX.replace("pricing a new category made for this test, category A", "pricing category A"),
   "Have a new inventory part for this test, part A, in category A, cost $10.00, with a fixed sell price of $40.00.", DESK],
  ["Open part A in the inventory.", "Clear the sell price.", "Save the part."],
  [R(S("S1-R6"), "Part A's dialog shows the sell price $40.00."), R(S("S1-R6"), "The sell price is empty."),
   R(QJ("clearing the fixed sell price recalculates the price from the matrix and removes the fixed indicator", "SV-3398", "S1-R6"), "Part A's sell price is recalculated from matrix A (category A's matrix): $15.00 ($10.00 × 1.50 = $15.00).", "The green \"Fixed sell price\" label is gone.")],
  nopic="no design board draws the inventory part dialog", flags=["numbers"])

C("INV-103", K, "A category change still mirrors to the catalog and every location",
  [ADMIN, WHERE, "Use a client with two locations, location 1 and location 2, both stocking a new inventory part made for this test, part A, in category A.",
   category("A", ", so part A starts in it"), category("B"), DESK],
  ["At location 1, open part A in the inventory.", "Pick category B as part A's category.", "Save the part.", "Open part A in the catalog.", "Switch to location 2.", "Open part A in the inventory."],
  [R(S("S11-R3"), "Part A's dialog opens in category A."), R(S("S11-R3"), "Category B is picked."), R(S("S11-R3"), "Part A saves in category B."),
   R(QJ("When category is changed in the inventory, it should mirror that change in the catalog. The catalog and the inventory item should always have the same _category_.", "SV-3411", "S11-R3"),
     "The catalog shows part A in category B."),
   R(S("S11-R3"), "Location 2 is the current location."),
   R(QJ("In the case of multi location, the same applies, all inventory items in all locations, and catalog, should have mirrored _category_.", "SV-3411", "S11-R3"),
     "At location 2 part A's category also reads category B.")
   + R(QJ("On category change recalculate price only if part doesn’t have fixed price", "SV-3411", "S11-R3"), "Its sell price is recalculated from category B's matrix, as it has no fixed price.")],
  nopic="no design board draws the inventory or catalog")

# ---- INV-78 (consolidation, 14 Nov 2026): PRD silent; tech plan 1 Appendix B §7 states the shared title field keeps no length limit there
T60 = "Northern Alberta Heavy Equipment Fleet Inspection Template 1"     # 60 characters
C("INV-78", K, "Inspection and maintenance titles still take more than 50 characters",
  [ADMIN, WHERE, "Have a new inspection template for this test in the Digital Vehicle Inspection builder.",
   "Have a new maintenance schedule for this test in the maintenance editor.", DESK],
  ["Open the new inspection template in the Digital Vehicle Inspection builder.", "Click the template's title.",
   f"Type a 60-character title (for example {T60}).", "Open the new maintenance schedule in the maintenance editor.", "Click the schedule's title.",
   f"Type a 60-character title (for example {T60}).", TIERS, "Click New Tier.", f"Type the same 60 characters in the tier name (for example {T60})."],
  [R(QI("maintenance editor, DVI builder", "INV-78"), "The builder opens with the template's title."),
   R(QI("maintenance editor, DVI builder", "INV-78"), "The title can be typed in."),
   R([QI("unchanged without the prop", "INV-78"), QI("maxlength?: number passed to the inner Input (for PQ5)", "INV-78")],
     "All 60 characters are in the title: typing goes on past the 50th character."),
   R(QI("maintenance editor, DVI builder", "INV-78"), "The maintenance editor opens with the schedule's title."),
   R(QI("maintenance editor, DVI builder", "INV-78"), "The title can be typed in."),
   R([QI("unchanged without the prop", "INV-78"), QI("maxlength?: number passed to the inner Input (for PQ5)", "INV-78")],
     "All 60 characters are in the title: typing goes on past the 50th character."),
   R(S("S2-R3"), "The Tiers list shows."), R(S("S2-R3"), "The New Tier page opens with an empty name."),
   R(S("S2-R3", "The field stops accepting characters at 50."), "The tier name stops at 50 characters: the 50-character limit is the tier name's own, not the other titles'.")],
  nopic="no design board or Today picture draws the inspection builder or the maintenance editor")
