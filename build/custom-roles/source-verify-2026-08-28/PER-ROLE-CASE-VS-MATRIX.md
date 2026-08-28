# Per-role verification cases vs PRD v54 Permission Matrix (pageId 565116952, 2026-07-16)

## C26495 — Administrator: role permissions match the expected set  (role column "Admin")

**MATRIX (CRUD areas):** Work Orders=V/E/D ; WO Lines=V/E/D ; Schedule=V/E/D ; Customers=V/E/D ; Part Sales=V/E/D ; Catalog and Inv=V/E/D ; Vendor and Order=V/E/D ; Invoicing=V/E/D ; Timesheets=V/E

**CASE EXPECTED:** The Administrator permissions match the expected set: every add/edit/delete area full, all Page Access toggles on, all Settings sub-toggles on, See Financial Data on, View and Manage AP/AR Data on, View History Logs on, View mode Full View. Administrator is the single full-access role (Owner is merged into it) and is editable.

## C26496 — Service Manager: role permissions match the expected set  (role column "Svc Mgr")

**MATRIX (CRUD areas):** Work Orders=V/E/D ; WO Lines=V/E/D ; Schedule=V/E/D ; Customers=V/E/D ; Part Sales=V/E/D ; Catalog and Inv=V/E/D ; Vendor and Order=V/E/D ; Invoicing=V/E ; Timesheets=V/E

**CASE EXPECTED:** The Service Manager permissions match the expected set: Work orders View/Create & Edit, Delete; Work order lines Create & Edit/Delete; Schedule full; Customers full; Part sales full; Catalog and Inventory full; Vendor and order management full; Invoicing & payments View/Create & Edit (no Delete); Reports on; Customer portal on; See Financial Data on; View and Manage AP/AR Data on; Settings limited to App Settings and View/Manage Wages; View mode Full View.

## C26497 — Senior Service Advisor: role permissions match the expected set  (role column "Sr. SA")

**MATRIX (CRUD areas):** Work Orders=V/E/D ; WO Lines=V/E/D ; Schedule=V/E/D ; Customers=V/E ; Part Sales=V/E/D ; Catalog and Inv=V/E ; Vendor and Order=V/E/D ; Invoicing=V/E/D ; Timesheets=V/E

**CASE EXPECTED:** The Senior Service Advisor permissions match the expected set: Work orders full; Work order lines Create & Edit/Delete; Schedule full; Customers View/Create & Edit (no Delete); Part sales full; Catalog and Inventory View/Create & Edit; Vendor and order management full; Invoicing & payments full; Reports OFF; Customer portal on; See Financial Data on; View and Manage AP/AR Data on; no Settings pages; View mode Full View.

## C26498 — Service Advisor: role permissions match the expected set  (role column "Svc Advisor")

**MATRIX (CRUD areas):** Work Orders=V/E ; WO Lines=V/E/D ; Schedule=V/E/D ; Customers=V/E ; Part Sales=V/E ; Catalog and Inv=V/E ; Vendor and Order=V/E ; Invoicing=V/E ; Timesheets=V

**CASE EXPECTED:** The Service Advisor permissions match the expected set: Work orders View/Create & Edit (no Delete); Work order lines Create & Edit/Delete; Schedule full; Customers View/Create & Edit (no Delete); Part sales View/Create & Edit (no Delete); Catalog and Inventory View/Create & Edit; Vendor and order management View/Create & Edit; Invoicing & payments View/Create & Edit; Reports off; Customer portal on; See Financial Data on; View and Manage AP/AR Data OFF; View mode Full View.

## C26499 — Foreman: role permissions match the expected set  (role column "Foreman")

**MATRIX (CRUD areas):** Work Orders=V/E ; WO Lines=V/E/D ; Schedule=V/E/D ; Customers=V/E ; Part Sales=V ; Catalog and Inv=V/E ; Vendor and Order=V/E ; Invoicing=V/E ; Timesheets=V

**CASE EXPECTED:** The Foreman permissions match the expected set: Work orders View/Create & Edit (no Delete); Work order lines Create & Edit/Delete; Schedule full; Customers View/Create & Edit (no Delete); Part sales View only; Catalog and Inventory View/Create & Edit; Vendor and order management View/Create & Edit; Invoicing & payments View/Create & Edit (no Delete); Reports off; Customer portal off; See Financial Data on; View and Manage AP/AR Data off; View mode Full View.

## C26500 — Technician: role permissions match the expected set  (role column "Tech")

**MATRIX (CRUD areas):** Work Orders=V ; WO Lines=V/E ; Schedule=V ; Customers=V ; Part Sales=— ; Catalog and Inv=— ; Vendor and Order=— ; Invoicing=— ; Timesheets=—

**CASE EXPECTED:** The Technician permissions match the expected set: Work orders View only; Work order lines Create & Edit (View inherited); Schedule View only; Customers View only; Part sales/Catalog/Vendor/Invoicing off; Timesheets off; Reports off; Customer portal off; Parts Department off; Settings off; See Financial Data off; Pick parts on; View mode Tech view.

## C26501 — Parts Manager: role permissions match the expected set  (role column "Parts Mgr")

**MATRIX (CRUD areas):** Work Orders=V/E ; WO Lines=V/E ; Schedule=V ; Customers=V/E/D ; Part Sales=V/E/D ; Catalog and Inv=V/E/D ; Vendor and Order=V/E/D ; Invoicing=V/E/D ; Timesheets=—

**CASE EXPECTED:** The Parts Manager permissions match the expected set: Work orders View/Create & Edit (no Delete); Work order lines Create & Edit (no Delete); Schedule View only; Customers full; Part sales full; Catalog and Inventory full; Vendor and order management full; Invoicing & payments full; Reports on; Customer portal on; See Financial Data on; View and Manage AP/AR Data on; Settings limited to Parts, Finance and Data Import; View mode Full View.

## C26502 — Parts Technician: role permissions match the expected set  (role column "Parts Tech")

**MATRIX (CRUD areas):** Work Orders=V ; WO Lines=V ; Schedule=V ; Customers=V/E ; Part Sales=V/E ; Catalog and Inv=V/E ; Vendor and Order=V/E/D ; Invoicing=V/E ; Timesheets=V

**CASE EXPECTED:** The Parts Technician permissions match the expected set: Work orders View only; Work order lines off (View inherited); Schedule View only; Customers View/Create & Edit (no Delete); Part sales View/Create & Edit (no Delete); Catalog and Inventory View/Create & Edit; Vendor and order management full; Invoicing & payments View/Create & Edit (no Delete); See Financial Data on; Pick parts and Order parts on; View History Logs on; View mode Full View.

## C26503 — Office User: role permissions match the expected set  (role column "Office")

**MATRIX (CRUD areas):** Work Orders=V ; WO Lines=— ; Schedule=V ; Customers=V/E/D ; Part Sales=V ; Catalog and Inv=V ; Vendor and Order=V ; Invoicing=V/E/D ; Timesheets=V/E

**CASE EXPECTED:** The Office User permissions match the expected set: Work orders View only; Work order lines off; Schedule View only; Customers full (including Delete); Part sales View only; Catalog and Inventory View only; Vendor and order management View only; Invoicing & payments View, Create & Edit, Delete; Reports on; See Financial Data on; View and Manage AP/AR Data on; several Settings pages on; Timesheets View/Create & Edit; View mode Full View. The Office User role is non-editable (lock icon). Note: Office User should be able to MAKE PAYMENT But they should not be able to create invoice.

## C26504 — Sales Representative: role permissions match the expected set  (role column "Sales Rep")

**MATRIX (CRUD areas):** Work Orders=V ; WO Lines=V ; Schedule=— ; Customers=V/E ; Part Sales=V ; Catalog and Inv=— ; Vendor and Order=— ; Invoicing=— ; Timesheets=—

**CASE EXPECTED:** The Sales Representative permissions match the expected set: Work Order: View Customers: View, Create & Edit Parts Department: Toggled On Part Sales: View Reports: Toggled On See Financial Data: Toggled On View and Manage AP/AR Data: Toggled On Work Order Lines: View

## C26505 — Time Clock User: role permissions match the expected set  (role column "Time Clock")

**MATRIX (CRUD areas):** Work Orders=V ; WO Lines=— ; Schedule=V ; Customers=— ; Part Sales=— ; Catalog and Inv=— ; Vendor and Order=— ; Invoicing=— ; Timesheets=V

**CASE EXPECTED:** The Time Clock User permissions match the expected set: exactly three View-only permissions on — Work orders View, Schedule View and Timesheets View. Everything else is off (no Create & Edit or Delete anywhere; Customers, Parts Department, Invoicing & payments, Reports, Settings, See Financial Data and View and Manage AP/AR Data all off). This role is non-editable.

