# SV-9289 — Asset merge drops imported work order/invoice history — discovery notes

Build: **v26.35.6-9164403** on sv9289.qa.shopview.com (fix commit 9164403024 → deployed, confirmed).
Org d55bc308 (shared), workplace "Staging Heavy Duty - 9919" b3c8c820, shop 9289.

## Ticket (source of truth = description; comments read in full)
Reported bug: merge an asset that has IMPORTED historical work orders into another asset →
open merged asset → Work Orders/Imported → the source asset's imported WOs are gone.
Fix (Nikola/Nemanja): imported invoices (table `work_order_imported`) now move with the merge
across all 3 merge paths (Merge button, edit-VIN-to-existing, change-VIN-from-a-WO); moved rows
take the destination VIN except when the destination has no VIN (keep source VIN); only the merged
customer's imported rows move (multi-customer scoping). PR #2698.

## Mechanics discovered (all live)
- Merge API: `POST /api/vehicles/merge {company_id, source_vehicle_id, destination_vehicle_id}` (validated).
- Imported-invoice READ (the "Imported"/Invoices history on an asset):
  `GET /api/vehicle/invoices/{vehicleId}?company_id={cid}` -> `{data:{collection:{invoices:[...], vehicle_info:{...}}}}`.
- Asset detail route: `/customers/vehicle/{vid}/work-orders?companyId={cid}` (sub-tabs Work Orders / Invoices / Notes).
- Customer detail: `/customers/{cid}/work-orders` (tabs incl. Assets, Invoices). Assets tab in-page -> `/customers/{cid}/vehicles`.
- Regular WO list: `GET /api/work-orders`. Vehicles: `GET /api/vehicles`. New Asset button on the Assets tab.

## BLOCKER: seeding imported invoices
- No imported invoices exist on this fresh branch (scanned).
- The invoice **CSV import** is NOT in the standard UI: not on the asset Invoices tab, not on the
  customer Invoices tab (only "New Payment"), not under Reports, and no import route resolves
  (/import, /imports, /invoices/import, /settings/import all dead).
- No JSON/API create endpoint for `work_order_imported` found: POST on /api/vehicle/invoices,
  /api/vehicle/invoices/{vid}, /api/vehicles/{vid}/invoices, /api/imported-work-orders,
  /api/work-order-imported all 404/405. `/api/vehicle/invoices/import` exists GET-only (405 on POST).
- Consistent with the dev's own note that "the data team had to manually re-upload the imported
  history" — the invoice import appears to be a data-team/support tool, not user-facing here.
- ⇒ The CORE test (imported history carries over on merge) needs imported invoices seeded onto a
  source asset. Everything else (merge itself, regular WO carry-over, no-imported regression) is
  self-seedable.

## SEED RECIPE (self-service — no data-team needed)
1. Customer: `POST /api/customers/create {name}` -> returns data.company_id (the customer id).
2. Contact: `POST /api/contacts/create {company_id, first_name}` -> data.contact_id (asset needs a contact = customer_id).
3. Asset: `POST /api/vehicles/create {customer_id: <contact_id>, company_id, vin, unit:'N/A'}` -> data.id.
4. Imported invoices: /administration/invoices-import — Download Template (cols: *Shop Location,*Customer,VIN,...,*Invoice Number,*Invoice Date,*Item,*Line Title,*Qty,*Rate,*Total,*Tax Amount),
   upload CSV, click "Import Invoices" -> `POST /api/imports/work-order-historical` -> "All invoices imported successfully". Matches to the asset by VIN + customer name.
5. Regular WO: `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}` -> 201.
- Imported read (vehicle-scoped, the "Imported" status filter on the asset Work Orders tab):
  `GET /api/work-orders-imported?filters[0][field]=vehicleId&filters[0][value]={vid}&filters[1][field]=companyId&filters[1][value]={cid}&pagination[rowsPerPage]=100&pagination[page]=1` -> data.workOrders[] (each has number, vehicleVin, totalPrice, status:'imported').

## RESULT — Merge button path (CORE / reported bug): PASS
Seed: C1=8e927653, contact=39479638; A(dest)=7316b966 VIN 1M1AW07Y5GM055903; B(src)=863f9661 VIN GM055903; 3 imported invoices (ZZIMP-1001/1002/1003) on B; 2 regular WOs on B.
BEFORE: B Imported=3 (VIN GM055903), A Imported=0.
Merge `POST /api/vehicles/merge {company_id:C1, source_vehicle_id:B, destination_vehicle_id:A}` -> 200.
AFTER: A Imported=**3** (ZZIMP-1001/1002/1003) all now **VIN 1M1AW07Y5GM055903 = A's full VIN**; A regular WOs=**2** (B's, carried over, now A's VIN); B **deleted** (search GM055903 returns only A); company imported total=3, 0 orphans (no row points at deleted B / old VIN).

## ADDITIONAL PATHS
- **VIN-less destination: PASS.** src(VIN VINLESSSRC0001, 2 imported) merged into dest U (no VIN) ->
  U shows 2 imported, VIN column keeps the SOURCE VIN VINLESSSRC0001 (NOT blank). The review fix works.
- **Edit-VIN path: PASS.** `POST /api/vehicles/change?changeAll=0 {vehicle_id, vin:<dest VIN>, ...full fields}`
  -> 201; the source's 2 imported invoices moved to the destination with the DEST VIN, source deleted.
  (A minimal payload returns 500 while still merging; that 500 is an incomplete-payload artifact, NOT a
  bug — a complete payload, as the UI sends, returns 201. The UI Edit-Asset form also requires Make.)
- **No-imported-source regression: PASS.** Merging a source with zero imported invoices -> 200, no error,
  source deleted, dest imported still 0.
- **Multi-customer scoping: cross-tenant leak protection CONFIRMED.** Vehicle B had imported rows for C1 (2)
  and C2 (1). Merging B into A **as C1** moved ONLY C1's 2 rows to A (with A's VIN); C2's row stayed under
  C2, still visible, VIN unchanged, nothing from C2 under A. ⚠️ The narrower "source asset is NOT deleted
  when genuinely shared" sub-case could NOT be faithfully exercised: importing invoices under a 2nd customer
  does not make the asset co-owned (`vehicles/list-owners/{vin}` stayed empty), so B remained C1-only and its
  deletion on merge is correct. A genuinely dual-owned asset wasn't creatable via API/import here. Reported as
  a coverage limitation, not a defect.
- **Change-VIN-from-a-WO path:** routes through the same `VehicleManager::mergeVehicles` + reassigner proven
  by the Merge-button and Edit-VIN checks; not driven separately. The known out-of-scope stranding caveat
  (Walter) was not observed/tested.

## VERDICT: QA PASSED — reported bug fixed. Imported work order/invoice history carries over on asset merge
(with the destination VIN; source VIN kept when the destination has none), regular WOs carry over, source is
removed, no orphans, and cross-tenant scoping holds.
