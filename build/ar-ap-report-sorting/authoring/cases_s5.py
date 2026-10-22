"""Story 5 — Filters: customer or vendor, past due and location. The numbers the filters leave (S5-R8, S5-R16 to S5-R18) are in cases_data.py."""
from ar_lib import C, ALL6
from common import *
from po_questions import QN
import tech_plan as TP

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
      ["Click the Location chip and read the list.", "Close the menu and look at the rows' Location column.",
       f"In the {P} filter, tick {{{P}-A}}.", "Click the Location chip and read the list.",
       "In the Past due filter, tick \"1-30 days\".", "Click the Location chip and read the list.",
       "In the Location menu, untick {Location-B}.", "Close the menu, open it again and read the list.",
       "Change the as-of date to {Date-A}.", "Click the Location chip and read the list."],
      ["Step 1: both {Location-A} and {Location-B} are listed and ticked, although you are enrolled only at {Location-A}.",
       "Step 2: rows from {Location-B} are shown too: the report stays organization-wide.",
       f"Step 3: only {{{P}-A}}'s rows remain.",
       "Step 4: both locations are still listed: the list is not narrowed by the " + P + " filter.",
       "Step 5: the chip reads \"Past due: 1-30 days\".",
       "Step 6: both locations are still listed: the list is not narrowed by the Past due filter.",
       "Step 7: {Location-B} is unticked.",
       "Step 8: {Location-B} is still in the list, unticked: the list is not narrowed by the Location filter.",
       "Step 9: the report reloads for {Date-A}.",
       "Step 10: the list changes with the as-of date: {Location-B} is no longer offered."],
      ["S5-R3", "S5-R12", "OOS-2", "KD-ORG", "GOAL-ACCESS"])

k = nk()
C(k, "S5", "Location names in the menu and column match the location switcher",
  [ADMIN(), TWO_LOC, START("ARD", ", with every bucket expanded (Expand all)")],
  ["Open the location switcher in the top right of ShopView and read the two location names.", "Close the switcher without switching.",
   "Click the Location chip and read the two names.", "Read the Location column."],
  ["Step 1: the switcher names {Location-A} and {Location-B}.", "Step 2: you are still at {Location-A}.",
   "Step 3: the menu names them exactly as the switcher does, letter for letter.",
   "Step 4: the Location column uses the same names."],
  ["S5-R4"])

k = nk()
C(k, "S5", "A/R Summary: the Location chip reads all, a count, one name or none",
  [ADMIN(), ("The organization has open A/R documents at three locations, {Location-A}, {Location-B} and {Location-C}; {Location-C}'s name is longer than the chip can show.",
             f"For example: {{Location-A}} is {LOC_A}, {{Location-B}} is {LOC_B} and {{Location-C}} is ZZAUTOTEST {k} Northern Alberta Heavy Equipment Service Centre."),
   START("ARS")],
  ["Read the Location chip.", "In the Location menu, untick {Location-B}.", "Untick {Location-A}.", "Untick {Location-C}."],
  ["Step 1: \"Location: All locations\".", "Step 2: \"Location: 2 locations\".",
   "Step 3: the chip reads \"Location: \" and {Location-C}'s name, shortened with \"...\" because it is long.",
   "Step 4: \"Location: No locations\"."],
  ["S5-R6"],
  note="The Location chip is the native one, exactly as on Sales By Customer: with one location ticked, and for a long name, it reads as that chip does.")

k = nk()
C(k, "S5", "A/P Detail: with no location ticked the report is empty",
  [ADMIN(), TWO_LOC, START("APD")],
  ["In the Location menu, click \"Clear selection\".", "Look at the table area.", "Reload the page."],
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
  ["Read the Location column of {Invoice-A}, {Credit-memo-A} and {Deposit-A}.", "In the Location menu, untick {Location-B}.",
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
   ("Vendor {Vendor-A} has two unpaid bills: {Bill-A}, received on a delivery at {Location-A}, and {Bill-B}, received on a delivery at {Location-B}.",
    f"For example: {{Vendor-A}} is {ex(k, 'Delivered Elsewhere')[0]}; {{Bill-A}} and {{Bill-B}} are the bills of two vendor orders, one received at each location."),
   START("APD", ", with the Vendor filter showing {Vendor-A} ticked and every bucket expanded")],
  ["Read the Location of {Bill-A} and {Bill-B}.", "In the Location menu, untick {Location-B}.", "Expand every bucket and look for {Bill-A} and {Bill-B}."],
  ["Step 1: {Bill-A} shows {Location-A} and {Bill-B} shows {Location-B}: each bill shows the location of the delivery it was received on.",
   "Step 2: the report narrows to {Location-A}.",
   "Step 3: {Bill-A} is listed and {Bill-B} is not."],
  ["S5-R7"] + TP.q("Q2"))

k = nk()
C(k, "S5", "A/P Unpaid Invoices: a vendor credit belongs to its return or vendor",
  [ADMIN(), TWO_LOC,
   ("Vendor {Vendor-A} has two unused vendor credits: {Vendor-credit-A}, from a vendor return made at {Location-B}, and {Vendor-credit-B}, entered directly (not from a vendor return) while signed in at {Location-A}.",
    f"For example: {{Vendor-A}} is {ex(k, 'Credit Home')[0]}."),
   START("APU", ", with the Vendor filter showing {Vendor-A} ticked and its group expanded")],
  ["Read the Location of {Vendor-credit-A} and {Vendor-credit-B}.", "In the Location menu, untick {Location-A}.", "Expand {Vendor-A}'s group."],
  ["Step 1: {Vendor-credit-A} shows {Location-B} (the return's location); {Vendor-credit-B} shows {Location-A} (the vendor's location for that credit, where it was entered, as today).",
   "Step 2: the report narrows to {Location-B}.", "Step 3: only {Vendor-credit-A} is listed."],
  ["S5-R7"] + TP.q("Q2", "D13"),
  note="A vendor has no single location of its own: each bill or credit is written to the vendor's account at one location, and that is the location it shows (tech plan, 21 Oct 2026).")

# ---- when the chip shows
k = nk()
C(k, "S5", "A/R Collection: the Location chip hides when only one location has data",
  [ADMIN(), TWO_LOC, ("On {Date-A} the organization's open A/R documents were all at {Location-A}.", "For example: {Date-A} is a date before {Location-B}'s first invoice."),
   START("ARC")],
  ["Look for the Location chip.", "In the Location menu, untick {Location-B}.", "Change the as-of date to {Date-A}.", "Look for the Location chip."],
  ["Step 1: the Location chip shows (two locations in the list).",
   "Step 2: the chip still shows, reading \"Location: \" and {Location-A}'s name, so the choice can be undone.",
   "Step 3: the report reloads for {Date-A}.",
   "Step 4: the Location chip is not shown: the only location in the list is ticked."],
  ["S5-R9", "S5-N1"],
  note="If step 3 keeps {Location-B} unticked in the address, tick every location before step 3; the case is about the one-location list.")

# ---- the page address
k = nk()
C(k, "S5", "A/R Collection: ticked locations survive reload, Back and a shared link",
  [ADMIN(), TWO_LOC, START("ARC")],
  ["In the Location menu, untick {Location-B}.", "Copy the page address.", "Reload the page.",
   "In the Location menu, click \"Select all\".", "Click the browser's Back button.", "Open a new browser tab and paste the copied address."],
  ["Step 1: the report narrows to {Location-A}.", "Step 2: the address is copied.", "Step 3: the report reloads with only {Location-A} ticked.",
   "Step 4: every location is ticked.", "Step 5: the report shows only {Location-A} ticked again.",
   "Step 6: the shared link opens the report with only {Location-A} ticked."],
  ["S5-R10"])

k = nk()
C(k, "S5", "A/P Summary: a link naming several locations or every location",
  [ADMIN(), ("The organization has open A/P documents at three locations, {Location-A}, {Location-B} and {Location-C}, and you are enrolled at all three.", f"For example: {{Location-A}} is {LOC_A} and {{Location-B}} is {LOC_B}."),
   START("APS")],
  ["In the Location menu, untick {Location-C}.", "Copy the page address.", "Open the copied address in a new browser tab.",
   "In the new tab's address, replace the two \"locationIds=\" entries with one: \"locationIds=\" followed by the two codes separated by a comma, and press Enter.",
   "In the first tab's Location menu, click \"Clear selection\".", "Tick {Location-C} and look at the page address.",
   "In the new tab's address, add a comma and {Location-C}'s code after the two codes, and press Enter.",
   "In the first tab's Location menu, click \"Select all\" and look at the page address."],
  ["Step 1: the report narrows to {Location-A} and {Location-B}.",
   "Step 2: the address carries the two ticked locations as two \"locationIds=\" entries, each followed by a long code (the location's code, not its name).",
   "Step 3: the report opens with {Location-A} and {Location-B} ticked (\"Location: 2 locations\").",
   "Step 4: the same: a link listing locations separated by commas opens with those two ticked (\"Location: 2 locations\").",
   "Step 5: no location is ticked.",
   "Step 6: only {Location-C} is ticked, and the address holds one \"locationIds=\" entry: {Location-C}'s code. Note it.",
   "Step 7: a link naming every location opens as \"Location: All locations\".",
   "Step 8: every location is ticked and the address no longer lists locations."],
  ["S5-R10"] + TP.q("D30-keys"),
  note="The tester edits only the location part of the copied address.")

k = nk()
C(k, "S5", "A/R Detail: a link with an unknown location ignores it",
  [ADMIN(), TWO_LOC, START("ARD")],
  ["In the Location menu, untick {Location-B}.", "Copy the page address.",
   "In the copied address, after {Location-A}'s code (the text after \"locationIds=\"), add a comma and \"Nowhere\", and open it.",
   "Read the Location chip and look for the Location column.",
   "In the copied address, replace everything after \"locationIds=\" with \"Nowhere\", and open it.",
   "Read the Location chip and look for the Location column."],
  ["Step 1: the report narrows to {Location-A}.", "Step 2: the address carries one \"locationIds=\" entry, {Location-A}'s code.", "Step 3: the report loads normally, with no error.",
   "Step 4: the chip reads as if only {Location-A} were in the link (\"Location: \" and {Location-A}'s name), and the Location column is hidden, following the remaining choice.",
   "Step 5: the report loads normally, with no error.",
   "Step 6: with no valid location left, the link opens on \"Location: All locations\" and the Location column shows (two locations in the list)."],
  ["S5-N2"] + TP.q("D29", "P1-FE-invalid"),
  note="The tester edits only the list of locations in the copied address.")

k = nk()
C(k, "S5", "A/P Unpaid Invoices: a Past due value the chip does not offer reads Any",
  [ADMIN(), START("APU")],
  ["In the Past due filter, tick \"31-60 days\".", "Copy the page address.",
   "In the copied address, replace the 31-60 after \"pastDue=\" with 5, and open it.", "Read the Past due chip.",
   "In the copied address, replace the value after \"pastDue=\" with any, and open it.", "Read the Past due chip."],
  ["Step 1: the chip reads \"Past due: 31-60 days\".", "Step 2: the address carries \"pastDue=31-60\".", "Step 3: the report loads normally.",
   "Step 4: \"Past due: Any\" in the resting (grey) style.", "Step 5: the report loads normally.", "Step 6: \"Past due: Any\"."],
  ["S5-N3", "S5-R15"] + TP.q("D16", "P1-FE-invalid"),
  note="The tester edits only the Past due value in the copied address.")

k = nk()
C(k, "S5", "A/R Summary: ticked customers and ranges survive reload and Back",
  [ADMIN(), ("Customers {Customer-A} and {Customer-B} have invoices more than 90 days past due on today's date.", f"For example: {{Customer-A}} is {ex(k, 'Kept One')[0]} and {{Customer-B}} is {ex(k, 'Kept Two')[0]}."),
   START("ARS")],
  ["In the Customer filter, tick {Customer-A} and {Customer-B}.", "In the Past due filter, tick \"91+ days\".", "Reload the page.",
   "In the Past due filter, untick \"91+ days\".", "Click the browser's Back button."],
  ["Step 1: the chip reads \"Customer: 2 customers\".", "Step 2: the chip reads \"Past due: 91+ days\".",
   "Step 3: both customers and \"91+ days\" are still ticked after the reload.", "Step 4: the chip reads \"Past due: Any\".",
   "Step 5: \"91+ days\" is ticked again and both customers are still ticked."],
  ["S5-R19", "S5-R10"])

k = nk()
C(k, "S5", "A/R Collection: a customer ticked by link is named even if hard to find",
  [ADMIN(), ("The organization has more than 50 customers (the Customer menu lists at most 50 until you search), and {Customer-A}, who has overdue invoices on today's date, comes after the first 50 in name order.",
             f"For example: {{Customer-A}} is {ex(k, 'Late In The List')[0]}."),
   START("ARC")],
  ["In the Customer filter, search for {Customer-A} and tick it.", "Copy the page address.", "Paste the address into a new tab.",
   "Read the Customer chip.", "Open the Customer menu."],
  ["Step 1: the chip reads \"Customer: \" and {Customer-A}'s name.", "Step 2: the address is copied.", "Step 3: the report opens with only {Customer-A}'s group.",
   "Step 4: the chip reads \"Customer: \" and {Customer-A}'s name.", "Step 5: {Customer-A} is shown ticked in the menu."],
  ["S5-R14"] + TP.q("D31", "API-cust"))

k = nk()
C(k, "S5", "A/P Unpaid Invoices: opening from the Reports menu starts with no filters",
  [ADMIN(), TWO_LOC, ("Vendor {Vendor-A} has unpaid bills on yesterday's date.", f"For example: {{Vendor-A}} is {ex(k, 'Fresh Start')[0]}."), START("APU")],
  ["Change the as-of date to yesterday.", "In the Vendor filter, tick {Vendor-A}.", "In the Past due filter, tick \"61-90 days\".", "In the Location menu, untick {Location-B}.",
   "Open Reports > Finance > Sales By Customer.", "Open Reports > Finance > A/P Unpaid Invoices from the Reports menu.", "Read the filter row."],
  ["Step 1: the date chip shows yesterday.", "Step 2: the Vendor chip reads \"Vendor: \" and {Vendor-A}'s name.", "Step 3: \"Past due: 61-90 days\".",
   "Step 4: the chip reads \"Location: \" and {Location-A}'s name.", "Step 5: Sales By Customer opens.",
   "Step 6: A/P Unpaid Invoices opens.",
   "Step 7: \"As of: \" today's date, \"Vendor: All vendors\", \"Past due: Any\" and \"Location: All locations\": nothing was remembered."],
  ["S5-R10a"])

for code in ("ARS", "APS"):
    r = R[code]; k = nk(); P = r["Party"]; to = R[DRILL_TO[code]]["n"]
    perm = "" if code == "APS" else " (you have \"Customers → View\")"
    C(k, "S5", f"{r['n']}: clicking a {r['party']} opens {to} with the same filters",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has {r['doc']}s at {{Location-A}} more than 90 days past due on yesterday's date.", f"For example: {{{P}-A}} is {ex(k, 'Drill Down')[0]}."),
       START(code)],
      ["Change the as-of date to yesterday.", "In the Past due filter, tick \"91+ days\".", "In the Location filter, untick {Location-B}.",
       f"Click {{{P}-A}}'s name{perm}.", "Read the page title and every chip."],
      ["Step 1: the report shows yesterday.", "Step 2: the chip reads \"Past due: 91+ days\".", "Step 3: the report narrows to {Location-A}.",
       f"Step 4: {to} opens.",
       f"Step 5: only {{{P}-A}} is ticked on the {P} chip, the as-of date is yesterday, \"Past due: 91+ days\", and only {{Location-A}} is ticked."],
      ["S5-R11", "KD-DRILL", "WC-6"] + TP.q("P3-drill", "P2-interim"), reports=[code, DRILL_TO[code]],
      note=(f"The developers deliver the reports family by family (tech plan, 21 Oct 2026): until {to} itself is updated on the build, the click opens it with "
            f"only the as-of date and the {r['party']}, as today. If {to} on the build still looks as before the release (no Past due or Location chip), mark this "
            f"test Blocked: \"{to} not yet updated on this build\", not Failed."))

# ---- the Customer and Vendor menus
for code in ("ARD", "APD"):
    r = R[code]; k = nk(); P = r["Party"]; Ps = r["parties"]
    srch = "with a search box" if P == "Customer" else "with a search box whose placeholder reads \"Search vendors\""
    C(k, "S5", f"{r['n']}: the {P} menu ticks several {Ps} and the chip counts them",
      [ADMIN(), (f"{P}s {{{P}-A}} and {{{P}-B}} have open {r['doc']}s on today's date; {{{P}-B}}'s name is longer than the chip can show.",
                 f"For example: {{{P}-A}} is {ex(k, 'Short')[0]} and {{{P}-B}} is {ex(k, 'Northern Alberta Heavy Equipment and Trailer Repair')[0]}.")]
      + ([("The organization has more than 8 vendors (the Vendor menu shows its search box only then, as on Inventory Value).", "For example: the QA organization (437 vendors).")] if P == "Vendor" else [])
      + [START(code)],
      [f"Click the {P} chip and read the menu from top to bottom.", f"Type part of {{{P}-B}}'s name in the search box and tick {{{P}-B}}.",
       "Read the chip.", f"Search for {{{P}-A}} and tick it.", "Read the chip and expand every group.", f"Untick both {Ps}.", "Read the chip."],
      [f"Step 1: the menu opens {srch}, an \"All {Ps}\" row, the line \"All {Ps} are included. Pick one or more to narrow.\" and the list of {Ps}.",
       f"Step 2: {{{P}-B}} is ticked.",
       f"Step 3: the chip reads \"{P}: \" and {{{P}-B}}'s name, shortened with \"...\" because it is long.",
       f"Step 4: {{{P}-A}} is ticked as well.",
       f"Step 5: the chip reads \"{P}: 2 {Ps}\"; only the two {Ps}' rows remain.",
       f"Step 6: no {P.lower()} is ticked.",
       f"Step 7: \"{P}: All {Ps}\" in the resting (grey) style."],
      ["S5-R13"] + (TP.q("D18") if P == "Vendor" else []),
      note=f"The {P} chip is the native one (as on " + ("Sales By Customer" if P == "Customer" else "Inventory Value") + "): with one name ticked, and for a long name, it reads as that chip does.")

# ---- the Past due menu
for code in ("ARC", "APS"):
    r = R[code]; k = nk()
    C(k, "S5", f"{r['n']}: the Past due menu offers Any and four ranges in order",
      [ADMIN(), START(code)],
      ["Click the Past due chip and read the menu from top to bottom.", "Tick \"91+ days\" and read the chip.", "Tick \"31-60 days\" and read the chip.",
       "Tick \"1-30 days\" and \"61-90 days\" and read the chip.", "Untick all four and read the chip."],
      ["Step 1: an \"Any\" row (ticked, as no range is), the line \"All ranges are included. Pick one or more to narrow.\", then \"1-30 days\", \"31-60 days\", \"61-90 days\", \"91+ days\", in that order.",
       "Step 2: \"Past due: 91+ days\".", "Step 3: \"Past due: 2 ranges\".",
       "Step 4: \"Past due: 4 ranges\", not Any, and the \"Any\" row is not ticked.", "Step 5: \"Past due: Any\" in the resting (grey) style, and the \"Any\" row is ticked again."],
      ["S5-R15"] + TP.q("FSN"))

# ---- empty after a customer with nothing at the chosen location
k = nk()
C(k, "S5", "A/R Summary: no rows after a customer pick, and the Location chip stays",
  [ADMIN(), TWO_LOC, ("Customer {Customer-A} has open invoices only at {Location-B}.", f"For example: {{Customer-A}} is {ex(k, 'Only There')[0]}."),
   START("ARS", ", with only {Location-A} ticked in the Location filter")],
  ["In the Customer filter, tick {Customer-A}.", "Look at the table and the filter row.", "Click \"Clear all filters\"."],
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

# ---- tech plan, 22 Oct 2026 pass: unknown customers and vendors in a link (D29), the As of date (D20), quick ticks (NFR-005)
for code, key_word in (("ARC", "customerIds"), ("APU", "vendorIds")):
    r = R[code]; k = nk(); P = r["Party"]; Ps = r["parties"]
    C(k, "S5", f"{r['n']}: a link with an unknown {r['party']} ignores it",
      [ADMIN(), (f"{P} {{{P}-A}} has overdue {r['doc']}s on today's date.", f"For example: {{{P}-A}} is {ex(k, 'Old Link')[0]}."), START(code)],
      [f"In the {P} filter, tick {{{P}-A}}.", "Copy the page address.",
       f"In the copied address, after {{{P}-A}}'s code (the text after \"{key_word}=\"), add a comma and \"Nobody\", and open it.",
       f"Read the {P} chip and the groups.",
       f"In the copied address, replace everything after \"{key_word}=\" with \"Nobody\", and open it.",
       f"Read the {P} chip."],
      [f"Step 1: the chip reads \"{P}: \" and {{{P}-A}}'s name; only {{{P}-A}}'s group is listed.",
       f"Step 2: the address carries \"{key_word}=\" followed by {{{P}-A}}'s code (a long code, not the name).",
       "Step 3: the report loads normally, with no error.",
       f"Step 4: the chip reads \"{P}: \" and {{{P}-A}}'s name and only {{{P}-A}}'s group is listed: the unknown {r['party']} is ignored.",
       "Step 5: the report loads normally, with no error.",
       f"Step 6: \"{P}: All {Ps}\" in the resting (grey) style: with no known {r['party']} left, the link opens as if none were ticked."],
      ["S5-R19", "S5-R14"] + TP.q("D29", "D29-why", "D30-keys"),
      note=f"Why: a link saved earlier can name a {r['party']} that was since deleted or merged; the tech plan says such a link must still open the report.")

k = nk()
C(k, "S5", "A/R Summary: the As of date cannot be set later than today",
  [ADMIN(), START("ARS")],
  ["Click the date chip (\"As of: \" and today's date).", "Try to pick tomorrow's date in the calendar."],
  ["Step 1: a calendar opens with today's date selected.",
   "Step 2: tomorrow, and every date after it, cannot be picked; the chip still reads \"As of: \" and today's date."],
  ["S5-R1", "KD-REUSE"] + TP.q("D20"))

k = nk()
C(k, "S5", "A/R Summary: ticking several customers quickly shows rows for all of them",
  [ADMIN(), ("Five customers, {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D} and {Customer-E}, each have one open invoice on today's date, of different amounts, and nothing else open.",
             f"For example: {{Customer-A}} to {{Customer-E}} are {ex(k, 'Quick 1')[0]} to {ex(k, 'Quick 5')[0]}, with invoices of $100.00, $200.00, $300.00, $400.00 and $500.00."),
   START("ARS")],
  ["Click the Customer chip.",
   "Tick {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D} and {Customer-E} one after another, as fast as you can (within about two seconds).",
   "Close the menu and wait until the report stops loading.",
   "Read the chip, the rows and the Totals row.",
   "Wait ten seconds without touching anything, then read the rows and the Totals row again."],
  ["Step 1: the Customer menu opens.",
   "Step 2: all five are ticked.",
   "Step 3: the report loads once more and shows its rows.",
   "Step 4: the chip reads \"Customer: 5 customers\"; exactly five rows, one per customer, and the Totals row's Total is the five amounts added up (with the example amounts 100.00 + 200.00 + 300.00 + 400.00 + 500.00 = $1,500.00).",
   "Step 5: the same five rows and the same Totals: no late answer for an earlier tick replaces them."],
  ["S5-R13", "S5-R18"] + TP.q("NFR5", "P1-rapid"),
  note="Why: the report waits until you stop ticking and then asks once, dropping any answer still on its way for an earlier tick (tech plan). The wait itself is too short to see; the end state is what a tester checks.")
