"""Story 19 — Shared behavior for every new page, dialog and list (SV-11709), PRD v37 lines 1051-1101, tech plan rows TPX-15 (a refused
save inline with Reload, tabs saved on their own) and TPX-22 ("Deleted customer" in a tier's Audit Log). Batch A, 14 Nov 2026.
Story 19 has no design page of its own; the Audit Log boards of pages 2, 6 and 7 are attached where they show the dialog. "Someone else
saved first" is run with two real browser sessions (Rule 114)."""
from tp_lib import C, R, B, S, QP, QD, QL, QT
from common import *

K = "S19"
NOPIC = "Story 19 has no design page; this shared behaviour is not drawn"
TWO = "Have a second browser session open, signed in as another Admin with the same permissions."


C("S19-01", K, "A double click on Create Tier creates one tier",
  [ADMIN, "Note the number of active tiers the Tiers list shows (for example 6).", DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Double-click Create Tier.", TIERS],
  [R(S("S19-R1"), "The Tiers list shows the noted number of active tiers."), R(S("S19-R1"), "The New Tier page opens."), R(S("S19-R1"), "The name shows in the field."),
   R(S("S19-R1", "while saving, the primary button shows a spinner and Save, Cancel and the X are disabled, so a double click can't save twice"), "The tier is created once and its page opens."),
   R(S("S19-R1", "so a double click can't save twice"), "The list shows one more active tier than noted (6 + 1 = 7).", "The new name is listed once.")],
  pics=["2.11", "2.17"], flags=["numbers"])

C("S19-02", K, "A dialog closes only with Cancel or the X",
  [ADMIN, tier("A"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive.", "Click outside the dialog.", "Click the X."],
  [R(S("S19-R1"), "The Tiers list shows tier A."), R(S("S2-R26"), "The menu offers Archive."), R(S("S2-R30"), "The Archive question opens."),
   R(S("S19-R1", "dialogs close only with Cancel or the X"), "The dialog stays open.", "Tier A is still active."),
   R(S("S19-R1", "dialogs close only with Cancel or the X"), "The dialog closes.", "Tier A is still active.")],
  pics=["2.22"])

C("S19-03", K, "An expired session logs the user out and unsaved work is lost",
  [ADMIN, matrix("A"), "Have a second tab open on the same site, signed in as the same user.", DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 60 in Default's first range.", "In the second tab, sign out.", SAVE],
  [R(S("S19-R1"), "Matrix A is listed."), R(S("S19-R1"), "Matrix A's page opens."), R(S("S19-R1"), "The grid is in edit."), R(S("S19-R1"), "Default's first range reads 60."),
   R(S("S19-R1"), "The second tab shows the sign-in page."),
   R(S("S19-R1", "an expired session logs the user out with \"Session expired, please log in again.\" and unsaved work is lost"),
     "The first tab logs out with \"Session expired, please log in again.\"", "After signing in again, matrix A does not have 60 in Default's first range: the unsaved change is lost.")],
  nopic=NOPIC)

C("S19-04", K, "Tiers, matrices and categories are made on pages, not in dialogs",
  [ADMIN, DESK],
  [TIERS, "Click New Tier.", "Click Cancel.", MATRICES, "Click New Matrix.", "Click Cancel.", CATEGORIES, "Click New Category."],
  [R(S("S19-R13"), "The Tiers list shows."),
   R(S("S19-R13", "Tiers, matrices and categories are created and edited on their own pages, never in dialogs"), "A New Tier page opens, not a dialog."),
   R(S("S19-R14"), "The Tiers list shows again."), R(S("S19-R13"), "The Matrices list shows."),
   R(S("S19-R13", "no matrix is edited in a dialog anywhere"), "A New Matrix page opens with its grid, not a dialog."),
   R(S("S19-R14"), "The Matrices list shows again."), R(S("S19-R13"), "The Categories page shows."),
   R(S("S19-R13", "Tiers, matrices and categories are created and edited on their own pages, never in dialogs"), "A New Category page opens, not a dialog.")],
  pics=["2.11", "3.22", "8.6"])

C("S19-05", K, "Cancelling New Tier creates nothing",
  [ADMIN, "Note the number of active tiers the Tiers list shows (for example 6).", DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Click Cancel."],
  [R(S("S19-R14"), "The Tiers list shows the noted number."), R(S("S19-R14"), "The New Tier page opens."), R(S("S19-R14"), "The name shows."),
   R(S("S19-R14", "Every create flow (New Tier, New Matrix, New Category) can be cancelled before it is saved, and cancelling creates nothing."),
     "The Tiers list shows again with the noted number of active tiers (6 = 6).", "The typed name is not listed.")],
  pics=["2.11"], flags=["numbers"])

C("S19-06", K, "New pages explain things in info-icon tooltips, never banners",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, "Point at tier A's name on the Tiers list.", MATRICES, open_matrix("A"), "Point at the info icon beside Cost Range."],
  [R(S("S19-R15", "The new pages show no explanatory text or help banners."), "The Tiers list shows info icons beside # and Matrices.", "It shows no help banner or explanatory paragraph."),
   R(S("S19-R15", "Tier names have no tooltip."), "Tier A's name is shown.", "No tooltip appears on it."),
   R(S("S19-R15"), "Matrix A is listed."),
   R(S("S19-R15", "The new pages show no explanatory text or help banners."), "Matrix A's page shows the grid and simulator with info icons.", "It shows no help banner."),
   R(S("S19-R15", "Explanations (cost ranges, how a price is found, the Part Sale switch) sit in short info-icon tooltips beside the item they explain, one or two plain sentences that never repeat the label."),
     "A tooltip of one or two short sentences explains cost ranges.", "It does not just repeat \"Cost Range\".")],
  pics=["2.3", "4.1"])

C("S19-07", K, "Leaving with unsaved changes asks, leaving with none does not",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT, MATRICES, open_matrix("A"), EDIT, "Type 60 in Default's first range.", MATRICES, "Click Keep Editing."],
  [R(S("S19-R3"), "Matrix A is listed."), R(S("S19-R3"), "Matrix A's page opens."), R(S("S19-R3"), "The grid is in edit with no changes."),
   R(S("S19-R3", "With no changes, it leaves straight away."), "The Matrices list shows at once.", "No question was asked."),
   R(S("S19-R3"), "Matrix A's page opens."), R(S("S19-R3"), "The grid is in edit."), R(S("S19-R3"), "Default's first range reads 60."),
   R([S("S19-R3", "Leaving a matrix page, the New Category page or a grid in edit with unsaved changes asks \"Discard these changes?\" (Keep Editing / Discard Changes)."), S("S19-R9", "Every column title, modal header, page title, tab and button uses Title Case.")],
     "A question \"Discard These Changes?\" opens with Keep Editing and Discard Changes."),
   R(S("S19-R3"), "The question closes.", "The grid is still in edit with 60.")],
  pics=["3.16", "4.23"])

C("S19-08", K, "Priced by names the source in words, not by colour",
  [ADMIN_WO, tier("A"), "Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with tier A on Markup % 20.",
   customer("A", ", on tier A for work orders"), "Have a new work order for this test, work order 1, for customer A, with a category A part, line 1, and a second part with a typed price, line 2.", DESK],
  ["Open work order 1.", "Click the Parts tab."],
  [R(S("S19-R5"), "Work order 1 opens."),
   R(S("S19-R5", "The Priced by column and price details always name the source in words, never by color alone."), "Line 1's Priced by reads tier A's name in words.", "Line 2's Priced by reads \"Manual\" in words beside its icon.")],
  pics=["12.4"])

C("S19-09", K, "Every grid cell in edit is reachable by keyboard and Enter saves New Tier",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Press Tab until the cursor reaches tier A's first range.", TIERS, "Click New Tier.", "Type a name no other tier uses.", "Press Enter."],
  [R(S("S19-R6"), "Matrix A is listed."), R(S("S19-R6"), "Matrix A's page opens."), R(S("S19-R6"), "The grid is in edit."),
   R(S("S19-R6", "Every new control is reachable by keyboard, including every grid cell in edit."), "The cursor reaches tier A's first range by keyboard alone.", "Each cell on the way took the cursor in turn."),
   R(S("S19-R6"), "The Tiers list shows."), R(S("S19-R6"), "The New Tier page opens with the cursor in the name."), R(S("S19-R6"), "The name shows."),
   R(S("S19-R6", "Enter in the New Tier name field saves the tier."), "The tier is created and its page opens.")],
  pics=["4.6", "2.11"])

C("S19-10", K, "A matrix save makes one Audit Log entry with each change",
  [ADMIN, tier("A"), matrix("A", ", with one range from $0.00 and Default on Markup % 50"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 60 in Default's first range.", "Type 10 in tier A's first range.", SAVE, "Open the page's three-dot menu.", "Click Audit Log."],
  [R(S("S19-R8"), "Matrix A is listed."), R(S("S19-R8"), "Matrix A's page opens."), R(S("S19-R8"), "The grid is in edit."), R(S("S19-R8"), "Default reads 60."), R(S("S19-R8"), "Tier A reads 10."),
   R(S("S19-R23", "nothing is logged for edits that weren't saved"), "The grid saves."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R19", "titled \"Audit Log: <matrix>\""), "A dialog titled \"Audit Log:\" and matrix A's name opens.")
   + R(S("S19-R23", "Each save makes one Audit Log entry on the log of what was saved, summing up everything that save changed"), "The newest entry is one entry for this save.")
   + R(S("S19-R8", "Every change to a matrix, a tier or a category is recorded, with what changed (each value before and after), who made it, when, and for which client"),
       "Its details show Default's change from 50% markup to 60% markup and tier A's new rule, with your user and today's date and time.")
   + R(S("S19-R19", "with each change in the details as \"<label>: <old> → <new>\""), "Each change reads as a label, the old value, an arrow and the new value.")],
  pics=["6.14", "2.6"])

C("S19-11", K, "A tier's Audit Log records its life and customer names",
  [ADMIN_CUST, tier("A", ", named for example Fleet"), customer("A"), DESK],
  [TIERS, open_tier("A"), "Click the tier name at the top of the page.", "Type a new name (for example Fleet Plus).", "Press Enter.", "Click the Customers tab.", "Click Manage Customers.", "Tick customer A.",
   "Click Add 1 Customer.", "Open the page's three-dot menu.", "Click Audit Log."],
  [R(S("S19-R8"), "The Tiers list shows tier A."), R(S("S19-R8"), "Tier A's page opens."), R(S("S19-R8"), "The name becomes editable."), R(S("S19-R8"), "The new name shows."),
   R(S("S19-R8"), "The title shows the new name."), R(S("S19-R8"), "The Customers tab shows."), R(S("S19-R8"), "The dialog opens."), R(S("S19-R8"), "Customer A is ticked."),
   R(S("S19-R23", "A bulk Manage Customers save makes one entry on the tier's log"), "Customer A is added."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R20", "A tier: \"Tier Created\", \"Tier Renamed\", \"Tier Archived\", \"Tier Reactivated\", \"Tier Deleted\", \"Tier Rule Set\", \"Tier Rule Undone\", \"Customer Added\", \"Customer Changed\", \"Customer Removed\"."),
     "The log lists, newest first, a customer event, then \"Tier Renamed\", then \"Tier Created\".")
   + R(S("S19-R21", "A tier's Audit Log and the Tiers list's show customer names in their customer events."), "The customer event names customer A.")
   + R(S("S19-R19", "newest first"), "The rename entry shows the old name, an arrow and the new name.")],
  pics=["2.6"])

C("S19-12", K, "Set Rule makes one entry on the tier and one on each matrix",
  [ADMIN, tier("A"), matrix("A"), matrix("B"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Type 10 in the bulk bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Open the page's three-dot menu.", "Click Audit Log.",
   "Click Close.", MATRICES, open_matrix("A"), "Open the page's three-dot menu.", "Click Audit Log."],
  [R(S("S19-R23"), "The Tiers list shows tier A."), R(S("S19-R23"), "Tier A's page opens."), R(S("S19-R23"), "Matrix A is checked."), R(S("S19-R23"), "Matrix B is checked."),
   R(S("S19-R23"), "The value reads 10."), R(S("S2-R23"), "The Set Rule question opens."), R(S("S2-R24"), "Matrices A and B read 10% off."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R23", "Set Rule makes one entry on the tier's log (\"Rule set in 7 matrices\") and one on each matrix it changed"), "The newest entry is one \"Tier Rule Set\" entry reading \"Rule set in 2 matrices\".")
   + R(S("S19-R20", "\"Tier Rule Set\""), "No second entry was added for the same Set Rule."),
   R(S("S19-R19"), "The dialog closes."), R(S("S19-R19"), "Matrix A is listed."), R(S("S19-R19"), "Matrix A's page opens."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R20", "and \"Tier Rule Set\", \"Tier Rule Undone\" or \"Tier Deleted\" when a tier's Set Rule, its Undo or a tier's deletion changes the matrix"), "Matrix A's log has one \"Tier Rule Set\" entry naming tier A.")],
  pics=["2.53", "2.6"])

C("S19-13", K, "A category's changes and its delete are logged",
  [ADMIN, category("A", ", with a part in the inventory"), matrix("A", ", which prices no category"), DESK],
  [CATEGORIES, "Click category A's row.", "Tick Tax Exempt.", "Pick matrix A in the Pricing Matrix picker.", "Open the page's three-dot menu.", "Click Audit Log.", "Click Close.",
   "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", "Open the three-dot menu beside New Category.", "Click Audit Log."],
  [R(S("S19-R8"), "Category A is listed."), R(S("S19-R8"), "Category A's page opens."), R(S("S7-R12"), "Tax Exempt is ticked."), R(S("S7-R9"), "Category A now uses matrix A."),
   R(S("S19-R19"), "The menu lists Audit Log and Delete."),
   R(S("S19-R20", "A category: \"Category Created\", \"Category Renamed\", \"Category Deleted\", \"Category Matrix Changed\", \"Tax Exempt Changed\", \"QuickBooks Mapping Changed\"."),
     "A dialog titled \"Audit Log:\" and category A's name lists \"Category Matrix Changed\", \"Tax Exempt Changed\" and \"Category Created\", newest first."),
   R(S("S19-R19"), "The dialog closes."), R(S("S8-R8"), "The menu lists Delete."), R(S("S8-R8"), "The delete question opens."), R(S("S8-R8"), "Category A is deleted."),
   R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R23", "A category delete makes one entry on the Categories list's log, with the number of parts and lines moved."),
     "\"Audit Log: Categories\" shows one \"Category Deleted\" entry for category A.", "It gives the number of parts and lines moved to Uncategorized.")
   + R(S("S19-R8", "A deleted category is recorded with its name, matrix, QuickBooks mapping and the number of parts and lines moved to Uncategorized."), "The entry names category A and matrix A.")],
  pics=["7.15", "8.10"])

C("S19-14", K, "Audit Log is in every list's and page's three-dot menu",
  [ADMIN, tier("A"), matrix("A"), category("A"), DESK],
  [TIERS, "Open the three-dot menu beside New Tier.", "Press Esc.", "Open tier A's three-dot menu on the Tiers list.", "Press Esc.", open_tier("A"), "Open the page's three-dot menu.",
   MATRICES, "Open the three-dot menu beside New Matrix.", "Press Esc.", open_matrix("A"), "Open the page's three-dot menu.",
   CATEGORIES, "Open the three-dot menu beside New Category.", "Press Esc.", "Click category A's row.", "Open the page's three-dot menu."],
  [R(S("S19-R19"), "The Tiers list shows."),
   R(S("S19-R19", "Audit Log is in the three-dot menu of each matrix's page and the Matrices list, each tier's page, its row on the Tiers list and the Tiers list, and each category's page and the Categories list."), "The menu lists Audit Log."),
   R(S("S19-R19"), "The menu closes."), R(S("S19-R19"), "Tier A's row menu lists Audit Log."), R(S("S19-R19"), "The menu closes."), R(S("S19-R19"), "Tier A's page opens."),
   R(S("S19-R19"), "Tier A's page menu lists Audit Log."), R(S("S19-R19"), "The Matrices list shows."), R(S("S19-R19"), "The menu lists Audit Log."), R(S("S19-R19"), "The menu closes."),
   R(S("S19-R19"), "Matrix A's page opens."), R(S("S19-R19"), "Matrix A's page menu lists Audit Log."), R(S("S19-R19"), "The Categories page shows."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R19"), "The menu closes."), R(S("S19-R19"), "Category A's page opens."), R(S("S19-R19"), "Category A's page menu lists Audit Log and Delete.")],
  pics=["2.4", "2.7", "6.13", "7.14", "8.10"])

C("S19-15", K, "Audit Log dialog keeps today's columns without Line, and says when empty",
  [ADMIN, STAGING, "Use a category on staging, category A, that nobody has changed since the release (so its log is empty).", DESK],
  [TIERS, "Open the three-dot menu beside New Tier.", "Click Audit Log.", "Click Close.", CATEGORIES, "Click category A's row.", "Open the page's three-dot menu.", "Click Audit Log."],
  [R(S("S19-R19"), "The Tiers list shows."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R19", "It keeps today's search box and columns, without the Line column, newest first"), "\"Audit Log: Tiers\" opens with a search box and the columns Event, User, Details, Date and Time.",
     "It has no Line column.")
   + R(S("S19-R19", "every matrix's, tier's or category's changes, deleted ones included, each detail starting with its name"), "Each detail starts with a tier's name; entries are newest first.")
   + R(S("S19-R19", "and Close"), "Close shows at the bottom."),
   R(S("S19-R19"), "The dialog closes."), R(S("S19-R19"), "The Categories page shows."), R(S("S19-R19"), "Category A's page opens."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R19", "With nothing recorded it shows \"No history here. Yet.\""), "\"Audit Log:\" and category A's name opens and reads \"No history here. Yet.\"", "Close is still offered.")],
  pics=["2.5", "2.6"])

C("S19-16", K, "Audit Log loads 50 entries at a time as you scroll",
  [ADMIN, "Use a client whose Tiers list Audit Log has more than 50 entries (make changes to tiers made for this test if needed).", DESK],
  [TIERS, "Open the three-dot menu beside New Tier.", "Click Audit Log.", "Scroll to the bottom of the dialog's list."],
  [R(S("S19-R19"), "The Tiers list shows."), R(S("S19-R19"), "The menu lists Audit Log."),
   R(S("S19-R19", "It loads 50 entries at a time, with more loading as the user scrolls, as today."), "\"Audit Log: Tiers\" opens with entries, newest first."),
   R(S("S19-R19", "It loads 50 entries at a time, with more loading as the user scrolls, as today."), "More entries load after the first 50 as you scroll.", "The dialog has no page buttons.")],
  pics=["2.6"])

C("S19-17", K, "A deleted customer reads Deleted customer in a tier's Audit Log",
  [ADMIN_CUST, tier("A"), customer("A", ", with no work orders, Part Sales, vehicles, contacts, transactions, payments or credit, put on tier A for work orders through Manage Customers"), DESK],
  ["Open customer A's page from Customers.", "Delete customer A from its page.", TIERS, open_tier("A"), "Open the page's three-dot menu.", "Click Audit Log."],
  [R(S("S19-R21"), "Customer A's page opens."), R(S("S9-E3"), "Customer A is deleted."), R(S("S19-R21"), "The Tiers list shows tier A."), R(S("S19-R21"), "Tier A's page opens."),
   R(S("S19-R19"), "The menu lists Audit Log."),
   R([S("S19-R21", "A tier's Audit Log and the Tiers list's show customer names in their customer events."), QT("with a \"Deleted customer\" fallback", "TPX-22")],
     "The customer event for customer A names them \"Deleted customer\".", "The \"Tier Created\" entry is still listed.")],
  pics=["2.6"])

C("S19-18", K, "A number column sorts highest first on the first click",
  [ADMIN, matrix("A", ", pricing three new categories made for this test"), matrix("B", ", pricing one new category made for this test"), DESK],
  [MATRICES, "Click the Categories column header."],
  [R(S("S19-R22"), "Matrix A and matrix B are listed."),
   R(S("S19-R22", "In every sortable list in this PRD, the first click on a number column sorts it highest first."), "Matrix A (3 categories) is above matrix B (1 category).", "Matrices with more categories come before those with fewer.")],
  pics=["6.2"])

C("S19-19", K, "Searches ignore capitals and outer spaces and keep the sort",
  [ADMIN, "Have a new category for this test, category A, named for example Quokka Parts.", "Have a new category for this test, category B, named for example Quokka Seals.", DESK],
  [CATEGORIES, "Type   QUOKKA   with spaces before and after in the search."],
  [R(S("S7-R4", "On first load, Uncategorized is first, then categories A to Z by name."), "The Categories list shows A to Z, category A above category B."),
   R(S("S19-R18", "Every search in this PRD matches a case-insensitive substring of each field it names and ignores leading and trailing spaces; results keep the list's sort."),
     "Categories A and B are listed in spite of the capitals and spaces.", "Category A is still above category B: the A to Z sort is kept.")],
  pics=["7.5"])

C("S19-20", K, "New titles, tabs and buttons use Title Case, messages sentence case",
  [ADMIN_CUST, tier("A"), DESK],
  [TIERS, open_tier("A"), "Click the Customers tab.", "Click Manage Customers."],
  [R(S("S19-R9"), "The Tiers list shows its columns and New Tier."),
   R(S("S19-R9", "Every column title, modal header, page title, tab and button uses Title Case."), "Tier A's page shows its tabs Pricing and Customers, and buttons in Title Case."),
   R(S("S19-R9", "Articles, short prepositions and conjunctions are lower case unless they start the text"), "The tab's Manage Customers button is in Title Case."),
   R(S("S19-R9", "for example \"Work Order Tier\", \"Part Sales Tier\", \"Manage Customers on Fleet Platinum\""), "The dialog title reads \"Manage Customers on\" and tier A's name, with \"on\" in lower case.",
     "Its columns read Work Order Tier and Part Sales Tier.")
   + R(S("S19-R9", "Sentences in messages and tooltips stay in sentence case."), "The footer \"No customers picked yet.\" is in sentence case.")],
  pics=["9.4"])

C("S19-21", K, "A second save of the same matrix is refused with Reload",
  [ADMIN, TWO, matrix("A", ", with one range from $0.00 and Default on Markup % 50"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 60 in Default's first range.", "In the second session, save matrix A with Default on 70.", SAVE],
  [R(S("S19-E2"), "Matrix A is listed."), R(S("S19-E2"), "Matrix A's page opens."), R(S("S19-E2"), "The grid is in edit."), R(S("S19-E2"), "Default reads 60."),
   R(S("S19-E2"), "The second session saves matrix A with 70."),
   R(S("S19-E2", "When someone else saved the same matrix, it shows \"<matrix> was changed by someone else. Reload to see their changes.\""),
     "The save is refused with matrix A's name and \"was changed by someone else. Reload to see their changes.\" on the page.")
   + R([S("S19-E2", "If someone else saved first, the second save is refused and nothing is saved. Everything typed is kept."), QT("a refused save keeps everything typed and shows the message inline with Reload", "TPX-15")],
       "The grid still shows 60 in Default's first range.", "A Reload action is offered beside the message.")],
  nopic=NOPIC)

C("S19-22", K, "A tier name taken by someone else is shown inline on save",
  [ADMIN, TWO, tier("A"), DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses (for example Fleet Gold).", "In the second session, rename tier A to the same name.", "Click Create Tier."],
  [R(S("S19-E2"), "The Tiers list shows."), R(S("S19-E2"), "The New Tier page opens."), R(S("S19-E2"), "The name shows."), R(S("S19-E2"), "The second session renames tier A."),
   R(S("S19-E2", "When the save became invalid (a matrix or tier name now taken, a category moved to another matrix, a tier archived), the page shows the reason inline, naming the conflict."),
     "The tier is not created: the page shows inline that the name is taken.", "The typed name is still in the field.")],
  pics=["2.13"])

C("S19-23", K, "Saving one matrix tab never makes the other tab's save stale",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing on and Default on Markup % 50 on both sides"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 60 in Default's first range.", SAVE, "Click the Part Sale Matrix tab.", EDIT, "Type 40 in Default's first range.", SAVE],
  [R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens."), R(S("S3-R18"), "The Work Order grid is in edit."), R(S("S3-R18"), "Default reads 60."),
   R(S("S3-R18"), "The Work Order grid saves."), R(S("S3-R21"), "The Part Sale grid shows."), R(S("S3-R18"), "The Part Sale grid is in edit."), R(S("S3-R18"), "Default reads 40."),
   R([S("S19-E2", "If someone else saved first, the second save is refused and nothing is saved."), QT("One side per request, so each tab saves on its own", "TPX-15")],
     "The Part Sale grid saves with 40.", "No \"was changed by someone else\" message shows.")],
  pics=["3.19"])
