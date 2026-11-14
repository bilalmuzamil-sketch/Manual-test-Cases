"""Story 16 — Who can do what (SV-12468), PRD v37 lines 955-990 and the Permissions table in Key Decisions (TP-PERM-1…12), tech plan row
TPX-07. Batch A, 14 Nov 2026. Each case names the role's permissions exactly; the tester makes a role for the test with those permissions
(Settings › Roles & Permissions) and signs in as a user on it. Records are set up by an Admin beforehand. "Refused however it is attempted"
is shown with two real sessions (a permission removed while a page is open), never with a direct call (Rule 114)."""
from tp_lib import C, R, B, S, QP, QD, QL, QT
from common import *

K = "S16"


def role(has, hasnt=None):
    return f"Sign in as a user whose role (made for this test) has {has}" + (f" but not {hasnt}." if hasnt else ".")


MX = ("Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: "
      "Default Markup % 50, tier A Markup % 20.")
NOPIC = "Story 16 has no design page; the permission states are not drawn"


C("S16-01", K, "No new permission appears in Roles & Permissions",
  [ADMIN, DESK],
  ["Open Settings › Roles & Permissions.", "Open a role to see its permission list."],
  [R(S("S16-R6"), "The Roles & Permissions page lists the roles."),
   R(S("S16-R6", "The permissions in section 4 (Permissions) govern every new screen, and no new permission appears in settings."),
     "The permission list still shows 'Settings — Parts' and 'See Financial Data'.", "It has no permission named for tiers, matrices or pricing tiers.")],
  nopic=NOPIC)

C("S16-02", K, "Without Customers — Create & Edit the customer page has no edit pencil",
  [role("'Customers — View' and 'View and Manage AP/AR Data'", "'Customers — Create & Edit'"), tier("A", ", so the client has more than one active tier"),
   customer("A", ", on tier A for work orders"), DESK],
  ["Open customer A's page from Customers."],
  [R(S("S16-R2", "Controls a user may not use are hidden, not greyed, as today; for example, without 'Customers — Create & Edit' the customer page has no edit pencil."),
     "The customer card shows customer A's details and its Pricing section with Work Order Tier reading tier A.", "The card has no edit pencil, not even a grayed one.")
   + R(S("S16-R4", "'Customers — View' with 'View and Manage AP/AR Data' shows the customer's tiers read-only, in the customer card's pricing section."),
       "The tier rows can be read but not changed on the page.")],
  pics=["9.30"])

C("S16-03", K, "Customers — Create & Edit alone lets a user change a customer's tiers",
  [role("'Customers — View' and 'Customers — Create & Edit'", "'Settings — Parts'"), tier("A"), customer("A"), DESK],
  ["Open customer A's page from Customers.", "Click the edit pencil on the customer card.", "Open the Work Order Tier picker.", "Pick tier A.", SAVE, "Open Settings.", "Open Customers.", "Click New Customer."],
  [R(S("S16-R4"), "Customer A's page opens."),
   R(S("S16-R4", "'Customers — Create & Edit' lets a user view and change the customer's tiers in Edit Customer and New Customer, even without 'Settings — Parts'"),
     "Edit Customer shows Work Order Tier and Part Sales Tier."),
   R(S("S9-R30"), "The picker lists the active tiers, tier A among them."), R(S("S16-R4"), "Work Order Tier reads tier A."), R(S("S16-R4"), "The customer saves with tier A for work orders."),
   R(S("S16-R4", "(Settings › Pricing is then hidden, S16-N1)"), "Settings opens.", "Its menu has no Pricing item."),
   R(S("S16-R4"), "The Customers list shows."),
   R(S("S16-R4", "view and change the customer's tiers in Edit Customer and New Customer"), "New Customer shows Work Order Tier and Part Sales Tier on Default.")],
  pics=["9.31", "9.33"])

C("S16-04", K, "Without See Financial Data a line's pricing source and details are withheld",
  [role("'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'", "'See Financial Data'"), tier("A"), MX,
   customer("A", ", on tier A for work orders"), "Have a new work order for this test, work order 1, for customer A, with a category A part added.", DESK],
  ["Open work order 1.", "Point at where the part's sell price shows.", "Click the Parts tab."],
  [R(S("S16-R5"), "Work order 1 opens with the part line."),
   R(S("S16-R5", "Without 'See Financial Data', price details and the pricing source are withheld the same way line prices are today."),
     "The part's price is hidden as line prices are today.", "No price details open.")
   + R(S("TP-PERM-10"), "The part line's description and quantity show."),
   R(S("TP-PERM-10", "The Priced by column, the price details and the Manual icon — 'See Financial Data'."), "The Parts tab lists the part.", "It has no Priced by column.")],
  pics=["12.4"])

C("S16-05", K, "A permission removed while a page is open makes the save refused",
  [ADMIN, "Have a second Admin session open in another browser, signed in as an Admin who can change roles.",
   role("'Settings — Parts' and 'See Financial Data'"), MX.replace(", tier A Markup % 20", ""), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 60 in Default's first range.",
   "In the second browser, remove 'See Financial Data' from the test user's role.", SAVE],
  [R(S("S16-R5"), "Matrix A is listed."), R(S("S16-R5"), "Matrix A's page opens."), R(S("S16-R5"), "The grid is in edit."), R(S("S16-R5"), "Default's first range reads 60."),
   R(S("S16-R5"), "The role is saved without 'See Financial Data'."),
   R(S("S16-EH1", "An action refused by the server for a missing permission shows \"Access restricted\", as today."), "The save is refused and \"Access restricted\" shows.")
   + R(S("S16-R5", "an action a user isn't allowed to take is refused however it is attempted"), "Reopened as an Admin, matrix A still shows Default on 50% markup: nothing was saved.")],
  nopic=NOPIC)

C("S16-06", K, "Settings — Parts without See Financial Data shows Fixed Rules and categories",
  [role("'Settings — Parts'", "'See Financial Data'"), DESK],
  ["Open Settings › Pricing.", CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE],
  [R(S("S16-R11", "A user with 'Settings — Parts' but not 'See Financial Data' sees no tiers, matrices or simulator: Settings › Pricing shows only the Fixed Rules tab."),
     "Settings › Pricing shows the Fixed Rules tab.", "It has no Tiers or Matrices tab.")
   + R(S("TP-PERM-3", "Settings › Pricing: the Fixed Rules tab — 'Settings — Parts', as today"), "The Fixed Rules tab lists the fixed rules as today."),
   R(S("S16-R11", "The Categories page shows only the Category column."), "The Categories page lists every category.", "It shows the Category column, with no Pricing Matrix, Default or tier columns."),
   R(S("S16-R11", "New Category and a category's page show no Pricing Matrix field and no grid"), "The New Category page shows the name, QuickBooks Products and Services (when connected) and Tax Exempt.",
     "It has no Pricing Matrix field and no grid."),
   R(S("S16-R11"), "The name shows in the field."),
   R(S("S16-R11", "a new category uses the General Matrix"), "The category is created.",
     "Signed in as an Admin afterwards, its Pricing Matrix reads General Matrix.")],
  pics=["8.6"])

C("S16-07", K, "Without Settings — Parts the Parts group is hidden and a link is restricted",
  [role("'See Financial Data'", "'Settings — Parts'"), "Have the address of Settings › Pricing copied from an Admin session (for example the page's link).", DESK],
  ["Open Settings.", "Open the copied Settings › Pricing address.", "Click Go to home."],
  [R(S("S16-N1", "Without 'Settings — Parts', the Parts group in Settings is hidden."), "Settings opens with its other groups.", "It has no Parts group (no Categories, Pricing or Bin Locations)."),
   R(S("S16-N1", "A link to Pricing shows \"Access restricted\" with \"Looks like you don't have access to this page. Reach out to your administrator to request access.\" and Go to home."),
     "The page reads \"Access restricted\" and \"Looks like you don't have access to this page. Reach out to your administrator to request access.\", with Go to home."),
   R(S("S16-N1"), "The home page opens.")],
  nopic=NOPIC)

C("S16-08", K, "A technician without See Financial Data adds a part priced by the tier",
  [role("'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'", "'See Financial Data'"), tier("A"), MX,
   customer("A", ", on tier A for work orders"), "Have a new work order for this test, work order 1, for customer A.",
   "Have a new inventory part for this test, part A, in category A, cost $10.00.", DESK],
  ["Open work order 1.", "Add part A to work order 1.", "Sign out.", "Sign in as an Admin with 'See Financial Data'.", "Open work order 1."],
  [R(S("S16-N4"), "Work order 1 opens."),
   R(S("S16-N4", "A technician without 'See Financial Data' can still add parts. They are priced by the customer's tier without the technician seeing the price."),
     "Part A is added.", "Its price is not shown to this user.")
   , R(S("S16-N4"), "The sign-in page shows."), R(S("S16-N4"), "The Admin is signed in."),
   R(S("S16-N4", "They are priced by the customer's tier"), "Part A sells at $12.00 ($10.00 × 1.20 = $12.00, tier A).", "It shows no Manual icon.")],
  pics=["12.1"], flags=["numbers"])

C("S16-09", K, "Without See Financial Data a part's category change stays on the page",
  [role("the inventory permissions needed to edit an inventory part", "'See Financial Data'"), category("A", ", so part A starts in it"), category("B"),
   "Have a new inventory part for this test, part A, in category A, so the test can move it.", DESK],
  ["Open part A in the inventory.", "Pick category B as part A's category.", "Save the part."],
  [R(S("S16-N4"), "Part A's inventory part dialog opens."),
   R([S("S16-N4", "a user without 'See Financial Data' can split a work order or Part Sale or change a part's category"), QT("no Access Denied page", "TPX-07")],
     "Category B is picked and the dialog stays open.", "No Access Denied page appears."),
   R(S("S16-N4", "change a part's category"), "Part A saves in category B.", "The user stays on the inventory page.")],
  nopic=NOPIC)

C("S16-10", K, "Without See Financial Data a split reprices the moved parts by the rules",
  [role("'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'", "'See Financial Data'"), tier("A"), MX,
   customer("A", ", on Default for work orders when work order 1 was made, and on tier A for work orders now"),
   "Have a new work order for this test, work order 1, for customer A, with a category A part at a cost of $10.00 (sold at $15.00, Default).", DESK],
  ["Open work order 1.", "Split the part onto a new work order.", "Sign out.", "Sign in as an Admin with 'See Financial Data'.", "Open the new work order."],
  [R(S("S16-N4"), "Work order 1 opens."),
   R(S("S16-N4", "a user without 'See Financial Data' can split a work order or Part Sale"), "The split is allowed and a new work order is made with the part."),
   R(S("S16-N4"), "The sign-in page shows."), R(S("S16-N4"), "The Admin is signed in."),
   R(S("S16-N4", "the moved or recategorized parts are priced again by the rules (S11-E6, S11-R3), since no typed price is involved"),
     "On the new work order the part sells at $12.00 ($10.00 × 1.20 = $12.00): priced again by tier A, customer A's current tier.", "It shows no Manual icon.")],
  nopic=NOPIC, flags=["numbers"])

C("S16-11", K, "Without Customers — Create & Edit a tier's Customers tab is read-only",
  [role("'Settings — Parts', 'See Financial Data' and 'Customers — View'", "'Customers — Create & Edit'"), tier("A"), customer("A", ", on tier A for work orders"), DESK],
  [TIERS, open_tier("A"), "Click the Customers tab."],
  [R(S("S16-N5"), "The Tiers list shows tier A."),
   R(S("S16-N5", "With 'Settings — Parts' but not 'Customers — Create & Edit', the user manages tiers and matrices"), "Tier A's page opens with its Pricing tab and its matrix list."),
   R(S("S16-N5", "a tier's Customers tab is read-only, and Manage Customers is hidden"), "The tab lists customer A.", "It has no Manage Customers button.")
   + R(S("TP-PERM-6", "A tier's Customers tab — 'Settings — Parts', 'See Financial Data' and 'Customers — View'"), "The list can be searched and sorted.")],
  pics=["9.1"])

C("S16-12", K, "Manage Customers needs Customers — Create & Edit with the settings permissions",
  [ADMIN_CUST, tier("A"), customer("A"), DESK],
  [TIERS, open_tier("A"), "Click the Customers tab.", "Click Manage Customers."],
  [R(S("S16-N5"), "The Tiers list shows tier A."), R(S("S16-N5"), "Tier A's page opens."),
   R(S("TP-PERM-7", "Manage Customers (changing customers' tiers from a tier) — 'Settings — Parts', 'See Financial Data' and 'Customers — Create & Edit'"), "The tab shows Manage Customers."),
   R(S("S16-N5", "Changing a customer's tiers from Settings (Manage Customers) needs 'Settings — Parts', 'See Financial Data' and 'Customers — Create & Edit'."),
     "Manage Customers opens with customer A on the Add Customers tab.")],
  pics=["9.4"])

C("S16-13", K, "Without Customers — View there is no Customers tab and archive gives a count",
  [role("'Settings — Parts' and 'See Financial Data'", "'Customers — View'"), tier("A"), "Have two new customers for this test on tier A for work orders, made by an Admin, so tier A has customers.", DESK],
  [TIERS, open_tier("A"), TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive."],
  [R(S("S16-E1"), "The Tiers list shows tier A."),
   R(S("S16-E1", "A user with 'Settings — Parts' but not 'Customers — View' doesn't see a tier's Customers tab."), "Tier A's page shows its Pricing tab.", "It has no Customers tab."),
   R(S("S16-E1"), "The Tiers list shows."), R(S("S2-R26"), "The menu offers Archive."),
   R(S("S16-E1", "When they archive or delete a tier with customers, the dialog gives the count instead of the names: \"12 customers are on Fleet. Someone who can manage customers moves them first.\""),
     "The dialog reads \"2 customers are on\" tier A's name \". Someone who can manage customers moves them first.\"", "It names no customer.")],
  pics=["2.19"])

C("S16-14", K, "Settings — Parts and See Financial Data open every pricing page",
  [role("'Settings — Parts' and 'See Financial Data'", "any customer permission"), DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Click Create Tier.", TIERS, "Open the new tier's three-dot menu on the Tiers list.", "Click Archive.", "Click Archive in the dialog.",
   MATRICES, "Click the General Matrix's name."],
  [R(S("TP-PERM-1"), "The Tiers list shows with New Tier."), R(S("TP-PERM-1"), "The New Tier page opens."), R(S("TP-PERM-1"), "The name shows in the field."),
   R(S("TP-PERM-1", "creating, archiving, reactivating and deleting a tier — 'Settings — Parts' and 'See Financial Data'"), "The tier is created and its page opens."),
   R(S("TP-PERM-1"), "The Tiers list shows the new tier."), R(S("TP-PERM-1"), "The menu offers Archive and Delete."), R(S("TP-PERM-1"), "The Archive question opens."),
   R(S("TP-PERM-1"), "The tier is archived."),
   R([S("TP-PERM-1", "Settings › Pricing: the Tiers and Matrices tabs, a tier's page, a matrix's page, the General Matrix and the Price Part Simulator"), S("S16-R5", "Viewing and editing tiers, matrices, the Price Part Simulator and category pricing needs both 'Settings — Parts' and 'See Financial Data'")], "The Matrices list shows."),
   R(S("TP-PERM-1"), "The General Matrix's page opens with its grid and the Price Part Simulator.")],
  pics=["2.2", "6.2"])

C("S16-15", K, "Settings — Parts alone can create, rename and delete a category",
  [role("'Settings — Parts'", "'See Financial Data'"), category("A"), DESK],
  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE, CATEGORIES, "Click category A's row.", "Click the category name at the top of the page.",
   "Type a new name no other category uses.", "Press Enter.", "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog."],
  [R(S("TP-PERM-4"), "The Categories page shows."), R(S("TP-PERM-4"), "The New Category page opens."), R(S("TP-PERM-4"), "The name shows."),
   R(S("TP-PERM-4", "Settings › Categories: the page, and creating, renaming and deleting a category — 'Settings — Parts', as today"), "The category is created."),
   R(S("TP-PERM-4"), "The Categories page lists category A."), R(S("TP-PERM-4"), "Category A's page opens."), R(S("TP-PERM-4"), "The name becomes editable."),
   R(S("TP-PERM-4"), "The new name shows."), R(S("TP-PERM-4"), "Category A is renamed."), R(S("TP-PERM-4"), "The menu lists Delete."), R(S("TP-PERM-4"), "The delete question opens."),
   R([S("TP-PERM-4", "creating, renaming and deleting a category — 'Settings — Parts', as today"), S("S16-R8", "Without 'Settings — Parts', there is no Categories page, as today.")], "Category A is deleted.", "The Categories page shows without it.")],
  pics=["8.6", "8.11"])

C("S16-16", K, "Category pricing needs See Financial Data as well as Settings — Parts",
  [role("'Settings — Parts'", "'See Financial Data'"), category("A"), DESK],
  [CATEGORIES, "Click category A's row.", "Open the page's three-dot menu.", "Press Esc.", "Open the three-dot menu beside New Category."],
  [R(S("S16-R8", "The Categories page's pricing columns, its matrix grid and every edit to a matrix need 'Settings — Parts' and 'See Financial Data'."),
     "The Categories page lists category A in the Category column.", "It shows no pricing columns."),
   R(S("TP-PERM-5", "Settings › Categories: the pricing columns, a category's Pricing Matrix and grid, and editing its matrix — 'Settings — Parts' and 'See Financial Data'"),
     "Category A's page shows its name, QuickBooks Products and Services and Tax Exempt.", "It has no Pricing Matrix picker, grid or Edit."),
   R(S("TP-PERM-2", "The Audit Log of a matrix, a tier or a category, and of the Matrices, Tiers and Categories lists — 'Settings — Parts' and 'See Financial Data', like the pages they're on."),
     "The menu lists Delete.", "It has no Audit Log."),
   R(S("TP-PERM-2"), "The menu closes."),
   R(S("TP-PERM-2", "like the pages they're on"), "The Categories list offers no Audit Log for this user.", "New Category is still offered.")],
  pics=["7.8", "7.14"])

C("S16-17", K, "Reports show costs and margins to users without See Financial Data",
  [role("'Reports — Page Access'", "'See Financial Data'"), "Use a client with invoiced part sales in the last month, so the reports have rows.", DESK],
  ["Open Reports.", "Open Sales by Tier.", "Open Reports.", "Open Sales by Category."],
  [R(S("S16-R7"), "The Reports page lists the reports."),
   R(S("S16-R7", "Sales by Tier and Sales by Category are the one exception to withholding (S16-R5). Like every report, they show to users with 'Reports — Page Access', and show their costs and margins to all of them, as Sales by Customer does today."),
     "Sales by Tier opens.", "Its cost and margin columns show figures.")
   + R(S("TP-PERM-12"), "Its rows show the tiers' sales."),
   R(S("S16-R7"), "The Reports page shows."),
   R(S("TP-PERM-12", "Sales by Tier and Sales by Category — 'Reports — Page Access', like every report."), "Sales by Category opens with its cost and margin columns showing figures.")],
  pics=["20.2", "20.16"])

C("S16-18", K, "The Parts tab still needs Work Orders — Order Parts",
  [role("'See Financial Data' and 'Work Order Lines — Create & Edit'", "'Work Orders — Order Parts'"), customer("A"), "Have a new work order for this test, work order 1, for customer A, with a part line.", DESK],
  ["Open work order 1."],
  [R([S("TP-PERM-10", "The work order Parts tab itself also needs 'Work Orders — Order Parts', as today"), S("S16-R2", "Controls a user may not use are hidden, not greyed, as today")], "Work order 1 opens on its Lines tab.", "It has no Parts tab, as today.")],
  pics=["12.4"])

C("S16-19", K, "Typing a price needs See Financial Data with the line permissions",
  [role("'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'", "'See Financial Data'"), customer("A"),
   "Have a new work order for this test, work order 1, for customer A, with a part line.", DESK],
  ["Open work order 1.", "Click the part line to edit it."],
  [R(S("TP-PERM-11"), "Work order 1 opens."),
   R([S("TP-PERM-11", "Typing a price or a cost on a line — The existing line permissions ('Work Order Lines — Create & Edit'; 'Part Sales — Create & Edit') plus 'See Financial Data'"), S("S16-R5", "Without 'See Financial Data', price details and the pricing source are withheld the same way line prices are today.")],
     "The line's description and quantity can be edited.", "No sell price or cost box can be typed in.")],
  pics=["12.3"])

C("S16-20", K, "Customers — View and AP/AR show the tiers but no tier fields to change",
  [role("'Customers — View' and 'View and Manage AP/AR Data'", "'Customers — Create & Edit'"), tier("A"), customer("A", ", on tier A for Part Sales"), DESK],
  ["Open customer A's page from Customers."],
  [R(S("TP-PERM-9", "The customer page — 'Customers — View'. The pricing section of its customer card, tiers included, also needs 'View and Manage AP/AR Data'"),
     "The card's Pricing section shows Part Sales Tier reading tier A.")
   + R([S("TP-PERM-8", "A customer's tiers in Edit Customer and New Customer — 'Customers — Create & Edit'"), S("S16-R4", "'Customers — View' with 'View and Manage AP/AR Data' shows the customer's tiers read-only, in the customer card's pricing section.")], "The page offers no Edit Customer, so the tiers cannot be changed.")],
  pics=["9.30"])
