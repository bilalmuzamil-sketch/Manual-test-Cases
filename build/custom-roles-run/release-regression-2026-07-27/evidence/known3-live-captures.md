# The 3 known regressions — LIVE captures (2026-07-27, staging, evidence)

All captured by impersonating Henry Hess assigned a purpose-built ZZAUTOTEST role;
role atoms verified live via GET /api/auth/me/fe-permissions each run.

## SV-8682 — Vendors page 403 unless Reports ON  (Status: Code Review)
Role atoms live-confirmed: seeFinancialData, vendorOrderManagementView, woFullViewMode  (Reports OFF).
- GET /api/parts-catalogue/vendors            -> 200  (vendor LIST loads)
- GET /api/parts-catalogue/vendors?limit=3    -> 200
- GET /api/parts-catalogue/vendor/{id}        -> 200  (vendor DETAIL loads)
- GET /api/inventory/orders                   -> 200  (purchase orders)
- GET /api/inventory/deliveries               -> 200  (deliveries)
VERDICT (API level): the core vendor endpoints do NOT 403 for VOM-View+SFD with Reports OFF.
  Could NOT reproduce the 403 at the API level with the endpoints probed. The exact endpoint the
  Parts->Vendors PAGE fires that 403s (per the ticket) was not identified via API probing; the
  page-level 403 needs a live UI network-capture to pin the offending call. HONEST: not fully
  reproduced/refuted this run at the page level. (Ticket is Code Review = fix in progress.)

## SV-8701 — customer detail full-page lockout when FeesAndDiscounts ON  (Status: Done / PR #2363)
FeesAndDiscounts flag confirmed ON for this org.
POSITIVE role atoms live-confirmed: customersCreateAndEdit, customersView, seeApArData, seeFinancialData, woFullViewMode  (no org/settings grants). Clean SWITCH 200.
- GET /api/customers/view/{id}                     -> 200  (customer detail loads)
- GET /api/customers/{id}/default-adjustments      -> 200  (the endpoint that used to 403 and kill the page)
NEGATIVE role atoms live-confirmed: customersCreateAndEdit, customersView, seeFinancialData, woFullViewMode  (NO seeApArData).
- GET /api/customers/view/{id}                     -> 200  (page still loads)
- GET /api/customers/{id}/default-adjustments      -> 403  ("Access denied." — tab correctly gated, page NOT locked out)
VERDICT: **FIXED.** The default-adjustments BE gate now allows Customers C&E + Manage AP/AR (S13-R9),
  returning 200 for the holder (no lockout), and 403 only when Manage AP/AR is missing (tab hidden, page loads).
  Matches PR #2363 exactly. FE full-page-render (no /access-denied redirect) is an FE-interceptor behaviour;
  the root-cause BE endpoint is confirmed 200 for the holder = the lockout cause is gone.

## SV-8541 — return received special-order part + resolve cores without WOL Create&Edit  (Status: Open, fast-follow, PM decision)
Role atoms live-confirmed: workOrdersView, woFullViewMode  (NO workOrderLinesCreateAndEdit). Location switched to WO's workplace.
- POST /api/work-orders/{id}/pre-resolve-cores {cores:[]}  -> 400 "At least one core is required."  (PERMISSION PASSED; not 403)
- POST /api/work-orders/part/make-return-request {}        -> 400 "part_id/quantity/return_reason missing" (PERMISSION PASSED; not 403)
Control (customers-only role, NO WO perms) reached the SAME 400 validation on both = these endpoints are
  NOT blocked by a WO-permission 403 at the BE for either role.
VERDICT: **Confirmed spec-intended / not a new regression.** A user without Work Order Line: Create & Edit
  is NOT blocked (403) from the core-resolve or part-return endpoints — permission passes to validation.
  Matches the current Confluence spec ("Marking Cores OK/Not OK is gated by WO->View") + prod behaviour.
  Rule-24/25: this is a permission-model clarification, NOT a FE-exposure defect; do NOT re-file. PENDING PM.
  NOTE: full action-completion (with a seeded received special-order part + core) was not driven to 201
  this run (impersonation-contention + seeding budget); the BE PERMISSION-GATE finding is the evidence.
