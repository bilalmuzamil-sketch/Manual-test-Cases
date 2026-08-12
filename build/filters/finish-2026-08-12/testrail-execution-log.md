# Filters — TestRail execution log, 2026-08-12

**1 operation. `update_case` only. 0 add_case · 0 delete_case · 0 section writes · 0 run writes ·
0 results logged anywhere · 0 Jira calls of any kind.**

Per-operation record written to `evidence/oplog.json` **before** the write and completed after it, so
a session killed mid-batch leaves its exact position on disk.

| # | Case | Op | Fields sent | HTTP | Byte-verified | `custom_atmstatus` at write time |
|---|---|---|---|---|---|---|
| 1 | [C43590](https://shopview.testrail.io/index.php?/cases/view/43590) | `update_case` | `custom_preconds`, `custom_steps`, `custom_expected` | 200 | **MATCH on all three** | **1 (Not Automated)** — never sent |

**All three text fields were on the payload**, including `custom_expected`, which did not change:
TestRail re-renders any text field omitted from a payload through its HTML pipeline, and this project
shows markup literally to the tester.

**The payload was printed and read before it was sent** (see the transcript of the build step) — the
practice that caught a stray `.;` on a sibling project today, which would have passed a byte-check
because the byte-check compares against the payload, not against sense.

## Verification, after the write

| Check | Result |
|---|---|
| Fields that moved on C43590 (excluding `updated_on`/`updated_by`) | **`custom_preconds`, `custom_steps` — exactly the two intended** |
| `title`, `refs`, `section_id`, `custom_atmstatus` | **byte-identical** |
| The other **114** of our cases | **0** with a moved `updated_on` or `updated_by` |
| Foreign five C43576–C43580 (`created_by = 7`) | **30 fields each, 0 differing**, `updated_by=7` / `updated_on=1786371856` intact |
| Run 352 `include_all` | still **false** — never called `update_run` |
| Run 352 tests | **120 → 120**, every prior test present **by id**, 0 lost |
| Run 352 results | **632 → 635**, every prior result present **by id**, **0 fields changed on any prior result** |
| The 3 new results | **created_by = 7** — Ahtasham grading during the window, not us |
| Case-id sets, run vs suite | **equal in both directions** |

**Reconciliation of writes against plan: 1 planned, 1 executed, 1 verified — by count and by case id.**

## Run 352 had already moved before this session touched anything

Diffed against the committed 06:15Z baseline (`build/filters/verify-final-2026-08-12/evidence/run352-snapshot.json`):

- **tests 115 → 120** — the five foreign cases C43576–C43580 were added to the run
- **results 473 → 632** — of the 159 new records, **154 are assignment records** (null status,
  `assignedto_id = 7`) written under our shared account between 09:09 and 11:07 UTC, and **5 are user
  7 grading his own cases Passed**
- **all 115 of our tests are now assigned to user 7**

**None of that is ours.** It is recorded because a later reader diffing the two snapshots would
otherwise attribute it to this pass. It also explains the urgency: **the tester runs these tomorrow.**
