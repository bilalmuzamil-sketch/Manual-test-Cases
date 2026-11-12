"""Numbers across the documents, reports and books (Rule 116): one set of known amounts followed through every place that shows it —
the Close confirmation, the NO CHARGE document, the Internal Work Orders report and its summary strip, QuickBooks and AccountingHub —
and the technician figures between the report, Technician Efficiency and the dashboard. Each case computes the expected figure by
hand from seeded values."""
from iwo_lib import C
from common import *

S = "DATA"
SEED = iwo(1, "A", "Complete", ", with 2 stock parts at $40.00 ($80.00), one special-order part billed at $125.00, 2.0 labor hours and Shop supplies $15.00")

C("DATA-01", S, "Parts cost is the same in the confirmation, document, report and QuickBooks",
  [ADMIN, ON, QB, QB_VIEW, REVIEW_OFF, "Make sure General Internal is mapped to account X at the test location.", icust("A"), SEED.replace(" billed at $125.00", " billed at $125.00 after the work order was internal")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN, "Open Reports > Internal Work Orders.", "In QuickBooks Online, open the entries on account X for work order 1."],
  [["Work order 1 opens."], ['The confirmation shows "Stock parts $80.00" and "Special orders and sublet $125.00".'], ["The work order is Closed."],
   ['The document reads "Parts cost $205.00" ($80.00 + $125.00).'], ["Work order 1's row reads Parts cost $205.00."],
   ["Account X carries $80.00 from the Close and $125.00 from the bill: $205.00."]],
  ["S3-R2", "S3-R5", "S9-R2", "S7-R2", "S7-R3"])
C("DATA-02", S, "Shop supplies is the same on the work order, document, report and books",
  [ADMIN, ON, AH, REVIEW_OFF, icust("A"), SEED],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN, "Open Reports > Internal Work Orders.", "Open Accounting > Sales > Invoices."],
  [['"Shop supplies" reads $15.00.'], ['The confirmation shows "Shop supplies $15.00".'], ["The work order is Closed."], ['The document reads "Shop supplies $15.00".'],
   ["Work order 1's row reads Shop supplies $15.00."], ["Work order 1's Closed record shows Shop supplies $15.00."]],
  ["S10-R3", "S8-R1", "S9-R2"])
C("DATA-03", S, "Hours are the same on the lines, confirmation, document and report",
  [ADMIN, ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", ", with two labor lines of 1.5 and 0.75 hours")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, FIN, "Open Reports > Internal Work Orders."],
  [["The lines read 1.5 and 0.75 hours."], ['The confirmation reads "Labor 2.25 h".'], ["The work order is Closed."], ['The document reads "Labor hours 2.25".'],
   ["Work order 1's row reads Hours 2.25."]],
  ["T-HOURS", "S3-R2", "S9-R2"])
C("DATA-04", S, "Completed lines agree between the report and Technician Efficiency",
  [ADMIN, ON, "Have technician A for this test, who clocked time this month on exactly 4 lines now Complete, one of them on a closed internal work order."],
  ["Open Reports > Internal Work Orders.", 'Open the "By technician" tab.', "Open Reports > Technician Efficiency."],
  [["The report opens."], ["Technician A shows Completed lines 4."], ["For this month, technician A's completed lines also read 4."]],
  ["S9-R2", "S9-R3"])
C("DATA-05", S, "The dashboard Tech Efficiency card gives the report's Show all hours",
  [ADMIN, ON, NO_ACCT, "Have technician A for this test.", icust("A"), cust("B"),
   iwo(1, "A", "closed today", ", on which technician A clocked 2.0 hours"), wo(2, "B", "invoiced today", ", billable, on which technician A clocked 3.0 hours")],
  ["Open Reports > Technician Efficiency.", "Set the date range to today.", "Open the dashboard.", "Set its range to today."],
  [["The report opens on Show all."], ["Technician A shows 5.0 hours."], ["The dashboard opens."], ["The Tech Efficiency card shows technician A at 5.0 hours, the same as the report."]],
  ["S9-R1", "S9-R3"])
C("DATA-06", S, "The summary strip, the rows and the totals row agree",
  [ADMIN, ON, NO_ACCT, icust("A"), iwo(1, "A", "closed", ", closed this month with one stock part at $30.00 and 1.0 hour"),
   iwo(2, "A", "closed", ", closed this month with one stock part at $45.50 and 2.5 hours")],
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", 'Set the Category filter to "General Internal".'],
  [["The report opens."], ["The range is this month."],
   ["The General Internal card reads parts cost $75.50 ($30.00 + $45.50), 2 work orders and 3.5 hours.", "Work order 1 and work order 2 are the rows, and the totals row reads $75.50 and 3.5."]],
  ["S9-R2"])
C("DATA-07", S, "The AccountingHub record totals equal its journal entries",
  [ADMIN, ON, AH, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART} and Shop supplies $15.00")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Open Accounting > Sales > Invoices.", "Open work order 1's record."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The work order is Closed."], ["The Closed record is listed."],
   ["The summary reads Parts cost $80.00 and Shop supplies $15.00.", "Its journal entry section shows $80.00 and $15.00 debited to 6500 Vehicle Expenses."]],
  ["S8-R1", "S8-R2", "S8-R3"])
C("DATA-08", S, "The totals row's comeback rate pools every line once",
  [ADMIN, ON, NO_ACCT, "Have technician A for this test, with 4 completed lines this month, and technician B, with 1 completed line this month.",
   "Have a comeback for this test, this month, for technician A (a no-charge Comeback line whose original line was technician A's) and one for technician B."],
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", 'Open the "By technician" tab.'],
  [["The report opens."], ["The range is this month."],
   ["Technician A reads 25% (1 ÷ 4) and technician B 100% (1 ÷ 1).", "The totals row reads 40% (2 ÷ 5), not 62.5%, the average of the two rates."]],
  ["S9-R2"], marker="PO:rate-totals")
C("DATA-09", S, "A technician with comebacks but no completed lines shows no rate",
  [ADMIN, ON, NO_ACCT, "Have technician A for this test, with no completed lines this month.",
   "Have a comeback for this test, this month, for technician A (a no-charge Comeback line whose original line was technician A's)."],
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", 'Open the "By technician" tab.'],
  [["The report opens."], ["The range is this month."], ["Technician A reads Comeback lines 1, Completed lines 0, and the Comeback rate shows the empty value the PO names, not 0% or an error."]],
  ["S9-R2"], marker="PO:rate-zero")
