# SV-12193 — a clock-in added by hand isn't counted by the Clocked In sort (6 Nov 2026)
Our own ticket (found while testing SV-12112). API mode, no recording, no technical section (standing defaults). No Powertools plan. Not accounting.
Builds: QA branch sv12193 **v26.45.2-7507c64** (last-modified Fri 06 Nov 2026 13:39:56 GMT), re-read before posting 14:55 UTC unchanged. Production **v26.45.2-864113d**.
Developer handoff: Slavcho 80342 (09:38 CDT, posted WHILE I was testing — caught by the re-read before posting; Rule 59): (1) ticket case, (2) Split, (3) regression.

## Matrix (names shown in Clocked In vs the sort count, read from the list after each step; every row = MATCH unless noted)
| # | How the clock-in came / went | WO | Result |
|---|---|---|---|
| 1 | Screen: Timesheet Activities > New, no End (Admin ShopView) | S12193-17580 | 1 shown / 1 counted, at once |
| 1b | Same flow, Andrew Wilkinson | S12193-17588 | 1/1 |
| 2 | Two hand-added open entries | S12193-17581 | 1/1 then 2/2 |
| 3 | Hand-added WITH End | S12193-17582 | 0/0 |
| 4 | Screen Clock out (Timesheet Activities "Clock out" button, End typed) | 17583 1→0; 17581 2→1 | match |
| 5 | Own Stop (Stop working on > Clock Out) on hand-added entry | 17580 1→0 | match |
| 6 | Hand-added while session at Staging Lethbridge on a Heavy Duty WO | S12193-17586 | 0 shown/0 counted (consistent with SV-12112) |
| 7 | Line Start button (screen) | 17587, 17589 | 1/1 |
| 8 | Split, Start-clocked line (handoff case) | 17589 → new 17592 | original 0/0 + status approved; new 1/1 + in_progress |
| 9 | Split, hand-added line | 17590 → new 17593 | original 0/0 (stays approved); new 1/1 in_progress |
| 10 | Split with a person on each line | 17591 → new 17594 | 1/1 each; original in_progress |
| 11 | Line Stop + Clock Out on split-off WO (screen) | 17592 | 1→0, approved |
| 12 | Screen sort both directions (search S12193) | — | correct both ways (ev/list, ev/split, ev/final) |
| P | Production before: hand-added open on S2-1921 (ZZAUTOTEST N1 Tim 65732) | S2-1921 | 1 shown / 0 counted; least-first puts it FIRST above 6 empty rows (ev/prod) |
Production list prefs restored (value identical, only updatedAt).

## Not user-reachable, therefore not part of the verdict (Rule 94 — report + ask, do not file)
- Moving an OPEN entry to another work order via `POST /api/technician-tasks/move` (201) leaves counts behind: old WO shows nobody but counts 1, new WO shows the person but counts 0. On screen, open rows have ONLY a Clock out button (Timesheet Activities and the WO Timesheets page; no Edit), and `technician-tasks/change` on an open entry answers 400 "Active timesheets cannot be edited. Clock out the timesheet first." -> API-only. Asked the QA lead whether to report it. State cleaned afterwards (screen clock-out + recount) so the list on the branch is consistent.

## Side observation (Rule 93 bucket (d) UNVERIFIED — raised to QA lead, not in Jira)
Same open entry (Michael Stephenson, S12193-17581) reads **06:30 AM** on Reports > Timesheet Activities but **05:30 AM** on the work order's Timesheets page (… > Timesheets). Jira search (5 terms) found nothing matching; nearest SV-11590 (Done, Clock Out from a WO's Timesheets fills Start with the wrong time). Not checked on production; not investigated further.

## Posted
- Comment **80343** green PASSED (11 rows + production-vs-branch picture 1 + branch most-first picture 2 + how-to-see). No technical section, no recording.
- Label QAcomplete added (kept QA_Validation_Required); transition 10 -> **QA Complete**; QA Assignee already Bilal.
- Gate: build marker re-read 14:55 UTC unchanged; ticket re-read (Slavcho 80342 picked up, split tested before posting); text human, no AI fingerprint.
## Test data (left in place): S12193-17580..17594 on sv12193; S2-1921 open entry on production (ZZAUTOTEST N1 Tim 65732).
## Learning check: the mid-pass handoff (posted after I started) was only caught by the pre-post re-read — Rule 59 working as intended; added to LESSONS-INDEX. Recipes: Timesheet Activities "Clock out" needs the End typed; open entries can't be edited; split via button_bulk_more twice — already in playbook.

## Follow-ups (QA lead 6 Nov: "YES - but report separately")
- **SV-12292 filed** (Bug, Medium, Product Area Work Orders, label QA_Validation_Required, Relates SV-12193): a running
  entry moved via technician-tasks/move leaves the Clocked In sort count on the old WO. Re-verified live 2/2 on sv12193
  (S12193-17584 -> S12193-17585, Carol Ramos); console snippet (ev/jira-move/console-snippet.js) run in a real browser
  session first (201). Branch left in the moved state for the developer. Duplicate search: none.
- **Time difference = already reported as SV-12288** (customer STL Truck Centers, opened 6 Nov 12:40 CST, no repro steps).
  Measured: Timesheet Activities shows times in a daylight-saving zone one hour ahead after 1 Nov; the WO Timesheets page
  is right. Branch (Heavy Duty = America/Edmonton) 5/5 open + 3/3 finished entries +1 h; staging with session at
  Lethbridge (America/Edmonton) 3/3 +1 h (S2-38354 started 16:51 UTC -> shown 10:51 AM, correct 09:51 AM). Staging Heavy
  Duty is now Asia/Karachi (no DST) -> matches. Production: every location is in a zone without DST -> 3/3 match; setting a
  production location to America/Edmonton was blocked by the permission check, so production is NOT verified. Not filed;
  asked the QA lead whether to add these steps to SV-12288.
