# WIP RE-VERIFY SWEEP — execution (2026-08-19)

> **Interim `<br>` writes EXECUTED** (TestRail API wrap block still active; QA lead accepted `<br>`,
> template C30133). **Cleanup debt** logged in `build/OUTSTANDING-ITEMS-REGISTER.md`.

**Build under test:** **`v3.8-d0e135e`** (in-browser `<meta app-version>` confirmed live), same build as
the PV/TU sweeps (sha256 `6c68f60…`, etag `aa6ea37f…`, last-mod Wed 19 Aug 2026 13:27:07 GMT). Supersedes
the 8/18 WIP `v3.8-bd246fd` (same-minor bug-fix rebuild, Rule 60). Verdicts PROVISIONAL (non-final branch).

## Scope — re-derived LIVE (8/18 atm column was STALE)
Live re-read of all 94 cases in the WIP folder (section 4286 + children):
- **ours 92 (`created_by=3`) · foreign 2** — Vladimir Tomovic (id 1): **C38922**, **C43572** (atm=3,
  HANDS-OFF Rule 38; untouched).
- **Live `custom_atmstatus`: 14 Automated (atm=3)** (8/18 doc said 10) — all HELD, 0 writes (Rule 71). See
  `WIP-SWEEP-HELD-AUTOMATED.md`.
- **78 ours atm=1:** 71 already carry a fresh `v3.8-bd246fd` stamp from 8/18 (same-minor — left as-is per
  Rule 60, NOT re-written) → **7 HOLD cases were the sweep write scope.** 0 old/no-stamp READY, 0 deferred.

**Reconciliation: 92 = 71 stamped-atm=1 (left) + 14 atm=3 (held) + 7 this-sweep.** ✓

**Write scope C-ids (7, all HOLD):** C30467, C43551, C30528, C30530, C30531, C30533, C38918.

## What was DRIVEN LIVE on v3.8-d0e135e
Boot2 admin quick-login → change-location Heavy Duty 9919 → `/reports/work-in-progress`.
- **Report renders**; four tabs with live counts: **Approved - Partially Completed (362) · Approved - Not
  Started (664) · Completed (371) · Estimates (1067)**.
- **Default columns on screen:** WO #, Status, Customer, Asset, **Location**, Advisor, Days Open, Earned,
  Remaining, **Adjustments**, Total. **Adjustments IS built** (header + selector).
- **Column Selection control (`width_normal`)** lists exactly: WO #, Status, Customer, Asset, VIN, Advisor,
  Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining,
  **Adjustments**, Labor Delta. **Location is NOT in the Column Selection control** (visible default column
  but NOT user-toggleable) → C30467 / C43551 deviation re-confirmed on v3.8-d0e135e.
- **Export menu (`more_horiz`)** offers Download (PDF) / Download (CSV) — exports present.
- **Snapshot-read endpoints probed** (`/work-in-progress/snapshots`, `/wip-snapshots`, `/history`) → all
  **HTTP 404** → the nightly-capture snapshot is written by a background process and nothing in the product
  reads it back (C30528/30530/30531/30533).
- Largest tab = Estimates **1067 rows** → no tab comes near the export row cap (C38918).

## Writes — 7 `update_case`, interim `<br>`, normalization-aware re-verify (Rule 50 declared clause)
All 7 HOLD cases re-driven live, HOLD marker KEPT, Rule-54 sentence 2 refreshed/added to
`Last checked against build v3.8-d0e135e on 8/19/2026.`, body converted to `<br>`. Per-op log
`wip-sweep-oplog.jsonl`. **7/7 HTTP 200 + verify PASS.** Guards refused foreign / atm=3 (none in scope).

## Post-write census (all 7)
**0 anomalies** — each: exactly 1 `AUTOMATION: HOLD` marker, 1 provenance line, 1 sentence-2 stamped
`v3.8-d0e135e`, 0 `<ol>/<li>`, `atm=1`, `created_by=3`.

## Held / foreign proof
- **14 Automated (atm=3) HELD — 0 writes** (Rule 71): C30451, C30452, C30460, C30462, C30488, C30498,
  C30506, C30507, C30508, C30510, C30511, C30515, C30518, C30527 — re-GET confirms all still atm=3.
- **2 foreign untouched** (Rule 38): C38922, C43572.

## Safety / integrity
- **Run 359 UNTOUCHED** — `include_all` False, 6 passed / 502 untested / 508 tests. 0 run/result writes.
- **0 Jira writes.** No role/staff/settings edited, nothing seeded destructively. Cookies never committed.
