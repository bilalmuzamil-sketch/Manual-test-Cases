# PV RE-VERIFY SWEEP — execution (2026-08-19)

> ## ✅ COMPLETION — 2026-08-19 (interim `<br>` writes EXECUTED)
> The TestRail API markdown-wrap block (`UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`) is **still active**,
> and the QA lead **ACCEPTED the interim `<br>` format** (rendering verified on C30133). **ALL 36
> in-scope PV cases (ours, `custom_atmstatus = 1`, not already freshly build-verified this cycle) have
> been WRITTEN** in that format and normalization-aware re-verified. **Every write stores literal `<br>`
> line breaks — cleanup debt (demark to plain once the TestRail API wrap regression is fixed; logged in
> `build/OUTSTANDING-ITEMS-REGISTER.md`).**
>
> **CANONICAL TEMPLATE:** C30133's stored `<br>` form — numbered items joined with `<br>`,
> `<br><br>---<br>` before the Rule-54 provenance, `<br><br>` before the `AUTOMATION:` marker.

**Build under test (read live, HTTP header + in-browser `<meta app-version>`, at pass START, WRITE-START
and END — byte-stable, no redeploy under the pass):** **`v3.8-d0e135e`**, `index.html` last-modified
**Wed, 19 Aug 2026 13:27:07 GMT**, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`, sha256
`6c68f6044e5391b99c99d143fa2fa9d76bbe7a82fa7be85a01a64fac296aa9c4`. Read at 13:46:24Z (start),
14:04:44Z (write-start, Rule 59) and 14:12:42Z (end) — identical all three. This **supersedes the 8/18
PV pass's `v3.8-bd246fd`** — a same-minor bug-fix rebuild (Rule 60: does not make the 8/18 verdicts
stale; all verdicts remain PROVISIONAL on a non-final branch). Rule-54 sentence 2 on every written case
now reads `Last checked against build v3.8-d0e135e on 8/19/2026.`

## Scope — the 36 PV cases in this sweep (all `created_by = 3`, 0 foreign, all `custom_atmstatus = 1`)
Live re-read of all 75 cases in the PV report folder (sections 4329–4337):
- **Ours: 72** (`created_by = 3`) · **Foreign: 3** — Vladimir Tomovic (id 1): **C38920**, **C43567**,
  **C43568** (HANDS-OFF, Rule 38; 0 touched; re-GET shows updated 267–476 h ago = not this pass).
- **Live `custom_atmstatus` re-read (authoritative — the 8/18 PV-EXECUTION/HELD atm column was STALE):**
  **13 Automated (atm=3) among ours** (not 8 as the 8/18 doc recorded), all HELD, 0 writes (Rule 71) —
  see `PV-SWEEP-HELD-AUTOMATED.md`. **5 of the 13 are NEW-since-8/18** (C30322, C30351, C30354, C30375,
  C30377) — three of them (C30322/C30351/C30377) were WRITTEN on 8/18 (atm=1 then) and have since been
  re-flagged Automated.
- **Of the 59 atm=1 ours:** 23 already carry a fresh `v3.8-bd246fd` stamp from the 8/18 pass (a
  same-minor build — left as-is per Rule 60; **NOT re-written**) → **36 ours atm=1 were UNSTAMPED =
  this sweep's write scope.**

**Reconciliation: 72 = 23 stamped-atm=1 (left) + 13 atm=3 (held) + 36 this-sweep.** ✓

**Write scope C-ids (36):**
C30327, C30330, C30331, C30332, C30334, C30335, C30336, C30339, C30340, C30341, C30342, C30344,
C30345, C30348, C30349, C30355, C30356, C30358, C30359, C30360, C30361, C30362, C30363, C30364,
C30365, C30366, C30367, C30372, C30382, C30385, C30386, C30387, C38885, C38924, C38925, C43547.

## What was DRIVEN LIVE on v3.8-d0e135e this run
Boot2 (`/tmp/cln/staging-boot2.mjs`, admin quick-login → change-location Heavy Duty 9919 → navigate).
The supplied cookies were **409 (stale)** at pass start; re-established via `quick-login {key:'admin'}`
(I am the only staging worker now), fresh PHPSESSID captured, `my-workplaces` → HTTP 200.

- **Build marker in-browser** (`<meta app-version>`) = **`v3.8-d0e135e`**.
- **Nav + open:** Reports → **PARTS** group → **Parts Velocity**, route `/reports/parts-velocity`, title
  "Parts Velocity - Report | ShopView". Renders and is POPULATED (report API HTTP 200, 30 rows/page).
- **Defaults:** date range **This Year**, auto-fetches on open (`range=custom` with year bounds).
- **Filters (all present + narrow the table):** Type (`select_multiple_pv_type`, options **All types /
  Clear all / Inventory / Special Order** — multi-select), Category, Vendor, Bin (all
  `select_multiple_pv_*_filter`), Location (`select_multiple_report_location_filter`, +clear), toolbar
  search (`input_report_search`). Selecting a location re-fires the report with `locations=<ids>`.
- **Custom date range (C30331):** within-366-days → HTTP 200; **over-366 → HTTP 400 "Date range cannot
  exceed 366 days."** (verified live).
- **Row model:** inventory + special_order rows; **a part stocked at TWO locations shows as two
  per-location rows** (C30341 — BRAKECLEAN, GREASETUBE, Fuel, A4711800209, ATFMVDD, WS2 each at Heavy
  Duty + Lethbridge); aggregation rows show **"Multiple"** in Location (C30342).
- **20 columns + picker:** column selector lists exactly the 20 columns (Type, Part #, Description,
  Category, Vendor, Units Sold, Units Returned, Sold (WO), Sold (Parts Sale), Avg Cost, Avg Sell,
  Revenue, Margin, Margin %, Demand, Last Sale, On Hand, Turns/Yr, Min, Max); Location is NOT a picker
  toggle (scope-governed). Headers carry info icons (Units Sold / Demand) + sort arrows; **sticky
  header** (computed `position: sticky`); Type renders plain text.
- **Calc contract (epic SV-8582 / FORMULAS-SV-8582.md) — verified live per-row:** over 100 live rows
  **Margin % = Margin ÷ Revenue × 100, 0 mismatches**; **Revenue ≠ Avg Sell × Units Sold on 95/100
  rows = PV-CALC-15** (movement-based Units Sold vs billed units) confirmed. Data columns observed live:
  **Units Returned** (MDS79DD=5, 45001=10 — C30361/C30362), **Sold (WO)/Sold (Parts Sale)** (WWF wo=164
  ps=14 — C30363), **negative Turns/Yr** (N64CTH-262 = −0.395 — C30367), **em-dash cells** for nullable
  fields (C30348).
- **Exports:** **CSV export works** (HTTP 200, `text/csv`, ~938 KB); **PDF export FAILS (HTTP 500,
  `application/problem+json`, requestId 7ee19d5f…)** on a medium single-location view while CSV works =
  **SV-8818 STILL REPRODUCES** (ticket **OPEN — status "TESTING QA"**, confirmed live via Jira GET). The
  over-cap "too large to export" guard is built (verified 8/18, unchanged behaviour).
- **Remembered view (C30355/C30356):** the view is stored **browser-side in `localStorage`
  `report_view:parts-velocity`** (version-tagged {dateRange, dateFrom, dateTo, columns…}); NO server-side
  preference endpoint (404). Being per-browser, a different user on the same browser inherits it
  (C30356), and an invalid saved value falls back to the setting default (C30355) — mechanism confirmed.
- **Permission gate (C30327):** a non-admin **Technician** quick-login user that carries
  `reportsPageAccess` opens Parts Velocity and its export (positive confirmed live). `reportsPageAccess`
  is the single reports gate (no per-report permission).
- **Dark mode (C30387):** `body--light` / `body--dark` toggle present.

## Writes — all `update_case`, interim `<br>`, normalization-aware re-verify (Rule 50 declared clause)
Executor `/tmp/testrail/{pv_exec.py, pv_batch.py}` (cloned from the proven SBR sweep executor;
BUILD/DATE = `v3.8-d0e135e` / `8/19/2026`; oplog `pv-sweep-oplog.jsonl`). Guards: **REFUSE** any case
with `created_by != 3` (foreign, Rule 38) or `custom_atmstatus == 3` (Automated, Rule 71). Each write
sends all three text fields in `<br>` form + `refs`; marker **kept** (READY→READY, EXPECT-FAIL→
EXPECT-FAIL, HOLD→HOLD); Rule-54 sentence 2 re-stamped to the current build.

| sub-batch | cases | result |
|---|---|---|
| canary | C30341 | HTTP 200, verify OK |
| A | C30327–C30342 (10) | 10/10 OK |
| B | C30344–C30361 (10) | 10/10 OK |
| C | C30362–C30386 (10, incl HOLD C30372) | 10/10 OK |
| D | C30387–C43547 (5, incl EXPECT-FAIL C38885/C43547) | 5/5 OK |

**Total: 36 written, every one HTTP 200 + normalization-aware re-verify PASS** (content words intact in
order; `<br>` breaks present; NO `<ol>/<li>`; marker + provenance present exactly once). 0 halts.

## Post-write census (all 36)
- **0 anomalies.** Exactly **1 automation marker + 1 provenance line + 1 build stamp** per case; every
  stamp = `v3.8-d0e135e` / 8/19/2026; **0 `<ol>/<li>`**; no unexpected markup (only the block's
  `<p>`/`<br>`); `custom_atmstatus = 1`; `created_by = 3`.
- **Marker split (kept):** 33 `READY` · 1 `HOLD` (C30372) · 2 `READY - EXPECT FAIL (SV-8818)`
  (C38885, C43547).
- **`<br>` present = accepted interim** (not a defect); the only flaggable states (raw `<ol>/<li>`,
  content corruption, missing/dup marker/provenance) = **0**.

## Held / foreign proof
- **13 Automated (atm=3) HELD — 0 writes** (Rule 71): C30322, C30326, C30328, C30333, C30338, C30346,
  C30351, C30352, C30353, C30354, C30375, C30377, C30390 — re-GET confirms 0 touched this pass (all
  still atm=3). See `PV-SWEEP-HELD-AUTOMATED.md`.
- **3 foreign untouched** (Rule 38): C38920, C43567, C43568 (updated 267–476 h ago — not this pass).

## Safety / integrity
- **Run 359 UNTOUCHED** — HTTP 200, `include_all` still **False**, 6 passed / 502 untested / **508
  tests** (unchanged). 0 run writes, 0 result writes (only `update_case`).
- **0 Jira writes** — one GET on SV-8818 (status "TESTING QA", Open) for ticket-status traceability only.
- **No role/staff/settings edited, nothing seeded** — all live observation was read-only against
  existing data via admin quick-login. `switch-user` was attempted once (HTTP 400) and abandoned; no
  Technician role-swap was performed, so **Tech's role is untouched** (nothing to restore). The only
  session-level action was `change-location` to Heavy Duty 9919 on a transient quick-login session
  (per-session, not a persistent user change). Location left on Heavy Duty 9919.
- **Cookies never committed** (secret-scanned every diff). **Per-op log:** `pv-sweep-oplog.jsonl`.
