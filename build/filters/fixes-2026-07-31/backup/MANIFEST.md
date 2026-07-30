# Pre-edit backup manifest — Filters fixes 2026-07-31

Every case body in this folder is the **exact local JSON as it stood BEFORE** the
2026-07-31 authorized fix/authoring pass (`build/filters/cases/*.json`, commit state of
2026-07-30). Restore by copying the body back over its entry in the source file.

**Spec baseline for the pass:** spec **v1.6** (Confluence page 572030978, version 12,
updated 2026-07-28 by Branko Cicovic) — `build/filters/spec-current-2026-07-31/Filters-spec-current.md`.

| File | Internal ID | TestRail | Why backed up |
|---|---|---|---|
| `FLT-BAR-03.json` | FLT-BAR-03 | C29559 | FIX-PLAN F1a — Status-chip consistency (title + expected + refs + note) |
| `FLT-TAB-05.json` | FLT-TAB-05 | C29612 | FIX-PLAN F1b — Status-chip consistency (title + expected 1 + refs) |
| `FLT-URL-05.json` | FLT-URL-05 | C38879 | FIX-PLAN F4 + F5 — "Back to my view" label + query-clearing clause + refs/note |
| `FLT-PSRCH-01.json` | FLT-PSRCH-01 | C38883 | FIX-PLAN F7 refs + superseded 750ms note (spec v1.6 S13-R7 = 300ms / Inventory 350ms) |
| `FLT-PSRCH-02.json` | FLT-PSRCH-02 | C38884 | FIX-PLAN F7 refs + resolved S8-R5 note |
| `FLT-PSRCH-03.json` | FLT-PSRCH-03 | C38886 | **Content correction** — case asserted account-level query persistence; S13-R25 ratifies browser-tab-session only |
| `FLT-PSRCH-04.json` | FLT-PSRCH-04 | C38888 | FIX-PLAN F7 refs + resolved G7 note |
| `FLT-PSRCH-05.json` | FLT-PSRCH-05 | C38889 | Extended for S13-R17 + S13-R20 + refs |
| `FLT-PSRCH-06.json` | FLT-PSRCH-06 | C38891 | Extended to the ratified S14-R6 42-surface sweep + refs |
| `FLT-PSRCH-07.json` | FLT-PSRCH-07 | C38893 | FIX-PLAN F7 refs + resolved note |

No case body was deleted this pass; **no `delete_case` is part of the plan.**
