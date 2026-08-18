# Questions for Branko Cicovic — Filters and Schedule — 2026-08-17

**Projects: Filters (epic SV-8785) and Schedule (epic SV-8685) · Product Owner: Branko Cicovic**

*Three genuine product decisions left open after the 2026-08-17 filter-redesign reconciliation
(Filters spec v21, Schedule spec v30). One sheet, per Standing Rule 55. The spreadsheet twin is
`Filters-and-Schedule_Questions-for-Branko_2026-08-17.xlsx`; it carries a QA-only tab that must not
be forwarded.*

**DRAFT — WRITTEN AND HELD, NOT SENT (Standing Rule 66: the question sheet is the LAST thing sent,
on the QA lead's word, once everything we can do ourselves is finished). Nothing has been written
to TestRail or Jira.**

---

Hello Branko - this is everything we have open across your projects FILTERS and SCHEDULE after the big filter redesign, gathered into one place so you can answer it in one sitting instead of a trickle of separate messages. Just THREE questions - about ten minutes. SHORT ANSWERS ARE PERFECT - a letter, or one line. Nothing here needs an essay.

Every question says which project and screen it is about, because you look after Filters, Schedule and Global Search. Each one is a point where two of your own documents disagree, or where your written description does not yet say the thing we need - so we are asking you which to keep, rather than guessing. To be clear: we have not edited any of your tickets or descriptions.

The first question has two tests parked on it right now, so it is the one that unblocks work.

---

## The three questions

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


---

## QA-only — not for Branko

The question-to-case mapping (internal IDs, TestRail C-ids and links, spec anchors, and what each
answer resolves to) is on the spreadsheet's `QA internal - not for Branko` tab, together with the source-currency record
and the list of what was deliberately left off and why.

**Do not forward that tab.**
