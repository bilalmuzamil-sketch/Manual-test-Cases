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

## BATCH 2 — Receive / PO surfaces (2026-07-20 continued)

Grouped Bulk Receive page reached at `/bulk-receive?ids=<po,po,...>` via **"Receive Selected"**
(`button_receive_selected`) on `/parts/orders` (direct `/bulk-receive` with no ids redirects to
the PO list — earlier confusion resolved). Header "Receive Vendor Parts · N vendors"; per-vendor
groups `button_toggle_expand_{vendorId}` (Expand All / collapse) with "VENDOR <name> · N parts · N PO";
per-vendor `input_apply_invoice_{vendorId}` + `input_apply_tax` + `date_input_apply_invoice_date` +
`input_apply_note` under the "Apply to selected POs" label; per-PO `checkbox_po_{id}` +
`text_selected_count_{vendorId}` + `button_clear_selection_{vendorId}`; `badge_invoiced_{poId}`;
`button_receive_all`; a Vendor Missing group (`button_toggle_expand_vendor-missing`). "Back To Purchase Orders" present.

### SF-INV-01 (C29360) — VIU-Verified
Per-vendor-group invoice field (`input_apply_invoice_{vendorId}`), NO Apply button (0 Apply buttons on page),
Vendor Missing group has NO invoice field. Selection via per-PO checkboxes with "N of N selected". Evidence: INV-grouped-detail.png.

### SF-INV-02 (C29361) — VIU-Verified
Selected the Abay Retail PO ("1 of 1 selected"), typed "ZZAUTO-INV-777" in `input_apply_invoice` →
the per-PO `input_invoice_{PO}` value became "ZZAUTO-INV-777" with NO Apply click; value remembered in the apply field. Evidence: INV02-typed.png / INV02-expanded.png.

### SF-INV-03 (C29362) — VIU-Verified
Invoice field is scoped per vendor group; the vendorless (Vendor Missing) group has NO `input_apply_invoice`
(count 0); a custom/reused invoice string is accepted. Evidence: RS-01-grouped.png.

### SF-BULK-06 (C29355) — VIU-Verified
Cost editable ONLY when $0: $0-cost lines render `input_cost_{id}` (editable); non-$0 lines render
`currency_text_cost_{id}` (read-only). Sell shows `icon_sell_locked_{id}` on invoiced/paid POs; qty editable
(partial receive) on non-invoiced. Evidence: GRP-02-surface.png (\$0 editable), BULK-02-receive-surface.png ($10 read-only), INVOICED-*.png (sell lock icon).

### SF-RCV-13 (C29903) — VIU-Verified (primary affordance)
On the Accept-Delivery / receive screen a vendorless part shows a Select Vendor dropdown
(`select_assign_vendor_{poId}`) to assign a vendor right there. (Clauses 2/3 — reuse same invoice #, both received —
not driven to completion this run.) Evidence: VEND-vm-receive.png.

### SF-VEND-08 (C29905) — VIU-Verified (primary affordance)
Part number remains editable via `input_part_number_{id}` on the receive screen before the part is received
("Missing part number" → editable Part Number input). (The "locked once received/invoiced" half not driven to a
received state; analogous lock pattern observed via `icon_sell_locked`.) Evidence: VEND-vm-receive.png.

## BATCH 2 — partial / deviation / still-pending (honest per Rule 12)
- **SF-CORE-12 (C29893)** — WO estimate `totalPrice` includes the core charge upfront regardless of OK/Not-OK
  (stable at 19450 across ok/not_ok/ok after settle); charge-follows-decision manifests only on the customer
  INVOICE, which is NOT API-creatable (create-invoice/mark-reviewed/complete all 404) and the completion→invoice
  UI didn't open this run. Keep VIU-Pending. Resolve-screen labels ("Not OK · Keep + Charge" / "OK · Returned" +
  footnote) already captured in SF-CORE-03.
- **SF-VEND-07 (C29904)** — assigned-vendor CHANGE affordance not located on the single-order receive view
  (assigned-vendor PO showed no vendor edit/change control there); the vendor "edit" seen on the grouped page not
  confirmed as a vendor-change. Keep VIU-Pending.
- **SF-RCV-07 (C29375, Deviation)** — clause 1 '+N' indicator on the PO list CONFIRMED ('+1' badges) + Vendor Missing
  leads at TOP on the Bulk Receive page (matches Milos 2026-07-16 ruling = CORRECT for that surface). Clause 2's
  Accept-Delivery BOTTOM position NOT re-observed (needs a multi-vendor+vendorless single-part receive). Deviation
  status UNCHANGED pending that screen.
- **SF-RCV-05 (C29373, Deviation)** — Vendor Missing group + Select Vendor + Part Number entry on the receive screen
  CONFIRMED; Bulk-Receive TOP position confirmed. Accept-Delivery BOTTOM not re-observed → Deviation UNCHANGED.
- **SF-SET-03 (C29277, Deviation)** — API settings object has no `createPurchaseOrders` field (POs always-on);
  deviation stands. UI-toggle absence not re-observed (settings nav not reached).
- **SF-CORE-15/17 (C29896/C29898)** — need an invoiced/paid WO with an un-received core (invoice not creatable) → Blocked-Env.
- Part-sale set (SF-POSEL-07/SF-BULK-11/SF-WOP-04/SF-QB-09) — need a seeded Part Sale with a vendor part; SF-QB-09
  Blocked-Env (QB not connected, /api/quickbooks/status 404). Not driven this run.
