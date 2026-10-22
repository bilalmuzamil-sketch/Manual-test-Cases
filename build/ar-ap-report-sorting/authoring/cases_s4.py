"""Story 4 — Collapse all, Expand all and pinned group rows (S4-R1 to S4-R9, S4-N1, S4-N2)."""
from ar_lib import C, GROUPED
from common import *
from po_questions import QN

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"S4-{ORDER['n']:02d}"
def gname(code):
    return "bucket" if R[code]["group"] == "aging bucket" else f"{R[code]['party']} group"
def several(code, k):
    r = R[code]
    if r["group"] == "aging bucket":
        return (f"The report has open {docs(code)} in at least three aging buckets on today's date.", None)
    return (f"At least three {r['parties']} have overdue {r['doc']}s on today's date.", f"For example: {', '.join(ex(k, 'Alder', 'Birch', 'Cedar'))}.")

for code in GROUPED:
    r = R[code]; k = nk(); g = gname(code)
    C(k, "S4", f"{r['n']}: the top-left chevron collapses and expands every group",
      [ADMIN(), several(code, k), START(code, ", with every group collapsed")],
      [f"Click the chevron on one {g} row.",
       "Hover over the chevron button in the table's top-left header cell.",
       "Click that chevron button.",
       "Look at the column header under the button and at the sort mark.",
       "Hover over the chevron button again.",
       "Click it.",
       f"Look at each {g} row's own chevron."],
      [f"Step 1: that {g} expands and its own chevron turns from pointing right to pointing down.",
       "Step 2: the button's chevron points down (a group is expanded) and a tooltip above the button reads \"Collapse all\".",
       "Step 3: every group collapses.",
       "Step 4: the column under the button was not sorted: the sort mark is still on the column the report opened on.",
       "Step 5: the chevron now points right and the tooltip reads \"Expand all\".",
       "Step 6: every group expands, and the column under the button is still not sorted.",
       f"Step 7: every {g} row's chevron points down (open)."],
      ["S4-R1", "S4-R3", "S4-R5", "UFS-5"],
      note=f"The opening state of the groups is not stated in the PRD (question {QN['groups-open']}); the starting screen asks for every group collapsed, collapsing any that are open.")

for code in ("ARC", "APU"):
    r = R[code]; k = nk()
    C(k, "S4", f"{r['n']}: after Expand all, groups loaded later arrive expanded",
      [ADMIN(), (f"More than 30 {r['parties']} have overdue {r['doc']}s on today's date.", None), START(code)],
      ["Click the chevron button in the table's top-left header cell until its tooltip reads \"Collapse all\" (every group expanded).",
       f"Scroll down (or go to the next page) until more {r['party']} groups arrive.",
       "Look at the groups that just arrived."],
      ["Step 1: every group on screen is expanded.",
       f"Step 2: the next {r['parties']} load.",
       "Step 3: they arrive expanded, showing their rows, without another click."],
      ["S4-R2", "S4-R1"],
      note=f"How the next 30 {r['parties']} are reached (page buttons or scrolling) is question {QN['paging']}.")

for code in ("ARD", "APD"):
    r = R[code]; k = nk()
    C(k, "S4", f"{r['n']}: an expanded bucket shows 100 lines, then loads more on scroll",
      [ADMIN(), (f"One aging bucket, {{Bucket-A}}, has more than 150 open lines on today's date.",
                 "For example: {Bucket-A} is \"91 or more days past due\" on the QA organization" + (" (13,540 open A/P lines)." if code == "APD" else ".")),
       START(code, ", with every bucket collapsed")],
      ["Expand {Bucket-A} with its own chevron.",
       "Scroll to the last line shown in {Bucket-A} without scrolling further, and count the lines (or compare them with the bucket's first 100 rows in a CSV export).",
       "Keep scrolling down.",
       "Collapse {Bucket-A}, then click the chevron button in the top-left header cell (Expand all).",
       "Scroll to the end of {Bucket-A} again."],
      ["Step 1: {Bucket-A} opens.", "Step 2: it shows its first 100 lines.",
       "Step 3: more lines load as you scroll, continuing the same order with no line repeated.",
       "Step 4: every bucket expands; {Bucket-A} again shows its first 100 lines.", "Step 5: more lines load as you scroll."],
      ["S4-R4", "S1-R8"])

for code in GROUPED:
    r = R[code]; k = nk(); g = gname(code)
    tall = ("two buckets, {Bucket-A} and the next bucket below it, {Bucket-B}, each with more lines than fit on the screen" if r["group"] == "aging bucket"
            else f"two {r['parties']} next to each other in name order, {{{r['Party']}-A}} then {{{r['Party']}-B}}, each with more overdue {r['doc']}s than fit on the screen")
    A, B = ("{Bucket-A}", "{Bucket-B}") if r["group"] == "aging bucket" else (f"{{{r['Party']}-A}}", f"{{{r['Party']}-B}}")
    exl = ("For example: {Bucket-A} is \"31-60 days past due\" and {Bucket-B} is \"1-30 days past due\"." if r["group"] == "aging bucket"
           else f"For example: {{{r['Party']}-A}} is {ex(k, 'Long List A')[0]} and {{{r['Party']}-B}} is {ex(k, 'Long List B')[0]}, each with 25 overdue {r['doc']}s.")
    C(k, "S4", f"{r['n']}: the group row stays pinned under the headings",
      [ADMIN(), (f"On today's date the report has {tall}.", exl), START(code, f", with {A} and {B} expanded")],
      [f"Scroll down slowly into {A}'s rows.",
       f"Keep scrolling until {B}'s row reaches the top.",
       "Keep scrolling into {B}'s rows.".replace("{B}", B),
       f"Scroll back up slowly until you are inside {A}'s rows again.",
       "Make the browser window 1200 px wide.",
       "Scroll the table sideways to the right."],
      [f"Step 1: {A}'s row stays pinned just under the column headings while its rows scroll beneath it.",
       f"Step 2: {B}'s row pushes {A}'s row up and off and takes its place; only one group row is pinned at a time.",
       f"Step 3: {B}'s row stays pinned.",
       f"Step 4: the change reverses: {A}'s row comes back down into the pinned place.",
       "Step 5: the table now scrolls sideways (narrower than 1440 px).",
       f"Step 6: each group row's label ({A}'s name) stays visible at the left while the columns move."],
      ["S4-R6", "S4-R7", "S8-R3"])

for code in ("ARC", "APU"):
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S4", f"{r['n']}: paging keeps each group expanded or collapsed",
      [ADMIN(), (f"More than 30 {r['parties']} have overdue {r['doc']}s on today's date; {{{P}-A}} is on the first page.", f"For example: {{{P}-A}} is {ex(k, 'First Page')[0]}."),
       START(code, f", with only {{{P}-A}}'s group expanded")],
      ["Go to the next page (or scroll until the next 30 load).", "Go back to the first page (or scroll back up).", f"Look at {{{P}-A}}'s group and the groups around it."],
      ["Step 1: the next groups show.", "Step 2: the first page shows again.",
       f"Step 3: {{{P}-A}}'s group is still expanded and the others are still collapsed."],
      ["S4-R8"],
      note=f"How the next 30 are reached is question {QN['paging']}.")

for pair in (["ARD", "ARC"], ["APD", "APU"]):
    k = nk(); a, b = R[pair[0]], R[pair[1]]; steps, res = [], []
    for code in pair:
        n0 = len(steps); nm = R[code]["n"]; g = gname(code)
        steps += [f"Open Reports > Finance > {nm} and note which groups are expanded.",
                  f"Click the chevron on the first {g} row to change it.",
                  "Open Reports > Finance > Sales By Customer, then open " + nm + " again."]
        res += [f"Step {n0+1}: {nm} opens; note its opening state.", f"Step {n0+2}: that {g} changes (expands or collapses).",
                f"Step {n0+3}: {nm} opens in the same state as in step {n0+1}, not the state you left: the change is not remembered."]
    C(k, "S4", f"{a['n']} and {b['n']} do not remember expanded groups",
      [ADMIN(), ("Both reports have open documents on today's date in several groups.", None), "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
      steps, res, ["S4-R9"], reports=pair)

for code in GROUPED:
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S4", f"{r['n']}: changing the date or a filter collapses every group",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has open {r['doc']}s at both locations, some 31 to 60 days past due, on today's and yesterday's date.",
                          f"For example: {{{P}-A}} is {ex(k, 'Collapse Me')[0]}."),
       START(code, ", with every group expanded (Expand all)")],
      ["Change the as-of date to yesterday.", "Click the top-left chevron button to expand every group.",
       f"Open the {P} filter and tick {{{P}-A}}.", "Click the top-left chevron button to expand every group.",
       "Open the Past due filter and tick \"31-60 days\".", "Click the top-left chevron button to expand every group.",
       "Open the Location filter and untick {Location-B}."],
      ["Step 1: the report reloads for yesterday with every group collapsed.", "Step 2: every group expands.",
       f"Step 3: only {{{P}-A}}'s rows remain and every group is collapsed.", "Step 4: every group expands.",
       "Step 5: every group collapses.", "Step 6: every group expands.", "Step 7: every group collapses."],
      ["S4-N1"])

k = nk()
C(k, "S4", "A/R Summary and A/P Summary have no Collapse all button",
  [ADMIN(), ("Both reports have open documents on today's date.", None), "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
  ["Open A/R Summary and look at the table's top-left header cell.", "Hover over that cell.",
   "Open A/P Summary and look at the table's top-left header cell.", "Hover over that cell."],
  ["Step 1: there is no chevron button: the report has no groups.", "Step 2: no \"Collapse all\" or \"Expand all\" tooltip shows.",
   "Step 3: there is no chevron button.", "Step 4: no tooltip shows."],
  ["S4-N2"], reports=["ARS", "APS"])
