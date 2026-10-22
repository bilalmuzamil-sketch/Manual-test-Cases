"""Release day and what must not change (Rule 96: an upgrade of six existing reports; what the PRD does not change must not change).
Every line of "What changes for existing users" is covered here or by the story case that tests it (named in REPORT.md); "Out of Scope"
lines are must-not-change checks where testable; the unchanged statements (permissions, organization-wide numbers, money display,
column names other than Location, the location switcher, the other reports) each have a case. Cases that compare with the reports as
they were before the release need records and screenshots captured before the release is installed (marker PRE_REL)."""
from ar_lib import C, PRE_REL
from common import *
from po_questions import QN

ORDER = {"n": 0}
def nk():
    ORDER["n"] += 1; return f"REL-{ORDER['n']:02d}"
J597 = ("Jira SV-11597, Check", "Inventory Value, Sales By Customer and Work In Progress: filters, links shared from the address bar, and CSV/PDF exports behave exactly as before.")
J597b = ("Jira SV-11597, Check", "A work order opened from a link at another location still asks to switch, and Cancel still returns to Work Orders with its message.")

for fam, codes in (("A/R", AR3), ("A/P", AP3)):
    k = nk(); steps, res = [], []
    for code in codes:
        n0 = len(steps); nm = R[code]["n"]
        steps += [f"Open {nm} from the Reports menu without touching any filter, and compare its rows, amounts and Totals with the screenshot of {nm} taken before the release."]
        res += [f"Step {n0+1}: the same {R[code]['parties'] if code in ('ARS','APS') else 'documents'} and the same amounts, shown the same way (same $ sign, commas, two decimals and credit format); only the order"
                + (" and, for customers with an overpaid invoice, the Totals row" if code == "ARS" else "") + " may differ."]
    steps += ["Read the Location chip on each report."]
    res += [f"Step {len(steps)}: \"Location: All locations\" on all three: an untouched report is the organization-wide report it was before."]
    C(k, "REL", f"On release day an untouched {fam} report shows the same rows and amounts",
      [ADMIN(), TWO_LOC, (f"Before the release was installed, you took screenshots (and, for {fam}, any print or export there was) of the three {fam} reports for {{Date-A}}, untouched.",
                          "For example: {Date-A} is the day before the release."),
       f"Starting screen: the release is installed; Reports > Finance is open in a desktop browser window 1440 px wide, with {{Date-A}} chosen as the as-of date on each report as you open it."],
      steps, res, ["WC-10", "S5-R5", "KD-ORG"], reports=codes, marker=PRE_REL,
      note="A customer with an overpaid invoice may show a different A/R Summary Totals row after the release; the PRD names this as a change (16 invoices across 13 customer accounts in production).")

k = nk()
C(k, "REL", "A/R PDF prints the as-of date you picked, late in the day too",
  [ADMIN(), ("Customer {Customer-A} has open invoices on today's date.", f"For example: {{Customer-A}} is {ex(k, 'Evening Print')[0]}."),
   ("The test is run in the evening, after 7 pm your local time, when the date in UTC is already tomorrow.", None),
   START("ARD")],
  ["Check that the date chip shows today's date.", "Choose \"Download (PDF)\" from the ⋯ menu.", "Read the as-of line of the PDF.", "Compare the PDF's row order with the screen."],
  ["Step 1: \"As of: \" and today's date.", "Step 2: the PDF downloads (A/R has an Export menu, no Print button).",
   "Step 3: \"As of \" and today's date in the three-letter month form, not tomorrow's date.",
   "Step 4: the PDF prints the on-screen order."],
  ["WC-3", "S3-R4", "S3-R3"])

k = nk()
C(k, "REL", "Reports page access alone opens and exports all six reports with amounts",
  [('You are signed in as {User-B}, whose custom role has "Reports → Page Access" and nothing else, with "See Financial Data" off.',
    f"For example: {{User-B}} is {ex(k, 'Reports Only')[0]} with the custom role {ex(k, 'Reports Only Role')[0]}."),
   ("Each of the six reports has open documents on today's date.", None), "Starting screen: the ShopView home page in a desktop browser window 1440 px wide."],
  ["Open Reports > Finance and read the list.", "Open A/R Summary and read the amounts.", "Download its PDF from the ⋯ menu.",
   "Open A/P Detail and expand a bucket.", "Download its CSV from the ⋯ menu.",
   "Open A/R Detail, A/R Collection, A/P Summary and A/P Unpaid Invoices in turn."],
  ["Step 1: all six reports are offered.", "Step 2: the amounts show: \"See Financial Data\" off does not hide them.", "Step 3: the PDF downloads.",
   "Step 4: the amounts show.", "Step 5: the CSV downloads.", "Step 6: each opens with its amounts; no setting had to be changed after the release."],
  ["KD-PERM", "GOAL-ACCESS", "S1-N1"],
  reports=["ARS", "ARD", "ARC", "APS", "APD", "APU"])

k = nk()
C(k, "REL", "Inventory Value, Sales By Customer and Work In Progress work as before",
  [ADMIN(), TWO_LOC, ("Before the release was installed, you saved each of the three reports' PDF and CSV for {Date-A} with one location ticked, and copied a link to each with that filter.",
                      "For example: {Date-A} is the day before the release."),
   "Starting screen: the release is installed; Reports > Finance is open in a desktop browser window 1440 px wide."],
  ["Open the Inventory Value link saved before the release.", "Download its PDF and CSV and compare them with the saved files.",
   "Open the Sales By Customer link saved before the release.", "Download its PDF and CSV and compare them with the saved files.",
   "Open the Work In Progress link saved before the release.", "Download its PDF and CSV and compare them with the saved files."],
  ["Step 1: Inventory Value opens with the same filter ticked as before.", "Step 2: the same rows, amounts and layout as the saved files.",
   "Step 3: Sales By Customer opens with the same filter ticked.", "Step 4: the same as the saved files.",
   "Step 5: Work In Progress opens with the same filter ticked.", "Step 6: the same as the saved files."],
  ["KD-REUSE", J597], stories=[5, 3], marker=PRE_REL,
  note="Why: the reports reuse the native chips, totals row and export of these three reports, so a change made for the aging reports could reach them (Rule 96, shared component).")

k = nk()
C(k, "REL", "Other reports keep their own export error message",
  [ADMIN(), ("Before the release was installed, you noted the message Sales By Customer shows when its CSV export fails because the computer is offline.", None),
   ("You can switch this computer's network connection off and on (for example Wi-Fi).", None),
   "Starting screen: the release is installed; Reports > Finance > Sales By Customer is open in a desktop browser window 1440 px wide."],
  ["Switch the network connection off.", "Choose \"Download (CSV)\" from the ⋯ menu.", "Read the message.", "Switch the network connection back on."],
  ["Step 1: the computer is offline.", "Step 2: the export fails.",
   "Step 3: the same message as before the release; not \"We couldn't export this report. Please try again.\", which is for the six aging reports only.",
   "Step 4: the connection is back."],
  ["EH", "UFS-8"], marker=PRE_REL)

k = nk()
C(k, "REL", "A work order link from another location still asks to switch",
  [ADMIN(), TWO_LOC, ("Work order {Work-order-1} was made at {Location-B}, and you have a link to it copied from the address bar.", "For example: {Work-order-1} is S2-41001."),
   "Starting screen: the release is installed; Work Orders is open at {Location-A} in a desktop browser window 1440 px wide."],
  ["Paste the link to {Work-order-1} into the address bar and press Enter.", "Click \"Cancel\".", "Read the page and any message."],
  ["Step 1: the existing switch-location prompt asks to switch to {Location-B}, as before the release.",
   "Step 2: the prompt closes.", "Step 3: you are on Work Orders, with its message, as before the release."],
  ["KD-REUSE", J597b], stories=[7])

k = nk()
C(k, "REL", "A credit dated on the as-of date stays in the same bucket as before",
  [ADMIN(), ("Customer {Customer-A} has an unused credit memo {Credit-memo-A} dated {Date-A}; before the release you noted which A/R Detail bucket it was in with {Date-A} as the as-of date.",
             f"For example: {{Customer-A}} is {ex(k, 'Same Day Credit')[0]}; {{Date-A}} is the day before the release."),
   START("ARD", ", with {Date-A} as the as-of date and {Customer-A} ticked")],
  ["Expand every bucket and find {Credit-memo-A}."],
  ["Step 1: it is in the same bucket as before the release (today that is \"1-30 days past due\"): this release does not change how credits are aged."],
  ["OOS-4"], stories=[1],
  marker=f"AUTOMATION: HOLD - waiting on the PO (question {QN['credit-asof']}: keep a must-not-change check for SV-11441)")

k = nk()
C(k, "REL", "The research ideas left out of this release do not appear",
  [ADMIN(), ("The three A/R reports have open documents on today's date.", None), "Starting screen: Reports > Finance in a desktop browser window 1440 px wide."],
  ["Open A/R Summary and read its filter row, its columns and the ⋯ menu.", "Open A/R Collection and expand a customer group.", "Open A/R Detail and read its filter row."],
  ["Step 1: no aging-period setting (the buckets are 30 days), no salesperson or Parts vs Service filter, no Last payment date or Credit limit column, no Send statement action.",
   "Step 2: no collection notes or follow-up log, and no Send statement action.",
   "Step 3: no aging-period setting and no salesperson or Parts vs Service filter."],
  ["OOS-4"], stories=[5], reports=["ARS", "ARC", "ARD"])

k = nk()
C(k, "REL", "The location switcher in the top right is unchanged",
  [ADMIN(), TWO_LOC, ("Before the release was installed, you took a screenshot of the open location switcher.", None), START("ARS")],
  ["Open the location switcher in the top right of ShopView.", "Compare it with the screenshot.", "Switch to {Location-B}."],
  ["Step 1: it opens.", "Step 2: it looks and lists the locations exactly as before the release.",
   "Step 3: it switches as it always has; A/R Summary reloads with the same filters and rows, in the opening order, at the top."],
  ["S7-E1", "OOS-8", "S5-E2"], marker=PRE_REL)
