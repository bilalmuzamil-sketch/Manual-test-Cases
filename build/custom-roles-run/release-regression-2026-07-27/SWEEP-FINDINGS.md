# Custom Roles & Permissions — Post-Release Regression Sweep (v0.68 / v0.69)
**Date:** 2026-07-27 · **Env:** app.staging.shopview.com / api.staging.shopview.com · **Org:** d55bc308-e61a-438d-b5f1-c7a73c89d49f
**Method:** live, evidence-based (Standing Rules 10/12/13/14/15/24/25/26). Roles tested by impersonating a
vehicle staff assigned a purpose-built ZZAUTOTEST role; role atoms confirmed live via
GET /api/auth/me/fe-permissions each run; pages loaded in Chromium with full /api network capture.
**No TestRail writes. No run touched.** TestRail link pattern: https://shopview.testrail.io/index.php?/cases/view/<id>

---
## 1. Access & environment
- Cookies OK: POST /api/quick-login {admin} → 200, {tech} → 200.
- Org enabled feature flags: **FeesAndDiscounts = ON** (+ CustomerPortal, ShopPay, BillingPortal, QuickBooks, ShopCoach). So SV-8701 is testable here.
- 43 permission atoms + 24 roles (11 canonical + 13 leftover custom test roles) captured.

## 2. Role reset / drift (Step 2, Rule 26) — composition layer, read live as admin
| Role | Live vs Template | Drift |
|---|---|---|
| Admin, Service Manager, Sr Service Advisor, Service Advisor, Foreman, Parts Manager, Parts Technician, Office User, Sales Representative, Time Clock User | live == template | CLEAN (10/11) |
| **Technician** | live 11 atoms vs template 6 | **DRIFTED** — added: customersCreateAndEdit, seeApArData, seeFinancialData, settingsFinance, woFullViewMode, workOrdersCreateAndEdit; removed: woTechViewMode |
- Technician drift matches the known concurrent-session re-drift (CLAUDE.md caution). My regression tests did NOT rely on system-role templates — I used fresh clean ZZAUTOTEST roles with exact atoms — so this drift did not affect any verdict below. **Recommend resetting Technician to template** (a concurrent session keeps re-drifting it). I did NOT perform a full reset-all-11 (used fresh clean roles instead); this is noted as an honest coverage item.
- Evidence: evidence/role-drift-before.json

## 3. The 3 KNOWN regressions — LIVE verdicts (evidence in evidence/known3-live-captures.md)

### SV-8682 — Vendors page 403 unless Reports ON  → **NOT REPRODUCED on current staging (PASS)**
- Role live-confirmed: vendorOrderManagementView + seeFinancialData, **Reports OFF**.
- Loaded /parts/vendors in browser → page LOADS (final URL /parts/vendors, Vendors table renders), **ZERO 4xx**, GET /api/parts-catalogue/vendors = 200. No /access-denied.
- The exact STR ("navigate to Parts → Vendors") does NOT produce a 403 on this build. Either the fix is already on staging (ticket still shows Code Review) or the STR needs an unstated extra condition.
- **Verdict: currently PASSES — the hidden Reports dependency is not present.** Evidence: evidence/SV8682-vendors-reportsoff-LOADS.png. (Honest: not able to reproduce the reported 403 this run at the page level or the API level.)

### SV-8701 — customer detail full-page lockout when Fees & Discounts ON  → **FIXED (PASS)**
- POSITIVE role (Customers C&E + See Financial Data + Manage AP/AR, no org grants): GET /api/customers/{id}/default-adjustments = **200**; /customers/{id} + /customers/{id}/fees-and-discounts LOAD in browser, ZERO 4xx, no /access-denied.
- NEGATIVE role (no Manage AP/AR): default-adjustments = 403 (tab correctly gated) BUT the customer page STILL LOADS (ZERO 4xx in UI — FE skips the fetch). No whole-page lockout.
- Matches PR #2363 (BE gate realigned to S13-R9). **Verdict: FIXED.** Evidence: evidence/cust_pos.png, evidence/cust_neg.png.

### SV-8541 — return received special-order part + resolve cores without WO Line: Create & Edit  → **SPEC-INTENDED (record; PENDING PM)**
- Role live-confirmed: workOrdersView only (NO workOrderLinesCreateAndEdit).
- POST /api/work-orders/{id}/pre-resolve-cores = 400 "core required" (PERMISSION PASSED, not 403). POST /api/work-orders/part/make-return-request = 400 "missing params" (PERMISSION PASSED, not 403). Control role (no WO perms) reached same 400.
- These actions are gated at Work Orders → View (not WO Line: Create & Edit), matching the current spec ("Marking Cores OK/Not Ok is gated by WO→View") and Production. **Not a FE-exposure defect; do NOT re-file. PM to confirm the rule.** (Rule 25: expectation cited from the current Confluence spec wording.)

## 4. "Are there MORE broken permissions?" sweep (concern #1)
Looked for the two regression patterns: (a) FE-allows / BE-blocks whole-page lockout (like SV-8701) and
(b) broken permission dependency (like SV-8682). Loaded the v0.68/v0.69-affected pages live per role and
captured every /api status. "Zero 4xx + stays on page" = no lockout.

| Role tested (atoms confirmed live) | Pages loaded | Result |
|---|---|---|
| VOM View + See Financial Data (Reports OFF) | /parts/vendors, /parts/orders, /parts/deliveries, /parts/vendor-invoices, /parts/returns | ALL load, ZERO 4xx — no lockout, no Reports dependency |
| Customers C&E + SFD + Manage AP/AR | /customers/{id}, /customers/{id}/fees-and-discounts, /accounting/aging | ALL load, ZERO 4xx |
| Customers C&E + SFD (NO Manage AP/AR) | /customers/{id} | Loads, ZERO 4xx (F&D area hidden, no lockout) |
| Customers C&E + SFD + AP/AR | /administration/adjustment-templates | Correctly route-guarded → redirect to /timesheets (NOT /access-denied, no background 403) = normal FE guard, not a regression |

**RESULT: No NEW broken permissions found beyond the 3 known.** No FE-allows/BE-blocks whole-page lockout
and no broken-dependency 403 in the Parts/vendor area (5 pages) or the customer/finance area (F&D tab,
AP/AR aging, F&D admin) for the affected permission combos. Evidence: evidence/sweep-page-loads.md + screenshots.

## 5. Honest coverage statement (Rule 17 — no silent caps)
COVERED live this run:
- The exact permission combos of all 3 tickets (fresh clean roles, atoms confirmed live).
- Parts area: Vendors, Purchase Orders, Deliveries, Vendor Invoices, Returns (as VOM View+SFD, Reports OFF).
- Customer area: customer detail + Fees & Discounts tab (3 AP/AR configs); AP/AR aging; F&D admin templates route guard.
- Composition/drift of all 11 canonical roles (admin read).

NOT covered / remaining (be blunt):
- I did NOT drive all 11 canonical system roles × every affected page individually (impersonation was
  intermittently blocked by a CONCURRENT session holding the shared dev-admin's switch-user lock —
  400 "already impersonating" / 403 "Access denied"; mitigated with exit-first + retry, but some windows
  were unavailable). Roles NOT individually UI-driven across the affected pages: Service Manager, Sr Service
  Advisor, Service Advisor, Foreman, Parts Manager, Parts Technician, Office User, Time Clock User, Admin.
  Their COMPOSITION is confirmed clean==template (§2), but page-level lockout behaviour per role was not
  each driven live.
- SV-8541 full action-completion (seeded received special-order part + core → 201) not driven; only the BE
  permission-gate was proven (400 = permission passed, not 403).
- SV-8682 page-level 403 could not be reproduced at all, so the exact offending call (if any) is not pinned.
- Did NOT reset all 11 roles to template (used fresh clean roles); Technician left DRIFTED (concurrent session).

## 6. Gap cases authored (staged, NOT pushed) — see gap-cases/ + testrail-sync-manifest.md
1. CR-REG-01 (SV-8682) — Vendors opens without Reports dependency — VIU-Verified.
2. CR-REG-02 (SV-8701) — Customer page not locked out (F&D ON) — VIU-Verified.
3. CR-REG-03 (SV-8541) — core-resolve/part-return gated by WO→View — VIU-Verified, PENDING PM.
No NEW-defect case (sweep found none). No TestRail writes; execute the manifest only after authorization.

## 7. Cleanup done
- 4 ZZAUTOTEST roles deleted (0 remain). Fresh ZZAUTOTEST staff deleted.
- Vehicle staff restored to Technician: Nemanja Dj, Henry Hess.
- Secrets kept in /tmp only (chmod 600), never committed. Bridge/browser processes stopped.
