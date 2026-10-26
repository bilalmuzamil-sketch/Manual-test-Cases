"""Story 3 — Export to PDF and CSV (S3-R1 to S3-R10, error handling). The export limits (S3-R9, S3-N1 to S3-N3) are in cases_data.py."""
from ar_lib import C, ALL6
from common import *
from po_questions import QN
import tech_plan as TP

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"S3-{ORDER['n']:02d}"

# ---- the Export menu on each report, no Print button
# Rule 136 (22 Oct 2026): each family case (15 steps) became one case per report; the Summary keeps the family case's C-id, Detail is
# "b" and Collection / Unpaid Invoices "c". Opening the report is the starting screen; "Close the menu" was not needed.
for fam, codes in (("A/R", AR3), ("A/P", AP3)):
    k = nk()
    for code, key in zip(codes, (k, k + "b", k + "c")):
        nm = R[code]["n"]
        C(key, "S3", f"{nm} has the Export menu with PDF and CSV",
          [ADMIN(), ("The report has open documents on today's date.", None), START(code)],
          ["Look along the title row and the filter row for a Print button.",
           "Hover over the ⋯ button at the right of the title row.",
           "Click the ⋯ button."],
          ["Step 1: there is no Print button" + (" (A/R's former Print button is gone)." if fam == "A/R" else ", and no separate print button: printing is through \"Download (PDF)\"."),
           f"Step 2: {nm} shows a ⋯ button at the right of its title row, labelled \"Export report\".",
           "Step 3: the menu opens and offers \"Download (PDF)\" and \"Download (CSV)\"."],
          ["S3-R1"] + (["WC-3"] if fam == "A/R" else ["OOS-7"]), reports=[code])

# ---- PDF and CSV follow the screen: rows, order, a sort changed after an earlier export, the Location column, the Success message
for code in ALL6:
    r = R[code]; k = nk(); P = r["Party"]; grouped = r["group"] is not None
    other = "Date" if code not in ("ARS", "APS") else "name"
    othercol = namecol(code) if other == "name" else "\"Date\""
    pre = [ADMIN(), TWO_LOC,
           (f"{P}s {{{P}-A}} and {{{P}-B}} have open documents at both locations on today's date, at least two each, with different amounts.",
            f"For example: {{{P}-A}} is {ex(k, 'Export One')[0]} and {{{P}-B}} is {ex(k, 'Export Two')[0]}."),
           START(code, f", with the {P} filter showing {{{P}-A}} and {{{P}-B}} ticked" + (" and every group expanded (Expand all)" if grouped else ""))]
    steps = [f"Click the \"{r['headline']}\" header once.",
             "Choose \"Download (PDF)\" from the ⋯ menu.",
             "Open the downloaded PDF and compare its rows with the screen, top to bottom.",
             "Choose \"Download (CSV)\" from the ⋯ menu.",
             "Open the CSV in a spreadsheet program and compare its rows with the screen.",
             f"Without refreshing the page, click the {othercol} header.",
             "Choose \"Download (CSV)\" from the ⋯ menu again.",
             "Open the new CSV and compare its rows with the screen."]
    res = [f"Step 1: the rows sort by {r['headline']}, largest first.",
           "Step 2: the PDF downloads as a file and the \"Success\" message \"Data exported successfully.\" shows.",
           f"Step 3: the PDF holds exactly the rows on screen for {{{P}-A}} and {{{P}-B}}, in the same order, and has a \"Location\" column, as the screen does (two locations are in view).",
           "Step 4: the CSV downloads and the \"Success\" message \"Data exported successfully.\" shows.",
           "Step 5: the CSV holds exactly the same rows in the same order, with a \"Location\" column.",
           f"Step 6: the rows re-sort by {'name' if other == 'name' else 'Date'}.",
           "Step 7: the CSV downloads with the \"Success\" message.",
           f"Step 8: the new CSV follows the new on-screen order, by {'name' if other == 'name' else 'Date'}, not the earlier {r['headline']} order."]
    C(k, "S3", f"{r['n']}: the PDF and CSV match the rows and order on screen", pre, steps, res,
      ["S3-R2", "S3-R3", "S3-R6", "S3-R10", "UFS-6", "S6-R2"])

# ---- the lines at the top of each export
for code in ALL6:
    r = R[code]; k = nk(); P = r["Party"]; Ps = r["Parties"]
    pre = [ADMIN(), TWO_LOC,
           (f"{P}s {{{P}-A}} and {{{P}-B}} each have {r['doc']}s at {{Location-A}} that were 31 to 60 and more than 90 days past due on Oct 15, 2026.",
            f"For example: {{{P}-A}} is {ex(k, 'First Ticked')[0]} and {{{P}-B}} is {ex(k, 'Second Ticked')[0]}."),
           START(code, ", with the as-of date set to 10/15/2026 and only {Location-A} ticked in the Location filter (the Location column is hidden)")]
    steps = ["In the Past due filter, tick \"91+ days\", then \"31-60 days\".",
             f"In the {P} filter, tick {{{P}-B}}, then {{{P}-A}}.",
             "Choose \"Download (PDF)\" from the ⋯ menu.",
             "Open the PDF and read the lines under its title.",
             "Choose \"Download (CSV)\" from the ⋯ menu.",
             "Open the CSV and read the lines at the top."]
    res = ["Step 1: both ranges are ticked.",
           f"Step 2: both {r['parties']} are ticked; the chip reads \"{P}: 2 {r['parties']}\".",
           "Step 3: the PDF downloads.",
           f"Step 4: the lines read \"As of Oct 15, 2026\", then \"Locations: \" and {{Location-A}}'s name, then \"Past due: 31-60 days, 91+ days\" (menu order, not the order ticked), then \"{Ps}: \" and {{{P}-B}}, {{{P}-A}} (the order ticked). The PDF has no Location column.",
           "Step 5: the CSV downloads.",
           f"Step 6: the CSV starts with four rows of one line each, in this order: \"As of: Oct 15, 2026\", then \"Locations: \" and {{Location-A}}'s name, then \"Past due: 31-60 days, 91+ days\", then \"{Ps}: \" and {{{P}-B}}, {{{P}-A}}; the column heading row follows directly, and there is no Location column."]
    C(k, "S3", f"{r['n']}: each export states the as-of date and the filters", pre, steps, res,
      ["S3-R4", "S3-R5", "S3-R8", "S3-R6", "S6-N1", "S5-R13"])

for code in ("ARS", "APD"):
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S3", f"{r['n']}: exports say All locations and add only the lines that are set",
      [ADMIN(), TWO_LOC, (f"{P} {{{P}-A}} has open {r['doc']}s on today's date.", f"For example: {{{P}-A}} is {ex(k, 'Only One')[0]}."), START(code)],
      ["Choose \"Download (PDF)\" from the ⋯ menu.", "Read the lines under the PDF's title.",
       f"In the {P} filter, tick {{{P}-A}} only.", "Choose \"Download (CSV)\" from the ⋯ menu.", "Read the lines at the top of the CSV."],
      ["Step 1: the PDF downloads.",
       f"Step 2: under the as-of line it reads \"Locations: All locations\"; there is no \"Past due: \" line and no \"{P}: \" line.",
       f"Step 3: only {{{P}-A}} is ticked.",
       "Step 4: the CSV downloads.",
       f"Step 5: it starts with three rows of one line each: \"As of: \" and today's date, then \"Locations: All locations\", then \"{P}: \" and {{{P}-A}}'s name (one {r['party']}, so \"{P}\", not \"{r['Parties']}\"); there is no \"Past due: \" row, and the column heading row follows directly."],
      ["S3-R5", "S3-R8"])

k = nk()
C(k, "S3", "A/R Detail: exports list the ticked locations in A to Z order",
  [ADMIN(), ("The organization has open A/R documents at three locations, {Location-A}, {Location-B} and {Location-C}, and you are enrolled at all three; in A to Z order {Location-A}'s name comes before {Location-C}'s.",
             f"For example: {{Location-A}} is {LOC_A}, {{Location-B}} is {LOC_B} and {{Location-C}} is another staging location whose name starts with a later letter."),
   START("ARD", ", with no location ticked in the Location filter (\"Clear selection\" clicked)")],
  ["In the Location menu, tick {Location-C}.", "Tick {Location-A}.",
   "Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF and read the Locations line under its title.",
   "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and read the Locations line at the top."],
  ["Step 1: {Location-C} is ticked; the chip reads \"Location: \" and {Location-C}'s name.",
   "Step 2: {Location-A} is ticked as well; the chip reads \"Location: 2 locations\".",
   "Step 3: the PDF downloads.",
   "Step 4: it reads \"Locations: \" followed by {Location-A}'s name, a comma and a space, then {Location-C}'s name: the Location menu's A to Z order, not the order you ticked them; {Location-B} is not named.",
   "Step 5: the CSV downloads.", "Step 6: its Locations row reads the same: \"Locations: \", {Location-A}'s name, a comma and a space, then {Location-C}'s name."],
  ["S3-R5", "S5-R6"] + TP.q("D30-tick"),
  note=("Where the build is expected to differ: the tech plan (21 Oct 2026) says selections keep the order they were ticked, which would list {Location-C} first. "
        "PRD version 9 (S3-R5, from Chris Ward's answer 7 of 23 Oct 2026) sets the Location menu's A to Z order with a comma and a space between names; "
        "the case follows the PRD. No ticket number is known yet. If the export lists the names in tick order, mark this test Failed."))

# ---- CSV shape: Summaries (with "91 And Over")
for code in ("ARS", "APS"):
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S3", f"{r['n']}: the CSV is one flat table with plain two-decimal amounts",
      [ADMIN(),
       (f"{P} {{{P}-A}} has open {r['doc']}s on today's date of $1,250.50 that is 1 to 30 days past due and $99.00 that is more than 90 days past due, and nothing in the other buckets.",
        f"For example: {{{P}-A}} is {ex(k, 'Flat Table')[0]}."),
       START(code)],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV in a plain text editor (not a spreadsheet program).",
       "Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF and look at its last bucket heading."],
      ["Step 1: the CSV downloads.",
       f"Step 2: the file starts with the \"As of: \" row and the \"Locations: All locations\" row, then the heading row, which reads the on-screen headings letter for letter, its last bucket column headed \"91 And Over\", exactly as the screen shows it; one row for {{{P}-A}}: 1-30 Days reads 1250.50 and 91 And Over reads 99.00 (no $ sign, no thousands comma, two decimals); Current, 31-60 Days and 61-90 Days are blank cells, not 0; the Total reads 1349.50 (1250.50 + 99.00); one Totals row at the bottom, and only one; there is no group header or subtotal row: every row except the Totals row is one {r['party']}.",
       "Step 3: the PDF downloads.", "Step 4: the PDF heading reads \"91 And Over\" on one line."],
      ["S3-R7", "S3-R8", "S3-R8b"])

# ---- CSV shape: the four document reports (26 Oct 2026: PRD v9 S3-R8b names the headings, from Chris Ward's answer 8)
CSVHEAD = {"ARD": ("Aging Bucket", "Customer Full Name"), "ARC": (None, "Customer"), "APD": ("Aging Bucket", "Vendor Name"), "APU": (None, "Vendor Name")}
for code in ("ARD", "ARC", "APD", "APU"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]; Dc = d.capitalize()
    bh, ph = CSVHEAD[code]
    cols = (f"an \"{bh}\" column and a \"{ph}\" column" if bh else f"a \"{ph}\" column")
    vals = ((f"its Aging Bucket reads \"31-60 days past due\" (the bucket's name as the screen shows it) and its {ph} {{{P}-A}}'s name, each in its own column, ")
            if bh else f"{{{P}-A}}'s name is in the {ph} column, ")
    C(k, "S3", f"{r['n']}: the CSV has one row per document and no group rows",
      [ADMIN(),
       (f"{P} {{{P}-A}} has two overdue {d}s on today's date: {{{Dc}-A}}, dated {{Date-A}}, amount $1,250.50, 31 to 60 days past due, and {{{Dc}-B}}, amount $75.00, 1 to 30 days past due.",
        f"For example: {{{P}-A}} is {ex(k, 'Flat Rows')[0]}; {{Date-A}} is 2026-09-01."),
       START(code, f", with the {P} filter showing {{{P}-A}} ticked")],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV in a plain text editor."],
      ["Step 1: the CSV downloads.",
       f"Step 2: the file starts with the \"As of: \", \"Locations: All locations\" and \"{P}: \" rows, one line each; the heading row follows directly, written letter for letter as the screen's headings, with {cols}; one row for {{{Dc}-A}}: {vals}the Date reads {{Date-A}} written year-month-day (for example 2026-09-01) and the Amount reads 1250.50 (no $ sign, no thousands comma, two decimals); one row for {{{Dc}-B}}"
       + (", whose Aging Bucket reads \"1-30 days past due\"" if bh else "") + "; no group header or subtotal row; one Totals row at the bottom, whose Amount is 1325.50 (1250.50 + 75.00)."],
      ["S3-R8", "S3-R8b", "S2-R4a"])

# ---- an export with no rows
for code, how in (("ARS", "location"), ("APU", "vendor")):
    r = R[code]; k = nk(); P = r["Party"]
    if how == "location":
        pre = [ADMIN(), TWO_LOC, START(code)]
        s1 = ("Open the Location filter.", "Step 1: the Location menu opens.",
              "Click \"Clear selection\".", "Step 2: no location is ticked; the native empty state shows with \"Clear all filters\", no totals and no Location column.")
        q = ["S3-R10", "S5-R6a", "UFS-7"]
    else:
        pre = [ADMIN(), TWO_LOC, (f"Vendor {{Vendor-A}} has open bills only at {{Location-B}}.", f"For example: {{Vendor-A}} is {ex(k, 'Elsewhere')[0]}."),
               START(code, ", with only {Location-A} ticked in the Location filter")]
        s1 = (None, None, "In the Vendor filter, tick {Vendor-A}.", "Step 1: the report shows no rows: {Vendor-A} has nothing open at {Location-A}.")
        q = ["S3-R10", "UFS-7", "S5-E1"]
    lead_s = [x for x in (s1[0], s1[2]) if x]; n = len(lead_s)
    lead_r = [x for x in (s1[1], s1[3]) if x]
    C(k, "S3", f"{r['n']}: exporting an empty report downloads nothing and warns", pre,
      lead_s + ["Choose \"Download (PDF)\" from the ⋯ menu.", "Choose \"Download (CSV)\" from the ⋯ menu."],
      lead_r + [f"Step {n+1}: the warning \"Empty export\", \"Export didn't yield any results\" shows and nothing is downloaded (no new file in the browser's downloads).",
       f"Step {n+2}: the same warning shows and nothing is downloaded."], q)

# ---- an export that fails for any other reason (lost connection)
for code, kind in (("ARD", "CSV"), ("APS", "PDF")):
    r = R[code]; k = nk()
    C(k, "S3", f"{r['n']}: a {kind} export that fails shows one error and downloads nothing",
      [ADMIN(), (f"The report has open documents on today's date.", None),
       ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START(code)],
      ["Switch the computer's network connection off.", "Click the ⋯ button.", f"Click \"Download ({kind})\".",
       "Switch the network connection back on."],
      ["Step 1: the computer is offline; the report stays on screen.", "Step 2: the menu opens.",
       "Step 3: the error message \"We couldn't export this report. Please try again.\" shows: exactly one message, no second generic error, and nothing is downloaded (no new file in the browser's downloads).",
       "Step 4: the connection is back; a new export works again."],
      ["EH", "UFS-8"],
      note="The server-error half of the same sentence cannot be caused by hand; the developers' automated tests cover it. This case covers the lost connection.")

# ---- an export from a Detail report with every bucket closed (tech plan D28)
for code in ("ARD", "APD"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]
    C(k, "S3", f"{r['n']}: exporting with every bucket closed still downloads every row",
      [ADMIN(), (f"{P} {{{P}-A}} has three open {d}s on today's date, in two different aging buckets.", f"For example: {{{P}-A}} is {ex(k, 'Closed Buckets')[0]}."),
       START(code, f", with the {P} filter showing only {{{P}-A}} ticked")],
      ["Click the chevron button in the table's top-left header cell until its tooltip reads \"Expand all\" (every bucket closed).",
       "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and read its rows.",
       "Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF and read its rows."],
      ["Step 1: every bucket is closed: no document row shows on screen.",
       "Step 2: the CSV downloads with the \"Success\" message \"Data exported successfully.\"; no \"Empty export\" warning shows.",
       f"Step 3: one row for each of {{{P}-A}}'s three {d}s, then the Totals row: the same rows the report has with its buckets open.",
       "Step 4: the PDF downloads with the \"Success\" message.",
       f"Step 5: the same three {d}s and the Totals row."],
      ["S3-R3", "S3-R10"] + TP.q("D28-why", "D28"))

k = nk()
C(k, "S3", "A/R Summary: a name starting with = opens in the CSV as plain text",
  [ADMIN(), ("Customer {Customer-A} has an open invoice on today's date, and its name starts with \"=\" so that it reads like a spreadsheet formula.",
             f"For example: {{Customer-A}} is =2+3 {ex(k, 'Formula')[0]}."),
   ("A spreadsheet program is installed on the computer.", "For example: Microsoft Excel, Google Sheets or LibreOffice Calc."),
   START("ARS", ", with the Customer filter showing only {Customer-A} ticked")],
  ["Read {Customer-A}'s name on screen.", "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV in the spreadsheet program."],
  ["Step 1: the name shows as it was typed, starting with \"=\".",
   "Step 2: the CSV downloads with the \"Success\" message.",
   "Step 3: the spreadsheet opens the file, and {Customer-A}'s name cell shows the name's own characters as text (a mark may be added in front of them so the spreadsheet keeps them as text); it does not show a calculated number (such as 5) or an error (such as #NAME?)."],
  ["S3-R3"] + TP.q("CSVINJ"),
  note="Why: a name that a spreadsheet would run as a formula is a known risk in exported files; the tech plan says the CSV guards against it.")

