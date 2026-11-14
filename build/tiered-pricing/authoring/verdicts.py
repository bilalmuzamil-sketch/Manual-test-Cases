"""Verdicts that are not "a case cites it" (Rule 64: stated, never silently dropped), and the checklist registries build.py enforces.
Parallel authors extend these dicts for their stories (AUTHORING-GUIDE.md §5) and add their story numbers to IN_SCOPE_STORIES."""

IN_SCOPE_STORIES = {1, 2, 3, 4}

# Requirement or tech-plan rows that cannot become a check a manual tester can run, with the reason (L-14: not written as manual cases).
FORCED = ("a manual tester cannot make a save fail on purpose; listed for the developers' own automated checks "
          "(the requirement map's verdict: not manually testable, forced failure)")
NOT_TESTABLE = {
 "TP-S1-N1": "States that Story 1 has no negative case (\"Nothing in this story is a user action\"); there is nothing to refuse or look at.",
 "TP-S1-EH1": "States that release day runs no user action, so it has no error handling; nothing to look at.",
 "TP-S2-EH1": "If saving a tier fails: " + FORCED + ".",
 "TP-S2-EH2": "Set Rule and its Undo all or nothing when a matrix fails: " + FORCED + ".",
 "TP-S3-EH1": "If saving the matrix fails: " + FORCED + ".",
 "TP-S3-EH2": "Change All all or nothing on a failure: " + FORCED + ".",
 "TP-S4-EH1": "If the grid save fails: " + FORCED + ".",
}

# Rows (or tech-plan rows) whose only remaining check waits on a PO question; partly-held rows are cited by cases and listed in PARTIAL.
HELD = {
}

# Rows a case covers in part, with what is left and where (honest coverage, Rule 115).
PARTIAL = {
 "TP-S1-R8": "The in-app What's New entry is checked (Story 1); the client email is sent outside ShopView and cannot be checked from the screens.",
 "TP-S1-E3": "The tax half is checked in Story 1; the QuickBooks half (revenue moves to the part's own category) belongs to the Story 18 cases (next batch).",
 "TP-S3-R13": "Picker, search, Select all, \"Now: <matrix>\", Uncategorized not listed and the move on save are checked; WHEN the move happens on an existing matrix (on save vs when the picker closes) is held on Q2.",
}

# Design boards of the in-scope pages that no case attaches, with the reason.
UNUSED_BOARDS = {
 "2.1": "A \"Today\" board (production before the release); its screenshot is attached as today:2.1 (images/today/), not the empty board render.",
}

# §6d line 9: every place a typed name shows on the in-scope pages -> the stress case that checks it.
STRESS = {
 "tier name on the Tiers list and its row menu": "D-70", "tier name as the tier page title": "D-71",
 "tier name in grid column headers": "D-72", "tier name in the Archive question, the bulk bar and the Set Rule question": "D-73",
 "matrix name on a tier's Pricing tab and as the matrix page title": "D-74",
 "category names on the Categories line, in the picker and in Change Prices": "D-75",
}
# §6d line 10: every screen of the in-scope pages that changes state -> the before-and-after case.
MOVEMENT = {
 "bulk bar and its error on a tier's matrix list (design 2.32 vs 2.47, 2.51)": "D-76", "clearing the bulk bar": "D-77",
 "grid view after Edit and Cancel": "D-78", "Tiers list when a tier is archived (2.21 vs 2.24)": "D-79",
 "simulator columns between view and edit (3.5 vs 3.25; held on Q18)": "D-63", "New Matrix category list pushing the grid (3.22 vs 3.23; held on Q18)": "D-64",
}
# Rule 116 numbers of NUMBERS-AND-HAZARDS.md shown on the in-scope pages -> the case that proves it from seeded inputs.
NUMBERS = {
 "N9 range labels ($0.01 above the previous end)": "S3-27", "N11 tier numbers after archive": "S2-08", "N11 tier numbers after delete": "S2-09",
 "N11 reactivated tier goes last with the next number": "S2-42", "N12 Customers count, distinct, with the channel split": "S2-03",
 "N12 Default's count on release day": "S1-08", "N13 Matrices 4/5 counts Active matrices only": "S2-05", "N13 All": "S2-06",
 "N13 Part Sale side ignored": "S2-07", "N16 edit bar counts cells and reverts": "S4-11", "N16 edit bar counts ranges, not gray fills": "S4-12",
 "N16 save message three changes then and n more": "S4-28", "N17 Set Rule n matrices (m inactive)": "S2-64", "N17 no inactive count": "S2-65",
 "N18 grayed Delete, saved lines": "S2-36", "N18 grayed Delete, open work orders, estimate counted once": "S2-37",
 "N18 both reasons, saved lines wins": "S2-38", "N19 Change Default's Prices tier count": "S4-30", "N19 General Matrix category count": "S4-36",
 "N20 New Tier hint as Tier n": "S2-14", "N1 rounding before the range is chosen ($10.005)": "S3-43", "N1 % Off and $ Off per range": "S4-22",
 "N1 mixed rule types side by side": "S3-20", "N1 double discount on a customer-named category ($128.00)": "S1-17",
 "N7 archived simulator chain": "S4-38", "N7 zero rules sell at the base price": "S3-26",
}

# ---- parallel batches: every verdicts_<batch>.py next to this file is merged in (dicts updated, IN_SCOPE_STORIES unioned), so authors never
# edit this file at the same time. A key defined twice is an error (two batches claiming one row).
import glob as _g, importlib as _il, os as _os
for _f in sorted(_g.glob(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "verdicts_*.py"))):
    _m = _il.import_module(_os.path.basename(_f)[:-3])
    IN_SCOPE_STORIES |= set(getattr(_m, "IN_SCOPE_STORIES", set()))
    for _n in ("NOT_TESTABLE", "HELD", "PARTIAL", "UNUSED_BOARDS", "STRESS", "MOVEMENT", "NUMBERS"):
        _d = getattr(_m, _n, {})
        _dup = set(_d) & set(globals()[_n])
        if _dup: raise SystemExit(f"{_os.path.basename(_f)}: {_n} keys already defined elsewhere: {sorted(_dup)}")
        globals()[_n].update(_d)
