# STAGED — run 352 union sync. **NOT EXECUTED. Awaiting the QA lead's go-ahead.**

## STATUS: **STAGED, NOT EXECUTED**

**Run 352 is Ahtasham Amjad's.** No run write was authorised for this pass and **none was made** —
`update_run` was called **zero** times, and **no result was logged anywhere**.

---

## WHY A SYNC IS OWED

`get_run/352` read live: **`include_all` is `false`.** A run built from a fixed selection **never picks
up newly added cases**, so the four cases created today are **not in Ahtasham's run**.

**Until this is synced, his run shows 110 of the suite's 114 cases** — and that is the exact condition
that produced the false coverage-gap report on **31 July**, when a reviewer read "no case exists" for
cases that existed and simply were not in his run.

---

## THE DANGER, STATED PLAINLY

**`update_run` REPLACES the run's selection.** Sending a partial `case_ids` list would **delete the
omitted tests and every result recorded against them**. Run 352 currently holds **459 result records**.

**Therefore: UNION ONLY.** `sorted(set(current) | set(new))`, never a partial list.

---

## THE SNAPSHOT TAKEN BEFORE ANYTHING WAS COMPUTED

Both files are committed beside this plan, so the staged plan is verifiable and a future run can be
checked against them:

- `evidence/run352-tests.json` — **110 tests**
- `evidence/run352-results.json` — **459 result records**
- `evidence/run352.json` — the run record, `include_all: false`

---

## THE UNION, COMPUTED

| | Count |
|---|---|
| Run 352's current `case_id` list, derived from `get_tests/352` | **110** |
| New cases to add | **4** |
| **UNION to send** | **114** |

The four to be added:

| Internal | C-id | Link | Section |
|---|---|---|---|
| FLT-PERS-07 | **C43560** | [view](https://shopview.testrail.io/index.php?/cases/view/43560) | 4121 Persistence |
| FLT-PSRCH-14 | **C43561** | [view](https://shopview.testrail.io/index.php?/cases/view/43561) | 5410 Page Search Toolbar |
| FLT-PARTS-14 | **C43562** | [view](https://shopview.testrail.io/index.php?/cases/view/43562) | 5411 Parts Page Filters |
| FLT-MOB-11 | **C43563** | [view](https://shopview.testrail.io/index.php?/cases/view/43563) | 4123 Mobile Filters |

**The full 114-id union is stored in machine-readable form at
`evidence/run352-staged-union.json`** so the executor reads it rather than rebuilding it.

---

## THE EXACT OPERATION, WHEN AUTHORISED

```
POST update_run/352   body: { "case_ids": <the 114 ids from evidence/run352-staged-union.json> }
```

**One call. Nothing else.** No `include_all` change, no name change, no milestone, no assignee.

## THE VERIFICATION THAT MUST FOLLOW IT (Rule 50, and it is not optional)

1. `get_run/352` → **`include_all` still `false`**.
2. `get_tests/352` → **114 tests**; `case_id` sets **equal in BOTH directions** against the 114 union.
3. All **110** prior test ids **still present BY ID** — none rebound, none lost.
4. `get_results_for_run/352` → **all 459 prior result records present BY ID**, with **0 changes to any
   graded field** (`status_id`, `comment`, `defects`, `elapsed`, `version`, `created_by`, `created_on`,
   `test_id`, `assignedto_id`).
5. **0 new results** created by the sync.
6. Only `untested_count` and `updated_on` may move on the run record.
7. Record the test count **before → after (110 → 114)** in the execution log.

**On any mismatch: STOP and report. Do not retry.**

---

## HONEST NOTE ON TIMING

**Ahtasham was actively grading this run today** — the results count has moved on previous passes while
work was in flight. **Re-snapshot immediately before executing**, not from this file's figures, because
**459 will very likely be out of date by then** and a stale baseline would make a correct sync look
like a data loss.
