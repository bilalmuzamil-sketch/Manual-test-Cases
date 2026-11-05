# QA Handoff — Auto Generated (from diff)

**Branch:** SV-12048-whole-order-shift-lines (PR #4131)
**Base:** main (bugfix line)
**Scope:** Full-stack
**Files changed:** 79 (BE: 56 incl. 1 migration and 25 tests, FE: 16 incl. 11 specs, E2E: 8)
**Generated:** 2026-11-04

---

## What Changed (plain English)
- A Schedule shift booked for the **whole work order** now automatically picks up every line of that work order the moment the line is **approved**, as long as the shift hasn't ended. The shift's technician is added to the line, just like a drag. This fixes the reported bug where a work order created from a Schedule cell showed **0 lines** forever.
- Each shift now remembers how it was booked:
  - **Whole work order:** the "Entire work order" tab, dragging a work order card (including a single-line card), Assign Work Order, or a work order created from a Schedule cell.
  - **Chosen lines:** the "Choose lines" tab (even with every line ticked), or dragging a single line.
- Chosen-lines shifts, ended shifts and all shifts booked **before this release** never change. A new line never makes a shift longer.

## Where This Applies

### Backend
- **API:**
  - Create shift and Restore (Undo) shift accept the new booking type.
  - Every shift returned by the Schedule board, shift details and write responses carries it.
  - Deleting shifts (all three scopes) now cleans up technicians reliably.
- **Background jobs:** two new listeners that run when a line becomes approved (status changed to Authorized, single or bulk, or a line created already approved). Un-completing a line (Complete → Authorized) is ignored.
- **Data/DB:** migration adds `schedule_shift.coverage` (default "chosen lines"). There's no backfill: existing shifts keep today's behavior.
- **Permissions:** unchanged. The same Schedule and line-approval permissions apply.
- **Config:** none.

### Frontend
- **Screens:** Schedule (`/schedule`). There is **no visible UI change**: no new buttons, labels or test IDs.
- **Components:** Schedule page drop handling.
- **Dialogs:**
  - Drop dialog: the "Entire work order" and "Choose lines" tabs, single-day and multi-day.
  - Assign Work Order.
  - Delete scope: "This shift only", "This and all later shifts", "Entire series".
  - Undo toast.
- **Store / API:** the Schedule API model gains the booking type, and Undo sends it back.
- **Permissions / feature flags:** none.

## Setup (do once)
- Log in to **https://sv12048.qa.shopview.com/** as an **Admin/Owner** user who can edit the Schedule and approve lines.
- You need at least **2 technicians** with Schedule lanes and working hours (e.g. 9:00–17:00) on the days you'll use. Use **tomorrow or later** for every booking: a shift whose end time has already passed is "ended" and, by design, never picks up new lines.
- For every work order you create:
  - Use a **fresh customer and vehicle**.
  - Give every line an **estimated labor time** (e.g. 2h). The Schedule refuses to book lines with no estimate ("Estimate required").
- **Approving a line:** use the line's **Approve / Authorized** action on the work order's **Lines** tab. If the shop setting auto-approves new lines, a newly added line is approved immediately. That's fine: it should then join the shift straight away.
- **Re-check the Schedule:** after changing lines on a work order, go back to Schedule and **reload the page**. Open a shift by clicking it to see **Shift details → Work Order Lines (N)**.

## QA Checklist (do these)

### A. The reported bug: work order created from a Schedule cell
- [ ] On **Schedule → Day view**, go to tomorrow. Click an empty spot on a technician's lane and choose **New Work Order**. Pick the customer and vehicle, then **Save**. The dialog closes, you stay on the Schedule, and a block appears on that lane.
- [ ] Open the block. Shift details show **no lines** yet.
- [ ] Open the work order → **Lines** tab. Add 2 lines with estimates and approve both.
- [ ] Back on the Schedule (reload), open the block. Shift details now list **both lines** ("Work Order Lines 2").
- [ ] On the work order's Lines tab, the lane's technician now appears on both lines.

### B. "Entire work order" drop picks up lines approved later
- [ ] Create a work order from **Work Orders** with **2 approved lines** (2h each) and approve the work order so it appears in the Schedule sidebar.
- [ ] On the Schedule (tomorrow), drag its card from the sidebar onto a technician lane. The drop dialog opens on **Entire work order**. Confirm.
- [ ] Open the block. It shows **2 lines**.
- [ ] On the work order, add a **3rd line**, then approve it. Reload the Schedule and open the block. It shows **3 lines**, and the technician appears on the new line on the Lines tab.
- [ ] Add a **4th line but leave it waiting for approval**. Reload. The block still shows **3**. Approve it and reload. It shows **4**.

### C. "Choose lines" never grows, even with every line ticked
- [ ] With another work order with 2 approved lines, drag the card onto a lane. In the drop dialog switch to **Choose lines**, tick **both** lines, and confirm.
- [ ] Add and approve a 3rd line on that work order. Reload. The block still shows **2 lines**, and the 3rd line is listed in the sidebar as unscheduled.
- [ ] Repeat with only **1 of 2** lines ticked. Approving another line does **not** add it.

### D. Single-line drops (by design they differ)
- [ ] Drag a **work order card that has a single line**. It books directly with no dialog. Approve a new line on it. It **joins** the shift (whole work order).
- [ ] Open the sidebar **line panel** and drag **one line** onto a lane. Approve another line on that work order. It does **not** join (chosen lines).

### E. Multi-day bookings
- [ ] Drag a work order whose lines don't fit in one day (e.g. 3 lines × 8h) and keep **Entire work order**, so it books as a **series** over several days.
- [ ] Approve a new line. **Every day of the series** that hasn't ended shows the new line. The day blocks keep their **same length** (no longer).
- [ ] Repeat with **Choose lines**. No day gains the new line.

### F. Other ways of booking
- [ ] **Assign Work Order:** click an empty cell, choose **Assign Work Order** and pick a work order. Approving a new line later **adds** it to that shift.
- [ ] **Unassigned/department lane:** drop a work order card on the **Unassigned** lane (or a department lane). Approving a new line **adds it to the shift**, but **no technician** is added to the line.
- [ ] **Parked shift re-homed:** move a parked (Unassigned) whole-work-order shift onto a technician. It still picks up newly approved lines. A parked shift that came from a single-line drag still does **not**.

### G. Ended and existing shifts don't change
- [ ] On a work order with a whole-work-order shift in the **past** (drag onto yesterday) and one **tomorrow**, approve a new line. **Yesterday's** shift is unchanged, and **tomorrow's** gains the line.
- [ ] Any shift booked **before this release** (existing data on the QA env) does **not** pick up newly approved lines.

### H. Un-completing a line is not a new approval
- [ ] On a whole-work-order shift, mark one line **Complete**. On the Lines tab, remove the shift's technician from that line (the line comes off that technician's shift).
- [ ] Set the line back to **Authorized**. Reload. The line does **not** come back onto that technician's shift, and the technician is **not** re-added to it.

### I. Deleting shifts cleans up technicians
- [ ] Delete a single whole-work-order shift (**This shift only**). Its technician is removed from the work order's lines, unless another shift of theirs still covers them.
- [ ] On a 3+ day series, open the **middle** day and delete **This and all later shifts**. Those days disappear. The technician **stays** on the lines, because the remaining first day still covers them.
- [ ] Delete the remaining day (or use **Entire series**). The technician is **removed** from the lines. Other technicians' shifts on the same work order keep theirs.

### J. Undo keeps the booking type
- [ ] Delete a whole-work-order shift, then click **Undo** in the toast. It comes back with the same lines. Approve a new line. It **joins**.
- [ ] Delete a chosen-lines shift and Undo. Approving a new line does **not** join.
- [ ] Delete a whole-work-order **series** with **Entire series** and Undo. All days return and still pick up a newly approved line.

### K. Lead technician change (existing "Clear shifts" prompt)
- [ ] On a work order whose **lead technician** has a whole-work-order shift, change the lead to another technician and accept clearing the outgoing lead's shifts. Then **Undo**. The shift returns, and approving a new line afterwards still **adds** it.

### L. Unchanged line rules
- [ ] **Decline** a line that is on a shift. It stays on the shift, shown as **Declined** in shift details.
- [ ] **Delete** a line that is on a shift. It disappears from the shift.
- [ ] Throughout: no error toasts and no blank or broken Schedule.

## What is NOT Impacted (safe to skip)
- [ ] Moving, resizing and reassigning shifts by drag: they work exactly as before and never change the booking type.
- [ ] Schedule events (non-work-order calendar items), conflict warnings, capacity bars, sidebar filters and search.
- [ ] Shift length: a new line never extends a shift.
- [ ] Work order pricing, invoicing, parts, timesheets and clock-in.
- [ ] Permissions and feature flags: unchanged.
- [ ] Existing shifts booked before the release: unchanged by design (no backfill).

## Risk Level: High

**Justification:**
- A **DB migration** adds `schedule_shift.coverage`, and the **API contract** for creating and restoring shifts gains a field.
- **Cross-module behavior change:** approving a line in Work Orders now writes to the Schedule (shift lines and the line's technicians), and deleting shifts takes new locks. A mistake would show up as wrong technicians on lines or wrong shift contents.

## Dev Verification
- [ ] Migration `Version20261104073632` runs. `doctrine:migrations:diff` then reports no changes for `schedule_shift`.
- [ ] `coverage` is present on every shift in the Schedule board, shift view and write responses. Old rows read `chosen_lines`.
- [ ] Create shift with an invalid `coverage` → 400. `whole_work_order` without a work order → 400. Restore with no `coverage` → stored as `chosen_lines`.
- [ ] Logs on approval: "An approved line was added to whole-work-order shifts" (info). There should be no "could not be added" (warning) or "failed" (error) lines in normal use.
- [ ] Same-moment races (approval vs. shift move/delete, delete vs. approval) are covered by unit and functional tests. They can't be triggered from the UI.

## Regression Hotspots (top 5)
1. **Approving lines (single and bulk)** — now also runs the Schedule listener. Approval must stay fast and never fail.
2. **Deleting shifts (all three scopes) + Undo** — the delete logic now locks every shift first, and technician cleanup was reworked.
3. **Drop dialog tabs** — "Entire work order" vs "Choose lines" now save different booking types.
4. **Lead technician change + Undo** — the cleared-shift snapshot now carries the booking type.
5. **Line technician list (who's on each line)** — shifts now add technicians when lines are approved, as well as when a shift is dropped.

## Coverage Proof

**Files covered:** 79/79

| File | Domain | Covered |
|------|--------|---------|
| api/migrations/Version20261104073632.php | DB | Yes |
| api/src/TaskManagement/Schedule/Application/Command/Shift/CreateShiftCommand.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Command/Shift/RestoreShiftItem.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/DTO/Board/ShiftDto.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/EventListener/ExtendWholeWorkOrderShiftsOnLineAuthorizedListener.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/EventListener/ExtendWholeWorkOrderShiftsOnLineCreatedListener.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Handler/Shift/CreateShiftCommandHandler.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Handler/Shift/DeleteShiftCommandHandler.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Handler/Shift/RestoreShiftCommandHandler.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Handler/Shift/ShiftCoverageWriter.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Handler/Shift/WholeWorkOrderShiftExtender.php | BE | Yes |
| api/src/TaskManagement/Schedule/Application/Query/Shift/SchedulableLineFetcher.php | BE | Yes |
| api/src/TaskManagement/Schedule/Domain/Model/Shift.php | BE | Yes |
| api/src/TaskManagement/Schedule/Domain/Model/ShiftCoverage.php | BE | Yes |
| api/src/TaskManagement/Schedule/Domain/Repository/ShiftRepository.php | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/Persistence/Query/Dbal/DbalSchedulableLineFetcher.php | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/Persistence/Query/Dbal/DbalShiftFetcher.php | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/Persistence/Repository/Doctrine/Shift.orm.xml | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/Persistence/Repository/Doctrine/ShiftRepository.php | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftAppointmentScheduler.php | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftClearedLeadShiftRestorer.php | BE | Yes |
| api/src/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftOutgoingLeadShiftClearer.php | BE | Yes |
| api/src/TaskManagement/Schedule/UI/HTTP/Shift/CreateShiftController.php | BE (endpoint) | Yes |
| api/src/TaskManagement/Schedule/UI/HTTP/Shift/DTO/CreateShiftRequestDto.php | BE (validation) | Yes |
| api/src/TaskManagement/Schedule/UI/HTTP/Shift/DTO/RestoreShiftsRequestDto.php | BE (validation) | Yes |
| api/src/VehicleService/WorkOrders/Application/Line/ChangeLineStatus/LineChangedStatusToAuthorized.php | BE | Yes |
| api/src/VehicleService/WorkOrders/Application/Line/ChangeLines/ChangeLinesStatusHandler.php | BE | Yes |
| api/src/VehicleService/WorkOrders/Application/Service/RemovedShiftSnapshot.php | BE | Yes |
| api/src/VehicleService/WorkOrders/Domain/Line/Line.php | BE | Yes |
| api/src/VehicleService/WorkOrders/Domain/Line/Service/LineStatusManager.php | BE | Yes |
| api/tests/Functional/TaskManagement/Schedule/ScheduleBoardEndpointTest.php | BE-TEST | Yes |
| api/tests/Functional/TaskManagement/Schedule/ScheduleReadEndpointTestCase.php | BE-TEST | Yes |
| api/tests/Functional/TaskManagement/Schedule/ScheduleShiftWriteEndpointsTest.php | BE-TEST | Yes |
| api/tests/Functional/TaskManagement/Schedule/ScheduleTenantScopingTest.php | BE-TEST | Yes |
| api/tests/Functional/TaskManagement/Schedule/ShiftLeadOpenWorkOrderShiftsConditionTest.php | BE-TEST | Yes |
| api/tests/Functional/TaskManagement/Schedule/WholeWorkOrderShiftLineApprovalTest.php | BE-TEST | Yes |
| api/tests/Functional/TaskManagement/Schedule/WholeWorkOrderShiftLookupTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/EventListener/ExtendWholeWorkOrderShiftsOnLineAuthorizedListenerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/Handler/Shift/ShiftWriteHandlerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/Handler/Shift/ShiftWriteResponderTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/Handler/Shift/WholeWorkOrderShiftExtenderTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/Handler/ShiftView/ShiftViewQueryHandlerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/Query/Board/ScheduleBoardAssemblerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Application/Query/Board/ShiftConflictEvaluatorTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Domain/Model/ShiftTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Infrastructure/WorkOrders/FakeShiftRepository.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftAppointmentSchedulerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftClearedLeadShiftRestorerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftLineCoverageRevokerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftOutgoingLeadShiftClearerTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/UI/HTTP/Shift/DTO/ChangeShiftRequestDtoTest.php | BE-TEST | Yes |
| api/tests/Unit/TaskManagement/Schedule/UI/HTTP/Shift/DTO/CreateShiftRequestDtoTest.php | BE-TEST | Yes |
| api/tests/Unit/VehicleService/WorkOrders/Application/Service/Board/LeadChangeUndoRecordTest.php | BE-TEST | Yes |
| api/tests/Unit/VehicleService/WorkOrders/Domain/Line/LineTest.php | BE-TEST | Yes |
| api/tests/Unit/VehicleService/WorkOrders/Domain/Line/Service/LineStatusManagerTest.php | BE-TEST | Yes |
| app/src/api/schedule/ScheduleModel.ts | FE-API | Yes |
| app/src/api/schedule/tests/mutations.spec.ts | FE-TEST | Yes |
| app/src/api/schedule/tests/queries.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/Model.ts | FE-UI | Yes |
| app/src/components/ts/schedule-next/SchedulePage.vue | FE-UI | Yes |
| app/src/components/ts/schedule-next/calendar/tests/ScheduleCalendar.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/calendar/tests/adapters.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/composables/tests/useCapacityEngine.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/composables/tests/useConflictEngine.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/composables/tests/useUndoableScheduleMutation.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/composables/useUndoableScheduleMutation.ts | FE-UI | Yes |
| app/src/components/ts/schedule-next/dialogs/DropScheduleDialog.vue | FE-UI | Yes |
| app/src/components/ts/schedule-next/dialogs/tests/DropScheduleDialog.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/dialogs/tests/ShiftDetailDialog.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/tests/SchedulePage.spec.ts | FE-TEST | Yes |
| app/src/components/ts/schedule-next/tests/conflicts.spec.ts | FE-TEST | Yes |
| e2e/playwright.config.ts | E2E | Yes |
| e2e/src/api/factories/schedule.factory.ts | E2E | Yes |
| e2e/src/pages/dialogs/schedule/drop-schedule.dialog.ts | E2E | Yes |
| e2e/src/pages/dialogs/schedule/shift-detail.dialog.ts | E2E | Yes |
| e2e/src/pages/schedule.page.ts | E2E | Yes |
| e2e/tests/ui/schedule/schedule-drag-work-order.spec.ts | E2E | Yes |
| e2e/tests/ui/work-orders/scheduled-work-order-create.spec.ts | E2E | Yes |
| e2e/tests/ui/work-orders/whole-order-shift-picks-up-approved-lines.spec.ts | E2E | Yes |