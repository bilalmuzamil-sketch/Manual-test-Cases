# Chris Ward answers, Section 3 (38 corrected, 39 corrected (a)/(b), 40). VERBATIM copy

Source: Google Doc "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", https://docs.google.com/document/d/1mEcB4cpsOqZXeim0vzmlbam2xSB02YshnyYRY0dk9s8/edit. Doc last modified 2026-11-03 16:09 UTC (Drive). Read 2026-11-04 by this session. Section 3 copied unchanged below.

Section 3: Questions 38 and 39 again, with the facts corrected

Dear Sir, our first versions of questions 38 and 39 had mistakes, which we found when we checked again on 29 October. You answered what we wrote, so we are asking both again here with the facts corrected. Your first answers stay above, as you wrote them.

38 (corrected). Export Reports: which Terms the Customer Invoice export should show

What was wrong in our first question: we wrote that the invoices and their customers were on COD. The invoices are COD, but their customers' cards now say Net 30, Net 50 or Net 60, which is the term the file shows.

What we see on screen: the Terms column of the Customer Invoice export shows the customer's term as it is today, not the term written on the invoice. Fresh example at DVI Test on 28 October 2026: the customer was on COD when invoice S1-38216 was made, so the invoice says Terms COD and is due the same day. We then changed the customer to Net 30. The export now shows Terms Net 30 for S1-38216, while the invoice itself still says COD. Older example at Staging Heavy Duty - 9919: 7 invoices from September 2026 say COD and are due on the invoice date (for example S2-31597). Their customers now say Net 30, Net 50 or Net 60, and the export shows that term.

Where to see it: Staging, build v26.43.2-f8698cb, Export Reports, Customer Invoice. For S1-38216: location DVI Test, Custom 28 Oct 2026 to 28 Oct 2026. For S2-31597: location Staging Heavy Duty - 9919, September 2026. Checked with the time zone set to each location's own (Toronto and Karachi).

Related story: the Credit Terms story SV-11676 says "An invoice keeps the term and due date it was created with. Changing the customer's term later … never changes an existing invoice."

Question: should Terms show the invoice's own term (COD for S1-38216), or the customer's term as it is today (Net 30)?

Answer: 38 (corrected). The invoice's own term: COD for S1-38216. An invoice keeps the term it was made with, and changing the customer's term later never changes it (SV-11676). Defect.

39 (corrected). Export Reports: overlapping timesheets on the Payroll Timesheet export

What was wrong in our first question: the Admin Shopview figures (40.70 hours on 10 September and 32.34 hours on 17 September) were read with the wrong time zone. With the right time zone they are 7.70 and 12.10 hours, which are fine. Haley Brown's 28.50 hours on 6 September was right.

What we see on screen: when one person has two timesheets at the same time, the Payroll Timesheet export adds both in full, so the same minutes are counted twice. Fresh example at DVI Test on 28 October 2026, Admin Shopview: one timesheet runs from 7:39 PM to 8:34 PM (0.92 hours) and another from 8:08 PM to 8:41 PM (0.55 hours). Together they cover 7:39 PM to 8:41 PM, which is 1.03 hours, and there are 0.06 hours of short timesheets that day. The export shows 0.92 + 0.55 + 0.06 = 1.53 hours. Counting the overlap once gives 1.03 + 0.06 = 1.09 hours. Older example at Staging Heavy Duty - 9919: Haley Brown shows 28.50 hours on 6 September 2026, although all 15 of her timesheets that day fall between 7:00 PM and 9:00 PM (2.00 hours).

Where to see it: Staging, build v26.43.2-f8698cb, Export Reports, Payroll Timesheet. Fresh example: location DVI Test, Custom 28 Oct 2026 to 28 Oct 2026. Haley Brown: location Staging Heavy Duty - 9919, September 2026. Checked with the time zone set to each location's own (Toronto and Karachi).

Question (a): when one person's timesheets overlap, should the export count the overlapping time once (1.09 hours in the fresh example, 2.00 hours for Haley Brown), so that no day can go over 24 hours?

Answer (a):  39 (corrected) (a). Yes. Overlapping time counts once, so a person is never paid twice for the same minutes: 1.09 hours in the fresh example and 2.00 hours for Haley Brown. A day can't go over 24 hours. Defect.

Also seen on the same export: Admin Shopview shows 24.33 hours on 19 September 2026 at Heavy Duty. Part of this is a timesheet from 11:40 PM to 11:59 PM on 18 September, which is counted on 19 September instead.

Question (b): should the part of a timesheet worked before midnight always count on the day it was worked?

Answer (b): 39 (corrected) (b). Yes. Time counts on the day it was worked, in the location's time zone. A timesheet that runs past midnight is split at midnight. Defect.

40. NEW question: Parts Velocity – how Last Sale counts the days

What we see on screen: the Last Sale column counts full 24-hour periods since the sale, not calendar days. A part sold yesterday afternoon still reads "0 days" this morning. Example at DVI Test: ZZAUTOTEST-PV1-10282011 was sold on 28 October 2026 at 4:34 PM Toronto time, and at 7:38 AM on 29 October it read 0 days (only 15 hours had passed). Counted in calendar days it would read 1 day (29 Oct − 28 Oct = 1).

Where to see it: Staging, build v26.43.3-8ad4001, Reports → Parts Velocity, Date: Last 12 months, Location: All locations, search the part number. Checked with the time zone set to Toronto, the location's own.

What the PRD says: Parts Velocity PRD (version 12), S5-R4: Last Sale is "Whole days from today to the part's most recent sale at the selected location(s)". It does not say whether a "day" is a calendar day in the location's time zone or a full 24 hours.

Question: should Last Sale count calendar days in the location's time zone (a part sold yesterday reads 1 day this morning), or full 24-hour periods since the sale (it reads 0 days until 24 hours have passed, as today)?

Answer: 40. Calendar days in the location's time zone, the same as Days Open on Work In Progress (question 4). A part sold yesterday reads 1 day this morning. S5-R4 gets updated. Defect.
