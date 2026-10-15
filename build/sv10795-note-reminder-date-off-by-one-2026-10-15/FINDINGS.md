# SV-10795 — Work order note reminder date saves/shows one day early

- Ticket: https://shopview.atlassian.net/browse/SV-10795 (TESTING QA, Medium, Bug, reporter Ryan Fyfe; customer Jason Lucas, NJDRP, Chrome, New Jersey). No developer comments, no handoff.
- QA branch: https://sv10795.qa.shopview.com (build v26.40.17-5d3a257, last-modified Wed 14 Oct 2026 23:28:00 GMT). BEFORE: production (Rule 86).
- QA lead answers (2026-10-15): **No recording** · **No technical section**.

## Source of truth (Rule 66)
Customer: *"I wanted to set a reminder date of tomorrow (10/2) on a work order note … it showed and saved my reminder for the current day (10/1) in red"*; *"If I set the reminder for 10/3, It displayed and saved as 10/2"*; steps *"view work order, notes tab, new note, complete dialogue box, add date, save"*. Support impersonating him saw the correct date — so the user's own environment matters: the customer is in New Jersey (US Eastern, UTC−4 in October), support was not.
Expected (ticket): *"When a reminder date is set to a specific date, the reminder should display and save for that same selected date."*

## Variant matrix (written BEFORE testing — Rules 96/106)
Dimensions: the browser's timezone (behind UTC / UTC / ahead of UTC), the time of day (local date = UTC date, and local date ≠ UTC date), the way the date is entered (calendar click / typed), the date picked (tomorrow / a later date / across a month end / across the US clock change on 1 Nov), and every place the date shows (dialog after picking, Notes list after Save, reopening the note to edit, after a reload, seen from a browser in a different timezone).

| # | Case | Branch | Production BEFORE |
|---|---|---|---|
| T1 | New York browser, pick tomorrow in the calendar → the date shown in the list = tomorrow, not red | PASS — NY 14 Oct 11:18 PM (UTC already 15 Oct): picked Oct 15 → stored 2026-10-15 → shown "Oct 15, 2026" grey | FAIL (before) — same steps: stored 2026-10-15, shown "Oct 14, 2026" RED |
| T2 | New York, pick a later date (+2 days) → shown as picked | PASS — +2: Oct 16 shown Oct 16 | FAIL — Oct 16 shown "Oct 15, 2026" |
| T3 | New York, type the date instead of clicking | N/A as typed: the Reminder Date box is read-only (calendar or Today button only). Today button: Oct 14 → stored 2026-10-14 → "Oct 14, 2026" red (due today) — PASS | not run |
| T4 | New York at a time when the local date = UTC date (morning) and when it differs (evening) | PASS — NY 15 Oct 10:00 AM (clock set): picked Oct 16 → shown Oct 16 grey | FAIL — picked Oct 16 → shown "Oct 15, 2026" RED (the customer's exact report: tomorrow shows as today, in red) |
| T5 | Los Angeles and Honolulu (further behind UTC) | PASS — Los Angeles (8:25 PM) and Honolulu (5:25 PM): picked Oct 15 → shown Oct 15 | FAIL — Los Angeles: Oct 15 → "Oct 14, 2026" red |
| T6 | UTC browser and an ahead-of-UTC browser (Karachi, Tokyo) | PASS — UTC, Karachi, Tokyo, Kiritimati: picked Oct 16 → shown Oct 16 | Karachi: correct (Oct 16) — ahead of UTC never showed the bug, which is why support impersonating saw the right date |
| T7 | Month end (Oct 31 → Nov 1) and the US clock change (pick 2 Nov) | PASS — NY 31 Oct 8 PM: Nov 1 → Nov 1; Nov 2 (after the US clock change) → Nov 2 | not run |
| T8 | Reopen the saved note (edit dialog shows the same date) and reload the page | PASS — edit dialog reopened showing the saved date (Oct 16); fresh page loads show every note's stored date | not run |
| T9 | A reminder saved from New York, viewed from Karachi (and the other way round) shows the same calendar date | PASS — all 13 notes (then 14) viewed from New York, Karachi and Honolulu: 0 mismatches | FAIL — the same 5 production notes: New York 5 of 5 one day early; Karachi 5 of 5 correct |
| T10 | Red colouring: a reminder for tomorrow is not red; today/past is (whatever the screen's rule is, it follows the picked date) | PASS — red = due: in New York today's (Oct 14) reminder is red, later ones grey; in Karachi (already 15 Oct) the Oct 15 ones are red | FAIL — tomorrow's reminder shown red because it is displayed as today |
| T11 | Editing a note's existing reminder to a new date saves the new date | PASS — edited Oct 16 → Oct 19: update sends "Oct 19, 2026", card shows Oct 19, fresh load Oct 19 | not run |

## Results
(filled in as observed)


How each was observed: Playwright browser with `timezoneId` set (harness `tz` option, added this pass), clock fixed with `page.clock.install` for T4/T7. The date is chosen in the calendar exactly as a user does; the save request, the stored `reminderDate` (from the page's own notes request) and the card's shown text + colour are recorded for every case (`data/nt-*.json`, `data/nv-*.json`).
Root cause visible from the evidence: the stored value is always the picked date (`2026-10-15`); production displays it one day early in any browser behind UTC, at any time of day. The branch displays the stored date as-is.

## Verdict
PASSED — all cells pass on sv10795 v26.40.17-5d3a257; production reproduces the customer's report in every behind-UTC case.

## Side observation (explained, not a defect — not raised)
After moving Lines → Notes with the tabs, one click on **New Note** opens two identical New Note dialogs stacked on top of each other (going straight to the /notes address opens one). Saving the top one closes both and creates exactly one note; branch and production behave the same (DD-B / DD-P). Nothing a user can see goes wrong.

## Pre-post gate (2026-10-15 ~04:00 UTC)
- Branch marker read during the walk: v26.40.17-5d3a257 (14 Oct 23:28:00 GMT) — unchanged for the whole pass.
- Ticket re-read live: TESTING QA, Medium, 0 comments.
- Steps walked live in a New York browser exactly as written: Work Orders → Search S10795-17580 → click the number → Notes → New Note → calendar → tomorrow → Save → "Oct 15, 2026" grey. Step 2 corrected (open by clicking the work order number).
- Voice scan clean; no technical section; no recording.
- Posted **78744** (2026-10-14T22:59:45-0500). Read back: first line "OVERALL QA STATUS: PASSED", 2 media `type:file`, 11 table rows (header + 10).

## Learning check
- Date bugs that depend on the browser's time zone: `qa-session.mjs` now takes `tz` (Playwright `timezoneId`); fix the time of day with `page.clock.install({time})` before navigating. Playbook §AR.
- The Reminder Date box is read-only (calendar or Today button only).
