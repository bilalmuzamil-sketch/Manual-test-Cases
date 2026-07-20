# Simple Flow — Staging live VIU results (2026-07-20)

Host: app.staging.shopview.com / api.staging.shopview.com (shared d55bc308 org). Admin session, live.

## SF-CORE-18 (C29899) — API pre-resolve-cores — VIU-Verified
Endpoint LIVE: `POST /api/work-orders/{id}/pre-resolve-cores`
Payload schema (discovered live): `{cores:[{partRequestId, isCoreOk:<bool>}]}`.
Observed on WO 316441e5 (vendor core PR dcc299b8, un-received `authorized_to_order`, core_charge 23):
- POST isCoreOk=true  -> 201 {"data":{"resolvedCount":1}}; core_resolution => "ok";  cores_pending 1->0
- POST isCoreOk=false -> 201 {"data":{"resolvedCount":1}}; core_resolution => "not_ok"; cores_pending 0
- NO side effects: pr_status stayed `authorized_to_order`, order_id null, quantity_remaining 12 (unchanged), total_core_charge 276 (unchanged) — no WorkOrderPart / order / qty change.
- isCoreOk=null -> 400 "This value should not be null" (decision-only; NULL is the initial undecided state, endpoint cannot un-set).
Evidence: SF-CORE-18-api-evidence.json. Matches all 3 expected clauses. => VIU-Verified.

## STORY-18 RESOLVE-CORES UI — DEPLOYED & VERIFIED (headline)
Seeded a clean UNDECIDED vendor core on WO 1e2012ec (S3-25714) via `POST /api/work-orders/part/make-request`
(source Vendor, core_charge 25, core_part_id set, core_resolution=null, status authorized_to_order after line authorize).
Drove **Complete Work Order** → wizard stepper: **"Missing Details → Resolve cores → Receive parts & invoice"**
(test-ids pill_step_details / pill_step_resolve-cores / pill_step_receive).

### SF-CORE-03 (C29315) — VIU-Verified
Resolve cores screen appears BEFORE the receive/complete step. Contains (build-accurate labels):
- intro `text_resolve_cores_intro`: "N core part can now be resolved — mark whether each old unit was returned. This decides whether the core charge is billed."
- `group_cores_special_order`: "SPECIAL ORDER CORES · N"; core row shows description + "Line N" + "Core $25.00".
- buttons `button_resolve_core_ok_{id}` = "OK · Returned", `button_resolve_core_not_ok_{id}` = "Not OK · Keep + Charge".
- footnote `text_cores_footnote`: "Completion stays blocked until every core is set — the invoice can only bill a core once its return decision is made."
GATE observed live: `button_resolve_cores_continue` is DISABLED at "0 / 1 resolved" and ENABLED after a decision → "1 / 1 resolved".
Evidence: CORE-step-resolve.png, CORE-resolved-notok.png. => VIU-Verified.

### SF-CORE-04 (C29316) — VIU-Verified
"Cores pending" reflects only undecided cores: wizard count `text_cores_resolved_count` "0 / 1 resolved" → "1 / 1 resolved" after a decision;
API cores_pending 1→0 after pre-resolve (SF-CORE-18 evidence). => VIU-Verified.

### SF-CORE-11 (C29892) — VIU-Verified
The Resolve cores screen lists the un-received vendor core with part info + core charge + OK/Not-OK, under a consolidated
"SPECIAL ORDER CORES · N" group, with the invoice-accuracy intro message. (One core seeded; consolidated-group + count
mechanism confirms multi-core listing.) => VIU-Verified.

### SF-CORE-18 (C29899) — VIU-Verified (see above). make-request endpoint also discovered: POST /api/work-orders/part/make-request.

## PARTIAL / not flipped (evidence captured, reason noted)
- **SF-CORE-12 (C29893)** charge-follows-decision: resolve buttons update client state only (pre-resolve POST fires on Continue/completion);
  WO-total read via list endpoint was an org aggregate (unreliable) → charge amount NOT cleanly observed. Keep VIU-Pending. Needs drive-through to invoice with a reliable per-WO total read.
- **SF-INV-01/02/03 (C29360-62)** Δ13 no-Apply-button: on the single-order Receive/Accept-Delivery view (/order/{id}?receive=1) there is a per-PO
  vendor invoice input (`input_invoice_{poId}`) and NO "Apply" button (Apply-text count 0) — consistent with Δ13. BUT this is the single-order
  receive view; the SF-INV cases describe the per-VENDOR-GROUP field on the grouped Bulk Receive page. The `/bulk-receive` route REDIRECTS to
  `/parts/orders` (flat PO list + top Receive button that opens the single-order view). Grouped multi-vendor Bulk Receive page not observed at that route.
  Keep VIU-Pending; needs confirmation of the grouped surface entry point.
- **SF-BULK-06 (C29355)** Δ14 cost-editable-only-when-$0: on the receive view a $10 cost line renders cost as read-only text (`currency_text_cost_{id}`)
  while sell (`input_sell_{id}`) + qty (`input_qty_{id}`) are editable inputs — consistent with "cost locked when not $0". $0-cost case NOT confirmed
  (no $0 line available). Keep VIU-Pending; needs a $0-cost line to confirm cost becomes editable.
- **SF-BULK-01 (Back To Purchase Orders link)** present on the receive view (already Verified in prior passes).
- **SF-SET-03 deviation** (no Create Purchase Orders toggle): API settings object has NO createPurchaseOrders field (fields: requireMileage,
  requireHours, requireTechStories, requireVehicleIdentifier, vehicleIdentifier, autoPickInventoryParts, autoApproveLines, requireVendorInvoiceNumber,
  requireReview). UI settings tab not reached this run → deviation stands (unchanged), UI-toggle-absence not re-observed live.
