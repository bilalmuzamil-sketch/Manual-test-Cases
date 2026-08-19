# TU RE-VERIFY SWEEP — execution (2026-08-19)

> **Interim `<br>` writes EXECUTED.** The TestRail API markdown-wrap block
> (`UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`) is **still active**; the QA lead **ACCEPTED the interim
> `<br>` format** (rendering verified on C30133). All **16 in-scope TU cases** (ours, `atm=1`, not
> already freshly build-verified this cycle) were driven live on the current build and WRITTEN in `<br>`
> form. **Every write stores literal `<br>` line breaks — cleanup debt (demark to plain once the TestRail
> API wrap regression is fixed; logged in `build/OUTSTANDING-ITEMS-REGISTER.md`).**
> **CANONICAL TEMPLATE:** C30133's stored `<br>` form.

**Build under test (read live, HTTP header + in-browser `<meta app-version>`):** **`v3.8-d0e135e`**,
`index.html` last-modified **Wed, 19 Aug 2026 13:27:07 GMT**, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`,
sha256 `6c68f6044e5391b99c99d143fa2fa9d76bbe7a82fa7be85a01a64fac296aa9c4`. Read at 15:56Z (start, HTTP)
and confirmed in-browser during driving (`<meta app-version>` = `v3.8-d0e135e`). Same build the PV sweep
verified (byte-identical sha256/etag). This supersedes the 8/18 TU pass's `v3.8-bd246fd` — a same-minor
bug-fix rebuild (Rule 60: 8/18 verdicts not stale; all verdicts PROVISIONAL on a non-final branch).
Rule-54 sentence 2 on every written READY/HOLD case now reads `Last checked against build v3.8-d0e135e on 8/19/2026.`

## Scope — re-derived LIVE (the 8/18 atm column was STALE)
Live re-read of all 62 cases in the TU folder (section 4285 + children):
- **ours 61 (`created_by=3`) · foreign 1** — Vladimir Tomovic (id 1): **C38919** (atm=3, HANDS-OFF Rule 38; not touched).
- **Live `custom_atmstatus`: 9 Automated (atm=3) among ours** (the 8/18 doc recorded 8) — all HELD, 0 writes
  (Rule 71): C30398, C30399, C30401, C30404, C30410, C30424, C30429, C30449, **C38915** (C38915 was written
  8/18 as EXPECT-FAIL→READY and has since been re-flagged Automated). See `TU-SWEEP-HELD-AUTOMATED.md`.
- **52 ours atm=1:** 36 already carry a fresh `v3.8-bd246fd` stamp from 8/18 (same-minor — left as-is per
  Rule 60, NOT re-written) → **16 were the sweep write scope** (6 old/no-stamp READY + 6 HOLD + 4 deferred).

**Reconciliation: 61 = 36 stamped-atm=1 (left) + 9 atm=3 (held) + 16 this-sweep.** ✓

**Write scope C-ids (16):**
- READY (6): C30405, C30411, C30426, C30439, C30443, C30444
- Deferred / Not-available (4): C30428, C30430, C30432, C30433
- HOLD (6): C30407, C30408, C30413, C30431, C30446, C38887

## What was DRIVEN LIVE on v3.8-d0e135e this run
Boot2 (`/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs`, admin quick-login →
change-location Heavy Duty 9919 → navigate). Supplied cookies were **409 (stale)** for direct API at
pass start; re-established via `quick-login {key:'admin'}` (only staging worker), fresh PHPSESSID captured,
`my-workplaces` → HTTP 200. In-browser marker = `v3.8-d0e135e`.

- **Report renders**, route `/reports/technician-utilization`, PERFORMANCE nav group. Columns:
  Technician, Location, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor. Default
  date range **This Month**. Filter By Technician (All technicians / Clear all + 11 techs) + Location
  (All locations / Clear all + 8 locations) both present.
- **C30405** — **Est. Lost Labor is the LAST column** (pinned far right) and is the **only header carrying
  the `info_outline` icon** (all other headers carry only the sort arrow) → assertion holds.
- **C30411** — default sort is **Technician A→Z** (`sortBy:technician, descending:false` in the saved
  view); sort headers are interactive; **a data reload resets the row order to Technician A→Z** (observed:
  after sorting, reload returned to the default A→Z order).
- **C30426** — Filter By Technician dropdown opens (All technicians / Clear all + 11 named techs); view
  state (including selection) persists in `localStorage report_view:technician-utilization`.
- **C30443** — with all 8 locations in scope the report returns **11 rows = one per technician**; a
  technician who worked at more than one location shows **Location = "Multiple"** (pooled into one row).
  Verified live via the report API (`/api/reporting/reports/technician-utilization`).
- **C30444** — `report_view:technician-utilization` carries a `locationIds` array → the defensive
  saved-location restore mechanism is present.
- **C30439** — **Summary PDF export** (`format=pdf`) returns a valid `%PDF-1.7` file **embedding 1 image
  XObject (DCTDecode / JPEG) = the shop logo**; **CSV export** (`format=csv`, UTF-8 BOM) carries **no image
  bytes** (no PNG/JFIF). PDF-has-logo / CSV-never-logo confirmed. (The "logo removed" sub-state is a
  shared-org branding toggle — the primary assertion is verified; the toggle is a standard tester step.)
- **Calc contract (live, all-locations page):** `Utilization % = WO ÷ Total × 100` and
  `Est. Lost Labor = internal hours × location default labor rate` verify per-row (e.g. Automation Tech
  4.00/3.00/1.00 h → 75.0% util, $125.00 ELL). **0 null/em-dash ELL rows across all 8 locations.**

## Writes — all `update_case`, interim `<br>`, normalization-aware re-verify (Rule 50 declared clause)
Executor `/tmp/testrail/sweep_lib.py`; per-op log `tu-sweep-oplog.jsonl`. Guards **REFUSE** any case with
`created_by != 3` or `custom_atmstatus == 3`. Each write sends all three text fields in `<br>` form + `refs`
(unchanged); marker kept per bucket (READY→READY, deferred→deferred, HOLD→HOLD); Rule-54 sentence 2
re-stamped to `v3.8-d0e135e` / 8/19/2026 on READY + HOLD.

| sub-batch | cases | result |
|---|---|---|
| canary | C30405 | HTTP 200, verify OK (after verifier entity-normalization fix) |
| A | C30411, C30426, C30439, C30443, C30444, C30428, C30430, C30432, C30433 (9) | 9/9 OK |
| B | C30407, C30408, C30413, C30431, C30446, C38887 (6 HOLD) | 6/6 OK |

**Total: 16 written, every one HTTP 200 + normalization-aware re-verify PASS** (content words intact in
order after `html.unescape`; `<br>` breaks present; NO `<ol>/<li>`; exactly one marker + one provenance
line; `atm=1`; `created_by=3`). 0 halts.

**Normalization-aware verify (declared, Rule 50 clause):** the block wraps each field in `<p>…</p>\n` and
escapes `&`/`<`/`>`/`—`→`&mdash;`; these are the documented normalizations and are NOT treated as
mismatches (word comparison runs after `html.unescape`). Only genuine content change or raw `<ol>/<li>`
would stop a sub-batch — none occurred.

## Post-write census (all 16)
- **0 anomalies.** Exactly 1 marker + 1 provenance line per case; `<ol>/<li>` = 0; `atm=1`; `created_by=3`.
- **Marker split (kept):** **READY 6** (C30405, C30411, C30426, C30439, C30443, C30444) · **HOLD 6**
  (C30407, C30408, C30413, C30431, C30446, C38887) · **Not-available 4** (C30428, C30430, C30432, C30433).
- READY/HOLD each carry exactly one `Last checked against build v3.8-d0e135e on 8/19/2026.`; deferred carry
  none (Rule 69 — sentence 2 absent by design), with the marker date updated to 8/19/2026.

## Held / foreign proof
- **9 Automated (atm=3) HELD — 0 writes** (Rule 71): C30398, C30399, C30401, C30404, C30410, C30424,
  C30429, C30449, C38915 — re-GET confirms all still atm=3. See `TU-SWEEP-HELD-AUTOMATED.md`.
- **1 foreign untouched** (Rule 38): C38919.

## Safety / integrity
- **Run 359 UNTOUCHED** — HTTP 200, `include_all` still **False**, 6 passed / 502 untested / 508 tests. 0
  run/result writes (only `update_case`).
- **0 Jira writes.**
- **No role/staff/settings edited, nothing seeded destructively.** Live observation was read-only against
  existing data via admin quick-login + change-location Heavy Duty 9919 (per-session). Tech quick-login role
  untouched (no role-swap performed — see §8.5 gate below). Cookies never committed (secret-scanned).
