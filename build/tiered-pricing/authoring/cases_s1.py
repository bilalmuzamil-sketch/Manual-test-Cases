"""Story 1 — Release day (SV-11693), PRD v37 lines 243-293, design page 1 (1.1-1.4) and today's Pricing page (today:2.1).
Release-day checks either use data that exists on staging from before the release (old work orders, old matrices, fixed rules: they
can be run any time after the deploy) or need a matrix prepared on staging BEFORE the release is deployed there (held with PRE_REL; they
stay in this folder: staging can show them, so production is not needed — QA lead, 14 Nov 2026)."""
from tp_lib import C, R, B, S, QP, QD, HOLD
from common import *

K = "S1"
PRE_REL = HOLD("needs a matrix set up on staging before the Tiered Pricing release is deployed there; run on staging after the deploy")
UNTOUCHED = ("Use a staging client on which nobody has set up tiers or changed a matrix since the release: its Tiers list shows only "
             "Default and the Audit Log of its Matrices list shows no event.")

C("S1-01", K, "After the release the default matrix is called the General Matrix",
  [ADMIN, STAGING, "Use a staging client that had a default matrix before the release (every client has one).", DESK],
  [MATRICES, "Click the General Matrix's name."],
  [R(S("S1-R1", "On release day, the client's existing default matrix is renamed the General Matrix, with its rules unchanged."),
     "The list has a matrix named General Matrix.", "No matrix carries the old default matrix name with the Default badge.")
   + R(S("S2-R1", "The General Matrix and Uncategorized keep the Default badge they carry today; nothing else carries it."),
       "The General Matrix carries the Default badge, as the default matrix did before the release."),
   R(S("S3-R18", "the General Matrix's reads \"All categories without a matrix (n)\""),
     "The General Matrix page opens.", "Under the title the Categories line reads \"All categories without a matrix\" followed by a count in brackets.")],
  pics=["today:2.1", "1.2", "1.3", "1.4"])

C("S1-02", K, "The General Matrix keeps the default matrix's ranges and markups",
  [ADMIN, STAGING, "Before the release is deployed to staging, write down the default matrix's cost ranges and markup of each range "
   "(Settings › Pricing, Default matrix).", "Use the same staging client after the deploy, with no matrix changed since (its Matrices list Audit Log shows no event).", DESK],
  [MATRICES, "Click the General Matrix's name."],
  [R(S("S1-R1"), "The General Matrix is listed."),
   R([S("S1-R1", "with its rules unchanged"), S("S3-E4", "On release day every range keeps its calculation and value.")],
     "The Default column has the same cost ranges as written down before the deploy, each with the same markup (for example \"35% markup\").",
     "No range was added, removed or moved.")],
  pics=["today:2.1", "1.4"], marker=PRE_REL)

C("S1-03", K, "A category matrix keeps its name, rules and categories after the release",
  [ADMIN, STAGING, "Before the release is deployed to staging, write down one category matrix's name, its categories and each range's markup.",
   "Use the same staging client after the deploy, with no matrix changed since (its Matrices list Audit Log shows no event).", DESK],
  [MATRICES, "Click the written-down matrix's name."],
  [R(S("S1-R9", "Each existing category matrix becomes a matrix in the library with the same name, rules and categories."),
     "A matrix with the written-down name, letter for letter, is listed.",
     "Its Categories column names the same categories as before the deploy."),
   R([S("S1-R9", "No category moves to another matrix."), S("S1-R10", "No matrix has a tier column other than Default")],
     "The matrix page's Categories line names the same categories.", "The grid has the same ranges and markups as written down.",
     "The grid shows a Default column and no other tier column.")],
  pics=["today:2.1", "1.3", "1.4"], marker=PRE_REL)

C("S1-04", K, "A client with no category matrices has only the General Matrix",
  [ADMIN, STAGING, "Before the release is deployed to staging, have a client whose Pricing page lists only its default matrix.",
   "Use the same client after the deploy, with no matrix created since (its Matrices list Audit Log shows no event).", DESK],
  [MATRICES],
  [R(S("S1-R9", "A client with no category matrices has only the General Matrix."),
     "The Matrices tab lists one matrix, the General Matrix.", "The tab label reads Matrices (1).")],
  pics=["1.2"], marker=PRE_REL)

C("S1-05", K, "A category matrix that had no rules gets the General Matrix's rules",
  [ADMIN, STAGING, "Before the release is deployed to staging, have a category matrix with no rules (matrix A) for one category (category A), "
   "and write down the default matrix's ranges and markups.", "Use the same client after the deploy, with no matrix changed since.", DESK],
  [MATRICES, "Click matrix A's name.", EDIT, "Change the Default value of the first range of matrix A to a different value.", SAVE,
   "Open the General Matrix from the Matrices list.", "Click matrix A on the Matrices list again."],
  [R(S("S1-R9"), "Matrix A is listed with category A."),
   R(S("S1-R9", "gets a copy of its client's General Matrix rules on release day, so no price changes"),
     "Matrix A's Default column has the same ranges and markups as written down for the default matrix."),
   R(S("S4-R4"), "Every cell of matrix A can be edited."),
   R(S("S4-R4"), "The edit bar counts 1 change."),
   R(S("S3-R12", "Otherwise, a matrix used by one category, or by none, saves without asking."),
     "Matrix A saves without a question and shows the new value."),
   R(S("S1-R9", "afterwards it keeps its own rules, and later General Matrix edits don't reach it"),
     "The General Matrix still shows the written-down ranges and markups."),
   R(S("S1-R9", "afterwards it keeps its own rules, and later General Matrix edits don't reach it"),
     "Matrix A shows its own changed first range value, different from the General Matrix's first range.")],
  pics=["1.4", "4.6"], marker=PRE_REL)

C("S1-06", K, "A client who set nothing up has one tier and no Part Sale prices",
  [ADMIN, STAGING, UNTOUCHED, DESK],
  [TIERS, MATRICES, "Click the General Matrix's name.", "Click the Part Sale Matrix tab."],
  [R(S("S1-R10", "the client has one tier, Default"), "The Tiers list shows one row: 1, Default, Active.", "The label above the list reads 1 active tier."),
   R(S("S1-R10", "no matrix has its Part Sale side on"), "Every matrix's Part Sale Matrix column reads \"Same as work orders\".",
     "Every matrix's Tiers column reads All."),
   R(S("S1-R10", "No matrix has a tier column other than Default"), "The grid shows a Cost Range column and a Default column only."),
   R(S("S3-R21", "Off, the tab shows only the switch and an info-icon tooltip saying Part Sales use the work order prices, with no grid and no Edit"),
     "The \"Separate Part Sale pricing\" switch is off.", "The tab shows the switch and its info icon, and no grid and no Edit button.")],
  pics=["1.1", "1.2", "1.4", "3.17"])

C("S1-07", K, "Uncategorized stays on the General Matrix after the release",
  [ADMIN, STAGING, UNTOUCHED, DESK],
  [CATEGORIES, "Click Uncategorized."],
  [R(S("S1-R11", "Uncategorized already uses the default matrix and can't be renamed today, so the rename to General Matrix changes nothing for it."),
     "Uncategorized is listed with General Matrix as its matrix.", "Uncategorized carries the Default badge."),
   R([S("S1-R11"), S("S3-R13", "Uncategorized isn't listed; it always uses the General Matrix.")],
     "Uncategorized's page names General Matrix as its matrix.", "Its name cannot be changed: no rename control is offered, while its matrix is shown.")],
  pics=["8.2", "8.3"])

C("S1-08", K, "Every customer is on Default for work orders and Part Sales",
  [ADMIN_CUST, STAGING, UNTOUCHED, "Open Customers and note how many customers the client has (for example 24).", DESK],
  [TIERS, "Point at Default's number in the Customers column."],
  [R(S("S1-R2", "Every existing customer is on the Default tier for work orders and for Part Sales."),
     "Default's Customers column shows the same number as the Customers list (24 = 24).")
   + R(S("S2-R1", "The Customers column counts the distinct customers on the tier for either channel"), "Each customer is counted once."),
   R(S("S2-R1", "with the work order and Part Sales split on hover"),
     "The hover shows the work orders count and the Part Sales count, each equal to the customer count (24 and 24).")],
  pics=["1.1"], flags=["numbers"])

C("S1-09", K, "A part added after the release is priced as it was before",
  [ADMIN_WO, STAGING,
   "Have on staging a work order created before the release with a part line priced by its category's matrix; its price details read "
   "\"Priced before tiers\". Note its category, cost and unit sell price (for example Filters, $40.00, $56.00).",
   "Make sure that category's matrix shows no Rule Changed event in its Audit Log since the release.",
   "Have a new customer for this test, customer A, left on Default.",
   "Have a new work order for this test, work order 1, for customer A."],
  ["Open work order 1.", "Add a part to work order 1 with the noted category and the noted cost.", "Point at the new line's sell price."],
  [R(S("S1-R3"), "Work order 1 opens with no part lines."),
   R(S("S1-R3", "A part added afterwards prices exactly as it would have the day before, receiving and canned lines included (S11-R9, S11-R7), except for the rare half-cent ties that now round up (S10-R5)."),
     "The new line's unit sell price equals the noted price ($56.00 = $56.00), unless the noted price came from a half-cent tie, which is now one cent higher."),
   R(S("S12-R1"), "The price details name Default as what priced the line, not \"Priced before tiers\".")],
  pics=["today:10.3", "10.5", "12.1"], flags=["numbers"])

C("S1-10", K, "Lines from before the release keep their price and show Priced before tiers",
  [ADMIN_WO, STAGING, "Have on staging a work order created before the release that is still open, with a part line priced by its matrix; "
   "note the line's sell price (for example $56.00)."],
  ["Open that work order.", "Point at the part line's sell price."],
  [R(S("S1-R3", "Parts already on work orders and Part Sales keep their prices (S11-R6); they never show the Manual icon"),
     "The line shows the noted sell price ($56.00).", "No gray Manual icon shows beside the price."),
   R(S("S1-R3", "their details read \"Priced before tiers\" (S12-R6)"), "The price details read \"Priced before tiers\".")],
  pics=["12.5", "12.4"])

C("S1-11", K, "A work order open on release day keeps Default after a tier change",
  [ADMIN_WO, STAGING, "Have on staging a work order opened before the release and still open (work order 1), for a customer you may put on a tier (customer A).",
   tier("A", ", whose rule in the General Matrix and in every category matrix is 10% off"),
   "Have a part ready to add with a cost of $100.00, in a category whose matrix's Default prices $100.00 at a known price (for example $135.00)."],
  ["Put customer A on tier A for work orders in Edit Customer.", "Open work order 1.", "Add the part to work order 1.", "Point at the new line's sell price."],
  [R(S("S9-R7"), "Customer A's Work Order Tier shows tier A after saving."),
   R(S("S1-R3"), "Work order 1 opens."),
   R(S("S1-R3", "A work order or Part Sale already open on release day keeps Default for parts added later, whatever tier its customer is put on (S10-R14)."),
     "The new line is priced at the Default price ($135.00), not tier A's 10% off ($135.00 × 0.90 = $121.50)."),
   R(S("S1-R3", "A work order or Part Sale already open on release day keeps Default for parts added later"),
     "The price details name Default.")],
  pics=["12.6", "10.8"], flags=["numbers"])

C("S1-12", K, "Fixed rules from before the release still price their parts",
  [ADMIN_WO, STAGING, "Have on staging an inventory part with a fixed sell price set before the release (for example $48.00) and a cost above zero.",
   "Have a new customer for this test, customer A, on a tier other than Default whose rule would give another price.",
   "Have a new work order for this test, work order 1, for customer A."],
  ["Click the Fixed Rules tab on Settings › Pricing.", "Open work order 1.", "Add the fixed-price part to work order 1."],
  [R(S("S1-R6", "Fixed rules are unchanged on release day and work as today."), "The Fixed Rules tab lists the part's fixed rule with its price ($48.00)."),
   R(S("S1-R6"), "Work order 1 opens."),
   R(S("S1-R6"), "The line is priced at the fixed price, $48.00 = the fixed rule's $48.00.")
   + R(S("S12-R3"), "Its Priced by column reads Fixed price.")],
  pics=["today:2.1", "10.12", "12.4"], flags=["numbers"])

C("S1-13", K, "Tiered Pricing is on for every client with no switch",
  [ADMIN, STAGING, "Use two different staging clients (client A and client B) on which nothing was set up for Tiered Pricing.", DESK],
  ["Open Settings › Pricing on client A.", "Switch to client B.", "Open Settings › Pricing on client B."],
  [R(S("S1-R7", "There is no feature flag. Everything in this PRD ships to every client on release day."),
     "Settings › Pricing shows the Tiers, Matrices and Fixed Rules tabs and opens on Tiers."),
   R(S("S1-R7"), "Client B's home page opens."),
   R(S("S1-R7", "Everything in this PRD ships to every client on release day."),
     "Settings › Pricing on client B also shows the Tiers, Matrices and Fixed Rules tabs.")],
  pics=["1.1", "today:2.1"])

C("S1-14", K, "The What's New entry explains the Tiered Pricing changes",
  [ADMIN, STAGING],
  ["Open the in-app What's New.", "Open the Tiered Pricing entry."],
  [R(S("S1-R8", "Before release, the release note (the in-app What's New entry) and the client email explain these changes in plain words"),
     "What's New lists an entry for Tiered Pricing."),
   R(S("S1-R8", "Settings › Pricing has Tiers, Matrices and Fixed Rules tabs. The default matrix is now called the General Matrix, unchanged."),
     "It says Settings › Pricing has Tiers, Matrices and Fixed Rules tabs and the default matrix is now called the General Matrix, unchanged.")
   + R(S("S1-R8", "Settings › Categories shows each category's pricing matrix and every tier's price, and edits it in place."),
       "It says Settings › Categories shows each category's pricing matrix and every tier's price.")
   + R(S("S1-R8", "Matrices gain tier columns, a Part Sale Matrix tab, the % Off, $ Off and + $ rules, the Price Part Simulator, the below-cost warning and an Audit Log."),
       "It names the tier columns, the Part Sale Matrix tab, the % Off, $ Off and + $ rules, the Price Part Simulator, the below-cost warning and the Audit Log.")
   + R(S("S1-R8", "Part lines on work orders and Part Sales show a Priced by column, and the price itself opens the details of what priced it."),
       "It says part lines show a Priced by column and the price opens its details.")
   + R(S("S1-R8", "The customer card on the customer page gains a Pricing section, and Edit Customer gains the two tier fields once the client has more than one active tier."),
       "It names the customer card's Pricing section and the two tier fields in Edit Customer.")
   + R(S("S1-R8", "A part on a line priced by a tier other than Default, received at a new cost, is priced again by that tier's current rules"),
       "It says a tier-priced part received at a new cost is priced again by the tier the line was priced for.")
   + R(S("S1-R8", "For a customer on a tier other than Default, every part on a canned line is priced by that tier when the canned line is added"),
       "It says canned-line parts are priced by the customer's tier when the canned line is added.")
   + R(S("S1-R8", "Change Customer says that existing parts keep their prices."), "It says Change Customer keeps existing parts' prices.")
   + R(S("S1-R8", "The new Sales by Tier and Sales by Category reports under Reports › Parts (S17-R2)."), "It names the Sales by Tier and Sales by Category reports.")
   + R(S("S1-R8", "For clients using customer-named categories: how to move onto tiers with CS"), "It explains moving customer-named categories onto tiers with CS.")
   + R(S("S1-R8", "A parts discount saved in a customer's Fees & Discounts still applies on top of their tier price (S17-E1)."), "It says a Fees & Discounts parts discount still applies on top of the tier price.")
   + R(S("S1-R8", "Moving a customer to another tier, or archiving a tier, changes nothing on work orders and Part Sales already made"),
       "It says moving a customer or archiving a tier changes nothing on work orders and Part Sales already made.")],
  nopic="the design draws no What's New entry",
  note="The client email named in the same requirement is sent outside ShopView and cannot be checked from the screens; only the in-app entry is checked here.")

C("S1-15", K, "A customer-named category keeps pricing by its own matrix",
  [ADMIN_WO, category("A", ", named after a customer (for example Acme pricing), with matrix A pricing it at Default 20% markup in one range"),
   category("B", ", on the General Matrix"), customer("A", ", left on Default"), "Have a new work order for this test, work order 1, for customer A."],
  ["Open work order 1.", "Add a part with a cost of $50.00 in category A.", "Change that line's category to category B."],
  [R(S("S1-E1"), "Work order 1 opens."),
   R(S("S1-E1", "Clients using customer-named categories keep working as before until they move."),
     "The line is priced by matrix A: $50.00 × 1.20 = $60.00."),
   R(S("S11-R3"), "The line is priced again by the General Matrix's Default rule for category B (not $60.00 unless that rule is also 20% markup).")],
  pics=["10.5", "12.1"], flags=["numbers"])

C("S1-16", K, "Deleting a customer-named category moves its parts to Uncategorized",
  [ADMIN_WO, category("A", ", named after a customer, with its own matrix, matrix A"), "Have a new inventory part for this test, part A, in category A.",
   "Have a new work order for this test, work order 1, with part A on a line priced by matrix A; note its price."],
  [CATEGORIES, "Click category A.", "Open the category page's three-dot menu.", "Click Delete.", "Click Delete in the dialog.", "Open work order 1."],
  [R(S("S1-E1"), "Category A is listed with matrix A."),
   R(S("S1-E1"), "Category A's page opens."),
   R(S("S8-R8"), "The menu offers Audit Log and Delete."),
   R(S("S8-R8"), "The \"Delete\" dialog for category A opens with Cancel and Delete."),
   R(S("S1-E1", "Deleting one moves its parts and past lines to Uncategorized (S8-R8, S8-E1); nothing recategorizes them."),
     "Category A is no longer listed.", "Part A's category is Uncategorized."),
   R([S("S1-E1", "Deleting one moves its parts and past lines to Uncategorized"), S("S11-R6")],
     "Part A's line shows category Uncategorized.", "The line keeps the noted price.")],
  pics=["8.10", "8.11", "8.12"])

C("S1-17", K, "Set Rule % Off reaches a customer-named category's matrix",
  [ADMIN_WO, category("A", ", named after a customer, whose own matrix A prices a $100.00 part at $160.00 for Default (60% markup)"),
   "Make sure the General Matrix's Default prices a $100.00 part at $200.00 (100% markup) for a category with no matrix of its own.",
   tier("A"), customer("A", ", on tier A for work orders"), "Have a new work order for this test, work order 1, for customer A."],
  [TIERS, open_tier("A"), "Check matrix A on the Pricing tab.", "Pick % Off in the bulk bar's rule picker.", "Type 20 in the bulk bar's value.",
   "Click Set Rule.", "Click Set Rule in the dialog.", "Open work order 1.", "Add a part with a cost of $100.00 in category A."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens on the Pricing tab."),
   R(S("S2-R22"), "The bulk bar shows \"1 matrix\" or the count 1."), R(S("S2-R22"), "% Off is picked."), R(S("S2-R22"), "The value reads 20."),
   R(S("S2-R23"), "The \"Set\" question for tier A opens."),
   R(S("S1-E2", "ShopView doesn't detect customer-named categories and blocks nothing in their matrices; Set Rule reaches them too when their matrices are checked (S2-R24)."),
     "Matrix A's row on tier A's page now reads 20% off.", "Nothing was refused or warned about on the way."),
   R(S("S1-E2"), "Work order 1 opens."),
   R(S("S1-E2", "a Fleet category priced at $160 against a real Default price of $200, then 20% off, gives $128"),
     "The part is priced $128.00: 20% off matrix A's $160.00 Default price ($160.00 × 0.80 = $128.00), not 20% off $200.00 ($160.00).")],
  pics=["2.47", "2.55", "10.8"], flags=["numbers"])

C("S1-18", K, "Moving a part out of a customer-named category changes its tax",
  [ADMIN_WO, category("A", ", named after a customer, Tax Exempt on"), category("B", ", Tax Exempt off"), customer("A"),
   "Make sure the test location charges a sales tax on taxable parts.",
   "Have a new work order for this test, work order 1, for customer A, with one part line in category A and a cost above zero."],
  ["Open work order 1.", "Change the part line's category to category B.", "Open the Stats tab."],
  [R(S("S1-E3"), "Work order 1 opens.", "Its Stats show no tax on the part line."),
   R(S("S1-E3"), "The line's category reads category B."),
   R(S("S1-E3", "Moving a part out of a customer-named category changes its tax where that category has a different tax-exempt setting."),
     "The Stats now charge the location's tax on that part line.")],
  pics=["today:10.1"],
  note="The QuickBooks half of the same edge case (revenue moves to the part's own category) is checked with the QuickBooks cases of Story 18.")

C("S1-19", K, "Existing matrix ranges have no gaps or overlaps after the release",
  [ADMIN, STAGING, "Use a staging client with a matrix created before the release that has at least three ranges (matrix A).", DESK],
  [MATRICES, "Click matrix A's name."],
  [R(S("S1-E11"), "Matrix A is listed."),
   R(S("S1-E11", "Today's matrix editor doesn't allow gaps or overlaps between ranges, so no existing matrix has one on release day."),
     "Each range starts one cent above the end of the range before it ($100.00 + $0.01 = $100.01, for example $0.00–$100.00, then $100.01–$10,000.00).",
     "No two ranges cover the same cost, and no cost between two ranges is missing.")],
  pics=["1.4", "3.2"], flags=["numbers"])

C("S1-20", K, "A matrix that started above $0.00 keeps its real start until saved",
  [ADMIN_WO, STAGING, "Before the release is deployed to staging, have a category matrix whose first range starts at $10.00 (matrix A, for category A, first range 50% markup).",
   "Use the same client after the deploy.", customer("A"), "Have a new work order for this test, work order 1, for customer A."],
  [MATRICES, "Click matrix A's name.", "Open work order 1.", "Add a part with a cost of $5.00 in category A.", MATRICES, "Click matrix A's name.", EDIT,
   "Change the Default value of the last range to its current value plus 1.", SAVE],
  [R(S("S1-E12"), "Matrix A is listed."),
   R(S("S1-E12", "An existing matrix whose first range starts above $0.00 shows its real start in the grid"), "The first range reads from $10.00."),
   R(S("S1-E12"), "Work order 1 opens."),
   R(S("S1-E12", "a cost below the first range uses the first range's rule"), "The part is priced by the first range's 50% markup: $5.00 × 1.50 = $7.50."),
   R(S("S1-E12"), "Matrix A is listed."), R(S("S1-E12"), "The first range still reads from $10.00."),
   R(S("S4-R4"), "Every cell can be edited."), R(S("S4-R4"), "The edit bar counts 1 change."),
   R(S("S1-E12", "Once that matrix side is saved, its first range starts at $0.00 (S3-R16), which changes no price."),
     "After the save the first range reads from $0.00.", "The first range keeps its 50% markup.")],
  pics=["1.4"], marker=PRE_REL, flags=["numbers"])

C("S1-21", K, "Two old matrices with the same name both stay, one with (2)",
  [ADMIN, STAGING, "Before the release is deployed to staging, have two category matrices named the same except for capitals (for example Brakes and BRAKES).",
   "Use the same client after the deploy.", DESK],
  [MATRICES],
  [R(S("S1-E9", "Two existing matrices with the same name, or with names that differ only in capitals, keep both; the second is named \"<name> (2)\"."),
     "Both matrices are listed.", "The second one's name ends with \" (2)\" (for example BRAKES (2)).")],
  pics=["1.2"], marker=PRE_REL)

C("S1-22", K, "An old category matrix called General Matrix gets (old) added",
  [ADMIN, STAGING, "Before the release is deployed to staging, have a category matrix named General Matrix in any capitals (matrix A), for category A.",
   "Use the same client after the deploy.", DESK],
  [MATRICES, "Click General Matrix (old) on the Matrices list."],
  [R(S("S1-E13", "An existing category matrix called \"General Matrix\", in any capitals, has \" (old)\" added to its name on release day"),
     "The list shows the renamed default matrix as General Matrix, with the Default badge.", "Matrix A is listed as \"General Matrix (old)\" in its own capitals."),
   R(S("S1-E13", "Its rules and categories don't change."), "Its Categories line names category A.", "Its rules are the rules matrix A had before the deploy.")],
  pics=["1.2"], marker=PRE_REL)
