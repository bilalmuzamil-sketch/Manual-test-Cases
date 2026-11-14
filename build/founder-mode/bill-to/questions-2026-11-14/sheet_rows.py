"""Bill To – two new questions for Chris Ward, 14 Nov 2026 (QA lead: "Draft all 87 + 4 questions (Recommended)"), for the EXISTING sheet
https://docs.google.com/spreadsheets/d/1o55Q5O5kFNV1JWcBX2pFZy741A1enT8BomHWzJH_Vi8 (Rule 131: same sheet, new rows at the bottom, numbered on,
in a colour not used there before, added to the colour guide with the date; earlier rows and answers are never touched).

Same column layout and wording style as ../questions-2026-11-10/sheet_rows.py: #, Topic ("Bill To: ..."), Question for you (the question,
then the options on their own lines), What we know today, Your answer (left empty, yellow), Where we found it. Numbers 16 and 17: questions
1-15 were sent; question 11 was withdrawn and its row deleted on 13 Nov 2026, the others keep their numbers (Rule 131 as amended).
Source: build/founder-mode/LAYOUT-STRESS-GAP-SCAN-2026-11-13.md §B4 (Q-BT-1, Q-BT-2). The held cases: authoring/po_questions.py
questions 16 and 17 (the same text), cases D-101 (q16), D-102 and D-103 (q17).

DRAFT ONLY: this file writes nothing to Google. The coordinator adds the rows. python3 sheet_rows.py  -> sheet-rows.json"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
DESIGN = "The design \"Bill To design\" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd)"
COLOUR = "Green = new questions added on 14 Nov 2026"     # the sheet's guide uses Yellow, Blue and Grey only (sheet-values.json, 10 Nov 2026)

ROWS = [
 [16, "Bill To: Service For column when \"Open only\" is switched",
  "On a payer's Invoices tab, the Service For column shows only when an invoice on the tab is for another customer's work. When the "
  "\"Open only\" switch hides the only such invoice (for example because it is paid), should the Service For column stay or go?\n"
  "(a) It stays: whether it shows is decided from every invoice of the tab, whatever Open only shows, so the columns do not move.\n"
  "(b) It goes when no invoice still shown is for someone else, so Date, Type, No. and Memo move.\n"
  "(c) Something else (please say).",
  "The spec says the column is hidden when no invoice on the tab, before any search, is for someone else; it names the search but not the "
  "Open only switch. In the design, adding the column moves Date, Type, No. and Memo sideways (by up to about 90 pixels), so on a live tab "
  "the columns would jump each time the switch is used.",
  "",
  "Spec: Story 10 (SV-12312), when the Service For column is hidden. " + DESIGN + ", page 5, pictures \"A & J, Invoices\" and "
  "\"Valders, Open only off\"."],
 [17, "Bill To: Bill To column on the asset's Work Orders tab after filtering",
  "On an asset's Work Orders tab, the Bill To column shows when at least one work order bills someone else. When the Customer filter or "
  "the Status filter leaves only work orders that bill their own customer, should the Bill To column stay or go?\n"
  "(a) It stays: whether it shows is decided from the asset's whole list before any filter, so the columns do not move.\n"
  "(b) It goes when no work order still shown bills someone else, so every column after it moves.\n"
  "(c) Something else (please say).",
  "The spec says when the column shows but not whether that is before or after filtering. The design draws no filtered list with the "
  "column; on its own pictures, a list with the column and one without it place the later columns 77 to 213 pixels apart. For the "
  "Service For column the spec decides it before any search.",
  "",
  "Spec: Story 14 (SV-12316), the Bill To column rule and the Customer filter. " + DESIGN + ", page 7, pictures \"Whole history\", "
  "\"One customer picked\" and \"Work Orders tab, top\"."],
]

# Skill 07 §6.0, the eight pre-send checks (lesson L-20), run per question on 14 Nov 2026 against PRD v0.5, the 20 saved tickets, the whole
# design package (boards, design library, 126 pictures) and the sheet's 14 open questions. No tech plan exists yet (PROJECT-STATE.md).
CHECKS = {
 16: {
  "a": "PASSED. The PRD has no precedence statement (no 'the text wins' or 'the table is a summary'; its Design authority field is empty).",
  "b": "PASSED. Our suggested answer (a) has no backing sentence: S10-N1 fixes the column 'before any search' and never names Open only "
       "(the PRD does not mention the switch at all).",
  "c": "PASSED. No other source speaks: the design draws one Open only state (\"Valders, Open only off\"); no tech plan exists; no ticket "
       "adds to S10-N1.",
  "d": "PASSED. The design library has no always/never rule about a column showing or hiding with the rows.",
  "e": "PASSED. Testable by hand: D-101 is written and runnable; only its verdict waits.",
  "f": "PASSED. The PRD names no other owner for Story 10; Chris Ward owns the PRD.",
  "g": "PASSED. The behaviour itself is open (does the column stay or go), not its wording.",
  "h": "PASSED. Not a duplicate of the 14 open questions (none is about the Invoices tab's columns); it decides a verdict (D-101).",
 },
 17: {
  "a": "PASSED. No precedence statement in the PRD.",
  "b": "PASSED. Our suggested answer (a) has no backing sentence: S14-R6 says 'at least one row' without before or after filtering; "
       "S14-N1 only says the Customer filter is cleared when Status includes Imported.",
  "c": "PASSED. No other source speaks: the design draws no filtered list with the Bill To column (pictures \"One customer picked\" and "
       "\"Applied\" show an asset without that column); no tech plan.",
  "d": "PASSED. No design-library rule covers a column that depends on the rows.",
  "e": "PASSED. Testable by hand: D-102 and D-103 are written and runnable (neither needs an imported work order).",
  "f": "PASSED. The PRD names no other owner for Story 14.",
  "g": "PASSED. The behaviour is open, not its wording.",
  "h": "PASSED. Not a duplicate: question 14 asks which pages count (all pages or only loaded rows), question 10 asks about width at "
       "1440; this one asks about filters. It decides two verdicts (D-102, D-103).",
 },
}

def values():
    return [[str(r[0]), r[1], r[2], r[3], r[4], r[5]] for r in ROWS]

if __name__ == "__main__":
    assert [r[0] for r in ROWS] == [16, 17]
    json.dump({"colour": COLOUR, "rows": values(), "checks": CHECKS}, open(f"{H}/sheet-rows.json", "w"), ensure_ascii=False, indent=1)
    for r in ROWS: print(r[0], r[1], "|", r[2][:80].replace("\n", " / "), "|", r[5][:60])
