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

## 2026-10-05 · sv9667 build v26.40.7-7ffda69 — walked end-to-end through the screen (evidence build-verify-2026-10-05/seed-*.txt/png)
Seeded sale P9667-370 (4 Star Truck Repair, Water Pump $517.55 + core $79.99, vendor ZZAUTOTEST Parts Supply) and P9667-371 (Brake Pads, declined).
- **Settings entry:** your initials (top right) → **Settings**. Sidebar groups SETTINGS · SERVICE · PARTS · INTEGRATIONS (QuickBooks, IBS) · FINANCE (Payment Methods) · IMPORTS. Settings page tabs Organization · Invoice · Work Orders.
- **Customer Portal** is an item in the same initials menu (opens a new tab). **Billing** also there.
- **New Customer** (Customers → New Customer): Name *, …, **Save**.
- **New Vendor** (Parts → left sidebar **Vendors** → **New Vendor**): Name * … **Taxes is REQUIRED** ("Taxes is a required field" if left empty) → pick e.g. "GST" → **Save & Close**.
- Parts left sidebar: SALES & SERVICE **Part Sales** · PARTS **Inventory**, **Catalog** · SUPPLY CHAIN Returns, Purchase Orders, Vendor Invoices, **Vendors**.
- **New Part Sale** → dialog "New part sale": **Customer** → **Save** → opens the sale (status **Estimate**). An empty sale opens the **Add Part** dialog by itself.
- **Add Part** dialog: Part Number · Description · **Quantity (required)** · Source (Inventory / Vendor / Found; default Vendor) · Category (Uncategorized) · Vendor · Cost · **Core Charge** · Sell Price · Margin % · **Save & Add Part** / **Save & Close**. A core charge adds a second row "**Core for <part>**".
- New part rows show Status **Requested**; sale tax line on the Financial Info card reads "**GST**"; document Summary reads "GST (5%)".
- **Authorize** (green, above the parts list; no confirmation) → sale **Approved**, rows **Auth To Order** with **Order** in Actions. **Decline** (red; no selection, no confirmation) → sale **Declined**; Finance then shows Create Invoice but **no Add Deposit**.
- **Order** (no confirmation) → **Awaiting** + **Receive**. **Receive** → dialog "**Receive parts**": vendor panel, Vendor Invoice Number, Invoice Date, Delivery Note; table Part number & description (**part number REQUIRED** — red until typed + Enter) · **Cost (required for the part row)** · Qty Ordered · Qty Received · Total; tick the rows (Select All) → **Receive Parts (n)** → toast "**Parts received.**". **No "Charged" tag was shown on the core row in this dialog** (C154601).
- After receive: part **Received** (return-part icon), core row **Received** + **Return Core** → click = immediately **Returned** (no confirmation). Part's return icon tooltip: "Cancel Return on the core first, then return the part." Returned core row ⋮ → **Cancel Return**; received part row ⋮ → **Add Part Fee / Discount**.
- All parts received → sale **Complete**. Finance: **Create Invoice** → "**New Customer Payment**" (Payment Date, Payment Method, Reference Number, Memo, open-invoice table) → **Make Payment** / Send to Terminal. ⚠️ The table **pre-fills EVERY open invoice of that customer** (e.g. P9667-250/-248 were paid too) — the tester must clear other rows or use a customer with no other open invoices.
- Invoiced unpaid sale: Finance shows **New Payment**; Finance ⋮ → **Reverse** ("Warning — This action will re-open and undo the invoice." Reverse / Cancel) · **Issue Credit**. Paid: "Payments Oct 5, 2026 - Cash $543.43", status **Paid**.
- **Payment history / reversing a payment:** Customers → the customer → **Payments (n)** tab → payment row trash icon (tooltip "Remove") → "Confirmation — This action will reverse the payment for all invoices associated with it. The payment record is preserved for audit history." **Reverse**. (Test payment reversed; Nemanja's P9667-250/-248 restored.)
- Customer page tabs: Work Orders · **Part Sales (n)** (Number, Status, Asset, VIN/Serial #, Created By, **Total Price**, Created On, Parts, Returns) · Contacts · Assets · Notes · Invoices · Payments (n) · Deposits · Fees & Discounts.
- **Sales Representative** (left card, "Unassigned") lists only staff flagged as reps (today: Unassigned · Mudassir Qamar). Staff flag: Settings → Staff → row edit icon → "**Edit Staff Member**" → **Sales Representative** toggle, **Role**, **Save & Close**.
- **Move Part** (tick a row → toolbar ⋮): dialog "Select part sale to move part to" → **Part Sale** list (part sales only, no work orders) → Cancel / **Move**. **Split Part Sale** creates and opens a new sale at once (no dialog).
- **New Inventory Part** (Parts → Inventory): Catalog Part · Vendor · Category · Manufacturer · Cost · Sell Price · Core Charge · Min · Max · Tags · Bin Location · Quantity · **Save** (no free Description field).
- **QuickBooks NOT connected on this QA branch** (Settings → QuickBooks shows only the heading; server reports no company) — proved, `build-verify-2026-10-05/quickbooks-not-connected-claim.json` (blocker_gate exit 0). No QuickBooks login is held.

### Gate vocabulary — labels confirmed on sv9667 v26.40.7-7ffda69 on 2026-10-05 (evidence: build-verify-2026-10-05/seed-*, roles/staff dumps)
`Vendor missing` (Receive parts dialog, part with no vendor — receive-dialog.txt) · `Core for Water Pump` · `Parts Manager` · `Service Advisor` · `Edit tax rate` · `Taxes` · `GST` · `New Tax` · `Add Part` · `Save & Close` · `Save & Add Part` ·
`Authorize` · `Decline` · `Auth To Order` · `Order` · `Awaiting` · `Receive` · `Receive parts` · `Receive Parts` · `Parts received.` · `Return Core` ·
`Returned` · `Cancel Return` · `Put Back` · `Add Part Fee / Discount` · `Audit Log` · `Part Sale Log` · `Delete Part Sale` · `Split Part Sale` · `Move Part` ·
`Set Status` · `Finance` · `Add Deposit` · `Create Deposit` · `Record Deposit` · `Collect In Portal` · `Create Invoice` · `New Customer Payment` ·
`Make Payment` · `New Payment` · `Reverse` · `Issue Credit` · `Payments` · `Deposits` · `Part Sales` · `Work Orders` · `Create Work Order` ·
`Customers` · `New Customer` · `Vendors` · `New Vendor` · `Inventory` · `New Inventory Part` · `Catalog` · `Sales Representative` · `Edit Staff Member` ·
`Roles & Permissions` · `Create Custom Role` · `Choose a template` · `Change Location` · `Customer portal` · `See Financial Data` ·
`Vendor and order management` · `Work order lines` · `Invoicing & payments` · `Stats` · `Notes` · `Estimate` · `Approved` · `Complete` · `Invoiced` · `Paid` · `Declined`.
Permission names that do **NOT** exist on this build (cases mention them only to say so): "Vendors" (as a permission) · "Work Order Parts".
Staff on this build used as examples: "Ashlee Thomas" · "Ashley Schultz" · "Mudassir Qamar" (the only Sales Representative today) · "Admin ShopView" · "Tech ShopView".

### Example data the tester types (not screen labels; anything typed is accepted)
"Oil Filter" · "Brake Pads" · "Water Pump" · role and record names beginning "ZZAUTOTEST" (Rule 6 test-data tag), e.g. "ZZAUTOTEST No financial data",
"ZZAUTOTEST Parts no core", "ZZAUTOTEST Core - Water Pump", "ZZAUTOTEST 6%", "ZZAUTOTEST No part sale edit", "ZZAUTOTEST No invoicing edit",
"ZZAUTOTEST No portal", "ZZAUTOTEST 8.25%".
