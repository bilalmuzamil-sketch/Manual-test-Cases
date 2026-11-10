"""New cases of the 10 Nov 2026 currency check (PRD version 11 of 5 Nov 2026; QA lead round 2, "Yes, both": add N-01 to N-25 in their
sections, keys continuing each section's numbering). ASSESSMENT.md section 4 lists them; every expected result comes from a PRD v11
sentence quoted word for word (Rule 113); DATA cases carry exact amounts (Rule 116); one action per step (Rule 135); every precondition
is used or says why (Rule 137).

Each case is written once, in the tester's words (the QA lead's pattern, Rule 117 fourteenth and fifteenth amendments); the case model
(placeholders and "For example:" lines, for the setup file for Claude sessions) is made from it by turning the plain record names
("customer A", "credit memo A", "location B", "date A") into placeholders, and the tester's words are set by v11_layout.LAYOUT."""
import re
from ar_lib import C, PRE_REL, CASES
from common import LOC_A, LOC_B
import v11_layout as V11

_KINDS = [("vendor credit", "Vendor-credit"), ("credit memo", "Credit-memo"), ("customer", "Customer"), ("vendor", "Vendor"),
          ("invoice", "Invoice"), ("bill", "Bill"), ("deposit", "Deposit"), ("location", "Location"), ("date", "Date"), ("bucket", "Bucket")]
_PH = re.compile(r"\b(" + "|".join(k for k, _ in _KINDS) + r") ([A-F])\b", re.I)
def ph(s):
    """Plain names -> placeholders for the case model ("customer A" -> "{Customer-A}")."""
    return _PH.sub(lambda m: "{" + dict(_KINDS)[m.group(1).lower()] + "-" + m.group(2) + "}", s)

HOLD_Q18 = "AUTOMATION: HOLD - waiting on the PO (question 18)"
NEW = {}
CREDIT_WHY = ("The design's pictures were taken before this rule: they show Transaction Type \"Credit\" for every credit (DD-07 below); the case follows "
              "the PRD.")
def N(key, sec, title, pre, steps, res, q, reports, ex=None, marker=None, note="", stories=None, dcodes=("S1-R5a",), design=None):
    """pre: the tester's bullets; ex: {bullet index: "For example: ..."} for the setup file; res: one list of bullets per step."""
    assert len(res) == len(steps), key
    ex = ex or {}
    model_pre = [(ph(p), ph(ex[i]) if i in ex else None) for i, p in enumerate(pre)]
    model_res = [f"Step {i}: " + ph(" ".join(r)) for i, r in enumerate(res, 1)]
    # the design (pictures of 19-23 Oct 2026) draws none of the v10/v11 rules: no picture is chosen for a new case (design_codes holds a
    # code no caption cites); the S2-R1b cases print DD-07, the difference the pictures show
    C(key, sec, title, model_pre, [ph(s) for s in steps], model_res, q, reports=reports, marker=marker, note=note, stories=stories,
      design_codes=list(dcodes), design=design)
    CASES[-1]["new_v11"] = True
    V11.LAYOUT[key] = dict(title=title, pre=list(pre), steps=list(steps), results=[list(r) for r in res])
    NEW[key] = title

ADMIN = 'Sign in as an Admin user (the "Admin" role).'
W1440 = "Use a desktop browser window 1440 px wide."
def OPEN(name):
    menu = {"A/R Summary": ("A/R Aging Summary", "ACCOUNTS RECEIVABLE"), "A/R Detail": ("A/R Aging Detail", "ACCOUNTS RECEIVABLE"),
            "A/R Collection": ("A/R Aging Collection", "ACCOUNTS RECEIVABLE"), "A/P Summary": ("A/P Aging Summary", "ACCOUNTS PAYABLE"),
            "A/P Detail": ("A/P Aging Detail", "ACCOUNTS PAYABLE"), "A/P Unpaid Invoices": ("A/P Unpaid Invoices", "ACCOUNTS PAYABLE")}[name]
    t = '; the page title reads "A/P Unpaid Invoices Report"' if name == "A/P Unpaid Invoices" else ""
    return f'Open {name} (Reports, then "{menu[0]}" under {menu[1]} in the left menu{t}).'
TWO_LOC = "Have open documents in these reports at two locations, location A and location B, with location A's name first in A to Z order."
EX_LOC2 = f"For example: location A is {LOC_A} and location B is {LOC_B}."
def EXU(key, kind, name):
    return f"For example: the {kind} is ZZAUTOTEST {key} {name}."
def EXN(key, kind, *names):
    return "For example: " + ", ".join(f"{kind} {chr(65 + i)} is ZZAUTOTEST {key} {n}" for i, n in enumerate(names)) + "."

# ================================ S1: a credit dated on the as-of date is Current (S1-R5a) =================================
N("S1-17", "S1", "A/R Detail: a credit memo or deposit dated on the as-of date is in Current",
  [ADMIN,
   "Have a customer with an unused credit memo, credit memo A, and an unused deposit, deposit A, both dated the same earlier day, date A.",
   W1440, OPEN("A/R Detail"), "Leave the report with only that customer ticked in the Customer filter."],
  ["Change the as-of date to date A.", 'Expand the "Current" bucket.', "Change the as-of date to the day after date A.",
   'Expand the "1-30 days past due" bucket.'],
  [["The report reloads for date A."],
   ["Credit memo A and deposit A are listed in this bucket: a credit dated exactly on the as-of date is Current."],
   ["The report reloads for the day after date A, with every bucket collapsed."],
   ['Credit memo A and deposit A are now listed here, one day past their own date, and no longer in "Current".']],
  ["S1-R5a", "S1-R5", "S4-N1"], ["ARD"], ex={1: EXU("S1-17", "customer", "Credit Holder")})

N("S1-18", "S1", "A/P Detail: a vendor credit dated on the as-of date is Current, Past Due 0",
  [ADMIN, "Have a vendor with an unused vendor credit, vendor credit A, dated an earlier day, date A.",
   W1440, OPEN("A/P Detail"), "Leave the report with only that vendor ticked in the Vendor filter."],
  ["Change the as-of date to date A.", 'Expand the "Current" bucket.', "Change the as-of date to the day after date A.",
   'Expand the "1-30 days past due" bucket.'],
  [["The report reloads for date A."],
   ["Vendor credit A is listed in this bucket.", "Its Due Date is date A, its own date.", "Its Past Due reads 0."],
   ["The report reloads for the day after date A, with every bucket collapsed."],
   ['Vendor credit A is now listed here, with Past Due 1, and no longer in "Current".']],
  ["S1-R5a", "S2-R6", "S4-N1", ("Tech plan §6 Phase 4, backend", "A/P vendor credit due date = its own date (S2-R6 note); credits never Current")],
  ["APD"], ex={1: EXU("S1-18", "vendor", "Credit Supply")},
  note=("Where the tech plan differs: the tech plan (21 Oct 2026) says credits are never Current; PRD version 11 (S1-R5a, 4 and 5 Nov 2026) puts "
        "a credit dated exactly on the as-of date in Current with Past Due 0. This case follows the PRD."))

N("S1-19", "S1", "A/R Collection: a credit dated on the as-of date shows Past Due 0",
  [ADMIN, "Have a customer, customer A, with an unused credit memo, credit memo A, dated an earlier day, date A.",
   W1440, OPEN("A/R Collection"), "Leave the report with only customer A ticked in the Customer filter."],
  ["Change the as-of date to date A.", "Expand customer A's group.", "Change the as-of date to the day after date A.", "Expand customer A's group."],
  [["The report reloads for date A."],
   ["Credit memo A is listed.", "Its Due Date is date A, its own date.", "Its Past Due reads 0."],
   ["The report reloads for the day after date A, with every group collapsed."],
   ["Credit memo A is listed with Past Due 1."]],
  ["S1-R5a", "S4-N1"], ["ARC"], ex={1: EXN("S1-19", "customer", "Credit Caller")})

N("S1-20", "S1", "A/P Detail: a bill not yet due shows a negative Past Due",
  [ADMIN, "Have a vendor with two unpaid bills on today's date: bill A due 9 days after today and bill B due today.",
   W1440, OPEN("A/P Detail"), "Leave the report with only that vendor ticked in the Vendor filter."],
  ['Expand the "Current" bucket.'],
  [["Bill A and bill B are both listed in this bucket: a bill is Current when its due date is on or after the as-of date.",
    "Bill A's Past Due reads -9.", "Bill B's Past Due reads 0."]],
  ["S1-R5a", "S1-R5"], ["APD"], ex={1: EXU("S1-20", "vendor", "Future Bills")})

N("S1-21", "S1", "A/R Collection: a customer with over 100 documents loads 100 at a time",
  [ADMIN, "Have a customer, customer A, with more than 100 overdue invoices on today's date.", W1440, OPEN("A/R Collection"),
   "Leave the report with only customer A ticked in the Customer filter."],
  ["Read the count in brackets after customer A's name.", "Expand customer A's group.", "Scroll down to the end of customer A's invoices.",
   "Keep scrolling until no more invoices load."],
  [["The count is the number of customer A's overdue invoices, more than 100."],
   ["The group opens with its first 100 invoices."],
   ["The next invoices load under the first 100, up to 100 more each time."],
   ["Every invoice is listed once: the number of rows equals the count in brackets, and no invoice number is repeated."]],
  ["S1-R8"], ["ARC"], ex={1: "For example: customer A is a QA organization customer with 150 overdue invoices."})

N("S1-22", "S1", "A/P Unpaid Invoices: a vendor with over 100 bills loads 100 at a time",
  [ADMIN, "Have a vendor, vendor A, with more than 100 unpaid bills on today's date.", W1440, OPEN("A/P Unpaid Invoices"),
   "Leave the report with only vendor A ticked in the Vendor filter."],
  ["Read the count in brackets after vendor A's name.", "Expand vendor A's group.", "Scroll down to the end of vendor A's bills.",
   "Keep scrolling until no more bills load."],
  [["The count is the number of vendor A's unpaid bills, more than 100."],
   ["The group opens with its first 100 bills."],
   ["The next bills load under the first 100, up to 100 more each time."],
   ["Every bill is listed once: the number of rows equals the count in brackets, and no bill number is repeated."]],
  ["S1-R8"], ["APU"], ex={1: "For example: vendor A is the QA organization vendor with more than 2,000 unpaid bills."})

# ================================ S2: plain dates, credit names, the Location sort falling back =============================
for key, name, doc, party, rep in [("S2-43", "A/R Detail", "invoice", "customer", "ARD"), ("S2-44", "A/P Detail", "bill", "vendor", "APD")]:
    D = doc.capitalize(); P = party.capitalize()
    N(key, "S2", f"{name}: Date and Due Date read as dates, never Today or Yesterday",
      [ADMIN, f"Have a {party} with three open {doc}s, each due 30 days after its own date: {doc} A dated today, {doc} B dated yesterday and {doc} C dated 2 days ago.",
       W1440, OPEN(name), f"Leave the report with only that {party} ticked in the {P} filter."],
      ['Expand the "Current" bucket.'],
      [[f"{D} A, {D.lower()} B and {D.lower()} C are listed.",
        f"Their Date cells read today's date, yesterday's date and the date of 2 days ago as month, day and year (for example \"Nov 10, 2026\").",
        f"Their Due Date cells read dates in the same form.",
        'No Date or Due Date cell reads "Today", "Yesterday" or "2 days ago".']],
      ["S2-R1a", "WC-13"], [rep], ex={1: EXU(key, party, "Plain Dates")})

N("S2-45", "S2", "A/R Detail: Transaction Type names Credit Memo and Deposit and sorts them",
  [ADMIN, ("Have a customer with an open invoice A, an unused credit memo A and an unused deposit A, all dated 10 days ago, "
           'with invoice A due the same day, so all three sit in the "1-30 days past due" bucket.'),
   W1440, OPEN("A/R Detail"), "Leave the report with only that customer ticked in the Customer filter."],
  ['Expand the "1-30 days past due" bucket.', 'Click the "Transaction Type" header.', 'Click the "Transaction Type" header again.'],
  [['Invoice A reads "Invoice", credit memo A reads "Credit Memo" and deposit A reads "Deposit" under Transaction Type.', 'No row reads "Credit".'],
   ["The rows sort A to Z by these names: credit memo A, then deposit A, then invoice A."],
   ["The order reverses: invoice A, then deposit A, then credit memo A."]],
  ["S2-R1b", "S2-R2", "WC-14"], ["ARD"], dcodes=("S2-R1b",), design=dict(why=CREDIT_WHY), ex={1: EXU("S2-45", "customer", "Credit Names")})

N("S2-46", "S2", "A/P Detail: Transaction Type names Vendor Credit and sorts it after Invoice",
  [ADMIN, ('Have a vendor with an unpaid bill A and an unused vendor credit A, both dated 10 days ago, with bill A due the same day, '
           'so both sit in the "1-30 days past due" bucket.'),
   W1440, OPEN("A/P Detail"), "Leave the report with only that vendor ticked in the Vendor filter."],
  ['Expand the "1-30 days past due" bucket.', 'Click the "Transaction Type" header.', 'Click the "Transaction Type" header again.'],
  [['Bill A reads "Invoice" and vendor credit A reads "Vendor Credit" under Transaction Type.', 'No row reads "Credit".'],
   ["The rows sort A to Z by these names: bill A (Invoice), then vendor credit A (Vendor Credit)."],
   ["The order reverses: vendor credit A, then bill A."]],
  ["S2-R1b", "S2-R2", "WC-14"], ["APD"], dcodes=("S2-R1b",), design=dict(why=CREDIT_WHY), ex={1: EXU("S2-46", "vendor", "Credit Names")})

N("S2-47", "S2", "A/R Detail: the PDF and CSV name each credit as the screen does",
  [ADMIN, "Have a customer with an open invoice A, an unused credit memo A and an unused deposit A.",
   W1440, OPEN("A/R Detail"), "Leave the report with only that customer ticked in the Customer filter."],
  ['Choose "Download (PDF)" from the ⋯ menu.', "Open the PDF and read the Transaction Type of each row.", 'Choose "Download (CSV)" from the ⋯ menu.',
   'Open the CSV and read its "Transaction Type" column.'],
  [["The PDF downloads."],
   ['Invoice A reads "Invoice", credit memo A "Credit Memo" and deposit A "Deposit".', 'No row reads "Credit".'],
   ["The CSV downloads."],
   ['Invoice A reads "Invoice", credit memo A "Credit Memo" and deposit A "Deposit", the same as the PDF.', 'No row reads "Credit".']],
  ["S2-R1b", "S3-R3"], ["ARD"], dcodes=("S2-R1b",), design=dict(why=CREDIT_WHY), ex={1: EXU("S2-47", "customer", "Credit Export")})

N("S2-48", "S2", "A/R Summary: a Location sort returns to name order when one location is left",
  [ADMIN, TWO_LOC,
   ("Have three customers with open invoices on today's date: customer A only at location B, customer B only at location A and customer C only "
    "at location A, their names in A to Z order A, B, C."),
   W1440, OPEN("A/R Summary")],
  ['Click the "Location" header.', "In the Location menu, untick location B."],
  [['"Location" is marked as the sorted column (a small arrow beside its heading).', "Customer B and customer C (location A) are above customer A (location B)."],
   ["The Location column is no longer shown.", "Customer A is no longer listed.",
    "The customer name column (the first column) is marked as the sorted column again: the report is back in its opening order, customer B then customer C."]],
  ["S2-R7a", "S2-R7", "S6-R2", "S1-R7"], ["ARS"], ex={1: EX_LOC2, 2: EXN("S2-48", "customer", "Alpha", "Bravo", "Charlie")})

N("S2-49", "S2", "A/R Collection: a Location sort returns to Date order when one location is left",
  [ADMIN, TWO_LOC,
   ("Have a customer, customer A, with three overdue invoices: invoice A at location B dated 40 days ago, invoice B at location A dated 20 days ago "
    "and invoice C at location A dated 30 days ago."),
   W1440, OPEN("A/R Collection"), "Leave the report with only customer A ticked in the Customer filter."],
  ["Expand customer A's group.", 'Click the "Location" header.', "In the Location menu, untick location B.", "Expand customer A's group."],
  [["Invoice A, invoice C and invoice B are listed, oldest date first."],
   ['"Location" is marked as the sorted column (a small arrow beside its heading).', "Invoice B and invoice C (location A) are above invoice A (location B)."],
   ["The Location column is no longer shown.", "Every group is collapsed.",
    '"Date" is marked as the sorted column again: the report is back in its opening order.'],
   ["Invoice C (30 days ago) is above invoice B (20 days ago): oldest date first.", "Invoice A is no longer listed."]],
  ["S2-R7a", "S1-R6", "S1-R7", "S6-R2", "S4-N1"], ["ARC"], ex={1: EX_LOC2, 2: EXN("S2-49", "customer", "Date Order")})

N("S2-50", "S2", "A/R Summary: a Location sort falls back when a new date leaves one location",
  [ADMIN, "Have open documents in these reports at two locations, location A and location B, so the Location column shows.", "Pick an earlier date, date A, on which all of the organization's open A/R documents were at location A.", W1440, OPEN("A/R Summary")],
  ['Click the "Location" header.', "Change the as-of date to date A."],
  [['"Location" is marked as the sorted column (a small arrow beside its heading).'],
   ["The report reloads for date A.", "The Location column is no longer shown: only location A is in the list.",
    "The customer name column (the first column) is marked as the sorted column: the report is back in its opening order."]],
  ["S2-R7a", "S6-R2", "S1-R7"], ["ARS"], ex={1: EX_LOC2})

# ================================ S3: the PDF format (S3-R7a) ===============================================================
N("S3-31", "S3", "A/R Detail: the PDF prints a credit's amount in brackets with a minus sign",
  [ADMIN, "Have a customer with only an unused credit memo, credit memo A, of $150.00.", W1440, OPEN("A/R Detail"),
   "Leave the report with only that customer ticked in the Customer filter."],
  ["Expand the bucket that holds credit memo A.", 'Choose "Download (PDF)" from the ⋯ menu.', "Open the PDF and read credit memo A's row."],
  [['Credit memo A\'s Amount and Open Balance read "$-150.00".'],
   ["The PDF downloads."],
   ['Credit memo A\'s Amount and Open Balance print as "(-$150.00)": in brackets, with the minus sign before the dollar sign.']],
  ["S3-R7a"], ["ARD"], ex={1: EXU("S3-31", "customer", "Bracket Credit")})

N("S3-32", "S3", "A/R Detail: the PDF prints dates as month, two-digit day and year",
  [ADMIN, "Pick an earlier date, date A, from the 1st to the 9th of a month.",
   "Have a customer with an open invoice, invoice A, dated date A and due 30 days later.", W1440, OPEN("A/R Detail"),
   "Leave the report with only that customer ticked in the Customer filter."],
  ["Change the as-of date to date A.", 'Expand the "Current" bucket.', 'Choose "Download (PDF)" from the ⋯ menu.',
   "Open the PDF and read its top lines and invoice A's row."],
  [["The report reloads for date A."],
   ['Invoice A\'s Date reads date A as month, day and year (for example "Nov 4, 2026").'],
   ["The PDF downloads."],
   ['Invoice A\'s Date and Due Date print as three-letter month, two-digit day and year with no comma (for example "Nov 04 2026").',
    'The top line reads "As of " and date A; its exact form for a day before the 10th waits on the product owner\'s answer.']],
  ["S3-R7a", "S3-R4", "S2-R1a"], ["ARD"], marker=HOLD_Q18, ex={2: EXU("S3-32", "customer", "Early Day")},
  note=("Held: the PDF's top line for a day before the 10th (\"As of Nov 4, 2026\" or \"As of Nov 04, 2026\" or \"As of Nov 04 2026\") is question 18 "
        "on Chris Ward's sheet, not sent yet (added 10 Nov 2026); this case stays out of the test run until he answers."))

# ================================ S4: a bucket that fails to load (Story 4 Error Handling) ==================================
N("S4-22", "S4", "A/R Detail: a bucket that cannot load its lines says so",
  [ADMIN, "Make sure you can switch this computer's network connection off and on (such as Wi-Fi).",
   'Have a customer with an open invoice not yet due on today\'s date, so the "Current" bucket has lines.', W1440, OPEN("A/R Detail")],
  ["Switch the computer's network connection off.", 'Expand the "Current" bucket.', "Switch the network back on.",
   'Collapse the "Current" bucket.', 'Expand the "Current" bucket.'],
  [["The computer is offline."],
   ['In place of its lines the bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again."'],
   ["The computer is online again."],
   ["The bucket collapses."],
   ["Its lines load and the invoice is listed; the message is gone."]],
  ["EH4-1", "UFS-11"], ["ARD"])

N("S4-23", "S4", "A/P Detail: lines that stop loading while scrolling leave a message",
  [ADMIN, "Make sure you can switch this computer's network connection off and on (such as Wi-Fi).",
   "Have a bucket, bucket A, with more than 100 lines on today's date, so its later lines load as you scroll.", W1440, OPEN("A/P Detail")],
  ["Expand bucket A.", "Switch the computer's network connection off.", "Scroll down to the end of bucket A's lines.", "Switch the network back on.",
   "Collapse bucket A.", "Expand bucket A."],
  [["Bucket A opens with its first 100 lines."],
   ["The computer is offline."],
   ['The 100 lines already shown stay, and under them the bucket shows "Not every line loaded. Collapse and expand this bucket to try again."'],
   ["The computer is online again."],
   ["Bucket A collapses."],
   ["Bucket A opens with its first 100 lines again, with no message."]],
  ["EH4-2", "UFS-12", "S4-R4"], ["APD"],
  ex={2: 'For example: bucket A is "91 or more days past due" on the QA organization, which has thousands of open A/P lines.'})

# ================================ S5: a new as-of date and the ticked locations (S5-E3) =====================================
THREE = ("Have open documents in A/R Detail on today's date at three locations, location A, location B and location C.")
EX_LOC3 = f"For example: location A is {LOC_A}, location B is {LOC_B} and location C is a third staging location."
DATE_C = "Pick an earlier date, date A, on which location A and location B had open documents in A/R Detail and location C had none."
N("S5-40", "S5", "A/R Detail: a new as-of date keeps the ticked locations still in the list",
  [ADMIN, THREE, DATE_C, W1440, OPEN("A/R Detail")],
  ["In the Location menu, untick location B.", "Change the as-of date to date A.", "Open the Location menu."],
  [['The chip reads "Location: 2 locations" (location A and location C ticked).'],
   ["The report reloads for date A.", 'The chip reads "Location: " and location A\'s name: location C is not in the list for date A, so only location A stays ticked.'],
   ["Location A is ticked.", "Location B is listed and not ticked.", "Location C is not listed."]],
  ["S5-E3", "S5-R3", "S5-R6"], ["ARD"], ex={1: EX_LOC3})

N("S5-41", "S5", "A/R Detail: a new as-of date with no ticked location left returns to All",
  [ADMIN, THREE, DATE_C, W1440, OPEN("A/R Detail")],
  ["In the Location menu, untick location A.", "Untick location B.", "Change the as-of date to date A."],
  [['The chip reads "Location: 2 locations".'],
   ['The chip reads "Location: " and location C\'s name.'],
   ["The report reloads for date A.", 'The chip reads "Location: All locations": location C is not in the list for date A, so the filter returns to every location.',
    "Rows from location A and location B are listed."]],
  ["S5-E3", "S5-R6"], ["ARD"], ex={1: EX_LOC3})

N("S5-42", "S5", "A/R Detail: No locations stays No locations after a new as-of date",
  [ADMIN, "Have open documents in these reports at two locations, so the Location menu lists two.", "Pick an earlier date, date A, on which both locations had open documents in A/R Detail.", W1440, OPEN("A/R Detail")],
  ['In the Location menu, click "Clear selection".', "Close the menu.", "Change the as-of date to date A."],
  [["No location is ticked."],
   ['The chip reads "Location: No locations".', 'The table shows "No record matches these filters".'],
   ["The date chip shows date A.", 'The Location chip still reads "Location: No locations" and the table still shows "No record matches these filters".']],
  ["S5-E3", "S5-R6", "S5-R6a"], ["ARD"], ex={1: f"For example: the two locations are {LOC_A} and {LOC_B}."})

# ================================ DATA: exact amounts (Rule 116) ============================================================
N("DATA-25", "DATA", "A/R Summary and Detail count a credit dated on the as-of date in Current",
  [ADMIN, ("Have a new customer (created for this test), customer A, with only these open documents on today's date: an invoice A of $500.00, "
           "20 days past due, and an unused credit memo A of $120.00 dated today."),
   W1440, OPEN("A/R Summary"), "Leave the report with only customer A ticked in the Customer filter."],
  ["Read customer A's row and the Totals row.", "Open A/R Detail from the Reports menu.", "In the Customer filter, tick customer A.",
   "Click the chevron button in the table's top-left header cell (Expand all)."],
  [["Current $-120.00 and 1-30 Days $500.00; 31-60 Days, 61-90 Days and 91 And Over are blank.",
    "Total $380.00 (500.00 − 120.00).", "The Totals row reads the same: Current $-120.00, 1-30 Days $500.00, Total $380.00."],
   ["A/R Detail opens on today's date."],
   ["Customer A is ticked."],
   ['"Current" holds credit memo A with an Open Balance of $-120.00.', '"1-30 days past due" holds invoice A with an Open Balance of $500.00.',
    "The Totals row's Open Balance reads $380.00: bucket by bucket the same as A/R Summary's Totals."]],
  ["S1-R5a", "S5-R18a", "S5-R18"], ["ARS", "ARD"], ex={1: EXN("DATA-25", "customer", "Exact Credit")})

N("DATA-26", "DATA", "A/P Summary and Detail count a vendor credit dated on the as-of date in Current",
  [ADMIN, ("Have a new vendor (created for this test), vendor A, with only these open documents on today's date: a bill A of $500.00, "
           "20 days past due, and an unused vendor credit A of $120.00 dated today."),
   W1440, OPEN("A/P Summary"), "Leave the report with only vendor A ticked in the Vendor filter."],
  ["Read vendor A's row and the Totals row.", "Open A/P Detail from the Reports menu.", "In the Vendor filter, tick vendor A.",
   "Click the chevron button in the table's top-left header cell (Expand all)."],
  [["Current $-120.00 and 1-30 Days $500.00; 31-60 Days, 61-90 Days and 91 And Over are blank.",
    "Total $380.00 (500.00 − 120.00).", "The Totals row reads the same: Current $-120.00, 1-30 Days $500.00, Total $380.00."],
   ["A/P Detail opens on today's date."],
   ["Vendor A is ticked."],
   ['"Current" holds vendor credit A with an Open Balance of $-120.00 and Past Due 0.', '"1-30 days past due" holds bill A with an Open Balance of $500.00.',
    "The Totals row's Open Balance reads $380.00: bucket by bucket the same as A/P Summary's Totals."]],
  ["S1-R5a", "S5-R18a", "S5-R18"], ["APS", "APD"], ex={1: EXN("DATA-26", "vendor", "Exact Credit")})

N("DATA-27", "DATA", "A/P Unpaid Invoices: 101 bills count and add up before all are shown",
  [ADMIN, "Have a new vendor (created for this test), vendor A, with exactly 101 unpaid bills of $10.00 each, all overdue on today's date.",
   W1440, OPEN("A/P Unpaid Invoices"), "Leave the report with only vendor A ticked in the Vendor filter."],
  ["Read vendor A's group row and the Totals row.", "Expand vendor A's group.", "Scroll down to the end of vendor A's bills.",
   'Choose "Download (CSV)" from the ⋯ menu.', "Open the CSV."],
  [["Vendor A's count reads 101.", "Its Amount and Open Balance read $1,010.00 (101 × $10.00).", "The Totals row's Open Balance reads $1,010.00."],
   ["The group opens with its first 100 bills.", "The Totals row still reads $1,010.00: it covers all 101 bills, not only those shown."],
   ["The 101st bill loads, and every bill is listed once."],
   ["The CSV downloads."],
   ["It has 101 bill rows and one Totals row reading 1010.00."]],
  ["S1-R8", "S5-R18", "S3-R8"], ["APU"], ex={1: EXN("DATA-27", "vendor", "Hundred And One")})

# ================================ REL: release day (section 2, S1-R5a) ======================================================
N("REL-14", "REL", "A credit dated on the as-of date moves from 1-30 to Current",
  [ADMIN, "Have a customer with an unused credit memo, credit memo A, dated a day before the release, date A.",
   'Make sure that before the release was installed, you noted that A/R Detail with date A as the as-of date showed credit memo A in "1-30 days past due".',
   W1440, "After the release is installed, " + OPEN("A/R Detail")[0].lower() + OPEN("A/R Detail")[1:],
   "Leave the report with date A as the as-of date and only that customer ticked in the Customer filter."],
  ["Expand every bucket and find credit memo A."],
  [['With date A as the as-of date, credit memo A is in "Current", not in "1-30 days past due" as before the release: from this release a credit dated exactly on the as-of date is Current.']],
  ["WC-12", "S1-R5a"], ["ARD"], marker=PRE_REL, ex={1: EXU("REL-14", "customer", "Release Credit")})
