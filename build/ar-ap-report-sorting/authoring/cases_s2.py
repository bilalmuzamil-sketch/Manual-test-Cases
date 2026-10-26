"""Story 2 — sort by clicking any column header: every column of every report (S2-R1), first / second / third click (S2-R2, S2-R3),
number order (S2-R4), groups never move (S2-R5), blanks (S2-R6), kept while on the report (S2-R7), not remembered (S2-R8),
expanded groups untouched (S2-R9), Vendor Name not clickable (S2-N1), all-equal column (S2-E1)."""
from ar_lib import C, ALL6, GROUPED
from common import *
from po_questions import QN
import tech_plan as TP

ORDER = {"S2": 0}
def nk():
    ORDER["S2"] += 1; return f"S2-{ORDER['S2']:02d}"

# ---------------- Summaries: name and Location, then the money columns ----------------
SUMMARY_MONEY = {  # open amounts per bucket for {X-A}, {X-B}, {X-C}; each column gives a different order
    "Current": (100, 300, 200), "1-30 Days": (200, 100, 300), "31-60 Days": (300, 200, 100),
    "61-90 Days": (250, 350, 150), "91 And Over": (350, 150, 250)}
TOT = tuple(sum(v[i] for v in SUMMARY_MONEY.values()) for i in range(3))   # (1200, 1100, 1000)

def order_desc(vals, ph):
    return [p for _, p in sorted(zip(vals, ph), key=lambda t: -t[0])]
def money(v): return f"${v:,.2f}"

for code in ["ARS", "APS"]:
    r = R[code]; P = r["Party"]; ph = [f"{{{P}-{x}}}" for x in "ABC"]
    k = nk(); w = ex(k, "Alder", "Birch", "Cedar")
    # Rule 136 (22 Oct 2026): split in two. Part 1 (this C-id) checks that the opening column reverses on its first click (S2-R3);
    # part b checks the Location header's three clicks and "Multiple" (S2-R2, S6-R4, S6-R5). Both read the same records and change none.
    C(k, "S2", f"{r['n']}: the {r['party']} name header reverses on its first click",
      [ADMIN(),
       (f"Three {r['parties']} have open {r['doc']}s on today's date: {ph[0]}, {ph[1]} and {ph[2]}; in name order they read {ph[0]}, {ph[1]}, {ph[2]}.",
        f"For example: {ph[0]} is {w[0]}, {ph[1]} is {w[1]} and {ph[2]} is {w[2]}."),
       START(code)],
      [f"Click the header of {namecol(code)}.",
       f"Click the header of {namecol(code)} again."],
      [f"Step 1: the list was already sorted by name, so this first click reverses it: Z to A, {ph[2]} above {ph[1]} above {ph[0]}.",
       f"Step 2: back to A to Z: {ph[0]}, {ph[1]}, {ph[2]}."],
      [f"S2-R1 {code}", "S2-R1", "S2-R2", "S2-R3"])
    C(k + "b", "S2", f"{r['n']}: the Location header sorts A to Z, then Z to A",
      [ADMIN(), TWO_LOC,
       (f"Three {r['parties']} have open {r['doc']}s on today's date: {ph[0]} only at {{Location-B}}, {ph[1]} at both locations and {ph[2]} only at {{Location-A}}. Both location names come after the word \"Multiple\" in A to Z order.",
        f"For example: {ph[0]} is {w[0]}, {ph[1]} is {w[1]} and {ph[2]} is {w[2]}."),
       START(code)],
      ["Click the \"Location\" header.",
       "Click the \"Location\" header again.",
       "Click the \"Location\" header a third time."],
      [f"Step 1: the list sorts by Location, A to Z, comparing the words as they read: {ph[1]} (\"Multiple\"), then {ph[2]} ({{Location-A}}), then {ph[0]} ({{Location-B}}).",
       f"Step 2: Z to A: {ph[0]}, {ph[2]}, {ph[1]}.",
       f"Step 3: the same as step 1, A to Z again. There is no unsorted state."],
      [f"S2-R1 {code}", "S2-R1", "S2-R2", "S6-R5", "S6-R4"])
    for cols in (["Current", "1-30 Days", "31-60 Days"], ["61-90 Days", "91 And Over", "Total"]):
        k = nk(); w = ex(k, "Alder", "Birch", "Cedar")
        steps, res = [], []
        for c_ in cols:
            vals = TOT if c_ == "Total" else SUMMARY_MONEY[c_]
            d = order_desc(vals, ph)
            amt = ", ".join(f"{p} {money(v)}" for p, v in sorted(zip(ph, vals), key=lambda t: -t[1]))
            steps += [f"Click the \"{c_}\" header.", f"Click the \"{c_}\" header again.", f"Click the \"{c_}\" header a third time."]
            res += [f"Step {len(res)+1}: the list sorts by {c_}, largest first: {amt}.",
                    f"Step {len(res)+2}: reversed, smallest first: {', '.join(reversed(d))}.",
                    f"Step {len(res)+3}: largest first again, as in step {len(res)+1}."]
        rows = "; ".join(f"{p}: " + ", ".join(f"{b} {money(SUMMARY_MONEY[b][i])}" for b in SUMMARY_MONEY) + f", Total {money(TOT[i])}" for i, p in enumerate(ph))
        C(k, "S2", f"{r['n']}: {', '.join(cols[:-1])} and {cols[-1]} sort largest first",
          [ADMIN(),
           (f"Three {r['parties']}, {ph[0]}, {ph[1]} and {ph[2]}, have open {r['doc']}s on today's date with these open amounts per column: {rows}.",
            f"For example: {ph[0]} is {w[0]}, {ph[1]} is {w[1]} and {ph[2]} is {w[2]}."),
           START(code)],
          steps, [s.replace("Step ", "Step ", 1) for s in res],
          [f"S2-R1 {code}", "S2-R1", "S2-R2"])

# ---------------- Grouped reports: text, dates, money, number ----------------
GROUP_AT = {"ARD": 'the "1-30 days past due" bucket', "APD": 'the "1-30 days past due" bucket',
            "ARC": "{Customer-A}'s group", "APU": "{Vendor-A}'s group"}
def group_pre(code, k):
    r = R[code]; P = r["Party"]
    if r["group"] == "aging bucket": return None
    return (f"{P} {{{P}-A}} has overdue {r['doc']}s on today's date.", f"For example: {{{P}-A}} is {ex(k, 'Fleet')[0]}.")

def doc_pre(code, k):
    """Three documents in one group: Date, Due Date, Amount and Open Balance each give a different order."""
    r = R[code]; P = r["Party"]; g = GROUP_AT[code]
    if r["group"] == "aging bucket":
        who = f" for {{{P}-C}}, {{{P}-A}} and {{{P}-B}} in that order (in name order these {r['parties']} read A, B, C)"
        exn = " " + ", ".join(f"{{{P}-{x}}} is {n}" for x, n in zip("ABC", ex(k, "Alder", "Birch", "Cedar"))) + ";"
    else:
        who, exn = "", ""
    return (f"In {g} there are three open {r['doc']}s, {{Document-A}}, {{Document-B}} and {{Document-C}}{who}: {{Document-A}} is dated 40 days ago, due 10 days ago, amount $300.00, open $50.00; "
            f"{{Document-B}} is dated 20 days ago, due 20 days ago, amount $100.00, open $100.00; {{Document-C}} is dated 35 days ago, due 5 days ago, amount $200.00, open $150.00.",
            "For example:" + exn + " {Document-A} is S1-101, {Document-B} is S1-99 and {Document-C} is S1-100 (the app assigns the real numbers; the dates and amounts are the ones that matter).")

def defined_parties(code):
    return []

def GSTART(code):
    g = GROUP_AT[code]
    return START(code, f", with {g} expanded")

for code in GROUPED:
    r = R[code]; P = r["Party"]; g = GROUP_AT[code]; ins = inside(code)
    gp = group_pre(code, "x")
    # ---- text columns
    k = nk()
    steps = ["Click the \"Location\" header.", "Click the \"Location\" header again.", "Click the \"Location\" header a third time.",
             f"Click the \"{r['text'][1]}\" header.", f"Click the \"{r['text'][1]}\" header again."]
    res = [f"Step 1: rows {ins} sort by Location, A to Z: in {g} the {{Location-A}} rows come before the {{Location-B}} row.",
           "Step 2: Z to A: the {Location-B} row comes first.", "Step 3: A to Z again, as in step 1. There is no unsorted state.",
           f"Step 4: rows {ins} sort by {r['text'][1]}, A to Z: read the {r['text'][1]} words top to bottom in {g}; they are in alphabetical order.",
           "Step 5: Z to A: the same words in reverse alphabetical order."]
    # Rule 136 (22 Oct 2026): the opening column's first click (S2-R3, Detail reports) and the Vendor Name header that cannot be clicked
    # (S2-N1, A/P Unpaid Invoices) are their own cases ("b"); before the split the opening-column click came after the Location and
    # Transaction type sorts, when the report was no longer sorted by the opening column. Part 1 keeps the Location and text-column sorts.
    pre = [ADMIN(), TWO_LOC] + ([group_pre(code, k)] if r["group"] != "aging bucket" else [])
    exn = f"For example: {{{P}-A}} is {ex(k, 'Alder')[0]}, {{{P}-B}} is {ex(k, 'Birch')[0]} and {{{P}-C}} is {ex(k, 'Cedar')[0]}"
    kind = f"{{Document-A}} and {{Document-B}} are {r['doc']}s and {{Document-C}} is a {'credit memo' if r['fam'] == 'A/R' else 'vendor credit'}"
    if r["group"] == "aging bucket":
        pre.append((f"In the \"1-30 days past due\" bucket there are three open documents: {{Document-A}} for {{{P}-C}} at {{Location-B}}, and {{Document-B}} for {{{P}-A}} and {{Document-C}} for {{{P}-B}} at {{Location-A}}; one of the three is a different transaction type from the others.",
                    f"{exn}; {kind}."))
    else:
        pre.append((f"In {g} there are three open documents: {{Document-A}} at {{Location-B}}, and {{Document-B}} and {{Document-C}} at {{Location-A}}; one of the three is a different transaction type from the others.",
                    f"For example: {kind}."))
    pre.append(GSTART(code))
    C(k, "S2", f"{r['n']}: the text column headers sort A to Z, then Z to A", pre, steps, res,
      [f"S2-R1 {code}", "S2-R1", "S2-R2", "S2-R5"])
    if r["group"] == "aging bucket":
        C(k + "b", "S2", f"{r['n']}: the {r['opened']} header reverses on its first click",
          [ADMIN(),
           (f"In the \"1-30 days past due\" bucket there are three open documents: {{Document-A}} for {{{P}-C}}, {{Document-B}} for {{{P}-A}} and {{Document-C}} for {{{P}-B}}; in name order the {r['parties']} read {{{P}-A}}, {{{P}-B}}, {{{P}-C}}.",
            f"{exn}."),
           GSTART(code)],
          [f"Click the \"{r['opened']}\" header.", f"Click the \"{r['opened']}\" header again."],
          [f"Step 1: the report was already sorted by {r['opened']}, so this first click reverses it: in {g}, {{Document-A}} ({{{P}-C}}) first, then {{Document-C}} ({{{P}-B}}), then {{Document-B}} ({{{P}-A}}).",
           f"Step 2: A to Z again: {{Document-B}}, {{Document-C}}, {{Document-A}}."],
          [f"S2-R1 {code}", "S2-R1", "S2-R2", "S2-R3", "S2-R5"])
    if code == "APU":
        C(k + "b", "S2", f"{r['n']}: the Vendor Name header cannot be clicked",
          [ADMIN(), group_pre(code, k),
           ("{Vendor-A} has at least two open documents with different dates.", None),
           GSTART(code)],
          ["Click the \"Vendor Name\" header.", "Hover over the \"Vendor Name\" header."],
          ["Step 1: nothing happens: the rows keep their opening order, oldest date first.",
           "Step 2: the header does not show it can be clicked (no pointer change, no sort mark)."],
          ["S2-N1", "S2-R1", "S1-R6"])
    # ---- date columns
    k = nk()
    if r["opened"] == "Date":
        # Rule 136 (22 Oct 2026): the Date header's first click (S2-R3, S1-R6) and the Due date header (S2-R2) are two cases; both read
        # the same three documents and change nothing.
        dpre = [ADMIN()] + defined_parties(code) + [group_pre(code, k), doc_pre(code, k), GSTART(code)]
        C(k, "S2", f"{r['n']}: the Date header reverses on its first click", dpre,
          ["Click the \"Date\" header.", "Click the \"Date\" header again."],
          ["Step 1: the report was already sorted by Date (oldest first), so this first click reverses it: newest first, {Document-B}, {Document-C}, {Document-A}.",
           "Step 2: oldest first again: {Document-A}, {Document-C}, {Document-B}."],
          [f"S2-R1 {code}", "S2-R1", "S2-R2", "S2-R3", "S1-R6", "S2-R5"])
        C(k + "b", "S2", f"{r['n']}: {r['dates'][1]} sorts oldest first, then newest first", dpre,
          [f"Click the \"{r['dates'][1]}\" header.", f"Click the \"{r['dates'][1]}\" header again.", f"Click the \"{r['dates'][1]}\" header a third time."],
          [f"Step 1: rows {ins} sort by {r['dates'][1]}, oldest first: {{Document-B}}, {{Document-A}}, {{Document-C}}.",
           "Step 2: newest first: {Document-C}, {Document-A}, {Document-B}.",
           "Step 3: oldest first again, as in step 1. There is no unsorted state."],
          [f"S2-R1 {code}", "S2-R1", "S2-R2", "S2-R5"])
    else:
        steps = ["Click the \"Date\" header.", "Click the \"Date\" header again.", "Click the \"Date\" header a third time.",
                 f"Click the \"{r['dates'][1]}\" header.", f"Click the \"{r['dates'][1]}\" header again."]
        res = [f"Step 1: rows {ins} sort by Date, oldest first: in {g}, {{Document-A}}, {{Document-C}}, {{Document-B}}.",
               "Step 2: newest first: {Document-B}, {Document-C}, {Document-A}.", "Step 3: oldest first again, as in step 1.",
               f"Step 4: rows {ins} sort by {r['dates'][1]}, oldest first: {{Document-B}}, {{Document-A}}, {{Document-C}}.",
               "Step 5: newest first: {Document-C}, {Document-A}, {Document-B}."]
        q = [f"S2-R1 {code}", "S2-R1", "S2-R2"]
        C(k, "S2", f"{r['n']}: Date and {r['dates'][1]} sort oldest first, then newest first",
          [ADMIN()] + defined_parties(code) + ([group_pre(code, k)] if r["group"] != "aging bucket" else []) + [doc_pre(code, k), GSTART(code)],
          steps, res, q + ["S2-R5"])
    # ---- money (and Past due) columns
    k = nk()
    steps, res = [], []
    if r["past"]:
        steps += [f"Click the \"{r['past']}\" header.", f"Click the \"{r['past']}\" header again."]
        res += [f"Step 1: rows {ins} sort by {r['past']}, largest first: {{Document-B}} (20 days), {{Document-A}} (10 days), {{Document-C}} (5 days).",
                "Step 2: smallest first: {Document-C}, {Document-A}, {Document-B}."]
    n0 = len(steps)
    steps += ["Click the \"Amount\" header.", "Click the \"Amount\" header again.",
              f"Click the \"{r['headline']}\" header.", f"Click the \"{r['headline']}\" header again.", f"Click the \"{r['headline']}\" header a third time."]
    res += [f"Step {n0+1}: rows {ins} sort by Amount, largest first: {{Document-A}} $300.00, {{Document-C}} $200.00, {{Document-B}} $100.00.",
            f"Step {n0+2}: smallest first: {{Document-B}}, {{Document-C}}, {{Document-A}}.",
            f"Step {n0+3}: rows {ins} sort by {r['headline']}, largest first: {{Document-C}} $150.00, {{Document-B}} $100.00, {{Document-A}} $50.00.",
            f"Step {n0+4}: smallest first: {{Document-A}}, {{Document-B}}, {{Document-C}}.",
            f"Step {n0+5}: largest first again, as in step {n0+3}."]
    C(k, "S2", f"{r['n']}: money{' and ' + r['past'] if r['past'] else ''} headers sort largest first",
      [ADMIN()] + defined_parties(code) + ([group_pre(code, k)] if r["group"] != "aging bucket" else []) + [doc_pre(code, k), GSTART(code)],
      steps, res, [f"S2-R1 {code}", "S2-R1", "S2-R2", "S2-R5"])
    # ---- number column and tie-break
    k = nk(); num = r["num"]
    C(k, "S2", f"{r['n']}: {num} sorts by number value, and ties go by number",
      [ADMIN()] + defined_parties(code) + ([group_pre(code, k)] if r["group"] != "aging bucket" else []) +
      [(f"In {g} there are three open {r['doc']}s with the same due date, {{Document-A}}, {{Document-B}} and {{Document-C}}, whose numbers have different digit counts, so that in number order they read {{Document-A}}, {{Document-B}}, {{Document-C}} but in letter-by-letter order {{Document-B}}, {{Document-C}}, {{Document-A}}.",
        "For example: {Document-A} is S1-99, {Document-B} is S1-100 and {Document-C} is S1-101 (the app assigns the real numbers)." + ""),
       GSTART(code)],
      [f"Click the \"{num}\" header.", f"Click the \"{num}\" header again.", f"Click the \"{r['dates'][1]}\" header.",
       f"Click the \"{r['dates'][1]}\" header again."],
      [f"Step 1: rows {ins} sort by {num} as numbers, never letter by letter, smallest number first: {{Document-A}}, {{Document-B}}, {{Document-C}}.",
       f"Step 2: largest number first: {{Document-C}}, {{Document-B}}, {{Document-A}}, still in number order.",
       f"Step 3: rows {ins} sort by {r['dates'][1]}, oldest first; {{Document-A}}, {{Document-B}} and {{Document-C}} tie on {r['dates'][1]}, so they are ordered by number, smallest first: {{Document-A}}, {{Document-B}}, {{Document-C}}.",
       f"Step 4: the {r['dates'][1]} sort reverses, newest first; the three still tie and keep the same order, smallest number first: {{Document-A}}, {{Document-B}}, {{Document-C}} (reversing a sort reverses the sorted column only)."],
      ["S2-R4", f"S2-R1 {code}", "S2-R2"])

# ---------------- blanks ----------------
k = nk()
C(k, "S2", "A/P Unpaid Invoices: a vendor credit stays at the bottom when Due Date is sorted",
  [ADMIN(), ("Vendor {Vendor-A} has two overdue bills, {Bill-A} and {Bill-B}, and one unused vendor credit, {Vendor-credit-A}, on today's date.",
             f"For example: {{Vendor-A}} is {ex(k, 'Parts Co')[0]}; {{Bill-A}} is due 10 days ago and {{Bill-B}} 20 days ago."),
   START("APU")],
  ["Expand {Vendor-A}'s group.", "Click the \"Due Date\" header.",
   "Click the \"Due Date\" header again.", "Click the \"Past Due\" header.", "Click the \"Past Due\" header again."],
  ["Step 1: the group shows the two bills and the vendor credit; {Vendor-credit-A}'s Due Date and Past Due cells hold no date or number (the screen draws a dash, \"—\"): a vendor credit has no due date and no Past Due here.",
   "Step 2: {Bill-B}, then {Bill-A}, then {Vendor-credit-A} at the bottom of the group.",
   "Step 3: {Bill-A}, then {Bill-B}, and {Vendor-credit-A} still at the bottom.",
   "Step 4: {Bill-B} (20 days), then {Bill-A} (10 days), then {Vendor-credit-A} at the bottom.",
   "Step 5: {Bill-A}, then {Bill-B}, and {Vendor-credit-A} still at the bottom."],
  ["S2-R6", "S2-R2"])
k = nk()
C(k, "S2", "A/P Detail: a vendor credit shows its own date as its Due Date",
  [ADMIN(), ("Vendor {Vendor-A} has one unused vendor credit, {Vendor-credit-A}, on today's date.",
             f"For example: {{Vendor-A}} is {ex(k, 'Parts Co')[0]}; {{Vendor-credit-A}} is dated 12 days ago."),
   START("APD")],
  ["Expand the bucket that holds {Vendor-credit-A}.", "Click the \"Due Date\" header.", "Click the \"Due Date\" header again."],
  ["Step 1: the bucket opens and lists {Vendor-credit-A}; its Due Date is not blank: it shows the same date as the Date column, as today.",
   "Step 2: the rows sort by Due Date, oldest first, and {Vendor-credit-A} sorts by that date like any other row; it is not held at the bottom.",
   "Step 3: the order reverses, newest first, and {Vendor-credit-A} still sorts by its date; it is not held at the bottom."],
  ["S2-R6"])

# ---------------- groups never move, expanded groups untouched ----------------
for code in GROUPED:
    r = R[code]; k = nk()
    two = ('Two buckets are expanded: "31-60 days past due" and "1-30 days past due"; the other three are collapsed.' if r["group"] == "aging bucket"
           else f"Three {r['party']} groups, {{{r['Party']}-A}}, {{{r['Party']}-B}} and {{{r['Party']}-C}}, are listed in that name order; {{{r['Party']}-A}} and {{{r['Party']}-C}} are expanded and {{{r['Party']}-B}} is collapsed.")
    pre = [ADMIN(), (f"The report has open {docs(code)} in several {'buckets' if r['group'] == 'aging bucket' else r['party'] + ' groups'} on today's date.",
                     None if r["group"] == "aging bucket" else f"For example: {{{r['Party']}-A}} is {ex(k, 'Alder')[0]}, {{{r['Party']}-B}} is {ex(k, 'Birch')[0]} and {{{r['Party']}-C}} is {ex(k, 'Cedar')[0]}."),
           START(code, "; " + two[0].lower() + two[1:].rstrip("."))]
    if r["group"] != "aging bucket":
        pre[1] = (f"Three {r['parties']}, {{{r['Party']}-A}}, {{{r['Party']}-B}} and {{{r['Party']}-C}}, have overdue {r['doc']}s on today's date; in name order they read A, B, C.", pre[1][1])
        pre[2] = START(code, f"; {{{r['Party']}-A}}'s and {{{r['Party']}-C}}'s groups are expanded and {{{r['Party']}-B}}'s is collapsed")
    order = ("the five buckets keep their fixed order (91 or more, 61-90, 31-60, 1-30, Current)" if r["group"] == "aging bucket"
             else f"the groups keep their name order, {{{r['Party']}-A}}, {{{r['Party']}-B}}, {{{r['Party']}-C}}")
    still = ('"31-60 days past due" and "1-30 days past due" are still expanded and the others still collapsed' if r["group"] == "aging bucket"
             else f"{{{r['Party']}-A}} and {{{r['Party']}-C}} are still expanded and {{{r['Party']}-B}} still collapsed")
    C(k, "S2", f"{r['n']}: sorting moves rows, never groups, and keeps groups open",
      pre,
      [f"Click the \"{r['headline']}\" header.", f"Click the \"{r['headline']}\" header again.", "Click the \"Date\" header."],
      [f"Step 1: rows re-sort {inside(code)}, largest first; {order}.",
       f"Step 2: rows re-sort smallest first; {order}.",
       f"Step 3: rows re-sort by Date; {order}; {still}: re-sorting never expands or collapses a group."],
      ["S2-R5", "S2-R9", "S4-R8"] + (["WC-8"] if code in ("ARC", "APU") else []))

# ---------------- sort kept while on the report ----------------
for code in ALL6:
    r = R[code]; k = nk(); grouped = r["group"] is not None
    sortcol = r["headline"]
    pre = [ADMIN(), TWO_LOC,
           (f"The report has more than 30 {r['parties']} with open documents on today's date and on yesterday's date, at both locations." if not grouped or code in ("ARC", "APU")
            else f"The report has open documents at both locations on today's and yesterday's date, with more than 100 lines in at least one bucket.", None),
           (f"{r['Party']} {{{r['Party']}-A}} has open documents at both locations.", f"For example: {{{r['Party']}-A}} is {ex(k, 'Kept Sort')[0]}."),
           START(code)]
    paged = code in ("ARS", "APS", "ARC", "APU")
    # one action per step (22 Oct 2026): "Expand the largest bucket and scroll down" and "Open the filter and tick" are two steps each
    steps = ([f"Click the \"{sortcol}\" header once.",
              "Change the as-of date to yesterday."]
             + ([f"Scroll down until the next 30 {r['parties']} load."] if paged else ["Expand the largest bucket.", "Scroll down inside it until more lines load."])
             + [f"Open the {r['Party']} filter.",
                f"Tick {{{r['Party']}-A}}.",
                "In the Location filter, untick {Location-B}."])
    gx = " (expand a group to see them: a filter change collapses every group)" if grouped else ""
    res = ([f"the rows sort by {sortcol}, largest first, and the header shows it.",
            f"the report reloads for yesterday and is still sorted by {sortcol}, largest first."]
           + ([] if paged else ["the bucket opens and shows its rows."])
           + [f"the new rows are still sorted by {sortcol}, largest first.",
              f"the {r['Party']} menu opens.",
              f"only {{{r['Party']}-A}}'s rows remain{gx}, still sorted by {sortcol}, largest first.",
              f"only {{Location-A}} rows remain{gx}, still sorted by {sortcol}, largest first, and \"{sortcol}\" is still marked as the sorted column."])
    res = [f"Step {i}: {x}" for i, x in enumerate(res, 1)]
    C(k, "S2", f"{r['n']}: the sort stays while changing date, scrolling and filters", pre, steps, res,
      ["S2-R7", "S2-R2"] + (["S1-R8"] if paged else []) + (TP.q("P3-walk") if code in ("ARC", "APU") else []))

# ---------------- the Past due filter and the sort (PRD v9 S2-R7, from Chris Ward's answer 6; released 26 Oct 2026) ----------------
k = nk()
C(k, "S2", "A/R Collection: changing the Past due filter keeps the sort",
  [ADMIN(), ("Customer {Customer-A} has overdue invoices on today's date: one 1 to 30 days past due, and two 31 to 60 days past due with different open balances.",
             f"For example: {{Customer-A}} is {ex(k, 'Past Due Sort')[0]}."),
   START("ARC", ", with {Customer-A}'s group expanded")],
  ["Click the \"Open Balance\" header once.", "In the Past due filter, tick \"31-60 days\".", "Expand {Customer-A}'s group."],
  ["Step 1: the rows in {Customer-A}'s group sort by Open Balance, largest first, and \"Open Balance\" is marked as the sorted column.", "Step 2: the report reloads with only the invoices 31 to 60 days past due (and any credits) left; every group is collapsed.",
   "Step 3: the rows in the group are still sorted by Open Balance, largest first, and \"Open Balance\" is still marked as the sorted column."],
  ["S2-R7", "S5-R16", "S4-N1"])

# ---------------- sort not remembered between visits ----------------
# Rule 136 (22 Oct 2026): each pair case became one case per report; the first report keeps the pair's C-id, the second is "b".
for pair in (["ARS", "ARD"], ["ARC", "APS"], ["APD", "APU"]):
    k = nk()
    for code, key in zip(pair, (k, k + "b")):
        r = R[code]
        op = namecol(code) if r["opened"] == "name" else f"\"{r['opened']}\""
        C(key, "S2", f"{r['n']} forgets the sort between visits",
          [ADMIN(), (f"The report has open documents on today's date.", None), START(code)],
          [f"Click the \"{r['headline']}\" header.", "Open Reports > Finance > Sales By Customer.", f"Open Reports > Finance > {r['n']} again."],
          [f"Step 1: the rows sort by {r['headline']}, largest first.", "Step 2: Sales By Customer opens.",
           f"Step 3: {r['n']} opens in its opening order again, with {op} marked as the sorted column; the {r['headline']} sort is not remembered."],
          ["S2-R8", "S1-R7"], reports=[code])

# ---------------- a column where every row is the same ----------------
k = nk()
C(k, "S2", "A/R Collection: a column where every row is the same does not reorder",
  [ADMIN(), TWO_LOC,
   ("Customer {Customer-A} has three overdue invoices on today's date, {Invoice-A}, {Invoice-B} and {Invoice-C}, all at {Location-A}; in number order they read A, B, C.",
    f"For example: {{Customer-A}} is {ex(k, 'Same Place')[0]}; {{Invoice-A}} is S1-99, {{Invoice-B}} S1-100 and {{Invoice-C}} S1-101."),
   START("ARC")],
  ["Expand {Customer-A}'s group.", "Click the \"Location\" header."],
  ["Step 1: the group shows the three invoices, each with Location {Location-A}.",
   "Step 2: the Location column is marked as sorted, but nothing visibly moves inside the group: every row has the same value, and the three invoices stay ordered by number: {Invoice-A}, {Invoice-B}, {Invoice-C}."],
  ["S2-E1", "S2-R4"])

# ---------------- Title Case headings on screen, in the PDF and in the CSV (PRD v9 S2-R4a and S3-R8b, from Chris Ward's answers 4 and 8; new 26 Oct 2026) ----------------
CSV_EXTRA = {"ARD": "an \"Aging Bucket\" column for the bucket name (\"Customer Full Name\" is already among the headings)",
             "ARC": "a \"Customer\" column for the customer's name, with \"Phone\" right after it",
             "APD": "an \"Aging Bucket\" column for the bucket name (\"Vendor Name\" is already among the headings)"}
for code in ("ARD", "ARC", "APD"):
    r = R[code]; k = nk()
    heads = ", ".join(f"\"{c}\"" for c in r["cols"])
    C(k, "S2", f"{r['n']}: column headings are in Title Case on screen, PDF and CSV",
      [ADMIN(), TWO_LOC, ("The report has open documents at both locations on today's date.", None),
       START(code, ", with every group expanded (Expand all)")],
      ["Read the column headings, letter for letter, capitals included.",
       "Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF and read its column headings.",
       "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV in a plain text editor and read its column heading row."],
      [f"Step 1: {heads}" + (" (the chevron button sits before \"Date\")" if r["group"] else "") + ": every word starts with a capital letter" + (", as on the A/P reports" if r["fam"] == "A/R" else "") + ".",
       "Step 2: the PDF downloads.",
       "Step 3: the PDF's column headings read exactly as on screen, capitals included.",
       "Step 4: the CSV downloads.",
       f"Step 5: the heading row (right after the \"As of: \" and \"Locations: All locations\" rows) holds the same headings, letter for letter as on screen, and {CSV_EXTRA[code]}."],
      ["S2-R4a", f"S2-R1 {code}", "S3-R8b"] + (["WC-11"] if r["fam"] == "A/R" else []))
