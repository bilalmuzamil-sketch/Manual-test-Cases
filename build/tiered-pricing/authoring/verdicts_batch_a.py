"""Batch A verdicts (stories 5, 6, 7, 8, 9, 12, 14, 15, 16, 19) and checklist registries, merged by verdicts.py."""
FORCED = ("a manual tester cannot make a load or save fail on purpose; listed for the developers' own automated checks "
          "(the requirement map's verdict: not manually testable, forced failure)")
IN_SCOPE_STORIES = {5, 6, 7, 15}

NOT_TESTABLE = {
 "TP-S5-EH1": "The PRD states it does not apply (\"the simulator calculates on screen and saves nothing\"); there is nothing to look at.",
 "TP-S6-EH1": "A failed Matrices list load: " + FORCED + ".",
 "TP-S7-EH1": "A failed Categories list load or category save: " + FORCED + ".",
 "TP-S15-EH1": "The PRD states it does not apply (\"the warning is calculated on screen and saves nothing\"); there is nothing to look at.",
}
HELD = {}
PARTIAL = {}
UNUSED_BOARDS = {
 "6.1": "A \"Today\" board (production before the release); its screenshot is attached as today:6.1 (images/today/), not the empty board render.",
}
STRESS = {
 "tier names in the Price Part Simulator headers": "D-104",
 "matrix and category names on the Matrices list": "D-128",
 "category names on the Categories list and the category page title": "D-148",
}
MOVEMENT = {
 "grid values when the below-cost warning appears (15.1 note, 5.4 vs 15.2)": "D-111",
 "Matrices list Status filter (6.2 vs 6.7)": "D-123",
 "Categories list search (7.3 vs 7.5)": "D-149",
}
NUMBERS = {
 "N simulator sell price and profit per column (S5-R2)": "S5-04",
 "N simulator rounding of a margin price (S5-R2)": "S5-05",
 "N simulator range boundary": "S5-07",
 "N simulator cost rounded to the cent first": "S5-08",
 "N simulator minus profit": "S5-10",
 "N below-cost lowest cost in the tooltip ($40.03)": "S15-01",
 "N below-cost window of the last open range": "S15-07",
 "N General Matrix category count": "S6-08",
 "N Matrices list +N categories": "S6-09",
 "N other categories count above a category's grid": "S7-15",
}
