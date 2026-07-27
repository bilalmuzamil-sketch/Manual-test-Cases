# Regression sweep — live environment facts (2026-07-27)

- Env: app.staging.shopview.com / api.staging.shopview.com ; org d55bc308-e61a-438d-b5f1-c7a73c89d49f
- Cookies verified: POST /api/quick-login {admin} -> 200 ; {tech} -> 200 (STEP 0 OK)
- Org ENABLED feature flags (GET /api/organization/feature-flags?organization_id=<org>):
  CustomerPortal, **FeesAndDiscounts (ON)**, ShopPay, BillingPortal, QuickBooks, ShopCoach
  => FeesAndDiscounts flag is ON, so SV-8701 is testable on this org.
- 43 permission atoms catalog captured (GET /api/fe-permissions).
- 24 roles in org (11 canonical system roles + 13 leftover custom test roles from other sessions).

## Impersonation method
- POST /api/switch-user {user_id}  (user_id = staff 'id' field)
- EXIT: POST /api/exit-switch-user  (GET /api/switch-user?_switch_user=_exit does NOT clear a stuck flag)
- Vehicle staff for role tests: Henry Hess (user_id 0687da3b-0f7b-41a4-b24c-616c5a9dc056,
  staff_id 21bb7388-2e45-4025-bfd8-a4c2e306e9f6, a confirmed+active @staging.shopview.local Technician).
  Method: assign a purpose-built ZZAUTOTEST role via POST /api/staff/{staff_id}/change, impersonate, test, restore.
- CONTENTION NOTE: a CONCURRENT session shares this dev-admin; switch-user intermittently returns
  400 "already impersonating" or 403 "Access denied". Mitigated with exit-first + retry-loop (Rule 26a).
  Some SWITCH-200 windows are brief; every verdict below was captured with the role's exact atoms
  confirmed live via GET /api/auth/me/fe-permissions in the same session.

## ZZAUTOTEST roles created (to be deleted in cleanup)
- ZZAUTOTEST-SV8682  f6646891-a3ad-4f92-8e93-29ad7855be25  = vendorOrderManagementView + seeFinancialData (Reports OFF)
- ZZAUTOTEST-SV8701  6ad32106-2b56-488c-934d-429e6f835da5  = customersCreateAndEdit + customersView + seeFinancialData + seeApArData (no org grants)
- ZZAUTOTEST-SV8701neg 602a59f3-bd07-4129-bc1c-55a7be8c690b = customersCreateAndEdit + customersView + seeFinancialData (NO seeApArData)
- ZZAUTOTEST-SV8541  3b84eff1-67fc-44f4-b91b-01704aae07b8  = workOrdersView only (NO workOrderLinesCreateAndEdit)
- Henry Hess original role = Technician (50bf6a0d-f1be-42b2-bb06-4f821b5caa6a) — RESTORE at cleanup.
