"""Internal Work Orders question sheet for Milos Vasic: questions 17 and 18 (14 Nov 2026), from the layout stress round.
DRAFT ONLY: nothing is written to the sheet by this file. The coordinator adds the rows at the bottom of the existing sheet
1HMtYS1VTJEH1-m4ykJNVefdg1mu2mwtlH9HhOkRml-w (Rule 131): same six columns as questions-2026-11-12/sheet_rows.py
(#, Topic, Question for you, What we know today, Your answer, Where we found it), numbered on from 16, in a colour not used on the
sheet before (light purple), added to the colour guide with the date. Earlier rows and answers are not touched.
The same two questions are rows 17 and 18 of ../authoring/po_questions.py, which holds the six cases waiting on them.
Skill 07 §6.0 checks a-h for each: ../layout-stress-2026-11-14/NEW-CASES.md, section "Questions"."""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
SHEET = "1HMtYS1VTJEH1-m4ykJNVefdg1mu2mwtlH9HhOkRml-w"
COLOUR = {"name": "light purple", "hex": "#E8DAEF"}
COLOUR_GUIDE = "Light purple = questions from checking how the screens hold long names and changing rows (added 14 Nov 2026, from row 24)"
BATCH = ("Questions from checking how the screens hold long names and changing rows (14 Nov 2026), questions 17 and 18. Hello again sir: while "
         "we checked how each screen copes with long names and with rows coming and going, two points came up that only you can decide. "
         "Everything else on these screens is written and ready to test.")
ROWS = [
 ["17", "Internal Work Orders: The columns of the work orders list and the reports when the rows change",
  "When a filter, a tab or the number of rows changes, should the columns of the work orders list, the Internal Work Orders report and "
  "Technician Efficiency stay where they are?\n"
  "(a) Yes, the columns keep their place (suggested: a table whose headings jump sideways is hard to read, and we can check it)\n"
  "(b) No, the columns may move with what is in them, as drawn\n"
  "(c) Something else (please say)",
  "ShopView sizes the columns of these tables to what is in them, so a long customer name, or a filter that leaves no rows, can shift the "
  "headings sideways. The design draws exactly that: on the work orders list, picking a Classification that leaves no rows moves the "
  "headings by up to 214 pixels, and the All tab with Status Closed moves some by 9 to 56 pixels. The PRD does not say either way. On the "
  "A/R and A/P reports the same movement was raised as a bug after Demo Day (SV-12763), so we would rather ask than guess. Everything else "
  "on these screens is tested now; four look checks wait on your answer.",
  "", "PRD v1.3 S2-R14, S2-R10, S9-R2, S9-R3; design \"Internal Work Orders · All flows v6\", Flow 4 boards 01, 02, 03, 04, 05 and "
      "Flow 1 board 09; design library, work orders list column widths (only On Site and Status have a fixed width)"],
 ["18", "Internal Work Orders: The lines table when a line, or the whole work order, becomes No Charge",
  "When a line is marked No Charge, or the work order is converted to No Charge and back, should the other columns of the lines table stay "
  "where they were?\n"
  "(a) Yes, the columns stay where they were (suggested: the advisor finds Hours, Status and the prices in the same place on every line)\n"
  "(b) No, they may move, as drawn\n"
  "(c) Something else (please say)",
  "The PRD already settles two parts, and both are tested now: a no-charge line keeps its three-dots menu (Change category, Mark as "
  "Billable), and a no-charge work order hides Rate, Margin and Total. What it does not say is whether the remaining columns stay put. In "
  "the design they move: once a line carries its \"No Charge · Warranty\" chip, Actual/Estimate and Status sit about 40 pixels further "
  "right than before, and after Convert the Rate heading moves about 52 pixels. One design picture (Flow 6 board 03) also leaves out the "
  "three-dots column; the PRD keeps the menu, so we follow the PRD there. Two look checks wait on your answer.",
  "", "PRD v1.3 S12-R3, S12-R5, S2-R4, S2-R5, S2-R6; design \"Internal Work Orders · All flows v6\", Flow 6 boards 01, 03, 04 and "
      "Flow 2 boards 01, 03"],
]


def values():
    """The rows to append under the last row of the sheet: a batch header, then one row per question (all in the new colour)."""
    return [[BATCH, "", "", "", "", ""]] + ROWS


if __name__ == "__main__":
    json.dump({"sheet": SHEET, "colour": COLOUR, "colour_guide_add": COLOUR_GUIDE, "rows": values()},
              open(f"{H}/sheet-values.json", "w"), ensure_ascii=False, indent=1)
    for r in ROWS: print(r[0], r[1][:80], "|", r[5][:60])
