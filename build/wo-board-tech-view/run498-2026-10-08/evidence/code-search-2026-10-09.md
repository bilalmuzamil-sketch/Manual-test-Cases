# Code search of build v26.40.8-7a95011 (sv10043), 2026-10-09 — 1,647 app code files crawled from /js/
## Positive control: known labels ARE found
x_ReassignLeadTechnicianDialog.BWOjFiNh.js
x_WorkOrderMoreActions.BQ_BtPh5.js
## 'Edit Work Order' title
x_WorkOrderDialog.nghkVJTd.js
## Every caller that opens the work order dialog (none passes an existing work order)
x_CustomerWorkOrderTab.DoALHERe.js:location:"page_header",element_label:"new_work_order"}),Ne({which:"workOrder",isShown:String(I.value.id||"")
x_Schedule.Dtj67gY0.js:o=n===null?null:fr(n);S.dispatch("workorders/updateDialog",{which:"workOrder",isShown:n===null||o===null?!0:{scheduledStart:o,
x_VehicleWorkOrdersTab.4IVHCgKh.js:suffix":"new_vehicle_work_order",onClick:t[1]||(t[1]=a=>xe({which:"workOrder",isShown:c.company_id
x_WorkOrderDialog.nghkVJTd.js:),w.value=!1},te=()=>{s.dispatch("workorders/updateDialog",{which:"workOrder",isShown:!1
x_WorkOrderDialog.nghkVJTd.js:e:o.is_vehicle_here}),s.dispatch("workorders/updateDialog",{which:"workOrder",isShown:!1
x_WorkOrderDialog.nghkVJTd.js:n(),type:"service"}));s.dispatch("workorders/updateDialog",{which:"workOrder",isShown:!1
x_WorkOrderDialog.nghkVJTd.js:rder_id)!=null?e:""}),s.dispatch("workorders/updateDialog",{which:"workOrder",isShown:!1
x_WorkOrders.kwQ5-9s5.js:"work_order_create"}),m.dispatch("workorders/updateDialog",{which:"workOrder",isShown:!0
## Parts pages: filter wiring = the search term only (q-table filter prop)
x_Orders.CTZ2cySy.js: filter_chip occurrences = 0
x_Vendors.NNc4E8gz.js: filter_chip occurrences = 0
x_Deliveries.CrmOBQ6f.js: filter_chip occurrences = 0
control: filter_chip_* lives in x_FilterBar.Ca4KMevH.js 

## Account access (impersonation) — found 2026-10-09
- Route: `/impersonate-user/:user_id` (component `ImpersonateUser`) starts account access for that staff member's **user** id (`staff` row `.id`, not `.staff_id`); it returns early if you are already in account-access mode, and sends you to Work Orders for an invalid id.
- Exit: the orange bar's **Exit** button, `[data-test-id="button_exit_impersonation"]` (component `ImpersonationBar`).
- API behind both: `POST /api/switch-user {user_id}`, `GET /api/switch-user` (state), `POST /api/exit-switch-user`.
- Positive control for "the route exists": the runner harness itself uses the same `switch-user` API for every viewAs.
