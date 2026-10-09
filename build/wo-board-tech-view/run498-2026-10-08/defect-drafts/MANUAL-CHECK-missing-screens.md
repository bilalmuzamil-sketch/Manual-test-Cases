# Missing screens — how to check them yourself (9 Oct 2026)

Branch: https://sv10043.qa.shopview.com (sign in with the Admin quick-login). Live product: https://app.shopview.com.
Each section says where I looked, what I saw, and what to tell me if you find it.

## A. The "Edit Work Order" window (three checks)
The checks say: open a work order, open its edit window ("Edit Work Order"), change the lead technician, mileage, engine hours and PO number, then Save.

Where I looked:
1. Work Orders > All > click any work order number to open it.
2. Next to the work order number, the customer name and the asset: no pencil or edit button.
3. The three-dots button at the top right of the tabs: it lists Audit Log, Timesheets, Add Work Order Fee / Discount, Print Work Order and Delete Work Order. No "Edit Work Order".
4. The status card on the left: Lead Technician, Mileage and Engine Hours can be changed right there, one at a time. The PO number is under Finance > Customer PO.
5. The only "Edit Work Order" title in the app's code belongs to the window that CREATES a work order (Create Work Order).
6. The live product looks the same.

Tell me: the button you press to open "Edit Work Order" on an existing work order, if there is one. If there isn't, should these checks use the status card instead?

## B. The Vendor filter on Purchase Orders
Parts (top menu) > Purchase Orders (left menu). Toolbar: Search, a columns button, New PO. No filter button, and no filter in the column headers. Same in the live product.

## C. The State/Province filter on Vendors
Parts > Vendors. Toolbar: Search and New Vendor. No filter. Same in the live product.

## D. The Vendor filter on Vendor Invoices
Parts > Vendor Invoices. Toolbar: Search only. No filter. Same in the live product.

Tell me for B to D: where the filter is if you find one (for example a funnel icon, a column header menu, or a different page). If there is none, should these checks use the Search box (which is kept after a reload) instead?
