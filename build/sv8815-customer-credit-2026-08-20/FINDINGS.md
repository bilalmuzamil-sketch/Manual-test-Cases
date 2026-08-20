# SV-8815 — the CUSTOMER CREDIT path, tested at last

**Ticket** [SV-8815](https://shopview.atlassian.net/browse/SV-8815) — sales-tax rounding method
(line-by-line vs invoice total).
**Why this pass exists** — Sinisa Nogic's ruling of 2026-08-20 on the QA comment, verbatim:

> *"Two different credits, and my sentence in the plan mixed them up: **Vendor credit** — what you
> walked (Parts > Returns > Post credit): workplace purchase tax on the part's cost. This ticket
> doesn't touch it. … **Customer credit** — what I meant: crediting the customer for a part on their
> invoice, pro-rated from the frozen invoice tax. **That one only engages under Invoice total.**"*

So the vendor credit is **correct as built** (question closed, nothing to raise) and the **customer
credit** was an in-scope path that had **never been tested** — the earlier part-return check had no
power to detect a fault in it (both candidate arithmetics gave the same 7.80 on those amounts).

## Environment — and why it is staging, not the branch

The `sv8815` branch **merged into staging and self-destructed** (QA lead, 2026-08-20), so
`sv8815api.qa.shopview.com` no longer resolves. Tested on:

| | |
|---|---|
| app | `https://app.staging.shopview.com` |
| api | `https://api.staging.shopview.com` |
| build | **`v3.8-0cb5771`**, `index.html` last-modified **Thu 20 Aug 2026 08:50:55 GMT**, etag `050d50362804274b4a2306b076129c1c` |
| change present? | **yes** — `salesTaxRoundingMode` is on every workplace record |

## Where the customer credit actually lives (it took finding)

Not `Parts → Returns` (that is the **vendor** credit) and not `parts/create-credit` (also vendor —
its controls are `create_credit_vendor`, `button_post_credit`). The customer credit is:

**Customer → Invoices tab → tick exactly ONE invoice row → `Issue Credit`** →
`IssueCreditMemoDialog` → tick **"Parts are being returned"** → a table of the invoice's parts with
**Qty To Credit** / **Restocking Fee** → `Issue Credit`.

- gated on the customer having a **customer account**; the button is disabled otherwise
- one invoice at a time — *"Credits can only be issued for one invoice at a time."*
- must be on that invoice's location — *"Switch to this invoice's location to issue a credit."*
- tax is computed **server-side**: `POST /api/work-orders/parts/calculate-tax`
  `{items:[{workOrderPartId,quantity}]}` → `{totalTaxAmount, items:[{workOrderPartId,taxAmount}]}`
  (**taxAmount in CENTS**, the UI divides by 100)
- posting the credit: `POST /api/credit-memos`

## The test shape, and why it has power

Heavy Duty's workplace tax is **GST 5%**. Two parts at **$5.10** each:

| | Invoice total | Line by line |
|---|---|---|
| subtotal | 10.20 | 10.20 |
| tax | `round(10.20 × 5%)` = **0.51** | `round(0.255)×2` = **0.52** |

So the shape **first proves the mode is in effect** (0.51 vs 0.52). Then crediting **one** $5.10 part
separates the two candidate implementations:

- **pro-rata from the frozen tax** → `round(0.51 × 5.10/10.20)` = `round(0.255)` = **0.26**
- **recompute the remainder** → `0.51 − round(5.10 × 5%)` = **0.25**

## Results

**Setting the mode — done BY CLICKING the dialog** (`Administration → Locations → Staging Heavy
Duty → Sales tax rounding`). The UI sent the full 22-key payload with
`sales_tax_rounding_mode: "total_rounded"`, the store came back `total_rounded`, the estimate's tax
moved **0.52 → 0.51**, and the choice survived a **hard reload** (`S1.json`, `S1-saved.png`,
`S1-reopen-after-reload.png`).

**Invoice P-1345** — two vendor-sourced, ordered and received parts at $5.10; subtotal 10.20;
**frozen tax 0.51**. Invoice `7e8ff1c6-3f83-4382-984c-fc5e9a23e8ec`.

| what was credited | tax the dialog showed | server response | verdict |
|---|---|---|---|
| **both** parts | **$0.51** — rows $5.36 and $5.35 | `totalTaxAmount 0.51`, items **26** and **25** cents | ✅ splits the frozen tax **exactly**, no orphan cent |
| **one** part ($5.10 of $10.20) | **$0.26** | `totalTaxAmount 0.26`, items **26** and **0** | ✅ **pro-rata from the frozen tax** — a recompute would have shown 0.25 |

Evidence: `S5.json`, `S5a-default-both.png`, `S5b-one-part.png`.

**The invariant Sinisa named holds.** Crediting everything on the invoice credits back **exactly**
the tax that was charged (0.26 + 0.25 = 0.51), which is what *"keeps a credit in step with the
invoice it credits"* means. Under line-by-line the same invoice freezes at 0.52 and splits 0.26 +
0.26 — see the control below.

## Screen vs API — stated plainly

The **feature under test was driven on the screen**: the rounding-mode dropdown was clicked and
saved with the Save button, and the credit was produced by ticking the invoice row, pressing
**Issue Credit**, and editing **Qty To Credit** in the dialog. The figures quoted above are the ones
**rendered to the user**, cross-read against the server's own `calculate-tax` response.

**Setup was scripted** — creating the part sale, adding the two parts, ordering them, stripping the
organisation's default fees/discounts, and creating the invoice. Receiving was driven **on the
screen** (see below). Setup by API is a speed trade-off and does not affect what the screen was
asked to compute.

## Two things found on the way — reported, not filed

1. **`GET /api/part-sales/{invoiceId}/list-credit-available-parts` returns HTTP 500 for a part with
   no catalogue entry**, and the dialog renders that failure as the plausible-but-wrong sentence
   **"No parts on this invoice are available for credit."** Reproduced twice in one dialog open
   (requestIds `91fa4062-e2db-4d74-b653-c14c34c68256`, `3197b27f-c077-493b-b60f-ed6cd4499cf2`;
   also `ec16d0ca-d25d-4d7a-83d7-05b3e37e2d1e` via the API). The parts that triggered it were
   source **"found"** (no `catalogue_part_id`, no `inventory_part_id`). The same endpoint returns
   **200** on the org's ordinary vendor-sourced invoices, so this is an edge case, **not** SV-8815's
   code — but it is reachable from the product's own screen and the message hides the error.
   *Not filed: awaiting the QA lead's go-ahead.*
2. Not a defect — **my own** first attempt: a hand-built `POST /api/orders/receive-requested-parts`
   body 500'd because it was missing ~20 of the ~25 fields per item the screen sends. Driving the
   receive on the screen returned **200** first time. Recorded so nobody re-derives that payload.

## Honest limits

- Only the **customer credit** arithmetic was the target of this pass; the rest of SV-8815's 35
  checks stand from the branch run on `v3.8-1f5fb3c`.
- The parts used are $5.10 vendor parts on a **part-sale** invoice. The dialog also serves
  **work-order** invoices (`invoice-type: workorder`); the tax endpoint is the same
  (`work-orders/parts/calculate-tax`) but a work-order invoice was not driven in this pass.
- Staging is a **shared** environment. Per the QA lead's 2026-08-20 ruling its data is disposable
  and needs no cleanup; throwaway records are tagged **ZZAUTOTEST**.
