# SV-12183 — Staff salary / hourly rate accepts negative values (9 Nov 2026)

Ticket https://shopview.atlassian.net/browse/SV-12183 (Bug, assignee Dipesh, reporter Milan, QA Assignee empty, no Powertools plan). Rulings: Chris Ward 80116 (block negatives everywhere — dialog, our API, public API; hourly 0–9,999.99; annual salary 0–9,999,999.99; 0 allowed; existing negatives left alone until next edit; fix 19.99→19.98 and 0-cleared). Fix: PR #4250 (`SV-12183-staff-salary-validation`, head d77ad06), test plan in the PR body.
Mode: Board-2 defaults (API mode, no recording, no technical section). Found by the 3-hourly check 9 Nov 18:31 UTC.

## Environments
- Branch sv12183 (was asleep — woken via toggleQaEnv), build **v26.45.2-ad81f0b**, Staging Heavy Duty - 9919, Admin quick-login, Chrome 1600×900.
- Production app.shopview.com build **v26.45.2-107ad4b** (before).

## Results — branch (Staff dialog driven on screen)
| # | Check | Result |
|---|---|---|
| 1 | New Staff Member, Hourly 19.99 → saved and reopened | PASS: stored 19.99, reopen 19.99 (staff ZZAUTOTEST SV12183 A 58404) |
| 2 | Edit, Hourly -1 | PASS: "Hourly rate cannot be lower than 0", Save sends nothing, dialog stays |
| 3 | Edit, Hourly 10000 | PASS: "Hourly rate cannot be higher than 9,999.99", nothing saved |
| 4 | Edit, Hourly 9999.99 | PASS: saved, reopens 9,999.99 |
| 5 | Switch type to Salary with 10,000 typed | PASS: error clears (label "Salary") |
| 6 | Salary 10000000 / -1 | PASS: "Salary cannot be higher than 9,999,999.99" / "Salary cannot be lower than 0", nothing saved |
| 7 | Salary 9999999.99 | PASS: saved, reopens 9,999,999.99 |
| 8 | Back to Hourly with 9,999,999.99 in the box | PASS: error shows at once |
| 9 | Edit to 0 → reopen | PASS: 0.00 (not blank) |
| 10 | Edit to 19.99 → reopen | PASS: 19.99, list 19.99 |
| 11 | New Staff Member with -5 | PASS: error, no request sent |
| 12 | New Staff Member, Salary 0 | PASS: stored 0, reopens 0.00 |
| 13 | Internal API `staff/{id}/change` -1, -0.01, 10000 (hourly), 10000000/-1 (salary) | PASS: 400 "Hourly rate must be between 0 and 9,999.99." / "Salary must be between 0 and 9,999,999.99."; value unchanged |
| 14 | Internal API change 9999.99 / 0 / 19.99 / salary 9999999.99 | PASS: 201, stored exactly |
| 15 | Internal API `iam/create` (dialog's own body) -5, 10000, salary 10000000, -1 | PASS: 400 with the same messages; 5 and 19.99 → 201 |
| 16 | Public API `PATCH /api/v1/staff/{id}` | BLOCKED: every call 401 "Open API is not enabled for this organization." Org flag `openapi` off; `POST /api/organization/feature-flags` → 403 (admin-portal token only, same as SV-11527). Test key minted then revoked. |
| 17 | Existing negative rate left alone; next edit needs a valid value; name-only public PATCH → 200 | BLOCKED: 0 of 67 staff on the branch have a negative rate and the fix blocks every write path (dialog, both APIs, domain). PR tests seed it directly in the DB. |

Side note (API-only, not filed — Rule 94, ask QA lead): `POST /api/iam/create` with department NAMES instead of ids answers **500** (my malformed body; the screen always sends ids).

## Production (before) — same steps on screen
- New staff Hourly 19.99 → stored **19.98**, reopens 19.98 (ZZAUTOTEST SV12183 P1 60548).
- Edit -5 → saved, reopens -5.00. Edit 10000 → saved. Edit 0 → reopens **blank**, list salary **null**.

## Done on Jira
- Comment 80537 tagging Dipesh with the 2 needs (Rule 122); ticket moved TESTING QA → **Blocked** (Rule 122).
- Not done: the accounting effect (Rule 121) — rates are copied onto time records as pay rate; not checked (needs a clock-in as the new staff). Raised to the QA lead.

## 10 Nov 2026 ~06:10 UTC — unblocked (Dipesh, Slack DM 10 Nov 09:45 +04: Open API on for d55bc308; "ZZAUTOTEST SV12183 A 58404" saved at -5.00)
Branch sv12183 (same build as 9 Nov). Public API = `/api/v1/staff/{staff id}` (the user id answers 404 "Staff not found."), values in cents. Test key minted per run and revoked (204), never printed.
| # | Check | Result |
|---|---|---|
| 16a | Name-only PATCH `{"first_name":"ZZAUTOTEST2"}` then back, on A 58404 (stored -500) | PASS: 200 both, salary stays -500 |
| 16b | Pay change on a negative-rate staff without a valid value: `{"salary_type":"salary"}`, `{"salary_type":"hourly","salary":-500}` | PASS: 422 "salary must be between 0 and 999999999 / 999999 cents for this salary_type."; stays -500 |
| 17a | Screen: Edit Staff Member on A 58404 → Hourly Rate shows -5.00; Save & Close unchanged | PASS: error "Hourly rate cannot be lower than 0", no request, window stays (ev/branch-N1-after-save.png) |
| 17b | Screen: same window, rate 5 → Save & Close → reopen | PASS: change 201, reopens 5.00, list 5 (ev/branch-N2-*) |
| 16c | Public PATCH -5000, "abc", -1, 1000000 (hourly) | PASS: 422 each ("…between 0 and 999999 cents…" / "salary must be an integer number of cents or null."); value unchanged |
| 16d | Public PATCH 999999, 0, 1999 | PASS: 200, stored exactly |
| 16e | salary_type salary + 5000000 → 200; then `{"salary_type":"hourly"}` alone → 422; 999999999 → 200; 1000000000 → 422; back to hourly 500 → 200 | PASS (matches openapi.yaml) |
Production before (public API, ZZAUTOTEST SV12183 P1 60548, staff 2343a183…): `{"salary":-5000}` 200 stored -5000; `{"salary":1000000}` 200 stored; then 0. Raw lines: ev/ev-pubapi-10nov.txt (branch).
Still open: Rule 121 time-record pay rate — department clock-in (`POST /api/technician-tasks/department-clock-in`, self only) freezes `$staff->getHourlyRate()`; checking it means changing the admin's own rate and clocking in. Asked the QA lead before posting.

## 10 Nov 2026 ~06:45 UTC — Rule 121 time-record pay rate (QA lead: "Run it, then post")
- Where the frozen rate is readable: `GET /api/technician-tasks/list?filters[0][field]=work_order&filters[0][value]=<wo>` returns `hourly_rate` (cents) per time record; it only lists time clocked on a WORK ORDER (it filters on the work order's location), so department clock-ins never show there.
- Branch sv12183 (v26.45.2-ad81f0b): Admin ShopView (staff 7f85bc58) Edit Staff Member → Hourly 19.99 → Save & Close → reopens 19.99 (ev/branch-TR-admin-*). Work order S2-17435, line "Service - CVIP inspection single or tandem axle": green Start (check-in 201) → 65 s → Stop → story "ZZAUTOTEST SV12183 pay rate check" → Clock Out (check-out 201). Time record e9062d02: **hourly_rate 1999** (= $19.99 exactly), 06:44–06:45 (ev/TR-*.png, ev/TR-log.txt). PASS.
- Production: the Edit Staff Member window saves 19.99 as 19.99 (only New Staff Member saves 19.98), so a production clock-in would also read 1999 — not run; nothing to show. My own production staff record (bilal.muzamil@shopview.com, staff 3d2a9387) was set to 19.99 for this and **restored to blank (salary null, type null)**, departments intact.
- Admin's branch rate left at 19.99 (per-ticket branch, no cleanup).

## Posted 10 Nov 2026
- Comment **80555** (green PASSED, 11 rows, 2 pictures: `ev/exhibits/01-before-after-negative-rate.png`, `02-existing-negative-rate.png`, built by `scripts/exhibit.py`, uploaded as real attachments). Pre-post gate: branch marker v26.45.2-ad81f0b (unchanged), ticket Blocked with last comment our 80537, no technical section, human voice.
- Label QAcomplete; QA Assignee set to Bilal (was empty); status Blocked → Ready to Fix → In Progress → Code Review → TESTING QA → **QA Complete** (Blocked offers no direct route). Read back: QA Complete, QAcomplete, QA Assignee Bilal.
- Still open with the QA lead (not on the ticket, Rule 94): API-only 500 from `POST /api/iam/create` when departments are sent as names.
