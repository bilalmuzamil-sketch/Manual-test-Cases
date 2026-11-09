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

## Passed per Dusan's comment + follow-up SV-12410 (9 Nov 2026)
- Dusan (80491, 07:11 CST): the list limit existed before the fix (staging brake 98 of 205); fix changes which parts fill the page, not how many; tag rows shrink the page too; proposed a separate ticket. QA lead: pass on that basis, file the follow-up.
- Duplicate search first: SV-12286 (matching rules / exact-first / highlighting), SV-12337 (route searches to OpenSearch, notes "broad terms need a cap"), SV-12338 (no-term list cost) - none covers the page limit / missing matches. Not duplicates.
- Live re-check 9 Nov (branch b07ae41 unchanged; staging v26.45.2-8a3ce52): branch brake response = 218 rows / 141 distinct (62 inventory, 21 special, 135 catalogue), chamber absent; scrolled to end: branch 215 rows, staging 196 rows - DOT 3 BRAKE FLUID (PBFPS301C, inventory) absent from BOTH; "brake fluid" on branch shows it. 47 inventory parts containing "brake" appear in neither list.
- Tag rows: in the response each part is ONE row carrying a tags array (48 rows had tags); the row-per-tag effect Dusan describes is server-side before the page cut and was NOT measured separately - stated as his finding in SV-12410.
- Filed SV-12410 (Bug, Medium, Product Area Parts, label bug-report; source-intercom/powertools-unassigned NOT copied as they would be false for this ticket; no parent since SV-11413 has none). "Found while testing SV-11413" top line, steps on sv11413 WO S11413-17580, exhibit ev/jira/03-brake-list-limit.png (attachment 63924, read back), Relates SV-11413.
- SV-11413: new comment 80494 OVERALL QA STATUS: PASSED (80369/80370 untouched, Rule 112), check 5 "PASSED (limit handled in SV-12410)", before/after 194 image reused. Label QAcomplete added; TESTING QA -> QA Complete (transition 10; someone had moved it from Rejected back to TESTING QA before this). QA Assignee already Bilal.
- Pre-post gate: build marker re-read live b07ae41 (12:1x UTC); ticket state + newest comment re-read; image is a real attachment; no AI fingerprint; no technical section.
- Learning check: nothing new beyond the standard (a mid-flow status change by someone else was simply read and used, Rule 103).
