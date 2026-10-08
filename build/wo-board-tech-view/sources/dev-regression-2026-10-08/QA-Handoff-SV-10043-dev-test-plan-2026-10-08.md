# QA Handoff — Auto Generated (from diff)

**Branch:** SV-10043-work-orders-board-tech-view ([PR #3548](https://github.com/ShopView/shopview/pull/3548))
**Base:** develop (merge-base 458423d0c4)
**Scope:** Full-stack
**Files changed:** 408. BE: 196 (64 of them tests), FE: 177 (78 tests), E2E: 34, root: 1.
**QA env:** https://sv10043.qa.shopview.com. It was deployed from the PR branch on 2026-10-07, and Google SSO sits in front of it. If more commits land on the PR, redeploy before testing them.
**TestRail:** the feature's sections hold 188 cases, and 18 of them are automated. 3 cases test things that are not in this release, so mark them **blocked, not failed**:
- C368160 and C368164: Tech View Columns menu extras (count, Show all, Reset to default, Find box).
- C368162: Collapse all / Expand all.

**Generated:** 2026-10-08

---

## What Changed (plain English)
- **New views on the Work Orders page.** On desktop (1024 px and wider), `/workorders` now has a display switcher with three views. Each user's layout choices are saved to their account. Phones keep the card list.
  - **List:** rebuilt, with the same features.
  - **Board View:** one column per lead technician, plus Unassigned. Drag a card to change its lead or its position. You can also pin technicians, reorder columns, choose the card fields and set the density.
  - **Tech View:** a table grouped by lead technician. Groups can be collapsed, pinned and reordered. It has a column picker, and you can drag a row to change its lead.
- **Every lead technician change now goes through one server path.** That covers the new Reassign dialog, board and Tech View drags, the work order detail card and Edit Work Order.
  - Invoiced and Paid work orders lock the lead.
  - The new lead must belong to the organization.
  - Lines that followed the old lead move to the new one.
  - The user can choose to clear the old lead's whole-work-order shifts.
  - There are 4 new endpoints and 2 migrations.
- **Bug SV-9769.** On the Lines tab, a line with no labor but with a technician scheduled on it now shows that technician's name instead of "No technicians assigned to this line." Also in this change:
  - The work orders list API was refactored. It is now scoped to the organization and returns new fields.
  - Avatar images are cached.
  - The asset-on-site toggles no longer send the lead.

## Where This Applies

### Backend
- **API:**
  - New:
    - `GET /api/work-orders/board`
    - `GET /api/work-orders/board/items`
    - `POST /api/work-orders/{id}/board-move`
    - `GET /api/work-orders/lead-technician-candidates`
  - Changed:
    - `POST /api/work-orders/change-lead-technician`: new controller, larger response, `clear_shifts`, 409 and 422 errors.
    - `POST /api/work-orders/change`: the lead now goes through the shared changer, in one transaction, and writes a history entry.
    - `POST /api/work-orders/lines/create`, `/lines/change` and `/lines/assign-technician`: organization check on technician ids, and the line records where its technician came from.
    - `GET /api/work-orders`: organization scoping, `techAssignedId`, `vehicleYear`, opt-in `include[]=lineTechnicians`, and an id tiebreak in the default sort.
    - `GET /api/iam/view-avatar/{userId}`: ETag and 304.
    - Part request and part return counts (Work Orders List and Part Sales list) are now scoped to the organization.
- **Background jobs:**
  - Nothing new.
  - The clock-in, task-move and task-changed handlers now record the line's assignment origin.
  - New dev/qa-only CLI: `app:work-order:board-fixture:seed` and `app:work-order:board-fixture:remove`.
- **Data/DB:**
  - `Version20260929173000` adds `work_order_line.tech_assignment_origin` VARCHAR(10) NULL. It uses ALGORITHM=INSTANT and has no backfill.
  - `Version20260930100000` adds the table `work_order_board_position`. Its FKs to work_order and workplace are ON DELETE CASCADE.
  - "Clear shifts" deletes or shortens shift rows.
- **Permissions:**
  - No new permissions and no feature flags.
  - Board reads need `ROLE_WORK_ORDER_VIEW`. Board-move, change-lead and candidates need `ROLE_WORK_ORDER_CREATE_AND_EDIT`.
  - Clear shifts also enforces the schedule's own-data scope. A 403 there rolls back the whole change.
- **Config:**
  - `services.yaml` has `work_orders.board.items_all_threshold: 300`, plus a public alias for the list filter validator.
  - The request profiler log line gains a `profile` key.
  - `bin/smoke-test.sh` now probes the 2 board GETs.

### Frontend
- **Screens:**
  - `/workorders`: List, Board View, Tech View, and the phone card list.
  - `/workorders/:id`: the lead select on the status card, and the Lines tab.
  - Part Sale detail: the status card.
  - Customer → asset → Work Orders tab: the asset-on-site toggle.
- **Components:**
  - Shared `Table.vue` gets an additive `resetVirtualScroll`.
  - `FilterOptionListPanel` supports disabled options. It is used on every FilterBar page.
  - `VinDisplay` gets a `tabbable` prop.
  - `OrderStatusCard`.
  - Avatars are cached.
- **Dialogs:** Reassign lead technician, and the Clear shifts prompt.
- **Store:**
  - No Vuex changes.
  - TanStack Query caches: work-order lists, boards and candidates.
  - Page preference cache: `work-orders-list`.
- **API:**
  - `app/src/api/work-orders` adds board, board items, board move and candidates, plus options for change-lead.
  - `app/src/api/preferences`.
  - `boot/axios` combines abort signals. This affects every request.
- **Permissions / feature flags:**
  - `canEdit('workOrders')` gates card and row drag, ⋮ → Reassign, Create Work Order, the asset-on-site toggle and the lead select.
  - `canView('workOrders')` gates the Lines-tab roster read.
  - `seeFinancialData` gates Total price.
  - Pins and column or group reordering need no permission.
  - No `organizationHasFeature`.

## QA Checklist (do these)

### 0. Setup on sv10043 (once)
- [ ] Sign in through Google SSO, then log in as an admin. Note the 2 locations: call them A and B.
- [ ] At location A, check that at least 3 technicians (Tech A, B, C) are active, clockable and enrolled at A (Staff).
- [ ] Create about 8 service work orders with Create Work Order, using customers that already have an asset.
  - Give 3 to Tech A as lead and 2 to Tech B.
  - Leave 2 Unassigned.
  - Set one to Invoiced and one to Paid.
- [ ] Have 2 more users ready: one whose role has Work Orders **view but not edit**, and one without **see financial data**.
- [ ] Shift setup for sections 6 and 8: on `/schedule`, drag a work order from the sidebar onto a technician's lane. In the dialog:
  - "Entire work order" (`tab_drop_whole_order`) makes a whole-work-order shift.
  - "Choose lines" (`tab_drop_choose_lines`) schedules the technician on specific lines.

### 1. Display switcher and saved layout (`/workorders`, desktop 1024 px or wider)
- [ ] The switcher shows List, Tech View and Board View (`display_option_list`, `display_option_tech_view`, `display_option_board_view`). Clicking one swaps the view, and the URL stays `/workorders`. After a reload the last choice is still selected.
- [ ] In Board View and Tech View, the Density menu (`button_density`: Compact / Regular / Comfortable) changes card and row heights, and both views share the setting. List has no Density menu.
- [ ] Choose Status → Imported.
  - Board View and Tech View are disabled, with the tooltip "Not available while Imported is selected.", and the page shows List.
  - Clear Imported and the saved view comes back.
  - In Board View and Tech View, the Status chip's "Imported" option is greyed out, with the tooltip "Imported work orders open in List."
- [ ] Narrow the window below 1024 px. The switcher, density and pickers disappear and the card list shows. Widen it again and the saved view comes back unchanged.
- [ ] A second user's layout is independent. Log out and back in as the first user and that layout is restored.
- [ ] Switch the header location from A to B. The current view reloads for B, with nothing left over from A, and the saved layout stays.

### 2. List (rebuilt)
- [ ] The tabs All, Estimates, Work Orders and Completed (`tab_*`) reload the list and add `?tab=` to the URL. Changing tab clears the search box.
- [ ] Column Selection (`button_column_selection`): turn "Days open" on, reload, and it is still shown. Hidden by default: Invoiced Date, Days open, Parts, Returns, Waiting On Parts.
- [ ] Every sortable header orders the rows. With 12 work orders for one customer on the same date, paging shows no repeats and no gaps. On All, with only "Invoiced" selected in Status, the list sorts by Invoiced Date, newest first.
- [ ] Switch tabs quickly. The superseded `GET work-orders?…` shows as cancelled in Network, no error toast appears, and only the last tab's rows show.
- [ ] Click a row's asset-on-site toggle (`button_vehicle_here_toggle`).
  - The icon flips and the work order does not open.
  - The `POST work-orders/change` body has no `tech_assigned_id`, and the lead is unchanged.
  - The new value is still there after a reload.
- [ ] Open a work order, change its status, then press Back. The list refetches and shows the new status. A work order created with Create Work Order appears without a manual reload.
- [ ] Open `/workorders?tab=estimate&assigned_to_me=1`. Estimates and Assigned to me are applied. A plain `/workorders` afterwards shows the saved view, not the link's. `?vehicleHere=2` is ignored.
- [ ] Permissions:
  - Without financial data: no Total price column and no total.
  - View-only user: no Create Work Order button, and the toggle is disabled.
- [ ] Phone width (390 px):
  - Cards show.
  - The sort button (`button_sort_work_orders`: Newest First / Oldest First / Customer A-Z / Customer Z-A) keeps its choice after a reload.
  - Page 2 loads only after scrolling.
  - The empty state shows `empty_state_clear_filters_mobile`.

### 3. Board View
- [ ] Columns: Unassigned is first and fixed, then the technicians. Each header shows the name, the count (`board_column_count_<key>`) and a pin.
  - An empty column reads "Drag a work order here to assign it" for editors.
  - It reads "No work orders" for view-only users and on an inactive technician's column.
- [ ] Drag an Unassigned card onto Tech B, between two cards.
  - A blue line shows where it will land.
  - On drop, the toast "Lead technician updated" appears and both counts change.
  - After a reload the card is in the same place.
- [ ] Drag a card to Unassigned. The toast "Lead technician removed" appears, and the card sits in Unassigned's default order.
- [ ] Reorder within one column. No toast appears, the order holds after a reload, and the request body has `anchorWorkOrderId`, `placement` and the same `technicianId`.
- [ ] Invoiced or Paid card:
  - It shows a lock icon (`board_card_lock`).
  - Dragging it to another column shows the red pill "The lead technician can't be changed once a work order is Invoiced or Paid." and nothing changes.
  - Reordering it within its own column works.
- [ ] Deactivate a technician who still leads work. Their column shows an "Inactive" badge, and dropping on it shows "This technician can't be assigned work orders."
- [ ] Pins:
  - Pin 3 technicians (`button_board_pin_<staffId>`). They move after Unassigned, in pin order.
  - A 4th pin shows "You can pin up to 3 technicians." and does nothing.
  - Pins survive a reload.
  - With "Assigned to me" on, the pin buttons are hidden.
- [ ] Drag a column header onto another. The order survives a reload. Pinned columns reorder only among pins, Unassigned never moves, and Esc during a drag cancels it.
- [ ] Fields to display (`button_board_fields_selection`):
  - The defaults are Lead technician, Customer, Asset, Progress and Total price.
  - Turn on VIN/serial and turn off Customer. The cards update, the menu stays open, and the choice survives a reload.
  - A user without financial data has no Total price option.
- [ ] Turn on the "Line technicians" field. A work order with 6 technicians shows 4 avatars, the lead first, plus "+2" with the names in its tooltip.
- [ ] A card's ⋮ → "Reassign lead technician" opens the dialog (section 5). View-only users have no ⋮ and can't drag cards, but pins and column drag still work for them.
- [ ] Keyboard:
  - The board is a single Tab stop.
  - Arrows move between cards and headers.
  - Enter opens the work order and Space does nothing.
  - Tab to a card's ⋮ and press Enter to open its menu.
- [ ] A column with more than 25 work orders loads more as you scroll (`GET work-orders/board/items`, offset 25). Offline, it shows "Couldn't load more work orders." with Retry.
- [ ] Failures (DevTools Offline):
  - Dragging to another technician snaps the card back and shows the sticky alert "Failed to update lead technician, please try again."
  - A failed reorder shows "Couldn't save the new order. Please try again."
  - A reload shows "The board couldn't be loaded." with Retry.
- [ ] Open a card and press Back. The board comes back at the same scroll. Opening it fresh from the menu starts at the top-left.
- [ ] In touch emulation, swiping scrolls and cards never drag. Use the ⋮ menu to reassign.

### 4. Tech View
- [ ] There is one group per technician, plus Unassigned.
  - Collapse a group (`tech_view_group_toggle_<key>`) and reload: it stays collapsed.
  - An empty group shows "No work orders".
- [ ] Pin groups (limit of 3, with the same tooltip) and drag-reorder their headers by the grip. The sticky header (`tech_view_sticky_group`) follows the scroll, and its collapse toggle works.
- [ ] In the Tech View Column Selection, turn on "Assigned Techs". It appears right after Lines with avatars and survives a reload. The List's columns are unaffected.
- [ ] Drag a row into another technician's group.
  - The lead changes and a toast appears.
  - An Invoiced or Paid row can't be moved to another group.
  - ⋮ → Reassign works.
  - A view-only user has no ⋮ and can't drag rows.
- [ ] Keyboard: the table is a single Tab stop. ArrowUp and ArrowDown move through headers and rows, and Enter or Space on a header's chevron collapses it.
- [ ] Offline reload shows "Tech View couldn't be loaded." with Retry (`tech_view_retry`).
- [ ] Switching between Board View and Tech View within 30 s makes no new `/board` request and keeps the filters.

### 5. Reassign lead technician dialog
- [ ] Title "Reassign lead technician", subtitle "<number> · <company>".
  - The list starts with Unassigned, then the technicians, each with "N open".
  - The current lead shows "Current · N open".
  - Search filters the list and Unassigned stays. A string that matches nothing shows "No technicians match …".
  - Enter in the search box does not submit.
- [ ] Pick another technician and click Reassign.
  - A toast appears and the work order moves to the bottom of that group.
  - The request is `POST work-orders/change-lead-technician` with `{work_order_id, tech_assigned_id}`.
- [ ] Picking the current lead again sends no request and closes the dialog. Picking Unassigned shows "Lead technician removed".
- [ ] If the current lead is deactivated or not enrolled at this location, their row reads "Current · no longer assignable" and can't be selected.
- [ ] Network failures:
  - Block `lead-technician-candidates`: the dialog shows "Couldn't load technicians." with Retry, and Reassign is disabled.
  - Block the POST: the card snaps back, the sticky alert shows, and the dialog stays open for another try.
- [ ] Clicking the backdrop never closes the dialog. Escape closes it when nothing is saving. Arrows, Home and End move the selection.

### 6. Clear shifts prompt
- [ ] Give Tech A an "Entire work order" shift on work order W. Reassign W to Tech B from the dialog, by a Board drag, and by a Tech View drag. Each time, the prompt "Clear Tech A's scheduled shifts?" appears with Cancel / Keep shifts / Clear shifts.
- [ ] **Keep shifts:** the lead changes and A's shifts stay on `/schedule`.
- [ ] **Clear shifts:**
  - A future shift is removed.
  - A shift that is running now ends now.
  - An ended shift is untouched.
  - Shifts on specific lines are untouched.
  - In that setup the response has `clearedShiftCount: 2`.
- [ ] **Cancel, X or Escape:** nothing is sent, the card or row goes back, and no toast appears.
- [ ] No prompt appears when the old lead has no unended whole-work-order shift, or when the lead doesn't change (a reorder).
- [ ] A user limited to their own schedule data who chooses Clear shifts for someone else's shifts gets a 403, and the lead is **not** changed.

### 7. Lead technician rules (all entry points)
- [ ] Invoiced or Paid work order: changing the lead from the dialog, by a board drag or from the detail card is refused with "The lead technician can't be changed once a work order is Invoiced or Paid." (409).
  - Sending the same lead again succeeds.
  - Complete and Declined work orders can still change lead.
- [ ] On the detail page status card, the lead select is disabled on Invoiced and Paid. A successful change shows the new lead. A refused change shows an error and puts the old value back.
- [ ] Lines follow the lead. Set up a work order with lead A, line 1 created with no technician (it follows A), and line 2 set to Tech B on the Lines tab. Change the lead to C.
  - Line 1 moves to C. Line 2 stays B.
  - Lines with clocked time or extra line technicians don't move.
- [ ] Each change adds exactly one "Lead tech changed" entry to the work order history. This now also happens for changes made in Edit Work Order (`/work-orders/change`), which wrote no entry before.
- [ ] Edit Work Order on a Paid work order, with a different lead and a changed mileage, is refused (409), and the mileage is **not** saved.
- [ ] Adding, editing and assigning line technicians on the Lines tab still works. Clocking in on an unassigned line assigns that technician.

### 8. Lines tab: scheduled technicians (SV-9769)
- [ ] On `/schedule`, drop W onto Tech A, choose "Choose lines", and pick line 1 (no labor). On the Lines tab, line 1's labor shows "Tech A" (`line_labor_name_<lineId>`) instead of "No technicians assigned to this line." No "Needs techs" badge appears.
- [ ] Schedule two technicians on the same line and it shows "A, B" with no duplicates. Remove the shifts and it goes back to "No technicians assigned to this line."
- [ ] A line with real labor keeps its labor technician, and "Deleted user" stays. The lead alone, with no schedule, is not shown as scheduled.
- [ ] At phone width (390 px), expand the line card. "Assigned Technicians" shows the scheduled names (`line_labor_name_mobile_<lineId>`).
- [ ] Network shows one `GET work-orders/<id>/line-technicians` per work order. Offline, no error toast appears and the lines render as before. History mode sends no request.
- [ ] A line's tech story no longer has the green check icon in front (an intentional removal). The story is still editable.

### 9. API checks (DevTools or curl, as admin)
- [ ] `GET /api/work-orders/board?perGroup=25` → 200, with first group `unassigned` and `itemsMode: "all"` on this small DB. `groups[]=abc`, `perGroup=101` and `fill=13` → 400. No token → 401.
- [ ] `GET /api/work-orders/board/items?groups[0][key]=unassigned&groups[0][offset]=0&groups[0][limit]=2` → 200. A duplicate key, offset −1, limit 501 or empty groups → 400.
- [ ] `POST /api/work-orders/<id>/board-move` with `{"technicianId":"<staffId>"}` → 200, with `leadChanged`, `clearedShiftCount`, `lineTechnicians` and `matchesFilters`.
  - Missing `technicianId`, `"placement":"left"`, an extra key, or `"clearShifts":"false"` → 400.
  - A work order from location B, or a part sale id → 404.
  - A staff id from another organization → 422.
  - An anchor in another group → 409 `anchorNotInGroup`.
- [ ] `POST /api/work-orders/change-lead-technician` → 201. `work_order_id` is still present, plus `techAssignedId`, `clearedShiftCount`, `lineTechnicians`, `leadHasOpenWorkOrderShifts` and `matchesFilters`.
  - An unknown or foreign staff id → 422 "The selected lead technician was not found in this organization."
  - `"clear_shifts":"false"` → 400.
- [ ] `GET /api/work-orders/lead-technician-candidates` → 200.
  - It lists only active, clockable technicians enrolled at the current location. Office and Time Clock roles are excluded.
  - `openCount` = the service work orders they lead here that are Approved, In Progress, Ready for Review or Complete.
  - Switching location changes the list.
- [ ] `POST /api/work-orders/lines/change` with a foreign or unknown staff id → 400 "Technician not found.", and the line is unchanged. `lines/create` and `lines/assign-technician` behave the same.
- [ ] `GET /api/work-orders` rows now include `techAssignedId` and `vehicleYear`. `include[]=lineTechnicians` adds `lineTechnicians`, and `include[]=foo` → 400. The List, the customer Work Orders tab and the vehicle Work Orders tab still render.
- [ ] Denied cases:
  - A role without Work Orders edit → 403 on board-move, change-lead-technician and candidates.
  - A role without Work Orders view → 403 on the board reads.
- [ ] `GET /api/iam/view-avatar/<userId>` → 200 with an `ETag` and `Cache-Control: private, no-cache`. Sending `If-None-Match` → 304. After a new photo is uploaded, a reload shows the new image.

### 10. Tenant and data
- [ ] Logged in at location A, nothing from location B appears in the List, Board View, Tech View, the candidates or the part counts. A board-move or change-lead on a location-B work order is refused and nothing changes.
- [ ] Parts → Part Sales still shows the right part request and part return counts.
- [ ] With DB access, check the schema:
  - `work_order_line.tech_assignment_origin` exists, varchar(10) NULL.
  - `work_order_board_position` exists, with CASCADE FKs.
  - Deleting a work order that has a board position removes that row.

## What is NOT Impacted (safe to skip)
- [ ] Invoicing, payments, totals and accounting events. No billing code changed.
- [ ] The Schedule page itself. It is only read for shifts, and shifts change only through Clear shifts.
- [ ] Imported work orders. They still open in List and their lead stays locked.
- [ ] Other FilterBar, `<Table>`, `useTableQuery` and page-preference pages beyond one smoke check each (the shared changes are additive or opt-in).
- [ ] The customer Work Orders tab, apart from the asset-on-site toggle payload.
- [ ] Permission and feature-flag definitions (none were added or changed).

## Risk Level: High

**Justification:**
- **Schema and contract changes:** two migrations (a new table, and a new column on `work_order_line`), a new UI backed by new endpoints, and API contract changes (the `change-lead-technician` response and validation, and new list fields) that several screens consume.
- **One transaction with wide side effects:** a lead change now does all of these together, across VehicleService and TaskManagement:
  - moves the lines that followed the old lead;
  - deletes or shortens shifts;
  - writes the board position;
  - writes the history entry.
- **New organization scoping** on the work orders list and the part counts.

## Dev Verification
- [x] All static gates are green on the final tree:
  - PHPStan 0 errors, Pest green, eslint 0, vue-tsc 0, vitest 2952/2952.
  - Smoke test has no 500s, and `doctrine:migrations:diff` is a no-op.
  - PR #3548 CI is 36/36.
- [x] Local browser walks for every phase passed, including SV-9769 (8/8 on desktop and phone).
- [x] 21 new E2E cases are automated and 2 were updated (listed in the PR's E2E Coverage Summary).
- [x] sv10043 runs the PR head `7a95011a8c`. Deploy run 37700244765 succeeded on 2026-10-07 23:05 UTC. Redeploy after any new commit.
- [x] The migrations ran on sv10043: the same deploy run applied them.

## Regression Hotspots (top 5)
1. **Lead change side effects.** Check line following, Clear shifts, the single history entry and the Invoiced/Paid lock from every entry point: dialog, Board drag, Tech View drag, detail card and Edit Work Order.
2. **Drag and drop with an optimistic cache.** Check the rollback on failure, column counts, anchor order, two tabs moving the same card, and a card dropping off the board when it no longer matches the filters.
3. **The rebuilt Work Orders List.** Check saved preferences against URL links, Back and Forward, location switch, stale rows after an edit, and sorting and paging.
4. **Consumers of the `GET /api/work-orders` refactor.** The List, the customer and vehicle Work Orders tabs, and the Part Sales counts all now go through the new organization scoping.
5. **Shared FE plumbing.** `boot/axios` combined abort signals (every request, and impersonation), `FilterOptionListPanel`, `usePagePreferences`, and avatar caching.

## Coverage Proof

**Files covered:** 408/408. Each researcher entry was matched to its file by script. One row per directory; every file is named.

| Directory | Files | Domain | Covered |
|------|------|--------|---------|
| api/config/ | services.yaml, services_test.yaml | CONFIG | Yes (2/2) |
| api/migrations/ | Version20260929173000.php, Version20260930100000.php | DB | Yes (2/2) |
| api/src/IAM/Application/ViewAvatar/ | ViewAvatarController.php | BE/AUTH | Yes (1/1) |
| api/src/IAM/Domain/Service/ | AvatarService.php | BE | Yes (1/1) |
| api/src/Shared/Application/Lock/ | WaitingLock.php | BE | Yes (1/1) |
| api/src/Shared/Application/Profiler/ | RequestProfile.php | BE | Yes (1/1) |
| api/src/Shared/Domain/Error/ | CodedError.php | BE | Yes (1/1) |
| api/src/Shared/Infrastructure/Doctrine/Schema/ | ExpressionIndexFilteringMySQLSchemaManager.php | BE | Yes (1/1) |
| api/src/Shared/Infrastructure/EventSubscriber/ | ApiErrorHandler.php | BE | Yes (1/1) |
| api/src/Shared/Infrastructure/Lock/ | AdvisoryLockName.php, MySqlAdvisoryLock.php, MySqlAdvisoryWaitingLock.php | BE | Yes (3/3) |
| api/src/Shared/Infrastructure/Profiler/EventSubscriber/ | RequestProfilerSubscriber.php | BE | Yes (1/1) |
| api/src/Shared/Infrastructure/Profiler/ | InMemoryRequestProfile.php | BE | Yes (1/1) |
| api/src/Shared/Infrastructure/Symfony/HttpKernel/ | RequestPayloadValueResolver.php | BE | Yes (1/1) |
| api/src/Shared/Infrastructure/Validator/Constraints/ | IsOrganizationStaffIdentifier.php, IsOrganizationStaffIdentifierValidator.php | BE/AUTH | Yes (2/2) |
| api/src/Shared/UI/HTTP/ArgumentResolver/ | StrictBool.php | BE | Yes (1/1) |
| api/src/TaskManagement/Schedule/Domain/Repository/ | ShiftRepository.php | BE | Yes (1/1) |
| api/src/TaskManagement/Schedule/Infrastructure/Persistence/Repository/Doctrine/ | ShiftRepository.php | BE | Yes (1/1) |
| api/src/TaskManagement/Schedule/Infrastructure/WorkOrders/ | ShiftLeadOpenWorkOrderShiftsCondition.php, ShiftOutgoingLeadShiftClearer.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/Change/ | ChangeCommand.php, ChangeCommandHandler.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/ChangeLeadTechnician/ | ChangeCommand.php, ChangeCommandHandler.php, ChangeController.php (deleted), ChangeResultDto.php | BE, BE/AUTH | Yes (4/4) |
| api/src/VehicleService/WorkOrders/Application/Command/Board/ | MoveWorkOrderOnBoardCommand.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Application/DTO/Board/ | MoveWorkOrderOnBoardResultDto.php, WorkOrderBoardDto.php, WorkOrderBoardGroupDto.php, WorkOrderBoardItemsDto.php, WorkOrderBoardItemsGroupDto.php, WorkOrderBoardTechnicianDto.php | BE | Yes (6/6) |
| api/src/VehicleService/WorkOrders/Application/DTO/LeadTechnician/ | LeadTechnicianCandidateDto.php, LeadTechnicianCandidateListDto.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/Handler/Board/ | ListWorkOrderBoardItemsQueryHandler.php, MoveWorkOrderOnBoardCommandHandler.php, ViewWorkOrderBoardQueryHandler.php | BE | Yes (3/3) |
| api/src/VehicleService/WorkOrders/Application/Handler/LeadTechnician/ | ListLeadTechnicianCandidatesQueryHandler.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Application/Line/AssignTechnician/ | AssignTechnicianCommand.php, AssignTechnicianCommandHandler.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/Line/Change/ | ChangeCommand.php, ChangeCommandHandler.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/Line/Create/ | CreateCommand.php, CreateCommandHandler.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/List/DTO/ | WorkOrderDto.php, WorkOrderLineTechnicianDto.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/List/ | ListingController.php, ListingQuery.php, ListingQueryDto.php, ListingQueryHandler.php | BE, BE/AUTH | Yes (4/4) |
| api/src/VehicleService/WorkOrders/Application/Query/Board/ | BoardGroupKey.php, BoardGroupRange.php, BoardItemSelection.php, BoardTechnicianFetcherInterface.php, LeadOpenWorkOrderShiftsCondition.php, ListWorkOrderBoardItemsQuery.php, ViewWorkOrderBoardQuery.php, WorkOrderBoardFetcherInterface.php, WorkOrderBoardWindow.php, WorkOrderBoardWindowRow.php, WorkOrderLeadSnapshotFetcherInterface.php | BE | Yes (11/11) |
| api/src/VehicleService/WorkOrders/Application/Query/LeadTechnician/ | LeadTechnicianCandidateFetcherInterface.php, ListLeadTechnicianCandidatesQuery.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/Query/WorkOrder/ | WorkOrderListCriteria.php, WorkOrderListFilterValidatorInterface.php, WorkOrderListItemEnricherInterface.php, WorkOrderListingFetcherInterface.php | BE | Yes (4/4) |
| api/src/VehicleService/WorkOrders/Application/Service/Board/ | BoardGroupLock.php, BoardPerformanceFixturePlan.php, BoardPerformanceFixturePlanner.php, BoardPerformanceFixtureProfile.php, BoardPerformanceFixtureReport.php, BoardPerformanceFixtureStore.php, WorkOrderBoardAssembler.php, WorkOrderBoardPositioner.php | BE | Yes (8/8) |
| api/src/VehicleService/WorkOrders/Application/Service/ | OutgoingLeadShiftClearer.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Application/Service/WorkOrder/ | LeadChangeOutcome.php, LeadTechnicianChanger.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Application/Task/Move/ | MoveCommandHandler.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Domain/Error/ | LeadTechnicianLockedError.php, LeadTechnicianNotInOrganizationError.php, LineTechnicianNotInOrganizationError.php, WorkOrderBoardMoveConflictError.php | BE | Yes (4/4) |
| api/src/VehicleService/WorkOrders/Domain/ | LeadTechnicianChange.php, WorkOrder.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Domain/Line/ | AssignTechnicianToWOLines.php, ChangeLineSinceTaskChanged.php, Line.php, LineTechAssignmentOrigin.php, UpdateAssignedTechnicianWhenTechClocksInToUnassignedLine.php | BE | Yes (5/5) |
| api/src/VehicleService/WorkOrders/Domain/Line/Service/ | LineFetcher.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Domain/Model/ | BoardAnchor.php, BoardPlacement.php, BoardSortKey.php, WorkOrderBoardPosition.php | BE | Yes (4/4) |
| api/src/VehicleService/WorkOrders/Domain/PartRequest/Service/ | PartRequestFetcher.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Domain/PartReturnRequest/Services/ | PartReturnRequestFetcher.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Domain/Repository/ | WorkOrderBoardGroupReader.php, WorkOrderBoardPositionRepository.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Domain/Service/ | BoardSortKeyPlanner.php, WorkOrderProgressCalculator.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/Infrastructure/Doctrine/Line/ | Line.orm.xml | DB | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Infrastructure/Doctrine/Model/ | WorkOrderBoardPosition.orm.xml | DB | Yes (1/1) |
| api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/ | DbalBoardTechnicianFetcher.php, DbalLeadTechnicianCandidateFetcher.php, DbalWorkOrderBoardFetcher.php, DbalWorkOrderBoardGroupReader.php, DbalWorkOrderLeadSnapshotFetcher.php, DbalWorkOrderListItemEnricher.php, DbalWorkOrderListingFetcher.php, LeadTechnicianEligibilityPredicate.php, WorkOrderBoardOrder.php, WorkOrderListRowProjection.php, WorkOrderListingCriteriaApplier.php | BE | Yes (11/11) |
| api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Repository/Dbal/ | DbalBoardPerformanceFixtureStore.php, DbalWorkOrderBoardPositionRepository.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/UI/CLI/ | RemoveWorkOrderBoardPerformanceFixtureCommand.php, SeedWorkOrderBoardPerformanceFixtureCommand.php | BE | Yes (2/2) |
| api/src/VehicleService/WorkOrders/UI/HTTP/Board/DTO/ | ListWorkOrderBoardItemsRequestDto.php, MoveWorkOrderOnBoardRequestDto.php, ViewWorkOrderBoardRequestDto.php | BE | Yes (3/3) |
| api/src/VehicleService/WorkOrders/UI/HTTP/Board/ | ListWorkOrderBoardItemsController.php, MoveWorkOrderOnBoardController.php, ViewWorkOrderBoardController.php | BE/AUTH | Yes (3/3) |
| api/src/VehicleService/WorkOrders/UI/HTTP/ChangeLeadTechnician/ | ChangeLeadTechnicianController.php | BE/AUTH | Yes (1/1) |
| api/src/VehicleService/WorkOrders/UI/HTTP/ChangeLeadTechnician/DTO/ | ChangeLeadTechnicianRequestDto.php | BE | Yes (1/1) |
| api/src/VehicleService/WorkOrders/UI/HTTP/LeadTechnician/ | ListLeadTechnicianCandidatesController.php | BE/AUTH | Yes (1/1) |
| api/tests/Fixture/VehicleService/WorkOrders/ | LeadTechnicianCandidatesFixtures.php, LeadTechnicianChangeFixtures.php, WorkOrderBoardFixtures.php, WorkOrderBoardMoveFixtures.php, WorkOrdersListingPageSizeTestFixtures.php, WorkOrdersListingPartReturnRequestTestFixtures.php | TEST | Yes (6/6) |
| api/tests/Functional/IAM/ViewAvatar/ | ViewAvatarControllerTest.php | TEST | Yes (1/1) |
| api/tests/Functional/TaskManagement/Schedule/ | LeadChangeShiftClearingTest.php, ShiftLeadOpenWorkOrderShiftsConditionTest.php | TEST | Yes (2/2) |
| api/tests/Functional/VehicleService/WorkOrders/Board/ | BoardPositionOnLeadChangeTest.php, ListWorkOrderBoardItemsTest.php, MoveWorkOrderOnBoardTest.php, ViewWorkOrderBoardTest.php, WorkOrderBoardPositionerTest.php, WorkOrderBoardStatementBudgetTest.php | TEST | Yes (6/6) |
| api/tests/Functional/VehicleService/WorkOrders/ChangeLeadTechnician/ | ChangeLeadTechnicianTest.php | TEST | Yes (1/1) |
| api/tests/Functional/VehicleService/WorkOrders/Domain/PartRequest/Service/ | PartRequestFetcherTest.php | TEST | Yes (1/1) |
| api/tests/Functional/VehicleService/WorkOrders/Domain/PartReturnRequest/Services/ | PartReturnRequestFetcherTest.php | TEST | Yes (1/1) |
| api/tests/Functional/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/ | DbalBoardTechnicianFetcherTest.php, DbalLeadTechnicianCandidateFetcherTest.php, DbalWorkOrderBoardFetcherTest.php, DbalWorkOrderBoardGroupReaderTest.php, DbalWorkOrderLeadSnapshotFetcherTest.php, DbalWorkOrderListItemEnricherTest.php, LeadTechnicianEligibilityPredicateTest.php | TEST | Yes (7/7) |
| api/tests/Functional/VehicleService/WorkOrders/Infrastructure/Persistence/Repository/Dbal/ | DbalBoardPerformanceFixtureStoreTest.php, DbalWorkOrderBoardPositionRepositoryTest.php | TEST | Yes (2/2) |
| api/tests/Functional/VehicleService/WorkOrders/LeadTechnician/ | ListLeadTechnicianCandidatesTest.php | TEST | Yes (1/1) |
| api/tests/Functional/VehicleService/WorkOrders/Line/ | LineTechnicianOrganizationCheckTest.php | TEST | Yes (1/1) |
| api/tests/Functional/VehicleService/WorkOrders/ | ListingTest.php | TEST | Yes (1/1) |
| api/tests/Support/Dbal/ | CountingPdoStatement.php | TEST | Yes (1/1) |
| api/tests/Support/ | SeedsWorkOrderShifts.php | TEST | Yes (1/1) |
| api/tests/Unit/Shared/Infrastructure/EventSubscriber/ | ApiErrorHandlerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/Shared/Infrastructure/Lock/ | MySqlAdvisoryWaitingLockTest.php | TEST | Yes (1/1) |
| api/tests/Unit/Shared/Infrastructure/Profiler/EventSubscriber/ | RequestProfilerSubscriberTest.php | TEST | Yes (1/1) |
| api/tests/Unit/Shared/Infrastructure/Symfony/HttpKernel/ | RequestPayloadValueResolverStrictBoolTest.php | TEST | Yes (1/1) |
| api/tests/Unit/Shared/Infrastructure/Validator/Constraints/ | IsOrganizationStaffIdentifierValidatorTest.php | TEST | Yes (1/1) |
| api/tests/Unit/TaskManagement/Schedule/Infrastructure/WorkOrders/ | FakeShiftRepository.php, ShiftOutgoingLeadShiftClearerTest.php | TEST | Yes (2/2) |
| api/tests/Unit/VehicleService/WorkOrders/Application/Change/ | ChangeCommandHandlerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Application/ChangeLeadTechnician/ | ChangeCommandHandlerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Application/Handler/Board/ | ListWorkOrderBoardItemsQueryHandlerTest.php, MoveWorkOrderOnBoardCommandHandlerTest.php, ViewWorkOrderBoardQueryHandlerTest.php | TEST | Yes (3/3) |
| api/tests/Unit/VehicleService/WorkOrders/Application/Line/Change/ | ChangeCommandHandlerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Application/Line/ChangeLines/ | ChangeLinesStatusHandlerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Application/List/ | ListingQueryHandlerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Application/Service/Board/ | BoardGroupLockTest.php, BoardPerformanceFixturePlannerTest.php, RecordingWaitingLock.php, WorkOrderBoardAssemblerTest.php, WorkOrderBoardPositionerTest.php | TEST | Yes (5/5) |
| api/tests/Unit/VehicleService/WorkOrders/Application/Service/WorkOrder/ | LeadTechnicianChangerTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/Error/ | WorkOrderBoardMoveConflictErrorTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/Line/ | LineAuditStampTest.php, LineTest.php | TEST | Yes (2/2) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/Model/ | BoardSortKeyTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/PartRequest/Service/ | PartRequestFetcherTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/PartReturnRequest/Services/ | PartReturnRequestFetcherTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/Service/ | BoardSortKeyPlannerTest.php, WorkOrderProgressCalculatorTest.php | TEST | Yes (2/2) |
| api/tests/Unit/VehicleService/WorkOrders/Domain/ | WorkOrderLeadTechnicianChangeTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/ | WorkOrderListingCriteriaApplierTest.php | TEST | Yes (1/1) |
| api/tests/Unit/VehicleService/WorkOrders/Infrastructure/Persistence/Repository/Dbal/ | DbalWorkOrderBoardPositionRepositoryMySqlTest.php | TEST | Yes (1/1) |
| app/docs/patterns/ | dialogs.md | CONFIG | Yes (1/1) |
| app/src/api/preferences/ | index.ts, keys.ts, queries.ts | API | Yes (3/3) |
| app/src/api/preferences/tests/ | queries.spec.ts | TEST | Yes (1/1) |
| app/src/api/work-orders/ | LeadBoardModel.ts, WorkOrdersModel.ts, index.ts, keys.ts, leadBoardCache.ts, leadBoardQueries.ts, queries.ts, workOrderCache.ts | API | Yes (8/8) |
| app/src/api/work-orders/tests/ | boardMove.spec.ts, leadBoardCache.spec.ts, leadBoardFixtures.ts, leadBoardQueries.spec.ts, leadTechnicianQueries.spec.ts, list.spec.ts, queries.spec.ts, workOrderCache.spec.ts | TEST | Yes (8/8) |
| app/src/boot/ | axios.ts | UTIL | Yes (1/1) |
| app/src/boot/tests/ | axios-abort-signal.spec.ts | TEST | Yes (1/1) |
| app/src/components/forms/ | Table.vue | UI | Yes (1/1) |
| app/src/components/shared/ | OrderStatusCard.vue | UI | Yes (1/1) |
| app/src/components/shared/tests/ | OrderStatusCard.spec.ts | TEST | Yes (1/1) |
| app/src/components/ts/customers/ | VehicleWorkOrdersModel.ts, VehicleWorkOrdersTab.vue | UI, UTIL | Yes (2/2) |
| app/src/components/ts/customers/tests/ | VehicleWorkOrdersTab.spec.ts | TEST | Yes (1/1) |
| app/src/components/ts/parts/part-sale/ | PartSale.vue, PartSaleLeftSection.vue | UI | Yes (2/2) |
| app/src/components/ts/shared/ | VinDisplay.vue | UI | Yes (1/1) |
| app/src/components/ts/shared/filters/ | FilterOptionListPanel.vue, Model.ts | UI, UTIL | Yes (2/2) |
| app/src/components/ts/shared/filters/tests/ | FilterOptionListPanel.spec.ts | TEST | Yes (1/1) |
| app/src/components/ts/shared/tests/ | VinDisplay.spec.ts | TEST | Yes (1/1) |
| app/src/components/ts/work-orders/ | Model.ts, WorkOrderLeftSection.vue, WorkOrdersBoardModel.ts, leadAssignmentRules.ts | UI, UTIL | Yes (4/4) |
| app/src/components/ts/work-orders/displays/ | Model.ts, WorkOrdersPageBody.vue, constants.ts, density.scss | UI, UTIL | Yes (4/4) |
| app/src/components/ts/work-orders/displays/board/ | BoardColumn.vue, BoardColumnHeader.vue, WorkOrderBoardCard.vue, WorkOrdersBoardViewDisplay.vue, boardColumns.ts, boardFields.ts | UI, UTIL | Yes (6/6) |
| app/src/components/ts/work-orders/displays/board/tests/ | BoardColumn.spec.ts, WorkOrderBoardCard.spec.ts, WorkOrdersBoardViewDisplay.spec.ts, boardColumns.spec.ts, boardFields.spec.ts | TEST | Yes (5/5) |
| app/src/components/ts/work-orders/displays/composables/ | leadBoardGroups.ts, leadChangeFeedback.ts, leadTechnicianOptions.ts, technicianOrder.ts, useBoardColumnScroll.ts, useLeadBoard.ts, useLeadBoardMove.ts, useLeadBoardReassign.ts, useLeadBoardReassignHost.ts, useReassignLeadTechnician.ts, useVehicleHereToggle.ts, useWorkOrderRowNavigation.ts, useWorkOrdersAnalytics.ts, useWorkOrdersListQuery.ts, useWorkOrdersScrollRestoration.ts, useWorkOrdersViewState.ts, workOrdersAnalytics.ts, workOrdersFilters.ts, workOrdersListSort.ts, workOrdersPreference.ts | UTIL | Yes (20/20) |
| app/src/components/ts/work-orders/displays/composables/tests/ | leadBoardGroups.spec.ts, leadChangeFeedback.spec.ts, leadTechnicianOptions.spec.ts, technicianOrder.spec.ts, useBoardColumnScroll.spec.ts, useLeadBoard.spec.ts, useLeadBoardMove.spec.ts, useLeadBoardReassign.spec.ts, useLeadBoardReassignHost.spec.ts, useReassignLeadTechnician.spec.ts, useVehicleHereToggle.spec.ts, useWorkOrdersListQuery.spec.ts, useWorkOrdersScrollRestoration.spec.ts, workOrdersAnalytics.spec.ts, workOrdersFilters.spec.ts, workOrdersListSort.spec.ts, workOrdersPreference.spec.ts | TEST | Yes (17/17) |
| app/src/components/ts/work-orders/displays/dialogs/ | ClearShiftsPrompt.vue, ReassignLeadTechnicianDialog.vue, defineAsyncPrompt.ts | UI, UTIL | Yes (3/3) |
| app/src/components/ts/work-orders/displays/dialogs/tests/ | ClearShiftsPrompt.spec.ts, ReassignLeadTechnicianDialog.spec.ts, defineAsyncPrompt.spec.ts | TEST | Yes (3/3) |
| app/src/components/ts/work-orders/displays/drag/ | BoardDragGhost.vue, boardDropRules.ts, groupDrag.ts, useBoardDrag.ts | UI, UTIL | Yes (4/4) |
| app/src/components/ts/work-orders/displays/drag/tests/ | BoardDragGhost.spec.ts, boardDropRules.spec.ts, groupDrag.spec.ts, useBoardDrag.spec.ts | TEST | Yes (4/4) |
| app/src/components/ts/work-orders/displays/keyboard/ | keyboardTargets.ts, useBoardKeyboardColumns.ts, useDisplayKeyboard.ts, useTabStop.ts | UTIL | Yes (4/4) |
| app/src/components/ts/work-orders/displays/keyboard/tests/ | keyboardTargets.spec.ts, useBoardKeyboardColumns.spec.ts, useDisplayKeyboard.spec.ts, useTabStop.spec.ts | TEST | Yes (4/4) |
| app/src/components/ts/work-orders/displays/list/ | WorkOrdersListDisplay.vue, WorkOrdersMobileList.vue, workOrderColumns.ts | UI, UTIL | Yes (3/3) |
| app/src/components/ts/work-orders/displays/list/tests/ | WorkOrdersListDisplay.dom.spec.ts, workOrderColumns.spec.ts | TEST | Yes (2/2) |
| app/src/components/ts/work-orders/displays/shared/ | AvatarGroup.vue, WorkOrderMoreActions.vue, WorkOrderTableRow.vue, avatarGroup.ts, leadBoardItemReassign.ts | UI, UTIL | Yes (5/5) |
| app/src/components/ts/work-orders/displays/shared/tests/ | AvatarGroup.render.spec.ts, WorkOrderMoreActions.spec.ts, WorkOrderTableRow.spec.ts, avatarGroup.spec.ts, leadBoardItemReassign.spec.ts | TEST | Yes (5/5) |
| app/src/components/ts/work-orders/displays/tech-view/ | TechViewGroupHeader.vue, TechViewGroupRow.vue, TechViewWorkOrderRow.vue, WorkOrdersTechViewDisplay.vue, techViewColumns.ts, techViewDragTargets.ts, techViewRows.ts | UI, UTIL | Yes (7/7) |
| app/src/components/ts/work-orders/displays/tech-view/tests/ | TechViewGroupHeader.spec.ts, WorkOrdersTechViewDisplay.spec.ts, techViewColumns.spec.ts, techViewDragTargets.spec.ts, techViewRows.spec.ts | TEST | Yes (5/5) |
| app/src/components/ts/work-orders/displays/toolbar/ | BoardFieldsPicker.vue, DensityMenu.vue, DisplayOptionSwitcher.vue, TechViewColumnsPicker.vue, WorkOrdersToolbar.vue | UI | Yes (5/5) |
| app/src/components/ts/work-orders/displays/toolbar/tests/ | BoardFieldsPicker.spec.ts, DensityMenu.spec.ts, DisplayOptionSwitcher.spec.ts, TechViewColumnsPicker.spec.ts, WorkOrdersToolbar.spec.ts | TEST | Yes (5/5) |
| app/src/components/ts/work-orders/tests/ | leadAssignmentRules.spec.ts | TEST | Yes (1/1) |
| app/src/components/ts/work-orders/work-order-lines/ | WorkOrderLineCard.vue, WorkOrderLineRow.vue, WorkOrderLines.vue, helpers.ts | UI, UTIL | Yes (4/4) |
| app/src/components/ts/work-orders/work-order-lines/tests/ | WorkOrderLineCard.spec.ts, WorkOrderLineRow.spec.ts, WorkOrderLines.scheduledTechnicians.spec.ts, helpers.spec.ts | TEST | Yes (4/4) |
| app/src/composables/tests/ | useGoogleAnalytics.spec.ts, usePagePreferences.spec.ts, useTableQuery.spec.ts | TEST | Yes (3/3) |
| app/src/composables/ | useGoogleAnalytics.ts, usePagePreferences.ts, usePageSearchSession.ts, useTableQuery.ts | UTIL | Yes (4/4) |
| app/src/pages/ | WorkOrders.vue | UI | Yes (1/1) |
| app/src/pages/tests/ | WorkOrders.spec.ts, WorkOrdersAnalytics.spec.ts, WorkOrdersLocationSwitch.spec.ts, WorkOrdersPreferences.spec.ts | TEST | Yes (4/4) |
| app/src/testing/ | handlers.ts | TEST | Yes (1/1) |
| app/src/utils/ | axiosHelpers.ts, helpers.ts | UTIL | Yes (2/2) |
| app/src/utils/tests/ | axiosHelpers.spec.ts, notificationTestId.spec.ts | TEST | Yes (2/2) |
| bin/ | smoke-test.sh | CONFIG | Yes (1/1) |
| e2e/.claude/reference/ | testing-standards.md | E2E | Yes (1/1) |
| e2e/ | coverage-backlog.json, playwright.config.ts | E2E | Yes (2/2) |
| e2e/src/api/factories/ | work-order.factory.ts | E2E | Yes (1/1) |
| e2e/src/pages/dialogs/ | clear-shifts.dialog.ts, reassign-lead-technician.dialog.ts | E2E | Yes (2/2) |
| e2e/src/pages/navigation/ | location-selector.page.ts | E2E | Yes (1/1) |
| e2e/src/pages/work-orders/ | lines.page.ts, work-orders-board-view.page.ts, work-orders-display-switcher.page.ts, work-orders-filter-bar.page.ts, work-orders-tech-view.page.ts, work-orders.page.ts | E2E | Yes (6/6) |
| e2e/src/utils/ | board-drag.helper.ts | E2E | Yes (1/1) |
| e2e/tests/permissions/ | wo-detail-card-permissions.spec.ts | E2E | Yes (1/1) |
| e2e/tests/ui/work-orders/ | board-view-drag-reassign-lead.spec.ts, board-view-fields-to-display.spec.ts, board-view-grouping.spec.ts, board-view-keyboard-reassign.spec.ts, board-view-pin-technicians.spec.ts, board-view-reorder-technicians.spec.ts, detail-asset-on-site-toggle.spec.ts, filters-persistence.spec.ts, lead-change-clear-shifts.spec.ts, lead-technician-clockable.spec.ts, lines-scheduled-technicians.spec.ts, list-asset-on-site-toggle.spec.ts, list-location-switch.spec.ts, tech-view-collapse-groups.spec.ts, tech-view-column-selection.spec.ts, tech-view-drag-reassign-lead.spec.ts, tech-view-grouping.spec.ts, tech-view-keyboard.spec.ts, work-orders-back-restore.spec.ts | E2E | Yes (19/19) |
