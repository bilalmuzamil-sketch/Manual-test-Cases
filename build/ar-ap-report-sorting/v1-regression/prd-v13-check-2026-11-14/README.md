# PRD v13 re-check of the A/R and A/P defects (14 Nov 2026)

**PRD:** Confluence 947650561 **v13**, saved by Chris Ward 13 Nov 2026 (`../sources/PRD-947650561-v13-2026-11-14.md`, read
14 Nov). Only change from v12: **S5-R10b** added — "The as-of date can be any day, including a day after today, as today.
For a day after today the report counts everything entered so far and counts days past due to the picked day; the chip,
the PDF and the CSV all show the picked day. A link with an as-of date opens on that date." (change log: SV-12545, QA sheet q19).

| Defect | Status (14 Nov) | Affected by v13? |
|---|---|---|
| SV-12545 future as-of date | Merged to Staging | **Yes** — S5-R10b is its fix. Staging build v26.45.4-f3d3d2d = merge of PR #4400 (SV-12545). Re-tested: C1078980 + C1078981 PASS (05:46Z), posted to run 557. Ticket description still says "No — the PRD does not ask for this change" (held: edit needs the QA lead's OK) |
| SV-12539, SV-12540, SV-12544, SV-12546, SV-12547, SV-12554, SV-12563, SV-12663, SV-12723 | various | No — the PRD sentences they rest on are unchanged in v13 |

Tests mentioning future dates in run 557 (489 tests, `future-date-mentions.json`): 18; none expects a later date to be
refused (C715579 already says "Days after today can be picked"; C1145296, new, quotes S5-R10b).
V1R-07 step 6 measured (`v1r07-step6-measure.json`): S2-33450 due Nov 21 is Current (-7) today and 31-60 (Past Due 40) as of 12/31/2026.
Run with `ALLOW_OTHER_DAY=1` (the seed is anchored on 12 Nov; V1R-07/08 use only "last day of next month" = 2026-12-31 either day).
