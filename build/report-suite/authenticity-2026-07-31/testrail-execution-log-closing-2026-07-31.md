# Report Suite — TestRail EXECUTION LOG (closing authenticity pass, 2026-07-30/31)

**Executed:** 2026-07-30, three batches (see "Batching" below) · executor
`exec_push_closing_2026-07-31.py` · manifest `testrail-push-manifest-closing-2026-07-31.md`
(header now **EXECUTED**).

## Result: every authorized operation succeeded — 0 failures outstanding

| Operation | Authorized | Executed | HTTP 200 | re-GET verified |
|---|---|---|---|---|
| `update_case` | 414 | **414** | 414 | 414 |
| `add_case` | 2 | **2** | 2 | 2 |
| `delete_case` | **0** | 0 | — | — |
| `add_section` | **0** | 0 | — | — |
| `update_run` (run 359 case sync) | 1 | **1** | 1 | verified |
| no-op (live already matched) | 58 | — | — | — |

**Final verification (the decisive one):** re-running the executor's diff pass against a freshly
fetched live snapshot reports **`updates 0 · adds 0 · no-op 474`** — i.e. all 474 active cases in
TestRail are byte-equal to the local authoring source on title, preconditions, steps, expected
results and refs. Nothing was left half-pushed.

## Cases created

| Internal ID | TestRail | Section | Link |
|---|---|---|---|
| PV-PREC-01 | **C38924** | PV — Columns & Calculations (4334) | https://shopview.testrail.io/index.php?/cases/view/38924 |
| PV-PREC-02 | **C38925** | PV — API (4337) | https://shopview.testrail.io/index.php?/cases/view/38925 |

Both carry `custom_atmstatus:3` + `custom_automation_type:0` (verified on the re-GET), plus the
correct `section_id`, `type_id` and `priority_id`.

## Run 359 sync (Standing Rule 34)

- Run **359** "Reports Suite - Nebojsa/Viktoria (VIU Pending)" — owned by another tester.
- `include_all` = **False** → a fixed case selection, so new cases do NOT appear automatically and a
  union `update_run` was required.
- **BEFORE: 472 tests · 472 distinct case_ids · 539 recorded results.**
- Union: 472 existing + 2 new = **474**. Asserted the existing set is a SUBSET of the union AND that
  the union length is exactly existing+new — never a partial list, which would delete tests and
  their recorded results.
- **AFTER: 474 tests · 539 recorded results.**
- Verification: `{'count': True, 'prior_cases_present': True, 'new_cases_present': True,
  'results_unchanged': True}` — test count correct, every prior case still present, both new cases
  present, **recorded results UNCHANGED (539 → 539)**.
- **No other run was touched.** Snapshot: `pre-push-snapshot/run359.pre-sync-closing-2026-07-31.json`.

## Batching (honest account of how this ran)

The 414 updates exceeded a single command's time budget, so the push ran in three batches. The
executor is **diff-driven** — it re-computes the update list from a fresh live snapshot each time —
so each batch naturally resumed exactly where the previous one stopped, with no double writes:

| Batch | Updates in scope at start | Completed | Note |
|---|---|---|---|
| 1 | 414 | 328 | ended on the command timeout; 415 pre-push snapshots taken (414 cases + run 359) |
| 2 | 86 | 32 | stopped deliberately (see the HTTP 400 below) before it could reach the add phase |
| 3 | 53 | 53 + both adds + the run sync | clean finish |

## One real failure, diagnosed and fixed: HTTP 400 on SBR-NAV-01

`update_case/30195` returned **HTTP 400** on batch 2. The cause was the `refs` length: the string
was **exactly 250 characters**.

- The playbook already recorded a 250-char cap on `refs`, but the pass had asserted `<= 250`.
  **The boundary is EXCLUSIVE — exactly 250 is REJECTED.** 243 chars pushes fine
  (IV-EXP-02 = C30588), 250 does not.
- Fixed by compressing SBR-NAV-01's ref from 250 to **208** chars (every requirement token
  S1-R1…S1-R6 and the driving PRD-video source kept; only the four spelled-out anchor report names
  were dropped, and those are named in full inside the case's own expected results).
- The executor's pre-flight assertion was tightened to **`<= 245`**, and the sharpened boundary was
  written back to `build/APP-ACTIONS-PLAYBOOK.md` so no session hits it again.
- SBR-NAV-01 = **C30195** then pushed 200 + re-GET MATCH in batch 3.

A second, cosmetic defect was fixed at the same time: `get_results_for_run`'s `size` field is the
**page** size, not the total, so batch 2 mis-reported run 359 as having 250 results. The executor
now paginates results properly — hence the correct 539 → 539 above.

## Discrepancy NOT ours: 5 foreign cases inside group 4281

Live count under group 4281 is **479**, not 474:

| TestRail | Section | Title | refs | atmstatus |
|---|---|---|---|---|
| C38919 | TU — Visual & Accessibility | TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it | **none** | 1 |
| C38920 | PV — Row Model | PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row | **none** | 1 |
| C38921 | IV — Exports | IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column | **none** | 1 |
| C38922 | WIP — Exports | WIP CSV export gains the Locations line while its column semantics stay exactly as shipped | **none** | 1 |
| C38923 | SBR — Exports | SBR Summary and Expanded CSV exports carry the Location column at its designated slot | **none** | 1 |

All five were created at **2026-07-30 15:54Z** and have **no trace anywhere in this repository**.
They are not ours. They also fail three of our standing bars: **no `refs` at all** (Rule 20), every
title is **over 80 characters**, and `custom_atmstatus` is **1** where our add convention is 3.
Their subjects read like **duplicates of cases we own** — TU-COL-01 = C38859, PV-FILT-14 = C38914,
and the IV / WIP / SBR export-`Locations:` assertions already inside IV-EXP-02 = C30588,
WIP-EXP-01 = C30510 and SBR-EXP-02 = C30277.

**They were left completely untouched** — not edited, not deleted, not added to run 359 — pending a
decision from the QA lead. Consequently the reconciliation reads:

| Population | Count |
|---|---|
| Live under group 4281 | **479** |
| — of which OURS (in `testrail-id-map.csv`) | **474** |
| — foreign, untouched | **5** |
| `testrail-id-map.csv` rows | **474** (0 blank C-ids) |
| Unified import data rows | **474** |

**Three-way match on our own population: 474 == 474 == 474.** The only gap between "live under
4281" and "our 474" is exactly those 5 foreign cases, itemised above rather than absorbed.

## Deliverables reconciled after the push

- `testrail-id-map.csv` — 474 rows, **0 blank C-ids** (the 2 new C-ids added; the documented
  `gen_import.py` C-id-blanking gotcha handled by re-merging all 474 afterwards).
- `testrail-import/report-suite-v1-testrail-import.csv` / `.xlsx` — 474 data rows.
- The 6 per-report split imports — 83 / 111 / 71 / 60 / 79 / 70 = **474**; split CRLF total 480
  (474 rows + 6 headers) reconciles with the unified 475 (474 + 1 header).
- **Header byte-identity confirmed across all five project imports** (fees-discounts, simple-flow,
  filters, schedule, report-suite → identical MD5 of the header line) per Standing Rule 16.
- Hygiene, all from the generator's own checks: **0** VIU words · **0** feature-flag phrases · **0**
  internal-id leaks in reader-facing cells · **0** duplicate titles within a section · **0**
  duplicate internal ids · **30** API cases, **none** outside an "API"-titled section (Rule 4) ·
  **0** rows missing Preconditions/Steps/Expected.
- Live-side hygiene re-read on our 474: **0** titles over 80 chars · **0** empty `refs` · **0**
  `refs` without a Jira ticket.

## Safety

- Only group **4281** was touched. Run **359** was case-synced only — **no result was ever written**.
- No other run, section, suite or project was touched. **0 deletes.**
- No secrets committed; TestRail credentials read from `/tmp` only.
