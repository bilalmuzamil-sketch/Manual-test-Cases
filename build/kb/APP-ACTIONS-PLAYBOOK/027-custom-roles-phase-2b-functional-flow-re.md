## CUSTOM ROLES — Phase 2b functional-flow recipes (staging, proven 2026-07-09)

- **Reach a WO detail in headless (bounce fix):** direct-mount `/workorders/{id}/lines` bounces/hangs.
  Land on `/workorders` (list), then in-SPA nav: `page.evaluate(()=>{history.pushState({},'',
  '/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))})` → detail loads (no bounce).
  Close the auto New-Line dialog via `.q-dialog i:text("close")`. Finance tab: `[data-test-id=link_finance_tab]`.
- **WO tax (Financial Info card):** `POST /api/work-orders/{id}/tax {id:<taxId>}` sets the WO tax
  (Total recalcs); `POST .../{id}/tax {}` (empty) = the X reset → reverts to default customer/location tax.
- **Taxes CRUD:** `GET /api/taxes` (collection; rates[]); `POST /api/taxes {name,isEnabledLabor,
  isEnabledParts,isEnabledShopSupplies,rates:[{name,percentage}]}` (201, multi-rate OK, sums rateTotal);
  update `POST /api/taxes/{id}` (same body); `DELETE /api/taxes/{id}` (204). **Toggling a tax's
  isEnabledParts / isEnabledShopSupplies directly controls parts / shop-supplies tax on the invoice**
  (proven on the estimate: parts on=$2.82/off=$0.00; shop-supplies on=GST$11.05/off=$10.00).
- **Estimate/invoice doc:** `POST /api/work-orders/invoices/estimate {work_order_id,type:'html',
  issue_date,due_date}` → HTML with tax breakdown. NOTE: it reflects the tax CONFIG + customer/location
  default; the per-WO `/tax` override shows in the Financial Info UI but the estimate used the default.
- **Split a WO:** `POST /api/work-orders/split {work_order_id, ids:[lineIds]}` → 201 `{data:{id:newWO}}`.
  Moves the picked lines to a new WO; history logs `work_order.split_to` (source) + `work_order.split_from`
  (new). WO history: `GET /api/work-orders/{id}/history` → `{data:[{eventType,eventName,...}]}`.
- **Part requests:** add `POST /api/work-orders/part/make-request {line,work_order,description,quantity,
  part_source_type:'inventory'|'vendor',part_number,sell_price,cost,part_category_id}` (201; category
  REQUIRED; categories `GET /api/inventory/categories` {value,label}). Edit `POST .../part/change-request
  {id, description|quantity|part_number|part_source_type}` (200; switching source vendor→inventory locks cost).
- **Edit a line / tech story:** `POST /api/work-orders/lines/change {line_id,work_order_id,tech_story,
  lineName,line_name,labour_type_id,total_labour_time,fixed_price}` (needs lineName). On an **invoiced WO
  the line has `editable=false`** (read-only). (This change endpoint 500s on some lines.)
- **Change customer on WO:** `POST /api/work-orders/change-customer {work_order_id,company_id,
  customer_id:<contactId>}` → the WO vehicle becomes associated with the new company (many-to-many; the
  vehicle must be unlinked `POST /api/vehicles/delete {vehicle_id,company_id}` before that company can be deleted).
- **Return validation:** `POST /api/work-orders/part/make-return-request {part_id,quantity,return_reason}`
  → negative/zero quantity rejected ("value should be >= 0.01").
- **PO item edit before receiving:** `POST /api/inventory/orders/change-item {order_id,item_id,
  part_number,quantity_ordered,price,category,description}` (200). Cost validation is FE-only (BE accepts negative).
- **Vendor CRUD:** `POST /api/parts-catalogue/add-vendor {name,email,tax_id,credit_term,credit_limit}`
  (201; tax_id + credit_term + credit_limit required); `POST .../remove-vendor {id}` (201). Vendor list caps
  at 100 — use `?search=` to find newly-added (Z-name) vendors.
- **Department clock (timesheet):** `POST /api/technician-tasks/department-clock-in {department_id}`
  → 201 `{technician_task_id}`; clock-out `POST .../department-clock-out {task_id,description}` → completes
  with no error (SV clock-out regression fixed). Departments: `GET /api/departments`.
- **IBS:** connect `POST /api/ibs/settings/credentials {clientId,clientSecret,baseUrl}` → isConfigured/
  isActive true (masked id); status `GET /api/ibs/settings`; disconnect `POST /api/ibs/settings/disconnect`.
  **IBS Multi-Tenancy (workplace IBS Location ID field + Remit-To card) requires a feature flag NOT enabled
  on staging** (org flag list: `GET /api/organization/feature-flags?organization_id={org}`).
- **Digital Inspections builder:** DigitalInspections flag ON. New Template makes **no API call on open**
  (deferred). Save Draft = `POST /api/inspection-templates` (create) + `PUT /api/inspection-templates/{id}/draft
  {name,description,isSignatureRequired,sections:[{id?,name,position,fields:[{type:'checkbox',label,position,
  isRequired,config:{labels:{na,fail,pass}}}]}]}`. Publish `POST .../{id}/publish` (blocks: "Template name is
  required" / "At least one section is required"). Delete only never-published (`DELETE`); published → `POST
  .../{id}/archive`. Reorder = re-PUT with new `position` values (persists). Editor reached via Settings sidebar
  → Inspection Templates → New Template (admin pages need sidebar nav, not direct URL).
- **Deposits (flag ON):** WO Finance → Add Deposit → "Create Deposit" modal (Deposit Date [defaults today],
  Payment Method [required], Deposit Amount, Reference Number, Memo; Submit Deposit / Cancel).
- **Issue Credit:** WO invoice ⋮ → Issue Credit → parts-only picker ("Parts to return"; labor not selectable;
  Outcome = Store Credit / Refund). **create-customer-payment 500s in some sessions** (blocks payment/credit submit).
- **Bin count link:** Settings → Bin Locations (`/administration/bins`) → click a row's Inventory-parts count
  → `/parts/inventory?binLocation={bin}` (filtered).
- **qb (SV-7387) env SLEEP/WAKE:** the env auto-sleeps (API + `/api/quick-login` 302 →
  `sleep.qa.shopview.com`). Wake it yourself: `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv`
  body `{"action":"wake","env":"sv7387"}` (lambda answers "sv7387 is waking up."), then poll the API ROOT `https://sv7387api.qa.shopview.com/`
  until 200 (~60s; it passes 503 while booting). Root `/` returning 200 `{"data":[]}` = awake.
- **qb "sustained 500 incident" ROOT CAUSE = poisoned shared PHPSESSID (batch-6 proven):** when every `/api/*`
  request 500s with a requestId but the API root is 200, the backend is fine — the SESSION is corrupt. Fix:
  re-run `POST /api/quick-login {key:'admin'}` **WITHOUT sending the old PHPSESSID** (keep sv_sso_session +
  cf_clearance) → 200 + fresh PHPSESSID → everything 200 again. Diagnostic ladder: no cookies → 401; sso+cf only
  → 409; poisoned PHPSESSID → 500 on everything. **Avoid `POST /api/iam/change-location`** (prime suspect
  trigger in batch-5 AND batch-6; admin default_workplace is already Lethbridge = the QB location).
- **Invoice a WO (qb):** WO must be status `complete` AND have ≥1 completed line. Walk statuses with
  `POST /api/work-orders/change-status {id:<woId>,status:'approved'|'in_progress'|'ready_for_review'|'complete'}`
  (key is `id`, NOT work_order_id), then `POST /api/invoices/create {work_order_id,issue_date,due_date}` → 201
  `{invoice_id,customer_account_id,remaining_balance,…}`; WO becomes `Invoiced`; QB export fires automatically
  (failures land in `GET /api/bookkeeping/unexported-items`; clear own junk with `POST …/unexported-items/{id}/mark-done`).
  Undo with `POST /api/invoices/reverse-invoice {invoice_id}`.
- **WO line creation is BROKEN on qb (2026-07-09/10):** `POST /api/work-orders/lines/create` AND
  `POST /api/work-orders/{id}/lines/create-from-canned-line` 500 on every WO/payload (labour_type/fixed_price
  variants too; `fixed_price:0` and valid payloads alike). Blocks building fresh invoiceable WOs — reuse existing
  complete WOs (e.g. S-15895/S-15894, 1 completed line each) with add→observe→restore deltas.
- **Over-discount floor observables (API):** `work_order.adjustmentsSummary.excessCreditAmount` carries the
  floored-off excess exactly (e.g. discount 1265 on sub 1214.81 → 50.19); `sub_total` floors to "0.00"; a
  NON-taxable over-discount leaves `tax.amountTotal` unchanged (customer still owes tax); a TAXABLE one zeroes it.
  The Add-dialog live preview shows the floor ("New work-order subtotal $0.00 / Tax is recalculated on save")
  but there is NO warn/confirm on save (FDBUG-15).
- **WO Add Fee/Discount dialog (UI automation):** toolbar `button:has(i:text("more_vert"))` → menu item
  "Add Fee/Discount". Dialog selects order: [0]=Apply From Template (readonly combobox — don't fill), [1]=Type
  (Fee/Discount), [2]=Calculation Type. Name = first `input:not([readonly]):not([type=number])`; Amount =
  `input[type=number]`. Submit label = "Add Fee"/"Add Discount".

