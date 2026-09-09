import json
DIR='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09'
ROUTE='2. Open, via top menu "Parts" -> the left sidebar "Purchase Orders" (under SUPPLY CHAIN), the Purchase Orders page (the /parts/orders list).'
STAMP='Last checked against build v26.35.9-5700a76 on 9/9/2026.'

# spec Expected lines preserved VERBATIM (Rule 57)
EXP={
 44589:[
  "1. Purchase orders group by vendor, with Missing vendors first, then named vendors alphabetically.",
  '2. Group headers carry the vendor name, a rollup such as "3 POs, 6 parts", and Expand all; the page header carries the vendor count.',
  "3. Every group renders collapsed (including Missing vendors), so the page opens as a list of vendors rather than a wall of parts.",
  "4. Each purchase order row shows its number, the work order number and the part count.",
  '5. Missing-vendor groups carry an amber treatment and a "Vendor missing" label in both the collapsed and expanded states. Once a vendor is assigned, the name shows. The vendor can still be changed only while the purchase order has no received parts; once anything on it has been received, the name is shown as plain text with no way to edit it.',
 ],
 44590:[
  "1. A panel is expanded per purchase order, not per vendor, so every figure entered belongs to exactly one PO and one vendor bill.",
  "2. The panel carries vendor invoice number, invoice date, delivery note, then the parts with per-part tick boxes and Deselect all, and a subtotal, editable tax and total beneath.",
  '3. The primary action reads "Receive parts (n)" and is disabled while anything required is unfilled.',
  "4. A vendor can be assigned two ways: hovering a collapsed purchase-order row reveals Assign vendor, and expanding the row makes it the required first field. Both can either link an existing vendor or create a new one - typing a name that matches nothing offers Create, which opens the usual new-vendor modal with the name filled in and name and tax rate required (the same flow as the receive modal).",
  "5. The tax typed here is vendor-side (stored on the vendor bill; feeds what the shop owes suppliers; not the customer's sales tax); it is typed, not calculated, and does not recompute when a cost or quantity changes.",
  "6. Sell price is shown here and only here, read-only, on every purchase order.",
 ],
 44591:[
  "1. Everything that makes a receive valid is identical to the receive modal: vendor, invoice number and invoice date required; cost and tax required but able to be zero and always prefilled; same quantity rules; part number required; cost locked once invoiced or paid.",
  "2. The same invoice number may be reused across several of a vendor's purchase orders (typed per PO, not shared from the group header).",
  "3. Sell price is not shown in the receive modal or on the receive page reached from Parts.",
  "4. Without See Financial Data the cost, tax, subtotal, total and sell columns are absent (not masked); receiving still works because those fields arrive with a value.",
  "5. A Vendor & Order Mgmt: View-only user (e.g. Office) can open the page but cannot receive.",
 ],
 53488:[
  '1. Selecting purchase orders raises the same bulk action bar as the work order, not a bar of its own design: "n selected", then Deselect all, then Receive selected as the primary action, then More, then a close control, with the same dividers.',
  "2. Assign vendor is not the primary action; it lives in More and acts only on the selected rows that have no vendor.",
  "3. The bar carries no amber treatment.",
  "4. Select all selects only what is loaded - one page (thirty rows) - so after scrolling to load more, the newly loaded rows are not selected. This is expected behaviour in this release, not a defect.",
 ],
}
PROV={
 44589:"This is the expected behaviour as per epic SV-8683 and story SV-9260 (Story 14, The receive page and PO bulk receive) and the Simple Flow V2 specification (Confluence page 771391574, revised 8 September 2026), read on 8 September 2026.",
 44590:"This is the expected behaviour as per epic SV-8683 and story SV-9260 (Story 14, The receive page and PO bulk receive) and the Simple Flow V2 specification (Confluence page 771391574, revised 8 September 2026), read on 8 September 2026.",
 44591:"This is the expected behaviour as per epic SV-8683 and story SV-9260 (Story 14, The receive page and PO bulk receive) and the Simple Flow V2 specification (Confluence page 771391574, revised 8 September 2026), read on 9 September 2026.",
 53488:"This is the expected behaviour as per epic SV-8683 and story SV-9260 (Story 14, The receive page and PO bulk receive) and the Simple Flow V2 specification (Confluence page 771391574, revised 8 September 2026), read on 8 September 2026.",
}
# three-outcomes build note for the two that deviate (build observed flat, no expand)
DEV={
 44589:["Build note (v26.35.9-5700a76, checked 9/9/2026): on the current build the Purchase Orders page renders as a single flat, sortable table (columns Work Order, Purchase Order Number, Vendor, Order Status, Created On, Ordered By, Total Price, Note) - it is NOT grouped by vendor and there are no collapsible vendor groups, so the grouped/collapsed behaviour above is expected to FAIL today. When you run it: (1) if it still shows the flat table with no vendor grouping, mark Failed; (2) if it fails in a different way, note exactly what you see and report it; (3) if it now groups by vendor with collapsed groups as above, the feature shipped - mark Passed and tell the QA lead."],
 44590:["Build note (v26.35.9-5700a76, checked 9/9/2026): on the current build the Purchase Orders rows do NOT expand into a per-PO panel (clicking a row does nothing); receiving is done from the per-row \"Receive\" button and the bulk \"Receive Selected\" (which open the shared receive modal), and \"Vendor Missing\" shows as an inline row badge. So the per-PO expand panel above is expected to FAIL today. When you run it: (1) if rows still do not expand into a panel, mark Failed; (2) if it fails in a different way, note exactly what you see and report it; (3) if a per-PO panel now expands as above, the feature shipped - mark Passed and tell the QA lead."],
}
PRE={
 44589:['1. Sign in as an Owner or Admin with Vendor & Order Mgmt access.', ROUTE+' Have purchase orders across several vendors, including vendor-missing ones, spanning work orders.'],
 44590:['1. Sign in as an Owner or Admin with Vendor & Order Mgmt: Create & Edit and See Financial Data.', ROUTE+' Have a vendor with purchase orders whose parts are awaiting receipt.'],
 44591:['1. Sign in with See Financial Data ON (as an Owner or Admin) and separately as a user with it OFF; and as a Vendor & Order Mgmt: View-only user (e.g. Office).', ROUTE+' A vendor has several purchase orders.'],
 53488:['1. Sign in as an Owner or Admin with Vendor & Order Mgmt: Create & Edit.', ROUTE+' Have more than thirty purchase orders across several vendors, including at least one with no vendor, so a second page loads on scroll.'],
}
STEP={
 44589:['1. On the Purchase Orders page, read the list layout: the grouping, the column headers and the initial expand state.'],
 44590:['1. On the Purchase Orders page, try to expand a purchase order row into a panel.','2. Read its fields, the tick boxes, the tax field and the primary action.','3. Assign a vendor to a row that shows "Vendor Missing", via hover and via the row.'],
 44591:['1. On the Purchase Orders page, as a View-only user, try to Receive (the per-row "Receive" button or "Receive Selected").','2. As a user without See Financial Data, look for the cost, tax, subtotal, total and sell columns/fields.','3. Reuse one invoice number across two of a vendor\'s purchase orders.'],
 53488:['1. On the Purchase Orders page, tick several purchase order row checkboxes and read the bulk action bar that appears.','2. Look for Assign vendor on the bar (in the More menu).','3. Tick the header select-all checkbox, then scroll to load more rows and check which are selected.'],
}
TITLES={44589:"Purchase orders group by vendor, missing vendors first, collapsed",44590:"A panel expands per purchase order with per-PO vendor-side fields",44591:"Receive validity on the PO page matches the modal; money hidden without the atom",53488:"PO list-page selection raises the shared bulk bar; Select all covers one page"}

def field(blocks):
    text='\n\n'.join('\n'.join(b) for b in blocks)
    return {"blocks":blocks,"text":text}

data={}
for cid in [44589,44590,44591,53488]:
    exp_blocks=[EXP[cid]]
    if cid in DEV: exp_blocks.append(DEV[cid])
    exp_blocks.append([PROV[cid], STAMP])
    exp_blocks.append(["AUTOMATION: READY"])
    data[str(cid)]={"title":TITLES[cid],"fields":{
        "custom_preconds":field([PRE[cid]]),
        "custom_steps":field([STEP[cid]]),
        "custom_expected":field(exp_blocks),
    }}
json.dump(data,open(f'{DIR}/intended-blocks.json','w'),indent=1)
json.dump([44589,44590,44591,53488],open(f'{DIR}/targets.json','w'))
print("authored 4 PO cases -> intended-blocks.json + targets.json")
