# Questions for Chris Ward — Report Suite — 2026-08-06

**Project: Report Suite (the six reports) · Product Owner: Chris Ward**

*This is the friendly, forward-as-is version. It carries all 13 items of
`Questions-for-Chris-Ward_Report-Suite_2026-08-06.md` — nothing dropped, nothing added — reordered
by what to do first and rewritten to read easily on a phone. The spreadsheet twin is
`Questions-for-Chris-Ward_Report-Suite_Friendly-Version_2026-08-06.xlsx`; it carries a QA-only tab
that must not be forwarded.*

**DRAFT — NOT SENT. Nothing has been written to TestRail or Jira.**

---

Hello Chris - thank you, your last round of answers cleared most of the reporting work straight away. This is the rest of what is genuinely still open on the REPORT SUITE (the six new reports). Thirteen items, and most are one word: about ten minutes if you go straight down the list. SHORT ANSWERS ARE PERFECT - a letter, or one line. Nothing here needs an essay.

WHERE TO START. Section 1 is a single yes-or-no and it releases seven tests that are on hold today - that is the only thing we are really waiting on. Section 2 is five ordinary decisions. Section 3 is seven small tidy-ups in your own descriptions: a tick each, nothing to decide.

Every question says which project and which report it is about, because we know you look after Fees & Discounts as well as the Report Suite. And to be clear - we have not edited any of your descriptions or anyone's tickets. Where two of your own documents disagree we simply say so and ask which one to keep.

---

## Section 1 — Start here: one line, and seven tests can run

**This is the only thing we are really waiting on.**

### 1. REPORT SUITE - the Location column - all six reports

**What happens now**

> This is a one-line confirmation rather than a fresh decision, and it is the only thing holding seven of our tests.
>
> You have already decided it. The same note now appears in all six report descriptions: anyone who can see more than one location gets the Location column, it is on by default, and they can switch it on or off themselves from the list of columns. Someone who can see only one location never sees it at all.
>
> What is left is only tidying. Older sentences still sit in all six descriptions saying the column appears and disappears on its own depending on how many locations are picked - and in three of them a sentence says flatly that the person cannot switch it. Those six are in Section 3 as ticks, not questions.
>
> Why we are asking: we would rather not release seven tests on our own reading of a note. One word from you and they go.

**The question**

> Is this right - anyone who can see more than one location gets the Location column, on by default, and can switch it on or off themselves?

**Options**

> A) Yes, that is the rule. It depends on what someone is allowed to see, not on what they have picked, and they can switch it whenever they like.
>
> B) No - the column should appear and disappear on its own depending on how many locations are picked, and the person should not be able to switch it.
>
> C) Something else, or it should differ between reports - please describe it.

**Your answer:** _______________________________________________


---

## Section 2 — Five decisions we need from you

Each one is a plain A or B. Two were asked on 5 August and are here again because they are still
open, not because we forgot.

### 1. REPORT SUITE - all six reports - which heading each one sits under in the Reports menu

**What happens now**

> The six reports are spread across three headings today. Work In Progress, Technician Utilization and Sales By Representative sit under PERFORMANCE. Parts Velocity and Inventory Value sit under PARTS. Sales By Customer sits on its own under SALES.
>
> None of the six descriptions says which heading a report belongs under - only that it appears in the Reports menu, which it does.
>
> Why we are asking: one of our tests used to expect Sales By Customer under Performance. That came from a walkthrough video last month rather than from any current description, so we have taken it out rather than guess. Today the test only records the heading, which is honest but not much of a test.

**The question**

> Is that arrangement the one you want - three under Performance, two under Parts, and Sales By Customer under Sales?

**Options**

> A) Yes, leave them as they are - and please add the heading to each description so there is something to test against.
>
> B) No - all six should sit together under one heading. Please say which.
>
> C) Something else - please describe where each one should go.

**Your answer:** _______________________________________________

### 2. REPORT SUITE - Sales By Customer - an invoice the person is not allowed to open

**What happens now**

> Your Sales By Customer description says two different things about the same thing, and both are in the current version.
>
> One part says a person who cannot open an invoice gets no link at all - the invoice number is shown as ordinary text.
>
> Another part says they do get a link, click it, and land on the standard "you are not allowed in" page, from which they can go back.
>
> Why we are asking: three of our tests are on hold on this one point, and the two answers need completely different tests. This went to you on 5 August - it is here again only because it is still open, not because we forgot.

**The question**

> Which one do you want?

**Options**

> A) No link at all. For that person the invoice number is plain text and there is nothing to click.
>
> B) A link they can click, which takes them to the "you are not allowed in" page.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### 3. REPORT SUITE - Sales By Representative - the same link rule, which never reached the numbered requirements

**What happens now**

> On 5 August you added the rule that a link is only a link when the person is allowed to open what it points at. Thank you - it went into Sales By Customer properly.
>
> On Sales By Representative it only reached the opening paragraph. The numbered requirements underneath still say, flatly, that every invoice number and every customer name on a detail row is a clickable link.
>
> Why we are asking: a tester reading only those numbered requirements would expect a link for everybody, and would raise a fault against a build that is correct.

**The question**

> Should the numbered requirements on Sales By Representative be updated to match Sales By Customer?

**Options**

> A) Yes, please update them so they say the same as Sales By Customer.
>
> B) No - Sales By Representative should keep links for everybody, whether or not they can open what the link points at.

**Your answer:** _______________________________________________

### 4. REPORT SUITE - Sales By Representative - what paper size and orientation the printable downloads should use

**What happens now**

> Your two descriptions disagree with each other. Sales By Representative says its printable downloads are A4 portrait. Sales By Customer says A4 landscape.
>
> The Sales By Representative table has sixteen columns, which would not fit across a portrait page at all, and when we last looked both reports came out landscape.
>
> Why we are asking: one of our tests says portrait, word for word from your description, and it is queued for the automation team to pick up. If portrait is not what you want, we would much rather fix that test now than after it is automated.

**The question**

> For Sales By Representative, should the printable downloads be A4 landscape or A4 portrait?

**Options**

> A) A4 landscape, the same as Sales By Customer - and please correct the Sales By Representative description to say landscape.
>
> B) A4 portrait, as its description says today. (Then we will raise the difference with the developers.)

**Your answer:** _______________________________________________

### 5. REPORT SUITE - Sales By Representative - the word "Representative" on the screen and on the customer's card

**What happens now**

> You confirmed that "Representative" on its own is fine in the downloaded files, and we have matched our tests to that.
>
> Two tests are still on hold because they are about the word on the SCREEN and on the customer's card, not in the files. You were only asked about the files, so we did not want to stretch your answer to cover screens you had not been shown.
>
> Why we are asking: two tests come off hold the moment you answer, whichever way you answer. Asked on 5 August, still open.

**The question**

> Should the full word "Representative" also be used on the screen and on the customer's card?

**Options**

> A) Yes - use the full word everywhere it appears, not only in the downloaded files.
>
> B) No - only the downloaded files matter. The screen can stay as it is.

**Your answer:** _______________________________________________


---

## Section 3 — Seven small tidy-ups: a tick each, nothing to decide

Six are the unfinished half of a decision you have already made. One is a sentence you have already
written for three reports, which we are asking for on the other three. No test is blocked by any of
them.

### 1. REPORT SUITE - Parts Velocity - one leftover sentence about the Location column

**What happens now**

> Your decision note in this description says the person can switch the Location column on and off. A sentence further down still says the column "is not user-toggleable" and is not offered in the column list.
>
> That is the strongest of the six leftovers - it says the opposite of your decision, in plain words.

**The question**

> Nothing to decide - please delete or reword that sentence next time you have the description open.

**Options**

> (Nothing to choose - a tick is enough.)

**Your answer:** _______________________________________________

### 2. REPORT SUITE - Work In Progress - one leftover sentence about the Location column

**What happens now**

> Your decision note here says the person can switch the column on and off. A sentence further down still says it is shown automatically and that the user does not toggle it, and two other places describe it as appearing on its own.
>
> So this description currently contains both answers, one of them in so many words.

**The question**

> Nothing to decide - please delete or reword those sentences next time you have the description open.

**Options**

> (Nothing to choose - a tick is enough.)

**Your answer:** _______________________________________________

### 3. REPORT SUITE - Inventory Value - one leftover sentence about the Location column

**What happens now**

> Your decision note here says the person can switch the column on and off. A sentence further down still says its visibility follows the location scope automatically, and that it is not one of the columns offered in the column-selection control.
>
> So this description also contains both answers.

**The question**

> Nothing to decide - please delete or reword that sentence next time you have the description open.

**Options**

> (Nothing to choose - a tick is enough.)

**Your answer:** _______________________________________________

### 4. REPORT SUITE - Sales By Customer - one milder leftover about the Location column

**What happens now**

> Milder than the three above. This description does not say the person cannot switch the column - it simply still has a summary sentence saying the column shows only when more than one location is in view and hides when a single location is in view.
>
> Your newer wording in the same document says the opposite: on by default, and available whatever the person has picked.

**The question**

> Nothing to decide - please tidy that summary sentence next time you have the description open.

**Options**

> (Nothing to choose - a tick is enough.)

**Your answer:** _______________________________________________

### 5. REPORT SUITE - Sales By Representative - one milder leftover about the Location column

**What happens now**

> The same mild leftover. A numbered requirement still says the column shows only when the view spans more than one location, and hides when it is narrowed to a single one.
>
> Your newer wording earlier in the same document says it is on by default and can be switched on or off whatever is picked.

**The question**

> Nothing to decide - please tidy that requirement next time you have the description open.

**Options**

> (Nothing to choose - a tick is enough.)

**Your answer:** _______________________________________________

### 6. REPORT SUITE - Technician Utilization - one milder leftover about the Location column

**What happens now**

> The same mild leftover, in two places: the column is described as hidden whenever a single location is in view.
>
> Your newer wording in the same document says it is on by default and can be switched on or off regardless of how many locations are picked.

**The question**

> Nothing to decide - please tidy those two sentences next time you have the description open.

**Options**

> (Nothing to choose - a tick is enough.)

**Your answer:** _______________________________________________

### 7. REPORT SUITE - Parts Velocity, Technician Utilization and Work In Progress - the download size limit you have already written down elsewhere

**What happens now**

> All six reports refuse to build a download once the result would run past about ten thousand rows, and show "This report is too large to export. Narrow the date range or filters, then try again." That is deliberate and it is correct.
>
> Three of your six descriptions already say so - Sales By Customer, Sales By Representative and Inventory Value. The other three do not mention it at all. So this is not a question about whether there is a limit; it is a request to copy a sentence you have already written into the three that are missing it.
>
> Why it matters: on those three a tester who meets that message has nothing to check it against, and the honest thing for them to do is raise it as a fault - against behaviour that is entirely correct.
>
> One correction to our own record, so you are not misled: we previously told you that NONE of the six mentioned this limit. That was wrong - three of them do.

**The question**

> Please add the limit to Parts Velocity, Technician Utilization and Work In Progress.

**Options**

> A) Yes, I will add it to those three.
>
> B) No - leave it out of those three. (Then please say why they are different, because the product behaves the same on all six.)

**Your answer:** _______________________________________________


---

## QA-only — not for Chris

The question-to-case mapping is on the spreadsheet's `QA internal - not for Chris` tab — every question's affected
TestRail case IDs with links, the requirement anchors quoted from the live pages, and what each
possible answer resolves to. It is imported verbatim from the earlier sheet's generator so the two
cannot drift, with three notes added recording that this friendly version supersedes the earlier
pair for sending, that all 13 items are carried over unchanged, and that no source was re-fetched
because only the presentation changed.

**Do not forward that tab.**
