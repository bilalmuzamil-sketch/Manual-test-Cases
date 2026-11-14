"""Story 7 — Categories: every category's pricing at a glance (SV-12459), PRD v37 lines 530-564, design page 7 (7.1-7.15) with
today's Categories list and Edit Category (boards 7.1, 7.2, drawn from production). Batch A, 14 Nov 2026.
S7-R15's "line above the grid" is drawn by the design as an info-icon tooltip (7.9): these cases follow the PRD; the design's version is a
held design case (Q18). S7-R2 short words follow S4-R31; the "Uses previous tier" hover follows S4-R3 and tech plan 1 D29 (TPX-13)."""
from tp_lib import C, R, B, S, QP, QD, QL, QT
from common import *

K = "S7"
CAT_ROW = "Click category A's row."


C("S7-01", K, "Categories list shows the matrix, Default and one column per active tier",
  [ADMIN, tier("A"), tier("B", ", archived, so the list has an archived tier to leave out", False),
   category("A", ", with no parts and no sales, on the General Matrix"), DESK],
  [CATEGORIES],
  [R(S("S7-R1", "Settings › Categories lists every category, including one with no sales or parts, with Category, Pricing Matrix, Default, then one column per active tier by number, each header with the tier's number and name."),
     "The columns read Category, Pricing Matrix, Default, then one column per active tier in number order.",
     "Each tier header shows the tier's number and name; tier A's column is the last.",
     "Category A is listed although it has no parts or sales.", "Tier B has no column.")
   + R(S("S7-R1", "Uncategorized is first. The General Matrix shows its Default badge in the Pricing Matrix column."),
       "Uncategorized is the first row.", "Category A's Pricing Matrix cell reads General Matrix with a Default badge.")],
  pics=["7.3", "7.1"])

C("S7-02", K, "Each Categories cell sums up its rule in short words",
  [ADMIN, tier("A"), tier("B", ", made right after tier A"), tier("C", ", made right after tier B"), tier("D", ", made right after tier C"),
   tier("E", ", made right after tier D"),
   matrix("A", ", pricing a new category made for this test, category A, with two ranges, $0.00 to $100.00 and from $100.01: Default on Margin % 25 in both, "
          "tier A on Markup % 30 then Markup % 20, tier B on Markup % 30 then Margin % 20, tier C on % Off 5 in both, tier D on $ Off 5 in both, tier E on Same as previous tier"),
   DESK],
  [CATEGORIES],
  [R(S("S7-R2", "Each Default and tier cell shows its Work Order Matrix rule in short, as S4-R31 sets out (\"25% margin\", \"% markup\", \"Mixed rules\", \"5% off\", \"$5 off\", \"% off\"), or \"Uses previous tier\" for a Same as previous tier column"),
     "On category A's row, Default reads \"25% margin\" (one value in every range).",
     "Tier A reads \"% markup\" (one type, different values).",
     "Tier B reads \"Mixed rules\" (different types).",
     "Tier C reads \"5% off\" and tier D reads \"$5 off\".",
     "Tier E reads \"Uses previous tier\".")],
  pics=["7.3"])

C("S7-03", K, "A Categories cell's hover lists each cost range on its own line",
  [ADMIN, tier("A"),
   matrix("A", ", pricing a new category made for this test, category A, with two ranges, $0.00 to $100.00 and from $100.01: tier A on Markup % 30 then Markup % 20"), DESK],
  [CATEGORIES, "Point at tier A's cell on category A's row."],
  [R(S("S7-R2"), "Tier A's cell on category A's row reads \"% markup\"."),
   R(S("S7-R2", "with the full rule on hover. The hover lists each cost range on its own line, for example \"$0.00 to $25.00: 35% markup\""),
     "The hover shows two lines.", "The first line reads \"$0.00 to $100.00: 30% markup\".", "The second line gives the range from $100.01 with 20% markup.")],
  pics=["7.4"])

C("S7-04", K, "A Uses previous tier cell's hover names the tier whose rule prices it",
  [ADMIN, tier("A"), tier("B", ", made right after tier A"),
   matrix("A", ", pricing a new category made for this test, category A, with tier A on % Off 10 and tier B on Same as previous tier"),
   matrix("B", ", pricing a new category made for this test, category B, with tier A and tier B both on Same as previous tier"), DESK],
  [CATEGORIES, "Point at tier B's cell on category A's row.", "Point at tier B's cell on category B's row."],
  [R(S("S7-R2"), "Tier B's cells on category A's and category B's rows read \"Uses previous tier\"."),
   R(S("S7-R2", "A \"Uses previous tier\" cell's hover reads as in S4-R3"), "The hover reads \"Uses previous tier,\" then tier A's number and name, ending with a period."),
   R(S("S7-R2", "\"Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule.\""),
     "The hover reads \"Uses previous tier,\" then tier A's number and name, then \"Priced by\" and the tier whose rule is used.")
   + R(QT("for the tier whose own rule prices the column, Default included", "TPX-13"), "When no tier before tier A has a rule of its own in matrix B, it reads \"Priced by 1 ·\" Default's current name \"'s rule.\"")],
  pics=["7.4"])

C("S7-05", K, "A Categories hover shows the work order rule, never the Part Sale rule",
  [ADMIN, tier("A"),
   matrix("A", ", pricing a new category made for this test, category A, with Separate Part Sale pricing on: tier A on % Off 10 on the Work Order Matrix and % Off 25 on the Part Sale Matrix"), DESK],
  [CATEGORIES, "Point at tier A's cell on category A's row."],
  [R(S("S7-R2", "Each Default and tier cell shows its Work Order Matrix rule in short"), "Tier A's cell on category A's row reads \"10% off\"."),
   R(S("S7-R2", "The hover shows the Work Order Matrix rule only; Part Sale rules are on the matrix page's Part Sale Matrix tab."),
     "The hover shows 10% off.", "It does not show the Part Sale rule, 25% off.")],
  pics=["7.4"])

C("S7-06", K, "Categories search matches category and matrix names",
  [ADMIN, "Have a new category for this test, category A, named for example Quokka Parts, on a new matrix made for this test, matrix A, named for example Zebra Pricing.", DESK],
  [CATEGORIES, "Type quokka in the search.", "Clear the search.", "Type ZEBRA in the search."],
  [R(S("S7-R4"), "Uncategorized is the first row."),
   R(S("S7-R4", "Search matches category and matrix names"), "Category A is listed.", "Uncategorized is hidden (its name does not contain \"quokka\")."),
   R(S("S7-R4"), "Every category shows again."),
   R([S("S7-R4", "Search matches category and matrix names"), S("S19-R18", "matches a case-insensitive substring of each field it names")],
     "Category A is listed through matrix A's name, typed in capitals.", "Categories on other matrices are hidden.")],
  pics=["7.5", "7.3"])

C("S7-07", K, "A Categories search with no match says so, with Clear Search",
  [ADMIN, DESK],
  [CATEGORIES, "Type zzqqzz in the search.", "Click Clear Search."],
  [R(S("S7-R4"), "Uncategorized is the first row."),
   R(S("S7-R4", "A search with no match says 'No categories match the search \"…\".' with Clear Search."),
     "The list area reads 'No categories match the search \"zzqqzz\".'", "A Clear Search button shows under it."),
   R(S("S7-R4"), "The search is empty.", "Every category is listed again, Uncategorized first.")],
  pics=["7.6"])

C("S7-08", K, "Categories list sorts with Uncategorized always first",
  [ADMIN, category("A", ", named for example Aardvark Parts, on a new matrix made for this test, matrix A, named for example Zebra Pricing"),
   category("B", ", named for example Zulu Parts, on the General Matrix"), DESK],
  [CATEGORIES, "Click the Category column header.", "Click the Pricing Matrix column header."],
  [R(S("S7-R4", "On first load, Uncategorized is first, then categories A to Z by name."), "Uncategorized is first, then the categories A to Z, category A near the top and category B near the end."),
   R(S("S7-R4", "the list sorts by Category or Pricing Matrix, with Uncategorized always first"), "The name order reverses to Z to A, category B above category A.", "Uncategorized is still first."),
   R(S("S7-R4", "the list sorts by Category or Pricing Matrix, with Uncategorized always first"), "The categories are sorted by their matrix name.",
     "Category B (General Matrix) comes before category A (matrix A, Zebra Pricing).", "Uncategorized is still first.")],
  pics=["7.3"])

C("S7-09", K, "Categories list loads more as you scroll and keeps search and sort",
  [ADMIN, "Use a client with more than 100 categories, so the list loads more while scrolling.", DESK],
  [CATEGORIES, "Scroll to the bottom of the list.", "Click the Pricing Matrix column header.", "Type an in the search.", "Open Settings › Pricing.", CATEGORIES],
  [R(S("S7-R4"), "The first categories show, Uncategorized first."),
   R(S("S7-R4", "The list loads as the work order list does: the same number at a time, with more loading as the user scrolls."), "More categories load at the bottom as you scroll, with no page buttons."),
   R(S("S7-R4"), "The list is sorted by Pricing Matrix."), R(S("S7-R4"), "Only categories or matrices containing \"an\" are listed."),
   R(S("S6-R11"), "Settings › Pricing opens."),
   R(S("S7-R4", "Search and sort are kept when the user comes back."), "The search still reads \"an\".", "The list is still sorted by Pricing Matrix.")],
  pics=["7.3"])

C("S7-10", K, "Clicking a category row opens its page with every field",
  [ADMIN, matrix("A", ", pricing one new category made for this test, category A, and no other"),
   "Use a client connected to QuickBooks, so the QuickBooks Products and Services field shows.", DESK],
  [CATEGORIES, "Click category A's Pricing Matrix cell.", "Open the page's three-dot menu."],
  [R(S("S7-R1"), "Category A is listed."),
   R(S("S7-R6", "Clicking anywhere on a category's row opens its page, never a dialog, with the breadcrumb Settings › Categories › <category>."),
     "Category A's page opens as a page, not a dialog.", "The breadcrumb reads Settings › Categories › and category A's name.")
   + R(S("S7-R6", "The page has its name, renamed in place; its Pricing Matrix picker; QuickBooks Products and Services (only when QuickBooks is connected, as today); Tax Exempt; New Matrix"),
       "The page shows the name as its title, a Pricing Matrix picker reading matrix A, QuickBooks Products and Services, Tax Exempt and New Matrix.")
   + R(S("S7-R6", "then the matrix's tier grid, read-only, with no simulator"), "Below them, matrix A's tier grid shows read-only, with Edit.", "No Price Part Simulator shows."),
   R(S("S7-R6", "Delete, in the page's ⋯ menu (S8-R8)"), "The menu lists Delete.")],
  pics=["7.7", "7.8", "8.10"])

C("S7-11", K, "Every field of today's Edit Category stays on the category page",
  [ADMIN, category("A", ", with Tax Exempt on and a QuickBooks Products and Services item picked"),
   "Use a client connected to QuickBooks, so today's Edit Category has its QuickBooks field.", DESK],
  [CATEGORIES, CAT_ROW],
  [R(S("S7-R1"), "Category A is listed."),
   R(S("S7-R6", "Every field today's Edit Category has stays on the page."),
     "The page shows the Name (as the title), QuickBooks Products and Services with the picked item, and Tax Exempt, on.",
     "These are the fields today's Edit Category dialog has (compare the Today picture).")],
  pics=["7.8", "7.2"])

C("S7-12", K, "Edit on a category whose matrix prices only it opens the matrix in edit",
  [ADMIN, matrix("A", ", pricing one new category made for this test, category A, and no other"), DESK],
  [CATEGORIES, CAT_ROW, EDIT],
  [R(S("S7-R1"), "Category A is listed."), R(S("S7-R6"), "Category A's page opens with matrix A's grid and Edit."),
   R(S("S7-R13", "On a category's page, Edit opens the matrix's page already in edit (S3-R25, S3-R26) when only this category uses the matrix."),
     "Matrix A's page opens with its grid already in edit.", "Cancel and Save show above the grid.")],
  pics=["7.8", "3.3"])

C("S7-13", K, "Edit is grayed on a shared matrix, with a link to the matrix",
  [ADMIN, matrix("A", ", pricing two new categories made for this test, category A and category B"), DESK],
  [CATEGORIES, CAT_ROW, "Point at the grayed Edit.", "Click \"Go to the\" link beside Edit.", "Click Cancel.", "Click category A's name in the breadcrumb."],
  [R(S("S7-R1"), "Category A is listed."),
   R(S("S7-R13", "When the matrix prices more than one category (the General Matrix included), Edit is grayed"), "Edit above the grid is grayed.",
     "Beside it a link reads \"Go to the\", matrix A's name, \"matrix\".", "Category B is also on matrix A, so the grid is shared."),
   R(S("S7-R13", "with the tooltip \"Can't edit here. The <matrix> matrix prices <n> categories, so edit it from the matrix.\""),
     "A tooltip reads \"Can't edit here. The\", matrix A's name, \"matrix prices 2 categories, so edit it from the matrix.\""),
   R(S("S7-R13", "a link beside it, \"Go to the <matrix> matrix\" (\"Go to the General Matrix\"), opens the matrix's page already in edit"),
     "Matrix A's page opens with its grid already in edit."),
   R(S("S3-R18"), "The grid returns to view."),
   R(S("S7-R13", "the breadcrumb leads back to the category"), "Category A's page opens again.")],
  pics=["7.9", "7.10", "7.11"])

C("S7-14", K, "A category on the General Matrix has a grayed Edit and a General Matrix link",
  [ADMIN, category("A", ", on the General Matrix"), "Note the count in the General Matrix's Categories cell on the Matrices list (for example 9).", DESK],
  [CATEGORIES, CAT_ROW, "Point at the grayed Edit.", "Click Go to the General Matrix."],
  [R(S("S7-R1"), "Category A is listed."),
   R(S("S7-R13", "(the General Matrix included), Edit is grayed"), "Edit is grayed.", "A link beside it reads \"Go to the General Matrix\".")
   + R(S("S7-R15", "For the General Matrix: \"The General Matrix also prices every other category without a matrix of its own (<n>).\""),
       "Above the grid a line reads \"The General Matrix also prices every other category without a matrix of its own\" with a count in brackets."),
   R(S("S7-R13", "(\"The General Matrix prices <n> categories, …\")"), "A tooltip reads \"Can't edit here. The General Matrix prices\" the noted count \"categories, so edit it from the matrix.\" (same count as the Matrices list)."),
   R(S("S7-R13", "opens the matrix's page already in edit"), "The General Matrix's page opens with its grid already in edit.")],
  pics=["7.10", "7.11"])

C("S7-15", K, "A line above the grid names the other categories the matrix prices",
  [ADMIN, matrix("A", ", pricing three new categories made for this test, category A, category B and category C"),
   matrix("B", ", pricing two new categories made for this test, category D and category E"), DESK],
  [CATEGORIES, CAT_ROW, CATEGORIES, "Click category D's row."],
  [R(S("S7-R1"), "Category A is listed."),
   R(S("S7-R15", "Above the grid, a line names the other categories the matrix prices: \"The <matrix> matrix also prices <n> other categories: <A> · <B>.\""),
     "Above the grid a line reads \"The\", matrix A's name, \"matrix also prices 2 other categories:\", then category B's and category C's names with \" · \" between them, ending with a period (3 − 1 = 2)."),
   R(S("S7-R1"), "Category D is listed."),
   R(S("S7-R15", "(\"1 other category\" for one)"), "The line reads \"The\", matrix B's name, \"matrix also prices 1 other category:\" and category E's name, ending with a period (2 − 1 = 1).")],
  pics=["7.9"], flags=["numbers"])

C("S7-16", K, "Settings Parts group lists Categories, then Pricing, then Bin Locations",
  [ADMIN, DESK],
  ["Open Settings."],
  [R(S("S7-R14", "In Settings, the Parts group lists Categories, then Pricing, then Bin Locations."),
     "The Parts group lists Categories first, then Pricing, then Bin Locations.", "Today's order (Pricing, Bin Locations, Categories) is gone.")],
  pics=["7.3", "6.2"])

C("S7-17", K, "Category name, QuickBooks item and Tax Exempt save as soon as changed",
  [ADMIN, category("A", ", with Tax Exempt off"), "Use a client connected to QuickBooks.", DESK],
  [CATEGORIES, CAT_ROW, "Click the category name at the top of the page.", "Type a new name no other category uses.", "Press Enter.",
   "Tick Tax Exempt.", "Pick another item in QuickBooks Products and Services.", RELOAD],
  [R(S("S7-R1"), "Category A is listed."), R(S("S7-R6"), "Category A's page opens."), R(S("S7-R6", "renamed in place"), "The name becomes editable in place."),
   R(S("S7-R6"), "The new name shows in the field."),
   R(S("S7-R12", "The name, the QuickBooks Products and Services mapping, Tax Exempt and the Pricing Matrix pick each save as soon as they are changed (S7-R9)."), "The title shows the new name; no Save button is needed."),
   R(S("S7-R12"), "Tax Exempt is ticked."), R(S("S7-R12"), "The new item shows in QuickBooks Products and Services."),
   R(S("S7-R12", "each save as soon as they are changed"), "After the reload the page shows the new name, Tax Exempt ticked and the new QuickBooks item.")],
  pics=["7.8"])

C("S7-18", K, "Picking another Pricing Matrix moves the category at once",
  [ADMIN, category("A", ", on the General Matrix"), matrix("A", ", which prices no category"), DESK],
  [CATEGORIES, CAT_ROW, "Pick matrix A in the Pricing Matrix picker.", CATEGORIES],
  [R(S("S7-R1"), "Category A is listed on the General Matrix."), R(S("S7-R6"), "Category A's page shows the General Matrix's grid."),
   R(S("S7-R9", "Picking a different Pricing Matrix moves the category at once, shows that matrix's grid, and confirms with \"<category> now uses <matrix>\" and \"Parts already on work orders keep their prices.\""),
     "The page shows matrix A's grid.", "A message reads category A's name, \"now uses\" and matrix A's name, with \"Parts already on work orders keep their prices.\""),
   R(S("S7-R9", "moves the category at once"), "Category A's Pricing Matrix cell reads matrix A.")],
  pics=["8.1"])

C("S7-19", K, "New Matrix on a category page opens with the category picked",
  [ADMIN, category("A", ", on the General Matrix"), DESK],
  [CATEGORIES, CAT_ROW, "Click New Matrix."],
  [R(S("S7-R1"), "Category A is listed."), R(S("S7-R6"), "Category A's page opens with New Matrix at the top right."),
   R(S("S7-R11", "New Matrix opens a new matrix page (S3-R30) with this category already picked (S3-R13)."),
     "A New Matrix page opens with an empty name field.", "Its Categories line already shows category A.")],
  pics=["7.12", "7.13"])

C("S7-20", K, "Without Settings — Parts there is no Categories page",
  ["Sign in as a user whose role has 'See Financial Data' but not 'Settings — Parts'.", DESK],
  ["Open Settings."],
  [R(S("S7-N1", "Without 'Settings — Parts', there is no Categories page, as today (S16-R8)."), "The Settings page opens.",
     "Its menu has no Categories item.")],
  nopic="no design board draws Settings without the Parts group")
