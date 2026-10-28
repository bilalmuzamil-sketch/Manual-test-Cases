<!-- Verbatim text of the Google Doc "Dashboard and Reports – questions for Chris Ward" (id 1mEcB4cpsOqZXeim0vzmlbam2xSB02YshnyYRY0dk9s8), read through the Docs API on 2026-10-28 23:5x UTC, revision AHj4eMQPKEUJxH3-m_PWtTF_…. All 39 answers present (Q39 was added after the first read). -->

# Dashboard and Reports – questions for Chris Ward

Dear Sir,

We have checked every figure on the Dashboard and on the reports against PRDs and tickets. Below are the points where we would like your confirmation of the expected result. Each one decides what a tester marks as pass or fail. Could you please write your answer under each question? A short answer is perfect.

Where we checked: Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, on 28 October 2026, signed in as an Admin. Each question names the location and the report to open. We have not checked these on Production or on a QA branch.

PRDs: Dashboard (version 53, 22 October), Work In Progress (version 28, 24 August), Technician Utilization (version 9, 13 August), Parts Velocity (version 12, 14 September), Inventory Value (13 August), Sales By Customer (version 22, 19 October), Sales By Representative (version 30, 21 October). The codes in brackets point to the line in your PRD.

# Section 1: Dashboard

## 1. Technician Efficiency: a line the customer declined

What the PRD says: "Invoiced technician hours" is "the technician time recorded on work order lines" (section 4), and "Invoiced hours" is "the labor time billed on work order lines". A voided invoice adds nothing to either (S3-E2).

What we see on screen: on work order S1-38198 only line 1 was billed; the customer declined line 2. The technician shows 2.00 Invoiced Tech Hrs and 133.33 %. The Billing Efficiency tile does not count the declined line.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Dashboard, This week.

Question: should the technician time on a declined line count in Technician Efficiency? (a) Yes, as today. (b) No, only lines that were billed count.

Answer: 1. (b) Only billed lines count. A declined line wasn't invoiced, so its tech time shouldn't count either. Defect.

## 2. Revenue: a discount on the work order

What the PRD says: Revenue is the "sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos" (S3-R2).

What we see on screen: work order S1-38200 has $135.00 of labor and a $20.00 discount. The invoice prints Subtotal $115.00, and Revenue counts $115.00.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Dashboard, This week.

Question: should Revenue count (a) $115.00, the invoice subtotal after the discount, as today, or (b) $135.00, the amount before the discount?

Answer: 2. (a) $115.00. Revenue is what the customer was charged, after the discount. Keep the screen; S3-R2 gets updated.

## 3. Revenue split when a share is negative

What we see on screen: when credit memos or discounts are larger than one part of the sales, the line under Revenue reads, for example, "Parts -28% · Labor 130% · Other -2%". The three add up to 100.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Dashboard, This month (a $400.00 credit memo, CM1-4535, is in the range).

Question: is this how the split should read? If not, how should it read?

Answer: 3. Hide the split line whenever any share is negative. Only show it when all three are 0% or more. Defect.

# Section 2: Reports

## 4. Work In Progress: Days Open

What the PRD says: "Days Open shows the whole number of days since the work order was created — elapsed time divided by 24 hours, floored … a same-day work order shows '0 days'" (S4-R12).

What we see on screen: Days Open counts calendar dates. S2-38105, created on 28 October at 3:19 PM, shows "1 days" ten hours later.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Work In Progress.

Question: should testers expect whole 24-hour periods, as on the PRD, or calendar dates, as on screen?

Answer: 4. Calendar dates, as the screen does. That was a deliberate change in SV-9403, so S4-R12 gets updated. One defect: it should read "1 day", not "1 days".

## 5. Work In Progress: how a negative amount is written

What the PRD says: a negative value shows a leading minus before the "$", for example "-$1,234.56" (S4-R14), and the Totals row uses the same formats (S6-R5).

What we see on screen: the Totals row shows a negative amount as "(-$3.13)", with brackets and a minus sign.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Work In Progress, Totals row.

Question: which should testers expect: "-$3.13" or "(-$3.13)"?

Answer: 5. No, keep "(-$3.13)". Brackets plus the minus is the standard for every column on every report, on screen and in the downloads. S4-R14 and S6-R5 get updated to match.

## 6. Work In Progress: a part marked "received later"

What the PRD says: a received part counts as earned, and a part "ordered but not yet received" counts as remaining (S4-R18).

What we see on screen: a part request marked "received later" counts in Parts Remaining.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Work In Progress.

Question: is Parts Remaining the right place for a part marked "received later"? If not, where should it count?

Answer: 6. No, it belongs in Parts Earned. "Received later" means the part is already on the job and only the receiving paperwork waits. Defect. S4-R18 gets updated.

## 7. Work In Progress: an in-stock part not yet picked

What the PRD says: Parts Remaining is parts "ordered but not yet received" (S4-R18).

What we see on screen: a part that is in stock but not yet picked for the job also counts in Parts Remaining.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Work In Progress.

Question: is Parts Remaining the right place for such a part? If not, where should it count?

Answer: 7. Yes, Parts Remaining is right, since it isn't on the job yet. S4-R18 will say "not yet received or picked".

## 8. Work In Progress: an estimate with nothing approved

What the PRD says: S4-E1 and S2-R4 describe an open estimate with nothing approved as "$0.00 for every money column, including Total". S3-R5, S5-R8 and your ruling on SV-9027 (10 August) value the Estimates row at its unapproved lines.

What we see on screen: the Estimates row is valued at its unapproved lines, as in S3-R5 and SV-9027.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Work In Progress, Estimates tab.

Question: can testers follow S3-R5 and SV-9027 for this case?

Answer: 8. Yes, reword S4-E1 and S2-R4 to match S3-R5.

## 9. Technician Utilization: decimal places

What the PRD says: "Utilization % shows one decimal place followed by a percent sign, rounded round-half-up (e.g., 66.65% → 66.7%)" (S2-R7).

What the ticket says: SV-9059 asked for two decimals.

What we see on screen: two decimals, for example 85.71%.

Where to see it: Staging, build v26.43.2-f8698cb, locations Staging Heavy Duty - 9919 and DVI Test, Technician Utilization.

Question: should testers expect (a) one decimal or (b) two decimals?

Answer: 9. (b) Two decimals. S2-R7 gets updated.

## 10. Technician Utilization: a technician with only a few seconds clocked

What we see on screen: a technician whose only clocks are a few seconds long is listed with 0.00 hours and Utilization "—".

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Technician Utilization.

Question: should such a technician be listed, or left off the report?

Answer: 10. Leave them off the report. Under 0.01 hours counts as no time. S2-R7 gets updated.

## 11. Technician Utilization and Timesheet Activities: time on a deleted work order

What we see on screen: time clocked on a work order that was later deleted still counts as WO Hours, and Timesheet Activities shows it with a blank Work Order. There are 5 such clocks this year.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, This year.

Question: should that time still count as WO Hours?

Answer: 11. Yes, it still counts as WO Hours, because the tech worked it. Timesheet Activities should show "Deleted work order" instead of a blank. Defect for the blank.

## 12. Shop Efficiency: a shift that is still running

What the ticket says: your ruling on SV-11688 (22 October): a running shift under 24 hours counts on Technician Utilization and Timesheet Activities.

What we see on screen: Shop Efficiency leaves every running clock out of Total Clocked Hours.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Shop Efficiency, Today.

Question: should Shop Efficiency count a running shift under 24 hours too?

Answer: 12. Yes, same rule as SV-11688: a running shift under 24 hours counts. Defect.

## 13. Parts Velocity: how long "Last 90 days" is

What the ticket says: SV-11514: "The default range is Last 90 Days."

What we see on screen: on 28 October, Last 90 days runs from 30 July to 28 October, which is 91 days.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Parts Velocity.

Question: should Last 90 days cover exactly 90 days, today and the 89 days before it?

Answer: 13. Yes, exactly 90 days: today and the 89 before it. Defect.

## 14. Parts Velocity: which date a sale is counted on

What the PRD says: sales are dated by the work order's end date (Story 5, "Work-order date").

What we see on screen: work orders have no end date (it is empty on paid work order S2-17193), and the report dates each sale by its invoice date.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Parts Velocity.

Question: should testers expect sales to be dated by the invoice date?

Answer: 14. Yes, invoice date. Story 5 gets updated.

## 15. Parts Velocity: a return to the vendor

What the PRD says: Units Returned counts "a work-order part return or a parts-sale credit".

What we see on screen: a return to the vendor made from Parts → Returns also counts. Returning 1 unit of ZZAUTOTEST-PV1-10282011 raised Units Returned from 0 to 1, and cancelling it put it back to 0.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Parts Velocity, part ZZAUTOTEST-PV1-10282011.

Question: should a return to the vendor count in Units Returned?

Answer: 15. No. Only customer returns count: work order part returns and part sale credits. Defect.

## 16. Parts Velocity: the Location column with one location picked

What the PRD says: S2-R12: the column is hidden "when a single location is in scope". S3-R10 and the Key Decisions: "shown by default … regardless of how many locations are currently selected".

What we see on screen: with one location picked the column is hidden. Inventory Value shows its Location column with one location picked.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Parts Velocity, signed in as a user with several locations.

Question: when a user with several locations picks one, should the Location column be hidden?

Answer: 16. No, always show it, the same as S3-R10, the Key Decisions and Inventory Value. Drop the hide rule from S2-R12. Defect.

## 17. Parts Velocity: the list of date options

What the PRD says: S2-R2 lists Today and Yesterday, and not Last 12 months.

What we see on screen: This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 90 days, Last 12 months, Custom. This matches your answer of 5 August and SV-11514. Every option covers the right dates.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Parts Velocity, date menu.

Question: is the list on screen the one testers should expect?

Answer: 17. Yes, the screen list is right. S2-R2 gets updated.

## 18. Parts Velocity: Last Sale for a sale with no stock movement

What the PRD says: Last Sale is "the part's most recent sale". S3-N1 calls a billed sale without stock movement "a drop-ship sale".

What we see on screen: N000000001069 was billed on S2-16621 on 30 July, and Last Sale reads 160 days, which is its sale before that.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Parts Velocity, part N000000001069.

Question: should Last Sale include a billed sale that moved no stock?

Answer: 18. Yes, any billed sale counts, with or without stock movement. Defect.

## 19. Inventory Value: a cost above the highest price band

What the PRD says: Unit Sell uses "the shop's pricing-matrix markup on cost for that part's category" (S3-R5).

What we see on screen: when the cost is above the highest band, the highest band's markup is used, the same as on the parts list. Example: 2599273C92, cost $526.70, category HD-Filters with bands up to $500, Unit Sell $752.44.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Lethbridge - 4310, Inventory Value, part 2599273C92.

Question: is the highest band's markup the one testers should expect?

Answer: 19. Yes, that's right, and it matches the parts list. S3-R5 gets updated.

## 20. Inventory Value: the words "Total" and "Qty"

What the PRD says: the totals row has "the literal label 'Total'" (S4-R1); the downloads say "Totals" (S10-R6). The column is called "Qty on Hand" (S3-R1).

What we see on screen: the totals row reads "Totals", as on the other reports, and the column heading reads "Qty".

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Inventory Value.

Question: (a) Should testers expect "Total" or "Totals" on the totals row? (b) "Qty on Hand" or "Qty" as the column heading?

Answer: 20. (a) "Totals". S4-R1 gets updated. (b) Neither. The standard is now "On Hand", the same as Parts Velocity, on screen and in the download. Defect for Inventory Value.

## 21. Inventory Value: the message when nothing matches

What the PRD says: the message is "Empty bays, endless possibilities. Get Going!", "the application's standard reports no-data label" (section 7).

What we see on screen: Inventory Value shows "No record matches these filters" with "Try changing filters to widen your results." Work In Progress, Technician Utilization and the A/R and A/P reports show the same words.

Where to see it: Staging, build v26.43.2-f8698cb, location DVI Test, Inventory Value, search for a part number that does not exist.

Question: is "No record matches these filters" the message testers should expect on reports?

Answer: 21. Yes, it's the standard now. Section 7 gets updated.

## 22. Sales By Customer: what Margin % is divided by

What the PRD says: the Sales By Customer PRD: Margin % is "the row's Margin divided by its Subtotal, times 100" (S7-R11). The Sales By Representative PRD (section 3): "Sales By Customer computes Margin % from the same Margin base", which is the Subtotal minus Shop Supplies.

What we see on screen: the Subtotal minus Shop Supplies. Example: TestVT1, this month: Margin $21,960.81, Subtotal $28,569.41, Shop Supplies $2,050.98. The screen shows 82.81 %; Margin ÷ Subtotal would be 76.87 %.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Sales By Customer, This month, customer TestVT1.

Question: should Margin % on Sales By Customer be divided by (a) the Subtotal, or (b) the Subtotal minus Shop Supplies, as today?

Answer: 22. (b) Subtotal minus Shop Supplies, as today. S7-R11 gets updated.

## 23. Sales By Customer and Sales By Representative: decimals and negative amounts

What the PRD says: Labor Delta is "rounded to one decimal" on both PRDs (SBC S12-R2, SBR S9-R2), and Margin % on Sales By Customer is "to one decimal" (S7-R11). Your tickets SV-9199 and SV-9200 (12 August) keep "the signed one-decimal format (+2.0 / -14.0 / 0.0)". SV-9068 and SV-9069 (10 August, "SV standard is 2") asked for two decimals. The Sales By Representative PRD writes a negative amount as "($1,234.56)".

What we see on screen: two decimals on both reports (+112.64, +1.00, 82.81 %), and a negative margin as "(-$2.50)", with brackets and a minus sign.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, both reports, This month.

Question: (a) Should testers expect one decimal or two for Labor Delta and Margin %? (b) "($2.50)" or "(-$2.50)" for a negative amount?

Answer: 23. (a) Two decimals for both. Labor Delta already shows two on every report, so the PRDs get updated. Margin % will be two on every report; Inventory Value and Parts Velocity move from one to two in a follow-up ticket. (b) Keep "(-$2.50)". Brackets plus the minus is the standard on every report. The Sales By Representative PRD gets updated.

## 24. Sales By Representative: a $0.00 invoice nobody paid

What the PRD says: "A zero-total invoice with no payment applied is unpaid and maps to Unpaid" (section 3).

What the ticket says: SV-9217 (Done, 26 August) shows such an invoice as Paid.

What we see on screen: Paid.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Sales By Representative, Last 12 months.

Question: should testers expect Unpaid or Paid for a $0.00 invoice with no payment?

Answer: 24. Paid, per SV-9217. Nothing is owed, so it's settled. The PRD gets updated.

## 25. Sales By Customer: the asset name

What the PRD says: "The asset label is the vehicle's VIN", then the unit number, then the plate (S8-R7 to S8-R10).

What the ticket says: your ticket SV-9459 (Done, 10 September): "Unit # - Year Make Model", with the VIN only when there is nothing else.

What we see on screen: the asset name follows SV-9459.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Sales By Customer, any customer expanded.

Question: can testers follow SV-9459 for the asset name?

Answer: 25. Yes, keep SV-9459. S8-R7 to S8-R10 get updated.

## 26. Sales By Customer and Sales By Representative: the list of date options

What the PRD says: Sales By Customer offers nine options, "Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week", with no Custom (S2-R2). Sales By Representative offers "Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom" (S2-R2).

What we see on screen: both reports show This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 12 months, Custom. Every option covers the right dates.

Where to see it: Staging, build v26.43.2-f8698cb, any location, both reports, date menu.

Question: which list should testers expect on these two reports?

Answer: 26. The on-screen list for both reports. Both S2-R2s get updated.

## 27. Sales By Customer and Sales By Representative: time clocked or parts credited after invoicing

What the PRD says: Labor Delta is "hours invoiced minus hours worked", and hours worked are "the technician clocked (timesheet) hours recorded against that work order".

What we see on screen: the reports keep the figures from when the invoice was made. On about 370 of 8,000 invoices this differs from the work order's Stats tab today, because time was clocked or parts were credited later. Example: S2-38022 shows Labor Delta +1.00; its Stats tab today shows 2.00 invoiced and 0.00 worked.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, both reports, This month, invoice S2-38022.

Question: should these reports keep the figures from when the invoice was made, as today, or show the figures as they are now?

Answer: 27. Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect.

## 28. Technician Efficiency: a clock shorter than 36 seconds

What the ticket says: SV-5450: tech time is "allocated proportionally" and "Each technician receives a proportional share", and the calculation "must follow the existing behavior".

What we see on screen: when a technician's clocks on a line add up to less than 0.01 hours, the line's whole tech time is dropped. Example: S3-15255, "Recommend Axle 3 right tires": 30 minutes of tech time, one technician clocked 12 seconds, and the report shows 0.00 instead of 0.50.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Lethbridge - 4310, Technician Efficiency, invoice S3-15255.

Question: should that technician still get the line's tech time?

Answer: 28. Yes. Split on the real time clocked and round only for display, so that tech gets the full 0.50. Defect.

## 29. Sales Tax Collected: unpaid invoices

What the PRD says: the draft PRD (Confluence 50200592): a report for "all invoices, Paid, Partially Paid and Unpaid". The training PRD (15 January 2026) and SV-4233: "Should not show any invoices that are 'Invoiced'".

What we see on screen: only Paid and Partially Paid invoices are listed.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Sales Tax Collected, This month.

Question: should unpaid invoices be listed on Sales Tax Collected?

Answer: 29. No. Keep it as today: Paid and Partially Paid only.

## 30. Sales Tax Collected: tax on credit memos

What we see on screen: the tax totals add up the listed invoices only. Credit memos (returns) made in the same dates do not appear and do not lower the totals.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Sales Tax Collected, This month.

Question: should the tax totals take off the tax on credit memos made in the same dates?

Answer: 30. Yes. Show credit memos as negative rows on their date, and take their tax off the totals. Defect.

## 31. Sales Tax Collected: $0.00 invoices and deposit dates

What the ticket says: SV-4573: "for partially paid invoices, show the date of the latest payment".

What we see on screen: 643 invoices of $0.00 are listed as Paid, with a paid date, and no payment exists on them. On 20 invoices paid partly by a deposit, Invoice Paid Date is the day the invoice was made, not the deposit day (P2-2445: deposit 21 October, report 22 October).

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Sales Tax Collected, This month and Last 12 months.

Question: (a) Should a $0.00 invoice with no payment be listed as Paid, with a paid date? (b) When a deposit pays part of an invoice, should Invoice Paid Date be the deposit's date?

Answer: 31. (a) No, leave $0.00 invoices off this report, since no money or tax was collected. (b) Yes, use the latest payment date, deposits included, per SV-4573. Both are defects.

## 32. A/R Aging Collection: a credit made on the chosen day

What the PRD says: the A/R PRD: "If the calculated days are ≤ 0, the transaction is not past due and it's not shown on the report".

What the ticket says: SV-5606 (Done, January 2026): "Today's Credits … displayed with 1 as a Past Due".

What we see on screen: credit CM2-4462 (E2E Credits Customer), made on 30 September 2026, is listed as 1 day past due on 30 September.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, A/R Aging Collection, date 30 September 2026.

Question: should testers expect a credit made on the chosen day to be (a) left off, or (b) listed with Past Due 1, as today?

Answer: 32. Not a defect for now. Today matches SV-5606. SV-11441 will decide how a same-day credit ages after a QuickBooks check, so please link your finding there.

## 33. A/R Aging: a deposit on a part sale

What the ticket says: SV-11690: A/R agrees with the customer's Invoices tab, and a held deposit is not taken off aged A/R.

What we see on screen: part sale P2-2352 (TestVT1) shows $443.43 on the Invoices tab and $543.43 on A/R Aging, and its $100 deposit DEP-4763 shows "Held". P2-2439 is the same ($21 against $16).

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, A/R Aging Detail, customer TestVT1.

Question: once a part sale is invoiced, should its deposit lower its balance on A/R Aging, as it does on the Invoices tab?

Answer: 33. Yes. Once the part sale is invoiced, its deposit lowers the A/R balance to match the Invoices tab. That's the same rule as SV-11690. Defect.

## 34. IBS Batches: the total of a sent batch

What we see on screen: the batch of 2 October 2026 shows a Total of $9,473.35. Its 9 invoices add up to $9,183.29, and its own IBS file also says $9,183.29.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Lethbridge - 4310, IBS Batches, Sent tab.

Question: should a sent batch's Total always equal the sum of the invoices and credits in it?

Answer: 34. Yes, always. Defect.

## 35. IBS Batches: a $0.00 invoice

What we see on screen: S2-16924 (Fort Mohave Diesel Repair) is listed in Ready to Send with Total $0.00 and Balance $0.00.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, IBS Batches, Ready to Send.

Question: should a $0.00 invoice be listed in Ready to Send?

Answer: 35. No, leave $0.00 invoices out of Ready to Send. Defect.

## 36. Notes Report: more than 100 notes

What we see on screen: the report shows up to 100 notes, with no way to see more. "All" shows 100 of 2,545 notes, "Last Week" 100 of 255, and "Filter by Author" 100 of 1,105.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Notes Report.

Question: should the user be able to see every note in the chosen dates? If not, should the screen say that only 100 are shown?

Answer: 36. Yes, show every note in the chosen dates, with paging. Defect.

## 37. QB Unexported: the No. column

What we see on screen: the 283 credit memo rows on the Customers tab (Heavy Duty 255, Lethbridge 28) have a blank No.; payment and application rows are blank too. 111 documents appear twice, each with a different error.

Where to see it: Staging, build v26.43.2-f8698cb, locations Staging Heavy Duty - 9919 and Staging Lethbridge - 4310, QB Unexported, Customers tab.

Question: (a) Should every credit memo row show its number, for example CM2-4476? (b) Should each document appear only once?

Answer: 37. (a) Yes, every row shows its number. (b) Yes, one row per document, showing its latest error. Both are defects.

## 38. Export Reports: Terms on the Customer Invoice export

What we see on screen: 7 invoices from September 2026 show Terms "Net 30", "Net 50" or "Net 60" in the file, while the invoice and its customer both say COD and the due date is the invoice date (for example S2-31597).

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Export Reports, Customer Invoice, Last month.

Question: should the Terms column show the invoice's own term?

Answer: 38. Yes, the invoice's own term. Defect.

## 39. Export Reports: more than 24 hours in a day on the Payroll Timesheet export

What we see on screen: in September 2026, Admin Shopview has 40.70 Total Hours on 10 September and 32.34 on 17 September, and Haley Brown 28.50 on 6 September, from clocks that overlap.

Where to see it: Staging, build v26.43.2-f8698cb, location Staging Heavy Duty - 9919, Export Reports, Payroll Timesheet, September 2026.

Question: can one employee's day show more than 24 Total Hours?

Answer: 39. No. Overlapping time counts once, so a day can't go over 24. Defect.

Thank you very much, Sir.

Bilal Muzamil

Ready for more! -Chris W
