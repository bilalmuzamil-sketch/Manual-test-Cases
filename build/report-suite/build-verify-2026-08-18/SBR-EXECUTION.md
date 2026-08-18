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
