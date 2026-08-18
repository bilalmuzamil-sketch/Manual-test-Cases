# Questions for Chris Ward - Report Suite - 2026-08-17

**Project: Report Suite (the six reports) - epic SV-8582 - Product Owner: Chris Ward**

**This is the plain-language twin of `Report-Suite_Questions-for-Chris-Ward_2026-08-17.xlsx`.**
The spreadsheet is the version to send; it mirrors the established sheet format exactly, and it
carries a QA-only tab that must not be forwarded.

**DRAFT - NOT SENT. Nothing has been written to TestRail or Jira.**

Two quick questions, both about the Work In Progress report. Each one is a plain A / B / C, and both are small tidy-ups where your written description says a thing two different ways and we would rather have your word than guess. Every question names the project and the report, because we know you look after more than one thing here. There are no bugs on this sheet - just two wording decisions. Thank you.

**Two questions in total, both about the Work In Progress report, each a plain A / B / C.**

---

## Questions for Chris

### Question 1 - Report Suite - the Work In Progress report - the Estimates help text (the little information icon next to the Estimates figure; under epic SV-8582)

**What happens now**

> On the Work In Progress report, the Estimates figure has a small information icon that shows a short plain explanation of what that number means.
>
> Your written description gives that explanation TWO different ways, in two different places of the same document - one short, and one longer that the recent design review locked in. Word for word:
>
> - Short version: "Quotes the customer has not approved yet - not counted in the totals."
>
> - Longer version (locked in the design review): "The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders."
>
> We are using the longer one, because it is the most recent - it came from the design review. We just want to record which one you want, so the description says it only once.
>
> Why we are asking: it is a one-line tidy-up in your description either way, and we would rather have your word than leave the description saying two things.

**The question**

> Which explanation should the Estimates information icon show - and may we drop the other so the description states it once?

**Options**

> A) Keep the longer one from the design review ("The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders") and drop the short one. This is the one we have already built our check to, so if you choose A we just need your confirmation and the short line tidied out.
>
> B) Keep the short one ("Quotes the customer has not approved yet - not counted in the totals") and drop the longer one. We change our check back to the short wording.
>
> C) Something else - please write the exact wording you want.

**Your answer:** _______________________________________________

### Question 2 - Report Suite - the Work In Progress report - which tab a job appears in (the tabs across the top of the report; under epic SV-8582)

**What happens now**

> The Work In Progress report is split into tabs across the top - Estimate, In Progress, Review, Complete, and so on.
>
> Your written description says two different things about which tab a job belongs in, in the same document:
>
> - One part says a job appears in exactly ONE tab, chosen by the job's overall status.
>
> - Another part, added more recently, says the tabs go by the state of each individual LINE on the job - so a job with lines in more than one state would show up in more than one tab.
>
> We have not picked a side - our tests follow the wording each was written against. This is the one thing on the report we cannot settle ourselves.
>
> Why we are asking: the two behave completely differently for a job that has work in more than one state, and we do not want to guess which one is right.

**The question**

> When a single job has work in more than one state, should it appear in just one tab, or in every tab that matches?

**Options**

> A) In just ONE tab, chosen by the job's overall status - a job is only ever in one place on the report.
>
> B) In EVERY tab that matches - a job with some lines estimated and some in progress shows in both the Estimate tab and the In Progress tab.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________


---

## QA-only - not for Chris

The internal question-to-case mapping lives on the spreadsheet's `QA internal - not for Chris` tab: each question's
affected TestRail case IDs with links, the requirement anchors, the live evidence, and what each
possible answer resolves to. It also records the scope, wording rules and source-currency notes.

**Do not forward that tab.**
