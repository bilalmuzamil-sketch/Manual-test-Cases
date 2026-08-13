# Questions for Branko Cicovic — Filters and Schedule — 2026-08-13 (consolidated)

**Projects: Filters (epic SV-8785) and Schedule (epic SV-8685) · Product Owner: Branko Cicovic**

*This is the CONSOLIDATED sheet: the 22 items of the held 2026-08-06 Friendly sheet, imported from
its own generator so the wording cannot drift, plus the TEN questions that accumulated after it was
written (the SV-9041 addendum of 2026-08-11, the two Schedule questions of 2026-08-10/11, and the
six handover-ingest questions of 2026-08-10) — 32 items in total, one sheet, per Standing Rule 55.
The spreadsheet twin is `Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-13.xlsx`; it
carries a QA-only tab that must not be forwarded.*

**DRAFT — WRITTEN AND HELD, NOT SENT (Standing Rule 66: the question sheet is the LAST thing sent,
on the QA lead's word, once everything we can do ourselves is finished). Nothing has been written
to TestRail or Jira.**

---

Hello Branko - this is everything we have open across TWO of your projects, FILTERS and SCHEDULE, gathered into one place so you can go through it in a single sitting instead of getting a trickle of separate messages. Thirty-two items; about half an hour if you go straight down the list. SHORT ANSWERS ARE PERFECT - a letter, or one line. Nothing here needs an essay.

WHERE TO START. Section 1 is five questions that release tests which are stuck today - that is the part we are genuinely waiting on. Section 2 is nine ordinary decisions. Section 3 is seven things only the engineering plan describes, and nothing of ours is waiting on those, so they can keep for a quiet moment. Section 4 is one typo-level heads-up with nothing to decide. Section 5 is ten questions added on 13 August - everything that has come up since the earlier sections were written, so you get one sheet rather than several.

ONE OF THESE IS OUR OWN FAULT and we are sorry: question 2 in Section 1 was written on 22 July and we never actually sent it to you. Two tests have been parked ever since waiting for an answer you were never asked for.

Every question says which project it belongs to, because you look after Filters, Schedule and Global Search. And to be clear - we have not edited any of your tickets or your descriptions. Where two of your own documents disagree we simply say so and ask which one to keep.

---

## Section 1 — Start here: these five release tests that are stuck today

### 1. FILTERS - the Work Orders list - the Status button on the Estimates and Completed tabs

**What happens now**

> Four of our tests are on hold on this one point, and two answers are on record that disagree with each other.
>
> The Work Orders list has tabs across the top. Two of them - Estimates and Completed - already show only one kind of work order. There is also a row of filter buttons below, and one of them is Status.
>
> Your written description says the Status button is NOT SHOWN AT ALL on those two tabs. It has said that since 14 May and it still says it today.
>
> You told us on 17 July that the Status button IS SHOWN, greyed out, already filled in with that tab's own status, and cannot be changed. Our QA lead agreed with that on 30 July, and the design shows it that way too.
>
> Why we are asking rather than choosing: we have put the four tests back to your July answer, because that is what you and our QA lead actually decided - but the product currently behaves the way the written description says. So one of the three has to change, and it is your call which.

**The question**

> Which is right - is the Status button hidden on the Estimates and Completed tabs, or shown greyed out and already filled in?

**Options**

> A) NOT SHOWN AT ALL on those two tabs - the written description is right, and my July answer is out of date.
>
> B) SHOWN, GREYED OUT AND ALREADY FILLED IN - my July answer stands, and the description needs correcting. (Then we will also raise it so the product can be fixed.)
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 2. SCHEDULE - the technician calendar - planning a job across several days, and days the shop is closed

**What happens now**

> FIRST, AN APOLOGY: we wrote this question on 22 July and never sent it. Two tests have been parked ever since. That delay is ours, not yours.
>
> When a job is too big for one day, the schedule spreads it across several working days. Your description tells us two opposite things about days the shop is closed - a public holiday, or an inventory day - and both sentences are still there today.
>
> One says closures and public holidays are NOT skipped in this first version: the spread puts shifts on a closed day like any other day.
>
> The other says shop closures are set at shop level and BLOCK the spread from placing shifts on those days: the spread jumps over them.
>
> Why we are asking: those are two completely different tests and we cannot write both. We have not guessed - the two tests say plainly that the point is undecided and are waiting.

**The question**

> When a job is spread across several days, should the schedule skip days the shop is closed, or place shifts on them anyway?

**Options**

> A) SKIP THEM - closed days are jumped over, the way weekends already are, and the job runs on to the next open day.
>
> B) DO NOT SKIP THEM - closed days get shifts like any other day for this first version, and somebody moves them by hand if needed.

**Your answer:** _______________________________________________

### 3. SCHEDULE - the search box in the toolbar above the calendar (not the one in the job list down the left)

**What happens now**

> THIS ONE DECIDES WHETHER ONE OF OUR TESTS IS RIGHT OR WRONG, so it is worth a minute.
>
> Your description used to say that when someone searches, the jobs that do not match go FADED BUT STAY ON SCREEN, so you keep sight of the whole week. That sentence was taken out THIS MORNING, after your team decided the description was wrong and that the drawing shows only the matching jobs. The description now says only WHAT the search looks through - customer name, work order number, unit number, technician name and line name. It says nothing at all about the jobs that do not match.
>
> Our test still says the non-matching jobs go faded, because that is what was written down when we wrote it. We will not quietly change it to match what the software does today - that would tell us what was built rather than what you wanted.
>
> One more thing in the same place: the developer ticket for the calendar layout STILL says the non-matching jobs should fade, in two places. So your description and that ticket now disagree. If your answer is A, somebody should tidy that ticket up - we have not touched it, because it is not ours.

**The question**

> When someone searches, what should happen to the jobs that do not match?

**Options**

> A) They should disappear from the calendar - only the matching jobs are shown. (This is what your team said the drawing shows.)
>
> B) They should stay on screen but faded, and the matching ones stand out.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 4. SCHEDULE - the pop-up window that opens when you click a scheduled job - the estimated hours

**What happens now**

> THIS ONE DECIDES WHETHER A TEST PASSES OR FAILS, which is exactly why we are asking instead of choosing.
>
> Earlier today you told us the little ESTIMATE BADGE should not be clickable, and that the time is changed in the fields higher up the window instead. That makes sense to us.
>
> What we cannot tell is how far your answer reaches. Your description STILL says the window should let someone type a new estimate straight into it, and the developer ticket says the same. Both are live today. So your sentence might mean the estimate cannot be changed anywhere in that window, or only that the small badge on the job line should not be clickable.
>
> We have one test that says the estimate CAN be typed into. If you mean the first, that test is wrong and we will correct it. If you mean the second, the test is right and the software has something to fix. We are deliberately not settling it by looking at what the software does today.

**The question**

> In that pop-up window, should someone be able to change the ESTIMATED HOURS by typing into them?

**Options**

> A) NO - the estimate cannot be changed in that window at all; only the start and end times can be changed, in the fields above.
>
> B) YES - the estimate itself can still be typed into; only the little badge on the job line should not be clickable.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 5. SCHEDULE - which drawing of the Schedule we should be working from

**What happens now**

> This one is about which picture is the real one, and it affects roughly fifty of our tests.
>
> Back in July you told us the Schedule prototype we were given was the one to work from, and we pinned about fifty on-screen names and labels from it - button wording, column headings, the words used in warnings.
>
> Three Schedule faults raised on 5 August all point at a DIFFERENT drawing - a shared link to a live, editable design page with no version and no date on it. Because it can change at any moment and has nothing to say when it was finished, we cannot compare our tests against it, and we cannot tell whether it is newer or older than the one we hold.
>
> You have noticed something similar yourself: on one of those three you replied that the button being reported is not in the design, and asked where it had been found.
>
> Why we are asking: if that newer drawing is the finished one, about fifty of our labels may be out of date and we should go through it properly. If it is not finished, we should carry on from the prototype and leave it alone. We are not going to guess between two pictures.

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

## Section 2 — Nine ordinary decisions, when you have a moment

### 1. FILTERS - the Work Orders list - where the filter bar sits

**What happens now**

> Your description says the filter bar sits BELOW the row of tabs (All, Estimates, Completed, My Work Orders), and the design shows the same. In the product the five filter buttons sit ON THE SAME ROW as the tabs.
>
> One of our own tests used to wave this away with a note saying the product behaves this way on purpose for now - and nothing anywhere backed that up. That note was wrong and has been removed. Our test now expects what your description says.
>
> Since then a developer job has been raised to move the bar below the tabs, on the grounds that the product does not match your description. So somebody is about to change the product on the strength of that reading.
>
> Why we are asking now: if you actually wanted them on one row, that job should be cancelled and your description updated instead. Better to ask before the change is made than after.

**The question**

> Should the filter buttons be moved below the tabs, or did you want them on the same row as the tabs?

**Options**

> A) MOVE THEM BELOW - as your description and the design say. The developer job is correct and nothing needs changing in writing.
>
> B) SAME ROW IS WHAT I WANTED - then the developer job should be cancelled and the description updated to say so.

**Your answer:** _______________________________________________

### 2. FILTERS - the Work Orders list on a phone - the Imported choice

**What happens now**

> Imported sits in the Status list but behaves differently: while it is chosen, the other filters cannot be used. That much is written down, and we have added a test for it on a phone.
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

### 3. FILTERS - the Work Orders list on a phone - the wording on the apply button

**What happens now**

> A tiny one, and it exists only because our tests have to quote the exact words a tester will see on screen.
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

### 4. FILTERS - the filter buttons on the Parts pages and the Reports pages - the write-up

**What happens now**

> A GENTLE STATUS ASK, not a new question - we know this is already with you and we are not chasing.
>
> Eight of our tests cover filter buttons on the Parts pages and the Reports pages. They were written from the designs back in July, and they are parked because your write-up for them has not arrived.
>
> A CORRECTION WE OWE YOU: an earlier draft of this question also told you the feature was not built yet. That was our mistake. An engineering handover we were given today says the filter buttons on the eight Parts pages ARE built, and so are the ones on six reports - Shop Billing Efficiency, My Timesheets, Timesheet Activities, Notes, Reminders and Sales Tax - all waiting on one final code review.
>
> That same handover says several other reports are deliberately NOT being done in this piece of work. Our tests name a good many of those, which is a separate tidy-up on our side and not something you need to answer here.
>
> Why we are asking: so we can finish these tests against something you have written, rather than leaving them resting on a drawing alone - and so we can tell our own management honestly whether this is weeks away or months.

**The question**

> Roughly when do you expect the Parts and Reports write-up, and is that part of the product still planned for this release?

**Options**

> A) It is coming shortly, and it is still in this release.
>
> B) It has moved to a later release - please say roughly when.
>
> C) It has been dropped. (Then we will ask about deleting the eight tests.)

**Your answer:** _______________________________________________

### 5. SCHEDULE - the menu that opens on an empty part of the calendar

**What happens now**

> Nobody had spotted this one, and no test is wrong because of it - but your description contradicts itself, so a reader who happens to read the wrong half would test the wrong thing.
>
> In two places it says a LEFT-CLICK on empty calendar space opens a menu offering Create event and New work order. In two other places, where it lists what each access level unlocks, it twice calls the same thing a RIGHT-CLICK menu.
>
> Our tests follow left-click and the product agrees with them, so nothing is broken today.
>
> Why we are asking: it is a one-word correction, and until it is made anyone reading only the access-level section will look for the wrong mouse click.

**The question**

> Which is correct - does that menu open on a left-click or a right-click?

**Options**

> A) LEFT-CLICK - as the two earlier places say. The access-level section is the wording that needs correcting.
>
> B) RIGHT-CLICK - then the product and our tests are both wrong and it becomes a developer job.

**Your answer:** _______________________________________________

### 6. SCHEDULE - weekends for a technician who has no working hours set up

**What happens now**

> A gap rather than a contradiction, and no test is parked on it - we are asking so that we are not quietly relying on our own reading.
>
> Three parts of your description do not quite add up for a technician with no working hours of their own:
> - the default working day is 7:00 AM to 7:00 PM, with nothing said about which days of the week that covers;
> - spreading a job automatically skips weekends;
> - but a shift placed on a weekend counts as a clash to be warned about.
>
> So we cannot tell whether a weekend is simply an ordinary working day for such a technician, or a day the schedule should push back on.
>
> Why it matters: it decides whether a warning should appear, and a warning that should not be there is just as much a bug as a missing one.

**The question**

> For a technician with no working hours of their own set up, is a weekend a normal working day or a day the schedule should warn about?

**Options**

> A) A DAY TO WARN ABOUT - weekends are outside normal hours for everyone unless someone has set weekend hours for them.
>
> B) A NORMAL WORKING DAY - the default 7 to 7 applies to all seven days, and only the spread step avoids weekends.

**Your answer:** _______________________________________________

### 7. SCHEDULE - the list of jobs INSIDE that same pop-up window

**What happens now**

> This one is small, and it is only two of your own documents disagreeing.
>
> Your description was changed this morning so each job line in that pop-up shows an estimate figure and a status label. In your own words earlier today: the lines should show the estimate and the status badge and there should not be any totals. Our test already expects exactly that - the hours and a status label, no money anywhere in the window - so nothing of ours is stuck.
>
> But the developer ticket for that window still says each line shows a labour TOTAL, and it has said so since before your change. You edited that same ticket three days ago and the word is still in it. So your description and that ticket now say different things, and only you can say which to keep.
>
> While you are in that ticket: it also still says the estimate can be typed in, which is question 4 in Section 1. Both would be tidied in the same visit.

**The question**

> On each job line in that pop-up, should there be a money total, or only the hours and a status label?

**Options**

> A) ONLY the hours and a status label - no money anywhere. Your description is right and the developer ticket needs tidying up.
>
> B) A MONEY TOTAL should be shown there - the developer ticket is right and your description needs correcting. (Then our test is wrong and we will change it.)
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 8. SCHEDULE - how much of the day the timeline shows when the day view opens

**What happens now**

> Nothing is stuck on this one and no test of ours is wrong today. We are asking because two of your own documents now point in opposite directions.
>
> Your description says the day view keeps the WHOLE 24 HOURS there and scrollable, and simply scrolls itself so the start of the working day is on the left. That is still what it says today.
>
> The design review of 5 August asks for something different: that the timeline show ONLY THE WORKING HOURS plus a little after them, with anything outside reached by scrolling. That review lists it as IN SCOPE for this release, alongside the change that makes the day view open at the start of the working day.
>
> A CORRECTION WE OWE YOU: an earlier draft of this question told you that the narrower version was only a later improvement. That was our mistake - the review puts it in this release. We would rather correct it than have you answer on the strength of it.
>
> So your description was last changed on 7 August, two days AFTER that review, and it still says the full 24 hours. Only you can say which of the two you meant to stand. If the narrower version is meant for this release, your description needs changing first and then we will change the test to match.

**The question**

> For THIS release, which is right?

**Options**

> A) Keep the full 24 hours, as your description says today - the narrower version is for later.
>
> B) Change it now to show only the working hours plus a little after them.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 9. SCHEDULE - the technician calendar - the Status filter on the work order list, when you want more than one status at a time

**What happens now**

> Nothing is stuck on this one and no test of ours is wrong today. We are asking because we found one of our own tests claiming something your description does not say, and we have taken the claim out rather than leave it in.
>
> On the Schedule page there is a Filter panel, and one of its groups is Status. Your description lists what goes in that group - "all work order statuses currently supported in the app" - and it says that applying a filter narrows the list of work order cards.
>
> What it does not say, anywhere, is whether you can pick MORE THAN ONE status at the same time - for example Approved and Review together - and what the list should then show.
>
> Being straight with you about what we did: one of our tests had been claiming that choosing several statuses shows the work orders of all of them together. We could not find that in your description, in the story, in the design or in anything you have told us, so we have removed the claim. We have NOT replaced it with the opposite - we are not saying you can only pick one - because we do not know, and guessing either way would put words in your mouth.
>
> So the test now checks one status at a time, which is safe and true either way. If you tell us more than one is intended, we will add that back as a proper test and note that it came from you.

**The question**

> Can more than one status be chosen in the Status filter at the same time, and if so what should the list show?

**Options**

> A) YES - you can pick several statuses, and the list shows the work orders of ALL the chosen statuses together.
>
> B) NO - only one status at a time; picking another replaces the first.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________


---

## Section 3 — Seven things only the engineering plan describes

**Nothing of ours is waiting on this section**, so it can keep for a quiet moment.

### 1. Schedule (the technician scheduling calendar) - shifts and events that already existed (under epic SV-8685)

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

### 2. Schedule (the technician scheduling calendar) - how a multi-day job looks on the Dashboard (under epic SV-8685)

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

### 3. Schedule (the technician scheduling calendar) - an appointment set while creating a job (under epic SV-8685)

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

### 4. Schedule (the technician scheduling calendar) - jobs from another branch (under epic SV-8685)

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

### 5. Schedule (the technician scheduling calendar) - the priority on a job (under epic SV-8685)

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

### 6. Schedule (the technician scheduling calendar) - a limit on how long a spread can be (the multi-day spread story, SV-8691, under epic SV-8685)

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

### 7. FILTERS - the Work Orders list - using two different filter buttons at the same time

**What happens now**

> NOTHING OF OURS IS STUCK ON THIS ONE and we are not asking you to make a decision. We are asking you to write down in your own description something your engineers have already written down in theirs.
>
> The Work Orders list has five filter buttons: Status, Customer, Lead Technician, Service Advisor and Asset on Site.
>
> Your description says what each button does ON ITS OWN. For Status it says the list shows work orders matching ANY of the statuses you tick. For Customer it says the list shows work orders belonging to ANY of the customers you pick.
>
> What it never says is what the list should show when someone uses TWO DIFFERENT BUTTONS AT THE SAME TIME - for example ticking the status 'Estimate' and also picking the customer 'Smith'. We searched the whole of your current description and five earlier versions of it, and the rule is not there in any of them.
>
> Your engineers' own working notes DO state it: the buttons must narrow together, so the list shows only the work orders that match both. That is also what the product does today, and it is what two of our tests already check - so nothing is broken and nothing is waiting.
>
> Why we are raising it anyway: a rule that lives only in an engineering note is one edit away from being changed by accident, and nobody would notice. One sentence in your description settles it for good.

**The question**

> When someone ticks a status AND also picks a customer, what should the list show?

**Options**

> A) ONLY the work orders that match BOTH - status 'Estimate' AND customer 'Smith'. (This is what your engineers' notes say and what the product does today. If you pick A, please add a sentence saying so to your description - nothing of ours needs to change.)
>
> B) Something else - please describe it. (Then two of our tests are wrong and we will correct them.)

**Your answer:** _______________________________________________


---

## Section 4 — One heads-up, nothing to decide

### 1. Filters (the filter buttons on the Work Orders list) - a pointer in your own description that leads to the wrong place (the mobile filter bar story, SV-8797, under epic SV-8785)

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

## Section 5 — Ten questions added on 13 August

Ten questions added on 13 August - everything that has come up since the earlier sections were written, gathered here so you still get ONE sheet rather than a trickle. The first two are about a ticket one of your team raised on 7 August; five are about differences between your description and the design review of 5 August; the rest are single decisions. Nothing in this section is blocking a test today, but several decide what a test should say.

### 1. FILTERS - the filter buttons across Work Orders, Parts and Reports - the show/hide control for the filter row

**What happens now**

> Most list pages have a row of filter buttons, and a small control in the toolbar that hides that row to give the table more space.
>
> On 7 August one of your team raised a ticket saying that control should only appear when a page has more than one filter. If a page has only one filter, the control should not be there at all and that page's filter row should simply always be on display. Your QA has since checked it and confirmed the product already behaves that way.
>
> That rule is not in your written description. The description says, and has said unchanged since 13 May, only that the toolbar contains a control that hides and shows the filter row - it does not mention any condition about how many filters the page has.
>
> Why we are asking rather than choosing: we have followed the ticket, because it is the newer statement, and we have updated two tests so a page with one filter and no control is treated as correct rather than as a fault. But the description is the document QA works from, and right now it does not contain this rule.

**The question**

> Should the show/hide control for the filter row be hidden on pages that have only one filter, and should that rule go into your written description?

**Options**

> A) YES - the rule is correct, and please add it to the description so it is written down.
>
> B) YES, the rule is correct, but leave the description as it is - the ticket is enough.
>
> C) NO - the control should always be there whatever the page has on it, and the ticket is wrong.
>
> D) Something else - please describe it.

**Your answer:** _______________________________________________

### 2. FILTERS - the same question, for the Parts pages and the Reports pages

**What happens now**

> The ticket does not say which pages it covers. It says "the page", which reads as all of them.
>
> The evidence your QA attached to that ticket is a screenshot of the Part Sales page - a Parts page with a single filter and no show/hide control - so in practice it has already been treated as covering Parts.
>
> This matters to us because you told us on 31 July that hiding the filter row on Parts and Reports works the same way as it does on the Work Orders list. The Work Orders list has five filters, so the control is always there. Some Parts pages and some reports have only one, so on those the control would now be absent.

**The question**

> Does this rule apply to the Parts pages and the Reports pages too, and not only the Work Orders list?

**Options**

> A) YES - it applies everywhere there is a filter row.
>
> B) NO - it applies only to the Work Orders list; Parts and Reports always show the control.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 3. SCHEDULE - the technician calendar - the small pop-up on the workload bar above each day

**What happens now**

> Above every day on the calendar there is a small bar showing how full the shop's day is. When you rest your mouse on that bar, a little pop-up lists technicians and how many hours each one has been given against the hours they are available for.
>
> On 7 August your description changed by one word: it used to say the pop-up lists the technicians, and now it says it lists the technicians who have work assigned.
>
> In a shop with fifteen technicians where only three have work that day, that is the difference between a fifteen-line pop-up and a three-line one.
>
> What we have done in the meantime, so it is not a surprise: our test now expects only the assigned technicians, because that is what your description says today. If your answer is B, we change one test back - it is a five-minute fix and no other test depends on it.

**The question**

> Was that change what you meant - should the pop-up list only the technicians who have work assigned that day?

**Options**

> A) YES - only the technicians who have work assigned that day.
>
> B) NO - it should list all technicians, including those with nothing booked, and the change was a slip.

**Your answer:** _______________________________________________

### 4. SCHEDULE - the technician calendar - whether the calendar remembers that you hid the job list

**What happens now**

> Your description of 7 August adds a new button to the calendar that hides and shows the job list down the left-hand side, giving its space to the calendar. About whether the calendar remembers that choice, it says the setting lasts only while you are signed in - so if you hide the list, sign out, and sign back in tomorrow, the list is showing again.
>
> Separately, the design review of 5 August asks for the calendar's view settings to be remembered for each person even after they sign out and come back.
>
> Those two are different promises, and we do not want to guess which you meant. This is not the same as the question about remembering the other view settings, which is asked separately below - we are asking about this one button because your description and the design review give different answers for it.

**The question**

> When someone hides the job list and then signs out, what should they see the next time they sign in?

**Options**

> A) The job list is SHOWING AGAIN. Hiding it only lasts for the sign-in you are in. (This is what your 7 August description says.)
>
> B) The job list is STILL HIDDEN. The calendar remembers it for that person from one sign-in to the next. (This is what the 5 August design review asks for.)

**Your answer:** _______________________________________________

### 5. FILTERS - the Work Orders list - whether the filter dropdowns should close when you pick something

**What happens now**

> The five filter buttons on the Work Orders list open a small panel when you click them. They do not all behave the same way when you make a choice.
>
> The ones where you can tick several things - Customer, Lead Technician, Service Advisor, Status - stay open, so you can tick a second and a third. That is what we would expect.
>
> But Asset on Site, where you can only pick one answer, closes the moment you pick. And the date panel on the report pages closes when you pick a ready-made period, but stays open while you are typing your own dates.
>
> Your written description gives one rule for all of them - the panel closes when you click outside it - and does not mention closing when you choose something.
>
> Why we are asking: none of our tests is wrong today, because none of them says either way. But a tester will notice that the buttons behave differently from each other, and we would rather have your answer than let them guess.

**The question**

> Should a filter panel where you can only pick ONE answer close by itself as soon as you pick?

**Options**

> A) Yes - a one-choice panel closes as soon as you pick. Please have the description say so.
>
> B) No - every panel should stay open until you click outside it, as the description says today.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 6. SCHEDULE - the technician calendar - the wording of the warning when a shift falls outside someone's hours

**What happens now**

> When a shift is put before or after someone's working day, the calendar shows a warning. Today that warning says "working hours".
>
> A fault raised after the design review on 5 August asks for it to say "business hours" instead, because that is the wording used elsewhere in the product.
>
> Here is our worry, and it is why we have not simply changed our tests. Your own description treats those two as DIFFERENT things. It says a technician's own hours come first, and the shop's business hours are only used when that technician has no hours of their own.
>
> So if the warning is changed to say "business hours" for everybody, it will be wrong for any technician who has their own hours set - it would blame the shop's hours while actually measuring against the technician's.

**The question**

> When a shift falls outside someone's hours, what should the warning say?

**Options**

> A) It should refer to THAT TECHNICIAN'S hours, because those are what it measures against.
>
> B) It should say "business hours" for everyone - then your description needs changing to match.
>
> C) It should avoid both and just say something like "outside the working day".
>
> D) Something else - please describe it.

**Your answer:** _______________________________________________

### 7. SCHEDULE - the technician calendar - the "Add Existing Work Order" button

**What happens now**

> A button called "Add Existing Work Order" appears in the drawing of the Schedule, but it is not in the product. It was raised as a fault after the design review on 5 August, and that report says openly that nobody is sure whether it was dropped while building or never planned at all. The fault has been parked since.
>
> We searched your written description for it and it is not there - not in the current version and not in any earlier one we hold.
>
> Why we are asking rather than writing a test: a drawing on its own is not enough for us to say the product must do something. If we wrote the test now we would be inventing a requirement, and if the button was never planned, that test would fail forever for no reason.

**The question**

> Should there be an "Add Existing Work Order" button on the Schedule in this release?

**Options**

> A) Yes - it was meant to be there. (Then we will write the test, and it should go in your description.)
>
> B) No - it was never planned, or it has been dropped. (Then nothing more is needed from us.)
>
> C) Not in this release, but later - please say roughly when.

**Your answer:** _______________________________________________

### 8. SCHEDULE - the technician calendar - how many hours get planned for a job that is half done

**What happens now**

> When a big job is spread across several days, the calendar decides how many hours to plan.
>
> Your description is clear about this today: it plans the WHOLE original estimate every time, and it says in as many words that planned hours, the estimate and the hours actually worked are three separate numbers that are not made to add up.
>
> The design review of 5 August asks for the opposite: that when a job is partly finished, planning should use the hours REMAINING rather than the original estimate. That review lists it as in scope for this release.
>
> Our test follows your description. We have not changed it, because your description was updated on 7 August - two days after that review - and still says the original estimate.

**The question**

> When a job is already partly finished, should the calendar plan the hours remaining, or the whole original estimate?

**Options**

> A) THE WHOLE ORIGINAL ESTIMATE - as your description says today. Nothing changes.
>
> B) THE HOURS REMAINING - then your description needs changing, and we will change our test to match.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 9. SCHEDULE - the technician calendar - whether the view settings are remembered

**What happens now**

> The Schedule has a small settings panel that turns things on and off - the capacity bars along the top, which departments are shown, whether events appear, and so on.
>
> Your description tells us which of those start switched on and which start switched off. It does not say whether the product remembers a person's choices for next time.
>
> The design review of 5 August asks for them to be remembered for each person, and lists it as in scope for this release, but marks the details as still to be worked out.
>
> Why we are asking: we have no test for this, and we do not want to write one that says "remembered" when the only thing asking for it is a meeting note.

**The question**

> Should each person's Schedule view settings be remembered for next time?

**Options**

> A) YES - remembered for that person, and they should still be set that way after signing out and back in.
>
> B) NO - they go back to their starting positions each time.
>
> C) Remembered only until they close the browser, not beyond that.

**Your answer:** _______________________________________________

### 10. SCHEDULE - the technician calendar - dragging a shift onto the next day

**What happens now**

> In the week view you can drag a shift from one technician to another, and your description covers that.
>
> The design review of 5 August also asks that you be able to drag a shift onto the NEXT DAY for the same technician, as a quicker alternative to a button. It lists it as in scope for this release but marks the details as still to be worked out.
>
> Your description does not mention moving a shift to a different day. It only mentions moving one between technicians. It does allow meetings and other non-job blocks to be moved between days - but that is a different kind of block.
>
> We have no test for it, and we would rather ask than invent one.

**The question**

> Should someone be able to drag a shift onto a different day for the same technician?

**Options**

> A) YES - dragging a shift onto another day moves it there. (Then we will write the test.)
>
> B) NO - shifts move only between technicians; changing the day is done another way.
>
> C) Not in this release - please say roughly when.

**Your answer:** _______________________________________________


---

## QA-only — not for Branko

The question-to-case mapping is on the spreadsheet's `QA internal - not for Branko` tab — the imported 2026-08-06 rows
(including the one removed item, kept re-labelled), the ten new 13 August rows, the dated
2026-08-13 correction to the cross-filter row (the technical-design authority question was ANSWERED
by the QA lead on 2026-08-12 and is NOT on this sheet), the source-currency record, the pre-send
re-read duty (Rule 59), and the list of what was deliberately NOT asked and why.

**Do not forward that tab.**
