

========== C154726 · section 20465 (S1 Categories - sort by name)
TITLE: Categories opens sorted by Name A to Z, with an up arrow
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
- The list is longer than one screen.
--- STEPS
- Open the Categories page fresh.
- Read the row order and the Name column header arrow.
- Scroll to the bottom and confirm the order is correct all the way down, not only the rows first visible.
--- EXPECTED
Expected results
- The Name column header is sortable, and on first open the list is sorted by name ascending (A to Z) with the Name header showing an ascending (up) arrow.
- The sort covers every category, not only the ones already visible on screen.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R1: “The Name column header is sortable.”
- S1-R2: “When the page first opens, the list is sorted by name in ascending order, A to Z.”
- S1-R4: “When the page first opens, the Name column header shows an ascending arrow.”
- S1-R8: “The sort covers every category, not only the categories already visible on screen.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Categories opens sorted by Name A to Z, with an up arrow
Test case: C154726, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
- The list is longer than one screen.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized"). Add enough categories that the list is longer than one screen.



========== C154727 · section 20465 (S1 Categories - sort by name)
TITLE: Clicking Name switches A to Z and Z to A, ignoring capitals, numbers in order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
--- STEPS
- With the Name sort ascending, click the Name header and read the new order and arrow.
- Click it again and read the order and arrow.
- Check that "alpha" and "Beta" sort together regardless of case, and that "Tier 9" comes before "Tier 10".
--- EXPECTED
Expected results
- Clicking the Name header while ascending re-sorts to descending (Z to A); clicking again returns to ascending (A to Z); the header arrow always points the direction currently applied.
- The name sort ignores upper/lower case and compares numbers inside a name as numbers, so "Tier 9" comes before "Tier 10".
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R3: “The name sort ignores whether letters are upper case or lower case, and compares numbers inside a name as numbers, so `Tier 9` comes before `Tier 10`.”
- S1-R5: “When the user clicks the Name header while the sort is ascending, the list re-sorts into descending order, Z to A.”
- S1-R6: “When the user clicks the Name header while the sort is descending, the list re-sorts into ascending order, A to Z.”
- S1-R7: “The Name column header arrow always shows the direction that is currently applied.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Clicking Name switches A to Z and Z to A, ignoring capitals, numbers in order
Test case: C154727, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized").



========== C154728 · section 20465 (S1 Categories - sort by name)
TITLE: QuickBooks Products And Services column sorts A to Z, then Z to A
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
--- STEPS
- Click the QuickBooks Products And Services header while it is not the sorted column.
- Read the order and arrow, then click it again and read the order and arrow.
- Confirm values differing only in case sort together and numbers inside a value compare as numbers.
--- EXPECTED
Expected results
- The QuickBooks Products And Services column header is sortable: the first click sorts by it ascending (A to Z), the next click descending (Z to A).
- That sort ignores upper/lower case and compares numbers inside a value as numbers.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R9: “The QuickBooks Products and Services column header is sortable.”
- S1-R10: “When the user clicks the QuickBooks Products and Services header while that column is not sorted, the list sorts by that column in ascending order, A to Z.”
- S1-R11: “When the user clicks that header again, the list re-sorts into descending order, Z to A.”
- S1-R12: “The QuickBooks Products and Services sort ignores whether letters are upper case or lower case, and compares numbers inside a value as numbers.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: QuickBooks Products And Services column sorts A to Z, then Z to A
Test case: C154728, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized").



========== C154729 · section 20465 (S1 Categories - sort by name)
TITLE: Only one Categories column is sorted at a time
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
--- STEPS
- Sort by Name, then click the QuickBooks Products And Services header.
- Read both headers' arrows.
--- EXPECTED
Expected results
- Only one column is sorted at a time: while the QuickBooks Products And Services column is the sorted column, the Name header shows no arrow.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R13: “Only one column is sorted at a time.”
- S1-R14: “While the QuickBooks Products and Services column is the column being sorted, the Name column header shows no arrow.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Only one Categories column is sorted at a time
Test case: C154729, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized").



========== C154730 · section 20465 (S1 Categories - sort by name)
TITLE: Categories keeps its sort after a reload, a fresh open goes back to Name A-Z
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
--- STEPS
- Apply a Name descending sort (or sort by the QuickBooks column).
- Create, edit or delete a category so the list reloads in place; read the order and arrow.
- Navigate away and back to Categories (a fresh open); read the order and arrow.
--- EXPECTED
Expected results
- When the list reloads in place, the chosen sort stays applied in the same direction and the header arrow stays where it was.
- Opening the page afresh returns the list to name ascending, whatever sort was applied last time.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R15: “When the list reloads in place, the sort the user chose stays applied, in the same direction, and the header arrow stays where it was.”
- S1-R16: “Opening the page afresh returns the list to name ascending, whatever sort was applied last time.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Categories keeps its sort after a reload, a fresh open goes back to Name A-Z
Test case: C154730, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized").



========== C154731 · section 20465 (S1 Categories - sort by name)
TITLE: Typing a Categories search term keeps the current sort
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
--- STEPS
- Apply a Name descending sort.
- Type a term in the Categories Search box that matches several categories.
- Read the order of the matching rows.
--- EXPECTED
Expected results
- Typing a search term keeps the sort: the rows that match the term are shown in the order the current sort produces.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R18: “Typing a search term keeps the sort. The rows that match the term are shown in the order the current sort produces.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Typing a Categories search term keeps the current sort
Test case: C154731, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized").



========== C154732 · section 20465 (S1 Categories - sort by name)
TITLE: Unmapped categories show Parts in the QuickBooks column and sort under P
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Have at least one category never mapped to QuickBooks, and at least one whose mapping is genuinely named "Parts".
--- STEPS
- Read the QuickBooks Products And Services cell of an unmapped category.
- Sort by that column and find where the unmapped category lands relative to a category mapped to a product genuinely named "Parts".
--- EXPECTED
Expected results
- Every category shows a value in the QuickBooks Products And Services column - an unmapped category shows the word "Parts" (as today), so the column has no empty state and no row is moved to the bottom.
- An unmapped category (showing "Parts") sorts under P in the same run as a category whose mapping is genuinely named "Parts"; the two are indistinguishable in the list, by design.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R17: “Every category shows a value in the QuickBooks Products and Services column. A category that has never been mapped shows the word Parts there, which is what the page shows today and does not change. That column therefore has no empty state, no row is moved to the bottom of it, and a category showing Parts because it is unmapped sorts under P in the same run as a category whose mapping is genuinely named Parts. The two are indistinguishable in the list, by design.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Unmapped categories show Parts in the QuickBooks column and sort under P
Test case: C154732, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Have at least one category never mapped to QuickBooks, and at least one whose mapping is genuinely named "Parts".
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Have at least one category never mapped to QuickBooks, and at least one whose mapping is genuinely named "Parts".



========== C154733 · section 20465 (S1 Categories - sort by name)
TITLE: The Default category stays first, with its badge, under every sort
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
- The Default category (for example "Uncategorized") carries a Default badge.
--- STEPS
- Sort by Name ascending, then descending; each time note the first row.
- Sort by the QuickBooks column ascending, then descending; each time note the first row.
- Reload in place and re-check the first row.
- Search for a term that matches the Default category, then one that does not; note whether it appears.
- Confirm the Default badge shows in every sort and that all other categories sort beneath it.
--- EXPECTED
Expected results
- The Default category is always the first row under the Name sort and the QuickBooks sort, ascending and descending, and after a reload in place; every other category sorts beneath it (the Default row is placed first, not compared against the others).
- It keeps its Default badge in every sort; in search it is first whenever it is among the matching rows, and a term that does not match its name simply leaves it out (it is never forced in).
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R19: “The Default category is always the first row in the list. It holds that position under the Name sort and under the QuickBooks Products and Services sort, in ascending and in descending order alike, and it holds it after a reload in place. When a search term is typed it is first whenever it is among the matching rows; a term that does not match its name leaves it out of the results, as today, and it is never forced into them. This is the behavior the Categories list has in production today and it does not change.”
- S1-R20: “Every category other than the Default category sorts beneath it, following the rules in S1-R2 through S1-R18. The Default category is not compared against the other rows; it is placed first and the remainder are sorted.”
- S1-R21: “The Default category keeps its Default badge in every sort.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The Default category stays first, with its badge, under every sort
Test case: C154733, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Categories page is open.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").
- The Default category already exists (for example "Uncategorized").
- The Default category (for example "Uncategorized") carries a Default badge.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Categories.
- The shop is connected to QuickBooks (so the QuickBooks Products And Services column is shown).
- Seed categories that exercise the sort: click New Category and create names that mix case and numbers (e.g. "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta"). The Default category already exists (e.g. "Uncategorized"). Note the Default category (e.g. "Uncategorized") carries a Default badge.



========== C154734 · section 20465 (S1 Categories - sort by name)
TITLE: Without QuickBooks the column is hidden, a failed check shows one message
--- PRECONDITIONS (TestRail)
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
--- STEPS
- With the shop NOT connected to QuickBooks, open Categories and look for the QuickBooks Products And Services column and its sort.
- In a state where the connection cannot be checked, open Categories and read any message; confirm the Name column still loads and sorts.
--- EXPECTED
Expected results
- If the shop is not connected to QuickBooks, the QuickBooks Products And Services column is not shown and no sort is available for it.
- If the connection cannot be checked, the column is not shown and the user is told once "Unable to check QuickBooks connection. Please try again." (the app's generic error for the same failed request is suppressed, so no second message); the list still loads and the Name column still sorts.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-N1: “If the shop is not connected to QuickBooks, the QuickBooks Products and Services column is not shown, and no sort is available for it.”
- S1-N5: “If the connection cannot be checked, the column is not shown and the user is told once: "Unable to check QuickBooks connection. Please try again." That is the only message shown for the failure: the app's generic error message for the same failed request is suppressed, so the user never sees two. The list itself still loads and the Name column still sorts.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154735 · section 20465 (S1 Categories - sort by name)
TITLE: An empty Categories list can still be sorted, no permission blocks it
--- PRECONDITIONS (TestRail)
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- Also have available a user WITHOUT the "Settings - Parts" permission, and an organization/state with no categories.
--- STEPS
- Open Categories in the no-categories state and read the Name header (sortable? arrow?).
- As the user without "Settings - Parts", try to open the Categories page.
--- EXPECTED
Expected results
- If no categories exist, the Name column header still renders as sortable and still shows the ascending arrow.
- A user without the "Settings - Parts" permission cannot open the Categories page.
Source - where this behaviour comes from
Epic SV-9667; story SV-10134 (S1, Categories - sort by name); "Settings Pricing And Categories Sorting" PRD (Confluence 578781186, Locked for build 2026-09-15), Story 1; design artboards "Categories - before/after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-N2: “If no categories exist, the Name column header still renders as sortable and still shows the ascending arrow.”
- S1-N3: “If the user does not have the Settings - Parts permission, the user cannot open the Categories page.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154736 · section 20466 (S2 Pricing Matrices - sortable column)
TITLE: Pricing Matrices opens sorted by matrix name A to Z, with an up arrow
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
- Several pricing matrices with names that mix case and numbers (for example "COC matrix", "HD-Dynamic 55", "70% override").
--- STEPS
- Open the Pricing Matrices tab fresh.
- Read the row order and the Matrix Category header arrow.
--- EXPECTED
Expected results
- The Matrix Category column header is sortable, and on first open the list is sorted by matrix name ascending (A to Z) with the Matrix Category header showing an ascending arrow.
Source - where this behaviour comes from
Epic SV-9667; story SV-10135 (S2, Pricing Matrices - sortable column); PRD (Confluence 578781186), Story 2; design artboard "Pricing matrices"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R1: “The Matrix Category column header is sortable.”
- S2-R2: “When the tab first opens, the list is sorted by matrix name in ascending order, A to Z.”
- S2-R4: “When the tab first opens, the Matrix Category column header shows an ascending arrow.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Pricing Matrices opens sorted by matrix name A to Z, with an up arrow
Test case: C154736, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
- Several pricing matrices with names that mix case and numbers (for example "COC matrix", "HD-Dynamic 55", "70% override").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Pricing Matrices tab.
- Seed several pricing matrices with names that mix case and numbers via New Price Matrix (e.g. "COC matrix", "HD-Dynamic 55", "70% override").



========== C154737 · section 20466 (S2 Pricing Matrices - sortable column)
TITLE: Clicking Matrix Category switches A to Z and Z to A, numbers in order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
- Seed matrices whose names mix case and numbers (e.g. "matrix 9", "Matrix 10").
--- STEPS
- Click the Matrix Category header while ascending; read the order and arrow.
- Click again; read the order and arrow.
- Confirm case is ignored and numbers inside a name compare as numbers.
--- EXPECTED
Expected results
- Clicking the header while ascending re-sorts to descending (Z to A); clicking again returns to ascending (A to Z); the arrow always shows the direction currently applied.
- The sort ignores upper/lower case and compares numbers inside a name as numbers.
Source - where this behaviour comes from
Epic SV-9667; story SV-10135 (S2, Pricing Matrices - sortable column); PRD (Confluence 578781186), Story 2; design artboard "Pricing matrices"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R3: “The sort ignores whether letters are upper case or lower case, and compares numbers inside a name as numbers.”
- S2-R5: “When the user clicks the header while the sort is ascending, the list re-sorts into descending order, Z to A.”
- S2-R6: “When the user clicks the header while the sort is descending, the list re-sorts into ascending order, A to Z.”
- S2-R7: “The column header arrow always shows the direction that is currently applied.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Clicking Matrix Category switches A to Z and Z to A, numbers in order
Test case: C154737, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
- Seed matrices whose names mix case and numbers (e.g. "matrix 9", "Matrix 10").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Pricing Matrices tab.
- Seed matrices whose names mix case and numbers (e.g. "matrix 9", "Matrix 10").



========== C154738 · section 20466 (S2 Pricing Matrices - sortable column)
TITLE: Pricing Matrices keeps its sort after a reload, a fresh open resets it
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
--- STEPS
- Apply a descending sort.
- Create, edit or delete a pricing matrix so the list reloads in place; read the order and arrow.
- Navigate away and back to the tab; read the order and arrow.
--- EXPECTED
Expected results
- When the list reloads in place, the chosen sort stays applied and the header arrow stays where it was.
- Opening the page afresh returns the list to matrix name ascending.
Source - where this behaviour comes from
Epic SV-9667; story SV-10135 (S2, Pricing Matrices - sortable column); PRD (Confluence 578781186), Story 2; design artboard "Pricing matrices"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R8: “When the list reloads in place, the sort the user chose stays applied and the header arrow stays where it was.”
- S2-R9: “Opening the page afresh returns the list to matrix name ascending.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Pricing Matrices keeps its sort after a reload, a fresh open resets it
Test case: C154738, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Pricing Matrices tab.



========== C154739 · section 20466 (S2 Pricing Matrices - sortable column)
TITLE: The Pricing matrices tab label carries a space before the count
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
--- STEPS
- Read the Pricing Matrices tab label exactly, including the spacing before the parenthesis.
- Compare N to the number of pricing matrices loaded for the tab.
--- EXPECTED
Expected results
- The tab label reads "Pricing matrices (N)" with exactly one space between the label text and the opening parenthesis, and N is the total number of pricing matrices loaded for the tab.
Source - where this behaviour comes from
Epic SV-9667; story SV-10135 (S2, Pricing Matrices - sortable column); PRD (Confluence 578781186), Story 2; design artboard "Pricing matrices"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R10: “The tab label reads `Pricing matrices (N)`.”
- S2-R11: “One space separates the label text from the opening parenthesis.”
- S2-R12: “N is the total number of pricing matrices loaded for the tab.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The Pricing matrices tab label carries a space before the count
Test case: C154739, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Pricing Matrices tab.



========== C154740 · section 20466 (S2 Pricing Matrices - sortable column)
TITLE: The default pricing matrix is not pinned first, it sorts by its name
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
- The tab has a default pricing matrix (carrying a Default badge, e.g. "Default matrix 07/12/2023").
--- STEPS
- Sort by matrix name ascending, then descending.
- Each time, note where the default matrix sits and whether it keeps its Default badge.
--- EXPECTED
Expected results
- The default pricing matrix is not pinned: it sorts in the position its name gives it in both directions and keeps its Default badge there - deliberately different from the Categories list, where the Default row is pinned first.
Source - where this behaviour comes from
Epic SV-9667; story SV-10135 (S2, Pricing Matrices - sortable column); PRD (Confluence 578781186), Story 2; design artboard "Pricing matrices"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R13: “The default pricing matrix is not pinned. It sorts in the position its name gives it, in both directions, and keeps its Default badge there. This is the behavior the Pricing Matrices tab has in production today and it does not change. It is deliberately different from the Categories list, where the Default row is pinned first per S1-R19.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The default pricing matrix is not pinned first, it sorts by its name
Test case: C154740, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Pricing Matrices tab is open.
- The tab has a default pricing matrix (carrying a Default badge, e.g. "Default matrix 07/12/2023").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Pricing Matrices tab.
- The tab has a default pricing matrix (carrying a Default badge, e.g. "Default matrix 07/12/2023").



========== C154741 · section 20466 (S2 Pricing Matrices - sortable column)
TITLE: An empty Pricing Matrices list can still be sorted, no permission blocks it
--- PRECONDITIONS (TestRail)
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- Have a no-matrices state, and a user WITHOUT the "Settings - Parts" permission.
--- STEPS
- Open Pricing Matrices in the no-matrices state; read the Matrix Category header (sortable? arrow?) and the table.
- As the user without "Settings - Parts", try to open the Pricing page.
--- EXPECTED
Expected results
- If no pricing matrices exist, the Matrix Category header still renders as sortable and still shows the ascending arrow, and the table shows its standard empty state.
- A user without the "Settings - Parts" permission cannot open the Pricing page.
Source - where this behaviour comes from
Epic SV-9667; story SV-10135 (S2, Pricing Matrices - sortable column); PRD (Confluence 578781186), Story 2; design artboard "Pricing matrices"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-N1: “If no pricing matrices exist, the Matrix Category column header still renders as sortable and still shows the ascending arrow. The table shows its standard empty state.”
- S2-N2: “If the user does not have the Settings - Parts permission, the user cannot open the Pricing page.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154742 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: Fixed Rules sorts by three columns, one at a time, each click flips order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists fixed rules with a range of part numbers, categories and fixed prices (e.g. org "Automotive - 4700").
--- STEPS
- Click each of the Part Number, Category and Fixed Price headers in turn while it is not the sorted column; read the order and arrow.
- Click the same header again; read the order and arrow.
- After sorting one column, sort another and confirm only one column shows an arrow.
--- EXPECTED
Expected results
- The Part Number, Category and Fixed Price column headers are each sortable; clicking a header that is not currently sorted sorts by it ascending, and clicking the same header again re-sorts descending.
- Only one column is sorted at a time, and the sorted column shows an arrow for the direction currently applied.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R1: “The Part number column header is sortable.”
- S3-R2: “The Category column header is sortable.”
- S3-R3: “The Fixed price column header is sortable.”
- S3-R4: “When the user clicks a sortable column header that is not currently sorted, the list sorts by that column in ascending order.”
- S3-R5: “When the user clicks that same header again, the list re-sorts into descending order.”
- S3-R10: “Only one column is sorted at a time.”
- S3-R11: “The column being sorted shows an arrow for the direction that is currently applied.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Fixed Rules sorts by three columns, one at a time, each click flips order
Test case: C154742, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists fixed rules with a range of part numbers, categories and fixed prices (e.g. org "Automotive - 4700").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.
- The tab lists fixed rules with a range of part numbers, categories and fixed prices (e.g. org "Automotive - 4700").



========== C154743 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: Part number sorting puts numbers in order and ignores capitals
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists parts whose numbers mix letters, case and numbers (e.g. "BRK-9", "BRK-10", "BRK-100").
--- STEPS
- Sort by Part Number ascending.
- Find "BRK-9", "BRK-10" and "BRK-100" and read their order.
--- EXPECTED
Expected results
- Part Number sorts alphabetically, ignoring upper/lower case, and compares numbers inside a part number as numbers, so the order reads "BRK-9", then "BRK-10", then "BRK-100".
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R6: “Part number sorts alphabetically, ignores whether letters are upper case or lower case, and compares numbers inside a part number as numbers: `BRK-9`, then `BRK-10`, then `BRK-100`.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Part number sorting puts numbers in order and ignores capitals
Test case: C154743, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists parts whose numbers mix letters, case and numbers (e.g. "BRK-9", "BRK-10", "BRK-100").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.
- The tab lists parts whose numbers mix letters, case and numbers (e.g. "BRK-9", "BRK-10", "BRK-100").



========== C154744 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: Category sorting puts numbers in order, and only rules with a category show
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists rules across several categories whose names mix case and numbers.
--- STEPS
- Sort by Category ascending and descending; confirm case is ignored and numbers inside a category name compare as numbers.
- Confirm the tab lists only fixed rules whose part has a category (a rule whose part has no category is not listed, as today).
- If an empty Category value ever appears, note where it sorts in both directions.
--- EXPECTED
Expected results
- Category sorts alphabetically, ignoring upper/lower case, and compares numbers inside a category name as numbers.
- The tab lists only fixed rules whose part has a category (as today); a rule whose part has no category is not listed, and if an empty Category value ever reaches the list it sorts last in the Category column in both directions.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R7: “Category sorts alphabetically, ignores whether letters are upper case or lower case, and compares numbers inside a category name as numbers.”
- S3-R12b: “The tab lists only fixed rules whose part has a category, as it does today. A fixed rule whose part has no category is not listed; across every shop in production that is 3 rules. Listing them would change what the server sends, which this PRD rules out, so they are left for a separate ticket. If an empty Category value ever does reach the list, it sorts last in the Category column in both directions.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Category sorting puts numbers in order, and only rules with a category show
Test case: C154744, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists rules across several categories whose names mix case and numbers.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.
- The tab lists rules across several categories whose names mix case and numbers.



========== C154745 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: Fixed price sorts lowest first ascending and highest first descending
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists rules with a range of fixed prices (e.g. $1.40, $3.99, $14.48, $16.73).
--- STEPS
- Sort by Fixed Price ascending and read the top and bottom values.
- Sort by Fixed Price descending and read the top and bottom values.
--- EXPECTED
Expected results
- Fixed Price sorts by numeric value: lowest first when ascending and highest first when descending.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R8: “Fixed price sorts by value, lowest first when ascending.”
- S3-R9: “Fixed price sorts highest first when descending.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Fixed price sorts lowest first ascending and highest first descending
Test case: C154745, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- The tab lists rules with a range of fixed prices (e.g. $1.40, $3.99, $14.48, $16.73).
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.
- The tab lists rules with a range of fixed prices (e.g. $1.40, $3.99, $14.48, $16.73).



========== C154746 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: Fixed Rules opens by Part number ascending and keeps its sort after reload
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
--- STEPS
- Open the Fixed Rules tab fresh and read the order and which header has the arrow.
- Apply a different sort, then create/edit/delete a fixed rule so the tab reloads in place; read the order and arrow.
- Navigate away and back to the tab; read the order and arrow.
--- EXPECTED
Expected results
- The list opens sorted by Part Number ascending (numeric-aware) with that header showing the ascending arrow.
- When the tab reloads in place the chosen sort stays applied and the header arrow stays where it was; opening the page afresh returns the list to Part Number ascending.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R12: “The list opens sorted by Part number ascending (numeric-aware, per S3-R6), and that header shows the ascending arrow.”
- S3-R12a: “When the tab reloads in place, the sort the user chose stays applied and the header arrow stays where it was. Opening the page afresh returns the list to Part number ascending.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Fixed Rules opens by Part number ascending and keeps its sort after reload
Test case: C154746, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.



========== C154747 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: All fixed rules load when the page opens, and the sort covers all of them
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- Use the largest organisation so the list is long (production peaks near 8,994 rules).
--- STEPS
- Open the Fixed Rules tab and let it finish loading.
- Apply a sort and scroll to the bottom; confirm the order is correct all the way down, not only the rows first visible.
--- EXPECTED
Expected results
- Every fixed rule the tab lists loads when the tab opens, and the sort covers every fixed rule, not only the rules already visible on screen.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R13: “Every fixed rule the tab lists (S3-R12b) loads when the tab opens.”
- S3-R14: “The sort covers every fixed rule, not only the rules already visible on screen.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: All fixed rules load when the page opens, and the sort covers all of them
Test case: C154747, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- Use the largest organisation so the list is long (production peaks near 8,994 rules).
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.
- Use the largest organisation so the list is long (production peaks near 8,994 rules).



========== C154748 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: The Fixed rules tab label carries a space before the count
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
--- STEPS
- Read the Fixed Rules tab label exactly, including the spacing before the parenthesis.
- Compare N to the number of fixed rules loaded for the tab.
--- EXPECTED
Expected results
- The tab label reads "Fixed rules (N)" with exactly one space between the label text and the opening parenthesis, and N is the total number of fixed rules loaded for the tab.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R15: “The tab label reads `Fixed rules (N)`.”
- S3-R16: “One space separates the label text from the opening parenthesis.”
- S3-R17: “N is the total number of fixed rules loaded for the tab.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The Fixed rules tab label carries a space before the count
Test case: C154748, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.



========== C154749 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: The Fixed Rules search now works and keeps the current sort
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
--- STEPS
- Apply a sort (e.g. Fixed Price descending).
- Type a term in the Fixed Rules Search box that appears (any case) in some rows' Part Number, Category or Fixed Price as shown.
- Read which rows show and their order; then clear the box and read the list.
--- EXPECTED
Expected results
- Typing in the Fixed Rules Search box filters the loaded rules to those where the term appears (ignoring case) in the Part Number, Category or Fixed Price as shown on screen, presenting them in the current sort; clearing the box shows every rule again, still in the current sort. (Today the box does nothing on this tab; the release note says it now works.)
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R18: “Typing in the Fixed Rules search box filters the loaded rules to those that match the term, and shows them in the current sort. A rule matches when the term appears, ignoring case, in its Part number, Category or Fixed price as shown on screen. Clearing the box shows every rule again, still in the current sort. Today the box does nothing on this tab, because the server ignores the term; the release note says that it now works.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The Fixed Rules search now works and keeps the current sort
Test case: C154749, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.



========== C154750 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: Fixed Rules shows a loading indicator and is not usable until fully loaded
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- Use the largest organisation so loading takes a few seconds.
--- STEPS
- Open the Fixed Rules tab and watch while the rules load.
- During loading, try to click a column header, type in the search box and interact with rows.
--- EXPECTED
Expected results
- While the rules load, the Fixed Rules tab shows a loading indicator, and its column headers, search box and rows cannot be used until every rule has loaded.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R19: “While the rules load, the Fixed Rules tab shows a loading indicator, and its column headers, search box and rows cannot be used until every rule has loaded.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Fixed Rules shows a loading indicator and is not usable until fully loaded
Test case: C154750, FM - Price/Category. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- The Fixed Rules tab is open.
- Use the largest organisation so loading takes a few seconds.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test. Open Settings -> Parts -> Pricing -> Fixed Rules tab.
- Use the largest organisation so loading takes a few seconds.



========== C154751 · section 20467 (S3 Fixed Rules - sortable columns)
TITLE: An empty Fixed Rules list can still be sorted, no permission blocks it
--- PRECONDITIONS (TestRail)
- You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.
- Have a no-fixed-rules state, and a user WITHOUT the "Settings - Parts" permission.
--- STEPS
- Open Fixed Rules in the no-rules state; read the three headers (sortable?) and the table.
- As the user without "Settings - Parts", try to open the Pricing page.
--- EXPECTED
Expected results
- If no fixed rules exist, the three column headers still render as sortable and the table shows its standard empty state.
- A user without the "Settings - Parts" permission cannot open the Pricing page.
Source - where this behaviour comes from
Epic SV-9667; story SV-10136 (S3, Fixed Rules - sortable columns); PRD (Confluence 578781186), Story 3; design artboard "Fixed rules - before and after" + "The three rules that bite"; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-N1: “If no fixed rules exist, the three column headers still render as sortable. The table shows its standard empty state.”
- S3-N2: “If the user does not have the Settings - Parts permission, the user cannot open the Pricing page.”
AUTOMATION: HOLD - authored from the PRD (Confluence 578781186, Locked for build 2026-09-15) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)
