"""Story 10 — How a part is priced (SV-11699), PRD v37 S10 rows, design page 10 (10.1-10.12), tech-plan rows TPX-01 (held on Q1), TPX-06,
TPX-08. Batch B, phase 2, 14 Nov 2026.

Every case makes its own category, matrix, tier, customer and work order ("for this test"), so other tests never move its numbers. Prices are
computed here from the seeded rule and cost (Rule 116) and shown with their arithmetic. Expected results rest on the PRD's own sentences
(checked word for word by build.py); the build is never a source. This file also holds the small helpers the other batch B files import."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *

K = "S10"
# ---- helpers shared by batch B files ------------------------------------------------------------------------------------------
WOA = ADMIN_WO
PSA = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — Create & Edit', 'Work Orders — Order Parts', "
       "'Work Order Lines — Create & Edit' and 'Part Sales — Create & Edit'.")
RPA = ("Sign in as an Admin whose role has 'Reports — Page Access', 'Settings — Parts', 'See Financial Data', 'Customers — Create & Edit', "
       "'Work Orders — Order Parts', 'Work Order Lines — Create & Edit' and 'Part Sales — Create & Edit'.")
PRE_REL_B = HOLD("needs data made on staging before the Tiered Pricing release is deployed there; run on staging after the deploy")
STAGE = "Use staging (preferred), or the Tiered Pricing QA site too once the release is deployed there; production is not needed."
WO_PICS = ["10.5", "10.8"]


def MX(cat="A", m="A", d="Markup % 35", rng=None, extra=""):
    r = rng or f"one cost range ($0.00 and up) whose Default rule is {d}"
    return f"Have a new category for this test, category {cat}, priced by a new matrix for this test, matrix {m}, with {r}{extra}."


def TR(t="A", m="A", rule="% Off 10", extra=""):
    return f"Have a new tier for this test, tier {t}, with a name no other tier uses, whose column in matrix {m} is {rule}{extra}."


def CU(c="A", t="A", ch="work orders"):
    if t == "Default":
        return f"Have a new customer for this test, customer {c}, left on Default for work orders and Part Sales."
    return f"Have a new customer for this test, customer {c}, put on tier {t} for {ch} in Edit Customer."


def WO(n="1", c="A", extra=""):
    return f"Have a new work order for this test, work order {n}, for customer {c}, made after customer {c}'s tier was set, with one labor line (line 1){extra}."


def PS(n="1", c="A", extra=""):
    return f"Have a new Part Sale for this test, Part Sale {n}, for customer {c}, made after customer {c}'s tiers were set{extra}."


def OPENWO(n="1"): return f"Open work order {n}."
def ADDP(cat="A", cost="100.00", extra=""): return f"Add a part to line 1 with category {cat} and cost {cost}{extra}."
PARTS = "Click the Parts tab."
HOVER = "Point at the part's sell price."


def opened(n="1"): return R(S("S10-R1"), f"Work order {n} opens on its Lines tab.")


# ---- the pricing order -----------------------------------------------------------------------------------------------------------
C("S10-01", K, "A tier customer's part is priced by the tier's % Off rule",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), ADDP(), PARTS],
  [opened(),
   R(S("S10-R20", "% Off: Default's price for the part on that side, less the percent set for the part's cost range"),
     "The part's sell price fills in as $121.50: Default's price $100.00 × 1.35 = $135.00, less 10% = $121.50."),
   R(S("S10-R1", "the line records what priced it (S12-R4)"), "The part's row shows sell price $121.50.")
   + R(S("S12-R3", "It shows the pricing source in words"), "Its Priced by column names tier A.")],
  pics=["10.5", "10.6", "10.8"], flags=["numbers"])

C("S10-02", K, "A customer on Default pays the matrix's Default column",
  [WOA, MX(), TR("A", "A", "% Off 10", ", so a tier with its own rule exists in matrix A"), CU("B", "Default"), WO("1", "B"), DESK],
  [OPENWO(), ADDP(), PARTS],
  [opened(),
   R(S("S10-R19", "A customer on Default pays that side's Default column."), "The sell price fills in as $135.00 ($100.00 × 1.35 = $135.00).")
   + R(S("S10-R19"), "Tier A's 10% off does not apply to customer B."),
   R(S("S10-R1", "Tier, or Default when the customer is on Default"), "The part's Priced by column reads Default.", "Its sell price reads $135.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-03", K, "A tier's Markup % rule prices from the part's cost",
  [WOA, MX(), TR("A", "A", "Markup % 20"), CU(), WO(), DESK],
  [OPENWO(), ADDP()],
  [opened(),
   R(S("S10-R20", "From cost (+ $, Markup %, Margin %): the tier's own rule for the part's cost"),
     "The sell price fills in as $120.00: $100.00 × (1 + 0.20) = $120.00.")
   + R(S("S10-R4", "markup: cost × (1 + markup)"), "Default's $135.00 plays no part in this price.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-04", K, "A tier's Margin % rule prices cost divided by one minus the margin",
  [WOA, MX(), TR("A", "A", "Margin % 30"), CU(), WO(), DESK],
  [OPENWO(), ADDP("A", "10.00")],
  [opened(),
   R(S("S10-R4", "margin: cost ÷ (1 − margin)"), "The sell price fills in as $14.29: $10.00 ÷ (1 − 0.30) = $14.2857, rounded to $14.29.")
   + R(S("S10-R5", "Sell prices are rounded to the cent, half away from zero"), "The price shows to the cent: $14.29.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-05", K, "A + $ rule adds its amount per unit and the line total multiplies",
  [WOA, MX(), TR("A", "A", "+ $ 5.00"), CU(), WO(), DESK],
  [OPENWO(), ADDP("A", "20.00", " and quantity 3")],
  [opened(),
   R(S("S10-R4", "+ $: the cost plus the amount, per unit"), "The unit sell price reads $25.00: $20.00 + $5.00 = $25.00.")
   + R(S("S10-R6", "The line total is the unit sell price times the quantity."), "The part's total reads $75.00: $25.00 × 3 = $75.00.")
   + R(S("S10-R7", "The cost used is the cost on the line, per unit"), "The $5.00 is added once per unit, not once for the line ($20.00 × 3 + $5.00 = $65.00 would be wrong).")],
  pics=WO_PICS, flags=["numbers"])

C("S10-06", K, "A $ Off rule takes its amount off Default's price",
  [WOA, MX(), TR("A", "A", "$ Off 5.00"), CU(), WO(), DESK],
  [OPENWO(), ADDP()],
  [opened(),
   R(S("S10-R4", "$ Off: that Default price less the amount, per unit"), "The sell price fills in as $130.00: $135.00 − $5.00 = $130.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-07", K, "A $ Off rule bigger than Default's price stops at $0.00",
  [WOA, MX(), TR("A", "A", "$ Off 200.00"), CU(), WO(), DESK],
  [OPENWO(), ADDP(), PARTS],
  [opened(),
   R(S("S10-R4", "a result below $0.00 is $0.00"), "The sell price fills in as $0.00: $135.00 − $200.00 = −$65.00, which becomes $0.00.")
   + R(S("S11-E5", "Tiers never produce a negative price"), "No negative price shows."),
   R(S("S10-R20", "never below $0.00"), "The part's row reads $0.00 with tier A in its Priced by column.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-08", K, "Same as previous tier follows the chain to the tier with its own rule",
  [WOA, MX(), TR("A", "A", "Markup % 20"), TR("B", "A", "Same as previous tier"), TR("C", "A", "Same as previous tier"),
   "Note that tiers A to C are made one right after another with no other tier made in between, so they sit next to each other by number on the Tiers list.",
   CU("C", "C"), WO("1", "C"), DESK],
  [TIERS, OPENWO(), ADDP(), PARTS],
  [R(S("S2-R14", "The Tiers list shows active tiers by number"), "Tier A, tier B and tier C sit one after another by number."),
   opened(),
   R(S("S10-R20", "Same as previous tier: exactly what the tier before it (by number) pays in the same matrix and side, following each Same as previous tier in turn, ending at Default."),
     "The sell price fills in as $120.00: tier C follows tier B, which follows tier A's $100.00 × 1.20 = $120.00."),
   R(S("S12-R19", "A line priced through Same as previous tier records the work order's tier as its pricing source"),
     "The part's Priced by column names tier C (the work order's tier), not tier A.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-09", K, "Same as previous tier skips an archived tier",
  [WOA, MX(), TR("A", "A", "Markup % 20"), TR("B", "A", "Markup % 50", ", archived after its rule was set"), TR("C", "A", "Same as previous tier"),
   "Note that tiers A to C are made one right after another with no other tier made in between, so tier B was the number between tier A and tier C before it was archived.",
   CU("C", "C"), WO("1", "C"), DESK],
  [OPENWO(), ADDP()],
  [opened(),
   R(S("S10-E8", "Same as previous tier skips archived tiers."),
     "The sell price fills in as $120.00 (tier A's $100.00 × 1.20), not $150.00 (archived tier B's $100.00 × 1.50).")
   + R(S("S10-E8", "a chain always ends at Default"), "The price is one tier A gives, so the chain passed over tier B.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-10", K, "A tier with no rule of its own in a matrix pays Default's price",
  [WOA, MX(), TR("A", "A", "Same as previous tier", ", the tier right after Default or after tiers that also have no rule in matrix A"), CU(), WO(), DESK],
  [OPENWO(), ADDP()],
  [opened(),
   R(S("S10-R2", "Default's column always prices a part that has a cost, so every tier, through Same as previous tier, always has a price."),
     "The sell price fills in as $135.00, Default's price ($100.00 × 1.35 = $135.00).")
   + R(S("S10-R2"), "The price is never empty for a part with a cost.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-11", K, "A category with no matrix of its own is priced by the General Matrix",
  [WOA, "Have a new category for this test, category B, with no matrix of its own (it uses the General Matrix).", CU("B", "Default"), WO("1", "B"), DESK],
  [MATRICES, "Click the General Matrix's name.", "Note Default's rule for the cost range that holds $100.00 (for example Markup % 40).", OPENWO(), ADDP("B")],
  [R(S("S10-R17"), "The General Matrix is listed."), R(S("S10-R17"), "The General Matrix's page opens with its grid."),
   R(S("S10-R17"), "Default's rule for $100.00 is noted."), opened(),
   R(S("S10-R17", "The part's category gives the matrix: the category's own matrix, or the General Matrix when the category has none."),
     "The sell price fills in from the noted rule: for Markup % 40, $100.00 × 1.40 = $140.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-12", K, "A tier never borrows the General Matrix rule for a category with a matrix",
  [WOA, MX(), TR("A", "A", "Same as previous tier", ", the tier right after Default or after tiers with no rule in matrix A"),
   "Make sure tier A's column in the General Matrix is % Off 50 (set on tier A's Pricing tab).", CU(), WO(), DESK],
  [OPENWO(), ADDP()],
  [opened(),
   R(S("S10-R21", "A tier on Same as previous tier in a category's matrix is priced from that matrix, even when the General Matrix gives the tier something else."),
     "The sell price fills in as $135.00 from matrix A's Default ($100.00 × 1.35).")
   + R(S("S10-R21", "A tier never borrows from another matrix"), "It is not the General Matrix's 50% off price.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-13", K, "The cost range holding the cost applies, both ends included",
  [WOA, MX(rng="two cost ranges: $0.00 to $50.00 with Default Markup % 50, and $50.01 and up with Default Markup % 20"), CU("B", "Default"),
   WO("1", "B"), DESK],
  [OPENWO(), ADDP("A", "50.00"), ADDP("A", "50.01"), ADDP("A", "1000.00"), ADDP("A", "0.01")],
  [opened(),
   R(S("S10-R3", "Start and end are both inclusive"), "The $50.00 part reads $75.00: $50.00 × 1.50 = $75.00 (first range, its end included)."),
   R(S("S10-R3", "Inside a column, the rule whose cost range contains the part's cost applies."), "The $50.01 part reads $60.01: $50.01 × 1.20 = $60.012, rounded to $60.01."),
   R(S("S10-R3", "A cost above the last range's start is priced by the last rule"), "The $1,000.00 part reads $1,200.00: $1,000.00 × 1.20 = $1,200.00."),
   R(S("S10-R5", "half away from zero"), "The $0.01 part reads $0.02: $0.01 × 1.50 = $0.015, rounded half away from zero to $0.02.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-14", K, "A half-cent tie rounds up, the same on the line and in the simulator",
  [WOA, MX(d="Markup % 15"), CU("B", "Default"), WO("1", "B"), DESK],
  [OPENWO(), ADDP("A", "1.70"), MATRICES, open_matrix("A"), "Type 1.70 in the Price Part Simulator's Part Cost box."],
  [opened(),
   R(S("S10-R5", "Sell prices are rounded to the cent, half away from zero, exactly"), "The sell price fills in as $1.96: $1.70 × 1.15 = $1.955, rounded up to $1.96.")
   + R(S("S10-R5", "Today's markup math rounds about 1 in 1,300 half-cent ties down; those prices are one cent higher for parts priced from release day."),
       "It is not $1.95."),
   R(S("S3-R26"), "Matrix A is listed."), R(S("S3-R26"), "Matrix A's page opens with the simulator under the grid."),
   R(S("S10-R5", "so the simulator, the grid, line prices and reports always agree"), "The simulator's Default price reads $1.96, the same as the line.")
   + R(S("S5-R2", "Profit is the sell price minus the typed cost"), "Its profit reads $0.26 ($1.96 − $1.70 = $0.26).")],
  pics=["10.8", "3.5"], flags=["numbers"])

C("S10-15", K, "% Off rounds Default's price to the cent before taking the percent off",
  [WOA, MX(d="Markup % 15"), TR(), CU(), WO(), DESK],
  [OPENWO(), ADDP("A", "8.70")],
  [opened(),
   R(S("S10-R15", "% Off rounds the Default price to the cent first, then applies the discount and rounds again."),
     "The sell price fills in as $9.01: Default $8.70 × 1.15 = $10.005, shown as $10.01; $10.01 less 10% = $9.009, rounded to $9.01.")
   + R(S("S10-R15", "(rounding once would give $9.00)"), "It is not $9.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-16", K, "A typed sell price wins over the tier and is Manual",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), ADDP(), "Click the part's description to open Edit Part Request.", "Type 99.00 in Sell Price.", "Click Save Part.", PARTS],
  [opened(), R(S("S10-R20"), "The sell price fills in as $121.50 ($135.00 × 0.90 = $121.50)."),
   R(S("S11-R5"), "Edit Part Request opens with Cost $100.00 and Sell Price $121.50."),
   R(S("S11-R5"), "Sell Price reads 99.00."),
   R(S("S10-R1", "A sell price or margin typed on the line, by a user allowed to change pricing"), "The line keeps $99.00.")
   + R(S("S12-R10", "A gray Manual icon always shows beside a Manual price"), "A gray Manual icon shows beside $99.00."),
   R(S("S10-R1", "Manual"), "The part's Priced by column reads Manual.")],
  pics=["11.1", "11.2", "10.5"], flags=["numbers"])

C("S10-17", K, "A fixed sell price wins over the tier",
  [WOA, MX(), TR(), CU(),
   "Have a new inventory part for this test at your location, in category A, with cost $10.00 and a fixed sell price of $12.50.", WO(), DESK],
  [OPENWO(), "Add the inventory part to line 1 from the catalog search.", ADDP("A", "10.00"), PARTS],
  [opened(),
   R(S("S10-R1", "A fixed sell price on the part"), "The inventory part comes in at $12.50, its fixed sell price."),
   R(S("S10-R20"), "The added part with no fixed price fills in as $12.15: $10.00 × 1.35 = $13.50, less 10% = $12.15."),
   R(S("S10-R1", "Fixed price"), "The inventory part's Priced by column reads Fixed price.", "The other part's Priced by column names tier A.")],
  pics=["10.12", "10.8"], flags=["numbers"])

C("S10-18", K, "Part Sales use the Part Sale Matrix side when it is on",
  [PSA, MX(extra=", and Separate Part Sale pricing turned on with Part Sale Matrix Default Markup % 50"), CU("B", "Default"), WO("1", "B"),
   PS("1", "B"), DESK],
  [OPENWO(), ADDP(), "Open Part Sale 1.", "Add a part with category A and cost 100.00."],
  [opened(),
   R(S("S10-R18", "On a work order, the matrix's Work Order Matrix side prices the part."), "The work order part reads $135.00 ($100.00 × 1.35)."),
   R(S("S13-R1"), "Part Sale 1 opens on its parts table."),
   R(S("S10-R18", "On a Part Sale, its Part Sale Matrix side prices the part when that side is on"), "The Part Sale part reads $150.00 ($100.00 × 1.50).")],
  pics=["10.8", "13.3"], flags=["numbers"])

C("S10-19", K, "A typed catalog part number is priced by that part's own category",
  [WOA, MX(), TR(), CU(),
   "Have a new inventory part for this test with a part number no other part uses, in category A, cost $100.00 and no fixed sell price.", WO(), DESK],
  [OPENWO(), "Click Add Part under line 1.", "Type the inventory part's number in Part number.", "Type 100.00 in Cost.", "Click Save.", PARTS],
  [opened(), R(S("S10-R17"), "The add row opens with Part number, Description, Qty, Category, Cost and Sell price."),
   R(S("S10-R17", "A part number typed on the add row that matches a catalog part is priced by that part's own category, the same as picking it"),
     "The row matches the catalog part."),
   R(QT("the add row's suggested price is the one the save records", "TPX-08"), "Sell price suggests $121.50 from category A's matrix ($135.00 × 0.90 = $121.50).")
   + R(S("S10-R17", "today it gets Uncategorized's price"), "The suggestion is not Uncategorized's price."),
   R(QT("the add row's suggested price is the one the save records", "TPX-08"), "The part saves at $121.50, the same price the row suggested."),
   R(S("S10-R17"), "The part's row shows category A, sell price $121.50 and tier A in Priced by.")],
  pics=["10.6", "10.8"], flags=["numbers"])

C("S10-20", K, "A customer's tier prices the same at every location",
  [WOA, "Use a staging client with two locations, location 1 and location 2, and a user who can work at both.", MX(), TR(), CU(),
   "Have two new work orders for this test for customer A, work order 1 at location 1 and work order 2 at location 2, each with one labor line (line 1).", DESK],
  [OPENWO("1"), ADDP(), "Switch to location 2.", OPENWO("2"), ADDP()],
  [opened("1"), R(S("S10-R20"), "The part reads $121.50 at location 1 ($135.00 × 0.90 = $121.50)."), R(S("S10-R11"), "Location 2 is the current location."),
   opened("2"),
   R(S("S10-R11", "A customer's tiers price the same at every location."), "The part reads $121.50 at location 2 too: $121.50 − $121.50 = $0.00 difference.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-21", K, "A fixed price at one location, the tier price at another",
  [WOA, "Use a staging client with two locations, location 1 and location 2, and a user who can work at both.", MX(), TR(), CU(),
   "Have a new inventory part for this test with the same part number at both locations, in category A, cost $10.00, with a fixed sell price of $12.50 at location 1 only.",
   "Have two new work orders for this test for customer A, work order 1 at location 1 and work order 2 at location 2, each with one labor line (line 1).", DESK],
  [OPENWO("1"), "Add the inventory part to line 1 from the catalog search.", "Switch to location 2.", OPENWO("2"), "Add the same inventory part to line 1 from the catalog search."],
  [opened("1"),
   R(S("S10-R16", "A fixed sell price belongs to the location's inventory part"), "The part comes in at $12.50, its fixed price at location 1."),
   R(S("S10-R16"), "Location 2 is the current location."), opened("2"),
   R(S("S10-R16", "the same customer can get a fixed price on a part at one location and their tier price at another"),
     "The part comes in at $12.15, tier A's price: $10.00 × 1.35 = $13.50, less 10% = $12.15.")],
  pics=["10.12", "10.8"], flags=["numbers"])

C("S10-22", K, "A special-order part is priced by the tier, and a typed price beats it",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Add a special-order part (Source: Vendor) to line 1 with category A and cost 100.00.", "Click the part's description to open Edit Part Request.",
   "Type 110.00 in Sell Price.", "Click Save Part."],
  [opened(),
   R(S("S10-R12", "Special-order and catalog-only parts are priced by the same order as inventory parts."), "The part fills in at $121.50 ($135.00 × 0.90 = $121.50)."),
   R(S("S11-R5"), "Edit Part Request opens."), R(S("S11-R5"), "Sell Price reads 110.00."),
   R(S("S10-R12", "They can't carry a fixed price, so a typed price applies first, then the customer's tier."), "The part keeps $110.00 with the gray Manual icon.")],
  pics=["11.2", "10.5"], flags=["numbers"])

C("S10-23", K, "Parts on a fixed line total are priced by the fixed total, not the tier",
  [WOA, MX(), TR(), CU(), WO("1", "A", ", whose line 1 has a fixed line total of $450.00 with $240.00 of labor"), DESK],
  [OPENWO(), ADDP("A", "30.00"), ADDP("A", "10.00"), PARTS, "Point at the $30.00-cost part's sell price.", "Click the $30.00-cost part's description to open Edit Part Request."],
  [opened(), R(S("S10-R13"), "The first part is added to line 1."), R(S("S10-R13"), "The second part is added to line 1."),
   R(S("S10-R13", "The customer pays the line's fixed total."), "Line 1's total stays $450.00.")
   + R(S("S10-R13", "No tier or Default prices those parts, and their pricing source is Fixed line total."), "Both parts' Priced by column reads Fixed line total, not tier A."),
   R(S("S12-R12", "Part of a fixed line total of $450.00 (parts $210.00)"),
     "The details say the part is part of a fixed line total of $450.00 (parts $210.00): $450.00 − $240.00 = $210.00."),
   R(S("S10-E6", "On a fixed-total line, a part's sell price can't be typed, as today."), "Sell Price can't be typed in.", "Cost and Quantity are shown.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-24", K, "A part with no cost sells at $0.00 under the work order's tier",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Add a part to line 1 with category A and no cost.", PARTS, HOVER],
  [opened(),
   R(S("S10-N1", "If the part has no cost (empty, $0.00 or below), no rule prices it: the sell price is $0.00 and no + $ amount is added."),
     "The part saves with sell price $0.00 and margin 0.0%."),
   R(S("S10-N1", "The line is logged under the work order's tier (Default included) at $0.00, so Priced by and the details name that tier."),
     "Its Priced by column names tier A.")
   + R(S("S12-R10", "A gray Manual icon always shows beside a Manual price, and only there"), "No Manual icon shows beside $0.00."),
   R(S("S12-N2", "A part with no cost opens price details for the customer's tier at $0.00"), "The price details name tier A with a sell price of $0.00.")],
  pics=["10.10", "10.11"])

C("S10-25", K, "Emptying a priced part's cost shows $0.00 straight away",
  [WOA, MX(), TR(), CU(), WO("1", "A", ", with a special-order part not yet received on line 1, category A, cost $100.00, priced at $121.50"), DESK],
  [OPENWO(), "Click the part's description to open Edit Part Request.", "Clear the Cost box.", "Click Save Part.", PARTS],
  [opened(), R(S("S10-N1"), "Edit Part Request opens with Cost 100.00 and Sell Price 121.50."),
   R(QT("empty the cost → the sell price shows $0.00", "TPX-06"), "Sell Price changes to 0.00 at once, before saving."),
   R(S("S10-N1", "it now also applies when the cost of a part already on a line is edited to $0.00, which today keeps the old sell price"),
     "The line shows $0.00, not the old $121.50."),
   R(S("S10-N1", "so Priced by and the details name that tier"), "The part's Priced by column names tier A.")],
  pics=["11.1", "10.11"])

C("S10-26", K, "Emptying the cost of a fixed-price part on the add row keeps its fixed price",
  [WOA, MX(), TR(), CU(), "Have a new inventory part for this test at your location, in category A, cost $10.00, with a fixed sell price of $12.50.", WO(), DESK],
  [OPENWO(), "Click Add Part under line 1.", "Type the inventory part's number in Part number.", "Clear the Cost box.", "Click Save."],
  [opened(), R(S("S10-N1"), "The add row opens."), R(S("S10-R1"), "The row fills in the inventory part with Sell price 12.50."),
   R(QT("a fixed-price part keeps its fixed price", "TPX-06"), "Sell price still reads 12.50.")
   + R(S("S10-R1"), "It does not change to $0.00."),
   R(S("S10-R1", "A fixed sell price on the part"), "The part saves at $12.50 with Fixed price in its Priced by column.")],
  pics=["10.6", "10.12"])

C("S10-27", K, "Without See Financial Data the price and Priced by are hidden",
  [WOA, MX(), TR(), CU(), WO("1", "A", ", with a tier-priced part and a part with a typed price on line 1, added by an Admin"),
   "Have a second user for this test whose role has 'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit' but not 'See Financial Data'.",
   "Sign in as that second user in a separate browser window.", DESK],
  [OPENWO(), PARTS],
  [R(S("S10-N2"), "Work order 1 opens with both parts listed by description and quantity.")
   + R(S("S10-N2", "If the user lacks 'See Financial Data', the price, margin, Manual icon, Priced by column and details are hidden, as prices are today."),
       "No sell price, margin or Manual icon shows on either part."),
   R(S("S10-N2"), "The Parts tab lists both parts by description and quantity.")
   + R(S("S10-N2"), "No Priced by column shows.", "Pointing at a part shows no price details.")],
  nopic="the design draws no screen without See Financial Data")

C("S10-28", K, "A tier price below cost stands and shows a negative margin",
  [WOA, MX(d="Markup % 50"), TR("A", "A", "% Off 60"), CU(), WO(), DESK],
  [OPENWO(), ADDP("A", "10.00"), PARTS],
  [opened(),
   R(S("S10-E2", "If a rule gives a price below cost (for example a deep % Off on a cheap part), the price stands."),
     "The sell price fills in as $6.00: $10.00 × 1.50 = $15.00, less 60% = $6.00.")
   + R(S("S10-E2", "No approval step is added"), "The part saves with no approval question."),
   R(S("S10-E2", "The margin shows negative, as a manual price below cost does today."),
     "The margin shows as a negative number: ($6.00 − $10.00) ÷ $6.00 = −66.7%.", "Priced by names tier A.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-29", K, "A part uses the matrix as saved at the moment it is priced",
  [WOA, MX(), CU("B", "Default"), WO("1", "B"), "Open matrix A in a second browser window, signed in as the same Admin.", DESK],
  ["Click Edit in the second window.", "Type 50 as Default's rule in the second window.", "Open work order 1 in the first window.", ADDP(), "Click Save in the second window.",
   ADDP()],
  [R(S("S10-E3"), "Matrix A's grid opens for editing in the second window."), R(S("S10-E3"), "Default reads 50 there, not yet saved."),
   opened(),
   R(S("S10-E3", "the part uses the configuration saved at the moment it is priced"), "The part fills in at $135.00, the saved Markup % 35 ($100.00 × 1.35)."),
   R(S("S10-E3"), "Matrix A saves with Default Markup % 50."),
   R(S("S10-E3", "the part uses the configuration saved at the moment it is priced"), "The new part fills in at $150.00 ($100.00 × 1.50).", "The first part keeps $135.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-30", K, "Labor fee lines are not priced by the tier",
  [WOA, MX(), TR(), CU(), "Have a labor rate for this test at $100.00 an hour.", WO("1", "A", ", with a service call line of 1.00 hour at that labor rate (line 2)"), DESK],
  [OPENWO(), ADDP()],
  [R(S("S10-E4", "Fee and diagnostic lines that are labor (time at a labor rate, such as a service call, travel or a diagnosis) are not priced by tiers."),
     "Line 2's labor reads $100.00 (1.00 hour × $100.00), with no 10% taken off."),
   R(S("S10-R20"), "The part on line 1 fills in at $121.50 ($135.00 × 0.90 = $121.50).")
   + R(S("S10-E4"), "Line 2's labor still reads $100.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-31", K, "A fee entered as a part is priced by the tier unless it has a fixed price",
  [WOA, MX(), TR(), CU(),
   "Have a new inventory part for this test used as a fee (for example a shop supplies kit), in category A, cost $10.00, with a fixed sell price of $12.50.",
   "Have a second new inventory part for this test used as a fee (for example a fuel surcharge), in category A, cost $10.00, with no fixed sell price.", WO(), DESK],
  [OPENWO(), "Add the fixed-price fee part to line 1 from the catalog search.", "Add the other fee part to line 1 from the catalog search.", PARTS],
  [opened(),
   R(S("S10-E7", "A fixed sell price keeps it fixed"), "The fixed-price fee part comes in at $12.50."),
   R(S("S10-E7", "Otherwise, the customer's tier prices it by its category."), "The other fee part comes in at $12.15: $10.00 × 1.35 = $13.50, less 10% = $12.15."),
   R(S("S10-E7", "A fee entered as a part (shop supplies, a fuel surcharge, a card fee) is a part like any other."),
     "Priced by reads Fixed price on the first fee part.", "Priced by names tier A on the second.")],
  pics=["10.12", "10.8"], flags=["numbers"])

C("S10-32", K, "An internal customer's tier at 0% markup sells parts at cost",
  [WOA, MX(), TR("A", "A", "Markup % 0", " (for example a tier named Internal)"), CU(), WO(), DESK],
  [OPENWO(), ADDP(), PARTS],
  [opened(),
   R(S("S10-E5", "A tier whose columns are cost + 0% markup or cost + $0 sells parts at cost"), "The sell price fills in as $100.00: $100.00 × (1 + 0) = $100.00."),
   R(S("S10-E5", "the line shows that tier as its source"), "The part's Priced by column names tier A.", "Its margin reads 0.0%.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-33", K, "The sell price fills in as soon as the cost is typed",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Click Add Part under line 1.", "Pick category A in Category.", "Type 100.00 in Cost."],
  [opened(), R(S("S10-R22"), "The add row opens."), R(S("S10-R22"), "Category reads category A."),
   R(S("S10-R22", "When a cost is typed on a work order part line, the sell price fills in as quickly as today (about 0.3 seconds)"),
     "Sell price fills in with 121.50 without a noticeable wait, about as fast as today's price fill.")],
  pics=["10.6", "today:10.3"], marker=HOLD("the 0.3-second target at the largest client's size (270 categories, 10 tiers, 20 ranges) is an engineering measurement; a tester only sees the fill"))

# ---- the work order's tier ----------------------------------------------------------------------------------------------------------
C("S10-34", K, "A work order keeps its tier after the customer moves to another tier",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), WO(), DESK],
  [OPENWO(), ADDP(), "Put customer A on tier B for work orders in Edit Customer.", OPENWO(), ADDP(),
   "Create a new work order, work order 2, for customer A with one labor line.", ADDP()],
  [opened(), R(S("S10-R20"), "The part fills in at $121.50 ($135.00 × 0.90 = $121.50)."), R(S("S9-R7"), "Customer A is saved on tier B."),
   opened(),
   R(S("S10-R14", "Moving the customer to another tier affects only work orders and Part Sales made afterwards"),
     "The new part on work order 1 fills in at $121.50, still tier A's price."),
   R(S("S10-R14"), "Work order 2 opens."),
   R(S("S10-R14", "A work order or Part Sale keeps the tier its customer had for that channel when it was made"),
     "The part on work order 2 fills in at $108.00, tier B's price: $135.00 less 20% = $108.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-35", K, "A work order keeps pricing by its tier after that tier is archived",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), ADDP(), "Put customer A on Default for work orders in Edit Customer.", TIERS, "Archive tier A from its row's three-dot button.", OPENWO(), ADDP()],
  [opened(), R(S("S10-R20"), "The part fills in at $121.50 ($135.00 × 0.90 = $121.50)."), R(S("S9-R7"), "Customer A is saved on Default."), R(S("S2-R14"), "The Tiers list shows."),
   R(S("S2-R6"), "Tier A moves to the archived rows."),
   opened(),
   R(S("S10-R14", "even if that tier is archived later"), "The new part fills in at $121.50, tier A's price, not Default's $135.00.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-36", K, "A work order's tier prices new parts by its current rules",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), ADDP(), TIERS, open_tier("A"), "Set tier A's rule in matrix A to % Off 20 with Set Rule.", OPENWO(), ADDP()],
  [opened(), R(S("S10-R20"), "The part fills in at $121.50 ($135.00 × 0.90 = $121.50)."), R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."),
   R(S("S2-R24"), "Matrix A's row reads 20% off."),
   opened(),
   R(S("S10-R14", "Every part added to it is priced by that tier's current rules"), "The new part fills in at $108.00 ($135.00 × 0.80 = $108.00).")
   + R(S("S11-R6", "Parts already on a work order or Part Sale keep their prices."), "The first part keeps $121.50.")],
  pics=WO_PICS, flags=["numbers"])

C("S10-37", K, "A work order open on release day keeps Default for new parts",
  [WOA, STAGING, "Before the release is deployed to staging, have a work order for this test, work order 1, for a customer made for this test, customer A, left open.",
   "Have a new matrix for this test, matrix A, made after the deploy, pricing a new category made for this test, category A, with Default Markup % 35.",
   TR("B", "A", "% Off 10", ", made after the deploy"), "Make sure customer A is put on tier B for work orders after the deploy.", DESK],
  [OPENWO(), ADDP()],
  [R(S("S10-R14"), "Work order 1 opens."),
   R(S("S10-R14", "A work order or Part Sale already open on release day was made before tiers, so it keeps Default for both channels, whatever tier its customer is later put on"),
     "The part fills in at $135.00, Default's price ($100.00 × 1.35), not tier B's $121.50.")],
  pics=WO_PICS, marker=PRE_REL_B, flags=["numbers"])

C("S10-38", K, "Changing the customer on a work order keeps the work order's tier",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), CU("B", "B"), WO(), DESK],
  [OPENWO(), "Change the customer to customer B with Change Customer in the work order's three-dot menu.", ADDP()],
  [opened(), R(S("S14-R3"), "Work order 1 now names customer B."),
   R(S("S10-R14", "Changing the customer on a work order or Part Sale doesn't change its tier either: new parts keep being priced by the tier it was made with"),
     "The new part fills in at $121.50, tier A's price ($135.00 × 0.90 = $121.50), not customer B's tier B price ($108.00).")],
  pics=["14.4", "10.8"], flags=["numbers"])

C("S10-39", K, "A reopened paid work order prices new parts by its kept tier",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), WO("1", "A", ", invoiced and paid in full"), DESK],
  [ "Put customer A on tier B for work orders in Edit Customer.", OPENWO(), ADDP()],
  [R(S("S9-R7"), "Customer A is saved on tier B."), R(S("S10-R14"), "Work order 1 opens again for the new part."),
   R(S("S10-R14", "A work order or Part Sale keeps the tier its customer had for that channel when it was made"),
     "The new part fills in at $121.50, the tier A price the work order kept ($135.00 × 0.90 = $121.50).")
   + R(QT("reopened paid work order takes the current tier", "TPX-01"),
       "Not tier B's $108.00, the price engineering's plan gives (the question to the PO decides which is right).")],
  pics=WO_PICS, held_on="Q1", flags=["numbers"])
