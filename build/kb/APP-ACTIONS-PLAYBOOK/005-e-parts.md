## E. Parts
- **ADD PART to a WO/line (API — the recorded recipe; do NOT re-discover):**
  `POST /api/work-orders/part/make-request {line, work_order, description, quantity,
  part_source_type:'inventory'|'vendor', part_number, sell_price, cost, part_category_id}` → 201.
  **`part_category_id` is REQUIRED** (categories: `GET /api/inventory/categories` → {value,label}).
  Edit: `POST /api/work-orders/part/change-request {id, description|quantity|part_number|
  part_source_type}` → 200 (recalcs sellPrice/margin; vendor→inventory locks cost). *Source: CLAUDE.md
  Simple Flow facts + Custom Roles Phase-2b appendix.*
- **Add part via UI (reliable when API awkward):** WO detail → New Part Request dialog. Fields:
  Part Number / Description / Quantity (+ Sell Price when `seeFinancialData` ON — sell-price field is
  ABSENT for roles without SFD). For inventory source: `select_part` a catalogue PN (forces
  Source=Inventory) → qty via `input_bin_quantity_{binId}`.
- **Remove a WO part:** `POST /api/work-orders/parts/delete {part_id, work_order_id}` (returns picked
  inventory + enables WO delete).
- **Cored part (seed data):** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id). Core OK/Not-OK is a LINE-level control governed by WO Lines Create & Edit; needs a
  received core-bearing part to appear.
- **Inventory / orders / deliveries:** parts `GET /api/inventory/parts?...&search=`; create
  `POST /api/inventory/parts/create` → 201, delete `POST /api/inventory/parts/delete` → 201; PO list
  `GET /api/inventory/orders`, order detail `GET /api/inventory/orders/{id}`; deliveries
  `GET /api/inventory/deliveries`. Edit a PO item pre-receive: `POST /api/inventory/orders/change-item
  {order_id,item_id,part_number,quantity_ordered,price,category,description}` → 200.
- **`GET /api/inventory/orders/{id}` now ALSO returns full-precision fields `price_decimal`,
  `total_cost_decimal`, `total_price_decimal`** (the SV-8721 5-decimal fix fields) alongside the legacy
  rounded `price` / `total_price`. Use the `*_decimal` fields to verify 5-decimal cost precision on
  Receive. *(confirmed live 2026-07-27, SV-8721 side project.)*
- **Receive parts:** `POST /api/inventory/orders/accept` (driven from `/accept-delivery/{orderId}`:
  fields `invoice-number`, Invoice Date, per-line `delivered` qty, Tax, note; over-qty → "Received
  More Than Ordered" warning). *Source: CLAUDE.md Simple Flow facts.*
- **WO Receive Parts screen (UI route):** `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={workOrderId}`
  — this is the Receive Parts screen reached from a work order (the PO Receive screen with the WO as the
  return target). *(confirmed live 2026-07-27, SV-8721 side project.)*
- **Delete an UNPICKED part REQUEST:** `POST /api/work-orders/part/remove-request/{requestId}` → 200
  (the id in the URL, empty body). **`parts/delete` returns 400 "part_id Not found" for a request that
  was never picked** — `parts/delete` is for picked inventory parts; requests use `remove-request`.
  Useful to clear the part a canned line auto-creates. *(proven live 2026-07-29, sell-price verify.)*
- **New Part Request modal (UI recipe):** WO lines page → the LINE's ⋮ kebab (inside
  `[data-test-id=table_work_order_lines]`, the menu containing "Request part | Add line note | Save as
  canned line | …") → **"Request part"**. Dialog test-ids: `input_workorder_part_description`,
  `input_workorder_part_quantity`, `select_part` (PN catalogue), `select_workorder_part_source`,
  `select_part_category`, `select_part_vendor`, `input_part_cost`, `input_workorder_part_core_charge`,
  `input_workorder_part_sell_price`, `input_workorder_part_margin`; save buttons
  `button_workorder_part_save` (= Save & Close) / `…_save_add_part` / `…_save_add_line`.
  **Category DEFAULTS to "Uncategorized"** when nothing is picked. *(proven live 2026-07-29.)*
- **Receive Parts screen driving (test-ids + endpoints):** vendor top-left =
  `select_assign_vendor_{orderId}` (Quasar select → `.q-menu .q-item`; fires
  `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds:[]}`); invoice # =
  `input_invoice_{orderId}`; per-item `input_part_number_{itemId}` (fires
  `POST /api/orders/items/{itemId}/part-number {partNumber}`), `input_cost_{itemId}`,
  `input_sell_{itemId}`, `input_qty_{itemId}`; submit = `button_receive_po_{orderId}` (disabled until
  vendor + invoice + PN + cost/sell present — sell>0 is part of the gate). Screen data =
  `POST /api/inventory/orders/receive-view {orderIds:[…], vendorIds:[…]}`. **GOTCHAS (proven
  2026-07-29):** (1) Cost/invoice edits fire NO API call on blur and do NOT persist across reload —
  they submit only with the final Receive; (2) after a vendor is assigned, re-opening the URL that
  still has `&vendorless=1` renders "All parts on this purchase order have been received." even though
  nothing was received (artifact — drop `vendorless=1` and reload); (3) the Sell field does NOT
  auto-calc from Cost on this screen in the current build (staging AND prod — the 2026-07-29
  sell-price bug, see build/simple-flow/sell-price-investigation-2026-07-29/live-verify-2026-07-29/).
- **Returns:** create `POST /api/work-orders/part/make-return-request` → 200; delete
  `POST /api/work-orders/part/remove-return-request {part_return_request_id}` → 200; list
  `GET /api/work-orders/part/list-return-requests`. A return can't be deleted on a Complete WO —
  uncomplete first.

### 🧾 Vendor invoices, receiving & the PAYMENT-SELECTION LIST — the fast path (proven SV-9096, 2026-08-31, per-ticket QA branch `sv9096`, build `v26.35.6-8176cde`)
**Why this exists:** SV-9096 (invoice total vs payment-selection-list mismatch) took an afternoon almost entirely on route/endpoint discovery and fighting `orders/create` + the Quasar New-PO modal. With the recipe below a repeat is **~10 API calls**. **Prefer API for setup + value reads; use the UI only for the evidence screenshots.**

- **ROUTES (one dead route wastes time):** Parts sub-nav → Purchase Orders = **`/parts/orders`** · Vendor Invoices = **`/parts/deliveries`** · Returns = `/parts/returns` · Vendors = `/parts/vendors`. **`/parts/purchase-orders` is a DEAD page** ("Looks like this page took a coffee break… permanently"). Opened vendor-invoice detail = **`/parts/delivery/{deliveryId}`**. A vendor's **payment-selection screen** (Unpaid Invoices) = **`/parts/vendor/{vendorId}/unpaid-invoices`**. Receive screen = **`/accept-delivery/{orderId}`**.
- **AUTH without logging the user out** = localStorage-seed (NO quick-login; §"THIS SPA AUTHENTICATES FROM localStorage"). Seed `user={data:{details:{default_workplace:<WP>},view_mode,system_role,…}}`, `fe_permissions_wrapper`, `location`, `current_shop_id`, `timezone`, `country_code`, `bookkeeping_enabled`, then navigate. **THEN SCOPE THE SESSION: `POST /api/iam/change-location {workplace_id, workplace_timezone}`** — without it `default_workplace` is `"None"` and inventory/parts pages sit on **"Loading…"** forever. (These clones: Heavy Duty 9919 = `b3c8c820-f815-4cf1-8938-10956c5ee71a` / America/Edmonton; workplaces via `GET /api/staff/my-workplaces`.)
- **CREATE A PO WITH A CUSTOM (fractional) COST — do NOT fight `orders/create`** (its item shape 500s: needs `id`+`is_core`+`quantity`+`part_number`+`price`+`category`+`description`, and a random `id` still 500s; the New-PO Quasar modal gates Description behind Part Number and is fragile). **Instead:** take an existing **ordered** PO — `GET /api/inventory/orders?status=ordered`, pick one with a single item that has `ioi_vendor_name` — and set its line cost/qty: **`POST /api/inventory/orders/change-item {order_id,item_id,part_number,quantity_ordered,price,category,description}` → 200** (`price` takes 5 decimals, e.g. 7.836). Verify with `GET /api/inventory/orders/{id}` → item `price_decimal` / `total_cost_decimal`.
- **RECEIVE IT (creates the vendor invoice/delivery): `POST /api/inventory/orders/accept` — camelCase, and `items` is a JSON STRING:** `{id:<orderId>, invoiceNumber, invoiceDate:"2026-08-31T06:00:00.000Z" (ISO-Z, NOT a bare date), note, items:JSON.stringify([<the order-detail item + quantity_received + total>]), total, orderStatus:"fulfilled", tax}`. Returns `{"data":[]}` on success. **On the receive SCREEN the Cost is READ-ONLY** (comes from the PO) — only Quantity Received + Tax are editable, which is why the cost must be set at create/`change-item`. **Fractional received qty (1.5, 3.1) makes the PO `accept` 500** — fractional-qty receives live on the **work-order** path `POST /api/orders/receive-requested-parts` instead.
- **EDIT A RECEIVED INVOICE LINE (the SV-9096 bug trigger): `POST /api/inventory/deliveries/change-item {delivery_id,item_id,quantity,price,part_number,description}` → 200.** Header/tax edit: **`POST /api/inventory/deliveries/change {delivery_id,invoice_number,vendor_id,tax,invoice_date}`**. ⚠️ The workplace **re-derives its default tax (5% GST on Heavy Duty) on ANY line edit** even if you received at tax 0 → set `tax:0` via `deliveries/change` for clean numbers (`change-item` ignores a tax field).
- **READ THE TWO FIGURES A SV-9096-CLASS BUG COMPARES:**
  - **Opened-invoice total:** `GET /api/inventory/deliveries?search=<invoiceNumber>` → `total_price_decimal` (delivery detail line also carries `total_cost_decimal` raw + `total_cost` round-first display).
  - **PAYMENT-SELECTION LIST amount/balance (the vendor ledger / Unpaid Invoices):** `GET /api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=<vendorAccountId>&pagination%5BrowsPerPage%5D=1000`. Response is `data.response` (a dict — recurse for dicts carrying `reference_id`+`amount`; `reference_id` = the delivery id; fields `amount`,`balance`,`invoice_number`). **`accountId` is the vendor ACCOUNT id, NOT the vendor id** — grab it once by loading `/parts/vendor/{vendorId}/unpaid-invoices` and reading the `accountId=…` query on that call (attach the request listener BEFORE navigating; boot lands you on the page first).
  - **Rounding-fix check:** correct = **multiply-then-round** (9 × 7.836 = 70.524 → **70.52**); the bug stored **round-first** (7.84 × 9 = 70.56) in the ledger. PASS ⇔ invoice `total_price` == ledger `amount` == `balance`.
- **WORK-ORDER receive path (for WO-sourced parts, tax-computed receives — G1/F2; proven SV-9096 follow-up 2026-08-31):** WO create (§C) → add a line `POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id, status:"authorized"}` (canned lines list: `GET /api/work-orders/canned-lines`) → **request a vendor part `POST /api/work-orders/part/make-request {line, work_order, description, quantity, part_source_type:"vendor", part_category_id, part_number, cost, sell_price, vendor, is_core}`** — ⚠️ the category field is **`part_category_id`** (NOT `category`/`category_id`) → if it made a WO-linked order (`GET /api/inventory/orders` → `workOrderId==woId`, `vendorMissing:true`), assign a vendor `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds:[…]}` and set cost with `orders/change-item` → **receive on the WO receive screen `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={woId}`**: test-ids `input_invoice_{orderId}`, `input_sell_{itemId}` (must be > 0 to enable Receive), `input_qty_{itemId}`, **`input_tax_{orderId}`**, `button_receive_po_{orderId}`; the button fires **`POST /api/orders/receive-requested-parts {vendor_id, invoice_number, invoice_date, note, total, tax, items:[<full item objs>]}`** (NOT `orders/accept`). **TAX ON A WO RECEIVE is a FE-computed dollar field = rate × subtotal, ROUNDED** (86.90 × 5% = 4.345 → shows $4.35, stored 435c) — this is the G1 path; the stored invoice + payment ledger both keep the rounded value.
- **Payment apply — RESOLVED SHAPE (SV-9096 follow-up 2026-08-31): `POST /api/parts-catalogue/vendor/payment/create {account_id, payment_date, payment_method:"<methodKey e.g. 10000_CALGARY_CHEQUING>", reference_number, description, transactions:[<THE FULL vendor_transaction object from list-unpaid-by-vendor-account, plus `transaction_payment_amount`>], payment_amount}`** → 200. The earlier "must be greater than $0.00" was because each `transactions[]` entry needs the FULL txn object incl. **`transaction_payment_amount`**, not a bare `{id,amount}`. UI to capture a fresh method key: tick **`checkbox_transaction_{txnId}`** → **`button_new_payment`** → **`select_payment_method`** + **`input_payment_amount`** (prefills from the ticked invoice) → **`button_make_payment`**. After full payment the invoice **leaves the Unpaid list** (settled $0.00, no residual cent). **A PAID delivery refuses editing:** `deliveries/change-item` → `"Cannot edit a delivery item that has already been paid. Delete payment before editing."`
- **Vendors list** = `GET /api/parts-catalogue/vendors` (vendor objects carry NO tax config — vendor tax is entered at receive time). **Categories** = `GET /api/inventory/categories` (`{value,label}`). A transient **"Invalid parameter type" toast** shows on the Vendor-Invoices / Unpaid-Invoices list pages on this build; it does not affect the figures (consistent across every screen).

