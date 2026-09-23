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

## §2 — Check 1: the core fix on Parts → Inventory, Bin Location

Location **Staging Heavy Duty - 9919**, 378 bins. Every state read from `aria-checked` on the live
panel, and the rows clicked **by name** (see §7 — an earlier attempt clicked a stale coordinate
after the panel resized and produced a misleading result).

| step | what happened | verdict |
|---|---|---|
| nothing selected | "All bin locations" = `true` (tick) · **378 bins = `mixed` (dash)** · caption reads exactly *"All bin locations are included. Pick one or more to narrow."* | PASS |
| click bin **A1A** | A1A = `true` · **all 378 others = `false` — plain empty boxes, not dashes** · caption gone · chip reads "Bin Location: A1A" · grid 32 → **12 rows** | PASS |
| click A1A again | back to 1 tick + 378 dashes · caption returns · chip "All bin locations" · grid back to 32 | PASS |
| untick "All bin locations" directly | **all 379 = `false`** · caption gone · **grid still shows all 32 rows** — the untick is display-only | PASS |
| close, reopen | tick + dashes + caption all return | PASS |

Evidence `ev/C1-dashes.png` … `ev/C5-reopened.png`.

## §3 — Check 2: the dash must read as the lesser state, in both themes

Computed styles read off the live glyphs, not judged by eye:

| | light | dark |
|---|---|---|
| ticked ("All bin locations") | `rgb(56, 116, 255)` — blue | `rgb(56, 116, 255)` — blue |
| dashed (a bin) | `rgb(105, 117, 134)` — muted grey | `rgba(255, 255, 255, 0.55)` — 55% white |
| caption | 13px / weight 400 / `rgb(54, 65, 82)` | 13px / weight 400 / `rgba(255, 255, 255, 0.7)` |

Two clearly different tiers in both themes, and in dark the dash is **not** a solid blue block —
the specific regression the handoff flagged as hotspot 4. Evidence `ev/E-light.png`, `ev/E-dark.png`.

## §4 — Check 3: a filter with exactly one option

No location in this org had a single bin, so one was built (Rule 87): location
**ZZAUTOTEST SV-10081 One Bin**, which is created with one bin ("General Storage"); a second bin was
added and then deleted so exactly one remained (`DELETE 204 /api/inventory/bin-locations/0db49a72…`).

Opening **Bin Location** there:

- **no "All bin locations" row at all** — the panel holds exactly 1 row
- that row shows a **dash** (`mixed`)
- **the caption is still present**: *"All bin locations are included. Pick one or more to narrow."*

That is the case that previously showed a bare dash with nothing explaining it. **PASS.**
Evidence `ev/P-single-option.png`.

## §5 — Check 4: Sales By Customer, the only server-search filter

| step | observed | verdict |
|---|---|---|
| open the Customer chip | spinner first (1 row, no caption), then 1 tick + 50 dashes with the caption. **Caption over the spinner: 0 of 30 samples taken every 140 ms.** | PASS |
| type a term matching nothing | "No results" shown and **the caption disappears** | PASS |
| type a term matching a few | list narrows, caption still correct | PASS |
| pick one customer, type "AK", then click **All customers** | **search box cleared to empty**, full list reloaded (51 rows), caption returned, chip back to "All customers", grid back to 33 rows | PASS |

The last row is the actual fix: previously the term stayed and the list remained narrowed while
claiming "all". Evidence `ev/G1…G4`, `ev/H1…H3`.

## §6 — Checks 5, 6 and 7

**Check 5 — mobile bottom sheet (390 × 900).** Inventory **Bin Location**: 1 tick + 378 dashes,
caption at y=470 sitting **between** the "All" row (y=425) and the first option (y=514) — directly
under its row, not hoisted to the top of the sheet (sheet top y=0). WIP **Advisor**: same, caption
between the All row and the first option. **PASS** on both.

**Check 6 — filters where empty genuinely means "none" must show NO dashes.** All six, plus the
back-to-back version on one page:

| filter | rows | verdict |
|---|---|---|
| Work In Progress → **Location** (cleared) | 3, all `false`, **no caption** | PASS |
| Parts Velocity → **Type** | 3, all `true`, no caption | PASS |
| Sales By Customer → **Product Type** | 3, all `true`, no caption | PASS |
| Sales By Representative → **Product Type** | 3, all `true`, no caption | PASS |
| Sales By Representative → **Invoice Status** | 4, all `true`, no caption | PASS |
| Technician Utilization → **Technician** | 5, all `true`, no caption | PASS |

Back to back on Work In Progress: **Location** gave 3 plain boxes and no caption, **Advisor** gave
1 tick + 7 dashes and the caption — in the same panel, seconds apart.

**Check 7 — all 16 affected filters, not a spot-check.** Every one shows 1 tick + dashes and the
caption with the right noun:

| page | filters | caption noun |
|---|---|---|
| Parts → Inventory | Bin Location (378), Category (49) | "All bin locations", "All categories" |
| Parts → Catalog | Manufacturer (188), Category (49) | "All manufacturers", "All categories" |
| Office → Staff | Permissions (11), Locations (2), Departments (14) | "All permission groups", "All locations", "All departments" |
| Reports → Inventory Value | Category (49), Vendor (1042) | "All categories", "All vendors" |
| Reports → Parts Velocity | Category (49), Vendor (1042), Bin (378) | "All categories", "All vendors", "All bins" |
| Reports → Work In Progress | Advisor (7), Customer (99), Asset (207) | "All advisors", "All customers", "All assets" |
| Reports → Sales By Customer | Customer (50) | "All customers" |

**16 of 16.** Caption wording is `All <noun> are included. Pick one or more to narrow.` in every case.
