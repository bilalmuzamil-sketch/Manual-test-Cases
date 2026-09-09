
## C44549 [None] Settings page shows the four Require settings under Workflow, Line, Parts groups
**PRE:**
You are signed in with access to Settings > App Settings.
Open the Work Order settings page.
**STEPS:**
Open Administration > App Settings (the Work Order settings page).
Read the setting labels and how the page is grouped.

## C44550 [None] Auto-pick setting renamed to 'Require picking inventory parts' (inversion)
**PRE:**
1. You are signed in with Settings > App Settings.
2. A shop that today has 'Automatically pick inventory parts' in its known state.
**STEPS:**
1. Open the Work Order settings page.
2. Find the picking setting and read its label.
3. Confirm the shop's picking behaviour is unchanged from before the rename.

## C44551 [None] 'Require ordering parts' is a new setting; on by default reproduces today
**PRE:**
1. You are signed in with Settings > App Settings.
2. A shop upgraded to this release.
**STEPS:**
1. Open the Work Order settings page.
2. Find "Require ordering parts" and read its default state and description.
3. With it on, open a work order and check a qualifying part; with it off, check the same.

## C44552 [None] Require picking and Require receiving control their actions and defaults
**PRE:**
1. You are signed in with Settings > App Settings.
2. You can toggle the picking and receiving settings and open an affected work order.
**STEPS:**
1. With "Require picking inventory parts" on, open a WO and check an inventory/found part; turn it off and check again.
2. With "Require receiving parts before completion" on, check where Receive sits and whether outstanding parts block invoicing; turn it off and check again.

## C44553 [None] Turning a Require setting on later does not retro-act on existing parts
**PRE:**
1. You are signed in with Settings > App Settings.
2. A work order has parts already ordered and already picked.
**STEPS:**
1. Turn "Require ordering parts" on and check parts already recorded as ordered.
2. Turn "Require picking inventory parts" on and check parts already picked.

## C44554 [None] A settings change applies to every open work order, not just new ones
**PRE:**
1. You are signed in with Settings > App Settings.
2. Several open work orders exist in various statuses with outstanding parts and unapproved lines.
**STEPS:**
1. Turn "Require ordering parts" off and check outstanding parts across open work orders.
2. Turn "Require picking inventory parts" off and check outstanding inventory/found parts.
3. Turn "Require receiving parts before completion" off, then on, and check whether invoicing is blocked.
4. Turn "Require approval for new lines" off and check Needs-Approval lines.

## C44555 [None] Each settings-change record is written to the audit log with its cause
**PRE:**
1. You are signed in with Settings > App Settings.
2. A settings change has just been applied across open work orders.
**STEPS:**
1. Apply a settings change (for example turn Require approval for new lines off).
2. Open the audit log on an affected work order and on a changed line/part.

## C44556 [None] Invoiced/paid work orders and declined lines are excluded from the sweep
**PRE:**
1. You are signed in with Settings > App Settings.
2. There is an invoiced (or paid) work order and a work order with a declined line and its parts.
**STEPS:**
1. Apply each of the four settings changes.
2. Check the invoiced/paid work order and the declined line and its parts.

## C44557 [None] Only ordering and picking ask to confirm; picking-off warns of stock deduction
**PRE:**
1. You are signed in with access to Settings > App Settings.
2. Open work orders exist with outstanding parts, so a settings change affects a non-zero number of records.
3. You can also reach a state where changing a setting affects zero records.
**STEPS:**
1. Change "Require ordering parts" and read the confirmation.
2. Change "Require picking inventory parts" off and read the confirmation.
3. Change "Require approval for new lines" and watch whether a confirmation appears.
4. Change "Require receiving parts before completion" and watch whether a confirmation appears.
5. Change a setting in a state where no existing records are affected.

## C44558 [None] Cancelling a settings change leaves the setting and records unchanged
**PRE:**
1. You are signed in with Settings > App Settings.
2. A settings confirmation is open.
**STEPS:**
1. Begin a settings change so the confirmation opens.
2. Cancel it.

## C44559 [None] Applying a settings change blocks only the acting admin, never the organization
**PRE:**
1. You are signed in with Settings > App Settings.
2. A confirmed settings change affects many existing records.
**STEPS:**
1. Confirm a settings change that affects existing records.
2. Observe the app while the change is applied.

## C44560 [None] A partially applied settings change is never left visible
**PRE:**
1. You are signed in with Settings > App Settings.
2. A large settings change is applied and a failure is simulated mid-run (or observed).
**STEPS:**
1. Trigger/observe a settings change that fails part way.
2. Check the resulting state and the message shown.

## C44561 [None] An approved line completes whatever the state of its parts
**PRE:**
Logged in as Owner/Admin
Org settings: Require Review OFF, Require Tech Story / Mileage / Engine Hours OFF
An approved WO with an approved line carrying three parts in three different open states: one never ordered, one ordered but not received, one in stock but not picked
**STEPS:**
On an approved line with an unordered part (ordering required), press Complete.
On an approved line with an unpicked inventory part (picking required), press Complete.
On an approved line with an ordered-but-unreceived part (receiving required), press Complete.

## C44562 [None] Other line requirements still apply when their setting is on
**PRE:**
1. You are signed in with completion permissions.
2. An approved line is missing a required tech story / mileage / engine hours, or carries an unresolved core, with the relevant settings on.
**STEPS:**
1. Try to complete a line that is missing a required tech story.
2. Try to complete a line with an unresolved core where receiving is not required.

## C44563 [None] A line reaches Complete only through the defined paths
**PRE:**
1. You are signed in with completion permissions.
2. A completable approved line exists.
**STEPS:**
1. Complete a line via the line's own Complete.
2. Via the bulk bar Complete lines / Complete all lines.
3. Via Create invoice.
4. Via the clock-out modal's 'Clock out and complete'.

## C44564 [None] Clock-out modal: two complete buttons; line-completed tick box hidden
**PRE:**
1. You are signed in with completion permissions and clocked onto a line.
2. Review may be on or off.
**STEPS:**
1. Press Stop to open the clock-out modal.
2. Read the actions offered and look for the old 'line completed' tick box.

## C44565 [None] Complete is never disabled for a parts reason; reopen returns line to Approved
**PRE:**
1. You are signed in with completion permissions.
2. An approved line with outstanding parts exists; and a completed line exists.
**STEPS:**
1. Look at Complete on an approved line that has outstanding parts.
2. Reopen a completed line and check its status and parts.
3. As a Technician in Tech View, try to complete a line.

## C44566 [None] Line actions offered match the line's status
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. A work order has lines in each status: Needs Approval, Approved, Declined, Complete.
**STEPS:**
1. Open the ... menu (and check the bulk bar) for a Needs Approval line.
2. Repeat for Approved, Declined and Complete lines.

## C44567 [None] Decline is disabled while a line holds received or picked parts
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. An approved line holds a part that has been received or picked.
**STEPS:**
1. Open the line's actions and look at Decline.

## C44568 [None] Part actions offered match the part's state (seven states)
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View, Pick Parts and Order Parts.
2. Parts exist in each state: Requested, Quoted, Auth to order, In Stock (unpicked), Awaiting, Received later, Received/picked, Returned.
**STEPS:**
1. For a part in each state, look at the actions on its row.

## C44569 [None] Ordering precedes receiving; Receive placement follows the setting
**PRE:**
1. You are signed in with Order Parts.
2. A vendor-sourced part is unordered; and the receiving setting can be toggled.
**STEPS:**
1. With ordering required, check whether Receive appears before the part is ordered.
2. With receiving not required, check where Receive appears for a part.

## C44570 [None] Declining or sending back a line returns only not-yet-arrived parts to Quoted
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. An approved line holds parts in mixed states: Requested, In Stock, Quoted, Auth to order, Awaiting, Received, Returned.
**STEPS:**
1. Decline the line (or send it back with Authorization required).
2. Check the state of each part afterwards.

## C44571 [None] Bulk bar replaces the column headers and lists actions by one rule
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. A work order has several lines in mixed statuses with parts.
**STEPS:**
1. Select one or more lines.
2. Look at the bar that appears, its layout and which actions show.

## C44572 [None] Primary slots fill in a fixed order; More holds the rest
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. A selection qualifies for several actions including the finish action.
**STEPS:**
1. Select lines that cover every open line (and hold orderable/receivable/pickable parts).
2. Read the order of the primary buttons and the contents of More.

## C44573 [None] Bulk actions confirm/undo per their kind and give one toast each
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. A selection qualifies for approve, order and receive.
**STEPS:**
1. Run Approve on a selection and look for an undo.
2. Run Order parts and look for a confirmation.
3. Run Receive and observe whether a screen opens.

## C44574 [None] Bulk bar hidden without permission; empty/zero states handled
**PRE:**
1. A user without WO Lines: Create & Edit is signed in; and a user with it can make selections that qualify for nothing.
2. A work order with lines exists.
**STEPS:**
1. As the user without the permission, look for checkboxes and the bar.
2. As the permitted user, select lines where nothing applies; and select where only some actions apply.

## C44575 [None] Bulk approve/decline judges each line and never sweeps a declined line
**PRE:**
Logged in as Owner/Admin
An approved work order with four labour lines: two Needs Approval, one Approved, one Declined
**STEPS:**
1. Select the mixed set and run Approve.
2. Run Decline on a selection.
3. Run Authorization required on a selection.

## C44576 [None] Bulk approve/decline skips ineligible lines and hides at zero count
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. A four-line selection has one line holding received parts; and a selection made entirely of declined lines.
**STEPS:**
1. Decline a four-line selection where one holds received parts.
2. Look at Approve on a selection of only declined lines.

## C44577 [None] Bulk complete labels and counts follow the selection of Approved lines
**PRE:**
1. You are signed in with Work Orders: Create & Edit.
2. A selection includes Approved lines, some missing a tech story or mileage; and a selection covering every open line.
**STEPS:**
1. Select one Approved line, then several, then a selection covering every open line, and read the button label each time.
2. Complete a selection where a tech story/mileage is outstanding.
3. Complete the last open lines and observe navigation.

## C44578 [None] Bulk delete lines is out of scope this release (no delete action in the bar)
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View.
2. A work order has several lines selected.
**STEPS:**
1. Select lines and open the bulk action bar and its More menu.
2. Look for any bulk delete action.

## C44579 [None] Bulk order raises a purchase order per vendor and confirms first
**PRE:**
1. You are signed in with Order Parts (+ See Financial Data).
2. A selection holds unordered parts spanning two vendors, plus a Requested part and a vendorless part.
**STEPS:**
1. Select the parts and run Order.
2. Confirm and check the purchase orders created.

## C44580 [None] Bulk order skips already-ordered and non-vendor-sourced parts
**PRE:**
1. You are signed in with Order Parts.
2. A selection mixes already-ordered parts, inventory/found parts, and a part with no source; and a user lacks Order Parts.
**STEPS:**
1. Run Order on the mixed selection and read the count and result.
2. As a user without Order Parts, look for the Order action.

## C44581 [None] Bulk pick runs the existing pick atomically for in-stock unpicked parts
**PRE:**
1. You are signed in with Pick Parts.
2. A selection holds several inventory/found parts that are In Stock and unpicked.
**STEPS:**
1. Select the parts and run Pick.
2. Check the inventory movement, bins and history.

## C44582 [None] Bulk pick action hidden without Pick Parts permission
**PRE:**
1. A user without Pick Parts is signed in.
2. A selection holds pickable parts.
**STEPS:**
1. Select the parts and look for the Pick action.

## C53486 [None] Deselect all keeps the bar, close dismisses it; an empty group shows no divider
**PRE:**
1. You are signed in with WO Lines: Create & Edit and Full View.
2. A work order has several lines and parts, so both a line group and a parts group can appear in the bulk action bar.
**STEPS:**
1. Select several lines, then press Deselect all.
2. Select again, then press the close control.
3. Make a selection where only a line action applies and no parts action does, and look at the dividers.

## C44583 [None] Receive opens a modal (no navigation) with contents depending on entry point
**PRE:**
Logged in as Owner/Admin
A vendor with a tax rate configured, so the modal has a rate to prefill tax from
An approved WO with an approved line carrying a vendor part, ordered onto a purchase order at a known cost
**STEPS:**
1. Open Receive from a part row where the part has a vendor.
2. From a part row where the part has no vendor.
3. From a line's menu.
4. From the bulk action bar (or the completion wizard).

## C44584 [None] Receive requires vendor, invoice number and invoice date; cost and tax prefilled
**PRE:**
1. You are signed in with Order Parts.
2. The receive modal is open on a vendor card with parts awaiting receipt.
**STEPS:**
1. Expand a vendor card and read the required fields and the per-part editable fields.
2. Try to receive with the invoice number blank.
3. Edit a cost and watch for a note.

## C44585 [None] Vendor-missing card requires Assign vendor first, applied to ticked parts
**PRE:**
1. You are signed in with Order Parts + Vendor & Order Mgmt: Create & Edit.
2. The receive modal is open with a vendor-missing card.
**STEPS:**
1. Expand the vendor-missing card.
2. Search and assign a vendor to the ticked parts.
3. Check the untouched parts and the tab order.

## C44586 [None] One invoice number belongs to one PO; two POs make two bills, same number
**PRE:**
1. You are signed in with Order Parts.
2. One vendor's parts on this work order sit on two purchase orders.
**STEPS:**
1. Open the receive modal on that vendor's card.
2. Enter one invoice number and receive.

## C44587 [None] A user without See Financial Data can still receive; money fields removed
**PRE:**
A custom role with See Financial Data OFF but Work Orders View + Order/Receive Parts ON, and a staff user holding it
An approved WO with an approved line carrying a vendor part, ordered onto a purchase order at a known cost
**STEPS:**
1. Open the receive modal as this user.
2. Look for cost and tax fields and try to receive.

## C44588 [None] Receive modal rejects invalid parts, unordered/unapproved, and post-invoice
**PRE:**
1. You are signed in with Order Parts.
2. A card has a part with no part number and a part with quantity zero; parts not yet ordered and on unapproved lines exist; and a work order can be invoiced mid-session.
**STEPS:**
1. Try to receive a card containing a part with no part number.
2. Enter quantity zero (or negative).
3. Check whether unordered/unapproved parts appear.
4. Invoice the work order mid-session, then try to receive.
5. Open Receive on a work order with nothing awaiting.

## C53487 [None] A vendor can be corrected until a part is received, then it is fixed
**PRE:**
1. You are signed in with Order Parts + Vendor & Order Mgmt: Create & Edit.
2. A purchase order was created without a vendor and its parts are still unreceived.
3. Another purchase order has a part that has already been received.
**STEPS:**
1. On the unreceived purchase order, change the assigned vendor.
2. On the one with a received part, look for a way to change the vendor.
3. Attempt to receive a part against a vendor different from the one already recorded.

## C44589 [None] Purchase orders group by vendor, missing vendors first, collapsed
**PRE:**
1. You are signed in with Vendor & Order Mgmt access.
2. Purchase orders exist across several vendors, including vendor-missing ones, spanning work orders.
**STEPS:**
1. Open the purchase order / bulk receive page.
2. Read the grouping, headers and initial expand state.

## C44590 [None] A panel expands per purchase order with per-PO vendor-side fields
**PRE:**
1. You are signed in with Vendor & Order Mgmt: Create & Edit + See Financial Data.
2. A vendor group has purchase orders with parts awaiting receipt.
**STEPS:**
1. Expand a purchase order panel.
2. Read its fields, the tick boxes, the tax field and the primary action.
3. Assign a vendor to a collapsed row via hover, and via expand.

## C44591 [None] Receive validity on the PO page matches the modal; money hidden without the atom
**PRE:**
1. You can view the PO page as a user with See Financial Data and as one without; and as Vendor & Order Mgmt: View only.
2. A vendor has several purchase orders.
**STEPS:**
1. As a View-only user, try to receive.
2. As a user without See Financial Data, look for cost/tax/subtotal/total/sell columns.
3. Reuse one invoice number across two of a vendor's POs.

## C53488 [None] PO list-page selection raises the shared bulk bar; Select all covers one page
**PRE:**
1. You are signed in with Vendor & Order Mgmt: Create & Edit.
2. More than thirty purchase orders exist across several vendors, including at least one with no vendor, so a second page loads on scroll and a selection can span vendors.
**STEPS:**
1. Select several purchase orders and read the bar.
2. Look for Assign vendor on the bar.
3. Use Select all, then scroll to load more rows and check which are selected.

## C44592 [None] Receive becomes a split button offering Received later, chosen per part
**PRE:**
1. You are signed in with the Received later permission and Order Parts.
2. Require receiving parts before completion is on; a delivery has some parts with a bill and one without.
**STEPS:**
1. On a part row (and in the bulk bar and the wizard's receive step), open the Receive split button's caret.
2. Choose Received later for the part without a bill.
3. Check the part's state and the completion requirement.

## C44593 [None] Without the permission or the setting, no Received later option appears
**PRE:**
1. A user without the Received later permission is signed in; and separately, Require receiving parts before completion is off.
2. A part is awaiting receipt.
**STEPS:**
1. As a user without the permission, look at the Receive control.
2. With the receiving setting off, look for the split button.
3. Check the part's ... menu while the split button shows.

## C53489 [None] Deferring a part with a core: the core follows the parent, never its own choice
**PRE:**
1. You are signed in with the Received later permission and Order Parts.
2. "Require receiving parts before completion" is on.
3. A work order has an approved line with a part that carries a core charge (parent plus core sibling) awaiting receipt, and a second part whose core is already resolved.
**STEPS:**
1. Choose Received later on the parent part and check the core sibling's state and row.
2. Look at the line's completion requirement.
3. Receive the parent later and check the core.
4. Defer a part whose core is already resolved.

## C44594 [None] The wizard opens only from defined entry points when something is collectable
**PRE:**
1. You are signed in with completion permissions.
2. A work order has lines with outstanding collectable items, and a tidy work order with nothing outstanding.
**STEPS:**
1. Trigger Complete on a line, Complete lines / Complete all lines, Create invoice, and Clock out and complete on a work order with outstanding items.
2. Trigger a completion on a tidy work order with nothing outstanding.

## C44595 [None] The wizard shows only outstanding steps in a fixed order
**PRE:**
1. You are signed in with completion permissions.
2. A completion run has several kinds of outstanding work across the covered lines.
**STEPS:**
1. Open the wizard on a run with outstanding tech stories, picks, cores, receives and missing details.
2. Read the step pills, their order and counts.

## C44596 [None] Each wizard step's own action saves and advances; no Continue button
**PRE:**
1. You are signed in with completion permissions.
2. The wizard is open with tech-story, pick and receive steps.
**STEPS:**
1. Perform the action on each step (Save, Pick all, Receive parts).
2. Open the receive step and check the modal and its per-part Received later.
3. Close and reopen the wizard.

## C44597 [None] Where a wizard run ends depends on what opened it
**PRE:**
1. You are signed in with completion permissions (and invoicing where relevant).
2. Runs are opened from Complete lines, Complete all lines, and Create invoice.
**STEPS:**
1. Finish a run opened by Complete on a line / Complete lines.
2. Finish a run opened by Complete all lines (with review required).
3. Finish a run opened by Create invoice.

## C44598 [None] Wizard handles not-required steps, mid-run completion and server errors
**PRE:**
1. You are signed in with completion permissions.
2. A run has some not-required steps; another user can finish work mid-run; a server error can be induced on a step.
**STEPS:**
1. Look for a step whose work is not required.
2. Have someone else finish the outstanding work mid-run.
3. Induce a server error mid-step with values entered.

## C44599 [None] The header offers only the one finish action that is genuinely next
**PRE:**
1. You are signed in with invoicing and review permissions.
2. Work orders exist in each combination of review on/off and lines open/complete/reviewed.
**STEPS:**
1. With review off and a line still open, read the header actions.
2. With review off and every line complete.
3. With review on and a line still open.
4. With review on, every line complete, not yet reviewed.
5. With review on, already reviewed.
6. With lines selected.

## C44600 [None] Create invoice runs the wizard if needed, then invoices and opens payment
**PRE:**
1. You are signed in with Invoicing & Payments: Create & Edit + See Financial Data.
2. A work order has open lines, some with outstanding collectable work; and one where a deposit covers the whole amount.
**STEPS:**
1. Press Create invoice on a work order with outstanding required work.
2. Confirm and complete the flow.
3. Repeat where a deposit covers the whole amount.

## C44601 [None] Finish-action negatives: reviewer, invoice lock, declined-only, no permission
**PRE:**
1. You can sign in as: a user who may review but not invoice; a user who may only complete lines; a user without See Financial Data.
2. Work orders exist that are all-declined, already invoiced, and awaiting review.
**STEPS:**
1. As a review-only user, complete review and look at the header.
2. As a complete-only user, look at the header.
3. As a user without See Financial Data, look for Create invoice.
4. Check an all-declined work order and an already-invoiced one.
5. Close the payment screen after invoicing.

## C44602 [None] Part and line ... menus contain the actions that belong to them
**PRE:**
1. You are signed in with WO Lines: Create & Edit + Full View and Order Parts.
2. A work order has parts and lines, with receiving optional.
**STEPS:**
1. Open a part's ... menu and read its items.
2. Open a line's ... menu and read its items.

## C44603 [None] Menu negatives: Request part, Uncomplete, Receive part visibility
**PRE:**
1. You can sign in with and without Order Parts.
2. A completed line and an uncompleted line exist.
**STEPS:**
1. Look for Request part on a completed line.
2. Look for Uncomplete line on an uncompleted line.
3. As a user without Order Parts, look for Receive part.

## C44604 [None] Move up reorders a part within its line and persists
**PRE:**
Logged in as Owner (Work Orders: Create & Edit).
An open (estimate) work order exists with one labor line carrying three part requests, all seeded over the API.
**STEPS:**
1. Drag a part to a new position within its line.
2. Confirm the drop, then view the invoice and PDF order.
3. Undo the drop.

## C44605 [None] Reordering negatives: cross-line moves, invoiced WO, concurrent edits
**PRE:**
Editable (estimate) WO seeded via API with line A holding 3 parts and line B holding 2
A separate invoiced WO with parts, seeded via API
**STEPS:**
1. Try to move a part to a different line.
2. Try to reorder on an invoiced work order.
3. Have two users reorder the same line at once.

## C44606 [None] 'Received later' is the one new permission, off by default, per role
**PRE:**
1. You are signed in as an admin who can edit roles/permissions.
2. Open the permissions page, Work Orders section.
**STEPS:**
1. Find the Received later permission in the Work Orders section.
2. Check its shape and its default across roles.

## C44607 [None] Every Simple Flow action is gated by its mapped existing atom
**PRE:**
1. You can sign in as roles carrying different atoms per the SV-8183 matrix.
2. Work orders with the relevant actions available exist.
**STEPS:**
1. For each action, sign in as a role that carries its atom and one that does not, and check whether the action is offered.

## C44608 [None] Money follows See Financial Data; work follows View mode
**PRE:**
1. You can sign in as a user with See Financial Data and one without, and in Tech View and Full View.
2. Receiving and invoicing surfaces are reachable.
**STEPS:**
1. As a user without See Financial Data, open a receive surface and check money fields.
2. Compare Tech View vs Full View for which actions/columns of work show.

## C44609 [None] A user without an atom never sees the action; hidden values are not sent
**PRE:**
1. You can sign in as roles missing specific atoms.
2. Bulk bar and part rows are reachable.
**STEPS:**
1. As a user missing an atom, look for the action in the bulk bar and on the row.
2. Inspect whether values behind hidden money fields reach the screen.
