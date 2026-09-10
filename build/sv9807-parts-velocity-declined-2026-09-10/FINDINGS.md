# SV-9807 — "Parts Velocity counts declined-line parts as sold"

**QA verdict: PASSED.** The defect reproduces on the released build and is gone on the fix branch, on
the same seeded case, with a control proving that only *declined* work stopped counting.

Ticket: [SV-9807](https://shopview.atlassian.net/browse/SV-9807) · Bug · TESTING QA · priority Medium ·
reporter **Chris Ward** · assignee **Dusan Radulovic** · found by **Nemanja Djuric** while investigating
[SV-9690](https://shopview.atlassian.net/browse/SV-9690) and split out of it on Chris's call.
**No comments and no QA handoff on the ticket**, so this pass was written from the description.

## What the ticket says should happen

> *"A part on a declined line is not sold, so it is excluded from Units Sold, Revenue, COGS, Margin and
> Demand, consistent with the six fetchers above."*

Root cause per the ticket: `DbalPartsVelocityFetcher` never joins `work_order_line` and has no declined
filter, while `InvoiceFetcher`, `RevenueQueryHandler`, `BillingEfficiencyQueryHandler`,
`KpiQueryHandler`, `TechPerformanceQueryHandler` and `LinesStatsFetcher` all exclude
`authorization_declined`. The parts reach the report because `InvoiceBuilder::addStatements()` emits
statement items for a declined line's parts.

**Where the expectation comes from (Standing Rule 57).** Our Parts Velocity specification mirror does
**not** mention declined lines — the word appears **0 times** in
`build/report-suite/specs/parts-velocity.md`. So the expected behaviour here is the ticket's own, written
by the Report Suite PO (Chris Ward), which is a legitimate source. Worth noting for him: the spec's
**Units Sold** definition is explicitly stock-movement based (*"Units taken out of inventory stock on
invoiced work orders"*, S3-R6), so if a declined line's part had genuinely left the shelf, excluding it
from Units Sold is a small divergence from that wording. It does not arise in practice — see "What the
app will and will not let you do" below.

## Environments and build markers (read live)

| Environment | app-version | index.html last-modified |
|---|---|---|
| **Fix branch** `sv9807.qa.shopview.com` | **v26.36.2-99bab86** | Thu, 10 Sep 2026 09:12:35 GMT |
| Staging (pre-fix reference) `app.staging.shopview.com` | v26.36.2-a678e3c | Thu, 10 Sep 2026 12:42:51 GMT |

The report is `GET /api/reporting/reports/parts-velocity?type=…&range=custom&start_date=…&end_date=…&locations=…`
(money in cents). Every measurement below used **byte-identical parameters on both builds**:
`type=both`, 1–30 September 2026, both locations.

## The decisive result

The seeded case, built identically on both builds: a vendor part **2 × $25.00 sell / $10.00 cost**
ordered while its line was authorized, **the line then declined**, the part **received** on a vendor
invoice, and the work order **invoiced**.

| Parts Velocity row for that part | Staging (pre-fix) | Branch (fixed) |
|---|---|---|
| Row present at all | **yes** | **no row** |
| Units Sold | **2.00** | — |
| Demand | **1** | — |
| Revenue | **$50.00** | — |
| Margin | **$30.00** | — |
| Sold via WO | **2** | — |
| Avg Cost / Avg Sell | $10.00 / $25.00 | — |
| The part in the invoice statement | YES | YES |

Both builds started from **no row at all** for that part before the work order was invoiced, so every
figure above is attributable to the seed. Exhibit: `ev/EX1-declined-part-before-after.png`.

**The control — this is what makes it a fix and not a regression.** On the **fixed** branch the
*identical* shape with the line left **authorized** still reports **2.00 units, $50.00 revenue, $30.00
margin, demand 1, Avg Cost $10.00, Avg Sell $25.00**. So special-order parts have not stopped counting;
only the declined work has.

| Case, all on the fixed branch | Result |
|---|---|
| Part on a **declined** line (`ZZQA9807-VP2`) | **no row** — excluded from every metric |
| Same part and price on an **authorized** line (`ZZQA9807-VP3`) | **2.00 units, $50.00, $30.00, demand 1** |
| Inventory part picked on an **authorized** line (`P550848`, separate work order) | 0 → **1 unit, $89.20 revenue, $35.68 margin**, Avg Cost $53.52 |

The statement still contains the declined part on both builds, so the mechanism the ticket describes is
untouched — what changed is that the report no longer counts it.

## What the app will and will not let you do (this is why the first repro attempt failed)

Worth recording, because it determines which data can be affected:

- A **quoted** part on a declined line is **not counted on either build** — my first seed used that
  shape and it read zero on staging too, so it does not reproduce the defect. Not a fix, not a bug:
  nothing was ever billed.
- A line whose part is **staged or received cannot be declined at all**: *"Can`t change status while
  there are staged parts. Please move parts to another line or return them."*
- A declined line's part **cannot be picked**: *"This action can only be performed on the authorized
  lines."*
- **The one route in** — and it is an ordinary shop story — is: part **ordered** while the line is
  authorized → **line declined** (allowed, because an awaiting part is not staged) → part **received**
  when it arrives → work order invoiced. That is the case measured above.

## Regression check across the whole report

I also pulled the **entire** report from both builds for a frozen historical window (1 Jan – 31 Aug
2026, both locations, 11,976 rows on the branch / 12,051 on staging) and diffed every row and field.
**That comparison is inconclusive and I am not resting anything on it**: the two databases have
drifted apart (staging holds inventory the branch clone does not, staging received activity two days
newer than the clone, and my own SV-9498 test earlier today deleted two parts and cancelled two returns
on staging). Concretely: 80 rows exist only on staging and 5 only on the branch — **79 of the 80 carry
zero activity**, i.e. roster differences, and two of the branch-only rows are the very parts I deleted
on staging. `last_sale` differs on 55 rows **in both directions** and `on_hand` on 7, also both ways,
which is drift, not a fix.

Four rows in that window do differ in their aggregates (`N000000001069` units_sold 14 → 12,
`GENO-1` revenue $39.84 → $38.01 with sold_via_wo 57 → 54, `N000000001085` demand 4 → 3, and `12105`
units_returned 0 → 4 which is my own SV-9498 contamination). The first three are consistent with the
fix removing declined contributions, but **I could not trace them to specific declined lines**: their
work orders carry an `S-` number prefix that belongs to neither workplace this account can reach
(only `S2-` and `S3-` exist here). They are recorded as suggestive, not as evidence.

## Honest limits

- **One specimen of the decisive case per build**, plus two controls. A second specimen would harden it.
- **Admin only**; no per-role check.
- The seeded parts are **special-order / vendor** parts, so the measured row type is *Special Order*.
  An inventory-sourced part on a declined line could not be produced (see the guards above), so the
  *Inventory* row type was verified only for the approved-line control.
- The pre-fix reference is staging, whose database has drifted from the branch clone; that is why the
  verdict rests on a **seeded case measured as a delta on each build separately**, not on comparing the
  two databases' historical figures.
- Test data left in place (per-ticket branch needs no cleanup; staging is a test account):
  branch work orders `1b88c73d…`, `39e6c2e1…`, `86763765…` and `5134a51c…`;
  staging work orders `2a25faf7…`, `129258a8…`, `3c5da20e…`, `f0a2cf2b…`. All lines and parts are
  named `ZZAUTOTEST` / `ZZQA9807-*`.

## Recipes proven this pass (for the playbook)

- **Parts Velocity report:** `GET /api/reporting/reports/parts-velocity` with
  `type=both|inventory|catalogue`, `range=custom`, `start_date`/`end_date` ISO, `locations` comma-joined
  workplace ids, `pagination[page]`/`[rowsPerPage]`, optional `search`. `pagination.rowsNumber` carries
  the true total (11,976 for Jan–Aug). Money fields are **cents**; row fields are
  `units_sold, demand, units_returned, revenue, margin, unit_cost, sell_price, margin_pct, sold_via_wo,
  sold_via_parts_sale, turns_per_year, last_sale, on_hand, min, max`.
- ⭐ **`POST /api/work-orders/change-mileage {work_order_id, mileage}` → 201** — the mileage endpoint the
  playbook says does not exist ("use the UI"). Captured from the UI's own request; the UI's
  type-then-Tab save silently fires **nothing** on some work orders, which is what sent me looking.
- ⚠️ **`POST /api/work-orders/part/perform-request-status-action` IGNORES the `action` value** — I sent
  `action:'bogus'` and it advanced the part to *ordered* (status `waiting_to_receive`, PO created) and
  returned 201. Never probe this endpoint to discover its vocabulary; it performs the default advance.
  Once a part is `waiting_to_receive` it can no longer be cancelled or removed.
- **Line status vocabulary:** `authorized` · `authorization_required` · `authorization_declined` ·
  `complete`. `declined` alone is rejected (*"Invalid parameter value"*).
- **Invoicing needs at least one COMPLETED line** — *"A work order must have at least one completed line
  in order for it to be eligible for invoicing."* A work order whose only line is declined cannot be
  invoiced, so a repro needs a second, kept line.
- **`POST /api/work-orders/lines/create` 500s on staging and on QA branches too**, even with
  `line_name` + `time_estimate` + `labour_type_id`. Use the New Line dialog (§R.5a) — it works
  unchanged on both. Note `/api/work-orders/labour-types` is **404**; take `labour_type_id` from
  `GET /api/work-orders/canned-lines`.
- **Canned lines carry junk part requests** on this org too (2 vendor parts, no part number, $0), so
  `create-from-canned-line` is the wrong route when you need controlled parts.
- **Add an inventory part:** `POST /api/work-orders/part/make-request {line, work_order, description,
  quantity, part_source_type:'inventory', inventory_part_id, part_number, sell_price, cost,
  part_category_id, binAllocations:[{binLocationId, quantity}]}` → 201. `part_source_type` accepts
  `inventory` and `vendor`; `inventory` without `inventory_part_id` → *"Inventory part is required when
  source type is inventory."*
- **Part history:** `GET /api/parts/history/{inventoryPartId}?pagination[...]` → per-event rows
  (`Picked` / `Received` / `Increased`) with `workOrderNumber`, `quantityChange`, bin and user.
- **Default line status differs between these two environments** — the branch creates lines as
  `authorization_required`, staging as `authorized`. That is org configuration, not build: it changes
  whether a freshly added part is `quoted` or immediately staged, which is exactly what made the first
  seeding attempt behave differently on the two sides.
