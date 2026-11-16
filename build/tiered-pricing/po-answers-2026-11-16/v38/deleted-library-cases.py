"""The 25 held design-version cases deleted on 16 Nov 2026 (Rule 130; QA lead: "Named set, write it (Recommended)").
Word-for-word library source as it stood before deletion, each with the PO question, Matt Barge's chosen option and why the case went.
Not imported by build.py (record only). TestRail before-copies: po-answers-2026-11-16/write/deleted/C<id>-before.json."""

# ---- D-224 = C1210964 (https://shopview.testrail.io/index.php?/cases/view/1210964) — from authoring/cases_design_batch_a.py
# question 27: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Only lines priced by a tier or Default count; Manual, Fixed price, Fixed line total and Before tiers lines don't, and no tier name shows when several tiers priced them, as the PRD says. PRD stays; canvas 14.8 and the build follow it.
# C("D-224", K, "Design: the notice names Fixed price and Manual lines too",
#   [ADMIN_WO, tier("A"), customer("A", ", on tier A for work orders"), customer("B"),
#    "Have a new inventory part for this test, part F, with a fixed sell price.",
#    "Have a new work order for this test, work order 1, for customer A, with a part priced by tier A, a part with a typed price and part F.", W1440],
#   [OPENWO, "Open work order 1's three-dot menu.", "Click Change Customer.", "Pick customer B.", "Click Update Customer."],
#   [look("14.8", "S14-R2", "Work order 1 opens."), look("14.8", "S14-R2", "The menu lists Change Customer."), look("14.8", "S14-R2", "The dialog opens."), look("14.8", "S14-R2", "Customer B is picked."),
#    R(QD("4 lines priced at Tier 2, Fixed price and Manual for the previous customer", "14.8", "S14-R2"),
#      "The notice reads \"3 lines priced at\" tier A's name \", Fixed price and Manual for the previous customer\", counting the typed and fixed-price lines too (1 + 1 + 1 = 3), as in picture 14.8.")],
#   pics=["14.8"], held_on="Q27", flags=DV)

# ---- D-211 = C1210953 (https://shopview.testrail.io/index.php?/cases/view/1210953) — from authoring/cases_design_batch_a.py
# question 26: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) As the PRD says: the matrix, its side and the rule; for a previous tier, a sentence such as "Fleet is the same as the previous tier, Wholesale, in Brakes." Caveat: only a part on a Part Sale whose matrix has no separate Part Sale Matrix shows the side as "Same as work orders" (it was priced by the Work Order Matrix). Parts on work orders always show Work Order Matrix. PRD fix needed: Story 12 price details add the Part Sale "Same as work orders" case. Canvas 12.1, 12.2 and the build follow.
# C("D-211", K, "Design: the price details' matrix line and Same as previous tier row",
#   [ADMIN_WO, tier("A"), tier("B", ", made right after tier A, on Same as previous tier in matrix A"),
#    "Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: Default Markup % 50, tier A Markup % 20.",
#    "Have a new inventory part for this test, part A, in category A, cost $10.00.", customer("A", ", on tier B for work orders"),
#    "Have a new work order for this test, work order 1, for customer A, with part A added.", W1440],
#   [OPENWO, "Point at part A's sell price on the Lines tab."],
#   [look("12.2", "S12-R18", "Work order 1 opens."),
#    R(QD("Same as previous tier", "12.2", "S12-R18"), "The Matrix row reads matrix A's name, \" · \" and tier A's name, with no Work Order Matrix side named.",
#      "A row labelled \"Same as previous tier\" reads tier A's name, as in picture 12.2.")],
#   pics=["12.1", "12.2"], held_on="Q26", flags=DV)

# ---- D-185 = C1210946 (https://shopview.testrail.io/index.php?/cases/view/1210946) — from authoring/cases_design_batch_a.py
# question 23: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) A tooltip on the Counter Sale customer's tier fields: "Every walk-in sale uses this tier." PRD stays; canvas 9.36 and the build drop the always-visible info box.
# C("D-185", K, "Design: the Counter Sale note shows as a blue box above the tier fields",
#   [CU, tier("A", ", so the tier fields show"), W1440],
#   ["Open the built-in Counter Sale customer's page.", "Click the edit pencil on the customer card."],
#   [look("9.36", "S9-R8", "The Counter Sale customer's page opens."),
#    R(QD("Every walk-in sale uses this tier.", "9.36", "S9-R8"), "A light blue box with an info icon reads \"Every walk-in sale uses this tier.\" just above Work Order Tier, shown without pointing at anything, as in picture 9.36.")],
#   pics=["9.36"], held_on="Q23", flags=DV)

# ---- D-172 = C1210933 (https://shopview.testrail.io/index.php?/cases/view/1210933) — from authoring/cases_design_batch_a.py
# question 22: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Work orders, Part Sales and Both, as the PRD and the developers' plan say. "Work orders" means customers on the tier for work orders only. By the same reading, "Part Sales" is Part Sales only and "Both" is on the tier for both, so each customer matches exactly one option. PRD fix needed: Story 9 states what each option means.
# C("D-172", K, "Design: the Customers tab's Sales Type filter rows",
#   [ADMIN_CUST, tier("A"), cu("A", "tier A", "tier A"), cu("B", "tier A"), W1440],
#   [TIERS, open_tier("A"), CTAB, "Open the Sales Type filter."],
#   [look("9.3", "S9-R9", "The Tiers list shows tier A."), look("9.3", "S9-R9", "Tier A's page opens."), look("9.3", "S9-R9", "The Customers tab shows."),
#    R(QD("Work Orders only", "9.3", "S9-R9"), "A panel opens with the rows \"Work Orders and Part Sales\" and \"Work Orders only\", each with a count, and \"Clear selection\", as in picture 9.3.")],
#   pics=["9.3"], held_on="Q22", flags=DV)

# ---- D-171 = C1210932 (https://shopview.testrail.io/index.php?/cases/view/1210932) — from authoring/cases_design_batch_a.py
# question 17: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The PRD's full sentences with a period on all three screens, for example 'No matrices match the search "…".' and 'No categories match the search "…".' PRD stays; canvas 6.10, 7.6, 9.2 and the build follow it.
# C("D-171", K, "Design: a Customers tab no-match message offers Clear All Filters",
#   [ADMIN_CUST, tier("A"), W1440],
#   [TIERS, open_tier("A"), CTAB, "Type zzz in the search."],
#   [look("9.2", "S9-N6", "The Tiers list shows tier A."), look("9.2", "S9-N6", "Tier A's page opens."), look("9.2", "S9-N6", "The Customers tab shows."),
#    R(QD("No customer matches \"zzz\"", "9.2", "S9-N6"), "The tab reads \"No customer matches \"zzz\"\" with no period, and a Clear All Filters button, as in picture 9.2.")],
#   pics=["9.2"], held_on="Q17", flags=DV)

# ---- D-168 = C1210930 (https://shopview.testrail.io/index.php?/cases/view/1210930) — from authoring/cases_design_batch_a.py
# question 20: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The PRD's wording for both: Delete [category]? keeps the QuickBooks sentence, and the taken-name error is just "A category called [name] already exists". PRD stays; canvas 8.11, 8.4 and the build follow it.
# C("D-168", K, "Design: the delete question and taken-name error as the design words them",
#   [ADMIN, category("A", ", named for example Wheel Seals"), category("B"), W1440],
#   [CATEGORIES, "Click category B's row.", "Open the page's three-dot menu.", "Click Delete.", "Click Cancel.", "Click the title.", "Type category A's name.", "Press Enter."],
#   [look("8.11", "S8-R8", "The Categories list shows."), look("8.11", "S8-R8", "Category B's page opens."), look("8.10", "S8-R8", "The menu lists Audit Log and Delete."),
#    R(QD("Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. This can’t be undone.", "8.11", "S8-R8"),
#      "The dialog reads \"Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. This can't be undone.\", with no sentence about invoices already sent.")
#    , look("8.11", "S8-R8", "The dialog closes."), look("8.4", "S8-N3", "The title becomes an outlined box."), look("8.4", "S8-N3", "The typed name shows."),
#    R(QD("A category called tires already exists. Click away to keep Brakes.", "8.4", "S8-N3"),
#      "The red error reads \"A category called\", the typed name, \"already exists. Click away to keep\" and category B's name, with a period.")],
#   pics=["8.4", "8.10", "8.11"], held_on="Q20", flags=DV)

# ---- D-147 = C1210919 (https://shopview.testrail.io/index.php?/cases/view/1210919) — from authoring/cases_design_batch_a.py
# question 18: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) A line above the grid on the category's page: "The [matrix] matrix also prices [n] other categories: [A] · [B]." PRD stays (Story 7); canvas 7.9 and the build change from the tooltip to the line. PRD fix needed: note this line as an exception to the Story 19 tooltip rule.
# C("D-147", K, "Design: the other categories named in an info icon by the matrix name",
#   [ADMIN, mx("A", ", category A, and a second new category made for this test, category B"), W1440],
#   [CATEGORIES, "Click category A's row.", "Point at the info icon beside matrix A's name above the grid."],
#   [look("7.9", "S7-R15", "The Categories list shows."), look("7.9", "S7-R15", "Above the grid, matrix A's name shows with an info icon beside it, and no sentence line."),
#    R(QD("The Fluids 30 matrix also prices 1 other category: Oil.", "7.9", "S7-R15"),
#      "A dark tooltip reads \"The\", matrix A's name, \"matrix also prices 1 other category:\" and category B's name, ending with a period, as in picture 7.9.")],
#   pics=["7.9"], held_on="Q18", flags=DV)

# ---- D-130 = C1210911 (https://shopview.testrail.io/index.php?/cases/view/1210911) — from authoring/cases_design_batch_a.py
# question 17: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The PRD's full sentences with a period on all three screens, for example 'No matrices match the search "…".' and 'No categories match the search "…".' PRD stays; canvas 6.10, 7.6, 9.2 and the build follow it.
# C("D-130", K, "Design: the no-match messages say No matrices match and No category matches",
#   [ADMIN, W1440],
#   [MATRICES, "Type zzz in the search.", CATEGORIES, "Type zzz in the search."],
#   [look("6.10", "S6-R3", "The Matrices list shows."),
#    R(QD("No matrices match \"zzz\"", "6.10", "S6-R3"), "The list area shows a search icon and reads \"No matrices match \"zzz\"\" with no period, and a Clear Search button, as in picture 6.10."),
#    look("7.6", "S7-R4", "The Categories list shows."),
#    R(QD("No category matches \"zzz\"", "7.6", "S7-R4"), "The list area reads \"No category matches \"zzz\"\" with no period, and a Clear Search button, as in picture 7.6.")],
#   pics=["6.10", "7.6"], held_on="Q17", flags=DV)

# ---- D-443 = C1211036 (https://shopview.testrail.io/index.php?/cases/view/1211036) — from authoring/cases_design_batch_b.py
# question 30: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Sales Type, Category, Priced By, Customer, as the reports PRD writes and the developers build, keeping the design's "All …" wording. Reports PRD stays; canvas 20.20 follows it.
# C("D-443", K, "Design: the CSV's filter lines put Priced By before Category",
#   [RPA, W1440],
#   [SBT, "Click Download Summary (CSV) in the ⋯ menu."],
#   [R(QD("Prototype stand-in", "20.20", "RPT-S4-R7"), "Sales by Tier opens; the download is the real file the stand-in of picture 20.20 shows."),
#    R(QD("Priced By: All", "20.20", "RPT-S4-R7"), "After \"Sales Type: All\" the file reads \"Priced By: All\", then \"Category: All categories\", then \"Customer: All customers\", as in picture 20.20.")],
#   pics=["20.20"], held_on="Q30", flags=["design-version"])

# ---- D-442 = C1211035 (https://shopview.testrail.io/index.php?/cases/view/1211035) — from authoring/cases_design_batch_b.py
# question 25: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The PRD's 6-second notice "Updating the cost also updates the sell price.", with nothing about tiers. PRD stays; canvas 11.7 and the build drop the "Part received / $80.00 each, Tier 2." message.
# C("D-442", K, "Design: receiving shows a toast with the price and the tier",
#   [WOA, MX(), TR("A", "A", "+ $ 40.00"), CU(), WO("1", "A", " and a special-order part not yet received on line 1, category A, cost $0.01"), W1440],
#   [OPENWO(), "Open the part's Receive Part window.", "Type 40.00 in Received Cost.", "Click Receive."],
#   [R(S("S11-R9"), "Work order 1 opens."), R(QL("11.6", "S11-R15"), "Receive Part opens as in picture 11.6."), R(QL("11.6", "S11-R15"), "Received Cost reads 40.00."),
#    R(QD("Part received", "11.7", "S11-R15"), "A toast reads \"Part received\".")
#    + R(QD("$80.00 each, Tier 2.", "11.7", "S11-R15"), "Its second line reads \"$80.00 each,\" and tier A's name, ending with a period ($40.00 + $40.00 = $80.00).")],
#   pics=["11.6", "11.7"], held_on="Q25", flags=["design-version", "numbers"])

# ---- D-441 = C1211034 (https://shopview.testrail.io/index.php?/cases/view/1211034) — from authoring/cases_design_batch_b.py
# question 29: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Uncategorized first, then A to Z, as the reports PRD says. Reports PRD stays; canvas 20.7 and the build follow it.
# C("D-441", K, "Design: the Category list places Uncategorized in A to Z order",
#   REP0,
#   [SBT, "Open the Category filter."],
#   [R(QL("20.7", "RPT-S3-R9"), "Sales by Tier opens."),
#    R(QL("20.7", "RPT-S3-R9"), "Uncategorized is listed in A-to-Z order among the categories (between \"Tires, Retread\" and \"Wipers\" in picture 20.7), not first.")],
#   pics=["20.7"], held_on="Q29", flags=["design-version"])

# ---- D-440 = C1211033 (https://shopview.testrail.io/index.php?/cases/view/1211033) — from authoring/cases_design_batch_b.py
# question 28: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) As the reports PRD writes: an active tier as its number and name ("2 · Fleet"), an archived tier as its name with "(archived)", the same in the downloads, and the chip "Sales Type: All". Reports PRD stays; the canvas report pictures and the build follow it.
# C("D-440", K, "Design: report rows and Priced By list show tier names without numbers",
#   REP + [TR("B", "A", "% Off 20", ", archived")],
#   [SBT, "Open the Priced By filter.", "Click Download Summary (CSV) in the ⋯ menu."],
#   [R(QD("Tier 2", "20.2", "RPT-S1-R11"), "Tier A's row reads its name with no number (as \"Tier 2\" in picture 20.2).")
#    + R(QL("20.2", "RPT-S3-R12"), "The plain chips read Sales Type, Priced By, Category and Customer with no \": All\"."),
#    R(QD("Fleet Old", "20.5", "RPT-S3-R3"), "Archived tier B is listed by its name with no \"(archived)\" (as \"Fleet Old\" in picture 20.5)."),
#    R(QD("Tier 2,5933.40", "20.20", "RPT-S4-R3"), "The CSV writes tier A's name with no number (as \"Tier 2,5933.40\" in picture 20.20).")],
#   pics=["20.2", "20.5", "20.20"], held_on="Q28", flags=["design-version"])

# ---- D-65 = C1211111 (https://shopview.testrail.io/index.php?/cases/view/1211111) — from authoring/cases_design_versions_p1_4.py
# question 10: chosen (c). The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question.
# Matt Barge's answer (word for word): (c) Neither the first nor the last range has a delete button; every range between them does. The first range's $0.00 start and the last range's "and up" are fixed values the matrix needs so it covers every part cost. A matrix with only one or two ranges shows no delete button. PRD fix needed: the remove-a-range requirement (Story 3) adds the first range. Canvas (3.11, 4.6, 4.21) and the build drop the trash icon on the last range.
# C("D-65", K, "Design: every range but the first has a delete button",
#   [ADMIN, matrix("A", ", three ranges"), W1440],
#   [MATRICES, "Click matrix A's name.", EDIT],
#   [R(QL("4.6", "S3-R32"), "The Matrices list shows."), R(QL("4.6", "S3-R32"), "Matrix A's page opens."),
#    R(QL("4.6", "S3-R32"), "A trash icon shows at the left of the second and third rows, the last \"and up\" row included.", "The first row ($0.00) has none, as in pictures 4.6 and 4.21.")],
#   pics=["4.6", "4.21", "3.11"], held_on="Q10", flags=DV)

# ---- D-62 = C1211108 (https://shopview.testrail.io/index.php?/cases/view/1211108) — from authoring/cases_design_versions_p1_4.py
# question 12: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The taken-name error shows under the name box, as the PRD says. PRD stays; canvas 3.25 and the build move it out of the banner.
# C("D-62", K, "Design: a taken New Matrix name shows in the banner",
#   [ADMIN, matrix("A"), W1440],
#   [MATRICES, "Click New Matrix.", "Type matrix A's name.", "Click Create Matrix."],
#   [R(QL("3.25", "S3-R6"), "The Matrices list shows."), R(QL("3.25", "S3-R6"), "The New Matrix page opens."), R(QL("3.25", "S3-R6"), "The name shows."),
#    R(QD("A matrix called Stop 40 already exists.", "3.25", "S3-R6"), "The banner reads \"Save is blocked\" and \"A matrix called\" matrix A's name \"already exists.\", with no error under the name field, as in picture 3.25.")],
#   pics=["3.25"], held_on="Q12", flags=DV)

# ---- D-61 = C1211107 (https://shopview.testrail.io/index.php?/cases/view/1211107) — from authoring/cases_design_versions_p1_4.py
# question 9: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) "$10,000.01 and up" in view and edit, as the PRD writes. PRD stays; the canvas view pictures (1.4, 3.2, 4.1) and the build change from "+" to "and up".
# C("D-61", K, "Design: the last range reads with a plus sign in view",
#   [ADMIN, matrix("A", ", three ranges, the last starting at $10,000.01"), W1440],
#   [MATRICES, "Click matrix A's name."],
#   [R(QL("1.4", "S3-R16"), "The Matrices list shows."),
#    R(QD("$10,000.01 +", "3.2", "S3-R16"), "The last range reads \"$10,000.01 +\" in view, as in pictures 1.4 and 3.2.")],
#   pics=["1.4", "3.2", "4.1"], held_on="Q9", flags=DV)

# ---- D-60 = C1211106 (https://shopview.testrail.io/index.php?/cases/view/1211106) — from authoring/cases_design_versions_p1_4.py
# question 11: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Messages next to the box only ("Enter a % from 0 to 99.99", "Enter a margin from 0 to 99.99" and the other S3-R6 messages), no "Save is blocked" banner, as the PRD writes. PRD stays; canvas 3.15 and 4.18 and the build drop the banner.
# C("D-60", K, "Design: grid errors show in a Save is blocked banner",
#   [ADMIN, tier("A"), matrix("A", ", tier A on % Off"), W1440],
#   [MATRICES, "Click matrix A's name.", EDIT, "Type 120 in tier A's first range.", SAVE],
#   [R(QL("3.15", "S3-R6"), "The Matrices list shows."), R(QL("3.15", "S3-R6"), "Matrix A's page opens."), R(QL("3.15", "S3-R6"), "The grid is in edit."), R(QL("3.15", "S3-R6"), "The cell reads 120."),
#    R(QD("Tier 5: enter a % from 0 to 99.99 in every range.", "3.15", "S3-R6"), "A pink banner under the simulator reads \"Save is blocked\" and tier A's name followed by \": enter a % from 0 to 99.99 in every range.\", as in picture 3.15.")],
#   pics=["3.15", "4.18"], held_on="Q11", flags=DV)

# ---- D-59 = C1211105 (https://shopview.testrail.io/index.php?/cases/view/1211105) — from authoring/cases_design_versions_p1_4.py
# question 15: chosen (c). The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question.
# Matt Barge's answer (word for word): (c) It depends on what changed, per tier: • One rule and value across every range of the tier: the PRD's form, "1 change: Tier 5 is 28% margin." • The same rule type with a different value in each range: "Tier 5 is" followed by a bullet list of each range's rule, for example "• $0.00 to $25.00: 35% margin • $25.01 to $100.00: 28% margin". • More than one rule type in the tier: "Tier 5 is multiple rules" followed by a bullet list of the types, for example "• + $ • Margin %". The toast's "up to three changes, then and <n> more" rule (S4-R12) still applies; each tier is one item. PRD fix needed: S4-R12 and the messages table get these three forms. Canvas 3.12 and the build follow.
# C("D-59", K, "Design: the saved message names the range of the change",
#   [ADMIN, tier("A"), matrix("A", ", pricing one new category made for this test, tier A Margin % 25"), W1440],
#   [MATRICES, "Click matrix A's name.", EDIT, "Type 22 in tier A's first range.", SAVE],
#   [R(QL("3.12", "S4-R12"), "The Matrices list shows."), R(QL("3.12", "S4-R12"), "Matrix A's page opens."), R(QL("3.12", "S4-R12"), "The grid is in edit."), R(QL("3.12", "S4-R12"), "The bar reads 1 change."),
#    R(QD("1 change: Tier 2 $0.00–$100.00: 22% margin. Parts already on work orders keep their prices.", "3.12", "S4-R12"),
#      "The message reads \"1 change:\" tier A's name, the range (for example $0.00–$100.00), \": 22% margin.\" and \"Parts already on work orders keep their prices.\", as in picture 3.12.")],
#   pics=["3.11", "3.12"], held_on="Q15", flags=DV)

# ---- D-58 = C1211104 (https://shopview.testrail.io/index.php?/cases/view/1211104) — from authoring/cases_design_versions_p1_4.py
# question 8: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Add Range adds a range just before the last ("and up") range, as the PRD says; the open-ended range stays last. PRD stays; canvas 4.20's note and the build follow it.
# C("D-58", K, "Design: Add Range adds a new last range",
#   [ADMIN, matrix("A", ", three ranges"), W1440],
#   [MATRICES, "Click matrix A's name.", EDIT, "Click Add Range."],
#   [R(QL("4.20", "S3-R16"), "The Matrices list shows."), R(QL("4.20", "S3-R16"), "Matrix A's page opens."), R(QL("4.20", "S3-R16"), "The grid is in edit."),
#    R(QD("A new last range; counts as one change.", "4.20", "S3-R16"), "A new row appears at the bottom as the new \"and up\" range, highlighted, and the row above gets an end, as in picture 4.20.")],
#   pics=["4.20"], held_on="Q8", flags=DV)

# ---- D-57 = C1211103 (https://shopview.testrail.io/index.php?/cases/view/1211103) — from authoring/cases_design_versions_p1_4.py
# question 14: chosen (c). The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question.
# Matt Barge's answer (word for word): (c) The rule-type change counts as 1, and each box whose value changes counts as 1 more. A 3-range column switched to % Off shows "1 change" (boxes start empty, question 13); after a value is typed in each box it shows "4 changes". After Save, the Audit Log records both: 1 rule type changed and 3 range values changed. Reason (Matt): every action must be recorded for audit, so a column quietly changed from 15% margin to a large % off is fully traceable. PRD fix needed: S4-R4 counting and the Audit Log wording (Story 4 / S19-R19) to state this example.
# C("D-57", K, "Design: one rule type change counts as three changes",
#   [ADMIN, tier("A"), matrix("A", ", three ranges, tier A on Markup %"), W1440],
#   [MATRICES, "Click matrix A's name.", EDIT, "Pick % Off in tier A's header picker."],
#   [R(QL("4.11", "S4-R4"), "The Matrices list shows."), R(QL("4.11", "S4-R4"), "Matrix A's page opens."), R(QD("No changes yet", "4.10", "S4-R4"), "The bar reads \"No changes yet\"."),
#    R(QD("3 changes", "4.11", "S4-R4"), "The bar reads \"3 changes\", as in picture 4.11.")],
#   pics=["4.10", "4.11"], held_on="Q14", flags=DV)

# ---- D-56 = C1211102 (https://shopview.testrail.io/index.php?/cases/view/1211102) — from authoring/cases_design_versions_p1_4.py
# question 13: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The column starts empty in every range, as the PRD says. PRD stays; canvas 4.11 and the build change from 0 to empty.
# C("D-56", K, "Design: picking % Off fills every range with 0",
#   [ADMIN, tier("A"), matrix("A", ", three ranges, tier A on Markup %"), W1440],
#   [MATRICES, "Click matrix A's name.", EDIT, "Pick % Off in tier A's header picker."],
#   [R(QL("4.11", "S4-R7"), "The Matrices list shows."), R(QL("4.11", "S4-R7"), "Matrix A's page opens."), R(QL("4.11", "S4-R7"), "The grid is in edit."),
#    R(QD("% Off starts at 0% in every range.", "4.11", "S4-R7"), "Tier A's three ranges each show 0 with \"% off\", as in picture 4.11.")],
#   pics=["4.11"], held_on="Q13", flags=DV)

# ---- D-55 = C1211101 (https://shopview.testrail.io/index.php?/cases/view/1211101) — from authoring/cases_design_versions_p1_4.py
# question 7: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) The copy is created at once: "[name] (copy)" is added to the matrix list and opens, as the PRD says. PRD stays; canvas 3.27 and the build follow it.
# C("D-55", K, "Design: Duplicate opens an unsaved copy to name and create",
#   [ADMIN, matrix("A"), "Note how many matrices the Matrices tab label shows (for example 7).", W1440],
#   [MATRICES, "Open matrix A's three-dot menu.", "Click Duplicate.", "Click Cancel."],
#   [R(QL("3.26", "S3-R8"), "The Matrices list shows."), R(QL("3.26", "S3-R8"), "The menu lists Duplicate and Delete."),
#    R(QD("Stop 40 (copy)", "3.27", "S3-R8"), "A page opens in edit with the name field holding matrix A's name and \" (copy)\", Cancel and Create Matrix at the top right, as in picture 3.27."),
#    R(QL("3.27", "S3-R8"), "The Matrices list shows again with 7 matrices: no copy was made.")],
#   pics=["3.26", "3.27"], held_on="Q7", flags=DV)

# ---- D-54 = C1211100 (https://shopview.testrail.io/index.php?/cases/view/1211100) — from authoring/cases_design_versions_p1_4.py
# question 5: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) Every matrix, with Work Order Matrix and Part Sale Matrix columns in the grid's short words, as the PRD says. PRD stays; canvas 2.42 and the build follow it.
# C("D-54", K, "Design: Default's page shows one column with rule counts",
#   [ADMIN, matrix("A", ", Default Markup % with three different values"), W1440],
#   [TIERS, "Click Default's row."],
#   [R(QL("2.41", "S2-R20"), "The Tiers list shows."), R(QD("3 rules · markup", "2.42", "S2-R20"), "The list has one value column, Work Order Matrix, and no Part Sale Matrix column.",
#      "Matrix A's value reads \"3 rules · markup\", as in picture 2.42.")],
#   pics=["2.41", "2.42"], held_on="Q5", flags=DV)

# ---- D-53 = C1211099 (https://shopview.testrail.io/index.php?/cases/view/1211099) — from authoring/cases_design_versions_p1_4.py
# question 4: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) "Uses previous tier" everywhere, the grid's words, as the PRD says. PRD stays; the tier pages and New Tier on the canvas and in the build change to "Uses previous tier".
# C("D-53", K, "Design: a tier's Pricing tab says Same as previous tier",
#   [ADMIN, tier("A"), matrix("A", ", tier A on Same as previous tier"), W1440],
#   [TIERS, "Click tier A's row."],
#   [R(QL("2.32", "S2-R20"), "The Tiers list shows."), R(QD("Same as previous tier", "2.32", "S2-R20"), "Matrix A's Work Order Matrix value reads \"Same as previous tier\", as in pictures 2.17 and 2.32.")],
#   pics=["2.11", "2.17", "2.32", "2.44"], held_on="Q4", flags=DV)

# ---- D-52 = C1211098 (https://shopview.testrail.io/index.php?/cases/view/1211098) — from authoring/cases_design_versions_p1_4.py
# question 3: chosen (a). The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling).
# Matt Barge's answer (word for word): (a) As the PRD writes (S2-R23): "[tier] becomes [rule] in [n] matrices (<m> inactive)", with "(<m> inactive)" only when some checked matrices are inactive, and no "all". PRD stays; canvas 2.53 and the build drop "all".
# C("D-52", K, "Design: the Set Rule question says in all n matrices",
#   [ADMIN, tier("A"), W1440],
#   [TIERS, "Click tier A's row.", "Click the select-all checkbox.", "Type 35 in the bar's value.", "Click Set Rule."],
#   [R(QL("2.53", "S2-R23"), "The Tiers list shows."), R(QL("2.53", "S2-R23"), "Tier A's page opens."), R(QL("2.53", "S2-R22"), "Every matrix is checked."), R(QL("2.53", "S2-R22"), "The value reads 35."),
#    R(QD("Tier 2 becomes 35% off in all 7 matrices (2 inactive), replacing what it had.", "2.53", "S2-R23"),
#      "The question reads tier A's name \"becomes 35% off in all\", the number of matrices, \"matrices\" and the inactive count in brackets, as in picture 2.53.")],
#   pics=["2.53"], held_on="Q3", flags=DV)

# ---- D-51 = C1211097 (https://shopview.testrail.io/index.php?/cases/view/1211097) — from authoring/cases_design_versions_p1_4.py
# question 2: chosen (c). The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question.
# Matt Barge's answer (word for word): (c) Delete [tier]? drops "Parts already on work orders keep their prices." and says "This can't be undone." instead. A tier can only be deleted when it never priced a saved line and no open work order, estimate or Part Sale keeps it (S2-R8, S2-R13), so the parts line doesn't apply to Delete. Archive keeps the parts line. Any "These tiers price the same as…" list stays on both. PRD fix needed: S2-R30 and the messages table (Delete wording separate from Archive).
# C("D-51", K, "Design: the Delete question adds This can't be undone",
#   [ADMIN, tier("A", " with no customers that priced nothing"), W1440],
#   [TIERS, "Open tier A's three-dot menu.", "Click Delete."],
#   [R(QL("2.28", "S2-R30"), "The Tiers list shows."), R(QL("2.28", "S2-R30"), "The menu lists Audit Log, Archive and Delete."),
#    R(QD("This can’t be undone.", "2.29", "S2-R30"), "The dialog reads \"This can't be undone.\" above \"Parts already on work orders keep their prices.\", as in picture 2.29.")],
#   pics=["2.28", "2.29"], held_on="Q2", flags=DV)
