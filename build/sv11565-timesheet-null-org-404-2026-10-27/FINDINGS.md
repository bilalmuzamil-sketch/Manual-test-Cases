# SV-11565 — Timesheet save with a department / work order / line that has no organization (27 Oct 2026)

Mode: **API** (QA lead chose "API (faster)"). No recording, no technical section. Labels/QA assignee checked: no
`accounting` label, QA Assignee empty.
Branch `sv11565`: front end `v26.43.1-baa44e3` (index last-modified Mon 26 Oct 2026 17:36:41 GMT, etag `90672850…`).
Before: staging `v26.43.1-f2d183d` (Fri 23 Oct 2026 12:02:14 GMT) — production cannot reach this path (ticket: "the change
endpoint only reaches it on develop (SV-490)").
Sources: ticket description (no comments, no test plan); SV-11520 (QA 21 Oct: unknown department → 404 "Department was
not found", work order → 404 "Work Order was not found").

## Request shape (captured from the Edit Timesheet screen on sv11565)
`POST /api/technician-tasks/change {id, start_date:'26/10/2026 21:58', end_date, tech_assigned_id, description,
department_id}` then `POST /api/technician-tasks/move {id, department_id}` → both 201.

## Matrix — sv11565 (fix) vs staging (before), same requests
| # | Reference sent | sv11565 | staging |
|---|---|---|---|
| A | valid department (normal save) | 201 | not sent (shared data) |
| B | unknown department id | 404 'Department' was not found | 404 same |
| C | department created then deleted | 404 same body as B | 404 same |
| D | move to unknown department | 404 same | 404 same |
| E | move to deleted department | 404 same | 404 same |
| F | valid work order + line (normal save) | 201 | not sent |
| G | unknown work order id | 404 'Work Order' was not found | 404 same |
| H | unknown line id | 404 'Line' was not found | 404 same |
| I | line deleted on screen (right-click → Delete line, 200) | 404 'Line' was not found | not valid (see below) |
| J | work order deleted (`work-orders/delete` 201) | 404 'Work Order' was not found | 404 same |

Regression on screen (sv11565): Reports → Timesheet Activities → Edit Timesheet on the department entry → choose
Administration → Save → change 201 + move 201.

## The core case is not reachable
Deleting a department, line or work order does **not** leave a row with an empty organization — both builds answer it
exactly like an unknown id. No screen or request found creates a department, work order or line without an organization
(create calls take the organization from the signed-in session). So the ticket's own failing input (a NULL-organization
row → 500) could not be built on either environment, and the before/after difference cannot be shown. Ask the developer
how to produce one on sv11565, or whether it is only covered by his functional test.

Side observation (bucket: unverified, not reported): the Edit Timesheet window shows the department as a raw id
("0653be2e-…-Db3526cccebb") instead of "Shop Time (Shop hand)" for an entry on a live department that is not in the
admin's own department list. SV-11520 noted the same display for deleted departments.

## Staging data I changed by mistake — and what was restored
Staging row I (deleted line) used a real person's old entry (Brett Guerra, 28 Jan 2025, S-4011 "Evacuate and recharge air
conditioning system", entry `7a42170f-…`). My API line-delete had failed (wrong payload, 500), so the line still existed and
the change was ACCEPTED: the entry moved to my test work order S2-38096 line "Service - PDI" and its times showed 5 h earlier.
Restored: times back to 14:27–15:22 and description back to empty (verified by reading the list). **Not restorable:** its
original line `8f41bb60-…` no longer exists on S2-4011 (the entry was already orphaned — the SV-11520 case), and the server
refuses to point it back ("Line was not found"), so the entry stays on S2-38096. Lesson recorded in LESSONS-INDEX.

Test data: sv11565 departments created + deleted, work orders (W1 kept, W2 deleted); staging dept a3e82c8a created + deleted,
work orders S2-38096 (kept, holds Brett's entry) and a deleted one.

## 27 Oct — BLOCKED, question to Slavcho (comment 79548)
Posted 79548 tagging Slavcho Mitrov: how to create a department / work order / line with no organization on sv11565, or is
it covered only by his automated test. Ticket TESTING QA → **Blocked**. Mention read back.

## 27 Oct ~08:40 UTC — Slavcho's answer (79553) and our reply (79555)
- Slavcho: a department / work order / line with no organization cannot be created in the app (the column was added in
  2023; only older rows can be empty). Covered by the PR's automated tests for create, change, move and department
  clock-in. Offered: pass on what was checked, OR a developer empties the organization of a test department on sv11565.
- Coverage gap found on re-reading his list (Rule 91): my matrix covered **change and move only**. **Create** and
  **department clock-in** with unknown / deleted references were NOT run. Tried to run them now: blocked — the
  `.qa.shopview.com` sign-in has expired (quick-login → 401 `sso_required`, browser lands on Google sign-in).
- Reply 79555 (mention read back): accepted his offer — asked him to empty the organization on one test department, one
  work order and one line on sv11565 and name them; said we'll run create / change / move / clock-in against them and also
  finish create + clock-in with unknown/deleted references. Ticket stays **Blocked**.
- Needed: fresh `.qa.shopview.com` cookies; Slavcho's prepared records.

## 27 Oct ~09:05 Edmonton — create + department clock-in with unknown / deleted references (the gap from 79555)
Fresh cookies arrived. Build `v26.43.1-baa44e3` unchanged. Request shapes captured from the screen first (Rule 88):
Reports → Timesheet Activities → **New** → "New Timesheet" dialog (Select Staff / Select Department / Work Order / Line /
Start / End / Create; dates typed as "Oct 26, 2026 08:10 AM", future dates refused with "Start date cannot be set in the
future"; the admin's department list offers only "Administration").
- Department entry: `POST /api/technician-tasks/create {start_date, end_date, tech_assigned_id, department_id,
  resolve_overlaps:true}` → **201** (entry 71d8f5fc, Administration, 26 Oct 08:10–08:15).
- Work-order entry: same + `work_order_id, line_id` (no department) → **201** (entry a5e9eaf2, S11565-17582 line 1 "Service -
  Full Grease Service", 09:10–09:15).

State proven before use: deleted department fc5d1ccf absent from the department list; W1 (S11565-17582) Lines tab carries
line l1 fca24719 and NOT l2 5ebd88d1 (deleted on screen in the earlier pass); W2 ab41359d → 400 "Not found".

| # | Request | sv11565 (fix) | staging (before) |
|---|---|---|---|
| C1 | create, unknown department | 404 'Department' was not found. | 404 same |
| C2 | create, deleted department | 404 'Department' was not found. | 404 same |
| C3 | create, unknown work order | 404 'Work Order' was not found. | 404 same |
| C4 | create, unknown line | 404 'Line' was not found. | 404 same |
| C5 | create, deleted line | 404 'Line' was not found. | not sent (staging l2 delete had failed — the line may still exist) |
| C6 | create, deleted work order | 404 'Work Order' was not found. | 404 same |
| K1 | department clock-in, unknown department | 404 'Department' was not found. | not sent — staging Admin already clocked in (S-38095 since 26 Oct 22:00); not clocked out because it may be another tester's live session |
| K2 | department clock-in, deleted department | 404 'Department' was not found. | not sent (same) |
| K3 | department clock-in, Administration (regression) | 201; header shows running timer "Administra.."; Clock Out from the header dialog "Stop working on Administration" → `department-clock-out {task_id, description}` 201 | — |

Nothing saved by the refused creates: on Timesheet Activities the only Admin entries for 26 Oct are the six earlier
ZZAUTOTEST ones plus the two created on screen today (08:10, 09:10); none at 11:30–12:20 (the times the refused requests
used). Evidence: ev/n2-after.png, ev/n3-after.png, ev/k4-w1-lines.png, ev/k4-timesheet-after.png, ev/k7-header-clocked-in.png;
data/k1-branch.json, data/k8-staging.json. (My own first clock-out attempt by API returned 400 "ID is missing." because my
script read the wrong field from the clock-in response and sent an empty id — not a product fault; the screen's identical
request succeeded.)
Staging note: a first staging run used throwaway staff Wes Hover and got "'Staff' was not found." before any reference check
— not comparable, discarded; re-run with Admin's own staff id (above).
**Still open:** the ticket's own case — a department / work order / line whose organization is empty — waits on Slavcho
naming the records he empties on sv11565 (79555). Ticket stays Blocked; nothing posted.
