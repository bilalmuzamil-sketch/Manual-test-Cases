"""Story 3 — Export to PDF and CSV (S3-R1 to S3-R10, error handling). The export limits (S3-R9, S3-N1 to S3-N3) are in cases_data.py."""
from ar_lib import C, ALL6
from common import *
from po_questions import QN

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"S3-{ORDER['n']:02d}"

# ---- the Export menu on each report, no Print button
for fam, codes in (("A/R", AR3), ("A/P", AP3)):
    k = nk(); steps, res = [], []
    for code in codes:
        n0 = len(steps); nm = R[code]["n"]
        steps += [f"Open Reports > Finance > {nm} and hover over the ⋯ button at the right of the title row.",
                  "Click the ⋯ button and read the menu.",
                  "Close the menu and look along the title row and the filter row for a Print button."]
        res += [f"Step {n0+1}: {nm} shows a ⋯ button at the right of its title row, labelled \"Export report\".",
                f"Step {n0+2}: the menu offers \"Download (PDF)\" and \"Download (CSV)\".",
                f"Step {n0+3}: there is no Print button" + (" (A/R's former Print button is gone)." if fam == "A/R" else ", and no separate print button: printing is through \"Download (PDF)\".")]
    C(k, "S3", f"Each {fam} report has the Export menu with PDF and CSV",
      [ADMIN(), (f"Each of the three {fam} reports has open documents on today's date.", None),
       "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
      steps, res, ["S3-R1"] + (["WC-3"] if fam == "A/R" else ["OOS-7"]), reports=codes)

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
           START(code)]
    steps = ["Set the as-of date to 10/15/2026.",
             "In the Location filter, untick {Location-B}.",
             "In the Past due filter, tick \"91+ days\", then \"31-60 days\".",
             f"In the {P} filter, tick {{{P}-B}}, then {{{P}-A}}.",
             "Choose \"Download (PDF)\" from the ⋯ menu.",
             "Read the lines under the PDF's title.",
             "Choose \"Download (CSV)\" from the ⋯ menu.",
             "Read the lines at the top of the CSV."]
    res = ["Step 1: the date chip reads \"As of: 10/15/2026\".",
           "Step 2: only {Location-A} is ticked and the Location column disappears from the screen.",
           "Step 3: both ranges are ticked.",
           f"Step 4: both {r['parties']} are ticked; the chip reads \"{P}: 2 {r['parties']}\".",
           "Step 5: the PDF downloads.",
           f"Step 6: the lines read \"As of Oct 15, 2026\", then \"Locations: \" and {{Location-A}}'s name, then \"Past due: 31-60 days, 91+ days\" (menu order, not the order ticked), then \"{Ps}: \" and {{{P}-B}}, {{{P}-A}} (the order ticked). The PDF has no Location column.",
           "Step 7: the CSV downloads.",
           f"Step 8: the CSV reads \"As of: Oct 15, 2026\", then the same Locations, Past due and {Ps} lines, and has no Location column."]
    C(k, "S3", f"{r['n']}: each export states the as-of date and the filters", pre, steps, res,
      ["S3-R4", "S3-R5", "S3-R6", "S6-N1", "S5-R13", "S5-R1"])

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
       f"Step 5: it reads \"Locations: All locations\", then \"{P}: \" and {{{P}-A}}'s name (one {r['party']}, so \"{P}\", not \"{r['Parties']}\"); there is no \"Past due: \" line."],
      ["S3-R5"])

k = nk()
C(k, "S3", "A/R Detail: exports list every ticked location by name",
  [ADMIN(), ("The organization has open A/R documents at three locations, {Location-A}, {Location-B} and {Location-C}, and you are enrolled at all three.",
             f"For example: {{Location-A}} is {LOC_A}, {{Location-B}} is {LOC_B} and {{Location-C}} is another staging location."),
   START("ARD")],
  ["In the Location filter, untick {Location-B}.", "Choose \"Download (PDF)\" from the ⋯ menu.", "Read the Locations line under the PDF's title.",
   "Choose \"Download (CSV)\" from the ⋯ menu.", "Read the Locations line at the top of the CSV."],
  ["Step 1: {Location-A} and {Location-C} stay ticked; the chip reads \"Location: 2 locations\".", "Step 2: the PDF downloads.",
   "Step 3: it reads \"Locations: \" followed by the names of {Location-A} and {Location-C}, and not {Location-B}.",
   "Step 4: the CSV downloads.", "Step 5: the same Locations line, with both names."],
  ["S3-R5", "S5-R6"],
  note=f"The order and separator of several location names are not stated in the PRD (question {QN['export-lines']}); the case checks that both names, and only they, appear.")

# ---- CSV shape: Summaries (with "91 And Over")
for code in ("ARS", "APS"):
    r = R[code]; k = nk(); P = r["Party"]
    C(k, "S3", f"{r['n']}: the CSV is one flat table with plain two-decimal amounts",
      [ADMIN(),
       (f"{P} {{{P}-A}} has open {r['doc']}s on today's date of $1,250.50 that is 1 to 30 days past due and $99.00 that is more than 90 days past due, and nothing in the other buckets.",
        f"For example: {{{P}-A}} is {ex(k, 'Flat Table')[0]}."),
       START(code)],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV in a plain text editor (not a spreadsheet program) and read the heading row.",
       f"Find {{{P}-A}}'s row and read its cells.", "Read the last row.", "Look for any group header or subtotal row.",
       "Choose \"Download (PDF)\" from the ⋯ menu.", "Look at the PDF's last bucket heading."],
      ["Step 1: the CSV downloads.",
       "Step 2: the last bucket column is headed \"91 And Over\", exactly as the screen shows it.",
       f"Step 3: one row for {{{P}-A}}: 1-30 Days reads 1250.50 and 91 And Over reads 99.00 (no $ sign, no thousands comma, two decimals); Current, 31-60 Days and 61-90 Days are blank cells, not 0; the Total reads 1349.50 (1250.50 + 99.00).",
       "Step 4: one Totals row at the bottom, and only one.",
       f"Step 5: there are none: every row except the Totals row is one {r['party']}.",
       "Step 6: the PDF downloads.", "Step 7: the PDF heading reads \"91 And Over\" on one line."],
      ["S3-R7", "S3-R8"])

# ---- CSV shape: the four document reports
for code in ("ARD", "ARC", "APD", "APU"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]; Dc = d.capitalize()
    grp = "aging bucket" if r["group"] == "aging bucket" else r["party"]
    C(k, "S3", f"{r['n']}: the CSV has one row per document and no group rows",
      [ADMIN(),
       (f"{P} {{{P}-A}} has two overdue {d}s on today's date in different aging buckets: {{{Dc}-A}}, dated 2026-09-01, amount $1,250.50, and {{{Dc}-B}}, amount $75.00.",
        f"For example: {{{P}-A}} is {ex(k, 'Flat Rows')[0]}."),
       START(code, f", with the {P} filter showing {{{P}-A}} ticked")],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV in a plain text editor and read the heading row.",
       f"Find {{{Dc}-A}}'s row and read its cells.", "Read every other row.", "Read the last row."],
      ["Step 1: the CSV downloads.",
       f"Step 2: the columns include one for the {grp}" + (f" and one for the {r['party']}" if grp == "aging bucket" else "") + ".",
       f"Step 3: one row for {{{Dc}-A}}: its {grp} is in its own column" + (f", {{{P}-A}} in the {r['party']} column" if grp == "aging bucket" else "") + ", the Date reads 2026-09-01 and the Amount reads 1250.50 (no $ sign, no thousands comma, two decimals).",
       f"Step 4: there is one row for {{{Dc}-B}} and no group header or subtotal row.",
       "Step 5: one Totals row at the bottom; its Amount is 1325.50 (1250.50 + 75.00)."],
      ["S3-R8"],
      note=f"The CSV headings for the bucket and the {r['party']} columns are not stated in the PRD (question {QN['csv-headings']}); the case checks that the columns exist.")

# ---- an export with no rows
for code, how in (("ARS", "location"), ("APU", "vendor")):
    r = R[code]; k = nk(); P = r["Party"]
    if how == "location":
        pre = [ADMIN(), TWO_LOC, START(code)]
        s1 = ("Open the Location filter and click \"Clear selection\".", "Step 1: no location is ticked; the native empty state shows with \"Clear all filters\", no totals and no Location column.")
        q = ["S3-R10", "S5-R6a", "UFS-7"]
    else:
        pre = [ADMIN(), TWO_LOC, (f"Vendor {{Vendor-A}} has open bills only at {{Location-B}}.", f"For example: {{Vendor-A}} is {ex(k, 'Elsewhere')[0]}."),
               START(code, ", with only {Location-A} ticked in the Location filter")]
        s1 = ("In the Vendor filter, tick {Vendor-A}.", "Step 1: the report shows no rows: {Vendor-A} has nothing open at {Location-A}.")
        q = ["S3-R10", "UFS-7", "S5-E1"]
    C(k, "S3", f"{r['n']}: exporting an empty report downloads nothing and warns", pre,
      [s1[0], "Choose \"Download (PDF)\" from the ⋯ menu.", "Look at the browser's downloads.", "Choose \"Download (CSV)\" from the ⋯ menu.", "Look at the browser's downloads."],
      [s1[1], "Step 2: the warning \"Empty export\", \"Export didn't yield any results\" shows.", "Step 3: nothing was downloaded.",
       "Step 4: the same warning shows.", "Step 5: nothing was downloaded."], q)

# ---- an export that fails for any other reason (lost connection)
for code, kind in (("ARD", "CSV"), ("APS", "PDF")):
    r = R[code]; k = nk()
    C(k, "S3", f"{r['n']}: a {kind} export that fails shows one error and downloads nothing",
      [ADMIN(), (f"The report has open documents on today's date.", None),
       ("You can switch this computer's network connection off and on (for example Wi-Fi).", None), START(code)],
      ["Switch the computer's network connection off.", "Click the ⋯ button.", f"Click \"Download ({kind})\".", "Count the messages that show and look at the browser's downloads.",
       "Switch the network connection back on."],
      ["Step 1: the computer is offline; the report stays on screen.", "Step 2: the menu opens.",
       "Step 3: the error message \"We couldn't export this report. Please try again.\" shows.",
       "Step 4: exactly one message shows, no second generic error, and nothing was downloaded.",
       "Step 5: the connection is back; a new export works again."],
      ["EH", "UFS-8"],
      note="The server-error half of the same sentence cannot be caused by hand; the developers' automated tests cover it. This case covers the lost connection.")
