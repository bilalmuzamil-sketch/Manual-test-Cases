# SV-9570 - Inspection 200-answer save limit (2026-11-06)

Mode: API mode (Board 2 default), no recording, no technical section. Sources: description, comments 75754-80241,
QA handoff 80327 (Dusan). No Powertools plan.

## Builds
- Production app.shopview.com v26.45.2-198e632 (last-modified 06 Nov 15:18 GMT)
- QA branch sv9570 v26.45.2-b7be383 (last-modified 05 Nov 16:50 GMT) - unchanged through the pass

## How the bug is reached (found from the app code)
Answers chosen with a field's own Pass / Fail / N/A buttons are kept as "Unsaved changes" and sent together by
Save & Exit (`POST inspections/{id}/responses`). "Mark field OK" / "Mark all OK" use a different path (mark-ok)
which saves at once - that is why the earlier production tries (mark-all, per-field OK) saved fine.

## Production before (template "ZZAUTOTEST SV9570 230 Fields 6062", 10 x 23 checkbox)
- Run 1 S2-1921 inspection cd5ed1f3: 230 answered with Pass -> Save & Exit -> 400 "A maximum of 200 responses can
  be saved at once." Reopen: 0/230, every section 0/23.
- Run 2 S2-1943 inspection fca721b1: same, toast captured on screen within 1 s. Reopen 0/230.
- Production allows 3 inspections per line ("Inspection limit of 3 per work-order line reached.").

## Branch matrix (WO S9570-17581, template "ZZAUTOTEST SV9570 230 Fields")
| # | Check | Result |
|---|---|---|
| 1 | 230 answered (Pass) -> Save & Exit (one save of 230) | PASS - 200, back to WO, reopen 230/230, all 23/23 |
| 2 | Partial: 3 sections (69 answers) -> save -> reopen | PASS - S1-3 23/23, S4-10 0/23 |
| 3 | Same inspection: remaining 161 answered mixed Fail/N/A/Pass -> save | PASS - 200, all 23/23, fail counts shown per section |
| 4 | Builder at 449 | no counter (correct) |
| 5 | Builder 449 -> 450 (duplicate) | "450 / 500 fields"; Save Draft OK |
| 6 | Builder 449 + Add Field > Instructions -> 450 | "450 / 500 fields" - instructions counted; Settings list shows 450 |
| 7 | Builder 499 -> 500 | "500 / 500 fields"; + Add Field and duplicate greyed, hint "Templates can have up to 500 fields."; forced extra click adds nothing |
| 8 | Publish at exactly 500 | "Inspection template published." |
| 9 | Back end refuses 501 fields | 400 "This template has 501 fields. Templates can have up to 500 fields - remove 1 field to save it." (set-up call) |
| 10 | Regression: starter "Air-Brake Inspection" built + published on screen, attached on screen, Mark all OK, Save & Exit, reopen | PASS (8/8, 5/5; text note stays 0/1 as expected) |
| 11 | Settings list counts | 230 / 14 / 449 / 450 / 500 match the builder |

Not testable (developer said so in 80327): over-500 banner, greyed-out picker entry, older >500 inspections still
fillable - need a template that already had >500 fields; the builder and the server now refuse to create one (row 9).

## Issue 4 (open - QA lead ruling needed)
Template with 448 checks + 2 Instructions: Settings 450, inspection "0 / 448 fields complete" - same shape as the
customer's 236 vs 234. Dusan (80241, 80327): by design, "Your call" to Milos; Milos has not answered.
Issue 3 (deleting auto notes): out of scope per 80327, not tested.

## Test data left (branch, no cleanup needed)
Templates ZZAUTOTEST SV9570 230 / 449 x3 / 450 / 499(500) / 501(empty) / Air-Brake; WOs S9570-17581, S9570-17582.
Production: template 2b30b6fd (230 fields), inspections cd5ed1f3 (S2-1921), fca721b1 (S2-1943) left unsaved.

## Posted 9 Nov 2026 ~08:08 UTC (QA lead: PARTIALLY PASSED, "It should be rejected from testing")
Pre-post gate: sv9570 marker v26.45.2-b7be383 unchanged; ticket TESTING QA, last comment Dusan 80327. Inspection of template "449 Fields 2146" confirmed live on S9570-17582 (API, 9 Nov).
Comment **80446** WHAT PASSED (10 rows, pictures 1-2) + **80447** PARTIALLY PASSED, tags Milos with issue 4 as a plain A/B/C question (picture 3 ev/jira/03-issue4-450-vs-448.png, scripts/exhibit_issue4.py). QA Assignee Bilal, -> REJECTED FROM TESTING (transition 15).
