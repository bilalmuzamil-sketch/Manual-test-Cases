# Simple Flow V2 — Source-Verification Diff for the 22 not-yet-rediffed cases

## 1 · Spec currency (checked LIVE 2026-09-09)

- **Page:** Confluence 771391574 "Simple Flow V2", space PM, status `current`, author/reporter **Milos Vasic**.
- **Last modified:** yesterday, 2026-09-08 at 3:47 PM (today is 2026-09-09).
- **Most recent Change-Log entry (verbatim):** `2026-09-08 | Milos Vasic | QA handoff folded in. Story 2 rewritten: Require approval for new lines governs new lines only ... Stories 13 and 14 specify creating a vendor ... Stories 5 and 18: Create invoice is refused while any line is in Needs Approval, and a declined line never blocks it. Story 7 separates the line and parts action groups, adds the dividers and Deselect all. Story 17 states the receive step has one action`.
- **Verdict on currency:** The page is **STILL the 8 September 2026 revision** — it has **not** moved again since the prior pass. (The cases' provenance line names "specification version 23 ... read on 21 August 2026"; the spec has since advanced through the 2026-09-08 change-log entry, so the version stamp on all 22 cases is stale regardless of the content verdict.)
- **Jira cross-check (live):** SV-9252 / SV-9256 / SV-9262 / SV-9266 / SV-9267 all fetched — every story description is a **short pointer to this spec page** ("Simple Flow V2 → Story N"), so the spec page body IS the authoritative merged story text used below. **SV-8183** (permission map) fetched live and matches the Story-21 case mappings.

## 2 · Summary

| | Count | C-ids |
|---|---|---|
| **Total assessed** | 22 | C44566, C44567, C44568, C44569, C44570, C44575, C44576, C44577, C44578, C44579, C44580, C44581, C44582, C44594, C44602, C44603, C44604, C44605, C44606, C44607, C44608, C44609 |
| **UNCHANGED** | 21 | C44566, C44567, C44568, C44569, C44570, C44575, C44576, C44577, C44578, C44579, C44580, C44581, C44582, C44594, C44602, C44603, C44605, C44606, C44607, C44608, C44609 |
| **UPDATE** | 1 | **C44604** — case Expected says the Undo action was removed (2026-09-04); the current 2026-09-08 spec still mandates that a reorder drop "can be undone" |

Note: C44575, C44604, C44605 carry `custom_atmstatus = 3` (a different author / HTML-formatted, terse one-sentence Expecteds) — the others are the standard plain-numbered lane cases. Any downstream edit must respect Rule 71 (Automated cases held for the QA lead) and Rule 38 (Vladimir's cases never changed) — confirm authorship before touching C44575/C44604/C44605.

---

## 3 · Per-case disposition

### Story 6 — SV-9252 "Which actions appear on a line and on a part"

**C44566** · Story 6 · **UNCHANGED**
Spec line-action lists match one-for-one: "Needs Approval: Approve, Decline, Request part, Delete line ... Approved: Decline, Authorization required, Complete, Request part, Delete line ... Declined: Approve, Authorization required, Request part, Delete line ... Complete: Decline, Authorization required, Uncomplete". Also verbatim: "Where an action is not listed it is not visible, on the line or in the bulk action bar" and "Complete is not offered on a Needs Approval line and Approve is not offered on a line that is already Approved. Both are offered today and neither does anything."

**C44567** · Story 6 · **UNCHANGED**
Spec verbatim: "Decline stays visible but disabled while the line holds parts that were received or picked, with the reason *Return this line's received parts before declining it*." Matches both Expected points.

**C44568** · Story 6 · **UNCHANGED**
Spec part-state list matches: "Requested — ... Nothing on the row ... It is still counted in the bulk bar's Order (n) ... Quoted: Order ... Auth to order: Order ... In Stock and not picked: Pick ... Awaiting: Receive, with *Received later* behind its caret when receiving is required ... Received later: nothing on the row, Receive in the … menu ... Received or picked: nothing. The part is finished ... Returned: nothing. The part has been sent back and stays visible on the line and in returns."

**C44569** · Story 6 · **UNCHANGED**
Spec verbatim: "With ordering required, Receive does not appear until the part has been ordered, and the two are never offered at once for the same part"; "With receiving not required, Receive moves from the part row into the part's … menu. It is never removed outright"; "Ordering a Requested part only does something when the part is vendor-sourced, which includes a vendorless part marked *Vendor missing*. An inventory or found part, or one with no source at all, needs its details completed first."

**C44570** · Story 6 · **UNCHANGED**
Spec verbatim: "Only In Stock, Quoted, Auth to order and Awaiting parts are moved back to Quoted"; "A Requested part is left where it is, and so are Received and Returned parts"; "Parts that were received or picked are not touched by a line status change, and no stock moves because of one"; "Declining a line does not remove its parts from a purchase order. Only deleting a part does that"; "A part action the user's role does not carry is absent even when the part's state qualifies. Pick follows Pick Parts, Order follows Order Parts."

### Story 8 — SV-9254 "Bulk approve and decline"

**C44575** · Story 8 · **UNCHANGED** (atm=3)
Expected: "The already-Approved line is unchanged and the Declined line is STILL Declined." Spec verbatim: "A declined line is never swept up by a bulk action ... it is left alone by Approve and by Authorization required, and it is not in either count"; "Approve counts lines in Needs Approval" (so an already-Approved line is not acted on). Matches.

**C44576** · Story 8 · **UNCHANGED**
Spec negative-cases verbatim: "A selection of four lines where one holds received parts declines three and reports the fourth. It does not refuse all four"; "Lines already in the target status are skipped silently and were never in the count"; "A selection made up entirely of declined lines shows no Approve button at all, because the count would be zero."

### Story 9 — SV-9255 "Bulk complete lines"

**C44577** · Story 9 · **UNCHANGED**
Spec verbatim: "The label is Complete line for one, Complete lines (n) for several, and Complete all lines when the selection covers every open line"; "The count is of Approved lines in the selection. Nothing else is counted"; "Where something outstanding can be collected, such as a tech story or a mileage reading, the action opens the completion wizard rather than failing"; "Completing the last open lines stops there. No invoice is created and the user is not navigated anywhere"; "With review required, this is the action that makes Mark as reviewed appear, because the review needs every line complete first."

### Story 10 — SV-9256 "Bulk delete lines" (deferred)

**C44578** · Story 10 · **UNCHANGED** — deferral still in force
Spec verbatim: "⚠ Follow-up, not in this release. Bulk deletion is out of scope for Simple Flow V2 ... The bulk action bar carries no delete action while this is deferred"; "Deletion rules and roles are unchanged from V1". Confirms all three Expected points; the spec still defers bulk delete.

### Story 11 — SV-9257 "Bulk order parts"

**C44579** · Story 11 · **UNCHANGED**
Spec verbatim: "Bulk Order runs the existing single-part order once per selected part ... decided by the existing path"; "A selection spanning two vendors produces a purchase order per vendor. A vendor with an open purchase order on this work order has its parts added to it"; "Requested parts are included and counted ... moves it straight to Awaiting"; "A part with no vendor is ordered like any other ... the purchase order is created and marked Vendor missing, and it simply does not sync to QuickBooks until somebody assigns a vendor"; "Ordering asks for confirmation first, because a purchase order is a commitment to a supplier and the action cannot be undone."

**C44580** · Story 11 · **UNCHANGED**
Spec negative-cases verbatim: "A part that is already ordered is excluded from the count and is not named in the result"; "Only vendor-sourced parts are placed. An inventory or found part, or one with no source at all, is skipped and therefore never counted — it is picked instead, or it needs its details completed first"; "A user without Order Parts does not see the action, in the bulk bar or on the row."

### Story 12 — SV-9258 "Bulk pick parts"

**C44581** · Story 12 · **UNCHANGED**
Spec verbatim: "Bulk picking runs the existing pick. The inventory movement, the bin it comes from and the history entry are identical to picking one part"; "All picks in one run succeed or fail together, so a partial result never leaves stock half-moved"; "Pick is offered whenever a part is In Stock and unpicked, whatever the setting says"; "A picked part asks its core question at the moment it is picked, exactly as it does today, gated by WO Lines: Create & Edit."

**C44582** · Story 12 · **UNCHANGED**
Spec verbatim: "A user without Pick Parts does not see the action."

### Story 16 — SV-9262 "When the completion wizard opens"

**C44594** · Story 16 · **UNCHANGED**
Spec verbatim entry points: "Complete on a line ... Complete lines in the bulk bar ... Complete all lines ... Create invoice ... Clock out and complete" and "Mark as reviewed never opens it"; "It opens only when something required is both outstanding and collectable. If nothing is, the action completes immediately and no wizard appears"; "What counts as collectable is a missing tech story, a missing mileage or engine hours reading, an unpicked inventory part, an unresolved core, or an unreceived part"; "The run records which lines it covers and whether it is on its way to an invoice. Both are fixed when the run opens"; "A step the user's role cannot perform is not shown. Where that step is the only outstanding work, the action fails with the reason instead of opening an empty wizard."

### Story 19 — SV-9265 "Part rows and menus"

**C44602** · Story 19 · **UNCHANGED**
Spec verbatim: "The part's … menu contains Move, Return, Add part fee or discount, and Receive part, the last only when receiving is optional and always at the bottom"; "The line's … menu contains Request part, Uncomplete line, Add line note, Save as canned line, Edit labour, Receive parts (n) when receiving is optional and the line has parts waiting, and Authorization required"; "Uncomplete is existing behaviour and is already blocked once the work order is invoiced or paid. The same block applies in the bulk action bar so the two cannot drift apart."

**C44603** · Story 19 · **UNCHANGED**
Spec negative-cases verbatim: "Request part is hidden on a completed line"; "Uncomplete line appears only on a completed line"; "Receive part is absent for a user without Order Parts, whatever the setting."

### Story 20 — SV-9266 "Reordering parts on a line"

**C44604** · Story 20 · **UPDATE** (atm=3)
- **(a) Field:** Expected Results.
- **(b) What is now wrong:** The case Expected states "the confirmation toast is informational only (the Undo action was removed on user request, 2026-09-04)." The current 2026-09-08 spec does **not** reflect any Undo removal — it still mandates that a reorder drop **can be undone**. Per Rule 57 the document governs, so the case's Expected has drifted away from the current source. (The Story-20 negative cases the case only partially states are otherwise consistent.)
- **(c) Verbatim current-spec sentences:** "A drop is confirmed and can be undone." and "The order shown on the line is the order on the invoice, and this is why the story exists. One stored order is rewritten whenever parts are moved, and the work order, the invoice and the PDF all read it." (SV-9266 Jira is only a pointer to this spec and carries no Undo-removal note.)
- **(d) Proposed new Expected:**
  1. Moving a part up reorders it within its line, and the new order persists across reloads.
  2. The order shown on the line is the order the work order, the invoice and the printed order all read.
  3. The drop is confirmed and the move can be undone.
- **⚠ Surface to QA lead (document conflict, do not silently resolve — Rule 56/58):** the case records that Undo was "removed on user request, 2026-09-04", yet the later 2026-09-08 spec still says the drop can be undone. Either the spec needs updating to drop Undo, or the build/case is wrong. Ask the PO which is authoritative before this case is edited.

**C44605** · Story 20 · **UNCHANGED** (atm=3)
Expected (as written): "POSTing a reorder for a line on an INVOICED work order is rejected with 409." Spec negative verbatim: "Reordering on an invoiced work order is refused." The stated behaviour still matches (409 = the refusal). No drift. (Observation, not a drift: the case's one-line Expected does not also state the spec's other two negatives — "Moving a part to a different line is not supported" and "Where two people reorder at once, the last write wins and the invoice follows what was stored" — but its Steps do exercise them; this is pre-existing authoring thinness in an atm=3 case, not a 2026-09-08 spec change.)

### Story 21 — SV-9267 "Permissions on the new surfaces" (+ SV-8183)

**C44606** · Story 21 · **UNCHANGED**
Spec verbatim: "One new permission, Received later, which allows deferring a receive that would otherwise block completion ... It appears in the Work Orders section of the permissions page, as a yes or no toggle rather than a CRUD row ... It is off by default in every role and is granted per role ... It is the only atom this release adds."

**C44607** · Story 21 · **UNCHANGED**
Spec atom mapping matches item-for-item ("Settings page: Settings › App Settings ... Completing a line or a work order: Work Orders: Create & Edit ... Approving, declining, reordering parts, tech story, mileage, engine hours, core decisions: WO Lines: Create & Edit plus Full View ... Picking: Pick Parts ... Ordering and receiving on a work order: Order Parts, which requires See Financial Data ... The purchase order pages and assigning a vendor: Vendor & Order Mgmt: Create & Edit ... Fixing a part number into the catalogue: Catalog & Inventory: Create & Edit ... Marking reviewed: Review Work Orders ... Creating the invoice: Invoicing & Payments: Create & Edit plus See Financial Data") and "The bulk version of an action is governed by exactly the same atom as the single version ... no bulk action introduces a gate of its own." SV-8183 live confirms the same map.

**C44608** · Story 21 · **UNCHANGED**
Spec verbatim: "See Financial Data governs money. View mode governs work. They answer different questions, so they never compete on the same row: cost, tax, subtotals, totals and sell price follow See Financial Data, while Tech View and Full View decide which actions and which columns of work a user sees"; "No money field is ever both hidden and required. Receiving needs a cost and a tax, and both always arrive prefilled, so a user without See Financial Data receives with those fields removed from the screen and the existing values standing"; "Where a user cannot see money, those fields are removed rather than masked, and no text that reveals a price by implication is rendered either, such as a warning comparing cost to sell price."

**C44609** · Story 21 · **UNCHANGED**
Spec negative-cases verbatim: "A user without an atom does not see the action at all, in the bulk action bar or on the row. Nothing is shown and then refused"; "The values behind a hidden field are not sent to a screen that is not allowed to show them"; "Creating a new vendor keeps the existing vendor-management permission wherever it is offered."

---

## 4 · Note carried for the QA lead

- **All 22 cases carry a stale provenance stamp** ("Simple Flow V2 specification version 23 ... read on 21 August 2026"). The spec has advanced (2026-09-08 change-log entry). Even the 21 UNCHANGED cases would need their provenance sentence re-stamped to the current revision when the hold is lifted for a write pass (Rule 54 amendment) — but that is a WRITE action and is out of scope for this read-only diff.
- **This was a read-only diff. No TestRail write or case edit was performed.**
