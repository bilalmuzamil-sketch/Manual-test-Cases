"""Tiered Pricing — questions for Matt Barge (PO), 14 Nov 2026. ONE merged list (consolidation worker): phase 1 Q1, Q2, Q4, Q5-Q19, batch A Q20-Q30,
batch B Q40-Q44, checked with skill 07 §6.0 a-h on the merged list (record in QUESTIONS-FOR-MATT-BARGE.md), numbered 1-31 by story; Q42 and Q27
merged into question 31 (map: QUESTION-MAP.json). The suite has no question sheet yet, so this is the first sheet (Rule 131: later questions go
at the bottom of THIS sheet, in a new colour).

Same layout and wording style as the colour-coded sheets first made for Milos Vasic (build/founder-mode/internal-work-orders/questions-2026-11-12/
sheet_rows.py) and used for Chris Ward (Bill To): title, greeting, colour guide, blank row, header #, Topic, Question for you (the question, then
the lettered options on their own lines, the suggested one first), What we know today, Your answer (empty, yellow), Where we found it. Every row
names the project and the feature in its Topic.

DRAFT ONLY: this file writes nothing to Google. The coordinator creates the sheet after the QA lead has seen it (Rule 66), shares it as the QA lead
asked on 14 Nov 2026 (Matt Barge editor and notified; every QA person editor; everyone else at shopview.com read only).
    python3 sheet_rows.py   -> sheet-values.json (and fails if a PO-facing cell holds a case id or a requirement code)"""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
TITLE = "Tiered Pricing – questions for Matt Barge (14 Nov 2026)"
GREET = ("Hello sir, while we were writing the Tiered Pricing test cases from the PRD (page version 37, v0.17), the Sales by Tier and Sales by "
         "Category PRD (page version 21), the 54 Jira tickets under the epic, the developers' two plans (11 Nov 2026) and the Tiered Pricing design "
         "canvas, a few points came up that only you can decide. Most are places where the design draws something a little different from the PRD. "
         "Each one decides whether a test passes, so that test waits for your answer; everything else on the same screens is written and ready. "
         "Each has a suggested answer, so a letter such as (a) in the yellow column is plenty.")
GUIDE = ["Colour guide:", "Yellow = please write your answer here", "Blue = the topic", "Grey = where we found it", "", ""]
D = "Tiered Pricing design canvas"
OPT_C = "(c) Something else (please say)."

ROWS = [
 [1, "Tiered Pricing: the page trail (breadcrumbs) at the top of a tier's page and a matrix's page",
  "Where should the page trail start?\n(a) At Settings, as the PRD writes it: Settings › Pricing › Tiers › [tier name], and Settings › Pricing › Matrices › "
  "[matrix name] (suggested: it is the PRD's text and shows the way back to Settings)\n(b) At Pricing, as the design draws it: Pricing › Tiers › [tier name]\n" + OPT_C,
  "The PRD writes the trail from Settings. Every design picture of these pages starts it at \"Pricing ›\". Everything else on these pages is tested now; "
  "only the first part of the trail waits.",
  f"PRD Story 2 (a tier's page) and Story 3 (a matrix's page); {D}, pictures 2.11, 2.32, 2.46, 3.2, 4.26"],
 [2, "Tiered Pricing: the Delete [tier]? window",
  "Should the window add the line \"This can't be undone.\"?\n(a) No: it asks \"Delete [tier]?\" with only \"Parts already on work orders keep their "
  "prices.\", as the PRD writes (suggested)\n(b) Yes: add \"This can't be undone.\", as the design draws\n" + OPT_C,
  "The PRD says the question is just \"Delete [tier]?\" with the line \"Parts already on work orders keep their prices.\" The design's window adds "
  "\"This can't be undone.\" The rest of deleting a tier is tested now.",
  f"PRD Story 2 (deleting a tier); {D}, picture 2.29"],
 [3, "Tiered Pricing: the question shown before Set Rule changes every matrix",
  "When every matrix is ticked, should the Set Rule question say \"all\" and count the inactive ones?\n(a) No: \"[tier] becomes [rule] in [n] matrices\", "
  "as the PRD writes (suggested)\n(b) Yes: \"in all 7 matrices (2 inactive)\", as the design draws\n" + OPT_C,
  "The PRD gives the sentence \"[tier] becomes [rule] in [n] matrices\". The design writes \"in all 7 matrices (2 inactive)\" when every matrix is "
  "ticked. Set Rule itself is tested now.",
  f"PRD Story 2 (Set Rule on a tier's page); {D}, picture 2.53"],
 [4, "Tiered Pricing: the words for a matrix where a tier has no rules of its own, on the tier's Pricing tab",
  "Which words should a tier's Pricing tab (and the New Tier page) show?\n(a) \"Uses previous tier\", the same words as the grid, as the PRD says "
  "(suggested: one phrase everywhere)\n(b) \"Same as previous tier\", as the design draws\n" + OPT_C,
  "The PRD says the tab uses the grid's words, \"Uses previous tier\", and defines that phrase in its Terminology section. The design's tier pages "
  "show \"Same as previous tier\". The price details have a similar question of their own (question 26).",
  f"PRD Story 2 (a tier's Pricing tab) and Terminology; {D}, pictures 2.11 to 2.17, 2.32, 2.44"],
 [5, "Tiered Pricing: Default's own page",
  "What should Default's page list?\n(a) Every matrix, with a Work Order Matrix column and a Part Sale Matrix column showing the grid's short words "
  "(for example \"% markup\"), as the PRD says (suggested)\n(b) One Work Order Matrix column with summaries such as \"3 rules · markup\", as the design draws\n" + OPT_C,
  "The PRD lists every matrix with both columns and the grid's short words. The design shows one column with a rule summary.",
  f"PRD Story 2 (Default's page) and Story 4 (the grid's short words); {D}, picture 2.42"],
 [6, "Tiered Pricing: moving a category to a matrix from the matrix's page",
  "On an existing matrix's page, when does a category picked on the Categories line move to that matrix (so its parts start pricing by it)?\n"
  "(a) As soon as the picker closes, as the developers built it (suggested: the PRD also says category changes save without asking, apart from the grid)\n"
  "(b) Only when the user clicks Save on the matrix\n" + OPT_C,
  "The PRD says a category picked there \"moves it to this matrix when the matrix is saved\", and also that renaming and changing its categories save "
  "without asking. The developers' plan moves it when the picker closes (on a new matrix, with Create Matrix). The design has no picture of this on "
  "an existing matrix. Moving a category changes the price of every part in it, so the tester must know when to expect it.",
  f"PRD Story 3 (the matrix page's Categories line); developers' plan for Tiered Pricing (11 Nov 2026), the Categories picker decision"],
 [7, "Tiered Pricing: Duplicate on a matrix",
  "When a matrix is duplicated, is the copy created at once or only when the user confirms?\n(a) At once: \"[name] (copy)\" is added to the matrix list "
  "and opens, as the PRD says (suggested)\n(b) Only after Create Matrix: an unsaved \"Stop 40 (copy)\" opens with Cancel and Create Matrix, as the design draws\n" + OPT_C,
  "The PRD makes the copy in the library and opens it. The design opens an unsaved copy that is only created when Create Matrix is clicked.",
  f"PRD Story 3 (Duplicate); {D}, picture 3.27"],
 [8, "Tiered Pricing: where Add Range puts a new cost range",
  "Where does Add Range put the new cost range in the grid?\n(a) Just before the last (\"and up\") range, as the PRD says (suggested: the open-ended "
  "range stays last)\n(b) As the new last range, as the design's note says\n" + OPT_C,
  "The PRD says \"Add Range adds a range before the last one.\" The design's note on picture 4.20 says \"A new last range\".",
  f"PRD Story 3 (cost ranges); {D}, picture 4.20"],
 [9, "Tiered Pricing: how the last cost range reads when the grid is not being edited",
  "How should the last cost range read in view?\n(a) \"$10,000.01 and up\", as the PRD writes (suggested)\n(b) \"$10,000.01 +\", as the design's view "
  "pictures draw it (with \"and up\" only while editing)\n" + OPT_C,
  "The PRD writes \"$10,000.01 and up\". The design writes \"$10,000.01 +\" in view and \"and up\" only in edit.",
  f"PRD Story 3 (cost ranges); {D}, pictures 1.4, 3.2, 4.1"],
 [10, "Tiered Pricing: which cost ranges have a delete button",
  "Which ranges should show a delete (trash) button while editing?\n(a) Every range except the last, as the PRD says (\"The last range ... can't be "
  "removed\") (suggested)\n(b) Every range except the first, the last one included, as the design draws\n" + OPT_C,
  "The PRD gives every range except the last a delete button. The design draws a trash icon on every range except the first, the last \"and up\" range "
  "included.",
  f"PRD Story 3 (removing a range); {D}, pictures 3.11, 4.6, 4.21"],
 [11, "Tiered Pricing: messages when a matrix grid cannot be saved",
  "How should the grid show a value it cannot save?\n(a) With the messages next to the box, \"Enter a % from 0 to 99.99\" and \"Enter a margin from 0 to "
  "99.99\", as the PRD writes (suggested)\n(b) Also with a \"Save is blocked\" banner at the top, with lines such as \"Tier 5: enter a % from 0 to 99.99 in "
  "every range.\" and \"Work Order Matrix: Rule 1: Enter a margin from 0 to 99.99\", as the design draws\n" + OPT_C,
  "The PRD gives the two messages and no banner. The design adds a \"Save is blocked\" banner with its own wording.",
  f"PRD Story 3 (grid errors); {D}, pictures 3.15, 4.18"],
 [12, "Tiered Pricing: a matrix name that is already taken",
  "Where should New Matrix say that a name is taken?\n(a) Under the name box, as the PRD says (suggested)\n(b) In the \"Save is blocked\" banner "
  "(\"A matrix called Stop 40 already exists.\"), as the design draws\n" + OPT_C,
  "The PRD shows an error under the name. The design puts the sentence in the banner, not under the name.",
  f"PRD Story 3 (matrix names); {D}, picture 3.25"],
 [13, "Tiered Pricing: a grid column switched to % Off or $ Off",
  "When a column's rule type is changed to % Off or $ Off, what should its boxes show?\n(a) Empty in every range, as the PRD says (suggested)\n"
  "(b) 0 in every range, as the design draws (\"% Off starts at 0% in every range\")\n" + OPT_C,
  "The PRD says the column starts empty in every range. The design shows 0 in every range.",
  f"PRD Story 4 (changing a rule type); {D}, picture 4.11"],
 [14, "Tiered Pricing: the change count in the grid's edit bar",
  "After a column's rule type is changed on a 3-range matrix (and nothing else), how many changes should the edit bar count?\n(a) 1: the column whose "
  "rule type differs counts as one change (suggested)\n(b) 3: one per changed box, as the design draws\n" + OPT_C,
  "The PRD counts \"each column whose rule type differs\" as one change, but also counts each changed box. The design shows \"3 changes\" for one type "
  "change on a 3-range column.",
  f"PRD Story 4 (the edit bar); {D}, picture 4.11"],
 [15, "Tiered Pricing: the message after saving a matrix grid",
  "Which form should the save message take?\n(a) The PRD's form, for example \"1 change: Tier 5 is 28% margin.\" (suggested)\n(b) The design's form with "
  "the range, for example \"1 change: Tier 2 $0.00–$100.00: 22% margin.\"\n" + OPT_C,
  "The PRD's example names the tier and the new rule. The design's message also names the cost range.",
  f"PRD Story 4 (saving the grid); {D}, picture 3.12"],
 [16, "Tiered Pricing: the Part Sale Matrix column of the Matrices list",
  "What should this column show?\n(a) On or Off, as the PRD says (suggested)\n(b) \"Same as work orders\" when a matrix has no separate Part Sale pricing, "
  "and a short summary of the Part Sale rules (for example \"2 rules · cost + $, margin\") when it has, as the design draws\n" + OPT_C,
  "The PRD says the column shows On or Off. The design shows a phrase or a rule summary instead.",
  f"PRD Story 6 (the Matrices list); {D}, picture 6.2"],
 [17, "Tiered Pricing: the message when a search finds nothing (Matrices list, Categories list, a tier's Customers tab)",
  "Which wording should these messages use?\n(a) The PRD's sentences, ending with a period, for example 'No matrices match the search \"…\".' and "
  "'No categories match the search \"…\".' (suggested)\n(b) The design's shorter forms without a period: 'No matrices match \"zzz\"', 'No category matches "
  "\"zzz\"' and 'No customer matches \"zzz\"' (the last with a Clear All Filters button)\n" + OPT_C,
  "The PRD gives full sentences with a period on all three screens. The design writes shorter forms without one.",
  f"PRD Story 6 (Matrices list), Story 7 (Categories list), Story 9 (a tier's Customers tab); {D}, pictures 6.10, 7.6, 9.2"],
 [18, "Tiered Pricing: the note about other categories on a category's page",
  "Where should \"The [matrix] matrix also prices [n] other categories: [A] · [B].\" appear?\n(a) As a line above the grid, as the category page "
  "requirement says (suggested: it is the requirement written for this page)\n(b) In an info-icon tooltip beside the matrix name, with no line, as the "
  "design draws\n" + OPT_C,
  "The category page requirement puts the sentence on a line above the grid. Elsewhere the PRD says new pages show no explanatory text and put "
  "explanations in info-icon tooltips, which is what the design does here.",
  f"PRD Story 7 (a category's page) and Story 19 (explanations in tooltips); {D}, picture 7.9"],
 [19, "Tiered Pricing: the buttons of New Category",
  "Which buttons should New Category have?\n(a) Save and Cancel, as the PRD and the developers' plan say (suggested)\n(b) Cancel and Create Category, as "
  "the design draws (like Create Tier and Create Matrix)\n" + OPT_C,
  "The PRD says New Category \"has Save and Cancel\". Version 0.17 renamed New Tier's and New Matrix's buttons to Create Tier and Create Matrix, and the "
  "design gives New Category \"Create Category\" in the same way.",
  f"PRD Story 8 (New Category); developers' plan for Tiered Pricing, Phase 16; {D}, pictures 8.6, 8.8"],
 [20, "Tiered Pricing: two category messages (Delete and a taken name)",
  "(1) Should the Delete [category]? question keep the sentence \"Invoices already sent aren't sent again; one synced again later books these parts "
  "to Uncategorized's QuickBooks item.\"? (2) Should the taken-name error add \"Click away to keep [old name].\"?\n(a) The PRD's wording for both: the "
  "QuickBooks sentence stays, and the error is just \"A category called [name] already exists\" (suggested)\n(b) The design's wording for both: no "
  "QuickBooks sentence, and the error adds \"Click away to keep Brakes.\"\n(c) Mixed or something else (please say which).",
  "The PRD's Delete question includes the QuickBooks sentence; the design's leaves it out. The PRD's taken-name error is one sentence; the design adds "
  "a second.",
  f"PRD Story 8 (deleting a category; category names); {D}, pictures 8.11, 8.4"],
 [21, "Tiered Pricing: Uncategorized's page",
  "What should Uncategorized's page show and allow?\n(a) Read only, with no rename, no Delete and no matrix picker, as the PRD says (suggested)\n(b) As the "
  "design draws: a grayed Pricing Matrix box, a grayed Tax Exempt box and a QuickBooks Products And Services picker that can be changed\n"
  "(c) Something else (please say whether its QuickBooks mapping and Tax Exempt can be changed).",
  "The PRD says Uncategorized's page is read only \"with no rename, Delete or matrix picker\". The design shows the matrix field grayed and a QuickBooks "
  "picker that looks editable.",
  f"PRD Story 8 (Uncategorized); {D}, picture 8.3"],
 [22, "Tiered Pricing: the filter on a tier's Customers tab",
  "Which options should this filter offer?\n(a) Work orders, Part Sales and Both, as the PRD and the developers' plan say (suggested). Please also say "
  "whether \"Work orders\" means customers on the tier for work orders only, or every customer on the tier for work orders.\n(b) A \"Sales Type\" filter "
  "with \"Work Orders and Part Sales\" and \"Work Orders only\", as the design draws\n" + OPT_C,
  "The PRD lists \"Work orders, Part Sales, Both\". The design names the filter Sales Type with different options.",
  f"PRD Story 9 (a tier's Customers tab); developers' plan for Tiered Pricing, Phase 17; {D}, picture 9.3"],
 [23, "Tiered Pricing: the Counter Sale customer's tier fields in Edit Customer",
  "How should \"Every walk-in sale uses this tier.\" show?\n(a) As a tooltip on the tier fields, as the PRD says (suggested)\n(b) As a light blue info box "
  "above the tier fields, always visible, as the design draws\n" + OPT_C,
  "The PRD says Edit Customer shows a tooltip on the Counter Sale customer's tier fields. The design shows the same sentence in a box that is always "
  "visible.",
  f"PRD Story 9 (the Counter Sale customer); {D}, picture 9.36"],
 [24, "Tiered Pricing: parts added to a paid work order that is reopened",
  "When a paid work order is reopened by adding a line, which tier prices the parts added to it?\n(a) The customer's tier as it is now, as the developers "
  "built it (suggested: the new parts are new work done after payment, the same way a split work order takes the customer's current tier)\n(b) The tier "
  "the work order was made with, as the PRD's general rule would say\n" + OPT_C,
  "The PRD says a work order keeps the tier its customer had when it was made; moving a customer to another tier affects only work orders made "
  "afterwards or by splitting. No sentence covers reopening. The developers built the reopened work order to take the customer's current tier and told "
  "Product as an FYI. It decides the price on a real invoice for any customer whose tier changed since the job was opened.",
  "PRD Story 10 (which tier a work order keeps); developers' plan for Tiered Pricing (11 Nov 2026), clarifications and Phase 4; ticket SV-12667 item 1"],
 [25, "Tiered Pricing: the message after receiving a part at a new cost",
  "After a part is received at a new cost, what does the user see?\n(a) The PRD's 6-second notice \"Updating the cost also updates the sell price.\", "
  "with nothing about tiers (suggested)\n(b) The design's message \"Part received\" / \"$80.00 each, Tier 2.\", naming the tier, and no sell-price notice\n" + OPT_C,
  "The PRD says the receive window says nothing about tiers and its notice reads \"Updating the cost also updates the sell price.\" The design shows a "
  "different message after Receive that names the tier.",
  f"PRD Story 11 (receiving a part); {D}, picture 11.7"],
 [26, "Tiered Pricing: the price details of a part",
  "(1) Should the price details name the matrix's side (Work Order Matrix or Part Sale Matrix)? (2) How should they word a price that comes from the "
  "previous tier?\n(a) As the PRD says: the matrix, its side and the rule; and for a previous tier a sentence such as \"Fleet is the same as the previous "
  "tier, Wholesale, in Brakes.\" (suggested)\n(b) As the design draws: \"Tread Plus · Tier 2\" with no side, and a row \"Same as previous tier: Default\"\n"
  "(c) Mixed or something else (please say which).",
  "The PRD lists the matrix, its side and the rule, and gives the previous-tier sentence. The design's popover leaves out the side and shows a short row "
  "instead of the sentence.",
  f"PRD Story 12 (price details); {D}, pictures 12.1, 12.2"],
 [27, "Tiered Pricing: the notice after changing the customer on a work order",
  "Which lines should the notice count?\n(a) Only lines priced by a tier or Default: Manual, Fixed price, Fixed line total and Before tiers lines don't "
  "count, and no tier name shows when several tiers priced them, as the PRD says (suggested)\n(b) Every line, naming the kinds, for example \"4 lines "
  "priced at Tier 2, Fixed price and Manual for the previous customer\", as the design draws\n" + OPT_C,
  "The PRD counts only tier and Default lines. The design's notice also counts Fixed price and Manual lines.",
  f"PRD Story 14 (Change Customer); {D}, picture 14.8"],
 [28, "Sales by Tier and Sales by Category reports: how tiers and filters are labelled",
  "How should a tier be named in the rows, the Priced By filter and the downloads, and how should the Sales Type chip read?\n(a) As the reports PRD writes: "
  "an active tier as its number and name (\"2 · Fleet\"), an archived tier as its name with \"(archived)\", the same in the downloads, and the chip "
  "\"Sales Type: All\" (suggested: the reports PRD says its labels and messages ship as written)\n(b) As the design draws: the tier's name only (\"Tier 2\"), "
  "no \"(archived)\", and a plain \"Sales Type\" chip\n" + OPT_C,
  "The reports PRD gives numbers, \"(archived)\" and \"Sales Type: All\". The design's pictures and its CSV picture show names only and a plain chip.",
  f"Sales by Tier and Sales by Category PRD, Stories 1, 3 and 4; {D}, pictures 20.2 to 20.5, 20.9, 20.12, 20.13, 20.18, 20.20"],
 [29, "Sales by Tier and Sales by Category reports: the order of the Category filter",
  "In what order should the Category filter list the categories?\n(a) Uncategorized first, then A to Z, as the reports PRD says (suggested)\n"
  "(b) Uncategorized among the others in A-to-Z order, as the design draws\n" + OPT_C,
  "The reports PRD says \"Uncategorized first, then A to Z\". The design lists Uncategorized between \"Tires, Retread\" and \"Wipers\".",
  f"Sales by Tier and Sales by Category PRD, Story 3 (filters); {D}, picture 20.7"],
 [30, "Sales by Tier and Sales by Category reports: the order of the filter lines at the top of a download",
  "In what order should the filter lines at the top of a PDF or CSV be?\n(a) Sales Type, Category, Priced By, Customer, as the reports PRD writes and the "
  "developers build (suggested; the design's \"All …\" wording is kept)\n(b) Sales Type, Priced By, Category, Customer, as the design's CSV picture shows\n" + OPT_C,
  "The reports PRD lists the lines as Sales Type, Category, Priced By and Customer. The design's CSV picture puts Priced By before Category. The "
  "developers follow the PRD's order and take the \"All …\" wording from the design.",
  f"Sales by Tier and Sales by Category PRD, Story 4 (downloads); {D}, picture 20.20; developers' plan for the reports (11 Nov 2026)"],
 [31, "Tiered Pricing and the two new reports: columns that move between the design's own pictures",
  "Should columns and boxes keep their place when a screen changes state, or are the moves the design's pictures show intended?\n(a) Keep their place: "
  "nothing moves sideways or down when a row opens or closes, a search narrows a list, a list is empty, a filter chip changes, the Add Part row opens or "
  "a page switches between view and edit (suggested: columns that jump make a screen hard to read and compare)\n(b) The moves drawn are intended\n"
  "(c) Some are intended (please say which).",
  "Comparing the design's pictures of the same screen: the Price Part Simulator's columns move between view and edit (Part Cost about 70 pixels "
  "wider in edit); on New Matrix, opening the categories list pushes the tabs and grid down about 221 pixels; on Manage Customers the tier columns move "
  "left 11 to 83 pixels when a search narrows the list; on Sales by Tier the number columns move 58 to 94 pixels when a row or a customer is opened and "
  "20 to 36 pixels on the empty states; on Sales by Category they move 5 to 10 pixels when a category is opened; the report filter chips shift as a "
  "picked chip widens; on a work order the lines table's columns move 19 to 71 pixels while the Add Part row is open and 1 to 9 pixels after a part is "
  "added or received. The PRD says layout follows the design, but nothing says whether these moves are meant or just drawn that way.",
  f"{D}, pictures 3.5 and 3.25, 3.10 and 4.7, 3.22 and 3.23 (simulator, New Matrix); 9.4, 9.12, 9.13 (Manage Customers); 20.2 to 20.4, 20.9, 20.11, "
  "20.16 and 20.17, 20.21 to 20.23 (reports); 10.5 to 10.9, 11.7 (work order); PRD section 7 (layout follows the design)"],
]

BANNED = re.compile(r"\b(S\d{1,2}-[RNE]H?\d+|TPX-\d+|TPD-\w+|INV-\d+|RPT-\w+|D-\d{2,3}|C\d{5,7}|VIU|HTTP|API|endpoint|JSON)\b")


def values():
    v = [[TITLE, "", "", "", "", ""], [GREET, "", "", "", "", ""], GUIDE, ["", "", "", "", "", ""],
         ["#", "Topic", "Question for you", "What we know today", "Your answer", "Where we found it"]]
    v += [[str(r[0]), r[1], r[2], r[3], "", r[4]] for r in ROWS]
    return v


if __name__ == "__main__":
    assert [r[0] for r in ROWS] == list(range(1, len(ROWS) + 1))
    bad = [(r[0], m.group(0)) for r in ROWS for cell in r[1:] for m in [BANNED.search(str(cell))] if m]
    if bad: raise SystemExit(f"PO-facing cells hold internal ids or jargon: {bad}")
    assert all(r[1].startswith(("Tiered Pricing", "Sales by Tier")) for r in ROWS), "every Topic names the project and the feature"
    assert all("(a)" in r[2] and "(b)" in r[2] and "suggested" in r[2] for r in ROWS), "every question has lettered options and a suggested one"
    json.dump(values(), open(f"{H}/sheet-values.json", "w"), ensure_ascii=False, indent=1)
    print(len(ROWS), "rows ->", f"{H}/sheet-values.json")
