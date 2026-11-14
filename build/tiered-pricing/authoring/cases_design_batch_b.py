"""Design — how it looks, pages 10, 11, 13 and 20 (Story 10 work order lines, Story 11 repricing, Story 13 Part Sales, Sales by Tier and Sales by
Category), batch B, phase 2, 14 Nov 2026. Design "Tiered Pricing Design" 1794631438-539a (identical files in 1794638838-cd70); every board of these
pages was viewed when assigned (reduced montages, 14 Nov 2026). Each case names the picture(s) to compare with at 100% zoom; every look result is an
eye check (no pixel ruler, no devtools; Rule 126 point 8). Words come from the PRD where it has the sentence and from the board where the PRD is
silent (QA lead's precedence, 14 Nov 2026). Held "design version" cases (Rule 130) carry the design's own version where it differs from the PRD,
held on their question candidate (po_questions_batch_b.py, Q30). §6d line 9: stress names on every page-10/11/13/20 surface that shows a typed name;
line 10: before-and-after checks of every state change the design's own pictures show (proof §6b), held on Q31 where something moves unsettled.

Key ranges: D-400…D-699 (batch B)."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, HOLD
from common import *
from cases_s10 import WOA, PSA, RPA, MX, TR, CU, WO, PS, OPENWO, ADDP, PARTS, HOVER

K = "DESIGN"
CMP = "compared with the design picture at 100% zoom"
T50SP = "a long name with spaces of exactly 50 characters (for example Northern Alberta Heavy Equipment Fleet Pricing Tier)"
T50NO = "a long name with no spaces of exactly 50 characters (for example NorthernAlbertaHeavyEquipmentFleetPricingTierPlanX)"
TSPEC = "a name with the characters & \" ' < > in it (for example A&B \"Fleet\" O'Neil <Tier>)"
NOSIDE = "Every column stays visible and the page does not scroll sideways."
SBT = "Open Reports › Sales by Tier."


def look(board, row, *texts):
    return R(QL(board, row), *texts)


# ---- page 10: pricing parts on a work order ----------------------------------------------------------------------------------
C("D-400", K, "Design: work order lines after the release, gray icon on typed prices only",
  [WOA, MX(), TR(), CU(), WO("1", "A", ", with a tier-priced part in category A and a part with a typed price on line 1"), W1440],
  [OPENWO()],
  [look("10.5", "S10-R1", "The Lines tab shows each part's number in brackets, its description, quantity, sell price, margin and total, as in picture 10.5.",
        f"Fonts, spacing and alignment match picture 10.5 {CMP}.")
   + R(S("S12-R10", "A gray Manual icon always shows beside a Manual price, and only there"), "A small gray icon shows beside the typed price only.",
       "The tier-priced part's price has no icon.")
   + R(S("S12-R3", "The work order Lines tab opens the details from its part rows' prices but has no Priced by column."), "The Lines tab has no Priced by column.",
       "Its columns read Name/Description, Actual/Estimate, Progress, Status, Action, Rate, Margin and Total.")],
  pics=["10.5", "today:10.1"])

C("D-401", K, "Design: the Quick Add row and its sell price filling in",
  [WOA, MX(), TR(), CU(), WO(), W1440],
  [OPENWO(), "Click Add Part under line 1.", "Pick category A in Category.", "Type 100.00 in Cost."],
  [R(S("S10-R1"), "Work order 1 opens."),
   look("10.6", "S10-R1", "One row opens under the line with boxes Part number, Description *, Qty *, Category, Cost and Sell price, and Save, Cancel and More Options under them, as in picture 10.6."),
   R(S("S10-R17"), "Category reads category A."),
   R(QD("Its sell price fills in from the tier as soon as the cost is typed.", "10.6", "S10-R1"), "Sell price fills in with 121.50.")
   + R(S("S12-R8", "While a part is being added (Quick Add, the inline row), no pricing source shows."), "No Priced by text or Manual icon shows in the row.", "The Save button is blue.")],
  pics=["10.6", "10.7", "today:10.2", "today:10.3"])

C("D-402", K, "Design: the Part added toast names the price and the tier",
  [WOA, MX(), TR(), CU(), WO(), W1440],
  [OPENWO(), ADDP()],
  [R(S("S10-R1"), "Work order 1 opens."),
   R(QD("Part added", "10.8", "S10-R1"), "A toast at the bottom right reads \"Part added\" with a green check.")
   + R(QD("$308.00 each, priced by Tier 2.", "10.8", "S10-R1"), "Its second line reads \"$121.50 each, priced by\" and tier A's name, ending with a period, in the form of picture 10.8.")
   + look("10.8", "S10-R1", "The new part shows as the line's last part, as in picture 10.8.")],
  pics=["10.8"])

C("D-403", K, "Design: Quick Add's negative price message under Sell price",
  [WOA, MX(), CU("B", "Default"), WO("1", "B"), W1440],
  [OPENWO(), "Click Add Part under line 1.", "Fill the row with category A, cost 100.00 and sell price -5.", "Click Save."],
  [R(S("S11-E5"), "Work order 1 opens."), R(S("S11-E5"), "The add row opens."), R(S("S11-E5"), "The row shows sell price -5."),
   R(S("S11-E5", "Quick Add blocks it (\"Sell price cannot be negative.\"), as today."), "Under the Sell price box it reads \"Sell price cannot be negative.\" in red.")
   + look("10.9", "S11-E5", "The Sell price box has a red outline and the message sits right under it, as in picture 10.9.", "The row stays open with Save, Cancel and More Options.")],
  pics=["10.9", "today:10.2"])

C("D-404", K, "Design: a no-cost part shows $0.00 and 0.0% with no icon",
  [WOA, MX(), TR(), CU(), WO(), W1440],
  [OPENWO(), "Add a part to line 1 with category A and no cost."],
  [R(S("S10-R1"), "Work order 1 opens."),
   R(S("S10-N1", "the sell price is $0.00"), "The part shows $0.00 sell price, 0.0% margin and $0.00 total.")
   + look("10.11", "S10-N1", "It looks like the Brake chamber row of picture 10.11, with no icon beside the price.")],
  pics=["10.10", "10.11"])

C("D-405", K, "Design: the Fixed Rules tab, read only, with its tooltip",
  [ADMIN, "Have a new inventory part for this test at your location with a fixed sell price of $12.50.", W1440],
  [ "Click the Fixed Rules tab on Settings › Pricing.", "Point at the info icon beside Fixed Price."],
  [R(S("S6-R11", "The Fixed Rules tab lists only fixed rules, as today."), "The tab lists parts with a fixed price, the new part at $12.50 among them.")
   + look("10.12", "S1-R6", "The columns read Part Number, Description, Category and Fixed Price, the price right-aligned, as in picture 10.12.",
          "The tab label shows its count, for example \"Fixed Rules (2)\", beside \"Tiers\" and \"Matrices\" with theirs.", "No Edit button shows."),
   R(QD("Sells at this price, ahead of any tier price. Set on the part.", "10.12", "S1-R6"), "A tooltip reads \"Sells at this price, ahead of any tier price. Set on the part.\"")],
  pics=["10.12"])

# ---- page 11: editing, splitting, receiving --------------------------------------------------------------------------------------
C("D-406", K, "Design: Edit Part Request for an inventory part",
  [WOA, CU("B", "Default"), "Have a new category for this test, category A.", "Have a new inventory part for this test at your location, in category A, cost $10.00.",
   WO("1", "B", ", with that inventory part on line 1"), W1440],
  [OPENWO(), "Click the part's description."],
  [R(S("S11-R12"), "Work order 1 opens."),
   look("11.1", "S11-R12", "A dialog titled \"Edit Part Request\" opens with Part Number, Description *, Quantity, Source, Category, Vendor, Cost, Core Charge, Sell Price and Margin, as in picture 11.1.",
        "Cost is gray (not editable); Source shows Inventory; Category shows category A.")
   + R(QD("The cost of an inventory part can’t be re-entered.", "11.1", "S11-R12"), "Under Cost it reads \"The cost of an inventory part can't be re-entered.\" in small gray text.")
   + R(QD("Remove Part", "11.1", "S11-R12"), "A red Remove Part button sits at the bottom left, Cancel and a blue Save Part at the bottom right.")],
  pics=["11.1"])

C("D-407", K, "Design: typing a price below cost shows a negative margin at once",
  [WOA, CU("B", "Default"), "Have a new category for this test, category A.", "Have a new inventory part for this test at your location, in category A, cost $268.00.", WO("1", "B", ", with that inventory part on line 1"), W1440],
  [OPENWO(), "Click the part's description.", "Type 199.00 in Sell Price."],
  [R(S("S11-R5"), "Work order 1 opens."), R(S("S11-R5"), "Edit Part Request opens with category A and Cost 268.00."),
   R(S("S10-E2", "The margin shows negative, as a manual price below cost does today."), "Margin changes to -34.67 before saving: ($199.00 − $268.00) ÷ $199.00 = −34.67%.")
   + look("11.2", "S11-R5", "The Sell Price box is outlined while typing, as in picture 11.2.")],
  pics=["11.2"], flags=["numbers"])

C("D-408", K, "Design: the Split Work Order dialog",
  [WOA, CU("B", "Default"), "Have a new work order for this test, work order 1, for customer B, with two labor lines, one with 2 parts and one with 3 parts.", W1440],
  [OPENWO(), "Click Split Work Order in the work order's three-dot menu.", "Tick the second line."],
  [R(S("S11-E6"), "Work order 1 opens."),
   R(QD("Choose the lines to move. Each line’s labor and parts move together to a new work order for Acme Freight.", "11.3", "S11-E6"),
     "A dialog titled \"Split Work Order\" reads \"Choose the lines to move. Each line's labor and parts move together to a new work order for\" and customer B's name.")
   + look("11.3", "S11-E6", "Each line shows a checkbox, its name and its part count (\"2 parts\", \"3 parts\"), with Cancel and a blue Split button, as in picture 11.3."),
   R(S("S11-E6", "The split screen and its steps are unchanged from today."), "The second line's checkbox is ticked.")],
  pics=["11.3", "11.4"])

C("D-409", K, "Design: the toast after a split names the new work order and the tier",
  [WOA, MX(), TR(), CU(), "Have a new work order for this test, work order 1, for customer A, with two labor lines, line 2 holding a part in category A.", W1440],
  [OPENWO(), "Click Split Work Order in the work order's three-dot menu.", "Tick line 2.", "Click Split."],
  [R(S("S11-E6"), "Work order 1 opens."), R(S("S11-E6"), "Split Work Order opens."), R(S("S11-E6"), "Line 2 is ticked."),
   R(QD("S1-2877 created from S1-2671", "11.5", "S11-E6"), "The new work order opens and a toast reads its number, \"created from\" and work order 1's number.")
   + R(QD("3 parts moved, priced by Tier 3.", "11.5", "S11-E6"), "Its second line reads \"1 parts moved, priced by\" or \"1 part moved, priced by\" with tier A's name, in the form of picture 11.5.")],
  pics=["11.5"])

C("D-410", K, "Design: the Receive Part window says nothing about tiers",
  [WOA, MX(), TR(), CU(), WO("1", "A", " and a special-order part not yet received on line 1, category A, cost $100.00"), W1440],
  [OPENWO(), "Open the part's Receive Part window."],
  [R(S("S11-R9"), "Work order 1 opens."),
   look("11.6", "S11-R15", "A dialog titled \"Receive Part\" shows the part's description, a \"Received Cost *\" box with a $ sign holding the cost, and Cancel and a blue Receive button, as in picture 11.6.")
   + R(S("S11-R15", "The receive window says nothing about tiers."), "The window names no tier.", "It shows the Received Cost box.")],
  pics=["11.6"])

C("D-411", K, "Design: the price details after a part is received",
  [WOA, MX(), TR("A", "A", "+ $ 40.00"), CU(), WO("1", "A", " and a special-order part not yet received on line 1, category A, cost $0.01"), W1440],
  [OPENWO(), "Receive the part at 40.00.", HOVER],
  [R(S("S11-R9"), "Work order 1 opens."), R(S("S11-R9"), "The part reads $80.00 ($40.00 + $40.00 = $80.00)."),
   look("11.7", "S12-R2", "A white panel titled \"Why this price\" opens beside the price with rows Priced by, Matrix, Cost Range, Rule, Cost, Sell price, Priced on and From, as in picture 11.7.")
   + R(S("S11-R9", "its details show the rule and cost used at receipt"), "Rule reads Cost + $40, Cost $40.00 and Sell price $80.00.")
   + R(QD("Acme Freight’s work order tier (Tier 2) prices its parts.", "11.7", "S12-R2"), "The last line reads customer A's name, \"'s work order tier (\" tier A's name \") prices its parts.\"")],
  pics=["11.7"], flags=["numbers"])

# ---- page 13: Part Sales -------------------------------------------------------------------------------------------------------
C("D-412", K, "Design: the Part Sale parts table with Priced By",
  [PSA, MX(), TR(), CU("A", "A", "Part Sales"), PS("1", "A", ", with a part in category A priced by tier A"), W1440],
  [ "Open Part Sale 1."],
  [look("13.3", "S13-R1", "The parts table reads Description, Part Number, Quantity, Cost, Core, Sell Price, Priced By, Margin, Category, Vendor and Requested At, as in picture 13.3.",
        "Priced By sits right after Sell Price and shows tier A's name in plain text.", f"Boxes, spacing and alignment match picture 13.3 {CMP}.")
   + R(S("S19-R9", "Every column title, modal header, page title, tab and button uses Title Case."), "The heading reads \"Priced By\" with a capital B.")],
  pics=["13.3", "today:13.1"])

C("D-413", K, "Design: a Part Sale price details panel for a % Off rule",
  [PSA, MX(), TR("A", "A", "% Off 15"), CU("A", "A", "Part Sales"), PS("1", "A", ", with a part in category A, cost $189.00"), W1440],
  [ "Open Part Sale 1.", "Point at the part's Priced By value."],
  [R(S("S13-R1"), "The part reads $216.88: $189.00 × 1.35 = $255.15, less 15% = $216.8775, rounded to $216.88."),
   look("13.4", "S12-R2", "The \"Why this price\" panel opens under the value with Priced by, Matrix, Cost Range, Rule, Cost, Sell price, Priced on and From, as in picture 13.4.")
   + R(QD("15% off Default ($255.15)", "13.4", "S12-R2"), "Rule reads \"15% off Default ($255.15)\".")
   + R(QD("Calgary Transit Parts’s Part Sales tier (Tier 4) prices its parts.", "13.4", "S12-R2"),
       "The last line reads customer A's name, \"'s Part Sales tier (\" tier A's name \") prices its parts.\"")],
  pics=["13.4"], flags=["numbers"])

# ---- page 20: Sales by Tier and Sales by Category -------------------------------------------------------------------------------
REP0 = [RPA, "Have invoiced part lines this month at your location, so the report has rows (for example a new work order for this test, invoiced today, with a part priced by a tier).", W1440]
REP = [RPA, MX(), TR(), CU(), "Have a new work order for this test, work order 1, for customer A, with a part in category A priced $121.50 by tier A, invoiced today.", W1440]

C("D-414", K, "Design: the Sales by Tier page, chips, columns and Totals",
  REP,
  [SBT, "Point at the info icon beside % of Total."],
  [look("20.2", "RPT-S1-R6", "The title \"Sales by Tier\" sits at the top left with a columns icon and a ⋯ button at the right.",
        "The chips read, left to right, Date, Sales Type, Priced By, Category, Customer and Location; Date and Location are blue, the others plain.",
        "Each row starts with a > chevron; Parts Invoiced is bold; the Totals row is bold with a line above it.",
        f"Fonts, spacing and alignment match picture 20.2 {CMP}.")
   + R(S("RPT-S1-R6", "No column is pinned."), "The columns fill the table with no pinned column.", "Work order 1's figures are in tier A's row."),
   R(QD("Share of Parts Invoiced for everything that matches your filters.", "20.2", "RPT-S1-R6"), "A dark tooltip reads \"Share of Parts Invoiced for everything that matches your filters.\"")],
  pics=["20.2"])

C("D-415", K, "Design: an opened tier row and customer row",
  REP,
  [SBT, "Pick customer A in the Customer filter.", "Open tier A's row.", "Open customer A's row."],
  [R(S("RPT-S2-R1"), "Sales by Tier opens."), R(S("RPT-S3-R4"), "Tier A's row shows."),
   look("20.3", "RPT-S2-R2", "Customer A shows indented under tier A with its own > chevron, on a light gray band, the chevron of tier A now pointing down, as in picture 20.3."),
   look("20.4", "RPT-S2-R3", "Work order 1's invoice shows indented under customer A as a blue link \"Invoice\" and its number, with \" · \" and the date in gray after it, as in picture 20.4.")
   + R(QD("Invoice 10510", "20.4", "RPT-S2-R3"), "The document row's first cell follows the form \"Invoice 10510 · Oct 2, 2026\".")],
  pics=["20.3", "20.4"])

C("D-416", K, "Design: the Priced By filter list",
  REP0,
  [SBT, "Open the Priced By filter."],
  [R(S("RPT-S3-R3"), "Sales by Tier opens."),
   look("20.5", "RPT-S3-R3", "A white list opens under the chip with a checkbox per option, as in picture 20.5.")
   + R(S("RPT-S3-R3", "then Fixed price, Fixed line total, Manual and Before tiers"), "The list ends with Fixed price, Fixed line total, Manual and Before tiers.")
   + R(QD("Clear selection", "20.5", "RPT-S3-R3"), "A blue \"Clear selection\" link sits under the list.")],
  pics=["20.5"])

C("D-417", K, "Design: the Customer and Category filter lists with search",
  REP0,
  [SBT, "Open the Customer filter.", "Open the Category filter."],
  [R(S("RPT-S3-R4"), "Sales by Tier opens."),
   R(QD("Search customers", "20.6", "RPT-S3-R4"), "A search box \"Search customers\" sits above the customers, listed A to Z with checkboxes, as in picture 20.6."),
   R(QD("Search categories", "20.7", "RPT-S3-R9"), "A search box \"Search categories\" sits above the categories with checkboxes and a \"Clear selection\" link at the bottom, as in picture 20.7.")],
  pics=["20.6", "20.7"])

C("D-418", K, "Design: the Location filter keeps its chip blue",
  [RPA, "Use a staging client with two locations, signed in at location 1.", W1440],
  [SBT, "Open the Location filter."],
  [R(S("RPT-S3-R12", "Date range and Location always do, so they are always blue."), "The Location chip reads \"Location:\" and the signed-in location, in blue."),
   look("20.8", "RPT-S3-R2", "The list shows the locations with location 1 ticked and a blue \"Clear selection\" link, as in picture 20.8.")
   + R(QD("Locations the user can see; always blue.", "20.8", "RPT-S3-R2"), "The list holds the locations this user can work at.")],
  pics=["20.8"])

C("D-419", K, "Design: picking Work Orders turns the Sales Type chip blue",
  REP0,
  [SBT, "Open the Sales Type filter.", "Untick Part Sales."],
  [R(S("RPT-S3-R5"), "Sales by Tier opens."), R(S("RPT-S3-R5", "\"Part Sales\""), "The list reads Part Sales, then Work Orders, both ticked."),
   look("20.9", "RPT-S3-R12", "The chip reads \"Sales Type: Work Orders\" in blue, as in picture 20.9.")
   + R(S("RPT-S3-R5", "the one option picked"), "Work Orders stays ticked.")],
  pics=["20.9"])

C("D-420", K, "Design: the date list, the custom range and its two messages",
  [RPA, W1440],
  [SBT, "Open the Date filter.", "Pick Custom range.", "Type 01/01/2025 in From and 10/31/2026 in To.", "Type 01/01/2027 in From and 01/31/2027 in To."],
  [R(S("RPT-S3-R1"), "Sales by Tier opens with \"Date: This month\" in blue."),
   R(QD("Year to date", "20.10", "RPT-S3-R1"), "The list reads This month (ticked), Last month, This quarter, Last 90 days, Year to date and Custom range."),
   look("20.11", "RPT-S3-R1", "From and To date boxes show under Custom range, as in picture 20.11."),
   R(QD("Choose a date range of one year or less.", "20.10", "RPT-S3-R1"), "Red text under the boxes reads \"Choose a date range of one year or less.\""),
   R(QD("One year at most.", "20.11", "RPT-S3-R1"), "Gray help text reads \"One year at most.\" and the chip reads \"Date: Jan 1 – Jan 31, 2027\".")
   + R(QD("There are no results for selected date range", "20.11", "RPT-S1-N1"), "The table shows a calendar icon over \"There are no results for selected date range\".")],
  pics=["20.10", "20.11"])

C("D-421", K, "Design: the sort arrow on a sorted number column",
  REP0,
  [SBT, "Point at the Parts Margin heading.", "Click the Parts Margin heading."],
  [R(S("RPT-S3-R8"), "Sales by Tier opens with no arrow on any heading."),
   R(QD("Arrows show on hover and on the sorted column.", "20.13", "RPT-S3-R8"), "An arrow shows beside Parts Margin while pointed at."),
   look("20.13", "RPT-S3-R8", "A down arrow stays beside \"Parts Margin\" and the rows sort biggest first, as in picture 20.13.")],
  pics=["20.12", "20.13"])

C("D-422", K, "Design: the Columns list and a hidden column",
  REP0,
  [SBT, "Click the Columns icon.", "Untick Parts Margin."],
  [R(S("RPT-S1-R14"), "Sales by Tier opens."),
   look("20.14", "RPT-S1-R14", "A list opens under the icon with Parts Cost, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total, each ticked, as in picture 20.14."),
   look("20.15", "RPT-S1-R14", "Parts Margin is unticked and its column is gone; the other columns spread across the table, as in picture 20.15.")
   + R(QD("The column is gone; the choice is kept for next time.", "20.15", "RPT-S1-R14"), "The other columns stay.")],
  pics=["20.14", "20.15"])

C("D-423", K, "Design: Sales by Category and an opened category",
  REP,
  ["Open Reports › Sales by Category.", "Open category A's row."],
  [look("20.16", "RPT-S5-R1", "The title reads \"Sales by Category\" with the same chips and columns as Sales by Tier, the first column headed Category, as in picture 20.16.")
   + R(S("RPT-S5-R4", "Uncategorized sorts first on first load, then categories A to Z."), "Uncategorized (if it has sales) is first, the rest A to Z."),
   look("20.17", "RPT-S5-R2", "Category A opens to indented Priced By rows (tier A here) on a gray band, as in picture 20.17.")],
  pics=["20.16", "20.17"])

C("D-424", K, "Design: the download menu",
  REP0,
  [SBT, "Click the ⋯ button."],
  [R(S("RPT-S4-R1"), "Sales by Tier opens."),
   look("20.18", "RPT-S4-R1", "A menu opens under the ⋯ button with Download Summary (PDF), Download Expanded View (PDF), Download Summary (CSV) and Download Expanded View (CSV), as in picture 20.18.")
   + R(QD("PDF up to 2,000 rows, CSV up to 50,000.", "20.18", "RPT-S4-R5"), "All four items can be clicked.")],
  pics=["20.18", "20.19"])

C("D-425", K, "Design: a Summary CSV's filter lines and columns",
  REP0,
  [SBT, "Click Download Summary (CSV) in the ⋯ menu.", "Open the file."],
  [R(S("RPT-S4-R1"), "Sales by Tier opens."), R(S("RPT-S4-R1"), "A CSV file downloads."),
   R(QD("Sales Type: All", "20.20", "RPT-S4-R7"), "The file starts with \"Sales by Tier\", the date range and the location, then the lines \"Sales Type: All\", \"Category: All categories\", \"Priced By: All\" and \"Customer: All customers\".")
   + R(QD("Priced By,Parts Cost,Parts Invoiced,Parts Credits,Parts Net,Parts Margin,Parts Margin %,% of Total", "20.20", "RPT-S4-R6"),
       "After a blank line the header reads Priced By,Parts Cost,Parts Invoiced,Parts Credits,Parts Net,Parts Margin,Parts Margin %,% of Total.")
   + R(QD("Totals,22912.20", "20.20", "RPT-S4-R6"), "The last line starts with Totals, and numbers have no $ sign (for example 121.50).")],
  pics=["20.20"])

C("D-426", K, "Design: Empty export shows as an info notice",
  [RPA, W1440],
  [SBT, "Untick both options in the Sales Type filter.", "Click Download Summary (CSV) in the ⋯ menu."],
  [R(S("RPT-S3-R5"), "Sales by Tier opens."),
   look("20.21", "RPT-S3-N1", "The chip reads \"Sales Type: None\" and the table shows the no-match message, as in picture 20.21."),
   R(S("RPT-S4-N2", "the existing \"Empty export\" notice"), "A notice reads \"Empty export\" (no period).")
   + look("20.22", "RPT-S4-N2", "It shows in the info style of picture 20.22.", "No file downloads.")],
  pics=["20.21", "20.22"])

C("D-427", K, "Design: the no-match empty state",
  [RPA, W1440],
  [SBT, "Untick both options in the Sales Type filter."],
  [R(S("RPT-S3-R5"), "Sales by Tier opens."),
   R(QD("No record matches these filters", "20.23", "RPT-S3-N1"), "The table reads \"No record matches these filters\" and \"Try changing filters to widen your results.\" with a Clear All Filters button.")
   + look("20.23", "RPT-S3-N1", "The column headings stay above the message, with no Totals row, as in picture 20.23.")],
  pics=["20.23", "20.21"])

# ---- held design versions (Rule 130) -------------------------------------------------------------------------------------------
C("D-440", K, "Design: report rows and Priced By list show tier names without numbers",
  REP + [TR("B", "A", "% Off 20", ", archived")],
  [SBT, "Open the Priced By filter.", "Click Download Summary (CSV) in the ⋯ menu."],
  [R(QD("Tier 2", "20.2", "RPT-S1-R11"), "Tier A's row reads its name with no number (as \"Tier 2\" in picture 20.2).")
   + R(QL("20.2", "RPT-S3-R12"), "The plain chips read Sales Type, Priced By, Category and Customer with no \": All\"."),
   R(QD("Fleet Old", "20.5", "RPT-S3-R3"), "Archived tier B is listed by its name with no \"(archived)\" (as \"Fleet Old\" in picture 20.5)."),
   R(QD("Tier 2,5933.40", "20.20", "RPT-S4-R3"), "The CSV writes tier A's name with no number (as \"Tier 2,5933.40\" in picture 20.20).")],
  pics=["20.2", "20.5", "20.20"], held_on="Q28", flags=["design-version"])

C("D-441", K, "Design: the Category list places Uncategorized in A to Z order",
  REP0,
  [SBT, "Open the Category filter."],
  [R(QL("20.7", "RPT-S3-R9"), "Sales by Tier opens."),
   R(QL("20.7", "RPT-S3-R9"), "Uncategorized is listed in A-to-Z order among the categories (between \"Tires, Retread\" and \"Wipers\" in picture 20.7), not first.")],
  pics=["20.7"], held_on="Q29", flags=["design-version"])

C("D-442", K, "Design: receiving shows a toast with the price and the tier",
  [WOA, MX(), TR("A", "A", "+ $ 40.00"), CU(), WO("1", "A", " and a special-order part not yet received on line 1, category A, cost $0.01"), W1440],
  [OPENWO(), "Open the part's Receive Part window.", "Type 40.00 in Received Cost.", "Click Receive."],
  [R(S("S11-R9"), "Work order 1 opens."), R(QL("11.6", "S11-R15"), "Receive Part opens as in picture 11.6."), R(QL("11.6", "S11-R15"), "Received Cost reads 40.00."),
   R(QD("Part received", "11.7", "S11-R15"), "A toast reads \"Part received\".")
   + R(QD("$80.00 each, Tier 2.", "11.7", "S11-R15"), "Its second line reads \"$80.00 each,\" and tier A's name, ending with a period ($40.00 + $40.00 = $80.00).")],
  pics=["11.6", "11.7"], held_on="Q25", flags=["design-version", "numbers"])

C("D-443", K, "Design: the CSV's filter lines put Priced By before Category",
  [RPA, W1440],
  [SBT, "Click Download Summary (CSV) in the ⋯ menu."],
  [R(QD("Prototype stand-in", "20.20", "RPT-S4-R7"), "Sales by Tier opens; the download is the real file the stand-in of picture 20.20 shows."),
   R(QD("Priced By: All", "20.20", "RPT-S4-R7"), "After \"Sales Type: All\" the file reads \"Priced By: All\", then \"Category: All categories\", then \"Customer: All customers\", as in picture 20.20.")],
  pics=["20.20"], held_on="Q30", flags=["design-version"])

# ---- §6d line 10: before and after -----------------------------------------------------------------------------------------------
MOVE_PRE = REP + [CU("B", "A"), "Have a new work order for this test, work order 2, for customer B, with a part in category A priced by tier A, invoiced today."]

C("D-450", K, "Design: Sales by Tier columns move when a row is opened",
  MOVE_PRE,
  [SBT, "Pick customers A and B in the Customer filter.", "Take a screenshot of the headings.", "Open tier A's row.", "Open customer A's row.", "Take a screenshot of the headings."],
  [R(S("RPT-S2-R1"), "Sales by Tier opens."), R(S("RPT-S3-R4"), "Tier A's row shows."), R(QL("20.2", "RPT-S1-R6"), "The first screenshot matches the headings of picture 20.2."),
   R(QL("20.3", "RPT-S2-R2"), "Customers A and B show under tier A."), R(QL("20.4", "RPT-S2-R3"), "Customer A's invoices show."),
   R(QL("20.4", "RPT-S2-R2"), "Compared with the first screenshot, Priced By widens and the number columns move right by about 60-95 pixels, as pictures 20.3 and 20.4 show against 20.2.")],
  pics=["20.2", "20.3", "20.4"], held_on="Q31", flags=["design-version", "movement"])

C("D-451", K, "Design: Sales by Tier headings move on the empty states",
  [RPA, W1440],
  [SBT, "Take a screenshot of the headings.", "Untick both options in the Sales Type filter.", "Take a screenshot of the headings."],
  [R(QL("20.2", "RPT-S1-R6"), "Sales by Tier opens."), R(QL("20.2", "RPT-S1-R6"), "The first screenshot matches picture 20.2's headings."),
   R(S("RPT-S3-N1"), "The no-match message shows."),
   R(QL("20.23", "RPT-S3-N1"), "Compared with the first screenshot, the headings sit about 20-36 pixels further left, as picture 20.23 shows against 20.2.")],
  pics=["20.2", "20.23", "20.11"], held_on="Q31", flags=["design-version", "movement"])

C("D-452", K, "Design: Sales by Category columns move when a category opens",
  REP,
  [ "Open Reports › Sales by Category.", "Take a screenshot of the headings.", "Open category A's row.", "Take a screenshot of the headings."],
  [R(QL("20.16", "RPT-S5-R1"), "Sales by Category opens."), R(QL("20.16", "RPT-S5-R1"), "The first screenshot matches picture 20.16's headings."),
   R(QL("20.17", "RPT-S5-R2"), "Category A opens to its Priced By rows."),
   R(QL("20.17", "RPT-S5-R2"), "Compared with the first screenshot, Category widens and the number columns move right by about 5-10 pixels, as picture 20.17 shows against 20.16.")],
  pics=["20.16", "20.17"], held_on="Q31", flags=["design-version", "movement"])

C("D-453", K, "Design: the lines table's columns move while Quick Add is open",
  [WOA, MX(), TR(), CU(), WO("1", "A", ", with a part on line 1"), W1440],
  [OPENWO(), "Take a screenshot of the lines table headings.", "Click Add Part under line 1.", "Take a screenshot of the headings.", "Click Cancel.", "Take a screenshot of the headings."],
  [R(QL("10.5", "S10-R1"), "Work order 1 opens."), R(QL("10.5", "S10-R1"), "The first screenshot matches picture 10.5's headings."),
   R(QL("10.6", "S10-R1"), "The Quick Add row opens."),
   R(QL("10.6", "S10-R1"), "Compared with the first screenshot, Name/Description narrows and Actual/Estimate, Progress, Status, Action and Rate move left by about 20-70 pixels, as pictures 10.6, 10.7 and 10.9 show against 10.5."),
   R(QL("10.5", "S10-R1"), "The Quick Add row closes."),
   R(QL("10.5", "S10-R1"), "The headings are back in the same place as the first screenshot.")],
  pics=["10.5", "10.6", "10.7", "10.9"], held_on="Q31", flags=["design-version", "movement"])

C("D-454", K, "Design: the filter chips shift left as a picked chip widens",
  [RPA, W1440],
  [SBT, "Take a screenshot of the chips.", "Untick Part Sales in the Sales Type filter.", "Take a screenshot of the chips."],
  [R(QL("20.2", "RPT-S3-R12"), "Sales by Tier opens."), R(QL("20.2", "RPT-S3-R12"), "The first screenshot matches the chips of picture 20.2."),
   R(QL("20.9", "RPT-S3-R12"), "The chip reads Sales Type: Work Orders."),
   R(QL("20.9", "RPT-S3-R12"), "Compared with the first screenshot, the Date and Sales Type chips sit further left (Date by about 90 pixels), as picture 20.9 shows against 20.2.")],
  pics=["20.2", "20.9"], held_on="Q31", flags=["design-version", "movement"])

C("D-455", K, "Design: sorting keeps the Sales by Tier columns in place",
  REP0,
  [SBT, "Take a screenshot of the headings.", "Click the Parts Margin heading.", "Take a screenshot of the headings."],
  [R(QL("20.12", "RPT-S3-R8"), "Sales by Tier opens."), R(QL("20.12", "RPT-S3-R8"), "The first screenshot matches picture 20.12's headings."),
   R(S("RPT-S3-R8"), "The rows sort by Parts Margin, biggest first."),
   R(QL("20.13", "RPT-S3-R8"), "Every heading keeps its place: the two screenshots match column for column, as pictures 20.12 and 20.13 do.")],
  pics=["20.12", "20.13"], flags=["movement"])

C("D-456", K, "Design: the Totals row stays at the bottom as more rows load",
  [RPA, "Use a staging location whose Default row has more than 30 customers this month.", W1440],
  [SBT, "Open the Default row.", "Take a screenshot of the headings and the Totals row.", "Scroll down until more customers load.", "Take a screenshot of the headings and the Totals row."],
  [R(S("RPT-S1-R12"), "Sales by Tier opens."), R(S("RPT-S1-R12"), "30 customers show under Default."), R(S("RPT-S1-R7"), "The screenshot is taken."),
   R(S("RPT-S1-R12", "with more loading as the user scrolls"), "More customers load."),
   R(S("RPT-S1-R7", "A bold \"Totals\" row stays at the bottom while scrolling"), "The bold Totals row stays at the bottom with the same figures as in the first screenshot.")
   + R(QP("the columns fit without sideways scrolling", "RPT-S1-R6"), "The columns keep their left-right place.", NOSIDE)],
  pics=["20.3"], flags=["movement"])

# ---- §6d line 9: stress names -----------------------------------------------------------------------------------------------------
def stress_rep():
    return [RPA, MX(extra=", so the stress tiers have a matrix to price from"), f"Have a new tier for this test, tier A, with {T50SP}.", f"Have a new tier for this test, tier B, with {T50NO}.",
            f"Have a new tier for this test, tier C, with {TSPEC}.",
            "Have three new customers for this test, customers A, B and C, put on tiers A, B and C for work orders, each with an invoiced work order today with a part in category A, so each tier has a row.", W1440]


C("D-460", K, "Design: long and special tier names on Sales by Tier rows",
  stress_rep(),
  [SBT, "Pick customers A, B and C in the Customer filter.", "Open the Priced By filter."],
  [R(S("RPT-S1-R11"), "Sales by Tier opens."),
   R(S("RPT-S1-R11", "Active tier rows show the tier's number and name"), "Tier A's, tier B's and tier C's rows each show their name inside their own row.",
     "No name covers the next row or the Parts Cost column.")
   + R(QP("the columns fit without sideways scrolling", "RPT-S1-R6"), "Parts Margin % and % of Total stay fully visible at the right.", NOSIDE)
   + R(S("TP-S2-R3", "A tier name is required, trimmed, up to 50 characters"), "Tier C's name shows character for character, & \" ' < > included."),
   R(S("RPT-S3-R3", "Priced By: lists every tier"), "Each long name in the list wraps or is shortened with \"...\" inside its own row, never past the list's edge.",
     "Every checkbox stays visible.")],
  pics=["20.2", "20.5"], flags=["stress"])

C("D-461", K, "Design: long and special customer names in rows and the Customer filter",
  [RPA, MX(), TR(), f"Have a new customer for this test, customer A, with {T50SP}.", f"Have a new customer for this test, customer B, with {T50NO}.",
   f"Have a new customer for this test, customer C, with {TSPEC}.",
   "Make sure customers A, B and C are on tier A for work orders, each with an invoiced work order today with a part in category A.", W1440],
  [SBT, "Pick customers A, B and C in the Customer filter.", "Open tier A's row.", "Open the Customer filter."],
  [R(S("RPT-S2-R2"), "Sales by Tier opens."), R(S("RPT-S3-R4"), "Tier A's row shows."),
   R(S("RPT-S2-R2", "Opening a row lists the invoices' and credits' customers"), "Customer A's and customer B's long names each stay inside their own row, wrapped or shortened with \"...\".",
     "Customer C's name shows character for character, & \" ' < > included.")
   + R(QP("the columns fit without sideways scrolling", "RPT-S1-R6"), NOSIDE),
   R(S("RPT-S3-R4", "Customer: search for one or more customers"), "Each long name wraps or is shortened with \"...\" inside the list.", "No name runs past the list's edge.")],
  pics=["20.3", "20.6"], flags=["stress"])

C("D-462", K, "Design: long and special category names on Sales by Category",
  [RPA, f"Have a new category for this test, category A, with {T50SP}.", f"Have a new category for this test, category B, with {T50NO}.",
   f"Have a new category for this test, category C, with {TSPEC}.", CU("B", "Default").replace("customer B", "customer D"),
   "Have a new work order for this test, work order 1, for customer D, with one part in each of categories A, B and C, invoiced today.", W1440],
  [ "Open Reports › Sales by Category.", "Pick customer D in the Customer filter.", "Open the Category filter."],
  [R(S("RPT-S5-R2"), "Sales by Category opens."),
   R(S("RPT-S5-R2", "Rows are categories, by the category on each part line, under its current name"), "Category A's, category B's and category C's rows each keep their name inside their own row.",
     "Category C shows character for character, & \" ' < > included.")
   + R(QP("the columns fit without sideways scrolling", "RPT-S1-R6"), NOSIDE),
   R(S("RPT-S3-R9", "Category: lists every category"), "Each long name wraps or is shortened with \"...\" inside the list.", "No name runs past the list's edge.")],
  pics=["20.16", "20.7"], flags=["stress"])

C("D-463", K, "Design: long and special names in the PDF and CSV downloads",
  stress_rep() + ["Make sure customer C's name starts with = (for example =1+1 Stress Co)."],
  [SBT, "Pick customers A, B and C in the Customer filter.", "Click Download Expanded View (PDF) in the ⋯ menu.", "Click Download Expanded View (CSV) in the ⋯ menu.",
   "Open the CSV in a spreadsheet."],
  [R(S("RPT-S4-R3"), "Sales by Tier opens."), R(S("RPT-S4-R3"), "Tier A's, tier B's and tier C's rows show."),
   R(S("RPT-S4-R3", "show Priced By in plain text, with tier numbers"), "In the PDF each long name stays inside its own cell, wrapped or cut, never over the next column.",
     "Every column fits on the page.")
   + R(S("RPT-S4-R3"), "Tier C and customer C show & \" ' < > as typed."),
   R(S("RPT-S4-R1"), "The CSV downloads."),
   R(S("RPT-S4-R1", "CSVs go through the shared CSV-injection guard"), "Each name is whole in its own cell, character for character.",
     "Customer C's name shows as text starting with =, never as a calculated number.")],
  pics=["20.18", "20.20"], flags=["stress"])

C("D-464", K, "Design: long and special tier names in the Part Sale Priced By column",
  [PSA, MX(extra=", so the stress tiers have a matrix to price from"), f"Have a new tier for this test, tier A, with {T50SP}.", f"Have a new tier for this test, tier B, with {T50NO}.",
   f"Have a new tier for this test, tier C, with {TSPEC}.",
   "Have three new customers for this test, customers A, B and C, on tiers A, B and C for Part Sales, each with a Part Sale holding a part in category A, so each tier prices one part.", W1440],
  [ "Open customer A's Part Sale.", "Open customer B's Part Sale.", "Open customer C's Part Sale.", "Point at the part's Priced By value."],
  [R(S("S12-R3"), "Tier A's name shows in Priced By, wrapped or shortened with \"...\" inside its cell.", "Margin, Category and Vendor stay in place."),
   R(S("S12-R3"), "Tier B's name stays inside its cell.", NOSIDE.replace("Every column", "Every column of the parts table")),
   R(S("S12-R3"), "Tier C's name shows character for character, & \" ' < > included."),
   R(S("S12-R2", "the tier name"), "The price details show tier C's name in full inside the panel.", "The panel's rows stay readable.")],
  pics=["13.3", "13.4"], flags=["stress"])

C("D-465", K, "Design: long and special tier names in the work order toasts",
  [WOA, MX(), f"Have a new tier for this test, tier A, with {T50SP}.", f"Have a new tier for this test, tier B, with {T50NO}.",
   f"Have a new tier for this test, tier C, with {TSPEC}.",
   "Have three new customers for this test, customers A, B and C, on tiers A, B and C for work orders, each with a new work order with one labor line.", W1440],
  [ "Add a part with category A and cost 100.00 to customer A's work order.", "Add a part with category A and cost 100.00 to customer B's work order.",
   "Add a part with category A and cost 100.00 to customer C's work order."],
  [R(QD("Part added", "10.8", "S10-R1"), "The Part added toast shows tier A's name wrapped inside the toast.", "The toast stays inside the window."),
   R(QD("Part added", "10.8", "S10-R1"), "Tier B's name stays inside the toast, wrapped or shortened with \"...\".", NOSIDE.replace("Every column", "The lines table")),
   R(QD("Part added", "10.8", "S10-R1"), "Tier C's name shows character for character, & \" ' < > included.")],
  pics=["10.8"], flags=["stress"])
