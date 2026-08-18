# TU-EXECUTION — Technician Utilization live build-verification (2026-08-18)

**Build under test:** `v3.8-bd246fd` (app.staging.shopview.com / api.staging.shopview.com),
last-modified 2026-08-18 19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc`. **Byte-stable across
pass start (21:22:16Z) and pass end (21:51:10Z)** — nothing redeployed under the pass. This is the same
build the SBR and PV passes verified (bd246fd, a same-minor bug-fix rebuild of the SBC-start
v3.8-2bf8d14 — Rule 60). Every TU verdict and provenance stamp records `v3.8-bd246fd`, the build
actually observed. Default location **Staging Heavy Duty - 9919** (admin can reach 7 locations); the
report itself opens on **All locations** (the SV-8943 behaviour — see TU-FINDINGS §F1).

**Scope:** 61 Technician Utilization cases (`created_by = 3`, ours). Plus **1 foreign case** in the TU
sections (Vladimir Tomovic, id 1), `custom_atmstatus = 3` — HANDS-OFF (Rule 38), not touched, not
counted: **C38919** (TU column selector hides Est. Lost Labor, persists across…), section 4348.

**Ours / live-in-TU-sections / foreign = 61 / 62 / 1.** All 61 ours present live; 0 missing.

**Automated (`custom_atmstatus = 3`) — 8 cases HELD, NO WRITE (Rule 71, per task instruction):**
C30398, C30399, C30401, C30404, C30410, C30424, C30429, C30449 — verified live, recorded in
`TU-HELD-AUTOMATED.md`, not edited/re-stamped. `custom_atmstatus = 3` confirmed LIVE per case.

The **Technician Utilization report is fully built on v3.8-bd246fd** — nav entry (Reports →
**PERFORMANCE** group, below the anchor links Sales / Technician Efficiency / Advisor Analysis / Shop
Efficiency), date range (defaults **This Month**), Filter By Technician (multi-select, All technicians /
Clear all), Location filter (rightmost multi-select), the 7 columns (Technician, Location, Total Hours,
WO Hours, Internal Hours, Utilization %, Est. Lost Labor), sort headers (ascending-first toggle),
expand-all (header) + per-row accessible expand, per-day breakdown (fetched on expand), pinned Summary
row, Column Selection (5 toggleable + Technician always-on), the Est. Lost Labor info tooltip, all four
exports (**Summary/Expanded × PDF/CSV — every one works, PDF included**), and the empty-state message.
**The calc contract verifies exactly per-row and in totals** on live data (TU-FINDINGS §Calc).
**ONE feature is NOT in the build: the Total Hours link** (→ Timesheet Activities) — the Total Hours
cell carries no link/button in any location scope tested (TU-FINDINGS §F7); the TU-LINK cluster stays
deferred.

## Writes — all `update_case`, all three text fields sent, re-GET byte-compared field-by-field (Rule 50)

**42 cases written**, every one HTTP 200 + byte-verified MATCH (custom_preconds + custom_steps +
custom_expected all compared; unchanged fields proven byte-identical); 0 mismatches, 0 collateral
changes, `custom_atmstatus = 1` on every one. Executor `/tmp/tu/writer.py` (dry-run census read before
send). Provenance **sentence-1 read-dates unchanged** (sources not re-read this build-verify pass);
**sentence-2 build-check set/refreshed** to `Last checked against build v3.8-bd246fd on 8/18/2026.`
(except the deferred cases, which carry no sentence-2).

### Batch 1 — EXPECT-FAIL (closed/obsolete ticket) → `AUTOMATION: READY` (13 cases; symptom/3-outcome block stripped)
Rule 61 §15.1: an expect-fail marker needs a LIVE backing ticket; each ticket below is **OBSOLETE/Done**
so the marker has no live backing → stripped. Numbered expectations kept verbatim; sentence-2 refreshed;
per-case adjudication vs the live build in TU-FINDINGS §F.

| C-id | internal | ticket | ticket status | live verdict | HTTP | byte_ok |
|---|---|---|---|---|---|---|
| C30394 | TU-NAV-03 | SV-8943 | OBSOLETE/Done | **STILL REPRODUCES** — opens on All locations, multi-location rows (date=This Month correct) (§F1) | 200 | ✅ |
| C30450 | TU-API-02 | SV-8945 | OBSOLETE/Done | **STILL REPRODUCES** — sorting AND tech-filter both trigger a server request (should be client-side) (§F2) | 200 | ✅ |
| C30435 | TU-EXP-02 | SV-8950 | OBSOLETE/Done | **PARTIAL** — Summary row still missing from both PDFs (STILL REPRODUCES); filenames now Title-Case (that half FIXED) (§F3) | 200 | ✅ |
| C30436 | TU-EXP-03 | SV-8951 | OBSOLETE/Done | **STILL REPRODUCES** — two CSV files, the Expanded one holds per-day rows, neither has the Summary row; comma-quoting passes (§F4) | 200 | ✅ |
| C30437 | TU-EXP-04 | SV-8948 | OBSOLETE/Done | **FIXED** — export now respects the technician filter (deselected Admin absent from subset CSV) (§F5) | 200 | ✅ |
| C30438 | TU-EXP-05 | SV-8949 | OBSOLETE/Done | **FIXED** — downloads ordered Technician A→Z (§F6) | 200 | ✅ |
| C30440 | TU-EXP-07 | SV-8948 | OBSOLETE/Done | **DIFFERENT — new deviation** — no file (old bug fixed) BUT an "Empty export / Export didn't yield any results" error toast shows, not the spec's silent no-op (§F5) | 200 | ✅ |
| C30441 | TU-EXP-08 | SV-8952 | OBSOLETE/Done | **STILL REPRODUCES** — success toast is "Data exported successfully.", not "Download started"; failure toast is "Empty export…", not "Failed to download report" (§F8) | 200 | ✅ |
| C43552 | TU-EXP-10 | SV-8951 | OBSOLETE/Done | **STILL REPRODUCES** — the Expanded spreadsheet holds per-day rows (§F4) | 200 | ✅ |
| C38915 | TU-LOC-06 | SV-8954 | OBSOLETE/Done | **STILL REPRODUCES** — Location column drawn 2nd (after Technician), not leftmost, and never offered in Column Selection (§F9) | 200 | ✅ |
| C30425 | TU-TECH-03 | SV-8947 | OBSOLETE/Done | **STILL REPRODUCES** — select-all control labelled "All technicians", not "Select all"; behaviour passes (§F10) | 200 | ✅ |
| C30418 | TU-DAY-01 | SV-8953 | OBSOLETE/Done | **STILL REPRODUCES** — accessible name works ("Expand X's daily breakdown"), keyboard toggle works, but `aria-expanded` state is not reported (§F11) | 200 | ✅ |
| C30421 | TU-DAY-04 | SV-8953 | OBSOLETE/Done | **STILL REPRODUCES** — expand-all in header, toggles all rows, name flips Expand↔Collapse all technicians, but `aria-expanded` not reported (§F11) | 200 | ✅ |

### Batch 2 — special (6 cases)
| C-id | internal | mode | action | HTTP | byte_ok |
|---|---|---|---|---|---|
| C43835 | TU-EXP-11 | deferred → `AUTOMATION: READY` | feature PRESENT — the CSV carries the PDF header's Date-Range, Locations and (on a subset) `"Technicians:"` filter lines; sentence-2 added (§F12) | 200 | ✅ |
| C38887 | TU-EXP-09 | EXPECT-FAIL(SV-8818) → `AUTOMATION: HOLD` | over-cap refusal needs thousands of rows (unseedable); **TU PDF export works at every tested size**, so the SV-8818 PDF-fail symptom does NOT reproduce for TU — symptom block stripped, HOLD reason set, sentence-2 added (§F13) | 200 | ✅ |
| C30430 | TU-LINK-03 | EXPECT-FAIL(SV-8944) → `Not available on Build to test Yet` | the Total Hours link feature is ABSENT (§F7); SV-8944 is OBSOLETE (no live backing) so the stale expect-fail was stripped, and the case's feature is not in the build → deferred marker + under-development line (§F7) | 200 | ✅ |
| C30428 | TU-LINK-01 | deferred — date updated, under-dev line added | Total Hours link absent → keep deferred, `Last checked 8/18/2026`, under-dev line added, logged to DEFERRED-RUN | 200 | ✅ |
| C30432 | TU-LINK-05 | deferred — date updated, under-dev line added | same — link feature absent | 200 | ✅ |
| C30433 | TU-LINK-06 | deferred — date updated, under-dev line added | same — link feature absent | 200 | ✅ |

### Batch 3 + 4 — plain-`READY` build-check re-stamps (23 cases driven live this pass)
Body byte-identical; marker stays `AUTOMATION: READY`; sentence-2 build-check added. Only cases whose
specific assertion was directly observed live this pass:

C30392 (NAV-01, PERFORMANCE group below anchors) · C30393 (NAV-02, one row per clocked tech) ·
C30395 (NAV-04, date-range reloads) · C30396 (NAV-05, loading/rows swap) · C30397 (NAV-06, day-grouped
in one TZ) · C38859 (COL-01, Technician always-on + 5 toggleable) · C30419 (DAY-02, per-day rows in date
order) · C30420 (DAY-03, day rows same columns/formats) · C30422 (DAY-05, expansion resets on reload) ·
C30406 (ELL-03, zero-internal → $0.00) · C30434 (EXP-01, 3-dot leftmost then Column Selection) ·
C30402 (HRS-03, Util% = WO/total) · C30403 (HRS-04, only-internal tech → 0.0%) · C30442 (LOC-01, Location
filter rightmost multi-select) · C30409 (SORT-01, default Technician A→Z ascending) · C30412 (SORT-04,
sort reorders only tech rows, Summary pinned) · C30414 (SUM-01, pinned Summary row) · C30415 (SUM-02,
Summary sums) · C30416 (SUM-03, Summary Util% weighted, not row-average) · C30417 (SUM-04, Summary ELL
sums) · C30423 (TECH-01, filter starts all-selected) · C30447 (VIS-01, all-white table) · C30448
(VIS-02, dark mode legible).
All HTTP 200 + byte_ok ✅, atm=1.

### LEFT UNCHANGED — HOLD kept (5 non-Automated cases; reason re-verified, no write)
| C-id | internal | HOLD reason | reason still valid on v3.8-bd246fd? |
|---|---|---|---|
| C30407 | TU-ELL-04 | no location without a default labor rate | YES — every location in scope carries a $125 default rate (ELL ties out); an em-dash ELL state is not producible without a rate-less location |
| C30408 | TU-ELL-05 | internal hours split across rated & unrated locations | YES — needs a rate-less location, none present |
| C30431 | TU-LINK-04 | needs a technician clocked in at the moment (open clock) | YES — plus the Total Hours link itself is absent (§F7) |
| C30446 | TU-LOC-05 | needs a second sign-in as a one-location user | YES — one shared sign-in; not driven (shared-session safety) |
| C30413 | TU-SORT-05 | no technician with an em-dash Est. Lost Labor | YES — every tech's ELL resolves to a $ value (all locations rated) |

### LEFT UNCHANGED — plain READY not driven this pass (6 cases; keep prior build stamp, honest N-of-M)
C30405 (ELL-02, ELL pinned-right/bold) · C30439 (EXP-06, PDF logo follows uploaded logo) · C30443
(LOC-02, location-change pooling reload) · C30444 (LOC-03, saved-location defensive restore) · C30411
(SORT-03, data reload resets sort) · C30426 (TECH-04, cross-visit deselect persistence). Their specific
assertions were not individually driven this pass (logo state, cross-session persistence, defensive
restore of a bad saved location); they keep their existing `AUTOMATION: READY` and prior build stamp.

## Summary
- **42 cases written**, every one HTTP 200 + re-GET byte-verified (all three text fields sent);
  0 mismatches, 0 collateral changes, atm=1 on all. Breakdown: 13 EXPECT-FAIL→READY (strip) ·
  1 deferred→READY (EXP-11) · 1 EXPECT-FAIL→HOLD (EXP-09) · 1 EXPECT-FAIL→deferred (LINK-03) ·
  3 deferred date-refresh (LINK-01/05/06) · 23 plain-READY build-check re-stamps.
- **Post-batch census (all 61 live):** exactly 1 automation marker, 1 provenance line, 0 raw markup per
  case — **0 anomalies**. Marker split: **READY 49 · HOLD 7 · EXPECT-FAIL 1 · Not-available 4 = 61.**
  The 1 EXPECT-FAIL is the held Automated C30424; the 4 Not-available are C43835→no (lifted) — actually:
  C30430 (LINK-03), C30428 (LINK-01), C30432 (LINK-05), C30433 (LINK-06).
  **Gate: READY + EXPECT-FAIL = 50 = 61 − 7 HOLD − 4 not-available.** Passes both ways.
- **8 Automated cases HELD** — verified live, byte-unchanged (updated_on identical to pre-pass), recorded
  in TU-HELD-AUTOMATED.md.
- **Run 359 untouched** — only `update_case` called; no run/result writes; include_all still False;
  508 tests / 6 passed / 502 untested unchanged. **0 Jira writes** (GET only, for ticket status).
- **Build marker byte-stable** v3.8-bd246fd across pass start (21:22Z) and end (21:51Z).
