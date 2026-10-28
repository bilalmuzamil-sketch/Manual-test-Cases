#!/usr/bin/env python3
"""28 Oct 2026, QA lead: "Create a Questions file for chris just like the other session called 'Create Test cases/source
verification' creates." Same shape as that session's Chris Ward question docs (title, "Dear Sir," intro, Heading 2 "N. title",
bold "What the page says:" / "Question:" / "Answer:" labels, "Thank you very much, Sir." / "Bilal Muzamil") — format only, taken
read-only from its branch. Questions a customer cannot reach on screen are left out (QA lead, 28 Oct). Writes
questions-for-chris-ward.html (uploaded to Google Drive as a Google Doc) and QUESTIONS-MAP.md (doc number -> our sheet id)."""
import html, os
HERE = os.path.dirname(os.path.abspath(__file__))
C = 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/'
PAGES = [('Dashboard', C + '788430850', 'version 53, 22 October'),
         ('Work In Progress', C + '703660034', 'version 28, 24 August'),
         ('Technician Utilization', C + '641400833', 'version 9, 13 August'),
         ('Parts Velocity', C + '620888066', 'version 12, 14 September'),
         ('Inventory Value', C + '720142338', '13 August'),
         ('Sales By Customer', C + '577634305', 'version 22, 19 October'),
         ('Sales By Representative', C + '585629698', 'version 30, 21 October')]
W, T, S, Q = 'What the page says:', 'What the ticket says:', 'What we see on screen:', 'Question:'
QS = [  # (our id, title, [(label, text)])
 ('DQ-1', 'Dashboard, Technician Efficiency: a line the customer declined', [
  (W, '"Invoiced technician hours" is "the technician time recorded on work order lines" (section 4), while "Invoiced hours" is "the labor time billed on work order lines". A voided invoice adds nothing to either (S3-E2).'),
  (S, 'on work order S1-38198 only line 1 was billed; the customer declined line 2. The technician still shows 2.00 Invoiced Tech Hrs and 133.33 %. The Billing Efficiency tile leaves the same declined line out.'),
  (Q, 'should the technician time on a declined line count in Technician Efficiency? (a) Yes, as today. (b) No, only lines that were billed count.')]),
 ('DQ-2', 'Dashboard, Revenue: a discount on the work order', [
  (W, 'Revenue is the "sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos" (S3-R2).'),
  (S, 'work order S1-38200 has $135.00 of labor and a $20.00 discount. The invoice prints Subtotal $115.00, and Revenue counts $115.00.'),
  (Q, 'should Revenue count (a) $115.00, the invoice subtotal after the discount, as today, or (b) $135.00, the amount before the discount?')]),
 ('DQ-3', 'Dashboard, Revenue split when a share is negative', [
  (S, 'when credit memos or discounts are larger than one part of the sales, the line under Revenue reads, for example, "Parts -28% · Labor 130% · Other -2%". The three still add up to 100.'),
  (Q, 'is that how it should read? If not, how should it read?')]),
 ('WQ-1', 'Work In Progress, Days Open', [
  (W, '"Days Open shows the whole number of days since the work order was created — elapsed time divided by 24 hours, floored … a same-day work order shows \'0 days\'" (S4-R12).'),
  (S, 'Days Open counts calendar dates. S2-38105, created on 28 October at 3:19 PM, shows "1 days" ten hours later.'),
  (Q, 'should Days Open count whole 24-hour periods, as the page says, or calendar dates, as the screen does?')]),
 ('WQ-3', 'Work In Progress, how a negative amount is written', [
  (W, 'a negative value shows a leading minus before the "$", for example "-$1,234.56" (S4-R14), and the Totals row uses the same formats (S6-R5).'),
  (S, 'the Totals row shows a negative amount as "(-$3.13)", with brackets and a minus sign.'),
  (Q, 'should it read "-$3.13"?')]),
 ('WQ-4', 'Work In Progress, a part marked "received later"', [
  (W, 'a part that was received counts as earned, and a part "ordered but not yet received" counts as remaining (S4-R18). The page does not mention "received later".'),
  (S, 'a part request marked "received later" counts in Parts Remaining.'),
  (Q, 'is that right? If not, where does it belong?')]),
 ('WQ-5', 'Work In Progress, an in-stock part not yet picked', [
  (W, 'Parts Remaining is parts "ordered but not yet received" (S4-R18).'),
  (S, 'a part that is in stock but has not been picked for the job also counts in Parts Remaining, although it was never ordered.'),
  (Q, 'is that right? If not, where does it belong?')]),
 ('WQ-11', 'Work In Progress, an estimate with nothing approved', [
  (W, 'S4-E1 and S2-R4 say an open estimate with nothing approved shows "$0.00 for every money column, including Total". S3-R5, S5-R8 and your ruling on SV-9027 (10 August) value the Estimates row at its unapproved lines.'),
  (S, 'the screen follows S3-R5 and SV-9027.'),
  (Q, 'can S4-E1 and S2-R4 be reworded to match S3-R5? If not, which wording is right?')]),
 ('WQ-2', 'Technician Utilization, decimal places', [
  (W, '"Utilization % shows one decimal place followed by a percent sign, rounded round-half-up (e.g., 66.65% → 66.7%)" (S2-R7).'),
  (T, 'SV-9059 (Done) asked for two decimals. SV-9407, which reported the same thing we see, was closed as Obsolete without a comment.'),
  (S, 'two decimals, for example 85.71%.'),
  (Q, 'should Utilization % show (a) one decimal, as the page says, or (b) two decimals, as the screen does?')]),
 ('WQ-10', 'Technician Utilization, a technician with only a few seconds clocked', [
  (S, 'a technician whose only clocks are a few seconds long is listed with 0.00 hours and Utilization "—". The page calls this case unreachable (S2-R7).'),
  (Q, 'should such a technician be listed, or left off the report?')]),
 ('WQ-8', 'Technician Utilization and Timesheet Activities, time on a deleted work order', [
  (S, 'time clocked on a work order that was later deleted still counts as WO Hours, and Timesheet Activities shows it with a blank Work Order. There are 5 such clocks at Heavy Duty this year.'),
  (Q, 'should that time still count as WO Hours?')]),
 ('WQ-7', 'Shop Efficiency, a shift that is still running', [
  (T, 'your ruling on SV-11688 (22 October) is that a running shift under 24 hours counts on Technician Utilization and Timesheet Activities. Shop Efficiency (SV-2116) does not say.'),
  (S, 'Shop Efficiency leaves every running clock out of Total Clocked Hours.'),
  (Q, 'should Shop Efficiency count a running shift under 24 hours too?')]),
 ('PQ-1', 'Parts Velocity, how long "Last 90 days" is', [
  (T, 'SV-11514 says "The default range is Last 90 Days."'),
  (S, 'on 28 October, Last 90 days runs from 30 July to 28 October, which is 91 days.'),
  (Q, 'should it cover exactly 90 days, today and the 89 days before it?')]),
 ('PQ-2', 'Parts Velocity, which date a sale is counted on', [
  (W, 'sales are dated by the work order\'s end date (Story 5, "Work-order date").'),
  (S, 'work orders do not get an end date (it is empty on paid work order S2-17193), so the report uses the invoice date.'),
  (Q, 'should sales be dated by the invoice date? If yes, could the page say so?')]),
 ('PQ-3', 'Parts Velocity, a return to the vendor', [
  (W, 'Units Returned counts "a work-order part return or a parts-sale credit".'),
  (S, 'a return to the vendor made from Parts → Returns also counts. Returning 1 unit of ZZAUTOTEST-PV1-10282011 raised Units Returned from 0 to 1, and cancelling it put it back to 0.'),
  (Q, 'should a return to the vendor count in Units Returned?')]),
 ('PQ-4', 'Parts Velocity, the Location column with one location picked', [
  (W, 'S2-R12 says the column is hidden "when a single location is in scope". S3-R10 and the Key Decisions say it is "shown by default … regardless of how many locations are currently selected".'),
  (S, 'with one location picked the column is hidden. Inventory Value shows it with one location picked.'),
  (Q, 'when a user with several locations picks one, should the Location column be hidden?')]),
 ('PQ-5', 'Parts Velocity, the list of date options', [
  (W, 'S2-R2 lists Today and Yesterday and does not list Last 12 months.'),
  (S, 'This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 90 days, Last 12 months, Custom. This matches your answer of 5 August and SV-11514. Every option covers the right dates.'),
  (Q, 'is the list on screen the right one? If yes, could S2-R2 be updated?')]),
 ('PQ-7', 'Parts Velocity, Last Sale for a sale with no stock movement', [
  (W, 'Last Sale is "the part\'s most recent sale". S3-N1 calls a billed sale without stock movement "a drop-ship sale".'),
  (S, 'N000000001069 at Heavy Duty was billed on S2-16621 on 30 July, but Last Sale reads 160 days, which is its sale before that.'),
  (Q, 'should Last Sale include a billed sale that moved no stock?')]),
 ('PQ-8', 'Inventory Value, a cost above the highest price band', [
  (W, 'Unit Sell uses "the shop\'s pricing-matrix markup on cost for that part\'s category" (S3-R5).'),
  (S, 'when the cost is above the highest band, the highest band\'s markup is used, the same as on the parts list. Example: 2599273C92 at Lethbridge, cost $526.70, category HD-Filters with bands up to $500, Unit Sell $752.44.'),
  (Q, 'is that right?')]),
 ('IQ-1', 'Inventory Value, the words "Total" and "Qty"', [
  (W, 'the totals row has "the literal label \'Total\'" (S4-R1); the downloads say "Totals" (S10-R6). The column is called "Qty on Hand" (S3-R1).'),
  (S, 'the totals row reads "Totals", as on every other report in the suite, and the column heading reads "Qty".'),
  (Q, '(a) Should the totals row read "Total" or "Totals"? (b) Should the column heading read "Qty on Hand" or "Qty"?')]),
 ('IQ-2', 'Inventory Value, the message when nothing matches', [
  (W, 'the message is "Empty bays, endless possibilities. Get Going!", "the application\'s standard reports no-data label" (section 7).'),
  (S, 'Inventory Value shows "No record matches these filters" with "Try changing filters to widen your results." The newer reports (Work In Progress, Technician Utilization, the A/R and A/P reports) show the same words.'),
  (Q, 'is "No record matches these filters" now the standard message for reports? If yes, could section 7 of the Inventory Value page be updated?')]),
 ('SQ-1', 'Sales By Customer, what Margin % is divided by', [
  (W, 'the Sales By Customer page says Margin % is "the row\'s Margin divided by its Subtotal, times 100" (S7-R11). The newer Sales By Representative page says "Sales By Customer computes Margin % from the same Margin base", which is the Subtotal minus Shop Supplies (section 3).'),
  (S, 'the Subtotal minus Shop Supplies. Example: TestVT1 at Heavy Duty, this month: Margin $21,960.81, Subtotal $28,569.41, Shop Supplies $2,050.98. The screen shows 82.81 %; Margin ÷ Subtotal would be 76.87 %.'),
  (Q, 'should Margin % on Sales By Customer be divided by (a) the Subtotal, or (b) the Subtotal minus Shop Supplies, as today?')]),
 ('SQ-2', 'Sales By Customer and Sales By Representative, decimals and negative amounts', [
  (W, 'Labor Delta is "rounded to one decimal" on both pages (SBC S12-R2, SBR S9-R2), and Margin % on Sales By Customer is "to one decimal" (S7-R11). Your tickets SV-9199 and SV-9200 (12 August) keep "the signed one-decimal format (+2.0 / -14.0 / 0.0)". SV-9068 and SV-9069 (10 August, "SV standard is 2") asked for two decimals. The Sales By Representative page writes a negative amount as "($1,234.56)".'),
  (S, 'two decimals on both reports (+112.64, +1.00, 82.81 %), and a negative margin as "(-$2.50)", with brackets and a minus sign.'),
  (Q, '(a) Should Labor Delta and Margin % show one decimal or two? (b) Should a negative amount read "($2.50)" or "(-$2.50)"?')]),
 ('SQ-3', 'Sales By Representative, a $0.00 invoice nobody paid', [
  (W, '"A zero-total invoice with no payment applied is unpaid and maps to Unpaid" (section 3).'),
  (T, 'SV-9217 (Done, 26 August) made such an invoice read Paid.'),
  (S, 'Paid.'),
  (Q, 'should a $0.00 invoice with no payment show Unpaid or Paid?')]),
 ('SQ-4', 'Sales By Customer, the asset name', [
  (W, '"The asset label is the vehicle\'s VIN", then the unit number, then the plate (S8-R7 to S8-R10).'),
  (T, 'your ticket SV-9459 (Done, 10 September) asks for "Unit # - Year Make Model", with the VIN only when there is nothing else.'),
  (S, 'the screen follows SV-9459.'),
  (Q, 'is SV-9459 the rule to keep? If yes, could S8-R7 to S8-R10 be updated?')]),
 ('SQ-7', 'Sales By Customer and Sales By Representative, the list of date options', [
  (W, 'Sales By Customer offers nine options, "Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week", with no Custom (S2-R2). Sales By Representative offers "Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom" (S2-R2).'),
  (S, 'both reports show This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 12 months, Custom. Every option covers the right dates.'),
  (Q, 'which list is right for these two reports?')]),
 ('SQ-10', 'Sales By Customer and Sales By Representative, time clocked or parts credited after invoicing', [
  (W, 'Labor Delta is "hours invoiced minus hours worked", and hours worked are "the technician clocked (timesheet) hours recorded against that work order". The pages do not say at what moment.'),
  (S, 'the reports keep the figures from when the invoice was made. On about 370 of 8,000 invoices this differs from the work order\'s Stats tab today, because time was clocked or parts were credited later. Example: S2-38022 shows Labor Delta +1.00; its Stats tab today shows 2.00 invoiced and 0.00 worked.'),
  (Q, 'should these reports keep the figures from when the invoice was made, as today, or use the figures as they are now?')]),
 ('SQ-6', 'Technician Efficiency, a clock shorter than 36 seconds', [
  (T, 'SV-5450 says tech time is "allocated proportionally" and "Each technician receives a proportional share", and also that it "must follow the existing behavior".'),
  (S, 'when a technician\'s clocks on a line add up to less than 0.01 hours, the whole tech time of the line is dropped. Example: Lethbridge S3-15255, "Recommend Axle 3 right tires": 30 minutes of tech time, one technician clocked 12 seconds, and the report shows 0.00 instead of 0.50.'),
  (Q, 'should that technician still get the line\'s tech time?')]),
 ('SQ-8', 'Sales Tax Collected, unpaid invoices', [
  (W, 'the draft page (Confluence 50200592) says the report is for "all invoices, Paid, Partially Paid and Unpaid". The newer training page (15 January 2026) and SV-4233 say it "Should not show any invoices that are \'Invoiced\'".'),
  (S, 'only Paid and Partially Paid invoices are listed.'),
  (Q, 'should unpaid invoices be listed on Sales Tax Collected?')]),
 ('SQ-9', 'Sales Tax Collected, tax on credit memos', [
  (S, 'the tax totals add up the listed invoices only. Credit memos (returns) made in the same dates never appear on this report and do not lower the totals.'),
  (Q, 'should the tax totals take off the tax on credit memos made in the same dates?')]),
 ('SQ-11', 'Sales Tax Collected, $0.00 invoices and deposit dates', [
  (T, 'SV-4573: "for partially paid invoices, show the date of the latest payment".'),
  (S, '643 invoices of $0.00 are listed as Paid, with a paid date, although no payment exists. On 20 invoices paid partly by a deposit, Invoice Paid Date is the day the invoice was made, not the deposit day (P2-2445: deposit 21 October, report 22 October).'),
  (Q, '(a) Should a $0.00 invoice with no payment be listed as Paid, with a paid date? (b) When a deposit pays part of an invoice, should Invoice Paid Date be the deposit\'s date?')]),
 ('RQ-1', 'A/R Aging Collection and A/P Aging Detail, a credit made on the chosen day', [
  (W, 'the A/R page says "If the calculated days are ≤ 0, the transaction is not past due and it\'s not shown on the report".'),
  (T, 'SV-5606 (Done, January 2026) asked for "Today\'s Credits … displayed with 1 as a Past Due".'),
  (S, 'credit CM2-4462 (E2E Credits Customer), made on 30 September 2026, is listed as 1 day past due on 30 September.'),
  (Q, 'should a credit made on the chosen day count as 0 days old, so it is left off A/R Aging Collection?')]),
 ('RQ-2', 'A/R Aging, a deposit on a part sale', [
  (T, 'SV-11690 says A/R should agree with the customer\'s Invoices tab, and that a held deposit is not taken off aged A/R.'),
  (S, 'part sale P2-2352 (TestVT1) shows $443.43 on the Invoices tab and $543.43 on A/R Aging, because its $100 deposit DEP-4763 stays "Held". P2-2439 is the same ($21 against $16).'),
  (Q, 'once a part sale is invoiced, should its deposit lower its balance on A/R Aging, as it does on the Invoices tab?')]),
 ('RQ-3', 'IBS Batches, the total of a sent batch', [
  (S, 'the Lethbridge batch of 2 October 2026 shows a Total of $9,473.35. Its 9 invoices add up to $9,183.29, and its own IBS file also says $9,183.29.'),
  (Q, 'must a sent batch\'s Total always equal the sum of the invoices and credits in it?')]),
 ('RQ-5', 'IBS Batches, a $0.00 invoice', [
  (S, 'S2-16924 (Fort Mohave Diesel Repair) is listed in Ready to Send with Total $0.00 and Balance $0.00.'),
  (Q, 'should a $0.00 invoice be listed in Ready to Send?')]),
 ('RQ-4', 'Notes Report, more than 100 notes', [
  (S, 'the report never shows more than 100 notes, with no way to see the rest. "All" shows 100 of 2,545 notes, "Last Week" 100 of 255, and "Filter by Author" 100 of 1,105.'),
  (Q, 'should the user be able to see every note in the chosen dates? If not, should the screen say that only 100 are shown?')]),
 ('RQ-6', 'QB Unexported, the No. column', [
  (S, 'all 283 credit memo rows on the Customers tab (Heavy Duty 255, Lethbridge 28) have a blank No.; payments and applications are blank too. 111 documents appear twice, each time with a different error.'),
  (Q, '(a) Should every credit memo row show its number, for example CM2-4476? (b) Should a document appear only once?')]),
 ('RQ-7', 'Export Reports, Terms on the Customer Invoice export', [
  (S, '7 invoices from September 2026 show Terms "Net 30", "Net 50" or "Net 60" in the file, while the invoice and its customer both say COD and the due date is the invoice date (for example S2-31597).'),
  (Q, 'should the Terms column show the invoice\'s own term?')]),
 ('RQ-8', 'Export Reports, more than 24 hours in a day on the Payroll Timesheet export', [
  (S, 'in September 2026, Admin Shopview has 40.70 Total Hours on 10 September and 32.34 on 17 September, and Haley Brown 28.50 on 6 September, from clocks that overlap.'),
  (Q, 'can one employee\'s day show more than 24 Total Hours?')]),
]
e = html.escape
parts = ['<html><head><meta charset="utf-8"><title>Dashboard and Reports – questions for Chris Ward</title></head><body>',
         '<h1>Dashboard and Reports – questions for Chris Ward</h1>',
         '<p>Dear Sir,</p>',
         '<p>We have checked every figure on the Dashboard and on the reports, on staging (28 October 2026), against your pages and tickets. '
         'While doing that, we found the points below. In each one the page does not settle what is right, or the page and the screen say '
         'different things. Each one decides whether we raise a defect. Could you please write your answer under each question? A short answer is perfect.</p>',
         '<p>Pages: ' + ', '.join(f'<a href="{u}">{e(n)}</a> ({e(v)})' for n, u, v in PAGES) +
         '. The codes in brackets point to the line in your page.</p>']
rows = []
for i, (qid, title, items) in enumerate(QS, 1):
    parts.append(f'<h2>{i}. {e(title)}</h2>')
    for lab, txt in items:
        parts.append(f'<p><b>{e(lab)}</b> {e(txt)}</p>')
    parts.append('<p><b>Answer:</b> </p>')
    rows.append(f'| {i} | {qid} | {title} |')
parts += ['<p>Thank you very much, Sir.</p>', '<p>Bilal Muzamil</p>', '</body></html>']
open(os.path.join(HERE, 'questions-for-chris-ward.html'), 'w', encoding='utf-8').write('\n'.join(parts))
open(os.path.join(HERE, 'QUESTIONS-MAP.md'), 'w', encoding='utf-8').write(
    '# Doc question number → our sheet id (28 Oct 2026)\n\n| Doc # | Our id | Title |\n|---|---|---|\n' + '\n'.join(rows) + '\n')
print(len(QS), 'questions')
