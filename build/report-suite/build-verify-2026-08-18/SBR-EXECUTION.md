# SBR-EXECUTION — Sales By Representative live build-verification (2026-08-18)

**Build under test:** `v3.8-bd246fd` (app.staging.shopview.com / api.staging.shopview.com),
last-modified 2026-08-18 19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc`, read at
2026-08-18T20:10:20Z. This is the build the SBC pass saw redeploy at its very end (v3.8-2bf8d14 →
v3.8-bd246fd, a same-minor bug-fix rebuild — Rule 60). Every SBR verdict and provenance stamp records
`v3.8-bd246fd`, the build actually observed this pass. Marker re-read at pass end (see tail).

**Scope:** 118 Sales By Representative cases (`created_by = 3`, ours). Plus **2 foreign cases** in the
SBR sections (Vladimir Tomovic, id 1): **C38923** (atm=3, Location-column CSV) and **C43981** (atm=1,
Invoice Status Clear all) — HANDS-OFF (Rule 38), not touched, not counted in our 118.

**Ours / live-in-SBR-sections / foreign = 118 / 120 / 2.**

**Automated (custom_atmstatus = 3) — 4 cases HELD, NO WRITE (Rule 71, per task instruction):**
C30217, C30221, C30262, C30314 — verified live, recorded in `SBR-HELD-AUTOMATED.md`, not edited.

The Sales By Representative report is **fully built and working on v3.8-bd246fd** — nav entry (under
Performance → Sales, beside Sales By Customer), all filters (date / product type / invoice status /
location), Show Unassigned toggle, the rep/invoice tree, all financial columns, payment-status badges,
sorting headers, the 8-column selector, all four exports (Summary/Expanded × PDF/CSV), and the API.
The org's invoices are all **Unassigned** (no sales rep assigned), so the default view is empty; with
**Show Unassigned** on there are 88 invoices (this month) with real money. The **calc contract from
epic SV-8582 (FORMULAS-SV-8582.md) verifies EXACTLY, per-row and on the group/totals row** against
live data (see FINDINGS §Calc).

## Writes — all `update_case`, all three text fields sent, re-GET byte-compared field-by-field (Rule 50)

### Batch 1 — DEFERRED (`Not available on Build to test Yet`) → `AUTOMATION: READY` (17 cases)
Feature verified PRESENT on v3.8-bd246fd; marker lifted; Rule-54 sentence-2 build-check added
(`Last checked against build v3.8-bd246fd on 8/18/2026.`). Sentence-1 read-dates unchanged (sources
not re-read this pass). Body byte-identical.

| C-id | area | HTTP | byte_ok | atm |
|---|---|---|---|---|
| C30226 | Payment Status Badge | 200 | ✅ | 1 |
| C30234 | Inv. Hrs & Calc (money labels) | 200 | ✅ | 1 |
| C30235 | Inv. Hrs & Calc | 200 | ✅ | 1 |
| C30236 | Inv. Hrs & Calc | 200 | ✅ | 1 |
| C30241 | Sorting | 200 | ✅ | 1 |
| C30265 | Column Selector | 200 | ✅ | 1 |
| C30274 | Persistence | 200 | ✅ | 1 |
| C30291 | Exports (empty result) | 200 | ✅ | 1 |
| C30306 | Mobile | 200 | ✅ | 1 |
| C30309 | Visual Conformance | 200 | ✅ | 1 |
| C38913 | Location Filter | 200 | ✅ | 1 |
| C43828 | Adjustments (Rep Rows) | 200 | ✅ | 1 |
| C43829 | Adjustments (Calc) | 200 | ✅ | 1 |
| C43830 | Adjustments (Subtotal) | 200 | ✅ | 1 |
| C43831 | Adjustments (Column Selector) | 200 | ✅ | 1 |
| C43833 | Exports (status + Locations lines) | 200 | ✅ | 1 |
| C43839 | Visual Conformance | 200 | ✅ | 1 |

_(further batches appended below as executed)_

### Batch 2 — EXPECT-FAIL → `AUTOMATION: READY` (21 cases, 19 plain-text + 2 raw-HTML C30277/C30279)
Symptom + three-outcome block stripped; body's numbered expectations kept verbatim; Rule-54 sentence-2
build-check added; marker → plain `READY`. Ticket backing removed because it is no longer live-backed
(Rule 61 §15.1). Adjudication of each ticket vs the live build is in SBR-FINDINGS.md.

| C-id | ticket | ticket status | live verdict | HTTP | byte_ok |
|---|---|---|---|---|---|
| C30218 | SV-9001 | OBSOLETE/Done | fixed/closed | 200 | ✅ |
| C30225 | SV-8974 | OBSOLETE/Done | closed (not deep-driven) | 200 | ✅ |
| C30229 | SV-8999 | OBSOLETE/Done | **FIXED live** (Labor Delta shows real signed values, not 0.0) | 200 | ✅ |
| C30230 | SV-8999 | OBSOLETE/Done | FIXED live | 200 | ✅ |
| C30231 | SV-8999 | OBSOLETE/Done | FIXED live | 200 | ✅ |
| C38894 | SV-8999 | OBSOLETE/Done | FIXED live | 200 | ✅ |
| C30237 | SV-8977 | OBSOLETE/Done | FIXED (Totals row present, Subtotal rightmost) | 200 | ✅ |
| C30238 | SV-8977 | OBSOLETE/Done | FIXED | 200 | ✅ |
| C30239 | SV-8978 | OBSOLETE/Done | closed (mobile, not deep-driven) | 200 | ✅ |
| C30273 | SV-8976 | OBSOLETE/Done | closed (persistence edge, not driven) | 200 | ✅ |
| C30281 | SV-8982 | OBSOLETE/Done | filename now includes range word (current behaviour) | 200 | ✅ |
| C30285 | SV-8880 | OBSOLETE/Done | FIXED (Summary CSV has all 10 columns) | 200 | ✅ |
| C30286 | SV-8972 | OBSOLETE/Done | FIXED (Expanded CSV column order correct) | 200 | ✅ |
| C30293 | SV-8983 | OBSOLETE/Done | closed (assignments export endpoint not located) | 200 | ✅ |
| C30298 | SV-8973 | OBSOLETE/Done | **STILL REPRODUCES** (empty-state wording) — FLAGGED | 200 | ✅ |
| C30304 | SV-8979 | OBSOLETE/Done | closed (touch-target px, not measured) | 200 | ✅ |
| C30305 | SV-8980 | OBSOLETE/Done | closed (table colour, not measured) | 200 | ✅ |
| C30307 | SV-8975 | OBSOLETE/Done | **STILL REPRODUCES** (aria-labels) — FLAGGED | 200 | ✅ |
| C30287 | SV-8823 | TESTING QA (open) | **FIXED live** (CSV money plain numbers) — FLAGGED for close | 200 | ✅ |
| C30277 | SV-8925 | OBSOLETE/Done | FIXED (CSV plain numbers) + raw-HTML repaired | 200 | ✅ |
| C30279 | SV-8981 | OBSOLETE/Done | A3-paper aspect still reproduces (see FINDINGS) + raw-HTML repaired | 200 | ✅ |

### LEFT UNCHANGED — EXPECT-FAIL kept (2 cases, SV-8818 still OPEN + state not reachable)
| C-id | ticket | why unchanged |
|---|---|---|
| C30290 | SV-8818 (TESTING QA) | over-cap Expanded PDF refusal needs > row-cap rows; only 88 invoices exist — state not reachable this pass; base PDF exports return HTTP 200. Marker left as EXPECT-FAIL(SV-8818). |
| C30320 | SV-8818 (TESTING QA) | API row-cap enforcement needs > cap rows; not reachable at 88 invoices. Marker unchanged. |

**Raw-HTML repairs (3): C30277, C30278, C30279** — converted TestRail-rendered `<ol>/<li>/<hr>/<p>/<a>/<br>`
back to house plain text (formatting only, text word-for-word; demark.py, 0 leftover tags, re-GET confirms
0 raw markup). C30278 is a deferred-lift; C30277/C30279 are expect-fail strips.

### Batch 3 — plain-`READY` build-check re-stamps (12 cases driven live this pass)
Body byte-identical; marker stays `AUTOMATION: READY`; Rule-54 sentence-2 build-check added
(`Last checked against build v3.8-bd246fd on 8/18/2026.`). Only cases whose specific assertion was
directly observed live this pass. All HTTP 200 + byte_ok ✅, atm=1.

C30195 (nav placement) · C30197 (nav label fits) · C30206 (Parts & Service default) ·
C30208 (invoice-status all default) · C30213 (location all default) · C30227 (payment badge Paid/Unpaid) ·
C30233 (calc) · C30267 (column selector = 8 toggleable) · C30276 (exports respect filters) ·
C30288 (export Locations line) · C30316 (API report endpoint 200) · C30319 (API pagination).

## Summary
- **51 cases written**, every one HTTP 200 + re-GET byte-verified (all three text fields sent);
  0 mismatches, 0 collateral changes. Breakdown: 17 deferred→READY · 21 expect-fail→READY
  (19 plain + 2 raw-HTML) · 3 raw-HTML repaired (C30277/C30278/C30279; 0 leftover markup) ·
  12 plain-READY build-check re-stamps.
- **Post-batch census (all 51 touched):** exactly 1 automation marker, 1 provenance line, 0 raw markup,
  sentence-2 = v3.8-bd246fd present, custom_atmstatus = 1 — 0 anomalies.
- **4 Automated cases HELD** (C30217/30221/30262/30314) — byte-unchanged, updated_on identical to
  pre-pass; recorded in SBR-HELD-AUTOMATED.md.
- **2 EXPECT-FAIL left unchanged** (C30290/C30320, SV-8818 open + over-cap state not reachable).
- **Run 359 untouched** (0 run/result writes; include_all still False). **0 Jira writes** (GET only).
- **Build marker byte-stable** v3.8-bd246fd across pass start (20:10Z) and end (20:36Z).
