# OBSERVED UI LABELS — app.staging.shopview.com (build v26.36.7-20cfff7), 2026-09-16
# Inline Add and Edit Parts on Work Order Lines (section 6597). Read LIVE off the build with committed
# evidence (screenshots + probe logs in build/inline-add-edit-parts/build-verify-2026-09-16-staging/).
# Staging is the test environment for this suite: the sv9315 QA branch was destroyed when the feature
# merged to Staging (2026-09-10); sv9315/login now returns HTTP 502.

## Top navigation
- **ShopHub** menu · **Work Orders** · **Schedule** · **Customers** · **Parts** · **Reports** · **Search** (Ctrl+K) · **Settings** (under the workplace/account menu)

## Work order — Lines tab
- Tab label: **Lines**  (route `/workorders/<id>/lines`)
- Line table headers (in order): **Name/Description · Actual/Estimate · Progress · Status · Action · Rate · Margin · Total**
- **Add Part** button (rendered "addAdd Part" — an `add` icon + the text **Add Part**), in each line's Parts section
- **New Line** control; line-row controls include **edit** (pencil), **more_vert**, **drag_indicator**
- Line-level Status chips seen: **Approved**, **Complete**, **Needs Approval**; line actions: **Complete**, **Start**, **Approve**, **Decline**

## Inline add-part row (after clicking Add Part)
- Inputs / placeholders: **Description**, **Part number**, **Qty**, **Cost**, **Sell price**
- Controls: **Save**, **close**, **More options**, **Pick**, **Complete**
- The **edit** control on an existing part row stays hidden until you hover the row (icon-only pencil)
- Full View shows Cost / Sell price fields; **Tech view** hides them (a technician sees Description / Part number / Qty only)

## Part-number typeahead result cards (C45222)
- A stocked result card shows the **total inventory quantity** as **"Inventory Qty: N ea"**, then a **bin chip** carrying the bin code + per-bin quantity (observed chip e.g. **ST200**)
- Placeholder: **Search** / **Part number**
- **"Not stocked"** warning state — documented for a part with no bins; NOT re-observed on this build (every inventory part carried at least one bin), consistent with C45222's "unreachable" note

## New Part Request modal (opens from the inline row's More options)
- Title: **New Part Request**
- Fields: **Part number**, **Description**, **Source**, **Category**, **Vendor**, **Cost**, **Core charge**, **Sell price**, **Margin**

## Edit Part Request modal (opens from an existing part's edit pencil)
- Title: **Edit Part Request**
- Fields: **Part number**, **Description**, **Quantity**, **Source**, **Category**, **Vendor**, **Cost**, **Core charge**, **Sell price**, **Margin**
- Buttons: **close**, **Cancel order**, **Save & close**
- **Source** options (the dropdown, exactly three): **Inventory** · **Vendor** · **Found**
  - ⚠️ there is **no "Catalog" source** on this build — the Aug/Sep spec revision renamed catalog→inventory. C45060 still quotes **"Catalog"**: a label finding for the wording lane (part-number example "F40010212" in the same case is data, not a UI label).

## Part-line status vocabulary (CONDITION-DEPENDENT — see L0044)
- **Requested** — a part on a line that Needs Approval
- **Auth to order** — a **Vendor**-sourced (special-order) part on an **Authorized/Approved** line; its action is **Order**
- **Awaiting** — a part that has been ordered; its action is **Receive** (a LATER state than Auth to order, not a rename)
- **Approved / Complete** — line-level
- 🛑 To verify a case asserting a specific part status, reach the exact line-status + part-source combination first (L0044). Proof on v26.36.7: WO S2-32218 had `(SP-NEW-989)`=Auth to order and `(SP-NEW-898)`=Awaiting at once.

## Edit Line dialog
- Title: **Edit Line**; carries a **Status** field (value seen: **"Authorized"**), Technicians, Labor Rate, Estimated Time, Tech Time; buttons **Delete**, **Save & Close**

## Add Part / Edit visibility by work-order status (C44993 / C44994) — FULLY CONFIRMED
- **Complete** (WO S2-328544): **Add Part hidden**, part-row **Edit hidden** — confirmed
- **Paid** (WO S2-322624): **Add Part hidden**, **Edit hidden** — confirmed
- **Declined** (WO **S2-14522**): **Add Part shown** ✓ and part-row **Edit shown** ✓ — confirmed live 2026-09-16.
- 🛑 RELIABLE ROUTE to a Declined work order (the Status filter → detail click is FLAKY): use the **global search** (Ctrl+K), type the WO number (e.g. `S2-14522`), click the result. This opens the detail page directly. Reuse this instead of the list filter.

## Roles & Permissions (precondition route)
- **Settings** → **Roles & Permissions** (sidebar) → the role's pencil → route `/administration/roles-permissions/<roleId>/edit`
- **View mode**: **Full View** / **Tech view** toggle
- **Work order lines** section with a **Create & Edit** toggle
- **See Financial Data** toggle

## Allocation (bin) surfaces — CONFIRMED on a real inventory part (2026-09-16)
Used a well-stocked inventory part: **"ATF Bulk- Mobil Delvac 1 ATF 668" (MD668D)**, Inventory Qty 280, bin **SHOP**.
- **"Pulled from"** — the allocation chip on the inline row after selecting an inventory part (renders "Pulled from SHOP ▾"). Confirmed ✓ (C45224).
- **Bin picker** — opens by clicking the **caret (▾) at the right end of the "Pulled from" chip** (a `<button>` inside `.inline-part-row__binline`; a plain click on the chip text does NOT open it — click the caret). The picker lists each bin with its **name**, a **Default** badge, its **on-hand quantity** (e.g. "SHOP · Default · 280"), and a **check** on the selected bin; it **ends with a "Split across bins…" action**. Confirmed ✓ (C45221, C45226).
- **"Split across bins…"** — the last action in the bin picker. Confirmed present ✓.
- **"Bin Locations"** modal — opens when you click "Split across bins…" (C45232/C45233). The action that opens it is confirmed; the modal itself was not captured by automation (Quasar menu→dialog timing) — a tester opens it with one click. Tester confirms the modal contents (one row per bin, Default badge, on-hand, allocation input, Apply).

## Keyboard
- **Escape** closes the inline row / dialogs
