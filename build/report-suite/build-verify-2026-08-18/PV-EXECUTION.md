# PV-EXECUTION — Parts Velocity live build-verification (2026-08-18)

**Build under test:** `v3.8-bd246fd` (app.staging.shopview.com / api.staging.shopview.com),
last-modified 2026-08-18 19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc`. **Byte-stable across
pass start (20:44:03Z) and pass end (21:13:13Z)** — nothing redeployed under the pass. This is the same
build the SBR pass verified (bd246fd, a same-minor bug-fix rebuild of the SBC-start v3.8-2bf8d14 —
Rule 60). Every PV verdict and provenance stamp records `v3.8-bd246fd`, the build actually observed.

**Scope:** 72 Parts Velocity cases (`created_by = 3`, ours). Plus **3 foreign cases** in the PV
sections (Vladimir Tomovic, id 1), all `custom_atmstatus = 3` — HANDS-OFF (Rule 38), not touched, not
counted: **C43567** (Filter-panel search keyboard focus), **C38920** (Location column scope-governed),
**C43568** (Manual Parts return → Units Returned).

**Ours / live-in-PV-sections / foreign = 72 / 75 / 3.** All 72 ours present live; 0 missing.

**Automated (custom_atmstatus = 3) — 8 cases HELD, NO WRITE (Rule 71, per task instruction):**
C30326, C30328, C30333, C30338, C30346, C30352, C30353, C30390 — verified live, recorded in
`PV-HELD-AUTOMATED.md`, not edited/re-stamped. `custom_atmstatus = 3` confirmed LIVE per case.

The **Parts Velocity report is fully built on v3.8-bd246fd** — nav entry (Reports → new **PARTS**
group, beside Inventory Value), date range (defaults **This Year**, auto-fetches), filters (Type,
Category, Vendor, Bin, Location, toolbar search), the inventory/special-order row model, all 20 picker
columns, the calc columns (Revenue/Margin/Margin %/Avg Cost/Avg Sell/Units Sold/Demand/Last Sale/Turns
/On Hand), sorting headers, info tooltips, the **CSV export** (works) and the API. **The PDF export
FAILS (HTTP 500/502) at every size** — see PV-FINDINGS §F5 (SV-8818, ticket OPEN). The **calc contract
(FORMULAS-SV-8582.md / Margin %) verifies exactly per-row** on live data (PV-FINDINGS §Calc).

## Writes — all `update_case`, all three text fields sent, re-GET byte-compared field-by-field (Rule 50)

**26 cases written**, every one HTTP 200 + byte-verified MATCH (custom_preconds + custom_steps +
custom_expected all compared; unchanged fields proven byte-identical); 0 mismatches, 0 collateral
changes, `custom_atmstatus = 1` on every one. Executor `/tmp/pv/writer.py` (dry-run read before send —
core §2.4). Provenance **sentence-1 read-dates unchanged** (sources not re-read this build-verify pass);
**sentence-2 build-check set/refreshed** to `Last checked against build v3.8-bd246fd on 8/18/2026.`

### Batch 1 — DEFERRED (`Not available on Build to test Yet`) → `AUTOMATION: READY` (9 cases)
Feature verified PRESENT on v3.8-bd246fd; marker lifted; sentence-2 added; body byte-identical.

| C-id | internal | feature verified present | HTTP | byte_ok |
|---|---|---|---|---|
| C30351 | PV-COL-01 | column picker lists exactly the 20 columns (Location scope-governed, not in picker); no cost column | 200 | ✅ |
| C30368 | PV-CALC-10 | Revenue/Margin/Avg Cost/Avg Sell/Margin % columns present; Margin % ties out live | 200 | ✅ |
| C30369 | PV-CALC-11 | billed-line columns present (reversal-netting is a seedable data scenario) | 200 | ✅ |
| C30370 | PV-CALC-12 | Avg Cost/Avg Sell/Margin % null-trigger columns present | 200 | ✅ |
| C30371 | PV-CALC-13 | per-column number formats present | 200 | ✅ |
| C30373 | PV-CALC-15 | movement vs billed columns present (111/250 rows differ live = PV-CALC-15 confirmed) | 200 | ✅ |
| C30374 | PV-CALC-16 | window-anchor columns present | 200 | ✅ |
| C30381 | PV-EXP-07 | exports present; CSV null/metadata verified (PDF-side blocked by SV-8818 — §F5) | 200 | ✅ |
| C43834 | PV-EXP-13 | CSV carries the PDF header lines (Date Range / Type / Locations) — verified live | 200 | ✅ |

### Batch 2a — EXPECT-FAIL (closed ticket) → `AUTOMATION: READY` (6 cases; symptom/3-outcome block stripped)
Rule 61 §15.1: an expect-fail marker needs a LIVE backing ticket; each ticket below is **OBSOLETE/Done**
so the marker has no live backing → stripped. Numbered expectations kept verbatim; sentence-2 refreshed;
adjudication of each vs the live build in PV-FINDINGS §F.

| C-id | internal | ticket | ticket status | live verdict | HTTP | byte_ok |
|---|---|---|---|---|---|---|
| C30380 | PV-EXP-06 | SV-8935 | OBSOLETE/Done | **FIXED** — CSV Last Sale is a plain integer (66), not "N days" | 200 | ✅ |
| C30337 | PV-FILT-10 | SV-8939 | OBSOLETE/Done | **STILL REPRODUCES** — Location filter defaults to "All locations", not the active location (§F1) | 200 | ✅ |
| C30347 | PV-ROW-07 | SV-8940 | OBSOLETE/Done | **STILL REPRODUCES** — on-screen Desc/Category/Vendor not truncated, no ellipsis, no tooltip (§F2) | 200 | ✅ |
| C30384 | PV-EXP-10 | SV-8936 | OBSOLETE/Done | **STILL REPRODUCES** — CSV/PDF success toast is generic "Data exported successfully." (§F3) | 200 | ✅ |
| C38914 | PV-FILT-14 | SV-8938 | OBSOLETE/Done | **STILL REPRODUCES (but position is a contested open PO question)** — Location column 6th, not leftmost (§F4) | 200 | ✅ |
| C30379 | PV-EXP-05 | SV-8934 | OBSOLETE/Done | **CANNOT VERIFY** — PDF export 500s (SV-8818), so PDF truncation is unobservable (§F5) | 200 | ✅ |

### Batch 2b + 3 — plain-`READY` build-check re-stamps (11 cases driven live this pass)
Body byte-identical; marker stays `AUTOMATION: READY`; sentence-2 build-check added. Only cases whose
specific assertion was directly observed live this pass:

C30322 (PV-NAV-01, PV under Parts nav) · C30323 (PV-NAV-02, defaults This Year + auto-fetch) ·
C30324 (PV-NAV-03, loading indicator / rows replaced on return) · C30325 (PV-PERM-01, ordinary reports
access loads + exports) · C30343 (PV-ROW-03, ranked Demand-descending) · C30376 (PV-EXP-02, exports
respect filters) · C30377 (PV-EXP-03, exports = enabled columns only) · C30378 (PV-EXP-04, default
Demand-descending exported) · C30388 (PV-API-01, paginated one page at a time) · C30389 (PV-API-02, each
filter change → fresh server call) · C30391 (PV-API-04, report data returned, not refused).
All HTTP 200 + byte_ok ✅, atm=1.

### LEFT UNCHANGED — EXPECT-FAIL kept (2 cases, SV-8818 still OPEN)
| C-id | internal | ticket | why unchanged |
|---|---|---|---|
| C38885 | PV-EXP-11 | SV-8818 (TESTING QA, open) | over-cap export refusal + PDF-fails; the PDF export DOES fail live (§F5) and the ticket is live-backed. Over-cap seeded-thousands state not needed — the too-large refusal message is already verified. Marker left EXPECT-FAIL(SV-8818). |
| C43547 | PV-EXP-12 | SV-8818 (TESTING QA, open) | medium-view PDF-fails-while-CSV-works reproduces live (§F5); ticket open + live-backed. Marker unchanged. |

### LEFT UNCHANGED — HOLD kept (1 case)
| C-id | internal | why unchanged |
|---|---|---|
| C30372 | PV-CALC-14 | Core exclusion cannot be exercised: **no part in this org carries the core flag** (is_core=1 count = 0 across the parts page), so there is no core part to search for. Case is genuinely not runnable without heavy seeding (a core part + invoiced activity + a vendor-sourced core). HOLD reason confirmed accurate; seedable on a later pass. |

## Summary
- **26 cases written**, every one HTTP 200 + re-GET byte-verified (all three text fields sent);
  0 mismatches, 0 collateral changes, atm=1 on all. Breakdown: 9 deferred→READY · 6 expect-fail→READY
  (strip) · 11 plain-READY build-check re-stamps.
- **Post-batch census (all 72 live):** exactly 1 automation marker, 1 provenance line, 0 raw markup per
  case — **0 anomalies**. Marker split: READY 66 · EXPECT-FAIL 3 · HOLD 1 · Not-available 2 (the last two
  are the held Automated deferred cases C30346/C30353).
  **Gate: READY + EXPECT-FAIL = 69 = 72 − 1 HOLD − 2 not-available.** Passes both ways.
- **8 Automated cases HELD** — verified live, byte-unchanged (updated_on identical to pre-pass), recorded
  in PV-HELD-AUTOMATED.md.
- **Run 359 untouched** — only `update_case` called; no run/result writes; include_all still False;
  508 tests / 6 passed / 502 untested unchanged. **0 Jira writes** (GET only, for ticket status).
- **Build marker byte-stable** v3.8-bd246fd across pass start (20:44Z) and end (21:13Z).
