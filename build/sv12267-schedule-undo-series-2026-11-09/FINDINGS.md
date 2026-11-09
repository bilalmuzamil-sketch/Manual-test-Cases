# SV-12267 — Schedule: Undo after deleting a multi-day booking brings back only one day (9 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12267 (Bug, TESTING QA, assignee Slavcho Mitrov, QA Assignee empty, labels QA_Validation_Required / bug-report, QA Branch https://sv12267.qa.shopview.com, no Powertools plan).
Source read: description (our own ticket, found while testing SV-12048, check J3) + comment 80298. Expected (ticket, quoting the SV-12048 test plan section J): *"Delete a whole-work-order series with Entire series and Undo. All days return and still pick up a newly approved line."*
Mode: Board-2 defaults — API mode, no recording, no technical section.

Fix read (ShopView/shopview, branch SV-12267-schedule-undo-restores-all-days, commits b999ade2a5 + dfc779b330 + self-review ca6a7b2e12/c8eee44571/f66c2d1e91): `SchedulePage.vue` `resolveDeleteScope` uses the board's rows when they number `summary.shiftCount`, otherwise reads the series' own dates (`readSeriesShifts`, board pages of 61 days); if that read fails nothing is deleted; if the count still mismatches it deletes without Undo. Undo sends `POST /api/schedule/shifts/restore` with every removed shift.

## Environment
- Branch sv12267, build **v26.45.2-3378a88** (read at every run), location Staging Heavy Duty - 9919, signed in as Admin (quick login), Chrome desktop 1600 × 900, dpr 2, mouse clicks.
- Production app.shopview.com, build **v26.45.2-107ad4b**, test org, work order S2-1928 (ZZAUTOTEST SV12048 PJ3 63010), staff 1370698b.

## Variant matrix — branch (delete + Undo driven on screen; set-up by API)
Each run: open Schedule → view → mini-calendar date → click the booking → trash icon → scope → "Shift deleted." toast → Undo → read board → reload → read board. Compared per shift: id, start, end, minutes, technician, series, line count, booking type.

| Tag | Work order | Booked | View | Scope chosen | Before | After delete | After Undo + reload | Same ids/series/tech/lines |
|---|---|---|---|---|---|---|---|---|
| V1 | S12267-17580 (Karen Peck) | Tue 10, Wed 11 | Week (reported flow) | Entire series | 2 | 0 | **2** | yes |
| V2 | S12267-17581 (John Ortiz) | Thu 12, Fri 13 | Day (only Thu on screen) | Entire series | 2 | 0 | **2** | yes |
| V8 | S12267-17587 (Karen Peck) | Sat 14, Mon 16 (crosses into next week) | Week Nov 9–15 (only Sat on screen) | Entire series | 2 | 0 | **2** | yes |
| V3 | S12267-17582 (Emily Madden) | Fri 13, Sat 14 | Week | Entire series | 2 | 0 | **2** | yes |
| V4 | S12267-17583 (Marissa Armstrong) | Mon 30 Nov, Tue 1 Dec (crosses month) | Month | Entire series | 2 | 0 | **2** | yes |
| V5 | S12267-17584 (Douglas Fields) | Tue 17, Wed 18, Thu 19 | Day, middle day | This and all later shifts | 3 | 1 (Tue) | **3** (restore carried 2) | yes |
| V6 | S12267-17585 (Brandi Smith) | Tue 24, Wed 25, Thu 26 | Day, middle day | This shift only | 3 | 2 | **3** (restore carried 1) | yes |
| V9 | S12267-17588 (John Ortiz), **whole work order** | Thu 19, Fri 20 | Day | Entire series | 2 | 0 | **2**, both still "whole work order" | yes |

New line after Undo (V9): line added waiting approval → approved on the Lines tab (screen, `Approve`) → **both restored days now carry 2 lines** (2483ffdd + e98d9026). Control V10 (same set-up, never deleted): identical, both days carry the new line. On both V9 and V10 the new line's Labor shows "Unassigned" right after approval — same with and without the delete/Undo, so not caused by this fix.

The Undo button appeared every time ("Shift deleted." + Undo). Note: my first V1 run reported "no Undo button" — that was my own script looking for the toast under the wrong page element; the screenshot showed it. Fixed the finder and re-ran V1 with a fresh series.

## Production (before)
| Run | Booked | View | Result after Undo |
|---|---|---|---|
| P-Week | Tue 17, Wed 18 (both on screen) | Week | both back (2 of 2) |
| P-Day | Tue 24, Wed 25 | Day (only Tue on screen) | **only Tue 24 back; Wed 25 lost** (restore carried 1) |

So on today's production the loss happens when the board does not hold every day of the series (Day view, or a series running past the visible week); on 5 Nov it also happened in Week view on build v26.45.1-753355c. The branch restores every day in all of these.

## Before/after exhibit cycle (same steps both sides, Day view, booking Tue 1 + Wed 2 Dec)
- Production S2-1928: Week view before = one booking across Tue+Wed (block 307 px wide); Day view → Entire series → Undo (restore carried 1) → Week view after = Tuesday only (block 153 px). **Bug reproduces.**
- Branch S12267-17590 (Karen Peck): same → restore carried 2 → Week view after = both days (block 307 px). **Fixed.**
- Exhibit: `ev/exhibits/01-before-vs-after-day-view.png` (scripts/exhibit.py, composed from `ev/runs/EX-*`).

## Long series (the fix reads the series in 61-day pages)
- The branch refuses a series over 56 days unless confirmed (409 "…beyond the 56-day limit. Resubmit with acknowledgeLongSeries…"), so a longer series is reachable by a user who accepts the warning.
- V12 S12267-… (Douglas Fields): 70 shifts, 4 Jan → 25 Mar 2027 (81 days, past one 61-day page), booked with the warning accepted. Day view 4 Jan → Entire series (70 shifts) → Undo: restore request carried **70**; board read in two windows afterwards = **70 unique shifts, same ids as booked, 1 series, 33,600 min**.
- The delete itself is not separately counted (my board read used too wide a range and came back empty); the restore carrying all 70 ids, all of which are back, is the evidence.

## Not tried
- A forced failure of the series read (the fix then deletes nothing and offers no Undo) — needs a network failure injected at that moment; not attempted.

## Posted 9 Nov 2026 — comment 80531 (QA PASSED)
11-row table, 1 annotated before/after exhibit (production vs branch), steps on the branch with S12267-17590. Then label QAcomplete added, status → QA Complete, QA Assignee set to Bilal (was empty) — all re-read. Pre-post gate: branch marker v26.45.2-3378a88 (last-modified Mon 09 Nov 2026 14:39:15 GMT, unchanged across every run), production v26.45.2-107ad4b, ticket had only comment 80298, no technical section, no recording (Board-2 defaults).
Learning check: (1) my first V1 run's "no Undo button" was my own toast finder (the toast is not `.q-notification`; use the button role "Undo") — fixed in undo.mjs before any verdict; (2) I first sent QA Assignee (customfield_10385) as a single object and got 400 "data was not an array" — the array shape was ALREADY in the playbook (§ near line 6533); I should have looked it up first (Rule 117). No new rule; recipe reused on the retry.
