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
