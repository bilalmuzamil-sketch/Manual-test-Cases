# Custom Roles & Permissions — FULL per-role Regression Sweep (v0.68 / v0.69)
**Date:** 2026-07-27 · **Env:** app.staging.shopview.com / api.staging.shopview.com · **Org:** d55bc308-e61a-438d-b5f1-c7a73c89d49f
**Method (live, evidence-based; Rules 10/12/13/14/15/24/25/26):** for each of the 11 canonical system roles —
(1) RESET the canonical role to its template defaults via `PUT /api/roles/{id}` (fePermissions = template atom IDs
from `GET /api/role-templates/{templateId}/fe-permissions`), verify read-back == template;
(2) assign the reset canonical role to a single controlled vehicle staff (Henry Hess, confirmed+active) via
`POST /api/staff/{staff}/change`; (3) impersonate Henry via `POST /api/switch-user` (exit-first retry loop for the
concurrent-session lock, Rule 26a); (4) confirm the impersonated `GET /api/auth/me/fe-permissions` == template atoms;
(5) drive each affected page LIVE in Chromium and capture EVERY `/api` response status + final URL + on-screen state +
screenshot; (6) `POST /api/exit-switch-user`. **No TestRail writes. No run touched.** Secrets in /tmp only.
TestRail link pattern: https://shopview.testrail.io/index.php?/cases/view/<id>

## Why this run exists
The prior sweep (SWEEP-FINDINGS.md, commit 1ae6d30) found NO new broken permissions in the combos it tested and
verified the 3 known tickets, but could NOT individually UI-drive all 11 canonical roles across every affected page
(concurrent session held the switch-user lock + kept re-drifting Technician). This run closes that coverage gap.

## Pages driven per role (10)
Parts → Vendors (`/parts/vendors`), Purchase Orders (`/parts/orders`), Deliveries (`/parts/deliveries`),
Vendor Invoices (`/parts/vendor-invoices`), Returns (`/parts/returns`); Customer detail (`/customers/{id}`) +
Fees & Discounts tab (`/customers/{id}/fees-and-discounts`, F&D flag ON); AP/AR aging (`/accounting/aging`);
Reports (`/reports`); F&D admin/settings (`/administration/adjustment-templates`).

## Live template matrix (fetched live this run — Rule 15)
Admin 42 · Service Manager 36 · Senior Service Advisor 31 · Service Advisor 25 · Foreman 23 · Technician 6 ·
Parts Manager 31 · Parts Technician 19 · Office User 25 · Sales Representative 8 · Time Clock User 3 atoms.

## Drift at start (live, before any test)
10/11 CLEAN == template. **Technician DRIFTED** (11 vs 6: +customersCreateAndEdit, +seeApArData, +seeFinancialData,
+settingsFinance, +woFullViewMode, +workOrdersCreateAndEdit; −woTechViewMode) — matches the known concurrent-session
re-drift. RESET to template this run (PUT 200, read-back 6/6 match).

---
## Per-role × page results
Legend: **LOAD** = page renders, 0 relevant 4xx, no route-guard, no denied text (PASS).
**GUARD** = FE route-guard redirect away from the page (normal FE gate, PASS).
**4xx** = a backend call on the page returned >=400 (recorded; classified).
