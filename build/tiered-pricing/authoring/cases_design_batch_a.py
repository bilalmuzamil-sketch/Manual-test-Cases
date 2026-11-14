"""Design — how it looks, batch A: PRD pages 5, 6, 7, 8, 9, 12, 14, 15 (design boards 5.1-15.2, 105 boards) and the Today pictures 6.1, 7.1,
7.2, 9.25, 9.26, 9.27, 9.38, 14.1. Keys D-100…D-399. Design "Tiered Pricing Design" 1794631438-539a (files identical in 1794638838-cd70).
Every attribute is an eye check against the named picture at 100% zoom (Rule 126 point 8). Gray italic values ("Uses previous tier") are
checked as "gray, italic", never by letter shape (TOOL-FILES-READ F5). Wording comes from the PRD where it has the sentence and from the
board where the PRD is silent (QA lead's precedence, 14 Nov 2026); PRD §7: "Layout, styling, sort indicators, scrolling and pinned columns
follow the design canvas". Held "design version" cases (Rule 130) carry the design's own version where the PRD words it differently; each is
held on its question candidate in po_questions_batch_a.py. Stress (§6d line 9) and before-and-after (line 10) cases are registered in
verdicts_batch_a.py."""
from tp_lib import C, R, B, S, QP, QD, QT, QL
from common import *

K = "DESIGN"
CMP = "compared with the design picture at 100% zoom"
DV = ["design-version"]


def look(board, row, *texts):
    return R(QL(board, row), *texts)


def mx(lab, extra=""):
    return matrix(lab, ", pricing a new category made for this test" + extra)


# ---- page 5: Price Part Simulator ---------------------------------------------------------------------------------------------
C("D-100", K, "Design: the Price Part Simulator under the grid",
  [ADMIN, tier("A"), mx("A", ", one range from $0.00 with Default on Margin % 40, tier A on % Off 5"), W1440],
  [MATRICES, open_matrix("A"), "Point at the info icon beside Price Part Simulator.", "Type 250 in the Part Cost."],
  [look("5.1", "S5-R1", "The Matrices list shows."),
   R(S("S5-R1", "Under the grid on the matrix page, on both tabs, a separate table titled \"Price Part Simulator\""),
     "Below the grid, a bold \"Price Part Simulator\" title with an info icon sits above its own bordered table.")
   + look("5.1", "S5-R1", "The table's header row reads Part Cost, then Default and each tier with its number, in the same columns as the grid above.",
          "The Part Cost box sits in the first column and reads $ 100; each column shows a bold price with a smaller gray \"profit\" line under it, as in picture 5.1."),
   R(QD("Type a part cost to see each tier’s price and profit. Nothing is saved.", "5.1", "S5-R1"),
     "A dark tooltip reads \"Type a part cost to see each tier's price and profit. Nothing is saved.\""),
   look("5.1", "S5-R2", f"The prices and profit lines change in place; the columns keep their places, {CMP}.")],
  pics=["5.1"])

C("D-101", K, "Design: a below-cost price in the simulator",
  [ADMIN, tier("A"), mx("A", ", one range from $0.00 with Default on Margin % 40, tier A on % Off 95"), W1440],
  [MATRICES, open_matrix("A"), "Point at the warning icon beside tier A's simulator price."],
  [look("5.2", "S5-R5", "The Matrices list shows."),
   R(S("S5-R5", "A negative profit shows with a minus sign, and a sell price below the typed cost shows the below-cost warning icon"),
     "Tier A's simulator price shows a small orange warning triangle right after it.", "Its profit line starts with a minus sign.")
   + look("5.2", "S5-R5", "The minus profit line is red, while the other profit lines are gray, as in picture 5.2.",
          "The same orange triangle shows beside tier A's 95% off values in the grid above."),
   R(QD("Below cost.", "5.2", "S5-R5"), "A dark tooltip reads \"Below cost.\"")],
  pics=["5.2"])

C("D-102", K, "Design: a part cost of zero shows dashes in every column",
  [ADMIN, mx("A", ", one range from $0.00 with Default on Margin % 40"), W1440],
  [MATRICES, open_matrix("A"), "Replace the Part Cost with 0."],
  [look("5.3", "S5-N1", "The Matrices list shows."), look("5.3", "S5-N1", "The simulator reads $ 100 with prices under every column."),
   R(S("S5-N1", "the field shows an error and the table shows \"—\" under every column"), "Every simulator column shows a single \"—\" and no profit line.")
   + look("5.3", "S5-N1", "The Part Cost box shows its error state, as in picture 5.3.")],
  pics=["5.3"])

C("D-103", K, "Design: the simulator keeps lined up with the grid in edit",
  [ADMIN, mx("A", ", one range from $0.00 with Default on Margin % 40"), W1440],
  [MATRICES, open_matrix("A"), EDIT, "Type 250 in the Part Cost."],
  [look("5.4", "S5-R1", "The Matrices list shows."), look("5.1", "S5-R1", "The simulator's columns sit under the grid's columns in view."),
   R(S("S5-R1", "Its columns line up with the grid's."), "In edit, each simulator column still starts under the same grid column as its tier.")
   + look("5.4", "S5-R4", "The grid shows its edit boxes, a change count, Cancel and Save, and the simulator stays below it, as in picture 5.4."),
   R(S("S5-R4", "reflects the unsaved values"), "Each column shows a price and a gray profit line for $250.")],
  pics=["5.1", "5.4"])

C("D-104", K, "Design: long and special tier names in the simulator headers",
  [ADMIN, f"Have a new tier for this test, tier A, with {STRESS_SP}.", f"Have a new tier for this test, tier B, with {STRESS_NO}.",
   f"Have a new tier for this test, tier C, with {STRESS_SPECIAL}.", mx("A"), W1440],
  [MATRICES, open_matrix("A"), "Point at tier B's header in the simulator."],
  [look("5.1", "S5-R1", "The Matrices list shows."),
   R(S("S5-R1", "Its columns line up with the grid's."), "Tier A's, tier B's and tier C's simulator columns stay lined up under their grid columns.",
     "Each name stays inside its own column heading and never covers the next column.",
     "Every price stays visible and the page does not scroll sideways.")
   + R(S("S2-R3"), "Tier C's name shows character for character as typed, & \" ' < > included."),
   R(S("S4-R27", "shows in full on hover"), "Tier B's full name shows on hover.")],
  pics=["5.1"], flags=["stress"])

# ---- page 15: the below-cost warning ------------------------------------------------------------------------------------------
C("D-110", K, "Design: the below-cost warning beside a grid value",
  [ADMIN, tier("A"), mx("A", ", three ranges with Default on Margin % 40, tier A on % Off 95 in every range"), W1440],
  [MATRICES, open_matrix("A"), "Point at the warning icon beside tier A's first-range value."],
  [look("15.1", "S15-R5", "The Matrices list shows."),
   R(S("S15-R5", "shows the standard warning icon (an exclamation mark) to the right of the value"),
     "A small orange triangle with an exclamation mark shows to the right of tier A's value in each range.")
   + look("15.1", "S15-R5", "Default's values show no triangle.", "Tier A's values sit in the same place as the other columns' values, as in picture 15.1."),
   R(S("S15-R5", "The icon's tooltip reads \"<tier> sells a <$cost> part below cost.\""),
     "A dark tooltip just below the icon reads tier A's name, \"sells a\", a cost and \"part below cost.\"")
   + look("15.1", "S15-R5", f"The tooltip's position and colours match picture 15.1 {CMP}.")],
  pics=["15.1"])

C("D-111", K, "Design: the warning appears in edit without moving the grid",
  [ADMIN, tier("A"), mx("A", ", three ranges with Default on Margin % 40, tier A on % Off 5 in every range"), W1440],
  [MATRICES, open_matrix("A"), EDIT, "Take a screenshot of the grid.", "Replace tier A's first-range value with 95.", "Take a second screenshot of the grid."],
  [look("15.2", "S15-R3", "The Matrices list shows."), look("15.2", "S15-R3", "The grid shows in view."), look("15.2", "S15-R3", "The grid is in edit."),
   look("15.2", "S15-R3", "The first screenshot shows no warning icon."),
   R(S("S15-R3", "The warning updates as the grid is edited"), "An orange triangle appears to the right of tier A's first-range box at once.")
   + R(QD("a triangle in a space kept beside every value, so nothing shifts", "15.1", "S15-R5"), "The triangle sits in space already kept beside the box."),
   look("15.2", "S15-R3", "Compared with the first screenshot, every column heading and box is in the same place: nothing shifted when the triangle appeared.",
        "The triangle still shows beside 95.")],
  pics=["15.2", "15.1", "5.4"], flags=["movement"])

# ---- page 6: the Matrices list ------------------------------------------------------------------------------------------------
C("D-120", K, "Design: the Matrices list columns, badges and row buttons",
  [ADMIN, mx("A", ", so the list shows an Active row"), matrix("B", ", which prices no category"), W1440],
  [MATRICES],
  [look("6.2", "S6-R1", "The tabs read Tiers, Matrices and Fixed Rules, each with its count in brackets, the Matrices tab selected.",
        "Above the list it reads the number of matrices followed by \"matrices\", with Search, a Status filter, a three-dot button and a blue New Matrix button at the right.",
        "The columns read Matrix, Status, Categories, Work Order Matrix, Part Sale Matrix and Tiers, in that order, with sort arrows on Matrix and Categories and an info icon beside Tiers.",
        "The General Matrix is the first row, its name bold with a blue Default badge.",
        "Active matrices show a green Active badge; matrix B shows a gray Inactive badge and \"—\" in Categories.",
        "Each row ends with a pencil and a three-dot button.",
        f"Fonts, spacing and alignment match picture 6.2 {CMP}.")
   + R(S("S6-R11", "replacing today's Pricing matrices and Fixed rules tabs"), "Today's Pricing Matrices list (Today picture) is replaced by this list.")],
  pics=["6.2", "today:6.1"])

C("D-121", K, "Design: the Tiers info tooltip on the Matrices list",
  [ADMIN, W1440],
  [MATRICES, "Point at the info icon beside the Tiers header."],
  [look("6.3", "S6-R10", "The Matrices list shows."),
   R(QD("Tiers this matrix prices itself, by number. The rest are the same as the previous tier.", "6.3", "S6-R10"),
     "A dark tooltip below the icon reads \"Tiers this matrix prices itself, by number. The rest are the same as the previous tier.\"")
   + look("6.3", "S6-R10", f"Its position and colours match picture 6.3 {CMP}.")],
  pics=["6.3"])

C("D-122", K, "Design: tier names on hover in the Tiers column",
  [ADMIN, tier("A", ", with a rule of its own in matrix A"), mx("A"), W1440],
  [MATRICES, "Point at matrix A's Tiers value."],
  [look("6.4", "S6-R10", "Matrix A's Tiers value lists numbers separated by commas, starting with 1."),
   R(S("S6-R10", "with their names on hover"), "A dark tooltip lists each tier as its number, \" · \" and its name, separated by commas (for example \"1 · Default, 5 · Fleet\").")
   + look("6.4", "S6-R10", "The tooltip shows just below the value, as in picture 6.4.")],
  pics=["6.4"])

C("D-123", K, "Design: the Status filter and its blue chip keep the columns in place",
  [ADMIN, mx("A"), matrix("B", ", which prices no category"), W1440],
  [MATRICES, "Take a screenshot of the list.", "Open the Status filter.", "Pick Inactive.", "Close the filter panel.", "Take a second screenshot of the list."],
  [look("6.2", "S6-R2", "The list shows matrix A (Active) and matrix B (Inactive)."), look("6.2", "S6-R2", "The screenshot shows the list."),
   look("6.5", "S6-R2", "A panel opens under the Status chip with Active and Inactive, each with a checkbox and its count at the right, and a blue \"Clear selection\" link at the bottom, as in picture 6.5."),
   look("6.6", "S6-R2", "Inactive is ticked."),
   R(QD("The chip turns blue with the selection.", "6.7", "S6-R2"), "The chip turns blue and reads \"Status: Inactive\".", "The label above the list counts the Inactive matrices; matrix B is listed and matrix A is hidden."),
   look("6.7", "S6-R2", "Compared with the first screenshot, the column headings Matrix, Status, Categories, Work Order Matrix, Part Sale Matrix and Tiers keep their places, as pictures 6.2 and 6.7 show.", "The rows below the headings change to the Inactive matrices.")],
  pics=["6.2", "6.5", "6.6", "6.7"], flags=["movement"])

C("D-124", K, "Design: hovering an Inactive status",
  [ADMIN, matrix("A", ", which prices no category"), W1440],
  [MATRICES, "Point at matrix A's Inactive badge."],
  [look("6.8", "S6-R1", "Matrix A shows a gray Inactive badge."),
   R(S("S6-R1", "with \"No categories use this matrix\" on hover for Inactive"), "A dark tooltip reads \"No categories use this matrix\", with no period at the end.")
   + look("6.8", "S6-R1", "The tooltip shows just below the badge, as in picture 6.8.")],
  pics=["6.8"])

C("D-125", K, "Design: searching the Matrices list",
  [ADMIN, "Have a new matrix for this test, matrix A, named for example Zebra Pricing, pricing a new category made for this test.", W1440],
  [MATRICES, "Click Search.", "Type zebra."],
  [look("6.9", "S6-R2", "The Matrices list shows."),
   look("6.9", "S6-R2", "The search opens as a box with the cursor in it."),
   R(S("S6-R2", "The list has a search that matches matrix and category names"), "Matrix A is listed.")
   + look("6.9", "S6-R2", "The box shows the typed text with a clear (x) button at its right, and the label above the list reads the match count, as in picture 6.9.")],
  pics=["6.9"])

C("D-126", K, "Design: a matrix row's menu and the General Matrix's grayed Delete",
  [ADMIN, mx("A"), W1440],
  [MATRICES, "Open matrix A's three-dot menu.", "Press Esc.", "Open the General Matrix's three-dot menu.", "Point at Delete."],
  [look("6.11", "S6-R9", "The Matrices list shows."),
   look("6.11", "S6-R9", "A small menu opens below the button with Duplicate, then Delete in red, as in picture 6.11."),
   look("6.11", "S6-R9", "The menu closes."),
   look("6.12", "S3-N3", "The menu lists Duplicate and a grayed Delete."),
   R(S("S3-N3", "\"The General Matrix can't be deleted. You can edit it.\""), "A dark tooltip reads \"The General Matrix can't be deleted. You can edit it.\"")
   + look("6.12", "S3-N3", "It shows just below Delete, as in picture 6.12.")],
  pics=["6.11", "6.12"])

C("D-127", K, "Design: the Matrices list's Audit Log",
  [ADMIN, W1440],
  [MATRICES, "Click the three-dot button beside New Matrix.", "Click Audit Log."],
  [look("6.13", "S19-R19", "The Matrices list shows."),
   look("6.13", "S19-R19", "A small menu opens below the button with one row, Audit Log."),
   R(S("S19-R19", "\"Audit Log: Matrices\""), "A dialog titled \"Audit Log: Matrices\" opens.")
   + look("6.14", "S19-R19", "Its columns read Event, User, Details, Date and Time; each detail starts with the matrix name in bold and shows the change with an arrow, as in picture 6.14.",
          "An X sits at the top right and Close at the bottom right.")],
  pics=["6.13", "6.14"])

C("D-128", K, "Design: long and special matrix and category names on the Matrices list",
  [ADMIN, f"Have a new matrix for this test, matrix A, with {STRESS_SP}, pricing a new category made for this test, category A, with {STRESS_NO}.",
   f"Have a new matrix for this test, matrix B, with {STRESS_NO}.", f"Have a new matrix for this test, matrix C, with {STRESS_SPECIAL}.", W1440],
  [MATRICES],
  [R(S("S6-R1", "Settings › Pricing › Matrices lists every matrix"), "Matrix A's, matrix B's and matrix C's names each stay inside the Matrix column of their own row and never cover the Status column.",
     "Category A's name stays inside matrix A's Categories cell and never covers the Work Order Matrix column.",
     "Every column and the row's pencil and three-dot button stay visible, and the page does not scroll sideways.")
   + R(S("S3-R6"), "Matrix C's name shows character for character as typed, & \" ' < > included.")
   + look("6.2", "S6-R1", "The column headings keep their places, as in picture 6.2.")],
  pics=["6.2"], flags=["stress"])

C("D-129", K, "Design: Part Sale Matrix column shows a rule summary or Same as work orders",
  [ADMIN, mx("A", ", with Separate Part Sale pricing off"), mx("B", ", with Separate Part Sale pricing on"), W1440],
  [MATRICES],
  [R(QD("Same as work orders", "6.2", "S6-R1"), "Matrix A's Part Sale Matrix reads \"Same as work orders\" in gray.")
   + R(QD("2 rules · cost + $, margin", "6.2", "S6-R1"), "Matrix B's Part Sale Matrix shows its Part Sale rules in short words in the same form as the Work Order Matrix column (for example \"2 rules · cost + $, margin\"), as in picture 6.2.")],
  pics=["6.2"], held_on="Q20", flags=DV)

C("D-130", K, "Design: the no-match messages say No matrices match and No category matches",
  [ADMIN, W1440],
  [MATRICES, "Type zzz in the search.", CATEGORIES, "Type zzz in the search."],
  [look("6.10", "S6-R3", "The Matrices list shows."),
   R(QD("No matrices match \"zzz\"", "6.10", "S6-R3"), "The list area shows a search icon and reads \"No matrices match \"zzz\"\" with no period, and a Clear Search button, as in picture 6.10."),
   look("7.6", "S7-R4", "The Categories list shows."),
   R(QD("No category matches \"zzz\"", "7.6", "S7-R4"), "The list area reads \"No category matches \"zzz\"\" with no period, and a Clear Search button, as in picture 7.6.")],
  pics=["6.10", "7.6"], held_on="Q21", flags=DV)

# ---- page 7: Categories ---------------------------------------------------------------------------------------------------------
C("D-140", K, "Design: the Categories list with its matrix and tier columns",
  [ADMIN, tier("A", ", so the list has a tier column of this test"), W1440],
  [CATEGORIES],
  [look("7.3", "S7-R1", "The title reads Categories; under it a label reads the number of categories and of tiers (for example \"17 categories · 5 tiers\").",
        "At the right sit a search reading \"Search categories or matrices\", a three-dot button and a blue New Category button.",
        "The columns read Category (with a sort arrow), Pricing Matrix (with sort arrows), then \"1 Default\" and each active tier as its number and name.",
        "Uncategorized is the first row, bold, with a blue Default badge and an info icon; General Matrix cells carry a blue Default badge.",
        "Rules show in short words, and \"Uses previous tier\" cells are gray, italic.",
        f"Fonts, spacing and alignment match picture 7.3 {CMP}.")
   + R(S("S7-R1", "with Category, Pricing Matrix, Default, then one column per active tier by number"),
       "Today's QuickBooks Products And Services column (Today picture 7.1) is gone from the list.")],
  pics=["7.3", "7.1"])

C("D-141", K, "Design: hovering a Uses previous tier cell on the Categories list",
  [ADMIN, tier("A"), tier("B", ", made right after tier A"), mx("A", ", category A, with tier A on % Off 10 and tier B on Same as previous tier"), W1440],
  [CATEGORIES, "Point at tier B's cell on category A's row."],
  [look("7.4", "S7-R2", "Tier B's cell on category A's row reads \"Uses previous tier\" in gray italic."),
   R(QD("Uses previous tier, 4 · Tier 4.", "7.4", "S7-R2"), "A dark tooltip reads \"Uses previous tier,\" tier A's number, \" · \" and tier A's name, ending with a period.")
   + look("7.4", "S7-R2", "The tooltip shows beside the cell, as in picture 7.4.")],
  pics=["7.4"])

C("D-142", K, "Design: searching the Categories list",
  [ADMIN, "Have a new category for this test, category A, named for example Quokka Parts.", W1440],
  [CATEGORIES, "Type quokka in the search."],
  [look("7.5", "S7-R4", "The Categories list shows."),
   R(S("S7-R4", "Search matches category and matrix names"), "Category A is listed.")
   + look("7.5", "S7-R4", "The search box is outlined with a clear (x) button, and the label reads the match count with the tier count, as in picture 7.5.")],
  pics=["7.5"])

C("D-143", K, "Design: a category's page with its matrix grid read-only",
  [ADMIN, mx("A", ", category A, and no other"), W1440],
  [CATEGORIES, "Click category A's row."],
  [look("7.7", "S7-R6", "The Categories list shows category A's row."),
   R(S("S7-R6", "with the breadcrumb Settings › Categories › <category>"), "The breadcrumb reads Settings › Categories › and category A's name.")
   + look("7.8", "S7-R6", "The title is category A's name, with a three-dot button and a white New Matrix button at the top right.",
          "Under the title sit a Pricing Matrix picker with an info icon beside it, a QuickBooks Products And Services picker and a Tax Exempt checkbox.",
          "Below, matrix A's name labels a read-only grid with an Edit button at its top right and no Price Part Simulator, as in picture 7.8.")
   + R(S("S7-R6", "Every field today's Edit Category has stays on the page."), "The name, QuickBooks Products And Services and Tax Exempt of today's Edit Category dialog (picture 7.2) are all on the page.")],
  pics=["7.7", "7.8", "7.2"])

C("D-144", K, "Design: the grayed Edit and the link on a shared matrix",
  [ADMIN, mx("A", ", category A, and a second new category made for this test, category B"), W1440],
  [CATEGORIES, "Click category A's row.", "Point at the grayed Edit.", "Click the \"Go to the\" link."],
  [look("7.9", "S7-R13", "The Categories list shows."),
   look("7.9", "S7-R13", "Edit above the grid is grayed, and a blue link beside it reads \"Go to the\", matrix A's name and \"matrix\", as in picture 7.9."),
   R(QD("Can’t edit here. The Fluids 30 matrix prices 2 categories, so edit it from the matrix.", "7.10", "S7-R13"),
     "A dark tooltip below the button reads \"Can't edit here. The\", matrix A's name, \"matrix prices 2 categories, so edit it from the matrix.\"")
   + look("7.10", "S7-R13", "Its position matches picture 7.10."),
   R(S("S7-R13", "the breadcrumb leads back to the category"), "Matrix A's page opens in edit; the breadcrumb reads Settings › Categories › category A's name › matrix A's name.")
   + look("7.11", "S7-R13", "Cancel and a blue Save sit above the grid, and the simulator shows below it, as in picture 7.11.")],
  pics=["7.9", "7.10", "7.11"])

C("D-145", K, "Design: New Matrix from a category's page",
  [ADMIN, category("A", ", on the General Matrix"), W1440],
  [CATEGORIES, "Click category A's row.", "Click New Matrix."],
  [look("7.12", "S7-R11", "The Categories list shows."), look("7.12", "S7-R11", "Category A's page shows New Matrix at the top right."),
   R(S("S7-R11", "with this category already picked"), "A New Matrix page opens; its Categories box reads \"Categories (1)\" with category A in it.")
   + look("7.13", "S7-R11", "The breadcrumb reads Settings › Categories › category A's name › New Matrix, with a large empty \"Matrix name\" field, Cancel and a blue Create Matrix, as in picture 7.13.")],
  pics=["7.12", "7.13"])

C("D-146", K, "Design: the Categories list's Audit Log",
  [ADMIN, W1440],
  [CATEGORIES, "Click the three-dot button beside New Category.", "Click Audit Log."],
  [look("7.14", "S19-R19", "The Categories list shows."), look("7.14", "S19-R19", "A small menu opens with one row, Audit Log."),
   R(S("S19-R19", "\"Audit Log: Categories\""), "A dialog titled \"Audit Log: Categories\" opens.")
   + look("7.15", "S19-R19", "Its columns read Event, User, Details, Date and Time; each detail starts with the category name in bold; an X sits at the top right and Close at the bottom right, as in picture 7.15.")],
  pics=["7.14", "7.15"])

C("D-147", K, "Design: the other categories named in an info icon by the matrix name",
  [ADMIN, mx("A", ", category A, and a second new category made for this test, category B"), W1440],
  [CATEGORIES, "Click category A's row.", "Point at the info icon beside matrix A's name above the grid."],
  [look("7.9", "S7-R15", "The Categories list shows."), look("7.9", "S7-R15", "Above the grid, matrix A's name shows with an info icon beside it, and no sentence line."),
   R(QD("The Fluids 30 matrix also prices 1 other category: Oil.", "7.9", "S7-R15"),
     "A dark tooltip reads \"The\", matrix A's name, \"matrix also prices 1 other category:\" and category B's name, ending with a period, as in picture 7.9.")],
  pics=["7.9"], held_on="Q22", flags=DV)

C("D-148", K, "Design: long and special category names on the list and the page",
  [ADMIN, f"Have a new category for this test, category A, with {STRESS_SP}.", f"Have a new category for this test, category B, with {STRESS_NO}.",
   f"Have a new category for this test, category C, with {STRESS_SPECIAL}.", W1440],
  [CATEGORIES, "Click category B's row."],
  [R(S("S7-R1", "Settings › Categories lists every category"), "Category A's, category B's and category C's names stay inside the Category column of their own rows, wrapped if needed, and never cover the Pricing Matrix column.",
     "Every column stays visible and the page does not scroll sideways.")
   + R(S("S8-N3"), "Category C's name shows character for character as typed, & \" ' < > included.")
   + look("7.3", "S7-R1", "The column headings keep their places, as in picture 7.3."),
   R(S("S7-R6", "The page has its name"), "Category B's name shows as the page title without covering the three-dot button or New Matrix.",
     "The breadcrumb, the Pricing Matrix picker and the page stay inside the window; the page does not scroll sideways.")],
  pics=["7.3", "7.8"], flags=["stress"])

C("D-149", K, "Design: a Categories search keeps the columns in place",
  [ADMIN, "Have a new category for this test, category A, named for example Quokka Parts.", W1440],
  [CATEGORIES, "Take a screenshot of the list.", "Type quokka in the search.", "Take a second screenshot of the list."],
  [look("7.3", "S7-R4", "The Categories list shows."), look("7.3", "S7-R4", "The screenshot shows every column heading."),
   R(S("S7-R4", "Search matches category and matrix names"), "Category A is listed."),
   look("7.5", "S7-R4", "Compared with the first screenshot, the column headings Category, Pricing Matrix, Default and the tiers keep their places, as pictures 7.3 and 7.5 show.", "The rows below them narrow to the matching categories.")],
  pics=["7.3", "7.5"], flags=["movement"])

# ---- page 8: categories over time -------------------------------------------------------------------------------------------
C("D-160", K, "Design: picking another matrix on a category's page",
  [ADMIN, category("A", ", on the General Matrix"), matrix("A", ", pricing two new categories made for this test, so it is shared"), W1440],
  [CATEGORIES, "Click category A's row.", "Pick matrix A in the Pricing Matrix picker."],
  [look("8.1", "S7-R9", "The Categories list shows."), look("8.1", "S7-R9", "Category A's page shows the Pricing Matrix picker with an info icon beside it."),
   R(S("S7-R9", "shows that matrix's grid, and confirms with \"<category> now uses <matrix>\" and \"Parts already on work orders keep their prices.\""),
     "A white message at the bottom right reads category A's name \"now uses\" matrix A's name, with \"Parts already on work orders keep their prices.\" under it.")
   + look("8.1", "S7-R13", "Matrix A's name labels the grid; Edit is grayed and a blue \"Go to the\" link names matrix A, as in picture 8.1.")],
  pics=["8.1"])

C("D-161", K, "Design: Uncategorized's row and its system page",
  [ADMIN, W1440],
  [CATEGORIES, "Click Uncategorized's row.", "Point at the info icon beside the title."],
  [look("8.2", "S8-R4", "Uncategorized is the first row, with a blue Default badge and an info icon, on the General Matrix with its Default badge."),
   look("8.3", "S8-R4", "The page's title is Uncategorized with an info icon, and the General Matrix's grid shows with a grayed Edit and a blue \"Go to the General Matrix\" link, as in picture 8.3."),
   R(QD("System default: always uses the General Matrix and can’t be renamed or deleted.", "8.3", "S8-R4"),
     "A dark tooltip reads \"System default: always uses the General Matrix and can't be renamed or deleted.\"")],
  pics=["8.2", "8.3"])

C("D-162", K, "Design: Uncategorized's page shows grayed matrix and Tax Exempt fields",
  [ADMIN, W1440],
  [CATEGORIES, "Click Uncategorized's row."],
  [look("8.2", "S8-R4", "The Categories list shows."),
   R(QL("8.3", "S8-R4"), "A grayed Pricing Matrix box reading General Matrix and a grayed Tax Exempt checkbox show under the title.",
     "The QuickBooks Products And Services picker shows in its usual style, as in picture 8.3.")],
  pics=["8.2", "8.3"], held_on="Q25", flags=DV)

C("D-163", K, "Design: a taken category name shows red under the title",
  [ADMIN, category("A", ", named for example Wheel Seals"), category("B"), W1440],
  [CATEGORIES, "Click category B's row.", "Click the title.", "Type category A's name in small letters.", "Press Enter."],
  [look("8.4", "S8-N3", "The Categories list shows."), look("8.4", "S8-N3", "Category B's page opens."), look("8.4", "S8-N3", "The title becomes an outlined box."),
   look("8.4", "S8-N3", "The typed name shows in the box."),
   R(S("S8-N3", "\"A category called <name> already exists\""), "Red text right under the title box reads \"A category called\", the typed name, \"already exists\".")
   + look("8.4", "S8-N3", "The box is outlined in red, as in picture 8.4.")],
  pics=["8.4"])

C("D-164", K, "Design: the New Category page, its error and its created message",
  [ADMIN, W1440],
  [CATEGORIES, "Click New Category.", "Click the blue button at the top right.", "Type a name no other category uses.", "Click the blue button at the top right."],
  [look("8.5", "S8-R10", "The Categories list shows a blue New Category button."),
   look("8.6", "S8-R10", "The breadcrumb reads Settings › Categories › New Category; a large empty name field with the placeholder \"Category name\" holds the cursor.",
        "Under it sit the Pricing Matrix picker (reading \"General Matrix (no matrix of its own)\"), an info icon, the QuickBooks Products And Services picker and Tax Exempt.",
        "Below, \"General Matrix\" with a Default badge labels the read-only grid, as in picture 8.6."),
   R(S("S19-R1", "\"{Field} is a required field\""), "Red text under the field reads \"Name is a required field\".")
   + look("8.7", "S8-R10", "The field is outlined in red, as in picture 8.7."),
   look("8.8", "S8-R10", "The name shows in the large field."),
   R(QD("Priced by General Matrix for every tier.", "8.9", "S8-R10"), "A white message at the bottom right reads the new name with \"created\" and \"Priced by General Matrix for every tier.\"")
   + look("8.9", "S8-R10", "The page now shows the name as its title, a three-dot button and New Matrix, as in picture 8.9.")],
  pics=["8.5", "8.6", "8.7", "8.8", "8.9"])

C("D-165", K, "Design: the New Category page's button reads Create Category",
  [ADMIN, W1440],
  [CATEGORIES, "Click New Category."],
  [look("8.5", "S8-R10", "The Categories list shows."),
   R(QD("Create Category", "8.6", "S8-R10"), "Cancel and a blue \"Create Category\" button sit at the top right, with no Save button, as in picture 8.6.")],
  pics=["8.5", "8.6", "8.8"], held_on="Q23", flags=DV)

C("D-166", K, "Design: the New Category name error keeps the columns in place",
  [ADMIN, W1440],
  [CATEGORIES, "Click New Category.", "Take a screenshot of the page.", "Click the blue button at the top right.", "Take a second screenshot of the page."],
  [look("8.6", "S8-R10", "The Categories list shows."), look("8.6", "S8-R10", "The New Category page shows its grid."), look("8.6", "S8-R10", "The screenshot shows the grid headings."),
   R(S("S19-R1", "\"{Field} is a required field\""), "The red \"Name is a required field\" line shows under the name."),
   look("8.7", "S8-R10", "Compared with the first screenshot, the grid's headings Cost Range, Default and the tiers keep the same left-right place; the grid only moves down by the height of the red line, as pictures 8.6 and 8.7 show.",
        "The grid shows the same rows as before.")],
  pics=["8.6", "8.7"], flags=["movement"])

C("D-167", K, "Design: deleting a category from its page",
  [ADMIN, category("A"), W1440],
  [CATEGORIES, "Click category A's row.", "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the dialog."],
  [look("8.10", "S8-R8", "The Categories list shows."), look("8.10", "S8-R8", "Category A's page opens."),
   look("8.10", "S8-R8", "A small menu opens below the button with Audit Log, then Delete in red, as in picture 8.10."),
   R(S("S8-R8", "It asks \"Delete <category>?\""), "A dialog titled \"Delete\", category A's name and \"?\" opens over a dimmed page, with an X at the top right.")
   + R(S("S8-R8", "and Cancel / Delete (red), with no counts"), "Cancel and a red Delete sit at the bottom right.")
   + look("8.11", "S8-R8", "The dialog's size and position match picture 8.11."),
   R(QD("Wipers deleted", "8.12", "S8-R8"), "The Categories list shows one category fewer, and a white message at the bottom right reads category A's name with \"deleted\", as in picture 8.12.")],
  pics=["8.10", "8.11", "8.12"])

C("D-168", K, "Design: the delete question and taken-name error as the design words them",
  [ADMIN, category("A", ", named for example Wheel Seals"), category("B"), W1440],
  [CATEGORIES, "Click category B's row.", "Open the page's three-dot menu.", "Click Delete.", "Click Cancel.", "Click the title.", "Type category A's name.", "Press Enter."],
  [look("8.11", "S8-R8", "The Categories list shows."), look("8.11", "S8-R8", "Category B's page opens."), look("8.10", "S8-R8", "The menu lists Audit Log and Delete."),
   R(QD("Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. This can’t be undone.", "8.11", "S8-R8"),
     "The dialog reads \"Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. This can't be undone.\", with no sentence about invoices already sent.")
   , look("8.11", "S8-R8", "The dialog closes."), look("8.4", "S8-N3", "The title becomes an outlined box."), look("8.4", "S8-N3", "The typed name shows."),
   R(QD("A category called tires already exists. Click away to keep Brakes.", "8.4", "S8-N3"),
     "The red error reads \"A category called\", the typed name, \"already exists. Click away to keep\" and category B's name, with a period.")],
  pics=["8.4", "8.10", "8.11"], held_on="Q24", flags=DV)
