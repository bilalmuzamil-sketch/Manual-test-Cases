# Custom Roles — Build-Accurate Wording Glossary — 2026-07-13

> Canonical on-screen labels for the Custom Roles & Permissions feature, captured
> **directly from the live STAGING build** (`app.staging.shopview.com`). Sources:
> the shipped Vue chunks `PermissionEditor`, `PermissionGrid`, `WoSettingsRow`,
> `CrossTogglesSection`, `PageAndSettingsToggles`, the FinancialData modals,
> `CreateNewRole`/`EditRole`, plus the app route/nav metadata in `index.js` and the
> live roles API (`GET /api/roles/{id}`, `GET /api/organizations/{org}/roles`).
> Per Standing Rule 9, tester-facing case wording MUST use these exact labels.
> Screenshots dir: `build/custom-roles-run/screenshots/wording-2026-07-13/`
> (frontend-source capture; labels verified from the shipped build bundle).

## Role names (exact, from roles API + role-selector)
Administrator · Service Manager · Senior Service Advisor · Service Advisor ·
Foreman · Technician · Parts Manager · Parts Technician · Office User ·
Sales Representative · Time Clock User. (11 system roles.)

## Roles list / navigation
- Settings area entry: **Roles & Permissions**
- Buttons/actions: **Create Role**, **Edit Role**, **Duplicate Role**, **Role Summary**
- Create-role page fields: **Role name**, **Description**; buttons **Cancel**, **Create**
- Permission search box: **Search permission**
- Template reset: **Reset to template** (confirm dialog buttons: **Cancel**, **Reset**)
- Duplicate/similar-name warning modal buttons: **Edit anyway**, **Create anyway**
- Administrator banner text: **Full administrative access**

## Permission grid — resource groups (card titles, sentence case as shown)
Columns for each: **View**, **Create & Edit**, **Delete**
(Invoicing's delete column is labelled **Delete / Reverse**.)

| Card title (build) | Short description shown under the title |
|---|---|
| **Work orders** | Manage work orders the core operational records in ShopView. |
| **Work order lines** | (child of Work orders) |
| **Schedule** | View and manage scheduled jobs across the shop calendar. |
| **Customers** | Access and maintain customer records and contact details. |
| **Invoicing & payments** | Generate invoices and record payments against work orders. (delete col = **Delete / Reverse**) |
| **Timesheets** | Track and review technician labor hours and time entries. (no Delete) |
| **Parts Department** (parent card) | groups the three cards below |
| **Part sales** | Manage part sales, returns and related transactions. |
| **Catalog and Inventory** | Manage the parts catalog and inventory levels. |
| **Vendor and order management** | Manage vendors, purchase orders, deliveries and part returns. |

## Work Orders extra toggles (WoSettingsRow, inside the Work orders card)
- **View mode** with two options: **Full View** / **Tech view**
  (Tech view tooltip: "Simplified interface focused on the technician workflow.
  Non-essential fields are hidden to reduce clutter, and only the actions a
  technician needs day-to-day are shown.")
- **Review work orders**
- **Pick parts**
- **Order parts**

## Cross-Cutting Toggles (section header: **Cross-Cutting Toggles**)
- **See Financial Data**
- **View and Manage AP/AR Data**  ← BUILD label (NOT "Manage Accounts Payable and Receivable")
- **View History Logs**  ← BUILD toggle label (gates the **Part History** page)

### See Financial Data modals
- Enable: title **Enable See Financial Data?** — buttons **Cancel**, **Enable**
- Disable: title **Disable See Financial Data?** — buttons **Cancel**, **Disable**

## Page Access & Settings toggles (PageAndSettingsToggles)
- Section **Page Access**: **Reports**, **Customer portal**, **Billing Portal**
- Section **Settings**: **App Settings**, **Service**, **Parts**, **Finance**,
  **Integrations**, **Data Import**, **View/Manage Wages**

## Pages/tabs gated by permissions (route metadata — nav labels)
- App Settings (settingsApp) → **Departments**, **Settings**, **Staff**,
  **Roles & Permissions**, **Locations**
- Service (settingsService) → **Canned Lines**, **Inspection Templates**,
  **Labour Types**, **Vehicle Types**
- Parts (settingsParts) → **Bins**, **Categories**, **Pricing**
- Finance (settingsFinance) → **Payment Methods**, **Taxes**
- Integrations (settingsIntegrations) → **IBS**, **Open API**, **QuickBooks**
- Data Import (settingsDataImport) → **Contacts Import**, **Inventory Import**,
  **Invoices Import**, **Vehicles Import**, **Vendors Import**
- View History Logs (viewHistoryLogs) → **Part History** (under Part Sales)
- Reports (reportsPageAccess) → **Reporting**

## KEY BUILD-vs-SPEC deltas (build wins for tester-facing wording, Rule 9)
1. **AP/AR toggle build label = "View and Manage AP/AR Data"** — the 09-Jul spec
   name "Manage Accounts Payable and Receivable" is NOT what the build shows.
   Tester-facing case text must say **"View and Manage AP/AR Data"**.
   (Note: this reverses the RUN331 Phase-1 rename of C26424 in tester-facing text.)
2. **History toggle build label = "View History Logs"** (spec said renamed to
   "View Part History"). The toggle keeps the name "View History Logs"; the page it
   controls is **Part History**.
3. Resource cards use **sentence case**: "Work orders", "Work order lines",
   "Part sales", "Catalog and Inventory", "Vendor and order management",
   "Invoicing & payments".
4. View-mode options are **"Full View"** and **"Tech view"** (note casing).
5. WO delete column that also reverses invoices is labelled **"Delete / Reverse"**
   under **Invoicing & payments** (not under Work orders).
</content>
</invoke>
