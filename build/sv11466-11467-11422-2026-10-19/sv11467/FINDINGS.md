# SV-11467 — Tech View Compact count bubbles (19 Oct 2026)
Verdict: **PASSED** — Jira comment 79022 (2 attachments, read back in order, 5-row table). No recording, no technical section (QA lead).
Sources: PRD 845185030 v66 (15:33Z; S2-R19 and S6-R2a identical to v64/v65). Build staging v26.40.19-c850386.
## Matrix (measured: bubble top vs status-text line box; pill height)
| View/density | S2-33351 bubble top above text top | text line box covered | pill h |
|---|---|---|---|
| Tech Compact | 15 px | 4.2 of 15 px (28%) | 16 |
| Tech Regular | 15 px | 28% | 16 |
| Tech Comfortable | 15 px | 28% | 22 |
| List | 15 px | 28% | 21 |
Wider sweep (window 1600x3000, Unassigned expanded): Compact 20 rows, Regular 15, Comfortable 12, List 14 — Approved/Complete/Estimate/Ready for Review; red-only (S2-16710, S2-34549, S2-33505), blue-only, both, two-digit (S2-33363 blue 19). Every row: same 15 px offset as List; short pills (Approved/Complete/Estimate) bubbles beyond the text (0% over the word).
Before: the ticket's own attachment 62484 (16 Oct, build v26.40.19-754919e). After: 2x capture today.
Pre-post gate: build c850386, PRD 66 (diff v65→v66 = S3-R14/S4-R4/S4-R5/S4-R12/R13/R16/R32 lead dialog + toast only), ticket Ready for QA, 0 comments before ours; read back OK.
Prefs (density/collapsed/display) restored after each run.
