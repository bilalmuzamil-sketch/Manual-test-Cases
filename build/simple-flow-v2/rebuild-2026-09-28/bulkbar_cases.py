import importlib.util
spec=importlib.util.spec_from_file_location("rebuild_lib","rebuild-2026-09-28/rebuild_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner or Admin with "WO Lines: Create & Edit" and Full View (the row checkboxes and the bulk action bar only appear with this permission and view).'
WO='Open a work order you can still change: top menu "Work Orders" > open a work order by clicking its row > its "Lines" tab. Tick the checkbox at the left of a line to raise the bulk action bar at the top of the list.'
def S(story,jira,name): return f'Epic SV-8683; story {jira} (Story {story}, {name}); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story {story}; read 28 Sep 2026.'
S7=S(7,"SV-9253","The bulk action bar"); S8=S(8,"SV-9254","Bulk approve and decline")
S9=S(9,"SV-9255","Bulk complete lines"); S11=S(11,"SV-9257","Bulk order parts"); S12=S(12,"SV-9258","Bulk pick parts")

CASES=[
{"id":44571,"title":"Bulk bar replaces the column headers and shows each action by one rule",
 "pre":[ADMIN,WO,'A work order with several lines in mixed statuses that carry parts.'],
 "steps":['Tick one or more line checkboxes.','Look at where the bar sits, what happens to the page, and how a selected row is highlighted; read the actions and their counts.'],
 "results":[
   'The bar sits at the top of the list and replaces the column headers while a selection is active; nothing on the page shifts when it appears, and it never covers the work order\'s own tabs.',
   'Selecting a row highlights the whole line, including its story, labour and parts.',
   'Each action follows one rule: nothing in the selection qualifies -> hidden; qualifies but blocked -> shown disabled with the reason; qualifies and not blocked -> shown with its count.',
   'Line actions count lines and parts actions count parts ("Receive 5 parts" may come from two lines); a count never includes what the action would skip, except a Requested part which has no button but is still counted in Order (n).'],
 "source":S7,
 "quotes":[("Story 7","The bar sits at the top of the list and replaces the column headers while a selection is active. Nothing on the page shifts when it appears"),
           ("Story 7","Selecting a row highlights the whole line, including its story, labour and parts"),
           ("Story 7","Each action is shown by one rule: nothing in the selection qualifies, hidden. Something qualifies but is blocked, shown disabled with the reason. It qualifies and is not blocked, shown with its count"),
           ("Story 7","A count may include a part that has no button of its own. Requested is the one case")]},

{"id":44572,"title":"Bulk bar groups: line and parts actions never compete for a slot; More holds the rest",
 "pre":[ADMIN,WO,'A selection that qualifies for several actions at once: some Needs-Approval lines (Approve), some Approved lines (Complete), and parts to Order / Receive / Pick.'],
 "steps":['Select lines that trigger both line actions and parts actions.','Read the order of buttons across the bar and open "More".'],
 "results":[
   'Layout is: "n selected", then Deselect all, then the line-actions group, then the parts-actions group, then More, then a close control — with a divider after "n selected", after the line group and after the parts group, always in those places.',
   'The line group takes up to three (finish action when the selection covers every open line, then Complete lines, then Approve); the parts group takes up to three (Order, Receive, Pick, in that order). A parts action is never pushed into More by a line action.',
   'More contains, in order: Authorization required, Split to new work order, Decline. Decline is always in More, never a primary slot. Create invoice acts on the whole work order (no count) and disappears once an invoice exists. Mark as reviewed is not in the bar at all.',
   'A group holding nothing renders no divider and takes no space; if More would be empty, the More button is not rendered.'],
 "source":S7,
 "quotes":[("Story 7","Line actions and parts actions sit in separate groups and never compete for the same slot"),
           ("Story 7","A parts action is never pushed into More by a line action"),
           ("Story 7","More contains, in order: Authorization required, Split to new work order, Decline"),
           ("Story 7","Mark as reviewed is not in the bulk bar at all")]},

{"id":44573,"title":"Each bulk action confirms or offers undo per its kind, with one toast each",
 "pre":[ADMIN,WO,'A selection that can be approved/declined, ordered, and received/picked.'],
 "steps":['Run Approve / Decline / Authorization required / Complete / Uncomplete and watch for an undo toast.','Run Order and Create invoice and watch for a confirmation.','Run Receive and Pick and watch what opens.'],
 "results":[
   'Approve, decline, authorization required, complete and uncomplete apply immediately and offer an Undo in the result toast.',
   'Ordering parts and creating an invoice ask for confirmation first and cannot be undone.',
   'Receiving and picking open their own screens, so they neither confirm nor offer undo.',
   'There is one toast per bulk action, summarising the result.'],
 "source":S7,
 "quotes":[("Story 7","Approve, decline, authorization required, complete and uncomplete apply immediately and offer an undo in the result toast"),
           ("Story 7","Ordering parts and creating an invoice ask for confirmation first and cannot be undone"),
           ("Story 7","Receiving and picking open their own screens, so they neither confirm nor offer undo"),
           ("Story 7","One toast per bulk action, summarising the result")]},

{"id":44575,"title":"Bulk approve/decline judges each line on its own and never sweeps a declined line",
 "pre":[ADMIN,WO,'A selection mixing Needs Approval, Approved, Declined and Complete lines (one Approved line holding received parts).'],
 "steps":['Select the mixed lines and read the Approve / Decline / Authorization required counts.','Run Approve, then run Decline; check what each acted on and read the result message.'],
 "results":[
   'Each selected line is judged on its own by the single-line rule; every line that qualifies goes through, and one line failing does not stop the rest.',
   'A declined line is never swept up by a bulk action — Approve and Authorization required leave it alone and do not count it (approving a declined line stays possible from the line itself).',
   'Counts: Approve counts Needs Approval; Decline counts Needs Approval and Approved; Authorization required counts Approved; completed lines are excluded from all three.',
   'The result names each failure with its line number and reason in one message (e.g. "3 lines approved. 1 line couldn\'t be declined: Line 3, parts must be returned first"); Undo restores only the lines that changed.'],
 "source":S8,
 "quotes":[("Story 8","Each selected line is judged on its own, by the rule that already applies to one line"),
           ("Story 8","A declined line is never swept up by a bulk action"),
           ("Story 8","Approve counts lines in Needs Approval"),
           ("Story 8","Decline counts lines in Needs Approval and Approved"),
           ("Story 8","Authorization required counts lines in Approved")]},

{"id":44576,"title":"Bulk approve/decline skips ineligible lines and hides an action at a zero count",
 "pre":[ADMIN,WO,'A selection of four lines where exactly one holds received parts (Decline will skip it); and, separately, a selection made up entirely of declined lines.'],
 "steps":['Select the four lines and run Decline; read the result.','Select only declined lines and look for an Approve button.'],
 "results":[
   'Declining four lines where one holds received parts declines three and reports the fourth — it does not refuse all four.',
   'Lines already in the target status are skipped silently and were never in the count.',
   'A selection made up entirely of declined lines shows no Approve button at all — a zero count means the button is absent, not greyed out.'],
 "source":S8,
 "quotes":[("Story 8","A selection of four lines where one holds received parts declines three and reports the fourth. It does not refuse all four"),
           ("Story 8","Lines already in the target status are skipped silently and were never in the count"),
           ("Story 8","A selection made up entirely of declined lines shows no Approve button at all, because the count would be zero")]},

{"id":44577,"title":"Bulk complete: label and count follow the selected Approved lines",
 "pre":['You are signed in with "Work Orders: Create & Edit".',WO,'Selections to try: one Approved line; several Approved lines; every open line; and a selection where a line has an outstanding tech story.'],
 "steps":['Select one Approved line, then several, then every open line — read the button label each time.','Complete a selection where a line has an outstanding tech story.','Complete the last open lines and see what happens next.'],
 "results":[
   'The label is "Complete line" for one, "Complete lines (n)" for several, and "Complete all lines" when the selection covers every open line; the count is of Approved lines only.',
   'Where something outstanding can be collected (e.g. a tech story or mileage), the action opens the completion wizard rather than failing; only what the wizard cannot fix produces a failure line. Parts never block it.',
   'Completing the last open lines stops there — no invoice is created and you are not navigated anywhere; with Review required this is what makes "Mark as reviewed" appear.'],
 "source":S9,
 "quotes":[("Story 9","The label is Complete line for one, Complete lines (n) for several, and Complete all lines when the selection covers every open line"),
           ("Story 9","The count is of Approved lines in the selection. Nothing else is counted"),
           ("Story 9","Completing the last open lines stops there. No invoice is created and the user is not navigated anywhere"),
           ("Story 9","Where something outstanding can be collected, such as a tech story or a mileage reading, the action opens the completion wizard rather than failing")]},

{"id":44578,"title":"Bulk delete lines is not in the bar this release; Mark as reviewed is not either",
 "pre":[ADMIN,WO,'Any selection of lines.'],
 "steps":['Select lines and read every action in the bar and in More.'],
 "results":[
   'There is no Delete lines action in the bulk bar, and More does not list one — bulk deletion is a follow-up, out of scope this release.',
   'Mark as reviewed is also absent from the bar (it acts on the whole work order and lives in the header / ... menu).'],
 "source":S7,
 "quotes":[("Story 7","Delete lines is not in the bar in this release. Bulk deletion is a follow-up, so the bar carries no delete action and More does not list one"),
           ("Story 7","Mark as reviewed is not in the bulk bar at all")]},

{"id":44580,"title":"Bulk order raises a PO per vendor and skips already-ordered / non-vendor parts",
 "pre":['You are signed in with "Order Parts" (which itself requires "See Financial Data").',WO,'A selection holding: unordered Quoted/Auth/Requested parts across two vendors, a vendorless part, an already-ordered part, and an inventory/found part.'],
 "steps":['Select the parts and read the Order (n) count.','Run Order, confirm, and check the purchase orders created.'],
 "results":[
   'Bulk Order runs the single-part order once per selected part; a selection spanning two vendors produces a purchase order per vendor, and a vendor with an open PO on this work order has its parts added to it.',
   'Requested parts are included and counted (with Quoted and Auth to order); a vendorless part is ordered and counted like any other, its PO marked "Vendor missing" (it just does not sync to QuickBooks until a vendor is assigned).',
   'Already-ordered parts are excluded from the count and not named in the result; only vendor-sourced parts are placed — an inventory/found/no-source part is skipped and never counted.',
   'Ordering asks for confirmation first and cannot be undone; without "Order Parts" the action is not shown, in the bar or on the row.'],
 "source":S11,
 "quotes":[("Story 11","A selection spanning two vendors produces a purchase order per vendor"),
           ("Story 11","Requested parts are included and counted, alongside Quoted and Auth to order"),
           ("Story 11","A part with no vendor is ordered like any other and is counted like any other"),
           ("Story 11","Only vendor-sourced parts are placed. An inventory or found part, or one with no source at all, is skipped and therefore never counted")]},

{"id":44581,"title":"Bulk pick runs the existing pick atomically for in-stock unpicked parts",
 "pre":['You are signed in with "Pick Parts".',WO,'A selection holding at least one In Stock, unpicked inventory or found part (some with a bin, some without).'],
 "steps":['Select the parts and read the Pick (n) count.','Run Pick and check the stock movements, bins and inventory history.'],
 "results":[
   'Bulk picking runs the existing single-part pick — the inventory movement, the bin it comes from and the history entry are identical to picking one part.',
   'All picks in one run succeed or fail together, so a partial result never leaves stock half-moved.',
   'Pick is offered whenever a part is In Stock and unpicked, whatever the setting says.',
   'Core charges are untouched by this story — a picked part still asks its core question at pick time (gated by WO Lines: Create & Edit).'],
 "source":S12,
 "quotes":[("Story 12","Bulk picking runs the existing pick. The inventory movement, the bin it comes from and the history entry are identical to picking one part"),
           ("Story 12","All picks in one run succeed or fail together, so a partial result never leaves stock half-moved"),
           ("Story 12","Pick is offered whenever a part is In Stock and unpicked, whatever the setting says")]},

{"id":44582,"title":"Bulk pick action is hidden without the Pick Parts permission",
 "pre":['You are signed in as a user WITHOUT the "Pick Parts" permission (set via Settings > Roles & Permissions).',WO,'In Stock, unpicked parts are present and selected.'],
 "steps":['Select in-stock unpicked parts and look for a Pick action in the bulk bar and on the part row.'],
 "results":['A user without "Pick Parts" does not see the Pick action, in the bulk bar or on the part row.'],
 "source":S12,
 "quotes":[("Story 12","A user without Pick Parts does not see the action")]},

{"id":53486,"title":"Deselect all keeps the bar; close dismisses it; an empty group shows no divider",
 "pre":[ADMIN,WO,'A selection where at least one action group is empty (e.g. lines with no parts, so the parts group is empty), and a selection where nothing applies at all.'],
 "steps":['Press "Deselect all" and watch the bar and the column headers.','Re-select, then press the close (X) control.','With an empty action group check the dividers; with a nothing-applies selection read the bar text.'],
 "results":[
   'Deselect all clears the selection and leaves the bar in place; the close (X) clears the selection and dismisses the bar (both return the column headers).',
   'A group holding nothing renders no divider and takes no space.',
   'A selection where nothing applies shows "n selected" and "No actions available for this selection".'],
 "source":S7,
 "quotes":[("Story 7","Deselect all clears the selection and leaves the bar in place. The close control clears the selection and dismisses the bar"),
           ("Story 7","A group holding nothing renders no divider and takes no space"),
           ("Story 7","A selection where nothing applies shows n selected and No actions available for this selection")]},
]
L.run(CASES,"rebuild-2026-09-28/update-log.jsonl")
