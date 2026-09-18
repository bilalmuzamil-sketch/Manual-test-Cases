# SV-9565 — a part sale stays Approved after all parts are received, so it cannot be invoiced

**Status: DONE — QA PASSED. 10 checks, all pass.** Nothing here is inferred; every line was observed
live.

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
orders** is still only measured within one order.

**The developer's QA asks:** (1) receive a part sale end to end and confirm it auto-completes and can
be invoiced; (2) the over-ordered case — order a line for more than requested, receive across two
deliveries, and check only one inventory pick row is recorded.

## Environments

| | URL | Build | Read |
|---|---|---|---|
| Fix branch | `sv9565.qa.shopview.com` | **v26.36.8-2b8d9aa** | `index.html` last-modified Thu 17 Sep 2026 13:29:08 GMT, etag `e19209f9…`; `app-version` read from the page itself |
| Production | `app.shopview.com` | **v26.36.8-961aeb2** | signed in with credentials, not cookies |

Workplace on the branch: **Staging Heavy Duty - 9919**. The developer asked for the **QB Location**
workplace because "a local receive returns a 500 on staging-copy data with empty QuickBooks keys" —
**that workplace does not exist on this branch**. The org has exactly two (Staging Heavy Duty - 9919,
Staging Lethbridge - 4310), confirmed from both `/api/staff/my-workplaces` and `/api/workplaces`. The
cheapest decisive check was to try it: **every receive on Staging Heavy Duty returned
`POST /api/orders/receive-requested-parts` 200**, so the 500 he was guarding against does not occur
here and the QB-Location precondition is not needed on this build.

Customer used throughout: **Mayfield Heights Truck Centre**; vendor **5 Star Truck Repair**; every
part number and description prefixed `ZZ9565` / `ZZAUTOTEST`.

## Results

| # | Check | Result |
|---|---|---|
| 1 | Part sale **P9565-248**: one part, received in full → **moves to Complete by itself** | PASS |
| 2 | **Create Invoice** on it → `POST /api/invoices/create` 201, **INV-P9565-248**, status Invoiced | PASS |
| 3 | Finance page shows Parts $25.00 / GST $1.25 / Total $26.25 — **no zero-priced extra lines** | PASS |
| 4 | **P9565-250**, quantity 2 received as **1 then 1**: first delivery splits the row into Received 1 + Awaiting 1 and the sale correctly stays Approved; second delivery settles both and the sale goes **Complete** | PASS |
| 5 | **P9565-251**, two separate requests for the same part, received in **one delivery from the Purchase Orders list** (the other entry point) → both settle, sale **Complete** | PASS |
| 6 | Invoice after two deliveries: **INV-P9565-250**, Parts **$80.00 = 2 × $40.00** — two real lines, **no duplicate charge** | PASS |
| 7 | **Split parts order**: the parts moved to a new sale **P9565-255** while the purchase order still carried the old number; receiving it completed **P9565-255**, and the emptied **P9565-254** correctly fell back to Estimate | PASS |
| 8 | **Work orders still receive correctly** — S9565-13556, three items of 6, one received 2 then 4: the two full items settled at once, the partial one split and settled on the second delivery | PASS |
| 9 | Over-receipt **cannot be keyed into the receive screen**: 3 against an order of 1 shows *"Quantity received cannot be higher than 1"* and the Receive button will not submit | Reported, not a defect |
| 10 | **Back-end over-receipt** (disclosed below): 5 received where 1 remained → both request rows settle to `received` and the sale goes **Complete** | PASS |

### Check 10 — deliberate fault injection, disclosed

**What was induced:** a receive of quantity 5 where only 1 was outstanding.
**How:** the receive screen refuses it (check 9), so the request was sent straight to
`POST /api/orders/receive-requested-parts`, reusing the exact payload the screen produces, with
`quantity_received` changed from 1 to 5. HTTP 200.
**Why:** that endpoint is the code this fix changes, and "the vendor shipping extra" is one of the
three divergences named in the root cause. There is no screen that produces it, so it was exercised
where the fix lives.
**Relevance:** under the old behaviour this is precisely the shape that stranded a request. It now
settles: both rows `received`, part sale **Complete**.
*(Side effect worth knowing, not a ticket: the over-received row shows quantity 5 and a negative
remaining. Only reachable by bypassing the screen's own validation, so it is recorded here and told
to the QA lead rather than put on the ticket.)*

## The over-ordered shape has no user-facing path on this build

The developer's second ask needs a purchase-order line **ordered for more than the request**. Every
route the product offers was tried:

| Attempted route | Result |
|---|---|
| The **Order** button on a part request | Orders immediately, no quantity prompt — the line always equals the request |
| The **purchase order** screen | Quantity is read-only; the only edit control is `icon_edit_part_number`, which edits the part *number* |
| The **receive** screen | Validates against over-receipt (check 9) |
| **Reducing the request quantity after ordering** (3 → 1 inline) | `POST /api/work-orders/part/change-request` — **the purchase-order line follows it down to 1** |
| **Two requests for the same part** | Two separate order items; they do not merge into one line |

So the "order more than requested, receive across two deliveries" run could not be staged as written.
The **two-deliveries half** was covered on its own (checks 4 and 8), and the **one-pick-row half** is
evidenced by check 6: two deliveries produced two real lines totalling exactly 2 × $40.00, with no
duplicated charge.

**The split-across-two-purchase-orders exclusion was not exercised either** — "Split parts order"
splits the *part sale*, not the purchase order, and no screen puts one request on two orders. Stated
as unexercised rather than claimed as confirmed.

## Before and after

The plain end-to-end path **also auto-completes on production** (part sale **P-70**, `49a1cb6d…`,
created, ordered and received in full → Complete). That is consistent with the root cause — the plain
path, where the delivery equals the outstanding balance, was never the failing shape — so **the
pre-fix behaviour could not be reproduced on production**, and no "before" could be captured there.

The before therefore comes from **the reporter's own screenshots inside the ticket**, labelled as
such: the customer's screen showing P-10465 **Approved with all four parts Received**, and the
customer's estimate showing the **zero-priced duplicate lines**. `ev/EX1_before_after.png` and
`ev/EX3_zero_lines.png` state on the image that the two halves are different orders — a comparison of
the symptom, not of one record.

## Exhibits

* `ev/EX1_before_after.png` — the customer's blocked order vs the same shape completing on the branch
* `ev/EX2_end_to_end.png` — receive → Complete → Create Invoice
* `ev/EX3_zero_lines.png` — the zero-priced duplicate lines, then a clean invoice
* `ev/EX4_two_deliveries.png` — two deliveries, one request, no duplicate charge
* `ev/EX5_over_receipt_blocked.png` — the receive screen refusing an over-ship

## Test data left on the branch (no cleanup needed — per-ticket QA branch)

P9565-248 (invoiced) · P9565-249 · P9565-250 (invoiced) · P9565-251 · P9565-252 · P9565-253 ·
P9565-254 (empty after the split) · P9565-255 · P9565-256, plus their purchase orders. Work order
**S9565-13556** was received as part of check 8. **On production, one part sale remains: P-70**
(`49a1cb6d…`, customer ZZAUTOTEST Bridgeport Hauling, part `ZZ9565-P1`, $26.25). It was created for
the before-check and **cannot be removed** — the product refuses both routes: `work-orders/delete`
returns *"Completed part sale cannot be deleted."* and `change-status` back to approved returns
*"Complete work order cannot change its status again."* It is named ZZAUTOTEST and sits on the test
organisation, and it has not been invoiced.
