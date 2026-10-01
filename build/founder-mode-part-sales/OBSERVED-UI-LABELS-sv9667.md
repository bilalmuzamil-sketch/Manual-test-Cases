# OBSERVED UI LABELS — Founder Mode → Part Sales · sv9667.qa.shopview.com · build v26.39.2-210868d · observed 2026-10-01
# RULE: a label enters here ONLY from a live probe with committed evidence. Evidence: build-verify-2026-10-01/

## Top nav
"Work Orders" · "Schedule" · "Customers" · "Parts" · "Reports"

## Parts area sidebar (route /parts/*)
"SALES & SERVICE" → "Part Sales". "PARTS" → "Inventory" · "Catalog". "SUPPLY CHAIN" → "Returns" ·
"Purchase Orders" · "Vendor Invoices" · "Vendors".

## Part Sales LIST  (route /parts/part-sales)  — Evidence: part-sales-list.png
Title "Part Sales". Top-right: "Search" · a "Status: Estimate, +1" filter · "New Part Sale" button.
Columns: "Number" (P2-###) · "Status" (chip "Estimate"/"Approved") · "Customer" · "Asset" · "VIN/Serial #" ·
"Created By" · "Total Price" · "Created On" · "Parts" · "Returns".

## Part Sale DOCUMENT  (route /parts/part-sale/<uuid> — singular "part-sale")  — Evidence: part-sale-doc.png, part-sale-finance.png
Tabs: "Parts (N)" · "Stats" · "Finance".
Left sidebar: doc number + status chip (e.g. "P2-147" / "Estimate") · "Started: <date>" · "Sales Representative"
  (name) · customer card ("Contact"/"Phone"/"Authorizer") · "Add Asset" (Asset dropdown · "Add" · "Save") ·
  "Financial Info" table ("Item"/"Cost": "Parts" · "Subtotal" · "HST BC" (tax line) · "Total" · "Balance").
Finance tab toolbar: "Customer PO" field · download / email / print icons · settings gear · **"Add Deposit"** ·
  **"Create Invoice"**. A **"Estimate/Invoice"** toggle above the document.
Document body: company header · "Estimate: EST-P2-###" · "Estimate date" · "ADDRESSES"/"BILL TO" · "Terms COD" ·
  "PARTS" section (rows: description · qty · unit price · line total) · "SUMMARY" (Parts · Subtotal · tax · Total).
Status values: "Estimate" · "Approved" · "Complete".
# Tax line shows as the jurisdiction code (e.g. "HST BC") — S3 "Change the tax rate" affects this.

## STILL TO OBSERVE
# Add Deposit dialog (fields + pre-filled Memo, Finance tab) · Parts tab (Actions column layout, core return/charge
# row, add/edit part) · tax rate change control · audit log & menu order · sales representative edit · labels & tab bar.

## Part Sale Parts tab  — Evidence: part-sale-parts-tab.png
Columns/row elements: "Description" · "Qty" · "Price" · "Core" · per-row "Order" / "Return" actions · "more_vert"
(the Actions column, S6). (Full Actions-column layout + core return row = S1/S6 — confirm live.)

## Roles editor (Parts Department group)  — Evidence: roles-editor.png
Group **"Part sales"** ("Manage part sales, returns and related transactions.") → "View" · "Create & Edit".
Group **"Invoicing & payments"** → "View" · "Create & Edit".
# Cases write "Part Sales -> Create & Edit" / "Invoicing & Payments -> Create & Edit"; build groups are
#   "Part sales" / "Invoicing & payments" (lowercase 2nd word) — aligned 2026-10-01.

## RESIDUAL — not raised via automation on sv9667 (run session confirms live; entry points confirmed)
# Add Deposit dialog fields + pre-filled Memo (S8) · tax-rate change control (S3) · audit log entries & menu
# order (S4) · full Actions-column layout + core return row (S6/S1). The part sale document, Finance tab,
# Financial Info/tax line, Sales Representative, Parts tab, list and roles ARE confirmed.
