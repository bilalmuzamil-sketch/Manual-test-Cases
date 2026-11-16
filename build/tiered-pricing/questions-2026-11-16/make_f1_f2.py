"""Draft of questions 32 and 33 for Matt Barge (follow-ups F1 and F2 to his answer 6), 16 Nov 2026. QA lead, 16 Nov 2026: "Add both to the
sheet (Recommended)". Rule 131: they go at the bottom of the SAME sheet (https://docs.google.com/spreadsheets/d/1qVTIPIWUarmDGg6AjD1q8BbitlynKdjy9VYBCpGuMeY),
numbered on (32, 33), in a colour not used there before, with a dated heading row, the colour guide extended, earlier rows untouched; same six
columns and plain style as questions-2026-11-14/sheet_rows.py. DRAFT ONLY: this file writes nothing to Google (the coordinator adds the rows).
    python3 make_f1_f2.py   -> F1-F2-rows.json (fails if a PO-facing cell holds a case id or a requirement code)"""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
OPT_C = "(c) Something else (please say)."
HEADING = ["New questions added 16 Nov 2026 (follow-ups to your answer 6)", "", "", "", "", ""]
ROWS = [
 ["32", "Tiered Pricing: what a category's own page shows while it is being moved to another matrix",
  "On a matrix's page in Edit, after a category is picked on the Categories line and before Save is clicked, which matrix does that category's own "
  "page (and its row on the Categories list) show?\n(a) Still its old matrix, until Save (suggested: your answer and the PRD say its parts are priced "
  "by the new matrix only after Save, and Cancel puts the line back, so the rest of Settings would agree with the prices)\n(b) The new matrix at "
  "once, while its parts still price by the old matrix until Save\n" + OPT_C,
  "Your answer 6 says the category \"is saved in the picker when picked\" but its parts don't price by the matrix until the matrix is saved. The PRD "
  "(16 Nov) now says the picked categories show on the matrix's Categories line at once, are priced by the matrix only after Save, and Cancel puts "
  "them back. Neither says what the category's own page shows in between. Our tests check the part's price before and after Save; this check is "
  "added once you answer.",
  "", "PRD Story 3 (the matrix page's Categories line); your answer 6 (16 Nov 2026)"],
 ["33", "Tiered Pricing: Change All when a Save only adds a category to a shared matrix",
  "A matrix already prices two or more categories. In Edit, the user only picks one more category (no value in the grid changes) and clicks Save. "
  "Does the \"Change Prices in [n] Categories?\" question (Change All) appear?\n(a) No: with no grid value changed it saves without asking, as "
  "renaming does (suggested: no rule changes for the categories already on the matrix, and before 16 Nov the PRD said category changes save without "
  "asking)\n(b) Yes: every Save of a matrix used by more than one category asks it\n" + OPT_C,
  "Before 16 Nov the PRD said renaming, changing its categories and turning the Part Sale switch on save without asking. Since 16 Nov it says "
  "categories save with the grid, and that saving the grid of a matrix used by more than one category asks the question. It does not say whether "
  "a Save that changes only the categories counts. One test waits for your answer.",
  "", "PRD Story 3 (what asks Change All; the matrix page's Categories line); your answer 6 (16 Nov 2026)"],
]
BAD = re.compile(r"\b(S\d{1,2}-[RNE]\d+|TPX-\d+|D-\d+|C\d{6,7}|INV-\d+|RPT-\d+)\b")
for r in ROWS:
    assert len(r) == 6 and r[4] == "", r
    for cell in r:
        m = BAD.search(cell)
        if m: raise SystemExit(f"PO-facing cell holds an internal code {m.group(0)!r}: {cell[:60]}")
out = {
 "sheet": "https://docs.google.com/spreadsheets/d/1qVTIPIWUarmDGg6AjD1q8BbitlynKdjy9VYBCpGuMeY",
 "rule_131": "add at the bottom (after row 36, question 31), numbered on, new colour, dated heading row, colour guide extended, earlier rows and answers untouched",
 "suggested_colour": {"name": "Light green", "hex": "#d9ead3", "why": "not used in the sheet (Yellow = answer column, Blue = topic, Grey = where we found it)"},
 "colour_guide_addition": "Light green = new questions added 16 Nov 2026 (from row 37)",
 "colour_guide_cell": "row 3, the first empty cell after \"Grey = where we found it\" (column E)",
 "answer_column": "column E keeps the sheet's yellow answer colour",
 "rows_to_add": {"37": HEADING, "38": ROWS[0], "39": ROWS[1]},
 "internal_not_for_the_sheet": {
   "32": {"follow_up": "F1", "holds_cases": [], "why_no_case": "S3-17 and S3-18 were rewritten to check prices before and after Save (settled by "
          "PRD v38 S3-R13 and answer 6); the category-page check between the pick and Save is added when question 32 is answered."},
   "33": {"follow_up": "F2", "holds_cases": ["S3-40 = C1211562 https://shopview.testrail.io/index.php?/cases/view/1211562 (AUTOMATION: HOLD - waiting on the PO (question 33); moved to 'Waiting on Matt Barge's answers', out of run 560)"]},
 },
}
json.dump(out, open(f"{H}/F1-F2-rows.json", "w"), indent=1, ensure_ascii=False)
print("rows 37-39 drafted for questions 32-33 ->", f"{H}/F1-F2-rows.json")
