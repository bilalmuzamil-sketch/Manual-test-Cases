> **Date:** 2026-07-31 · **Author:** QA / Claude · **Status:** DRAFT for Bilal to send

# Reply to Ahtesham — review of the Filters test run (run 352)

Hi Ahtesham,

Thanks for this. I went through all six points you raised and checked every one of them
against the current product spec, Branko's recorded answers and the live test cases. Four
of the six pointed at something genuinely wrong, and two of your conclusions need
correcting. The detail is below, and the short version is: your review directly caused
real fixes, and it also exposed a gap in **our** process, not just in the run.

---

## What you got right

**1. The run contradicted itself. That was real, and it is now fixed.**

You were right that our own run said two different things about the Status filter on the
Estimates and Completed tabs. Two cases said the chip is shown greyed out; two others
said it is hidden. A tester opening the run cold could not tell which to trust — exactly
as you described.

When I audited all 110 active cases rather than just the four you named, I found a third
case on the "shown greyed out" side that your review had missed (a precondition in the
filter-bar layout case). So the inconsistency was slightly wider than reported. All of
them now use one wording: the chip is **shown, greyed out, pre-filled with the tab's
status, and not clickable**. The word "hidden" no longer appears in any tester-facing
field anywhere in the Filters suite for this behaviour.

**2. "Back to my view" was a genuine coverage gap. That one is on us.**

You were right that this is not properly covered. Our shared-link case tested that the
go-back option restores your own saved filters, but it did not test two things the spec
requires: that the action **also clears any search text you have typed**, and that the
option is **not shown at all** when you are simply looking at your own view. We had also
deliberately avoided naming the control, because we believed the name was still only an
engineering suggestion — in fact it was ratified in the spec as **"Back to my view"** on
27 July. That is our stale-source mistake, not a judgement call. Both the label and the
query-clearing behaviour are now on the fix list, and the "not shown on a normal visit"
case is being written as a new case in its own right.

**3. Your question about the runs was the most valuable thing in the report.**

You asked whether page search, the removed story and the Parts/Reports filters get their
own runs. That question was well aimed and it uncovered the root cause of most of what
you reported. Run 352 was created on 17 July and had never been refreshed since 22 July —
so it was frozen at 79 cases while the suite had grown well past that. It has now been
brought up to the full active suite: **79 cases → 110**. No separate runs; Filters stays
one run so the coverage picture does not fragment.

**4. You independently rediscovered a live open question with the mobile filters.**

Your point about the mobile "Apply" button lines up with a question that is already open
with Branko: the design shows an Apply button on the individual filter sheets, while the
engineering plan builds those sheets to filter as you tick, with no button. You reached
that from the spec alone, without the design set or the engineering plan in front of you —
which raises its priority. It is still open and we are chasing it.

---

## What needs correcting

**Two of the three "missing coverage" items were not missing. They were missing from your
run.**

- **Imported works alone / greys out the other filters** — this is covered in full by
  case **C38877**. Every clause of the requirement maps to one of its expected results,
  including the part where unticking Imported brings the other filters back.
- **A shared link applies for viewing only and never overwrites your saved filters** —
  covered in full by case **C38879**, including the part most people miss: that changes you
  make *during* the link visit are also not saved back.

Both cases were written and pushed to TestRail on 30 July. Neither was in run 352, because
the run had not been refreshed. So your conclusion "the run does not cover this" was
correct; the conclusion "no test case exists" was not. Worth checking case coverage against
the suite, not only against the run you have been assigned — and that is on us for handing
you a stale run in the first place.

**One more: the Status chip behaviour itself is settled, and it is not what the PRD says.**

You read the PRD correctly — it says "hidden" or "not shown" in six separate places. But
Branko was asked this exact question on 17 July and ruled that the chip is **shown, greyed
out and pre-filled**, and Bilal confirmed the same reading on 30 July. A product ruling from
the PO and a ruling from the QA lead both outrank spec wording the PO has not yet updated,
so the cases stay as they are and the two "hidden" cases were aligned to the ruling, not the
other way round.

The genuine follow-up you have created here is for **Branko**: his PRD still contradicts his
own answer in six places, and it has done so across eight versions of the document. That is
why every reviewer who reads only the PRD raises this. We have asked him to correct it.

---

## What we got wrong, and have fixed

Two things, stated plainly.

**Our spec was eight versions out of date.** We were working from version 1.0 of the Filters
PRD while Branko had reached version 1.6 on 28 July. That directly caused real uncovered
requirements — particularly around page search — and it also meant we asked Branko two
questions his own document had already answered. We have now pulled the current spec, diffed
it requirement by requirement, and repaired the source references on all 110 cases. Checking
the live spec version is now a mandatory first step before any work on a project, not
something we do when someone hands us a new document.

**Our own quality audit should have caught the contradiction before you did.** Our audit
checked each case on its own merits and passed all of them — which is exactly how a suite can
be individually sensible and still contradict itself. We have added a cross-case consistency
step: cases are now grouped by the behaviour they assert and their expected results are
diffed against each other. That new step has since found **five more** contradictions across
the suite that nobody had reported — a case that said search text is saved to your account
when the spec says the opposite, two "clear filters" cases that promised the full list would
return even when a search was still typed in, the mobile Apply-button inconsistency, and a
group of nine page-search cases that describe a different search feature altogether. All five
are resolved or contained. Your review is the reason that check exists.

---

## Where things stand

- The Filters suite is **110 active cases**, all of them now traced to the current spec.
- Run 352 has been refreshed from **79 to 110** cases. Your recorded results were preserved
  untouched.
- Nothing in the suite is verified against the real build yet, because Filters still has no
  QA environment. Every case is pending that. It is the biggest open item on the project and
  it is not something either of us can fix.

---

## One ask

Please book **30 minutes on Bilal's calendar tomorrow** for a joint refinement call, with
Mudassir on it too. He has raised a similar set of points on Schedule and there is a lot of
overlap — how we keep runs in step with the suite, how drift and Blocked cases get handled,
and which open questions are still with the POs. Agenda is short and I will circulate it
beforehand.

Genuinely useful review — thanks for reading it cold and saying what you saw.

Bilal
