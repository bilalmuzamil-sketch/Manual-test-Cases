"""Story 3 — Matrices and rules (SV-11695; covers SV-7857 and SV-9492), PRD v37 lines 351-410, design page 3 (3.1-3.29), tech plan rows
TPX-12 and TPX-14. The grid itself is Story 4. The timing half of S3-R13 (when a category picked on an existing matrix moves) is held on Q6."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, HOLD
from common import *

K = "S3"
PRE_REL = HOLD("needs a matrix set up on staging before the Tiered Pricing release is deployed there; run on staging after the deploy")
WO = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Work Orders — Order Parts' and "
      "'Work Order Lines — Create & Edit'.")

C("S3-01", K, "A matrix opens as a page from the Matrices list, in view",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES, open_matrix("A")],
  [R(S("S3-R18"), "Matrix A is listed."),
   R(S("S3-R18", "A matrix opens as a page, never a dialog, from every entry point"), "Matrix A opens as a page, not a dialog.")
   + R(S("S3-R25", "Clicking a matrix's name on the Matrices list opens its page in view."), "The grid is in view: it shows Edit, and no cell can be typed in.")
   + R(S("S3-R18", "Its title is the matrix name"), "The page title is matrix A's name.")
   + R(S("S3-R18", "Under the title, a Categories line shows the categories it prices"), "Under the title a Categories line names category A.")
   + R(S("S3-R18", "The page has two tabs, Work Order Matrix and Part Sale Matrix, each holding the tier grid (Story 4) and, under it, the Price Part Simulator (Story 5)."),
       "The page has two tabs, Work Order Matrix and Part Sale Matrix.", "Under the grid shows the Price Part Simulator.")
   + R(S("S3-R26", "Settings › Pricing › Matrices › <matrix>"), "The breadcrumb reads Settings › Pricing › Matrices › matrix A's name, with no separate Back link.")],
  pics=["3.1", "3.2"])

C("S3-02", K, "A matrix opened from a category shows the category in the breadcrumb",
  [ADMIN, category("A", ", priced by a new matrix made for this test, matrix A"), DESK],
  [CATEGORIES, "Click category A.", "Click matrix A's name on category A's page."],
  [R(S("S3-R18"), "Category A is listed."), R(S("S3-R18"), "Category A's page opens."),
   R(S("S3-R18", "A matrix opens as a page, never a dialog, from every entry point: the Matrices list, a tier's page and a category's page."), "Matrix A's page opens, not a dialog.")
   + R(S("S3-R26", "Settings › Categories › <category> › <matrix> from a category (Uncategorized included)"), "The breadcrumb reads Settings › Categories › category A's name › matrix A's name.")],
  pics=["7.8"])

C("S3-03", K, "The General Matrix opened from Uncategorized shows that breadcrumb",
  [ADMIN, DESK],
  [CATEGORIES, "Click Uncategorized.", "Click General Matrix on Uncategorized's page."],
  [R(S("S3-R26"), "Uncategorized is listed."), R(S("S3-R26"), "Uncategorized's page opens."),
   R(S("S3-R26", "Settings › Categories › <category> › <matrix> from a category (Uncategorized included)"), "The General Matrix page opens.",
     "The breadcrumb reads Settings › Categories › Uncategorized › General Matrix.")],
  pics=["8.2", "8.3"])

C("S3-04", K, "Edit on the Matrices list opens the matrix already in edit",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, "Click the pencil (Edit) on matrix A's row."],
  [R(S("S3-R25"), "Matrix A is listed with a pencil and a three-dot button."),
   R(S("S3-R25", "Edit on the Matrices list, on a tier's page, or on a category's page whose matrix prices only that category (S7-R13) opens it already in edit."),
     "Matrix A's page opens with the grid in edit: the edit bar with Cancel and Save shows and the cells can be typed in.")],
  pics=["3.1", "4.6"])

C("S3-05", K, "A matrix opened from a bookmark shows the Matrices breadcrumb",
  [ADMIN, tier("A"), matrix("A"), "Have matrix A's page opened from tier A's page and its address bookmarked.", DESK],
  ["Open the bookmark in a new browser tab."],
  [R(S("S3-R26", "Opened from a link or bookmark, the breadcrumb is Settings › Pricing › Matrices › <matrix>."), "Matrix A's page opens.",
     "The breadcrumb reads Settings › Pricing › Matrices › matrix A's name, not the tier path.")],
  pics=["3.2", "2.46"])

C("S3-06", K, "A matrix is renamed in place and saves when the field loses focus",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, open_matrix("A"), "Click matrix A's name at the top of the page.", "Type a new name of at least 3 characters no other matrix uses.", "Click outside the name field.", RELOAD],
  [R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens in view."),
   R(S("S3-R18", "Its title is the matrix name, renamed in place"), "The title turns into a name field."), R(S("S3-R18"), "The field shows the new name."),
   R(S("S3-R18", "the name saves as soon as the field loses focus, apart from the grid"), "The title shows the new name; the grid stayed in view."),
   R(S("S3-R12", "Renaming, changing its categories and turning the Part Sale switch on save without asking"), "After the reload the title is the new name, and no question was asked.")],
  pics=["3.3", "3.4", "3.5"])

C("S3-07", K, "A blank, short, long or taken matrix name keeps the old name",
  [ADMIN, matrix("A"), matrix("B"), DESK],
  [MATRICES, open_matrix("A"), "Click matrix A's name.", "Clear the name.", "Click outside the name field.", "Click matrix A's name.", "Type ab.", "Click outside the name field.",
   "Click matrix A's name.", "Type matrix B's name.", "Click outside the name field.", "Click matrix A's name.", "Type a name of 128 characters.", "Click outside the name field."],
  [R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens."), R(S("S3-R18"), "The name can be edited."), R(S("S3-R18"), "The field is empty."),
   R(S("S3-R18", "a name that is blank, under 3 or over 127 characters, or taken shows the inline error and keeps the old name"), "An inline error shows under the name.", "The title keeps matrix A's name."),
   R(S("S3-R18"), "The name can be edited."), R(S("S3-R18"), "The field shows ab."),
   R(S("S3-R18", "under 3"), "An inline error shows and the title keeps matrix A's name."),
   R(S("S3-R18"), "The name can be edited."), R(S("S3-R18"), "The field shows matrix B's name."),
   R(S("S3-R18", "or taken shows the inline error and keeps the old name"), "An inline error shows and the title keeps matrix A's name."),
   R(S("S3-R18"), "The name can be edited."), R(S("S3-R18"), "The field shows the long name, or stops at 127 characters."),
   R(S("S3-R18", "over 127 characters"), "Either the field took at most 127 characters, or an inline error shows; the title keeps matrix A's name unless the 127-character name was saved.")],
  pics=["3.5"])

C("S3-08", K, "Cancel with changes asks first, then discards and returns to view",
  [ADMIN, matrix("A", ", whose Default first range is 40% markup"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 45 in Default's first range.", "Click Cancel.", "Click Keep Editing.", "Click Cancel.", "Click Discard Changes."],
  [R(S("S3-R25"), "Matrix A is listed."), R(S("S3-R25"), "Matrix A's page opens in view."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The edit bar counts 1 change."),
   R(S("S19-R3", "Leaving a matrix page, the New Category page or a grid in edit with unsaved changes asks \"Discard these changes?\" (Keep Editing / Discard Changes)."),
     "A dialog asks Discard These Changes? with Keep Editing and Discard Changes.")
   + R(S("S19-R9", "Every column title, modal header, page title, tab and button uses Title Case."), "The dialog title is in Title Case: \"Discard These Changes?\"."),
   R(S("S3-R25", "asking first only when something changed"), "The dialog closes; the grid is still in edit with 45 typed."),
   R(S("S19-R3"), "The same dialog opens again."),
   R(S("S3-R25", "Cancel discards every change and returns it to view"), "The grid is in view again and Default's first range reads 40% markup.")],
  pics=["4.22", "4.23"])

C("S3-09", K, "Cancel with no changes returns to view without asking",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click Cancel."],
  [R(S("S3-R25"), "Matrix A is listed."), R(S("S3-R25"), "Matrix A's page opens in view."), R(S("S4-R4"), "The grid is in edit and the bar reads \"No changes yet\"."),
   R(S("S3-R25", "asking first only when something changed"), "The grid returns to view at once.", "No question is asked.")],
  pics=["4.6", "3.2"])

C("S3-10", K, "Switching tabs with unsaved changes asks first",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing on"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", "Click the Part Sale Matrix tab.", "Click Keep Editing.", "Click the Part Sale Matrix tab.", "Click Discard Changes."],
  [R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens on the Work Order Matrix tab."), R(S("S3-R18", "Each tab has its own Edit, Save and Cancel."), "The Work Order grid is in edit."),
   R(S("S4-R4"), "The edit bar counts 1 change."),
   R(S("S3-R18", "Switching tabs with unsaved changes asks \"Discard these changes?\" with Keep Editing and Discard Changes."), "A dialog asks Discard These Changes? with Keep Editing and Discard Changes.")
   + R(QD("Your changes haven't been saved.", "3.16", "S3-R18"), "Its text reads \"Your changes haven't been saved.\""),
   R(S("S3-R18"), "The dialog closes and the Work Order Matrix tab stays open with the typed value."),
   R(S("S3-R18"), "The dialog opens again."),
   R(S("S3-R18"), "The Part Sale Matrix tab opens in view.")
   + R(S("S3-R18", "Each tab has its own Edit, Save and Cancel."), "Back on the Work Order Matrix tab the typed value is gone.")],
  pics=["3.16"])

C("S3-11", K, "Each matrix tab has its own Edit, Save and Cancel",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing on"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", EDIT, "Type a new value in Default's first range.", SAVE, "Click the Work Order Matrix tab."],
  [R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens."), R(S("S3-R21"), "The Part Sale grid shows with its own Edit button."),
   R(S("S3-R18", "Each tab has its own Edit, Save and Cancel."), "The Part Sale grid is in edit with its own Cancel and Save."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R12"), "The Part Sale grid saves and returns to view."),
   R(S("S3-R31", "prices only Part Sales"), "The Work Order grid opens in view.", "Default's first range there still has its earlier value, unchanged by the Part Sale save.")],
  pics=["3.19"])

C("S3-12", K, "Active and Inactive show as a badge on the list and gray text on the page",
  [ADMIN, matrix("A", ", pricing a new category made for this test"), matrix("B", ", with no category"), DESK],
  [MATRICES, open_matrix("A"), "Open matrix B's page from the Matrices list."],
  [R(S("S3-R28", "The Matrices list shows Active or Inactive as a badge"), "Matrix A shows an Active badge.", "Matrix B shows an Inactive badge."),
   R(S("S3-R28", "the matrix page shows Inactive as plain gray text beside the name and nothing when Active"), "Matrix A's title shows its name.", "Nothing shows beside the name."),
   R(S("S3-R28", "the matrix page shows Inactive as plain gray text beside the name"), "Matrix B's page shows Inactive as plain gray text beside the name.")
   + R(QD("Inactive: No categories use this matrix", "3.10", "S3-R28"), "The gray text reads \"Inactive: No categories use this matrix\".")],
  pics=["3.9", "3.10"])

C("S3-13", K, "Adding a category makes a matrix Active and removing it Inactive",
  [ADMIN, matrix("A", ", with no category"), category("A", ", on the General Matrix"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Pick category A in the Categories picker.", SAVE, MATRICES, open_matrix("A"), EDIT, "Untick category A in the Categories picker.", SAVE, MATRICES],
  [R(S("S3-R28"), "Matrix A shows Inactive."), R(S("S3-R28"), "Matrix A's page shows Inactive beside its name."), R(S("S3-R13"), "The Categories picker shows in edit."),
   R(S("S3-R13"), "Category A is ticked."), R(S("S3-R13"), "Matrix A saves."),
   R(S("S3-R28", "Adding a category makes it Active at once"), "Matrix A shows Active with category A in its Categories column."),
   R(S("S3-R28"), "Matrix A's title shows its name.", "Nothing shows beside the name (no Inactive text)."), R(S("S3-R13"), "The picker shows in edit."), R(S("S3-R13"), "Category A is unticked."), R(S("S3-R13"), "Matrix A saves."),
   R(S("S3-R28", "removing its last category makes it Inactive"), "Matrix A shows Inactive again.")
   + R(S("S3-R28", "keeps its rules"), "Its Work Order Matrix value is the same as before.")],
  pics=["3.9", "3.10", "3.11"], note="Whether the category moves when Save is clicked or as soon as the picker closes is asked separately; this test checks the state after Save.")

C("S3-14", K, "The Categories picker searches, selects all and shows each category's matrix",
  [ADMIN, matrix("A"), matrix("B", ", pricing a new category made for this test, category B"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Open the Categories picker.", "Type the first letters of category B's name in the picker's search."],
  [R(S("S3-R13"), "Matrix A is listed."), R(S("S3-R13"), "Matrix A's page opens."), R(S("S3-R13"), "The Categories picker shows."),
   R(S("S3-R13", "with a multi-select category picker with search and Select all"), "A list of categories opens with a search box, a Select all control and a checkbox per category.")
   + R(S("S3-R13", "Uncategorized isn't listed; it always uses the General Matrix."), "Uncategorized is not in the list, while the other categories are."),
   R(S("S3-R13", "A category on another matrix shows \"Now: <matrix>\" beside it"), "Category B is listed with \"Now:\" and matrix B's name beside it.")],
  pics=["3.23"])

C("S3-15", K, "Select all in the Categories picker ticks every listed category",
  [ADMIN, matrix("A", ", with no category"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Open the Categories picker.", "Click Select all."],
  [R(S("S3-R13"), "Matrix A is listed."), R(S("S3-R13"), "Matrix A's page opens."), R(S("S3-R13"), "The Categories picker shows."), R(S("S3-R13"), "The list opens with no category ticked."),
   R(S("S3-R13", "with a multi-select category picker with search and Select all"), "Every category in the list is ticked.", "Uncategorized is still not in the list.")],
  pics=["3.23"])

C("S3-16", K, "A category picked on New Matrix moves when the matrix is created",
  [ADMIN, category("A", ", priced by a new matrix made for this test, matrix B"), DESK],
  [MATRICES, "Click New Matrix.", "Type a name no other matrix uses.", "Pick category A in the Categories picker.", "Type 50 in Default's first range.", "Click Create Matrix.", CATEGORIES],
  [R(S("S3-R30"), "The Matrices list shows."), R(S("S3-R30"), "The New Matrix page opens in edit."), R(S("S3-R30"), "The name shows."),
   R(S("S3-R13", "A category on another matrix shows \"Now: <matrix>\" beside it"), "Category A was listed with \"Now:\" and matrix B's name, and is now ticked."),
   R(S("S3-R30"), "Default's first range reads 50."),
   R(S("S3-R13", "picking it moves it to this matrix when the matrix is saved"), "The new matrix is created and its Categories line names category A."),
   R(S("S3-R13"), "Category A's matrix now reads the new matrix, not matrix B.")],
  pics=["3.22", "3.23"])

C("S3-17", K, "A category picked on an existing matrix moves when the matrix is saved",
  [ADMIN, matrix("A"), category("A", ", priced by a new matrix made for this test, matrix B"), "Open Settings › Categories in a second browser tab.", DESK],
  [MATRICES, open_matrix("A"), EDIT, "Pick category A in the Categories picker.", "Close the picker.", "Reload category A's page in the second tab.", SAVE, "Reload category A's page in the second tab again."],
  [R(S("S3-R13"), "Matrix A is listed."), R(S("S3-R13"), "Matrix A's page opens."), R(S("S3-R13"), "The picker shows."), R(S("S3-R13"), "Category A is ticked."),
   R(S("S3-R13"), "The Categories line names category A."),
   R(S("S3-R13", "picking it moves it to this matrix when the matrix is saved"), "Category A's page still names matrix B (the move waits for Save)."),
   R(S("S3-R13"), "Matrix A saves."),
   R(S("S3-R13", "picking it moves it to this matrix when the matrix is saved"), "Category A's page now names matrix A.")],
  pics=["3.11", "3.23"], held_on="Q6")

C("S3-18", K, "A category removed from the line goes to the General Matrix on save",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), "Open Settings › Categories in a second browser tab.", DESK],
  [MATRICES, open_matrix("A"), EDIT, "Untick category A in the Categories picker.", "Close the picker.", "Reload category A's page in the second tab.", SAVE, "Reload category A's page in the second tab again."],
  [R(S("S3-R13"), "Matrix A is listed."), R(S("S3-R13"), "Matrix A's page opens."), R(S("S3-R13"), "The picker shows."), R(S("S3-R13"), "Category A is unticked."),
   R(S("S3-R13"), "The picker shows category A unticked.", "Category A is gone from the Categories line."),
   R(S("S3-R13", "A category removed from the line moves to the General Matrix when the matrix is saved."), "Category A's page still names matrix A."),
   R(S("S3-R13"), "Matrix A saves."),
   R(S("S3-R13", "A category removed from the line moves to the General Matrix when the matrix is saved."), "Category A's page now names the General Matrix.")],
  pics=["3.11"], held_on="Q6")

C("S3-19", K, "The General Matrix's categories cannot be picked",
  [ADMIN, DESK],
  [MATRICES, "Click the General Matrix's name.", EDIT],
  [R(S("S3-N4"), "The General Matrix is listed."),
   R(S("S3-R18", "the General Matrix's reads \"All categories without a matrix (n)\""), "The Categories line reads \"All categories without a matrix\" with a count."),
   R(S("S3-N4", "The General Matrix's categories can't be picked: it always prices every category without a matrix of its own."),
     "The grid is in edit.", "The Categories line stays text: no category picker is offered.")],
  pics=["3.14"])

C("S3-20", K, "Tier columns can mix % Off, + $, Margin % and Markup %",
  [ADMIN, tier("A"), tier("B"), tier("C"), matrix("A", ", one range, Default 50% markup, tier A 10% off, tier B Cost + $5, tier C 30% margin"), DESK],
  [MATRICES, open_matrix("A"), "Type 100 in the Price Part Simulator's Part Cost."],
  [R(S("S3-R5"), "Matrix A is listed."),
   R(S("S3-R5", "A column picks its rule type once (S4-R5), so a matrix can mix calculations across its columns."),
     "Default reads 50% markup, tier A 10% off, tier B Cost + $5 and tier C 30% margin, side by side."),
   R(S("S3-R5", "% Off (a percent off Default's sell price)"), "Default shows $150.00 ($100.00 × 1.50) and tier A $135.00 ($150.00 × 0.90).")
   + R(S("S3-R5", "+ $ (cost plus a dollar amount per unit)"), "Tier B shows $105.00 ($100.00 + $5.00).")
   + R(QP("margin is a share of the sell price, markup a share of cost: on a part costing 10, 30% markup sells at 13 and 30% margin at 14.29", "S3-R5"),
       "Tier C shows $142.86 ($100.00 ÷ (1 − 0.30), rounded to the cent).")],
  pics=["4.4", "5.1"], flags=["numbers"])

C("S3-21", K, "Add Range, removing a range and moving an end change every column",
  [ADMIN, tier("A"), matrix("A", ", two ranges ($0.00 to $100.00 and $100.01 and up), Default 40% markup and 30% markup, tier A 10% off and 5% off"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Change the first range's end to 150.", "Click Add Range."],
  [R(S("S3-R20"), "Matrix A is listed."), R(S("S3-R20"), "The grid shows two ranges for every column."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R20", "A matrix side has one set of cost ranges, shared by Default and every tier column."), "The second range now starts at $150.01 for Default and for tier A alike.")
   + R(S("S3-R20", "% Off and $ Off keep each range's value with its range."), "Tier A keeps 10% off in the first range and 5% off in the second."),
   R(S("S3-R20", "Add Range, removing a range and changing a range's end change the ranges for every column"), "A third range appears in every column at once, Default and tier A alike.")],
  pics=["4.19", "4.20"])

C("S3-22", K, "Save is blocked for a bad range end, an empty value and three decimals",
  [ADMIN, matrix("A", ", two ranges ($0.00 to $100.00 and $100.01 and up), Default 40% markup in both"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Change the first range's end to 0.", SAVE, "Change the first range's end back to 100.", "Clear Default's first range value.", SAVE,
   "Type 12.345 in Default's first range.", SAVE],
  [R(S("S3-R6"), "Matrix A is listed."), R(S("S3-R6"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."), R(S("S3-R16"), "The first range ends at 0."),
   R(S("S3-R6", "a range's end isn't above its start (\"Enter an end above <start>\")"), "The save is refused and the range end is highlighted.", "The message reads \"Enter an end above $0.00\" or names the start $0.00 the same way."),
   R(S("S3-R16"), "The first range ends at 100 again."), R(S("S3-R6"), "The cell is empty."),
   R(S("S3-R6", "a value is empty, a Default cell included (\"Enter a value\")"), "The save is refused, the empty cell is highlighted and the message reads \"Enter a value\"."),
   R(S("S3-R6"), "The cell reads 12.345."),
   R(S("S3-R6", "a value has more than two decimals (\"Use at most two decimals\")"), "The save is refused, the cell is highlighted and the message reads \"Use at most two decimals\"."
     ) + R(S("S3-R6", "Save is blocked, with the cells highlighted and a message naming them"), "The grid stays in edit with what was typed.")],
  pics=["4.18", "3.15"])

C("S3-23", K, "Save is blocked for a margin of 100 and a % Off over 99.99",
  [ADMIN, tier("A"), matrix("A", ", Default on Margin % 30, tier A on % Off 10"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 100 in Default's first range.", SAVE, "Type 30 in Default's first range.", "Type 120 in tier A's first range.", SAVE],
  [R(S("S3-R6"), "Matrix A is listed."), R(S("S3-R6"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."), R(S("S3-R6"), "The cell reads 100."),
   R(S("S3-R6", "a margin is 100% or more (\"Enter a margin from 0 to 99.99\"); today's editor converts one silently"),
     "The save is refused, the cell is highlighted and the message includes \"Enter a margin from 0 to 99.99\".", "The 100 is not changed into another value."),
   R(S("S3-R6"), "The cell reads 30."), R(S("S3-R6"), "The tier A cell reads 120."),
   R(S("S3-R6", "a % Off isn't from 0 to 99.99 (\"Enter a % from 0 to 99.99\")"), "The save is refused, the cell is highlighted and the message reads \"Enter a % from 0 to 99.99\".")],
  pics=["4.18", "3.15"])

C("S3-24", K, "Save is blocked for a negative $ Off, naming the tier",
  [ADMIN, tier("A"), matrix("A", ", tier A on $ Off 5"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type -1 in tier A's first range.", SAVE],
  [R(S("S3-R6"), "Matrix A is listed."), R(S("S3-R6"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."), R(S("S3-R6"), "The cell shows -1, or the field refuses the minus sign."),
   R(S("S3-R6", "a $ Off is below $0.00 (\"<tier>: enter $0.00 or more in every range.\")"),
     "The save is refused and the cell is highlighted; the message reads tier A's name followed by \": enter $0.00 or more in every range.\" (or the minus sign was refused and the value is 1).")],
  pics=["4.18"])

C("S3-25", K, "Save is blocked for a blank, short or taken new matrix name",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, "Click New Matrix.", "Type 50 in Default's first range.", "Click Create Matrix.", "Type ab in the name.", "Click Create Matrix.", "Replace the name with matrix A's name in capitals.", "Click Create Matrix."],
  [R(S("S3-R30"), "The Matrices list shows."), R(S("S3-R30"), "The New Matrix page opens with an empty name."), R(S("S3-R30"), "Default's first range reads 50."),
   R(S("S3-R6", "a new matrix's name is empty, under 3 or over 127 characters, as today, or another matrix has it, ignoring case (an inline error under the name)"),
     "An inline error shows under the name.", "The page stays on New Matrix with Create Matrix showing; no matrix is created.") + R(QD("Matrix name is a required field", "3.24", "S3-R6"), "It reads \"Matrix name is a required field\"."),
   R(S("S3-R30"), "The name shows ab."),
   R(S("S3-R6", "under 3"), "An inline error shows under the name.", "The page stays on New Matrix with Create Matrix showing; no matrix is created."),
   R(S("S3-R30"), "The name shows in capitals."),
   R(S("S3-R6", "or another matrix has it, ignoring case (an inline error under the name)"), "An inline error shows under the name.", "The page stays on New Matrix with Create Matrix showing; no matrix is created.")],
  pics=["3.24", "3.25"])

C("S3-26", K, "Zero markup, margin, plus, % off and $ off are allowed",
  [ADMIN, tier("A"), tier("B"), matrix("A", ", one range, Default Markup % 50, tier A % Off 10, tier B $ Off 5"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 0 in Default's first range.", "Type 0 in tier A's first range.", "Type 0 in tier B's first range.", SAVE, "Type 100 in the Price Part Simulator's Part Cost."],
  [R(S("S3-R6"), "Matrix A is listed."), R(S("S3-R6"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R6"), "Default reads 0."), R(S("S3-R6"), "Tier A reads 0."), R(S("S3-R6"), "Tier B reads 0."),
   R(S("S3-R6", "0% markup or margin, + $0.00, 0% off and $0.00 off are allowed; they sell at the base price."), "The grid saves with no error and returns to view."),
   R(S("S3-R6", "they sell at the base price"), "Default shows $100.00 ($100.00 × 1.00).", "Tier A and tier B show $100.00 (Default's $100.00 − 0% and − $0.00).")],
  pics=["4.6", "5.1"], flags=["numbers"])

C("S3-27", K, "Ranges are entered by their end and the last range has no end",
  [ADMIN, matrix("A", ", one range"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click Add Range.", "Type 25 as the first range's end."],
  [R(S("S3-R16"), "Matrix A is listed."), R(S("S3-R16", "The first range starts at $0.00"), "The single range reads from $0.00 and up."),
   R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R16", "Add Range adds a range before the last one."), "A new range is added before the last one; there are now two ranges."),
   R(S("S3-R16", "each later range starts $0.01 above the end of the range before it (\"$25.01 to [end]\"), so ranges never overlap or leave a gap"),
     "The first range reads $0.00 to 25.", "The next range starts at $25.01 ($25.00 + $0.01).")
   + R(S("S3-R16", "The last range has no end (\"$10,000.01 and up\") and can't be removed."), "The last range has no end box, reads \"and up\" and has no delete button.")],
  pics=["4.19", "4.20"], flags=["numbers"])

C("S3-28", K, "Removing a range merges it into the range above",
  [ADMIN, matrix("A", ", three ranges: $0.00 to $100.00, $100.01 to $10,000.00, $10,000.01 and up"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Point at the second range's delete button.", "Click the second range's delete button."],
  [R(S("S3-R32"), "Matrix A is listed."), R(S("S3-R32"), "The grid shows three ranges."),
   R(S("S3-R32", "Each range except the last has a delete button at its left"), "Delete buttons show at the left of the first and second rows, lined up down the grid.", "The last range ($10,000.01 and up) has no delete button."),
   R(S("S3-R32", "(tooltip \"Remove this range\")"), "A tooltip reads \"Remove this range\"."),
   R(S("S3-R32", "Removing a range merges it into the range above, which takes its end."), "Two ranges remain: the first now reads $0.00 to 10000 and the last starts at $10,000.01.")],
  pics=["4.21"])

C("S3-29", K, "The last range follows the range above until edited",
  [ADMIN, tier("A"), matrix("A", ", two ranges, Default 40% markup in both, tier A 10% off in both"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Point at Default's last range.", "Type 45 in Default's first range.", "Type 30 in Default's last range.", SAVE, MATRICES, open_matrix("A"), EDIT,
   "Type 45 in Default's last range."],
  [R(S("S3-R23"), "Matrix A is listed."), R(S("S3-R23"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R23", "Its tooltip reads \"Same as the rule above\"."), "A tooltip reads \"Same as the rule above\"."),
   R(S("S3-R23", "In every column, the last range copies the calculation and value of the range above it, and follows it when that range changes"), "Default's last range now reads 45 as well."),
   R(S("S3-R23", "Editing the last range to a different calculation or value makes it its own rule"), "Default's last range reads 30."),
   R(S("S4-R12"), "Matrix A saves."), R(S("S3-R23"), "Matrix A is listed."),
   R(S("S3-R23", "kept when the matrix is saved and reopened"), "Default reads 45% markup in the first range and 30% markup in the last."),
   R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R23", "editing it back to match makes it follow again"), "Default's last range matches the range above again (45) and shows the \"Same as the rule above\" tooltip.")],
  pics=["4.6", "4.7"])

C("S3-30", K, "A one-range matrix has no rule above to follow",
  [ADMIN, matrix("A", ", one range"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Point at Default's only range."],
  [R(S("S3-R23"), "Matrix A is listed."), R(S("S3-R23"), "Matrix A's page opens with one range."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R23", "In a matrix with one range, that range has no rule above it to follow."), "The range shows its own value.", "No \"Same as the rule above\" tooltip shows.")],
  pics=["3.22"])

C("S3-31", K, "New Matrix opens in edit with one empty range and tiers on previous tier",
  [ADMIN, "Note how many matrices the Matrices tab label shows (for example 7).", DESK],
  [MATRICES, "Click New Matrix.", "Click Cancel."],
  [R(S("S3-R30"), "The Matrices list shows 7 matrices."),
   R(S("S3-R30", "A new matrix opens in edit with an empty name, one range from $0.00 with an empty Default cell, and every tier on Same as previous tier."),
     "The page opens in edit with an empty name field.", "The grid has one range from $0.00 with an empty Default cell.", "Every tier column's picker reads Previous tier.")
   + R(S("S4-R4", "A new matrix has Cancel and Create Matrix in the page head instead."), "Cancel and Create Matrix show in the page head, and no edit bar."),
   R(S("S3-R30", "Nothing is created until Save."), "The Matrices list shows again with 7 matrices (7 = 7).")
   + R(S("S19-R14", "Every create flow (New Tier, New Matrix, New Category) can be cancelled before it is saved, and cancelling creates nothing."), "No new matrix was added.")],
  pics=["3.21", "3.22"], flags=["numbers"])

C("S3-32", K, "Part Sale tab is off by default and shows only the switch",
  [WO, matrix("A", ", pricing a new category made for this test, category A, Default 50% markup, Separate Part Sale pricing off"), "Have a new Part Sale for this test, Part Sale 1, for a customer on Default."],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", "Point at the info icon beside the switch.", "Open Part Sale 1.", "Add a part with a cost of $100.00 in category A."],
  [R(S("S3-R21"), "Matrix A is listed."), R(S("S3-R21"), "Matrix A's page opens."),
   R(S("S3-R21", "The Part Sale Matrix tab has a \"Separate Part Sale pricing\" switch, off by default."), "The tab shows the \"Separate Part Sale pricing\" switch, off.")
   + R(S("S3-R21", "Off, the tab shows only the switch and an info-icon tooltip saying Part Sales use the work order prices, with no grid and no Edit"), "No grid and no Edit button show, while the switch and its info icon do."),
   R(S("S3-R21", "an info-icon tooltip saying Part Sales use the work order prices"), "The tooltip says Part Sales use the work order prices."),
   R(S("S3-R21"), "Part Sale 1 opens."),
   R(S("S3-R21", "Part Sales of this matrix's categories are priced by its Work Order Matrix."), "The part is priced by the Work Order Matrix: $100.00 × 1.50 = $150.00.")],
  pics=["3.17", "13.3"], flags=["numbers"])

C("S3-33", K, "Turning on Part Sale pricing saves at once as a copy",
  [WO, tier("A"), matrix("A", ", pricing a new category made for this test, category A, Default 50% markup, tier A 10% off, Separate Part Sale pricing off"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", "Switch Separate Part Sale pricing on.", RELOAD],
  [R(S("S3-R31"), "Matrix A is listed."), R(S("S3-R31"), "Matrix A's page opens."), R(S("S3-R21"), "The switch is off."),
   R(S("S3-R31", "Switching it on saves at once: the Part Sale side starts as a copy of the Work Order Matrix's current rules, every tier column included"),
     "A Part Sale grid shows with Default 50% markup and tier A 10% off, the same as the Work Order Matrix.", "No Save was needed and no question was asked.")
   + R(QD("It starts as a copy of the work order prices. Click Edit to change them.", "3.18", "S3-R31"), "A message reads \"Separate Part Sale pricing on\" with \"It starts as a copy of the work order prices. Click Edit to change them.\""),
   R(S("S3-R31", "Switching it on saves at once"), "After the reload the switch is still on and the Part Sale grid shows.")],
  pics=["3.17", "3.18"])

C("S3-34", K, "The Part Sale side prices only Part Sales",
  [WO, matrix("A", ", pricing a new category made for this test, category A, Default 50% markup on both sides, Separate Part Sale pricing on"), "Have a new customer for this test, customer A, on Default.",
   "Have a new work order for this test, work order 1, for customer A.", "Have a new Part Sale for this test, Part Sale 1, for customer A."],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", EDIT, "Type 20 in Default's first range.", SAVE, "Open work order 1.", "Add a part with a cost of $100.00 in category A.", "Open Part Sale 1.",
   "Add a part with a cost of $100.00 in category A."],
  [R(S("S3-R31"), "Matrix A is listed."), R(S("S3-R31"), "Matrix A's page opens."), R(S("S3-R31"), "The Part Sale grid shows."), R(S("S4-R4"), "The Part Sale grid is in edit."),
   R(S("S4-R26"), "Default's first range reads 20."), R(S("S4-R12"), "The Part Sale grid saves."), R(S("S3-R31"), "Work order 1 opens."),
   R(S("S3-R31", "and prices only Part Sales"), "The work order line is priced by the Work Order Matrix: $100.00 × 1.50 = $150.00."),
   R(S("S3-R31"), "Part Sale 1 opens."),
   R(S("S3-R31", "and prices only Part Sales"), "The Part Sale line is priced by the Part Sale side: $100.00 × 1.20 = $120.00.")],
  pics=["3.19", "13.3"], flags=["numbers"])

C("S3-35", K, "Turning Part Sale pricing off asks first and deletes its rules",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing on and its own Part Sale Default 20% markup, Work Order Default 50% markup"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", "Switch Separate Part Sale pricing off.", "Click Cancel.", "Switch Separate Part Sale pricing off.", "Click Turn Off.",
   "Switch Separate Part Sale pricing on."],
  [R(S("S3-R27"), "Matrix A is listed."), R(S("S3-R27"), "Matrix A's page opens."), R(S("S3-R27"), "The Part Sale grid shows Default 20% markup."),
   R(S("S3-R27", "Switching it off asks first: \"Turn Off Part Sale Pricing?\" with \"Turning off the separate Part Sale matrix will revert the pricing to the work order matrix.\" and Cancel / Turn Off."),
     "A dialog titled \"Turn Off Part Sale Pricing?\" reads \"Turning off the separate Part Sale matrix will revert the pricing to the work order matrix.\" with Cancel and Turn Off."),
   R(S("S3-R27"), "The dialog closes; the switch is still on and the grid still reads 20% markup."),
   R(S("S3-R27"), "The same dialog opens."),
   R(S("S3-R27", "On confirm the Part Sale rules are deleted."), "The switch is off and the tab shows no grid."),
   R(S("S3-R31", "Switched off and on again, it starts as a fresh copy; the deleted rules don't come back."), "The Part Sale grid shows Default 50% markup, copied from the Work Order Matrix, not 20%.")],
  pics=["3.19", "3.20", "3.17", "3.18"])

C("S3-36", K, "The Part Sale switch is disabled while its grid is in edit",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing on"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", EDIT, "Click the Separate Part Sale pricing switch."],
  [R(S("S3-R21"), "Matrix A is listed."), R(S("S3-R21"), "Matrix A's page opens."), R(S("S3-R21"), "The switch is on and the Part Sale grid shows with Edit."),
   R(S("S3-R21"), "The Part Sale grid is in edit."),
   R(QT("The Part Sale switch is disabled only while the Part Sale tab's own grid is in edit", "TPX-14"), "The switch is disabled: it stays on and no question opens, while the grid stays in edit.")],
  pics=["3.19"])

C("S3-37", K, "Duplicate makes a copy with the same rules and no categories",
  [ADMIN, tier("A"), matrix("A", ", pricing a new category made for this test, category A, Default 40% margin, tier A 5% off, Separate Part Sale pricing on with Default 30% markup"), DESK],
  [MATRICES, "Open matrix A's three-dot menu.", "Click Duplicate.", MATRICES, "Open matrix A's three-dot menu.", "Click Duplicate.", MATRICES],
  [R(S("S3-R8"), "Matrix A is listed."), R(S("S3-R8"), "The menu offers Duplicate and Delete."),
   R(S("S3-R8", "Duplicate makes \"<name> (copy)\""), "A matrix named matrix A's name followed by \" (copy)\" opens on its page.")
   + R(S("S3-R8", "with the same rules on both sides and every tier column, and no categories"), "Its grid has Default 40% margin and tier A 5% off.", "Its Part Sale side is on with Default 30% markup.", "Its Categories line names no category."),
   R(S("S3-R8", "in the library"), "The Matrices list shows the copy."), R(S("S3-R8"), "The menu offers Duplicate."),
   R(S("S3-R8", "or \"(copy 2)\" and so on when that name is taken"), "The second copy is named matrix A's name followed by \" (copy 2)\"."),
   R(S("S3-R8"), "The list shows matrix A, its (copy) and its (copy 2); category A is still on matrix A.")],
  pics=["3.26", "3.27"])

C("S3-38", K, "A duplicated matrix has no tie to the matrix it came from",
  [ADMIN, matrix("A", ", Default 40% margin in every range"), "Have a copy of matrix A made with Duplicate for this test (matrix A (copy))."],
  [MATRICES, open_matrix("A"), EDIT, "Type 45 in Default's first range.", SAVE, "Open matrix A (copy) from the Matrices list."],
  [R(S("S3-R8"), "Matrix A is listed."), R(S("S3-R8"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R26"), "Default's first range reads 45."),
   R(S("S4-R12"), "Matrix A saves."),
   R(S("S3-R8", "It has no tie to the matrix it came from."), "The copy's Default first range still reads 40% margin, not 45.")],
  pics=["3.27"])

C("S3-39", K, "Deleting a matrix names its categories and moves them to the General Matrix",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES, "Open matrix A's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", CATEGORIES],
  [R(S("S3-R9"), "Matrix A is listed."), R(S("S3-R9"), "The menu offers Delete."),
   R(S("S3-R9", "Deleting a matrix asks first, naming the categories it prices."), "A dialog titled \"Delete\" with matrix A's name opens and names category A.")
   + R(QD("Parts already on work orders keep their prices.", "3.29", "S3-R9"), "It reads \"Parts already on work orders keep their prices.\" and offers Cancel and Delete."),
   R(S("S3-R9"), "Matrix A is gone from the list.", "The General Matrix and the other matrices are still listed."),
   R(S("S3-R9", "On delete, its categories move to the General Matrix (S11-R6)."), "Category A's matrix reads General Matrix.")],
  pics=["3.28", "3.29"])

C("S3-40", K, "Only a grid save asks Change All",
  [ADMIN, matrix("A", ", pricing two new categories made for this test, category A and category B"), category("C", ", on the General Matrix"), DESK],
  [MATRICES, open_matrix("A"), "Click matrix A's name.", "Type a new name no other matrix uses.", "Click outside the name field.", EDIT, "Pick category C in the Categories picker.", SAVE,
   "Click the Part Sale Matrix tab.", "Switch Separate Part Sale pricing on."],
  [R(S("S3-R12"), "Matrix A is listed."), R(S("S3-R12"), "Matrix A's page opens."), R(S("S3-R18"), "The name can be edited."), R(S("S3-R18"), "The field shows the new name."),
   R(S("S3-R12", "Renaming, changing its categories and turning the Part Sale switch on save without asking"), "The new name is saved with no question."),
   R(S("S4-R4"), "The grid is in edit."), R(S("S3-R13"), "Category C is ticked."),
   R(S("S3-R12", "Only a grid Save asks Change All"), "Matrix A saves its categories with no Change Prices question (no grid value changed).",
     "The Categories line names category A, category B and category C."),
   R(S("S3-R21"), "The switch shows, off."),
   R(S("S3-R12", "turning the Part Sale switch on save without asking"), "The Part Sale grid shows at once, with no question.")],
  pics=["3.13", "3.18"])

C("S3-41", K, "A matrix used by one category saves without asking",
  [ADMIN, matrix("A", ", pricing one new category made for this test"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", SAVE],
  [R(S("S3-R12"), "Matrix A is listed."), R(S("S3-R12"), "Matrix A's page opens."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S3-R12", "Otherwise, a matrix used by one category, or by none, saves without asking."), "The grid saves and returns to view.", "No Change Prices question appears (with no tier pricing from Default in it).")],
  pics=["3.11", "3.12"])

C("S3-42", K, "The General Matrix cannot be deleted",
  [ADMIN, DESK],
  [MATRICES, "Open the General Matrix's three-dot menu.", "Point at Delete."],
  [R(S("S3-N3"), "The General Matrix is listed with the Default badge."),
   R(S("S3-N3", "The General Matrix can't be deleted. Delete is disabled"), "The menu shows Duplicate and a disabled Delete."),
   R(S("S3-N3", "with the tooltip \"The General Matrix can't be deleted. You can edit it.\""), "A tooltip reads \"The General Matrix can't be deleted. You can edit it.\"")],
  pics=["6.12"])

C("S3-43", K, "A cost is rounded to the cent before its range is chosen",
  [WO, matrix("A", ", pricing a new category made for this test, category A, two ranges: $0.00 to $10.00 at Default 50% markup, $10.01 and up at Default 20% markup"),
   "Have a new customer for this test, customer A, on Default.", "Have a new work order for this test, work order 1, for customer A."],
  ["Open work order 1.", "Add a part in category A with a cost of 10.005.", "Point at the line's sell price."],
  [R(S("S3-E3"), "Work order 1 opens."),
   R(S("S3-E3", "Costs are rounded to the cent, half away from zero, before a rule is chosen. So a cost of $10.005 is $10.01 and falls in exactly one range."),
     "The cost reads $10.01 (10.005 rounded half away from zero).", "The line is priced by the second range: $10.01 × 1.20 = $12.012, shown $12.01 (not $10.00 × 1.50 = $15.00)."),
   R(S("S3-E3", "falls in exactly one range"), "The price details name the $10.01 and up range.")],
  pics=["12.1"], flags=["numbers"])

C("S3-44", K, "Opening and saving a matrix without editing changes no price",
  [WO, matrix("A", ", pricing a new category made for this test, category A, Default 40% markup"), "Have a new customer for this test, customer A, on Default.", "Have a new work order for this test, work order 1, for customer A."],
  [MATRICES, open_matrix("A"), EDIT, "Type 41 in Default's first range.", "Type 40 in Default's first range.", "Click Cancel.", "Open work order 1.", "Add a part with a cost of $100.00 in category A."],
  [R(S("S3-E4"), "Matrix A is listed."), R(S("S3-E4"), "Matrix A's page opens."), R(S("S4-R4"), "The bar reads \"No changes yet\"."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R4", "a value changed and then changed back doesn't count"), "The bar reads \"No changes yet\" again."),
   R(S("S3-R25"), "The grid returns to view without a question."), R(S("S3-E4"), "Work order 1 opens."),
   R(S("S3-E4", "Opening or saving a matrix without editing its rules never changes a price."), "The part is priced $100.00 × 1.40 = $140.00.")],
  pics=["4.22"], flags=["numbers"])

C("S3-45", K, "An old last range that differed from the one above keeps its own rule",
  [ADMIN, STAGING, "Before the release is deployed to staging, have a category matrix (matrix A) whose last range has a different markup from the range above "
   "(for example 30% then 25%), and another (matrix B) whose last two ranges match (30% and 30%).", "Use the same client after the deploy.", DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 35 in Default's second-to-last range.", "Click Cancel.", "Click Discard Changes.", "Open matrix B from the Matrices list.", EDIT,
   "Type 35 in Default's second-to-last range."],
  [R(S("S3-E4"), "Matrix A is listed."), R(S("S3-E4", "On release day every range keeps its calculation and value."), "Matrix A's last two ranges read 30% markup and 25% markup."),
   R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-E4", "An existing last range that differs from the range above it becomes its own rule"), "Matrix A's second-to-last range reads 35.", "Matrix A's last range stays 25: it does not follow the 35."),
   R(S("S19-R3"), "The discard question opens."), R(S("S3-R25"), "The grid returns to view."), R(S("S3-E4"), "Matrix B's page opens."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-E4", "one that matches starts following"), "Matrix B's last range changes to 35 with the range above.")],
  pics=["4.6"], marker=PRE_REL)
