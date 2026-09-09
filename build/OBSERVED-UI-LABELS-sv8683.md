# OBSERVED UI LABELS — sv8683.qa.shopview.com, build `v26.35.9-5700a76`, Simple Flow V2 (group 6665)

**What this file is for.** Same contract as `OBSERVED-UI-LABELS-sv9315.md`: the labels **actually seen on
the build, verbatim**, each with where it was seen and its committed evidence. `check_precond_labels.py`
compares a suite's quoted labels against this list. A label goes in **only** from a probe with committed
evidence — never from an API field name, a spec, or a repo note.

**🛑 NEVER change the Admin role** (it is the full-access build-verify login; on sv8683 Admin =
`fe_permissions` 43, template administrator). To test a specific role, change `TECH@shopview.com` —
reset-then-assign. (LEARNINGS-LOG L0006/L0008.)

## Top navigation and global chrome
| Label | Where | Evidence |
|---|---|---|
| `Work Orders` · `Schedule` · `Customers` · `Parts` · `Reports` | top menu | sf_walk1, wo-lines-sv8683.png |
| `Clock In` · `Notifications` | top menu | sf_walk1 |

## Work Orders list
| Label | Where | Evidence |
|---|---|---|
| `All` · `Estimates` · `Work Orders` · `Completed` | tabs on the Work Orders list | sf_walk1 |

## The work order detail — tabs
| Label | Where | Evidence |
|---|---|---|
| `Lines` · `Parts` · `Notes` · `Timesheets` · `History` · `Stats` · `Finance` | tabs on an open work order (counts in brackets, e.g. `Lines (1)`) | sf_walk1, wo-lines-sv8683.png |

## The work order Lines screen
| Label | Where | Evidence |
|---|---|---|
| `New Line` · `Complete` | line toolbar / line row | sf_walk1 |
| `Start` | a line's Labor row | sf_walk1 |
| `Pick` | a part row action | sf_walk1 |
| `more_vert` (aria `Part context menu`) | right end of a part row | sf_walk1 |
| `more_vert` (aria `Add labor fee or discount`) | a line's row | sf_walk1 |
| line status badge `Approved` | on the line | sf_walk1, BADGES |
| part status badge `In stock` | on a part row | sf_walk1, BADGES |

**Part status badges to confirm as seeded:** `In stock` (seen) · `Requested` · `Needs Approval` ·
`Ordered` / `Auth To Order` · `Received` — to be observed on seeded parts in the relevant states.

## Settings — the completion rules (this is "App Settings", `settingsApp`)
**Route:** top-right of the app is not it — go **Settings** (left sidebar `info Settings`,
`/administration/settings`) → the **`Work Orders`** tab (the page has three tabs: `Organization` ·
`Invoice` · `Work Orders`). A **`Save Settings`** button (bottom-right) commits changes. Confirmed live
2026-09-09 on `v26.35.9-5700a76`; evidence `settings-workorders-tab-sv8683.png`, `wotab.log`.

| Group heading | Toggle (verbatim) | Description on screen |
|---|---|---|
| `WORKFLOW` | `Require Approval for New Lines` | "When on, new work order lines require approval. When off, they are auto-approved." |
| `WORKFLOW` | `Require Review Before Completion` | "Work orders must be reviewed and signed off before they can be completed" |
| `LINE REQUIREMENTS` | `Require Tech Story` | "Tech story will be a required field before a line can be completed on a work order" |
| `LINE REQUIREMENTS` | `Require Mileage` | "Mileage will be a required field before a line can be completed on a work order" |
| `LINE REQUIREMENTS` | `Require Engine Hours` | "Engine hours will be a required field before a line can be completed on a work order" |
| `PARTS` | `Require Ordering Parts` | "When on, you click Order on each part to record that you've ordered it. When off, parts are marked as ordered automatically." |
| `PARTS` | `Require Receiving Parts Before Completion` | "When on, each part must be recorded as received before the work order can be completed. When off, you can finish the work order and receive later." (stored as `requireVendorInvoiceNumber` — build trap) |
| `PARTS` | `Require Picking Inventory Parts` | "When on, you click Pick on each inventory and found part to record that it's been pulled. When off, these parts are ready as…" |

**Note (Story 1 build-verify):** both the NEW setting `Require Ordering Parts` and the renamed
`Require Picking Inventory Parts` ARE present on the build — no missing-setting finding.

---

## TO CONFIRM (next probes) — screens the cases need
- **Receiving** flow (from a WO + Purchase Order pages + "Receive later").
- **Completion wizard** + **Finish** action.
- **Bulk action bar** (multi-select on Lines).
- **Part rows/menus** (the `Part context menu` items) + **Reordering**.
- **Permissions** (Owner/Admin, Pick Parts, Order Parts, See Financial Data, Order Mgmt).

## WO Lines — actions, clock-out, bulk bar, receive (confirmed 2026-09-09)
- **Line/part actions:** line `Complete`, `New Line`, `Start` (labor), part `Pick`, part context menu (`Move`, `Add Part Fee / Discount`). Evidence: actions.log, wo-actions-sv8683.png.
- **WO header three-dot (more_vert) menu:** `Audit Log` · `Timesheets (n)` · `Add Work Order Fee / Discount` · `Create invoice` · `Delete Work Order`. Evidence: clockout.log.
- **Clock-out modal** (press `Start` then `Stop` on a line; title "Stop working on <WO>…"): actions `Clock out` and `Clock out and complete` (`Clock out and send to review` when review is required); the tech story field is present; the old "line completed" tick box is **hidden**. Evidence: clockout.log, clockout-modal-sv8683.png.
- **Bulk action bar** (tick line/part row checkboxes): shows `N selected`, primary actions (e.g. `Complete Line`, `Pick (n)`), a `More` (expand_more) overflow, and a `close` X — it replaces the column headers. Evidence: bulk.log, bulk-bar-sv8683.png.
- **Receive modal** (`Receive` on a part row that is awaiting receipt; title **`Receive parts`**): fields `Assign vendor`, `Vendor invoice number`, `Invoice date`, `Delivery note`; buttons `Select all`, `Receive later`, `Receive parts (n)`. Same modal from part row / line menu / bulk bar / completion wizard. Evidence: recvobs.log, receive-modal-sv8683.png.
- **⚠️ PO pages route NOT yet located:** `/purchase-orders` returns 404; the Parts sub-nav (`Part Sales`·`Inventory`·`Catalog`·`Returns`·`Vendors`) has no Purchase Orders entry. Area 6 (PO Pages, C44589/44590/44591/C53488) needs this route found before build-verify.

## Roles & Permissions + completion wizard (confirmed 2026-09-09)
- **Administration sub-nav** (left sidebar, reached via `/administration/settings`): under `SETTINGS` →
  `Settings` · `Staff` · **`Roles & Permissions`** (`/administration/roles-permissions`) · `Locations` ·
  `Departments` · `Taxes`; under `SERVICE` → `Labor Rates` · `Canned Lines` · `Fees & Discounts` ·
  `Asset Types` · `Inspection Templates`; under `PARTS` → `Pricing` · `Bin Locations` · `Categories`;
  under `INTEGRATIONS` → `QuickBooks` · `IBS`; under `FINANCE` → `Payment Methods`. Evidence:
  settings-page/role-toggles/rp-list-sv8683.png, sf_perm_probe3/5 logs.
- **Roles & Permissions page** (`/administration/roles-permissions`): a role list (roles present on
  sv8683: `Admin`, `Sales Representative`, `Service Advisor`, `Parts Manager`, `Service Manager`,
  `Office User`, `Time Clock User`, `Parts Technician`, `Senior Service Advisor`, `Technician`,
  `Foreman`); each row carries an `edit` action → **Edit Role** page. Evidence: rp-list-sv8683.png.
- **Edit Role page** (`.../roles-permissions/<id>/edit`): `Basic Details` (`Role Name`, `Description`),
  a `Permissions` section with a `Search permission` box, a `View`/`Create & Edit`/`Delete` column
  header row, a `View mode` control (`Full View` / `Tech view`), and per-permission toggles. Under the
  **Work orders** permission category the toggles include `Review work orders`, `Pick parts`,
  `Order parts`, and **`Received later`** (the one new Simple Flow V2 permission, off by default).
  Buttons: `Reset To Template`, `Cancel`, `Save`, `Delete Role`. Evidence: rp-editor-sv8683.png,
  sf_perm_probe6/7 logs (the WO-category child toggles render when the category is expanded).
- **Completion wizard** (opens from `Create invoice` in the WO header three-dot menu when something is
  still collectable): step pills across the top, each a label followed by a live count —
  **`Tech stories`**, **`Pick parts`**, **`Missing Details`** (e.g. "Tech stories (1)",
  "Pick parts (2)", "Missing Details (1)"); each step carries its own action button (e.g. `Save Story`,
  `Pick`). Evidence: wizard.log, completion-wizard-sv8683.png. (The `(n)` is a dynamic count, not part
  of the label.)
