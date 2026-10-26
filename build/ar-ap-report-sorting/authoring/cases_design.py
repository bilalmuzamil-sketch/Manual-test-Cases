"""Design — how it looks (Rules 126, 130, 133; lessons L-01 to L-05).
D-01 to D-49 (written 22 Oct 2026 from the PRD's own look sentences, before the design could be read) compare with the native reports the
PRD names; on the full pass of 22 Oct 2026 each was re-checked against the design canvas and now carries its pictures (FIGS_FOR).
D-50 to D-75: one "matches the design picture" case for every screen and state the design draws ("This build (after)" and "New in this
build" pictures), compared at 1440 px (light, and dark where the design shows dark), and at 1536 px for overlap.
D-76 to D-81: the design's version of every design-vs-PRD difference (Rule 130 item 5), held until Chris Ward ruled (23 Oct 2026). 26 Oct 2026:
D-76 to D-80 lost (answers 11 to 15) and were deleted from TestRail with the QA lead's go-ahead; D-81 won (answer 4, PRD v9 S2-R4a) and is now a
normal design case.
The production ("before") pictures are today's look: the release-day cases use them, no design case aims at them (Rule 115: the named
target only)."""
from ar_lib import C, ALL6, GROUPED, DESIGN_URL, CASES, DESIGN_HOLD
import design_data as DD
from common import *
from po_questions import QN
import tech_plan as TP
VEND8 = ("The organization has more than 8 vendors (the Vendor menu shows its search box only when there are more than 8 vendors).", "For example: the QA organization (437 vendors).")

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"D-{ORDER['n']:02d}"
def DREF(pages):
    """22 Oct 2026: the design was read; the pictures for each case are set by key at the end of this file (FIGS_FOR)."""
    return {}
CAPL = ("Where the build is expected to differ: Chris Ward (answer 11, 23 Oct 2026) says the current build writes the button \"Switch Location\" with a "
        "capital L, a build bug to fix; the PRD's \"Switch location\" stands. No ticket number is known yet. If the button reads \"Switch Location\", mark this test Failed.")
SBC2 = "Reports > Finance > Sales By Customer is open in a second tab of the same window, for comparison."
WIP2 = "Reports > Work In Progress is open in a second tab of the same window, so its links can be compared."   # 26 Oct 2026 read-through

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
    # Rule 136 (22 Oct 2026): the 10-step look case became three: the layout keeps the C-id; the pinned headline column and the Totals
    # row ("b") and the link style ("c") are their own cases. All three read the same screen and records and change nothing.
    k = nk()
    LOOKPRE = [ADMIN(), TWO_LOC, long_pre(code, k),
               START(code, " in light theme at 100% zoom" + ("" if summ else ", with every group expanded (Expand all)"))]
    CASE_NOTE = ""   # 26 Oct 2026: question 4 answered (Title Case on all six reports, PRD v9 S2-R4a); the A/R letter-case note is gone
    C(k, "DESIGN", f"Design: {r['n']} at 1440 px in light theme shows every column",
      LOOKPRE + [SBC2],
      ["Look at the title row.",
       "Look at where the filter row sits, and compare with Sales By Customer.",
       "Read the column headings left to right, letter for letter, capitals included.",
       "Look for a sideways scroll bar under the table.",
       (f"Look at {{{P}-A}}'s name cell and at the money cells." if summ else f"Look at {{{P}-A}}'s rows: the name and Transaction Type cells, and the money, date and number cells."),
       "Look across the whole page for any text that overlaps, is cut off or is clipped."],
      ["Step 1: the title, its info icon directly right of it, and the ⋯ Export button at the right end, all on one line.",
       "Step 2: the filter row sits below the title row, in the same place as on Sales By Customer.",
       f"Step 3: {headings(code)} (\"Location\" shown because two locations are in view; it sits right after "
       + ("the name" if summ else "\"Date\"") + "). No heading wraps.",
       "Step 4: there is none: every column is visible at 1440 px without scrolling sideways.",
       "Step 5: " + ("the long name wraps" if summ else "the long name and a long Transaction Type wrap") + " onto a second line; money, date and number cells stay on one line"
       + (", and Location wraps only on this report (nine columns)." if code == "APD" else ", and Location does not wrap."),
       "Step 6: nothing overlaps, is cut off or clipped."],
      ["S8-R2", "S8-R3", f"S2-R1 {code}", "S2-R4a", "S6-R3", "KD-REUSE"],
      note=("The first column keeps today's heading: only the Location column is renamed in this release." if summ else CASE_NOTE),
      design=DREF("page 6 (Descriptions and pinned column) and page 1 (Opening order and header sorting)"))
    C(k + "b", "DESIGN", f"Design: {r['n']} {r['headline']} and Totals row match Sales By Customer",
      LOOKPRE + [SBC2],
      [f"Look at the \"{r['headline']}\" column on the header, the rows and the Totals row, and compare with Sales By Customer.",
       "Compare the Totals row with Sales By Customer's Totals row."],
      [f"Step 1: \"{r['headline']}\" is pinned to the right edge and bold on the header, every row" + ("" if summ else ", every expanded row") + " and the Totals row, as on Sales By Customer.",
       "Step 2: side by side, the Totals row looks the same as Sales By Customer's Totals row: the same background colour, text size and weight."],
      ["S8-R3", "S8-R4", "KD-REUSE"], note=CASE_NOTE,
      design=DREF("page 6 (Descriptions and pinned column)"))
    C(k + "c", "DESIGN", f"Design: {r['n']} links are blue, semi-bold and not underlined",
      LOOKPRE + [WIP2],
      [f"Look at {link} and compare them with the links on Work In Progress.", "Press Tab until a link has keyboard focus."],
      ["Step 1: they are blue, the same blue as the links on Work In Progress, semi-bold and not underlined.",
       "Step 2: the focused link is underlined; links are underlined only on keyboard focus."],
      ["S7-R7"],
      design=DREF("page 5 (Document links and Switch location)"))

    k = nk()
    C(k, "DESIGN", f"Design: {r['n']} in dark theme: chips, links and Totals row readable",
      [ADMIN(), TWO_LOC, long_pre(code, k),
       START(code, " in dark theme at 100% zoom" + ("" if summ else ", with every group expanded (Expand all)")),
       "Reports > Finance > Sales By Customer is open in a second tab, also in dark theme, for comparison."],
      ["Look at the title row and the filter row.", "Look at the chips in their resting state.", f"Look at {link}.",
       f"Look at the \"{r['headline']}\" column and the Totals row, and compare with Sales By Customer.",
       "Press Tab until a link has keyboard focus.", "Look across the whole page for any text that overlaps, is cut off, or is hard to read on the dark background."],
      ["Step 1: the title, info icon and ⋯ on one line, the filter row below, as in light theme.",
       f"Step 2: \"{P}: All {r['parties']}\" and \"Past due: Any\" show in the resting (grey) style and are readable.",
       "Step 3: they are blue, semi-bold and not underlined, and readable on the dark background.",
       f"Step 4: \"{r['headline']}\" pinned right and bold on the header, rows and Totals row; side by side, the Totals row looks the same as Sales By Customer's in dark theme: the same background colour, text size and weight.",
       "Step 5: the focused link is underlined.", "Step 6: nothing overlaps, is cut off or is hard to read."],
      ["S7-R7", "S8-R3", "S8-R4", "S5-R13", "S5-R15"],
      design=DREF("page 6 (Descriptions and pinned column)"))

    k = nk()
    C(k, "DESIGN", f"Design: {r['n']} at 1536 px: no overlap or clipping, light and dark",
      [ADMIN(), TWO_LOC, long_pre(code, k),
       START(code, " in light theme at 100% zoom", width="1536 px"), SBC2],
      ["Look at the title row and the filter row.", "Read the column headings.", "Look for a sideways scroll bar under the table.",
       f"Look at the \"{r['headline']}\" column and the Totals row, and compare the Totals row with Sales By Customer's.", "Look across the page for overlap or clipping.",
       "Switch ShopView to dark theme."],
      ["Step 1: title, info icon and ⋯ on one line; the filter row below.", "Step 2: every heading on one line.", "Step 3: there is none.",
       f"Step 4: \"{r['headline']}\" pinned to the right edge and bold; side by side, the Totals row looks the same as Sales By Customer's: the same background colour, text size and weight.",
       "Step 5: nothing overlaps, is cut off or clipped.",
       "Step 6: the page switches to dark theme with the same layout; links readable; nothing overlaps or is clipped."],
      ["S8-R2", "S8-R3", "S8-R4", "S7-R7"],
      design=DREF("page 6 (Descriptions and pinned column)"))

# ---------------- per report: loading, empty and error states ----------------
# Rule 136 (22 Oct 2026): the load error (S8-R6) is its own case ("b"); the loading bar and the empty state (S8-R5) keep the C-id.
for code in ALL6:
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "DESIGN", f"Design: {r['n']} loading bar and empty state match Sales By Customer",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has open {r['doc']}s only at {{Location-B}}.", f"For example: {{{P}-A}} is {ex(k, 'States')[0]}."),
       START(code), SBC2],
      ["Change the as-of date to yesterday and watch the table straight away.",
       "Change the as-of date back to today.", "In the Location menu, untick {Location-B}.", f"In the {P} filter, tick {{{P}-A}}.",
       "Read the empty state, letter for letter, and compare it with Sales By Customer's empty state.",
       "Click \"Clear all filters\"."],
      ["Step 1: a progress bar shows on the table while the report loads, the same loading bar Sales By Customer shows.",
       "Step 2: the report shows today again.", "Step 3: the report narrows to {Location-A}.",
       f"Step 4: the report has no rows: {{{P}-A}} has nothing open at {{Location-A}}.",
       "Step 5: \"No record matches these filters\" and \"Try changing filters to widen your results.\", with a \"Clear all filters\" button, laid out the same as Sales By Customer's empty state when the two tabs are compared; no Totals row.",
       "Step 6: the filters return to their defaults and rows show."],
      ["S8-R5", "UFS-9"],
      design=DREF("page 6 (Descriptions and pinned column)"))
    C(k + "b", "DESIGN", f"Design: {r['n']} load error message shows in place of the rows",
      [ADMIN(), ("The report has open documents on today's date.", None),
       ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START(code)],
      ["Switch the network connection off.", "Change the as-of date to yesterday.", "Switch the network back on."],
      ["Step 1: the computer is offline.",
       "Step 2: the report fails to load: \"Something went wrong loading this report. Please try again.\" shows in place of the rows, and the standard error message as well.",
       "Step 3: the connection is back."],
      ["S8-R6", "UFS-10"],
      design=DREF("page 6 (Descriptions and pinned column)"))

# ---------------- grouped reports: chevrons, tooltip, pinned group row ----------------
for code in GROUPED:
    r = R[code]; k = nk(); g = "bucket" if r["group"] == "aging bucket" else f"{r['party']} group"
    C(k, "DESIGN", f"Design: {r['n']} chevron button, tooltips and pinned group row",
      [ADMIN(), (f"The report has open documents in several {g}s on today's date, one with more lines than fit on the screen.", None),
       START(code, " in light theme at 100% zoom, with every group collapsed")],
      ["Look at the table's top-left header cell.", f"Look at each {g} row's own chevron.", "Hover over the top-left chevron button.",
       "Click it.", "Hover over it again.", f"Scroll down through the tallest {g}.", "Switch ShopView to dark theme.", "Hover over the top-left chevron button."],
      ["Step 1: one chevron button, the design system's chevron icon, in the top-left header cell, pointing right (every group collapsed).",
       f"Step 2: every {g} row shows the same chevron, pointing right when closed.",
       "Step 3: a tooltip above the button reads \"Expand all\", letter for letter.",
       f"Step 4: every {g} opens and its chevron points down.",
       "Step 5: the tooltip above the button reads \"Collapse all\".",
       f"Step 6: the {g}'s row stays pinned just under the column headings, with its label visible at the left.",
       "Step 7: the page switches to dark theme; the pinned row is readable.", "Step 8: the tooltip sits above the button and is readable in dark theme."],
      ["S4-R1", "S4-R5", "S4-R6", "UFS-5", "KD-REUSE"],
      design=DREF("page 3 (Collapse all and pinned group rows)"))

# ---------------- menus, one per family ----------------
for fam, code in (("A/R", "ARD"), ("A/P", "APU")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Location chip and menu match Sales By Customer's",
      [ADMIN(), TWO_LOC, START(code, " in light theme at 100% zoom"), SBC2],
      ["Look at the Location chip and compare with Sales By Customer's.", "Click it and read the menu, row by row, letter for letter.",
       "Compare the open menu with Sales By Customer's open Location menu.", "Switch ShopView to dark theme.", "Click the Location chip again."],
      ["Step 1: label \"Location\" with the location pin icon, the same chip as Sales By Customer's.",
       "Step 2: in this order: \"Select all\", the count (\"2 selected\"), the locations with the ticked ones first, and \"Clear selection\"; no search box (fewer than 9 locations).",
       "Step 3: the same menu: same rows, order, tick boxes, spacing and position under the chip.",
       "Step 4: the page switches to dark theme.",
       "Step 5: the menu opens: the same, readable in dark theme, nothing clipped."],
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
  [ADMIN(), ("Vendor {Vendor-A} has unpaid bills on today's date.", f"For example: {{Vendor-A}} is {ex(k, 'Truck Icon')[0]}."), VEND8,
   START("APD", " in light theme at 100% zoom"), "Reports > Inventory > Inventory Value is open in a second tab of the same window, for comparison."],
  ["Look at the Vendor chip and compare with Inventory Value's Vendor chip.", "Click it and read the menu, row by row, letter for letter.",
   "Compare the open menu with Inventory Value's open Vendor menu."],
  ["Step 1: \"Vendor: All vendors\" with the truck icon, in the resting (grey) style, as on Inventory Value.",
   "Step 2: in this order: a search box with the placeholder \"Search vendors\", \"All vendors\", the line \"All vendors are included. Pick one or more to narrow.\", then the vendors.",
   "Step 3: the same menu: rows, order, tick boxes, spacing and position."],
  ["S5-R13", "KD-REUSE"], design=DREF("page 7 (Filters and call list)"))

for fam, code in (("A/R", "ARS"), ("A/P", "APD")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Past due chip and its tick-box menu",
      [ADMIN(), START(code, " in light theme at 100% zoom")],
      ["Look at the Past due chip.", "Click it and read the menu, row by row, letter for letter.", "Tick \"91+ days\".",
       "Click the Location chip next to it and compare its menu with the Past due menu."],
      ["Step 1: \"Past due: Any\" with an hourglass icon, in the resting (grey) style.",
       "Step 2: in this order: \"Any\", the line \"All ranges are included. Pick one or more to narrow.\", \"1-30 days\", \"31-60 days\", \"61-90 days\", \"91+ days\".",
       "Step 3: the chip reads \"Past due: 91+ days\", no longer in the resting style.",
       "Step 4: the Location menu opens; the Past due menu is the same kind of tick-box menu as the Location menu: the same tick boxes, spacing and position under its chip."],
      ["S5-R15", "KD-REUSE"], design=DREF("page 7 (Filters and call list)"))

for fam, code in (("A/R", "ARC"), ("A/P", "APS")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Export menu matches Sales By Customer's ⋯ menu",
      [ADMIN(), START(code, " in light theme at 100% zoom"), SBC2],
      ["Hover over the ⋯ button at the right of the title row.", "Click it and read the menu, letter for letter.", "Compare with Sales By Customer's ⋯ menu."],
      ["Step 1: the ⋯ button is at the right of the title row and is labelled \"Export report\".",
       "Step 2: \"Download (PDF)\", then \"Download (CSV)\".", "Step 3: the same button, menu, order and position."],
      ["S3-R1", "KD-REUSE"], design=DREF("page 2 (Export)"))

# ---------------- messages (toasts), dialog, tooltips ----------------
k = nk()
C(k, "DESIGN", "Design: export Success and Empty export messages match Sales By Customer",
  [ADMIN(), TWO_LOC, START("ARS", " in light theme at 100% zoom"), SBC2],
  ["Download the CSV from the ⋯ menu and read the message, letter for letter.", "Compare it with the message Sales By Customer shows after a CSV download.",
   "In the Location menu, click \"Clear selection\".", "Download the PDF from the ⋯ menu and read the message.", "Compare it with Sales By Customer's warning for an empty export."],
  ["Step 1: \"Success\", \"Data exported successfully.\"", "Step 2: the same success message, look and position.",
   "Step 3: no location is ticked.",
   "Step 4: \"Empty export\", \"Export didn't yield any results\"; nothing downloads.", "Step 5: the warning looks the same and appears in the same place as Sales By Customer's empty-export warning."],
  ["UFS-6", "UFS-7", "S3-R10"], design=DREF("page 2 (Export)"))

k = nk()
C(k, "DESIGN", "Design: the export error messages look like the other reports' errors",
  [ADMIN(), ("The organization has more than 2,000 open A/P lines.", "For example: the QA organization (13,540)."),
   ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START("APD", " in light theme at 100% zoom")],
  ["Choose \"Download (PDF)\" from the ⋯ menu and read the message, letter for letter.",
   "Switch the network connection off.", "Choose \"Download (CSV)\" from the ⋯ menu and read the message, letter for letter.", "Switch the network back on."],
  ["Step 1: \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\", in an error toast styled and placed as on the other reports, and only one.",
   "Step 2: the computer is offline.", "Step 3: \"We couldn't export this report. Please try again.\", an error toast, only one.", "Step 4: the connection is back."],
  ["UFS-1", "UFS-8", "S3-N1", "EH"], design=DREF("page 2 (Export)"))

for kind, code, word in (("work order", "ARD", "This work order is in"), ("part sale", "ARC", "This part sale is in")):
    k = nk()
    C(k, "DESIGN", f"Design: the Switch location? dialog for a {kind} at another location",
      [ADMIN(), TWO_LOC, (f"Customer {{Customer-A}} has an open {kind} invoice {{Invoice-A}} made at {{Location-B}}.", f"For example: {{Customer-A}} is {ex(k, 'Dialog')[0]}."),
       START(code, " in light theme at 100% zoom, with {Customer-A} ticked and its rows showing"),
       "A link to a work order made at {Location-B}, copied from the address bar, is open in a second tab, so the existing location-switch prompt shows there for comparison."],
      ["Click {Invoice-A}'s number.",
       "Compare the dialog with the location-switch prompt open in the second tab.", "On the report's tab, click \"Cancel\".", "Switch ShopView to dark theme.", "Click {Invoice-A}'s number again."],
      [f"Step 1: a dialog opens over the report; read letter for letter, in order: title \"Switch location?\", message \"{word} \" then {{Location-B}}'s name and \"Switch your active location to view it?\", then the button \"Cancel\" on the left and the button \"Switch location\" (small l) on the right, and a close \"×\" at the top right.",
       "Step 2: it is the existing location-switch prompt: the same look, buttons and position as the prompt in the second tab.", "Step 3: the dialog closes.", "Step 4: the page switches to dark theme.",
       "Step 5: the dialog opens again and is readable in dark theme."],
      ["S7-R3", "UFS-3" if kind == "work order" else "UFS-4", "KD-REUSE"], design=DREF("page 5 (Document links and Switch location)"), note=CAPL)

for fam, code in (("A/R", "ARD"), ("A/P", "APS")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} info icon and tooltip match Work In Progress",
      [ADMIN(), START(code, " in light theme at 100% zoom"), "Reports > Work In Progress is open in a second tab of the same window, for comparison."],
      ["Look at the info icon and compare with Work In Progress's.", "Hover over it and look at the tooltip's position and style.",
       "Compare with Work In Progress's tooltip.", "Switch ShopView to dark theme.", "Hover over the info icon again."],
      ["Step 1: the same info icon as Work In Progress's, directly right of the title.",
       "Step 2: the description shows in a tooltip.",
       "Step 3: the tooltip looks the same as Work In Progress's tooltip: the same colours, text size and position next to the icon.", "Step 4: the page switches to dark theme.", "Step 5: the tooltip shows, readable in dark theme."],
      ["S8-R1", "KD-REUSE"], design=DREF("page 6 (Descriptions and pinned column)"))

k = nk()
C(k, "DESIGN", "Design: A/R Collection customer row shows Phone and Credit term",
  [ADMIN(), ("Customer {Customer-A} has an overdue invoice, a phone number and a credit term; customer {Customer-B} has an overdue invoice and no phone.",
             f"For example: {{Customer-A}} is {ex(k, 'Phone Row')[0]} with phone (403) 555-0103 and credit term Net 30; {{Customer-B}} is {ex(k, 'No Phone Row')[0]}."),
   START("ARC", " in light theme at 100% zoom")],
  ["Read {Customer-A}'s group row, letter for letter.", "Read {Customer-B}'s group row, and look for overlap or clipping on both rows.", "Switch ShopView to dark theme."],
  ["Step 1: the name, then \"Phone: \" and the number, then \"Credit term: \" and the term, on the group row after the name.",
   "Step 2: the name and \"Credit term: COD\" (if none set); no \"Phone:\" label; on both rows nothing overlaps or is clipped.",
   "Step 3: the page switches to dark theme; on both rows nothing overlaps or is clipped."],
  ["S9-R1", "S9-R2", "S9-N1"], design=DREF("page 7 (Filters and call list)"))

# ---------------- the PDF ----------------
for code in ("ARS", "APS"):
    r = R[code]; k = nk()
    C(k, "DESIGN", f"Design: {r['n']} PDF heading 91 And Over stays on one line",
      [ADMIN(), (f"The report has {r['parties']} with amounts in every bucket on today's date.", None), START(code)],
      ["Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF at 100% zoom and read the bucket headings, letter for letter."],
      ["Step 1: the PDF downloads.", "Step 2: the PDF opens; the bucket headings read \"Current\", \"1-30 Days\", \"31-60 Days\", \"61-90 Days\", \"91 And Over\", as on screen, and the last one, \"91 And Over\", is on one line, not wrapped."],
      ["S3-R7"], design=DREF("page 2 (Export)"))

k = nk()
C(k, "DESIGN", "Design: A/R Collection PDF prints the call list on each customer's line",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A} has an overdue invoice, a phone number and a credit term.", f"For example: {{Customer-A}} is {ex(k, 'PDF Phone')[0]}."),
   START("ARC", ", with only {Customer-A} ticked")],
  ["Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF at 100% zoom."],
  ["Step 1: the PDF downloads.",
   "Step 2: the PDF opens; the lines under the title read \"As of \" and the date, then \"Locations: All locations\", then \"Customer: \" and the name; {Customer-A}'s line reads the name, \"Phone: \" and the number, \"Credit term: \" and the term; nothing overlaps."],
  ["S9-R3", "S3-R4", "S3-R5"], design=DREF("page 2 (Export) and page 7 (Filters and call list)"))

# ---------------- narrower windows ----------------
for fam, code in (("A/R", "ARD"), ("A/P", "APD")):
    k = nk()
    C(k, "DESIGN", f"Design: {fam} Detail narrower than 1440 px scrolls under the pinned column",
      [ADMIN(), TWO_LOC, START(code, ", with every bucket expanded", width="1280 px")],
      ["Look at the right edge of the table.", "Scroll the table sideways to the right."],
      [f"Step 1: \"{R[code]['headline']}\" is pinned to the right edge and the table has a sideways scroll.",
       f"Step 2: the other columns slide under the pinned \"{R[code]['headline']}\" column; nothing overlaps; the bucket labels stay visible at the left; the title row stays on one line."],
      ["S8-R3", "S4-R7"], design=DREF("page 6 (Descriptions and pinned column)"))

k = nk()
C(k, "DESIGN", "Design: narrower than 1024 px the reports show the mobile filter row",
  [ADMIN(), START("ARS", width="900 px")],
  ["Look at the filter row.", "Look at the table.", "Open A/P Unpaid Invoices at the same width and look again."],
  ["Step 1: the mobile filter row shows instead of the four desktop chips.", "Step 2: the table scrolls sideways; nothing else is laid out for small screens.",
   "Step 3: the same: the mobile filter row and a table that scrolls sideways."],
  ["OOS-9", "FORM"], reports=["ARS", "APU"], design=DREF("page 6 (Descriptions and pinned column)"))

# =====================================================================================================================================
# Full pass against the design canvas, 22 Oct 2026 (Rules 120, 122, 126, 130, 133)
# =====================================================================================================================================
def PICS(*iids, boards=None):
    """The precondition naming the design picture(s) the tester compares with (attached to the case)."""
    boards = boards or {}
    names = [f'"{DD.fig(i, boards.get(i))["heading"]}" ({DD.pic(DD.fig(i, boards.get(i)))})' for i in iids]
    return ("The design picture" + ("s " if len(names) > 1 else " ") + " and ".join(names)
            + (" are" if len(names) > 1 else " is") + " attached to this case and open beside the browser at 100% zoom; compare the layout, labels and styles, not the names and amounts, which are only examples.")
W1536 = ("Widen the browser window to 1536 px and look across the page.", "nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.")
DATA_SUM = ("The report lists customers at both locations on today's date, including at least one with a credit balance (a negative Total) and one with a long name.",
            "For example: the QA organization's A/R Summary (46 customers).")

def P(key, title, pre, steps, res, q, figs, boards=None, reports=None, marker=None, note=""):
    C(key, "DESIGN", title, pre, steps, [f"Step {i}: {r}" for i, r in enumerate(res, 1)], q, reports=reports,
      design=dict(figs=figs, boards=boards or {}), marker=marker, note=note)

k = nk()  # D-50
P(k, "Design: A/R Summary opening screen matches the design picture",
  [ADMIN(), TWO_LOC, DATA_SUM, START("ARS", " in light theme at 100% zoom"), PICS("I03")],
  ["Compare the title row with the picture.", "Compare the filter row with the picture, chip by chip.",
   "Compare the column headings with the picture, left to right, letter for letter.", "Compare the customer name cells and the money cells with the picture.",
   "Scroll the table down a little and look at the Totals row.", "Look at how the table sits on the page.", W1536[0]],
  ["the title \"A/R Aging Summary\", a grey circled \"i\" info icon directly right of it, and a grey \"⋯\" button at the far right, all on one line, as in the picture.",
   "four chips in this order: \"As of: \" and the date in a blue pill with a calendar icon and a down arrow; \"Customer: All customers\" with a person icon and no fill (resting); \"Past due: Any\" with an hourglass icon and no fill (resting); \"Location: All locations\" with a location pin icon in a blue pill.",
   "\"Customer\" with a small up arrow (the sorted column), \"Location\", \"Current\", \"1-30 Days\", \"31-60 Days\", \"61-90 Days\", \"91 And Over\", \"Total\", in bold, each on one line; only \"Customer\" carries an arrow.",
   "customer names are blue and in A to Z order, a name starting \"10\" before one starting \"2\"; money is right-aligned, an empty bucket is blank, a credit shows the minus after the dollar sign (for example \"$-100.00\"), as today, and the Total column is bold on every row.",
   "the bold Totals row stays at the bottom of the table while the rows scroll under it, as in the picture.",
   "the table runs across the page with no card or frame around it, rows divided by thin lines, as in the picture.", W1536[1]],
  ["S8-R2", "S5-R1", "S5-R13", "S5-R15", "S1-R1", "S1-R2", "S1-R7", "S6-R3", "S8-R3", "S8-R4", "WC-10", "KD-REUSE"], ["I03", "I08"], reports=["ARS"])

k = nk()  # D-51
P(k, "Design: A/R Summary sorted by Total matches the design picture",
  [ADMIN(), TWO_LOC, DATA_SUM, START("ARS", " in light theme at 100% zoom"), PICS("I04")],
  ["Click the \"Total\" header.", "Click the \"Total\" header again."],
  ["the rows re-sort, largest Total first, as in the picture: \"Total\" now carries a small down arrow and \"Customer\" none; no other heading changes; the largest Total is at the top; the Totals row reads the same as before the click: sorting moves rows, not the totals.",
   "the order reverses, smallest Total first, and \"Total\" is still the marked column."],
  ["S2-R2", "S2-R3", "S1-R7", "S5-R18"], ["I04"], reports=["ARS"])

k = nk()  # D-52
P(k, "Design: A/P Detail with every bucket closed matches the design picture",
  [ADMIN(), TWO_LOC, ("The report has open bills in all five aging buckets on today's date.", None), START("APD", " in light theme at 100% zoom, with every bucket collapsed"), PICS("I05")],
  ["Compare the title row and the filter row with the picture.", "Compare the header row with the picture, left to right.",
   "Compare the bucket rows with the picture, top to bottom.", "Compare the Totals row with the picture.", W1536[0]],
  ["the title \"A/P Aging Detail\" with the info icon and the \"⋯\" at the right; chips \"As of: \" (blue pill), \"Vendor: All vendors\" with a truck icon (resting), \"Past due: Any\" with an hourglass icon (resting), \"Location: All locations\" (blue pill).",
   "a grey chevron pointing right in the top-left header cell, then \"Date\", \"Location\", \"Transaction Type\", \"No.\", \"Vendor Name\" with a small up arrow, \"Due Date\", \"Past Due\", \"Amount\", \"Open Balance\".",
   "five buckets in this order, each with a blue chevron pointing right, its name in bold with its count in brackets, \"Total\" under Past Due and two bold sums: \"91 or more days past due\", \"61-90 days past due\", \"31-60 days past due\", \"1-30 days past due\", \"Current\".",
   "\"Totals\" with the Amount and Open Balance sums, in bold.", W1536[1]],
  ["S1-R5", "S1-R7", "S4-R1", "S4-R5", "S5-R1", "S2-R1 APD"], ["I05"], reports=["APD"])

k = nk()  # D-53
P(k, "Design: the Export menu matches the design picture",
  [ADMIN(), START("ARS", " in light theme at 100% zoom"), PICS("I09")],
  ["Click the ⋯ button at the right of the title row."],
  ["the menu opens, as in the picture: while the menu is open the ⋯ button shows a light-grey square; the white menu with a shadow opens under it, its right edge lined up with the button, over the right end of the column headings; its rows read, letter for letter, \"Download (PDF)\" then \"Download (CSV)\", and nothing else."],
  ["S3-R1", "KD-REUSE"], ["I09"], reports=["ARS"])

k = nk()  # D-54
P(k, "Design: A/P Summary title row and ⋯ button match the design picture",
  [ADMIN(), TWO_LOC, ("The report lists vendors at both locations on today's date, one of them with documents at both.", None), START("APS", " in light theme at 100% zoom"), PICS("I10")],
  ["Compare the title row with the picture.", "Compare the filter row with the picture.", "Compare the column headings with the picture.",
   "Compare the vendor name cells and the Location cells with the picture.", W1536[0]],
  ["the title \"A/P Aging Summary\", the info icon right of it and the grey \"⋯\" at the far right; no print icon.",
   "\"As of: \" (blue pill), \"Vendor: All vendors\" (truck icon, resting), \"Past due: Any\" (hourglass icon, resting), \"Location: All locations\" (blue pill).",
   "\"Vendor\" with a small up arrow, \"Location\", \"Current\", \"1-30 Days\", \"31-60 Days\", \"61-90 Days\", \"91 And Over\", \"Total\".",
   "vendor names are blue, A to Z; a Location cell reads a location's name, or \"Multiple\" for a vendor with documents at both; Total is bold.", W1536[1]],
  ["S3-R1", "S1-R1", "S6-R4", "S5-R1", "OOS-7"], ["I10"], reports=["APS"])

k = nk()  # D-55
P(k, "Design: the PDF-too-large message matches the design picture",
  [ADMIN(), ("The organization has more than 2,000 open A/P lines on today's date.", "For example: the QA organization (13,540 open A/P lines)."),
   START("APD", " in light theme at 100% zoom, with every bucket collapsed"), PICS("I11")],
  ["Choose \"Download (PDF)\" from the ⋯ menu.", "Click \"Close\" on the message."],
  ["one message appears at the bottom right of the window and nothing downloads: as in the picture, a solid red box with a white warning triangle at the left, white text, and a white \"Close\" at the right, with no title line; the report behind it does not change; the message reads, letter for letter, \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\"",
   "the message closes."],
  ["S3-N1", "S3-N3", "UFS-1"], ["I11"], reports=["APD"])

k = nk()  # D-56
P(k, "Design: A/R Collection after Expand all matches the design picture",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A}, first in name order, has an overdue invoice, an unused credit memo, a phone number and a credit term.", f"For example: {{Customer-A}} is {ex(k, '10 Trucking')[0]}."),
   START("ARC", " in light theme at 100% zoom, with every group collapsed"), PICS("I14")],
  ["Click the chevron button in the table's top-left header cell.",
   "Scroll down a little and look at the Totals row.", W1536[0]],
  ["every customer group opens and the header chevron points down; compared with the picture: the header row shows the chevron, then the columns in the picture's order, letter for letter: \"Date\" (with a small up arrow), \"Location\", \"Transaction Type\", \"ID\", \"Due Date\", \"Past Due\", \"Amount\", \"Open Balance\"; {Customer-A}'s group row shows a blue chevron pointing down, the name in bold with its count in brackets, then in grey \"Phone: \" and the number and \"Credit term: \" and the term, on one line; each of its document rows shows the date, location, transaction type, number (a blue link for the invoice, plain text for the credit memo), due date, days past due, amount, and the open balance in bold; the subtotal row under the group reads \"Total for \" and the customer's name, with the Amount and Open Balance sums in bold.",
   "the bold Totals row stays at the bottom of the table while the rows scroll under it.", W1536[1]],
  ["S4-R1", "S4-R5", "S9-R1", "S9-R2", "S8-R3", "S1-R7", "S7-R10", "S2-R1 ARC"], ["I14"], reports=["ARC"])

k = nk()  # D-57
P(k, "Design: the pinned customer row matches the design picture",
  [ADMIN(), ("Customers {Customer-A} and {Customer-B} are next to each other in name order, and each has more overdue invoices than fit on the screen.",
             f"For example: {{Customer-A}} is {ex(k, 'Apollo Beach')[0]} and {{Customer-B}} is {ex(k, 'Bancescu')[0]}, 25 overdue invoices each."),
   START("ARC", " in light theme at 100% zoom, with every group expanded"), PICS("I15")],
  ["Scroll down slowly into {Customer-A}'s rows.",
   "Keep scrolling until {Customer-B}'s group row reaches the top.", W1536[0]],
  ["{Customer-A}'s group row stays just under the column headings while its rows slide beneath it; as in the picture, the pinned row shows the blue chevron, the bold name and count and the grey Phone and Credit term, over the rows sliding beneath it.",
   "{Customer-B}'s row pushes {Customer-A}'s up and off and takes its place; only one group row is pinned at a time.", W1536[1]],
  ["S4-R6", "S9-R1"], ["I15"], reports=["ARC"])

k = nk()  # D-58
P(k, "Design: A/P Unpaid Invoices pinned vendor row matches the design pictures",
  [ADMIN(), ("Vendor {Vendor-A} has more unpaid bills than fit on the screen at your location, a long name, and an unused vendor credit {Vendor-credit-A} from a vendor return made at your location.",
             f"For example: {{Vendor-A}} is {ex(k, 'Akal')[0]} Mobile Truck Repair."),
   START("APU", " in light theme at 100% zoom, with every group expanded"), PICS("I16", "I43")],
  ["Compare the title row with the pictures.", "Scroll down into {Vendor-A}'s rows.",
   "Hover over {Vendor-credit-A}'s number.", W1536[0]],
  ["the title reads \"A/P Unpaid Invoices Report\" with the info icon; the chips are those of the other A/P reports.",
   "{Vendor-A}'s group row stays pinned under the column headings; compared with the pictures, the vendor name wraps onto a second line; {Vendor-credit-A}'s Due Date and Past Due cells hold no date and no number (a dash, \"—\"); bill numbers and {Vendor-credit-A}'s number are blue links; Open Balance is bold.",
   "the row turns light grey and the number is a link, as in the second picture.", W1536[1]],
  ["S4-R6", "S2-R6", "S7-R9", "S7-R6", "S8-R3"], ["I16", "I43"], reports=["APU"])

k = nk()  # D-59
P(k, "Design: A/R Collection with groups closed matches the pictures in both themes",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("At least ten customers have overdue invoices on today's date, each with a phone number and a credit term.", None),
   START("ARC", " in light theme at 100% zoom, with every group collapsed"), PICS("I19", "I21")],
  ["Compare the title row and the filter row with the light picture.", "Look at the chevron in the table's top-left header cell.",
   "Compare the customer group rows with the light picture.", "Compare the Totals row with the light picture.", "Switch ShopView to dark theme.",
   W1536[0]],
  ["the title \"A/R Aging Collection\", the info icon directly right of it and the \"⋯\" at the right end, all on one line; the filter row below.",
   "it points right: every group is closed.",
   "each group row: a blue chevron pointing right, the bold name with its count, grey \"Phone: \" and the number and \"Credit term: \" and the term, \"Total\" under Past due and the two bold sums.",
   "\"Totals\" with the two bold sums at the bottom.",
   "the page switches to dark theme, as in the dark picture: dark page and white text; the \"As of\" and \"Location\" chips are dark-blue pills with white text; \"Customer\" and \"Past due\" are white text with no fill; Phone and Credit term grey; everything readable.",
   W1536[1]],
  ["S8-R1", "S8-R2", "S9-R1", "S9-R2", "S4-R1", "S4-R5", "S7-R7"], ["I19", "I21"], reports=["ARC"])

k = nk()  # D-60
P(k, "Design: the description tooltip matches the pictures in both themes",
  [ADMIN(), START("ARC", " in light theme at 100% zoom"), PICS("I20", "I22")],
  ["Hover over the info icon right of the title.",
   "Move the pointer away.", "Switch ShopView to dark theme.", "Hover over the info icon again."],
  ["a tooltip opens; as in the light picture, the icon turns blue and the tooltip is a dark-grey box with white text on four lines, opening below the icon and starting near it, over the left of the filter row; it reads, letter for letter, \"Overdue invoices, unused credit memos and deposits for each customer to help you follow up on payments. Excludes invoices that aren’t due yet.\"",
   "the tooltip closes.", "the page switches to dark theme.",
   "the tooltip opens in dark theme, as in the dark picture: a mid-grey box with white text, in the same place and with the same words; readable."],
  ["S8-R1", "S8-R1 ARC"], ["I20", "I22"], reports=["ARC"])

k = nk()  # D-61
P(k, "Design: A/P Detail with a bucket open matches the pictures in both themes",
  [ADMIN(), TWO_LOC, ("The \"91 or more days past due\" bucket has more lines than fit on the screen on today's date.", "For example: the QA organization (11,334 lines in that bucket)."),
   START("APD", " in light theme at 100% zoom, with \"91 or more days past due\" expanded"), PICS("I23", "I24")],
  ["Scroll down a little inside the bucket.", "Switch ShopView to dark theme.", W1536[0]],
  ["the bucket row \"91 or more days past due\" stays pinned under the column headings, and the bold Totals row sits at the bottom while the rows scroll under it. Compared with the light picture: all nine columns show at 1440 px: the chevron, \"Date\", \"Location\", \"Transaction Type\", \"No.\", \"Vendor Name\" with a small up arrow, \"Due Date\", \"Past Due\", \"Amount\", \"Open Balance\", each heading on one line; Location wraps onto two lines (for example \"Staging Heavy\" / \"Duty - 9919\"); dates, numbers and money stay on one line; document numbers are blue links; Open Balance is bold on every row.",
   "the page switches to dark theme, as in the dark picture: the links are blue and readable on the dark page; Open Balance and the Totals row bold and white.", W1536[1]],
  ["S8-R3", "S8-R4", "S4-R6", "S7-R7", "S2-R1 APD"], ["I23", "I24"], reports=["APD"])

k = nk()  # D-62
P(k, "Design: A/P Unpaid Invoices at 1440 px shows every column, as pictured",
  [ADMIN(), TWO_LOC, ("Vendor {Vendor-A} has an unpaid bill at {Location-B}; vendor {Vendor-B} has unpaid bills at {Location-A}; both have long names.",
                      f"For example: {{Vendor-A}} is {ex(k, 'Abadi Diesel Repair')[0]} and {{Vendor-B}} is {ex(k, 'Adams Diesel Repair')[0]}."),
   START("APU", " in light theme at 100% zoom, with every group expanded"), PICS("I25")],
  ["Look for a sideways scroll bar under the table.", "Read the column headings.", "Compare {Vendor-A}'s bill row with the picture.",
   "Compare {Vendor-B}'s rows with the picture.", "Compare the group rows and the subtotal rows with the picture.", W1536[0]],
  ["there is none: every column fits at 1440 px.",
   "the chevron, \"Date\" with a small up arrow, \"Location\", \"Transaction Type\", \"No.\", \"Vendor Name\" (no arrow), \"Due Date\", \"Past Due\", \"Amount\", \"Open Balance\", none wrapping.",
   "its number is plain text (a bill at another location) and the vendor name wraps onto a second line.", "their numbers are blue links.",
   "each group row: a blue chevron, the bold name and count; under each group \"Total for \" and the vendor's name with bold sums.", W1536[1]],
  ["S8-R3", "S7-R6", "S7-R1", "S2-N1"], ["I25"], reports=["APU"])

k = nk()  # D-63
P(k, "Design: A/R Detail links and plain numbers match the design picture",
  [ADMIN(), TWO_LOC,
   ("Customer {Customer-A} has an open invoice made at {Location-B}, customer {Customer-B} an unused credit memo at {Location-A}, and customer {Customer-C} an open invoice at {Location-A}, all more than 90 days past due.",
    f"For example: {{Customer-A}} is {ex(k, 'Oakland City')[0]}, {{Customer-B}} is {ex(k, 'Sledge')[0]} and {{Customer-C}} is {ex(k, 'Wellington')[0]}."),
   START("ARD", " in light theme at 100% zoom, with the \"91 or more days past due\" bucket expanded"), PICS("I28")],
  ["Compare the header row with the picture.", "Look at {Customer-A}'s invoice number, {Customer-B}'s credit memo number and {Customer-C}'s invoice number.",
   "Compare the subtotal row at the end of the bucket with the picture.", W1536[0]],
  ["the chevron, then the columns in the picture's order, letter for letter: \"Date\", \"Location\", \"Transaction Type\", \"ID\", \"Customer Full Name\" (with a small up arrow), \"Due Date\", \"Amount\", \"Open Balance\"; this report has no Past Due column.",
   "{Customer-A}'s is a blue link (another location you work at); {Customer-B}'s is plain dark text, not blue; {Customer-C}'s is a blue link.",
   "\"Total for 91 or more days past due\" with the Amount and Open Balance sums in bold.", W1536[1]],
  ["S7-R1", "S7-R3", "S7-R10", "S2-R1 ARD", "S1-R5"], ["I28"], reports=["ARD"])

k = nk()  # D-64
P(k, "Design: the switch-location dialog frame matches the design pictures",
  [ADMIN(), TWO_LOC, ("Customer {Customer-A} has an open work order invoice {Invoice-A} made at {Location-B}.", f"For example: {{Customer-A}} is {ex(k, 'Dialog Frame')[0]}."),
   START("ARD", " in light theme at 100% zoom, with {Customer-A} ticked and every bucket expanded"), PICS("I29", "I30")],
  ["Click {Invoice-A}'s number.", "Click \"Cancel\"."],
  ["the dialog opens over the report: as in the first picture, a white dialog in the middle of the window, with the report dimmed behind it; read letter for letter: the bold title \"Switch location?\", then \"This work order is in \", {Location-B}'s name and \"Switch your active location to view it?\"; then \"Cancel\" on the left and \"Switch location\" (small l) on the right, and a close \"×\" at the top right, as in the picture except that the picture writes \"Switch Location\" with a capital L (the PRD's small l is right: see References from Design).",
   "the dialog closes, and the report is exactly as before the click, as in the second picture: the same filters, open bucket, sort and scroll position."],
  ["S7-R3", "S7-R5", "UFS-3"], ["I29", "I30"], reports=["ARD"], note=CAPL)

k = nk()  # D-65
P(k, "Design: A/R Detail opens on All locations as in the design picture",
  [ADMIN(), TWO_LOC, START("ARD", " in light theme at 100% zoom, with the first bucket expanded"), PICS("I32")],
  ["Compare the filter row with the picture.", "Compare the column headings with the picture.", "Read the Location cells.", "Compare the Totals row with the picture.", W1536[0]],
  ["\"As of: \" (blue pill), \"Customer: All customers\" (resting), \"Past due: Any\" (resting), and \"Location: All locations\" in a blue pill with the pin icon.",
   "a column labelled \"Location\" right after \"Date\".", "each row's Location reads its location's name, exactly as the location switcher names it.",
   "the bold Totals row at the bottom.", W1536[1]],
  ["S5-R1", "S5-R5", "S6-R1", "S6-R2", "S6-R3", "S5-R4"], ["I32"], reports=["ARD"])

k = nk()  # D-66
P(k, "Design: the Location menu with two locations matches the design picture",
  [ADMIN(), TWO_LOC, START("ARD", " in light theme at 100% zoom"), PICS("I33")],
  ["Click the Location chip.", W1536[0]],
  ["the menu opens under the chip; as in the picture, while the menu is open the chip shows a circled \"×\" in place of its down arrow; the menu rows read, top to bottom, \"Select all\" with \"2 selected\" at its right, {Location-A}, {Location-B}, a dividing line, then \"Clear selection\"; no search box; the ticked boxes have a light-blue fill with a blue tick.", W1536[1]],
  ["S5-R2", "S5-R5", "S5-R4"], ["I33"], reports=["ARD"])

k = nk()  # D-67
P(k, "Design: one location ticked hides the Location column as pictured",
  [ADMIN(), TWO_LOC, START("ARD", " in light theme at 100% zoom, with every bucket collapsed"), PICS("I34")],
  ["Click the Location chip.", "Untick {Location-A}.", "Close the menu."],
  ["the menu opens.",
   "the count reads \"1 selected\" and \"Select all\" is no longer ticked; as in the picture, while the menu stays open the rows do not move: {Location-A}, now unticked, stays where it was; the chip reads \"Location: \" and {Location-B}'s name, shortened with \"...\" when long (\"Location: Staging Lethbri...\" in the picture), still in a blue pill.",
   "the menu closes, and as in the picture the Location column is gone: the header row reads the chevron, then \"Date\", \"Transaction Type\", \"ID\", \"Customer Full Name\", \"Due Date\", \"Amount\", \"Open Balance\"."],
  ["S5-R6", "S6-R2", "S6-N1", "S5-R2"], ["I34"], reports=["ARD"])

k = nk()  # D-68
P(k, "Design: No locations shows the empty state as in the design picture",
  [ADMIN(), TWO_LOC, START("ARD", " in light theme at 100% zoom"), PICS("I35")],
  ["In the Location menu, click \"Clear selection\".", "Close the menu.", W1536[0]],
  ["no location is ticked.",
   "the menu closes. As in the picture: the chip reads \"Location: No locations\" with the pin icon and no blue fill, still in the filter row; the table area shows the column headings without a Location column, then the empty state in the middle under a grey circle with a magnifier; no rows and no Totals row (the picture also draws a Totals row of $0.00; Chris Ward ruled there is none and the picture will be corrected: see References from Design); the empty state reads, letter for letter, \"No record matches these filters\", \"Try changing filters to widen your results.\" and an outlined \"Clear all filters\" button.", W1536[1]],
  ["S5-R6a", "S5-R6", "S5-R9", "S8-R5"], ["I35"], reports=["ARD"])

k = nk()  # D-69
P(k, "Design: A/R Summary sorted by Location matches the design picture",
  [ADMIN(), TWO_LOC, ("Customer {Customer-A} has open invoices at both locations on today's date.", f"For example: {{Customer-A}} is {ex(k, 'Monroe')[0]}."),
   START("ARS", " in light theme at 100% zoom"), PICS("I36")],
  ["Click the \"Location\" header.", W1536[0]],
  ["the rows sort by Location, A to Z, as in the picture: \"Location\" carries the small up arrow and \"Customer\" none; the rows reading \"Multiple\" come first, {Customer-A} among them, then each location's rows.", W1536[1]],
  ["S6-R4", "S6-R5", "S2-R2"], ["I36"], reports=["ARS"])

k = nk()  # D-70
P(k, "Design: clicking a customer on A/R Summary matches the drill-down picture",
  [ADMIN(), ('Your role has the "Customers → View" permission and the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A} had open invoices on {Date-A}.", f"For example: {{Customer-A}} is {ex(k, 'Drill Picture')[0]}; {{Date-A}} is the last day of last month."),
   START("ARS", " in light theme at 100% zoom, with the as-of date set to {Date-A}"), PICS("I37")],
  ["Click {Customer-A}'s name."],
  ["A/R Collection opens (title \"A/R Aging Collection\"). As in the picture: the filter row reads \"As of: \" and {Date-A} in a blue pill; \"Customer: \" and {Customer-A}'s name in a blue pill (one customer ticked); \"Past due: Any\" resting; \"Location: All locations\"; one closed group row for {Customer-A} with its count, Phone and Credit term, \"Total\" and the sums; the Totals row equals that group's sums."],
  ["S5-R11", "S5-R13", "S5-R18", "KD-DRILL"], ["I37"], reports=["ARS", "ARC"])

k = nk()  # D-71
P(k, "Design: the Past due menu matches the design picture",
  [ADMIN(), START("ARS", " in light theme at 100% zoom"), PICS("I38")],
  ["Click the Past due chip.", W1536[0]],
  ["the menu opens, as in the picture: while the menu is open the chip has a light-grey background; the white menu opens under it; its rows read, top to bottom, \"Any\" (ticked), a dividing line, the grey line \"All ranges are included. Pick one or more to narrow.\", then \"1-30 days\", \"31-60 days\", \"61-90 days\", \"91+ days\"; each range box shows a grey dash (neither empty nor ticked) while \"Any\" is ticked.", W1536[1]],
  ["S5-R15", "KD-REUSE"], ["I38"], reports=["ARS"])

k = nk()  # D-72
P(k, "Design: Past due with two ranges ticked matches the design picture",
  [ADMIN(), TWO_LOC, ("Customers have open invoices in every Past due range on today's date.", None), START("ARS", " in light theme at 100% zoom"), PICS("I39")],
  ["In the Past due filter, tick \"31-60 days\" and \"91+ days\".", "Close the menu."],
  ["both ranges are ticked.",
   "the menu closes. As in the picture: the chip reads \"Past due: 2 ranges\" in a blue pill with the hourglass icon; only customers with an amount 31 to 60 or more than 90 days past due are listed, each with its full balance in every column; the Totals row adds up exactly the rows listed."],
  ["S5-R15", "S5-R17", "S5-R18"], ["I39"], reports=["ARS"])

k = nk()  # D-73
P(k, "Design: the Vendor menu matches the design picture",
  [ADMIN(), VEND8, START("APS", " in light theme at 100% zoom"), "Reports > Inventory > Inventory Value is open in a second tab of the same window, for comparison.", PICS("I40")],
  ["Click the Vendor chip.",
   "Compare the order of the vendors with Inventory Value's Vendor menu."],
  ["the menu opens, as in the picture: while the menu is open the chip (\"Vendor: All vendors\", truck icon) has a light-grey background; the menu opens under it; its rows read, top to bottom, a search box with a magnifier and the placeholder \"Search vendors\", \"All vendors\" (ticked), a dividing line, the grey line \"All vendors are included. Pick one or more to narrow.\", then the vendors (the picture's placeholder reads \"Search vendor\"; the PRD's \"Search vendors\" is right: see References from Design); each vendor box shows a grey dash while \"All vendors\" is ticked.",
   "the same order as Inventory Value's Vendor menu."],
  ["S5-R13", "KD-REUSE"], ["I40"], reports=["APS"])

k = nk()  # D-74
P(k, "Design: two customers ticked look as in the design picture",
  [ADMIN(), ("Customer {Customer-A} has open invoices on today's date; customer {Customer-B} has nothing open.",
             f"For example: {{Customer-A}} is {ex(k, '10 Trucking')[0]} and {{Customer-B}} is {ex(k, '4 Star Truck Repair')[0]}."),
   START("ARS", " in light theme at 100% zoom"), PICS("I41")],
  ["Click the Customer chip.", "Tick {Customer-A} and {Customer-B}.", "Close the menu."],
  ["the menu opens.",
   "both are ticked. As in the picture: both names show as blue tags, each with an \"×\", inside the search box, and a circled \"×\" sits at the box's top right; \"All customers\" is unticked with \"2 selected\" at its right; the helper line is gone; the ticked customers keep their place in the A to Z list; the chip reads \"Customer: 2 customers\" in a blue pill.",
   "the menu closes. As in the picture: one row, {Customer-A} ({Customer-B} has nothing open, so it is not listed); the Totals row equals {Customer-A}'s row, an empty bucket reading $0.00 in the Totals row."],
  ["S5-R13", "S5-R18", "S1-E1"], ["I41"], reports=["ARS"])

k = nk()  # D-75
P(k, "Design: the call list for one customer matches the design picture",
  [ADMIN(), ('Your role has the "View and Manage AP/AR Data" switch on.', None),
   ("Customer {Customer-A} has a long name, an overdue invoice, a phone number and a credit term.", f"For example: {{Customer-A}} is {ex(k, 'Andrews Truck and Trailer Repair LLC')[0]}."),
   START("ARC", " in light theme at 100% zoom"), PICS("I42")],
  ["In the Customer filter, tick {Customer-A}."],
  ["only {Customer-A}'s group is listed. As in the picture: the chip reads \"Customer: \" and {Customer-A}'s name, shortened with \"...\", in a blue pill; a closed group row: a chevron pointing right, the bold name and count, grey \"Phone: \" and the number, grey \"Credit term: \" and the term, \"Total\" and the sums; the Totals row equals the group's sums."],
  ["S9-R1", "S9-R2", "S5-R13", "S5-R18"], ["I42"], reports=["ARC"])

# ---------------- held design-version cases (Rule 130 item 5) ----------------
# 26 Oct 2026: Chris Ward ruled on every difference (23 Oct 2026). D-76 (C715558), D-77 (C715559), D-78 (C715560), D-79 (C715561) and D-80
# (C715562) were the design versions that lost (answers 11 to 15; PRD v9) and were deleted from TestRail with the QA lead's go-ahead
# (v9-pass-2026-10-26/deleted/); their keys are not reused. D-81 (C715563) won (answer 4, PRD v9 S2-R4a) and is released as a normal design case.
ORDER["n"] = 80
k = nk()  # D-81
P(k, "Design: A/R Detail and Collection headings are in Title Case",
  [ADMIN(), TWO_LOC, START("ARD", " in light theme at 100% zoom"), PICS("I28", "I14")],
  ["Read the column headings, letter for letter, capitals included.", "Open A/R Collection from the Reports menu.",
   "Read its column headings, letter for letter, capitals included."],
  ["\"Date\", \"Location\", \"Transaction Type\", \"ID\", \"Customer Full Name\", \"Due Date\", \"Amount\", \"Open Balance\": every word starts with a capital letter, as in the picture and as on the A/P reports.",
   "A/R Collection opens.",
   "\"Date\", \"Location\", \"Transaction Type\", \"ID\", \"Due Date\", \"Past Due\", \"Amount\", \"Open Balance\", as in the picture."],
  ["S2-R4a", "S2-R1 ARD", "S2-R1 ARC", "WC-11", "OOS-3"], ["I28", "I14"], reports=["ARD", "ARC"])

# ---------------- the pictures for D-01 to D-49 (re-checked against the design on 22 Oct 2026) ----------------
FIGS_FOR = {
 "D-01": ["I03", "I04"], "D-02": ["I21"], "D-03": ["I03"], "D-04": ["I32", "I28"], "D-05": ["I24", "I21"], "D-06": ["I32"],
 "D-07": ["I14", "I19"], "D-08": ["I21", "I22"], "D-09": ["I19"], "D-10": ["I10"], "D-11": ["I24"], "D-12": ["I10"],
 "D-13": ["I23", "I05"], "D-14": ["I24", "I18"], "D-15": ["I23"], "D-16": ["I25", "I16"], "D-17": ["I24"], "D-18": ["I25"],
 "D-19": ["I35"], "D-20": ["I35"], "D-21": ["I35"], "D-22": ["I35"], "D-23": ["I35"], "D-24": ["I35"],
 "D-25": ["I32", "I28"], "D-26": ["I19", "I14", "I15"], "D-27": ["I05", "I23"], "D-28": ["I16", "I25"],
 "D-29": ["I33", "I34", "I32"], "D-30": ["I33", "I34"], "D-31": ["I41", "I37", "I42"], "D-32": ["I40"], "D-33": ["I38", "I39"], "D-34": ["I38", "I39"],
 "D-35": ["I09"], "D-36": ["I10", "I09"], "D-37": [], "D-38": ["I11"], "D-39": ["I29", "I30"], "D-40": ["I29"], "D-41": ["I19", "I20"],
 "D-42": ["I20", "I22"], "D-43": ["I14", "I19", "I42"], "D-44": [], "D-45": [], "D-46": [], "D-47": ["I23"], "D-48": ["I23", "I24"], "D-49": [],
}
WHY = {
 "D-02": "The design pictures dark theme on A/R Collection only; compare this report's dark look with it and with Sales By Customer.",
 "D-05": "The design pictures dark theme on A/P Detail and A/R Collection; compare this report's dark look with them.",
 "D-08": "Compare with the dark pictures of A/R Collection.", "D-11": "The design pictures dark theme on A/P Detail; compare with it.",
 "D-14": "Compare with the dark picture of A/P Detail.", "D-17": "The design pictures dark theme on A/P Detail; compare with it.",
 "D-03": "The design pictures 1440 px only; at 1536 px compare the same elements and check for overlap.",
 "D-06": "The design pictures 1440 px only; at 1536 px compare the same elements and check for overlap.",
 "D-09": "The design pictures 1440 px only.", "D-12": "The design pictures 1440 px only.", "D-15": "The design pictures 1440 px only.",
 "D-18": "The design pictures 1440 px only.",
 "D-19": "The design pictures one empty state (No locations on A/R Detail); the loading bar and the load error are not drawn.",
 "D-20": "The design pictures one empty state (No locations on A/R Detail); the loading bar and the load error are not drawn.",
 "D-21": "The design pictures one empty state (No locations on A/R Detail); the loading bar and the load error are not drawn.",
 "D-22": "The design pictures one empty state (No locations on A/R Detail); the loading bar and the load error are not drawn.",
 "D-23": "The design pictures one empty state (No locations on A/R Detail); the loading bar and the load error are not drawn.",
 "D-24": "The design pictures one empty state (No locations on A/R Detail); the loading bar and the load error are not drawn.",
 "D-25": "The design shows the chevrons on A/R Detail but no picture of the Collapse all / Expand all tooltip.",
 "D-26": "The design shows the chevrons and the pinned row; the Collapse all / Expand all tooltip is not drawn.",
 "D-27": "The design shows the chevrons and the pinned bucket row; the tooltip is not drawn.",
 "D-28": "The design shows the chevrons and the pinned vendor row; the tooltip is not drawn.",
 "D-37": "The design draws neither the Success message nor the Empty export warning (all 7 boards checked); the case compares with Sales By Customer, as the PRD says.",
 "D-40": "The design draws the work order version of the dialog only; the part sale message is not pictured.",
 "D-44": "The design pictures no PDF or CSV file (all 7 boards checked); the case follows the PRD.",
 "D-45": "The design pictures no PDF or CSV file (all 7 boards checked); the case follows the PRD.",
 "D-46": "The design pictures no PDF or CSV file (all 7 boards checked); the case follows the PRD.",
 "D-47": "The design pictures 1440 px only (all columns fit); narrower windows are not drawn. The picture shows the pinned, bold Open Balance.",
 "D-48": "The design pictures 1440 px only (all columns fit); narrower windows are not drawn. The pictures show the pinned, bold Open Balance.",
 "D-49": "The design draws no phone or tablet layout (all 7 boards checked); the case follows the PRD's Out of Scope line.",
}
EXTRA_DIFFS = {k_: ["DD-03"] for k_ in ("D-19", "D-20", "D-21", "D-22", "D-23", "D-24")}
# Rule 136 (22 Oct 2026): D-01, D-04, D-07, D-10, D-13 and D-16 were split; parts "b" and "c" compare with the same pictures.
for k_ in ("D-01", "D-04", "D-07", "D-10", "D-13", "D-16"):
    FIGS_FOR[k_ + "b"] = FIGS_FOR[k_]; FIGS_FOR[k_ + "c"] = FIGS_FOR[k_]
# Rule 136 (22 Oct 2026): D-19 to D-24 were split; the empty state keeps its picture, the load error ("b") has none to compare with.
for k_ in ("D-19", "D-20", "D-21", "D-22", "D-23", "D-24"):
    WHY[k_] = "The design pictures one empty state (No locations on A/R Detail); the loading bar is not drawn."
    FIGS_FOR[k_ + "b"] = []
    WHY[k_ + "b"] = "The design draws no load error (all 7 boards checked); the case follows the PRD."
for c in CASES:
    if c["key"] in FIGS_FOR:
        c["design"] = dict(figs=FIGS_FOR[c["key"]], why=WHY.get(c["key"]), diffs=EXTRA_DIFFS.get(c["key"], []))
