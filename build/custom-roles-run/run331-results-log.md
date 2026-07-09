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
