# PENDING — one TASK ticket, to be created AFTER the whole production run is finished

**Authorised by the QA lead, 12 September 2026, verbatim:**

> *"For this create the ticket but after you are done with ALL the tests - do not mark the tests failed
> due to that issue, I want the Product manager to first confirm if this is an expected behavior or a
> bug then I will tell you so that you can mark the test cases related to them as passed or failed, for
> now do not fail the test cases due to these things provided that you are going to create the ticket
> for them and create ticket as TASK and make sure to link them to the related stories in the epic."*

This is a **per-ask permission under Rule 62** and it covers **this one ticket only**. It is not a
general lifting of the hold.

## The rules this ticket must obey

| | |
|---|---|
| **Issue type** | **Task** — NOT a Story Defect, NOT a Bug |
| **When** | only once every one of the 45 cases has a production result |
| **Links** | linked to the related stories in epic **SV-9892** (the design-selection stories that own estimates and document rendering) |
| **Test results** | **no case is failed because of this.** Cases stay as their evidence otherwise warrants |
| **Shape** | the eight headings, inline annotated screenshots at `|width=760!`, sources quoted verbatim with page id and read date, test cases with run and links |
| **Markup** | attach images first, then `PUT /rest/api/2/issue/<KEY>` with wiki markup — the only route that embeds images |
| **Afterwards** | the QA lead takes it to the Product Manager; he then tells us whether the affected cases are Passed or Failed |

## What the ticket is about

On an **estimate**, the Legacy design prints a **"Payments" and "Balance" block** that the Modern
design does not print. Observed on production, build `v26.36.4-3e1c643`, 12 September 2026.

**Observed, on two estimates:**

| Job | In the Legacy design only |
|---|---|
| S2-864 | `Payments (Deposit) Sep 9, 2026 - Check $500.00 (Deposit) Sep 9, 2026 - DEBIT CARD of $600.00 — $348.09 will be credited $251.91 Balance $0.00` |
| S2-833 | `Payments Balance $149.27` |

The job's own figures are identical in both designs in every case — labour, parts, shop supplies,
subtotal, tax, total, the line items, and the estimate number.

Word counts across the two renders: `Payments` legacy 1 / modern 0, `Balance` legacy 1 / modern 0,
`Deposit` legacy 2 / modern 0 (S2-864).

## Why it is NOT being called a defect by us

Spec **S2-R7**, Confluence page `845447188` version 27, read 12 September 2026, verbatim:

> *"A document's figures, totals, line items and numbering are identical in both designs. Blocks that
> belong to a design's layout may differ between the two; the remit-to block is the known case
> (S2-E3)."*

A Payments/Balance block is a block that belongs to a design's layout, so on the face of the written
requirement this is permitted. **The open question for the Product Manager is a product one, not a
conformance one:** should an *estimate* — a document for work not yet done — show payments and a
balance at all, in either design? The Legacy template is byte-identical to v26.35.10, so this is
inherited pre-refresh behaviour rather than anything the design-selection work introduced.

## Caveat to state plainly in the ticket

These two estimates were rendered from work orders that are already **invoiced or paid**, so they
carry payments that a normal open estimate would not. Before the ticket is written, re-observe the
same thing on an estimate that has **never been invoiced**, and say in the ticket which of the two
situations it occurs in. If it only happens on the estimate view of an already-paid job, that is a
narrower and much less urgent finding, and the ticket must say so.

## Cases this touches

C53592 (figures identical in both designs), and any estimate-rendering case where the block shows up —
C53544, C53547, C53549, C53553. **None of them is to be failed for this.**
