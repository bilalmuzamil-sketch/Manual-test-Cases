# 🛑 STAGED — NOT EXECUTED. NOT AUTHORISED. — run 352 union — 2026-08-11

**`update_run` was NOT called and must not be called without the QA lead's explicit go-ahead
(Rules 6 / 34 / 47).** Run 352 is **Ahtasham Amjad's** and holds **473 graded result records**.

## Why the run is now one case short

`include_all` is **false**, so run 352 holds a **frozen selection** and does **not** pick up newly
created cases. Creating **C43590** therefore left it at 114 tests against a 115-case suite. **This is
not damage** — it is the documented consequence of a fixed-selection run.

| | |
|---|---|
| Run | **352** — *"Filters - Ahtasham (Awaiting QA- ENV)"* |
| `include_all` | **false** |
| Tests now | **114** |
| Result records now | **473** |
| Our live cases | **115** |
| **Missing from the run** | **C43590** — [FLT-COLL-06](https://shopview.testrail.io/index.php?/cases/view/43590) |
| In the run but not ours | none |
| **UNION to send** | **115 case ids** |

## ⚠️ THE DANGER, STATED PLAINLY

**`update_run` REPLACES the run's selection.** A partial `case_ids` list **deletes the omitted tests
AND their recorded results** — all 473 of them. **The full 115-case union must be sent, never a
one-element list.**

## The exact call, ready to run

```
update_run/352   { "case_ids": [ ...the full 115-id union... ] }
```

The union is stored in `snapshots2/run352-UNION-STAGED.json` under `union_case_ids`, alongside the
pre-state (`current_case_ids`, 114) so the two can be diffed before and after.

## Before executing — re-snapshot first

**The figures above are as at 2026-08-11 and will go stale**, exactly as run 357's staged sync did
(its baseline said 458 results when the run had moved to 529). Immediately before executing:

1. Re-run `get_tests/352` and `get_results_for_run/352` and **save the snapshot**.
2. Recompute the union from the **fresh** test list — do not reuse the list above.
3. Execute `update_run` with the **full union**.
4. Verify after: test count **115**, `case_id` sets **equal both directions**, and **every prior
   result present BY ID** — never by count alone.

## What was verified today, for the record

Run 352 was proven **undamaged** across this pass's writes: `include_all` still false, 114 tests,
`case_id` sets equal both ways, **all 473 results present by ID**, **0 new**, **0 graded-field
changes**. The only movement was 6 `case_refs` echoes, all tracing to C29601.
