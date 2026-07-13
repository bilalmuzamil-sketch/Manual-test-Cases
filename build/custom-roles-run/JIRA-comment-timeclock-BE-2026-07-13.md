*Bug:* BE — Time Clock Role Permissions Not Properly Enforced (Epic SV-7388)

h2. Overall verdict: FAILED — bug CONFIRMED (PARTIAL)

The backend permission-enforcement test for the *Time Clock* role *FAILED (bug CONFIRMED)*: a Time Clock user can still reach some restricted areas directly from the backend API. Enforcement is *partial* — of 14 restricted endpoints probed, *10 correctly return 403* and *4 leak* (do not return 403 as they should).

The backend *does* correctly enforce resource-level *View* (Parts, Purchase Orders, Customers, Reports, Staff, Roles, Integrations, Departments) and *write* on Settings-change and Customer-delete. But *4 create/read endpoints are not gated* — most seriously, {{POST /api/customers/create}} returns *201 and actually creates a customer* for a user who cannot even view customers. The create endpoints are missing the permission gate their view/delete counterparts already have.

*Test conditions:* Run live on *Staging* ({{api.staging.shopview.com}}) authenticated as the system *Time Clock* role. Confirmed fe-permissions ({{GET /api/auth/me/fe-permissions}}): {{workOrdersView}}, {{scheduleView}}, {{timesheetsView}}; {{view_mode}} = none; all cross-toggles OFF — matches spec. Admin baselines confirm every 403 endpoint returns 200 for admin, so the 403s are genuine enforcement, not missing routes.

h3. Correctly blocked (PASS) — 10 endpoints return 403 as expected

* GET {{/api/inventory/parts}} (Parts / Inventory) → 403 — [C29448|https://shopview.testrail.io/index.php?/cases/view/29448]
* GET {{/api/inventory/orders}} (Purchase Orders) → 403 — [C29449|https://shopview.testrail.io/index.php?/cases/view/29449]
* GET {{/api/customers}} (Customers list) → 403 — [C29450|https://shopview.testrail.io/index.php?/cases/view/29450]
* GET {{/api/reporting/account-payable/unpaid-invoices-report}} (Reports / AP Aging) → 403 — [C29451|https://shopview.testrail.io/index.php?/cases/view/29451]
* GET {{/api/organizations/{org}/roles}} (Roles) → 403 — [C29452|https://shopview.testrail.io/index.php?/cases/view/29452]
* GET {{/api/staff}} (Staff) → 403 — [C29452|https://shopview.testrail.io/index.php?/cases/view/29452]
* GET {{/api/ibs/settings}} (Integrations / IBS) → 403 — [C29453|https://shopview.testrail.io/index.php?/cases/view/29453]
* GET {{/api/departments}} (Departments) → 403 — [C29454|https://shopview.testrail.io/index.php?/cases/view/29454]
* POST {{/api/organizations/settings/change}} (Settings write) → 403 "Access denied." — [C29455|https://shopview.testrail.io/index.php?/cases/view/29455]
* POST {{/api/customers/delete}} (Customer delete) → 403 "Access denied." — [C29456|https://shopview.testrail.io/index.php?/cases/view/29456]

h3. Leaks (FAIL / bug) — 4 endpoints do NOT return 403

* POST {{/api/customers/create}} (Customer create) — expected *403*, actual *201*. CRITICAL: a real customer is created for a user who lacks both Customers Create&Edit and Customers View. (Two ZZAUTOTEST customers created by the probe were deleted afterward.) — [C29459|https://shopview.testrail.io/index.php?/cases/view/29459]
* POST {{/api/work-orders/create}} (Work Order create) — expected *403*, actual *400/500* (never 403). Request is processed *past* the permission gate — 400 "company_id Missing" with a minimal body; 500 with a valid company_id (no WO persisted). Missing the {{workOrdersCreateAndEdit}} gate. — [C29460|https://shopview.testrail.io/index.php?/cases/view/29460]
* GET {{/api/organizations/settings}} (Settings read) — expected *403*, actual *200*. Org/WO settings returned to a Time Clock user with no Settings access (likely-benign shared config, but a restricted-area read that does not 403). — [C29457|https://shopview.testrail.io/index.php?/cases/view/29457]
* GET {{/api/taxes}} (Taxes / Finance read) — expected *403*, actual *200*. Tax/finance reference data returned to a Time Clock user lacking See Financial Data / Finance settings. — [C29458|https://shopview.testrail.io/index.php?/cases/view/29458]

h3. Allowed reads working as expected (200) — for completeness

* GET {{/api/work-orders?page=1}} and GET {{/api/work-orders/view/{id}}} (Work Orders read) → 200 — [C29446|https://shopview.testrail.io/index.php?/cases/view/29446]
* GET {{/api/calendar?date=..&end_date=..}} (Schedule read) → 200 — [C29447|https://shopview.testrail.io/index.php?/cases/view/29447]

_(Timesheets read was inconclusive — no list endpoint located; Timesheets View is likely FE-surfaced. Not counted for or against the bug.)_

h3. TestRail coverage — all 15 cases

All cases live in section *"API — Time Clock Role Enforcement (SV-7388)"* (section 4091):

|| TestRail || Endpoint || Verdict ||
| [C29446|https://shopview.testrail.io/index.php?/cases/view/29446] | GET /api/work-orders, GET /api/work-orders/view/{id} | Allowed 200 — correct |
| [C29447|https://shopview.testrail.io/index.php?/cases/view/29447] | GET /api/calendar | Allowed 200 — correct |
| [C29448|https://shopview.testrail.io/index.php?/cases/view/29448] | GET /api/inventory/parts | Blocked 403 — correct (PASS) |
| [C29449|https://shopview.testrail.io/index.php?/cases/view/29449] | GET /api/inventory/orders | Blocked 403 — correct (PASS) |
| [C29450|https://shopview.testrail.io/index.php?/cases/view/29450] | GET /api/customers | Blocked 403 — correct (PASS) |
| [C29451|https://shopview.testrail.io/index.php?/cases/view/29451] | GET /api/reporting/account-payable/unpaid-invoices-report | Blocked 403 — correct (PASS) |
| [C29452|https://shopview.testrail.io/index.php?/cases/view/29452] | GET /api/organizations/{org}/roles, GET /api/staff | Blocked 403 — correct (PASS) |
| [C29453|https://shopview.testrail.io/index.php?/cases/view/29453] | GET /api/ibs/settings | Blocked 403 — correct (PASS) |
| [C29454|https://shopview.testrail.io/index.php?/cases/view/29454] | GET /api/departments | Blocked 403 — correct (PASS) |
| [C29455|https://shopview.testrail.io/index.php?/cases/view/29455] | POST /api/organizations/settings/change | Blocked 403 — correct (PASS) |
| [C29456|https://shopview.testrail.io/index.php?/cases/view/29456] | POST /api/customers/delete | Blocked 403 — correct (PASS) |
| [C29457|https://shopview.testrail.io/index.php?/cases/view/29457] | GET /api/organizations/settings | *LEAK 200 — FAIL* |
| [C29458|https://shopview.testrail.io/index.php?/cases/view/29458] | GET /api/taxes | *LEAK 200 — FAIL* |
| [C29459|https://shopview.testrail.io/index.php?/cases/view/29459] | POST /api/customers/create | *LEAK 201 (creates customer) — FAIL* |
| [C29460|https://shopview.testrail.io/index.php?/cases/view/29460] | POST /api/work-orders/create | *LEAK 400/500 (never 403) — FAIL* |

h3. Environment note

The shared staging org's role IDs were *reseeded* — the stale Time Clock role id ({{a0359055...}}) no longer exists. This test used the *current* Time Clock role ({{be58f381-52fd-4958-9961-2d207bd1f09c}}).

Raw evidence: {{build/custom-roles-run/api-timeclock-2026-07-13/results.json}}, {{probe-results.tsv}}.
