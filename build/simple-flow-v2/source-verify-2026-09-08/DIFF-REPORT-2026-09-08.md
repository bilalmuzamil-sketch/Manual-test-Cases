# Simple Flow V2 — Source-Verification Diff (spec revised 2026-09-08 vs cases authored against spec v23, 2026-08-21)

READ-ONLY. No TestRail writes, no case edits performed. This report is a disposition for another session to execute.

Scope: the 11 changed stories and their 61 mapped cases. Verdicts: UNCHANGED / UPDATE / HELD-AUTOMATED / NEW-NEEDED.
Every proposed Expected is drawn only from the current-spec sentence(s) quoted under the entry; nothing is invented.
The four AUTOMATED cases (44557, 44561, 44583, 44587) are marked HELD-AUTOMATED and describe the change they would need, for the QA lead to decide (Rule 71).

---

## SV-9247 (Story 1) — Settings page: "Require ordering parts" OFF now spelled out (a real purchase order is created; the part lands in "Awaiting")

- **C44549 — VERDICT: UNCHANGED.** The 2026-09-08 revision does not touch the four labels or the grouping this case asserts. Spec still reads: *"The page is grouped into Workflow, Line requirements and Parts, with dividers"* and lists the same four "Require…" toggles.

- **C44550 — VERDICT: UNCHANGED.** The rename/inversion this case asserts is untouched. Spec still: *"Automatically pick inventory parts becomes Require picking inventory parts … auto-pick off is picking required. So this is a deliberate inversion, not a text change."*

- **C44551 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: The case says only *"when off, parts are recorded as ordered automatically and no Order action appears anywhere."* The revision now specifies exactly what "recorded as ordered" does — a real purchase order is created and the part moves to "Awaiting" — none of which the case states.
  - (c) Current-spec sentences that drive it: *"Adding a vendor part places it on a purchase order immediately and the part lands in Awaiting. A purchase order for that vendor is created where none is open, and the part is added to the open one where there is. The part never passes through Auth to order, and no Order action appears anywhere — not on the row, not in the bulk bar, not in the … menu. This is a real purchase order, identical to one created by pressing Order, and it reaches the accounting system the same way. A vendorless part is placed too, on a purchase order marked Vendor missing. It is created silently, with no confirmation."*
  - (d) Proposed new Expected (append to / replace item 2):
    1. "Require ordering parts" exists as a new toggle and defaults to on for every shop.
    2. When on, an Order action appears on each qualifying part and in the bulk bar.
    3. When off, no Order action appears anywhere — not on the row, not in the bulk bar, not in the … menu — and adding a vendor part places it on a purchase order straight away and the part lands in "Awaiting". A purchase order is created for that vendor if none is open, or the part is added to the vendor's open one. It is a real purchase order, exactly like one made by pressing Order, and it reaches the accounting system the same way.
    4. A part with no vendor is placed too, on a purchase order marked "Vendor missing". This happens silently, with no confirmation.
    5. Because it defaults to on and nothing orders parts automatically today, an upgraded shop sees no change.

- **C44552 — VERDICT: UNCHANGED.** Picking-on/off and receiving-on/off action placement and defaults are unchanged in the revision. (The stock-deduction detail for picking lives in Stories 2 and 3, not Story 1; Story 1 still only says the affected parts are "marked as picked automatically".)

- **C44553 — VERDICT: UNCHANGED.** Spec still: *"Switching Require ordering on later does not un-order anything … Switching Require picking on later does not un-pick anything."*

---

## SV-9248 (Story 2) — REWRITTEN: approval never changes an existing line; ordering & picking do sweep outstanding parts (picking deducts stock); receiving writes nothing; sweep order stated; audit attributed to the admin

- **C44554 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing:
    - Item 5 is now **directly contradicted**: it says *"Require approval off: every line in Needs Approval becomes Approved (turning an estimate into approved work)."* The rewrite says approval NEVER changes an existing line.
    - Item 2 (ordering off) is now incomplete: it says only *"outstanding parts are recorded as ordered and the Order action disappears"* — the revision requires a real purchase order and a move to "Awaiting".
    - Item 3 (picking off) is now incomplete: it omits that marking a part picked **deducts it from stock** (a real inventory movement).
  - (c) Current-spec sentences that drive it:
    - Approval: *"Require approval for new lines governs new lines only. Turning it on or off never changes the status of a line that already exists. An estimate stays an estimate; an approved line stays approved."* and *"Turning approval on or off changes no existing line. A shop with fifty unapproved lines still has fifty unapproved lines the moment after the save."*
    - Ordering off: *"Require ordering parts turned off: parts already outstanding are placed on purchase orders and move to Awaiting, through the same ordering path a manual Order press uses, so a real purchase order exists for each. The Order action then disappears."*
    - Picking off: *"Require picking inventory parts turned off: inventory and found parts already outstanding are marked as picked and the Pick action disappears. Marking a part picked deducts it from stock, so this change moves real inventory — one stock movement and one inventory-history entry per part, following the part's bin allocation where it has one and the default bin where it does not."*
    - Receiving (already correct in the case): *"Require receiving parts before completion writes nothing, in either direction. It is a rule read when the work order is invoiced, not a stored state."*
    - Unapproved lines excluded from the sweep: *"A part on a line that is not yet approved is invisible to the ordering sweep."*
  - (d) Proposed new Expected:
    1. Changing a setting takes effect on every open work order, not only on work created afterwards — with one exception: turning "Require approval for new lines" on or off changes no line that already exists (an estimate stays an estimate, an approved line stays approved). It only decides the status a newly added line starts in.
    2. Require ordering off: parts already outstanding are placed on purchase orders and move to "Awaiting", through the same path a manual Order press uses, so a real purchase order exists for each; the Order action then disappears.
    3. Require picking off: inventory and found parts already outstanding are marked as picked and the Pick action disappears. Marking a part picked deducts it from stock — this moves real inventory (one stock movement and one inventory-history entry per part, following the part's bin where it has one and the default bin where it does not).
    4. Require receiving off: outstanding parts stop blocking invoicing and stay outstanding, and Receive moves into the part's … menu. On: outstanding parts start blocking invoicing and nothing is auto-received, so a work order that was invoiceable a moment ago may no longer be.
    5. Parts on lines that are not yet approved are not swept — they are invisible to the ordering sweep.
    6. Statuses change in the underlying records, not only on screen; invoicing checks the same state the buttons are drawn from.
    7. Invoiced and paid work orders, and declined lines and their parts, are never touched (see C44556).
  - Note: the case's Steps still exercise all four toggles, which is correct; only the Expected changes.

- **C44555 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 2 says each entry is *"attributed to the system"* and gives the example *"Line approved because Require approval for new lines was turned off."* Both are now wrong — there is no system actor, and approval no longer changes an existing line, so that example event cannot occur.
  - (c) Current-spec sentences that drive it: *"Every record changed is written to the audit log, on the work order and on each line or part changed, attributed to the admin who made the change, with the cause named — for example Part ordered because Require ordering parts was turned off. There is no system actor in the audit log, and a background job with no user identity cannot read the organization's settings, so the run is carried out as the person who pressed save."*
  - (d) Proposed new Expected:
    1. Every record changed is written to the audit log — on the work order and on each line or part changed.
    2. Each entry is attributed to the admin who made the change (there is no "system" actor) and names the cause, for example "Part ordered because Require ordering parts was turned off".

- **C44556 — VERDICT: UNCHANGED.** Its assertions still match the spec exactly: *"Invoiced and paid work orders are never touched … A declined line and its parts are excluded from every one of these changes … No settings change ever marks anything as received, because receiving requires a vendor bill that only a person can supply … If the run fails part way, re-running finishes the remainder without repeating what was already done."*

---

## SV-9249 (Story 3) — Confirmation narrowed to the two settings that change records; turning picking off is the loud warning

- **C44557 — VERDICT: HELD-AUTOMATED.** (custom_atmstatus=3 — do not edit; for the QA lead to decide.)
  - Change it would need: the case currently toggles **all four** settings and reads a confirmation on each, and its Expected calls it an *"irreversible org-wide sweep."* Both are now wrong. The revision limits confirmation to the two settings that change existing records and drops the org-wide-sweep framing.
  - Current-spec sentences: *"Only the two settings that change existing records ask for confirmation. Changing Require ordering parts or Require picking inventory parts opens a confirmation before anything is saved. Changing Require approval for new lines or Require receiving parts before completion does not — approval governs new lines only, and receiving is a rule read at invoicing. Neither writes to an existing record, so there is nothing to warn about."* and *"The confirmation names the setting and the direction in its title … and it states the consequence with the number of records that will change."* and *"Turning picking off is the highest-consequence change in this feature, because it is the only one that moves inventory. It is stated as a warning rather than as a count alone, and it names the stock deduction in those words."*
  - Would need: (1) confirm only for ordering and picking; (2) approval and receiving save with no confirmation; (3) title names setting + direction; (4) body states the count of records; (5) picking-off is a warning naming the stock deduction. Its Preconditions (which describe a "sweepable" review-setting scenario and API driving) also no longer fit.

- **C44558 — VERDICT: UNCHANGED.** Spec still: *"Cancelling leaves the setting as it was and changes no records."*

- **NEW-NEEDED (Story 3) — proposed case: "Only ordering and picking ask for a confirmation; approval and receiving save directly; picking-off warns about the stock deduction; a zero count shows none."**
  - Why: the revision's central new rule — that two of the four settings show **no** confirmation, and the exact consequence texts including the picking-off warning — is not covered by C44558 (cancel only), and C44557 (which would cover confirmation content) is HELD-AUTOMATED. A live, runnable case is needed so the narrowing is testable.
  - Belongs to: SV-9249 (Story 3), "Confirmation before a settings change".
  - Preconditions sketch: signed in with access to Settings › App Settings; open work orders exist with outstanding parts so counts are non-zero; also a state where a setting's change affects zero records.
  - Steps sketch: (1) change "Require ordering parts" and read the confirmation; (2) change "Require picking inventory parts" off and read the confirmation; (3) change "Require approval for new lines" and watch whether a confirmation appears; (4) change "Require receiving parts before completion" and watch whether a confirmation appears; (5) change a setting where no existing records are affected.
  - Expected sketch (spec-sourced):
    1. Changing "Require ordering parts" or "Require picking inventory parts" opens a confirmation before anything is saved; the title names the setting and the direction, and the body states the number of records that will change.
    2. Turning "Require picking inventory parts" off is shown as a warning, not just a count, and it says in words that the affected inventory parts will be marked as picked and **deducted from stock**.
    3. Changing "Require approval for new lines" or "Require receiving parts before completion" shows no confirmation and saves directly.
    4. When the count of affected records is zero, no confirmation shows and the setting saves directly.
    5. Where a large number of records is affected, the confirmation also advises making the change outside working hours; where the number cannot be established it states the consequence without a figure.
  - Spec source: the Story 3 "Requirements" and "Negative cases" quoted above, plus *"A count of zero shows no confirmation; the setting saves directly"* and *"No confirmation claims a consequence it cannot count. Where the number cannot be established the confirmation states the consequence without a figure."*

---

## SV-9250 (Story 4) — Applying at scale blocks the admin, not the organization

- **C44559 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected** (and the case title reads "blocks the app", which now overstates the scope).
  - (b) What is now wrong/missing: The case asserts the change "blocks the app" and says nothing about who else is affected. The revision's whole point is that only the admin who made the change is blocked while everyone else keeps working, and the organization is never locked — the case omits this.
  - (c) Current-spec sentences that drive it: *"While the change is being applied, the admin who made it is blocked and nobody else is. The settings page shows a progress indicator and does not return until every affected record has been changed. Every other user in the organization keeps working normally."* and *"The organization is never locked. There is no mechanism to lock work orders org-wide, and a shop cannot have its technicians stopped because somebody toggled a setting."* and *"Another user viewing an affected work order mid-run may see stale values until they refresh. This is accepted …"*
  - (d) Proposed new Expected:
    1. While the change is being applied, the admin who made it is blocked: the settings page shows a progress indicator and does not return until every affected record has been changed.
    2. Every other user in the organization keeps working normally; the organization is never locked and technicians are never stopped.
    3. Another user viewing an affected work order during the run may see out-of-date values until they refresh; this is expected, because every record is committed on its own and the run can be re-run.

- **C44560 — VERDICT: UNCHANGED.** Its failure/rollback assertion is unchanged in the revision: *"A partially applied change is never left visible to the admin. If the run fails, either the change completes or the setting reverts, and the admin is told which."* (The "admin" vs "user" wording is trivial; the concurrent stale-read negative is folded into C44559 above, where it belongs.)

---

## SV-9251 (Story 5) — Parts no longer block completing a line; a line in Needs Approval cannot be completed by any path; Create invoice is refused while any line is in Needs Approval

- **C44561 — VERDICT: HELD-AUTOMATED.** (custom_atmstatus=3.)
  - Change it would need: **none to its core assertion.** The case verifies that an already-Approved line completes whatever the state of its parts, which the revision does not touch (*"A line completes whatever the state of its parts. Unordered, unpicked and unreceived parts do not prevent it, in any combination."*). Its precondition already requires an Approved line, so the new "Approve first" rule does not contradict it. If the QA lead wanted, a one-line note could be added that a line in Needs Approval is out of scope here because it cannot be completed by any path — but that behaviour belongs to C44563, not this case.

- **C44562 — VERDICT: UNCHANGED.** Spec still: the other line requirements (tech story, mileage, engine hours each only when its setting is on, and core resolution) stay, and *"Where receiving is not required, an unresolved core is asked before the line completes."*

- **C44563 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: The case lists the completion paths and that Mark as reviewed is not among them, but it omits the revision's central approval gate — that no path completes a line that is not Approved, that Complete lines counts only Approved lines, and that Create invoice is refused while any line is still in Needs Approval.
  - (c) Current-spec sentences that drive it: *"A line in Needs Approval cannot be completed by any path — no transition from Needs Approval to Complete exists, so Approve comes first, on the line or in the bulk action bar."* and *"Create invoice, which closes the work order's Approved lines as a stated consequence of invoicing and is refused while any line is still in Needs Approval."* and *"Nothing completes a line that is not approved, and nothing approves a line on the way to completing it. Complete lines counts only Approved lines, and Create invoice is refused while any line is still in Needs Approval."*
  - (d) Proposed new Expected (add to the existing list):
    1. A line reaches Complete only through: Complete on the line; Complete lines / Complete all lines in the bulk action bar; Create invoice (which closes the work order's Approved lines as a consequence of invoicing); and Clock out and complete in the clock-out modal.
    2. Nothing else completes a line — no timer and no background job.
    3. A line in Needs Approval cannot be completed by any path; it must be Approved first, on the line or in the bulk action bar. Nothing approves a line on the way to completing it.
    4. Complete lines counts only Approved lines, and Create invoice is refused while any line is still in Needs Approval.
    5. Mark as reviewed is not on the list: it becomes available only once every line is already complete, so there is never an open line for it to close.

- **C44564 — VERDICT: UNCHANGED.** Clock-out modal (two buttons, hidden tick box, tech story required, otherwise unchanged) matches spec verbatim.

- **C44565 — VERDICT: UNCHANGED.** Spec still: *"Complete is never disabled for a parts reason, anywhere … A line reopened after completion returns to Approved with its parts unchanged … A Technician in Tech View cannot complete, because they cannot approve. They can still pick parts."*

---

## SV-9253 (Story 7) — Line and parts action groups separated; dividers between groups; "Deselect all" added

- **C44571 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 3 describes the layout as *"n selected, then up to three primary buttons, then More, then a close control"* — the revision replaces this with an explicit layout that adds "Deselect all", splits line actions from parts actions, and puts a divider between each group.
  - (c) Current-spec sentences that drive it: *"Layout is n selected, then Deselect all, then the line actions, then the parts actions, then More, then a close control, with a divider between each group."* and *"Dividers sit after n selected, after the line group and after the parts group. They are always in those places, so the bar reads the same whatever it is holding."*
  - (d) Proposed new Expected (replace item 3; keep items 1, 2, 4, 5):
    3. Layout is: "n selected", then Deselect all, then the line actions, then the parts actions, then More, then a close control — with a divider after "n selected", after the line group and after the parts group, always in those places.

- **C44572 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 1 describes a single ordered run of "primary slots" (finish action, Complete lines, Approve, then Order, Receive, Pick). The revision makes line actions and parts actions **two independent groups** that never compete for the same slot, and a parts action is never pushed into More by a line action.
  - (c) Current-spec sentences that drive it: *"Line actions and parts actions sit in separate groups and never compete for the same slot. The line group takes up to three — the finish action when the selection covers every open line, then Complete lines, then Approve. The parts group takes up to three — Order, Receive, Pick, in that order. A parts action is never pushed into More by a line action. The two groups are sized independently."*
  - (d) Proposed new Expected (replace item 1; keep items 2, 3, 4):
    1. The line group shows up to three actions, in order: the finish action (when the selection covers every open line), then Complete lines, then Approve. The parts group shows up to three, in order: Order, Receive, Pick. The two groups are separate and sized independently — a parts action is never pushed into More by a line action, and neither group takes a slot from the other.

- **C44573 — VERDICT: UNCHANGED.** Confirm/undo-by-kind and one-toast-per-action match the spec exactly.

- **C44574 — VERDICT: UNCHANGED.** Every assertion it makes (no permission = no bar; zero count = absent; empty More not rendered; "No actions available for this selection"; Delete lines absent; Mark as reviewed never in the bulk bar) still holds. The new empty-group/Deselect-all behaviours it does not assert are captured as a NEW case below rather than by editing this one.

- **NEW-NEEDED (Story 7) — proposed case: "Deselect all keeps the bar; the close control dismisses it; an empty group shows no divider."**
  - Why: the revision adds two functional behaviours not covered anywhere — the distinction between Deselect all and the close control, and that a group holding nothing renders no divider. C44574 covers only "nothing applies" text, not these.
  - Belongs to: SV-9253 (Story 7), "The bulk action bar".
  - Preconditions sketch: signed in with WO Lines: Create & Edit + Full View; a work order with several lines and parts, so both a line group and a parts group can appear.
  - Steps sketch: (1) select several lines, then press Deselect all; (2) re-select, then press the close control; (3) make a selection where only a line action applies and no parts action does, and look at the dividers.
  - Expected sketch (spec-sourced):
    1. Deselect all clears the selection but leaves the bar in place; the column headers return.
    2. The close control clears the selection and dismisses the bar; the column headers return, exactly as with Deselect all.
    3. A group that is holding nothing renders no divider and takes no space, so the bar reads the same whatever it holds.
  - Spec source: *"Deselect all clears the selection and leaves the bar in place. The close control clears the selection and dismisses the bar. Both exist because a user who over-selected wants to start again, not to lose the bar and the column headers with it."* · *"A group holding nothing renders no divider and takes no space."* · *"Clearing the selection through Deselect all returns the column headers, exactly as closing the bar does."*

---

## SV-9259 (Story 13) — Receiving from the work order: create a vendor from the vendor field; a vendor is fixed once its part is received

- **C44583 — VERDICT: HELD-AUTOMATED.** (custom_atmstatus=3.)
  - Change it would need: **none to its core assertion.** It verifies that Receive opens a modal (no navigation) whose contents depend on the entry point, and that a received part leaves the "Awaiting" state — the revision does not change the modal-contents-by-entry-point rules. The new vendor-creation and vendor-fix rules belong to C44585 and to the new case below, not here.

- **C44584 — VERDICT: UNCHANGED.** Required fields, prefilled cost/tax, quantity rules, optional delivery note, and the sell-price-will-update note all match the spec verbatim; none is touched by the 2026-09-08 change.

- **C44585 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 3 says only *"If the vendor is not found the user can create one from here, under the same Vendor & Order Mgmt gate."* The revision now specifies the creation flow in detail — a "Create" option with the typed name, reuse of the existing new-vendor modal, name and tax rate required, what happens on save, and what a user without the permission sees.
  - (c) Current-spec sentences that drive it: *"A vendor that does not exist yet can be created from that field. Typing a name that matches nothing offers Create with the typed name, below the results. Choosing it opens the existing new-vendor modal with the name prefilled, and the user finishes it there."* and *"Name and tax rate are both required, exactly as they are on the vendor page today. Everything else on that form stays optional."* and *"On save the modal closes, the new vendor is selected in the field, and the form continues where it left off. Nothing already entered is lost."* and *"Creating a vendor here needs the same vendor-management permission … A user without it sees results only and no Create option."* and (negatives) *"A vendor created here is a full vendor record, not a placeholder. It appears on the vendor page like any other."* and *"Cancelling the new-vendor modal returns to the receive form with the typed name still in the field and no vendor selected."*
  - (d) Proposed new Expected (replace item 3; keep items 1, 2, 4):
    3. If the typed vendor name matches nothing, a Create option appears below the results carrying that name. Choosing it opens the usual new-vendor modal with the name already filled in; name and tax rate are required and everything else is optional. On save, the modal closes, the new vendor is selected in the field, and nothing already entered is lost. Cancelling the new-vendor modal returns to the receive form with the typed name still there and no vendor selected. A user without the vendor-management permission sees results only, with no Create option. A vendor created here is a full vendor record and appears on the vendor page like any other.

- **C44586 — VERDICT: UNCHANGED.** One-bill-per-purchase-order and two-POs-one-invoice-number match the spec verbatim.

- **C44587 — VERDICT: HELD-AUTOMATED.** (custom_atmstatus=3.)
  - Change it would need: **none.** It verifies that a user without See Financial Data can still receive and that money fields are removed while prefilled values stand — unchanged in the revision (*"A user who cannot see money can still receive. Cost and tax are removed from their screen and the prefilled values stand."*).

- **C44588 — VERDICT: UNCHANGED.** All negatives (no part number outlined red; zero/negative quantity rejected; unordered/unapproved parts never included; unticked card's receive disabled; no receive without a vendor bill; invoiced-mid-session refused; empty state) match the spec verbatim.

- **NEW-NEEDED (Story 13) — proposed case: "A vendor can be corrected while its parts are unreceived and is fixed once any part is received."**
  - Why: this is the "fixing a vendor once its part is received" requirement from the change-log. No existing case covers it — C44585 covers assigning a vendor to a vendor-missing part, not correcting/locking one.
  - Belongs to: SV-9259 (Story 13), "Receiving from the work order" (and reinforced on the PO page, Story 14 / C44589).
  - Preconditions sketch: signed in with Order Parts + Vendor & Order Mgmt: Create & Edit; a purchase order created without a vendor whose parts are still unreceived; and another whose part has already been received.
  - Steps sketch: (1) on the unreceived purchase order, change the assigned vendor; (2) on the one with a received part, look for a way to change the vendor; (3) attempt to receive a part against a vendor different from the one already recorded.
  - Expected sketch (spec-sourced):
    1. While the purchase order has no received parts, its assigned vendor can be replaced.
    2. Once any part on it is received, its vendor is fixed — there is no way to change it, because it belongs to that delivery and that vendor's bill.
    3. A purchase order that already carries a named vendor offers no change of vendor at all; parts that genuinely belong to another supplier are removed and ordered again.
    4. A receive is refused if it names a vendor different from the one already recorded against a received part (the rule holds on the back end, not only on screen).
  - Spec source: *"A vendor can be corrected while the parts are unreceived. Where the purchase order was created without one, the assigned vendor can be replaced until the part is received. Once a part is received its vendor is fixed …"* · *"A purchase order that already carries a named vendor offers no change of vendor. Where parts genuinely belong to another supplier they are removed from the purchase order and ordered again."* · *"The guard is on the back end as well as in the interface. A receive call must not accept a vendor that differs from the one already recorded against a received part."*

---

## SV-9260 (Story 14) — Receive page & PO bulk receive: create a vendor from the field; vendor editable only until received; list-page bulk action bar; paged select-all recorded as expected

- **C44589 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 5 says a resolved missing-vendor group *"show[s] the vendor name with an edit affordance."* The revision restricts the edit affordance to purchase orders with no received parts — once anything is received, the name is plain text with no edit.
  - (c) Current-spec sentences that drive it: *"Missing-vendor groups carry an amber treatment and a Vendor missing label in both states. Once resolved they show the vendor name. The vendor stays changeable only while the purchase order has no received parts; once anything on it is received the name is shown as text, with no edit affordance."*
  - (d) Proposed new Expected (replace item 5; keep items 1–4):
    5. Missing-vendor groups carry an amber treatment and a "Vendor missing" label in both the collapsed and expanded states. Once a vendor is assigned, the name shows. The vendor can still be changed only while the purchase order has no received parts; once anything on it has been received, the name is shown as plain text with no way to edit it.

- **C44590 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 4 says the two assign-vendor entry points *"both link an existing vendor"* — it omits that both can also create a new vendor, on the same rules as the receive modal.
  - (c) Current-spec sentences that drive it: *"A vendor can be assigned two ways: hovering a collapsed row reveals Assign vendor, and expanding makes it the required first field. Both link an existing vendor or create a new one, on the same rules as the receive modal — a name that matches nothing offers Create, which opens the existing new-vendor modal with the name prefilled and name and tax rate required."*
  - (d) Proposed new Expected (replace item 4; keep items 1, 2, 3, 5, 6):
    4. A vendor can be assigned two ways: hovering a collapsed purchase-order row reveals Assign vendor, and expanding the row makes it the required first field. Both can either link an existing vendor or create a new one — typing a name that matches nothing offers Create, which opens the usual new-vendor modal with the name filled in and name and tax rate required (the same flow as the receive modal).

- **C44591 — VERDICT: UNCHANGED.** Receive-validity parity with the modal, invoice-number reuse across a vendor's POs, sell-price hidden in the modal/Parts page, money columns absent without See Financial Data, and view-only cannot receive — all match the spec verbatim.

- **NEW-NEEDED (Story 14) — proposed case: "Selecting purchase orders on the list page raises the shared bulk action bar; Assign vendor lives in More; Select all covers only the loaded page."**
  - Why: the change-log calls out that Story 14 now specifies the list-page bulk action bar and records paged select-all as expected behaviour. Neither is covered by any existing case.
  - Belongs to: SV-9260 (Story 14), "The receive page and PO bulk receive".
  - Preconditions sketch: signed in with Vendor & Order Mgmt: Create & Edit; more than thirty purchase orders exist across several vendors, including at least one with no vendor, so a second page loads on scroll and the selection can span vendors.
  - Steps sketch: (1) select several purchase orders and read the bar; (2) look for Assign vendor on the bar; (3) use Select all, then scroll to load more rows and check which are selected.
  - Expected sketch (spec-sourced):
    1. Selecting purchase orders raises the same bulk action bar as the work order, not a bar of its own design: "n selected", then Deselect all, then Receive selected as the primary action, then More, then a close control, with the same dividers.
    2. Assign vendor is not the primary action; it lives in More and acts only on the selected rows that have no vendor.
    3. The bar carries no amber treatment.
    4. Select all selects only what is loaded — one page (thirty rows) — so after scrolling to load more, the newly loaded rows are not selected. (This is expected behaviour in this release, not a defect — see AMBIGUITIES.)
  - Spec source: *"Selecting purchase orders on the list page raises the same bulk action bar as the work order, not a bar of its own design. Layout is n selected, then Deselect all, then Receive selected as the primary action, then More, then a close control, with the same dividers."* · *"Assign vendor is not the primary action on that bar. It belongs to a row … It lives in More and acts only on the rows in the selection that have no vendor."* · *"The bar carries no amber treatment."* · *"Select all selects what is loaded, which is one page. The list pages at thirty rows and loads more on scroll …"*

---

## SV-9261 (Story 15) — Receive later now covers CORE parts: the core follows the parent's deferral and is never offered a choice of its own

- **C44592 — VERDICT: UNCHANGED.** Its assertions (split button; chosen per part; sets Received later; satisfies the completion requirement; receivable later from the … menu; deferring several at once; still counts in Waiting on Parts) are all unchanged by the revision. The revision's addition is the core behaviour, which the case does not touch.

- **C44593 — VERDICT: UNCHANGED.** The no-permission / setting-off / not-duplicated-in-menu / deferring-creates-no-bill negatives all match the spec verbatim.

- **NEW-NEEDED (Story 15) — proposed case: "Deferring a part with a core charge — the core follows the parent and is never offered its own Received later choice."**
  - Why: the entire core-parts behaviour is new in the 2026-09-08 revision and is uncovered by C44592/C44593.
  - Belongs to: SV-9261 (Story 15), "Receive later".
  - Preconditions sketch: signed in with the Received later permission and Order Parts; "Require receiving parts before completion" is on; a work order has an approved line with a part that carries a core charge (parent + core sibling) awaiting receipt; and a second part whose core is already resolved.
  - Steps sketch: (1) choose Received later on the parent part and check the core sibling's state and row; (2) look at the line's completion requirement; (3) receive the parent later and check the core; (4) defer a part whose core is already resolved.
  - Expected sketch (spec-sourced):
    1. Choosing Received later on the parent puts its core sibling into the same "Received later" state, so the pair stays consistent and neither blocks completion on its own.
    2. The core is never offered a Received later choice of its own — while its parent is deferred it carries no caret and no row action, and it never appears as a separate row.
    3. Deferring a part with a core moves no stock and creates no core credit; nothing about the core's value is decided until the parent is received.
    4. Receiving the parent later resolves the core with it, in the same pass and under the same invoice number.
    5. An unresolved core is still asked for before the line completes, exactly as when receiving is not required — deferring the receive defers the paperwork, not the core decision.
    6. A part whose core is already resolved defers like any other part.
  - Spec source: *"A part that carries a core charge can be deferred, and its core follows the parent. Choosing Received later on the parent puts the core sibling in the same state …"* · *"The core is never offered a Received later choice of its own, because it has no separate vendor bill … It carries no caret and no row action while its parent is deferred."* · *"Receiving the parent later resolves the core with it, in the same pass and under the same invoice number."* · *"An unresolved core is still asked for before the line completes, exactly as it is when receiving is not required."* · *"Deferring a part with a core moves no stock and creates no core credit …"* · *"A core sibling never appears twice …"* · *"A part whose core is already resolved defers like any other part."*

---

## SV-9263 (Story 17) — Completion wizard: the receive step has exactly one action

- **C44595 — VERDICT: UNCHANGED.** Step list built from settings + outstanding work, step order, pills with counts, finished-step tick, Resolve cores unchanged — all match the spec verbatim.

- **C44596 — VERDICT: UPDATE.** (Low-confidence / additive — the case is not contradicted, but it directly addresses the receive step's action and the revision adds an explicit constraint on it.)
  - (a) Field(s): **Expected.**
  - (b) What is missing: the case says each step's button is its own action and names "Receive parts", but does not state the revision's new point — that the receive step has **only** that one action, with no second action to leave without receiving.
  - (c) Current-spec sentences that drive it: *"The receive step's only action is Receive parts. There is no second action offering to leave the step without receiving. With receiving required there is nothing else that step can do, and a button that does nothing when pressed is exactly what this release removes elsewhere."*
  - (d) Proposed new Expected (add as a sub-point to item 1):
    - On the receive step the only action is Receive parts; there is no second action offering to leave the step without receiving.

- **C44597 — VERDICT: UNCHANGED.** The three run-end outcomes match the spec verbatim.

- **C44598 — VERDICT: UNCHANGED.** Not-required steps absent, mid-run completion closes to the outcome, server error keeps entered values — all match the spec verbatim.

---

## SV-9264 (Story 18) — Create invoice is the finish action, and is refused (shown disabled with a reason) while any line is in Needs Approval; a declined line never blocks it

- **C44599 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: The case's header states are keyed only on "line open / complete / reviewed" and treat Create invoice as simply present-in-the-…-menu when a line is open. The revision adds a distinct state — any line in Needs Approval — where Create invoice must be shown **disabled with a reason**, and a work order whose lines are all in Needs Approval offers no finish action, with nothing approved as a side effect.
  - (c) Current-spec sentences that drive it: *"Create invoice is refused while any line is still in Needs Approval … The action is shown disabled with the reason All lines must be approved before invoicing, not hidden."* and *"Nothing approves a line as a side effect of invoicing. A work order whose lines are all in Needs Approval offers no finish action at all."*
  - (d) Proposed new Expected (add to the existing header-state list):
    - When any line is still in Needs Approval, Create invoice is shown disabled with the reason "All lines must be approved before invoicing" — it is not hidden, and invoicing never approves a line as a side effect. A work order whose lines are all in Needs Approval offers no finish action at all; the next real action is approving the lines, on the line or in the bulk action bar.

- **C44600 — VERDICT: UPDATE.**
  - (a) Field(s): **Expected.**
  - (b) What is now wrong/missing: Item 2 says the confirmation states *"how many lines will be completed"* and item 3 says *"every line completes"* — the revision scopes both to **Approved** lines and requires declined lines to be named as excluded rather than counted.
  - (c) Current-spec sentences that drive it: *"If lines are still open, its confirmation states the invoice total and how many Approved lines will be completed. Declined lines are named as excluded rather than counted."* and *"On completion the invoice is created, every open Approved line completes, and the Finance tab opens with the payment screen."* and *"A declined line never blocks it. Declining is terminal: the work is not performed, the line is not invoiced, and it is skipped entirely."*
  - (d) Proposed new Expected (revise items 2 and 3; keep 1, 4, 5):
    2. If lines are still open, the confirmation states the invoice total and how many **Approved** lines will be completed; declined lines are named as excluded rather than counted.
    3. On completion the invoice is created, every open **Approved** line completes, and the Finance tab opens with the payment screen. A declined line never blocks invoicing — it is skipped entirely.

- **C44601 — VERDICT: UNCHANGED.** Every negative it asserts (Mark as reviewed never completes/opens the wizard/asks a confirmation; closing the payment screen rolls nothing back; review-required hides Create invoice until reviewed; all-declined = no finish action; once invoiced both actions gone; permission visibility) still matches the spec verbatim. The Needs-Approval-refused behaviour is captured in the C44599 update, which is the header-states case where it belongs.

---

## AMBIGUITIES — PO questions for Milos Vasic (not resolved here)

1. **Story 2 — the "approval first, then ordering, then picking" sweep order appears to contradict "approval changes no existing line."** The rewritten Story 2 says both *"When more than one setting changes in a single save, approval is applied first, then ordering, then picking. A part on a line that is not yet approved is invisible to the ordering sweep, so the order matters"* AND *"Turning approval on or off changes no existing line."* If approval never touches an existing line, applying it "first" changes nothing, so the stated precedence has no effect on existing data. Question for Milos: given approval no longer sweeps existing lines, does the "approval first" ordering still mean anything, or should it be read purely as "parts on not-yet-approved lines are simply excluded from the ordering and picking sweeps"? (The exclusion reading is what C44554's proposed item 5 tests; the precedence itself is left unwritten pending his answer.) Cost of silence: the sweep-order behaviour cannot be given a definite Expected, so it stays untested.

2. **Story 14 — paged "Select all" only covers the loaded page.** The spec records this as expected, not a defect: *"Select all selects what is loaded, which is one page … It is written down so it is raised as a question rather than as a defect, and it resolves when pagination is replaced, which is outside this release."* Question for Milos: confirm the release ships with Select all covering only the first thirty (loaded) rows, and that this is acceptable for the accountant workflow until pagination is replaced. Cost of silence: the new list-page bulk-receive case would assert behaviour the PO may consider a defect; confirming it keeps the case a Pass rather than a raised deviation.

3. **Story 4 — the volume threshold for background application and the off-hours advisory is "agreed with engineering", not stated.** *"Above a volume agreed with engineering, it is applied in the background … The volume at which the off-hours advisory appears is agreed with engineering."* This is deferred to engineering rather than the PO, but the tester needs a concrete number to verify the in-request vs background boundary and the advisory trigger. Question (engineering, via Milos): what are the two thresholds? Cost of silence: the boundary and advisory-trigger sub-behaviours stay unverifiable, though the admin-only-blocking behaviour (C44559) is testable without them.

Note (not a PO question — dev trap only): Story 1 records that the toggle labelled "Require Receiving Parts Before Completion" is stored under a differently-named field and that no second field should be added. This is guidance for whoever builds it and does not affect the tester-facing cases.

---

## SUMMARY

| Story | # cases | # UPDATE | # UNCHANGED | # HELD | # NEW |
|---|---|---|---|---|---|
| SV-9247 (Story 1) | 5 | 1 (44551) | 4 (44549, 44550, 44552, 44553) | 0 | 0 |
| SV-9248 (Story 2) | 3 | 2 (44554, 44555) | 1 (44556) | 0 | 0 |
| SV-9249 (Story 3) | 2 | 0 | 1 (44558) | 1 (44557) | 1 |
| SV-9250 (Story 4) | 2 | 1 (44559) | 1 (44560) | 0 | 0 |
| SV-9251 (Story 5) | 5 | 1 (44563) | 3 (44562, 44564, 44565) | 1 (44561) | 0 |
| SV-9253 (Story 7) | 4 | 2 (44571, 44572) | 2 (44573, 44574) | 0 | 1 |
| SV-9259 (Story 13) | 6 | 1 (44585) | 3 (44584, 44586, 44588) | 2 (44583, 44587) | 1 |
| SV-9260 (Story 14) | 3 | 2 (44589, 44590) | 1 (44591) | 0 | 1 |
| SV-9261 (Story 15) | 2 | 0 | 2 (44592, 44593) | 0 | 1 |
| SV-9263 (Story 17) | 4 | 1 (44596) | 3 (44595, 44597, 44598) | 0 | 0 |
| SV-9264 (Story 18) | 3 | 2 (44599, 44600) | 1 (44601) | 0 | 0 |
| **TOTAL** | **39** | **13** | **22** | **4** | **5** |

(39 = the cases mapped to the 11 changed stories analysed here. The suite is 61 cases in all; the other 22 belong to stories the 2026-09-08 change-log does not touch and were out of scope for this diff.)

HELD-AUTOMATED cases (do not edit; QA lead decides): C44557, C44561, C44583, C44587 — the exact four flagged as AUTOMATED.
Proposed NEW cases (5): Story 3 (confirmation narrowing + picking-off warning), Story 7 (Deselect all vs close; empty group no divider), Story 13 (correct/lock vendor once received), Story 14 (PO list-page bulk bar + paged select-all), Story 15 (core parts deferral).
