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

---

## SF-COMP — Work Order Completion (`/workorders/{id}/lines`)

Screenshots: `COMP-A-01-lines.png` (WO Lines page), `COMP-A-02-modal.png`
(Complete Work Order modal → Success screen for a no-receive WO).

**WO Lines page toolbar (exact buttons):** `New Line` · `Complete Work Order`
(sit together in the top-right toolbar). Line rows carry a per-line `more_vert`
menu and a line-level **`Receive`** button on part rows.

**Vehicle header (exact labels):** `VIN/Serial #` · `Mileage` · `Engine Hours` ·
`License Plate`; a **`Valid VIN Required`** chip appears when the VIN is not valid.

**Financial panel (exact labels):** `Parts` · `Labor` · `Shop Supplies` ·
`Subtotal` · `GST` · `Total` · `Balance`. Line tabs: `Lines` · `Parts` · `Notes`
· `Stats` · `Finance`.

**Complete Work Order modal:** title `Complete Work Order` with a `close` (X)
control; header shows the WO number + customer (e.g. `S2-15795 · Jessica Kim`).

**Success screen (exact text — for a WO needing no receive):**
`task_alt` icon, heading **`Order complete`**, sub-line **`Sent to Finance as an
invoice-ready draft`**, then `Work order S2-15795 Inv…` (WO number + invoice total).
Buttons: **`Done`** and **`Go To Invoice`**.

**Part row statuses seen (exact):** `Awaiting Receive`, `Returned`, `Requested`
(the receive wizard shows an "N parts waiting to receive" count and
`Receive Parts` / `Complete Without Receiving` / `Cancel` actions for the
optional-invoice flow — verified with screenshots in prior runs `FV-comp13-*`,
`FV-comp19-*`; not re-driven this pass).

Build-accuracy note: the SF-COMP case wording already matches these live labels
(Complete Work Order, Order complete, Sent to Finance as an invoice-ready draft,
Done, Go To Invoice, line Receive) — no label corrections were needed for SF-COMP.

---

## SF-PERM — Permissions (`/administration/roles-permissions`)

Screenshots: `PERM-roles-list.png`, `PERM-role-detail.png`. Nav: Administration →
**Roles & Permissions** (route `/administration/roles-permissions`).

**Roles list columns (exact):** `Role Name` · `Description` · `Template` ·
`Role Type` · `Users` · `Action`. Button **`Create Custom Role`**; **`Search Role`**
box. Role Type shows `System` for the 11 built-in roles.

**Exact system-role descriptions (build):** Time Clock = "Clock in/out only";
Technician = "Assigned work orders and time tracking (Tech View)"; Service Advisor
= "Work order and customer management with invoicing access"; Senior Service Advisor
= "Work order and customer management with expanded access"; Foreman = "Oversees
technicians and work orders"; Parts (Manager/Tech) = "Parts operations and vendor
management"; Sales Representative = "Reports and financial data access only".

**Permission gates (verified live via the fresh roles matrix
`roles-matrix-2026-07-13.md` — API `GET /api/roles/{id}` + `GET /api/auth/me/fe-permissions`):**
Complete Work Order = `workOrdersCreateAndEdit`; Mark Reviewed =
`woReviewWorkOrders`; PO Receive = `woOrderParts` (Order Parts); Bulk Receive =
`vendorOrderManagementCreateAndEdit` + `seeFinancialData`; vendorless part add =
`seeFinancialData`; WO settings = `settingsApp` (App Settings). No system-role drift
(2026-07-13). Backend enforces the settings atom (tech settings save → 403) but not
the WO-completion / review atoms (documented UI-pass / API-gap).

FLAG: the per-permission editor labels inside a role's detail (e.g. the exact
on-screen text for "See Financial Data" / "Work Orders: Create & Edit") were not
re-captured this pass (the role-detail editor did not expand in the headless
capture). SF-PERM tester wording uses the standard ShopView permission names; if
exact editor-label precision is required, capture the role-permission editor.
