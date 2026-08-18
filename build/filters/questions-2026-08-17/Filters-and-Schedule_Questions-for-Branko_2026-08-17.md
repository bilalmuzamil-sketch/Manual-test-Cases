# Questions for Branko Cicovic — Filters and Schedule — 2026-08-17

**Projects: Filters (epic SV-8785) and Schedule (epic SV-8685) · Product Owner: Branko Cicovic**

*Eight genuine product decisions left open after the 2026-08-17 filter-redesign reconciliation
(Filters spec v21, Schedule spec v30) and the 2026-08-18 Aug-5-design-review reconciliation. One
sheet, per Standing Rule 55. The spreadsheet twin is
`Filters-and-Schedule_Questions-for-Branko_2026-08-17.xlsx`; it carries a QA-only tab that must not
be forwarded.*

**QUESTIONS 1 to 3 were SENT to Branko on 2026-08-17 (per the QA lead). QUESTIONS 4 to 8 are NEW
FOLLOW-UPS added 2026-08-18, HELD pending the QA lead sending them (Standing Rule 66: the question
sheet is the LAST thing sent). A follow-up-only copy of the five new questions, for easy sending, is
`Filters-and-Schedule_Questions-for-Branko_FOLLOW-UP-5_2026-08-17.docx`. Nothing has been written to
TestRail or Jira.**

---

Hello Branko - this is everything we have open across your projects FILTERS and SCHEDULE, gathered into one place so you can answer it in one sitting instead of a trickle of separate messages. SHORT ANSWERS ARE PERFECT - a letter, or one line. Nothing here needs an essay.

There are EIGHT questions in total. The first THREE (1 to 3) are the ones we already sent you - they are repeated here only so everything is in one place. Questions 4 to 8 are NEW FOLLOW-UPS, all about the Schedule's 'carryover' feature and one scheduling preference from the design review - so if you have already answered 1 to 3, you only need to look at 4 to 8.

Every question says which project and screen it is about, because you look after Filters, Schedule and Global Search. Each one is a point where two of your own documents disagree, or where your written description does not yet say the thing we need - so we are asking you which to keep, rather than guessing. To be clear: we have not edited any of your tickets or descriptions.

The first question has two tests parked on it right now, so it is the one that unblocks work.

---

## The questions

### 1. FILTERS - the Work Orders list - the Status button on the Estimates and Completed tabs

**What happens now**

> Two of our tests are on hold on this one point, and two answers are on record that disagree with each other.
>
> The Work Orders list has tabs across the top. Two of them - Estimates and Completed - already show only one kind of work order. There is also a row of filter buttons, and one of them is Status.
>
> Your written description says the Status button is NOT SHOWN AT ALL on those two tabs.
>
> But you told us on 17 July that the Status button IS SHOWN, greyed out, already filled in with that tab's own status, and cannot be changed. Our QA lead agreed with that on 30 July, and the design shows it that way too.
>
> Why we are asking rather than choosing: we have set the two tests to your July answer, because that is what you and our QA lead actually decided - but the written description still says the opposite. So one of them has to change, and it is your call which.

**The question**

> On the Estimates and Completed tabs, is the Status button hidden, or shown greyed out and already filled in?

**Options**

> A) NOT SHOWN AT ALL on those two tabs - the written description is right, and my July answer is out of date.
>
> B) SHOWN, GREYED OUT AND ALREADY FILLED IN - my July answer stands, and the description needs correcting. (Then we will also raise it so the product can be fixed to match.)
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 2. FILTERS - the filter buttons on the Parts pages and the Report pages

**What happens now**

> The redesign puts a row of filter buttons on the Parts pages and on the Report pages. Your written description says the filters those pages already had are moved into the new row - but it does not list exactly WHICH buttons should appear on WHICH page.
>
> Your engineering team was going to send us that page-by-page list, and it has not arrived yet. Without it we can check that the buttons on those pages work, but we cannot yet check that each page is showing exactly the right set of buttons - so those tests say 'confirm the exact buttons later' and are waiting on this.
>
> Why we are asking you: it is a product decision - which filter buttons belong on each page - and you are the person who can confirm it.

**The question**

> For the Parts pages and the Report pages, can you confirm which filter buttons should appear on each page?

**Options**

> A) Every page keeps exactly the same filters it had before the redesign - nothing added or removed - so the old set for each page is the answer.
>
> B) There is a specific page-by-page list - you (or engineering) will send it, and we will check each page against it.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 3. SCHEDULE - the pop-up window that opens when you click a scheduled job

**What happens now**

> When someone clicks a job on the schedule, a small pop-up window opens with actions on it. Right now that window offers DELETE only.
>
> An earlier version of your description mentioned a REASSIGN action in that window, and a later version took it out. Separately, a job can already be moved to a different technician by DRAGGING it on the calendar.
>
> So there are two sensible possibilities and we do not want to guess: either the window is correct with Delete only and reassigning is done by dragging, or the window should also offer a Reassign action. We have kept the test flagged and left it for your decision.

**The question**

> In that pop-up window, should there be a REASSIGN action, or is Delete the only action and reassigning is done by dragging the job to another technician?

**Options**

> A) DELETE ONLY - reassigning is done by dragging the job to another technician. The window is correct as it is.
>
> B) ADD A REASSIGN ACTION to the window as well.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 4. SCHEDULE - the scheduling pop-up - a personal 'always schedule the whole work order' preference

**What happens now**

> When you drag a work order onto the schedule, it asks whether to schedule the WHOLE work order or to pick individual lines. Right now it asks this every time.
>
> The 5 August design review suggested letting each person set a preference - 'always schedule the whole work order' - so the system remembers their choice and stops asking every time.
>
> Your newer written description does not mention this preference at all, and the review itself listed it as an open question to decide before launch. So we are asking you rather than guessing.

**The question**

> Should a person be able to set a preference to always schedule the whole work order (so the system remembers it and stops asking each time), in the first version?

**Options**

> A) YES - add the 'always schedule the whole work order' preference in the first version.
>
> B) NO - leave it out for now and keep asking each time; maybe a later version.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 5. SCHEDULE - the schedule grid - the one-click carryover button

**What happens now**

> The old scheduler had a one-click 'carryover' button on a scheduled job. Pressing it copied that job to the next day at the same time.
>
> The new scheduler does not have this button. The 5 August design review asked to bring it back for the first version.
>
> Your newer written description does not mention carryover at all, so we are asking you rather than guessing.

**The question**

> Should the one-click carryover button - copy a job to the next day at the same time - be brought back in the first version?

**Options**

> A) YES - bring the carryover button back in the first version.
>
> B) NO - leave it out for now.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 6. SCHEDULE - the schedule grid - what the carryover button is called

**What happens now**

> This one is only about what the button is CALLED, if it comes back (see the previous question).
>
> The old name was 'Carryover'. The design review suggested a clearer name - 'Add a Day' or 'Extend a Day' - but the final wording is not decided.

**The question**

> If the button comes back, what should it be called?

**Options**

> A) 'Add a Day'
>
> B) 'Extend a Day'
>
> C) Keep 'Carryover', or something else - please write the exact words you want.

**Your answer:** _______________________________________________

### 7. SCHEDULE - the schedule grid - carryover on a job that runs several days

**What happens now**

> Some jobs are scheduled across several days in a row.
>
> When you press carryover on one of these, there are two ways it could behave: it could add just ONE more day at the end, or it could copy the whole run of days again.
>
> The design review said it should add just one more day. Your newer written description does not cover this, so we are checking with you.

**The question**

> When you press carryover on a job that already runs across several days, should it add just one more day, or copy the whole run of days again?

**Options**

> A) Add just ONE more day at the end.
>
> B) Copy the whole run of days again.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 8. SCHEDULE - the schedule grid - week view - dragging a job to the next day

**What happens now**

> In week view you can see several days at once.
>
> The design review suggested that - as well as, or instead of, a carryover button - a person should be able to drag a scheduled job straight onto the next day.
>
> Your newer written description does not mention this, so it is your call.

**The question**

> In week view, should a person be able to drag a scheduled job straight onto the next day, as another way to carry it over?

**Options**

> A) YES - allow dragging a job onto the next day in week view.
>
> B) NO - keep a carryover button as the only way.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________


---

## QA-only — not for Branko

The question-to-case mapping (internal IDs, TestRail C-ids and links, spec anchors, and what each
answer resolves to) is on the spreadsheet's `QA internal - not for Branko` tab, together with the source-currency record
and the list of what was deliberately left off and why.

**Do not forward that tab.**
