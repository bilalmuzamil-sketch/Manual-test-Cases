# Custom Roles — Behavioral VIU FINAL Blockers & Findings — 2026-07-13

Per-case status source: `cases-2026-07-13/*.json`. Workbook: `CustomRoles_WordingVIU_2026-07-13.xlsx` (Case ID + clickable TestRail Link, Rule 8).

## FINAL TALLY (252 core cases): VIU-Verified 203 · Blocked-UI 38 · Deviation/Finding 11

Behavioral VIU driven headless via boot2 across 8 rounds. Of the original 214 Blocked-UI (wording already done + pushed to TestRail), 176 resolved (Verified/Deviation); 38 remain as genuine harness/environment residue for manual or second-real-user coverage. **No TestRail writes in the behavioral pass.**

## Deviations / build-findings (route to dev / product)

| Case | Link | Finding |
|---|---|---|
| C26339 | [link](https://shopview.testrail.io/index.php?/cases/view/26339) | UI: the build does NOT strictly enforce a unique role name — the duplicate-detection dialog keys on IDENTICAL PERMISSIONS ("identical permissions already exists") and offers "Create Anyway" to override. Name uniqueness is not enforced as th |
| C26340 | [link](https://shopview.testrail.io/index.php?/cases/view/26340) | UI: the template picker uses the SAME role names as the Roles list (Admin, Foreman, Office User, ...) — not shorter names. Premise stale. |
| C26341 | [link](https://shopview.testrail.io/index.php?/cases/view/26341) | UI: the template picker descriptions are IDENTICAL to the Roles list descriptions (e.g. Admin "Full system access", Foreman "Oversees technicians and work orders") — they do not differ. Premise stale. |
| C26387 | [link](https://shopview.testrail.io/index.php?/cases/view/26387) | UI (RUN331 FAIL PERSISTS): assigned Tech a custom role with Work Orders Create&Edit + Customers View but NO Customers Create&Edit. In the New Work Order modal the "Add" (new customer) affordance next to the Customer field is SHOWN and ENABL |
| C26388 | [link](https://shopview.testrail.io/index.php?/cases/view/26388) | UI (RUN331 FAIL PERSISTS): same role (Customers Create&Edit OFF). In the New Work Order modal, once a customer is selected, the "Add" (new asset) affordance next to the Asset field is SHOWN and ENABLED. (Before selecting a customer it is di |
| C26424 | [link](https://shopview.testrail.io/index.php?/cases/view/26424) | UI: ticking Invoicing & payments Delete/Reverse while View and Manage AP/AR Data is OFF shows NO prompt — invoicing Delete just turns ON and AP/AR stays off. The build gates Invoicing on See Financial Data (per the SFD-disable dialog), not  |
| C26459 | [link](https://shopview.testrail.io/index.php?/cases/view/26459) | UI: with a tech-view role that also has See Financial Data ON (ZZAUTOTEST TechSFD), the WO lines screen SHOWS the Rate ($100), Margin, Total columns and labor $150 — labor rate is NOT hidden by tech view. With plain Technician (SFD off) mon |
| C26464 | [link](https://shopview.testrail.io/index.php?/cases/view/26464) | UI: money-by-SFD principle HOLDS (User A = plain Technician, SFD off -> no $/prices anywhere; User B = TechSFD, SFD on -> parts pricing + totals shown). BUT the sub-claim that labor rate columns/fields stay hidden in tech view with SFD on i |
| C26529 | [link](https://shopview.testrail.io/index.php?/cases/view/26529) | Route metadata: Integrations gates IBS/Open API/QuickBooks; Finance gates Payment Methods/Taxes (no QuickBooks). QuickBooks is under Integrations in the build. |
| C26530 | [link](https://shopview.testrail.io/index.php?/cases/view/26530) | QuickBooks gated by settingsIntegrations in the build. |
| C26531 | [link](https://shopview.testrail.io/index.php?/cases/view/26531) | settingsIntegrations gates IBS/Open API/QuickBooks; the Settings 'Integrations' sub-toggle exists. Integrations is present in the build. |

## Genuinely-blocked residue — MANUAL / SECOND-ACCOUNT coverage

Per-case precise reason is in each `cases-2026-07-13/C*.json` `viu_status`. Grouped by root cause:

### Staff-editor / staff-record — needs real browser or 2nd real user account — 9
| Case | Link | Title |
|---|---|---|
| C26356 | [link](https://shopview.testrail.io/index.php?/cases/view/26356) | You can view a role's Permission Summary from Edit Staff Member using th |
| C26450 | [link](https://shopview.testrail.io/index.php?/cases/view/26450) | View/Manage Wages ON lets the user manage wages |
| C26490 | [link](https://shopview.testrail.io/index.php?/cases/view/26490) | The Staff role dropdown groups roles into System Roles and Custom Roles |
| C26491 | [link](https://shopview.testrail.io/index.php?/cases/view/26491) | The View Permissions button next to the role selector opens the Permissi |
| C26493 | [link](https://shopview.testrail.io/index.php?/cases/view/26493) | If a role change fails, the user keeps their previous role |
| C26526 | [link](https://shopview.testrail.io/index.php?/cases/view/26526) | Whether a technician can be scheduled depends on their department, not t |
| C26527 | [link](https://shopview.testrail.io/index.php?/cases/view/26527) | Clocking in on a work order line depends on the per-staff Time Clock set |
| C26539 | [link](https://shopview.testrail.io/index.php?/cases/view/26539) | Reassigning a staff member's role updates the row with no success messag |
| C27873 | [link](https://shopview.testrail.io/index.php?/cases/view/27873) | Edit/delete options on another user's customer note are hidden without t |

### Calendar drag/slot — needs real browser — 3
| Case | Link | Title |
|---|---|---|
| C26395 | [link](https://shopview.testrail.io/index.php?/cases/view/26395) | Schedule Create & Edit allows creating, changing and dragging appointmen |
| C26396 | [link](https://shopview.testrail.io/index.php?/cases/view/26396) | Schedule Delete allows removing appointments |
| C27867 | [link](https://shopview.testrail.io/index.php?/cases/view/27867) | A Schedule Create & Edit only role can open 'Assign existing work order' |

### In-page payment / terminal / return / financial / timesheet-entry editors — needs real browser — 9
| Case | Link | Title |
|---|---|---|
| C26401 | [link](https://shopview.testrail.io/index.php?/cases/view/26401) | Customers Delete does NOT let the user delete customer payments (that ne |
| C26422 | [link](https://shopview.testrail.io/index.php?/cases/view/26422) | Invoicing & payments Delete lets the user delete payments and void trans |
| C26423 | [link](https://shopview.testrail.io/index.php?/cases/view/26423) | Deleting a customer payment needs Invoicing & payments Delete, not Custo |
| C26427 | [link](https://shopview.testrail.io/index.php?/cases/view/26427) | The Send to Terminal action needs Invoicing & payments Create & Edit |
| C27871 | [link](https://shopview.testrail.io/index.php?/cases/view/27871) | Deleting or cancelling a return is controlled by Invoicing & payments De |
| C29434 | [link](https://shopview.testrail.io/index.php?/cases/view/29434) | Send to Terminal needs Invoicing & payments Create & Edit AND Customer p |
| C29438 | [link](https://shopview.testrail.io/index.php?/cases/view/29438) | Invoicing & payments Create & Edit gives the edit control on the work or |
| C26479 | [link](https://shopview.testrail.io/index.php?/cases/view/26479) | View and Manage AP/AR Data ON allows paying several invoices at once fro |
| C26431 | [link](https://shopview.testrail.io/index.php?/cases/view/26431) | Timesheets Create & Edit lets the user edit entries |

### Portal / Send-to-Portal surfaces not exposed in this environment — 5
| Case | Link | Title |
|---|---|---|
| C26437 | [link](https://shopview.testrail.io/index.php?/cases/view/26437) | Customer portal ON lets the user manage the customer portal |
| C26438 | [link](https://shopview.testrail.io/index.php?/cases/view/26438) | Customer portal OFF hides the customer portal from navigation |
| C26439 | [link](https://shopview.testrail.io/index.php?/cases/view/26439) | Billing Portal ON lets the user manage the billing portal |
| C26440 | [link](https://shopview.testrail.io/index.php?/cases/view/26440) | Billing Portal OFF hides the Billing Portal item in the Settings area |
| C26466 | [link](https://shopview.testrail.io/index.php?/cases/view/26466) | Full View: a user who can approve lines sees the 'Send to Portal' button |

### Parts delete/restock detail-page affordance not reachable in harness — 4
| Case | Link | Title |
|---|---|---|
| C26412 | [link](https://shopview.testrail.io/index.php?/cases/view/26412) | Part sales Delete lets the user delete part sales and reverse part sales |
| C26415 | [link](https://shopview.testrail.io/index.php?/cases/view/26415) | Catalog and Inventory Delete removes catalog parts |
| C26418 | [link](https://shopview.testrail.io/index.php?/cases/view/26418) | Vendor and order management Delete lets the user delete vendors and purc |
| C26419 | [link](https://shopview.testrail.io/index.php?/cases/view/26419) | Returning a part to inventory (restocking) is controlled by Vendor and o |

### Seeded line-state ops (review-authorization / pick-state / core / set-line-status / WOL delete / qty) — 6
| Case | Link | Title |
|---|---|---|
| C26379 | [link](https://shopview.testrail.io/index.php?/cases/view/26379) | The Review work orders sub-toggle controls the Review action on work ord |
| C26380 | [link](https://shopview.testrail.io/index.php?/cases/view/26380) | Pick parts needs only Work orders View, not Create & Edit |
| C26391 | [link](https://shopview.testrail.io/index.php?/cases/view/26391) | Work order lines Delete allows removing lines |
| C27866 | [link](https://shopview.testrail.io/index.php?/cases/view/27866) | A default Technician (with Work order lines Create & Edit) can bulk-comp |
| C27870 | [link](https://shopview.testrail.io/index.php?/cases/view/27870) | Work order lines Create & Edit lets the user mark a core OK/Not-OK and a |
| C29435 | [link](https://shopview.testrail.io/index.php?/cases/view/29435) | A Pick/Order Parts role can edit the Quantity on the Part Requests tab |

### Tech-view parts-request form field-count — needs real browser — 1
| Case | Link | Title |
|---|---|---|
| C26460 | [link](https://shopview.testrail.io/index.php?/cases/view/26460) | Tech view: the parts request form shows fewer fields |

### Last-Administrator guard — 89 admins on shared org, cannot create last-admin state — 1
| Case | Link | Title |
|---|---|---|
| C26550 | [link](https://shopview.testrail.io/index.php?/cases/view/26550) | The last Administrator cannot be left with zero users |

## Tooling / resume
- `/tmp/custom-roles/beh0713/` (adm/boot2/assign/mkrole-api/setstatus + permmap.json). Assign Tech via /api/staff/{6fb22c1b-...}/change; boot2('tech'); restore Time Clock a0359055-....
- GOTCHAs: /parts/part-sales direct-goto redirect (use in-app nav-click); /roles-permissions/{id}/edit route unguarded (FE-gap).

## Section 3658 resolution — 2 stubs moved into 3527 sub-sections (2026-07-13)
Per QA-lead ruling: valid stubs moved into the right 3527 sub-section + reworded build-accurate + pushed. 5 left in 3658 for QA-lead decision (see section-3658-resolution-2026-07-13.md).

| Case | Link | Moved to | Bucket | Note |
|---|---|---|---|---|
| C27731 | [link](https://shopview.testrail.io/index.php?/cases/view/27731) | 3549 Migration | Blocked-UI | Legacy Owner -> Administrator. Migration landing not drivable (needs a real pre-migration Owner user); partial roles-API confirm: no 'Owner' system role, Administrator editable. |
| C27736 | [link](https://shopview.testrail.io/index.php?/cases/view/27736) | 3545 View and Manage AP/AR Data | VIU-Verified | AP/AR cross-cutting toggle label. Stub's 'Manage Accounts Payable and Receivable' was BUILD-WRONG; corrected to build label 'View and Manage AP/AR Data' (verified from CrossTogglesSection build chunk). |
