# SV-11413 - Work Order Add Part search: exact part number first (2026-11-06)
Scope (ticket scope update + handoff in description): ONLY Work Order > Parts > Add Part search. Inventory page,
Returns/Credits picker, hyphen-insensitive, highlighting -> SV-12286 (out of scope).
Mode: API mode default, no recording, no technical section. QA branch https://sv11413.qa.shopview.com
Handoff checks: 1 exact EC1 first; 2 lowercase ec1; 3 starts-with above contains; 4 exact special-order/catalogue above
inventory partials; 5 common word (brake) same set; 6 cleared search default list unchanged; 7 add exact part to WO.
Before = production (Rule 86).
## Status
- In progress.

## Builds
QA branch sv11413 v26.45.2-b07ae41 · production v26.45.2-198e632 · staging v26.45.2-df7aeed (same data as branch, no fix).

## Before (production, S2-1943, Trucks Hill 2)
Seeded catalogue part "Light Bulb" #194 (4b25ad0a) + inventory part (c97bfab8, qty 2) - set-up via API.
Add Part, typed 194: A194 / A408 (1238194) / Item-1944 first, exact "Light Bulb 194" 4th (not visible without scrolling).
Staging corroborates: exact 194 at position 19, CR1 not first, PATM-2 2nd, special 9430 4th.

## Branch results (full lists captured from the screen's own search response; ranking computed on all rows)
| # | Check | Result |
|---|---|---|
| 1 | 194 -> exact first | PASS (Light Bulb 194 inventory #1 of 165) |
| 2 | cr1 lowercase | PASS (identical 46 results to CR1, CR1 first) |
| 3 | starts-with above contains | PASS (PATM-2: 8 starts-with above 16 contains; levels never out of order for 194/CR1/PATM-2/brake) |
| 4 | exact special/catalogue above inventory partials | PASS (194: catalogue 194s rows 2-3 above inventory 2--B194A; 9430: special 9430 #1 above inventory N9430-14; staging had it 4th) |
| 5 | common word -> same parts as before | FAIL when matches exceed the list size: brake 205 matching inventory parts -> branch returns the 62 that start with brake, staging 98; 93 returned on staging not on branch; seal 142 vs 93 with no overlap; filter 14 lost; bulb (68, fits) identical. On screen: scrolled all 215 rows of "brake" on branch - SPRING BRAKE CHAMBER (4--FLT3030LCB20), 3/8" X 18" AIRBRAKE (HAB-6-18FS), SYNFLEX not shown; staging shows all 3; "spring brake" on branch finds the chamber. |
| 6 | cleared search default list | PASS (311 rows; identical order to staging once 3 staging-only special parts added after the copy are set aside) |
| 7 | add exact part | PASS ("Part added", (194) Light Bulb In Stock, Pick, on S11413-17580; needs Qty typed) |
Test data (branch, left): WOs S11413-17580, S11413-17581 (vendor request "194"). Production: catalogue+inventory "Light Bulb" 194 (Trucks Hill 2).

## Posted
- 80369 WHAT PASSED (exhibit 01, 7-row table), 80370 PARTIALLY PASSED (check 5, exhibit 02, tagged Dusan). Edited 80370
  minutes after posting to drop "(52 in stock)" (that figure was staging's, not observed on the branch).
- Status -> REJECTED FROM TESTING (15); QA Assignee set to Bilal (was empty). Gate: build b07ae41 re-read before posting.
