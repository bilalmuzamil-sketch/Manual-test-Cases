"""Story 11 — When a part is priced again (SV-11700), PRD v37 S11 rows, design page 11 (11.1-11.7), tech-plan rows TPX-04, TPX-05, TPX-09,
TPX-10. Batch B, phase 2, 14 Nov 2026. Records are made for each test; prices are computed from the seeded rule and cost (Rule 116)."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *
from cases_s10 import WOA, PSA, MX, TR, CU, WO, PS, OPENWO, ADDP, PARTS, HOVER, opened, WO_PICS

K = "S11"
SO = "Have a new work order for this test, work order 1, for customer A, made after customer A's tier was set, with one labor line (line 1)"
SO_PART = SO + " and a special-order part (Source: Vendor) not yet received on line 1, category A, cost $100.00, priced at $121.50."
EDITP = "Click the part's description to open Edit Part Request."
SAVEP = "Click Save Part."

C("S11-01", K, "A part added with no cost is priced when its cost is first entered",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Add a special-order part (Source: Vendor) to line 1 with category A and no cost.", EDITP, "Type 100.00 in Cost.", SAVEP, PARTS],
  [opened(), R(S("S10-N1"), "The part saves at $0.00."), R(S("S11-R1"), "Edit Part Request opens with an empty Cost."),
   R(S("S11-R1"), "Cost reads 100.00."),
   R(S("S11-R1", "A part is priced when it is added with a cost, or when its cost is first entered."),
     "The part's sell price becomes $121.50 ($100.00 × 1.35 = $135.00 × 0.90 = $121.50)."),
   R(S("S12-R3"), "Its Priced by column names tier A.")],
  pics=["11.1", "10.11"], flags=["numbers"])

C("S11-02", K, "Changing the cost of a priced part recalculates its price",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [OPENWO(), EDITP, "Type 200.00 in Cost.", SAVEP, PARTS, HOVER],
  [opened(), R(S("S11-R2"), "Edit Part Request opens with Cost 100.00 and Sell Price 121.50."), R(S("S11-R2"), "Cost reads 200.00."),
   R(S("S11-R2", "Changing the cost of a priced part recalculates its sell price and margin with the rule that applies at that moment, as today"),
     "The sell price becomes $243.00: $200.00 × 1.35 = $270.00 × 0.90 = $243.00."),
   R(S("S11-R2"), "The part's row shows $243.00 with tier A in Priced by."),
   R(S("S11-R2", "and records what priced it again"), "The price details show cost $200.00 and the new sell price $243.00.")],
  pics=["11.1", "11.7"], flags=["numbers"])

C("S11-03", K, "A cost change uses the tier's rule as it is at that moment",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [TIERS, open_tier("A"), "Set tier A's rule in matrix A to % Off 20 with Set Rule.", OPENWO(), EDITP, "Type 150.00 in Cost.", SAVEP],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R24"), "Matrix A's row reads 20% off."),
   opened(), R(S("S11-R6"), "The part still reads $121.50 (its price was kept)."), R(S("S11-R2"), "Cost reads 150.00."),
   R(S("S11-R2", "with the rule that applies at that moment"), "The sell price becomes $162.00: $150.00 × 1.35 = $202.50 × 0.80 = $162.00.")],
  pics=["11.1"], flags=["numbers"])

C("S11-04", K, "Entering a cost replaces a typed sell price with the calculated one",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [OPENWO(), EDITP, "Type 99.00 in Sell Price.", SAVEP, EDITP, "Type 120.00 in Cost.", SAVEP, PARTS],
  [opened(), R(S("S11-R5"), "Edit Part Request opens."), R(S("S11-R5"), "Sell Price reads 99.00."),
   R(S("S11-R5", "Typing a sell price or margin that differs from the calculated one makes the line Manual."), "The line reads $99.00 with the gray Manual icon."),
   R(S("S11-R16"), "Edit Part Request opens with Sell Price 99.00."), R(S("S11-R16"), "Cost reads 120.00."),
   R(S("S11-R16", "Entering or changing the cost replaces a typed sell price with the calculated one, as today. This includes a Manual price"),
     "The sell price becomes $145.80: $120.00 × 1.35 = $162.00 × 0.90 = $145.80."),
   R(S("S11-R5", "A Manual price stays when the quantity changes, but not when the cost or category changes"), "Priced by names tier A again.")
   + R(S("S12-R10"), "The Manual icon is gone.")],
  pics=["11.2", "10.5"], flags=["numbers"])

C("S11-05", K, "A sell price typed before the part had a cost is replaced once a cost is entered",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Add a special-order part (Source: Vendor) to line 1 with category A, no cost and sell price 50.00.", EDITP, "Type 100.00 in Cost.", SAVEP],
  [opened(), R(S("S11-R5"), "The part saves at $50.00 as a Manual price."), R(S("S11-R16"), "Edit Part Request opens."), R(S("S11-R16"), "Cost reads 100.00."),
   R(S("S11-R16", "and a sell price typed while the part had no cost"), "The sell price becomes $121.50, the calculated price ($135.00 × 0.90 = $121.50), not $50.00.")],
  pics=["11.2"], flags=["numbers"])

C("S11-06", K, "An inventory part's cost can't be re-entered, a special order's can",
  [WOA, MX(), TR(), CU(), "Have a new inventory part for this test at your location, in category A, cost $10.00, with no fixed sell price.",
   SO + ", with that inventory part and a special-order part not yet received on line 1, both in category A.", DESK],
  [OPENWO(), "Click the inventory part's description to open Edit Part Request.", "Click Cancel.", "Click the special-order part's description to open Edit Part Request."],
  [opened(),
   R(S("S11-R12", "It can't be re-entered on inventory parts, found parts, received work order parts or invoiced work orders, as today."),
     "Cost is grayed and can't be typed in.")
   + R(QD("The cost of an inventory part can’t be re-entered.", "11.1", "S11-R12"), "Under Cost it reads \"The cost of an inventory part can't be re-entered.\""),
   R(S("S11-R12"), "Edit Part Request closes."),
   R(S("S11-R12", "a special-order or catalog part not yet received"), "Cost can be typed in.")],
  pics=["11.1"])

C("S11-07", K, "Retyping the same cost on a special order reprices it at today's rule",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [TIERS, open_tier("A"), "Set tier A's rule in matrix A to % Off 20 with Set Rule.", OPENWO(), EDITP, "Retype 100.00 in Cost.", SAVEP],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R24"), "Matrix A's row reads 20% off."),
   opened(), R(S("S11-R12"), "Edit Part Request opens with Cost 100.00."), R(S("S11-R12"), "Cost reads 100.00 again."),
   R(S("S11-R12", "Re-entering the cost reprices the line even when the amount is the same."),
     "The sell price becomes $108.00 ($135.00 × 0.80 = $108.00), not the old $121.50.")],
  pics=["11.1"], flags=["numbers"])

C("S11-08", K, "Retyping the same cost in a Parts tab cell reprices, tabbing through does not",
  [WOA, MX(), TR(), CU(), SO_PART, "Make sure tier A's rule in matrix A was changed to % Off 20 after the part was priced.", DESK],
  [OPENWO(), PARTS, "Click into the part's Cost cell.", "Press Tab.", "Click into the part's Cost cell again.", "Type 100.00 over the cost.", "Press Tab."],
  [opened(), R(S("S11-R12"), "The part reads $121.50."), R(S("S11-R12"), "The Cost cell is in edit."),
   R(QT("tabbing through stays a no-op", "TPX-04"), "The price stays $121.50: nothing was typed, so nothing reprices.")
   + R(S("S11-R12"), "The cursor moves to the next cell."),
   R(S("S11-R12"), "The Cost cell is in edit."), R(S("S11-R12"), "The cell reads 100.00."),
   R(QT("retype the same cost on a special-order part not yet received, in the dialog and on the Parts tab → it reprices", "TPX-04"),
     "The sell price becomes $108.00 ($135.00 × 0.80 = $108.00).")],
  pics=["10.8"], flags=["numbers"])

C("S11-09", K, "A Part Sale part's cost can be re-entered until the Part Sale is invoiced",
  [PSA, MX(), TR(), CU("A", "A", "Part Sales"), PS("1", "A", ", with a part in category A, cost $100.00, priced at $121.50"), DESK],
  [ "Open Part Sale 1.", "Type 200.00 in the part's Cost cell.", "Invoice Part Sale 1.", "Click the part's Cost cell."],
  [R(S("S13-R1"), "Part Sale 1 opens on its parts table."),
   R(S("S11-R12", "a Part Sale part, until the Part Sale is invoiced"), "The sell price becomes $243.00 ($200.00 × 1.35 = $270.00 × 0.90 = $243.00)."),
   R(S("S11-N1"), "Part Sale 1 is invoiced."),
   R(S("S11-N1", "Part Sales stay locked once invoiced, as today."), "The Cost cell can't be edited.", "The part still reads $243.00.")],
  pics=["13.3"], flags=["numbers"])

C("S11-10", K, "Changing a part's category reprices it with the new category's matrix",
  [WOA, MX(), MX("B", "B", "Markup % 50"), TR(), "Make sure tier A's column in matrix B is % Off 10.", CU(), SO_PART, DESK],
  [OPENWO(), EDITP, "Pick category B in Category.", SAVEP],
  [opened(), R(S("S11-R3"), "Edit Part Request opens."), R(S("S11-R3"), "Category reads category B."),
   R(S("S11-R3", "Changing the part's category recalculates it the same way, using the new category's matrix."),
     "The sell price becomes $135.00: $100.00 × 1.50 = $150.00 × 0.90 = $135.00.")],
  pics=["11.1"], flags=["numbers"])

C("S11-11", K, "A received part reprices when its category changes",
  [WOA, MX(), MX("B", "B", "Markup % 50"), TR(), "Make sure tier A's column in matrix B is % Off 10.", CU(),
   SO + " and a special-order part on line 1, category A, cost $100.00, priced at $121.50 and already received at $100.00.", DESK],
  [OPENWO(), EDITP, "Pick category B in Category.", SAVEP],
  [opened(), R(S("S11-R3"), "Edit Part Request opens."), R(S("S11-R3"), "Category reads category B."),
   R(S("S11-R3", "This includes a received part, whose category can still be changed; today only a part not yet received reprices on a category change."),
     "The sell price becomes $135.00 ($100.00 × 1.50 = $150.00 × 0.90 = $135.00).")],
  pics=["11.1"], flags=["numbers"])

C("S11-12", K, "Changing the quantity keeps the unit price and a Manual price",
  [WOA, MX(), TR(), CU(), SO + ", with two special-order parts in category A, cost $100.00 each: part 1 priced at $121.50 and part 2 with a typed price of $99.00.", DESK],
  [OPENWO(), "Click part 1's description to open Edit Part Request.", "Type 3 in Quantity.", SAVEP, "Click part 2's description to open Edit Part Request.",
   "Type 2 in Quantity.", SAVEP],
  [opened(), R(S("S11-R4"), "Edit Part Request opens for part 1."), R(S("S11-R4"), "Quantity reads 3."),
   R(S("S11-R4", "Changing the quantity keeps the unit sell price."), "Part 1 still reads $121.50 each, total $364.50 ($121.50 × 3 = $364.50)."),
   R(S("S11-R5"), "Edit Part Request opens for part 2."), R(S("S11-R5"), "Quantity reads 2."),
   R(S("S11-R5", "A Manual price stays when the quantity changes"), "Part 2 still reads $99.00 each with the gray Manual icon, total $198.00 ($99.00 × 2 = $198.00).")
   + R(QT("a quantity or description save keeps the unit price and a Manual price", "TPX-05"), "Part 2's Priced by still reads Manual.")],
  pics=["11.1", "10.5"], flags=["numbers"])

C("S11-13", K, "Typing the calculated price is not Manual, clearing restores it",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [OPENWO(), EDITP, "Type 121.50 in Sell Price.", SAVEP, PARTS, EDITP, "Type 99.00 in Sell Price.", SAVEP, EDITP, "Clear the Sell Price box.", SAVEP],
  [opened(), R(S("S11-R5"), "Edit Part Request opens with Sell Price 121.50."), R(S("S11-R5"), "Sell Price reads 121.50."),
   R(S("S11-R5", "Typing the same price does not."), "The part keeps $121.50 with no Manual icon."),
   R(S("S11-R5"), "Priced by names tier A, not Manual."),
   R(S("S11-R5"), "Edit Part Request opens."), R(S("S11-R5"), "Sell Price reads 99.00."),
   R(S("S11-R5", "Typing a sell price or margin that differs from the calculated one makes the line Manual."), "Priced by reads Manual for $99.00."),
   R(S("S11-R5"), "Edit Part Request opens."), R(S("S11-R5"), "Sell Price is empty."),
   R(S("S11-R5", "Clearing the sell price restores the fixed or calculated price."), "The part reads $121.50 again ($135.00 × 0.90 = $121.50), with tier A in Priced by.")],
  pics=["11.2", "10.5"], flags=["numbers"])

C("S11-14", K, "Tier and matrix changes never reprice parts already on a work order",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), CU("B", "B"), SO_PART, DESK],
  [TIERS, open_tier("A"), "Set tier A's rule in matrix A to % Off 30 with Set Rule.", OPENWO(), "Put customer A on tier B for work orders in Edit Customer.", OPENWO(),
   "Change the customer to customer B with Change Customer in the work order's three-dot menu.", "Reload the page."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R24"), "Matrix A's row reads 30% off."),
   R(S("S11-R6", "changes to tiers, matrices, rules or categories' matrices, Set Rule on a tier's page"), "The part still reads $121.50.", "A new price would have been $94.50 ($135.00 × 0.70 = $94.50)."),
   R(S("S9-R7"), "Customer A is saved on tier B."),
   R(S("S11-R6", "moving the customer to another tier"), "The part still reads $121.50."),
   R(S("S14-R3"), "Work order 1 names customer B."),
   R(S("S11-R6", "Parts already on a work order or Part Sale keep their prices."), "The part still reads $121.50 after the reload.", "Its Priced by still names tier A.")],
  pics=WO_PICS, flags=["numbers"])

C("S11-15", K, "Deleting a matrix never reprices parts already on a work order",
  [WOA, MX(), CU("B", "Default"), WO("1", "B", " and a part on line 1 in category A, cost $100.00, priced at $135.00"), DESK],
  [MATRICES, "Delete matrix A from its row's three-dot button.", "Click Delete in the question.", OPENWO()],
  [R(S("S3-R9"), "Matrix A is listed."), R(S("S3-R9"), "A question names matrix A and its categories."), R(S("S3-R9"), "Matrix A is gone from the list.", "Category A now shows the General Matrix on the Categories page."),
   R(S("S11-R6", "deleting a matrix"), "The part still reads $135.00.", "Its Priced by still reads Default.")],
  pics=["3.29", "10.8"])

C("S11-16", K, "Removing and re-adding a part reprices it by the work order's tier",
  [WOA, MX(), TR(), CU(), SO_PART, "Make sure tier A's rule in matrix A was changed to % Off 20 after the part was priced.", DESK],
  [OPENWO(), EDITP, "Click Remove Part.", ADDP()],
  [opened(), R(S("S11-R6"), "Edit Part Request opens."), R(S("S11-R6"), "The part is gone from line 1.", "Line 1's labor stays."),
   R(S("S11-R6", "A user reprices one line on purpose by removing and re-adding the part (which prices it by the work order's tier, S10-R14)"),
     "The re-added part reads $108.00 at tier A's current rule ($135.00 × 0.80 = $108.00).")],
  pics=["11.1", "10.8"], flags=["numbers"])

C("S11-17", K, "Parts from the part request modal and Quick Add are priced by the tier",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Add a part to line 1 with Quick Add, category A and cost 100.00.", "Add a part to line 1 from the part request modal, category A and cost 100.00.", PARTS],
  [opened(),
   R(S("S11-R7", "adding a part on a work order or Part Sale (the inline row, catalog search, Quick Add)"), "The Quick Add part reads $121.50 ($135.00 × 0.90 = $121.50)."),
   R(S("S11-R7", "the part request modal"), "The part request modal's part reads $121.50 too."),
   R(S("S11-R7", "Every way a part line is created is priced by the order in S10-R1, once it has a cost"), "Both parts name tier A in Priced by.")],
  pics=["10.6", "10.8"], flags=["numbers"])

C("S11-18", K, "A technician's part from Tech View is priced by the tier",
  [WOA, MX(), TR(), CU(), WO(), "Have a technician user for this test without 'See Financial Data', assigned to line 1 of work order 1.",
   "Open Tech View as that technician in a second browser window.", DESK],
  [ "Add a part with category A and cost 100.00 to line 1 in Tech View.", "Open work order 1 as the Admin in the first window.", PARTS],
  [R(S("S16-N4", "A technician without 'See Financial Data' can still add parts."), "The part is added in Tech View.")
   + R(S("S16-N4", "without the technician seeing the price"), "Tech View shows no sell price to the technician."),
   R(S("S11-R7"), "Work order 1 opens."),
   R(S("S11-R7", "a technician adding a part (Tech View, the phone part request)"), "The technician's part reads $121.50 ($135.00 × 0.90 = $121.50) with tier A in Priced by.")],
  pics=["10.8"], flags=["numbers"])

C("S11-19", K, "A technician's part from the phone part request is priced by the tier",
  [WOA, MX(), TR(), CU(), WO(), "Have a technician user for this test assigned to line 1 of work order 1.",
   "Use a phone (or a browser window 390 pixels wide) signed in as that technician.", DESK],
  [ "Request a part with category A and cost 100.00 on line 1 from the phone part request.", "Open work order 1 as the Admin on a desktop browser.", PARTS],
  [R(S("S11-R7"), "The part request is sent."), R(S("S11-R7"), "Work order 1 opens."),
   R(S("S11-R7", "a technician adding a part (Tech View, the phone part request)"), "The part reads $121.50 ($135.00 × 0.90 = $121.50) with tier A in Priced by.")],
  pics=["10.8"], flags=["numbers"])

C("S11-20", K, "Every part on a canned line is priced by a tier work order's tier",
  [WOA, MX(), TR(), CU(), "Have a new canned line for this test with labor of 1.00 hour and a special-order part in category A, cost $100.00, saved price $150.00.",
   WO(), DESK],
  [OPENWO(), "Add the canned line to work order 1.", PARTS],
  [opened(),
   R(S("S11-R7", "Every part on a canned line, inventory, catalog or special-order, is priced when the canned line is added, by the work order's tier (S10-R14), like any part"),
     "The canned line's part reads $121.50 ($135.00 × 0.90 = $121.50), not its saved $150.00.")
   + R(S("S11-R7", "The canned line's labor isn't repriced"), "The canned line's labor is the canned line's own labor amount."),
   R(S("S11-R7"), "Priced by names tier A for the canned line's part.")],
  pics=["10.8"], flags=["numbers"])

C("S11-21", K, "On a Default work order a canned line's special order keeps its saved price",
  [WOA, MX(), CU("B", "Default"), "Have a new canned line for this test, canned line 1, with a special-order part in category A, cost $100.00, saved price $150.00 (matrix A would price it $135.00).",
   WO("1", "B"), DESK],
  [OPENWO(), "Add canned line 1 to work order 1.", PARTS, HOVER],
  [opened(),
   R(S("S11-R7", "when that tier is Default, a special-order or catalog part comes in at the sell price saved on the canned line, as today"),
     "The category A part reads $150.00, its saved price, not Default's $135.00 ($100.00 × 1.35)."),
   R(S("S11-R7", "and records Default, so Priced by and Sales by Tier show Default"), "Priced by reads Default."),
   R(S("S12-R12", "a canned line's saved price on a work order or Part Sale whose tier is Default (S11-R7): \"Saved price from canned line \\<canned line\\>.\""),
     "The details read \"Saved price from canned line\" followed by canned line 1's name.")],
  pics=["10.8", "12.7"])

C("S11-22", K, "A canned line's no-cost part keeps its saved price until its cost comes in",
  [WOA, MX(), TR(), CU(), "Have a new canned line for this test, canned line 1, with a special-order part in category A, no cost, saved price $150.00.", WO(), DESK],
  [OPENWO(), "Add canned line 1 to work order 1.", HOVER, "Click the part's description to open Edit Part Request.", "Type 100.00 in Cost.", SAVEP],
  [opened(),
   R(S("S11-E8", "A catalog or special-order part with no cost on a canned line comes in at the sell price saved on the canned line, as today"), "The part reads $150.00."),
   R(S("S11-E8", "\"Saved price from canned line \\<canned line\\>. Priced by \\<tier\\> when its cost comes in.\""),
     "The details read \"Saved price from canned line\" with canned line 1's name, then \"Priced by\" tier A's name and \"when its cost comes in.\""),
   R(S("S11-E8"), "Edit Part Request opens."), R(S("S11-E8"), "Cost reads 100.00."),
   R(S("S11-E8", "keeps it until its cost is entered or it is received; then the work order's tier prices it (S11-R1)"),
     "The sell price becomes $121.50 ($135.00 × 0.90 = $121.50).")],
  pics=["12.7", "10.8"], flags=["numbers"])

C("S11-23", K, "A part added from an inspection is priced by the work order's tier",
  [WOA, MX(), TR(), CU(), WO("1", "A", ", with an inspection whose failed item recommends a special-order part in category A, cost $100.00"), DESK],
  [OPENWO(), "Add the recommended part to the work order from the inspection.", PARTS],
  [opened(), R(S("S11-R7"), "The recommended part is added to the work order."),
   R(S("S11-R7", "inspections"), "The part reads $121.50 ($135.00 × 0.90 = $121.50) with tier A in Priced by.")],
  pics=["10.8"], flags=["numbers"])

C("S11-24", K, "Approving an estimate reprices nothing",
  [WOA, MX(), TR(), CU(), SO_PART.replace("work order 1", "work order 1, still an estimate,"),
   "Make sure tier A's rule in matrix A was changed to % Off 20 after the part was priced.", DESK],
  [OPENWO(), "Approve the estimate.", PARTS],
  [opened(), R(S("S11-R14"), "The estimate is approved."),
   R(S("S11-R14", "Approving an estimate creates no part lines and reprices nothing."), "The part still reads $121.50, not $108.00.", "The work order has the same one part.")],
  pics=["10.8"])

C("S11-25", K, "Replacing the part on a line prices it fresh from the new part",
  [WOA, MX(), MX("B", "B", "Markup % 50"), "Have a new inventory part for this test at your location, part 2, in category B, cost $200.00, with no fixed sell price.",
   CU("B", "Default"), WO("1", "B", " and a special-order part on line 1 in category A, cost $100.00, priced at $135.00"), DESK],
  [OPENWO(), EDITP, "Replace the part with part 2 by typing part 2's number in Part Number.", SAVEP],
  [opened(), R(S("S11-R8"), "Edit Part Request opens."), R(S("S11-R8"), "The dialog fills in part 2 with category B and cost $200.00."),
   R(S("S11-R8", "Replacing the part on a line prices it fresh from the new part, as today."), "The line reads $300.00 ($200.00 × 1.50 = $300.00).")],
  pics=["11.1"], flags=["numbers"])

C("S11-26", K, "A tier-priced part received at a new cost is priced again by its tier",
  [WOA, MX(), TR(), CU(), SO + " and a special-order part ordered at a placeholder cost of $0.01, category A, not yet received.", DESK],
  [OPENWO(), "Open the part's Receive Part window.", "Type 40.00 in Received Cost.", "Click Receive.", HOVER],
  [opened(), R(S("S11-R9"), "Receive Part opens with the part's name and a Received Cost box."), R(S("S11-R9"), "Received Cost reads 40.00."),
   R(S("S11-R9", "a price from any other tier received at a different cost is priced again from the matrix at that tier's current rules"),
     "The part reads $48.60: $40.00 × 1.35 = $54.00 × 0.90 = $48.60."),
   R(S("S11-R9", "its details show the rule and cost used at receipt"), "The details show cost $40.00, tier A's 10% off rule and sell price $48.60.")],
  pics=["11.6", "11.7"], flags=["numbers"])

C("S11-27", K, "Receiving uses the tier recorded on the line, not the customer's tier now",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), SO_PART, "Make sure customer A was moved to tier B after the part was priced.", DESK],
  [OPENWO(), "Open the part's Receive Part window.", "Type 200.00 in Received Cost.", "Click Receive.", PARTS],
  [opened(), R(S("S11-R9"), "Receive Part opens."), R(S("S11-R9"), "Received Cost reads 200.00."),
   R(S("S11-R9", "It uses the customer and tier recorded on the line, never the customer's current tier, and the line keeps them"),
     "The part reads $243.00 by tier A ($200.00 × 1.35 = $270.00 × 0.90 = $243.00), not $216.00 by tier B."),
   R(S("S11-R9"), "Priced by still names tier A.")],
  pics=["11.7"], flags=["numbers"])

C("S11-28", K, "A Default line received at a new cost keeps its margin",
  [WOA, MX(), CU("B", "Default"), WO("1", "B", " and a special-order part on line 1 in category A, cost $100.00, priced at $135.00, not yet received"), DESK],
  [OPENWO(), "Open the part's Receive Part window.", "Type 200.00 in Received Cost.", "Click Receive."],
  [opened(), R(S("S11-R9"), "Receive Part opens."), R(S("S11-R9"), "Received Cost reads 200.00."),
   R(S("S11-R9", "a price from Default, a line priced before tiers, or a canned line's saved price on a Default work order, received at a different cost, keeps its margin, as today (SV-9965)"),
     "The part reads $270.00: the margin ($135.00 − $100.00) ÷ $135.00 = 25.93% is kept, $200.00 ÷ (1 − 0.2593) = $270.00.", "Priced by still reads Default.")],
  pics=["11.7"], flags=["numbers"])

C("S11-29", K, "A Manual price received at a new cost keeps its margin",
  [WOA, MX(), TR(), CU(), SO + " and a special-order part on line 1 in category A, cost $2.00, with a typed price of $4.00, not yet received.", DESK],
  [OPENWO(), "Open the part's Receive Part window.", "Type 3.00 in Received Cost.", "Click Receive."],
  [opened(), R(S("S11-R9"), "Receive Part opens."), R(S("S11-R9"), "Received Cost reads 3.00."),
   R(S("S11-R9", "a Manual price received at a different cost keeps its margin, as today (SV-9965). Example: $2.00 → $3.00 on a $4.00 part becomes $6.00"),
     "The part reads $6.00: the 50% margin ($4.00 − $2.00) ÷ $4.00 is kept, $3.00 ÷ 0.50 = $6.00.", "The gray Manual icon still shows.")],
  pics=["11.7"], flags=["numbers"])

C("S11-30", K, "A fixed-price part received at a new cost keeps its fixed price",
  [WOA, MX(), TR(), CU(), "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50, with no stock.",
   SO + ", with that inventory part requested on line 1 and not yet received.", DESK],
  [OPENWO(), "Open the part's Receive Part window.", "Type 11.00 in Received Cost.", "Click Receive."],
  [opened(), R(S("S11-R9"), "Receive Part opens."), R(S("S11-R9"), "Received Cost reads 11.00."),
   R(S("S11-R9", "a Fixed price or a fixed line total doesn't change (S10-E6)"), "The part still reads $12.50.", "Priced by still reads Fixed price.")],
  pics=["11.6", "10.12"])

C("S11-31", K, "The receive notice says the sell price updates, without the margin words",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [OPENWO(), "Open the part's Receive Part window.", "Type 150.00 in Received Cost."],
  [opened(),
   R(S("S11-R15", "The receive window says nothing about tiers."), "Receive Part shows the part's name and the Received Cost box, with Cancel and Receive.")
   + R(S("S11-R15"), "No tier name shows in the window."),
   R(S("S11-R15", "Its 6-second notice reads \"Updating the cost also updates the sell price.\", replacing today's \"Updating the cost also updates the sell price to keep the margin.\""),
     "A notice reads \"Updating the cost also updates the sell price.\" for about 6 seconds.", "The words \"to keep the margin\" are gone from it.")],
  pics=["11.6"])

C("S11-32", K, "Purchase Order Receive previews the tier's new price",
  [WOA, MX(), TR(), CU(), CU("B", "Default"),
   "Have a new purchase order for this test with two special-order parts, both category A, cost $100.00: one requested on a new work order for customer A (priced $121.50, tier A), one on a new work order for customer B (priced $135.00, Default).", DESK],
  [ "Open the purchase order's Receive window.", "Type 200.00 as the received cost of both parts."],
  [R(S("S11-R9"), "The purchase order's Receive window opens with both parts."),
   R(QT("COST_MARGIN_NOTICE text becomes \"Updating the cost also updates the sell price.\"", "TPX-09"), "The notice reads \"Updating the cost also updates the sell price.\"")
   + R(QT("a tier row gives the matrix preview; Default gives derived", "TPX-09"),
       "Customer A's part previews $243.00 from tier A's rule ($200.00 × 1.35 = $270.00 × 0.90 = $243.00).",
       "Customer B's part previews $270.00, its kept margin ($200.00 ÷ (1 − 0.2593) = $270.00).")],
  nopic="the design draws only the work order's Receive Part window (11.6), not Purchase Order Receive", flags=["numbers"])

C("S11-33", K, "A cost changed from a vendor invoice keeps the line's sell price",
  [WOA, MX(), TR(), CU(), SO + " and a special-order part on line 1, category A, cost $100.00, priced $121.50, received from a vendor bill at $100.00.", DESK],
  [ "Open the vendor bill the part was received on.", "Change the part's cost on the vendor bill to 110.00.", "Save the vendor bill.", OPENWO(), PARTS],
  [R(S("S11-R10"), "The vendor bill opens."), R(S("S11-R10"), "The cost reads 110.00."), R(S("S11-R10"), "The vendor bill saves."), opened(),
   R(S("S11-R10", "A cost changed from a vendor invoice edited after receiving, or from an order item before receiving, updates the line's cost. The line keeps its sell price and pricing source, as today, so its margin changes."),
     "The part's cost reads $110.00 and its sell price stays $121.50 with tier A in Priced by.",
     "Its margin falls to ($121.50 − $110.00) ÷ $121.50 = 9.5%.")],
  nopic="the design draws no vendor bill", flags=["numbers"])

C("S11-34", K, "Invoiced work orders are never repriced, reopened or not",
  [WOA, MX(), TR(), CU(), SO_PART.replace(", priced at $121.50.", ", priced at $121.50, invoiced."), DESK],
  [TIERS, open_tier("A"), "Set tier A's rule in matrix A to % Off 20 with Set Rule.", OPENWO(), "Reopen work order 1 from its invoice.", PARTS],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R24"), "Matrix A's row reads 20% off."),
   R(S("S11-N1", "No rule or tier reprices a part on an invoiced work order or Part Sale."), "The invoiced part reads $121.50."),
   R(S("S11-N1"), "Work order 1 is open again."),
   R(S("S11-N1", "Reopening it keeps its prices."), "The part still reads $121.50, not $108.00 ($135.00 × 0.80).")],
  pics=["10.8"], flags=["numbers"])

C("S11-35", K, "A Part Sale return credits the original invoiced price",
  [PSA, MX(), TR(), CU("A", "A", "Part Sales"), PS("1", "A", ", with a part in category A, cost $100.00, priced $121.50, invoiced"),
   "Make sure tier A's rule in matrix A was changed to % Off 20 after Part Sale 1 was invoiced.", DESK],
  [ "Open Part Sale 1.", "Return the part from Part Sale 1."],
  [R(S("S11-N1", "Part Sales stay locked once invoiced, as today."), "Part Sale 1 opens invoiced, its part at $121.50."),
   R(S("S11-N1", "A credit or return uses the original invoiced price."), "The return credits $121.50, not $108.00 ($135.00 × 0.80).")],
  pics=["13.3"], flags=["numbers"])

C("S11-36", K, "A fixed-price part keeps its price when its category changes",
  [WOA, MX(extra=", so the part's first category has a matrix of its own"), MX("B", "B", "Markup % 50"), CU("B", "Default"),
   "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.",
   "Have a new work order for this test, work order 1, for customer B, with that inventory part on line 1 at $12.50.", DESK],
  [OPENWO(), "Click the part's description to open Edit Part Request.", "Pick category B in Category.", SAVEP],
  [opened(), R(S("S11-N2"), "Edit Part Request opens with Sell Price 12.50 and category A."), R(S("S11-N2"), "Category reads category B."),
   R(S("S11-N2", "If the part has a fixed sell price, cost and category changes don't change its price"), "The part still reads $12.50.", "Priced by still reads Fixed price.")],
  pics=["11.1", "10.12"])

C("S11-37", K, "A warranty part is typed to $0 by hand and shows as Manual",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [OPENWO(), EDITP, "Mark the part as warranty.", SAVEP, EDITP, "Type 0.00 in Sell Price.", SAVEP, PARTS],
  [opened(), R(S("S11-E2"), "Edit Part Request opens."), R(S("S11-E2"), "The part is marked as warranty."),
   R(S("S11-E2", "Nothing sets a warranty part's price to $0 by itself, and marking a part as warranty doesn't change its price"), "The part still reads $121.50."),
   R(S("S11-E2"), "Edit Part Request opens."), R(S("S11-E2"), "Sell Price reads 0.00."),
   R(S("S11-E2", "The advisor types $0, so the line is Manual and shows the Manual icon (S12-R10)."), "The part reads $0.00 with the gray Manual icon."),
   R(S("S11-E2", "The part keeps its recorded cost."), "Priced by reads Manual.", "The cost still reads $100.00.")],
  pics=["11.2", "10.5"])

C("S11-38", K, "A found part takes no cost and its typed price is Manual",
  [WOA, MX(), TR(), CU(), WO(), DESK],
  [OPENWO(), "Click Add Part under line 1.", "Click More Options.", "Pick Found Part in Source.", "Type 25.00 in Sell Price.", "Click Save Part.", PARTS],
  [opened(), R(S("S11-E7"), "The add row opens."), R(S("S11-E7"), "The part dialog opens with Source."),
   R(S("S11-E7", "A found part can't take a cost (the cost field is off, as today)"), "Cost is grayed and can't be typed in.", "Sell Price can be typed in."),
   R(S("S11-E7"), "Sell Price reads 25.00."),
   R(S("S11-E7", "Its sell price is typed, and it shows as Manual."), "The part saves at $25.00 with the gray Manual icon."),
   R(S("S11-E7", "no tier or Default prices it"), "Priced by reads Manual.")],
  pics=["11.1", "10.5"])

C("S11-39", K, "A negative sell price is Manual on the Parts tab and refused in Quick Add",
  [WOA, MX(), TR(), CU(), SO_PART, DESK],
  [OPENWO(), "Click Add Part under line 1.", "Fill the row with category A, cost 100.00 and sell price -5.", "Click Save.", "Click Cancel.", EDITP, "Type -5.00 in Sell Price.", SAVEP],
  [opened(), R(S("S11-E5"), "The add row opens."), R(S("S11-E5"), "The row shows sell price -5."),
   R(S("S11-E5", "Quick Add blocks it (\"Sell price cannot be negative.\"), as today."), "Under Sell price it reads \"Sell price cannot be negative.\" in red.", "The row stays open, unsaved.")
   + R(QD("Sell price cannot be negative.", "10.9", "S11-E5"), "The message sits under the Sell price box, as in picture 10.9."),
   R(S("S11-E5"), "The add row closes with nothing added.", "The existing part still reads $121.50."), R(S("S11-E5"), "Edit Part Request opens."), R(S("S11-E5"), "Sell Price reads -5.00."),
   R(S("S11-E5", "A negative sell price can still be typed on the Parts tab and in the part dialog, as today; it is a Manual price."),
     "The part saves at −$5.00 with the gray Manual icon.")],
  pics=["10.9", "11.2"])

C("S11-40", K, "Split lines are priced again by the customer's current tier",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(),
   "Have a new work order for this test, work order 1, for customer A, made after customer A's tier was set, with two labor lines, each with a special-order part in category A, cost $100.00, priced $121.50.",
   "Make sure customer A was moved to tier B for work orders after work order 1 was made.", DESK],
  [OPENWO(), "Click Split Work Order in the work order's three-dot menu.", "Tick line 2.", "Click Split.", PARTS],
  [opened(), R(S("S11-E6", "The split screen and its steps are unchanged from today."), "Split Work Order opens with both lines and their part counts."),
   R(S("S11-E6"), "Line 2 is ticked."),
   R(S("S11-E6", "Splitting a work order moves the chosen lines, labor and parts together, to a new work order with a new number for the same customer and asset"),
     "A new work order with a new number opens for customer A with line 2's labor and part."),
   R(S("S11-E6", "The new work order or Part Sale takes the customer's current settings, including their current tier for that channel (S10-R14), and its parts are priced again by S10-R1 as if added there."),
     "The moved part reads $108.00, tier B's price ($135.00 × 0.80 = $108.00), with tier B in Priced by.")
   + R(S("S11-E6", "Lines left behind keep their prices."), "On work order 1 line 1's part still reads $121.50.")],
  pics=["11.3", "11.4", "11.5"], flags=["numbers"])

C("S11-41", K, "Split lines with typed or fixed prices keep them",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.",
   "Have a new work order for this test, work order 1, for customer A, with line 2 holding a special-order part in category A, cost $100.00, with a typed price of $99.00, and that fixed-price inventory part at $12.50.",
   "Make sure customer A was moved to tier B for work orders after work order 1 was made.", DESK],
  [OPENWO(), "Click Split Work Order in the work order's three-dot menu.", "Tick line 2.", "Click Split.", PARTS],
  [opened(), R(S("S11-E6"), "Split Work Order opens."), R(S("S11-E6"), "Line 2 is ticked."), R(S("S11-E6"), "The new work order opens with line 2."),
   R(S("S11-E6", "A moved line with a Manual price, a fixed price, a fixed line total or a canned line's saved price keeps it, since those come before the tier (S10-R1)."),
     "The typed-price part still reads $99.00 with Manual in Priced by.", "The fixed-price part still reads $12.50 with Fixed price in Priced by.")],
  pics=["11.3", "11.5"])

C("S11-42", K, "A received part moved by a split is priced again at its line's cost",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(),
   "Have a new work order for this test, work order 1, for customer A, with line 2 holding a special-order part in category A, priced $121.50 and received at $100.00.",
   "Make sure customer A was moved to tier B for work orders after work order 1 was made.", DESK],
  [OPENWO(), "Click Split Work Order in the work order's three-dot menu.", "Tick line 2.", "Click Split."],
  [opened(), R(S("S11-E6"), "Split Work Order opens."), R(S("S11-E6"), "Line 2 is ticked."),
   R(S("S11-E6", "Every other moved part, received or not, is priced again by the new work order's or Part Sale's tier at the cost on its line (S11-R9)."),
     "On the new work order the received part reads $108.00 ($135.00 × 0.80 = $108.00), tier B's price.")],
  pics=["11.5"], flags=["numbers"])

C("S11-43", K, "Moving a part to another Part Sale keeps its price",
  [PSA, MX(), TR(), CU("A", "A", "Part Sales"), PS("1", "A", ", with a part in category A, cost $100.00, priced $121.50"), PS("2", "A"),
   "Make sure tier A's rule in matrix A was changed to % Off 20 after the part was priced.", DESK],
  [ "Open Part Sale 1.", "Move the part to Part Sale 2.", "Open Part Sale 2.", HOVER],
  [R(S("S13-R1"), "Part Sale 1 opens with the part at $121.50."), R(S("S11-R6"), "The part leaves Part Sale 1."),
   R(QT("No reprice (TP-S11-R6); the record keeps priced-for.", "TPX-10"), "On Part Sale 2 the part reads $121.50, not $108.00.")
   + R(S("S11-R6", "nothing else reprices a whole work order in this release"), "Priced by still names tier A ($135.00 × 0.80 = $108.00 would have been the new price)."),
   R(QT("No reprice (TP-S11-R6); the record keeps priced-for.", "TPX-10"), "The details still name customer A as the customer it was priced for.")],
  pics=["13.3", "13.4"], flags=["numbers"])
