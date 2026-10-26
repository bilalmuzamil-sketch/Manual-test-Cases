"""Story 4 — Collapse all, Expand all and pinned group rows (S4-R1 to S4-R9, S4-N1, S4-N2)."""
from ar_lib import C, GROUPED
from common import *
from po_questions import QN
import tech_plan as TP

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
       "Hover over the chevron button again.",
       "Click it."],
      [f"Step 1: that {g} expands and its own chevron turns from pointing right to pointing down.",
       "Step 2: the button's chevron points down (a group is expanded) and a tooltip above the button reads \"Collapse all\".",
       "Step 3: every group collapses, and the column under the button was not sorted: the sort mark is still on the column the report opened on.",
       "Step 4: the chevron now points right and the tooltip reads \"Expand all\".",
       f"Step 5: every group expands, the column under the button is still not sorted, and every {g} row's own chevron points down (open)."],
      ["S4-R1", "S4-R3", "S4-R5", "UFS-5"],
      note="This release does not change how the groups open, so they open as today; the starting screen asks for every group collapsed, collapsing any that are open.")

for code in ("ARC", "APU"):
    r = R[code]; k = nk()
    C(k, "S4", f"{r['n']}: after Expand all, groups loaded later arrive expanded",
      [ADMIN(), (f"More than 30 {r['parties']} have overdue {r['doc']}s on today's date.", None), START(code)],
      ["Click the chevron button in the table's top-left header cell until its tooltip reads \"Collapse all\" (every group expanded).",
       f"Scroll down until the next {r['party']} groups load."],
      ["Step 1: every group on screen is expanded.",
       f"Step 2: the next {r['parties']} load as you scroll, and they arrive expanded, showing their rows, without another click."],
      ["S4-R2", "S4-R1", "S1-R8"])

for code in ("ARD", "APD"):
    r = R[code]; k = nk()
    C(k, "S4", f"{r['n']}: an expanded bucket shows 100 lines, then loads more on scroll",
      [ADMIN(), (f"One aging bucket, {{Bucket-A}}, has more than 150 open lines on today's date.",
                 "For example: {Bucket-A} is \"91 or more days past due\" on the QA organization" + (" (13,540 open A/P lines)." if code == "APD" else ".")),
       START(code, ", with every bucket collapsed")],
      ["Expand {Bucket-A} with its own chevron.",
       "Count the lines shown in {Bucket-A} before any more load (or compare them with the bucket's first 100 rows in a CSV export).",
       "Scroll further down.",
       "Collapse {Bucket-A} with its own chevron.",
       "Click the chevron button in the top-left header cell (Expand all).",
       "Count the lines shown in {Bucket-A} before any more load.",
       "Scroll further down."],
      ["Step 1: {Bucket-A} opens.", "Step 2: it shows its first 100 lines.",
       "Step 3: more lines load as you scroll, continuing the same order with no line repeated.",
       "Step 4: {Bucket-A} closes.",
       "Step 5: every bucket expands.", "Step 6: {Bucket-A} again shows its first 100 lines.", "Step 7: more lines load as you scroll."],
      ["S4-R4", "S1-R8"])

for code in GROUPED:
    r = R[code]; k = nk(); g = gname(code)
    tall = ("two buckets, {Bucket-A} and the next bucket below it, {Bucket-B}, each with more lines than fit on the screen" if r["group"] == "aging bucket"
            else f"two {r['parties']} next to each other in name order, {{{r['Party']}-A}} then {{{r['Party']}-B}}, each with more overdue {r['doc']}s than fit on the screen"
            + (" and with a phone number and a credit term on its customer card" if code == "ARC" else ""))
    A, B = ("{Bucket-A}", "{Bucket-B}") if r["group"] == "aging bucket" else (f"{{{r['Party']}-A}}", f"{{{r['Party']}-B}}")
    exl = ("For example: {Bucket-A} is \"31-60 days past due\" and {Bucket-B} is \"1-30 days past due\"." if r["group"] == "aging bucket"
           else f"For example: {{{r['Party']}-A}} is {ex(k, 'Long List A')[0]} and {{{r['Party']}-B}} is {ex(k, 'Long List B')[0]}, each with 25 overdue {r['doc']}s.")
    label = {"aging bucket": f"the bucket's name and count", "customer": f"{A}'s name and count, then \"Phone: \" and the phone number and \"Credit term: \" and the credit term",
             "vendor": f"{A}'s name and count"}[r["group"]]
    pre = [ADMIN()] + ([('Your role has the "View and Manage AP/AR Data" switch on.', None)] if code == "ARC" else []) + [
           (f"On today's date the report has {tall}.", exl), START(code, f", with the groups of {A} and {B} expanded")]
    # Rule 136 (22 Oct 2026): the label that stays at the left when the table scrolls sideways (S4-R7) is its own case ("b"); it reads
    # the same records and changes none.
    C(k, "S4", f"{r['n']}: the group row stays pinned under the headings", pre,
      [f"Scroll down slowly into {A}'s rows.",
       f"Keep scrolling until {B}'s row reaches the top.",
       f"Keep scrolling into {B}'s rows.",
       f"Scroll back up slowly until you are inside {A}'s rows again.",
       f"Scroll down fast through {A}'s and {B}'s rows.",
       f"Scroll fast back up through {B}'s and {A}'s rows."],
      [f"Step 1: {A}'s row stays pinned just under the column headings while its rows scroll beneath it; it shows the {g}'s chevron (pointing down) and its label: {label}; it shows no amounts (the {g}'s sums stay in its own subtotal row).",
       f"Step 2: {B}'s row pushes {A}'s row up and off and takes its place; only one group row is pinned at a time.",
       f"Step 3: {B}'s row stays pinned.",
       f"Step 4: the change reverses: {A}'s row comes back down into the pinned place.",
       "Step 5: at speed too, each pinned row is pushed up and replaced cleanly: it never covers the column headings or the Totals row at the bottom, and two group rows never overlap.",
       "Step 6: the same going back up: each pinned row is replaced cleanly, never covers the column headings or the Totals row, and two group rows never overlap."],
      ["S4-R6"] + TP.q("D21", "CHK3") + (["S9-R1", "S9-R2"] if code == "ARC" else []))
    C(k + "b", "S4", f"{r['n']}: group labels stay at the left when scrolling sideways",
      [ADMIN(), (f"On today's date the report has {tall}.", exl), START(code, f", with the groups of {A} and {B} expanded")],
      ["Make the browser window 1200 px wide.",
       "Scroll the table sideways to the right."],
      ["Step 1: the table now scrolls sideways (narrower than 1440 px).",
       f"Step 2: each group row's label ({A}'s label) stays visible at the left while the columns move."],
      ["S4-R7", "S8-R3"])

for code in ("ARC", "APU"):
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S4", f"{r['n']}: loading more by scrolling keeps groups open or closed",
      [ADMIN(), (f"More than 30 {r['parties']} have overdue {r['doc']}s on today's date; {{{P}-A}} is among the first 30 in name order.", f"For example: {{{P}-A}} is {ex(k, 'First Page')[0]}."),
       START(code, f", with only {{{P}-A}}'s group expanded")],
      [f"Scroll down until the next 30 {r['parties']} load.", "Scroll back up to the top of the table."],
      ["Step 1: the next groups load as you scroll; there are no page buttons.",
       f"Step 2: {{{P}-A}}'s group is still expanded and the other groups among the first 30 are still collapsed."],
      ["S4-R8", "S1-R8"])

# Rule 136 (22 Oct 2026): each pair case became one case per report; the first report keeps the pair's C-id, the second is "b".
for pair in (["ARD", "ARC"], ["APD", "APU"]):
    k = nk()
    for code, key in zip(pair, (k, k + "b")):
        nm = R[code]["n"]; g = gname(code)
        C(key, "S4", f"{nm} does not remember expanded groups",
          [ADMIN(), (f"The report has open documents on today's date in several {g}s.", None), START(code)],
          ["Note which groups are expanded.",
           f"Click the chevron on the first {g} row to change it.",
           "Open Reports > Finance > Sales By Customer.",
           f"Open Reports > Finance > {nm} again."],
          ["Step 1: note the report's opening state.", f"Step 2: that {g} changes (expands or collapses).",
           "Step 3: Sales By Customer opens.",
           f"Step 4: {nm} opens in the same state as in step 1, not the state you left: the change is not remembered."],
          ["S4-R9"], reports=[code])

for code in GROUPED:
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S4", f"{r['n']}: changing the date or a filter collapses every group",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has open {r['doc']}s at both locations, some 31 to 60 days past due, on today's and yesterday's date.",
                          f"For example: {{{P}-A}} is {ex(k, 'Collapse Me')[0]}."),
       START(code, ", with every group expanded (Expand all)")],
      ["Change the as-of date to yesterday.", "Click the top-left chevron button to expand every group.",
       f"In the {P} filter, tick {{{P}-A}}.", "Click the top-left chevron button to expand every group.",
       "In the Past due filter, tick \"31-60 days\".", "Click the top-left chevron button to expand every group.",
       "In the Location filter, untick {Location-B}."],
      ["Step 1: the report reloads for yesterday with every group collapsed.", "Step 2: every group expands.",
       f"Step 3: only {{{P}-A}}'s rows remain and every group is collapsed.", "Step 4: every group expands.",
       "Step 5: every group collapses.", "Step 6: every group expands.", "Step 7: every group collapses."],
      ["S4-N1"])

# Rule 136 (22 Oct 2026): one case per Summary; A/R Summary keeps the C-id, A/P Summary is "b".
k = nk()
for code, key in (("ARS", k), ("APS", k + "b")):
    C(key, "S4", f"{R[code]['n']} has no Collapse all button",
      [ADMIN(), ("The report has open documents on today's date.", None), START(code)],
      ["Look at the table's top-left header cell.", "Hover over that cell."],
      ["Step 1: there is no chevron button: the report has no groups.", "Step 2: no \"Collapse all\" or \"Expand all\" tooltip shows."],
      ["S4-N2"], reports=[code])
