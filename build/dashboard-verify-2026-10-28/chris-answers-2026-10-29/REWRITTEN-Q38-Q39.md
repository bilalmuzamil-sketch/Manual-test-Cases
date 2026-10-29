# Questions 38 and 39, rewritten for Chris Ward (29 Oct 2026)

**Why:** our first versions of these two questions had mistakes. Chris answered both "Defect", but he answered
what we wrote, so we are asking again with the facts corrected. The text below is ready to paste. Nothing has
been sent yet; it waits for the QA lead.

- **Q38's mistake:** we wrote that the invoices "and their customers" were COD. The invoices are COD. The
  customers' cards now say Net 30, 50 or 60, which is the same term the file shows. So the file is not inventing
  a term; it takes the customer's term as it is today instead of the invoice's own term.
- **Q39's mistake:** we quoted 40.70 hours (10 Sep) and 32.34 hours (17 Sep) for Admin Shopview. Those figures
  were read with the wrong time zone. With the time zone set correctly they are 7.70 and 12.10 hours, which is
  not a problem. Haley Brown's 28.50 hours on 6 Sep was right, and we have made the problem happen again on fresh
  data.

Both defects are still real after the correction. No Jira ticket was filed from the old wording: the two drafts
(D7 for 38, A5 for 39) were already written from the re-checked facts and are still unfiled.

---

## 38 (rewritten). Export Reports: which Terms the Customer Invoice export should show

*This replaces our first question 38, which said the customers were on COD. They are not any more; see below.*

What we see on screen: the Terms column of the Customer Invoice export shows the customer's term as it is today,
not the term written on the invoice.

- We made a fresh example at DVI Test on 28 Oct 2026. The customer was on COD and invoice S1-38216 was made, so the
  invoice says Terms COD and is due the same day. We then changed the customer to Net 30. The export now shows
  Terms **Net 30** for S1-38216, while the invoice itself still says **COD**, due the same day.
- Older example, Staging Heavy Duty - 9919, September 2026: 7 invoices say COD and are due on the invoice date
  (for example S2-31597). Their customers' cards now say Net 30, 50 or 60, and the export shows that term.

Where to see it: Staging, build v26.43.2-f8698cb. Export Reports → Customer Invoice. For S1-38216: location DVI
Test, Custom 28 Oct 2026 to 28 Oct 2026. For S2-31597: location Staging Heavy Duty - 9919, September 2026. Checked
with the computer set to each location's own time zone (Toronto and Karachi).

The new Credit Terms story SV-11676 says: "An invoice keeps the term and due date it was created with. Changing
the customer's term later … never changes an existing invoice."

Question: in the Customer Invoice export, should Terms show the invoice's own term (COD for S1-38216), or the
customer's term as it is today (Net 30)?

Answer:

---

## 39 (rewritten). Export Reports: overlapping timesheets on the Payroll Timesheet export

*This replaces our first question 39. Its Admin Shopview figures (40.70 and 32.34 hours) were wrong: they were
read with the wrong time zone. The correct figures are 7.70 and 12.10 hours, which are fine.*

What we see on screen: when one person has two timesheets at the same time, the Payroll Timesheet export adds
both in full, so the same minutes are counted twice.

- Fresh example, DVI Test, 28 Oct 2026, Admin Shopview. One timesheet runs from 7:39 PM to 8:34 PM (0.92 hours)
  and another from 8:08 PM to 8:41 PM (0.55 hours). They overlap from 8:08 to 8:34 PM. Together they cover
  7:39 to 8:41 PM, which is 1.03 hours. Admin Shopview also has 0.06 hours of short timesheets that day.
  - The export shows 0.92 + 0.55 + 0.06 = **1.53 hours**.
  - Counting the overlap once would give 1.03 + 0.06 = **1.09 hours**.
- Older example, Staging Heavy Duty - 9919: Haley Brown shows **28.50 hours on 6 Sep 2026** (and 24.50 on 2 Sep).
  All 15 of her timesheets on 6 Sep fall between 7:00 PM and 9:00 PM, so they cover 2.00 hours.

Where to see it: Staging, build v26.43.2-f8698cb. Export Reports → Payroll Timesheet. Fresh example: location DVI
Test, Custom 28 Oct 2026 to 28 Oct 2026. Haley Brown: location Staging Heavy Duty - 9919, September 2026. Checked
with the computer set to each location's own time zone (Toronto and Karachi).

Question (a): when one person's timesheets overlap, should the export count the overlapping time once (1.09 hours
above, 2.00 hours for Haley Brown), so that no day can go over 24 hours?

Answer:

We also saw a second, separate thing on the same export. Admin Shopview shows **24.33 hours on 19 Sep 2026** at
Heavy Duty. Part of this comes from a timesheet that ran from 11:40 PM to 11:59 PM on 18 Sep: those minutes are
added to 19 Sep instead of 18 Sep.

Question (b): should the part of a timesheet that falls before midnight always count on the day it was worked?

Answer:
