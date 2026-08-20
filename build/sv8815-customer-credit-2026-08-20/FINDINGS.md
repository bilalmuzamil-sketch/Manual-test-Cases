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

### The credits were actually POSTED, and they sum exactly

Two separate credit memos were issued against P-1345, one part each, through the dialog:

| credit memo | part | subtotal | tax | total |
|---|---|---|---|---|
| **CM-3574** | ZZAUTOTEST-8815-B | 5.10 | **0.25** | **$5.35** |
| **CM-3575** | ZZAUTOTEST-8815-A | 5.10 | **0.26** | **$5.36** |
| | | 10.20 | **0.51** | **$10.71** |

**That is the invoice, to the cent** — subtotal 10.20, tax 0.51, total 10.71. Read back off the
customer account as two `credit` transactions of −5.35 and −5.36. So a customer credited for
everything on the invoice gets back exactly what they were charged: **no orphan cent, no
over-credit**. That is what *"keeps a credit in step with the invoice it credits"* means, and it is
the property that only becomes non-trivial under Invoice total (where the per-part figures do not
add up to the frozen total on their own).

Posted payload, for the record:
`POST /api/credit-memos` → **201** — `{originKind:"invoice", originInvoiceId:…,
lineItems:[{sellPrice:5.1, restockingFee:0, taxAmount:0.25, originatingInvoiceLineId:…}]}`.

### The control: the same parts under "Line by line"

Invoice **P-1346** — same two $5.10 vendor parts, but frozen while the location was set to
**Line by line**: subtotal 10.20, tax **0.52**, total **10.72**.

| | Invoice total (P-1347) | Line by line (P-1346) |
|---|---|---|
| frozen invoice tax | **0.51** | **0.52** |
| credit, both parts | 0.26 + **0.25** = **0.51** | 0.26 + **0.26** = **0.52** |
| row totals shown | $5.35 and $5.36 | $5.36 and $5.36 |
| credit total | **$10.71** | **$10.72** |
| one part alone | **0.26** | **0.26** |

Annotated pair: `EX-A-invoice-total-annotated.png`, `EX-B-line-by-line-annotated.png` (boxes and
captions drawn on the real `getBoundingClientRect` geometry, captured in the `*-geom.json` files).

**So the credit follows whichever figure the invoice was actually billed at, in both modes.** The
behaviour Sinisa described is the behaviour the build has. **Nothing to raise on this path.**

## Screen vs API — stated plainly

**Driven on the screen** (the feature under test, and the things a user actually does):
the **rounding-mode dropdown** — opened, both options read, one clicked, saved with **Save & Close**,
and re-read after a **hard reload**; **receiving** the ordered parts on the PO screen; and the whole
**credit**: ticking the invoice row, pressing **Issue Credit**, selecting/deselecting parts with the
row checkboxes, typing the Reason, and pressing the dialog's **Issue Credit**. Every figure quoted
above is the one **rendered to the user**, cross-read against the server's own `calculate-tax`
response.

**Scripted** (setup only): creating the part sale, adding the two parts, setting their vendor and
price, ordering them, stripping the organisation's default fees/discounts, and creating the invoice.
None of that is what SV-8815 changed, and none of it decides what the screen computes.

**Parts were sourced from a VENDOR**, per the QA lead's instruction that parts must come from the
list or the vendor dropdown — never "found". That turned out to matter for a second reason: a
"found" part has no catalogue entry, and the credit screen cannot handle one (see below).

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
  and needs no cleanup; throwaway records are tagged **ZZAUTOTEST**. The location's rounding mode
  was nevertheless put back to **Line by line (default)** at the end — one click, and it stops
  another tester meeting unexplained cents.

## Records created (all ZZAUTOTEST, staging, disposable)

customer **ZZAUTOTEST SV-8815 Credit** `b3aa863a-665d-4096-8a14-b6c0bd9d50ee` (account
`48e22c86-963a-46ec-a29f-6fec8c3ba24b`) · part sales **P-1341**, **P-1343**, **P-1345**
(`0ac0762a-e107-4b0f-b483-36ff445b23fa`, invoice `7e8ff1c6…`), **P-1346**
(`010ffc81-e126-48d5-8919-7372cce4e663`, invoice `f353dfa7…`), **P-1347**
(`805ca85a-d2a9-4d72-9f18-dc86d7e36151`, invoice `10047dfa…`) · credit memos **CM-3574**,
**CM-3575** · vendor invoice numbers `ZZ8815-CRED`, `ZZ8815-CTRL`, `ZZ8815-EF`.

## Reusable knowledge worth keeping

- the customer-credit route and its controls (above) — none of it was in the playbook
- `POST /api/work-orders/parts/calculate-tax` returns **taxAmount in CENTS**
- **all rows in the credit dialog start SELECTED** — you *untick* what you don't want to credit;
  ticking a row is a deselect, which is the opposite of what it looks like
- `button_confirm_dialog` is the dialog's submit and stays **disabled until a Reason is typed**
- a **vendor invoice number must be unique** as well as ≤21 chars — reusing one returns
  *"There is already invoice with number: …"* and reads like a receive failure
- **the org auto-applies default fees/discounts to every new part sale** (here +$50.52 net); strip
  them with `POST /api/work-orders/adjustments/remove` or the arithmetic is unrecognisable
- a part sale needs the company to have a **contact**, or `POST /api/part-sales` answers
  *"Customer not found"* — the same trap as SV-8821
- `pgrep -f` matching a pattern that appears **inside a heredoc that writes a script** kills the
  calling shell (exit 144). Playbook §U.0b trap 1 has a **second form**: write the file with a
  file-write tool, and assemble the pattern from pieces.
- `page.mouse.click` uses **viewport** coordinates: the dialog's **Save & Close** sits below the
  fold at y≈1691 in a 1300-tall viewport, so the click landed on nothing and **sent no request at
  all**. Scroll into view, then **re-measure**, then click — and check `inViewport` before
  believing a click happened. This nearly became a false report that "the UI does not save the
  setting" (the same near-miss as lesson 12).
