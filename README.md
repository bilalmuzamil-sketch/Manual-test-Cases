# Custom Roles and Permissions — Manual Test Cases (Epic SV-7388)

**Links**
- Epic: [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
- Spec (Confluence): [Custom Roles and Permissions](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)
- Figma: [Working – ShopView App](https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12284-6713)

## About this suite

This suite contains manual QA test cases for the ShopView "Custom Roles and Permissions" feature. The feature replaces the legacy fixed role set with system role templates plus admin-configurable custom roles, driving what each staff member can see and do across Work Orders, Schedule, Customers, Parts, Invoicing, Timesheets, page access, settings, and cross-cutting financial/history controls. Test cases are grouped by functional area into files under `test-cases/`. Each test case is written to be executed by hand against a running instance of the app by a QA engineer who has not read the spec.

## How to use

1. Pick a file from the `test-cases/` index below that matches the area you are testing.
2. Read the file's **Scope** and complete every bullet under **Prerequisites** before starting. Many files depend on the shared setup in `00-test-environment-and-setup.md` — do that file first.
3. For each test case, satisfy its **Preconditions** and **Test Data**, then execute the numbered **Steps** in order, comparing the actual result to the **Expected Result** for every step.
4. Mark each test case **Pass** or **Fail** based on whether the **Expected Final Result** was met.
5. On failure, log a defect that references both the test-case ID (e.g. `CR-ROLEMGMT-004`) and the covered Jira story (e.g. `SV-7502`), and attach the step at which behavior diverged plus screenshots.

## Test-case ID convention

Every test case has an ID of the form **`CR-<AREA>-NNN`**:
- `CR` — fixed prefix for this suite (Custom Roles).
- `<AREA>` — the area code of the file (see the **Area** column in the index below, e.g. `ROLEMGMT`, `WO`, `SYSROLE`).
- `NNN` — a zero-padded 3-digit number, assigned sequentially within each file starting at `001`.

IDs are stable references — do not renumber existing cases when inserting new ones; append instead.

## Priority & Type legend

**Priority**
| Priority | Meaning |
|---|---|
| Critical | Core security/permission gate or data-integrity behavior; a failure blocks release. |
| High | Important user-facing behavior; a failure significantly degrades the feature. |
| Medium | Secondary behavior or common variation; a failure is noticeable but has a workaround. |
| Low | Minor, cosmetic, or edge behavior. |

**Type**
| Type | Meaning |
|---|---|
| Positive | Verifies allowed/expected behavior works. |
| Negative | Verifies disallowed behavior is blocked or errors are handled. |
| Dependency | Verifies cascade/gating relationships between settings. |
| Security | Verifies access control cannot be bypassed. |
| Regression | Guards against a previously observed bug reappearing. |
| UI | Verifies presentation, labels, layout, and controls. |

## Index

| File | Area | SV stories covered | Description |
|---|---|---|---|
| [`test-cases/00-test-environment-and-setup.md`](test-cases/00-test-environment-and-setup.md) | SETUP | — | Test shop, seeded roles, test accounts, and general preconditions all other files depend on. |
| [`test-cases/01-role-management-admin-ui.md`](test-cases/01-role-management-admin-ui.md) | ROLEMGMT | SV-7499, 7500, 7501, 7502, 7503, 7504, 7505 | Roles list page, create/edit/delete role, permission summary, financial confirmation modal, staff assignment. |
| [`test-cases/02-work-orders-and-lines.md`](test-cases/02-work-orders-and-lines.md) | WO | SV-7506, 7507, 7509 | Work Orders CRUD, WO sub-settings, WO Lines CRUD. |
| [`test-cases/03-view-mode.md`](test-cases/03-view-mode.md) | VIEWMODE | SV-7508 | Tech View vs Full View. |
| [`test-cases/04-schedule.md`](test-cases/04-schedule.md) | SCHED | SV-7510 | Schedule CRUD permissions. |
| [`test-cases/05-customer-management.md`](test-cases/05-customer-management.md) | CUST | SV-7511 | Customer management CRUD permissions. |
| [`test-cases/06-parts-department.md`](test-cases/06-parts-department.md) | PARTS | SV-7512, 7513, 7514, 7520 | Part Sales, Catalog & Inventory, Vendor & Order Mgmt, Parts Dept parent gate. |
| [`test-cases/07-invoicing-and-payments.md`](test-cases/07-invoicing-and-payments.md) | INV | SV-7515 | Invoicing CRUD and payments. |
| [`test-cases/08-timesheets.md`](test-cases/08-timesheets.md) | TIME | SV-7516 | Timesheets CRUD permissions. |
| [`test-cases/09-page-access-toggles.md`](test-cases/09-page-access-toggles.md) | PAGES | SV-7517, 7518, 7519 | Reports, Customer Portal, Billing Portal page-access toggles. |
| [`test-cases/10-settings-access.md`](test-cases/10-settings-access.md) | SETTINGS | SV-7521, 7522 | Settings parent toggle, sub-toggles, and Wages. |
| [`test-cases/11-cross-cutting-toggles.md`](test-cases/11-cross-cutting-toggles.md) | XCUT | SV-7523, 7524, 7525 | See Financial Data, Manage AP/AR, View History Logs. |
| [`test-cases/12-system-role-templates-and-migration.md`](test-cases/12-system-role-templates-and-migration.md) | SYSROLE | SV-7526, 7527 | System role templates (permission matrix) and legacy 15 → new role migration. |
| [`test-cases/13-regression-edge-cases.md`](test-cases/13-regression-edge-cases.md) | REG | — | Regression cases derived from observed bugs. |

## Known spec/story discrepancies to confirm with PM

The following inconsistencies were found between the stories, the spec intro, and the final permission matrix. Confirm the intended behavior with the PM before treating any related test result as a true defect.

1. **Role count / Owner role.** The Owner role appears to have been dropped and merged into Administrator, but SV-7526 and SV-7527 still reference `system-owner`. The final permission matrix names **11** roles while the spec text says **12**. Confirm the intended role count and whether `system-owner` should exist at all.
2. **Settings sub-toggle count.** The Settings section intro in the spec says **6** sub-toggles, but the table lists **7** (it adds Integrations and View/Manage Wages). Confirm the correct set and count.
3. **AP/AR label drift.** The cross-cutting toggle is called "View and Manage AP/AR" in earlier text but "Manage Accounts Payable and Receivable" in the final version. Confirm the canonical label.
4. **SV-7514 wording.** SV-7514 still refers to "vendor transaction history" while the final feature calls it "part history." Confirm which term the UI uses.
5. **SV-7521 stale references.** SV-7521 references QuickBooks placed under Finance and mentions "bays," both of which were changed or removed. Confirm the final Settings sub-toggle structure.
6. **Reset to Template.** The "Reset to Template" requirements are flagged as an open question in the spec, yet SV-7750 has tests for it. Confirm expected reset behavior before executing those tests.

## Build-vs-spec discrepancies confirmed in staging (VIU pass 2, live admin session, 2026-07-01)

VIU pass 2 (live staging admin session, read-only) confirmed the exact Custom Roles labels, the silent CRUD cascade, the "Enable See Financial Data?" confirmation popup, and the kebab-menu variants (see the **VIU Findings Log** sheet, entries VIU-16..VIU-25). It also logged three build-vs-spec discrepancies:

- **Doubled `/api` prefix on SSO auth-check (functional bug, high severity — VIU-23).** The staging auto-auth-check requests `/api/api/sso/check` (the axios baseURL already includes `/api`) and gets a 404, so a valid cookie session does not hydrate the SPA and authenticated users are bounced to `/login`. The correct path should be `/api/sso/check`.
- **No unsaved-changes guard on Create Role X-close (UX — VIU-24).** Closing the Create Role dialog via the X with unsaved permission toggles shows no discard/unsaved-changes confirmation; the changes are silently dropped.
- **Dependency-UX inconsistency (UX — VIU-25).** Intra-section CRUD dependencies auto-cascade silently (no popup), but the Invoicing → See Financial Data dependency uses an explicit confirmation popup — the same underlying "requires" pattern rendered with two different UX treatments.

## Per-role runtime verification confirmed in staging (VIU pass 3, live per-role session as Tech, 2026-07-01)

VIU pass 3 logged in AS the restricted **Tech** user (`tech@shopview.com`) on staging (each config assigned via admin, then Tech re-logged-in). **All 11 per-role gate configurations behaved PER SPEC (PASS)** — see the **VIU Findings Log** sheet, entries VIU-26..VIU-31:

1. **WO View only** → Tech sees ONLY the Work Orders nav; WO list is read-only; NO "New" button; other modules hidden.
2. **WO View + Create & Edit** → the "New" button appears (create/edit enabled); no delete.
3. **WO View + Create & Edit + Delete** → full WO management including per-row delete.
4. **WO View Mode (Tech view vs Full View)** → carried correctly (`view_mode=tech` / `woTechViewMode`); the visible difference is INSIDE the WO detail page, not the WO list (the list looks the same).
5. **WO sub-toggles Pick parts / Order parts** → carried correctly (`woPickParts` / `woOrderParts`); the actions live INSIDE the WO detail page.
6. **Customers View only** → ONLY the Customers nav; read-only list; other modules hidden.
7. **Page Access Reports ON/OFF** → Reports nav + report suite visible when ON; nav hidden when OFF (gate is exact).
8. **Page Access Settings ON** → visible under the Administration area; the settings routes are CHILDREN of `/administration` (Settings, Staff, Roles & Permissions, Locations, Departments).
9. **See Financial Data ON vs OFF** → carried correctly (`seeFinancialData` true/false); financial figures/prices are not on the WO list — the effect manifests in WO detail / invoicing.
10. **Combination WO View + Customers View + Reports ON** → nav = EXACTLY Work Orders, Customers, Reports; nothing else.
11. **Baseline** → a zero-permission role CANNOT be created (the API enforces "At least one permission is required."); the minimal case is a single-permission role (e.g. `timesheetsView` → Tech lands on own Timesheets with an empty top nav).

**Discrepancies / corrections applied (D1–D4):**

- **D1 — admin routes live at `/administration`, not `/settings` (VIU-28).** Navigating to `/settings` returns a 404 "coffee break" page. Any admin/role-config navigation should use `/administration`. (This suite's test-case JSON already navigates to `/administration/roles-permissions`, so no literal `/settings` URL needed correcting.)
- **D2 — zero-permission role not creatable (VIU-30).** Minimum one permission is enforced; documented as a known design constraint. Any "empty role" baseline should use a single-permission minimal role instead.
- **D3 — verification location (VIU-29).** View-mode, delete, pick/order-parts, and see-financial-data effects are verified INSIDE the WO detail page (and invoicing for financial), not on the WO list. Affected per-role verification steps now state this explicitly.
- **D4 — permission propagation (VIU-31).** After reassigning a role, the user must log out and log back in (fresh login) AND allow a brief settle before the new permissions take effect. This is now a precondition/note on the per-role (assign-and-login-as-user) cases.

## Live Test Run (2026-07-02)

A full live test run of the suite was executed on staging (Foothills Group Inc), per-role as **Tech** via dev-login. **297 cases** were executed with the following result:

| Result | Count |
|---|---|
| PASS | 232 |
| FAIL | 3 |
| BLOCKED (not verified) | 62 |
| **Total** | **297** |

### Per-batch breakdown

| Batch | PASS | FAIL | BLOCKED | Total |
|---|---|---|---|---|
| A | 43 | 1 | 8 | 52 |
| B | 34 | 0 | 31 | 65 |
| C | 39 | 0 | 2 | 41 |
| D | 18 | 0 | 0 | 18 |
| E | 98 | 2 | 21 | 121 |
| **Total** | **232** | **3** | **62** | **297** |

### The 3 FAILs

- **SP-INV-005 — Invoicing Delete requires Manage AP/AR (AP/AR gate).** With See Financial Data ON and View/Manage AP/AR OFF, enabling Invoicing "Delete / Reverse" did NOT trigger the AP/AR dependency gate/modal (the financial gate works; the AP/AR gate is missing). Logged as VIU-32.
- **DI-111 — Time Clock, view inspections on a work order line.** The "Time Clock" system role grants `workOrdersView`, so Work Orders (and Digital Inspections on a WO line, read-only) ARE reachable — contradicting the expected "no Work Orders access". Logged as VIU-33.
- **DI-117 — Time Clock, inspection status labels display.** Same root cause as DI-111: because Time Clock grants `workOrdersView`, inspection status labels CAN be seen, contradicting the expected "no Work Orders access". Logged as VIU-33.

### About BLOCKED cases

**BLOCKED = non-destructive-unverifiable** — these cases are neither pass nor fail. They cover destructive actions not executed for safety (e.g. delete/reverse affordances), build-gap 404s where a granted surface returns 404 in this build (see VIU-36), and un-automatable UI checks (field-level gating not reliably verifiable by automated scan). Per-case reasons are recorded in the **Blocked (Not Verified)** tab of the workbook and in `custom-roles-test-run-blocked.csv`. None are hidden.

### Deliverables

- **Workbook tabs** (in `custom-roles-test-cases.xlsx`, alongside all original suite tabs): **Run Summary**, **Passed**, **Failed** (Expected vs Actual), **Blocked (Not Verified)**.
- **CSV exports** (repo root): `custom-roles-test-run-passed.csv`, `custom-roles-test-run-failed.csv` (Expected vs Actual columns), `custom-roles-test-run-blocked.csv`, `custom-roles-test-run-all.csv` (every case with a Status column).
- **Run discrepancies** logged as **VIU-32..VIU-37** in the VIU Findings Log (see the VIU Findings Log sheet). VIU-37 is informational/VERIFIED; the rest are discrepancies.
- **Access method** for future live sessions is documented (no secrets) in [`build/VIU-ACCESS-METHOD.md`](build/VIU-ACCESS-METHOD.md).

### Blocked-recovery run (2026-07-02)

The **41 non-DI** BLOCKED cases were re-attempted on throwaway data (the 21 Digital Inspections BLOCKED cases were excluded from recovery). Outcome: **3 PASS, 2 FAIL, 7 N/A (not in build), 29 still-blocked**. The 29 remain blocked because the restriction is a **front-end-only gate** (DOM-level only): the granular sub-permission / cross-toggle / view_mode is not observable via the API, only in the rendered form.

- **3 PASS** — destructive delete grants confirmed on throwaway `ZZAUTOTEST` records: `SP-CUST-005` (customer delete, HTTP 201), `SP-CAT-004` (catalog part delete, HTTP 200), `SP-VEND-004` (vendor delete, HTTP 201).
- **2 FAIL** — `SP-CPORT-001` and `SP-BPORT-001`: granting `customerPortalPageAccess` / `billingPortalPageAccess` hydrates the permission but the staff SPA build exposes no portal route or API (**VIU-39**; may be by-design — flag for product).
- **7 N/A (not in build)** — the feature/permission does not exist in this build: `SP-SET-010`, `SP-SET-011`, `SP-SET-016`, `SP-HIST-001`, `SP-HIST-002`, `TE-ADMIN-001`, `TE-SM-005`.
- **29 still-blocked** — front-end-only display gates, not server-enforced (**VIU-38**, HIGH).

**Updated overall run totals: 235 PASS / 5 FAIL / 7 N/A / 50 BLOCKED of 297.**

| Result | Count |
|---|---|
| PASS | 235 |
| FAIL | 5 |
| N/A (not in build) | 7 |
| BLOCKED | 50 |
| **Total** | **297** |

Two new findings were logged:

- **VIU-38 (DISCREPANCY, HIGH) — front-end-only enforcement.** The backend enforces only resource-level View/Edit. Granular sub-permissions (Delete; `woPickParts`/`woOrderParts`/`woReviewWorkOrders`), cross-toggles (`seeFinancialData`/`seeApArData`/`viewHistoryLogs`) and `view_mode` are front-end-only display gates — NOT enforced server-side. A DELETE succeeded via API with Edit-but-no-Delete; pick/order endpoints returned 400 (validation) not 403 with only `workOrdersView`; view responses were identical regardless of `seeApArData`/`view_mode`. UI restrictions are bypassable via direct API calls (security-relevant).
- **VIU-39 (DISCREPANCY) — portal build gap.** Granting `customerPortalPageAccess` / `billingPortalPageAccess` in a staff role hydrates the permission but leads nowhere (no Customer/Billing Portal route or API in the staff build). May be by-design (portals are separate customer-facing apps) — flag for product confirmation.

Deliverables: the QA-readable bug report `custom-roles-blocked-recovery-QA-report.xlsx` / `.csv` (41 non-DI recovery cases); the master by-status workbook `custom-roles-test-run-by-status.xlsx` (tabs **Passed / Failed / N-A (Not in Build) / Blocked**) with mirror `custom-roles-run-*-detail.csv` exports; and the updated `custom-roles-test-cases.xlsx` status tabs and `custom-roles-test-run-*.csv` exports.
