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
