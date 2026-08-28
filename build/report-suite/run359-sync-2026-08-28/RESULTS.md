# Test run 359 synced — the four new WIP cases added — 2026-08-28

**Run 359 "Reports Suite - Nebojsa & Viktoria". Approved by the QA lead 2026-08-28.**

**Nothing was deleted. Proved by ID, not by count.**

| | Before | After | Change |
|---|---|---|---|
| **Tests in the run** | **509** | **513** | **+4** — exactly the four new cases |
| **Results in the run** | **535** | **535** | **0** |
| Pre-existing **test** IDs missing afterwards | — | — | **0 of 509** |
| Pre-existing **result** IDs missing afterwards | — | — | **0 of 535** |
| Pre-existing tests whose `status_id` changed | — | — | **0** |

## Why this had to be done as a union

`update_run` **REPLACES** the run's selection — it does not add to it. A partial `case_ids` list
deletes every test that is left out **and every result attached to it**. So:

1. the run's tests and results were paged out in full and snapshotted **before** anything was sent
   (`BEFORE-AFTER.json` holds every test ID and every result ID from the before state);
2. the payload sent was **`set(existing 509) ∪ set(4 new)` = 513 case IDs**, computed from that
   snapshot, never a hand-written list;
3. the run was paged out again **after** the write and compared **ID by ID against the before
   snapshot**, not by count.

The run had **6 results recorded as Passed** and 449 untested entries plus 80 comment-only rows
before the sync; all 535 are still present afterwards with their statuses unchanged.

## What was added

| Case | Title | Section |
|---|---|---|
| [C45204](https://shopview.testrail.io/index.php?/cases/view/45204) | A work order discounted below its value shows a negative Total | 4354 |
| [C45205](https://shopview.testrail.io/index.php?/cases/view/45205) | Completing a work order moves all approved labor and parts to Earned | 4354 |
| [C45206](https://shopview.testrail.io/index.php?/cases/view/45206) | Sorting by Asset puts rows with no unit number last, never in between | 4355 |
| [C45207](https://shopview.testrail.io/index.php?/cases/view/45207) | Downloads carry the same Unit and VIN text the screen shows | 4360 |

`update_run/359` returned **HTTP 200**. The run is still open (`is_completed = false`) and still
`include_all = false`, as it was before.

## OUTSTANDING — what I need from you

Nothing outstanding for this sync.
