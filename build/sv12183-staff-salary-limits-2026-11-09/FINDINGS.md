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
