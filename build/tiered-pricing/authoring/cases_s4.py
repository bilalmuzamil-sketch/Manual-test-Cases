"""Story 4 — The tier grid: every tier of a matrix, edited in place (SV-12456), PRD v37 lines 412-461, design page 4 (4.1-4.27),
tech plan rows TPX-03 and TPX-13. Rule types, ranges and validation are Story 3; the grid on a category's page is Story 7.
A case that renames Default or saves the General Matrix puts it back in its last steps (Rule 137: organisation-wide state)."""
from tp_lib import C, R, B, S, QP, QD, QT, QL
from common import *

K = "S4"


def C4(key, sec, title, pre, steps, res, **kw):
    """C() for this file: when the steps open matrix A from the Matrices list (step 2) and the author wrote no result for that step,
    the result "Matrix A's page opens." is inserted, resting on the same source as step 1's first bullet."""
    if len(res) == len(steps) - 1 and len(steps) > 1 and steps[1] == open_matrix("A"):
        res = [res[0][:1], [B("Matrix A's page opens.", *res[0][0].src)] + list(res[0][1:])] + list(res[1:])
    C(key, sec, title, pre, steps, res, **kw)

C4("S4-01", K, "The grid shows Cost Range, Default, then each active tier by number",
  [ADMIN, tier("A"), tier("B"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), "Point at tier A's column header."],
  [R(S("S4-R1"), "Matrix A is listed."),
   R(S("S4-R1", "Columns: Cost Range, Default, then each active tier by number."), "The grid's columns are Cost Range, Default, then the active tiers in number order, tier A before tier B.")
   + R(S("S4-R1", "Rows: the matrix side's cost ranges (S3-R20)."), "Each row is one cost range of the Work Order Matrix."),
   R(S("S4-R1", "Each tier header shows its number and name, with no tooltip."), "Tier A's header shows its number and name.", "No tooltip appears on the header.")],
  pics=["3.2", "4.1"])

C4("S4-02", K, "Grid columns share the width evenly and cannot be resized",
  [ADMIN, tier("A"), tier("B"), tier("C", ", so the grid has at least three tier columns"), matrix("A"), "Use a desktop browser window 1512 pixels wide, at 100% zoom."],
  [MATRICES, open_matrix("A"), "Try to drag the border between tier A's and tier B's headers.", EDIT],
  [R(S("S4-R27"), "Matrix A is listed."),
   R(S("S4-R27", "Default and every tier column share the grid's width evenly, in view, in edit and in the Price Part Simulator."),
     "Default and every tier column are the same width as each other.")
   + R(S("S4-R27", "On a 1512-wide screen at least Default and 3 tiers show without scrolling."), "At least Default and three tier columns show without scrolling sideways."),
   R(S("S4-R27", "Columns can't be resized"), "The grid still shows every column at the same width.", "The border cannot be dragged to resize a column."),
   R(S("S4-R27", "in view, in edit and in the Price Part Simulator"), "In edit, Default and the tier columns are still the same width as each other.",
     "The simulator's Default and tier columns are the same width as each other too.")],
  pics=["3.2", "4.6"])

C4("S4-03", K, "Many tiers make the grid scroll sideways with Cost Range pinned",
  [ADMIN, "Have at least 12 active tiers in the client (make new ones for this test if needed).", matrix("A"), DESK],
  [MATRICES, open_matrix("A"), "Scroll the grid to the right."],
  [R(S("S4-R27"), "Matrix A is listed.", "Some tier columns are out of view on the right."),
   R(S("S4-R27", "Below 128px the grid scrolls sideways with Cost Range pinned"), "The grid scrolls sideways to the last tier column.", "Cost Range stays in place at the left while the other columns move.")
   + R(S("S4-R27", "The grid is never wider than 1760px."), "The grid stays inside the page; the page itself does not scroll sideways.")],
  pics=["3.2"])

C4("S4-04", K, "On a wide screen the spare width stays at the right of the grid",
  [ADMIN, tier("A", ", so the grid has a tier column"), matrix("A"), "Make sure the client has at most 4 active tiers besides Default, so the columns can reach their widest.",
   "Use a desktop browser window at least 1920 pixels wide, at 100% zoom."],
  [MATRICES, open_matrix("A")],
  [R(S("S4-R27"), "Matrix A is listed."),
   R(S("S4-R27", "above 176px the columns stop growing and the spare width stays at the right"), "The columns stop growing: an empty area stays at the right of the last column.",
     "Default and the tier columns are still the same width as each other.")],
  pics=["3.2"])

C4("S4-05", K, "Each cell shows its rule in short words",
  [ADMIN, tier("A"), tier("B"), tier("C"), tier("D"), tier("E"),
   matrix("A", ", one range: Default 35% markup, tier A 10% off, tier B $5 off, tier C Cost + $5.50, tier D 30% margin, tier E on Same as previous tier"), DESK],
  [MATRICES, open_matrix("A")],
  [R(S("S4-R3"), "Matrix A is listed."),
   R(S("S4-R3", "Each cell shows its rule in short: \"10% off\", \"$5 off\", \"Cost + $5\" (\"Cost + $5.50\" with cents), \"35% markup\", \"30% margin\"."),
     "Default reads 35% markup, tier A 10% off, tier B $5 off, tier C Cost + $5.50 and tier D 30% margin.")
   + R(S("S4-R3", "A Same as previous tier column's cells read \"Uses previous tier\""), "Tier E reads Uses previous tier.")
   + R(S("S4-R3", "There is no \"How it's priced\" row."), "The grid has no \"How it's priced\" row.", "Its rows are the cost ranges.")],
  pics=["3.2", "4.4"])

C4("S4-06", K, "Cost + $ shows no cents when the amount is whole",
  [ADMIN, tier("A"), matrix("A", ", one range, tier A Cost + $5"), DESK],
  [MATRICES, open_matrix("A")],
  [R(S("S4-R3", "\"Cost + $5\" (\"Cost + $5.50\" with cents)"), "Matrix A is listed."),
   R(S("S4-R3", "\"Cost + $5\" (\"Cost + $5.50\" with cents)"), "Tier A's cell reads Cost + $5, with no .00.")],
  pics=["4.4"])

C4("S4-07", K, "Uses previous tier hover names the tier it follows",
  [ADMIN, tier("A", ", with its own rule 10% off in matrix A"), tier("B", ", the next tier after tier A, on Same as previous tier in matrix A"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), "Point at a cell in tier B's column."],
  [R(S("S4-R3"), "Matrix A is listed.", "Tier B's cells read Uses previous tier."),
   R(S("S4-R3", "hovering one names the tier it follows, by number and name: \"Uses previous tier, 2 · Wholesale.\""),
     "A tooltip reads \"Uses previous tier,\" tier A's number, \" · \" and tier A's name, ending with a full stop.")],
  pics=["4.2"])

C4("S4-08", K, "Uses previous tier hover through a chain names the tier whose rule prices it",
  [ADMIN, tier("A", ", with its own rule 10% off in matrix A"), tier("B", ", next after tier A, on Same as previous tier in matrix A"),
   tier("C", ", next after tier B, on Same as previous tier in matrix A"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), "Point at a cell in tier C's column."],
  [R(S("S4-R3"), "Matrix A is listed."),
   R(S("S4-R3", "When that tier also uses its previous tier, the hover adds the tier whose rule actually prices it, without the tiers in between: \"Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule.\""),
     "The tooltip reads \"Uses previous tier,\" tier B's number and name, then \"Priced by\" tier A's number and name and \"'s rule.\"", "Only tier B and tier A are named, nothing in between.")],
  pics=["4.2"])

C4("S4-09", K, "A chain that ends at Default names Default's current name",
  [ADMIN, tier("A", ", the first tier after Default, on Same as previous tier in matrix A"), tier("B", ", next after tier A, on Same as previous tier in matrix A"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), "Point at a cell in tier B's column."],
  [R(S("S4-R3"), "Matrix A is listed."),
   R(QT("a chain ending at Default (\"Priced by 1 · <Default's current name>'s rule.\")", "TPX-13"), "The tooltip reads \"Uses previous tier,\" tier A's number and name, then \"Priced by 1 · Default's rule.\"")
   + R(S("S4-R15", "\"Default\" in every label is the Default tier's current name."), "If Default has been renamed, the tooltip uses that name instead of Default.")],
  pics=["4.2"])

C4("S4-10", K, "Edit turns every cell editable with an edit bar",
  [ADMIN, tier("A", ", so the grid has a tier column"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT],
  [R(S("S4-R4"), "Matrix A is listed.", "The grid is in view with an Edit button."),
   R(S("S4-R4", "Edit turns every cell editable."), "Every cell, Default and tier columns and range ends, can be typed in.")
   + R(S("S4-R4", "An edit bar shows \"No changes yet\" or \"<n> changes\", with Cancel and Save and no other button."), "An edit bar reads \"No changes yet\" with Cancel and Save, and no other button.")],
  pics=["4.5", "4.6"])

C4("S4-11", K, "The edit bar counts what the user edited, not changes undone",
  [ADMIN, tier("A"), matrix("A", ", two ranges, Default 40% markup, tier A 10% off"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 45 in Default's first range.", "Type 12 in tier A's first range.", "Type 40 in Default's first range."],
  [R(S("S4-R4"), "Matrix A is listed."), R(S("S4-R4"), "The bar reads \"No changes yet\"."),
   R(S("S4-R4", "each cell they changed whose value now differs"), "The bar reads 1 change (1 cell differs)."),
   R(S("S4-R4", "each cell they changed whose value now differs"), "The bar reads 2 changes (1 + 1 = 2)."),
   R(S("S4-R4", "The count is what the user edited, measured against the last saved version, so a value changed and then changed back doesn't count"), "The bar reads 1 change again (2 − 1 = 1): Default's cell is back to 40.")],
  pics=["4.22"], flags=["numbers"])

C4("S4-12", K, "Range changes count once each and filled values do not count",
  [ADMIN, tier("A"), matrix("A", ", three ranges, Default 40% markup, tier A on Same as previous tier"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Change the first range's end to a new value.", "Click Add Range.", "Click the second range's delete button.", "Type 50 in Default's first range."],
  [R(S("S4-R4"), "Matrix A is listed."), R(S("S4-R4"), "The bar reads \"No changes yet\"."),
   R(S("S4-R4", "each range end that differs"), "The bar reads 1 change."),
   R(S("S4-R4", "each range added or removed"), "The bar reads 2 changes (1 + 1)."),
   R(S("S4-R4", "each range added or removed"), "The bar reads 3 changes (2 + 1)."),
   R(S("S4-R4", "Gray auto-filled values and cells that change only because they follow another column (Same as previous tier) don't count."),
     "The bar reads 4 changes (3 + 1).", "The gray values filled below and tier A's following cells add nothing to the count.")],
  pics=["4.19", "4.20", "4.21", "4.22"], flags=["numbers"])

C4("S4-13", K, "A tier's rule picker lists Previous tier and the five rules in order",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Open tier A's rule picker under its header."],
  [R(S("S4-R5"), "Matrix A is listed."), R(S("S4-R5", "In edit, each column's rule picker sits under its name in the header."), "Each column shows a rule picker under its name."),
   R(S("S4-R5", "A tier's picker lists, in order: Previous tier (Same as previous tier); Off default price: % Off, $ Off; From cost: + $, Markup %, Margin %."),
     "The picker lists, in this order: Previous tier, then a group Off default price with % Off and $ Off, then a group From cost with + $, Markup % and Margin %.")],
  pics=["4.9"])

C4("S4-14", K, "Picking a rule type sets every range of the column and clears it",
  [ADMIN, tier("A"), matrix("A", ", three ranges, tier A on Markup % with 5, 6 and 7"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Pick % Off in tier A's rule picker."],
  [R(S("S4-R5"), "Matrix A is listed."), R(S("S4-R5"), "Tier A shows Markup % with 5, 6 and 7."),
   R(S("S4-R5", "Picking a type applies it to every range of the column and clears its values."), "All three of tier A's ranges switch to % Off.")
   + R(S("S4-R7", "% Off and $ Off start empty in every range"), "All three of tier A's ranges are empty, ready for values.")],
  pics=["4.11"])

C4("S4-15", K, "Default's rule picker offers only From cost rules",
  [ADMIN, matrix("A"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Open Default's rule picker."],
  [R(S("S4-N1"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S4-N1", "Default's picker lists only the From cost types (+ $, Markup %, Margin %): Default has no Same as previous tier, % Off or $ Off."),
     "Default's picker lists + $, Markup % and Margin %.", "It has no Previous tier, no % Off and no $ Off.")],
  pics=["4.10"])

C4("S4-16", K, "Each range can pick its own From cost type, making Mixed rules",
  [ADMIN, matrix("A", ", two ranges, Default on Markup % 40 in both"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click the % symbol picker in Default's second range.", "Pick Margin % in that symbol picker.", "Type 15 in Default's second range.", SAVE],
  [R(S("S4-R28"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S4-R28", "In edit, a From cost cell's symbol ($ before the value for + $, % after it for Markup % and Margin %) is a small picker with + $, Markup % and Margin %."),
     "A small picker opens on the cell with + $, Markup % and Margin %."),
   R(S("S4-R28", "Picking one changes that range only and clears its value."), "Only the second range changes to Margin %, with an empty value; the first range keeps Markup % 40."),
   R(S("S4-R28", "Once a column's ranges use different types, its header picker shows \"Mixed rules\" as its current value (never offered as a choice)"), "Default's header picker now shows Mixed rules."),
   R(S("S4-R28", "its cells each show their own value with their own type (\"35% markup\", \"30% margin\")"), "In view, Default reads 40% markup in the first range and 15% margin in the second.")
   + R(S("S4-R28", "and the column reads \"Mixed rules\" in view and on the Categories list"), "The column is summed up as Mixed rules where it is summed up (the matrix's category on the Categories list).")],
  pics=["4.13", "4.14", "4.15", "4.4"])

C4("S4-17", K, "Mixed rules is never offered and the header type resets the column",
  [ADMIN, matrix("A", ", two ranges, Default 40% markup then 15% margin"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Open Default's header rule picker.", "Pick Markup %."],
  [R(S("S4-R28"), "Matrix A is listed."), R(S("S4-R28"), "Default's header picker shows Mixed rules."),
   R(S("S4-R28", "(never offered as a choice)"), "The picker lists + $, Markup % and Margin %.", "Mixed rules is not one of the choices."),
   R(S("S4-R28", "Picking a type in the header makes the whole column that type again."), "Both of Default's ranges are now Markup %.")],
  pics=["4.15", "4.10"])

C4("S4-18", K, "Summary labels: one value, a type alone, or Mixed rules",
  [ADMIN, tier("A"), matrix("A", ", tier A 35% markup in every range"), matrix("B", ", tier A Markup % with different values per range"),
   matrix("C", ", tier A Markup % in one range and Margin % in another"), DESK],
  [TIERS, open_tier("A")],
  [R(S("S4-R31"), "Tier A is listed."),
   R(S("S4-R31", "One rule, the same value in every range: the value with its type"), "Matrix A's Work Order Matrix value reads 35% markup.")
   + R(S("S4-R31", "Several ranges, all one type, with different values: the type alone, with no value"), "Matrix B's reads % markup.")
   + R(S("S4-R31", "Ranges of different types: \"Mixed rules\"."), "Matrix C's reads Mixed rules.")],
  pics=["2.32"])

C4("S4-19", K, "% Off and $ Off cells have no symbol picker",
  [ADMIN, tier("A"), tier("B"), matrix("A", ", tier A on % Off, tier B on $ Off"), DESK],
  [MATRICES, open_matrix("A"), EDIT],
  [R(S("S4-R31"), "Matrix A is listed."),
   R(S("S4-R31", "% Off and $ Off cells have no symbol picker: an Off default price column uses one type."), "Tier A's cells show a fixed \"% off\" with no picker chevron.",
     "Tier B's cells show a fixed \"$ off\" with no picker chevron, while Default's cells do have a symbol picker.")],
  pics=["4.6", "4.13"])

C4("S4-20", K, "Tab moves down a column and on to the next column",
  [ADMIN, tier("A", ", so Tab can move on to a tier column"), matrix("A", ", three ranges"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click Default's first range.", "Press Tab.", "Press Tab.", "Press Tab.", "Press Shift+Tab."],
  [R(S("S4-R29"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R29"), "Default's first range has focus."),
   R(S("S4-R29", "In edit, Tab moves down the column: from a range to the next range of the same tier"), "Focus moves to Default's second range."),
   R(S("S4-R29"), "Focus moves to Default's third range."),
   R(S("S4-R29", "and from the last range to the first range of the next column"), "Focus moves to the first range of the next column (tier columns after Default)."),
   R(S("S4-R29", "Shift+Tab goes back up."), "Focus goes back to Default's third range.")],
  nopic="the design draws no keyboard focus")

C4("S4-21", K, "Tab works down the range ends, and Alt+Down opens a rule picker",
  [ADMIN, matrix("A", ", three ranges, Default on Markup %"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click the first range's end.", "Press Tab.", "Click Default's first range value.", "Press Alt+Down."],
  [R(S("S4-R29"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R29"), "The first range's end has focus."),
   R(S("S4-R29", "The range ends in the Cost Range column work the same way."), "Focus moves to the second range's end."),
   R(S("S4-R29"), "Default's first value has focus."),
   R(S("S4-R29", "On a From cost value, Alt+Down opens that range's rule picker (S4-R28), as on any dropdown."), "That range's symbol picker opens with + $, Markup % and Margin %.")],
  pics=["4.13"])

C4("S4-22", K, "% Off and $ Off take each range off Default's price in that range",
  [ADMIN, tier("A"), tier("B"), matrix("A", ", two ranges: $0.00 to $100.00 Default 50% markup, $100.01 and up Default 20% markup; tier A % Off 10 then 5; tier B $ Off 15 then 20"), DESK],
  [MATRICES, open_matrix("A"), "Type 100 in the Price Part Simulator's Part Cost.", "Type 200 in the Part Cost."],
  [R(S("S4-R7"), "Matrix A is listed."),
   R(S("S4-R7", "% Off and $ Off give each cost range its own value, taken off Default's sell price in that range."),
     "Default shows $150.00 ($100.00 × 1.50).", "Tier A shows $135.00 ($150.00 × 0.90).", "Tier B shows $135.00 ($150.00 − $15.00)."),
   R(S("S4-R7", "taken off Default's sell price in that range"), "Default shows $240.00 ($200.00 × 1.20).", "Tier A shows $228.00 ($240.00 × 0.95).", "Tier B shows $220.00 ($240.00 − $20.00).")],
  pics=["4.6", "5.1"], flags=["numbers"])

C4("S4-23", K, "Typing a value fills the empty ranges below in gray",
  [ADMIN, tier("A"), matrix("A", ", four ranges, tier A on % Off with every range empty"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 8 in tier A's first range.", "Type 12 in tier A's third range over the gray 8.", "Type 10 in tier A's first range.", SAVE],
  [R(S("S4-R26"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S4-R26", "In edit, typing a value in a range fills every range below it that is empty or was filled this way, in gray, with the same rule type and value."),
     "Tier A's ranges 2, 3 and 4 show 8 in gray."),
   R(S("S4-R26", "A gray value can be typed over"), "Range 3 reads 12 in normal text; range 4 now shows 12 in gray."),
   R(S("S4-R26", "a range typed over is left alone afterwards"), "Range 2 shows 10 in gray.", "Range 3 keeps 12 and range 4 keeps the gray 12, not 10."),
   R(S("S4-R26", "Save saves every range, gray values included."), "In view tier A reads 10% off, 10% off, 12% off and 12% off.")],
  pics=["4.7", "4.8"])

C4("S4-24", K, "Auto-fill follows the last range entered in the column",
  [ADMIN, matrix("A", ", four ranges, Default with every range empty (a new matrix made for this test)"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 5 in Default's first range with + $ picked.", "Pick Markup % in the second range's symbol picker.", "Type 45 in Default's second range."],
  [R(S("S4-R26"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R26"), "Ranges 2, 3 and 4 show $5 in gray."), R(S("S4-R28"), "Range 2 is Markup % with an empty value."),
   R(S("S4-R26", "Auto-fill always follows the last range entered in that column: if range 1 is + $ and range 2 is Markup %, ranges 3 and below follow range 2."),
     "Ranges 3 and 4 now show 45 % markup in gray, following range 2, not $5.")],
  pics=["4.8"])

C4("S4-25", K, "Choosing Previous tier copies the previous tier's values",
  [ADMIN, tier("A", ", the first tier after Default"), matrix("A", ", two ranges, Default Margin % 40 then 32, tier A Margin % 25 in both"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Pick Previous tier in tier A's rule picker.", SAVE],
  [R(S("S4-R10"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S4-R10", "Choosing Same as previous tier fills the column's cells with what the previous tier pays in this matrix (down to Default when that tier is itself Same as previous tier), editable."),
     "Tier A's cells show 40 and 32 % margin, Default's values, and can be typed in."),
   R(S("S4-R10", "Saved with those values unchanged, the tier keeps following the previous tier (\"Uses previous tier\" in view)."), "In view tier A's cells read Uses previous tier.")],
  pics=["4.12", "4.16", "4.17"])

C4("S4-26", K, "Changing a copied value makes the tier's own rules",
  [ADMIN, tier("A", ", the first tier after Default, on Same as previous tier in matrix A"), matrix("A", ", two ranges, Default Margin % 40 then 32"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 38 in tier A's first range.", SAVE, "Type 45 in Default's first range after clicking Edit."],
  [R(S("S4-R10"), "Matrix A is listed.", "Tier A reads Uses previous tier."), R(S("S4-R10"), "Tier A's cells show Default's 40 and 32."),
   R(S("S4-R10"), "Tier A's first range reads 38."),
   R(S("S4-R10", "With any value changed, it saves as the tier's own rules starting from the copied rule types and values."), "In view tier A reads 38% margin and 32% margin as its own rules."),
   R(S("S4-R10", "it saves as the tier's own rules"), "Tier A keeps 38 and 32 when Default changes to 45.")],
  pics=["4.17"])

C4("S4-27", K, "Save shows a message naming the change",
  [ADMIN, tier("A"), matrix("A", ", pricing one new category made for this test, tier A on Margin % 25 in every range"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Pick Margin % in tier A's rule picker.", "Type 28 in tier A's first range.", SAVE, "Open Settings › Categories.", "Click matrix A's name on the Matrices list after opening Settings › Pricing."],
  [R(S("S4-R12"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R5"), "Tier A's ranges are Margin % and empty."), R(S("S4-R26"), "Tier A's ranges show 28 (typed and gray)."),
   R(S("S4-R12", "The success toast reads \"<matrix> saved\" with what changed and \"Parts already on work orders keep their prices.\", for example \"1 change: Tier 5 is 28% margin.\""),
     "A message reads matrix A's name followed by \"saved\", then \"1 change:\" tier A's name \"is 28% margin.\" and \"Parts already on work orders keep their prices.\"")
   + R(S("S4-R12", "The grid returns to view."), "The grid returns to view.")
   + R(S("S4-R20", "After Save, the cells whose rule changed stay highlighted until the user leaves the page."), "Tier A's changed cells are highlighted."),
   R(S("S4-R20"), "The Categories page opens."),
   R(S("S4-R20", "stay highlighted until the user leaves the page"), "Matrix A's page opens with no cell highlighted, while the grid shows tier A at 28% margin.")],
  pics=["3.11", "3.12"])

C4("S4-28", K, "The save message names three changes, then and n more",
  [ADMIN, tier("A"), tier("B"), matrix("A", ", pricing one new category made for this test, two ranges, Default 35% markup"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type 40 in Default's first range.", "Type 10 in tier A's first range after picking % Off.", "Type 12 in tier B's first range after picking % Off.", "Click Add Range.", SAVE],
  [R(S("S4-R12"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts the change."), R(S("S4-R4"), "The bar counts more changes."),
   R(S("S4-R4"), "The bar counts more changes."), R(S("S4-R4"), "The bar counts one more change for the range."),
   R(S("S4-R12", "It names up to three changes, then \"and <n> more\", for example \"3 changes: Tier 5 is 28% margin; Default is 35% markup; 1 range added.\""),
     "The message says how many changes in total and names three of them, then \"and\" the rest as a number with \"more\" (total − 3 = n).")
   + R(S("S4-R12", "Gray auto-filled ranges are saved but not counted, so a save can change more ranges than the count names."), "The gray values filled below are saved but not counted.")],
  pics=["3.12"], flags=["numbers"])

C4("S4-29", K, "Renaming Default renames every Default label but the badge",
  [ADMIN, tier("A"), matrix("A"), "Make sure Default has its original name, Default.", DESK],
  [TIERS, "Click Default's row.", "Click Default's name at the top of the page.", "Type Retail.", "Press Enter.", MATRICES, open_matrix("A"), EDIT, "Open tier A's rule picker.", "Click Cancel.",
   TIERS, "Click Retail's row.", "Click Retail's name at the top of the page.", "Type Default.", "Press Enter."],
  [R(S("S4-R15"), "Default is row 1."), R(S("S2-R28"), "Default's page opens."), R(S("S2-R5"), "The name can be edited."), R(S("S2-R5"), "The field reads Retail."), R(S("S2-R5"), "The title reads Retail."),
   R(S("S4-R15", "The Default badge keeps reading \"Default\"."), "The General Matrix still carries a badge reading Default."),
   R(S("S4-R15", "If a client renames Default to \"Retail\", the column, the \"Off Retail price\" group heading and every price detail follow."), "Matrix A's second column is headed 1 · Retail."),
   R(S("S4-R4"), "The grid is in edit."),
   R(S("S4-R15", "the \"Off Retail price\" group heading"), "The picker's group heading reads Off Retail price, above % Off and $ Off."),
   R(S("S3-R25"), "The grid returns to view."), R(S("S2-R14"), "Row 1 reads Retail."), R(S("S2-R28"), "Retail's page opens."), R(S("S2-R5"), "The name can be edited."),
   R(S("S2-R5"), "The field reads Default."), R(S("S2-R5"), "The title reads Default again.")],
  pics=["4.9", "2.37"])

C4("S4-30", K, "Changing Default's rules names every tier that prices from Default",
  [ADMIN, tier("A", ", the first tier after Default, on Same as previous tier in matrix A"), tier("B", ", on % Off 10 in matrix A"),
   tier("C", ", on Markup % 30 in matrix A"), matrix("A", ", pricing one new category made for this test"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", SAVE, "Click Cancel in the dialog."],
  [R(S("S4-R30"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R30", "Alone it asks \"Change Default's Prices?\" with \"Parts already on work orders keep their prices.\" and Cancel / Save."),
     "A dialog titled \"Change Default's Prices?\" opens with Cancel and Save and the line \"Parts already on work orders keep their prices.\"")
   + R(S("S4-R30", "They are listed one per line under \"Default's rules change, and these <n> tiers price from Default in this matrix, so they change too:\""),
       "It reads \"Default's rules change, and these 2 tiers price from Default in this matrix, so they change too:\" with tier A and tier B one per line.")
   + R(S("S4-R30", "a tier on % Off or $ Off, and a tier on Same as previous tier that reaches Default or such a tier"), "Tier C (its own Markup %) is not listed, while tier A and tier B are (1 + 1 = 2)."),
   R(S("S4-R30"), "The dialog closes and the grid is still in edit with the new value.")],
  pics=["3.7"], flags=["numbers"])

C4("S4-31", K, "One tier pricing from Default is named in the singular",
  [ADMIN, tier("A", ", on % Off 10 in matrix A"), matrix("A", ", pricing one new category made for this test, every other tier with its own Markup % rule"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", SAVE, "Click Save in the dialog."],
  [R(S("S4-R30"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R30", "(\"this tier prices … so it changes too\" for one)"), "The dialog says this tier prices from Default in this matrix, so it changes too, and lists tier A alone."),
   R(S("S4-R12"), "The grid saves and the saved message shows.")],
  pics=["3.7", "3.14"])

C4("S4-32", K, "No tier pricing from Default means no extra question",
  [ADMIN, tier("A", ", on Markup % 30 in matrix A"), matrix("A", ", pricing one new category made for this test, every tier with its own Markup % or Margin % rule"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", SAVE],
  [R(S("S4-R30"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R30", "With no such tier, nothing extra is asked."), "The grid saves straight away and the saved message shows.", "No Change Default's Prices question appears.")],
  pics=["3.12"])

C4("S4-33", K, "Adding a range counts as a change to Default's rules",
  [ADMIN, tier("A", ", on % Off 10 in matrix A"), matrix("A", ", pricing one new category made for this test"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click Add Range.", SAVE],
  [R(S("S4-R30"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R30", "Adding or removing a range, or moving a range's end, is a change to Default's rules (S3-R20)."), "The Change Default's Prices? dialog opens and lists tier A.")],
  pics=["4.20", "3.7"])

C4("S4-34", K, "Saving a shared matrix asks to change prices in every category",
  [ADMIN, matrix("A", ", pricing three new categories made for this test, category A, category B and category C, every tier with its own Markup % rule"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", SAVE, "Click Change All.", CATEGORIES],
  [R(S("S4-R16"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R16", "Saving the grid of a matrix used by more than one category asks \"Change Prices in <n> Categories?\" with \"The <matrix> matrix prices <n> categories:\", every category on its own line, then \"Saving changes prices in all <n>. Parts already on work orders keep their prices.\" and Cancel / Change All."),
     "A dialog titled \"Change Prices in 3 Categories?\" opens.", "It reads \"The\" matrix A's name \"matrix prices 3 categories:\" with category A, category B and category C one per line.",
     "Then it reads \"Saving changes prices in all 3. Parts already on work orders keep their prices.\" with Cancel and Change All.")
   + R(S("S4-R16", "It never counts parts or customers."), "The dialog counts categories only: it shows no number of parts or customers, while the 3 categories are listed."),
   R(S("S4-R22", "Change All saves the edited grid for every category using the matrix."), "The grid saves and the saved message shows."),
   R(S("S4-R22"), "Category A, category B and category C each show the new Default value in their Default column.")],
  pics=["3.13", "4.24"])

C4("S4-35", K, "A shared matrix's question also lists the tiers that price from Default",
  [ADMIN, tier("A", ", on % Off 10 in matrix A"), matrix("A", ", pricing two new categories made for this test"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", SAVE],
  [R(S("S4-R30"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R30", "For a matrix used by more than one category the list joins the Change Prices question (S4-R16)"),
     "One dialog opens, \"Change Prices in 2 Categories?\", listing both categories and, below, the tiers that price from Default (tier A among them).", "Its buttons are Cancel and Change All.")],
  pics=["3.13", "4.24"])

C4("S4-36", K, "Saving the General Matrix confirms and counts its categories",
  [ADMIN, "Note how many categories Settings › Categories shows on the General Matrix, Uncategorized included (for example 9).",
   "Note the General Matrix's Default value in its first range, to put it back at the end.", DESK],
  [MATRICES, "Click the General Matrix's name.", EDIT, "Type a new value in Default's first range.", SAVE, "Click Save in the dialog.", EDIT, "Type the noted value in Default's first range.", SAVE, "Click Save in the dialog."],
  [R(S("S4-R18"), "The General Matrix is listed."), R(S("S4-R18"), "The General Matrix page opens."), R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R18", "Saving the General Matrix never asks Change All; it always saves for every category without a matrix of its own. It confirms first: \"Save the General Matrix?\" with \"This changes prices for <n> categories without a matrix of their own.\" and Cancel / Save."),
     "A dialog titled \"Save the General Matrix?\" opens with Cancel and Save, not Change All.")
   + R(S("S4-R18", "n counts the categories without a matrix of their own, Uncategorized included."), "It reads \"This changes prices for 9 categories without a matrix of their own.\" (the noted 9, Uncategorized included: 9 = 9)."),
   R(S("S4-R18", "it always saves for every category without a matrix of its own"), "The grid saves and the saved message shows."),
   R(S("S4-R4"), "The grid is in edit."), R(S("S4-R4"), "The bar counts 1 change."), R(S("S4-R18"), "The same confirmation opens."),
   R(S("S4-R18"), "The General Matrix is back to the noted value.")],
  pics=["3.14"], flags=["numbers"])

C4("S4-37", K, "Edit from an archived tier opens the archived grid view",
  [ADMIN, tier("A", ", archived first", True), tier("B", ", archived after tier A", True), matrix("A", ", tier A 45% markup, tier B on Same as previous tier, Default 40% margin"), DESK],
  [TIERS, open_tier("A"), "Click Edit on matrix A's row.", "Point at a cell in tier B's column."],
  [R(S("S4-R19"), "Tier A shows among the archived rows."), R(S("S2-R20", "On an archived tier's page, Edit opens the archived grid view (S4-R19)."), "Tier A's page opens with Archived beside its name."),
   R(S("S4-R19", "Edit on an archived tier's Pricing tab opens that matrix's grid in an archived view: Default plus every archived tier as columns, laid out like the active grid, with archived tiers in the order they were archived, earliest first"),
     "The grid shows Default, then tier A, then tier B (archived first, earliest first).", "No active tier column shows.")
   + R(S("S4-R19", "A notice at the top reads \"Archived tiers don't price parts. Reactivate a tier and assign customers to use these rules.\""),
       "A notice at the top reads \"Archived tiers don't price parts. Reactivate a tier and assign customers to use these rules.\"")
   + R(S("S4-R19", "The Price Part Simulator shows under the archived grid for the columns shown"), "The Price Part Simulator under it shows Default, tier A and tier B."),
   R(S("S4-R19", "In the archived view, a Same as previous tier column follows the column directly to its left, as in an active grid; for the first archived tier that is Default."),
     "Tier B's cells read Uses previous tier and follow tier A, the column to its left.")],
  pics=["4.25", "4.26"])

C4("S4-38", K, "The archived simulator prices with the column-to-the-left chain",
  [ADMIN, tier("A", ", archived, on Same as previous tier in matrix A", True), matrix("A", ", one range, Default 50% markup"), DESK],
  [TIERS, open_tier("A"), "Click Edit on matrix A's row.", "Type 100 in the Price Part Simulator's Part Cost."],
  [R(S("S4-R19"), "Tier A shows among the archived rows."), R(S("S4-R19"), "Tier A's page opens."),
   R(S("S4-R19", "for the first archived tier that is Default"), "The archived view shows Default and tier A; tier A reads Uses previous tier."),
   R(S("S4-R19", "priced the same way, so someone deciding whether to reactivate a tier can see how it would price parts against Default"),
     "Default shows $150.00 ($100.00 × 1.50) and tier A shows $150.00, the same as Default, its column to the left.")],
  pics=["4.26"], flags=["numbers"])

C4("S4-39", K, "In the archived view Default and the ranges are read only",
  [ADMIN, tier("A", ", archived, with its own rule 45% markup in matrix A", True), matrix("A", ", pricing two new categories made for this test"), DESK],
  [TIERS, open_tier("A"), "Click Edit on matrix A's row.", "Point at Default's column.", "Type 50 in tier A's first range.", SAVE],
  [R(S("S4-R32"), "Tier A shows among the archived rows."), R(S("S4-R32"), "Tier A's page opens."),
   R(S("S4-R19", "only the archived tiers' columns can be edited (S4-R32)"), "Tier A's cells can be typed in.") + R(S("S4-R32", "In the archived grid view, Default's column and the cost ranges are read-only"), "Default's cells and the range ends cannot be typed in, while tier A's can."),
   R(S("S4-R32", "Default's column shows the tooltip \"Default prices live parts, so it can't be changed in the archived view.\""), "A tooltip reads \"Default prices live parts, so it can't be changed in the archived view.\""),
   R(S("S4-R4"), "Tier A's first range reads 50; the bar counts 1 change."),
   R(S("S4-R32", "Saving changes only archived tiers, so it never asks Change Prices (S4-R16), the General Matrix confirmation (S4-R18) or the Default question (S4-R30)."),
     "The archived view saves straight away.", "No Change Prices question appears although matrix A prices two categories.")],
  pics=["4.26", "4.27"])

C4("S4-40", K, "Saving the active grid keeps archived tiers' rules",
  [ADMIN, tier("A", ", archived, with its own rule 45% markup in matrix A", True), matrix("A", ", one range, pricing one new category made for this test"), DESK],
  [MATRICES, open_matrix("A"), EDIT, "Type a new value in Default's first range.", "Click Add Range.", SAVE, TIERS, open_tier("A"), "Click Edit on matrix A's row."],
  [R(S("S4-R19"), "Matrix A is listed."), R(S("S4-R19", "Active grids never show archived tiers"), "The active grid shows no column for tier A, while Default and the active tiers show."),
   R(S("S4-R4"), "The bar counts 1 change."), R(S("S4-R4"), "The bar counts 2 changes."), R(S("S4-R12"), "The grid saves."),
   R(S("S2-R14"), "Tier A shows among the archived rows."), R(S("S2-R28"), "Tier A's page opens."),
   R(QT("An active-view save writes Default and the active tiers only", "TPX-03"), "Tier A still reads 45% markup in its first range.")
   + R(QT("an added range (copies the range above", "TPX-03"), "Tier A's new range also reads 45% markup, copied from the range above.")
   + R(S("S4-R19", "an archived tier's rules are kept and come back with its column when it is reactivated (S2-R6)"), "Tier A's own rule was kept through the active save.")],
  pics=["4.20", "4.26"])

C4("S4-41", K, "A tier made while a grid is in edit appears after Save as previous tier",
  [ADMIN, matrix("A"), "Open Settings › Pricing in a second browser tab.", DESK],
  [MATRICES, open_matrix("A"), EDIT, "Click New Tier in the second tab.", "Type a name no other tier uses in the second tab.", "Click Create Tier in the second tab.", "Type a new value in Default's first range in the first tab.",
   SAVE],
  [R(S("S4-E3"), "Matrix A is listed."), R(S("S4-R4"), "The grid is in edit."), R(S("S2-R17"), "The second tab shows the New Tier page."), R(S("S2-R17"), "The name shows."),
   R(S("S2-R17"), "The new tier is created in the second tab."), R(S("S4-R4"), "The first tab's bar counts 1 change; the grid has no column for the new tier yet."),
   R(S("S4-E3", "A tier created while a grid is open in edit appears after the grid is saved or cancelled, as Same as previous tier."),
     "After the save the grid shows a column for the new tier, last, reading Uses previous tier.")],
  pics=["4.6", "2.17"])
