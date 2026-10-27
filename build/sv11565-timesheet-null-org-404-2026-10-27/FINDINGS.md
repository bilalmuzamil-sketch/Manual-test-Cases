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
