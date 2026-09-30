# Dashboard v1 — Technical Implementation Plan

**Date:** 2026-09-16
**PRD:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard
**Jira epic:** [SV-490](https://shopview.atlassian.net/browse/SV-490) — stories SV-9573 … SV-9584
**Design:** Dashboard v1 design directions (claude.ai artifact linked from the PRD; read from the owner's export)
**Tech stack:** BE PHP 8.5 / Symfony 7.4 / Doctrine / MySQL (Aurora) · FE Vue 3.5 / Quasar 2 / TypeScript / TanStack Query · E2E Playwright
**Estimated complexity:** High (touches the landing page, six measures, two shipped reports, and every user with the Reports permission)

---

> ## 🔴 This is a rebuild, not a refactor
>
> **Everything gated behind the dashboard feature flags is deleted and written from scratch** — the entire backend dashboard context, its endpoints and drill-downs, the whole frontend dashboard tree and its API layer, the developer role switcher and the `DashboardAll` flag. The current dashboard is bad code with bad performance and a lot of bugs; none of it is a starting point, and none of it survives as "dormant".
>
> Where this plan names an existing dashboard file, it is naming **what is being deleted**, not a file to edit around. A diff that modifies a legacy dashboard handler instead of removing it has missed the point of this release.
>
> Two things are deliberately kept, and both are outside the dashboard: the **reports' own calculations** (the parity rule exists to make the tiles read them) and generic app infrastructure. Three shared pieces currently living inside the doomed tree — the date-range options, their type and helper, and the chart wrapper — are **relocated before anything is deleted**, or the build breaks in accounting and reporting.
>
> Full statement: decision 10 in §3. How to write the queries: §3a.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Read decision 10 in §3 and the query standard in §3a before writing anything.** This is a rebuild: everything gated behind the dashboard feature flags is deleted and written fresh, and every query is measured rather than assumed. Those two sections are what make this release different from the dashboard it replaces.
- **Open questions / blockers:**
  1. ~~Product (a): Service Advisor Analysis~~ — **approved 2026-09-16.** Fixed in this pass (Phase 1, task 1.6), on the same three conditions as the Sales report. Product's reasoning: the report is a copy of a query with two known flaws and produces wrong advisor revenue and ELR whether or not the dashboard exists, so it is worth fixing on its own merits.
  2. ~~Product (b): the other three void gaps~~ — **approved 2026-09-16.** Sales Follow-Up, Customers Spending and the Sales Tax Report each get their own ticket, written with enough detail that whoever picks them up need not rediscover the cause, and linked back to the PRD (Phase 7).
  3. **Outstanding condition on task 1.6:** report anything that reads Service Advisor Analysis numbers which the first blast-radius pass did not already account for. Investigation in progress; the answer is posted to the PRD before task 1.6 merges.
  4. **Task 1.7 (Shop Billing Efficiency void fix) — in scope**, on Product's stated preference ("fixing Billing Efficiency pre-release is crucial, otherwise we will get lit up like a Christmas tree") plus the size read he asked for: ~3 lines, one method, one caller, an existing test file to extend. **One caveat he needs to have seen:** it does not make that report agree with the Billing Efficiency tile, because the two measure different things (see §9). It removes the void-driven gap, not the structural one. If closing the rest matters more than the cheap win, that is a separate and much larger decision about which definition *is* billing efficiency.
  5. **Gate before merging Phase 1:** the production impact numbers are already posted, and the release note ships with the change (NFR-010). For task 1.6 the release note must also name the hours columns and Labor Efficiency, not just revenue and ELR, and must call out the void-then-reinvoice case where figures can move **up**.
  6. **Needs a backend answer before the `n/a` end-to-end test can be written** (§7 blocker 1): is the ratio denominator workplace-scoped such that a workplace with no clock records really yields `n/a` rather than an empty tile?
  7. **Decided by measurement during Phase 3, not up front:** whether either conditional index in §4 is added at all.
  8. **§11 verification tickets** are not yet created.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

## 1. Requirements (extracted from PRD)

Each FR is tagged with the epic story it belongs to. NFRs note whether they came from the PRD or were introduced by this analysis.

### Functional

| ID | Story | Requirement | PRD refs |
|---|---|---|---|
| FR-001 | SV-9573 | A "Dashboard" entry appears in the top nav immediately right of "Reports", only when the user has `reportsPageAccess` **and** the organization has the `DashboardAdministrator` feature | S1-R1, R2, R5, R6, S1-N1, S1-N3 |
| FR-002 | SV-9573 | Users passing both gates land on the dashboard after login; users failing either land on Work Orders, and opening the dashboard URL directly redirects them there | S1-R3, R8, S1-N2, S1-N4 |
| FR-003 | SV-9573 | Both gates are enforced server-side on every dashboard endpoint; a failing request returns an authorization failure and no data | S1-R7 |
| FR-004 | SV-9573 | Figures are scoped to the workplace selected in the top nav, reload when it changes, and do not load when none is selected | S1-R4, S1-E1, S1-E2 |
| FR-005 | SV-9573 | The shop logo is inert at every screen size (no link, no navigation, no analytics); on small screens it sits outside the menu button, which carries its own icon | S1-N5…N9 |
| FR-006 | SV-9574 | Exactly six tiles for every user, in this order: top row Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization; row below Sales by Customer, At Risk Customers. No control to add, remove, reorder, hide or show; no saved layout; **no "expand all" or "collapse all" control and no Panel-versus-Inline view choice** | S2-R1…R4, S2-N1…N5, S6-N1, S6-N2 |
| FR-007 | SV-9575 | Each measure is calculated exactly as the S3-R2 table defines | S3-R2 |
| FR-008 | SV-9575 | Every dashboard figure equals its matching report's figure at every moment, with no staleness window | S3-R1, S3-N1 |
| FR-009 | SV-9575 | Revenue shows a true negative when credits exceed sales, never floored at zero (today's KPI query floors it — see Phase 3) | S3-E1 |
| FR-010 | SV-9575 | Voided invoices contribute to no figure **of any of the six measures** — not Revenue or its parts/labor split, not invoiced hours, not invoiced technician hours, not technician utilization, not the Sales by Customer count, and not the At Risk count including when deciding a customer's most recent invoice. Each measure's source is verified individually; none is assumed already correct | S3-E2 |
| FR-011 | SV-9575 | A ratio with a zero denominator reads exactly `n/a`, never `0.00%`; a line with invoiced tech time but no clocked time contributes no split share | S3-E3 |
| FR-012 | SV-9576 | Each KPI tile shows label, headline, supporting line, sparkline, date-range control and report link. Headlines: Revenue as dollars to the cent, the three ratios to two decimals. Supporting lines read exactly `Parts {parts}% · Labor {labor}%` (whole numbers), `{invoiced hours} Invoiced / {clocked hours} Clocked`, `{invoiced tech hours} Invoiced Tech Hrs / {clocked hours} Clocked`, `{work-order hours} WO Hrs / {clocked hours} Clocked`, with `{count} Invoices` as the Revenue fallback when there is no split. An extreme value is still shown in full, to the report's precision | S4-R1…R9, S4-N2, S4-E1 |
| FR-013 | SV-9576 | Sparklines draw one point per bucket (≤31 d daily, 32–182 d weekly, 183–731 d monthly, longer quarterly), recomputed with the headline's own calculation; buckets with no value leave gaps; fewer than two points draws no line | S4-R10, S4-R11 |
| FR-014 | SV-9576, SV-9577 | No tile shows a delta indicator | S4-N1, S5-N1 |
| FR-015 | SV-9577 | Sales by Customer tile: distinct-customer count reading `{count} customer` / `{count} customers`, `Top: {name}` supporting line, own date range, sparkline over that range, report link. **With no sales in the range the headline shows `0`, not `n/a`.** Invoices with no company group into a single "no company" customer — note that **no such invoice exists in production**, so this path carries no data today and QA must create the case rather than find it | S5-R1…R6, S5-E1, S5-E3 |
| FR-016 | SV-9577 | At Risk tile: count for the selected window; supporting line reads exactly `${revenue} (12mo) · {customer name}` for one customer and `${revenue} (12mo) · {count} customers` for more, where that revenue is the **total trailing-twelve-month revenue across all at-risk customers** (a server-computed aggregate, never a sum of the displayed rows); the 30/60/90/120/180 control defaulting to 120; everything updating together on change; the S5-R15 definitions (revenue > $0.00 on the Revenue basis; whole calendar days in the workplace timezone). **With nobody at risk the headline shows `0`, not `n/a`** | S5-R7…R12, R15, S5-N2, S5-E2 |
| FR-017 | SV-9577 | At Risk sparkline: twelve monthly points, each the count as of that month's last day in the workplace timezone for the current window, with the twelfth computed as of now so it equals the headline; all points recomputed from current data | S5-R13 |
| FR-018 | SV-9577 | The chosen inactivity window is remembered and replaces the 120-day default next visit | S5-R14 |
| FR-019 | SV-9578 | "View details" expands exactly one tile at a time. Each tile's detail is specified: Revenue → the Revenue chart only; Billing Efficiency → its chart **and** the Advisor Analysis table; Technician Efficiency → its chart and table; Technician Utilization → its chart and table; Sales by Customer → its table only; At Risk → its table only. The date-range, window and report-link controls never expand a tile | S6-R1…R7, R9…R13 |
| FR-020 | SV-9578 | The At Risk table is ordered by trailing-twelve-month revenue, highest first, with customer name as tiebreaker, and **lists every at-risk customer**. A safety cap of 500 rows applies: past it, the table shows the first 500 in that order and says so on screen, reading exactly `Showing 500 of N at-risk customers`, while the headline still counts every one. It never truncates silently | S6-R8 |
| FR-021 | SV-9578 | A loading tile shows a placeholder **in place of its headline, supporting line and sparkline only — its label and controls stay readable**, so the tile is never skeletoned whole, never blank, and never shows the previous range's figure; a failing tile shows it could not load while the other five render; no toasts | S6-R14, S6-R15, §7 |
| FR-022 | SV-9578 | The expanded tile, chart filter selections, the At Risk window and each embedded chart's show/hide state are stored in the browser, per browser and device | S6-R16 |
| FR-023 | SV-9578 | Below 1024 px a tile cannot expand; its footer becomes a "View Report" link, and At Risk shows no footer link | S6-E1…E3 |
| FR-024 | SV-9579 | Each KPI tile and Sales by Customer has an independent date-range control offering the nine ranges in order, updating that tile's headline, sparkline and expanded detail only. For an unfinished range, headline and sparkline describe the **same** partial window — both end at the same instant, so the final bucket is never computed to a period end the headline does not include | S7-R1…R6, S7-E1 |
| FR-025 | SV-9579 | KPI tiles default to This Month and Sales by Customer to Last 12 Months; ranges are not carried between visits | S7-R7, S7-R8 |
| FR-026 | SV-9580 | Technician charts have a multi-select technician filter defaulting to all; the Billing Efficiency chart has a single-select advisor filter defaulting to all; changes reload that chart; selections are remembered; deselecting every technician hides the chart | S8-R1…R6, S8-N1 |
| FR-027 | SV-9581 | A percentage axis **fits its data** (net-new: the axis is a hardcoded 200 today), capping at 200% only when a value exceeds 200% while the pooled median across every plotted value on the chart stays ≤200%. The median pools all drawn lines, counts only points that have a value, and for an even count is the **mean of the two middle values**. Clipped values still show their true value on hover. The same rule applies to the embedded charts on report pages | S9-R1…R3 |
| FR-028 | SV-9581 | The Billing Efficiency chart draws one line per advisor with ELR in the tooltip only; no chart draws any additional series | S9-R4…R7 |
| FR-029 | SV-9582 | Each KPI tile and Sales by Customer shows a report link with a naming tooltip that opens the matching report at the tile's current range; At Risk shows none | S10-R1…R4, S10-N1 |
| FR-030 | SV-9583 | The Sales, Service Advisor Analysis, Technician Efficiency and Technician Utilization report pages show the matching chart above their table, following the report's own filters, with a remembered Show/Hide control and no controls or report link of their own | S11-R1…R7, S11-E1 |
| FR-031 | SV-9584 | Desktop shows 4 + 2 rows and below 1024 px a single column; count headlines are larger than KPI headlines; both themes render correctly. **"Descriptive text" is the PRD's own term and means exactly: tile labels, supporting lines, and the date-range and inactivity-window controls** — those are near-black in the light theme and near-white in the dark one. Headline values are not in that set | S12-R1…R5, S12-N1 |

### Non-functional

| ID | Origin | Requirement |
|---|---|---|
| NFR-001 | Intake directive + measurement | No dashboard query may exceed **500 ms**; anything above is treated as a defect and alerted. Per-tile server time targets p95 ≤ 250 ms; the six-tile first load targets p95 ≤ 1 s (a slight overrun is acceptable). Every dashboard statement carries a **2 s** `MAX_EXECUTION_TIME` circuit breaker, and a query that trips it fails only its own tile (FR-021) |
| NFR-002 | Analysis | One data fetch per tile per request, sparkline buckets included. Per-bucket query loops are forbidden. The six tiles load through one batched request, whose sections resolve **independently**: each tile renders as its own section arrives and a failed section never delays or blanks the others (S6-R14, S6-R15). See decision 11 |
| NFR-003 | Analysis | The endpoint accepts only the six v1 tile keys and rejects anything else. With the old sections deleted rather than left dormant, this is input validation on a closed set — not a gate holding back code that still exists |
| NFR-004 | Analysis | Dashboard reads and the five matching report reads both go to the Aurora read replica, so a tile and its report always resolve against the same copy. Replication delay up to ~100 ms is accepted |
| NFR-005 | Intake directive | Every new or changed query is EXPLAIN-verified against production-scale data before merge. Indexes are added only where measurement shows a gain. Nothing in the dashboard path is cached |
| NFR-006 | Analysis | Automated parity tests compare each measure against its report for the same inputs, including per-bucket sparkline values, using fixtures that contain a voided invoice and a no-company invoice |
| NFR-007 | Analysis + Golden Rules | Every new query is tenant-scoped; the two gates are enforced server-side (FR-003) |
| NFR-008 | Analysis | At Risk day boundaries and month-end as-of points are computed in the workplace's timezone |
| NFR-009 | Analysis | Each tile emits its own APM span (tile key, range length, bucket size, row count) and Datadog monitors alert when a tile passes the NFR-001 budget |
| NFR-010 | Product condition | Both report corrections ship with one plain-language release note: Sales report totals move for ranges containing voided or no-company invoices, and on Service Advisor Analysis **revenue, ELR *and the hours columns, and therefore Labor Efficiency %*** move for those periods, while advisor figures gain walk-in sales. **It must also call out the void-then-reinvoice case, where a figure can move *up*** — the report has been showing the voided invoice's numbers, so the correction swaps in different ones rather than merely removing them, and a reader must be able to tell which of the two corrections moved their figure. The production impact numbers are posted on the PRD before either merges (done for the Sales report), and the Service Advisor Analysis blast radius is posted before task 1.6 merges |

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Performance is the overriding constraint: this becomes the home page, every query must be analysed against data shape and indexes, derived tables are acceptable if needed, no DB load spikes | Intake (user) | Adopted as NFR-001…NFR-005. Measurement showed derived tables are **not** needed |
| Which baseline: the existing `SV-8311-dashboard-v1` branch or `develop`? | Intake (user) | Plan from `develop`; the branch is reference material whose FE work is ported |
| Should dashboard reads use the Aurora read replica? | User | Yes. Delay "up to 100 ms" is explicitly acceptable, and the matching reports move with it so parity holds |
| Latency budget | User | "5 s for any query is too much… if queries are optimal no query will go above 500 ms so page would load under a second" → NFR-001 |
| The Sales report includes voided invoices and drops no-company invoices, so Revenue cannot both match it and honour S3-E2 | Confluence (Chris, 2026-09-15) | Approved: fix the Sales report inside this project. Three conditions: post production impact numbers before merge, ship a release note, report the blast radius. The PRD's S3-E2 note was corrected to match |
| Sales by Customer sparkline: fixed twelve months or the tile's range? | Confluence (Chris) | Story 7 wins; S5-R5 rewritten in the PRD |
| What is one At Risk sparkline point? | Confluence (Chris) | Monthly, as of each month's last day in the workplace timezone, current window, recomputed from current data; the final point is as of **now**. Caching the eleven historical points was permitted but is not needed |
| Per-tile default ranges, and are ranges remembered? | Confluence (Chris) | This Month / Last 12 Months, not remembered; written into the PRD as S7-R7 and S7-R8 |
| At Risk table size and order | Confluence (Chris) | Ordered by twelve-month revenue with name as tiebreaker; never truncate silently. Measurement showed lists are tens of rows, so every row is listed, with a 500-row safety cap that states itself on screen |
| Does anything else read the Sales report total? | Blast-radius research + Confluence | No commission, payout or tax-filing feature exists. The report has no export. The same number is reproduced in the dashboard's own Revenue family (rebuilt here) and in Service Advisor Analysis (**approved 2026-09-16, fixed here as task 1.6**). Sales by Customer, Sales by Representative, accounting, QuickBooks and the Sales Tax Report do not move |
| **Prod query** — table sizes | User ran on production | invoice 246,652 rows (502 MB data / 223 MB index), technician_task_record 861,726, work_order_line 538,433, invoice_statement 442,384, work_order 293,825, company 156,504, credit_memo 2,770, workplace 902. Index builds here are seconds, not a migration risk |
| **Prod query** — invoices per workplace | User ran on production | 650 workplaces; last 12 months p50 98, p95 1,582, max 8,873; **max lifetime per workplace 8,875**. Every per-workplace full-history scan is bounded under 9k rows |
| **Prod query** — busiest workplace profile | User ran on production | 8,875 invoices but only **14 distinct customers**; 0 no-company invoices; 0 voids. (Its clock-record count is 9, so it is not the clock-heavy shop — the technician tiles were sized from today's report latency instead) |
| **Prod query** — At Risk timing (`EXPLAIN ANALYZE`) | User ran on production | Headline **53 ms**; the 30-month per-company monthly input for the sparkline **56 ms**, 90 groups. Both on the busiest workplace, on today's indexes → At Risk runs live, with no cache and no derived table |
| **Prod query** — Sales report impact | User ran on production | Last 12 months: 213,012 invoices; **13 voided invoices, $15,883.98, across 10 of 650 shops**; **0** no-company invoices; **0** no-work-order invoices |
| **Prod query** — clock-record volume | User ran on production | Heaviest workplaces by time-clock records over 12 months: 23,410 / 19,663 / 17,552 / 16,907 / 16,124. So the technician tiles aggregate at most ~23k rows for the widest range, against the existing `(workplace_id, start_date)` index — the last unmeasured area, and it is comfortably inside budget |
| **Prod query** — workplace scoping | User ran on production | 0 mismatches between `invoice.work_place_id` and `work_order.workplace_id`, so the fixed Sales report may scope on the indexed invoice column |
| **Prod query** — feature flag and timezones | User ran on production | `DashboardAdministrator` exists with **111 organizations enabled** → no seed migration, guard only. `DashboardAll` has no row. 946 workplaces, **0** without a timezone |

---

## 2. Architecture Overview

The dashboard is a read-only projection over calculations that already exist and belong to the reports. v1 removes the second implementation of every measure rather than adding a third — the old dashboard held five independent copies of "revenue" alone, which is how it came to disagree with the reports it was meant to mirror. What replaces it is deliberately small: one endpoint, six thin handlers that delegate, one page, one tile component.

```
                       ┌──────────────────── app/ (Vue) ────────────────────┐
  login ──► usePostLogin ──► /dashboard ──► Dashboard.vue
                                              ├─ 6 × DashboardTile  (own range, sparkline)
                                              └─ 1 × DashboardDetailPanel (chart + table)
                                                        │ one batched request, per-tile ranges
                       ┌────────────────────────────────▼───────────────────┐
                       │ POST /api/dashboard/tiles      (the only endpoint) │
                       │  gate: reportsPageAccess AND DashboardAdministrator│
                       │  allowlist: only the v1 sections                   │
                       └────────────────────────────────┬───────────────────┘
                                                        │ one fetch per tile
   ┌────────────────────────────────────────────────────▼─────────────────────────────┐
   │ ONE calculation per measure — owned by the report, read by both sides            │
   │  Revenue ........... shared totals aggregate (Sales report footer + tile)        │
   │  Billing Eff. + ELR  Service Advisor Analysis calculation                        │
   │  Tech Efficiency ... TechnicianEfficiency DataProvider (report's own)            │
   │  Tech Utilization .. TechnicianUtilization fetchers (report's own)               │
   │  Sales by Customer . SalesByCustomer fetcher count path                          │
   │  At Risk ........... dashboard-only (no report) — invoice + credit_memo, live    │
   └────────────────────────────────────────────────────┬─────────────────────────────┘
                                                        │ read-only connection
                                              Aurora READ REPLICA
```

Both the dashboard and the five report pages read through the replica, so "tile equals report" holds by construction: they run the same code against the same copy of the data. Nothing on the dashboard path is cached — the 1-hour Redis section cache is deleted along with the controller that owned it.

---

## 3. Technical Decisions

1. **Live, no cache, engineered queries** — chosen over an event-invalidated cache and over a shared report+dashboard cache. Parity then holds by construction with no invalidation machinery, and the measurements show live is affordable. *Rejected:* event invalidation (a missed write path is a parity defect, and invoice reversal can hard-delete, while clock edits and work-order-line edits emit no events) and a shared cache (it would make the reports themselves stale).
2. **One calculation per measure, owned by the report** — the tile reads the report's read port, fetcher or domain service. Where the report is a monolithic paginated fetcher (Sales, Sales by Customer), a totals/count path is extracted and both sides call it. *Rejected:* "same formula, copied SQL", which is exactly how today's five copies drifted.
3. **Reads on the Aurora read replica** (user decision) — the writer's connections peak at 65 against a 70 warning alarm while the replica sits idle at 13–18 ms lag. Both the dashboard and the five reports move together, so they never read different copies.
4. **At Risk is computed live** — no snapshot table, no cached history, despite Product allowing a cache. Headline 53 ms and full twelve-point history input 56 ms on the busiest workplace, with every per-workplace scan bounded under 9k invoices. Live keeps every point consistent with the headline and the table.
5. **No index is added on faith** (supersedes the earlier assumption that a composite invoice index was required) — each final query is EXPLAIN-verified and an index is added only where measured. Candidate if needed: `invoice (work_place_id, company_id, created_on)`.
6. **The Sales report is fixed, not worked around** — voided invoices excluded through the shared predicate, no-company invoices included, tenant scope moved to the invoice's own indexed column. Product approved with three conditions (NFR-010).
7. **Technician Efficiency reuses the report's PHP calculation once per request** and buckets in memory, because the report rounds per line and per technician; a single grouped SQL version would round differently and break parity. *Rejected:* one call per bucket (up to 31 report calculations per sparkline).
8. **A closed set of six tile keys on the one endpoint** — the S2 "anything else is a defect" rule expressed in the API. The two worst statements in today's production dashboard, the notifications lookup and the accounts-receivable join, are not gated behind it: they are deleted outright (decision 10).
9. **Statement-level circuit breaker at 2 s** — a runaway query fails its tile instead of holding an FPM worker and a database connection for minutes, which is what happens today (max observed 477 s, still returning 200).
10. **🔴 The existing dashboard is deleted, not refactored. v1 is built from scratch.** (Owner's directive, 2026-09-16: *"we def want to wipe out any dashboards we have now, and build new one from scratch, do not get confused or blocked by any current version. Current dashboards are bad code with bad performance with a lot of bugs."*)
   - **The scope on the backend is `api/src/Dashboard/**` in full, plus the orphaned `GetHoursWorkedInvoicedCompleted/**`.** ⚠️ **`api/src/Reporting/Dashboard/**` is a different thing and survives** — that is the *reports'* backend, it holds Service Advisor Analysis (which Phase 1 fixes) and the report pages Phase 6 builds on. The two directory names are one word apart. Note also that neither feature flag appears anywhere in `api/src` today, so "gated behind the flags" describes the frontend; the server-side gate is entirely new code.
   - **On the frontend the scope is everything behind the flags**: the dashboard tree, its API layer, the `DashboardReport` route, and the developer role switcher behind `DashboardAll`. `DashboardAll` is retired entirely — it has no flag row in production. `DashboardAdministrator` survives as the rollout gate for the new dashboard, with its 111 organizations intact, so those shops move from the old dashboard to the new one without an enablement step.
   - **Nothing in the current dashboard is authoritative.** Its query handlers, sections, drill-downs, card catalog, config endpoint, role defaults, caching layer and components are all removed. Where this plan names an existing dashboard file, that is **where the old behaviour lives today and what is being deleted** — not a file to edit around.
   - **No file is kept because removing it is inconvenient.** If something in `api/src/Dashboard/**` or `app/src/components/ts/dashboard/**` is not one of the six tiles' new code, it goes in this release. Nothing is left "dormant".
   - **What is reused is the reports' own calculations** (the point of the parity rule), the shared non-void predicate, the workplace timezone service, and generic app infrastructure such as the screen-size and theme composables.
   - **🔴 Two relocations must happen *before* the delete** (Phase 4 does them first):
     1. **The date-range option list, its `RangeOption` type and `computeRange`.** `app/src/utils/dateRanges.ts` is only a re-export shim over them, and accounting, reporting, both shared date selectors and the remembered-view composable import it. This is the **only** import that crosses out of the dashboard tree anywhere in the repo — verified — so this single move is what keeps the rest of the app building.
     2. **The chart wrapper, with the palette constants and bucket helper it depends on.** Not because anything outside imports them, but because the wrapper itself does, and the wrapper is being kept.
   - **The prior `SV-8311` branch is reference material, not a source to port.** Read it for the tile anatomy it worked out and for its `data-test-id` vocabulary, which the E2E plan assumes. Write the components fresh — that branch carries three requirement gaps of its own and the same performance habits being removed here.
   - **Consequence for review:** a diff that modifies a legacy dashboard query handler instead of deleting it has missed the point of this release.
11. **One batched request, independently resolving sections** — a single round trip keeps the landing page fast, but the PRD requires tiles to load and fail independently. The batch therefore streams or returns per-section results that the frontend renders as each arrives, and one section's failure is an error entry rather than a failed request. *Rejected:* six parallel requests (six auth and workplace resolutions per page load, for no gain) and a single all-or-nothing payload (one slow or failing measure would hold the whole dashboard, breaking S6-R14 and S6-R15).

**New dependencies:** none. A second Doctrine connection (read-only) is configuration, not a package.

---

## 3a. Query standard — read this before writing any query

This dashboard becomes the first screen most users see, on every visit. The old one is being deleted largely because its queries were written without this discipline. **Every query in this feature is designed, measured and justified individually. "It returns the right answer" is not the bar.**

**The rules, in order of precedence:**

1. **Measure before you commit to a query.** `EXPLAIN` locally as you write. Then, **before merge, hand the final statements to the plan's owner to run `EXPLAIN ANALYZE` on production** — that is the route that produced every measurement in §1, and there is no production-scale dataset on a developer machine or in CI. Paste the output into the pull request. A query nobody has explained is not finished, and "I could not get production data" is a reason to ask, not to skip.
2. **Index-backed, always.** No full table scan, no filesort on a large result, no dependent subquery per row. The access path must be visible in the plan, not assumed from the SQL's shape. This bar is absolute for any statement over its NFR-001 budget; for one comfortably under budget, decision 5 applies and an index is added only where it measurably helps.
   **Every dashboard statement also runs on the read-replica connection** (decision 3) — a dashboard query on the writer is a defect regardless of how fast it is.
3. **🔴 If the data structure is what stops a query being optimal, fix the structure — do not ship the slow query.** Owner's instruction, with a clear preference for *how*: **add derived data, don't reshape what exists.** In order of preference:
   1. **An index** on an existing table (additive, reversible, no data migration).
   2. **Derived data** — a new denormalized column maintained on write, or a purpose-built aggregate/summary table. **Pre-authorised: build it when measurement calls for it, without waiting for another approval round.** The maintenance story (who writes it, on which paths, how it is backfilled, how it is proven not to drift) is a required section of the pull request description, not an approval gate.
   3. **Changing an existing table's shape or semantics — avoid.** Reworking columns other features already read means migrating live data and re-testing everything that touches them: more work and more risk than the query problem being solved. If it ever looks unavoidable, it comes back to this plan as a decision, not into a pull request.
   A suboptimal query that "works for now" on the landing page is exactly the debt this release exists to pay off. Escalate rather than compromise.
4. **One fetch per tile per request, buckets included.** No query inside a loop, no query per sparkline point, no N+1 through a read model. If a measure seems to need a loop, that is a signal the calculation belongs in one grouped statement or in one pass over one result set.
5. **Budget (NFR-001): no dashboard query may exceed 500 ms**, per tile p95 ≤ 250 ms, full first load p95 ≤ 1 s, with a 2 s statement cap as the circuit breaker. A query that trips the cap is a defect, not a slow path.
6. **Never widen the scan to simplify the code.** Every statement is workplace-scoped and date-bounded at the database, not filtered in PHP after the fact.
7. **Watch what your reuse costs.** The parity rule means reusing a report's calculation, and some of those calculations carry their own problems — the Sales report issues about 36 statements per request today. Reuse the *definition*; do not inherit the access pattern. Where the report's own path is too slow for a landing page, extract a set-based path that both sides share (this is what Phase 1 does for Revenue).
8. **The measurements already taken** are in §1 and set expectations: the whole invoice table is 246k rows, the busiest workplace has 8,875 lifetime invoices, and At Risk's full-history aggregate runs in 53 ms today. There is no data-volume excuse for a slow dashboard query at this scale. If a query is slow here, it is the query.

### Why dashboard queries get expensive, and the ladder to climb when they do

The general problem is real and worth naming, because it is the reason dashboards so often end up slow. These tables are shaped for **transactional access** — fetch this work order, list that customer's invoices, write a clock record — with indexes chosen for those paths. A dashboard asks the opposite question: sweep every invoice in a period, group it, ratio it against hours from another table, then repeat per bucket for a sparkline. Row-at-a-time storage answering set-at-a-time questions is exactly where reporting features fall over, and the usual escape is to stop asking the raw tables and read something pre-shaped instead.

**The standard ladder, cheapest and safest first:**

1. **Fix the query shape.** One grouped statement instead of a loop; never fetch rows you only intend to count. Aggregate in the database **unless parity requires the report's own in-memory rounding** — Technician Efficiency deliberately does one fetch and one pass in PHP, because the report rounds per line and a grouped SQL version would round differently (decision 7). One fetch and one pass is fine; a fetch per bucket never is. Most "we need pre-aggregation" conclusions are really a query-shape problem.
2. **Give it the right index** — usually a composite matching the filter and the grouping, occasionally covering, so the plan never touches the table.
3. **Bound the work.** Every query is already workplace-scoped and date-bounded; make sure the bound is in the database and the index supports it.
4. **Derive the data.** A denormalized column maintained on write, or a purpose-built summary table. **This is pre-authorised by the owner: if a measure genuinely needs pre-aggregation, build it — do not ship a slow query to avoid the work, and do not wait for another approval round.** What it needs is evidence (the measurement that justified it) and a maintenance story: who writes it, on which paths, how it is backfilled, and a test proving it cannot drift from its source. The reason it sits at rung 4 rather than rung 1 is that on today's volumes nothing has needed it — not that it is discouraged.
5. **Reshape existing tables — off the table here.** More work and more risk than the problem being solved, per the owner's instruction.

**Two things make this project unusual, and both point the same way:**

- **The data is small.** At 246k invoices, with the busiest single workplace under 9,000 lifetime, the aggregation pressure that normally forces rungs 4 and 5 simply is not present. The heaviest thing this dashboard does — recomputing twelve months of at-risk history over a workplace's entire invoice history — measured **53 ms**. Reaching for a summary table at this scale would add a maintenance burden and a drift risk to solve a problem that does not exist yet.
- **The parity rule actively penalises pre-aggregation.** S3-R1 says a tile and its report may never disagree. Every derived copy of a number is a chance to drift from the report that number must equal, which is precisely how today's dashboard ended up with five independent copies of "revenue". So on this feature, rungs 1–3 are not just cheaper, they are safer.

**When to revisit this:** if a single workplace's invoices in the selected range pass roughly 100k, if any tile passes its NFR-001 budget on production-scale data, or if a future measure needs history that cannot be recomputed inside the budget. At that point rung 4 is the answer, starting with At Risk history, which is the only measure whose cost grows with total history rather than with the selected range. Until then, live and indexed is both faster to build and less likely to be wrong.

---

## 4. Database Changes

**No schema change is expected.** No new table, column, or migration is planned. This is a deliberate outcome of the measurements: the busiest workplace's full-history At Risk aggregate runs in 53 ms on today's indexes, so the derived tables the intake directive authorised are not needed.

Two conditional items, both decided by measurement during Phase 3 rather than up front:

| Change | Condition |
|---|---|
| `invoice (work_place_id, company_id, created_on)` index | Only if EXPLAIN on the final At Risk / Sales-by-Customer queries shows a material gain over the existing `inv__work_place_id_created_on_idx`. Table is 246k rows, so the build is seconds |
| `credit_memo (workplace_id, date_created)` index | Only if credit-memo netting shows up in EXPLAIN. The table is 2,770 rows, so this is unlikely |

> ⚠️ If either index is added, the migration is hand-written and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"), with the mapping updated alongside. Hand-authored FKs go in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`.

**Data migrations:** none. No backfill, no snapshot capture, no derived value to maintain.

**If measurement changes that** (§3a rule 3), the answer is additive: an index first, then derived data — a new denormalized column maintained on write, or a purpose-built summary table — never a reshaping of tables other features already depend on. Any such proposal states who maintains the derived value, on which write paths, how it is backfilled, and the test that proves it cannot drift from its source. On today's volumes none of this is expected: the busiest workplace's heaviest aggregate runs in 53 ms.

**Configuration change (not schema):** a second read-only Doctrine connection pointing at the Aurora reader endpoint, with its URL supplied as a deployment secret. Local and CI environments point it at the same database as the primary connection so nothing special is needed to run tests.

---

## 5. API Changes

### The one new endpoint

`POST /api/dashboard/tiles` — the whole dashboard API surface. Each requested tile carries its own date range (the tiles are independent), which is why it is a POST batch rather than a GET per tile.

### Deleted endpoints

All of these go with the old dashboard. None is gated, slimmed or retained.

| Endpoint | Why it goes |
|---|---|
| `GET /api/dashboard` | Replaced. Carried the 1-hour Redis section cache |
| `GET /api/reporting/unified` | Legacy alias for the above |
| `GET /api/dashboard/reports` | Replaced by the new endpoint |
| `POST /api/dashboard/reports/batch` | Replaced by the new endpoint (verified unused by any caller) |
| `GET /api/dashboard/config` | Per-user/per-role configuration is out of scope (S2-N1…N5) |
| `GET /api/dashboard/drilldown`, `GET /api/dashboard/drilldown/export` | Drill-downs are not one of the six tiles |
| `GET /api/dashboard/hours-kpis/{dateRange}` | Not a v1 measure, and it has no caller today |

### Modified endpoints

| Endpoint | Change |
|---|---|
| `GET /api/reporting/sales/{dateRange}` | Same shape; its **totals change** (voids out, no-company in) and it gains a set-based totals path |
| `GET /api/reporting/service-advisor-analysis/{dateRange}` | Same shape; the same correction, plus its hours columns and Labor Efficiency move (approved 2026-09-16) |

### Request / response shape for `POST /api/dashboard/tiles`

- **Auth:** `reportsPageAccess` (`ROLE_REPORT::VIEW`) **and** the organization's `DashboardAdministrator` feature. Failing either returns 403 with no data — not an empty 200, which is what happens today.
- **Per section:** `{ key, from, to, group }`, and for At Risk `{ key, riskDays }`. `group` is derived from the range by the S4-R11 rule and validated server-side.
- **Response per section:** `{ value, meta: {...}, series: [{ bucketStart, value|null }], table?: { rows, totalCount } }`.
  - **For the three ratio measures only**, `value: null` means "no value" (S3-E3) and renders as `n/a`; those measures never return 0 to mean "nothing recorded".
  - **The two count tiles are the opposite:** an empty result is the number `0`, never `null` and never `n/a` (S5-E1, S5-E2). A count section returning `null` is a defect.
  - At Risk's `meta` carries the **aggregate trailing-twelve-month revenue across all at-risk customers** (S5-R9). The frontend never sums the table rows for it, because the table can be capped while the aggregate must cover everyone.
  - `series` preserves null buckets so the frontend can leave gaps (FR-013).
  - `table.totalCount` is the full count even when `rows` is capped, so the table can state its own subset (FR-020).
- **Errors:** a section that fails returns its own error entry; the other five still return values (FR-021). No toast is triggered.
- **Pagination / bounds:** every table-shaped section is bounded — Sales by Customer by the report's own pagination, At Risk by the 500-row safety cap with `totalCount` always exact.

### No new endpoints

At Risk is served as a section of the existing batch endpoint, not as a new report API, because the PRD puts "any new report" out of scope.

---

## 6. Implementation Phases

### Phase 1: One calculation, correct, on the replica (BE)

**Implements:** FR-007, FR-008, FR-010, NFR-004, NFR-005, NFR-006, NFR-007, NFR-010
**Depends on:** nothing (starting point)

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/config/packages/doctrine.yaml` | Modify | Add a second read-only connection (reader endpoint) alongside `default` and `audit`; wire report + dashboard read paths to it |
| `api/.env`, deployment secrets | Modify | `DATABASE_REPLICA_URL`; locally and in CI it points at the same database as `DATABASE_URL` |
| `api/src/Reporting/Shared/Domain/NonVoidInvoicePredicate.php` | Reuse | The existing shared rule — applied, not re-implemented |
| `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesReportDataFetcher.php` | Modify | Apply the predicate to the invoice side; move tenant scope from `wo.workplace_id` to `i.work_place_id`; `LEFT JOIN` company and move the `companyId` filter to `i.company_id`; add a set-based `fetchTotals()` |
| `api/src/Reporting/Reports/Application/ReadModel/SalesReportDataFetcherInterface.php` | Modify | Add `fetchTotals()` to the port (one implementation, three mocking tests) |
| `api/src/Reporting/Reports/Application/Handler/SalesReportQueryHandler.php` | Modify | Footer totals come from `fetchTotals()` instead of per-row accumulation, so report and tile cannot diverge |
| `api/src/Reporting/Shared/Domain/` | Create | The invoice-side non-void fragment lives **next to `NonVoidInvoicePredicate.php`**, not in the dashboard tree that Phase 2 deletes — it is a reporting rule, and putting it anywhere else is how the copies drifted in the first place |
| `api/src/Reporting/Dashboard/Application/ServiceAdvisorAnalysis/ServiceAdvisorAnalysisQueryHandler.php` | Modify | **Task 1.6 — approved 2026-09-16.** Same corrections as the Sales report: the shared void predicate on the invoice side, `LEFT JOIN` company with the filter moved to `i.company_id`, tenant scope on `i.work_place_id`. **Also apply the predicate to `fetchInvoicedLaborTotals()` (~line 197) and `fetchInvoicedPartsTotals()` (~line 218)** — they join `invoice` filtered only by work-order id, with no date, void or tenant filter, so without it they keep returning the voided invoice's statement totals. Two further defects there, worth knowing while you are in the file: `fetchInvoicedLaborTotals` is missing the empty-input guard its parts twin has, and both group by invoice but return indexed by **work order**, so a work order with two surviving invoices silently loses one's totals to the overwrite. The void predicate removes the void case; it does not make the method correct |
| `api/src/Reporting/Dashboard/Application/ServiceAdvisorAnalysis/ServiceAdvisorAnalysisDetails/ServiceAdvisorAnalysisData.php` | Modify | **Blocker if missed:** `$companyName` is a non-nullable `string`, and `invoice.company_id` is nullable, so the moment the company join becomes LEFT a walk-in row feeds NULL and the report throws a `TypeError`. Make it nullable or `COALESCE` in SQL. The frontend model already treats it as nullable |
| `api/tests/Unit/Reporting/Dashboard/Application/ServiceAdvisorAnalysis/` | Create | ⚠️ **That literal path, mirroring `api/src/Reporting/Dashboard/Application/ServiceAdvisorAnalysis/`. Not `api/tests/Unit/Dashboard/…`, which Phase 2 deletes** — the two trees are one word apart. **This report has zero tests today** — no unit, no functional, no fixture. Per the backend rules, write characterization tests capturing current behaviour *before* changing it, then assert the corrected behaviour: voided invoices absent, walk-in rows present with a null company name, and the hours and Labor Efficiency shifts below |
| `api/src/Invoicing/Invoice/Domain/Service/InvoiceFetcher.php` | Modify | **Task 1.7 — in scope (2026-09-16).** `getInvoicedHoursForPeriod()` (the Shop Billing Efficiency numerator) has no void filter. Adding the shared predicate is ~3 lines, the method has exactly **one** consumer, and `api/tests/Unit/Invoicing/Invoice/Domain/Service/InvoiceFetcherTest.php` already exists to extend. **But it does not make Shop Billing Efficiency agree with the Billing Efficiency tile** — see the divergence note in §9 |
| `api/tests/Fixture/Reporting/SalesReportTestFixtures.php` | Modify | Add a voided invoice and a no-company invoice; today every fixture invoice is PAID with a company, so neither bug is detectable. Set the status directly — note that "reversing" an invoice hard-deletes it rather than voiding it (see §7) |
| `api/tests/Unit/.../DbalSalesReportDataFetcherTest.php` | Modify | Assert the predicate, its bound parameter list, and the LEFT JOIN in the generated SQL |
| `api/tests/…/DashboardSalesReportParityTest.php` | Note | The existing parity test is **deleted with the old dashboard in Phase 2** — it imports the handlers being removed, and being fixture-mocked it would keep passing while being wrong anyway. Phase 3 writes its replacement against the new tile handlers, with a voided invoice in the fixtures. NFR-006 points at that new test, not this one |
| `api/tests/Functional/.../SalesReport/SalesReportTest.php` | Modify | Cases for a voided invoice and a no-company invoice |

#### Key code changes

```php
// api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesReportDataFetcher.php
// Tenant scope moves to the invoice's own indexed column BEFORE the joins are loosened:
// with the scope still on wo.workplace_id, a LEFT JOIN would exclude the same rows anyway
// AND weaken a security-critical predicate. Verified safe: 0 mismatches in production.
->andWhere('i.work_place_id = :workplaceId')
->andWhere(NonVoidInvoicePredicate::sql('i.status'))
->setParameter(NonVoidInvoicePredicate::PARAMETER, NonVoidInvoicePredicate::statuses(), ArrayParameterType::STRING)
// company becomes optional; the caller's filter moves with it or it silently re-INNERs:
->leftJoin('i', Company::TABLE_NAME, 'c', 'c.id = i.company_id')
// and in fetchSalesReportData(): ->andWhere('i.company_id = :companyId')
```

#### Unit / integration tests
- The predicate is applied on the invoice side and the credit side keeps its existing void exclusion.
- A voided invoice changes neither rows nor totals; a no-company invoice appears in both.
- **Service Advisor Analysis, hours included:** a work order whose only invoice is voided leaves the report entirely, taking its Hours Worked and Hours Invoiced with it, so the report's own Labor Efficiency percentage changes; a work order that was voided and re-invoiced keeps its hours and simply stops appearing twice; a walk-in work order joins, hours included.
- **Row collapse:** rows are keyed by work order, so a work order carrying both a voided invoice and its live replacement collapses to one row today, and the last one returned wins — which under the default sort is usually the older, voided one. A test pins that the surviving row is the live invoice's.
- Report footer totals equal the set-based aggregate for the same inputs (this is the anti-drift test).
- Reads go to the replica connection and writes never do.

#### Verification (Definition of Done gates)
- **Static (scoped):** `composer cs-fix`, `vendor/bin/phpstan analyse <changed files>`, `./vendor/bin/pest <changed + mirrored tests>`
- **Smoke:** `bin/smoke-test.sh` — no 500s
- **Migration gate:** not applicable unless an index is added
- **Manual:** open the Sales report for a range containing one of the 13 known voided invoices and confirm the total drops by exactly that invoice's subtotal

---

### Phase 2: Delete the old dashboard and stand up the new module (BE)

**Implements:** FR-003, FR-006 (server side), FR-008, NFR-001, NFR-003, NFR-007, NFR-009
**Depends on:** Phase 1 (replica connection)

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/Dashboard/**` — **the whole bounded context, all 115 files.** The sub-paths here are illustrative, not a checklist: `Application/{Core,Reports,Config,Query/**,Drilldown,Contract,DTO}`, `Infrastructure/{Drilldown/**,Query/**,Config/**}`, `Domain/{Service/**,Error/**}` | **Delete** | 115 files of section handlers, drill-downs, role defaults, the config endpoint, the hand-rolled SQL builders and the Redis section cache (`CACHE_TTL_SECONDS`, `buildCacheKey()`, `unified_reports:*`, `?reset_cache=true`, `cached_at`). The routes go with them: all seven are `#[Route]` attributes on the deleted controllers, so **there is no route configuration to touch** — deleting the classes deletes the routes, and there is no eighth route hiding elsewhere |
| `api/src/Reporting/Dashboard/Application/GetHoursWorkedInvoicedCompleted/**` | **Delete** | `GET /api/dashboard/hours-kpis/{dateRange}` — no frontend caller today, and not one of the six measures. The event-log defect behind it is filed separately (Phase 7) |
| `api/tests/Unit/Dashboard/**` and `api/tests/Functional/Dashboard/**` — **those two trees exactly.** ⚠️ `api/tests/Unit/Reporting/Dashboard/**` and `api/tests/Functional/Reporting/Dashboard/**` are a different thing and **must survive**: they hold Account Payable, Account Receivable, Sales Tax, Technician Efficiency, Payroll Timesheet and punch-clock tests | **Delete** | **14 test files import `App\Dashboard\…` classes.** Left behind, the suite will not even load. Phase 3 writes the replacement tests, including a new parity test to replace `DashboardSalesReportParityTest` |
| `api/config/services.yaml` (the `App\Dashboard\Infrastructure\Drilldown\DrilldownHandlerInterface` stanza, line ~186) | Modify | **Container compile failure if missed** — and that fails *every* route, not just the dashboard's |
| `bin/smoke-test.sh` | Modify | Replace the dashboard probes: the curated list hits routes that will now 404, and a 404 on a curated endpoint counts as a stale probe rather than a pass. The new endpoint is a POST, so it may not fit the GET-only list at all — say so rather than leaving a probe that tests nothing |
| `api/src/Dashboard/…/DashboardTilesController.php` (new, one endpoint) | Create | `POST /api/dashboard/tiles` — the batch fetch, per-tile ranges, per-section results. Class-level `#[IsGranted(PermissionEnum::ROLE_REPORT_VIEW)]` plus the `DashboardAdministrator` organization check; 403 with no data on either failure. Accepts only the six v1 tile keys and rejects anything else |
| `api/src/Dashboard/…/TileRegistry.php` (new) | Create | The six tiles, each naming the report calculation it delegates to. This is the whole "sections" model now — there is no catalog, no role defaults, no per-user config |
| `api/src/Dashboard/…/Tile*QueryHandler.php` (new, six) | Create | One thin handler per tile, written fresh against the query standard in §3a. None of them carries its own copy of a measure's formula |
| `infrastructure/datadog/monitors-api.tf` | Modify | Monitor per-tile p95 against the NFR-001 budget |

> The `DashboardAll` feature flag is retired with the developer role switcher it gated; it has no flag row in production. `DashboardAdministrator` stays as the rollout gate, so the 111 organizations that have it move straight to the new dashboard.

#### Key code changes

```php
// The organization feature is data, not code: the flag row already exists with 111
// organizations enabled, so this is a guard only — no seeding migration.
#[IsGranted(PermissionEnum::ROLE_REPORT_VIEW)]
final class DashboardTilesController          // POST /api/dashboard/tiles
{
    // ... and, per request, before any section is dispatched:
    if (!$this->featureFlags->isEnabledForOrganization($organizationId, 'DashboardAdministrator')) {
        throw new AccessDeniedException();   // 403 with no data, never an empty 200
    }
```

#### Unit / integration tests
- A user without `reportsPageAccess` gets 403 from every dashboard route, including the legacy alias and the drill-downs.
- A user in an organization without the feature gets 403 even with the permission.
- A non-v1 section is rejected.
- No response carries `cached_at`, and a second identical request recomputes.

#### Verification
- **Static (scoped)** as Phase 1
- **Smoke:** `bin/smoke-test.sh` — first update its curated list, whose lines 85–86 probe `/api/dashboard` and `/api/dashboard/config`. Both are deleted, so they would return 404, which counts as a stale probe rather than a pass. The replacement is a POST, so if the curated list is GET-only, remove the probes and say why rather than leaving one that tests nothing. No route may 500
- **Manual:** with the `tech` account from `QUICK_LOGIN_USERS`, call a dashboard endpoint directly and confirm 403

---

### Phase 3: The six measures, live, with sparklines (BE)

**Implements:** FR-007, FR-008, FR-009, FR-010 (per-measure verification), FR-011, FR-013, FR-015, FR-016, FR-017, FR-020, FR-024 (server side), FR-028 (ELR data), NFR-001, NFR-002, NFR-005, NFR-006, NFR-008
**Depends on:** Phases 1–2

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
All six are **new** handlers in the Phase 2 module. The old handlers named below are gone; they are listed only so the behaviour they got wrong is not reproduced.

| File | Action | Description |
|---|---|---|
| Revenue tile handler | Create | Headline, parts/labor split and bucketed series from the Phase 1 shared totals aggregate. **The old `KpiQueryHandler` floored revenue at zero** (`max($invoicedRevenueCents - $creditsExTaxCents, 0)`, and the with-tax twin) — S3-E1 requires the true negative, and a floored tile would also disagree with the Sales report. **The old `RevenueQueryHandler`'s `labor_by_invoice` CTE is not reproduced**: it is the 21.9 s query behind today's revenue chart |
| Billing Efficiency tile handler | Create | Percentage, supporting line, per-advisor series and ELR tooltip data from the Service Advisor Analysis calculation, per bucket in one fetch. The old dashboard held **seven** separate inline copies of advisor billing-efficiency SQL, none void-filtered; none survives |
| Technician Efficiency tile handler | Create | Through the report's own `Reporting/Domain/TechnicianEfficiency/Service/DataProvider`, fetched once for the whole range and bucketed in memory (its per-line rounding is what parity requires). **Verify voids are excluded** from invoiced technician hours, and fix the source if not (S3-E2) |
| Technician Utilization tile handler | Create | Through the report's fetcher interfaces. **Verify the void exclusion** on its inputs (S3-E2) |
| Sales by Customer tile handler | Create | Count and top customer via the SalesByCustomer fetcher's own count path (**verify its void exclusion**), bucketed distinct counts for the sparkline |
| At Risk tile handler | Create | Written from the requirement, not from the old query. For the record, the old one got five things wrong: no credit-memo netting, no void exclusion anywhere in its CTE, `>= 0` where S5-R15 says `> 0` (so every customer passed that limb), UTC day maths instead of workplace-timezone calendar days, and a silent `LIMIT 200` with no name tiebreaker and no total. The new one: credit-netted revenue on the Revenue basis, voids excluded including when deciding the most recent invoice, `> 0`, workplace-timezone day boundaries, ordered by twelve-month revenue then customer name, a 500-row cap with an exact `totalCount`, and the aggregate twelve-month revenue for the supporting line (S5-R9) |
| Bucket-size resolver (new, in the Phase 2 module) | Create | Derive the bucket from the range length per S4-R11 (≤31 d day, 32–182 week, 183–731 month, longer quarter), validated server-side, with boundaries in the workplace timezone. The old dashboard took `group` from the request and silently fell back to `month`; the thresholds existed nowhere |
| `api/src/Shared/Application/WorkplaceTimezone.php` | Reuse | As-of boundaries are computed in PHP from the workplace timezone; all 946 workplaces have one, so the UTC fallback is defensive only |

#### Key code changes

```php
// At Risk history: twelve as-of points from ONE grouped fetch (56 ms measured on the
// busiest workplace), never twelve queries. The final point is as of now, not month-end,
// which is what makes it equal the headline (S5-R13).
$boundaries = $this->monthEndBoundaries($workplaceTimezone, now: $now); // 11 month-ends + now
$perCompanyMonthly = $this->fetchPerCompanyMonthlyActivity($workplaceId, $horizonStart);
$points = array_map(
    fn (\DateTimeImmutable $asOf) => $this->countAtRisk($perCompanyMonthly, $asOf, $riskDays),
    $boundaries,
);
```

```php
// Sparkline rule for every ratio measure: numerator and denominator per bucket, divided
// afterwards; a zero denominator yields null (=> "n/a"), never 0.0, and leaves a gap.
$value = $denominator > 0 ? ($numerator / $denominator) * 100 : null;
```

#### Unit / integration tests

New tests, written against the new handlers — the old dashboard's tests are deleted in Phase 2 rather than adapted. The replacement for `DashboardSalesReportParityTest` is the anti-drift test NFR-006 names, and its fixtures include a voided invoice, which the old one never had.

- **Parity, per measure:** the tile's value equals the report's value for the same workplace, range and filters — and, for each bucket, equals the report's value for that bucket's range (this is the test that catches in-memory bucketing that doesn't match a direct call).
- Zero denominator yields `null`, not `0`, for all three ratio measures and for the Revenue split — while an empty count tile yields `0`, not `null`.
- **Revenue is negative** when credits exceed sales in the range, and matches the Sales report's negative exactly.
- **A voided invoice changes nothing** in any of the six measures: not Revenue or its split, not invoiced hours, not invoiced technician hours, not utilization, not the Sales by Customer count, and not the At Risk count or its most-recent-invoice decision.
- At Risk's aggregate twelve-month revenue covers every at-risk customer, including when the row list is capped.
- The bucket size derived from each of the nine ranges matches S4-R11 at both sides of every threshold (31/32 days, 182/183, 731/732).
- At Risk: a customer with exactly $0.00 twelve-month revenue and one lifetime invoice is excluded; with two lifetime invoices is included; a voided most-recent invoice falls back to the previous non-void invoice; the count changes at the shop's midnight, not UTC's.
- The twelfth sparkline point equals the headline, for several windows.
- Sales by Customer counts a no-company invoice as a single "no company" customer.

#### Verification
- **Static (scoped)** as Phase 1
- **Performance (NFR-001/NFR-005):** capture `EXPLAIN ANALYZE` for every new or changed statement against production-scale data; no statement over 500 ms; record the numbers in the PR
- **Smoke:** `bin/smoke-test.sh` — no 500s; BE logs free of exceptions

---

### Phase 4: Delete the old screen and build the new one (FE)

**Implements:** FR-004, FR-006, FR-008 (frontend half), FR-011–FR-016, FR-018–FR-029, FR-031 (FR-017 is Phase 3, backend only)
**Depends on:** Phase 3

#### Frontend changes (`app/`)

**Step 1 — move what the rest of the app depends on OUT of the tree, before deleting anything.** These live inside the dashboard folder today but are used far beyond it, and the build breaks in accounting and reporting if they vanish:

| File | Action | Description |
|---|---|---|
| `app/src/utils/dateRanges.ts` | Modify | Becomes the **owner** of `RANGE_OPTIONS`, the `RangeOption` type and `computeRange`, instead of a shim re-exporting them from `DashboardConstants.ts`, `DashboardTypes.ts` and `utils/dateUtils.ts`. Importers stay unchanged: accounting ledger and report params, the reporting model, the work-in-progress and inventory-value reports, both shared date selectors, and `useRememberedView.ts` |
| `app/src/components/ts/shared/charts/` (new home) | Move | `BaseChart.vue` plus the two things it needs — `useChartHelpers.ts` and the chart palette constants. **It is not self-contained today:** it imports `useChartHelpers`, which imports the bucket helper and the palette from files being deleted. Moving it out is what makes "keep the chart wrapper" true |

**Step 2 — delete the rest of `app/src/components/ts/dashboard/**`:** `Dashboard.vue`, the drawer, toolbar, preview, remove button, the full-page expanded view, the entity multi-select, the cached-at footer, the drag-and-drop and config composables, the 761-line data composable, the 31 `cards/*` components, the KPI card, the role switcher, both old chart components and the old API layer.

**Including their tests — 13 Vitest specs live inside that tree** (under `tests/`, `cards/tests/`, `composables/tests/`, `layout/tests/`) plus `app/src/api/dashboard/tests/queries.spec.ts`. They import the deleted modules, and this phase's own `npx vue-tsc --noEmit` gate is project-wide, so leaving them behind fails the gate outright. This is the frontend mirror of the 14 backend test files Phase 2 deletes. The `DashboardReport` route goes too, along with its now-dead entry in `app/src/components/navigation/LocationSelector.vue`.

**Step 3 — rebuild with only what the six tiles need:**

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/dashboard/Dashboard.vue` | Create | The page: two rows of tiles plus one detail panel. Small enough to read in one sitting |
| `app/src/components/ts/dashboard/DashboardTile.vue` | Create | Label, headline, supporting line, sparkline, range or window control, report link with tooltip, and the "View details" / "View Report" footer. **Emits the test-id vocabulary the E2E plan targets** — `hero_tile_<key>`, `hero_label_<key>`, `hero_value_<key>`, `btn_toggle_details_<key>`, `link_report_<key>`, `link_view_report_<key>`, and `hero_detail_panel` on the panel. None of these exists on `develop`; without this row the page objects would target ids nothing promises |
| `app/src/components/ts/dashboard/DashboardDetailPanel.vue` | Create | The single expansion panel: the chart and/or table for whichever tile is open, built fresh rather than by reviving catalog cards |
| `app/src/components/ts/dashboard/composables/useTileExpansion.ts` | Create | One tile open at a time, persisted (FR-022) — the reference branch never persisted it |
| `app/src/components/ts/dashboard/composables/useTileRange.ts` | Create | Per-tile range with the S7-R7 defaults, **not persisted** (FR-025), and a migration step that clears the old `dashboard-card-*-range` keys so returning users do not inherit them |
| `app/src/components/ts/dashboard/composables/useTileEntityFilter.ts` | Create | Technician multi-select and single-advisor filter, persisted (FR-026) |
| `app/src/components/ts/shared/charts/BaseChart.vue` (moved in step 1) | Modify | Add ELR values per dataset for the tooltip (FR-028); it already accepts `yAxisMin`/`yAxisMax`, so it only needs a real value passed |
| `app/src/components/ts/dashboard/DashboardChart.vue` | Create | Replaces both old chart components. The new one builds datasets for the six tiles, hosts the technician/advisor filter (FR-026), and is what the report embed renders. **Its axis is a net-new algorithm, not a tweak:** the old code set `yAxisMax` to an unconditional 200 for every percentage chart, with no median and no fit-to-data, which is itself the S9-R1 violation. New behaviour: fit the data; cap at 200 only when a plotted value exceeds 200 while the median of every plotted value, pooled across all drawn lines and counting only points that have a value (even count → mean of the two middle values), stays ≤200; clipped points keep their true value in the tooltip |
| `app/src/components/ts/dashboard/composables/useTileData.ts` | Create | The batch fetch with per-tile state: each tile renders as its own section resolves, one section's failure shows only on that tile, and no tile ever shows a previous range's figure (FR-021, decision 11). Written fresh — the old 761-line composable served the catalog, not six tiles |
| `app/src/components/ts/dashboard/composables/useTileData.ts` (same file, FR-004) | Create | **Workplace scoping is net-new work, not reuse.** `useLocation.ts` is only a ref plus subscribers — it holds no query client. The behaviour that stops a previous workplace's figures flashing lives in the `Dashboard.vue` being deleted, which *removes* rather than invalidates the queries on a workplace change. Rebuild it here: subscribe to the workplace, drop the previous workplace's data outright, and **load nothing at all when no workplace is selected** (S1-E2) |
| `app/src/components/ts/dashboard/composables/useAtRiskWindow.ts` | Create | The persisted inactivity window (FR-018), defaulting to 120 days; changing it refetches headline, supporting line, sparkline and table together (S5-R12). The old composable is deleted with the tree; keep its storage key so a returning user's choice survives |
| `app/src/composables/useScreen.ts` | Reuse | `Screen.lt.md` is exactly the <1024 px boundary the PRD defines (FR-023) |
| `app/src/css/tokens.scss` | Modify | Near-black / near-white descriptive text in the two themes (FR-031) |
| `app/src/api/dashboard/**` | Replace | New query layer for one endpoint: `staleTime: 0`, refetch on mount, per-section results. The old keys, group-fetch memoization and config query go with the endpoints they called |
| `app/src/components/ts/dashboard/tiles.ts` | Create | The six tile definitions: label, formatter, default range, report link, detail content. Replaces `DashboardConstants.ts` + `ReportDefinitions.ts` (the range options having moved out in step 1) |
| `app/src/components/ts/administration/DevToolsFeatureFlags.vue`, `e2e/src/api/fixtures/fresh-org-bootstrap.ts` | Modify | Drop `DashboardAll` from the developer flag list and from the fresh-organization fixture — the flag is retired with the role switcher it gated |
| `app/src/router/routes.ts` | Modify | Remove the `DashboardReport` route; point `Dashboard` at the new page |

#### Key code changes

```ts
// Sparkline gaps are meaningful: a bucket with no value must break the line, not be
// dropped. The reference branch filters nulls out and re-projects, which silently
// closes gaps and misplaces every later point (FR-013, S4-R11).
const points = series.map((p, i) => (p.value === null ? null : { x: i, y: p.value }))
const segments = splitOnNulls(points)   // one path per run of consecutive values
const drawn = segments.filter(s => s.length >= 2)   // fewer than two points: draw nothing
```

#### Unit tests (Vitest)
- Tile renders `n/a` for a null ratio and never `0.00%`; the two count tiles render `0` for an empty result and never `n/a`.
- Each supporting line renders its exact string, including the Revenue `{count} Invoices` fallback and both At Risk forms with the aggregate twelve-month revenue.
- An extreme headline value renders in full rather than being truncated or abbreviated.
- **Failed-tile state** (FR-021, the requirement that cannot be tested end-to-end): one section's error renders that tile's error state while the other five render their figures, and no toast appears.
- **Axis** (FR-027): fits the data when the maximum is ≤200; caps at 200 for an outlier with a pooled median ≤200; does not cap when the median itself exceeds 200; even-count median uses the mean of the two middle values; a clipped point still reports its true value.
- Sparkline: interior gap preserved; a single valued point draws no line.
- Expanding a second tile closes the first; range, window and report-link controls do not expand a tile.
- Changing one tile's range leaves the others untouched, and a remount resets ranges to their defaults while the At Risk window and the expanded tile survive.
- Axis cap applies for an outlier with a pooled median ≤ 200% and not when the whole dataset is high.
- Below 1024 px: single column, no expansion, "View Report" footer, none on At Risk.

#### E2E tests (`e2e/`)
- Build the dashboard page object, the per-tile component object and the seeding helper, register the `dashboard` project in `e2e/playwright.config.ts`, and add `Last 12 Months` to the date-preset map. (The report-embed page object belongs to Phase 6, which is where the component it targets ships.)
- Workflows from this phase: the Revenue-versus-report parity check, the per-tile range workflow, single-tile expansion, and the narrow-viewport layout.
- Deliberately not E2E: the failed-tile state (no legitimate way to fail one section) and the 200% axis cap (needs an engineered outlier) — both covered by the Vitest tests above.

#### Verification
- **Static (scoped):** `npx eslint --max-warnings=0 <changed>`, `npx vitest related --run <changed>`, `npx vue-tsc --noEmit`
- **Compile:** Vite up with no errors
- **Browser-walk:** log in as the `admin` account from `QUICK_LOGIN_USERS`, open `/dashboard`, check all six tiles render, expand each, change a range, change the At Risk window, reload to confirm ranges reset while the window persists, then repeat at 900 px and in dark theme, watching the console for errors

---

### Phase 5: Access, landing and navigation (FE)

**Implements:** FR-001, FR-002, FR-005 (FR-004, workplace scoping, belongs to Phase 4)
**Depends on:** Phases 2 **and 4** — the gates must exist before the UI offers the route, *and* the new screen must exist before this phase starts landing every admin on it at login

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/composables/useDashboardAccess.ts` | Create | One `canAccessDashboard()` used by the route guard, the nav and post-login; today the check is duplicated |
| `app/src/config/navLinks.ts` | Modify | Dashboard entry immediately after Reports, using the existing `featureFlag: 'DashboardAdministrator'` (no `upsellRoute`, so it hides when off). **Do not** port the reference branch's bespoke `feature` field |
| `app/src/config/modules.ts` | Modify | Add `'Dashboard'` after `'Reports'` in the shop module's `navLinkRoutes`, or the desktop menu will never render it |
| `app/src/composables/usePostLogin.ts` | Modify | Precedence: explicit `?redirect=` → Dashboard when both gates pass → existing last-page / first-permitted logic |
| `app/src/components/ts/navigation/desktop/DesktopMenu.vue` | Modify | Logo becomes inert: no `router-link`, no `trackHomeLogoClick`, no hover affordance. **`homeRoute` here means the logo's binding only** — the field itself lives on `app/src/config/modules.ts` and is read by `ModuleSelector.vue`; removing it breaks the module selector |
| `app/src/components/ts/navigation/desktop/tests/DesktopMenu.spec.ts`, `DesktopMenu.analytics.spec.ts`, `app/src/components/ts/navigation/tests/Navigation.analytics.spec.ts` | Modify | **Delete the cases that assert the old behaviour, don't adapt them** — they test a feature that no longer exists: "renders the desktop logo link", "logo is wrapped in a router-link", "navigates to Work Orders when the logo is clicked", "navigates to the Dashboard when the logo is clicked", and both logo-click analytics cases. Their file-level comments also state that the logo is the only Dashboard entry point, which S1-N5/N6/N9 invert. Add cases asserting the logo renders no link and fires no analytics |
| `app/src/components/ts/navigation/mobile/MobileMenu.vue` | Modify | Logo moves outside the menu button; the button gets its own menu icon, keeping its existing test ids |
| `app/src/router/routes.ts` | Modify | Keep the existing guard, delegating to `useDashboardAccess` |

#### Unit tests
- Nav entry shows only with both gates, and sits directly after Reports.
- Post-login: both gates → dashboard; either gate missing → Work Orders; `?redirect=` always wins.
- Direct navigation to `/dashboard` without access redirects to Work Orders rather than erroring.
- The logo renders no link and fires no analytics at any width; the mobile menu button still opens the menu.

#### E2E tests (`e2e/`)
- **Reference breakage — mandatory and uncapped, not deferrable.** The scan found **no spec that asserts the post-login landing page**, so nothing breaks on that basis. Two real items remain, plus one correction worth recording:
  - `e2e/tests/auth.setup.ts` mints every stored session for every role. Admin-tier sessions will now land on the dashboard instead of Work Orders, so its post-login wait and landmark must be re-verified. Its own comments already warn that a session saved without organization features silently fails this exact gate, and the fresh-org fixture enables `DashboardAdministrator` on every new organization, so this fires as soon as the landing ships.
  - Any spec whose first action assumes the post-login page is Work Orders must be re-run rather than reasoned about; the suite's convention of navigating explicitly is what protects it.
  - **Service Advisor Analysis specs** (`e2e/tests/ui/advisor-analysis.spec.ts`, `e2e/tests/ui/reporting/advisor-analysis-row-nav.spec.ts`, plus their page object and seed helper) assert columns, filters and navigation rather than money, so they should keep passing — but the row-nav spec's docblock documents the report's inner-join semantics and goes stale with task 1.6. Update it rather than leaving a comment that contradicts the code.
  - **Correction:** `e2e/tests/permissions/wo-page-permissions.spec.ts` does *not* break. It calls `helper.navigateTo('workorders')` before asserting the URL, so it is testing a guard, not a landing page. An earlier draft of this plan listed it as breakage; it is not.
- New workflow from this phase: the access-gating workflow, covering both directions of the gate.
- The top-nav page object survives the new nav entry, because its locators match by exact label and nothing counts nav links.

#### Verification
- **Static (scoped)** as Phase 4 — note `usePostLogin` and both menus have existing specs
- **Browser-walk:** log in as `admin` (lands on the dashboard) and as `tech` (lands on Work Orders and cannot open `/dashboard`); click the logo at desktop and mobile widths and confirm nothing happens

---

### Phase 6: The chart on the report pages (FE)

**Implements:** FR-030
**Depends on:** Phases 3–4

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/reporting/shared/ReportVisualization.vue` | Create | Port, but fetch through a TanStack Query composable rather than calling the API module directly (house rule for new server state). The axis rule from FR-027 applies here too — the embedded chart is the same component, so it inherits fit-to-data and the conditional 200% cap |
| `app/src/components/ts/reporting/shared/reportVisualizations.ts` | Create | The report-key → chart/series map for the four pages |
| `app/src/components/ts/reporting/Sales.vue`, `ServiceAdvisorAnalysis.vue`, `technician-efficiency/TechnicianEfficiency.vue`, `technician-utilization/TechnicianUtilizationReport.vue` | Modify | Mount the chart above the table, fed by the report's own filter state; Show/Hide persisted per report; no controls or report link of its own |

#### Unit tests
- The embedded chart follows the report's range and technician/advisor selection and has no controls of its own.
- Show/Hide persists per report. **Default: shown** — the PRD does not specify one, and this matches the prior build; called out here because it is a choice, not a requirement.
- The axis behaves as it does inside a tile, including the conditional 200% cap.
- Deselecting every technician on the utilization report hides the chart rather than requesting an empty set.

#### E2E tests (`e2e/`)
- Build `e2e/src/pages/reports/report-visualization.component.ts` here, alongside the component whose test id it targets.
- The embedded-chart workflows sit in the Backlog for this run: the chart following each report's own filters, and the Show/Hide state being remembered per report.

#### Verification
- **Static (scoped)** as Phase 4
- **Browser-walk:** open each of the four reports, confirm the chart matches the table for the same filters, toggle Show/Hide and reload

---

### Phase 7: Follow-up tickets (no code in this release)

**Implements:** nothing here — the deletions moved into Phases 2 and 4, where the new code replaces them
**Depends on:** Phases 2–6
- **File these tickets (approved 2026-09-16), each linked back to the PRD page and written so the next person does not have to rediscover the cause:**
  1. The Sales Follow-Up report's "total spend" counts voided invoices.
  2. The Customers Spending widget counts voided invoices (on a balance basis rather than the subtotal basis).
  3. The Sales Tax Report does not exclude voided invoices. Independent of this project, but it is the tax surface, so Product wants it visible in the backlog.
  4. **The event log records an invoice and never reverses it on void.** The Hours Worked / Invoiced KPI reads `invoice.created.work.order.data.log` and therefore counts voided invoices' hours, and no query-side predicate can reach it. Written as an event-log defect rather than a screen disagreement, because **nothing in the frontend calls that endpoint** — it is already orphaned, and v1 removes its last reason to exist (Out of Scope drops every measure that is not one of the six). The orphan endpoint is deleted or gated here too.

---

## 7. Testing Strategy

### Unit tests
- **Backend:** measure calculations and their bucketing, the At Risk predicate in full (both qualifying limbs, the timezone boundary, the void fallback), `n/a` semantics, the gates, and the allowlist.
- **Frontend:** tile rendering including `n/a` and gaps, single-tile expansion, per-tile range independence and reset-on-revisit, persistence of the window/filters/expanded tile, the axis cap, and the small-screen switch.

### Integration tests
- **Parity (the central rule, NFR-006):** for each measure, the dashboard section and the matching report produce identical values for identical inputs — both at the headline level and per sparkline bucket, with fixtures that include a voided invoice and a no-company invoice.
- Replica routing: dashboard and report reads use the read connection; writes never do.

### Manual testing checklist
1. Sales report total for a range containing a known voided invoice drops by exactly that subtotal.
2. Each tile equals its report for the same workplace and range, with no filters applied.
3. Switching workplace reloads every tile; with no workplace selected nothing loads.
4. A shop with no clock records shows `n/a` on the three ratio tiles, not `0.00%`.
5. At Risk: change the window through all five values and confirm headline, supporting line, sparkline and table move together; confirm the last sparkline point equals the headline.
6. Kill one section server-side and confirm only that tile shows its error state, with no toast.
7. Dark theme and 900 px width.

### E2E tests (Playwright)

Specs live in `e2e/tests/ui/dashboard/`. **Register a `dashboard` project in `e2e/playwright.config.ts`** (`testMatch: ['**/dashboard/*.spec.ts']`, `storageState: '.auth/admin.json'`, `dependencies: ['setup-admin']`, not `fullyParallel` because these seed data) — a spec that belongs to no project silently never runs.

**New page objects / helpers**

| Path | Purpose |
|---|---|
| `e2e/src/pages/dashboard/dashboard-hero.page.ts` | The real `/dashboard`: `RELATIVE_URL='dashboard'`, `open()`, `waitForSettled()`, `tile(key)`, `expandedPanel` |
| `e2e/src/pages/dashboard/dashboard-tile.component.ts` | Per-tile component object over the `hero_*` / `btn_toggle_details_*` / `link_report_*` test ids, the range chip and the inactivity-window control |
| `e2e/src/pages/reports/report-visualization.component.ts` | `btn_toggle_visualization_<reportKey>` plus the embedded chart, shared by the four report pages |
| `e2e/src/pages/dashboard/dashboard-seed.helper.ts` | Backdated work order → invoice → clock-record seeding and cleanup, mirroring `sales-by-customer-seed.helper.ts` |
| `e2e/src/utils/filter-presets.ts` | **Extend:** `DATE_PRESET_VALUES` has no `Last 12 Months`, which is the Sales by Customer default |

> ⚠️ **Naming collision.** `e2e/src/pages/dashboard/dashboard.page.ts` is *not* a dashboard page object — it holds top-nav and global-search locators, and the `dashboardPage` fixture that exposes it is referenced across **18 files**. The new page object is deliberately named `dashboard-hero.page.ts`. Renaming the old one to `pages/navigation/top-nav.page.ts` belongs in its own ticket, not this batch.

**The five workflows for this implementation run** (`coverage-policy.md` §3 `batchCap = 5`):

**Test: Owner reaches the Dashboard while each gate turns a user away** (Happy + Edge, FR-001/FR-002/FR-003)
1. Log in as admin (organization feature on, has `reportsPageAccess`).
2. Assert the landing URL is `/dashboard` and the Revenue tile is visible.
3. Assert the Dashboard nav entry exists and is the immediate next sibling after Reports.
4. In a second context, log in as a role seeded **without `reportsPageAccess`** and navigate directly to `/dashboard`.
5. In a third context, log in as a user **with** the permission but in an organization where `DashboardAdministrator` has been **disabled** for the test, and navigate directly to `/dashboard`.
- **Expected:** the admin lands on `/dashboard`; both gated users land on `/workorders`, from login and from the deep link, and neither sees a Dashboard nav entry. Step 5 is what proves the organization gate, and it must disable the feature explicitly, because the fresh-organization fixture turns it on.

**Test: Revenue tile matches the Sales report for the same range** (Happy path, FR-008)
1. Seed a customer and one invoiced work order with a known total dated inside This Month.
2. Open `/dashboard` and read the Revenue headline at its This Month default.
3. Click the tile's report link.
4. Wait for the Sales report table to settle.
- **Expected:** the report opens on `reports/sales` at `range=this_month` and its total equals the tile headline exactly.

**Test: Changing one tile's range leaves the others alone and does not persist** (Edge case, FR-024/FR-025)
1. Seed invoices in This Month and Last Month.
2. Open `/dashboard`; record all six headlines at their defaults.
3. Change only the Revenue tile to Last Month.
4. Assert the other five headlines are unchanged.
5. Reload `/dashboard`.
- **Expected:** Revenue shows a placeholder, never the previous figure, while reloading; siblings are untouched; after reload every tile is back on its default range.

**Test: One tile expands at a time** (Edge case, FR-019)
1. Open `/dashboard` at 1280 px.
2. Expand the Revenue tile and assert the detail panel shows Revenue content.
3. Expand the Technician Efficiency tile.
- **Expected:** exactly one detail panel exists at any moment, and it swaps to Technician Efficiency content.

**Test: Narrow viewport stacks tiles and offers View Report** (Edge case, FR-023/FR-031)
1. Set the viewport to 900 px wide and open `/dashboard`.
2. Inspect all six tiles.
- **Expected:** a single column; no expand control renders; the five non-At-Risk tiles show a "View Report" link; At Risk shows no footer link.

**Backlog** (deferred beyond the cap — a non-zero backlog fails the coverage check, so the PR carries the override marker with a reason)

| Workflow | Why deferred |
|---|---|
| Ratio tile renders exactly `n/a` | Needs a clock-free workplace — see the blocker below |
| At Risk inactivity window, default and persistence | Distinct control plus browser storage; own workflow |
| At Risk sparkline: twelve monthly points, last one equal to the headline | Needs backdated invoices across twelve months; the backend test covers the arithmetic |
| Chart technician multi-select, including deselect-all hiding the chart | Chart internals; needs a seeded technician set |
| Chart advisor single-select | Same |
| ELR in the Billing Efficiency tooltip only | Narrow chart internals |
| Embedded chart follows each report's own filters | Four pages × filter matrix |
| Show/Hide chart remembered per report | Browser-storage workflow |
| Parity for the other four tiles | The Revenue one is the representative case |
| Report-link tooltips; At Risk has no report link | Absence-only assertions; fold into the specs above |

**Covered by component tests instead of end-to-end, deliberately** (these are *not* backlog items and must not be counted as deferred coverage): the failed-tile state, because there is no legitimate way to fail one section; the 200% axis cap, which needs an engineered outlier; the absence of delta indicators; the At Risk table's "Showing 500 of N" message; and the "no extra series" rule, asserted as a dataset count. All are specified as Vitest cases in Phase 4.

**Pre-approved skip reasons:** none apply. This change touches Vue components, the router and backend controllers, so it is squarely inside the UI-affecting filter.

**Test data.** Already solvable: invoices at a chosen date (the invoice factory accepts `createdOn`); backdated clock records (the technician-task factory takes raw dates — the convenience wrappers are hours-from-now only; a work-order clock must stay department-less while an internal clock needs a department, or the seconds double-count); at-risk customers via an invoice dated past the window; advisors, technicians and sales reps via the staff factory; the denied side of the gate via the role seeder plus the feature-flag helper.

> 🔴 **Verified while planning: the invoice factory's `reverse()` does not void an invoice — it hard-deletes it** (`api/src/Invoicing/Invoice/Application/Service/InvoiceReversalService.php` holds the only invoice hard-delete, and voids the carry-credits, not the invoice). A voided invoice is produced by adding a line to an already-invoiced work order — **but only when that invoice is still `pending`** (`api/src/VehicleService/WorkOrders/Application/Line/Create/CreateCommandHandler.php:157`). Adding a line to a **sent or paid** invoice splits the work order into a new one instead and voids nothing. So test data that invoices, marks paid, then adds a line will produce a split, not the voided invoice the test needs. Backend fixtures should set the status directly.

**Blockers to resolve before the deferred items can be written**
1. **The `n/a` workflow needs a workplace with no clock records.** Both the persistent staging org and the fresh-org fixture seed clocked time. A dedicated clock-free workplace looks reachable through the workplace factory plus staff enrolment and a location re-pin, but it needs backend confirmation that the ratio's denominator is workplace-scoped and that zero clock records really produce `n/a`.
2. **A single failing tile cannot be produced in E2E.** Network interception is banned by the no-workarounds rule and there is no API lever to fail one section. This requirement is covered by a Vitest component test, and that substitution is deliberate, not an oversight.
3. **The fresh-org fixture already enables `DashboardAdministrator`**, so the gate-denied test must disable it explicitly or use a permission-less role; it cannot assume a fresh org has the flag off.
4. **Local runs** use persistent mode with no fresh-org bootstrap, so the gate-denied half needs the same local-environment guard the login spec already uses.

---

## 8. Rollback Plan

- **The dashboard itself** is gated by an organization feature that 111 organizations already have. Disabling `DashboardAdministrator` for an organization removes the nav entry, the landing behaviour and API access for it immediately, with no deploy.
- **Phases 2–6** are ordinary application changes: revert the release.
- **Phase 1 needs thought.** The Sales report correction changes user-visible totals, so a revert reintroduces voided invoices into the totals. It ships with the release note (NFR-010), and the impact is bounded and known: 13 invoices, $15,883.98, ten shops. If a shop disputes a figure, the answer is which of the two corrections moved it.
- **The replica connection** can be pointed back at the writer by configuration alone, with no code change, if replica lag or capacity ever misbehaves.
- **No schema change**, so there is no migration to reverse.

---

## 9. Security Considerations

- **FR-003 / NFR-007 — server-side gating is the control.** Today an authenticated user without report permission receives a 200 with empty meta from the dashboard endpoints, and the organization feature is not checked at all on the server. After this release there is **one** dashboard endpoint, and both gates sit on it, returning 403 with no data. The old routes are not gated; they are gone.
- **Tenant scoping.** Every new or modified query stays scoped by workplace. The Sales report's scope moves from the joined work order to the invoice's own column, which is verified equivalent in production (0 mismatches) and is not weakened by the loosened joins — the ordering of those two changes is called out in Phase 1 precisely because doing them the other way round would silently drop the predicate.
- **The read replica** uses a distinct read-only credential, so a report path cannot write.
- **Denial of service through expensive queries** is addressed by the section allowlist (the two heaviest statements in today's dashboard become unreachable), the 2 s statement cap, and the bounded batch.
- **No new personal data** is exposed: every figure is already visible to the same users through the reports the same permission grants.

### Known divergence after v1: "Billing Efficiency" is two different measures

The dashboard's **Billing Efficiency** tile matches the **Service Advisor Analysis** report, as the PRD requires. The product also ships a separate **Shop Billing Efficiency** report, and the two compute *both* sides of the ratio differently:

| | Service Advisor Analysis (and therefore the tile) | Shop Billing Efficiency |
|---|---|---|
| Invoiced hours | Every non-declined line on the work order | Only lines that reached an invoice statement |
| Worked hours | Clock records on those work orders | All billable clock records overlapping the range, workplace-wide |

They share a name and measure different things, which predates this project. **Excluding voided invoices from Shop Billing Efficiency (task 1.7) removes one source of disagreement but cannot make the two tie**, because the structural difference remains. Anyone expecting the tile and that report to match after task 1.7 will still find they do not. Closing the gap properly means deciding which definition *is* billing efficiency and retiring the other — a product decision, a second round of movement in a shipped report, and out of scope here.

---

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| FR-001 | 5 | App | `app/src/config/navLinks.ts`, `app/src/config/modules.ts`, `app/src/composables/useDashboardAccess.ts` | Planned |
| FR-002 | 5 | App | `app/src/composables/usePostLogin.ts`, `app/src/router/routes.ts` | Planned |
| FR-003 | 2 | API | `DashboardTilesController.php` (new) | Planned |
| FR-004 | 4 | App | `composables/useTileData.ts` (new — net-new work, not reuse; includes S1-E2, load nothing with no workplace) | Planned |
| FR-005 | 5 | App | `app/src/components/ts/navigation/desktop/DesktopMenu.vue`, `app/src/components/ts/navigation/mobile/MobileMenu.vue` | Planned |
| FR-006 | 2, 4 | API, App | `TileRegistry.php` (new), `dashboard/Dashboard.vue` (new), `dashboard/tiles.ts` (new) | Planned |
| FR-007 | 1, 3 | API | Phase 1 shared calculations + the six new tile handlers | Planned |
| FR-008 | 1, 2, 3 | API | Shared calculations; the old cache deleted with its controller; the new parity tests | Planned |
| FR-009 | 3 | API | Revenue tile handler (new) — no zero floor | Planned |
| FR-010 | 1 | API | `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesReportDataFetcher.php`, `ServiceAdvisorAnalysisQueryHandler.php` (task 1.6, approved) | Planned |
| FR-011 | 3, 4 | API, App | The three ratio tile handlers; `dashboard/tiles.ts` (formatters) | Planned |
| FR-012 | 4 | App | `dashboard/DashboardTile.vue` (new), `dashboard/tiles.ts` | Planned |
| FR-013 | 3, 4 | API, App | Bucket-size resolver (new); `DashboardTile.vue` sparkline | Planned |
| FR-014 | 4 | App | `DashboardTile.vue` — no delta element exists; pinned by a Vitest case | Planned |
| FR-015 | 3, 4 | API, App | Sales by Customer tile handler (new); `Dashboard.vue`, `DashboardTile.vue` | Planned |
| FR-016 | 3, 4 | API, App | At Risk tile handler (new); `composables/useAtRiskWindow.ts` (new) | Planned |
| FR-017 | 3 | API | At Risk tile handler (new) | Planned |
| FR-018 | 4 | App | `composables/useAtRiskWindow.ts` (new) | Planned |
| FR-019 | 4 | App | `composables/useTileExpansion.ts` (new), `DashboardDetailPanel.vue` (new) | Planned |
| FR-020 | 3, 4 | API, App | At Risk tile handler (cap + exact total); `DashboardDetailPanel.vue` renders `Showing 500 of N at-risk customers`, pinned by a Vitest case | Planned |
| FR-021 | 4 | App | `composables/useTileData.ts` (new) | Planned |
| FR-022 | 4 | App | `useTileExpansion.ts`, `useTileEntityFilter.ts`, `useAtRiskWindow.ts` (all new) | Planned |
| FR-023 | 4 | App | `DashboardTile.vue`, `app/src/composables/useScreen.ts` | Planned |
| FR-024 | 3, 4 | API, App | `POST /api/dashboard/tiles`; `composables/useTileRange.ts` (new) | Planned |
| FR-025 | 4 | App | `useTileRange.ts` (defaults, not persisted, clears the old storage keys), `dashboard/tiles.ts` | Planned |
| FR-026 | 4 | App | `composables/useTileEntityFilter.ts` (new), `dashboard/DashboardChart.vue` (new) | Planned |
| FR-027 | 4 | App | `dashboard/DashboardChart.vue` (net-new axis algorithm), `shared/charts/BaseChart.vue` (moved) | Planned |
| FR-008, FR-024 | 4 | App | `app/src/api/dashboard/**` (new query layer: one endpoint, `staleTime: 0`, per-section results) | Planned |
| FR-028 | 3, 4 | API, App | Billing Efficiency tile handler (ELR data); `shared/charts/BaseChart.vue` (tooltip). S9-R7 "no extra series" pinned by a Vitest case asserting the dataset count | Planned |
| FR-029 | 4 | App | `DashboardTile.vue`, `dashboard/tiles.ts` (tile→report map) | Planned |
| FR-030 | 6 | App | `app/src/components/ts/reporting/shared/ReportVisualization.vue`, `reportVisualizations.ts` + the four report pages | Planned |
| FR-031 | 4 | App | `Dashboard.vue`, `app/src/css/tokens.scss` | Planned |
| NFR-001 | 2, 3 | API | The six new tile handlers (statement cap); EXPLAIN evidence in the PR | Planned |
| NFR-002 | 3 | API | The six new tile handlers | Planned |
| NFR-003 | 2 | API | `TileRegistry.php` + tile-key validation on the new endpoint | Planned |
| NFR-004 | 1 | API | `api/config/packages/doctrine.yaml` | Planned |
| NFR-005 | 1, 3 | API | EXPLAIN evidence per statement | Planned |
| NFR-006 | 1, 3 | API | New parity tests against the new tile handlers (replacing the deleted `DashboardSalesReportParityTest`), `api/tests/Fixture/Reporting/SalesReportTestFixtures.php` | Planned |
| NFR-007 | 1, 2 | API | `DashboardTilesController.php` + per-query workplace scoping | Planned |
| NFR-008 | 3 | API | `api/src/Shared/Application/WorkplaceTimezone.php` | Planned |
| NFR-009 | 2 | API, Infra | Per-tile spans in the new endpoint; `infrastructure/datadog/monitors-api.tf` | Planned |
| NFR-010 | 1 | Process | Release note + PRD comment | Planned |
| Build safety | 4 | App | `app/src/utils/dateRanges.ts` and `shared/charts/**` — relocated **before** the tree is deleted, or accounting and reporting fail to build | Planned |
| FR-001 | 5 | E2E | `e2e/tests/ui/dashboard/dashboard-access-gating.spec.ts` | Planned |
| FR-002 | 5 | E2E | `e2e/tests/ui/dashboard/dashboard-access-gating.spec.ts`; re-verify `e2e/tests/auth.setup.ts` (the landing changes for admin sessions) and refresh the stale landing comment in `e2e/tests/ui/login.spec.ts`. `wo-page-permissions.spec.ts` does **not** break — it navigates explicitly | Planned |
| FR-003 | 5 | E2E | `e2e/tests/ui/dashboard/dashboard-access-gating.spec.ts` (deep-link half) | Planned |
| FR-008 | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-report-parity.spec.ts` | Planned |
| FR-019 | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-tile-expansion.spec.ts` | Planned |
| FR-021 (loading half, S6-R14) | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-tile-ranges.spec.ts` asserts the placeholder rather than a stale figure | Planned |
| FR-021 (failure half, S6-R15) | 4 | App (Vitest) | Not E2E-testable — no legitimate way to fail one section; a component test covers it, and it is **not** a backlog item | Planned |
| FR-023 | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-small-screen.spec.ts` | Planned |
| FR-024 | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-tile-ranges.spec.ts` | Planned |
| FR-025 | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-tile-ranges.spec.ts` (reload half) | Planned |
| FR-027 | 4 | App (Vitest) | Axis behaviour needs an engineered outlier; covered by a component test, **not** a backlog item | Planned |
| FR-031 | 4 | E2E | `e2e/tests/ui/dashboard/dashboard-small-screen.spec.ts` | Planned |
| FR-011, FR-016, FR-017, FR-018, FR-026, FR-028, FR-029, FR-030 | 4, 6 | E2E | Backlog — see §7; the PR carries the coverage override marker | Backlog |
| FR-008 (other four tiles) | 4 | E2E | Backlog — Revenue is the representative parity case for this run | Backlog |

---

## 11. Verification Tickets

_Filled in after the plan is approved._

| Ticket | Title | Covers | Linked stories | Assignee |
|---|---|---|---|---|
| SV-… | … | … | … | … |

When all these tickets are marked Done, the feature is ready for QA.