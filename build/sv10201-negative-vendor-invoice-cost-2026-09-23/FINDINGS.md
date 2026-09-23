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

## §5 — The one difference I had to explain before calling this a pass

After the probing, the invoice's tax came back **$71.50** where it had started at **$71.52** — a
two-cent move on a financial document, in a ticket that is *about* tax going wrong. Rules 74/75 say
account for every difference and prove the explanation rather than assume it, so:

1. **A no-op save preserved it exactly** — saving the dialog without changing anything left tax at
   $71.52. So merely saving does not move it.
2. **The move appeared only after the cost actually changed** — my own API probe wrote `price: 0`,
   and re-entering 238.32 then produced 71.50.
3. **Proved which rounding it uses, rather than assuming.** Set the cost to `100.05 × 6 = $600.30`:
   tax came back **$30.02**. Per-unit rounding would give `5.00 × 6 = $30.00`; rounding the total
   once gives `round(30.015) = $30.02`. So a cost change recomputes tax on the **invoice total**.
   The original $71.52 was `11.92 × 6`, i.e. written per-unit at receive time.
4. **Proved it is not new.** The identical probe on **production** (`100.05 × 6`) also returned
   **$30.02**. Same behaviour on the pre-fix build.

**Conclusion: not a regression, and nothing to do with this fix** — any cost change on either build
recomputes tax the same way. Recorded because it is a real difference between the figure written at
receive time and the figure written at edit time, but it is pre-existing and out of scope here.

Production was restored and **verified identical on all three figures** ($10.00 / $0.50 / $10.50).

## §6 — The adjacent way in, checked

Cost is written by one endpoint, `change-item`, which is now guarded at the API — so every screen
built on it is covered. The other place a delivery could take a cost is the **receive** screen
(`/order/{id}?receive=1`): there the cost is a **read-only `<span>`** (`currency_text_cost_…`), and
only sell price and quantity are editable. So there is no second door to a negative line cost.

## §7 — Honest notes on method

- **My first API attempt was wrong and would have produced a false result** (Rule 79c). I posted to
  `sv10201.qa.shopview.com/api/…` and got a **403 that came from CloudFront**, not the app — and the
  payload field is `price`, not `cost`, so setting `cost` would have changed nothing anyway. Both
  caught by capturing the app's *own* request first (playbook §U.1). Had I stopped there I would have
  reported "the API rejects it" for entirely the wrong reason.
- **`price: 0` is accepted**, which is correct against the message ("cannot be **lower than** 0") but
  worth knowing: a zero-cost line is still possible, by design.
- The negative-quantity guard on the same endpoint was found in passing, not asked for.

## §8 — Test data

- Branch invoice `446f574f-…` — left at its original **$238.32000 × 6**, verified.
- Production **ZZ-P-DEL1** — negative cost written and then restored to **$10.00000 × 1**; quantity
  briefly set to 6 for the rounding probe and restored to 1. All three figures verified identical to
  the starting state.
- No new records created on either environment.
