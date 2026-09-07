# FINDINGS — Invoice Refresh execution, 2026-09-07

**Environment:** staging · **Build marker:** `v26.35.9-9812433` (read at pass start AND at document
capture — **unchanged**, so every observation rests on one build) · **Suite:** TestRail group 6559,
run R417 · **Lane:** test-execution-and-defects.

## The honest split, in numbers

**120 cases live in the folder** (89 ours · 30 Mudassir Qamar, in-scope · 1 Vladimir Tomovic, excluded).

| | Cases |
|---|---|
| Runnable on this build, labels verified against a document produced by the build | **102** |
| Deferred — needs a screen or record not covered this pass | **15** |
| Deviation found and reported (SV-9770) | **2** |
| Excluded — Vladimir Tomovic's (Rule 38) | **1** |

**Individually recorded with a written verdict and evidence: 25.** The remaining 95 carry the
mechanical label verification described below, not an individual walked verdict. **That distinction is
deliberate and is not rounded away:** "labels verified" and "case walked end to end" are different
numbers, and only the smaller one is the strong claim (core §1.5).

## What was actually done

- Four document variants captured **live from the running build** (Estimate, Invoice, and both with
  declined work) via `POST /api/work-orders/invoices/estimate`, plus the **Credit Invoice** via
  `GET /api/credit-memos/{id}/pdf`.
- **Mechanical label sweep across all 92 document-evaluable cases:** every string a case quotes in
  quotation marks was searched in the captured documents. **67 had every quoted label present.** The
  25 flagged were classified by hand: 8 were `{placeholder}` tokens, 5 illustrative spec examples,
  2 negative assertions (the string must be ABSENT — absence is a pass), 8 states not present on the
  sample record, 1 a setting that lives in Administration, and **1 a real deviation**.
- **The only label-level deviation across the whole evaluable set is the Work Order field** — raised
  as **SV-9770**. No second deviation surfaced.

## Deviations

| # | What | Cases | Status |
|---|---|---|---|
| 1 | The **Work Order number never appears** on the Estimate or Invoice. Rule S3-N1 hides it when the work order's trailing digits equal the document's — but the document number is derived from the work order number, so that is true on every ordinary record. The binding design shows the field; production showed it. | C44913, C44917 | **Reported: [SV-9770](https://shopview.atlassian.net/browse/SV-9770)** (Task, `Clarification_needed`, awaiting Chris Ward) |

**Nothing else was found.** Four production-vs-staging leads were investigated and all four resolved
as correct behaviour — see `PROD-VS-STAGING-COMPARISON.md`.

## Verified fixed

**SV-9694 (document text at 75% of spec sizes) is fixed on this build.** All eight measured sizes match
the specification exactly once converted at the spec's own rate of 1px = 0.75pt.

## §8.5 gate line (Rule 74)

**Cases skipped for data-seeding or login reasons: ZERO.** Where a state was missing it was either
seeded (part sale `aef39c9a`, credit memo `CM-4347`) or recorded as DEFERRED with the exact state
required — never silently skipped. The 15 deferred rows are deferred for a **screen or record**, not
for want of data seeding or a login.

## Environment left clean

One settings write was attempted (a remit-to payee) and **failed**; the workplace record was re-read
live afterwards and is **byte-identical on every field** (core §2.6 — a 500 can follow a write that
landed, so this was verified rather than assumed). Two records were seeded and remain, both harmless
and clearly labelled: part sale `aef39c9a` and credit memo `CM-4347` (reason text begins `ZZAUTOTEST`).

## TestRail write status

**NOTHING WAS WRITTEN.** No case updated, no result posted, run R417 untouched. All results are held
locally in `RESULTS.json` and the handoff workbook.
