#!/usr/bin/env python3
"""v2 of the Chris Ward question doc (QA lead, 28 Oct 2026): "First make two sections in the file: Section 1 shuould be related
to dashboard and section 2 should be related to Reports and it should not blame Chris in any way letting him know what he made
somemistake in the past and should also tell him on which Build for example staging/productiuon or on which build of QA this can
be reproduced". Rewrites the existing Google Doc IN PLACE (same link) through Docs batchUpdate: one delete of the old body, one
insert of the new text, then paragraph styles, bold labels and page links. No '$…$' can turn into an equation this way.
Usage: python3 build_doc_v2.py <body_end_index> <revisionId> [out.json]   (also writes questions-for-chris-ward-v2.html)"""
import html, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
C = 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/'
PAGES = [('Dashboard', C + '788430850', 'version 53, 22 October'), ('Work In Progress', C + '703660034', 'version 28, 24 August'),
         ('Technician Utilization', C + '641400833', 'version 9, 13 August'), ('Parts Velocity', C + '620888066', 'version 12, 14 September'),
         ('Inventory Value', C + '720142338', '13 August'), ('Sales By Customer', C + '577634305', 'version 22, 19 October'),
         ('Sales By Representative', C + '585629698', 'version 30, 21 October')]
B = 'Staging, build v26.43.2-f8698cb'
HD, LE, DV = 'Staging Heavy Duty - 9919', 'Staging Lethbridge - 4310', 'DVI Test'
W, T, S, Q, WH = 'What the page says:', 'What the ticket says:', 'What we see on screen:', 'Question:', 'Where to see it:'
DASH = [
 ('DQ-1', 'Technician Efficiency: a line the customer declined', [
  (W, '"Invoiced technician hours" is "the technician time recorded on work order lines" (section 4), and "Invoiced hours" is "the labor time billed on work order lines". A voided invoice adds nothing to either (S3-E2).'),
  (S, 'on work order S1-38198 only line 1 was billed; the customer declined line 2. The technician shows 2.00 Invoiced Tech Hrs and 133.33 %. The Billing Efficiency tile does not count the declined line.'),
  (WH, f'{B}, location {DV}, Dashboard, This week.'),
  (Q, 'should the technician time on a declined line count in Technician Efficiency? (a) Yes, as today. (b) No, only lines that were billed count.')]),
 ('DQ-2', 'Revenue: a discount on the work order', [
  (W, 'Revenue is the "sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos" (S3-R2).'),
  (S, 'work order S1-38200 has $135.00 of labor and a $20.00 discount. The invoice prints Subtotal $115.00, and Revenue counts $115.00.'),
  (WH, f'{B}, location {DV}, Dashboard, This week.'),
  (Q, 'should Revenue count (a) $115.00, the invoice subtotal after the discount, as today, or (b) $135.00, the amount before the discount?')]),
 ('DQ-3', 'Revenue split when a share is negative', [
  (S, 'when credit memos or discounts are larger than one part of the sales, the line under Revenue reads, for example, "Parts -28% · Labor 130% · Other -2%". The three add up to 100.'),
  (WH, f'{B}, location {DV}, Dashboard, This month (a $400.00 credit memo, CM1-4535, is in the range).'),
  (Q, 'is this how the split should read? If not, how should it read?')]),
]
REP = [
 ('WQ-1', 'Work In Progress: Days Open', [
  (W, '"Days Open shows the whole number of days since the work order was created — elapsed time divided by 24 hours, floored … a same-day work order shows \'0 days\'" (S4-R12).'),
  (S, 'Days Open counts calendar dates. S2-38105, created on 28 October at 3:19 PM, shows "1 days" ten hours later.'),
  (WH, f'{B}, location {HD}, Work In Progress.'),
  (Q, 'should testers expect whole 24-hour periods, as on the page, or calendar dates, as on screen?')]),
 ('WQ-3', 'Work In Progress: how a negative amount is written', [
  (W, 'a negative value shows a leading minus before the "$", for example "-$1,234.56" (S4-R14), and the Totals row uses the same formats (S6-R5).'),
  (S, 'the Totals row shows a negative amount as "(-$3.13)", with brackets and a minus sign.'),
  (WH, f'{B}, location {HD}, Work In Progress, Totals row.'),
  (Q, 'which should testers expect: "-$3.13" or "(-$3.13)"?')]),
 ('WQ-4', 'Work In Progress: a part marked "received later"', [
  (W, 'a received part counts as earned, and a part "ordered but not yet received" counts as remaining (S4-R18).'),
  (S, 'a part request marked "received later" counts in Parts Remaining.'),
  (WH, f'{B}, location {HD}, Work In Progress.'),
  (Q, 'is Parts Remaining the right place for a part marked "received later"? If not, where should it count?')]),
 ('WQ-5', 'Work In Progress: an in-stock part not yet picked', [
  (W, 'Parts Remaining is parts "ordered but not yet received" (S4-R18).'),
  (S, 'a part that is in stock but not yet picked for the job also counts in Parts Remaining.'),
  (WH, f'{B}, location {HD}, Work In Progress.'),
  (Q, 'is Parts Remaining the right place for such a part? If not, where should it count?')]),
 ('WQ-11', 'Work In Progress: an estimate with nothing approved', [
  (W, 'S4-E1 and S2-R4 describe an open estimate with nothing approved as "$0.00 for every money column, including Total". S3-R5, S5-R8 and your ruling on SV-9027 (10 August) value the Estimates row at its unapproved lines.'),
  (S, 'the Estimates row is valued at its unapproved lines, as in S3-R5 and SV-9027.'),
  (WH, f'{B}, location {HD}, Work In Progress, Estimates tab.'),
  (Q, 'can testers follow S3-R5 and SV-9027 for this case?')]),
 ('WQ-2', 'Technician Utilization: decimal places', [
  (W, '"Utilization % shows one decimal place followed by a percent sign, rounded round-half-up (e.g., 66.65% → 66.7%)" (S2-R7).'),
  (T, 'SV-9059 asked for two decimals.'),
  (S, 'two decimals, for example 85.71%.'),
  (WH, f'{B}, locations {HD} and {DV}, Technician Utilization.'),
  (Q, 'should testers expect (a) one decimal or (b) two decimals?')]),
 ('WQ-10', 'Technician Utilization: a technician with only a few seconds clocked', [
  (S, 'a technician whose only clocks are a few seconds long is listed with 0.00 hours and Utilization "—".'),
  (WH, f'{B}, location {HD}, Technician Utilization.'),
  (Q, 'should such a technician be listed, or left off the report?')]),
 ('WQ-8', 'Technician Utilization and Timesheet Activities: time on a deleted work order', [
  (S, 'time clocked on a work order that was later deleted still counts as WO Hours, and Timesheet Activities shows it with a blank Work Order. There are 5 such clocks this year.'),
  (WH, f'{B}, location {HD}, This year.'),
  (Q, 'should that time still count as WO Hours?')]),
 ('WQ-7', 'Shop Efficiency: a shift that is still running', [
  (T, 'your ruling on SV-11688 (22 October): a running shift under 24 hours counts on Technician Utilization and Timesheet Activities.'),
  (S, 'Shop Efficiency leaves every running clock out of Total Clocked Hours.'),
  (WH, f'{B}, location {HD}, Shop Efficiency, Today.'),
  (Q, 'should Shop Efficiency count a running shift under 24 hours too?')]),
 ('PQ-1', 'Parts Velocity: how long "Last 90 days" is', [
  (T, 'SV-11514: "The default range is Last 90 Days."'),
  (S, 'on 28 October, Last 90 days runs from 30 July to 28 October, which is 91 days.'),
  (WH, f'{B}, location {DV}, Parts Velocity.'),
  (Q, 'should Last 90 days cover exactly 90 days, today and the 89 days before it?')]),
 ('PQ-2', 'Parts Velocity: which date a sale is counted on', [
  (W, 'sales are dated by the work order\'s end date (Story 5, "Work-order date").'),
  (S, 'work orders have no end date (it is empty on paid work order S2-17193), and the report dates each sale by its invoice date.'),
  (WH, f'{B}, location {HD}, Parts Velocity.'),
  (Q, 'should testers expect sales to be dated by the invoice date?')]),
 ('PQ-3', 'Parts Velocity: a return to the vendor', [
  (W, 'Units Returned counts "a work-order part return or a parts-sale credit".'),
  (S, 'a return to the vendor made from Parts → Returns also counts. Returning 1 unit of ZZAUTOTEST-PV1-10282011 raised Units Returned from 0 to 1, and cancelling it put it back to 0.'),
  (WH, f'{B}, location {DV}, Parts Velocity, part ZZAUTOTEST-PV1-10282011.'),
  (Q, 'should a return to the vendor count in Units Returned?')]),
 ('PQ-4', 'Parts Velocity: the Location column with one location picked', [
  (W, 'S2-R12: the column is hidden "when a single location is in scope". S3-R10 and the Key Decisions: "shown by default … regardless of how many locations are currently selected".'),
  (S, 'with one location picked the column is hidden. Inventory Value shows its Location column with one location picked.'),
  (WH, f'{B}, location {DV}, Parts Velocity, signed in as a user with several locations.'),
  (Q, 'when a user with several locations picks one, should the Location column be hidden?')]),
 ('PQ-5', 'Parts Velocity: the list of date options', [
  (W, 'S2-R2 lists Today and Yesterday, and not Last 12 months.'),
  (S, 'This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 90 days, Last 12 months, Custom. This matches your answer of 5 August and SV-11514. Every option covers the right dates.'),
  (WH, f'{B}, location {DV}, Parts Velocity, date menu.'),
  (Q, 'is the list on screen the one testers should expect?')]),
 ('PQ-7', 'Parts Velocity: Last Sale for a sale with no stock movement', [
  (W, 'Last Sale is "the part\'s most recent sale". S3-N1 calls a billed sale without stock movement "a drop-ship sale".'),
  (S, 'N000000001069 was billed on S2-16621 on 30 July, and Last Sale reads 160 days, which is its sale before that.'),
  (WH, f'{B}, location {HD}, Parts Velocity, part N000000001069.'),
  (Q, 'should Last Sale include a billed sale that moved no stock?')]),
 ('PQ-8', 'Inventory Value: a cost above the highest price band', [
  (W, 'Unit Sell uses "the shop\'s pricing-matrix markup on cost for that part\'s category" (S3-R5).'),
  (S, 'when the cost is above the highest band, the highest band\'s markup is used, the same as on the parts list. Example: 2599273C92, cost $526.70, category HD-Filters with bands up to $500, Unit Sell $752.44.'),
  (WH, f'{B}, location {LE}, Inventory Value, part 2599273C92.'),
  (Q, 'is the highest band\'s markup the one testers should expect?')]),
 ('IQ-1', 'Inventory Value: the words "Total" and "Qty"', [
  (W, 'the totals row has "the literal label \'Total\'" (S4-R1); the downloads say "Totals" (S10-R6). The column is called "Qty on Hand" (S3-R1).'),
  (S, 'the totals row reads "Totals", as on the other reports, and the column heading reads "Qty".'),
  (WH, f'{B}, location {DV}, Inventory Value.'),
  (Q, '(a) Should testers expect "Total" or "Totals" on the totals row? (b) "Qty on Hand" or "Qty" as the column heading?')]),
 ('IQ-2', 'Inventory Value: the message when nothing matches', [
  (W, 'the message is "Empty bays, endless possibilities. Get Going!", "the application\'s standard reports no-data label" (section 7).'),
  (S, 'Inventory Value shows "No record matches these filters" with "Try changing filters to widen your results." Work In Progress, Technician Utilization and the A/R and A/P reports show the same words.'),
  (WH, f'{B}, location {DV}, Inventory Value, search for a part number that does not exist.'),
  (Q, 'is "No record matches these filters" the message testers should expect on reports?')]),
 ('SQ-1', 'Sales By Customer: what Margin % is divided by', [
  (W, 'the Sales By Customer page: Margin % is "the row\'s Margin divided by its Subtotal, times 100" (S7-R11). The Sales By Representative page (section 3): "Sales By Customer computes Margin % from the same Margin base", which is the Subtotal minus Shop Supplies.'),
  (S, 'the Subtotal minus Shop Supplies. Example: TestVT1, this month: Margin $21,960.81, Subtotal $28,569.41, Shop Supplies $2,050.98. The screen shows 82.81 %; Margin ÷ Subtotal would be 76.87 %.'),
  (WH, f'{B}, location {HD}, Sales By Customer, This month, customer TestVT1.'),
  (Q, 'should Margin % on Sales By Customer be divided by (a) the Subtotal, or (b) the Subtotal minus Shop Supplies, as today?')]),
 ('SQ-2', 'Sales By Customer and Sales By Representative: decimals and negative amounts', [
  (W, 'Labor Delta is "rounded to one decimal" on both pages (SBC S12-R2, SBR S9-R2), and Margin % on Sales By Customer is "to one decimal" (S7-R11). Your tickets SV-9199 and SV-9200 (12 August) keep "the signed one-decimal format (+2.0 / -14.0 / 0.0)". SV-9068 and SV-9069 (10 August, "SV standard is 2") asked for two decimals. The Sales By Representative page writes a negative amount as "($1,234.56)".'),
  (S, 'two decimals on both reports (+112.64, +1.00, 82.81 %), and a negative margin as "(-$2.50)", with brackets and a minus sign.'),
  (WH, f'{B}, location {HD}, both reports, This month.'),
  (Q, '(a) Should testers expect one decimal or two for Labor Delta and Margin %? (b) "($2.50)" or "(-$2.50)" for a negative amount?')]),
 ('SQ-3', 'Sales By Representative: a $0.00 invoice nobody paid', [
  (W, '"A zero-total invoice with no payment applied is unpaid and maps to Unpaid" (section 3).'),
  (T, 'SV-9217 (Done, 26 August) shows such an invoice as Paid.'),
  (S, 'Paid.'),
  (WH, f'{B}, location {HD}, Sales By Representative, Last 12 months.'),
  (Q, 'should testers expect Unpaid or Paid for a $0.00 invoice with no payment?')]),
 ('SQ-4', 'Sales By Customer: the asset name', [
  (W, '"The asset label is the vehicle\'s VIN", then the unit number, then the plate (S8-R7 to S8-R10).'),
  (T, 'your ticket SV-9459 (Done, 10 September): "Unit # - Year Make Model", with the VIN only when there is nothing else.'),
  (S, 'the asset name follows SV-9459.'),
  (WH, f'{B}, location {HD}, Sales By Customer, any customer expanded.'),
  (Q, 'can testers follow SV-9459 for the asset name?')]),
 ('SQ-7', 'Sales By Customer and Sales By Representative: the list of date options', [
  (W, 'Sales By Customer offers nine options, "Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week", with no Custom (S2-R2). Sales By Representative offers "Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom" (S2-R2).'),
  (S, 'both reports show This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 12 months, Custom. Every option covers the right dates.'),
  (WH, f'{B}, any location, both reports, date menu.'),
  (Q, 'which list should testers expect on these two reports?')]),
 ('SQ-10', 'Sales By Customer and Sales By Representative: time clocked or parts credited after invoicing', [
  (W, 'Labor Delta is "hours invoiced minus hours worked", and hours worked are "the technician clocked (timesheet) hours recorded against that work order".'),
  (S, 'the reports keep the figures from when the invoice was made. On about 370 of 8,000 invoices this differs from the work order\'s Stats tab today, because time was clocked or parts were credited later. Example: S2-38022 shows Labor Delta +1.00; its Stats tab today shows 2.00 invoiced and 0.00 worked.'),
  (WH, f'{B}, location {HD}, both reports, This month, invoice S2-38022.'),
  (Q, 'should these reports keep the figures from when the invoice was made, as today, or show the figures as they are now?')]),
 ('SQ-6', 'Technician Efficiency: a clock shorter than 36 seconds', [
  (T, 'SV-5450: tech time is "allocated proportionally" and "Each technician receives a proportional share", and the calculation "must follow the existing behavior".'),
  (S, 'when a technician\'s clocks on a line add up to less than 0.01 hours, the line\'s whole tech time is dropped. Example: S3-15255, "Recommend Axle 3 right tires": 30 minutes of tech time, one technician clocked 12 seconds, and the report shows 0.00 instead of 0.50.'),
  (WH, f'{B}, location {LE}, Technician Efficiency, invoice S3-15255.'),
  (Q, 'should that technician still get the line\'s tech time?')]),
 ('SQ-8', 'Sales Tax Collected: unpaid invoices', [
  (W, 'the draft page (Confluence 50200592): a report for "all invoices, Paid, Partially Paid and Unpaid". The training page (15 January 2026) and SV-4233: "Should not show any invoices that are \'Invoiced\'".'),
  (S, 'only Paid and Partially Paid invoices are listed.'),
  (WH, f'{B}, location {HD}, Sales Tax Collected, This month.'),
  (Q, 'should unpaid invoices be listed on Sales Tax Collected?')]),
 ('SQ-9', 'Sales Tax Collected: tax on credit memos', [
  (S, 'the tax totals add up the listed invoices only. Credit memos (returns) made in the same dates do not appear and do not lower the totals.'),
  (WH, f'{B}, location {HD}, Sales Tax Collected, This month.'),
  (Q, 'should the tax totals take off the tax on credit memos made in the same dates?')]),
 ('SQ-11', 'Sales Tax Collected: $0.00 invoices and deposit dates', [
  (T, 'SV-4573: "for partially paid invoices, show the date of the latest payment".'),
  (S, '643 invoices of $0.00 are listed as Paid, with a paid date, and no payment exists on them. On 20 invoices paid partly by a deposit, Invoice Paid Date is the day the invoice was made, not the deposit day (P2-2445: deposit 21 October, report 22 October).'),
  (WH, f'{B}, location {HD}, Sales Tax Collected, This month and Last 12 months.'),
  (Q, '(a) Should a $0.00 invoice with no payment be listed as Paid, with a paid date? (b) When a deposit pays part of an invoice, should Invoice Paid Date be the deposit\'s date?')]),
 ('RQ-1', 'A/R Aging Collection: a credit made on the chosen day', [
  (W, 'the A/R page: "If the calculated days are ≤ 0, the transaction is not past due and it\'s not shown on the report".'),
  (T, 'SV-5606 (Done, January 2026): "Today\'s Credits … displayed with 1 as a Past Due".'),
  (S, 'credit CM2-4462 (E2E Credits Customer), made on 30 September 2026, is listed as 1 day past due on 30 September.'),
  (WH, f'{B}, location {HD}, A/R Aging Collection, date 30 September 2026.'),
  (Q, 'should testers expect a credit made on the chosen day to be (a) left off, or (b) listed with Past Due 1, as today?')]),
 ('RQ-2', 'A/R Aging: a deposit on a part sale', [
  (T, 'SV-11690: A/R agrees with the customer\'s Invoices tab, and a held deposit is not taken off aged A/R.'),
  (S, 'part sale P2-2352 (TestVT1) shows $443.43 on the Invoices tab and $543.43 on A/R Aging, and its $100 deposit DEP-4763 shows "Held". P2-2439 is the same ($21 against $16).'),
  (WH, f'{B}, location {HD}, A/R Aging Detail, customer TestVT1.'),
  (Q, 'once a part sale is invoiced, should its deposit lower its balance on A/R Aging, as it does on the Invoices tab?')]),
 ('RQ-3', 'IBS Batches: the total of a sent batch', [
  (S, 'the batch of 2 October 2026 shows a Total of $9,473.35. Its 9 invoices add up to $9,183.29, and its own IBS file also says $9,183.29.'),
  (WH, f'{B}, location {LE}, IBS Batches, Sent tab.'),
  (Q, 'should a sent batch\'s Total always equal the sum of the invoices and credits in it?')]),
 ('RQ-5', 'IBS Batches: a $0.00 invoice', [
  (S, 'S2-16924 (Fort Mohave Diesel Repair) is listed in Ready to Send with Total $0.00 and Balance $0.00.'),
  (WH, f'{B}, location {HD}, IBS Batches, Ready to Send.'),
  (Q, 'should a $0.00 invoice be listed in Ready to Send?')]),
 ('RQ-4', 'Notes Report: more than 100 notes', [
  (S, 'the report shows up to 100 notes, with no way to see more. "All" shows 100 of 2,545 notes, "Last Week" 100 of 255, and "Filter by Author" 100 of 1,105.'),
  (WH, f'{B}, location {HD}, Notes Report.'),
  (Q, 'should the user be able to see every note in the chosen dates? If not, should the screen say that only 100 are shown?')]),
 ('RQ-6', 'QB Unexported: the No. column', [
  (S, 'the 283 credit memo rows on the Customers tab (Heavy Duty 255, Lethbridge 28) have a blank No.; payment and application rows are blank too. 111 documents appear twice, each with a different error.'),
  (WH, f'{B}, locations {HD} and {LE}, QB Unexported, Customers tab.'),
  (Q, '(a) Should every credit memo row show its number, for example CM2-4476? (b) Should each document appear only once?')]),
 ('RQ-7', 'Export Reports: Terms on the Customer Invoice export', [
  (S, '7 invoices from September 2026 show Terms "Net 30", "Net 50" or "Net 60" in the file, while the invoice and its customer both say COD and the due date is the invoice date (for example S2-31597).'),
  (WH, f'{B}, location {HD}, Export Reports, Customer Invoice, Last month.'),
  (Q, 'should the Terms column show the invoice\'s own term?')]),
 ('RQ-8', 'Export Reports: more than 24 hours in a day on the Payroll Timesheet export', [
  (S, 'in September 2026, Admin Shopview has 40.70 Total Hours on 10 September and 32.34 on 17 September, and Haley Brown 28.50 on 6 September, from clocks that overlap.'),
  (WH, f'{B}, location {HD}, Export Reports, Payroll Timesheet, September 2026.'),
  (Q, 'can one employee\'s day show more than 24 Total Hours?')]),
]
TITLE = 'Dashboard and Reports – questions for Chris Ward'
INTRO = ('We have checked every figure on the Dashboard and on the reports against your pages and tickets. Below are the points where '
         'we would like your confirmation of the expected result. Each one decides what a tester marks as pass or fail. Could you '
         'please write your answer under each question? A short answer is perfect.')
WHERE = ('Where we checked: Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, on 28 October 2026, signed in as an '
         'Admin. Each question names the location and the report to open. We have not checked these on Production or on a QA branch.')
PAGES_P = 'Pages: ' + ', '.join(f'{n} ({v})' for n, _, v in PAGES) + '. The codes in brackets point to the line in your page.'
paras = [(TITLE, 'H1', 0), ('Dear Sir,', 'P', 0), (INTRO, 'P', 0), (WHERE, 'P', len('Where we checked:')), (PAGES_P, 'P', len('Pages:'))]
n = 0; rows = []
for sec, qs in (('Section 1: Dashboard', DASH), ('Section 2: Reports', REP)):
    paras.append((sec, 'H1', 0))
    for qid, title, items in qs:
        n += 1; rows.append(f'| {n} | {qid} | {sec.split(": ")[1]} · {title} |')
        paras.append((f'{n}. {title}', 'H2', 0))
        for lab, txt in items: paras.append((f'{lab} {txt}', 'P', len(lab)))
        paras.append(('Answer:', 'P', len('Answer:')))
paras += [('Thank you very much, Sir.', 'P', 0), ('Bilal Muzamil', 'P', 0)]
u16 = lambda s: len(s.encode('utf-16-le')) // 2
# html copy for the record
h = [f'<html><head><meta charset="utf-8"><title>{html.escape(TITLE)}</title></head><body>']
for t, k, bl in paras:
    tag = {'H1': 'h1', 'H2': 'h2'}.get(k, 'p')
    h.append(f'<{tag}>' + (f'<b>{html.escape(t[:bl])}</b>{html.escape(t[bl:])}' if bl else html.escape(t)) + f'</{tag}>')
open(os.path.join(HERE, 'questions-for-chris-ward-v2.html'), 'w', encoding='utf-8').write('\n'.join(h + ['</body></html>']))
open(os.path.join(HERE, 'QUESTIONS-MAP.md'), 'w', encoding='utf-8').write(
    '# Doc question number → our sheet id (v2, 28 Oct 2026)\n\n| Doc # | Our id | Title |\n|---|---|---|\n' + '\n'.join(rows) + '\n')
if len(sys.argv) < 3:
    print('html + map written;', n, 'questions'); sys.exit()
END, REV = int(sys.argv[1]), sys.argv[2]
text = '\n'.join(p[0] for p in paras)          # inserted at index 1; the doc's final newline closes the last paragraph
reqs = [{'deleteContentRange': {'range': {'startIndex': 1, 'endIndex': END - 1}}}] if END > 2 else []
reqs.append({'insertText': {'location': {'index': 1}, 'text': text}})
reqs.append({'updateParagraphStyle': {'range': {'startIndex': 1, 'endIndex': 1 + u16(text)}, 'paragraphStyle': {'namedStyleType': 'NORMAL_TEXT'}, 'fields': 'namedStyleType'}})
reqs.append({'updateTextStyle': {'range': {'startIndex': 1, 'endIndex': 1 + u16(text)}, 'textStyle': {}, 'fields': 'bold,italic,link'}})
pos = 1
for t, k, bl in paras:
    L = u16(t)
    if k in ('H1', 'H2'):
        reqs.append({'updateParagraphStyle': {'range': {'startIndex': pos, 'endIndex': pos + L}, 'paragraphStyle': {'namedStyleType': 'HEADING_1' if k == 'H1' else 'HEADING_2', 'keepWithNext': True}, 'fields': 'namedStyleType,keepWithNext'}})
    elif bl:
        reqs.append({'updateTextStyle': {'range': {'startIndex': pos, 'endIndex': pos + u16(t[:bl])}, 'textStyle': {'bold': True}, 'fields': 'bold'}})
    if t == WHERE:
        s = t.index('https://'); e = t.index(')', s)
        reqs.append({'updateTextStyle': {'range': {'startIndex': pos + u16(t[:s]), 'endIndex': pos + u16(t[:e])}, 'textStyle': {'link': {'url': t[s:e]}}, 'fields': 'link'}})
    if t == PAGES_P:
        for name, url, _ in PAGES:
            s = t.index(name)
            reqs.append({'updateTextStyle': {'range': {'startIndex': pos + u16(t[:s]), 'endIndex': pos + u16(t[:s + len(name)])}, 'textStyle': {'link': {'url': url}}, 'fields': 'link'}})
    pos += L + 1
json.dump({'requests': reqs, 'writeControl': {'requiredRevisionId': REV}}, open(sys.argv[3] if len(sys.argv) > 3 else os.path.join(HERE, 'requests-v2.json'), 'w'), ensure_ascii=False)
print(n, 'questions ·', len(reqs), 'requests · chars', u16(text))
