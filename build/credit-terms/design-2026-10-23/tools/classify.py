"""Classification rules for the Credit terms text inventory (23 Oct 2026). Each entry: text -> (class, note[, codes[, register id]]).
Read with make_inventory.py. Every decision was made by reading the text in its picture/board, not by pattern alone."""

OOS_EXISTING = "existing screen or dialog field, unchanged by PRD v3 (the PRD adds only Credit Terms / Credit Limit and the new page); not part of this feature"
OOS_CHROME = "app chrome (top bar, side menu items other than Finance > Payment Methods / Credit Terms): unchanged by PRD v3"
OOS_SSR = "Splitting Sales Representatives fields (SV-10890), drawn here only as context (board notes say so); another suite"
A11Y = "accessible name (aria-label) of an icon button, read by screen readers, never shown on screen; PRD silent"
ICON = "icon ligature name of the design's Material icon (renders as an icon, not as text)"

def _all(texts, cls, note, codes=None, reg=None):
    return {t: (cls, note, codes or [], reg) for t in texts}

EXPLICIT = {}
# ---- the differences (register)
EXPLICIT.update({
 "Payment is due on the invoice date, but you can create the invoice without taking payment.":
   ("SPEC-CONFLICT", "Design: \"Payment is due on the invoice date, but you can create the invoice without taking payment.\" PRD v3 S1-R8 / §8: \"Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment.\"", ["S1-R8", "§8 row \"Hover the info icon on Due on Receipt\""], "CT-D01, question 1"),
 "Over Limit": ("SPEC-CONFLICT", "Letter case (L-04): today's badge reads \"Over Limit\"; PRD writes \"Over limit\" (S9-R2). Settled by S9-R3 / S9 Form factor (existing badge, wording unchanged): cases name the badge as the screen shows it", ["S9-R2", "S9-R3"], "CT-D07 (settled)"),
})
# ---- PRD names (fix codes / notes where the automatic match picked a weak line)
EXPLICIT.update({
 "COD": ("PRD-MATCH", "standard term name", ["§5 Standard term", "S1-R7"]),
 "Due on Receipt": ("PRD-MATCH", "standard term name", ["§5 Standard term", "S1-R7"]),
 "Credit Hold": ("PRD-MATCH", "standard term name", ["§5 Standard term", "S1-R7"]),
 **{f"Net {n}": ("PRD-MATCH", "standard term name", ["§5 Standard term"]) for n in (7, 15, 20, 30, 45, 50, 60, 90, 120)},
 "Name": ("PRD-MATCH", "column heading and New Credit Term field (named, not quoted)", ["S1-R4", "S3-R2"]),
 "Due": ("PRD-MATCH", "column heading (named, not quoted)", ["S1-R4"]),
 "Customers": ("PRD-MATCH", "column heading (S1-R4); also the top-bar menu item (app chrome)", ["S1-R4"]),
 "Vendors": ("PRD-MATCH", "column heading (S1-R4); also an Imports side-menu item (app chrome)", ["S1-R4"]),
 "Event": ("PRD-MATCH", "log column (named, not quoted)", ["S12-R2"]), "User": ("PRD-MATCH", "log column", ["S12-R2"]),
 "Details": ("PRD-MATCH", "log column", ["S12-R2"]), "Date": ("PRD-MATCH", "log column", ["S12-R2"]), "Time": ("PRD-MATCH", "log column", ["S12-R2"]),
 "Search": ("PRD-MATCH", "the log's search box (\"a search box\"); also today's search on Customers/Vendors pages", ["S12-R2"]),
 "Days": ("PRD-MATCH", "the Days box (bold in the PRD, not quoted)", ["S3-R2"]), "Day": ("PRD-MATCH", "the Day box", ["S3-R2"]),
 "Close": ("PRD-MATCH", "\"Success toast with a Close action\" (§8, Make Default confirmed); the design shows Close on every toast and as the dialogs' × accessible name", ["§8 row \"Make Default confirmed\"", "S3-N3", "S4-R22"]),
 "Save": ("PRD-MATCH", "New/Edit Customer button (\"presses Save\")", ["S5-R10", "S11-R6"]),
 "Save & Close": ("PRD-MATCH", "New/Edit Vendor button (\"presses Save & Close\")", ["S6-R5", "S11-R7"]),
 "New Customer": ("PRD-MATCH", "window title and button (named, not quoted)", ["S5-R1", "S5-R15"]),
 "Edit Customer": ("PRD-MATCH", "window title (named, not quoted)", ["S5-R1", "S5-R7"]),
 "New Vendor": ("PRD-MATCH", "window title", ["S6-R1", "S6-R2"]), "Edit Vendor": ("PRD-MATCH", "window title", ["S6-R1", "S6-R3"]),
 "New Work Order": ("PRD-MATCH", "window title / button (\"opens a new work order\"; §8 \"Over credit limit on New Work Order\")", ["S9-R1", "§8 row \"Over credit limit on New Work Order\""]),
 "Settings": ("PRD-MATCH", "side menu (Settings) and the Settings page item; Credit Terms sits under Settings", ["S1-R1"]),
 "Finance": ("PRD-MATCH", "side-menu group (\"in the Finance group\"); shown in capitals like every group heading", ["S1-R1"]),
 "FINANCE": ("LOOK-ONLY", "the Finance group heading as the side menu shows every group heading, in capitals (build captures); PRD: \"in the Finance group\" (S1-R1)", ["S1-R1"]),
 "Payment Methods": ("PRD-MATCH", "\"directly below \"Payment Methods\"\"", ["S1-R1"]),
 "Credit term": ("PRD-MATCH", "customer and vendor card label", ["S5-R8", "S6-R3", "§5"]),
 "Terms": ("LOOK-ONLY", "today's invoice reference chip label \"Terms\" (production picture before-invoice.png shows \"Terms Net 30\"); PRD: \"invoices print the plain name\" (S5-R8) without naming the label"),
 "Credit limit": ("LOOK-ONLY", "today's customer / vendor card label (production pictures); PRD names the field \"Credit Limit\" on the windows (S5-R1) and never quotes the card label"),
 "Net 10": ("DATA", "a term the demo shop created (PRD example \"Net 10\", S3-E1/S7-R1)"),
 "Net 14": ("DATA", "demo shop term"), "Net 14 Days": ("DATA", "demo name typed in New Credit Term (the PRD's own example, S3-R5)"),
 "Net 2": ("DATA", "demo shop term (5 days: name and rule independent, S3-E1)"), "Net 5": ("DATA", "demo shop term"), "Net 6": ("DATA", "demo shop term (25th of the following month, S3-E1)"),
 "10th of next month": ("DATA", "demo shop term (the PRD's own example name, S3-R5)"),
 "net 30": ("DATA", "typed name in the validation picture (the PRD's own example, S3-R9)"),
 "Net 45 Fleet Accounts Payable X": ("DATA", "the 31-character demo name (S3-R2 maximum)"),
 "Net 45 Fleet Accounts Payable X created": ("PRD-MATCH", "toast \"{name} created\"", ["S3-R7", "§8 row \"Credit term created\""]),
 "Paid": ("OUT-OF-SCOPE", "work order status badge on the customer page; " + OOS_EXISTING),
 "Delete": ("OUT-OF-SCOPE", "Edit Customer's existing Delete button; " + OOS_EXISTING),
 "Add": ("OUT-OF-SCOPE", "New Work Order's existing Add buttons; " + OOS_EXISTING),
 "Status": ("OUT-OF-SCOPE", "work-order table heading / Status filter; " + OOS_EXISTING),
 "Notes": ("OUT-OF-SCOPE", "Notes field / tab of existing windows; S4-R11 notes are written to the customer's Notes but no board draws one"),
 "City": ("OUT-OF-SCOPE", OOS_EXISTING), "Country": ("OUT-OF-SCOPE", OOS_EXISTING), "Contacts": ("OUT-OF-SCOPE", OOS_EXISTING),
 "Customer": ("OUT-OF-SCOPE", "New Work Order Customer field; " + OOS_EXISTING), "Invoices": ("OUT-OF-SCOPE", "customer page tab / Imports item; " + OOS_EXISTING),
 "Parts": ("OUT-OF-SCOPE", OOS_CHROME), "Service": ("OUT-OF-SCOPE", OOS_CHROME), "Roles & Permissions": ("OUT-OF-SCOPE", OOS_CHROME),
 "QuickBooks": ("OUT-OF-SCOPE", OOS_CHROME), "IBS": ("OUT-OF-SCOPE", OOS_CHROME + "; also the IBS field of the customer windows"), "Imports": ("OUT-OF-SCOPE", OOS_CHROME),
 "ShopView": ("OUT-OF-SCOPE", "logo accessible name; app chrome"), "Sales Representative": ("OUT-OF-SCOPE", OOS_SSR),
 "Work Order": ("OUT-OF-SCOPE", "invoice reference chip \"Work Order S2-…\"; " + OOS_EXISTING),
 "Always available": ("LOOK-ONLY", A11Y + " (the lock icon); the visible tooltip is \"Always available.\" (S1-R9)"),
 "Actions": ("LOOK-ONLY", "the actions column's heading kept for screen readers and visually hidden, so the column shows no heading: PRD S1-R4 \"an unlabeled actions column\"", ["S1-R4"]),
 "More actions": ("LOOK-ONLY", A11Y + " (the page \"⋯\" button, S1-R2)"),
 "Add representative": ("OUT-OF-SCOPE", OOS_SSR), "×": ("LOOK-ONLY", "close icon of dialogs (S3-N3 / S4-R22 \"the close icon\")"),
 "…": ("LOOK-ONLY", "the page \"⋯\" button drawn as three dots (S1-R2)"),
 "Name *": ("LOOK-ONLY", "today's required Name label of New/Edit Customer and New/Edit Vendor (the PRD calls it \"The Name field\", S5-R10 / S6-R5)"),
 "Invoice date": ("LOOK-ONLY", "today's vendor-invoice label (before-vendor-bill.png); PRD names the invoice date in prose only"),
 "Due date": ("LOOK-ONLY", "today's vendor-invoice label (before-vendor-bill.png); PRD names due dates in prose only"),
 "Invoice date:": ("LOOK-ONLY", "today's invoice-document label (before-invoice.png)"), "Due date:": ("LOOK-ONLY", "today's invoice-document label (before-invoice.png); the value is what S7 checks"),
 "Invoice:": ("OUT-OF-SCOPE", OOS_EXISTING), "Edit customer": ("LOOK-ONLY", A11Y + " (customer card pencil)"), "Edit vendor": ("LOOK-ONLY", A11Y + " (vendor card pencil)"),
 "Edit vendor invoice": ("LOOK-ONLY", A11Y + " (vendor invoice card pencil)"),
 "Sales representative": ("OUT-OF-SCOPE", OOS_SSR + " (work order card label, small r, as today)"),
 "Empty bays, endless possibilities. Get Going!": ("OUT-OF-SCOPE", "today's empty work-order list on the customer page (production picture)"),
 "Enter a location": ("OUT-OF-SCOPE", "today's New Vendor name placeholder (branch-build picture)"),
 "PO is required": ("OUT-OF-SCOPE", OOS_EXISTING + " (production Edit Customer; the drawn Edit Customer leaves it out, see NOTES.md)"),
 "check": ("LOOK-ONLY", ICON + ": the tick on the selected row of the vendor Credit Terms picker (the customer picker tints the row without a tick)"),
 "check_circle": ("LOOK-ONLY", ICON + ": the success toast's icon"),
 "schedule": ("LOOK-ONLY", ICON + ": the clock icon of the new Credit Terms side-menu item"),
 "info": ("OUT-OF-SCOPE", ICON + " of the Settings side-menu item; app chrome"),
 "store": ("OUT-OF-SCOPE", ICON + " (Imports > Vendors); app chrome"),
 "Over credit limit confirmation": ("OUT-OF-SCOPE", "picture alt text (canvas framing)"),
 "Saved": ("OUT-OF-SCOPE", "figure heading (canvas framing)"),
 "Customer on a deactivated term": ("OUT-OF-SCOPE", "figure heading (canvas framing)"),
 "Edit Customer today": ("OUT-OF-SCOPE", "figure heading (canvas framing)"),
 "Move customers to another term": ("OUT-OF-SCOPE", "board title (canvas framing)"),
 "Default Credit Terms": ("OUT-OF-SCOPE", "canvas title (canvas framing)"),
 "Move Customers from a row menu: pick who moves and where, untick some, pick another term, and the result. Plus the menu for a user without the customer permissions. Light theme.":
   ("OUT-OF-SCOPE", "board note (canvas framing)"),
 "New credit term: day of the following month": ("OUT-OF-SCOPE", "figure heading (canvas framing)"),
 "Over Credit warning": ("OUT-OF-SCOPE", "board title (canvas framing)"),
})
_EXIST = ["Address", "Address 1", "Address 2", "Addresses", "ADDRESSES", "Asset", "ASSET", "Asset Here?", "Assets", "Assets (5)", "Assets (59)",
 "Authorizer", "Bill to", "BILL TO", "Category", "Contact", "Contacts (1)", "Contacts (19)", "Cost", "Created On", "Customer Name", "Customer PO",
 "Date received", "Days Open", "Default Labor Rate", "Default Shop Supplies", "Delivery Details", "Delivery items", "Department", "Deposits",
 "Description", "Email", "Eng Hrs", "ENG HRS", "Estimate", "Approved", "In Progress", "Invoiced", "Fees & Discounts (0)", "First Name", "IBS#",
 "Invoiced Date", "Invoiced I", "Invoices (74)", "Items cost:", "Last Name", "Lead technician", "Lead Technician", "Lines", "Lines (24)",
 "Manufacturer", "Max", "Mileage", "MILEAGE", "Min", "New Payment", "Notes (5)", "Number", "Ordered by", "Part Number", "Part Sales", "Parts (19)",
 "Payments", "Payments (2)", "Payments (44)", "Phone", "Pinned Notes:", "Plate", "PLATE", "Postal code", "Preferred", "Preventative maintenance",
 "Progress", "Quantity Delivered", "Received by", "Remit payment to", "REMIT PAYMENT TO", "Request IBS Approval", "SCOPE OF WORK",
 "Service - Perform LOF and inspection", "Service advisor", "Started", "Started:", "State/Province", "Stats", "Tax:", "Taxes", "Telephone", "Title",
 "Total Cost", "Total Hours:", "Total Price", "Total:", "Unit", "Unpaid Invoices", "Vendor Invoice", "VIN / Serial", "VIN / SERIAL", "VIN/Serial #",
 "Website", "Work Orders (157)", "Work performed", "WORK PERFORMED", "ZIP/Postal Code", "Add Contact", "Returns", "Vendor", "GST", "N/A",
 "Unassigned", "Lines (4)", "Contacts (4)", "Assets (17)", "Work Orders (27)", "Parts (2)", "Credit Limit"]
for t in _EXIST:
    if t not in EXPLICIT: EXPLICIT[t] = ("OUT-OF-SCOPE", OOS_EXISTING)
EXPLICIT["Credit Limit"] = ("PRD-MATCH", "the Credit Limit field (named, bold, not quoted)", ["S5-R1", "S5-R4"])
EXPLICIT["Unassigned"] = ("OUT-OF-SCOPE", OOS_SSR + " (empty sales representative)")
EXPLICIT["Vendor"] = ("OUT-OF-SCOPE", "vendor invoice card label; " + OOS_EXISTING)
_CHROME = ["ShopHub", "Work Orders", "Schedule", "Reports", "Dashboard", "Searc...", "Ctrl", "K", "Ctrl K", "Clock In", "Staging Heavy Duty - 9919",
 "AS", "Staff", "Locations", "Departments", "Taxes", "Labor Rates", "Canned Lines", "Fees & Discounts", "Asset Types", "Inspection Templates",
 "Pricing", "Bin Locations", "Categories", "Integrations", "Contacts", "Inventory", "SETTINGS", "SERVICE", "PARTS", "INTEGRATIONS", "IMPORTS",
 "SALES & SERVICE", "Catalog", "SUPPLY CHAIN", "Purchase Orders", "Vendor Invoices", "Search customers, work orders, ...", "Part Sales"]
for t in _CHROME:
    if t not in EXPLICIT or t in ("Contacts",): EXPLICIT.setdefault(t, ("OUT-OF-SCOPE", OOS_CHROME))
for t in ["account_balance", "apartment", "attach_money", "call", "category", "checklist_rtl", "fact_check", "groups_3", "inventory_2",
          "local_shipping", "location_on", "notifications_none", "payments", "receipt_long", "sell", "supervisor_account", "sync_alt", "timer", "verified_user"]:
    EXPLICIT[t] = ("OUT-OF-SCOPE", ICON + " of a side-menu or top-bar item; app chrome")
for t in ["Sales Representative - Part Sales", "Sales Representative - Service Labor", "Sales Representative - Service Parts",
          "Remove Sales Representative - Part Sales", "Remove Sales Representative - Service Parts", "Christian Wallace", "Jason Garrison", "Dylan Rush"]:
    EXPLICIT[t] = ("OUT-OF-SCOPE", OOS_SSR)
for term in ["10th of next month", "COD", "Credit Hold", "Due on Receipt"] + [f"Net {n}" for n in (7, 10, 15, 20, 30, 45, 50, 60, 90, 120)]:
    EXPLICIT[f"Actions for {term}"] = ("LOOK-ONLY", A11Y + " (the row's \"⋯\" button, S1-R4 / S2-R1)")

DEMO_DATA = set("""01 Service - Perform LOF and inspection|1XKZD49X9KJ123456|2019 Kenworth T880|2247 Spencer Roads|4 Star Truck Repair|62981 Kim Port|
7 Star Truck Repair|89680 Harper Mountain|9919 Shepard Road SE|A & J Truck & Trailer Repair|Aberdeen Diesel Services LLC|Aberdeen Truck Repair|
Abilene Mechanical Services|Abode Trucking & Repair|Accokeek Heavy Truck Repair Inc|Ada Truck Service & Repair|Adeel's Mobile Diesel Repair|
Ado Truck Center - Oasis|Adrian's Truck & Trailer Repair LLC|Affordable Diesel Performance|Affordable Fleet Services|Afzal's Truck & Trailer Repair|
Aguiar Truck Center|Ashley Bell|Becky Gonzales|British Columbia|Calgary, Alberta|Cameron Johnston|Canada|Carrie Johnson|CL1030|CL1340|CT Smoke Picked|
Cummins 12.5" ID X 13.25" OD DPF Gasket - ISX|Cummins 12.91" V-Band Clamp, ATD|Cummins 13.5" V-Band Clamp|Gonsoulin Diesel Services Inc|GSK1050|
HD-Emissions|HD-Exhaust|Heavy Duty - 9919|Hester|I-1393|Invoice: INV-S2-17610|Invoice: INV-S2-17655|Jefferson Truck Center - Roanoke|Jeffrey Jordan|
Lake Theresa|New Julieshire|New Julieshire, British Columbia|Nova Scotia|Nunavut|ONR-3722|Ontario|South Kennethside, Yukon Territory|Steven|Tim|
Venice Gardens ..|Venice Gardens Truck Repair|Audit Demo|Audit Demo 2|Admin ShopView""".replace("\n", "").split("|"))

CHROME_OOS = {}
FRAMING = set()

# ---- caption items: (class, note, codes, register)
FR = "canvas framing: where the picture came from (build, production, drawn); used to choose the comparison picture, not an app text"
SRC = "the design's own source note for the look (which component or production screen it copies); LOOK-ONLY, used under References from Design"
CAPTIONS = {}
def cap(t, cls, note, codes=(), reg=None): CAPTIONS[t] = (cls, note, list(codes), reg)
import json as _j, os as _o
_H = _o.path.dirname(_o.path.dirname(_o.path.abspath(__file__)))
_caps = set()
for _f in __import__("glob").glob(_o.path.join(_H, "extract", "*.dc.html.json")):
    for _fg in _j.load(open(_f))["figures"]: _caps.update(_fg["captions"])
for t in _caps:
    if t.startswith("Names and counts are demo data"): cap(t, "OUT-OF-SCOPE", "canvas framing: says the names and counts are demo data")
    elif t.startswith("Source:"): cap(t, "LOOK-ONLY", SRC)
    elif t.startswith(("Production, captured", "Captured on the branch build", "No build shot", "No before:")) and '"' not in t: cap(t, "OUT-OF-SCOPE", FR)
# hand decisions for every remaining caption item (read one by one, 23 Oct 2026)
P = "PRD-MATCH"; L = "LOOK-ONLY"; O = "OUT-OF-SCOPE"; X = "SPEC-CONFLICT"
for _row in [
 ("\"Cash on delivery. COD customers can't charge to account, so payment is taken when the invoice is created.\"", P, "quotes the PRD", ["S1-R8"], None),
 ("\"Move To\" is prefilled with the default for new customers (Due on Receipt) and lists every active term except the one being moved from.", P, "restates the PRD", ["S4-R7"], None),
 ("\"Payment is due on the invoice date, but you can create the invoice without taking payment.\"", X, "Design: \"Payment is due on the invoice date, but you can create the invoice without taking payment.\" PRD S1-R8: \"Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment.\"", ["S1-R8"], "CT-D01, question 1"),
 ("A customer not on Net 10 is never offered it. The list matches New Customer's.", P, "restates the PRD", ["S5-N2", "S5-R3"], None),
 ("A customer on \"10th of next month\". Terms prints the term's name; the due date is the 10th of the next month.", P, "restates the PRD", ["S5-R8", "S7-R2"], None),
 ("A new vendor starts on COD, as today: the shop default applies to new customers only (VendorDialog.vue keeps COD).", P, "restates the PRD", ["S6-R2"], None),
 ("A paid invoice shows \"Paid date\" in place of Due date, as today.", O, "today's behaviour of paid invoices (\"as today\"); PRD v3 silent; not changed by this feature"),
 ("A shop's own Net X term adds X days, like the standard Net terms.", P, "restates the PRD", ["S7-R1", "S7-R9"], None),
 ("A user with Settings → Finance but without Customers → Create & Edit or View and Manage AP/AR Data sees Move Customers greyed in every row menu, with the hover text \"You need Customers → Create & Edit and View and Manage AP/AR Data to move customers.\" (S4-N1). They can still make a default.", P, "quotes the PRD", ["S4-N1"], None),
 ("A vendor not on Net 10 is never offered it.", P, "restates the PRD", ["S6-N2"], None),
 ("Always the next month, even when the 10th of this month is still ahead or nearly here. Day 31 in a 30-day month uses its last day (Nov 30).", P, "restates the PRD", ["S7-R2", "S7-R3"], None),
 ("Any active term can be picked. COD is not offered because the customers are already on it.", P, "restates the PRD", ["S4-R7"], None),
 ("Any other term keeps the limit editable (the Net 10 customer above shows $5,000.00); blank means no limit.", L, "restates S5-R5; \"blank means no limit\" is the design's word for an empty limit (PRD S5-N4 \"no limit\"); the $5,000.00 vs the card's $0.00 is a demo-data mismatch (CT-D09)", ["S5-R5"], "CT-D09"),
 ("COD, Due on Receipt and Credit Hold are followed by the DS info icon (next two boards) and the lock icon; Net and day-of-month terms have neither, the Due column explains them. Lock hover: \"Always available. COD, Due on Receipt and Credit Hold can't be deactivated.\" (open on COD).", P, "restates and quotes the PRD (the PRD splits the tooltip into a line and a line below it)", ["S1-R8", "S1-R9", "S1-R10"], None),
 ("COD, Due on Receipt and Credit Hold never show Deactivate; the default never shows Make Default. The menu is 158px, as wide as its one item.", L, "restates S2-N2 / S2-N4; the 158 px menu width is a look the PRD does not describe", ["S2-N2", "S2-N4"], None),
 ("Columns Event, User, Details, Date, Time, newest first; Details read \"{name}: {rule}\" or \"Field: old → new\", one change per line.", P, "restates the PRD (\"Field: old → new\" stands for \"Name: {old} → {new}\" / \"Due: {old rule} → {new rule}\"); \"one change per line\" is the look of r16-log.png", ["S12-R2", "S12-R3"], None),
 ("Create Credit Term stays disabled until every field is valid. Errors show only after a field is touched or Create is pressed; the Name field is never red when the window opens.", X, "Design: \"Errors show only after a field is touched or Create is pressed\". PRD S3-R10: \"The Name is checked only once the user has typed in it (then each time they leave the field) or presses Create / Save. Opening the window, or clicking an option or a box before typing a name, never shows a Name error.\" (first sentence matches S3-R6)", ["S3-R6", "S3-R10"], "CT-D04, question 4"),
 ("Credit Hold keeps its own, separate warning (\"This customer is on credit hold and the work order will not be able to be invoiced.\"), unchanged.", L, "today's Credit Hold message, which the design says stays (PRD S9-E2: \"still blocked from invoicing as today\"; the PRD does not quote this message)", ["S9-E2"], None),
 ("Credit Hold: \"No invoices can be created for a customer on Credit Hold until their credit term is changed.\"", P, "quotes the PRD", ["S1-R8"], None),
 ("Credit Limit now sits beside it, as on Edit Customer, and starts blank (blank means no limit). Same gate as Credit Terms: View and Manage AP/AR Data.", L, "restates S5-R1 and the permission (§4); \"starts blank\" is the design's starting value, which the PRD does not state (S5-N4 \"no limit otherwise\")", ["S5-R1", "S5-N1"], None),
 ("Credit Limit: vendors have a required Credit Limit field. The build does not apply the COD / Credit Hold $0 lock to vendors, so it stays editable on every term.", P, "restates the PRD", ["S6-R4"], None),
 ("Credit Terms stays on \"Net 10 (Inactive)\" until someone picks another term. Saving without touching it keeps Net 10.", P, "restates the PRD", ["S5-R12", "S5-R7"], None),
 ("Credit Terms stays on \"Net 10 (Inactive)\" until someone picks another. The picker lists the active terms, then this vendor's own \"Net 10 (Inactive)\" at the end, selected.", P, "restates the PRD", ["S6-R3"], None),
 ("Day is active with 10; the Days box is greyed out (disabled) and empty, cleared when the option switched.", P, "restates the PRD", ["S3-R3", "S3-R4"], None),
 ("Differs from the PRD: the build also repeats that sentence inside the table; the PRD says the table shows no rows and no empty-state line.", X, "Caption older than PRD v3: PRD v3 S12 Error Handling now says \"the table shows no rows and the same sentence in place of the \"No history here. Yet.\" line\", which is what the picture shows. Settled by PRD v3", ["S12 Error Handling"], "CT-D08 (settled)"),
 ("Due wording: COD \"Paid when the invoice is created\"; Due on Receipt \"Due on the invoice date\"; Net X \"X days after the invoice date\"; day of month \"10th of the following month\"; Credit Hold \"Invoicing is blocked\".", P, "quotes the PRD", ["S1-R7"], None),
 ("Each moved customer gets a note on its Notes, by the user who moved it: \"Credit term changed from {old term} to {new term} by {user name} (Move Customers).\" When its limit went from above $0 to $0, the note ends with \"Credit limit {old limit} → $0.\" (S4-R11, S4-R20).", P, "quotes the PRD", ["S4-R11", "S4-R20"], None),
 ("Email overflow is pre-existing (SV-11684), not part of this feature.", O, "a known defect of today's vendor card (SV-11684), not this feature"),
 ("Every customer on COD is listed and ticked. The Counter Sale customer is never listed and never moves.", P, "restates the PRD", ["S4-R3", "S4-R4"], None),
 ("Every deactivated term, in the same order. Customers still on them keep them (Net 15 has 12).", P, "restates the PRD", ["S1-R14", "S2-R7"], None),
 ("Field order from CustomerDialog.vue on both branches: State/Province and Country, then Credit Terms (with Credit Limit beside it on Edit), then the Sales Representative field(s).", L, "field order of the window (S5-R1 \"in the same place they sit on Edit Customer\")", ["S5-R1"], None),
 ("For a user with View and Manage AP/AR Data. Credit Terms is filled in with the shop default (here Due on Receipt) and can be changed before saving.", P, "restates the PRD", ["S5-R2", "S5-N1"], None),
 ("Here Net 30 is the default. Make Default is left out, and Deactivate shows greyed with \"This is your default for new customers. Pick another default first.\"", P, "quotes the PRD (the PRD shows the two sentences as a line and a line below it)", ["S2-N4", "S2-R1"], None),
 ("In production this same dialog also opens for a customer on COD or Due on Receipt, or with a blank or $0 limit, as soon as they owe anything.", O, "today's behaviour (before), which S9 changes; framing for the before picture"),
 ("Invoices already created keep their term and due date. ShopView only: QuickBooks customer records are not changed, as after any customer edit today.", P, "restates the PRD", ["S7-R7", "S8-R6"], None),
 ("Invoices still print plain \"Net 10\", and due dates keep working.", P, "restates the PRD", ["S5-R8", "S7-E1"], None),
 ("Layout and labels unchanged; only the value of Due date and Terms differ.", L, "the design's statement that the invoice screen's look is today's look"),
 ("Names are compared ignoring capitals and spaces, against standard terms and the shop's own (\"A term called Net 10 already exists.\").", P, "restates and quotes the PRD", ["S3-R9"], None),
 ("Needs Settings → Finance plus Customers → Create & Edit and View and Manage AP/AR Data; without them it shows greyed (last board).", P, "restates the PRD", ["S4-N1", "§4 Permissions"], None),
 ("New Credit Term opens this window. Two kinds only: \"Due Net X days\" (1 to 365) or \"Due day of the following month\" (1 to 31). No separate Due label above them. The Name field opens without any error.", L, "restates S3-R1 / S3-R2 / S3-R9 / S3-R10; \"No separate Due label above them\" is a look the PRD does not describe", ["S3-R1", "S3-R2", "S3-R10"], None),
 ("No before: Credit Terms is a new Settings page, so production has nothing to compare. Matches the current build (Active tab).", O, FR),
 ("No Credit Terms and no Credit Limit field. The customer is saved on the shop default without the user seeing it.", P, "restates the PRD", ["S5-N1", "S5-N4"], None),
 ("No hover hints on the options, as in the build (r11-01).", L, "a look the PRD does not describe (no hover text on dropdown options)"),
 ("No option to move existing customers here: moving customers is its own action, Move Customers (page 2).", P, "restates the PRD", ["S2-R5", "§5 Make Default vs Move Customers"], None),
 ("On COD or Credit Hold the Credit Limit is $0 and disabled, with the hover \"COD and Credit Hold customers can't charge to account, so they have no credit limit.\"", P, "quotes the PRD", ["S5-R4", "S5-R9"], None),
 ("On confirm the term leaves the page and a toast shows \"{name} deleted\".", P, "quotes the PRD", ["S2-R9"], None),
 ("On touch screens a tap on the locked Credit Limit shows the same explanation as text under the field (r14-03).", P, "restates the PRD (S5 Form factor); phone width has no board (PRD §2)", ["S5 Form factor"], None),
 ("One customer is unticked, so the button reads \"Move 14 Customers\".", P, "quotes the PRD pattern", ["S4-R2"], None),
 ("One table per tab, no sections. Columns: Name, Due, Customers, Vendors, ⋯.", P, "restates the PRD", ["S1-R4", "§4 one table"], None),
 ("One term list for customers and vendors: the picker offers the active terms in the S1-R5 order, Credit Hold last. Deactivated terms are not offered.", P, "restates the PRD", ["S6-R1", "S6-N2", "S1-R5"], None),
 ("Only COD, Due on Receipt and Credit Hold have the info icon. Net terms and day-of-month terms (standard and the shop's own) have none: their Due column already says when payment is due.", P, "restates the PRD", ["S1-R8", "S1-R10"], None),
 ("Only the selected option's box is active (Days, with 14). The other option's box is greyed out (DS disabled field) and empty. Clicking a greyed box selects its option; switching clears the box you left.", P, "restates the PRD", ["S3-R3", "S3-R4"], None),
 ("Only when a credit limit above $0 is set and the balance is over it. Wording unchanged: \"Are you sure you want to open a new work order? This customer is over their credit limit.\"", P, "quotes the PRD", ["S9-R1", "S9-R3"], None),
 ("Order: COD, Due on Receipt, Net terms by days (the shop's own Net 10 sits between Net 7 and Net 15), \"of the following month\" terms by day, any other terms of the shop's own A to Z, Credit Hold last. Terms with the same days sort A to Z.", P, "restates the PRD", ["S1-R5"], None),
 ("Other messages: \"Enter a name.\" and \"Use 31 characters or fewer.\" Day: \"Enter a day from 1 to 31.\" No sentence shows while a field is invalid.", X, "First two sentences quote S3-R9. \"No sentence shows while a field is invalid.\" differs from S3-R5: the line shows \"While the chosen box holds a valid number\" and \"disappears while the number is invalid\"", ["S3-R9", "S3-R5"], "CT-D03, question 3"),
 ("Part sales show no over-credit confirmation (S9-R4); for part sales only the \"Over limit\" badge follows this rule.", P, "restates and quotes the PRD (the screen's badge reads \"Over Limit\", CT-D07)", ["S9-R4"], "CT-D07"),
 ("Permissions: the page, the terms and the default need Settings → Finance.", P, "restates the PRD", ["§4 Permissions", "S1-N1"], None),
 ("Picking any other term makes the field editable again; blank means no limit.", P, "restates the PRD", ["S5-R5"], None),
 ("Picking COD or Credit Hold sets Credit Limit to $0 and disables it (DS disabled input). Hover: \"COD and Credit Hold customers can't charge to account, so they have no credit limit.\"", P, "quotes the PRD", ["S5-R4"], None),
 ("Production, captured for Splitting Sales Representatives (its canvas board 2.0). The card shows the credit term by name.", O, FR),
 ("Production, captured for Splitting Sales Representatives (its canvas board 2.2). No Credit Terms field on New Customer: every new customer starts on COD.", O, FR + "; describes today's New Customer"),
 ("Rendered from the local build after Cancel: back in the Move Customers window with the search, ticks (14 selected) and Move To kept (S4-R15). Nothing is moved or logged.", P, "restates the PRD", ["S4-R15", "S12-R7"], None),
 ("Rendered from the local build with \"Net 45 Fleet Accounts Payable X\" (31 characters, the longest allowed). At 1440px it fits on one line; on a narrower screen the name wraps and is never cut off (S1-R15).", P, "restates the PRD (demo name)", ["S1-R15", "S3-R2"], None),
 ("Rendered from the local build with no log rows: the standard empty state \"No history here. Yet.\" (S12-E1).", P, "quotes the PRD", ["S12-E1"], None),
 ("Rendered from the local build with the log request failing. The error alert reads \"Something went wrong loading the Credit Terms Log. Please try again.\" and the page is unaffected.", P, "quotes the PRD", ["S12 Error Handling"], None),
 ("Rendered from the local build, where COD is the default: its only item is Move Customers, greyed with \"No customers are on this term\" (the Counter Sale customer is never counted).", P, "quotes the PRD", ["S4-N2", "S1-R12", "S1-N3"], None),
 ("Rendered from the local build. Title \"Confirmation\", message \"Are you sure you want to delete this credit term?\", buttons Cancel and a red Delete Credit Term (S2-R9).", P, "quotes the PRD", ["S2-R9"], None),
 ("Rendered from the local build. Title \"Set 14 customers' credit limit to $0?\", message \"This can't be undone. Their current limits are kept in each customer's note, and the Credit Terms Log records the move.\", buttons Cancel and a red \"Set Limits To $0 And Move\" (S4-R14).", P, "quotes the PRD", ["S4-R14"], None),
 ("Rendered from the local build: 10th of next month (1 customer, 2 vendors). Edit and Delete Credit Term greyed; Delete hovered: \"Used by 1 customer and 2 vendors\" then \"Deactivate it instead to take it out of the pickers.\"", P, "quotes the PRD", ["S2-R1", "S2-R2", "S2-N5"], None),
 ("Rendered from the local build: Edit on an unused term of the shop's own opens \"Edit Credit Term\" filled with its name, kind and days, buttons Cancel and Save Changes (S2-R4, S3-R1).", P, "quotes the PRD", ["S2-R4", "S3-R1"], None),
 ("Rendered from the local build: Inactive tab, Net 7. Reactivate hovered: \"Show in pickers again\"; Move Customers below it.", P, "quotes the PRD", ["S2-R3", "S2-R1"], None),
 ("Rendered from the local build: moving from Net 7 with Move To COD (the default in this shop). Below Move To: \"Prefilled with your default for new customers.\" and \"Their credit limit will be set to $0.\" (S4-R7, S4-R10).", P, "quotes the PRD", ["S4-R7", "S4-R10"], None),
 ("Rendered from the local build: Net 15 (5 customers), Move Customers hovered. Every term with customers offers it, active or inactive.", P, "restates the PRD", ["S2-R1"], None),
 ("Rendered from the local build: Net 15. No Edit or Delete Credit Term on a standard term. Deactivate hovered: \"Hide from customer and vendor pickers\".", P, "quotes the PRD", ["S2-N1", "S2-R3"], None),
 ("Rendered from the local build: Net 6 (the shop's own, no customers or vendors). Edit, Make Default for New Customers, Move Customers greyed (no customers), Deactivate, then Delete Credit Term in red after a divider.", P, "restates the PRD", ["S2-R1", "S4-N2"], None),
 ("Rendered from the local build: the app's shared Audit Log dialog, 1200px wide (at most 95% of the window), as tall as its rows (1200 by 423 with 9 rows at a 1440 window).", L, "the log window's size: a look the PRD does not describe (PRD: same layout as the Work Order Log, S12-R2)", ["S12-R2"], None),
 ("Rendered from the local build: the page ⋯ menu beside New Credit Term has one item, \"Audit Log\", with no icon. The menu is as wide as the item.", P, "quotes the PRD; \"no icon\" and the width are looks the PRD does not describe", ["S12-R1"], None),
 ("Same date rule as customer invoices: always the 10th of the next month; a shorter month uses its last day.", P, "restates the PRD", ["S7-R2", "S7-R3", "S7-R9"], None),
 ("Save opens the work order. No Confirmation for a customer on COD, Due on Receipt or Credit Hold, or with a blank or $0 credit limit.", P, "restates the PRD", ["S9-N1", "S9-N2"], None),
 ("Search narrows the list; Select All and Select None act on the customers the search shows. The count reads \"{n} selected\".", P, "restates and quotes the PRD", ["S4-R5", "S4-R6", "S4-R2"], None),
 ("Shown with the customer split across three representatives.", O, OOS_SSR),
 ("The active terms, then this customer's own \"Net 10 (Inactive)\" at the end, selected. Once another term is picked and saved, Net 10 is gone from this customer's list.", P, "restates the PRD; the drawn list does not reach that row (CT-D10)", ["S5-R7", "S5-R13"], "CT-D10"),
 ("The button names the count: \"Move 214 Customers\". Cancel closes without changes.", P, "quotes the PRD pattern", ["S4-R2", "S4-R22"], None),
 ("The Customers and Vendors columns show how many customers and vendors are on each term (0 shown as 0). The Customers count never includes the Counter Sale customer.", P, "restates the PRD", ["S1-R12", "S1-R13"], None),
 ("The day field reads \"of the following month\" beside it. Always the next month, whatever the invoice day; a shorter month uses its last day.", P, "quotes the PRD", ["S3-R2", "S7-R2", "S7-R3"], None),
 ("The Default badge moves to Net 30. No customer changes term.", P, "restates the PRD", ["S2-R6"], None),
 ("The default row carries a \"Default\" badge. New Credit Term is the one primary button, top right; the page ⋯ menu (Audit Log) sits beside it.", P, "restates the PRD; \"the one primary button\" is the design library rule \"one primary button per view\"", ["S1-R11", "S1-R2"], None),
 ("The dialog itself does not change. Captured on the branch build for a Net 45 customer $369,747 over a $50,000 limit, the case that still warns.", P, "restates the PRD (\"shows unchanged\"); the drawn redraw differs in the Cancel button (CT-D06)", ["S9-R1", "S9-R3"], "CT-D06"),
 ("The highlight marks what to check; it is not part of the screen.", O, "canvas framing (the yellow highlight on the due date)"),
 ("The menu is as wide as its items.", L, "a look the PRD does not describe (the design library's menu is 260 px; the boards size menus to their items)"),
 ("The picker lists the active terms in the S1-R5 order: COD, Due on Receipt, Net terms by days (the shop's own Net 10 between Net 7 and Net 15), day-of-month terms by day, any other term A to Z, Credit Hold last. Deactivated terms are not offered.", P, "restates the PRD", ["S5-R3", "S1-R5", "S5-N2"], None),
 ("The Sales Representative field(s) come from Splitting Sales Representatives (SV-10890): labels, + and x buttons and spacing from its design canvas (page 2, boards 2.12 and 2.16) and its build (SalesRepAssignment.vue).", O, OOS_SSR),
 ("The same list and order as New Vendor and the customer pickers (S6-R1).", P, "restates the PRD", ["S6-R1"], None),
 ("The same rule applies on Edit Customer (page 6).", P, "restates the PRD", ["S5-R4", "S5-R9"], None),
 ("The screen shows the same document the PDF prints (the invoice preview is the PDF render), so screen and PDF match. Highlights on the board mark what to check; they are not part of the document.", L, "the design's statement that the screen and the printed PDF are the same document; canvas framing for the highlight", ["S5-R8"], None),
 ("The sentence under the fields updates as the shop types, so it sees what the term does before saving.", P, "restates the PRD", ["S3-R5"], None),
 ("The shop deactivated Net 10. This customer keeps it, and the card reads \"Net 10 (Inactive)\".", P, "quotes the PRD pattern", ["S5-R8"], None),
 ("The shop deactivated Net 10. This vendor keeps it, and the card reads \"Net 10 (Inactive)\". Vendor bills still get their due date from it.", P, "quotes the PRD pattern", ["S6-R3", "S7-E1"], None),
 ("The shop default (Due on Receipt) carries the same \"Default\" tag as the Credit Terms table. Vendor pickers show no tag: the default applies to new customers only.", P, "restates the PRD", ["S5-R3", "S6-R2"], None),
 ("Title uses the 18px form-dialog title, as New Credit Term. List rows are 36px with a 1px line between them.", L, "sizes the PRD does not describe"),
 ("Toast in the capture: \"Net 45 Fleet Accounts Payable X created\" (S3-R7).", P, "quotes the PRD pattern", ["S3-R7", "S2-R12"], None),
 ("Toast: \"214 customers moved to Due on Receipt.\" COD drops to 0 customers (the Counter Sale customer stays on COD but is never counted); Due on Receipt rises from 38 to 252.", P, "quotes the PRD pattern", ["S4-R9", "S1-R12"], None),
 ("Unticking customers lowers the count (\"180 selected\") and the button (\"Move 180 Customers\"). Unticked customers stay on COD.", P, "restates the PRD", ["S4-R2", "S4-R19"], None),
 ("What stays: COD, Due on Receipt and Credit Hold (always available) and Net 30 (the default, so it can't be deactivated). Every other term, the shop's own included, can be deactivated (S1-E1).", P, "restates the PRD", ["S1-E1"], None),
 ("With nothing inactive the table shows one line: \"No inactive terms\".", X, "Words match S1-N2, but the picture keeps the column headings and puts the line inside the table; PRD S1-N2: \"in place of the table\"", ["S1-N2"], "CT-D02, question 2"),
 ("Captured on the branch build at localhost:8080; the dialog layout is unchanged from production. In production the picker lists the 12 standard terms only.", O, FR),
 ("Captured on the branch build with the picker closed: layout unchanged from production.", O, FR),
 ("Captured on the branch build: layout unchanged from production. Invoice Aug 31, Net 60, due Oct 30. The due date is worked out from the vendor's credit term when the vendor invoice is created, and recalculated when its invoice date or its vendor changes (S7-R9).", P, "restates the PRD", ["S7-R9"], None),
 ("Captured on the branch build: layout unchanged from production. The card shows the credit term by name.", O, FR),
 ("Captured on the branch build: the invoice layout is unchanged from production. Net 30, invoice Aug 31, due Sep 30. Terms prints as an order reference chip; Due date sits under Invoice date.", L, "today's invoice look (the Terms chip, Due date under Invoice date)"),
 ("Production, captured for Splitting Sales Representatives (its canvas board 2.1).", O, FR),
 ("No build shot for the day-of-month invoice inside the work order screen: drawn from the build's layout, not checked against a capture.", O, FR),
 ("No build shot: drawn from the build's layout, not checked against a capture.", O, FR),
 ("No build shot: drawn from the rule, not checked against the build.", O, FR),
]:
    cap(*_row)
for _n in ("14", "180", "214"):
    EXPLICIT[f"{_n} selected"] = ("PRD-MATCH", "the \"{n} selected\" count of Move Customers (demo number)", ["S4-R2"])
