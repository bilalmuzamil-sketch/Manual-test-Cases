
---

# Run-sync DRY-RUN — 2026-07-30T14:20:03.449872Z

Authorized runs (in order): 352 Filters, 357 Schedule, 359 Reports Suite. Blocked (never written): [278, 324, 325].

## Run 352 — Filters — "Filters - Ahtasham (Awaiting QA- ENV)"

- include_all: `False` (verified) · completed: `False` (verified)
- tests BEFORE: **79** · result-records BEFORE: **395**
- cases to add (15): C38876, C38877, C38878, C38879, C38880, C38881, C38882, C38883, C38884, C38886, C38888, C38889, C38891, C38893, C38895
- UNION size: **94** — assertions: subset OK, 94 == 79 + 15 OK
- snapshot: `pre-write-snapshot-live/run-352.json`
- **DRY-RUN — no write made**

## Run 357 — Schedule — "Schedule - Ayesha (VIU Pending)"

- include_all: `False` (verified) · completed: `False` (verified)
- tests BEFORE: **143** · result-records BEFORE: **429**
- cases to add (22): C30614, C30615, C38847, C38848, C38849, C38850, C38851, C38853, C38855, C38863, C38864, C38865, C38866, C38867, C38868, C38869, C38870, C38871, C38872, C38873, C38874, C38875
- UNION size: **165** — assertions: subset OK, 165 == 143 + 22 OK
- snapshot: `pre-write-snapshot-live/run-357.json`
- **DRY-RUN — no write made**

## Run 359 — Report Suite — "Reports Suite - Nebojsa/Viktoria (VIU Pending)"

- include_all: `False` (verified) · completed: `False` (verified)
- tests BEFORE: **458** · result-records BEFORE: **539**
- cases to add (7): C38856, C38859, C38885, C38887, C38890, C38892, C38894
- UNION size: **465** — assertions: subset OK, 465 == 458 + 7 OK
- snapshot: `pre-write-snapshot-live/run-359.json`
- **DRY-RUN — no write made**

## Summary

| Run | Project | Tests before | Tests after | Added | Results before | Results after | Write | Completeness |
|---|---|---|---|---|---|---|---|---|
| 352 | Filters | 79 | 94 | 15 | 395 | 395 | DRY-RUN | n/a |
| 357 | Schedule | 143 | 165 | 22 | 429 | 429 | DRY-RUN | n/a |
| 359 | Report Suite | 458 | 465 | 7 | 539 | 539 | DRY-RUN | n/a |

No `add_result*`, no `close_run`, no `delete_run`, no case writes were made. Runs 324 / 325 / 278 untouched.

---

# Run-sync EXECUTION — 2026-07-30T14:20:25.581622Z

Authorized runs (in order): 352 Filters, 357 Schedule, 359 Reports Suite. Blocked (never written): [278, 324, 325].

## Run 352 — Filters — "Filters - Ahtasham (Awaiting QA- ENV)"

- include_all: `False` (verified) · completed: `False` (verified)
- tests BEFORE: **79** · result-records BEFORE: **395**
- cases to add (15): C38876, C38877, C38878, C38879, C38880, C38881, C38882, C38883, C38884, C38886, C38888, C38889, C38891, C38893, C38895
- UNION size: **94** — assertions: subset OK, 94 == 79 + 15 OK
- snapshot: `pre-write-snapshot-live/run-352.json`
- `update_run/352` -> **HTTP 200**
- tests AFTER: **94** (expected 94) — OK
- every previously-present case still in the run: OK
- all 15 added cases present: OK
- result-records AFTER: **395** (before 395) — UNCHANGED — no history lost
- COMPLETENESS vs id-map active set (94 cases): (active − run) = 0 (empty) · (run − active) = 0 (empty) — **EQUAL — run holds the complete active suite**
- note: 16 id-map rows have no TestRail C-id yet (not pushed): FLT-PARTS-01, FLT-PARTS-09, FLT-PARTS-11, FLT-PARTS-12, FLT-RPTS-01, FLT-RPTS-21, FLT-RPTS-22, FLT-SRCH-01, FLT-SRCH-02, FLT-SRCH-03, FLT-SRCH-04, FLT-SRCH-05, FLT-SRCH-06, FLT-SRCH-07, FLT-SRCH-08, FLT-SRCH-09

## Run 357 — Schedule — "Schedule - Ayesha (VIU Pending)"

- include_all: `False` (verified) · completed: `False` (verified)
- tests BEFORE: **143** · result-records BEFORE: **429**
- cases to add (22): C30614, C30615, C38847, C38848, C38849, C38850, C38851, C38853, C38855, C38863, C38864, C38865, C38866, C38867, C38868, C38869, C38870, C38871, C38872, C38873, C38874, C38875
- UNION size: **165** — assertions: subset OK, 165 == 143 + 22 OK
- snapshot: `pre-write-snapshot-live/run-357.json`
- `update_run/357` -> **HTTP 200**
- tests AFTER: **165** (expected 165) — OK
- every previously-present case still in the run: OK
- all 22 added cases present: OK
- result-records AFTER: **429** (before 429) — UNCHANGED — no history lost
- COMPLETENESS vs id-map active set (165 cases): (active − run) = 0 (empty) · (run − active) = 0 (empty) — **EQUAL — run holds the complete active suite**

## Run 359 — Report Suite — "Reports Suite - Nebojsa/Viktoria (VIU Pending)"

- include_all: `False` (verified) · completed: `False` (verified)
- tests BEFORE: **458** · result-records BEFORE: **539**
- cases to add (7): C38856, C38859, C38885, C38887, C38890, C38892, C38894
- UNION size: **465** — assertions: subset OK, 465 == 458 + 7 OK
- snapshot: `pre-write-snapshot-live/run-359.json`
- `update_run/359` -> **HTTP 200**
- tests AFTER: **465** (expected 465) — OK
- every previously-present case still in the run: OK
- all 7 added cases present: OK
- result-records AFTER: **539** (before 539) — UNCHANGED — no history lost
- COMPLETENESS vs id-map active set (465 cases): (active − run) = 0 (empty) · (run − active) = 0 (empty) — **EQUAL — run holds the complete active suite**

## Summary

| Run | Project | Tests before | Tests after | Added | Results before | Results after | Write | Completeness |
|---|---|---|---|---|---|---|---|---|
| 352 | Filters | 79 | 94 | 15 | 395 | 395 | HTTP 200 | EQUAL |
| 357 | Schedule | 143 | 165 | 22 | 429 | 429 | HTTP 200 | EQUAL |
| 359 | Report Suite | 458 | 465 | 7 | 539 | 539 | HTTP 200 | EQUAL |

No `add_result*`, no `close_run`, no `delete_run`, no case writes were made. Runs 324 / 325 / 278 untouched.

## Post-sync confirmation (read-only re-audit, same day)

`run_sync_audit.py --outdir post-sync-audit` re-read TestRail live:

- **352 Filters: 94/94 — missing 0** · **357 Schedule: 165/165 — missing 0** ·
  **359 Reports Suite: 465/465 — missing 0**
- Untouched runs unchanged and still reporting exactly their pre-sync gaps:
  **325 Simple Flow 152 tests / 35 missing**, **324 Fees & Discounts 178 tests / 25 missing**,
  **278 Custom Permissions 746 tests / 9 missing**. Also unchanged: 347 Global Search (86/86,
  in sync) and the deliberately-scoped Custom Roles runs 303 / 304 / 311 / 323 / 331.
- Completeness equality (both directions) vs each project's `testrail-id-map.csv` active set:
  **EQUAL for all three** — `(active − run)` empty and `(run − active)` empty. Run 352
  (Ahtesham's Filters run) therefore holds the COMPLETE active Filters suite, including the
  7 page-search cases and the rest of the 2026-07-30 push.

## Runs deliberately NOT written

**HELD BY USER RULING 2026-07-31 — do not sync (COMPLETED projects).** User ruling, verbatim:
*"For now do not do anything for the completed test runs."*

- **Run 324** "Fees and Discount - Ahtasham (Specs 6/7/2026)" — 25 active cases missing,
  **185 graded results**; project Fees & Discounts = COMPLETED. Not written.
- **Run 325** "Simple Flow - Ayesha Khan" — 35 active cases missing, **147 graded results**;
  project Simple Flow = COMPLETED. Not written.

**NOT AUTHORIZED — separate future decision (not a completed-project hold):**

- **Run 278** "Custom Permissions" — 9 active cases missing, **3,521 graded results**. Custom
  Roles is an **ACTIVE recurring project**, so the completed-projects ruling does not cover it
  and **the user has not ruled on it**. Left untouched.

**Standing position (user ruling, not a rule change):** newly added cases for COMPLETED
projects are not retro-fitted into their finished runs; if such a project is ever reopened,
create a **FRESH run** rather than mutating the historical one, preserving the graded record.
**Standing Rule 34's sync duty continues to apply in full to ACTIVE projects' runs.**
