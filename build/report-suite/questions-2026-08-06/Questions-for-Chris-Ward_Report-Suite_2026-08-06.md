**⚠️ SUPERSEDED 2026-08-06 — DO NOT SEND THIS FILE. The version to send is `Questions-for-Chris-Ward_Report-Suite_Friendly-Version_2026-08-06.xlsx` (plain-language twin `Questions-for-Chris-Ward_Report-Suite_Friendly-Version_2026-08-06.md`) in this same folder: same substance, reordered by what to do first and rewritten to read easily. This file is kept only as the record of what was verified and when.**

# Questions for Chris Ward — Report Suite — 2026-08-06

**Project: Report Suite (the six reports) · epic SV-8582 · Product Owner: Chris Ward**

**This is the plain-language twin of `Questions-for-Chris-Ward_Report-Suite_2026-08-06.xlsx`.**
The spreadsheet is the version to send; it mirrors the 2026-08-04 and 2026-08-05 Chris Ward sheets'
format exactly, and it carries a QA-only tab that must not be forwarded.

**DRAFT — NOT SENT. Nothing has been written to TestRail or Jira.**

Authorised by the QA lead, verbatim: *"If there are more questions for Chris make sheet for him."*

Thank you - your last round of answers landed well and most of the reporting work moved straight away. This sheet is the rest of what is genuinely still open. Every question says which project and which report it is about, because we know you look after more than one thing here.

**Thirteen items in total: one confirmation that releases seven held tests, five decisions, and
seven small wording edits that need no decision at all.**

**Live source versions confirmed on 2026-08-06, immediately before writing** — Sales By Customer
**version 15** · Sales By Representative **version 17** · Parts Velocity **version 5** ·
Technician Utilization **version 6** · Work In Progress **version 9** · Inventory Value
**version 4**. Every sentence quoted below comes from that fetch.

---

## Tab 1 — Needed first - Location column

Needed first, please — this is a one-line confirmation and it releases seven tests that are on hold
today.

### Item 1.0 — Report Suite - the Location column - all six reports (the "show or hide columns" story on each report, under epic SV-8582)

**What happens now**

> This is a one-line confirmation rather than a fresh decision, and it is the only thing holding seven of our tests.
>
> You have already decided this. The note recording your decision appears in every one of the six written descriptions, and it says the same thing each time: anyone who can see more than one location gets the Location column, it is on by default, and they can switch it on or off themselves from the list of columns. Someone who can see only one location never sees it at all.
>
> What is missing is only the tidy-up. Older sentences are still sitting in all six descriptions saying the column appears and disappears on its own depending on how many locations are picked - and on three of the six one of those sentences goes further and says flatly that the person cannot switch it on or off. Those are listed one per report on the third tab, as ticks rather than questions.
>
> Why we are asking: we do not want to release seven tests on our own reading of a note. One word from you and they go.

**The question**

> Is this right - anyone who can see more than one location gets the Location column, on by default, and can switch it on or off themselves?

**Options**

> A) Yes, that is the rule - it is an access thing, not a picking thing, and the person can switch it on or off whenever they like. (Then the older sentences on the third tab are just leftovers to delete, and our seven tests come off hold the same day.)
>
> B) No - the column should appear and disappear on its own depending on how many locations are picked, and the person should not be able to switch it. (Then the newer note in all six descriptions is the one that needs removing, and we rewrite the seven tests.)
>
> C) Something else, or it should differ between reports - please describe it.

**Your answer:** _______________________________________________


---

## Tab 2 — Decisions we need

Five questions, each a plain A or B. Two of them were asked on 5 August and are here again because
they are still open, not because we forgot.

### Item 1.0 — Report Suite - all six reports - which heading each report sits under in the Reports menu (the "report access and navigation placement" story on each report, for example SV-8600)

**What happens now**

> The six new reports are currently spread across three headings in the Reports menu. Work In Progress, Technician Utilization and Sales By Representative sit under PERFORMANCE. Parts Velocity and Inventory Value sit under PARTS. Sales By Customer sits on its own under SALES.
>
> None of the six written descriptions says which heading a report belongs under. They only say the report "appears in the Reports left-side navigation", which it does.
>
> Why we are asking: one of our tests had been written expecting Sales By Customer under Performance. That expectation came from a walkthrough video last month, not from any current description, so we have taken it out rather than guess. Right now the test records the heading and does not judge it, which is honest but not much of a test.

**The question**

> Is that arrangement the one you want - three of them under Performance, two under Parts, and Sales By Customer under Sales?

**Options**

> A) Yes, leave them spread as they are. (Then please add the heading to each description so there is something to test against.)
>
> B) No - all six should sit together under one heading. Please say which.
>
> C) Something else - please describe where each one should go.

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - Sales By Customer - an invoice the person is not allowed to open (the invoice-link story, under epic SV-8582)

**What happens now**

> Your Sales By Customer description says two different things about the same thing, and both are in the current version.
>
> One part says a person who cannot open an invoice is not given a link at all - the invoice number is shown as ordinary text.
>
> Another part says that person does get a link, clicks it, and lands on the standard "you are not allowed in" page, from which they can press back.
>
> Why we are asking: three of our tests are on hold on this one point, and the two answers need completely different tests. This is the same question that went to you on 5 August - it is repeated because it is still open, not because we forgot.

**The question**

> Which one do you want?

**Options**

> A) No link at all. For that person the invoice number is plain text and there is nothing to click.
>
> B) A link they can click, which takes them to the "you are not allowed in" page.
>
> C) Something else - please describe it.

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - Sales By Representative - the same link rule, which never got written into the numbered requirements (the invoice-link and customer-link story, under epic SV-8582)

**What happens now**

> On 5 August you added the rule that a link is only a link when the person is allowed to open what it points at. Thank you - it was written into Sales By Customer properly.
>
> On Sales By Representative it only went into the opening paragraph. The numbered requirements underneath still say, flatly, that each invoice number on a detail row is a clickable link, and that each customer name on a detail row is a clickable link.
>
> Why we are asking: a tester reading only the numbered requirements would expect a link for everybody, and would raise a fault against a correct build.

**The question**

> Should the numbered requirements on Sales By Representative be updated to match Sales By Customer?

**Options**

> A) Yes, please update them so they say the same as Sales By Customer.
>
> B) No - Sales By Representative should keep links for everybody, whether or not they can open what the link points at.

**Your answer:** _______________________________________________

### Item 4.0 — Report Suite - Sales By Representative - what paper size and orientation the printable downloads should use (the download story, under epic SV-8582)

**What happens now**

> Your two descriptions disagree with each other about the same thing.
>
> The Sales By Representative description says its printable downloads are A4 portrait. The Sales By Customer description says A4 landscape.
>
> The Sales By Representative table has sixteen columns, which would not fit across a portrait page at all, and when we last looked both reports came out landscape.
>
> Why we are asking: one of our tests currently states portrait, word for word from your description, and is marked ready for the automation team to pick up. If portrait is not what you want, that test is wrong and we would rather fix it before it is automated than after.

**The question**

> For Sales By Representative, should the printable downloads be A4 landscape or A4 portrait?

**Options**

> A) A4 landscape, the same as Sales By Customer - and the Sales By Representative description should be corrected to say landscape.
>
> B) A4 portrait, as its description currently says. (Then we raise the difference with the developers.)

**Your answer:** _______________________________________________

### Item 5.0 — Report Suite - Sales By Representative - the word "Representative" on the screen and on the customer's card (the representative-assignment story, under epic SV-8582)

**What happens now**

> You confirmed that "Representative" on its own is fine in the downloaded files, and we have matched our tests to that.
>
> Two tests are still on hold because they are about the word on the SCREEN and on the customer's card, not in the files. You were only asked about the files, so we did not want to stretch your answer to cover screens you had not been shown.
>
> Why we are asking: two tests come off hold the moment you answer, whichever way you answer. This one was asked on 5 August and is still open.

**The question**

> Should the full word "Representative" also be used on the screen and on the customer's card?

**Options**

> A) Yes - use the full word everywhere it appears, not only in the downloaded files.
>
> B) No - only the downloaded files matter. The screen can stay as it is.

**Your answer:** _______________________________________________


---

## Tab 3 — Small tidy-ups - one tick each

**No decisions on this tab.** Seven small wording edits in your own descriptions — six are the
unfinished half of a decision you have already made, and one is a sentence you have already written
for three reports which we are asking for on the other three. A tick is enough on each.

### Item 1.0 — Report Suite - Parts Velocity - one leftover sentence about the Location column

**What happens now**

> Your decision note in this description says the person can switch the Location column on and off. A sentence further down still says the column "is not user-toggleable" and is not one of the columns offered in the picker.
>
> That is the strongest of the six leftovers: it says the opposite of your decision in plain words. Parts Velocity is also the one report where the older wording was never revisited on this point.

**The question**

> Nothing to decide - please delete or reword that sentence next time you have the description open.

**Options**

> (No options - a tick is enough. Tick here if you would like us to keep reminding you until it is done.)

**Your answer:** _______________________________________________

### Item 2.0 — Report Suite - Work In Progress - one leftover sentence about the Location column

**What happens now**

> Your decision note in this description says the person can switch the Location column on and off. A sentence further down still says the column is shown automatically and that "the user does not toggle it in the column selector", and two other places describe it as appearing automatically.
>
> So this description currently contains both answers, one of them in so many words.

**The question**

> Nothing to decide - please delete or reword those sentences next time you have the description open.

**Options**

> (No options - a tick is enough. Tick here if you would like us to keep reminding you until it is done.)

**Your answer:** _______________________________________________

### Item 3.0 — Report Suite - Inventory Value - one leftover sentence about the Location column

**What happens now**

> Your decision note in this description says the person can switch the Location column on and off. A sentence further down still says its visibility "follows the location scope automatically" and that it "is not one of the columns offered in the column-selection control".
>
> So this description also contains both answers.

**The question**

> Nothing to decide - please delete or reword that sentence next time you have the description open.

**Options**

> (No options - a tick is enough. Tick here if you would like us to keep reminding you until it is done.)

**Your answer:** _______________________________________________

### Item 4.0 — Report Suite - Sales By Customer - one milder leftover sentence about the Location column

**What happens now**

> Milder than the three above. This description does not say the person cannot switch the column - it simply still has a summary sentence saying the column is shown only when more than one location is in view and hidden when a single location is in view.
>
> Your newer wording in the same document says the opposite: that it is on by default and stays available whatever the person has picked.

**The question**

> Nothing to decide - please tidy that summary sentence next time you have the description open.

**Options**

> (No options - a tick is enough. Tick here if you would like us to keep reminding you until it is done.)

**Your answer:** _______________________________________________

### Item 5.0 — Report Suite - Sales By Representative - one milder leftover sentence about the Location column

**What happens now**

> The same mild leftover. A numbered requirement still says the column is shown only when the view spans more than one location and is hidden when the view is narrowed to a single location, "because that one location is already unambiguous".
>
> Your newer wording earlier in the same document says it is on by default and can be switched on or off whatever is picked.

**The question**

> Nothing to decide - please tidy that requirement next time you have the description open.

**Options**

> (No options - a tick is enough. Tick here if you would like us to keep reminding you until it is done.)

**Your answer:** _______________________________________________

### Item 6.0 — Report Suite - Technician Utilization - one milder leftover sentence about the Location column

**What happens now**

> The same mild leftover, in two places: the column is described as hidden whenever a single location is in view.
>
> Your newer wording in the same document says it is on by default and can be switched on or off regardless of how many locations are picked.

**The question**

> Nothing to decide - please tidy those two sentences next time you have the description open.

**Options**

> (No options - a tick is enough. Tick here if you would like us to keep reminding you until it is done.)

**Your answer:** _______________________________________________

### Item 7.0 — Report Suite - Parts Velocity, Technician Utilization and Work In Progress - the download size limit you have already written down elsewhere

**What happens now**

> Every one of the six reports refuses to build a download once the result would run past about ten thousand rows, and shows "This report is too large to export. Narrow the date range or filters, then try again." That is deliberate and it is correct.
>
> Three of your six descriptions already say so - Sales By Customer, Sales By Representative and Inventory Value. The other three do not mention it at all.
>
> So this is not a question about whether there is a limit. It is a request to copy the sentence you have already written into the three that are missing it.
>
> Why we are asking: on those three reports a tester who meets that message has nothing to check it against, and the honest thing for them to do is raise it as a fault - against behaviour that is entirely correct.
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

The internal question-to-case mapping lives on the spreadsheet's `QA internal - not for Chris` tab: every question's
affected TestRail case IDs with links, the requirement anchors quoted from the live pages, and what
each possible answer resolves to. It also records the method notes — how all 476 of our cases were
searched live, what was deliberately left OFF the sheet and why, the source-currency block, and the
three stale numbers in our own records that were corrected before anything went in front of Chris.

**Do not forward that tab.**
