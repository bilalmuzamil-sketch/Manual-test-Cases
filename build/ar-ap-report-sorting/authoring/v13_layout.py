"""Currency pass of 14 Nov 2026: PRD version 11 (5 Nov 2026) -> version 13 (12 Nov 2026 Milos Vasic v12; 13 Nov 2026 Chris Ward v13).
QA lead, 14 Nov 2026: "Named set (Recommended)": rewrite top to bottom (Rule 134) every case that quotes or depends on a requirement changed
between v11 and v13; add cases for the two new requirements (S3-R7b, S5-R10b); re-stamp every other case to v13 only after a script proves
its quotes are word for word in v13. Record: currency-2026-11-14/ (PRD-DIFF-v11-to-v13.txt, AFFECTED.json, PASS-REPORT.md).

Changed requirements (the diff, read in full): S1-R8 (an open customer's or vendor's documents may arrive in one request; the rule sets only how
many are shown at a time), S4-R1 (the header chevron is blue, like the group chevrons), S5-E3 (a new as-of date whose list holds one location
hides the chip), S8-R3 (on A/P Unpaid Invoices a vendor's group row does not wrap; a very long vendor name can make the table scroll sideways,
78 characters still fit). New: S3-R7b (the grouped PDFs close each bucket, customer or vendor with "Total for <name>", never "Subtotal"),
S5-R10b (any as-of date, including a day after today).

Applied last: ar_lib.C (MODEL, Q_ADD, Q_DEL, NOTE, MARKER) and pattern.pattern (LAYOUT, after the v11 layer). Every substitution must find its
target (pattern.apply_layout raises otherwise). BUILD holds a case's own Rule 54 build line where the rewrite added a result no build has shown."""

DEFER = "AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026"
_PART = "Partly checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026; not yet seen on that build: "
_ADDED = " (added 14 Nov 2026 for PRD version 13)."

MODEL, Q_ADD, Q_DEL, NOTE, MARKER, LAYOUT, BUILD = {}, {}, {}, {}, {}, {}, {}
# The rewrite set (currency-2026-11-14/AFFECTED.json): every case quoting S1-R8, S4-R1, S5-E3 or S8-R3 (72) plus S5-37, which said the opposite of
# S5-R10b. Rewritten top to bottom (Rule 134): each also cites the design as last read (version of 5 Nov 2026, read 10 Nov 2026).
REWRITE = ['D-01', 'D-01b', 'D-02', 'D-03', 'D-04', 'D-04b', 'D-05', 'D-06', 'D-07', 'D-07b', 'D-08', 'D-09', 'D-10', 'D-10b', 'D-11', 'D-12', 'D-13', 'D-13b', 'D-14', 'D-15', 'D-16', 'D-16b', 'D-17', 'D-18', 'D-25', 'D-26', 'D-27', 'D-28', 'D-47', 'D-48', 'D-50', 'D-52', 'D-56', 'D-58', 'D-59', 'D-61', 'D-62', 'DATA-01', 'DATA-01b', 'DATA-02', 'DATA-02b', 'DATA-03', 'DATA-03b', 'DATA-04', 'DATA-04b', 'DATA-05', 'DATA-06', 'DATA-27', 'S1-21', 'S1-22', 'S2-29', 'S2-31', 'S2-32', 'S2-34', 'S4-01', 'S4-02', 'S4-03', 'S4-04', 'S4-05', 'S4-06', 'S4-07', 'S4-08', 'S4-09b', 'S4-10b', 'S4-11b', 'S4-12b', 'S4-13', 'S4-14', 'S5-18', 'S5-37', 'S5-40', 'S5-41', 'S5-42']


# ---- S1-R8 (v12): "this rule sets only how many are shown at a time": the tester's words say "show", not "load" -------------------------
for k, kind in (("S1-21", "invoices"), ("S1-22", "bills")):
    LAYOUT[k] = dict(title_sub=[("loads 100 at a time", "shows 100 at a time")],
                     step_sub=[(f"Keep scrolling until no more {kind} load.", f"Keep scrolling until no more {kind} appear.")],
                     res_sub=[(f"The next {kind} load under the first 100, up to 100 more each time.",
                               f"As you scroll, the next {kind} show under the first 100, up to 100 more each time.")])
LAYOUT["DATA-27"] = dict(res_sub=[("The 101st bill loads, and every bill is listed once.", "The 101st bill shows, and every bill is listed once.")])

# ---- S4-R1 (v12): the header chevron is blue, the same as each group's own chevron (S4-R5); DD-08 records the design's grey chevron ---------
_BLUE = "One chevron button, the design system's chevron icon, in blue, in the top-left header cell, pointing right (every group collapsed)."
for k, row in (("D-25", "bucket"), ("D-26", "customer group"), ("D-27", "bucket"), ("D-28", "vendor group")):
    LAYOUT[k] = dict(res_sub=[("One chevron button, the design system's chevron icon, in the top-left header cell, pointing right (every group collapsed).", _BLUE),
                              (f"Every {row} row shows the same chevron, pointing right when closed.",
                               f"Every {row} row shows the same chevron in the same blue as the header chevron, pointing right when closed.")])
    BUILD[k] = _PART + "the header chevron's blue colour" + _ADDED
LAYOUT["D-52"] = dict(res_sub=[("A grey chevron pointing right in the top-left header cell, then",
                                "A blue chevron pointing right in the top-left header cell, the same blue as the bucket rows' chevrons, then")])
LAYOUT["D-56"] = dict(res_sub=[("the header row shows the chevron, then the columns",
                                "the header row shows the chevron, in the same blue as the group rows' chevrons, then the columns")])
BUILD["D-56"] = _PART + "the header chevron's blue colour" + _ADDED
LAYOUT["D-59"] = dict(res_sub=[("It points right: every group is closed.",
                                "It points right: every group is closed. It is blue, the same blue as the group rows' chevrons.")])
BUILD["D-59"] = _PART + "the header chevron's blue colour" + _ADDED

# ---- S8-R3 (v12): on A/P Unpaid Invoices a vendor's group row does not wrap; 78 characters still fit at 1440 px ----------------------------
# Line 9 of the design checklist (skill 21 section 6d, 13 Nov 2026): D-16 adds a vendor name with & " ' < > (the 78-character no-space name is D-89).
_LEN = "with a long name of 41 to 78 characters, with spaces"
MODEL["D-16"] = "append-step"
LAYOUT["D-16"] = dict(
    pre_sub=[("Have a vendor, vendor A, with a long name (more than 40 characters) and open documents",
              f"Have a vendor, vendor A, {_LEN}, and open documents")],
    pre_add=["Create, for this test, a second vendor, vendor B, whose name includes each of these characters: & \" ' < >, and give them an unpaid bill dated today."],
    res_sub=[("The long name and a long Transaction Type wrap onto a second line.",
              "In each bill row, the long vendor name and a long Transaction Type wrap onto a second line.")],
    res_add={5: ["Vendor A's group row shows the whole name on one line: it does not wrap."]},
    steps_add=["Look at vendor B's group row and bill row."],
    results_add=[["Vendor B's name shows exactly as typed, with its & \" ' < > characters, in its group row and in the bill row's \"Vendor Name\" cell.",
                  "Nothing in vendor B's rows overlaps or is cut off."]])
NOTE["D-16"] = ("Where the tech plan differs: the tech plan (21 Oct 2026) says Location wraps only on A/P Detail; PRD version 13 (its layout rules, "
                "13 Nov 2026) lets it wrap on A/P Unpaid Invoices too, and keeps a vendor's group row there on one line. This case follows the PRD.")
BUILD["D-16"] = _PART + "the vendor's group row on one line, and a vendor name with & \" ' < >" + _ADDED
LAYOUT["D-18"] = dict(pre_sub=[("Have a vendor with a long name (more than 40 characters) and open documents", "Have a vendor with a long name of 41 to 78 characters and open documents")])
LAYOUT["D-58"] = dict(pre_sub=[("at your location, a long name, and an unused vendor credit A", "at your location, a long name of 41 to 78 characters, and an unused vendor credit A")],
                      res_sub=[("Compared with the pictures, the vendor name wraps onto a second line.",
                                "Compared with the pictures, the vendor name wraps onto a second line in each bill row, while vendor A's pinned group row shows the whole name on one line.")])
BUILD["D-58"] = _PART + "the vendor's pinned group row on one line" + _ADDED
LAYOUT["D-62"] = dict(pre_sub=[("Make sure vendor A and vendor B both have long names.", "Make sure vendor A and vendor B both have long names of 41 to 78 characters.")],
                      res_add={5: ["Each group row shows the vendor's whole name on one line: it does not wrap."]})
BUILD["D-62"] = _PART + "the vendors' group rows on one line" + _ADDED

# ---- S5-R10b (v13): any as-of date, including a day after today. S5-37 said the opposite (tech plan D20): rewritten top to bottom ------------
MODEL["S5-37"] = dict(
    title="A/P Detail: a date after today ages a bill to that day",
    pre=['Sign in as an Admin user (the "Admin" role).',
         "Create, for this test, a vendor with one unpaid bill, bill A, whose due date is today.",
         "Use a desktop browser window 1440 px wide.",
         "Open A/P Detail (Reports, then \"A/P Aging Detail\" under ACCOUNTS PAYABLE in the left menu).",
         "Leave the report with only that vendor ticked in the Vendor filter, so bill A is the only bill listed."],
    steps=['Expand the "Current" bucket.',
           'Click the date chip ("As of: " and today\'s date).',
           "Pick the day 10 days after today in the calendar.",
           'Expand the "1-30 days past due" bucket.'],
    results=[["Bill A is listed in \"Current\", with Past Due 0: it is due today."],
             ["A calendar opens with today's date selected.", "Days after today can be picked."],
             ["The chip reads \"As of: \" and the day 10 days after today.", "The report reloads for that day."],
             ["Bill A is listed here, with Past Due 10: the days from its due date to the picked day.", "Bill A is no longer in \"Current\"."]])
Q_DEL["S5-37"] = ["S5-R1", "KD-REUSE"]
Q_ADD["S5-37"] = ["S5-R10b", "S1-R5a"]
NOTE["S5-37"] = ("Where the tech plan differs: the tech plan (21 Oct 2026, decision D20) caps the as-of date at today; PRD version 13 (13 Nov 2026) "
                 "lets any day be picked, including a day after today, as before this release. This case follows the PRD.")
MARKER["S5-37"] = DEFER
BUILD["S5-37"] = ("Not yet checked against a build in this form: rewritten 14 Nov 2026 for PRD version 13 (it checked that a day after today could not be "
                  "picked); that earlier form was last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.")


def apply(c, out):
    """After the v11 layer: the substitutions above, then the additions (pre_add, res_add, steps_add/results_add), then MODEL full texts."""
    import pattern as PT
    k = c["key"]
    if isinstance(MODEL.get(k), dict):
        m = MODEL[k]
        return dict(out, title=m["title"], pre=list(m["pre"]), steps=list(m["steps"]), results=[list(r) for r in m["results"]])
    L = LAYOUT.get(k)
    if not L: return out
    base = {kk: v for kk, v in L.items() if kk not in ("pre_add", "res_add", "steps_add", "results_add")}
    out = PT.apply_layout(c, out, base) if base else dict(out)
    out = dict(out, pre=list(out["pre"]) + list(L.get("pre_add", [])), results=[list(r) for r in out["results"]], steps=list(out["steps"]))
    for n, bs in L.get("res_add", {}).items(): out["results"][n - 1] += list(bs)
    add, radd = list(L.get("steps_add", [])), [list(r) for r in L.get("results_add", [])]
    if add:
        n = len(add)
        if out["steps"][-n:] == add: out["results"] = out["results"][:-n] + radd     # the model already carries the step (convert)
        else: out["steps"] += add; out["results"] += radd
    return out


def model(key, title, pre, steps, res):
    """For ar_lib.C: the case model follows the tester's words where the step count or the whole text changed (the build gates count the
    model's steps and results)."""
    m = MODEL.get(key)
    if m is None: return title, pre, steps, res
    if m == "append-step":
        L = LAYOUT[key]
        steps = list(steps) + list(L["steps_add"])
        res = list(res) + [f"Step {len(res) + i}: " + " ".join(r) for i, r in enumerate(L["results_add"], 1)]
        return title, pre, steps, res      # pre_add is added to the tester's words by apply(); a model precondition would be converted twice
    return (m["title"], list(m["pre"]), list(m["steps"]), [f"Step {i}: " + " ".join(r) for i, r in enumerate(m["results"], 1)])
