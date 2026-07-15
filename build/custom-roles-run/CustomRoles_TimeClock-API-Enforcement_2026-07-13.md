# Custom Roles — Time Clock Role: Backend API Permission Enforcement (Evidence)

**Date:** 2026-07-13  **Env:** STAGING (`api.staging.shopview.com`)  **Role under test:** system **Time Clock User** (id `be58f381-52fd-4958-9961-2d207bd1f09c`)

**Confirmed permissions (GET /api/auth/me/fe-permissions):** `scheduleView, timesheetsView, workOrdersView`; view_mode **none**; all cross-toggles OFF — matches spec.

**Linked Jira bug:** *BE — Time Clock Role Permissions Not Properly Enforced* (a Time Clock user can access restricted areas; API calls to restricted areas do not return proper 403).

## Verdict
- Allowed reads working (200 as expected): **3**
- Restricted calls correctly blocked (**403**): **10**
- **LEAKS (restricted call NOT properly blocked = the bug): 4**
- Inconclusive (endpoint not identified): **1**

**Jira bug = PARTIALLY CONFIRMED.** The backend correctly enforces resource-level *View* (403 on Parts/POs/Customers/Reports/Staff/Roles/Integrations/Departments) and *write* on Settings-change and Customer-delete (403 "Access denied."). But there are **4 real enforcement gaps**: **Customer create (201 — a real customer is created)**, **Work Order create (never 403 — processed past the gate)**, **Settings read (200)** and **Taxes read (200)**. The create endpoints are missing the permission gate their view/delete counterparts have.

## Endpoint-by-endpoint results

| Area | Endpoint | Method | Expected | Actual (Time Clock) | Verdict | TestRail |
|---|---|---|---|---|---|---|
| Work Orders | `/api/work-orders?page=1` | GET | 200 | 200 | Correct (allowed) | [C29446](https://shopview.testrail.io/index.php?/cases/view/29446) |
| Work Orders | `/api/work-orders/view/{id}` | GET | 200 | 200 | Correct (allowed) | [C29446](https://shopview.testrail.io/index.php?/cases/view/29446) |
| Schedule | `/api/calendar?date=..&end_date=..` | GET | 200 | 200 | Correct (allowed) | [C29447](https://shopview.testrail.io/index.php?/cases/view/29447) |
| Timesheets | `(timesheet-view API not identified; candidates 404)` | GET | 200 | INCONCLUSIVE | Inconclusive | — |
| Inventory/Parts | `/api/inventory/parts?page=1` | GET | 403 | 403 | Correctly blocked | [C29448](https://shopview.testrail.io/index.php?/cases/view/29448) |
| POs/Orders | `/api/inventory/orders?page=1` | GET | 403 | 403 | Correctly blocked | [C29449](https://shopview.testrail.io/index.php?/cases/view/29449) |
| Customers | `/api/customers?page=1` | GET | 403 | 403 | Correctly blocked | [C29450](https://shopview.testrail.io/index.php?/cases/view/29450) |
| Reports (AP Aging) | `/api/reporting/account-payable/unpaid-invoices-report` | GET | 403 | 403 | Correctly blocked | [C29451](https://shopview.testrail.io/index.php?/cases/view/29451) |
| Staff / Roles | `/api/organizations/{org}/roles` | GET | 403 | 403 | Correctly blocked | [C29452](https://shopview.testrail.io/index.php?/cases/view/29452) |
| Staff | `/api/staff?page=1` | GET | 403 | 403 | Correctly blocked | [C29452](https://shopview.testrail.io/index.php?/cases/view/29452) |
| Integrations (IBS) | `/api/ibs/settings` | GET | 403 | 403 | Correctly blocked | [C29453](https://shopview.testrail.io/index.php?/cases/view/29453) |
| Departments | `/api/departments` | GET | 403 | 403 | Correctly blocked | [C29454](https://shopview.testrail.io/index.php?/cases/view/29454) |
| Settings | `/api/organizations/settings` | GET | 403 | 200 | **LEAK-bug** | [C29457](https://shopview.testrail.io/index.php?/cases/view/29457) |
| Taxes (Finance) | `/api/taxes` | GET | 403 | 200 | **LEAK-bug** | [C29458](https://shopview.testrail.io/index.php?/cases/view/29458) |
| Settings (write) | `/api/organizations/settings/change` | POST | 403 | 403 | Correctly blocked | [C29455](https://shopview.testrail.io/index.php?/cases/view/29455) |
| Customers (delete) | `/api/customers/delete` | POST | 403 | 403 | Correctly blocked | [C29456](https://shopview.testrail.io/index.php?/cases/view/29456) |
| Customers (create) | `/api/customers/create` | POST | 403 | 201 | **LEAK-bug** | [C29459](https://shopview.testrail.io/index.php?/cases/view/29459) |
| Work Orders (create) | `/api/work-orders/create` | POST | 403 | 400/500 | **LEAK-bug** | [C29460](https://shopview.testrail.io/index.php?/cases/view/29460) |

## Notes
- **Work Orders (GET `/api/work-orders?page=1`):** Time Clock has Work Orders View
- **Work Orders (GET `/api/work-orders/view/{id}`):** WO detail readable
- **Schedule (GET `/api/calendar?date=..&end_date=..`):** Time Clock has Schedule View
- **Timesheets (GET `(timesheet-view API not identified; candidates 404)`):** No timesheet list endpoint located; Timesheets View likely FE-surfaced. /api/staff/clocked was 403(tech)/500(admin)
- **Customers (GET `/api/customers?page=1`):** Customer VIEW enforced
- **Reports (AP Aging) (GET `/api/reporting/account-payable/unpaid-invoices-report`):** tech blocked before validation; admin 400=needs params
- **Settings (GET `/api/organizations/settings`):** READ leak: WO/org settings returned to Time Clock user lacking any Settings access (likely-benign shared config, but a restricted-area read that does not 403)
- **Taxes (Finance) (GET `/api/taxes`):** READ leak: tax/finance reference data returned to Time Clock user lacking See Financial Data / Finance settings
- **Settings (write) (POST `/api/organizations/settings/change`):** Response: 'Access denied.'
- **Customers (delete) (POST `/api/customers/delete`):** Response: 'Access denied.' Customer DELETE enforced
- **Customers (create) (POST `/api/customers/create`):** CRITICAL: created a real customer as Time Clock user lacking Customers Create&Edit AND Customers View. Two ZZAUTOTEST customers created + deleted. Create endpoint missing the permission gate that VIEW/DELETE have.
- **Work Orders (create) (POST `/api/work-orders/create`):** Never returns 403: 400 'company_id Missing' with minimal body; 500 with valid company_id -> request processed PAST the permission gate (no WO persisted). WO create endpoint lacks the workOrdersCreateAndEdit gate.

## Provenance / cleanup
- Live-probed as the Time Clock user; admin baselines confirm every tech-403 endpoint returns 200 for admin (so the 403s are genuine enforcement, not missing routes).
- Two ZZAUTOTEST customers created by the create-leak probe were **deleted**; no work order persisted.
- **Env drift:** the shared staging org's role ids were reseeded; the stale `a0359055` Time-Clock id no longer exists (invalid role_id → 500). Current Time Clock User = `be58f381-52fd-4958-9961-2d207bd1f09c`.
- Raw evidence: `api-timeclock-2026-07-13/results.json`, `probe-results.tsv`.
