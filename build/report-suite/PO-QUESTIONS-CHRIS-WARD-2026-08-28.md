# Report Suite — questions for Chris Ward — 28 August 2026

> **STATUS: WRITTEN AND READY. NOT SENT.** The QA lead approved *preparing* this sheet, not sending
> it. Under Rule 66 a question sheet goes out only once everything we can do ourselves is finished,
> and the QA lead sends it.
>
> **⚠️ THIS SHEET SUPERSEDES THE UNSENT DRAFT OF 2026-08-26**,
> `build/report-suite/questions-2026-08-26/Report-Suite_Questions-for-Chris-Ward_2026-08-26.md` and
> its `.xlsx` twin. **That draft was never sent.** Its two questions — the Sales By Representative
> nine-versus-eight column count and what the Work In Progress Estimates figure counts — are
> **questions 1 and 2 here**, carried across with nothing lost, **re-read against the live
> descriptions on 2026-08-28** (they were written against Sales By Representative v24 and Work In
> Progress v28 and both still read the same way), and with the live status of every test they touch
> corrected. Three further questions that were already open elsewhere are added. **Send this one, not
> the older draft.**
>
> **If a spreadsheet is wanted for sending**, the established workbook shape and its QA-only tab are
> produced by `build/report-suite/questions-2026-08-26/gen_chris_sheet.py`; this file is the
> plain-language twin, which is what was asked for.

Plain-language product questions only — no test jargon, no case numbers in anything Chris reads, no
bug reports. Every question below names the **project** and the **report** it belongs to, quotes the
written description **word for word** with the version we read and a link to it, and says exactly
what we do with each possible answer.

Everything here was re-read in the **live** descriptions on **28 August 2026**:
**Sales By Representative version 24** (last edited 24 August) ·
**Work In Progress version 28** (last edited 24 August) ·
**Parts Velocity version 11** (last edited 20 August) ·
**Inventory Value version 10** (last edited 13 August).

---

## The questions at a glance

| # | Project | Report | The question in one line | Why we cannot answer it ourselves | What it is holding up |
|---|---|---|---|---|---|
| **1** | Report Suite | **Sales By Representative** | Is **Shop Supplies** one of the columns a user can switch on and off, or is it always shown? | Your description says **"nine"** and then lists **eight**, and a different part of the same document counts Shop Supplies among the nine. Both cannot be right, and nothing in the document settles it. | Two tests currently follow the **eight**-name list. If the answer is nine, both need editing |
| **2** | Report Suite | **Work In Progress** | Does the **Estimates** figure include a discount or fee that was added to the whole work order, or only the unapproved job lines? | Three parts of the same description say different things — one says the adjustments are included, the pop-up explanation says it is only the estimate lines, and a third says Estimates is kept out of the two totals. | One test currently follows the pop-up (lines only) and would be **wrong** if the answer is A; a second cannot be written at all |
| **3** | Report Suite | **Parts Velocity** | Should the **Location** column behave the same way here as on the other five reports — always available and switched on or off by the user — or should it appear only when more than one location is in view? | Parts Velocity is the one report you have not ruled on. Its description still describes the old behaviour, and it is the newest version of that document, so we cannot treat your other rulings as covering it. | Two tests are hedged: they check only the uncontested half and tell the tester not to fail the build on the rest |
| **4** | Report Suite | **Inventory Value** (and the other five) | Is the **10,000-row limit** on downloads the final number for all six reports? | Your Inventory Value description still carries your own bracketed note asking for the value to be confirmed. | Nothing is held, but six tests each need a one-number edit if it changes |
| **5** | Report Suite | **Sales By Customer** | Which menu group does **Sales By Customer** belong in — **Sales** or **Performance**? | Asked twice before and left blank both times. Our build notes say Sales; your description says Performance. | One test follows **Performance**; if the answer is Sales it needs editing |

---

# 1 — Sales By Representative: is Shop Supplies a column the user can switch off?

**Project:** Report Suite · **Report:** Sales By Representative

**What happens now.** Your description has a list of the columns a user is allowed to switch on and
off from the column button. It begins by saying there are **nine** of them, and then names **eight**.
The one missing from the list is **Shop Supplies**. Elsewhere in the very same document, the full
left-to-right column list counts **nine** metric columns and **Shop Supplies is one of them**. So one
part of the document treats Shop Supplies as switchable and the other leaves it out.

**Quoted word for word from the live description — Sales By Representative, version 24, requirement
S20-R2:**

> "The nine toggleable columns are: Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts
> Margin, Adjustments, Margin, Margin %."

**And from the same version, requirement S5-R2:**

> "The columns appear left-to-right: Date, Invoice, Customer, Status, Labor Delta, Labor Invoiced,
> Labor Margin, Parts Invoiced, Parts Margin, **Shop Supplies**, Adjustments, Margin, Margin %,
> Subtotal. (14 columns: four leading identifier columns, **nine metric columns**, and Subtotal.)"

Source: <https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/585629698/SBR+Sales+By+Representative+Report> (version 24, last edited 24 August 2026).

**The question:** Can a user switch the Shop Supplies column off, like the other metric columns, or is
it always shown?

**Options:**

- **A) Shop Supplies CAN be switched off** — there really are nine switchable columns and the list
  simply lost one name.
- **B) Shop Supplies is ALWAYS shown** — it is not offered in the column button, and the count should
  read eight, not nine.

**What we do with your answer.** Our two tests today follow the **eight**-name list, word for word.
**If B** we change nothing and only ask for the word "nine" to be corrected to "eight". **If A**,
both tests change to expect **nine** switches including Shop Supplies, and one of them also stops
telling the tester that Shop Supplies is always on. **We will not guess**, because the two answers
make a tester fail opposite builds.
*(Internal, not for Chris: [C30265](https://shopview.testrail.io/index.php?/cases/view/30265) — "Column selector:
eight metric toggles" — and [C43831](https://shopview.testrail.io/index.php?/cases/view/43831) — "The eight
toggleable metric columns include Adjustments". Both `AUTOMATION: READY` today.)*

**Your answer:** ____________________

---

# 2 — Work In Progress: what goes into the Estimates figure?

**Project:** Report Suite · **Report:** Work In Progress

**What happens now.** A work order can carry a discount or a fee that applies to the **whole work
order**, rather than to any single job line. Your description says three different things about
whether that whole-work-order amount is counted in the **Estimates** figure at the top of the report.

**Quoted word for word from the live description — Work In Progress, version 28, requirement S5-R8:**

> "Estimates is the total quoted value of the jobs in the 'Estimates' tab, **including their
> work-order-level adjustments** so the figure matches the estimate document the customer sees."

**But the pop-up explanation the user actually reads, in the same version, requirement S5-R12, says:**

> Estimates — "The total value of all **estimate lines** that have not yet been approved, including
> lines awaiting authorization on open work orders."

**And requirement S5-R9 in the same version says:**

> "The Estimates figure is excluded from Total Earned and from Total Remaining."

The pop-up talks only about **lines**, and your description says elsewhere that a whole-work-order
adjustment "is shown as one whole-work-order amount and is never split" — so it is not a line. That
makes the first quotation and the pop-up point in opposite directions, and the third quotation means
whichever way it goes the figure does not have to reconcile with anything else on the report.

Source: <https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/703660034/WIP+Work+In+Progress+Report> (version 28, last edited 24 August 2026).

**The question:** Does the Estimates figure include a discount or fee added to the whole work order,
or only the value of the unapproved job lines?

**Options:**

- **A) It INCLUDES the whole-work-order discounts and fees** — so the figure matches the estimate
  document the customer is shown. (The pop-up wording then needs a small edit so it says so.)
- **B) It is ONLY the unapproved job lines** — whole-work-order discounts and fees are left out.
  (Then S5-R8 needs the "including their work-order-level adjustments" phrase removed.)

**Why this one matters more than the others.** Our test today follows your **13 August design
review**, which counted the figure **per line**, and it says so openly. But S5-R8 is in **version 28,
published on 24 August** — later than that review — and it says the whole-work-order adjustments
**are** included. On our rules the later statement wins, so **as things stand our test is testing the
older instruction.** We have not changed it, because the pop-up wording in that same version 28 still
agrees with the older reading, and we will not pick a side inside one document.

**What we do with your answer.** **If A**, the test changes to check that a work order with a
whole-work-order discount moves the Estimates figure by that exact amount, and we ask for the pop-up
wording to be tidied to match. **If B**, the test stays as it is and S5-R8 needs the phrase
"including their work-order-level adjustments" removed. Either way we can then write the second test,
which cannot be written today because it would have to assert one of the two.
*(Internal, not for Chris: [C30491](https://shopview.testrail.io/index.php?/cases/view/30491), `AUTOMATION: READY`,
currently carrying a divergence sentence naming the 13 August design review as prevailing.)*

**Your answer:** ____________________

---

# 3 — Parts Velocity: how should the Location column behave? (asked before, still open)

**Project:** Report Suite · **Report:** Parts Velocity

**What happens now.** On the other five reports you settled this: the Location column is available to
anyone who can see more than one location, and the **user** switches it on or off from the column
button. **Parts Velocity is the one report you have not ruled on**, and its description still
describes the older behaviour — the column appears or disappears **by itself** depending on how many
locations are in view, and it is not among the columns the user can switch.

**Quoted word for word from the live description — Parts Velocity, version 11, requirement S2-R12:**

> "When the Location filter (S2-R9) resolves to more than one location in scope, the table shows a
> per-row Location column identifying each row's location; **when a single location is in scope the
> column is hidden**."

**And from the same version, requirement S4-R1:**

> "A column picker is accessible via a toolbar button. It lists **all 20 available columns**, each
> with a toggle."

— a list of twenty that does not include Location.

Source: <https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/620888066/Parts+Velocity+Report> (version 11, last edited 20 August 2026).

**The question:** Should Parts Velocity behave like the other five — the user switches the Location
column on and off — or should it keep the automatic show/hide behaviour its description still
describes?

**Options:**

- **A) Same as the other five** — the user switches it on and off; the automatic hiding goes; the
  description needs the same edit you already made to the others.
- **B) Parts Velocity keeps the automatic behaviour** — it is deliberately different, and we test it
  as written.

**What we do with your answer.** Two Parts Velocity tests are currently **hedged**: they check only
the part nobody disputes and tell the tester in plain words not to fail the build on the rest. Your
answer lets us delete the hedge and check the whole behaviour on that report, like the other five.
**We deliberately have not assumed your other five rulings cover this one** — this is the newest
version of the Parts Velocity document and it still says the opposite.
*(Internal, not for Chris: [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) — **Automated** — and
[C38914](https://shopview.testrail.io/index.php?/cases/view/38914). Recorded as RS-Q2 / P3 / RS-BV-4(c) in
`build/OUTSTANDING-ITEMS-REGISTER.md`.)*

**Your answer:** ____________________

---

# 4 — All six reports: is 10,000 rows the final download limit? (asked before, still open)

**Project:** Report Suite · **Reports:** all six, raised on **Inventory Value**

**What happens now.** All six descriptions now say a download is refused above **10,000 rows**, with
the same message to the user. But the Inventory Value description still carries **your own bracketed
note** asking for the number to be confirmed, so we do not know whether 10,000 is final or a
placeholder.

**Quoted word for word from your Inventory Value description:**

> "[Cap value 10,000 is a proposed default — confirm the exact suite-standard value with the owner
> before dev.]"

Source: <https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/720142338/Inventory+Value+Report> (version 10, last edited 13 August 2026).

**The question:** Is 10,000 rows the final limit for all six reports, or is a different number coming?

**Options:**

- **A) 10,000 is final** — we leave the tests as they are and the bracketed note can be deleted.
- **B) A different number** — please tell us what it is.

**What we do with your answer.** Nothing is held by this. **If A** we delete nothing and only ask for
the note to be tidied. **If B**, six tests each need the number changed in one place, which is quick,
but it must be done before testers use them or six correct builds get failed.
*(Internal, not for Chris: C30172, C30290, C38885, C38887, C38918, C30593. Recorded as RS-Q3.)*

**Your answer:** ____________________

---

# 5 — Sales By Customer: which menu group? (asked twice before, left blank both times)

**Project:** Report Suite · **Report:** Sales By Customer

**What happens now.** Our build notes put **Sales By Customer** in the **Sales** menu group. Your
description puts it under **Performance**. This has been on two previous sheets and was left blank
both times, so one test still cannot be finished.

**The question:** Which menu group should Sales By Customer appear in — **Sales** or **Performance**?

**Options:**

- **A) Sales**
- **B) Performance**

**What we do with your answer.** Our test follows your description today and expects **Performance**.
**If B** nothing changes and our build notes get corrected. **If A**, the test changes to Sales and
your description needs the same edit. It is a one-line answer and it closes the last open navigation
question on the suite.
*(Internal, not for Chris: [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) — "Sales By Customer
listed under Performance, below existing…", `AUTOMATION: READY`. Recorded as P5.)*

**Your answer:** ____________________

---

## Deliberately NOT on this sheet, and why

| Previously open | Why it is not asked here |
|---|---|
| The Work In Progress **tab-placement** contradiction (RS-Q1) | **You answered it on 19 August** and tidied the live document yourself (the new line-state rules). Nothing left to ask. |
| Whether the heading is **"Representative"** or **"Sales Representative"** (P5, second half) | **You answered it on 5 August** — *"'Representative' on its own is fine"* — and version 24 now words it that way. Our tests were corrected on 28 August. |
| Whether an **invoice number is a link or plain text** (RS-BV-4(b)) | **Version 24 now settles it in one sentence**: the number is *"a clickable link … rendered as a link only when the user has permission to open that target, otherwise plain text."* We are re-checking the held tests against that wording rather than asking you again. |
| The **location-column edits in four documents** (P2) | Those are *"please finish the edit"*, not *"please decide"*. They belong in a tidy-up list, not on a decision sheet. |

## OUTSTANDING — what I need from you

0. **Correction of record, stated rather than smoothed over:** an earlier draft of this sheet said
   questions 1, 2 and 5 each **held** a test. They do not. All three tests are live and
   `AUTOMATION: READY` — each simply follows **one** of the two readings, so a wrong answer means a
   tester fails a correct build rather than skips a test. Verified live on 2026-08-28. The three
   genuinely held tests on this suite (C30310, C30315, C43559) are all on the invoice-link item,
   which is **not** on this sheet.
1. **This sheet is written and NOT sent.** Rule 66 — it goes out once everything we can do ourselves
   on the Report Suite is finished, and you send it. **Do you want it sent now, or held?**
2. **Question 1 and question 2 each hold a test today**, and question 2 also blocks writing a second
   test. If you would rather send only those two, say so and the other three can wait.
3. **The invoice-link question looks answered at source** by Sales By Representative version 24.
   **May I re-check the three tests held on it (C30310, C30315, C43559) against that wording** and
   close the item if it fits? That is a read plus, if it fits, three re-pins.
