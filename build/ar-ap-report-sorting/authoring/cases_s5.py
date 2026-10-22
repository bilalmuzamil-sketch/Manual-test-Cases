"""Story 5 — Filters: customer or vendor, past due and location. The numbers the filters leave (S5-R8, S5-R16 to S5-R18) are in cases_data.py."""
from ar_lib import C, ALL6
from common import *
from po_questions import QN

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"S5-{ORDER['n']:02d}"

# ---- the filter row on every report, untouched
for code in ALL6:
    r = R[code]; k = nk(); P = r["Party"]
    icon = "a person icon" if r["fam"] == "A/R" else "a truck icon"
    C(k, "S5", f"{r['n']}: the filter row reads As of, {P}, Past due, Location",
      [ADMIN(), TWO_LOC, START(code)],
      ["Read the filter row under the title, chip by chip, left to right.",
       f"Look at the {P} chip and the Past due chip.",
       "Look at the Location chip.",
       "Compare every chip label letter for letter, capitals included, with the expected results."],
      [f"Step 1: four chips, in this order: the date chip \"As of: \" and today's date (for example \"As of: 10/15/2026\"), the {P} chip, the Past due chip, the Location chip. The date chip says \"As of\", no longer \"Date\"" + (f", and on this report the {P} chip now comes after it." if code in ("ARC", "APU") else "."),
       f"Step 2: \"{P}: All {r['parties']}\" with {icon} and \"Past due: Any\" with an hourglass icon, both in the resting (grey) style.",
       "Step 3: \"Location: All locations\" with the location pin icon.",
       "Step 4: every label matches exactly, capitals and punctuation included."],
      ["S5-R1", "S5-R13", "S5-R15", "S5-R6", "S5-R2", "S5-R10a", "WC-7"])

# ---- the Location menu
for code in ("ARD", "APS"):
    r = R[code]; k = nk()
    C(k, "S5", f"{r['n']}: the Location menu lists the locations, ticked ones first",
      [ADMIN(), TWO_LOC, ("The report's Location list has 8 locations or fewer on today's date.", None), START(code)],
      ["Click the Location chip and read the menu from top to bottom.", "Untick {Location-A}.", "Close the menu and open it again.",
       "Look for a search box in the menu.", "Click \"Clear selection\".", "Click \"Select all\"."],
      ["Step 1: a \"Select all\" row, a count of the ticked locations (\"2 selected\"), {Location-A} and {Location-B}, both ticked, and \"Clear selection\".",
       "Step 2: the count reads \"1 selected\".",
       "Step 3: the ticked location, {Location-B}, is listed first, then {Location-A}.",
       "Step 4: there is no search box (8 locations or fewer).",
       "Step 5: no location is ticked; the chip reads \"Location: No locations\".",
       "Step 6: every location is ticked again; the chip reads \"Location: All locations\"."],
      ["S5-R2", "S5-R5", "S5-R6"])

k = nk()
C(k, "S5", "A/R Summary: the Location menu has a search box above 8 locations",
  [ADMIN(), ("The organization has open A/R documents at nine or more locations on today's date, among them {Location-A}.",
             f"For example: {{Location-A}} is {LOC_A}; the other eight are staging locations made for this test ({ex(k, 'Location 1')[0]} to {ex(k, 'Location 8')[0]})."),
   START("ARS")],
  ["Click the Location chip.", "Look at the top of the menu for a search box and read its placeholder.", "Type the first word of {Location-A}'s name into it."],
  ["Step 1: the menu opens with every location ticked.", "Step 2: a search box shows, with the placeholder \"Search locations\".",
   "Step 3: the list narrows to the locations whose names match, {Location-A} among them."],
  ["S5-R2"])

# ---- the Location list: whatever the user's own location and enrollment, narrowed by nothing but the as-of date
for code in ("ARC", "APU"):
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S5", f"{r['n']}: every location is listed, whatever your enrollment",
      [('You are signed in as {User-B}, an "Admin" user enrolled only at {Location-A}, with {Location-A} as your current location.',
        f"For example: {{User-B}} is {ex(k, 'One Place')[0]}; {{Location-A}} is {LOC_A}."),
       (f"The organization has open documents in this report at {{Location-A}} and {{Location-B}} on today's date; {{Location-B}} had none on {{Date-A}}.",
        f"For example: {{Location-B}} is {LOC_B}; {{Date-A}} is a date before {{Location-B}}'s first open {r['doc']}."),
       (f"{P} {{{P}-A}} has open documents only at {{Location-A}}.", f"For example: {{{P}-A}} is {ex(k, 'Home Only')[0]}."),
       START(code)],
      ["Click the Location chip and read the list.", "Close it and look at the rows' Location column.",
       f"Open the {P} filter and tick {{{P}-A}}, then open the Location chip again.",
       "Open the Past due filter, tick \"1-30 days\", then open the Location chip again.",
       "Untick {Location-B} in the Location menu, close it and open it again.",
       "Change the as-of date to {Date-A} and open the Location chip."],
      ["Step 1: both {Location-A} and {Location-B} are listed and ticked, although you are enrolled only at {Location-A}.",
       "Step 2: rows from {Location-B} are shown too: the report stays organization-wide.",
       "Step 3: both locations are still listed: the list is not narrowed by the " + P + " filter.",
       "Step 4: both locations are still listed: the list is not narrowed by the Past due filter.",
       "Step 5: {Location-B} is still in the list, unticked: the list is not narrowed by the Location filter.",
       "Step 6: the list changes with the as-of date: {Location-B} is no longer offered."],
      ["S5-R3", "S5-R12", "OOS-2", "KD-ORG", "GOAL-ACCESS"])

k = nk()
C(k, "S5", "Location names in the menu and column match the location switcher",
  [ADMIN(), TWO_LOC, START("ARD", ", with every bucket expanded (Expand all)")],
  ["Open the location switcher in the top right of ShopView and read the two location names, then close it without switching.",
   "Click the Location chip and read the two names.", "Read the Location column."],
  ["Step 1: the switcher names {Location-A} and {Location-B}.",
   "Step 2: the menu names them exactly as the switcher does, letter for letter.",
   "Step 3: the Location column uses the same names."],
  ["S5-R4"])

k = nk()
C(k, "S5", "A/R Summary: the Location chip reads all, a count, one name or none",
  [ADMIN(), ("The organization has open A/R documents at three locations, {Location-A}, {Location-B} and {Location-C}; {Location-C}'s name is longer than the chip can show.",
             f"For example: {{Location-A}} is {LOC_A}, {{Location-B}} is {LOC_B} and {{Location-C}} is ZZAUTOTEST {k} Northern Alberta Heavy Equipment Service Centre."),
   START("ARS")],
  ["Read the Location chip.", "Open the Location menu and untick {Location-B}.", "Untick {Location-A}.", "Untick {Location-C}."],
  ["Step 1: \"Location: All locations\".", "Step 2: \"Location: 2 locations\".",
   "Step 3: the chip shows {Location-C}'s name, shortened with \"...\" because it is long.",
   "Step 4: \"Location: No locations\"."],
  ["S5-R6"],
  note=f"Whether the one-name chip also says \"Location: \" (question {QN['chip-one']}) and from what length a name is shortened (question {QN['chip-long']}) are asked.")

k = nk()
C(k, "S5", "A/P Detail: with no location ticked the report is empty",
  [ADMIN(), TWO_LOC, START("APD")],
  ["Open the Location menu and click \"Clear selection\".", "Look at the table area.", "Reload the page."],
  ["Step 1: the chip reads \"Location: No locations\".",
   "Step 2: no rows, no Totals row and no Location column; the empty state reads \"No record matches these filters\" and \"Try changing filters to widen your results.\" with a \"Clear all filters\" button.",
   "Step 3: \"No locations\" is not kept: the report reloads on \"Location: All locations\" with every row back."],
  ["S5-R6a", "S5-R10", "S8-R5", "UFS-9"])

# ---- which location a row belongs to
k = nk()
C(k, "S5", "A/R Detail: each row belongs to its own document's location",
  [ADMIN(), TWO_LOC,
   ("Customer {Customer-A} has, on today's date, an invoice {Invoice-A} made at {Location-A} for $500.00 and partly paid ($200.00) by a payment taken at {Location-B}, a credit memo {Credit-memo-A} made at {Location-B} and a deposit {Deposit-A} taken at {Location-B}.",
    f"For example: {{Customer-A}} is {ex(k, 'Where It Lives')[0]}."),
   START("ARD", ", with the Customer filter showing {Customer-A} ticked and every bucket expanded")],
  ["Read the Location column of {Invoice-A}, {Credit-memo-A} and {Deposit-A}.", "Open the Location menu and untick {Location-B}.",
   "Expand every bucket and read the rows.", "Open the Location menu, tick {Location-B} and untick {Location-A}.", "Expand every bucket and read the rows."],
  ["Step 1: {Invoice-A} shows {Location-A}; {Credit-memo-A} and {Deposit-A} show {Location-B}.",
   "Step 2: the report narrows to {Location-A}; the Location column is hidden.",
   "Step 3: only {Invoice-A} remains, with its open balance of $300.00 ($500.00 − $200.00): the payment taken elsewhere does not move it.",
   "Step 4: the report narrows to {Location-B}.",
   "Step 5: only {Credit-memo-A} and {Deposit-A} remain."],
  ["S5-R7", "KD-ROW", "S6-R2"])

k = nk()
C(k, "S5", "A/P Detail: a bill belongs to the location of its delivery",
  [ADMIN(), TWO_LOC,
   ("Vendor {Vendor-A}, whose own location is {Location-A}, has an unpaid bill {Bill-A} received on a delivery at {Location-B}.",
    f"For example: {{Vendor-A}} is {ex(k, 'Delivered Elsewhere')[0]}."),
   START("APD", ", with the Vendor filter showing {Vendor-A} ticked and every bucket expanded")],
  ["Read {Bill-A}'s Location.", "Open the Location menu and untick {Location-B}.", "Expand every bucket and look for {Bill-A}."],
  ["Step 1: {Location-B}, the delivery's location, not the vendor's.", "Step 2: the report narrows to {Location-A}.",
   "Step 3: {Bill-A} is not listed."],
  ["S5-R7"])

k = nk()
C(k, "S5", "A/P Unpaid Invoices: a vendor credit belongs to its return or vendor",
  [ADMIN(), TWO_LOC,
   ("Vendor {Vendor-A}, whose own location is {Location-A}, has two unused vendor credits: {Vendor-credit-A} from a vendor return made at {Location-B}, and {Vendor-credit-B} not from a vendor return.",
    f"For example: {{Vendor-A}} is {ex(k, 'Credit Home')[0]}."),
   START("APU", ", with the Vendor filter showing {Vendor-A} ticked and its group expanded")],
  ["Read the Location of {Vendor-credit-A} and {Vendor-credit-B}.", "Open the Location menu and untick {Location-A}.", "Expand {Vendor-A}'s group."],
  ["Step 1: {Vendor-credit-A} shows {Location-B} (the return's location); {Vendor-credit-B} shows {Location-A} (the vendor's location, as today).",
   "Step 2: the report narrows to {Location-B}.", "Step 3: only {Vendor-credit-A} is listed."],
  ["S5-R7"])

# ---- when the chip shows
k = nk()
C(k, "S5", "A/R Collection: the Location chip hides when only one location has data",
  [ADMIN(), TWO_LOC, ("On {Date-A} the organization's open A/R documents were all at {Location-A}.", "For example: {Date-A} is a date before {Location-B}'s first invoice."),
   START("ARC")],
  ["Look for the Location chip.", "Open it and untick {Location-B}, then close it.", "Change the as-of date to {Date-A}.", "Look for the Location chip."],
  ["Step 1: the Location chip shows (two locations in the list).",
   "Step 2: the chip still shows, reading {Location-A}'s name, so the choice can be undone.",
   "Step 3: the report reloads for {Date-A}.",
   "Step 4: the Location chip is not shown: the only location in the list is ticked."],
  ["S5-R9", "S5-N1"],
  note="If step 3 keeps {Location-B} unticked in the address, tick every location before step 3; the case is about the one-location list.")

# ---- the page address
k = nk()
C(k, "S5", "A/R Collection: ticked locations survive reload, Back and a shared link",
  [ADMIN(), TWO_LOC, START("ARC")],
  ["Open the Location menu, untick {Location-B} and close it.", "Copy the page address.", "Reload the page.",
   "Open the Location menu, click \"Select all\" and close it.", "Click the browser's Back button.", "Open a new browser tab and paste the copied address."],
  ["Step 1: the report narrows to {Location-A}.", "Step 2: the address is copied.", "Step 3: the report reloads with only {Location-A} ticked.",
   "Step 4: every location is ticked.", "Step 5: the report shows only {Location-A} ticked again.",
   "Step 6: the shared link opens the report with only {Location-A} ticked."],
  ["S5-R10"])

k = nk()
C(k, "S5", "A/P Summary: a link naming several locations or every location",
  [ADMIN(), ("The organization has open A/P documents at three locations, {Location-A}, {Location-B} and {Location-C}.", f"For example: {{Location-A}} is {LOC_A} and {{Location-B}} is {LOC_B}."),
   START("APS")],
  ["Open the Location menu, untick {Location-C}, close it and copy the page address.", "Paste the address into a new tab.",
   "Open the Location menu, tick {Location-C} again and note whether the address still lists locations.",
   "In the copied address, add {Location-C} to the listed locations, separated by a comma, and open it."],
  ["Step 1: the address carries the two ticked locations.", "Step 2: the report opens with {Location-A} and {Location-B} ticked (\"Location: 2 locations\").",
   "Step 3: with every location ticked the address no longer lists locations.",
   "Step 4: a link naming every location opens as \"Location: All locations\"."],
  ["S5-R10"],
  note=f"How a location is written in the address is question {QN['link-format']}; the tester copies the address after ticking and edits only the list.")

k = nk()
C(k, "S5", "A/R Detail: a link with an unknown location ignores it",
  [ADMIN(), TWO_LOC, START("ARD")],
  ["Open the Location menu, untick {Location-B}, close it and copy the page address.",
   "In the copied address, add a location that does not exist (for example \"Nowhere\"), separated by a comma, and open it.",
   "Read the Location chip and look for the Location column."],
  ["Step 1: the address carries {Location-A}.", "Step 2: the report loads normally, with no error.",
   "Step 3: the chip reads as if only {Location-A} were in the link ({Location-A}'s name), and the Location column is hidden, following the remaining choice."],
  ["S5-N2"],
  note=f"How a location is written in the address is question {QN['link-format']}.")

k = nk()
C(k, "S5", "A/P Unpaid Invoices: a Past due value the chip does not offer reads Any",
  [ADMIN(), START("APU")],
  ["Open the Past due filter, tick \"31-60 days\", close it and copy the page address.",
   "In the copied address, replace the Past due value with 5 and open it.", "Read the Past due chip.",
   "In the copied address, replace the Past due value with \"any\" and open it.", "Read the Past due chip."],
  ["Step 1: the chip reads \"Past due: 31-60 days\".", "Step 2: the report loads normally.", "Step 3: \"Past due: Any\" in the resting (grey) style.",
   "Step 4: the report loads normally.", "Step 5: \"Past due: Any\"."],
  ["S5-N3", "S5-R15"],
  note=f"How the Past due value is written in the address is question {QN['link-format']}.")

k = nk()
C(k, "S5", "A/R Summary: ticked customers and ranges survive reload and Back",
  [ADMIN(), ("Customers {Customer-A} and {Customer-B} have invoices more than 90 days past due on today's date.", f"For example: {{Customer-A}} is {ex(k, 'Kept One')[0]} and {{Customer-B}} is {ex(k, 'Kept Two')[0]}."),
   START("ARS")],
  ["Open the Customer filter and tick {Customer-A} and {Customer-B}.", "Open the Past due filter and tick \"91+ days\".", "Reload the page.",
   "Open the Past due filter and untick \"91+ days\".", "Click the browser's Back button."],
  ["Step 1: the chip reads \"Customer: 2 customers\".", "Step 2: the chip reads \"Past due: 91+ days\".",
   "Step 3: both customers and \"91+ days\" are still ticked after the reload.", "Step 4: the chip reads \"Past due: Any\".",
   "Step 5: \"91+ days\" is ticked again and both customers are still ticked."],
  ["S5-R19", "S5-R10"])

k = nk()
C(k, "S5", "A/R Collection: a customer ticked by link is named even if hard to find",
  [ADMIN(), ("More than 50 customers have overdue invoices on today's date; {Customer-A}'s name comes late in name order, so it is not among the first results of the Customer search.",
             f"For example: {{Customer-A}} is {ex(k, 'Late In The List')[0]}."),
   START("ARC")],
  ["Open the Customer filter, find and tick {Customer-A}, close it and copy the page address.", "Paste the address into a new tab.",
   "Read the Customer chip.", "Open the Customer menu."],
  ["Step 1: the chip shows {Customer-A}'s name.", "Step 2: the report opens with only {Customer-A}'s group.",
   "Step 3: the chip names {Customer-A}.", "Step 4: {Customer-A} is shown ticked in the menu."],
  ["S5-R14"])

k = nk()
C(k, "S5", "A/P Unpaid Invoices: opening from the Reports menu starts with no filters",
  [ADMIN(), TWO_LOC, ("Vendor {Vendor-A} has unpaid bills on yesterday's date.", f"For example: {{Vendor-A}} is {ex(k, 'Fresh Start')[0]}."), START("APU")],
  ["Change the as-of date to yesterday.", "Tick {Vendor-A} in the Vendor filter, \"61-90 days\" in Past due, and untick {Location-B} in Location.",
   "Open Reports > Finance > Sales By Customer.", "Open Reports > Finance > A/P Unpaid Invoices from the Reports menu.", "Read the filter row."],
  ["Step 1: the date chip shows yesterday.", "Step 2: the three chips show the choices.", "Step 3: Sales By Customer opens.",
   "Step 4: A/P Unpaid Invoices opens.",
   "Step 5: \"As of: \" today's date, \"Vendor: All vendors\", \"Past due: Any\" and \"Location: All locations\": nothing was remembered."],
  ["S5-R10a"])

for code in ("ARS", "APS"):
    r = R[code]; k = nk(); P = r["Party"]; to = R[DRILL_TO[code]]["n"]
    perm = "" if code == "APS" else " (you have \"Customers → View\")"
    C(k, "S5", f"{r['n']}: clicking a {r['party']} opens {to} with the same filters",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has {r['doc']}s at {{Location-A}} more than 90 days past due on yesterday's date.", f"For example: {{{P}-A}} is {ex(k, 'Drill Down')[0]}."),
       START(code)],
      ["Change the as-of date to yesterday.", "Open the Past due filter and tick \"91+ days\".", "Open the Location filter and untick {Location-B}.",
       f"Click {{{P}-A}}'s name{perm}.", "Read the page title and every chip."],
      ["Step 1: the report shows yesterday.", "Step 2: the chip reads \"Past due: 91+ days\".", "Step 3: the report narrows to {Location-A}.",
       f"Step 4: {to} opens.",
       f"Step 5: only {{{P}-A}} is ticked on the {P} chip, the as-of date is yesterday, \"Past due: 91+ days\", and only {{Location-A}} is ticked."],
      ["S5-R11", "KD-DRILL", "WC-6"], reports=[code, DRILL_TO[code]])

# ---- the Customer and Vendor menus
for code in ("ARD", "APD"):
    r = R[code]; k = nk(); P = r["Party"]; Ps = r["parties"]
    srch = "with a search box" if P == "Customer" else "with a search box whose placeholder reads \"Search vendors\""
    C(k, "S5", f"{r['n']}: the {P} menu ticks several {Ps} and the chip counts them",
      [ADMIN(), (f"{P}s {{{P}-A}} and {{{P}-B}} have open {r['doc']}s on today's date; {{{P}-B}}'s name is longer than the chip can show.",
                 f"For example: {{{P}-A}} is {ex(k, 'Short')[0]} and {{{P}-B}} is {ex(k, 'Northern Alberta Heavy Equipment and Trailer Repair')[0]}."),
       START(code)],
      [f"Click the {P} chip and read the menu from top to bottom.", f"Type part of {{{P}-B}}'s name in the search box and tick {{{P}-B}}.",
       "Read the chip.", f"Search for {{{P}-A}} and tick it.", "Read the chip and expand every group.", f"Untick both {Ps}.", "Read the chip."],
      [f"Step 1: the menu opens {srch}, an \"All {Ps}\" row, the line \"All {Ps} are included. Pick one or more to narrow.\" and the list of {Ps}.",
       f"Step 2: {{{P}-B}} is ticked.",
       f"Step 3: the chip shows {{{P}-B}}'s name, shortened with \"...\" because it is long.",
       f"Step 4: {{{P}-A}} is ticked as well.",
       f"Step 5: the chip reads \"{P}: 2 {Ps}\"; only the two {Ps}' rows remain.",
       f"Step 6: no {P.lower()} is ticked.",
       f"Step 7: \"{P}: All {Ps}\" in the resting (grey) style."],
      ["S5-R13"],
      note=f"Whether the one-name chip also says \"{P}: \" is question {QN['chip-one']}; from what length a name is shortened is question {QN['chip-long']}.")

# ---- the Past due menu
for code in ("ARC", "APS"):
    r = R[code]; k = nk()
    C(k, "S5", f"{r['n']}: the Past due menu offers Any and four ranges in order",
      [ADMIN(), START(code)],
      ["Click the Past due chip and read the menu from top to bottom.", "Tick \"91+ days\" and read the chip.", "Tick \"31-60 days\" and read the chip.",
       "Tick \"1-30 days\" and \"61-90 days\" and read the chip.", "Untick all four and read the chip."],
      ["Step 1: an \"Any\" row, the line \"All ranges are included. Pick one or more to narrow.\", then \"1-30 days\", \"31-60 days\", \"61-90 days\", \"91+ days\", in that order.",
       "Step 2: \"Past due: 91+ days\".", "Step 3: \"Past due: 2 ranges\".",
       "Step 4: \"Past due: 4 ranges\", not Any.", "Step 5: \"Past due: Any\" in the resting (grey) style."],
      ["S5-R15"])

# ---- empty after a customer with nothing at the chosen location
k = nk()
C(k, "S5", "A/R Summary: no rows after a customer pick, and the Location chip stays",
  [ADMIN(), TWO_LOC, ("Customer {Customer-A} has open invoices only at {Location-B}.", f"For example: {{Customer-A}} is {ex(k, 'Only There')[0]}."),
   START("ARS", ", with only {Location-A} ticked in the Location filter")],
  ["Open the Customer filter and tick {Customer-A}.", "Look at the table and the filter row.", "Click \"Clear all filters\"."],
  ["Step 1: the report is empty: {Customer-A} has nothing open at {Location-A}.",
   "Step 2: the empty state shows, and the Location chip stays visible so the selection can be cleared.",
   "Step 3: the Customer and Location filters return to their defaults (\"Customer: All customers\", \"Location: All locations\"), the as-of date stays, and rows show again."],
  ["S5-E1", "S8-R5"])

# ---- switching location in the top right while on a report
for code in ("ARC", "APD"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]; Dc = d.capitalize()
    link = ("its finance page opens without asking to switch location, because {Location-B} is now your current location" if code == "ARC"
            else "it is now a link and its delivery opens (before the switch it was plain text, because it was at another location)")
    C(k, "S5", f"{r['n']}: switching location in the top right reloads the report",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has an overdue {d} {{{Dc}-A}} at {{Location-B}} and others at {{Location-A}}.", f"For example: {{{P}-A}} is {ex(k, 'Switcher')[0]}."),
       START(code, f", with {{{P}-A}} ticked, \"Past due: 1-30 days\" ticked, the \"Amount\" header clicked once, every group expanded and the page scrolled down")],
      ["Open the location switcher in the top right of ShopView and switch to {Location-B}.", "Read the chips.", "Look at the rows and the sort mark.",
       "Look at the groups and the scroll position.", f"Click {{{Dc}-A}}'s number."],
      ["Step 1: the report reloads and you stay on it.", "Step 2: the same filters: the same as-of date, {" + P + "-A} ticked, \"Past due: 1-30 days\" and every location ticked.",
       "Step 3: the same rows, back in the opening order (the Amount sort is gone).", "Step 4: every group is collapsed and the page is back at the top.",
       f"Step 5: {link}."],
      ["S5-E2", "OOS-8", "S7-E1"])
