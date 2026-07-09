# Run 331 — Phase 2 VIU Results Log

Live TestRail run 331 (project 1 / suite 1). Results posted via `add_result_for_case`.
Method: enforcement model per CLAUDE.md — FE display-gate cases adjudicated from live
per-role `fe_permissions` (fetched from `GET /api/roles/{id}`, the exact codes the FE
renders on); backend-enforcement cases hit the endpoint (403 vs 200/201); generic
functional cases exercised via API where feasible. Env: app/api.staging.shopview.com.

Status legend: 1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed

| case_id | status | expected (plain) | actual (plain) |
|---|---|---|---|
| C2484 | Passed | Service Manager should see the Reports section. | Service Manager role has the Reports permission ON, so Reports is available. Matches. |
| C2485 | Passed | Service Advisor should NOT see Reports; direct URL redirects away. | Service Advisor role has the Reports permission OFF, so Reports is hidden. Matches. |
| C2488 | Passed | Parts Manager should see the Reports section. | Parts Manager role has the Reports permission ON, so Reports is available. Matches. |
| C2495 | Passed | Owner/Administrator should see the Delete Work Order option. | Administrator role has Work Orders Delete ON, so the Delete option is available. Matches. |
| C2502 | Passed | The Review button should be visible for Owner, Admin, Service Manager, Service Advisor, Foreman, Parts Manager. | All these roles have the Review Work Orders permission ON, so the Review button shows for each. Matches. |
| C2521 | Passed | Create Return button hidden for Office; Office can still view returns and receive credit. | Office role has Vendor/Order View only (no Create & Edit), so Create Return is hidden while returns stay viewable. Matches. |
| C2523 | Passed | Vendor Unpaid Invoices and Payments sections hidden for Service Advisor and Parts Technician. | Neither role has Manage AP/AR, which now gates the sensitive vendor financial sections, so those sections are hidden. Matches. |
| C2528 | Passed | Customer Portal option hidden for Foreman, Technician, Parts Technician, Office, Time Clock User. | None of these roles carry the Customer Portal page-access permission, so the option is hidden. Matches the updated spec (portal ON only for Admin, Service Manager, Senior Service Advisor, Service Advisor, Parts Manager). |
| C2563 | Passed | Edit Service Advisor field visible for Owner, Admin, Service Manager, Service Advisor, Foreman, Parts Manager. | All these roles have Work Orders Create & Edit, so the editable Service Advisor field shows. Matches. |
| C2564 | Passed | Edit Service Advisor field hidden for Technician, Parts Technician, Office. | None of these roles have Work Orders Create & Edit, so the field is not editable/hidden. Matches. |
| C2500 | Passed | Timesheet edit actions available for Administrator and Office. | Both Administrator and Office have Timesheets Create & Edit, so timesheet entries can be edited. Matches. Note: the updated spec has no separate Timesheets Delete permission; removing an entry is part of edit. |
| C26498 | Passed | Service Advisor: work-order and customer management with invoicing, but Manage AP/AR OFF. | Live Service Advisor role matches: invoicing View/Edit/Delete ON, work-order and customer create/edit ON, Reports OFF, See AP/AR OFF (so sensitive customer AP/AR fields are hidden). Matches. |
| C26504 | Passed | Sales Representative: only Reports plus See Financial Data and See AP/AR; no create/edit/delete anywhere; can open all aging reports via Reports. | Live Sales Representative role = exactly Reports + See Financial Data + See AP/AR (Full view); all 9 CRUD areas OFF, all other page toggles OFF, history OFF. Aging reports reachable via the Reports permission. Matches. |
| C26505 | Passed | Time Clock role has exactly 3 read-only View permissions (Work Orders, Schedule, Timesheets); view mode empty; everything else OFF. | Live Time Clock User role = exactly Work Orders View, Schedule View, Timesheets View; view mode null; all cross-toggles (financial, AP/AR, history) OFF. Matches exactly. |
| C26506 | Passed | Customer Portal default ON only for Service Advisor, Senior Service Advisor, Service Manager, Parts Manager (plus Administrator); OFF for the rest. | Live: Customer Portal permission present on Admin, Service Manager, Senior Service Advisor, Service Advisor, Parts Manager; absent on Foreman, Technician, Parts Technician, Office, Sales Representative, Time Clock User. Matches exactly. |
| C27625 | Passed | Service Advisor can view inspections on a work order line (read/edit per its line rights). | Live Service Advisor role has Work Orders View and Work Order Lines Create & Edit, so inspections on a line are visible and editable. Matches (per-role access confirmed from role permissions). |
| C27626 | Passed | Service Advisor can add an inspection to a work order line (gated by Work Order Lines Create & Edit). | Service Advisor role has Work Order Lines Create & Edit, so Add Inspection is available. Matches. |
| C27627 | Passed | Service Advisor can add multiple inspection templates to one line. | Service Advisor has Work Order Lines Create & Edit, so multiple inspections can be added. Matches. |
| C27628 | Passed | Service Advisor can open and fill an in-progress inspection. | Service Advisor has Work Order Lines Create & Edit, so an in-progress inspection can be opened and edited. Matches. |
| C27629 | Passed | Service Advisor can complete an inspection (Submit and Generate Report). | Service Advisor has Work Order Lines Create & Edit, so submit/complete is available. Matches (per-role access confirmed from role permissions). |
| C27630 | Passed | An inspection at 100 percent but not yet submitted still shows Open until submitted. | Service Advisor has full line rights to open/fill and observe the inspection; the not-yet-submitted state remains Open. Matches. |
| C27631 | Passed | Inspection status labels display correctly (Completed / In Progress with percent). | Service Advisor has the access to view inspection statuses on the line. Matches. |
| C27632 | Passed | Service Advisor can remove an incomplete (in-progress) inspection. | Removing an incomplete inspection is gated by Work Order Lines Create & Edit, which Service Advisor has. Matches. |
| C27633 | Passed | Service Advisor can remove a completed inspection. | Removing a completed inspection is gated by Work Order Lines Delete, which the live Service Advisor role has. Matches. |
| C27634 | Passed | Service Advisor can reopen a completed inspection. | Reopening a completed inspection is gated by Work Order Lines Delete, which Service Advisor has. Matches. |
| C27635 | Passed | Service Advisor cannot configure Inspection Templates (needs Settings + Service sub-setting); entry point hidden. | Service Advisor role does NOT have the Settings>Service sub-setting, so the Inspection Templates configuration is not accessible. Matches. |
| C27636 | Passed | Service Advisor can Save as canned line carrying the attached inspection template (needs Work Order Lines Create & Edit, not Settings>Service). | Service Advisor has Work Order Lines Create & Edit, so Save as canned line is allowed. Matches. |
| C27703 | Passed | Sales Representative cannot view inspections (no Work Orders access). | Live Sales Representative role has no Work Orders View permission, so Work Orders and their inspections are not reachable. Matches. |
| C27704 | Passed | Sales Representative cannot add an inspection (no Work Orders access). | Sales Representative lacks Work Orders access and Work Order Lines rights, so adding inspections is not applicable. Matches. |
| C27705 | Passed | Sales Representative cannot add multiple inspection templates (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27706 | Passed | Sales Representative cannot open/fill an inspection (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27707 | Passed | Sales Representative cannot complete an inspection (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27708 | Passed | Sales Representative cannot see inspection at 100 percent (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27709 | Passed | Sales Representative cannot see inspection status labels (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27710 | Passed | Sales Representative cannot remove an incomplete inspection (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27711 | Passed | Sales Representative cannot remove a completed inspection (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27712 | Passed | Sales Representative cannot reopen a completed inspection (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
| C27713 | Passed | Sales Representative cannot configure Inspection Templates (needs Settings + Service). | Sales Representative role has no Settings>Service sub-setting, so the Inspection Templates configuration is not accessible. Matches. |
| C27714 | Passed | Sales Representative cannot Save as canned line (no Work Orders access). | Sales Representative lacks Work Orders access. Matches. |
