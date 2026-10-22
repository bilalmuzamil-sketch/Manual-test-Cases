"""Totals and counts — exact amounts (Rule 116): paging never repeats or skips (S1-R8, S4-R4), the Totals row under every filter on
screen, in the PDF and the CSV (S5-R18, S5-R8, S5-R16, S5-R17, WC-4), the A/R Summary Totals and overpaid invoices (WC-5), Summary and
Detail parity, Past due range boundaries (S5-R15), and the export limits by row count (S3-R9, S3-N1 to S3-N3)."""
from ar_lib import C
from common import *
from po_questions import QN

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"DATA-{ORDER['n']:02d}"
LIMIT_HOLD = f"AUTOMATION: HOLD - a manual tester cannot build exactly this many rows by hand; waiting on the test data (question {QN['limits-data']})"

# ---------------- paging: 30 per page, nothing repeated or skipped, in any sort ----------------
for code in ("ARS", "APS", "ARC", "APU"):
    r = R[code]; k = nk(); Ps = r["parties"]
    C(k, "DATA", f"{r['n']}: 30 {Ps} per page, none repeated or skipped",
      [ADMIN(), (f"Between 31 and 90 {Ps} have " + ("open documents" if code in ("ARS", "APS") else f"overdue {r['doc']}s") + " on today's date.",
                 "For example: the QA organization's A/R Summary has 46 customers." if code == "ARS" else None),
       START(code)],
      ["Click the ⋯ button, click \"Download (CSV)\" and count the " + r["party"] + "s in it (each name once).",
       f"Count the {Ps} on the first page and note the last one.",
       "Go to the next page (or scroll until the next ones load) and read the first name.",
       f"Read every page to the end, writing down each {r['party']}'s name.",
       f"Click the \"{r['headline']}\" header and read every page again, writing down each name.",
       "Open the Past due filter, tick \"1-30 days\" and \"91+ days\", and read every page again, writing down each name.",
       "Read the Totals row on each page."],
      [f"Step 1: the CSV downloads; note the number of {Ps} (for example 46).",
       f"Step 2: exactly 30 {Ps}.",
       f"Step 3: the next page starts with the {r['party']} that comes right after the last one of the first page, not a repeat.",
       f"Step 4: every {r['party']} appears exactly once and the count equals the CSV's.",
       f"Step 5: in this sort too, every {r['party']} appears exactly once and none is missing.",
       f"Step 6: every {r['party']} left by the filter appears exactly once; none repeats between pages.",
       "Step 7: the Totals row reads the same on every page and adds up every row the filters leave, not only the rows on that page."],
      ["S1-R8", "S5-R18", "WC-1"] if code in ("ARS", "ARC") else ["S1-R8", "S5-R18"],
      note=f"Whether the next 30 come by page buttons or by scrolling is question {QN['paging']}; story SV-11531 still says \"Paging (30 rows per page)\" for every report, PRD v5 is followed.")

for code in ("ARD", "APD"):
    r = R[code]; k = nk()
    C(k, "DATA", f"{r['n']}: a long bucket loads in 100s with no line repeated or skipped",
      [ADMIN(), ("One aging bucket, {Bucket-A}, has between 101 and 400 open lines on today's date.", "For example: {Bucket-A} is \"91 or more days past due\"."),
       START(code, ", with every bucket collapsed")],
      ["Click the ⋯ button, click \"Download (CSV)\" and count the rows whose bucket is {Bucket-A}.",
       "Expand {Bucket-A} and scroll to its end, letting every batch load, writing down each document number.",
       "Click the \"Amount\" header, then expand {Bucket-A} again if needed and scroll to its end, writing down each number.",
       "Compare the two lists with the CSV."],
      ["Step 1: note the count (for example 250).",
       "Step 2: the first 100 lines show, then more load as you scroll; every document appears exactly once.",
       "Step 3: in this sort too, every document appears exactly once.",
       "Step 4: both lists hold exactly the CSV's documents for {Bucket-A}: none repeated, none missing."],
      ["S1-R8", "S4-R4"])

# ---------------- the Totals row under every filter, on screen, in the PDF and the CSV ----------------
AR_DATA = ("{Customer-A} has an invoice of $1,000.00 at {Location-A} 15 days past due, an invoice of $400.00 at {Location-B} 45 days past due and an unused credit memo of $150.00 at {Location-A}; "
           "{Customer-B} has an invoice of $700.00 at {Location-A} 45 days past due and an invoice of $250.00 at {Location-B} 100 days past due; "
           "{Customer-C} has an invoice of $900.00 at {Location-A} 5 days past due. Nothing else is open for the three on today's date.")
AP_DATA = AR_DATA.replace("Customer", "Vendor").replace("an invoice", "a bill").replace("unused credit memo", "unused vendor credit")
def data_pre(code, k):
    P = R[code]["Party"]
    return (AR_DATA if R[code]["fam"] == "A/R" else AP_DATA,
            f"For example: {{{P}-A}} is {ex(k, 'Alpha')[0]}, {{{P}-B}} is {ex(k, 'Bravo')[0]} and {{{P}-C}} is {ex(k, 'Charlie')[0]}.")

for code in ("ARS", "APS"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]; cr = "credit memo" if r["fam"] == "A/R" else "vendor credit"
    C(k, "DATA", f"{r['n']}: the Totals row adds up exactly the rows each filter leaves",
      [ADMIN(), TWO_LOC, data_pre(code, k), START(code)],
      [f"Open the {P} filter and tick {{{P}-A}} and {{{P}-B}}.", "Read both rows and the Totals row.",
       "Open the Location filter and untick {Location-B}.", "Read both rows and the Totals row.",
       "Open the Location filter, click \"Select all\", then open the Past due filter and tick \"91+ days\".", "Read the rows and the Totals row.",
       "Download the PDF and the CSV from the ⋯ menu and read their Totals rows."],
      [f"Step 1: two rows remain; {{{P}-C}} is gone.",
       f"Step 2: {{{P}-A}} appears once, with Location \"Multiple\" and a Total of $1,250.00 (1,000.00 + 400.00 − 150.00); {{{P}-B}}'s Total is $950.00 (700.00 + 250.00); the Totals row's Total is $2,200.00 (1,250.00 + 950.00).",
       "Step 3: the report narrows to {Location-A}.",
       f"Step 4: {{{P}-A}}'s Total is $850.00 (1,000.00 − 150.00, its {{Location-A}} documents only); {{{P}-B}}'s is $700.00; the Totals row's Total is $1,550.00.",
       "Step 5: every location is ticked again and only the 91+ range is ticked.",
       f"Step 6: only {{{P}-B}} is listed ({{{P}-A}} has nothing more than 90 days past due), at its full balance: 31-60 Days $700.00, 91 And Over $250.00, Total $950.00; the Totals row's Total is $950.00.",
       "Step 7: both Totals rows read $950.00 for the Total, the same as the screen."],
      ["S5-R18", "S5-R8", "S5-R17", "S6-R4", "KD-ROW"])

for code in ("ARD", "ARC", "APD", "APU"):
    r = R[code]; k = nk(); P = r["Party"]; cr = "credit memo" if r["fam"] == "A/R" else "vendor credit"
    C(k, "DATA", f"{r['n']}: Totals follow the {r['party']}, Past due and Location filters",
      [ADMIN(), TWO_LOC, data_pre(code, k), START(code)],
      [f"Open the {P} filter and tick {{{P}-A}} and {{{P}-B}}.", f"Read the Totals row's {r['headline']}.",
       "Open the Past due filter and tick \"31-60 days\".", "Expand every group and read the rows and the Totals row.",
       "Open the Location filter and untick {Location-B}.", "Expand every group and read the rows and the Totals row.",
       "Download the PDF and the CSV from the ⋯ menu and read their Totals rows."],
      [f"Step 1: only the two {r['parties']}' documents remain; {{{P}-C}}'s $900.00 is gone.",
       f"Step 2: $2,200.00 (1,000.00 + 400.00 − 150.00 + 700.00 + 250.00): the Totals row follows the {r['party']} filter.",
       "Step 3: the chip reads \"Past due: 31-60 days\".",
       f"Step 4: the rows are the $400.00 and $700.00 documents (45 days past due) and the $150.00 {cr}, which is always kept; the Totals row reads $950.00 (400.00 + 700.00 − 150.00).",
       "Step 5: the report narrows to {Location-A}.",
       f"Step 6: the rows are the $700.00 document and the $150.00 {cr}; the Totals row reads $550.00 (700.00 − 150.00).",
       "Step 7: both Totals rows read $550.00, the same as the screen."],
      ["S5-R18", "S5-R16", "S5-R7"] + (["WC-4"] if code in ("ARC", "APU") else []))

# ---------------- A/R Summary Totals and overpaid invoices ----------------
k = nk()
C(k, "DATA", "A/R Summary: the Totals row leaves out overpaid invoices, as the rows do",
  [ADMIN(), ("Customer {Customer-A} has an invoice {Invoice-A} of $100.00 paid $120.00 (overpaid), and an open invoice {Invoice-B} of $500.00 on today's date.",
             f"For example: {{Customer-A}} is {ex(k, 'Overpaid')[0]}."),
   START("ARS", ", with the Customer filter showing only {Customer-A} ticked")],
  ["Read {Customer-A}'s row.", "Read the Totals row.", "Compare the Totals row with the row above it, column by column."],
  ["Step 1: the row counts only {Invoice-B}: Total $500.00; the overpaid invoice is not in the row.",
   "Step 2: the Totals row's Total reads $500.00.",
   "Step 3: every column of the Totals row equals {Customer-A}'s row: the Totals row adds up exactly the rows above it."],
  ["WC-5", "S5-R18"],
  marker=f"AUTOMATION: HOLD - waiting on the PO (question {QN['overpaid']}: how to get an overpaid invoice on a test site)")

# ---------------- Summary and Detail parity ----------------
for fam, s, d in (("A/R", "ARS", "ARD"), ("A/P", "APS", "APD")):
    k = nk()
    C(k, "DATA", f"{fam} Summary and {fam} Detail show the same Totals for the same filters",
      [ADMIN(), TWO_LOC, (f"The organization has open {docs(s)} on today's date at both locations.", None), "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
      [f"Open {R[s]['n']}, untick {{Location-B}} and read the Totals row's Total.", f"Open {R[d]['n']}, untick {{Location-B}} and read the Totals row's {R[d]['headline']}.",
       "Compare the two."],
      ["Step 1: note the amount.", "Step 2: note the amount.", "Step 3: the two amounts are equal, to the cent."],
      ["S5-R18", "WC-10"], reports=[s, d],
      marker=f"AUTOMATION: HOLD - waiting on the PO (question {QN['parity']}: should Summary and Detail Totals agree)")

# ---------------- Past due range boundaries ----------------
for code in ("ARD", "APU"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]
    C(k, "DATA", f"{r['n']}: the Past due ranges split at 30, 60 and 90 days exactly",
      [ADMIN(), (f"{P} {{{P}-A}} has eight open {d}s on today's date: one not yet due, and one each 1, 30, 31, 60, 61, 90 and 91 days past its due date.",
                 f"For example: {{{P}-A}} is {ex(k, 'Boundaries')[0]}; the {d}s are $10.00, $1.00, $30.00, $31.00, $60.00, $61.00, $90.00 and $91.00 in that order."),
       START(code, f", with only {{{P}-A}} ticked in the {P} filter and every group expanded")],
      ["Open the Past due filter and tick \"1-30 days\" only, then expand every group.", "Untick it, tick \"31-60 days\" only and expand every group.",
       "Untick it, tick \"61-90 days\" only and expand every group.", "Untick it, tick \"91+ days\" only and expand every group.",
       "Tick all four ranges and expand every group.", "Untick all four."],
      [f"Step 1: only the {d}s 1 and 30 days past due remain (Totals $31.00).",
       f"Step 2: only the 31 and 60 day {d}s (Totals $91.00).",
       f"Step 3: only the 61 and 90 day {d}s (Totals $151.00).",
       f"Step 4: only the 91 day {d} (Totals $91.00).",
       f"Step 5: the chip reads \"Past due: 4 ranges\" and the {d} that is not yet due is gone (Totals $364.00).",
       f"Step 6: \"Past due: Any\" and all eight {d}s show (Totals $374.00)."],
      ["S5-R15", "S5-R16", "S5-R18"])

# ---------------- export limits ----------------
k = nk()
C(k, "DATA", "A/P Detail: a PDF over 2,000 rows is refused, the CSV downloads",
  [ADMIN(), ("The organization has more than 2,000 and fewer than 50,000 open A/P lines on today's date.", "For example: the QA organization, with 13,540 open A/P lines."), START("APD")],
  ["Click the ⋯ button and click \"Download (PDF)\".", "Count the messages that show and look at the browser's downloads.",
   "Click the ⋯ button and click \"Download (CSV)\".", "Open the CSV and count its document rows (leave out the heading and the Totals row)."],
  ["Step 1: the error message \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\" shows straight away.",
   "Step 2: exactly one message, no second generic error, and no PDF was downloaded.",
   "Step 3: the CSV downloads with the \"Success\" message.",
   "Step 4: the count matches the report's document rows (for example 13,540)."],
  ["S3-N1", "S3-N3", "UFS-1", "S3-R9", "ASSUME-13540"])

k = nk()
C(k, "DATA", "A/R Summary: a PDF of exactly 2,000 customers downloads, 2,001 is refused",
  [ADMIN(), ("On {Date-A} A/R Summary lists exactly 2,000 customers, and on {Date-B} exactly 2,001.", "For example: a prepared test organization (see the note)."),
   START("ARS")],
  ["Set the as-of date to {Date-A}.", "Click the ⋯ button and click \"Download (PDF)\".", "Set the as-of date to {Date-B}.", "Click the ⋯ button and click \"Download (PDF)\".",
   "Count the messages and look at the browser's downloads."],
  ["Step 1: 2,000 customer rows (the Totals row is not counted).", "Step 2: the PDF downloads with the \"Success\" message.",
   "Step 3: 2,001 customer rows.", "Step 4: \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\"",
   "Step 5: exactly one message and no PDF downloaded."],
  ["S3-N1", "S3-R9", "S3-N3"], marker=LIMIT_HOLD,
  note="The row count is the customers listed, not the Totals row. A manual tester cannot build 2,000 customers by hand; the case waits for a prepared data set.")

k = nk()
C(k, "DATA", "A/P Detail: 2,000 document rows download as PDF, headings not counted",
  [ADMIN(), ("On {Date-A} A/P Detail has exactly 2,000 open lines across its buckets (plus bucket rows, subtotals and the Totals row), and on {Date-B} exactly 2,001.",
             "For example: a prepared test organization (see the note)."),
   START("APD")],
  ["Set the as-of date to {Date-A}.", "Click the ⋯ button and click \"Download (PDF)\".", "Set the as-of date to {Date-B}.", "Click the ⋯ button and click \"Download (PDF)\"."],
  ["Step 1: 2,000 document rows.", "Step 2: the PDF downloads: bucket rows, subtotals and the Totals row are not counted.", "Step 3: 2,001 document rows.",
   "Step 4: \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\" and nothing downloads."],
  ["S3-R9", "S3-N1"], marker=LIMIT_HOLD)

k = nk()
C(k, "DATA", "A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused",
  [ADMIN(), ("On {Date-A} A/P Detail has exactly 50,000 open lines, and on {Date-B} exactly 50,001.", "For example: a prepared test organization (see the note)."),
   START("APD")],
  ["Set the as-of date to {Date-A}.", "Click the ⋯ button and click \"Download (CSV)\".", "Set the as-of date to {Date-B}.", "Click the ⋯ button and click \"Download (CSV)\".",
   "Count the messages, look at the downloads and look for any offer to email or prepare the export later."],
  ["Step 1: 50,000 document rows.", "Step 2: the CSV downloads with the \"Success\" message.", "Step 3: 50,001 document rows.",
   "Step 4: \"This report is too large to export. Choose an earlier as-of date, then try again.\"",
   "Step 5: exactly one message, nothing downloaded, and no offer to email the export or prepare it in the background (that comes in a later phase)."],
  ["S3-N2", "S3-N3", "UFS-2", "S3-R9", "OOS-1"], marker=LIMIT_HOLD)
