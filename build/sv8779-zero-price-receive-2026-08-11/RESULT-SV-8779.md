# SV-8779 — receiving a $0 part. Results, and an important complication.

**Tested 2026-08-11.** Ticket: *"Cannot receive parts when the part line sale price is $0"* — Bug,
Medium, status TESTING QA. There is **no developer QA handoff** on the ticket, so this was tested to
the ticket's own steps.

| | |
|---|---|
| QA branch (the fix) | `sv8779.qa.shopview.com`, build **`v3.5-bda953b`**, last-modified Thu 06 Aug 2026 11:20:04 GMT |
| Production (the before) | `app.shopview.com`, build **`v3.7-362fcac`**, last-modified Tue 11 Aug 2026 09:00:49 GMT |

## The headline, in one line

**The bug reproduces on production, it reproduces on the QA branch too — but so does the same failure
with a normally-priced part, so the $0 price is NOT the thing that separates pass from fail in any
test I could construct.** That has to be resolved before anyone says this ticket passes or fails.

## What was run, and what happened

| # | Environment | Scenario | Receive result |
|---|---|---|---|
| 1 | **Production** `v3.7-362fcac` | Part at **$0** sale price, work order S2-840 | 🔴 **HTTP 500** — `9b249613-4d2b-4a36-aa45-d25d2c67db71` |
| 2 | **Production** | **Control** — part at $25 sell / $10 cost, nothing at $0, work order created fresh | 🔴 **HTTP 500** — `8c35da28-edc3-4af5-a1e9-c354f8fd0485` |
| 3 | QA branch `v3.5-bda953b` | Part at **$0**, work order S2-15886 | 🔴 **HTTP 500** — `af533803-e78d-4d9a-9b40-39508870a568` |
| 4 | QA branch | Same order once a $25 part was added alongside | 🔴 **HTTP 500** — `9e5eb30d-5fd8-4545-87e2-84d947e47b1c` |
| 5 | QA branch | **Control** — separate work order, every part $25 sell / $10 cost | 🔴 **HTTP 500** — `dc8a89d4-d06a-4ffa-b110-0e7c9f368a42` |
| 6 | QA branch | Same control, with the Tax field filled in as well | 🔴 **HTTP 500** — `e08f3925-a90f-48c1-875b-fb187438c426` |
| 7 | QA branch | **A purchase order that already existed** — not created by this test — part at **$127.69** | 🔴 **HTTP 500** — `c6fba762-47a0-4f6a-b0da-9b80d2968748` |

Every one of those is `POST /api/inventory/orders/accept` → **500**, with the same on-screen result:
the part is not received, the screen does not move on, and a red *"Ooooops! An error occurred"* toast
appears carrying the request ID.

**Those seven request IDs are the most useful thing in this document** — a developer can look up the
actual exception for each.

## Reading the result honestly

**What is certain:** a customer on production today cannot receive a part priced at $0. The ticket's
reported symptom is real and current. Chris Ward confirmed it on 30 July; it is still true on
2026-08-11 against build `v3.7-362fcac`.

**What is NOT established:** that the $0 price is the cause. Rows 2, 5, 6 and 7 all had real prices
and failed identically. Two explanations fit the evidence and I cannot separate them from the outside:

1. **Receiving is currently failing much more broadly than the ticket describes** — in which case
   SV-8779 is one visible symptom of a bigger fault, and the fix as scoped will not resolve it.
2. **Something common to every scenario I could build is the real trigger** — the most likely
   candidate is that these are free-text part requests that are not linked to a catalogue or
   inventory part, so the receive has nothing to book stock against. Row 7 argues against this (that
   purchase order pre-existed and was not created by this test), but it is seed data and may carry
   stale references of its own.

**Either way, the fix cannot be verified on `sv8779.qa.shopview.com`**, because nothing receives
there — including things that have nothing to do with this ticket.

## What would settle it, quickly

- **A developer looking up any one of the seven request IDs.** The exception will say in one line
  whether this is a $0-specific guard or something else entirely. That is a two-minute job for
  whoever owns the branch and it saves a lot of guessing.
- **One known-good receive on the QA branch** — if anyone can name a purchase order there that
  *does* receive successfully, the picture resolves immediately.
- **The QA handoff for this ticket**, which does not exist yet. What was changed, and what the
  developer expects to be checked.

## Evidence

| File | Shows |
|---|---|
| `ANN-PROD-BEFORE.png` | Production, the $0 part ready to receive — everything filled in, Receive enabled |
| `ANN-PROD-AFTER.png` | Production, straight after pressing Receive — not received, error toast, request ID visible |
| `ANN-QA-BEFORE.png` | The QA branch, same starting point |
| `ANN-QA-AFTER.png` | The QA branch, same failure |
| `PROD-CONTROL-priced-part-before.png` / `…-after-also-fails.png` | The production control at $25 — fails identically |
| `QA-CONTROL-priced-part-before.png` / `…-after-also-fails.png` | The QA-branch control at $25 — fails identically |

## Reproduction data, named exactly

**Production** — customer *aqeel transport 56*, workplace *Trucks Hill 2*, labour rate *4226*.
Work order **S2-840** (`a476f238-cf38-468a-84e4-d4b5c7674484`), part **ZZ-8779-ZERO**, sell $0, cost
$0, vendor `f9618e14-2255-470d-afc7-b20c8e7fc33d`, purchase order
`e28a00f8-5157-41a8-86df-1ffeed35822f`, invoice number `ZZ8779P-A1`.
Control work order `4d728d6f-621d-472c-abb6-9ec05aecaf72`, part **ZZ-CTL-595d** at $25/$10, purchase
order `e4e787ed-42ab-4b2c-b437-a23d9efdf1a1`, invoice number `ZZ8779P-C1`.

**QA branch** — customer *Aadale Motors*, workplace *Staging Heavy Duty - 9919*.
Work order **S2-15886** (`0ca66c7b-d97b-4064-ad45-cac3b1de3637`), part **ZZ-SV8779-ZERO**, sell $0,
vendor *Aabridge Beverages* (`1e7bd0bf-e882-45fa-8c21-835e32ffa374`), purchase order
`f6d93137-6f21-4d23-87fa-0e4e9cdac321`. Control work order
`b0dbad6d-e157-4a00-a3fc-3b817377332e`, purchase order `779e7114-94bc-4d6f-8df4-642ef13e4ae5`.
Pre-existing purchase order tested: **S-15859** (`290f23e2-f4b0-47a5-94d5-2675264c78c6`), part
P634516 at $127.69.

## Steps, for anyone repeating it

1. Open a work order and add a line.
2. On the Parts tab add a part request: give it a description, a part number, a category, a vendor,
   and leave **Sell Price at $0**.
3. Set the line's status to Authorized — the part then reads **Auth to order**.
4. Press **Order** on the part's row. It orders fine; the part becomes **Awaiting** and a purchase
   order is created. *(Ordering is not where it breaks.)*
5. Open the purchase order's **Receive Parts** screen, enter an invoice number and a received
   quantity of 1, and press **Receive**.
6. The part is not received and a red error appears.

Then repeat the whole thing with a real price on the part — on both environments tested it fails the
same way, which is the complication described above.

## Honest limits

- Only the **Accept Delivery** receive path was exercised. There is a bulk-receive screen elsewhere in
  the product that was not tried.
- The two builds are different versions (`v3.5-bda953b` on the branch, `v3.7-362fcac` on production),
  which is normal for a ticket branch cut some time ago, but it means "the branch is behind production"
  is a possible contributor to row 7 and should not be ruled out.
- Nothing was cleaned up on the QA branch, per the standing rule that per-ticket QA branches are
  disposable. On **production**, four `ZZAUTOTEST` work orders were created and left in place; they are
  in the disposable test organisation and none of them was invoiced or paid.

---

# CORRECTION AND RE-TEST — the QA lead's exact steps, on the right screen

**My first pass used the wrong receive screen.** I received from the `/accept-delivery` page. The
steps are: on the part's row press **Receive**, which opens the **Receive Parts** view
(`/order/{orderId}?receive=1&…`) with an editable **Cost** and **Sell** column per row — the sell
price is on that screen, which is the point. Re-tested there.

**What the Receive Parts view shows:** the ordered part with **Sell = 0**, a Quantity Received box,
an invoice number field, a tax field and a **Receive** button. Screenshot
`RECEIVE-VIEW-sell-price-column-zero.png`.

**The A/B, through the exact call that screen makes** (`POST /api/inventory/orders/receive-view` to
build the payload, then `POST /api/inventory/orders/accept`), same purchase order, same session,
seconds apart, only the sell price different:

| | Part | Sell | Cost | Result |
|---|---|---|---|---|
| **A — the ticket** | ZZ-SPO-ZERO | **$0** | $0.01 | 🔴 **HTTP 500** · `c6bb7e02-f7f6-4476-92c7-807a47bd8b6f` |
| **B — control** | ZZ-SV8779-ZERO | **$25** | $0 | 🔴 **HTTP 500** · `66061036-a226-4d91-b1ac-2cef0218e25c` |

Both parts stayed at **Awaiting**; neither was received.

**So the conclusion is unchanged, and now it rests on the correct screen:** on
`sv8779.qa.shopview.com` build `v3.5-bda953b`, **a $0 part cannot be received — the ticket's symptom
is not fixed** — and a priced part fails identically, so the failure is not $0-specific on this
branch.

**One thing I could not drive and am not claiming either way:** in the UI the row's selection
checkbox would not tick under automation (clicked as the visible element, as the inner element, and
via a direct DOM click), and the **Receive** button stays disabled while no row is selected. I cannot
tell whether that is real product behaviour or my tooling failing on that component, so it is
recorded as unknown rather than as a finding. The endpoint result above does not depend on it.

**Also learned, worth keeping:** `POST /api/work-orders/part/change-request` rejects `cost: 0` with
*"Cost is required"* — a cost above zero is required even when the **sell** price is zero. And the
accept payload needs **`quantity_received`** and **`total`** on each item; without them the call
returns *"Nothing to receive."*
