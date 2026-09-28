import importlib.util
spec=importlib.util.spec_from_file_location("rebuild_lib","rebuild-2026-09-28/rebuild_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

WO='Open a work order you can still change: top menu "Work Orders" > open a work order by clicking its row > its "Lines" tab.'
ADMIN='You are signed in with the permissions the step needs (WO Lines: Create & Edit for tech story / missing details / cores; Pick Parts to pick; Order Parts to receive; Work Orders: Create & Edit to complete).'
def S(story,jira,name): return f'Epic SV-8683; story {jira} (Story {story}, {name}); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story {story}; read 28 Sep 2026.'
S16=S(16,"SV-9262","When the completion wizard opens"); S17=S(17,"SV-9263","The completion wizard")
S18=S(18,"SV-9264","Create invoice as the finish action"); S19=S(19,"SV-9265","Part rows and menus")
S20=S(20,"SV-9266","Reordering parts on a line"); S21=S(21,"SV-9267","Permissions on the new surfaces")

CASES=[
# ---- Completion Wizard (6673) ----
{"id":44594,"title":"The completion wizard opens only from the defined actions, only when something is collectable",
 "pre":[ADMIN,WO,'One work order with something outstanding (e.g. a line missing a required tech story, or an unpicked inventory part), and one tidy work order with nothing outstanding.'],
 "steps":['On the work order with outstanding work, trigger each: Complete on a line; Complete lines / Complete all lines; Create invoice; Clock out and complete.','On the tidy work order, trigger a completion.','Try "Mark as reviewed".'],
 "results":[
   'The wizard opens from exactly these actions and nothing else: Complete on a line (that line), Complete lines (the selection), Complete all lines / Create invoice (every open line), Clock out and complete (the line clocked out of). No timer, background job or side effect opens it.',
   'It opens only when something required is both outstanding and collectable; if nothing is, the action completes immediately and no wizard appears.',
   'Collectable = a missing tech story, a missing mileage or engine hours reading, an unpicked inventory part, an unresolved core, or an unreceived part. "Mark as reviewed" never opens it (it only appears once every line is complete). The run fixes which lines it covers and whether it is heading to an invoice when it opens.'],
 "source":S16,
 "quotes":[("Story 16","The wizard opens from these entry points, and from nothing else"),
           ("Story 16","It opens only when something required is both outstanding and collectable. If nothing is, the action completes immediately and no wizard appears"),
           ("Story 16","What counts as collectable is a missing tech story, a missing mileage or engine hours reading, an unpicked inventory part, an unresolved core, or an unreceived part")]},

{"id":44595,"title":"The wizard shows only the outstanding steps, in a fixed order, with Missing details last",
 "pre":[ADMIN,WO,'A work order where several things are outstanding across the settings (tech story, an unpicked part, an unresolved core, an unreceived part, and missing mileage/engine hours). Require the relevant settings ON.'],
 "steps":['Open the wizard and read the step pills across the top and their order.','Finish one step, then reopen the wizard and check which steps remain.'],
 "results":[
   'The step list is built from the settings and from what is actually outstanding: a step whose work is done never appears, and reopening shows only what is left.',
   'Step order is Tech stories, Pick parts, Resolve cores, Receive parts, Missing details — with Missing details always last (mileage/engine hours are work-order info; asked once per work order, only when the run closes every remaining line).',
   'Steps appear as pills with a count where more than one item is outstanding; a finished step shows a tick and is read-only, while unfinished steps stay clickable (skip ahead and come back). The modal title names the current step, not the flow.'],
 "source":S17,
 "quotes":[("Story 17","The step list is built from the settings and from what is actually outstanding, so a step whose work is already done never appears and a second pass never asks twice"),
           ("Story 17","Step order is Tech stories, Pick parts, Resolve cores, Receive parts, Missing details"),
           ("Story 17","Missing details is last, because mileage and engine hours are work-order information and asking for them first changes the subject")]},

{"id":44596,"title":"Each wizard step's own action saves and advances; there is no Continue; receive reuses the modal",
 "pre":[ADMIN,WO,'A wizard open with a Tech stories step, a Pick parts step and a Receive parts step outstanding.'],
 "steps":['On each step, use its action button and watch what happens (no Continue button anywhere).','On the receive step, read its action and open it.','Close the wizard part way, then reopen it.'],
 "results":[
   'There is no Continue button: each step\'s button is its own action (Save, Pick all, Receive parts) and performing it saves and advances in one press; the button sits with the content it acts on, not in a footer.',
   'The receive step\'s only action is "Receive parts" (no second "leave without receiving" action); it states the outstanding count plainly (e.g. "3 parts not received"), opens the same receive modal as Receiving from the work order with the same required fields and the same per-part "Received later" choice, and closing that modal returns to the wizard at the next step.',
   'The wizard never mentions ordering even when ordering is required (ordering happens without user action when the parts are received). Closing the wizard keeps everything already done.'],
 "source":S17,
 "quotes":[("Story 17","There is no Continue button. Each step's button is its own action: Save, Pick all, Receive parts. Performing the action saves it and advances in one press"),
           ("Story 17","The receive step's only action is Receive parts. There is no second action offering to leave the step without receiving"),
           ("Story 17","The wizard never mentions ordering, even when ordering is required")]},

{"id":44597,"title":"Where a wizard run ends depends on what opened it",
 "pre":[ADMIN,WO,'A work order with outstanding work, run the wizard three ways: from Complete lines (a subset), from Complete all lines, and from Create invoice.'],
 "steps":['Open the wizard from "Complete lines" on a subset and finish it.','Open it from "Complete all lines" and finish it.','Open it from "Create invoice" and finish it.'],
 "results":[
   'Complete on a line / Complete lines: those lines complete, a toast, the work order untouched.',
   'Complete all lines: every open line completes, a toast, still on the work order; with Review required this is the moment "Mark as reviewed" appears in the header.',
   'Create invoice: the invoice is created, the Finance tab opens, and the payment screen opens.'],
 "source":S17,
 "quotes":[("Story 17","Complete on a line, or Complete lines: those lines complete, a toast, work order untouched"),
           ("Story 17","Complete all lines: every open line complete, a toast, still on the work order. With review required, this is the moment Mark as reviewed appears in the header"),
           ("Story 17","Create invoice: the invoice created, the Finance tab, the payment screen")]},

{"id":44598,"title":"The wizard omits not-required steps, closes to the outcome if work is finished elsewhere",
 "pre":[ADMIN,WO,'A work order where one setting is OFF (so its step should not exist), and a way to have a second user finish the outstanding work mid-run (or dev support).'],
 "steps":['Open the wizard and confirm the step for the switched-off requirement is absent (not disabled, not skippable).','With the wizard open, have the outstanding work finished elsewhere, then observe the wizard.','As a user whose role cannot perform the only outstanding step, trigger completion.'],
 "results":[
   'A step for work that is not required does not exist — it is not disabled and not skippable.',
   'If someone else finishes the outstanding work mid-run, the wizard closes to the outcome rather than showing an empty step.',
   'Where the only outstanding step is one the user\'s role cannot perform, the action fails with the reason instead of opening an empty wizard.'],
 "source":S17,
 "quotes":[("Story 17","A step for work that is not required does not exist. It is not disabled and not skippable"),
           ("Story 17","If someone else finishes the outstanding work mid-run, the wizard closes to the outcome rather than showing an empty step"),
           ("Story 16","A step the user's role cannot perform is not shown. Where that step is the only outstanding work, the action fails with the reason instead of opening an empty wizard")]},

# ---- Finish Action (6674) ----
{"id":44599,"title":"The header shows only the one finish action that is genuinely next",
 "pre":['You are signed in with Invoicing & Payments: Create & Edit + See Financial Data (for Create invoice) and Review Work Orders (for Mark as reviewed).',WO,'Set up the four states: review OFF with a line open, review OFF all complete, review ON with a line open, review ON all complete (not reviewed), and review ON already reviewed.'],
 "steps":['For each state, read the work-order header (next to New Line and the ... menu).','Select some lines and confirm the bulk bar appears instead.'],
 "results":[
   'Review off, a line still open: New Line, Send, and a ... menu holding Create invoice. Review off, every line complete: Create invoice promoted to a primary button.',
   'Review on, a line still open: New Line, Send, ... and NO finish action at all (the next real action is completing the lines). Review on, all complete not reviewed: Mark as reviewed promoted. Review on, already reviewed: Create invoice promoted.',
   'Only one finish action is ever on screen, and only ever one the user can actually press. With lines selected, the bulk action bar shows whatever the review setting.'],
 "source":S18,
 "quotes":[("Story 18","The header offers what is genuinely next, and it depends on whether review is required"),
           ("Story 18","Only one finish action is ever on screen, and it is only ever one the user can actually press")]},

{"id":44600,"title":"Create invoice runs the wizard if needed, then invoices, completes Approved lines and opens payment",
 "pre":['You are signed in with Invoicing & Payments: Create & Edit + See Financial Data.',WO,'A work order with every line approved, some still open, and something outstanding the wizard can collect.'],
 "steps":['Press Create invoice while lines are still open and read the confirmation.','Complete the wizard and watch what happens on completion.','Separately, on a work order whose deposit already covers the amount, press Create invoice.'],
 "results":[
   'Where every line is approved, Create invoice runs the wizard first if anything required is outstanding, otherwise proceeds directly; if lines are still open the confirmation states the invoice total and how many Approved lines will be completed (declined lines named as excluded, not counted).',
   'On completion the invoice is created, every open Approved line completes, and the Finance tab opens with the payment screen. Everything that happens today when an invoice is created still happens (deposit applying, over-payment becoming a credit, customer locked, accounting sync, snapshot).',
   'Where a deposit already covers the whole amount the payment screen is skipped, the work order reads Paid, and the user is told the deposit settled the invoice.'],
 "source":S18,
 "quotes":[("Story 18","Where every line is approved, Create invoice runs the wizard first if anything required is outstanding, and otherwise proceeds directly"),
           ("Story 18","On completion the invoice is created, every open Approved line completes, and the Finance tab opens with the payment screen"),
           ("Story 18","Where a deposit already covers the whole amount the payment screen is skipped, the work order reads Paid")]},

{"id":44601,"title":"Finish-action negatives: needs-approval block, declined-only, invoice lock, payment-close",
 "pre":['You are signed in with the invoicing permissions.',WO,'Set up: a work order with a Needs Approval line; a work order whose lines are all declined; and an already-invoiced work order.'],
 "steps":['On the work order with a Needs Approval line, look at Create invoice and read its state/reason.','On the all-declined work order, look for a finish action.','Create an invoice, open the payment screen, and close it without paying; check the work order.'],
 "results":[
   'Create invoice is refused while any line is still in Needs Approval — shown disabled with the reason "All lines must be approved before invoicing", not hidden. A declined line never blocks it (declining is terminal and skipped entirely).',
   'Where every line is declined there is no finish action (nothing to review or invoice).',
   'Closing the payment screen rolls nothing back: the invoice stands, the lines stay complete, the work order stays invoiced with a balance owing. Creating an invoice locks the work order (no new lines/parts/labour/fees/discounts).'],
 "source":S18,
 "quotes":[("Story 18","Create invoice is refused while any line is still in Needs Approval ... shown disabled with the reason All lines must be approved before invoicing, not hidden"),
           ("Story 18","A declined line never blocks it. Declining is terminal: the work is not performed, the line is not invoiced, and it is skipped entirely"),
           ("Story 18","Closing the payment screen rolls nothing back. The invoice stands, the lines stay complete, and the work order stays invoiced with a balance owing")]},

# ---- Part Rows and Menus (6675) ----
{"id":44602,"title":"The part and line ... menus hold exactly the actions that belong to them",
 "pre":['You are signed in with WO Lines: Create & Edit and Full View.',WO,'A line with parts, so both the part\'s ... menu and the line\'s ... menu are available.'],
 "steps":['Open a part\'s ... menu and read its items (with receiving optional, then required).','Open a line\'s ... menu and read its items.'],
 "results":[
   'The part\'s ... menu contains: Move, Return, Add part fee or discount, and Receive part (the last only when receiving is optional, and always at the bottom).',
   'The line\'s ... menu contains: Request part, Uncomplete line, Add line note, Save as canned line, Edit labour, Receive parts (n) (when receiving is optional and the line has parts waiting), and Authorization required.',
   'Uncomplete is existing behaviour and is already blocked once the work order is invoiced or paid; the same block applies in the bulk action bar so the two cannot drift apart.'],
 "source":S19,
 "quotes":[("Story 19","The part's … menu contains Move, Return, Add part fee or discount, and Receive part, the last only when receiving is optional and always at the bottom"),
           ("Story 19","The line's … menu contains Request part, Uncomplete line, Add line note, Save as canned line, Edit labour, Receive parts (n) when receiving is optional and the line has parts waiting, and Authorization required")]},

{"id":44603,"title":"Menu negatives: Request part, Uncomplete and Receive part visibility",
 "pre":['You are signed in; have one Complete line and one open line; and a user without Order Parts.',WO],
 "steps":['On a completed line, open its ... menu and look for Request part and Uncomplete line.','On an open (not completed) line, look for Uncomplete line.','As a user without Order Parts, look for Receive part.'],
 "results":[
   'Request part is hidden on a completed line.',
   'Uncomplete line appears only on a completed line.',
   'Receive part is absent for a user without Order Parts, whatever the setting.'],
 "source":S19,
 "quotes":[("Story 19","Request part is hidden on a completed line"),
           ("Story 19","Uncomplete line appears only on a completed line"),
           ("Story 19","Receive part is absent for a user without Order Parts, whatever the setting")]},

# ---- Reordering Parts (6676) — AUTOMATED, and C44604 PO-confirmed (Undo removed) ----
{"id":44604,"title":"Dragging a part reorders it within its line; the line order is the invoice order",
 "pre":['You are signed in with WO Lines: Create & Edit and Full View.',WO,'A line that holds more than one part.'],
 "steps":['Drag a part to a new position within its own line and drop it.','Open the invoice / PDF for that work order and read the part order.'],
 "results":[
   'Parts can be dragged to reorder within their own line, and the new order persists on the line.',
   'The order shown on the line is the order on the invoice: the work order, the invoice and the PDF all read the one stored order, and the line numbers move with the rows.',
   'The confirmation shown on drop is informational only — the Undo action was removed on user request (2026-09-04), PO-confirmed 2026-09-24. (The spec still reads "a drop can be undone"; that sentence is stale and is being corrected by the PM.)'],
 "source":S20+' PO decision recorded in source-verify-2026-09-24/PO-ANSWERS-2026-09-24.md (2026-09-24): the reorder Undo was removed 2026-09-04; the case is correct and the spec sentence is stale.',
 "quotes":[("Story 20","Parts can be dragged to reorder within their own line"),
           ("Story 20","The order shown on the line is the order on the invoice, and this is why the story exists"),
           ("PO decision 2026-09-24","the confirmation toast is informational only; the Undo action was removed on user request, 2026-09-04 (PO-confirmed)")]},

{"id":44605,"title":"Reordering negatives: no cross-line moves, refused on an invoiced WO, last write wins",
 "pre":['You are signed in with WO Lines: Create & Edit and Full View.',WO,'A line with several parts; an invoiced work order; and a way for two people to reorder at once (two logins).'],
 "steps":['Try to drag a part onto a different line.','Try to reorder parts on an invoiced work order.','Have two users reorder the same line at once, then refresh and check the invoice.'],
 "results":[
   'Moving a part to a different line is not supported.',
   'Reordering on an invoiced work order is refused.',
   'Where two people reorder at once, the last write wins and the invoice follows what was stored.'],
 "source":S20,
 "quotes":[("Story 20","Moving a part to a different line is not supported"),
           ("Story 20","Reordering on an invoiced work order is refused"),
           ("Story 20","Where two people reorder at once, the last write wins and the invoice follows what was stored")]},

# ---- Permissions (6677) ----
{"id":44606,"title":"'Received later' is the one new permission — a per-role toggle, off by default",
 "pre":['You are signed in as an Owner/Admin. Open Settings > Roles & Permissions and edit a role (pencil), then find the Work Orders section.'],
 "steps":['In the Work Orders section of the permissions page, find "Received later".','Check its default state on a role that has not been changed, and its control type.'],
 "results":[
   '"Received later" appears in the Work Orders section as a yes/no toggle (not a CRUD row).',
   'It is off by default in every role and is granted per role.',
   'It is the only permission atom this release adds; everything else reuses an existing atom.'],
 "source":S21,
 "quotes":[("Story 21","One new permission, Received later, which allows deferring a receive that would otherwise block completion"),
           ("Story 21","It appears in the Work Orders section of the permissions page, as a yes or no toggle rather than a CRUD row"),
           ("Story 21","It is off by default in every role and is granted per role")]},

{"id":44607,"title":"Every Simple Flow action is gated by its mapped existing atom; bulk uses the same atom as single",
 "pre":['You are signed in as an Owner/Admin able to configure roles (Settings > Roles & Permissions).'],
 "steps":['For each action, confirm the gating atom by turning that atom off on a test role and checking the action disappears: completing (Work Orders: Create & Edit); approve/decline/reorder/tech story (WO Lines: Create & Edit + Full View); pick (Pick Parts); order & receive on a WO (Order Parts, which needs See Financial Data); PO pages & assign vendor (Vendor & Order Mgmt: Create & Edit); mark reviewed (Review Work Orders); create invoice (Invoicing & Payments: Create & Edit + See Financial Data).','Compare the bulk version of an action with its single-row version.'],
 "results":[
   'Each action is gated by exactly the atom the spec maps to it (list above), and the settings page itself needs Settings > App Settings.',
   'The bulk version of an action is governed by exactly the same atom as the single version — no bulk action introduces a gate of its own.'],
 "source":S21,
 "quotes":[("Story 21","Everything else reuses an existing atom, and the spec names it on each story rather than describing a job title"),
           ("Story 21","The bulk version of an action is governed by exactly the same atom as the single version ... no bulk action introduces a gate of its own")]},

{"id":44608,"title":"Money follows See Financial Data; work follows View mode; nothing is hidden-and-required",
 "pre":['Two test users: one WITHOUT See Financial Data, one on Tech View vs Full View.',WO],
 "steps":['As the user without See Financial Data, look at cost, tax, subtotals, totals and sell price across the receive modal, receive page and lines.','Compare what Tech View vs Full View shows for actions and work columns.','Receive as the no-money user.'],
 "results":[
   'See Financial Data governs money (cost, tax, subtotals, totals, sell price); View mode (Tech View / Full View) governs which actions and work columns a user sees — the two never compete on the same row.',
   'No money field is ever both hidden and required: receiving needs a cost and a tax, both always prefilled, so a user without See Financial Data receives with those fields removed and the existing values standing.',
   'Where a user cannot see money, those fields are removed rather than masked, and no text that reveals a price by implication is rendered.'],
 "source":S21,
 "quotes":[("Story 21","See Financial Data governs money. View mode governs work. They answer different questions, so they never compete on the same row"),
           ("Story 21","No money field is ever both hidden and required"),
           ("Story 21","Where a user cannot see money, those fields are removed rather than masked")]},

{"id":44609,"title":"A user without an atom never sees the action; hidden values are not sent to the screen",
 "pre":['A test user missing a given atom (e.g. Order Parts), on a work order where that action would otherwise appear.'],
 "steps":['As that user, look for the action in the bulk action bar and on the row.','Check (with dev/network support) that values behind a hidden money field are not delivered to the page.'],
 "results":[
   'A user without an atom does not see the action at all, in the bulk action bar or on the row — nothing is shown and then refused.',
   'The values behind a hidden field are not sent to a screen that is not allowed to show them.',
   'Creating a new vendor keeps the existing vendor-management permission wherever it is offered.'],
 "source":S21,
 "quotes":[("Story 21","A user without an atom does not see the action at all, in the bulk action bar or on the row. Nothing is shown and then refused"),
           ("Story 21","The values behind a hidden field are not sent to a screen that is not allowed to show them")]},
]
L.run(CASES,"rebuild-2026-09-28/update-log.jsonl")
