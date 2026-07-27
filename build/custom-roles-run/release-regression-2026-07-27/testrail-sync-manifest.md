# TestRail sync manifest — Custom Roles release regression (2026-07-27)

**STATUS: EXECUTED 2026-07-27 — 3 add_case pushed (user-authorized). New C-ids: CR-REG-01 = C38843 (sec 3538), CR-REG-02 = C38844 (sec 3537), CR-REG-03 = C38845 (sec 3535). All HTTP 200 + re-GET MATCH (C38844 refs cosmetically trimmed by TestRail — space after comma removed; ticket SV-8701 + anchor S13-R9 both preserved). Run 312 untouched; no update/delete/section changes. Audit: testrail-execution-log-2026-07-27.md.**
Project 1 / suite 1 "Master". `add_case` requires custom_atmstatus:3 + custom_automation_type:0.
NEVER touch any run. TestRail link pattern: https://shopview.testrail.io/index.php?/cases/view/<id>

## Proposed add_case (3 new regression-guard cases) — all currently VIU-Verified live
| # | internal_id | Title | Section (proposed) | viu_status | refs (Rule 20) |
|---|---|---|---|---|---|
| 1 | CR-REG-01 | Vendors page opens for VOM View + See Financial Data even when Reports OFF (no Reports dependency) | Custom Roles - (Revised) / Vendor & Order Management (sec 3538) | VIU-Verified | SV-8682 (Custom Roles §Vendor & Order Management) |
| 2 | CR-REG-02 | Customer detail opens (no Access restricted) for Customers C&E + SFD + Manage AP/AR when Fees & Discounts ON | Custom Roles - (Revised) / Customers | VIU-Verified | SV-8701 (Fees & Discounts customer default-adjustments, S13-R9) |
| 3 | CR-REG-03 | Return received special-order part + resolve cores allowed with WO→View, without WO Line: Create & Edit | Custom Roles - (Revised) / Work Order Lines | VIU-Verified (PENDING PM) | SV-8541 (Custom Roles "Cores OK/Not Ok = WO→View"; SV-8183 §9) |

Source bodies: build/custom-roles-run/release-regression-2026-07-27/gap-cases/*.json
- CR-REG-01/02 are UI page-load cases (tester-facing steps are UI-only; HTTP detail kept in the evidence/metadata layer per Rule 4).
- CR-REG-03: not a FE-block/BE-allow case, so no Rule-24 tester note needed; hold until PM confirms the rule.

## Proposed update_case
NONE. Existing near-neighbor cases (C26416, C27876, FD-PERM-008/C28592, FD-CUST-015/C28499, SF-PERM-11/C30646, SF-PERM-12/C30647) already cover the general rules; the 3 new cases add the specific regression guards identified in COVERAGE-CHECK.md.

## NOT pushed
No delete_case, no section changes, no run writes. Execute only after explicit one-day authorization.
