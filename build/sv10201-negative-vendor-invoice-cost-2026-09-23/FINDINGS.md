# SV-10201 — a negative item cost on a vendor invoice saves without validation

## §0 — Sources and environments

| | where | build | last-modified |
|---|---|---|---|
| AFTER (fix) | `sv10201.qa.shopview.com` | **`v26.36.9-0eb636d`** | Wed, 23 Sep 2026 15:44:36 GMT |
| BEFORE (pre-fix) | `app.shopview.com` (production, Rule 86) | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT |

**The ticket** (SV-10201, Bug, **priority High**, TESTING QA, raised by Vladimir Tomovic 17 Sep from
a nightly E2E failure). Steps: open a vendor invoice → Edit → edit a line item → set cost to
`-50.00` → Save. Expected, per TestRail **C19398**, five things: the save is *rejected*; an error
says cost cannot be negative; the edit form *stays open*; the original cost is *preserved*; the
message is clear and actionable. Actual: `POST /api/inventory/deliveries/change-item` returns
**200**, the dialog closes, and the invoice ends up with **negative items cost, negative tax and a
negative payable total**.

### ⚠️ Two things to flag before the testing itself

**1. There is no developer handoff on this ticket — 0 comments.** Every other ticket in this run
arrived with a "Ready for QA" comment carrying the change summary, the PR and a test plan to mirror.
This one has none, so **the ticket description is the only specification of what "fixed" means**
(Rule 66), and I cannot check the fix against what the developer says he changed. Raised as an
outstanding item.

**2. The ticket asks a product question and nobody has answered it** (Rule 78). The reporter wrote:

> *"Worth deciding deliberately: the guard is missing on the **API**, not only in the form …
> A credit or reversal may be a legitimate reason to want a negative line somewhere in this area —
> if so, this case's expectation is the thing to revisit rather than the code, and the ticket
> should be closed against the case instead."*

So there are two possible correct outcomes — block negatives, or keep them and change the test case
— and **no ruling is recorded anywhere on the ticket**. Whatever shipped has implicitly chosen one.
Part of this pass is establishing which, and saying so plainly.
