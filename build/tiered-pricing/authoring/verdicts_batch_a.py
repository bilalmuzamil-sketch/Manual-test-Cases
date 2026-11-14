"""Batch A verdicts (stories 5, 6, 7, 8, 9, 12, 14, 15, 16, 19) and checklist registries, merged by verdicts.py."""
FORCED = ("a manual tester cannot make a load or save fail on purpose; listed for the developers' own automated checks "
          "(the requirement map's verdict: not manually testable, forced failure)")
IN_SCOPE_STORIES = {5, 6, 7, 8, 9, 12, 14, 15, 16, 19}

NOT_TESTABLE = {
 "TP-S5-EH1": "The PRD states it does not apply (\"the simulator calculates on screen and saves nothing\"); there is nothing to look at.",
 "TP-S6-EH1": "A failed Matrices list load: " + FORCED + ".",
 "TP-S7-EH1": "A failed Categories list load or category save: " + FORCED + ".",
 "TP-S8-EH1": "A failed category save: " + FORCED + ".",
 "TP-S9-E6": "A bulk add or remove that fails part-way (all or nothing): " + FORCED + ".",
 "TP-S9-EH1": "A failed Manage Customers save: " + FORCED + ".",
 "TP-S9-E2": "Selecting all of a large customer list (about 1,284) and saving moves every customer of the client onto one tier; a manual tester cannot put the client back (removing returns everyone to Default, not to the tiers they had), so it would break every other test on that client. Listed for the developers' own checks with seeded data.",
 "TPX-19": "The customer card's Pricing section skeleton shows only while it loads and its inline error only on a failed load: " + FORCED + "; a slow load can be shown only with browser developer tools, which manual cases do not use.",
 "TP-S12-EH1": "A failed price details load: " + FORCED + ".",
 "TP-S14-EH1": "Change Customer's failures (\"exactly as they do today\"): " + FORCED + ".",
 "TP-S19-R7": "Loading skeletons show only while a page loads; on a normal connection they flash too briefly to judge, and slowing the page needs browser developer tools, which manual cases do not use. Listed for the automation owner.",
 "TP-S19-R10": "A failed load (\"Ooooops! An error occurred\" with Try again): " + FORCED + ".",
 "TP-S19-EH1": "A failed save (today's error toast): " + FORCED + ".",
 "TP-S19-R12": "Keeping changes for all time can be seen only long after the release (ShopView's internal copy follows a 90-day cleanup, which is not visible to a tester); listed for engineering, who confirm it in the tech plan.",
 "TP-S15-EH1": "The PRD states it does not apply (\"the warning is calculated on screen and saves nothing\"); there is nothing to look at.",
}
HELD = {}
PARTIAL = {
 "TP-S16-R6": "\"No new permission appears in settings\" is checked (Roles & Permissions); \"any internal check engineering adds\" is not visible to a tester.",
 "TP-S16-R5": "Hidden screens without each permission and a save refused after the permission is removed in a second session are checked; refusals reached only by a direct request are for the automation owner (Rule 114).",
 "TP-S19-R5": "The Priced by column and price details naming the source in words are checked; the screen reader names of the Manual and warning icons need a screen reader and are left to the accessibility check.",
 "TP-S19-R1": "The double-click guard, dialogs closing only with Cancel or the X, and the expired session are checked; the spinner itself flashes too briefly to judge by eye.",
 "TP-S12-R10": "The gray Manual icon and where it shows are checked; its screen reader name \"Price typed by hand: see details\" needs a screen reader and is checked in the design case's hover words only.",
 "TP-S12-R15": "The line keeps its price after a rename and Priced by shows the current name (Story 12); Sales by Tier grouping a renamed tier under its current name is the reports batch's case.",
 "TP-S12-N2": "A part with no cost opening details at $0.00 is checked; a found part's typed price showing Manual (S11-E7) is the Story 11 batch's case.",
 "TP-S14-R2": "No repricing, the single-tier notice and its count, the Manual icon and the price details are checked; the notice for lines priced by more than one tier (no tier name) needs lines priced by two tiers on one work order, which a tester cannot make by hand (a work order prices by one tier), so it is not checked.",
 "TP-S9-R2": "New Customer's two tier fields and Default for a new customer are checked; an imported customer starting on Default is not, because importing customers is outside these cases (the import flow is unchanged).",
 "TP-S9-N6": "The Customers tab and Manage Customers no-match messages and the empty Remove tab are checked; the Add tab's \"Every customer is already on <tier>.\" needs every customer of the client on one tier, which would change every other test's customers, so it is not checked.",
 "TP-S8-E1": "Catalog parts, work order and Part Sale lines (invoiced included) and canned line parts are checked; order and delivery items are not opened by these cases, and past-period category reports belong to the reports batch.",
}
UNUSED_BOARDS = {
 "9.25": "A \"Today\" board; its screenshot is attached as today:9.25.",
 "9.26": "A \"Today\" board; its screenshot is attached as today:9.26.",
 "9.27": "A \"Today\" board; its screenshot is attached as today:9.27.",
 "9.38": "A \"Today\" board; its screenshot is attached as today:9.38.",
 "14.1": "A \"Today\" board; its screenshot is attached as today:14.1.",
 "6.1": "A \"Today\" board (production before the release); its screenshot is attached as today:6.1 (images/today/), not the empty board render.",
}
STRESS = {
 "tier names in the Price Part Simulator headers": "D-104",
 "matrix and category names on the Matrices list": "D-128",
 "category names on the Categories list and the category page title": "D-148",
 "customer names on a tier's Customers tab, in Manage Customers and the Remove question": "D-189",
 "tier and customer names in the price details, the Priced by column, Change Customer and its notice": "D-217",
 "tier names on the customer card, Edit Customer and the tier picker": "D-190",
}
MOVEMENT = {
 "grid values when the below-cost warning appears (15.1 note, 5.4 vs 15.2)": "D-111",
 "Matrices list Status filter (6.2 vs 6.7)": "D-123",
 "Categories list search (7.3 vs 7.5)": "D-149",
 "New Category name error pushes the grid down (8.6 vs 8.7)": "D-166",
 "Manage Customers bulk bar pushes the list down (9.4 vs 9.6)": "D-175",
 "Manage Customers columns on search (9.12, 9.13 vs 9.4; held on Q27)": "D-179",
 "work order lines when the Change Customer notice appears (14.8, 12.9)": "D-225",
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
 "N category count after Cancel": "S8-03",
 "N new part repriced by a category change": "S8-05",
 "N category delete changes no price, next reprice by the General Matrix": "S8-10",
 "N Manage Customers footer counts": "S9-19",
 "N Remove tab count": "S9-13",
 "N skipped count": "S9-36",
 "N open work order keeps its tier after a tier change": "S9-23",
 "N Part Sales tier unaffected by a work order tier change": "S9-24",
 "N Customers tab 50 a page": "S9-28",
 "N price details cost, rule and sell price": "S12-01",
 "N % Off details name the Default price": "S12-02",
 "N Same as previous tier priced by the earlier tier": "S12-05",
 "N moved-tier line keeps its price": "S12-08",
 "N matrix edit leaves a recorded line": "S12-14",
 "N Change Customer notice count": "S14-06",
 "N double click creates one tier": "S19-01",
 "N cancelled New Tier leaves the count": "S19-05",
 "N technician part priced by the tier unseen": "S16-08",
 "N split reprices by the current tier": "S16-10",
 "N new parts after Change Customer use the work order tier": "S14-07",
}
