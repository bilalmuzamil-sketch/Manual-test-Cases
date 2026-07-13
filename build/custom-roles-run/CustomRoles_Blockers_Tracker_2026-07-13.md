# Custom Roles — Wording + Behavioral VIU Blockers & Findings Tracker — 2026-07-13

Per-case status source: `cases-2026-07-13/*.json`. Workbook: `CustomRoles_WordingVIU_2026-07-13.xlsx` (Case ID + TestRail Link, Rule 8).

**Tally (252 core):** VIU-Verified 197 · Blocked-UI 44 · Deviation/Finding 11. Behavioral pass = boot2 headless; no TestRail writes.

## Deviations / build-findings

| Case | Link | Finding |
|---|---|---|
| C26339 | [link](https://shopview.testrail.io/index.php?/cases/view/26339) | UI: the build does NOT strictly enforce a unique role name — the duplicate-detection dialog keys on IDENTICAL PERMISSIONS ("identical permissions already exists") and offers "Create Anyway" to override. Name uniqueness is not enforced as the case premise state |
| C26340 | [link](https://shopview.testrail.io/index.php?/cases/view/26340) | UI: the template picker uses the SAME role names as the Roles list (Admin, Foreman, Office User, ...) — not shorter names. Premise stale. |
| C26341 | [link](https://shopview.testrail.io/index.php?/cases/view/26341) | UI: the template picker descriptions are IDENTICAL to the Roles list descriptions (e.g. Admin "Full system access", Foreman "Oversees technicians and work orders") — they do not differ. Premise stale. |
| C26387 | [link](https://shopview.testrail.io/index.php?/cases/view/26387) | UI (RUN331 FAIL PERSISTS): assigned Tech a custom role with Work Orders Create&Edit + Customers View but NO Customers Create&Edit. In the New Work Order modal the "Add" (new customer) affordance next to the Customer field is SHOWN and ENABLED. Expected: hidden |
| C26388 | [link](https://shopview.testrail.io/index.php?/cases/view/26388) | UI (RUN331 FAIL PERSISTS): same role (Customers Create&Edit OFF). In the New Work Order modal, once a customer is selected, the "Add" (new asset) affordance next to the Asset field is SHOWN and ENABLED. (Before selecting a customer it is disabled only due to t |
| C26424 | [link](https://shopview.testrail.io/index.php?/cases/view/26424) | UI: ticking Invoicing & payments Delete/Reverse while View and Manage AP/AR Data is OFF shows NO prompt — invoicing Delete just turns ON and AP/AR stays off. The build gates Invoicing on See Financial Data (per the SFD-disable dialog), not on AP/AR. Case premi |
| C26459 | [link](https://shopview.testrail.io/index.php?/cases/view/26459) | UI: with a tech-view role that also has See Financial Data ON (ZZAUTOTEST TechSFD), the WO lines screen SHOWS the Rate ($100), Margin, Total columns and labor $150 — labor rate is NOT hidden by tech view. With plain Technician (SFD off) money+rate are hidden.  |
| C26464 | [link](https://shopview.testrail.io/index.php?/cases/view/26464) | UI: money-by-SFD principle HOLDS (User A = plain Technician, SFD off -> no $/prices anywhere; User B = TechSFD, SFD on -> parts pricing + totals shown). BUT the sub-claim that labor rate columns/fields stay hidden in tech view with SFD on is NOT supported — Us |
| C26529 | [link](https://shopview.testrail.io/index.php?/cases/view/26529) | Route metadata: Integrations gates IBS/Open API/QuickBooks; Finance gates Payment Methods/Taxes (no QuickBooks). QuickBooks is under Integrations in the build. |
| C26530 | [link](https://shopview.testrail.io/index.php?/cases/view/26530) | QuickBooks gated by settingsIntegrations in the build. |
| C26531 | [link](https://shopview.testrail.io/index.php?/cases/view/26531) | settingsIntegrations gates IBS/Open API/QuickBooks; the Settings 'Integrations' sub-toggle exists. Integrations is present in the build. |

## Still Blocked-UI — by section (precise reason per case in its JSON)

| Section | Area | Count | Cases |
|---|---|---:|---|
| 3528 | Roles List | 1 | C26317 |
| 3532 | Permission Summary | 1 | C26356 |
| 3534 | Work Orders | 4 | C26379 C26380 C27873 C29435 |
| 3535 | WO Lines | 3 | C26391 C27866 C27870 |
| 3536 | Schedule | 3 | C26395 C26396 C27867 |
| 3537 | Customer Mgmt | 4 | C26399 C26400 C26401 C26405 |
| 3538 | Parts Dept | 4 | C26412 C26415 C26418 C26419 |
| 3539 | Invoicing & Payments | 6 | C26422 C26423 C26427 C27871 C29434 C29438 |
| 3540 | Timesheets | 1 | C26431 |
| 3541 | Page Access | 4 | C26437 C26438 C26439 C26440 |
| 3542 | Settings Access | 1 | C26450 |
| 3543 | View Mode | 4 | C26460 C26461 C26462 C26466 |
| 3545 | AP/AR Data | 1 | C26479 |
| 3547 | Staff Role Assign | 3 | C26490 C26491 C26493 |
| 3550 | Staff Record Settings | 2 | C26526 C26527 |
| 3552 | User Feedback | 1 | C26539 |
| 3553 | Cross-Permission | 1 | C26550 |

## Known harness limitations (manual / real-browser residue)
- **Edit Staff Member profile editor** not openable headless (C26356/C26450/C26490/C26491).
- **Schedule calendar** drag/slot create/edit/delete not triggerable headless (C26395/C26396/C27867).
- **Payment/return/terminal & timesheet-entry editors** require deep in-page dialogs not reachable (C26422/C26423/C26427/C29434/C29438/C27871/C26431/C26391/C27866/C27870/C29435).
- **Last-Administrator guard** can't be tested (89 admins on shared org) (C26550).

## Resume conditions
- Tooling `/tmp/custom-roles/beh0713/` (mkrole-api.mjs + permmap.json); assign Tech via /api/staff/{6fb22c1b-...}/change; boot2('tech'); restore Time Clock a0359055-....
- SEEDER TACTIC: admin as second identity to seed state, then observe gate.
- GOTCHAs: /parts/part-sales direct-goto redirect (nav-click); /roles-permissions/{id}/edit route unguarded.
