# Custom Roles — Wording + Behavioral VIU Blockers & Findings Tracker — 2026-07-13

Per-case status source: `cases-2026-07-13/*.json`. Full workbook: `CustomRoles_WordingVIU_2026-07-13.xlsx` (Case ID + clickable TestRail Link, Rule 8).

**Two-stage pass:** (1) build-accurate WORDING — all 252 core cases reworded + pushed to TestRail via `update_case` (200/200). (2) BEHAVIORAL VIU 2026-07-13 (multi-round) — role editor + product screens driven headless via boot2; data self-seeded per standing rule 5; roles assigned to Tech then restored to Time Clock. No TestRail writes in the behavioral pass.

**Tally (252 core cases):** VIU-Verified 158 · Blocked-UI 83 · Deviation/Finding 11.

## Deviations / build-findings (route to dev / product)

| Case | Link | Finding |
|---|---|---|
| C26339 | [link](https://shopview.testrail.io/index.php?/cases/view/26339) | UI: the build does NOT strictly enforce a unique role name — the duplicate-detection dialog keys on IDENTICAL PERMISSIONS ("identical permissions already exists") and offers "Create Anyway" to override. Name uniqueness is not enforced as the case premise states; verified via Simi |
| C26340 | [link](https://shopview.testrail.io/index.php?/cases/view/26340) | UI: the template picker uses the SAME role names as the Roles list (Admin, Foreman, Office User, ...) — not shorter names. Premise stale. |
| C26341 | [link](https://shopview.testrail.io/index.php?/cases/view/26341) | UI: the template picker descriptions are IDENTICAL to the Roles list descriptions (e.g. Admin "Full system access", Foreman "Oversees technicians and work orders") — they do not differ. Premise stale. |
| C26387 | [link](https://shopview.testrail.io/index.php?/cases/view/26387) | UI (RUN331 FAIL PERSISTS): assigned Tech a custom role with Work Orders Create&Edit + Customers View but NO Customers Create&Edit. In the New Work Order modal the "Add" (new customer) affordance next to the Customer field is SHOWN and ENABLED. Expected: hidden/blocked when Custom |
| C26388 | [link](https://shopview.testrail.io/index.php?/cases/view/26388) | UI (RUN331 FAIL PERSISTS): same role (Customers Create&Edit OFF). In the New Work Order modal, once a customer is selected, the "Add" (new asset) affordance next to the Asset field is SHOWN and ENABLED. (Before selecting a customer it is disabled only due to the customer-required |
| C26424 | [link](https://shopview.testrail.io/index.php?/cases/view/26424) | UI: ticking Invoicing & payments Delete/Reverse while View and Manage AP/AR Data is OFF shows NO prompt — invoicing Delete just turns ON and AP/AR stays off. The build gates Invoicing on See Financial Data (per the SFD-disable dialog), not on AP/AR. Case premise (AP/AR prompt) is |
| C26459 | [link](https://shopview.testrail.io/index.php?/cases/view/26459) | UI: with a tech-view role that also has See Financial Data ON (ZZAUTOTEST TechSFD), the WO lines screen SHOWS the Rate ($100), Margin, Total columns and labor $150 — labor rate is NOT hidden by tech view. With plain Technician (SFD off) money+rate are hidden. So labor-rate visibi |
| C26464 | [link](https://shopview.testrail.io/index.php?/cases/view/26464) | UI: money-by-SFD principle HOLDS (User A = plain Technician, SFD off -> no $/prices anywhere; User B = TechSFD, SFD on -> parts pricing + totals shown). BUT the sub-claim that labor rate columns/fields stay hidden in tech view with SFD on is NOT supported — User B saw the Rate/Ma |
| C26529 | [link](https://shopview.testrail.io/index.php?/cases/view/26529) | Route metadata: Integrations gates IBS/Open API/QuickBooks; Finance gates Payment Methods/Taxes (no QuickBooks). QuickBooks is under Integrations in the build. |
| C26530 | [link](https://shopview.testrail.io/index.php?/cases/view/26530) | QuickBooks gated by settingsIntegrations in the build. |
| C26531 | [link](https://shopview.testrail.io/index.php?/cases/view/26531) | settingsIntegrations gates IBS/Open API/QuickBooks; the Settings 'Integrations' sub-toggle exists. Integrations is present in the build. |

## Still Blocked-UI — by section (each case has a per-case precise reason in its JSON)

| Section | Area | Count | Cases |
|---|---|---:|---|
| 3528 | Roles List | 1 | C26317 |
| 3532 | Permission Summary | 1 | C26356 |
| 3534 | Work Orders | 13 | C26375 C26376 C26377 C26379 C26380 C26381 C26383 C26384 C26385 C26386 C27868 C27873 C29435 |
| 3535 | WO Lines | 9 | C26389 C26390 C26391 C26392 C26393 C27271 C27272 C27866 C27870 |
| 3536 | Schedule | 3 | C26395 C26396 C27867 |
| 3537 | Customer Management | 4 | C26399 C26400 C26401 C26405 |
| 3538 | Parts Department | 4 | C26412 C26415 C26418 C26419 |
| 3539 | Invoicing & Payments | 11 | C26420 C26421 C26422 C26423 C26425 C26426 C26427 C26428 C27871 C29434 C29438 |
| 3540 | Timesheets | 5 | C26430 C26431 C26433 C26434 C27394 |
| 3541 | Page Access Toggles | 4 | C26437 C26438 C26439 C26440 |
| 3542 | Settings Access | 9 | C26445 C26446 C26447 C26448 C26449 C26450 C26451 C29273 C29274 |
| 3543 | View Mode | 4 | C26460 C26461 C26462 C26466 |
| 3545 | AP/AR Data | 1 | C26479 |
| 3546 | View History Logs | 2 | C26488 C26489 |
| 3547 | Staff Role Assignment | 3 | C26490 C26491 C26493 |
| 3550 | Staff Record Settings | 2 | C26526 C26527 |
| 3552 | User Feedback Strings | 1 | C26539 |
| 3553 | Cross-Permission | 6 | C26540 C26541 C26544 C26545 C26548 C26550 |

## Resume conditions
- Cookies `/tmp/custom-roles/cookies-viu-0713.env`; tooling `/tmp/custom-roles/beh0713/` (adm.mjs/boot2.mjs/drive.mjs/click.mjs/cascade.mjs/assign.mjs/setstatus.mjs).
- Assign Tech (staff_id 6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa, EXACT email tech@shopview.com, workplace b3c8c820-...) the role under test via POST /api/staff/{id}/change; boot2('tech'); observe; RESTORE to Time Clock User a0359055-3dfb-4e9c-9e11-2fbea21585c2.
- GOTCHA: some SPA routes (e.g. /parts/part-sales) redirect to /workorders on a fresh URL goto but load fine via in-app nav-click (a[href=...]). Use nav-click for those.
- Parts routes: /parts/part-sales, /parts/parts-catalogue, /parts/inventory, /parts/orders, /parts/returns, /parts/vendors, /parts/deliveries. Customer /customers/{id}; Vendor /parts/vendor/{id}. Enforcement model: resource View/Create&Edit -> endpoint 403/200; Delete/sub-perms -> observe UI.
