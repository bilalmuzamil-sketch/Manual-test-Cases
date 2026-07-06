# Custom Roles (Revised) - Run 312 Summary

Run URL: https://shopview.testrail.io/index.php?/runs/view/312

253 of 254 in-scope cases executed. Only the 159 Passed cases were logged to TestRail run 312.

## Status Tally

| Status | Count |
|---|---|
| Passed | 159 |
| Failed | 34 |
| Retest | 44 |
| Blocked | 16 |
| Not Run | 1 |
| **Grand Total** | **254** |

## Per-Section Breakdown

| Section | Total | Passed | Failed | Retest | Blocked |
|---|---|---|---|---|---|
| Roles List Page | 19 | 17 | 2 | 0 | 0 |
| Create Custom Role | 16 | 14 | 2 | 0 | 0 |
| Edit Role | 8 | 5 | 1 | 0 | 2 |
| Delete Role | 5 | 2 | 3 | 0 | 0 |
| Permission Summary | 5 | 3 | 1 | 0 | 1 |
| CRUD Cascade Rules | 14 | 9 | 5 | 0 | 0 |
| Work Orders Permissions | 16 | 7 | 2 | 7 | 0 |
| Work Order Lines Permissions | 9 | 5 | 0 | 4 | 0 |
| Schedule Permissions | 5 | 2 | 0 | 3 | 0 |
| Customer Management Permissions | 8 | 8 | 0 | 0 | 0 |
| Parts Department Permissions | 14 | 9 | 0 | 5 | 0 |
| Invoicing and Payments Permissions | 10 | 7 | 1 | 2 | 0 |
| Timesheets Permissions | 7 | 4 | 0 | 3 | 0 |
| Page Access Toggles | 6 | 2 | 0 | 4 | 0 |
| Settings Access | 12 | 11 | 1 | 0 | 0 |
| View Mode | 15 | 7 | 0 | 8 | 0 |
| See Financial Data | 10 | 7 | 3 | 0 | 0 |
| Manage Accounts Payable and Receivable | 11 | 6 | 1 | 3 | 0 |
| View History Logs | 2 | 0 | 0 | 0 | 2 |
| Staff Page Role Assignment | 5 | 4 | 1 | 0 | 0 |
| Per-Role Verification | 12 | 9 | 3 | 0 | 0 |
| Migration | 19 | 10 | 2 | 0 | 7 |
| Staff Record Settings | 3 | 0 | 0 | 0 | 3 |
| QuickBooks Relocation | 3 | 0 | 3 | 0 | 0 |
| User Feedback Strings | 8 | 6 | 2 | 0 | 0 |
| Cross-Permission Combinations | 12 | 5 | 1 | 5 | 1 |

## Notable Failed Cases

### Real discrepancies (17)

- **26323** (Roles List Page): Contradicts EXP for the Administrator row: in the current build Admin is editable (pencil + three-dot 'View Permissions'), not eye-only. Only Office and Time Clock are non-editable. The case itself flags this Admin uncertainty (post-6/10 Owner removal) - likely intended behavior, flag for product; Office/Time Clock parts pass.
- **26366** (CRUD Cascade Rules): UI/spec mismatch: the separate 'Part sales' card named in the case does not exist in current UI (Parts consolidated into one 'Parts Department' card). Cascade+no-modal behavior verified on the consolidated card.
- **26367** (CRUD Cascade Rules): UI/spec mismatch: named card absent; Parts consolidated into single 'Parts Department' card.
- **26368** (CRUD Cascade Rules): UI/spec mismatch: named card absent; Parts consolidated into single 'Parts Department' card.
- **26371** (CRUD Cascade Rules): Contradicts case's stated expected: current UI shows View+Create&Edit (no Delete), and a different subtitle. The case's documented columns (Create&Edit+Delete) no longer match the UI. Spec/UI discrepancy persists but in a different form than the case records.
- **26372** (CRUD Cascade Rules): Contradicts expected: there is no upward cascade. WOL cannot be enabled while WO View is off; checking it does not auto-enable WO View. (Confirmed WOL edits work only once WO View is on.)
- **26387** (Work Orders Permissions): Add Customer affordance is visible AND functional despite Customer Management Create and Edit being OFF - contradicts Expected
- **26388** (Work Orders Permissions): Add Asset affordance visible despite Customer Management Create and Edit OFF - contradicts Expected (verification via DOM visibility + parallel to confirmed non-gated Customer Add)
- **26424** (Invoicing and Payments Permissions): No AP/AR prompt fires; Delete enables directly, contradicting expected
- **26448** (Settings Access): Contradicts expected: QuickBooks is not present in the Finance group (nor anywhere). Payment Methods is present, but the required QuickBooks entry is missing.
- **26469** (See Financial Data): Reports > Sales report still shows financial data with SFD OFF, contradicting 'no financial data on any page'. Note: SFD's own description scopes it to 'work orders, parts, and invoices' (excludes Reports), so this may be by-design with Reports gated only by reportsPageAccess
- **26475** (See Financial Data): Order Parts sub-toggle is NOT auto-cleared when SFD is turned off, contradicting expected point 2/3
- **27869** (See Financial Data): No prompt appears and Order Parts can be enabled while SFD is OFF, directly contradicting expected
- **26482** (Manage Accounts Payable and Receivable): Aging reports are STILL gated by Manage AP/AR, contradicting the updated spec that they follow the Reports permission
- **26505** (Per-Role Verification): Time Clock role grants workOrdersView/scheduleView/timesheetsView (read-only) - spec expects all CRUD OFF. Key 6/9 assertion (View Mode empty) and non-editable both confirmed, but CRUD-all-OFF not met. Possible intentional minimal read access for clock UI; not a clean match, not logged.
- **26512** (Migration): Failed: EXP Step2 requires the label 'Time Clock User' but staging shows 'Time Clock' (migration rename not written). Non-editability is correct but the case's specific rename assertion fails. Not logged to TestRail.
- **26543** (Cross-Permission Combinations): Contradicts expected: the Administrator role is editable in the current build (post-6/10 Owner consolidation), so it does not meet the 'lock + eye only, cannot edit' expectation. Only Office and Time Clock are truly locked.

### Stale cases (UI/spec drift) (17)

- **26311** (Roles List Page): stale case - UI evolved: editable system rows do not show a standalone eye icon; View Permissions lives inside the three-dot menu (matches 26310). No-lock part is correct, but the standalone-eye expectation is contradicted. Underlying behavior is correct/consistent.
- **26340** (Create Custom Role): stale case - UI evolved: the Roles list now uses the same short labels as the modal, so the three labels do NOT differ (case expects a modal-vs-list discrepancy that no longer exists). Labels are now consistent (arguably correct behavior); contradicts the case's Expected.
- **26341** (Create Custom Role): Contradicts Expected: modal descriptions reuse the Roles-list copy (not a distinct short set) and 2 of 11 (Service Manager, Technician) carry extra parentheticals vs the canonical short strings. Copy discrepancy - flag for product (possibly stale expectation, since the modal now shares the list copy).
- **26349** (Edit Role): Stale case - behavior OK: save is correctly blocked with an at-least-one-permission validation, but the actual message wording is 'At least one permission is required' vs the spec's 'At least one permission must be enabled.' String evolved; behavior correct. Not logged.
- **26351** (Delete Role): Stale case - behavior OK: known build-vs-spec gap (case body itself flags it). No modal, but deletion is correctly prevented via menu-hide + disabled Delete button with tooltip. Not logged.
- **26353** (Delete Role): Stale case - behavior OK: no system role exposes Delete anywhere (the case's primary assertion holds). Icon-layout expectations are outdated (Admin now editable; 9 not 8 editable; View Permissions in menu). Not logged.
- **26354** (Delete Role): Stale case - behavior OK: count is accurate (1) but surfaced in the disabled Delete Role button tooltip, not a Cannot Delete modal (no modal exists in build; same gap as 26351). Not logged.
- **26355** (Permission Summary): Stale case - behavior OK: the read-only Permission Summary opens and matches Sr SA, but for editable roles there is no direct eye icon (View Permissions is inside the three-dot menu per case 26310). Access path relocated. Not logged.
- **26490** (Staff Page Role Assignment): stale case — behavior OK: grouping into two sections is present and correct, but headers are 'SYSTEM'/'CUSTOM' (not 'System Roles'/'Custom Roles') and SYSTEM contains 11 built-in roles, not the 12 the case expects. Deviates from stated expected wording/count so not logged as pass.
- **26496** (Per-Role Verification): Stale case - behavior OK: SM Customer Portal is ON per 6/10 change and dedicated case 26506 (SM=ON); spec step 2 'OFF' is outdated. All other perms match.
- **26500** (Per-Role Verification): Technician system role includes workOrdersCreateAndEdit (WO View+Edit); spec expected WO View-only. Possible over-grant or stale spec (Technician default role has WO-Lines Create&Edit per case 27866). Not a clean match, not logged.
- **26510** (Migration): Failed — stale case, behavior OK: Admin permission migration is correct (all 41 perms, 93 users retained) and Admin is effectively non-editable (toggles disabled + banner), but the specific 'lock icon + eye-only' UI expectation is not met on staging (Admin is editable=true with a pencil). Not logged to TestRail.
- **26529** (QuickBooks Relocation): stale case / behavior mismatch: QuickBooks is not present under Finance (or anywhere) on this staging shop. FINANCE shows only Payment Methods. QuickBooks appears removed/relocated or feature-gated off. Deviates from expected; not logged as pass.
- **26530** (QuickBooks Relocation): stale case / behavior mismatch: QuickBooks does not exist under Finance on this shop, so the sub-toggle-gates-QuickBooks scenario can't be validated. QuickBooks is absent everywhere. Not logged as pass.
- **26531** (QuickBooks Relocation): stale case / behavior mismatch: the 'Integrations' sidebar group is still present (now hosting 'IBS'), contradicting the expectation that it is removed; and QuickBooks is absent from Finance and from search. The described relocation (QB -> Finance, Integrations removed) does not match current staging. Not logged as pass.
- **26535** (User Feedback Strings): stale case — behavior OK: the protective behavior (a role with assigned users cannot be deleted) IS enforced, but the mechanism differs from the case — instead of a blocking modal, the Delete action is omitted from the three-dot menu and the edit-page Delete Role button is disabled. No blocking modal appears, so the specified copy cannot be verified. Not logged as pass.
- **26536** (User Feedback Strings): Behavior deviates from expected: no confirmation modal appears when enabling See Financial Data — the toggle enables directly. Likely a stale case (the on-toggle warning modal was removed) or a regression; the granting of financial access is only summarized later in the generic 'Confirm Permission Updates' dialog on Save, not a dedicated warning modal on toggle. Not logged as pass.

## Blocked (16) - what's needed to run

- **26344** (Edit Role): 'Reset To Template' button present and enabled in editor (data-test-id=reset_template_edit). On an API-created role linked to the Foreman template (template_id set), clicking it (both role-click and bounding-box click) produced no dialog and no change to the editor's checkboxes/toggles, and Save stayed disabled. Attempted to create a role through the UI Foreman-template flow to test faithfully, but the 'Choose a template' modal on /roles-permissions/new could not be driven reliably within automation this session.
- **26345** (Edit Role): Requires a second concurrent authenticated browser session ('Tester Bob') to observe forced logout and post-re-login nav state, which cannot be reproduced reliably via automation this session. Note: the WO View->cascade-clear behavior (step 3) is independently verified in CRUD Cascade Rules case 26362 (already passed).
- **26356** (Permission Summary): Staff page (/administration/staff) opened; each staff row has an edit_note action. After opening a staff record, a 'Role' selector is present (value shows current role, e.g. 'Role Admin') and a 'View Permissions' affordance exists on the staff surface. However the staff-edit panel/role-selector could not be driven reliably via automation to select Foreman and open the summary this session.
- **26488** (View History Logs): PARTIAL/CONFIRMED for WO-level: created a custom role with exactly [workOrdersView, woFullViewMode, viewHistoryLogs], assigned to throwaway Tech, logged in as Tech (fe-permissions confirmed those 3 keys incl. viewHistoryLogs). On the work order the WO-level history IS visible: a 'History (3)' control is present and the WO kebab menu shows an 'Audit Log' item. Line-level, part-sale, and parts-order (PO) history surfaces were NOT individually exercised within tool budget.
- **26489** (View History Logs): Not conclusively verified. Attempted to flip the custom role's View History Logs toggle OFF via the Edit Role UI, but the Save/Confirm did not persist (Tech still retained viewHistoryLogs). A second attempt to create a fresh no-VHL role (WO View only) did not complete (likely the identical-permissions 'Create Anyway' prompt timing). Ran out of tool budget before establishing the OFF state.
- **26507** (Migration): Not executable: staging is already on the post-migration Custom-Roles build; no pre-migration build/legacy roles page exists and no baseline artifacts were captured before migration. Observable now: 11 system roles present, all default=true.
- **26508** (Migration): Cannot compare to a pre-migration baseline (none captured). Exactly 11 system roles ARE present (Admin, Office, Time Clock, Service Manager, Service Advisor, Foreman, Technician, Parts Manager, Parts Tech, Senior Service Advisor, Sales Representative), all default=true. However 'custom roles = 0 immediately post-migration' is not verifiable: tenant now has ~57 custom roles created by testers over time.
- **26509** (Migration): Legacy 'Owner' role and its users are not present on staging (Owner already consolidated). Cannot locate a user previously on legacy Owner. Observable: system 'Admin' role exists (default=true, deletable=false, usersCount=93) with full 41 perms = every CRUD area V/E/D, all page toggles, all 6 settings, all cross toggles ON. NOTE: EXP expects Admin non-editable (lock+eye-only) but staging shows Admin editable=true (pencil present; toggles disabled + 'Full administrative access' banner).
- **26521** (Migration): Legacy 'SA Technician' role and its users are NOT present on staging (consolidation already applied). Cannot locate a user previously on legacy SA Technician nor confirm the consolidation event or the SV-7527 shop notification. Observable only: Senior Service Advisor system role exists (32 perms, usersCount=8).
- **26522** (Migration): Legacy 'SA No Reports' role/users NOT present on staging. Cannot locate such a user or confirm the Reports-access gain per user or the shop notification. Observable only: Senior Service Advisor has reportsPageAccess ON (would be the gain) and usersCount=8.
- **26523** (Migration): Legacy 'SA Limited View' role/users NOT present on staging AND there is NO system-jsa / 'Junior Service Advisor' role among the 11 system roles on this tenant (roles present: Admin, Office, Time Clock, Service Manager, Service Advisor, Foreman, Technician, Parts Manager, Parts Tech, Senior Service Advisor, Sales Representative). The JSA split is not present here.
- **26524** (Migration): Legacy 'Reporting' role/users NOT present on staging. Cannot locate a user previously on legacy Reporting to confirm the corrected mapping (Sales Representative, not Administrator). Observable only: Sales Representative exists with exactly Reports+seeFinancialData+seeApArData (3 perms).
- **26526** (Staff Record Settings): Not executed. Requires two users on the SAME role but different department assignments (one with scheduling, one without) and use of the Schedule grid to compare, plus a controlled department change.
- **26527** (Staff Record Settings): Confirmed the per-staff 'Time Clock' toggle exists on the Edit Staff Member record. Did NOT execute the WO-line clock-in comparison: needs two Technician-role users with the per-staff Time Clock setting ON vs OFF, each with an assigned WO containing a labor line.
- **26528** (Staff Record Settings): Admin (Admin role) DOES show the universal 'Clock In' control in the top header ('timer Clock In', '0.46 Hrs Today'). The Tech (Time Clock role) user did NOT show a header clock control (likely per-staff clockable OFF). Could not test Service Advisor or a clockable Time Clock user, nor verify timesheet entries for three roles.
- **26540** (Cross-Permission Combinations): Cannot create an all-permissions-off custom role: role create/update API returns HTTP 400 {"error":"At least one permission is required"}. The 'Zero Permissions' precondition is not establishable via the roles API.

## Not Run (1)

- **26486** (Manage Accounts Payable and Receivable): AP/AR OFF does NOT block any CRUD area

## Exclusions

The following sections were excluded from this run per request and are not counted above:

- Regression Suite (Minja's API file) - 116 cases
- Backend API and Security - 38 cases
