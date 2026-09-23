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

## §1 — The BEFORE, on production: the bug reproduces exactly, and with a success message

Vendor invoice **ZZ-P-DEL1** (`43f0568f-3897-4d6a-9bee-bea07a12bffd`), one line item
`ZZAUTOTEST ZZ9565-P1` at $10.00000 × 1.

| | Items cost | Tax | Total | line cost |
|---|---|---|---|---|
| before | $10.00 | $0.50 | $10.50 | $10.00000 |
| after saving **-50.00** | **-$50.00** | **-$2.50** | **-$52.50** | **$-50.00000** |

`POST /api/inventory/deliveries/change-item` → **200**, the dialog closed, and the app showed the
toast **"Item updated successfully"** — so the user is actively told the save worked while a
negative payable total and negative tax are written. Evidence `ev/P3-prod-negative.png`.

Restored to $10.00000 and verified back at $10.00 / $0.50 / $10.50.

## §2 — The fix branch: the form rejects it, on all five of C19398's points

Vendor invoice `446f574f-…`, line **Weatherguard Latch/Lock** at $238.32000 × 6.

| C19398 requires | observed | verdict |
|---|---|---|
| the save is rejected | **no `change-item` request was sent at all** | PASS |
| an error says cost cannot be negative | *"Cost cannot be lower than 0"* on the $ Cost field | PASS |
| the edit form stays open | dialog still open | PASS |
| the original cost is preserved | line still $238.32000, totals still $1,429.92 / $71.52 / $1,501.44 | PASS |
| the message is clear and actionable | plain English, on the offending field | PASS |

## §3 — The API guard, which is what the reporter actually asked about

The reporter's point was that a front-end-only fix would leave the endpoint open. Tested by
capturing the app's **own** `change-item` payload from a real save and replaying it with the value
changed — the real host is `sv10201api.qa.shopview.com`, and the field is `price` / `price_decimal`,
not `cost`:

| sent | response |
|---|---|
| `price: -50` with the derived totals | **400** `{"errors":[{"error":"Cost cannot be a negative number"}]}` |
| `price: -50` alone | **400** `{"errors":[{"error":"Cost cannot be a negative number"}]}` |
| `price: 0` | 200 — zero is allowed, which is consistent with "cannot be lower than 0" |
| negative **quantity** | **400** `{"errors":[{"error":"Quantity must be greater than 0"}]}` |

**So the guard is on the back end, not only in the form** — the specific thing the ticket asked to
be done deliberately. The negative-quantity guard on the same endpoint is a bonus: the adjacent way
to reach a negative line total is closed too.

## §4 — Boundaries and the regression

| entered in the form | result |
|---|---|
| `-0.01` | rejected, dialog stays open, the typed value is left there to correct, stored cost untouched |
| blank | rejected, dialog stays open |
| `238.32000` (a normal edit) | **saves normally**, toast "Item updated successfully" — the fix has not broken ordinary editing |
