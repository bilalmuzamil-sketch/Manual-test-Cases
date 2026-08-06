# QUESTIONS FOR CHRIS WARD — raw material, 2026-08-06

**This is raw material for his next question sheet, not the sheet itself.** Building the sheet is queued
separately. Every question below is written the way it should reach him: plain words, one thing at a time,
"what happens now" plus the question plus simple options (Standing Rules 7 and 55).

**Rule 55: every row names the project and the report**, because Chris owns **two** things — the Report
Suite **and** Fees & Discounts — so "the export" or "the date filter" is genuinely ambiguous to him.

**None of these questions changed a test case's expectation.** Where a source is silent or contradicts
itself, the case says so plainly and waits (Rule 58).

---

## Q1 · Report Suite — all six reports — which group in the Reports menu?

**What happens now.** The six new reports are spread across three headings in the Reports menu. Work In
Progress, Technician Utilization and Sales By Representative sit under **PERFORMANCE**. Parts Velocity and
Inventory Value sit under **PARTS**. Sales By Customer sits on its own under **SALES**.

**The question.** Is that the arrangement you want?

- **A** — Yes, leave them spread across Performance, Parts and Sales as they are now.
- **B** — No, all six should sit together under one heading. (Please say which.)

**Your answer:** ______

**Why we are asking.** None of the six written descriptions says which heading a report belongs under, so
we have nothing to test against. One of our tests had been written expecting Sales By Customer under
Performance; we have taken that expectation out rather than guess.

---

## Q2 · Report Suite — Sales By Customer — what should the totals line do when nothing matches?

**What happens now.** If you narrow Sales By Customer until no customers match, you get the message "No
sales data found for the selected filters." and **no totals line at all**. The same is true of a
spreadsheet or PDF downloaded in that state: you get the column headings and nothing else.

**The question.** When nothing matches, should there still be a totals line showing zeros?

- **A** — Yes, show a totals line of zeros, on screen and in the downloads.
- **B** — No, no totals line when there is nothing to total. What happens now is right.

**Your answer:** ______

**Why we are asking.** Two of our tests said "a totals row of zeros" and nothing in the written
description says that, so we have taken the claim out and are asking you instead.

---

## Q3 · Report Suite — Sales By Customer — an invoice someone is not allowed to open

**What happens now.** The written description says two different things in the same document. One part
says a person who cannot open an invoice **is not given a link at all** and just sees the invoice number
as ordinary text. Another part says that person **clicks the link and lands on a page telling them they
are not allowed in**.

**The question.** Which one do you want?

- **A** — No link at all. The invoice number is plain text for that person.
- **B** — A link they can click, which takes them to the "you are not allowed in" page.

**Your answer:** ______

**Why we are asking.** Both are written down today, so we cannot tell which is correct, and two of our
tests are waiting on your answer. This is the same question that was already raised on 5 August — it is
repeated here because it is still open, not because we forgot.

---

## Q4 · Report Suite — Sales By Representative — the same link rule, but it never got written down

**What happens now.** On 5 August you added the rule that a link is only a link when the person is allowed
to open what it points at. It was written into Sales By Customer properly. On Sales By Representative it
only went into the introductory paragraph — the numbered requirements still say, flatly, "Each invoice
number on a detail row is a clickable link" and "Each customer name on a detail row is a clickable link".

**The question.** Should the numbered requirements on Sales By Representative be updated to match?

- **A** — Yes, please update them so they say the same as Sales By Customer.
- **B** — No, Sales By Representative should keep unconditional links.

**Your answer:** ______

---

## Q5 · Report Suite — the Location column — the one that is blocking eight tests

**What happens now.** Four of the six written descriptions say the Location column **two different ways in
the same document**. One part says a person who can see more than one location gets the column and can
switch it on and off themselves. Another part says the column is automatic and the person never switches
it.

We checked the product on 6 August so you have the facts: on Sales By Customer the column **disappears the
moment you pick a single location**, and it is **never offered in the column list** — that list holds
exactly the nine money columns and nothing else.

**The question.** Which of these is right?

- **A** — Automatic. Shown when more than one location is involved, hidden otherwise, never in the column
  list. (This is what the product does today.)
- **B** — The person's own choice. Anyone who can see more than one location gets the column in the list
  and can switch it on or off, whatever they have picked.

**Your answer:** ______

**Why we are asking.** Eight tests are on hold for this and cannot come off hold until you answer. It is
also worth saying that **you have already decided this** — the decision notes in four of the descriptions
say the column is the person's own choice. What is missing is the tidy-up: four numbered requirements still
say the opposite. **So this may be a five-minute edit rather than a decision.** The four are Sales By
Representative S21-R7, Work In Progress S7-R13, Inventory Value S7-R6 and Sales By Customer S13-R4 — and
Parts Velocity S3-R10 was never changed on this point at all.

---

## Q6 · Report Suite — the ten-thousand-row download limit is missing from three descriptions

**What happens now.** Every one of the six reports refuses to build a download once the result would run
past about ten thousand rows, and shows "This report is too large to export. Narrow the date range or
filters, then try again." That is deliberate and it is correct.

**Three of the six descriptions say so** — Sales By Customer, Sales By Representative and Inventory Value.
**Three do not mention it at all**: Parts Velocity, Technician Utilization and Work In Progress.

**The question.** Please add the limit to the three that are missing it.

- **A** — Yes, add it to Parts Velocity, Technician Utilization and Work In Progress.
- **B** — No, leave it out of those three. (If so, please say why they are different.)

**Your answer:** ______

**Why we are asking.** For the three reports that document it we can test the limit against your written
description. For the other three the only place it exists is an engineering ticket, which is not a product
description — so a tester meeting the message on those reports has nothing to check it against.

**Honest note on our own record.** We previously told you that **none** of the six descriptions mentioned
this limit. **That was wrong** — three of them do. The question above is the narrow one that remains.


---

# Added by the third session, 2026-08-06

## Q7 - What paper size and orientation should the Sales By Representative PDFs use?

**What happens now.** The Sales By Representative report offers two PDF downloads. The Summary one comes
out on A4 landscape. The Expanded View one comes out on A3 landscape - a sheet half again as wide, which
will shrink or crop on ordinary office paper.

**Why we are asking rather than just reporting it.** The two written descriptions disagree with each
other about the same thing. The **Sales By Representative** description says the PDFs are **"A4
portrait"**. The **Sales By Customer** description says **"A4 landscape"**. Both reports actually render
landscape, and the Sales By Representative table has sixteen columns, which could not fit on a portrait
page at all.

**The question.** For Sales By Representative, should the PDFs be:

- **A)** A4 **landscape**, the same as Sales By Customer - and the Sales By Representative description
  should be corrected to say landscape.
- **B)** A4 **portrait**, as its description currently says.

**Your answer:** ______

**What it changes for us.** The A3 part is wrong under either answer and has been reported. Your answer
tells us whether the *orientation* half of that test should expect portrait or landscape - we have not
guessed, and the test is on hold for this one point.

---

## A question we were about to ask and then did not - recorded so nobody asks it twice

We nearly asked you whether the date-range chooser should still offer **Today** and **Yesterday**, since
the Sales By Representative description lists them and the report offers **Last 12 Months** and **Last
Week** instead.

**You have already answered this**, on 5 August, and our own test case already follows your answer and
says so on itself. Checking our own newer sources first is what stopped a needless question reaching
you. Nothing is owed here.

---

## Q8 — Work In Progress: when a part is sent back, should the money already counted come back out? (session 5)

**What happens now.** In the Work In Progress report, the Parts Earned figure is the value of the parts on
an approved job that have already arrived. We checked this against every job in the report — 104 of them —
and on 100 the figure is exactly right to the penny.

**On the other four it is out, and all four are jobs where a part was sent back to the supplier.** On three
of them the report shows *less* than the parts that arrived are worth, and on one it shows *more*.

**The question.** When a part that had already arrived is returned, what should happen to the Parts Earned
figure for that job?

- **A** — Take the returned part's value back out, so Parts Earned only ever counts parts that arrived and
  stayed.
- **B** — Leave it in, because the part did arrive and the work was done at the time.
- **C** — Something else (please describe).

**Why we are asking rather than deciding.** The Work In Progress description explains what Parts Earned is,
but it does not say anything at all about returns, so there is no written answer for us to test against. We
have deliberately not guessed: the four jobs are recorded in our findings and the test cases still say what
the description says.

**Which tests this affects.** WIP-EARN Parts Earned and Parts Remaining — cases
[C30477](https://shopview.testrail.io/index.php?/cases/view/30477) and
[C30478](https://shopview.testrail.io/index.php?/cases/view/30478). Both are currently marked as passing on
the main rule; your answer would let us add the returns rule to them.
