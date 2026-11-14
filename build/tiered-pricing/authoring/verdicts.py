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
}

# §6d line 9: every place a typed name shows on the in-scope pages -> the stress case that checks it.
STRESS = {}
# §6d line 10: every screen of the in-scope pages that changes state -> the before-and-after case.
MOVEMENT = {}
# Rule 116 numbers of NUMBERS-AND-HAZARDS.md shown on the in-scope pages -> the case that proves it from seeded inputs.
NUMBERS = {}
