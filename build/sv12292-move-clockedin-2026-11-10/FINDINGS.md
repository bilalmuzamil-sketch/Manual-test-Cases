# SV-12292 — moving a running time entry recounts Clocked In on both work orders (10 Nov 2026)

Our own ticket (filed 6 Nov from SV-12193, on the QA lead's 6 Nov "YES - but report separately"). Fixed by Slavcho,
PR #4263 (branch SV-12292-move-recounts-clocked-in, open), back-end only: MoveCommandHandler now publishes the Clocked In
recount for the work order the open entry left and the one it joined; a closed entry recounts nothing.
QA branch sv12292 (front-end marker v26.45.2-6a8b89c = develop; fix is back-end). Moved to TESTING QA by Stefan 10 Nov 05:02 CST.
QA assignee empty. No Powertools plan, no handoff comment. Defaults: API mode, no recording, no technical section.
Accounting effect (Rule 121): none expected — only the stored count used for sorting changes; time and rates untouched.

## Production BEFORE (v26.45.3-fc08f23, Truck Hill 1, 10 Nov ~10:40 UTC) — reproduces
Open entry for ZZAUTOTEST N4 Dee created on S1-915 (201), moved to S1-914 via technician-tasks/move (201):
| WO | Clocked In shows | stored count |
|---|---|---|
| S1-915 (left) | nobody | 1 |
| S1-914 (joined) | ZZAUTOTEST N4 Dee | 0 |
Screen: Work Orders > All, search S1-91, Clocked In sorted most-first → S1-915 (empty) is FIRST, S1-914 (Dee) third
(ev/prod/list-sorted-desc.png). List preference restored (value identical, only updatedAt). Test data left in place.

## Branch AFTER — NOT RUN YET
Blocked: the `.qa.shopview.com` cookies (from 9 Nov 15:50 UTC) have expired; sign-in now redirects to Google.
Planned matrix (from the PR's tests + our 6 Nov repro): open WO→WO; move back; open → another line same WO (stays 1);
open → department (left WO drops to 0); closed entry moved (counts unchanged); two open on A, move one; screen sort both
directions; regression of SV-12193 hand-added clock-in + screen Clock out. Scripts in scripts/ (common.mjs uses /tmp/svqa12267).

## Our own record error (stated to the QA lead 10 Nov)
The register line for SV-12193 said the move finding was "not filed — report it or not?" — that was stale: SV-12292 had been
filed on 6 Nov on the QA lead's yes. I re-asked it on 10 Nov and he answered "No"; the ticket already existed and is now fixed.
