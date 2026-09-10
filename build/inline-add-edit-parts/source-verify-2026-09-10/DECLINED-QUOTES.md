# The exact source wording behind the Declined finding

Read LIVE from Confluence on **2026-09-10**: *Inline Add and Edit Parts on Work Order Lines*,
page **782761986**, owner Sasha Grosman, page "Last Updated 2026-09-04", Confluence last-modified
**2026-09-07**. Quoted verbatim, nothing paraphrased.

## 1. Which statuses the feature is allowed on — Story 1, Prerequisites

> - A work order is open.
> - **The work order status is one of: Estimate, Approved, In Progress, Review.**
> - The user has the 'Work Order Line - Create and Edit' setting enabled (existing permission, unchanged from today).
> - The user has the 'Work Orders → Work Order View Mode' permission set to either Tech View or Full View.

Declined is not in that list.

## 2. The Add Part button — Story 1, Negative Cases

> **S1-N1:** If the work order status is Complete, Invoiced, Paid, **Declined**, or Imported, the
> "Add Part" button is not displayed on any work order line.

## 3. The Edit control — Story 1, Negative Cases

> **S1-N2:** If the work order status is Complete, Invoiced, Paid, **Declined**, or Imported, the
> Edit control is not displayed on part lines.

## 4. What a save must do when the status changes underneath — Story 2, Edge Cases

> **S2-E3:** If the work order moves to a status that does not permit editing while the inline row is
> open (for example, another user invoices it), **the save fails and the user sees an alert: "This
> work order can no longer be edited. Refresh to see the latest." The entered data remains in the row**
> so the user can copy it before refreshing.

And the two stories that point at it:

> **S3-E2:** If the work order moves to a status that does not permit editing while the row is open, S2-E3 applies.

> **S4-E3:** If the work order moves to a status that does not permit editing while the row is open, S2-E3 applies.

## 5. The one nearby rule that does NOT contradict this — checked deliberately

> **S1-R9:** Add Part is available on a line whose status is Complete or In Review. The system
> uncompletes the line on the user's behalf rather than requiring the user to uncomplete it first.

**This is about the LINE's status, not the WORK ORDER's status.** S1-N1 and S1-N2 govern the work
order; S1-R9 governs one line inside an editable work order. They do not overlap, and S1-R9 says
nothing about Declined. A reviewer will reach for this rule, so it is answered here in advance.

## 6. Caveat on the version number

Our test cases cite "specification version 16". **This read does not return a version integer** — the
only version-bearing call returns the whole page body (a known, recorded limitation). What is certain:
this is the live page as of 2026-09-10, and the wording above is what it says today.
