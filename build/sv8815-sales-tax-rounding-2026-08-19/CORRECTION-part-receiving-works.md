# CORRECTION — receiving a part is NOT broken. I used the wrong screen.

**This file replaces `REPRO-part-receiving-500.md`, which was wrong.** That file gave steps to
reproduce an "HTTP 500 when receiving a part", listed six causes I had ruled out, and offered to file
a ticket. **The premise was false.** The QA lead received a part successfully on **S-15998** and sent
the screenshots. I then reproduced his path and it works first time.

---

## What was actually wrong

There are **two different Receive surfaces**, and only one of them is live.

| | The live one — what the QA lead used | The dead one — what I used |
|---|---|---|
| How you get there | on the work order's **Lines** tab, the part row's blue **Receive** button (`button_part_request_action`) | **Parts → Deliveries**, or straight to `/accept-delivery/{orderId}` |
| What it calls first | `POST /api/inventory/orders/receive-view` `{workOrderId, vendorIds:[…]}` → **200** | — |
| Where it lands | `/order/{poId}?receive=1&returnTo=WorkOrder&returnId=…&returnLineId=…&vendorIds=…` | `/accept-delivery/{orderId}` |
| Fields | `input_invoice_{poId}`, `input_qty_{itemId}` | `invoice-number`, per-line `delivered` |
| Save call | **`POST /api/orders/receive-requested-parts`** → **200**, part → `received` | `POST /api/inventory/orders/accept` → **500** |

The 500 was real, but it came from a screen the product no longer drives a work-order part request
through. **A 500 on a route nothing uses is not a product defect a customer can hit**, and I reported
it as though it were.

**Neither of the two things I thought mattered mattered.** I had guessed from the QA lead's
screenshots that the difference was (a) ticking **Line Approved** on the New Line dialog or
(b) choosing the **vendor inside the New Part Request modal**. I tested both against the
`/accept-delivery` screen and both still returned 500 — because the screen was the variable, not the
data.

---

## The working recipe, verified twice

Proven on **S-15999** (rounding mode *Invoice total*) and again on **S-16001** (*Line by line*):

1. Active location must be the work order's own location (**Staging Heavy Duty - 9919** here).
2. Create the work order, add a line, add a vendor part —
   `POST /api/work-orders/part/make-request` with **`work_order`** and **`line`** as the field names
   (not `work_order_id` / `line_id`), plus `part_source_type:'vendor'` and `vendor_id`.
3. `POST /api/work-orders/part/perform-request-status-action` `{part_request_id, action:'order'}` → 201.
   The part shows **Awaiting** with an **Order** button, then a blue **Receive** button.
4. Click **Receive** on the part row → the receive screen opens for that purchase order.
5. Type the vendor invoice number in `input_invoice_{poId}` and the quantity in `input_qty_{itemId}`.
   *(Keep the invoice number short — a longer one is rejected on a **21-character** limit, which cost
   me time on SV-8781 and is nothing to do with receiving.)*
6. Click **`button_receive_po_{poId}`** → `POST /api/orders/receive-requested-parts` → **200**, part
   status becomes **received**.

Screenshot: `evidence/EXHIBIT-R1-part-received-then-returned.png`.

---

## What this unblocked, and what it found

Receiving was the only thing standing between me and the last untested item, so I ran it:

**Returning a part does not rewrite an issued invoice — in either rounding mode.**

| | Billed under **Invoice total** (S-15999) | Billed under **Line by line** (S-16001) |
|---|---|---|
| invoice before the return | 244.00 / 23.79 / 267.79 | 244.00 / 23.79 / 267.79 |
| returned 1 of 3 parts at $80 | `POST /api/work-orders/part/make-return-request` → 200 | → 200 |
| invoice after the return | **244.00 / 23.79 / 267.79 — unchanged** | **244.00 / 23.79 / 267.79 — unchanged** |
| work-order panel after | Subtotal 164.00 · tax 23.79 · Total 187.79 · Balance 267.79 | **identical, figure for figure** |

Exhibits R2 and R3. That closes AC6 for part returns.

**The return-request call needs two things I got wrong first:** `part_id` is the **part object's** id
from `GET /api/work-orders/lines/{WO}` → `collection[].parts[].id` (matched on `part_request_id`), not
the part-request id; and **`return_reason` is required** (e.g. `Incorrect`). Without them it is a 400
reading `{part_id:"Not found", return_reason:"Missing required parameter"}`.

---

## An observation that is NOT this ticket's problem

On the **invoiced** work order after the return, the **Financial Info** panel shows a subtotal that
dropped by the returned part while the **tax line keeps the invoiced figure**:

> Parts $160.00 · Labor $4.00 · Subtotal **$164.00** · tax **$23.79** · Total **$187.79** ·
> Balance **$267.79**

So the panel's Total ($187.79) is neither the invoiced total ($267.79 — which the **Balance** still
shows correctly) nor a clean recompute ($164.00 + $15.99 = $179.99).

**It is not caused by SV-8815.** The control run on *Line by line* produced the same six figures,
byte for byte (exhibits R4 and R5). Reported as an observation; **no ticket filed** — filing is the QA
lead's call.

---

## And the handoff item itself was a non-item

The handoff asked that a **credit memo** against an "Invoice total" invoice pro-rate its credited tax
from the frozen invoice tax. A **credit memo is not a part return** — it is a customer-account
instrument of its own (`POST /api/credit-memos`, plus void / cash-out / PDF).

I created one to see what it carries: **`customer_account_id` and `amount`, and nothing else.**
Probing with a partial body returns exactly those two as the required parameters, and the created
record is `{creditMemoId, creditNumber:"CM-100", totalAmount:8000, openBalance:8000, status:"open",
refundPaymentId:null}` — **no tax field, no rate, no line items.**

**A credit memo in this build has no tax component, so there is no tax for the rounding setting to
pro-rate.** The handoff item cannot be satisfied because there is nothing there to test — which is a
better answer than "blocked", and it is the answer I should have reached on day one by reading the
endpoint instead of assuming a part return was the way in.
