# Custom Roles — Post-Release Regression (v0.68 / v0.69) — STATE / OUTCOME (2026-07-27)

**Status: DONE + ADVERSARIALLY VERIFIED CLEAN 2026-07-27.** Env: app.staging.shopview.com /
api.staging.shopview.com · Org d55bc308. No TestRail writes except the 3 authorized guard adds.
Run 312 untouched. This is the canonical resume doc for the 2026-07-27 release-regression pass.

## What happened
Post-release regression triggered by 3 tickets (v0.68/v0.69 breakage): SV-8682, SV-8701, SV-8541.
Two passes were run:
- **SWEEP-FINDINGS.md** — combo/pattern sweep (the 3 ticket combos + hunted patterns).
- **full-sweep-2026-07-27/FINDINGS.md** — the gap-closing full 11-role × 10-page live sweep.

## 3 tickets — verdicts (evidence-backed)
- **SV-8682 = NOT REPRODUCED (PASS).** Vendors page loads with Reports OFF for VOM-View roles;
  `GET /parts-catalogue/vendors` = 200 for every probed role. No hidden Reports dependency.
- **SV-8701 = FIXED (verified).** Customer default-adjustments endpoint = 200 for entitled (Admin),
  403 for unentitled (Service Advisor / Foreman / Time Clock); FE route-guards the F&D tab for the
  unentitled so the 403 is never a whole-page lockout. Customer detail loads for every customersView role.
- **SV-8541 = SPEC-INTENDED (pending PM).** Core-resolve / part-return gated by Work Orders→View
  (400 "core required", not 403 = permission passed), matching spec + prod. Held for PM confirmation;
  BE-gate proven in the combo sweep, not re-driven in the full sweep (honestly noted).

## 3 guard cases pushed to TestRail (user-authorized, 3 add_case + 3 title-shorten update_case)
- **CR-REG-01 = C38843** (sec 3538 Parts Dept) — SV-8682 — https://shopview.testrail.io/index.php?/cases/view/38843
- **CR-REG-02 = C38844** (sec 3537 Customer Mgmt) — SV-8701 — https://shopview.testrail.io/index.php?/cases/view/38844
- **CR-REG-03 = C38845** (sec 3535 WO Lines) — SV-8541 — https://shopview.testrail.io/index.php?/cases/view/38845
All HTTP 200 + re-GET MATCH; titles shortened (≤80 chars, meaning preserved); run 312 untouched;
no delete/section changes. (C38844 refs: TestRail cosmetically trimmed the space after the comma —
ticket SV-8701 + anchor S13-R9 both preserved.) Audit: testrail-execution-log-2026-07-27.md.

## Full sweep result — NO new broken permissions
- **11 canonical roles × 10 pages = 110 role×page cells**, each driven live (genuine per-role
  quick-login-tech + role-assign session), screenshot + full /api capture. Independently re-derived
  matrix from the raw captured routeGuarded/fourxx/errpage fields = EXACT match to the reported matrix
  (0 mismatches). Every cell = PASS (entitled roles LOAD; unentitled cleanly FE route-guarded).
- **No new lockout (SV-8701 pattern), no broken dependency (SV-8682 pattern), no FE-exposure.**
- All 11 roles reset/left AT template (final-role-state.json: all atTemplate=true, correct counts);
  reReset=0 (no mid-run drift this window). Technician was drifted at start → reset to template.

## Honest limits (accurately stated in FINDINGS.md)
- Scope = page-reachability + primary per-page backend enforcement, NOT every in-page element/action.
- Vendor Invoices page dropped (no standalone route resolved this build).
- switch-user impersonation stayed locked (concurrent session) → used genuine tech-login drive method;
  drive vehicle = shared tech user, not each role's own staff account.
- SV-8541 action-completion not re-driven (held); aging-report data correctness out of scope.

## Adversarial-verify caveats (noted; do NOT overturn the all-clear)
- "ZERO BE-4xx" is literally one benign 404: Parts Technician vendors `GET /api/api/sso/check`
  (SSO housekeeping, doubled-path; page still loaded 19 api2xx, no denied text). Matrix legend's
  "0 relevant 4xx" is the accurate framing — not a permission/data lockout.
- Entitled-role customer-F&D-tab screenshots are blank/near-empty (~6 KB; Admin bodyMid empty) —
  plausibly a genuinely empty F&D tab (no default adjustments on that customer), not an error page
  (errpage=false, 0 4xx); the SV-8701 fix rests on the 200/403 BE probe, which is solid.
- be-probe "AR aging=404" is uniform across ALL roles incl. Admin = wrong-endpoint probe artifact,
  not a permission finding (aging data correctness was out of scope).

## Standing rule now active
Run build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md **after every feature release** (not just on a
cadence) — Custom Roles is volatile and regresses when other features ship.
