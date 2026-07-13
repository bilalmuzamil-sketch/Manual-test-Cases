# Custom Roles — Wording + VIU Blockers & Findings Tracker — 2026-07-13

Per-case status source: `cases-2026-07-13/*.json`. Full workbook: `CustomRoles_WordingVIU_2026-07-13.xlsx` (Case ID + clickable TestRail Link columns, Rule 8).

**Tally (252 core cases):** VIU-Verified 30 · Blocked-UI 214 · Deviation/Finding 8.

## Deviations / build-findings (route to dev / needs live re-test)

| Case | Link | Finding |
|---|---|---|
| C26322 | [link](https://shopview.testrail.io/index.php?/cases/view/26322) | System roles deletable=false (live API). A RolesPermissionsDuplicate route exists in the build — Duplicate appears to be a feature; flagged for live confirm. |
| C26325 | [link](https://shopview.testrail.io/index.php?/cases/view/26325) | RolesPermissionsDuplicate route exists in the build. System roles deletable=false (live API). |
| C26387 | [link](https://shopview.testrail.io/index.php?/cases/view/26387) | RUN331 recorded C26387 as a FAILED deviation (Add Customer still shown with Customers C&E off). |
| C26388 | [link](https://shopview.testrail.io/index.php?/cases/view/26388) | RUN331 recorded C26388 as a FAILED deviation. |
| C26482 | [link](https://shopview.testrail.io/index.php?/cases/view/26482) | RUN331 recorded this as a FAIL (aging reports still gated by AP/AR, not Reports). Needs a fresh live re-test. |
| C26529 | [link](https://shopview.testrail.io/index.php?/cases/view/26529) | Route metadata: Integrations gates IBS/Open API/QuickBooks; Finance gates Payment Methods/Taxes (no QuickBooks). QuickBooks is under Integrations in the build. |
| C26530 | [link](https://shopview.testrail.io/index.php?/cases/view/26530) | QuickBooks gated by settingsIntegrations in the build. |
| C26531 | [link](https://shopview.testrail.io/index.php?/cases/view/26531) | settingsIntegrations gates IBS/Open API/QuickBooks; the Settings 'Integrations' sub-toggle exists. Integrations is present in the build. |

## VIU-Verified (build-confirmed from shipped build / live roles API)

| Case | Link | Title |
|---|---|---|
| C26308 | [link](https://shopview.testrail.io/index.php?/cases/view/26308) | All 11 system roles appear in the list with a system badge |
| C26320 | [link](https://shopview.testrail.io/index.php?/cases/view/26320) | Each of the 11 system roles shows its description |
| C26331 | [link](https://shopview.testrail.io/index.php?/cases/view/26331) | The permissions section shows the resource cards with their columns |
| C26338 | [link](https://shopview.testrail.io/index.php?/cases/view/26338) | Turning on every permission shows the 'Full administrative access' warning banner |
| C26370 | [link](https://shopview.testrail.io/index.php?/cases/view/26370) | The Work order lines card has no View column (View comes from Work orders) |
| C26371 | [link](https://shopview.testrail.io/index.php?/cases/view/26371) | The Timesheets card has no Delete box |
| C26406 | [link](https://shopview.testrail.io/index.php?/cases/view/26406) | Turning Parts Department ON shows exactly 3 child cards |
| C26429 | [link](https://shopview.testrail.io/index.php?/cases/view/26429) | The Timesheets card shows View and Create & Edit only (no Delete) |
| C26441 | [link](https://shopview.testrail.io/index.php?/cases/view/26441) | Turning Settings ON reveals its sub-toggles |
| C26452 | [link](https://shopview.testrail.io/index.php?/cases/view/26452) | The Work orders card has 'Full View' and 'Tech view' options |
| C26454 | [link](https://shopview.testrail.io/index.php?/cases/view/26454) | The Tech view description, and Tech view stays disabled until a Work orders permission is on |
| C26467 | [link](https://shopview.testrail.io/index.php?/cases/view/26467) | See Financial Data toggle appears in the Cross-Cutting Toggles card |
| C26495 | [link](https://shopview.testrail.io/index.php?/cases/view/26495) | Administrator: role permissions match the expected set |
| C26496 | [link](https://shopview.testrail.io/index.php?/cases/view/26496) | Service Manager: role permissions match the expected set |
| C26497 | [link](https://shopview.testrail.io/index.php?/cases/view/26497) | Senior Service Advisor: role permissions match the expected set |
| C26498 | [link](https://shopview.testrail.io/index.php?/cases/view/26498) | Service Advisor: role permissions match the expected set |
| C26499 | [link](https://shopview.testrail.io/index.php?/cases/view/26499) | Foreman: role permissions match the expected set |
| C26500 | [link](https://shopview.testrail.io/index.php?/cases/view/26500) | Technician: role permissions match the expected set |
| C26501 | [link](https://shopview.testrail.io/index.php?/cases/view/26501) | Parts Manager: role permissions match the expected set |
| C26502 | [link](https://shopview.testrail.io/index.php?/cases/view/26502) | Parts Technician: role permissions match the expected set |
| C26503 | [link](https://shopview.testrail.io/index.php?/cases/view/26503) | Office User: role permissions match the expected set |
| C26504 | [link](https://shopview.testrail.io/index.php?/cases/view/26504) | Sales Representative: role permissions match the expected set |
| C26505 | [link](https://shopview.testrail.io/index.php?/cases/view/26505) | Time Clock User: role permissions match the expected set |
| C26506 | [link](https://shopview.testrail.io/index.php?/cases/view/26506) | Customer portal is on by default only for Service Advisor, Senior Service Advisor, Service Manager and Parts Manager (and Administrator) |
| C26532 | [link](https://shopview.testrail.io/index.php?/cases/view/26532) | Create success message wording |
| C26533 | [link](https://shopview.testrail.io/index.php?/cases/view/26533) | Update success message wording |
| C26536 | [link](https://shopview.testrail.io/index.php?/cases/view/26536) | Turning See Financial Data on shows a confirmation dialog |
| C26542 | [link](https://shopview.testrail.io/index.php?/cases/view/26542) | A system role cannot be deleted |
| C26543 | [link](https://shopview.testrail.io/index.php?/cases/view/26543) | Only Office User and Time Clock User are non-editable; every other system role (including Administrator) is editable |
| C27740 | [link](https://shopview.testrail.io/index.php?/cases/view/27740) | The Invoicing & payments delete column is labelled 'Delete / Reverse' |

## Blocked-UI — reason groups

All remaining cases are wording-corrected + pushed, but their *behavior* needs a live UI pass (the role editor could not be driven headless in this harness, per RUN331). Common resume conditions:
- **Seeded custom role + login** (most permission on/off behavior cases): create the role in the editor, assign a user, log in, observe. RESET Tech to Time Clock User (a0359055-3dfb-4e9c-9e11-2fbea21585c2) after.
- **Live role editor** (cascade auto-tick/untick, SFD prompt, disabled toggles, template picker labels).
- **Two live sessions** (forced-logout on role change).
- **Live payments** (bulk payment / delete payment — create-customer-payment 500s intermittently).
