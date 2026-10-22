# A/R and A/P Report Sorting, Export and Location Filter — Technical Implementation Plan

**Date:** 2026-10-21
**PRD:** [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter) (v4, 2026-10-20)
**Jira epic:** [SV-11315](https://shopview.atlassian.net/browse/SV-11315) — stories SV-11531 … SV-11539
**Design:** [A/R and A/P Report Sorting (design canvas)](https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4) — see the 🎨 note: the canvas was not readable by the planning account; the PRD's reuse rule makes the existing native report components the design source.
**Tech stack:** Symfony 7.4 / DBAL 4 raw-SQL fetchers on the read replica (`api/`), Vue 3.5 + Quasar 2 + TanStack Query (`app/`), Playwright (`e2e/`)
**Estimated complexity:** High (six reports rebuilt end to end; new SQL read models; shared report-kit changes)

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** none blocking. G-DATA ran 2026-10-21: no open invoices with a NULL due date (nothing to do); 16 open overpaid invoices across 13 accounts, so for those accounts the A/R Summary Totals will no longer include them (Totals = rows, D7) — FYI to Product drafted, not yet posted. Legacy Cypress deletions confirmed by the user (2026-10-21).

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it. E2E coverage is not part of `/implement`: run `/e2e-after-change` before `/create-pr`.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> 🎨 **Design access.** Design files are never copied into the repo or shipped with this plan; open them from the link. Use the **DesignSync** tool (load it with `ToolSearch` `select:DesignSync`), with `get_project` / `list_files` / `get_file` and the project id from a `claude.ai/design/p/<projectId>` link. `get_file` is capped at 256 KiB, so check `.truncated`. A `claude.ai/artifact/<id>` canvas opens with the **Artifact** tool (`action: "read"`), and a `figma.com` link with the Figma MCP. WebFetch and curl return 403. Project sub-agents (`be-*`, `fe-*`, `e2e-implementer`) don't have these tools, so the orchestrator opens the link and passes what a phase needs (the boards it cites) into the agent's prompt.
> **For this plan specifically:** the canvas (`claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4`, owned by the design authority, Chris Ward) returned "not found / not shared" to the planning account. Try it again before Phase 2; if it still fails, ask Chris to share it. Until then the PRD text plus the native components named in §2 are the design. Only three things are genuinely new: the pinned push-up group row (S4-R6/R7, net-new component), the info icon's *placement* beside a report title (S8-R1; `ReportInfoIcon.vue` itself exists), and the hourglass Past due chip icon (a material ligature).

> ⚡🔒 **Performance and security are top priorities for every phase.** Before writing code, read §9. Every new read path must be paginated or bounded, tenant-scoped, and backed by an index, with no N+1 or per-row fan-out. Every new endpoint must enforce authorization. Where §9 says data is derived or backfilled, keep it up to date on the write paths it lists. When a phase is dispatched, the orchestrator includes the §9 items that phase touches in the implementer's prompt.

> 🚫 **Independence note.** A branch `origin/SV-11315-ar-ap-sorting` (28 commits, based 2026-10-14, no PR) implements an earlier take on this PRD. This plan was deliberately built from `develop` without reading it (engineering decision, 2026-10-20). Do not merge, cherry-pick or copy from it unless the user says so.

---

## 1. Requirements (extracted from PRD)

The PRD carries its own stable IDs; they are reused verbatim as this plan's FR IDs. Story ↔ Jira: Story 1 = SV-11531, Story 2 = SV-11532, Story 3 = SV-11533, Story 4 = SV-11534, Story 5 = SV-11535, Story 6 = SV-11536, Story 7 = SV-11537, Story 8 = SV-11538, Story 9 = SV-11539. Full requirement text lives in the PRD; one-line summaries here.

**Story 1 (SV-11531) — opening order**
- S1-R1 Summaries open A→Z by name · S1-R2 case-insensitive plain character order ("10 Trucking" < "2 Trucking") · S1-R3 accents fold to base letter (full table incl. ß→ss, æ→ae, œ→oe, ø→o) · S1-R4 ties by lower-cased name, then the entity · S1-R5 Detail buckets fixed order 91+ → Current, rows by name, ties by number · S1-R6 Collection/Unpaid groups by name, rows oldest first · S1-R7 opening column marked sorted · S1-R8 (v4) Summaries/Collection/Unpaid 30 customers or vendors per page; Detail reports 100 lines per bucket then more on scroll; paging never repeats or skips · S1-N1 no Reports → Page Access, no reports · S1-E1 customer with nothing open not listed

**Story 2 (SV-11532) — header sorting**
- S2-R1 every listed column sorts (except S2-N1) · S2-R2 first click by data type, second reverses, third repeats first · S2-R3 active column reverses on first click · S2-R4 ID/No. number-aware, also the universal tie-break · S2-R5 grouped reports sort rows inside groups, groups never move · S2-R6 blanks last both directions · S2-R7 sort kept across as-of/paging/filter changes · S2-R8 not remembered between visits · S2-R9 re-sort never changes expansion · S2-N1 A/P Unpaid Vendor Name not clickable · S2-E1 all-equal column shows no change

**Story 3 (SV-11533) — export**
- S3-R1 native Export menu (PDF, CSV) on all six; replaces A/R Print · S3-R2 PDF downloads · S3-R3 exports = screen rows, filters, sort · S3-R4 as-of line format · S3-R5 Locations / Past due / Customer(s)/Vendor(s) lines, names in tick order · S3-R6 Location column rule as on screen · S3-R7 "91 And Over" heading, one line in PDF · S3-R8 flat CSV, plain 2-dp money, blank empty bucket, YYYY-MM-DD dates · S3-R8a A/R Collection CSV Phone + (gated) Credit term columns; PDF on the customer line · S3-R9 row count = customer/vendor rows or document rows · S3-R10 success / empty toasts · S3-N1 PDF > 2,000 refused before generation (2,000 allowed) · S3-N2 CSV > 50,000 refused (50,000 allowed) · S3-N3 exactly one message · S3-EH other failures: "We couldn't export this report. Please try again." (these six only)

**Story 4 (SV-11534) — collapse/expand and pinned group rows**
- S4-R1 header chevron Collapse all / Expand all with tooltip above · S4-R2 later-arriving groups expanded after Expand all · S4-R3 button never sorts · S4-R4 (v4) both Detail reports: 100 lines per bucket then more on scroll · S4-R5 per-group chevron down/right · S4-R6 pinned push-up group row · S4-R7 group label stays visible on horizontal scroll · S4-R8 re-sort and paging keep expansion · S4-R9 expansion not remembered · S4-N1 as-of / filter change collapses all · S4-N2 Summaries have no Collapse all

**Story 5 (SV-11535) — filters**
- S5-R1 filter row order As of, Customer|Vendor, Past due, Location · S5-R2 native Location chip/menu · S5-R3 (v4) location list = every location with open documents in this report on the as-of date; not narrowed by any filter · S5-R4 names as the location switcher · S5-R5 opens with all ticked · S5-R6 chip wording · S5-R6a no locations → empty state, no totals, no Location column, empty export · S5-R7 (v4) a row belongs to its own document's location (A/P: bill → delivery; return credit → return; other credit → vendor) · S5-R8 Summaries add up only chosen locations · S5-R9 chip visibility · S5-R10 locations in the URL, comma lists read, "No locations" not kept, all = All · S5-R10a filters not remembered between visits · S5-R11 Summary drill-down carries as-of, past due, locations · S5-R12 no visibility change · S5-R13 native Customer (as SBC) / Vendor (as IV) chips, multi-select · S5-R14 linked customer/vendor named on the chip · S5-R15 Past due chip (Any, four ranges, "N ranges") · S5-R16 transaction reports keep invoices/bills in range, always keep credits · S5-R17 Summaries list accounts with some amount in range, at full balances · S5-R18 Totals = exactly the remaining rows, every page, PDF, CSV · S5-R19 (v4) customers/vendors and Past due in the URL like Location · S5-N1 single location → no chip · S5-N2 unknown/foreign location in a link ignored · S5-N3 unknown Past due value → Any · S5-E1 empty result keeps Location chip visible · S5-E2 top-right location switch reloads (sort resets, groups collapse, filters and rows stay)

**Story 6 (SV-11536) — Location column**
- S6-R1 label "Location" on all six · S6-R2 shown when ≥2 locations ticked (All counts when the list has ≥2) · S6-R3 position after Date (Summaries: after name) · S6-R4 Summaries show name or "Multiple" · S6-R5 sorts A→Z, "Multiple" as text · S6-N1 one location → hidden on screen and in export

**Story 7 (SV-11537, fixes SV-5706) — document links**
- S7-R1 link only when permitted and openable in its own location · S7-R2 current-location invoice/part sale → finance page · S7-R3 enrolled other location → switch prompt (exact copy) · S7-R4 Switch location switches and opens · S7-R5 Cancel stays exactly where the user was · S7-R6 bill at current location → delivery; other location → plain text · S7-R7 native report link style · S7-R8 new tab opens the document page (which prompts itself) · S7-R9 vendor credit → its vendor return, same rules as a bill · S7-R10 A/R credit memos and deposits plain text · S7-N1 not enrolled → plain text · S7-N2 no permission → plain text · S7-E1 location switcher unchanged

**Story 8 (SV-11538) — descriptions and layout**
- S8-R1 info icon beside the title with the six descriptions · S8-R2 title, icon and Export menu on one line at 1440 px · S8-R3 pinned bold headline column; every column fits at 1440 px with the stated wrap rules · S8-R4 native totals row style · S8-R5 progress bar; empty state with Clear all filters keeping the as-of · S8-R6 load failure message · S8-N1 descriptions not in exports

**Story 9 (SV-11539) — A/R Collection call list**
- S9-R1 "Phone: …" on the customer group row · S9-R2 "Credit term: …" for 'View and Manage AP/AR Data' users (COD when unset) · S9-R3 in PDF (line) and CSV (columns) · S9-N1 no phone → no label · S9-N2 no permission → no credit term anywhere

**Non-functional requirements** (origin noted)
- **NFR-001** *(intake directive 1)* — every aging read (rows, totals, counts, exports, location options, customer/vendor options, id validation) on the read replica via `#[ReadReplica]`, pinned by `ReportFetchersReadReplicaTest`.
- **NFR-002** *(analysis)* — every list read SQL-paginated with a total ORDER BY ending in a unique key; page size clamped by `ReportPaginator::clampPageSize`; no in-memory paging.
- **NFR-003** *(analysis)* — export refused on a lean COUNT before any projection; CSV streamed row by row.
- **NFR-004** *(analysis, security)* — organization predicate on every root table and inside every derived table / UNION branch; workplace joins are LEFT JOIN with `organization_id` in the ON clause; every id list validated against the organization.
- **NFR-005** *(analysis; Inventory Value incident 2026-08-24)* — FE sends one request per settled filter change: chip→query path debounced (~400 ms), superseded requests aborted, opening fetch gated until URL state is reconciled.
- **NFR-006** *(analysis + prod data)* — A/P queries drive from the organization's vendors so they never scan other tenants' bills.
- **NFR-007** *(analysis)* — per-endpoint statement budget pinned by a query-budget test that also asserts the writer saw zero aging statements.
- **NFR-008** *(analysis)* — `company (organization_id, name)` and `part_vendor (organization_id, name)` indexes; others only with EXPLAIN evidence.
- **NFR-009** *(intake directives 2–3)* — background exports: **moved by Product to a later phase of this epic (SV-11445), designed and specified before it is planned. Not part of this plan.**
- **NFR-010** *(intake directive 4)* — ride-along optimizations the rework touches (§3 D11).

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Intake 1: "for the most of the reports, we might want to move reads to read replica instead of using writer" | intake | Adopted as NFR-001. The `#[ReadReplica]` mechanism exists (PRs #3741/#3742, 2026-10-18); A/R aging fetchers already use it, A/P fetchers did not. ~1 s replica lag accepted earlier as not a Product question. |
| Intake 2–3: "see if we need to utilize background processing for exports … ask for product and design instructions" | intake → Confluence | Asked as Q1. Product: keep sync exports and limits this release; background exports become a later phase of this epic (SV-11445), designed before planned. |
| Intake 4: "parts of existing work … that could be optimized" | intake → user | User chose ride-alongs the rework touches (D11); larger items are follow-ups (listed in D11). |
| Run scope: plan independently of the existing branch | user | "Full plan as if greenfield" — the existing branch was not read. |
| Q1 Background exports | Confluence (comment 958627841; answer 958824457) | Later phase, SV-11445; Out of Scope updated. |
| Q2 A/P row location | Confluence → resolved by evidence (correction 961282050) | PRD v4 S5-R7 states it per document. A vendor account is per (vendor, location) on every write path (delivery, manual credit, return credit), so `vendor_account.workplace_id` already is the document's location. Prod: 0 of 267,705 open bills differ; QA: 0 of 12,236 bills and 0 of 1,303 return credits. |
| Q3 Old single-threshold Past due link | Confluence | Removed from S5-R19 (never shipped). S5-N3 stands. |
| Q4 Detail report paging | Confluence | S1-R8 restated per report; S4-R4 covers A/R Detail. |
| Q5 Past due vs Location list | Confluence | Not narrowed; changes only with the as-of date. |
| Q6 Stale epic description | Confluence | Updated by Product. |
| Q7 Architecture | user | Rebuild on the shared report kit in `Reporting/Reports`; delete the legacy `Reporting/Dashboard` aging code. |
| Q8 Optimization scope | user | Ride-alongs only (D11). |
| Q9a Open A/P bills per org (top 10) | prod query | `SELECT pv.organization_id, COUNT(*) … FROM vendor_transaction vt JOIN vendor_account va … JOIN part_vendor pv … WHERE vt.vendor_transaction_type='delivery' AND vt.balance<>0 GROUP BY … LIMIT 10` → largest 23,176; 10th 3,553. Every top-10 shop's unfiltered A/P Detail exceeds the 2,000-row PDF cap; CSV cap has 2× headroom. |
| Q9b Platform-wide open bills | prod query | `SELECT COUNT(*) FROM vendor_transaction WHERE vendor_transaction_type='delivery' AND balance<>0` → 267,701. Table estimates: vendor_transaction 203,864; inventory_delivery 312,692; customer_transaction 446,681; vendor_credit 4,733. Today's A/P plan scans ~11× the largest shop's rows and ~500× a small shop's → D12. |
| Q9c Bills at a different location than their vendor account | prod query | 267,705 open; **0** differ; 17 without a delivery → D13. |
| Q9d Open A/R invoices per org (top 10) | prod query | Largest 2,459 invoices; ≤162 customers per org. A/R volume is small; A/P is the hot path. |
| PRD Review "For engineering" #4: confirm totals match today's on production-shaped data | prd-review | Planned as the Phase 2 parity gate plus data check G-DATA (§9). Totals = sum of rows is a PRD decision. |

## 2. Architecture Overview

```
 app/  (Reports > Finance)                               api/  (Reporting/Reports, read replica)
 ┌───────────────────────────────────────┐               ┌──────────────────────────────────────────────┐
 │ <AgingReport>.vue  (.report-shell)     │  GET (debounced, abortable)                                 │
 │  ReportToolbar: title + ReportInfoIcon │─────────────▶ │ UI/HTTP/{ArAging,ApAging}/*Controller        │
 │   + SubActionsDropDown (PDF/CSV)       │               │  └ AgingReportRequestDto (asOf, ids, pastDue,│
 │  FilterBar: As of · Cust|Vend ·        │               │     locations, pagination) + ValidOrganization│
 │   Past due · Location                  │               │     Scope (org-wide, narrow-only)            │
 │  ReportSortableHeaderRow (sort, toggle)│               │ Application/Handler → Domain/Repository port │
 │  grouped body + ReportPinnedGroupRow   │               │ Infrastructure/…/Dbal/Aging/                 │
 │  AgingDocumentLink → switch prompt     │               │  Ar|ApOpenDocumentsSql (UNION ALL branches,  │
 │  totals row (page-1 meta)              │               │   org in every branch, SQL buckets/balances) │
 │ useAgingReportFilters / useDebounced…  │               │  *SortFields → ReportPaginator (page/totals/ │
 │ useReportExport · useReportGroupExp…   │               │   fetch|iterateAllWithinCap)·#[ReadReplica]       │
 └───────────────────────────────────────┘               │ Export: table builders → CsvAttachment…      │
                                                         │   (streamed) | ReportPdfRenderer (WeasyPrint)│
                                                         └──────────────────────────────────────────────┘
 Legacy api/src/Reporting/Dashboard/** aging code + its FE api fns: deleted in Phase 5.
```

The six reports move from the legacy `Reporting/Dashboard` module (PHP-side bucketing, unordered paging, 4-level correlated EXISTS, writer reads on A/P, totals that ignore filters) to new read endpoints in the canonical `Reporting/Reports` layout. Each report is one SQL "open documents" derived table (a UNION ALL of document branches with the as-of balance replay computed once per row), from which rows, groups, subtotals, totals and counts all derive, so filters, sort, paging, totals and export agree by construction. Nothing outside the six reports consumes the legacy code (two docblock mentions only).

## 3. Technical Decisions

| ID | Decision | Chosen by | Rationale / rejected alternatives |
|---|---|---|---|
| D1 | All aging reads on the replica (`#[ReadReplica]`), registered in `ReportFetchersReadReplicaTest::readReplicaClasses()` | user (directive 1) | Replica live in prod since 2026-10-18. Staging/QA reader = writer. No dashboard tile reads these reports, so the tile-parity ruling (`api/config/services.yaml:338-341`) does not bind. |
| D2 | New org-wide, narrow-only location scope (`ValidOrganizationScope`, `OrganizationLocationsScopeResolverInterface`), not `AccessibleWorkplaceResolver` / `DbalReportLocationsScopeResolver` / `#[ValidReportScope(kind:'location')]` | agent | The shared seam is enrollment-scoped and falls back to the active workplace; the PRD forbids both. Keeps RULE 1 and RULE 2 of `ReportLocationsScopeResolverInterface`. |
| D3 | Export caps count-first; `ExportRowCapGuard` and `ReportPaginator::fetchAllWithinCap` gain an optional `int $maxRows` (default stays 10,000); new `iterateAllWithinCap` for streamed CSV with an eager guard | agent | S3-N1 "refused before anything is generated". Rejected: a second guard class; the WIP/TU cap-after-build pattern. |
| D4 | Name order `name COLLATE utf8mb4_0900_ai_ci`, then `LOWER(name) COLLATE utf8mb4_bin`, then the entity id | agent | Measured on MySQL 8.0.46: the columns' own `utf8mb4_unicode_ci` fails S1-R3 (æ, ø); `0900_ai_ci` folds all 62 pairs and satisfies S1-R2. Rejected: changing column collation (blast radius); PHP folding (breaks SQL paging). |
| D5 | FE: debounce chip→query (~400 ms), abort superseded queries, gate the opening fetch | agent | NFR-005. Rejected: an Apply button (UX change). |
| D6 | Rows carry the document's `workplaceId` and a typed `link { kind, targetId, workplaceId }` | agent | SV-5706 root cause; replaces the FE's `startsWith('P')` guess with the stored bare-number product rule. |
| D7 | Totals via `ReportPaginator::totals()` over the same filtered builder; identical on every page; FE reads page-1 meta | agent | S5-R18; fixes both confirmed totals bugs and the FE `lastPageMeta` bug. |
| D8 | Credit term gated server-side on `ROLE_ACCOUNT_RECEIVABLE_REPORT::VIEW` ('View and Manage AP/AR Data') in the controllers; the key is omitted, not nulled; reports stay gated on `ROLE_REPORT::VIEW` | agent | S9-R2/N2; `AccountReceivableReportAuthorizationTest` pins that report access alone is never denied. |
| D9 | As-of label via the existing `AsOfAnchorResolver` (`api/src/Reporting/Shared/Application/AsOf/`), wrapped by a thin `AgingAsOfResolver` that supplies the workplace timezone and produces both formats: PDF "As of Oct 15, 2026", CSV "As of: Oct 15, 2026" (`M j, Y`) | agent | Fixes the A/R PDF printing the next day's date (S3-R4). |
| D10 | Rebuild in `api/src/Reporting/Reports/` (canonical layout), SQL-side buckets; delete legacy `Reporting/Dashboard` aging code after the FE switch | user | Rejected: extending legacy in place (money-column sorting would need the whole set sorted in memory; legacy layout and 4-level correlated query would stay). |
| D11 | Ride-alongs: A/P fetchers and location-name lookups on the replica; shared FE `useReportExport`, `useReportGroupExpansion`, aging column constants, `.report-link`; delete orphan `shell/LocationFilter.vue`, `shell/CustomerTypeaheadFilter.vue`, `PrintARReportButton.vue`, `asOfDateToDisplay`; per-format export cap | user | Follow-ups (not in this plan): the 12 legacy `Reporting/Export` bookkeeping CSV exports (uncapped, unstreamed, writer); the central page-size floor in `Paginator::fromRequest()`; the Technician Utilization export N+1; migrating IV/WIP/PV/TU/SBC/SBR onto `useReportExport`; de-duplicating the five scoped report-link CSS copies; a real-MySQL CI lane. |
| D12 | A/P branches drive `part_vendor` (org) → `vendor_account` (`va__vendor_id_idx`) → `vendor_transaction` (`vt__vendor_account_id_vendor_transaction_type_idx`) via a `/*+ JOIN_PREFIX(pv, va) */` hint; **no** `organization_id` denormalization | agent (Q9b) | Prod: 267,701 open bills platform-wide vs 23,176 for the largest shop. Existing indexes suffice. Kept as a gate: if EXPLAIN on the staging clone shows rows examined > 1.5× the shop's own bills or latency > 1.5 s, revisit denormalization. `STRAIGHT_JOIN` rejected (SQLite can't parse it). |
| D13 | A/P row location = `vendor_account.workplace_id`, behind one expression (`ApDocumentLocation`) | agent (Q2/Q9c) | Equal to S5-R7's per-document rule by construction (every write path finds or creates the (vendor, location) account); prod 0 mismatches. Bill links target the delivery (`vt.reference_id`); return-credit links target `vendor_credit.origin_payment_id` → `vendor_return`. |
| D14 | Routes `GET /api/reporting/reports/{ar-aging-summary, ar-aging-detail, ar-aging-collection, ap-aging-summary, ap-aging-detail, ap-unpaid-invoices}`; Detail rows at `/{slug}/buckets/{bucket}/rows`; `/{slug}/locations`; `/{slug}/export?format=csv|pdf`; `ar-aging/customers`, `ar-aging/customers/resolve`, `ap-aging/vendors`, `ap-aging/vendors/resolve` | agent | Reconciles the BE and FE planners' names; matches the FE route names. |
| D15 | Sort whitelist keys = the FE column `name`s (snake_case, §6 Phase 1 column table) | agent | One vocabulary for sort params, `header_<code>_<col>` ids and existing `_cell_<col>` E2E ids. |
| D16 | Past due tokens `1-30, 31-60, 61-90, 91-plus` on the wire and in the URL | agent | Avoids vue-router decoding `+` as a space. |
| D17 | Location-column visibility: FE computes on screen from (option-list size, ticked set) with the same rule the export controller applies server-side; one shared test-vector table pins both | agent | Avoids an extra statement on every page (BE planner) while screen and export agree (FE planner). |
| D18 | Customer chip `multi-search` (as Sales By Customer, S5-R13); Vendor chip `multi` with the organization's vendor list, searchable over 8 (as Inventory Value, S5-R13) | agent | PRD says "exactly as" each. A/P orgs have hundreds of vendors (QA 437) — a flat `multi` list is what IV ships. |
| D19 | Link permission matrix (S7 prerequisites → `permissionService`): **work order** = `canView('invoicingPayments') && canView(getWorkOrderViewArea('workorder'))`; **part sale** = `canView('invoicingPayments') && canView(getWorkOrderViewArea('parts'))`; **bill / vendor return** = `canView('vendorOrderManagement') \|\| canEdit('vendorOrderManagement')`; **A/R Summary customer** = `canView('customers')`; **A/P Summary vendor** = everyone with report access. Built once per render, not per cell. | agent | No extra `Parts` route check: `routingService.ts:25-31` already admits Parts for VOM view/edit, so it would be redundant. |
| D20 | `asOfDate` clamped to today in the request DTO | agent | The native date chip already caps at today (`maxDate`); label and data always agree. |
| D21 | Pinned group row = scroll-driven overlay (`ReportPinnedGroupRow` + `useReportPinnedGroup`) showing the group row's chevron and full label — on A/R Collection including "Phone:" and "Credit term:" (S9-R1/R2) — but no money cells (the group's subtotals stay in its own row) | agent | CSS sticky inside q-table's single tbody overlaps instead of pushing up (S4-R6). The group row itself carries no money cells today on the label side, so the pinned copy reads the same. |
| D27 | "No locations" (S5-R6a) is never sent to the server: the FE sets `queryEnabled = false`, renders `[]` (no totals, no Location column, empty state with Clear all filters) and short-circuits export to the "Empty export" warning. `locations` absent = all; a full selection is sent as absent. `emptyEqualsDefaultKeys` is **not** set for `locationIds` (unlike Sales By Customer). | agent | The API has no "none" token by design; an empty param would otherwise read as All and export everything. |
| D28 | Empty-export detection reads the report's server count, never loaded rows: Summaries `pagination.rowsNumber`; Collection/Unpaid `totals.documentCount`; Detail `totals.rowsNumber` from the groups query | agent | On Detail reports with every bucket collapsed no rows are loaded, so a loaded-rows check would wrongly say "Empty export" (S3-R10). |
| D29 | Unknown or unresolvable customer/vendor/location ids in a link are dropped by the FE during the opening reconcile (resolve endpoint / option list) before any request, so the BE 422 is never reached from the UI | agent | Mirrors S5-N2 for customers/vendors (a deleted or merged customer in an old link must not break the report). The BE stays strict. |
| D30 | URL keys `asOfDate`, `customerIds` / `vendorIds`, `pastDue`, `locationIds` (repeated keys written, comma lists also read); legacy `customerId` / `vendorId` read once as aliases. Selections keep **tick order** end to end (chip state → URL → export params → resolve endpoint returns request order); only `pastDue` is normalized to menu order. `carryAcrossLocationSwitch: ['locationIds']` — every other filter rides the URL across a location switch (`useReportFilters` docblock), which is what S5-E2 needs. | agent | S3-R5 tick order, S5-R10, S5-R19, S5-E2. |
| D31 | Customer search (`ar-aging/customers`) searches all of the organization's customers, as Sales By Customer's chip does; vendor list = all of the organization's vendors, as Inventory Value's chip does | agent | S5-R13 "exactly as". |
| D32 | Phone shown only when non-blank: `NULLIF(TRIM(c.telephone), '')`, raw otherwise (the customer card shows the raw value) | agent | S9-R1, S9-N1. |
| D22 | Info icon placed per report inside `ReportToolbar #title`, not in `Reporting.vue` | agent | `Reporting.vue` feeds ~25 reports. |
| D23 | `ReportSortKey { expression, blanksLast }` handled by `ReportPaginator::applyOrderBy()` | agent | S2-R6 blanks last in both directions; backward compatible with plain-string whitelists. |
| D25 | Document link/text test ids carry the document id, not only the number: `link_<code>_doc_<documentId>` / `text_<code>_doc_<documentId>` | agent (E2E pass) | A/P invoice numbers are user-entered and repeat across vendors; number-keyed ids would collide in Playwright strict mode. |
| D24 | SQL must parse on the SQLite test DB: day counts via `TO_SECONDS`/`FLOOR` (not `TIMESTAMPDIFF`), JOIN_PREFIX hint (not `STRAIGHT_JOIN`), test-only `REGEXP_SUBSTR`/`REGEXP_REPLACE`/`LPAD` functions and `utf8mb4_0900_ai_ci`/`utf8mb4_bin` collations in `api/tests/Support/SqliteFunctionsEventSubscriber.php`; MySQL behaviour proven by a committed literal-SQL check run in a throwaway `mysql:8.0` container | agent | The legacy A/P SQL never actually ran in CI (DriverException treated as pass). |

No new dependencies.

## 4. Database Changes

### New tables / Modified tables
Two indexes, hand-written migration + mapping counterparts:

```sql
-- Illustrative shape only, NOT the migration to copy-paste
CREATE INDEX c__organization_id_name_idx  ON company     (organization_id, name);
CREATE INDEX pv__organization_id_name_idx ON part_vendor (organization_id, name);
```
Mappings: `api/src/Customer/Customers/Infrastructure/Doctrine/Company.orm.xml` and the `part_vendor` mapping under `api/src/PartsCatalogue/Vendors/Infrastructure/Doctrine/` (`<index name="…" columns="organization_id,name"/>`). They serve the customer/vendor search, resolve and the A/P driving step; they do **not** serve the name ORDER BY (different collation, D4).

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`.

Conditional (EXPLAIN evidence only): `deposit` / `credit_memo (organization_id, date_created)` if rows examined for the largest org exceed ~50k. Rejected: `vendor_transaction (type, balance, date)` (cross-tenant), `vendor_credit (vendor_account_id, balance)`, `inventory_delivery` covering, `customer_transaction (account, type, reference_id)`.

### Data migrations
None planned. **G-DATA (before Phase 2 ships, §9):** if production has open invoices with a NULL `due_date`, decide between replicating `CreditTerms::getDueDate` in SQL and a batched CLI backfill of `invoice.due_date` (never one long transaction). No derived/denormalized data is introduced (D12).

## 5. API Changes

### New endpoints
All `GET`, `#[IsGranted(PermissionEnum::ROLE_REPORT_VIEW)]`, camelCase keys, money as integer cents, dates ISO-8601 UTC, reader connection.

**Common request (`api/src/Reporting/Reports/UI/HTTP/Aging/DTO/AgingReportRequestDto.php`, implements `RequestPayload`; reuses `ReportListRequestDto::parseUuidList()`):** `asOfDate` (required, `Y-m-d\TH:i:s.v\Z`, clamped to now, D20) · `customers` / `vendors` (comma UUIDs, `#[ValidOrganizationScope]`) · `locations` (comma UUIDs; absent = all) · `pastDue` (comma tokens, D16) · `pagination[page|rowsPerPage|sortBy|descending]` (clamped).

**Errors:** 422 malformed UUID / unknown or foreign id (`Unknown location|customer|vendor "<id>".`) / unknown `pastDue` token / bad `asOfDate` / unknown bucket; export 400 `ReportExportTooLargeError` with the exact S3-N1 / S3-N2 text; export 422 unknown `format`.

| Route | Response `data` | Paging |
|---|---|---|
| `ar-aging-summary`, `ap-aging-summary` | `collection[{customerId|vendorId, customerName|vendorName, locationName ("Multiple" / "" ), currentCents, days1To30Cents, days31To60Cents, days61To90Cents, days91PlusCents, totalCents}]`, `totals{…}`, `pagination{…, rowsNumber}` | 30 rows |
| `ar-aging-detail`, `ap-aging-detail` (groups) | `groups[5]{bucket, label, rowsNumber, amountCents, openBalanceCents}` in fixed S1-R5 order, `totals{…, rowsNumber}` | — |
| `{detail}/buckets/{bucket}/rows` | `collection[DocRow]`, `pagination{…, rowsNumber}` | 100 rows |
| `ar-aging-collection`, `ap-unpaid-invoices` | `collection[{customerId|vendorId, name, phone? (A/R), creditTerm? (A/R, key absent without permission), amountCents, openBalanceCents, rowsNumber, rows[DocRow]}]`, `totals{amountCents, openBalanceCents, documentCount}`, `pagination{…, rowsNumber = groups}` | 30 groups |
| `{slug}/locations` | `collection[{id, name}]` name order; only `asOfDate` honored | — |
| `ar-aging/customers` (`search`, `limit ≤ 50`), `ap-aging/vendors` (org vendor list) | `collection[{id, name}]` | bounded |
| `ar-aging/customers/resolve`, `ap-aging/vendors/resolve` (`customers=` / `vendors=`) | `collection[{id, name}]` in request (tick) order | bounded |
| `{slug}/export?format=csv|pdf` | streamed `text/csv` attachment / `application/pdf` attachment | capped 50,000 / 2,000 |

**"No locations"** is not representable on the wire by design (D27): the FE never calls the endpoints in that state. **Unknown ids** from old links are dropped by the FE before the request (D29); the 422 exists for direct API misuse.

`DocRow = { documentId, date, workplaceId|null, locationName, transactionType, documentNumber, customerId|vendorId, customerName|vendorName, dueDate|null, daysPastDue|null, amountCents, openBalanceCents, link: { kind: work_order|part_sale|bill|vendor_return, targetId, workplaceId } | null }`. `link` is null for credit memos, deposits and vendor credits not from a vendor return.

### Modified endpoints
None in place. Legacy `/api/reporting/account-receivable/{aging-summary-report, aging-detail-report, collections-report, pdf}` and `/api/reporting/account-payable/{aging-summary-report, aging-detail-report, unpaid-invoices-report}` are removed in Phase 5 (after the FE and E2E factories move).

## 6. Implementation Phases

Each phase ships BE + FE together for the reports it covers, so no report loses its Print button or links mid-way. Old endpoints stay until Phase 5. Per-phase details reference the BE plan class names below.

### Phase 1: Shared kit and foundations
**Implements:** NFR-001 (validator, resolver), NFR-002, NFR-003 (kit), NFR-004 (validator), NFR-005, NFR-008, D3, D4, D5, D16, D17, D23, D24; enabling S2-R4, S2-R6, S3-N1/N2, S5-R10, S5-R15, S7-R5, S7-R7
**Depends on:** nothing. **No visible change.**

#### Database changes:
| Migration/Change | Description |
|---|---|
| `api/migrations/Version20261021XXXXXX.php` | `company (organization_id, name)`, `part_vendor (organization_id, name)` + mappings (§4) |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/Reporting/Shared/Application/Export/ExportRowCapGuard.php` | Modify | `assertWithinCap(callable $count, ReportExportNarrowHint $hint = …, int $maxRows = self::MAX_ROWS)`; default 10,000 unchanged |
| `src/Reporting/Shared/Application/Export/ReportExportNarrowHint.php` | Modify | cases `AgingPdfTooLarge`, `AgingCsvTooLarge` with the exact S3-N1/N2 strings |
| `src/Reporting/Shared/Application/Export/ReportExportFormatter.php` | Modify | `date()` gains `ReportExportFigureStyle $style = Display`; `Spreadsheet` → `Y-m-d` (S3-R8) |
| `src/Reporting/Shared/Infrastructure/Persistence/ReportPaginator.php` | Modify | `maxRows` on `fetchAllWithinCap`; new `iterateAllWithinCap` (guard runs eagerly, body returns a private generator); `applyOrderBy` understands `ReportSortKey` |
| `src/Reporting/Shared/Application/ReportSortKey.php` | Create | `{expression, blanksLast}` (D23) |
| `src/Reporting/Shared/Application/Validator/ValidOrganizationScope.php` + `src/Reporting/Shared/Infrastructure/Validator/ValidOrganizationScopeValidator.php` | Create | `kind: location|customer|vendor`; org-owned check, no enrollment, `#[ReadReplica]` (D2) |
| `src/Reporting/Shared/Application/Export/OrganizationLocationsScopeResolverInterface.php` + `src/Reporting/Shared/Infrastructure/Persistence/DbalOrganizationLocationsScopeResolver.php` | Create | "Locations:" label + multi-location flag from (ids, optionCount); `#[ReadReplica]` |
| `src/Reporting/Reports/Domain/Model/Aging/{AgingBucket,PastDueRange,AgingDocumentKind}.php` | Create | bucket boundaries (one source of truth), tokens (D16), kinds |
| `src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/Aging/AgingSql.php` | Create | `DAYS_PAST_DUE`, bucket ordinal, name keys (D4), number-aware document key (S2-R4), credit-memo/deposit number composition mirroring `ShopScopedDocumentNumber::composeForDocumentFamily`, `LOCATION_AGGREGATE` (copied from `DbalSalesByCustomerFetcher.php:152-153`) |
| `tests/Support/SqliteFunctionsEventSubscriber.php` | Modify | `REGEXP_SUBSTR`, `REGEXP_REPLACE`, `LPAD`; collations `utf8mb4_0900_ai_ci` (ICU root, primary strength), `utf8mb4_bin`; confirm it registers on the reader connection and that intl exists in CI |
| `tools/sql/aging-name-order-check.sql` (+ expected output) | Create | MySQL literal-only proof of S1-R2/R3/R4 and S2-R4 (D24) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `src/components/ts/shared/filters/{Model.ts,FilterChip.vue,FilterOptionListPanel.vue,FilterSearchListPanel.vue,MobileFilterSheet.vue}` | Modify | opt-in `fullSelectionNarrows` flag: no "All <noun>" for a full selection, select-all row ticked only when empty ("Past due: 4 ranges", S5-R15) |
| `src/composables/useFilterUrlSync.ts`, `src/composables/useReportFilters.ts` | Modify | opt-in `commaListKeys` (read comma lists, S5-R10), thread `isValidValue` (S5-N2/N3), getter `defaults` + `liveDefaults` (location default known only after options load) |
| `src/composables/useReportTableQuery.ts` | Modify | pass `{ signal }` to `fetchPage` (additive; other six reports unchanged) |
| `src/composables/useWorkOrderLocationResolver.ts` | Modify | `cancelBehavior: 'redirect' | 'stay'` (default redirect, byte-identical), `promptSwitch(workplaceId)`, `'stay'` cancel closes the dialog with no toast/no push (S7-R5) |
| `src/composables/{useDebouncedFilterState.ts,useReportGroupExpansion.ts}` | Create | D5; `collapseOn` excludes sort/page (S2-R9, S4-R8, S4-N1), Expand-all mode covers later groups (S4-R2) |
| `src/components/ts/reporting/shell/{useReportExport.ts,ReportSortableHeaderRow.vue,ReportPinnedGroupRow.vue,useReportPinnedGroup.ts}` | Create | shared export runner (one toast per outcome, injectable messages); hand-rolled sortable header with `sortOrder: 'da'` first-click for money/Past due, chevron Collapse-all cell with tooltip `anchor="top middle"`; pinned overlay (D21) |
| `src/components/ts/reporting/aging/{agingColumns.ts,Model.ts,useAgingReportFilters.ts,agingDocumentLinks.ts,AgingDocumentLink.vue,useAgingDocumentSwitch.ts,useAgingBucketPages.ts,agingExport.ts}` | Create | filter defs + gate + debounce; link resolution (D6, D19); bucket pages; aging-only export messages |
| `src/css/app.scss` | Modify | `.report-link` (S7-R7), `.report-group-label` (sticky left, S4-R7), `--report-z-group-pinned`, `.aging-col--wrap` |
| `src/boot/axios.ts` | Modify | six `reporting/reports/<slug>/export` entries in `silentFailEndpoints` with `[...TOASTS_ONLY, 'transport']` — `TOASTS_ONLY` is `[400, 404, 500]` and does **not** silence a lost connection (`axios.ts:930`), which would add a generic "Network Error" toast beside the PRD message (S3-N3, S3 Error Handling) |
| `src/api/reporting/{ReportingModel.ts,index.ts,keys.ts,queries.ts}`, `src/testing/handlers.ts` | Modify | new types, fetchers (with `signal`), keys, MSW handlers |
| `src/components/ts/reporting/shell/{LocationFilter.vue,CustomerTypeaheadFilter.vue}` + `shell/tests/*` for both | Delete | orphans since SV-9279 (D11) |

#### Key code changes:
```php
// api/src/Reporting/Shared/Infrastructure/Persistence/ReportPaginator.php — eager guard, lazy rows
public function iterateAllWithinCap(QueryBuilder $qb, PaginationData $p, array $sortFields, array $defaultSortFields,
    callable $count, ReportExportNarrowHint $hint, int $maxRows): iterable
{
    $this->capGuard->assertWithinCap($count, $hint, $maxRows); // throws BEFORE any streamed header
    $this->applyOrderBy($qb, $p, $sortFields, $defaultSortFields);
    $qb->setMaxResults($maxRows);
    return $this->rows($qb); // private generator over iterateAssociative()
}
```
```ts
// app/src/composables/useDebouncedFilterState.ts — chips/URL update instantly; only `settled` feeds query keys
export function useDebouncedFilterState(source: Ref<FilterState>, { wait = 400, immediateKeys = ['asOfDate'] } = {}) { /* … */ }
```

#### Unit / Integration tests:
- BE: guard exactly/over a custom limit and default unchanged; `iterateAllWithinCap` throws before the first row; `ReportSortKey` blanks last both directions; formatter `Y-m-d`; bucket/past-due boundaries; `AgingSql` number key ordering (S1-99 < S1-100 < S1-101, S2-… after S1-…); collation chain over every S1-R2/R3/R4 example; composed-number parity vs `ShopScopedDocumentNumber`; validator 422 for foreign and unknown ids; resolver label/flag test vectors (shared with FE, D17); the six existing reports' export tests still green.
- FE: 5 rapid ticks → 1 fetch; superseded signal aborted; comma and repeated URL forms parse identically; invalid location ignored / all-invalid → All; `pastDue=5` → Any; chip summaries ("Past due: Any", "Past due: 4 ranges", "3 customers"); resolver `'stay'` cancel (no push, no toast, dialog closed) and `'redirect'` assertions unchanged; group expansion (Expand all then later page expanded; sort keeps, filter collapses); export one toast each for 400-with-body, 400-blank, 500, a network failure with no response, and empty (empty decided from the server count, D28); "No locations" sends no request and exports nothing (D27); a switch of the top-right location keeps every filter (D30).

#### Verification (Definition of Done gates):
- **Static (scoped):** BE `cs-fix` + `phpstan` (files) + `pest`; FE `eslint` + `vitest run --maxWorkers=2 <specs>` + `vue-tsc`
- **Migration gate:** `doctrine:migrations:migrate`, then `migrations:diff` no-op
- **MySQL proof:** run `tools/sql/aging-name-order-check.sql` in a throwaway `mysql:8.0` container; attach output to the PR
- **Smoke:** `bin/smoke-test.sh` — no 500s; IV/SBC/WIP exports unchanged
- **Compile:** Vite up, no errors
- **Browser-walk:** Inventory Value, Sales By Customer, Work In Progress (filters, URL round-trip, export) and a Work Order `?locationId=` cross-location deep link (Cancel still redirects with its toast) — regression only

---

### Phase 2: A/R Summary and A/P Summary (with their exports)
**Implements:** S1-R1, S1-R2, S1-R3, S1-R4, S1-R7, S1-R8 (Summaries), S1-N1, S1-E1, S2-R1/R2/R3/R7/R8 (Summaries), S2-E1, S3-R1–R10, S3-N1–N3, S3-EH (Summaries), S4-N2, S5-R1–R10, S5-R10a, S5-R12–R15, S5-R17, S5-R18, S5-R19, S5-N1–N3, S5-E1, S5-E2 (Summaries), S6-R1–R5, S6-N1 (Summaries), S7 Summary-name links (prerequisites, D19), S8-R1–R6 (Summaries), S8-N1, NFR-001, NFR-004, NFR-006, NFR-007. **S5-R11 (drill-down scope) ships in Phase 3**, when its target pages exist.
**Depends on:** Phase 1. **Gate G-DATA (§9) answered before merge.**

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/Aging/{ArOpenDocumentsSql.php,ApOpenDocumentsSql.php,ApDocumentLocation.php,ApAsOfMode.php}` | Create | open-documents UNION ALL per family (invoice / credit memo / deposit; bill / vendor credit), org in every branch, replay once per row, buckets in SQL, JOIN_PREFIX on A/P (D12), A/P location expression (D13), fast/historical A/P fork kept |
| `…/Dbal/Aging/{ArAgingSummarySortFields,ApAgingSummarySortFields}.php` | Create | whitelist keys = FE column names (D15); opening `[nameKey, lowerName, id]` |
| `src/Reporting/Reports/Domain/Repository/{ArAgingQueryRepositoryInterface,ApAgingQueryRepositoryInterface}.php` + `…/Dbal/Aging/{DbalArAgingQueryRepository,DbalApAgingQueryRepository,DbalAgingLocationOptionsQueryRepository,DbalAgingCounterpartyDirectory}.php` | Create | `#[ReadReplica]`; Summary = grouped derived table, `totals()` then `pageWithKnownTotal` (2 statements) |
| `src/Reporting/Reports/Application/{Query,Handler,DTO}/{ArAging,ApAging,Aging}/…` | Create | Summary, locations, customers/vendors search + resolve |
| `src/Reporting/Reports/UI/HTTP/{ArAging,ApAging,Aging}/…` | Create | `AgingReportRequestDto`; Summary, locations, search, resolve controllers |
| `src/Reporting/Reports/Application/DTO/Aging/AgingExportFormat.php`, `src/Reporting/Reports/Application/Service/Aging/{AgingAsOfResolver,ArAgingExportTableBuilder,ApAgingExportTableBuilder}.php`, `src/Reporting/Reports/Application/DTO/Aging/AgingGroupedExportTable.php`, `templates/reporting/aging/{flat,grouped}.html.twig` | Create | export kit for the family (caps 2,000 / 50,000; filter segments in order; "91 And Over" nowrap) |
| `src/Reporting/Reports/UI/HTTP/{ArAging,ApAging}/{ArAgingSummaryExportController,ApAgingSummaryExportController}.php` | Create | streamed CSV via `iterateAllWithinCap`, PDF via `ReportPdfRendererInterface::renderAttachment` |
| `tests/Functional/Reporting/ReportFetchersReadReplicaTest.php` | Modify | add the new reader classes |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `src/components/ts/reporting/accounts-receivable/{AgingSummaryReport.vue,AgingReportModel.ts}` | Modify | `.report-shell--all-white`, toolbar + info icon + export menu, filter band, sortable header, totals from page 1, pinned `total`; **remove the whole-row click** (`onRowClick` on every cell, `cursor-pointer`, `text-blue`) — only the customer name is a `.report-link`, and only with `canView('customers')`. Until Phase 3 the link keeps today's target query (`asOfDate`, `customerId`, `customerName`), because the legacy Collection page reads only those; `PrintARReportButton` removed from this report |
| `src/components/ts/reporting/accounts-payable/{ApAgingSummaryReport.vue,ApAgingReportModel.ts}` | Modify | mirror; vendor-name link for everyone, today's `vendorId` target query until Phase 3 |

Column table (D15; Location visibility per D17; labels per S6-R1/S3-R7):

| Report | Columns in order |
|---|---|
| A/R Summary | `customer_name`, `location`, `current`, `days_1_to_30`, `days_31_to_60`, `days_61_to_90`, `days_91_plus` "91 And Over", `total` (pinned) |
| A/P Summary | same with `vendor_name` |
| A/R Detail | `chevron`, `date`, `location`, `type`, `id` "ID", `customer_name`, `due_date`, `amount`, `open_balance` (pinned) |
| A/R Collection | `chevron`, `date`, `location`, `type`, `id`, `due_date`, `past_due`, `amount`, `open_balance` (pinned) |
| A/P Detail / Unpaid | `chevron`, `date`, `location`, `type`, `id` "No.", `vendor_name` (not sortable on Unpaid), `due_date`, `past_due`, `amount`, `open_balance` (pinned) |

#### Key code changes:
```sql
-- api/…/Dbal/Aging/ApOpenDocumentsSql.php — bill branch (shape)
SELECT /*+ JOIN_PREFIX(pv, va) */ 'bill' AS doc_class, vt.id AS doc_id, pv.id AS vendor_id, pv.name AS vendor_name,
       va.workplace_id AS workplace_id /* ApDocumentLocation::bill() */, COALESCE(w.name,'') AS location_name,
       vt.reference_id AS link_target_id, vt.date AS doc_date, vt.due_date, vt.invoice_number AS doc_number,
       vt.amount, <vt.balance | vt.amount - COALESCE(p.paid_amount,0)> AS open_balance, <SIGNED_DAYS(vt.due_date)> AS days_past_due
FROM part_vendor pv
JOIN vendor_account va     ON va.vendor_id = pv.id
JOIN vendor_transaction vt ON vt.vendor_account_id = va.id AND vt.vendor_transaction_type = :apDelivery
LEFT JOIN workplace w      ON w.id = va.workplace_id AND w.organization_id = :apOrg      -- RULE 1
[historical: LEFT JOIN (SELECT vps.vendor_transaction_id, SUM(vps.amount) paid_amount FROM vendor_payment_statement vps
             WHERE vps.organization_id = :apOrg AND vps.payment_date <= :apAsOf GROUP BY vps.vendor_transaction_id) p
             ON p.vendor_transaction_id = vt.id]                                        -- org INSIDE the derived table
WHERE pv.organization_id = :apOrg AND vt.date <= :apAsOf AND vt.due_date IS NOT NULL [filters…]
```

#### Unit / Integration tests:
- BE authorization: new `api/tests/Functional/Reporting/Reports/Aging/AgingReportAuthorizationTest.php` **ports** the assertion from the legacy `AccountReceivableReportAuthorizationTest` (deleted in Phase 5) that a user with only Reports → Page Access is never denied any aging endpoint; plus 403 without `ROLE_REPORT_VIEW` on every route.
- BE functional: name order and paging stability over 61+ rows both directions (S1-R1–R4, S1-R8); every money column sorts; location/vendor/customer/past-due narrowing of rows, totals and `rowsNumber` (S5-R7/R8/R17/R18); "Multiple"; as-of replay cases ported from the legacy `AccountReceivableAsOfDateTest`; A/P fast and historical paths; **tenant isolation** (org B rows invisible, org B ids → 422); export CSV order = screen order after re-sort (S3-R3), metadata lines (S3-R4/R5), 2,000/2,001 PDF and 50,000/50,001 CSV using a stub count; query budget (Summary 2; + validators per id list; export 4; writer 0).
- BE unit (export builders, used by every family from here on): column sets with/without Location and Credit term; every CSV row carries its own aging-bucket and customer/vendor column on the Detail/Collection/Unpaid flats (S3-R8); no group or subtotal rows; one Totals row; blank zero buckets; money `1234.56`; dates `Y-m-d`; "91 And Over" header class `nowrap`.
- BE parity: new Summary rows vs legacy `AccountReceivableCustomerService` / `DbalApAgingSummaryFetcher` on the same fixtures.
- FE: chip order (S5-R1); opening sort marked; Location column from D17 vectors; party link gating + drill-down query; totals from page 1; Clear all keeps as-of; export menu wiring.

#### Verification (Definition of Done gates):
- Static (scoped) BE + FE · Smoke · Compile
- **Staging-clone gates:** (a) EXPLAIN ANALYZE A/P Summary + totals for the 5 largest A/P shops — rows examined ≤ 1.5× own bills, ≤ 1.5 s (D12); (b) **parity**: for the 20 largest shops at today and last month-end, new rows = legacy rows exactly; footer differences only those explained by G-DATA
- **Browser-walk** (`admin` from `QUICK_LOGIN_USERS`) at 1440 and 1280 px, light and dark: `/reports/ar-aging-summary`, `/reports/ap-aging-summary` — A→Z order, header sorts, Location filter narrows rows and totals, export PDF + CSV download with the right header lines, the customer/vendor name link opens today's Collection/Unpaid page for that customer/vendor; a **custom role** with Reports → Page Access but without Customers → View (the default `tech` role has no report access) sees the customer name as plain text

---

### Phase 3: A/R Collection and A/P Unpaid Invoices (with their exports)
**Implements:** S1-R6, S1-R7, S1-R8 (groups), S5-R11 (Summary drill-down scope), S2-R1–R9 (these reports), S2-N1, S2-E1, S3-R1–R10, S3-R8a, S3-N1–N3, S3-EH (these), S4-R1–R3, S4-R5–R9, S4-N1, S5-R1–R19 (these), S5-N1–N3, S5-E1, S5-E2, S6-R1–R3, S6-R5, S6-N1, S7-R1–R10, S7-N1, S7-N2, S7-E1 (these), S8-R1–R6, S8-N1 (these), S9-R1–R3, S9-N1, S9-N2
**Depends on:** Phase 2

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `…/Dbal/Aging/{ArCollectionsSortFields,ApUnpaidInvoicesSortFields}.php` | Create | rows-within-group whitelist; groups ordered by name chain only (S2-R5); **opening row order inside a group `[doc_date ASC, docNumKey, rawNum, doc_kind, doc_id]`** (S1-R6: oldest first, ties by number-aware document number); no `vendor` key on Unpaid (S2-N1); blanks-last due date / past due (S2-R6) |
| Collection / Unpaid queries, handlers, DTOs, controllers, export controllers | Create | 3 statements: `totals()` (groups, documents, sums), group page (`pageWithKnownTotal`), rows for those ≤30 groups ordered by group keys then `applyOrderBy`; `includeCreditTerm` from the controller (D8); phone raw (`c.telephone`), credit term `COALESCE(NULLIF(c.credit_term,''),'COD')` |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `src/components/ts/reporting/accounts-receivable/AgingCollectionReport.vue` | Modify | two-tone shell; group rows `data-row-type="group"`; chevron + label in `.report-group-label`; phone + credit term (S9) with `usePermissions().seeApArData()` as defence in depth; whole-row click removed (`onRowClick`, `canNavigate`, `cursor-pointer`, `text-blue`); `AgingDocumentLink` per row (D19 matrix); switch dialog (lazy `BaseDialog`, exact copy); expansion via `useReportGroupExpansion` (sort no longer collapses); pinned overlay; Vuex `customers/fetchCompanies` dispatch removed |
| `src/components/ts/reporting/accounts-payable/ApUnpaidInvoicesReport.vue` | Modify | mirror; Vendor Name header plain (S2-N1); vendor credit links to its return (S7-R9); Vuex `parts/fetchVendors` dispatch removed |
| `src/components/ts/reporting/accounts-receivable/AgingSummaryReport.vue`, `src/components/ts/reporting/accounts-payable/ApAgingSummaryReport.vue` | Modify | switch the name link to the full drill-down scope (S5-R11): `asOfDate`, `customerIds`/`vendorIds` = [id], `pastDue`, `locationIds` (only when not All) |

#### Unit / Integration tests:
- BE: groups stay in name order while rows re-sort; totals follow the customer/vendor filter (S5-R18 fix); credit term present/absent per permission across JSON, CSV column and PDF line; phone null → no label in PDF; Past due keeps credits (S5-R16); link kinds and null links; budget 3 statements.
- FE: credit term hidden without `seeApArData`; Unpaid vendor header not sortable; pinned overlay ids; switch prompt Cancel stays (URL, filters, sort, expansion, scroll); new-tab link carries `?locationId`.

#### Verification (Definition of Done gates):
- Static · Smoke · Compile
- **Browser-walk** `/reports/ar-aging-collection`, `/reports/ap-unpaid-invoices` as `admin` and as a **custom role** with Reports → Page Access but without 'View and Manage AP/AR Data' (no default role separates the two — every default role with report access also has the AP/AR switch); drill-down from each Summary carries as-of, Past due and locations; groups don't move on sort; Expand all + scroll loads later groups expanded; pinned row pushes up; an invoice at another enrolled location prompts, Cancel leaves everything as it was; a bill at another location is plain text; credit term visible only with the AP/AR switch

---

### Phase 4: A/R Detail and A/P Detail (with their exports)
**Implements:** S1-R5, S1-R7, S1-R8 (Detail), S2-R1–R9 (Detail), S2-E1, S3-R1–R10, S3-N1–N3, S3-EH (Detail), S4-R1–R9, S4-N1, S5-R1–R19 (Detail), S5-N1–N3, S5-E1, S5-E2, S6-R1–R3, S6-R5, S6-N1, S7-R1–R10, S7-N1, S7-N2, S7-E1 (Detail), S8-R1–R6, S8-N1 (Detail)
**Depends on:** Phase 3

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `…/Dbal/Aging/{ArAgingDetailSortFields,ApAgingDetailSortFields}.php` | Create | opening `[nameKey, lowerName, counterpartyId, docNumKey, rawNum, doc_kind, doc_id]` |
| Detail groups + bucket-rows queries/handlers/controllers, export controllers | Create | groups: 1 statement (`GROUP BY bucket`, PHP fills all 5); rows: bucket pushed into branches, `pageWithInlineTotal` (`COUNT(*) OVER ()`, Parts Velocity analogue), 100 rows; A/P vendor credit due date = its own date (S2-R6 note); credits never Current |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `src/components/ts/reporting/accounts-receivable/AgingDetailReport.vue`, `src/components/ts/reporting/accounts-payable/ApAgingDetailReport.vue` | Modify | whole-row click removed; `AgingDocumentLink` per row (D19); `useAgingBucketPages` (summary query + `useQueries` per expanded bucket page), intersection sentinel `row_<code>_load_more_<bucket>`, sort resets expanded buckets to page 1 but keeps them expanded, Expand all fires ≤5 page-1 requests; A/R Detail gains 100-line windowing (S4-R4 v4); Location wraps only on A/P Detail |

#### Unit / Integration tests:
- BE: fixed bucket order under any sort; tie-breakers; credits never Current; `rowsNumber` per bucket; 100-row paging never repeats or skips; link kinds `work_order`/`part_sale` from the stored number rule; `vendor_return` link only when the return is org-owned.
- FE: bucket order fixed under sort; sentinel loads the next 100; vendor credit → return link.

#### Verification (Definition of Done gates):
- Static · Smoke · Compile
- **Browser-walk** `/reports/ar-aging-detail`, `/reports/ap-aging-detail` (QA org: 13,540 A/P lines): first paint fast, 100 then more on scroll, header sorts within buckets, PDF over 2,000 rows refused with exactly one toast, CSV succeeds; every column visible at 1440 px

---

### Phase 5: Retire the legacy aging code
**Implements:** D10, D11 (deletions)
**Depends on:** Phase 4, **and** every "Before Phase 5" row of the §7 E2E reference-breakage table having merged. `/implement` does no E2E work, so the user runs `/e2e-after-change` first; it moves `e2e/src/api/factories/finance-read.helper.ts`, the A/R and A/P seed helpers, and the API specs `ar-aging-as-of-date`, `ar-ap-report-gating`, `fe-permissions-shape` and `time-clock-role-authorization` off the legacy routes. Deleting the endpoints first turns them into 404s.

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `src/Reporting/Dashboard/Application/{AccountPayable,AccountReceivable}/**`, `src/Reporting/Dashboard/Domain/{AccountPayable,AccountReceivable}/**`, `src/Reporting/Dashboard/Infrastructure/Doctrine/{AccountPayable,AccountReceivable}/Service/*` | Delete | legacy handlers, calculators, services, fetchers, PDF generator |
| `src/Reporting/Dashboard/Infrastructure/Controller/{AccountReceivablePdf,AgingDetail,AgingSummary,ApAgingDetail,ApAgingSummary,ApUnpaidInvoices,Collections}Controller.php` + their request DTOs | Delete | keep `TechEfficiencyPdfRequestDto` |
| `templates/reporting/account-receivable/{aging-summary,aging-detail,collections}.html.twig`; `config/services.yaml` (the `AccountReceivablePdfGenerator` arguments) | Delete / Modify | |
| Legacy unit + functional tests under `tests/{Unit,Functional}/Reporting/Dashboard/**/{AccountPayable,AccountReceivable}` and the `Ap*` controller/DTO tests | Delete | |
| `tests/Functional/Reporting/ReportFetchersReadReplicaTest.php`; `tests/Functional/IAM/PricingPdfGuardTest.php` (retarget the A/R PDF case to the new export); docblocks in `InvoicePaymentsReceivedReader.php`, `DbalSidebarWorkOrderFetcher.php` | Modify | |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `src/components/ts/reporting/accounts-receivable/PrintARReportButton.vue` + spec; `asOfDateToDisplay` in `src/components/ts/reporting/ReportingModel.ts`; legacy api fns/queries/keys/types in `src/api/reporting/**`; legacy handlers + fixtures in `src/testing/handlers.ts`; dead `.table-filter` styles | Delete | |
| The six legacy Cypress aging specs, fixtures and interceptor commands listed in §7 E2E "Deletes" | Delete — **confirmed by the user 2026-10-21**; each goes in the PR that switches its report (Phases 2–4), anything left goes here | they intercept removed endpoints; Playwright replaces them |

#### Verification (Definition of Done gates):
- Static (full scoped set) · `bin/console debug:router` shows no legacy aging routes · Smoke (curated list refreshed if it probed legacy routes) · Compile · browser-walk all six once more

---

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- Backend: shared-kit changes (guard, paginator, sort key, formatter), domain enums, `AgingSql` expressions, export table builders (column sets with/without Location and Credit term, blank zero buckets, Totals row, "91 And Over").
- Frontend: composables (debounce, group expansion, bucket pages, filters, URL sync, resolver modes, export runner), link resolution matrix (`documentKind` × permission × location), chip summaries.
- Edge cases: exactly 2,000 / 50,000; blanks last both directions; Expand all + later pages; "No locations"; foreign ids; future as-of clamp.

### Integration tests
- Functional (SQLite) per endpoint: order, paging stability, filters on rows + totals + counts, tenant isolation, permissions (`ROLE_REPORT_VIEW` everywhere; credit-term gate), query budget with writer = 0, legacy parity on shared fixtures.
- MySQL truth: committed literal-SQL collation check (throwaway container), EXPLAIN + parity on the staging clone (Phase 2).

### Manual testing checklist
1. At 1440 px every column of all six reports fits; headings never wrap; Location wraps only on A/P Detail (S8-R3).
2. Light and dark theme: link color, pinned column, totals row, pinned group overlay.
3. Fling-scroll a long expanded group: pinned row pushes up without overlapping header or totals.
4. Top-right location switch on each report: filters and rows stay; sort resets; groups collapse; links update (S5-E2).
5. Open a PDF and a CSV from each report: header lines, order, totals, Location column rule, credit term gating.
6. Browser Back / reload / shared link restore filters; a link with every location reads as All; "No locations" not restored.

### E2E tests

> **Not part of `/implement`.** `/implement` does no E2E work (`.claude/commands/implement.md` "E2E work is out of scope"). This section is the input for `/e2e-after-change`, which the user runs before each `/create-pr`. Planned with `test-curator` against `e2e/.claude/reference/coverage-policy.md` (`batchCap = 5` per run).

#### Reference breakage (mandatory, uncapped — fix in the PR that causes it)

| Caused by | File | Fix |
|---|---|---|
| Phase 2 (Summaries) | `e2e/tests/ui/reporting/ar-aging-summary-customer-link.spec.ts` (@C27260) | open `reports/ar-aging-summary?customerIds=<id>`; positive leg clicks `link_arsum_party_<id>` → Collection with `customerIds`; negative leg (no Customers → View) expects `text_arsum_party_<id>`; drop `cursor-pointer`/`text-blue` assertions |
| Phase 2 | `e2e/src/pages/reports/ar-aging-seed.helper.ts` (`seedUnpaidInvoicedArData`, lines ~184/304) | seed on a **run-private** customer (not the shared base customer, which has 400+ leaked invoices and falls off page 1); resolve `documentNumber` from the new endpoint; pin `workplaceId` to the admin's location |
| Phase 3 (Collection/Unpaid) | `e2e/tests/ui/reporting/ar-aging-collection-finance-link.spec.ts` (@C27262), `ap-unpaid-invoices-delivery-link.spec.ts` (@C27263) | deep-link `customerIds=`/`vendorIds=`; expand with the kept toggle id; click `link_arcol_doc_*` / `link_apunp_doc_*` and assert the exact `woId` / `deliveryId`; negative legs expect `text_*_doc_*` |
| Phase 3 | `e2e/src/pages/reports/ap-aging-seed.helper.ts` (line ~115), `ar-aging-seed.helper.ts` `assertOnCollectionsReport` (line ~219) | read the new endpoints; match `link.kind === 'bill' && link.targetId === deliveryId`; per-run vendor; explicit invoice number; pin to the admin's location |
| Phase 4 (Details) | `e2e/tests/ui/reporting/ar-aging-detail-finance-link.spec.ts` (@C27261), `ap-aging-detail-delivery-link.spec.ts` (@C27264); seed Detail paths (`ar-aging-seed.helper.ts:~304`, `ap-aging-seed.helper.ts:~172`) | as Phase 3 with `link_ardet_doc_*` / `link_apdet_doc_*`; groups + `…/buckets/{bucket}/rows`; extend `BUCKET_ID_BY_KEY` with the camelCase bucket keys |
| **Before Phase 5** (404 after deletion) | `e2e/src/api/factories/finance-read.helper.ts` (lines ~139–140, 279, 286) | point `agingSummary`/`agingDetail` at the new routes; optional `customers` arg |
| Before Phase 5 | `e2e/tests/api/ar-aging-as-of-date.spec.ts` (@C26623–@C26626) | pass `customers=<baseCustomerId>` on every call (30-row paging); read `totalCents / 100`; note the as-of clamp (D20) |
| Before Phase 5 | `e2e/tests/api/permissions/ar-ap-report-gating.spec.ts` (@C26553–@C26559) | retarget the 7 routes; PDF case → `ar-aging-summary/export?format=pdf` (still `ROLE_REPORT_VIEW`) |
| Before Phase 5 | `e2e/tests/api/permissions/fe-permissions-shape.spec.ts` (@C26560), `time-clock-role-authorization.spec.ts` (@C29451) | retarget to `/reporting/reports/{ar,ap}-aging-summary` and `/reporting/reports/ap-unpaid-invoices` |

Not breakage (checked): `report-export-menu.ts` (new `ReportCode`s `arsum|ardet|arcol|apsum|apdet|apunp` are additive), `report-infinite-scroll-paging.spec.ts` (WIP only), `ar_report_print` / `_cell_location_*` (no E2E references).

**Regression re-runs (Keep, no edits expected)** when Phase 1 lands, because it changes the shared filter kit, URL sync, `useReportTableQuery` and the location resolver: `e2e/tests/ui/reporting/{report-filter-select-all-encoding,report-filter-search-focus,report-remembered-view-filters,report-location-switch-routing,report-drillthrough-link-gating,report-route-permission-gate,report-minimal-reports-access,sales-by-customer,inventory-value,work-in-progress}.spec.ts`; `tests/ui/dashboard/dashboard-{count-tiles,kpi-tiles,empty-states}.spec.ts` and `tests/ui/customers/invoice-list-search.spec.ts` (`?locationId` deep links, redirect mode).

#### New coverage (value-ranked; ≤ 5 per run)

All new specs live directly in `e2e/tests/ui/reporting/` (the `reporting` project only collects that folder), run as admin unless noted, and use run-private customers/vendors.

**Test: A/R Summary opens in QuickBooks name order and the header sorts** (Happy path; S1-R1–R4, S1-R7, S2-R2/R3) — Phase 2 — `ar-aging-summary-name-order.spec.ts`
1. Seed six customers sharing a run prefix: "10 Trucking", "2 Trucking", "Eagle", "Émile's", "Øster", "Ozone", each with one open document of a distinct amount.
2. Open A/R Aging Summary with the six customers ticked (page link).
3. Click the Customer header; then click the Total header.
- **Expected:** opening order 10 Trucking, 2 Trucking, Eagle, Émile's, Øster, Ozone with the Customer column marked ascending; first header click reverses; Total sorts largest first. This is the only real-MySQL proof of the collation (the BE tests run on SQLite).

**Test: Organization-wide Location filter narrows A/R Summary for a user enrolled at one location** (Happy path; S5-R2/R3/R5/R6/R7/R8/R10/R12, S6-R2/R4) — Phase 2 — `ar-aging-summary-location-filter.spec.ts`
1. A customer has one open invoice at Loc A and one at Loc B; a custom-role user (Reports, AP/AR data, Customers view) is enrolled at Loc A only.
2. Open A/R Summary filtered to the customer; open the Location chip; untick Loc A; reload.
- **Expected:** "All locations", Location cell "Multiple", combined Total; both locations listed and ticked; after unticking, the chip reads "Loc B", the Location column hides, Total = Loc B invoice, Totals row matches; the reload restores Loc B.

**Test: Summary drill-down keeps scope and totals follow the filter** (Happy path; S5-R11/R14/R16/R17/R18) — Phase 3 — `ar-aging-summary-drill-down-scope.spec.ts`
1. Customer X has invoices 10 and 45 days past due; customer Y one 20 days past due.
2. On A/R Summary tick Past due "31-60 days" (X listed at full balance, Y not), click X.
3. Expand X on A/R Collection; read the Totals row.
- **Expected:** Collection opens with X ticked, "Past due: 31-60 days", same as-of; only the 45-day invoice listed; Totals equal that invoice only.

**Test: Open another location's invoice through the switch-location prompt** (Happy path + edge; S7-R1/R3/R4/R5, S7-N1) — Phase 3 — `ar-aging-document-switch-location.spec.ts`
1. User enrolled at Loc A and Loc B, signed in at Loc A; a customer has past-due invoices at Loc B and at Loc C.
2. Open A/R Collection filtered to the customer, expand it.
3. Click the Loc B number → Cancel; click again → Switch location.
- **Expected:** Loc B number is a link, Loc C number plain text; the dialog copy is exact; Cancel leaves URL, filters and expansion unchanged; Switch opens `/workorders/<woId>/finance` with Loc B active.

**Test: A vendor credit opens its vendor return** (Happy path; S7-R9, S2-R6) — Phase 3 — `ap-unpaid-vendor-credit-return-link.spec.ts`
1. A run-private vendor has a credit from a confirmed vendor return and a directly created credit, both at the admin's location.
2. Open A/P Unpaid Invoices filtered to the vendor, expand it, click the return-backed credit number.
- **Expected:** return-backed number is a link, direct credit plain text, both with blank Due Date and Past Due; the click opens that vendor return.

**Test: Re-sort A/P Detail with all buckets expanded** (Happy path; S2-R5/R9, S4-R1/R2/R3/R8) — Phase 4 — `ap-aging-detail-sort-within-buckets.spec.ts`
1. A run-private vendor has three future-due bills (100, 300, 200) and one vendor credit.
2. Open A/P Aging Detail **filtered to that vendor** (`vendorIds=` link; the QA org has 13,540 lines); click the top-left chevron (Expand all); click Open Balance twice; click the chevron again.
- **Expected:** both buckets expand and the tooltip reads "Collapse all"; Current reads 300, 200, 100, then 100, 200, 300; the 1-30 bucket stays above Current and both stay expanded; the final click collapses every bucket. Catches an FE column name / BE whitelist mismatch, which the BE silently normalizes.

**Test: A/R Collection CSV follows the on-screen sort and filters** (Happy path; S3-R3/R4/R5/R8a/R10, S9-R3) — Phase 3 (the A/R Collection export controller lands there) — `ar-aging-collection-csv-export.spec.ts`
1. Customers A and B with past-due invoices of different balances; admin has AP/AR data.
2. Tick B, then A; Download (CSV); click Open balance; Download (CSV) again.
- **Expected:** success toast; CSV states "As of: <date>", "Locations: All locations", "Customers: B, A"; Phone and Credit term columns; rows and Totals equal the screen; the second CSV follows the new order.

Per-run grouping (≤ 5 each): Phase 2 run = tests 1, 2; Phase 3 run = tests 3, 4, 5, 7; Phase 4 run = test 6.

#### Backlog (deferred beyond the cap)
| Workflow | Why deferred | Suggested file |
|---|---|---|
| A/R Detail "load more" past 100 rows per bucket | needs >100 seeded docs per run; paging is BE functional, sentinel is FE unit | `ar-aging-detail-bucket-paging.spec.ts` |
| A/P PDF export downloads | PDF generator not configured on every environment; CSV covers wiring | `ap-aging-pdf-export.spec.ts` |
| Top-right location switch on an aging report (S5-E2) | variant of existing C43980 | `aging-location-switch-reload.spec.ts` |
| Document link opened in a new tab (S7-R8) | lower value than the in-report prompt | `aging-document-new-tab.spec.ts` |

#### Deletes (user confirmation required)
Six legacy Cypress specs intercept the removed endpoints and go in the PR that switches their report: `app/cypress/e2e/reports/accounts-receivable/{aging-summary-report,aging-collection-report,aging-detail-report}.cy.ts`, `app/cypress/e2e/reports/accounts-payable/{aging-summary-report,ap-unpaid-invoices-report,aging-detail-report}.cy.ts`, with their six fixtures in `app/cypress/fixtures/` and the six `intercept*` commands in `app/cypress/support/interceptors.ts` + `app/cypress/cypress.d.ts`. No Playwright spec is deleted.

#### Notes for `/e2e-after-change`
- Multi-location tests (2, 4) need extra workplaces (`WorkplaceFactory.findOrCreate({name:'E2E Aging Loc B'})`, `…Loc C`) and a way to seed a document at Loc B **without enrolling the shared admin there** (it would change every other report's Location chip). Run the BE researcher on that before the Phase 3 E2E run. `ReportRoleSeeder` needs an `extraWorkplaceIds` option.
- §8 skip reasons: a BE-only PR stamps `None — no-fe-diff` (reference scan still runs); ship Phase 1's FE part in the same PR as Phase 2 (no §8 reason fits a standalone FE-0).
- TestRail: 7 new cases in section "Reports"; step-text updates for C27260–C27264, C26553–C26560, C29451 (and an optional cents note on C26623–C26626); `/testrail-push` after each run.
- Out of scope, worth a follow-up: C26553–C26560 describe the reports as gated by the AR/AP atoms (they are gated by Reports → Page Access); the `[PERMANENT: env-data] report is workplace-scoped` skip reasons in the four link specs are false.

## 8. Rollback Plan

- Phases 1–4 add endpoints and switch FE reports one family at a time; the legacy endpoints stay until Phase 5. Rolling back a phase = reverting its PR: the FE returns to the legacy endpoints, which still exist.
- The two index additions are online (`INPLACE`, `LOCK=NONE`) and harmless to keep; `down()` drops them.
- Shared-kit changes are additive with unchanged defaults; revert restores today's behavior for the other six reports.
- Phase 5 is the point of no return for the legacy code; ship it only after Phases 2–4 have run clean in production for at least one month-end.

## 9. Performance & Security Considerations

### Performance
- **Hot read paths.**
  - A/P Detail / Unpaid / Summary: driven from `part_vendor.organization_id` (`pv__organization_id_name_idx`) → `va__vendor_id_idx` → `vt__vendor_account_id_vendor_transaction_type_idx`; volume up to 23,176 open bills (largest prod shop, Q9a), never other shops' 267,701 (Q9b). Computed live (no derived storage, D12). Gate: EXPLAIN on the staging clone (Phase 2).
  - A/R: invoice / credit memo / deposit branches, each with `organization_id` on the document table; replay subqueries correlated on primary keys and served by `cps__customer_transaction_id_payment_date_amount_idx`, `cma__credit_memo_id_applied_date_idx`, `dep_app__deposit_id_idx`. Volume ≤ 2,459 open invoices per shop (Q9d).
  - Statement budgets (NFR-007): Summary 2 · Detail groups 1 · bucket rows 1 (2 when the page is empty — `pageWithInlineTotal` falls back to a COUNT) · Collection/Unpaid 3 (2 when the group page is empty) · locations 1 · search/resolve 1 · export 4; + 1 per id-list validator. Writer: 0.
  - Name order is UCA order (`utf8mb4_0900_ai_ci`): every PRD example holds, but punctuation sorts below digits and punctuation marks order among themselves differently from ASCII (e.g. `-` before `#`). Accepted as the closest collation; the committed MySQL check script documents it. If a shop reports a mismatch against QuickBooks on a punctuation-led name, that is the place to look.
  - Name order uses a `COLLATE` override (no index can provide it), applied to grouped/derived sets only.
- **Derived data and backfills.** None introduced. G-DATA: before Phase 2 merges, run on the reader:
  ```sql
  -- G-DATA: open invoices whose due date is NULL (legacy rows place them via credit terms in PHP; SQL footer drops them)
  SELECT COUNT(*) AS open_invoices_null_due
  FROM customer_transaction ct
  JOIN invoice i ON i.id = ct.reference_id
  WHERE ct.customer_transaction_type = 'invoice' AND ct.balance <> 0 AND i.due_date IS NULL;
  ```
  ```sql
  -- G-DATA 2: open overpaid (negative-balance) invoices — today's A/R Summary footer counts them, today's rows don't
  SELECT COUNT(*) AS overpaid_open_invoices, COUNT(DISTINCT ct.customer_account_id) AS accounts
  FROM customer_transaction ct
  WHERE ct.customer_transaction_type = 'invoice' AND ct.balance < 0;
  ```
  Query 1 = 0 → nothing to do. > 0 → rows would also move (legacy rows place NULL-due invoices by credit term in PHP), so either replicate `CreditTerms::getDueDate` in the SQL expression (preferred if expressible) or a batched CLI backfill of `invoice.due_date`, decided before Phase 2 merges. Query 2 = 0 → the footer matches today exactly. > 0 → the PRD's two rules ("Totals add up exactly the rows" and "an untouched report shows exactly today's numbers") disagree for those shops only because today's footer disagrees with today's rows; the totals rule wins by construction (D7). Post a short FYI on the PRD thread (draft → user approval) so Product can add a "What changes" line; it does not block.
- **Known risks.**
  - FE request bursts → D5 (debounce + abort + gate). Inventory Value's 2026-08-24 stall is the precedent.
  - PDF generation: WeasyPrint HTTP (600 s client timeout) pins an FPM worker; the 2,000-row cap bounds it (~30 s). Background exports are SV-11445.
  - CSV at 50,000 rows streamed (`iterateAllWithinCap`), never materialized as cells.
  - Collection/Unpaid return all rows of the page's ≤30 groups: one vendor with thousands of bills makes a heavy page. Measure on the staging clone; fallback is per-group row paging reusing the bucket-rows pattern.
  - Detail buckets render up to N×100 rows inside one virtual item (as today on A/P Detail).

### Security
- Every endpoint `#[IsGranted(ROLE_REPORT_VIEW)]` (S1-N1, PRD Permissions). No new permission.
- Tenant scoping (NFR-004): `organization_id` on every root and document table in every branch and inside every derived table; workplace joins carry it in the ON clause; customer/vendor/location ids validated against the organization (`ValidOrganizationScope`, 422) before the handler runs.
- Reports stay organization-wide by PRD decision — no `WorkplaceDecorator`, no enrollment check. This is today's behavior, not a bypass; state it in each PR so reviewers don't read it as a Golden Rule exemption. No 🔴 exemption is needed.
- Credit term: server-side gate (D8); omitted from JSON, CSV and PDF for users without the switch.
- Links (S7): the server exposes only org-owned ids (document, workplace, delivery, vendor return); the FE decides link/prompt/text from permissions and enrollment; destination pages keep their own authorization.
- CSV formula-injection hardening via `CsvAttachmentResponseBuilder` (system numeric columns masked as safe).

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1, S1-R2, S1-R3, S1-R4 | 1, 2 | API | `AgingSql.php`, `Ar/ApAgingSummarySortFields.php`, `tools/sql/aging-name-order-check.sql` | Planned |
| S1-R1, S1-R7 | 2 | App | `AgingSummaryReport.vue`, `ApAgingSummaryReport.vue`, `ReportSortableHeaderRow.vue` | Planned |
| S1-R5 | 4 | API + App | `Ar/ApAgingDetailSortFields.php`, Detail groups handler; `AgingDetailReport.vue`, `ApAgingDetailReport.vue` | Planned |
| S1-R6, S1-R7 | 3 | API + App | `ArCollectionsSortFields.php`, `ApUnpaidInvoicesSortFields.php`; Collection/Unpaid SFCs | Planned |
| S1-R8 | 2, 3, 4 | API + App | `ReportPaginator` usage per report; `useReportTableQuery`, `useAgingBucketPages.ts` | Planned |
| S1-N1, S1-E1 | 2–4 | API | every controller (`ROLE_REPORT_VIEW`); open-balance outer filter | Planned |
| S2-R1, S2-R2, S2-R3, S2-N1, S2-E1 | 2–4 | API + App | `*SortFields.php`; `ReportSortableHeaderRow.vue`, `agingColumns.ts` | Planned |
| S2-R4 | 1 | API | `AgingSql.php` document key | Planned |
| S2-R5 | 3, 4 | API + App | group-order-only queries; header sorts rows within groups | Planned |
| S2-R6 | 1, 3, 4 | API | `ReportSortKey.php`, `ReportPaginator::applyOrderBy` | Planned |
| S2-R7, S2-R8, S2-R9 | 1–4 | App | component sort state (no remembered view); `useReportGroupExpansion.ts` collapseOn | Planned |
| S3-R1, S3-R2, S3-R10, S3-EH | 1–4 | App | `useReportExport.ts`, `agingExport.ts`, `SubActionsDropDown` per report | Planned |
| S3-R3, S3-R4, S3-R5, S3-R6, S3-R7, S3-R8, S3-R9 | 2–4 | API | export controllers, `AgingAsOfResolver.php`, `Ar/ApAgingExportTableBuilder.php`, `DbalOrganizationLocationsScopeResolver.php`, twig templates | Planned |
| S3-R8a | 3 | API | `ArAgingExportTableBuilder.php`, grouped template | Planned |
| S3-N1, S3-N2 | 1 | API | `ExportRowCapGuard.php`, `ReportExportNarrowHint.php`, `ReportPaginator::iterateAllWithinCap` | Planned |
| S3-N3 | 1 | App | `src/boot/axios.ts` silent export URLs, `useReportExport.ts` | Planned |
| S4-R1, S4-R2, S4-R3, S4-R5, S4-R8, S4-R9, S4-N1 | 1, 3, 4 | App | `useReportGroupExpansion.ts`, `ReportSortableHeaderRow.vue` | Planned |
| S4-R4 | 4 | API + App | bucket-rows endpoints; `useAgingBucketPages.ts` | Planned |
| S4-R6, S4-R7 | 1, 3, 4 | App | `ReportPinnedGroupRow.vue`, `useReportPinnedGroup.ts`, `.report-group-label` | Planned |
| S4-N2 | 2 | App | Summaries without chevron column | Planned |
| S5-R6a | 1, 2 | App | D27: no request, empty state, export short-circuit | Planned |
| S5-R1, S5-R2, S5-R5, S5-R6, S5-R9, S5-R10, S5-R10a, S5-R13, S5-R14, S5-R15, S5-R19, S5-N1, S5-N2, S5-N3, S5-E1 | 1, 2 | App | `useAgingReportFilters.ts`, filter kit flag, `useFilterUrlSync.ts`, `useReportFilters.ts` | Planned |
| S5-R3, S5-R4 | 2 | API | `DbalAgingLocationOptionsQueryRepository.php` | Planned |
| S5-R7, S5-R8, S5-R16, S5-R17, S5-R18 | 2–4 | API | `Ar/ApOpenDocumentsSql.php`, `ApDocumentLocation.php`, `ReportPaginator::totals` | Planned |
| S5-R11 | 3 | App | Summary name links switched to the full scope query | Planned |
| S5-R12 | 1 | API | `ValidOrganizationScope` (narrow-only) | Planned |
| S5-E2 | 2–4 | App | `Reporting.vue` remount (unchanged); filters ride the URL; `carryAcrossLocationSwitch: ['locationIds']` (D30) | Planned |
| S6-R1, S6-R3, S6-R5 | 2–4 | App | `agingColumns.ts`, report Models | Planned |
| S6-R2, S6-N1 | 1–4 | API + App | D17 rule in FE + `DbalOrganizationLocationsScopeResolver.php` | Planned |
| S6-R4 | 2 | API | `AgingSql.php` `LOCATION_AGGREGATE` | Planned |
| S7-R1, S7-R2, S7-R6, S7-R9, S7-R10, S7-N1, S7-N2 | 1, 3, 4 | API + App | `DocRow.link`; `agingDocumentLinks.ts`, `AgingDocumentLink.vue` | Planned |
| S7-R3, S7-R4, S7-R5, S7-R8 | 1, 3, 4 | App | `useWorkOrderLocationResolver.ts` (`'stay'`), `useAgingDocumentSwitch.ts` | Planned |
| S7-R7 | 1 | App | `.report-link` in `src/css/app.scss` | Planned |
| S7-E1 | — | App | `LocationSelector.vue` not touched | Planned |
| S8-R1, S8-R2, S8-N1 | 2–4 | App | `ReportToolbar` `#title` + `ReportInfoIcon`, descriptions in Models | Planned |
| S8-R3, S8-R4 | 2–4 | App | `.report-shell`/`.report-table`, `report-col-pinned`, `report-totals-row` | Planned |
| S8-R5, S8-R6 | 2–4 | App | `FilteredTableEmptyState` (`filtersApplied`, `resetFilters` + `flush`), inline error | Planned |
| S9-R1, S9-R2, S9-R3, S9-N1, S9-N2 | 3 | API + App | Collection query/controller (D8), export builder; `AgingCollectionReport.vue` | Planned |
| NFR-001 | 1–4 | API | `#[ReadReplica]` classes, `ReportFetchersReadReplicaTest.php` | Planned |
| NFR-002 | 2–4 | API | `ReportPaginator` entry points per report | Planned |
| NFR-003 | 1–4 | API | `iterateAllWithinCap`, export controllers | Planned |
| NFR-004 | 1–4 | API | `*OpenDocumentsSql.php`, `ValidOrganizationScope` | Planned |
| NFR-005 | 1 | App | `useDebouncedFilterState.ts`, `useReportTableQuery.ts` signal, opening gate | Planned |
| NFR-006 | 2 | API | `ApOpenDocumentsSql.php` JOIN_PREFIX | Planned |
| NFR-007 | 2–4 | API | `tests/Functional/Reporting/Reports/Aging/AgingQueryBudgetTest.php` | Planned |
| NFR-008 | 1 | API | migration + mappings | Planned |
| NFR-009 | — | — | Out of this plan: SV-11445 (later phase, design first) | Deferred by Product |
| NFR-010 | 1, 5 | API + App | D11 items | Planned |

| S1-R1, S1-R2, S1-R3, S1-R4, S1-R7, S2-R2, S2-R3 | 2 | E2E | `e2e/tests/ui/reporting/ar-aging-summary-name-order.spec.ts` | Planned (`/e2e-after-change`) |
| S5-R2, S5-R3, S5-R5, S5-R6, S5-R7, S5-R8, S5-R10, S5-R12, S6-R2, S6-R4 | 2 | E2E | `e2e/tests/ui/reporting/ar-aging-summary-location-filter.spec.ts` | Planned (`/e2e-after-change`) |
| S7 Summary-name link | 2 | E2E | `e2e/tests/ui/reporting/ar-aging-summary-customer-link.spec.ts` (updated) | Planned (`/e2e-after-change`) |
| S5-R11, S5-R14, S5-R16, S5-R17, S5-R18 | 3 | E2E | `e2e/tests/ui/reporting/ar-aging-summary-drill-down-scope.spec.ts` | Planned (`/e2e-after-change`) |
| S7-R1, S7-R3, S7-R4, S7-R5, S7-N1 | 3 | E2E | `e2e/tests/ui/reporting/ar-aging-document-switch-location.spec.ts` | Planned (`/e2e-after-change`) |
| S7-R9, S2-R6 | 3 | E2E | `e2e/tests/ui/reporting/ap-unpaid-vendor-credit-return-link.spec.ts` | Planned (`/e2e-after-change`) |
| S7-R2, S7-R6, S7-N2 | 3, 4 | E2E | `e2e/tests/ui/reporting/{ar-aging-collection-finance-link,ap-unpaid-invoices-delivery-link,ar-aging-detail-finance-link,ap-aging-detail-delivery-link}.spec.ts` (updated) | Planned (`/e2e-after-change`) |
| S2-R5, S2-R9, S4-R1, S4-R2, S4-R3, S4-R8 | 4 | E2E | `e2e/tests/ui/reporting/ap-aging-detail-sort-within-buckets.spec.ts` | Planned (`/e2e-after-change`) |
| S3-R3, S3-R4, S3-R5, S3-R8a, S3-R10, S9-R3 | 3 | E2E | `e2e/tests/ui/reporting/ar-aging-collection-csv-export.spec.ts` | Planned (`/e2e-after-change`) |
| S1-N1 (report access gate) | 5 | E2E | `e2e/tests/api/permissions/ar-ap-report-gating.spec.ts` (retargeted) | Planned (`/e2e-after-change`) |

## 11. Verification Tickets

_Filled in by Phase 10 after the plan is approved._

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-11597](https://shopview.atlassian.net/browse/SV-11597) | A/R & A/P aging — verify Phase 1: shared report kit | Phase 1 / S2-R4, S2-R6, S3-N1–N3, S5-R10, S5-R15, S7-R5, S7-R7, NFR-002–005, NFR-008 | SV-11532, SV-11533, SV-11535, SV-11537 | Nemanja Djuric |
| [SV-11595](https://shopview.atlassian.net/browse/SV-11595) | A/R & A/P aging — verify Phase 2: A/R Summary and A/P Summary | Phase 2 | SV-11531 – SV-11538 | Nemanja Djuric |
| [SV-11596](https://shopview.atlassian.net/browse/SV-11596) | A/R & A/P aging — verify Phase 3: A/R Collection and A/P Unpaid Invoices | Phase 3 | SV-11531 – SV-11539 | Nemanja Djuric |
| [SV-11598](https://shopview.atlassian.net/browse/SV-11598) | A/R & A/P aging — verify Phase 4: A/R Detail and A/P Detail | Phase 4 | SV-11531 – SV-11538 | Nemanja Djuric |
| [SV-11599](https://shopview.atlassian.net/browse/SV-11599) | A/R & A/P aging — verify Phase 5: legacy aging code retired | Phase 5 | SV-11533, SV-11537 | Nemanja Djuric |

When all these tickets are marked Done, the feature is ready for QA.