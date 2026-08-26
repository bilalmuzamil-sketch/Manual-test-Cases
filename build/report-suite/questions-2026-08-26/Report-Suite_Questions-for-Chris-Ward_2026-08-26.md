# Questions for Chris Ward - Report Suite - 2026-08-26

**Project: Report Suite (the six reports) - epic SV-8582 - Product Owner: Chris Ward**

**This is the plain-language twin of `Report-Suite_Questions-for-Chris-Ward_2026-08-26.xlsx`.**
The spreadsheet is the version to send; it mirrors the established sheet format exactly, and it
carries a QA-only tab that must not be forwarded.

**DRAFT - NOT SENT. Nothing has been written to TestRail or Jira.**

Two quick questions - one about the Sales By Representative report, one about the Work In Progress report. Each one is a plain A / B / C. Both are places where your written description says a thing two different ways, and we would rather have your word than pick a side ourselves. Every question names the project and the report, because we know you look after more than one thing here. There are no bugs on this sheet - just two wording decisions. You do not need to open anything to answer. Thank you.

**Two questions in total - one on the Sales By Representative report, one on the Work In
Progress report - each a plain A / B / C.**

---

## Questions for Chris

### Question 1 - Report Suite - the Sales By Representative report - the list of columns you can switch on and off (the column chooser; under epic SV-8582)

**What happens now**

> The Sales By Representative report has a column chooser - a list of columns the user can switch on and off.
>
> Your written description says two different things about that list, in the same document:
>
> - One part says the report has NINE columns that can be switched on and off, and names them in order, and Shop Supplies is one of the nine.
>
> - Another part also says there are NINE, but then lists only EIGHT - it names Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin and Margin %, and Shop Supplies is missing from the list.
>
> So the count says nine and the list shows eight. Shop Supplies is the one that differs.
>
> For context: Shop Supplies was added as a new column on 21 August, and the note recording that change says it joins the column chooser as the ninth one - which points to the list simply having been missed when the column was added. We have not assumed that, though.
>
> Why we are asking: two of our tests check exactly this list, and they are on hold until you tell us. If Shop Supplies belongs in the chooser, the list needs one word added; if it does not, the count needs changing to eight.

**The question**

> Should Shop Supplies be one of the columns a user can switch on and off - so the list is nine - or should it always be shown, so the list is really eight?

**Options**

> A) Nine, with Shop Supplies among them - Shop Supplies can be switched on and off like the others, and the shorter list in your description is just missing it and should have it added.
>
> B) Eight - Shop Supplies is NOT something the user can switch off, and the places that say nine should be changed to eight.
>
> C) Something else - please tell us which columns can be switched on and off.

**Your answer:** _______________________________________________

### Question 2 - Report Suite - the Work In Progress report - what the Estimates figure counts (the Estimates total in the summary strip at the top; under epic SV-8582)

**What happens now**

> On the Work In Progress report, the strip along the top shows an Estimates figure.
>
> Your written description describes what that figure counts in three places, and they do not agree about whether whole-job fees and discounts (the ones added to the job as a whole, rather than to a single line of work) are counted in it. Word for word:
>
> - First place: "Estimates is the total quoted value of the jobs in the 'Estimates' tab, including their work-order-level adjustments so the figure matches the estimate document the customer sees." - that is, fees and discounts ARE counted.
>
> - Second place, the small information icon next to the figure: "The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders." - that counts LINES of work only, and says nothing about whole-job fees and discounts.
>
> - Third place: "The Estimates figure is excluded from Total Earned and from Total Remaining." - which tells us the figure stands on its own, but not what is inside it.
>
> There is also a rule elsewhere in the same description saying that when one job shows up in two tabs, its whole-job fees and discounts are counted on the other tab's row and never on its Estimates row - so the same money is never shown twice. That reads as the opposite of the first place above, which is what we are stuck on.
>
> Why we are asking: the figure comes out at a different number depending on which one is right, and one of our tests is on hold until you tell us.

**The question**

> Should the Estimates figure include whole-job fees and discounts, or should it count only the value of the lines of work that have not been approved yet?

**Options**

> A) Include them - Estimates counts the lines PLUS the whole-job fees and discounts, so the figure matches the estimate document the customer sees.
>
> B) Do not include them - Estimates counts only the value of the not-yet-approved lines of work, and whole-job fees and discounts are shown elsewhere on the report instead.
>
> C) Something else - please describe what the figure should count.

**Your answer:** _______________________________________________


---

## QA-only - not for Chris

The internal question-to-case mapping lives on the spreadsheet's `QA internal - not for Chris` tab: each question's
affected TestRail case IDs with links, the requirement anchors, the live evidence, and what each
possible answer resolves to. It also records the scope, wording rules and source-currency notes.

**Do not forward that tab.**
