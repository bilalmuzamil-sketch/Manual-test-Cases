# WIP authoring 2026-08-28 — cases created in TestRail

Project 1 · suite 1 · group **Reports Suite** (4281) · `add_case` with `custom_atmstatus: 1`
(Not Automated), built through `build/testing-tools/testrail_add_case.py`.

| Internal ID | C-id | Link | Section | Covers (WIP spec v28) |
|---|---|---|---|---|
| `WIP-ERN-NEG-01` | **C45204** | https://shopview.testrail.io/index.php?/cases/view/45204 | 4354 · WIP — Earned & Remaining | S4-E3 (+ S4-R14 negative format) |
| `WIP-ERN-CMP-02` | **C45205** | https://shopview.testrail.io/index.php?/cases/view/45205 | 4354 · WIP — Earned & Remaining | S4-R15a · S4-R16a · S4-R18a |
| `WIP-SRT-NUL-03` | **C45206** | https://shopview.testrail.io/index.php?/cases/view/45206 | 4355 · WIP — Sorting | S4-R9 (the null-placement clause) |
| `WIP-EXP-UNI-04` | **C45207** | https://shopview.testrail.io/index.php?/cases/view/45207 | 4360 · WIP — Exports | S9-R14 |

No new section was created; all four went into existing WIP sections.

## Per-case verification (Rule 50 — "200 OK" alone is non-compliant)

Full record: `oplog.json` (API byte-check) and `rendered-verification.json` (UI render check).

| Check | C45204 | C45205 | C45206 | C45207 |
|---|---|---|---|---|
| `add_case` HTTP | 200 | 200 | 200 | 200 |
| Re-`get_case` HTTP | 200 | 200 | 200 | 200 |
| title / refs / preconditions / steps / expected byte-match the draft | ✅ | ✅ | ✅ | ✅ |
| landed in the intended section | ✅ | ✅ | ✅ | ✅ |
| `custom_atmstatus` = **1** (Not Automated) · `custom_automation_type` = 0 | ✅ | ✅ | ✅ | ✅ |
| Mechanical readiness gate (`check_tester_readiness.py`, live) | PASS | PASS | PASS | PASS |
| **Rendered page**: literal `&lt;br&gt;` / `&lt;p&gt;` in visible text | **0** | **0** | **0** | **0** |
| **Rendered page**: automation marker present exactly once and LAST | ✅ | ✅ | ✅ | ✅ |
| **Rendered page**: provenance line present exactly once | ✅ | ✅ | ✅ | ✅ |
| `<br>` rendering as real line breaks in the visible block | 14 | 20 | 15 | 16 |

**How the render check was done:** logged into the TestRail UI with a session cookie and read
`/index.php?/cases/view/<id>`, then scored **only** the visible `<div class="markdown fr-view">`
blocks. *Trap worth recording:* the raw page also carries the case source twice more — inside
`<input id="hdnAutomateCaseDetails">` (the "Automate with AI" modal) and a `<script>` payload — both
entity-escaped. Scoring the whole page reports 17–23 "literal tags" and a duplicated marker on a
perfectly clean case. **Score the `fr-view` blocks only.**

## AUTOMATED CASES CHANGED — FOR VLAD (Rule 65)

**None.** No existing case was modified in this pass, and no case TestRail flags as Automated
(`custom_atmstatus = 3`) was read, changed or deleted. The four new cases were born
`custom_atmstatus: 1`.

## Run sync (Rule 34)

**NOT DONE — needs its own permission.** Report Suite's active run is **359**. An `add_case`
approval is not a run-write approval (skill `01` §10), and a partial `case_ids` list on
`update_run` **deletes tests and their results** — so this must be a union-only sync, explicitly
authorised. The four new cases are **not yet in run 359**.

## Not executed here (recommendations only — see COVERAGE-MATRIX.md)

- `update_case` **C30457** — add "Declined" to the excluded statuses; re-anchor from S2-R5 to S2-R2/S2-R3
- `update_case` **C43838** — v28 has ruled the highlight **violet**; close the open amber-vs-violet note, add the active-tab weight
- `update_case` **C30528** — add the Labor/Parts earned-remaining breakdown and the Adjustments value to the snapshot field list
- `refs` backfill on 12 cases so 25 v28 anchors stop reading as NOT COVERED
