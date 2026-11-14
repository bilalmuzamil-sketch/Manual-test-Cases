"""Must not change: today's pricing — INVARIANTS.md §A (pricing and repricing), §E (documents and integrations), §F (reports). Batch B, phase 2,
14 Nov 2026. Rule 96: what the V2 PRD restates "as today" or leaves silent must still work as today. Each case says where to run it (QA lead,
14 Nov 2026): staging first, the Tiered Pricing QA site too where it can show it, production only where neither can (only the AccountingHub
check may need the production test account after the release). The matching "Today" picture (production before the release) is attached as the
visible baseline. Superseded rows (CHANGED / REPLACED: INV-04, 19, 24, 30, 31, 32, 33) are new-behaviour cases in the story folders; rows a
tester can't run by hand are listed in verdicts_batch_b.INV_VERDICTS with the reason."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *
from cases_s10 import WOA, PSA, RPA, MX, TR, CU, WO, PS, OPENWO, ADDP, PARTS, HOVER, opened, STAGE, PRE_REL_B

K = "INV"
TODAYN = "Note the attached Today picture shows this screen before the release; the steps check that it still works the same way."
HIST = ("Use staging, where data from before the release is kept; the QA site only if its data predates the release; the production test account only "
        "if neither has data from before the release.")
QBW = "Use staging with the QuickBooks sandbox connected (the QA site too only if QuickBooks is connected there); production is not needed."
DEF = CU("B", "Default")
EDITP = "Click the part's description to open Edit Part Request."
SAVEP = "Click Save Part."
WOB = lambda extra="": WO("1", "B", extra)
LINEPICS = ["today:10.1", "10.8"]


def inv(key, title, pre, steps, res, pics=LINEPICS, where=STAGE, **kw):
    C(key, K, title, [where, TODAYN] + pre, steps, res, pics=pics, **kw)


# ---- §A pricing and repricing ----------------------------------------------------------------------------------------------------
inv("INV-01", "A typed sell price still wins over the matrix",
    [WOA, MX(), DEF, WOB(), DESK],
    [OPENWO(), ADDP(), EDITP, "Type 99.00 in Sell Price.", SAVEP],
    [opened(), R(S("S10-R19"), "The part fills in at $135.00 ($100.00 × 1.35 = $135.00)."), R(S("S11-R5"), "Edit Part Request opens."),
     R(S("S11-R5"), "Sell Price reads 99.00."),
     R(S("S10-R1", "A sell price or margin typed on the line, by a user allowed to change pricing"), "The part keeps $99.00 ($135.00 − $36.00 = $99.00 typed over the matrix price).")],
    flags=["numbers"])

inv("INV-02", "A fixed sell price still wins and survives matrix changes",
    [WOA, MX(), DEF, "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.", WOB(), DESK],
    [MATRICES, open_matrix("A"), EDIT, "Type 80 as Default's rule.", SAVE, OPENWO(), "Add the inventory part to line 1 from the catalog search."],
    [R(S("S3-R26"), "Matrix A is listed."), R(S("S3-R26"), "Matrix A's page opens."), R(S("S4-R4"), "The grid can be edited."), R(S("S4-R4"), "Default reads 80."),
     R(S("S3-R18"), "Matrix A saves."), opened(),
     R(S("S10-R1", "A fixed sell price on the part"), "The part comes in at $12.50, its fixed price, not $18.00 ($10.00 × 1.80).")],
    pics=["today:10.1", "10.12"], flags=["numbers"])

inv("INV-03", "A Default customer is still priced by the category's matrix",
    [WOA, MX(), "Have a new category for this test, category B, with no matrix of its own.", DEF, WOB(), DESK],
    [MATRICES, "Click the General Matrix's name.", "Note Default's rule for the range that holds $100.00 (for example Markup % 40).", OPENWO(), ADDP(), ADDP("B")],
    [R(S("S10-R17"), "The General Matrix is listed."), R(S("S10-R17"), "Its grid shows."), R(S("S10-R17"), "The rule is noted."), opened(),
     R(S("S10-R19", "A customer on Default pays that side's Default column."), "The category A part reads $135.00 ($100.00 × 1.35 = $135.00)."),
     R(QP("This PRD keeps this order and adds the customer's tier inside step 3.", "S10-R1"), "The category B part reads the General Matrix price (for Markup % 40, $100.00 × 1.40 = $140.00).")],
    flags=["numbers"])

inv("INV-05", "Cost ranges still include both ends and the last range has no top",
    [WOA, MX(rng="two cost ranges: $0.00 to $100.00 with Default Markup % 50, and $100.01 and up with Default Markup % 20"), DEF, WOB(), DESK],
    [OPENWO(), ADDP("A", "100.00"), ADDP("A", "100.01"), ADDP("A", "5000.00")],
    [opened(), R(S("S10-R3", "Start and end are both inclusive"), "The $100.00 part reads $150.00 ($100.00 × 1.50 = $150.00)."),
     R(S("S10-R3", "Inside a column, the rule whose cost range contains the part's cost applies."), "The $100.01 part reads $120.01 ($100.01 × 1.20 = $120.012)."),
     R(S("S10-R3", "A cost above the last range's start is priced by the last rule"), "The $5,000.00 part reads $6,000.00 ($5,000.00 × 1.20 = $6,000.00).")],
    flags=["numbers"])

inv("INV-06", "A negative markup is still refused",
    [ADMIN, MX(), DESK],
    [MATRICES, open_matrix("A"), EDIT, "Type -5 as Default's Markup %.", SAVE],
    [R(S("S3-R5"), "Matrix A is listed."), R(S("S3-R5"), "Matrix A's page opens."), R(S("S4-R4"), "The grid can be edited."), R(S("S3-R5"), "The cell reads -5."),
     R(S("S3-R5", "No value is negative."), "The save is refused with an error on the cell.", "Default's saved rule stays Markup % 35.")],
    pics=["today:2.1", "4.18"])

inv("INV-07", "A 0% markup still sells at cost",
    [WOA, MX(d="Markup % 0"), DEF, WOB(), DESK],
    [OPENWO(), ADDP()],
    [opened(),
     R(S("S3-R6", "0% markup or margin, + $0.00, 0% off and $0.00 off are allowed; they sell at the base price."), "The part reads $100.00 ($100.00 × 1.00 = $100.00), margin 0.0%.")],
    flags=["numbers"])

inv("INV-08", "Line margin and a typed margin still use today's math",
    [WOA, MX(), DEF, WOB(" and a special-order part not yet received on line 1, category A, cost $10.00"), DESK],
    [OPENWO(), EDITP, "Type 30 in Margin.", SAVEP],
    [R(S("S10-R4"), "Work order 1 opens; the part reads $13.50 with margin 25.9% (($13.50 − $10.00) ÷ $13.50 = 25.9%)."),
     R(S("S10-R4"), "Edit Part Request opens."), R(S("S10-R4"), "Margin reads 30."),
     R(S("S10-R4", "margin: cost ÷ (1 − margin)"), "The part reads $14.29 ($10.00 ÷ 0.70 = $14.2857) as a Manual price.")],
    pics=["today:10.1", "11.2"], flags=["numbers"])

inv("INV-09", "Editing a cost or category on an unreceived line still re-prices it",
    [WOA, MX(), MX("B", "B", "Markup % 50"), DEF, WOB(" and a special-order part not yet received on line 1, category A, cost $100.00, priced $135.00"), DESK],
    [OPENWO(), EDITP, "Type 200.00 in Cost.", SAVEP, EDITP, "Pick category B in Category.", SAVEP],
    [opened(), R(S("S11-R2"), "Edit Part Request opens."), R(S("S11-R2"), "Cost reads 200.00."),
     R(S("S11-R2", "as today"), "The part reads $270.00 ($200.00 × 1.35 = $270.00)."),
     R(S("S11-R3"), "Edit Part Request opens."), R(S("S11-R3"), "Category reads category B."),
     R(S("S11-R3", "Changing the part's category recalculates it the same way, using the new category's matrix."), "The part reads $300.00 ($200.00 × 1.50 = $300.00).")],
    flags=["numbers"])

inv("INV-10", "A line priced before tiers keeps its margin when received at a new cost",
    [WOA, "Have a work order on staging open since before the release, with a special-order part not yet received, priced before the release (for example cost $100.00, sell $135.00).", DESK],
    [ "Open that work order.", "Open the part's Receive Part window.", "Type double the part's cost in Received Cost (for example 200.00).", "Click Receive.", HOVER],
    [R(S("S11-R9"), "The work order opens."), R(S("S11-R9"), "Receive Part opens."), R(S("S11-R9"), "Received Cost reads the new cost."),
     R(S("S11-R9", "a price from Default, a line priced before tiers, or a canned line's saved price on a Default work order, received at a different cost, keeps its margin, as today (SV-9965)"),
       "The sell price doubles too, keeping the margin (for example $200.00 ÷ (1 − 0.2593) = $270.00)."),
     R(S("TP-S12-R6", "their details read \"Priced before tiers\""), "The details still read \"Priced before tiers\".")],
    where=HIST, pics=["today:10.1", "11.6"], flags=["numbers"])

inv("INV-11", "A part received with no prior cost is still priced from the matrix",
    [WOA, MX(), DEF, WOB(" and a special-order part not yet received on line 1, category A, with no cost"), DESK],
    [OPENWO(), "Open the part's Receive Part window.", "Type 100.00 in Received Cost.", "Click Receive."],
    [opened(), R(S("S11-R9"), "Receive Part opens."), R(S("S11-R9"), "Received Cost reads 100.00."),
     R(S("S11-R9", "a part received with its first cost is priced then (S11-R1)"), "The part reads $135.00 ($100.00 × 1.35 = $135.00), Priced by Default.")],
    pics=["today:10.1", "11.6"], flags=["numbers"])

inv("INV-12", "A pricier part can still sell for less across a range boundary",
    [WOA, MX(rng="two cost ranges: $0.00 to $100.00 with Default Markup % 50, and $100.01 and up with Default Markup % 10"), DEF, WOB(), DESK],
    [MATRICES, open_matrix("A"), OPENWO(), ADDP("A", "100.00"), ADDP("A", "101.00")],
    [R(S("S15-N5"), "Matrix A is listed."),
     R(S("S15-N5", "A range that sells a part that costs more for less than a part in the range before it shows no warning."), "The grid shows the two ranges.", "No below-cost or range warning shows."),
     opened(), R(S("S10-R3"), "The $100.00 part reads $150.00 ($100.00 × 1.50)."),
     R(S("S10-R3"), "The $101.00 part reads $111.10 ($101.00 × 1.10 = $111.10), less than the cheaper part.")],
    flags=["numbers"])

inv("INV-13", "One matrix still prices several categories, one matrix per category",
    [WOA, MX(extra=", pricing a second new category made for this test, category B, as well"), DEF, WOB(), DESK],
    [OPENWO(), ADDP("A"), ADDP("B")],
    [opened(), R(S("S10-R17", "A category uses one matrix; one matrix can price several categories."), "The category A part reads $135.00 ($100.00 × 1.35)."),
     R(S("S10-R17", "A category uses one matrix; one matrix can price several categories."), "The category B part reads $135.00 too, from the same matrix A.")],
    flags=["numbers"])

inv("INV-14", "Matrices still apply at every location, fixed prices per location",
    [WOA, "Use a staging client with two locations, location 1 and location 2.", MX(), DEF,
     "Have a new inventory part for this test with the same part number at both locations, category A, cost $10.00, fixed sell price $12.50 at location 1 only.",
     "Have two new work orders for this test for customer B, work order 1 at location 1 and work order 2 at location 2.", DESK],
    [OPENWO("1"), "Add the inventory part from the catalog search.", "Switch to location 2.", OPENWO("2"), "Add the inventory part from the catalog search."],
    [opened("1"), R(S("S10-R16", "A fixed sell price belongs to the location's inventory part"), "The part reads $12.50 at location 1."), R(S("S10-R16"), "Location 2 is current."),
     opened("2"), R(S("S10-R16", "What is set per location is unchanged."), "The part reads $13.50 at location 2 ($10.00 × 1.35), category A's matrix price.")],
    flags=["numbers"])

inv("INV-15", "Customer discounts are still frozen on the work order and come last",
    [WOA, MX(), DEF, "Make sure customer B has a 5% discount in Fees & Discounts, set before work order 1 was made.", WOB(" and no labor amount on line 1"), DESK],
    [ "Change customer B's discount to 10% in Fees & Discounts.", OPENWO(), ADDP(), "Click the Stats tab."],
    [R(S("S17-E1"), "Customer B's discount reads 10%."), opened(),
     R(S("S17-E1"), "The part reads $135.00 ($100.00 × 1.35), with no discount in the line price."),
     R(S("S17-E1", "applies at the end of the work order, after tier pricing, as today"),
       "Stats take the frozen 5% off at the end: $135.00 × 0.05 = $6.75; $135.00 − $6.75 = $128.25.", "The new 10% does not apply to work order 1.")],
    flags=["numbers"])

inv("INV-16", "A tax-exempt category still makes its line tax-free",
    [WOA, MX(extra=", set Tax Exempt in Settings › Categories"), MX("B", "B", "Markup % 35", ", not tax exempt"), DEF, WOB(), DESK],
    [OPENWO(), ADDP("A"), ADDP("B"), "Click Invoice."],
    [opened(), R(S("S1-E3"), "The category A part reads $135.00."), R(S("S1-E3"), "The category B part reads $135.00."),
     R(S("S1-E3", "Moving a part out of a customer-named category changes its tax where that category has a different tax-exempt setting."),
       "The invoice taxes the category B part's $135.00: tax = $135.00 × the tax rate.", "The category A part carries no tax.")],
    flags=["numbers"])

inv("INV-17", "Changing the quantity still keeps the unit price",
    [WOA, MX(), DEF, WOB(" and a special-order part on line 1, category A, cost $100.00, priced $135.00"), DESK],
    [OPENWO(), EDITP, "Type 4 in Quantity.", SAVEP],
    [opened(), R(S("S11-R4"), "Edit Part Request opens."), R(S("S11-R4"), "Quantity reads 4."),
     R(S("S11-R4", "Changing the quantity keeps the unit sell price."), "The part reads $135.00 each, total $540.00 ($135.00 × 4 = $540.00).")],
    flags=["numbers"])

inv("INV-18", "Entering a cost still replaces a typed sell price",
    [WOA, MX(), DEF, WOB(" and a special-order part on line 1, category A, cost $100.00, with a typed price of $99.00"), DESK],
    [OPENWO(), EDITP, "Type 120.00 in Cost.", SAVEP],
    [opened(), R(S("S11-R16"), "Edit Part Request opens."), R(S("S11-R16"), "Cost reads 120.00."),
     R(S("S11-R16", "Entering or changing the cost replaces a typed sell price with the calculated one, as today."), "The part reads $162.00 ($120.00 × 1.35 = $162.00).")],
    flags=["numbers"])

inv("INV-20", "Quick Add still refuses a negative sell price",
    [WOA, MX(), DEF, WOB(), DESK],
    [OPENWO(), "Click Add Part under line 1.", "Fill the row with category A, cost 100.00 and sell price -5.", "Click Save."],
    [opened(), R(S("S11-E5"), "The add row opens."), R(S("S11-E5"), "The row shows sell price -5."),
     R(S("S11-E5", "Quick Add blocks it (\"Sell price cannot be negative.\"), as today."), "\"Sell price cannot be negative.\" shows under Sell price.", "Nothing is added; the row stays open.")],
    pics=["today:10.2", "10.9"])

inv("INV-21", "A found part still takes no cost",
    [WOA, DEF, WOB(), DESK],
    [OPENWO(), "Click Add Part under line 1.", "Click More Options.", "Pick Found Part in Source."],
    [opened(), R(S("S11-E7"), "The add row opens."), R(S("S11-E7"), "The part dialog opens."),
     R(S("S11-E7", "A found part can't take a cost (the cost field is off, as today)"), "Cost is grayed and can't be typed in.", "Sell Price can be typed in.")],
    pics=["today:10.2", "11.1"])

inv("INV-22", "A fixed line total still keeps its total and locks part prices",
    [WOA, MX(), DEF, WOB(", whose line 1 has a fixed line total of $450.00 with $240.00 of labor and a special-order part not yet received, category A, cost $30.00"), DESK],
    [OPENWO(), EDITP, "Type 50.00 in Cost.", SAVEP],
    [R(S("S10-E6"), "Work order 1 opens; line 1's total reads $450.00."),
     R(S("S10-E6", "On a fixed-total line, a part's sell price can't be typed, as today."), "Sell Price can't be typed in.", "Cost can be typed in."),
     R(S("S10-E6"), "Cost reads 50.00."),
     R(S("S10-E6", "Changing a part's cost never changes the fixed total."), "Line 1's total still reads $450.00 ($240.00 labor + $210.00 parts = $450.00).")],
    flags=["numbers"])

inv("INV-23", "A fixed line total's leftover cent still goes on a quantity-1 part",
    [WOA, MX(), DEF, WOB(", whose line 1 has a fixed line total of $340.00 with $240.00 of labor and three parts in category A, quantity 1 each, cost $10.00 each"), DESK],
    [OPENWO()],
    [R(S("S10-R13", "any leftover cent goes on a part with a quantity of 1, or on the line's labor when there is none, as today"),
       "Two parts read $33.33 and one reads $33.34: $33.33 + $33.33 + $33.34 = $100.00, the parts amount ($340.00 − $240.00).",
       "Line 1's total reads $340.00.")],
    flags=["numbers"])

inv("INV-25", "Replacing the part on a line still prices it fresh",
    [WOA, MX(), MX("B", "B", "Markup % 50"), DEF, "Have a new inventory part for this test at your location, part 2, in category B, cost $200.00.",
     WOB(" and a special-order part on line 1, category A, cost $100.00, priced $135.00"), DESK],
    [OPENWO(), EDITP, "Replace the part with part 2 by typing part 2's number in Part Number.", SAVEP],
    [opened(), R(S("S11-R8"), "Edit Part Request opens."), R(S("S11-R8"), "Part 2 fills in with category B."),
     R(S("S11-R8", "Replacing the part on a line prices it fresh from the new part, as today."), "The line reads $300.00 ($200.00 × 1.50 = $300.00).")],
    flags=["numbers"])

inv("INV-26", "Invoiced work orders still keep their prices, reopened or credited",
    [WOA, MX(), DEF, WOB(" and a special-order part on line 1, category A, cost $100.00, priced $135.00, invoiced"),
     "Make sure matrix A's Default was changed to Markup % 50 after the invoice.", DESK],
    [OPENWO(), "Reopen work order 1 from its invoice.", "Click Invoice.", "Make a credit for the part line from the new invoice."],
    [R(S("S11-N1", "No rule or tier reprices a part on an invoiced work order or Part Sale."), "The part reads $135.00."),
     R(S("S11-N1", "Reopening it keeps its prices."), "The part still reads $135.00, not $150.00 ($100.00 × 1.50)."),
     R(S("S11-N1"), "The new invoice shows $135.00."),
     R(S("S11-N1", "A credit or return uses the original invoiced price."), "The credit is for $135.00.")],
    flags=["numbers"])

inv("INV-27", "A vendor invoice cost change still leaves the sell price",
    [WOA, MX(), DEF, WOB(" and a special-order part on line 1, category A, priced $135.00, received from a vendor bill at $100.00"), DESK],
    [ "Change the part's cost on its vendor bill to 110.00.", "Save the vendor bill.", OPENWO()],
    [R(S("S11-R10"), "The cost reads 110.00."), R(S("S11-R10"), "The vendor bill saves."),
     R(S("S11-R10", "The line keeps its sell price and pricing source, as today, so its margin changes."),
       "The part's cost reads $110.00, its sell price stays $135.00; margin ($135.00 − $110.00) ÷ $135.00 = 18.5%.")],
    flags=["numbers"])

inv("INV-28", "Only an unreceived special order's cost can still be re-entered",
    [WOA, MX(), DEF, "Have a new inventory part for this test at your location, in category A, cost $10.00.",
     WOB(", with that inventory part, a received special-order part and an unreceived special-order part on line 1, all category A"), DESK],
    [OPENWO(), "Click the inventory part's description.", "Click Cancel.", "Click the received special-order part's description.", "Click Cancel.",
     "Click the unreceived special-order part's description."],
    [opened(), R(S("S11-R12", "It can't be re-entered on inventory parts"), "Cost is grayed.", "The dialog opens."), R(S("S11-R12"), "The dialog closes."),
     R(S("S11-R12", "received work order parts"), "Cost is grayed.", "The dialog opens."), R(S("S11-R12"), "The dialog closes."),
     R(S("S11-R12", "a special-order or catalog part not yet received"), "Cost can be typed in.")],
    pics=["today:10.1", "11.1"])

inv("INV-29", "Approving an estimate still changes no price",
    [WOA, MX(), DEF, "Have a new work order for this test, work order 1, for customer B, still an estimate, with a part in category A priced $135.00.",
     "Make sure matrix A's Default was changed to Markup % 50 after the part was priced.", DESK],
    [OPENWO(), "Approve the estimate."],
    [opened(), R(S("S11-R14", "Approving an estimate creates no part lines and reprices nothing."), "The part still reads $135.00, not $150.00 ($100.00 × 1.50).", "No new part line appears.")],
    flags=["numbers"])

inv("INV-34", "Marking a part as warranty still leaves its price alone",
    [WOA, MX(), DEF, WOB(" and a special-order part on line 1, category A, cost $100.00, priced $135.00"), DESK],
    [OPENWO(), EDITP, "Mark the part as warranty.", SAVEP],
    [opened(), R(S("S11-E2"), "Edit Part Request opens."), R(S("S11-E2"), "The part is marked as warranty."),
     R(S("S11-E2", "Nothing sets a warranty part's price to $0 by itself, and marking a part as warranty doesn't change its price"), "The part still reads $135.00.")])

inv("INV-35", "Core charges are still priced outside the matrix",
    [WOA, MX(), TR(), CU(), WO("1", "A", " and a special-order part on line 1, category A, cost $100.00, with a core charge of $20.00"), DESK],
    [OPENWO(), EDITP],
    [opened(),
     R(QP("Core charges. Priced outside the matrix, as today; tiers don't price them.", "S10-R1"), "Core Charge reads $20.00, not reduced by tier A's 10% off.",
       "Sell Price reads $121.50 ($135.00 × 0.90 = $121.50).")],
    pics=["today:10.1", "11.1"], flags=["numbers"])

inv("INV-36", "Labor fee lines are still not priced by the matrix",
    [WOA, MX(d="Markup % 80"), DEF, "Have a labor rate for this test at $100.00 an hour.", WOB(" and a diagnosis line of 1.00 hour at that labor rate"), DESK],
    [OPENWO()],
    [R(S("S10-E4", "Fee and diagnostic lines that are labor (time at a labor rate, such as a service call, travel or a diagnosis) are not priced by tiers."),
       "The diagnosis line reads $100.00 (1.00 hour × $100.00 = $100.00).", "Matrix A's 80% markup does not touch it.")],
    flags=["numbers"])

inv("INV-37", "A fee entered as a part is still priced like any part",
    [WOA, MX(), DEF, "Have a new inventory part for this test used as a fee (for example a fuel surcharge), in category A, cost $10.00, with no fixed sell price.", WOB(), DESK],
    [OPENWO(), "Add the fee part to line 1 from the catalog search."],
    [opened(), R(S("S10-E7", "A fee entered as a part (shop supplies, a fuel surcharge, a card fee) is a part like any other."), "The fee part reads $13.50, category A's matrix price ($10.00 × 1.35 = $13.50).")],
    flags=["numbers"])

inv("INV-38", "A canned line on a Default work order still keeps its saved price",
    [WOA, MX(), DEF, "Have a new canned line for this test, canned line 1, with 1.00 hour of labor and a special-order part in category A, cost $100.00, saved price $150.00.",
     WOB(), DESK],
    [OPENWO(), "Add canned line 1 to work order 1."],
    [opened(),
     R(S("S11-R7", "when that tier is Default, a special-order or catalog part comes in at the sell price saved on the canned line, as today"),
       "The category A part reads $150.00, the saved price, not $135.00 ($100.00 × 1.35).")
     + R(S("S11-R7", "The canned line's labor isn't repriced"), "The canned line's labor reads its own saved amount.")],
    flags=["numbers"])

inv("INV-40", "A technician's part is still priced by the rules",
    [WOA, MX(), DEF, WOB(), "Have a technician user for this test assigned to line 1, signed in to Tech View in a second browser window.", DESK],
    [ "Add a part with category A and cost 100.00 to line 1 in Tech View.", OPENWO()],
    [R(S("S11-R7", "a technician adding a part (Tech View, the phone part request)"), "The part is added."),
     R(S("S11-R7"), "The part reads $135.00 ($100.00 × 1.35 = $135.00), Priced by Default, with no Manual icon.")],
    flags=["numbers"])

inv("INV-41", "The split screen and the lines left behind still work as today",
    [WOA, MX(), DEF, "Have a new work order for this test, work order 1, for customer B and an asset, with two labor lines, each with a part in category A priced $135.00.", DESK],
    [OPENWO(), "Click Split Work Order in the work order's three-dot menu.", "Tick line 2.", "Click Split.", OPENWO()],
    [opened(), R(S("S11-E6", "The split screen and its steps are unchanged from today."), "Split Work Order lists both lines with their part counts and Cancel and Split buttons."),
     R(S("S11-E6"), "Line 2 is ticked."),
     R(S("S11-E6", "Splitting a work order moves the chosen lines, labor and parts together, to a new work order with a new number for the same customer and asset"),
       "A new work order with a new number opens for customer B and the same asset with line 2."),
     R(S("S11-E6", "Lines left behind keep their prices."), "Work order 1 keeps line 1 with its part at $135.00.")],
    pics=["today:10.1", "11.3"])

inv("INV-42", "Moving a part between Part Sales still reprices nothing",
    [PSA, MX(), DEF, PS("1", "B", ", with a part in category A priced $135.00"), PS("2", "B"), "Make sure matrix A's Default was changed to Markup % 50 after the part was priced.", DESK],
    [ "Open Part Sale 1.", "Move the part to Part Sale 2.", "Open Part Sale 2."],
    [R(S("S13-R1"), "Part Sale 1 opens."), R(S("S11-R6"), "The part leaves Part Sale 1."),
     R(QT("No reprice (TP-S11-R6); the record keeps priced-for.", "TPX-10"), "On Part Sale 2 the part reads $135.00, not $150.00 ($100.00 × 1.50).")],
    pics=["today:13.1", "13.3"], flags=["numbers"])

inv("INV-43", "Change Customer is still blocked by deposits and keeps its gray caption",
    [WOA, CU("B", "Default"), CU("C", "Default"), "Have a new work order for this test, work order 1, for customer B, with a deposit taken.",
     "Have a new work order for this test, work order 2, for customer B, with no deposit.", DESK],
    [OPENWO("1"), "Click Change Customer in the work order's three-dot menu.", OPENWO("2"), "Click Change Customer in the work order's three-dot menu.", "Pick customer C."],
    [R(S("S14-N1"), "Work order 1 opens."),
     R(S("S14-N1", "Changing the customer is blocked while deposits exist, as today."), "Changing the customer is blocked, as today.", "Work order 1 still names customer B."),
     R(S("S14-R4"), "Work order 2 opens."),
     R(S("S14-R4", "The Change Customer dialog keeps today's grey caption"),
       "The dialog shows today's gray caption \"Updating the customer will change the account and contact on this work order.\" with Cancel and Update Customer.")
     + R(QD("Updating the customer will change the account and contact on this work order.", "14.3", "S14-R4"), "The caption reads as in picture 14.3."),
     R(S("S14-R4"), "Customer C is picked and Update Customer turns on.")],
    pics=["today:14.1", "14.3"])

# ---- §E documents and integrations ----------------------------------------------------------------------------------------------
inv("INV-80", "Invoices, estimates and printouts still show only the sell price",
    [WOA, MX(), TR(), CU(), WO("1", "A", " and a tier-priced part in category A at $121.50 and a part with a typed price of $99.00"), DESK],
    [OPENWO(), "Print the work order.", "Open the estimate PDF.", "Click Invoice.", "Open the invoice PDF.", "Open the work order in the customer portal."],
    [opened(),
     R(S("S12-N3", "Nothing about what priced a part shows on the customer's invoice, the estimate, the work order printout, a PDF or in the customer portal in this release."),
       "The printout shows the parts at $121.50 and $99.00.", "It shows no tier name, \"Manual\", Priced by or price details."),
     R(S("S12-N3"), "The estimate PDF shows the same two sell prices.", "It names no tier."),
     R(S("S12-N3"), "The invoice is created."),
     R(S("S12-N3"), "The invoice PDF shows $121.50 and $99.00 ($121.50 + $99.00 = $220.50 parts).", "It names no tier."),
     R(S("S12-N3"), "The portal shows the sell prices.", "It shows no pricing source.")],
    pics=["today:10.1"], flags=["numbers"])

inv("INV-81", "QuickBooks still receives the invoice prices by line category",
    [WOA, MX(extra=", mapped to a QuickBooks item for this test, item A"), DEF, WOB(" and a part in category A priced $135.00, invoiced"),
     "Sign in to the QuickBooks sandbox in a second browser window.", DESK],
    [ "Open work order 1's invoice in the QuickBooks sandbox once it has synced."],
    [R(S("S18-R1", "Each part line is sent with its sell price exactly as on the invoice, whatever priced it."), "The QuickBooks line reads $135.00 ($100.00 × 1.35).")
     + R(S("S18-R3", "QuickBooks and AccountingHub book part revenue by the category on the work order or Part Sale line, as today."), "It uses item A, category A's item.")],
    where=QBW, nopic="Story 18 has no design page; the check is made in QuickBooks", flags=["numbers"])

inv("INV-82", "With no integration connected nothing is still sent",
    [WOA, "Use a staging client with no QuickBooks, AccountingHub or IBS connection.", MX(), DEF, WOB(" and a part in category A priced $135.00"), DESK],
    [OPENWO(), "Click Invoice."],
    [opened(), R(S("S18-N1", "If no integration is connected, nothing is sent, as today."), "The invoice is created as today.", "No sync status or sync error shows on it.")],
    nopic="Story 18 has no design page; nothing to compare on a board")

inv("INV-83", "A category change still reaches AccountingHub",
    [ADMIN, "Have a new category for this test, category A.", DESK],
    [CATEGORIES, "Click category A.", "Rename category A (for example to Inv Check Renamed).", "Open AccountingHub's category list for this client."],
    [R(S("S18-R6"), "Category A is listed."), R(S("S18-R6"), "Category A's page opens."), R(S("S18-R6"), "Category A has its new name."),
     R(S("S18-R6", "Deleting a category is sent to AccountingHub the way category changes are today."), "AccountingHub shows the new name, as category changes reach it today.")],
    where="Use staging if AccountingHub is connected there; otherwise the production test account after the release (look only).",
    nopic="Story 18 has no design page; the check is made in AccountingHub",
    marker=HOLD("runs where AccountingHub is connected: staging if it is, otherwise the production test account after the release"))

# ---- §F reports ---------------------------------------------------------------------------------------------------------------------
inv("INV-85", "The Sales report shows the same figures as before the release",
    [RPA, "Before the release is deployed to staging, note the Sales report's totals for last month at one location (for example Parts and Labor totals).", DESK],
    [ "After the deploy, open Reports › Sales.", "Pick last month and the same location."],
    [R(S("S17-R3"), "Sales opens as today."),
     R(S("S17-R3", "Sales and Sales by Customer are unchanged."), "Every noted total reads the same, to the cent (noted − now = $0.00).")],
    where=HIST, pics=["today:20.1"], marker=PRE_REL_B, flags=["numbers"])

inv("INV-86", "Sales by Customer keeps its columns, credits and download headers",
    [RPA, "Have a new customer for this test, customer B, with a $50.00 goodwill credit made on the customer page today.", DESK],
    [ "Open Reports › Sales By Customer.", "Pick customer B in the Customer filter.", "Download Sales By Customer's CSV."],
    [R(QP("This PRD changes neither", "RPT-S1-R7"), "Sales By Customer opens with today's filters (Date, Product Type, Customer, Location) and columns, as in the Today picture."),
     R(S("RPT-S1-E8", "It still shows in Sales and Sales by Customer."), "Customer B's row shows the $50.00 goodwill credit.")
     + R(S("RPT-S1-E8"), "The new Sales by Tier figures are not shown on this report."),
     R(QP("\"Parts Margin %\" replaces \"Margin %\"", "RPT-S4-R6"),
       "Its CSV headers read as today, including \"Margin %\".", "The new name \"Parts Margin %\" does not appear in this download.")],
    pics=["today:20.1"])

inv("INV-87", "Sales by Customer's past months are unchanged after the release",
    [RPA, "Before the release is deployed to staging, note Sales By Customer's Totals for last month at one location (Parts Invoiced, Parts Margin, Totals).", DESK],
    [ "After the deploy, open Reports › Sales By Customer.", "Pick last month and the same location."],
    [R(S("S17-R3"), "Sales By Customer opens."),
     R(S("S17-R3", "Sales and Sales by Customer are unchanged."), "Parts Invoiced, Parts Margin and the other Totals read as noted (noted − now = $0.00).")],
    where=HIST, pics=["today:20.1"], marker=PRE_REL_B, flags=["numbers"])

inv("INV-88", "Parts Velocity and Inventory Value still open below the new reports",
    [RPA, DESK],
    [ "Open Reports.", "Click Parts Velocity.", "Click Inventory Value."],
    [R(S("RPT-S1-R1", "Reports › Parts lists Sales by Tier, Sales by Category, Parts Velocity and Inventory Value, in that order."), "Parts Velocity and Inventory Value are listed after the two new reports."),
     R(QP("changes no existing report", "RPT-S1-R1"), "Parts Velocity opens with its usual filters and columns."),
     R(QP("changes no existing report", "RPT-S1-R1"), "Inventory Value opens with its usual filters and columns.")],
    pics=["today:20.1", "20.2"])

inv("INV-89", "Inventory Value still values parts at the fixed or Default price",
    [RPA, MX(), TR(), "Have a new inventory part for this test at your location, part 1, in category A, cost $100.00, 1 in stock, no fixed sell price.",
     "Have a second new inventory part for this test, part 2, in category A, cost $10.00, 1 in stock, fixed sell price $12.50.", DESK],
    [ "Open Reports › Inventory Value.", "Find part 1 and part 2."],
    [R(QP("A customer's tier price on the inventory and catalog screens. Their Sell price stays the fixed or Default price, as today.", "S10-R1"), "Inventory Value opens."),
     R(QP("A customer's tier price on the inventory and catalog screens. Their Sell price stays the fixed or Default price, as today.", "S10-R1"),
       "Part 1's sell value reads $135.00 (category A's Default: $100.00 × 1.35), not tier A's $121.50.", "Part 2's sell value reads $12.50, its fixed price.")],
    pics=["today:20.1"], flags=["numbers"])

inv("INV-90", "Other reports still show negatives in brackets in their PDF",
    [RPA, "Use a staging location where Sales By Customer shows a negative Adjustments figure this month or last (as in the Today picture, for example (-$423.72)).", DESK],
    [ "Open Reports › Sales By Customer.", "Download Sales By Customer's PDF.", "Download Sales By Customer's CSV."],
    [R(QP("changes no existing report", "RPT-S1-R1"), "Sales By Customer shows the negative figure in brackets, as today."),
     R(QP("changes no existing report", "RPT-S1-R1"), "The PDF shows it in brackets with a $ (for example (-$423.72)), as today."),
     R(QP("changes no existing report", "RPT-S1-R1"), "The CSV shows it as a plain number with a minus (for example -423.72), as today.")],
    pics=["today:20.1"])

inv("INV-91", "Other reports' filter bars keep today's behaviour",
    [RPA, DESK],
    [ "Open Reports › Sales By Customer.", "Open its Customer filter.", "Open its Date filter.", "Pick Custom range."],
    [R(QP("changes no existing report", "RPT-S1-R1"), "The chips read as today, for example \"Customer: All customers\" and \"Product Type: All products\"."),
     R(QP("changes no existing report", "RPT-S1-R1"), "The Customer list opens as today, the cursor not put in its search box."),
     R(QP("changes no existing report", "RPT-S1-R1"), "The Date list opens as today."),
     R(QP("changes no existing report", "RPT-S1-R1"), "The custom range shows today's range hint (for example \"Range: 31 days (max 366)\").")],
    pics=["today:20.1"])

inv("INV-92", "Moving between other reports still carries no filters",
    [RPA, "Have a new customer for this test, customer B.", DESK],
    [ "Open Reports › Sales By Customer.", "Pick customer B in the Customer filter.", "Click Parts Velocity in the reports menu.", "Click Sales By Customer in the reports menu."],
    [R(QP("changes no existing report", "RPT-S1-R1"), "Sales By Customer opens."), R(QP("changes no existing report", "RPT-S1-R1"), "The Customer chip names customer B."),
     R(QP("changes no existing report", "RPT-S1-R1"), "Parts Velocity opens with its default filters."),
     R(QP("changes no existing report", "RPT-S1-R1"), "Sales By Customer opens with Customer: All customers.", "Customer B is not picked any more.")],
    pics=["today:20.1"])

inv("INV-93", "Reports still need only Reports — Page Access, costs included",
    [RPA, "Have a user for this test with 'Reports — Page Access' but not 'See Financial Data', signed in in a second browser window.", DESK],
    [ "Open Reports › Sales By Customer as that user.", "Open Reports › Sales by Tier as that user."],
    [R(QP("Viewing needs 'Reports — Page Access', like every report; cost and margin show to anyone who has it, as on Sales by Customer.", "RPT-S1-N2"),
       "Sales By Customer opens with its Parts Margin column."),
     R(S("S16-R7", "show their costs and margins to all of them, as Sales by Customer does today"), "Sales by Tier opens with Parts Cost, Parts Margin and Parts Margin %.")],
    pics=["today:20.1", "20.2"])
