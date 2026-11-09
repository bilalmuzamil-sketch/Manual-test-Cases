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

(Full before/after exhibit cycle, both environments, Day view, 1–2 Dec: see below once run.)

## Not tried
- A series longer than 61 days (the fix's page size); a forced failure of the series read (the fix then deletes nothing).
