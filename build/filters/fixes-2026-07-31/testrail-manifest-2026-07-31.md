# TestRail sync manifest — Filters, 2026-07-31

**STATUS: EXECUTED** *(see `testrail-execution-log-2026-07-31.md` for the per-operation
HTTP + re-GET result; this header was written as PENDING before the first write and
flipped after all ops verified)*

**Authorization:** user-authorized 2026-07-31 — the 4 immediate FIX-PLAN fixes, the
authored v1.6 gap cases, and the run-352 sync.
**Spec baseline:** v1.6 — Confluence page 572030978, version **12**, 2026-07-28.
**Scope guard:** TestRail project **1** / suite **1**, group **4110** only. Sections
touched: **4111, 4117, 4119, 4120, 4122, 5410**. **Run 352 only** (no other run read or
written). **0 `delete_case`. 0 `add_section`. 0 result writes.**

Machine-readable op list: `push-plan.json`. Pre-write `get_case` snapshots for all 12
updates: `pre-push-snapshot/C<id>.json`. Pre-edit local bodies: `backup/` + `backup/MANIFEST.md`.

---

## A. `update_case` — 12

Fields sent on each: `title`, `custom_preconds`, `custom_steps`, `custom_expected`,
`refs`. Nothing else is sent (section, priority, type, automation fields untouched).

| # | Case | Internal ID | Section | What changes |
|---|---|---|---|---|
| 1 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | FLT-BAR-03 | 4111 | **F1a** — title drops "hidden"; expected 3 added (chip shown greyed out/pre-filled/not clickable); refs → `S1-N1; S9-R2; §4` + the two rulings |
| 2 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | FLT-TAB-05 | 4120 | **F1b** — title 116→75 chars, drops "hidden"; expected 1 realigned; refs → `S9-R5; S9-N1; S9-R2` |
| 3 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | FLT-URL-05 | 4122 | **F4+F5** — ratified label "Back to my view"; new step 4 + expected 3/5 cover the query-clearing clause; precondition 3 added; refs → `S11-R6; S11-R7; S11-R8` |
| 4 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | FLT-CHIP-04 | 4117 | **Cross-case sweep repair** — precondition 4 (Search box empty) + expected 3 scoped, so it no longer contradicts `S13-R13`/C38884 |
| 5 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | FLT-EMPTY-02 | 4119 | **Cross-case sweep repair** — precondition 3 (Search box empty) + expected 2 scoped vs the new query-aware empty state |
| 6 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | FLT-PSRCH-01 | 5410 | **F7** refs → `S13-R1; S13-R9; S13-R12; S13-R15`; expected 1 uses the ratified placeholder "Type to search" |
| 7 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | FLT-PSRCH-02 | 5410 | **F7** refs → `S13-R10; S13-R13; S8-R5` |
| 8 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | FLT-PSRCH-03 | 5410 | **Content correction** — retitled + rewritten to `S13-R25` (browser-tab session, never saved, each tab independent, gone after the session); refs → `S13-R14; S13-R25; S13-N4; S10-R5` |
| 9 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | FLT-PSRCH-04 | 5410 | **F7** refs → `S11-R4; S11-R5; S11-N2; S11-R8` |
| 10 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | FLT-PSRCH-05 | 5410 | Extended — step 4 + expected 4/5 (`S13-R17` fill width, `S13-R20` no indicator); refs → `S13-R16..R20; S12-R5` |
| 11 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | FLT-PSRCH-06 | 5410 | Extended to the ratified `S14-R6` sweep (42 surfaces / 39 components by module + web address, WO Parts excluded, dialog tables); refs → `S14-R6; S14-R5; S13-R22; S14-N1` |
| 12 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | FLT-PSRCH-07 | 5410 | **F7** refs → `S14-R1; S14-R2; S14-R4; S14-R5` |

## B. `add_case` — 8

Every add carries `custom_atmstatus: 3` + `custom_automation_type: 0` (non-API), plus
`title`, `custom_preconds`, `custom_steps`, `custom_expected`, `refs`, `priority_id`,
`type_id`. All are `VIU-Pending` locally.

| # | Internal ID | Section | Type / Priority | Requirement |
|---|---|---|---|---|
| 1 | FLT-URL-06 | 4122 URL State and Shareable Links | Negative / Medium | `S11-N3` (+`S11-R7`) |
| 2 | FLT-EMPTY-03 | 4119 Empty State | Functional / High | `S8-R3`, `S8-R4`, `S8-R5`, `S13-N1`, `S13-N2` |
| 3 | FLT-PSRCH-08 | 5410 Page Search Toolbar | Functional / Medium | `S13-R2`–`R6`, `S13-R8` |
| 4 | FLT-PSRCH-09 | 5410 | Functional / High | `S13-R7`, `S13-R12` |
| 5 | FLT-PSRCH-10 | 5410 | Functional / High | `S13-R11`, `S13-R24` (Work Orders) |
| 6 | FLT-PSRCH-11 | 5410 | Functional / Medium | `S13-R24` (Reports/Parts), `S13-R11`, `S10-R4` |
| 7 | FLT-PSRCH-12 | 5410 | Negative / High | `S14-R3`, `S14-R2`, `S14-R1` |
| 8 | FLT-PSRCH-13 | 5410 | Functional / Medium | `S13-E1`, §4 Key Decisions |

## C. Run 352 sync (Standing Rule 34) — after A and B

1. `get_run/352` → confirm `include_all` is **false** (a case-selection run).
2. `get_tests/352` → the current `case_id` set; snapshot it, plus `get_results_for_run/352` count.
3. `union = current ∪ the 8 new case ids`; assert `set(current) ⊆ union` and
   `len(union) == len(current) + 8`.
4. `update_run/352` with `case_ids = union` (nothing else changed).
5. Verify: new test count == `len(union)`, **every prior `case_id` still present**, and
   `get_results_for_run/352` count **UNCHANGED**.
6. Abort and report on any failed assertion. **No other run is touched.**

## D. Not in this pass (recorded so nothing is silently dropped)

- **F2** mobile Apply-button flag parity on C29622/C29623 (P2 — not authorized).
- **F3** C38877 refs + note (P2 — not authorized).
- **F7** row 8: C38876 keeps its "not in spec v1.6 / pending Branko" flag deliberately.
- The **16 blank-C-id** cases outside this pass (FLT-PARTS ×4, FLT-RPTS ×3, FLT-SRCH ×9)
  are **not** pushed; the 9 FLT-SRCH cases stay HELD per the user ruling.
- **39 pre-existing over-length titles** (Rule 19) — the standing trim queue, untouched.
