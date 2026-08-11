# ADDENDUM — 2026-08-11 — one new Filters question for Branko Cicovic

**Add this item to `Questions-for-Branko-Cicovic_Filters-and-Schedule_Friendly-Version_2026-08-06.xlsx`
before it is sent. It is NOT a separate sheet.**

**Why an addendum rather than a new file (Standing Rule 55):** the 2026-08-06 workbook is written and
**still not sent**. Rule 55 says to sweep every open ambiguity onto ONE sheet so a product owner
answers in a single sitting rather than receiving a drip of separate asks. Sending a second sheet to
the same person would be that drip. This item therefore joins the existing sheet as **Section 2,
item 10** (an ordinary decision — nothing of ours is blocked on it).

**Nothing has been sent. No ticket was created, commented on or edited.**

---

## Item to add — Section 2 (ordinary decisions)

### 10. FILTERS — the filter buttons across Work Orders, Parts and Reports — the show/hide control for the filter row

**What happens now**

> Most list pages have a row of filter buttons, and a small control in the toolbar that hides that
> row to give the table more space.
>
> On 7 August one of your team raised a ticket saying that control **should only appear when a page
> has more than one filter**. If a page has only one filter, the control should not be there at all
> and that page's filter row should simply always be on display. Your QA has since checked it and
> confirmed the product already behaves that way.
>
> That rule is not in your written description. The description says, and has said unchanged since
> 13 May, only that the toolbar contains a control that hides and shows the filter row — it does not
> mention any condition about how many filters the page has.
>
> Why we are asking rather than choosing: we have followed the ticket, because it is the newer
> statement, and we have updated two tests so a page with one filter and no control is treated as
> correct rather than as a fault. But the description is the document QA works from, and right now
> it does not contain this rule.

**The question**

> Should the show/hide control for the filter row be hidden on pages that have only one filter, and
> should that rule go into your written description?

**Options**

> A) YES — the rule is correct, and please add it to the description so it is written down.
>
> B) YES, the rule is correct, but leave the description as it is — the ticket is enough.
>
> C) NO — the control should always be there whatever the page has on it, and the ticket is wrong.
>
> D) Something else — please describe it.

**Your answer:** _______________________________________________

---

### 10a. FILTERS — the same question, for the Parts pages and the Reports pages

**What happens now**

> The ticket does not say which pages it covers. It says "the page", which reads as all of them.
>
> The evidence your QA attached to that ticket is a screenshot of the **Part Sales** page — a Parts
> page with a single filter and no show/hide control — so in practice it has already been treated as
> covering Parts.
>
> This matters to us because you told us on 31 July that hiding the filter row on Parts and Reports
> works the same way as it does on the Work Orders list. The Work Orders list has five filters, so
> the control is always there. Some Parts pages and some reports have only one, so on those the
> control would now be absent.

**The question**

> Does this rule apply to the Parts pages and the Reports pages too, and not only the Work Orders
> list?

**Options**

> A) YES — it applies everywhere there is a filter row.
>
> B) NO — it applies only to the Work Orders list; Parts and Reports always show the control.
>
> C) Something else — please describe it.

**Your answer:** _______________________________________________

---
---

# QA-ONLY — DO NOT FORWARD

**This section stays on the QA-only tab. It never goes to the product owner** (Rules 7 / 55).

## Question → case mapping

| Item | Case | C-id | Link |
|---|---|---|---|
| 10, 10a | FLT-COLL-01 | C29601 | https://shopview.testrail.io/index.php?/cases/view/29601 |
| 10, 10a | FLT-PR-PAR-01 | C43562 | https://shopview.testrail.io/index.php?/cases/view/43562 |

**Neither case is blocked on the answer.** Both were repaired on 2026-08-11 to follow SV-9041, which
is the newer authoritative source. The question settles whether the rule is written into the PRD and
how far it reaches — it does not hold a test.

## The sources behind the item

| | |
|---|---|
| **Ticket** | [SV-9041](https://shopview.atlassian.net/browse/SV-9041) — Task, parent SV-8785, status TESTING QA, reporter Dusan Radulovic |
| **Condition stated** | at creation, **2026-08-07T08:28:17−0500 = 13:28:17Z**. The changelog holds 7 entries and **none is a description edit**, so the surface `updated` date of 11 August is Ahtasham adding labels — Rule 31 trap (b) |
| **Verbatim** | *"Expand/collapse filter toggle should only be visible if there is more then 1 filter present on the page. If not then it shouldn't be visible and the filter is always shown"* |
| **Spec counterpart** | **S1-R4** — *"The page toolbar contains a toggle button that collapses and expands the filter bar"* |
| **S1-R4 dated** | **unchanged since spec version 1, 2026-05-13T17:26:42Z**, present byte-identically in all 19 versions — dated by diffing the requirement's own text across versions, not by the page's date (Rule 31 trap (c)) |
| **Condition in the spec?** | **No.** `"more then 1 filter"`, `"more than 1 filter"` and `"only be visible if"` are absent from **all 19 versions** |
| **Latest-wins** | SV-9041 (7 Aug) is ~3 months newer than S1-R4 (13 May) ⇒ the ticket prevails (Rule 32) |
| **QA evidence** | Ahtasham Amjad, 2026-08-11T07:58:46−0500: *"This is working as expected… QA Status: Passed"* — screenshot is `/parts/part-sales`, one filter (Status), **no toggle**. This is what makes 10a a real question |

## Why 10a is asked separately

C43562's `refs` credits **Branko's own ruling of 31 July (Round 3, Q5=A)** — collapse, shareable URL
and mobile on Parts and Reports all match Work Orders. SV-9041 qualifies that ruling without
mentioning it. Under Rule 33 a recorded ruling may not be dropped or reversed in silence, so the
ruling is **cited on the case** and the divergence is **disclosed in the case text** (Rule 56) rather
than quietly resolved.

## Deliberate omission (Rule 46)

**We did not ask him to confirm the label "Create Work Order".** He already ruled on it in
[SV-9076](https://shopview.atlassian.net/browse/SV-9076) on 2026-08-10 — *"Let's not change header,
it's not part of this feature and create work order label can stay"* — and our three cases that name
that button (C29601, C29629, C38898) already use exactly that label. Re-asking a question a source
has answered is the specific embarrassment Rule 36 exists to prevent.
