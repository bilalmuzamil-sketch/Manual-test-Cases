# Simple Flow — Live Roles Matrix (sv7301) — 2026-07-13

> Non-VIU pre-check for the upcoming wording + VIU pass. Captures the **live**
> role definitions on the shared `sv7301` env, Tech's current role assignment,
> and Tech's effective FE permissions, so the pass runs against an accurate,
> current permission matrix. Secrets live in `/tmp` only (never committed).

- **Env:** app `https://sv7301.qa.shopview.com` / API `https://sv7301api.qa.shopview.com`.
- **Org:** `d55bc308-e61a-438d-b5f1-c7a73c89d49f` ("Staging Foothills Group Inc").
- **Access health:** GOOD. Admin quick-login **200** (role=Admin, view_mode=full,
  41 FE perms); Tech quick-login **200** (role=Technician, view_mode=tech, 6 FE
  perms). No env-wide 500s; no poisoned-session recovery needed. Both logins on the
  fresh 2026-07-13 cookies.
- **Method:** read-only. Roles list `GET /api/organizations/{org}/roles`; per-role
  defined perms `GET /api/roles/{id}`; Tech current assignment `GET /api/staff`;
  Tech effective perms via `POST /api/quick-login {key:'tech'}` →
  `GET /api/auth/me/fe-permissions`. **Tech's role was NOT modified** (no role
  swapping was needed to answer the drift question), so no restore was required —
  Tech remains Technician.
- **Harness note (NEW, reusable):** node's built-in `fetch` does **not** honor
  `HTTPS_PROXY` and hit a sandbox egress allowlist that rejects
  `sv7301api.qa.shopview.com` ("Host not in allowlist" 403). Fix: route node through
  the CCR proxy with undici `ProxyAgent` + the CA bundle
  (`setGlobalDispatcher(new ProxyAgent({uri:process.env.HTTPS_PROXY, requestTls:{ca:
  readFileSync('/root/.ccr/ca-bundle.crt')}}))`). `curl` already tunnels fine via
  CONNECT. Probe scripts: `/tmp/simple-flow/access-0713.mjs`,
  `/tmp/simple-flow/roles-probe2.mjs`.

---

## Technician drift check — RESULT: NOT DRIFTED ✅

Tech staff (`6fb22c1b-…`, `tech@shopview.com`) is currently assigned
**Technician** (`role_id 131b5274-4f88-4436-8633-76fb8a05fe7b` = the canonical
restore target). The Technician role's **defined** perms equal Tech's **effective**
(live quick-login) perms exactly, and both equal the 2026-07-08 baseline
(`role-matrix-6.json`) cell-for-cell.

| Aspect | Value |
|---|---|
| Current role | Technician |
| role_id | `131b5274-4f88-4436-8633-76fb8a05fe7b` (matches restore target) |
| view_mode | `tech` |
| FE perm count | 6 |
| Effective FE perms | `customersView, scheduleView, woPickParts, woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView` |
| cross_toggles | `seeFinancialData:false, seeApArData:false, viewHistoryLogs:false` |
| Defined == Effective | YES (identical) |
| vs 2026-07-08 baseline | IDENTICAL (permCount 6, same codes) |

Simple-Flow-relevant Technician gates confirmed: **no `workOrdersCreateAndEdit`**
(cannot mark a WO complete — the Complete gate), **no `woReviewWorkOrders`** (cannot
Mark Reviewed), **no `woOrderParts`**, **no `seeFinancialData`**; **has**
`workOrderLinesCreateAndEdit` (core Ok/Not-Ok + line story) and `woPickParts`.

---

## Full live roles matrix (defined FE permissions per role)

All 11 system roles present; **permCounts match the 2026-07-08 baseline exactly**
(Admin=41, Service Manager=35, Senior Service Advisor=32, Service Advisor=26,
Foreman=23, Parts Manager=31, Parts Tech=19, Office=22, Sales Rep=4, Technician=6,
Time Clock=0). **No system-role drift detected.**

| Role | role_id | view_mode | # perms |
|---|---|---|---:|
| Admin | `16fec34c-f912-4e0e-9182-c26ac2d2f921` | full | 41 |
| Service Manager | `ef6e24c2-0928-4dcc-9fd4-bdc8bde9e981` | full | 35 |
| Senior Service Advisor | `e03f176f-f27f-45c0-9b6d-0cd31cf6c6b1` | full | 32 |
| Service Advisor | `3874cc56-5210-43e5-83e5-2a353c4329e5` | full | 26 |
| Foreman | `897018a5-5ce5-4c7a-8238-49a8d075611b` | full | 23 |
| Parts Manager | `5d703b9b-af66-473b-9f98-3cde00da88a5` | full | 31 |
| Parts Tech | `486622b9-6cef-4cb3-8a85-d872df185bbd` | full | 19 |
| Office | `163abe0d-6d5b-4169-8d49-36ac3ee972a8` | full | 22 |
| Sales Representative | `8eb4a1c1-2d92-44ce-93f0-424981e571be` | full | 4 |
| Technician | `131b5274-4f88-4436-8633-76fb8a05fe7b` | tech | 6 |
| Time Clock | `0a198766-bc16-4dd5-a20e-1a592b023dce` | (n/a) | 0 |

**Simple-Flow key gates per role** (✓ = present):

| Role | workOrdersCreateAndEdit (Complete gate) | woReviewWorkOrders (Mark Reviewed) | workOrderLinesCreateAndEdit | woPickParts | woOrderParts | seeFinancialData | woFullViewMode |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service Manager | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Senior Service Advisor | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service Advisor | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Foreman | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Parts Manager | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Parts Tech | – | – | – | ✓ | ✓ | ✓ | ✓ |
| Office | – | – | – | – | – | ✓ | ✓ |
| Sales Representative | – | – | – | – | – | ✓ | ✓ |
| Technician | – | – | ✓ | ✓ | – | – | – (tech view) |
| Time Clock | – | – | – | – | – | – | – |

(Complete gate = `workOrdersCreateAndEdit`; consistent with §9.2 and SF-PERM-10's
verified 11-role completion matrix.)

### Full per-role defined FE permission lists

- **Admin (41):** billingPortalPageAccess, catalogInventoryCreateAndEdit, catalogInventoryDelete, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeApArData, seeFinancialData, settingsApp, settingsDataImport, settingsFinance, settingsParts, settingsService, settingsWages, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersDelete, workOrdersView
- **Service Manager (35):** billingPortalPageAccess, catalogInventoryCreateAndEdit, catalogInventoryDelete, catalogInventoryView, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeApArData, seeFinancialData, settingsApp, settingsWages, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersDelete, workOrdersView
- **Senior Service Advisor (32):** catalogInventoryCreateAndEdit, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeApArData, seeFinancialData, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersDelete, workOrdersView
- **Service Advisor (26):** catalogInventoryCreateAndEdit, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesView, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeFinancialData, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersView
- **Foreman (23):** catalogInventoryCreateAndEdit, catalogInventoryView, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, partSalesView, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeFinancialData, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersView
- **Parts Manager (31):** catalogInventoryCreateAndEdit, catalogInventoryDelete, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleView, seeApArData, seeFinancialData, settingsDataImport, settingsFinance, settingsParts, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrdersCreateAndEdit, workOrdersView
- **Parts Tech (19):** catalogInventoryCreateAndEdit, catalogInventoryView, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, partSalesCreateAndEdit, partSalesView, scheduleView, seeFinancialData, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, workOrdersView
- **Office (22):** billingPortalPageAccess, catalogInventoryView, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsView, partSalesView, reportsPageAccess, scheduleView, seeApArData, seeFinancialData, settingsApp, settingsDataImport, settingsFinance, settingsService, settingsWages, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, workOrdersView
- **Sales Representative (4):** reportsPageAccess, seeApArData, seeFinancialData, woFullViewMode
- **Technician (6):** customersView, scheduleView, woPickParts, woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView
- **Time Clock (0):** (none)

---

## Env-drift note (roster only — not a permission drift)

`GET /api/organizations/{org}/roles` returns **12** roles: the 11 system roles above
**plus one leftover custom role** — **"Bilal CRPT - Random"** (`c24d9f7b-c709-429c-
be25-557aa84ab7b0`, view_mode=full, 41 perms — an Admin-clone, almost certainly a
Custom Roles project artifact left on this shared org). It is **not assigned to
Tech** and does not affect the Simple Flow matrix. Harmless; noted only because the
shared env roster is not the clean 11-role set. No action needed for the wording/VIU
pass.

## Bottom line for the upcoming wording + VIU pass
- Matrix is **accurate and unchanged** from the last authored baseline — the 11-role
  permission set (incl. Technician) has **not drifted** on sv7301. Proceed with the
  §9.2 / SF-PERM matrix as-is.
- Tech is on **Technician** and ready to use directly; role-swap for other-role
  probes remains self-service (`POST /api/staff/{staff_id}/change`, restore
  `131b5274-…` after, exact email match `tech@shopview.com`).
