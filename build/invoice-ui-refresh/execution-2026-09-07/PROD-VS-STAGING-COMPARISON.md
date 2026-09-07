# Production vs Staging — invoice/estimate document comparison
**Date:** 2026-09-07 · **Lane:** test-execution-and-defects · **Status:** LEADS ONLY, nothing filed.

> **DATA CLASSIFICATION.** The QA lead confirmed on 2026-09-07 that **all data in both
> environments, production included, is dummy test data — nothing is real**. The full text and
> geometry extracts are therefore committed under `evidence/`. Absent that confirmation they would
> have been withheld, because this repository is **PUBLIC** (Rule 82 / core §10). Customer/shop
> names stay redacted in the table below only because they add nothing to a structural comparison.

## What was compared
Two documents the QA lead supplied as PDFs, both **Estimates** (not paid Invoices):

| | Production | Staging |
|---|---|---|
| Document | `EST-S2-864` | `EST-S2-32136` |
| Shop | *(redacted — UAE shop)* | Staging Heavy Duty - 9919 (Calgary, AB) |
| Customer | *(redacted — real production customer)* | 4 Star Truck Repair *(staging test data)* |
| Pages | 2 | 2 |

**⚠️ These are DIFFERENT work orders at DIFFERENT shops in different tax jurisdictions.** So this is a
**structural** comparison (which blocks/fields exist), never a value comparison. Anything below is a
**LEAD to reproduce live**, not a finding.

**⚠️ AND THESE PDFs ARE NOT EVIDENCE FOR A TICKET.** They carry no build marker and were not captured
by this pass. Per the refusal post-mortem of the same date, "actual" must be observed on the running
environment. Every lead below is re-observed live on staging before it can become a candidate.

## ✅ VERIFIED FIXED — the type-scale defect (SV-9694) is gone from this document

Measured with PyMuPDF on the staging PDF, converted at the spec's own S12-R5a rate (1px = 0.75pt):

| Element | Measured | = px | Spec px | Verdict |
|---|---|---|---|---|
| job title | 12.00pt | 16.0 | 16 | MATCH |
| SCOPE OF WORK | 7.50pt | 10.0 | 10 | MATCH |
| LABOR / PARTS | 7.88pt | 10.5 | 10.5 | MATCH |
| doc-dates | 8.62pt | 11.5 | 11.5 | MATCH |
| shop-meta | 9.38pt | 12.5 | 12.5 | MATCH |
| body | 10.50pt | 14.0 | 14 | MATCH |
| line total | 11.25pt | 15.0 | 15 | MATCH |
| line number / shop-name | 13.50pt | 18.0 | 18 | MATCH |

Pre-fix figures on SV-9694 were title 9pt (12px), SCOPE 5.6pt (7.5px), LABOR 5.9pt (7.9px).
**All eight now match. SV-9694 (Story Defect on SV-9151, Ready for QA) looks verifiable as fixed.**
**Consequence: no type-size finding may be filed as new — it is SV-9694 (A4).**

## ✅ CORRECTED READING — no work-line ordering defect

Read in PDF content-stream order, staging page 2 appeared to place the financial summary *before*
work line 03. **Sorted by true visual position (y,x) it does not:** line 03 sits at y=63-176, the
`SUMMARY` heading at y=220, the totals column at y=248-366 (x=280) running beside the disclaimer
(x=60). **Order is correct. Recorded because the false reading is the exact shape of a bad ticket.**

## LEADS — present in Production, not seen in Staging (each to be reproduced live)

| # | Lead | Production shows | Staging shows | Why it is NOT yet a finding |
|---|---|---|---|---|
| L1 | **"Remit payment to" block** | Full block: shop name, address, phone | Absent | Precedence rules exist and **SV-9689** ("Spec gap - Remit Payment To precedence when integrated billing...") is Done. Absence may be correct for this shop's billing configuration. Needs the CURRENT spec rule + the shop's billing setup. |
| L2 | **Shop-supplies percentage in the label** | `Shop supplies (10.5% of labor)` | `Shop supplies` (no %) | There is a location setting "Show % on Estimates and Invoices" (case C44942), which PROJECT-STATE records as **not located in the tester UI**. Setting-dependent -> could be by design (A5). Must establish the setting's state before calling it. |
| L3 | **Due date** | `Due date: <date>` in masthead **and** a Due date order-reference field | Neither; only `Estimate date: <date>` + `Terms Net 7` | Spec S1 defines the masthead date labels per document type. A Due date may legitimately not belong on an **Estimate**. Needs the current S1 rule. |
| L4 | **Service Order number field** | `Service Order  <number>` | No service-order/WO number field | Staging shows the estimate number `EST-S2-32136` in the masthead. May be a deliberate consolidation by the refresh. Needs the current S3 (Order Reference Fields) rule. |

## Differences that look like the refresh working AS INTENDED (not leads)

- **Empty Authorizer.** Production prints an `Authorizer` label with **no value**; staging prints
  `Authorizer  <name>`. The epic states the Authorizer is *"optional, empty by default, locked once
  invoiced; **empty never prints**"* - so production's empty label is the old behaviour and staging is
  the corrected one.
- Staging adds `PLATE`, `VIN / SERIAL`, `MILEAGE`, `ENG HRS` under a structured `ASSET` block, and the
  `WORK SUMMARY` / `SCOPE OF WORK` / `ESTIMATED TOTAL` headings - all consistent with the refresh.
- Tax label differs purely because the shops are in different tax jurisdictions.

## Blocking question before any of L1-L4 can become a candidate
All 120 suite cases cite **specification version 45**. Chris Ward recorded **"Live page v49"** on
SV-9694 (2026-09-04) and referenced **S12-R4 v52**. Under gate check **A2** an expectation must be
quoted from the CURRENT version. **Source currency must be settled first (Rule 81 - offered, never
auto-run).**

---

# RESOLUTION — 2026-09-07, after the QA lead's rulings and the live spec pull

The spec was pulled live (Confluence 755990532, `lastModified` **Sep 05, 2026**; 104 lines changed since
the 2026-09-03 snapshot). **All four leads resolve as NOT defects.**

| # | Lead | Outcome | Authority |
|---|---|---|---|
| **L1** | Remit Payment To absent on staging | **NOT A DEFECT — intended removal** | **S2-R2**: *"When neither is configured, the block is not shown **(net-new: production previously fell back to printing the shop's own address as the remit-to)**. A location whose own remit-to setting points at that same location is not a configured payee: that is the dropped self-address case."* Production's block printed the shop's OWN address — exactly the dropped fallback. Consequence rule **S2-R3 also PASSES**: Bill To measures x0=60.0 -> x1=535.3 (475.3pt) = full content width. |
| **L2** | Shop-supplies % missing | **FIXED — environment configuration** | QA lead corrected the environment 2026-09-07 and supplied a revised PDF. Verified: `Shop supplies (10.5% of labor)` now present (p2, y=294.4). |
| **L3** | No Due date on the Estimate | **CORRECT** | QA lead confirmed 2026-09-07: due date does not appear for an Estimate. His screenshot shows the Invoice view carrying `Invoice date` **and** `Due date: Sep 14, 2026`. |
| **L4** | Service Order / Work Order field absent | **NOT A DEFECT — spec-correct** | **S3-N1**: the field hides when the work order's trailing digits equal the document's. Live API: work order **`S-32136`** (`GET /api/work-orders/view/{id}` -> `data.work_order.number`), document **`EST-S2-32136`** -> trailing runs **"32136"** = **"32136"** -> hidden, correctly. Also **S3-R1** renames the field "Service Order" -> "Work Order". |

**Net: zero admissible defect candidates from the production-vs-staging comparison.** Recorded rather
than filed, so the non-filing can never look like a miss.

## DESIGN-DOCUMENT CHECK — 2026-09-07 (QA lead's instruction)

Ran against the supplied design export (`invrfrsh.zip` -> `Design invoice refresh_files/saved_resource.html`).
**Neither L1 nor L4 is a defect against the design — the design MODELS both hide states in its own CSS:**

```css
.wrap.wo-match .chip-wo, .wrap.no-po .chip-po, .wrap.no-auth .chip-auth, ... { display:none }
.wrap.no-remit .addr-row{ max-width:none; }   /* Remit To -> Bill To spans the full width */
```

- **L4:** `wo-match` is exactly S3-N1's condition. The design agrees the Work Order chip hides when the
  work order's trailing digits match the document's; the mock merely renders the default (non-matching)
  state, showing `Work Order S3-4176` on a document suffixed `-S3-4176`.
- **L1:** the design's Remit Payment To shows a **third-party integrated-billing payee** ("Northgate
  Fleet Billing Inc, c/o Interstate Billing Service"), i.e. the *configured-payee* case S2-R2 requires to
  show. It is NOT the shop's own address. Staging has no payee configured, so the block hides, and the
  design's `no-remit` rule then requires Bill To at full width - which staging measurably does (475.3pt).

**Authority split applied (live spec, verbatim):** *"Where the prototype and this spec disagree on content
or wording, this spec is the source of truth; on appearance, the Design Document is the source of truth."*
Visibility is content, so the spec governs both of these; and in fact the design does not disagree.
