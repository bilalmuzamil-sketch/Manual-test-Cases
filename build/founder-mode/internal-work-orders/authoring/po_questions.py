"""Questions for Milos Vasic (PO, Internal Work Orders), round 2a (12 Nov 2026): our 7 PRD questions merged with the tech plan worker's 7
(tech-plan-2026-11-12/QUESTIONS-DRAFT.md), duplicates and settled points dropped (skill 07 §6), renumbered. DRAFT ONLY: nothing is sent
(no Google write by this worker). Each row: (slug, topic, the question, what happens now in plain words, options with the suggested one
first, what it holds, where we found it). Ticket keys and requirement codes appear ONLY in "where we found it". Each kept question holds
at least one case (build.py refuses a question that holds none). DROPPED lists what a saved source settles, with the source."""
QUESTIONS = [
 ("modal-text", "The window that opens the first time Internal Work Orders is switched on",
  "Which explanation text should the \"Which customers are your own company?\" window show?",
  "The PRD gives this window two slightly different texts. The requirement says: \"… Nothing is picked for you: your location is not "
  "always a customer, and the names can differ. Pick one or more, or do it later from the customer page.\" The message table at the end "
  "of the PRD leaves out the middle part: \"… Nothing is picked for you. Pick one or more, or do it later from the customer page.\" "
  "We check on-screen wording word for word, so we need one of them.",
  ["(a) The longer text, with \"your location is not always a customer, and the names can differ\" (suggested: it is the requirement itself and explains why nobody is preselected)",
   "(b) The shorter text from the message table", "(c) Something else (please say)"],
  "One case: the window's explanation text.", "PRD v1.0 S1-R2 and §8 User Feedback Summary (first row)"),
 ("no-charge-document-case", "The Convert to No Charge confirmation on a customer's work order",
  "Should the confirmation say \"NO CHARGE document\" (capitals) or \"No Charge document\"?",
  "The requirement reads \"It closes with a NO CHARGE document instead of an invoice.\" and the message table reads \"It closes with a No "
  "Charge document instead of an invoice.\" The rest of the window (title, Category, buttons) is tested already.",
  ["(a) \"NO CHARGE document\", matching the stamp printed on the document (suggested)", "(b) \"No Charge document\"", "(c) Something else (please say)"],
  "One case: the confirmation's text.", "PRD v1.0 S2-R5 and §8 (Convert to No Charge row)"),
 ("internal-estimate-stamp", "The estimate of a work order for the shop's own company (an internal work order)",
  "Which stamp does an internal work order's estimate show: INTERNAL or NO CHARGE?",
  "Once closed, an internal work order's document reads \"Internal Work Order\" with the INTERNAL stamp, and a customer's no-charge one reads "
  "\"No Charge Work Order\" with the NO CHARGE stamp. For the open estimate the PRD says both kinds \"carry the NO CHARGE stamp\". "
  "So today an internal job would say NO CHARGE on its estimate and INTERNAL on its closed document.",
  ["(a) INTERNAL on an internal work order's estimate, NO CHARGE on a customer's no-charge one, the same as the closed document (suggested)",
   "(b) NO CHARGE on both kinds of estimate", "(c) Something else (please say)"],
  "Two cases: the internal work order's estimate, and the same estimate as the design draws it (INTERNAL with \"Category: General Internal\").", "PRD v1.0 S2-R4 (estimate) and S3-R5 (closed document); design \"Internal Work Orders · All flows v6\", Flow 1 board 04 and Happy flow 15 (register IWO-D19)"),
 ("rows-per-move", "The \"Create invoice [number]?\" window when vendor bill cost moves at invoicing",
  "When two lines' vendor bill costs move between the same two accounts, does the window show one row or two?",
  "When a vendor bill was posted and a line's No Charge mark changes before invoicing, Create invoice first shows a window with \"Moved from "
  "[account] to [account]\" rows. The PRD says one row per move. The developers' plan groups them by account pair, so two lines that both "
  "move from Cost of Parts to Warranty show as one row with the amounts added together.",
  ["(a) One row per pair of accounts, amounts added up, as the developers' plan builds it (suggested: the accounts are what the accountant reads)",
   "(b) One row for each line or bill that moves", "(c) One row per pair of accounts with the lines listed under it"],
  "One case: two lines moving between the same accounts.", "PRD v1.0 S7-R8; tech plan Appendix A §2.11 (lines 2503, 2833, 3471)"),
 ("closed-chip", "The \"Closed\" value in the work orders Status filter",
  "Should a shop that has never used Internal Work Orders see \"Closed\" in the Status filter on the All tab?",
  "The PRD adds \"Closed\" to the Status filter with no condition. The developers' plan shows it only once the shop has switched the "
  "setting on or closed at least one work order, so a shop that never uses the feature sees its list exactly as before.",
  ["(a) Hide \"Closed\" until the shop switches the setting on or closes a work order (suggested: it keeps the \"no change until they turn it on\" promise)",
   "(b) Show \"Closed\" for every shop from the release", "(c) Something else (please say)"],
  "One case: the Status filter in a shop that never used the feature.", "PRD v1.0 S2-R10; tech plan Appendix B FE-B4 (line 3368)"),
 ("import", "Work orders that come in through an import",
  "How should we treat the rule that an imported work order takes its customer's classification?",
  "The PRD says an imported work order is internal when its customer is flagged. The developers found that ShopView has no live work order "
  "import today, so nothing is built for it and a tester has nowhere to try it.",
  ["(a) Keep the rule for when an import exists, with no test now (suggested)", "(b) There is an import we missed: please say where, and we will test it",
   "(c) Take the rule out of the PRD in a v1.x note"],
  "One case: an imported work order for an internal customer.", "PRD v1.0 S2-E3; tech plan §10 (line 1867) and Appendix A C20 (line 2293)"),
 ("portal-deposit", "A deposit paid on the customer portal after the work order became No Charge",
  "Is it acceptable for v1 that this payment is refused and has to be refunded by hand?",
  "No Charge cannot be set while a deposit exists, and the portal refuses deposits on internal and no-charge work orders. One gap remains: "
  "the customer opens the deposit checkout on the portal while the work order is still billable, the advisor converts it to No Charge, and "
  "then the customer pays. ShopView refuses the deposit, but the card has been charged, and the money waits until someone refunds it with "
  "the existing refund action (no automatic refund in this release).",
  ["(a) Yes for v1: the refused deposit is recorded with its own reason and the shop refunds it with the existing action (suggested: rare, and visible to the shop)",
   "(b) No: block Convert to No Charge while a portal deposit checkout is open", "(c) No: refund it automatically in this release"],
  "One case: a portal deposit paid after the conversion.", "Tech plan Appendix D (lines 5237, 5298) and Appendix A (line 3116); PRD v1.0 S2-N4, S2-N5 (silent on this order of events)"),
 ("hub-inactive-account", "An AccountingHub account that a category row is mapped to",
  "May we test that the hub refuses to deactivate such an account, instead of testing what happens after it is deactivated?",
  "The PRD says that if a mapped account is made inactive, the hub holds the entries until the row is changed. In AccountingHub today an "
  "account that any mapping row points at cannot be deactivated, and the developers add the category rows to that check, so the inactive "
  "state can only happen through a database change.",
  ["(a) Yes: test the refusal, and keep the \"held when inactive\" rule as a safety net we do not test by hand (suggested)",
   "(b) No: the hub should allow it, then hold the entries as the PRD says"],
  "Two cases: the refused deactivation, and the held entry.", "PRD v1.0 S6-E1; tech plan Appendix C (lines 3884, 4183)"),
 ("line-marks-after-convert", "No-charge lines after converting the whole work order to No Charge and back",
  "After a work order with Warranty or Comeback lines is converted to No Charge and later back to billable, should those lines get their own marks back?",
  "Converting the whole work order to No Charge puts every line under the work order's category and replaces the lines' own categories. "
  "The developers' plan clears the lines' own marks at that point, so after Convert to Billable every line comes back as an ordinary billable "
  "line and the advisor marks them again if needed.",
  ["(a) Every line comes back billable; the advisor marks lines again if needed (suggested: matches \"Every line is priced as a new line would be today.\")",
   "(b) Lines that had their own No Charge mark before get it back with their category"],
  "One case: line marks after Convert to No Charge then Convert to Billable.", "PRD v1.0 S2-R5, S2-R6; tech plan Appendix A (line 2385)"),
 ("work-order-updated", "Notifying connected systems when a work order's No Charge setup changes",
  "Should the Open API send the work_order.updated event when a work order or a line is converted, its category changes, or its shop supplies amount changes?",
  "The PRD lists this as a proposal for the Open API owner to confirm, so a test cannot pass or fail on it yet.",
  ["(a) Yes, send work_order.updated with the work order and its lines for each of these changes (suggested: integrations hear about it)",
   "(b) No webhook for these changes in this version", "(c) Something else (please say)"],
  "One case: work_order.updated after Convert to No Charge.", "PRD v1.0 S11-R3"),
 ("rate-zero", "The Comeback rate in the Internal Work Orders report, By technician tab",
  "What should the rate show for a technician who has comebacks but no completed lines in the chosen dates?",
  "The rate is comeback lines divided by completed lines. When a comeback lands in a month in which the original technician completed "
  "nothing (or has left), that division has nothing to divide by.",
  ["(a) A dash or an empty cell, not a number (suggested: 0% and 100% would both mislead)", "(b) 0%", "(c) Something else (please say)"],
  "One case: the rate with no completed lines.", "PRD v1.0 S9-R2; tech plan Appendix A Phase 10 (rate definition, line 2736)"),
 # ---- round 2b (12 Nov 2026): the design worker's questions 8-12 (design-2026-11-12/NEW-QUESTIONS.py), reworded; its 13 is a ruling (DROPPED)
 ("category-helper", "The helper texts for categories on the Internal Work Orders page and on Edit Customer",
  "What should the category helper texts say, now that the category is never changed on the work order?",
  "The design's texts say the category shows on, and can be changed on, the work order: the New No Charge Category window says \"It shows "
  "on the work order, the NO CHARGE document and the Internal Work Orders report.\", the Internal categories tab says \"a work order can "
  "change it\", and Edit Customer says the default category is \"Preselected on every new work order for this customer; a work order can "
  "change it.\" The PRD says the opposite on both points: the category is not shown on the work order (only the badge is), and an internal "
  "work order's category is changed on the asset or the customer, never on the work order. The PRD gives no wording for these helper lines, "
  "so we cannot check them yet. The rest of each screen is tested now.",
  ["(a) Texts that match the PRD, for example \"It shows on the NO CHARGE document and the Internal Work Orders report.\" and no \"a work order can change it\" (suggested: the behaviour is already settled, only the words are missing)",
   "(b) The design's texts as drawn", "(c) No helper text in these places"],
  "One case: the New No Charge Category helper as the design draws it.",
  "PRD v1.0 S2-R16, S2-R1; design \"Internal Work Orders · All flows v6\", Flow 0 boards 2a, 2c, 11; Happy flow 04, 06; Review 2.1, 2.3 (register IWO-D09)"),
 ("locked-note", "The note on a closed internal or no-charge work order",
  "Should a closed internal work order show the extra \"This work order is locked\" note the design draws?",
  "The PRD gives one line in the header: \"Closed on [posting date]. To change it, reopen it from the Finance tab.\" The design adds a "
  "second note under it: \"Closed on Oct 22, 2026 by Admin ShopView\", \"This work order is locked. Reopen it to change lines, hours or "
  "parts.\" and \"Reopening returns it from Closed · Internal to Complete.\" The design's own comment calls it the locked note \"as on any "
  "closed work order\", so it may be the note an invoiced work order already shows. The header line is tested now.",
  ["(a) Only the header line from the PRD (suggested: it already says how to change the work order)",
   "(b) The header line and the locked note, as drawn", "(c) Only the locked note, in place of the header line"],
  "One case: the locked note as the design draws it.",
  "PRD v1.0 S2-R9; design \"Internal Work Orders · All flows v6\", Flow 3 boards 01, 02; Happy flow 36, 37 (register IWO-D29)"),
 ("reopen-message", "A message after Reopen Work Order",
  "Should a green message \"Work order [number] reopened\" show after Reopen Work Order?",
  "The design shows it. The PRD gives the Reopen window, the result (the work order is back to Complete) and the failure message "
  "\"Could not reopen the work order. Try again.\", but no success message. The Reopen window and the result are tested now.",
  ["(a) Yes, \"Work order [number] reopened\" as drawn (suggested: ShopView confirms other finished actions the same way)",
   "(b) No message: the work order simply shows Complete again", "(c) Other wording (please say)"],
  "One case: the message as the design draws it.",
  "PRD v1.0 S4-R3, Story 4 Error Handling; design \"Internal Work Orders · All flows v6\", Flow 3 board 03 (register IWO-D31)"),
 ("report-empty-cell", "Empty cells in the Internal Work Orders report",
  "On an internal work order's row, should the Original work order and Original technician cells show a dash or stay blank?",
  "An internal job has no original work order, so those two cells have no value. The design leaves them blank. ShopView's design library "
  "says an empty table cell always shows a dash, \"never an empty cell\", and the asset Invoices tab in the same design uses the dash. The "
  "PRD lists the columns but does not say what an empty cell shows. The rest of the report is tested now.",
  ["(a) A dash \"—\" in every cell with no value, as the library says (suggested: the same as ShopView's other tables)",
   "(b) A blank cell, as drawn", "(c) Something else (please say)"],
  "One case: the blank cells as the design draws them.",
  "PRD v1.0 S9-R2; design \"Internal Work Orders · All flows v6\", Flow 4 board 05; Happy flow 39; Review 7.2; design library work-orders.jsx, the dash cell (register IWO-D44)"),
 ("report-wrapping", "Work order numbers wrapping in the Internal Work Orders report",
  "Should work order numbers and dates in the report stay on one line on a normal laptop screen?",
  "The design's table breaks work order numbers over two lines (\"S2-\" above \"34918\") and wraps the dates, even at 1440 and 1536 "
  "pixels wide. The PRD lists the columns and says nothing about widths. Our look checks expect nothing cut or broken at those widths.",
  ["(a) Numbers and dates stay on one line at 1440 and 1536 pixels (suggested: a split number is hard to read and to search for)",
   "(b) Wrapping as drawn is fine", "(c) Something else (please say)"],
  "One case: the wrapped numbers as the design draws them.",
  "PRD v1.0 S9-R2; design \"Internal Work Orders · All flows v6\", Flow 4 boards 05, 06; Happy flow 39, 39b; Review 7.2, 7.5 (register IWO-D45)"),
 # Round 5 (14 Nov 2026, layout stress round, QA lead: "Draft all 87 + 4 questions (Recommended)"): questions 17 and 18, drafts for the
 # same sheet (Rule 131); sheet rows in ../questions-2026-11-14/sheet_rows.py; skill 07 §6.0 checks in NEW-CASES.md.
 ("columns-when-rows-change", "Columns of the work orders list and the reports when the rows change",
    "Should the columns of the work orders list, the Internal Work Orders report and Technician Efficiency keep their place when a filter, a tab or the number of rows changes?",
    "The design draws the work orders list with its columns at different places in different states: when Classification leaves no rows, "
    "the headings move by up to 214 pixels; on the All tab with Status Closed, by 9 to 56 pixels. The design library sizes these columns to "
    "their content, so a long name or an empty list moves them. No source says whether they should stay.",
    ["(a) The columns keep their place (suggested: a table that jumps is hard to read, and we can check it)", "(b) The columns may move as the rows change, as drawn",
     "(c) Something else (please say)"],
    "Four design cases: the work orders list when Classification changes and on the All tab with Status Closed, the report when the rows change, Technician Efficiency when its chip changes.",
    "PRD v1.3 S2-R14, S2-R10, S9-R2, S9-R3; design Flow 4 boards 01, 02, 03, 04, 05; Flow 1 board 09"),
 ("lines-columns-no-charge", "Columns of a work order's lines table when a line or the work order becomes No Charge",
    "When a line is marked No Charge, or the work order is converted, should the lines table's other columns stay where they were?",
    "The PRD keeps the three-dots menu on a no-charge line (Change category, Mark as Billable) and hides Rate, Margin and Total on a no-charge "
    "work order; those parts are settled and tested. The design draws the remaining headings moving: with the line's chip and menu (Flow 6 "
    "board 04) Actual/Estimate and Status sit about 40 pixels further right than before the mark (board 01); on Convert, Rate moves about "
    "52 pixels. No source says whether the columns should stay.",
    ["(a) The columns stay where they were (suggested: the tester and the advisor find each column in the same place)", "(b) The columns may move, as drawn",
     "(c) Something else (please say)"],
    "Two design cases: the lines table when a line is marked No Charge and back, and when the work order is converted and back.",
    "PRD v1.3 S12-R3, S12-R5, S2-R4, S2-R5, S2-R6; design Flow 6 boards 01, 03, 04; Flow 2 boards 01, 03"),
]
QN = {slug: i for i, (slug, *_r) in enumerate(QUESTIONS, 1)}
# Round 3 (12 Nov 2026): Milos Vasic answered all 16 (all option (a)); PRD v1.1 carries every answer except 10 (Open API owner pending)
import json as _json, os as _os
ANSWERED = {int(k): v for k, v in _json.load(open(_os.path.join(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))),
            "po-answers-2026-11-12", "ANSWERS-Milos-Vasic-2026-11-12.json")))["answers"].items()}

# Points considered and NOT asked, because a saved source settles them (skill 07 §6, step 3), or because no runnable case depends on them
DROPPED = [
 ("Asset Invoices tab: \"No Charge\" (PRD S3-R6, S9-R10) or \"$0.00\" (Jira SV-11976 item 7) in Total balance (our question 4 of round 1)",
  "Settled: the tech plan builds \"No Charge\" (TP-174: \"`cell_vehicle_invoice_total_<id>` reads \\\"No Charge\\\"\"), the same as the PRD; the "
  "verify ticket's \"$0.00\" is loose wording. The case follows the PRD and is no longer held."),
 ("By technician totals row: is the Comeback rate pooled (our question 6 of round 1)?",
  "Settled by the tech plan, which the PRD leaves open: TP-312 \"comeback rate = comeback lines / completed lines; totals count each line "
  "once\". DATA-08 now quotes it and is runnable."),
 ("The message when a completion step fails inside Close (tech plan question 3; plan Appendix B risk 16, line 3723)",
  "Not asked now: no case a tester can run depends on it (a completion step or Close has to fail, which only a developer can make happen; "
  "S3-53 is in NO-MANUAL-PROPOSAL.md). Reported to the QA lead as a plan-vs-PRD difference (TECH-PLAN-DIVERGENCES.md D-3)."),
 ("The Jira stories still use the old names (\"No-Charge Work Orders\" setting and report, \"Reason\", two fixed QuickBooks rows, two hub keys)",
  "PRD v1.0 is the latest source and records each rename itself; every Jira story says \"Requirements ... live in the spec\"."),
 ("\"No charge\" with a small c in two places of the tech plan (D39 hub summary, an old Q17 answer), an old report name, account 6510, the release-run order",
  "The PRD wins and the plan's own build sections already follow it, or no tester sees the difference (TECH-PLAN-DIVERGENCES.md D-5 to D-9): reported to the QA lead, not to the PO."),
 ("§8 Close confirmation row writes \"This completes the work order, posts ...\"", "An abbreviation of S3-R2's full sentence, which the cases quote."),
 ("S12-N3 (\"the line menu offers neither ... the tooltip reads\") vs SV-12421 (\"disabled with 'Reverse the invoice first.'\")",
  "The tech plan settles it (TP-328, TP-481): the actions show disabled with the tooltip. S12-26 checks both."),
 ("SV-12295 \"Comeback Expense at the number the hub owner confirms\"", "PRD v1.0 S6-R2: 6440 Comeback Expense, confirmed 2026-11-09."),
 ("Two reviewer remarks left in the file of the design's Review board 1.1 (design question 13, register IWO-D50): \"Move this tooltip text ... just one sentence.\" and \"Badge here, we agree, is not no-charge warranty. It's no charge, just that the badge itself\"",
  "A named ruling, not a question: the remarks sit below the board's visible area (only in the board's file), PRD Final v1.0 (9 Nov 2026) is newer than the design and its header says \"Where a frame and this text disagree, the text wins\"; it already gives the toggle description in full (S1-R1) and the badge as \"No Charge\" in a style different from Internal (S2-R3), which is what the second remark asks for. No case's verdict depends on the remarks."),
 ("The design's other 45 differences (register IWO-D01 to IWO-D52 except the seven open ones: IWO-D09, D19, D29, D31, D44, D45 and D50)", "Each settled by a named PRD sentence (PRD header: \"Where a frame and this text disagree, the text wins\"); the cases follow the PRD and name the difference under References from Design."),
]
