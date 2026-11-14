# Sales by Tier and Sales by Category — Technical Implementation Plan

**Date:** 2026-11-11
**PRD:** [Sales by Tier and Sales by Category](https://shopview.atlassian.net/wiki/spaces/PM/pages/968687617/Sales+by+Tier+and+Sales+by+Category) (Confluence page version 21)
**Parent PRD / plan:** [Tiered Pricing v0.17](https://shopview.atlassian.net/wiki/spaces/PM/pages/938213378/Tiered+Pricing) (Confluence page version 37) — its tech plan (`2026-11-11-tiered-pricing.md`) writes the data these reports read
**Jira epic:** [SV-11692](https://shopview.atlassian.net/browse/SV-11692) Tiered Pricing · story [SV-11718](https://shopview.atlassian.net/browse/SV-11718)
**Design:** [Tiered Pricing design canvas](https://claude.ai/artifact/A3NtAX9CHJCD87SXDTn9AE?sk=z3YP2vy3EJhhhP_Dr9mV0Q), page 20 (screens 20.1–20.24)
_(keep the 🎨 Design access note in Section 0)_
**Tech stack:** Symfony 7.4 / PHP 8.5 / DBAL 4 on the read replica (BE) · Vue 3.5 + Quasar 2 + TanStack Query (FE)
**Estimated complexity:** High — a line-level report engine with credits, two reports, 3–4 drill levels, exports at 50,000 rows, and a fleet-wide backfill

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Planning (`/tech-plan` wizard) status:** wizard Phases 0–2 and 4–6 done and Phase 7 (plan) drafted; Phase 3 (Product questions) done: rounds 1–3 answered (pages 18, 20 and 21). Wizard Phase 8 (fresh-eyes audit) ran against page 20 on 2026-11-12 (findings fixed in rev 5) and as a delta audit against page 21 on 2026-11-13 (fixed in rev 7). Wizard Phase 9 (review) done; wizard Phase 10 done 2026-11-13: verification tickets SV-12745..SV-12755 (Section 11). **The /tech-plan wizard is complete for this plan.** Wizard phases are not the implementation phases in Section 6.
- **First implementation task:** Phase 0, recording Sales by Customer's performance baseline on the prod replica (Section 9, R-D35), before any code.
- **Current phase:** —
- **Last completed:** —
- **Branch:** — _(one branch and one PR; cut from the Tiered Pricing branch, rebased onto `develop` after that PR squash-merges; both merge in the same window before the feature `.0` cut)_
- **Phase commits:** — _(`Phase N: done @ <sha>`, one commit per phase)_
- **Open questions / blockers:** none open with Product, and no prod check open. Round 1 (RQ1–RQ3, RQ6–RQ9) was answered on 2026-11-11 (Product's reply 1013841927) and folded into page 18 (R-D20–R-D26). Round 2 (RQ10–RQ13, comment 1013612583; RQ15–RQ16, comment 1014104069) was answered on 2026-11-11 (replies 1013579786 and 1014235153) and folded into page 20 (R-D27). Round 3 (RQ17, item 14) was answered on 2026-11-12 (reply 1016528899) and folded into page 21 (R-D36): only credits with part lines count, which withdraws everything rounds 1–2 built for line-less credits and the credits row (R-D23, the RQ11–RQ13 and RQ16 parts of R-D27). DQ7 (prod, 2026-11-12) answered and was the evidence for RQ17. RQ14 was dropped before posting (R-D19). Nothing is left before implementation.

### PRD baseline

| | |
|---|---|
| **PRD version this plan is built on** | Confluence page version **21** (2026-11-12, Product's round 3 answer). Page 17 was read in full on 2026-11-11; every item that changed in pages 18–21 was re-read word for word (page 18 on 2026-11-11, pages 19–20 on 2026-11-12, page 21 from the page diff 20 → 21 on 2026-11-13) |
| **Exact baseline text** | [page version 21](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=968687617&pageVersion=21) (diff it against the current one in the page history → Compare) |
| **Last audited against** | Page 21: fresh-eyes audit against page 20 on 2026-11-12 (1 conflict, 7 gaps, 3 misalignments, 6 traceability holes; no blockers), all fixed in rev 5; delta audit against page 21 on 2026-11-13 (0 blockers, 0 should-fix, 3 minor), fixed in rev 7 |
| **Design baseline** | Tiered Pricing design canvas page 20, approved 2026-11-09 (canvas audit 2026-11-10) |

**When the PRD changes:** compare the current page version with the baseline above. If it moved, diff baseline → current, re-check every changed requirement against Sections 1, 3, 6, 10 and the appendices, re-run the fresh-eyes audit, then add a row to the revision history below and move the baseline.

### Plan revision history

| Rev | Date | PRD (page version) | Audited | What changed in the plan |
|---|---|---|---|---|
| 1 | 2026-11-11 | 17 | pending | First plan (draft; Product rounds open) |
| 2 | 2026-11-11 | page 18 | pending | Product round 1 folded in (RQ1–RQ3, RQ6–RQ9); round 2 RQ10–RQ13 posted |
| 3 | 2026-11-11 | page 18 | pending | E2E curation (wizard Phase 8) folded in: Section 7 E2E plan and traceability rows; FE testability items E2E-F1–E2E-F9; one wire contract in Section 5 (R-D28) |
| 4 | 2026-11-12 | page 20 | pending | Product round 2 answered (RQ10–RQ13, RQ15, RQ16): all accepted as built; no PENDING markers left |
| 5 | 2026-11-12 | page 20 | 2026-11-12 | Fresh-eyes audit findings fixed: Parts Credits first click (C1, R-D33); "Clear All Filters", the over-a-year message and "Sales Type: None" in the URL (G1–G3); migrated-credit exclusion rule (G4, R-D21, pending DQ7 at the time; superseded by rev 6); the fixed-line-total amount SBC counts (G5, R-D30); document date and order (G6, R-D29); download header lines (G7, R-D32); one RPT-S1-R7 list in Appendix C (M1, R-D34); performance bar and Phase 0 baseline (M2, R-D35); header check (M3, R-D31); traceability holes, Error Handling and User Feedback ids |
| 6 | 2026-11-13 | page 21 | 21 (delta, 2026-11-13) | Product round 3 (RQ17) answered: only credits with part lines count. Removed branch U (credit applications), the proportional split, reversal rows, the `creditApplication` / `creditApplicationReversal` document types, the `unlinkedCredits` row key and Priced By option and the credits row; R-D21 restated, R-D23 and the RQ11–RQ13 / RQ16 parts of R-D27 withdrawn, R-D36 added; DQ7 answered; E2E #2 keeps only the Part Sale return; companion Tiered Pricing page 37 |
| 7 | 2026-11-13 | page 21 | 21 | Delta-audit minors: a credit row's Expanded-download "Invoice #" is its credit number (R-D29); the customer search counts only credits with part lines (R-D13, Section 5); layout note names pages 18–21 |
| 8 | 2026-11-13 | page 21 | 21 | E2E content removed: Section 7 E2E plan (with its TestRail and Dev-layer case lists), E2E traceability rows, FE testability items E2E-F1–E2E-F9 (requirements and constraints they shared kept), the Tiered Pricing E2E-seed check, and the E2E notes in R-D28, Section 5's row keys, Appendix A's gates and Appendix B's verification step (tech plans carry no E2E; `/e2e-after-change` chooses coverage from the diff) |

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue. The `/loop` session is **orchestrator-only**: every code edit goes through `be-implementer` / `fe-implementer` (or the matching test-writer).
> - **If you are a sub-agent** without orchestration tools, do **not** invoke `/loop` or `/implement`. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins. Being handed just the plan path is **not** such an instruction.
>
> **This PR depends on the Tiered Pricing PR** (its `invoice_part_line` table, pricing record and `pricing_tier`). Start it only once that branch has its Phases 1–3 committed.

> 🎨 **Design access.** Design files are never copied into the repo; open them from the link. A `claude.ai/artifact/<id>` canvas opens with the **Artifact** tool (`action: "read"`); `project/canvas.json` maps screen files to titles and holds the designer's notes; read one screen with `path: "project/<file>.dc.html"` (page 20 = `RP*` and `GR-*` files). WebFetch and curl return 403. Project sub-agents don't have these tools, so the orchestrator opens the screens a phase needs and passes them into the agent's prompt.

> ⚡🔒 **Performance and security are top priorities for every phase.** Read §9 first. Every read is on the replica, tenant- and location-scoped, bounded by the 366-day window, paginated (30 per level) and backed by an index; no N+1. Exports are capped before they run.

> 📎 **Layout.** Sections 1–11 are the plan. **Appendix A** (backend design) and **Appendix B** (frontend design) hold the file-by-file detail. Where they disagree with Sections 3, 5, 6 or 9, **Sections 3, 5, 6 and 9 win** (each appendix opens with a line naming what pages 18–21 and the 2026-11-12 audit superseded). **Appendix C** holds the RPT-S1-R7 list and its sign-off (R-D34).

---

## 1. Requirements (extracted from PRD)

Ids are the PRD's own, prefixed `RPT-`. All map to story [SV-11718](https://shopview.atlassian.net/browse/SV-11718). Text copied verbatim from page version 21 (first line of each bullet). Items that changed in page 18: RPT-S1-R3, the Parts Cost column of RPT-S1-R6, RPT-S1-R7, RPT-S1-R9, RPT-S1-R14, RPT-S1-E4, RPT-S1-E8, RPT-S3-R1, RPT-S3-R9 and RPT-S5-E3, plus the two Key Decisions below. Items that changed in pages 19–20: RPT-S1-E8, RPT-S2-R3 and the Out of Scope bullet below. Items that changed in page 21: RPT-S1-R3, RPT-S1-E8, RPT-S3-R3, RPT-S3-R7, RPT-S3-R9, RPT-S5-R2, and the Feature Overview, Out of Scope and Terminology items below.

#### PRD framing these answers touch (page 21, verbatim)

- **Feature Overview, Columns** (wording unchanged from page 17): Columns: Parts Cost, Parts Invoiced, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total, with a Totals row whose Parts Invoiced matches Sales by Customer to the cent.
- **Feature Overview, Sales by Tier (changed in page 21):** Sales by Tier: one row per pricing source: each tier (Default included), Fixed price, Fixed line total, Manual and Before tiers.
- **Key Decision (changed in page 18):** **The part lines are added up, and they tie out to Sales by Customer.** Parts Invoiced and Parts Margin mean what they mean on Sales by Customer. Parts Cost is the parts cost Sales by Customer stores with each invoice, which it doesn't show today. The Totals tie to Sales by Customer to the cent (S1-R7). The Sales report counts parts differently (part-line discounts and fees, every credit on the day it was made, returned parts' cost, and a work order's whole parts cost on its newest invoice), so these reports don't try to match it. Wherever a rule here could differ from Sales by Customer (discounts, fixed line totals, customers, dates), it follows Sales by Customer. **Rationale:** two reports must never disagree. **Rejected:** reading Sales by Customer's invoice totals and spreading them across the lines; letting the lines win without a tie-out. A fix to how Sales by Customer counts a number (for example SV-11334) applies here too.
- **Key Decision (changed in page 18):** **Sales by Category groups by the line's category.** **Rationale:** the line's category is what priced it, and QuickBooks and AccountingHub book part revenue by the line's category too, so an invoice books under the same category the report shows. **Rejected:** the part's catalog category; a matrix level.
- **Out of Scope (changed in pages 19–20):** **Labor, shop supplies and whole work order or Part Sale fees.** Tiered Pricing prices parts only, so only parts are reported. Labor columns come when labor reaches tiers (Labor in Contracts).
- **Out of Scope (added in page 21):** **Credits with no part lines.** Credits created on the customer page for goodwill, overpayments, fees, write-offs or moved balances name no part, so these reports leave them out. Sales and Sales by Customer still show them.
- **Terminology, Parts Credits (changed in page 21):** **Parts Credits** → customer credit memos with part lines: Part Sale returns and other credits for parts, counted per part line, at the amount credited after any restocking fee, before tax. Vendor credits are never included.
- **Terminology, Credits not tied to a part:** removed in page 21.

#### Story 1: See parts sales and margin by what priced them

- **RPT-S1-R1** (SV-11718): Reports › Parts lists Sales by Tier, Sales by Category, Parts Velocity and Inventory Value, in that order. Neither report appears under Performance.
- **RPT-S1-R2** (SV-11718): Sales by Tier reports invoiced part lines from work orders and Part Sales. Lines are dated by the date their invoice was created, as on Sales by Customer. Only invoiced lines count; an open work order appears once it is invoiced. Void invoices never count. Each line belongs to the row of what priced it, as recorded on the line (Tiered Pricing S12-R4).
- **RPT-S1-R3** (SV-11718): Every invoiced part line is in exactly one row: each tier (Default included), Fixed price, Fixed line total, Manual or Before tiers. A part's core and environmental charges, and any fee or discount attached to that single part, are in the same row and category as the part. A row shows only when it has invoiced lines or credits in the range and filters, so a month in which no Wholesale customer was invoiced has no Wholesale row.
- **RPT-S1-R6** (SV-11718): The columns, in this order: (changed sub-bullet) **Parts Cost:** the cost of the row's parts, as Sales by Customer stores it with each invoice.
- **RPT-S1-R7** (SV-11718): A bold "Totals" row stays at the bottom while scrolling and sums the whole filtered result, not only the rows loaded. For the same date range, locations and Sales Type, its Parts Invoiced equals Sales by Customer's Parts Invoiced, to the cent. Its Parts Cost equals the parts cost Sales by Customer stores with those invoices, and its Parts Net equals Parts Invoiced plus these reports' credits. These reports don't tie to the Sales report. Engineering lists in the tech plan any invoice whose part lines don't add up to its invoice totals; the owning PM signs off each, with the report standard's owner.
- **RPT-S1-R8** (SV-11718): A renamed tier is one row under its current name; a renamed Default shows its current name (Tiered Pricing S4-R15). Archived tiers stay in the report while they have sales in the range.
- **RPT-S1-R9** (SV-11718): Labor, shop supplies and whole work order or Part Sale fees are not in the report. A fee attached to a single part follows that part (S1-R3).
- **RPT-S1-R10** (SV-11718): Internal and no-charge work orders close without an invoice, so their part lines are not in the report, as they are not in Sales or Sales by Customer.
- **RPT-S1-R11** (SV-11718): Active tier rows show the tier's number and name ("2 · Fleet"). An archived tier has no number (Tiered Pricing S2-R15), so its row shows its name with "(archived)". Other rows show their name. No icon beside any row name.
- **RPT-S1-R12** (SV-11718): 30 rows a page at every level (rows, customers, invoices), with more loading as the user scrolls.
- **RPT-S1-R13** (SV-11718): A row whose lines made no margin shows $0.00 Parts Margin; negative amounts show as negatives ("−$12.40") on screen, in the Totals and in every download.
- **RPT-S1-R14** (SV-11718): A column chooser, remembered per browser, can hide Parts Cost, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total. Only the column choice is remembered; the sort isn't, and the report always opens in its first-load order (S3-R7). The first column and Parts Invoiced always show. Downloads follow the columns shown.
- **RPT-S1-N1** (SV-11718): With default filters and nothing invoiced or credited in the date range, the report shows "There are no results for selected date range" and no Totals row.
- **RPT-S1-N2** (SV-11718): Without 'Reports — Page Access', the report isn't listed and its link shows "Access restricted", as every report does.
- **RPT-S1-E1** (SV-11718): A part priced for one customer on a work order whose customer was later changed stays in the row of what priced it, under the invoice's customer; the expanded download names the customer it was priced for (Tiered Pricing S12-R4, S9-R17, S11-R2).
- **RPT-S1-E2** (SV-11718): A line typed over a fixed price is in Manual.
- **RPT-S1-E4** (SV-11718): A fixed line total's parts are in Fixed line total, whatever the customer's tier: the fixed total priced them (Tiered Pricing S10-R13). The row reports the parts amount Sales by Customer counts for that line, and Parts Cost is the sum of its parts' costs. Engineering confirms that amount in the tech plan; any difference from the line's stored parts amount goes on the S1-R7 list. Fixed line totals invoiced before release recorded no pricing source, so they are in Before tiers.
- **RPT-S1-E5** (SV-11718): There is no canned line row. A part from a canned line is priced by the customer's tier when added and is in that tier's row.
- **RPT-S1-E6** (SV-11718): A discount on a single part line, on a work order or a Part Sale, lowers Parts Invoiced in the row of what priced that part, as on Sales by Customer. Whole work order and whole Part Sale fees and discounts are not in these reports. Older invoices whose line discounts Sales by Customer counts as whole-invoice adjustments follow Sales by Customer; any difference goes on the S1-R7 list.
- **RPT-S1-E7** (SV-11718): A line priced by a tier as Same as previous tier is in that tier's row (the customer's tier), not the tier it followed (Tiered Pricing S12-R19).
- **RPT-S1-E8** (SV-11718): Credits follow the sales-report credits rule. Only customer credit memos with part lines count: Part Sale returns and other credits for parts. Overpayments (money the customer already paid) and whole-invoice discounts carried over to another invoice are the same kind of record, but they are not in these reports. A credit line that names a part line counts at the amount credited after any restocking fee, before tax, on the date the credit was created, whether or not it has been applied. Void credits and vendor credits never count. A credit line is in the row and category of the part line it credits, at the original invoiced price (Tiered Pricing S11-N1), under the credit's customer and location; a credit on a line priced before release is in Before tiers. A credit with no part lines, such as one created on the customer page for goodwill, an overpayment, a fee or a write-off, is not in these reports: nothing says which part it was for. It still shows in Sales and Sales by Customer. A credit line that names no part line on a credit that has part lines is not in these reports either. A credit never changes the original invoice or a past month.
- **RPT-S1-E9** (SV-11718): Warranty parts are typed to $0 and are in Manual. A part with no cost is in the customer's tier at $0.
- **RPT-S1-EH1** (SV-11718; Error Handling, plan id): A failed load shows the report error state of Sales by Customer, keeping the filters.

#### Story 2: Open a row to its customers and invoices

- **RPT-S2-R1** (SV-11718): Each report opens with every row closed.
- **RPT-S2-R2** (SV-11718): Opening a row lists the invoices' and credits' customers for the lines in that row, with the same columns for that customer's lines in the row only. A customer priced by two tiers shows under both. Invoices with no customer are under "No Company", as on Sales by Customer.
- **RPT-S2-R3** (SV-11718): Opening a customer lists their invoices and credits with the row's lines on them, each with its date and the same columns for those lines only. An invoice or credit number links to it (the work order's Finance tab or the Part Sale; a credit opens its PDF in a new tab, since ShopView has no page for a single credit) only when it belongs to the signed-in location and the user may open it, as on Sales by Customer; otherwise the number is plain text.
- **RPT-S2-R4** (SV-11718): Each level adds up to the row above it.
- **RPT-S2-R5** (SV-11718): An invoice is always listed under its own customer, with its own number and date, as on Sales by Customer. The only other customer a line may name is the one it was priced for, in the expanded download (S1-E1).
- **RPT-S2-N1** (SV-11718): An invoice or credit from another location, or one the user may not open, shows its number as plain text (S2-R3).
- **RPT-S2-E1** (SV-11718): A customer deleted after their invoices were made still shows under their name as recorded on the invoice, as on Sales by Customer.
- **RPT-S2-EH1** (SV-11718; Error Handling, plan id): If a row's customers or invoices fail to load, the row shows "Ooooops! An error occurred" with Try again.

#### Story 3: Filter and sort

- **RPT-S3-R1** (SV-11718): Date range: the first chip; required, this month by default, one year at most, as on Sales by Customer. As on every report, the shared filter bar allows at most 50 picked values across all filters; "All" doesn't count toward it.
- **RPT-S3-R3** (SV-11718): Priced By: lists every tier (archived ones marked "(archived)"), then Fixed price, Fixed line total, Manual and Before tiers. All selected by default.
- **RPT-S3-R9** (SV-11718): Category: lists every category with Uncategorized first, then A to Z. All selected by default. Both reports have it.
- **RPT-S3-R4** (SV-11718): Customer: search for one or more customers, as on Sales by Customer. Empty means all.
- **RPT-S3-R5** (SV-11718): Sales Type: two options, "Part Sales" (Part Sale invoices and their credits) and "Work Orders" (work order invoices, including their parts), both selected by default. The closed filter reads "Sales Type: All", the one option picked, or "Sales Type: None". A customer can be on different tiers for each (Tiered Pricing S9-R1). The same two names are used wherever these reports name an invoice's type.
- **RPT-S3-R2** (SV-11718): Location: the last chip, following the report standard. It is multi-select, opens on the signed-in location (or on all accessible locations if the user can't access that one), is hidden for users with one location, and carries over when the user switches location. A Location column shows only when more than one location is in scope. A location the user can't access is refused with "Unknown location". Tiers apply to the whole client, so this shows a location's sales by tier.
- **RPT-S3-R10** (SV-11718): Opening a filter's dropdown puts the cursor in its search box.
- **RPT-S3-R12** (SV-11718): A filter chip shows as selected (blue) only when it holds a specific selection. Date range and Location always do, so they are always blue. Every other filter is plain when it is All or nothing is picked: the shared filter chip treats a filter whose default is all selected (Priced By, Category, Sales Type) as nothing picked, so it is plain when all are selected.
- **RPT-S3-R6** (SV-11718): Filters are kept in the page address, so back, reload, a link or a bookmark reopens the same view. A new visit starts from the defaults.
- **RPT-S3-R11** (SV-11718): Switching between the two reports carries the shared filters (date range, Location, Sales Type, Customer, Category, Priced By) in the page address, closes open rows and resets the sort.
- **RPT-S3-R7** (SV-11718): On first load, Sales by Tier's rows are in tier number order (Default first, then active tiers, then archived tiers in the order they were archived), then Fixed price, Fixed line total, Manual and Before tiers.
- **RPT-S3-R8** (SV-11718): Sorting is done on the server, over the whole filtered result. Every column sorts. The first click on text sorts A to Z and on a number column biggest first; the second click reverses; the third returns to the first-load order (S3-R7). Parts Credits are negative, so the first click puts the largest credit on top. Ties break by the S3-R7 order and then by name for rows, by name for customers, and by number, smallest first, for invoices and credits. Customers and invoices sort the same way within their row. Downloads use the same order.
- **RPT-S3-N1** (SV-11718): Filters that match nothing, including no Sales Type selected, show "No record matches these filters", "Try changing filters to widen your results." and a "Clear All Filters" button, and no Totals row.
- **RPT-S3-E1** (SV-11718): A filter search with no match shows no options and keeps the current picks.
- _Story 3 Error Handling (no id):_ Not applicable beyond the report's own load error (S1 Error Handling).

#### Story 4: Download

- **RPT-S4-R1** (SV-11718): The ⋯ menu offers four downloads for each report: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)" and "Download Expanded View (CSV)". They are built on the server; CSVs go through the shared CSV-injection guard.
- **RPT-S4-R2** (SV-11718): Summary has the rows and the Totals. Expanded has every level (rows, then the levels under them, down to invoices and credits) whatever is open on screen.
- **RPT-S4-R3** (SV-11718): Both use the current filters, sort and shown columns, and show Priced By in plain text, with tier numbers and "(archived)" as on screen (S1-R11).
- **RPT-S4-R4** (SV-11718): The expanded download names the customer a line was priced for when it differs from the invoice's customer (S1-E1), in a "Priced For" column.
- **RPT-S4-R5** (SV-11718): A PDF covers up to 2,000 rows and a CSV up to 50,000. Above that, the download is refused with "This report is too large to export. Choose a shorter date range, then try again."
- **RPT-S4-R6** (SV-11718): Download headers match Sales by Customer's downloads word for word where the column is the same: "Customer", "Invoice #", "Date", "Location", "Parts Invoiced", "Parts Margin", "Parts Margin %", and "Totals" on the Totals row. The columns these reports add read "Priced By", "Category", "Priced For", "Parts Cost", "Parts Credits", "Parts Net" and "% of Total". Before the reports are built, engineering checks the headers against Sales by Customer's downloads as they are then.
- **RPT-S4-R7** (SV-11718): Every download starts with the report's title; "Date Range: \<from\> – \<to\>"; "Locations: All locations" or the location names; then one line each for Sales Type, Category, Priced By and Customer, written out even when set to all. The PDF shows the client's logo.
- **RPT-S4-N1** (SV-11718): A download over its limit is refused with the message in S4-R5, and no file is made.
- **RPT-S4-N2** (SV-11718): A download with no rows shows the existing "Empty export" notice, and no file is made.
- **RPT-S4-E1** (SV-11718): Negative amounts download as negative numbers (S1-R13).
- **RPT-S4-EH1** (SV-11718; Error Handling, plan id): If a download fails, display "Ooooops! An error occurred" with "Contact support for more information" in today's error toast.

#### Story 5: Sales by Category

- **RPT-S5-R1** (SV-11718): Sales by Category has Sales by Tier's columns, filters, sorting, Totals, credits and downloads (Stories 1, 3 and 4).
- **RPT-S5-R2** (SV-11718): Rows are categories, by the category on each part line, under its current name; a renamed Default tier shows its current name (Tiered Pricing S4-R15). A category opens to its Priced By rows (Default, each tier, Fixed price, Fixed line total, Manual, Before tiers), each to customers, each to invoices and credits.
- **RPT-S5-R3** (SV-11718): % of Total is as S1-R6.
- **RPT-S5-R4** (SV-11718): Only categories with sales or credits in the range show; a category with neither has no row. Uncategorized sorts first on first load, then categories A to Z.
- **RPT-S5-R5** (SV-11718): A category with sales but no margin shows $0.00 Parts Margin; negative totals show as negatives (S1-R13).
- **RPT-S5-R6** (SV-11718): Inside a category, Priced By rows follow Sales by Tier's order (S3-R7).
- **RPT-S5-N1** (SV-11718): Empty results show the same two empty states as Sales by Tier (S1-N1, S3-N1).
- **RPT-S5-E1** (SV-11718): A line whose category was deleted reports under Uncategorized (Tiered Pricing S8-E1).
- **RPT-S5-E2** (SV-11718): Sales by Category's Totals equal Sales by Tier's for the same filters.
- **RPT-S5-E3** (SV-11718): A fixed line total that spans categories is split across them by the split the line recorded (Tiered Pricing S10-R13): in proportion to each part's cost at invoicing, in cents, with any leftover cent placed as Tiered Pricing S10-R13 sets out, so the parts always add up to the line's parts amount. Parts that all cost $0 split by quantity. Fixed line totals invoiced before release recorded no split, so the report splits them the same way when it runs. The Category filter on Sales by Tier uses the same split.
- **RPT-S5-E4** (SV-11718): The report groups by category only; there is no matrix grouping.
- **RPT-S5-E5** (SV-11718): Lines invoiced before release stay under the category they were invoiced with, including customer-named categories. As clients stop switching categories after release, sales move to the parts' own categories. This is expected.
- **RPT-S5-EH1** (SV-11718; Error Handling, plan id): A failed load shows the report error state of Sales by Customer, keeping the filters.

#### User Feedback Summary (PRD §8, verbatim; ids are the plan's)

| Id | Trigger | Message | Behavior |
|---|---|---|---|
| RPT-UF1 | Nothing invoiced or credited in the range | "There are no results for selected date range" | Empty state in place of the rows |
| RPT-UF2 | Filters match nothing, or no Sales Type | "No record matches these filters" / "Try changing filters to widen your results." | Empty state with "Clear All Filters" |
| RPT-UF3 | A location the user can't access | "Unknown location" | Refused |
| RPT-UF4 | Download over its limit | "This report is too large to export. Choose a shorter date range, then try again." | Error, no file |
| RPT-UF5 | Download with no rows | "Empty export" | Notice, no file |
| RPT-UF6 | Load or download fails | "Ooooops! An error occurred" | Error state with Try again, or error toast |

_65 requirement ids, plus 4 Error Handling ids (RPT-S1/S2/S4/S5-EH1) and 6 User Feedback ids (RPT-UF1–UF6) that this plan assigns, since the PRD numbers neither._

### Non-functional requirements introduced by analysis

| Id | Requirement | Origin |
|---|---|---|
| NFR-R1 | Both reports read only `invoice_part_line` (+ `invoice`, credits, names) on the **read replica**, never a live statement/part join; each query carries `ReportQueryTimeLimit` | Analysis + user decision (D11 in the parent plan) |
| NFR-R2 | "No slower than Sales by Customer for the same range and client" (RPT §6): baseline measured from DataDog APM and a controlled replica run for one year at the largest client; the new statements measured the same way. The bar is "no slower" with no allowance: each new statement's median of 5 warm runs ≤ SBC's median for the same client and range on the same replica (R-D35) | PRD §6 |
| NFR-R3 | For the same date range, locations and Sales Type, the Totals' Parts Invoiced equals Sales by Customer's `parts_invoiced` and the Totals' Parts Cost equals Σ`invoice.parts_cost` (so Parts Margin equals SBC's Σ(`parts_sell − parts_cost`)), proven by functional tie-out tests; no comparison with the Sales report (RPT-S1-R7, page 18); a read-only audit CLI lists every invoice whose snapshot doesn't reconcile (the RPT-S1-R7 list) | PRD + analysis |
| NFR-R4 | Historical invoices get snapshot rows from a batched, idempotent, resumable backfill CLI that writes `invoice_part_line` only (never re-runs the invoice financial snapshot) | Analysis |
| NFR-R5 | A 50,000-row CSV stays within the PHP-FPM 30 s CPU cap and memory: the CSV path builds plain string arrays, no per-cell objects | Analysis (PRD caps) |
| NFR-R6 | Every query is scoped by client and accessible locations (`AccessibleWorkplaceResolver`, `ValidReportScope`); every drill key and filter id is validated; tenant-isolation test per query repository | Golden Rule |

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Intake | intake (parent plan) | Included as its own plan, one PR, released with Tiered Pricing |
| Report data source | user | Per-line invoice snapshot written by the Tiered Pricing PR; backfill + audit here |
| DQ2 / DQ5 credits (12 months) | prod query | 1,073 credit lines, all naming their original part line; 2,206 credits without lines: 466 from a payment, 13 floor carry, 302 issued against an invoice |
| DQ4 old line discounts | prod query | 0 invoices (2 years) with part-line adjustments and no adjustments snapshot |
| DQ7 line-less credits by class, with applied amounts | prod query (audit G4, 2026-11-12) | Answered 2026-11-12: line-less credits are free-text AR adjustments; the migrated ones alone applied $1.14M in 12 months; no phase-2 credit has `origin_payment_id`. It led to RQ17 |
| RQ1 Parts Cost/Net vs the Sales report | Confluence comment (round 1, item 1) | Answered 2026-11-11 (page 18): both reports tie to Sales by Customer only; Parts Cost = Σ`invoice.parts_cost`, Parts Net = Parts Invoiced + these reports' credits; no Sales-report tie-out (R-D20) |
| RQ2 which credits count, and the applied-credit date | Confluence comment (round 1, item 2) | Answered 2026-11-11 (page 18): a part-line credit counts on the credit's date, applied or not; a line-less customer-page credit counts once applied, on the applied date, at the amount applied, per invoice; overpayments and carried-over discounts are left out (R-D21). The line-less half is withdrawn by page 21 (RQ17, R-D36) |
| RQ3 pre-release fixed line totals | Confluence comment (round 1, item 3) | Answered 2026-11-11 (page 18): Before tiers; Sales by Category splits them by the parts' costs like new lines, leftover cent per TP-S10-R13 (R-D22) |
| RQ6 credits row vs Category filter | Confluence comment (round 1, item 4) | Answered 2026-11-11 (page 18); withdrawn by page 21: there is no credits row (R-D23 withdrawn, R-D36) |
| RQ7 50-value filter cap | Confluence comment (round 1, item 5) | Answered 2026-11-11 (page 18): keep the shared cap; nothing to build (R-D24) |
| RQ8 sort memory | Confluence comment (round 1, item 6) | Answered 2026-11-11 (page 18): only the column choice is remembered; the sort never is (R-D25) |
| RQ9 core and environmental charges | Confluence comment (round 1, item 7) | Answered 2026-11-11 (page 18), with an addition: cores, environmental charges and any fee or discount attached to a single part are in the part's row and category (R-D26) |
| RQ10 what a credit number opens (RPT-S2-R3) | Confluence comment (round 2, item 8, comment 1013612583) | Answered 2026-11-11 (reply 1013579786, page 20): a credit opens its PDF in a new tab; plain text when the user can't open it (R-D27) |
| RQ11 location and customer of a line-less credit when they differ from the invoice's (RPT-S1-E8) | Confluence comment (round 2, item 9) | Answered 2026-11-11 (reply 1013579786, page 20): the invoice's location and customer (R-D27). Withdrawn by page 21: line-less credits are out (RQ17, R-D36) |
| RQ12 one payment applying several credits to several invoices (RPT-S1-E8) | Confluence comment (round 2, item 10) | Answered 2026-11-11 (reply 1013579786, page 20): each credit split across those invoices in proportion to the credit each invoice received (R-D27). Withdrawn by page 21: line-less credits are out (RQ17, R-D36) |
| RQ13 a credit application reversed later (RPT-S1-E8) | Confluence comment (round 2, item 11) | Answered 2026-11-11 (reply 1013579786, page 20): the reversal counts as a positive amount on the date it was reversed, in its own row (R-D27). Withdrawn by page 21: line-less credits are out (RQ17, R-D36) |
| RQ14 a credit on a line whose invoice was reversed | — | Dropped before posting: page 18 RPT-S1-E8 puts a credit line in the row and category of the part line it credits; engineering decision R-D19 |
| RQ15 Out of Scope still lists all fees (vs RPT-S1-R9) | Confluence comment (round 2, item 12, comment 1014104069) | Answered 2026-11-11 (reply 1014235153, page 20): Out of Scope now names "whole work order or Part Sale fees"; no plan change (R-D26) |
| RQ16 how a reversed credit application reads (with RQ13) | Confluence comment (round 2, item 13, comment 1014104069) | Answered 2026-11-11 (reply 1014235153, page 20): its own row labeled "Credit CM-5003 · application to Invoice 10498 reversed" (R-D27). Withdrawn by page 21: line-less credits are out (RQ17, R-D36) |
| RQ17 which credits count: only credits with part lines? (RPT-S1-E8) | Confluence comment (round 3, item 14) | Answered 2026-11-12 (reply 1016528899, page 21): only customer credit memos with part lines count, per credit line naming a part line, on the credit's date, applied or not; credits with no part lines and unnamed lines on part credits are out; the credits row and its Priced By option are removed (R-D36) |
| RPT-S4-R5 caps and RPT-S1-R13 "−$12.40" | PRD explicit | Built as written (parent D13) |

## 2. Architecture Overview

```
 Reports › Parts (FE)  SalesByTierReport / SalesByCategoryReport → shared PartsSalesReport body
        │  /api/reporting/reports/sales-by-{tier|category}[/drill/...][/export]
        ▼
 Reporting: PartLineSales engine (one engine, two drill paths) on the READ REPLICA
   branch S (sales):    invoice (window + scope, SBC's index) ⨝ invoice_part_line (covering index)
   branch C (credits):  credit_memo (non-void, on its own date, applied or not)
                        ⨝ credit_memo_line_item (only lines naming a part line) ⨝ invoice_part_line (by work_order_part_id)
   names: pricing_tier (current name, number by position), part_category (current name), invoice frozen customer name
        │
 Invoicing (this PR): app:invoicing:backfill-part-lines  ·  app:invoicing:audit-part-line-tie-out
        ▲
 Tiered Pricing PR: invoice_part_line written at invoice create / recompute; pricing record on lines
```

## 3. Technical Decisions

| Id | Decision | Chosen by | Rationale |
|---|---|---|---|
| R-D1 | One shared `PartLineSales` engine, two drill paths; Sales by Category's Totals equal Sales by Tier's by construction (RPT-S5-E2) | agent (planner RD1) | Half the SQL and tests |
| R-D2 | Read classes are `*QueryRepositoryInterface` / `Dbal*QueryRepository` (not `*Fetcher`) | agent (RD2) | `database.md` naming rule |
| R-D3 | Drive from `invoice` on SBC's `inv__work_place_id_created_on_idx` + a covering index on `invoice_part_line`; if EXPLAIN shows the parent PR's window index unused, drop it from that PR's M1 before either merges | agent (RD3) | SBC-equivalent scan; avoid an unused index |
| R-D4 | Sales Type from the invoice-number prefix via `SalesByCustomerProductType` (`all\|parts\|service\|none`) | agent (RD4) | Matches SBC by construction |
| R-D5 | Drill keys as validated query parameters `rowKey`, `categoryKey`, `customerKey`; drill paths carry a `/drill/` segment (FE silences drill toasts by that substring) | agent | Reconciled contract |
| R-D6 | % of Total: BE returns it at L1; the FE computes it below L1 from the L1 Totals | agent (RD6) | One fewer full-window statement per opened row |
| R-D7 | Report-suite envelope `collection` / `pagination.rowsNumber` / `totals` | agent (RD7) | `useReportTableQuery` |
| R-D8 | Tier number computed in Reporting (rank of active tiers by `position`) with a parity test against the parent PR's tier options | agent (RD8) | One connection per response |
| R-D9 | Backfill line adjustments from the frozen `adjustments_snapshot` when fully identified, else none (as SBC, RPT-S1-E6) | agent (RD9) | Never invent an adjustment the customer didn't pay |
| R-D10 | Backfill source = rebuilt pricing DTO via the parent's builder; mismatches go to the audit list; measure the mismatch rate on staging first | agent (RD10) | |
| R-D11 | Backfill scope: non-void invoices only | agent (RD11) | Void invoices never report |
| R-D12 | A part line on several invoices (voided then reissued): a credit goes to the latest non-void invoice's row | agent (RD13) | No double counting |
| R-D13 | Customer filter: a report-scoped type-ahead and resolve (`/filter-options/customers`) over invoices **and** credits in scope (a credit counts only when it has a line naming a part line, R-D36), same UX as SBC | agent (overrides RD14 and the FE reuse) | Reusing SBC's search can't find a customer who only has credits in the range — an unstated limitation |
| R-D14 | 50,000-row CSV: the table builder emits plain string arrays; per-format cap via an optional `$maxRows` on `ExportRowCapGuard` plus a new hint case with the PRD's message; minus sign via a `ReportExportFigureStyle::DisplayMinusSign` case; CSV numbers stay plain `-12.40` (RPT-S4-E1) | agent (RD15–RD17) | No regression for other reports |
| R-D15 | FE: one shared report body + two thin wrappers; each drill level owns a `useInfiniteQuery` (30 per page, sentinel row, in-row "Ooooops! An error occurred" + Try again, drill toasts silenced and captured to Sentry); 3-state sort composable; report-local "−" formatters; shared filter changes are opt-in flags (`plainWhenAllSelected`, `allSummaryLabel`, `autofocusSearch`) that leave ~70 other filter bars unchanged | agent (FE planner) | |
| R-D16 | UI points from the PRD and design page 20: over-a-year message "Choose a date range of one year or less." (20.11; built as an opt-in message on the shared date panel, Phase 4); credits row (20.5) withdrawn by PRD v21 (R-D36); Location chip not clearable (20.9 "always blue"); "Clear All Filters" (20.24; an opt-in label on `FilteredTableEmptyState`, Phase 4); column choice remembered per report (20.16); closed chips read "All", X restores All (20.2); negative percentages "−4.20%"; % of Total 2 decimals; documents first load oldest first (R-D29, from design 20.4; this replaces "newest first, as SBC"); "Multiple" for a row or Priced For spanning several; a sort change closes open rows, as SBC; filters carry between the two reports through the nav link (RPT-S3-R11); "None" kept in the URL with a report-local sentinel so RPT-S3-R6 and RPT-S3-R11 hold (Phase 11: a report-owned `none` query parameter); Priced By A–Z sorts by the shown label | agent | PRD + approved design settle these |
| R-D17 | Golden Rule exemption, signed off by the user 2026-11-12: both CLIs enumerate every client and run each under `runAs()`; recorded in the PR's "Golden Rule Exemptions" block | user (signed off 2026-11-12) | Parent D25 precedent |
| R-D18 | Imported historical invoices: verify in Phase 2 whether any live in `invoice` with no part rows; if so, they report as one "Before tiers" row per invoice carrying `parts_sell` and `parts_cost`, so the Totals' Parts Invoiced and Parts Cost still tie out (RPT-S1-R7, page 18) | agent | Planner ambiguity A14 |
| R-D19 | **A credit line's row and category come from the credited part line's recorded pricing** (RQ14, dropped before posting). Branch C reads `pricing_source`, `pricing_tier_id` and `part_category_id` from the snapshot row of the credited `work_order_part_id`, on its latest non-void invoice (R-D12, planner RD13). When that line has no snapshot row (its invoice was reversed and the rows cascaded), it reads the same recorded pricing columns from the credited `work_order_part` and its request's category. A NULL source is Before tiers; a deleted category is Uncategorized. The amount stays the credit line's own (after any restocking fee, before tax) | agent | Page 18 RPT-S1-E8 settles the rule ("in the row and category of the part line it credits … a credit on a line priced before release is in Before tiers"); one attribution path for every credit line |
| R-D20 | **Totals tie to Sales by Customer only** (RQ1). Parts Invoiced = Σ`net_sell_cents` = SBC's `parts_invoiced`. Parts Cost = Σ`cost_cents` = Σ`invoice.parts_cost`, the parts cost SBC stores with each invoice. Parts Margin = Parts Invoiced − Parts Cost = SBC's Σ(`parts_sell − parts_cost`). Parts Net = Parts Invoiced + these reports' credits. The tie-out tests assert Totals Parts Invoiced = SBC `parts_invoiced` and Totals Parts Margin = Σ(`parts_sell − parts_cost`). There is no Sales-report comparison anywhere: no `--compare-sales-report` audit mode, no Sales-report test, and returned parts' cost (planner A12) is moot because a credit carries no cost. The audit's `SELL_MISMATCH` and `COST_MISMATCH` checks stay; they are the RPT-S1-R7 list | Product (RQ1, page 18) | RPT-S1-R6, RPT-S1-R7 and the Key Decision "tie out to Sales by Customer", page 18 |
| R-D21 | **Which credits count, and when** (RQ2, restated for page 21 by RQ17). Branch C only: every `credit_memo_line_item` that names a part line (`originating_invoice_line_id IS NOT NULL`) on a non-void customer credit memo (`NonVoidCreditMemoPredicate`) counts on `cm.date_created`, applied or not, at the line's amount after any restocking fee, before tax (`CreditMemoLineItem::lineSubtotal()`), in the row and category of the part line it credits (R-D19), under the credit's customer and location. A credit with no part lines never contributes (goodwill, overpayments, fees, write-offs, moved balances, carried-over discounts), and neither does a line naming no part line on a credit that has part lines. Vendor credits live in their own `vendor_credit` table and are never read. Because no counted line can come from a line-less credit, no `reason` / `origin_payment_id` / `qb_sync_pattern` rule is needed. Withdrawn by PRD v21: the line-less half (counting goodwill on its application date through branch U) and the credit-class exclusion rule that DQ7 was checking | Product (RQ2 page 18; RQ17 page 21) | RPT-S1-E8, page 21 |
| R-D22 | **Fixed line totals invoiced before release** (RQ3). Their rows have a NULL `pricing_source`, so `PricedBySourceMap` maps them to Before tiers like every other pre-release line. The kind `CASE` has no `on_fixed_line_total` special case, and that column stays out of the P1 index. Sales by Category splits them by the shares the backfill writes into `gross_sell_cents`. The backfill gets those shares from the TP snapshot builder, which calls the TP plan's single fixed-line-total routine (TP plan D10, `FixedLineTotal`): weights by each part's cost at invoicing (by quantity when every part costs $0.00), and the leftover cent placed per TP-S10-R13, on a part with quantity 1 or else on the line's labor, as today. This plan has no split code and no "last part" rule of its own, so pre-release and new lines split by one routine. The report reads the stored split rather than recomputing it on every run; the result is the same split the PRD describes ("splits them the same way when it runs"). Where the recomputed split doesn't match what the invoice billed, the audit (`SELL_MISMATCH`, `FIXED_LINE_TOTAL`) puts the invoice on the RPT-S1-R7 list | Product (RQ3, page 18; TP-S10-R13, TP page 33) | RPT-S1-E4 and RPT-S5-E3, page 18 ("splits them the same way"; leftover cent "as Tiered Pricing S10-R13 sets out") |
| R-D23 | **Withdrawn by PRD v21.** It was the rule for hiding "Credits not tied to a part" under a partial Category pick (RQ6). Page 21 removes that row, so `PartLineSalesFilter::hidesUnlinkedCredits()` is not built and the Category filter has no special case | Product (RQ6 page 18; withdrawn page 21) | RPT-S3-R9, page 21 |
| R-D24 | **The shared 50-value filter cap stays** (RQ7). Nothing to build: `MAX_TOTAL_SELECTED_FILTER_VALUES` already charges nothing for "All". The backend keeps its defensive 422 at 500 ids per list. Known effect, as on every report: "every category but one" is refused on a client with more than 50 categories | Product (RQ7, page 18) | RPT-S3-R1, page 18 |
| R-D25 | **Only the column choice is remembered** (RQ8). `useRememberedTableView` stores the visible columns per browser and per report; the sort is never stored or restored, and every load opens in first-load order (RPT-S3-R7). No API field | Product (RQ8, page 18) | RPT-S1-R14, page 18 |
| R-D26 | **Cores, environmental charges and single-part fees and discounts follow the part** (RQ9). The TP plan's snapshot builder writes this: `core`, `core_credit` and `environmental_charge` rows carry the parent part's `pricing_source`, `pricing_tier_id`, `priced_for_company_id` and `part_category_id`, and a fee or discount attached to a single part is in that part row's `line_adjustment_cents` (so in its `net_sell_cents`). The reports read those columns directly and never group by `row_kind`; no option maps `row_kind` to separate rows, and `row_kind` stays out of the P1 index. Whole work order and Part Sale fees and discounts are not snapshot rows, so they never reach these reports. The backfill builds pre-release rows through the same builder (`buildForPersistedInvoice` shares its row mapping), so historical cores, environmental charges and part-line adjustments get the same attribution; part-line adjustments come from the frozen `adjustments_snapshot` per R-D9. This PR adds no RQ9 builder change; the TP PR owns it | Product (RQ9, page 18) | RPT-S1-R3 and RPT-S1-R9, page 18 |
| R-D27 | **Round 2 answered as proposed** (page 20); **parts withdrawn by PRD v21.** **Credit link (RQ10), still in force:** a credit's number opens the credit's PDF in a new tab through the existing `GET /api/credit-memos/{creditMemoId}/pdf` (`ROLE_INVOICE_VIEW`; the FE reuses `usePrintCreditMemoPdfMutation`), only when the credit belongs to the signed-in location and the user may view invoices; otherwise plain text. Lives in `canOpenDocument` / `documentRoute` in `sales-by-tier/Model.ts`. **Withdrawn by PRD v21 (RQ17, R-D36):** RQ11 (a line-less credit under the invoice's location and customer), RQ12 (the proportional split of several credits in one payment), RQ13 and RQ16 (reversal rows and their label), and with them branch U, the `creditApplication` / `creditApplicationReversal` document types and the application-row link to its invoice | Product (RQ10 page 20; withdrawals page 21) | Page 21 RPT-S2-R3 ("a credit opens its PDF in a new tab") and RPT-S1-E8 |
| R-D28 | **One wire contract, stated in Section 5** (Section 5 and Appendix B §2 disagreed). Section 5 already fixed the four drifted points, and they stay: drill parameters `rowKey` / `categoryKey` / `customerKey` (R-D5), camelCase `sortBy` keys, `salesType` as one value (`all\|parts\|service\|none`), and the report-scoped customer search (R-D13). Where Section 5 was silent, chosen here: export `columns` values are camelCase, the same vocabulary as `sortBy` (SBC's export has no `columns` parameter); the FE filter-key → wire-parameter mapping; `documentKey` on document rows and the row-key formats; the customer-search parameters mirror SBC's (`search`, dates, Sales Type, `locations`; resolve by `ids`, at most 500). SBC's own endpoints are snake_case with `productType`; these new endpoints follow the BE plan (camelCase, `salesType`), and the FE maps its snake_case column ids to wire keys in one table | agent | One contract that the FE phases (3, 9–12) and the BE phases (5–8, 12) both build against |
| R-D29 | **Document date and order** (RPT-S2-R3, audit G6). On screen the date sits beside the number in the first column, in muted text, as design 20.4 shows: "Invoice 10510 · Oct 2, 2026"; a credit row reads "Credit CM-5003 · Oct 21, 2026" (credit-application and reversal rows were withdrawn by PRD v21). There is no Date column on screen (RPT-S1-R6 lists none, and RPT-S1-R14 has none to hide), so the date isn't a click-to-sort column; the document levels' first column sorts by `number`. First-load order of documents is date oldest first, then number smallest first (design 20.4 shows Oct 2 before Oct 5; RPT-S3-R8's document tie-break). This replaces R-D16's "newest first, as SBC". The Expanded download keeps a "Date" column (RPT-S4-R6). Date format "MMM d, yyyy" in the workplace time zone In the Expanded download, a credit row's "Invoice #" cell reads its credit number (for example "CM-5003"), and its "Date" cell the credit's date (RPT-S4-R2, RPT-S4-R6; replaces Appendix A's A8 pointer to design 20.5, which PRD v21 withdrew). | agent | The approved design shows it; no PRD column to add |
| R-D30 | **The parts amount Sales by Customer counts for a fixed-line-total line** (RPT-S1-E4, "engineering confirms that amount", audit G5). `InvoiceFinancialSnapshotService::capture()` sets `invoice.parts_sell` from `WorkOrderPricingDto::getTotalPartsPrice()` (plus `part_line`-scoped adjustments), which sums `WorkOrderLinePricingDto::getTotalPartsPrice()`: Σ(part sell price × quantity) over the line's billable parts (return requests and declined lines skipped). On a fixed-line-total line each part's sell price is the per-unit price that `FixedLineTotal::calculatePrices()` derives from `work_order_line.fixed_line_parts_price`, through `WorkOrderPartsAndLinesHydrator::getRateAndLaborPriceForLine()`. So the counted amount is the stored parts amount, except: (a) when no part has quantity 1, the leftover cent moves to labor and the parts count one cent less; (b) a line with no stored portions (`fixed_line_labor_price` / `fixed_line_parts_price` NULL, older lines) counts its whole total as labor and its parts at $0. The snapshot builder reads the same DTO (TP plan §2.5: gross = sell × quantity), so the Fixed line total row, and Before tiers for pre-release lines, equal this amount by construction. The audit's `FIXED_LINE_TOTAL` check lists every line where it differs from `fixed_line_parts_price` (cases a and b) for the RPT-S1-R7 list | agent (code read 2026-11-12) | Confirms the amount in the plan, as the PRD asks; differences stay visible |
| R-D31 | **Download header check** (RPT-S4-R6, done 2026-11-12, audit M3). SBC's current headers (`SalesByCustomerExportColumn::label()`, `SalesByCustomerExportTableBuilder::TOTALS_LABEL`): "Customer", "Invoice #", "Date", "Location", "Parts Invoiced", "Parts Margin", "Margin %" and "Totals". Every shared header in RPT-S4-R6 matches word for word except "Parts Margin %", where SBC says "Margin %"; these reports use "Parts Margin %" by the PRD's Key Decision ("Parts Margin %" replaces "Margin %"). The added headers ("Priced By", "Category", "Priced For", "Parts Cost", "Parts Credits", "Parts Net", "% of Total") have no SBC counterpart. Re-check in Phase 12 against the code as it is then | agent | RPT-S4-R6 asks for the check before build |
| R-D32 | **Download header lines** (RPT-S4-R7, RPT-S3-R5, audit G7). In order: the report title ("Sales by Tier" / "Sales by Category"); "Date Range: <from> – <to>"; "Locations: All locations" or the names; "Sales Type: All", "Sales Type: Part Sales", "Sales Type: Work Orders" or "Sales Type: None" (RPT-S3-R5's names, not SBC's "Parts & Service"); "Category: All categories" or the picked names; "Priced By: All" or the picked labels as on screen ("2 · Fleet", "(archived)"); "Customer: All customers" or the picked names. A narrowed list is comma-separated in filter order; an empty pick reads "None". The all-wording comes from design 20.21; the order follows RPT-S4-R7 (Sales Type, Category, Priced By, Customer), although design 20.21 shows Priced By before Category | agent | Design 20.21 gives the wording; the PRD gives the order |
| R-D33 | **Parts Credits first click** (RPT-S3-R8, audit C1). The FE sends `descending=true` on the first click of every number column, `partsCredits` included; the server sorts `partsCredits` by −credits, so descending puts the largest credit on top. Appendix B's `firstDescendingFor('parts_credits') = false` and its "first click ascending" tests are superseded; Phase 9 owns the rule and its test | agent | "Parts Credits are negative, so the first click puts the largest credit on top" (RPT-S3-R8); one rule on both sides |
| R-D34 | **One RPT-S1-R7 list, in Appendix C** (audit M1). The audit CLI's invoice-level list (invoice id and number, client, workplace, check, expected / actual / delta cents, cause) is pasted into Appendix C, and the owning PM's and the report-standard owner's sign-off is recorded there per invoice or per cause class. Sequence: before the PR merges, the branch runs the backfill and then the audit on staging restored from a fresh prod dump, and that list is signed off; after release, the backfill and the audit run against prod (audit on the prod replica), and any invoice not already in Appendix C is added and signed off before the reports are announced. The PR description and Jira carry no copy of the list | agent | The PRD says the list is in the tech plan; the prod backfill needs this PR's code, so a prod run can only follow the release |
| R-D35 | **Performance bar** (PRD §6, audit M2). For each statement (Tier L1 page and Totals, the Default-row L2, L3 for the largest customer, Category L1, both Expanded exports' count and fetch), the median of 5 warm runs ≤ SBC's median for the same client and range on the same replica. No noise allowance. SBC's baseline is recorded first, as Phase 0, before any code | agent | "No slower than Sales by Customer" |
| R-D36 | **Only credits with part lines** (RQ17, round 3 item 14, page 21). Parts Credits come only from credit lines that name a part line (R-D21). Removed from the plan: branch U (credit applications through `credit_memo_application` → `customer_payment_statement` → invoice), the proportional split, reversal rows and their label, the `creditApplication` / `creditApplicationReversal` document types, the "Credits not tied to a part" row in both reports, its `unlinkedCredits` row key, category key and Priced By option, and the credits-row hide rule (R-D23). Kept: branch C, R-D19's attribution, RQ10's credit-PDF link. Line-less credits stay visible in Sales and Sales by Customer, which this PRD doesn't change | Product (RQ17, reply 1016528899) | DQ7 (prod, 2026-11-12): line-less credits are free-text AR adjustments (the migrated ones alone applied $1.14M in 12 months) and no phase-2 credit has `origin_payment_id`, so no rule could say which part they were for |

## 4. Database Changes

| Change | Kind | Rollback safety |
|---|---|---|
| Covering index on `invoice_part_line` for branch S (name per the `database.md` abbreviation table; exact columns in Appendix A → P1; neither `on_fixed_line_total` nor `row_kind` is in it, per R-D22 and R-D26) | index (online) | Old code doesn't read the table |
| Optional second index for Default-row drill-downs (`work_place_id, pricing_source, pricing_tier_id, invoice_created_on, invoice_id`) — only if the Phase 13 measurement misses the bar | index (online) | Same |

> ⚠️ Migrations are hand-written and verified with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"); create the file with `bin/console doctrine:migrations:generate`. This migration must sort after the parent PR's M1.

### Data migrations
- **Backfill** `app:invoicing:backfill-part-lines`: per client under `runAs()`, batches of invoices in `created_on` order, idempotent (skips invoices that already have rows), resumable (`--from-invoice-id`), `--dry-run`, per-invoice retry on a unique-key race with a live recompute. Writes `invoice_part_line` only, through the TP snapshot builder, so pre-release fixed-line-total shares come from the TP fixed-line-total routine (R-D22) and cores, environmental charges and part-line fees and discounts carry their part's attribution (R-D26). Runtime measured on staging before booking the prod window (≈ 308k invoices / 1.2M part rows fleet-wide).
- **Audit** `app:invoicing:audit-part-line-tie-out`: read-only (replica), per client and month, lists invoices whose Σ`net_sell_cents` ≠ `parts_sell` or Σ`cost_cents` ≠ `parts_cost`, with the cause class. Its invoice-level output is the RPT-S1-R7 list, pasted into Appendix C with the sign-offs (R-D34).

## 5. API Changes

All `GET`, `#[IsGranted(ROLE_REPORT_VIEW)]`, `#[ReadReplica]`, suite request DTO, money in integer cents, camelCase keys, suite envelope. **This section is the one wire contract (R-D28).** Appendix A's endpoint table and Appendix B §2 are superseded wherever they differ; the FE (Phases 3, 9–12) and the BE (Phases 5–8, 12) both use the names below.

**Request parameters** (every report endpoint and the export):

| Parameter | Contract |
|---|---|
| Dates | `range`, `startDate`, `endDate` (suite `ReportListRequestDto`, 366-day cap → 422). The FE's `dateRange` filter maps to them |
| `locations` | CSV of workplace UUIDs, always enumerated by the FE (`locationIds` filter) |
| `customers` | Tri-state CSV of company UUIDs (absent = all, present-empty = none, list = these); FE filter key `customerIds` |
| `pricedBy` | Tri-state CSV of `rowKey` values (below); FE filter key `pricedBy` |
| `categories` | Tri-state CSV of `categoryKey` values (below); FE filter key `categoryIds` |
| `salesType` | **One value**, `all\|parts\|service\|none` (the values of SBC's `productType`). The FE's `salesTypes` filter (checkboxes `partSales`, `workOrders`) is a URL and filter key only, never sent: both → `all`, `partSales` → `parts`, `workOrders` → `service`, neither → `none` |
| Drill keys | `rowKey` (a Priced By row), `categoryKey` (a category), `customerKey` (a customer), as plain query parameters on the `/drill/…` paths (R-D5). There are no `parent…` parameters |
| Sort and paging | `pagination[page]`, `pagination[rowsPerPage]` (30), `pagination[sortBy]`, `pagination[descending]`. `sortBy` is camelCase from the level's whitelist: `pricedBy` (Tier L1, Category L2), `category` (Category L1), `customer` (customer levels), `number` (document levels; their first-load order is date oldest first, then number smallest first, R-D29), `location`, `partsCost`, `partsInvoiced`, `partsCredits`, `partsNet`, `partsMargin`, `partsMarginPct`, `pctOfTotal`. Absent or empty `sortBy` = first-load order (RPT-S3-R7). **First click (RPT-S3-R8, R-D33):** the FE sends `descending=true` on the first click of every number column, `partsCredits` included, and `descending=false` on a text column; the server sorts `partsCredits` by −credits, so the first click puts the largest credit on top. The FE keeps snake_case column ids (`parts_cost`, …) for test ids and the column chooser and maps them to these keys in one table in `sales-by-tier/Model.ts` |
| Export | `variant=summary\|expanded`, `format=pdf\|csv`, `columns` = CSV of the shown hideable columns in on-screen order, camelCase from `partsCost, partsCredits, partsNet, partsMargin, partsMarginPct, pctOfTotal`. The first column and `partsInvoiced` are always exported; `location` is added by the server when more than one location is in scope, as on screen |

**Row keys** (stable ids; the FE builds row test ids from them, and drill requests send them back unchanged). UUIDs are lowercase canonical (`BIN_TO_UUID`).

| Key | Values |
|---|---|
| `rowKey` | A tier UUID (Default included; it is a real `pricing_tier` row), or a kind slug `fixedPrice\|fixedLineTotal\|manual\|beforeTiers` |
| `categoryKey` | A category UUID, or `uncategorized` |
| `customerKey` | A company UUID; the nil UUID `00000000-0000-0000-0000-000000000000` for No Company |
| `documentKey` | `invoice_<invoiceId>` or `credit_<creditMemoId>` |

**Customer search (R-D13):** `GET /api/reporting/reports/sales-by-tier/filter-options/customers?search=&range=&startDate=&endDate=&salesType=&locations=` offers customers with invoices **or** credits in that scope, counting only credits with a line naming a part line (branch C, R-D36) (both reports use it), and `GET …/filter-options/customers/resolve?ids=` (at most 500 ids) resolves URL ids to names. The response shape is SBC's (`/sales-by-customer/customers` and `/customers/resolve`), and the request differs only in naming Sales Type `salesType` (SBC: `productType`), so the FE chip keeps SBC's search wiring with this URL. These reports never call SBC's endpoints.

| Path | Level / purpose |
|---|---|
| `/api/reporting/reports/sales-by-tier` | L1 Priced By rows + `totals` |
| `/api/reporting/reports/sales-by-tier/drill/customers?rowKey=` | L2 customers |
| `/api/reporting/reports/sales-by-tier/drill/documents?rowKey=&customerKey=` | L3 invoices and credits |
| `/api/reporting/reports/sales-by-category` | L1 categories + `totals` |
| `/api/reporting/reports/sales-by-category/drill/priced-by?categoryKey=` | L2 Priced By |
| `/api/reporting/reports/sales-by-category/drill/customers?categoryKey=&rowKey=` | L3 customers |
| `/api/reporting/reports/sales-by-category/drill/documents?categoryKey=&rowKey=&customerKey=` | L4 invoices and credits |
| `/api/reporting/reports/sales-by-tier/filter-options` | Both reports' Priced By and Category options: `{pricedBy:[{key, kind, tierNumber, name, label, isArchived, isDefault}], categories:[{key, label}]}`, keys as in the row-key table, in RPT-S3-R7 / RPT-S3-R9 order (Uncategorized first, key `uncategorized`). Replaces Appendix A's `priced-by-options` |
| `/api/reporting/reports/sales-by-tier/filter-options/customers?search=…` · `…/filter-options/customers/resolve?ids=` | Customer type-ahead and resolve over the report's scope (R-D13; parameters above) |
| `/api/reporting/reports/sales-by-{tier\|category}/export?variant=summary\|expanded&format=pdf\|csv&columns=` | File; 400 with the PRD message above the cap |

Row shapes (field names here win over Appendix A → Endpoints and Appendix B §2; the FE adds its own `rowType` discriminator when it maps a level): group rows `{rowKey|categoryKey, kind, tierId, tierNumber, isDefault, isArchived, label, location, partsCost, partsInvoiced, partsCredits, partsNet, partsMargin, partsMarginPct, pctOfTotal (L1 only)}`; customer rows `{customerKey, customerName, location, …money}`; document rows `{documentKey, documentType: invoice|credit, documentId, number, date, workplaceId, location, workOrderId, workOrderType, creditMemoId, customerId, …money}`. Sort keys are in the parameter table above; `partsCredits` sorts by −credits; tie-breaks per RPT-S3-R8.

**Money semantics (page 18, R-D20):** `partsInvoiced` = Σ`net_sell_cents` (ties to SBC's `parts_invoiced`); `partsCost` = Σ`cost_cents` (ties to Σ`invoice.parts_cost`); `partsMargin` = `partsInvoiced − partsCost`; `partsCredits` ≤ 0 from branch C, credit lines naming a part line (R-D21); `partsNet` = `partsInvoiced + partsCredits`. No field compares with, or comes from, the Sales report.

**Credit documents (page 21):** `credit` rows (branch C) carry `creditMemoId`; the FE opens the credit's PDF from it in a new tab (RPT-S2-R3, R-D27). Only credits with part lines appear (R-D36); there are no application or reversal rows.

**No sort memory:** no endpoint stores or returns a remembered sort; the FE stores only the column choice (RPT-S1-R14, R-D25).

No existing endpoint changes. No new permission (the credit link reuses `GET /api/credit-memos/{creditMemoId}/pdf` and its `ROLE_INVOICE_VIEW`).

## 6. Implementation Phases

| # | Phase | Layer | Implements | Depends on | Detail |
|---|---|---|---|---|---|
| 0 | SBC performance baseline (no code; first task) | B | NFR-R2: SBC's medians on the prod replica for the largest client, one year (R-D35) | — | Section 9 |
| 1 | Schema: covering index, abbreviation rows | B | NFR-R1 | parent Phases 1–3 | Appendix A → P1 |
| 2 | Backfill + tie-out audit CLIs | B | NFR-R3/R4, RPT-S1-R7 list, RPT-S5-E5; pre-release fixed line totals in Before tiers with the TP routine's split (RPT-S1-E4, RPT-S5-E3, R-D22); part attribution of cores, environmental charges and part-line adjustments on historical rows (RPT-S1-R3, RPT-S1-R9, R-D26); older line discounts follow SBC (RPT-S1-E6, R-D9); the audit's list goes to Appendix C (R-D34) | 1 | Appendix A → P2 |
| 3 | FE API contract + data layer (MSW stubs) | F | RPT-S1-R2..R8, RPT-S1-R12, RPT-S2, RPT-S3-R8; the Section 5 wire contract verbatim (R-D28): drill parameters `rowKey` / `categoryKey` / `customerKey`, camelCase `sortBy` and `columns` keys mapped from the FE column ids in one table, `salesType` (one value) mapped from the `salesTypes` filter, the report-scoped `filter-options/customers` endpoints (not SBC's), row keys as in Section 5 | — | Appendix B → P0 (its §2 contract is superseded) |
| 4 | Shared filter primitives (opt-in flags) | F | RPT-S3-R3/R5/R9/R10/R12; existing shared filter ids unchanged; `FilteredTableEmptyState` gets an opt-in clear-button label prop (default "Clear all filters" unchanged; RPT-S3-N1, RPT-UF2); `FilterPresetDateRangePanel` gets an opt-in over-max message on the filter def (default "Range: N days (max 366)" unchanged; RPT-S3-R1); unit tests for each prop set and unset | — | Appendix B → P1 |
| 5 | Filter plumbing + value objects | B | RPT-S3; request DTOs take the Section 5 names (`salesType`, `pricedBy`, `categories`, `customers`, `locations`, `rowKey`, `categoryKey`, `customerKey`, camelCase `sortBy`) and the row-key formats (R-D28) | 1 | Appendix A → P3 |
| 6 | Query engine (branches S and C; sorting; totals) | B | RPT-S1-R2..R13, RPT-S1-E1..E9, RPT-S5-R2..R6, RPT-S5-E1..E5; SBC-only tie-out (R-D20); credits: only lines naming a part line, on the credit's date, applied or not (R-D21, R-D36, R-D19), with functional tests that a goodwill credit, an overpayment credit and an unnamed line on a part credit never appear; no `row_kind` grouping (R-D26) | 5 | Appendix A → P4 (branch U and `unlinkedCredits` withdrawn) |
| 7 | Sales by Tier endpoints | B | RPT-S1, RPT-S2, RPT-S3; the paths, `filter-options` and `filter-options/customers{,/resolve}` exactly as Section 5; rows carry `rowKey` / `customerKey` / `documentKey` (R-D28) | 6 | Appendix A → P5 (its route table is superseded) |
| 8 | Sales by Category endpoints | B | RPT-S5; paths and keys as Section 5 (`categoryKey` incl. `uncategorized`) | 6 | Appendix A → P6 |
| 9 | Report model, 3-state sort, formatters | F | RPT-S1-R6/R11/R13/R14, RPT-S3-R7/R8, RPT-S4-E1; first click descending on every number column incl. Parts Credits, test: the first Parts Credits click sends `sortBy=partsCredits&descending=true` and `aria-sort="descending"` (R-D33); document date formatter "MMM d, yyyy" (R-D29) | 3 | Appendix B → P2 |
| 10 | Drill-down rows (recursive, paged, in-row error) | F | RPT-S1-R12, RPT-S2; credit number opens its PDF in a new tab (RPT-S2-R3, R-D27); the document date beside the number and oldest-first order (R-D29); in-row error + Try again (RPT-S2-EH1) | 9 | Appendix B → P3 |
| 11 | Report body: filters, URL, table, Totals, column chooser (columns only, R-D25), empty states | F | RPT-S1, RPT-S3, RPT-S5-R1/N1; "Clear All Filters" through the Phase 4 label prop; "Choose a date range of one year or less." through the Phase 4 message; "None" in the URL through a report-owned `none` query parameter (CSV of the filter keys set to None: `salesTypes`, `pricedBy`, `categoryIds`), written on change, read after `useFilterUrlSync` restores defaults, carried by the nav link with the six shared keys, `useFilterUrlSync` unchanged; unit tests: reload with "Sales Type: None" keeps None and the RPT-S3-N1 empty state, switching report with None carries it, Back restores it (RPT-S3-R6, RPT-S3-R11, RPT-S3-N1); load error state as SBC, filters kept (RPT-S1-EH1, RPT-S5-EH1) | 4, 10 | Appendix B → P4 |
| 12 | Downloads (BE caps, formatter, PDF/CSV; FE menu) | B+F | RPT-S4; `columns` in camelCase (R-D28); the header lines exactly as R-D32; the headers as R-D31 (re-checked against SBC's code); the failure toast (RPT-S4-EH1) | 7, 8, 11 | Appendix A → P7, Appendix B → P4 |
| 13 | Registration, nav, filter carry; performance measurement and verification record | B+F | RPT-S1-R1, RPT-S1-N2, RPT-S3-R11, NFR-R2 (each new statement's median ≤ the Phase 0 SBC median, R-D35) | all | Appendix B → P5/P6, Appendix A → P8 |

**Product round 1 (answered, page 18):** RQ1 → R-D20 (Phase 6 tie-out tests assert SBC `parts_invoiced` and Σ(`parts_sell − parts_cost`); Parts Cost = Σ`invoice.parts_cost`; no Sales-report work). RQ2 → R-D21 (Phase 6 branch C; restated by RQ17). RQ3 → R-D22 (`PricedBySourceMap` maps NULL to Before tiers with no special case; Phase 2 backfill splits through the TP routine). RQ6 → R-D23, withdrawn by page 21. RQ7 → R-D24 (nothing to build). RQ8 → R-D25 (Phase 11 persists columns only). RQ9 → R-D26 (TP builder owns the attribution; Phase 2 asserts it on backfilled rows; no `row_kind` grouping in Phase 6). RQ14 → R-D19.

**Product round 2 (answered, page 20):** RQ10 → Phase 10 credit link (PDF in a new tab, R-D27). RQ11, RQ12, RQ13 and RQ16 → withdrawn by page 21 (nothing to build). RQ15 → PRD wording only.

**Product round 3 (answered, page 21):** RQ17 → R-D36: Phase 6 builds branch C only; no credits row, no `unlinkedCredits` key or Priced By option, no application or reversal rows. Nothing is pending with Product.

**Verification per phase:** BE static (cs-fix, phpstan, pest), migration gate (Phase 1), smoke after BE phases; FE eslint, `vitest related --run`, `vue-tsc --noEmit`, compile gate; browser-walk in Phase 13 as `admin`: Reports › Parts order; `/reports/sales-by-tier` chips, expand row → customer → documents, scroll past 30, 3-state sort on Parts Margin and Parts Credits, hide a column and sort, then reload (the column stays hidden, the sort is back to first-load order, R-D25), a credit number opens its PDF in a new tab and is plain text for another location (RPT-S2-R3, page 20), a goodwill credit applied to an invoice appears in neither report, all four downloads, empty states, an in-row error (block `*/drill/*`), switch to Sales by Category (filters carried, rows closed, sort reset), 4 levels; a role without 'Reports — Page Access' sees no entries.

## 7. Testing Strategy

### Unit tests
- **BE:** filter value objects (tri-state), `PricedBySourceMap` (NULL → Before tiers with no fixed-line-total special case, R-D22), label building (`2 · Fleet`, `(archived)`, reserved names), sort whitelists and tie-breaks, the fixed-line-total category split read from recorded shares, CSV string-array builder, minus-sign figure style, per-format caps.
- **FE:** 3-state sort (the first Parts Credits click sends `descending=true`, R-D33); the Phase 4 opt-in props set and unset (clear-button label, over-max message); the `none` URL parameter (reload, switch report, Back with "Sales Type: None"); formatters (U+2212, `—`, `-0`); level model; recursive drill rows (loading, 30 + sentinel, page 2, error row + Try again with no toast, `q-virtual-scroll--with-prev` on every nested row); credit number link vs plain text (RPT-S2-R3: PDF in a new tab for the signed-in location with invoice view, plain text otherwise); filter flags on and off; report body (chips, URL, empty states, column memory: a hidden column survives a remount and a stored sort is never applied, R-D25; downloads); nav order and filter carry.

### Integration tests
- Functional fetch tests per query repository with a tenant-isolation case and an out-of-scope-location case.
- **Tie-out tests (SBC only, R-D20):** for seeded invoices (plain, fixed total, part-line discount, a fee on a single part, core, environmental charge, Part Sale, void, credits with part lines), assert the Totals' Parts Invoiced = SBC's `parts_invoiced` and the Totals' Parts Margin = Σ(`parts_sell − parts_cost`) (so Parts Cost = Σ`invoice.parts_cost`), for default filters, each Sales Type, a location subset and a customer subset; and Sales by Category's Totals = Sales by Tier's. No test compares with the Sales report.
- **Attribution (R-D26):** a core, an environmental charge and a fee and a discount on a single part land in the part's Priced By row and category; a whole work order fee or discount is in no row.
- **Credits left out (R-D21, R-D36):** a goodwill credit with no lines applied to an invoice, an overpayment credit, a carried-over discount credit and a line naming no part line on a part credit never appear in either report, and the Totals' Parts Credits exclude them.
- **Credits (R-D21, R-D19):** a part-line credit counts on its own date, applied or not, at the line's amount after the restocking fee, before tax, in the credited line's row and category, under the credit's customer and location; a void credit and a vendor credit never show; a credit on a line whose invoice was reversed reads the line's own recorded pricing.
- Export tests at and over each cap; malformed input (bad keys, foreign ids, >366 days).
- **Backfill (Phase 2):** idempotency and resume; a pre-release fixed line total spanning two categories lands in Before tiers with shares equal to the TP routine's output, leftover cent on a quantity-1 part (or labor when none) (R-D22); pre-release cores, environmental charges and part-line adjustments carry the part's category and Before tiers (R-D26); audit output.

### Manual testing checklist
1. Same filters on Sales by Customer and Sales by Tier → Parts Invoiced and Parts Margin identical to the cent (the matching Parts Margin proves Parts Cost).
2. A goodwill credit (no part lines) applied to an invoice → in neither report; a Part Sale return in the same range → counts on the date the credit was created.
3. A Part Sale return not yet applied → counts on the date the credit was created.
4. A one-year range at the largest client opens, drills and downloads no slower than Sales by Customer (record timings).

## 8. Rollback Plan
- The PR adds an index and read-only endpoints; the backfill only inserts `invoice_part_line` rows (the parent PR's table). Rolling back the code leaves the rows unused; rolling back the parent cascades nothing here. No column is removed or renamed.

## 9. Performance & Security Considerations

### Performance
- **Bar (NFR-R2, R-D35):** "no slower than Sales by Customer", with no allowance: each new statement's median of 5 warm runs ≤ SBC's median for the same client and range on the same replica. **Phase 0, the first implementation task, before any code:** record SBC's baseline (DataDog APM for the SBC routes, last 30 days, largest client, ranges ≥ 360 days; then a controlled run on the prod replica with `EXPLAIN ANALYZE`, median of 5 warm runs per statement). Phase 13 measures the new statements the same way on the same replica and records both.
- **Query shapes:** L1 and Totals drive from `invoice` on `inv__work_place_id_created_on_idx` (as SBC), then index-only probes on the covering `invoice_part_line` index (~4 rows per invoice), ≤ 25 groups (Tier) or ≤ 270 (Category). Credits via `cm__workplace_id_date_created_idx`, `cmli__credit_memo_id_idx`, `ipl__work_order_part_id_idx` — about 1,000 credit lines a year fleet-wide. Pin `JOIN_ORDER(i, ipl)` only if EXPLAIN drifts. A Default-row drill-down scans the whole window (≈ L1 cost); add the second index only if it misses the bar.
- **Reader:** every endpoint `#[ReadReplica]` (added to `ReportFetchersReadReplicaTest`); read-only, so no refetch-after-mutation concern. Backfill writes on the writer, in batches with sleeps; the audit reads the replica.
- **Exports:** counted before fetching (cap first), plain arrays for CSV, PDF ≤ 2,000 rows.

### Security
- `ROLE_REPORT_VIEW` on every endpoint; cost and margin visible to all report users by Product decision (RPT key decisions, TP-S16-R7) — noted in the PR.
- Scope from `AccessibleWorkplaceResolver`; explicit inaccessible locations refused ("Unknown location", RPT-S3-R2); every key and id validated before the query; document links only for the signed-in location and permitted users (FE gating as SBC). A credit's PDF link (RPT-S2-R3, page 20) also needs invoice view; the existing PDF endpoint enforces `ROLE_INVOICE_VIEW` and its own client scoping server-side, so the FE gate is a convenience, not the control.
- CSV-injection guard on every text cell; numeric columns masked safe.
- Fleet-wide CLIs: Golden Rule sign-off (R-D17).

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| RPT-S1-R1 | Phase 13 | App | Appendix B §P5–P6 / A §P8 | Planned |
| RPT-S1-R2 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-R2 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-R2 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-R2 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-R3 | Phase 6 | API | Appendix A §P4 | Planned — page 21: cores, environmental charges and single-part fees and discounts are in the part's row and category (R-D26); no credits row (R-D36) |
| RPT-S1-R3 | Phase 7 | API | Appendix A §P5 | Planned — page 21: cores, environmental charges and single-part fees and discounts are in the part's row and category (R-D26); no credits row (R-D36) |
| RPT-S1-R3 | Phase 9 | App | Appendix B §P2 | Planned — page 21: cores, environmental charges and single-part fees and discounts are in the part's row and category (R-D26); no credits row (R-D36) |
| RPT-S1-R3 | Phase 11 | App | Appendix B §P4 | Planned — page 21: cores, environmental charges and single-part fees and discounts are in the part's row and category (R-D26); no credits row (R-D36) |
| RPT-S1-R3 | Phase 2 | API | Appendix A §P2 | Planned — page 21: cores, environmental charges and single-part fees and discounts are in the part's row and category (R-D26); no credits row (R-D36) |
| RPT-S1-R6 | Phase 6 | API | Appendix A §P4 | Planned — page 18: Parts Cost = the cost SBC stores with each invoice, Σ`invoice.parts_cost` (R-D20) |
| RPT-S1-R6 | Phase 7 | API | Appendix A §P5 | Planned — page 18: Parts Cost = the cost SBC stores with each invoice, Σ`invoice.parts_cost` (R-D20) |
| RPT-S1-R6 | Phase 9 | App | Appendix B §P2 | Planned — page 18: Parts Cost = the cost SBC stores with each invoice, Σ`invoice.parts_cost` (R-D20) |
| RPT-S1-R6 | Phase 11 | App | Appendix B §P4 | Planned — page 18: Parts Cost = the cost SBC stores with each invoice, Σ`invoice.parts_cost` (R-D20) |
| RPT-S1-R7 | Phase 2 | API | Appendix A §P2 | Planned — page 18: Parts Invoiced = SBC's, Parts Cost = Σ`invoice.parts_cost`, Parts Net = Parts Invoiced + credits; no Sales-report tie (R-D20) |
| RPT-S1-R7 | Phase 6 | API | Appendix A §P4 | Planned — page 18: Parts Invoiced = SBC's, Parts Cost = Σ`invoice.parts_cost`, Parts Net = Parts Invoiced + credits; no Sales-report tie (R-D20) |
| RPT-S1-R7 | Phase 11 | App | Appendix B §P4 | Planned — page 18: Parts Invoiced = SBC's, Parts Cost = Σ`invoice.parts_cost`, Parts Net = Parts Invoiced + credits; no Sales-report tie (R-D20) |
| RPT-S1-R8 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-R8 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-R8 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-R8 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-R9 | Phase 6 | API | Appendix A §P4 | Planned — page 18: whole work order and Part Sale fees out; a fee on a single part follows the part (R-D26) |
| RPT-S1-R9 | Phase 7 | API | Appendix A §P5 | Planned — page 18: whole work order and Part Sale fees out; a fee on a single part follows the part (R-D26) |
| RPT-S1-R9 | Phase 9 | App | Appendix B §P2 | Planned — page 18: whole work order and Part Sale fees out; a fee on a single part follows the part (R-D26) |
| RPT-S1-R9 | Phase 11 | App | Appendix B §P4 | Planned — page 18: whole work order and Part Sale fees out; a fee on a single part follows the part (R-D26) |
| RPT-S1-R9 | Phase 2 | API | Appendix A §P2 | Planned — page 18: whole work order and Part Sale fees out; a fee on a single part follows the part (R-D26) |
| RPT-S1-R10 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-R10 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-R10 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-R10 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-R11 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-R11 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-R11 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-R11 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-R12 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-R12 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-R12 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-R12 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-R12 | Phase 10 | App | Appendix B §P3 | Planned — 30 per page with a sentinel row at every drill level |
| RPT-S1-R13 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-R13 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-R13 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-R13 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-R14 | Phase 9 | App | Appendix B §P2 | Planned — page 18: only the column choice is remembered; the sort never is (R-D25) |
| RPT-S1-R14 | Phase 11 | App | Appendix B §P4 | Planned — page 18: only the column choice is remembered; the sort never is (R-D25) |
| RPT-S1-R14 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned — downloads follow the columns shown (`columns`, R-D28) |
| RPT-S1-R14 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned — downloads follow the columns shown (`columns`, R-D28) |
| RPT-S1-N1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-N1 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-N1 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-N1 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-N2 | Phase 13 | App | Appendix B §P5–P6 / A §P8 | Planned |
| RPT-S1-E1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-E1 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-E1 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-E1 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-E2 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-E2 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-E2 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-E2 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-E4 | Phase 6 | API | Appendix A §P4 | Planned — page 18: pre-release fixed line totals are in Before tiers (R-D22) |
| RPT-S1-E4 | Phase 7 | API | Appendix A §P5 | Planned — page 18: pre-release fixed line totals are in Before tiers (R-D22) |
| RPT-S1-E4 | Phase 9 | App | Appendix B §P2 | Planned — page 18: pre-release fixed line totals are in Before tiers (R-D22) |
| RPT-S1-E4 | Phase 11 | App | Appendix B §P4 | Planned — page 18: pre-release fixed line totals are in Before tiers (R-D22) |
| RPT-S1-E4 | Phase 2 | API | Appendix A §P2 | Planned — page 18: pre-release fixed line totals are in Before tiers (R-D22) |
| RPT-S1-E5 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-E5 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-E5 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-E5 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-E6 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-E6 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-E6 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-E6 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-E6 | Phase 2 | API | Appendix A §P2 | Planned — backfilled line adjustments only from a fully identified frozen `adjustments_snapshot`, as SBC (R-D9) |
| RPT-S1-E7 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-E7 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-E7 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-E7 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-E8 | Phase 6 | API | Appendix A §P4 | Planned — page 21: only credit lines naming a part line count, on the credit's date, applied or not, under the credit's customer and location; line-less credits and unnamed lines out (R-D21, R-D19, R-D36) |
| RPT-S1-E8 | Phase 7 | API | Appendix A §P5 | Planned — page 21: only credit lines naming a part line count, on the credit's date, applied or not, under the credit's customer and location; line-less credits and unnamed lines out (R-D21, R-D19, R-D36) |
| RPT-S1-E8 | Phase 9 | App | Appendix B §P2 | Planned — page 21: only credit lines naming a part line count, on the credit's date, applied or not, under the credit's customer and location; line-less credits and unnamed lines out (R-D21, R-D19, R-D36) |
| RPT-S1-E8 | Phase 11 | App | Appendix B §P4 | Planned — page 21: only credit lines naming a part line count, on the credit's date, applied or not, under the credit's customer and location; line-less credits and unnamed lines out (R-D21, R-D19, R-D36) |
| RPT-S1-E9 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S1-E9 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S1-E9 | Phase 9 | App | Appendix B §P2 | Planned |
| RPT-S1-E9 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S1-EH1 | Phase 11 | App | Appendix B §P4 | Planned — the SBC report error state, filters kept; no false empty state |
| RPT-S2-R1 | Phase 10 | App | Appendix B §P3 | Planned |
| RPT-S2-R1 | Phase 11 | App | Appendix B §P4 | Planned — level-0 rows open closed; a filter or sort change closes them |
| RPT-S2-R2 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S2-R2 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S2-R2 | Phase 10 | App | Appendix B §P3 | Planned |
| RPT-S2-R3 | Phase 6 | API | Appendix A §P4 | Planned — page 20: a credit opens its PDF in a new tab; plain text without access or for another location (R-D27) |
| RPT-S2-R3 | Phase 7 | API | Appendix A §P5 | Planned — page 20: a credit opens its PDF in a new tab; plain text without access or for another location (R-D27) |
| RPT-S2-R3 | Phase 10 | App | Appendix B §P3 | Planned — page 20: a credit opens its PDF in a new tab; plain text without access or for another location (R-D27); the date beside the number, oldest first (R-D29) |
| RPT-S2-R4 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S2-R4 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S2-R4 | Phase 10 | App | Appendix B §P3 | Planned |
| RPT-S2-R5 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S2-R5 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S2-R5 | Phase 10 | App | Appendix B §P3 | Planned |
| RPT-S2-N1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S2-N1 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S2-N1 | Phase 10 | App | Appendix B §P3 | Planned |
| RPT-S2-E1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S2-E1 | Phase 7 | API | Appendix A §P5 | Planned |
| RPT-S2-E1 | Phase 10 | App | Appendix B §P3 | Planned |
| RPT-S2-EH1 | Phase 10 | App | Appendix B §P3 | Planned — in-row "Ooooops! An error occurred" + Try again; drill toasts silenced and captured to Sentry (R-D15) |
| RPT-S3-R1 | Phase 5 | API | Appendix A §P3 | Planned — page 18: the shared 50-value cap is kept; nothing to build (R-D24) |
| RPT-S3-R1 | Phase 6 | API | Appendix A §P4 | Planned — page 18: the shared 50-value cap is kept; nothing to build (R-D24) |
| RPT-S3-R1 | Phase 4 | App | Appendix B §P1 | Planned — page 18: the shared 50-value cap is kept (R-D24); "Choose a date range of one year or less." through the Phase 4 opt-in message, set in Phase 11 |
| RPT-S3-R1 | Phase 11 | App | Appendix B §P4 | Planned — page 18: the shared 50-value cap is kept (R-D24); "Choose a date range of one year or less." through the Phase 4 opt-in message, set in Phase 11 |
| RPT-S3-R3 | Phase 5 | API | Appendix A §P3 | Planned — page 21: options are the tiers, Fixed price, Fixed line total, Manual and Before tiers (R-D36) |
| RPT-S3-R3 | Phase 6 | API | Appendix A §P4 | Planned — page 21: options are the tiers, Fixed price, Fixed line total, Manual and Before tiers (R-D36) |
| RPT-S3-R3 | Phase 4 | App | Appendix B §P1 | Planned — page 21: options are the tiers, Fixed price, Fixed line total, Manual and Before tiers (R-D36) |
| RPT-S3-R3 | Phase 11 | App | Appendix B §P4 | Planned — page 21: options are the tiers, Fixed price, Fixed line total, Manual and Before tiers (R-D36) |
| RPT-S3-R9 | Phase 5 | API | Appendix A §P3 | Planned — page 21: no credits row, so no Category special case (R-D23 withdrawn) |
| RPT-S3-R9 | Phase 6 | API | Appendix A §P4 | Planned — page 21: no credits row, so no Category special case (R-D23 withdrawn) |
| RPT-S3-R9 | Phase 4 | App | Appendix B §P1 | Planned — page 21: no credits row, so no Category special case (R-D23 withdrawn) |
| RPT-S3-R9 | Phase 11 | App | Appendix B §P4 | Planned — page 21: no credits row, so no Category special case (R-D23 withdrawn) |
| RPT-S3-R4 | Phase 5 | API | Appendix A §P3 | Planned |
| RPT-S3-R4 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S3-R4 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-R4 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S3-R5 | Phase 5 | API | Appendix A §P3 | Planned |
| RPT-S3-R5 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S3-R5 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-R5 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S3-R2 | Phase 5 | API | Appendix A §P3 | Planned |
| RPT-S3-R2 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S3-R2 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-R2 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S3-R10 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-R10 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S3-R12 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-R12 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S3-R6 | Phase 11 | App | Appendix B §P4 | Planned — "None" kept in the URL through the report-owned `none` parameter; reload and Back tested (R-D16) |
| RPT-S3-R11 | Phase 13 | App | Appendix B §P5–P6 / A §P8 | Planned — the nav link also carries the `none` parameter; switching with "Sales Type: None" tested (R-D16) |
| RPT-S3-R7 | Phase 5 | API | Appendix A §P3 | Planned — page 21: tier order, then Fixed price, Fixed line total, Manual and Before tiers; no credits row (R-D36) |
| RPT-S3-R7 | Phase 6 | API | Appendix A §P4 | Planned — page 21: tier order, then Fixed price, Fixed line total, Manual and Before tiers; no credits row (R-D36) |
| RPT-S3-R7 | Phase 4 | App | Appendix B §P1 | Planned — page 21: tier order, then Fixed price, Fixed line total, Manual and Before tiers; no credits row (R-D36) |
| RPT-S3-R7 | Phase 11 | App | Appendix B §P4 | Planned — page 21: tier order, then Fixed price, Fixed line total, Manual and Before tiers; no credits row (R-D36) |
| RPT-S3-R7 | Phase 9 | App | Appendix B §P2 | Planned — third sort state returns to first-load order; page 21: no credits row (R-D36) |
| RPT-S3-R8 | Phase 5 | API | Appendix A §P3 | Planned |
| RPT-S3-R8 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S3-R8 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-R8 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S3-R8 | Phase 9 | App | Appendix B §P2 | Planned — first click descending on every number column incl. Parts Credits (R-D33) |
| RPT-S3-N1 | Phase 5 | API | Appendix A §P3 | Planned |
| RPT-S3-N1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S3-N1 | Phase 4 | App | Appendix B §P1 | Planned — "Clear All Filters" through the Phase 4 opt-in label prop, set in Phase 11 |
| RPT-S3-N1 | Phase 11 | App | Appendix B §P4 | Planned — "Clear All Filters" through the Phase 4 opt-in label prop, set in Phase 11 |
| RPT-S3-E1 | Phase 4 | App | Appendix B §P1 | Planned |
| RPT-S3-E1 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S4-R1 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R1 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R2 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R2 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R3 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R3 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R4 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R4 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R5 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R5 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-R6 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned — headers checked against SBC on 2026-11-12; only "Parts Margin %" differs, by the Key Decision (R-D31) |
| RPT-S4-R6 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned — headers checked against SBC on 2026-11-12; only "Parts Margin %" differs, by the Key Decision (R-D31) |
| RPT-S4-R7 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned — header lines and all-wording as R-D32 ("Sales Type: All / Part Sales / Work Orders / None", "Category: All categories", "Priced By: All", "Customer: All customers") |
| RPT-S4-R7 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned — header lines and all-wording as R-D32 ("Sales Type: All / Part Sales / Work Orders / None", "Category: All categories", "Priced By: All", "Customer: All customers") |
| RPT-S4-N1 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-N1 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-N2 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-N2 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-E1 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-E1 | Phase 12 | App | Appendix A §P7 / B §P4 | Planned |
| RPT-S4-EH1 | Phase 12 | App | Appendix B §P4 | Planned — the failure toast "Ooooops! An error occurred" / "Contact support for more information" |
| RPT-S5-R1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-R1 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-R1 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-R2 | Phase 6 | API | Appendix A §P4 | Planned — page 21: category → Priced By → customers → invoices and credits; no credits row (R-D36) |
| RPT-S5-R2 | Phase 8 | API | Appendix A §P6 | Planned — page 21: category → Priced By → customers → invoices and credits; no credits row (R-D36) |
| RPT-S5-R2 | Phase 11 | App | Appendix B §P4 | Planned — page 21: category → Priced By → customers → invoices and credits; no credits row (R-D36) |
| RPT-S5-R2 | Phase 10 | App | Appendix B §P3 | Planned — page 21: category → Priced By → customers → invoices and credits; no credits row (R-D36) |
| RPT-S5-R3 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-R3 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-R3 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-R4 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-R4 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-R4 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-R5 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-R5 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-R5 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-R6 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-R6 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-R6 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-R6 | Phase 10 | App | Appendix B §P3 | Planned — Priced By rows inside a category in RPT-S3-R7 order |
| RPT-S5-N1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-N1 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-N1 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-E1 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-E1 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-E1 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-E2 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-E2 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-E2 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-E3 | Phase 6 | API | Appendix A §P4 | Planned — page 18: leftover cent placed per TP-S10-R13; pre-release lines split by the same routine (R-D22) |
| RPT-S5-E3 | Phase 8 | API | Appendix A §P6 | Planned — page 18: leftover cent placed per TP-S10-R13; pre-release lines split by the same routine (R-D22) |
| RPT-S5-E3 | Phase 11 | App | Appendix B §P4 | Planned — page 18: leftover cent placed per TP-S10-R13; pre-release lines split by the same routine (R-D22) |
| RPT-S5-E3 | Phase 2 | API | Appendix A §P2 | Planned — page 18: leftover cent placed per TP-S10-R13; pre-release lines split by the same routine (R-D22) |
| RPT-S5-E4 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-E4 | Phase 8 | API | Appendix A §P6 | Planned |
| RPT-S5-E4 | Phase 11 | App | Appendix B §P4 | Planned |
| RPT-S5-E5 | Phase 2 | API | Appendix A §P2 | Planned |
| RPT-S5-E5 | Phase 6 | API | Appendix A §P4 | Planned |
| RPT-S5-EH1 | Phase 11 | App | Appendix B §P4 | Planned — the SBC report error state, filters kept |
| RPT-UF1 | Phase 11 | App | Appendix B §P4 | Planned — "There are no results for selected date range" |
| RPT-UF2 | Phase 4 | App | Appendix B §P1 | Planned — opt-in clear-button label prop |
| RPT-UF2 | Phase 11 | App | Appendix B §P4 | Planned — "No record matches these filters" / "Try changing filters to widen your results." / "Clear All Filters" |
| RPT-UF3 | Phase 5 | API | Appendix A §P3 | Planned — "Unknown location" from `ValidReportScope` |
| RPT-UF4 | Phase 12 | API | Appendix A §P7 | Planned — per-format caps, the PRD message (R-D14) |
| RPT-UF4 | Phase 12 | App | Appendix B §P4 | Planned — the 4xx message shown, no file |
| RPT-UF5 | Phase 12 | App | Appendix B §P4 | Planned — "Empty export" notice, no file |
| RPT-UF6 | Phase 10 | App | Appendix B §P3 | Planned — in-row error with Try again |
| RPT-UF6 | Phase 11 | App | Appendix B §P4 | Planned — the report error state |
| RPT-UF6 | Phase 12 | App | Appendix B §P4 | Planned — the download error toast |
| NFR-R1 | Phase 1 | API | Appendix A §P1 | Planned |
| NFR-R1 | Phase 6 | API | Appendix A §P4 | Planned |
| NFR-R2 | Phase 0 | API | Section 9 | Planned — SBC baseline recorded first, before any code (R-D35) |
| NFR-R2 | Phase 13 | API | Appendix B §P5–P6 / A §P8 | Planned |
| NFR-R3 | Phase 2 | API | Appendix A §P2 | Planned |
| NFR-R3 | Phase 6 | API | Appendix A §P4 | Planned |
| NFR-R4 | Phase 2 | API | Appendix A §P2 | Planned |
| NFR-R5 | Phase 12 | API | Appendix A §P7 / B §P4 | Planned |
| NFR-R6 | Phase 5 | API | Appendix A §P3 | Planned |
| NFR-R6 | Phase 6 | API | Appendix A §P4 | Planned |

## 11. Verification Tickets

Created 2026-11-13 under epic SV-11692, all assigned to Stefan Vukovic (Product Area: Parts, label `tiered-pricing`), each linked to its stories with "Relates". Each ticket's description lists the requirement IDs it covers and its verification checklist. Phases with nothing to check on their own are folded into the phase that makes them visible: Phase 0 into the Phases 0–1 ticket, Phase 3 into the Phases 3 and 11 ticket, Phase 5 into the Phases 5 and 7 ticket. The Phase 2 and Phase 6 tickets also link Tiered Pricing Story 10 (SV-11699), whose part-line snapshot they check.

| Ticket | Phase(s) | Summary | Linked stories |
|---|---|---|---|
| [SV-12745](https://shopview.atlassian.net/browse/SV-12745) | 0–1 | Verify: Sales by Customer speed baseline recorded and the report index in place (Phases 0–1) | SV-11718 |
| [SV-12746](https://shopview.atlassian.net/browse/SV-12746) | 2 | Verify: part-line backfill, tie-out audit and the signed-off list of invoices that don't add up (Phase 2) | SV-11718, SV-11699 |
| [SV-12747](https://shopview.atlassian.net/browse/SV-12747) | 4 | Verify: shared filter chips gain opt-in All labels, plain-when-all, search focus and new messages (Phase 4) | SV-11718 |
| [SV-12748](https://shopview.atlassian.net/browse/SV-12748) | 6 | Verify: the numbers: row membership, credit rules and Totals tying to Sales by Customer to the cent (Phase 6) | SV-11718, SV-11699 |
| [SV-12749](https://shopview.atlassian.net/browse/SV-12749) | 5 and 7 | Verify: Sales by Tier endpoints, filter validation, drill keys, permissions and paging (Phases 5 and 7) | SV-11718 |
| [SV-12750](https://shopview.atlassian.net/browse/SV-12750) | 8 | Verify: Sales by Category endpoints, its four levels and part-line credits by category (Phase 8) | SV-11718 |
| [SV-12751](https://shopview.atlassian.net/browse/SV-12751) | 9 | Verify: report labels, minus signs, dates and the three-click sort (Phase 9) | SV-11718 |
| [SV-12752](https://shopview.atlassian.net/browse/SV-12752) | 10 | Verify: drilling rows to customers and documents, paging, document links and in-row errors (Phase 10) | SV-11718 |
| [SV-12753](https://shopview.atlassian.net/browse/SV-12753) | 3 and 11 | Verify: the report page: filters, page address, Totals, column chooser, empty and error states (Phases 3 and 11) | SV-11718 |
| [SV-12754](https://shopview.atlassian.net/browse/SV-12754) | 12 | Verify: the four downloads, their caps, header lines and column headers (Phase 12) | SV-11718 |
| [SV-12755](https://shopview.atlassian.net/browse/SV-12755) | 13 | Verify: Reports › Parts entries, filters carried between the reports, access and the speed bar (Phase 13) | SV-11718 |

When all these tickets are marked Done, the feature is ready for QA.

---

## Appendix A — Backend design (be-planner, 2026-11-11)

> **Pages 18 and 20 (Product rounds 1 and 2 answered 2026-11-11): Sections 3, 5 and 6 supersede this appendix for every answered item.** RQ1 is option A only (R-D20): drop the RQ1-B `--compare-sales-report` mode, point 4's Sales-report concern and A12. RQ2 is the proposal, with the exclusions in both credit branches and no `UnlinkedCreditBasis` switch (R-D21). RQ3 is Before tiers with no `on_fixed_line_total` CASE or index column, and the pre-release split comes from the TP routine (R-D22). RQ6 is R-D23; RQ7 and RQ8 need nothing here (R-D24, R-D25). RQ9 is option A, owned by the TP builder, so this branch adds no RQ9 builder change, and option B (`row_kind` rows) is rejected (R-D26). Round 2, answered as proposed on page 20 (R-D27), changes A1's customer to the invoice's and A3's reversed applications from "dropped" to a positive reversal row on the reversal date, and confirms A2's proportional split (RD12); A4 → R-D19 (RQ14 dropped). Its endpoint table and request names yield to Section 5's wire contract (R-D28). After the 2026-11-12 audit: "Getting the results to the PM" (PR description, Jira sub-task) is replaced by Appendix C (R-D34); the ±10% allowance in Performance step 3 is dropped (R-D35); the overpayment test `origin_payment_id IS NULL` is moot (R-D21); the FIXED_LINE_TOTAL amount is stated in R-D30. PRD v21 (2026-11-13): branch U, `UnlinkedCreditBasis`, RD12 (the proportional split), A1–A3, the `unlinkedCredits` kind and key, the RQ6 seam `hidesUnlinkedCredits()` and the round-2 changes to A1 and A3 are withdrawn; only credit lines naming a part line count (R-D21, R-D23, R-D36).

> **Sections 3, 5 and 9 win on any conflict.** Paths gain a `/drill/` segment and the combined `filter-options` endpoint (Section 5); RD14 (reuse SBC's customer search) is overridden by R-D13; RD1–RD13, RD15–RD17 map to R-D1–R-D14; RD18 → R-D17. Its "Product-visible ambiguities": A1–A4 → round 2 (RQ11–RQ14), A5/A6/A9/A10/A13 → R-D16, A7 → "Multiple" (R-D16), A8 → design 20.5 label, A11 → R-D13, A12 → RQ1, A14 → R-D18.

#### Sales by Tier and Sales by Category: backend (`api/`) implementation plan

This is a read-only plan. I edited nothing. "Verified" means I read the code on `develop` today. The Tiered Pricing (TP) branch does not exist yet, so anything about its classes is taken from `docs/tech-plans/2026-11-11-tiered-pricing.md`. PRD ids are written `RPT-Sx-…` and TP ids `TP-Sx-…`.

##### Six things to settle before building

1. **Naming departs from your brief.** `api/.claude/reference/database.md` (rule 3) and the naming checker forbid new `*Fetcher` read classes. The new read classes are `*QueryRepositoryInterface` / `Dbal*QueryRepository`. The `DbalSalesByCustomerFetcher` layout is legacy naming, not precedent.
2. **The backfill must never call `InvoiceFinancialSnapshotService::capture()`.** That method rewrites `invoice.parts_sell`, `parts_cost` and the other snapshot columns from today's work order state, which would change Sales by Customer's history. The backfill writes `invoice_part_line` rows only.
3. **A credit cannot be traced to an invoice when one payment uses several credits on several invoices.** `CreatePaymentCommandHandler.php:1120-1190` applies the credits one after another into a pool. It then spreads that pool over the invoices as `customer_payment_statement` rows with `source='credit'`, so no per-credit, per-invoice split is stored. RQ2's "amount applied to that invoice" needs a split rule (RD12, ambiguity A2).
4. **The Sales report's Parts Cost already nets out returned parts' cost on credit rows** (`DbalSalesReportDataFetcher::fetchCreditPartCosts()`). It also counts each work order's cost once, on its newest invoice, and covers only the active location. So "Parts Cost equals the Sales report's" (RQ1 branch B) cannot hold to the cent by construction.
5. **`WorkplaceDecoratorInterface` has no `runAs()`.** Only the concrete class has it. So the fleet loop lives in the CLI, nested exactly like `ResyncVendorBillCommand.php:126-129`, and calls an Application service once per scope.
6. **Product's 50-value filter cap and "select all = parameter absent" decide what "Category is narrowed" means.** With `MAX_TOTAL_SELECTED_FILTER_VALUES` in `app/src/components/ts/shared/filters/Model.ts:346` and `emptyMeansAll`, a sent category list always means narrowed, which matches RQ6 for free. The backend still treats a list that covers every category as "all", to be safe.

---

#### Goal

Two new read-only reports, Sales by Tier and Sales by Category, built from the TP snapshot table `invoice_part_line` plus customer credit memos.
- Totals tie to Sales by Customer (SBC) by construction.
- Lists are paginated 30 per level, sorted on the server, and read from the replica.
- Each report has Summary and Expanded downloads, as PDF and CSV.
- The PR also adds a historical snapshot backfill CLI and a read-only tie-out audit CLI, which produces the RPT-S1-R7 list.

#### Affected bounded contexts

| Context | Owns in this PR |
|---|---|
| `Reporting` (Reports, Shared) | The shared query engine, the two reports' endpoints and exports, new filter kinds, export cap per format, the minus-sign figure style |
| `Invoicing` (Invoice) | Backfill and audit CLIs, their Application services and query repositories. The snapshot table belongs to Invoicing, so its writes and audits live here, not in Reporting. |
| Read-side SQL only (TABLE_NAME constants in query repositories) | `Sales/Pricing` (`pricing_tier`), `PartsCatalogue` (`part_category`), `Customer` (`credit_memo*`, `customer_payment*`, `customer_transaction`, `customer_account`, `company`), `Organization` (`workplace`), `VehicleService` (`work_order_part{,_request}` for the credit fallback only) |

No new aggregate, no domain event, no permission work. Every report gates on `#[IsGranted(PermissionEnum::ROLE_REPORT_VIEW)]` (verified `PermissionEnum.php:171-178`, `:396`).

---

#### Existing code to reuse or extend (verified)

**Reuse as-is:**
- Request and scope:
  - `api/src/Reporting/Shared/UI/HTTP/DTO/ReportListRequestDto.php`: range, 366-day cap, `#[Pagination]`, `parseUuidList()`.
  - `api/src/Reporting/Shared/Infrastructure/Persistence/AccessibleWorkplaceResolver.php`.
  - `api/src/Reporting/Shared/Domain/NonVoidInvoicePredicate.php`, `NoCompanyKey.php`, `NoCompanyLabel.php`.
- Paging and time limit:
  - `api/src/Reporting/Shared/Infrastructure/Persistence/ReportPaginator.php`: `pageWithInlineTotal()`, `totals()`, `applyOrderBy()`, `clampPageSize()`.
  - `api/src/Reporting/Shared/Infrastructure/Persistence/ReportQueryTimeLimit.php`.
- Sales Type: `api/src/Reporting/Reports/Application/SalesByCustomer/SalesByCustomerProductType.php`. Reused directly (RD4): `all|parts|service|none`, `invoiceNumberPrefixPattern()`, `matchesNothing()`.
- Export pieces:
  - `api/src/Reporting/Shared/Application/Export/`: `CsvFormulaInjectionGuard`, `ReportExportTable`, `ReportExportCell`, `ReportExportDateRangeLine`, `ReportExportFilterSegment`, `ReportExportRangeSlug`, `ReportLocationsScopeResolverInterface`.
  - `api/src/Reporting/Shared/Infrastructure/Csv/CsvAttachmentResponseBuilder.php`.
  - `api/src/Reporting/Shared/Application/Pdf/ReportPdfRendererInterface.php`: client logo, organization and workplace header.
  - `App\Shared\Application\WorkplaceTimezone`.
  - `api/src/Shared/Domain/ValueObject/ShopScopedDocumentNumber.php::composeForDocumentFamily()` for credit numbers.
- Customer filter: SBC's type-ahead endpoints `GET /api/reporting/reports/sales-by-customer/customers` and `/customers/resolve` (RD14). No new backend code.
- Fleet loops and batching:
  - `OrganizationDecorator::runAs()`, `WorkplaceDecorator::runAs()`.
  - `App\Shared\Application\Transactional`, `App\Shared\Application\IdentityMap`.
- From the TP branch:
  - `Invoicing/Invoice/Domain/InvoicePartLine` (entity, `TABLE_NAME`).
  - `Invoice::capturePartLines()`, `InvoicePartLineSnapshotBuilder`.
  - `Sales/Pricing/Domain/Model/PricingTier`.
  - The existing index `ipl__work_order_part_id_idx`.
- Constant: `CreditMemo::CARRY_CREDIT_REASON` (`'Carry credit from invoice discount floor'`, verified `CreditMemo.php:43`).

**Extend:**
- `api/src/Reporting/Shared/Application/Export/ExportRowCapGuard.php`: add an optional `int $maxRows = self::MAX_ROWS` to `assertWithinCap()`. Every other report keeps 10,000.
- `api/src/Reporting/Shared/Application/Export/ReportExportNarrowHint.php`: new case `ShorterDateRange`, whose toast reads exactly "This report is too large to export. Choose a shorter date range, then try again."
- `api/src/Reporting/Shared/Application/Export/ReportExportFigureStyle.php`: new case `DisplayMinusSign`.
- `api/src/Reporting/Shared/Application/Export/ReportExportFormatter.php`: `accountingSign()` (line 348) becomes style-aware. `DisplayMinusSign` renders `'−'` (U+2212) plus the magnitude, for example "−$12.40" and "−12.40%". I checked: no exhaustive `match` on the enum exists, and every caller tests `Spreadsheet === $style`, so the other reports are unchanged.
- Filter validation:
  - `api/src/Reporting/Shared/Application/Validator/ValidReportScope.php`: new kinds `pricingTier` and `partCategory`.
  - `api/src/Reporting/Shared/Infrastructure/Validator/ValidReportScopeValidator.php`: the new kinds delegate to a new query repository (legacy rung: delegate).
- `api/tests/Functional/Reporting/ReportFetchersReadReplicaTest.php`: add the new query repository to `readReplicaClasses()`.
- `bin/smoke-test.sh`: add `/api/reporting/reports/sales-by-tier` and `/api/reporting/reports/sales-by-category` to the curated list.
- `api/.claude/reference/database.md`, abbreviation table: add `pricing_source`→`src`, `pricing_tier(_id)`→`tier`, `part_category(_id)`→`cat`, `net_sell_cents`→`net`, `cost_cents`→`cost`.
- TP-owned, changed in this stacked branch (coordinate with the TP PR):
  - `Invoicing/Invoice/Infrastructure/Doctrine/InvoicePartLine.orm.xml`: declare the index from P1.
  - `InvoicePartLineSnapshotBuilder`: a persisted-invoice entry point (RD9) and the RQ9 parent copy.

**Do not copy:**
- `api/src/Invoicing/Invoice/Application/CLI/BackfillInvoiceFinancialColumnsCommand.php`: SQL and the EntityManager inside a command, in `Application/CLI`. That is the legacy shape.
- The `DbalSalesByCustomerFetcher` name.
- Logic inside the SBC export controller, which builds CSV rows in a coverage-excluded class.

---

#### New files

**Shared engine: `api/src/Reporting/Reports/Application/PartLineSales/`**
- `PartLineSalesQueryRepositoryInterface.php`: the port. Methods:
  - `levelPage(PartLineSalesFilter, PartLineSalesDrillPath, PaginationData): PartLineSalesPage`
  - `totals(PartLineSalesFilter): PartLineSalesFigures`
  - `countLevel(filter, drillShape): int`
  - `fetchLevelForExport(filter, drillShape, sortBy, desc): list<…>`
  - `pricedByOptions(): list<PricedByOption>`
  - `clientCategoryCount(): int`
- Filter and drill shape:
  - `PartLineSalesFilter.php`: dates, location ids, `SalesByCustomerProductType`, customers, Priced By and categories (each three-state: absent, empty, list).
    - `fromRaw(...)` holds the parsing that SBC keeps in RequestDtos. Here it is counted and unit-tested.
    - `matchesNothing()`.
    - `hidesUnlinkedCredits(int $clientCategoryCount)`: the RQ6 seam.
  - `PartLineSalesDimension.php`: enum `pricedBy|category|customer|document`.
  - `PartLineSalesDrillPath.php`: fixed parent keys plus the dimension to group by.
- Keys and labels:
  - `PricedByKind.php`: enum `tier|fixedPrice|fixedLineTotal|manual|beforeTiers|unlinkedCredits`, with `label()` and `firstLoadRank()`.
  - `PricedByKey.php`: a tier UUID or a reserved kind.
  - `PricedBySourceMap.php`: maps snapshot `pricing_source` values to `PricedByKind`. It is the RQ3 seam, and the SQL `CASE` is built from it.
  - `PricedByLabel.php`: "2 · Fleet", "Name (archived)", reserved labels. The tier number is the rank among active tiers by `position`, so Default is 1 (TP-S2-R15).
  - `CategoryKey.php`: a category UUID, `uncategorized` or `unlinkedCredits`.
- Figures: `PartLineSalesFigures.php`, built from cost, invoiced and credits in integer cents.
  - Net = invoiced + credits; margin = invoiced − cost.
  - `marginPct()`: two decimals, half away from zero; null when invoiced ≤ 0.
  - `pctOf(int $totalInvoiced)`: null when the total ≤ 0; a negative row gives a negative share.
- Rows and results: `PartLineSalesRow.php`, `PartLineSalesCustomerRow.php`, `PartLineSalesDocumentRow.php`, `PartLineSalesDocumentType.php` (`invoice|credit|creditApplication`), `PartLineSalesTotals.php`, `PartLineSalesPage.php`, `PricedByOption.php`.
- `PartLineSalesSortFields.php`: the whitelist and the first-load tie-break order per dimension.
- `PricedByOptionsQuery.php` + `PricedByOptionsQueryHandler.php`.
- Export (`PartLineSales/Export/`):
  - `PartLineSalesExportColumn.php`: headers and the optional-column rules.
  - `PartLineSalesExportVariant.php`, `PartLineSalesExportFormat.php` (`maxRows()`: PDF 2,000, CSV 50,000; `figureStyle()`; filename).
  - `PartLineSalesExportTree.php`, `PartLineSalesExportTableBuilder.php`, `PartLineSalesExportHeader.php` (the RPT-S4-R7 lines), `PartLineSalesExportResult.php`.

**Per report:**
- `api/src/Reporting/Reports/Application/SalesByTier/`:
  - `SalesByTierReportQuery` + Handler (L1 rows and totals)
  - `SalesByTierCustomersQuery` + Handler (L2)
  - `SalesByTierDocumentsQuery` + Handler (L3)
  - `Export/SalesByTierExportQuery` + `Export/SalesByTierExportQueryHandler`
- `api/src/Reporting/Reports/Application/SalesByCategory/`:
  - `SalesByCategoryReportQuery` + Handler (L1 and totals)
  - `SalesByCategoryPricedByQuery` + Handler (L2)
  - `SalesByCategoryCustomersQuery` + Handler (L3)
  - `SalesByCategoryDocumentsQuery` + Handler (L4)
  - `Export/SalesByCategoryExportQuery` + Handler

**Infrastructure: `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/`**
- `DbalPartLineSalesQueryRepository.php`: `#[ReadReplica] Connection`.
- `PartLineSalesFactsSql.php`: builds the three fact branches and binds their parameters. Kept separate so the repository doesn't become a 1,400-line class like SBC's.

**Shared reporting:**
- `api/src/Reporting/Shared/Application/Query/ReportFilterOwnershipQueryRepositoryInterface.php` + `api/src/Reporting/Shared/Infrastructure/Persistence/Query/Dbal/DbalReportFilterOwnershipQueryRepository.php`:
  - `ownedPricingTierIds(list)`
  - `ownedPartCategoryIds(list)`
  - `uncategorizedCategoryIds()`
  - `clientCategoryCount()`
  - Writer, like the existing validator.
- `api/src/Reporting/Shared/Domain/NonVoidCreditMemoPredicate.php`: lists statuses positively (`open, partially_applied, fully_consumed, closed_via_refund`), mirroring `NonVoidInvoicePredicate`.

**UI:**
- `api/src/Reporting/Reports/UI/HTTP/SalesByTier/`:
  - Controllers: `SalesByTierController`, `SalesByTierCustomersController`, `SalesByTierDocumentsController`, `SalesByTierPricedByOptionsController`, `SalesByTierExportController`.
  - `DTO/`: `SalesByTierRequestDto`, `SalesByTierCustomersRequestDto`, `SalesByTierDocumentsRequestDto`, `SalesByTierExportRequestDto`, all on `ReportListRequestDto`.
- `api/src/Reporting/Reports/UI/HTTP/SalesByCategory/`: the same set (L1, PricedBy, Customers, Documents, Export) plus DTOs.
- `api/templates/reporting/part-line-sales/export.html.twig`: one template with the title passed in, per-level row classes, and the header lines in RPT-S4-R7 order.

**Invoicing:**
- CLIs (thin):
  - `api/src/Invoicing/Invoice/UI/CLI/BackfillInvoicePartLinesCommand.php` (`app:invoicing:backfill-part-lines`)
  - `api/src/Invoicing/Invoice/UI/CLI/AuditInvoicePartLineTieOutCommand.php` (`app:invoicing:audit-part-line-tie-out`)
- `api/src/Invoicing/Invoice/Application/Service/PartLineSnapshot/`: `InvoicePartLineBackfill.php`, `InvoicePartLineBackfillReport.php`, `InvoicePartLineTieOutAudit.php`.
- `api/src/Invoicing/Invoice/Application/Query/PartLineSnapshot/`: `InvoicePartLineBackfillCandidateQueryRepositoryInterface.php`, `InvoicePartLineTieOutQueryRepositoryInterface.php`, `InvoicePartLineTieOutCheck.php` (enum), `InvoicePartLineTieOutFinding.php`.
- `api/src/Invoicing/Invoice/Infrastructure/Persistence/Query/Dbal/`: `DbalInvoicePartLineBackfillCandidateQueryRepository.php`, `DbalInvoicePartLineTieOutQueryRepository.php`.

**Migration:** one file. Create it with `bin/console doctrine:migrations:generate` after rebasing onto TP, so its version sorts after TP's M1.

---

#### Implementation order (one commit per phase)

##### P1: Schema (covering index) and naming rows
- **Covers:** RPT §6 performance bar (supports it). TP plan line 1628 leaves the covering index to this PR.
- **Files:** the migration; `InvoicePartLine.orm.xml` (index declaration); `api/.claude/reference/database.md` (abbreviation rows).
- **DDL:**

```sql
CREATE INDEX ipl__invoice_org_src_tier_cat_net_cost_idx
  ON invoice_part_line (invoice_id, organization_id, pricing_source, pricing_tier_id,
                        part_category_id, net_sell_cents, cost_cents) ALGORITHM=INPLACE, LOCK=NONE;
```

- **Rollback safety:** the table is new in this same release (TP M1). The previous release never names it, and the index is additive. The migration is idempotent with an `INFORMATION_SCHEMA` guard. There is no drop or rename, so no release-B ticket.
- **Preferred alternative:** if the TP PR hasn't merged, put this index into TP's M1 (fewer migrations; built on an empty table either way).
- **Gates:** static checks; migration gate (`doctrine:migrations:migrate`, then `doctrine:migrations:diff --allow-empty-diff` reports "No changes detected"); `bin/smoke-test.sh --warmup` then `bin/smoke-test.sh`.

##### P2: Snapshot backfill and tie-out audit (Invoicing)
- **Covers:** RPT-S1-R7 (the list), RPT-S1-E4 (engineering confirms the fixed-line-total amount), RPT-S1-E6 (older invoices follow SBC), RPT-S1-R3 (history gets Before tiers rows), RPT-S5-E5, TP D12. Detail in the section "Backfill and audit CLIs" below.
- **Builder change (TP class, in this branch):** add `InvoicePartLineSnapshotBuilder::buildForPersistedInvoice(Invoice, WorkOrderPricingDto)`.
  - It takes part-line adjustment amounts from the frozen `invoice.adjustments_snapshot`, and only when that snapshot is fully identified (the same rule as `InvoiceFinancialSnapshotService::frozenLineLevelCents()`, lines 305-343). Otherwise it attributes none, because SBC counted those discounts as whole-invoice adjustments (RD9).
  - It writes no ERROR reconciliation log.
- **Tests:**
  - Unit: `InvoicePartLineBackfill` with mocked ports — skips invoices that already have rows, one transaction per batch, `IdentityMap::clear()` after commit, a failing invoice is isolated and the rest of its batch retried, counts reported. `InvoicePartLineTieOutAudit` — classifies findings and builds CSV rows.
  - Functional: both query repositories, each with a tenant-isolation case.
  - End to end: create an invoice through the real path, delete its rows to simulate pre-release, run the service. The rows match the live ones; a second run is a no-op; `invoice.parts_sell` and `parts_cost` are unchanged.

##### P3: Filter plumbing and Application value objects
- **Covers:** RPT-S3-R1/R2/R3/R4/R5/R9, RPT-S3-N1 (filters matching nothing return zero rows and run no SQL), RPT-S1-R6, RPT-S1-R11, RPT-S1-R13 (zero margin), RPT-S3-R7/R8 rules, RQ6, RQ7 (backend defensive cap).
- **Files:** the `PartLineSales/` value objects (filter, keys, label, figures, sort fields, source map); `ValidReportScope` kinds and validator delegation; `ReportFilterOwnershipQueryRepository*`; `NonVoidCreditMemoPredicate`.
- **Validation:**
  - `pricedBy` and `rowKey`: tier UUIDs must belong to the client; reserved keys are whitelisted; anything else is a violation "Unknown priced by "x"."
  - `categories` and `categoryKey`: category UUIDs must belong to the client, or `uncategorized` / `unlinkedCredits`.
  - `customerKey`: the existing `customer` kind; the nil UUID is allowed for No Company.
  - Defensive cap of 500 ids per list, giving a 422 (SBC's resolve endpoint uses 500).
- **Tests:**
  - Unit: every `PricingSource` case maps (a new TP case without a mapping fails), labels, figure edge cases (invoiced ≤ 0, total ≤ 0, negative share), sort whitelist (`partsCredits` sorts by magnitude, `pctOfTotal` ≡ `partsInvoiced`), filter three-states, RQ6.
  - Functional: the ownership query repository with tenant isolation.

##### P4: Query engine
- **Covers:** RPT-S1-R2/R3/R8/R9/R10, RPT-S1-E1 (data side), RPT-S1-E2/E4/E5/E6/E7/E8/E9, RPT-S2-R2/R3/R4/R5, RPT-S2-E1, RPT-S5-R2/R4/R6, RPT-S5-E1/E2/E3/E4, RQ2/RQ3/RQ9 seams.
- **Files:** `DbalPartLineSalesQueryRepository.php` (`#[ReadReplica]`) and `PartLineSalesFactsSql.php`; add to `ReportFetchersReadReplicaTest::readReplicaClasses()`.
- The SQL and index use are in "Query engine SQL" below.

##### P5: Sales by Tier endpoints
- **Covers:** RPT-S1-R6/R7 (Totals tie-out), RPT-S1-R12, RPT-S1-N1, RPT-S1-N2 (403), RPT-S2-R1..R5 (API), RPT-S3-R6/R11 (the API is stateless; every filter is a query parameter), RPT-S3-N1.
- **Files:** the SalesByTier queries, handlers, controllers and DTOs; the options controller; the smoke-test entry.
- **Handlers stay thin:** call the port, then label and add `pctOfTotal` at L1 through `PartLineSalesFigures`.

##### P6: Sales by Category endpoints
- **Covers:** RPT-S5-R1..R6, RPT-S5-N1, RPT-S5-E2.
- **Files:** the SalesByCategory queries, handlers, controllers and DTOs; the smoke-test entry.

##### P7: Downloads
- **Covers:** RPT-S4-R1..R7, RPT-S4-N1, RPT-S4-E1, RPT-S1-R13 (downloads), RPT-S1-R14 (columns), RPT-S4-R4 / RPT-S1-E1 (Priced For), RPT-S3-R8 (downloads keep the screen's order).
- **Files:** the shared export changes (guard, hint, figure style, formatter), the `PartLineSales/Export/*` classes, both export controllers and DTOs, the Twig template.

##### P8: Verification record (a docs commit)
- In the reports tech plan doc, record:
  - The SBC baseline and the new reports' timings.
  - The EXPLAIN output.
  - The backfill timing.
  - The audit summary counts (RPT-S1-R7 list).
  - The S4-R6 header check.
- No code.

**Dependencies:** P1 → P2. P3 → P4 → P5 → P6 → P7. P2 is independent of P3–P7, and putting it early lets the staging run start sooner. P8 needs P2 and P5–P7 deployed to staging.

**Frontend-only requirements (not this plan):** RPT-S1-R1, the RPT-S1-R14 chooser, RPT-S2-R1, RPT-S3-R6/R10/R11/R12, RPT-S3-E1, RPT-S4-N2 (the "Empty export" notice is frontend-only today, verified `SalesByCustomerReport.vue:1133`), loading and error states, the on-screen "−$12.40" formatter, and link gating (frontend, as SBC does in `canOpenInvoice()`, `SalesByCustomerReport.vue:1045`).

---

#### Endpoints (camelCase, money in integer cents)

**Filters accepted by every endpoint and the export:**
- `range`, `startDate`, `endDate`: `this_month` by default; 366-day cap (422).
- `locations`: comma-separated UUIDs, `ValidReportScope`. A location the user can't access gets "Unknown location".
- `customers`: three-state company UUIDs.
- `salesType`: `all|parts|service|none`, mapped to `SalesByCustomerProductType`. "Part Sales" = `parts`, "Work Orders" = `service`.
- `pricedBy`: three-state; tier UUIDs and/or `fixedPrice,fixedLineTotal,manual,beforeTiers,unlinkedCredits`.
- `categories`: three-state category UUIDs.
- `pagination[page|rowsPerPage|sortBy|descending]`: the frontend sends `rowsPerPage=30`.

**Drill keys are query parameters (RD5):** `rowKey`, `categoryKey`, `customerKey`.

| Method and path | Level | Route name |
|---|---|---|
| `GET /api/reporting/reports/sales-by-tier` | L1 rows + `totals` | `reporting_reports_sales_by_tier` |
| `GET /api/reporting/reports/sales-by-tier/customers?rowKey=` | L2 | `…_customers` |
| `GET /api/reporting/reports/sales-by-tier/documents?rowKey=&customerKey=` | L3 invoices and credits | `…_documents` |
| `GET /api/reporting/reports/sales-by-tier/priced-by-options` | filter options, used by both reports | `…_priced_by_options` |
| `GET /api/reporting/reports/sales-by-tier/export?variant=summary\|expanded&format=csv\|pdf&columns=` | file | `…_export` |
| `GET /api/reporting/reports/sales-by-category` | L1 categories + `totals` | `reporting_reports_sales_by_category` |
| `GET /api/reporting/reports/sales-by-category/priced-by?categoryKey=` | L2 | `…_priced_by` |
| `GET /api/reporting/reports/sales-by-category/customers?categoryKey=&rowKey=` (`rowKey` optional, ambiguity A5) | L3 | `…_customers` |
| `GET /api/reporting/reports/sales-by-category/documents?categoryKey=&rowKey=&customerKey=` | L4 | `…_documents` |
| `GET /api/reporting/reports/sales-by-category/export?…` | file | `…_export` |

**Envelope (RD7):** the report suite's `{"data":{"collection":[…],"pagination":{"sortBy","descending","page","rowsPerPage","rowsNumber"},"totals":{…}}}`. `totals` appears at L1 only. Serialize with `handleQuery(..., context: ['useDefault' => true])` (DefaultSerializer) and camelCase properties. A controller test pins the key casing.

**Response shapes:**
- **Group row (L1, and Category L2):**
  - `rowKey` (tier UUID or reserved key), or `categoryKey`.
  - `kind`, `tierId|null`, `tierNumber|null`, `isDefault`, `isArchived`, `label` (built by `PricedByLabel`, or the current category name; "Uncategorized"; "Credits not tied to a part").
  - `location` (a name, `"Multiple"` or `""`).
  - `partsCost`, `partsInvoiced`, `partsCredits` (≤ 0), `partsNet`, `partsMargin`, `partsMarginPct|null`.
  - `pctOfTotal|null` at L1 only (RD6).
- **Totals:** the same money keys, plus `partsMarginPct` and `pctOfTotal` (100.00 or null).
- **Customer row:** `customerKey` (nil UUID = No Company), `customerName` (invoice-frozen name first, "No Company"), `location`, money keys, `partsMarginPct`.
- **Document row:**
  - `documentType` (`invoice|credit|creditApplication`), `documentId`.
  - `number`: the invoice's `COALESCE(display_number, invoice_number)`, or the shop-scoped credit number.
  - `date` (UTC ISO), `workplaceId`, `location`.
  - `workOrderId|null`, `workOrderType` (`service|parts`, from the invoice prefix).
  - `creditMemoId|null`, `customerId|null`, `appliedToInvoiceId|null`, `appliedToInvoiceNumber|null`.
  - Money keys and `partsMarginPct`.
- **Options:** `{"options":[{"key","kind","tierNumber|null","name","label","isArchived","isDefault"}…]}`, in RPT-S3-R7 order: Default, active tiers by number, archived tiers by `archived_at`, then Fixed price, Fixed line total, Manual, Before tiers, Credits not tied to a part.

**Sorting (RPT-S3-R7/R8):**
- Sort keys per level: the text column (`pricedBy` / `category` / `customer` / `number`), `date`, `location`, `partsCost`, `partsInvoiced`, `partsCredits`, `partsNet`, `partsMargin`, `partsMarginPct`, `pctOfTotal`.
- The three-state rule runs in the frontend: the third click sends no `sortBy`, which gives the first-load order.
- A requested sort is primary. The default fields are appended as tie-breaks through `ReportPaginator::applyOrderBy()`, which already does this.
  - Tier rows: `rank_group` (Default 0, active 1, archived 2, fixedPrice 3, fixedLineTotal 4, manual 5, beforeTiers 6, unlinkedCredits 7), then `position` (active), then `archived_at` (archived), then `LOWER(name)`, then the key.
  - Categories: Uncategorized 0, others 1, credits row 2; then `LOWER(name)`, then the key.
  - Customers: `LOWER(name)`, then the key.
  - Documents: first-load order is ambiguity A6 (proposal: `date DESC` like SBC), with tie-breaks `raw_number ASC`, `document_type`, `id`.
- `partsCredits` sorts by `-credits_cents`, so the frontend's "first click descending" puts the largest credit on top (RPT-S3-R8).
- `pctOfTotal` sorts by the same expression as `partsInvoiced`.

---

#### Query engine SQL (P4)

**One engine, two drill paths (RD1):** Sales by Tier = `[pricedBy, customer, document]`. Sales by Category = `[category, pricedBy, customer, document]`. Both reports' totals come from the same statement, so RPT-S5-E2 (Category Totals = Tier Totals) holds by construction.

**Fact branches**, combined with `UNION ALL` inside a derived table:
- Each branch is pre-grouped by the level's key.
- Each branch carries `cost_cents`, `invoiced_cents`, `credits_cents`, `wp_min`, `wp_max`.

**Branch S, sales facts** (drives from `invoice`, the same index as SBC; RD3):

```sql
SELECT <kind CASE from PricedBySourceMap> AS kind,
       CASE WHEN ipl.pricing_source IN ('tier','default') THEN ipl.pricing_tier_id END AS tier_id,
       ipl.part_category_id AS category_id,                         -- category paths only
       COALESCE(i.company_id, :nilBytes) AS customer_id,            -- customer levels only
       MAX(i.customer_company_name) AS customer_name,
       MIN(i.work_place_id) AS wp_min, MAX(i.work_place_id) AS wp_max,
       SUM(ipl.cost_cents) AS cost_cents, SUM(ipl.net_sell_cents) AS invoiced_cents, 0 AS credits_cents
FROM invoice i
JOIN invoice_part_line ipl ON ipl.invoice_id = i.id AND ipl.organization_id = :org
WHERE i.organization_id = :org AND i.work_place_id IN (:wps)
  AND i.created_on BETWEEN :from AND :to                 -- invoice.created_on, as SBC (RPT-S1-R2)
  AND i.status IN (:reportNonVoidInvoiceStatuses)        -- NonVoidInvoicePredicate
  [AND i.invoice_number LIKE :prefix]                    -- Sales Type = SBC's predicate (RD4)
  [AND i.company_id IN (:companies)]                     -- level key: i.company_id IS NULL for No Company
  [AND <pricedBy / rowKey predicate on ipl.pricing_source, ipl.pricing_tier_id>]
  [AND <category predicate: ipl.part_category_id IN (:cats) OR (:withUncat AND (ipl.part_category_id IS NULL
        OR ipl.part_category_id IN (:uncatIds)))>]
GROUP BY <level keys>
```

The kind `CASE` built from `PricedBySourceMap`:
- `tier` / `default` → `tier`
- `fixed_price` → `fixedPrice`
- `fixed_line_total` → `fixedLineTotal`
- `manual` → `manual`
- `NULL` → `beforeTiers`. This is the RQ3 seam: branch B adds `AND ipl.on_fixed_line_total = 1 THEN 'fixedLineTotal'`, which needs `on_fixed_line_total` in the P1 index.

**Branch C, credit lines** (RQ2 proposal: counted on the credit's date whether applied or not):
- **Base:**
  - `credit_memo cm`, filtered by `cm.organization_id = :org AND cm.workplace_id IN (:wps) AND cm.date_created BETWEEN :from AND :to AND NonVoidCreditMemoPredicate`.
  - `JOIN credit_memo_line_item cmli ON cmli.credit_memo_id = cm.id`.
  - `JOIN customer_account ca ON ca.id = cm.customer_account_id`. The customer key is `ca.customer_id`; the name comes from `LEFT JOIN company co` with the client guard.
- **Amount:** `-SUM(ROUND(cmli.quantity * cmli.sell_price) - cmli.restocking_fee)`, the same as `CreditMemoLineItem::lineSubtotal()` (pre-tax, after the restocking fee; verified lines 146-155). Cost 0, invoiced 0.
- **Attribution (RD13):** `LEFT JOIN invoice_part_line att ON att.id = (SELECT ipl2.id … WHERE ipl2.work_order_part_id = cmli.originating_invoice_line_id AND ipl2.organization_id = :org AND ipl2.row_kind <> 'core_credit' ORDER BY <non-void first>, i2.created_on DESC, ipl2.id LIMIT 1)`.
  - Uses `ipl__work_order_part_id_idx`. Volume is tiny: about 1,000 credit lines a year fleet-wide.
  - Fallback when `att` is NULL: `work_order_part` (scoped through `work_order.organization_id`) for its recorded pricing columns, and its request's `part_category_id` (ambiguity A4).
  - Sales Type and prefix come from the attributed invoice (`ai.invoice_number`); otherwise `wo.type`.
- A line with `originating_invoice_line_id IS NULL` gets kind `unlinkedCredits`.

**Branch U, credits not tied to a part** (RQ2 proposal; seam = `unlinkedCreditFacts()` with an `UnlinkedCreditBasis` constant):
- **Chain:**
  - `credit_memo_application cma` (`application_type = 'payment' AND reversed_at IS NULL AND applied_date BETWEEN :from AND :to`)
  - → `credit_memo cm`: client guard, non-void, `origin_payment_id IS NULL`, `(reason IS NULL OR reason <> :carryReason)`, `NOT EXISTS` any line item
  - → `customer_payment cp` (`status <> 'reversed'`)
  - → `customer_payment_statement cps` (`source = 'credit'`)
  - → `customer_transaction ct` (type invoice)
  - → `invoice i` (`ct.reference_id`, client guard, non-void, prefix filter)
- **Amount:** `-ROUND(cma.amount * cps.amount / payment_credit_total)`, where `payment_credit_total = SUM(cps.amount)` over the payment's `source='credit'` rows (RD12). With one credit in the payment this equals `cps.amount` exactly.
- **Location:** `i.work_place_id` (ambiguity A1). Customer: `ca.customer_id`. Kind and category key: `unlinkedCredits`.
- **Excluded whenever** `pricedBy` excludes `unlinkedCredits`, or `PartLineSalesFilter::hidesUnlinkedCredits()` is true (RQ6).
- **RQ2 branch B** (the alternative) changes only the date column to `cm.date_created` and keeps "applied as of now". The SQL above shows where.

**Level statements** (every top-level SELECT gets the `ReportQueryTimeLimit::prefix()` hint):

| Statement | Outer grouping over `(S ∪ C ∪ U) f` | Extra |
|---|---|---|
| Tier L1 page | `GROUP BY f.kind, f.tier_id`; `LEFT JOIN pricing_tier pt ON pt.id = f.tier_id AND pt.organization_id = :org` for name, position, archived_at, is_default; `LEFT JOIN workplace w ON w.id = f.wp_min AND w.organization_id = :org`; location = `CASE WHEN MIN(wp_min)=MAX(wp_max) THEN MAX(w.name) ELSE 'Multiple' END`. Wrapped as `pls` for sorting; `COUNT(*) OVER ()` through `pageWithInlineTotal()` | 2 statements (page, totals) against SBC's 3 (count, page, totals) |
| Totals | `ReportPaginator::totals()` clone: `SUM(f.cost_cents), SUM(f.invoiced_cents), SUM(f.credits_cents)` | |
| Tier L2 customers | rowKey predicate in S and C (U only when `rowKey = unlinkedCredits`); group by customer key; name = invoice-frozen first, else company name | |
| Tier L3 documents | rowKey + customerKey predicates; S grouped by `i.id`, C by `cm.id`, U by `(cm.id, i.id)` | |
| Category L1 | inner groups by `category_id`; outer `LEFT JOIN part_category pc ON pc.id = f.category_id AND pc.organization_id = :org`; folded key `CASE WHEN f.category_id IS NULL OR pc.id IS NULL OR pc.name = 'Uncategorized' THEN 'uncategorized' ELSE BIN_TO_UUID(f.category_id) END` (`PartCategory::DEFAULT_CATEGORY`); re-grouped on the folded key | |
| Category L2/L3/L4 | as Tier L1/L2/L3 with the category predicate added | |

**Joins (fan-out and scoping):**
- Every join to a tenant-owned table carries the client guard in ON. The `ReportLocationsScopeResolverInterface` RULE 1 applies: in ON, never in WHERE.
- Joins to name tables are to-one primary-key joins, so they cannot fan out and change a SUM.

---

#### Read paths: reader or writer

| Read | Choice | Reason |
|---|---|---|
| All report endpoints (L1–L4, options, both exports), via `DbalPartLineSalesQueryRepository` | **reader** (`#[ReadReplica]`, pinned in `ReportFetchersReadReplicaTest`) | Heavy, read-only, same shape as SBC, which is already on the reader. One connection per response. |
| Frontend refetch-after-mutation check | none applies | These report pages have no mutation; nothing invalidates the report keys after a save. The frontend plan must not add one. Seeing staleness after navigation (lag under ~150 ms p99) is accepted. |
| `DbalReportFilterOwnershipQueryRepository` (validator lookups) | writer | Cheap primary-key lookups, the same as the existing `ValidReportScopeValidator` Connection. |
| SBC customer type-ahead (reused) | reader, unchanged | |
| Backfill and audit CLIs | writer | CLI tasks get no `DATABASE_READ_HOST`, and the backfill writes. |

No touched heavy read stays on the writer without a reason.

---

#### Backfill and audit CLIs (P2)

##### Backfill: `app:invoicing:backfill-part-lines`

**Options:**
- `--created-before=<ISO>` (required: the TP deploy instant)
- `--organization-id`, `--workplace-id`
- `--status=non-pending|pending|all` (default `non-pending`)
- `--batch-size=200`, `--limit`, `--pause-ms=0`
- `--dry-run` (counts per organization and workplace only)

**Flow:**
1. The CLI gets organizations from `candidateQueryRepository.organizationsWithCandidates()`. That enumeration is the only unscoped step: Golden Rule sign-off (RD18).
2. For each organization, `OrganizationDecorator::runAs`, then for each candidate workplace, `WorkplaceDecorator::runAs` (shape of `ResyncVendorBillCommand.php:126-129`).
3. Inside each scope it calls `InvoicePartLineBackfill::runCurrentScope(options)`, which loops:
   - Load a keyset batch of ids (`i.id > :after ORDER BY i.id LIMIT :n`), using the candidate predicate: non-void, `created_on < :before`, `NOT EXISTS (SELECT 1 FROM invoice_part_line WHERE invoice_id = i.id)`.
   - `Transactional::begin()`.
   - For each invoice:
     - `InvoiceRepository::findById()` (client-scoped, verified `Infrastructure/Doctrine/InvoiceRepository.php:85`).
     - Re-check that it has no rows.
     - Get the pricing DTO through the same seam `InvoiceBuilder` uses (`WorkOrderPricing::forInvoiceRebuild()`, verified `InvoiceBuilder.php:199`).
     - `buildForPersistedInvoice()`, then `$invoice->capturePartLines($rows)`, then `save()`.
     - Tally Σnet against `parts_sell` and Σcost against `parts_cost`; the counts go into the report.
   - `commit()`, then `IdentityMap::clear()`, then pause.
   - On an exception: `rollBack()`, retry the batch one invoice at a time, record the failures and skip them. They then show up in the audit as "missing rows".
4. It never calls `InvoiceFinancialSnapshotService::capture()`.

**Idempotency:** guaranteed by `NOT EXISTS` together with the unique key `ipl__invoice_id_source_row_id_unq`. A rerun resumes where it stopped.

**Before tiers:** the rows carry each line's recorded pricing columns, which are NULL for anything priced before release, so they report as Before tiers. RQ3 lives in the report's mapping, not in the data.

**Race:** an old pending invoice recomputed by the live path at the same moment would hit the unique key. The default `--status=non-pending` avoids that; run pending invoices last, in a quiet window. Any invoice recomputed after deploy already has rows.

**Runtime estimate** (to measure on staging with `--limit=2000`):
- About 25 queries plus ORM hydration per invoice, so roughly 50–80 ms each.
- 308k invoices: about 4.5–7 h serial, or about 1.5–2 h across 4 one-off tasks sharded with `--organization-id`.
- About 1.2M rows: about 0.5 GB per TP's estimate, plus about 150 MB for the P1 index.
- About 1,540 commits of 200 invoices. Use `--pause-ms` if Aurora replica lag (DataDog `aws.rds.aurora_replica_lag`) rises.
- Run outside North American business hours.

##### Audit: `app:invoicing:audit-part-line-tie-out`

**Options:** `[--organization-id] [--created-from] [--created-to] [--output=<path.csv>]`. Read-only, run per client under `runAs`, keyset batches of 5,000.

**Checks** (`InvoicePartLineTieOutCheck`), on non-void invoices:

| Check | Meaning |
|---|---|
| `SELL_MISMATCH` | `COALESCE(parts_sell,0) <> Σnet` |
| `COST_MISMATCH` | `COALESCE(parts_cost,0) <> Σcost` |
| `MISSING_ROWS` | parts_sell or parts_cost is non-zero but the invoice has no rows |
| `SNAPSHOT_NULL` | `parts_sell IS NULL` while rows exist (SBC shows 0) |
| `FIXED_LINE_TOTAL` | Σ`gross_sell_cents` of the `on_fixed_line_total` rows per `work_order_line_id` ≠ `work_order_line.fixed_line_parts_price` (RPT-S1-E4 confirmation) |
| `CREDIT_LINE_UNATTRIBUTED` | a credit line names a part line that has no snapshot row (informational) |

**Core statement:**

```sql
SELECT i.id, COALESCE(i.display_number, i.invoice_number) AS number, i.created_on, i.work_place_id,
       i.parts_sell, i.parts_cost, COALESCE(SUM(ipl.net_sell_cents),0) AS net,
       COALESCE(SUM(ipl.cost_cents),0) AS cost, COUNT(ipl.id) AS rows_n
FROM invoice i
LEFT JOIN invoice_part_line ipl ON ipl.invoice_id = i.id AND ipl.organization_id = :org
WHERE i.organization_id = :org AND i.status IN (:nonVoid) AND i.id > :after
GROUP BY i.id
HAVING COALESCE(i.parts_sell,0) <> net OR COALESCE(i.parts_cost,0) <> cost OR (i.parts_sell IS NULL AND rows_n > 0)
ORDER BY i.id LIMIT :batch
```

It reads only the P1 index on the `ipl` side, so the whole fleet takes minutes.

**CSV columns:** `check, organization_id, workplace_id, invoice_id, invoice_number, created_on, expected_cents, actual_cents, delta_cents, row_count`. No customer names. The command also prints a summary: count, Σ|delta| and share of invoices per check, plus the top organizations.

**Getting the results to the PM (RPT-S1-R7):**
1. Before merge: deploy the stacked branch to staging, restored from a fresh prod dump (the staging backfill pipeline). Run the backfill, then the audit.
2. Put the summary table in the PR description and in the P8 doc.
3. Attach the per-invoice CSV to a Jira verification sub-task under SV-11718 for the owning PM and the report standard's owner to sign off. Not in the PR, because it contains client identifiers.
4. After the prod deploy, run the backfill and then the audit on prod, compare with staging, and send any new findings to the same sub-task.
5. Read-only prod checks to include with it:
   - work orders with more than one non-void invoice (the rebuild would double-count)
   - line-less credits by origin (payment, floor carry, `origin_invoice_id`, other) and by `qb_sync_pattern`, to catch deposits migrated into credits
   - payments applying two or more line-less credits to two or more invoices (A2)
   - reversed applications
   - non-void invoices with `parts_sell IS NULL`

---

#### Performance

**The bar: measuring SBC, one year, largest client** (FoxyDB per the PRD; confirm by the most invoiced part lines in 12 months).
1. **DataDog APM baseline:** routes `reporting_reports_sales_by_customer`, `…_assets`, `…_invoices`, `…_export`. Last 30 days, filtered to that client (organization tag, or `locations=` matching its workplaces) and to range at least 360 days (`range=last_12_months|this_year|last_year|custom`). Record p50, p95, max and the DB span share.
2. **Controlled run on the prod read replica** (read-only, through the bastion): SBC's L1 three statements (count, page 1 with the default sort, totals), L2 assets for the client's largest customer, and the Expanded export count and fetch. Client id, all its workplaces, 365 days, `EXPLAIN ANALYZE` plus the median of 5 warm runs.
3. **Comparison, same host:** on staging after P2, run SBC's statements and the new reports' statements for the same client and range.
   - New statements: Tier L1 page and totals; L2 for the Default row (the worst case); L3 for the largest customer; Category L1; both Expanded exports' counts and fetches.
   - Target: ratio ≤ 1.0 (±10% noise).
   - Record everything in P8.
4. **After release:** repeat step 2 on prod for the new reports. Add a DataDog dashboard comparing p95 of `reporting_reports_sales_by_tier*` and `…_category*` with SBC for 2 weeks.

**EXPLAIN reasoning:**
- **L1 and totals:**
  - Branch S: `i` range on `inv__work_place_id_created_on_idx` (IN on workplaces × range on `created_on`, the same as SBC), then primary-key lookups for status, number, company and name (as SBC), then `ipl` ref on `ipl__invoice_org_src_tier_cat_net_cost_idx` (Using index, about 4 entries per invoice), then a temporary table with at most about 25 groups for Tier or about 270 for Category.
  - Branches C and U: `cm__workplace_id_date_created_idx` / `cmli__credit_memo_id_idx` / `ipl__work_order_part_id_idx`, and `cma__workplace_id_idx` / `cma__application_type_applied_date_idx`. Hundreds of rows at most.
  - Expected cost: SBC's invoice scan plus about 12k index probes, in 2 statements against SBC's 3.
  - Pin `/*+ JOIN_ORDER(i, ipl) */` beside the time-limit hint (Parts Velocity precedent `BILLED_INVENTORY_JOIN_ORDER_HINT`) only if EXPLAIN shows the optimizer driving from TP's `ipl__work_place_id_invoice_created_on_invoice_id_idx`. That plan reads 50k random rows, because that index isn't covering.
- **Drill-downs:** the row predicate is evaluated inside the covering index. A Default-row L2 still scans the whole window, so it costs about the same as L1, more than SBC's single-customer L2. Mitigation if it misses the bar: add `ipl__wp_src_tier_inv_created_invoice_idx` on `(work_place_id, pricing_source, pricing_tier_id, invoice_created_on, invoice_id)`. That needs an `invoice_created_on`→`inv_created` row in the abbreviation table. Decide after measuring (RD3).
- **Exports:** one grouped statement per level for the count, then one per level for the fetch. SBC's Expanded runs 6 statements; Tier Expanded about 6, Category Expanded about 8 (one more level).

---

#### Decisions needed (recommendation first)

| Id | Decision | Recommendation | Alternative and cost |
|---|---|---|---|
| RD1 | Engine | One shared `PartLineSales` engine with two drill paths | Two separate query repositories: about twice the SQL and tests, and Category Totals = Tier Totals only by inspection |
| RD2 | Naming | `*QueryRepository` (the documented rule) | `*Fetcher` as briefed: a 🟠 Data-Access Shape review finding |
| RD3 | Index strategy | Drive from `invoice` (SBC's index) plus the P1 covering index. If EXPLAIN shows TP's window index unused, remove it from TP's M1 before either PR merges (an amendment, not a drop migration) | Drive from `ipl` with a covering window index: 50k invoice lookups per year |
| RD4 | Sales Type source | The invoice-number prefix through `SalesByCustomerProductType`: matches SBC by construction, and a change to SBC applies here too (the PRD's "a fix to Sales by Customer applies here too") | `ipl.sales_type`: could drift from SBC's prefix |
| RD5 | Drill keys | Query parameters (constraint-validated; the frontend can skip a level, A5) | Path segments like SBC: route regexes for reserved keys |
| RD6 | % of Total below L1 | The frontend computes it from the L1 `totals` (one statement per row opened) | The backend recomputes totals on every open: one more full-window statement per open |
| RD7 | Envelope | The report suite's `collection` / `pagination.rowsNumber` / `totals` (needed by `useReportTableQuery`) | `api-standards.md`'s `data.<resource>`: the frontend helpers would need changes |
| RD8 | Tier number | Computed in Reporting (rank among active tiers by `position`), plus a functional parity test against TP's `/api/pricing/tiers/options` | Call Sales/Pricing's port: it reads the writer, so the response would read two connections |
| RD9 | Backfill line adjustments | From the frozen `adjustments_snapshot` when fully identified; otherwise none (follows SBC, RPT-S1-E6) | Live re-resolution: can include a swept or changed adjustment the customer never paid |
| RD10 | Backfill source | Rebuilt pricing DTO, as briefed; mismatches go to the audit; measure the mismatch rate on staging first | Fall back to statement items for mismatched invoices: new mapping code, but closer to what was billed. Add only if the staging mismatch rate is material |
| RD11 | Backfill scope | Non-void invoices only (void invoices are never reported, and their work orders changed after voiding) | Include void: wasted time and wrong rows |
| RD12 | Splitting a line-less credit over several invoices in one payment | Proportional to each invoice's share of the payment's credit slices (exact when the payment has one credit) | Mimic the handler's sequential fill: fragile, never recorded. Product: A2 |
| RD13 | A part line on several invoices (voided, then reissued) | Credit attributed to the latest non-void invoice's row; fall back to the line's own pricing record | Any matching row: fan-out, double counting |
| RD14 | Customer type-ahead | Reuse SBC's endpoints | A new type-ahead over the report data: more code. Edge case: A11 |
| RD15 | CSV with 50,000 rows | The table builder emits plain string arrays for CSV, with no per-cell objects (about 750k objects would risk FPM memory) | Today's cell objects: fine at 10k, risky at 50k |
| RD16 | Per-format caps | An optional `$maxRows` on `ExportRowCapGuard` plus the new hint case | A separate guard class: duplicates the threshold logic |
| RD17 | Minus-sign display | A `ReportExportFigureStyle::DisplayMinusSign` case | A second formatter: two money renderers, which the formatter's own docblock forbids |
| RD18 | Golden Rule | Both CLIs enumerate every organization, then run each under `runAs()` (precedent D25, `AccountingReconcilePushCommand`). **Needs your sign-off and a "Golden Rule Exemptions" block in the PR** | Require `--organization-id` and have the operator script the loop: only moves the unscoped enumeration outside the code |

##### Pending Product answers: where each one plugs in

- **RQ1 (answered on page 18: A, R-D20).**
  - **A (proposal):** the tie-out tests assert Totals Parts Invoiced = SBC `parts_invoiced`, and Totals Parts Margin = SBC Σ(`parts_sell − parts_cost`), which proves Parts Cost = Σ`invoice.parts_cost`. Parts Net has no outside match.
  - **B (PRD literal):** equality with the Sales report can't hold to the cent (point 4 at the top, plus its rounded-row totals). Engineering would add an audit mode `--compare-sales-report` that writes a per-workplace, per-month gap report, not a different number.
- **RQ2 (answered on page 18: the proposal, R-D21).** Seam = `unlinkedCreditFacts()` (date column and exclusions) and credit lines counted on the credit's date. Branch B swaps `cma.applied_date` for `cm.date_created`.
- **RQ3 (answered on page 18: Before tiers, R-D22).** Seam = `PricedBySourceMap`. B needs `on_fixed_line_total` in the P1 index. The Category split uses the recorded `gross_sell_cents` shares either way (RPT-S5-E3).
- **RQ6 (answered on page 18, R-D23).** Seam = `PartLineSalesFilter::hidesUnlinkedCredits()`.
- **RQ7:** frontend only; the backend adds a defensive 500 ids per list.
- **RQ8:** frontend only.
- **RQ9 (answered on page 18: A, owned by the TP builder, R-D26).**
  - **A:** the builder writes the parent part's pricing record and category onto `core`, `core_credit` and `environmental_charge` rows. This is a TP builder change in this branch; first verify what TP writes today.
  - **B:** the row key maps `row_kind` to separate rows, and `row_kind` joins the P1 index.

##### Older code this plan touches (which approach for each)

| Class | Approach |
|---|---|
| `ValidReportScopeValidator` (SQL inside a validator) | New kinds delegate to a new query repository; the existing checks are untouched |
| `InvoiceRepository::save()` (legacy: flushes on every call and dispatches events) | Use as-is: `capturePartLines` records no events. Do not remove the flush (SV-12051) |
| `WorkOrderPricing::forInvoiceRebuild` and the work order fetcher, used across contexts by Invoicing | Reuse the exact seam `InvoiceBuilder` uses; no new kind of cross-context dependency; note for SV-12051 |
| `BackfillInvoiceFinancialColumnsCommand` | Not a template. The new CLIs are thin, in `UI/CLI/` |

---

#### Shared code being modified: what could regress

| Change | Consumers | What to re-check |
|---|---|---|
| `ExportRowCapGuard` optional cap | Every report export (PV, IV, SBC, SBR, TU, WIP) | Default 10,000 and its message unchanged (existing guard tests); one export per report still refuses at 10,001 |
| `ReportExportNarrowHint` new case | Every report's over-cap toast | `toastMessage()` match updated; the WIP/IV `FiltersOnly` wording is unchanged |
| `ReportExportFigureStyle` / `ReportExportFormatter` | All six reports' PDF and CSV | Display still shows "(-$45.00)", Spreadsheet still "-45.00" (formatter unit tests) |
| `ValidReportScope` / Validator | Every report RequestDto | `tests/Functional/Reporting/ReportScopeValidationTest.php` passes unchanged |
| TP `InvoicePartLineSnapshotBuilder` (new entry point; RQ9-A parent copy) | Live invoice create and recompute | TP's builder fixture matrix and the invoice-create functional test; RQ9-A changes TP's output, so coordinate with the TP PR |
| TP `InvoicePartLine.orm.xml` | Schema diff | `doctrine:migrations:diff` reports no changes |

---

#### Required tests

**Unit (`api/tests/Unit/...` mirrored):**
- P3 value objects: source map completeness against every `PricingSource` case; labels "2 · Fleet", "X (archived)", a renamed Default; figures (margin % two decimals half-away; null when invoiced ≤ 0; % of Total null when the total ≤ 0; a negative share); sort whitelist and tie-break order; filter three-states, `none`, RQ6.
- Export: the column set from `columns`; Parts Invoiced and the first column always present; Location only when more than one location; Priced For only in Expanded; headers word for word (RPT-S4-R6); PDF "−$12.40" and "−4.20%"; CSV "-12.40"; "Totals" label; the RPT-S4-R7 header lines and their order.
- Cap boundaries: PDF 2,000 passes and 2,001 is refused; CSV 50,000 / 50,001; the exact message.
- Formatter: the new style, plus a regression for the old ones.
- P2 Application services: backfill and audit.

**Functional query tests** (`FunctionalTestCase`, SQLite; `BIN_TO_UUID`, `CONCAT`, `IF` are registered in `tests/Support/SqliteFunctionsEventSubscriber.php`; window functions are native):
- `DbalPartLineSalesQueryRepositoryTest`, both drill paths at every level:
  - Pricing sources, including a renamed tier (one row), an archived tier and its order, Default renamed.
  - Fixed line total split across categories.
  - Uncategorized: NULL category, a category deleted then moved, folding of several Uncategorized rows.
  - Void excluded; date edges on `created_on`; location scope and "Multiple"; Sales Type prefix; customer three-state and No Company.
  - Priced By and Category filters, including the credits row hidden (RQ6).
  - Credits:
    - With lines: restocking fee subtracted; a voided credit excluded; vendor credits ignored; the line credited at its tier and category under the credit's customer and location.
    - Without lines: applied to a work order invoice and a Part Sale invoice shows under both; unapplied excluded; payment-origin and floor carry excluded; reversed application excluded.
  - A customer under two tiers; pagination of 30 with stable tie-breaks.
  - **Tenant isolation:** another client's rows, credits, tiers and categories never appear, even with a matching tier or category id.
- `DbalReportFilterOwnershipQueryRepositoryTest`, `DbalInvoicePartLineBackfillCandidateQueryRepositoryTest`, `DbalInvoicePartLineTieOutQueryRepositoryTest`: each with tenant isolation.
- `ReportFetchersReadReplicaTest`: the new entry.

**Tie-out (functional):**
- Create invoices through the real invoice-create path (a scenario helper like `tests/Support/Maintenance/InvoicedServiceScenario.php`) with a part-line discount, a fixed line total, a Part Sale and No Company.
- Assert Sales by Tier Totals `partsInvoiced` = the SBC fetcher's totals `parts_invoiced`, and Parts Margin = SBC Σ(`parts_sell − parts_cost`). Do this for: default filters, `salesType=parts`, `salesType=service`, a location subset, a customer subset.
- Assert Sales by Category Totals = Sales by Tier Totals for the same filters.

**Endpoint functional** (`tests/Functional/Reporting/Reports/UI/HTTP/{SalesByTier,SalesByCategory}/`):
- 403 without `ROLE_REPORT::VIEW` on every route.
- Malformed `rowKey`, `categoryKey`, `customerKey`, `pricedBy`, `categories` (`1`, `{id}`, a SQL probe) give 4xx, following `tests/Functional/Shared/UI/HTTP/MalformedRequestInputTest.php`.
- A foreign location gives "Unknown location"; foreign tier, category and customer ids give 422.
- A 367-day range gives 422.
- Response contract: camelCase keys, cents.
- Export: CSV leading lines, the injection guard on a customer named `=cmd`, PDF content type, the over-cap message for each format, an empty export is a header-only file.

**Not tested on their own:** controllers, RequestDtos, Query carriers, CLI commands. They hold no logic.

---

#### Definition of Done gates

| Phase | Gates |
|---|---|
| All | Scoped `php-cs-fixer`, `phpstan analyse <changed files>`, `pest <changed and mirrored tests>` |
| P1 | Migration gate plus the diff no-op; smoke test (`--warmup`, then a normal run) |
| P2 | Staging: `--dry-run` counts; timing with `--limit=2000`; full run; audit CSV and summary |
| P5–P7 | `bin/smoke-test.sh` with the two new probes; check the backend logs. Browser walk as `admin`, and as a reports-only role (costs visible, TP-S16-R7) |
| PR description | Migration rollback note (P1); "Golden Rule Exemptions" (RD18); RQ seams and their current branch; audit summary; SBC baseline and timings (P8); the S4-R6 header check (SBC has "Margin %", not "Parts Margin %"; the other shared headers match) |

---

#### Risks

1. **The tie-out depends on TP's builder reconciling.** A systematic gap (cores, partial receipts, return requests) breaks SBC equality on new invoices. TP's ERROR log `invoice_part_line_snapshot_unreconciled` plus this audit catch it. Recommend a DataDog log monitor on that event, and no release until the audit's remaining findings are signed off.
2. **Historical rebuilds drift.**
   - A work order edited after invoicing.
   - Pre-release fixed-line-total splits recomputed with TP's new D10 rounding: a cent can move between parts, or between labor and parts.
   - Swept adjustments.
   - Work orders with more than one non-void invoice.
   All of these land on the RPT-S1-R7 list, never as silent numbers.
3. **Backfill operations:** writer load, replica lag, a rare unique-key race with live recomputes of pending invoices (handled by the status ordering and per-invoice retry). Its runtime has to be measured before booking the prod window.
4. **Opening a row may miss "no slower than SBC".** A Default-row open scans the whole window; SBC's open is narrowed to one customer. The mitigation index is in RD3. If it still misses, tell Product: it's the PRD §6 bar.
5. **50,000-row CSV and 2,000-row PDF.** Memory and the FPM 30 s CPU limit. RD15; measure an export at the cap on staging.
6. **Credits read Customer-context tables at the SQL level** (application chain, payment statements). A Customer schema change can silently break attribution. At least one test should create credits and payments through the real handlers.
7. **Deposits migrated into `credit_memo`** (see `CreditMemo.php:19-24`) may look like goodwill credits not tied to a part. The DQ check in P2 sizes it.
8. **Stacking on TP.** The migration must sort after TP's M1; this PR edits TP classes (builder, mapping), so expect rebase conflicts after TP squash-merges. Agree the RQ9-A builder change with the TP PR owner.
9. **Security note, not a departure:** cost and margin go to anyone with 'Reports — Page Access' by Product decision (TP-S16-R7, RPT §4). Record it in the PR, given the masked-pricing bug history.

---

#### Product-visible ambiguities beyond RQ1–RQ9 (not decided here)

- **A1 (RPT-S1-E8):** a line-less credit applied to an invoice: which location (the credit's or the invoice's; proposal: the invoice's), and which customer when the credit's account differs from the invoice's?
- **A2 (RPT-S1-E8):** one payment applying two or more line-less credits to two or more invoices: no per-credit split is stored. Proposal: proportional (RD12).
- **A3 (RPT-S1-E8):** a credit application or payment reversed after its month: does the credit drop out of that past month (current proposal) or stay?
- **A4 (RPT-S1-E8, RPT-S1-R3):** a credit line naming a part line that has no invoice row (original invoice reversed): use the line's own pricing record and category, or "Before tiers" / Uncategorized?
- **A5 (RPT-S5-R2):** Sales by Category's "Credits not tied to a part" row: does it open straight to customers, or to a single Priced By level?
- **A6 (RPT-S2-R3, RPT-S3-R7/R8):** first-load order of invoices and credits within a customer: date newest first (as SBC) or number smallest first?
- **A7 (RPT-S4-R4, RPT-S2-R5):** Priced For on an invoice row whose lines were priced for two or more other customers ("Multiple"?), and the name to show for a deleted customer.
- **A8 (RPT-S4-R2/R6):** how a credit, and a line-less credit's application, appear under "Invoice #" in the Expanded download (credit number, and the invoice it was applied to?).
- **A9 (RPT-S4-R7):** the "all" wording for the Category, Priced By and Customer lines; and the title: "Sales by Tier", or SBC's "<Name> Report" header style?
- **A10 (RPT-S3-R8):** A–Z on Priced By: by tier name, or by the shown label ("2 · Fleet", which puts the numbered tiers before the letters)?
- **A11 (RPT-S3-R4):** reusing SBC's customer search means a customer with only a credit in the range can't be picked.
- **A12 (RPT-S1-R6/R7):** returned parts' cost: the Sales report subtracts it on credit rows; these reports don't, since a credit carries no cost. So Parts Cost differs whenever returns exist (feeds RQ1).
- **A13 (RPT-S1-R13):** confirm the "−" sign also applies to percentages ("−4.20%") on screen and in the PDF.
- **A14 (RPT-S1-R2, RPT-S1-R7):** if imported historical invoices live in `invoice` rather than their own `*_imported` tables, they have no part rows and show as mismatches; include or exclude? I only verified that imported lines live in `work_order_part_imported`.

---

#### Frontend contract (to hand the frontend planner)

The endpoint table, filters, envelope, row and option shapes and sort keys above, plus:
- The frontend computes `pctOfTotal` below L1 from the L1 `totals` (RD6).
- The third sort click sends no `sortBy`.
- `partsCredits` is sorted descending on the first click.
- Link gating stays in the frontend, using `workplaceId`, `workOrderType` and `creditMemoId`.
- Exports take `columns=` with the visible optional columns.
- The customer filter reuses SBC's `/customers` and `/customers/resolve`.

**Key paths:**
- `docs/tech-plans/2026-11-11-tiered-pricing.md`
- `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByCustomerFetcher.php`
- `api/src/Reporting/Shared/Infrastructure/Persistence/ReportPaginator.php`
- `api/src/Reporting/Shared/Application/Export/ExportRowCapGuard.php`
- `api/src/Reporting/Shared/Application/Export/ReportExportFormatter.php`
- `api/src/Reporting/Shared/Infrastructure/Validator/ValidReportScopeValidator.php`
- `api/src/Invoicing/Invoice/Application/Service/InvoiceFinancialSnapshotService.php`
- `api/src/Customer/Customers/Application/Handler/CustomerPayment/Create/CreatePaymentCommandHandler.php`
- `api/tests/Functional/Reporting/ReportFetchersReadReplicaTest.php`
- `bin/smoke-test.sh`

---

## Appendix B — Frontend design (fe-planner, 2026-11-11)

> **Pages 18 and 20 (Product rounds 1 and 2 answered 2026-11-11): Sections 3, 5 and 6 supersede this appendix for answered items.** The §5 markers for RQ1, RQ2, RQ6, RQ7, RQ8 and RQ9 are settled as built (R-D20–R-D26; the columns-only memory stays as written, R-D25). A3 is answered (page 20 RPT-S2-R3): a credit number opens the credit's PDF in a new tab, not plain text (R-D27). PRD v21 (2026-11-13) removes the credits row (the `unlinkedCredits` kind, its category-to-customer shortcut, A6) and the `creditApplication` / `creditApplicationReversal` rows: document rows are `invoice` and `credit` only, and a credit reads "Credit CM-… · <date>" and opens its PDF (R-D29, R-D36). The wire contract is Section 5's (R-D28), not §2's: drill parameters `rowKey` / `categoryKey` / `customerKey` (not `parentPricedBy` / `parentCategory` / `parentCustomer`); camelCase `sortBy` and `columns` keys (the snake_case ids stay for test ids and the column chooser); `salesType` as one value, mapped from the `salesTypes` filter; the report-scoped `filter-options/customers` endpoints, not SBC's `salesByCustomerCustomersQueryOptions`. In §3, `filter_select_all_{key}` does not render on these reports. After the 2026-11-12 audit: `firstDescendingFor('parts_credits')` returns true and the "first click ascending" tests are reversed (R-D33); "Clear All Filters" and the over-a-year message are opt-in props (Phase 4); "None" survives the URL through the report-owned `none` parameter (Phase 11), so §4's "out of scope" risk and §6 A13 are settled; documents first load oldest first and show their date beside the number (R-D29, replacing A7's newest first).

> **Sections 3, 5 and 9 win on any conflict.** Its §2 contract is superseded by Section 5: suite request DTO and `pagination[...]`, `salesType` single value (FE maps its two checkboxes), drill keys `rowKey` / `categoryKey` / `customerKey`, camelCase sort keys (test ids stay snake_case), `pctOfTotal` computed by the FE below L1 (R-D6), a report-scoped customer search (R-D13). Its §6 ambiguities: A3 → RQ10 (round 2); the rest → R-D16 (A7 resolved by R-D29: oldest first, from design 20.4).

### FE plan: Sales by Tier and Sales by Category (`app/`)

#### Goal
Add two reports under Reports › Parts: Sales by Tier (3 levels) and Sales by Category (4 levels). They are built as **one shared report body** driven by a variant config, on the Sales by Customer (SBC) mechanics: `useReportTableQuery`, `useReportFilters`/URL sync, `FilterBar`, `ColumnSelector`, `SubActionsDropDown` and Totals CSS. Three things are new:
- drill-down levels that load 30 rows at a time as you scroll;
- a 3-state server sort;
- an error row with Try again inside a failed drill-down.

Shared filter components only get changes that are off unless a filter turns them on.

All paths are under `app/`.

#### Facts verified in code (beyond the brief)
- **Permission gate.** The parent `Reports` route is gated by `getPermittedRoutesMap().Reports`, which is `permissionService.has('reportsPageAccess')` (`src/services/routingService.ts:33`). Child routes inherit it, so RPT-S1-N2 needs no work.
- **Report switching.** `Reporting.vue` renders each report in a `q-tab-panel` (no keep-alive), keyed on location. Switching reports unmounts one and mounts the other on whatever URL the nav pushed.
  - `ReportLeftMenuNav.vue` sends `:to="{ name }"` with **no query**, so filters do not carry over today.
  - QTabs route matching (`node_modules/quasar/src/components/tabs/QTabs.js:456-547`) only marks a tab with a query active when that query is contained in the current one. That is safe as long as only the *sibling* tab carries the query.
- **SBC drill-downs are unpaginated.** Levels 2 and 3 use `queryClient.fetchQuery`, fetch the whole collection, and on failure collapse the row and toast.
  - The only nested sentinel pattern is in `accounts-payable/ApAgingDetailReport.vue:118-127`: a `v-intersection.once` sentinel `q-tr` whose key changes per chunk.
  - `src/testing/intersectionObserver.ts` (`FakeIntersectionObserver`) can drive it in specs.
- **TanStack 5.102.8.** `isFetchNextPageError` is available. Client defaults (`src/lib/queryClient.ts`): `staleTime` 30s, `gcTime` 5 min, `retry: shouldRetryQuery` (one retry on 5xx or transport errors).
- **How filter chips colour today.** `FilterChip.isActive = modelValue.length > 0` (`FilterChip.vue:221`).
  - The `summaryNoun` summary reads `All <noun>` / one label / `<n> <noun>` / `emptySummaryLabel` (`:494-523`).
  - There is no way to make a chip with a full selection render plain, and no `"All"` label without a noun.
- **Search boxes don't take focus today.** Neither multi panel autofocuses its search.
  - `SelectFilterPanelHead` has an `autofocus` prop that focuses on mount.
  - The `Input` wrapper passes `autofocus` through `useAttrs` to `q-input`.
  - QMenu's focus step (`QMenu.js:207-224`) does nothing if focus is already inside the menu, so a focus-on-mount input wins.
- **Selection cap.** The 50-value cap (`MAX_TOTAL_SELECTED_FILTER_VALUES`) charges nothing for a selection equal to `defaultValue`, but the comparison is **order-sensitive**, both in the cap and in `useFilterUrlSync.mirroredValues`.
  - Consequence: on a 270-category client, untick one category, then re-tick it in a different order, and the 270-value result is counted and **refused**. Phase 1 normalises to avoid this.
- **Empty selections can't live in the URL.** `useFilterUrlSync` drops empty selections from the URL and backfills absent keys from `defaults()`. So "Sales Type: None" can't survive a reload, link or report switch through `useFilterUrlSync` alone. SBC's "No products" has the same limit today; these reports add a report-owned `none` parameter (Phase 11).
- **Toast silencing.** `boot/axios.ts silentFailEndpoints` matches on a **substring** of the URL. `TOASTS_ONLY` turns off the toast *and* the interceptor's Sentry capture, so the caller must call `captureApiError` itself (as `SalesByCustomerReport.vue:1181` does).
- **Download error copy.** The suite's shared download-failure text (`reportExportFailureMessage`) is "This report is too large to export. Narrow the date range or filters…". RPT-S4 error handling asks for "Ooooops! An error occurred" / "Contact support for more information" (the interceptor's `DEFAULTS`), so these reports need report-local copy.
- **Empty-state wording.** `FilteredTableEmptyState` already supports `title`, `body`, `filtersApplied` and `clearButtonTestId`; its button reads "Clear all filters". The text "There are no results for selected date range" exists only on `ShopBillingEfficiency.vue:10`.
- **Tier lists need pricing permissions.** The tier API in the Tiered Pricing plan (`/api/pricing/tiers*`) requires pricing/settings permissions. Report users only have `reportsPageAccess`, so Priced By options need a report-owned endpoint.
  - The pricing-source names in that plan are `'tier'|'default'|'fixedPrice'|'fixedLineTotal'|'manual'|'beforeTiers'` (TP plan line 3189). This plan reuses them.
- **The minus sign.** The PRD's "−$12.40" is U+2212 (bytes `e2 88 92`), not ASCII `-`.

---

#### 1. Phases (dependency order)

Order: **P0 ∥ P1 → P2 → P3 → P4 → P5 → P6.** P0 and P1 are independent. MSW stubs from P0 let all FE work run before the BE lands.

##### P0: API contract and data layer
**Requirements:** RPT-S1-R2..R8, S1-R12, S2-R2..R5, S3-R8, S4-R1..R3, S2 error handling, S5-R2.

| File | Change |
|---|---|
| `src/api/reporting/ReportingModel.ts` | Add the contract types in §2 (`PartsSales*`, discriminated by `rowType`, so no `as` is needed, GR#10) |
| `src/api/reporting/index.ts` | `fetchPartsSalesFilterOptions()`, `fetchPartsSalesReport(slug, params, signal)`, `fetchPartsSalesDrill(slug, level, params, signal)`, `exportPartsSalesReport(slug, params)` (blob, `LONG_REQUEST_TIMEOUT_MS`) |
| `src/api/reporting/keys.ts` | `partsSalesFilterOptions: () => [...all,'parts-sales-filter-options']`; `partsSalesDrill: (p: PartsSalesDrillKeyParams) => [...all,'parts-sales-drill',p]` (p = `{slug, level, path, filters, sortBy, descending}`). Level 0 reuses `reportTable(slug, request)` |
| `src/api/reporting/queries.ts` | `fetchPartsSalesReportPage(slug)` (a `fetchPage` delegate that maps to wire params, forwards `signal`, no `errorHandler`); `partsSalesFilterOptionsQueryOptions()`; `partsSalesDrillInfiniteQueryOptions(p)` (`infiniteQueryOptions`: `initialPageParam: 1`, `getNextPageParam: last.collection.length < 30 ? undefined : n+1`, `staleTime: Infinity` because filters and sort are in the key, so collapsing/re-expanding and virtual-scroll remounts cost nothing; the `queryFn` calls `captureApiError` then rethrows, since the endpoint is silenced) |
| `src/boot/axios.ts` | Add `TOASTS_ONLY` entries for `reporting/reports/sales-by-tier/export`, `reporting/reports/sales-by-category/export`, `reporting/reports/sales-by-tier/drill/` and `reporting/reports/sales-by-category/drill/`. The trailing `/drill/` keeps the level-0 load and the type-ahead toasting |
| `src/testing/handlers.ts` (optional) | Default empty-page stubs for the new endpoints, so the nav and `Reporting` specs don't hit unhandled requests |

**Tests:** `src/api/reporting/tests/queries.spec.ts`
- the tri-state CSV encoding;
- `locations` is always sent enumerated;
- `sortBy: ''` is passed through;
- `getNextPageParam` stops on a short page;
- the drill `queryFn` captures to Sentry and rejects.

`src/boot/tests/axios-silent-fail.spec.ts`: a drill 500 is silent; a level-0 500 still toasts.

##### P1: Shared filter primitives (opt-in flags; off means no change for the ~70 `FilterBar` and 10 `MobileFilterChipRow` consumers)
**Requirements:** RPT-S3-R12, S3-R10, S3-R5 (chip text), S3-R3 and S3-R9 ("all selected by default").

| File | Change |
|---|---|
| `src/components/ts/shared/filters/Model.ts` | New `FilterDef` fields `plainWhenAllSelected?`, `allSummaryLabel?` and `autofocusSearch?`; helpers `coversEveryOption` and `normalizeFilterSelection` (snippet in §1-key code D) |
| `FilterChip.vue` | `isActive` respects `plainWhenAllSelected`; `nounSummary` uses `allSummaryLabel`; `onClear` on a flagged def emits `defaultValue` (provisional, see ambiguity A8); passes `autofocusSearch` to the panel **only from the desktop QMenu** |
| `FilterBar.vue` | Run `normalizeFilterSelection` in both `withinCap` and `onChipUpdate`, so the cap and the URL see the canonical default |
| `MobileFilterChipRow.vue` | Same normalisation on its apply and cap path (no autofocus on mobile, to avoid popping the keyboard) |
| `FilterOptionListPanel.vue` | New prop `autofocusSearch` → `SelectFilterPanelHead :autofocus` |
| `FilterSearchListPanel.vue` | New prop `autofocusSearch` → `<Input :autofocus>` |

**Tests** (each with the flag on **and** off):
- `tests/FilterChip.spec.ts`: plain when every option is ticked; blue on a subset; `"All"` / `"None"` / one label; the clear button emits `defaultValue`.
- `tests/FilterBar.spec.ts`: a reordered full set is written as `defaultValue`; untick then re-tick on more than 50 options is accepted.
- `tests/MobileFilterChipRow.spec.ts`: same normalisation.
- `tests/FilterOptionListPanel.spec.ts`, `tests/FilterSearchListPanel.spec.ts`: the search input is `document.activeElement` after mount only when the prop is set.
- `tests/Model.spec.ts`: the helpers.

##### P2: Report model, 3-state sort, formatters
**Requirements:** RPT-S1-R6, S1-R11, S1-R13, S1-R14, S3-R7, S3-R8, S5-R2, S5-R6, S4-E1.

New folder `src/components/ts/reporting/sales-by-tier/`. It holds both reports, which share story SV-11718.
- **`Model.ts`** (component-local types, GR#4):
  - the variant configs;
  - column definitions;
  - `PARTS_SALES_SHARED_FILTER_KEYS = ['dateRange','pricedBy','categoryIds','customerIds','salesTypes','locationIds']`;
  - the level model (key code B);
  - wire mappers (`toTriStateCsv`);
  - formatters (key code E): **report-local, so the suite rule docblock in `utils/reporting.ts` stays true**;
  - `documentRoute` / `canOpenDocument`;
  - `formatPartsSalesDate` (local copy of SBC's `MMM dd yyyy` workplace-time-zone formatter).
- **`useThreeStateSort.ts`** (key code A).
- **`drillContext.ts`:** a typed `InjectionKey<PartsSalesDrillContext>` plus `provideDrillContext` / `useDrillContext`. The context carries config, settled scope, visible columns, `showLocation`, the expanded set, `toggle`, and link helpers.

**Tests:**
- `tests/useThreeStateSort.spec.ts`: text, numbers, Parts Credits (first click ascending, so the most negative comes first), a third click returns `''`, switching column restarts the cycle, `aria-sort`.
- `tests/Model.spec.ts`:
  - formatters: U+2212, null shows `—`, `-0` shows bare, cents to dollars;
  - `childLevelOf` for both variants, including the unlinked-credits row;
  - `extendPath`, `nodeKey`;
  - `toTriStateCsv`: all selected → `undefined`; empty → `''`; unknown option universe → `undefined`;
  - link gating per document kind.

##### P3: Drill-down level component (one recursive implementation for 3 and 4 levels)
**Requirements:** RPT-S1-R12, S2-R1..R5, S2-N1, S2-E1, S2 error handling, S5-R2, S5-R6.

- `PartsSalesDrillRows.vue`: recursive. Props `level`, `path`, `depth`. It owns `useInfiniteQuery` and renders a fragment of `q-tr`s, **each one with `q-virtual-scroll--with-prev`**: a loading row, child rows (and a nested `<PartsSalesDrillRows>` when a child is expanded and not a leaf), the error row, and the sentinel row (key code C).
- `PartsSalesCells.vue`: a fragment of `q-td`s for the Location cell plus the visible financial columns. Parts Invoiced is always rendered and bold. Used by level 0, the drill rows and Totals.

**Component tree**
```
Reporting.vue
 ├─ SalesByTierReport.vue      → <PartsSalesReport :config="SALES_BY_TIER"><slot/></…>
 └─ SalesByCategoryReport.vue  → <PartsSalesReport :config="SALES_BY_CATEGORY"><slot/></…>
      PartsSalesReport.vue  (provides drillContext)
       ├─ ReportToolbar (#title slot; #actions: SubActionsDropDown, ColumnSelector)
       ├─ FilterBar  | MobileFilterChipRow (defineAsyncComponent, GR#6)
       └─ Table (#header sort labels + ReportInfoIcon on % of Total)
            #body: level-0 q-tr [chevron | name | PartsSalesCells]
                   └─ PartsSalesDrillRows level=childLevelOf(root,row) path={root:key}
                        ├─ child q-tr … └─ PartsSalesDrillRows (recursive) …
                        ├─ error q-tr (Ooooops + Try again)
                        └─ sentinel q-tr (v-intersection → fetchNextPage)
            #bottom-row: Totals (report-totals-row)
            #no-data: FilteredTableEmptyState
```
Level chains:
- **Tier:** `pricedBy → customer → document`.
- **Category:** `category → pricedBy → customer → document`.
- **Category, "Credits not tied to a part" row:** `category(unlinkedCredits) → customer → document` (⏸ ambiguity A6).

**Tests:** `tests/PartsSalesDrillRows.spec.ts`, rendered inside a minimal `Table` harness with MSW:
- loading row while the first page is pending;
- 30 rows then the sentinel; firing `FakeIntersectionObserver` requests page 2 with `page=2` and the same parent path and sort;
- a 500 on page 1 shows the error row with exact copy, Try again calls `refetch`, and no toast appears;
- a 500 on page 2 keeps page-1 rows plus the error row, and Try again calls `fetchNextPage`;
- every rendered `q-tr` has `q-virtual-scroll--with-prev`;
- the leaf level has no chevron;
- document links follow the gating rules (S2-R3, S2-N1).

##### P4: Report body, filters, URL, table, Totals, column chooser, empty states, downloads
**Requirements:** RPT-S1-R6, R7, R13, R14, S1-N1, S1 error handling, S3-R1..R10, R12, S3-N1, S3-E1, S4-R1..R7, S4-N1, S4-N2, S4-E1, S4 error handling, S5-R1, S5-N1.

New files:
- `src/components/ts/reporting/sales-by-tier/PartsSalesReport.vue` (adapted from SBC);
- `SalesByTierReport.vue` and `SalesByCategoryReport.vue` (thin wrappers, `defineOptions({ name })`).

**Filters** (chip order per PRD: Date, Priced By, Category, Customer, Sales Type, Location):

| key | def |
|---|---|
| `dateRange` | Same as SBC: `preset-date-range`, `required`, `this-month`, `maxRangeDays: 366`, `dateDisplay: 'us'` (S3-R1) |
| `pricedBy` | `multi`, options from the filter-options endpoint (tiers in S3-R7 order with "(archived)", then the fixed sources, then "Credits not tied to a part"); `searchable: true`, `autofocusSearch`, `defaultValue` = every value, `plainWhenAllSelected`, `allSummaryLabel: 'All'`, `emptySummaryLabel: 'None'`, `summaryNoun` (⏸ A8) |
| `categoryIds` | Same flags; Uncategorized first, then A to Z (supplied by the BE) (S3-R9) |
| `customerIds` | SBC's `multi-search`, `emptyMeansAll`, plus `autofocusSearch` (S3-R4) |
| `salesTypes` | `multi`, options `Part Sales` (`partSales`) and `Work Orders` (`workOrders`); `defaultValue` both; `plainWhenAllSelected`; `allSummaryLabel: 'All'`; `emptySummaryLabel: 'None'` (S3-R5) |
| `locationIds` | Same as SBC (default scope, `visible` when more than one location, `defaultValue`), plus `autofocusSearch` (S3-R2) |

**`useReportFilters` options:**
- `pageKey: report-sales-by-tier | report-sales-by-category`;
- `syncKeys` = `PARTS_SALES_SHARED_FILTER_KEYS`;
- `requiredKeys: ['dateRange']`;
- `emptyEqualsDefaultKeys: ['locationIds']`;
- `carryAcrossLocationSwitch: ['locationIds']`;
- **no** `rememberedState`, so a new visit starts from the defaults (S3-R6).

**Page startup and fetching:**
- `onMounted` uses `Promise.allSettled` on `fetchQuery(myWorkplacesQueryOptions())` and `fetchQuery(partsSalesFilterOptionsQueryOptions())`. Then it runs `initialize()`, prunes URL ids that are no longer offered (Parts Velocity's `pruneRestoredSelections` pattern for `pricedBy`, `categoryIds`, `salesTypes`), reconciles customers via SBC's `salesByCustomerCustomersResolveQueryOptions`, and only then sets `reconciled = true`.
- Filters go through `useDebouncedFilters(filters, { delayMs: REPORT_FILTER_DEBOUNCE_MS, enabled })`.
- The wire values: `toTriStateCsv` for `pricedBy`, `categories`, `salesTypes` and `customers`. `locations` is always enumerated.
- Customer type-ahead: reuse SBC's `salesByCustomerCustomersQueryOptions`, mapping Sales Type to `productType` (`partSales`→`parts`, `workOrders`→`service`, both→`all`, neither→`none`). That is literally "as on Sales by Customer" (S3-R4). The BE may replace it with its own endpoint (§2).
- `useReportTableQuery({ queryKey: r => reportingKeys.reportTable(config.slug, r), fetchPage: fetchPartsSalesReportPage(config.slug), pagination: { sortBy: '', descending: false }, filters: () => settled.value, enabled })`. Sort always opens in first-load order (S3-R7, ⏸ RQ8).

**Table:**
- Columns, in order: chevron, name (`config.firstColumnLabel`), Location (only when `selectedLocationIds.length > 1`), Parts Cost, **Parts Invoiced** (bold header and cells), Parts Credits, Parts Net, Parts Margin, Parts Margin %, % of Total.
- The % of Total header carries `ReportInfoIcon` with the text "Share of Parts Invoiced for everything that matches your filters."
- **No `report-col-pinned`.**
- Row labels come from the BE (`"2 · Fleet"`, `"Fleet (archived)"`, `"No Company"`), with no icon (S1-R11, S2-R2).

**Collapse rule:** `collapseSignature = JSON.stringify({ settled filters, sortBy, descending })`; a watcher clears the expanded set. This follows SBC's collapse on sort or filter change (ambiguity A18).

**Totals** use `#bottom-row` with `v-if="data.length && totals"` and class `report-totals-row`; the first cell reads "Totals" (S1-R7). It is never shown in either empty state.

**Empty states** (S1-N1, S3-N1, S5-N1):
- title: `filtersApplied ? REPORT_EMPTY_TITLE : 'There are no results for selected date range'`;
- body: `filtersApplied ? REPORT_EMPTY_SUBTITLE : undefined`;
- `:filters-applied="filtersApplied"`, `@clear-filters="resetFilters"`.
- The date is a preserved key, so a date-only change gets the S1-N1 copy, and Sales Type None gets S3-N1.
- **Recommended:** render nothing in `#no-data` while `isErrorReal` is true, so a failed load never says "no results". Otherwise the main load failure behaves like SBC: a toast, filters kept.

**Column chooser** (S1-R14): `useRememberedTableView({ reportSlug: config.slug, version: '1', defaults: { sortBy: '', descending: false, columns: SIX_TOGGLEABLE } })`.
- Read **only** `initialView.columns`.
- Persist `{ sortBy: '', descending: false, columns }` on column change only (⏸ RQ8).
- `ColumnSelector :columns` includes Parts Invoiced with `required: true`, which keeps it out of the picker.

**Downloads** (S4):
- `SubActionsDropDown` with four items, PDF first, labels exactly as in S4-R1, a loading ref per item.
- The "Empty export" warning toast when `!data.length` (S4-N2, copied from SBC).
- Parameters: settled filters, `sortBy` / `descending` (including `''`), `variant`, `format`, and `columns` = the on-screen columns in canonical order, including name, Location when shown, and Parts Invoiced (S4-R3).
- On a 4xx with a `Blob` body, show the BE message via `readApiErrorMessage` (S4-R5, S4-N1).
- Otherwise call `captureApiError` and show `showErrorNotification({ message: 'Ooooops! An error occurred', caption: 'Contact support for more information', timeout: 5000 })`. **This is report-local; do not use `reportExportFailureMessage`.**
- Filename fallback `sales-by-tier-${variant}.${format}`.
- Call `trackReportExport()` after the re-entrancy guard.

**Tests:**
- `tests/SalesByTierReport.spec.ts` (renders the wrapper, MSW, `createTestingRouter`):
  - nav-independent render: columns in order, Parts Invoiced bold, no pinned class, the % of Total tooltip text;
  - formatting: `−$12.40` and `−5.25%`, `—` for null;
  - Totals row present and absent;
  - every row closed on load (S2-R1);
  - expanding goes to customers then documents, and request params carry `parentPricedBy` / `parentCustomer`, the settled filters and the sort;
  - 3-state sort: the request sequence `parts_margin desc` → `parts_margin asc` → `''`; `parts_credits` starts ascending; a sort change collapses rows;
  - chips: Date and Location blue, others plain at defaults, Priced By blue on a subset, "Sales Type: All / Part Sales / None";
  - URL mirror omits defaults and a reload restores the view (S3-R6);
  - both empty states and Clear;
  - column hide survives a remount, sort does not (⏸ RQ8);
  - Location column only when more than one location is in scope;
  - downloads: four items, empty export, 4xx message, 5xx Ooooops toast plus Sentry, `columns` and `sortBy` in params;
  - the level-0 500 toasts (handled by the interceptor), with no false empty state.
- `tests/SalesByCategoryReport.spec.ts`:
  - the 4-level chain category → priced-by → customer → document with `parentCategory` + `parentPricedBy` + `parentCustomer`;
  - the unlinked-credits row skips priced-by (⏸ A6);
  - header reads "Category".

##### P5: Registration and carrying filters between the two reports
**Requirements:** RPT-S1-R1, S1-N2, S3-R11.

| File | Change |
|---|---|
| `src/router/routes.ts` | Under the `reports` children: `{ path: 'sales-by-tier', name: 'SalesByTier', component: EmptyTabView, meta: { title: 'Sales by Tier - Report' } }` and the same for `sales-by-category` / `SalesByCategory`. They inherit the parent gate (S1-N2) |
| `src/pages/Reporting.vue` | 4-touch: `defineAsyncComponent` imports, `componentMap`, `components[]` (titles "Sales by Tier" and "Sales by Category"), and `routeNameToTabName` (`SalesByTier: 'salesByTier'`, `SalesByCategory: 'salesByCategory'`). Fix the stale "No concrete suite report is registered yet" comment only if you touch that block |
| `src/components/ts/reporting/ReportLeftMenuNav.vue` | Put two entries **ahead of** Parts Velocity in `partsReports` (`report_nav_sales_by_tier`, `report_nav_sales_by_category`, icons are a free design choice, GA events `sales_by_tier_view` / `sales_by_category_view`). Add `carriesFiltersFrom?: string[]` to `PartsReportNavItem`, plus `navTarget(report)` (key code F); `:to="navTarget(report)"` |
| `src/testing/router.ts` | Add `SalesByTier` and `SalesByCategory` mock routes, because `router-link` throws on unknown names |

**Tests:** `src/components/ts/reporting/tests/ReportLeftMenuNav.spec.ts`
- add the two routes to `reportRouteNames`;
- Parts group DOM order: Tier, Category, Parts Velocity, Inventory Value (S1-R1); neither entry under Performance;
- analytics rows for the two new tabs;
- on `SalesByTier` with `?dateRange=last-month&salesTypes=partSales&foo=1`, the Category tab's `href` carries only the six shared keys;
- from Parts Velocity, no query is carried;
- the active tab stays correct after the switch.

##### P6: Verification (Definition of Done)
1. **Static checks.**
   - `npx eslint --max-warnings=0 <changed files>`
   - `npx vitest related --run <changed files>` plus `npx vitest run <new specs>` (respect the vitest worker cap)
   - `npx vue-tsc --noEmit`
   - `cd e2e && npx tsx scripts/e2e-precheck.ts --files=<touched .vue> --pretty`: no missing test ids (GR#5).
2. **Compile.** Probe FE on `:7200`; Vite must be ready with no `[vite]` errors.
3. **Browser walk** (needs the BE endpoints from the same PR). Log in with quick-login `admin`.
   - Go to `/reports` and check the Parts group order.
   - `/reports/sales-by-tier`: chips (Date and Location blue, the rest plain); the cursor lands in each search box; expand tier → customer → documents, scroll a row past 30 to see the next page; links vs plain text for another location; 3-state sort on Parts Margin and Parts Credits; hide Parts Margin and reload (it stays hidden, sort resets); Totals pinned to the bottom while scrolling; all four downloads; a range with no sales (S1-N1); Sales Type None (S3-N1 plus Clear).
   - Block `*/drill/*` in DevTools, expand a row: the in-row Ooooops + Try again appears, with no toast.
   - Switch to Sales by Category through the nav: filters carried, rows closed, sort reset. Open the 4 levels.
   - Switch location from the top right: Location carried.
   - Quick-login `tech` (or any role without `reportsPageAccess`): the entries are not listed, and a direct URL shows Access restricted.
   - Data note: tier rows exist only after the Tiered Pricing BE ships plus seeding. Historical lines exercise Before tiers.
4. **Optional docs.** Add a "Paginated nested drill levels" section to `docs/patterns/table.md` (recursive level component, sentinel row, `with-prev` on every nested row).

##### Key code (load-bearing)

**A. 3-state sort** (`sales-by-tier/useThreeStateSort.ts`; no change to `useReportTableQuery`, whose `mapPaginationForAPI` keeps `''` because it uses `??`)
```ts
export const FIRST_LOAD_ORDER = '';
export interface SortState { sortBy: string; descending: boolean }

/** RPT-S3-R8: click 1 = column's first direction, 2 = reversed, 3 = first-load order (S3-R7). */
export const nextSortState = (cur: SortState, column: string, firstDescending: boolean): SortState => {
  if (cur.sortBy !== column) return { sortBy: column, descending: firstDescending };
  if (cur.descending === firstDescending) return { sortBy: column, descending: !firstDescending };
  return { sortBy: FIRST_LOAD_ORDER, descending: false };
};

export function useThreeStateSort(o: {
  pagination: Ref<Pagination>;
  onRequest: (v: { pagination: PaginationInfo }) => unknown;
  firstDescendingFor: (column: string) => boolean; // text false; numbers true; parts_credits FALSE (most negative = largest credit first)
}) {
  const cycle = (column: string): void => {
    const next = nextSortState(
      { sortBy: o.pagination.value.sortBy, descending: o.pagination.value.descending },
      column, o.firstDescendingFor(column));
    o.onRequest({ pagination: { page: 1, rowsPerPage: o.pagination.value.rowsPerPage, ...next } });
  };
  const ariaSortFor = (c: string) =>
    o.pagination.value.sortBy !== c ? 'none' : o.pagination.value.descending ? 'descending' : 'ascending';
  return { cycle, ariaSortFor, isSortedBy: (c: string) => o.pagination.value.sortBy === c };
}
```
The header uses the same `sbc-sort-label` span pattern (role=button, Enter key) and the existing `.report-sort-icon` / `--active` CSS, which already shows arrows on hover and on the sorted column (design 20.14).

**B. Level model** (`sales-by-tier/Model.ts`)
```ts
export type DrillLevel = 'pricedBy' | 'category' | 'customer' | 'document';
export interface DrillPath { category?: string; pricedBy?: string; customer?: string }
export interface PartsSalesReportConfig {
  slug: 'sales-by-tier' | 'sales-by-category';
  rootLevel: 'pricedBy' | 'category';
  firstColumnLabel: 'Priced By' | 'Category';
  testIdPrefix: 'sbt' | 'sbcat';
  pageKey: string; exportStem: string;
}
export const childLevelOf = (level: DrillLevel, kind: string | null): DrillLevel | null => {
  switch (level) {
    case 'category': return kind === 'unlinkedCredits' ? 'customer' : 'pricedBy'; // ⏸ A6
    case 'pricedBy': return 'customer';
    case 'customer': return 'document';
    case 'document': return null;
  }
};
export const extendPath = (path: DrillPath, level: DrillLevel, key: string): DrillPath => {
  switch (level) { // explicit cases keep the union typed without `as`
    case 'category': return { ...path, category: key };
    case 'pricedBy': return { ...path, pricedBy: key };
    case 'customer': return { ...path, customer: key };
    case 'document': return path;
  }
};
export const nodeKey = (level: DrillLevel, p: DrillPath): string =>
  [level, p.category ?? '', p.pricedBy ?? '', p.customer ?? ''].join('|');
export const pathTestId = (p: DrillPath): string =>
  [p.category, p.pricedBy, p.customer].filter(Boolean).join('_');
```

**C. Per-row error, Try again, sentinel** (`PartsSalesDrillRows.vue`)
```ts
const ctx = useDrillContext();
const query = useInfiniteQuery(computed(() => partsSalesDrillInfiniteQueryOptions({
  slug: ctx.config.slug, level: props.level, path: props.path, ...ctx.scope.value })));
const rows = computed(() => query.data.value?.pages.flatMap((p) => p.collection) ?? []);
const showError = computed(() => query.isError.value && isQueryErrorReal(query.error.value));
const retry = (): Promise<unknown> =>
  query.isFetchNextPageError.value ? query.fetchNextPage() : query.refetch();
const onSentinel = (entry: IntersectionObserverEntry): void => {
  if (entry.isIntersecting && query.hasNextPage.value && !query.isFetchingNextPage.value)
    void query.fetchNextPage();
};
```
```vue
<q-tr v-if="showError" :data-test-id="`row_${p}_${level}_error_${pid}`" class="q-virtual-scroll--with-prev">
  <q-td :colspan="ctx.columnCount.value">
    <div class="pst-indent pst-error" role="alert">
      Ooooops! An error occurred
      <Button flat no-caps label="Try again" :async-click="retry"
              :data-test-id="`button_${p}_retry_${level}_${pid}`" />
    </div>
  </q-td>
</q-tr>
<q-tr v-else-if="query.hasNextPage.value"
      :key="`more_${pid}_${rows.length}`" v-intersection.once="onSentinel"
      :data-test-id="`row_${p}_${level}_more_${pid}`" class="q-virtual-scroll--with-prev">
  <q-td :colspan="ctx.columnCount.value" class="text-center"><q-spinner size="1.5rem" color="primary" /></q-td>
</q-tr>
```
The indent is depth-based through classes `pst-depth-1..3` (static classes; the `--indent` CSS variable is set on an inner element, never on the `td`, as in SBC's SV-9460 note).

**D. Plain-when-all-selected chip rule** (`shared/filters/Model.ts` + `FilterChip.vue` + `FilterBar.vue`)
```ts
export const coversEveryOption = (def: FilterDef, values: readonly string[]): boolean =>
  Array.isArray(def.options) && def.options.length > 0 &&
  def.options.every((o) => values.includes(o.value));

/** A full set in any order becomes the declared default, which the cap and URL treat as free. */
export const normalizeFilterSelection = (def: FilterDef, values: string[]): string[] =>
  def.plainWhenAllSelected && def.defaultValue && coversEveryOption(def, values)
    ? [...def.defaultValue] : values;

// FilterChip.vue
const isActive = computed(() => props.modelValue.length > 0 &&
  !(props.def.plainWhenAllSelected && coversEveryOption(props.def, props.modelValue)));
// nounSummary: `count === total` (and the count===0 fallback) → props.def.allSummaryLabel ?? `All ${noun}`
// onClear: emit(props.def.plainWhenAllSelected && props.def.defaultValue ? [...defaultValue] : [])  ⏸ A8
```
Set `emptySummaryLabel: 'None'` on all three flagged defs. That also shields them from `clampFilterState`, where trimming towards empty would narrow to nothing.

**E. Negative formatter used only by these reports** (S1-R13)
```ts
const MINUS = '−';
export const formatPartsSalesMoney = (cents: number | null | undefined): string => {
  if (cents == null || Number.isNaN(cents)) return REPORT_EM_DASH;
  const mag = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(cents) / 100);
  return cents < 0 ? `${MINUS}${mag}` : mag;          // sign from the input; -0 renders bare
};
export const formatPartsSalesPercent = (pct: number | null | undefined): string =>
  pct == null || Number.isNaN(pct) ? REPORT_EM_DASH
    : `${pct < 0 ? MINUS : ''}${Math.abs(pct).toFixed(2)}%`;
```

**F. Carrying filters when switching reports** (`ReportLeftMenuNav.vue`)
```ts
const route = useRoute();
const navTarget = (r: PartsReportNavItem): RouteLocationRaw => {
  const from = route?.name;
  if (typeof from !== 'string' || !r.carriesFiltersFrom?.includes(from)) return { name: r.routeName };
  const query: LocationQueryRaw = {};
  for (const key of PARTS_SALES_SHARED_FILTER_KEYS) {
    const v = route?.query[key];
    if (v !== undefined) query[key] = v;
  }
  return { name: r.routeName, query };
};
// SalesByTier.carriesFiltersFrom = ['SalesByCategory'], SalesByCategory.carriesFiltersFrom = ['SalesByTier']
```
Rows close and sort resets on their own, because the target remounts and sort is not in the URL.

---

#### 2. API contract the FE assumes (camelCase bodies, integer cents). **To reconcile with BE (`be-planner`).**

**Common request parameters** (all endpoints except filter options):
- `startDate`, `endDate`: UTC instants from `toReportDateWindow`.
- `locations`: CSV, always enumerated; empty means the active location.
- `customers`, `pricedBy`, `categories`, `salesTypes`: **tri-state CSV**: absent = no narrowing; present but `''` = matches nothing; otherwise the listed values.
- Sort and paging: `page`, `rowsPerPage` (30), `sortBy`, `descending`. `sortBy ∈ { '', name, location, parts_cost, parts_invoiced, parts_credits, parts_net, parts_margin, parts_margin_pct, pct_of_total }`, where `''` is the first-load order (S3-R7) at every level. These are the FE column ids, chosen to match the snake_case test ids and `columns`.
- *If the BE reuses the suite's `ReportListRequestDto` (`range=custom&start_date&end_date&pagination[...]`), only the two fetch delegates in `queries.ts` change.*

| Endpoint | Extra params | Response `data` |
|---|---|---|
| `GET reporting/reports/sales-by-tier/filter-options` (shared by both reports; `reportsPageAccess` only) | — | `{ pricedBy: {value, label, kind: PricedByKind, archived: boolean}[], categories: {value, label}[] }`. Ordered as S3-R3 and S3-R9; Uncategorized first with sentinel value `uncategorized`; tier labels already formatted |
| `GET reporting/reports/{slug}` (`slug` = `sales-by-tier` or `sales-by-category`) | — | `{ collection: (PricedByRow \| CategoryRow)[], pagination: {page, rowsPerPage, rowsNumber, sortBy, descending}, totals: Financials }` |
| `GET reporting/reports/sales-by-category/drill/priced-by` | `parentCategory` | `{ collection: PricedByRow[], pagination }` |
| `GET reporting/reports/{slug}/drill/customers` | `parentPricedBy`, `parentCategory?` | `{ collection: CustomerRow[], pagination }` |
| `GET reporting/reports/{slug}/drill/documents` | `parentPricedBy?`, `parentCategory?`, `parentCustomer` | `{ collection: DocumentRow[], pagination }` |
| `GET reporting/reports/{slug}/export` | `variant: summary\|expanded`, `format: pdf\|csv`, `columns` (CSV of column ids in on-screen order) | blob; a 4xx body carries the S4-R5 text exactly ("…Choose a shorter date range, then try again.", which **differs** from the suite's `ReportExportNarrowHint`) |
| Customer type-ahead and resolve | — | **Reuse** SBC `reporting/reports/sales-by-customer/customers` and `/customers/resolve`. The BE may offer a dedicated parts-scoped endpoint instead |

```ts
type PricedByKind = 'default' | 'tier' | 'fixedPrice' | 'fixedLineTotal' | 'manual' | 'beforeTiers' | 'unlinkedCredits';
interface PartsSalesFinancials {
  partsCost: number; partsInvoiced: number; partsCredits: number /* ≤ 0 */; partsNet: number; partsMargin: number;
  partsMarginPct: number | null;  // 2dp; null when partsInvoiced ≤ 0 (BE owns the rule)
  pctOfTotal: number | null;      // 2dp; row.partsInvoiced / totals.partsInvoiced at EVERY level; null when totals ≤ 0
}
interface PartsSalesPricedByRow extends PartsSalesFinancials { rowType: 'pricedBy'; key: string /* tier uuid | kind slug */; label: string; kind: PricedByKind; location: string | null }
interface PartsSalesCategoryRow extends PartsSalesFinancials { rowType: 'category'; key: string /* uuid | 'uncategorized' | 'unlinkedCredits' */; label: string; kind: 'category' | 'uncategorized' | 'unlinkedCredits'; location: string | null }
interface PartsSalesCustomerRow extends PartsSalesFinancials { rowType: 'customer'; key: string /* company uuid | nil-uuid = No Company */; label: string; location: string | null }
interface PartsSalesDocumentRow extends PartsSalesFinancials {
  rowType: 'document'; key: string /* unique per row: an applied goodwill credit appears once per invoice (20.5) */;
  documentType: 'invoice' | 'credit'; number: string; appliedToInvoiceNumber: string | null;
  createdOn: string /* UTC instant */; salesType: 'partSales' | 'workOrders';
  workOrderId: string | null; creditId: string | null; customerId: string | null;
  workplaceId: string; location: string;
}
```
**FE link gating** (as SBC; the FE decides, the BE only supplies ids): a link needs `workplaceId === active location` **and** a permission:
- work orders: `seeFinancialData()` → `{ name: 'finance', params: { id: workOrderId } }`;
- part sales: `has('partSalesView')` → `{ name: 'partSalePartRequests', params: { id: workOrderId } }`;
- credits: ⏸ A3; plain text until decided.

**Points for the BE to confirm:**
- the `/drill/` path segment (the FE silences toasts by substring);
- parent-path parameter names do not collide with the `pricedBy` filter;
- labels are built by the BE (shared with downloads);
- `pctOfTotal` and `partsMarginPct` are computed by the BE;
- ties are broken per S3-R8;
- the RQ6 credits-row hiding is driven purely by the tri-state `categories` value (absent = all, so the row shows);
- `rowsNumber` is on every level;
- level-0 timeout uses the default 60s unless a production measurement justifies `SLOW_REPORT_TIMEOUT_MS`;
- these are read-only endpoints, so a read-replica move needs no FE change (no mutation-refetch).

---

#### 3. `data-test-id` scheme (`{p}` = `sbt` for Sales by Tier, `sbcat` for Sales by Category; `{pid}` = `pathTestId`; `{col}` = snake_case column id)

| Element | Test id |
|---|---|
| Nav entries | `report_nav_sales_by_tier`, `report_nav_sales_by_category` |
| Page root / table | `page_sales_by_tier_report` / `table_sales_by_tier`; `page_sales_by_category_report` / `table_sales_by_category` |
| Sortable header label | `header_{p}_{col}` (`name`, `location`, `parts_cost`, …, `pct_of_total`) |
| % of Total info icon | `icon_{p}_pct_of_total_info` |
| Level-0 row / chevron | `row_{p}_{rootLevel}_{key}` / `button_{p}_expand_{rootLevel}_{key}` |
| Drill row / chevron | `row_{p}_{level}_{pid}_{key}` / `button_{p}_expand_{level}_{pid}_{key}` |
| Drill loading / error / Try again / sentinel | `row_{p}_{level}_loading_{pid}` / `row_{p}_{level}_error_{pid}` / `button_{p}_retry_{level}_{pid}` / `row_{p}_{level}_more_{pid}` |
| Document number | `link_{p}_document_{key}` (linked) / `text_{p}_document_{key}` (plain) |
| Totals | `row_{p}_totals` |
| Empty state | `text_{p}_empty` (title), `button_{p}_clear_filters`, body `text_empty_state_body` (shared) |
| Download menu | `SubActionsDropDown data-test-id-suffix="{p}_export"`; items `{p}_export_summary_pdf`, `{p}_export_expanded_pdf`, `{p}_export_summary_csv`, `{p}_export_expanded_csv` |
| Column chooser | Shared: `toggle_column_{col}` (Parts Invoiced is never in the picker) |
| Filter chips | Shared: `filter_chip_{dateRange\|pricedBy\|categoryIds\|customerIds\|salesTypes\|locationIds}`, `filter_search_{key}`, `filter_select_all_{key}`, `filter_chip_clear_{key}` |

No existing test id is removed or renamed.

---

#### 4. Decisions, trade-offs, risks

**Decisions (recommended option first):**
1. **One shared body, two thin wrappers** vs two copies of an 1,100-line SBC-style component. Shared, because RPT-S5-R1 says Category has all of Tier's behaviour, and two copies would drift.
2. **Each drill component owns its own `useInfiniteQuery`** vs a root-owned imperative cache like SBC. The component approach gives page-by-page loading, `isError`/`isFetchNextPageError`, retry and dedup without hand-written bookkeeping; the key holds scope and sort; `staleTime: Infinity` makes collapse and virtual-scroll remounts free. Cost: one observer per expanded node.
3. **Sentinel row with `v-intersection`** (precedent: AP aging) vs a "Load more" button (not in the PRD: "more loading as the user scrolls") vs flattening the tree into virtual rows (would break `useReportTableQuery.onScroll`'s index arithmetic and SBC parity).
4. **Enumerated "all" defaults plus `plainWhenAllSelected`** vs `emptyMeansAll` for Priced By and Category.
   - Enumerated matches "All selected by default" (ticked boxes) and S3-R12, and handles Sales Type (where None is a distinct state) with the same rule.
   - `emptyMeansAll` needs no option list for defaults and has no cap pitfalls, but shows dashes and a caption, and a fully-ticked chip stays blue.
5. **Silence drill-endpoint toasts and capture to Sentry in the `queryFn`** vs a toast plus the in-row error (double feedback).
6. **Carry filters through the nav `to`** vs a route `beforeEnter`. A guard would also rewrite Back/Forward between the two reports and break RPT-S3-R6.
7. **Report-local formatter** vs a variant in `utils/reporting.ts`. Local keeps the suite-wide rule's documentation true.
8. **Report-owned filter-options endpoint** vs the Tiered Pricing tier API (pricing permission) plus `useCategoriesQuery` (no Uncategorized sentinel, no tier "(archived)" labels).
9. **Reuse SBC's customer type-ahead and resolve** (literally "as on Sales by Customer"). The cost: it offers customers with labour-only invoices and misses customers who only have credits.
10. **Hide the empty state while `isErrorReal`.** The main failure otherwise follows SBC (toast).

**Risks:**
- **Shared filter regression across about 70 pages.** All three flags default off, and specs pin flag-off behaviour. Run `vitest related` on `shared/filters/*` and the e2e precheck.
- **QMenu autofocus race.** Input `autofocus` on mount plus QMenu's "skip if focus is already inside" should work, but the QMenu transition could steal focus. Verify in the browser walk; fallback: focus in `@show` on the chip's menu.
- **Large drill content inside a virtual table.** Virtualisation is per top-level row only; Sales by Tier has few rows, so expanded content is fully in the DOM, growing 30 rows at a time. Every nested `q-tr` **must** carry `with-prev`, or the level-0 page loading misfires (spec asserts it).
- **Filter options are a startup dependency.** `toTriStateCsv` returns "no narrowing" when the option list is unknown, so a failed options load degrades to an unfiltered report instead of zero rows.
- **"None" in the URL.** Sales Type, Priced By and Category "None" are kept through a report-owned `none` query parameter (Phase 11); `useFilterUrlSync` stays unchanged, so no shared blast radius.
- **50-value cap** (⏸ RQ7): "every category but one" is refused on clients with more than 50 categories. The normalisation in P1 prevents the worse trap where re-ticking is refused.
- **Contract drift.** Silencing is a URL substring; if the BE changes the `/drill/` path, update `boot/axios.ts` or row failures will toast.
- **Tiered Pricing dependency.** Tier rows and filter options need the Tiered Pricing BE. Build the FE against MSW first.
- **RQ8 interacts with S3-R11.** If Product chooses to remember sort, switching reports must still reset it (S3-R11): the nav carry would add a one-shot marker, or the report ignores remembered sort when entered from its sibling.

---

#### 5. Product answers (all answered by page 18; handled so the code switches in one place)
- **⏸ RQ6** (credits row hides only when Category is a strict subset): BE logic only. The FE sends absent `categories` for all and `''` for none, so no FE branch.
- **⏸ RQ7** (keep the 50-value cap): no FE change; the panels' existing cap message applies.
- **⏸ RQ8** (remember only columns; open in first-load order): implemented as columns-only persistence in `PartsSalesReport.vue` (one watcher plus reading `initialView.columns`). Switching to "remember sort" means passing `initialView.sortBy/descending` and persisting `pagination`, plus the S3-R11 marker above.
- **⏸ RQ1 / RQ2 / RQ9:** data only; FE shape unaffected.

#### 6. Product-visible ambiguities (not decided; PRD ids)
- **A1, RPT-S3-N1:** the button reads "Clear All Filters" in the PRD but the shared component says "Clear all filters". Options: a report-local label prop, or keep the shared wording.
- **A2, RPT-S3-R1 / design 20.11:** "Choose a date range of one year or less." (canvas) vs Sales by Customer's "Range: N days (max 366)" ("as on Sales by Customer").
- **A3, RPT-S2-R3:** what does a credit number open? Core has no credit page. Candidates: the client's Invoices tab (`CustomerInvoicesTab`, gated by `seeApArData`), or the Part Sale for a return. Credits stay plain text until answered.
- **A4, RPT-S2-R3 / S1-R6 / S1-R14:** where an invoice's or credit's date shows. S1-R6 has no Date column and S1-R14's hideable list has none. Provisional: muted text beside the number in the first column.
- **A5, RPT-S3-R2 / S3-R8:** what the Location column shows on tier, category and customer rows that span several locations, and whether it sorts ("Every column sorts").
- **A6, RPT-S5-R2:** on Sales by Category, does "Credits not tied to a part" open straight to customers (provisional) or through a single Priced By row?
- **A7, RPT-S3-R7 / S3-R8:** first-load order of customers and invoices inside a row. S3-R7 defines rows only.
- **A8, RPT-S3-R3 / S3-R9 / S3-R12:** closed-chip text for Priced By and Category ("All" / one name / "N …"), and what the chip's clear (X) does on Priced By, Category and Sales Type. Provisional: it restores All. Emptying would trigger S3-N1.
- **A9, RPT-S3-R12 / S3-R2:** Location emptied with its X becomes plain "No locations", which contradicts "always blue". Should Location be non-clearable on these reports?
- **A10, RPT-S1-R13 / S4-E1:** U+2212 "−" on screen; should the CSV use an ASCII "-12.40" (machine-readable) and the PDF use "−"? Negative percentages read "−3.20%"?
- **A11, RPT-S1-R6:** % of Total precision. Two decimals assumed, like Parts Margin %.
- **A12, RPT-S1-R14:** column choice remembered per report (provisional: `report_table:sales-by-tier` / `report_table:sales-by-category`) or shared by the two reports?
- **A13, RPT-S3-R5 / S3-R6:** settled: "Sales Type: None" survives reload, Back, a link and a report switch through the report-owned `none` parameter (R-D16, Phase 11).
- **A14, RPT-S2-R2:** a count suffix "(n)" next to customer names as on Sales by Customer? An expand-all header control as on Sales by Customer? Both omitted.
- **A15, RPT-S3-R8 / S3-R11:** does a sort change close open rows? Sales by Customer does; provisional: yes.
- **A16, design 20.4 / 20.5:** exact document-row label format, e.g. "Credit CM-5003 · applied to Invoice 10498". Confirm against the canvas.
- **A17, RPT-S1-R1:** "Sales by Tier" (binding wording) sits beside "Sales By Customer" / "Sales By Representative" in the same nav. Noted only.

#### 7. Conventions that apply
- **Golden Rules:** GR#3 (all new SFCs `<script lang="ts" setup>`; touched files already are), GR#4 (wire types in `src/api/reporting/ReportingModel.ts`, view and config types in `sales-by-tier/Model.ts`), GR#5 (test ids above), GR#6 (`defineAsyncComponent` in `Reporting.vue` and for `MobileFilterChipRow`), GR#7 (`ColumnSelector` v-model, panel `modelValue`), GR#8 (`Button` / `Table` only; `q-tr` / `q-td` / `q-icon` / `q-spinner` used directly), GR#10 (discriminated `rowType` / `kind`, `extendPath` switch, no `as`), GR#11.
- **Pattern docs:** `docs/patterns/vue-query.md` (silent `queryFn`, no `errorHandler`, `isQueryErrorReal`), `table.md` (`with-prev`), `async-actions.md` (Try again via `:async-click`, download loading refs), `base-wrappers.md`, `unit-testing.md` (MSW `server.use`, `withQueryClient`, `FakeIntersectionObserver`, `userEvent`, `waitFor`).

---

## Appendix C — RPT-S1-R7 list: invoices whose part lines don't add up (audit output and sign-off)

This is the one home of the list RPT-S1-R7 asks for (R-D34). The PR description and Jira carry no copy. The plan file is never committed, so client names may appear here.

**How it is filled**
1. **Before the PR merges:** deploy the branch to staging restored from a fresh prod dump; run `app:invoicing:backfill-part-lines`, then `app:invoicing:audit-part-line-tie-out --output=<csv>`. Paste the invoice-level rows below, grouped by cause.
2. **Sign-off:** the owning PM (Matt Barge) and the report standard's owner sign off each cause class, or each invoice where the class doesn't explain it, in the sign-off table. No release while a row is unsigned.
3. **After release:** run the backfill on prod, then the audit against the prod replica. Add any invoice not already listed, and get it signed off before the reports are announced.

**Summary** (filled from the audit's printed summary)

| Check | Invoices | Share of invoices | Σ\|delta\| | Run (staging dump / prod) |
|---|---|---|---|---|
| `SELL_MISMATCH` | — | — | — | — |
| `COST_MISMATCH` | — | — | — | — |
| `MISSING_ROWS` | — | — | — | — |
| `SNAPSHOT_NULL` | — | — | — | — |
| `FIXED_LINE_TOTAL` (R-D30 cases a and b) | — | — | — | — |
| `CREDIT_LINE_UNATTRIBUTED` (informational) | — | — | — | — |

**Invoice-level list**

| Invoice id | Invoice # | Client | Workplace | Check | Expected (¢) | Actual (¢) | Delta (¢) | Cause |
|---|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — | — |

**Sign-off**

| Cause class or invoice | Owning PM (name, date) | Report-standard owner (name, date) | Note |
|---|---|---|---|
| — | — | — | — |