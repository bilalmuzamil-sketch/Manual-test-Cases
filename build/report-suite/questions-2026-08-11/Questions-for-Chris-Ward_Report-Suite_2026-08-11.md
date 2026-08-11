# Report Suite - questions for Chris Ward - 2026-08-11

Hello Chris - thank you for the specification updates on the 7th and the 10th. Your rewrite of the location-column wording answered a question we had been holding tests for, so four tests have come off hold already - no reply needed on that one.

Three things are still open on the REPORT SUITE (the six new reports). Question 1 is the important one and it holds three tests today. The other two are small. Short answers are perfect - a letter, or one line.


## QUESTION 1 OF 3 - THIS IS THE ONE THAT MATTERS. IT HOLDS THREE TESTS TODAY.

### Question 1 - REPORT SUITE - the Work In Progress report - the four tabs

**What happens now.** The Work In Progress report splits jobs across four tabs: Estimates, Approved - not started, Approved - partially completed, and Completed. Two parts of the written description now say different things about how a job gets into a tab, and we cannot tell which you meant.

One part says a whole job goes into ONE tab, chosen by the job's own status.

A newer part, added on the 10th, says each LINE on the job is placed separately - so a job with some lines approved and some not would show up in TWO tabs at once, each showing only that tab's share of the money.

**The question.** Which of these is right?

**Options.**

A) One job, one tab, chosen by the job's status. (This is what our tests check today.)

B) Lines are placed separately, so one job can appear in more than one tab, each showing only its own share of the money.

C) Something else - please describe it in a line.

**Your answer:** ______


## QUESTION 2 OF 3 - SMALL, BUT IT IS THE LAST REPORT WHERE THIS IS UNCLEAR

### Question 2 - REPORT SUITE - the Parts Velocity report - the Location column

**What happens now.** You settled this for five of the six reports on the 7th, and thank you - anyone who can reach more than one location sees the Location column, it is on by default, and they can switch it off from the column list.

Parts Velocity still reads differently in two places. One part now matches the other five reports. But another part still says the column simply disappears when you narrow down to a single location, and the list of columns you can switch on and off still names twenty columns without Location among them.

**The question.** Should Parts Velocity work the same way as the other five reports?

**Options.**

A) Yes - same as the others. On by default for anyone who can reach more than one location, switchable from the column list, and narrowing your selection does not hide it.

B) No - Parts Velocity is different, and it should behave the way the older wording says.

C) Something else - please describe it in a line.

**Your answer:** ______


## QUESTION 3 OF 3 - A NUMBER TO CONFIRM. YOUR OWN NOTE ASKS FOR THIS.

### Question 3 - REPORT SUITE - the download size limit - all six reports

**What happens now.** All six reports now refuse a download when there is too much in it, and show: "This report is too large to export. Narrow the date range or filters, then try again."

The limit is written as 10,000 rows. On the Inventory Value report your own note beside it says the figure is a proposed default and asks for the exact number to be confirmed before the work is built.

**The question.** Is 10,000 rows the right limit, and does it apply to all six reports?

**Options.**

A) Yes - 10,000 rows, and the same on all six.

B) A different number - please tell us what it is.

C) It differs between reports - please tell us which is which.

**Your answer:** ______

