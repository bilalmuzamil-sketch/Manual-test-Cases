## FEES & DISCOUNTS (qb env, proven 2026-07-08)

### Env / navigation (qb.qa.shopview.com, API sv7387api.qa.shopview.com)
- **In-SPA navigation that works:** land on any working page, then `page.evaluate(() => { history.pushState({}, '', '/customers/{id}/default-adjustments'); dispatchEvent(new PopStateEvent('popstate')); })` — vue-router follows popstate. Customer detail route is **`/customers/{id}`** (NOT `/customers/view/{id}`); tabs append `/work-orders`, `/default-adjustments`, etc. `/workorders/{id}/lines` deep-links fine on qb (no bounce).
- **A 0-line WO auto-opens the persistent New Line dialog** — close it via its `i:text("close")` X icon (Escape does NOT close Quasar persistent dialogs; click Cancel/X) before touching tabs; or JS-click the tab: `document.querySelector('[data-test-id=link_finance_tab]').click()`.
- Admin templates page: Administration → **FINANCE → Fees & Discounts** → `/administration/adjustment-templates` (FE-gated `settingsFinance`). Customer defaults route FE-gated `customersCreateAndEdit`+`seeApArData`.

### Seed a testable WO end-to-end (proven)
1. `POST /api/customers/create {name}` → company_id (NOTE: API-created customers do NOT inherit auto-apply templates as defaults; UI-created do).
2. `POST /api/contacts/create {company_id, first_name}` → contact_id.
3. `POST /api/vehicles/create {company_id, customer_id:<contact_id>, unit}` (customer_id = CONTACT id).
4. WO via **UI** (raw `work-orders/create` 500s): customer page → Work Orders tab → wait `[data-test-id=button_new_work_order]` ENABLED (disabled while list loads / when customer has no asset) → asset q-select = 2nd `.q-select` in dialog → Save. Payload it sends: `{company_id, customer_id:<contact>, vehicle_id, type:'service', is_vehicle_here:true,…}`.
5. Labor line with KNOWN price: New Line → first `.q-select` → pick canned line **"(L) CVIP - Light Duty Truck - Wheels On"** (fixed **$265.00**) → Save & Close (`POST work-orders/{id}/lines/create-from-canned-line` 201). Shop supplies auto-adds 10.5% ($27.83 on $265).
6. Cleanup: `work-orders/delete {work_order_id}` → `vehicles/delete {vehicle_id, company_id}` → `contacts/delete {customer_id:<contactId>, company_id}` → `customers/delete {company_id}` (contacts+vehicles must go first: "Company with a customer cannot be deleted").

### Adjustments API (full contract, proven)
- Templates: `GET/POST /api/adjustment-templates`; `POST /api/adjustment-templates/{id}/change`; `DELETE .../{id}`; `GET .../{id}/delete-precondition` → `{affectedCustomerCount}`. Fields `{name,kind:fee|discount|processing_fee, calculationType:flat|pct_labor|pct_parts|pct_subtotal|pct_grand_total, defaultAmount, defaultMaxCap, autoApply, taxable, description}`.
- WO: `POST /api/work-orders/adjustments/add` `{workOrderId,kind,name,calculationType,amount,maxCap,scope:whole_wo|labor_line|part_line,targetId,taxable,templateId,description}`; `/change` accepts ONLY `{adjustmentId,name,amount,maxCap,taxable}` (kind/calc immutable); `/remove {adjustmentId}` → 204. Processing fee: manual add → 400 "cannot be added manually"; change → 409.
- Reads: whole-WO adjustments + `adjustmentsSummary{...,excessCreditAmount}` in `work-orders/view/{id}`; **line-level adjustments live under each line** in `work-orders/lines/{woId}` `collection[].adjustments` (NOT in the WO view).
- Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments` (POST `{templateIds:[…]}`, array OK). Mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status`.
- Line status enum for billability tests: `authorization_required | authorization_declined | authorized | complete` (`work-orders/lines/change-status {line_id,status,workOrderId}`); declined → adjustments resolve $0, authorize → restore.

### Quasar dialog driving (F&D dialogs)
- Selects: click `.q-dialog .q-select` by INDEX (labels wrap the whole dialog — never click `label:has-text()`); options in `.q-menu .q-item`. Inputs: `input.q-field__native` by index (name first, amount second); template `input[name=adjustment_template_name]` maxlength=100; WO dialog name `input[name=adjustment_name]`.
- Toasts: poll `.q-notification` innerTexts for ~3s.
- Line-row ⋮ menu: hover then **mouse-click ~50px right of `[data-test-id^=button_line_expand_]`** (the button has no test-id; retry loop — flaky), menu = Request part | Add line note | Add Fee/Discount | Save as canned line | Story history | Audit log | Add inspection | Edit labor. Card entries: `[data-test-id^=button_adjustment_actions_{adjustmentId}]` → Edit | Remove.
- Estimate document renders INLINE on the WO **Finance** tab (`link_finance_tab`) — full doc text incl. Adjustments block readable from body innerText.

### qb env cautions (working fixes)
- **Shared env with active concurrent users** — they toggled autoApply and deleted ZZAUTOTEST templates mid-run. Fix: re-read state via API before every assertion; keep test data self-contained; re-verify baselines right before use.
- Tech quick-login on qb is **FLAKY**: 403 in recon/pass B but **200 in the same-day pass A** (which used it to prove whole-WO adjustment add is FE-only enforced while templates admin is BE-403). Retest `{key:'tech'}` at the start of each run before assuming it's blocked.
- `New Work Order` button stays disabled until the customer has ≥1 asset AND the tab list finished loading — poll `isDisabled()`.

---

