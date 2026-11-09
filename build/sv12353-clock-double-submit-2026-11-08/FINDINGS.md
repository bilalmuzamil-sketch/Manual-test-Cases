# SV-12353 — Handle failed technician clock actions and prevent duplicate submissions (8 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12353 (Bug, TESTING QA, assignee Stefan Mitrovic, labels FE/sentry-sync, no QA assignee, no Powertools plan). QA branch https://sv12353.qa.shopview.com. Sentry SHOPVIEW-APP-4FV.
Mode: Board-2 defaults.

## Production BEFORE — v26.45.2-132dcb4 — S2-1920 (ZZAUTOTEST Aabridge Freight), line 1 (1ecdd840…), logged in as the admin user
| # | Layout | Action | Requests | What the user sees | Uncaught error |
|---|---|---|---|---|---|
| 1 | Desktop 1600 wide | 2 clicks 50 ms apart on the line's green **Start** | 1 check-in (201) | clocked in, button turns red **Stop** | none |
| 2 | Desktop | **Stop** → story → 2 clicks 60 ms apart on **Clock Out** | 1 check-out (201) | "Timesheet clocked out" | none |
| 3 | Phone (Chrome preset iPhone 12 Pro, touch) | 2 taps 80 ms apart on the line card's green **Start** | **2 check-ins: 201 then 400** "You are already clocked into different line." | clocked in, plus a yellow warning **"You are already clocked into different line."** although the user clicked only this line | **YES** "Request failed with status code 400" |
| 3b, 3c | Phone, rounds 2 and 3 | same double tap | 201 then 400 both times | same warning both times | **YES** both times |
Phone double tap: **3 of 3** rounds sent two check-ins, showed the misleading warning and threw the uncaught error. Admin clocked out after each round; final state Start (not clocked in).
Desktop paths are already protected on production; the phone card is the unprotected one, matching the ticket's own analysis ("The mobile card's loading input follows general line loading while task actions update a separate flag").
Logs: ev/prod-*-log.txt. Clean-up: admin clocked out at the end of each round (story "ZZAUTOTEST SV12353 story").

## Branch AFTER — sv12353 v26.45.2-9444adc (last-modified Sun 08 Nov 2026 00:53:07 GMT), 9 Nov 2026
S2-15658 lines 75fb9874 (Note) / 241ddef4 (Sublet - Tow).
- Phone (iPhone 12 Pro preset) double tap Start at 30/80/200/400 ms: ONE check-in each (4/4), no toast, 0 uncaught (ev/branch-phone-*-log.txt).
- Phone double tap Stop: Stop window once. Desktop double click Start: 1 check-in. Desktop Clock Out double click: 1 check-out, "Timesheet clocked out".
- Start on line B while clocked into A (same screen): switch window opens (desktop + phone), as production.
- Genuine refusal (stale screen; clock-in on line A sent outside the tab via the API with A's task id, then Start on B): branch desktop + phone -> 400 "You are already clocked into different line.", toast once, Start enabled, 0 uncaught. Production desktop + phone (S2-1919 A / S2-1920 B) -> same toast PLUS uncaught "Request failed with status code 400" (2/2). (scripts/stale.mjs)
- Empty story Clock Out accepted on both builds.
Posted comment **80474** PASSED (8 rows, picture ev/jira/01-phone-double-tap-prod-vs-branch.png). Gate: marker unchanged; ticket TESTING QA 0 comments. QAcomplete + QA assignee Bilal + QA Complete. Admin left clocked out on both builds.
Planned: phone double tap Start (several gaps 30/80/200/400 ms) → one check-in, no warning, no uncaught error · phone double tap Stop → window once ·
desktop double click Start / Clock Out (regression) · a genuine refused clock-in (clocked into another line, then Start on this line) → clear message, no uncaught error,
button usable again · successful clock in/out still refreshes the line (Start↔Stop, timer) · switch task from the Stop window.
