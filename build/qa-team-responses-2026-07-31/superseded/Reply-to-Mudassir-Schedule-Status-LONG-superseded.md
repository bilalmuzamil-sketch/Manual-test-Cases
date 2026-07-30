> **Date:** 2026-07-31 · **Author:** QA / Claude · **Status:** DRAFT for Bilal to send

# Reply to Mudassir — Schedule status report of 30 July

Hi Mudassir,

Thanks for the audit — it landed at a useful moment, because the Schedule picture changed
underneath all of us in the last few days. Here is what has moved, what your points map
onto, and the two things I need back from you.

---

## First, the thing that explains a lot of the drift you found

**The Schedule PRD had moved five versions ahead of us.** We were working from version 18
of the Confluence page; the live page is version 23, last edited by Branko on 30 July. We
pulled it, diffed it version by version, and found nine substantive changes across those
five versions.

Worth knowing why we missed it: the "Version" field printed inside the document body still
reads 1.0 and has never been updated. Only the Confluence version number is reliable on that
page. So anyone checking the document header would conclude nothing had changed. Our baseline
is now current, and checking the live version is a mandatory first step before any work,
rather than something we do when a spec is handed to us.

---

## Branko's answers — six rulings, one of them a reversal

He answered our question sheet on 31 July. Six of seven questions answered clearly.

1. **Meeting and event hours DO count against a technician's capacity.** This is a
   **reversal** of his earlier position, and it matters — our cases had been written to say
   events are excluded, and they were wrong. The spec was updated to say events consume
   capacity but are not checked for clashes. Six cases are affected and have been corrected.
2. **No "Reassign" button in the shift pop-up.** Dragging is the only way to move a shift.
   He removed the button from the spec in the same window. Our cases were already written
   this way, so this confirms them.
3. **The printable weekly view is not in the first release** — and not even in the future
   backlog. The one Week Export case has been retired from the suite and from the run, with
   authorization.
4. **The grid menu opens on left-click only. There is no right-click.** The menu has exactly
   two items: "Create event" and "New work order".
5. **The default working day is 7:00 AM to 7:00 PM** — not the 8-to-5 the design prototype
   pictures. Our cases already said 7 to 7.
6. **The vehicle identifier is always shown on hover**, regardless of the display toggle.
   Our cases already said this.

The seventh question — whether we should also test the behind-the-scenes rules — he declined,
reasonably, as not being a product question. That one goes to engineering instead.

**On your point about right-click:** you were right to flag it. **Six of our cases told the
tester to right-click a menu that only opens on left-click.** All six are fixed. Exactly one
right-click mention survives in the whole suite, and it is deliberate — a case that checks
right-clicking does *not* open the menu.

---

## What our own closing pass found

We ran the full quality gate over all **164 active cases** — usefulness, does-it-make-sense,
and traceability — and separately added a new cross-case consistency check that groups cases
by the behaviour they assert and diffs their expected results against each other.

That new check found **one contradiction that all previous passes had missed**: a case that
quoted a hard-coded "outside Mon-Fri" weekend rule, which contradicted its own next expected
result about per-technician working days, and contradicted its neighbouring case. It is fixed
and aligned to the spec's own wording. Zero contradictions remain.

Every case is traced to both a ticket and a spec section. Nothing is verified against the real
build, for the reason you identified — see below.

---

## Two things I need from you

**1. Please send me your 11 drift items.**

You reported drift but I do not have the item-by-item list. I would rather reconcile yours
against ours line by line than have you re-work things that are already settled — several of
the areas that look like drift are actually cases we corrected on 27 July from the Jira epic,
or on 31 July from Branko's answers, and some of the "wrong" behaviour in the older cases was
right at the time and has since been reversed by the PO. Send the list and I will mark each
one: already fixed, genuinely still wrong, or a case where the spec itself contradicts itself
and Branko owes us an answer.

**2. What do you mean by "90 cases need expected results"?**

Every case in the Schedule suite carries expected results — I checked, all 164 do. So I want
to make sure I understand the point rather than dismiss it, because there is a version of it
that is a fair and important catch: if the expected results are **too thin or too vague for a
tester to judge pass or fail**, that is a real defect and I want the list. That is precisely
what our does-it-make-sense check is for, and it is the harder half of quality to get right.

One thing that may account for part of it: **run 357 was frozen and had not been refreshed
since it was created.** It has now gone from **143 tests to 164** — the full active suite,
with your recorded results preserved. Cases you saw as missing or incomplete may simply not
have been in the run you were looking at. Worth re-checking against the refreshed run before
we spend time on the list.

---

## On your blocker — you are right, and it is the biggest one we have

There is still **no QA environment for Schedule**, and the same is true for Filters and the
Report Suite. That means **748 cases across the three projects** are written, traced and
reviewed, but not one of them has been checked against the real running build. Every on-screen
label we took from a spec or a design is still "the document says this", not "the build shows
this" — and those are not the same thing.

This is the single largest gap on all three projects and neither of us can close it from the
QA side. Bilal is chasing the environments with engineering. Until they land, everything stays
pending verification, and we should be explicit about that in any status we give upward rather
than letting "cases complete" read as "feature tested".

Still outstanding on Schedule besides that: an eight-question sheet for Branko that is written
and ready to send, one backend-scoping question that needs an engineering answer rather than a
PO answer, and two places where the spec now contradicts itself and only Branko can settle it.

---

## One ask

Please book **30 minutes on Bilal's calendar tomorrow** for a joint refinement call — Ahtesham
will be on it as well. He raised an overlapping set of points on Filters and it makes more
sense to cover the common ground once: keeping runs in step with the suite, how drift and
Blocked cases get handled going forward, and the open questions per project. Short agenda,
circulated beforehand.

Good audit — the right-click finding was a real one.

Bilal
