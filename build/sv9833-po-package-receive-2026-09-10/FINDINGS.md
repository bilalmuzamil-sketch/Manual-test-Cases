# SV-9833 — "Package Quantity and Cost Are Not Calculated Correctly When Receiving Inventory Parts From a Purchase Order"

**QA verdict: PASSED.** The customer's reported behaviour reproduces on the released build and is gone
on the fix branch. Ordering 1 package of 19 now puts 19 units into Inventory and divides the package
cost across them. Every case the developer asked for was driven live, and nothing else in the
purchase-order or receiving flow moved.

Ticket: [SV-9833](https://shopview.atlassian.net/browse/SV-9833) · Bug · **Code Review** · priority
Medium · assignee Dipesh Changawala · reporter Ryan Fyfe (via ShopView PowerTools, submitter Mike
Freeman). Customer: **Devon Gillespie, Summit Fire Apparatus Services Ltd.** (2 users, via Intercom) —
*"On PO I-15 that I just did i ordered a 19L pale of ATF … when I recieve it it shows that I only
received 1. not 19"* and *"instead of it doing it automatically I am having to then edit the part from
1 to 19. and divide the cost by 19 to make it right"*.

## What the ticket asked for, and who said what

| Source | What it says |
|---|---|
| Description (Steps to Reproduce) | *"Unable to replicate"* — so the description gives the symptom, not a route. Expected: 1 package of 19 receives **19** units and the package cost is divided across them. Actual: **1** unit at the full package price, forcing the customer to hand-correct the vendor invoice. |
| Dipesh Changawala, 9 Sep 04:36 (repro + QA handoff) | **The key detail:** the pack size is only lost when the part is added to a purchase order that **already exists**, through **Add Order Item**; adding it while creating a brand-new PO works. Expected after the fix: Inventory +19, valued **$0.53**, and the Vendor Invoice shows an **Items Per Package** column reading 19. Two extra cases: **multiple packages** (2 × 10 at $100 → 20 units at $10.00) and **partial receive** (1 of 2 → 10 units, 1 package still on the PO, then the other 10). Costs are held to the cent, so $10.00 ÷ 19 shows as **$0.53** and $147.16 ÷ 19 as **$7.75**. The Vendor Invoice keeps **quantity 1 at the package price** — correct and intended. Out of scope: work-order POs have no package option. Pre-existing PO lines will not repair themselves. |
| Dipesh Changawala, 9 Sep 04:52 (root cause) | Two ways to put a part on a PO; only the create-screen path saved the pack size. **Add Order Item dropped it silently**, so nothing downstream could expand the package. PR [#2983](https://github.com/ShopView/shopview/pull/2983). Also: *"The receiving screen still does not display the pack size — that is SV-9721."* |
| Dipesh Changawala, 10 Sep 06:32 | QA env created. |

**Rule 78 note — no product decision was open on this ticket.** There is no options question and no
recommendation to check a shipped choice against; the expected behaviour is stated plainly in the
description and unchanged by any later comment.

## Environments and build markers (read live at the start, and again before writing up)

| Environment | app-version | index.html last-modified |
|---|---|---|
| **Fix branch** `sv9833.qa.shopview.com` | **v26.36.2-165cc79** | Thu, 10 Sep 2026 11:16:21 GMT |
| Staging (the before picture) `app.staging.shopview.com` | v26.36.2-a678e3c | Thu, 10 Sep 2026 12:42:51 GMT |

The two environments are clones of the same organisation — **the same part ids exist on both**
(`POI5730C` = `16d69ea0-12eb-4729-959f-71f5dd16b943` on each), and both started this pass at
**Total Quantity 0, Average Cost $6.93**. That makes every comparison below a true like-for-like.

## What was checked

| # | Check | Fix branch | Released build | Result |
|---|---|---|---|---|
| 1 | The reported bug: 1 package of 19 at $10.00, added through **Add Order Item** on a saved PO, received with Quantity Received 1 | 19 units at $0.53 | **1 unit at $10.00** | **PASSED** |
| 2 | The same thing through the product's own **Receive** button (the screen that button opens, not the alternate one) | 19 units at $0.53 | **1 unit at $10.00** | **PASSED** |
| 3 | A brand-new part added with **Add new special order part** + Package | 19 units at $0.53 | **1 unit at $10.00** | **PASSED** |
| 4 | Multiple packages: 2 packages of 10 at $100.00 each, received together | 20 units at $10.00 | not run | **PASSED** |
| 5 | Partial receive: 1 of 2 packages, then the second | 10 units, 1 package left on the PO, then 20 | not run | **PASSED** |
| 6 | Contrast test: the package line added **while creating** the PO — the path that already worked | 19 units at $7.75 | not run | **PASSED** |
| 7 | Rounding matches the ticket's own table ($10.00 ÷ 19 = $0.53, $147.16 ÷ 19 = $7.75) | both exact | — | **PASSED** |
| 8 | The Vendor Invoice still bills **quantity 1 at the package price**, with the pack size in its own column | 1.00 at $10.00, Items Per Package 19, total $30.98 | 1.00 at $10.00, no column, total $30.98 | **PASSED** |
| 9 | A non-package line on the same purchase order is unaffected (a control line ran on every single case) | +2 at $9.75 every time | identical | **PASSED** |
| 10 | Work-order purchase orders are untouched — there is no way to add a package line to one | no **Add Order Item** button at all | same | **PASSED** |

## The detail behind checks 1 and 2 — the same part, the same inputs, both builds

Part **POI5730C** *"Synthetic Dexron VI ATF, 1L"* — the closest match in this data to the customer's
19-litre pail of ATF. Vendor **Stillwater Diesel Repair**. Both builds started at Total Quantity 0 /
Average Cost $6.93.

- Purchase order created with one ordinary control line (`122993`, quantity 2 at $9.75), saved and
  reopened.
- **Add Order Item** → part POI5730C → Quantity 1 → **Package** ticked → **Items Per Package 19** →
  Cost 10 → Add. Both builds then showed the line as **Quantity 1.00 · Cost $10.00000 · Total Cost
  $10.00**, exactly as the handoff says it should.
- Received with invoice number `ZZAUTOTEST-9833-1`, Quantity Received 1.

| | Released build | Fix branch |
|---|---|---|
| Total Quantity | **1** | **19** |
| Average Cost | **$10.00** | **$0.53** |
| Sell Price (recalculated from cost by both builds) | $16.67 | $1.13 |
| Pack size stored on the order line | `null` | `19` |
| Items Per Package on the Receive Parts screen | column absent | **19** |
| Items Per Package on the Vendor Invoice | column absent | **19** |
| Vendor invoice line | quantity 1.00 at $10.00 | quantity 1.00 at $10.00 |
| Vendor invoice total | $30.98 | $30.98 |

Exhibits: `ev/EX1-reported-bug-before-after.png`, `ev/EX2-receive-screen-before-after.png`,
`ev/EX3-vendor-invoice-before-after.png`.

## The fix has two halves, and both were proven separately

This matters because it is not what the root-cause comment describes, and only one half fixes the
customer's case.

**(a) The server side — the half that fixes the reported bug.** For an existing inventory part, the
front end on the **released** build *did* send the pack size: the captured `add-item` request body on
staging was
`{"order_id":"88d5ccda…","part_number":"POI5730C",…,"part_id":"16d69ea0…","itemsPerPackage":19}` —
byte-for-byte the same shape as the branch's. The order line came back with **`itemsPerPackage: null`**
on staging and **`19`** on the branch. So the pack size was **accepted and discarded** on the released
build; it is now persisted. Re-confirmed on a second part (`2--SHL55057739`): identical payload on both
builds, `null` on staging, `19` on the branch.

**(b) The front end — a second, narrower half.** For a **brand-new** part (added with **Add new special
order part**, so there is no part id yet) the released build omits the field from the request entirely:
staging sent `{…,"manufacturer_id":""}` with **no `itemsPerPackage` key at all**, while the branch sent
`{…,"manufacturer_id":"","itemsPerPackage":19}`. Received end to end: staging **1 unit at $10.00**,
branch **19 units at $0.53**.

This is visible in the deployed bundles. In `OrderItemModal`, the released build reads
`c && !x.value && (e.part_id = c, f.value && (e.itemsPerPackage = D.value))` — the pack-size assignment
is **nested inside** the has-a-part-id guard — while the branch reads
`c && !M.value && (e.part_id = c), f.value && (e.itemsPerPackage = T.value)`, with the assignment moved
out into its own statement. `x`/`M` is `part_type === "new_part"` in both.

**Why this is worth saying:** the root-cause comment attributes the whole thing to the front end
dropping the value. For the case the customer actually hit — an existing inventory part — the front end
was sending it and the server was throwing it away. Both halves are working on the branch, so the
verdict is unaffected, but the description of the cause is incomplete.

## The detail behind checks 4, 5 and 6 — the extra cases

- **Multiple packages** (`19421426`, Dexron VI ATF 4.73L): 2 packages of 10 at $100.00 each, received
  together → **20 units at $10.00**. Matches the handoff exactly.
- **Partial receive** (`104775`, AW32 Hydraulic Oil — the same part named in SV-9721): 2 packages of 10
  at $100.00. Received 1 → **10 units at $10.00**, purchase order moved to Partial Delivery with the
  line reading received 1.00 / **remaining 1**, pack size still 10 on the line. Received the second →
  **20 units at $10.00**, second delivery record created, pack size on both delivery lines. Receiving
  less than ordered raises a **"Delivery status"** dialog offering **Receive As Order Fulfilled** /
  **Receive As Partial Delivery**; Partial was used.
- **Contrast test** (`68175338AC`, Mopar coolant, description literally *"Sold Per Litre"*): 1 package
  of 19 at **$147.16**, added on the create screen → **19 units at $7.75**. This both confirms the path
  that already worked has not regressed and proves the second row of the handoff's rounding table.

Exhibit: `ev/EX4-other-package-cases.png`.

## Rule-74 sweep — everything that differs between the two builds

Compared like for like, not just the declared changes.

| Surface | Released build | Fix branch | Accounted for |
|---|---|---|---|
| `add-item` request for an existing part | sends pack size | sends pack size | same |
| `add-item` request for a new part | **omits pack size** | sends pack size | the front-end half of the fix |
| Order line storage | `itemsPerPackage: null` | `19` | the server half of the fix |
| **Receive Parts** screen at `/accept-delivery/{id}` | no Items Per Package column | **column present** (`19`, or `-` for a non-package line) | **an addition the ticket says is NOT covered** — see below |
| **Vendor Invoice** (delivery) screen | no column | **column present** | declared in the root-cause comment |
| Receive screen the product's **Receive** button opens (`?receive=1`) | no column | **no column either** | identical — see below |
| New Purchase Order dialog items table | Items Per Package column appears once a package line exists | same | same on both |
| Purchase order detail items table | Part Number · Description · Quantity · Cost · Total Cost · Actions | identical | same on both |
| **Edit Order Item** dialog | **no Package checkbox and no Items Per Package field** | identical | same on both — see below |
| Vendor invoice amounts and tax | $29.50 / $1.48 / $30.98 | identical | unchanged, as intended |
| Control line (non-package) on every case | +2 at $9.75, pack size null | identical | unchanged |

## Three things reported, not treated as faults

**1. SV-9721 is half-satisfied on this branch, on the wrong screen.**
[SV-9721](https://shopview.atlassian.net/browse/SV-9721) (still **Open**, unassigned) asks for the pack
size on the PO receiving screen — and its customer's own example part is `104775`, one of the parts used
above. There are two receiving screens:

- `/accept-delivery/{orderId}` — the flat one. **On the branch this now shows Items Per Package.** On
  staging it does not.
- `/order/{orderId}?receive=1` — the vendor-grouped one, and this is what the **Receive** button on the
  purchase order and the **Receive** link in the purchase-order list both open. **Neither build shows
  the column here.**

So the root-cause comment's *"the receiving screen still does not display the pack size"* is still true
for the screen a receiver actually lands on, and SV-9721 should stay open — but it is worth knowing that
half of it is already built.

**2. The Edit Order Item dialog cannot show or change a pack size, on either build.** Once a line is
added there is no Package checkbox and no Items Per Package field in the edit dialog. That is identical
on both builds, so it is not a regression — and it is precisely why the handoff says a pre-fix line
"must be deleted and added again". Worth a product decision at some point; not raised as a defect.

**3. A one-off I could not reproduce.** Very early in the pass, opening the Receive screen through the
`?receive=1` route on a purchase order whose package line had just been added showed *"All parts on this
purchase order have been received"* when nothing had been received. Attempting it again on freshly
created purchase orders on **both** builds produced the correct screen every time. Not reproducible, so
not reported as a defect — recorded here only so it is not lost.

## Honest limits

- **The customer's own data was never touched.** Summit Fire Apparatus's purchase order I-15 is in their
  organisation, which I have no access to. Everything above was reproduced on a part that exists
  identically on the released and fixed environments, from an identical starting quantity and cost.
- **Admin only.** Every check ran as an Admin user. How the package fields behave for other roles was
  not exercised.
- **Checks 4, 5 and 6 were run on the fix branch only.** They are the developer's own dev-verified
  cases and are about the fixed behaviour; the released build's behaviour for them was not measured.
- **"Pre-existing PO lines will not repair themselves" was not independently tested on the branch** —
  every line on this branch was created after the fix. The nearest evidence is the released build, where
  a line whose pack size was dropped does receive as 1 unit; the handoff's delete-and-re-add guidance
  stands untested.
- **Driven on the screen, not by API.** The purchase orders were created, the package lines added and
  the receipts taken through the UI, because the fix touches the front end and an API call would bypass
  the exact code path in question. Only the *measurements* (inventory quantity, average cost, stored
  pack size, delivery records) were read back through the API, plus the Inventory screen captures in the
  exhibits.

## Data left on the environments

Both are dummy accounts, and the per-ticket QA branch needs no cleanup — recording it anyway.

- **Fix branch:** purchase orders I-1395 through I-1400 created and received (invoice numbers
  `ZZAUTOTEST-9833-1` … `-6`); inventory moved on POI5730C (0→19), 19421426 (0→20), 104775 (0→20),
  68175338AC (0→19), 2--SHL55057739 (0→19), ZZAUTOTEST-PKG-1 (new part, 0→19) and the control 122993
  (5→15).
- **Staging:** purchase orders I-1457, I-1458, I-1459 created and received; POI5730C (0→1),
  2--SHL55057739 (0→1), ZZAUTOTEST-PKG-1 (new part, 0→1), control 122993 (5→11).

## Recipes proven this pass (for the playbook)

- Inventory purchase orders are `type: 1` with `work_order_id: null`; work-order POs are `type: 0`.
  List: `GET /api/inventory/orders`; detail `GET /api/inventory/orders/{id}` (the order item carries
  **`itemsPerPackage`**, which is the quickest way to tell whether a pack size was saved).
- **Routes:** the purchase-order page is **`/order/{id}`** at the top level (not `/parts/order/...`);
  `/order/{id}?receive=1` is the vendor-grouped receive screen, `/accept-delivery/{id}` is the flat one.
  Both end in `POST /api/inventory/orders/accept`.
- **New Purchase Order dialog** (`button_new_po`): `select_order_vendor` · `select_part` ·
  `input_order_item_description` · `checkbox_order_item_package` · `input_order_item_quantity` ·
  **`input_order_item_cost`** · `input_order_item_items_per_package` (appears only after Package is
  ticked) · `button_add_order_item` · `button_save_and_close_order`.
- **Add Order Item dialog** on a saved PO (`button_add_order_item`) uses **different ids** for the same
  fields: the cost box is **`input_base`**, the save button **`button_save_order_item`**, and a part not
  in the list is added with **`add_new_special_order_part`**, which only appears once the search returns
  "No results".
- **Quasar selects here carry their `data-test-id` on the `<input>` itself**, and clicking it does not
  open the menu — **type into it**; the option list is debounced, so wait ~2.5 s and retry once on a
  transient "No results" before treating it as empty.
- **Quasar checkboxes did not toggle on a coordinate click** (the ripple fires, the state does not
  change). `page.locator(...).click({force:true})` then verifying `aria-checked` works; on the
  vendor-grouped receive screen each line must be ticked (`checkbox_item_<itemId>`) before its
  Quantity Received populates and the Receive button submits.
- **Receiving less than ordered raises a "Delivery status" dialog** — *"Delivered quantities of one or
  more order items are less then expected"* — with **Receive As Order Fulfilled** / **Receive As Partial
  Delivery**. Until one is chosen **no request is sent**, which looks exactly like a dead button.
- The vendor-grouped receive screen's controls are suffixed with the **purchase order id**
  (`input_invoice_<poId>`, `button_receive_po_<poId>`), the flat one with a **row index**
  (`input_delivered_quantity_0`).
- The part picker is `GET /api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?…&search=`
  and returns two entries per part — `part_type: "inventory_part"` and `"catalogue_part"`. Neither is
  `new_part`; that value only appears when a part is created inside the dialog.
