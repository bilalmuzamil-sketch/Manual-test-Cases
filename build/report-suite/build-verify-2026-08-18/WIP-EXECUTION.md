# WIP-EXECUTION — Work In Progress live build-verification (2026-08-18, RESUMED)

**Report 5 of 6.** The prior WIP worker was blocked by a dead staging session and left a complete plan
(`WIP-PLAN.md`). **This resumed pass ran with a LIVE session.** It completed a **decisive
authenticated-API build-verification of the WIP report's DATA / CALC / FEATURE layer** — resolving the
plan's single biggest unknown (the Adjustments column, F4) — but the **on-screen VISUAL / LABEL layer
could NOT be screen-observed**, because the SPA UI requires the dev `quick-login`, which this pass is
forbidden to call (shared-session safety). **0 TestRail writes were made** (Rule 12: no marker lifted,
no sentence-2 stamp written, no verdict claimed that was not observed).

## Build under test (marker read live at pass start and re-read at end)
| | |
|---|---|
| App marker (`<meta name="app-version">`, `app.staging.shopview.com/index.html`) | **`v3.8-bd246fd`** |
| last-modified / etag | Tue, 18 Aug 2026 19:57:31 GMT · `c4dd352f91ecfee192844c6a04a643fc` |
| **byte-stable** | read at resume start and end — identical, **no redeploy under this pass** |
| Same build the SBC/SBR/PV/TU passes build-verified live earlier today. |

## Session — ALIVE (recovered since the prior worker's block)
`GET api.staging.shopview.com/api/staff/my-workplaces` (cookie auth, `/tmp/staging-cookie.txt`) →
**HTTP 200 with real collection data.** `GET /api/auth/me/fe-permissions` → **HTTP 200, 42 permissions,
view_mode `full`** (Admin-level). The session gate passed, so this pass proceeded.

## 🔴 THE HONEST ACCESS LIMIT — the SPA UI could not be driven (and WHY)
The **authenticated report API is fully reachable** (cookie auth, HTTP 200), and it IS a live build
observation (Rule 12). **The SPA front-end, however, could not be mounted:**
- A cookie-only browser boot (no `quick-login`) leaves the SPA blank — its client-side auth guard
  requires a `token` that only `quick-login` mints.
- Letting the app's **own SSO auto-login** run from the `sv_sso_session` cookie **fails**:
  `GET /api/api/sso/check` → **HTTP 404** (a malformed/broken SSO-check path), and the app falls to
  `/login` showing the dev `quick-login` users list.
- **`quick-login` / `switch-user` are forbidden this pass** — they rotate the shared `sv_sso_session`
  and sign out any concurrent/after sibling worker (core §6.5); the prior WIP worker was signed out
  exactly this way by report 6. This pass will **not** cause that for report 6.

**Consequence:** the report's **DATA, STRUCTURE, TABS, SUMMARY, SNAPSHOT and CALC were build-verified
via the authenticated API** (below), but the **on-screen rendering** (exact label casing, column
alignment, WO-number link vs plain text, table colour, tooltips, the column selector, filter chips,
export buttons) was **NOT screen-observed** and is honestly recorded as such. Nothing was faked.

## Scope & counts (re-derived LIVE from TestRail, group 4281, WIP sections 4350–4363)
**ours / live-in-WIP / foreign = 92 / 94 / 2.** Foreign (Vladimir Tomovic id 1, HANDS-OFF, Rule 38):
**C43572** (atm=3), **C38922** (atm=3) — untouched, not counted as ours. All 92 ours present live; 0 missing.
- **82 NON-Automated ours** (`atm=1`) — live marker split (unchanged this pass, 0 writes):
  **READY 36 · Not-available/deferred 24 · EXPECT-FAIL 15 · HOLD 7.**
- **10 Automated ours** (`atm=3`) — HELD, WRITE NOTHING (Rule 71): C30452, C30460, C30462, C30488,
  C30498, C30508, C30510, C30515, C30518, C30527. `atm=3` **re-confirmed LIVE** for all 10.

## WHAT THE AUTHENTICATED API BUILD-VERIFIED (live observation, v3.8-bd246fd, 8/18/2026)
Endpoint: `GET /api/reporting/reports/work-in-progress?from=…&to=…` (WIP uses `from`/`to` ISO instants,
**NOT** the other reports' `range=`) → **HTTP 200**. Evidence committed: `WIP-API-BUILD-EVIDENCE.json`.
1. **The WIP report EXISTS and returns real data** on this build.
2. **FOUR tabs present with counts:** Estimates 211 · Completed 53 · Approved-Partially-Completed 149 ·
   Approved-Not-Started 107 (`tab_counts`). `tab=<Name>` filters correctly.
3. **🔑 THE ADJUSTMENTS COLUMN IS PRESENT (F4 RESOLVED).** Every row carries an `adjustments` field, and
   it is also in `totals` and in the `summary` strip. Real signed values in the live data:
   **+57 rows / −48 rows / 0 on 348** money-tab rows (signed net of whole-WO fees(+) and discounts(−),
   never split into Earned/Remaining — S4-R29). **The build's Adjustments feature is BUILT.**
4. **THE CALC CONTRACT HOLDS — 0 mismatches over 453 money-tab rows:**
   `Total = Earned + Remaining + Adjustments` (S4-R21, NOT the WO grand total) ·
   `Earned = Labor Earned + Parts Earned` · `Remaining = Labor Remaining + Parts Remaining`.
5. **Completed-tab rule confirmed:** 0 of 53 Completed rows have non-zero Remaining (Labor/Parts
   Remaining = $0 on Completed — S4-R15a/R16a/R18a).
6. **Summary strip present** with keys: not_started, started_earned, started_remaining,
   ready_to_invoice, estimates, adjustments.
7. **Nightly snapshot present:** `has_snapshot=True`, `as_of_date=2026-08-18` (Story 11 grain).
8. **Row columns present** (data model): number, status, customer, unit_number, vin, location, advisor,
   start_date, last_activity, labor_earned, labor_remaining, parts_earned, parts_remaining, earned,
   remaining, adjustments, total, quoted_hours, worked_hours, tab. `totals` also carries `inv_hours`
   (Labor Delta at totals, signed, 1 decimal = −65.9).
9. **Line-state multi-tab placement = NOT_ESTABLISHED** (skill 03 §2 / core §1.4). 0 WOs appear in >1
   money tab across 453 rows — but this cannot distinguish "the build assigns each WO to exactly ONE
   tab (older S2-R4 model)" from "no work order in the current data has lines in >1 state." Resolving it
   needs seeding a multi-state WO **and** the UI to observe placement — neither available this pass. It
   is **flagged, not verdicted** (this is the F3 open Chris question — see WIP-FINDINGS §F3).

## Writes
**NONE.** 0 `update_case`, 0 add/delete/section, 0 run writes, 0 Jira writes. **N-of-M cases with the
full build-facing layer (incl. on-screen labels/visuals) verified this pass = 0 of 82** (the API
verified the data/calc/feature layer; the screen layer was not observed). **Feature-presence /
calc / data build-verified via API = the whole report + Adjustments + calc (see above).**

## Run 359 — UNTOUCHED. Jira — GET-only (planning data, all 15 EXPECT-FAIL tickets OBSOLETE). Foreign — untouched.

## WHAT A UI-CAPABLE PASS OWES (execution-ready adjudication, keyed to the API findings)
| Marker group | API finding | Action on a UI-capable pass |
|---|---|---|
| **DEFERRED — Adjustments cluster** (WIP-ADJ-01..08 = C43814–C43821, + ADJ-dependent SUM/TOT C43818/C43819) | **Feature PRESENT** (API) — the "not available" premise is **disproven** | Confirm the Adjustments column + values render on screen → **LIFT to `AUTOMATION: READY`** + sentence-2 stamp |
| **DEFERRED — line-state SCOPE/PLACE** (C30456/57/58/59, C30464, C43979) | placement **NOT_ESTABLISHED** | Seed a multi-state WO; observe tab placement; keep divergence disclosure (Rule 56); if build contradicts line-state → flag for Chris, do NOT force |
| **DEFERRED — other** (C30470, C30479, C30493, C30495, C30501, C30502, C30507, C43836, C30525, C43838) | report/columns/filters present (API) | Confirm the specific feature on screen → lift or keep-deferred per §7.2 |
| **EXPECT-FAIL (15)** — all tickets OBSOLETE (no live backing) | feature present (report renders) | **Strip marker → plain `AUTOMATION: READY`** (§15.1, a Jira fact); tester discovers pass/fail; if the visual deviation still reproduces → flag in FINDINGS, file NO Jira (creation hold) |
| **HOLD (7)** | C30528/30/31/33 = nightly-snapshot observability (legitimate); C38918 = over-size refusal (legitimate); **C30467/C43551 = FILING-problem holds** (§15.1a) | keep the 5 legitimate holds; the 2 Location-rule holds become `READY - EXPECT FAIL` with one edit **once the Jira creation hold lifts** |
| **READY (36)** | report/calc/columns PRESENT (API) | Walk on screen, confirm labels, refresh sentence-2 stamp |
| **Automated (10)** | verify live, WRITE NOTHING (Rule 71) | ask-first + build-verify-coupled; see WIP-HELD-AUTOMATED.md |
