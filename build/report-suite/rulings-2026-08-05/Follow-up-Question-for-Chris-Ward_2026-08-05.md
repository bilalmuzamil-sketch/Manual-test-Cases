# Follow-up questions for Chris Ward — Report Suite — 2026-08-05

**Project: Report Suite (the six reports) · epic SV-8582 · Product Owner: Chris Ward**

**This is the plain-language twin of `Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx`.**
The spreadsheet is the version to send; it mirrors the 2026-08-04 sheet's format exactly, and it
carries a QA-only tab that must not be forwarded.

**DRAFT — NOT SENT. Nothing has been written to TestRail or Jira.**

Thank you for these - 15 answers in one go, and they unblocked most of the reporting work straight away. This is one short follow-up sheet, not a complaint: a handful of small clarifications, each one a plain A or B. Every question says which project and which report it is about, because we know you look after more than one thing here.

**Ten questions in total, each one a plain A or B, plus one note that needs no answer.**

---

## Tab 1 — Needed first - location column

Needed first, please - this is the one that is holding a developer job. Everything else on this sheet can wait until you have a spare ten minutes.

### Item 1.0 — Report Suite - the location column - all six reports (this is the "show or hide columns" story on each report, under epic SV-8582)

**What happens now**

> Your answer on the location column gave us a clear rule for two kinds of person, and we have used it. There is a third kind of person in between, and your answer points two ways for them, so we would rather ask than guess.
>
> You said the column shows by itself when someone (1) can see more than one branch AND (2) has chosen more than one branch. You also said the Location option should not be in the list of columns if someone cannot see more than one branch.
>
> The person in between is a manager who CAN see three branches but is looking at just one of them right now.
>
> This is not a rare case. Every one of the six reports opens on the single branch the person is working in, so this is exactly what a multi-branch manager sees the first time they open any report.
>
> Why we are asking: a developer has to build one of the two, and we cannot write the job down until we know which.

**The question**

> For a manager who can see several branches but is looking at just one branch right now: is "Location" offered in the list of columns, or not?

**Options**

> A) It is NOT in the list. While they are looking at one branch there is no Location option at all - they would have to add a second branch before the option appears. (Fewer things on screen; nobody can add a column that just repeats the same branch name on every row.)
>
> B) It IS in the list, switched off. They can switch it on whenever they like. (The manager is always in control; the column can end up repeating the same branch name on every row, which is harmless but a little pointless.)
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - the location column - all six reports (the "column selection and persistence" stories, for example SV-8664 and SV-8675)

**What happens now**

> Your answer means a person can switch the location column off by hand. We do not know whether that choice should be remembered.
>
> The reports already remember which columns a person picked, so this may simply follow the same habit - but we did not want to assume it.
>
> Why we are asking: it is one line in a test either way, and we would rather have your word than our guess.

**The question**

> If someone switches the location column off by hand, should it stay off the next time they open the report?

**Options**

> A) Yes - remember it, exactly like every other column they turn on or off.
>
> B) No - it should come back on by itself each time they open the report with several branches chosen.

**Your answer:** _______________________________________________


---

## Tab 2 — Quick confirmations

Five one-word confirmations. In each of these we have read something INTO your answer rather than
out of it, and we would rather you corrected us now than after the tests are written.

### Item 1.0 — Report Suite - the Technician Utilization report - the download menu (story SV-8654, "Export to PDF and CSV")

**What happens now**

> You chose the longer wording for this report's download menu and said consistency is key. We agree - we just need to know how many options there should be.
>
> The two reports you compared it with each offer four: a short version and a full version, each one as a document and as a spreadsheet. This report offers four today too, but its written description only describes three.
>
> Why we are asking: if it is four, there is a whole spreadsheet nobody has written a test for yet.

**The question**

> Should this report's download menu offer four options, matching the other two reports?

**Options**

> A) Yes - four: a short version and a full version, each as a document and as a spreadsheet.
>
> B) No - three is right, and one of the four should be taken away.

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - the date chooser - all six reports share it (the "filter by date range" story on each report, for example SV-8601)

**What happens now**

> You chose "keep what the product does today", and added that the original date picker is the intentional one. We want to be certain we have read that the way you meant it.
>
> What is in the product today: nine ready-made ranges - Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week - plus a calendar you click dates on to build your own range. There is no Today, no Yesterday, and nothing called Custom.
>
> Why we are asking: this one chooser is shared by all six reports, so we are rewriting six tests on the strength of it.

**The question**

> Is the date chooser that is in the product today the one you want kept?

**Options**

> A) Yes - keep exactly what is there now. We correct our tests, and the written descriptions get tidied when you next have them open.
>
> B) No - Today, Yesterday and a Custom option should be put back in.

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - the Inventory Value report - the "As of" line in the downloads (stories SV-8672 and SV-8677)

**What happens now**

> You confirmed the "As of" line belongs in the spreadsheet as well as in the printable document. Thank you - that settles it.
>
> The two files word it slightly differently. The spreadsheet says "As of: 2026-08-03" with a colon; the printable document says "As of 2026-08-04" with no colon.
>
> Right now our tests tell the tester not to report that difference. We would rather that instruction came from you than from us.
>
> Why we are asking: if it should match, it is a small developer job; if not, we leave it alone for good.

**The question**

> Should the two files word that line in exactly the same way?

**Options**

> A) No - the small punctuation difference is fine. Leave both as they are.
>
> B) Yes - both should read the same way. (We would raise it with the developers.)

**Your answer:** _______________________________________________

### Item 4.0 — Report Suite - the logo on printable downloads - all six reports (the download stories, for example SV-8613 and SV-8646)

**What happens now**

> Your logo rule was clear about what happens when a logo is missing or will not load, and we have followed it. One word in it could mean two different things.
>
> You wrote "if the customer has a logo selected, it appears", and then in your corrected rule "use the company's own uploaded logo".
>
> A customer and a company are different people in ShopView: the company is the shop running it, and the customer is the person the shop is doing work for. Our tests today expect the SHOP's logo.
>
> Why we are asking: the two would look completely different on a printed report.

**The question**

> Whose logo should appear at the top of a printable download?

**Options**

> A) The shop's own logo - the business running ShopView.
>
> B) The customer's logo - the client the report is about.

**Your answer:** _______________________________________________

### Item 5.0 — Report Suite - all six reports - "what is on screen should match the download" (the download stories on each report, for example SV-8631)

**What happens now**

> Alongside your answer about the missing columns you added a note: "on-screen should match download".
>
> That sentence turned out to be more useful than the question it came with - we have used it to settle a second thing, whether a download carries the location column whenever the screen shows it.
>
> Why we are asking: we would rather have your word that it is a general rule than lean on a remark you made about one report.

**The question**

> Should "whatever you see on screen is what comes out in the download" be the rule for all six reports?

**Options**

> A) Yes - treat it as a general rule for all six.
>
> B) No - it was only about the one report we were discussing at the time.

**Your answer:** _______________________________________________


---

## Tab 3 — Still holding tests

Three questions, each of which frees up a parked test the moment you answer it. Two are from the
block you told us you had not got to yet.

### Item 1.0 — Report Suite - the Sales By Customer report - where it sits in the menu (story SV-8600, "Report access and navigation placement")

**What happens now**

> This is one of the items you have not got to yet, and it is the only reason one of our tests is still parked.
>
> We need to know which menu group this report belongs in, and whether it sits below the links that were already there. Our notes from the product show it under a group named SALES; the written description says Performance. We cannot tell which one is right.
>
> Why we are asking: the test currently checks the wrong group, or the product does - and we do not know which to raise.

**The question**

> Which menu group should the Sales By Customer report appear in?

**Options**

> A) Performance - below the links that were already there.
>
> B) Sales - below the links that were already there.
>
> C) Somewhere else - please say where.

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - the Sales By Representative report - the word on screen (stories SV-8599 and SV-8632)

**What happens now**

> You confirmed that "Representative" on its own is fine in the downloaded files, and we have matched our tests to it.
>
> Two tests are still parked because they are about the word on the SCREEN and on the customer's card, not in the files. You were only asked about the files, so we did not want to stretch your answer to cover screens you had not seen.
>
> Why we are asking: two tests come unparked the moment you answer, either way.

**The question**

> Should the full word "Representative" also be used on the screen and on the customer's card?

**Options**

> A) Yes - use the full word everywhere it appears, not only in the downloaded files.
>
> B) No - only the downloaded files matter. The screen can stay as it is.

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - how a machine is named - the other five reports (stories SV-8660 for Work In Progress and SV-8606 for Sales By Customer)

**What happens now**

> You confirmed the Work In Progress report should keep showing the unit number on top with the vehicle number underneath. That is settled and we are not reopening it - it is already what your written description asks for.
>
> What we would like to record properly is what that means for the other reports. Back in July you told us a machine should be named by its vehicle number first, everywhere, and that has since been written into the Sales By Customer description.
>
> Why we are asking: nothing needs to change either way - we just want your answer on paper, so that when somebody asks why one report is different, we can show them your words instead of our reasoning.

**The question**

> Does your earlier instruction - name a machine by its vehicle number first - still stand for the other reports?

**Options**

> A) Yes - it still applies everywhere else. Work In Progress is the one exception, because its two-line layout is already right.
>
> B) No - drop it. Show the unit number first everywhere, and we will change the other report to match.

**Your answer:** _______________________________________________


### And one note that needs no answer

> NO ANSWER NEEDED - just a note for when you are next in the descriptions. Seven small wording tidy-ups are still open from the last sheet, and not one of them is holding any test up: where the Technician Utilization report sits in the menu; the machine chooser on Work In Progress; the line calling Parts Velocity the only report in its group; the line saying the Escape key closes the deactivate pop-up; the download size limit missing from three descriptions; a short note that the vehicle-number field also holds serial numbers for things that are not vehicles; and some garbled characters in two descriptions. Also, two lines still describe the Print feature you deliberately dropped, and there is an open job for it - tell us if you would like us to keep reminding you about those, or to stop.

---

## QA-only — not for Chris

The internal question-to-case mapping lives on the spreadsheet's `QA internal - not for Chris` tab: every question's
affected TestRail case IDs with links, the requirement anchors, the live evidence, and what each
possible answer resolves to. It also records the method notes — how all 469 cases were searched,
which of his 15 answers were judged clear and therefore not re-asked, and the source-currency block.

**Do not forward that tab.**
