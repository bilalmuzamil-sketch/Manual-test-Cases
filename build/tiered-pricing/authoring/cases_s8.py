"""Story 8 — Categories over time (SV-12460), PRD v37 lines 565-595, design page 8 (8.1-8.12). Batch A, 14 Nov 2026.
New Category's buttons follow the PRD ("Save and Cancel"; the design writes "Create Category", held on Q19). The delete question follows the
PRD's full wording (the design drops one sentence, held on Q20). Category reports for past periods (S8-E1) are the reports batch's cases."""
from tp_lib import C, R, B, S, QP, QD, QL
from common import *

K = "S8"
CAT_ROW = "Click category A's row."
WO = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — Create & Edit', 'Work Orders — Order Parts' "
      "and 'Work Order Lines — Create & Edit'.")


def mxa(extra=""):
    return matrix("A", ", with one range from $0.00 and Default on Markup % 50" + extra)


C("S8-01", K, "Renaming a category keeps it on the same matrix",
  [ADMIN, category("A", ", on matrix A"), mxa(", pricing category A"), DESK],
  [CATEGORIES, CAT_ROW, "Click the category name at the top of the page.", "Type a new name no other category uses.", "Press Enter.", CATEGORIES],
  [R(S("S8-R1"), "Category A is listed on matrix A."), R(S("S7-R6"), "Category A's page opens."), R(S("S7-R6", "renamed in place"), "The name becomes editable."),
   R(S("S8-R1"), "The new name shows in the field."), R(S("S7-R12"), "The title shows the new name."),
   R(S("S8-R1", "Renaming a category keeps it on the same matrix under the new name."), "The category is listed under its new name.", "Its Pricing Matrix cell still reads matrix A.")],
  pics=["7.8", "8.4"])

C("S8-02", K, "New Category opens a page with the General Matrix and its grid",
  [ADMIN, "Use a client connected to QuickBooks, so the QuickBooks Products and Services field shows.", DESK],
  [CATEGORIES, "Click New Category."],
  [R(S("S8-R10"), "The Categories list shows New Category."),
   R(S("S8-R10", "New Category on the Categories page opens a New Category page: a name, a Pricing Matrix (the General Matrix unless another is picked), QuickBooks Products and Services (only when QuickBooks is connected, as today) and Tax Exempt, with the matrix's grid, read-only."),
     "A New Category page opens, not a dialog.", "It shows a name field, a Pricing Matrix picker reading the General Matrix, QuickBooks Products and Services and Tax Exempt.",
     "Below them the General Matrix's grid shows read-only, with no Edit.")
   + R(S("S8-R10", "It has Save and Cancel"), "Save and Cancel show at the top right.")],
  pics=["8.5", "8.6"])

C("S8-03", K, "New Category creates nothing until Save, and Cancel creates nothing",
  [ADMIN, "Note the number of categories the Categories page shows (for example 17).", DESK],
  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", "Click Cancel.", "Click Discard Changes."],
  [R(S("S8-R10"), "The Categories list shows the noted count."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-R10"), "The name shows in the field."),
   R(S("S19-R3", "Leaving a matrix page, the New Category page or a grid in edit with unsaved changes asks \"Discard these changes?\" (Keep Editing / Discard Changes)."),
     "A question asks whether to discard the changes, with Keep Editing and Discard Changes."),
   R(S("S8-R10", "nothing is created until Save (S19-R14)"), "The Categories list shows again.", "The count is still the noted number (17 = 17) and the typed name is not listed.")],
  pics=["8.6"], flags=["numbers"])

C("S8-04", K, "A new category is priced for every tier from the start",
  [ADMIN, tier("A"), DESK],
  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE, CATEGORIES],
  [R(S("S8-R10"), "The Categories list shows."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-R10"), "The name shows in the field."),
   R(S("S8-R10", "It has Save and Cancel"), "The category is created and its page shows the General Matrix's grid."),
   R(S("S8-R10", "A new category is priced for every tier from the start."), "The new category's row shows General Matrix in Pricing Matrix.",
     "Its Default cell and every tier cell, tier A's included, show a rule or \"Uses previous tier\"; no cell is empty.")],
  pics=["8.8", "8.9"])

C("S8-05", K, "A new part starts in Uncategorized and a category change reprices it",
  [ADMIN, category("A", ", on matrix A"), mxa(", pricing category A"), DESK],
  ["Start a new inventory part from Parts › Inventory.", "Type 10 in the part's cost.", "Pick category A as the part's category."],
  [R(S("S8-R3", "Every new part starts in Uncategorized."), "The new part's category reads Uncategorized."),
   R(S("S8-R3"), "The cost reads $10.00."),
   R(S("S8-R3", "An advisor can change the category, which reprices the part (S11-R3)."),
     "The category reads category A.", "The sell price becomes $15.00, from matrix A ($10.00 × 1.50 = $15.00).")],
  nopic="no design board draws the inventory part form", flags=["numbers"])

C("S8-06", K, "Uncategorized's page is read-only with a link to the General Matrix",
  [ADMIN, DESK],
  [CATEGORIES, "Click Uncategorized's row.", "Point at the grayed Edit."],
  [R(S("S8-R4"), "Uncategorized is the first row, on the General Matrix."),
   R(S("S8-R4", "Its page is read-only, with no rename, Delete or matrix picker."), "Uncategorized's page opens with the General Matrix's grid.",
     "Its title cannot be clicked to rename it.", "The page offers no Delete and no Pricing Matrix picker.")
   + R(S("S8-R4", "Its Edit is grayed with a link to the General Matrix, like any category on a shared matrix (S7-R13)."), "Edit is grayed, with a \"Go to the General Matrix\" link beside it."),
   R(S("S7-R13", "\"The General Matrix prices <n> categories, …\""), "A tooltip starts \"Can't edit here. The General Matrix prices\".")],
  pics=["8.2", "8.3"])

C("S8-07", K, "Uncategorized cannot be moved to another matrix",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Open the Categories picker."],
  [R(S("S8-R4"), "Matrix A is listed."), R(S("S3-R13"), "Matrix A's page opens."), R(S("S3-R13"), "The page is in edit with a Categories picker."),
   R(S("S8-R4", "always uses the General Matrix; no action changes its matrix"), "The picker lists categories to add.", "Uncategorized is not in the list.")],
  pics=["3.23", "8.3"])

C("S8-08", K, "Delete asks first with the PRD's words and no counts",
  [ADMIN, category("A", ", with a part in the inventory"), DESK],
  [CATEGORIES, CAT_ROW, "Open the page's three-dot menu.", "Click Delete.", "Click Cancel."],
  [R(S("S8-R8"), "Category A is listed."), R(S("S8-R8"), "Category A's page opens."), R(S("S8-R8", "Delete, on the category's page"), "The menu lists Delete."),
   R(S("S8-R8", "It asks \"Delete <category>?\""), "A question titled \"Delete\", category A's name and \"?\" opens.")
   + R(S("S8-R8", "with \"Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. Invoices already sent aren't sent again; one synced again later books these parts to Uncategorized's QuickBooks item. This can't be undone.\""),
       "It reads \"Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. Invoices already sent aren't sent again; one synced again later books these parts to Uncategorized's QuickBooks item. This can't be undone.\"")
   + R(S("S8-R8", "and Cancel / Delete (red), with no counts"), "The buttons are Cancel and a red Delete.", "No count of parts or lines is shown."),
   R(S("S8-R8", "now Delete, on the category's page, asks first instead"), "The question closes.", "Category A's page still shows.")],
  pics=["8.10", "8.11"])

C("S8-09", K, "Deleting a category that parts use moves them to Uncategorized",
  [ADMIN, category("A", ", on matrix A, with a part in the inventory, part A, so the delete is one that today is blocked"), mxa(", pricing category A and no other"), DESK],
  [CATEGORIES, CAT_ROW, "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", MATRICES],
  [R(S("S8-R8"), "Category A is listed."), R(S("S8-R8"), "Category A's page opens."), R(S("S8-R8"), "The menu lists Delete."), R(S("S8-R8"), "The delete question opens."),
   R(S("S8-R8", "nothing blocks deleting a category other than Uncategorized"), "The delete is not blocked: today's \"Category cannot be deleted. It is used in one or more products.\" does not show.",
     "The Categories list shows without category A.")
   + R(S("S8-E1", "If a category is deleted, every part in it moves to Uncategorized, as today"), "In the inventory, part A's category reads Uncategorized."),
   R(S("S8-R8", "its matrix stays in the library"), "Matrix A is still listed.")
   + R(S("S8-E1", "A matrix left with no category stays in the library and prices nothing."), "Matrix A's Status reads Inactive and its Categories cell shows \"—\".")],
  pics=["8.11", "8.12"])

C("S8-10", K, "Deleting a category moves work order lines but changes no price",
  [WO, category("A", ", on matrix A"), mxa(", pricing category A"), customer("A", ", on Default for work orders"),
   "Have a new work order for this test, work order 1, for customer A, with a part line of category A at a cost of $10.00 (sold at $15.00).",
   "Have a new work order for this test, work order 2, for customer A, with the same kind of part line, invoiced.", DESK],
  [CATEGORIES, CAT_ROW, "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", "Open work order 1.", "Open work order 2.",
   "Change the cost of work order 1's part line to 20.", MATRICES, "Click the General Matrix's name.", "Type 20 in the Price Part Simulator's Part Cost."],
  [R(S("S8-R8"), "Category A is listed."), R(S("S8-R8"), "Category A's page opens."), R(S("S8-R8"), "The menu lists Delete."), R(S("S8-R8"), "The delete question opens."),
   R(S("S8-R8"), "Category A is deleted."),
   R(S("S8-E1", "work order and Part Sale lines (invoiced ones included)"), "Work order 1's part line shows category Uncategorized.")
   + R(S("S8-E2", "Deleting a category changes no price."), "Its sell price still reads $15.00 ($10.00 × 1.50 = $15.00, priced by matrix A before the delete)."),
   R(S("S8-E1", "work order and Part Sale lines (invoiced ones included)"), "Work order 2's invoiced part line also shows Uncategorized.",
     "Its sell price still reads $15.00."),
   R(S("S8-E2", "A moved part is priced by the General Matrix only the next time it is repriced (its cost or category changes)."),
     "Work order 1's line is repriced: its sell price changes from $15.00.", "It does not read $30.00, matrix A's price for $20.00 ($20.00 × 1.50 = $30.00)."),
   R(S("S6-R8"), "The Matrices list shows the General Matrix first."), R(S("S5-R1"), "The General Matrix's page opens."),
   R(S("S8-R8", "priced by the General Matrix from their next reprice"), "Default's simulator price for $20.00 equals work order 1's new sell price (customer A is on Default).")],
  nopic="no design board draws a work order after a category delete", flags=["numbers"])

C("S8-11", K, "Deleting a category moves Part Sale lines and canned line parts",
  [ADMIN, category("A"), customer("A"),
   "Have a new Part Sale for this test, Part Sale 1, for customer A, with a part line of category A.",
   "Have a new canned line for this test with a part of category A.", DESK],
  [CATEGORIES, CAT_ROW, "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", "Open Part Sale 1.", "Open the canned line made for this test."],
  [R(S("S8-R8"), "Category A is listed."), R(S("S8-R8"), "Category A's page opens."), R(S("S8-R8"), "The menu lists Delete."), R(S("S8-R8"), "The delete question opens."),
   R(S("S8-R8"), "Category A is deleted."),
   R(S("S8-E1", "work order and Part Sale lines (invoiced ones included)"), "Part Sale 1's part line shows category Uncategorized.", "Its sell price is the same as before the delete."),
   R(S("S8-E1", "canned line parts"), "The canned line's part shows category Uncategorized.", "The part is still on the canned line.")],
  nopic="no design board draws a Part Sale or canned line after a category delete")

C("S8-12", K, "Category names are unique ignoring capitals and need 3 characters",
  [ADMIN, category("A", ", named for example Wheel Seals"), category("B", ", named for example Brake Pads"), DESK],
  [CATEGORIES, "Click category B's row.", "Click the category name at the top of the page.", "Type category A's name in capitals (for example WHEEL SEALS).", "Press Enter.",
   CATEGORIES, "Click New Category.", "Type ab.", SAVE],
  [R(S("S8-N3"), "Category B is listed."), R(S("S7-R6"), "Category B's page opens."), R(S("S7-R6"), "The name becomes editable."), R(S("S8-N3"), "The typed name shows."),
   R(S("S8-N3", "Category names are unique, ignoring capitals: \"A category called <name> already exists\""),
     "An error reads \"A category called\", the typed name, \"already exists\".", "Category B keeps its own name."),
   R(S("S8-N3"), "The Categories list shows category B under its own name."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-N3"), "The field reads ab."),
   R(S("S8-N3", "They need at least 3 characters, as today."), "The category is not created: an error shows on the name field.", "The New Category page stays open with ab in the field.")],
  pics=["8.4", "8.7"])
