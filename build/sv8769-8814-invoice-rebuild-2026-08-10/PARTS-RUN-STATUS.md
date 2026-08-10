# The parts run — what happened, and why I stopped before claiming a verdict

## The short version

The parts scenario **did not separate production from staging**, because the API call I used to
change the part **returned HTTP 500 in both environments**. The invoice failed to update in both —
but a trigger that errors proves nothing about whether the rebuild is fixed. I am not going to
present that as a pass or a fail.

The **labor-only** run earlier today *did* separate them cleanly, and that result stands.

## What I found, which changes how this ticket should be tested

**A received part cannot be edited at all.** The developer's own suggested trigger — *"Change a
part's quantity or sell price"* — is refused outright once the part is received:

```
POST /api/work-orders/part/change-request
→ 400  {"error":"Part requests can't be modified once received."}
```

That is a clean, deliberate guard, and both work orders you prepared have **received** parts.

**The other endpoint bypasses that guard and breaks.** `POST /api/work-orders/parts/change` *did*
change the quantity (2 → 4) but returned **500**, and the invoice never rebuilt. Same on staging.
So the quantity moved on the work order while the invoice stayed still — which looks exactly like
SV-8814, but is at least partly just the 500.

**On a parts work order, the labor trigger breaks too.** `POST /api/work-orders/lines/change` —
which worked perfectly on the labor-only work order — returns **500 and does not apply** on the
invoiced work order that has a received part. Retried with a full payload; same result.

## Measurements (all live, both environments)

### Production — S2-834, build `v3.6-b8002fc`

| | Labor | Parts | Supplies | Subtotal | Tax | Total |
|---|---|---|---|---|---|---|
| **Before** — invoice and work order agree | $236.00 | $44.00 (qty 2) | $23.60 | $303.60 | $45.54 | **$349.14** |
| After part qty 2→4 — **work order** | $236.00 | **$88.00** | $23.60 | **$347.60** | $45.54 | $393.14 |
| After part qty 2→4 — **the invoice** | $236.00 | **$44.00 (qty 2)** | $23.60 | **$303.60** | $45.54 | **$349.14** — unchanged |

### Staging — S1-38, build `v3.6-5e6bd35`

| | Labor | Parts | Subtotal | Tax | Total |
|---|---|---|---|---|---|
| **Before** — invoice and work order agree | $236.00 | $149.80 (qty 2) | $385.80 | $57.87 | **$443.67** |
| After part qty 2→4 — **work order** | $236.00 | **$299.60** | **$535.60** | $57.87 | $593.47 |
| After part qty 2→4 — **the invoice** | $236.00 | **$149.80 (qty 2)** | **$385.80** | $57.87 | **$443.67** — unchanged |

**Both environments behaved identically.** That is the whole problem with this trigger: it cannot
tell a fixed build from an unfixed one.

## What would settle it

A trigger that the product actually permits on an invoiced work order carrying a received part. The
two I have tried both 500. Options, in the order I would try them:

1. **A part that is ordered but NOT yet received** — the guard above only blocks received parts, and
   the developer's note about quantity/sell price being editable was almost certainly about that
   state.
2. **Receiving a part** on an invoiced work order — the developer lists this as the commercially
   significant trigger (*"invoicing while parts are still arriving is routine"*).
3. Confirming with the developer which call his own verification used, since he measured this path
   directly against the database.

## Also worth knowing

**The `Escape` key silently rolls back invoice creation.** Clicking **Create Invoice** creates the
invoice and opens a payment dialog; dismissing that dialog with `Escape` — or with the close button
in the same page session — leaves the work order **not invoiced** and the invoice absent from
`GET /api/invoices/list`. Clicking, then navigating away and closing the dialog in a *separate* page
load, persists it. This cost several cycles and is now understood.

**No stray invoices were left.** Every create call was checked against
`GET /api/invoices/list?work_order_id=…`; production S-834 and staging S-38 each hold **exactly one**
invoice, both `pending`. Earlier calls that returned 201 without persisting left nothing behind.

## Status

- Production and staging both have a seeded, invoiced, **unpaid** parts work order ready to re-test
  the moment a valid trigger is agreed.
- The staging session expired mid-run (HTTP 409), so staging needs fresh cookies.
- The labor-only result from earlier today is unaffected and stands on its own evidence.

---

## ⛔ THE ACTUAL BLOCKER ON A PARTS WORK ORDER (isolated with a control, production)

The QA lead pointed out — correctly — that this ticket only needs a work order that **contains**
labor and parts; editing the part was never a requirement. I had over-complicated it. Re-run
properly on **his own untouched work order S-754**, firing only the labor edit and touching nothing
else, the result is:

| Test | Work order | `POST /api/work-orders/lines/change` |
|---|---|---|
| Labor edit, 120 → 180 min | S-754 (**labor + parts**) | **500** |
| Same call, no-op (identical values sent back) | S-754 (**labor + parts**) | **500** |
| Description-only change | S-754 (**labor + parts**) | **500** |
| **Control** — same call, same session, minutes apart | S2-833 (**labor only**) | **201** ✅ |

**On production, ANY line edit on an invoiced work order that carries a part returns 500 — including
an edit that changes nothing.** The identical call succeeds on a labor-only invoiced work order.

**What this means for the ticket:** on a parts work order the rebuild listener never gets the chance
to run, because the request dies first. So the parts scenario cannot demonstrate SV-8814 either way
on production — not because the invoice fails to update, but because **the trigger itself cannot be
fired**.

This 500 is not something SV-8814 claims to fix, and it is not in the combined test plan. It may be
a separate defect worth its own ticket — **not raised**, pending the QA lead's call.

**The labor-only run remains the clean, valid demonstration** and is unaffected by any of this.
