# TestRail execution log — Chris Ward's new requirement items, 2026-08-05

**Authorisation:** the QA lead authorised this pass.
**Scope of writes:** `update_case` × 13 and `add_case` × 3, plus **one** `update_run` on run 359 to
union in the three new cases. **0 `delete_case`, 0 `add_section`, 0 `delete_section`, 0 results logged
anywhere.**

**Verification standard (Rule 50).** Every write is re-`get_case`'d and compared **field by field**:
the intended fields must be byte-equal to the payload, and **every other field must be byte-identical to
the pre-write snapshot**. `refs` is compared under the one declared normalisation
(`','.join(p.strip() for p in s.split(','))`). **Every payload carried all three text fields**
(`custom_preconds`, `custom_steps`, `custom_expected`) because TestRail re-renders any text field you
omit — playbook §J normalisation #3 — and that corruption is intermittent, so it may never be allowed to
excuse a mismatch.

**Snapshots:** `PRE/` committed at 1a3122c before any write; `POST/` after. Per-operation machine log
`oplog.json`; exhaustive audit `audit.json`.

## Every operation

| # | Operation | Target | HTTP | Fields compared | Verification | Why |
|---|---|---|---|---|---|---|
| 1 | `update_case` | [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | 200 | 28 | **MATCH** — 0 problems | S7-R1 changed in v8: 'present in the loaded jobs' -> 'present across all open jobs in the current scope' |
| 2 | `update_case` | [C30499](https://shopview.testrail.io/index.php?/cases/view/30499) | 200 | 28 | **MATCH** — 0 problems | S7-R2 changed in v8: 'present in the loaded jobs' -> 'present across all open jobs in the current scope' |
| 3 | `update_case` | [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | 200 | 28 | **MATCH** — 0 problems | S7-R4 changed in v9: scope wording added; and the matching assertion is now provably broken - SV-8908 |
| 4 | `update_case` | [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | 200 | 28 | **MATCH** — 0 problems | SBC v15 added S9-R1a which contradicts this case's own S9-N2; held rather than flipped (Rules 15/57) |
| 5 | `update_case` | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 6 | `update_case` | [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 7 | `update_case` | [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 8 | `update_case` | [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 9 | `update_case` | [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 10 | `update_case` | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 11 | `update_case` | [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 12 | `update_case` | [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 13 | `update_case` | [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | 200 | 28 | **MATCH** — 0 problems | the Work In Progress download is broken on this build - SV-8907 |
| 14 | `add_case` | **WIP-COL-09** = [C43557](https://shopview.testrail.io/index.php?/cases/view/43557) | 200 | 28 | **MATCH** — 0 problems | new coverage for the negative half of the link rule |
| 15 | `add_case` | **SBC-LINK-05** = [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | 200 | 28 | **MATCH** — 0 problems | new coverage for the negative half of the link rule |
| 16 | `add_case` | **SBR-LINK-06** = [C43559](https://shopview.testrail.io/index.php?/cases/view/43559) | 200 | 28 | **MATCH** — 0 problems | new coverage for the negative half of the link rule |

**16 of 16 verified MATCH. 0 mismatches. The batch never had to stop.**

## The run sync

| Check | Before | After |
|---|---|---|
| `include_all` | false | false |
| tests | **473** | **476** |
| result records | **535** | **535** |
| case_id set equal to our live 476, both directions | — | **YES** — got−want empty, want−got empty |
| prior tests located by id | — | **473 checked, 0 lost, 0 rebound** |
| prior results located BY ID | — | **535 checked, 0 missing, 0 graded-field changes** |
| new results during our window | — | **0** (we call no `add_result`) |
| run record fields moved | — | `untested_count`, `updated_on` — **both derived counters** |

`update_run/359` sent the **FULL UNION of 476 case ids** (never a partial list). The **5 foreign cases
C38919–C38923 were excluded from the union** and none was in the run to begin with, so nothing of
Vladimir Tomovic's was added or removed. **Runs 357 (Schedule) and 352 (Filters) needed nothing and were
NOT written** — the tool skips a run whose union equals its current selection.

Tool: `build/testrail-run-sync-2026-08-05/tools/run_sync_2026_08_05.py --authorized`.
Its output is mirrored here as `run359-sync-plan.json`, `run359-sync-verification.json` and
`run359-after/`, because that tool's own folder is not owned by this worker.

## Exhaustive damage check (`audit.json`)

| Check | Population | Result |
|---|---|---|
| Cases we did NOT touch, byte-identical **including `updated_on` / `updated_by`** | **465** | **0 differing** |
| The 5 foreign cases, same standard | 5 | **0 differing** |
| Touched cases: any field moved that we did not intend | 13 | **0** |
| New cases carry `custom_atmstatus` 3, `custom_automation_type` 0, `template_id` 1, `created_by` 3, correct section | 3 | **0 problems** |
| Exactly one `AUTOMATION:` marker per case | 476 | **0 exceptions** |
| Exactly one provenance line per case | 476 | **0 exceptions** |

## Marker tally after the pass

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | **419** |
| `AUTOMATION: READY - EXPECT FAIL (…)` | **27** |
| `AUTOMATION: HOLD - …` | **30** |
| **Total** | **476** |

**ARITHMETIC GATE: 419 + 27 = 446**, and cross-checked the other way as **476 − 30 = 446.** The gate
**PASSES**.

**Ready to automate moved 447 → 446 while the suite GREW by three cases.** That is the honest direction
and it is the point: the three new cases are `HOLD` because the sign-in they need does not exist here,
and C30100 moved to `HOLD` because its requirement is now self-contradictory. **The new requirements'
coverage is therefore NOT counted as ready, so the figure cannot flatter itself.**
