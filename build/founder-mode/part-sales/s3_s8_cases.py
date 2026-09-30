import importlib.util
spec=importlib.util.spec_from_file_location("ps_lib","build/founder-mode/part-sales/ps_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

PS='You are on a part sale that is not invoiced or paid, signed in as a user with Part Sales -> Create & Edit.'
def src(story,jira,title): return (f'Epic SV-9667 (Founder Mode Batch #1); story {jira} ({title}); '
    f'Part Sales Update v1 PRD (Confluence 867434569), {story}; design canvas boards {story}_*; read 30 Sep 2026.')
S3=src("Story 3","SV-10264","Change the tax on a part sale")
S4=src("Story 4","SV-10265","Read the part sale log, and a menu that stops putting Delete first")
S5=src("Story 5","SV-10266","Attribute a part sale to a sales representative")
S6=src("Story 6","SV-10267","Read the Actions column down one line")
S7=src("Story 7","SV-10268","Call a part sale a part sale")
S8=src("Story 8","SV-10269","Take a deposit on a part sale")

S3CASES=[
{"anchors":["S3-R1","S3-R2","S3-R3"],"title":"The Financial Info card offers Edit tax rate, opening the work order's tax picker and recalculating at once",
 "pre":[PS,'Open the part sale\'s Finance tab and its Financial Info card.'],
 "steps":['On the Financial Info card, find and use Edit tax rate (the pencil).','Read the picker that opens and the rates it lists.','Choose a different rate and Save; read the sale total.'],
 "results":[
   'The Financial Info card on a part sale offers Edit tax rate.',
   'It opens the same tax picker a work order uses, listing the shop\'s own rates.',
   'Saving recalculates the sale total immediately.'],
 "source":S3,
 "quotes":[("S3-R1","The Financial Info card on a part sale offers Edit tax rate"),
           ("S3-R2","It opens the same tax picker a work order uses, listing the shop's own rates"),
           ("S3-R3","Saving recalculates the sale total immediately")]},
{"anchors":["S3-R4","S3-R5"],"title":"A tax change is logged, and because tax locks at invoicing it never restates an existing invoice",
 "pre":[PS,'A part sale whose tax you will change; and an already-invoiced sale for comparison.'],
 "steps":['Change the tax rate and open the part sale log to find the entry.','Confirm an invoice that already exists is unchanged and the Sales Tax report is not restated for a past period.'],
 "results":[
   'The change is recorded in the part sale log.',
   'Because tax locks at invoicing, a rate change can never alter an invoice that already exists, and the Sales Tax report is never restated for a past period.'],
 "source":S3,
 "quotes":[("S3-R4","The change is recorded in the part sale log"),
           ("S3-R5","Because tax locks at invoicing, a rate change can never alter an invoice that already exists, and the Sales Tax report is never restated for a past period")]},
{"anchors":["S3-N1","S3-N2"],"title":"Edit tax rate is read-only once invoiced/paid and hidden without the permission",
 "pre":['Open an invoiced or paid part sale; and sign in as a user without Part Sales -> Create & Edit.'],
 "steps":['On the invoiced or paid sale, look for Edit tax rate on the Financial Info card.','As the user without the permission, look for the action.'],
 "results":[
   'Once the part sale is invoiced or paid, the card is read-only and the action is not offered.',
   'A user without Part Sales -> Create & Edit does not see the action.'],
 "source":S3,
 "quotes":[("S3-N1","Once the part sale is invoiced or paid, the card is read-only and the action is not offered"),
           ("S3-N2","A user without the permission above does not see the action")]},
]

S4CASES=[
{"anchors":["S4-R1","S4-R2"],"title":"The part sale menu offers Audit Log, opening a searchable Part Sale Log",
 "pre":[PS,'Open the part sale and its top ⋮ menu.'],
 "steps":['Open the ⋮ menu and choose Audit Log.','Read the dialog title and confirm it is searchable.','Read the entries: who did what, on which line, and when.'],
 "results":[
   'The part sale menu offers Audit Log, opening a searchable dialog titled "Part Sale Log".',
   'The log shows who did what, on which line, and when — the same entries the work order log shows, for this sale.'],
 "source":S4,
 "quotes":[("S4-R1","The part sale menu offers Audit Log, opening a searchable dialog titled Part Sale Log"),
           ("S4-R2","The log shows who did what, on which line, and when - the same entries the work order log shows, for this sale")]},
{"anchors":["S4-R3","S4-R4"],"title":"The menu is reordered: Audit Log first, Delete Part Sale last and no longer red",
 "pre":[PS,'Open the part sale ⋮ menu.'],
 "steps":['Read the order of the menu items top to bottom.','Read the styling of Delete Part Sale and compare against the work order menu.'],
 "results":[
   'The menu order is Audit Log, Add Parts Sale Fee / Discount, Set Status, Delete Part Sale.',
   'Delete Part Sale is last and is no longer shown in red, matching the work order menu.'],
 "source":S4,
 "quotes":[("S4-R3","The menu order is Audit Log, Add Parts Sale Fee / Discount, Set Status, Delete Part Sale"),
           ("S4-R4","Delete Part Sale is last and is no longer shown in red, matching the work order menu")]},
{"anchors":["S4-R5","S4-N3","S4-N4"],"title":"A Complete part sale can be deleted, but one holding received parts still cannot",
 "pre":[PS,'A part sale at Complete with no received parts; a part sale holding received parts; and a Complete service work order for comparison.'],
 "steps":['Delete the Complete part sale with no received parts and confirm it succeeds.','Attempt to delete the part sale holding received parts and read the refusal.','Confirm a Complete service work order still cannot be deleted.'],
 "results":[
   'A part sale can be deleted while it is Complete (Complete on a part sale is reached the moment the parts are received, where it waits to be invoiced, so the old rule made every received part sale permanently undeletable).',
   'A part sale holding received parts still cannot be deleted: it is refused with "Part sale cannot be deleted because it has received parts. Please return or reassign all received parts before deleting." — that rule is unchanged, it was simply unreachable behind the Complete check.',
   'A service work order is unchanged: a Complete one still cannot be deleted.'],
 "source":S4,
 "quotes":[("S4-R5","A part sale can be deleted while it is Complete. Complete means something different on a part sale ... so refusing to delete a Complete document made every received part sale permanently undeletable"),
           ("S4-N3","A part sale holding received parts still cannot be deleted. It is refused with “Part sale cannot be deleted because it has received parts. Please return or reassign all received parts before deleting.” That rule is unchanged; it was simply unreachable behind the Complete check"),
           ("S4-N4","A service work order is unchanged. A Complete one still cannot be deleted")]},
{"anchors":["S4-R6","S4-R7"],"title":"Every part sale opens with a Created entry; a split writes a linked Split from / Split to pair",
 "pre":[PS,'A part sale started from the Part Sales screen, one produced by a split, and the sale the parts were split from.'],
 "steps":['Open the log of a sale started from the Part Sales screen and read the first entry; do the same for a sale produced by a split.','On a split, read the entry on the new sale and on the sale the parts came from, and follow the links.'],
 "results":[
   'The first entry on every part sale is Created, whether the sale was started from the Part Sales screen or produced by a split.',
   'Splitting a part sale writes a matched pair: the new part sale records Split from and the sale the parts came from records Split to; each entry names the other part sale by its number and links to it.'],
 "source":S4,
 "quotes":[("S4-R6","The first entry on every part sale is Created, whether the sale was started from the Part Sales screen or produced by a split"),
           ("S4-R7","Splitting a part sale writes a matched pair: the new part sale records Split from and the sale the parts came from records Split to. Each entry names the other part sale by its number and links to it")]},
{"anchors":["S4-N1","S4-N2"],"title":"The log is refused without the permission and never shows another object's entries",
 "pre":['Sign in as a user who cannot edit part sales; and have another part sale and a service work order whose entries must never appear.'],
 "steps":['As the user who cannot edit part sales, look for Audit Log and try to reach the log address directly.','In a log you can open, confirm it shows only this sale\'s entries — never another part sale\'s or a service work order\'s.'],
 "results":[
   'A user who cannot edit part sales is not offered the log, and is refused if they reach its address directly.',
   'The log never shows entries from another part sale or from a service work order.'],
 "source":S4,
 "quotes":[("S4-N1","A user who cannot edit part sales is not offered the log, and is refused if they reach its address directly"),
           ("S4-N2","The log never shows entries from another part sale or from a service work order")]},
{"anchors":["S4-N5","S4-N6"],"title":"Nothing is backfilled, and the service work order log is unchanged",
 "pre":['A part sale started before the release and a split made before the release; and a service work order with Split from / Split to entries.'],
 "steps":['Open the pre-release part sale\'s log and look for a Created entry; open the pre-release split and look for a Split from / Split to pair.','Open a service work order\'s log and read its Split from / Split to entries.'],
 "results":[
   'Nothing is backfilled: a part sale started before the release has no Created entry, and a split made before the release has no Split from or Split to pair.',
   'A service work order\'s log is unchanged — its Split from and Split to entries read exactly as they did, without a linked number.'],
 "source":S4,
 "quotes":[("S4-N5","Nothing is backfilled. A part sale started before the release has no Created entry, and a split made before the release has no Split from or Split to pair"),
           ("S4-N6","A service work order's log is unchanged. Its Split from and Split to entries read exactly as they did, without a linked number")]},
]

S5CASES=[
{"anchors":["S5-R1","S5-R2"],"title":"The header card carries a Sales Representative field offering active reps, clearable",
 "pre":[PS,'Open the part sale header card (below the number and Started date).'],
 "steps":['Find the Sales Representative field on the header card.','Open its picker and read the options.','Set a rep, then clear the field.'],
 "results":[
   'The part sale header card carries a Sales Representative field.',
   'It offers the shop\'s active sales representatives, and can be cleared.'],
 "source":S5,
 "quotes":[("S5-R1","The part sale header card carries a Sales Representative field"),
           ("S5-R2","It offers the shop's active sales representatives, and can be cleared")]},
{"anchors":["S5-R3","S5-R4"],"title":"The rep is captured at invoicing and reaches Sales By Representative; changes are logged prev→new",
 "pre":[PS,'A part sale with a rep set that will be invoiced; and access to the Sales By Representative report and the part sale log.'],
 "steps":['Change the rep and read the log entry (previous and new name).','Invoice the sale and confirm the choice is captured on the invoice.','Open Sales By Representative and confirm the sale appears under that person.'],
 "results":[
   'The choice is captured on the invoice when the sale is invoiced, and the sale appears in Sales By Representative under that person.',
   'The change is recorded in the part sale log, showing the previous and the new name.'],
 "source":S5,
 "quotes":[("S5-R3","The choice is captured on the invoice when the sale is invoiced, and the sale appears in Sales By Representative under that person"),
           ("S5-R4","The change is recorded in the part sale log, showing the previous and the new name")]},
{"anchors":["S5-N1","S5-N2"],"title":"An unset rep falls back to the customer's rep, and neither set reads Unassigned",
 "pre":[PS,'A customer with an assigned representative; and a sale whose customer also has none.'],
 "steps":['Leave the sale\'s rep unset for a customer that has an assigned rep, invoice it, and read the attribution.','For a sale whose customer also has no rep, read how the sale is attributed.'],
 "results":[
   'If no representative is set on the sale, the invoice is attributed to the customer\'s assigned representative, exactly as a work order is.',
   'If neither is set, the sale appears as Unassigned.'],
 "source":S5,
 "quotes":[("S5-N1","If no representative is set on the sale, the invoice is attributed to the customer's assigned representative, exactly as a work order is"),
           ("S5-N2","If neither is set, the sale appears as Unassigned")]},
{"anchors":["S5-N3","S5-N4"],"title":"The field is read-only once invoiced/paid, and a non-rep staff member cannot be selected",
 "pre":['An invoiced or paid part sale; and a staff member who is not marked as a sales representative.'],
 "steps":['On the invoiced or paid sale, confirm the Sales Representative field is read-only and the captured attribution does not change.','In the picker, look for a staff member who is not marked as a sales representative.'],
 "results":[
   'Once the sale is invoiced or paid the field is read-only, and the attribution captured at invoicing does not change afterwards.',
   'A staff member who is not marked as a sales representative cannot be selected.'],
 "source":S5,
 "quotes":[("S5-N3","Once the sale is invoiced or paid the field is read-only, and the attribution captured at invoicing does not change afterwards"),
           ("S5-N4","A staff member who is not marked as a sales representative cannot be selected")]},
]

S6CASES=[
{"anchors":["S6-R1","S6-R2","S6-R3"],"title":"The Actions column reads down one line: primary action on a left rail, utility icons pinned right",
 "pre":['Open a part sale\'s Parts grid with rows in different states (Order, Receive, Pick, and a core row offering Return Core).'],
 "steps":['Read where each row\'s primary action sits relative to the Actions heading.','Read where the utility icons and the row ⋮ menu sit.','Compare rows whose button labels differ in length and confirm the heading does not move.'],
 "results":[
   'The Actions column shows the primary action for the row — Order, Receive, Pick, or Return Core on a core row — aligned under the Actions heading.',
   'The utility icons and the row menu sit in their own column, pinned to the right.',
   'The heading stays in the same place whatever the length of the button label beneath it.'],
 "source":S6,
 "quotes":[("S6-R1","The Actions column shows the primary action for the row - Order, Receive, Pick, or Return Core on a core row - aligned under the Actions heading"),
           ("S6-R2","The utility icons and the row menu sit in their own column, pinned to the right"),
           ("S6-R3","The heading stays in the same place whatever the length of the button label beneath it")]},
{"anchors":["S6-N1","S6-N2"],"title":"The work order grid is unchanged, and a row with no primary action leaves the cell empty",
 "pre":['A service work order parts grid for comparison; and a part sale row that has no primary action.'],
 "steps":['Confirm a service work order\'s parts grid is unchanged in every respect.','On a part sale row with no primary action, confirm the Actions cell is empty and the icons do not shift left.'],
 "results":[
   'A service work order\'s parts grid is unchanged in every respect.',
   'A row with no primary action leaves that cell empty rather than shifting the icons left.'],
 "source":S6,
 "quotes":[("S6-N1","A service work order's parts grid is unchanged in every respect"),
           ("S6-N2","A row with no primary action leaves that cell empty rather than shifting the icons left")]},
]

S7CASES=[
{"anchors":["S7-R1","S7-R2","S7-R3","S7-R4"],"title":"The bulk and row menus name the part sale correctly and are title-cased",
 "pre":[PS,'Select one or more lines on a part sale to reveal the bulk menu; also open a row menu.'],
 "steps":['Read the bulk menu items.','Read the row menu Set Status entry.','Confirm the capitalization matches every other menu on the screen.'],
 "results":[
   'The bulk menu reads Split Part Sale, not "Split parts order".',
   'The bulk menu reads Move Part, not "Move part".',
   'The row menu entry reads Set Status.',
   'Both bulk items are capitalized the way every other menu on the screen is.'],
 "source":S7,
 "quotes":[("S7-R1","The bulk menu reads Split Part Sale, not Split parts order"),
           ("S7-R2","The bulk menu reads Move Part, not Move part"),
           ("S7-R3","The row menu entry reads Set Status"),
           ("S7-R4","Both bulk items are capitalized the way every other menu on the screen is")]},
{"anchors":["S7-R5","S7-R6"],"title":"The tab bar reads Parts, Notes, Stats, Finance — labels and order only",
 "pre":[PS,'Open the part sale and read its tab bar.'],
 "steps":['Read the tab labels and their order.','Confirm the parts count still prints beside Parts.','Confirm each tab\'s address and content are unchanged (only labels/order moved), and that Statistics is retired in favour of Stats.'],
 "results":[
   'The part sale tab bar reads Parts, Notes, Stats, Finance, in that order — the order and wording a work order uses; Stats is the label and Statistics is retired.',
   'Labels and order only: the tabs themselves, their addresses and what each shows are unchanged, and the parts count still prints beside Parts.'],
 "source":S7,
 "quotes":[("S7-R5","The part sale tab bar reads Parts, Notes, Stats, Finance, in that order, which is the order and the wording a work order uses. Stats is the label; Statistics is retired"),
           ("S7-R6","Labels and order only. The tabs themselves, their addresses and what each one shows are unchanged, and the parts count still prints beside Parts")]},
{"anchors":["S7-N1","S7-N2","S7-N5","S7-N6"],"title":"The work order is untouched; the Notes tab comes from another project and the bar reads Parts, Stats, Finance until it ships",
 "pre":[PS,'A service work order for comparison; and note whether the Notifications Center project\'s Notes tab is present.'],
 "steps":['Confirm the wording on a service work order is unchanged and its actions do the same thing (only labels moved).','Confirm where the Notes tab sits when present and what the bar reads until it ships.','Read the work order tab bar.'],
 "results":[
   'The wording on a service work order is unchanged, and what the actions do is unchanged — only their labels move.',
   'The Notes tab on a part sale is delivered by the Notifications Center project, not this one; where present it sits second, directly after Parts, and until it ships the bar reads Parts, Stats, Finance.',
   'The work order tab bar is unchanged: it already reads Lines, Parts, Notes, Timesheets, History, Stats, Finance, and Stats is the wording this story adopts.'],
 "source":S7,
 "quotes":[("S7-N1","The wording on a service work order is unchanged"),
           ("S7-N2","What the actions do is unchanged; only their labels move"),
           ("S7-N5","The Notes tab on a part sale is delivered by the Notifications Center project, not by this one. Where it is present it sits second, directly after Parts; until it ships the bar reads Parts, Stats, Finance"),
           ("S7-N6","The work order tab bar is unchanged. It already reads Lines, Parts, Notes, Timesheets, History, Stats, Finance, and Stats is the wording this story adopts")]},
{"anchors":["S7-N3","S7-N4"],"title":"A split leaves the deposit behind and carries each line's parts, returns and core; an invoiced sale cannot be split",
 "pre":[PS,'A part sale holding a deposit, with a core on a line to be split; and an invoiced sale.'],
 "steps":['Split the sale and confirm the deposit stays with the original sale.','Confirm each selected line moves together with its parts and returns, and a core and its charge travel with the line.','Attempt to split an already-invoiced sale.'],
 "results":[
   'Splitting a part sale does not move a deposit: the deposit stays with the original sale, as it does when a work order is split.',
   'A split moves each selected line together with its parts and returns, so a core and its charge travel with the line they sit on and are returned, if at all, on whichever sale that line ends up in; a sale that has already been invoiced cannot be split.'],
 "source":S7,
 "quotes":[("S7-N3","Splitting a part sale does not move a deposit. The deposit stays with the original sale, as it does when a work order is split"),
           ("S7-N4","A split moves each selected line together with its parts and returns, so a core and its charge travel with the line they sit on and are returned, if they are returned at all, on whichever sale that line ends up in. A sale that has already been invoiced cannot be split")]},
]

DEP='You are on a part sale in Estimate, Approved or Complete status, signed in as a user with Part Sales -> Create & Edit AND Invoicing & Payments -> Create & Edit. Open the Finance tab.'
S8CASES=[
{"anchors":["S8-R1","S8-R2","S8-R3"],"title":"Add Deposit on the Finance tab opens the work order's dialog, worded for a part sale",
 "pre":[DEP],
 "steps":['On the Finance tab, find and use Add Deposit.','Read the dialog and its memo default.','Confirm Add Deposit is available while the sale is Estimate, Approved or Complete.'],
 "results":[
   'The part sale Finance tab offers Add Deposit.',
   'The dialog is the one a work order uses, worded for a part sale, and the memo pre-fills with "Deposit for Part Sale" and the sale number.',
   'A deposit can be added while the sale is Estimate, Approved or Complete.'],
 "source":S8,
 "quotes":[("S8-R1","The part sale Finance tab offers Add Deposit"),
           ("S8-R2","The dialog is the one a work order uses, worded for a part sale, and the memo pre-fills with “Deposit for Part Sale” and the sale number"),
           ("S8-R3","A deposit can be added while the sale is Estimate, Approved or Complete")]},
{"anchors":["S8-R4","S8-R5"],"title":"A deposit shows in payment history at once and auto-applies to the invoice",
 "pre":[DEP,'A deposit that will be recorded and the sale then invoiced.'],
 "steps":['Record a deposit and check the sale\'s payment history immediately.','Invoice the sale and confirm the deposit is applied to the invoice automatically.'],
 "results":[
   'The deposit shows in the sale\'s payment history immediately.',
   'When the sale is invoiced, the deposit is applied to the invoice automatically.'],
 "source":S8,
 "quotes":[("S8-R4","The deposit shows in the sale's payment history immediately"),
           ("S8-R5","When the sale is invoiced, the deposit is applied to the invoice automatically")]},
{"anchors":["S8-R6","S8-R7"],"title":"A deposit is never gated on a core, and Record Deposit captures the shop's own methods",
 "pre":[DEP,'Cores on the sale in various states (charged, returned).'],
 "steps":['Confirm Add Deposit is available whatever state the cores on the sale are in.','Use Record Deposit to capture a deposit taken by one of the shop\'s own methods.'],
 "results":[
   'A deposit is never gated on a core; it can be added whatever state the cores on the sale are in.',
   'Record Deposit captures a deposit taken by any of the shop\'s own methods, exactly as it does on a work order.'],
 "source":S8,
 "quotes":[("S8-R6","A deposit is never gated on a core; it can be added whatever state the cores on the sale are in"),
           ("S8-R7","Record Deposit captures a deposit taken by any of the shop's own methods, exactly as it does on a work order")]},
{"anchors":["S8-R8","S8-R9","S8-R10","S8-R11"],"title":"Collect in Portal is offered only when the portal says yes, disabled with the portal's reason when it declines",
 "pre":[DEP,'The shop takes online payments and the user has Customer Portal access; test both a portal that confirms it can collect and one that declines.'],
 "steps":['Confirm ShopView asks the Customer Portal whether it can collect for this sale before offering the handoff.','When the portal says yes, use Collect in Portal to hand the customer to the portal to pay.','When the portal declines, read the Collect in Portal button state and its hover.','Confirm a portal-collected deposit lands on the correct sale and shows in its payment history.'],
 "results":[
   'ShopView asks the Customer Portal whether it can collect for this sale before offering the handoff, and offers it only on a yes; Collect in Portal then hands the customer to the Customer Portal to pay, on a card reader or online, on whatever device is already open.',
   'When the portal declines, Collect in Portal stays visible, is disabled, and shows the portal\'s own reason on hover.',
   'A deposit collected through the portal lands on the correct part sale and shows in its payment history.'],
 "source":S8,
 "quotes":[("S8-R8","Collect in Portal hands the customer to the Customer Portal to pay, on a card reader or online, on whatever device is already open"),
           ("S8-R9","ShopView asks the Customer Portal whether it can collect for this sale before offering the handoff, and offers it only on a yes"),
           ("S8-R10","When the portal declines, Collect in Portal stays visible, is disabled, and shows the portal's own reason on hover"),
           ("S8-R11","A deposit collected through the portal lands on the correct part sale and shows in its payment history")]},
{"anchors":["S8-R12"],"title":"A part sale deposit syncs to QuickBooks on the same terms as a work order deposit",
 "pre":[DEP,'QuickBooks connected with the one-time bookkeeping consent given.'],
 "steps":['Record a deposit and let it sync to QuickBooks; confirm it appears as an unapplied payment behind the same one-time consent.','Invoice the sale and confirm the deposit is applied when the invoice is created.'],
 "results":[
   'A deposit on a part sale syncs to QuickBooks on the same terms as a deposit on a work order: as an unapplied payment, behind the same one-time consent, applied when the invoice is created.'],
 "source":S8,
 "quotes":[("S8-R12","A deposit on a part sale syncs to QuickBooks on the same terms as a deposit on a work order: as an unapplied payment, behind the same one-time consent, applied when the invoice is created")]},
{"anchors":["S8-R13"],"title":"While a part sale holds a deposit, its customer cannot be changed and it cannot be deleted",
 "pre":[DEP,'A part sale that holds a deposit.'],
 "steps":['Attempt to change the customer on a sale holding a deposit.','Attempt to delete a sale holding a deposit.','Remove the deposit and confirm both become possible again.'],
 "results":[
   'While a part sale holds a deposit, its customer cannot be changed and the sale cannot be deleted; both are refused until the deposit is removed.'],
 "source":S8,
 "quotes":[("S8-R13","While a part sale holds a deposit, its customer cannot be changed and the sale cannot be deleted. Both are refused until the deposit is removed")]},
{"anchors":["S8-R14"],"title":"A deposit is charged to the account of the location that owns the part sale",
 "pre":[DEP,'A part sale owned by one location while the user has a different location selected.'],
 "steps":['Take a deposit while a different location is selected and confirm which location\'s account it charges.'],
 "results":[
   'A deposit is charged to the account of the location that owns the part sale, not the location the user happens to have selected.'],
 "source":S8,
 "quotes":[("S8-R14","A deposit is charged to the account of the location that owns the part sale, not the location the user happens to have selected")]},
{"anchors":["S8-N1"],"title":"Add Deposit is refused once the sale is invoiced or paid",
 "pre":['An invoiced or paid part sale on its Finance tab.'],
 "steps":['Attempt Add Deposit on an invoiced or paid sale and read the refusal.'],
 "results":[
   'Once the sale is invoiced or paid, Add Deposit refuses with "A deposit can only be added to a part sale that has not been invoiced." (money against an invoice is a payment, not a deposit).'],
 "source":S8,
 "quotes":[("S8-N1","Once the sale is invoiced or paid, Add Deposit refuses with “A deposit can only be added to a part sale that has not been invoiced.” Money against an invoice is a payment, not a deposit")]},
{"anchors":["S8-N2"],"title":"Add Deposit needs both permissions; the server also refuses without Invoicing & Payments",
 "pre":['Sign in as a user without one or both of Part Sales -> Create & Edit and Invoicing & Payments -> Create & Edit.'],
 "steps":['Confirm a user without either permission is not offered Add Deposit.','Confirm a user without Invoicing & Payments -> Create & Edit is refused by the server as well.'],
 "results":[
   'A user without either permission is not offered Add Deposit; a user without Invoicing & Payments -> Create & Edit is refused by the server as well, as on a work order.'],
 "source":S8,
 "quotes":[("S8-N2","A user without either permission above is not offered Add Deposit. A user without Invoicing & Payments -> Create & Edit is refused by the server as well, as on a work order")]},
{"anchors":["S8-N3","S8-N5"],"title":"An unreachable portal is treated as declined; Collect in Portal is not rendered where a work order hides it",
 "pre":[DEP,'A Customer Portal that cannot be reached; and a shop that does not take online payments / a user with no Customer Portal access.'],
 "steps":['With the portal unreachable, confirm the handoff is treated as declined and stays disabled, and recording the deposit still works.','Where the shop takes no online payments or the user has no portal access, confirm Collect in Portal is not rendered at all.'],
 "results":[
   'If the Customer Portal cannot be reached, the handoff is treated as declined and stays disabled; recording the deposit is unaffected.',
   'Collect in Portal is not rendered at all when the shop does not take online payments, or when the user has no Customer Portal access (both match the work order, which hides the action); the disabled-with-reason state is only for a portal that is asked and actively declines.'],
 "source":S8,
 "quotes":[("S8-N3","If the Customer Portal cannot be reached, the handoff is treated as declined and stays disabled. Recording the deposit is unaffected"),
           ("S8-N5","Collect in Portal is not rendered at all when the shop does not take online payments, or when the user has no Customer Portal access ... S8-R10's disabled-with-reason state is only for a portal that is asked and actively declines")]},
{"anchors":["S8-N4"],"title":"Until the portal accepts part sales, the portal requirements are unreachable but the rest of the story is live",
 "pre":[DEP,'The Customer Portal does not yet accept part sales (the standing Open Question, SV-10261).'],
 "steps":['Confirm the portal handoff (S8-R8, S8-R11) is unreachable and Collect in Portal shows the portal\'s reason.','Confirm every other requirement in Story 8 is live.'],
 "results":[
   'Until the Customer Portal accepts part sales, S8-R8 and S8-R11 are unreachable and the action shows the portal\'s reason; every other requirement in this story is live.'],
 "source":S8,
 "quotes":[("S8-N4","Until the Customer Portal accepts part sales, S8-R8 and S8-R11 are unreachable and the action shows the portal's reason. Every other requirement in this story is live")]},
{"anchors":["S8-E1"],"title":"Deposits exceeding the total settle the invoice to zero, mark it Paid, and become a customer credit",
 "pre":[DEP,'Deposits on a sale that exceed its total, including the case where returning a core reduces the total afterwards.'],
 "steps":['Take deposits exceeding the sale total (or return a core so the total drops below the deposits), invoice the sale, and read the invoice state and balance.'],
 "results":[
   'If the deposits on a sale exceed its total — including when returning a core reduces the total afterwards — the invoice is settled to zero, it is marked Paid rather than Partially Paid, and the surplus becomes a customer credit.'],
 "source":S8,
 "quotes":[("S8-E1","If the deposits on a sale exceed its total - including when returning a core reduces the total afterwards - the invoice is settled to zero, it is marked Paid rather than Partially Paid, and the surplus becomes a customer credit")]},
]
for code,cases in [("S3",S3CASES),("S4",S4CASES),("S5",S5CASES),("S6",S6CASES),("S7",S7CASES),("S8",S8CASES)]:
    L.run(code,cases)
