# Re-check of 12 obsolete Board/Tech/List tickets — 19 October 2026

Staging build **v26.40.19-e435950** (last-modified Mon 19 Oct 2026 06:18:22 GMT) · Production build **v26.40.19-d2441a9** · PRD 845185030 **v64** (read first for every ticket, per the QA lead's instruction).
QA lead's posting rules for this batch: fixed → QA-passed comment (no technical section, no recording); same on production → comment with an annotated Production vs Staging picture.

| Ticket | Result | Basis | Posted |
|---|---|---|---|
| SV-11418 Time Clock off → Unassigned | **FIXED** | PRD v59/v64 S3-R20d (Chris ruling 16 Oct): named column/group kept, drops refused, gone when empty — all observed | 78974 (PASSED) |
| SV-11123 Part sale card has no person field | **FIXED** | Sales Representative field on every status (dropdown; read-only on Invoiced/Paid); change + reload kept on Estimate P2-2406 and Approved P2-2407 | 78977 (PASSED) |
| SV-11464 List pill width changes by screen | Same on production | S6-R2a: List pill unchanged from production (All 113.98 px, Estimates 67.00 px, both envs) | 78978 |
| SV-11118 Top menu keeps link's tab | Same on production | §1: List stays exactly as production | 78979 |
| SV-11099 No-result search has no Clear filters | Same on production + PRD changed | S1-N1b (search only: message, no button) / S1-N1a (filters: Clear all filters) | 78980 |
| SV-11120 Paid lead shown as plain text | Same on production | Key decision: lead cannot change on Invoiced/Paid — holds; no visual requirement | 78981 |
| SV-11121 Imported page has no lead | Same on production + PRD changed | v48: Imported dropped from S4-N2; S1-R13a Imported is List-only | 78982 |
| SV-11107 Second technician not audited | Same on production | S4-R18 "continue existing line auditing": first tech logged, second not, on both | 78983 |
| SV-11125 Reload returns to Returns tab | Same on production | Dev regression item 6 (filter kept) passes: 60 days kept; tab not remembered on production either | 78984 |
| SV-11124 Staff list no photos | Same on production | Staff list has no photo column on production either | 78985 |
| SV-11101 Default order in Tech/Board | **Works as the current PRD says** — not posted, awaiting QA lead | S2-R6 (v53) + S9-R14: a work order that gets its lead after creation goes to the bottom. Assigned Mid(S2-37380), Zeta(S2-37377), Alpha(S2-37378), Mid(S2-37379) via Reassign → both views show exactly that order. New Work Order dialog has no lead field. | — |
| SV-11119 Two people reorder: later save should win | **STILL REPRODUCES** — not posted, awaiting QA lead | S9-R11 (unchanged in v64): "the later save wins; the other person sees the saved order on their next refresh". 3/3 runs (two Admin sessions) end in a MIX: e.g. start Zeta, Mid380, Alpha, Mid379 → Admin 1 moves Alpha to top; Admin 2 (stale) moves Mid380 to top → after refresh both see Alpha, Mid380, Zeta, Mid379, not Admin 2's Mid380, Zeta, Alpha, Mid379. A Technician login could not reorder at all (drag had no effect). | — |

## Notes and honest limits
- SV-11124: the photo-upload half (upload a new profile photo, reload) was **not re-done** — on staging it would replace Admin's shared photo. Asked the QA lead.
- SV-11101: the "created with a lead keeps the initial sort" branch of S9-R14 was not exercised: the New Work Order dialog offers no lead, so that state comes only from a split or a Schedule slot. Not part of the ticket's steps.
- Test data left on staging (no cleanup by ruling): customers Alpha Freight / Mid Trucking / Zeta Hauling QA1019 (+ assets, contacts), work orders S2-37319..21, S2-37325, S2-37336, S2-37345..47, S2-37377..80, S2-37409..11; production S2-982. Our throwaway technician "ZZAUTOTEST DC15 Wes Hover" was renamed to "Wes Hover" (staff d1879db8…) for readable pictures; Time Clock left on. Part sales P2-2406/P2-2407 Sales Representative set back to Unassigned. Admin's Work Orders preferences restored after every run.
- Production sign-in currently takes ~70 s; scripts need ≥200 s timeouts.

## Learning check
- New tool option: `ticket_exhibit.panel` boxes accept a 7th item `'top'` to put the badge above the box when words sit on both sides (SV-11118).
- Customer test data names must start with the real name (Alpha/Mid/Zeta…), not a ZZ prefix — QA lead, 19 Oct (sorting/readability). Recorded in LESSONS-INDEX.
