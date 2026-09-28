import importlib.util
spec=importlib.util.spec_from_file_location("rebuild_lib","rebuild-2026-09-28/rebuild_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

WO='Open a work order with parts awaiting receipt: top menu "Work Orders" > open a work order by clicking its row > its "Lines" tab.'
ORD='You are signed in with "Order Parts" (which requires "See Financial Data"); assigning a vendor from inside the modal also needs "Vendor & Order Mgmt: Create & Edit".'
POPAGE='Open the purchase-order receive page: top menu "Parts" > the "Receive vendor parts" page. Purchase orders are grouped into cards by vendor, each card collapsed, with a bottom bar showing COST TOTAL / PARTS SELECTED / POS SELECTED and a "Receive selected" button.'
def S(story,jira,name): return f'Epic SV-8683; story {jira} (Story {story}, {name}); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story {story}; read 28 Sep 2026.'
S13=S(13,"SV-9259","Receiving from the work order"); S14=S(14,"SV-9260","The receive page and PO bulk receive"); S15=S(15,"SV-9261","Receive later")

CASES=[
# ---- Receiving (6670) ----
{"id":44583,"title":"Receive opens a modal (no navigation); its contents depend on the entry point",
 "pre":[ORD,WO,'The work order has parts awaiting receipt from two different vendors and at least one vendorless part.'],
 "steps":['Open Receive from a part row whose part has a vendor.','Close it; open Receive from a part row whose part has no vendor.','Open Receive from a line\'s ... menu, and from the bulk action bar / completion wizard.','Each time, note what the modal contains and what is pre-ticked.'],
 "results":[
   'Every entry point opens a modal (no navigation to another page) — the same modal in all four cases.',
   'Contents depend on where it opened: part row with a vendor -> every part on this work order from that same vendor still awaiting, all ticked; part row with no vendor -> every vendorless part on this work order, none ticked; a line menu -> that line\'s outstanding parts; the bulk bar or wizard -> every outstanding part on the work order.',
   'The settings never change what the modal contains (Require receiving only decides where the Receive control lives and whether outstanding parts block invoicing). Same-vendor parts are pre-ticked (they arrive together); vendorless parts are not.'],
 "source":S13,
 "quotes":[("Story 13","Receive from a part row, a line menu, the bulk action bar or the completion wizard opens a modal. There is no navigation, and it is the same modal in all four cases"),
           ("Story 13","The settings never change what the modal contains"),
           ("Story 13","Same-vendor parts are pre-ticked because they normally arrive together in one delivery. Vendorless parts are not")]},

{"id":44584,"title":"Receiving requires vendor, invoice number and date; cost and tax prefilled, may be zero",
 "pre":[ORD,WO,'Open the Receive modal and expand a vendor card that has parts to receive.'],
 "steps":['Read the fields in the expanded card and their prefilled values.','Clear the vendor invoice number and try to receive.','Change a cost and watch for the sell-price note; enter a quantity greater than the quantity ordered.'],
 "results":[
   'The expanded card shows vendor invoice number, invoice date (defaults to today) and delivery note on one row, then the parts. Vendor, vendor invoice number and invoice date are all required, and the receive button stays disabled until they are filled.',
   'Cost is required and may be zero, arriving prefilled from the purchase-order cost; tax is required and may be zero, prefilled from the vendor\'s tax rate (falling back to zero only when nothing can derive it). The delivery note is optional.',
   'Quantity received must be greater than zero, may include decimals, and may exceed what was ordered (the excess is shown, not blocked; the purchase order absorbs it). Changing a cost shows a note that the sell price will update.'],
 "source":S13,
 "quotes":[("Story 13","Vendor, vendor invoice number and invoice date are all required to receive"),
           ("Story 13","Cost is required and may be zero. It is never left empty, because the field arrives prefilled with the cost already on the purchase order"),
           ("Story 13","Tax is required and may be zero. It arrives prefilled from the vendor's own tax rate"),
           ("Story 13","Quantity received must be greater than zero, may include decimals, and may exceed what was ordered. The excess is shown but not blocked and the purchase order absorbs it")]},

{"id":44585,"title":"Vendor-missing card requires Assign vendor first; it applies to ticked parts only",
 "pre":[ORD,WO,'The Receive modal is open and includes a vendor-missing card with several parts.'],
 "steps":['Expand the vendor-missing card and note the first field and what is disabled.','Tick some (not all) parts, type a vendor name that matches an existing vendor, and assign.','Type a name that matches nothing and use the Create option.'],
 "results":[
   'Where no vendor is set, "Assign vendor" is the first field, marked required, a search field; everything below it is disabled until a vendor is chosen.',
   'Assigning a vendor applies to the ticked parts only — the rest stay in the vendor-missing card.',
   'A vendor that does not exist yet can be created from the field: a name matching nothing offers "Create" with the typed name, which opens the existing new-vendor modal (name and tax rate required) to finish there.'],
 "source":S13,
 "quotes":[("Story 13","Where no vendor is set, Assign vendor is the first field in the form, marked required"),
           ("Story 13","Assigning a vendor applies to the ticked parts only. The rest stay in the vendor-missing card"),
           ("Story 13","A vendor that does not exist yet can be created from that field ... Name and tax rate are both required")]},

{"id":44586,"title":"Each receive belongs to one purchase order; the same invoice number may repeat across a vendor's POs",
 "pre":[ORD,WO,'A vendor that has parts on two separate purchase orders on this work order.'],
 "steps":['Receive against the first purchase order, entering an invoice number.','Receive against the second purchase order for the same vendor and enter the same invoice number.'],
 "results":[
   'A panel is expanded per purchase order, so every figure entered belongs to exactly one purchase order and one vendor bill.',
   'The same invoice number may be reused across several of a vendor\'s purchase orders; it is typed per purchase order and is not shared from the group header.'],
 "source":S14,
 "quotes":[("Story 14","A panel is expanded per purchase order, not per vendor, so every figure entered in it belongs to exactly one purchase order and one vendor bill"),
           ("Story 14","The same invoice number may be reused across several of a vendor's purchase orders. It is typed per purchase order and is not shared from the group header")]},

{"id":44587,"title":"A user without See Financial Data can still receive; money fields are removed, not masked",
 "pre":['You are signed in as a user WITHOUT "See Financial Data" but able to receive (e.g. via Vendor & Order Mgmt or Order Parts as configured).',WO,'Open the Receive modal / receive page.'],
 "steps":['Look for cost, tax, subtotal, total and sell columns.','Complete a receive without ever entering a money value.'],
 "results":[
   'Cost, tax, subtotal, total and sell are absent (removed, not masked); no text reveals a price by implication (e.g. no cost-vs-sell warning).',
   'Receiving still works, because those fields arrive prefilled and are never asked of this user — no money field is ever both hidden and required.'],
 "source":S(21,"SV-9267","Permissions on the new surfaces")+' (money rules also stated in Story 14.)',
 "quotes":[("Story 14","Without See Financial Data the cost, tax, subtotal, total and sell columns are absent, not masked. Receiving still works, because those fields arrive with a value and are never asked of that user"),
           ("Story 21","No money field is ever both hidden and required")]},

{"id":44588,"title":"Receive rejects a blank part number and locks cost once invoiced; unready parts are not offered",
 "pre":[ORD,WO,'A receive with a part whose part number is blank, and a separately-set-up Invoiced work order.'],
 "steps":['Blank a part number in the modal and watch the field and the receive button.','Look at whether parts that are not yet ordered, or on lines that are not approved, appear in the modal.','On an Invoiced/Paid work order, check whether cost can be edited.'],
 "results":[
   'Part number is required (red border until filled); the receive button stays disabled while anything required is unfilled.',
   'Only parts that are ordered and on approved lines appear in the receive modal — parts not yet ordered, and parts on lines that are not approved, are not offered.',
   'Cost is locked once the work order is invoiced or paid.'],
 "source":S14,
 "quotes":[("Story 14","cost and tax required but able to be zero and always arriving prefilled, quantity rules the same, part number required, cost locked once invoiced or paid"),
           ("Story 13","Excluded: parts not yet ordered, and parts on lines that aren't approved")]},

{"id":53487,"title":"A vendor can be corrected until a part is received, then it is fixed",
 "pre":[ORD,POPAGE,'A purchase order marked "Vendor missing" (or with an assignable vendor) that has no received parts yet.'],
 "steps":['Assign or replace the vendor while nothing on the purchase order is received.','Receive one part on that purchase order.','Try to change the vendor again.'],
 "results":[
   'The vendor stays changeable only while the purchase order has no received parts; once anything on it is received the name is shown as text with no edit affordance.',
   'Missing-vendor groups carry an amber treatment and a "Vendor missing" label until resolved, then show the vendor name.'],
 "source":S14,
 "quotes":[("Story 14","The vendor stays changeable only while the purchase order has no received parts; once anything on it is received the name is shown as text, with no edit affordance"),
           ("Story 14","Missing-vendor groups carry an amber treatment and a Vendor missing label in both states. Once resolved they show the vendor name")]},

# ---- Purchase Order Pages (6671) ----
{"id":44589,"title":"Purchase-order page groups by vendor, missing vendors first, all collapsed",
 "pre":['You are signed in with "Vendor & Order Mgmt: Create & Edit".',POPAGE],
 "steps":['Open the page and read the grouping, the group headers and the default collapsed/expanded state.'],
 "results":[
   'Purchase orders group by vendor, with Missing vendors first, then named vendors alphabetically; every group renders collapsed (including Missing vendors), so the page opens as a list of vendors, not a wall of parts.',
   'Group headers carry the vendor name, a rollup such as "3 POs, 6 parts", and Expand all; the page header carries the vendor count.',
   'Each purchase-order row shows its number, the work order number and the part count.'],
 "source":S14,
 "quotes":[("Story 14","Purchase orders group by vendor, with Missing vendors first, then named vendors alphabetically"),
           ("Story 14","Every group renders collapsed, including Missing vendors, so the page opens as a list of vendors rather than a wall of parts"),
           ("Story 14","Each purchase order row shows its number, the work order number and the part count")]},

{"id":44590,"title":"A panel expands per purchase order with per-PO vendor-side fields and read-only sell",
 "pre":['You are signed in with "Vendor & Order Mgmt: Create & Edit" and "See Financial Data".',POPAGE],
 "steps":['Expand a purchase order and read the fields, the tick boxes and the money figures.','Change a cost or quantity and check whether the tax recomputes.'],
 "results":[
   'A panel expands per purchase order (not per vendor): vendor invoice number, invoice date, delivery note, then the parts with per-part tick boxes and Deselect all, and a subtotal, editable tax and total beneath. The primary action reads "Receive parts (n)", disabled while anything required is unfilled.',
   'The tax typed here is vendor-side — stored on the vendor bill with the invoice number/date/due date and feeding what the shop owes its suppliers; it is NOT the sales tax charged to the customer. It is typed, not calculated, and changing a cost or quantity afterwards does not recompute it.',
   'Sell price is shown here and only here, read-only, on every purchase order.'],
 "source":S14,
 "quotes":[("Story 14","A panel is expanded per purchase order, not per vendor"),
           ("Story 14","The tax typed here is vendor-side ... It is not the sales tax charged to the customer"),
           ("Story 14","Sell price is shown here and only here, read-only, on every purchase order")]},

{"id":44591,"title":"Receive page validity matches the modal; money hidden without permission; sell not shown from Parts",
 "pre":[POPAGE,'Have one user with "See Financial Data" and one without.'],
 "steps":['Compare the receive-page required fields and rules with the work-order receive modal.','As the user without See Financial Data, check the money columns.','Check whether sell price appears on the receive page reached from Parts.'],
 "results":[
   'Everything that makes a receive valid is identical to the modal: vendor, invoice number and invoice date required; cost and tax required but able to be zero and always prefilled; the same quantity rules; part number required; cost locked once invoiced or paid.',
   'Sell price is not shown in the receive modal or on the receive page reached from Parts.',
   'Without "See Financial Data" the cost, tax, subtotal, total and sell columns are absent (not masked); receiving still works because those fields arrive with a value.'],
 "source":S14,
 "quotes":[("Story 14","Everything that makes a receive valid is identical to the receive modal: vendor, invoice number and invoice date required, cost and tax required but able to be zero and always arriving prefilled"),
           ("Story 14","Sell price is not shown in the receive modal or on the receive page reached from Parts"),
           ("Story 14","Without See Financial Data the cost, tax, subtotal, total and sell columns are absent, not masked")]},

{"id":53488,"title":"PO list-page selection raises the shared bulk bar; Select all covers one page only",
 "pre":['You are signed in with "Vendor & Order Mgmt: Create & Edit".',POPAGE,'The list holds more purchase orders than fit on one page (it loads more on scroll).'],
 "steps":['Select several purchase orders and read the bar that appears; open More.','Press Select all, then scroll down the list.'],
 "results":[
   'Selecting purchase orders raises the SAME bulk action bar as the work order: "n selected", Deselect all, "Receive selected" (primary), More, close — with the same dividers, and no amber treatment on the bar.',
   '"Assign vendor" is not the primary action — it lives in More and acts only on the selected rows that have no vendor.',
   'Select all selects what is loaded, which is one page (the list pages at 30 rows), so after Select all and scrolling you find unselected rows below — a known paged-list behaviour, raised as a question rather than a defect.'],
 "source":S14,
 "quotes":[("Story 14","Selecting purchase orders on the list page raises the same bulk action bar as the work order, not a bar of its own design"),
           ("Story 14","Assign vendor is not the primary action on that bar. It belongs to a row ... It lives in More"),
           ("Story 14","Select all selects what is loaded, which is one page")]},

# ---- Receive Later (6672) ----
{"id":44592,"title":"Receive becomes a split button offering Received later, chosen per part",
 "pre":['You are signed in with the "Received later" permission, and "Require receiving parts before completion" is ON.',WO,'The work order has parts awaiting receipt.'],
 "steps":['Look at the Receive control on a part row, in the bulk bar, and on the wizard\'s receive step; open its caret.','Choose "Received later" for one part in a modal that holds several.'],
 "results":[
   'Receive becomes a split button: Receive, a divider, and a caret offering "Received later"; it is available on the part row, in the bulk action bar and on the wizard\'s receive step.',
   'It is chosen per part, never for a whole card at once — each part carries its own choice, so a delivery where three parts arrived with a bill and one without is recorded truthfully in one pass.',
   'Choosing it sets the part to "Received later", removes its Receive affordance from the row and toasts; the part then satisfies completion (no longer blocks the work order) but keeps counting in the Waiting on Parts column. It stays receivable later from its ... menu, which then asks for the invoice number.'],
 "source":S15,
 "quotes":[("Story 15","Receive becomes a split button: Receive, a divider, and a caret offering Received later"),
           ("Story 15","It is chosen per part, never for a whole card at once"),
           ("Story 15","A deferred part keeps counting in the Waiting on Parts column, because a vendor bill is still to come")]},

{"id":44593,"title":"Without the permission or the setting, no Received later option appears",
 "pre":['Two setups: (a) a user WITHOUT the "Received later" permission; (b) "Require receiving parts before completion" turned OFF.',WO],
 "steps":['As the user without the permission, look at the Receive control for a caret.','With Require receiving OFF, look for a split button anywhere.'],
 "results":[
   'Without the permission, Receive is a plain button with no caret anywhere, and a missing vendor bill has no workaround.',
   'With Require receiving OFF there is nothing to defer and no split button appears.',
   '"Received later" is never duplicated in the part\'s ... menu while the split button is showing; deferring creates no vendor bill, moves no stock and does not touch the accounting system.'],
 "source":S15,
 "quotes":[("Story 15","Without the permission, Receive is a plain button with no caret anywhere, and a missing vendor bill has no workaround"),
           ("Story 15","Require receiving parts before completion is on. With it off there is nothing to defer and no split button appears"),
           ("Story 15","Deferring does not create a vendor bill, move stock or touch the accounting system")]},

{"id":53489,"title":"Deferring a part with a core: the core follows the parent and is never offered its own choice",
 "pre":['"Received later" permission and "Require receiving" ON.',WO,'A part that carries a core charge is awaiting receipt.'],
 "steps":['Choose "Received later" on the parent part and check the core sibling.','Later, receive the parent from its ... menu and check the core.','Try to complete the line while the core is unresolved.'],
 "results":[
   'Choosing Received later on the parent puts the core sibling in the same state; the pair stays consistent and neither blocks completion on its own.',
   'The core is never offered a Received later choice of its own (it has no separate vendor bill) — no caret, no row action while the parent is deferred, and it never appears twice.',
   'Receiving the parent later resolves the core with it, in the same pass and under the same invoice number; but an unresolved core is still asked before the line completes. Deferring moves no stock and creates no core credit.'],
 "source":S15,
 "quotes":[("Story 15","A part that carries a core charge can be deferred, and its core follows the parent"),
           ("Story 15","The core is never offered a Received later choice of its own, because it has no separate vendor bill"),
           ("Story 15","An unresolved core is still asked for before the line completes")]},
]
L.run(CASES,"rebuild-2026-09-28/update-log.jsonl")
