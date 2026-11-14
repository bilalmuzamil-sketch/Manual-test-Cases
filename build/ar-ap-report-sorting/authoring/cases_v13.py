"""New cases of the 14 Nov 2026 currency pass (PRD version 13; QA lead "Named set (Recommended)": add cases for S3-R7b and S5-R10b where
nothing covers them; Rule 134 verdict NEW CASE NEEDED for the changed S5-E3 path). Checked against what already covers them:
  S3-R7b  D-95 (Demo Day, A/R Collection PDF, a 120-letter no-space name) covers one report and one name shape. New: one case per grouped
          report (A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices): the "Total for" row closes each bucket, customer or vendor, with
          the screen's Amount and Open Balance, never "Subtotal"; the customer and vendor ones use a long name with spaces and & " ' < >
          (skill 21 section 6d line 9, L-21).
  S5-R10b C1078980 (A/R Summary: a future date can be picked, the chip shows it, an invoice moves out of Current) and C1078981 (A/P Summary:
          a link with a future date) are another author's cases in run 557 (hands-off, Rule 38; not duplicated). S5-37 is rewritten to A/P
          Detail's Past Due counted to the picked day (v13_layout.py). New: S5-43, the PDF and CSV print the picked future day.
  S5-E3   the new clause (no ticked location left and the new list holds one location: the chip is hidden): S5-41b, the second part of S5-41
          (Rule 136: each part starts from its own preconditions).
Written in the tester's words (Rule 117 fourteenth and fifteenth amendments), one action per step (135), every precondition used (137); quotes
word for word from PRD version 13 (Rule 113). New cases go to the folder their kind uses now: "Setup needed before testing" (133629), as the
Demo Day cases did. DRAFT: not in TestRail."""
from cases_v11 import N, ADMIN, W1440, OPEN
from v13_layout import DEFER

NEW13 = {}
SPECIAL = "whose name is more than 60 characters long, with spaces, and includes each of these characters: & \" ' < >"
NO_PDF = ("The design pictures the Export menu but no PDF file (all 7 boards checked, design version of 5 Nov 2026); the PDF results follow the PRD.")
NO_DATE = ("The design pictures the date chip but no day after today and no export file (all 7 boards checked, design version of 5 Nov 2026); the "
           "results follow the PRD.")

def V(key, sec, title, pre, steps, res, q, reports, why, ex=None):
    N(key, sec, title, pre, steps, res, q, reports, ex=ex, marker=DEFER, dcodes=tuple(x for x in q if isinstance(x, str))[:1],
      design=dict(figs=[], why=why, words=[]))
    NEW13[key] = title

SECOND = {"customer": "Have a second customer, customer B, with an overdue invoice, so the PDF has two customer blocks.",
          "vendor": "Have a second vendor, vendor B, with an unpaid bill, so the PDF has two vendor blocks."}

# ============================== S3-R7b: the grouped PDFs close each bucket, customer or vendor with "Total for <name>" ==============================
for key, rep, kind in (("S3-33", "A/R Detail", "invoice"), ("S3-35", "A/P Detail", "bill")):
    who = "customer" if rep.startswith("A/R") else "vendor"
    V(key, "S3", f"{rep}: the PDF ends each bucket with its \"Total for\" row",
      [ADMIN,
       f"Have a {who} with an open {kind} in the \"31-60 days past due\" bucket and another in the \"1-30 days past due\" bucket on today's date.",
       W1440, OPEN(rep), f"Leave the report with only that {who} ticked in the {who.capitalize()} filter, so the PDF holds only those two {kind}s."],
      ["Click the chevron button in the table's top-left header cell (Expand all).",
       'Click the ⋯ Export button ("Export report") at the right of the title row.',
       'Click "Download (PDF)".',
       "Open the downloaded PDF."],
      [['Every bucket opens.', 'The "31-60 days past due" and "1-30 days past due" buckets each end with a row "Total for " and the bucket\'s name, '
        'with its Amount and Open Balance.'],
       ['The menu shows "Download (PDF)" and "Download (CSV)".'],
       ["A PDF file downloads."],
       ['The "31-60 days past due" bucket ends with a row that reads "Total for 31-60 days past due", with the same Amount and Open Balance as that row on screen.',
        'The "1-30 days past due" bucket ends with a row that reads "Total for 1-30 days past due", with the same Amount and Open Balance as that row on screen.',
        'The word "Subtotal" appears nowhere in the PDF.']],
      ["S3-R7b", "S3-R1", "S4-R1"], ["ARD" if rep == "A/R Detail" else "APD"], NO_PDF)

for key, rep, who, kind in (("S3-34", "A/R Collection", "customer", "overdue invoices"), ("S3-36", "A/P Unpaid Invoices", "vendor", "unpaid bills")):
    V(key, "S3", f"{rep}: the PDF ends each {who} with its \"Total for\" row",
      [ADMIN,
       f"Create, for this test, a {who}, {who} A, {SPECIAL}, and give them two {kind}.",
       SECOND[who],
       W1440, OPEN(rep), f"Leave the report with only {who} A and {who} B ticked in the {who.capitalize()} filter."],
      ["Click the chevron button in the table's top-left header cell (Expand all).",
       'Click the ⋯ Export button ("Export report") at the right of the title row.',
       'Click "Download (PDF)".',
       "Open the downloaded PDF."],
      [[f"Every {who} group opens.", f'{who.capitalize()} A\'s and {who} B\'s groups each end with a row "Total for " and the {who}\'s name, with its Amount and Open Balance.'],
       ['The menu shows "Download (PDF)" and "Download (CSV)".'],
       ["A PDF file downloads."],
       [f'{who.capitalize()} A\'s block ends with a row that reads "Total for " and {who} A\'s whole name exactly as typed, with its & " \' < > characters, '
        f"and the same Amount and Open Balance as that row on screen.",
        f"{who.capitalize()} A's name wraps inside that row: no part of it runs over the Amount or Open Balance figures or off the edge of the page.",
        f'{who.capitalize()} B\'s block ends with a row that reads "Total for " and {who} B\'s name, with the same Amount and Open Balance as that row on screen.',
        'The word "Subtotal" appears nowhere in the PDF.']],
      ["S3-R7b", "S3-R1", "S4-R1"], ["ARC" if rep == "A/R Collection" else "APU"], NO_PDF)

# ============================== S5-R10b: the PDF and CSV print the picked day after today ==============================
V("S5-43", "S5", "A/R Detail: the PDF and CSV print an as-of date after today",
  [ADMIN, "Have a customer, customer A, with an open invoice dated today, so the exports have a row.", W1440, OPEN("A/R Detail"),
   "Leave the report with only customer A ticked in the Customer filter."],
  ['Click the date chip ("As of: " and today\'s date).',
   "Pick the last day of next month in the calendar.",
   'Click the ⋯ Export button ("Export report") at the right of the title row.',
   'Click "Download (PDF)".',
   "Open the downloaded PDF.",
   'Click the ⋯ Export button ("Export report") again.',
   'Click "Download (CSV)".',
   "Open the downloaded CSV file in a spreadsheet program."],
  [["A calendar opens with today's date selected."],
   ['The chip reads "As of: " and the last day of next month.', "The report reloads for that day, and customer A's invoice is still listed."],
   ['The menu shows "Download (PDF)" and "Download (CSV)".'],
   ["A PDF file downloads."],
   ['The as-of line reads "As of " and the last day of next month: three-letter month, day, four-digit year (for example "As of Dec 31, 2026"), not today\'s date.',
    "Customer A's invoice is in the PDF."],
   ['The menu shows "Download (PDF)" and "Download (CSV)".'],
   ["A CSV file downloads."],
   ['The as-of line reads "As of: " and the same day (for example "As of: Dec 31, 2026"), not today\'s date.', "Customer A's invoice is in the CSV."]],
  ["S5-R10b", "S3-R4", "S3-R1"], ["ARD"], NO_DATE)

# ============================== S5-E3 (v12): the new list holds one location, so the chip is hidden ==============================
V("S5-41b", "S5", "A/R Detail: a new as-of date with one location left hides the chip",
  [ADMIN, "Have open documents in A/R Detail on today's date at two locations, location A and location B.",
   "Pick an earlier date, date A, on which all of the organization's open A/R documents were at location A.",
   W1440, OPEN("A/R Detail")],
  ["In the Location menu, untick location A.",
   "Change the as-of date to date A."],
  [['The chip reads "Location: " and location B\'s name.'],
   ["The report reloads for date A.", "Rows from location A are listed: location B is not in the list for date A, so the filter returns to every location.",
    "The Location chip is not shown: the list for date A holds only location A."]],
  ["S5-E3", "S5-N1"], ["ARD"], "The design pictures the Location chip but not a date whose list holds one location (all 7 boards checked); the case follows the PRD.")

# ============================== SV-12723 (QA lead, 14 Nov 2026: "Apply on top, + SV-12723 (Recommended)"): S2-R6 on the Summaries ==============================
# SV-12723 (Ready for Production, read 14 Nov 2026): on A/R Aging Summary an empty bucket cell sorted as $0, between the negatives and the positives. S2-R6 (v13,
# unchanged since v11) puts a blank at the bottom in both directions; no case covered empty bucket cells on the Summaries (our S2-R6 cases cover vendor credits on
# A/P Unpaid Invoices and A/P Detail). Line 9 of the design checklist: the empty-cell row carries a long name with spaces and & " ' < >. Line 10: the column
# headings are compared with a screenshot before and after each sort.
SAME13 = "Every column heading is in the same place as in your screenshot: none has moved left or right."
for key, rep, who, pos, neg, empty in (
        ("S2-51", "A/R Summary", "customer", "one invoice of $100.00 that is 10 days past due on today's date",
         "one unused credit memo of $50.00 dated 10 days ago", "one invoice dated today that is not yet due"),
        ("S2-52", "A/P Summary", "vendor", "one unpaid bill of $100.00 that is 10 days past due on today's date",
         "one unused vendor credit of $50.00 dated 10 days ago", "one unpaid bill dated today that is not yet due")):
    W_ = who.capitalize()
    V(key, "S2", f"{rep}: a blank bucket cell stays at the bottom in both sort orders",
      [ADMIN,
       f"Create, for this test, a {who}, {who} A, with {pos}, so its \"1-30 Days\" cell reads $100.00.",
       f"Create, for this test, a {who}, {who} B, with {neg}, so its \"1-30 Days\" cell reads $-50.00.",
       f"Create, for this test, a {who}, {who} C, {SPECIAL}, with {empty}, so its \"1-30 Days\" cell is blank.",
       W1440, OPEN(rep), f"Leave the report with only {who} A, {who} B and {who} C ticked in the {W_} filter."],
      ["Take a screenshot of the page, showing the column headings.",
       'Click the "1-30 Days" header.',
       'Click the "1-30 Days" header again.'],
      [[f"{W_} A's \"1-30 Days\" cell reads $100.00, {who} B's reads $-50.00 and {who} C's is blank.",
        f"{W_} C's whole name shows exactly as typed, with its & \" ' < > characters, and wraps inside its own cell without running into the next column."],
       [f"The rows read {who} A ($100.00), then {who} B ($-50.00), then {who} C (blank) at the bottom: largest first, the blank cell last.", SAME13],
       [f"The rows read {who} B ($-50.00), then {who} A ($100.00), then {who} C (blank), still at the bottom.", SAME13]],
      ["S2-R6", "S2-R2"], ["ARS" if rep == "A/R Summary" else "APS"],
      "The design pictures the Summaries sorted by name only; it draws no blank bucket cell sorted (all 7 boards checked, design version of 5 Nov 2026); the case follows the PRD.")
