# RUN SYNC — runs 357, 352, 359 — executed 2026-08-12 (UTC)

**Authorised by the QA lead, verbatim:** *"regarding pushing the test cases to test run, yes please
push them to the relevant test runs."*

**HEADLINE: all three runs synced. 1,537 prior result records across the three runs, every single
one present BY ID afterwards. 0 lost, 0 rebound, 0 graded-field changes, 0 results written by us.**

Order of execution was Schedule → Filters → Reports, per the QA lead's stated priority.

| Run | Project | Owner | Tests before | Tests after | Cases added | Prior results | Results after | Verdict |
|---|---|---|---|---|---|---|---|---|
| **357** | Schedule | Ayesha Khan | 174 | **176** | C43588, C43589 | 529 | 529 | ALL CHECKS PASSED |
| **352** | Filters | Ahtasham Amjad | 114 | **115** | C43590 | 473 | 473 | ALL CHECKS PASSED |
| **359** | Report Suite | Nebojsa / Viktoria | 476 | **480** | C43591–C43594 | 535 | 535 | ALL CHECKS PASSED |

`include_all` was **false** on all three before and remains **false** on all three after — it was
never flipped, which would have silently pulled in every case in suite 1 across all projects.

---

## Why a removal was structurally impossible

`update_run` REPLACES the case selection, so the danger is a partial list. Three things made a
removal impossible here rather than merely unlikely:

1. **The union was re-derived LIVE, not replayed from the staged files.** Both staged files were
   stale — run 357's baseline recorded **458** result records and the run actually held **529**
   (Mudassir Qamar had graded 71 more), and its counters had moved from 25 Passed to 89 Passed.
   Replaying either staged list would still have been safe here, but the figures in them were wrong.
2. **The executor ASSERTS `union ⊇ current` and aborts before the write if anything would drop.**
   `DROPPING` printed empty on all three.
3. **Every union was a pure superset.** `in_run_not_ours` was **0** on all three runs, so no other
   author's case was in any run and none could be displaced.

## Foreign cases (Rule 38)

| Project | Foreign cases live | In the run? | Action |
|---|---|---|---|
| Filters | 5 (Ahtasham Amjad, `created_by=7`) | none | not added, not touched |
| Schedule | 0 | — | — |
| Report Suite | 12 (Vladimir Tomovic, `created_by=1`) | none | not added, not touched |

None of the 17 foreign cases was in any run, so none was added and none could be removed. Had one
been present it would have been carried into the union, since dropping it would destroy its owner's
results.

---

## Verification performed after each write — six checks, none by count alone

1. `get_run` → expected test count; `include_all` still `false`.
2. `case_id` sets **equal in BOTH directions** against the union sent.
3. Every prior `test_id` present **BY ID**; 0 lost; 0 rebound to a different case.
4. Every prior result record present **BY ID** (never by count — a matching total hides a swap).
5. **0 changes** on the graded fields: `id`, `test_id`, `status_id`, `comment`, `defects`,
   `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `attachment_ids`.
6. Run record: no field moved except the expected counters.

**Declared echoes `case_title` / `case_refs` moved on ZERO records** on all three runs — expected,
since this pass called no `update_case` at all. They are excluded from the graded comparison per
playbook §J normalisations #2 / #2b / #2c, but here there was nothing to exclude.

**0 new results appeared** during any write window. We call no `add_result` and never grade another
tester's run.

### Independent re-verification, after all three writes

Re-run against the **originally committed** pre-write snapshots rather than the executor's own
in-memory ones, so the proof does not depend on the executor being correct:

```
RUN 357: tests=176 (expect 176) include_all=False results=529 | prior_results=529 missing=0
         prior_tests=174 lost=0 rebound=0 graded_moved=none echoes_moved=none -> PASS
RUN 352: tests=115 (expect 115) include_all=False results=473 | prior_results=473 missing=0
         prior_tests=114 lost=0 rebound=0 graded_moved=none echoes_moved=none -> PASS
RUN 359: tests=480 (expect 480) include_all=False results=535 | prior_results=535 missing=0
         prior_tests=476 lost=0 rebound=0 graded_moved=none echoes_moved=none -> PASS

INDEPENDENT RE-VERIFICATION: ALL THREE PASS
```

## Case counts reconcile

| Project | Live cases (ours) | Foreign | Run tests after |
|---|---|---|---|
| Schedule | 176 | 0 | **176** |
| Filters | 115 | 5 | **115** |
| Report Suite | 480 | 12 | **480** |

Every one of our active cases is now executable from its run.

## Writes performed

**3 × `update_run`, nothing else.** 0 `add_case` · 0 `update_case` · 0 `delete_case` · 0 section
writes · 0 results · 0 Jira calls.

## Evidence

- `SNAPSHOTS/run{357,352,359}-PRE-{run,tests,results}.json` — committed **before any write**
- `SNAPSHOTS/run{357,352,359}-PREWRITE-*.json` — taken immediately before each write
- `SNAPSHOTS/run{357,352,359}-POST-*.json` — after
- `SNAPSHOTS/run{357,352,359}-POST-verification.json` — full check output and the union sent
- `SNAPSHOTS/run{357,352,359}-UNION.json` — current / ours / union / adding / dropping
- `tools/sync_one_run.py` — scoped by argv to ONE run per invocation, so it cannot reach the
  other two; dry-run by default, writes only with `--authorized`
