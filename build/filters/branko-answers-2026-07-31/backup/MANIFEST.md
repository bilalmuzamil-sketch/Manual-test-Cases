# Pre-edit backup MANIFEST — Filters, Branko Parts/Reports/page-search apply pass, 2026-07-31

Every case body this pass touched was copied here **before** the first edit, in the same
convention as `../../consolidation-backup-2026-07-31/pre-edit-bodies/` and
`../../tech-plan-2026-07-29/backup/`.

| | |
|---|---|
| Bodies backed up | **18** |
| Taken | 2026-07-31, before `apply_answers.py` ran |
| Restore | copy the JSON object back over the matching `id` in `build/filters/cases/cases-*.json` |
| Spec baseline of the pass | **v1.6** — Confluence page 572030978 version **12**, updated **2026-07-28** |

## Edited (9) — APPLY-PLAN §2 items A1–A9

| File | Internal ID | C-id | Source case file | What changed |
|---|---|---|---|---|
| `pre-edit-bodies/FLT-PARTS-01.json` | FLT-PARTS-01 | *(blank)* | `cases-E-parts-filters.json` | permissions, expected 11→11/12/13, refs, notes, + step 10 (sense repair) |
| `pre-edit-bodies/FLT-PARTS-09.json` | FLT-PARTS-09 | *(blank)* | `cases-E-parts-filters.json` | permissions, +steps 3/4, expected 3→3/4, refs, notes |
| `pre-edit-bodies/FLT-PARTS-11.json` | FLT-PARTS-11 | *(blank)* | `cases-E-parts-filters.json` | permissions, expected 3, refs, notes |
| `pre-edit-bodies/FLT-PARTS-12.json` | FLT-PARTS-12 | *(blank)* | `cases-E-parts-filters.json` | permissions, expected 1 + 3, refs, notes, step 2 (sense repair) |
| `pre-edit-bodies/FLT-RPTS-01.json` | FLT-RPTS-01 | *(blank)* | `cases-F-reports-filters.json` | permissions, expected 22→22/23/24, refs, notes, + step 16 (sense repair) |
| `pre-edit-bodies/FLT-RPTS-21.json` | FLT-RPTS-21 | *(blank)* | `cases-F-reports-filters.json` | permissions, expected 2, refs, notes |
| `pre-edit-bodies/FLT-RPTS-22.json` | FLT-RPTS-22 | *(blank)* | `cases-F-reports-filters.json` | permissions, all 3 steps, all 3 expected, refs, notes |
| `pre-edit-bodies/FLT-RPTS-23.json` | FLT-RPTS-23 | **C38882** | `cases-F-reports-filters.json` | permissions, refs, notes — **no tester-facing change** |
| `pre-edit-bodies/FLT-PERS-05.json` | FLT-PERS-05 | **C38880** | `cases-C-chips-tabs-persistence-url.json` | refs, notes only — **no behaviour change** |

## Retired (9) — APPLY-PLAN §5, user-authorized 2026-07-31

All nine had a **BLANK C-id** (asserted per case by `apply_answers.py` before the write), so
there was **no `delete_case` and nothing to remove from TestRail**. Local-only retirement;
bodies kept in `cases-G-page-search.json` marked `Retired — …`.

`pre-edit-bodies/FLT-SRCH-01.json` … `pre-edit-bodies/FLT-SRCH-09.json` (9 files), all from
`cases-G-page-search.json`.

## NOT backed up (nothing to back up)

`FLT-PARTS-13` is **new this pass** (NEW-1) — it had no prior body.

## Explicitly NOT touched

The **13 `FLT-PSRCH-*` cases** (Filters' own Story 13 in-toolbar page search —
**C38883, C38884, C38886, C38888, C38889, C38891, C38893, C38898, C38899, C38900, C38901,
C38902, C38903**). Verified by C-id before and after; `cases-H-page-search-toolbar.json` shows
**no diff** for this pass.
