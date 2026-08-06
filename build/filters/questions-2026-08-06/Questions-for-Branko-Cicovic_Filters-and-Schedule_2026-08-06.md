# Questions for Branko Cicovic — Filters and Schedule — 2026-08-06

**Projects: Filters (epic SV-8785) and Schedule (epic SV-8685) · Product Owner: Branko Cicovic**

**This is the plain-language twin of
`Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.xlsx`.**
The spreadsheet is the version to send; it mirrors the established Chris Ward sheets' format
exactly, and it carries a QA-only tab that must not be forwarded.

**DRAFT — NOT SENT. Nothing has been written to TestRail or Jira.**

**⚠️ THIS WORKBOOK REPLACES `build/branko-questions-2026-08-05/`**, which was written, is ready, and
was never sent. Standing Rule 55 says to sweep every open ambiguity onto ONE sheet so a product
owner answers in a single sitting rather than receiving a drip of separate asks — two unsent sheets
to the same person is that drip. All 13 of that sheet's items are carried forward here, imported
from its own generator so the wording cannot drift, and 4 new items are added. **The 2026-08-05
workbook should be marked superseded so an old one cannot go out by mistake.**

Nothing here is a complaint, and one of these is honestly our own fault for not sending it sooner. It covers TWO of your projects, so every question says which one it belongs to - Filters or Schedule - and the tabs are split the same way. It is gathered into one place so you can go through it in a single sitting rather than getting a trickle of separate messages.

**Seventeen items in total: seven Filters, four Schedule questions about his own document, and six
Schedule behaviours that only the engineering plan describes. Seventeen of our tests are on hold
across them.**

**Live source versions confirmed on 2026-08-06, immediately before writing** — Filters
specification **version 19** (published 11:48 UTC this morning) · Schedule specification **version
25**. Every sentence quoted below comes from that fetch. *(Note for us, not for him: the Filters
page's in-body field still reads "Version: 1.6" — the Confluence version number is the one used.
And our own records still say the Schedule specification is at version 23, so two versions of change
are uningested — recorded on the QA-only tab.)*

---

## Tab 1 — Filters

**Please start with question 1** — four tests are on hold on it, and it is the one where your own
answer and your written description disagree. **Question 2 is the biggest single blocker on this
project:** ten tests are waiting on it.

### Item 1.0 — Filters (the filter buttons on the Work Orders list) - the Status button on the Estimates and Completed tabs (the story about how filters behave on each tab, SV-8794, under epic SV-8785)

**What happens now**

> PLEASE START HERE ON THIS TAB - four of our tests are on hold on this one point, and two answers are on record that disagree with each other.
>
> The Work Orders list has tabs across the top. Two of them - Estimates and Completed - already show you only one kind of work order. There is also a row of filter buttons below, and one of them is Status.
>
> Your written description says the Status button is NOT SHOWN AT ALL on those two tabs. It has said that since 14 May and it still says it in the version you published this morning.
>
> You told us on 17 July that the Status button IS SHOWN, greyed out, and already filled in with that tab's own status, and cannot be changed. Our QA lead agreed with that on 30 July, and the design drawing shows it that way too.
>
> Why we are asking rather than choosing: we have put the four tests back to your July answer, because that is what you and our QA lead actually decided - but the product currently behaves the way the written description says. So one of the three has to change and it is your call which.

**The question**

> Which is right - is the Status button hidden on the Estimates and Completed tabs, or shown greyed out and already filled in?

**Options**

> A) NOT SHOWN AT ALL on those two tabs - the written description is right, and my July answer is out of date.
>
> B) SHOWN, GREYED OUT AND ALREADY FILLED IN - my July answer stands, and the written description needs correcting. (Then we will also raise it so the product can be fixed.)
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### Item 2.0 — Filters (the filter buttons on the Work Orders list) - the Parts and Reports write-up (under epic SV-8785)

**What happens now**

> GENTLE STATUS ASK, not a new question - we know this is already with you and we are not chasing.
>
> Eight of our tests cover filter buttons on the Parts pages and the Reports pages. They were written from the designs back in July, and they are parked because that part of the product is not built yet and because your write-up for it has not arrived.
>
> To be straight with you: the write-up on its own will not unpark them - the feature still has to be built before anybody can run them. What the write-up does is let us finish the tests properly instead of leaving them resting on a design alone.
>
> Why we are asking: only so we can tell our own management honestly whether this is weeks away or months.

**The question**

> Roughly when do you expect the Parts and Reports write-up, and is that part of the product still planned for this release?

**Options**

> A) It is coming shortly, and it is still in this release.
>
> B) It has moved to a later release - please say roughly when.
>
> C) It has been dropped. (Then we will ask about deleting the eight tests.)

**Your answer:** _______________________________________________

### Item 3.0 — Filters (the filter buttons on the report pages) - the date filter and the page's web address (the story about sharing a filtered view by link, SV-8796, under epic SV-8785)

**What happens now**

> When you pick a date range on a report, the page's web address changes so the view can be shared or bookmarked. Our tests check that the address changes and that a shared link works. They do not check the exact shape of the address, because nothing written down says what that shape should be.
>
> An engineering note does suggest a shape, but the product appears to do something different, and part of that same note has already been overtaken by your update of 4 August.
>
> Why we are asking: our automation engineer raised this, and we would rather leave the gap open honestly than invent a rule from an engineering note. No test has been written for it.

**The question**

> Is the exact shape of the web address something we should be testing?

**Options**

> A) No - it is enough that the link works when it is shared. Do not test the exact shape.
>
> B) Yes, it matters - and here is the shape it must be: ____________________
>
> C) Ask engineering to settle it and write it down; treat it as their documentation rather than as a test.

**Your answer:** _______________________________________________

### Item 4.0 — Filters (the filter buttons on the Work Orders list, on a phone) - the Imported choice (the mobile filter bar story, SV-8797, under epic SV-8785)

**What happens now**

> Imported sits in the Status list but behaves differently from the others: while it is chosen, the other filters cannot be used. That much is written down, and we have now added a test for it on a phone.
>
> There is a second behaviour that is not written down anywhere. We are told the product also does the reverse: if you pick an ordinary status last, Imported is quietly un-picked for you.
>
> Why we are asking rather than just testing it: that behaviour exists only in the developers' own code checks. We do not turn something the code happens to do into something the product must do - that has to be your decision, or it stops being a test of the product and becomes a description of it.

**The question**

> Is that reverse behaviour intended - picking an ordinary status last automatically un-picks Imported?

**Options**

> A) Yes - that is intended. We will test it, and it should be written down.
>
> B) No - that is not intended. (Then we will raise it.)
>
> C) Something else - please describe what should happen.

**Your answer:** _______________________________________________

### Item 5.0 — Filters (the filter buttons on the Work Orders list) - where the filter bar sits (the filter bar layout story, SV-8786, under epic SV-8785)

**What happens now**

> Your description says the filter bar sits BELOW the row of tabs (All, Estimates, Completed, My Work Orders). The design shows the same thing. In the product the five filter buttons sit ON THE SAME ROW as the tabs.
>
> One of our own tests used to wave this away with a note saying the product behaves this way "on purpose for now" - and nothing anywhere backed that up. That note was wrong and it has been removed. Our test now expects what your description says.
>
> Since then a developer job has been raised to move the bar below the tabs, on the grounds that the product does not match your description. So somebody is about to change the product on the strength of that reading.
>
> Why we are asking: if you actually wanted them on one row, that developer job should be cancelled and your description updated instead. Better to ask you now than after the change has been made.

**The question**

> Should the filter buttons be moved below the tabs, or did you want them on the same row as the tabs?

**Options**

> A) MOVE THEM BELOW - as your description and the design say. The developer job is correct and nothing needs changing in writing.
>
> B) SAME ROW IS WHAT I WANTED - then the developer job should be cancelled and the description updated to say so.

**Your answer:** _______________________________________________

### Item 6.0 — Filters (the filter buttons on the Work Orders list) - the wording on the phone button (the mobile filter bar story, SV-8797, under epic SV-8785)

**What happens now**

> This is a tiny one, and it exists only because our tests have to quote the exact words a tester will see on screen.
>
> Your description calls the button "Apply filters", with a small f. On a phone the button actually reads "Apply Filters", with a capital F.
>
> Why we are asking: we would rather your description and the screen said the same thing than have our test quietly differ from one of them.

**The question**

> Which spelling is the right one?

**Options**

> A) "Apply Filters" with a capital F - the description can be tidied to match the screen.
>
> B) "Apply filters" with a small f - then the button on screen should be corrected.

**Your answer:** _______________________________________________

### Item 7.0 — Filters (the filter buttons on the Work Orders list) - a pointer in your own description that leads to the wrong place (the mobile filter bar story, SV-8797, under epic SV-8785)

**What happens now**

> NO DECISION NEEDED - this is just a helpful heads-up about a typo-level slip, and it has already cost one round of confusion.
>
> In the phone section, the paragraph about the filter buttons says they work like the desktop "with one exception", and then points the reader at a numbered paragraph further down. But the paragraph it points at is the one about the page search box - not an exception at all. The real exception, that a phone only filters when the person taps the apply button, is the very next paragraph after the one it points to.
>
> We think we know how it happened: when you tidied the numbering yesterday you moved the apply-button paragraph down one place, and the pointer above it kept pointing at the old number.
>
> Why we are telling you: a reader who follows that pointer lands on the wrong paragraph and concludes there is no exception.

**The question**

> Nothing to decide - please just repoint that reference to the apply-button paragraph next time you have the document open.

**Options**

> (No options - noted for your next edit.)

**Your answer:** _______________________________________________


---

## Tab 2 — Schedule - your document

**Four items, and an apology with the first.** Question 1 was written on 22 July and we never
actually sent it to you. Two tests have been sitting parked ever since waiting for an answer you
were never asked for. That delay is ours, not yours.

### Item 1.0 — Schedule (the technician scheduling calendar) - planning a job across several days (the multi-day spread story, SV-8691, under epic SV-8685)

**What happens now**

> FIRST, AN APOLOGY: we wrote this question on 22 July and never sent it. Two tests have been parked ever since. That is our delay, not yours.
>
> When a job is too big for one day, the schedule spreads it across several working days. Your description tells us two opposite things about days the shop is closed - a public holiday, or an inventory day - and both sentences are still in the current version:
>
> One says: "Shop closures and public holidays are NOT SKIPPED in V1." In other words the spread puts shifts on a closed day like any other day.
>
> The other says: "Shop closures (holidays, inventory days) are defined at the shop level and BLOCK the spread step from placing shifts on those days." In other words the spread jumps over closed days.
>
> Why we are asking: these are two completely different tests and we cannot write both. We have not guessed - the two tests say plainly that the point is undecided and are waiting.

**The question**

> When a job is spread across several days, should the schedule skip days the shop is closed, or place shifts on them anyway?

**Options**

> A) SKIP THEM - closed days are jumped over, the same way weekends already are, and the job runs on to the next open day.
>
> B) DO NOT SKIP THEM - closed days get shifts like any other day for this first version, and somebody moves them by hand if needed.

**Your answer:** _______________________________________________

### Item 2.0 — Schedule (the technician scheduling calendar) - the menu on an empty part of the calendar (the events story, SV-8696, and the access-level section of your description)

**What happens now**

> Nobody had spotted this one before, and no test is wrong because of it - but your description contradicts itself, so a reader who happens to read the wrong half would test the wrong thing.
>
> In two places it says: "LEFT-CLICK on empty grid space opens a menu with: Create event, New work order."
>
> In two other places, where it lists what each access level unlocks, it twice calls the same thing a "RIGHT-CLICK context menu".
>
> Our tests follow left-click, and the product agrees with them, so nothing is broken today.
>
> Why we are asking: it is a one-word correction in your description, and until it is made anyone reading only the access-level section will look for the wrong mouse click.

**The question**

> Which is correct - does that menu open on a left-click or a right-click?

**Options**

> A) LEFT-CLICK - as the two earlier places say. The access-level section is the wording that needs correcting.
>
> B) RIGHT-CLICK - then the product and our tests are both wrong and it becomes a developer job.

**Your answer:** _______________________________________________

### Item 3.0 — Schedule (the technician scheduling calendar) - weekends for a technician with no hours set (the working hours story, SV-8699, and the conflict story, SV-8697)

**What happens now**

> This one is a gap rather than a contradiction, and no test is parked on it - we are asking so that we are not quietly relying on our own reading.
>
> Three separate parts of your description do not quite add up for a technician who has no working hours of their own set up:
>
> - the default working day is given as 7:00 AM to 7:00 PM, with nothing said about which days of the week that covers;
> - spreading a job "automatically skips weekends";
> - but a shift placed on a weekend counts as a clash to be warned about.
>
> So we cannot tell whether a weekend is simply an ordinary working day for such a technician, or a day the schedule should push back on.
>
> Why we are asking: it decides whether a warning should appear, and a warning that should not be there is just as much a bug as a missing one.

**The question**

> For a technician with no working hours of their own set up, is a weekend a normal working day or a day the schedule should warn about?

**Options**

> A) A DAY TO WARN ABOUT - weekends are outside normal hours for everyone unless someone has set weekend hours for them.
>
> B) A NORMAL WORKING DAY - the default 7 to 7 applies to all seven days, and only the spread step avoids weekends.

**Your answer:** _______________________________________________

### Item 4.0 — Schedule (the technician scheduling calendar) - which drawing of the Schedule we should be working from (under epic SV-8685)

**What happens now**

> This one is about which picture is the real one, and it affects roughly fifty of our tests.
>
> Back in July you told us the Schedule prototype we were given was the one to work from, and we pinned about fifty on-screen names and labels from it - button wording, column headings, the words used in warnings.
>
> Three Schedule faults raised on 5 August all point at a DIFFERENT drawing instead - a shared link to a live, editable design page that carries no version and no date. Because it can be edited at any moment and has nothing on it to say when it was finished, we cannot compare our tests against it, and we cannot tell whether it is newer or older than the one we hold.
>
> You have already noticed the same thing yourself. On one of those three you replied that the button being reported "is not in the design" and asked where it had been found.
>
> Why we are asking: if that newer drawing is the finished one, then about fifty of our labels may be out of date and we should go through it properly. If it is not finished, we should carry on from the prototype and leave it alone. We are not going to guess between two pictures.

**The question**

> Which drawing of the Schedule is the one to work from - the prototype you pointed us at in July, or the newer shared design page?

**Options**

> A) THE PROTOTYPE from July is still the one. The newer page is a work in progress and we should ignore it.
>
> B) THE NEWER SHARED PAGE is the finished one - please confirm it is final, and we will go through it and update whatever has changed.
>
> C) Neither is final yet - please say when a finished drawing will be available.

**Your answer:** _______________________________________________


---

## Tab 3 — Schedule - engineering only

**Nothing on this tab is urgent and no test is waiting on it.** These six behaviours are described
only in the engineering plan and appear nowhere in your own document. We are not going to turn an
engineering note into something the product must do without your word.

### Item 1.0 — Schedule (the technician scheduling calendar) - shifts and events that already existed (under epic SV-8685)

**What happens now**

> Six of our tests describe things that only the ENGINEERING plan describes - your own description does not mention them at all. We have kept the tests, because they cover real risks and throwing them away would lose that cover, but each one says openly that it rests on an engineering note rather than on a product decision.
>
> We will not present something as a requirement when no product document says it. So until you tell us these are right, those tests stay parked - that is the honest consequence and we would rather you saw it than have us quietly promote an engineering note into a rule.
>
> This first one: after this feature goes out, everything that was already on the calendar should still be there - same technician, same day, same time, same job.
>
> Why we are asking: it is the difference between a safe release and losing somebody's existing plan.

**The question**

> Should everything already on the calendar survive the release completely unchanged?

**Options**

> A) YES - nothing already scheduled may move, change or disappear. (Please confirm and we will treat it as a requirement.)
>
> B) Not quite - please say what is allowed to change.

**Your answer:** _______________________________________________

### Item 2.0 — Schedule (the technician scheduling calendar) - how a multi-day job looks on the Dashboard (under epic SV-8685)

**What happens now**

> Another one that only the engineering plan describes.
>
> When a job is spread over, say, five days, it becomes five separate day-by-day entries on the calendar. The engineering note says the Dashboard should still show that job as ONE line covering the whole stretch, not as five separate lines.
>
> Why we are asking: if it is five lines, the Dashboard suddenly looks five times busier than it is, and nobody has written down which is intended.

**The question**

> On the Dashboard, should a job scheduled across several days appear as one line or as one line per day?

**Options**

> A) ONE LINE covering the whole stretch.
>
> B) ONE LINE PER DAY.

**Your answer:** _______________________________________________

### Item 3.0 — Schedule (the technician scheduling calendar) - an appointment set while creating a job (under epic SV-8685)

**What happens now**

> Another one that only the engineering plan describes.
>
> When somebody sets an appointment date and time while creating a job, the engineering note says that appointment should turn up on the schedule calendar at that date and time, and behave like anything else on the calendar.
>
> Why we are asking: your description does not mention appointments at all, so we cannot tell whether the two things are meant to be connected.

**The question**

> Should an appointment set while creating a job appear on the schedule calendar?

**Options**

> A) YES - it appears at that date and time and behaves like anything else on the calendar.
>
> B) NO - appointments and the schedule calendar are separate things.

**Your answer:** _______________________________________________

### Item 4.0 — Schedule (the technician scheduling calendar) - jobs from another branch (under epic SV-8685)

**What happens now**

> Another one that only the engineering plan describes, and this is the one with the most at stake.
>
> The engineering note says a shift should only ever appear on the calendar of the branch the job belongs to - even when the technician doing it also works at another branch - and that somebody looking at one branch should not be able to reach or change another branch's shift at all.
>
> It also gives a reason we think you should see: if a shift's branch were worked out from the technician instead of from the job, then moving a technician to another branch would quietly move all of their PAST shifts too - history would rewrite itself.
>
> Why we are asking: this is about one branch seeing another branch's work, so it is worth your explicit yes rather than our assumption.

**The question**

> Should a shift only ever appear on the calendar of the branch its job belongs to?

**Options**

> A) YES - the job's branch decides, always, and one branch can never see or change another's shifts.
>
> B) Something else - please describe it.

**Your answer:** _______________________________________________

### Item 5.0 — Schedule (the technician scheduling calendar) - the priority on a job (under epic SV-8685)

**What happens now**

> Another one that only the engineering plan describes.
>
> The engineering note says a job offers a priority choice of High, Medium and Low, that a brand-new job has NONE of them picked to begin with, and that the chosen priority then shows on the job.
>
> Why we are asking: "nothing picked to start with" is the kind of detail that is easy to get wrong in either direction, and no product document states it.

**The question**

> Is that right - High, Medium, Low, with nothing pre-selected on a new job?

**Options**

> A) YES - three choices, nothing pre-selected.
>
> B) Not quite - please say what the choices are and what a new job should start with.

**Your answer:** _______________________________________________

### Item 6.0 — Schedule (the technician scheduling calendar) - a limit on how long a spread can be (the multi-day spread story, SV-8691, under epic SV-8685)

**What happens now**

> Two of our tests say that spreading a job further than about eight weeks, or into more than about a hundred and twenty separate days, should stop and ask the person to confirm before going ahead.
>
> Those two numbers appear ONLY in the engineering plan. We searched your description and neither number is in it anywhere. The product currently does not warn at all - a very long spread just goes through.
>
> We have NOT raised that as a fault, precisely because we cannot show a product document that asks for it.
>
> Why we are asking: there are three possible answers here and we are not going to guess between them.

**The question**

> Should a very long spread warn the person first, and if so at what point?

**Options**

> A) YES, at those numbers - about eight weeks, or about a hundred and twenty days. Please confirm and we will treat it as a requirement.
>
> B) YES, but at different numbers - please say what they should be.
>
> C) NO limit at all - a spread of any length just goes ahead. (Then we will delete the two tests.)

**Your answer:** _______________________________________________


---

## QA-only — not for Branko

The internal question-to-case mapping lives on the spreadsheet's `QA internal - not for Branko` tab: every question's
affected TestRail case IDs with links, the requirement anchors quoted from the live pages, and what
each possible answer resolves to. It also records why this is one consolidated file rather than two,
**why SV-8876 is deliberately NOT on the sheet** (it is closed — Ahtasham Amjad closed it himself on
5 August), why the new Filters version 19 produced no question, and the two source-currency gaps
this pass found and did not paper over.

**Do not forward that tab.**
