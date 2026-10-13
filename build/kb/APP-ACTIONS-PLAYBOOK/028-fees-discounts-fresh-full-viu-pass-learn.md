## FEES & DISCOUNTS — fresh full-VIU pass learnings (qb env, proven 2026-07-10)

- **`POST /api/work-orders/create` now works via raw API on qb (201)** — the old "create-* 500" quirk
  cleared for WO create; **`lines/create` + `create-from-canned-line` still 500 on every payload**
  (a bare invalid payload 400s first at validation — a 400 does NOT mean the bug is fixed; test with
  a VALID `fixed_price` payload). Existing Complete WOs stay the fallback (add→observe→remove→restore).
- **Complete WOs are terminal:** `work-orders/delete` → 400 "Completed work order cannot be deleted"
  AND `change-status` → 400 "Complete work order cannot change its status again" — there is NO
  uncomplete path on qb. Never walk a throwaway WO to Complete; leave it in estimate so it stays deletable.
  Part requests are also locked ("Part requests can`t be modified on completed line") and a line with
  staged parts refuses status changes ("Can`t change status while there are staged parts").
- **`reverse-invoice` payload key is `{id:<invoiceId>}`** (`{invoice_id}` → 400 missing-parameter).
- **Read a WO's customer credit:** `invoices/create` response carries `customer_account_id`; then
  `GET /api/customer-account/list-unpaid-transaction?account_id={customer_account_id}` (param IS
  `account_id`) → `response.unpaid_transactions_count` + `groupByDueDateData.current`. An invoiced
  over-discount shows up as count+2 (invoice + credit) and the credit amount lands negative in
  `current` (proven: excess 117.24 → current −11.63→−119.73 with a 9.14 invoice).
- **QB mapping read/restore:** `GET /api/bookkeeping/integration` returns every settings option with
  its `selected` value (snapshot this BEFORE any settings write; Fee item = key `feeItemId`, Discount
  = `discountItemId`). Writes go `PUT /api/bookkeeping/settings {settings:{...}}` (flat body → 400
  "settings missing"). **Unmapping is NOT possible via API** — `{settings:{feeItemId:null}}` → 500 and
  the mapping stays untouched; the FD-QB-004..008 guard cycle needs a dev/QB-side unmap.
- **Estimate HTML full-text:** the shared `api()` helper truncates non-JSON bodies to 500 chars — for
  `POST /api/work-orders/invoices/estimate` use a direct `fetch` and read `res.text()` (strip tags for
  assertions). The doc's bottom block reads `Subtotal $X / GST (5%) $Y / Total $Z` and 2026-07-10
  matched the API view exactly (adjustments INCLUDED — FDBUG-1 not reproduced, 3rd clean pass).
- **WO shop supplies:** `POST /api/work-orders/change-shop-supplies-charge {work_order_id,
  shop_supplies_charge}` (201) — computes on LABOR, so a parts-only WO stays $0 (can't surface the
  Shop Supplies doc section there).
- **Contacts have NO list endpoint** (`GET /api/contacts*` 404s; the SPA contacts tab makes no list
  call) — `contacts/create` returns `{data:{contact_id}}`: **SAVE that id at creation** or the company
  becomes undeletable ("Company with a customer cannot be deleted").
- **Part sales:** `POST /api/part-sales {company_id}` → 200 `{data:[{id}]}` (ARRAY). Story-11 check
  2026-07-10: the part-sale page still has NO Fees & Discounts column; `adjustments/add` against a
  part-sale id → 400 needs-target (no part-sale adjustment surface). Delete route: `DELETE
  /api/part-sales/{id}` answered 404 yet the sale vanished from the list right after (verify).
- **Template builder (fresh 2026-07-10):** dialog title is now "New Fee / Discount" (matches spec);
  Type options still only Fee|Discount (Story 8 UI missing); 4 calc methods (no legacy % Labor+Parts).
- **Role drift on shared envs is real:** the qb Technician role gained `workOrdersCreateAndEdit` +
  `workOrdersDelete` between 2026-07-09 and -10 (8 perms vs the matrix's 6) — re-read
  `GET /api/auth/me/fe-permissions` at run start and re-derive any per-role matrix before reuse.
- **NEW FDBUG-16 (probe carefully):** `adjustments/add` with an EMPTY name now 201s at the API (was
  400); the UI dialog still blocks with an inline Name-required error — FE-only guard.

