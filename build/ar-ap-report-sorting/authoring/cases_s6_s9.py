"""Stories 6 to 9 — Location column, document links (with every permission the PRD names), report descriptions and layout behaviour,
and the A/R Collection call list. The look of Story 8 (pinned bold column, widths, Totals row style, states) is in cases_design.py."""
from ar_lib import C, ALL6
from common import *
from po_questions import QN
import tech_plan as TP

ORDER = {"S6": 0, "S7": 0, "S8": 0, "S9": 0}
def nk(s):
    ORDER[s] += 1; return f"{s}-{ORDER[s]:02d}"

# ======================= Story 6: Location column =======================
for fam, codes, old, keep in (("A/R", AR3, "Location full name", ("ID", "Customer full name")), ("A/P", AP3, "Location Name", ("No.", "Vendor Name"))):
    k = nk("S6"); steps, res = [], []
    for code in codes:
        r = R[code]; n0 = len(steps)
        steps += [f"Open Reports > Finance > {r['n']} and read the column headings left to right."]
        if code in ("ARS", "APS"):
            res += [f"Step {n0+1}: a column labelled exactly \"Location\" (new on this report) sits right after {namecol(code)}, before the money columns."]
        else:
            shown = {"Location full name": "Location Full Name", "Customer full name": "Customer Full Name"}
            res += [f"Step {n0+1}: the column is labelled exactly \"Location\" (no longer \"{old}\"" + (f", which today's screen writes \"{shown[old]}\"" if old in shown else "")
                    + f") and sits right after \"Date\"; \"{keep[0]}\" and \"{keep[1]}\" keep their names" + (f" (today's screen: \"{shown[keep[1]]}\")" if keep[1] in shown else "") + "."]
    C(k, "S6", f"{fam} reports: the column is named Location and sits in its place",
      [ADMIN(), TWO_LOC, "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
      steps, res, ["S6-R1", "S6-R3", "WC-9", "OOS-3"], reports=codes)

k = nk("S6")
C(k, "S6", "A/R Collection: the Location column shows with two or more locations",
  [ADMIN(), ("The organization has open A/R documents at three locations, {Location-A}, {Location-B} and {Location-C}.", f"For example: {{Location-A}} is {LOC_A} and {{Location-B}} is {LOC_B}."),
   START("ARC")],
  ["Look for the Location column.", "Untick {Location-C} in the Location menu.", "Untick {Location-B} as well.", "Click \"Clear selection\"."],
  ["Step 1: shown (All locations, three in the list).", "Step 2: shown (two ticked).", "Step 3: hidden (one ticked).", "Step 4: hidden (none ticked; the empty state shows)."],
  ["S6-R2", "S6-N1", "S5-R6a"])

for code in ("ARS", "APS"):
    r = R[code]; k = nk("S6"); P = r["Party"]
    C(k, "S6", f"{r['n']}: a row shows one location's name or Multiple",
      [ADMIN(), ("The organization has open documents at three locations, {Location-A}, {Location-B} and {Location-C}.", f"For example: {{Location-A}} is {LOC_A} and {{Location-B}} is {LOC_B}."),
       (f"{P} {{{P}-A}} has open {r['doc']}s only at {{Location-A}}; {P} {{{P}-B}} has open {r['doc']}s at {{Location-A}} and {{Location-B}}.",
        f"For example: {{{P}-A}} is {ex(k, 'One Place')[0]} and {{{P}-B}} is {ex(k, 'Two Places')[0]}."),
       START(code)],
      [f"Read the Location cell of {{{P}-A}} and {{{P}-B}}.", "Untick {Location-B} in the Location menu (leaving {Location-A} and {Location-C}).",
       f"Read the Location cell of {{{P}-B}} again."],
      [f"Step 1: {{{P}-A}} shows {{Location-A}}'s name; {{{P}-B}} shows \"Multiple\".", "Step 2: the Location column stays (two locations ticked).",
       f"Step 3: {{{P}-B}} now shows {{Location-A}}'s name: only its documents at the chosen locations count, and they are all at {{Location-A}}."],
      ["S6-R4", "S6-R2"])

# ======================= Story 7: document links =======================
def role(user, k, has, lacks):
    return (f'You are signed in as {{{user}}}, whose custom role has "Reports → Page Access"' + (", " + ", ".join(f'"{h}"' for h in has) if has else "")
            + (f" but not " + " or ".join(f'"{l}"' for l in lacks) if lacks else "") + ", with {Location-A} as your current location.",
            f"For example: {{{user}}} is {ex(k, 'User')[0]} with the custom role {ex(k, 'Role')[0]}; {{Location-A}} is {LOC_A}.")

k = nk("S7")
C(k, "S7", "A/R Detail: an invoice at your location opens its finance page",
  [ADMIN(), ("Customer {Customer-A} has an open work order invoice {Invoice-A} made at {Location-A}.", f"For example: {{Customer-A}} is {ex(k, 'Opens Here')[0]}."),
   START("ARD", ", with the Customer filter showing {Customer-A} ticked and every bucket expanded")],
  ["Click {Invoice-A}'s Amount cell (not its number).", "Click {Invoice-A}'s customer name cell.", "Click {Invoice-A}'s number."],
  ["Step 1: nothing opens: clicking a row no longer opens it.", "Step 2: nothing opens.", "Step 3: the work order's finance page opens, as today."],
  ["S7-R1", "S7-R2", "WC-6"])

k = nk("S7")
C(k, "S7", "A/R Collection: a part sale invoice at your location opens its finance page",
  [ADMIN(), ("Customer {Customer-A} has an overdue part sale invoice {Invoice-A} made at {Location-A}.", f"For example: {{Customer-A}} is {ex(k, 'Counter Sale')[0]}."),
   START("ARC", ", with {Customer-A}'s group expanded")],
  ["Hover over {Invoice-A}'s Open balance cell.", "Click {Invoice-A}'s Open balance cell.", "Click {Invoice-A}'s number."],
  ["Step 1: the pointer does not turn into a hand and the row's text is not blue: only the number is a link.",
   "Step 2: nothing opens.", "Step 3: the part sale's finance page opens, as today."],
  ["S7-R1", "S7-R2", "WC-6"] + TP.q("P3-rowclick"))

for code, kind, word in (("ARD", "work order", "This work order is in"), ("ARC", "part sale", "This part sale is in")):
    r = R[code]; k = nk("S7")
    C(k, "S7", f"{r['n']}: a {kind} invoice at another location asks to switch",
      [ADMIN(), TWO_LOC, (f"Customer {{Customer-A}} has an open {kind} invoice {{Invoice-A}} made at {{Location-B}}.", f"For example: {{Customer-A}} is {ex(k, 'Other Place')[0]}."),
       START(code, ", with {Customer-A} ticked and its rows showing")],
      ["Click {Invoice-A}'s number.", "Read the dialog: title, message and buttons.", "Click \"Switch location\".", "Look at the location switcher in the top right."],
      ["Step 1: a dialog opens on the report, before leaving it.",
       f"Step 2: title \"Switch location?\", message \"{word} \" followed by {{Location-B}}'s name and \"Switch your active location to view it?\", buttons \"Switch location\" and \"Cancel\".",
       f"Step 3: the {kind}'s finance page opens.", "Step 4: your active location is now {Location-B}."],
      ["S7-R3", "S7-R4", "UFS-3" if kind == "work order" else "UFS-4"])

k = nk("S7")
C(k, "S7", "A/R Collection: Cancel on the switch prompt leaves the report as it was",
  [ADMIN(), TWO_LOC, ("Customer {Customer-A} has overdue invoices at {Location-A} and one, {Invoice-A}, at {Location-B}; more than 20 other customers have overdue invoices.", f"For example: {{Customer-A}} is {ex(k, 'Stay Put')[0]}."),
   START("ARC", ", with \"Past due: 1-30 days\" ticked, the \"Amount\" header clicked once, {Customer-A}'s group expanded and the page scrolled so {Invoice-A} is in the middle of the screen")],
  ["Copy the page address.", "Note which rows are at the top and bottom of the screen.", "Click {Invoice-A}'s number.", "Click \"Cancel\".",
   "Compare the page address with the copied one.", "Look at the filters, the sort, the expanded groups and the scroll position."],
  ["Step 1: the address is copied.", "Step 2: noted.", "Step 3: the \"Switch location?\" dialog opens.",
   "Step 4: the dialog closes, no message pops up, and you stay on the report.",
   "Step 5: the address is the same.", "Step 6: the same Past due filter, the Amount sort, {Customer-A}'s group still expanded and the same scroll position."],
  ["S7-R5", "UFS-3"] + TP.q("STAY"))

k = nk("S7")
C(k, "S7", "A/P Detail: a bill opens its delivery here and is plain text elsewhere",
  [ADMIN(), TWO_LOC, ("Vendor {Vendor-A} has an unpaid bill {Bill-A} received at {Location-A} and an unpaid bill {Bill-B} received at {Location-B}.", f"For example: {{Vendor-A}} is {ex(k, 'Two Deliveries')[0]}."),
   START("APD", ", with {Vendor-A} ticked and every bucket expanded")],
  ["Hover over {Bill-B}'s number.", "Click {Bill-B}'s number.", "Click {Bill-A}'s number."],
  ["Step 1: it is plain text, not a link (no link colour, no pointer).", "Step 2: nothing opens: the bill page cannot switch location.",
   "Step 3: {Bill-A}'s delivery opens, as today."],
  ["S7-R6", "S7-R1"])

for code in ("APD", "APU"):
    r = R[code]; k = nk("S7")
    C(k, "S7", f"{r['n']}: a vendor credit links to the return it came from",
      [ADMIN(), TWO_LOC, ("Vendor {Vendor-A} has three unused vendor credits: {Vendor-credit-A} from a vendor return made at {Location-A}, {Vendor-credit-B} from a vendor return made at {Location-B}, and {Vendor-credit-C} not from a vendor return.",
                         f"For example: {{Vendor-A}} is {ex(k, 'Returns')[0]}."),
       START(code, ", with {Vendor-A} ticked and its rows showing")],
      ["Look at the three vendor credits' numbers.", "Click {Vendor-credit-A}'s number."],
      ["Step 1: {Vendor-credit-A}'s number is a link; {Vendor-credit-B}'s (another location) and {Vendor-credit-C}'s (no vendor return) are plain text.",
       "Step 2: the vendor return {Vendor-credit-A} came from opens."],
      ["S7-R9", "S7-R6"])

k = nk("S7")
C(k, "S7", "A/R Detail: opening an invoice link in a new tab asks there",
  [ADMIN(), TWO_LOC, ("Customer {Customer-A} has an open work order invoice {Invoice-A} made at {Location-B}.", f"For example: {{Customer-A}} is {ex(k, 'New Tab')[0]}."),
   START("ARD", ", with {Customer-A} ticked and every bucket expanded")],
  ["Right-click {Invoice-A}'s number and choose \"Open link in new tab\".", "Switch to the new tab.", "Switch back to the report's tab."],
  ["Step 1: a new tab opens; the report's tab shows no dialog.", "Step 2: the document page shows and asks to switch location itself.",
   "Step 3: the report is unchanged."],
  ["S7-R8"])

k = nk("S7")
C(k, "S7", "A/R Detail: credit memos and deposits are plain text",
  [ADMIN(), ("Customer {Customer-A} has an unused credit memo {Credit-memo-A} and an unused deposit {Deposit-A} at {Location-A}.", f"For example: {{Customer-A}} is {ex(k, 'Credits')[0]}."),
   START("ARD", ", with {Customer-A} ticked and every bucket expanded")],
  ["Hover over {Credit-memo-A}'s number.", "Click it.", "Hover over {Deposit-A}'s number and click it."],
  ["Step 1: plain text, not a link.", "Step 2: nothing opens: a credit memo has no page of its own.", "Step 3: plain text; nothing opens."],
  ["S7-R10", "OOS-6"])

k = nk("S7")
C(k, "S7", "A/R Detail: a document at a location you are not enrolled in is plain text",
  [('You are signed in as {User-B}, an "Admin" user enrolled only at {Location-A}, with {Location-A} as your current location.', f"For example: {{User-B}} is {ex(k, 'Not There')[0]}; {{Location-A}} is {LOC_A}."),
   ("Customer {Customer-A} has an open invoice {Invoice-A} made at {Location-B}, a location {User-B} is not enrolled in.", f"For example: {{Customer-A}} is {ex(k, 'Far Away')[0]}; {{Location-B}} is {LOC_B}."),
   START("ARD", ", with {Customer-A} ticked and every bucket expanded")],
  ["Look at {Invoice-A}'s row.", "Click {Invoice-A}'s number."],
  ["Step 1: the row is listed (the report stays organization-wide) and its number is plain text.", "Step 2: nothing opens and no dialog shows."],
  ["S7-N1", "S5-R12"])

# ---- permissions (each the PRD names)
k = nk("S7")
C(k, "S7", "With Invoicing and Work Orders View, a work order invoice is a link",
  [role("User-B", k, ["Invoicing & Payments → View", "Work Orders → View"], ["Part Sales → View"]),
   ("Customer {Customer-A} has an open work order invoice {Invoice-A} and an open part sale invoice {Invoice-B}, both made at {Location-A}.", f"For example: {{Customer-A}} is {ex(k, 'Permissions')[0]}."),
   START("ARD", ", with {Customer-A} ticked and every bucket expanded")],
  ["Click {Invoice-A}'s number.", "Go back to the report and look at {Invoice-B}'s number."],
  ["Step 1: the work order's finance page opens.", "Step 2: plain text: the role lacks \"Part Sales → View\"."],
  ["S7-R1", "S7-N2", ("Story 7 Prerequisites", "An invoice or part sale opens for a user with 'Invoicing & Payments → View' and 'Work Orders → View' (work orders) or 'Part Sales → View' (part sales).")])

k = nk("S7")
C(k, "S7", "Without Invoicing View, work order and part sale invoices are plain text",
  [role("User-B", k, ["Work Orders → View", "Part Sales → View"], ["Invoicing & Payments → View"]),
   ("Customer {Customer-A} has an overdue work order invoice {Invoice-A} and an overdue part sale invoice {Invoice-B}, both made at {Location-A}.", f"For example: {{Customer-A}} is {ex(k, 'No Invoicing')[0]}."),
   START("ARC", ", with {Customer-A}'s group expanded")],
  ["Look at {Invoice-A}'s and {Invoice-B}'s numbers.", "Click {Invoice-A}'s number."],
  ["Step 1: both are plain text.", "Step 2: nothing opens."],
  ["S7-N2", "S7-R1", ("Story 7 Prerequisites", "An invoice or part sale opens for a user with 'Invoicing & Payments → View' and 'Work Orders → View' (work orders) or 'Part Sales → View' (part sales).")])

k = nk("S7")
C(k, "S7", "With Invoicing and Part Sales View only, only part sale invoices link",
  [role("User-B", k, ["Invoicing & Payments → View", "Part Sales → View"], ["Work Orders → View"]),
   ("Customer {Customer-A} has an overdue work order invoice {Invoice-A} and an overdue part sale invoice {Invoice-B}, both made at {Location-A}.", f"For example: {{Customer-A}} is {ex(k, 'Parts Only')[0]}."),
   START("ARC", ", with {Customer-A}'s group expanded")],
  ["Look at {Invoice-A}'s number.", "Click {Invoice-B}'s number."],
  ["Step 1: plain text: the role lacks \"Work Orders → View\".", "Step 2: the part sale's finance page opens."],
  ["S7-N2", "S7-R2", ("Story 7 Prerequisites", "An invoice or part sale opens for a user with 'Invoicing & Payments → View' and 'Work Orders → View' (work orders) or 'Part Sales → View' (part sales).")])

for k_has, label in ((["Vendor Order Management → View"], "View"), (["Vendor Order Management → Create & Edit"], "Create & Edit")):
    k = nk("S7")
    other = "Vendor Order Management → Create & Edit" if label == "View" else "Vendor Order Management → View"
    C(k, "S7", f"With Vendor Order Management {label}, a bill at your location is a link",
      [role("User-B", k, k_has, [other]),
       ("Vendor {Vendor-A} has an unpaid bill {Bill-A} received at {Location-A}.", f"For example: {{Vendor-A}} is {ex(k, 'Bills')[0]}."),
       START("APU", ", with {Vendor-A}'s group expanded")],
      ["Look at {Bill-A}'s number.", "Click it."],
      ["Step 1: it is a link.", "Step 2: {Bill-A}'s delivery opens."],
      ["S7-R1", "S7-R6", ("Story 7 Prerequisites", "A bill opens for a user with 'Vendor Order Management → View' or 'Vendor Order Management → Create & Edit'.")])

k = nk("S7")
C(k, "S7", "Without Vendor Order Management, bills and vendor credits are plain text",
  [role("User-B", k, [], ["Vendor Order Management → View", "Vendor Order Management → Create & Edit"]),
   ("Vendor {Vendor-A} has an unpaid bill {Bill-A} received at {Location-A} and an unused vendor credit {Vendor-credit-A} from a vendor return made at {Location-A}.", f"For example: {{Vendor-A}} is {ex(k, 'No Orders')[0]}."),
   START("APD", ", with {Vendor-A} ticked and every bucket expanded")],
  ["Look at {Bill-A}'s and {Vendor-credit-A}'s numbers.", "Click {Bill-A}'s number."],
  ["Step 1: both are plain text.", "Step 2: nothing opens."],
  ["S7-N2", "S7-R9", ("Story 7 Prerequisites", "A bill opens for a user with 'Vendor Order Management → View' or 'Vendor Order Management → Create & Edit'.")])

k = nk("S7")
C(k, "S7", "A/R Summary: customer names link to A/R Collection only with Customers View",
  [('Two users exist: {User-B}, whose custom role has "Reports → Page Access" and "Customers → View", and {User-C}, whose custom role has "Reports → Page Access" but not "Customers → View".',
    f"For example: {{User-B}} is {ex(k, 'Can See Customers')[0]} and {{User-C}} is {ex(k, 'No Customers')[0]}."),
   ("Customer {Customer-A} has open invoices on today's date.", f"For example: {{Customer-A}} is {ex(k, 'Name Link')[0]}."),
   "Starting screen: the sign-in page in a desktop browser window 1440 px wide."],
  ["Sign in as {User-B}.", "Open Reports > Finance > A/R Summary.", "Click {Customer-A}'s name.", "Sign out and sign in as {User-C}.",
   "Open Reports > Finance > A/R Summary.", "Click {Customer-A}'s name."],
  ["Step 1: you are signed in.", "Step 2: A/R Summary opens.", "Step 3: A/R Collection opens with only {Customer-A} ticked.", "Step 4: you are signed in as {User-C}.",
   "Step 5: A/R Summary opens and {Customer-A}'s name is plain text.", "Step 6: nothing opens."],
  ["S7-R1", ("Story 7 Prerequisites", "A customer name on A/R Summary links to A/R Collection for a user with 'Customers → View', as today."), "WC-6"])

k = nk("S7")
C(k, "S7", "A/P Summary: vendor names link for everyone who can open the report",
  [role("User-B", k, [], ["Vendor Order Management → View", "Vendor Order Management → Create & Edit"]),
   ("Vendor {Vendor-A} has unpaid bills on today's date.", f"For example: {{Vendor-A}} is {ex(k, 'Name Link')[0]}."), START("APS")],
  ["Look at {Vendor-A}'s name.", "Click it."],
  ["Step 1: it is a link.", "Step 2: A/P Unpaid Invoices opens with only {Vendor-A} ticked."],
  ["S7-R1", ("Story 7 Prerequisites", "A vendor name on A/P Summary links to A/P Unpaid Invoices for everyone who can open the reports, as today."), "WC-6"])

# ======================= Story 8: descriptions (behaviour) and states =======================
for code in ALL6:
    r = R[code]; k = nk("S8")
    text = __import__("ar_lib").SUB[f"S8-R1 {code}"][1].split(": ", 1)[1].strip('"')
    C(k, "S8", f"{r['n']}: the info icon shows the report's description",
      [ADMIN(), START(code)],
      ["Hover over the info icon right of the title.", "Move the pointer away.", "Press Tab until the info icon has keyboard focus.", "Press Escape."],
      [f"Step 1: a tooltip shows, word for word: \"{text}\"",
       "Step 2: the tooltip closes.", "Step 3: the same tooltip shows.", "Step 4: the tooltip closes."],
      ["S8-R1", f"S8-R1 {code}"])

k = nk("S8")
C(k, "S8", "Report descriptions are on screen only, not in the PDF or CSV",
  [ADMIN(), ("A/R Summary and A/P Unpaid Invoices have open documents on today's date.", None), "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
  ["Open A/R Summary and download its PDF and CSV from the ⋯ menu.", "Search both files for the words \"unpaid balance\".",
   "Open A/P Unpaid Invoices and download its PDF and CSV.", "Search both files for the words \"grouped by vendor\"."],
  ["Step 1: both download.", "Step 2: the words are not found: the description is not in the PDF or CSV.", "Step 3: both download.", "Step 4: not found."],
  ["S8-N1", "S8-R1"], reports=["ARS", "APU"])

for code in ("ARD", "APD"):
    r = R[code]; k = nk("S8"); P = r["Party"]
    C(k, "S8", f"{r['n']}: Clear all filters keeps the date and resets the rest",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has open {r['doc']}s only at {{Location-B}}, none 61 to 90 days past due, on yesterday's date.", f"For example: {{{P}-A}} is {ex(k, 'Nothing Here')[0]}."),
       START(code)],
      ["Change the as-of date to yesterday.", f"Tick {{{P}-A}} in the {P} filter, \"61-90 days\" in Past due, and untick {{Location-B}} in Location.",
       "Read the table area.", "Click \"Clear all filters\".", "Read the chips."],
      ["Step 1: the report shows yesterday.",
       "Step 2: the filters are set.",
       "Step 3: \"No record matches these filters\", \"Try changing filters to widen your results.\" and a \"Clear all filters\" button.",
       "Step 4: rows show again.",
       f"Step 5: the as-of date is still yesterday; \"{P}: All {r['parties']}\", \"Past due: Any\" and \"Location: All locations\" (every location ticked)."],
      ["S8-R5", "UFS-9"])

for code in ("ARC", "APS"):
    r = R[code]; k = nk("S8")
    C(k, "S8", f"{r['n']}: a report that fails to load says so in place of the rows",
      [ADMIN(), ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START(code)],
      ["Switch the computer's network connection off.", "Change the as-of date to yesterday.", "Read the table area and any message.", "Switch the network back on and change the date back to today."],
      ["Step 1: the computer is offline.", "Step 2: the report tries to load.",
       "Step 3: in place of the rows: \"Something went wrong loading this report. Please try again.\", with the standard error message as well.",
       "Step 4: the report loads normally again."],
      ["S8-R6", "UFS-10"],
      note="A server error cannot be caused by hand; a lost connection is the failure a tester can cause.")

k = nk("S8")
C(k, "S8", "A/P Detail: the progress bar shows while the report loads",
  [ADMIN(), ("The organization has many open A/P lines, so the report takes a moment to load.", "For example: the QA organization (13,540 open A/P lines)."), START("APD")],
  ["Change the as-of date to yesterday and watch the table straight away.", "Wait until the rows show."],
  ["Step 1: while it loads, the native table progress bar shows.", "Step 2: the progress bar goes away when the rows show."],
  ["S8-R5"])

# ======================= Story 9: A/R Collection call list =======================
k = nk("S9")
C(k, "S9", "A/R Collection: each customer row shows phone and credit term",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A} has an overdue invoice, a phone number and a credit term on its customer card; customer {Customer-B} has an overdue invoice and no credit term.",
    f"For example: {{Customer-A}} is {ex(k, 'Call Me')[0]} with phone (403) 555-0101 and credit term Net 30; {{Customer-B}} is {ex(k, 'No Terms')[0]}."),
   START("ARC")],
  ["Read {Customer-A}'s group row.", "Open {Customer-A}'s customer card in another tab and compare the phone and credit term.", "Read {Customer-B}'s group row.",
   "Look for an email address or a contact name on either row."],
  ["Step 1: after the name: \"Phone: \" and the phone number, then \"Credit term: \" and the credit term.",
   "Step 2: both read exactly as the customer card shows them.",
   "Step 3: \"Credit term: COD\" (none is set).",
   "Step 4: neither row shows an email address or a primary contact."],
  ["S9-R1", "S9-R2", "OOS-5"])

k = nk("S9")
C(k, "S9", "A/R Collection: a customer with no phone shows no Phone label",
  [ADMIN(), ("Customer {Customer-A} has an overdue invoice and no phone number on its customer card.", f"For example: {{Customer-A}} is {ex(k, 'No Phone')[0]}."),
   START("ARC", ", with only {Customer-A} ticked")],
  ["Read {Customer-A}'s group row.", "Choose \"Download (PDF)\" from the ⋯ menu.", "Read {Customer-A}'s line in the PDF."],
  ["Step 1: no \"Phone:\" label at all.", "Step 2: the PDF downloads.", "Step 3: no \"Phone:\" label on the line."],
  ["S9-N1"])

k = nk("S9")
C(k, "S9", "A/R Collection: the PDF and CSV carry the phone and credit term",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A} has two overdue invoices, a phone number and a credit term.", f"For example: {{Customer-A}} is {ex(k, 'Export Call')[0]} with phone (403) 555-0102 and credit term Net 15."),
   START("ARC", ", with only {Customer-A} ticked")],
  ["Choose \"Download (PDF)\" from the ⋯ menu.", "Read {Customer-A}'s line in the PDF.", "Choose \"Download (CSV)\" from the ⋯ menu.",
   "Read the CSV heading row.", "Read both of {Customer-A}'s rows."],
  ["Step 1: the PDF downloads.", "Step 2: the same phone and credit term as on screen, on the customer's line.", "Step 3: the CSV downloads.",
   "Step 4: \"Phone\" and \"Credit term\" columns come right after \"Customer\".",
   "Step 5: every row carries {Customer-A}'s phone and credit term."],
  ["S9-R3", "S3-R8a"])

k = nk("S9")
C(k, "S9", "A/R Collection: without AP/AR Data access there is no credit term",
  [('You are signed in as {User-B}, whose custom role has "Reports → Page Access" and the "View and Manage AP/AR Data" switch off.', f"For example: {{User-B}} is {ex(k, 'No Terms User')[0]}."),
   ("Customer {Customer-A} has an overdue invoice, a phone number and a credit term.", f"For example: {{Customer-A}} is {ex(k, 'Hidden Term')[0]} with credit term Net 30."),
   START("ARC", ", with only {Customer-A} ticked")],
  ["Read {Customer-A}'s group row.", "Download the PDF from the ⋯ menu and read {Customer-A}'s line.", "Download the CSV and read its heading row."],
  ["Step 1: the phone shows; no credit term and no \"Credit term:\" label.", "Step 2: the phone shows; no credit term.",
   "Step 3: a \"Phone\" column after \"Customer\", and no \"Credit term\" column."],
  ["S9-N2", "S3-R8a", "KD-PERM"])

k = nk("S8")
C(k, "S8", "A/R Collection: a tap on the info icon shows the description",
  [ADMIN(), ("You use a touch-screen device whose screen is at least 1024 px wide, with no mouse.", "For example: a touch-screen laptop or a large tablet in a desktop browser."),
   START("ARC", " on that device")],
  ["Tap the info icon right of the title.", "Tap an empty part of the page."],
  ["Step 1: the description tooltip shows: \"Overdue invoices, unused credit memos and deposits for each customer to help you follow up on payments. Excludes invoices that aren’t due yet.\"",
   "Step 2: the tooltip closes."],
  ["S8-R1", "S8-R1 ARC"])
