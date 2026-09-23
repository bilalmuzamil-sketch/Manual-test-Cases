# SV-10081 — "ticking All bin locations then clicking one bin does not untick that bin"

## §0 — Sources and environments

| | where | build | last-modified |
|---|---|---|---|
| AFTER (fix) | `sv10081.qa.shopview.com` | **`v26.36.9-291a034`** | Wed, 23 Sep 2026 10:27:15 GMT |
| BEFORE (pre-fix) | `app.shopview.com` (production, Rule 86) | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT |

**The ticket** (SV-10081, TESTING QA, reported by Ryan Fyfe from customer Ryan Stith at Eastern
Truck & Trailer, 44 users, via Intercom). The customer's own words:

> *"if i pick the box that says all bin locations and then click another box for one bin location it
> doesn't take away that bin location, it selects only that one … That is the opposite of how an
> excel spreadsheet works."*

**⚠️ What the customer literally asked for is deliberately NOT what ships — and there is a recorded
ruling (Standing Rule 78).** Chris Ward, comment
[77077](https://shopview.atlassian.net/browse/SV-10081?focusedCommentId=77077), 22 Sep 2026:

> *"**Option 1.** Ship the display fix and close this one out. The dash and the caption are honest
> about what the filter is actually doing, and that is the real problem here. The tick was telling
> people something that was not true. What Ryan asked for, tick everything then untick one, is not
> worth what it costs us right now. 'All' is not 385 selections, it is zero, and turning it into 384
> is the same thing that took every API call down for a user in SV-9478."*

So **the pass criterion is the display being honest, not the Excel-style behaviour**, and
"clicking a bin narrows to that bin" is correct behaviour rather than a defect. This must be said
out loud in the QA comment, because a reader of the original ticket would otherwise see a
recommendation that was not followed with no explanation.

**The developer's handoff** (Slavcho Mitrov, PR #3240/#3239) lists 7 checklist sections over 16
filters and 7 pages. It is the checklist mirrored below; **the ticket plus Chris's ruling define
the pass.**

## §1 — The BEFORE, on production — the misleading tick reproduces exactly

`/parts/inventory` → the **Bin Location** chip, nothing selected:

- **245 option rows, every single one `aria-checked="true"`** — an ordinary solid blue tick,
  visually identical to the "All bin locations" row above it.
- **No caption anywhere in the panel.**

That is the whole complaint: every box looks ticked, so clicking one looks like it should untick
that one. Evidence `ev/P1-prod-bin-panel.png`.
