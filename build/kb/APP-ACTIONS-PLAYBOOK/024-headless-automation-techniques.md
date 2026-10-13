## HEADLESS-AUTOMATION TECHNIQUES

When the Quasar/Vue SPA resists normal clicks, escalate in this order (proven across runs):

1. **Selector click** (normal Playwright click).
2. **Fire the element's own click handler / `dispatchEvent`** (dispatch a synthetic `click`/`input`/`change` on the DOM node).
3. **Bounding-box coordinate click** (click the element's screen coordinates).
4. **JS set value + dispatch `input`/`change`** (for inputs the framework won't fill).
5. **Keyboard** entry.
6. **If truly undrivable, call the EXACT endpoint the button calls** — but **only after confirming the FE gate/dialog was reachable** — and disclose that you did so. **Never mark PASS on gate presence alone.**

**Known session quirks to expect and route around:**
- **`create-*` endpoints return HTTP 500 in some sessions:** `work-orders/create`, `work-orders/lines/create`, `customer-account/create-customer-payment`, `work-orders/approvals/create-approval-request`. Reuse existing records or create via the UI.
- **Existing-WO detail bounces to `/workorders`** on mount for all roles — create a fresh WO to land on detail.
- **`/parts/part-sales` route is flaky** (goto never reaches domcontentloaded; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. Retry or hit `POST /api/part-sales` directly.
- Undrivable widgets seen: the Quasar rich-text editor, the inline parts grid, confirmation buttons, custom Customer/Asset dropdowns, virtualized report rows, calendar day/resource cells.
- **Enforcement reality:** the backend enforces only **resource-level View/Edit**. Granular perms (Delete, WO sub-perms, cross-toggles, view_mode) are **FE-only display gates** — expected-denial cases must be verified in the **UI** (endpoint often returns 400 validation, not 403); backend-enforcement cases hit the endpoint and check **403 vs 200/201**.

