# Simple Flow — Build-Accurate Label Glossary (live sv7301) — 2026-07-13

> Exact on-screen labels captured live from `https://sv7301.qa.shopview.com` during
> the combined build-accurate-wording + VIU pass (2026-07-13). Used to rewrite the
> tester-facing case fields (Title / Preconditions / Steps / Expected) to the real
> build terms in plain layman language. Screenshots in
> `screenshots/wording-2026-07-13/`. Secrets never here (cookies live in `/tmp`).
> One section per area, appended as each area is processed.

---

## SF-SET — Work Order Settings (`/administration/settings` → **Work Orders** tab)

Screenshots: `SET-01-settings-workorders.png` (lands on Organization tab),
`SET-workorders-tab.png` (Work Orders tab, all toggles + helper text).

**Left settings nav (exact section headers):** SETTINGS · SERVICE · PARTS ·
INTEGRATIONS · FINANCE · IMPORTS. Under SETTINGS: Settings, Staff, Roles &
Permissions, Locations, Departments, Taxes.

**Settings page top tabs (exact):** `Organization` · `Invoice` · `Work Orders`.
(The settings page opens on **Organization** by default; click the **Work Orders**
tab to reach the Simple-Flow toggles.)

**Work Orders tab — exact toggle labels, in the exact top-to-bottom order shown,
with their exact helper text:**

1. **Auto-approve Lines** — "New work order lines are created already approved,
   skipping the line approval step"
2. **Require Vendor Invoice Number** — "When on, parts and a vendor invoice number
   are required to complete a work order. When off, complete now and receive parts
   later."
3. **Require Review Before Completion** — "Work orders must be reviewed and signed
   off before they can be completed"
4. **Require Tech Story** — "Tech story will be a required field before a line can be
   completed on a work order"
5. **Require Mileage** — "Mileage will be a required field before a line can be
   completed on a work order"
6. **Require Engine Hours** — "Engine hours will be a required field before a line
   can be completed on a work order"
7. **Automatically Pick Inventory Parts** — "Inventory and found parts will
   automatically skip the pick step and go straight to staged when authorized"

**Save button (exact):** `Save Settings`.

**Confirmed ABSENT on the Work Orders tab (build facts, 2026-07-13):**
- No operating-mode / **Full vs Simple** selector anywhere on the page.
- No **Create Purchase Orders** toggle (spec S1-R2 expects one; build lags — deviation).
- No **Require VIN** / VIN-required toggle (the model holds `requireVehicleIdentifier`
  / `vehicleIdentifier:"vin"` but it is **not** exposed as a Work Orders toggle).
- No visual "new vs existing" distinction between toggles — they render as one flat
  list (spec S1-R1 wanted new toggles visually distinct; not present in build).

**Settings model (`GET /api/organizations/settings`) exact keys (2026-07-13):**
`id, organizationId, requireMileage, requireHours, requireTechStories,
requireVehicleIdentifier, vehicleIdentifier, autoPickInventoryParts,
autoApproveLines, requireVendorInvoiceNumber, requireReview`. **No** `operatingMode`,
**no** `requireVin`, **no** `createPurchaseOrders`. Save endpoint
`POST /api/organizations/settings/change` (full object). Org baseline this run: all
requires OFF except `requireVehicleIdentifier:true` (`vehicleIdentifier:"vin"`).
