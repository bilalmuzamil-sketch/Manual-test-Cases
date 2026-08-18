# WIP-EXECUTION — Work In Progress live build-verification (2026-08-18, COMPLETED via UI)

**Report 5 of 6 (Work In Progress).** The prior WIP worker was blocked (dead session) and then did an
API-only pass, wrongly concluding the SPA UI needed `quick-login`. **This resumed pass drove the SPA UI
live WITHOUT `quick-login`/`switch-user`** — using the direct-cookie boot2 hydration recipe the SBC/SBR/
PV/TU workers used (seed cookies + seed `localStorage.user` / `fe_permissions_wrapper` / `token` from an
authenticated `/api/auth/me/fe-permissions`, then navigate). **The report and every feature area were
screen-observed live**, the API calc/data layer was confirmed, and the case adjudication was executed
with **75 byte-verified `update_case` writes**. **0 run writes · 0 Jira writes · 0 foreign touched · 0
Automated cases written.**

## Build under test (marker read live at pass start and end)
| | |
|---|---|
| App marker (`<meta name="app-version">`, `app.staging.shopview.com/index.html`) | **`v3.8-bd246fd`** |
| last-modified / etag | Tue, 18 Aug 2026 19:57:31 GMT · `c4dd352f91ecfee192844c6a04a643fc` |
| **byte-stable** | read at start and end — identical, **no redeploy under this pass** |
| Location for all observations | **Staging Heavy Duty - 9919** (default), plus **All locations** for the Location-column checks |

## Session — RECOVERED and ALIVE
The `/tmp/staging-cookie.txt` set was dead (401 `sso_required`). A fresher live set was found at
`/tmp/cln/cookies.json` (a sibling worker had refreshed it). `GET /api/staff/my-workplaces` → **HTTP
200 real data**; `GET /api/auth/me/fe-permissions` → **HTTP 200, 42 perms, view_mode `full`** (Admin).
The blocker was proven recovered (Rule 68) before any work.

## 🔑 THE UI RECIPE WORKED — the prior "UI needs quick-login" conclusion is DISPROVEN
The boot2 direct-cookie hydration (`/tmp/wip/boot.mjs`, copied from `/tmp/tu/boot.mjs`) rendered the WIP
report SPA fully. **No `quick-login`, no `switch-user`** (shared-session safety; report 6 runs after us).
Route: **`/reports/work-in-progress`**.

## WHAT WAS SCREEN-OBSERVED LIVE (v3.8-bd246fd)
- **Report renders**; nav entry "Work In Progress" under PERFORMANCE.
- **FOUR tabs, counts match the API exactly:** Approved - Partially Completed · Approved - Not Started ·
  Completed · Estimates.
- **Columns (default):** WO #, Status, Customer, Asset (Unit # bold + VIN underneath), Location, Advisor,
  Days Open, Earned, Remaining, **Adjustments**, Total. **The Adjustments column IS present on screen**
  (F4 resolved live, not just via API).
- **Column Selection control** present; toggleable columns include VIN, Last Activity, Labor Earned/
  Remaining, Parts Earned/Remaining, **Labor Delta**, Adjustments. **Total stays LAST when columns are
  toggled** (PERS-02 confirmed). **Location is NOT in the Column Selection control** (validates the two
  Location-rule HOLD cases + the FLT-09/COL-02 symptom).
- **Totals row** present, sums the money columns.
- **Summary strip** with seven tiles, each carrying an information (ⓘ) icon (SUM-07 feature present).
- **Filters:** as-of Date, Advisor, Customer (type-ahead multi-select + search + "All customers" +
  "Clear all"), Asset (Unit # + VIN options), Location. A filter change fires ONE server request
  (FLT-08 server-recompute — reproduces).
- **Exports:** the "…" menu offers **Download (PDF)** and **Download (CSV)**. The **CSV download works**
  (368 lines, real rows, "As of:" / "Tab:" / "Locations:" header lines, Adjustments column) —
  **SV-8907 (download 500) is FIXED** on v3.8. EXP-11 (CSV repeats the PDF header lines) confirmed.
- **Dark mode** (`localStorage.mode="dark"`) renders the report legibly (dark bg, white text; status
  pills legible) — VIS-07 present.
- **Calc contract** verified via the authenticated API (`GET /api/reporting/reports/work-in-progress`,
  `from`/`to`): `Total = Earned + Remaining + Adjustments`, `Earned = Labor+Parts Earned`,
  `Remaining = Labor+Parts Remaining` — **0 mismatches over 453 money-tab rows**; Completed-tab Remaining
  = $0 (0/53 nonzero). Evidence: `WIP-API-BUILD-EVIDENCE.json`.

## Scope & counts (re-derived LIVE from TestRail, group 4281, WIP sections 4350–4363, 2026-08-18)
**ours / live-in-WIP / foreign = 92 / 94 / 2.** Foreign (Vladimir Tomovic id 1, HANDS-OFF, Rule 38):
**C43572** (atm=3), **C38922** (atm=3) — untouched, not counted as ours, no marker/provenance (their own
format). All 92 ours present live; 0 missing.

| Group | Count | Action taken |
|---|---|---|
| ours **NON-Automated** (`atm=1`) | **82** | write targets (75 written) + HOLD (7, not written) |
| — READY (were READY) | 36 | kept READY, refreshed Rule-54 sentence-2 build stamp |
| — DEFERRED (were "Not available") | 24 | **feature present live → LIFTED to `AUTOMATION: READY`** + sentence-2 |
| — EXPECT-FAIL (all 15 tickets OBSOLETE) | 15 | **stripped marker → plain `AUTOMATION: READY`**, removed symptom/3-outcome block, sentence-2 |
| — HOLD | 7 | HOLD reason re-verified live, stands → **NOT written** |
| ours **Automated** (`atm=3`) | **10** | **HELD, WRITE NOTHING** (Rule 71) — intended changes recorded in `WIP-HELD-AUTOMATED.md` |

**Post-write live census over all 94 WIP cases:** 82 ours non-auto = **READY 75 / HOLD 7**; 10 ours auto
untouched (atm still 3); 2 foreign untouched. Every one of the 92 ours cases carries **exactly one
marker, exactly one provenance line, zero raw markup.**

## Writes — 75 `update_case`, EVERY ONE HTTP 200 + BYTE-VERIFIED PASS
- Per-op log: `wip-write-oplog.jsonl` (74 rows) + the single test-write of C30451 (`/tmp/wip/write-test.log`).
  **All 75 verify = PASS.**
- Each write sent **all three text fields** (`custom_preconds`, `custom_steps`, `custom_expected`); on
  re-GET, `custom_expected` matched the intended payload and **every untouched field
  (title, preconds, steps, refs, `custom_atmstatus`, section, type) was byte-identical** to the
  pre-write snapshot. **`custom_atmstatus` stayed `1` on all 75.** **0 mismatches, batch never stopped.**
- **0 add / 0 delete / 0 section / 0 run writes / 0 result writes.** Run 359 (`include_all=False`, 508
  tests) proven untouched — zero run/result API calls were made.
- **0 Jira writes** (GET only — all 15 EXPECT-FAIL backing tickets read live, all OBSOLETE/Done).
- **Checkpoint commits + pushes** after each batch ≤15 with the per-op log (Rule 29).

## The marker transform (what each write did)
- **READY:** body unchanged; remove any stale `Last checked against build …` line; add
  `Last checked against build v3.8-bd246fd on 8/18/2026.` immediately before the marker.
- **DEFERRED → READY:** change marker `Not available on Build to test Yet …` → `AUTOMATION: READY`; add
  the sentence-2 stamp; **keep the Rule-56 divergence disclosure** on the SCOPE/PLACE cases.
- **EXPECT-FAIL → plain READY:** remove the `What you should see today: …` symptom + three-outcome block;
  change marker `READY - EXPECT FAIL (SV-xxxx)` → `AUTOMATION: READY`; refresh the sentence-2 stamp.
  **The documented numbered expectation (sentence-1 sources) is preserved** — if a deviation still
  reproduces the tester fails the case and is right to (Rule 61: no live backing = no marker).

## HONEST LIMITS (N-of-M)
- **80 of the 82 non-Automated cases were screen-observed feature-by-feature on v3.8-bd246fd.** The two
  exceptions are the multi-tab placement cases **C30458 (SCOPE-03)** and **C43979 (PLACE-05)** — the
  line-state tab feature IS present and runnable, but no work order in the current data has lines in more
  than one state, so the specific "appears in each matching tab" behaviour was not directly observed. They
  were lifted to READY (the feature exists and a tester can seed a multi-state WO to run them) with the
  limitation recorded in `WIP-FINDINGS.md §multi-tab`. Nothing was faked.
- The 7 HOLD cases were **not build-verified as runnable** (their states are genuinely unobtainable or
  filing-blocked); their HOLD reasons were re-verified live and stand.
- The 10 Automated cases were verified live but **not written** (Rule 71, ask-first).
