# Custom Roles — LIVE Roles Matrix (STAGING) — 2026-07-13

> Read-only recon capture taken before the build-accurate wording + VIU pass
> (BUILD-ACCURATE-WORDING-VIU-PROCESS.md, precondition step 4: re-derive the live
> roles matrix because shared envs drift). **No Tech role switch was performed**
> (read-only). Secrets live in `/tmp` only.

## Env & access verdict
- **Custom Roles env = STAGING**: SPA `app.staging.shopview.com`, API
  `api.staging.shopview.com`. Confirmed live (not qa).
- **cf_clearance verdict:** the supplied `cf_clearance` (issued in the qa
  Cloudflare context) **WORKS against staging** — no Cloudflare challenge (no
  403/503 challenge HTML). Cloudflare passed on every call. The QA lead does **not**
  need to supply a new cf_clearance.
- **Backend health:** UP. `POST /api/quick-login {key:'admin'}` → **200**;
  `{key:'tech'}` → **200** (sequential). `GET /api/auth/me/fe-permissions` → **200**
  for both after login. Note: quick-login **rotates PHPSESSID** on each call — the
  new `Set-Cookie: PHPSESSID` must be carried into the follow-up GET (combined with
  the original `sv_sso_session` + `cf_clearance`), else the GET 401s `sso_required`.
  A bare GET before quick-login returns 409 "Session has expired" (expected).
- Cookie file (not in repo): `/tmp/custom-roles/cookies-viu-0713.env` (chmod 600).
- Org UUID: **d55bc308-e61a-438d-b5f1-c7a73c89d49f**.

## How captured
- Roles list: `GET /api/organizations/{org}/roles` → 14 roles (200).
- Per-role permission sets + cross-toggles + view mode: `GET /api/roles/{id}` (200 each).
- Tech effective perms: `GET /api/auth/me/fe-permissions` right after
  `POST /api/quick-login {key:'tech'}`.

## IMPORTANT — role-id and Tech-baseline drift to flag
- **Staging role IDs differ from the qa/sv7301 IDs in CLAUDE.md.** Use the staging
  IDs below for any Custom Roles work on `app.staging.shopview.com`.
- **CLAUDE.md's Custom-Roles "Time Clock role `77b069d1-...`" restore-target id does
  NOT exist on staging.** Staging's **Time Clock User = `a0359055-3dfb-4e9c-9e11-2fbea21585c2`**.
  If Tech must be restored to the Time Clock baseline on staging, use `a0359055…`.
- **Tech is CURRENTLY on the Technician role, NOT the Time Clock baseline.** Tech's
  live effective perms (6) = the Technician role set exactly
  (`customersView, scheduleView, woPickParts, woTechViewMode,
  workOrderLinesCreateAndEdit, workOrdersView`; view_mode `tech`; all cross-toggles
  false). So the shared env has Tech drifted to Technician — **WO/permission
  negatives that assume the Time-Clock baseline are not valid until Tech is reset.**
  (Read-only recon: not changed here.)
- Admin (`admin@shopview.com`, staff `0eabf741…`) is on the **Admin** role (`21242921…`).
- Tech staff-list id `a7fd0a88-95e5-4b4c-a3b8-7268b57f864f` (per CLAUDE.md the
  `/change` staff_id is `6fb22c1b…`; the list id 404s on `/change`).

## 11 SYSTEM roles (default=true) — permission counts, view mode, cross-toggles

| Role | Role ID (staging) | view_mode | SFD | AP/AR | HistLogs | #perms | editable |
|---|---|---|---|:--:|:--:|:--:|---:|:--:|
| Admin | 21242921-7e7a-4a86-a2fb-2248e77fc244 | full | ✓ | ✓ | ✓ | 42 | yes |
| Service Manager | 3e6e298c-d48d-4d6a-b784-91cbf458e9ec | full | ✓ | ✓ | ✓ | 35 | yes |
| Senior Service Advisor | 4d7a6b68-2c35-4eb4-a891-63c9d6edb970 | full | ✓ | ✓ | ✓ | 32 | yes |
| Service Advisor | 7b319764-966e-4478-b70a-77860fbd832f | full | ✓ | ✗ | ✓ | 26 | yes |
| Foreman | 5858ffa4-3593-4c14-81e5-62a8992a324b | full | ✓ | ✗ | ✓ | 23 | yes |
| Technician | 8345d191-3d0a-4ec2-ae48-f1f275eefb49 | tech | ✗ | ✗ | ✗ | 6 | yes |
| Parts Manager | 37313d18-2a25-4272-801f-be421f798c2b | full | ✓ | ✓ | ✓ | 31 | yes |
| Parts Technician | 8d739c93-ce17-4b85-9951-d49633ead699 | full | ✓ | ✗ | ✓ | 19 | yes |
| Office User | 441f5f3b-3a9a-4f44-9381-467b5acbd577 | full | ✓ | ✓ | ✓ | 23 | **no** |
| Sales Representative | de235f16-2ab8-4c16-a55c-19c70950c91a | full | ✓ | ✓ | ✗ | 4 | yes |
| Time Clock User | a0359055-3dfb-4e9c-9e11-2fbea21585c2 | (none) | ✗ | ✗ | ✗ | 3 | **no** |

SFD = seeFinancialData · AP/AR = seeApArData · HistLogs = viewHistoryLogs (cross_toggles).
Office User and Time Clock User are `editable=false`; none are `deletable`.

## 3 CUSTOM roles present on staging (default=false — throwaway/test artifacts)
| Role | Role ID | view_mode | #perms | note |
|---|---|---|---:|---|
| Bilal - Cus | da9a5ca8-0474-4639-8a6a-521c37e5adf1 | tech | 40 | near-Admin custom role |
| Parth Cust1 | 7ede354a-c8dd-4087-8531-c0cbe6f8759e | (none) | 1 | only `settingsIntegrations` |
| Cust0m | e8f54000-170c-47e8-b78b-226c85eae29d | — | — | detail not re-fetched this pass |

## Full permission sets (system roles)

**Admin (42):** billingPortalPageAccess, catalogInventoryCreateAndEdit, catalogInventoryDelete, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeApArData, seeFinancialData, settingsApp, settingsDataImport, settingsFinance, settingsIntegrations, settingsParts, settingsService, settingsWages, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersDelete, workOrdersView

**Service Manager (35):** billingPortalPageAccess, catalogInventoryCreateAndEdit, catalogInventoryDelete, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeApArData, seeFinancialData, settingsApp, settingsWages, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersView
*(no invoicingPaymentsDelete; no workOrdersDelete)*

**Senior Service Advisor (32):** catalogInventoryCreateAndEdit, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeApArData, seeFinancialData, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersDelete, workOrdersView
*(no billingPortalPageAccess; no settings*; no customersDelete)*

**Service Advisor (26):** catalogInventoryCreateAndEdit, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesView, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeFinancialData, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersView
*(AP/AR OFF; no partSalesDelete; no reportsPageAccess; no vendorOrderManagementDelete)*

**Foreman (23):** catalogInventoryCreateAndEdit, catalogInventoryView, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, partSalesView, scheduleCreateAndEdit, scheduleDelete, scheduleView, seeFinancialData, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrderLinesDelete, workOrdersCreateAndEdit, workOrdersView
*(has Parts/Vendor View+C&E and partSalesView — relevant to run-331 §4 flagged Foreman-premise cases)*

**Technician (6):** customersView, scheduleView, woPickParts, woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView
*(view_mode tech; = Tech's current live effective set)*

**Parts Manager (31):** catalogInventoryCreateAndEdit, catalogInventoryDelete, catalogInventoryView, customerPortalPageAccess, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsDelete, invoicingPaymentsView, partSalesCreateAndEdit, partSalesDelete, partSalesView, reportsPageAccess, scheduleView, seeApArData, seeFinancialData, settingsDataImport, settingsFinance, settingsParts, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, woReviewWorkOrders, workOrderLinesCreateAndEdit, workOrdersCreateAndEdit, workOrdersView

**Parts Technician (19):** catalogInventoryCreateAndEdit, catalogInventoryView, customersCreateAndEdit, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, partSalesCreateAndEdit, partSalesView, scheduleView, seeFinancialData, timesheetsView, vendorOrderManagementCreateAndEdit, vendorOrderManagementDelete, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, woOrderParts, woPickParts, workOrdersView
*(no workOrdersCreateAndEdit; no workOrderLinesCreateAndEdit)*

**Office User (23):** billingPortalPageAccess, catalogInventoryView, customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsView, partSalesView, reportsPageAccess, scheduleView, seeApArData, seeFinancialData, settingsApp, settingsDataImport, settingsFinance, settingsIntegrations, settingsService, settingsWages, timesheetsCreateAndEdit, timesheetsView, vendorOrderManagementView, viewHistoryLogs, woFullViewMode, workOrdersView
*(WO View only — no workOrdersCreateAndEdit/Delete, no workOrderLines*, no invoicingPaymentsCreateAndEdit → confirms "Office users cannot create invoices"; relevant to run-331 §4 flagged Office-premise cases C2565/C2567/C2480)*

**Sales Representative (4):** reportsPageAccess, seeApArData, seeFinancialData, woFullViewMode

**Time Clock User (3):** scheduleView, timesheetsView, workOrdersView
*(view_mode none; the Custom-Roles Tech baseline)*

## Notes for the VIU pass
- **11 system roles shipped** (matches the spec fact). All are `default=true`.
- These live sets are the authority for adjudicating FE display-gate permission
  cases; the backend only enforces resource-level View/Create&Edit (per RUN331-STATE
  §8 enforcement model).
- **Before any permission negative test, reset Tech** from Technician back to the
  intended baseline for that case (Time Clock User `a0359055…` for the Custom-Roles
  baseline), then RESTORE afterward. Use EXACT email match `tech@shopview.com`.
