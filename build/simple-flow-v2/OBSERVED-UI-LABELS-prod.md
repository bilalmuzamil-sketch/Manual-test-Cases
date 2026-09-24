# OBSERVED UI LABELS — app.shopview.com (production), build v26.39.0-07c719b
# Simple Flow V2 build-verification 2026-09-24. Read live off the screen (Rule: label from the smallest element that owns it).

## Settings — Work Orders tab  (route: /administration/settings → "Work Orders" sub-tab)
# Tabs in the settings panel: Organization · Invoice · Work Orders. Footer button: "Save Settings".
WORKFLOW
- **Require Approval for New Lines** — "When on, new work order lines require approval. When off, they are auto-approved."
- **Require Review Before Completion** — "Work orders must be reviewed and signed off before they can be completed"
LINE REQUIREMENTS
- **Require Tech Story** — "Tech story will be a required field before a line can be completed on a work order"
- **Require Mileage** — "Mileage will be a required field before a line can be completed on a work order"
- **Require Engine Hours** — "Engine hours will be a required field before a line can be completed on a work order"
PARTS
- **Require Ordering Parts** — "When on, you click Order on each part to record that you've ordered it. When off, parts are marked as ordered automatically." (NEW setting — C44551)
- **Require Receiving Parts Before Completion** — "When on, each part must be recorded as received before the work order can be completed, reviewed or invoiced. When off, you can finish the work order and receive later."
- **Require Picking Inventory Parts** — "When on, you click Pick on each inventory and found part to record that it's been pulled. When off, these parts are ready as soon as the line is approved." (renamed from Auto-pick — C44550)
# Sections observed: WORKFLOW · LINE REQUIREMENTS · PARTS (C44549 = "four Require settings under Workflow, Line, Parts").
# Evidence: settings-workorders-v26.39.0-07c719b.png, settings-wo-text-*.txt

## Work Order detail  (route: /workorders/<uuid> — note: LIST route is /workorders, NOT /work-orders)
# Observed on S2-556 (approved, 4 lines, parts) in Trucks Hill 2, v26.39.0-07c719b.
- Tabs: **Lines (n)** · **Parts (n)** · **Notes (n)** · **Timesheets** · **History (n)** · **Stats** · **Finance** · **AI ShopCoach Analysis**
- Header actions: **New Line** · **Complete** · **Open** · **Start** · **cancel** · **swap_horiz**
- Line row (Needs Approval): status chip **"Needs Approval"**; buttons **Approve** · **Decline**; **⋮ (more_vert)** line menu; **drag_indicator** (reorder handle — C44604/C44605); labor/parts subtotals; **add / Add Part**.
- Part row: **⋮ (more_vert)** part menu; part name; qty; cost/price; percent.
- Icons seen: how_to_reg · delete_outline · edit · edit_note · content_copy · location_on.
- "AI ShopCoach Line Builder" / "Build Lines" (AI helper; not in Simple Flow scope).
# Confirms runnable on build: 6667 (Complete), 6668 (Approve/Decline + part actions + Add Part),
#   6675 (⋮ line/part menus), 6676 (drag_indicator reorder). Evidence: wo-556-detail-*.png / .txt
# STILL TO OBSERVE: bulk action bar (select lines), receive modal, PO pages, completion wizard,
#   finish action (Create invoice), permissions/roles screen, Receive-later split button.

## Bulk Action Bar  (appears when line checkboxes are selected on the WO detail; replaces column headers — C44571)
# Observed on S2-556, 4 lines selected, v26.39.0-07c719b.
- Line checkboxes present (10 found); selecting reveals the bar.
- Primary action slots observed: **Approve** · **Decline** · **Complete line**
- **More** (expand_more) overflow — holds the rest (C44572).
- **close** control dismisses the bar (C53486).
# Confirms runnable on build: 6669 bulk bar route + primary/More/close structure.
# TO EXPAND later: open "More" to capture order/pick/etc.; the "N selected" banner + "Deselect all"/"Select all".
# Evidence: bulk-bar-*.png / .txt

## Roles & Permissions  (Settings sidebar → "Roles & Permissions")
# Roles list: Admin ("Full system access"), Technician ("Assigned work orders and time tracking (Tech View)"),
#   Sales Representative, etc. Each row: edit (pencil) + more_vert. Editing a role opens the permission editor.
# Permission editor atoms observed (Work Orders group): **Order parts** · **Pick parts** · **See Financial Data** ·
#   Work Orders · Work order lines.
# ✅ NEW PERMISSION ATOM CONFIRMED on the build, labelled **"Receive later"** (the cases write it "Received later"
#   — a one-word build-glossary difference, Rule 102: align the precondition/step LABEL to "Receive later"; the
#   Expected substance stays the source's verbatim words, Rule 114). Instrument PROVEN: same full-list capture
#   contains the known control atoms Order parts / Pick parts / See Financial Data. The role editor's "Search
#   permission" box does NOT filter via scripted input (positive control failed) — capture the full list, do not
#   trust the search. Central to C44592, C44593, C44606, C44607. Evidence: role-editor-full-*.txt
# Evidence: roles-*.png, role-editor-*.png/.txt

## Purchase Orders page  (route: /parts/orders)
# Columns: **Work Order · Purchase Order Number · Vendor · Order Status · Created On · Ordered By · Total Cost · Note**.
# **warning "Vendor"** marker on a vendor-missing PO (C44589 "missing vendors first"). **New PO** button. **Search**.
# Left rail (Parts area): Part Sales · Inventory · Catalog · Returns · Purchase Orders · Vendor Invoices · Vendors.
# Confirms 6671 route + columns runnable. Evidence: po-page-text-*.txt

## Test accounts (QA lead, 2026-09-24) — prod dummy test org
- Primary admin: `bilal.muzamil@shopview.com` / analyst1 (full access).
- **Reduced-role tester:** `bilal.muzamil+serviceadvisorlimitedview@shopview.com` / analyst1 — apply any role to
  this user to confirm a permission-gated action is hidden (C44608, C44609, negative permission checks).

## Finish Action (WO header) — group 6674
# On a ready_for_review WO (S2-811), the header offers exactly ONE finish action: **"Create invoice"**
#   (C44599 "the header offers only the one finish action that is genuinely next"; C44600 "Create invoice ...").
# Confirms 6674 route+label runnable on the build. Evidence: finish-action-811-*.png/.txt

## STILL TO OBSERVE (need a part in the Ordered/unreceived state)
- **Receive modal (6670)** — C44583 "Receive opens a modal"; fields Vendor / Invoice number / Invoice date / Cost / Tax
  (C44584); Assign-vendor card (C44585). Reach via a part's Receive action, the bulk Receive, or the PO page Receive.
- **Receive-later split button (6672)** — C44592 "Receive becomes a split button offering [Received/Receive] later"
  (needs the Receive-later permission + the setting on).
- **Completion Wizard (6673)** — opens on completing a WO with outstanding steps (C44594 entry points).
# These three need a seeded/located Ordered-part state; the read-only screens above are done.

## Receive screen/modal — group 6670  (route: /order/{orderId}?receive=1&returnTo=WorkOrder&returnId={woId} — playbook §K)
# Observed on S2-781's order, v26.39.0-07c719b.
- Header: **Date Ordered · Vendor(s) · Ordered By · Note**.
- Required fields (asterisked): **Vendor** (dropdown) · **Vendor Invoice # *** · **Invoice Date *** (date picker).
  (C44584 "Receive requires vendor, invoice number and invoice date".)
- Receive grid columns: **Part number & description · Cost · Sell · Qty ordered · Qty received · Total**.
- **Subtotal · Tax ($ field) · Total · Delivery note**. Submit: **Receive Parts (n)**.
# Confirms 6670 route+fields runnable on the build. Evidence: receive-screen-*.png/.txt

## BUILD-VERIFY COVERAGE (screens/labels confirmed on prod v26.39.0-07c719b)
# 6666 settings ✓ · 6667 complete-line ✓ · 6668 line/part actions ✓ · 6669 bulk bar ✓ · 6670 receive screen ✓
# 6671 PO page ✓ · 6672 Receive-later atom ✓ (split-button option TBD) · 6673 wizard TBD · 6674 finish action ✓
# 6675 part menus ✓ · 6676 reordering ✓ · 6677 permissions/atoms ✓
# REMAINING: (a) Receive-later split-button option (needs the Receive-later setting+permission ON);
#            (b) Completion Wizard (opens on Complete with outstanding steps).
