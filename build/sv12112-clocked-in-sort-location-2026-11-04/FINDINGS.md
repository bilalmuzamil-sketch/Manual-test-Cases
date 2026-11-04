# SV-12112 — Sorting Work Orders by "Clocked In" uses a count that ignores other locations (4 Nov 2026)
QA lead: API mode, no recording, no technical section. Builds: branch sv12112 v26.45.0-279650f; production v26.45.0-8e138e1.
Done-when (ticket): sorting by Clocked In orders rows by the same people the column shows.
Ticket text also says: "The counter also isn't refreshed when an open time record is created by hand."

## How it works (seen live)
List sorts with pagination[sortBy]=clockedInTechnicians; the column shows names, the sort uses clockedInTechniciansCount.
The count is recomputed only on line check-in / check-out (POST /api/work-orders/tasks/create + /api/technician-tasks/check-in; check-out
/api/technician-tasks/check-out). Hand-added open entries (/api/technician-tasks/create, or Reports > Timesheet Activities > New) do not refresh it.

## Recount cycle (admin clocks in then out on the WO, count read after each)
| WO | Set-up | Production | Branch |
|---|---|---|---|
| A (S2-1918 / S12112-17580) | 3 clock-ins at Lethbridge, WO at home location | 4 / 3 (counts other location) | 1 / 0 |
| D (S2-1919 / 17582) | 1 at Heavy Duty + 2 at Lethbridge | 4 / 3 | 2 / 1 |
| B2 (S2-1920 / 17585) | 2 hand-added at Heavy Duty | 3 / 2 | 3 / 2 |
| B (17581, Lethbridge WO, 2 Heavy Duty clock-ins) recounted from Lethbridge | — | 0 / 1 / 0 |
Screen sort, highest first: production puts S2-1918 (empty column) first, then 1 name, then 2 names = the bug; branch 2 names, 1 name, then empty rows; lowest first correct too.
Exhibit: ev/before-after-clocked-in-sort.png. Production saved list view restored (value identical, only updatedAt differs).

## Open point (asked to QA lead before verdict — Rule 97(d)) — ANSWERED 4 Nov: "Separate ticket"
A clock-in added by hand with no End time (Reports > Timesheet Activities > New) shows in the column but is not counted for the sort until someone
clocks in/out on that WO. Branch S12112-17584 shows "Admin ShopView" yet sorts last below two empty rows; production behaves the same (S2-1920 showed
2 names, count 0 before the recount). Picture: ev/question-hand-added-clock-in.png.

## Test data (left in place)
Branch: S12112-17580..17586. Production: S2-1918, S2-1919, S2-1920 (ZZAUTOTEST lines).
Lesson repeated: a new WO is created at the SESSION's location — change location to home before work-orders/create.

## Result — PASSED (4 Nov 2026)
QA lead's answer to the open point: "Separate ticket" -> filed **SV-12193** "Work Orders List: a clock-in added by hand isn't counted by the Clocked In sort"
(Bug, Medium, Product Area Work Orders, no parent — SV-12112 is a parentless Task — linked Relates SV-12112; 2 annotated pictures attached + embedded;
duplicate search first: 2 JQL queries, nearest SV-10579 Done = different cause). State re-verified live before filing (17584 names [Admin ShopView], count 0, last).
SV-12112 comment **80129** (green PASSED, before/after picture, 6 rows, separate-issue line, no tech section, no recording); label QAcomplete;
Task workflow has no QA Complete transition -> moved to **Ready for Production** (transition 5).
Pre-post gate: build markers re-read 10:43 CDT unchanged (branch v26.45.0-279650f, prod v26.45.0-8e138e1); ticket still TESTING QA, 0 comments;
text scan clean; comment read back (panel first, 1 media, 6 table rows). Learning check: playbook §BB + LESSONS row already added (commit d3dfc694).
SV-12039 re-checked live after the restart: QA Complete, label QAcomplete, comment 80124 is the only comment — nothing more to do.
