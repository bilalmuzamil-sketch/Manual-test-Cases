"""Totals and counts — exact amounts (Rule 116): paging never repeats or skips (S1-R8, S4-R4), the Totals row under every filter on
screen, in the PDF and the CSV (S5-R18, S5-R8, S5-R16, S5-R17, WC-4), the A/R Summary Totals and overpaid invoices (WC-5), Summary and
Detail parity, Past due range boundaries (S5-R15), and the export limits by row count (S3-R9, S3-N1 to S3-N3)."""
from ar_lib import C
from common import *
from po_questions import QN
import tech_plan as TP

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"DATA-{ORDER['n']:02d}"
LIMIT_HOLD = "AUTOMATION: HOLD - needs more rows than any test site holds; the developers check this limit in their own check tasks (SV-11595, SV-11598)"

# ---------------- 30 at a time, more as the user scrolls (PRD v9 S1-R8, from Chris Ward's answer 5), nothing repeated or skipped ----------------
for code in ("ARS", "APS", "ARC", "APU"):
    r = R[code]; k = nk(); Ps = r["parties"]
    C(k, "DATA", f"{r['n']}: 30 {Ps} at a time, none repeated or skipped",
      [ADMIN(), (f"Between 31 and 90 {Ps} have " + ("open documents" if code in ("ARS", "APS") else f"overdue {r['doc']}s") + " on today's date.",
                 "For example: the QA organization's A/R Summary has 46 customers." if code == "ARS" else None),
       START(code)],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", f"Open the CSV and count the {Ps} in it (each name once).",
       f"Count the {Ps} shown before any more load (or compare them with the first 30 names in the CSV) and note the last one.",
       f"Scroll down until the next {Ps} load.",
       f"Keep scrolling to the end of the list, writing down each {r['party']}'s name.",
       f"Click the \"{r['headline']}\" header.", "Scroll from the top to the end of the list again, writing down each name.",
       "In the Past due filter, tick \"1-30 days\".", "Tick \"91+ days\".",
       "Scroll from the top to the end of the list again, writing down each name."],
      ["Step 1: the CSV downloads.", f"Step 2: note the number of {Ps} (for example 46).",
       f"Step 3: exactly 30 {Ps}.",
       f"Step 4: the next {Ps} load below as you scroll (there are no page buttons), starting with the {r['party']} that comes right after the last one noted in step 3, not a repeat.",
       f"Step 5: every {r['party']} appears exactly once and the count equals the CSV's.",
       f"Step 6: the rows sort by {r['headline']}, largest first.",
       f"Step 7: in this sort too, every {r['party']} appears exactly once and none is missing.",
       "Step 8: the chip reads \"Past due: 1-30 days\" and the report reloads with that range only.",
       "Step 9: the chip reads \"Past due: 2 ranges\" and the report reloads with both ranges.",
       f"Step 10: every {r['party']} left by the filter appears exactly once; none repeats as more load."],
      ["S1-R8", "WC-1"] if code in ("ARS", "ARC") else ["S1-R8"])
    # Rule 136 (22 Oct 2026): the Totals row on every page (S5-R18) is its own case; it reads the same records and changes none.
    C(k + "b", "DATA", f"{r['n']}: the Totals row adds up every {r['party']}, not only those loaded",
      [ADMIN(), (f"Between 31 and 90 {Ps} have " + ("open documents" if code in ("ARS", "APS") else f"overdue {r['doc']}s") + " on today's date.",
                 "For example: the QA organization's A/R Summary has 46 customers." if code == "ARS" else None),
       START(code)],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and read its Totals row.",
       "Switch back to the report and read its Totals row.", f"Scroll down until the next {Ps} load."],
      ["Step 1: the CSV downloads.", f"Step 2: note the Totals row's {r['headline']} (it adds up every row of the report).",
       f"Step 3: the screen's Totals row reads the same {r['headline']} as the CSV's: it adds up every {r['party']}, not only the 30 loaded so far.",
       "Step 4: the Totals row reads the same after more load."],
      ["S5-R18", "S3-R3", "S1-R8"])

for code in ("ARD", "APD"):
    r = R[code]; k = nk()
    C(k, "DATA", f"{r['n']}: a long bucket loads in 100s with no line repeated or skipped",
      [ADMIN(), ("One aging bucket, {Bucket-A}, has between 101 and 400 open lines on today's date.", "For example: {Bucket-A} is \"91 or more days past due\"."),
       START(code, ", with every bucket collapsed")],
      ["Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and count the rows whose bucket is {Bucket-A}.",
       "Expand {Bucket-A}.",
       "Scroll to the end of {Bucket-A}, letting every batch load, writing down each document number.",
       "Click the \"Amount\" header.", "Look at {Bucket-A} and count its lines before any more load.",
       "Scroll to the end of {Bucket-A} again, letting every batch load, writing down each number."],
      ["Step 1: the CSV downloads.", "Step 2: note the count (for example 250).",
       "Step 3: {Bucket-A} opens and its first 100 lines show.",
       "Step 4: more lines load as you scroll; every document appears exactly once.",
       "Step 5: the rows sort by Amount, largest first, inside each bucket.",
       "Step 6: {Bucket-A} is still expanded and starts again from its first 100 lines, now in Amount order (largest first).",
       "Step 7: more lines load as you scroll; in this sort too, every document appears exactly once; both lists (this one and the one from step 4) hold exactly the CSV's documents for {Bucket-A}: none repeated, none missing."],
      ["S1-R8", "S4-R4", "S4-R8"] + TP.q("P4-sort"))

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
      [f"In the {P} filter, tick {{{P}-A}} and {{{P}-B}}.",
       "In the Location filter, untick {Location-B}.",
       "In the Location menu, click \"Select all\".", "In the Past due filter, tick \"91+ days\".",
       "Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF and read its Totals row.",
       "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and read its Totals row."],
      [f"Step 1: two rows remain; {{{P}-C}} is gone. {{{P}-A}} appears once, with Location \"Multiple\" and a Total of $1,250.00 (1,000.00 + 400.00 − 150.00); {{{P}-B}}'s Total is $950.00 (700.00 + 250.00); the Totals row's Total is $2,200.00 (1,250.00 + 950.00).",
       f"Step 2: the report narrows to {{Location-A}}: {{{P}-A}}'s Total is $850.00 (1,000.00 − 150.00, its {{Location-A}} documents only); {{{P}-B}}'s is $700.00; the Totals row's Total is $1,550.00.",
       "Step 3: every location is ticked again.",
       f"Step 4: the chip reads \"Past due: 91+ days\"; only {{{P}-B}} is listed ({{{P}-A}} has nothing more than 90 days past due), at its full balance: 31-60 Days $700.00, 91 And Over $250.00, Total $950.00; the Totals row's Total is $950.00.",
       "Step 5: the PDF downloads.",
       "Step 6: the PDF's Totals row reads $950.00 for the Total, the same as the screen.",
       "Step 7: the CSV downloads.",
       "Step 8: the CSV's Totals row reads $950.00 for the Total, the same as the screen."],
      ["S5-R18", "S5-R8", "S5-R17", "S6-R4", "KD-ROW"])

for code in ("ARD", "ARC", "APD", "APU"):
    r = R[code]; k = nk(); P = r["Party"]; cr = "credit memo" if r["fam"] == "A/R" else "vendor credit"
    C(k, "DATA", f"{r['n']}: Totals follow the {r['party']}, Past due and Location filters",
      [ADMIN(), TWO_LOC, data_pre(code, k), START(code)],
      [f"In the {P} filter, tick {{{P}-A}} and {{{P}-B}}.",
       "In the Past due filter, tick \"31-60 days\".", "Expand every group and read the rows and the Totals row.",
       "In the Location filter, untick {Location-B}.", "Expand every group and read the rows and the Totals row.",
       "Choose \"Download (PDF)\" from the ⋯ menu.", "Open the PDF and read its Totals row.",
       "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and read its Totals row."],
      [f"Step 1: only the two {r['parties']}' documents remain; {{{P}-C}}'s $900.00 is gone. The Totals row's {r['headline']} reads $2,200.00 (1,000.00 + 400.00 − 150.00 + 700.00 + 250.00): the Totals row follows the {r['party']} filter.",
       "Step 2: the chip reads \"Past due: 31-60 days\".",
       f"Step 3: the rows are the $400.00 and $700.00 documents (45 days past due) and the $150.00 {cr}, which is always kept; the Totals row reads $950.00 (400.00 + 700.00 − 150.00).",
       "Step 4: the report narrows to {Location-A}.",
       f"Step 5: the rows are the $700.00 document and the $150.00 {cr}; the Totals row reads $550.00 (700.00 − 150.00).",
       "Step 6: the PDF downloads.",
       "Step 7: the PDF's Totals row reads $550.00, the same as the screen.",
       "Step 8: the CSV downloads.",
       "Step 9: the CSV's Totals row reads $550.00, the same as the screen."],
      ["S5-R18", "S5-R16", "S5-R7"] + (["WC-4"] if code in ("ARC", "APU") else []))

# ---------------- A/R Summary Totals and overpaid invoices ----------------
k = nk()
C(k, "DATA", "A/R Summary: the Totals row leaves out overpaid invoices, as the rows do",
  [ADMIN(), ("Customer {Customer-A} has an invoice {Invoice-A} of $100.00 paid $120.00 (overpaid), and an open invoice {Invoice-B} of $500.00 on today's date.",
             f"For example: {{Customer-A}} is {ex(k, 'Overpaid')[0]}."),
   START("ARS", ", with the Customer filter showing only {Customer-A} ticked")],
  ["Read {Customer-A}'s row.", "Read the Totals row and compare it with the row above it, column by column."],
  ["Step 1: the row counts only {Invoice-B}: Total $500.00; the overpaid invoice is not in the row.",
   "Step 2: the Totals row's Total reads $500.00, and every column of the Totals row equals {Customer-A}'s row: the Totals row adds up exactly the rows above it."],
  ["WC-5", "S5-R18"],
  note="To set this up, record a payment of $120.00 on the $100.00 invoice.")

# ---------------- Summary and Detail parity (PRD v9 S5-R18a, from Chris Ward's answer 9; released 26 Oct 2026, Rule 116) ----------------
PAR_AR = ("{Customer-A} has an invoice of $1,000.00 at {Location-A} that is not yet due, an invoice of $400.00 at {Location-A} 45 days past due and an invoice of $300.00 at {Location-B} 15 days past due; "
          "{Customer-B} has an invoice of $700.00 at {Location-A} 45 days past due, partly paid $200.00 (open $500.00), and an invoice of $250.00 at {Location-A} 100 days past due. "
          "Nothing else is open for the two on today's date.")
PAR_AP = PAR_AR.replace("Customer", "Vendor").replace("an invoice", "a bill")
for fam, s_, d_ in (("A/R", "ARS", "ARD"), ("A/P", "APS", "APD")):
    k = nk(); P = R[s_]["Party"]; S, Dn = R[s_]["n"], R[d_]["n"]
    C(k, "DATA", f"{S} Totals equal {Dn}'s Open Balance, bucket by bucket",
      [ADMIN(), TWO_LOC, (PAR_AR if fam == "A/R" else PAR_AP,
                          f"For example: {{{P}-A}} is {ex(k, 'Parity One')[0]} and {{{P}-B}} is {ex(k, 'Parity Two')[0]}."),
       START(s_, f", with {{{P}-A}} and {{{P}-B}} ticked in the {P} filter and Past due on Any")],
      ["Read the Totals row.",
       f"Open Reports > Finance > {Dn} from the Reports menu in a second browser tab.",
       f"In the {P} filter, tick {{{P}-A}}.", f"Tick {{{P}-B}}.",
       "In the Location filter, untick {Location-B}.",
       f"Switch back to the {S} tab.",
       "In the Location filter, untick {Location-B}."],
      ["Step 1: the Totals row reads Current $1,000.00, 1-30 Days $300.00, 31-60 Days $900.00 (400.00 + 500.00), 61-90 Days $0.00, 91 And Over $250.00 and Total $2,450.00 (1,000.00 + 300.00 + 900.00 + 250.00).",
       f"Step 2: {Dn} opens on today's date with no {P.lower()} ticked and Past due on Any.",
       f"Step 3: {{{P}-A}} is ticked.",
       f"Step 4: both are ticked; each bucket row shows its sums: \"91 or more days past due\" Open Balance $250.00, \"31-60 days past due\" Open Balance $900.00 (its Amount reads $1,100.00, the original amounts, which are not compared), \"1-30 days past due\" $300.00 and \"Current\" $1,000.00, and \"61-90 days past due\" has no rows; the Totals row's Open Balance reads $2,450.00: bucket by bucket and in total the same as the {S} Totals in step 1.",
       "Step 5: the report narrows to {Location-A}: \"1-30 days past due\" has no rows any more and the Totals row's Open Balance reads $2,150.00 (2,450.00 − 300.00); the other buckets keep their sums.",
       f"Step 6: {S} shows, as in step 1.",
       f"Step 7: the report narrows to {{Location-A}}: the Totals row reads Current $1,000.00, 1-30 Days $0.00, 31-60 Days $900.00, 61-90 Days $0.00, 91 And Over $250.00 and Total $2,150.00: bucket by bucket the same as {Dn} in step 5."],
      ["S5-R18a", "S5-R18", "S1-R5", "S5-R7"], reports=[s_, d_])

# ---------------- Past due range boundaries ----------------
for code in ("ARD", "APU"):
    r = R[code]; k = nk(); P = r["Party"]; d = r["doc"]
    C(k, "DATA", f"{r['n']}: the Past due ranges split at 30, 60 and 90 days exactly",
      [ADMIN(), (f"{P} {{{P}-A}} has eight open {d}s on today's date: one not yet due, and one each 1, 30, 31, 60, 61, 90 and 91 days past its due date.",
                 f"For example: {{{P}-A}} is {ex(k, 'Boundaries')[0]}; the {d}s are $10.00, $1.00, $30.00, $31.00, $60.00, $61.00, $90.00 and $91.00 in that order."),
       START(code, f", with only {{{P}-A}} ticked in the {P} filter and every group expanded")],
      ["In the Past due filter, tick \"1-30 days\" only.",
       "Also tick \"31-60 days\".",
       "Also tick \"61-90 days\".",
       "Also tick \"91+ days\".",
       "In the Past due filter, untick all four."],
      [f"Step 1: the Totals row reads $31.00: only the {d}s 1 and 30 days past due remain (expand the groups to see them).",
       f"Step 2: $122.00: the 31 and 60 day {d}s are added ($31.00 + $31.00 + $60.00); the 61 day {d} is not.",
       f"Step 3: $273.00: the 61 and 90 day {d}s are added ($122.00 + $61.00 + $90.00); the 91 day {d} is not.",
       f"Step 4: the chip reads \"Past due: 4 ranges\"; the 91 day {d} is added and the {d} that is not yet due is still left out (Totals $364.00 = $273.00 + $91.00).",
       f"Step 5: \"Past due: Any\" and all eight {d}s show (Totals $374.00)."],
      ["S5-R15", "S5-R16", "S5-R18"])

# ---------------- export limits ----------------
k = nk()
C(k, "DATA", "A/P Detail: a PDF over 2,000 rows is refused, the CSV downloads",
  [ADMIN(), ("The organization has more than 2,000 and fewer than 50,000 open A/P lines on today's date.", "For example: the QA organization, with 13,540 open A/P lines."), START("APD")],
  ["Choose \"Download (PDF)\" from the ⋯ menu.",
   "Choose \"Download (CSV)\" from the ⋯ menu.", "Open the CSV and count its document rows (leave out the heading and the Totals row)."],
  ["Step 1: the error message \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\" shows straight away: exactly one message, no second generic error, and no PDF is downloaded (no new file in the browser's downloads).",
   "Step 2: the CSV downloads with the \"Success\" message.",
   "Step 3: the count matches the report's document rows (for example 13,540)."],
  ["S3-N1", "S3-N3", "UFS-1", "S3-R9", "ASSUME-13540"])

k = nk()
C(k, "DATA", "A/R Summary: a PDF of exactly 2,000 customers downloads, 2,001 is refused",
  [ADMIN(), ("On {Date-A} A/R Summary lists exactly 2,000 customers, and on {Date-B} exactly 2,001.", "For example: a prepared test organization (see the note)."),
   START("ARS")],
  ["Set the as-of date to {Date-A}.", "Choose \"Download (PDF)\" from the ⋯ menu.", "Set the as-of date to {Date-B}.", "Choose \"Download (PDF)\" from the ⋯ menu."],
  ["Step 1: 2,000 customer rows (the Totals row is not counted).", "Step 2: the PDF downloads with the \"Success\" message.",
   "Step 3: 2,001 customer rows.", "Step 4: \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\": exactly one message and no PDF downloaded (no new file in the browser's downloads)."],
  ["S3-N1", "S3-R9", "S3-N3"], marker=LIMIT_HOLD,
  note="The row count is the customers listed, not the Totals row. No test site has 2,000 customers with open invoices (the QA organization has 46), so this exact boundary is checked by the developers (SV-11595); the PDF boundary itself is checked by hand on A/P Detail.")

k = nk()
C(k, "DATA", "A/P Detail: a PDF of exactly 2,000 lines downloads, 2,001 is refused",
  [ADMIN(), ("Today the organization has more than 2,001 open A/P lines, and the vendors {Vendors-A} together have exactly 2,000 of them.",
             "For example: the QA organization (13,540 open A/P lines); {Vendors-A} is the list of vendors the setup file gives for today."),
   ("Vendor {Vendor-B} is not one of {Vendors-A} and has exactly one open A/P line today.", f"For example: {{Vendor-B}} is ZZAUTOTEST {k} One Bill, with one open bill."),
   START("APD")],
  ["In the Vendor filter, tick every vendor in {Vendors-A}.", "Choose \"Download (CSV)\" from the ⋯ menu.",
   "Open the CSV and count its document rows (leave out the heading and the Totals row).", "Choose \"Download (PDF)\" from the ⋯ menu.",
   "In the Vendor filter, also tick {Vendor-B}.", "Choose \"Download (PDF)\" from the ⋯ menu."],
  ["Step 1: only the lines of the ticked vendors remain.", "Step 2: the CSV downloads with the \"Success\" message.",
   "Step 3: exactly 2,000 document rows.",
   "Step 4: after a wait (a 2,000-row PDF can take about 30 seconds), the PDF downloads with the \"Success\" message: exactly 2,000 rows is allowed, and bucket rows, subtotals and the Totals row are not counted.",
   "Step 5: {Vendor-B}'s line is added, so the report now has 2,001 document rows.",
   "Step 6: \"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.\": exactly one message, and no PDF is downloaded (no new file in the browser's downloads)."],
  ["S3-R9", "S3-N1", "S3-N3", "S3-R10", "S5-R13"] + TP.q("PDF30", "PDFENV"),
  note=("The QA organization has far more than 2,000 open A/P lines, so the exact boundary is reached by ticking vendors whose lines add up to 2,000; the setup file lists them for the day of the test. "
        "If step 4 shows \"We couldn't export this report. Please try again.\" while the CSV in step 2 worked, the test site may not have its PDF generator set up (tech plan): mark this test "
        "Blocked: \"PDF generator not available on this site\", not Failed."))

# DATA-21 ("A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused", C715470) was DELETED from TestRail on 26 Oct 2026 on the
# QA lead's order ("2. Delete these test cases": a manual tester cannot set it up; snapshot in
# build/tester-readthrough-2026-10-26/deleted/). The counter still steps past it so DATA-22 onwards keep their keys; the requirements it
# alone covered are recorded in ar_lib.DELETED and left to the developers' own checks. Never re-create it.
nk()

# ---------------- freshness: a payment shows on reload (Rule 116; PRD v9 S5-R18b, from Chris Ward's answer 9) ----------------
k = nk()
C(k, "DATA", "A/R Summary: a payment shows as soon as the report is reloaded",
  [ADMIN(), ("Customer {Customer-A} has one open invoice, {Invoice-A}, of $500.00 on today's date, and nothing else open.", f"For example: {{Customer-A}} is {ex(k, 'Fresh Payment')[0]}."),
   ("{Invoice-A}'s page is open in a second browser tab, ready to record a payment.", None),
   START("ARS", ", with the Customer filter showing only {Customer-A} ticked")],
  ["Read {Customer-A}'s Total and the Totals row.", "Switch to the second tab.", "Record a payment of $200.00 on {Invoice-A}.",
   "Switch back to the A/R Summary tab.", "Reload the page."],
  ["Step 1: both read $500.00.", "Step 2: {Invoice-A}'s page shows.", "Step 3: the payment is saved and the invoice's balance is $300.00.",
   "Step 4: A/R Summary shows, not yet reloaded.",
   "Step 5: the report reloads, still with only {Customer-A} ticked, and {Customer-A}'s Total and the Totals row both read $300.00 (500.00 − 200.00): the payment shows straight away."],
  ["S5-R18b", "S5-R18"],
  note=("The case reloads the page on purpose: the PRD says going away and back inside the app within 30 seconds, without reloading, can still show the "
        "figures from the earlier visit, so only a reload is checked."))

# ---------------- Summary and Detail with a Past due filter (PRD v9 S5-R18a, from Chris Ward's answer 9; new 26 Oct 2026, Rule 116) ----------------
PDF_AR = ("{Customer-A} has an invoice of $1,000.00 that is not yet due, an invoice of $400.00 45 days past due, an invoice of $300.00 15 days past due and an unused credit memo of $150.00; "
          "{Customer-B} has an invoice of $500.00 45 days past due and an invoice of $250.00 100 days past due. Nothing else is open for the two on today's date.")
PDF_AP = PDF_AR.replace("Customer", "Vendor").replace("an invoice", "a bill").replace("unused credit memo", "unused vendor credit")
for fam, s_, d_ in (("A/R", "ARS", "ARD"), ("A/P", "APS", "APD")):
    k = nk(); P = R[s_]["Party"]; S, Dn = R[s_]["n"], R[d_]["n"]; cr = "credit memo" if fam == "A/R" else "vendor credit"
    C(k, "DATA", f"{fam} Summary and Detail Totals differ by what a Past due filter drops",
      [ADMIN(), (PDF_AR if fam == "A/R" else PDF_AP,
                 f"For example: {{{P}-A}} is {ex(k, 'Filtered One')[0]} and {{{P}-B}} is {ex(k, 'Filtered Two')[0]}."),
       START(s_, f", with {{{P}-A}} and {{{P}-B}} ticked in the {P} filter")],
      ["In the Past due filter, tick \"31-60 days\".",
       f"Open Reports > Finance > {Dn} from the Reports menu in a second browser tab.",
       f"In the {P} filter, tick {{{P}-A}}.", f"Tick {{{P}-B}}.",
       "In the Past due filter, tick \"31-60 days\".",
       "Click the chevron button in the table's top-left header cell (Expand all)."],
      [f"Step 1: both {R[s_]['parties']} stay listed (each has an amount 31 to 60 days past due) with their whole balance: {{{P}-A}}'s Total $1,550.00 (1,000.00 + 400.00 + 300.00 − 150.00, the not-yet-due amount and the {cr} included) and {{{P}-B}}'s $750.00 (500.00 + 250.00); the Totals row's Total reads $2,300.00.",
       f"Step 2: {Dn} opens on today's date with no {P.lower()} ticked and Past due on Any.",
       f"Step 3: {{{P}-A}} is ticked.", f"Step 4: both are ticked.",
       "Step 5: the chip reads \"Past due: 31-60 days\" and the report reloads with every group collapsed.",
       f"Step 6: the rows are {{{P}-A}}'s $400.00 {R[d_]['doc']}, {{{P}-B}}'s $500.00 {R[d_]['doc']} and {{{P}-A}}'s $150.00 {cr} (every credit is kept); the Totals row's Open Balance reads $750.00 (400.00 + 500.00 − 150.00). It is $1,550.00 less than {S}'s $2,300.00 in step 1, exactly what the Detail report leaves out: {{{P}-A}}'s $1,000.00 not yet due and $300.00 15 days past due, and {{{P}-B}}'s $250.00 100 days past due."],
      ["S5-R18a", "S5-R16", "S5-R17", "S5-R18"], reports=[s_, d_])
