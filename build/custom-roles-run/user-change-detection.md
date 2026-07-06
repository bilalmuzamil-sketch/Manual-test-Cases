# Custom Roles - (Revised): User Change Detection (read-only diff)

Generated 2026-07-06. READ-ONLY analysis. Nothing in TestRail was modified, deleted, or created.
Project 1 / suite 1 / section 3527 "Custom Roles - (Revised)" and all descendants.

## Summary counts
- Deleted cases: **1**
- User (Bilal) update candidates: **7**
- Other recent edits (Vladimir/admin, not the user): 13
- Run 311 cases marked Failed/Retest by the user: 2
- Original non-revised "Custom Roles" section: none

## DELETE candidates
- **C26312** — Administrator system role row shows a lock icon and only the eye icon in Actions  
  Section: Custom Roles - (Revised) > Roles List Page  
  API-related: False (confirmed deleted: get_case/26312 -> HTTP 400 "not a valid test case")

> Only one case was deleted, and it is NOT API/Backend/Security related. No API cases were deleted; the "Regression Suite (Minja's API file)" section and its cases remain present.

## USER (Bilal) UPDATE candidates
High confidence: newest history entry authored by Bilal Muzamil (user_id 3), excluded from this session's edited IDs, and all were manually executed by the user in run 311.

| Case | Section | Title | updated_on (epoch) | Newest change (author / fields) |
|---|---|---|---|---|
| C26372 | CRUD Cascade Rules | Checking Create and Edit on Work order Lines also auto-checks Work Order: View | 1783282783 (2026-07-05 20:19:43 UTC) | Bilal Muzamil (user) — custom_preconds,custom_expected |
| C26506 | Per-Role Verification | Customer Portal toggle defaults: ON only for Service Advisor, Senior Service Advisor, Service Manager, Parts Manager templates | 1783281267 (2026-07-05 19:54:27 UTC) | Bilal Muzamil (user) — custom_expected |
| C26498 | Per-Role Verification | Service Advisor: WO/customer mgmt with invoicing; AP/AR OFF | 1783274890 (2026-07-05 18:08:10 UTC) | Bilal Muzamil (user) — custom_preconds,custom_steps,custom_expected |
| C26496 | Per-Role Verification | Service Manager: full ops, limited Settings (App + Wages only) | 1783273859 (2026-07-05 17:50:59 UTC) | Bilal Muzamil (user) — custom_preconds,custom_steps,custom_expected |
| C26471 | See Financial Data | Enabling Part Sales Create & Edit while See Financial Data OFF prompts to enable it | 1783269869 (2026-07-05 16:44:29 UTC) | Bilal Muzamil (user) — custom_preconds,custom_steps,custom_expected |
| C26431 | Timesheets Permissions | Timesheets Create and Edit enables editing entries (both edit paths) | 1783269211 (2026-07-05 16:33:31 UTC) | Bilal Muzamil (user) — custom_preconds,custom_steps,custom_expected |
| C26419 | Parts Department Permissions | Catalog and Inventory Create and Edit enables 'Return to Inventory' (restocking) | 1783268959 (2026-07-05 16:29:19 UTC) | Bilal Muzamil (user) — custom_expected |

## Other recent edits (NOT the user — Vladimir/admin)
Reported for completeness; these were changed by Vladimir Tomovic (admin, user_id 1), several today 2026-07-06. Not attributable to the requesting user.

| Case | Section | Title | updated_on (epoch) | Newest change (author / fields) |
|---|---|---|---|---|
| C26493 | Staff Page Role Assignment | Failed role change preserves the previous role | 1783324487 (2026-07-06 07:54:47 UTC) | Vladimir Tomovic (admin) — custom_atmstatus,custom_preconds,custom_expected |
| C26325 | Roles List Page | No 'Duplicate' action exists on the Roles list | 1783324486 (2026-07-06 07:54:46 UTC) | Vladimir Tomovic (admin) — custom_atmstatus,custom_preconds,custom_expected |
| C26322 | Roles List Page | Editable system-role three-dot menu exposes only 'View Permissions' (no Duplicate) | 1783324485 (2026-07-06 07:54:45 UTC) | Vladimir Tomovic (admin) — custom_atmstatus,custom_preconds,custom_expected |
| C26354 | Delete Role | User-assignment count is accurate when deletion is blocked | 1783324485 (2026-07-06 07:54:45 UTC) | Vladimir Tomovic (admin) — custom_atmstatus,custom_preconds,custom_expected |
| C27871 | Invoicing and Payments Permissions | Returns Delete/Cancel gated by Invoicing & Payments Delete (SV-7911) | 1783324484 (2026-07-06 07:54:44 UTC) | Vladimir Tomovic (admin) — custom_atmstatus,custom_preconds,custom_steps_separated |
| C27577 | SV-7388 Combo + Breakage (Master) > Breakage / Adversarial | CR-BRK-022 — Invoicing View only (See Financial ON, no Edit) — action exposure | 1783321315 (2026-07-06 07:01:55 UTC) | Vladimir Tomovic (admin) — custom_atmstatus |
| C27568 | SV-7388 Combo + Breakage (Master) > Breakage / Adversarial | CR-BRK-013 — AP/AR OFF — Unpaid/Payments/Credits tabs leak (customer & vendor) | 1783321314 (2026-07-06 07:01:54 UTC) | Vladimir Tomovic (admin) — custom_atmstatus |
| C27572 | SV-7388 Combo + Breakage (Master) > Breakage / Adversarial | CR-BRK-017 — Send to Portal in Tech View — View-Mode gate | 1783321314 (2026-07-06 07:01:54 UTC) | Vladimir Tomovic (admin) — custom_atmstatus |
| C27560 | SV-7388 Combo + Breakage (Master) > Breakage / Adversarial | CR-BRK-005 — See Financial OFF but Part Sales set — financial-gate bypass | 1783321313 (2026-07-06 07:01:53 UTC) | Vladimir Tomovic (admin) — custom_atmstatus |
| C27567 | SV-7388 Combo + Breakage (Master) > Breakage / Adversarial | CR-BRK-012 — AP/AR OFF + Customers Edit — sensitive-field leak | 1783321313 (2026-07-06 07:01:53 UTC) | Vladimir Tomovic (admin) — custom_atmstatus |
| C27834 | Regression Suite (Minja's API file) > Parts Manager | Verify Parts Manager cannot delete a work order | 1783263965 (2026-07-05 15:06:05 UTC) | Vladimir Tomovic (admin) — custom_atmstatus,custom_preconds,custom_expected |
| C26415 | Parts Department Permissions | Catalog and Inventory Delete removes catalog parts | 1783263963 (2026-07-05 15:06:03 UTC) | Vladimir Tomovic (admin) — custom_atmstatus |
| C26422 | Invoicing and Payments Permissions | Invoicing and Payments Delete enables delete payments and void transactions (NOT reverse invoices) | 1783263963 (2026-07-05 15:06:03 UTC) | Vladimir Tomovic (admin) — priority_id,custom_atmstatus,custom_preconds,custom_expected |

## Run 311 analysis
- Run 311: "CR  - Failed and Blocked test Run - Bilal" — 21 tests.
- Status breakdown: {'passed': 19, 'failed': 2}
- Run 312: 407 tests.
- Cases in 312 but not 311: 386. Run 311 is a small targeted 21-case run; the 386 cases in 312 but not 311 are simply out of run-311 scope and are NOT deletions.
- Cases in 311 but not 312: []. Empty: every case the user tested in run 311 still exists in run 312 (none deleted).

### User-marked Failed/Retest in run 311 (grounded update candidates)
| Case | Status | Section | Title | API-related |
|---|---|---|---|---|
| C26387 | failed | Work Orders Permissions | 'Add Customer' button hidden in New WO flow when Customer Management Create and Edit is OFF | False |
| C26388 | failed | Work Orders Permissions | 'Add Asset' button hidden in New WO flow when Customer Management Create and Edit is OFF | False |

> Note: both cases the user marked FAILED (C26387, C26388) were last edited by Vladimir on 2026-06-27 — the user recorded a Failed verdict but did not edit the case spec text itself.

## Original "Custom Roles" (non-revised) section
None found. No sibling/original section named "Custom Roles" (without "- (Revised)") exists anywhere in suite 1.

## Confidence & caveats
- Timestamp-only detection is UNRELIABLE: 502 revised-tree cases have updated_on within 4 days due to run scoping/bulk authoring. Confidence comes from get_history_for_case author+fields, not updated_on.
- The session automation authenticated with Bilal's credentials (user_id 3), so author id alone cannot separate session edits from the user's manual edits; session-edited case IDs were explicitly excluded from candidates.
- user_id 1 = Vladimir Tomovic (admin), user_id 3 = Bilal Muzamil (the requesting user).
- The 7 Bilal-authored update candidates are all cases the user manually executed in run 311 -> high confidence these are the "few that needed updating".
- The 10 cases changed 2026-07-06 (today) were edited by Vladimir (admin), not the user.
- Only ONE case was deleted (C26312); it is NOT API/Backend/Security related. No API cases were deleted. The "Regression Suite (Minja's API file)" section and its cases are still present.
