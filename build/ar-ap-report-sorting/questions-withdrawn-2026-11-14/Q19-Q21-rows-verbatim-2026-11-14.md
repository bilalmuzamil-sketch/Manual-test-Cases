# A/R and A/P question sheet: questions 19 and 21, copied before their rows were deleted (14 Nov 2026)

Sheet 11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA, tab "Questions for Chris", rows 29 (question 19) and 31 (question 21), read 14 Nov 2026.
Answer column (E) empty for both. Withdrawn with the QA lead's "OK" (14 Nov 2026): the PRD itself settles both, version 13 S5-R10b
(any as-of date, including after today) and version 12 S3-R7b (grouped PDFs end each group with "Total for <name>"); both match option (a).
Rule 131 as amended 13 Nov 2026: row deleted, copy kept here, the other questions keep their numbers.

## Row 29 — question 19

- B: A/R and A/P Report Sorting: picking an as-of date after today
- C: Today, on all six reports, you can pick an as-of date after today and see how the open invoices and bills will have aged by then. On the new version the calendar greys out every day after today, and a saved link with a later date opens on today instead. Which is right?
  (a) Keep it as today: a date after today can be picked, and a saved link with one opens on that date.
  (b) The new limit is intended: no date after today.
  (c) Something else (please say).

  Try it: on app.shopview.com open Reports, then A/R Aging Summary, click the date, go to next month and pick the 31st: the report recalculates (a customer's Current amount moves into the past-due columns). On the QA site https://sv11315.qa.shopview.com do the same: the days after today are greyed out.
- D: The spec does not mention the latest date that can be picked. The developers' technical plan (decision D20) limits it to today. Before the release the date has no latest limit, and the A/P reports are written to handle a date after today. Until you answer, our tests expect today's behaviour (a), so they fail on the new version.
- E: (empty)
- F: Production (v26.45.3) and the QA site, both checked 11 Nov 2026; PRD v11 (5 Nov 2026) says nothing about it; tech plan decision D20; Jira SV-11535 (Story 5)

## Row 31 — question 21

- B: A/R and A/P Report Sorting: "Subtotal" instead of "Total for ..." in the PDFs
- C: Today the A/R Aging Collection PDF ends each customer with "Total for" and the customer's name (for example "Total for aqeel transport 56"), and the A/R Aging Detail PDF ends each bucket with "Total for 1-30 days past due" and so on. On the new version these lines read only "Subtotal"; the amounts are correct. Which is right?
  (a) Keep "Total for" with the customer's name or the bucket's name, as today.
  (b) "Subtotal" is intended (part of the app-wide PDF format).
  (c) Something else (please say).

  Try it: on A/R Aging Collection pick one customer with past-due invoices and download the PDF, on production (Print) and on the QA site (Export, then Download (PDF)); compare the last line under the customer.
- D: The spec says the PDF uses "the app-wide report PDF format, the same as Sales By Customer and Inventory Value", which may be why the label changed, but it does not mention these lines. On screen, the new version still shows "Total for" lines. Until you answer, our tests expect today's wording (a).
- E: (empty)
- F: Production (v26.45.3) and the QA site, both checked 11 Nov 2026; PRD v11 (5 Nov 2026) S3-R7a; Jira SV-11533 (Story 3)
