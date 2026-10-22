"""Design — how it looks (Rules 126, 130, 133; lessons L-01 to L-04). The design canvas could not be read on 22 Oct 2026, so every case
here is written from the PRD's own look sentences (the brief: "from the PRD's own look sentences now"). Each names what to compare with:
the native report the PRD says the control is copied from (Sales By Customer, Inventory Value, Work In Progress, Technician Utilization),
open side by side. One case per screen and state for all six reports, at 1440 and 1536 px, light and dark; every menu, dialog, tooltip,
toast and empty state listed with its rows and buttons in order (L-02); every label compared letter for letter, capitals included (L-04).
When the design arrives, the whole design is driven and every case here is re-checked (Rules 120, 122, 133)."""
from ar_lib import C, ALL6, GROUPED, DESIGN_URL
from common import *
from po_questions import QN

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"D-{ORDER['n']:02d}"
def DREF(pages):
    return (f'Design canvas "A/R and A/P Report Sorting" ({DESIGN_URL}), {pages} as the PRD names it. Not yet read: the design was not '
            "available to this pass (22 Oct 2026). Until it is, this case compares with the native reports the PRD names. When the design is "
            "driven, its picture of this screen is attached here, every attribute is re-checked against it, and any difference gets a sent "
            "question and a held design-version case (Rules 120, 126, 130).")
SBC2 = "Reports > Finance > Sales By Customer is open in a second tab of the same window, for comparison."

def headings(code):
    r = R[code]
    cols = [("the " + r["party"] + " name heading (first column)") if c == "name" else f"\"{c}\"" for c in r["cols"]]
    return ", ".join(cols)

def long_pre(code, k):
    r = R[code]; P = r["Party"]
    return (f"{P} {{{P}-A}} has a long name (more than 40 characters) and open documents at both locations on today's date"
            + (", including a vendor credit (its Transaction Type is the longest)" if r["fam"] == "A/P" else ", including a credit memo") + ".",
            f"For example: {{{P}-A}} is {ex(k, 'Northern Alberta Heavy Equipment and Trailer Repair')[0]}.")

# ---------------- per report: 1440 light, 1440 dark, 1536 light and dark ----------------
for code in ALL6:
    r = R[code]; P = r["Party"]; summ = code in ("ARS", "APS")
    link = (f"the {r['party']} names" if summ else "the document numbers that are links")
    k = nk()
    C(k, "DESIGN", f"Design: {r['n']} at 1440 px in light theme looks as described",
      [ADMIN(), TWO_LOC, long_pre(code, k),
       START(code, " in light theme at 100% zoom" + ("" if summ else ", with every group expanded (Expand all)")), SBC2],
      ["Look at the title row.",
       "Look at where the filter row sits, and compare with Sales By Customer.",
       "Read the column headings left to right, letter for letter, capitals included.",
       "Look for a sideways scroll bar under the table.",
       f"Look at the \"{r['headline']}\" column on the header, the rows and the Totals row, and compare with Sales By Customer.",
       "Compare the Totals row with Sales By Customer's Totals row.",
       (f"Look at {{{P}-A}}'s name cell and at the money cells." if summ else f"Look at {{{P}-A}}'s rows: the name and Transaction type cells, and the money, date and number cells."),
       f"Look at {link}.",
       "Press Tab until a link has keyboard focus.",
       "Look across the whole page for any text that overlaps, is cut off or is clipped."],
      ["Step 1: the title, its info icon directly right of it, and the ⋯ Export button at the right end, all on one line.",
       "Step 2: the filter row sits below the title row, in the same place as on Sales By Customer.",
       f"Step 3: {headings(code)} (\"Location\" shown because two locations are in view; it sits right after "
       + ("the name" if summ else "\"Date\"") + "). No heading wraps.",
       "Step 4: there is none: every column is visible at 1440 px without scrolling sideways.",
       f"Step 5: \"{r['headline']}\" is pinned to the right edge and bold on the header, every row" + ("" if summ else ", every expanded row") + " and the Totals row, as on Sales By Customer.",
       "Step 6: the same native totals row style.",
       "Step 7: " + ("the long name wraps" if summ else "the long name and a long Transaction type wrap") + " onto a second line; money, date and number cells stay on one line"
       + (", and Location wraps only on this report (nine columns)." if code == "APD" else ", and Location does not wrap."),
       "Step 8: they use the native report link style: the same blue as Work In Progress, semi-bold, no underline.",
       "Step 9: the focused link is underlined; links are underlined only on keyboard focus.",
       "Step 10: nothing overlaps, is cut off or clipped."],
      ["S8-R2", "S8-R3", "S8-R4", "S7-R7", f"S2-R1 {code}", "S6-R3", "KD-REUSE"],
      note=("The first column keeps today's heading: only the Location column is renamed in this release." if summ else
            (f"The PRD writes \"Open balance\", \"Due date\" and \"Transaction type\" for this report (S2-R1) but \"Open Balance\" in its Terminology; "
             f"which letter case is right is question {QN['open-balance-case']}." if r["fam"] == "A/R" else "")),
      design=DREF("page 6 (Descriptions and pinned column) and page 1 (Opening order and header sorting)"))

    k = nk()
    C(k, "DESIGN", f"Design: {r['n']} in dark theme looks as described",
      [ADMIN(), TWO_LOC, long_pre(code, k),
       START(code, " in dark theme at 100% zoom" + ("" if summ else ", with every group expanded (Expand all)")),
       "Reports > Finance > Sales By Customer is open in a second tab, also in dark theme, for comparison."],
      ["Look at the title row and the filter row.", "Look at the chips in their resting state.", f"Look at {link}.",
       f"Look at the \"{r['headline']}\" column and the Totals row, and compare with Sales By Customer.",
       "Press Tab until a link has keyboard focus.", "Look across the whole page for any text that overlaps, is cut off, or is hard to read on the dark background."],
      ["Step 1: the title, info icon and ⋯ on one line, the filter row below, as in light theme.",
       f"Step 2: \"{P}: All {r['parties']}\" and \"Past due: Any\" show in the resting (grey) style and are readable.",
       "Step 3: the native report link style, readable in dark theme.",
       f"Step 4: \"{r['headline']}\" pinned right and bold on the header, rows and Totals row; the Totals row has the same native style as Sales By Customer's in dark theme.",
       "Step 5: the focused link is underlined.", "Step 6: nothing overlaps, is cut off or is hard to read."],
      ["S7-R7", "S8-R3", "S8-R4", "S5-R13", "S5-R15"],
      design=DREF("page 6 (Descriptions and pinned column)"))

    k = nk()
    C(k, "DESIGN", f"Design: {r['n']} at 1536 px looks as described in both themes",
      [ADMIN(), TWO_LOC, long_pre(code, k),
       START(code, " in light theme at 100% zoom", width="1536 px")],
      ["Look at the title row and the filter row.", "Read the column headings.", "Look for a sideways scroll bar under the table.",
       f"Look at the \"{r['headline']}\" column and the Totals row.", "Look across the page for overlap or clipping.",
       "Switch ShopView to dark theme.", "Look across the page again."],
      ["Step 1: title, info icon and ⋯ on one line; the filter row below.", "Step 2: every heading on one line.", "Step 3: there is none.",
       f"Step 4: \"{r['headline']}\" pinned to the right edge and bold, the Totals row in the native style.",
       "Step 5: nothing overlaps, is cut off or clipped.", "Step 6: the page switches to dark theme.",
       "Step 7: the same layout; links readable; nothing overlaps or is clipped."],
      ["S8-R2", "S8-R3", "S8-R4", "S7-R7"],
      design=DREF("page 6 (Descriptions and pinned column)"))

# ---------------- per report: loading, empty and error states ----------------
for code in ALL6:
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "DESIGN", f"Design: {r['n']} loading, empty and error states look as described",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has open {r['doc']}s only at {{Location-B}}.", f"For example: {{{P}-A}} is {ex(k, 'States')[0]}."),
       ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START(code), SBC2],
      ["Change the as-of date to yesterday and watch the table straight away.",
       "Change the as-of date back to today.", "In the Location menu, untick {Location-B}.", f"In the {P} filter, tick {{{P}-A}}.",
       "Read the empty state, letter for letter, and compare it with Sales By Customer's empty state.",
       "Click \"Clear all filters\".", "Switch the network connection off and change the as-of date to yesterday.",
       "Read the table area and the message, then switch the network back on."],
      ["Step 1: the native table progress bar shows while the report loads.",
       "Step 2: the report shows today again.", "Step 3: the report narrows to {Location-A}.",
       f"Step 4: the report has no rows: {{{P}-A}} has nothing open at {{Location-A}}.",
       "Step 5: \"No record matches these filters\" and \"Try changing filters to widen your results.\", with a \"Clear all filters\" button, in the native empty-state look of Sales By Customer; no Totals row.",
       "Step 6: the filters return to their defaults and rows show.",
       "Step 7: the report fails to load.",
       "Step 8: \"Something went wrong loading this report. Please try again.\" in place of the rows, and the standard error message as well."],
      ["S8-R5", "S8-R6", "UFS-9", "UFS-10"],
      design=DREF("page 6 (Descriptions and pinned column)"))

# ---------------- grouped reports: chevrons, tooltip, pinned group row ----------------
for code in GROUPED:
    r = R[code]; k = nk(); g = "bucket" if r["group"] == "aging bucket" else f"{r['party']} group"
    C(k, "DESIGN", f"Design: {r['n']} chevrons and pinned group row look as described",
      [ADMIN(), (f"The report has open documents in several {g}s on today's date, one with more lines than fit on the screen.", None),
       START(code, " in light theme at 100% zoom, with every group collapsed")],
      ["Look at the table's top-left header cell.", f"Look at each {g} row's own chevron.", "Hover over the top-left chevron button.",
       "Click it, then hover over it again.", f"Scroll down through the tallest {g}.", "Switch ShopView to dark theme.", "Hover over the top-left chevron button."],
      ["Step 1: one chevron button, the design system's chevron icon, in the top-left header cell, pointing right (every group collapsed).",
       f"Step 2: every {g} row shows the same chevron, pointing right when closed.",
       "Step 3: a tooltip above the button reads \"Expand all\", letter for letter.",
       f"Step 4: every {g} opens, its chevron points down, and the tooltip above the button reads \"Collapse all\".",
       f"Step 5: the {g}'s row stays pinned just under the column headings, with its label visible at the left.",
       "Step 6: the page switches to dark theme; the pinned row is readable.", "Step 7: the tooltip sits above the button and is readable in dark theme."],
      ["S4-R1", "S4-R5", "S4-R6", "UFS-5", "KD-REUSE"],
      design=DREF("page 3 (Collapse all and pinned group rows)"))

# ---------------- menus, one per family ----------------
for fam, code in (("A/R", "ARD"), ("A/P", "APU")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Location chip and menu match Sales By Customer's",
      [ADMIN(), TWO_LOC, START(code, " in light theme at 100% zoom"), SBC2],
      ["Look at the Location chip and compare with Sales By Customer's.", "Click it and read the menu, row by row, letter for letter.",
       "Compare the open menu with Sales By Customer's open Location menu.", "Switch to dark theme and open the menu again."],
      ["Step 1: label \"Location\" with the location pin icon, the same chip as Sales By Customer's.",
       "Step 2: in this order: \"Select all\", the count (\"2 selected\"), the locations with the ticked ones first, and \"Clear selection\"; no search box (fewer than 9 locations).",
       "Step 3: the same menu: same rows, order, tick boxes, spacing and position under the chip.",
       "Step 4: the same, readable in dark theme, nothing clipped."],
      ["S5-R2", "KD-REUSE"], design=DREF("page 4 (Location filter and Location column)"))

k = nk()
C(k, "DESIGN", "Design: A/R Customer chip and menu match Sales By Customer's",
  [ADMIN(), ("Customer {Customer-A} has open invoices on today's date and a long name (more than 40 characters).", f"For example: {{Customer-A}} is {ex(k, 'Northern Alberta Heavy Equipment and Trailer Repair')[0]}."),
   START("ARC", " in light theme at 100% zoom"), SBC2],
  ["Look at the Customer chip and compare with Sales By Customer's.", "Click it and read the menu, row by row, letter for letter.",
   "Tick {Customer-A} and look at the chip.", "Compare the open menu with Sales By Customer's open Customer menu."],
  ["Step 1: \"Customer: All customers\" with the person icon, in the resting (grey) style, as on Sales By Customer.",
   "Step 2: in this order: a search box, \"All customers\", the line \"All customers are included. Pick one or more to narrow.\", then the customers.",
   "Step 3: the chip shows the name shortened with \"...\" and leaves the resting style.",
   "Step 4: the same menu: rows, order, tick boxes, spacing and position."],
  ["S5-R13", "KD-REUSE"], design=DREF("page 7 (Filters and call list)"))

k = nk()
C(k, "DESIGN", "Design: A/P Vendor chip and menu match Inventory Value's",
  [ADMIN(), ("Vendor {Vendor-A} has unpaid bills on today's date.", f"For example: {{Vendor-A}} is {ex(k, 'Truck Icon')[0]}."),
   START("APD", " in light theme at 100% zoom"), "Reports > Inventory > Inventory Value is open in a second tab of the same window, for comparison."],
  ["Look at the Vendor chip and compare with Inventory Value's Vendor chip.", "Click it and read the menu, row by row, letter for letter.",
   "Compare the open menu with Inventory Value's open Vendor menu."],
  ["Step 1: \"Vendor: All vendors\" with the truck icon, in the resting (grey) style, as on Inventory Value.",
   "Step 2: in this order: a search box with the placeholder \"Search vendors\", \"All vendors\", the line \"All vendors are included. Pick one or more to narrow.\", then the vendors.",
   "Step 3: the same menu: rows, order, tick boxes, spacing and position."],
  ["S5-R13", "KD-REUSE"], design=DREF("page 7 (Filters and call list)"))

for fam, code in (("A/R", "ARS"), ("A/P", "APD")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Past due chip and menu look as described",
      [ADMIN(), START(code, " in light theme at 100% zoom")],
      ["Look at the Past due chip.", "Click it and read the menu, row by row, letter for letter.", "Compare the menu with the Location menu next to it.",
       "Tick \"91+ days\" and look at the chip."],
      ["Step 1: \"Past due: Any\" with an hourglass icon, in the resting (grey) style.",
       "Step 2: in this order: \"Any\", the line \"All ranges are included. Pick one or more to narrow.\", \"1-30 days\", \"31-60 days\", \"61-90 days\", \"91+ days\".",
       "Step 3: the same native checkbox dropdown as Customer and Location: same tick boxes, spacing and position.",
       "Step 4: \"Past due: 91+ days\", no longer in the resting style."],
      ["S5-R15", "KD-REUSE"], design=DREF("page 7 (Filters and call list)"))

for fam, code in (("A/R", "ARC"), ("A/P", "APS")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Export menu matches the native report Export menu",
      [ADMIN(), START(code, " in light theme at 100% zoom"), SBC2],
      ["Hover over the ⋯ button at the right of the title row.", "Click it and read the menu, letter for letter.", "Compare with Sales By Customer's ⋯ menu."],
      ["Step 1: the ⋯ button is at the right of the title row and is labelled \"Export report\".",
       "Step 2: \"Download (PDF)\", then \"Download (CSV)\".", "Step 3: the same button, menu, order and position."],
      ["S3-R1", "KD-REUSE"], design=DREF("page 2 (Export)"))

# ---------------- messages (toasts), dialog, tooltips ----------------
k = nk()
C(k, "DESIGN", "Design: the export Success and Empty export messages look native",
  [ADMIN(), TWO_LOC, START("ARS", " in light theme at 100% zoom"), SBC2],
  ["Download the CSV from the ⋯ menu and read the message, letter for letter.", "Compare it with the message Sales By Customer shows after a CSV download.",
   "Clear the Location selection, download the PDF and read the message.", "Compare it with Sales By Customer's warning for an empty export."],
  ["Step 1: \"Success\", \"Data exported successfully.\"", "Step 2: the same success message, look and position.",
   "Step 3: \"Empty export\", \"Export didn't yield any results\"; nothing downloads.", "Step 4: the same native warning look and position."],
  ["UFS-6", "UFS-7", "S3-R10"], design=DREF("page 2 (Export)"))

k = nk()
C(k, "DESIGN", "Design: the export error messages look like the other reports' errors",
  [ADMIN(), ("The organization has more than 2,000 open A/P lines.", "For example: the QA organization (13,540)."),
   ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START("APD", " in light theme at 100% zoom")],
  ["Download the PDF from the ⋯ menu and read the message, letter for letter.", "Look at its style and position.",
   "Switch the network connection off.", "Choose \"Download (CSV)\" from the ⋯ menu and read the message, letter for letter.", "Switch the network back on."],
  ["Step 1: \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\"",
   "Step 2: an error toast, as on the other reports, and only one.",
   "Step 3: the computer is offline.", "Step 4: \"We couldn't export this report. Please try again.\", an error toast, only one.", "Step 5: the connection is back."],
  ["UFS-1", "UFS-8", "S3-N1", "EH"], design=DREF("page 2 (Export)"))

for kind, code, word in (("work order", "ARD", "This work order is in"), ("part sale", "ARC", "This part sale is in")):
    k = nk()
    C(k, "DESIGN", f"Design: the switch-location dialog for a {kind} looks as described",
      [ADMIN(), TWO_LOC, (f"Customer {{Customer-A}} has an open {kind} invoice {{Invoice-A}} made at {{Location-B}}.", f"For example: {{Customer-A}} is {ex(k, 'Dialog')[0]}."),
       START(code, " in light theme at 100% zoom, with {Customer-A} ticked and its rows showing")],
      ["Click {Invoice-A}'s number.", "Read the dialog's title, message and buttons, letter for letter, in order.",
       "Compare the dialog with the one a work order link from another location shows today.", "Click \"Cancel\".", "Switch ShopView to dark theme.", "Click {Invoice-A}'s number again."],
      ["Step 1: a dialog opens over the report.",
       f"Step 2: title \"Switch location?\", message \"{word} \" then {{Location-B}}'s name and \"Switch your active location to view it?\", then the buttons \"Switch location\" and \"Cancel\".",
       "Step 3: it is the existing location-switch prompt: same look, buttons and position.", "Step 4: the dialog closes.", "Step 5: the page switches to dark theme.",
       "Step 6: the dialog opens again and is readable in dark theme."],
      ["S7-R3", "UFS-3" if kind == "work order" else "UFS-4", "KD-REUSE"], design=DREF("page 5 (Document links and Switch location)"))

for fam, code in (("A/R", "ARD"), ("A/P", "APS")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} info icon and tooltip match Work In Progress",
      [ADMIN(), START(code, " in light theme at 100% zoom"), "Reports > Work In Progress is open in a second tab of the same window, for comparison."],
      ["Look at the info icon and compare with Work In Progress's.", "Hover over it and look at the tooltip's position and style.",
       "Compare with Work In Progress's tooltip.", "Switch to dark theme and hover again."],
      ["Step 1: the same native report info icon, directly right of the title.",
       "Step 2: the description shows in a tooltip.",
       "Step 3: the same tooltip look.", "Step 4: readable in dark theme."],
      ["S8-R1", "KD-REUSE"], design=DREF("page 6 (Descriptions and pinned column)"))

k = nk()
C(k, "DESIGN", "Design: A/R Collection call list on the customer row looks as described",
  [ADMIN(), ("Customer {Customer-A} has an overdue invoice, a phone number and a credit term; customer {Customer-B} has an overdue invoice and no phone.",
             f"For example: {{Customer-A}} is {ex(k, 'Phone Row')[0]} with phone (403) 555-0103 and credit term Net 30; {{Customer-B}} is {ex(k, 'No Phone Row')[0]}."),
   START("ARC", " in light theme at 100% zoom")],
  ["Read {Customer-A}'s group row, letter for letter.", "Read {Customer-B}'s group row.", "Look for overlap or clipping on both rows, in light and dark theme."],
  ["Step 1: the name, then \"Phone: \" and the number, then \"Credit term: \" and the term, on the group row after the name.",
   "Step 2: the name and \"Credit term: COD\" (if none set); no \"Phone:\" label.",
   "Step 3: nothing overlaps or is clipped, in either theme."],
  ["S9-R1", "S9-R2", "S9-N1"], design=DREF("page 7 (Filters and call list)"))

# ---------------- the PDF ----------------
for code in ("ARS", "APS"):
    r = R[code]; k = nk()
    C(k, "DESIGN", f"Design: {r['n']} PDF heading 91 And Over stays on one line",
      [ADMIN(), (f"The report has {r['parties']} with amounts in every bucket on today's date.", None), START(code)],
      ["Download the PDF from the ⋯ menu and open it at 100%.", "Read the bucket headings, letter for letter.", "Look at the last bucket heading."],
      ["Step 1: the PDF opens.", "Step 2: \"Current\", \"1-30 Days\", \"31-60 Days\", \"61-90 Days\", \"91 And Over\", as on screen.",
       "Step 3: \"91 And Over\" is on one line, not wrapped."],
      ["S3-R7"], design=DREF("page 2 (Export)"))

k = nk()
C(k, "DESIGN", "Design: A/R Collection PDF prints the call list on each customer's line",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A} has an overdue invoice, a phone number and a credit term.", f"For example: {{Customer-A}} is {ex(k, 'PDF Phone')[0]}."),
   START("ARC", ", with only {Customer-A} ticked")],
  ["Download the PDF from the ⋯ menu and open it at 100%.", "Read the lines under the title.", "Read {Customer-A}'s line."],
  ["Step 1: the PDF opens.", "Step 2: \"As of \" and the date, then \"Locations: All locations\", then \"Customer: \" and the name.",
   "Step 3: the name, \"Phone: \" and the number, \"Credit term: \" and the term, on the customer's line; nothing overlaps."],
  ["S9-R3", "S3-R4", "S3-R5"], design=DREF("page 2 (Export) and page 7 (Filters and call list)"))

# ---------------- narrower windows ----------------
for fam, code in (("A/R", "ARD"), ("A/P", "APD")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Detail narrower than 1440 px scrolls under the pinned column",
      [ADMIN(), TWO_LOC, START(code, ", with every bucket expanded", width="1280 px")],
      ["Look at the right edge of the table.", "Scroll the table sideways to the right.", "Look at the bucket labels and the title row."],
      [f"Step 1: \"{R[code]['headline']}\" is pinned to the right edge and the table has a sideways scroll.",
       f"Step 2: the other columns slide under the pinned \"{R[code]['headline']}\" column; nothing overlaps.",
       "Step 3: the bucket labels stay visible at the left; the title row stays on one line."],
      ["S8-R3", "S4-R7"], design=DREF("page 6 (Descriptions and pinned column)"))

k = nk()
C(k, "DESIGN", "Design: narrower than 1024 px the reports show the mobile filter row",
  [ADMIN(), START("ARS", width="900 px")],
  ["Look at the filter row.", "Look at the table.", "Open A/P Unpaid Invoices at the same width and look again."],
  ["Step 1: the native mobile filter row shows instead of the desktop chips.", "Step 2: the table scrolls sideways; nothing else is laid out for small screens.",
   "Step 3: the same: the mobile filter row and a table that scrolls sideways."],
  ["OOS-9", "FORM"], reports=["ARS", "APU"], design=DREF("page 6 (Descriptions and pinned column)"))
