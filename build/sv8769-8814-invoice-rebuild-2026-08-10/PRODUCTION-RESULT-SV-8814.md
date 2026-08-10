# SV-8814 on PRODUCTION — **REPRODUCED**

**Build: `v3.6-b8002fc`** (`app.shopview.com`, read from `index.html` at the time of the run).
Environment: org `72b2cc90…` "Bilal-Trucks", workplace **Trucks Hill 2**, customer
**aqeel transport 56**, labor rate **4226 ($118/hr)**, tax **"15 percent"** — all as instructed by
the QA lead. Signed in as Admin. **2026-08-10.**

## Verdict

**The one-edit lag reproduces on production exactly as SV-8814 describes.** One API edit did not
reach the invoice at all; a second edit — which changed nothing — flushed the first one through.

## The work order

**S2-833**, one labor line, no parts. Invoiced and **left unpaid** (every `UpdateTotalWhenWO*`
listener filters on `Status::PENDING`, so a paid invoice rebuilds nothing and the test would be
meaningless).

| | Labor | Shop supplies | Subtotal | Tax (15%) | Total | Balance |
|---|---|---|---|---|---|---|
| **Baseline** (WO screen **and** invoice agree) | $118.00 | $11.80 | **$129.80** | **$19.47** | **$149.27** | $149.27 |

Arithmetic: 118 + 11.80 = 129.80; 15% × 129.80 = 19.47; total 149.27. ✅

## The test

Post-invoice edits are locked in the UI, so the trigger was fired through the API — which is the
whole reason this ticket is API-only:

```
POST /api/work-orders/lines/change
  {line_id, work_order_id, line_name, tech_story, time_estimate, tech_time, labour_type_id}   → 201
```

### Edit #1 — labor 60 → 120 minutes

| Where | Labor | Subtotal | Total |
|---|---|---|---|
| Work order header | **2.0 hrs** | — | — |
| Work order screen | $236.00 | $247.80 | $267.27 |
| **The invoice document** | **$118.00 (qty 1)** | **$129.80** | **$149.27** |

**The invoice did not move.** The work order and its own invoice now disagree — evidence
`PROD-SV-8814_after-first-edit-invoice-did-not-move.png`.

### Edit #2 — a **no-op re-save** of the same 120 minutes

| Where | Labor | Subtotal | Total |
|---|---|---|---|
| **The invoice document** | **$236.00 (qty 2)** | **$247.80** | **$267.27** |

**Only now did edit #1 appear on the invoice** — evidence
`PROD-SV-8814_after-second-edit-first-edit-finally-landed.png`. A second, pointless edit was
required to flush the first. That is precisely the defect.

## Also observed — and it belongs to a DIFFERENT ticket, so it is recorded, not raised

Throughout both edits the invoice's **tax stayed frozen at $19.47** while its subtotal moved to
$247.80. The correct tax on $247.80 at 15% is **$37.17**, so the document reads
`Subtotal $247.80 + Tax $19.47 = Total $267.27` — a **$17.70 under-charge** — and the **Balance is
stranded at $149.27** while the Total says $267.27.

That is **SV-8813**, not SV-8814, and the combined test plan explicitly lists it as known-failing on
this path. It is noted here because it is visible in the same screenshots and a reader will
otherwise ask about it. **No ticket raised for it.**

## Honest limits

- This proves the behaviour on **production**, which is the unfixed side. The staging half — proving
  it is fixed — is the next step and is not claimed here.
- Only the **labor-change** trigger was exercised. The ticket lists other `UpdateTotalWhenWO*`
  triggers (part quantity/price, receiving parts); those were not driven.
- The tax figure of $37.17 is arithmetic on the observed subtotal, not a value the product displayed.

## Reproduction notes worth keeping

**A work order created through the API has no customer CONTACT, and without one the invoice path is
completely blocked** — `POST /api/work-orders/invoices/estimate` and
`GET /api/invoices/{woId}/details` both return **500**, and **Create Invoice sits disabled with no
tooltip**. Every work order not created by us returned 200 on the same call, which is what isolated
it. Setting a contact via the `select_customer_contact` dropdown fixed it immediately.

This is the same trap recorded in `CLAUDE.md` from **SV-8821** — *"the real condition turned out to
be a missing CONTACT"*. It cost time again today because it presents as a dead button rather than an
error. Now recorded in `build/APP-ACTIONS-PLAYBOOK.md` §R.
