# IV RE-VERIFY SWEEP — execution (2026-08-19)

> **Interim `<br>` writes EXECUTED** (TestRail API wrap block still active; QA lead accepted `<br>`,
> template C30133). **Cleanup debt** logged in `build/OUTSTANDING-ITEMS-REGISTER.md`.

**Build under test:** **`v3.8-d0e135e`** (in-browser `<meta app-version>` confirmed live), same build as
the PV/TU/WIP sweeps (sha256 `6c68f60…`, etag `aa6ea37f…`). Supersedes the 8/18 IV `v3.8-bd246fd`
(same-minor bug-fix rebuild, Rule 60). Verdicts PROVISIONAL (non-final branch). Rule-54 sentence 2 on every
written case = `Last checked against build v3.8-d0e135e on 8/19/2026.`

## Scope — re-derived LIVE (8/18 atm column was STALE)
Live re-read of all 71 cases in the IV folder (section 4287 + children):
- **ours 69 (`created_by=3`) · foreign 2** — Vladimir Tomovic (id 1): **C38921**, **C43573** (atm=3,
  HANDS-OFF Rule 38; untouched).
- **Live `custom_atmstatus`: 11 Automated (atm=3)** (8/18 doc said 5) — all HELD, 0 writes (Rule 71). See
  `IV-SWEEP-HELD-AUTOMATED.md`.
- **58 ours atm=1:** 44 already carry a fresh `v3.8-bd246fd` stamp from 8/18 and are plain-READY (same-minor
  — left as-is per Rule 60) → **14 were the sweep write scope:** 8 HOLD + 6 SV-8818 EXPECT-FAIL (re-stamped).

**Reconciliation: 69 = 44 stamped-READY (left) + 11 atm=3 (held) + 14 this-sweep.** ✓

**Write scope C-ids (14):**
- HOLD (8): C30547, C30577, C30605, C30606, C30607, C30609, C30610, C38892
- EXPECT-FAIL SV-8818 (6, re-stamped): C30587, C30590, C30591, C30593, C30595, C43548

## What was DRIVEN LIVE on v3.8-d0e135e
Boot2 admin quick-login → change-location Heavy Duty 9919 → `/reports/inventory-value` (screen-observed
present; report renders). API-driven verifications this pass:
- **SV-8818 REPRODUCES:** IV **PDF export** on the large all-locations view → **HTTP 500**
  (`application/problem+json`); **CSV export** → **HTTP 200, ~702 KB** (works). PDF-fails / CSV-works on a
  large IV view. Ticket **SV-8818 = Open / Low** (per the cached authoritative Jira capture
  `/tmp/jira-status-now.json`; direct Jira GET returned 404 for this session's token — status taken from the
  cached capture; the substantive backing is the live reproduction, Rule 61).
- **Snapshot-read endpoints probed** (`/inventory-value/snapshots`, `/inventory-value-snapshots`,
  `/inventory-value/history`) → all **HTTP 404** → the nightly capture is a server-side job whose stored
  rows are not reachable from the application (C30605/30606/30607/30609/30610/38892).
- **No-category part probe** (`POST /api/inventory/parts`) → **HTTP 405** (route is GET-only; no part-create
  endpoint found, matching the PV sweep). Parts require a category on this build → the no-category path
  (C30547) cannot be produced from the application.
- **One-location user (C30577):** 0 of 19 roster staff are single-workplace (all span 3+); `switch-user`
  returns HTTP 400 on this env → a one-location user cannot be produced here (same env limit as TU-LOC-05).

## Writes — 14 `update_case`, interim `<br>`, normalization-aware re-verify (Rule 50 declared clause)
- **8 HOLD:** marker KEPT (C30577 reason refined to name the env limit); sentence-2 refreshed/added to
  v3.8-d0e135e / 8/19/2026; body → `<br>`.
- **6 EXPECT-FAIL (SV-8818):** marker KEPT `AUTOMATION: READY - EXPECT FAIL (SV-8818)`; the
  "What you should see today…" symptom + three-outcome block KEPT; sentence-2 re-stamped v3.8-bd246fd →
  v3.8-d0e135e / 8/19/2026; body → `<br>`.
Per-op log `iv-sweep-oplog.jsonl`. **14/14 HTTP 200 + verify PASS.** Guards refused foreign / atm=3.

## Post-write census (all 14)
**0 anomalies** — each: exactly 1 marker, 1 provenance line, 1 sentence-2 (`v3.8-d0e135e`), 0 `<ol>/<li>`,
`atm=1`. The 6 EXPECT-FAIL retain the SV-8818 marker AND the symptom block.

## Held / foreign proof
- **11 Automated (atm=3) HELD — 0 writes** (Rule 71): C30534, C30535, C30557, C30563, C30569, C30579,
  C30580, C30583, C30588, C30603, C30604 — re-GET confirms all still atm=3.
- **2 foreign untouched** (Rule 38): C38921, C43573.

## Safety / integrity
- **Run 359 UNTOUCHED** — `include_all` False, 6 passed / 502 untested / 508 tests. 0 run/result writes.
- **0 Jira writes** (one attempted read-only GET on SV-8818 returned 404 for this token; status from the
  cached capture). No role/staff/settings edited, nothing seeded destructively. Cookies never committed.
