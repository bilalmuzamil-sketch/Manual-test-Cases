# TestRail execution log — run 357 union sync — 2026-08-11

**Authorisation:** QA lead, verbatim — *"The run sync is staged, not executed — Ayesha's run. Do the
syn if doing so is a correct decision and logical and as per our rules."*

**Scope of authorisation: ONE `update_run` on run 357.** Executor `tools/run_sync_357_only.py`, whose
`SCOPE` was cut to run 357 alone so runs 352 and 359 could not be reached.

**Account:** user id 3 (Bilal Muzamil). **Run 357 owner:** Ayesha Khan.

## Operations, in order

| # | Time (UTC) | Operation | Target | HTTP | Verification |
|---|---|---|---|---|---|
| 1 | 06:13:3xZ | `get_cases` (paged) | project 1 / suite 1 | 200 | 4,089 cases read, fully paged (chunks until short) |
| 2 | 06:13:4xZ | `get_sections` (paged) | project 1 / suite 1 | 200 | 626 sections read, fully paged — paging is mandatory here (playbook §J) |
| 3 | 06:13:52Z | `get_run` | 357 | 200 | `include_all: false` — confirms a fixed selection that cannot self-update |
| 4 | 06:13:52Z | `get_tests` (paged) | 357 | 200 | **168** tests captured in full |
| 5 | 06:13:52Z | `get_results_for_run` (paged) | 357 | 200 | **458** result records captured in full, all 21 fields each |
| 6 | — | *(snapshot committed to git)* | `26ad214c` | — | pre-write evidence committed **before** any write |
| 7 | 06:15:3xZ | `get_cases` / `get_sections` / `get_run` / `get_tests` / `get_results_for_run` | project 1, run 357 | 200 | Rule-59 re-read immediately before the write: **0 drift** vs the committed snapshot — test id→case bindings identical, result id sets identical, 0 records differing |
| **8** | **06:15:43Z** | **`update_run`** | **357** | **200** | **THE ONLY WRITE.** Payload `{include_all: false, case_ids: [<full 174-id union>]}` — the FULL UNION, never a delta |
| 9 | 06:15:4xZ | `get_run` | 357 | 200 | run record: 35 fields compared, **only `untested_count` (142→148) and `updated_on` moved** — both derived |
| 10 | 06:15:4xZ | `get_tests` (paged) | 357 | 200 | **174** tests; `case_id` set equal to the union **both directions**; 168 prior tests all present **by id**, 0 lost, 0 rebound |
| 11 | 06:15:4xZ | `get_results_for_run` (paged) | 357 | 200 | **458** results; all prior present **BY ID**; **0 missing, 0 graded-field changes, 0 other-field changes, 0 echoes moved, 0 new** |
| 12 | 06:16:18Z | `get_run` / `get_tests` / `get_results_for_run` | 357 | 200 | **INDEPENDENT** re-verification by a separate script against the *committed* snapshot — every check above reproduced |
| 13 | 06:16:59Z | `get_run` (read-only) | 352, 359 | 200 | non-interference proof: `updated_on` 2026-08-10T15:54:28Z and 2026-08-05T19:14:53Z, both **predating** this pass |

## The one write, in full

```
POST update_run/357
{ "include_all": false,
  "case_ids": [ 174 ids — the current 168 ∪ {43582, 43583, 43584, 43585, 43586, 43587} ] }
-> HTTP 200
```

**Union derivation (not trusted from the staged file):** rebuilt from the live inventory and the
run's own selection, then cross-checked against the staged 174 — **set-equal in both directions,
derived−staged empty, staged−derived empty.** The executor also asserts `current ⊆ union` before
writing and aborts if that fails, so a partial list cannot reach the API.

## Verification detail (Rule 50 — exhaustive then exact)

```
run record  : 35 fields compared; moved = ['untested_count', 'updated_on'] (all derived counters)
case_id set : got 174 / want 174; got-want=empty, want-got=empty
test count  : before 168 -> after 174 (expected 174)
prior tests : 168 checked by id, lost=0, rebound=0
prior results: 458 checked BY ID, missing=0, graded-field changes=0, declared echoes moved={}
results after: 458 total; NEW since snapshot = 0 (none may be ours — we call no add_result)
VERIFIED OK
```

Graded fields compared raw on every prior result: `id`, `test_id`, `status_id`, `comment`,
`defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `attachment_ids`,
`case_id`. **Every non-graded field was also compared** — `other moved = 0` — so the check was not
limited to the graded list.

Result rows by status, before → after: **Passed 27 → 27 · Blocked 1 → 1 · Untested 143 → 143 ·
comment-only (`status_id: null`) 287 → 287.**

## Declared read-time echoes

`case_title` and `case_refs` are derived display copies on result records (playbook §J
normalisations #2 / #2b) and **may** move without a real change. **Neither moved here** — no case
title or refs was edited in this pass, so there was nothing for them to echo. Recorded because their
*absence* is as much a fact as their presence.

## What was NOT done

- **0** `add_result` / result logging of any kind — the sync adds tests, it never grades them.
- **0** `add_case`, **0** `update_case`, **0** `delete_case`, **0** section operations.
- **0** writes to runs 352 and 359 — unreachable from this executor's `SCOPE`; proven by their
  `updated_on` timestamps predating this pass.
- **0** Jira calls of any kind (the creation hold stands).
- **0** foreign cases touched — group 4254 holds none (ours 174 / live total 174).
