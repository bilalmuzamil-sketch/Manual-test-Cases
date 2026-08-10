# Run 352 (Filters) — case sync, 2026-08-10

**Authorisation:** QA lead, verbatim — *"Sync Ahtasham's frozen run --> OK"*.
**Operation performed:** one `update_run/352` carrying the FULL UNION of case ids. Nothing else.
**Result: 110 tests → 114 tests. Every one of the 473 prior result records survived, verified BY
ID and byte-identical on every field.**

---

## 1. Why this was needed

Run 352 — *"Filters - Ahtasham (Awaiting QA- ENV)"* — is Ahtasham Amjad's execution run. It was
created with `include_all: false`, so it is **frozen at the case selection it was built with** and
does **not** pick up cases added afterwards (Standing Rule 34's gotcha).

Our Filters suite had moved to **114** active cases while his run still held **110** tests. That
four-case gap has now produced **two false gap reports from the same reviewer**, most recently the
claim that we hold no coverage for SV-8798 / SV-8799 — where a covering case,
**[C43561](https://shopview.testrail.io/index.php?/cases/view/43561)**, existed all along and simply
was not in his run.

## 2. The safety problem, and how it was handled

`update_run` **REPLACES** a run's selection. A partial `case_ids` list does not merely fail to add —
it **DELETES the omitted tests and their recorded results**. Ahtasham had **78 graded results** in
this run. The controls applied:

| Control | How it was satisfied |
|---|---|
| Use the SAFE executor | `build/testrail-run-sync-2026-08-05/tools/run_sync_2026_08_05.py`. The 2026-07-31 version was **not** used — its result check is `len(after) >= len(before)`, which cannot detect a destroyed result. |
| Do not touch runs 357 / 359 | Live workers are on Schedule and Report Suite today. A **scoped copy** was taken at `tools/run_sync_352_2026_08_10.py` with `SCOPE = [(352, 'Filters', 4110)]`. Runs 357 and 359 are **unreachable from this script** — not merely skipped. The only other change is the snapshot path. |
| Snapshot before any write | `get_run` + `get_tests` + `get_results_for_run`, in full (every result record, not a digest), written to `snapshots/run-352-before.json` and **committed in `ba8449b2` before the write ran**. |
| Send the FULL UNION | `sorted(set(current) | set(ours))` = 114 ids. The script asserts `current ⊆ union` before sending and aborts otherwise. |
| Verify after, exhaustive then exact | Rule 50 — see §5. |

## 3. The union computed

| Quantity | Value |
|---|---|
| Live cases under group 4110 | **119** = ours **114** + foreign **5** |
| Run's current selection | **110** |
| Union sent | **114** |
| Added | **4** — C43560, C43561, C43562, C43563 |
| Foreign cases already in the run | none |
| Foreign cases excluded from the union | C43576–C43580 (see §6) |
| Cases in the run but no longer in the group | none |

The four added cases:

| Case | C-id | Title |
|---|---|---|
| — | [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | When two devices set different filters, the last one saved wins |
| — | [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | On a phone, pages with two or more icon buttons collapse them into one menu |
| — | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filters collapse, share and work on a phone as Work Orders do |
| — | [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | On a phone, picking Imported works alone and disables the other filters |

**C43561 is the case whose absence from this run produced the reviewer's SV-8798/SV-8799 gap
claim.** It is now in his run.

## 4. The write

```
POST update_run/352   {"include_all": false, "case_ids": [ ...114 ids... ]}   -> HTTP 200
```

**Test count: before 110 → after 114.** One operation. No result was logged anywhere — the sync
adds tests, it never grades them.

## 5. Verification (Standing Rule 50 — exhaustive, then exact)

Post-write snapshot `snapshots/run-352-after.json`, compared against the pre-write snapshot:

| Check | Result |
|---|---|
| Run record, field by field | 35 fields compared. **Only `untested_count` and `updated_on` moved** — both derived counters. Name, description, milestone, assignee, `include_all` all unchanged. |
| `case_id` set equality, **both directions** | got 114 / want 114; `got − want` = empty, `want − got` = empty. Not checked by count. |
| Test count | 110 → 114, expected 114. |
| Prior tests by id | 110 checked **by their own id**: **0 lost, 0 rebound** to a different case. |
| **Prior results by id** | **473 of 473 present BY ID. 0 missing.** |
| Prior results, field by field | **0 graded-field changes. 0 records differing on ANY field.** |
| Declared read-time echoes | `case_title` / `case_refs` — **0 moved.** Neither echo fired this pass. |
| New result records | **0.** Nothing was created. |

**Independently re-checked, not merely taken from the executor's own verdict:** all 473 records
re-compared from the two snapshot files on every key. **Ahtasham's 78 graded results — 65 Passed,
13 Failed — came back exactly as he left them**, 0 missing and 0 fields differing.

Result provenance in this run, for the record: of the 473 records, **78 are Ahtasham's graded
results** (user 7, logged 4–6 Aug) and **395 are system rows from our July run creation** (user 3 —
79 `Untested`, 316 status-less). Only the 78 are real graded data, and all 78 are intact.

## 6. Reported, not acted on — five foreign cases now in the Filters group

Group 4110 holds **five cases we did not author**, all created by **user 7 (Ahtasham Amjad)** in a
new section **6499**, every one referencing **SV-8799**:

| C-id | refs | Title (truncated) |
|---|---|---|
| [C43576](https://shopview.testrail.io/index.php?/cases/view/43576) | SV-8799 (S14-R1; S14-R4) | Global search returns navigational results only and does not modify the… |
| [C43577](https://shopview.testrail.io/index.php?/cases/view/43577) | SV-8799 (S14-R5) | Global search no longer alters the record set on any surface (app-wide) |
| [C43578](https://shopview.testrail.io/index.php?/cases/view/43578) | SV-8799 (S14-R2; S14-R3) | Page-filtering code path is removed and stale URL / persisted terms no… |
| [C43579](https://shopview.testrail.io/index.php?/cases/view/43579) | SV-8799 (S14-R6) | Every affected surface still offers text narrowing via page search |
| [C43580](https://shopview.testrail.io/index.php?/cases/view/43580) | SV-8799 (S14-N1) | Global-search filtering is not removed from a page before page search… |

**Per Standing Rule 38 these were not touched, not counted as ours, and not added to the union** —
we never add another author's case to a run. They are the reviewer's own answer to his own gap
claim: having reported that SV-8799 was uncovered, he has authored five cases for it himself.

**This is a question for the QA lead, not a decision for us**, and it is worth asking, because
these five and our own SV-8798/SV-8799 cases may overlap. Our counts stay honest either way:
**ours 114 / live in group 119.**

## 7. Files

- `snapshots/run-352-before.json` — full pre-write snapshot, committed **before** the write.
- `snapshots/run-352-after.json` — full post-write snapshot.
- `sync-plan.json` — the computed union and exclusions.
- `verification.json` — the machine verdict.
- `tools/run_sync_352_2026_08_10.py` — the run-352-scoped executor.
- `testrail-execution-log.md` — per-operation log.
