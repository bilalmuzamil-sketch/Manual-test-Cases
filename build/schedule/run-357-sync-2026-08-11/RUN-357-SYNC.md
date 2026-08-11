# Run 357 union sync — EXECUTED and VERIFIED — 2026-08-11

> **Authorised by the QA lead**, verbatim: *"The run sync is staged, not executed — Ayesha's run.
> Do the syn if doing so is a correct decision and logical and as per our rules."*
>
> **One write was made: `update_run/357`.** Nothing else. No result was logged anywhere, no case was
> added, updated or deleted, no section was touched, and no Jira call of any kind was made.

## Headline

| | before | after |
|---|---|---|
| Tests in run 357 | **168** | **174** |
| Result records | **458** | **458** — all present by id, none changed |
| `include_all` | false | **false** (unchanged) |
| Counters | 25 Passed · 0 Failed · 1 Blocked · 142 Untested | 25 Passed · 0 Failed · 1 Blocked · **148** Untested |

**The six Panel collapse cases C43582–C43587 are now in the run.** The only counter that moved is
`untested_count`, 142 → 148, which is the six new tests arriving Untested — exactly what the staged
plan predicted.

**Every one of Ayesha Khan's prior results survived.** All 458 were located **by their own id** and
compared field by field; **0 missing, 0 graded fields changed, and not even the two declared
read-time echoes moved.**

## Why the sync was owed

`get_run/357` returns **`include_all: false`**, so run 357 is a **fixed selection** that never picks
up newly added cases. Six of our cases were live in group 4254 and absent from the run. Standing
Rule 47 makes keeping the three active projects' runs complete a **standing duty**, and Rule 34 sets
the union-only method.

This is not cosmetic. A frozen Filters run 352 produced **two false coverage-gap reports from the
same reviewer** — the tester cannot see a case that is not in their run, so it reads as missing
coverage that in fact exists.

## The union was re-derived from live, not trusted from the file

The staged file was **not** taken on faith. The executor rebuilt the union from a live, fully-paged
inventory (**4,089 cases, 626 sections**) and the run's own current selection. The two agree:

| check | result |
|---|---|
| Staged union in `STAGED-RUN-357-SYNC.md` | 174 ids (174 unique) |
| Union derived independently from live | 174 ids |
| derived − staged | **empty** |
| staged − derived | **empty** |
| **Set-equal in both directions** | **yes** |
| Current selection ⊆ union | **yes** (168 ⊆ 174) |
| Overlap between current and the 6 additions | **none** |
| Cases in the run but no longer in the group | **none** |

**It was not a no-op** — six ids genuinely needed adding, so the write was warranted.

## Foreign cases (Rule 38)

**Group 4254 holds 174 cases and all 174 are ours** (`created_by = 3`). **Ours 174 / live total 174 —
zero foreign.** So no foreign case was added, and none needed preserving. Had one been present in the
selection the executor would have kept it, because dropping it would destroy that author's tests and
results.

## The danger this was shaped around

`update_run` **REPLACES** the selection: a partial `case_ids` list deletes the omitted tests **and
their recorded results**. Here that would have destroyed **458 result records** on another tester's
run. Three things prevented it:

1. **The full 174-id union was sent**, never a delta.
2. The executor **asserts `current ⊆ union` before writing** and aborts otherwise.
3. **Snapshots were taken and committed to git before the write**, so the verification afterwards
   compares against evidence rather than memory.

## Verification after the write — exhaustive then exact (Rule 50)

Run twice: once by the executor, then **independently** by a separate script re-reading live and
comparing against the *committed* pre-write snapshot.

| check | required | result |
|---|---|---|
| `include_all` | still false | **false** |
| Test count | 174 | **174** |
| `case_id` set vs union | equal **both directions** | got−want **empty**, want−got **empty** |
| Prior tests present by id | all 168 | **168, 0 lost, 0 rebound** |
| Prior results present **by id** | all 458 | **458, 0 missing** |
| Graded fields on prior results | 0 changed | **0** |
| Any other field on prior results | 0 changed | **0** |
| Declared echoes (`case_title`, `case_refs`) | may move | **0 moved** |
| New results during the window | 0 (we log none) | **0** |
| Run record | only derived counters move | 35 fields compared; **only `untested_count` + `updated_on`** |

Result rows by status, before → after: **Passed 27 → 27 · Blocked 1 → 1 · Untested 143 → 143 ·
comment-only 287 → 287.**

> **A note so the two Passed figures are not read as a discrepancy:** the run *counter* says 25
> Passed while the result *rows* show 27. These count different things — the counter counts **tests
> by their current status**, the rows count **historical result records**, and a test can carry more
> than one result over time. **Both are unchanged before and after.**

**Nothing moved that was not expected.** The one mild surprise was in our favour: the `case_title` /
`case_refs` echoes did **not** fire, because no case title or refs changed in this pass.

## Nothing drifted between the audit and the write

The pre-write snapshot was captured twice — at the audit (06:13:52Z) and again immediately before the
write (06:15:36Z, Rule 59). Comparing them: **test id → case bindings identical, result id sets
identical, 0 result records differing.** The only difference in the file is its own timestamp line.
**Ayesha logged nothing during the write window.**

## Runs 352 and 359 were not touched

The executor's `SCOPE` was **cut to run 357 alone**, so the other two runs were unreachable from it.
Confirmed read-only afterwards (`get_run` only):

| run | `updated_on` | verdict |
|---|---|---|
| 352 Filters — Ahtasham | 2026-08-10T15:54:28Z | predates this pass — **untouched** |
| 359 Report Suite — Nebojsa/Viktoria | 2026-08-05T19:14:53Z | predates this pass — **untouched** |
| **357 Schedule — Ayesha** | **2026-08-11T06:15:43Z** | **our write** |

## Rule-49 note

Run membership is not a verdict. Syncing the run **does not** make the six new cases observed, and
the Schedule branch has **not** been declared final, so those cases stay **PROVISIONAL** and their
row in `build/schedule/panel-collapse-2026-08-11/RECHECK-QUEUE.md` stays **OPEN**. This pass changed
**which tests are visible to the tester**, nothing about what any of them asserts.

## Evidence

- `snapshots/run-357-before.json` — full `get_run` + `get_tests` + `get_results_for_run`,
  **committed before the write** (168 tests, 458 results, all 21 fields each).
- `snapshots/run-357-after.json` — the same three, captured after.
- `testrail-execution-log.md` — per operation: operation · target · HTTP status · verification.
- `sync-plan.json` / `verification.json` — the executor's own machine-readable record.
- `tools/run_sync_357_only.py` — the executor, scoped to 357.

## OUTSTANDING — what I need from you

**Nothing for this sync.** It is executed, verified and complete.

One standing item it touches, for visibility rather than action: the Schedule branch is still not
declared final, so the Rule-49 queue at `build/schedule/panel-collapse-2026-08-11/RECHECK-QUEUE.md`
remains **OPEN** and all Schedule verdicts remain **PROVISIONAL**. That is the normal steady state of
an active project (Rule 60), not a defect.
