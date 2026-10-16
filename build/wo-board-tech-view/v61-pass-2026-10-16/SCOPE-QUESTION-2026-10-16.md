# WO Board and Tech View: full pass or targeted update? (16 Oct 2026, Rule 122 as amended today)

Nothing has been changed in TestRail for this. Evidence files: `quote-currency-v61.json` (every quote of 266 cases checked
against PRD v61), `cases-text/` (the cases as they were at 15:20 UTC), `PRD-CHANGES-v54-to-v61.md`.

## Chris's answer sheet
31 answers, none new since 15 Oct. All 31 already applied: answers 1–11 on 14 Oct (14 cases), answers 12–31 on 15–16 Oct
(43 cases + 5 follow-up) — 61 cases in all. The sheet needs nothing more. What changed since came from versions 55–61 of the spec
(Slavcho's questions, Slack, PR notes, the SV-11416 ruling), not from the sheet; two of them reverse sheet answers (11: Collapse
all now in; 28: Story 11 keyboard reworked).

## What the spec changes (v55–v61) need
Must change, expected results change, retest (13): C97021, C368150, C368152, C97020, C96945 (Automated; keyboard, S11-R1/S11-R3);
C614711 (S3-R20e Deleted technician, the SV-11416 ruling); C96916 (S1-R8 Back restores tab and filters); C590110 (S1-R9a slate
switcher in List too); C590112 (S2-R22 Status column); C590114 (S2-R20 link #175CD3, S2-R23 left-aligned columns); C590117
(S2-R11a pin, S2-R23 header names and initials); C590119 (S2-R23 initials darker than the design file); C590128 (S2-R23 avatar
sizes by density, Board card avatars 24 px).
Quote refresh only, no retest (4): C368214 (S1-R8; List unchanged), C590113 (Out of Scope line removed), C590122, C590127 (S1-R9a).
New (4): lead with Time Clock off (S3-R20d), first-run "No work orders yet" (S1-N1c), Density and Columns tooltips (S2-R23), row
and card avatar name bubbles open above (S2-R23). Collapse all / Expand all is covered by Vladimir's C614712.
Corrected from the earlier list: C368161 and C96938 do not need a change (they check initials shown and the name on hover, both
still true in v61).

## Why skipping the other 249 does no harm (and the limits)
- Every PRD quote in the 249 is word for word the v61 text (200 cases), or comes from a source that did not change (the developers'
  regression list: 75 quotes, all verbatim); none quotes a rule changed in v55–v61.
- None relies on the changed behaviour: Tab stepping only in the 5 listed; "Collapse all" only in C590113; staff with Time Clock off
  appear only as people who lead no work (S3-R20d applies only while they lead); "deleted" only in C614711, C154888 (shifts) and C368191
  (line labor), unrelated to S3-R20e.
- Limits: the check is against the documents, not the build; the design export (14 Oct) and tech plan were not re-checked for newer
  versions in this pass; 202 of the 249 stay in the older case layout (runnable, passed or failed in run 498 today, but not in the newest
  layout); the 7 cases another session edited 15:11–15:14 were left alone and are that session's; the spec moved 7 times today and can
  move again.
