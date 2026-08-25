# TestRail full-suite test runs (created 2026-08-25)

Project 1 "ShopView - APP", suite 1. Each run contains **every case in that suite's folder** and no
others (created with `include_all=false` + explicit `case_ids`, since this is a single-suite project
where `include_all=true` would pull in all ~4,500 cases).

| Suite | Run | Cases | Link |
|---|---|---|---|
| Digital Inspections V2 | **R414** | 43 | https://shopview.testrail.io/index.php?/runs/view/414 |
| Global Search V2 | **R415** | 97 | https://shopview.testrail.io/index.php?/runs/view/415 |
| Simple Flow V2 | **R416** | 61 | https://shopview.testrail.io/index.php?/runs/view/416 |
| Invoice UI Refresh | **R417** | 87 | https://shopview.testrail.io/index.php?/runs/view/417 |
| Inline Add and Edit Parts | **R418** | 96 | https://shopview.testrail.io/index.php?/runs/view/418 |
| Printer Friendly WO | **R419** | 44 | https://shopview.testrail.io/index.php?/runs/view/419 |

## Keeping runs complete when new cases are added (the "auto-add" requirement)

TestRail has **no native per-folder auto-run** in single-suite mode (`include_all=true` would include
the whole project, not just one suite). So new cases are appended to the related run with a
**union-only sync** (Rule 34): `build/testing-tools/sync_runs.py`.

Workflow after any source-verification pass that adds cases:
1. Author + import the new cases into the suite's TestRail folder (as usual).
2. `python3 build/testing-tools/sync_runs.py` — **dry-run**, shows exactly which new case IDs would be added.
3. `python3 build/testing-tools/sync_runs.py --apply` — appends them (a TestRail write; needs QA-lead
   go-ahead each time, Rule 6). Union-only: it sets `case_ids = (cases already in the run) ∪ (all cases
   now in the suite folder)`, so **no existing test or result is ever dropped**.

Config (run↔folder map, no secrets): `build/testing-tools/testrail_runs.json`.
Credentials: `/tmp/shopview-creds.env` (Rule 82 — never committed).

## Milestone (created 2026-08-25)

**M3 — "Feature Squad - DI V2, Global Search V2, Simple Flow V2, Invoice UI Refresh, Inline Add/Edit
Parts, Printer Friendly WO - August 2026"** — https://shopview.testrail.io/index.php?/milestones/view/3

Contains all six runs (R414–R419), per the ShopView TestRail Milestone Guide (one milestone per
feature squad). **Not yet started** — pending handoff/target dates from the QA lead (guide step 18:
Start Milestone after dates are set and runs verified). Dates to set on the milestone AND each run
(guide steps 7 & 13). Description carries `[handoff date]` / `[end date]` placeholders until then.

**Assignment model chosen (2026-08-25):** run owner + bulk-assign all tests in each run to that owner.
Pending inputs: which QA engineer owns each run, and their TestRail user IDs (the API key lacks admin
rights to enumerate users — `get_users` returns 403 — so assignment needs each engineer's user ID, or
it can be done in the UI via select-all → Assign To). Future: large runs may be split across multiple
engineers (per-test assignment already supports this).
