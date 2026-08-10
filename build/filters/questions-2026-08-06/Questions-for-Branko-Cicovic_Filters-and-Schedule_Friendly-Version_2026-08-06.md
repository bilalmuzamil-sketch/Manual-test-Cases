# Questions for Branko Cicovic — Filters and Schedule — 2026-08-06

**Projects: Filters (epic SV-8785) and Schedule (epic SV-8685) · Product Owner: Branko Cicovic**

*This is the friendly, forward-as-is version. It carries 20 of the 21 items of
`Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.md`, reordered by what to do first and
rewritten to read easily on a phone. **One item was removed on purpose** — the exact shape of the
Reports page web address — because his own specification already states it verbatim; the reason and
the live evidence are on the QA-only tab. The spreadsheet twin is
`Questions-for-Branko-Cicovic_Filters-and-Schedule_Friendly-Version_2026-08-06.xlsx`; it carries a
QA-only tab that must not be forwarded.*

**DRAFT — NOT SENT. Nothing has been written to TestRail or Jira.**

---

Hello Branko - this is everything we have open across TWO of your projects, FILTERS and SCHEDULE, gathered into one place so you can go through it in a single sitting instead of getting a trickle of separate messages. Twenty items; about twenty minutes if you go straight down the list. SHORT ANSWERS ARE PERFECT - a letter, or one line. Nothing here needs an essay.

WHERE TO START. Section 1 is five questions that release tests which are stuck today - that is the part we are genuinely waiting on. Section 2 is eight ordinary decisions. Section 3 is six things only the engineering plan describes, and nothing of ours is waiting on those, so they can keep for a quiet moment. Section 4 is one typo-level heads-up with nothing to decide.

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

## Section 2 — Eight ordinary decisions, when you have a moment

Each one is a plain A or B. Four are Filters, four are Schedule.

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


---

## Section 3 — Six things only the engineering plan describes

**Nothing of ours is waiting on this section**, so it can keep for a quiet moment. These six
behaviours appear only in the engineering plan and nowhere in your own document, and we are not
going to turn an engineering note into something the product must do without your word.

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

## QA-only — not for Branko

The question-to-case mapping is on the spreadsheet's `QA internal - not for Branko` tab — every question's affected
TestRail case IDs with links, the requirement anchors quoted from the live pages, and what each
possible answer resolves to. It is imported verbatim from the earlier sheet's generator so the two
cannot drift, and it adds:

- **why the web-address item was removed**, with the verbatim sentence from his own specification
  and the live confirmation (page version 19, HTTP 200) — its mapping row is kept, re-labelled
  REMOVED rather than deleted;
- **⚠️ the correction owed to our own record**: Vlad was right on that row, and
  `build/filters/vlad-gap-review-2026-08-06/ROW-BY-ROW.md` needs a one-row correction. It was
  deliberately **not** rewritten here;
- that the earlier pair of files is **superseded, not deleted** — and that it still carries the
  removed question, so an old file must not go out by mistake.

**Do not forward that tab.**
