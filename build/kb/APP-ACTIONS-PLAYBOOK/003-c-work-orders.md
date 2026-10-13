## C. Work Orders
- **Create WO (API):** `POST /api/work-orders/create {company_id, vehicle_id, workplace_id,
  start_date, is_vehicle_here:true}` → 201. **`is_vehicle_here:true` is REQUIRED.** Customer defaults
  auto-apply fees on new WOs (`appliedBy=customer_default`). **Gotcha:** create can 500 in some staging
  sessions → create via the UI instead (UI recipe: `/workorders` → New → pick Customer + Asset →
  Save → Confirmation "over credit limit" → Create). *Source: CLAUDE.md, UI-seeding appendix 2026-07-15.*
- **🔑 `seeFinancialData` IS A CROSS TOGGLE, NOT A PERMISSION — that is why adding it to
  `fe_permissions` silently does nothing** (cost two failed attempts, 22 September 2026). A role's
  body carries **`cross_toggles: {seeFinancialData, seeApArData, viewHistoryLogs}`** as booleans
  alongside `fe_permissions`. Grant it with
  `PUT /api/roles/{id} {…, cross_toggles:{...orig.cross_toggles, seeFinancialData:true}}` → the role
  then reports `seeFinancialData` **inside `fe_permissions` on read**, which is what makes the trap so
  convincing. **Part Sales depend on it:** `partSalesView` alone shows no Part sales group in search;
  with the toggle on, the group appears — the QA lead confirmed 2026-09-20 that the tie is intended.
  Restore the toggles explicitly, not just the permission list.
- **🔑 SET A VEHICLE'S MAKE, MODEL AND UNIT — `POST /api/vehicles/change {vehicle_id, company_id,
  customer_id, unit, year, vehicle_maker_id, vehicle_model_id, vin}` → 201.** It is **`vehicle_id`**
  (not `id`), **`unit`** (not `unit_number`), and make/model are **ids**, not free text —
  `GET /api/vehicle-makers` lists 100 (there is no `/api/vehicle-models`; borrow
  `vehicle_maker_id`/`vehicle_model_id` off an existing vehicle via `GET /api/vehicles`). **Create
  silently ignores make/model/unit**, so a freshly created pair is indistinguishable on screen — create
  then `change`. Proven seeding C55709.
- **⛔ A PURCHASE ORDER'S STATE CANNOT BE SET DIRECTLY, AND VENDOR-INVOICE PAYMENT IS NOT EXPOSED on
  `sv9160`** (six routes tried 22 September 2026): `orders/change-status`, `inventory/orders/change-status`,
  `orders/{id}/status`, `inventory/orders/change` all 404/405; `/vendor-invoices` as a page is a **404**
  on this build; the invoice's own page (`/parts/delivery/{id}`) carries **no payment control and never
  mentions payment**. The only route to *received* is the full goods-receiving flow (§C above), and
  paid/unpaid comes from the accounting side. Record this as a **proved environment limit**, not as
  something untried.
- **🔑 TEST A PERMISSION WITHOUT A SECOND LOGIN — IMPERSONATE, THEN EDIT THE ROLE** (proven live on
  `sv9160`, 22 September 2026; the QA lead authorised role edits on the QA branch).
  **(1) A restricted session:** `POST /api/switch-user {user_id}` with an **active** staff id from
  `GET /api/staff?limit=200` (each row carries `is_active`, `role_label`, `role_id`). An **inactive**
  user answers 400 *"Cannot impersonate an inactive user"* and some answer 403 — walk the list until
  one returns 200. **Switch BACK with the same call** using an active Admin's staff id; no re-login is
  needed, so one browser can alternate all night. ⚠️ **The `tech` quick-login on `sv9160` is an
  ADMINISTRATOR** (`template_slug: administrator`, 57 permissions) — judge by `template_slug`, never by
  the button you pressed.
  **(2) Read a role:** `GET /api/roles/{roleId}` → 200 `{id,name,description,default,editable,deletable,
  fe_permissions:[{id,name,code}],template_id,view_mode,cross_toggles}`. `GET /api/roles` is **405**
  (POST-only) and the settings screen for roles is a **404** on this build, so there is no list — take
  `role_id` off the staff rows. `GET /api/role-templates` → the eleven templates.
  **(3) Write a role:** **`PUT /api/roles/{roleId}` with `fe_permissions` as an array of permission
  IDs** → 200. Echoing the objects back gives a **500**; `POST /api/roles/{id}`, `/change` and
  `/update` are **405/404**; creating a copy with `POST /api/roles` is a **500**. Build the id
  catalogue by reading every distinct `role_id` on staff (58 codes on this branch).
  **(4) ⚠️ SOME PERMISSIONS ARE PUT BACK BY THEIR SIBLINGS.** Removing **`workOrdersView`** alone
  silently returns it — `woPickParts`, `workOrderLinesCreateAndEdit`, `woTechViewMode` and
  `scheduleView` imply it. To take work orders away, remove the **whole family**. Always **read the
  role back** after a write and check the code you removed is actually gone, or the phase proves
  nothing. Likewise **`partSalesView` on its own does not surface Part Sales** — part sales are tied to
  `seeFinancialData` (the QA lead confirmed this is intended), and `seeFinancialData` did not persist
  on its own either.
  **(5) RESTORE AND READ BACK after every phase**, and save the original role to disk BEFORE the first
  write (`build/global-search/rerun-2026-09-21/ORIGINAL-technician-role.json`) so any session can put it
  back. Verified restored exactly after all seven phases.
- **🔑 CREATE A VEHICLE / ASSET — `POST /api/vehicles/create` needs BOTH `company_id` AND
  `customer_id`, and `customer_id` is a CONTACT id, not the company's** (learned 2026-09-21 from the
  refusals). Sending the company id as `customer_id` gives `{"customer_id":"Not found"}`; omitting it
  gives `Missing required parameter`. Make a contact first — `POST /api/contacts/create {company_id,
  first_name, last_name, email}` → 200 `{contact_id}` — then `POST /api/vehicles/create {company_id,
  customer_id:<contact_id>, year, vin, …}` → 200.
  **⚠️ INCOMPLETE ROUTE, DO NOT TRUST IT FOR A FIXTURE:** `make`, `model` and `unit_number` are
  **silently ignored** on create — the record comes back with `make`/`model` null and no unit, so the
  search row reads only the year and the owner and two such vehicles are **indistinguishable on
  screen**. `POST /api/vehicles/change` wants **`vehicle_id`** (not `id`) — untested beyond that. The
  existing vehicle shape uses **`unit`** (not `unit_number`) and `vehicle_maker_id` / `vehicle_model_id`
  rather than free text, so a usable asset fixture probably has to be built **through the vehicle
  screen**. Cost the night of 2026-09-21: C55709 left Blocked rather than judged on a pair that could
  not be told apart.
- **🔑 MOVE A WO OUT OF `Estimate` — `POST /api/work-orders/change-status {id, status:'approved'}` → 201
  (learned 2026-09-21 from the refusals, Rule 107 route 2).** **`work_order_id` is the WRONG field name
  here** — the 400 reads `{"id":"Work Order ID is missing."}` — and the status must be the lowercase
  **`value`**, not the label: `GET /api/work-orders/statuses` → `{value:'approved', label:'Approved'}`.
  Sending `status:'Approved'` gives `{"statusValid":"Wrong status name"}`, and sending `status_id`
  gives a **500**. Values: `estimate · approved · in_progress · ready_for_review · complete ·
  invoiced · paid`.
  **WHY IT MATTERS FOR SEEDING A RANKING FIXTURE:** `POST /api/work-orders/create` lands the WO in
  **`Estimate`**, and an Estimate does **not** count towards a customer's `openWorkOrderCount` in
  search — the count stays 0 and the fixture silently proves nothing. Approve it, then allow ~20s for
  the search index. Proven live on `sv9160` seeding C55722.
- **🔑 GIVE A PART A REAL "recently used" DATE** (the §6.1 sales-frequency signal, ledger origin
  `WorkOrderPartPick`): create + approve a WO → `POST /api/work-orders/{woId}/lines/create-from-canned-line
  {canned_line_id, status:'authorized'}` (→ `data.line_id`) → `POST /api/work-orders/part/make-request
  {line, work_order, description, quantity, part_source_type:'inventory', part_number,
  part_category_id, cost, sell_price, inventory_part_id}` → 201. The part's `lastSoldAt` is set within
  ~20s and its on-hand drops by the quantity. Proven live seeding C55712.
- **Delete WO:** `POST /api/work-orders/delete {work_order_id}`. **Move the WO to Uncomplete first**
  (a Complete WO → 400 "Completed work order cannot be deleted"). On staging, WO delete can be
  UI-only (top ⋮ → Delete Work Order) if the API 404s.
- **List / read:** list `GET /api/work-orders` / `GET /api/work-orders/simple-list`; detail
  `GET /api/work-orders/view/{id}` (carries `adjustments[]`, `adjustmentsSummary`, `editable`,
  `deletable`); lines `GET /api/work-orders/lines/{woId}`.
- **Vehicles:** `GET /api/vehicles?company_id={id}`; create `POST /api/vehicles/create
  {company_id, customer_id:<CONTACT id>, unit}`; VIN edit `POST /api/vehicles/change` → 201.
- **Existing-WO detail bounces to `/workorders` on mount (all roles incl. admin)** — create a FRESH
  WO to reliably land on `/workorders/{id}/lines`, or in-SPA `history.pushState` + dispatch
  `popstate` (see UI automation). *Source: CLAUDE.md, Navigation Map below.*

