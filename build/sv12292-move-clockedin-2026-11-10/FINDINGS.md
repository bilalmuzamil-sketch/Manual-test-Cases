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

## Branch AFTER — DONE 10 Nov (fresh cookies from QA lead), sv12292 v26.45.2-6a8b89c (last-mod 09:46:28 GMT, etag ab0659..., re-read before posting: same)
Seed S12292-17580..17587 (Heavy Duty). ev/branch-matrix.json: 26 reads, 0 MISMATCH (names shown == stored count every step):
1 A->B (17580->17581, Michael Stephenson) 0/1; back 1/0; again 0/1 · 2 same-WO other line (17582) stays 1 ·
3 to department "Shop Time (Shop hand)" (17583) 1->0 · 4 closed entry 17584->17580: 0/0 unchanged · 5 two open on 17585, one to 17586: 1/1.
Screen: Work Orders > All, search S12292, Clocked In most-first and least-first both correct (ev/branch/list-sorted-*.png).
SV-12193 regression: Timesheet Activities > New (screen, no End) on 17587 -> 1; own Stop > story > Clock Out (screen) -> 0.
Note: the seed script's staff names differ from who shows (staff list id mapping), so the table uses the names shown on screen.
## Posted
Comment 80640 green PASSED (8 rows + before/after picture f55eafc3), no technical section, no recording. Edited once in the same
minute (line about time/hours/pay rate reworded to what the code change covers; dated note 06:00 CST — first note said 05:12, corrected).
Label QAcomplete added, QA Assignee Bilal, transition -> QA Complete.
Gate: marker re-read before posting (same), ticket re-read (no comments, TESTING QA), voice scan clean.
Planned matrix (from the PR's tests + our 6 Nov repro): open WO→WO; move back; open → another line same WO (stays 1);
open → department (left WO drops to 0); closed entry moved (counts unchanged); two open on A, move one; screen sort both
directions; regression of SV-12193 hand-added clock-in + screen Clock out. Scripts in scripts/ (common.mjs uses /tmp/svqa12267).

## Our own record error (stated to the QA lead 10 Nov)
The register line for SV-12193 said the move finding was "not filed — report it or not?" — that was stale: SV-12292 had been
filed on 6 Nov on the QA lead's yes. I re-asked it on 10 Nov and he answered "No"; the ticket already existed and is now fixed.
