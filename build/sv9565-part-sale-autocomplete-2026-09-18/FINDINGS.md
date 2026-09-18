# SV-9565 — a part sale stays Approved after all parts are received, so it cannot be invoiced

**Status: testing in progress.** Nothing here is inferred; every line was observed live.

## What the ticket says

The customer (Justin Sawatzky, Norfolk Truck Repair Ltd, 11 users, via Intercom) wrote:
*"parts sale p-10465 will not let me invoice"*. The description states it plainly: after all of the
parts on a part sale have been received, the status should move to **Complete** on its own; instead it
stayed **Approved** and invoicing was blocked. A second symptom on the same order was extra **$0.00
lines on the Finance page**.

Chris Ward's first read was "ghost parts". Slavcho corrected that in the thread: the extra Finance
rows *are* the stranded part requests, priced at zero because nothing is left to receive — **one
cause, both symptoms** — and they must be marked received, not deleted. Four part sales were repaired
on production (P-10465, P-10907, P-10002, P-43) and the ticket was left open for the code fix.

**The fix (PR #2902, targets `main`):** both receive paths marked a part request `received` only when
**one delivery's quantity was exactly equal to the purchase order line's outstanding balance**. Any
divergence — *a line ordered for more than was requested, an earlier partial receipt already covering
the request, or the vendor shipping extra* — left the request in `waiting_to_receive` with nothing
left to receive, which pinned the part sale to Approved. The status is now settled from the
**server-side total received for the request, summed across the order's non-core lines**.

**Deliberately out of scope (the developer's own scope note):** a request split across **two purchase
orders** is still only measured within one order, so it stays `waiting_to_receive` until the covering
order is received or it is closed with "Receive as order fulfilled".

**The developer's QA asks:** (1) receive a part sale end to end and confirm it auto-completes and can
be invoiced; (2) the over-ordered case — order a line for more than requested, receive across two
deliveries, and check only one inventory pick row is recorded.

## Environments

| | URL | Build | Read |
|---|---|---|---|
| Fix branch | `sv9565.qa.shopview.com` | **v26.36.8-2b8d9aa** | `index.html` last-modified Thu 17 Sep 2026 13:29:08 GMT, etag `e19209f9…` |
| Production | `app.shopview.com` | **v26.36.8-961aeb2** | signed in with credentials, not cookies |

Workplace on the branch: **Staging Heavy Duty - 9919**. The developer asked for the **QB Location**
workplace because "a local receive returns a 500 on staging-copy data with empty QuickBooks keys" —
**that workplace does not exist on this branch** (the org has exactly two: Staging Heavy Duty - 9919
and Staging Lethbridge - 4310, confirmed from both `/api/staff/my-workplaces` and `/api/workplaces`).
The cheapest decisive check was simply to try it: **every receive on Staging Heavy Duty returned
`POST /api/orders/receive-requested-parts` 200**, so the 500 the developer was guarding against does
not occur here and the QB-Location precondition is not needed on this build.

Customer used throughout: **Mayfield Heights Truck Centre**; vendor **5 Star Truck Repair**; every
part number and description is prefixed `ZZ9565` / `ZZAUTOTEST`.

## Results so far

### §1 — the reported case, end to end (PASS)

Part sale **P-248** (`76fca2ef…`): one vendor-sourced part `ZZ9565-A1`, quantity 1, cost $10, sell $25.

1. Added the part through **Add Part** → status **Quoted**.
2. Authorised the line → the part sale moved to **Approved**, the part to **Awaiting**, and a purchase
   order was created.
3. Opened the purchase order, clicked **Receive**, entered quantity **1** and a vendor invoice number,
   clicked **Receive** → `POST /api/orders/receive-requested-parts` **200**.
4. **The part sale moved to Complete on its own** and the request settled to `received`.
5. Finance tab → **Create Invoice** → `POST /api/invoices/create` **201**, invoice
   **INV-P9565-248**, part sale status **Invoiced**.

**No spurious $0.00 lines**: the Finance tab shows Parts $25.00 · Subtotal $25.00 · GST $1.25 ·
Total $26.25, one part row only.

Evidence: `ev/A1_receive_*.png`, `ev/A2_ps_complete.png`, `ev/A3_finance.png`, `ev/A4_invoice_*.png`.

### §2a — two deliveries on one request (PASS)

Part sale **P-250** (`5777a893…`), `ZZ9565-C1` quantity 2.

* Received **1 of 2** → the row split into a **Received** row (qty 1) and an **Awaiting** row (qty 1);
  the part sale correctly stayed **Approved**, order status **Partial Delivery**.
* Received the remaining **1** → both rows `received`, **part sale Complete**.

Evidence: `ev/C1_partial1_*.png`, `ev/C2_partial2_*.png`.

### §2b — two requests settled by one delivery, received from the Purchase Orders list (PASS)

Part sale **P-251** (`5d497cf1…`), two separate requests for `ZZ9565-D1`, quantity 1 each. Ordering
both put **two order items on one purchase order** (they do not merge into a single line).

Received through the **other** entry point — Parts → Purchase Orders → tick the order → **Receive** —
in a single delivery covering both items. **Both requests settled to `received` and the part sale
moved to Complete.**

Evidence: `ev/D1_bulk_*.png`.

### §3 — the over-ordered shape: not producible through any screen on this build

The developer's second ask needs a purchase-order line **ordered for more than the request**. Every
route the product offers was tried, and none produces it:

| Attempted route | Result |
|---|---|
| The **Order** button on a part request | Orders immediately, no quantity prompt — the line always equals the request |
| The **purchase order** screen (`/order/{id}`) | Quantity is read-only; the only edit control is `icon_edit_part_number`, which edits the part *number* |
| The **receive** screen | **Validates**: entering 3 against an order of 1 shows *"Quantity received cannot be higher than 1"* in red and the Receive button will not submit — so a vendor over-ship cannot be entered either |
| **Reducing the request quantity after ordering** (3 → 1 via the inline row field) | `POST /api/work-orders/part/change-request` — **the purchase order line follows it down to 1**, so they stay in step |
| **Two requests for the same part** | Two separate order items, no merged line |

Evidence: `ev/B1_overship_2_filled.png` (the validation message), `ev/PO_pencil.png`, `ev/F_editqty2.png`.

**This is reported, not worked around.** It is stated in the QA comment as what it is: the two
divergence shapes named in the root cause (over-ordered, vendor over-ship) have no user-facing path on
this build, so they were exercised at the level the fix changed rather than through a screen — see the
backend-level check below, which is disclosed as such.

## Still to do

* The split-across-two-orders case (the developer's documented out-of-scope behaviour) — the control
  exists: Parts tab → select the rows → **Split parts order**.
* The inventory pick rows after two deliveries.
* The backend-level over-quantity check, clearly disclosed.
* Production before/after, annotated exhibits, QA comment.

**Production note already established:** the plain end-to-end path **also auto-completes on
production** (part sale **P-70**, `49a1cb6d…`, received in full → Complete). So the plain path is not
the failing shape and cannot serve as a "before"; the before/after has to be built on a divergence
shape, if one can be produced there.
