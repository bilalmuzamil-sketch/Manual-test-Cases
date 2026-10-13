## REPORTS / SCHEDULE / TIMESHEETS / SETTINGS

### Reports + aging reports gating
- **UI path:** Top nav → Reports (`/reports`) → left nav (A/R Aging Summary/Detail/Collection, A/P Aging Summary/Detail/Unpaid Invoices, Sales Tax, Timesheet Activities).
- **API:** e.g. `GET /api/reporting/account-payable/unpaid-invoices-report`. Reports open with no 4xx when `reportsPageAccess` is on.
- **Gotcha:** Per the updated spec **aging reports follow the Reports permission (all-or-nothing), not Manage AP/AR** — but staging still had 26482 aging gated by AP/AR when last checked (spec not fully implemented). Office (with Reports) loaded both A/R and A/P aging with no block.
- **Confidence:** High (reports load confirmed); spec-vs-staging gap noted.

### Schedule / calendar
- **UI path:** Top nav → Schedule (`/schedule`) → full calendar (shows ALL users' appointments).
- **API:** `GET /api/calendar?date=...&end_date=...` (the schedule data endpoint).
- **Preconditions:** `scheduleView`; create/edit needs `scheduleCreateAndEdit`.
- **Gotcha/Unblock:** create/delete an appointment is a **click-to-create/drag interaction on the grid with no persistent button** — the harness could not reliably drive it; needs manual click on a day/resource cell.
- **Confidence:** Medium (view confirmed; create/delete not driven).

### Timesheets
- **UI path:** Reports → **Timesheet Activities** (`/reports/punch-clock-activities`). Wage fields on Staff → Edit Staff Member (needs `settingsWages`). Department clock: `POST /api/technician-tasks/department-clock-in {department_id}` → 201 · `.../department-clock-out {task_id,description}` → 201.
- **Preconditions:** `timesheetsView` (+ reports) to see; Create&Edit to edit. Timesheets card has no Delete column.
- **Gotcha:** virtualized report rows resist automation — edit dialog could not be opened in-harness.
- **Confidence:** Medium (view + department-clock endpoints confirmed).

### Settings sub-toggles
- **UI path:** Roles editor → **Settings** toggle reveals exactly **6** sub-toggles (App Settings, Service, Parts, Finance, Data Import, View/Manage Wages) — **no 7th "Integrations"** sub-toggle. Turning the last enabled sub OFF auto-sets the Settings parent OFF; OFF→ON preserves prior sub selections.
- **Sidebar mapping:** App Settings → Settings + Staff + Roles & Permissions + Locations + Departments + Taxes · Service → Labor Rates + Canned Lines + Asset Types + Inspection Templates · Parts → Pricing + Bin Locations + Categories · Finance → Payment Methods (no QuickBooks) · Data Import → Contacts/Assets/Vendors/Inventory/Invoices · Wages → staff wage fields. Org settings write: `POST /api/organizations/settings/change`.
- **Confidence:** High (toggle counts + sidebar groups observed).

---

