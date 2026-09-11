# SV-4314 — what must be bold on the invoice, and what must not (2026-09-11)

**Source:** [SV-4314 "BE Invoice view enhancement"](https://shopview.atlassian.net/browse/SV-4314) —
Task, **Done**, labels `QAcomplete` + `Staging_Verified`, parent SV-3170. Reporter Jasna Mladenovic,
assignee Dipesh Changawala. Read live 2026-09-11: description, acceptance criteria and all **22
comments**, including the two PO rulings that answer questions the description never covered.

**Status: analysis only. Nothing filed, nothing posted.**

---

## ⚠️ First, a correction to my earlier comparison

Earlier today I listed "restore the bold on the sub-item name, the Parts/Labor Total labels and
amounts, the Subtotal amount and the Total amount" as work needed to make the new document match the
old one, and I put the Labor gutter column under "remove".

**SV-4314 requires every one of those changes.** They are not regressions — they are a shipped,
QA-passed, prod-verified product decision from October 2025. I flagged at the time that I could not
tell deliberate changes from regressions without the ticket; this is the ticket, and it says
deliberate.

**And the "old" PDF is the reason the difference showed up at all: `EST-S1113-1190` is a *pre-SV-4314*
render.** It has bold part descriptions, bold Parts/Labor/Line Totals and no Labor/Parts labels —
which is precisely the state SV-4314 was raised to change. It also prints "Issue date:", where the
current Legacy template prints "Invoice Date:". So it is **not** the v26.35.10 baseline the restored
Legacy design is defined against; it is older than that.

---

## The requirement

### From the ticket description and Acceptance Criteria

> Currently, these fields are **bold** and we *do not want them bold anymore*. Remove the bold text
> from the below text:
> * Part Number
> * Part Description
> * **Parts Total**
> * **Labor Total**
> * 'Why are you doing it'
> * The line total dollar amount. **Not the text.**

> **AC 1 — Text formatting.** "Part Number," "Part Description," "Parts Total", "Labor Total" and
> "Why are you doing it" labels are no longer bold in all invoice views. Line total **amount values**
> is no longer bold, **line total text should remain bold**.

> **AC 2 — Labels for items.** All labor line items display the word **"Labor"** before the
> description, **aligned with price on the line item**. All parts line items display the word
> **"Parts"** before the description, aligned with price on the line item.

> **AC 3 — Consistency across outputs.** Invoice preview · Email copy · Downloaded copy (PDF) ·
> Printed copy.

### The two PO rulings in the comments that the description does not contain

Both answer questions raised during QA — the first one answers a question raised in this very
account.

> **Jasna Mladenovic, 2025-10-09:** "can we move Labor label to align with Why are we doing this,
> since the price for the labor is connected to that line? **Labels Labor and Parts should not be
> bolded text.** also, **amount for total and and subtotal shouldn't be bolded, just text.**"

That was her answer to Bilal Muzamil's 2025-10-08 question: *"the Subtotal and Total values at the
bottom of the invoice are also appearing in bold — however, there's no mention of this in the ticket
description. Could you please confirm if these should remain bold…"* — **so the un-bolding of the
Subtotal and Total amounts is ruled, not an accident.**

> **Jasna Mladenovic, 2025-10-13:** "third option is looking the best, **bottom alignment**. also, can
> you **unbold labor total and parts total on the line level**"

> **Jasna Mladenovic, 2025-10-15:** "it should be **aligned with price for the line item, in this case
> at the bottom.** I confirmed this with Fabian."

### Verification on the record

Bilal Muzamil passed all four outputs on 2025-10-15 and 10-16. Nebojsa Glavinic **verified on prod**
2025-10-22, item by item, all Passed.

---

## The bold map

"Where" is the element's place on the printed Estimate / Invoice / Credit Invoice. **Checked** is what
the new document `EST-S1-17520` actually does, measured from the PDF's font names.

### Must NOT be bold

| # | Element | Where | Source | New doc |
|---|---|---|---|---|
| 1 | **Part Number** | part row, description column | AC 1 | not exercised — this document's parts print a description only |
| 2 | **Part Description** | part row, description column | AC 1 | **regular** ✓ ("hub cap", "steer shaft u joint") |
| 3 | **"Why are you doing it"** text | the line's reason row, under the job title | AC 1 | **regular** ✓ |
| 4 | **"Parts Total"** — label | per-line totals, right of the description column | AC 1 + Jasna 13 Oct | **regular** ✓ (24 rows) |
| 5 | **"Labor Total"** — label | per-line totals | AC 1 + Jasna 13 Oct | **regular** ✓ (24 rows) |
| 6 | **Parts Total / Labor Total — amounts** | per-line totals, amount column | Jasna 13 Oct ("on the line level") | **regular** ✓ |
| 7 | **Line Total — the dollar amount only** | per-line totals, amount column | AC 1, explicit | **regular** ✓ (25 rows) |
| 8 | **"Labor" and "Parts" gutter labels** | left of the description column | Jasna 9 Oct | **regular** ✓ (35 labels) |
| 9 | **Subtotal — the amount** | summary block, bottom right | Jasna 9 Oct | **regular** ✓ |
| 10 | **Total — the amount** | summary block, bottom right | Jasna 9 Oct | **regular** ✓ |

### Must STAY bold

| # | Element | Where | Source | New doc |
|---|---|---|---|---|
| 11 | **"Line Total" — the text/label** | per-line totals | AC 1, explicit: *"line total text should remain bold"* | **bold** ✓ (25 rows) |
| 12 | Shop name · document label ("Estimate: EST-…") | masthead, 14.4pt | not named by SV-4314 → unchanged | **bold** ✓ |
| 13 | "Bill To" · "Remit payment to" | section headings, 14.4pt | not named → unchanged | **bold** ✓ |
| 14 | Unit · VIN/Serial # · Asset · Mileage · Eng Hrs | asset table **headers** | not named → unchanged | **bold** ✓ |
| 15 | Service Order · Terms · Due date · Customer PO · Authorizer | second table **headers** | not named → unchanged | **bold** ✓ |
| 16 | Description · Quantity · Rate · Amount | line-table column headers | not named → unchanged | **bold** ✓ |
| 17 | The job / line title ("What are you doing?") | first row of each line | not named → unchanged | **bold** ✓ (25 titles) |
| 18 | Labor · Parts · Shop supplies · Subtotal · Total — the **labels** | summary block | only the *amounts* were ruled | **bold** ✓ |
| 19 | "Customer signature:" · "Printed name:" · "Date:" | signature block | not named → unchanged | **bold** ✓ |

### Deliberately regular, and always were

| Element | Where | New doc |
|---|---|---|
| Shop and customer address lines | masthead, Bill To, Remit payment to | regular ✓ |
| Asset and Service-Order table **values** | under their headers | regular ✓ |
| Item-row Quantity / Rate / Amount | line table | regular ✓ |
| Tech-story / note text | under the description | regular ✓ |
| **"Payments" and "Balance"** labels **and** amounts | summary block | regular — see the open item below |
| Disclaimer | above the signature block | regular ✓ |
| Footer | tax id · "Powered by ShopView" · page number | regular ✓ |

**Result: the new document is compliant with SV-4314 on every bold point that can be checked in it.**
Item 1 is the only one this document cannot exercise.

---

## The two things SV-4314 leaves open

### 1. "Payments" and "Balance" — never decided

Nebojsa raised it on 2025-10-22 while verifying on prod:

> "The only noticeable difference is that the **Payments** and **Balance** labels are bolded in the
> Invoice view but not in the PDFs. However, this was outside the scope of the ticket."

It was never ruled on. In the new PDF both labels and both amounts are regular, while every other
summary label is bold — so the **screen and the PDF still disagree, and the PDF is inconsistent with
its own neighbours.** Worth a decision; it is not a defect against any written requirement.

### 2. The "Labor" label is not always on the price row

AC 2 requires the label "aligned with price on the line item", and Jasna pinned that to **bottom
alignment**, confirmed with Fabian on 2025-10-15.

Measured in `EST-S1-17520`: **26 of 35 gutter labels sit on the same row as their price. 9 do not** —
they print 13.1pt to 65.5pt *above* it, on lines whose description runs to several rows while the
price prints on the last one.

**Honest limit:** I have not rendered the same multi-row line on the pre-refresh production build, so
I cannot say whether those 9 are a break in the Legacy restoration or long-standing behaviour that the
October 2025 prod check did not cover. Nebojsa's own note is ambiguous on exactly this case — he
describes the label printing "in front of the `Why Are You Doing it?` or `What are you doing?` or
`Tech Story` depending on which line is missing" while saying it does align with the rate and amount.
**Settling it needs a v26.35.10 render of a line with a multi-row tech story.**

He also logged a third item that was never ruled on: a **Fixed Line Total** shows the "Labor" label
even when the whole amount was parts.

---

## What SV-4314 does **not** explain

These came out of the old-vs-new comparison and have no source in this ticket:

- the content block being inset **30pt on each side** (538.3pt → 478.3pt);
- the three numeric columns widening **61.5pt → 70.4pt**;
- **20pt** of usable page height lost and the footer moving 10pt up;
- the four vertical gaps that grew (+6.6 / +9.1 / +12.0 / +6.0pt);
- **"Vin" → "VIN/Serial #"** and **"Vehicle" → "Asset"**;
- **"Software Powered by ShopView" → "Powered by ShopView"** and **"Page 1 of 7" → "EST-S1-17520 -
  Page 1 / 5"**.

One of the comparison's items **is** now explained, from a different source: the
[Invoice Design Selection spec](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845447188)
(epic [SV-9892](https://shopview.atlassian.net/browse/SV-9892)) records a **@chris ruling of
2026-09-11**: the Legacy template prints **"Invoice Date" and "Due date" on an estimate**, exactly as
v26.35.10 did, kept deliberately for fidelity. So **"Issue date:" → "Invoice Date:" is ratified, not a
defect.**

That spec is also the governing rule for the restored Legacy design as a whole:

> "**Legacy restores the layout, not the defects.** The Legacy templates are **byte-identical to
> v26.35.10**… every one of these fixes lives in the data handed to the template, not in the template."

So the correct baseline for judging the restored Legacy document is **a v26.35.10 render**, not the
2025 PDF — and the six items above are only defects if they differ from *that*.

---

## Customer feedback on this exact change is already logged

MAX (Qazi Sufyan), 2025-10-22, on SV-4314:

> "We've started receiving multiple customer feedback reports regarding the Invoice View Enhancement
> (bold text and label changes)… Current feedback includes **requests to bring back bold part
> numbers/descriptions and concerns about print readability.**"

Jasna's answer, 2025-10-23:

> "we got a lot of requests from ex Fullbay users regarding Parts/Labor, and **we removed bold text
> based on the feedback and we're saving printer ink for them without bold**… keep collecting
> feedback… We'll ask designer to work on this but it is not top priority for now."

There is a feedback spreadsheet linked on the ticket. So today's complaints about the missing bold are
**the same complaint, already known, with an open loop** — a product-prioritisation conversation, not a
bug report.
