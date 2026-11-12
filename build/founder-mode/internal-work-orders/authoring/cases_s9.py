"""Story 9 — Reports, dashboard and exports (SV-11766): the money reports and dashboard cards leave whole internal and no-charge work
orders and no-charge lines out (checked as before-and-after figures on known amounts), the Internal Work Orders report (filters, summary
strip, both tabs, totals, sort, technicians, Unassigned, exports), the Technician Efficiency chip, when the report appears, tax and
receivables reports, the Customer Invoice export option, Parts Velocity, time reports, Work In Progress, Journal Entries, Customers
Spending, location scope, the permission and the empty state. Release-day rule zero is in the release-day section."""
from iwo_lib import C, NOMAN
from common import *

S = "S9"
REP = "Open Reports > Internal Work Orders."
TE = "Open Reports > Technician Efficiency."
TODAY_RANGE = "Set the date range to today."
NOTE_BEFORE = "Note the report's figures for today before the setup below."
BILL1 = wo(1, "B", "invoiced today", ", billable, with one labor line of 2.0 hours at $120.00 an hour ($240.00), invoiced after the figures were noted")
INT2 = iwo(2, "A", "closed today", f", with {STOCK_PART} and {LABOR_2H}, closed after the figures were noted")
SET_RANGE = [TODAY_RANGE]

for i, (rep, kd) in enumerate([("Sales", "S9-R1"), ("Sales By Customer", "S9-R1"), ("Sales By Representative", "S9-R1"), ("Advisor Analysis", "S9-R1")], 1):
    C(f"S9-0{i}", S, f"{rep} leaves out the closed internal work order",
      [ADMIN, ON, f"Open Reports > {rep}, set the date range to today and note its totals.", icust("A"), cust("B"), BILL1, INT2],
      [f"Open Reports > {rep}.", TODAY_RANGE],
      [[f"{rep} opens."],
       ["Revenue is the noted figure plus $240.00 from work order 1, and labor hours the noted figure plus 2.0.",
        "Work order 2 adds nothing: no revenue, no cost, no hours, and it is not listed."]],
      ["S9-R1", "KD-REPORT", "GOAL-4", "OV-REP"] if i == 1 else ["S9-R1"])
C("S9-05", S, "Sales leaves a no-charge line out of revenue, cost and invoiced hours",
  [ADMIN, ON, "Open Reports > Sales, set the date range to today and note its revenue, parts cost and invoiced hours.", cust("A"),
   wo(1, "A", "invoiced today", ", billable, invoiced after the figures were noted, with line 1 of 2.0 hours at $120.00 an hour ($240.00) and line 2 of 1.5 hours marked No Charge under Goodwill with one stock part costing $40.00")],
  ["Open Reports > Sales.", TODAY_RANGE],
  [["Sales opens."],
   ["Revenue is the noted figure plus $240.00: line 2 adds $0.00.", "Parts cost is the noted figure: line 2's $40.00 is left out.",
    "Invoiced hours are the noted figure plus 2.0: line 2's 1.5 hours are left out.", "Work order 1 is listed with its billable amounts."]],
  ["S9-R1", "S12-R11", "KD-LINE"])
C("S9-06", S, "Dashboard money cards leave closed internal work orders out",
  [ADMIN, ON, "Open the dashboard for today and note the Sales, Billing and Invoices (\"Total invoices in range\") cards and customer A's place in Top Customers.",
   icust("A"), iwo(1, "A", "closed today", f", with {STOCK_PART} and {LABOR_2H}, closed after the figures were noted")],
  ["Open the dashboard.", "Set its range to today."],
  [["The dashboard opens."],
   ["The Sales, Billing and Invoices cards show the noted figures: work order 1 adds nothing.",
    "Top Customers and At-Risk Customers do not count work order 1 for customer A, invoice count included."]],
  ["S9-R1"])
C("S9-07", S, "The Invoices card counts a billable invoice with a no-charge line once",
  [ADMIN, ON, "Open the dashboard for today and note the Invoices card and the Sales card.", cust("A"),
   wo(1, "A", "invoiced today", ", billable, invoiced after the figures were noted, with line 1 at $240.00 and line 2 marked No Charge under Goodwill")],
  ["Open the dashboard.", "Set its range to today."],
  [["The dashboard opens."], ['"Total invoices in range" is the noted count plus 1: work order 1 counts once.', "Sales is the noted figure plus $240.00, line 1's amount; line 2 adds $0.00."]],
  ["S9-R1"])
C("S9-08", S, "The Internal Work Orders report offers its filters with their defaults",
  [ADMIN, ON, "Make sure the organization has closed at least one internal or no-charge work order, so the report is listed."],
  [REP, 'Open the "Classification" filter.', 'Open the "Category" filter.'],
  [['The filters show: date range (default this month), Location (all), Classification, Category and Original technician.'],
   ['It offers "All", "Internal", "No Charge" and "No Charge line".'], ["It offers All or one category, with archived categories under their own heading."]],
  ["S9-R2", "T-NAME"])
C("S9-09", S, "The date range of the report is limited to 12 months",
  [ADMIN, ON, "Make sure the organization has closed at least one internal work order."],
  [REP, "Try to set a date range of 13 months."],
  [["The report opens."], ["A range longer than 12 months is not accepted."]],
  ["S9-R2"])
ROWS_PRE = [ADMIN, ON, NO_ACCT, icust("A"), cust("B"), "Have a new invoiced work order for this test, work order 4, for customer B.",
            iwo(1, "A", "closed", ", closed on the 3rd of this month, with 2 stock parts at $40.00 ($80.00), one special-order part billed at $125.00, 2.0 labor hours and Shop supplies $15.00"),
            ncwo(2, "B", "Warranty", "closed", ", closed on the 2nd of this month, with 1 stock part at $80.00, 1.0 labor hour and work order 4 as its original work order"),
            wo(3, "B", "invoiced", ", billable, invoiced on the 1st of this month, whose line 2 of 1.5 hours was No Charge under Goodwill with one stock part costing $40.00")]
C("S9-10", S, "By work order and line lists whole work orders and no-charge lines with figures",
  ROWS_PRE,
  [REP, "Set the date range to this month.", 'Set the Classification filter to "All".'],
  [["The report opens on the \"By work order and line\" tab."], ["The range is this month."],
   ['Work order 1 reads Line "Whole work order", customer A, Internal, General Internal, Closed / invoiced on the 3rd, Parts cost $205.00 ($80.00 + $125.00), Shop supplies $15.00, Hours 2.0.',
    'Work order 2 reads "Whole work order", No Charge, Warranty, Original work order work order 4 (a link), Parts cost $80.00, Hours 1.0.',
    "Work order 3 reads line 2's number and title, No Charge line, Goodwill, the invoice date, Parts cost $40.00, Shop supplies empty, Hours 1.5.",
    "Rows are sorted newest first: work order 1, work order 2, work order 3.",
    "The totals row reads Parts cost $325.00, Shop supplies $15.00 and Hours 4.5."]],
  ["S9-R2", "S9-R11", "S2-R16", "KD-REPORT"])
C("S9-11", S, "The summary strip shows one card per category in the range",
  ROWS_PRE,
  [REP, "Set the date range to this month."],
  [["The report opens."],
   ["General Internal: parts cost $205.00, 1 work order or line, 2.0 hours.", "Warranty: $80.00, 1, 1.0 hours.", "Goodwill: $40.00, 1, 1.5 hours.",
    "Work order 1, work order 2 and work order 3 make up these cards."]],
  ["S9-R2"])
C("S9-12", S, "The No Charge line filter shows only lines of billable work orders",
  ROWS_PRE,
  [REP, "Set the date range to this month.", 'Set the Classification filter to "No Charge line".'],
  [["The report opens."], ["Three rows show."], ["Only work order 3's line 2 is listed; work order 1 and work order 2 are not.", "The totals row reads Parts cost $40.00 and Hours 1.5."]],
  ["S9-R2"])
C("S9-13", S, "The Category filter shows one category's rows",
  ROWS_PRE,
  [REP, "Set the date range to this month.", 'Set the Category filter to "Warranty".'],
  [["The report opens."], ["Three rows show."], ["Only work order 2 is listed; work order 1 and work order 3 are not."]],
  ["S9-R2"])
C("S9-14", S, "The Location filter offers only the user's locations",
  [ON, "Use an organization with two locations, location A and location B.", icust("A"),
   iwo(1, "A", "closed", " at location A, closed this month"), iwo(2, "A", "closed", " at location B, closed this month"),
   "Sign in as a user with 'Reports — Page Access' and access to location A only."],
  [REP, "Open the Location filter."],
  [["Work order 1 is listed; work order 2 is not."], ["Only location A is offered."]],
  ["S9-R16"])
C("S9-15", S, "The totals row adds up the whole range, not only the page",
  [ADMIN, ON, icust("A"), "Have enough new internal work orders for this test for customer A, closed this month, each with one stock part at $10.00, to fill more than one page of the report (note how many)."],
  [REP, "Set the date range to this month."],
  [["The report opens."], ["The totals row's Parts cost equals $10.00 times the number of customer A's work orders noted, not only those on the first page."]],
  ["S9-R2"])
TECH_PRE = [ADMIN, ON, NO_ACCT, "Have technician A for this test, who clocked time this month on exactly 4 lines now Complete.", cust("B"),
            "Have a new invoiced work order for this test, work order 4, for customer B, whose line 1 was done by technician A.",
            ncwo(1, "B", "Warranty", "closed", ", closed this month, with 1.0 labor hour, 1 stock part at $80.00 and work order 4 as its original work order"),
            wo(2, "B", "invoiced", ", billable, invoiced this month, whose line 2 of 1.5 hours was No Charge under Comeback with one stock part at $40.00 and work order 4's line 1 as its original line")]
C("S9-16", S, "By technician counts completed, comeback and warranty lines with the rate",
  TECH_PRE,
  [REP, "Set the date range to this month.", 'Open the "By technician" tab.'],
  [["The report opens."], ["The range is this month."],
   ["Technician A's row reads Completed lines 4, Comeback lines 1 (work order 2's line 2), Warranty lines 1 (work order 1 as a whole), Comeback rate 25% (1 ÷ 4).",
    "Redo hours read 2.5 (1.5 + 1.0) and Redo parts cost $120.00 ($40.00 + $80.00)."]],
  ["S9-R2", "S2-R17", "KD-ORIG", "OV-LABOR"])
C("S9-17", S, "A line with two original technicians counts once for each of them",
  [ADMIN, ON, NO_ACCT, cust("B"), "Have a new invoiced work order for this test, work order 4, for customer B, whose line 1 had two technicians, technician A and technician B.",
   wo(2, "B", "invoiced", ", billable, invoiced this month, whose line 2 of 1.5 hours was No Charge under Comeback with one stock part at $40.00 and work order 4's line 1 as its original line")],
  [REP, "Set the date range to this month.", 'Open the "By technician" tab.'],
  [["The report opens."], ["The range is this month."],
   ["Technician A and technician B each show Comeback lines 1, Redo hours 1.5 and Redo parts cost $40.00, shown whole for each.",
    "The totals row counts work order 2's line 2 once: Comeback lines 1, Redo hours 1.5, Redo parts cost $40.00.",
    "A note under the table says a line with several technicians counts once for each of them and once in the totals."]],
  ["S9-R2", "S2-R17"])
C("S9-18", S, "Work with no original technician shows under Unassigned",
  [ADMIN, ON, NO_ACCT, cust("B"), ncwo(1, "B", "Comeback", "closed", ", closed this month, with 1.0 labor hour, 1 stock part at $25.00 and Not in ShopView as its original")],
  [REP, "Set the date range to this month.", 'Open the "By technician" tab.'],
  [["The report opens."], ["The range is this month."], ["A row \"Unassigned\" shows work order 1 as Comeback lines 1, Redo hours 1.0 and Redo parts cost $25.00, so the job stays in the totals."]],
  ["S9-R2", "S2-R17"])
C("S9-19", S, "The PDF export carries both tabs, the CSV the open tab",
  ROWS_PRE,
  [REP, "Set the date range to this month.", "Export the report as PDF.", "Export the report as CSV."],
  [["The report opens."], ["Three rows show: work order 1, work order 2 (original work order 4) and work order 3's line 2."], ['The PDF holds a "By work order and line" section and a "By technician" section with the same columns as the screen.'],
   ['The CSV holds the open tab, "By work order and line", with the same three rows and columns.']],
  ["S9-R2"])
C("S9-20", S, "Technician Efficiency shows the Internal work orders chip, default Show all",
  [ADMIN, ON, "Make sure the organization has closed at least one internal work order."],
  [TE, 'Hover over the "Internal work orders" chip.', "Open the Completed tab."],
  [['The Invoiced tab shows the chip "Internal work orders: Hide / Only internal / Show all" on "Show all".'],
   ['The tooltip reads "Internal and no-charge work orders".'], ['The Completed tab shows the same chip on "Show all".']],
  ["S9-R3", "T-NAME"])
C("S9-21", S, "Only internal and Hide split a technician's hours",
  [ADMIN, ON, NO_ACCT, "Have technician A for this test.", icust("A"), cust("B"),
   iwo(1, "A", "closed today", ", on which technician A clocked 2.0 hours"), wo(2, "B", "invoiced today", ", billable, on which technician A clocked 3.0 hours")],
  [TE, TODAY_RANGE, 'Set the chip to "Only internal".', 'Set the chip to "Hide".'],
  [["The report opens on Show all."], ["Technician A shows 5.0 hours (2.0 + 3.0)."], ["Technician A shows 2.0 hours, from work order 1 only."],
   ["Technician A shows 3.0 hours: both the billed and the clocked hours of work order 1 are left out."]],
  ["S9-R3", "S9-R11", "OV-LABOR", "KD-LABOR"])
C("S9-22", S, "A closed internal work order counts as invoiced on the Invoiced tab",
  [ADMIN, ON, NO_ACCT, "Have technician A for this test.", icust("A"), iwo(1, "A", "closed today", ", on which technician A clocked 2.0 hours")],
  [TE, TODAY_RANGE, 'Set the chip to "Only internal".'],
  [["The Invoiced tab opens."], ["The range is today."], ["Technician A shows work order 1's hours on the Invoiced tab, with no sales."]],
  ["S9-R3", "S9-R11"])
C("S9-23", S, "A no-charge line's hours are never invoiced hours and do not lower the rate",
  [ADMIN, ON, NO_ACCT, "Have technician A for this test.", cust("B"),
   wo(1, "B", "invoiced today", ", billable, with line 1 of 2.0 hours at $120.00 an hour and line 2 of 1.5 estimated hours marked No Charge under Goodwill, on which technician A clocked 1.0 hour")],
  [TE, TODAY_RANGE],
  [["The report opens on Show all."],
   ["Technician A's invoiced hours count line 1's 2.0 hours, not line 2's 1.5.", "The effective labor rate stays $120.00 an hour: line 2's $0 price is not counted.",
    "Line 2's 1.0 clocked hour counts as worked hours."]],
  ["S9-R3"])
C("S9-24", S, "The chip's value stays with the report's filters",
  [ADMIN, ON, "Make sure the organization has closed at least one internal work order."],
  [TE, 'Set the chip to "Only internal".', RELOAD],
  [["The report opens on Show all."], ['The chip reads "Only internal".'], ['The chip still reads "Only internal", kept with the other filters.']],
  ["S9-R3"])
C("S9-25", S, "Before the first close the report, chip and export option are not shown",
  [ADMIN, "Use a new organization that has never closed an internal or no-charge work order nor invoiced a no-charge line.", ON],
  ["Open Reports.", TE, "Open Export Reports.", "Open the Internal Work Orders report's direct link."],
  [['"Internal Work Orders" is not listed among the reports, while the other reports are.'], ['The "Internal work orders" chip is not shown.'],
   ['The Customer Invoice export has no "Include internal and no-charge work orders" option.'], ["The standard report empty state shows."]],
  ["S9-R4", "S9-N1", "UFS-26"])
C("S9-26", S, "The first close lists the report for good",
  [ADMIN, "Use a new organization that has never closed an internal or no-charge work order.", ON, NO_ACCT, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Open Reports.", "Reopen work order 1 from the Finance tab.", "Turn the Internal Work Orders setting off.", "Open Reports."],
  [["Work order 1 opens."], ["The confirmation opens."], ["The work order is Closed."], ['"Internal Work Orders" is listed.'], ["Work order 1 is Complete again."],
   ["The setting is off."], ['"Internal Work Orders" is still listed, with the Technician Efficiency chip and the export option.']],
  ["S9-R4", "S9-N1", "S9-E1"])
C("S9-27", S, "The first invoice with a no-charge line also lists the report",
  [ADMIN, "Use a new organization that has never closed an internal or no-charge work order.", ON, cust("A"),
   wo(1, "A", "Complete", ", billable, with one line marked No Charge under Goodwill")],
  [OPEN_WO, CREATE_INV, "Open Reports."],
  [["Work order 1 opens."], ["The invoice is created."], ['"Internal Work Orders" is listed.']],
  ["S9-R4"])
C("S9-28", S, "A reopened work order leaves the report until it is closed again",
  ROWS_PRE[:4] + [iwo(1, "A", "closed", ", closed this month"), iwo(2, "A", "closed", ", closed this month, so a listed row can be compared")],
  ["Reopen work order 1 from the Finance tab.", REP, "Set the date range to this month."],
  [["Work order 1 is Complete."], ["The report opens and is still listed."], ["Work order 2 is listed; work order 1 is not."]],
  ["S9-E1"])
C("S9-29", S, "A/R Aging and customer statements never include a closed internal work order",
  [ADMIN, ON, icust("A", ", with one billable invoice, work order 2, left unpaid, so the customer has an open balance"), iwo(1, "A", "closed")],
  ["Open Reports > A/R Aging Summary.", "Open Reports > A/R Aging Detail.", "Open Reports > A/R Collection.", "Open customer A's statement."],
  [["Customer A shows only work order 2's balance."], ["Work order 2 is listed; work order 1 is not."], ["Work order 1 is not listed."], ["The statement lists work order 2's invoice and not work order 1."]],
  ["S9-R5", "S3-R6"])
C("S9-30", S, "Sales Tax Collected never includes a closed no-charge work order",
  [ADMIN, ON, "Open Reports > Sales Tax Collected for today and note its totals.", cust("A"), ncwo(1, "A", "Goodwill", "closed today", ", closed after the totals were noted")],
  ["Open Reports > Sales Tax Collected.", TODAY_RANGE],
  [["The report opens."], ["The totals are the noted figures: work order 1 adds nothing and is not listed."]],
  ["S9-R5"])
C("S9-31", S, "IBS Batches never include a closed no-charge work order",
  [ADMIN, ON, cust("A", ", with an IBS account"), ncwo(1, "A", "Goodwill", "closed today"), wo(2, "A", "invoiced today", ", billable, sent to IBS, so a batched invoice can be compared")],
  ["Open Reports > IBS Batches.", TODAY_RANGE],
  [["The report opens."], ["Work order 2's invoice is in today's batch; work order 1 is not in any batch."]],
  ["S9-R5"])
C("S9-32", S, "The Customer Invoice export option is off by default with its helper",
  [ADMIN, ON, "Make sure the organization has closed at least one internal work order."],
  ["Open Export Reports.", "Pick Customer Invoice."],
  [["The Export Reports window opens."],
   ['The option "Include internal and no-charge work orders" shows unticked with the helper "For your records only. Do not import these rows as invoices."']],
  ["S9-R6", "UFS-25"])
C("S9-33", S, "With the option on, the export adds the closed rows at 0.00",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed today", f", with {LABOR_2H} and {STOCK_PART}, Shop supplies $15.00"), cust("B"), wo(2, "B", "invoiced today", ", billable")],
  ["Open Export Reports.", "Pick Customer Invoice.", 'Tick "Include internal and no-charge work orders".', "Export today's file.", "Open the file."],
  [["The window opens."], ["The option shows."], ["The option is ticked."], ["A file is exported."],
   ["The file has the columns Classification and Category.", "Work order 2's rows read Classification Billable with Category empty.",
    "Work order 1 has one row per line, Classification Internal, Category General Internal, ItemRate and ItemAmount 0.00 on every row.",
    "Work order 1 has no tax amount and no Supplies row."]],
  ["S9-R6", "S9-R11"])
C("S9-34", S, "With the option off, the export is today's file",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed today"), cust("B"), wo(2, "B", "invoiced today", ", billable")],
  ["Open Export Reports.", "Pick Customer Invoice.", "Export today's file with the option unticked.", "Open the file."],
  [["The window opens."], ["The option shows unticked."], ["A file is exported."],
   ["The file has today's columns, with no Classification or Category column.", "Work order 2 is in it; work order 1 is not."]],
  ["S9-R6"])
C("S9-35", S, "A no-charge line shows in the export as a $0.00 row with its category",
  [ADMIN, ON, cust("A"), wo(1, "A", "invoiced today", ", billable, whose line 2 was No Charge under Goodwill")],
  ["Open Export Reports.", "Pick Customer Invoice.", "Export today's file with the option unticked.", "Open the file."],
  [["The window opens."], ["The option shows unticked."], ["A file is exported."], ["Line 2's row reads 0.00 with \"Goodwill\" in its description."]],
  ["S9-R13", "S9-R11"])
C("S9-36", S, "Parts Velocity counts units used but not their sale",
  [ADMIN, ON, "Have a new inventory part for this test, part A.", "Open Reports > Parts Velocity for today and note part A's units, Avg Sell, Revenue and Margin.",
   icust("A"), iwo(1, "A", "closed today", ", with 2 of part A, closed after the figures were noted")],
  ["Open Reports > Parts Velocity.", TODAY_RANGE],
  [["The report opens."], ["Part A's units used are the noted figure plus 2.", "Avg Sell, Revenue and Margin are the noted figures: work order 1 adds no sale."]],
  ["S9-R7"])
C("S9-37", S, "Time reports keep hours clocked on internal work orders",
  [ADMIN, ON, "Have technician A for this test.", icust("A"), iwo(1, "A", "closed today", ", on which technician A clocked 2.0 hours")],
  ["Open Reports > Shop Efficiency.", "Open Reports > Technician Utilization.", "Open Timesheets for technician A today."],
  [["Technician A's 2.0 hours count as worked hours.", 'The "Internal Hours" column is unchanged: it counts time clocked to a department, not to work order 1.'],
   ["Technician A's 2.0 hours count as worked hours."], ["The 2.0 hours on work order 1 are listed."]],
  ["S9-R8"])
C("S9-38", S, "Shop Efficiency leaves a no-charge line's estimate out of invoiced hours",
  [ADMIN, ON, "Have technician A for this test.", cust("A"),
   wo(1, "A", "invoiced today", ", billable, with line 1 of 2.0 hours and line 2 of 1.5 estimated hours marked No Charge, on which technician A clocked 1.0 hour")],
  ["Open Reports > Shop Efficiency.", TODAY_RANGE],
  [["The report opens."], ["Invoiced hours count line 1's 2.0 and not line 2's 1.5.", "Line 2's 1.0 clocked hour counts as worked hours."]],
  ["S9-R8"])
C("S9-39", S, "Work In Progress shows an open internal work order with its badge and no value",
  [ADMIN, ON, icust("A"), iwo(1, "A", "In Progress", f", with {LABOR_2H} and {STOCK_PART}")],
  ["Open Reports > Work In Progress."],
  [['Work order 1 is listed with the "Internal" badge and no value.']],
  ["S9-R9", "S9-R12"])
C("S9-40", S, "The Journal Entries report shows the Close entry on the category account",
  [ADMIN, ON, QB, "Make sure the General Internal category is mapped to account X at the test location.", icust("A"), iwo(1, "A", "closed today", f", with {STOCK_PART}")],
  ["Open Reports > Journal Entries.", TODAY_RANGE],
  [["The report opens."], ["Work order 1's Close entry shows with account X on the debit side, $80.00, like any entry."]],
  ["S9-R15"])
C("S9-41", S, "Customers Spending leaves out a closed internal work order",
  [ADMIN, ON, "Open Reports > Customers Spending for today and note customer A's and customer B's figures.", icust("A"), cust("B"),
   iwo(1, "A", "closed today", ", closed after the figures were noted"),
   wo(2, "B", "invoiced today", ", billable, invoiced after the figures were noted, with line 1 at $240.00 and line 2 marked No Charge under Goodwill")],
  ["Open Reports > Customers Spending.", TODAY_RANGE],
  [["The report opens."], ["Customer A's figure is the noted figure: work order 1 adds nothing.", "Customer B's figure is the noted figure plus $240.00, the invoice total; line 2 adds $0."]],
  ["S9-R15"])
C("S9-42", S, "No matching rows show the standard empty state",
  [ADMIN, ON, "Make sure the organization has closed at least one internal work order, but none last year."],
  [REP, "Set the date range to a month of last year."],
  [["The report opens."], ["The standard report empty state shows."]],
  ["S9-N1", "UFS-26"])
C("S9-43", S, "Without Reports — Page Access the reports are not available",
  [ON, "Make sure the organization has closed at least one internal work order.", role("has every setting except 'Reports — Page Access'")],
  ["Open the main menu."],
  [["Reports, the Internal Work Orders report and Technician Efficiency are not available to this user, as today."]],
  ["S9-N2", "PM-14"])
C("S9-44", S, "Every user with Reports — Page Access sees the By technician tab",
  [ON, "Make sure the organization has closed at least one internal work order.", role("has 'Reports — Page Access' and no other report-related permission")],
  [REP, 'Open the "By technician" tab.'],
  [["The report opens."], ["The By technician tab opens with its columns."]],
  ["S9-N3"])
