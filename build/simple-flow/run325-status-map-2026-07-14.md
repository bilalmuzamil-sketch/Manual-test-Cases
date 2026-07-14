# Simple Flow — Run 325 (Ayesha Khan) Full Status Map — 2026-07-14

> **Run:** 325 = "Simple Flow - Ayesha Khan -> Specs 7/7/2026" (TestRail project 1, suite 1).
> **Pulled:** 2026-07-14 (READ-ONLY via TestRail API `get_tests/325` + `get_results/{test_id}`).
> **Purpose:** canonical per-case cross-reference so any future case-update report can state
> "Ayesha marked C##### <status> — <remark>". This run was created by Ayesha/QA, **NOT** by us —
> never write results to it without explicit permission (CLAUDE.md standing rule 6).

**Snapshot (156 tests):** Passed 48 · Failed 6 · Blocked 13 · Retest 0 · Untested 89.

Status legend: 1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed.
TestRail case link pattern: https://shopview.testrail.io/index.php?/cases/view/<C-ID>

| C-ID | SF-ID | Title | Ayesha status | Ayesha remark |
|---|---|---|---|---|
| C29350 | SF-BULK-01 | Verify the Bulk Receive page has a 'Back To Purchase Orders' link that returns to the PO list | Untested |  |
| C29351 | SF-BULK-02 | Verify the Bulk Receive page groups POs by vendor with a vendor count and per-vendor expand/collapse | Untested |  |
| C29352 | SF-BULK-03 | Verify each PO row shows the PO number, related work order (or inventory/no-WO indicator) and parts count | Untested |  |
| C29353 | SF-BULK-04 | Verify selection behavior: nothing selected by default; selecting a PO selects all its parts; individual parts selectable; actions locked until checked | Untested |  |
| C29354 | SF-BULK-05 | Verify the per-PO 'Receive parts (N)' button is disabled until a vendor invoice number is entered | Untested |  |
| C29355 | SF-BULK-06 | Verify field editability and locking on Bulk Receive (qty and cost editable; sell locks after WO invoiced/paid) | Untested |  |
| C29356 | SF-BULK-07 | Verify assigning a vendor to a Vendor Missing PO moves it into that vendor's group and entering the missing PN enables receiving | Untested |  |
| C29357 | SF-BULK-08 | Verify Receive All receives everything selected at once and supports partial receive | Untested |  |
| C29358 | SF-BULK-09 | Verify Bulk Receive uses the same pipeline as single-PO receive (Delivery → Vendor Bill → QuickBooks) | Untested |  |
| C29359 | SF-BULK-10 | Verify a cored part's Ok/Not OK resolution becomes available once received, and core-only partial receive is supported | Untested |  |
| C29290 | SF-COMP-01 | Verify a Complete Work Order button appears next to New Line on the work order | Passed |  |
| C29291 | SF-COMP-02 | Verify a work order with no parts completes in one confirm and reaches the Success screen | Failed |  |
| C29292 | SF-COMP-03 | Verify the Success screen shows the work order number and total with Done and Go to Invoice actions | Passed |  |
| C29293 | SF-COMP-04 | Verify Go to Invoice from the Success screen opens the Finance step where the invoice number is shown | Passed |  |
| C29294 | SF-COMP-05 | Verify completion is blocked when a required vehicle field is missing | Passed |  |
| C29296 | SF-COMP-07 | Verify in-stock inventory parts decrement inventory and write Part History on simple completion | Passed |  |
| C29297 | SF-COMP-08 | Verify with Auto-pick Inventory OFF the completion modal requires picking parts before Complete | Passed |  |
| C29298 | SF-COMP-09 | Verify adding a new line to a completed work order returns it to Approved | Passed |  |
| C29299 | SF-COMP-10 | Verify individual-line Complete and per-part receive actions still work alongside Simple completion | Passed |  |
| C29300 | SF-COMP-11 | Verify the optional-invoice completion wizard offers Receive Parts, Complete Without Receiving and Cancel | Passed |  |
| C29301 | SF-COMP-12 | Verify the optional-invoice modal creates POs in the background and shows the count of parts to receive | Passed |  |
| C29302 | SF-COMP-13 | Verify Receive Parts opens the shared Accept Delivery page to receive all vendors at once | Passed |  |
| C29303 | SF-COMP-14 | Verify Complete Without Receiving completes the WO, keeps unreceived parts waiting, and keeps the line Receive button | Passed |  |
| C29304 | SF-COMP-15 | Verify Cancel closes the completion modal with no change and no duplicate POs on re-open | Passed |  |
| C29305 | SF-COMP-16 | Verify the completion modal collects the missing required vehicle fields (Mileage and Engine Hours; no VIN field in the modal) | Passed |  |
| C29306 | SF-COMP-17 | Verify the optional-invoice flow reaches the Success screen with WO number and total | Passed |  |
| C29307 | SF-COMP-18 | Verify the required-invoice wizard disables Complete until parts are received and offers no skip option | Passed |  |
| C29308 | SF-COMP-19 | Verify the required-invoice receive round-trip returns to the modal and enables Complete once all received | Passed |  |
| C29309 | SF-COMP-20 | Verify Cancel in the required-invoice wizard makes no change to the work order | Passed |  |
| C29310 | SF-COMP-21 | Verify on a required-invoice work order an unapproved line disables the Complete Work Order button with a tooltip | Passed | <p><img src="index.php?/attachments/get/1000020877#_t=1783735037642444" class="fr-fic fr-dib fr-fil markdown-img" width="300" id="attachment-1000020877" data-attachment-id="1000020877" data-original-src="index.php?/attachments/get/1000020877"></p> |
| C29311 | SF-COMP-22 | Verify a manually unapproved line disables the required-invoice Complete Work Order button with a tooltip even when Auto-approve is ON | Passed |  |
| C29312 | SF-COMP-23 | Verify re-running completion after a prior attempt does not create duplicate POs | Passed |  |
| C29313 | SF-CORE-01 | Verify inventory cores are resolved via a line-level Ok/Not-OK control (no distinct Resolve-Cores wizard step) | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29314 | SF-CORE-02 | Verify a work order with no cores completes with no core sub-lines and no Resolve-Cores wizard step | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29315 | SF-CORE-03 | Verify special-order cores leave the optional-invoice completion unchanged and Complete Without Receiving stays available | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29316 | SF-CORE-04 | Verify the invoice shows a 'Cores pending' flag when unresolved special-order cores exist | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29317 | SF-CORE-05 | Verify resolving cores at the Create Invoice gate routes to receive the cored line then lets invoicing proceed | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29318 | SF-CORE-06 | Verify cancelling the invoice-gate core resolution leaves the WO completed, un-invoiced and cores-pending | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29319 | SF-CORE-07 | Verify special-order cores are resolved after the required-invoice Receive round-trip before Complete | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29320 | SF-CORE-08 | Verify the invoice gate detects an unresolved special-order core that exists only as a PartRequest | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29321 | SF-CORE-09 | Verify part-sale work orders auto-resolve cores at receive while service work orders require manual Ok/Not OK | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29322 | SF-CORE-10 | Verify the core '+$ to invoice' amount is shown at the line level as a core is marked Not-OK (no Resolve-Cores wizard total) | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29360 | SF-INV-01 | Verify each vendor group has an 'Apply to selected POs' control enabled only with an invoice # and ≥1 PO selected | Untested |  |
| C29361 | SF-INV-02 | Verify Apply pre-fills one invoice number into only the selected POs of that vendor, still editable per PO | Untested |  |
| C29362 | SF-INV-03 | Verify Apply Invoice is scoped per vendor, not offered for the vendorless group, and allows a reused invoice number | Untested |  |
| C29405 | SF-PERM-01 | Verify only owner/admin can view and modify Work Order settings (non-admin blocked) | Untested |  |
| C29406 | SF-PERM-02 | Verify which roles can complete a work order (Simple completion) | Untested |  |
| C29407 | SF-PERM-03 | Verify which roles can perform Bulk Receive | Untested |  |
| C29408 | SF-PERM-04 | Verify which roles can Mark Reviewed (sign off) | Untested |  |
| C29409 | SF-PERM-05 | Verify the PO Receive button is hidden for office/readonly users | Untested |  |
| C29410 | SF-PERM-06 | Verify permission gating of Simple-Flow settings and work-order actions (UI gating is the v1 pass criterion) | Untested |  |
| C29411 | SF-PERM-07 | Verify review sign-off is governed by the Review Work Orders custom-role permission (not open to all) | Untested |  |
| C29412 | SF-PERM-08 | Verify a user who holds the Mark Reviewed permission can Mark Reviewed a work order they completed | Untested |  |
| C29413 | SF-PERM-09 | Verify a Technician cannot add a vendorless / no-part-number part (lacks See Financial Data) | Untested |  |
| C29414 | SF-PERM-10 | Verify the Complete Work Order action follows the per-role completion permission matrix | Untested |  |
| C29363 | SF-PNFIX-01 | Verify a no-number part shows 'Missing part number' with Edit → enter → save that persists immediately | Untested |  |
| C29364 | SF-PNFIX-02 | Verify entering a NEW part number creates a new inventory/catalog part with stock and Part History on receive | Untested |  |
| C29365 | SF-PNFIX-03 | Verify entering an EXISTING part number links to that item and updates stock/cost/history without overwriting description or category | Untested |  |
| C29366 | SF-PNFIX-04 | Verify inline part-number field-locking rules match the receive-screen rules (sell locks after invoiced/paid) | Untested |  |
| C29367 | SF-PNFIX-05 | Verify a part cannot be received without a part number, a vendor (for vendor-missing) and a cost / sell price, even on an invoiced/paid WO | Untested |  |
| C29368 | SF-PNFIX-06 | Verify the inline part-number save drives real catalog creation/linking, inventory stock and Part History (not just a stored string) | Untested |  |
| C29344 | SF-POSEL-01 | Verify the PO list has a select-all checkbox and per-PO checkboxes | Passed |  |
| C29345 | SF-POSEL-02 | Verify selecting POs shows a bar with 'N purchase orders selected', Clear and Receive Selected | Passed |  |
| C29346 | SF-POSEL-03 | Verify Receive Selected opens the PO Bulk Receive page carrying the selected POs | Passed |  |
| C29347 | SF-POSEL-04 | Verify fulfilled (already-received) POs are not selectable | Blocked | <p>The fulfilled parts are not list in Parts > Purchase Orders</p> |
| C29348 | SF-POSEL-05 | Verify Vendor Missing POs are selectable and clearly indicated in the list | Passed |  |
| C29349 | SF-POSEL-06 | Verify select-all only toggles POs on the current page/filter | Passed |  |
| C29426 | SF-QB-01 | Verify in-stock parts decrement inventory and write Part History on simple completion (skip path still runs lifecycle) | Untested |  |
| C29427 | SF-QB-02 | Verify Create POs OFF produces no PO, vendor bill or AP sync and no catalog/inventory sync | Untested |  |
| C29428 | SF-QB-03 | Verify POs ON plus receiving runs the full pipeline: receive → Delivery → Vendor Bill → QuickBooks (both surfaces sync) | Untested |  |
| C29429 | SF-QB-04 | Verify a vendorless / no-PN part has zero inventory interaction until a vendor and/or part number is added | Untested |  |
| C29430 | SF-QB-05 | Verify Vendor Missing POs are excluded from QuickBooks until a vendor and part number are provided | Untested |  |
| C29431 | SF-QB-06 | Verify cost at completion behavior to avoid $0-cost margins in QuickBooks | Untested |  |
| C29432 | SF-QB-07 | Verify the Journal Entry / Inventory sync to QuickBooks fires on invoice creation (not PO-dependent) | Untested |  |
| C29433 | SF-QB-08 | Verify Inventory Part History is preserved for any part that becomes inventory-tracked | Untested |  |
| C29369 | SF-RCV-01 | Verify a Receive action appears on WO-originated POs in both the PO list and the PO detail card | Untested |  |
| C29370 | SF-RCV-02 | Verify the Receive action opens the shared Accept Delivery surface | Untested |  |
| C29371 | SF-RCV-03 | Verify the Receive action is hidden for office/readonly users and for fulfilled POs | Untested |  |
| C29372 | SF-RCV-04 | Verify the existing Accept Delivery screen groups by vendor with per-group invoice #, date, tax, note and Receive | Untested |  |
| C29373 | SF-RCV-05 | Verify new vendorless/no-PN WO parts and WO-originated POs appear and are receivable on Accept Delivery, with the vendor-missing group at the top | Untested |  |
| C29374 | SF-RCV-06 | Verify Accept Delivery receive gates: vendor set, part number entered, cost / sell price entered, vendor invoice # captured | Untested |  |
| C29375 | SF-RCV-07 | Verify Accept Delivery shows a '+N' vendor indicator and leads with the vendor-missing group | Untested |  |
| C29376 | SF-RCV-08 | Verify each vendor group produces its own vendor bill and separate AP entry in QuickBooks | Untested |  |
| C29377 | SF-RCV-09 | Verify a 'received more than ordered' warning appears when received quantity exceeds ordered quantity | Untested |  |
| C29386 | SF-REV-01 | Verify the Require Review setting drives the review flow when turned on | Untested |  |
| C29387 | SF-REV-02 | Verify the completion action reads 'Send To Review' when Require Review is on | Untested |  |
| C29388 | SF-REV-03 | Verify the Details step collects only mileage and engine hours when review is on (VIN captured later by reviewer) | Untested |  |
| C29389 | SF-REV-04 | Verify 'Receive Parts' routes to the shared receive page (no inline modal) in the review flow | Untested |  |
| C29390 | SF-REV-05 | Verify Send to Review moves the WO to Review (amber) with a 'Ready for Review' banner and locks lines to Complete | Untested |  |
| C29391 | SF-REV-06 | Verify the Mark Reviewed dialog captures VIN (required) and disables Confirm until VIN is entered | Untested |  |
| C29392 | SF-REV-07 | Verify on Send to Review lines lock to Complete and inventory is auto-picked | Untested |  |
| C29393 | SF-REV-08 | Verify Confirm Review signs off and completes the work order directly (no distinct Reviewed holding state) | Untested |  |
| C29394 | SF-REV-09 | Verify Mark Reviewed is gated by the Review Work Orders permission and disabled for a role without it | Untested |  |
| C29395 | SF-REV-10 | Verify the Mark Reviewed dialog includes VIN / Serial # (required) with no review note field | Untested |  |
| C29396 | SF-REV-11 | Verify sign-off completes the work order directly (no separate final Complete) and invoicing is blocked until reviewed | Untested |  |
| C29397 | SF-REV-12 | Verify a 'Ready for Review' list filter/column surfaces the reviewer queue | Untested |  |
| C29398 | SF-REV-13 | Verify all lines must be approved before Send To Review (the 'Send To Review' action is disabled until every line is approved) | Untested |  |
| C29399 | SF-REV-14 | Verify cores are resolved per rules before sign-off and invoicing is blocked until both Reviewed and all cores resolved | Untested |  |
| C29400 | SF-REV-15 | Verify the Require Review default for new vs existing orgs matches the agreed cohort rule | Untested |  |
| C29275 | SF-SET-01 | Verify the Work Orders settings tab lists all Work Order setting toggles in order | Passed |  |
| C29276 | SF-SET-02 | Verify there is no operating-mode selector and no VIN-required setting on the Work Order settings page | Passed |  |
| C29278 | SF-SET-04 | Verify the Require Vendor Invoice Number toggle is present with helper text and drives Optional vs Required completion | Untested |  |
| C29279 | SF-SET-05 | Verify Auto-approve Lines ON approves a work-order line the moment it is added | Passed |  |
| C29280 | SF-SET-06 | Verify Auto-approve Lines OFF leaves a new line in Needs Approval with Approve/Decline actions | Passed |  |
| C29281 | SF-SET-07 | Verify existing settings (tech story, mileage, engine hours, auto-pick) display the org's current values | Untested |  |
| C29283 | SF-SET-09 | Verify saving a settings change persists after page reload | Untested |  |
| C29284 | SF-SET-10 | Verify a settings change applies to future completions only and not to already-completed work orders | Failed | <p>As discussed with Milos. The specs will be updates. <a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8303" data-pasted="true">https://shopview.atlassian.net/browse/SV-8303</a></p> |
| C29285 | SF-SET-11 | Verify a non-admin user cannot see or modify the Work Order settings | Untested |  |
| C29286 | SF-SET-12 | Verify the settings model contains no operatingMode field and no requireVin setting | Untested |  |
| C29287 | SF-SET-13 | Verify the Save Settings button is only enabled when there is an unsaved change | Passed | <p>Save Settings button is always clickable</p> |
| C29288 | SF-SET-14 | Verify the Require Review Before Completion toggle is present on the settings page and drives the review flow | Passed |  |
| C29289 | SF-SET-15 | Verify every Work Order setting toggle has descriptive helper text | Passed |  |
| C29323 | SF-TECH-01 | Verify each work order line shows a Story sub-row with an 'Add tech story for this line' link when empty | Passed | <p>But the tech story sub- row is visible when the tech story is not a required field</p> |
| C29324 | SF-TECH-02 | Verify with Require tech story ON every line needs a story before the work order can complete | Failed | <p><a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8302" data-pasted="true">https://shopview.atlassian.net/browse/SV-8302</a></p> |
| C29325 | SF-TECH-03 | Verify Complete opens the tech-story modal first and then chains into completion (order: tech story → parts → complete) | Passed | <p><a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8302" data-pasted="true">https://shopview.atlassian.net/browse/SV-8302</a></p> |
| C29326 | SF-TECH-04 | Verify the tech-story modal structure (header, per-line card, Line X of N, required textarea, disabled Next) | Passed |  |
| C29327 | SF-TECH-05 | Verify multi-line tech-story navigation (Back after line 1, Continue/Save on the last line) | Passed |  |
| C29328 | SF-TECH-06 | Verify a saved tech story renders inline with a green check, the text and an Edit link | Passed |  |
| C29329 | SF-TECH-07 | Verify the tech-story modal has a text box for typing the story | Passed |  |
| C29330 | SF-TECH-08 | Verify tech story is captured both inline and via the gate modal (Story 17 supersedes on-the-line-only wording) | Passed |  |
| C29401 | SF-UX-01 | Verify the work order primary button reads 'Create Work Order' | Untested |  |
| C29402 | SF-UX-02 | Verify required fields at completion appear in a centralized center modal and the tech story is NOT in that modal | Untested |  |
| C29403 | SF-UX-03 | Verify the success screen shows WO number and total with Done and Go to Invoice, and the invoice number is on the Finance step | Untested |  |
| C29404 | SF-UX-04 | Verify the close-confirmation modal behavior (Close = closes modal only; Cancel = closes modal + returns to previous screen) | Untested |  |
| C29415 | SF-VAL-01 | Verify completion is blocked when required mileage is missing | Untested |  |
| C29416 | SF-VAL-02 | Verify completion is blocked when a required VIN is missing (non-review No-PO / Optional-invoice flow) | Untested |  |
| C29417 | SF-VAL-03 | Verify completion is blocked when required engine hours are missing | Untested |  |
| C29418 | SF-VAL-04 | Verify the tech-story Next/Continue button stays disabled while the story textarea is empty | Untested |  |
| C29419 | SF-VAL-05 | Verify a required-invoice receive is blocked without a vendor invoice number | Untested |  |
| C29420 | SF-VAL-06 | Verify a vendor-missing part cannot be received without a vendor, a part number, and a cost / sell price | Untested |  |
| C29421 | SF-VAL-07 | Verify Confirm Review is disabled until a VIN is entered in the Mark Reviewed dialog | Untested |  |
| C29422 | SF-VAL-08 | Verify re-completing after cancelling does not create duplicate POs | Untested |  |
| C29423 | SF-VAL-09 | Verify the sell field is locked after the work order is invoiced/paid with a lock icon and tooltip | Untested |  |
| C29424 | SF-VAL-10 | Verify the same vendor invoice number can be reused across POs (uniqueness relaxed) | Untested |  |
| C29425 | SF-VAL-11 | Verify an unapproved line disables the Complete Work Order button with a tooltip (regardless of the Require Vendor Invoice Number setting) | Untested |  |
| C29378 | SF-VEND-01 | Verify the vendor-missing group provides a vendor dropdown that assigns a vendor at PO level and saves it | Untested |  |
| C29379 | SF-VEND-02 | Verify assigning a vendor already on this PO prompts 'Add to {vendor}?' with Merge vs Keep Separate | Untested |  |
| C29380 | SF-VEND-03 | Verify assigning a vendor that is on another PO for the same WO prompts to merge the POs | Untested |  |
| C29381 | SF-VEND-04 | Verify assigning a different vendor with no collision auto-assigns and clears the QB flag, and Receive enables only once the part number and cost / sell price are also present | Untested |  |
| C29382 | SF-VEND-05 | Verify vendor matching is by ID (not name), merge is scoped to the same WO, and receiving is blocked when the WO is invoiced/paid | Untested |  |
| C29338 | SF-VMIS-01 | Verify a vendorless vendor-part goes onto the work order's normal PO with no separate dummy PO | Passed |  |
| C29339 | SF-VMIS-02 | Verify a 'Vendor Missing +N' indication shows on the PO list and PO detail | Passed |  |
| C29340 | SF-VMIS-03 | Verify a Vendor Missing PO is flagged and excluded from QuickBooks sync | Blocked |  |
| C29341 | SF-VMIS-04 | Verify a Vendor Missing PO offers options to select a vendor and enter/edit the part number | Passed |  |
| C29342 | SF-VMIS-05 | Verify the Vendor Missing flag clears once both a vendor and a part number are provided | Passed |  |
| C29343 | SF-VMIS-06 | Verify reports mark Vendor Missing POs as 'needs vendor' | Blocked | <p>I can't find any report for POs that says 'needs vendor'<br>In Parts > Purchase Orders - It shows 'Vendor Missing'</p><p><img src="index.php?/attachments/get/1000021888#_t=1783985745217716" class="fr-fic fr-dib fr-fil markdown-img" width="300" id="attachment-1000021888" data-attachment-id="1000021888" data-original-src="index.php?/attachments/get/1000021888"></p> |
| C29331 | SF-VPART-01 | Verify a vendorless part can be requested with description, quantity and category (part number, cost, vendor and sell price left empty) | Failed | <p>The sell price is being enforced when the admin tries to request a part. The sell price can be empty when adding via a canned line.</p><p><a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8273?focusedCommentId=73286" data-pasted="true">https://shopview.atlassian.net/browse/SV-8273?focusedCommentId=73286</a></p> |
| C29332 | SF-VPART-02 | Verify adding a part is blocked when description, quantity or category is missing (sell price not enforced) | Failed | <p><img src="index.php?/attachments/get/1000021801#_t=1783980648656594" class="fr-fic fr-dib fr-fil markdown-img" width="300" id="attachment-1000021801" data-attachment-id="1000021801" data-original-src="index.php?/attachments/get/1000021801"></p><p>saving is NOT allowed when sell price is empty. It has to be at least $0.01. All toggles are disabled in Settings > Work orders:</p><p><img src="index.php?/attachments/get/1000021800#_t=1783980616782372" class="fr-fic fr-dib fr-fil markdown-img" w... |
| C29333 | SF-VPART-03 | Verify a vendorless part's type uses the existing source field (vendor or found) and never inventory | Passed |  |
| C29334 | SF-VPART-04 | Verify a vendorless part is editable after creation | Passed | <p>If you don't add vendor and cost, then make changes to the qty and description, it will say 'cost is required' after saving the changes.</p> |
| C29335 | SF-VPART-05 | Verify a no-part-number part creates no inventory item and no Part History | Passed |  |
| C29336 | SF-VPART-06 | Verify adding a part number and vendor later transitions the part out of vendorless | Failed | <p>The system is behaving as the simple flow is enabled for all users. No toggles are enable din settings > work orders but I am still not able to see the same results as production. Created a ticket for clarification: <a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8314" data-pasted="true">https://shopview.atlassian.net/browse/SV-8314</a></p> |
| C29337 | SF-VPART-07 | Verify a vendorless / no-PN part cannot be received until a part number (and vendor) is entered | Passed |  |
| C29383 | SF-WOP-01 | Verify an optional 'Waiting on Parts' column can be enabled from the column selector and shows the unreceived-parts count per WO | Untested |  |
| C29384 | SF-WOP-02 | Verify clicking the Waiting on Parts count opens Accept Delivery for the WO's first unreceived PO | Untested |  |
| C29385 | SF-WOP-03 | Verify a work order with nothing to receive shows '—' with no link in the Waiting on Parts column | Untested |  |

## Actionable subset — Passed / Failed / Blocked / Retest only (with remarks)

| C-ID | SF-ID | Ayesha status | Ayesha remark |
|---|---|---|---|
| C29290 | SF-COMP-01 | Passed |  |
| C29291 | SF-COMP-02 | Failed |  |
| C29292 | SF-COMP-03 | Passed |  |
| C29293 | SF-COMP-04 | Passed |  |
| C29294 | SF-COMP-05 | Passed |  |
| C29296 | SF-COMP-07 | Passed |  |
| C29297 | SF-COMP-08 | Passed |  |
| C29298 | SF-COMP-09 | Passed |  |
| C29299 | SF-COMP-10 | Passed |  |
| C29300 | SF-COMP-11 | Passed |  |
| C29301 | SF-COMP-12 | Passed |  |
| C29302 | SF-COMP-13 | Passed |  |
| C29303 | SF-COMP-14 | Passed |  |
| C29304 | SF-COMP-15 | Passed |  |
| C29305 | SF-COMP-16 | Passed |  |
| C29306 | SF-COMP-17 | Passed |  |
| C29307 | SF-COMP-18 | Passed |  |
| C29308 | SF-COMP-19 | Passed |  |
| C29309 | SF-COMP-20 | Passed |  |
| C29310 | SF-COMP-21 | Passed | <p><img src="index.php?/attachments/get/1000020877#_t=1783735037642444" class="fr-fic fr-dib fr-fil markdown-img" width="300" id="attachment-1000020877" data-attachment-id="1000020877" data-original-src="index.php?/attachments/get/1000020877"></p> |
| C29311 | SF-COMP-22 | Passed |  |
| C29312 | SF-COMP-23 | Passed |  |
| C29313 | SF-CORE-01 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29314 | SF-CORE-02 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29315 | SF-CORE-03 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29316 | SF-CORE-04 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29317 | SF-CORE-05 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29318 | SF-CORE-06 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29319 | SF-CORE-07 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29320 | SF-CORE-08 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29321 | SF-CORE-09 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29322 | SF-CORE-10 | Blocked | <p>Core parts still have issues and the the team is working on it. Marking the core related test cases as Blocked for now.</p> |
| C29344 | SF-POSEL-01 | Passed |  |
| C29345 | SF-POSEL-02 | Passed |  |
| C29346 | SF-POSEL-03 | Passed |  |
| C29347 | SF-POSEL-04 | Blocked | <p>The fulfilled parts are not list in Parts > Purchase Orders</p> |
| C29348 | SF-POSEL-05 | Passed |  |
| C29349 | SF-POSEL-06 | Passed |  |
| C29275 | SF-SET-01 | Passed |  |
| C29276 | SF-SET-02 | Passed |  |
| C29279 | SF-SET-05 | Passed |  |
| C29280 | SF-SET-06 | Passed |  |
| C29284 | SF-SET-10 | Failed | <p>As discussed with Milos. The specs will be updates. <a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8303" data-pasted="true">https://shopview.atlassian.net/browse/SV-8303</a></p> |
| C29287 | SF-SET-13 | Passed | <p>Save Settings button is always clickable</p> |
| C29288 | SF-SET-14 | Passed |  |
| C29289 | SF-SET-15 | Passed |  |
| C29323 | SF-TECH-01 | Passed | <p>But the tech story sub- row is visible when the tech story is not a required field</p> |
| C29324 | SF-TECH-02 | Failed | <p><a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8302" data-pasted="true">https://shopview.atlassian.net/browse/SV-8302</a></p> |
| C29325 | SF-TECH-03 | Passed | <p><a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8302" data-pasted="true">https://shopview.atlassian.net/browse/SV-8302</a></p> |
| C29326 | SF-TECH-04 | Passed |  |
| C29327 | SF-TECH-05 | Passed |  |
| C29328 | SF-TECH-06 | Passed |  |
| C29329 | SF-TECH-07 | Passed |  |
| C29330 | SF-TECH-08 | Passed |  |
| C29338 | SF-VMIS-01 | Passed |  |
| C29339 | SF-VMIS-02 | Passed |  |
| C29340 | SF-VMIS-03 | Blocked |  |
| C29341 | SF-VMIS-04 | Passed |  |
| C29342 | SF-VMIS-05 | Passed |  |
| C29343 | SF-VMIS-06 | Blocked | <p>I can't find any report for POs that says 'needs vendor'<br>In Parts > Purchase Orders - It shows 'Vendor Missing'</p><p><img src="index.php?/attachments/get/1000021888#_t=1783985745217716" class="fr-fic fr-dib fr-fil markdown-img" width="300" id="attachment-1000021888" data-attachment-id="1000021888" data-original-src="index.php?/attachments/get/1000021888"></p> |
| C29331 | SF-VPART-01 | Failed | <p>The sell price is being enforced when the admin tries to request a part. The sell price can be empty when adding via a canned line.</p><p><a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8273?focusedCommentId=73286" data-pasted="true">https://shopview.atlassian.net/browse/SV-8273?focusedCommentId=73286</a></p> |
| C29332 | SF-VPART-02 | Failed | <p><img src="index.php?/attachments/get/1000021801#_t=1783980648656594" class="fr-fic fr-dib fr-fil markdown-img" width="300" id="attachment-1000021801" data-attachment-id="1000021801" data-original-src="index.php?/attachments/get/1000021801"></p><p>saving is NOT allowed when sell price is empty. It has to be at least $0.01. All toggles are disabled in Settings > Work orders:</p><p><img src="index.php?/attachments/get/1000021800#_t=1783980616782372" class="fr-fic fr-dib fr-fil markdown-img" w... |
| C29333 | SF-VPART-03 | Passed |  |
| C29334 | SF-VPART-04 | Passed | <p>If you don't add vendor and cost, then make changes to the qty and description, it will say 'cost is required' after saving the changes.</p> |
| C29335 | SF-VPART-05 | Passed |  |
| C29336 | SF-VPART-06 | Failed | <p>The system is behaving as the simple flow is enabled for all users. No toggles are enable din settings > work orders but I am still not able to see the same results as production. Created a ticket for clarification: <a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-8314" data-pasted="true">https://shopview.atlassian.net/browse/SV-8314</a></p> |
| C29337 | SF-VPART-07 | Passed |  |
