"""Story 6 — Every matrix in one list (SV-12458), PRD v37 lines 494-529, design page 6 (6.1-6.14). Batch A, 14 Nov 2026.
Column order and the look follow the design (PRD §7: "Layout, styling, sort indicators, scrolling and pinned columns follow the design
canvas"); these cases check what each column holds. The Part Sale Matrix column's words differ between PRD ("On or Off") and design
("Same as work orders" or a rule summary): this case checks On/Off as the PRD says; the design's version is a held design case (Q16)."""
from tp_lib import C, R, B, S, QP, QD, QL
from common import *

K = "S6"
LIST = lambda *t: R(S("S6-R1"), *t)


C("S6-01", K, "Settings › Pricing has Tiers, Matrices and Fixed Rules tabs",
  [ADMIN, "Have a fixed sell price set on an inventory part for this test, so the Fixed Rules tab has a row.", DESK],
  ["Open Settings › Pricing.", "Click the Fixed Rules tab."],
  [R(S("S6-R11", "Settings › Pricing has Tiers, Matrices and Fixed Rules tabs, replacing today's Pricing matrices and Fixed rules tabs."),
     "The page shows three tabs: Tiers, Matrices and Fixed Rules.", "Today's \"Pricing Matrices\" tab is gone (compare the Today picture).", "The Tiers tab is open."),
   R(S("S6-R11", "The Fixed Rules tab lists only fixed rules, as today."), "The Fixed Rules tab lists the fixed sell price set for this test.",
     "It lists fixed rules alone: no matrix and no tier shows on it.")],
  pics=["2.2", "6.2", "today:6.1"])

C("S6-02", K, "Matrices list shows each matrix's status, categories, tiers and both sides",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), matrix("B", ", which prices no category"), DESK],
  [MATRICES, "Point at matrix B's Inactive status."],
  [LIST("The list has the columns Matrix, Status, Categories, Tiers, Work Order Matrix and Part Sale Matrix.",
        "Matrix A's Status reads Active and its Categories cell names category A.",
        "Matrix A's Work Order Matrix shows Default's rules in short words.",
        "Matrix A's Part Sale Matrix reads Off (it has no separate Part Sale side).")
   + R(S("S6-R1", "Status is Active or Inactive (S3-R28)"), "Matrix B's Status reads Inactive."),
   R(S("S6-R1", "with \"No categories use this matrix\" on hover for Inactive"), "A tooltip reads \"No categories use this matrix\".")],
  pics=["6.2", "6.8"])

C("S6-03", K, "Part Sale Matrix column reads On once a matrix has its own Part Sale side",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A, with Separate Part Sale pricing off"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", "Turn on Separate Part Sale pricing.", MATRICES],
  [LIST("Matrix A's Part Sale Matrix reads Off."), R(S("S3-R21"), "Matrix A's page opens."),
   R(S("S3-R21"), "The tab shows the Separate Part Sale pricing switch, off."), R(S("S3-R21"), "The switch is on and the Part Sale grid shows."),
   R(S("S6-R1", "Part Sale Matrix (On or Off)"), "Matrix A's Part Sale Matrix now reads On.", "Its Work Order Matrix still shows Default's rules in short.")],
  pics=["6.2", "3.17", "3.18"])

C("S6-04", K, "Tiers column lists the tiers with their own rules, names on hover",
  [ADMIN, tier("A", ", with a rule of its own in matrix A"), tier("B", ", on Same as previous tier in matrix A"),
   matrix("A", ", pricing a new category made for this test, category A"), "Note tier A's number on the Tiers list (for example 5).", DESK],
  [MATRICES, "Point at matrix A's Tiers value."],
  [R(S("S6-R10", "Otherwise it lists the numbers of the tiers that do (\"1, 2, 4\")"), "Matrix A's Tiers value lists 1 and tier A's number (for example \"1, 5\").",
     "Tier B's number is left out: it has no rules of its own in matrix A.")
   + R(S("S6-R10", "Default always counts."), "The list starts with 1, Default."),
   R(S("S6-R10", "with their names on hover"), "A tooltip names each listed tier by number and name, Default and tier A.")],
  pics=["6.2", "6.4"])

C("S6-05", K, "Tiers column reads All when every active tier has its own rules",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A, in which Default and every active tier of the client has a value of its own typed in its column"), DESK],
  [MATRICES],
  [R(S("S6-R10", "The Tiers column reads \"All\" when every active tier has its own rules in that matrix."), "Matrix A's Tiers value reads All.",
     "Matrix A's Status reads Active.")],
  pics=["6.2"])

C("S6-06", K, "An archived tier never shows in the Tiers column",
  [ADMIN, tier("A", ", with a rule of its own in matrix A"), matrix("A", ", pricing a new category made for this test, category A"),
   "Note tier A's number on the Tiers list (for example 5).", DESK],
  [MATRICES, TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive.", "Click Archive in the dialog.", MATRICES],
  [R(S("S6-R10"), "Matrix A's Tiers value lists 1 and tier A's number."), R(S("S2-R14"), "The Tiers list shows tier A."), R(S("S2-R26"), "The menu offers Archive."),
   R(S("S2-R30"), "The Archive question for tier A opens."), R(S("S2-R14"), "Tier A shows among the archived tiers."),
   R(S("S6-R10", "Archived tiers never show in this column."), "Matrix A's Tiers value lists 1 without tier A's number.", "Matrix A is still listed and Active.")],
  pics=["6.2", "2.23"])

C("S6-07", K, "A separate Part Sale side does not change the Tiers column",
  [ADMIN, tier("A", ", on Same as previous tier on matrix A's Work Order Matrix"),
   matrix("A", ", pricing a new category made for this test, category A, with Separate Part Sale pricing on and tier A on % Off 10 on its Part Sale Matrix only"), DESK],
  [MATRICES],
  [R(S("S6-R10", "The column reads the Work Order Matrix side only; a separate Part Sale side doesn't change it."),
     "Matrix A's Tiers value does not list tier A's number, although tier A has a rule on the Part Sale side.",
     "Matrix A's Tiers value lists 1 (Default) and its Part Sale Matrix reads On.")],
  pics=["6.2"])

C("S6-08", K, "General Matrix is first with its badge and its category count",
  [ADMIN, "Note the count in the General Matrix's Categories cell on the Matrices list (for example 9).", matrix("A", ", which prices no category"), DESK],
  [MATRICES, CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE, "Open Settings › Pricing.", MATRICES,
   CATEGORIES, "Click the new category's row.", "Pick matrix A in the Pricing Matrix picker.", "Open Settings › Pricing.", MATRICES],
  [R(S("S6-R8", "The General Matrix is listed first with the Default badge; its Categories cell reads \"All categories without a matrix (n)\""),
     "The General Matrix is the first row, with a Default badge.", "Its Categories cell reads \"All categories without a matrix\" with the noted count in brackets."),
   R(S("S8-R10"), "The Categories list shows."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-R10"), "The name shows in the field."),
   R(S("S8-R10", "a Pricing Matrix (the General Matrix unless another is picked)"), "The category is created on the General Matrix."),
   R(S("S6-R11"), "Settings › Pricing opens."),
   R(S("S6-R8", "where n counts those categories now, Uncategorized included"), "The General Matrix's count is one higher (for example 9 + 1 = 10)."),
   R(S("S7-R1"), "The Categories list shows the new category."), R(S("S7-R6"), "The new category's page opens."),
   R(S("S7-R9"), "The category now uses matrix A."), R(S("S6-R11"), "Settings › Pricing opens."),
   R(S("S6-R8", "where n counts those categories now, Uncategorized included"), "The General Matrix's count is back to the noted number (10 − 1 = 9).")],
  pics=["6.2", "8.9", "8.1"], flags=["numbers"])

C("S6-09", K, "Up to three category names show, then +N with the full list on hover",
  [ADMIN, matrix("A", ", pricing five new categories made for this test"), matrix("B", ", which prices no category"), DESK],
  [MATRICES, "Point at matrix A's +N."],
  [R(S("S6-R7", "Other matrices show up to three category names, then \"+N\" with the full list on hover."),
     "Matrix A's Categories cell shows three of its category names, then \"+2\" (5 − 3 = 2).")
   + R(S("S6-R7", "A matrix with no categories shows \"—\" and stays in the list."), "Matrix B's Categories cell shows \"—\".", "Matrix B is still listed."),
   R(S("S6-R7", "with the full list on hover"), "A tooltip lists all five category names.")],
  pics=["6.2"], flags=["numbers"])

C("S6-10", K, "Edit on a matrix row opens the matrix page in edit",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES, "Click the pencil on matrix A's row."],
  [R(S("S6-R9", "Each row has Edit"), "Matrix A's row shows a pencil and a three-dot button at its right."),
   R(S("S6-R9", "which opens the matrix page in edit (S3-R25)"), "Matrix A's page opens with its grid already in edit.", "Cancel and Save show above the grid.")],
  pics=["6.2", "3.3"])

C("S6-11", K, "A matrix row's menu offers Duplicate and Delete",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES, "Open matrix A's three-dot menu."],
  [R(S("S6-R9"), "Matrix A is listed."),
   R(S("S6-R9", "a More Actions menu with Duplicate and Delete (S3-R8, S3-R9)"), "The menu lists Duplicate and Delete.")],
  pics=["6.11"])

C("S6-12", K, "New Matrix can be cancelled and creates nothing",
  [ADMIN, "Note the number of matrices the Matrices tab shows (for example 7).", DESK],
  [MATRICES, "Click New Matrix.", "Type a name no other matrix uses.", "Click Cancel.", "Click Discard Changes."],
  [R(S("S6-R9"), "The list shows the noted number of matrices."),
   R(S("S6-R9", "New Matrix opens a new matrix page (S3-R30)"), "A New Matrix page opens with an empty name field."),
   R(S("S6-R9"), "The name shows in the field."),
   R(S("S19-R3", "Leaving a matrix page, the New Category page or a grid in edit with unsaved changes asks \"Discard these changes?\""), "A question asks whether to discard the changes."),
   R(S("S6-R9", "that can be cancelled before it is saved (S19-R14)"), "The Matrices list shows again.",
     "The count is the noted number (7 = 7): nothing was created.")],
  pics=["6.2", "3.22", "3.16"], flags=["numbers"])

C("S6-13", K, "Matrices list search matches matrix and category names",
  [ADMIN, "Have a new matrix for this test, matrix A, named for example Zebra Pricing, pricing a new category made for this test, category A, named for example Quokka Parts.",
   DESK],
  [MATRICES, "Type zebra in the search.", "Clear the search.", "Type   QUOKKA   with spaces before and after."],
  [R(S("S6-R2"), "The list shows every matrix."),
   R(S("S6-R2", "The list has a search that matches matrix and category names"), "Matrix A is listed.")
   + R(S("S19-R18", "Every search in this PRD matches a case-insensitive substring of each field it names"), "Matrices whose names and categories do not contain \"zebra\" are hidden."),
   R(S("S6-R2"), "Every matrix shows again."),
   R(S("S19-R18", "ignores leading and trailing spaces"), "Matrix A is listed through category A's name, in any letter case and with the spaces ignored.",
     "The General Matrix is hidden.")],
  pics=["6.9"])

C("S6-14", K, "Status filter shows Active or Inactive matrices",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), matrix("B", ", which prices no category"), DESK],
  [MATRICES, "Open the Status filter.", "Pick Inactive."],
  [R(S("S6-R2"), "Matrix A and matrix B are both listed."),
   R(S("S6-R2", "a Status filter (Active, Inactive)"), "The filter offers Active and Inactive."),
   R(S("S6-R2", "a Status filter (Active, Inactive)"), "Matrix B is listed.", "Matrix A and the General Matrix are hidden.")],
  pics=["6.5", "6.6", "6.7"])

C("S6-15", K, "A search with no match says so, with Clear Search",
  [ADMIN, DESK],
  [MATRICES, "Type zzqqzz in the search.", "Click Clear Search."],
  [R(S("S6-R6"), "The list shows the General Matrix first."),
   R(S("S6-R3", "A search with no match says 'No matrices match the search \"…\".' with Clear Search"),
     "The list area reads 'No matrices match the search \"zzqqzz\".'", "A Clear Search button shows under it."),
   R(S("S6-R3"), "The search is empty.", "Every matrix is listed again.")],
  pics=["6.10"])

C("S6-16", K, "Filters with no match say so, with Clear All Filters",
  [ADMIN, "Make sure the client has no Inactive matrix (give each Inactive matrix a new category made for this test), so the Inactive filter matches nothing.", DESK],
  [MATRICES, "Open the Status filter.", "Pick Inactive.", "Click Clear All Filters."],
  [R(S("S6-R2"), "Every matrix shows Active."), R(S("S6-R2"), "The filter offers Active and Inactive."),
   R(S("S6-R3", "filters with no match say \"No matrices match these filters\" with Clear All Filters"),
     "The list area reads \"No matrices match these filters\".", "A Clear All Filters button shows under it."),
   R(S("S6-R3"), "The Status filter is cleared.", "Every matrix is listed again.")],
  pics=["6.7", "6.10"])

C("S6-17", K, "Matrices list shows 50 a page, General Matrix first, then A to Z",
  [ADMIN, "Have at least 51 matrices in the client (make new ones for this test if needed), so the list needs a second page.", DESK],
  [MATRICES, "Go to the list's second page."],
  [R(S("S6-R6", "The list shows 50 matrices a page, the General Matrix first, then by name A to Z."),
     "The first page shows 50 matrices, the General Matrix first.", "The rest follow by name, A to Z."),
   R(S("S6-R6", "The list shows 50 matrices a page"), "The second page shows the matrices after the 50th (51 − 50 = 1 or more), still A to Z.")],
  pics=["6.2"], flags=["numbers"])

C("S6-18", K, "Categories column sorts by count, most first on the first click",
  [ADMIN, matrix("A", ", pricing three new categories made for this test"), matrix("B", ", pricing one new category made for this test"),
   matrix("C", ", pricing two new categories made for this test"), DESK],
  [MATRICES, "Click the Categories column header.", "Click the Categories column header again.", "Click the Matrix column header."],
  [R(S("S6-R6"), "Matrix A, matrix B and matrix C are listed by name."),
   R(S("S6-R6", "Categories sorts by the number of categories, most first on the first click (S19-R22)."),
     "Matrices with more categories come first: matrix A (3) above matrix C (2) above matrix B (1)."),
   R(S("S6-R6", "The Matrix and Categories columns sort."), "The order reverses: matrix B (1) above matrix C (2) above matrix A (3)."),
   R(S("S6-R6", "The Matrix and Categories columns sort."), "The list is sorted by matrix name.", "Matrix A comes before matrix B, which comes before matrix C, in name order.")],
  pics=["6.2"])

C("S6-19", K, "Search, sort and page are kept when coming back",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES, "Click the Categories column header.", "Type matrix A's name in the search.", CATEGORIES, "Open Settings › Pricing.", MATRICES],
  [R(S("S6-R6"), "The list shows."), R(S("S6-R6"), "The list is sorted by Categories."), R(S("S6-R2"), "Matrix A is listed."),
   R(S("S7-R1"), "The Categories page opens."), R(S("S6-R11"), "Settings › Pricing opens."),
   R(S("S6-R6", "Search, sort and page are kept when the user comes back."), "The search still holds matrix A's name and matrix A is listed.",
     "The list is still sorted by Categories.")],
  pics=["6.2", "6.9"])
