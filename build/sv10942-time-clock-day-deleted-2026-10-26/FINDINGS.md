# SV-10942 — Time Clock: a day's punches deleted after clocking in again (26 Oct 2026)

Mode: **API** (QA lead). Task: reproduce on production. Result: **NOT REPRODUCED** through the user's own clock.
Production `app.shopview.com` build **v26.43.1-9af7270** (last-modified Fri 23 Oct 2026 08:55:52 GMT), read at start and before posting.
Users: Admin Bilal Muzammil (staff 3d2a9387…, location Trucks Hill 2, Africa/Accra) on desktop 1440; Technician 1
(bilal.muzamil+tech, staff a1d7fb4a…, location For Ryan, Africa/Abidjan) on 390×844 touch, dpr 2–3.
Sources: ticket description (2 customer cases), comments 78259 (Parth: not reproducible locally) and 79397 (Milos: please try).

## Matrix (day's punches read after every step; "LOST" = ids present before and missing after)
| # | Variant | Requests | Result |
|---|---|---|---|
| 1 | header clock in → out → in → out (Admin) | department-clock-in 201 / department-clock-out 201 | LOST none |
| 2 | stale tab: tab B clocks out, tab A (still showing timer) Clock Out | department-clock-out without task_id → 400 "ID is missing." | toast "ID is missing.", LOST none |
| 3 | stale tab A: tick Department1 → Start | same 400 | LOST none |
| 4 | normal switch (tick deparrtment3 → Start) | clock-out 201 + clock-in 201 | LOST none |
| 5 | double click department in Clock In window | one clock-in 201 | LOST none |
| 6 | clock-in sent twice back to back (API, crash/retry) | 201 then 400 "You are already clocked in." | LOST none |
| 7 | browser sessions closed while clocked in ~46 min, fresh session clock-out | 201 | LOST none |
| 8 | phone (Technician 1): stop clock running since 2026-06-30 (`check-out`), then in/out/in/out | 201s | LOST none; June entry kept (Jun 30 → Oct 26) |
| 9 | phone menu > Timesheets (`/timesheets`) | read-only | no delete control |
| 10 | overlap rule: admin New entry 5–6 PM over Technician 1's punches | popup only, Cancel | "2 entries will be permanently deleted, 1 entry will be shortened"; Cancel kept all |

Final counts: Admin today 9 punches, all listed; Technician 1 today 2, both listed.

## Likely explanation (not confirmed)
SV-10696 overlap rule: New/Edit/Clock Out (timesheet create/edit permission) deletes covered entries. Silent before
v26.43.0 (fixVersion, resolved 2026-10-22); the customer's cases were reported ~6 Oct. Related open: SV-11590 (Clock Out
from WO Timesheets fills Start with the wrong time, Ready to Fix). Customer data not accessible.

## Side observations (Rule 93 buckets)
- Stale-tab Clock Out / Start → 400 "ID is missing." toast (bucket d — user-facing message, no data effect). Jira searched
  ("ID is missing", clock out + tab): no matching ticket (SV-7637 Done is a different path). Not filed; asked QA lead.
- Report "Total Hours" for the stopped June entry reads 3.23 h for Jun 30 → Oct 26 (bucket d, unverified, outside ticket).
- Admin's own account already had an entry Aug 28 → Oct 30 (S2500-137), from earlier testing — avoided for overlap test.

## Posted
Comment **79536** (yellow panel "REPRODUCTION ON PRODUCTION: NOT REPRODUCED", @Milos @Parth, 9-row table, pictures 1–4,
steps for the overlap window, could-not-test). Read back: panel, 10 table rows, 4 media as attachments in order, ol 4.
Gate: production marker unchanged; ticket Blocked, 2 comments, none new; wording scan clean; no technical section; no
recording (API mode). Ticket not transitioned.

## Test data left on production (no cleanup per ruling)
ZZAUTOTEST punches dated 2026-10-26 (Department1/deparrtment3) for Bilal Muzammil and Technician 1; Technician 1's
30 June clock now stopped. Admin location restored to Trucks Hill 2 after the location switches.

## Learning check
- Timesheet New dialog date format: "Oct 26, 2026 09:00 AM" (other formats → "Start date is invalid — use Jan 5, 2026 09:30 AM").
- Own active row on Timesheet Activities shows **Stop**; another person's shows **Clock Out** (buttons sit off-screen right at 1440).
- Reports are location-scoped: switch with `POST /api/iam/change-location` to read another location's entries.
Recorded in the playbook.
