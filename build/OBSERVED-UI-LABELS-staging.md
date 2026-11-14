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

## A/R and A/P Aging Reports — build `v26.45.4-f3d3d2d`, read 2026-11-14 (probes `build/ar-ap-aging-bv/probe/s01`–`s07`)
- Reports left menu: `ACCOUNTS RECEIVABLE` → `A/R Aging Summary` · `A/R Aging Detail` · `A/R Aging Collection`; `ACCOUNTS PAYABLE` → `A/P Aging Summary` · `A/P Aging Detail` · `A/P Unpaid Invoices`; page title `A/P Unpaid Invoices Report` (s06). Chips `As of: <date>` · `Customer: All customers` / `Vendor: All vendors` (menu: search box, `All customers` / `All vendors`, "All customers are included. Pick one or more to narrow.", rows with tick boxes) · `Past due: Any` · `Location: All locations`; ⋯ `Export report` → `Download (PDF)` · `Download (CSV)`; top-left chevron `Expand all buckets` / `Expand all customers` / `Expand all vendors`; buckets `91 or more days past due` … `Current`.
- Customers: `New Customer` (`Name *` takes 120 letters with no spaces, and & " ' < >; `Phone`; `Save`); edit icon → `Edit Customer` (`Credit Terms` → `Net 30`; `Taxes` → `Exempt (0%)`; `Default Shop Supplies`; `Save`); `Add Contact` (`First name` · `Last name` · `Save`); `Assets` → `New Asset` (`Contact *`, `Make *` a pick-list, `VIN/Serial #` …); `New Work Order` (`Asset` · `Save`) → `New Line` (`Title` · `Labor Rate` → type "Fixed" → `Fixed Line Total` · `Line Approved` · `Save & Close`); line `Complete` → `Missing Details` (`VIN` · `Cancel` · `Finish Work Order`); `Finance` → `Invoice Date` · `Create Invoice` → `New Customer Payment`; no `Mark Reviewed` on staging (s02, s04, s05).
- Parts: `Vendors` → `New Vendor` (`Name *` takes 120 letters; `Telephone`; `Credit Terms` → `Net 30`; `Taxes` → `Exempt (0%)`; `Save & Close`); `Purchase Orders` → `New PO` (`Vendor`; `Part Number` → "Add new special order part: …"; `Description` · `Quantity` · `Cost` · `Add` · `Save & Close`); list `Receive` → `Vendor Invoice # *` · `Invoice Date *` · `Tax` · `Receive Parts (1)`; `Vendor Invoices` lists the bill (s05).
- Staging's date in the chips was 11/13/2026 while UTC was already 14 Nov (the location's own date).
- Settings route: profile menu → `Settings` (opens on Locations) → left menu `Settings` → tabs `Organization` · `Invoice` · `Work Orders`. `Work Orders` tab (s08, s09, read 14 Nov, not changed): WORKFLOW `Require Approval for New Lines` (on) · `Require Review Before Completion` (off); LINE REQUIREMENTS `Require Tech Story` (off) · `Require Mileage` (off) · `Require Engine Hours` (off); PARTS `Require Ordering Parts` (on) · `Require Receiving Parts Before Completion` (on) · `Require Picking Inventory Parts` (on); `Save Settings`. The `Invoice` tab only chooses what invoices display.
- More A/R and A/P labels on staging, 14 Nov (probes s06, s10–s19): headings `Customer` · `Location` · `Current` · `1-30 Days` · `31-60 Days` · `61-90 Days` · `91 And Over` · `Total`; `Date` · `Transaction Type` · `No.` · `Vendor Name` · `Due Date` · `Past Due` · `Amount` · `Open Balance`; buckets `1-30 days past due` · `31-60 days past due`; `Past due` menu: `Any` · "All ranges are included. Pick one or more to narrow." · `1-30 days` · `31-60 days` · `61-90 days` · `91+ days`; `Location` menu: `Select all` · `5 selected` · `Clear selection`; picking one location puts `locationIds=` in the address bar; `Switch location?` · "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?" · `Cancel` · `Switch location`; Reports left menu `Sales By Customer`; collection group rows `Phone:` · `Credit term:`. Role form: switching on `Parts Department` shows `Part sales` and `Vendor and order management` (`Work orders → View` · `Customers → View` · `Invoicing & payments → View` · `Part sales → View` · `Vendor and order management → View` · `Vendor and order management → Create & Edit` are card → tick box), `View and Manage AP/AR Data`. Locations with open A/R documents: `DVI Test` · `QB Location` · `Staging Heavy Duty - 9919` · `Staging Lethbridge - 4310` · `ZZAUTOTEST V1R-87 Location C`; also `ZZAUTOTEST R365 Location C with a name longer than the chip`. Customer `Invoices` tab: `Issue Credit` (`Credit Date` · `Amount` · `Issue Store Credit` · `Reason`; "Credit issued"), `New Payment` (greyed out); work order `Finance` → `New Payment` → `New Customer Payment` (`Payment Method` · `Payment` box · `Make Payment`; invoice then "Partially Paid"); `Add Deposit` → `Create Deposit` (`Deposit Date` · `Payment Method` · `Deposit Amount` · `Record Deposit`; "A deposit was created"; leftover "Held Overflow from auto-applied dep…"). Part sale: `New Part Sale` → `Add Part` (Part Number left empty; `Description` · `Quantity` · `Cost` · `Save & Close`), row `Sell Price`, `Authorize` (absent once the part sale reads Approved), row `Vendor` → `Order` (`Awaiting`) → `Receive` → `Receive parts` (part number box · `Vendor Invoice Number` · `Receive Parts (1)`; "Parts received.") → `Finance` `Invoice Date` · `Create Invoice`. Returns: tabs `Returns` · `Credits`; filter chip `Show cores only: Yes` (clear it to see other returns); `Create Return` · tick → `Receive Credit` → (`Credit memo number` · `Credit Date` · `Tax` · `Post Credit`; "Manual return credit created successfully"); `Credits` → `Create Credit` (form seen, not posted). Credit Terms list includes `Due on Receipt` (invoice dated Nov 1 due Nov 1).
- `Create Custom Role` opens `Choose a template` (`Skip` · templates such as `Admin`; probe s21); the Tech quick-login user is `Tech ShopView`, at `Staging Heavy Duty - 9919` (probe s20, profile menu).
