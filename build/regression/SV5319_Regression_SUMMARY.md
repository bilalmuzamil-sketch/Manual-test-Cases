# SV5319 Regression - Consolidated Summary

Compiled: 2026-07-03 | Roles covered: 11 | Deliverable: `SV5319_Regression_Results.xlsx` (+ CSVs and layman failures report)

## Overall counts

| Metric | Count |
|---|---|
| Total cases | 94 |
| PASS | 81 |
| FAIL | 13 |
| PARTIAL | 0 |

Flagged cases (see `results/AUDIT-flagged-cases.json`) were re-tested with **real action execution** on disposable staging data rather than by observing controls alone.

## Per-role verdict (one line each)

| Role | Total | PASS | FAIL | Verdict |
|---|---|---|---|---|
| Administrator | 14 | 14 | 0 | Full access confirmed everywhere; 5 previously-observed cases re-run with real deletes/reverses/note-edits. |
| Service Manager | 10 | 6 | 4 | Operational access works, but the staging role carries Work Orders: Delete (SV-8093) so SM can reverse invoices and delete others' notes, and Settings is over-exposed. |
| Senior Service Advisor | 9 | 9 | 0 | Full advisor access confirmed; flagged invoicing/return/line-delete cases re-executed end-to-end. |
| Service Advisor (Junior SA) | 9 | 8 | 1 | Correct throughout except AP/AR customer tabs unlock via the invoicing-delete permission. |
| Foreman | 8 | 8 | 0 | All checks pass. |
| Technician | 13 | 10 | 3 | Pricing/Tech View correctly hidden in UI, but the API still allows line-authorize, WO header edit, and order-parts. |
| Parts Manager | 7 | 6 | 1 | Full parts/vendor control confirmed; only part-sale delete fails (blocked by the wrong permission gate). |
| Parts Technician | 7 | 5 | 2 | Create/view correct, but catalog-part delete and return delete are not blocked at the API. |
| Office | 7 | 6 | 1 | View-only holds in the UI, but the API accepts catalog-part edits from this view-only role. |
| Sales Representative | 5 | 5 | 0 | All checks pass. |
| Time Clock | 5 | 4 | 1 | Returns / Data Import / customers correctly blocked (403), but notes and other WO writes reach the backend. |

## All FAILs (role, case, one-line)

1. **Service Manager 11** - Service Manager was able to fully reverse a work-order invoice end-to-end (expected: blocked).
2. **Service Manager N2** - Service Manager could reverse a work-order invoice end-to-end (expected: blocked); staging role carries Work Orders: Delete per SV-8093.
3. **Service Manager 14** - Settings area is not limited to App Settings + Wages; Staff, Roles & Permissions, Locations, Departments and Feature Flags all open and are editable.
4. **Service Manager N3** - Service Manager could delete another user's work-order note (expected: only own notes editable).
5. **Service Advisor 26** - AP/AR customer tabs are visible and load real data even though AP/AR is OFF (they unlock via the invoicing-delete permission).
6. **Technician 35** - Technician could authorize/approve a work-order line via the API despite the control being hidden and lacking Create and Edit.
7. **Technician 37** - Technician could change a work-order header field (service advisor) via the API despite being View-only.
8. **Technician 41** - Technician could order a part via the API despite Order Parts being OFF.
9. **Parts Manager 44** - Part-sale delete: the Delete control is shown but the API returns Access Denied (gated by the wrong permission).
10. **Parts Technician 49** - Parts Technician could delete a catalog part via the API despite having no delete permission.
11. **Parts Technician N1** - Parts Technician could delete a part return despite lacking Invoicing & Payments: Delete (v33/SV-7911 gate not enforced).
12. **Office 55** - Office (view-only) could edit a catalog part via the API despite all edit controls being hidden.
13. **Time Clock N1** - Time Clock could create a work-order note via the API despite being the most restricted role.

## Systemic finding: backend enforcement gaps

The dominant cross-role pattern this session: **granular permissions are enforced only on the front-end for several roles while the API accepts the action.** The UI correctly hides or locks the control, but posting the exact request the UI would send succeeds (HTTP 200/201) with no server-side permission check. Affected permissions/actions include:

- **line-authorize** (Technician 35 - `work-orders/lines/change-status` returns 200 for a role without Create and Edit)
- **WO header edit** (Technician 37 - `work-orders/change-service-advisor` and the `change-*` family return 201 for View-only)
- **order-parts** (Technician 41 - `perform-request-status-action action:order` returns 201 with Order Parts OFF)
- **catalog delete** (Parts Technician 49 - `parts-catalogue/remove-catalogue-part` returns 200 with no delete permission)
- **return delete** (Parts Technician N1 - `work-orders/part/remove-return-request` returns 200; still gated by the old Vendor & Order Delete rather than v33/SV-7911's Invoicing & Payments: Delete)
- **catalog edit** (Office 55 - `parts-catalogue/change-catalogue-part` returns 200 and persists from a view-only role)
- **note-create** (Time Clock N1 - `note/create` returns 201 for the most restricted role; `note/update`, `note/delete`, `lines/create`, `lines/change-status`, `tasks/create`, `parts/create`, `invoices/create` all reach validation (400), not denial (403))

A related but distinct sub-pattern is **wrong-permission gating**: part-sale delete is wired to Work Orders: Delete instead of Part Sales: Delete, so Parts Manager sees a Delete control that always 403s (Parts Manager 44); and the AP/AR customer tabs are OR-gated by the invoicing-delete permission, so they unlock for the Service Advisor even with AP/AR OFF (Service Advisor 26).

See the **"Backend-Enforcement Gaps"** tab in the Excel workbook for the per-case endpoint / what-happened / why-it's-a-gap breakdown.

## Methodology

- **Role switching:** logged in as the Tech user, then assigned each system role via `/change` so a single account exercised all 11 roles.
- **Real execution:** actions were actually performed (not just observed) against **disposable staging data**; ZZAUTOTEST markers were used and cleaned up afterward.
- **Two-way checks:** where the spec expects a block, both the UI (control hidden/locked) and the API (posting the exact UI request) were checked, which is how the backend-enforcement gaps surfaced.
- **Preconditions handled:** received/numbered parts staged for pick/order/return flows; Review completed where required; a clean (non-over-limit) customer used for invoicing; and the correct WO/line status set before delete/authorize actions.

## Known caveats

- **Headless-undrivable widgets:** a few Quasar widgets could not be driven headless, so after confirming the gate was reachable in the UI the action was issued directly to the exact UI endpoint. This is disclosed per affected case in the notes.
- **WO-create API 500 quirk:** the work-order create endpoint returned intermittent 500s this session; throwaway WOs were reused where creation was flaky.
- **Admin N3 (part-sales reverse):** recommended for a manual spot-check - end-to-end part-sales reverse could not be finalized cleanly (over-limit throwaway customer), though the capability/gate was confirmed reachable.
- **Role-config vs spec mismatches (not code bugs in enforcement):**
  - The system-default **Service Manager** role on staging includes **workOrdersDelete** (SV-8093), which under spec v33 gates invoice reversal and edit/delete of all notes - so SM 11 / N2 / N3 "fail vs expected BLOCKED" because the role genuinely holds the permission, not because enforcement is broken.
  - The **Time Clock** role grants **workOrdersView / scheduleView**, giving it more read visibility than the "most restricted" description implies.
  - The **Service Manager** Settings surface exposes Staff, Roles & Permissions, Locations, Departments and Feature Flags despite the role description of "App Settings + Wages only" (SM 14; Departments grouping under review per SV-7781).
