# Inline Add and Edit Parts on Work Order Lines — Confluence page 782761986

**Captured live 2026-08-31 via mcp__Atlassian__fetch. metadata.version = 16. "Last Updated" 2026-08-27.**
Verbatim body follows.

---

|  |  |
| --- | --- |
| **Epic** | SV-9315 |
| **Owner** | Sasha Grosman |
| **Design** | Claude Design — Add Part (artifact 561657da-adc4-45a2-88e5-cd8ae15c63eb) |
| **Last Updated** | 2026-08-27 |

## 1. Business Case

Adding parts to a work order today is a high-effort task: every part requires opening a modal, filling it out, saving, and reopening it for the next part. For a technician adding several parts to a job, that is a long sequence of clicks and constant switching between keyboard and mouse. This feature puts part entry directly on the work order line so a technician can add parts one after another without leaving the keyboard, while preserving the full-detail path for users who need to price and categorize those parts for processing.

## 2. Feature Overview

**Core ShopView**

* An "Add Part" button appears directly on each work order line while the work order is open and editable.
* Selecting it opens an editable row inline on that work order line, rather than a modal.
* The fields shown in the inline row depend on the user's work order view mode:
    * **Tech View** — description, part number, quantity
    * **Full View** — description, part number, quantity, category, cost, sell price
* Saving an inline row immediately adds the part to the work order line, shows a success toast, and opens a fresh empty row with the cursor in the description field, so the user can enter the next part without touching the mouse.
* A part saved without a matching catalog part is added with status **Requested** and is visually flagged as needing details, so a Full View user can complete it later.
* When the part is linked to a catalog part that is held in bins, the system picks the bin it will be pulled from and shows that choice under the row, where the user can change it or split the quantity across bins without leaving the row.
* Existing parts on a work order line expose an Edit control on hover or keyboard focus. In Tech View, Edit opens the same inline row. In Full View, Edit opens the part details modal.
* Full View users can escalate from the inline row to the part details modal via a "More Options" button, carrying over anything already typed.
* The inline row can be dismissed without saving. If the user has entered data, the system confirms before discarding it — whether they dismiss the row directly or navigate away from the work order.

**Out of Scope**

* Line approval behavior is unchanged. The unpriced-parts guard shown in the design canvas is existing behavior and is not modified by this spec.
* A small-screen (phone / narrow tablet) treatment of the inline row. Behavior on small screens is unchanged from today; a dedicated Tech View small-screen story may follow once designs exist.
* Inline deletion of parts. Deleting a part continues to work as it does today. (The current design canvas shows a row menu containing Delete — this is being removed; see design punch list.)
* Drag-and-drop reordering of part rows, per-cell editing of saved rows, the part details side panel, unlinking a part from the catalog, and part source cycling. These appear in the design canvas but are separate scope; they will be specced independently.
* Changes to labor, sublet, or other non-part work order line items.
* Changes to how parts are ordered, picked, or received (existing procurement statuses and actions are unchanged).

## 3. Jobs to be Done / Goals

> **When** I have a work order open at the bay and I need to record the parts I just used, **I want to** add them straight onto the line I am looking at, **so I can** keep working instead of navigating in and out of modals.

> **When** I am adding several parts in a row, **I want to** type a part, save, and immediately start the next one without reaching for the mouse, **so I can** get through a long parts list quickly.

> **When** I am responsible for pricing and processing a work order, **I want to** enter full part details including cost and sell price, **so I can** get the work order ready for invoicing.

**Goals**

* Reduce the number of clicks required to add a part to a work order line.
* Make repeat part entry fully completable from the keyboard.
* Preserve the complete add-part experience for users who need more than the inline fields.

## 4. Key Decisions

* **The inline row is a fast path, not a replacement.** The part details modal remains available to Full View users through "More Options" and continues to be the way to reach fields that are not on the inline row.
* **Description is the anchor field.** (2026-08-17, design review) The row leads with description — it is the required field, receives focus first, and receives focus again after each save. Part number is optional; a part with no catalog match is allowed and enters the Requested flow. This replaced the earlier "part number or description" rule.
* **Quantity starts empty and is required.** (2026-08-17) An empty quantity is a prompt to enter one, not a silent default of 1. (The part details modal may still default quantity to 1.)
* **Tech View gets inline edit; Full View does not.** Full View editing routinely involves fields that do not fit on an inline row. Full View edit opens the part details modal.
* **A part added by a Tech View user is categorized as Uncategorized.** Category is not visible in Tech View; assigning Uncategorized makes the gap visible so a Full View user can correct it later.
* **This spec changes part entry only.** (2026-08-18) Downstream behavior — line approval, the unpriced-parts guard, procurement statuses — is existing behavior and is not modified.
* **One success toast for all saves.** (2026-08-18) The toast always reads "Part added"; the Requested status and needs-details flag on the part line communicate the catalog gap, not the toast.
* **Edit is revealed on hover/focus, not in a row menu.** (2026-08-17) The design's kebab menu (Edit/Delete) is replaced with a hover-revealed Edit control; delete stays out of scope.
* **View mode follows the permission, not the job title.** (2026-08-17)
* **Unsaved data is protected.** (2026-08-17, reaffirmed) Discarding a populated row — directly or by navigating away — requires confirmation (Story 6), even though this adds one step to abandonment.
* **Validation speaks in one sentence.** (2026-08-24, design review) When more than one required field is empty, the row shows a single combined message naming all of them, not one message per field.
* **Cancelling the part details modal discards the whole entry.** (2026-08-24) Modal cancel asks for confirmation first; confirming closes both the modal and the inline row and discards the data (S4-R12). This resolves the Story 6 open question.
* **Only one inline row may be open at a time.**
* **No feature flag.** The change is additive; the existing permissions already control what each user sees.

## 5. Terminology

* **Work order line** → A line item on the work order (the job or service being performed). Parts are added underneath a work order line. Where this spec says "part line," it means an individual part record beneath a work order line — not the work order line itself.
* **Tech View / Full View** → The two options of the 'Work Orders → Work Order View Mode' permission. Tech View hides cost and pricing information; Full View shows it.
* **Inline row** → The editable row that appears within the work order line when adding or editing a part. It is not a modal and does not overlay the page.
* **Rate** → The user-facing label for a part's sell price. This spec uses "sell price" and "Rate" interchangeably.
* **Requested** → The existing status assigned to a part added without a matching catalog part. Requested parts are flagged as needing details until completed by a Full View user.
* **Bin** → A named storage location holding a quantity of a part. A catalog part may be held in several bins, each with its own on-hand quantity.
* **Default bin** → The one bin per part flagged as the first place to pull from.
* **Allocation** → Which bin or bins the quantity on a part line is pulled from, and how much from each. Shown on the inline row as the "Pulled from" chip.
* **Part details modal** → The full add/edit part form reached via "More Options", "Create new part", or Full View Edit. It contains all part fields including category and bin quantities.

## 6. Assumptions

* The Work Order View Mode permission already exists and already determines whether a user sees cost and pricing on the work order. This spec extends its effect to the new inline behavior rather than introducing a new permission.
* The part number typeahead is the same control used in the existing add-part flow and behaves as it does today.
* Adding the same part twice to the same work order line is permitted and produces two separate part lines.

## 7. Requirements

### Story 1: Add Part Button on Work Order Lines — Jira SV-9316

**Prerequisites:** A work order is open. Status is one of: Estimate, Approved, In Progress, Review. The user has 'Work Order Line - Create and Edit' enabled. The user has 'Work Orders → Work Order View Mode' set to Tech View or Full View (exactly two options; every user has one).

* **S1-R1:** Each work order line displays an "Add Part" button in its Parts section.
* **S1-R2:** Selecting "Add Part" opens an inline row directly below the Add Part control, above the line's existing parts. _(Amended 2026-08-17.)_
* **S1-R3:** When the inline row opens, the cursor is placed in the description field automatically. _(Amended 2026-08-17.)_
* **S1-R4:** If the user's view mode is Tech View, the inline row follows Story 2.
* **S1-R5:** If the user's view mode is Full View, the inline row follows Story 4.
* **S1-R6:** Each existing part line displays an Edit control when the user hovers over that part line.
* **S1-R7:** The Edit control is also revealed when the part line receives keyboard focus.
* **S1-R8:** If Tech View, selecting Edit follows Story 3. If Full View, selecting Edit follows Story 5.
* **S1-N1:** If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the "Add Part" button is not displayed on any work order line.
* **S1-N2:** If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the Edit control is not displayed on part lines.
* **S1-N3:** If the user does not have 'Work Order Line - Create and Edit' enabled, the "Add Part" button and the Edit control are not displayed.
* **S1-N4:** If the user is viewing a work order they cannot edit for any other existing reason, the "Add Part" button and Edit control are not displayed, matching today's behavior.
* **S1-E1:** If a work order line has no parts on it yet, the "Add Part" button is still displayed.
* **S1-E2:** If an inline row is already open anywhere on the work order, selecting "Add Part" on a different work order line follows S6-R5.

### Story 2: Inline Add Part — Tech View — Jira SV-9317

**Prerequisites:** All Story 1 prerequisites met. Work Order View Mode = Tech View.

* **S2-R1:** The inline row displays exactly three editable fields, in order: description, part number, quantity.
* **S2-R2:** Cost, sell price, category, and any other part details are not displayed in the inline row.
* **S2-R3:** The part number field is the same catalog typeahead used in the existing add-part flow and behaves as it does today.
* **S2-R4:** When the user selects a part from the typeahead, the part number and description populate from the selected part. A description the user had already typed is replaced by the catalog description. Typeahead result cards also carry the part's inventory quantity and bins, and selecting a part triggers bin allocation — see Story 7. _(Amended 2026-08-27.)_
* **S2-R5:** The user can overwrite the populated description after selection.
* **S2-R6:** The quantity field starts empty and is required. It may also be set by applying a bin split (S7-R14). _(Amended 2026-08-17; amended 2026-08-27: bin split may set it.)_
* **S2-R7:** The inline row displays a Save action and an X (close) action.
* **S2-R8:** To save, the user must have entered a description and a quantity. Part number is optional.
* **S2-R9:** When the user saves, the part is added at the top of the line's parts list and a success toast displays: "Part added". The toast fades on its own.
* **S2-R10:** Immediately after a successful save, a new empty inline row opens on the same work order line with the cursor in the description field.
* **S2-R11:** A part added through the Tech View inline row is assigned the category "Uncategorized." The category is not displayed to the Tech View user.
* **S2-R12:** Pressing Enter from any field in the inline row saves the row, with the same result as selecting Save.
* **S2-R13:** Pressing Tab moves the cursor forward through the row and does not leave it. See _Keyboard Model — Inline Row_ at the end of this section for the full order. _(Amended 2026-08-25.)_
* **S2-R14:** Pressing Escape closes the inline row, with the same result as selecting X.
* **S2-R15:** Selecting X closes the inline row without saving. If the row contains data, this follows S6-R1.
* **S2-R16:** If the user clicks anywhere outside the inline row while the row contains data, the row remains open and its data is preserved. The click does not cancel the row.
* **S2-R17:** If the user saves with no catalog part selected (free-typed description, with or without a free-typed part number), the part is added with the existing Requested status and the part line is visually flagged as needing details. The success toast is the same: "Part added". _(Amended 2026-08-18.)_
* **S2-R18:** The inline row displays a keyboard hint legend: Enter — save & next row · Tab — next field · Esc — cancel.
* **S2-R19:** When the user selects a part from the typeahead, focus moves to the quantity field. The part number and description are already populated, so quantity is the only remaining entry. _(Added 2026-08-24.)_
* **S2-N1:** If the user attempts to save while any required field is empty, the row does not save and a single inline validation message names all of them: "Enter a description, qty, cost and sell price to save this part." Only the fields actually missing are named, in that order; in Tech View only description and qty can appear. _(Amended 2026-08-24.)_
* **S2-N2:** An empty quantity is covered by the combined message in S2-N1 ("Enter a qty to save this part."). Quantity is required in both view modes. _(Amended 2026-08-24.)_
* **S2-N3:** If the user attempts to save with a quantity of zero or a negative quantity, the row does not save and an inline validation message is displayed: "Qty must be greater than 0."
* **S2-N4:** When a validation message is displayed, the invalid field is highlighted and the cursor moves to the first field that failed validation.
* **S2-N5:** Validation messages clear as soon as the user corrects the field.
* **S2-N6:** If the row is empty and the user selects X or presses Escape, the row closes immediately with no confirmation.
* **S2-E1:** If the typed part number matches nothing in the catalog, the typeahead behaves as it does in the existing add-part flow. A part saved without a catalog match follows S2-R17.
* **S2-E2:** If the user adds the same part twice to the same work order line, two separate part lines are created. Quantities are not merged.
* **S2-E3:** If the work order moves to a status that does not permit editing while the inline row is open, the save fails and the user sees an alert: "This work order can no longer be edited. Refresh to see the latest." The entered data remains in the row.
* **S2-EH1:** If the part cannot be saved for any other reason, the user sees an alert toast: "Couldn't add the part. Please try again." The inline row remains open with the entered data intact.

### Story 3: Inline Edit Part — Tech View — Jira SV-9318

**Prerequisites:** All Story 1 prerequisites met. Work Order View Mode = Tech View. The part line being edited already exists.

* **S3-R1:** Selecting Edit on a part line opens an inline edit row directly below that part line, containing the same three fields as the add flow in the same order: description, part number, quantity.
* **S3-R2:** The inline row is pre-populated with the part's current description, part number, and quantity.
* **S3-R3:** The cursor is placed in the description field when the row opens.
* **S3-R4:** All field behavior, keyboard behavior, and validation from Story 2 apply identically to the edit row (S2-R3 through S2-R8, S2-R12 through S2-R16, S2-R18, and S2-N1 through S2-N6), with one exception: the edit row's keyboard hint legend reads Enter — save · Tab — next field · Esc — cancel, without "& next row", because saving an edit does not open a new row (S3-R6). _(Amended 2026-08-24.)_
* **S3-R5:** When the user saves, the part line is updated in place and the inline row closes, returning to the normal part line display.
* **S3-R6:** Saving an edit does not open a new empty inline row. The repeat-entry behavior in S2-R10 applies only to the add flow.
* **S3-R7:** Any value on the part that is not displayed in Tech View — including cost, sell price, and category — is preserved unchanged when a Tech View user saves an inline edit, unless the user has linked the row to a different catalog part; in that case the row is repopulated from the new part and none of these values survive — see S3-R9. _(Amended 2026-08-24.)_
* **S3-R8:** Selecting X or pressing Escape closes the row without saving. If the user has changed any field, this follows S6-R1.
* **S3-R9:** If the user selects a different catalog part from the part number typeahead in the edit row, the row is repopulated from the newly selected part — description, cost, sell price, and category — matching the add flow (S2-R4). Fields not held by the catalog part are untouched: the quantity the user entered stays as it is, and focus moves to it. This is the one case where the values protected by S3-R7 are overwritten. _(Added 2026-08-24.)_
* **S3-N1:** If the user opens the edit row, changes nothing, and closes it, no confirmation is shown and no update is recorded.
* **S3-N2:** If the user does not have 'Work Order Line - Create and Edit' enabled, the Edit control is not displayed.
* **S3-N3:** If the user clears the description, the row does not save and the validation in S2-N1 applies.
* **S3-E1:** If another user modifies or deletes the same part while the inline edit row is open, the save fails and the user sees an alert: "This part was changed by someone else. Refresh to see the latest."
* **S3-E2:** If the work order moves to a status that does not permit editing while the row is open, S2-E3 applies.

### Story 4: Inline Add Part — Full View — Jira SV-9319

**Prerequisites:** All Story 1 prerequisites met. Work Order View Mode = Full View.

* **S4-R1:** The inline row displays six editable fields, in order: description, part number, quantity, category, cost, sell price (Rate). _(Amended 2026-08-17.)_
* **S4-R2:** Description, part number, and quantity behavior from Story 2 applies identically (S2-R3 through S2-R8).
* **S4-R3:** When the user selects a part from the typeahead, cost and sell price populate automatically from the selected part. Cost and sell price display with a $ prefix.
* **S4-R4:** The user can overwrite the populated cost and sell price.
* **S4-R5:** The category field is a select of the shop's part categories. It may be left empty; a part saved with no category is assigned "Uncategorized" (consistent with S2-R11).
* **S4-R6:** The inline row displays a Save action, a "More Options" action, and an X (close) action.
* **S4-R7:** To save, the user must have entered a description, a quantity, a cost, and a sell price. Part number and category are optional.
* **S4-R8:** When the user saves, the part is added at the top of the line's parts list, the success toast from S2-R9 displays, and a new empty inline row opens with the cursor in the description field.
* **S4-R9:** Selecting "More Options" opens the part details modal.
* **S4-R10:** All values already entered in the inline row — description, part number, quantity, category, cost, sell price — carry over into the corresponding fields of the modal.
* **S4-R11:** When the user saves from within the modal ("Save part"), the part is added, the modal closes, and the inline row also closes. No new inline row is opened.
* **S4-R12:** When the user cancels the modal, the modal closes, the inline row closes, and the entered data is discarded.
* **S4-R13:** Pressing Enter from any field saves the row, matching S2-R12.
* **S4-R14:** Pressing Shift+Enter opens the "More Options" modal, so a user can escalate to full detail without reaching for the mouse. _(Amended 2026-08-17.)_
* **S4-R15:** Pressing Tab moves the cursor forward through the row and does not leave it. See _Keyboard Model — Inline Row_ at the end of this section for the full order. _(Amended 2026-08-25.)_
* **S4-R16:** Pressing Escape closes the inline row, matching S2-R14.
* **S4-R17:** If the user clicks anywhere outside the inline row while the row contains data, the row remains open and its data is preserved, matching S2-R16.
* **S4-R18:** The keyboard hint legend (S2-R18) additionally shows: ⇧Enter — more options. This hint is only shown to Full View users.
* **S4-R19:** The Requested flow (S2-R17) applies equally in Full View when no catalog part is selected.
* **S4-R20:** The part number typeahead ends with a "Create <typed text> as a new part" action that opens the part details modal with the typed description carried over. This action is shown to Full View users only; it is not displayed in Tech View. _(Added 2026-08-24.)_
* **S4-N1:** All validation in S2-N1 through S2-N6 applies.
* **S4-N2:** An empty cost is covered by the combined message in S2-N1 ("Enter a cost to save this part."). _(Amended 2026-08-24.)_
* **S4-N3:** An empty sell price is covered by the combined message in S2-N1 ("Enter a sell price to save this part."). _(Amended 2026-08-24.)_
* **S4-N4:** Validation is not enforced when the user selects "More Options." The user may escalate to the modal with an incomplete row, and the modal applies its own validation on save.
* **S4-N5:** If a cost or sell price is not a number, or is negative, the row does not save and the message names the field: "Cost must be a number.", "Cost cannot be negative.", "Sell price must be a number.", "Sell price cannot be negative." _(Added 2026-08-24.)_
* **S4-N6:** If the sell price is lower than the cost, a non-blocking note is displayed in the row: "Sell price is below cost." The row still saves — see S4-E2. _(Added 2026-08-24.)_
* **S4-E1:** If the selected part has no cost or sell price on record, those fields open empty and the user must enter them before saving inline. The user may instead select "More Options" to complete the part in the modal.
* **S4-E2:** A sell price lower than the cost is permitted and does not block saving.
* **S4-E3:** If the work order moves to a status that does not permit editing while the row is open, S2-E3 applies.
* **S4-EH1:** S2-EH1 applies.

### Story 5: Edit Part — Full View — Jira SV-9320

**Prerequisites:** All Story 1 prerequisites met. Work Order View Mode = Full View. The part line being edited already exists.

* **S5-R1:** Selecting Edit on a part line opens the part details modal, pre-populated with the part's current values. _(Amended 2026-08-17.)_
* **S5-R2:** There is no inline edit row for Full View users. The part line is not replaced by an editable row.
* **S5-R3:** Saving from the modal updates the part line and closes the modal. No inline row opens afterward.
* **S5-N1:** If the user does not have 'Work Order Line - Create and Edit' enabled, the Edit control is not displayed.
* **S5-N2:** Cancelling the modal discards changes and leaves the part line unchanged.
* **S5-E1:** If an inline add row is open on the work order and the user selects Edit on an existing part line, S6-R5 applies before the modal opens.

### Story 6: Protecting Unsaved Part Data — Jira SV-9321

Applies to the inline rows in Stories 2, 3, and 4.
**Prerequisites:** An inline add or edit row is open. The row contains data the user entered.

* **S6-R1:** If the user selects X or presses Escape on a row containing data, a confirmation is displayed: Title "Discard this part?", Body "The details you entered will be lost.", Actions "Keep Editing" and "Discard Part", "Keep Editing" is the default focused action. For an edit row (Story 3), the same confirmation is shown with edit wording — Title "Discard these changes?", Body "The changes you made will be lost." Actions and default focus unchanged. _(Added 2026-08-24.)_
* **S6-R2:** Selecting "Keep Editing" closes the confirmation and returns the user to the inline row with all entered data intact.
* **S6-R3:** Selecting "Discard Part" closes the inline row without saving. For an edit row, the part line returns to its previously saved values.
* **S6-R4:** If the user navigates away from the work order — via browser back, browser forward, or in-app navigation — while a row contains data, a confirmation is displayed: Title "Leave without saving?", Body "This part hasn't been added to the work order yet. Leaving will discard it.", Actions "Stay on Work Order" and "Leave", "Stay on Work Order" is the default focused action.
* **S6-R5:** If the user selects "Add Part" on another work order line, or selects Edit on another part line, while a row contains data, the confirmation in S6-R1 is displayed. Selecting "Discard Part" closes the current row and opens the requested one. Selecting "Keep Editing" cancels the request and leaves the current row open and focused.
* **S6-R6:** Only one inline row may be open on a work order at any time.
* **S6-N1:** If the inline row contains no data and the user selects X or presses Escape, the row closes immediately with no confirmation.
* **S6-N2:** If the inline row contains no data and the user navigates away, navigation proceeds immediately with no confirmation.
* **S6-N3:** If an edit row is open and the user has changed nothing, closing it or navigating away proceeds immediately with no confirmation.
* **S6-N4:** If no inline row is open, navigation is unaffected.
* **S6-N5:** Clicking outside the inline row is not treated as navigating away and never triggers a confirmation. The row stays open with its data intact.
* **S6-E1:** If the user successfully saves an inline row and the follow-on empty row (S2-R10 / S4-R8) is left untouched, that empty row does not trigger any confirmation.
* **S6-E2:** Selecting "Leave" on the navigate-away confirmation discards the entered part and completes the navigation the user requested.
* **S6-E3:** Selecting "Stay on Work Order" cancels the navigation, keeps the user on the work order, and returns focus to the inline row with data intact.

### Story 7: Bin Allocation on the Inline Row — Jira TBD

**As a** user adding an inventory part on the inline row, **I want** the system to pick the bin the part will be pulled from and show me that choice, **so that** I can accept or change it without leaving the row.

**Prerequisites:** All Story 1 prerequisites met. An inline add row (Story 2 or Story 4) or an inline edit row (Story 3) is open. The row is linked to a catalog part that has at least one bin. A part with no bins is treated as not stocked and this story does not apply.

* **S7-R1:** Each catalog part carries a set of bins; every bin has a name and an on-hand quantity, and exactly one bin per part is flagged Default.
* **S7-R2:** Typeahead result cards show the total inventory quantity across all bins, then up to three bin chips with per-bin quantity; further bins collapse into a "+ N" chip whose tooltip lists them. A part with no bins shows "Not stocked" in warning styling instead of chips.
* **S7-R3:** Selecting a catalog part allocates the full quantity to a single bin: the Default bin, or — when the Default bin's on-hand is below the quantity — the largest bin whose on-hand covers it. When no single bin covers the quantity, the allocation stays on the Default bin. Allocation is never split automatically.
* **S7-R4:** The allocation is displayed below the row as "Pulled from" followed by a chip. The chip is displayed only while an allocation exists.
* **S7-R5:** The chip label is the bin name for a single-bin allocation, and "N bins" for a split allocation.
* **S7-R6:** Selecting the chip opens a picker listing every bin in catalog order with its on-hand quantity, a check on the current selection, a Default badge where applicable, and warning styling on any bin whose on-hand is below the requested quantity. The picker ends with a "Split across bins…" action.
* **S7-R7:** Choosing a bin from the picker moves the full quantity into that bin and marks the allocation as manually chosen.
* **S7-R8:** Allocating more than a bin's on-hand quantity is permitted. The bin is allowed to go negative; the system warns and does not block.
* **S7-R9:** When the allocated bin's on-hand is below the quantity, the chip is shown in warning styling and this warning is displayed beside it: "Only <on hand> here. Pulling <qty> takes this bin negative."
* **S7-R10:** When auto-allocation moved the quantity off the Default bin, this informational note is displayed beside the chip: "Default bin <name> has <on hand>. Switched to a bin that covers <qty>." It is shown only when S7-R9 does not apply.
* **S7-R11:** Editing the quantity re-runs allocation. If the user manually chose a single bin, that bin is kept and the new quantity is moved into it — it is not re-picked, and S7-R9 applies if the bin no longer covers it. If the allocation was automatic, S7-R3 runs again.
* **S7-R12:** "Split across bins…" opens the Bin Locations modal for Tech View users. For Full View users on the add row it opens the part details modal instead, where a per-bin allocation table replaces the single quantity field and focus lands on the first bin input.
* **S7-R13:** The Bin Locations modal lists one row per bin — name, Default badge, on-hand quantity, allocation input — with an Auto action that redistributes Default-first then largest-first, and an Apply action.
* **S7-R14:** Applying writes the split back to the row and sets the quantity to the sum of the allocations.
* **S7-R15:** Bins already at a negative on-hand quantity are displayed in error styling in the Bin Locations modal. Allocation is not blocked.
* **S7-R16:** The inline edit row carries the same chip, picker, warnings and label format as the add row. Opening the edit row on a part that already has a stored allocation restores it and treats it as manually chosen; otherwise auto-allocation runs. Full View has no inline edit row (S5-R2), so only Tech View reaches this path.
* **S7-R17:** The allocation is stored with the part line on save. It is not displayed on the saved part row. Surfacing it in the part detail panel is out of scope per §2.
* **S7-R18:** The chip is reachable by Tab. See _Keyboard Model — Inline Row_ for its position.
* **S7-N1:** A part with no bins gets no allocation and no chip; the "Pulled from" line is not displayed.
* **S7-N2:** A part not linked to the catalog gets no allocation and no chip.
* **S7-E1:** When the Default bin covers the quantity, no note is shown even if other bins would also cover it.
* **S7-E2:** A split allocation never shows the warning in S7-R9; that warning applies only to a single-bin allocation.

### Keyboard Model — Inline Row

Applies to the inline rows in Stories 2, 3, and 4. Fields the user's view mode does not render are never reached by Tab.

**Tab order — Tech View add row:** 1. Description · 2. Part number · 3. Qty · 4. Save · 5. Cancel (X) · 6. "Pulled from" bin chip — sits in the hint row below, present only while a bin is allocated (S7-R4). Category, cost, sell price, and "More options" are not rendered in Tech View.

**Tab order — Full View add row:** 1. Description · 2. Part number · 3. Qty · 4. Category · 5. Cost · 6. Sell price · 7. Save · 8. Cancel (X) · 9. More options — sits visually to the left of Save, but tabs last of the row's own controls by design · 10. "Pulled from" bin chip — present only while a bin is allocated (S7-R4).

**Tab order — Tech View edit row:** The same order as the Tech View add row: description, part number, qty, Save, Cancel (X), then the "Pulled from" bin chip when one is shown. The edit row has no "More options" button.

**Other keys in the row** (requirements are S2-R12, S2-R14, S4-R13, S4-R14, S4-R16): Enter — saves the row (add row then opens the next empty row; edit row closes, S3-R6). Shift+Enter — opens the part details modal, Full View only. Esc — cancels the row, following S6-R1 when the row contains data.

_(Added 2026-08-25. This is the single source for Tab order; S2-R13 and S4-R15 point here.)_

## 8. User Feedback Summary (messages, verbatim)

New in v16 (Story 7): "Only <on hand> here. Pulling <qty> takes this bin negative." (warning beside the Pulled-from chip; chip turns warning-coloured; saving not blocked, S7-R8) · "Default bin <name> has <on hand>. Switched to a bin that covers <qty>." (informational note beside the chip; shown only when the warning above does not apply). All Story 1–6 messages unchanged from v13.

## 9. Permissions Summary

* Two existing permissions govern this feature; no new permission is introduced.
* **'Work Order Line - Create and Edit'** controls whether the user can add or edit parts at all.
* **'Work Orders → Work Order View Mode'** controls which experience the user gets: Tech View or Full View.
* **Tech View** users get: the Add Part button, the three-field inline add row, the three-field inline edit row. They do not see cost, sell price, category, or the More Options action.
* The Bin Locations modal (S7-R12) is the one modal a Tech View user reaches. It is not the part details modal and exposes no cost, sell price or category. _(Added 2026-08-27.)_
* **Full View** users get: the Add Part button, the six-field inline add row with More Options, and the part details modal for editing. They do not get an inline edit row.

## 10. Feature Flag

* Not behind a feature flag; existing permissions determine what each user sees; the change is additive.

## 11. Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |

**(The §11 Change Log table is EMPTY in v16 — the deltas above were derived by body diff, not from a change log.)**
