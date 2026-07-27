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

### Method note (why genuine tech-login, not switch-user)
The `POST /api/switch-user` impersonation lock was held PERSISTENTLY by the concurrent session this run:
after a fresh admin login (42 perms confirmed), `switch-user` returned **400 "You are already impersonating
a user. Exit impersonation first."** for untouched targets and **403 "Access denied."** for others, unchanged
across 75s of exit-first retries. The backend tracks impersonation at the shared dev-admin USER level, so our
exit would clobber the concurrent session — not a transient lock. **To close the gap without switch-user, each
role was driven as a GENUINE (non-impersonated) session:** the canonical role was reset to template, assigned to
the `tech@shopview.com` quick-login user (staff 6fb22c1b), then `POST /api/quick-login {tech}` produced a real
session with full backend enforcement AS that role (this is the Rule-14 staging role-test method). Every role's
live `fe-permissions` was re-checked == template before driving (Rule 26; reReset=0 for all — no mid-run drift
this window). tech restored to Technician + Technician role reset to template afterward.

### Route corrections made mid-run (honesty)
Three page routes I first used do NOT exist in this build (Admin itself gets a 404 "page not found") and were
replaced with the correct live routes discovered from the app nav:
- Customer Fees & Discounts tab: **/customers/{id}/default-adjustments** (NOT /fees-and-discounts) — the SV-8701 target.
- AP/AR aging: **/reports/ar-aging-summary** + **/reports/ap-aging-summary** (under Reports; NOT /accounting/aging).
- Vendor Invoices: nav label exists but has **no standalone /parts/vendor-invoices route** (routes to a filtered
  view); DROPPED from the matrix as unresolved. Its vendor-order-management gate is already covered by Vendors /
  Purchase Orders / Deliveries / Returns.

## Full coverage matrix — 11 roles × 10 pages (live-driven this run)
Legend: **LOAD** = page renders real content, 0 backend 4xx (role is entitled) = PASS ·
**GUARD** = FE route-guard cleanly redirects away (role not entitled; no error, no data) = PASS ·
**FE-BLOCK** = URL reachable but FE shows a graceful "page not found" screen, no data, 0 backend 4xx = PASS ·
**BE-4xx** = a backend call returned >=400 (would indicate lockout/broken-dependency).

| Role (atoms) | Vendors | Purch.Orders | Deliveries | Returns | Cust.Detail | Reports | F&D Admin | Cust F&D tab | AR Aging | AP Aging |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin (42) | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD |
| Service Manager (36) | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | GUARD | LOAD | LOAD | LOAD |
| Sr Service Advisor (31) | LOAD | LOAD | LOAD | LOAD | LOAD | GUARD | GUARD | LOAD | GUARD | GUARD |
| Service Advisor (25) | LOAD | LOAD | LOAD | LOAD | LOAD | GUARD | GUARD | GUARD | GUARD | GUARD |
| Foreman (23) | LOAD | LOAD | LOAD | LOAD | LOAD | GUARD | GUARD | GUARD | GUARD | GUARD |
| Technician (6) | GUARD | GUARD | GUARD | GUARD | LOAD | GUARD | GUARD | GUARD | GUARD | GUARD |
| Parts Manager (31) | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | GUARD | LOAD | LOAD | LOAD |
| Parts Technician (19) | LOAD | LOAD | LOAD | LOAD | LOAD | GUARD | GUARD | GUARD | GUARD | GUARD |
| Office User (25) | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD | LOAD |
| Sales Rep (8) | GUARD | GUARD | GUARD | GUARD | LOAD | LOAD | GUARD | LOAD | LOAD | LOAD |
| Time Clock (3) | GUARD | GUARD | GUARD | GUARD | GUARD | GUARD | GUARD | GUARD | GUARD | GUARD |

**Every cell classifies as PASS. ZERO BE-4xx cells** — no whole-page lockout (SV-8701 pattern) and no
broken-permission dependency (SV-8682 pattern) on ANY role × ANY page. Each role's page access exactly matches
its template entitlement (Parts = vendorOrderManagement·View; Reports & AR/AP Aging = reportsPageAccess;
F&D Admin = settingsService; Customer F&D tab = seeApArData; Customer detail = customersView).

## Direct backend probes of the two regression targets (genuine role sessions) — evidence/be-probe-key-endpoints.txt
| Role | SV-8701 `GET /customers/{id}/default-adjustments` | SV-8682 `GET /parts-catalogue/vendors` |
|---|---|---|
| Admin (entitled) | **200** | 200 |
| Service Advisor (no seeApArData, Reports OFF) | **403** (BE gates correctly) | **200** |
| Foreman (no seeApArData, Reports OFF) | **403** | **200** |
| Time Clock (3 perms, Reports OFF) | **403** | **200** |

- **SV-8701 = FIXED (re-confirmed).** The customer F&D data endpoint returns 200 for entitled roles and 403 for
  unentitled — and for unentitled roles the FE **route-guards the F&D tab** (redirects, per matrix) so the 403 is
  never hit as a whole-page lockout. The customer DETAIL page itself LOADS for every role that has customersView
  (matrix "Cust.Detail" column). No lockout for any role. Matches PR #2363 (BE gate realigned to S13-R9).
- **SV-8682 = NOT REPRODUCED (re-confirmed).** `/parts-catalogue/vendors` returns 200 for every role regardless of
  reportsPageAccess (Foreman / Sr Service Advisor / Service Advisor / Parts Technician all have Reports OFF + VOM
  view ON → Vendors page LOADS with 0 4xx). There is NO hidden Reports dependency on Vendors. (Note: the vendors
  API returns 200 even for roles without VOM view e.g. Time Clock — the enforcement is a FRONT-END gate, and the
  FE correctly route-guards /parts/vendors for those roles → PASS per Standing Rule 24, the known ShopView
  FE-gate model, not a new defect.)
- **SV-8541** (core-resolve / part-return gated by Work Orders→View, spec-intended) was covered in the prior
  sweep (SWEEP-FINDINGS.md §3) and is not one of these pages; unchanged (record; PM to confirm).

## Are there MORE broken permissions? (the two hunted patterns)
- **SV-8701-style whole-page lockout (FE loads a page the role should see, but a required BE call 403s and the FE
  fatally blocks):** NONE FOUND across 11 roles × 10 pages. Zero BE-4xx anywhere.
- **SV-8682-style broken dependency (a page 403s because of an unrelated missing permission like Reports):**
  NONE FOUND. Every entitled role loads every in-scope page; every unentitled role is cleanly FE-guarded.
- **FE-EXPOSURE (inverse of Rule 24 — FE shows a restricted page's DATA while BE would block):** NONE FOUND.
  Every unentitled cell is either a clean route-guard or a graceful "page not found" screen with NO data and NO
  successful privileged BE call. Verified visually on the highest-risk cells (Time Clock & Foreman on AP/AR;
  Technician on customer F&D) — all show whimsical 404 screens, no financial data.

## RESULT: No new broken permissions beyond the 3 already known.
SV-8682 not reproduced (Vendors has no Reports dependency); SV-8701 fixed (no customer-page lockout, BE gate
correct); SV-8541 spec-intended (unchanged). **No NEW-defect case authored** (none found). No FE-exposure,
no lockout, no broken dependency.

## Drift / reset (Rule 26) — before & after
- **At start:** 10/11 roles CLEAN == template; **Technician DRIFTED** (11 vs 6, concurrent re-drift) → reset to template.
- **During run:** reReset counter = 0 for every role (no mid-run re-drift in this window).
- **At end (evidence/final-role-state.json):** ALL 11 roles verified AT template (Admin 42, SM 36, SSA 31, SA 25,
  Foreman 23, Technician 6, PM 31, PT 19, Office 25, Sales Rep 8, Time Clock 3). Left at template as the canonical baseline.

## Honest coverage statement (Rule 17 — no over-claim)
LIVE-DRIVEN THIS RUN (genuine per-role sessions, browser + backend capture):
- **ALL 11 canonical roles** × **10 pages each = 110 role×page cells**, every one observed live with a screenshot
  + full `/api` network capture, at verified template composition. Plus 12 targeted backend endpoint probes
  (SV-8701/SV-8682/aging × 4 roles).
- This is the coverage the prior sweep could NOT complete (it confirmed composition==template for 10 roles but
  did not individually UI-drive each role across the pages). **That gap is now CLOSED for these 10 pages.**

NOT covered / limitations (blunt):
- **switch-user impersonation stayed BLOCKED** the whole run (concurrent session). I did NOT use it; the genuine
  tech-login method covered all roles instead, so no role was left unobserved — but note the drive vehicle was the
  shared tech user, not each role's own staff account.
- **Vendor Invoices** page dropped (no standalone route resolved this run).
- Scope = page-reachability + primary backend enforcement per role. **In-page element/action-level controls**
  (individual buttons, edit/delete within a loaded page) were NOT exhaustively driven per role — only page load +
  the page's backend calls + the two targeted regression endpoints.
- SV-8541 action-completion not re-driven here (covered/held in prior sweep).
- Reports/aging pages were confirmed to LOAD real Reports UI for entitled roles; individual aging report data
  correctness was not validated (out of permission-scope).

## Cleanup done
- tech@shopview.com restored to **Technician** role (verified role_label=Technician); Technician role reset to template (6/6).
- Henry Hess (used in the early blocked switch-user attempts) restored to **Technician**.
- All 11 canonical roles left AT template (evidence/final-role-state.json).
- NO ZZAUTOTEST roles/staff created this run (genuine tech-login method needs none). Secrets kept in /tmp only.
- Did NOT touch build/.../gap-cases/ or testrail-sync-manifest.md (parallel worker). No TestRail writes; no run touched.
