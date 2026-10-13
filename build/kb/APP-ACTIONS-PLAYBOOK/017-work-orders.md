## WORK ORDERS

### Create a WO
- **UI path:** Top nav → Work Orders (`/workorders`) → **New / New Work Order** button → New Work Order dialog (Customer selector + Asset selector) → Create.
- **API:** `POST /api/work-orders/` (create). Dialog offers inline **Add** buttons for Customer and Asset that open working create forms.
- **Preconditions:** `workOrdersView` + `workOrdersCreateAndEdit`. Customer selector lists customers even when `customersView` is OFF (feature-access vs data-access).
- **Gotcha/Unblock:** `work-orders/create` returns **HTTP 500 in some sessions** — reuse an existing record or create via the UI. Custom Quasar dropdowns for Customer/Asset resist automation; the New WO dialog's Add-Customer/Add-Asset buttons are **NOT gated** by `customersCreateAndEdit` (they appear and function regardless — a known FE-gating gap). **Create fresh** whenever you need to reach a WO detail page.
- **Confidence:** Medium (dialog + affordances confirmed; full automated save flaky).

### Open / navigate a WO
- **UI path:** Work Orders list → click a row → WO detail `/workorders/{id}/lines`.
- **API:** `GET /api/work-orders/view/{id}` · `GET /api/work-orders/lines/{wo}` · list `GET /api/work-orders` / `GET /api/work-orders/simple-list`.
- **Gotcha/Unblock:** **Existing-WO detail bounces back to `/workorders` on mount for every role (incl. admin).** Deep-links and row-clicks both bounce. **Workaround: create a fresh WO** — only freshly-created WOs reliably land on the detail/lines page — then run line/part/finance actions there.
- **Confidence:** High (bounce reproduced across all roles).

### Add a line
- **UI path:** WO detail → Lines tab → **New Line** button → New Line dialog (includes "AI - SHOPCOACH LINE BUILDER" entry).
- **API:** `POST /api/work-orders/lines/create`. Canned-line pick source: `GET /api/work-orders/canned-lines` **(verify — not evidenced in artifacts; the `/canned-lines` seen is the Service-settings SPA route)**.
- **Preconditions:** `workOrdersView` + `workOrderLinesCreateAndEdit` (New Line button + ShopCoach builder are gated by `workOrderLinesCreateAndEdit`; hidden when OFF).
- **Gotcha/Unblock:** `work-orders/lines/create` can return **HTTP 500** in some sessions. Line persisted end-to-end when created via the New Line dialog (Lines count incremented).
- **Confidence:** High (line added + persisted).

### Change a line's status (approve / authorize a line)
- **UI path:** WO detail → Lines grid → per-line **Approve** button (or bulk **Set line status**).
- **API:** `POST /api/work-orders/lines/change-status` body `{line_id, status:'authorized', workOrderId}` → **200**. Status advances `authorization_required` → `authorized`.
- **Preconditions:** line in an approvable state; `workOrderLinesCreateAndEdit`.
- **Confidence:** High (executed, 200).

### Bulk line status change
- **UI path:** WO detail → Lines grid → select lines → bulk-action menu (**Set line status | Delete lines | Split work order**) → Set line status.
- **API:** `POST /api/work-orders/lines/change-lines` → **201** (body `{data:[]}` on success). Bulk-complete works even for another tech's line (SV-8042 own-data bypass — needs manual confirm with default Technician role).
- **Confidence:** High (executed, 201, from SV-4112).

### Delete a line
- **UI path:** WO detail → Lines grid → select line → bulk-action menu → **Delete lines**.
- **API:** `POST /api/work-orders/lines/delete-lines` → **200**. Guard: `POST /api/work-orders/lines/check-delete` **(verify — endpoint named in task, not evidenced)**.
- **Preconditions:** `workOrderLinesDelete`. **A line is deletable in any status EXCEPT Complete.**
- **Confidence:** High for delete-lines (executed 200, Lines count decremented); (verify) for check-delete guard.

### Approve / authorize a WO (send for approval)
- **UI path:** WO detail → approvals / Send-to-Portal action.
- **API:** `POST /api/work-orders/approvals/create-approval-request`.
- **Gotcha/Unblock:** This `create-*` endpoint returns **HTTP 500 for BOTH Office and Admin** in-session (the create-* session quirk) — a clean 403 could not be isolated. WO/line status ladder: **Uncomplete / Approved / Authorized / Complete**.
- **Confidence:** Medium (endpoint mapped; 500 quirk observed).

### Uncomplete a WO, then delete it
- **UI path:** WO header three-dot menu → (Uncomplete) → then Delete Work Order.
- **API:** `POST /api/work-orders/delete` body `{work_order_id}`. **Move the WO to Uncomplete first** — delete requires it.
- **Preconditions:** `workOrdersDelete`. Without it: header menu shows only Audit Log/Timesheets (no Delete) **and** the endpoint returns **403 "Access denied."** (verified for Parts Manager).
- **Confidence:** High (403 gating confirmed; Uncomplete-first rule documented).

### Edit WO header / change service advisor
- **UI path:** WO detail → header fields / service-advisor selector.
- **API:** `POST /api/work-orders/change-service-advisor`.
- **Gotcha/Unblock:** FE hides it for Technician, but the **backend does NOT enforce it** — a Technician POST to `change-service-advisor` actually changed the field (FE-only display gate). Expected-denial cases must be verified in the **UI**, not by the endpoint.
- **Confidence:** High (FE-only gate proven).

### Edit asset fields on a WO (mileage / engine hours / plate / VIN)
- **UI path:** WO detail → vehicle/asset fields (VIN via **Edit Vehicle** form).
- **API:** `POST /api/work-orders/change-mileage` · `.../change-engine-hours` · `.../change-licence-plate` (all → **201**); VIN via `POST /api/vehicles/change` → **201**.
- **Confidence:** High (all four executed + persisted).

### Complete the Review step (why it blocks Create Invoice)
- **UI path:** WO detail → Review action (surfaces when the WO is in a reviewable state).
- **Gotcha/Unblock:** An **unclicked Review button blocks Create Invoice.** Create Invoice only enables after Review is complete (WO moved Approved → Reviewed → Complete). The Review action's visibility is gated by the `woReviewWorkOrders` sub-toggle.
- **Confidence:** High (Create-Invoice prereq confirmed across roles).

---

