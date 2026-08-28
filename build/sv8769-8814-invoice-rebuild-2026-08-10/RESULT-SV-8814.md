# SV-8814 — production vs staging. **Reproduced on production, fixed on staging.**

The QA lead's ask: prove the bug is real on **production** (unfixed), then prove it is gone on
**staging** (fixed). Both halves are done, each with a **before and after** screenshot, annotated.

| | Production | Staging |
|---|---|---|
| Build | **`v3.6-b8002fc`** | **`v3.6-5e6bd35`** |
| Work order | **S2-833** | **S1-37** |
| Customer | aqeel transport 56 | Aadale Motors |
| Labor rate | **4226** — $118/hr | **Bilal** — $118/hr |
| Tax | "15 percent" | "Flat 15%" |
| **Verdict** | 🔴 **BUG REPRODUCES** | 🟢 **FIXED** |

## What was done, identically in both places

A work order with one labor line (1 h @ $118), invoiced and **left unpaid** — required, because every
`UpdateTotalWhenWO*` listener filters on `Status::PENDING`, so a paid invoice rebuilds nothing.

Then the trigger, fired through the API because the UI locks every money-moving field once an unpaid
invoice exists — which is exactly why this ticket is API-only:

```
POST /api/work-orders/lines/change   {line_id, work_order_id, line_name, tech_story,
                                      time_estimate: 60 → 120, tech_time, labour_type_id}
```

## Production — the bug

| | Labor | Subtotal | Tax | Total |
|---|---|---|---|---|
| **Before** (invoice as issued) | $118.00 (qty 1) | $129.80 | $19.47 | **$149.27** |
| **After ONE edit** | **$118.00 (qty 1)** | **$129.80** | **$19.47** | **$149.27** — *unchanged* |
| After a SECOND edit (a no-op re-save) | $236.00 (qty 2) | $247.80 | $19.47 | $267.27 |

**The first edit never reached the invoice.** While the invoice still read qty 1 / $118.00, the work
order header already read **Total Hours: 2.0 hrs** — the two documents disagreed. Only a second,
entirely pointless edit flushed the first one through. That is SV-8814.

## Staging — the fix

| | Labor | Subtotal | Tax | Total |
|---|---|---|---|---|
| **Before** (invoice as issued) | $118.00 (qty 1) | $118.00 | $17.70 | **$135.70** |
| **After ONE edit** | **$236.00 (qty 2)** | **$236.00** | **$35.40** | **$271.40** — *updated at once* |
| After a second edit (same no-op) | $236.00 | $236.00 | $35.40 | $271.40 — no further change |

**One edit was enough.** The second edit moved nothing, confirming the first had already fully
applied rather than arriving late.

## SV-8813 rode along in the same evidence

The tax behaviour differs between the two environments in the same screenshots:

- **Production:** subtotal moved to $247.80 while tax stayed frozen at **$19.47**. The correct tax is
  $37.17, so the document read `$247.80 + $19.47 = $267.27` — a **$17.70 under-charge**.
- **Staging:** tax recomputed to **$35.40** (15% of $236.00) in the same single edit.

That is **SV-8813**, a separate ticket also merged to staging, and the combined plan lists it as
known-failing on production. Recorded because it is visible in these screenshots and a reader will
otherwise ask. **No separate ticket raised.**

## Evidence

| File | Shows |
|---|---|
| `PRODUCTION-SV-8814_BEFORE-invoice-as-issued.png` | the issued invoice, $149.27 |
| `PRODUCTION-SV-8814_AFTER-one-edit-invoice-did-NOT-move.png` | WO says 2.0 hrs, invoice still qty 1 / $129.80 |
| `PRODUCTION-SV-8814_AFTER-second-edit-first-edit-finally-landed.png` | the first edit appears only now |
| `STAGING-SV-8814_BEFORE-invoice-as-issued.png` | the issued invoice, $135.70 |
| `STAGING-SV-8814_AFTER-one-edit-invoice-updated-immediately.png` | qty 2 / $236.00 / $35.40 / $271.40 after one edit |

## Honest limits

- **Only the labor-change trigger was exercised.** The ticket also lists part quantity/price changes
  and receiving parts as `UpdateTotalWhenWO*` triggers; those were not driven in either environment.
- **The invoice's Balance line lags in both environments** — it still reads the original figure
  ($149.27 production, $135.70 staging) while Total shows the rebuilt amount, and the
  `/api/invoices/{id}/details` endpoint disagrees with the rendered document on that one field.
  **Recorded as an observation, not claimed as a defect** — it is outside SV-8814's acceptance
  criteria and may be intended (a balance reflects what was billed until re-issued).
- The $37.17 correct-tax figure is arithmetic on the observed subtotal, not something the product
  displayed.
- Staging carries **no shop supplies** on this customer while production charges 10%, so the two
  subtotals differ by design ($118.00 vs $129.80). The *behaviour* being compared — whether one edit
  reaches the invoice — is unaffected.
- Neither environment was declared final; production is the live release and staging is `develop`.
