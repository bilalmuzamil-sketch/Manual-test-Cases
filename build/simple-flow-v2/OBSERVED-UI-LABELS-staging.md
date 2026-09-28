# OBSERVED UI LABELS — Simple Flow V2 on STAGING
# Build v26.39.1-02c6b6c · app.staging.shopview.com · org "Staging Heavy Duty - 9919" · observed 2026-09-28
# RULE: a label enters this file ONLY from a live probe with committed evidence (screenshot + text dump).
# Evidence dir: build/simple-flow-v2/build-verify-staging-2026-09-28/

## Top navigation
"Work Orders" · "Schedule" · "Customers" · "Parts" · "Reports" · "Clock In" · "Search customers, work orders, parts..."

## Settings (left sidebar "Settings")
Sidebar: "Settings" · "Staff" · "Roles & Permissions" · "Locations" · "Departments" · "Taxes" · "Labor Rates" ·
"Canned Lines" · "Fees & Discounts" · "Asset Types" · "Inspection Templates" · "Pricing" · "Bin Locations" ·
"Categories" · "QuickBooks" · "Payment Methods" · "Vendors" · "Inventory" · "Invoices".
Organization settings has sub-tabs: "Organization" · "Invoice" · "Work Orders" (a Quasar q-tab).
# Evidence: settings-landing.*, settings-workorders-tab.*

## Work Orders settings tab (the SFV2 settings)  — Evidence: settings-workorders-tab.txt
Group "WORKFLOW": "Require Approval for New Lines" · "Require Review Before Completion"
Group "LINE REQUIREMENTS": "Require Tech Story" · "Require Mileage" · "Require Engine Hours"
Group "PARTS": "Require Ordering Parts" · "Require Receiving Parts Before Completion" · "Require Picking Inventory Parts"
Button: "Save Settings"
# Descriptions verbatim: "When on, you click Order on each part to record that you've ordered it. When off, parts
#   are marked as ordered automatically." (Require Ordering Parts) ·
#   "When on, you click Pick on each inventory and found part..." (Require Picking Inventory Parts)
# NOTE: group headers render UPPERCASE via CSS; the semantic labels are title-case (Workflow / Line requirements / Parts).

## Roles & Permissions editor  — Evidence: roles-editor-expanded.txt
Group "Work Orders" ("Manage work orders the core operational records in ShopView."):
  "Create & Edit" · "View mode" (choices "Full View" / "Tech view") · "Review work orders" ·
  "Pick parts" · "Order parts" · "Receive later"
Group "Work order lines" ("Add, edit, and remove the individual labor and part lines on a work order."): "Create & Edit"
Accounting group: "See Financial Data"
# NOTE: build permission label is "Receive later" (several cases write "Received later" — one-word build-glossary
#   difference, Rule 102: align the precondition/step LABEL to "Receive later"; Expected substance stays the
#   source's words, Rule 114). "Order parts"/"Pick parts" are lower-case on the build (cases sometimes cap them).

## Work Order detail  — Evidence: wo-detail-lines.txt, wo-detail-lines-expanded.txt, wo-header-menu.txt
Tabs on a work order: "Lines (N)" · "Notes" · "Stats" · "Finance" · "AI"  (no separate "Parts" tab on this WO)
Line actions: "Approve" · "Complete" · "Start" · per-line "more_vert" menu · "New Line"
Each line's Parts section: "Add Part" button; part rows carry "edit" (hover) and "more_vert"; "drag_indicator" handle
Header three-dot ("more_vert") menu on a changeable WO, in order:
  "Audit Log" · "Timesheets (N)" · "Add Work Order Fee / Discount" · "Print Work Order" · "Create invoice" · "Delete Work Order"
# "Create invoice" is the completion-wizard entry point.

## NOT YET RE-OBSERVED ON STAGING (state-dependent — confirm when verifying the owning cases)
# - Part-availability badges ("In stock", "Awaiting", "On order") — needs a line with an ordered/unreceived part.
# - "Decline" line action, bulk action bar ("N selected", "Approve"/"Decline"/"Complete line"/"More"/"close").
# - Receive modal fields + "Receive later" split-button caret; completion-wizard step pills
#   ("Tech stories"/"Pick parts"/"Missing details"); "Clock out and complete"; "Move up" reorder; Purchase Order pages.

## ADDENDUM 2026-09-28 — exact role-editor group/permission labels (Evidence: roles-editor-expanded.txt)
Group "Work orders": "View" · "Create & Edit" · "Delete" · "View mode" (choices "Full View" / "Tech view") ·
  "Review work orders" · "Pick parts" · "Order parts" · "Receive later" · "Move labor"
Group "Work order lines": "View" · "Create & Edit" · "Delete"
Group "Vendor and order management" ("Manage vendors, purchase orders, deliveries and part returns."): "Create & Edit"
Group "Invoicing & payments": "View" · "Create & Edit" · "Delete / Reverse"
Group "Part sales" (under "Parts Department"): "View" · "Create & Edit" · "Delete"
Accounting: "See Financial Data"
# The cases' compact role wording was aligned to these on 2026-09-28: "Work Orders: Create & Edit" ->
#   the "Work orders" group's "Create & Edit"; "WO Lines: ..." -> "Work order lines" group; "Vendor & Order
#   Mgmt: ..." -> "Vendor and order management" group.

## WO detail line/part actions (Evidence: wo-detail-lines.txt)
Line row: "Approve" · "Complete" · "Start" · per-line "more_vert" (three-dot) menu · "New Line"
Each line's Parts section: "Add Part"; part rows show "edit" (on hover), "more_vert", "drag_indicator" (reorder handle)
Header three-dot menu (changeable WO): "Audit Log" · "Timesheets (N)" · "Add Work Order Fee / Discount" ·
  "Print Work Order" · "Create invoice" · "Delete Work Order"

## STILL NOT RAISED VIA AUTOMATION ON STAGING (state-dependent; confirm at execution)
# The bulk action bar ("N selected" / "Complete line(s)" / "Receive selected" / "Deselect all" / "More"),
#   the "Decline" line action, the Receive modal ("Receive vendor parts", fields), the completion-wizard step
#   pills ("Tech stories" / "Pick parts" / "Missing details"), "Clock out and complete", "Move up" reorder,
#   and part-availability badges ("In stock" / "Awaiting") could NOT be raised through scripted clicks on
#   staging in this pass (the line-row checkboxes / ordered-part states did not trigger via automation).
#   These are confirmed present on the prod build v26.39.0 (one patch below) from the 2026-09-24 pass; the
#   RUN session lands on exactly these screens when executing and confirms them live.
