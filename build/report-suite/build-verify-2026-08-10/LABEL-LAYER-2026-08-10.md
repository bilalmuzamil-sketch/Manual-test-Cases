# The label layer, checked case by case against the running build — 2026-08-10

**Build `v3.5-4795eee`** · etag `a80113cf3856c5fedf63be893e8b41c7` · last-mod Fri 07 Aug 2026 13:10:42 GMT.

## Method

Every column heading, tab label, filter name, menu item, date preset, accessible name and placeholder
was read off the three report pages by opening each control (`tools/harvest.cjs`, `tools/probe.cjs`;
raw output in `evidence/`). Every quoted string in all **225** cases was then tested against **its own
report's** vocabulary (`tools/label_check.py`) — no sampling.

## The result, stated plainly

**82 cases quoted at least one string not visible on the default page**, and **14 quoted a string that
exists on a DIFFERENT report** — which looked, at first, like a batch of case defects.

**Every one of them was checked against the specification before anything was written, and NOT ONE
turned out to be a defect in our case.** In each instance the case matches the document and **the
build is what differs.** Under Standing Rule 57 the case keeps the documented expectation.

| What the case says | What the build shows | The document | Verdict |
|---|---|---|---|
| C30172 · C30173 · C30194 (Sales By Customer) choose **"Download (CSV)"** / **"Download (PDF)"** | menu holds **"Download Summary (PDF)"**, **"Download Expanded View (PDF)"**, **"Download Summary (CSV)"**, **"Download Expanded View (CSV)"** — and **no "Print"** | SBC **S14-R1/R2**, **S15-R1/R2**, **S16-R1**: the item reads "Download (CSV)", "Download (PDF)", and Print is the third item | **case correct — build deviates** |
| C30436 (Technician Utilization) choose **"Download (CSV)"** | **"Download Summary (CSV)"** and **"Download Expanded View (CSV)"** | TU **S7-R4**: an option labeled "Download (CSV)" | **case correct — build deviates** (already noted in C30434) |
| C30462 · C30464 · C30488 · C30489 · C30490 name the tabs **"Approved - partially completed"** / **"Approved - not started"** | **"Approved - Partially Completed"** / **"Approved - Not Started"** | WIP **S1-R2**, **S1-R3**: lower case, verbatim | **cases correct — build deviates** |
| C30112 expects the hint **"Search customers…"** pinned to the top of the dropdown | input placeholder **"Search customers"**, no ellipsis, not pinned | SBC **S18-R2**, verbatim | **case correct — build deviates** |
| C30128 expects a hover **tooltip** reading **"Expand all."** / **"Collapse all"** | no tooltip at all; the accessible name is **"Expand all customers"** | SBC **S8-R18** | **case correct — build deviates** |
| C30425 expects a control labeled **"Select all"** | the control reads **"All technicians"** | TU **S5-R6**, verbatim | **case correct — build deviates** |
| C30423 expects a filter labeled **"Filter by Technician"** | the field label reads **"Filter By Technician"** (capital B) | TU **S5-R1**, verbatim | **case correct — build deviates** (one letter) |

**Nothing in this table was written to TestRail.** Correcting any of it would have been the exact
mistake Standing Rule 57 exists to prevent — bending the expectation to whatever shipped, after which
the case can no longer fail.

## What the build DOES confirm — labels our cases got right

Read live and matching the case text exactly: page titles `Sales By Customer - Report | ShopView`,
`Technician Utilization - Report | ShopView`, `Work In Progress - Report | ShopView` · the column
selector's accessible name **"Column Selection"** · the export button's **"Export report"** · the nine
date presets **Last 12 Months · This Year · Last Year · This Quarter · Last Quarter · This Month ·
Last Month · This Week · Last Week**, an **Apply** button, and **no "All Time"**, no "Today", no
"Yesterday" · Technician Utilization's **"Expand all technicians"** / **"Collapse all technicians"**
and the per-row **"Expand <name>'s daily breakdown"** · the Est. Lost Labor note **"Est. Lost Labor:
Internal hours valued at each location's default labor rate"** · Sales By Customer's product types
**"Parts & Service"**, **"Parts only"**, **"Service only"** · the Work In Progress summary tiles
**TOTAL EARNED · TOTAL REMAINING · NOT STARTED · STARTED — EARNED · STARTED — REMAINING · READY TO
INVOICE · ESTIMATES** (em dash, as our cases write it) · **"Clear all"**, **"All locations"**,
**"All customers"**, **"All assets"**, **"All advisors"**.

## Raw markup

**0 of 225** — confirmed by searching every case's title, preconditions, steps and expected results
for `<ol> <li> <ul> <p> <br> <div> <span> <table>`, not assumed from an earlier count.

## One contradiction inside our own suite, for the QA lead

**C30452** ([link](https://shopview.testrail.io/index.php?/cases/view/30452)) asserts the tabs read
**"Approved - Partially Completed"** — Title Case, which is what the **build** shows and what the
**specification does not say**. The five cases above assert the specification's lower case. **They
cannot both be right.** C30452 looks like a case written to the build. **It was NOT changed** — moving
it means changing an expectation, which is his call, not mine tonight.
