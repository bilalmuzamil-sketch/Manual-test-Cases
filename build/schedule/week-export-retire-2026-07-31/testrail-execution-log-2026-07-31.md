# Schedule — Week Export RETIRE — TestRail execution log (2026-07-31)

**Status: EXECUTED.** User-authorized 2026-07-31 ("Retire from test cases and test run if that is
the appropriate approach").

Project 1 / suite 1 / group **4254** (Schedule) / run **357** ("Schedule - Ayesha (VIU Pending)").
Scope of writes: **1 `delete_case`. Nothing else.** No `update_case`, no `add_case`, no
`add_section`, no `delete_section`, no `update_run`, no result writes. No other project touched.

---

## 1. Driving ruling (verbatim)

Branko (PO), 2026-07-31, answering our Q3 — "Is the printable weekly view part of the first release
(so we should test it), or is it for later?":

> "No. There is nothing about this in the PRD, not in the future requirements."

Source: `build/schedule/branko-answers-2026-07-31/answers-ingested.md` §"Q3 → Week Export /
printable week view".

Corroboration (already captured in that ingest, not re-derived here):
- A full heading + text scan of **Confluence v23 (2026-07-30)** finds **no** export/print item — not
  in §6 Grid toolbar, not in §9 View options, not in §15 Future considerations.
- The engineering **tech plan §9** requirement table has no export item either.
- The 2026-07-31 **Ruthless Usefulness Audit** (Standing Rule 28) independently rated this scope
  **CUT**.

So the scope is not merely deferred — it is absent from V1 *and* from the future-requirements
backlog. The cases test something that will not exist. Retire is the appropriate approach.

---

## 2. Scope determination (what the ruling covers)

Section **5406 "Week Export and Printing"** was created by the 2026-07-27 new-scope authoring with
two cases. Evidence checked: both case bodies in `build/schedule/cases/cases-G-new-scope.json`, the
id-map, and live TestRail.

| Internal ID | C-id | Title | Week-Export-scoped? | Disposition |
|---|---|---|---|---|
| SCH-EXP-01 | C38853 | Week Export opens a printable Department-by-Technician week grid | **YES** | **RETIRED + DELETED this pass** |
| SCH-EXP-02 | C38854 | Exported week view lists each department with its technicians and shifts | **YES** | Already retired + deleted 2026-07-31 (consolidation) — **no action needed** |

**Reasoning — SCH-EXP-02 is NOT a surviving printing case.** Its precondition is *"You have opened
the Week Export / Print view for a week that has shifts"* and every one of its expected results
describes the **exported** view ("The exported view groups technicians by department…"). It has no
existence independent of the Week Export feature, so Branko's ruling covers it too. It needed no
write because the earlier 2026-07-31 usefulness-audit consolidation had already merged it into
SCH-EXP-01 (merge group G-WEEK-EXPORT) and `delete_case`d it — **verified live this pass:
`get_case/38854` → HTTP 400 `"Field :case_id is not a valid test case."`** (gone). Its local body
carries a scope-confirmation note recording that the PO ruling covers it as well.

Net effect: retiring SCH-EXP-01 closes the **entire** Week Export scope — no more, no less. Nothing
adjacent was touched (no toolbar, view-option or tooltip case was swept in).

---

## 3. Operations (per-op)

| # | Op | Target | HTTP | Verification |
|---|---|---|---|---|
| 0 | `get_case/38853` (pre-write snapshot) | C38853 | **200** | Full body saved → `pre-snapshot/get_case_38853.json` |
| 0 | `get_case/38854` (pre-write probe) | C38854 | **400** | `"not a valid test case"` — confirms already deleted, no op required |
| 0 | `get_run/357` (pre) | run 357 | **200** | `pre-snapshot/get_run_357.json` — untested_count **165** |
| 0 | `get_tests/357` (pre) | run 357 | **200** | **165** tests; case_id 38853 **present** |
| 0 | `get_results_for_run/357` (pre) | run 357 | **200** | **429** result records |
| 0 | `get_sections` + `get_cases` (pre) | group 4254 | **200** | **165** live cases under 4254; section 5406 held exactly 1 case (C38853) |
| 1 | **`delete_case/38853`** | C38853 | **200** | Re-GET `get_case/38853` → **HTTP 400** `"Field :case_id is not a valid test case."` = **verified gone** |
| 2 | `get_run/357` (post) | run 357 | **200** | untested_count **164** |
| 2 | `get_tests/357` (post) | run 357 | **200** | **164** tests; 38853 **absent**; set-diff of removed case_ids = `{38853}` only |
| 2 | `get_results_for_run/357` (post) | run 357 | **200** | **429** result records — **unchanged** |
| 2 | `get_sections` + `get_cases` (post) | group 4254 | **200** | **164** live cases; section 5406 now holds **0** cases, section still exists |

Snapshots: `pre-snapshot/` and `post-snapshot/` in this folder.

### Mechanics note — why no `update_run` was needed
Deleting a case removes its test from any run automatically (proven 2026-07-28 on run R359 during
the Report Suite consolidation, 57 deletes). Confirmed again here: run 357 dropped from 165 → 164
tests with **no** run write. The run's 429 stored result records were untouched — C38853 had no
result of its own (the whole run was Untested), so nothing was lost.

---

## 4. Before → after counts

| Metric | Before | After | Delta |
|---|---|---|---|
| Run 357 — tests | **165** | **164** | −1 (exactly the 1 retired) |
| Run 357 — result records | **429** | **429** | 0 (intact) |
| Run 357 — untested_count | 165 | 164 | −1 |
| Live cases under group 4254 | **165** | **164** | −1 |
| Cases in section 5406 | 1 | **0** | −1 |
| id-map active rows | 165 | **164** | −1 |
| Schedule import data rows | 165 | **164** | −1 |
| Local active authored (non-Retired) | 165 | **164** | −1 |

**Live count (164) == id-map count (164) == import rows (164) — reconciled.**

---

## 5. Section 5406 — left in place, flagged

Section **5406 "Week Export and Printing"** (parent 4254) is now **EMPTY** and was **deliberately
NOT deleted** — matching prior practice on this repo (the Custom Roles section-3658 subtree was
likewise emptied and left as a removal *candidate*, not deleted). It is flagged here as an
**empty-section cleanup candidate for a later authorized pass**; deleting a section is a separate
destructive act and was not in this authorization.

---

## 6. Local reconciliation

- `build/schedule/cases/cases-G-new-scope.json` — SCH-EXP-01 `viu_status` → `Retired - Week Export
  DESCOPED by the PO 2026-07-31 …`, with the verbatim ruling quoted in its `notes`. **The JSON body
  was NOT deleted** — it is kept in full and is recoverable. SCH-EXP-02's note gained the
  scope-confirmation line + the same quote.
- Pre-edit body backup: `backup/cases-G-new-scope.PRE-RETIRE.json`.
- `build/schedule/testrail-id-map.csv` — regenerated to **164** rows (retired cases are dropped from
  the map, the project's existing convention — SCH-EXP-02 was likewise absent). All **164 C-ids
  re-merged** after `gen_import.py` blanked them (known generator behaviour); **0 blanks, 0 missing**.
- `testrail-import/schedule-v1-testrail-import.csv` / `.xlsx` — regenerated over 164 (Retired
  excluded by the generator).

### Hygiene checks (all pass)
- Header **byte-identical** to the filters / report-suite / simple-flow imports (md5
  `cccad4693ccc2fae0d2c20fd7fe3c9ab` on all four).
- Diff vs the previous import = **exactly the one removed Week Export row**, nothing else changed.
- `VIU` occurrences **0**; `feature flag` / `flag on` / `flag off` occurrences **0**.
- Duplicate titles **NONE**; duplicate internal ids **NONE**.
- API cases in an API-titled section (Rule 4): `API — Schedule`, **4** cases.
- Rows missing Preconditions/Steps/Expected: **NONE**.
- No C-id column in the import; no secrets in any artefact.

---

## 7. Honesty notes (Rule 12)

- Everything asserted above about TestRail was **observed live this run** via the API, with the
  request/response snapshots saved in this folder.
- The Confluence-v23 and tech-plan corroboration is **quoted from the 2026-07-31 ingest**, not
  re-read live this pass — the ruling itself (Branko's answer) is the authorization, and the
  corroboration is supporting context.
- No live-build (staging UI) check was applicable: this pass removes cases for a feature the PO says
  does not exist, so there is nothing in the build to observe.
