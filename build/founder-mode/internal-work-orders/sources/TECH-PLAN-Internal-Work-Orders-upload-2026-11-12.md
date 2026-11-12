# Internal Work Orders — Technical Implementation Plan

**Date:** 2026-10-28 (rebuilt 2026-11-09 for PRD v0.21; updated 2026-11-09 for v0.22; updated 2026-11-10 for v1.0)
**PRD:** [Internal Work Orders (PRD) v1.0](https://shopview.atlassian.net/wiki/spaces/PM/pages/942243841/Internal+Work+Orders+PRD) (Confluence page version 39, final for build) + child page "Internal Work Orders: Review Decisions and Open Questions" (v2)
**Jira epic:** [SV-11665](https://shopview.atlassian.net/browse/SV-11665) — stories SV-11758 … SV-11767 (Stories 1–10), SV-12226 (Story 12), SV-12295 (Story 13), SV-12296 (Story 12, portal rendering), SV-11833 (Story 11, out of this plan); Product's rule-zero verify ticket SV-12297
**Design:** [Internal Work Orders, All flows v6.1](https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo) (claude.ai artifact canvas, 2026-11-05; the PRD header states that where a frame and the text disagree, **the text wins**)
**Tech stack:** core `api/` (PHP 8.5, Symfony 7.4, Doctrine 3/DBAL 4, MySQL), core `app/` (Vue 3.5, Quasar 2, TypeScript), sibling `shopview-accounting` hub (Laravel, PHP 8.5, Pest), sibling `shopview-portal` (customer portal), accounting contracts package `shopview/accounting-contracts`
**Estimated complexity:** High — three repositories plus the portal, shop-managed categories with per-location accounting, a third invoice state threaded through every invoice-status consumer, a no-charge line inside the billable invoice path (posting, QuickBooks invoice sync, every money report), six new accounting contract versions with a fixed deploy order, and a release-day seeding run.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started — plan built on PRD v1.0 (page 39, final for build); verification tickets in Section 11
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** PRD v1.0 (page version 39, final for build) is folded in: Product answered round 4 in v0.23 (page 37) and the hub owner confirmed HQ8 in v0.24 (page 38); every item as proposed except Q65 (the Close row names the core amount, D66) and HQ8 (a fuller lifecycle and a source link on Accounting Events, D70). **Nothing is pending from Product or the hub owner, and no phase has a merge gate.** Two read-only prod queries are still owed by the engineer running the plan: **Q20** (Make internal volume → synchronous vs queued, NFR-007) and **Q21** (table sizes → indexes, Section 9); neither blocks implementation.

### PRD baseline

| | |
|---|---|
| **PRD version this plan is built on** | v1.0 (final for build) — Confluence page version **39** (published 2026-11-09), read in full 2026-11-10 |
| **Exact baseline text** | [page version 39](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=942243841&pageVersion=39) (Confluence keeps every version; diff it against the current one in the page history → Compare) |
| **Last audited against** | page version 39 (2026-11-10) |
| **Design baseline** | All flows v6.1 (artifact canvas, 2026-11-05) |

**When the PRD changes:** compare the current page version with the baseline above. If it moved, diff baseline → current (page history → Compare, or re-fetch both versions), re-check every changed requirement against Sections 1, 3, 6, 10 and the appendices, re-run the fresh-eyes audit, then add a row to the revision history below and move the baseline. Never treat a comment reply or the PRD's change-log line as a substitute for the diff — other people edit the page without notice.

### Plan revision history

| Rev | Date | PRD (page version) | Audited | What changed in the plan |
|---|---|---|---|---|
| 1 | 2026-10-28 | v0.16 (23) | — | First plan: Stories 1–10 core + hub; round 1–2 questions posted |
| 2 | 2026-10-29 | v0.17 (24) | ✅ page 24 | Product's 27 answers folded in (D33–D46); verification tickets SV-11973 … SV-11981 |
| 3 | 2026-11-09 | v0.21 (35) | ✅ page 35 | Rebuilt for categories (replacing reasons and the two fixed accounts), Story 12 (no-charge line), Story 13 (release seeding), original work order / line / technician, hub seeding (6430, Comeback), rule zero, per-work-order hub ordering, contracts v4/v3/upsert (D47–D59); customer portal added as Phase 11; one API contract, QuickBooks rows release-gated and rendered from 2C, de-pricing labour type, fresh-eyes audit and re-audit fixes (D60–D68; D14, D42, D47, D52 amended: vendor bills post straight to the category, Close completes in one transaction, core cost, IBS); round 3 questions Q30–Q61 and HQ1–HQ7 posted, round 4 (Q62–Q65, HQ8) drafted |
| 4 | 2026-11-09 | v0.22 (36) | ✅ page 36 | Round 3 answered by Product (Q30–Q61, HQ1–HQ7; 37 of 39 as proposed): pending markers removed, Phase 4B and Phase 13 gates lifted, the Phase 8 gate narrowed to the B2b deferred move (HQ8); build changes: the report CSV carries the open tab (Q34), "No Charge" in the Statistics total (S2-R4), the hub seeding command runs after the hub release and again at launch (S13-R3), Close on credit hold (new S3-N5), "Not in ShopView" never printed (S2-R16), the Issue Credit restock posts from the category (D69); Q46 answered with a removed report (FYI Q66); round 4 reworded (Q62–Q67, HQ8 drafted) |
| 5 | 2026-11-10 | v1.0 (39) | ✅ page 39 | Round 4 answered by Product in v0.23 (page 37), HQ8 confirmed by the hub owner in v0.24 (page 38), v1.0 final for build (page 39); 16 requirements changed, all from round 4. Every item as proposed except Q65 (the Close row names the core amount) and HQ8 (the hub owner spelled out the Held move's lifecycle): pending markers removed, the Phase 8 merge gate lifted; build changes: N9 `stock_parts_core_cost` replaces `includes_core_cost` (D66 amended), Accounting Events and the move's journal entry link the source vendor bill or credit and its line (D70), HQ8's lifecycle tests added to B2b; the fresh-eyes audit against page 39 (1 high, 9 medium, 6 low) is fixed: the hub's reconciliation shows Held entries in a category-free section (its categories skip `journal_entry_requested`), withdraw reasons per cause, N8 `moves[]` for the one-row-per-move Create invoice dialog, the cost-move step on the Edit Line door, the S7-N3 types on stock-part entries, the restocking fee refused server-side, the 50 / 100 caps in the UI and on restore, the portal obsolete banner for a work order made internal; verification tickets refreshed to v1.0 (Section 11) |

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it. E2E coverage is not part of `/implement`: run `/e2e-after-change` before `/create-pr`.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.
> 🏦 **Several repositories.** Phases 7 and 8 are implemented in the sibling `shopview-accounting` repository and Phase 11 in `shopview-portal`, each with that repository's own agents, conventions (its `CLAUDE.md` / `AGENTS.md`) and review tooling — a matched set of PRs, never reviewed with core's `/pr-review`. Core's `/implement` agents (`be-*`, `fe-*`) do not work there. Phase 9's emission PR must not merge before Phase 8 is deployed to production (Section 6, release order).

> 🎨 **Design access.** Design files are never copied into the repo or shipped with this plan; open them from the link. Use the **DesignSync** tool (load it with `ToolSearch` `select:DesignSync`), with `get_project` / `list_files` / `get_file` and the project id from a `claude.ai/design/p/<projectId>` link. `get_file` is capped at 256 KiB, so check `.truncated`. A `claude.ai/artifact/<id>` canvas opens with the **Artifact** tool (`action: "read"`), and a `figma.com` link with the Figma MCP. WebFetch and curl return 403. Project sub-agents (`be-*`, `fe-*`, `e2e-implementer`) don't have these tools, so the orchestrator opens the link and passes what a phase needs (the boards it cites) into the agent's prompt. The design for this feature is a claude.ai **artifact** canvas (All flows v6.1); open it with the Artifact tool (`action: "read"`, then `scope: "files"` and per-frame `path` reads under `project/`), because the canvas renders client-side. Flows 0–6; Flow 6 is Story 12.

> ⚡🔒 **Performance and security are top priorities for every phase.** Before writing code, read §9. Every new read path must be paginated or bounded, tenant-scoped, and backed by an index, with no N+1 or per-row fan-out. Every new endpoint must enforce authorization. Where §9 says data is derived or backfilled, keep it up to date on the write paths it lists. When a phase is dispatched, the orchestrator includes the §9 items that phase touches in the implementer's prompt.

> 📎 **Where the detail lives.** Section 6 gives each phase's scope, key files and gates. The full per-phase detail — every file, code sketch, migration, endpoint contract and test path — is in the appendices: **Appendix A** (backend, `api/`), **Appendix B** (frontend, `app/`), **Appendix C** (AccountingHub, `shopview-accounting`), **Appendix D** (customer portal, `shopview-portal`). Each Section 6 phase names the appendix sections it executes. Where an appendix and Section 3 disagree, **Section 3 wins** (it holds the reconciled decisions).

---

## 1. Requirements (extracted from PRD)

The functional requirements are the PRD's own stable IDs (`S<story>-R<n>` requirements, `-N<n>` negative cases, `-E<n>` edge cases). Each is tagged with its epic story. First sentence shown; the PRD text (v1.0, page version 39) is the source of truth for the full wording and copy.

| PRD story | Jira story | In this plan |
|---|---|---|
| 1 Turn on, flag internal customers, manage categories | SV-11758 | ✅ |
| 2 Internal / no-charge WO from creation to Close | SV-11759 | ✅ (S2-R12 → Story 11, out) |
| 3 Close | SV-11760 | ✅ |
| 4 Reopen | SV-11761 | ✅ |
| 5 QuickBooks account mapping | SV-11762 | ✅ |
| 6 AccountingHub account mapping | SV-11763 | ✅ (hub + core UI port) |
| 7 QuickBooks sync | SV-11764 | ✅ |
| 8 AccountingHub closed record + parts cost | SV-11765 | ✅ (hub + core emission + UI port) |
| 9 Reports, dashboard, exports | SV-11766 | ✅ (rule-zero verify: Product's SV-12297) |
| 10 Shop supplies | SV-11767 | ✅ |
| 11 Open API and webhooks | SV-11833 | ➖ out of this plan (user decision). Its safety half ships in the core release: no `invoice.created` / `invoice.paid` for an internal invoice and no internal invoice in any invoice list, for good (Q2, S3-R4, S11-R2/R3) |
| 12 A no-charge line on a billable work order | SV-12226 (+ SV-12296 portal rendering) | ✅ core, hub and portal |
| 13 Release day, seeding and migration | SV-12295 | ✅ (core seed CLI, hub operator command, release runbook) |

### Functional requirements


**Story 1 (SV-11758)**

- **S1-R1** (SV-11758): Settings > Work Orders shows a toggle "Internal Work Orders" (Title Case like the other toggles on the tab), off by default, organization-wide like the other toggles, with the description "Lets you flag your own company as an internal cu…
- **S1-R2** (SV-11758): Switching the toggle from off to on for the first time in the organization opens the modal "Which customers are your own company?" with the body "Work orders for these customers are internal: no prices and no invoice;
- **S1-R3** (SV-11758): While the toggle is on, two hint lines sit under the description, each with an info icon: "Manage categories in Internal Work Orders (Administration > Service).
- **S1-R4** (SV-11758): While the toggle is on and no customer carries the flag, the first hint of S1-R3 reads instead "No internal customer yet.
- **S1-R5** (SV-11758): "Do this later" saves the toggle (on) and closes the modal without flagging anyone;
- **S1-R6** (SV-11758): Unticking the "Internal customer" checkbox on Edit Customer opens the dialog of S1-R12 before the dialog is saved;
- **S1-R7** (SV-11758): Edit Customer shows the checkbox "Internal customer" as the last field of the dialog, below "PO is required", with the helper "Work orders for this customer are internal: no prices, no invoice, parts cost posts to the expense account of…
- **S1-R8** (SV-11758): While the setting is on, a flagged customer shows an "Internal" badge next to its name in the customer header, in the customers list and on the customers list mobile card.
- **S1-R9** (SV-11758): More than one customer can be flagged, in the modal or one by one on Edit Customer.
- **S1-R10** (SV-11758): Turning the toggle off hides the hint lines and the customer badges and leaves the flags on the customers.
- **S1-R11** (SV-11758): When a customer is flagged (Save in the modal, or on Edit Customer with the checkbox ticked), or the setting is turned on again while flagged customers have open billable work orders (S1-R10), a dialog reads "[n] open work orders for [cu…
- **S1-R12** (SV-11758): Removing the flag (unticking the checkbox on Edit Customer, S1-R6) opens the dialog "Remove the Internal flag from [customer]?" with the body "[n] open internal work orders for [customer] stay internal and close without an invoice.
- **S1-R13** (SV-11758): Administration > Service > Internal Work Orders is a page with two tabs.
- **S1-R14** (SV-11758): The category dialog ("New Internal Category", "New No Charge Category", or Edit with the current values) has: Name (required, unique within its list including archived categories, refused with "A category with this name is archived.
- **S1-R15** (SV-11758): Edit Asset of an internal customer shows, after the existing fields and under a divider, the select "Internal category" (the active Internal categories;
- **S1-R16** (SV-11758): A category has a stable key;
- **S1-N1** (SV-11758): If the user does not have 'Settings — App', Settings > Work Orders is not available to them, as today.
- **S1-N2** (SV-11758): If the user has 'Settings — App' but not 'Customers — Create & Edit', the modal of S1-R2 still works and Save flags the picked customers (flagging from Settings is part of the setting);
- **S1-N6** (SV-11758): If the user does not have 'Work Orders — Create & Edit', the dialog of S1-R11 shows the same body and list with one button, OK;
- **S1-N3** (SV-11758): If the user does not have 'Customers — Create & Edit', the Edit Customer dialog is not available to them, as today;
- **S1-N4** (SV-11758): If the toggle is off, Edit Customer shows the checkbox only for a customer that already carries the flag, ticked and read-only, with the line "Turn on Internal Work Orders in Settings to change this." where Settings is a link;
- **S1-N5** (SV-11758): If a flagged customer has open internal work orders, removing the flag is not refused;
- **S1-E1** (SV-11758): If a flagged customer loses the flag, its closed internal work orders stay Closed · Internal and its open internal work orders stay internal, in every list and report;
- **S1-E2** (SV-11758): If a flagged customer is deleted, its flag goes with it;
- **S1-E3** (SV-11758): If a shop has several locations, the toggle and the flag are organization-wide;
- **S1-E4** (SV-11758): If a work order on a flagged customer was created while the setting was off (billable), turning the setting on offers S1-R11 for it like any other open billable work order.

**Story 2 (SV-11759)**

- **S2-R1** (SV-11759): In the New Work Order dialog, picking a customer with the Internal customer flag shows the "Internal" badge next to the customer name with an info icon;
- **S2-R2** (SV-11759): In the New Work Order dialog (New Work Order only;
- **S2-R3** (SV-11759): The work order header shows one badge next to the status: "Internal" for an internal work order, "No Charge" for a no-charge work order (a different style from Internal), in the desktop and the mobile header.
- **S2-R4** (SV-11759): Lines on an internal or no-charge work order show quantity, cost (parts) and hours (labor) and no sell prices: the Rate, Margin and Total columns of the lines table (a part's sell price sits in Rate) and the Sell price, Rate and Margin f…
- **S2-R5** (SV-11759): On a billable work order on a regular customer, the three-dots menu offers "Convert to No Charge" (next to Add Work Order Fee / Discount) until the work order is invoiced.
- **S2-R6** (SV-11759): On a no-charge work order the menu offers "Change category" and "Convert to Billable" until the work order is closed.
- **S2-R7** (SV-11759): Changing the customer on a work order works as today (not offered on an invoiced or paid billable work order, as today, nor on a closed internal or no-charge work order, S2-R9);
- **S2-R8** (SV-11759): If a vendor bill already exists on the work order, a customer change (S2-R7), a Convert action (S2-R5, S2-R6) or, on a line that has a posted vendor bill, Mark as No Charge, Change category or Mark as Billable (Story 12) first shows the…
- **S2-R9** (SV-11759): From Close or invoice on, the classification and the category are locked: a closed no-charge work order shows the No Charge badge with no Convert or Change category action, on a closed internal or no-charge work order the Change Customer…
- **S2-R10** (SV-11759): The work orders list shows the badge in the status column for internal and no-charge work orders in every tab, in the Tech View display and on the mobile card.
- **S2-R11** (SV-11759): Parts ordering, receiving, picking, clock-ins, approvals, notes, inspections, split and review work exactly as on a billable work order.
- **S2-R12** (SV-11759): The Open API and its webhooks are specified in Story 11: the classification and the category on the resources it exposes, the Internal flag on customers, the status "closed", no invoice webhook for an internal invoice, and the work order… ➖ out of this plan (Story 11)
- **S2-R13** (SV-11759): The classification is written on the work order when it is created, when its customer changes and when it is converted;
- **S2-R14** (SV-11759): While the Internal Work Orders setting is on, the work orders list shows a chip "Classification: All / Billable / Internal / No Charge" (the existing single-choice chip), default All, on every tab and in the mobile filter sheet.
- **S2-R15** (SV-11759): When a work order becomes internal or no charge, its work order fees and discounts and its line discounts are removed with the prices, and "Add Work Order Fee / Discount" is not shown in its menu.
- **S2-R16** (SV-11759): A no-charge work order always carries one category from the No Charge list, set at creation (S2-R2) or at conversion (S2-R5) and editable with Change category (S2-R6) until Close.
- **S2-R17** (SV-11759): When the category requires the original work order, every dialog that sets the category (New Work Order S2-R2, Convert to No Charge S2-R5, Change category S2-R6, and the line dialogs of Story 12) shows the selects "Original work order" a…
- **S2-R18** (SV-11759): Every classification change writes a read-only system note on the work order (Notes tab, author ShopView, with the user and the time) and an Audit Log row: Convert to No Charge ("Converted to No Charge by [user].
- **S2-R19** (SV-11759): No event writes a sell price onto an internal or no-charge work order, or onto a no-charge line (Story 12): not receiving a special-order part at a real cost, not editing the cost on a vendor invoice, not a core-charge change (today each…
- **S2-R20** (SV-11759): Fixed price and Fixed Line Total: when a work order becomes internal or No Charge, or a line is marked No Charge, the line's fixed labor price and Fixed Line Total (labor and parts portions) are removed with the prices;
- **S2-R21** (SV-11759): At creation of an internal or no-charge work order, auto-apply fee and discount templates and the customer's default discount are not applied at all;
- **S2-R22** (SV-11759): The per-line warranty flag that exists in the data and in the Open API (is_warranty;
- **S2-N1** (SV-11759): If the setting is off, the New Work Order dialog shows no badge, hint or No Charge checkbox, and new work orders for flagged customers are billable.
- **S2-N2** (SV-11759): If the user does not have 'Work Orders — Create & Edit' and 'See Financial Data', the Convert to No Charge, Convert to Billable and Change category actions are not shown in the menu and the checkbox is not shown in the New Work Order dia…
- **S2-N3** (SV-11759): If the selected customer is an internal customer, the "No Charge" checkbox is not shown in the New Work Order dialog and a billable work order of that customer offers no Convert action (S2-R2, S2-R7).
- **S2-N4** (SV-11759): If the work order has a deposit, "Convert to No Charge" is disabled with the tooltip "Reverse the deposit first", as the Change Customer button on the customer card is today.
- **S2-N5** (SV-11759): "Add Deposit" is not shown on internal and no-charge work orders.
- **S2-E1** (SV-11759): If a line is added to an internal or no-charge work order from a canned line, from an inspection or from ShopCoach, its prices are dropped on entry;
- **S2-E2** (SV-11759): If a work order is split, each part keeps the classification of the original and, on a no-charge work order, its category;
- **S2-E3** (SV-11759): An imported work order takes the classification of its customer at import: internal for a flagged customer while the setting is on, billable otherwise.
- **S2-E4** (SV-11759): If a no-charge work order is made billable again, lines priced by hand before it was marked no charge are priced as in S2-R6, not at the old hand-set prices.
- **S2-E5** (SV-11759): Lines copied into an internal or no-charge work order lose their prices as in S2-E1;
- **S2-E6** (SV-11759): If an estimate was already sent to the portal, or IBS approval requested, before the work order is converted to no charge, the portal shows the updated estimate with the NO CHARGE stamp on its next open and no call goes to IBS: ShopView…
- **S2-E7** (SV-11759): Parts with a core charge work as today up to resolution: the core row shows on the lines with no price, Core OK / Not OK is required before Close as it is before invoicing, and the completion wizard shows no core amount on an internal or…

**Story 3 (SV-11760)**

- **S3-R1** (SV-11760): On an internal or no-charge work order, every place that offers "Create invoice" on a billable work order offers "Close Work Order" instead (Title Case, like Create Work Order, the same label everywhere) and opens the confirmation of S3-…
- **S3-R2** (SV-11760): Close opens the confirmation "Close work order [number]?" with a posting date field (default today;
- **S3-R3** (SV-11760): Confirming completes the work order if it is not yet Complete, creates the internal invoice underneath (carrying the work order number, nothing owed), relabels the picks to the internal invoice and sends their journal entries as invoicin…
- **S3-R4** (SV-11760): No payment is recorded (not even the $0 payment a $0 invoice writes today) and no "Invoice paid" log entry is written, no customer transaction or receivable is created, no customer portal notification, email or invoice webhook is sent (t…
- **S3-R5** (SV-11760): The Finance tab of a closed work order shows the NO CHARGE document: the masthead as on the invoice today (letterhead left, the shop logo in the centre slot, the document block "Internal Work Order [number]" or "No Charge Work Order [num…
- **S3-R6** (SV-11760): The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance "No Charge" and Discount and Tax rate empty (rows on that tab have no actions).
- **S3-R7** (SV-11760): If the organization requires review before completion, the work order goes through Review and Mark Reviewed first, exactly as a billable one;
- **S3-N1** (SV-11760): If the work order is billable, the button reads "Create invoice" and everything works as today.
- **S3-N2** (SV-11760): If Create invoice would not be offered (review on and not yet marked, or every line declined), Close Work Order is not offered either.
- **S3-N3** (SV-11760): If the user does not have 'Invoicing & Payments — Create & Edit' and 'See Financial Data', the Close Work Order button is not shown, as Create invoice is not.
- **S3-N4** (SV-11760): If no account is mapped for the work order's classification (for a no-charge work order in QuickBooks, no account for the work order's category), the confirmation of S3-R2 replaces the account note with: QuickBooks, "No account set for […
- **S3-N5** (SV-11760): A customer on credit hold does not block Close: nothing is owed, so Close Work Order is offered and works as on any other work order.
- **S3-E1** (SV-11760): If the work order has no parts, the confirmation shows "Parts cost $0.00";
- **S3-E2** (SV-11760): If a part on the work order has no cost recorded, the confirmation lists it under "Parts with no cost" and posts the rest;
- **S3-E3** (SV-11760): If the posting date is in a closed accounting period, Close succeeds;
- **S3-E4** (SV-11760): If the shop has no accounting integration at the work order's location, Close shows the confirmation without account notes, and the sentence of S3-R2 is replaced by "This marks the work order Closed · Internal (Closed · No Charge).
- **S3-E5** (SV-11760): If lines, the shop supplies amount or the classification change after the confirmation opens, Close is refused with "This work order changed.

**Story 4 (SV-11761)**

- **S4-R1** (SV-11761): On a closed internal or no-charge work order the Finance tab's invoice menu shows "Reopen Work Order" where a billable work order shows "Reverse", and no Issue Credit.
- **S4-R2** (SV-11761): Reopen opens the dialog "Reopen work order [number]?" with the body "The work order leaves Closed · Internal and goes back to Complete.
- **S4-R3** (SV-11761): Confirming reverses exactly the entries that were posted at Close (Stories 7 and 8), returns the parts to inventory as Reverse does today, removes the internal invoice, and sets the work order to Complete with its classification unchange…
- **S4-R4** (SV-11761): Closing again (Story 3) posts the final numbers as a new entry with the new posting date.
- **S4-N1** (SV-11761): If the user does not have 'Work Orders — Delete', Reopen is not shown.
- **S4-N2** (SV-11761): If the work order is billable and invoiced, the existing Reverse behaviour applies, unchanged.
- **S4-E1** (SV-11761): If the Close entry is still held in AccountingHub, Reopen withdraws it instead of posting a reversal;
- **S4-E2** (SV-11761): If the Close entry was posted in a period that is now closed, the QuickBooks reversal lands in QB Unexported with the closed-period error as today, and the hub holds it with that reason;
- **S4-E3** (SV-11761): Vendor bills on the work order are not touched by Reopen;
- **S4-E4** (SV-11761): If the customer lost the Internal flag, or the setting was turned off, after Close, Reopen still returns the work order as internal.

**Story 5 (SV-11762)**

- **S5-R1** (SV-11762): Integrations > QuickBooks, ShopView Accounts, shows one row per category directly under Cost of Parts (above Cost of Goods (tax)), grouped under the headers "Internal work orders" and "No Charge work orders", each row named after its cat…
- **S5-R2** (SV-11762): Each row uses the same account picker as the other ShopView Accounts rows, listing the expense accounts of the location's connected QuickBooks company (S1-R14, S5-R1), as the other rows do.
- **S5-R3** (SV-11762): Save stores the mapping for the location.
- **S5-R4** (SV-11762): While a category row is empty, the row shows the existing empty-row hint with the text "Not set.
- **S5-R5** (SV-11762): The rows are shown whether or not the Internal Work Orders setting is on, so the accountant can map ahead of time.
- **S5-R6** (SV-11762): The per-category mapping follows the per-row model of part categories, not the fixed ShopView Accounts keys: one row per category per location, keyed by the category's stable key.
- **S5-N1** (SV-11762): If QuickBooks is not connected at the location, the rows are not shown, as the rest of ShopView Accounts is not.
- **S5-N2** (SV-11762): If the user does not have 'Settings — Integrations', the page is not available to them, as today.
- **S5-E1** (SV-11762): If a mapped account is later deleted or made inactive in QuickBooks, the row shows the existing inactive or deleted state the other rows use, and entries fail and show in QB Unexported, as every other row's do today, until a new account…
- **S5-E2** (SV-11762): If a category row is empty, the parts cost of that category's work orders and lines posts to the ShopView Review account (S5-R4);

**Story 6 (SV-11763)**

- **S6-R1** (SV-11763): Accounting > Account Mappings shows one row per category under "Parts cost of goods sold", named after the category ("Internal: General Internal", "No Charge: Warranty"), each a picker over the organization's chart of accounts like the o…
- **S6-R2** (SV-11763): Automatically set up the starting category mappings using AccountingHub's existing chart of accounts.
- **S6-R3** (SV-11763): The accountant can change any category row to any account in the chart, including the existing 6400 Shop Equipment Maintenance account where appropriate, as the other rows allow, and can add accounts to the chart as today.
- **S6-R4** (SV-11763): Saving a mapping retries any events held for a missing account (Story 8).
- **S6-N1** (SV-11763): If AccountingHub is not enabled, nothing changes for the organization.
- **S6-N2** (SV-11763): If the user does not have 'Accounting — Settings', the page is not available to them, as today.
- **S6-E1** (SV-11763): If a mapped account is made inactive, events are held with that reason (Story 8) until the row is changed.

**Story 7 (SV-11764)**

- **S7-R1** (SV-11764): No invoice, sales receipt or payment is sent to QuickBooks for an internal or no-charge work order.
- **S7-R2** (SV-11764): At Close, ShopView sends the inventory journal entries it sends at invoice today (one per picked stock part, same numbering, dated the posting date), with the debit on the expense account of the work order's category instead of the part…
- **S7-R3** (SV-11764): When a vendor bill is created for a special-order part or a sublet on a work order that is already internal or no charge, the bill line posts to the mapped expense account instead of Cost of Parts (or the category account);
- **S7-R3a** (SV-11764): A vendor credit or a return for a special-order part or a core of an internal or no-charge work order posts its line to the account the matching bill line was posted to, and after Close to the work order's mapped expense account, so the…
- **S7-R4** (SV-11764): When a vendor bill was posted to Cost of Parts (or a category account) and the work order later becomes internal or no charge, Close adds a reclass journal entry: debit the mapped expense account, credit the account the bill line was pos…
- **S7-R4a** (SV-11764): At Close, when the work order's shop supplies amount is above $0.00, ShopView sends one journal entry dated the posting date: debit the work order's mapped expense account (the expense account of the work order's category), credit the in…
- **S7-R5** (SV-11764): At Reopen, ShopView sends reversing journal entries for exactly the entries it posted at Close, dated the reopen date, memo "Reopened [number]", as Reverse does for invoiced work orders today.
- **S7-R6** (SV-11764): Every entry carries an idempotency key, so a retry or a resend never creates a second entry in QuickBooks.
- **S7-R7** (SV-11764): The sync runs regardless of whether the closing user has the 'Settings — Integrations' setting;
- **S7-R8** (SV-11764): On a billable work order with no-charge lines (Story 12), the invoice is sent to QuickBooks as today with those lines at $0.00.
- **S7-N1** (SV-11764): If QuickBooks is not connected at the location, nothing is sent and Story 3 behaves exactly as it does without the integration.
- **S7-N2** (SV-11764): If no expense account is mapped (with Inventory Asset and Cost of Parts mapped;
- **S7-N3** (SV-11764): If the posting date falls in a closed period, QuickBooks rejects the entry and it lands in QB Unexported under Journal Entries with the QuickBooks error text, the work order number and the classification (type "Internal Work Order Close"…
- **S7-N4** (SV-11764): If the work order has no costed stock parts, no reclass and a shop supplies amount of $0.00, no journal entry is sent.
- **S7-N5** (SV-11764): If Inventory Asset or Cost of Parts is not mapped at the location, no parts entry is sent at Close (stock parts and reclass entries), as invoicing sends none today for that location: the inventory journal entries need both accounts, so a…
- **S7-E1** (SV-11764): If the same Close event reaches the sync twice, the idempotency key prevents a duplicate (S7-R6).
- **S7-E2** (SV-11764): If an entry in QB Unexported is Marked as Exported by hand and the work order is later reopened, the reversal is still sent, so the books stay symmetrical;

**Story 8 (SV-11765)**

- **S8-R1** (SV-11765): At Close, the hub receives the invoice event carrying the classification (Internal or No Charge), the category, the original work order and line and the original technician when set, the work order number and the asset, and keeps an invo…
- **S8-R2** (SV-11765): At Close, the hub posts the parts cost entries dated the posting date: debit the mapped expense account, credit Inventory, for the cost of the stock parts, source "Internal work order" (or "No-charge work order"), linked to the record of…
- **S8-R3** (SV-11765): Vendor bill lines, reclass entries and the shop supplies entry follow Story 7, S7-R3, S7-R3a, S7-R4 and S7-R4a, with the hub's accounts (the credit goes to the Shop supplies expense row, seeded 5100 Shop Supplies COGS: in the hub the amo…
- **S8-R4** (SV-11765): At Reopen, the hub posts the reversing entry linked through the existing Reversal links, and the record of S8-R1 is voided as a reversed invoice is today.
- **S8-R5** (SV-11765): Replaying historical events carries the classification, so a replay never turns a closed internal work order into revenue.
- **S8-R6** (SV-11765): The Invoice list report's status filter gets the value Closed, unselected by default, so the default report and its totals are unchanged.
- **S8-R7** (SV-11765): An invoice of a billable work order with no-charge lines (Story 12) reaches the hub as an ordinary invoice record with its revenue and receivable on the billable lines.
- **S8-N1** (SV-11765): If AccountingHub is not enabled, nothing is sent.
- **S8-N2** (SV-11765): If a mapped account on either side of the entry is missing or inactive, or the posting date falls in a closed fiscal period or in none, the event gets a status Held (new in the hub) on the Accounting Events page with the reason ("No Char…
- **S8-E1** (SV-11765): If the same event arrives twice, the event id prevents a second posting, as today.
- **S8-E2** (SV-11765): If a work order is reopened while its Close event is Held, the Held event is withdrawn and no reversal is posted (Story 4, S4-E1).

**Story 9 (SV-11766)**

- **S9-R1** (SV-11766): Sales, Sales By Customer, Sales By Representative and Advisor Analysis leave whole internal and no-charge work orders out of every number, with no filter and no option to include them.
- **S9-R2** (SV-11766): The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders.
- **S9-R3** (SV-11766): Technician Efficiency shows a filter chip "Internal work orders: Hide / Only internal / Show all" (the existing single-choice chip;
- **S9-R4** (SV-11766): The Internal Work Orders report appears in the Reports list once the organization has closed its first internal or no-charge work order or invoiced its first work order with a no-charge line, and stays listed from then on for good, with…
- **S9-R5** (SV-11766): Sales Tax Collected, IBS Batches, the A/R Aging reports (Summary, Detail, Collection) and customer statements never include internal and no-charge work orders.
- **S9-R6** (SV-11766): The Customer Invoice export in the Export Reports dialog gets the option "Include internal and no-charge work orders" (off by default;
- **S9-R7** (SV-11766): Parts Velocity counts parts used on internal and no-charge work orders and on no-charge lines as units used and in demand;
- **S9-R8** (SV-11766): Shop Efficiency, Technician Utilization and Timesheets keep clocked hours on internal and no-charge work orders and on no-charge lines as worked hours;
- **S9-R9** (SV-11766): Inventory Value, Work In Progress and A/P reports are unchanged;
- **S9-R10** (SV-11766): The asset's Invoices tab lists the closed internal and no-charge work orders with the badge, Total balance "No Charge" and Discount and Tax rate empty, dated by the posting date, so the history per unit is there;
- **S9-R11** (SV-11766): With Show all on Technician Efficiency, internal and no-charge work orders count as work orders with their hours and no sales.
- **S9-R12** (SV-11766): Work In Progress keeps its existing treatment of a $0 line (quoted hours, no value);
- **S9-R13** (SV-11766): The Customer Invoice export (S9-R6) shows a no-charge line of a billable invoice as a $0.00 row with the category in the description, without the option of S9-R6, since the invoice is a billable invoice.
- **S9-R14** (SV-11766): Rule zero.
- **S9-R15** (SV-11766): Reports not named above, checked and unchanged under rule zero: Requested Parts, Payroll Timesheet and the Journal Entries report (which shows the Close and no-charge-line entries with the category account on the debit side like any entry).
- **S9-R16** (SV-11766): The report, both tabs and the export run through the accessible-workplace scope every report uses (SV-9116): a user sees the locations they have access to, the Location filter offers only those, and the By technician numbers are computed…
- **S9-N1** (SV-11766): If the organization has never closed an internal or no-charge work order nor invoiced a work order with a no-charge line, the Internal Work Orders report is not listed, the Technician Efficiency chip is not shown and the export option is…
- **S9-N2** (SV-11766): If the user does not have 'Reports — Page Access', the reports are not available, as today.
- **S9-N3** (SV-11766): The By technician tab is visible to every user with 'Reports — Page Access', as Technician Efficiency is today;
- **S9-E1** (SV-11766): A reopened internal or no-charge work order keeps its classification and leaves the Internal Work Orders report until it is closed again;
- **S9-E2** (SV-11766): The $0 invoices created before this feature stay billable invoices in every report, as today;

**Story 10 (SV-11767)**

- **S10-R1** (SV-11767): An internal or no-charge work order carries one field "Shop supplies" (a dollar amount) in the block where a billable work order shows its totals.
- **S10-R2** (SV-11767): The amount can be changed on the work order until it is closed, with the existing per-work-order shop supplies control.
- **S10-R3** (SV-11767): The Close confirmation (S3-R2) shows the row "Shop supplies $[amount]" with the note "Posted to [work order's expense account], credited to [shop supplies account]";
- **S10-R4** (SV-11767): At Close, the amount posts as one entry: debit the work order's expense account (the expense account of the work order's category), credit the shop supplies account (Story 7, S7-R4a;
- **S10-R5** (SV-11767): No new mapping row in either integration: QuickBooks credits the income account of the existing "Shop supplies" item (Products And Services) (Story 5, S5-R1 note);
- **S10-N1** (SV-11767): If the amount is $0.00, no row is shown in the confirmation and nothing is posted.
- **S10-N2** (SV-11767): If the Shop supplies item is not mapped in QuickBooks, the credit posts to the ShopView Review account as any unmapped account does;
- **S10-N3** (SV-11767): If the user does not have 'See Financial Data', the field is not shown, as the shop supplies charge is not shown today.
- **S10-E1** (SV-11767): If the customer's Min shop supplies charge changes later, open work orders keep the amount they have;
- **S10-E2** (SV-11767): A work order with no parts and no labor still posts its shop supplies amount if it is above $0.00.

**Story 11 (SV-11833)**

- **S11-R1** (SV-11833): The work order and invoice resources carry classification (billable, internal, no_charge) and category (the category key and name; ➖ out of this plan (Story 11)
- **S11-R2** (SV-11833): A closed internal or no-charge work order returns the status `closed`, a new value next to the existing ones, with its classification. ➖ out of this plan (Story 11)
- **S11-R3** (SV-11833): Webhooks: `work_order.status_changed` is sent at Close with the status `closed` and at Reopen with the status `completed` (today it is sent at completion only, so Close on a work order that is already Complete is a new emission). ➖ out of this plan (Story 11)
- **S11-R4** (SV-11833): Writes: a work order created through the API takes the classification and the category of its customer and asset (S2-R1); ➖ out of this plan (Story 11)
- **S11-R5** (SV-11833): The changes are additive. ➖ out of this plan (Story 11)
- **S11-N1** (SV-11833): If Open API V1 is not enabled for the organization, nothing changes. ➖ out of this plan (Story 11)
- **S11-N2** (SV-11833): If a consumer subscribed to invoice webhooks only, it receives nothing for internal and no-charge work orders; ➖ out of this plan (Story 11)
- **S11-E1** (SV-11833): If a work order is reopened and closed again, each Close sends `closed` and each Reopen sends `completed`; ➖ out of this plan (Story 11)
- **S11-E2** (SV-11833): If the setting is turned off later, the fields stay in the API; ➖ out of this plan (Story 11)

**Story 12 (SV-12226)**

- **S12-R1** (SV-12226): On a billable work order, while the setting is on and the work order is not invoiced, the three-dots menu of every line offers "Mark as No Charge" between Edit line and Delete line.
- **S12-R2** (SV-12226): Mark as No Charge opens the dialog "Mark this line as No Charge?" with the line summary (title, hours, parts, technician, current price), the body "The line stays on this work order and shows $0.00 on the invoice.
- **S12-R3** (SV-12226): A no-charge line shows the chip "No Charge · [category]" next to its title on the lines table, in Tech View and on mobile;
- **S12-R4** (SV-12226): The work order carries no badge and no header style and its classification stays billable;
- **S12-R5** (SV-12226): The three-dots menu of a no-charge line offers "Change category" (the dialog of S12-R2 with the current values;
- **S12-R6** (SV-12226): Each action writes a system note on the work order and an Audit Log row (S2-R18): "Line '[title]' marked No Charge by [user].
- **S12-R7** (SV-12226): Create invoice works as today.
- **S12-R8** (SV-12226): Posting at invoice creation follows S7-R8 (QuickBooks) and S8-R7 (AccountingHub): the no-charge line's parts cost to its category's account, the rest as today.
- **S12-R9** (SV-12226): Create invoice is refused while a no-charge line of a category that requires it has no original work order: the message "Line '[title]' needs its original work order (or Not in ShopView) before the invoice." names the line, and Edit Line…
- **S12-R10** (SV-12226): If every line of the work order is No Charge, the work order still invoices at $0.00 as a billable work order (one invoice, nothing owed, as a $0 invoice is paid today);
- **S12-R11** (SV-12226): Reports and the dashboard follow Story 9 (S9-R1, S9-R2, S9-R3, S9-R7, S9-R8, S9-R11 to S9-R13);
- **S12-R12** (SV-12226): Mark as No Charge, Change category and Mark as Billable need 'Work Orders — Create & Edit' and 'See Financial Data';
- **S12-N1** (SV-12226): If the setting is off, no line offers Mark as No Charge and Edit Line shows no checkbox;
- **S12-N2** (SV-12226): If the work order is internal or No Charge as a whole, lines offer no Mark as No Charge: every line is already free.
- **S12-N3** (SV-12226): If the work order is invoiced, the line menu offers neither Mark as No Charge nor Mark as Billable;
- **S12-N4** (SV-12226): If the user lacks 'See Financial Data', the items are not offered and the checkbox is hidden.
- **S12-E1** (SV-12226): If a no-charge line is split to another work order with the existing split, it keeps its mark, category and original fields on the new work order;
- **S12-E2** (SV-12226): If the customer of the work order changes (S2-R7), no-charge lines keep their mark;
- **S12-E3** (SV-12226): If a part on a no-charge line is a core: the core part carries no sell price ($0.00 on the work order, estimate, portal and invoice;
- **S12-E4** (SV-12226): If the category of a no-charge line is archived later, the line keeps it;
- **S12-E5** (SV-12226): If the original work order is deleted, the line keeps the number as text and the report shows it without a link.
- **S12-E6** (SV-12226): A part moved between lines follows the line it lands on, as if added there: onto a billable line it is priced from its cost by the pricing rules;
- **S12-E7** (SV-12226): After invoicing, a part of a no-charge line goes back through Issue Credit like any part: Issue Credit lists it at a $0.00 credit that cannot be edited and with no restocking fee (nothing was charged), the part returns to inventory, and…
- **S12-E8** (SV-12226): Mark as No Charge is not offered on a declined line, on a line that already has a return or a credit, or on a line of a work order that is internal or No Charge as a whole.

**Story 13 (SV-12295)**

- **S13-R1** (SV-12295): A one-time migration creates the starting categories for every organization (S1-R13): General Internal as the default Internal category;
- **S13-R2** (SV-12295): The same migration creates one empty ShopView Accounts row per category at every location with a connected QuickBooks company (S5-R5);
- **S13-R3** (SV-12295): The AccountingHub setup of S6-R2 runs as an operator command, not a deploy migration: organization by organization in isolation, with a list of failures and a verify mode;
- **S13-R4** (SV-12295): Every step is safe to run again: a rerun creates no duplicate category, row, account or mapping and overwrites nothing a shop has changed.
- **S13-R5** (SV-12295): Verification after the run, per organization: four categories, four QuickBooks rows per connected location, four hub mappings populated (Comeback included), the setting off.
- **S13-R6** (SV-12295): Shops that keep an "Internal" or "Shop Fleet" customer today are not touched: the migration flags no customer and reclassifies no work order (Assumptions);
- **S13-E1** (SV-12295): A hub organization whose chart already uses the Comeback default number for an unrelated account gets Comeback Expense at a free number (S6-R2);
- **S13-E2** (SV-12295): An organization created between the migration and the release gets the set from the seeder, not from the migration;
- **S13-N1** (SV-12295): A failure for one organization does not stop the run for the others;

### Non-functional requirements (introduced by analysis unless noted)

- **NFR-001 (analysis; PRD Key Decisions, permissions rule 1):** Every new read/write endpoint is organization-scoped (and workplace-scoped where the data is per location) and authorization-checked with the atoms of the PRD permissions matrix; every write is refused server-side with 403 when the atom is missing, whatever the UI shows. The categories page uses 'Settings — Service'; the QuickBooks account pickers need 'Settings — Integrations' (Change Customer also requires 'Work Orders — Create & Edit' on the server for a service work order, D63).
- **NFR-002 (analysis; PRD S9-R2 sets the 12-month cap):** The Internal Work Orders report is paginated, bounded to ≤ 12 months on the posting/invoice date (the shared 366-day cap), computes totals and the per-category summary over the filtered set rather than the page, exports through the shared export seam with its 10,000-row cap per tab, runs on the report reader with index-backed queries, and reads snapshot values (closed invoice, no-charge statement) with no per-line fan-out.
- **NFR-003 (analysis; PRD S7-R6):** Every QuickBooks journal entry posted for Close, Reopen, reclass, shop supplies or a no-charge line is claimed before the QuickBooks call — inventory entries in the existing `bookkeeping_journal_entry`, the rest in `bookkeeping_cost_journal_entry` keyed by `work_order_cost_entry` (D6). A retry never duplicates; a new cycle (D51) posts new entries.
- **NFR-004 (analysis):** The accounting contract ships hub-first. The hub supports `invoice_created` v4, `journal_entry_requested` v3, `work_order_category_upserted` v1, `vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4 in production before core emits any of them; the six emitted versions rise together (D52).
- **NFR-005 (analysis; PRD S9-R14 rule zero):** Money reports exclude whole internal/no-charge work orders and no-charge lines through two shared NULL-safe predicates (D58), wired in Phase 1 as no-ops on today's data with byte-compare tests; no billable figure changes to the cent.
- **NFR-006 (analysis):** New columns on `work_order`, `work_order_line`, `invoice`, `invoice_statement`, `company`, `vehicle`, `setting`, `inventory_changes`, `bookkeeping_journal_entry`, `bookkeeping_vendor_bill` are appended, defaulted, and safe for `ALGORITHM=INSTANT`; new tables are created without backfill. Migrations are hand-written; `doctrine:migrations:diff` must be a no-op.
- **NFR-007 (analysis):** "Make internal" (S1-R11) is bounded: per-work-order transactions, at most 500 work orders per call with `remaining` so the FE loops, partial failure reported per the Story 1 error handling, across every workplace the user can access (D36). **Assumption:** synchronous (D12); revisit with prod query Q20.
- **NFR-008 (analysis; PRD Out of Scope "Part sales"):** Part sales behave exactly as today; every new guard or branch on code shared with part sales is type-aware (service work orders only).
- **NFR-009 (analysis):** Webhook and portal suppression is test-covered: tests assert both that the internal path stays silent and that the billable path still fires.
- **NFR-010 (analysis; PRD S13-R5, Key Decision "No feature flag"):** Release gate (D21/D43). Until the release run completes, the enable-setting endpoint refuses (deploy-time env switch, removed after launch) and the FE renders none of the new controls (the setting, the Internal customer checkbox, the line actions). The PRD names this explicitly as a release mechanism, not a product setting.
- **NFR-011 (analysis):** Every accounting event that names a category is preceded on the organization's stream by that category's `work_order_category_upserted` (written in the category transaction, an onboarding backfill phase, and a one-time emit in the release run, D49).

### Clarifications & PRD comment outcomes

All Product questions were posted on one footer thread on the PRD (root comment 983269377). **Rounds 1 and 2** (Q1–Q19, Q22–Q29 = PRD comment items 1–27) were answered on 2026-10-29 and folded into v0.17. **Round 3** (Q30–Q61 — Q54–Q61 are the portal questions, Appendix D §7 — plus HQ1–HQ7 for the AccountingHub owner) was posted on 2026-11-09 against v0.21 and answered the same day in **v0.22** (page 36): 37 of 39 as proposed, Q34 with a change (the CSV carries the open tab), Q46 with a report SV-12106 had removed. **Round 4** — **Q62** (S7-R8 Create invoice confirmation), **Q63** (no IBS cancel exists; S2-E6, S12-R4), **Q64** (copy where the PRD has none), **Q65** (core cost on the document vs posted, S2-E7 / S3-R5), **Q66** and **Q67** (FYIs: S9-R15's removed reports; the User Feedback 'Change category' row vs S2-R6) and, with the Q30 addition, **HQ8** (the hub's Held move for an empty category row, which S8-N2's Held list must include) — was posted on 2026-11-09 against v0.22 and answered in **v0.23** (page 37); the hub owner confirmed HQ8 in **v0.24** (page 38), and **v1.0** (page 39) marks the PRD final for build. Every item as proposed except Q65 (the Close row names the core amount: "includes $[core amount] core cost", D66) and HQ8 (confirmed with a fuller lifecycle in S8-R3, including a link to the source bill or credit and its line on Accounting Events, D70). Nothing is pending from Product or the hub owner and no phase is gated. Q20–Q21 are read-only prod queries owed by the engineer running the plan.

| # | Question | Asked via | Answer / status |
|---|---|---|---|
| Intake | Anything the PRD won't say? | intake | "Nothing to add — analyze the PRD as-is" |
| Intake | Session decision 2026-10-28: tech plan includes shopview-accounting (hub) implementation phases for Stories 6 and 8, as a matched pair of PRs reviewed with the hub's own tooling. | user (in session) | Recorded as a directive |
| Intake | Session decision 2026-10-28: Story 11 (Open API, SV-11833) is fully out of this plan; the webhook-safety question rides on PRD comment item 2. | user (in session) | Recorded as a directive |
| Scope | Customer portal rendering (SV-12296, S2-R11) | user (2026-11-09) | The PRD requires it, so the plan covers the portal (Phase 11, Appendix D) |
| Q1 | Customer change after Close: S2-R7/KD allow vs S2-R9 'not offered' | Confluence comment | ANSWERED (changed): on a closed internal or no-charge work order Change Customer is disabled with the tooltip "Reopen the work order to change the customer."; the internal invoice and the hub record keep the customer they were created with. A billable invoiced work order keeps today's behaviour. |
| Q2 | Open API safety at core release before Story 11 (invoice webhooks, invoice lists) | Confluence comment | ANSWERED (OK, extended): internal invoices are never listed by the Open API invoice lists and invoice.created / invoice.paid are never sent for them — from the core release on and for good, not only until Story 11. |
| Q3 | Meaning of 'customer's current pricing' for re-pricing; parts pricing is org-wide | Confluence comment | ANSWERED (OK, refined): every line is priced as a new line on that work order would be priced that day — labor at the customer's labor rate else the location's; parts from the pricing rules applied to the cost already on the line (the cost Close would post), not today's catalogue cost. Copy: "Every line is priced as a new line would be today." |
| Q4 | Design: stale frames 7/7b/7c/7d, unreviewed, orange token unnamed, still-to-draw lists; PRD text wins? | Confluence comment | ANSWERED: the PRD text wins over any frame (now stated in the PRD header). Design updated to All flows v5.12. The orange token name and the design-authority review date follow later; not blocking. |
| Q5 | Report Parts cost fixed at Close vs later special-order bill amounts (reconciliation) | Confluence comment | ANSWERED (OK): parts cost stays fixed at Close, no second column; the report carries the helper "Parts cost is the amount at Close. A special order billed after Close at a different amount is not updated here; with QuickBooks or AccountingHub the bill posts its own amount." |
| Q6 | Min shop supplies without percentage only for flagged customers; no-charge on regular customers | Confluence comment | ANSWERED (not changed): S10-R1 stays — Min without a percentage stays allowed only on flagged customers. A no-charge work order takes the customer's Min if set, else $0.00, editable on the work order. Min and Max show only with 'See A/P & A/R data'. |
| Q7 | Portal estimate content/approval on a no-charge work order | Confluence comment | ANSWERED (OK, extended): the portal estimate shows lines, quantities and hours with no prices, no cost and no total, the NO CHARGE stamp and the reason line; Approve and Decline work as today. |
| Q8 | Completed tab is the awaiting-invoice list; where do closed WOs list | Confluence comment | ANSWERED (OK): closed internal and no-charge work orders show where invoiced ones show (All tab, Status "Closed"), not in the Completed tab. |
| Q9 | QB JE sync skipped when Cost of Parts/Inventory Asset unmapped; ShopView Review not reached | Confluence comment | ANSWERED (changed): keep today's gate — the parts entries need both Inventory Asset and Cost of Parts mapped. With either empty no parts entry is sent at Close (new S7-N5) and the confirmation carries the note "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped."; the shop supplies entry still posts. |
| Q10 | Hub shop supplies credit lands on 5100 COGS vs QB income account | Confluence comment | ANSWERED (OK as is): the hub credit stays on the Shop supplies expense row (5100 Shop Supplies COGS); gross and net profit come out the same in both integrations and the accountant can remap. Noted in S8-R3. |
| Q11 | Turn-on modal Esc/outside-click vs app rule | Confluence comment | ANSWERED (OK): X acts as "Do this later"; Esc and a click outside do nothing. |
| Q12 | Shop supplies edit permission atom | Confluence comment | ANSWERED (OK): editing the shop supplies amount needs 'See Financial Data' and 'Invoicing & Payments — Create & Edit', as the shop supplies charge today. |
| Q13 | Deposit wording: refund vs remove/reverse | Confluence comment | ANSWERED (OK): wording is "Reverse the deposit first" (the app's action name); Change Customer is the button on the customer card. |
| Q14 | Hub Invoice List has status filter; Closed as unselected value | Confluence comment | ANSWERED (OK, hub): the Invoice List report's status filter gets Closed, unselected by default. |
| Q15 | Seeded hub chart premise wrong (FYI) | Confluence comment | ANSWERED: noted — see Q29 (6510). |
| Q16 | Terminology status list wrong | Confluence comment | ANSWERED (OK): the terminology status list is corrected; the feature adds the label Closed, carried underneath by the internal invoice; Authorization is a line status. |
| Q17 | No Total price column w/o See Financial Data; asset Invoices tab Total balance | Confluence comment | ANSWERED (OK, extended): no Total Price column without 'See Financial Data' (badge only); the asset Invoices tab shows "No charge" in Total balance with Discount and Tax rate empty, and its rows have no actions. |
| Q18 | Key Decision: parts leave stock at pick | Confluence comment | ANSWERED (OK): the Key Decision is reworded — Close relabels the picks to the record and posts their cost (parts leave stock when they are picked). |
| Q19 | Confirm add-line-to-closed-no-charge -> billable; export has no Supplies row | Confluence comment | ANSWERED: both confirmed. S9-R6 adds "Parts cost and shop supplies of these work orders are in the No-Charge Work Orders report, not in this export." |
| Q20 | Open billable WOs per $0-workaround customer (bulk Make internal size) | prod query | Not run yet — non-blocking; the plan ships the stated default (D12 / Section 9) and revisits it when the result is in |
| Q21 | Table sizes work_order/invoice/company/invoice_statement_item/inventory_changes | prod query | Not run yet — non-blocking; the plan ships the stated default (D12 / Section 9) and revisits it when the result is in |
| Q22 | Make internal scope across locations (PQ-1) | Confluence comment | ANSWERED (alternative chosen): Make internal lists open billable work orders at every location the user has access to, with a Location column; work orders at locations the user cannot access are counted in one line ("[n] more at locations you don't have access to.") and converted when a user with access saves Edit Customer or the setting is turned on again. Make internal converts without switching location. |
| Q23 | Closed records in app invoice list + status filter (PQ-5) | Confluence comment | ANSWERED (OK, extended): closed records are left out of every receivables surface, plus GET /api/invoices/list and the dashboard Invoices card ("Total invoices in range") and the Top Customers invoice count. The hub's Sales > Invoices does show them, with Closed in its Status filter. |
| Q24 | Mileage/engine hours prompts at Close (PQ-9) | Confluence comment | ANSWERED (OK): when the work order is not yet Complete, Close first runs the same completion steps as Create invoice (tech stories, cores, missing details such as VIN, mileage and engine hours); the last button of that run reads "Close Work Order" and opens the S3-R2 confirmation. |
| Q25 | Held row on Reopen: Dismissed with reason vs disappears | Confluence comment | ANSWERED (OK, extended): the held row stays on Accounting Events as Dismissed with "Withdrawn: work order reopened". Same rule in QuickBooks — only what was posted is reversed; an entry never sent gets none; a row still waiting in QB Unexported is marked "Withdrawn: work order reopened"; an entry Marked as Exported by hand counts as posted. |
| Q26 | Hub Closed record page: header only | Confluence comment | ANSWERED (OK, extended): the hub's Closed record page shows the header with the work-order link, a summary (number, customer, asset, classification, posting date, "No charge", posted Parts cost and Shop supplies totals) and the journal entry section; no lines, no payment / credit memo / write-off tabs, no Void. |
| Q27 | Hub held reasons for missing period / unmapped credit side | Confluence comment | ANSWERED (OK): held reasons add "Inventory asset is not mapped" and "Parts cost of goods sold is not mapped", and the hub's existing "No open fiscal period covers [date]."; auto-retry when the mapping is saved or the period opened. |
| Q28 | Hub Sales invoice list Classification filter | Confluence comment | ANSWERED (OK): no Classification filter on the hub Sales invoice list in this version. |
| Q29 | Seed 6510 Warranty & Goodwill Expense; PRD text says 5300 (superseded by D40 / v0.22: 6430 Warranty & Goodwill, 6440 Comeback, name-match suitability) | Confluence comment | ANSWERED: 6510 Warranty & Goodwill Expense is now in the PRD and the design. For existing organizations 6500 is matched by number as the hub's other defaults are; 6510 is created only where the number is free and the row is mapped only to the account the hub created in that migration, since a number match alone could pick an account already in use. |
| Q30 | S8-R7 hold scope: only the no-charge line cost entries | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q31 | S9-R4 first invoice with a no-charge line lists the report/chip/export | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q32 | S2-R1/S1-R16 editing asset/customer category re-resolves open internal WOs | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q33 | S9-R2 whole Comeback/Warranty WO counts as one line | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q34 | S9-R2 export: PDF with both tabs as sections; CSV (answered: the open tab) | Confluence comment | Accepted with a change (v0.22 S9-R2): PDF both tabs as sections; the CSV carries the open tab. |
| Q35 | S12-E7 Issue Credit lists no-charge parts at $0.00 | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q36 | S2-R6 WO Change category saves on original-only change | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q37 | S12-N1 line actions while setting off | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q38 | S2-R2 original WO candidates from accessible locations | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q39 | S1-R14 archived name blocks duplicate | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q40 | S5-R1/S6-R1 archived rows remappable | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q41 | S1-R14 dialog shows accessible locations only | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q42 | S2-R17 shift-derived technicians count | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q43 | S1-R13 count includes billable WOs with a no-charge line | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q44 | S2-R22 warranty premise + derived on whole Warranty WO | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q45 | carried: credit hold, alert X, board total | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q46 | S9-R15 Sales Follow Up does not exist | Confluence comment | Answered in v0.22 S9-R15 with a code fact that is no longer true (SV-12106 removed Sales Follow Up and Vendors Expenses); nothing built; FYI Q66. |
| Q47 | S12-R1 Line Builder dialog does not exist | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q48 | S2-R19 vendor-invoice notice | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q49 | S12-R4 deposit overflow wording | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q50 | hub copy: row label, waiting, source label | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q51 | copy gaps | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q52 | S1-R14/S5 QB pickers expense accounts | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q53 | reason->category wording slips | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ1 | Comeback Expense number (6440) | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ2 | suitability rule incl. renamed 6500 | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ3 | free-number policy | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ4 | operator command rollout | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ5 | create 6430 in legacy charts | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ6 | withdrawn never replayable | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| HQ7 | Held family-only | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q54 | S2-E6/S12-R4 sent estimate updated by portal live read on open | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q55 | approval email follows the page rule | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q56 | portal line cards show hours and quantities on no-charge estimates | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q57 | pending estimate when WO later made internal | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q58 | Convert to Billable after a no-charge estimate was sent | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q59 | customer-facing category line without Not in ShopView | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q60 | design frame 7b re-export | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q61 | portal vehicle list Last Service/Completed counts closed records | Confluence comment | Accepted as proposed in PRD v0.22 (page 36). |
| Q62 | S7-R8 'Moved from' needs a Create invoice confirmation, which SV-10312 removed: add one only when a cost move happens at invoicing (built), keep the line-action dialog too | Confluence comment | ANSWERED (OK, v0.23): S7-R8 adds "Create invoice [number]?" only when a vendor bill's cost moves at invoicing and the location has an integration; S2-R8 adds the line actions; two §8 rows added |
| Q63 | S2-E6 and S12-R4 (v0.22) both say 'withdrawn with the existing cancel path': no IBS cancel exists; proposal: no IBS call, card hidden on non-billable, the advisor re-requests after a line mark | Confluence comment | ANSWERED (OK, v0.23): S2-E6 and S12-R4 — no IBS call, the IBS card hidden on internal and no-charge work orders, the advisor re-requests after a line mark |
| Q64 | FYI copy where the PRD has none: 100 categories per list, 50 customers in the first-time modal, QB Unexported type labels | Confluence comment | ANSWERED (OK, v0.23): all copy adopted — S1-R2 (50), S1-R13 (100; QuickBooks column only while connected), S1-R11 portal refusal, S2-E6/S12-R4 changed-after-sent notice, S7-N3 QB Unexported types, S12-E7 no restocking fee, S11-R2 single-invoice 404; §8 rows added |
| HQ8 | Hub-raised deferred move: a bill or credit line whose category row is empty posts on today's routing and the hub records a Held deferred move (its first self-raised event); confirm reconciliation and the Events page may show it | Confluence comment | ANSWERED (confirmed by the hub owner, v0.24): with the Q30 addition, S8-N2's Held list names the move; S8-R3 lifecycle — auto-retry on mapping save under every posting check, amended while Held → Dismissed + re-evaluated with a replacement only when needed, voided while Held → Dismissed, amended/voided after posting → reversed, an updated move posted only when still needed, never reversed twice, Dismissed never replayed, shown in reconciliation and on Accounting Events with status and a link to the source bill or credit and its line (D70) |
| Q65 | S2-E7 vs S3-R5: the document's Parts cost leaves core cost out (S2-E7) while the posted stock-parts amount includes it; the confirmation row says ', includes core cost' | Confluence comment | ANSWERED (changed, v0.23): the Close row names the core amount — "Stock parts $[amount], includes $[core amount] core cost · Posted to [account]" (S2-E7, S3-R2); the document and report exclude cores (S3-R5). D66 amended: N9 stock_parts_core_cost |
| Q66 | FYI S9-R15: Sales Follow Up and Vendors Expenses were removed by SV-12106 (2026-11-02, v26.45.0); nothing built | Confluence comment | ANSWERED (OK, v0.23): S9-R15 drops Sales Follow Up and Vendors Expenses |
| Q67 | FYI the User Feedback 'Change category' row (Save disabled until the category changes) vs S2-R6 v0.22 (Save enabled when the category or the original differs); we build S2-R6 | Confluence comment | ANSWERED (OK, v0.23): the §8 "Change category" row now matches S2-R6 |
| Child page | 13 review questions (review step, labor hours only, tax, accounts, vendor bills, $0 invoices, Close never blocked, NO CHARGE document, permissions) | PRD child page v2 | All decided by Product; carried as PRD content |

## 2. Architecture Overview

A work order carries a **classification** written on the row — `billable` (default, every existing row), `internal` (its customer was flagged Internal when the work order got its customer) or `no_charge` (marked) — and, when not billable, a **category** from the shop's lists. A **line** of a billable work order can be marked No Charge with its own category (Story 12). Neither is ever derived from the customer flag at read time (S2-R13).

```
 Administration ▸ Service ▸ Internal Work Orders      Settings ▸ Work Orders           Customer (org-wide)      Asset
 Internal / No Charge categories (stable keys)        internal_work_orders toggle      internal flag            internal category
   per-location QuickBooks account (virtual rows)       first_enabled / first_closed     default internal cat.
            │ upsert event (D49)                                  │                            │
            ▼                                                     ▼                            ▼
 New WO / customer change / Convert / Make internal ──► work_order.classification + category_id (+ original reference)
 Line menu / Edit Line (billable WO) ─────────────────► work_order_line.no_charge_category_id (+ original reference)
            prices masked on read (WorkOrderPricing), zeroed on write; no sell price ever written back (S2-R19)
                       │                                                         │
            Close Work Order (dedicated command)                       Create invoice (billable, as today)
   invoice status CLOSED, $0, category, cycle;                 no-charge line statement priced 0, flagged,
   picks relabeled with category + cycle                       parts cost frozen; snapshot excludes the line
                       │ after commit                                            │
                       └──────────────┬──────────────────────────────────────────┘
                     work_order_cost_entry (shop supplies, reclass, reversals) + inventory rows
            ┌─────────────────────────┴──────────────────────────────┐
   QuickBooks (per location)                               AccountingHub (per org, outbox → SQS FIFO)
   JEs debit the category account (or ShopView Review);    invoice_created v4 (Closed record / No Charge lines block)
   Class from location; claims in bookkeeping_*_entry      journal_entry_requested v3 (one category per entry, cycle)
   invoice line at 0.00 for a no-charge line               category rows per key; Held per entry; per-WO cycle order
            │
   Reports: shared predicates exclude whole non-billable WOs and no-charge lines (rule zero);
   the Internal Work Orders report reads the closed invoices and no-charge statements, with a By technician tab.
   Reopen / Reverse reverse exactly what was posted (stored accounts) and bump the work order's finish cycle.
```

**Bounded contexts touched (core):** VehicleService/WorkOrders (classification, categories, original references, line marks, lifecycle, locks, Close/Reopen orchestration), Invoicing/Invoice (closed status, LIVE/REVENUE fork, issuance extraction, no-charge statements, reversal), Customer/Customers (internal flag, default category, deposits, credits), VehicleService/Vehicles (asset category), Organization/Setting (toggle, markers, release gate), Bookkeeping (per-category QuickBooks accounts, JE claims, vendor-bill line accounts, Class from location), Accounting/CostEntry (new) and Accounting/Outbox (v4/v3/upsert payloads, onboarding), Reporting (predicates, the Internal Work Orders report, Technician Efficiency, exports), Search (reindexed documents), External/CustomerPortal (estimate/invoice data). **Hub:** category catalog and mapping rows, seeding command, invoice processor (Closed path, No Charge lines block), Held machinery with per-work-order ordering, withdraw, read side. **Portal:** the no-charge estimate and the $0.00 line (Appendix D).

## 3. Technical Decisions

Wizard decisions, reconciled across the planner reports. `chosenBy: agent` decisions can be overridden at plan review; `user` decisions were made by the engineer running the wizard. Superseded decisions are kept, marked, so references stay resolvable.

- **D1 — Classification and category storage** (agent): `work_order.classification` VARCHAR(9) NOT NULL DEFAULT 'billable' (billable|internal|no_charge) and `work_order.category_id` (the work order's Internal or No Charge category; null on billable), appended, no backfill. The v0.17 `no_charge_reason` enum is gone (PRD v0.21 replaced reasons with shop-managed categories). — because Classification is written on the work order, never derived (S2-R13); the category decides the expense account (S2-R16).
- **D2 — Display 'Closed'** (agent): Derived from WO columns: status in (invoiced,paid) AND classification != billable -> 'closed' in every projection; no join — because No status chokepoint exists; WO-column derivation avoids invoice joins on lists
- **D3 — Invoice status** (agent): Add invoice status 'closed'; fork Status lists into live (incl. closed: duplicate-invoice guard, pricing freeze, delete guard) and revenue (excl. closed: NonVoidInvoicePredicate); explicit exclusion in InvoiceGenerator export — because getNotVoidStatuses serves two incompatible purposes
- **D4 — Close implementation** (agent): Dedicated CloseWorkOrder command/handler composing steps extracted from invoice CreateCommandHandler; public-API create path refuses internal/no-charge — because Keeps billable path and Open API create untouched; natural S11-R4 refusal
- **D5 — Snapshot at Close** (agent): Snapshot at Close on the internal invoice: parts cost, shop supplies, labor hours, posting date, plus `classification`, `category_id` and `work_order_cycle`. A no-charge line freezes its own snapshot on its invoice statement (`no_charge_category_id`, `no_charge_parts_cost`, `no_charge_labor_rate`; `labour_rate` stored 0). — because Required for S3-R5 'fixed at Close'; avoids line fan-out in the report
- **D6 — QB JE idempotency** (agent): Idempotency and exact replay reuse the existing `bookkeeping_journal_entry` (SV-11375, already claimed before every QuickBooks inventory JE) extended with the posted debit/credit accounts, plus a sibling `bookkeeping_cost_journal_entry` claiming QuickBooks postings of `work_order_cost_entry` rows (shop supplies, reclass, reversals). `work_order_cost_entry` (Accounting/CostEntry) is the single source both QuickBooks and the hub post from, because an organization can run AccountingHub without QuickBooks. — because A new table of the same name would collide with shipped code (backend appendix C-items).
- **D7 — Vendor bill line account** (agent): The account each vendor-bill line posted to is stored as `bookkeeping_vendor_bill.line_account_ids` JSON beside SV-11585's `line_class_ids`; it drives credits (S7-R3a) and reclasses (S7-R4), per line of a billable work order too (S7-R8). — because Not persisted today
- **D8 — First-close marker** (agent): `setting.internal_work_orders_first_closed_at`, set by a COALESCE update at the first Close and at the first invoice carrying a no-charge line; drives the report listing, the Technician Efficiency chip and the export option (S9-R4). (answered in PRD v0.22.) — because No marker mechanism exists; setting is one row per org
- **D9 — Money report exclusion** (agent): Money reports exclude through two shared NULL-safe predicates (D58): the work-order level one (REVENUE invoice list / `BillableWorkOrderPredicate`) and the line-level `NoChargeLinePredicate`; WO-based reports (Technician Efficiency, WIP, Parts Velocity) use the classification and the line flag. — because Single lever for ~14 fetchers
- **D10 — Accounting contract** **(superseded)** (agent): Superseded by D47 (journal_entry_requested v3), D48 (invoice_created v4) and D49 (work_order_category_upserted v1). — because Categories are dynamic, so a free-form account key per category would travel unversioned (the reason D15 existed).
- **D11 — Re-pricing placeholder** **(superseded)** (agent): Superseded by D34. — because Kept so the numbering is contiguous; the original placeholder re-priced parts on today's catalogue cost and was replaced when Product answered Q3.
- **D12 — Make internal: synchronous vs queued** (agent): Synchronous through `MakeInternalService::run()`, per-work-order transactions, at most 500 conversions per call; N4 returns `remaining` and accepts `exclude_ids` (earlier failures), and the FE repeats the call until nothing remains, then shows the PRD per-work-order failure copy once. Switch to an `AsyncJob` over the same service if prod query Q20 shows customers far above 500 open billable work orders. — because Pending prod query Q20 for the queued switch. Batching instead of refusing above 500 avoids a failure the PRD has no copy for (audit re-check). With D36 the candidate set spans every accessible location, which is what Q20 measures.
- **D13 — Plan scope** (user): Core + hub implementation phases; Story 11 excluded — because User choice at Phase 4 batch
- **D14 — Hub cost-entry routing (amended: bills and credits post straight to the category)** (agent): Bill and credit lines of an already internal or no-charge work order or line post straight to the category's hub row inside the bill or credit (vendor_bill_created v4, vendor_bill_updated v3, vendor_credit_created v4; per-item work_order block from a routing stamp frozen when the item is first recorded on a bill; null = today's routing). journal_entry_requested v3 carries only stock parts, shop supplies and the S7-R4 / D47 moves (bill_reclass, billable_back, credit_reclass, credit_back, reversals by reference), each naming one category. A bill is never Held: a line whose category row is empty posts on today's routing and the hub holds a deferred move (HQ8 ✓). S8-N2 v1.0 lists it as Held-able ("Close, reversal, no-charge line, and the move of a vendor bill or credit line to its category account") and S8-R3 v1.0 gives its lifecycle (D70). — because PRD v0.21 Key Decisions: 'Part cost goes straight to the expense account, not to cost of goods sold first … Vendor bill lines follow the same rule at bill time. Rejected: post to cost of goods sold at close and reclass afterwards.' The earlier choice (bill to COGS, then reclass) was that rejected pattern; found by the fresh-eyes audit (Appendix C T4(b)).
- **D15 — Emission guard** **(superseded)** (agent): Superseded: the category reference rides the CI-gated JE v3 version (D47), so no unversioned key needs a guard. — because No CI gate covers free-form account_key values
- **D16 — Release gate** **(superseded)** (agent): Close/enable cannot reach accounting orgs before hub phases live; mechanism pending EQ-1 Superseded by D21 and D43 (the deploy-time release switch). — because v3 events can't be fixed by replay
- **D17 — Minor BE trade-offs** (agent): EQ-2 FE completes the WO first (D42); EQ-3 no stock/special split stored beyond the confirmation; EQ-5 mapping row saved before the QuickBooks call; EQ-6 `inventory_changes.expense_category_id` + `work_order_cycle` stamped at relabel and copied on reversal; EQ-8 reconciliation excludes closed; EQ-9 → D12; EQ-10 predicate renames → D58. — because Planner recommendations, same user-visible behavior
- **D18 — Snapshot columns** (agent): Snapshot columns: reuse `invoice.parts_cost`, `hours_invoiced`, `shop_supplies_charge`, `created_on`; add `invoice.classification`, `invoice.category_id`, `invoice.work_order_cycle`. — because Already on invoice
- **D19 — Setting columns** (agent): Setting columns `internal_work_orders_enabled`, `internal_work_orders_first_enabled_at`, `internal_work_orders_first_closed_at` (D56). — because Modal once + report listing
- **D20 — Hub releases** **(superseded)** (agent): Two hub releases (A enums+nullable schema, B writers); 6510 seed; contracts 1.10.0 after hub #126 Superseded by D40 (seeding 6500 / 6430 / Comeback Expense per the PRD), D52 (contracts at the next MINOR, expected 1.12.0) and D53. — because Rollback safety
- **D21 — Release gate (EQ-1)** (user): Deploy-time env switch on the enable-setting endpoint; flipped staging then prod after hub releases A+B and invoice_created v4; removed once live — because User choice; phases still merge to develop independently
- **D22 — Wire casing for new fields** (agent): Each new field follows its endpoint's existing convention: camelCase on settings, WO list/Tech View/board, search documents, schedule; snake_case on WO detail, customers, vehicle invoices, reports and all NEW endpoints — because Verified SettingDto camelCase on the wire (FE reads requireMileage); snake on a camelCase endpoint reads undefined silently (FE F1)
- **D23 — Close fingerprint (G-1)** (agent): Close fingerprint over classification, category, line ids with a per-line declined flag, hours, part qty/cost, shop supplies amount and stock/special totals — never the raw line status; an original work order picked inside the Close dialog travels in the close request. — because The FE completion step moves lines to completed between preview and Close, so the raw status would always trip the guard (F3/G-1); a per-line declined flag keeps S3-E5 as written — a line declined, added or removed after the dialog opened still refuses Close.
- **D24 — Make internal beyond 10 rows (G-3)** (agent): Make-internal endpoint takes all_open=true; BE re-queries server-side (every location the user has access to per D36, skips deposits, cap 500) — because Dialog shows 10 rows + 'and n more'; S1-R11 applies to every listed WO
- **D25 — Read-model gaps (G-2,G-4,G-5,G-6,G-9,G-10,G-11)** (agent): Additive read fields: customer view `internal` + `default_internal_category`; vehicle view `internal_category`, `internal_category_applicable`, `customer_default_internal_category`; settings DTO `hasInternalCustomers`, `quickbooksConnectedAnyLocation`, `accountingHubEnabled`, `internalWorkOrdersAvailable`; change-customer preview `classification_after`, `category_after`, `shop_supplies_reset_amount`; WO detail `classification`, `category`, `original`, `display_status`, `closed_on`; lines `no_charge`, `can_mark_no_charge`. — because All are additive read fields; no user-visible trade-off
- **D26 — Close preview hub block (G-7)** (agent): The Close preview's `accounting_hub` block (category row mapped?, account label, shop supplies row) and the read-only hub mapping text in the category dialog are computed server-side through core's system-token RPC client, because the advisor and a 'Settings — Service' user lack the hub atom. — because Closing advisor usually lacks Accounting — Settings; a proxy read would 403
- **D27 — Money units (G-8) and shop supplies field (row 33)** (agent): Close preview and make-internal/candidate payloads state integer cents; the flat amount lives in work_order.shop_supplies_charge_amount and is read through the existing shop supplies field (no separate shop_supplies_amount) — because Reuse existing edit/save path
- **D28 — FE pricing mode + lock constant** (agent): Third pricing mode full/none/costOnly provided from WorkOrder.vue; lock literal consolidated into one constant incl. 'closed'; locks read raw status only — because FE F2/F8
- **D29 — WO header status label (E2E R1)** (agent): Header keeps the backend label for every existing status; the FE label map supplies only 'Closed' (amends G-9 / D25) — because Switching to the FE map renames 'Review' to 'Ready for Review' — a user-visible change nobody asked for, and breaks 7 E2E sites
- **D30 — Generic settings save while gated (E2E R2)** (agent): POST organizations/settings/change refuses only a false→true change of internalWorkOrders (gate off or before first enable); an unchanged value passes — because Otherwise the app's own Settings save and 33 E2E settings restores fail until launch
- **D31 — E2E org isolation** (agent): Internal Work Orders specs run in an isolated org fixture (internal-work-orders-org.fixture.ts, dedicated Playwright project) with a capability gate that skips while NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED is off on the target — because First-enable and first-close markers are irreversible per org; the shared org would carry permanent report/chip state
- **D32 — Report placement in the Reports list** (agent): Follow the design: after Sales By Representative — because Design (Product artifact) shows it there; PRD is silent
- **D33 — Customer change on a closed internal/no-charge work order** (agent): Change Customer is refused once an internal or no-charge work order is closed: the FE disables the button on the customer card with the tooltip "Reopen the work order to change the customer." and the BE change-customer handler refuses it (409). A billable invoiced work order keeps today's behaviour. — because Product answer to item 1 (PRD v0.17, S2-R7/S2-R9 + the Key Decision): the internal invoice and the hub record keep the customer they were created with, and an internal work order moved to a regular customer after Close would come back from Reopen internal with no way to convert it.
- **D34 — Re-pricing basis when a work order becomes billable** (agent): One `BillableRepricer`: labor at the customer's labor rate, else the location's; parts from the organization pricing rules applied to **the cost already on the line** (the cost Close would post), not today's catalogue cost; hand-set prices are not restored. Copy: "Every line is priced as a new line would be today." — because Product answer to item 3 (PRD v0.17, S2-R6/S2-R7/S2-E4). Supersedes the placeholder decision that re-priced parts on today's catalogue cost.
- **D35 — QuickBooks inventory-account gate for parts entries** (agent): The parts entries (stock parts and reclass) keep today's gate: both `inventoryAssetId` and `costOfPartsId` must be mapped. With either empty no parts entry is sent at Close and the confirmation shows, on the Stock parts and Special orders rows, "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped." (new S7-N5). The shop supplies entry still posts, and an entry never sent gets no reversal at Reopen. — because Product answer to item 9 (PRD v0.17). Reverses the proposal of requiring only Inventory Asset: with only Inventory Asset mapped, Close would be the only thing ever crediting it in a shop that keeps no inventory in QuickBooks.
- **D36 — Make internal scope across locations** (agent): The Make-internal dialog lists the customer's open billable work orders at **every location the user has access to**, with a Location column, up to 10 rows and then "and [n] more"; work orders at locations the user cannot access are counted in one line ("[n] more at locations you don't have access to.") and converted when a user with access saves Edit Customer or the setting is turned on again. Make internal converts the listed work orders without switching location. Supersedes the "current location" half of D24. — because Product chose the alternative in item 20 (PRD v0.17, S1-R11). The candidate and bulk endpoints are scoped by the user's accessible workplaces rather than the active one (NFR-001 still holds: never outside them).
- **D37 — Where closed records are left out** (agent): Closed records are excluded from every receivables surface, and additionally from `GET /api/invoices/list`, the dashboard Invoices card ("Total invoices in range") and the Top Customers invoice count. The app invoice list and its Status filter never offer them. The hub's Sales > Invoices does show them, with Closed in its Status filter. — because Product answer to item 21 (PRD v0.17, S3-R6, S9-R1). Adds two consumers the REVENUE-list classification had not covered (the Invoices card counts invoices, not money).
- **D38 — Withdrawn accounting rows at Reopen** (agent): Hub: a Close still Held becomes **Dismissed** with "Withdrawn: work order reopened" (nothing posted, nothing reversed). QuickBooks: Reopen reverses only what was posted; an entry never sent (S7-N5) gets none; an entry still waiting in QB Unexported gets none and its row is marked "Withdrawn: work order reopened" with no Export / Mark as Exported actions; an entry Marked as Exported by hand counts as posted. Generalized: writing any reversal (Reopen, or a category move reversing a reclass) withdraws the original's unposted QuickBooks claim; an entry that posts nothing in QuickBooks (pair_of, equal accounts) gets no claim. — because Product answer to items 23 and 9 (PRD v0.17, S4-E1, S7-R5). `bookkeeping_journal_entry` already records what was posted, so the reversal set is exactly its posted rows; the QB Unexported row needs a withdrawn state.
- **D39 — Hub Closed record page** (agent): The hub invoice page for a Closed record shows the header with the existing link to the work order, a summary (number, customer, asset, classification, category, original work order, posting date, "No charge", posted Parts cost and Shop supplies totals) and the journal entry section; no lines, no payment / credit memo / write-off tabs, no Void. Built in the core accounting UI port (Phase 9), read from the hub read side (Phase 8). — because Product answer to item 24 (PRD v0.17, S8-R1). The lines live on the NO CHARGE document in ShopView; the totals come from the posted entries.
- **D40 — Hub seeding** (agent): Hub seeding (v0.22, S6-R2 rollout setup, S13-R3): General Internal → 6500 Vehicle Expenses, Warranty and Goodwill → 6430, Comeback → 6440 Comeback Expense (confirmed by the hub owner 2026-11-09); a suitable existing account is an active expense account whose name matches (a number or the system flag alone never qualifies); a free number is found by walking up within the same hundred, then onward; 6430 is created on legacy charts with the chart upgrade's attributes; an operator command (per-organization isolation, failure list, --verify) run after the hub release and again at launch. — because v0.22 answered HQ1–HQ7 (S6-R2 rollout setup, S13-R3): the hub setup is an operator command, not a deploy migration, run after the hub release and again at launch; 6440 confirmed by the hub owner on 2026-11-09.
- **D41 — Minimum shop supplies rule unchanged** (agent): S10-R1 stays as written: Min without a percentage remains allowed only on flagged customers. A no-charge work order takes the customer's Min if one is set, else $0.00, and the amount is editable on the work order. Min and Max on Edit Customer show only with 'See A/P & A/R data'. — because Product answer to item 6 (PRD v0.17) declined the proposal: a Min that applied only to no-charge work orders would be a hidden rule on every regular customer. No validation change ships.
- **D42 — Close runs the completion steps first** (agent): When the work order is not yet Complete, Close runs the same completion steps as Create invoice (tech stories, cores, and the missing details such as VIN, mileage and engine hours, per the organization settings); the wizard saves what it collects as today, its last button reads "Close Work Order" and opens the S3-R2 confirmation, and the status change to Complete happens inside the Close request: N10 takes complete_first, and the body of SimpleCompleteWorkOrderCommandHandler moves into a WorkOrderCompletion service that runs in the caller's transaction and returns its events, which Close dispatches after commit. complete_first with review required → 409 work_order_review_required; without 'Work Orders — Create & Edit' → 403. A refused or failed Close leaves the work order where it was and sends no webhook. — because The PRD's error rule ('the work order stays where it was and nothing is posted'); the verification found that nesting the existing handler would dispatch WorkOrderCompletedEvent (an SQS webhook job) before the Close commit, dead-end on review, and bypass the work-order edit atom.
- **D43 — Release gate stays invisible to users** (user): While NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED is off, the settings DTO carries `internalWorkOrdersAvailable: false` and the FE renders neither the toggle nor the Internal customer checkbox; the 409 stays as the server-side guard. Until the switch flips, nothing about the feature is visible, so no shop ever sees the refusal copy. — because The audit found D21 contradicts the PRD Key Decision "No feature flag … Rejected: a product-team flag in front of the setting." The PRD's concern is release-day protection for existing shops; a hidden, deploy-time switch removed at launch protects the hub-first deploy order without a user-visible flag. Raised with the user and to be stated to Product in the closing comment. User confirmed 2026-10-29 ("env is fine") after the alternatives were explained: merging the enable path last, or one core release after hub Releases A+B (fragile if a phase misses the release cut).
- **D44 — `asset` shape in invoice_created v4** (agent): `asset: { vehicle_id: uuid, display: string } | null`, plus `posting_date` required in v4. The hub stores `vehicle_id` as its own `shopview_id`. — because Core owns the contract schema; the two planners had `vehicle_id` vs `id`. Explicit naming matches the other core id fields, and the hub needs posting_date for the Closed record summary (D39).
- **D45 — Internal Work Orders report Location filter** (agent): Single select with "All locations", scoped through `ReportLocationsScopeResolverInterface`. — because S9-R2 says Location "(all or one)"; the multi chip the FE plan defaulted to would be a silent deviation.
- **D46 — QuickBooks pickers for the category rows** (agent): The QuickBooks category pickers (ShopView Accounts rows and the category dialog) list the location's accounts with the QuickBooks classification Expense: types Expense, Other Expense and Cost of Goods Sold (S1-R14, S5-R1; proposed expense accounts). A mapped account of another type stays visible on its row. (answered in PRD v0.22.) — because v0.22 S1-R14, S5-R1 and S5-R2 all say expense accounts; in QuickBooks the Expense classification covers Expense, Other Expense and Cost of Goods Sold.
- **D47 — journal_entry_requested v3** (agent): v2 + one required nullable entry-level `work_order` block {work_order_id, cycle, invoice_id, scope work_order|line, work_order_line_id, category {category_key, list, name}, cost_kind parts, entry_kind} and the reserved line account_key `work_order_category_expense`. No entry names two categories: a category move after a bill is a reversal by reference plus a new reclass. A category move after a bill is, per line, a move out of the old category plus a new reclass into the new one; the move out is the reversal by reference of its reclass, or billable_back / credit_back when the bill or credit posted the line there directly (D14 amended). Moves are written at Close or invoicing only (S7-R4), never at the category change itself. Plus credit_return (D69). — because Versioned and CI-gated (an unknown free-form key stalls the org stream); carries the ids the hub needs for linking and ordering.
- **D48 — invoice_created v4** (agent): v3 + classification, status, work_order_number, asset {vehicle_id, display}, posting_date, work_order_id, work_order_cycle, category, original {work order, line, technicians}, and a top-level `no_charge_lines[]` ([] unless a billable invoice carries no-charge lines). Invariants: closed ⇔ non-billable ⇔ category set, money all 0.00. — because The hub needs the Closed record (S8-R1) and the billable invoice's No Charge lines block (S8-R7).
- **D49 — How the hub learns categories** (agent): New event `work_order_category_upserted` v1 with the full state {category_key, category_id, list, name, is_archived, is_default, requires_original_work_order, changed_at}, recorded inside the category write transaction (part-category precedent), an onboarding backfill phase before invoices, and a one-time emit in the release run. — because S6-R1 needs a shop-added category to appear as an empty row immediately, before any posting names it.
- **D50 — Category keys** (agent): Starting categories use fixed keys `general_internal`, `warranty`, `goodwill`, `comeback`; shop-added `c_` + 32 hex. Never a colon. The By technician Comeback/Warranty columns and the derived warranty flag key off `comeback` / `warranty`. — because Lets the hub seed by well-known key in any arrival order; renames never break reports.
- **D51 — Work-order finish cycle** (agent): `work_order.finish_cycle` starts at 1; Reopen and Reverse add 1 after their reversal entries are built; frozen on `invoice.work_order_cycle` and `inventory_changes.work_order_cycle`; carried in invoice v4 and JE v3. — because The hub orders one work order's entries per cycle (S4-R3); envelope timestamps are whole seconds.
- **D52 — Contracts package version** (agent): The next free MINOR of the contracts package (expected 1.12.0) publishes six schema versions — invoice_created v4, journal_entry_requested v3, work_order_category_upserted v1, vendor_bill_created v4, vendor_bill_updated v3, vendor_credit_created v4 — emitting nothing (9a, right after Phase 1, D65). One later PR raises all six together after hub Release B is in production. — because Hub-first deploy order, enforced by three CI gates.
- **D53 — Hub category rows** (agent): The hub owns the category rows: a category table fed by D49 plus a mapping table keyed (workspace, category_key, kind) with a nullable account, served inside GET/PUT /system-accounts as `category_accounts`; the core port renders the hub's rows; a save re-runs held events. — because account_mappings.account_id is NOT NULL and its key is a closed enum, so empty per-category rows need their own table.
- **D54 — QuickBooks category rows are virtual** (agent): Rendered as categories × connected locations inside `bookkeeping/integration`, stored on first save (`work_order_category_quickbooks_account`); S13-R5's "four rows per connected location" is verified as four categories rendered. — because Avoids three write paths kept in sync (release, category create, location connect); users see the same rows.
- **D55 — Original references** (agent): Side tables `work_order_original_reference` (subject = work order or line) and `work_order_original_technician`; original technicians = the line roster as shown (lead when empty), else the original work order's technician, else none — stored at save. (answered in PRD v0.22.) — because Keeps the two busiest tables narrow; one shape for work order and line.
- **D56 — Renames for the setting** (agent): Setting columns and DTO keys `internal_work_orders_*` / `internalWorkOrders*`; Technician Efficiency parameter `internal_work_orders=all|hide|only`; the env switch keeps `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED` (D21). — because Nothing is built yet; "No Charge" now names one of two classifications.
- **D57 — Line no-charge writes** (agent): Dedicated line endpoints for Mark as No Charge / Change category / Mark as Billable, plus an optional `no_charge` block on line create/change for the dialog door; an absent block means unchanged; `is_warranty` input ignored (derived, S2-R22) and the FE stops sending it. — because Four writers share the line-save endpoint; a missing block must never clear the mark.
- **D58 — Shared report predicates (rule zero)** (agent): `RevenueInvoicePredicate` / `BillableWorkOrderPredicate` and a line-level `NoChargeLinePredicate`, NULL-safe, wired at every consumer in Phase 1 as no-ops on today's data (byte-compare tests); Customers Spending gets the classification predicate because it has no status filter. — because S9-R14: no billable number may change; one predicate per concept, as void invoices are excluded today.
- **D59 — Customer portal integration** (agent): The portal plan (Appendix D, Phase 11) follows the code: core renders the estimate snapshot and the invoice documents (both the modern `templates/invoices/invoice.html.twig` and the legacy design get the variants), while the portal renders its own line cards, Price Summary replica and emails and reads core's tables directly. Portal P1 (closed records off every portal list) ships any time; P2–P5 deploy after core's Phase 1/2C/4 migrations and before the switch flips; the portal's pricing replica mirrors core's mask through a shared fixture; the original work order is snapshotted by its display number; Send to Portal hides line amounts on a no-charge work order; a portal deposit refused after checkout is recorded with a distinct reason for the existing refund action. No estimate is re-sent automatically; the portal reads the live state on open. (answered in PRD v0.22.) — because Portal planner findings verified against both repositories (portal origin/develop 2f8d26ba); keeps the contract unchanged and never leaves a price on a no-charge estimate.
- **D60 — One API contract: Appendix A section 4 is canonical** (agent): The backend contract in Appendix A section 4 is the single source: categories are addressed by `category_key` in requests and paths and returned as {key, name, archived} (plus `requires_original_work_order` where a client must pre-check it); originals travel as the flat OriginalWorkOrderPayload {original_work_order_id, original_not_in_shopview, original_line_id}; category endpoints live under /api/internal-work-orders/categories (N13-N19); line actions are /api/work-orders/{workOrderId}/lines/{lineId}/... (N23-N26); the report is N12 with tab=by_line|by_technician; endpoint numbers follow Appendix A. The frontend appendix, the E2E factories and the portal/hub notes use these names. Backend additions taken from the frontend review: N8 accepts line_id (per-line moves, Q62); the line rows of GET work-orders/lines/{id} carry the no-charge fields of the detail endpoint, with `requires_original_work_order` on the line's category and `no_charge_blocked_reason` (the FE hides Mark as No Charge when it is not null); the credit-available parts list carries noChargeCategoryName (Q35); metadata.work_order_refs is [{id, number, is_deleted}]; the customer view carries open_internal_work_orders_count (Remove Internal flag dialog). Deposit and all-lines hints come from the N23 preview, called before Mark as No Charge from the line menu and from Edit Line; the write responses do not repeat them. — because The E2E curator found the two appendices naming different paths and fields for the same calls (the silent-mismatch risk F1); the producer's contract wins, and every frontend need that was real is added to it. Storage keeps *_category_id foreign keys; only the API speaks keys (D50).
- **D61 — QuickBooks category rows: release-gated, rendered from Phase 2C** (agent): SettingsHydrator adds the category rows only for organizations where the release gate is open (internalWorkOrdersAvailable), like every other surface of the feature, so production never shows them before the release whatever the merge order. The QuickBooks-page part of FE-D (adapter peel, CategoryExpenseMappingPanel, type filter and empty hint) moves into the Phase 2C frontend batch as FE-K2, so wherever the rows exist the page groups them correctly. FE-D keeps the Close dialog notes and the QB Unexported rows (Phase 6). The E2E round trip QuickBooks page <-> category dialog moves to the Phase 2C batch. — because BE Phase 2C added the rows at once while the frontend that groups them was scheduled with Phase 6: every QuickBooks-connected location with categories (new organizations are seeded at creation) would have seen its Accounts rows regrouped, and the Phase 2C browser-walk could not pass.
- **D62 — De-pricing a line with no labour type** (agent): WorkOrderDepricer keeps the line's labour type when it has one; a line that had a fixed labor price or Fixed Line Total and stores no labour type (LineDialog never sends one for fixed lines) gets the customer's labour type, else the location's default, when the fixed amounts are removed. Its stored labor cost and hours are not changed. Convert to Billable and Mark as Billable then price it at that rate (S2-R20). — because LinesDetailProvider derives the pseudo types fixed_line_total / fixed_labour_price from the fixed columns (LinesDetailProvider.php:385-395); once those are removed the line returns its stored labour_type_id, which is NULL for a fixed line created in LineDialog (LineDialog.vue:1168, CreateCommandHandler.php:52), so Edit Line could not save it and Mark as Billable could not price labor at rate.
- **D63 — Change Customer server-side permission** (agent): POST /api/work-orders/change-customer requires ROLE_WORK_ORDER_CREATE_AND_EDIT for a service work order in addition to today's check (the part-sale branch is unchanged), so the server refuses what the PRD permission matrix and Key Decisions rule 1 require it to refuse. — because The UI already shows Change Customer only with canEdit('workOrders') (CustomerCard.vue:372-375), so no user loses an action; the endpoint accepted ROLE_VEHICLE_CREATE_AND_EDIT alone (ChangeController.php:31-34), which the matrix row 'Change the customer on a work order — Work Orders — Create & Edit' rules out.
- **D64 — The release gate covers the AccountingHub UI port and the category endpoints** (agent): Every new surface reads internalWorkOrdersAvailable: besides the setting, the customer checkbox, line actions, the categories route and the QuickBooks rows (D61), the core accounting UI port (Account Mappings category rows, the Closed pill and filter on Sales > Invoices, the Closed record page) renders them only where the gate is open, and N13–N19 answer 404 while it is closed. — because The audit found the hub port and the category endpoints visible once hub Release B and FE-E deploy, before the switch flips, contradicting 'deployable with no user-visible change while the release gate is closed'.
- **D65 — When the Phase 9a schema PR ships** (agent): 9a (the contracts package: schemas, fixtures and manifest of the new event versions, emitting nothing) ships right after Phase 1: its shapes are fixed by D47–D49 and the vendor-bill decision in this plan. Hub Phase 7 depends on 9a, not on Phase 9b. Phase 10 also depends on Phase 6 (S9-R13 uses the Phase 6 InvoiceData change). — because The phase map said 'after Phase 1' while Appendix A said 'after 6's shapes are fixed', and Phase 7 appeared to depend on a later phase.
- **D66 — Core cost on internal and no-charge work (S2-E7, S12-E3; amended v1.0)** (agent): Displayed Parts cost never includes core cost: the closed record's invoice.parts_cost snapshot and a no-charge line's no_charge_parts_cost are computed over non-core rows only (is_core = 0 on work_order_part and work_order_part_request; the Core ok return requests are not subtracted), so the NO CHARGE document and the report show parts without cores; billable invoices keep today's computation untouched (rule zero, S9-R14). Posting includes it: a stock pick's journal entry already carries the core purchase price inside the pick cost (WorkOrderInventoryChangedEventSubscriber.php:27,62), which is exactly 'the core cost posts to the category account with the part' (S12-E3); the vendor core charge is its own bill line and follows S7-R3 to the category account; a core returned to inventory after OK credits the category account instead of Cost of Parts (S7-R3a). The Close confirmation's Stock parts row shows the amount that posts and, when a picked part carries a core, names it: '$[amount], includes $[core amount] core cost' from N9 stock_parts_core_cost (S2-E7, S3-R2 v1.0; Q65 answered with the amount). The customer is charged nothing on a core of non-billable work or a no-charge line: the read chokepoint and write-time zeroing cover is_core rows, whose sell price is otherwise the core charge (WorkOrderPartsAndLinesHydrator.php:129-141); Mark as Billable prices the core from its cost like the part. — because The audit found S2-E7 and S12-E3 only half designed. Code facts (be-researcher): invoice.parts_cost includes NOT OK core rows (LinesStatsFetcher.php:145,307), the pick row has no core column but the work-order core row carries its own cost, and NOT OK otherwise bills the core charge to the customer.
- **D67 — Sent estimates and IBS on a line mark or a convert (S12-R4, S2-E6)** (agent): A line mark behaves as a price change does today: nothing is re-sent or withdrawn automatically; the changed line cost changes the approval hash, so Send to Portal is allowed again and the advisor re-sends; an IBS approval is re-requested by the advisor with the new amount. On Convert to No Charge no IBS call is made (there is none to make): the IBS approval card is hidden on a non-billable work order and the stored ibs_approval row is left as it is (Q63 ✓, S2-E6 / S12-R4 v1.0). The portal reads the live state on open (S2-E6, S12-R4 v0.22). v1.0 S2-E6 and S12-R4 now say exactly this (Q63 answered as proposed). — because Code facts: no subscriber regenerates or re-sends an estimate on a price change, CustomerPortalClient only creates approvals, and the IBS client offers GET and POST only (Domain/IBS/HttpClient.php:29-39); ChangeIBSApprovalCommandHandler requests an approval by code and cancels nothing, so the plan's earlier 'existing cancel path' did not exist.
- **D68 — QuickBooks legs of a category move after a direct-posted bill** (agent): When a bill or credit line sits on a category because the bill or credit posted it there directly, a D47 category move writes two cost entries (billable_back / credit_back, then bill_reclass / credit_reclass) so that no hub entry names two categories; in QuickBooks the first half carries pair_of = the second half's id and posts nothing, and the second half posts the whole move as one entry from the stored account to the new category (S7-R4: 'a reclass from the account the bill line was posted to, to the work order's mapped account'). When the line sits on the old category through an earlier reclass, the move is that reclass's reversal plus a new reclass, and both post in QuickBooks. A reversal of a hub-only half posts nothing in QuickBooks. Credits: both credit_reclass and credit_back use the credit line's stored account (bookkeeping_vendor_credit.line_account_ids; a credit synced before the release counts as costOfPartsId, today's credit routing); in the hub a credit line received without an item (v3 or items: []) sits on Parts Inventory, so its credit_reclass debits inventory_asset. The vendor_credit_created v4 items are exactly the stamped return lines (expense_routing category | bill_line). — because The re-audit found that posting both halves in QuickBooks with the stored-account credit would credit the old category twice and leave Cost of Parts debited; the hub legs were already right because they go through cogs_parts.
- **D69 — Issue Credit restock of a no-charge line's part (S12-E7 v0.22)** (agent): The restock row written by PartSaleCreditProcessor::recordRestoredInventoryValue() carries the line's category. QuickBooks: a new post-commit call to JournalEntrySyncService for that row and its void's reversal (nothing calls it on the credit path today; billable restocks stay without an entry, as today) posts Dr Inventory Asset / Cr the category account, the same entry a return on internal work uses (PartQuantityChangedEventManualChangeSubscriber.php:95). Hub: a JE v3 family entry, entry_kind credit_return (scope line), Dr inventory_asset / Cr work_order_category_expense, instead of the ordinary cogs_parts entry; the void reverses it by reference. Part of the 9a schemas. — because v0.22 confirms the $0.00 Issue Credit and says the cost is reversed from the category account to inventory; the restore today sends the hub an ordinary entry keyed to cogs_parts (InventoryValueAdjustmentRecorder sends mapping keys only), which would strand the cost on the category.
- **D70 — The hub's Held category move: confirmed lifecycle and its source link (S8-R3 v1.0, HQ8)** (agent): B2b's deferred move follows the lifecycle the hub owner confirmed in S8-R3: automatic retry on the mapping save under every posting check (B4), Dismissed and re-evaluated when the bill is amended while Held (a replacement only when still needed), Dismissed with no replacement when voided while Held, reversed when amended or voided after posting, with an updated move posted only when still needed and never after a void (the bill's and the move's reversals are separate entries, so nothing is reversed twice), never replayed once Dismissed. New: the move carries a source reference (vendor bill or credit, its number and line) in its hub-written payload; AccountingEventData exposes source_document + source_line for it, SourceDocumentResolver resolves its journal entry to that bill or credit instead of unlinked, and the core port's Accounting Events page labels the row and links the document through the shared accountingSourceDocumentRoute(). Reconciliation: the hub's reconciliation gives journal_entry_requested no category, so B3 adds a category-free held_awaiting_operator section (Held rows by reason and kind, the move with its source bill) instead of a per-category bucket. A Dismissed move reads 'Withdrawn: vendor bill [number] amended' / '… voided' (HeldEventWithdrawer takes the reason from its caller; Reopen keeps 'Withdrawn: work order reopened'); the PRD has copy only for Reopen, so these follow its pattern and are mentioned to Product as an FYI. — because S8-R3 v0.24 adds 'shows in reconciliation and on the Accounting Events page with its status and a link to the source bill or credit and its line'. Today the Events page shows source_type / source_id as plain text and the plan resolved a deferred move as unlinked; the hub already builds VendorBill / VendorCredit source owners (SourceDocumentResolver.php:532-550) and the port has a shared source-document route helper (shared/sourceDocument.ts), so the link needs no new contract.

**New dependencies:** none (the CSV export is one file for the open tab, S9-R2). New infrastructure: one deploy-time env parameter `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED` (D21), removed after launch.

**Corrections the planners made to the requirement brief** are in Appendix A §0, Appendix B §0 and Appendix C §0 (code facts that differ from the PRD or from the earlier plan, e.g. the existing `bookkeeping_journal_entry` table, a declined line's parts keeping their prices, the hub's closed mapping-key enum). Each was verified against the code before acceptance.

## 4. Database Changes

### Core (`api/`)

| Table | Change | Phase | Notes |
|---|---|---|---|
| `work_order` | + `classification VARCHAR(9) NOT NULL DEFAULT 'billable'`, + `category_id BINARY(16) NULL`, + `finish_cycle SMALLINT UNSIGNED NOT NULL DEFAULT 1` | 1 | INSTANT; no index on classification (~99% billable); a `(organization_id, category_id)` index only if prod query Q21 says the categories page needs it |
| `work_order_line` | + `no_charge_category_id BINARY(16) NULL` | 1 | Story 12 mark |
| `invoice` | + `classification`, + `category_id`, + `work_order_cycle`; status value `closed` (VARCHAR, no DDL) | 1 | Snapshot reuses `parts_cost`, `hours_invoiced`, `shop_supplies_charge`, `created_on` (D18) |
| `invoice_statement` | + `no_charge_category_id`, + `no_charge_parts_cost INT`, + `no_charge_labor_rate INT` | 1 | A no-charge line's statement stores `labour_rate` 0 and keeps the real rate here (D5) |
| `company` | + `internal TINYINT(1) NOT NULL DEFAULT 0`, + `default_internal_category_id`; index `(organization_id, internal)` | 1 | INPLACE index |
| `vehicle` | + `internal_category_id` | 1 | S1-R15 |
| `setting` | + `internal_work_orders_enabled`, + `internal_work_orders_first_enabled_at`, + `internal_work_orders_first_closed_at` | 1 | D19, D56 |
| `inventory_changes` | + `expense_category_id`, + `work_order_cycle` | 1 | Stamped at relabel, copied on reversal (EQ-6) |
| `work_order_category` (new) | id, organization_id, list, `category_key` (unique per org), name (unique per org and list, Q39 ✓), requires_original_work_order, is_default, archived_at | 2C | D50 keys |
| `work_order_category_quickbooks_account` (new) | category × workplace → QuickBooks account id (nullable) | 2C | Virtual rows (D54) |
| `work_order_original_reference` (new) + `work_order_original_technician` (new) | subject (work order or line), original work order / line (or Not in ShopView), stored technicians | 4 | D55 |
| `bookkeeping_journal_entry` (existing, SV-11375) | + posted `debit_account_id`, `credit_account_id` | 6 | D6 |
| `inventory_delivery_item`, `vendor_return_item`, `bookkeeping_vendor_credit` | + routing stamps (`expense_category_id`, `expense_work_order_cycle`; `expense_routing`, `expense_category_id`) and `bookkeeping_vendor_credit.line_account_ids` | 6 | Frozen routing for bill and credit lines (D14 amended, D68) |
| `work_order_cost_entry` (new) | shop supplies, reclass (bill and credit), billable-back / credit-back and reversal entries, with category, cycle, amounts | 6 | Source for QuickBooks and the hub (D6) |
| `bookkeeping_cost_journal_entry` (new) | QuickBooks claim per cost entry | 6 | NFR-003 |
| `bookkeeping_vendor_bill` (existing) | + `line_account_ids JSON` | 6 | D7 |

```sql
-- Illustrative shape only, NOT the migration to copy-paste
ALTER TABLE work_order ADD classification VARCHAR(9) NOT NULL DEFAULT 'billable',
                       ADD category_id BINARY(16) DEFAULT NULL,
                       ADD finish_cycle SMALLINT UNSIGNED NOT NULL DEFAULT 1, ALGORITHM=INSTANT;
```

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`.

### Hub (`shopview-accounting`)

Two releases (expand/contract). **Release A:** adopts the contracts package, new enum cases (`InvoiceStatus::Closed`, `AccountingEventStatus::Held`, the new event types), all new tables and nullable columns (category catalog, per-category mapping rows with a nullable account, held reasons, withdrawn marker, Closed-record and No Charge lines fields), and the category catalog processor (the hub's contract tests require a processor for every pinned type). **Release B:** the Closed path, JE v3 cost entries, Held with the per-work-order cycle rule, withdraw, auto-release, the read side inside `/system-accounts`, and the seeding operator command (General Internal → 6500; Warranty and Goodwill → 6430; Comeback → Comeback Expense at HQ1 ✓; reuse / free number / preserve per S6-R2, HQ2–HQ5 ✓). Full detail: Appendix C.

### Data migrations

None that users see. Existing work orders, lines and invoices are `billable` by column default (no backfill). Existing $0 invoices stay billable (S9-E2); existing `is_warranty` lines keep their flag (S2-R22). The starting categories are seeded by the release run (Phase 13), not by a schema migration: core `app:work-order-categories:seed` (per-organization isolation, failure list, `--verify`) and the hub operator command; new organizations get them from the organization-created subscriber and the hub seeder. No customer is flagged and no work order is reclassified (S13-R6).

## 5. API Changes

The full contract — endpoints N1–N26 with fields, atoms, bounds and error codes — is **Appendix A §4**; the frontend's consumption table is **Appendix B §3**, which uses the same names (D60).

- **One contract (D60):** the API addresses a category by its stable `category_key` and returns `{key, name, archived}`; an original travels as the flat `{original_work_order_id, original_not_in_shopview, original_line_id}`. Storage keeps `*_category_id` foreign keys; only the API speaks keys (D50).

- **Casing (D22):** a new field follows its endpoint's existing convention. Settings, WO list / Tech View / board rows, search documents and schedule payloads are **camelCase** (`internalWorkOrders`, `classification`, `displayStatus`); WO detail, lines, customers, vehicles, reports and every **new** endpoint are **snake_case**.
- **Categories (N13–N19):** list / options / create / update / archive impact / archive / restore, and per-location QuickBooks expense accounts; QuickBooks category rows ride inside `bookkeeping/integration` and save through the existing settings save (D54). Category keys never contain a colon (D50).
- **Original references (N20–N22):** the internal-category preview for New Work Order (N20), original-work-order candidates (N21; accessible locations, Q38 ✓; same asset first; capped), original-line candidates with every technician (N22).
- **Line no-charge (N23–N26, D57):** preview, Mark as No Charge, Change category, Mark as Billable; line create/change accept an optional `no_charge` block (absent = unchanged); Create invoice refuses with 409 `no_charge_line_original_required` naming the line (S12-R9). The FE must pass `handlesConflictLocally` on every 409-returning call (the axios interceptor otherwise logs the user out — Appendix A corrections).
- **Make internal (D12, D24, D36):** `all_open: true`, server re-query across every accessible workplace, ≤ 500 per call with `remaining` and `exclude_ids`; candidates carry `location_name` and `inaccessible_count`.
- **Close preview / Close / Reopen (N9–N11):** fingerprint per D23; `original_required_missing` and an original picked inside the dialog (S3-R2); `quickbooks` and `accounting_hub` blocks name the category's account (D26).
- **Invoice lists (D37):** a closed record is left out of every receivables surface, `GET /api/invoices/list`, the dashboard Invoices card and the Top Customers invoice count; the hub's Sales ▸ Invoices is the one list that shows it.
- **Report (N12):** the Internal Work Orders report with the by-work-order-and-line tab, the by-technician tab and the export (PDF with both tabs as sections; the CSV carries the open tab, S9-R2).
- **Accounting contract (Phase 9, D47–D52, D14 amended):** `invoice_created` v4, `journal_entry_requested` v3, `work_order_category_upserted` v1, `vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4 (a bill or credit line of already non-billable work posts straight to the category, as the PRD's Key Decision requires; reclasses only for the S7-R4 and D47 cases), next MINOR package.
- **Open API (Story 11):** out of this plan, except the safety half that ships with the core release (S3-R4, S11-R2/R3): internal invoices never in `GET /v1/invoices` and the other invoice lists, no `invoice.created` / `invoice.paid` for them (structural: Close never records the event behind them).

**Authorization:** every endpoint names its atom in Appendix A §4. Close = `ROLE_INVOICE_CREATE_AND_EDIT` **and** See Financial Data (a new server-side check); Reopen = `ROLE_WORK_ORDER_DELETE`; enable/first-enable = `ROLE_ORGANIZATION_CREATE_AND_EDIT`; customer flag and default category = customers create-and-edit; categories page = 'Settings — Service', QuickBooks pickers = 'Settings — Integrations'; Convert / Change category / line marks = WO create-and-edit + See Financial Data; shop supplies amount = See Financial Data + Invoicing & Payments create-and-edit (Q12).

## 6. Implementation Phases

### Phase map and release order

| # | Phase | Repo | Implements | Depends on | Detail |
|---|---|---|---|---|---|
| 1 | Schema, flags, status fork, shared predicates (no behavior change) | core | NFR-005, NFR-006 (foundation) | — | A: Phase 1 · B: FE-A |
| 2 | Invoice-create extraction (pure refactor) | core | foundation for Close and S12-R9 | 1 | A: Phase 2 · B: FE-C1 |
| 2C | Categories (admin page, QuickBooks rows, seeding CLI) | core | Story 1 S1-R13–R16, Story 5 rows, Story 13 core | 1 | A: Phase 2C · B: FE-K, FE-K2 |
| 3 | Setting, first-enable modal, Internal flag, customer/asset categories, Make internal | core | Story 1 | 1, 2C | A: Phase 3 · B: FE-B1, FE-G |
| 4 | Classification lifecycle, categories and originals on the work order, prices, locks, lists, notes | core | Stories 2, 10 | 3 | A: Phase 4 · B: FE-B2, FE-B3, FE-B4, FE-M |
| 4B | A no-charge line on a billable work order (core) | core | Story 12 | 4 | A: Phase 4B · B: FE-L1, FE-L2 |
| 5 | Close and Reopen, documents | core | Stories 3, 4 | 2, 4 | A: Phase 5 · B: FE-C |
| 6 | QuickBooks (category rows, JEs, cost entries, vendor bills, no-charge lines) | core | Stories 5, 7 | 2C, 4B, 5 | A: Phase 6 · B: FE-D |
| 7 | Hub Release A: contracts, enums, tables, category catalog | hub | Stories 6, 8 (prep) | core schema PR (Phase 9a) published; hub on contracts 1.10/1.11 | C: Phases A0–A3 |
| 8 | Hub Release B: Closed path, cost entries, Held + order, withdraw, read side, seeding | hub | Stories 6, 8, 13 (hub) | 7 deployed | C: Phases B0–B8 |
| 9 | Core accounting emission (9a schema PR, 9b emission) + accounting UI port | core | Stories 6, 8 (core), NFR-004, NFR-011 | 9a: 1; 9b: 5, 6, **8 in production** | A: Phase 9 · B: FE-E |
| 10 | Reports, dashboard, export | core | Story 9 | 1, 5 (whole WOs), 4B (lines), 6 | A: Phase 10 · B: FE-F |
| 11 | Customer portal: closed records, no-charge estimate, $0.00 line, deposits | portal | S3-R4/R6, S2-R11, S2-E6, S2-N5, S12-R4, S12-R7 (SV-12296) | P1: — ; P2–P5: core migrations of 1, 2C, 4 in production | D |
| 13 | Release run (seed, verify, emit, rule-zero, reindex, flip) | ops | Story 13, NFR-010 | 1–11 | A: Phase 13 · C: B8 |

Phases 7–8 can be built in parallel with core phases 2C–6 once the 9a schema PR is published; 9a ships right after Phase 1 (D65). Phase 10 can start after Phase 5 for whole work orders; its line half needs 4B and 6 (D65). Phase 11 P1 can ship any time; P2–P5 follow core's schema migrations in production (the portal reads core's tables directly) and precede the switch flip. Raising `emitted-versions.json` (9b) waits for Phase 8 in production; the release run (13) waits for everything.

### Phase 1: Schema, flags, status fork, shared predicates (no behavior change)
**Implements:** foundation for every story; NFR-005, NFR-006, NFR-010 (gate parameter)
**Depends on:** nothing
**Detail:** Appendix A Phase 1, §2.6, §2.14, §5 (consumer table) · Appendix B FE-A

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/Version<ts>_InternalWorkOrdersColumns.php` (one or more) | `work_order.classification/category_id/finish_cycle`, `work_order_line.no_charge_category_id`, `invoice.classification/category_id/work_order_cycle`, `invoice_statement.no_charge_*`, `company.internal/default_internal_category_id` (+ `(organization_id, internal)` index), `vehicle.internal_category_id`, `setting.internal_work_orders_*`, `inventory_changes.expense_category_id/work_order_cycle` — all INSTANT, defaulted |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Domain/WorkOrder.php` + `WorkOrder.orm.xml`, `Domain/Line/Line.php` + orm | Modify | Columns and read accessors only (behavior lands in Phases 4 and 4B) |
| `api/src/Invoicing/Invoice/Domain/Status.php` | Modify | Add `closed`; delete `getNotVoidStatuses()`; add LIVE / REVENUE lists (D3); every caller moved as classified in Appendix A §5 |
| `api/src/Reporting/Shared/Domain/NonVoidInvoicePredicate.php` | Rename/Modify | → `RevenueInvoicePredicate`; new `LiveInvoicePredicate`, `BillableWorkOrderPredicate`, `NoChargeLinePredicate` (D58), wired at every consumer as no-ops |
| `api/src/Customer/Customers/Domain/Company.php`, `api/src/VehicleService/Vehicles/Domain/Vehicle.php`, `api/src/Organization/Setting/Domain/Setting.php`, `InventoryChanges.php` (+ orm) | Modify | New state (flag, default category, asset category, setting markers, inventory stamps) |
| `config/` parameter `app.internal_work_orders.enable_allowed` | Create | Env `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED`, default `false` (D21); exposed read-only as `internalWorkOrdersAvailable` (D43) |
| `SettingDto`, customer / WO detail / list / board / invoice DTOs | Modify | Read exposure so FE work can start (D25, D22 casing) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/utils/workOrderStatus.ts`, `app/src/utils/helpers.ts` (`STATUS_COLOR_MAP`) | Modify | `closed` label + color; display-status type (D29: the header keeps the backend labels and adds only "Closed") |
| `app/src/api/administration/AdministrationModel.ts`, work-order / customer / vehicle API models, new `app/src/api/internal-work-orders/` types | Modify/Create | `internalWorkOrders*`, `classification`, `category`, `original`, line `no_charge` types |

#### Key code changes:
```php
// api/src/Invoicing/Invoice/Domain/Status.php — the fork that makes Close safe
public static function getLiveStatuses(): array    // "is there a live invoice on this WO?"
{
    return [self::PENDING, self::SENT, self::PAID, self::PARTIALLY_PAID, self::CLOSED];
}

public static function getRevenueStatuses(): array // "count this as revenue"
{
    return [self::PENDING, self::SENT, self::PAID, self::PARTIALLY_PAID];
}
// getNotVoidStatuses() is deleted so every caller fails until it is classified (Appendix A §5).
```

#### Unit / Integration tests:
- `StatusTest`, predicate SQL-shape and NULL-safety tests, the `getNotVoidStatuses` ratchet test, `SettingInternalWorkOrdersTest`; functional rule-zero byte-compare of the Sales report fixture before/after the predicate wiring; LIVE consumers include `closed`.
- FE: label/color map spec, type guards.

#### Verification (Definition of Done gates):
- **Static (scoped):** BE `cs-fix` + `phpstan` (files) + `pest`; FE `eslint` + `vitest` + `vue-tsc`
- **Migration gate:** `doctrine:migrations:migrate`, then `migrations:diff` reports a no-op
- **Smoke:** `bin/smoke-test.sh` — no 500s (every report endpoint touched by the predicates)
- **Compile:** Vite up, no errors
- **Browser-walk:** none user-visible (sanity: Sales report and dashboard load identically, admin)

#### E2E tests (e2e/):
- None user-visible (pre-approved skip: no UI behavior change). Rule zero is proven by the backend byte-compare tests and Product's SV-12297. **Before Phase 1 deploys to staging**, capture the SV-12297 "before" baseline (the billable report numbers on the staging database), so the launch comparison (Phase 13 step 6) compares against data no new predicate has touched (S9-R14).

---

### Phase 2: Invoice-create extraction (pure refactor)
**Implements:** foundation for Story 3 (D4) and the S12-R9 refusal seam
**Depends on:** Phase 1
**Detail:** Appendix A Phase 2, §2.8 · Appendix B FE-C1

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Invoicing/Invoice/Application/HTTP/Create/CreateCommandHandler.php` | Modify | `processCreate()` calls the extracted steps in the identical order |
| `api/src/Invoicing/Invoice/Application/Service/Issue/{InvoiceDraftBuilder,InventoryPickRelabeler,InvoiceAccountingEmitter}.php` | Create | The steps the Close handler composes |
| `api/src/Invoicing/Invoice/Domain/Service/InvoiceIssuanceEligibility.php` | Create | `CreateCommand` pre-validation moved here with byte-identical messages; empty seam for S12-R9 (filled in 4B) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/WorkOrder.vue` | Modify | One finish-action seam (`runCreateInvoice()`) that Phases 4B and 5 branch |

#### Unit / Integration tests:
- The existing invoice-create functional suite passes unchanged (regression lock); a characterization test of the side-effect order taken before the split; `InvoiceIssuanceEligibilityTest`.

#### Verification (Definition of Done gates):
- **Static (scoped)**, **Smoke**, **Compile**
- **Browser-walk:** `/work-orders/<id>` → Create invoice on a billable WO (admin): invoice created, payment flow unchanged; a part sale invoices as before

#### E2E tests (e2e/):
- None new (pure refactor); the existing Create invoice specs are the regression lock.

---

### Phase 2C: Categories (admin page, QuickBooks rows, seeding CLI)
**Implements:** S1-R13, S1-R14, S1-R16, S5-R1, S5-R3–R6 (rows), S13-R1, S13-R2, S13-R4–R6, S13-E2, S13-N1 (core)
**Depends on:** Phase 1
**Detail:** Appendix A Phase 2C, §2.4 · Appendix B FE-K, FE-K2

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `work_order_category` | Stable `category_key` (D50), list, name (unique per list, Q39 ✓), requires-original, default, archived_at |
| `work_order_category_quickbooks_account` | Category × workplace → QuickBooks account (virtual rows, D54) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Domain/Category/*` | Create | `WorkOrderCategory` aggregate, `CategoryKey`, `CategoryList`, default policy, `InternalCategoryResolver` (asset → customer default → org default, archived skipped) |
| `api/src/VehicleService/WorkOrders/Application/Category/{Create,Update,Archive,Restore}/`, `Category/Query/*`, `UI/HTTP/Category/*Controller.php` | Create | N13–N18; voter `WorkOrderCategorySettingsVoter` ('Settings — Service'; accounts need 'Settings — Integrations') |
| `api/src/Bookkeeping/Domain/WorkOrderCategoryAccount/*`, `Bookkeeping/Application/WorkOrderCategoryAccount/Save/*`, `Bookkeeping/UI/Http/WorkOrderCategoryAccounts/ListQuickBooksExpenseAccountsController.php` | Create | Per-location account storage, save command dispatched by the category handlers, N19 expense-account options (D46, Q52 ✓) |
| `api/src/Bookkeeping/Domain/Service/Settings/SettingsHydrator.php`, `BookkeepingSettingKeyGuard.php`, `QuickBooksReferenceField.php` | Modify | Category rows in the Accounts group after Cost of Parts, key `workOrderCategory_<category_key>` (no colon); emitted only where the release gate is open (D61) |
| `api/src/VehicleService/WorkOrders/Application/Category/Seeding/{StartingCategoriesSeeder,CategorySeedVerifier}.php`, subscriber `SeedStartingCategoriesOnOrganizationRegistered.php`, CLI `UI/CLI/SeedWorkOrderCategoriesCommand.php` | Create | `app:work-order-categories:seed` with `--organization`, `--verify`, per-org isolation and failure list; new orgs seeded on creation |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/internal-work-orders/` | Create | Categories API module (list, options, create/update, archive impact, archive/restore, per-location expense accounts) |
| Internal Work Orders page under Administration > Service (route + two tabs) and the category dialog | Create | Columns per S1-R13, New and Restore disabled at 100 active with the S1-R13 message, Show archived (n) with Restore, archive-impact dialog (S1-R16), per-location QuickBooks pickers lazy per location, read-only hub mapping text (D26), 'Setting off' notice (S1-R13) |
| Shared building blocks (`NoChargeCategoryFields`, `OriginalWorkOrderSelect`, `QuickBooksMark`, `LineNoChargeChip`) | Create | Used by Phases 3, 4, 4B, 5 |
| `app/src/components/ts/integrations/quickbooks/QuickBooksMapping.vue` + the integration adapter | Modify | (FE-K2, D61: ships with the backend rows, not with Phase 6) Category rows pulled out of the subcategory regrouping into "Internal work orders" / "No Charge work orders" headers, QuickBooks mark, archived greyed but editable (Q40 ✓), empty-row hint only while the setting is on, shop supplies note |

#### Unit / Integration tests:
- Aggregate invariants, resolver, seeder idempotency (partially seeded org), verifier; functional CRUD + authorization (no 'Settings — Service' → 403; accounts without 'Settings — Integrations' → 403; inaccessible workplace → 422; another org's key → 404); a row saved on the QuickBooks page shows in the category dialog and vice versa; the subscriber seeds a new org once.
- FE: page and dialog specs, archive impact, pickers.

#### Verification (Definition of Done gates):
- **Static**, **Migration gate**, **Smoke**, **Compile**
- **Browser-walk:** the new Administration > Service > Internal Work Orders page (route per Appendix B FE-K; admin): both tabs, create/rename/archive/restore, per-location accounts; `/settings/integrations/quickbooks`: one row per category under the two headers; tech role: page not available

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 2C".

---

### Phase 3: Setting, first-enable modal, Internal flag, customer and asset categories, Make internal
**Implements:** Story 1 (S1-R1 … S1-R12, S1-R15, S1-N1 … S1-E4), S10-R1 (Min without % on flagged customers, D41), S2-R13 (flag audit)
**Depends on:** Phases 1, 2C
**Detail:** Appendix A Phase 3 · Appendix B FE-B1, FE-G

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Organization/Setting/...ChangeSetting*` | Modify | Generic save accepts `internalWorkOrders` only after the first enable; refuses only a false→true change while the gate is closed (D30) |
| first-enable endpoint N1 (`Organization/Setting/UI/HTTP/InternalWorkOrders/EnableController.php` + command) | Create | Toggle + picked customers + `internal_work_orders_first_enabled_at` in one transaction (S1-R2) |
| `api/src/Customer/Customers/Application/Change/*`, `api/src/VehicleService/Vehicles/Application/HTTP/Change/*` | Modify | `internal`, `default_internal_category_key`; asset `internal_category_key`; a changed category re-resolves open internal WOs (Q32 ✓) |
| Make-internal N2–N4 | Create | Every accessible workplace (D36), ≤ 10 rows + `inaccessible_count`, ≤ 500 per call with `remaining`/`exclude_ids` (D12, D24), categories resolved in one batch read |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/administration/WorkOrderSettings.vue` | Modify | "Internal Work Orders" toggle rendered only when `internalWorkOrdersAvailable` (D43), description, hint links to the categories page and QuickBooks/AccountingHub (S1-R3/R4) |
| first-enable modal (new, administration) | Create | Customer multi-picker, nothing preselected, up to 50 with the hint (S1-R2); X = Do this later; Esc/outside ignored |
| `app/src/components/ts/customers/CustomerDialog.vue` | Modify | Internal customer checkbox (last field) + Default internal category select; read-only when the setting is off; Remove-flag dialog (S1-R12); Min without % on flagged customers (D41) |
| Edit Asset dialog | Modify | "Internal category" select with the QuickBooks-mark helper (S1-R15), "[name] (archived)" hint (Q51 ✓) |
| `MakeInternalDialog.vue` (new, customers) | Create | Location column, row notes, "[n] more at locations you don't have access to.", OK-only without permission, loops while `remaining > 0` |
| customers list + customer header | Modify | "Internal" badge (S1-R8) |

#### Unit / Integration tests:
- Functional: first enable (with and without picks), gate closed → 409, generic save before first enable → 409; customer flag with the setting off → 409; default and asset category; Make internal (deposits skipped, partial failure, cap with `remaining`, inaccessible workplace counted only, categories resolved).
- FE: modal close paths, dialog notes and loop, permission variants, category selects.

#### Verification (Definition of Done gates):
- **Static**, **Smoke**, **Compile**
- **Browser-walk:** `/settings` → Work Orders (admin, env switch on locally): toggle → modal → pick → Make-internal dialog; `/customers/<id>` → Edit Customer checkbox + default category; asset Edit → internal category; tech role: settings not available

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 3".

---

### Phase 4: Classification lifecycle, categories and originals on the work order, prices, locks, lists, notes
**Implements:** Story 2 (except S2-R9 → Phase 5, S2-R12 → out, S2-R11 portal half → Phase 11), Story 10 (S10-R1, R2, R5, N1–N3, E1, E2)
**Depends on:** Phase 3
**Detail:** Appendix A Phase 4, §2.2, §2.5, §2.9, §2.13 · Appendix B FE-B2, FE-B3, FE-B4, FE-M

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `work_order_original_reference`, `work_order_original_technician` | Original work order / line / Not in ShopView and the stored technicians, for a work order or a line (D55) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php` + `Domain/Service/WorkOrderClassificationResolver.php` | Modify/Create | Classify and resolve the category at creation (S2-R1, S2-R2), No Charge with category and original |
| `api/src/VehicleService/WorkOrders/Application/Classification/{ConvertToNoCharge,ConvertToBillable,ChangeCategory}/` + `Application/Service/Classification/WorkOrderClassificationChanger.php` | Create | Row-locked transitions; deposit refusal "Reverse the deposit first."; setting rules (S2-N1); Change category saves on an original-only change (Q36 ✓) |
| `api/src/VehicleService/WorkOrders/Application/ChangeCustomer/ChangeCommandHandler.php` | Modify | Classification follows the customer before Close; 409 `customer_change_locked` on a closed internal/no-charge WO (D33); preview adds `category_after` |
| `Application/Service/OriginalWork/OriginalReferenceWriter.php`, N20–N22 | Create | Original candidates (accessible locations, Q38 ✓), line candidates, technicians derived and stored (D55, Q42 ✓) |
| `Domain/Service/WorkOrderPricing.php`, `Domain/PartRequest/PricingCalculator.php`, `WorkOrderDepricer` / `WorkOrderBillablePricer`, `Domain/Service/SellPriceWritePolicy.php` (7 sites), `ApplyDefaultAdjustmentsOnWorkOrderCreatedSubscriber.php`, `LaborRateChangeCascade.php`, line create/change writers | Modify/Create | Price mask and zeroing, D34 repricing, no sell price written back (S2-R19), fixed price removed (S2-R20), no auto-apply at creation (S2-R21), derived warranty flag (S2-R22, Q44 ✓) |
| `WorkOrderShopSuppliesCalculator.php`, `ChangeShopSuppliesCharge` | Modify | Flat amount from the customer Min; lock after Close |
| adjustment / deposit / IBS / Send to Portal guards | Modify | Refusals for internal and no-charge work orders (S2-R11, S2-R15, S2-N5) |
| `WorkOrderListingCriteriaApplier.php`, `WorkOrderDocumentProvider.php` + search mapping, schedule, customer/asset WO tabs | Modify | `classification` + `displayStatus` (camelCase), `closed` status rewrite (D2), Classification chip filter (S2-R14) |
| `WorkOrderHistoryEvents`, `InternalNoteWriter` → `NoteCreator::createInternalSystemNote()` + `ClassificationChangedMetadata` | Modify/Create | System notes (author ShopView, linked numbers) + audit rows on every change (S2-R18) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/work-orders/ts/WorkOrderDialog.vue` | Modify | Internal badge + tooltip naming the category and its source (S2-R1, Q51 ✓); New-only No Charge checkbox, required Category, Original work order / line selects, "Original technician" line (S2-R2) |
| work order three-dots menu + Convert / Change category / Convert to Billable dialogs | Modify/Create | S2-R5, S2-R6, permission-gated (S2-N2) |
| `app/src/components/shared/OrderStatusCard.vue`, `OrderStatusCardMobile.vue` | Modify | One badge, orange header card (token named by the design authority) |
| lines table, `app/src/components/ts/work-orders/LineDialog.vue`, part dialogs, totals block, `app/src/components/ts/shared/FinancialInfoCard.vue` | Modify | Pricing mode `costOnly` (D28), fixed-price fields hidden, warranty input no longer sent (D57), flat Shop supplies field |
| `workOrderColumns.ts` + list row, Tech View, mobile card, board, schedule, search, customer/asset WO tabs | Modify | Badge, "No Charge" Total Price, Classification chip, "Closed" status option on the All tab |
| `app/src/components/ts/work-orders/Statistics.vue`, `app/src/components/ts/displays/board/boardFields.ts` | Modify | "No Charge" in the work-order total on the Statistics tab and board cards; sell, margin and rate hidden (S2-R4 v0.22) |
| change-customer dialog, `app/src/components/ts/shared/customer-info/CustomerCard.vue` | Modify | Price and shop-supplies sentences; vendor-bill dialog (S2-R8); Change Customer disabled on a closed internal/no-charge WO (D33) |
| receive surfaces and vendor-invoice item edit | Modify | Cost-only notice (S2-R19, FE-M; vendor invoice Q48 ✓) |
| notes tab | Modify | System notes with linked work-order numbers |

#### Unit / Integration tests:
- Aggregate transitions and refusals; resolver; changer (adjustments and fixed fields removed, Min default, D34 repricing on stored cost); sell-price policy at every site; derived warranty; display-status rewrite; functional convert / change category / change customer / create / split / list filter / asset swap re-resolution / receive and core charge on internal work / no auto-apply / original candidates; S2-R11 regression lock (pick, receive, clock-in, approval behave as billable); part sale unaffected (NFR-008).
- FE: dialogs, menu gating, pricing modes, badge on each surface, notes rendering.

#### Verification (Definition of Done gates):
- **Static**, **Migration gate**, **Smoke**, **Compile**
- **Browser-walk:** create an internal WO on a flagged customer's asset (tooltip names the asset's category) and a No Charge Warranty WO with an original; detail page orange header, no prices, Shop supplies field; menu Convert / Change category; notes tab; list chip; receive a special order on an internal WO (cost-only notice); tech role: no prices, no Convert actions

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 4".

---

### Phase 4B: A no-charge line on a billable work order (core)
**Implements:** Story 12 (S12-R1 … S12-R12, S12-N1 … S12-N4, S12-E1 … S12-E8; posting in Phase 6/9, reports in Phase 10, portal in Phase 11)
**Depends on:** Phase 4
**Detail:** Appendix A Phase 4B, §2.3, §2.10 · Appendix B FE-L1, FE-L2

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `Domain/Line/Line.php`, `Application/Service/Line/LineNoChargeMarker.php`, `Application/Line/NoCharge/{MarkNoCharge,ChangeNoChargeCategory,MarkBillable}/`, `UI/HTTP/Line/NoCharge/*Controller.php` | Create/Modify | N23–N26: preview (new billable total, deposits, all-lines hint), mark, change category, mark billable (D34 per line); refusals per S12-E8 / S12-N3 |
| `Application/Line/Create/*`, `Application/Line/Change/*` | Modify | Optional `no_charge` block; absent = unchanged (D57); 403 without the atoms |
| `WorkOrderPricing.php`, `InvoiceBuilder.php`, `InvoiceFinancialSnapshotService.php`, `InventoryPickRelabeler`, `InvoiceReversalService.php`, `InvoiceIssuanceEligibility` | Modify | Line priced 0 at the chokepoint; statement flagged with `no_charge_*` and `labour_rate` 0; snapshot excludes the line; relabel/reversal stamps category and cycle; S12-R9 refusal; first invoice with a line sets the report marker (Q31 ✓) |
| `MovePartToLineCommandHandler.php`, credit memo path | Modify | Part moves priced by the destination line (S12-E6); Issue Credit for a no-charge line's parts (Q35 ✓) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/work-order-lines/WorkOrderLineRow.vue`, Tech View, mobile line card, print model | Modify | Chip "No Charge · [category]", $0.00 rate/total/parts rendered by the FE (the row keeps the real rate), blank margin; Print Work Order chip |
| line three-dots menu + Mark as No Charge / Change category / Mark as Billable dialogs | Create | S12-R1, R2, R5; the "Change where the cost is posted?" pre-step on a line with a posted bill, from the menu and from Edit Line (S2-R8 v1.0); disabled "Reverse the invoice first." once invoiced; deposit-exceeds message (Q49 ✓); all-lines hint (S12-R10) |
| `app/src/components/ts/work-orders/LineDialog.vue` (Edit Line / New Line) | Modify | No Charge block under a divider with category / original selects (Q47 ✓: not in the ShopCoach builder) |
| `WorkOrder.vue` `runCreateInvoice` | Modify | 409 `no_charge_line_original_required` → message naming the line, Edit Line opens on it (S12-R9) |

#### Unit / Integration tests:
- Marker and pricing unit tests; statement and snapshot tests; functional mark / change / mark billable / line door (absent block leaves the mark), create invoice with a line (flag, snapshot, S12-R9, all lines → $0), reverse (stamps, marks kept, cycle + 1), credit for a line's part; regression: a billable invoice with no mark is byte-identical.
- FE: chip and $0.00 rendering, dialogs, Edit Line block, the refusal path.

#### Verification (Definition of Done gates):
- **Static**, **Smoke**, **Compile**
- **Browser-walk:** mark a line of a billable WO (menu and Edit Line), see the chip and $0.00; Change category; Mark as Billable re-prices; Create invoice refused without a required original, then succeeds; invoice preview shows the line at $0.00 with the category; tech role: chip shown, prices hidden

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 4B".

---

### Phase 5: Close and Reopen, documents
**Implements:** Story 3, Story 4, S2-R9, S10-R3, S2-R13 (Close/Reopen log), S12-R7 (document rendering of a no-charge line)
**Depends on:** Phases 2, 4
**Detail:** Appendix A Phase 5, §2.7, §2.8 · Appendix B FE-C

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Invoicing/Invoice/Application/Close/Preview/*` (N9) | Create | Rows of S3-R2 by state, category account notes, `original_required_missing`, `quickbooks` / `accounting_hub` blocks (D26), fingerprint (D23), cents (D27) |
| `api/src/Invoicing/Invoice/UI/HTTP/Close/CloseWorkOrderController.php` + `Application/Close/*` (N10) | Create | Composes the Phase 2 steps; status `closed`, $0, category and cycle; original written when picked in the dialog; first-close marker; no sale side effects (S3-R4) |
| `InvoiceReversalService::reverseClosed()` + Reopen N11 | Create/Modify | WO → Complete, invoice deleted, picks restored with `reversesInventoryChangeId`, cost-entry reversals, cycle + 1 (D51) |
| `Line/Create/CreateCommandHandler.php` | Modify | A line added to a closed WO spawns a new WO (S3-R3) |
| invoice / estimate templates (`api/templates/invoices/invoice.html.twig`, `api/templates/invoices/legacy/invoice.html.twig`, the estimate template) | Modify | INTERNAL / NO CHARGE stamp under the masthead, "Category: [name] · Original work order [n]", hours and cost only, Summary; a billable document shows a no-charge line at $0.00 with the category; email subject |
| customer portal invoice listing, vehicle invoices, `GET /api/invoices/list`, Open API lists, repair CLIs | Modify | Closed excluded (D37) / listed on the asset tab as Closed "No Charge" |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `CloseWorkOrderDialog.vue` (new) | Create | Posting date, rows and notes, variants (Review, no integration, no cost, changed, S7-N5), Original work order select when required (S3-R2) |
| `app/src/components/ts/work-orders/WorkOrder.vue`, `app/src/components/ts/work-orders/complete/CompletionWizard.vue` | Modify | Close on every Create-invoice surface; completion steps first with the last button "Close Work Order" (D42) |
| Finance tab invoice menu, document view, header card | Modify | Reopen Work Order + dialog; document with Download / Print / Email (empty recipient); "Closed on [date]…" line |

#### Unit / Integration tests:
- `CloseWorkOrderTest` (skip list, closed status, relabel stamps, marker once, stale fingerprint 409, missing atom 403, original required 422), Reopen (cycle + 1, re-close new invoice), webhook suppression vs billable (NFR-009), closed hidden from lists, spawn on add line, document snapshots for both stamps and for a billable document with a no-charge line.
- FE: dialog variants, completion relabel, permission gating.

#### Verification (Definition of Done gates):
- **Static**, **Smoke**, **Compile**
- **Browser-walk:** `/work-orders/<id>` (admin, no integration): Close on a not-yet-complete WO runs completion first; confirmation; Closed · Internal alert; NO CHARGE document; Change Customer disabled; Reopen → Complete; a Warranty WO without an original shows the select in the confirmation; tech role: no Close

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 5".

---

### Phase 6: QuickBooks (category rows, journal entries, cost entries, vendor bills, no-charge lines)
**Implements:** Story 5, Story 7 (incl. S7-N5, S7-R8), S3-N4 (QuickBooks notes), S10-R4 / S10-N2 (QuickBooks), S12-R8 (QuickBooks half), S4-E1 + S4-E2 (QuickBooks halves)
**Depends on:** Phases 2C, 4B, 5
**Detail:** Appendix A Phase 6, §2.11 · Appendix B FE-D

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `bookkeeping_journal_entry` (existing) | + posted debit/credit accounts (D6) |
| `work_order_cost_entry`, `bookkeeping_cost_journal_entry` | Cost entries and their QuickBooks claims (D6, NFR-003) |
| `bookkeeping_vendor_bill.line_account_ids` | Per-line posted account (D7) |
| `inventory_delivery_item.expense_category_id`, `expense_work_order_cycle`; `vendor_return_item.expense_routing`, `expense_category_id`; `bookkeeping_vendor_credit.line_account_ids` | Frozen routing stamp per bill and return line, read by QuickBooks and the hub payload builders, and each credit line's posted account (D14 amended, D68) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Accounting/CostEntry/*` (`CostEntryPlanner`) | Create | Shop supplies, bill and credit reclass, billable-back / credit-back and reversal entries at finish, invoice creation, Reopen and category move — no bill-time or credit-time entry (D14 amended, D47, D68) |
| `Bookkeeping/Application/Service/WorkOrderCategoryAccountResolver.php`, `FallbackAccountResolver::resolveCategoryExpense()` | Create/Modify | Category account per location, else ShopView Review — never another row (S5-R4) |
| `Bookkeeping/Application/Service/Sync/JournalEntrySyncService.php`, `CostJournalEntrySyncService.php` | Modify/Create | Category debit, Class from the location, memo with WO number, classification and category (S7-R2); the two-account inventory gate (D35, S7-N5); posted accounts stored; reversals of posted entries only (D38) |
| `PerLineCogsAccountResolver.php`, `OriginalBillLineAccountResolver.php`, vendor bill/credit sync services | Modify/Create | Bill lines on internal/no-charge work and lines post to the category account (S7-R3, S7-R8); credits follow the stored line account (S7-R3a) |
| `Reporting/Export/Service/InvoiceGenerator.php`, `CustomerInvoiceExportDetails/InvoiceData.php` | Modify | QuickBooks invoice line of a no-charge line at 0.00 with the category in the description (S7-R8) |
| QB Unexported read model, `UnexportedItemMarkDoneCommandHandler`, `BookkeepingLog` | Modify | Labels, classification + category, withdrawn rows without actions, hand-exported counts as posted |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `CloseWorkOrderDialog.vue` | Modify | QuickBooks account notes and variants with the permission-gated Set account link |
| QB Unexported page | Modify | Classification + category labels; the S7-N3 type labels; withdrawn rows |
| `WorkOrder.vue runCreateInvoice()` + `VendorBillCostMoveDialog` (invoice variant) | Modify | "Create invoice [number]?" with one "Moved from [account] to [account]" row per move, only when a bill's cost moves at invoicing and an integration exists (S7-R8 v1.0, FE-D) |

#### Unit / Integration tests:
- Planner, resolver (no fallback between rows), JE sync (category debit, Class, memo, stored accounts, reversal after a remap), cost JE sync (idempotent rerun, withdrawn), per-line bill routing, invoice line 0.00; functional against the QuickBooks fake: Close posts N stock JEs + shop supplies; retry no duplicate; Reopen reverses posted only; S7-N5; closed period → QB Unexported; no-charge line entries at invoicing; billable sync suites unchanged.

#### Verification (Definition of Done gates):
- **Static**, **Migration gate**, **Smoke**, **Compile**
- **Browser-walk:** (admin) a mapped category row (set up in Phase 2C, D61) now drives the Close dialog QuickBooks notes and the posted debit; an empty row posts to ShopView Review; QB Unexported rows — with a sandbox QuickBooks company if available, otherwise state that posting was verified only against the fake

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 6" (on-demand QuickBooks project).

---

### Phase 7: Hub Release A — contracts, enums, tables, category catalog (`shopview-accounting`)
**Implements:** preparation for Stories 6, 8, 13 (rollback-safe expand step); S6-R1 rows appear as categories arrive
**Depends on:** the Phase 9a schema PR published (next MINOR, D52; 9a ships right after Phase 1, D65); the hub on the 1.10/1.11 contract types owned by other work
**Detail:** Appendix C Phases A0–A3, §2, §4

Adopt the contracts package; add `InvoiceStatus::Closed`, `AccountingEventStatus::Held` and the new event types; all new tables and nullable columns (category catalog, per-category mapping rows with a nullable account keyed `(workspace, category_key, kind)`, held reason, withdrawn marker, Closed-record and No Charge lines fields); ship the `work_order_category_upserted` processor (the hub's contract tests require a processor for every pinned type) and the block on deactivating a mapped category account. Gates: the hub's lint / analyse / test and `Contracts aligned with core`. Deployed to production before Phase 8 so a rollback of B never meets an unknown value.

#### E2E tests (e2e/):
- None (hub repo; covered by the hub scenario test, Appendix C §6).

---

### Phase 8: Hub Release B — Closed path, cost entries, Held and order, withdraw, read side, seeding (`shopview-accounting`)
**Implements:** Story 6 (S6-R1 … S6-E1), Story 8 hub side (S8-R1 … S8-E2, S8-R7), S4-E1, S4-R3 (order), S4-E2 (hub half), S10-R4 / S10-N2 (hub half), S12-R8 (hub half), S13-R3 (hub)
**Depends on:** Phase 7 deployed
**Merge gate:** none. HQ8 and the Q30 addition were answered in v0.23 and confirmed by the hub owner in v0.24 (S8-R3, S8-N2 v1.0), so the B2b deferred move ships with the rest of Release B.
**Detail:** Appendix C Phases B0–B8, §5–§10

- B0 contract support (`resources/accounting-contract-support.json`: `invoice_created` 4, `journal_entry_requested` 3, `vendor_bill_created` 4, `vendor_bill_updated` 3, `vendor_credit_created` 4; `work_order_category_upserted` 1 is supported from Release A, A0).
- B2b vendor bill and credit lines by category: per-item `work_order` key, version detection, line resolution, credit lines, the deferred move for an empty row and its unwind (HQ8 ✓: the S8-R3 v1.0 lifecycle, D70).
- B1 `invoice_created` v4: Closed record (no revenue, receivable or tax), the billable invoice's No Charge lines block (S8-R7), replay never turns a closed record into revenue (S8-R5).
- B2 JE v3 cost entries resolved by `(category_key, cost_kind)`; source labels (Q50 ✓); link to the record by core ids.
- B3 Held: a missing/inactive mapping on either side, a closed or missing period → Held with the S8-N2 reason (row label per Q50 ✓); message acknowledged; per-work-order cycle order (a later Close waits while an earlier cycle's entry is Held, S4-R3); only the no-charge line's cost entries are held, the invoice posts (Q30 ✓).
- B4 Automatic release when the mapping is saved or the period opened, in cycle order.
- B5 Reopen: reversal by reference; a still-held original becomes Dismissed "Withdrawn: work order reopened", never retried or replayable (HQ6 ✓).
- B6 Read side inside `/system-accounts` (`category_accounts`, D53), invoice fields, Accounting Events fields (a deferred move's source vendor bill or credit and its line, D70); B7 intent guards.
- B8 Seeding operator command `accounting:seed-work-order-categories` (+ `--verify`): 6500 / 6430 / 6440 Comeback Expense, suitability (active expense account, name match) and free-number rules, 6430 on legacy charts (S6-R2, S13-R3 v0.22), preserve valid mappings, per-org isolation; the new-workspace seeder.
- Gates: hub lint / analyse / test, the eight-step scenario test (Appendix C §6), `Contracts aligned with core`. Review with the hub's own tooling (never core `/pr-review`).

#### E2E tests (e2e/):
- None (hub repo; covered by the hub scenario test, Appendix C §6).

---

### Phase 9: Core accounting emission (9a schema PR, 9b emission) + accounting UI port
**Implements:** Story 8 core side, Story 6 UI (core port), S3-N4 (AccountingHub notes), S12-R8 (hub half, core side), NFR-004, NFR-011
**Depends on:** 9a — Phase 1; 9b — Phases 5, 6 and **Phase 8 in production**
**Detail:** Appendix A Phase 9, §2.12 · Appendix B FE-E · Appendix C §7, §9

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/docs/integration/accounting-events/{invoice_created.v4,journal_entry_requested.v3,work_order_category_upserted.v1,vendor_bill_created.v4,vendor_bill_updated.v3,vendor_credit_created.v4}.schema.json` + fixtures, `coverage-inventory.md`, `MANIFEST.sha256`, `api/docs/integration/composer.json` | Create/Modify | **9a** (right after Phase 1, D65): next MINOR (D52), emits nothing new; `AccountingQueueBoundaryTest::PUBLISHED_AHEAD_OF_EMITTER` lists all six |
| `api/docs/integration/emitted-versions.json` | Modify | **9b**: raise all six together, only after Phase 8 is in production |
| `api/src/Accounting/Outbox/Domain/Model/AccountingEventType.php`, `PayloadBuilder/{InvoiceCreatedPayloadBuilder,JournalEntryRequestedPayloadBuilder,WorkOrderCategoryUpsertedPayloadBuilder,VendorBillCreatedPayloadBuilder,VendorCreditCreatedPayloadBuilder}.php` | Modify/Create | v4 (D48), v3 family block from inventory rows and cost entries (D47), upsert (D49), vendor bill v4 / update v3 per-item category block and credit v4 items from the routing stamps (D14 amended) |
| category write handlers, `BackfillPhase`, `AccountingOnboarder`, seed CLI `--emit-accounting` | Modify | Upsert in the category transaction, onboarding phase before invoices, one-time emit in the release run (NFR-011) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/accounting/settings/AccountingSystemAccounts.vue` + model | Modify | Renders the hub's `category_accounts` rows ("Internal: …", "No Charge: …") with their own draft, saved through `category_mappings` (null clears the account, keeps the row) |
| accounting invoices list / detail, Invoice List report params | Modify | Closed pill + badge + "No Charge"; Closed record page (D39) with category and original; a billable invoice's No Charge lines block; Closed in the status filters (unselected on the Invoice List report) |
| accounting events page | Modify | Held (scoped key `event_held`) with reasons and Retry; Dismissed "Withdrawn: work order reopened"; waiting-behind copy (Q50 ✓); a deferred move's label and its source vendor bill or credit line as a link (S8-R3 v1.0, D70) |
| `CloseWorkOrderDialog.vue` | Modify | AccountingHub notes from the preview's `accounting_hub` block (D26) |

#### Unit / Integration tests:
- Payload builder tests (closed vs billable vs billable-with-lines; family vs ordinary JE; reversal repeats the block; cycle); fixtures validated by `AccountingQueueBoundaryTest`; functional `CloseEmitsAccountingEventsTest`, `ReopenEmitsReversalsTest`, `BillableInvoiceWithNoChargeLineEmitsTest`, `CategoryWritesEmitUpsertTest`; FE specs for the port's new states.

#### Verification (Definition of Done gates):
- **Static**, **Smoke**, **Compile**; contracts CI (`be-accounting-contracts.yml`, required `Accounting contracts gate`) and the hub's `Contracts aligned with core`
- **Joint stack:** `make dev-full`: Close → Closed record + category entry; unmap → Held → map → posted; Reopen → withdrawn or reversed; a billable invoice with a no-charge line → revenue posts, the line's entries post to the category
- **Browser-walk:** Accounting > Account Mappings (one row per category), Invoices (Closed pill, record page, No Charge lines block), Accounting Events (Held + Retry, Dismissed), admin

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 9".

---

### Phase 10: Reports, dashboard, export
**Implements:** Story 9 (S9-R1 … S9-E2), S12-R11, NFR-002
**Depends on:** Phases 1, 5 (whole work orders), 4B (lines), 6 (S9-R13 uses its `InvoiceData` change, D65)
**Detail:** Appendix A Phase 10, §2.14 · Appendix B FE-F

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Reporting/Reports/{UI/HTTP,Application,Infrastructure/Persistence/Query/Dbal}/InternalWorkOrders*` | Create | N12: by work order and line (closed invoices UNION no-charge statements), filters (classification incl. No Charge line, category incl. archived, original technician, location single, D45), per-category summary, by technician (Completed lines via Technician Efficiency's definition; Comeback/Warranty keyed `comeback`/`warranty`, D50; Unassigned; Q33 ✓), export PDF (both tabs) + CSV (open tab), accessible-workplace scope (S9-R16), reader connection |
| Technician Efficiency providers (report, PDF, dashboard card) | Modify | `internal_work_orders=all|hide|only` (D56); a no-charge line's estimated hours never invoiced hours, clocks stay worked hours |
| `CustomersSpendingQueryHandler.php`, WIP fetcher, Parts Velocity, Shop Efficiency | Modify | Classification predicate (Customers Spending), badge/no value (WIP), units vs revenue (Parts Velocity), invoiced hours (Shop Efficiency) |
| `api/src/Reporting/Export/Service/InvoiceGenerator.php` + Customer Invoice export | Modify | Closed excluded by default; opt-in option with Classification and Category columns; a no-charge line's 0.00 row with the category regardless of the option (S9-R13) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/reporting/ReportLeftMenuNav.vue` + routes | Modify | "Internal Work Orders" entry directly after Sales By Representative in the Performance group (D32), hidden until the first-close marker (Q31 ✓) |
| new report page (two tabs, summary strip, filters, totals, export) | Create | Debounced filters; helper line (S9-R2) |
| Technician Efficiency page | Modify | Chip "Internal work orders: Hide / Only internal / Show all" with tooltip |
| Export Reports dialog | Modify | "Include internal and no-charge work orders" option + helper (S9-R6) |

#### Unit / Integration tests:
- Report SQL tenant-scope test; functional report (both sources, filters incl. `no_charge_line` and `unassigned`, totals over the range, archived category, other-org rows invisible, inaccessible location excluded, 367 days → 400, caps, a shared line counted once per technician and once in totals, completed-lines parity with Technician Efficiency); every money report and dashboard tile excludes closed records and no-charge lines (rule zero byte-compare on billable fixtures); Customers Spending; export byte-identical with the option off.
- FE: nav visibility, tabs, chip, export option.

#### Verification (Definition of Done gates):
- **Static**, **Migration gate** (only if the measurement adds an index), **Smoke** (new report endpoints), **Compile**
- **Browser-walk:** `/reports/...` (admin): the report appears after the first Close; both tabs, filters, totals, export; Sales excludes the closed WO and adds $0 for a no-charge line; Technician Efficiency chip; Export Reports option

#### E2E tests (e2e/):
- Section 7 → E2E tests → "Phase 10".

---

### Phase 11: Customer portal — closed records, the no-charge estimate and the $0.00 line (`shopview-portal`)
**Implements:** S3-R4 / S3-R6 (portal half), S2-R11 (portal half), S2-E6, S2-N5 (portal deposits), S12-R4 and S12-R7 (portal, SV-12296)
**Depends on:** P1 — nothing (ships any time); P2–P5 — core migrations of Phases 1, 2C and 4 in production (the portal reads core's tables directly; a portal release ahead of them fails with SQL errors); all before the release switch flips
**Detail:** Appendix D

Code facts that shape it: the portal does **not** render its own documents — the estimate is an HTML snapshot core renders at Send to Portal, the invoice HTML/PDF come from core on every view — but it renders its own approval line cards, Price Summary (a replica of core pricing that reads the raw labor rate) and approval emails, and it lists invoices straight from core's `invoice` table. Phases: **P1** keep closed records off every portal invoice list, filter and vehicle tab; **P2** read classification, categories, originals and no-charge lines; **P3** Price Summary parity with core's mask (shared fixture); **P4** approval page and emails (stamp, category line, no prices; a stale snapshot is suppressed and the live state shown on open, Q54–Q59 ✓); **P5** refuse portal deposits on internal and no-charge work orders; **P6** the Story 12 invoice needs verification only. Gates in the portal's own tooling (Pint, Pest with the sqlite helper, ESLint, Prettier, build, `/code-review`, its Playwright flow). Once any shop has the setting on, the portal only rolls forward.

#### E2E tests (e2e/):
- Portal specs per Appendix D (portal repo); core-side data is covered by Phase 4/4B/5 functional tests. No core E2E spec opens the portal approval page today (backlog).

---

### Phase 13: Release run (Story 13, SV-12295) and launch
**Implements:** S13-R1 … S13-R6, S13-E1, S13-E2, S13-N1, NFR-010
**Depends on:** Phases 1–11
**Detail:** Appendix A Phase 13 · Appendix C B8, §7

Runbook: (1) deploy with the gate closed; (2) `app:work-order-categories:seed` in staging, then production; rerun failed organizations with `--organization`; `--verify` until every organization passes S13-R5; (3) QuickBooks rows need no step (D54); (4a) after hub Release B reaches each environment: `accounting:seed-work-order-categories`, then `--verify` (this run can precede step (2); the starting keys are fixed, D50, so it does not depend on core's seed); (4b) at launch, right before step (8): run it again with `--verify` until every workspace passes S13-R5 (S13-R3 v0.22: an operator command run after the hub release and again at launch); (5) core emission deploy (9b), then `app:work-order-categories:seed --emit-accounting`, verified by outbox rows per accounting organization ≥ its category count; (6) SV-12297 rule-zero comparison on the staging database against the baseline captured before Phase 1 (S9-R14); (7) `work_orders` search reindex; (8) flip `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED` in staging, then production; `bin/smoke-test.sh` after each deploy; (9) a follow-up removes the switch.

#### E2E tests (e2e/):
- The E2E suite runs against staging after step 8 (no-charge specs are capability-gated, D31).


## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **Backend:** classification and category aggregates (transitions, list invariants, default not archivable, archived skipped in resolution); `Status` LIVE/REVENUE lists and the predicate classes (SQL shape, NULL safety, a ratchet test against reintroducing `getNotVoidStatuses`); `WorkOrderPricing` masking for non-billable work orders and no-charge lines; depricer/repricer (D34, fixed price removal, adjustments); `SellPriceWritePolicy` at the seven write sites; shop supplies first step; Close handler skip list **and** the billable path unchanged (NFR-009); fingerprint (D23); finish cycle; no-charge statement and snapshot exclusion; category account resolver (no fallback between rows); cost-entry planner (category move = reversal + new reclass); payload builders v4 / v3 / upsert. Test paths: Appendix A per phase.
- **Frontend:** pricing modes and the per-line $0.00 override; display status; lock constant; categories page and dialog (per-location pickers, archive impact); first-enable modal; Make-internal dialog (Location column, inaccessible line, OK-only); category / original selects and the "Original technician" line; line menu items and dialogs; Close dialog states (mapped, ShopView Review, no integration, no cost, changed, original required, S7-N5); report filters, summary strip, by-technician tab, chip. Run `npx vitest run --maxWorkers=2 <spec>` (one run at a time). Spec paths: Appendix B per phase.
- **Hub:** Pest unit + feature tests per Appendix C, including the eight-step scenario test (§6 there).
- **Portal:** per Appendix D.
- **Edge cases to watch:** part sales unchanged (NFR-008); a billable invoice with no mark byte-identical (statements, snapshot, inventory rows, QuickBooks invoice); adding a line to a closed WO spawns a new WO (S3-R3); Reopen and re-close (new cycle); a held hub entry withdrawn on Reopen; an archived category still posting on a reopened work order (S12-E8); Edit Labor / inline save / ShopCoach never clearing a line mark (D57).

### Integration tests
- Functional (Pest, `api/tests/Functional`): enable flow with and without the env switch; first enable + flags atomic; category CRUD and authorization; QuickBooks category rows saved from either page; Make internal across workplaces with the cap; Close end to end (no customer transaction, rows relabeled with category and cycle); Reopen (cycle + 1); create invoice with a no-charge line (statement flagged, snapshot excludes, S12-R9 refusal); reversal of that invoice; QuickBooks posting against the fake (category account, Class from location, Review fallback, S7-N5, reversal of posted entries only, no-charge line entries and the 0.00 invoice line); accounting outbox (`CloseEmitsAccountingEventsTest`, `BillableInvoiceWithNoChargeLineEmitsTest`, `CategoryWritesEmitUpsertTest`); every money report excludes closed records and no-charge lines, and rule-zero byte-compare tests on billable fixtures.
- Contract: fixtures validate against the three schemas (`AccountingQueueBoundaryTest`); core `Accounting contracts gate` and hub `Contracts aligned with core`.
- Joint stack (`make dev-full`): Close → Closed record + category entry; unmap → Held → map → posted; Reopen → withdrawn or reversed; billable invoice with a no-charge line → revenue posts, the line's entries post to the category.

### Manual testing checklist
1. Turn the setting on in a fresh org: the modal appears once; Save flags customers and the Make-internal dialog follows; turning off and on again shows no modal. Before the release switch flips, none of this is visible.
2. Categories page: the four starting categories exist; create, rename, archive (impact dialog), restore; set QuickBooks accounts per location from the dialog and see them on the QuickBooks page, and the reverse.
3. Flag a customer with a default category and an asset with its own category; a new internal work order on that asset posts to the asset's category (tooltip says so); swap the asset → re-resolved.
4. Make internal on a customer with open billable work orders at two accessible locations and one inaccessible location: Location column, "[n] more at locations you don't have access to.", conversion without switching location; a customer with more than 500 open work orders is converted in full.
5. No Charge at creation with Warranty → original work order and line selects, "Original technician" line; Convert to No Charge; Change category; Convert to Billable re-prices labor at the customer rate and parts from the pricing rules on the stored cost, without restoring hand-set or fixed prices.
6. Close a Warranty work order without an original → the select inside the confirmation, Close disabled until picked; close; NO CHARGE document with the category line and original link; Reopen; close again with a new posting date.
7. Story 12: mark one line of a billable work order No Charge (menu and Edit Line); chip and $0.00; a deposit larger than the new total shows the message; Create invoice refused while a required original is missing; invoice shows the line at $0.00 with the category; QuickBooks gets the invoice line at 0.00 and a JE moving the line's parts cost to the category account.
8. QuickBooks: a category row empty → ShopView Review; Inventory Asset or Cost of Parts unmapped → no parts entry, S7-N5 note, shop supplies still posted; QB Unexported closed-period row and a withdrawn row.
9. AccountingHub org: Close with an unmapped category row → Held "[row] row not mapped"; map → auto-retry posts; Reopen while Held → Dismissed "Withdrawn: work order reopened"; a billable invoice with a no-charge line → the invoice record carries the No Charge lines block; a vendor bill line on an internal work order with an empty category row → the bill posts, the move is Held on Accounting Events with a link to the bill and line, and mapping the row posts it (S8-R3).
10. Reports: Sales, Sales By Customer, Sales By Representative, Advisor Analysis, dashboard cards, Sales Tax, A/R Aging, statements: closed records absent and no-charge lines add $0; the Internal Work Orders report lists both sources with the summary strip and the By technician tab; export both formats; SV-12297 rule-zero comparison.
11. A part sale invoiced end to end: identical to before.
12. Customer portal: a closed record never appears as an invoice; a no-charge estimate shows lines and hours with no prices, the NO CHARGE stamp and the category (a stale snapshot is replaced on open); a billable estimate/invoice shows the no-charge line at $0.00 with its category; a portal deposit on an internal or no-charge work order is refused; an estimate changed after sending shows "This estimate changed after it was sent. The lines above are current."; an estimate whose work order was made internal shows the obsolete banner with no Approve / Decline (a page opened before the conversion gets "This estimate is no longer available." when approving).

### E2E tests
This section comes from the E2E curation pass of 2026-11-09 against PRD v0.21 (page version 35), updated the same day for v0.22 (page 36: the CSV export carries the open tab; Close on credit hold, S3-N5, is covered by FE unit tests) and on 2026-11-10 for v1.0 (page 39: specs assert the round-4 copy; no new spec beyond the batch caps). It replaces the v0.17 pass of 2026-10-28/29.

What changed from v0.17:
- Categories replace reasons. One new spec covers the categories page. Every no-charge spec picks a category, and QuickBooks and AccountingHub map one row per category.
- The folder, tags, setting and fixture are renamed to Internal Work Orders (D56).
- Story 12 adds a Phase 4B batch, plus one QuickBooks spec and one hub spec for no-charge lines.
- The original work order, line and technician selects are asserted at creation and in the Close confirmation.
- The report spec gains the By technician tab.
- The v0.17 Update to C29276 is withdrawn because the toggle is gated by the release switch (D43). Reference item R1 is closed by D29.

Decisions that still hold:
- D29: the header keeps the backend labels and adds only Closed.
- D30: the generic settings save refuses only a false→true change.
- D31: specs run in an isolated org behind a capability gate.
- D32: the report sits directly after Sales By Representative.

The batch cap is 5 workflows per phase run; the surplus is in the Backlog. Every Product answer is in (PRD v1.0, page 39); specs assert the PRD text. Endpoint numbers are Appendix A §4.2's (N1–N26).

QuickBooks specs run on demand. Hub rows that need the joint stack go in the local-only joint suite (`e2e/joint/`). Its TestRail cases stay Not Automated, and the phase PR records them through the override marker.

### Ground rules (shared infrastructure, built once in the Phase 2C batch)

| Item | Rule |
|---|---|
| **Domain folder** | `e2e/tests/ui/internal-work-orders/` (plural slug). Files are `iwo-<workflow>.spec.ts`. Describe: `'<Workflow> Tests @internalworkorder'`. Tags: `['@internalworkorder', '@workorder', '@C<id>', '@P<n>']`. Add two entries to `SECTION_MAP` in `e2e/scripts/testrail-push.ts`: `'ui/internal-work-orders/'` and `'qb/'`. Today the map has no `qb` entry, so pre-minting a `tests/qb/` case fails. |
| **Playwright project** | New project `internal-work-orders`: `fullyParallel: false`, storageState `.auth/admin.json`, deps `['setup-admin','setup-technician']`, testMatch `['**/ui/internal-work-orders/*.spec.ts']`. It has to be an explicit project: `workorders` and `admin` list their files one by one. Add it to a nightly shard in `e2e-playwright-tests.yml`. The QuickBooks specs ride the existing `quickbooks` project (`playwright.config.ts:1126-1132`, `**/qb/**/*.spec.ts`). That project is excluded from nightly CI. |
| **Isolated org** | NEW `e2e/src/api/fixtures/internal-work-orders-org.fixture.ts` on `bootstrapOrgShell()`, modeled on `fixed-asset-org.fixture.ts`. Never minted on prod.<br>(a) A **cached** org per environment, stored in `.internal-work-orders-org.<env>.json` (gitignored). On every run an idempotent *ensure-enabled* step reads the settings. When `internalWorkOrdersFirstEnabledAt` is null it calls N1 with no customers; otherwise it calls the generic save. The step is a no-op in the Phase 2C batch, before N1 exists. Every 2C–10 spec uses this org except the two below.<br>(b) A **pristine** org, minted on every run and never cached. Only 3A (first enable) and 10A-T2 (report listed after the first Close) use it.<br>(c) **Starting categories:** the org-created subscriber (`SeedStartingCategoriesOnOrganizationRegistered`) seeds them on mint. The fixture asserts that N13 lists `general_internal`, `warranty`, `goodwill` and `comeback`, and fails fast otherwise. It never seeds them itself.<br>(d) **Phase 9:** the cached org is onboarded to accounting with the fixed-asset fixture's step (`POST /api/accounting-onboarding/go-live`). That only happens after hub Release B is in that environment, so the hub's new-workspace seeder maps the four starting rows. |
| **Capability gate** | Add `internalWorkOrders` to `e2e/src/config/env-capabilities.ts`: true on local; on QA, read from `QA_INTERNAL_WORK_ORDERS_ENABLED`; false on stage until Phase 13 step 8; false on prod.<br>NEW `requireInternalWorkOrders(client)` reads `internalWorkOrdersAvailable` from `GET organizations/settings`:<br>- capability false → skip under the Bucket P reason prefix `internal-work-orders-gate-closed`;<br>- capability true but the flag false → **fail**, naming `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED=true` in `api/.env.local` as the fix.<br>Add a file-scoped row to `SKIP_BUCKETS.md` → "Reason-matched allowances": stage, qa and prod only; never allowed on local. |
| **Customers** | Every spec owns its customers: `customerFactory.findOrCreate` → `ensureContact` → `vehicleFactory.create` with `VinGenerator.generateSerial()`. Never flag `fixtureState.baseCustomerId`. |
| **Categories** | In the cached org, categories are shared state:<br>- Names of spec-created categories carry a run suffix. An archived name blocks reuse (Q39 ✓).<br>- Each spec archives its own categories in `afterEach`, through the new `work-order-category.factory.ts` `cleanup()`.<br>- Never rename or archive a starting category.<br>- Assert deltas (`Show archived (n+1)`), never absolute counts. The Work orders count rule is Q43 ✓. |
| **Lines** | Never send a fixed price on a non-billable work order or on a no-charge line: the backend answers 422 `fixed_price_not_available`. `TestUtils.createNewLineViaApi` defaults to `fixed_price: 50` (`src/utils/test-utils.ts:1465-1482`), so use `woFactory.addLine` without `fixedPrice`. Give technicians through `assignedTechIds`; this keeps Q42 ✓ (shift-derived rosters) out of every assertion. |
| **Cleanup** | A closed work order holds a LIVE invoice, so call `woFactory.reopen(id)` before `woFactory.delete(id)`. Reverse a billable invoice with `invoiceFactory.reverse()` before deleting its work order. |
| **Waits** | Wait on data signals, not spinners:<br>- the header attribute `data-classification`;<br>- `badge_wo_status` reading "Closed";<br>- `text_wo_closed_on`;<br>- `aria-checked` on `input_internal_work_orders`;<br>- `chip_line_no_charge_<lineId>`. |
| **Contract** | Factories follow Appendix A §4 (paths, `category_key`, the flat `original_*` fields, N1–N26). Appendix B §3 uses the same contract (D60). |
| **Local traps** | Two failures documented in `e2e/AGENTS.md` "Common local failures" apply here too:<br>- A local dump with `bookkeeping.type=quickbooks` and `auth=NULL` makes Close and Create invoice fail.<br>- A receive against the 4Refuel vendor fails; use a spec-owned vendor. |

**New and extended factory methods**
- `organization.factory.ts`:
  - `enableInternalWorkOrders(customerIds)` (N1);
  - `setInternalWorkOrders(on)` (the generic save, after the first enable);
  - `getInternalWorkOrdersState()` (`internalWorkOrdersAvailable` and the two markers);
  - the R2 projection (reference breakage table).
- NEW `work-order-category.factory.ts` (N13–N18): `list`, `options`, `create({ list, name, requiresOriginal, isDefault })` → key, `rename`, `archive`, `restore`, `archiveImpact`; `cleanup()` archives what the spec created.
- `customer.factory.ts`: `setInternal(companyId, internal, defaultInternalCategoryKey?)`.
- `vehicle.factory.ts`: `setInternalCategory(vehicleId, key | null)`.
- `work-order.factory.ts`:
  - `create({ noCharge, noChargeCategoryKey, original })`: `original` is sent as the flat `original_work_order_id`, `original_not_in_shopview` and `original_line_id` fields (D60), never as a nested object;
  - `convertToNoCharge` (N5), `convertToBillable` (N6), `changeCategory` (N7), with the same flat original fields;
  - `makeInternal(companyId)` (N4, looped while `remaining > 0`);
  - `closePreview` (N9), `close(id, { postingDate, original })` (N10, fingerprint read from N9, `original` flat as above), `reopen` (N11);
  - `markLineNoCharge` (N24), `changeLineNoChargeCategory` (N25), `markLineBillable` (N26);
  - `classificationOf(id)`;
  - `cleanup()` reopens before it deletes.
- NEW `bookkeeping-settings.factory.ts`: snapshot and restore one location's `workOrderCategory_<key>` rows (Phase 2C, for 2C-B), then Inventory Asset, Cost of Parts and the Shop supplies item mapping (Phase 6).
- NEW `accounting-system-accounts.factory.ts` (Phase 9): read `category_accounts`; PUT `category_mappings` (null clears the account and keeps the row).
- `src/integrations/quickbooks/qb-journal-entry-helper.ts`: `findJournalEntriesByMemo(woNumber)`.
- `qb-customer-helper.ts`: `getInvoiceLines(docNumber)` (Phase 6).
- Reused as they are: `customer`, `vehicle`, `work-order`, `parts`, `deposit`, `adjustment`, `labour-type`, `invoice`, `staff` (`enrollAtWorkplace`), `workplace`, `vendor`, `hours`, `technician-task`.

**Page objects**

New:
- `src/pages/administration/internal-work-order-categories.page.ts` and `src/pages/dialogs/iwo-category.dialog.ts`.
- `src/pages/work-orders/no-charge-category-fields.component.ts`: Category, Original work order, Original line and the technician line, keyed by the host suffix.
- Dialogs: `iwo-first-enable`, `make-internal`, `remove-internal-flag`, `convert-to-no-charge`, `change-no-charge-category`, `convert-to-billable`, `mark-line-no-charge`, `mark-line-billable`, `close-work-order`, `reopen-work-order`.
- `src/pages/reports/internal-work-orders.page.ts`.
- `src/pages/administration/quickbooks-mapping.page.ts`.

Extended:
- `work-order-settings.page.ts`: toggle and hints. Not `TOGGLES_IN_DOM_ORDER`; see the reference table.
- `edit-customer.dialog.ts`, `edit-vehicle.dialog.ts`, `customer.page.ts` / `customers.page.ts`, `new-work-order.dialog.ts`.
- `lines.page.ts`: header and badge, closed-on line, menu items, Close header button, `line_cost_<id>`, `part_cost_total_<id>`, the line chip and the line menu items.
- `new-line.dialog.ts` / `edit-line.dialog.ts`: `checkbox_line_no_charge` and its fields.
- `work-orders-filter-bar.page.ts`: `WO_FILTER_KEYS.classification`, values, `WO_STATUS_VALUES.closed`.
- `work-orders.page.ts`: `rowClassificationBadge(id)`, `totalPriceCell(id)`.
- `change-work-order-customer.dialog.ts`, `finance.page.ts`, `customers/vehicle.page.ts`, `accounting-settings-screen.page.ts`, `accounting-document-list-screen.page.ts`, `accounting-document-detail-screen.page.ts`.

### Phases 1 and 2: regression lock only

**Phase 1 (schema, flags, status fork, predicates).**

New coverage: none. The phase changes only `app/src/api/**`, `app/src/utils/**` and BE domain/predicate code, with no `*Controller.php`. That puts it outside the `coverage-policy.md` §9 filter, so no block is required. If the PR touches a §9 path anyway, stamp it `None — internal-refactor`.

The predicates are wired at 39 report call sites (Appendix A §5), so run these specs against the branch:
- `tests/ui/sales.spec.ts`
- `tests/ui/advisor-analysis.spec.ts`, `tests/ui/technician-efficiency.spec.ts`, `tests/ui/billing-efficiency.spec.ts`, `tests/ui/export-reports.spec.ts`
- `tests/ui/reporting/`: `sales-by-customer`, `sales-by-representative`, `sales-by-representative-deactivation`, `advisor-analysis-row-nav`, `sales-tax-filter`, `sales-tax-wo-link`, `ar-aging-*-link`, `parts-velocity*`, `inventory-value`, `technician-utilization`, `work-in-progress` (all `.spec.ts`)
- `tests/ui/dashboard/`: `dashboard-kpi-tiles`, `dashboard-tile-details`, `dashboard-report-drill-in`, `dashboard-count-tiles`, `dashboard-at-risk-sales-drill-in`, `dashboard-at-risk-window` (all `.spec.ts`)
- `tests/ui/administration/imported-invoice-sales-exclusion.spec.ts`
- `tests/api/finance-exports.spec.ts`, `tests/api/ar-aging-as-of-date.spec.ts`
- `tests/ui/customers/customer-finance-open-only-filter.spec.ts`, `tests/ui/customers/invoice-list-search.spec.ts`
- `tests/permissions/wo-delete-permissions.spec.ts` (the LIVE deletion guard)

**Phase 2 (invoice-create extraction).**

New coverage: `None — internal-refactor`. FE-C1 does change template bindings in five finish-action surfaces. If the reviewer won't accept `internal-refactor` for that, use the override marker with the reason "behavior-preserving finish-action seam; regression lock run".

Regression lock, for every consumer of `button_create_invoice{,_header}`, `menu_item_create_invoice`, `section_create_invoice_action` and `tooltip_create_invoice`:
- `tests/ui/work-orders/`: `finish-action-negatives`, `bulk-create-invoice`, `completion-go-to-invoice-gate`, `completion-required-invoice`, `completion-optional-invoice`, `completion-simple-flow`, `completion-wizard-run-outcomes`, `completion-inventory-lifecycle`, `review-on-flow` (all `.spec.ts`)
- `tests/ui/finance/`: `create-invoice-pinned-note`, `create-invoice-po-required`, `credit-hold-header-invoice-gate`, `credit-hold-invoicing-gate` (all `.spec.ts`)
- `tests/ui/finance.spec.ts` (C147, C1787)
- `tests/permissions/`: `wo-create-invoice-permissions`, `part-sale-create-invoice-permissions`, `wo-finance-tab-permissions` (all `.spec.ts`)
- `tests/ui/part-sales/ps-*.spec.ts`

### Phase 2C

**Batch: 2 Create** (2C-A in the main suite; 2C-B on demand in `tests/qb/`, moved here from Phase 6 by D61). This batch also builds the ground-rule infrastructure: the fixture, capability, project, SECTION_MAP entries and skip-bucket row.

**2C-A `e2e/tests/ui/internal-work-orders/iwo-categories-page.spec.ts`** — P3, admin, Happy path
- **Test:** `NEW - Admin manages Internal and No Charge categories: starting set, create, rename, archive and restore`.
- **PRD IDs:** S1-R13, S1-R14 (Name, Requires the original work order), S1-R16 (the key stays stable across rename, archive and restore), S13-E2 (a new org gets the starting set).
- **Steps:**
  1. Administration > Service > `link_internal_work_orders_tab`.
  2. On `tab_internal_categories`: `category_row_general_internal` reads "General Internal" with the Default badge.
  3. On `tab_no_charge_categories`: `category_row_warranty` and `category_row_comeback` read "Required"; `category_row_goodwill` reads "Not asked".
  4. Click `button_new_no_charge_category`. In `dialog_iwo_category`, enter "Recall <run>" in `input_iwo_category_name`, tick `checkbox_iwo_category_requires_original`, Save.
  5. Row menu `button_category_menu_<key>` → `menu_item_edit_category_<key>` → rename to "Recall <run> B" → Save → reload.
  6. `menu_item_archive_category_<key>` → confirm in `dialog_archive_category`.
  7. Click `link_show_archived_categories` → `button_restore_category_<key>`.
- **Expected:**
  - After step 4, the new row shows "Required".
  - After the reload, the row with the **same** `category_row_<key>` shows the new name.
  - After archiving, the row leaves the active table and the link reads "Show archived (n+1)".
  - After restoring, the row is back in the active table under the same key. The API check through N13 agrees.
- **Setup:** cached org. The setting can be on or off: the page stays editable while it is off. `afterEach` archives the spec's category. No QuickBooks connection, so the QuickBooks column is hidden and not asserted.
- **Why E2E:** the starting set comes from the real org-created subscriber. The dialog writes through N15/N16 (`/api/internal-work-orders/categories`, the category addressed by `category_key`, D60), and the stable key across rename, archive and restore is only provable against the real backend. A mocked FE unit test and an API-only test both pass while the real pair breaks.

**Not E2E here** (rows in Dev-layer routing):
- The default category cannot be archived.
- The archive-impact counts.
- The setting-off notice.
- Read-only pickers without 'Settings — Integrations' (Backlog #12).

The category dialog ↔ QuickBooks page round trip needs a connected location, so it is 2C-B, on demand.

**2C-B `e2e/tests/qb/iwo-qb-category-accounts.spec.ts`** — P3, admin, Happy path (on demand)
- **Test:** `NEW - Admin maps a category's QuickBooks expense account on ShopView Accounts and sees it in the category dialog, and the reverse`.
- **PRD IDs:** S5-R1, S5-R2 (Q52 ✓), S5-R3, S5-R4, S5-R6, S1-R14 (picker), S13-R2.
- **Steps:** Settings > Integrations > QuickBooks → map Warranty to Expense account E1 → Save → reload → Administration > Service > Internal Work Orders → Edit Warranty → pick E2 in `select_iwo_category_qb_<workplaceId>` → Save → QuickBooks page.
- **Expected — before mapping:**
  - directly under Cost of Parts sit `text_quickbooks_category_header_internal` with General Internal (QuickBooks mark), then `text_quickbooks_category_header_no_charge` with Warranty, Goodwill and Comeback, then Cost of Goods (tax);
  - no existing Accounts row is regrouped under "Other" (F12);
  - `quickbooks_empty_hint_workOrderCategory_warranty` reads "Not set. Parts cost of Warranty work orders posts to the ShopView Review account until you pick one." (asserted from the Phase 3 batch; see Setup);
  - `text_quickbooks_shop_supplies_note` is shown.
- **Expected — after mapping:** E1 persists across the reload; the dialog's picker shows E1; after the dialog save, the QuickBooks page shows E2.
- **Setup:**
  - Lives in `e2e/tests/qb/` and runs in the `quickbooks` project, **on demand**: the project needs QBO OAuth tokens and is excluded from nightly CI. It uses the persistent QuickBooks-connected org and the location "QA Testing" (pattern: `tests/qb/quickbooks-journal-entries.spec.ts:46-57`).
  - Gated by `requireInternalWorkOrders()`: the backend adds the category rows only where the release gate is open (D61), and FE-K2 renders them in the same batch.
  - NEW `quickbooks-mapping.page.ts`; `bookkeeping-settings.factory.ts` snapshots the four category rows in `beforeAll` and restores them in `afterAll`; accounts of type Expense (Q52 ✓).
  - In the Phase 2C batch the setting cannot be turned on yet (N1 arrives in Phase 3), so the empty hint, which shows only while the setting is on, is not asserted there (see the Phase 3 tightening).

### Phase 3

**Batch: 5 Create, at the cap.**

**3A `iwo-first-enable.spec.ts`** — P3, admin, Happy path
- **Test:** `NEW - Admin turns on Internal Work Orders, flags two customers and makes the open work orders internal`.
- **PRD IDs:** S1-R1, S1-R2, S1-R3 (hint line 1 and its link), S1-R8 (list), S1-R9, S1-R11.
- **Steps:**
  1. Settings > Work Orders: `input_internal_work_orders` has `aria-checked="false"`.
  2. Click it. `dialog_iwo_first_enable` shows `text_iwo_first_enable_change_later`, and `button_iwo_save_internal_customers` is disabled.
  3. Pick customers A and B in `select_iwo_internal_customers`. Save.
  4. `dialog_make_internal` opens for A only (B has no open work orders). `text_make_internal_body` reads "2 open work orders for A are billable…", and one `row_make_internal_<id>` shows per work order. Click `button_make_internal`.
  5. Reload Settings.
  6. Click `link_iwo_hint_categories`.
  7. Open Customers.
- **Expected:**
  - After the reload, the toggle has `aria-checked="true"` and `text_iwo_hint_categories` is visible.
  - The link lands on the categories page (`tab_internal_categories`).
  - A and B both show `badge_customer_internal` in the Customers list.
  - Both of A's work orders read `internal` (API now; header badge from Phase 4).
- **Setup:** **pristine** org. Customer A with a contact, an asset and 2 estimate WOs; customer B with nothing. No N1 call: the test performs the first enable.
- "Do this later" (S1-R5) can't share the org, because the modal shows once. It is Dev.

**3B `iwo-internal-flag.spec.ts`** — P3, admin
- **T1 (Happy path):** `NEW - Admin flags a customer with a default internal category and its open work orders become internal under it`.
  - **PRD IDs:** S1-R7, S1-R8 (header), S1-R11, S2-R1 (customer default).
  - **Steps:**
    1. On customer C, open Edit Customer.
    2. `checkbox_customer_internal` is the last field and shows `text_customer_internal_helper`. Tick it.
    3. `select_customer_default_internal_category` appears with General Internal preselected. Pick the spec's "Fleet <run>".
    4. Save, then click `button_make_internal`.
  - **Expected:**
    - `badge_customer_internal` shows on C's header.
    - API: C's WO is `internal` and its internal category key equals Fleet's.
  - **Setup:** cached org; customer C with 1 open billable WO; an Internal category "Fleet <run>" created by the factory.
- **T2 (Edge case):** `NEW - Admin removes the Internal flag and the open internal work order stays internal`.
  - **PRD IDs:** S1-R6, S1-R12, S1-N5, S1-E1.
  - **Steps:**
    1. Edit Customer on flagged customer D → untick the checkbox.
    2. `dialog_remove_internal_flag` opens. `text_remove_internal_flag_body` reads "1 open internal work orders for D stay internal and close without an invoice. New work orders for D will be billable."
    3. Click "Remove flag", then Save.
  - **Expected:**
    - The header badge has count 0. Precondition: the header itself renders.
    - D's open WO is still `internal`.
  - **Setup:** `customerFactory.setInternal(D, true)` (NEW), then a WO created after the flag is set.

**3C `iwo-setting-off-on.spec.ts`** — P2, admin, Happy path
- **Test:** `NEW - Admin turns the setting off and on again: flags kept, badges hidden, re-enable offers the flagged customer's billable work orders`.
- **PRD IDs:** S1-R10, S1-N4, S1-E4, S1-R11.
- **Steps:**
  1. Settings: toggle off → Save settings.
  2. Open customer E (flagged): no badge.
  3. Open Edit Customer: `checkbox_customer_internal` is ticked and disabled, with `text_customer_internal_setting_off` and `link_customer_internal_settings`.
  4. API: create a WO for E. It is billable.
  5. Settings: toggle on → Save settings. No first-enable dialog opens.
  6. `dialog_make_internal` lists E's WO. Click `button_make_internal`.
- **Expected:**
  - The badge is back on E.
  - The WO reads `internal`.
  - `dialog_iwo_first_enable` never renders. Precondition read: `internalWorkOrdersFirstEnabledAt` is non-null.
- **Setup:** cached org; `setInternal(E, true)`. `afterEach` turns the setting on again with `setInternalWorkOrders(true)`.

**3D `iwo-make-internal-locations.spec.ts`** — P3, staff user with access to L1 + L2, Happy path
- **Test:** `NEW - Make internal lists and converts the customer's open billable work orders at every location the user can access, and counts the rest`.
- **PRD IDs:** S1-R11 (locations, "without switching location"), S1-E3; D36.
- **Steps:** Edit Customer F → tick `checkbox_customer_internal` → Save → `dialog_make_internal` → `button_make_internal`.
- **Expected:**
  - A `row_make_internal_<id>` with the location name shows for each of the three WOs at L1 and L2. The L3 WO has no row.
  - `text_make_internal_inaccessible` reads "1 more at locations you don't have access to."
  - After confirming, the three listed WOs read `internal`, the L3 WO stays `billable`, and the session's location is unchanged.
- **Setup:**
  - Cached org; L2 and L3 created with `workplaceFactory.findOrCreate`.
  - A spec-owned staff user with the admin role, enrolled at L1 + L2 only (`staffFactory.create` + `enrollAtWorkplace`). The user signs in through the in-browser login of `src/utils/report-role-seed.helper.ts`; precedent: `tests/ui/reporting/location-scope-follows-enrollments.spec.ts`.
  - Customer F with 2 WOs at L1, 1 at L2 and 1 at L3.
- **Why E2E:** the scope is a server-side query, and one row is converted by a user who cannot see it. A unit test cannot prove the inaccessible WO is neither listed nor converted.

**3E `iwo-asset-internal-category.spec.ts`** — P2, admin, Happy path
- **Test:** `NEW - Admin sets an internal category on an internal customer's asset; the field is absent on a regular customer's asset`.
- **PRD IDs:** S1-R15, S1-R16 (QuickBooks mark helper).
- **Steps:**
  1. Edit Asset on X, an asset of flagged customer F. After a divider, `select_asset_internal_category` and `text_asset_internal_category_helper` show; the helper names F's default "General Internal".
  2. Pick the spec's "Yard <run>" → Save.
  3. Reopen Edit Asset on X.
  4. Open Edit Asset on Y, an asset of a regular customer.
- **Expected:**
  - After step 3, the field shows "Yard <run>". API: vehicle view `internal_category.key` equals Yard's key.
  - On Y, `select_asset_internal_category` has count 0. Precondition: the dialog renders.
  - F's open internal WO on X is re-resolved to Yard (Q32 ✓).
- **Setup:** cached org; F flagged with an open internal WO on X; an Internal category created by the factory.
- **Why E2E:** Edit Asset sends `internal_category_key` and shows the field from `internal_category_applicable` (Appendix A §4.1, Appendix B §3 row 14, D60). A key renamed on either side passes that side's own tests while the real pair drops the value.

**Tightening, outside the cap.**
- In the Phase 4 batch, replace the API classification checks in 3A, 3B and 3D with the WO header badge (`badge_wo_classification`).
- In this batch, 2C-B's `beforeAll` turns the setting on (N1 if it was never enabled, otherwise the generic save) and its `afterAll` turns it off again (R3); add the S5-R4 empty-hint assertion.

### Phase 4

**Batch: 5 Create, at the cap.**

**4A `iwo-internal-work-order.spec.ts`** — P3, admin
- **T1 (Happy path):** `NEW - Admin creates a work order on an internal customer's asset; the dialog names the asset's category and the work order opens Internal`.
  - **PRD IDs:** S2-R1, S1-R16 (resolution order), S2-N3, S2-R3, S2-R13.
  - **Steps:**
    1. Work Orders → Create Work Order → pick customer F and asset X.
    2. `badge_wo_dialog_internal_customer` is visible.
    3. Hover `icon_wo_dialog_internal_info`. `tooltip_wo_dialog_internal` reads "Internal customer: no prices, no invoice. Posts to Yard <run>, from the asset."
    4. `checkbox_wo_no_charge` has count 0.
    5. Create, then reload.
  - **Expected:**
    - The header has `data-classification="internal"` and `badge_wo_classification` reads "Internal". Both survive the reload.
    - API: the internal category key equals Yard's.
  - **Setup:** `setInternal(F, true)`; `vehicleFactory.setInternalCategory(X, yardKey)` (NEW). Using the asset's category keeps Q51 ✓ (the tooltip wording for the org default) out of the assertion.
- **T2 (Edge case):** `NEW - Admin sees an internal work order at cost: no sell prices, fees or deposit, and the flat shop supplies amount`.
  - **PRD IDs:** S2-R4, S2-R15 (menu), S2-N5, S10-R1 (D41).
  - **Steps:** open an internal WO that has a labor line and a picked stock part.
  - **Expected:**
    - `line_cost_<id>` and `part_cost_total_<id>` show the cost.
    - `line_rate_<id>`, `line_margin_<id>`, `part_sell_price_<id>` and `part_total_sell_price_<id>` have count 0.
    - `item_label_Shop Supplies` / `item_value_Shop Supplies` equal F's Min.
    - The three-dots menu has no "Add Work Order Fee / Discount".
    - The Finance toolbar has no `button_new_deposit`.
  - **Setup:** existing `customerFactory.setShopSuppliesCharge` (Min only), `woFactory.addLine`, `partsFactory.createInventoryPart` + `addInventoryPartToLine` + `pickPart`.
  - **Why E2E:** the backend price mask and the FE `costOnly` mode (D28) must agree. A mocked FE test can't see the backend leak a price. An API-only test can't see the columns render.

**4B `iwo-create-no-charge.spec.ts`** — P3, admin, Happy path
- **Test:** `NEW - Admin creates a No Charge Warranty work order with its original work order and line; the original technician is shown and stored`.
- **PRD IDs:** S2-R2, S2-R16, S2-R17, S2-R3, S2-R13.
- **Steps:**
  1. Create Work Order → regular customer G, asset Z.
  2. Tick `checkbox_wo_no_charge` → in `select_wo_no_charge_category` pick Warranty.
  3. `select_wo_no_charge_original_work_order` appears. Pick P, listed under "Same asset".
  4. In `select_wo_no_charge_original_line`, pick L.
  5. `text_original_technician` reads "Original technician: <T>". Create, then reload.
- **Expected:**
  - `data-classification="no_charge"` and `badge_wo_classification` reads "No Charge" in the no-charge style. Both persist across the reload.
  - API: the no-charge category key is `warranty`, the original work order is P, the original line is L, and the original technicians are exactly [T].
- **Setup:** P is an invoiced WO of G on Z (`woFactory.createInvoicedWo`). Its line L is assigned to technician T through `assignedTechIds`, which keeps Q42 ✓ out. Everything is at one location (Q38 ✓).
- **Why E2E:**
  - The candidate lists (N21, N22) and the stored technician derivation are only real against the real backend.
  - The create payload carries `no_charge_category_key` and the flat `original_*` fields (D60). Only the real FE payload against the real backend shows they are stored.

**4C `iwo-convert.spec.ts`** — P3, admin
- **T1 (Happy path):** `NEW - Admin converts a billable work order with a fee to No Charge; a ShopView system note records it`.
  - **PRD IDs:** S2-R5, S2-R15, S2-R18, S2-R13.
  - **Steps:** menu `menu_item_convert_to_no_charge` → in `dialog_convert_to_no_charge`, pick Goodwill in `select_convert_no_charge_category` (no original asked) → "Convert to No Charge".
  - **Expected:**
    - The badge reads "No Charge", and the fee row and adjustments card are gone.
    - The menu offers `menu_item_change_no_charge_category` and `menu_item_convert_to_billable`, and not `menu_item_convert_to_no_charge`.
    - The Notes tab has a system note: `note_sender_<id>` reads "ShopView" and the text starts "Converted to No Charge by".
  - **Setup:** existing `woFactory.addAdjustment`.
- **T2 (Edge case):** `NEW - Convert to No Charge is disabled while the work order holds a deposit`.
  - **PRD IDs:** S2-N4.
  - **Expected:** `menu_item_convert_to_no_charge` is disabled and `tooltip_convert_to_no_charge_deposit` reads exactly "Reverse the deposit first".
  - **Setup:** existing `deposit.factory.create`.
- **T3 (Edge case):** `NEW - Admin changes the category to Comeback with its original work order, then converts back to billable and the lines are priced as new`.
  - **PRD IDs:** S2-R6, S2-R17, S2-E4, S2-R18 (links); D34.
  - **Steps:**
    1. Click `menu_item_change_no_charge_category`.
    2. In `dialog_change_no_charge_category`, pick Comeback. The original selects appear; pick P → Save.
    3. On the Notes tab, check the note.
    4. Click `menu_item_convert_to_billable` → confirm.
  - **Expected:**
    - The note names P as a link to P.
    - After the convert, `line_rate_<id>` equals the customer's labor rate, or the location's.
    - A part's price is the pricing rule applied to the cost stored on the line, not to a changed catalogue cost.
    - The badge is gone.
  - The category changes in this test, so Q36 ✓ (Save when only the original changes) does not apply.
- **T4 (Edge case):** `NEW - Admin converts a work order whose line had a Fixed Line Total and can still edit and save the line`.
  - **PRD IDs:** S2-R20.
  - **Steps:** Convert to No Charge (Goodwill) → open Edit Line on the fixed line → Save.
  - **Expected:**
    - `input_fixed_line_total` has count 0.
    - Save closes the dialog with no 422.
    - The Notes tab reads "Fixed line total $1,250.00 removed".
  - **Setup:** existing `woFactory.addLine({ fixedLineTotal: 1250 })`.
  - **Why E2E:** after de-pricing, the line must carry a real labour type: the customer's, else the location's default (Appendix A §2.9, D62; Appendix B §3 row 31). Otherwise Edit Line cannot save it, and only the real FE and BE together show that.

**4D `iwo-list-classification.spec.ts`** — P3, admin, Happy path
- **Test:** `NEW - Admin filters the Work Orders list by Classification and sees the badge and the "No Charge" total`.
- **PRD IDs:** S2-R14, S2-R10 (list, Total Price only with See Financial Data).
- **Steps:**
  1. All tab → `filter_chip_classification` → `filter_option_classification_no_charge`.
  2. Open the row, then go Back.
- **Expected:**
  - Only the no-charge WO of the three seeded ones is listed.
  - Its row shows `badge_work_order_classification` "No Charge" and `cell_total_price_<id>` "No Charge".
  - After Back, the chip is still active.
- **Setup:** one billable, one internal and one no-charge WO on one spec-owned customer. Extend the page object's `WO_FILTER_KEYS` with `classification`.
- **Why E2E:** it guards the plan's casing risk (Appendix B F1). List rows are camelCase, and a missing `classification` silently reads as billable.

**4E `iwo-change-customer.spec.ts`** — P2, admin, Happy path
- **Test:** `NEW - Admin moves an open billable work order to an internal customer; it becomes internal and shop supplies resets to the customer's minimum`.
- **PRD IDs:** S2-R7, S10-R2 (reset on a customer change), S2-R1 (customer default), S2-R13.
- **Steps:**
  1. On a WO for regular customer H with a priced labor line, open Change Customer and pick flagged customer I (Min $15).
  2. `text_change_customer_classification_effect` reads "Prices are removed; costs and hours are kept."
  3. `text_change_customer_shop_supplies_reset` reads "Shop supplies resets to I's minimum ($15.00)."
  4. Confirm.
- **Expected:**
  - `badge_wo_classification` reads "Internal" and `line_rate_<id>` has count 0.
  - API: the internal category is I's default.
- **Setup:** existing factories plus `setInternal`. The closed-WO lock (D33) is asserted in 5A.

**Not E2E this phase:** S2-R19, S2-R21 and S2-R22 are owned by the BE functional tests named in Dev-layer routing. S2-R8 is Backlog #1.

### Phase 4B

**Batch: 3 Create.**

**4B-A `iwo-line-mark-no-charge.spec.ts`** — P3, admin
- **T1 (Happy path):** `NEW - Admin marks one line of a billable work order No Charge; it shows $0.00 with its chip and the work order stays billable`.
  - **PRD IDs:** S12-R1 (menu), S12-R2, S12-R3, S12-R4, S12-R6.
  - **Steps:**
    1. On a billable WO with priced labor lines A and B, open B's menu → `menu-item_mark_no_charge_<B>`.
    2. `dialog_mark_line_no_charge` shows `text_mark_no_charge_line_summary`. Pick Goodwill in `select_mark_line_no_charge_category` → "Mark as No Charge".
  - **Expected:**
    - `chip_line_no_charge_<B>` reads "No Charge · Goodwill".
    - `line_rate_<B>` and `line_total_cost_<B>` read "$0.00"; `line_margin_<B>` is empty.
    - `badge_wo_classification` has count 0, and there is no `data-classification="internal|no_charge"`.
    - The Financial Info total equals line A's price.
    - The Notes tab has a ShopView note starting "Line '<B title>' marked No Charge by".
  - **Why E2E:** the FE renders $0.00 itself (Appendix B F7) while the backend keeps the real rate and computes totals on the billable lines. Only the two together show the right numbers.
- **T2 (Edge case):** `NEW - Admin changes the line's category and then marks it billable; it is priced as a new line`.
  - **PRD IDs:** S12-R5; D34.
  - **Steps:**
    1. `menu-item_change_line_category_<B>` → pick Comeback → pick `option_original_not_in_shopview` → Save.
    2. `menu-item_mark_billable_<B>` → `dialog_mark_line_billable` → confirm.
  - **Expected:**
    - After step 1, the chip reads "No Charge · Comeback".
    - After step 2, the chip is gone and `line_rate_<B>` equals the customer's labor rate.
- **Setup:** cached org (setting on); the customer's labor rate set through existing factories.

**4B-B `iwo-line-create-invoice.spec.ts`** — P4, admin, Happy path
- **Test:** `NEW - Create invoice is refused while a Warranty line has no original; after picking Not in ShopView the invoice shows the line at $0.00 with its category`.
- **PRD IDs:** S12-R9, S12-R7, S12-N3.
- **Steps:**
  1. Header `button_create_invoice_header`.
  2. The notification reads "Line '<title>' needs its original work order (or Not in ShopView) before the invoice." Edit Line opens on that line: `checkbox_line_no_charge` is ticked and the original select shows.
  3. Pick `option_original_not_in_shopview` → Save → Create invoice.
- **Expected:**
  - The Finance preview shows the line at "$0.00" with "Warranty" under its title, and no NO CHARGE stamp.
  - The invoice total equals the billable line.
  - Afterwards, `menu-item_mark_billable_<id>` is disabled with the tooltip "Reverse the invoice first."
- **Setup:** a billable WO at `complete` with one billable line and one Warranty line marked through `woFactory.markLineNoCharge` without an original (N24); org gates off.
- **Why E2E:** the FE pre-check reads `no_charge_category.requires_original_work_order` on the **lines** endpoint (Appendix A §4.1, D60; Appendix B §3 row 20), and the backend 409 is the backstop. The invoice document is rendered by the backend.

**4B-C `iwo-line-dialog-door.spec.ts`** — P3, admin, Happy path
- **Test:** `NEW - Admin creates a No Charge line from New Line; editing its labor later keeps the mark`.
- **PRD IDs:** S12-R1 (dialog door); D57.
- **Steps:**
  1. Add a line through New Line with a real labour type (not the Fixed Line Total pseudo type).
  2. Tick `checkbox_line_no_charge`; `text_line_no_charge_helper` shows. Pick Goodwill in `select_line_no_charge_category` → Save.
  3. Change the line's hours 1 → 2 through Edit Labor → Save → reload.
- **Expected:**
  - After step 2, `chip_line_no_charge_<id>` reads "No Charge · Goodwill" and `line_rate_<id>` reads "$0.00".
  - After the reload, the chip and the $0.00 rate remain, and API `no_charge_category.key` is `goodwill`.
- **Why E2E:** four writers share the line-change endpoint. If an absent `no_charge` block were read as "clear", Edit Labor would silently un-mark the line (Appendix B risk 4). Only the real FE payload against the real BE shows it.

**Not E2E this phase** (Dev): S12-R10, S12-R12, S12-N1, S12-N2, S12-N4, S12-E1–E6, S12-E8. S12-E7 is Backlog #10 (Q35 ✓). Portal rendering is Phase 11.

### Phase 5

**Batch: 5 Create, at the cap.**

**5A `iwo-close.spec.ts`** — P4, admin
- **T1 (Happy path):** `NEW - Admin closes a complete internal work order from the header and sees the INTERNAL document`.
  - **PRD IDs:** S3-R1, S3-R2, S3-R3, S3-R5, S3-E4, S10-R3, S2-R9, S7-N1; D33.
  - **Steps:**
    1. On the WO header, `button_close_work_order_header` reads "Close Work Order" and `button_create_invoice_header` has count 0.
    2. Click it. `dialog_close_work_order` shows:
       - `input_close_work_order_posting_date` = today;
       - `text_close_stock_parts_amount` = cost × qty;
       - `row_close_labor` "Labor 2.5 h";
       - `row_close_shop_supplies` "Shop supplies $15.00";
       - `text_close_summary` "This marks the work order Closed · Internal. Parts cost, shop supplies and hours are available in the Internal Work Orders report."
    3. Click `button_confirm_close_work_order`.
  - **Expected:**
    - It lands on the Finance tab.
    - The header shows `badge_wo_status` "Closed", `badge_wo_classification` "Internal", and `text_wo_closed_on` "Closed on <date>. To change it, reopen it from the Finance tab."
    - The Finance preview shows the INTERNAL stamp, "Internal Work Order <header number>" (read from `text_wo_number`; compare UI text with UI text), "Category: General Internal", and a Summary with Parts cost, Shop supplies and Labor hours.
    - `customer_card_change_action` is rendered **and disabled**, with the tooltip "Reopen the work order to change the customer." (D33).
  - **Setup:** cached org at a location with no accounting integration. A flagged customer with Min $15. An internal WO driven to `complete` with a 2.5 h labor line and a picked costed stock part. `requireMileage`, `requireHours` and `requireTechStories` patched off.
- **T2 (Edge case):** `NEW - Close Work Order is offered only after a review-required internal work order is marked reviewed`.
  - **PRD IDs:** S3-R7, S3-N2.
  - **Steps:** a WO at `ready_for_review` → `button_close_work_order_header` has count 0 → Mark Reviewed.
  - **Expected:** the Close button appears.
  - **Setup:** `patchWorkOrderSettings({ requireReview: true }, { allowSweep: true })` in the isolated org, restored in `afterEach`.

**5B `iwo-close-original-required.spec.ts`** — P4, admin
- **T1 (Happy path):** `NEW - Admin closes an approved Warranty work order from the Finance tab: Close asks for the original work order, completes the work order and shows the NO CHARGE document`.
  - **PRD IDs:** S3-R1 (Finance), S3-R2 (original select, not-complete sentence), S3-R3 (completion first, D42), S3-R5, S2-R16, S2-R17; D23.
  - **Steps:**
    1. Finance tab → `button_close_work_order`.
    2. `banner_close_original_required` reads "Warranty requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView." `button_confirm_close_work_order` is disabled.
    3. Pick P in the original select (`select_<host>_original_work_order`, host suffix per FE-C). The button becomes enabled. Confirm.
  - **Expected:**
    - The header reads "Closed" with the "No Charge" badge.
    - The document shows the NO CHARGE stamp, "No Charge Work Order <n>" and "Category: Warranty · Original work order <P>", with P as a link to P.
    - `error_close_work_order_changed` never renders. If it did, the fingerprint would still include the line status the completion changed (D23).
  - **Setup:** a Warranty no-charge WO at `approved` with one authorized labor line (`woFactory.addLine({ status: 'authorized' })`) and no original. P is the customer's invoiced WO. Org gates off.
- **T2 (Edge case, same workflow):** `NEW - Close runs the Missing Details step first and its last button reads Close Work Order`.
  - **PRD IDs:** S3-R3; D42.
  - **Steps:** patch `requireMileage` and `requireHours` on, restored in `afterEach` → Finance → `button_close_work_order`.
  - **Expected:** the Missing Details step renders, its primary button reads "Close Work Order", and confirming it opens `dialog_close_work_order` instead of creating an invoice.

**5C `iwo-reopen.spec.ts`** — P4, admin, Happy path
- **Test:** `NEW - Admin reopens a closed No Charge work order, gets Change category back, and closes it again`.
- **PRD IDs:** S4-R1, S4-R2, S4-R3, S4-R4.
- **Steps:**
  1. Finance invoice menu: `menu_item_reopen_work_order` is shown; `menu_item_reverse` and Issue Credit have count 0.
  2. Open `dialog_reopen_work_order`. The body reads "The work order leaves Closed · No Charge and goes back to Complete. …" → "Reopen Work Order".
  3. Close again from the header with yesterday as the posting date.
- **Expected:**
  - After Reopen, `badge_wo_status` reads "Complete", `button_close_work_order_header` is back, and the menu offers `menu_item_change_no_charge_category` again.
  - After the second Close, the status reads "Closed" and `text_wo_closed_on` shows yesterday.
- **Setup:** a Goodwill WO closed with `woFactory.close` (NEW).

**5D `iwo-asset-invoices.spec.ts`** — P2, admin, Happy path
- **Test:** `NEW - Admin sees a closed internal work order on the asset's Invoices tab as Closed / No Charge, and not on the customer's Invoices tab`.
- **PRD IDs:** S3-R6, S9-R10; D37.
- **Steps:** open the asset → Invoices tab; then the customer → Invoices tab.
- **Expected:**
  - `cell_vehicle_invoice_status_<id>` reads "Closed", `badge_vehicle_invoice_classification_<id>` reads "Internal", `cell_vehicle_invoice_total_<id>` reads "No Charge", and Discount and Tax rate are empty.
  - The row is dated by the posting date.
  - The customer's Invoices tab does not list the record.
- **Setup:** closed through `woFactory.close`. Add the three cells to `VehiclePage` beside `INVOICE_COLUMNS`; the column list is unchanged (`asset-invoices-columns.spec.ts`).

**5E `iwo-document-pdf.spec.ts`** — P3, admin, Happy path
- **Test:** `NEW - Admin downloads the NO CHARGE document of a closed Warranty work order`.
- **PRD IDs:** S3-R5, S2-R16.
- **Steps:** Finance → `button_download_invoice`.
- **Expected:** the PDF text (read with `readPdfText`, `src/utils/pdf-download.helper.ts:77`):
  - contains "NO CHARGE", "No Charge Work Order <n>", "Category: Warranty · Original work order <P>", "Parts cost" and "Labor hours";
  - contains no "Balance due" and no total.
- **Why E2E:** it is the only path that exercises the WeasyPrint render (`coverage-policy.md` §5).

**Not E2E this phase:**
- Email with an empty recipient: Dev (fe-unit).
- Adding a line to a closed WO spawns a new one: Dev.
- Bulk-bar and menu Close: Backlog #7.
- The "Closed" Status option: Backlog #5.
- The technician role: Backlog #12.

### Phase 6

**Batch: 5 Create.** The category accounts round trip moved to the Phase 2C batch as 2C-B (D61), and the freed slot takes the vendor bill workflow (6F, formerly Backlog #2).

All five live in `e2e/tests/qb/`, run in the `quickbooks` project and are **on demand**: the project needs QBO OAuth tokens and is excluded from nightly CI.
- They use the persistent QuickBooks-connected org and the location "QA Testing" (pattern: `tests/qb/quickbooks-journal-entries.spec.ts:46-57`).
- `beforeAll`:
  - turns the setting on (N1 if it was never enabled, otherwise the generic save);
  - snapshots the four category rows, Inventory Asset, Cost of Parts and the Shop supplies item mapping with `bookkeeping-settings.factory.ts`.
- `afterAll`:
  - restores the rows;
  - **turns the setting off again** (D30 allows it; see R3);
  - reopens, then deletes, every work order it closed.
- The first-enable and first-close markers stay set in that org for good. So the report nav entry, the Technician Efficiency chip and the export option become permanently visible there. My scan found no spec that counts them.

| Spec | Test (type) | PRD | Steps → Expected | Pri | Setup |
|---|---|---|---|---|---|
| **6B** `tests/qb/iwo-qb-close-journal-entries.spec.ts` | `NEW - Closing an internal work order sends QuickBooks one inventory entry per stock part and the shop supplies entry, debiting the category's account` (Happy) | S7-R1, S7-R2, S7-R4a, S10-R4 | **Steps:** close through the UI.<br>**Expected (QBO API):**<ul><li>one JE per picked stock part, dated the posting date: debit General Internal's account, credit Inventory Asset, amount = cost;</li><li>each memo carries the WO number, "Internal" and "General Internal";</li><li>the Class is the location's, or none when the location has none;</li><li>one shop supplies JE: debit General Internal's account, credit the Shop supplies item's income account;</li><li>no QBO invoice for the WO number, and no QBO customer created for the internal customer.</li></ul> | P3 | existing parts/WO factories; NEW `findJournalEntriesByMemo` |
| **6C** `tests/qb/iwo-qb-reopen-reversal.spec.ts` | `NEW - Reopening a closed internal work order sends QuickBooks the reversal of exactly what Close posted, to the same accounts` (Happy) | S7-R5, S4-R3 | **Steps:** close (API) → remap General Internal from E1 to E2 → Reopen through the UI.<br>**Expected:** swapped JEs dated the reopen date, with memo "Reopened <n>", still on **E1** (the stored posted accounts, D6). | P3 | `woFactory.close` / `reopen` (NEW) |
| **6D** `tests/qb/iwo-qb-close-unmapped.spec.ts` | **T1** `NEW - With the Warranty row empty, Close warns and the entry posts to ShopView Review, never to another category's account` (Edge)<br>**T2** `NEW - With Inventory Asset unmapped, Close posts no parts entry, still posts shop supplies, and Reopen reverses nothing for parts` (Edge, same workflow) | T1: S3-N4, S7-N2, S5-R4, S5-E2<br>T2: S7-N5, S4-E1 (QuickBooks half); D35 | **T1** — Steps: General Internal mapped to E1, Warranty empty → close a Warranty WO.<br>Expected: `banner_close_no_account_quickbooks` reads "No account set for Warranty. The entry posts to the ShopView Review account until you set one." with `link_close_set_account_quickbooks`; after confirming, the JE debit is "ShopView Review", not E1.<br>**T2** — Steps: Inventory Asset unmapped → close → Reopen.<br>Expected: the stock parts and special orders rows read "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped."; QBO has no parts JE for the WO but has the shop supplies JE; Reopen sends a reversal for the shop supplies entry only. | P2 | `bookkeeping-settings.factory.ts` snapshot/restore in `afterEach` |
| **6E** `tests/qb/iwo-qb-no-charge-line-invoice.spec.ts` | `NEW - Invoicing a billable work order with a Warranty line sends the line at 0.00 with its category and posts the line's parts cost to the Warranty account` (Happy) | S7-R8, S12-R8, S12-R7 | **Steps:** Create invoice through the header.<br>**Expected:**<ul><li>the QBO invoice carries the Warranty line's items at 0.00 with "Warranty" in the description, and its total equals the billable line;</li><li>the JE of the Warranty line's picked part debits E3 (the Warranty account) with the usual credit;</li><li>the billable line's part JE debits Cost of Parts as today.</li></ul> | P3 | `woFactory.markLineNoCharge` with Not in ShopView (NEW); NEW `getInvoiceLines` |
| **6F** `tests/qb/iwo-qb-vendor-bill.spec.ts` | **T1** `NEW - A vendor bill for a special-order part on a Warranty work order posts the bill line to the Warranty account, not Cost of Parts` (Happy)<br>**T2** `NEW - A vendor bill for a special-order part on a Warranty line of a billable work order posts that line to the Warranty account; a line marked No Charge after its bill posted is reclassed to the Warranty account when the invoice is created` (Edge, same workflow) | T1: S7-R3<br>T2: S7-R8 (bills per line), S7-R4 per line; D7, D47 | **T1** — Steps: No Charge WO (Warranty, Not in ShopView) with a special-order part → receive it with a vendor bill (API).<br>Expected (QBO API): the bill's line for that part is on E3 (the Warranty account); vendor, bill total and Accounts Payable as the bill entered.<br>**T2** — Steps: billable WO with two special-order lines; line A marked No Charge (Warranty) before its bill, line B billed first and marked No Charge after → Create invoice through the header → the cost-move confirmation (`dialog_vendor_bill_cost_move`, Q62 ✓) lists "Moved from Cost of Parts to [Warranty account]" for line B → confirm.<br>Expected: line A's bill line is on E3; line B's bill line stays on Cost of Parts and, at invoicing, one reclass JE moves its cost from Cost of Parts to E3, dated the invoice date; the billable part of the WO posts as today. | P3 | NEW `receiveWithVendorBill` (parts/orders factory); NEW `findBillLinesByDocNumber`; `woFactory.markLineNoCharge` |

**Backlog from this phase:** none (former Backlog #2 is 6F).

### Phase 9

**Batch: 5 Create (3 main suite + 2 joint), at the cap.**

Start only once hub Release B (Phase 8) is deployed to the target environment and core 9b emits there.
- **9A–9C** are main-suite specs gated by `requireAccountingProjection()` (`src/utils/accounting-service.ts:110`) **and** `requireInternalWorkOrders()`, on the cached org onboarded to accounting (ground rules). They wait for the projection with the mechanism the `ibs-batch-*` specs use.
- **9D–9E** go in the local-only joint suite `e2e/joint/`, which has no `@C`/`@P` tags and no CI. Their TestRail cases stay Not Automated with a note pointing at the joint spec, and the PR records them through the override marker.

| Spec | Test (type) | PRD | Steps → Expected | Pri |
|---|---|---|---|---|
| **9A** `tests/ui/internal-work-orders/iwo-hub-category-mappings.spec.ts` | `NEW - Admin sees one Account Mappings row per category with the seeded accounts, a new category's empty row, and changes one` (Happy) | S6-R1, S6-R2 (new-workspace seeder), S6-R3; D49, D53 | **Steps:** Accounting > Settings > Account Mappings → create a No Charge category in core (factory) → reload → change "No Charge: Goodwill" to 6400 Shop Equipment Maintenance → Save → reload.<br>**Expected — under "Parts cost of goods sold":**<ul><li>`text_current_category_account_general_internal` reads "6500 Vehicle Expenses";</li><li>Warranty and Goodwill both read "6430 Warranty & Goodwill Expense";</li><li>Comeback reads "Comeback Expense", name only (HQ1 ✓).</li></ul>After the reload, a new empty row "No Charge: <name>" appears. After the change, 6400 persists across the reload. Restore it afterwards. | P3 |
| **9B** `…/iwo-hub-closed-record.spec.ts` | `NEW - Closing an internal work order creates a Closed record in AccountingHub Sales > Invoices` (Happy) | S8-R1, S8-R6 (Sales Invoices Status filter); D39 | **Steps:** close (API) → Accounting > Sales > Invoices; the Status filter offers **Closed** → open the record.<br>**Expected — the row:** the Closed pill, `badge_accounting_invoice_classification_<id>` "Internal", and total "No Charge".<br>**Expected — the record page:**<ul><li>a summary with the number, customer, asset, classification, category "General Internal", posting date, "No Charge", and the posted Parts cost and Shop supplies;</li><li>the journal entry section;</li><li>the "Open in ShopView" link;</li><li>**no** lines, no payment / credit memo / write-off tabs, and no Void.</li></ul> | P3 |
| **9C** `…/iwo-hub-no-charge-lines.spec.ts` | `NEW - An invoice with a Comeback line reaches AccountingHub as an ordinary invoice with a No Charge lines block` (Happy) | S8-R7, S12-R8 (hub half) | **Steps:** create the invoice (API) on a billable WO with a Comeback line (Not in ShopView) and a picked part → open the record.<br>**Expected:**<ul><li>revenue on the billable line only;</li><li>`table_accounting_invoice_no_charge_lines` has one row: line number and title, "Comeback", original "Not in ShopView", hours, parts cost, and expense account "Comeback Expense", posted.</li></ul>The Held variant is joint-only and depends on Q30 ✓. | P3 |
| **9D** `e2e/joint/tests/54-internal-work-order-close.spec.ts` | Close posts the parts cost and shop supplies to the category account and Reopen reverses them (Happy) | S8-R2, S8-R3, S8-R4, S10-R4 (hub) | **Steps:** `make dev-full` → Close → open the Journal Entries page → Reopen.<br>**Expected:**<ul><li>after Close: source "Internal work order", debit 6500, credit Inventory, on the posting date; the shop supplies entry debits 6500 and credits 5100 Shop Supplies COGS;</li><li>after Reopen: reversals linked, and the record Void.</li></ul> | — |
| **9E** `e2e/joint/tests/55-internal-work-order-held.spec.ts` | An empty category row holds the event; mapping it releases it (Edge) | S8-N2 (Q50 ✓ copy), S6-R4, S6-R1 (no fallback) | **Steps:** a shop-added No Charge category with an empty row → close a WO of it → Accounting Events → map the row.<br>**Expected:**<ul><li>after Close: an `event_held` row, and `text_hold_message_<id>` reads "No Charge: <name> row not mapped";</li><li>after mapping: the event posts automatically and the entry appears on the category's account.</li></ul> | — |

**Backlog from this phase:**
- The Close-dialog hub note (S3-N4 hub): Backlog #4.
- Reopen while the Close is Held leaves a Dismissed row, and per-work-order ordering (S4-E1 hub, S8-E2): joint 56, Backlog #3.

### Phase 10

**Batch: 1 Create.**

**10A `iwo-report.spec.ts`** — P3, admin
- **T1 (Happy path):** `NEW - The Internal Work Orders report lists a closed Warranty work order and a Comeback line of an invoiced work order with their category, original, cost and hours`.
  - **PRD IDs:** S9-R2 (By work order and line, summary strip, totals, Classification filter), S12-R11, S9-R11 (dating), S2-R17 (report).
  - **Steps:**
    1. Reports → `report_nav_internal_work_orders`, in the Performance group directly after Sales By Representative (D32) → `page_internal_work_orders_report`, tab `tab_iwo_by_line`, date filter narrowed to the two dates.
    2. Set the Classification filter to "No Charge line".
  - **Expected — `table_iwo_by_line`, before filtering:**
    - W1 row: Line "Whole work order", "No Charge", "Warranty", original WO link P, original technician T, the posting date, Parts cost $40.00, Shop supplies $10.00, Hours 1.5.
    - B1 row: line number and title, "No Charge line", "Comeback", Shop supplies empty, Parts cost $25.00, Hours 2.0.
    - One `card_iwo_summary_<categoryKey>` per category.
    - `row_iwo_totals` equals the sums.
  - **Expected — after filtering:** only B1 is listed.
- **T2 (Edge case):** `NEW - The report appears in the Reports list only after the organization's first Close`.
  - **PRD IDs:** S9-R4, S9-N1.
  - **Steps:** on a **pristine** org, `report_nav_internal_work_orders` has count 0 (precondition: another nav entry renders) → close a WO through the API → reload Reports.
  - **Expected:** the entry is visible. Closing, not a line invoice, keeps Q31 ✓ out of the assertion. It costs one org mint per run; move it to Backlog if the fixture can't make that cheap.
- **T3 (Edge case, same workflow):** `NEW - The By technician tab credits the comeback to the original line's technician and lists "Not in ShopView" work under Unassigned`.
  - **PRD IDs:** S9-R2 (By technician), S2-R17, S9-N3.
  - **Steps:** `tab_iwo_by_technician`.
  - **Expected — `table_iwo_by_technician`:**
    - T's row: Comeback lines 1; Completed lines 2 (T's completed lines with clocked time in the range); Comeback rate 50%; Redo hours and Redo parts cost equal to B1's line.
    - A row "Unassigned" holds the Not in ShopView line.
    - `text_iwo_by_technician_note` is shown.
    - Warranty lines counts W1 as one line (Q33 ✓).
  - **Why E2E:** the backend credits each comeback to the stored original technicians, and the FE renders N12's `technician: null` row as "Unassigned" (`tab=by_technician`, D60). Only the real pair shows the right rows.
- **Setup:**
  - Cached org (T1, T3).
  - W1: closed through `woFactory.close`, original P whose line has T in `assignedTechIds`.
  - B1: invoiced, with a Comeback line whose original is a line of T's; a third Comeback line with Not in ShopView.
  - Two completed lines with T's clocks in range (`hours.factory.ts` / `technician-task.factory.ts`).

**Not E2E this phase:** everything else in Story 9 is Dev (Dev-layer routing). The export is Backlog #11.

### Phases 7–8, 11 and 13: no core specs
- **Phases 7–8 (hub releases A and B):** none in core. They are covered by the hub's eight-step scenario test (Appendix C §6) and the joint rows of Phase 9.
- **Phase 11 (customer portal):** the portal is a third-party UI for this suite (`test-scope-rules.md` gate 5). S2-R11 (portal half), S2-E6, and S12-R4/S12-R7 (portal rendering) are covered by Appendix D's own tests and manual checklist item 12, as TestRail cases with `layer: manual` and a Deferred priority.
- **Phase 13 (release run):**
  - No new spec.
  - In the same PR that flips `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED` on staging (step 8), flip the stage value of capability `internalWorkOrders` to true, so the `@internalworkorder` specs run in the next nightly instead of skipping.
  - S13-R4 and S13-R5 are verified by the runbook (`--verify`), not by E2E.

---

### Reference breakage (`coverage-policy.md` §10 — mandatory, uncapped; fix in the phase that lands the change)

| # | Phase | Spec / page object | What breaks | Minimal fix |
|---|---|---|---|---|
| **R2** | 1 (read keys), 3 (the write accepts `internalWorkOrders`) | `src/api/factories/organization.factory.ts:333-336` `getWorkOrderSettings()` returns the raw `SettingDto`, and `:361-370` `setWorkOrderSettings()` POSTs it back. 35 files use the pair: 26 under `tests/ui/work-orders/`, 4 in `tests/ui/`, 2 in `tests/ui/administration/work-order-settings/`, 2 in `tests/ui/timeclock/`, 1 in `tests/dvi-v2/`. | The snapshot now carries `internalWorkOrders` plus six read-only keys, and the restore POSTs them. The extra keys are harmless: `ChangeSettingRequestDto` already ignores today's `id`/`organizationId`, and D30 passes an unchanged value. It **does** break when a snapshot carrying `internalWorkOrders: true` is restored after the setting went off on a gate-closed environment: a false→true change answers 409 `internal_work_orders_not_available`. That can happen in the shared QuickBooks org between the Phase 6 `beforeAll` and `afterAll`. | Project the snapshot onto the declared `WorkOrderSettings` keys inside `getWorkOrderSettings()` (a whitelist). One function; do it in the Phase 3 batch, which edits this factory anyway. |
| **R3** | 4 (conditional) | `tests/ui/work-orders/work-orders-toolbar-one-row.spec.ts:51-56`, `:101` (C724217 / C724218) | It asserts exactly four `filter_chip_*` chips, and the Classification chip renders whenever the setting is on (S2-R14). The `quickbooks` project shares `.auth/admin.json` (`playwright.config.ts:1126-1132`), so the QuickBooks specs turn the setting on in the same persistent org these specs read on QA. | Phase 6 `afterAll` turns the setting off again (ground rules). If that can't be guaranteed, the spec's `beforeEach` sets the setting off when it is on and restores it after. Record the dependency in the spec's header comment. |
| R4 | 4 (verify only) | `src/pages/work-orders/work-orders.page.ts:176-177` (`[data-cy='work-order-mobile-card']`, `[data-cy='work-order-customer']`) | FE-B4 edits `WorkOrderCardMobile.vue:26-31` (status label, badge, `badge_work_order_status`). | Keep every `data-cy` attribute when adding the test id. The implementer confirms it at the diff. |
| R1 (v0.17) | — | `tests/qb/quickbooks-customer.spec.ts`, `tests/ui/work-order-lines.spec.ts`, `tests/ui/finance.spec.ts`, `src/pages/work-orders/lines.page.ts` (the `'Review'` header reads) | — | **Closed:** under D29 the header keeps the backend labels and adds only "Closed". No edit. |

**Checked, no breakage** (the v0.21 changes you named, plus the touched shared components):
- **Setting rename:**
  - No e2e file references `noChargeWorkOrders`, `no_charge` or `internal_work_order` (grep: zero hits).
  - `settings-tab-inventory.spec.ts:74` counts only `input_require*` / `input_auto*`, and the S1-R1/R3/R4 copy has no `\bvin\b` or `\bmode\b` (`:85-94`).
  - **The v0.17 Update to C29276 is withdrawn.** The toggle renders only while `internalWorkOrdersAvailable` (D43). Adding it to `WorkOrderSettingsPage.TOGGLES_IN_DOM_ORDER` (`work-order-settings.page.ts:170-179`) would make C29276 fail on every gate-closed environment. 3A covers the toggle.
- **Warranty input removed from line writes (D57):**
  - `is_warranty` is still sent by `src/api/factories/work-order.factory.ts:565` (`isWarranty ?? false`), `src/utils/test-utils.ts:1477`, `src/api/factories/part-sale.factory.ts:424`, `src/api/fixtures/test-data.fixture.ts:3587,3786` (a read→write round trip), `tests/ui/active-timesheets.spec.ts:333` and `tests/api/deposits-api-contract.spec.ts:111`.
  - The value is always false or round-tripped, the backend now ignores it, and no spec passes `isWarranty: true` or asserts the flag.
  - The fixture's `lines/change` round trip sends no `no_charge` block, which means "unchanged". No edit.
- **Line row $0.00 and the new line menu item:**
  - No page object reads `line_rate_*`, `line_margin_*` or `line_total_cost_*`.
  - The `part_sell_price_*` / `part_total_sell_price_*` readers (`lines.page.ts:541-542, 2209, 2222`; `inline-part-entry.page.ts:1523, 1528`) only ever meet billable lines in today's specs.
  - `clickOnThreeDots()` (`lines.page.ts:1157-1165`) waits on the first `menu-item_*`, which tolerates `menu-item_mark_no_charge_<id>`.
  - Dialog checkboxes are located by aria-label (`new-work-order.dialog.ts:52`, `edit-line.dialog.ts:49`), so the new "No Charge" checkboxes don't collide.
- **Report nav:**
  - `report_nav_internal_work_orders` goes after `report_nav_sales_by_representative` (`ReportLeftMenuNav.vue:158`) and renders only after the first Close.
  - C30451 (`work-in-progress.spec.ts:1003-1022`) checks that WIP sits inside the Performance span and below four earlier entries.
  - `parts-velocity.spec.ts:547-548` and `inventory-value.spec.ts:564-567` read the Parts group span.
  - The permission specs reference only `report_nav_sales` and the AP/AR entries.
- **QuickBooks Accounts regrouping:** no spec or page object reads ShopView Accounts rows (zero hits for `quickbooks_option_`, `costOfParts`, `settings_group_account`, `bookkeeping/integration`). `tests/permissions/custom/settings-integrations-*.spec.ts` check page access only. Spec 2C-B now guards the order and the regroup (D61).
- **Account Mappings:** `joint/src/mappings.ts:366-389` reads `system_accounts` and PUTs `mappings`, so the additive `category_accounts` / `category_mappings` leave it alone. `tests/ui/accounting/settings-hub-navigation.spec.ts` asserts navigation only.
- **Status filter "Closed", Technician Efficiency chip, export option:**
  - No spec enumerates the status options: `src/utils/imported-status-filter.ts` targets one option, and `work-orders.page.ts:856-860` only counts > 0.
  - No spec counts the Technician Efficiency chips or the export checkboxes.
- **Edit Customer / Edit Asset touch-ups:**
  - `edit-customer.dialog.ts:138-170` finds the shop-supplies inputs by label, and `:64-73` finds state, country and tax by aria-label or role.
  - The header pencil already carries `data-test-id-suffix="edit_customer"` (`CustomerLeftSection.vue:27`), which `customer.page.ts:53` matches.
- **New Administration tab:** `tests/permissions/admin-page-visibility.spec.ts:104-131` checks a fixed list of named sections, and the new tab is not in it.
- **Asset Invoices tab:** `tests/ui/customers/asset-invoices-columns.spec.ts`. The columns are unchanged (S9-R10: columns are v1.1); only closed rows are added.

**Open items found by the scan (not spec edits):**
1. **FE↔BE contract drift: resolved by D60.** Appendix B §3 now uses Appendix A §4's paths, endpoint numbers, `category_key` and the flat `original_*` fields, and the factories follow the same contract.
2. **QuickBooks rows before the page that groups them: resolved by D61.** The backend adds the rows only where the release gate is open, and FE-K2 (the adapter peel and the page) ships in the same Phase 2C batch; 2C-B covers it.

### Backlog (beyond each phase's cap, or deferred)

Each Backlog row fails the advisory CI check for its phase's PR unless the PR ships with the override marker and keeps this table.

| Rank | Workflow | PRD | Why deferred | Suggested file |
|---|---|---|---|---|
| 1 | "Change where the cost is posted?" dialog before Convert, customer change or a line action, when a bill has posted | S2-R8 (Q62 ✓) | Phase 4 is at the cap; the posted-vendor-bill setup is heavy | `tests/ui/internal-work-orders/iwo-vendor-bill-cost-move.spec.ts` |
| 2 | _(moved into the Phase 6 batch as 6F)_ | S7-R3, S7-R8 (bills) | — | — |
| 3 | Reopen while the hub Close is Held leaves a Dismissed "Withdrawn: work order reopened" row; a new Close waits behind a held reversal | S4-E1 (hub), S8-E2, S4-R3 (order) | Phase 9 is at the cap; joint only | `e2e/joint/tests/56-internal-work-order-held-reopen.spec.ts` |
| 4 | Close confirmation shows the AccountingHub note for an empty category row | S3-N4 (hub) | Phase 9 is at the cap; mostly FE rendering of the N9 `accounting_hub` block | `tests/ui/internal-work-orders/iwo-hub-close-notes.spec.ts` |
| 5 | Status chip "Closed" on the All tab lists closed work orders; Invoiced/Paid don't match them | S2-R10 (Closed) | Phase 5 is at the cap | `…/iwo-list-closed-status.spec.ts` |
| 6 | Badge on Board, Tech View, schedule cards, global search and the customer/asset Work Orders tabs | S2-R10 | Phase 4 is at the cap; 4D guards the main read model; search needs the reindex | `…/iwo-badges-surfaces.spec.ts` |
| 7 | Close from the bulk bar and from the three-dots menu | S3-R1 (other entry points) | Phase 5 is at the cap | `…/iwo-close-entry-points.spec.ts` |
| 8 | Edit the shop supplies amount on an internal WO; locked after Close | S10-R2 (manual edit) | Phase 4 is at the cap | `…/iwo-shop-supplies-edit.spec.ts` |
| 9 | Archiving a customer's default category: the next internal WO resolves to the next category in line | S1-R16, S2-R1 | Phase 2C/4 caps; the resolver has a BE unit test | `…/iwo-category-archive-resolution.spec.ts` |
| 10 | Issue Credit on a no-charge line's parts at $0.00 | S12-E7 | Waiting on Q35 ✓ | `…/iwo-line-issue-credit.spec.ts` |
| 11 | Customer Invoice export with "Include internal and no-charge work orders"; report export CSV (open tab) and PDF | S9-R6, S9-R2 (export) | Phase 10 is kept to one workflow; file contents are BE functional; Q34 ✓ | `…/iwo-report-export.spec.ts` |
| 12 | Role gates: no Close, Reopen, Convert or Mark as No Charge without the atoms; category QuickBooks pickers read-only without 'Settings — Integrations' | S3-N3, S4-N1, S2-N2, S12-N4, S1-R14 | Dev-owned (`v-if` + server 403); promote if a regression bites | `tests/permissions/iwo-permissions.spec.ts` |

### Dev-layer and manual routing (gates 1–3 and 5; TestRail cases created with Test Layer = Dev or Manual, no Playwright spec)

Existing coverage is **none found** for every row: none of the planned test files exist yet. I checked `api/tests` and `app/src` by name. The planned owners are Appendix A/B per-phase paths.

| Scenario | PRD | Layer (gate) | Planned owner |
|---|---|---|---|
| "Do this later" saves the toggle on and flags nobody; the "No internal customer yet" hint; the second hint line variants (QuickBooks / hub / both / neither) | S1-R5, S1-R4, S1-R3 (line 2) | fe-unit (3) + be-functional (2) | `WorkOrderSettings.spec.ts`, `InternalWorkOrdersFirstEnableDialog.spec.ts`; `api/tests/Functional/Organization/Setting/EnableInternalWorkOrdersTest.php` |
| The modal flags without a customer atom; OK-only Make-internal dialog | S1-N2, S1-N6 | be-functional (2) / fe-unit (3) | `EnableInternalWorkOrdersTest.php`; `MakeInternalDialog.spec.ts`, `MakeInternalCandidatesTest.php` |
| Flag goes with a deleted customer; org-wide across locations | S1-E2, S1-E3 | be-functional (2) | `InternalFlagTest.php` |
| Default category not archivable; archive-impact counts; categories page notice and editable while off | S1-R13, S1-R16 | be-functional (2) + fe-unit (3) | `CategoryCrudTest.php`, `ArchiveCategoryDialog.spec.ts`, `InternalWorkOrderCategories.spec.ts` |
| Seeder, verifier, CLI per-org isolation, new-org subscriber, no customer flagged | S13-R1, S13-R2, S13-R6, S13-N1 | be-unit (1) + be-functional (2) | `StartingCategoriesSeederTest.php`, `CategorySeedVerifierTest.php`, `SeedStartingCategoriesOnOrganizationRegisteredTest.php`, `WorkOrderCategoryRowsTest.php` |
| Setting off: no badge, hint or checkbox in New WO; Convert to Billable and Change category still offered; permission-hidden actions | S2-N1, S2-N2 | fe-unit (3) + be-functional (2) | `WorkOrderDialog.spec.ts`, `WorkOrderNavBarMenu.spec.ts`; `ConvertToNoChargeTest.php` (auth matrix) |
| Canned/inspection/ShopCoach/copy de-pricing; split keeps classification; import; auto-apply skipped at creation; sell price never written; derived warranty flag | S2-E1, S2-E2, S2-E3, S2-E5, S2-R21, S2-R19, S2-R22 | be-functional (2) + fe-unit (3) | `SplitClassificationTest.php`, `NoAutoApplyOnInternalCreationTest.php`, `ReceiveSpecialOrderOnInternalWorkOrderTest.php`, `DerivedWarrantyFlagTest.php` (Q44 ✓), `MultiVendorReceiveModel.spec.ts` (Q48 ✓) |
| Pick, receive, clock-in and approval behave as billable; Send to Portal / IBS hidden | S2-R11 | be-functional (2) + fe-unit (3) | Appendix A Phase 4 regression lock; `InvoiceActionBar.spec.ts` |
| Core rows without amount; the wizard shows no core amount | S2-E7, S12-E3 | fe-unit (3) + be-functional (2) | `CompletionWizard.spec.ts`, `CoreChargeOnInternalWorkOrderTest.php` |
| Close skip list (no payment, customer transaction, portal, webhook); no parts → $0.00; parts with no cost; changed-after-open 409 inline; shop supplies row hidden at $0.00; a WO with no parts still posts shop supplies | S3-R4, S3-E1, S3-E2, S3-E5, S10-N1, S10-E2 | be-functional (2) + fe-unit (3) | `CloseWorkOrderTest.php`, `InvoiceWebhookDeliveryTest.php`, `ClosedInvoiceHiddenTest.php`; `CloseWorkOrderDialog.spec.ts` |
| Close and Reopen hidden without atoms | S3-N3, S4-N1 | fe-unit (3) + be-functional (2) | `useWorkOrderFinishAction.spec.ts`, `InvoiceActionBar.spec.ts` |
| Vendor bills untouched by Reopen; Reopen stays internal after unflag | S4-E3, S4-E4 | be-functional (2) | `ReopenWorkOrderTest.php` |
| QuickBooks rows hidden when not connected; no hint while off; idempotency, sync regardless of permission, nothing to post, credits follow the bill line; shop supplies item unmapped → Review; no new row | S5-N1, S5-R5, S7-R6, S7-R7, S7-N4, S7-E1, S7-R3a, S10-N2, S10-R5 | fe-unit (3) + be-functional (2) | `CategoryExpenseMappingPanel.spec.ts`, `QuickBooksMapping` spec; `CloseQuickBooksPostingTest.php` (QB fake) |
| Hub: replay, duplicate event, invoice-list default, not enabled, inactive account held, rollout migration and Comeback number | S8-R5, S8-E1, S8-N1, S6-N1, S6-E1, S13-R3, S13-E1 | hub Pest (2) / be-functional (2) | Appendix C B1–B8 and the scenario test (§6); `CloseEmitsAccountingEventsTest.php` |
| Money reports and dashboard exclude closed records and no-charge lines; Sales Tax / A/R / statements; Parts Velocity units; hours reports; WIP badge; Technician Efficiency chip; export option and the $0.00 line row; Customers Spending; report scope; reopen leaves the report; $0 invoices unchanged | S9-R1, S9-R3, S9-R5, S9-R6, S9-R7, S9-R8, S9-R9, S9-R11, S9-R12, S9-R13, S9-R15, S9-R16, S9-N3, S9-E1, S12-E5 | be-functional (2) + fe-unit (3) | `RevenueReportsExcludeClosedTest.php`, `RevenueReportsExcludeNoChargeLineTest.php`, `CustomersSpendingExcludesClosedTest.php` (Q46 ✓), `InternalWorkOrdersReportTest.php`, `CustomerInvoiceExportNonBillableTest.php`; `TechnicianEfficiency.spec.ts`, `ExportReportsDialog.spec.ts` |
| Shop supplies field hidden without See Financial Data; Min change leaves open WOs alone | S10-N3, S10-E1 | fe-unit (3) / be-unit (1) | `FinancialInfoCard.spec.ts`; `WorkOrderShopSuppliesCalculatorTest.php` |
| Line: all-lines hint and $0 invoice; chip without See Financial Data; setting off; whole non-billable WO; items hidden without the atom; split keeps the mark; customer change keeps the mark; archived category on the chip; part moves; declined/returned refusals; print chip | S12-R10, S12-R12, S12-N1, S12-N2, S12-N4, S12-E1, S12-E2, S12-E4, S12-E6, S12-E8 | fe-unit (3) + be-functional (2) | `MarkLineNoChargeDialog.spec.ts`, `WorkOrderLineContextMenuList.spec.ts`, `WorkOrderLineRow.spec.ts`, `buildPrintModel.spec.ts`; `MarkLineNoChargeTest.php`, `CreateInvoiceWithNoChargeLineTest.php` (Q37 ✓) |

| Manual (gate 5 or verify run) | PRD | Where |
|---|---|---|
| QBO closed period → QB Unexported row; reversal into a closed period | S3-E3, S7-N3, S4-E2 | manual checklist item 8 (books closed in the shared QBO sandbox) |
| QBO account deleted or inactive → inactive state and Unexported failures | S5-E1 | manual |
| Reclass at Close for a bill posted elsewhere; Mark as Exported, then Reopen | S7-R4, S7-E2 | manual checklist item 8; be-functional against the QB fake |
| Portal: no-charge estimate (no prices, stamp, category); $0.00 line on a billable estimate/invoice | S2-E6 (+ portal halves of S2-R11, S12-R4, S12-R7) | Appendix D; manual checklist item 12 |
| Rule zero: every report and card on the staging database before and after | S9-R14 | SV-12297 |
| Release run order, idempotency and the per-org verification | S13-R4, S13-R5 | Phase 13 runbook `--verify` |


## 8. Rollback Plan

- **Code:** every core phase sits behind the release gate (NFR-010) until launch, so rolling back a phase before launch is a plain revert. All schema changes are additive and defaulted; the previous image ignores the new columns and tables. Do not drop columns on rollback.
- **After launch, before any Close or line mark:** flip `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED` off (enabling refuses); organizations that already enabled keep the setting, so also deploy the previous image if behavior must stop.
- **After Closes or marks exist:** do **not** revert past Phase 1. A previous image would read `invoice.status = 'closed'` and zero-priced no-charge statements without their meaning. Fix forward. If urgent, Reopen / Reverse the affected work orders first (this reverses QuickBooks and hub entries), then revert.
- **Hub:** Release A is safe to keep; rolling back Release B after any Closed / Held / category row is written breaks the previous image (Appendix C §2) — fix forward. Core must lower `emitted-versions.json` back before any hub rollback, which is impossible once the new events exist; treat Phase 9b as one-way.
- **Release run:** the seed commands are idempotent and per-organization; a failed organization is rerun, never rolled back. Seeded categories and accounts are harmless while the setting is off.
- **Search:** the `work_orders` reindex is idempotent and can be re-run.

## 9. Performance & Security Considerations

### Performance
- **Classification filter on `work_order` (Phase 4):** one of the two busiest write tables. No standalone index on `classification` (~99% billable). The list chip rides the existing workplace/type/status composites as a residual predicate inside a tenant-scoped, paginated query. **Assumption** pending prod query Q21 (table sizes): if the Internal-only filter scans too much in large orgs, add `classification` as a trailing index column (one hand-written migration).
- **Money-report exclusion (Phases 1, 10):** two shared predicates (D58), expressed positively (`status IN (…)`, `no_charge_category_id IS NULL`), keep today's index usage; no new joins on the report queries.
- **Invoice create with no-charge lines (Phase 4B):** one extra column in the pricing read and one predicate in the snapshot; no per-line query; a billable invoice without marks runs byte-identical code paths' output.
- **Internal Work Orders report (Phase 10):** a UNION ALL of closed invoices and no-charge statements of revenue invoices, each joined once to company, category and original references; totals and the summary strip are one aggregate each over the same WHERE; by-technician reuses Technician Efficiency's Completed predicate (`work_order_line.end_date`, indexed) as its own DBAL query; runs on the report reader; 12-month cap; 10,000 rows per tab on export.
- **Close (Phase 5):** one transaction for the invoice + inventory relabel + cost entries; QuickBooks posting and the outbox work run after commit; the hub preview read is a bounded RPC in the preview only.
- **Make internal (Phase 3):** per-WO transactions, ≤ 500 per call with `remaining`; candidates 10 rows + counts; categories resolved with one batch read per call. **Assumption:** synchronous (D12), revisit with prod query Q20.
- **Categories (Phase 2C):** at most 100 rows per list; page counts are one grouped query per list; per-location QuickBooks options lazy per picker.
- **Search reindex:** a full `work_orders` reindex at launch (new `classification`/`displayStatus` fields). Run off-peak per environment.
- **Hub:** a Held event acknowledges its message, so the org's FIFO stream keeps flowing; per-work-order order uses the existing document lock seam keyed by work order and cycle; auto-release replays one work order's held entries in cycle order after the mapping save commits.

### Security
- Tenant scoping: categories, the customer flag and the setting are organization-scoped (`OrganizationDecorator`); work-order reads, Make internal, original candidates and the report are workplace-scoped through the user's accessible workplaces (`WorkplaceDecorator` / `ReportLocationsScopeResolverInterface`), never crossing into one the user cannot access — the inaccessible ones are only counted. Category keys from the client are always resolved within the organization; QuickBooks account writes check the workplace against the user's accessible, connected workplaces and take the realm from that workplace's own bookkeeping row.
- Server-side enforcement of every write in the permission matrix (403), including new authorization on Close (See Financial Data) and on the line `no_charge` block of line create/change.
- The hub mapping text and Close-preview hub block are read through core's system-token RPC client and returned only as labels/booleans (no hub data beyond that).
- The Open API create path (`processCreate()`, also used by the sandbox seeder) refuses internal/no-charge work orders inside the shared method.
- No Golden Rule exemptions are needed (Appendix A).

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1 | Phase 3 | API, App | Setting change handler + `SettingDto` (`internalWorkOrders*`, `internalWorkOrdersAvailable`, hint flags); `WorkOrderSettings.vue` | Planned |
| S1-R2 | Phase 3 | API, App | first-enable endpoint N1; first-enable modal; `WorkOrderSettings.vue` | Planned |
| S1-R3 | Phase 3 | API, App | Setting change handler + `SettingDto` (`internalWorkOrders*`, `internalWorkOrdersAvailable`, hint flags); `WorkOrderSettings.vue` | Planned |
| S1-R4 | Phase 3 | API, App | Setting change handler + `SettingDto` (`internalWorkOrders*`, `internalWorkOrdersAvailable`, hint flags); `WorkOrderSettings.vue` | Planned |
| S1-R5 | Phase 3 | API, App | first-enable endpoint N1; first-enable modal; `WorkOrderSettings.vue` | Planned |
| S1-R6 | Phase 3 | API, App | `Customer/Customers/Application/Change/*` (internal flag); `CustomerDialog.vue` (Remove-flag dialog) | Planned |
| S1-R7 | Phase 3 | API, App | `Company.php` (`internal`, `default_internal_category_id`); `CustomerDialog.vue` (checkbox + Default internal category) | Planned |
| S1-R8 | Phase 3 | API, App | customers list / header read models; customers list and header (Internal badge) | Planned |
| S1-R9 | Phase 3 | API, App | `Company.php` (`internal`, `default_internal_category_id`); `CustomerDialog.vue` (checkbox + Default internal category) | Planned |
| S1-R10 | Phase 3 | API, App | Setting change handler + `SettingDto` (`internalWorkOrders*`, `internalWorkOrdersAvailable`, hint flags); `WorkOrderSettings.vue` | Planned |
| S1-R11 | Phase 3 | API, App | N2–N4 Make internal (accessible workplaces, D36; ≤500 + `remaining`, D12); `MakeInternalDialog.vue` | Planned |
| S1-R12 | Phase 3 | API, App | `Customer/Customers/Application/Change/*` (internal flag); `CustomerDialog.vue` (Remove-flag dialog) | Planned |
| S1-R13 | Phase 2C | API, App | `VehicleService/WorkOrders/Domain/Category/*`, N13–N18; categories page + archive impact dialog | Planned |
| S1-R14 | Phase 2C | API, App | category dialog; N16/N17 + N19 per-location expense accounts; `work_order_category_quickbooks_account` | Planned |
| S1-R15 | Phase 3 | API, App | `Vehicle.php` `internal_category_id`, vehicle change handler; Edit Asset internal category select | Planned |
| S1-R16 | Phase 2C | API, App | `VehicleService/WorkOrders/Domain/Category/*`, N13–N18; categories page + archive impact dialog | Planned |
| S1-N1 | Phase 3 | API, App | Setting change handler + `SettingDto` (`internalWorkOrders*`, `internalWorkOrdersAvailable`, hint flags); `WorkOrderSettings.vue` | Planned |
| S1-N2 | Phase 3 | API, App | first-enable endpoint N1; first-enable modal; `WorkOrderSettings.vue` | Planned |
| S1-N6 | Phase 3 | API, App | N2–N4 Make internal (accessible workplaces, D36; ≤500 + `remaining`, D12); `MakeInternalDialog.vue` | Planned |
| S1-N3 | Phase 3 | API, App | `Company.php` (`internal`, `default_internal_category_id`); `CustomerDialog.vue` (checkbox + Default internal category) | Planned |
| S1-N4 | Phase 3 | API, App | `Company.php` (`internal`, `default_internal_category_id`); `CustomerDialog.vue` (checkbox + Default internal category) | Planned |
| S1-N5 | Phase 3 | API, App | `Customer/Customers/Application/Change/*` (internal flag); `CustomerDialog.vue` (Remove-flag dialog) | Planned |
| S1-E1 | Phase 3 | API, App | `Customer/Customers/Application/Change/*` (internal flag); `CustomerDialog.vue` (Remove-flag dialog) | Planned |
| S1-E2 | Phase 3 | API, App | `Company.php` (`internal`, `default_internal_category_id`); `CustomerDialog.vue` (checkbox + Default internal category) | Planned |
| S1-E3 | Phase 3 | API, App | Setting change handler + `SettingDto` (`internalWorkOrders*`, `internalWorkOrdersAvailable`, hint flags); `WorkOrderSettings.vue` | Planned |
| S1-E4 | Phase 3 | API, App | N2–N4 Make internal (accessible workplaces, D36; ≤500 + `remaining`, D12); `MakeInternalDialog.vue` | Planned |
| S2-R1 | Phase 4 | API, App | `WorkOrderClassificationResolver`, WO create handler, N20–N22; `WorkOrderDialog.vue` (badge + tooltip, No Charge + Category + Original selects) | Planned |
| S2-R2 | Phase 4 | API, App | `WorkOrderClassificationResolver`, WO create handler, N20–N22; `WorkOrderDialog.vue` (badge + tooltip, No Charge + Category + Original selects) | Planned |
| S2-R3 | Phase 4 | API, App | `OrderStatusCard.vue`, `OrderStatusCardMobile.vue` (badge, orange header) | Planned |
| S2-R4 | Phase 4 | API, App | `WorkOrderPricing.php` (read mask); lines table + `LineDialog.vue` / part dialogs (pricing mode `costOnly`); "No Charge" in the `Statistics.vue` total and `boardFields.ts` (v0.22) | Planned |
| S2-R5 | Phase 4 | API, App | `Application/Classification/*`, `WorkOrderClassificationChanger`, `WorkOrderBillablePricer` (D34); menu + Convert / Change category dialogs | Planned |
| S2-R6 | Phase 4 | API, App | `Application/Classification/*`, `WorkOrderClassificationChanger`, `WorkOrderBillablePricer` (D34); menu + Convert / Change category dialogs | Planned |
| S2-R7 | Phase 4 | API, App | `ChangeCustomer/ChangeCommandHandler.php` (D33), change-customer preview; change-customer dialog; `WorkOrderHistoryEvents` | Planned |
| S2-R8 | Phase 4, 4B | API, App | N8 vendor-bill-cost-moves (`line_id`, `moves[]`); `VendorBillCostMoveDialog` before Convert, a customer change and the line actions (menu and Edit Line, FE-L2) | Planned |
| S2-R9 | Phase 5 | API, App | `ChangeCustomer/ChangeCommandHandler.php` (409 `customer_change_locked`); `CustomerCard.vue` (disabled + tooltip); header "Closed on" line | Planned |
| S2-R10 | Phase 4 | API, App | list/board/search/schedule read models + `WorkOrderDocumentProvider.php`; `workOrderColumns.ts`, list row, Tech View, mobile card, board, schedule, search | Planned |
| S2-R11 | Phase 4, 11 | API, App | IBS / Send-to-Portal guards; estimate view DTO (`classification`, `no_charge_category`); portal estimate (Appendix D) | Planned |
| S2-R12 | — | — | Story 11, out of this plan | Out of scope |
| S2-R13 | Phase 4, 3, 5 | API, App | `ChangeCustomer/ChangeCommandHandler.php` (D33), change-customer preview; change-customer dialog; `WorkOrderHistoryEvents` | Planned |
| S2-R14 | Phase 4 | API, App | list/board/search/schedule read models + `WorkOrderDocumentProvider.php`; `workOrderColumns.ts`, list row, Tech View, mobile card, board, schedule, search | Planned |
| S2-R15 | Phase 4 | API, App | adjustment and deposit guards; menu (no Fee / Discount, no Add Deposit) | Planned |
| S2-R16 | Phase 4 | API, App | `WorkOrderClassificationResolver`, WO create handler, N20–N22; `WorkOrderDialog.vue` (badge + tooltip, No Charge + Category + Original selects) | Planned |
| S2-R17 | Phase 4 | API, App | `OriginalReferenceWriter`, `work_order_original_reference` + `_technician` (D55); "Original technician" line in the dialogs | Planned |
| S2-R18 | Phase 4 | API, App | `InternalNoteWriter` → `NoteCreator::createInternalSystemNote()` + `ClassificationChangedMetadata`; notes tab with linked numbers | Planned |
| S2-R19 | Phase 4 | API, App | `SellPriceWritePolicy` at the seven sell-price write sites; receive / vendor-invoice cost-only notices | Planned |
| S2-R20 | Phase 4 | API, App | `WorkOrderDepricer` (fixed price removal), line change command; fixed-price fields hidden in `LineDialog.vue` | Planned |
| S2-R21 | Phase 4 | API, App | `ApplyDefaultAdjustmentsOnWorkOrderCreatedSubscriber.php` early return | Planned |
| S2-R22 | Phase 4 | API, App | derived `is_warranty` in the classification and line services; line writers ignore input (D57); print chip | Planned |
| S2-N1 | Phase 4 | API, App | `WorkOrderClassificationResolver`, WO create handler, N20–N22; `WorkOrderDialog.vue` (badge + tooltip, No Charge + Category + Original selects) | Planned |
| S2-N2 | Phase 4 | API, App | `Application/Classification/*`, `WorkOrderClassificationChanger`, `WorkOrderBillablePricer` (D34); menu + Convert / Change category dialogs | Planned |
| S2-N3 | Phase 4 | API, App | `WorkOrderClassificationResolver`, WO create handler, N20–N22; `WorkOrderDialog.vue` (badge + tooltip, No Charge + Category + Original selects) | Planned |
| S2-N4 | Phase 4 | API, App | `Application/Classification/*`, `WorkOrderClassificationChanger`, `WorkOrderBillablePricer` (D34); menu + Convert / Change category dialogs | Planned |
| S2-N5 | Phase 4, 11 | API, App | adjustment and deposit guards; menu (no Fee / Discount, no Add Deposit) | Planned |
| S2-E1 | Phase 4 | API, App | canned-line / inspection / ShopCoach / copy line-create paths (prices dropped) | Planned |
| S2-E2 | Phase 4 | API, App | split service (classification, category, references; shop supplies 0) | Planned |
| S2-E3 | Phase 4 | API, App | none — `WorkOrderImportedFactory` has no caller (Appendix A corrections) | Planned |
| S2-E4 | Phase 4 | API, App | `Application/Classification/*`, `WorkOrderClassificationChanger`, `WorkOrderBillablePricer` (D34); menu + Convert / Change category dialogs | Planned |
| S2-E5 | Phase 4 | API, App | canned-line / inspection / ShopCoach / copy line-create paths (prices dropped) | Planned |
| S2-E6 | Phase 4, 11 | API, App | IBS / Send-to-Portal guards; estimate view DTO (`classification`, `no_charge_category`); portal estimate (Appendix D) | Planned |
| S2-E7 | Phase 4 | API, App | core rows in the price mask; `LinesStatsFetcher` `excludeCores` for the closed snapshot (Phase 5) and `no_charge_parts_cost`; N9 `stock_parts_core_cost` for the Close row (Q65 ✓); core bill line and core return routed to the category (Phase 6, D66) | Planned |
| S3-R1 | Phase 5 | API, App | `WorkOrder.vue` finish-action seam, `CompletionWizard.vue` (D42); N10 auth | Planned |
| S3-R2 | Phase 5 | API, App | N9 close-preview (rows incl. `stock_parts_core_cost`, original required, fingerprint D23); `CloseWorkOrderDialog.vue` | Planned |
| S3-R3 | Phase 5 | API, App | `CloseWorkOrder` handler (N10) composing the Phase 2 steps; `Line/Create/CreateCommandHandler.php` (spawn on closed) | Planned |
| S3-R4 | Phase 5, 11 | API, App | Close skip list; `ListingQueryHandler.php`, `OpenApiInvoiceQueryRepository.php`, portal invoice listing (D37) | Planned |
| S3-R5 | Phase 5 | API, App | invoice templates (INTERNAL / NO CHARGE stamp, category line); Finance tab document + Email | Planned |
| S3-R6 | Phase 5 | API, App | vehicle invoices read model; `VehicleInvoices.vue` | Planned |
| S3-R7 | Phase 5 | API, App | `WorkOrder.vue` finish-action seam, `CompletionWizard.vue` (D42); N10 auth | Planned |
| S3-N1 | Phase 5 | API, App | `WorkOrder.vue` finish-action seam, `CompletionWizard.vue` (D42); N10 auth | Planned |
| S3-N2 | Phase 5 | API, App | `WorkOrder.vue` finish-action seam, `CompletionWizard.vue` (D42); N10 auth | Planned |
| S3-N3 | Phase 5 | API, App | `WorkOrder.vue` finish-action seam, `CompletionWizard.vue` (D42); N10 auth | Planned |
| S3-N4 | Phase 6, 9 | API, App | N9 `quickbooks` + `accounting_hub` blocks (D26); `CloseWorkOrderDialog.vue` notes + Set account link | Planned |
| S3-N5 | Phase 5 | API, App | FE-C `useWorkOrderFinishAction` skips the `useCreateInvoiceGate` credit-hold refusal for Close (FE-only guard; N10 unchanged) | Planned |
| S3-E1 | Phase 5 | API, App | N9 close-preview (rows incl. `stock_parts_core_cost`, original required, fingerprint D23); `CloseWorkOrderDialog.vue` | Planned |
| S3-E2 | Phase 5 | API, App | N9 close-preview (rows incl. `stock_parts_core_cost`, original required, fingerprint D23); `CloseWorkOrderDialog.vue` | Planned |
| S3-E3 | Phase 5, 6, 8 | API, App | Close never blocked; QuickBooks rejection → QB Unexported (Phase 6); hub Held (Phase 8) | Planned |
| S3-E4 | Phase 5 | API, App | N9 close-preview (rows incl. `stock_parts_core_cost`, original required, fingerprint D23); `CloseWorkOrderDialog.vue` | Planned |
| S3-E5 | Phase 5 | API, App | N9 close-preview (rows incl. `stock_parts_core_cost`, original required, fingerprint D23); `CloseWorkOrderDialog.vue` | Planned |
| S4-R1 | Phase 5 | API, App | Finance tab invoice menu (Reopen Work Order) + dialog; N11 `ROLE_WORK_ORDER_DELETE` | Planned |
| S4-R2 | Phase 5 | API, App | Finance tab invoice menu (Reopen Work Order) + dialog; N11 `ROLE_WORK_ORDER_DELETE` | Planned |
| S4-R3 | Phase 5, 6, 8 | API, App | `InvoiceReversalService::reverseClosed()` (cycle + 1, D51); cost-entry reversals (Phase 6); outbox reversal + hub cycle order (Phases 8–9) | Planned |
| S4-R4 | Phase 5 | API, App | `InvoiceReversalService::reverseClosed()` (cycle + 1, D51); cost-entry reversals (Phase 6); outbox reversal + hub cycle order (Phases 8–9) | Planned |
| S4-N1 | Phase 5 | API, App | Finance tab invoice menu (Reopen Work Order) + dialog; N11 `ROLE_WORK_ORDER_DELETE` | Planned |
| S4-N2 | Phase 5 | API, App | Finance tab invoice menu (Reopen Work Order) + dialog; N11 `ROLE_WORK_ORDER_DELETE` | Planned |
| S4-E1 | Phase 5, 6, 8 | API, App | QuickBooks reversal of posted entries only + withdrawn QB Unexported row (D38); hub withdraw → Dismissed (B5) | Planned |
| S4-E2 | Phase 5, 6, 8 | API, App | QuickBooks reversal → QB Unexported on closed period; hub Held reason | Planned |
| S4-E3 | Phase 5 | API, App | `InvoiceReversalService::reverseClosed()` (cycle + 1, D51); cost-entry reversals (Phase 6); outbox reversal + hub cycle order (Phases 8–9) | Planned |
| S4-E4 | Phase 5 | API, App | `InvoiceReversalService::reverseClosed()` (cycle + 1, D51); cost-entry reversals (Phase 6); outbox reversal + hub cycle order (Phases 8–9) | Planned |
| S5-R1 | Phase 2C, 6 | API, App | `SettingsHydrator.php` category rows (virtual, D54) via `IntegrationCommandHandler`, `work_order_category_quickbooks_account`; FE-K2 `CategoryExpenseMappingPanel.vue`, `QuickBooksMapping.vue` (two headers, expense pickers D46) | Planned |
| S5-R2 | Phase 2C, 6 | API, App | FE-K2 `QuickBooksMapping.vue` same picker, `accountTypeFilterFor` (D46, Q52 ✓); N19 for the category dialog | Planned |
| S5-R3 | Phase 2C, 6 | API, App | `SettingsHydrator.php` category rows (virtual, D54) via `IntegrationCommandHandler`, `work_order_category_quickbooks_account`; FE-K2 `CategoryExpenseMappingPanel.vue`, `QuickBooksMapping.vue` (two headers, expense pickers D46) | Planned |
| S5-R4 | Phase 2C, 6 | API, App | `SettingsHydrator.php` category rows (virtual, D54) via `IntegrationCommandHandler`, `work_order_category_quickbooks_account`; FE-K2 `CategoryExpenseMappingPanel.vue`, `QuickBooksMapping.vue` (two headers, expense pickers D46) | Planned |
| S5-R5 | Phase 2C, 6 | API, App | `SettingsHydrator.php` category rows (virtual, D54) via `IntegrationCommandHandler`, `work_order_category_quickbooks_account`; FE-K2 `CategoryExpenseMappingPanel.vue`, `QuickBooksMapping.vue` (two headers, expense pickers D46) | Planned |
| S5-R6 | Phase 2C, 6 | API, App | `SettingsHydrator.php` category rows (virtual, D54) via `IntegrationCommandHandler`, `work_order_category_quickbooks_account`; FE-K2 `CategoryExpenseMappingPanel.vue`, `QuickBooksMapping.vue` (two headers, expense pickers D46) | Planned |
| S5-N1 | Phase 2C, 6 | API, App | `IntegrationCommandHandler` no-auth / not-connected branches (rows follow the rest of ShopView Accounts) | Planned |
| S5-N2 | Phase 2C, 6 | API, App | existing page permission (Settings — Integrations); MANAGE_ACCOUNTS on N15/N16 accounts | Planned |
| S5-E1 | Phase 2C, 6 | API, App | row verdicts through `MappedQuickBooksReferences::ofSettings()`; failures to QB Unexported (Phase 6) | Planned |
| S5-E2 | Phase 6 | API, App | `FallbackAccountResolver::resolveCategoryExpense()` (category, else ShopView Review; no fallback between rows) | Planned |
| S6-R1 | Phase 8, 9 | Hub, App | hub category catalog + mapping rows inside `/system-accounts` (D53); core port `AccountingSystemAccounts.vue` | Planned |
| S6-R2 | Phase 8, 13 | Hub, App | hub seeding operator command + new-workspace seeder (6500 / 6430 / 6440 Comeback Expense; suitability, free number, legacy 6430 — D40) | Planned |
| S6-R3 | Phase 8, 9 | Hub, App | hub category catalog + mapping rows inside `/system-accounts` (D53); core port `AccountingSystemAccounts.vue` | Planned |
| S6-R4 | Phase 8, 9 | Hub, App | hub auto-release on mapping save / period open, in cycle order (B4) | Planned |
| S6-N1 | Phase 8, 9 | Hub, App | hub category catalog + mapping rows inside `/system-accounts` (D53); core port `AccountingSystemAccounts.vue` | Planned |
| S6-N2 | Phase 8, 9 | Hub, App | hub category catalog + mapping rows inside `/system-accounts` (D53); core port `AccountingSystemAccounts.vue` | Planned |
| S6-E1 | Phase 8, 9 | Hub, App | hub auto-release on mapping save / period open, in cycle order (B4) | Planned |
| S7-R1 | Phase 6 | API | Phase 5 `CloseWorkOrder` handler (no QuickBooks invoice or customer sync); Phase 6 `CostEntryPlanner` + `JournalEntrySyncService` (the entries) | Planned |
| S7-R2 | Phase 6 | API | `JournalEntrySyncService.php` (category debit, Class from location, memo), `CostJournalEntrySyncService`, `bookkeeping_journal_entry` + `bookkeeping_cost_journal_entry` (D6) | Planned |
| S7-R3 | Phase 6 | API | `PerLineCogsAccountResolver.php`, `line_account_ids` (D7); `CostEntryPlanner` reclass / billable-back (D47) | Planned |
| S7-R3a | Phase 6 | API | `VendorCreditSyncService` (the `vendor_return_item` stamp, `bookkeeping_vendor_credit.line_account_ids`); `credit_reclass` / `credit_back` at Close or invoicing (D14 amended); hub `vendor_credit_created` v4 | Planned |
| S7-R4 | Phase 6 | API | `PerLineCogsAccountResolver.php`, `line_account_ids` (D7); `CostEntryPlanner` reclass / billable-back (D47) | Planned |
| S7-R4a | Phase 6 | API | `JournalEntrySyncService.php` (category debit, Class from location, memo), `CostJournalEntrySyncService`, `bookkeeping_journal_entry` + `bookkeeping_cost_journal_entry` (D6) | Planned |
| S7-R5 | Phase 6 | API | reversals of posted entries from the stored accounts (D6, D38) | Planned |
| S7-R6 | Phase 6 | API | `JournalEntrySyncService.php` (category debit, Class from location, memo), `CostJournalEntrySyncService`, `bookkeeping_journal_entry` + `bookkeeping_cost_journal_entry` (D6) | Planned |
| S7-R7 | Phase 6 | API | `JournalEntrySyncService.php` (category debit, Class from location, memo), `CostJournalEntrySyncService`, `bookkeeping_journal_entry` + `bookkeeping_cost_journal_entry` (D6) | Planned |
| S7-R8 | Phase 6 | API, App | no-charge line: QuickBooks invoice line at 0.00 (`InvoiceData.php`), line JEs to the category account, bills per line, reclass at invoicing; N8 `moment=invoiced` `moves[]` + the Create invoice confirmation in `WorkOrder.vue runCreateInvoice()` (FE-D) | Planned |
| S7-N1 | Phase 5, 6 | API | sync gate (QuickBooks not connected → nothing) | Planned |
| S7-N2 | Phase 6 | API | `FallbackAccountResolver` → ShopView Review | Planned |
| S7-N3 | Phase 6 | API | QB Unexported read model (WO number, classification, category); S7-N3 type subgroups on the stock-part and cost-entry JEs | Planned |
| S7-N4 | Phase 6 | API | `JournalEntrySyncService.php` (category debit, Class from location, memo), `CostJournalEntrySyncService`, `bookkeeping_journal_entry` + `bookkeeping_cost_journal_entry` (D6) | Planned |
| S7-N5 | Phase 6 | API | `BookkeepingService` two-account origin (D35); `CloseWorkOrderDialog.vue` S7-N5 note | Planned |
| S7-E1 | Phase 6 | API | `JournalEntrySyncService.php` (category debit, Class from location, memo), `CostJournalEntrySyncService`, `bookkeeping_journal_entry` + `bookkeeping_cost_journal_entry` (D6) | Planned |
| S7-E2 | Phase 6 | API | reversals of posted entries from the stored accounts (D6, D38) | Planned |
| S8-R1 | Phase 8, 9 | Hub, API, App | hub `InvoiceCreatedProcessor` v4 Closed path + read side (D39); core `InvoiceCreatedPayloadBuilder` v4 (D48); port invoices list / record page / Invoice List filter | Planned |
| S8-R2 | Phase 8, 9 | Hub, API, App | core `JournalEntryRequestedPayloadBuilder` v3 family block (D47); hub cost-entry posting by category key | Planned |
| S8-R3 | Phase 8, 9 | Hub, API, App | core `VendorBillCreatedPayloadBuilder` v4 / `vendor_bill_updated` v3 and `VendorCreditCreatedPayloadBuilder` v4 (per-item category from the routing stamp); hub B2b with the HQ8 lifecycle and the Held move's source link on Accounting Events (D70); JE v3 reclass kinds for S7-R4 moves (D14 amended) | Planned |
| S8-R4 | Phase 8, 9 | Hub, API, App | core `JournalEntryRequestedPayloadBuilder` v3 family block (D47); hub cost-entry posting by category key | Planned |
| S8-R5 | Phase 8, 9 | Hub, API, App | hub `InvoiceCreatedProcessor` v4 Closed path + read side (D39); core `InvoiceCreatedPayloadBuilder` v4 (D48); port invoices list / record page / Invoice List filter | Planned |
| S8-R6 | Phase 8, 9 | Hub, API, App | hub `InvoiceCreatedProcessor` v4 Closed path + read side (D39); core `InvoiceCreatedPayloadBuilder` v4 (D48); port invoices list / record page / Invoice List filter | Planned |
| S8-R7 | Phase 8, 9 | Hub, API, App | core v4 `no_charge_lines[]` + line JEs; hub No Charge lines block, split posting, Held per line entry (Q30 ✓); port block | Planned |
| S8-N1 | Phase 8, 9 | Hub, API, App | outbox gate (hub not enabled → nothing) | Planned |
| S8-N2 | Phase 8, 9 | Hub, API, App | hub Held + reasons (Q50 ✓), Dismissed on withdraw, cycle order; port accounting events page | Planned |
| S8-E1 | Phase 8, 9 | Hub, API, App | hub `ProcessedEventLedger` (tests) | Planned |
| S8-E2 | Phase 8, 9 | Hub, API, App | hub Held + reasons (Q50 ✓), Dismissed on withdraw, cycle order; port accounting events page | Planned |
| S9-R1 | Phase 10 | API, App | `RevenueInvoicePredicate` / `NoChargeLinePredicate` at every consumer (D58), `CustomersSpendingQueryHandler.php`; rule-zero byte-compare tests (SV-12297) | Planned |
| S9-R2 | Phase 10 | API, App | `Reporting/Reports/.../InternalWorkOrders*` (N12, both tabs, summary, export); report page, `ReportLeftMenuNav.vue` | Planned |
| S9-R3 | Phase 10 | API, App | Technician Efficiency providers (`internal_work_orders` param, D56; no-charge line hours); TE page chip + dashboard card | Planned |
| S9-R4 | Phase 4B, 5, 10 | API, App | first-close marker `internalWorkOrdersFirstClosedAt` set at Close (Phase 5) and at the first invoice with a no-charge line (Phase 4B, Q31 ✓; D8); report nav entry (Phase 10) | Planned |
| S9-R5 | Phase 10 | API, App | `RevenueInvoicePredicate` / `NoChargeLinePredicate` at every consumer (D58), `CustomersSpendingQueryHandler.php`; rule-zero byte-compare tests (SV-12297) | Planned |
| S9-R6 | Phase 10 | API, App | `InvoiceGenerator.php` (closed exclusion + opt-in; no-charge line 0.00 row); Export Reports dialog option | Planned |
| S9-R7 | Phase 10 | API, App | Parts Velocity fetcher (units vs revenue, lines included) | Planned |
| S9-R8 | Phase 10 | API, App | Shop Efficiency (no-charge line estimated hours out of invoiced hours); timesheet reports unchanged | Planned |
| S9-R9 | Phase 10 | API, App | WIP read model (badge, no value) | Planned |
| S9-R10 | Phase 5, 10 | API, App | vehicle invoices read model; `VehicleInvoices.vue` | Planned |
| S9-R11 | Phase 10 | API, App | Technician Efficiency providers (`internal_work_orders` param, D56; no-charge line hours); TE page chip + dashboard card | Planned |
| S9-R12 | Phase 10 | API, App | `RevenueInvoicePredicate` / `NoChargeLinePredicate` at every consumer (D58), `CustomersSpendingQueryHandler.php`; rule-zero byte-compare tests (SV-12297) | Planned |
| S9-R13 | Phase 10 | API, App | `InvoiceGenerator.php` (closed exclusion + opt-in; no-charge line 0.00 row); Export Reports dialog option | Planned |
| S9-R14 | Phase 1, 10 | API, App | shared predicates wired in Phase 1 as no-ops (D58); byte-compare tests; Product verify ticket SV-12297 | Planned |
| S9-R15 | Phase 10 | API, App | `RevenueInvoicePredicate` / `NoChargeLinePredicate` at every consumer (D58), `CustomersSpendingQueryHandler.php`; rule-zero byte-compare tests (SV-12297) | Planned |
| S9-R16 | Phase 10 | API, App | `Reporting/Reports/.../InternalWorkOrders*` (N12, both tabs, summary, export); report page, `ReportLeftMenuNav.vue` | Planned |
| S9-N1 | Phase 10 | API, App | `Reporting/Reports/.../InternalWorkOrders*` (N12, both tabs, summary, export); report page, `ReportLeftMenuNav.vue` | Planned |
| S9-N2 | Phase 10 | API, App | `Reporting/Reports/.../InternalWorkOrders*` (N12, both tabs, summary, export); report page, `ReportLeftMenuNav.vue` | Planned |
| S9-N3 | Phase 10 | API, App | `Reporting/Reports/.../InternalWorkOrders*` (N12, both tabs, summary, export); report page, `ReportLeftMenuNav.vue` | Planned |
| S9-E1 | Phase 10 | API, App | `Reporting/Reports/.../InternalWorkOrders*` (N12, both tabs, summary, export); report page, `ReportLeftMenuNav.vue` | Planned |
| S9-E2 | Phase 10 | API, App | `RevenueInvoicePredicate` / `NoChargeLinePredicate` at every consumer (D58), `CustomersSpendingQueryHandler.php`; rule-zero byte-compare tests (SV-12297) | Planned |
| S10-R1 | Phase 4, 3 | API, App | `WorkOrderShopSuppliesCalculator.php` first step, `ChangeShopSuppliesCharge` lock; `FinancialInfoCard.vue`; Min without % on flagged customers (D41) | Planned |
| S10-R2 | Phase 4 | API, App | `WorkOrderShopSuppliesCalculator.php` first step, `ChangeShopSuppliesCharge` lock; `FinancialInfoCard.vue`; Min without % on flagged customers (D41) | Planned |
| S10-R3 | Phase 5 | API, App | N9 `shop_supplies_amount`; `CloseWorkOrderDialog.vue` row | Planned |
| S10-R4 | Phase 6, 9 | API, App | shop-supplies cost entry → QuickBooks JE and hub JE v3 | Planned |
| S10-R5 | Phase 6, 8 | API, App | none — no new mapping row (QuickBooks credits the Shop supplies item's income account; hub its Shop supplies expense row) | Planned |
| S10-N1 | Phase 4, 5 | API, App | N9 `shop_supplies_amount`; `CloseWorkOrderDialog.vue` row | Planned |
| S10-N2 | Phase 6, 8 | API, App | shop-supplies cost entry → QuickBooks JE and hub JE v3 | Planned |
| S10-N3 | Phase 4 | API, App | `WorkOrderShopSuppliesCalculator.php` first step, `ChangeShopSuppliesCharge` lock; `FinancialInfoCard.vue`; Min without % on flagged customers (D41) | Planned |
| S10-E1 | Phase 4 | API, App | `WorkOrderShopSuppliesCalculator.php` first step, `ChangeShopSuppliesCharge` lock; `FinancialInfoCard.vue`; Min without % on flagged customers (D41) | Planned |
| S10-E2 | Phase 4, 5 | API, App | Close posts shop supplies with no parts or labor: `CostEntryPlanner` `shop_supplies` (Phase 6), Close dialog row (Phase 5) | Planned |
| S11-R1 | — | — | Story 11, out of this plan | Out of scope |
| S11-R2 | — | — | Story 11, out of this plan; its core-release half is built in Phase 5 (closed records out of the Open API invoice lists; the work order reads invoiced there until Story 11, pinned by `OpenApiClosedWorkOrderTest`) | Out of scope |
| S11-R3 | — | — | Story 11, out of this plan; its core-release half is built in Phase 5 (no invoice.created / invoice.paid webhooks for a closed record) | Out of scope |
| S11-R4 | — | — | Story 11, out of this plan; the POST refusal for a non-billable work order is built in Phase 2/5 (D4) | Out of scope |
| S11-R5 | — | — | Story 11, out of this plan | Out of scope |
| S11-N1 | — | — | Story 11, out of this plan | Out of scope |
| S11-N2 | — | — | Story 11, out of this plan | Out of scope |
| S11-E1 | — | — | Story 11, out of this plan | Out of scope |
| S11-E2 | — | — | Story 11, out of this plan | Out of scope |
| S12-R1 | Phase 4B | API, App, Portal | `LineNoChargeMarker`, N23–N26, line create/change `no_charge` block (D57); line menu + dialogs + Edit Line block | Planned |
| S12-R2 | Phase 4B | API, App, Portal | `LineNoChargeMarker`, N23–N26, line create/change `no_charge` block (D57); line menu + dialogs + Edit Line block | Planned |
| S12-R3 | Phase 4B | API, App, Portal | line pricing mask; `WorkOrderLineRow.vue` chip + $0.00, Tech View, mobile, print | Planned |
| S12-R4 | Phase 4B, 11 | API, App, Portal | pricing on billable lines, deposit preview; deposit message (Q49 ✓); portal live state on open (Appendix D P4, Q54 ✓) | Planned |
| S12-R5 | Phase 4B | API, App, Portal | `LineNoChargeMarker`, N23–N26, line create/change `no_charge` block (D57); line menu + dialogs + Edit Line block | Planned |
| S12-R6 | Phase 4B | API, App, Portal | `LineNoChargeMarker`, N23–N26, line create/change `no_charge` block (D57); line menu + dialogs + Edit Line block | Planned |
| S12-R7 | Phase 4B, 5, 11 | API, App, Portal | `InvoiceBuilder.php` statement flag + `no_charge_*` (D5); documents; portal invoice (Appendix D) | Planned |
| S12-R8 | Phase 6, 9 | API, App, Portal | QuickBooks (S7-R8) and hub (S8-R7) posting at invoice creation; reversal reverses all | Planned |
| S12-R9 | Phase 4B | API, App, Portal | `InvoiceIssuanceEligibility` 409 `no_charge_line_original_required`; `WorkOrder.vue` opens Edit Line on the line | Planned |
| S12-R10 | Phase 4B | API, App, Portal | N23 preview all-lines flag; Mark dialog hint; $0 invoice auto-paid as today | Planned |
| S12-R11 | Phase 10 | API, App, Portal | reports per Story 9 (line predicate, report line leg, TE hours) | Planned |
| S12-R12 | Phase 4B | API, App, Portal | `LineNoChargeMarker`, N23–N26, line create/change `no_charge` block (D57); line menu + dialogs + Edit Line block | Planned |
| S12-N1 | Phase 4B | API, App, Portal | marker refusals and menu gating (setting off, whole non-billable WO, invoiced "Reverse the invoice first.", no See Financial Data) | Planned |
| S12-N2 | Phase 4B | API, App, Portal | marker refusals and menu gating (setting off, whole non-billable WO, invoiced "Reverse the invoice first.", no See Financial Data) | Planned |
| S12-N3 | Phase 4B | API, App, Portal | marker refusals and menu gating (setting off, whole non-billable WO, invoiced "Reverse the invoice first.", no See Financial Data) | Planned |
| S12-N4 | Phase 4B | API, App, Portal | marker refusals and menu gating (setting off, whole non-billable WO, invoiced "Reverse the invoice first.", no See Financial Data) | Planned |
| S12-E1 | Phase 4B | API, App, Portal | split keeps the line mark + note on both WOs | Planned |
| S12-E2 | Phase 4B | API, App, Portal | customer change keeps line marks; original candidates follow the new customer | Planned |
| S12-E3 | Phase 4B | API, App, Portal | core rows in the price mask (no customer charge on NOT OK); core cost posts with the stock pick and the core bill line (D66); `WorkOrderBillablePricer` prices the core on Mark as Billable | Planned |
| S12-E4 | Phase 4B | API, App, Portal | archived category stays on the line; selects offer active only | Planned |
| S12-E5 | Phase 4B, 10 | API, App, Portal | original reference keeps the number as text when the original WO is deleted | Planned |
| S12-E6 | Phase 4B | API, App, Portal | `MovePartToLineCommandHandler.php` prices by the destination line | Planned |
| S12-E7 | Phase 4B | API, App, Portal | credit memo path for a no-charge line's part (Q35 ✓): $0.00 amount and 422 `restocking_fee_not_allowed` server-side, fee disabled in `PartsReturnPicker.vue`; no credit blocks a reversal | Planned |
| S12-E8 | Phase 4B | API, App, Portal | marker refusals (declined, returned/credited, whole non-billable); board/list stored totals; print chip; archived category on Reopen/Close | Planned |
| S13-R1 | Phase 2C, 13 | API, Hub, Ops | core `app:work-order-categories:seed` + `--verify` + new-org subscriber; virtual QuickBooks rows (D54) | Planned |
| S13-R2 | Phase 2C, 13 | API, Hub, Ops | core `app:work-order-categories:seed` + `--verify` + new-org subscriber; virtual QuickBooks rows (D54) | Planned |
| S13-R3 | Phase 8, 13 | API, Hub, Ops | hub `accounting:seed-work-order-categories` + `--verify`, run after the hub release and again at launch (D40) | Planned |
| S13-R4 | Phase 2C, 13 | API, Hub, Ops | idempotent seeder (Phase 2C) and the release-run order: categories, QuickBooks rows, hub seeding (Phase 13 runbook) | Planned |
| S13-R5 | Phase 2C, 13 | API, Hub, Ops | release runbook: verify, rule-zero (SV-12297), reindex, flip the switch (Phase 13) | Planned |
| S13-R6 | Phase 2C, 13 | API, Hub, Ops | seeder flags no customer and converts no work order (`StartingCategoriesSeederTest`) | Planned |
| S13-E1 | Phase 13 | API, Hub, Ops | hub `accounting:seed-work-order-categories` + `--verify`, run after the hub release and again at launch (D40) | Planned |
| S13-E2 | Phase 2C, 13 | API, Hub, Ops | core `app:work-order-categories:seed` + `--verify` + new-org subscriber; virtual QuickBooks rows (D54) | Planned |
| S13-N1 | Phase 2C, 13 | API, Hub, Ops | seed commands: per-organization isolation, failure list, rerun | Planned |
| NFR-001 | Phase 1–11 | API, App, Hub, Portal | every new controller `#[IsGranted]`, 403 on every write; voters per atom | Planned |
| NFR-002 | Phase 10 | API, App | `InternalWorkOrders*` report, `ReportListRequestDto`, `ExportRowCapGuard`, report reader | Planned |
| NFR-003 | Phase 6 | API | `bookkeeping_journal_entry` (+ accounts), `bookkeeping_cost_journal_entry`, `work_order_cost_entry` | Planned |
| NFR-004 | Phase 7, 8, 9 | API, Hub | `emitted-versions.json`, `composer.json`, hub `accounting-contract-support.json` | Planned |
| NFR-005 | Phase 1, 10 | API | `Status.php`, `RevenueInvoicePredicate`, `NoChargeLinePredicate`, Appendix A §5 consumers | Planned |
| NFR-006 | Phase 1, 2C, 4, 6 | API | hand-written migrations | Planned |
| NFR-007 | Phase 3 | API | Make-internal bulk endpoint (N4) | Planned (assumption, Q20) |
| NFR-008 | Phase 1–6 | API | type-aware guards (Appendix A regression list) | Planned |
| NFR-009 | Phase 5 | API | `CloseWorkOrderTest`, webhook subscriber tests | Planned |
| NFR-010 | Phase 1, 3, 13 | API, App | `app.internal_work_orders.enable_allowed`, `internalWorkOrdersAvailable` | Planned |
| NFR-011 | Phase 9, 13 | API | category write handlers + `BackfillPhase` + `--emit-accounting` | Planned |

### E2E rows

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-first-enable.spec.ts | Planned |
| S1-R2 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-first-enable.spec.ts | Planned |
| S1-R3 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-first-enable.spec.ts (hint line 1 and its link; line 2 QuickBooks/hub variants: fe-unit WorkOrderSettings.spec.ts) | Planned |
| S1-R4 | Phase 3 | Dev | fe-unit WorkOrderSettings.spec.ts + be-functional settings DTO (hasInternalCustomers) | Dev |
| S1-R5 | Phase 3 | Dev | fe-unit InternalWorkOrdersFirstEnableDialog.spec.ts + be-functional EnableInternalWorkOrdersTest.php | Dev |
| S1-R6 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-flag.spec.ts (T2) | Planned |
| S1-R7 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-flag.spec.ts (T1, checkbox + Default internal category) | Planned |
| S1-R8 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-flag.spec.ts (header) + iwo-first-enable.spec.ts (list); mobile card: fe-unit CustomerCardMobile | Planned |
| S1-R9 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-first-enable.spec.ts (two customers flagged) | Planned |
| S1-R10 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-setting-off-on.spec.ts | Planned |
| S1-R11 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-first-enable.spec.ts + iwo-make-internal-locations.spec.ts (D36) | Planned |
| S1-R12 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-flag.spec.ts (T2) | Planned |
| S1-R13 | Phase 2C | E2E | e2e/tests/ui/internal-work-orders/iwo-categories-page.spec.ts (setting-off notice, default not archivable: fe-unit / be-functional) | Planned |
| S1-R14 | Phase 2C | E2E | e2e/tests/ui/internal-work-orders/iwo-categories-page.spec.ts (name, requires original); QuickBooks picker: e2e/tests/qb/iwo-qb-category-accounts.spec.ts (2C-B, D61); read-only pickers: Backlog #12 | Planned |
| S1-R15 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-asset-internal-category.spec.ts | Planned |
| S1-R16 | Phase 2C | E2E | e2e/tests/ui/internal-work-orders/iwo-categories-page.spec.ts (stable key across rename/archive/restore); resolution skipping archived: be-unit InternalCategoryResolverTest.php; archive-impact message: fe-unit ArchiveCategoryDialog.spec.ts | Planned |
| S1-N1 | Phase 3 | E2E | e2e/tests/permissions/admin-page-visibility.spec.ts (Settings — App section) | Existing |
| S1-N2 | Phase 3 | Dev | be-functional EnableInternalWorkOrdersTest.php (no customer atom) | Dev |
| S1-N3 | Phase 3 | E2E | e2e/tests/permissions/customer-edit-permissions.spec.ts | Existing |
| S1-N4 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-setting-off-on.spec.ts | Planned |
| S1-N5 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-flag.spec.ts (T2) | Planned |
| S1-N6 | Phase 3 | Dev | fe-unit MakeInternalDialog.spec.ts (OK only) + be-functional MakeInternalCandidatesTest.php (can_make_internal) | Dev |
| S1-E1 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-flag.spec.ts (T2, open WO stays internal; closed half: be-functional) | Planned |
| S1-E2 | Phase 3 | Dev | be-functional InternalFlagTest.php | Dev |
| S1-E3 | Phase 3 | Dev | be-functional InternalFlagTest.php (org-wide); multi-location listing also seen in iwo-make-internal-locations.spec.ts | Dev |
| S1-E4 | Phase 3 | E2E | e2e/tests/ui/internal-work-orders/iwo-setting-off-on.spec.ts | Planned |
| S2-R1 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-work-order.spec.ts (T1, asset category + tooltip; customer default in iwo-internal-flag / iwo-change-customer; org-default tooltip wording Q51 ✓) | Planned |
| S2-R2 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-create-no-charge.spec.ts | Planned |
| S2-R3 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-work-order.spec.ts (T1) + iwo-create-no-charge.spec.ts (No Charge style); mobile header: fe-unit OrderStatusCardMobile.spec.ts | Planned |
| S2-R4 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-work-order.spec.ts (T2); documents in iwo-close.spec.ts / iwo-document-pdf.spec.ts (Phase 5) | Planned |
| S2-R5 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T1) | Planned |
| S2-R6 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T3, Change category + Convert to Billable; Q36 ✓ not exercised) | Planned |
| S2-R7 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-change-customer.spec.ts (closed-WO lock, D33: iwo-close.spec.ts) | Planned |
| S2-R8 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-vendor-bill-cost-move.spec.ts (Backlog #1, Q62 ✓) | Backlog |
| S2-R9 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (T1, lock + disabled Change Customer, D33) | Planned |
| S2-R10 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-list-classification.spec.ts (Closed status: Backlog #5; board/Tech View/schedule/search/tabs: Backlog #6) | Planned |
| S2-R11 | Phase 4 | Dev | be-functional Appendix A Phase 4 regression lock (pick, receive, clock-in, approval) + fe-unit InvoiceActionBar.spec.ts; portal half: Phase 11 | Dev |
| S2-R12 | — | — | Story 11, out of this plan (Open API); the core-release half S3-R4 is be-functional in Phase 5 | Out of scope |
| S2-R13 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-change-customer.spec.ts + iwo-convert.spec.ts (classification written on the WO); audit rows: be-functional | Planned |
| S2-R14 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-list-classification.spec.ts | Planned |
| S2-R15 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T1, fee removed) + iwo-internal-work-order.spec.ts (T2, no Fee/Discount in menu) | Planned |
| S2-R16 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-create-no-charge.spec.ts; document line in iwo-close-original-required.spec.ts / iwo-document-pdf.spec.ts | Planned |
| S2-R17 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-create-no-charge.spec.ts (original WO + line, stored technicians; Q38 ✓, Q42 avoided by explicit roster) | Planned |
| S2-R18 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T1 ShopView note, T3 linked WO number); audit rows: be-functional | Planned |
| S2-R19 | Phase 4 | Dev | be-functional ReceiveSpecialOrderOnInternalWorkOrderTest.php + fe-unit MultiVendorReceiveModel.spec.ts (Q48 ✓) | Dev |
| S2-R20 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T4, fixed line total removed, line still saves) | Planned |
| S2-R21 | Phase 4 | Dev | be-functional NoAutoApplyOnInternalCreationTest.php | Dev |
| S2-R22 | Phase 4 | Dev | be-functional DerivedWarrantyFlagTest.php + fe-unit buildPrintModel / WorkOrderPrintView (Q44 ✓) | Dev |
| S2-N1 | Phase 4 | Dev | fe-unit WorkOrderDialog.spec.ts / WorkOrderNavBarMenu.spec.ts + be-functional ConvertToBillableTest / ChangeCategoryTest (setting off) | Dev |
| S2-N2 | Phase 4 | Dev | fe-unit WorkOrderNavBarMenu.spec.ts + be-functional 403 matrix (role E2E: Backlog #12) | Dev |
| S2-N3 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-work-order.spec.ts (T1, no checkbox for an internal customer) | Planned |
| S2-N4 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T2) | Planned |
| S2-N5 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-work-order.spec.ts (T2, no Add Deposit) | Planned |
| S2-E1 | Phase 4 | Dev | be-functional (canned/inspection/ShopCoach lines de-priced) | Dev |
| S2-E2 | Phase 4 | Dev | be-functional SplitClassificationTest.php | Dev |
| S2-E3 | Phase 4 | Dev | nothing to build (Appendix A C20: no live work-order import exists) | Dev |
| S2-E4 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-convert.spec.ts (T3, D34) | Planned |
| S2-E5 | Phase 4 | Dev | be-functional (copied lines de-priced) | Dev |
| S2-E6 | Phase 11 | Manual | portal (Appendix D) + manual checklist item 12 | Manual |
| S2-E7 | Phase 4 | Dev | fe-unit CompletionWizard.spec.ts + be-functional CoreChargeOnInternalWorkOrderTest.php | Dev |
| S3-R1 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (header) + iwo-close-original-required.spec.ts (Finance tab); bulk bar / menu: Backlog #7 | Planned |
| S3-R2 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (rows) + iwo-close-original-required.spec.ts (original select, not-complete sentence) | Planned |
| S3-R3 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close-original-required.spec.ts (completion first, D42) + iwo-close.spec.ts | Planned |
| S3-R4 | Phase 5 | Dev | be-functional CloseWorkOrderTest.php + InvoiceWebhookDeliveryTest.php + ClosedInvoiceHiddenTest.php | Dev |
| S3-R5 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-document-pdf.spec.ts + iwo-close.spec.ts / iwo-close-original-required.spec.ts (in-app document); email recipient: fe-unit | Planned |
| S3-R6 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-asset-invoices.spec.ts (+ customer Invoices tab exclusion, D37) | Planned |
| S3-R7 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (T2) | Planned |
| S3-N1 | Phase 5 | E2E | e2e/tests/ui/work-orders/finish-action-negatives.spec.ts (+ Phase 2 regression lock) | Existing |
| S3-N2 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (T2) | Planned |
| S3-N3 | Phase 5 | Dev | fe-unit useWorkOrderFinishAction.spec.ts + be-functional 403 (role E2E: Backlog #12) | Dev |
| S3-N4 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-unmapped.spec.ts (T1, QuickBooks half); hub half: e2e/tests/ui/internal-work-orders/iwo-hub-close-notes.spec.ts Backlog #4 (Phase 9) | Planned |
| S3-E1 | Phase 5 | Dev | fe-unit CloseWorkOrderDialog.spec.ts + be-functional CloseWorkOrderTest.php | Dev |
| S3-E2 | Phase 5 | Dev | fe-unit CloseWorkOrderDialog.spec.ts + be-functional CloseWorkOrderTest.php | Dev |
| S3-E3 | Phase 6 | Manual | manual checklist item 8 (QBO closed period) + be-functional against the QB fake | Manual |
| S3-E4 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (T1, no-integration sentence) | Planned |
| S3-E5 | Phase 5 | Dev | be-functional (409 work_order_changed) + fe-unit CloseWorkOrderDialog.spec.ts (inline) | Dev |
| S4-R1 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-reopen.spec.ts | Planned |
| S4-R2 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-reopen.spec.ts | Planned |
| S4-R3 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-reopen.spec.ts + e2e/tests/qb/iwo-qb-reopen-reversal.spec.ts (same accounts); per-WO event order: hub scenario test (Appendix C §6) | Planned |
| S4-R4 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-reopen.spec.ts | Planned |
| S4-N1 | Phase 5 | Dev | fe-unit InvoiceActionBar.spec.ts + be-functional ReopenWorkOrderTest.php (403) | Dev |
| S4-N2 | Phase 5 | E2E | e2e/tests/ui/billing/invoice-reverse.spec.ts | Existing |
| S4-E1 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-unmapped.spec.ts (T2, QuickBooks half: no reversal for an entry never sent); hub Dismissed row: e2e/joint/tests/56-internal-work-order-held-reopen.spec.ts Backlog #3 | Planned |
| S4-E2 | Phase 6 | Manual | manual checklist item 8 (reversal into a closed period) + hub Pest | Manual |
| S4-E3 | Phase 5 | Dev | be-functional ReopenWorkOrderTest.php | Dev |
| S4-E4 | Phase 5 | Dev | be-functional ReopenWorkOrderTest.php | Dev |
| S5-R1 | Phase 2C, 6 | E2E | e2e/tests/qb/iwo-qb-category-accounts.spec.ts | Planned |
| S5-R2 | Phase 2C, 6 | E2E | e2e/tests/qb/iwo-qb-category-accounts.spec.ts (Q52 ✓ expense accounts) | Planned |
| S5-R3 | Phase 2C, 6 | E2E | e2e/tests/qb/iwo-qb-category-accounts.spec.ts | Planned |
| S5-R4 | Phase 2C, 6 | E2E | e2e/tests/qb/iwo-qb-category-accounts.spec.ts (empty-row hint) + iwo-qb-close-unmapped.spec.ts (no fallback) | Planned |
| S5-R5 | Phase 2C | Dev | fe-unit CategoryExpenseMappingPanel.spec.ts (no hint while off) | Dev |
| S5-R6 | Phase 2C, 6 | E2E | e2e/tests/qb/iwo-qb-category-accounts.spec.ts (keyed by stable key); archive keeps mapping: be-functional | Planned |
| S5-N1 | Phase 6 | Dev | fe-unit QuickBooks.spec.ts (rows hidden when not connected) | Dev |
| S5-N2 | Phase 6 | E2E | e2e/tests/permissions/custom/settings-integrations-enforcement.spec.ts | Existing |
| S5-E1 | Phase 6 | Manual | manual (QBO account deleted or inactive) | Manual |
| S5-E2 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-unmapped.spec.ts (T1, Review, never another category's account) | Planned |
| S6-R1 | Phase 9 | E2E | e2e/tests/ui/internal-work-orders/iwo-hub-category-mappings.spec.ts | Planned |
| S6-R2 | Phase 9 | E2E | e2e/tests/ui/internal-work-orders/iwo-hub-category-mappings.spec.ts (new-workspace seeder; rollout migration: hub Pest + Phase 13 verify; HQ1 ✓) | Planned |
| S6-R3 | Phase 9 | E2E | e2e/tests/ui/internal-work-orders/iwo-hub-category-mappings.spec.ts | Planned |
| S6-R4 | Phase 9 | Joint | e2e/joint/tests/55-internal-work-order-held.spec.ts | Joint |
| S6-N1 | Phase 9 | Dev | be-functional (nothing emitted without the hub) | Dev |
| S6-N2 | Phase 9 | E2E | e2e/tests/ui/accounting/accounting-access-gate.spec.ts | Existing |
| S6-E1 | Phase 8 | Dev | hub Pest (inactive account → Held) | Dev |
| S7-R1 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-journal-entries.spec.ts | Planned |
| S7-R2 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-journal-entries.spec.ts (memo, Class from location) | Planned |
| S7-R3 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-vendor-bill.spec.ts (6F T1) | Planned |
| S7-R3a | Phase 6 | Dev | be-functional against the QB fake | Dev |
| S7-R4 | Phase 6 | Manual | manual checklist item 8 + be-functional against the QB fake | Manual |
| S7-R4a | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-journal-entries.spec.ts | Planned |
| S7-R5 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-reopen-reversal.spec.ts | Planned |
| S7-R6 | Phase 6 | Dev | be-functional CloseQuickBooksPostingTest.php (retry, no duplicate) | Dev |
| S7-R7 | Phase 6 | Dev | be-functional | Dev |
| S7-R8 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-no-charge-line-invoice.spec.ts; bills per line: e2e/tests/qb/iwo-qb-vendor-bill.spec.ts (6F T2) | Planned |
| S7-N1 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (T1, no integration) | Planned |
| S7-N2 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-unmapped.spec.ts (T1) | Planned |
| S7-N3 | Phase 6 | Manual | manual checklist item 8 | Manual |
| S7-N4 | Phase 6 | Dev | be-functional | Dev |
| S7-N5 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-unmapped.spec.ts (T2) | Planned |
| S7-E1 | Phase 6 | Dev | be-functional | Dev |
| S7-E2 | Phase 6 | Manual | manual checklist item 8 | Manual |
| S8-R1 | Phase 9 | E2E | e2e/tests/ui/internal-work-orders/iwo-hub-closed-record.spec.ts (record page, D39) | Planned |
| S8-R2 | Phase 9 | Joint | e2e/joint/tests/54-internal-work-order-close.spec.ts | Joint |
| S8-R3 | Phase 9 | Joint | e2e/joint/tests/54-internal-work-order-close.spec.ts | Joint |
| S8-R4 | Phase 9 | Joint | e2e/joint/tests/54-internal-work-order-close.spec.ts | Joint |
| S8-R5 | Phase 8 | Dev | hub Pest | Dev |
| S8-R6 | Phase 9 | E2E | e2e/tests/ui/internal-work-orders/iwo-hub-closed-record.spec.ts (Sales Invoices Status filter); Invoice List default unselected: fe-unit reportParams + hub Pest | Planned |
| S8-R7 | Phase 9 | E2E | e2e/tests/ui/internal-work-orders/iwo-hub-no-charge-lines.spec.ts (Held variant: joint, Q30 ✓) | Planned |
| S8-N1 | Phase 9 | Dev | be-functional | Dev |
| S8-N2 | Phase 9 | Joint | e2e/joint/tests/55-internal-work-order-held.spec.ts (Q50 ✓ copy) | Joint |
| S8-E1 | Phase 8 | Dev | hub Pest | Dev |
| S8-E2 | Phase 9 | Joint | e2e/joint/tests/56-internal-work-order-held-reopen.spec.ts (Backlog #3) | Backlog |
| S9-R1 | Phase 10 | Dev | be-functional RevenueReportsExcludeClosedTest.php + RevenueReportsExcludeNoChargeLineTest.php (+ Phase 1 E2E regression lock) | Dev |
| S9-R2 | Phase 10 | E2E | e2e/tests/ui/internal-work-orders/iwo-report.spec.ts (T1 by line, T3 by technician; Q33 ✓; export: Backlog #11, Q34 ✓) | Planned |
| S9-R3 | Phase 10 | Dev | fe-unit TechnicianEfficiency.spec.ts + be-functional TechnicianEfficiencyInternalWorkOrdersFilterTest.php | Dev |
| S9-R4 | Phase 10 | E2E | e2e/tests/ui/internal-work-orders/iwo-report.spec.ts (T2; Q31 ✓ not exercised) | Planned |
| S9-R5 | Phase 10 | Dev | be-functional RevenueReportsExcludeClosedTest.php | Dev |
| S9-R6 | Phase 10 | Dev | fe-unit ExportReportsDialog.spec.ts + be-functional CustomerInvoiceExportNonBillableTest.php (E2E: Backlog #11) | Dev |
| S9-R7 | Phase 10 | Dev | be-functional | Dev |
| S9-R8 | Phase 10 | Dev | be-functional | Dev |
| S9-R9 | Phase 10 | Dev | be-functional + fe-unit WorkInProgressReport spec (+ work-in-progress.spec.ts regression lock) | Dev |
| S9-R10 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-asset-invoices.spec.ts | Planned |
| S9-R11 | Phase 10 | Dev | be-functional (dating, 0.00 rows); report dates also seen in iwo-report.spec.ts | Dev |
| S9-R12 | Phase 10 | Dev | be-functional | Dev |
| S9-R13 | Phase 10 | Dev | be-functional CustomerInvoiceExportNonBillableTest.php + unit InvoiceDataNoChargeLineTest.php | Dev |
| S9-R14 | Phase 10 | Manual | SV-12297 rule-zero staging compare (+ be-functional byte-compare, Phase 1 E2E regression lock) | Manual |
| S9-R15 | Phase 10 | Dev | be-functional CustomersSpendingExcludesClosedTest.php (Sales Follow Up removed by SV-12106; Q66 ✓) | Dev |
| S9-R16 | Phase 10 | Dev | be-functional InternalWorkOrdersReportTest.php (inaccessible location excluded) | Dev |
| S9-N1 | Phase 10 | E2E | e2e/tests/ui/internal-work-orders/iwo-report.spec.ts (T2) | Planned |
| S9-N2 | Phase 10 | E2E | e2e/tests/permissions/reports-page-visibility.spec.ts | Existing |
| S9-N3 | Phase 10 | Dev | fe-unit (no extra gate on the tab) | Dev |
| S9-E1 | Phase 10 | Dev | be-functional | Dev |
| S9-E2 | Phase 10 | E2E | e2e/tests/ui/finance.spec.ts (C984, $0 invoice) | Existing |
| S10-R1 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-internal-work-order.spec.ts (T2, flat amount = Min); Min without % on Edit Customer: fe-unit CustomerDialog.spec.ts + be-functional MinWithoutPercentageTest.php | Planned |
| S10-R2 | Phase 4 | E2E | e2e/tests/ui/internal-work-orders/iwo-change-customer.spec.ts (reset on customer change); manual edit + lock after Close: Backlog #8 | Planned |
| S10-R3 | Phase 5 | E2E | e2e/tests/ui/internal-work-orders/iwo-close.spec.ts (T1) | Planned |
| S10-R4 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-close-journal-entries.spec.ts (hub half: e2e/joint/tests/54-internal-work-order-close.spec.ts) | Planned |
| S10-R5 | Phase 6 | Dev | be-functional | Dev |
| S10-N1 | Phase 5 | Dev | fe-unit CloseWorkOrderDialog.spec.ts | Dev |
| S10-N2 | Phase 6 | Dev | be-functional against the QB fake + hub Pest | Dev |
| S10-N3 | Phase 4 | Dev | fe-unit FinancialInfoCard.spec.ts | Dev |
| S10-E1 | Phase 4 | Dev | be-unit WorkOrderShopSuppliesCalculatorTest.php | Dev |
| S10-E2 | Phase 5, 6 | Dev | be-functional CloseWorkOrderTest.php (invoice and row, Phase 5) + CloseQuickBooksPostingTest.php (shop supplies entry, Phase 6) | Dev |
| S12-R1 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-mark-no-charge.spec.ts (menu) + iwo-line-dialog-door.spec.ts (New Line; Q47 ✓ no Line Builder door) | Planned |
| S12-R2 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-mark-no-charge.spec.ts | Planned |
| S12-R3 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-mark-no-charge.spec.ts (Tech View / mobile: fe-unit WorkOrderLineRow / WorkOrderLineCard) | Planned |
| S12-R4 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-mark-no-charge.spec.ts (WO stays billable, totals on billable lines); deposit message: fe-unit (Q49 ✓); portal: Phase 11 | Planned |
| S12-R5 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-mark-no-charge.spec.ts (T2) | Planned |
| S12-R6 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-mark-no-charge.spec.ts (T1 ShopView note); audit rows: be-functional MarkLineNoChargeTest.php | Planned |
| S12-R7 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-create-invoice.spec.ts (invoice preview); QuickBooks invoice line: iwo-qb-no-charge-line-invoice.spec.ts; portal: Phase 11 | Planned |
| S12-R8 | Phase 6 | E2E | e2e/tests/qb/iwo-qb-no-charge-line-invoice.spec.ts (hub half: e2e/tests/ui/internal-work-orders/iwo-hub-no-charge-lines.spec.ts; reversal keeps marks: be-functional) | Planned |
| S12-R9 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-create-invoice.spec.ts | Planned |
| S12-R10 | Phase 4B | Dev | fe-unit MarkLineNoChargeDialog.spec.ts (hint) + be-functional CreateInvoiceWithNoChargeLineTest.php ($0 invoice) | Dev |
| S12-R11 | Phase 10 | E2E | e2e/tests/ui/internal-work-orders/iwo-report.spec.ts (No Charge line row) | Planned |
| S12-R12 | Phase 4B | Dev | fe-unit WorkOrderLineContextMenuList.spec.ts / WorkOrderLineRow.spec.ts + be-functional 403 | Dev |
| S12-N1 | Phase 4B | Dev | fe-unit WorkOrderLineContextMenuList.spec.ts / LineDialog.spec.ts + be-functional 409 (Q37 ✓) | Dev |
| S12-N2 | Phase 4B | Dev | fe-unit + be-functional 409 work_order_not_billable | Dev |
| S12-N3 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-create-invoice.spec.ts (disabled + "Reverse the invoice first.") | Planned |
| S12-N4 | Phase 4B | Dev | fe-unit WorkOrderLineContextMenuList.spec.ts + be-functional 403 (role E2E: Backlog #12) | Dev |
| S12-E1 | Phase 4B | Dev | be-functional SplitClassificationTest.php | Dev |
| S12-E2 | Phase 4B | Dev | be-functional ChangeCustomerClassificationTest.php + fe-unit NoChargeCategoryFields.spec.ts | Dev |
| S12-E3 | Phase 4B | Dev | be-functional + fe-unit CompletionWizard.spec.ts | Dev |
| S12-E4 | Phase 4B | Dev | fe-unit LineNoChargeChip / NoChargeCategoryFields + be-functional | Dev |
| S12-E5 | Phase 10 | Dev | be-functional InternalWorkOrdersReportTest.php + fe-unit report (plain text) | Dev |
| S12-E6 | Phase 4B | Dev | be-functional MovePartToLine | Dev |
| S12-E7 | Phase 4B | E2E | e2e/tests/ui/internal-work-orders/iwo-line-issue-credit.spec.ts (Backlog #10, Q35 ✓) | Backlog |
| S12-E8 | Phase 4B | Dev | be-functional (refusals) + fe-unit (menu, print chip) | Dev |
| S13-R1 | Phase 2C | Dev | be-unit StartingCategoriesSeederTest.php + be-functional seed CLI; release-run --verify (Phase 13); new-org set seen in iwo-categories-page.spec.ts | Dev |
| S13-R2 | Phase 2C | Dev | be-functional WorkOrderCategoryRowsTest.php (virtual rows, D54); rows on the page: e2e/tests/qb/iwo-qb-category-accounts.spec.ts | Dev |
| S13-R3 | Phase 8 | Dev | hub Pest (seeding operator command + --verify, run after the hub release and at launch) | Dev |
| S13-R4 | Phase 13 | Manual | release runbook order + rerun (seeder idempotency: be-unit) | Manual |
| S13-R5 | Phase 13 | Manual | release runbook --verify per organization | Manual |
| S13-R6 | Phase 2C | Dev | be-functional (seeder flags no customer, reclassifies nothing) | Dev |
| S13-E1 | Phase 8 | Dev | hub Pest | Dev |
| S13-E2 | Phase 2C | E2E | e2e/tests/ui/internal-work-orders/iwo-categories-page.spec.ts (fixture mints a new org; the subscriber seeds the set) | Planned |
| S13-N1 | Phase 2C | Dev | be-functional seed CLI (per-org isolation, failure list) | Dev |
| S3-N5 | Phase 5 | Dev | fe-unit useWorkOrderFinishAction.spec.ts / useCreateInvoiceGate.spec.ts (Close offered on credit hold; billable still refused) | Dev |


Every FR and NFR from Section 1 appears in this table. E2E statuses: Planned = new spec, Existing = covered today, Dev = gate 1–3 owner, Manual = Section 7 checklist, Backlog = deferred, Joint = local joint-stack suite.

## 11. Verification Tickets

Revision 5 (2026-11-10): every ticket below carries the v1.0 scope and checklist, is a Task under SV-11665 (Product Area Work Orders) and is assigned to Dusan Radulovic; Product's rule-zero check SV-12297 is linked from SV-11973, SV-11980 and SV-11981.

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-11973](https://shopview.atlassian.net/browse/SV-11973) | Verify: schema, invoice-status fork, shared predicates and invoice-create extraction (Phases 1–2) | NFR-005, NFR-006, NFR-010 (gate parameter); foundation for D3, D4, D58; S9-R14 (rule zero, core half) | SV-11758 … SV-11767, SV-12226; relates SV-12297 | Dusan Radulovic |
| [SV-12420](https://shopview.atlassian.net/browse/SV-12420) | Verify: Internal Work Orders categories, QuickBooks category rows and seeding (Phase 2C) | S1-R13, S1-R14, S1-R16, S5-R1, S5-R3 … S5-R6 (rows), S13-R1, S13-R2, S13-R4 … S13-R6, S13-E2, S13-N1 (core) | SV-11758, SV-11762, SV-12295 | Dusan Radulovic |
| [SV-11974](https://shopview.atlassian.net/browse/SV-11974) | Verify: the setting, the Internal customer flag, customer and asset categories, Make internal (Phase 3) | Story 1 (S1-R1 … S1-R12, S1-R15, S1-N1 … S1-E4), S10-R1 (Min without % on flagged customers), S2-R13 (flag audit), NFR-007, NFR-010 | SV-11758 | Dusan Radulovic |
| [SV-11975](https://shopview.atlassian.net/browse/SV-11975) | Verify: classification lifecycle, categories and originals, hidden prices, badges, notes and shop supplies (Phase 4) | Story 2 (except S2-R9 → Phase 5, S2-R12 out, S2-R11 portal half → Phase 11), Story 10 (S10-R1, R2, R5, N1 … N3, E1, E2) | SV-11759, SV-11767 | Dusan Radulovic |
| [SV-12421](https://shopview.atlassian.net/browse/SV-12421) | Verify: a no-charge line on a billable work order (Phase 4B) | Story 12 core (S12-R1 … S12-R12, S12-N1 … S12-N4, S12-E1 … S12-E8); posting in Phases 6/9, reports in Phase 10, portal in Phase 11 | SV-12226 | Dusan Radulovic |
| [SV-11976](https://shopview.atlassian.net/browse/SV-11976) | Verify: Close, Reopen and the NO CHARGE document (Phase 5) | Story 3, Story 4, S2-R9, S10-R3, S2-R13 (Close/Reopen log), S12-R7 (document rendering) | SV-11760, SV-11761 | Dusan Radulovic |
| [SV-11977](https://shopview.atlassian.net/browse/SV-11977) | Verify: QuickBooks category accounts and journal entries (Phase 6) | Story 5, Story 7 (incl. S7-N5, S7-R8), S3-N4 (QuickBooks notes), S10-R4 / S10-N2 (QuickBooks), S12-R8 (QuickBooks half), S4-E1 + S4-E2 (QuickBooks halves), NFR-003 | SV-11762, SV-11764, SV-12226 | Dusan Radulovic |
| [SV-11978](https://shopview.atlassian.net/browse/SV-11978) | Verify: AccountingHub releases A and B (Phases 7–8) | Story 6, Story 8 hub side (S8-R1 … S8-E2, S8-R7), S4-E1, S4-R3 (order), S4-E2, S10-R4 / S10-N2, S12-R8, S13-R3 (hub half) | SV-11763, SV-11765, SV-12295 | Dusan Radulovic |
| [SV-11979](https://shopview.atlassian.net/browse/SV-11979) | Verify: core accounting emission and the accounting UI port (Phase 9) | Story 8 core side, Story 6 UI (core port), S3-N4 (AccountingHub notes), S12-R8 (hub half, core side), NFR-004, NFR-011 | SV-11763, SV-11765, SV-12226 | Dusan Radulovic |
| [SV-11980](https://shopview.atlassian.net/browse/SV-11980) | Verify: reports, dashboard and exports (Phase 10) | Story 9 (S9-R1 … S9-E2), S12-R11, NFR-002 | SV-11766, SV-12226; relates SV-12297 | Dusan Radulovic |
| [SV-12422](https://shopview.atlassian.net/browse/SV-12422) | Verify: customer portal (Phase 11) | S3-R4 / S3-R6 (portal half), S2-R11 (portal half), S2-E6, S2-N5 (portal deposits), S12-R4 and S12-R7 (portal) | SV-12296 | Dusan Radulovic |
| [SV-11981](https://shopview.atlassian.net/browse/SV-11981) | Verify: release run and launch (Phase 13) | S13-R1 … S13-R6, S13-E1, S13-E2, S13-N1, NFR-010 | SV-11758 … SV-11767, SV-12226, SV-12295; relates SV-12297 | Dusan Radulovic |

When all these tickets are marked Done, the feature is ready for QA.

---

# Appendix A — Backend plan (`api/`)

## Internal Work Orders: backend (`api/`) implementation plan

Scope: PRD v1.0 (Confluence page version 39, final for build), Stories 1–10, 12 and 13, backend only, plus core's side of the accounting contract (`api/docs/integration/`, payload builders, `emitted-versions.json`). The AccountingHub repository and Story 11 (except its safety half, S3-R4) are not built here; what the hub must provide is listed in §2.12.

Inputs: the PRD v1.0 text (page 39, final for build, source of truth), design All flows v6.1, and the plan's Section 3 decisions D1–D70. Every code claim was read on `develop` at `8a3ce526e4` (2026-11-09) and is cited `path:line`, paths relative to `api/` unless they start with `app/` or `shopview-accounting/`.

Markers: **`Q<n> ✓`** = an answered Product question (ids from the reconciliation; rounds 1–4 are all answered, PRD v1.0, so no `⏸` marker remains); **`HQ<n>`** = owned by the AccountingHub owner (HQ1–HQ8 confirmed). Nothing else is open except two prod measurements (§9).

Wire format: snake_case through the serializer's `camel_case_to_snake_case` (`config/services.yaml:525,532`), with D22's exceptions: settings, work-order list/board/search/schedule rows, the QuickBooks integration payload and the receive view stay camelCase, because their existing keys are camelCase.

---

### 0. Corrections: where the PRD or the brief does not match the code (evidence)

| # | Statement | What the code says | Evidence | Consequence |
|---|---|---|---|---|
| C1 | S7-R6: "the inventory journal entries have no such [idempotency] key today" | They do. SV-11375 claims every QuickBooks inventory JE in `bookkeeping_journal_entry` before posting it | `migrations/Version20261020140000.php`; `Bookkeeping/Infrastructure/Doctrine/BookkeepingJournalEntry/BookkeepingJournalEntry.orm.xml` (unique `workplace_id, bookkeeping_id, inventory_change_id`); `Bookkeeping/Application/Service/Sync/JournalEntrySyncService.php:79-99` | Stock-part entries reuse that claim; the table gains the posted accounts (D6). Entries without an inventory change get a sibling claim table (§2.11) |
| C2 | S12-R7: the no-charge statement is priced 0 "the way a declined line's statement is priced 0 today" | Only the labor half is. A declined line's statement gets price 0, `time_estimate` 0 and `labour_rate` 0, but its **items keep the parts' sell prices**; only their tax weight is 0 | `Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilder.php:211-225,277-297`; `VehicleService/WorkOrders/Domain/DTO/WorkOrderPricing/WorkOrderLinePricingDto.php:57-64`; the snapshot service states it, `Invoicing/Invoice/Application/Service/InvoiceFinancialSnapshotService.php:36-40` | The no-charge statement has its own branch: hours kept, rate 0 (real rate in `no_charge_labor_rate`), items forced to 0 (§2.10) |
| C3 | S7-R8: "the API owner confirms how today's $0 statement of a declined line is sent" | It is not sent. `InvoiceGenerator` (QuickBooks invoice sync and Customer Invoice CSV) drops declined lines | `Reporting/Export/Service/InvoiceGenerator.php:321,330` | The no-charge line is the first $0 line sent to QuickBooks; its row must carry rate 0.00, because the row's rate is `invoice_statement.labour_rate` (`Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/InvoiceData.php:203-204`) and QuickBooks requires amount = rate × quantity |
| C4 | S9-R14: exclude no-charge lines "the way void invoices are excluded today", one shared predicate | Void invoices have a shared predicate (`Reporting/Shared/Domain/NonVoidInvoicePredicate.php`); **declined lines do not** — each query hand-writes `wol.status` | `Dashboard/Tiles/Infrastructure/Persistence/Query/Dbal/DbalBillingEfficiencyBucketFetcher.php:112,153`, `DbalSalesRevenueBucketFetcher.php:264,277`, `Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesReportDataFetcher.php:187`, `DbalPartsVelocityFetcher.php:246`, `Reporting/Dashboard/Infrastructure/Persistence/DbalServiceAdvisorAnalysisQueryRepository.php:141`, `Invoicing/Invoice/Domain/Service/InvoiceFetcher.php:74`, `VehicleService/WorkOrders/Domain/Line/Service/LinesStatsFetcher.php:70,379` | A new NULL-safe `NoChargeLinePredicate` is added beside each of those sites (D58, §2.14) |
| C5 | S9-R1: "the invoice financial snapshot captures the no-charge lines as excluded" | The snapshot cannot exclude a line today. Its cost and hours come from `WorkOrderStatsFetcher::getStats()`, which drops declined lines by status, and clocked labor is merged only onto kept lines | `InvoiceFinancialSnapshotService.php:107-139`; `VehicleService/WorkOrders/Domain/Service/WorkOrderStatsFetcher.php:38-87,129-158`; `LinesStatsFetcher.php:70-78,379-387` | A new `excludeNoChargeLines` option on the stats fetcher, default off, because the work-order detail shares it and Financial Info must not change (S12-R4) |
| C6 | S5-R6: categories follow "the per-row model of part categories" | Part categories have one `part_category_product_and_service` row per (category, location), but their QuickBooks account lives in a JSON map on the location's `bookkeeping` row | `PartsCatalogue/PartsCategories/Infrastructure/Doctrine/PartCategoryProductAndService.orm.xml` (unique `part_category_id, workplace_id`); `Bookkeeping/Domain/Bookkeeping.php:57,161` | One row per (category, location) in a table; rows are rendered for every connected location and stored on first save (D54) |
| C7 | S13-R2: the migration "creates one empty ShopView Accounts row per category at every location" | Nothing reads an empty row; an empty row and a missing row render the same | — | Empty rows are virtual (D54); S13-R5's "four rows per connected location" is checked as four categories rendered |
| C8 | S1-R15: "Edit Asset of an internal customer" | An asset can belong to several customers through the `vehicle_company` pivot; `vehicle.company_id` is deprecated | `VehicleService/Vehicles/Infrastructure/Doctrine/Vehicle.orm.xml` (`v__company_id_idx`); `vehicle_company` unique `(vehicle_id, company_id)` | The asset's category is one value on `vehicle`; the field applies when **any** owner is flagged |
| C9 | S2-R17: "every technician assigned to the original line" | A line has a roster (`work_order_line_technician`, sources `manual` / `shift`) and a lead (`work_order_line.tech_assigned_id`); readers show the roster, or the lead when the roster is empty | `VehicleService/WorkOrders/Domain/Line/LineTechnician.php`; `Infrastructure/Persistence/Query/Dbal/DbalLineTechnicianRosterFetcher.php:48-51`; work order lead `WorkOrder.orm.xml:30` | Original technicians = the roster as the line shows it Q42 ✓ (§2.5) |
| C10 | S12-R4: "the difference becomes a customer credit when the invoice is created" | Deposit overflow becomes a **free-floating Deposit** on the customer's account, not a credit memo | `Customer/Customers/Application/Handler/Deposit/AutoApply/AutoApplyDepositsService.php:86-95,274-400` | Behavior is the existing rule; the copy is Q49 ✓ |
| C11 | S2-R19 lists receive, vendor-invoice cost edits and core-charge changes | Seven places write or derive a sell price, in two bounded contexts | `VehicleService/WorkOrders/Domain/PartRequest/SpecialPartsGetsReceived.php:355,372-391,430-477`; `Domain/PartsManager/PartsManager.php:589-594`; `Domain/Part/UpdateCoreChargePart.php:61-63`; `Domain/PartRequest/UpdatePartRequestFromOrderItemSubscriber.php:118-120`; `Inventory/Deliveries/Domain/Service/DeliveryItemModifier.php:366-372,390-397`; `Application/Service/Part/Request/UpdatePartRequestDataResolver.php:386-430` | One `SellPriceWritePolicy` checked at all seven (§2.9) |
| C12 | S2-R22: the warranty toggle "in the line dialog", printed on Print Work Order | Backend: `work_order_line.is_warranty` is accepted by line create/change and read by the detail, the TTR view and the Open API; the FE premise is Q44 ✓ | `Line.orm.xml:23`; `Application/Line/Create/CreateCommand.php:37`; `Application/Line/Change/ChangeCommandHandler.php:92`; `Domain/Line/Service/LinesDetailProvider.php:230,548`; `LabourBilling/TechnicianTaskRecords/Application/HTTP/View/ViewQueryHandler.php:165,211`; `OpenApi/WorkOrderLine/Infrastructure/Query/OpenApiWorkOrderLineQueryRepository.php:40` | The two writers stop taking input; the flag is written by the classification services (§2.4) |
| C13 | S9-R15 (v0.22): "the hidden Sales Follow Up report (its code exists …)"; "Vendors Expenses" checked | Both were deleted by SV-12106 (PR #4063, merged 2026-11-02, in v26.45.0): `SalesFollowUpReport*`, `SalesFollowUp.vue`, the commented-out nav block, `VendorsExpenses*`, `VendorTransactions.vue` | `git log` `ad09ec8a42` | Nothing built; S9-R15 v1.0 drops both (Q66 ✓) |
| C14 | S9-R15: Customers Spending excludes internal work orders "with the shared predicate" | It sums `invoice.total_balance` with **no status filter**, void included | `Reporting/Dashboard/Application/CustomersSpending/CustomersSpendingQueryHandler.php:75-90` | It gets the classification predicate, never the revenue status list (which would drop voids and change billable numbers, against rule zero) |
| C15 | S7-R2: Class "from the location of the work order" | Inventory JEs today take the Class of the line's parent labor product/service; the location's class is `bookkeeping.class_id`, resolved by `NewLineClassResolver` | `Bookkeeping/Application/Service/JournalEntryClassResolver.php`; `Bookkeeping/Domain/Service/NewLineClassResolver.php:15-37` | Category entries use `NewLineClassResolver::resolve(null)` |
| C16 | S8-R3: vendor bill lines and reclasses "follow Story 7 with the hub's accounts" | Vendor bill lines reach the hub with no account key and are routed by `part_category_id`; nothing in the bill event can name a category | `api/docs/integration/accounting-events/journal_entry_requested.v2.schema.json` (entry-level `part_category_id`) | New `vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4 carry a per-item `work_order` block, so a bill or credit line of already non-billable work posts straight to the category; reclasses only for the S7-R4 and D47 cases (§2.11, §2.12, D14 amended) |
| C17 | S4-R3 "reverses exactly the entries that were posted at Close" | A reversal inventory row never carries `reversesInventoryChangeId`, so a reversal JE re-resolves its accounts | `Invoicing/Invoice/Application/Service/InvoiceReversalService.php:328-369` | Rows that carry a category set it (both Reopen and billable Reverse); others stay unchanged |
| C18 | "a first-enable marker exists" | `Setting` holds booleans only | `Organization/Setting/Domain/Setting.php` | `internal_work_orders_first_enabled_at` |
| C19 | "store the Close snapshot" | `parts_cost`, `hours_invoiced`, `shop_supplies_charge`, `created_on` already exist on `invoice` | `Invoicing/Invoice/Infrastructure/Doctrine/Invoice.orm.xml` | New invoice columns: classification, category, cycle only |
| C20 | S2-E3: "an imported work order takes the classification of its customer at import" | Nothing imports live work orders: `WorkOrderImportedFactory` has no caller in `src/` | grep | Nothing to build |
| C21 | "a closed invoice has no customer transaction" so nothing reads it as owed | It still has `payment_status` (default `unpaid`); three repair CLIs key on it | `Invoicing/Invoice/Application/CLI/{FixInvoicePaymentStatusCommand,ReconcileInvoicePaymentStatusCommand,ReconcileInvoicePaidBalanceCommand,FixSendCorruptedPaidInvoicesCommand}.php` | Closed invoice: `payment_status = paid`, `paid_balance` 0, `due_date` null; the CLIs add `i.status <> 'closed'`; Close writes no `customer_transaction` (the create path sets it from `invoice.status->isPaid()`, `Invoicing/Invoice/Application/HTTP/Create/CreateCommandHandler.php:153-162`, which would add an UNPAID $0 row to the unpaid list); every `payment_status` reader is listed in §5 |
| C22 | "the public create path refuses internal work orders" | `POST /v1/invoices` is disabled, but `processCreate()` is also called by the sandbox seeder | `Invoicing/Invoice/Application/HTTP/Create/CreateCommandHandler.php`; `OpenApi/Sandbox/.../InvoiceSeeder` | The refusal sits inside `processCreate()` |
| C23 | Permission matrix: Change Customer needs "Work Orders — Create & Edit" | The endpoint is guarded by `ROLE_VEHICLE_CREATE_AND_EDIT` (pre-existing) | `VehicleService/WorkOrders/Application/ChangeCustomer/ChangeController.php:31-34` | Add `ROLE_WORK_ORDER_CREATE_AND_EDIT` for a service work order beside today's check; the part-sale branch is unchanged. The UI already requires it (`CustomerCard.vue:372-375`), so no user loses the action (D63) |
| C24 | S9-R3: a closed internal work order "counts as invoiced" | The Invoiced tab uses the non-void list, which would exclude `closed` once it becomes revenue-only | `Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalInvoicedTechnicianTimesheetQueryRepository.php:176-178` | That repository uses the LIVE list (§2.6) |
| C25 | Contracts package version | 1.11.0; core emits `invoice_created` 3 and `journal_entry_requested` 2; the hub supports `[1,2,3]` and `[1,2]` | `docs/integration/composer.json:6`; `docs/integration/emitted-versions.json`; `shopview-accounting/resources/accounting-contract-support.json` | Next free MINOR at merge, expected 1.12.0 (D52) |
| C26 | Settings permissions "'Settings — Service'", "'Settings — Integrations'" | Both are FE bundles with no backend atom of their own | `Auth/Domain/Model/FEPermissionEnum.php`; precedent `VehicleService/Maintenance/Infrastructure/Security/MaintenanceSettingsVoter.php:20-26,55-70` | New voters check the bundle **and** an atom |
| C27 | Errors as 409 | The FE axios interceptor treats every 409 as an expired session and logs out, unless the call passes `handlesConflictLocally` | `Invoicing/Invoice/Domain/InvoiceReversalBlockedError.php` docblock | Every new 409 is called with `handlesConflictLocally`; input errors use 422 |

---

### 1. Goal, bounded contexts, layer map

**Goal.** A work order is Billable, Internal or No Charge (written on the work order, never read from the customer). Internal and no-charge work orders carry a shop-managed **category** and no sell prices, and finish with **Close**, which creates a `closed` invoice with no receivable, payment, customer message or QuickBooks invoice. A single **line** of a billable work order can be No Charge with a category: it is priced $0.00 on one billable invoice and its parts cost posts to the category's account at invoice creation. Close and the no-charge line post parts and shop supplies cost to the category's expense account in QuickBooks (per location) and AccountingHub (per organization). Reopen and Reverse reverse exactly what was posted. Money reports leave internal and no-charge work and no-charge lines out through two shared predicates; one Internal Work Orders report lists them by work order, line and technician.

| Context | What changes |
|---|---|
| `VehicleService/WorkOrders` | classification + category on the aggregate; categories (aggregate, admin, seeding); original references; line no-charge; de-pricing / re-pricing; sell-price write policy; locks; list/detail/board projections; Close/Reopen endpoints; finish cycle |
| `Invoicing/Invoice` | `Status::CLOSED` + LIVE/REVENUE fork; classification, category, cycle on the invoice; no-charge statement columns; Close orchestration (extracted steps); Reopen; S12-R9 eligibility; documents |
| `Customer/Customers` | `company.internal`, `default_internal_category_id`; credit memo create for no-charge lines |
| `VehicleService/Vehicles` | `vehicle.internal_category_id` |
| `Organization/Setting` | toggle, two markers, enable endpoint |
| `Inventory` | `inventory_changes.expense_category_id` + `work_order_cycle`; receive view `sellPriceSuppressed`; the vendor-invoice edit calls the sell-price policy |
| `Accounting` | new `CostEntry` module (integration-neutral cost entries); outbox payloads v4/v3/v1; category emission; onboarding phase |
| `Bookkeeping` | per-category QuickBooks rows, category account resolution, extended JE claim + cost JE claim, vendor-bill line accounts, invoice line at 0.00 |
| `Reporting`, `Dashboard` | predicate sweep, Internal Work Orders report, Technician Efficiency chip, export option |
| `Search` | `classification` + `displayStatus` on the work-order document; reindex |
| `External/CustomerPortal`, `OpenApi` | exclude closed invoices (S3-R4) |
| `Communication/Notes` | new system-note metadata types |

Layer order inside every phase: migration + mapping → Domain → Application → Infrastructure (queries) → UI (DTOs, controllers) → tests.

---

### 2. Cross-cutting design (read before the phases)

#### 2.1 Domain vocabulary

```php
// src/VehicleService/WorkOrders/Domain/Classification.php   (pattern: Priority.php)
enum Classification: string { case Billable = 'billable'; case Internal = 'internal'; case NoCharge = 'no_charge'; // VARCHAR(9)
    public function isBillable(): bool { return self::Billable === $this; } }

// src/VehicleService/WorkOrders/Domain/Category/
final class WorkOrderCategoryId extends Uuid {}
enum CategoryList: string { case Internal = 'internal'; case NoCharge = 'no_charge'; }
final readonly class CategoryKey {   // ^[a-z][a-z0-9_]*$, <= 64, never a colon (D50)
    public const GENERAL_INTERNAL = 'general_internal'; public const WARRANTY = 'warranty';
    public const GOODWILL = 'goodwill'; public const COMEBACK = 'comeback';
    public static function forShopAdded(WorkOrderCategoryId $id): self { /* 'c_' . 32 hex of the id */ } }
class WorkOrderCategory extends AggregateRoot { /* §2.4 */ }

// src/VehicleService/WorkOrders/Domain/OriginalReference/
class OriginalReference { /* subject (work_order|line), original WO id + number snapshot | not in ShopView, original line id + number + title snapshot */ }
class OriginalTechnician { /* staff id */ }
final readonly class ClassificationTransition { /* from, to, categoryChanged */ }
```

Mapping of `classification` follows `priority` (`WorkOrder.orm.xml:59`): `<field name="classification" type="string" length="9" enum-type="…\Classification"><options><option name="default">billable</option></options></field>`, appended after `coreChargedFromQuote`. `category_id` is a nullable `binary_uuid` holding a `WorkOrderCategoryId`. Invoicing keeps its own copy, `Invoicing/Invoice/Domain/InvoiceClassification.php`, as `Invoicing\Invoice\Domain\WorkOrder` already is its own embeddable; importing `WorkOrderCategoryId` across contexts is allowed (`architecture.md` → Cross-Context Access).

#### 2.2 WorkOrder aggregate behavior (no public setters)

```php
// WorkOrder.php — appended state
private Classification $classification = Classification::Billable;
private ?WorkOrderCategoryId $categoryId = null;     // set iff classification != billable
private int $finishCycle = 1;                        // D51, §2.7

public function classifyAtCreation(Classification $c, ?WorkOrderCategory $category): void;   // part sale ⇒ Billable only (NFR-008); list must match
public function convertToNoCharge(WorkOrderCategory $c): ClassificationTransition;            // only Billable, unlocked, setting on; deposit ⇒ refused upstream (S2-N4)
public function changeCategory(WorkOrderCategory $c): void;                                    // only NoCharge, unlocked; also when only the original changes (S2-R6, Q36 ✓)
public function convertToBillable(): ClassificationTransition;                                 // only NoCharge, unlocked; allowed with the setting off (S2-N1)
public function makeInternal(WorkOrderCategory $resolved): ClassificationTransition;           // Billable → Internal, unlocked
public function followCustomer(bool $customerIsInternal, bool $settingOn, ?WorkOrderCategory $resolved): ?ClassificationTransition;
public function reresolveInternalCategory(WorkOrderCategory $resolved): void;                  // open Internal only (S2-R1, Q32 ✓)
public function isNonBillableService(): bool { return $this->type->isService() && !$this->classification->isBillable(); }
```

`followCustomer()` truth table (S2-R7, S2-N1): setting off → Billable unless currently No Charge and the target is regular (the mark and category survive); target internal (setting on) → Internal with the resolved category (a No Charge category is dropped); target regular from Internal → Billable; target regular from No Charge → No Charge, category kept; billable stays billable. An invoiced or paid billable work order returns null (the customer changes, nothing else); a closed internal or no-charge one never reaches it (D33 refusal upstream). `ClassificationTransition` tells the application service whether to de-price (into non-billable), re-price (into Billable) or only reset the flat shop supplies (Internal ↔ No Charge, S10-R2). Recording log entries, notes and audit stays in Application.

Lock: `assertClassificationUnlocked()` refuses on invoiced/paid status (closed is invoiced underneath, D2).

#### 2.3 Line behavior (Story 12)

```php
// Line.php — appended state (work_order_line.no_charge_category_id)
public function markNoCharge(WorkOrderCategory $c): void;            // No Charge list only
public function changeNoChargeCategory(WorkOrderCategory $c): void;
public function markBillable(): void;
public function isNoCharge(): bool;
```

Refusals live in `Application/Service/Line/LineNoChargeMarker.php` because they read sibling state: the work order is internal or no charge as a whole (S12-N2); the work order is invoiced (S12-N3); the line is declined, or has a return or a credit (S12-E8); the setting is off for Mark (S12-N1; Change category and Mark as Billable stay available, Q37 ✓). A deposit never blocks (S12-R4). Converting the whole work order to No Charge clears every line's mark and line reference (S2-R5: "the lines' own categories are replaced").

#### 2.4 Categories: keys, default, archive, resolution

- **Aggregate** `WorkOrderCategory`: `createInternal(name, isDefault)`, `createNoCharge(name, requiresOriginal)`, `rename`, `setRequiresOriginal` (No Charge only), `markDefault` / `unmarkDefault` (Internal only), `archive` (refused for the default), `restore`. Name 1..60, unique within its list among active **and** archived categories (Q39 ✓: "A category with this name is archived. Restore it instead."). The key never changes (S1-R16).
- **One default** per organization: `DefaultInternalCategoryPolicy` moves the flag inside one transaction under a row lock on the organization's `setting` row.
- **Bounds**: at most 100 active categories per list (`category_limit_reached`, 422); lists are tiny and unpaginated.
- **Starting set** (S1-R13, S13-R1): General Internal (default), Warranty (requires original), Goodwill, Comeback (requires original), with the fixed keys of `CategoryKey`. Seeded by `StartingCategoriesSeeder` (idempotent, insert-if-missing by key), called by a subscriber on `OrganizationRegistered` and by the release CLI (§2.15).
- **Resolution** for a new or made-internal work order (S1-R16, S2-R1): `Domain/Category/Service/InternalCategoryResolver` = the asset's category, else the customer's default, else the organization default; the first **active** one wins. Ports (`*QueryRepositoryInterface`, DBAL in `Infrastructure/Persistence/Query/Dbal/`): `AssetInternalCategoryReaderInterface` (over `vehicle.internal_category_id`) and `CustomerDefaultInternalCategoryReaderInterface` (over `company.default_internal_category_id`), each with a batch form (ids in, map out) for Make internal.
- **Re-resolution** of an **open** internal work order: when its asset is swapped (`Application/HTTP/VehicleSwitch/VehicleSwitchCommandHandler.php:41`, `Application/HTTP/ChangeVin/ChangeVinCommandHandler.php:82`, `Domain/UpdateWorkOrdersOnVehicleChange.php:113`, `Domain/WorkOrderVinChanged.php:35`) and when the asset's category or the customer's default is edited (Q32 ✓): the set is that asset's or that customer's open internal work orders, re-resolved through the aggregate one at a time inside the edit's transaction (a small set; re-checked with prod query Q20 together with Make internal). Closed work orders never change.
- **Archived categories** stay on work orders, lines, invoices, statements and documents; they are never offered in a select (options endpoint `include_archived=0`), and appear in the report filter under Archived. Their QuickBooks and hub rows stay editable (Q40 ✓). Reopen then Close of a work order whose category was archived in between keeps that category (S12-E8).
- **Derived Warranty flag** (S2-R22): written by the classification and line services, never from input: `true` iff the line is No Charge, or its work order is No Charge as a whole (Q44 ✓), with category key `warranty`; `false` when that stops being true. Lines that carry `is_warranty = 1` today are never touched.

#### 2.5 Original work order, line and technicians

- Stored in `work_order_original_reference` (subject = the work order or one line) + `work_order_original_technician` (D55). A reference holds either an original work order (id + number snapshot, kept as text if the original is deleted, S12-E5) or "Not in ShopView", and optionally an original line (id + number + title snapshot).
- `Application/Service/OriginalWork/OriginalReferenceWriter.php` validates: the original belongs to the **same customer**, at a location the user can access (Q38 ✓), with status invoiced/paid or closed; the line belongs to it. It replaces the reference and its technicians in one write. Called by create, Convert to No Charge, Change category, Close (the select inside the confirmation, S3-R2) and the three line actions.
- **Technicians** (S2-R17, D55, Q42 ✓): with an original line, its roster exactly as `DbalLineTechnicianRosterFetcher` shows it (`:48-51`: manual and shift entries; the lead technician when the roster is empty); without a line, the original work order's `tech_assigned_id`; "Not in ShopView" or nothing → none (the report's Unassigned). One query per save.
- **Required** for categories with `requires_original_work_order`: at Close (S3-R2) and before Create invoice for a no-charge line (S12-R9). Optional everywhere else.

#### 2.6 Invoice status fork (D3), made into a compile-time forcing function

```php
// src/Invoicing/Invoice/Domain/Status.php
public const CLOSED = 'closed';
public function isClosed(): bool { return self::CLOSED === $this->value; }
/** Invoice exists and counts for "is this WO invoiced/closed?" (duplicate guard, pricing freeze, delete guard). */
public static function getLiveStatuses(): array { return [self::PENDING, self::SENT, self::PAID, self::PARTIALLY_PAID, self::CLOSED]; }
/** Invoice is a sale: every money report, dashboard, sales tax, onboarding receivable. */
public static function getRevenueStatuses(): array { return [self::PENDING, self::SENT, self::PAID, self::PARTIALLY_PAID]; }
// getNotVoidStatuses() is DELETED — every caller picks one (§5). getLabel(): CLOSED => 'Closed'.
// getApiArray() unchanged: closed is never offered in the app's invoice status filters (D37).
```

`NonVoidInvoicePredicate` is renamed in place to `RevenueInvoicePredicate` (same `PARAMETER` / `sql()` API, `statuses()` returns the revenue list), with a sibling `LiveInvoicePredicate` for the one live report (Technician Efficiency invoiced). Deleting `getNotVoidStatuses()` matters because its docblock says "add every new status here", and the onboarding fetchers rely on that ("a status core adds later is automatically included", `Accounting/Outbox/Infrastructure/Doctrine/AccountingOnboardingSourceFetcher.php:1227`); keeping the name would include `closed` silently.

#### 2.7 Finish cycle (D51)

- `work_order.finish_cycle SMALLINT UNSIGNED NOT NULL DEFAULT 1`: the cycle the work order's **next or current** finish belongs to.
- Close and Create invoice (service work orders) copy it to `invoice.work_order_cycle`; the relabel stamps it on the INVOICE_CREATE inventory rows that carry a category; cost entries carry it (§2.11).
- Reopen and billable Reverse increment it by 1, **after** the reversal entries are built in the same transaction, so every reversal carries its original's cycle and every later entry carries the next one.
- Part sales are never counted: their invoices carry `work_order_cycle = null` (the hub contract allows null). Invoices created before the release carry null too.
- Purpose: the hub orders one work order's family entries by `(cycle, forward before reversal)` (S4-R3). QuickBooks idempotency does not need it (inventory change ids and cost entry ids are already unique per finish).

#### 2.8 Close orchestration (D4): extract, then compose

`CreateCommandHandler::processCreate()` is split into steps both paths call, without changing the billable order:

| Step service (new, `Invoicing/Invoice/Application/Service/Issue/`) | Body moved from | Billable | Close |
|---|---|---|---|
| `InvoiceDraftBuilder::build(WorkOrderPricingDto, …)` | `InvoiceBuilder::buildInvoice` call | ✓ | ✓ (zeros; classification, category, status, cycle set) |
| `InventoryPickRelabeler::relabel(WorkOrderId, OrgId, Invoice)` | `updateInventoryChanges()` | ✓ (+ stamps category/cycle on no-charge-line rows) | ✓ (+ stamps the work order's category/cycle on every row) |
| `InvoiceAccountingEmitter::emitCreated(Invoice)` | `recordAccountingEvents()` | ✓ | ✓ |
| `CostEntryPlanner::planForFinish(Invoice)` (Accounting, §2.11) | new | ✓ (line reclasses, billable-back; no rows on plain billable work) | ✓ (shop supplies, reclasses) |
| sale-only steps (status → paid, customer account/transaction, `recordInvoiceCreatedEvent`, carry credit, `invoiceIsPaid`, `syncBookkeeping` invoice, auto-apply deposits, portal notifier, payment/credit QuickBooks syncs) | stay in `processCreate()` | ✓ | ✗ |

`InvoiceIssuanceEligibility::assertEligible(WorkOrder, Workplace)` (Domain service) holds the pre-validation moved from `CreateCommand` (complete, no live invoice, ≥ 1 completed line, no incomplete lines, no blocking parts, no unresolved cores) with byte-identical messages, plus the S12-R9 rule (§2.10). `processCreate()` refuses a non-billable service work order ("This work order is internal or no charge. Close it in ShopView.", the PRD §8 copy) for every caller (C22).

**Close never calls `Invoice::recordInvoiceCreatedEvent()`.** That domain event is the only trigger for the work order status change to invoiced/paid, the $0 `customer_payment` and the `invoice.created` webhook and portal notifier payload; skipping it suppresses all three by construction (S3-R4, NFR-009). Close sets the work order status to invoiced itself in the same transaction, calls `Invoice::invoiceCreated()` (integration event → work-order history snapshot), and never calls `invoiceIsPaid()` (no "Invoice paid" log, no `invoice.paid` webhook).

#### 2.9 Price model (one read chokepoint + write-time zeroing)

> The customer portal keeps its own replica of core's work-order pricing (`shopview-portal` `app/Services/Core/Pricing/WorkOrderFinancialsCalculator.php`, reading core's tables directly); it must mirror this mask (Appendix D P3), backed by a fixture shared with `WorkOrderLinePricingNoChargeTest` so a change on either side fails visibly.

- **Read chokepoint** — `WorkOrderPricing::buildWorkOrder()` (`VehicleService/WorkOrders/Domain/Service/WorkOrderPricing.php:239-305`), lines from `getLinesData()` (`:211-237`, which also selects `wol.no_charge_category_id`):
  - non-billable service work order: every line's labor and part sell 0, no tax, no adjustments, shop supplies = the flat amount (§2.13); costs and hours unchanged;
  - no-charge line on a billable work order: `WorkOrderLinePricingDto::isNoCharge()`; `getLaborPrice()` returns 0 and `getTotalPartsPrice()` skips the line's parts (same shape as declined, `WorkOrderLinePricingDto.php:57-64,154-175`); no labor tax (`WorkOrderPricing.php:271-276`). Work-order fees, discounts and the shop supplies percentage (base = total labor price, `WorkOrderShopSuppliesCalculator.php:38`) are computed on billable lines only (S12-R4).
  - `DoctrinePartSaleListPricingPreloader` gets the same column — `PartSaleListPricingPreloadParityTest` pins both SELECT lists (`WorkOrderPricing.php:205-207`).
  - Cores (S2-E7, S12-E3, D66): the mask covers `is_core = 1` part rows, whose sell price is otherwise the core charge (`WorkOrderPartsAndLinesHydrator.php:129-141` zeroes only an unresolved core), so NOT OK charges the customer nothing on non-billable work or a no-charge line; `PricingCalculator::sellPrice()` returns 0 for them on write; `WorkOrderBillablePricer` prices a core from its stored cost like the part on exit.
- `LinesStatsFetcher` / `WorkOrderStatsFetcher` (`WorkOrderStatsFetcher.php:162-188`) report a no-charge line's labor and parts price as 0 for the work-order statistics; costs and hours stay.
- **Write-time zeroing** (raw-column readers such as WIP, Parts Velocity and search never see a stale price):
  - `PricingCalculator::sellPrice()` (`Domain/PartRequest/PricingCalculator.php:47`) returns 0 when the owning work order is non-billable service or the line is no charge.
  - `WorkOrderDepricer` (Application), on entry into non-billable and on Mark as No Charge (scoped to the line): part requests and parts `setSellPrice(0)` with the hand-set flag cleared (S2-E4); fixed labor price, Fixed Line Total and its two portions removed (`Line.orm.xml:36-44`, S2-R20), returning a `RemovedPricing` summary for the system note ("Fixed line total $1,250.00 removed"); work-order-level and line-level adjustments bulk-deleted through the ORM (S2-R15; on a line only its own discount, S12-R4); flat shop supplies = customer Min or 0 (S10-R1); no IBS call: there is no cancel path (the IBS client offers GET and POST only, `Invoicing/Invoice/Domain/IBS/HttpClient.php:29-39`; `ChangeIBSApprovalCommandHandler` requests an approval by code), so on entry into non-billable the IBS approval card is hidden and the stored `ibs_approval` row is left as it is (S2-E6 v1.0, D67, Q63 ✓). A line mark withdraws and re-sends nothing, as a price change today: the changed line cost changes the approval hash (`Sha256HashService`), so Send to Portal is allowed again and the advisor re-sends; IBS is re-requested by the advisor with the new amount (S12-R4, D67). `labour_type_id` is kept (it carries the labor cost and class mapping); a fixed-price line that stores no labour type (LineDialog sends none for fixed lines, `LineDialog.vue:1168`) gets the customer's labour type, else the location's default, with its stored labor cost and hours unchanged, so Edit Line can save it and Mark as Billable / Convert to Billable price labor at rate (D62; `LinesDetailProvider.php:385-395` derives the fixed pseudo types only from the fixed columns).
  - The labor + parts = total check (`Application/Line/Change/ChangeCommand.php:181-185`) is skipped on a line without a total, and fixed-price input on a non-billable work order or a no-charge line is refused with 422 `fixed_price_not_available` (S2-R20).
- **No sell price is ever written back** (S2-R19): `Domain/Service/SellPriceWritePolicy::mayWriteSellPrice(PartRequest|Part)` (false for a non-billable work order or a no-charge line), checked at the seven sites of C11. On those, cost is still written; the derived, submitted or repriced sell price and the core-charge-as-price are not. `DeliveryItemModifier` sits in Inventory and writes WorkOrders entities directly (legacy cross-context write): rung **delegate** — it calls the WorkOrders port `SellPriceWritePolicyInterface`; moving the write out of Inventory is an SV-12051 ticket. The receive view (`Inventory/Orders/Infrastructure/Persistence/Query/Dbal/DbalOrderReceiveViewFetcher.php:63`) returns `sellPriceSuppressed` per item so the FE shows the cost-only notice; the vendor-invoice item view gets the same flag (Q48 ✓).
- **Re-pricing on exit** (D34): `WorkOrderBillablePricer`, per work order or per line: labor at the customer's labor rate, else the location's default, through the setter the line-create path uses; parts via `PricingCalculator::sellPrice(changePricing: false)` on **the cost already stored on the line**; flat shop supplies set to null so the % rule applies again (S10-R2); fees and discounts not restored (S2-R15); fixed amounts not restored (S2-R20).
- **No auto-apply at creation** (S2-R21): `Application/Subscriber/ApplyDefaultAdjustmentsOnWorkOrderCreatedSubscriber.php:75` returns early for a non-billable service work order (classification is set before the first save, so the event carries it); part sales (`:80`) and billable work orders unchanged.
- `Organization/LabourTypes/Application/Change/LaborRateChangeCascade.php:79` skips `classification <> 'billable'` (nothing to update, S2-E1).

#### 2.10 Statement, snapshot and inventory stamps for a no-charge line

- **Statement** (`InvoiceBuilder::addStatements()`, `InvoiceBuilder.php:211-310`; `Invoicing/Invoice/Domain/Statement.php`): for a no-charge line — `price` 0; `time_estimate` = the line's hours (unlike declined); `labour_rate` 0 and `no_charge_labor_rate` = the line's rate in cents (kept for the record, read by nothing that prices); items priced 0 whatever the part's stored sell price (`:278-289`); tax weights 0 (`:265-271,292-297`); `no_charge_category_id` set (the S12-R7 flag); `no_charge_parts_cost` = the line's parts cost in cents from the same stats run, frozen (for the report and the hub). A pending-invoice rebuild (`updateInvoice()`, `:162-202`) rebuilds the same columns.
- **Snapshot** (S9-R1): `InvoiceFinancialSnapshotService::capture()` (`:107-139`) asks `WorkOrderStatsFetcher::getStats(..., excludeNoChargeLines: true)`, threaded to `LinesStatsFetcher` (`:47-78,88-112,347-387`) through `NoChargeLinePredicate::excludeLine('wol')`; the default stays false. `captureFromPersistedInvoice()` (`:195-236`) skips statements carrying `no_charge_category_id` as it skips declined ones. The invariant `labor_sell + parts_sell + shop_supplies_charge + invoice_level_adjustments == subtotal_with_discount` holds because the line is priced 0.
- **Core cost is never Parts cost** (S2-E7, D66): for a closed record's snapshot and for a no-charge line's `no_charge_parts_cost`, `LinesStatsFetcher` takes an `excludeCores` flag that drops `is_core = 1` rows from the part and part-request sums and skips the `Core ok` return requests (`LinesStatsFetcher.php:121,145,299,307,315,323`), so the NO CHARGE document and the report show parts without cores. The flag defaults to false, so billable invoices, the Stats tab, the sales reports and WIP are unchanged (rule zero, S9-R14). Posting is a separate path and includes core cost: a stock pick's cost already carries the core purchase price (`Inventory/Parts/Domain/InventoryActions/WorkOrderInventoryChangedEventSubscriber.php:27,63-66`), so its journal entry posts the core with the part to the category account (S12-E3); the vendor core charge is its own bill line (`inventory_delivery_item.is_core`) and follows S7-R3; a core returned to inventory after OK (`CorePartReturnToInventoryCommandHandler` → `PartQuantityChangedEventManualChangeSubscriber.php:39-96`) credits the category account instead of Cost of Parts when the work order or line is non-billable (S7-R3a). The Close preview's `stock_parts_cost` is the posted amount and carries `stock_parts_core_cost` (cents: the cost of the picked `is_core = 1` rows inside it, the same rows `excludeCores` drops; 0 when none) for the row's "$[amount], includes $[core amount] core cost" (S2-E7, S3-R2 v1.0, Q65 ✓). Tests: `tests/Unit/VehicleService/WorkOrders/Domain/Line/LinesStatsFetcherExcludeCoresTest.php` (NOT OK, OK and pre-resolved cores left out with the flag; default unchanged), functional `tests/Functional/VehicleService/WorkOrders/InternalWorkOrders/CoreCostTest.php` (closed record and no-charge line snapshots without core cost; the Close preview's `stock_parts_core_cost` equals the picked cores' cost inside `stock_parts_cost`, 0 without cores; customer charged nothing on NOT OK; Mark as Billable prices the core; a billable invoice's `parts_cost` byte-identical to today).
- **Inventory stamps**: `InventoryPickRelabeler` writes `inventory_changes.expense_category_id` and `work_order_cycle` on INVOICE_CREATE rows — whole work order: its category on every row; billable work order: the row's line category (`inventory_changes.work_order_line_id`) where the line is no charge. `InvoiceReversalService::reverseInventoryChange()` (`:328-369`) copies both columns onto the INVOICE_REVERSE row and, **only when the original carries a category**, sets `reversesInventoryChangeId` (C17). Rows without a category are byte-identical to today (NFR-008). A credit-memo restock of a no-charge line's part (`PartSaleCreditProcessor::recordRestoredInventoryValue()`, `VehicleService/WorkOrders/Application/Service/PartSaleCredit/PartSaleCreditProcessor.php:836-916`, through `InventoryValueAdjustmentRecorder`) copies the statement's category onto its row (S12-E7 v0.22: "its cost is reversed from the category account to inventory with the same entry a return on an internal work order uses"): QuickBooks posts it Dr Inventory Asset / Cr the category account: today nothing calls `JournalEntrySyncService` on the credit path (`PartSaleCreditSyncService` → `CreditMemoSyncer` posts no inventory entry, so a billable credit restock reaches QuickBooks with no entry, unchanged here), so Phase 6 adds a post-commit call for a restock row that carries `expense_category_id`, and for its void's reversal row, exactly as `PartQuantityChangedEventManualChangeSubscriber.php:95` does for a manual inventory change — the same entry a return on an internal work order uses (S12-E7), claimed in `bookkeeping_journal_entry` like every stock-part entry (C1); and the hub gets the JE v3 family block with `entry_kind` `credit_return` (scope `line`), Dr `inventory_asset` / Cr `work_order_category_expense`, instead of today's ordinary entry on `cogs_parts`; the credit memo's void reverses it by reference (`findRestoreToReverse`, `:875`) (D69).
- **S12-R9**: `InvoiceIssuanceEligibility` refuses Create invoice while a no-charge line of a requiring category has no original reference: `NoChargeLineOriginalRequiredError` (409, `{line_id, line_title}`, "Line '[title]' needs its original work order (or Not in ShopView) before the invoice."). It runs inside the create transaction under the work-order row lock, so a concurrent line edit cannot slip past it.
- **S12-R10**: every line No Charge → the billable invoice is $0 and takes today's $0 path (auto-paid). No change.
- **S12-E7 / Q35 ✓**: Issue Credit (`Customer/Customers/UI/HTTP/CreditMemo/Create/CreateController.php` and its handler) lists a no-charge line's parts at a fixed $0.00 credit amount (input refused if not 0) and with no restocking fee: a non-zero `restockingFee` on such a row (`CreditMemo/Create/CreateRequestDto.php:46` accepts one per row today) is refused with 422 `restocking_fee_not_allowed` (S12-E7 v1.0), covered by the credit functional test; the part returns to stock; its inventory row carries the category, so the cost moves back from the category account. A $0 credit memo is never "spent", so it never blocks a reversal (`InvoiceReversalService.php:80-100` voids open credits).

#### 2.11 Cost entries and QuickBooks

**Integration-neutral cost entries.** Stock parts are already recorded per row in `inventory_changes`. Every other internal/no-charge cost movement is recorded once, in core's own accounting data, before either integration sees it: `src/Accounting/CostEntry/Domain/WorkOrderCostEntry.php` (aggregate, `WorkOrderCostEntryId`), table `work_order_cost_entry`. Both integrations post from the same rows: the outbox builds the hub's JE from it (its id is the hub `source_id`), and QuickBooks claims it in `bookkeeping_cost_journal_entry`. It cannot live in a `bookkeeping_*` table because an organization can run AccountingHub without QuickBooks.

| `entry_kind` | Written when | Amount | QuickBooks legs | Hub legs (JE v3) |
|---|---|---|---|---|
| `shop_supplies` | Close, amount > 0 (S7-R4a, S10-R4) | `invoice.shop_supplies_charge` | Dr category account / Cr income account of the Shop supplies item, else ShopView Review (S10-N2) | Dr category / Cr `expense_shop_supplies` |
| `bill_reclass` | Close, for a bill line whose bill posted on today's routing (routing stamp null: the work order was billable when the item was first recorded, S7-R4) or that sits on another category (D47, second half); billable invoice creation, the same for bill lines of no-charge lines (S7-R8). **Never at bill time**: a bill on an already non-billable work order or line posts straight to the category in both integrations (S7-R3) | bill line amount (`quantity_delivered × price`) | Dr category account / Cr the bill line's stored account; **none** when they are equal (the bill already posted straight to the category, S7-R3) | Dr category / Cr `cogs_parts` + `part_category_id` |
| `credit_reclass` | at the same moments as `bill_reclass`, for a credit line that posted on today's routing because its bill line sat there (S7-R3a: the credit follows its bill line) | credit line amount | Dr the credit line's stored account (`bookkeeping_vendor_credit.line_account_ids`; a credit synced before this release counts as `costOfPartsId`, today's credit routing, `VendorCreditSyncService.php:165-167`) / Cr category account; none when equal | Dr `cogs_parts` + `part_category_id` / Cr category; for a credit line the hub received without an item (sent as v3, or with `items: []`, so it posted whole to Parts Inventory) Dr `inventory_asset` / Cr category |
| `billable_back` | billable invoice creation, for a bill line sitting on a category (stamped at bill time, or moved there by a reclass not reversed) once the work order or line is billable (S7-R4 last sentence, S7-R8 Mark as Billable, S12-R5); also the first half of a D47 move for a line its bill posted to the old category directly | bill line amount | Dr the account `PerLineCogsAccountResolver` resolves today / Cr the stored account; as the first half of a D47 move it carries `pair_of` and posts **nothing** in QuickBooks, because the second half posts the whole move as one entry, stored account → new category (S7-R4, D68) | Dr `cogs_parts` + `part_category_id` / Cr category |
| `credit_back` | at the same moments as `billable_back`, for a credit line sitting on a category | credit line amount | Dr category account / Cr the account today's credit routing gives the line (`inventoryAssetId` with an inventory part, else `costOfPartsId`, `VendorCreditSyncService.php:165-167`); as the first half of a D47 move, `pair_of` set and nothing in QuickBooks (D68) | Dr category / Cr `cogs_parts` + `part_category_id` |
| reversal (`reverses_id` set, same kind, same cycle) | Reopen, billable Reverse, and a category move — written at Close or invoicing, never at the category change itself (S7-R4; D47: reverse the earlier reclass, then a new reclass — no entry ever names two categories); the reversal is the first half of a D47 move when the line sits on the old category through a reclass | the original's | the original claim's stored accounts swapped; none if the original was never posted | `reverses_source_id` = the original id; block repeated |

Columns: `id`, `organization_id`, `workplace_id`, `work_order_id`, `cycle`, `invoice_id` NULL, `pair_of` NULL (D68), `scope` (`work_order|line`), `work_order_line_id` NULL, `category_id`, `entry_kind`, `delivery_item_id` NULL, `vendor_credit_item_id` NULL, `part_category_id` NULL, `amount` (cents), `entry_date`, `reverses_id` NULL, `created_at`. Unique `woce__reverses_id_unq` (one reversal per entry), index `woce__organization_id_work_order_id_cycle_idx`, index `woce__delivery_item_id_idx`. Written by `Accounting/CostEntry/Application/CostEntryPlanner.php` inside the business transaction (Close, invoice create, Reopen/Reverse, category change after a bill); no external call inside it. `planForBill` writes no bill-time entry (on an amend after a reclass moved the line, it keeps the line whole where the planner has it: reverse the earlier reclass, then reclass the new amount); `planForCredit` writes no credit-time entry — credits move only with their bill line, at Close or invoice creation.

**Category account rows (S5).** `work_order_category_quickbooks_account` (Bookkeeping). The QuickBooks page shows one row per category directly under Cost of Parts, Internal list first (default first, then name), then No Charge by name, archived greyed with their mapping; rows render for every connected location the user can access and are stored on first save (D54). Rows exist whether or not the setting is on (S5-R5). The category dialog and the QuickBooks page write the same row (S5-R3). Pickers list the location's **expense-type** accounts from the local options snapshot (D46 amended, Q52 ✓).

**Account resolution.** `Bookkeeping/Application/Service/WorkOrderCategoryAccountResolver.php`: the category's row at the work order's location ?? ShopView Review, through a new `FallbackAccountResolver::resolveCategoryExpense()` that reuses `resolveReviewAccount()` (`Bookkeeping/Application/Service/FallbackAccountResolver.php:152`). There is **no** fallback from one category row to another or to Cost of Parts (S5-R4, S5-E2). A deleted or inactive mapped account fails into QB Unexported like every other row (S5-E1, S7-N2).

**Stock-part JEs** (S7-R2, S7-R8). `JournalEntrySyncService` (`:150-189`): for an inventory row carrying `expense_category_id`, the category account replaces the per-part-category COGS / Cost of Parts leg (`:163-172`); the Inventory Asset leg and the two-account gate stay (`:176`, `Bookkeeping/Domain/Service/BookkeepingService.php:128`, D35 / S7-N5). Class = the location's class (`NewLineClassResolver::resolve(null)`, C15); memo `"<generated description>; WO #<n> · <Internal|No Charge> · <category>"`; date = the invoice's `created_on` (the posting date at Close, the invoice date for a line). Idempotency is the existing claim (C1); `markPosted` now also stores the debit and credit account ids, and a row with `reversesInventoryChangeId` whose original claim holds accounts posts those accounts swapped (exact reversal, S4-R3, S12-R8). Close has no QuickBooks invoice, so its post-commit step calls the sync per INVOICE_CREATE row itself (today the JEs follow the invoice sync). For a row carrying `expense_category_id`, the Close, Reopen and invoice-time (no-charge line) callers pass the subgroups `journal_entry_internal_close`, `journal_entry_internal_reopen` and `journal_entry_no_charge_line` to `sync($inventoryChangeId, $subgroup)` (`JournalEntrySyncService.php:65`) instead of today's work-order create / reverse ones (the INVOICE_REVERSE rows of a billable Reverse that carry a no-charge line's category, and the D69 Issue Credit restock of such a part and its void, take `journal_entry_no_charge_line`), with `additionalInfo` {`workOrderNumber`, `classification`, `category`}, so a rejected stock-part entry lands in QB Unexported with the S7-N3 v1.0 type, work order number and classification, like the cost entries below.

**Cost JEs.** `Bookkeeping/Application/Service/Sync/CostJournalEntrySyncService.php`: for each new `work_order_cost_entry` of the location, claim it in `bookkeeping_cost_journal_entry` (unique `(bookkeeping_id, cost_entry_id)`, saved `pending` before the call), resolve the legs above, post, mark `posted` with the external id and accounts, or `failed` with a `bookkeeping_log` row (`GROUP_JOURNAL_ENTRY`, subgroups `journal_entry_internal_close`, `journal_entry_internal_reopen`, `journal_entry_no_charge_line`; `reference_id` = claim id; `additionalInfo` {`workOrderNumber`, `classification`, `category`}, which feed the QB Unexported reference and subject, S7-N3). Parts entries (`bill_reclass`, `billable_back` and their reversals) follow the two-account gate; shop supplies posts regardless (D35). Runs after commit; a failure never fails the request.

**Withdrawn and hand-exported** (D38, generalized). Writing any reversal marks the original's unposted claim (`pending|failed`) `withdrawn` and posts nothing for it — Reopen for its cycle, and a category move for the reclass it reverses, so a pending entry can never be exported later and move the cost twice; an entry that posts nothing in QuickBooks (`pair_of` set, or equal accounts) gets no claim at all and never shows in QB Unexported; QB Unexported shows the withdrawn row with no Export / Mark as Exported and the reason for its cause, carried as `withdrawn_reason` (`reopened` | `invoice_reversed` | `category_changed`, from the reversal that withdrew it): "Withdrawn: work order reopened" for Reopen (S4-E1), "Withdrawn: invoice [number] reversed" for a billable Reverse, "Withdrawn: category changed" for a category move (the PRD has copy only for Reopen); `exported_by_hand` counts as posted and gets its reversal (S7-E2).

**Vendor bills per line** (S7-R3, S7-R8, D7). `PerLineCogsAccountResolver::resolveByItem()` (`Bookkeeping/Application/BookkeepingVendorBill/Service/PerLineCogsAccountResolver.php:44-86`) gets a `WorkOrderCostRoutingLookupInterface` port (Bookkeeping Domain; DBAL implementation: one query per delivery, delivery item → part request → line `no_charge_category_id` / work order classification + category). A line of a non-billable work order or a no-charge line resolves to its category account; every other item resolves exactly as today. **Frozen routing:** the lookup runs once per delivery item, inside the transaction that first records it on a bill, and stamps `inventory_delivery_item.expense_category_id` / `expense_work_order_cycle`; `resolveByItem()` and the hub payload builder both read the stamp (never live classification), an amend re-sends it for existing items and stamps added ones, and the window replay rebuilds from it, so QuickBooks, the hub and the planner agree where each line sits. A returned line's routing is stamped on `vendor_return_item` (`expense_routing` = `category` when its bill line sits on a category or the work order is closed, `bill_line` when it follows a bill line still on today's routing; `expense_category_id`) **in the credit-creation transaction** (`CreateCreditWhenReturnCreditsGetConfirmed`), so a QuickBooks-only organization gets it too; QuickBooks, the hub builder and the planner read only that stamp, never live classification or the Close state. Only stamped lines change account; every other credit line posts exactly as today (`VendorCreditSyncService.php:151-171`), so billable books are untouched. The credit sync stores each line's posted account in `bookkeeping_vendor_credit.line_account_ids` (as D7 does for bills), and `credit_reclass` / `credit_back` move from that stored account. Bills sent to the hub before the version raise carry no category, so Close reclasses them as S7-R4 bills. `VendorBillCreateSyncService`, `VendorBillUpdateSyncService` and `DeferredVendorBillSyncs` store each item's account in `bookkeeping_vendor_bill.line_account_ids` beside `line_class_ids` (SV-11585 shape, `migrations/Version20261028104035.php`). `VendorCreditSyncService` credits a stamped line to the account its stamp names: the stored bill-line account through `OriginalBillLineAccountResolver` (sibling of `Bookkeeping/Application/BookkeepingVendorBill/Service/OriginalBillLineClassResolver.php`) when the bill line still sits there, the category account when the stamp names a category (S7-R3a). Bills synced before this release have no stored account: the reclass treats the account as the one `PerLineCogsAccountResolver` resolves today (documented approximation).

**Invoice line at 0.00** (S7-R8, S9-R13). `InvoiceGenerator` (`:272-301`) selects `iss.no_charge_category_id` and the category name; `InvoiceData::buildRows()` (`:193-238`) writes rate 0.00 and amount 0.00 on the labor row and on every part row of such a statement and appends the category name to the description; items and tax code unchanged. The declined filter (`:321,330`) stays. Both the QuickBooks invoice sync and the Customer Invoice CSV read these rows. Nothing about Close reaches `InvoiceCreateSyncService`, so no QuickBooks customer is created for a closed work order (S7-R1).

**Create invoice confirmation** (S7-R8 v1.0: one "Moved from [account] to [account]" row per move). N8 (`vendor-bill-cost-moves`) accepts `moment=invoiced` and returns the `bill_reclass` / `billable_back` rows the planner would write at invoice creation, named by mapping row (Cost of Parts, or the category), grouped into `moves[]`: one entry per distinct from → to pair, because one invoice can move cost both ways (a line marked No Charge after its bill: Cost of Parts → Warranty; a line made billable after its bill posted to Goodwill: Goodwill → Cost of Parts). For `moment=invoiced` without `line_id`, `target` is omitted: the planner uses the work order's and lines' current state, which is what invoicing applies.

#### 2.12 AccountingHub contract (core-owned, `api/docs/integration/accounting-events/`)

**`invoice_created` v4 (D48, D44).** v3 + required: `classification` (`billable|internal|no_charge`), `status` (core invoice status), `work_order_number` (string|null), `asset {vehicle_id, display}|null`, `posting_date` (the invoice's `created_on`, UTC instant), `work_order_id` (uuid|null, null on part sales), `work_order_cycle` (integer ≥ 1|null), `category {category_key, list, name}|null`, `original {work_order_id|null, work_order_number|null, not_in_shopview, line {work_order_line_id, line_number, title}|null, technicians [{staff_id|null, name}]}|null`, `no_charge_lines [{work_order_line_id, line_number, title, category {…}, original {…}|null, hours (decimal string), parts_cost (decimal string, DOLLARS)}]`. Invariants written into the schema: `status = closed` ⇔ `classification ≠ billable` ⇔ `category ≠ null`, and then every money member is "0.00" and `no_charge_lines` is `[]`; `no_charge_lines` is non-empty only on a billable invoice, whose matching statements are priced "0.00" with `labor_rate` "0.00". Built by `Accounting/Outbox/Application/Service/PayloadBuilder/InvoiceCreatedPayloadBuilder.php` for **every** invoice from the invoice row (classification, category, cycle) and the statements (`no_charge_*` columns), so the onboarding window replay (`Accounting/Outbox/Infrastructure/Doctrine/WindowReplaySourceFetcher.php`, all invoices) rebuilds the same payload. `invoice_voided` v1 voids the Closed record at Reopen (S8-R4).

**`journal_entry_requested` v3 (D47).** v2 + one required nullable entry-level `work_order` block `{work_order_id, cycle, invoice_id|null, scope (work_order|line), work_order_line_id|null, category {category_key, list, name}, cost_kind: "parts", entry_kind (stock_parts|shop_supplies|bill_reclass|billable_back|credit_reclass|credit_back|credit_return)}` and the reserved line `account_key` `work_order_category_expense`, legal only when `work_order` is non-null. `work_order: null` = an ordinary entry, unchanged from v2; every JE core emits becomes v3 when the version is raised. Family entries:
- stock parts: one per INVOICE_CREATE row carrying a category (`source_id` = the inventory change id), Dr `work_order_category_expense` / Cr `inventory_asset`; the INVOICE_REVERSE row's entry carries `reverses_source_id` (C17) and repeats the block;
- every `work_order_cost_entry` (`source_id` = its id), legs per §2.11; a reversal names its original and repeats its block.
- the restock row of a no-charge line's part credited through Issue Credit (`credit_return`, §2.10, D69), and its void's reversal.
Built in `Accounting/Outbox/Application/Service/PayloadBuilder/JournalEntryRequestedPayloadBuilder.php`, recorded in the same transaction as the business write.

**`vendor_bill_created` v4 and `vendor_bill_updated` v3 (D14 amended; Appendix C T4(b)).** v3 / v2 plus, on every item, the required nullable `work_order {work_order_id, work_order_number, cycle, scope (work_order|line), work_order_line_id|null, category {category_key, list, name}, cost_kind: "parts"}` (the JE v3 block without `invoice_id` and `entry_kind`). Non-null only when `is_purchase_order` is false (schema `if/then`) and the item's routing stamp is set (§2.11 frozen routing); null = today's routing. The hub posts a non-null item's line straight to the category's row inside the bill's own entry; AP, vendor and bill are unchanged and no reclass follows. Built by `Accounting/Outbox/Application/Service/PayloadBuilder/VendorBillCreatedPayloadBuilder.php` (`buildItem()` `:177-199`; both types in lockstep, `:18-19`), called from `VehicleService/WorkOrders/Domain/PartRequest/SpecialPartsGetsReceived.php:855` (work-order receiving), `Accounting/Outbox/Application/Service/VendorBillUpdatedRecorder.php:54` (amend) and `Accounting/Outbox/Application/Service/Replay/WindowReplayEventFactory.php:780` (window replay); `Inventory/Orders/Application/Handler/AcceptDelivery/AcceptDeliveryCommandHandler.php:173` (purchase order) and `Accounting/Outbox/Application/Service/AccountingOpeningBalanceEventFactory.php:322` (opening, header-only) always send null.

**`vendor_credit_created` v4 (S7-R3a).** v3 (a flat amount the hub posts whole on Parts Inventory) plus the required `items [{item_id (vendor_return_item.id), description, amount (tax-exclusive decimal string, DOLLARS), part_category_id|null, work_order {…same block…}|null}]`: one item per returned line whose bill line this feature routed or moved; `[]` otherwise, always from `buildOpening()` and the manual path (`PartsCatalogue/Vendors/Application/HTTP/VendorCredit/Create/CreateCommandHandler.php:139`). `work_order` = read from the `vendor_return_item` stamp written at credit creation (`expense_routing` = `category` → the category block; `bill_line` → null: the line follows its bill line and the hub credits `cogs_parts` by `part_category_id`), re-sent unchanged on replay; the items are exactly the stamped lines. Σ items.amount + tax.amount ≤ amount (the remainder posts as today; the builder guards it, since a violation fails permanently in the hub). Built by `VendorCreditCreatedPayloadBuilder.php` (`build()` `:40-52`) from the rows `Bookkeeping/Application/Service/Sync/VendorCreditSyncService.php:115,151-171` already reads; called from `PartsCatalogue/Vendors/Domain/VendorCredit/CreateCreditWhenReturnCreditsGetConfirmed.php:91` and `WindowReplayEventFactory.php:807`.

**`work_order_category_upserted` v1 (D49).** Full current state `{category_key, category_id, list, name, is_archived, is_default, requires_original_work_order, changed_at}`, envelope `workplace_id` null. Recorded with `AccountingEventRecorder::recordForOrganization()` inside every category write transaction (create, rename, archive, restore, default, requires-original), exactly as `PartsCatalogue/PartsCategories/Application/Service/PartCategoryCreator.php:97-115` does for part categories; a no-op without the Accounting flag. Onboarding: `BackfillPhase::OnboardingWorkOrderCategories`, ordered before invoices (precedent `Accounting/Outbox/Domain/Model/BackfillPhase.php:46`, `Accounting/Outbox/Application/Service/AccountingOnboarder.php:238,356-378`). Release: the one-time `--emit-accounting` step of the seeding CLI (§2.15). How the hub learns categories, and why: an event at write time is the only way a shop-added category appears as an empty mapping row before any posting names it (S6-R1); the hub is event-fed and reads no core tables; keying on the fixed starting keys lets the hub seed its four mappings independently of arrival order (S13-R4).

**Versions (D52).** One schema PR publishes all six — `invoice_created` v4, `journal_entry_requested` v3, `work_order_category_upserted` v1, `vendor_bill_created` v4, `vendor_bill_updated` v3, `vendor_credit_created` v4 (fixtures: closed internal; closed no charge with an original; billable with a no-charge line; JE stock, shop supplies, each reclass kind, reversal; category upsert; a bill with a category item and a null item, and its amend; a credit with a category item, a null item and a remainder; a manual credit with `items: []`) — updates `coverage-inventory.md`, runs `tools/accounting-contracts.sh manifest`, bumps `composer.json` to the next free MINOR (expected 1.12.0), and lists the six in `AccountingQueueBoundaryTest::PUBLISHED_AHEAD_OF_EMITTER` (`:70`) — emitting nothing new. A later PR raises all six in `emitted-versions.json` together (vendor types 3/2/3 → 4/3/4; raising them apart from JE v3 breaks the books either way), only after hub Release B is in production; the required `Accounting contracts gate`, the hub's `Contracts aligned with core` and `prod-deploy.yml`'s preflight enforce it. The hub must first adopt the 1.10/1.11 types owned by other work.

**Hub reads from core (D26).** The Close preview's `accounting_hub` block and the category page's read-only hub account label are computed server-side through `External/Accounting/Service/AccountingRpcClientInterface.php` with the system token (`External/Accounting/Service/SystemAccountingJwtGenerator.php`; caller precedent `External/Accounting/Application/Service/AccountingWorkspaceLifecycleCaller.php`): one `GET system-accounts` per request, bounded timeout, and a null block on failure (the preview and the page never fail because of the hub). A closing advisor or a 'Settings — Service' user holds no hub atom, so a proxy read from the FE would 403.

**What the hub provides (cross-repo, not built here).** H1 support for the six versions before core raises them (Release B lists `vendor_bill_created [1,2,3,4]`, `vendor_bill_updated [1,2,3]`, `vendor_credit_created [1,2,3,4]`). H2 a category table fed by D49 and a mapping table keyed `(workspace, category_key, kind)` (empty row = null account), served as `category_accounts` inside `GET/PUT /system-accounts` (D53); archived rows stay editable (Q40 ✓); a save re-runs held events. H3 the seeding migration and seeder for the four starting keys (General Internal → 6500; Warranty and Goodwill → 6430; Comeback → its own account; reuse, create, free-number rule — HQ1–HQ5). H4 Held reasons incl. "[Category] row not mapped" (copy Q50 ✓) and the hold scope: only the no-charge line's cost entries are Held, the invoice, revenue and receivable post (Q30 ✓). H5 per-work-order ordering on `(work_order_id, cycle)` (S4-R3): Reopen while the Close is Held → Dismissed; a later cycle waits behind an earlier held reversal. H6 a withdrawn row is never replayed (HQ6); Held stays family-only (HQ7). H7 self-heal: an unknown category named in a payload creates its row empty and Holds. H8 a bill or credit is never Held (a vendor payment against an unmirrored bill would stall the stream): a line whose category row is empty posts on today's routing and the hub records a Held deferred move for it, released by the mapping save and unwound by an amend or void (HQ8 ✓; the S8-R3 v1.0 lifecycle and its source link, D70).

#### 2.13 Shop supplies on non-billable work orders

`WorkOrderShopSuppliesCalculator::calculateShopSuppliesPrice()` (`VehicleService/WorkOrders/Domain/Service/WorkOrderShopSuppliesCalculator.php:56`, private) gets a first step for `isNonBillableService()`: (1) the live closed invoice's frozen `shop_supplies_charge`, else (2) `work_order.shop_supplies_charge_amount ?? 0`; never the customer/location percentage, and no tax (`addShopSuppliesPrice(..., invoiced)` is skipped). The amount is written on entry into non-billable (customer Min or 0, S10-R1), reset on a customer change while staying non-billable and on Convert to No Charge (S10-R2), and dropped on exit to billable. `ChangeShopSuppliesCharge` refuses on a closed work order (S10-R2). Edit Customer already accepts a Min without a percentage (`Customer/Customers/Application/Change/ChangeCommand.php:61-65` checks only `max >= min`), so S10-R1's customer half is FE-only; for a billable work order such a Min stays inert (D41).

#### 2.14 Shared report predicates and rule zero (D58, S9-R14)

Two shared, NULL-safe predicates in `src/Reporting/Shared/Domain/`, wired at every consumer in Phase 1 as no-ops on today's data:
- **No-charge work order**: on invoice-driven queries `RevenueInvoicePredicate` (closed ⇔ non-billable, D3); on work-order-driven queries `BillableWorkOrderPredicate::sql('wo')` → `wo.classification = 'billable'` (Technician Efficiency chip, WIP, Customers Spending). Customers Spending gets the classification form only (C14).
- **No-charge line**: `NoChargeLinePredicate::excludeStatement('iss')` → `iss.no_charge_category_id IS NULL`, `::excludeLine('wol')` → `wol.no_charge_category_id IS NULL`, and `only…` forms for the report. Placed beside every hand-written declined exclusion (C4) — billing efficiency, sales revenue bucket, Sales report, Parts Velocity money pass (units keep the line, S9-R7), Advisor Analysis, Shop Efficiency invoiced hours (S9-R8), Sales Tax (no-op, $0 taxable, S9-R12) — and inside `LinesStatsFetcher` behind the snapshot option (§2.10). Not in `InvoiceGenerator` (the line is exported, S9-R13).
- `IS NULL`, never `!=` on a LEFT JOIN (the trap `DbalPartsVelocityFetcher.php:241-246` documents).
- Rule zero holds by construction: every new column is NULL on existing data, so every query returns today's rows. A byte-compare fixture on the Sales report pins it, and SV-12297 compares every report and card on the staging database before and after, then adds one no-charge line and checks what moved.

#### 2.15 Release gate and Story 13 seeding

- Deploy-time parameter `app.internal_work_orders.enable_allowed` (env `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED`, default `false`, D21), checked by the enable paths and by every new surface (D43, D61, D64: N13–N19 answer 404 while it is closed); with it false the settings DTO carries `internalWorkOrdersAvailable: false` and the FE renders neither the toggle nor the Internal customer checkbox (D43). Every phase merges to `develop` behind it; a QA organization flips it. It goes `true` in staging then production after hub Release B and core emission, and is removed after launch (S13-R5). It is not a database feature flag (`database.md` forbids seeding those).
- Nothing a closed work order or a no-charge line posts can reach a hub that lacks v4/v3 support: v3 `invoice_created` rows would be replayed unchanged (`accounting:replay` re-sends stored payloads), so the gate stays closed in any environment whose hub runs an older contract.
- **Seeding** (S13-R1, S13-R4, S13-N1, S13-E2): `StartingCategoriesSeeder` (idempotent by `woc__organization_id_category_key_unq`) is called by `SeedStartingCategoriesOnOrganizationRegistered` (subscriber on `Organization/OrganizationDetails/Application/Register/OrganizationRegistered.php`, precedent `PartsCatalogue/PartsCategories/Domain/IntegrationEvent/UncategorizedCategoryCreator.php`) and by the CLI `app:work-order-categories:seed` (one transaction per organization; per-organization failure caught, listed, exit non-zero; `--organization=<id>` reruns one; `--verify` checks S13-R5 per organization: the four starting keys active, the setting off, no customer flagged by the run (S13-R6); `--emit-accounting` records one D49 upsert per category for every accounting-enabled organization, run once after the emission deploy). QuickBooks rows need no step (D54). Order per S13-R4: categories → (QuickBooks rows, virtual) → hub accounts and mappings.

---

### 3. Phases

Order: **1 → 2 → 2C → 3 → 4 → 4B → 5 → 6 → (hub 7, 8) → 9 → 10 → 13**. Phase 10 can start after 5 for whole work orders; its line half needs 4B and 6 (S9-R13 uses the Phase 6 `InvoiceData` change, D65). Every phase is test-complete and mergeable on its own, and **deployable** with no user-visible change while the release gate is closed (§2.15): that includes the core accounting UI port (Account Mappings category rows, the Closed pill and filter, the Closed record page) and the category endpoints N13–N19, which answer 404 while the gate is closed (D64). Gates (root `AGENTS.md` Definition of Done): **G1** static scoped (cs-fix, phpstan on files, pest on changed + mirrored tests), **G2** `doctrine:migrations:migrate` then `doctrine:migrations:diff --allow-empty-diff` = "No changes detected", **G4** `bin/smoke-test.sh` + logs, plus the **E2E coverage pass** whenever a `*Controller.php` changes. Migrations are hand-written with a real-time version number (`date -u +%Y%m%d%H%M%S`), guarded like `migrations/Version20261028104035.php` (column-exists checks), `ALGORITHM=INSTANT` for appended columns, `ALGORITHM=INPLACE, LOCK=NONE` for indexes (`MigrationOnlineDdlSyntaxTest`), each with its mapping counterpart in the same PR; hand-written FKs go into `MANUALLY_MANAGED_FOREIGN_KEYS`; index names are globally unique (SQLite test schema).

#### Phase 1: Schema, flags, status fork, shared predicates (no behavior change)

**Migrations**

| Table | SQL (up) |
|---|---|
| `work_order` | `ADD COLUMN classification VARCHAR(9) DEFAULT 'billable' NOT NULL, ADD COLUMN category_id BINARY(16) DEFAULT NULL, ADD COLUMN finish_cycle SMALLINT UNSIGNED DEFAULT 1 NOT NULL, ALGORITHM=INSTANT` |
| `work_order_line` | `ADD COLUMN no_charge_category_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT` |
| `invoice` | `ADD COLUMN classification VARCHAR(9) DEFAULT 'billable' NOT NULL, ADD COLUMN category_id BINARY(16) DEFAULT NULL, ADD COLUMN work_order_cycle SMALLINT UNSIGNED DEFAULT NULL, ALGORITHM=INSTANT` |
| `invoice_statement` | `ADD COLUMN no_charge_category_id BINARY(16) DEFAULT NULL, ADD COLUMN no_charge_parts_cost INT DEFAULT NULL, ADD COLUMN no_charge_labor_rate INT DEFAULT NULL, ALGORITHM=INSTANT` |
| `company` | `ADD COLUMN internal TINYINT(1) DEFAULT 0 NOT NULL, ADD COLUMN default_internal_category_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT`; `CREATE INDEX <alias>__organization_id_internal_idx ON company (organization_id, internal)` (alias prefix as in `Company.orm.xml`) |
| `vehicle` | `ADD COLUMN internal_category_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT` |
| `setting` | `ADD COLUMN internal_work_orders_enabled TINYINT(1) DEFAULT 0 NOT NULL, ADD COLUMN internal_work_orders_first_enabled_at DATETIME DEFAULT NULL, ADD COLUMN internal_work_orders_first_closed_at DATETIME DEFAULT NULL, ALGORITHM=INSTANT` |
| `inventory_changes` | `ADD COLUMN expense_category_id BINARY(16) DEFAULT NULL, ADD COLUMN work_order_cycle SMALLINT UNSIGNED DEFAULT NULL, ALGORITHM=INSTANT` |

No index on `work_order.classification` (~99% billable; the list chip rides the existing `(workplace_id, type, status, …)` composites as a residual filter, as `Invoice.orm.xml` records for `status`, SV-10098). The report index on `invoice` is decided in Phase 10 by measurement (`inv__organization_id_created_on_idx` already exists, `Invoice.orm.xml:135`).

**Domain / mapping**
- `src/VehicleService/WorkOrders/Domain/{Classification,ClassificationTransition}.php`; errors `ClassificationLockedError`, `ClassificationChangeNotAllowedError`, `CategoryListMismatchError` in `Domain/Error/`. `WorkOrder.php` + `Infrastructure/Doctrine/WorkOrder.orm.xml` (§2.2 state; only `classifyAtCreation` gets a caller later). `Domain/Line/Line.php` + `Infrastructure/Doctrine/Line/Line.orm.xml` (`noChargeCategoryId`).
- `src/Invoicing/Invoice/Domain/InvoiceClassification.php`; `Invoice.php` (+ `classification`, `categoryId`, `workOrderCycle`, `markClosed(InvoiceClassification, WorkOrderCategoryId)`), `Invoice.orm.xml`; `Statement.php` + `Statement.orm.xml` (three `no_charge_*` fields, constructor-only).
- `src/Invoicing/Invoice/Domain/Status.php` per §2.6; every caller migrated to LIVE or REVENUE in this phase (§5). Behavior is identical today: no `closed` row exists.
- `src/Reporting/Shared/Domain/NonVoidInvoicePredicate.php` → `RevenueInvoicePredicate.php`; new `LiveInvoicePredicate.php`, `BillableWorkOrderPredicate.php`, `NoChargeLinePredicate.php`, each wired at the sites of §2.14/§5.
- `src/Customer/Customers/Domain/Company.php`: `internal` (promoted, last), `flagAsInternal(): bool`, `clearInternalFlag(): bool`, `isInternal()`, `defaultInternalCategoryId`; `Company.orm.xml`.
- `src/VehicleService/Vehicles/Domain/Vehicle.php` + `Vehicle.orm.xml`: `internalCategoryId`.
- `src/Inventory/Parts/Domain/InventoryActions/InventoryChanges.php` + `Infrastructure/Doctrine/InventoryActions/InventoryChanges.orm.xml`: `expenseCategoryId`, `workOrderCycle` (set through a named method used only by the relabeler and the reversal).
- `src/Organization/Setting/Domain/Setting.php` + `Setting.orm.xml`: `internalWorkOrdersEnabled`, `internalWorkOrdersFirstEnabledAt`, `internalWorkOrdersFirstClosedAt`; `enableInternalWorkOrders(\DateTimeImmutable $now): bool` (returns true on the organization's first-ever enable — the modal is shown once, S1-R2), `disableInternalWorkOrders()`. The first-closed marker is never written through the entity: `SettingRepository::markFirstInternalWorkOrdersClose(OrganizationId, now)` runs `UPDATE setting SET internal_work_orders_first_closed_at = COALESCE(internal_work_orders_first_closed_at, :now) WHERE organization_id = :org`, the org bound from `OrganizationDecorator` (race between two concurrent first Closes). Called by Close (Phase 5) and by the first invoice carrying a no-charge line (Phase 4B, Q31 ✓).
- Parameter `app.internal_work_orders.enable_allowed` in `config/` (env `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED`, default false).

**Read exposure (so FE work can start)**
- `Organization/Setting/Application/Dto/SettingDto.php` (camelCase): `internalWorkOrders`, `internalWorkOrdersFirstEnabledAt`, `internalWorkOrdersFirstClosedAt` (ISO-8601 UTC|null), `internalWorkOrdersAvailable` (the parameter), `hasInternalCustomers`, `quickbooksConnectedAnyLocation`, `accountingHubEnabled` (S1-R3 hint variants).
- Customer view/list DTOs (`Customer/Customers/Application/View/Dto/*`, `Listing/ListingQueryHandler.php` projection): `internal`, `default_internal_category` (null until 2C).
- WO detail (`Application/View/ViewDetails/WorkOrderDetails.php` + `Domain/Service/WorkOrderDetailsFetcher.php`), WO list projection (`WorkOrderListingCriteriaApplier` SELECT + list DTO), board card: `classification`, `display_status` (`closed` when status ∈ {invoiced, paid} and classification ≠ billable, else the status; D2), `closed_on` (the live closed invoice's `created_on`).
- Invoice DTOs (`Invoicing/Invoice/Application/HTTP/ViewDetails`, `View`): `classification`, `is_closed`.

**Tests**
- Unit: `tests/Unit/Invoicing/Invoice/Domain/StatusTest.php` (LIVE ⊃ REVENUE, CLOSED ∈ LIVE \ REVENUE); `tests/Unit/Reporting/Shared/{RevenueInvoicePredicateTest,NoChargeLinePredicateTest,BillableWorkOrderPredicateTest}.php` (SQL shape, NULL-safety); `tests/Unit/Organization/Setting/Domain/SettingInternalWorkOrdersTest.php` (first enable returns true once); `tests/Unit/Architecture/InvoiceStatusListRatchetTest.php` (fails on any reintroduction of `getNotVoidStatuses`).
- Functional: `tests/Functional/Organization/Setting/ViewSettingsTest.php` (new keys, defaults); `tests/Functional/Invoicing/Invoice/Application/HTTP/Create/SingleNonVoidInvoicePerWorkOrderTest.php` (green after the rename); `tests/Functional/Reporting/RuleZeroSalesReportTest.php` (byte-compare of the Sales report fixture before/after the predicate wiring).
- Schema sync: extend the `tests/Unit/Invoicing/Invoice/Infrastructure/Doctrine/InvoiceOrganizationCreatedOnIndexSchemaSyncTest.php` pattern for the `company` index.

**Gates** G1, G2 (8 migrations), G4. No controller changes, no E2E pass. **Perf:** INSTANT adds (`work_order` is the busiest write table); one INPLACE index on `company`. No new reads. **Deployable:** yes.

#### Phase 2: Invoice-create extraction (pure refactor)

Move the step bodies of §2.8 into `src/Invoicing/Invoice/Application/Service/Issue/{InvoiceDraftBuilder,InventoryPickRelabeler,InvoiceAccountingEmitter}.php`; `processCreate()` calls them in the identical order. Move `CreateCommand` pre-validation (`Invoicing/Invoice/Application/HTTP/Create/CreateCommand.php:43-85`) into `src/Invoicing/Invoice/Domain/Service/InvoiceIssuanceEligibility.php::assertEligible()` with byte-identical messages; it gets an empty seam for S12-R9 (filled in 4B).
Tests: the existing `tests/Functional/Invoicing/Invoice/Application/HTTP/Create/*` pass unchanged (regression lock), plus a characterization test of the side-effect order taken before the split, and `tests/Unit/Invoicing/Invoice/Domain/Service/InvoiceIssuanceEligibilityTest.php`.
**Gates** G1, G4. **Deployable:** yes.

#### Phase 2C: Categories (Story 1 S1-R13 … S1-R16, Story 13 core)

**Migrations**
- `CREATE TABLE work_order_category (id BINARY(16) PK, organization_id BINARY(16) NOT NULL, list VARCHAR(9) NOT NULL, category_key VARCHAR(64) NOT NULL, name VARCHAR(60) NOT NULL, requires_original_work_order TINYINT(1) DEFAULT 0 NOT NULL, is_default TINYINT(1) DEFAULT 0 NOT NULL, archived_at DATETIME NULL, created_at, updated_at, created_by, updated_by)`; unique `woc__organization_id_category_key_unq`, unique `woc__organization_id_list_name_unq` (Q39 ✓), index `woc__organization_id_list_archived_at_idx`.
- `CREATE TABLE work_order_category_quickbooks_account (id, organization_id, workplace_id, category_id, account_id <type of bookkeeping.cost_of_parts_id> NULL, updated_at, updated_by)`; unique `wocqa__category_id_workplace_id_unq`, index `wocqa__workplace_id_idx`; FK `category_id` → `work_order_category` RESTRICT (manually managed).
- `CREATE INDEX wo__organization_id_category_id_idx ON work_order (organization_id, category_id)` — only if prod query Q21 shows the categories page count needs it (§9); otherwise the count reads closed invoices and statements.

**Domain** (`src/VehicleService/WorkOrders/Domain/Category/`): `WorkOrderCategory`, `WorkOrderCategoryId`, `CategoryList`, `CategoryKey`, `WorkOrderCategoryRepositoryInterface`, `Service/DefaultInternalCategoryPolicy`, `Service/InternalCategoryResolver` + ports `AssetInternalCategoryReaderInterface`, `CustomerDefaultInternalCategoryReaderInterface` (§2.4); errors `CategoryNameTakenError`, `CategoryArchivedError`, `DefaultCategoryCannotBeArchivedError`, `CategoryLimitReachedError`.
**Application** `src/VehicleService/WorkOrders/Application/Category/{Create,Update,Archive,Restore}/` (command + handler; `Transactional`; repository `save()`); `Category/Query/{ListCategories,CategoryOptions,ArchiveImpact}/` over `WorkOrderCategoryQueryRepositoryInterface` (`Application/Query/Category/`), DBAL implementation in `Infrastructure/Persistence/Query/Dbal/DbalWorkOrderCategoryQueryRepository.php` (counts: flagged customers whose default is the category; work orders whose `category_id` is it plus billable work orders with a line of it, Q43 ✓ — one grouped query per list); `Category/Seeding/StartingCategoriesSeeder.php`, `Category/Seeding/CategorySeedVerifier.php`; subscriber `Category/SeedStartingCategoriesOnOrganizationRegistered.php`.
**Bookkeeping**: `src/Bookkeeping/Domain/WorkOrderCategoryAccount/{WorkOrderCategoryQuickBooksAccount,WorkOrderCategoryQuickBooksAccountRepositoryInterface}.php`, Doctrine repository in `Bookkeeping/Infrastructure/Doctrine/WorkOrderCategoryAccount/`; command `Bookkeeping/Application/WorkOrderCategoryAccount/Save/SaveWorkOrderCategoryAccountsCommand` (+ handler), dispatched by the category create/update handler inside its transaction (cross-context state change through a command); query repository `DbalWorkOrderCategoryAccountQueryRepository` (categories × accessible connected workplaces, virtual empty rows, Q41 ✓). `Bookkeeping/Domain/Service/Settings/SettingsHydrator.php:39-52` adds the category rows to the Accounts group after `costOfPartsId`, only for organizations where the release gate is open (`internalWorkOrdersAvailable`, D61). Plumbing: `hydrate()` is a static domain function with a fixed Accounts list (`:40-52`) and is called only by `Bookkeeping/Application/Integration/IntegrationCommandHandler::__invoke` (`:151`); the handler loads the category rows beside taxes and products (`:117-118`) through `DbalWorkOrderCategoryAccountQueryRepository` (its workplace and organization are already in hand, and the gate read goes there too), and passes them to both `MappedQuickBooksReferences::ofSettings()` (`:119`, so each row gets a verdict instead of 'unverified') and `hydrate()` as a new argument; each row uses a row-keyed field `QuickBooksReferenceField::workOrderCategoryExpenseAccount($rowKey)` modeled on `productAndServiceCogsAccount($rowKey)` (`QuickBooksReferenceField.php:118`), since `self::setting()` throws for an unknown key (`SettingsHydrator.php:180`); saving routes the key in `UpdateSettingsCommandHandler` (near `:342`) (row key `workOrderCategory_<category_key>`, no colon; `subcategory` `internal_category|no_charge_category`, `categoryKey`, `archived`, `isDefault`, the usual `selected` / `issues`); `Bookkeeping/Application/Service/BookkeepingSettingKeyGuard.php:97-105` and `QuickBooksReferenceField::forSetting()` (`Bookkeeping/Domain/QuickBooksOptions/QuickBooksReferenceField.php:74`) learn the key prefix the way `productAndServiceItem($rowKey)` (`:102`) learns product rows; the `UpdateSettings` handler writes the table.
**UI**: `src/VehicleService/WorkOrders/UI/HTTP/Category/*Controller.php` + `DTO/*RequestDto.php` (N13–N18), `src/Bookkeeping/UI/Http/WorkOrderCategoryAccounts/ListQuickBooksExpenseAccountsController.php` (N19); voter `src/VehicleService/WorkOrders/Infrastructure/Security/WorkOrderCategorySettingsVoter.php` (VIEW = `settingsService` + `ROLE_WORK_ORDER_VIEW`; MANAGE = `settingsService` + `ROLE_ORGANIZATION_CREATE_AND_EDIT`; MANAGE_ACCOUNTS = `settingsIntegrations` + `ROLE_ORGANIZATION_CREATE_AND_EDIT`), copying `MaintenanceSettingsVoter`. Hub account label on N13 through the RPC client (§2.12).
**CLI**: `src/VehicleService/WorkOrders/UI/CLI/SeedWorkOrderCategoriesCommand.php` (thin; logic in the seeder and verifier).

**Tests**
- Unit: `tests/Unit/VehicleService/WorkOrders/Domain/Category/WorkOrderCategoryTest.php` (list invariants, default not archivable, requires-original only on No Charge, name length), `DefaultInternalCategoryPolicyTest`, `InternalCategoryResolverTest` (archived skipped; asset > customer > default), `StartingCategoriesSeederTest` (idempotent; partially seeded org), `CategorySeedVerifierTest`.
- Functional: `tests/Functional/VehicleService/WorkOrders/Category/CategoryCrudTest.php` (name taken incl. archived → 422; limit; archive default → 409; restore), `CategoryAuthorizationTest.php` (release gate closed → 404 on N13–N19, D64; without `settingsService` → 403; accounts without `settingsIntegrations` → 403; foreign or inaccessible workplace → 422; other organization's key → 404), `tests/Functional/Bookkeeping/UpdateSettings/WorkOrderCategoryRowsTest.php` (a row saved on the QuickBooks page shows in N13 and vice versa; an unknown key is still 422), query test `DbalWorkOrderCategoryQueryRepositoryTest` with a second organization; `SeedStartingCategoriesOnOrganizationRegisteredTest` (re-delivered event seeds nothing twice).

**Gates** G1, G2, G4, E2E pass. **Perf:** org-scoped lists of at most 100 rows per list; counts are one grouped query per list; N19 reads one options snapshot. **Security:** every query organization-scoped; workplace ids in account writes checked against the user's accessible, QuickBooks-connected workplaces; the options snapshot is keyed by realm, so the realm comes from each workplace's own `bookkeeping` row, never from input. **Read path:** writer (small reads). **Deployable:** yes; the QuickBooks rows appear only where the release gate is open (D61), and the frontend that groups them (FE-K2) ships in the same batch, so no QuickBooks page regroups before it can render them; behind the gate they show while the setting is off, as S5-R5 intends.

#### Phase 3: Settings toggle, first-enable modal, Internal customer flag, categories on customer and asset, Make internal (Story 1)

- `Organization/Setting/UI/HTTP/DTO/ChangeSettingRequestDto.php`, `Application/Command/ChangeSettingCommand.php`, `Application/Handler/ChangeSettingCommandHandler.php`: accept `internalWorkOrders`. Turning it **on** here is allowed only after the first enable (`internal_work_orders_first_enabled_at` set), else 409 `internal_work_orders_first_enable_required`; the gate closed → 409 `internal_work_orders_not_available`; an unchanged value passes (D30).
- N1 `src/Organization/Setting/UI/HTTP/InternalWorkOrders/EnableController.php`, `DTO/EnableInternalWorkOrdersRequestDto.php`, `Application/Command/EnableInternalWorkOrdersCommand.php` + handler: one transaction, `Setting::enableInternalWorkOrders()` then `Company::flagAsInternal()` per picked id (ids validated in the DTO by an org-scoped lookup, `count(resolved) === count(requested)`, else 422). Flagging writes no WO log; `audit_log` records the `company.internal` change automatically (`AuditLog/Log/Infrastructure/Doctrine/LogCommandBus.php`, postUpdate) and `company.updated_at` moves (Open API customer sync replays the customer, intended).
- Customer edit `Customer/Customers/Application/Change/{ChangeCommand,ChangeCommandHandler}.php` (legacy Command-as-payload: the fields are added as their siblings are; moving to a RequestDto is out of scope): `internal: ?bool` (value differs while the setting is off → 409 `internal_work_orders_off`, S1-N4) and `default_internal_category_key: ?string` (an active Internal category of the organization, else 422 `invalid_category`). Same atom as today.
- Asset edit `VehicleService/Vehicles/Application/HTTP/Change/{ChangeCommand,ChangeCommandHandler}.php`: `internal_category_key: ?string` (refused unless an owner in `vehicle_company` is flagged and the setting is on); vehicle view adds `internal_category`, `internal_category_applicable`, `customer_default_internal_category`. A changed asset or customer category re-resolves their open internal work orders (§2.4, Q32 ✓).
- N2/N3 candidates and N4 Make internal: query `work_order` where `company_id`, `type = service`, `classification = billable`, status ∈ (estimate, approved, in_progress, ready_for_review, complete), over **every workplace the user can access** (`ReportLocationsScopeResolverInterface`, D36); per row `has_deposit` (one grouped EXISTS over deposits not reversed + legacy `customer_credit`, the predicate of `DepositRepository::hasActiveDepositsByWorkOrderId`) and `has_vendor_bill` (EXISTS delivery item with an invoice number); first 10 rows (newest first) + `total` + `inaccessible_count` (an org-scoped `COUNT(*)` that returns no row data). N4 re-queries server-side, converts at most 500 per call in one transaction **per work order** (row lock, re-check), skips deposits (`deposit`) and rows no longer candidates (`changed`), collects `failed` after rollback, returns `remaining`; each conversion resolves the category with one batch read of asset and customer categories for the set (D12, D24, D36).
- **Tests**: functional `tests/Functional/Organization/Setting/EnableInternalWorkOrdersTest.php` (first enable + flags atomic; foreign id → 422, nothing saved; gate closed → 409; re-enable through the generic save), `tests/Functional/Customer/Customers/Change/InternalFlagTest.php` (setting off → 409), `CustomerDefaultInternalCategoryTest.php`, `tests/Functional/VehicleService/Vehicles/Change/AssetInternalCategoryTest.php`, `tests/Functional/VehicleService/WorkOrders/MakeInternal/{MakeInternalTest,MakeInternalCandidatesTest}.php` (deposits skipped; partial failure; 500 cap with `remaining`; a work order at an inaccessible workplace neither listed nor converted but counted; categories resolved), `tests/Functional/Customer/Customers/Change/MinWithoutPercentageTest.php` (Min accepted without a percentage; a billable work order still gets 0 from the rules, D41).
- **Gates** G1, G4, E2E pass. **Perf:** candidates ≤ 10 rows + counts (existing `wo__workplace_type_company_id_idx`); ≤ 500 conversions per call; ≤ 50 customers in N3. **Deployable:** yes.

#### Phase 4: Classification lifecycle, categories and originals on the work order, prices, locks, lists (Stories 2 and 10)

**Migrations**
- `CREATE TABLE work_order_original_reference (id, organization_id, work_order_id, subject VARCHAR(10) NOT NULL, subject_id BINARY(16) NOT NULL, original_work_order_id BINARY(16) NULL, original_work_order_number VARCHAR(32) NULL /* the display number, COALESCE(display_number, number) (SV-10297) */, not_in_shopview TINYINT(1) DEFAULT 0 NOT NULL, original_line_id BINARY(16) NULL, original_line_number SMALLINT NULL, original_line_title VARCHAR(255) NULL, created_at, updated_at, created_by, updated_by)`; unique `wor__subject_subject_id_unq`, index `wor__organization_id_original_work_order_id_idx`, index `wor__work_order_id_idx`.
- `CREATE TABLE work_order_original_technician (id, original_reference_id, staff_id)`; unique `wot__original_reference_id_staff_id_unq`, index `wot__staff_id_idx`; FK `original_reference_id` → `work_order_original_reference` ON DELETE CASCADE (manually managed).

**Creation** (S2-R1, S2-R2): `VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php:81` classifies before the first save through `Domain/Service/WorkOrderClassificationResolver.php` (ports `CompanyInternalFlagReader`, `InternalWorkOrdersSettingReader`): setting off → Billable (S2-N1); flagged customer → Internal with the resolved category (a sent No Charge is ignored, S2-N3); `no_charge` with `no_charge_category_key` → No Charge (missing key → 400 field `no_charge_category_key` "Pick a category"; without `ROLE_PRICING_VIEW` → 403) and its original reference. Inspection-built work orders go through the same handler (`WorkOrdersBuildTargetWorkOrderCreator.php:23`) with `no_charge = false`. `Domain/PayedWorkOrderReopenedSubscriber.php:43` (the work order spawned by a line added to a closed or invoiced one, S3-R3) takes its customer's classification and no No Charge category. `Application/SplitWorkOrder/SplitWorkOrderCommandHandler.php` copies classification, category and the WO reference (S2-E2), flat shop supplies 0, no adjustments; a no-charge line keeps its mark, category and line reference (S12-E1) with a note on both work orders. Part sales (`PartSale/Create`, `PartSaleSplitter`) stay billable by default.
**Convert / Change category / customer change**: `Application/Service/Classification/WorkOrderClassificationChanger.php` (callers own the transaction) applies the transition (de-price, re-price, or reset the flat amount), writes the original reference, the derived warranty flags, the history event and the system note. Commands under `Application/Classification/{ConvertToNoCharge,ConvertToBillable,ChangeCategory}/`; controllers + RequestDtos under `UI/HTTP/Classification/`. Each handler takes `Domain/Service/WorkOrderRowLocker.php::lockForUpdate` + refresh inside `Transactional`, re-checks the guards, applies, commits. Convert to No Charge refuses with a deposit (same predicate as `Application/ChangeCustomer/ChangeCommandHandler.php:53-61`, "Reverse the deposit first.", S2-N4) and requires the setting on; Convert to Billable and Change category work with the setting off (S2-N1). `Application/ChangeCustomer/ChangeCommandHandler.php` (`:37-180`): refuses a closed internal or no-charge work order with 409 `customer_change_locked` (D33); otherwise after `setCompanyId()` (`:80`) calls `followCustomer()` and the changer; part sales never call it. The change-customer preview adds `classification_after`, `category_after`, `shop_supplies_reset_amount`.
**Re-resolution** on asset change and on asset/customer category edits (§2.4, Q32 ✓).
**Prices** (§2.9): `Domain/Service/WorkOrderPricing.php` mask; `Domain/PartRequest/PricingCalculator.php:47` zero; `Application/Service/Classification/{WorkOrderDepricer,WorkOrderBillablePricer}.php`; `Domain/Service/SellPriceWritePolicy.php` + port `SellPriceWritePolicyInterface` at the seven sites (C11); receive view `sellPriceSuppressed` (`DbalOrderReceiveViewFetcher.php`) and the vendor-invoice item view (Q48 ✓); fixed-price refusal in `Application/Line/Change/ChangeCommand.php`; `ApplyDefaultAdjustmentsOnWorkOrderCreatedSubscriber.php:75` early return; `LaborRateChangeCascade.php:79` filter; derived `is_warranty` and the two line writers stop applying input (`Application/Line/Create/CreateCommand.php:37`, `Application/Line/Change/ChangeCommandHandler.php:92`).
**Shop supplies** (§2.13): `WorkOrderShopSuppliesCalculator.php:56` first step; `Application/ChangeShopSuppliesCharge/ChangeCommandHandler.php` refuses on a closed work order (409 `work_order_closed`).
**Locks and refusals before Close** (type-aware, NFR-008): `Application/Service/Adjustment/WorkOrderAdjustmentEditabilityGuard.php:21-26` refuses on a non-billable work order (409 `adjustments_not_available`, S2-R15); deposit create handlers (`Customer/Customers/Application/Handler/Deposit/Create*`, legacy `CustomerCredit/Create`) refuse (409 `deposits_not_available`, S2-N5); `Invoicing/Invoice/Application/HTTP/IBS/RequestIBSApprovalController.php` path refuses on internal and closed no-charge work orders; Send to Portal refuses on internal ones (S2-R11). The portal estimate of a no-charge work order shows lines, quantities and hours without prices, cost or total, the stamp and the category line; the estimate view DTO gets `classification`, `no_charge_category`, `no_charge: bool`.
**Lists, filter, search, board** (S2-R10, S2-R14): `Infrastructure/Persistence/Query/Dbal/WorkOrderListingCriteriaApplier.php` adds the `classification` filter field and a status pre-pass (`WorkOrderDisplayStatusFilterRewriter`, Infrastructure, unit-tested): `closed` → `(wo.status IN ('invoiced','paid') AND wo.classification <> 'billable')`; `invoiced`/`paid` → billable only. The board reuses the applier. `Search/Infrastructure/DocumentProvider/WorkOrderDocumentProvider.php` (`:453` SELECT) + `Search/Infrastructure/OpenSearch/mappings/work_orders.json`: `classification`, `displayStatus` (reindex at launch). Schedule card and the customer/asset WO tabs add `classification`.
**History, notes, audit** (S2-R13, S2-R18): `Domain/Event/WorkOrder/WorkOrderHistoryEvents.php` + `Application/Service/WorkOrder/WorkOrderEventDispatcher.php` (+ `getNameById()` labels, §4.3); system notes through `Application/Service/InternalNoteWriter.php` → `Communication/Notes/Application/Service/NoteCreator.php::createInternalSystemNote()` with new metadata `Communication/Notes/Domain/SourceMetadata/ClassificationChangedMetadata.php` (author name "ShopView", the acting user in `actor`, `work_order_refs` for linked numbers); text from `Application/Service/Classification/ClassificationNoteComposer.php`. Audit rows come from the ORM writes (`LogCommandBus`), so every classification, category and reference write stays on the ORM.
**Original references** (§2.5): `Application/Service/OriginalWork/OriginalReferenceWriter.php`; N20–N22.

**Tests**
- Unit: `tests/Unit/VehicleService/WorkOrders/Domain/WorkOrderClassificationTest.php` (`followCustomer` truth table, lock on invoiced/paid, part-sale refusal, list mismatch), `Domain/Service/WorkOrderClassificationResolverTest.php`, `Application/Service/Classification/{WorkOrderClassificationChangerTest,WorkOrderDepricerTest,WorkOrderBillablePricerTest,ClassificationNoteComposerTest}.php` (adjustments removed, fixed fields removed with the summary, Min default, customer vs workplace rate, parts on the stored cost), `Domain/Service/{WorkOrderPricingNonBillableTest,WorkOrderShopSuppliesCalculatorTest,SellPriceWritePolicyTest}.php`, `Application/Service/OriginalWork/OriginalReferenceWriterTest.php` (roster, lead fallback, WO technician, Not in ShopView, wrong customer → error), `Infrastructure/Persistence/Query/Dbal/WorkOrderDisplayStatusFilterRewriterTest.php`.
- Functional: `tests/Functional/VehicleService/WorkOrders/Classification/{ConvertToNoChargeTest,ConvertToBillableTest,ChangeCategoryTest}.php` (auth matrix incl. missing `ROLE_PRICING_VIEW`; deposit → 409; invoiced → 409; archived category → 422; original of another customer → 422; note + audit written), `ChangeCustomer/ChangeCustomerClassificationTest.php` (truth table; closed → 409; billable invoiced unchanged), `Create/CreateWorkOrderNoChargeTest.php`, `SplitWorkOrder/SplitClassificationTest.php`, `List/ClassificationFilterTest.php`, `Category/AssetSwitchReresolvesCategoryTest.php`, `PartRequest/ReceiveSpecialOrderOnInternalWorkOrderTest.php` (cost written, sell stays 0; billable receive byte-identical incl. SV-9965/SV-10082 behavior), `Part/CoreChargeOnInternalWorkOrderTest.php`, `Subscriber/NoAutoApplyOnInternalCreationTest.php` (billable creation still applies templates), `Line/DerivedWarrantyFlagTest.php`, `Original/{OriginalCandidatesTest,OriginalLineCandidatesTest}.php` (accessible locations only, Q38 ✓).
- S2-R11 regression lock: picking, receiving, a clock-in and a line approval on an internal work order write the same rows and statuses as on a billable one. NFR-008: `tests/Functional/VehicleService/WorkOrders/PartSale/PartSaleUnaffectedByClassificationTest.php`.

**Gates** G1, G2 (2 tables), G4, E2E pass. **Perf:** conversions per work order under a row lock; de-pricing deletes adjustments by `work_order_id` (indexed); re-pricing is O(lines) with one batch read of part requests; original candidates ≤ 25 rows, line candidates ≤ 200. **Deployable:** yes (gate closed).

#### Phase 4B: A no-charge line on a billable work order (Story 12, core)

- `Domain/Line/Line.php` (§2.3); `Application/Service/Line/LineNoChargeMarker.php` (refusals, line de-pricing through `WorkOrderDepricer::depriceLine()`, line reference, derived warranty, note, no estimate re-send: today approval requests are insert-only and written only by Send to Portal (`ApprovalRequest.php:18-24`), so a sent estimate is brought up to date by the portal reading the live state on open (Appendix D, Q54 ✓)); `Application/Line/NoCharge/{MarkNoCharge,ChangeNoChargeCategory,MarkBillable}/` command + handler (row lock; `WorkOrderBillablePricer::priceLine()` on Mark as Billable, D34); `UI/HTTP/Line/NoCharge/*Controller.php` (N23–N26); query `LineNoChargePreview` (N23: line price, new billable total, deposits total, all-lines-no-charge).
- Line create/change door (D57): `Application/Line/Create/{CreateController,CreateCommand,CreateCommandHandler}.php` and `Application/Line/Change/{ChangeController,ChangeCommand,ChangeCommandHandler}.php` (legacy request parsing) accept an optional `no_charge` block delegated to `LineNoChargeMarker` in the same transaction (Line/Create gets a `Transactional` wrapper; it has none today, per the `InvoiceBuilder::updateInvoice()` comment `:179-189`). **An absent block means unchanged** (Edit Labor, inline save and ShopCoach never clear a mark). A present block needs `ROLE_WORK_ORDER_CREATE_AND_EDIT` + `ROLE_PRICING_VIEW` (403).
- Pricing mask, statement columns, snapshot option, relabel and reversal stamps, S12-R9 eligibility (§2.9, §2.10): `WorkOrderPricing.php:211-305`, `WorkOrderLinePricingDto.php`, `DoctrinePartSaleListPricingPreloader.php`, `WorkOrderStatsFetcher.php`, `Domain/Line/Service/LinesStatsFetcher.php`, `InvoiceBuilder.php:211-310`, `InvoiceFinancialSnapshotService.php:107-236`, `InventoryPickRelabeler`, `InvoiceReversalService.php:328-369` (also increments `finish_cycle`, §2.7), `InvoiceIssuanceEligibility`. The first invoice carrying a no-charge line calls `SettingRepository::markFirstInternalWorkOrdersClose()` (Q31 ✓).
- Moves, customer change, credits: `Application/Handler/Part/MovePartToLineCommandHandler.php` prices the part by its destination line (zero onto a no-charge line; pricing rules on cost onto a billable one; note records the move, S12-E6); customer change keeps marks (S12-E2); Issue Credit for no-charge-line parts per §2.10 (Q35 ✓).
- **Tests**: unit `Application/Service/Line/LineNoChargeMarkerTest.php`, `Domain/DTO/WorkOrderPricing/WorkOrderLinePricingNoChargeTest.php` (labor/parts 0, tax 0, fees and shop supplies % on the billable base), `tests/Unit/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilderNoChargeStatementTest.php` (hours kept, rate 0 with the real rate stored, items 0, flag + parts cost), `tests/Unit/Invoicing/Invoice/Application/Service/InvoiceFinancialSnapshotNoChargeTest.php` (cost/hours exclude the line; invariant holds); functional `tests/Functional/VehicleService/WorkOrders/Line/NoCharge/{MarkLineNoChargeTest,ChangeLineCategoryTest,MarkLineBillableTest,LineDoorTest}.php` (auth matrix; invoiced → 409; declined → 409; whole internal → 409; absent block leaves the mark), `tests/Functional/Invoicing/Invoice/Application/HTTP/Create/CreateInvoiceWithNoChargeLineTest.php` (statement flagged; snapshot excludes; S12-R9 → 409; all lines No Charge → $0 auto-paid; marker set once), `tests/Functional/Invoicing/Invoice/Reverse/ReverseInvoiceWithNoChargeLineTest.php` (reversal rows carry category, cycle and `reversesInventoryChangeId`; the lines keep their mark; cycle +1), `tests/Functional/Customer/Customers/CreditMemo/NoChargeLineCreditTest.php` ($0 forced; restock row carries the category; reversal still possible), and the regression `tests/Functional/Invoicing/Invoice/Application/HTTP/Create/BillableInvoiceUnchangedTest.php` (no mark → statements, snapshot and inventory rows byte-identical).
- **Gates** G1, G4, E2E pass. **Perf:** one extra column in the pricing read; the snapshot option adds one predicate; no new query per line. **Deployable:** yes (Mark needs the setting on, which needs the gate).

#### Phase 5: Close and Reopen, documents (Stories 3, 4)

**Close preview (N9)** `src/Invoicing/Invoice/Application/Close/Preview/CloseWorkOrderPreviewQueryHandler.php` + `Infrastructure/Persistence/Query/Dbal/DbalCloseWorkOrderPreviewQueryRepository.php`: `stock_parts_cost` (Σ PART_PICK net value; a part with no cost → `parts_with_no_cost[]`, S3-E2); `special_orders[]` by state (`already_posted` / `reclassed_at_close` / `not_billed`; billed lines at the bill line amount, the rest at line cost); `labor_hours`; `shop_supplies_amount`; `category`, `original_required_missing`; `quickbooks` (connected at this location, both inventory accounts mapped, category account name or Review, shop supplies account name) — null when not connected (S3-E4); `accounting_hub` through the RPC client (§2.12); `fingerprint` = sha256 of canonical JSON {classification, category, sorted (line id, declined flag, hours), sorted (part request id, qty, cost), shop supplies amount, stock/special totals} — never the raw line status (D23); `is_complete`, `posting_date_default` (today in the workplace time zone).
**Close (N10)** `src/Invoicing/Invoice/UI/HTTP/Close/CloseWorkOrderController.php`, `DTO/CloseWorkOrderRequestDto.php` (`#[MapEntity] WorkOrder` through the workplace-scoped `WorkOrderRepository::findById`), `Application/Close/{CloseWorkOrderCommand,CloseWorkOrderCommandHandler}.php`; `#[IsGranted(InvoiceCreateVoter::INVOICE_CREATE)]` (`Invoicing/Invoice/Infrastructure/Security/InvoiceCreateVoter.php`) **and** `#[IsGranted(PermissionEnum::ROLE_PRICING_VIEW)]`.

```php
public function __invoke(CloseWorkOrderCommand $c): CloseWorkOrderResultDto {
    $wo = $c->workOrder;
    if (!$wo->isNonBillableService()) throw new WorkOrderNotClosableError();
    $this->tx->begin();
    try {
        $this->rowLocker->lockForUpdate($wo); $this->workOrders->refresh($wo);
        $completedEvents = $c->completeFirst                                     // D42: one transaction, a failed Close leaves the WO where it was
            ? $this->completion->completeInCallerTransaction($wo, $c->userId)   // 409 work_order_review_required when review is required
            : [];
        $this->eligibility->assertEligible($wo, $c->workplace);                  // same rules as Create invoice (S2-E7 cores, S3-N2)
        if ($this->preview->fingerprint($wo) !== $c->fingerprint) throw new WorkOrderChangedError();   // S3-E5
        $this->originals->writeForClose($wo, $c->original);                      // S3-R2; 422 original_work_order_required when needed and missing
        $pricing = ($this->pricing)($wo);
        $invoice = $this->draftBuilder->build($pricing, dueDate: null, createdOn: $c->postingDate);
        $invoice->markClosed(InvoiceClassification::from($wo->getClassification()->value), $wo->getCategoryId(), $wo->getFinishCycle());
        //   status closed, payment_status paid, totals 0, due_date null, Customer PO not required (S3-R5)
        $this->invoices->save($invoice);
        $this->relabeler->relabel($wo->id(), $wo->org(), $invoice);              // stamps category + cycle
        $wo->markInvoicedByClose();                                              // what InvoiceCreatedEventSubscriber does for billable
        $this->workOrders->save($wo);
        $invoice->invoiceCreated(); $this->invoices->save($invoice);             // publishes the integration event → WO history snapshot
        $this->costEntries->planForFinish($invoice);                             // Phase 6: shop supplies + reclasses
        $this->accountingEmitter->emitCreated($invoice);                         // Phase 9: v4 + JEs
        $this->settings->markFirstInternalWorkOrdersClose($wo->org(), $this->clock->now());
        $this->eventDispatcher->recordClosed($wo, $c->postingDate, $c->userId);  // + note with posting date and accounts
        $this->tx->commit();
    } catch (\Throwable $e) { $this->tx->rollBack(); throw $e; }
    $this->eventDispatcher->dispatchAll($completedEvents);                      // WorkOrderCompletedEvent only after commit (webhook job, snapshot)
    $this->quickBooksPosting->postForClose($invoice->getId());                  // Phase 6, post-commit, never throws
    return new CloseWorkOrderResultDto($invoice->getId(), …);
}
```

Not called: customer account creation, `recordInvoiceCreatedEvent`, carry credit, `invoiceIsPaid`, the QuickBooks invoice sync, deposit auto-apply, `CustomerPortalInvoiceCreatedNotifier`, payment/credit QuickBooks syncs (S3-R4). Close requires `complete`. With `complete_first` (D42) the status change happens inside the Close transaction: the body of `Application/Handler/WorkOrder/SimpleCompleteWorkOrderCommandHandler.php` (validation `:59-73`, purchase-order placement of unordered vendor requests `:80-82`, completion `:92`) moves into `Application/Service/WorkOrder/WorkOrderCompletion::completeInCallerTransaction()`, which opens no transaction and returns its events instead of dispatching them; the handler keeps its own transaction and dispatches after its commit (behavior unchanged), and Close dispatches `WorkOrderCompletedEvent` after its commit, so the Open API webhook job (`OpenApi/Webhook/Infrastructure/EventListener/WorkOrderEventSubscriber.php:53-74`, SQS in production) is never sent for a rolled-back Close. `complete_first` with review required → 409 `work_order_review_required` ("This work order needs review before it can be closed."; the FE sends it to review as Create invoice does today); `complete_first` without `ROLE_WORK_ORDER_CREATE_AND_EDIT` → 403 (the atom `SimpleCompleteWorkOrderController.php:20` requires). Without `complete_first`, a work order that is not Complete → 409 `work_order_not_complete`. Tests (`CloseWorkOrderTest`): review on → 409; no work-order edit atom → 403; a Close refused after completion (e.g. `work_order_changed`) → the work order is still not Complete and no `WebhookDelivery` row exists.
**Locks after Close** (S2-R9, S3-R3, S10-R2): the classification lock covers invoiced/paid; `ChangeShopSuppliesCharge` refuses; `Application/Line/Create/CreateCommandHandler.php:169-170` extends the spawn arm to `SENT || PAID || CLOSED` (the spawned work order takes its customer's classification through `PayedWorkOrderReopenedSubscriber`); Create invoice on a closed work order is refused by `invoiceForWorkOrderExists` (LIVE); `WorkOrderDetails` adds `can_reopen` (closed + `ROLE_WORK_ORDER_DELETE`).
**Reopen (N11)** `src/Invoicing/Invoice/UI/HTTP/Reopen/ReopenWorkOrderController.php` (`#[IsGranted(PermissionEnum::ROLE_WORK_ORDER_DELETE)]`, mirroring `ReverseInvoiceVoter`'s service branch), `Application/Reopen/{ReopenWorkOrderCommand,ReopenWorkOrderCommandHandler}.php`; `InvoiceReversalService::reverseClosed(Invoice, WorkOrder)` shares the private helpers and skips the portal payment guard, customer-transaction checks and carry credits. In one transaction: WO → Complete; reversal inventory rows with category, cycle and `reversesInventoryChangeId`; reversal cost entries (Phase 6) and `invoice_voided` + reversal JEs (Phase 9); invoice deleted; `finish_cycle` + 1; logs `work_order.reopened` + `invoice.reversed`; note. Post-commit: history snapshot; QuickBooks reversals of what was posted (Phase 6). Guard: the live invoice must be `closed` (409 `not_closed`); the billable reverse endpoint refuses a closed invoice (409 `use_reopen_work_order`). Classification, category, reference and shop supplies amount are kept (S4-R3, S4-E4).
**Documents** (S3-R5, S2-R4, S12-R7): both invoice designs — `templates/invoices/invoice.html.twig` (modern) and `templates/invoices/legacy/invoice.html.twig` (legacy; the portal shows whichever design the shop uses) — get a variant for `status = closed`: block "Internal Work Order [n]" / "No Charge Work Order [n]" with the date; INTERNAL or NO CHARGE stamp under the masthead (never over the logo); "Category: [name]" and, only when the original is a real work order, "· Original work order [n]" (link in the app, plain on the PDF) — "Not in ShopView" is never printed on any document, the estimate included (S2-R16 v0.22); Bill to; asset; labor hours only; parts quantity and cost (cost only with `PricingVisibilityProvider::canSeePricing()`); Summary {Parts cost, Shop supplies (> 0), Labor hours}; no tax, total, payments, balance or signature. Selected in `InvoicePdfQueryHandler` and the Finance-tab view. Email: the invoice email template with subject "Internal Work Order [n]" / "No Charge Work Order [n]"; recipient from the FE (empty by default). Estimate PDF of an open non-billable work order: stamp + category line. Billable invoice/estimate with a no-charge line: the line at $0.00 with the category under the title, no stamp.
**Open API until Story 11** (S11-R2, S11-R3): `tests/Functional/OpenApi/OpenApiClosedWorkOrderTest.php` pins that a closed work order reads `invoiced` through `/v1/work-orders` and that its invoice is in no `/v1/...invoices` list and answers 404 on `/v1/invoices/{id}` (S11-R2 v1.0, Q64 ✓), and that no `invoice.created` / `invoice.paid` webhook is sent.
**Surfaces that must not show the record as an invoice** (S3-R4, S3-R6, D37): `External/CustomerPortal/Http/Controllers/InvoicesQueryBuilder.php` adds `i.status <> 'closed'`; `VehiclesQueryBuilder.php:40-43` counts closed work orders as completed, not invoiced; asset Invoices tab `VehicleService/Vehicles/Application/HTTP/ListVehicleInvoices/ListingQueryHandler.php` includes closed rows (`classification`, `display_status`, `no_charge: true`, posting date; Total balance "No Charge"); `GET /api/invoices/list` (`Invoicing/Invoice/Application/HTTP/Listing/ListingQueryHandler.php`) and the Open API lists (`OpenApi/Invoice/Infrastructure/Query/OpenApiInvoiceQueryRepository.php`, list queries + `/{id}` → 404) exclude closed; the four repair CLIs add `i.status <> 'closed'` (C21). Customer Invoices tab, statements, A/R, credit limit: no `customer_transaction` is written, so nothing to change (test only).
**Tests**: unit `tests/Unit/Invoicing/Invoice/Application/Close/{CloseWorkOrderCommandHandlerTest,Preview/CloseWorkOrderFingerprintTest}.php`, `tests/Unit/Invoicing/Invoice/Application/Service/InvoiceReversalServiceReverseClosedTest.php`; functional `tests/Functional/Invoicing/Invoice/Close/CloseWorkOrderTest.php` (no `customer_transaction`, no `customer_payment`, status closed, WO invoiced, rows relabeled with category and cycle, marker set once; billable → 409; stale fingerprint → 409; missing `ROLE_PRICING_VIEW` → 403; unresolved core → 409; requiring category without original → 422), `CloseRequiresOriginalTest.php`, `tests/Functional/Invoicing/Invoice/Reopen/ReopenWorkOrderTest.php` (Complete; invoice gone; parts back as PART_PICK; classification kept; cycle + 1; re-close → new invoice id), `tests/Functional/OpenApi/Webhook/InvoiceWebhookDeliveryTest.php` (extend: Close dispatches no `invoice.created`/`invoice.paid`; the billable $0 path still does), `tests/Functional/External/CustomerPortal/ClosedInvoiceHiddenTest.php`, `tests/Functional/VehicleService/WorkOrders/Line/AddLineToClosedWorkOrderSpawnsTest.php`, `tests/Functional/VehicleService/WorkOrders/ChangeShopSuppliesCharge/ClosedLockTest.php`, `tests/Functional/Invoicing/Invoice/Application/HTTP/Create/RefuseNonBillableTest.php`, `tests/Functional/Invoicing/Invoice/Listing/ClosedExcludedFromListsTest.php` (app list + Open API lists), document snapshot tests for both stamps.
**Gates** G1, G4, E2E pass. **Perf:** one work order's rows in one transaction; no external HTTP inside it except the bounded hub preview read (preview only). **Security:** `MapEntity` through the workplace-scoped `findById` (verify its tenant check, Tenant Pass 2); voter + pricing atom on both endpoints. **Deployable:** yes (gate).

#### Phase 6: QuickBooks (Stories 5, 7; S3-N4 QuickBooks notes; S7-R8)

**Migrations**
- `ALTER TABLE bookkeeping_journal_entry ADD COLUMN debit_account_id … DEFAULT NULL, ADD COLUMN credit_account_id … DEFAULT NULL, ALGORITHM=INSTANT`, both the type and length of `bookkeeping.cost_of_parts_id` (`Bookkeeping/Infrastructure/Doctrine/Bookkeeping.orm.xml:13`).
- `CREATE TABLE work_order_cost_entry` (§2.11).
- `CREATE TABLE bookkeeping_cost_journal_entry (id, bookkeeping_id, workplace_id, cost_entry_id, debit_account_id NULL, credit_account_id NULL (both the type of `bookkeeping.cost_of_parts_id`), status VARCHAR(16), external_id VARCHAR(20) NULL, memo VARCHAR(255), doc_number VARCHAR(32) NULL, created_at, updated_at)`; unique `bcje__bookkeeping_id_cost_entry_id_unq`, index `bcje__workplace_id_status_idx`. No FK to `invoice` (Reopen deletes it).
- `ALTER TABLE bookkeeping_vendor_bill ADD COLUMN line_account_ids JSON DEFAULT NULL, ALGORITHM=INSTANT`.
- `ALTER TABLE inventory_delivery_item ADD COLUMN expense_category_id BINARY(16) DEFAULT NULL, ADD COLUMN expense_work_order_cycle SMALLINT UNSIGNED DEFAULT NULL, ALGORITHM=INSTANT` and `ALTER TABLE vendor_return_item ADD COLUMN expense_routing VARCHAR(16) DEFAULT NULL, ADD COLUMN expense_category_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT` (the frozen routing stamps, §2.11), and `ALTER TABLE bookkeeping_vendor_credit ADD COLUMN line_account_ids JSON DEFAULT NULL, ALGORITHM=INSTANT` (each credit line's posted account, §2.11).

**Files**: `src/Accounting/CostEntry/{Domain/WorkOrderCostEntry.php,Domain/WorkOrderCostEntryId.php,Domain/WorkOrderCostEntryRepositoryInterface.php,Application/CostEntryPlanner.php,Application/Query/…}` + `Infrastructure/Doctrine` repository; hooks: Close and invoice create (`planForFinish`), Reopen/Reverse (`planReversals`), the vendor-bill recording points (`Inventory/Orders/Application/Handler/AcceptDelivery/AcceptDeliveryCommandHandler.php`, `VehicleService/WorkOrders/Domain/PartRequest/SpecialPartsGetsReceived.php`, `Accounting/Outbox/Application/Service/VendorBillUpdatedRecorder.php`) and the vendor-credit recording point (`planForBill`, `planForCredit`). Bookkeeping: `Application/Service/WorkOrderCategoryAccountResolver.php`, `FallbackAccountResolver::resolveCategoryExpense()`, `Application/Service/Sync/JournalEntrySyncService.php` (§2.11), `Application/Service/Sync/CostJournalEntrySyncService.php`, `Domain/BookkeepingCostJournalEntry/*`, `Application/BookkeepingVendorBill/Service/{PerLineCogsAccountResolver,OriginalBillLineAccountResolver}.php`, `Domain/Service/WorkOrderCostRoutingLookupInterface.php` + DBAL implementation, `Application/Service/Sync/{VendorBillCreateSyncService,VendorBillUpdateSyncService,VendorCreditSyncService}.php` + `DeferredVendorBillSyncs`, `Infrastructure/Doctrine/QuickBooksOptions/DbalQuickBooksOptionSnapshotRepository.php::findProductIncomeAccountId(realmId, itemId)`, `Application/Service/BookkeepingRetryService.php` (`:298-305` routes the new subgroups), `Application/UnexportedItem/ListUnexportedItemsQueryHandler.php` (labels "Internal Work Order Close", "Internal Work Order Reopen", "No Charge line" (S7-N3 v1.0, Q64 ✓); reference = WO number; subject = classification + category; withdrawn rows without actions), `UnexportedItemMarkDoneCommandHandler` (→ `exported_by_hand`), `Domain/BookkeepingLog/BookkeepingLog.php` (subgroups); `Reporting/Export/Service/InvoiceGenerator.php:272-301` + `CustomerInvoiceExportDetails/InvoiceData.php:193-238`; N8 `moment=invoiced`; the N9 `quickbooks` block.
**Issue Credit restock (S12-E7, D69):** `Bookkeeping/Application/Service/Sync/CreditRestockJournalEntrySync.php` (new, post-commit listener on the credit-memo restock and its void) calls `JournalEntrySyncService` for a row carrying `expense_category_id`; billable restocks are untouched. Test: `tests/Functional/Bookkeeping/InternalWorkOrders/CreditRestockQuickBooksTest.php` (no-charge line part credited → Dr Inventory Asset / Cr category; void → swapped; billable credit → no entry, as today; a rejected restock lists in QB Unexported as "No Charge line" with the work order number).
**Tests**: unit `tests/Unit/Accounting/CostEntry/Application/CostEntryPlannerTest.php` (kinds, amounts, cycle, category move = reversal + new, no rows on plain billable work), `tests/Unit/Bookkeeping/Application/Service/{WorkOrderCategoryAccountResolverTest,FallbackAccountResolverCategoryTest}.php` (mapped, Review, never another row or Cost of Parts), `Sync/JournalEntrySyncCategoryDebitTest.php` (category account; class from location; memo; stored accounts; reversal swaps the stored accounts after a remap), `Sync/CostJournalEntrySyncServiceTest.php` (legs per kind; equal accounts → nothing; idempotent rerun; failure logs; withdrawn), `BookkeepingVendorBill/Service/PerLineCogsAccountResolverCategoryTest.php`, `tests/Unit/Reporting/Export/InvoiceDataNoChargeLineTest.php` (rate/amount 0.00; category in description); functional `tests/Functional/Bookkeeping/InternalWorkOrders/CloseQuickBooksPostingTest.php` (QuickBooks fake: N stock JEs + shop supplies JE; retry → no duplicate; Reopen → swapped reversal of posted entries only; re-close → new entries; unmapped category → Review; Inventory Asset or Cost of Parts unmapped → no parts entry, shop supplies still posts, no reversal at Reopen (S7-N5); closed period → QB Unexported row; reopened waiting row withdrawn), `NoChargeLineQuickBooksPostingTest.php` (invoice line at 0.00; line parts to the category; bill reclass and billable-back at invoicing), `tests/Functional/Bookkeeping/UnexportedItem/InternalJournalEntryRowsTest.php` (a rejected Close stock-part entry, a Reopen reversal and a no-charge line entry each list with their S7-N3 type, work order number and classification; a billable work order's entry keeps "Work Order Create"); regression: the existing vendor bill, credit, invoice and JE sync suites unchanged for billable work.
**Gates** G1, G2 (4 changes), G4, E2E pass. **Perf:** planner reads per invoice / per delivery (a handful of rows); routing lookup one query per delivery; no QuickBooks call inside a transaction. **Security:** realm and bookkeeping row from the server-side workplace; the sync runs regardless of the closing user's integrations atom (S7-R7). **Deployable:** yes (gate).

#### Phases 7–8: Hub Releases A and B (`shopview-accounting`)

Built with the hub's own agents and tooling (§2.12, H1–H8). Phase 9's emission PR waits for Release B in production.

#### Phase 9: Core accounting emission

- **Schema PR** (9a, right after Phase 1, D65; emits nothing new): `docs/integration/accounting-events/{invoice_created.v4,journal_entry_requested.v3,work_order_category_upserted.v1,vendor_bill_created.v4,vendor_bill_updated.v3,vendor_credit_created.v4}.schema.json`, fixtures, `coverage-inventory.md`, `MANIFEST.sha256` (`tools/accounting-contracts.sh manifest`), `docs/integration/composer.json` MINOR bump, `tests/Unit/Accounting/Outbox/Domain/Model/AccountingQueueBoundaryTest.php::PUBLISHED_AHEAD_OF_EMITTER`.
- **Emission PR** (after hub Release B in production): `docs/integration/emitted-versions.json` raises the six together; `VendorBillCreatedPayloadBuilder.php` (per-item `work_order` block from the routing stamp) and `VendorCreditCreatedPayloadBuilder.php` (`items` from the return rows and their stamp); `Accounting/Outbox/Domain/Model/AccountingEventType.php` new case `WorkOrderCategoryUpserted`; payload builders `InvoiceCreatedPayloadBuilder.php` (v4, incl. `buildStatement()` `:472-500` unchanged shape and the new top-level members), `JournalEntryRequestedPayloadBuilder.php` (v3 block for family entries from inventory rows and cost entries; `work_order: null` otherwise), new `WorkOrderCategoryUpsertedPayloadBuilder.php`; category write handlers record the upsert; `BackfillPhase::OnboardingWorkOrderCategories` + `AccountingOnboarder` wiring; the CLI's `--emit-accounting`.
- **Tests**: `tests/Unit/Accounting/Outbox/Application/Service/PayloadBuilder/{InvoiceCreatedPayloadBuilderV4Test,JournalEntryRequestedPayloadBuilderV3Test,WorkOrderCategoryUpsertedPayloadBuilderTest,VendorBillCreatedPayloadBuilderV4Test,VendorCreditCreatedPayloadBuilderV4Test}.php` (vendor: stamped vs null item, purchase order always null, amend re-sends the stamp, replay rebuilds it, credit item-sum guard) (closed vs billable vs billable-with-lines; family vs ordinary JE; reversal repeats the block; cycle); fixtures validated by `AccountingQueueBoundaryTest`; functional `tests/Functional/Accounting/Outbox/{CloseEmitsAccountingEventsTest,ReopenEmitsReversalsTest,BillableInvoiceWithNoChargeLineEmitsTest,CategoryWritesEmitUpsertTest}.php`.
- **Gates** G1, G4, the contracts CI (`be-accounting-contracts.yml`, required `Accounting contracts gate`) and the hub's `Contracts aligned with core`; joint stack `make dev-full`: Close → Closed record + category entry; unmap → Held → map → posted; Reopen → withdrawn or reversed; a billable invoice with a no-charge line → revenue posts, the line's entries post to the category. **Deployable:** only after the hub.

#### Phase 10: Reports, dashboard, export (Story 9)

- **Internal Work Orders report (N12)**: `src/Reporting/Reports/UI/HTTP/InternalWorkOrders/{InternalWorkOrdersController,InternalWorkOrdersExportController}.php` + `DTO/*RequestDto.php` (extend `ReportListRequestDto`: 366-day cap, `#[ValidReportScope]` location, `#[Choice]` tab and classification); `src/Reporting/Reports/Application/InternalWorkOrders/{…Query,…QueryHandler,…Row,…Totals,…Summary,…TechnicianRow,Export/…}.php`; port `src/Reporting/Reports/Application/Query/InternalWorkOrders/InternalWorkOrdersQueryRepositoryInterface.php`; `src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalInternalWorkOrdersQueryRepository.php`.
  - By work order and line: UNION ALL of (a) closed invoices (`i.status = 'closed'`, snapshot columns `parts_cost`, `shop_supplies_charge`, `hours_invoiced`, `created_on`) and (b) statements with `no_charge_category_id` of REVENUE invoices (`no_charge_parts_cost`, `time_estimate`, invoice `created_on`); joined once each to company, category and `work_order_original_reference` / `…_technician` (no per-row lookups); `OrganizationDecorator` on `invoice`, every join pinned to `i.organization_id`; locations through `ReportLocationsScopeResolverInterface` (`Reporting/Shared/Application/Export/ReportLocationsScopeResolverInterface.php:95`, S9-R16); filters classification (all / internal / no_charge / no_charge_line), category (archived included), original technician (staff id or `unassigned`); ORDER BY date DESC, id DESC; totals and the per-category summary are one aggregate each over the same WHERE. Money null without `ROLE_PRICING_VIEW`. Empty envelope before the first-close marker (S9-R4, Q31 ✓).
  - By technician: (a) completed lines per technician = Technician Efficiency's Completed definition — `work_order_line.status = complete AND end_date` in range with a clock by that technician (`Reporting/Domain/TechnicianEfficiency/Service/DataProvider.php:597,615-618`; `end_date` set by `Line::markAsCompleted()` `Line.php:418-422`, cleared by `markAsUncompleted()` `:424-427`, index `wol__end_date_idx`) — written as a new DBAL query reusing that predicate, not as an extension of `DataProvider` (a Domain class holding `Connection`, legacy); (b) comeback / warranty work = no-charge lines and whole no-charge work orders (one line each, Q33 ✓) of keys `comeback` / `warranty` dated in range, one row per stored original technician; Unassigned bucket; redo hours and parts cost whole for each technician; comeback rate = comeback lines / completed lines; totals count each line once. Same scope as the first tab.
  - Export: `format=csv&tab=by_line|by_technician` → one CSV of the tab that is open (S9-R2 v0.22: "the CSV carries the tab that is open"; rows through `Reporting/Shared/Infrastructure/Csv/CsvAttachmentResponseBuilder.php`); `format=pdf` → one PDF with both tabs as sections (`Reporting/Shared/Application/Pdf/ReportPdfRendererInterface.php`); `Reporting/Shared/Application/Export/ExportRowCapGuard.php` (10,000 rows).
  - Read path: **reader** (`app.report_reader.*`, heavy report, no write precedes it in the flow; the report page has no refetch after a user mutation).
- **Technician Efficiency** (S9-R3, D56): `DbalInvoicedTechnicianTimesheetQueryRepository.php:176-178` → `LiveInvoicePredicate` on `i` and `newer`; parameter `internal_work_orders=all|hide|only` (default `all`) threaded through `/api/reporting/technician-efficiency/{dateRange}`, `-completed/{dateRange}`, the expanded views and the PDFs; `only` = non-billable work orders plus no-charge lines; `hide` = billable work orders minus their no-charge lines; under `all` and `only` a no-charge line's `tech_time` (`:71,98`) counts as 0 invoiced hours while its clocks stay worked hours, and `hide` leaves out both the billed and the clocked hours of non-billable work orders and no-charge lines (S9-R3); the Completed tab (`DataProvider.php:604-618`) gets the same predicates. The dashboard card uses `all` (S9-R1).
- **Dashboard and money reports**: the Phase 1 wiring covers Sales, Sales By Customer, Sales By Representative, Advisor Analysis, the dashboard tiles (Revenue, Invoices card, Top Customers count, At-Risk, Billing), Billing Efficiency (no-charge line hours and $0 never enter the effective rate), Shop Efficiency, Parts Velocity (money pass only); this phase adds the functional proofs.
- **Customers Spending**: `CustomersSpendingQueryHandler.php:75-90` adds `classification = 'billable'` only (C14). Legacy handler holding `Connection`: rung **fix in place** (one predicate); moving it to a query repository is an SV-12051 ticket.
- **WIP** (S9-R9, S9-R12): `Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalWorkInProgressFetcher.php` adds `classification`; non-billable rows value 0; a no-charge line keeps the existing $0-line treatment.
- **Customer Invoice export** (S9-R6, S9-R11, S9-R13): `Reporting/Export/Application/CustomerInvoiceExport/{CustomerInvoiceExportController,CustomerInvoiceExportQueryHandler}.php` + RequestDto `include_non_billable` (honored only once the marker is set); `InvoiceGenerator::buildBaseInvoiceQuery()` (`:129`) adds `i.status <> 'closed'` when false (the only change to today's file); with it on, closed invoices emit labor/part rows at 0.00, no tax, no Supplies row, and the CSV gains `Classification` and `Category` through a separate `CustomerInvoiceClassifiedRow` (so the `CustomerInvoice` DTO that `InvoiceCreateSyncService` iterates stays untouched); a no-charge line of a billable invoice is a 0.00 row with the category in its description regardless of the option (Phase 6 `InvoiceData`). QuickBooks path (`generateInvoiceForId()`) never includes closed.
- Sales Follow Up and Vendors Expenses: nothing — both removed by SV-12106 (C13, Q66 ✓: S9-R15 v1.0 drops both names).
- **Tests**: unit `tests/Unit/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalInternalWorkOrdersQueryRepositorySqlTest.php` (tenant predicates on root and joins, as `DbalSalesReportTenantScopeTest`), `TechnicianEfficiencyInternalWorkOrdersFilterTest.php`; functional `tests/Functional/Reporting/Reports/InternalWorkOrders/{InternalWorkOrdersReportTest,InternalWorkOrdersByTechnicianTest,InternalWorkOrdersExportTest}.php` (both sources; filters incl. `no_charge_line` and `unassigned`; totals over the range not the page; archived category; other-org rows invisible; inaccessible location excluded; 367 days → 400; caps; a shared line counted once per technician, totals once; completed-lines parity with Technician Efficiency), `tests/Functional/Reporting/{RevenueReportsExcludeClosedTest,RevenueReportsExcludeNoChargeLineTest}.php` (Sales, SBC, SBR, Advisor, Sales Tax, the dashboard tiles: billable only; Technician Efficiency invoiced counts closed), `CustomersSpendingExcludesClosedTest.php` (voids still counted), `tests/Functional/Reporting/Export/CustomerInvoiceExportNonBillableTest.php` (option off = byte-identical fixture; on = rows + 2 columns; QuickBooks DTO unchanged).
- **Gates** G1, G2 (only if the measurement adds an index), G4 (new report endpoints), E2E pass. **Deployable:** yes.

#### Phase 13: Release run (Story 13, SV-12295)

Runbook (code ships in 2C and 9): (1) deploy with the gate closed; (2) `app:work-order-categories:seed` in staging, then production; rerun failed organizations with `--organization`; `--verify` until every organization passes S13-R5; (3) QuickBooks rows need no step (D54); (4a) after hub Release B: its seeding operator command + `--verify`; (4b) at launch: run it again with `--verify` (S13-R3 v0.22); (5) core emission deploy, then `app:work-order-categories:seed --emit-accounting`, verified by outbox rows per accounting organization ≥ its category count; (6) SV-12297 rule-zero comparison on the staging database against the baseline captured before Phase 1 reached staging (S9-R14); (7) `work_orders` search reindex (`search.md` runbook); (8) flip `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED` in staging, then production; `bin/smoke-test.sh` after each deploy.

---

### 4. API contract for the frontend

**Conventions** (verified in code):
- Casing per D22 (header). Internal envelope: success `{"data": …}`; lists `{"data": {"<collection>": […], "pagination": {…}}}`; reports `{"data": {"collection": […], "pagination": {…}, "totals": {…}}}` as `SalesByCustomerReportResult::jsonSerialize()`.
- Errors (`ApiErrorHandler.php:108-131`): `{"errors":[{"<code>":"<message>"}]}` for a `CodedError`, else `{"errors":[{"error":"<message>"}]}`; `ConflictError` → 409, `UnprocessableError` → 422, `NotFoundError` → 404, other `DomainError` → 400, validator violations → 400 with field keys, voter → 403. Every new refusal is a `CodedError`. The FE calls every endpoint below with `handlesFailureLocally` and `handlesConflictLocally` (C27).
- Every write in the PRD permission matrix is refused server-side with 403 without its atom (Key Decisions, permissions rule 1).
- Money: report and new-endpoint money in integer cents; existing work-order/invoice money fields keep their current unit. Dates ISO-8601 UTC.
- Category references in requests and paths use the stable `category_key` (D50), resolved inside the organization; responses carry `{key, name, archived}`.
- `OriginalWorkOrderPayload` = `{original_work_order_id: uuid|null, original_not_in_shopview: bool, original_line_id: uuid|null}`. Every response reference to an original work order is `{id, number, is_deleted}`: the number is the stored snapshot (D55), so a deleted original still shows its number, as text without a link (S12-E5).

#### 4.1 Changed endpoints

| Endpoint | Change | Auth (unchanged unless stated) |
|---|---|---|
| `GET /api/organizations/settings` | camelCase: `internalWorkOrders`, `internalWorkOrdersFirstEnabledAt`, `internalWorkOrdersFirstClosedAt`, `internalWorkOrdersAvailable`, `hasInternalCustomers`, `quickbooksConnectedAnyLocation`, `accountingHubEnabled` | logged-in |
| `POST /api/organizations/settings/change` | + `internalWorkOrders: bool\|null`. Turning on before the first enable → 409 `internal_work_orders_first_enable_required`; gate closed → 409 `internal_work_orders_not_available`; unchanged value passes | `ROLE_ORGANIZATION_CREATE_AND_EDIT` |
| `POST /api/customers/change` | + `internal: bool\|null` (differs while the setting is off → 409 `internal_work_orders_off`), + `default_internal_category_key: string\|null` (422 `invalid_category`) | `ROLE_CUSTOMER_CREATE_AND_EDIT` |
| Customer view and `GET /api/customers` rows | + `internal`, `default_internal_category {key,name,archived}\|null`; the customer view also `open_internal_work_orders_count` (Remove the Internal flag dialog, D60) | as today |
| `POST /api/vehicles/change` | + `internal_category_key: string\|null` (409 `asset_not_internal`, 409 `internal_work_orders_off`, 422 `invalid_category`) | as today |
| Vehicle view | + `internal_category`, `internal_category_applicable: bool`, `customer_default_internal_category` | as today |
| `POST /api/work-orders/create` | + `no_charge: bool = false`, `no_charge_category_key`, `OriginalWorkOrderPayload`. Missing key with `no_charge` → 400 field `no_charge_category_key` "Pick a category"; `no_charge` without `ROLE_PRICING_VIEW` → 403; archived → 422 `category_archived`. Ignored when the customer is flagged or the setting is off | `ROLE_WORK_ORDER_CREATE_AND_EDIT` |
| `POST /api/work-orders/change-customer` | closed internal/no-charge work order → 409 `customer_change_locked` (D33); otherwise the classification follows (S2-R7) | `ROLE_VEHICLE_CREATE_AND_EDIT` (or the part-sale branch, as today) **plus** `ROLE_WORK_ORDER_CREATE_AND_EDIT` for a service work order (D63) |
| `GET /api/work-orders/{workOrderId}/change-customer-preview?company_id=` | `{classification_after, category_after {key,name}\|null, shop_supplies_reset_amount}` (amount null without `ROLE_PRICING_VIEW`) | `ROLE_WORK_ORDER_VIEW` |
| `GET /api/work-orders/view/{workOrderId}` | + `classification`, `display_status`, `closed_on`, `can_reopen`, `shop_supplies_amount`, `internal_category`, `no_charge_category`, `original_work_order {id,number,is_deleted}\|null`, `original_not_in_shopview`, `original_line {id,number,title}\|null`, `original_technicians [{staff_id,name}]`; lines + `no_charge: bool`, `no_charge_category`, the four original fields, `no_charge_blocked_reason` (`declined\|return_or_credit\|invoiced\|not_billable\|setting_off\|null`), `is_warranty` (derived) | as today |
| `GET /api/work-orders/lines/{workOrderId}` (the lines the work-order page reads) | each line + the same no-charge fields as the detail endpoint: `no_charge`, `no_charge_category {key,name,archived,requires_original_work_order}\|null`, the four original fields, `no_charge_blocked_reason`, derived `is_warranty`; the FE hides Mark as No Charge while `no_charge_blocked_reason` is not null (S12-E8), except `invoiced`, where Mark as No Charge and Mark as Billable show disabled with the tooltip "Reverse the invoice first." (S12-N3) and pre-checks S12-R9 from `requires_original_work_order` (D60) | as today |
| `GET /api/work-orders` (all tabs; board reuse) | rows (camel) + `classification`, `displayStatus`; filter `classification` (`eq`/`in`); status `closed`; `invoiced`/`paid` match billable only | as today |
| Search work-order documents | + `classification`, `displayStatus` | as today |
| Schedule payloads | + `classification` (camel) | as today |
| `GET /api/vehicle/invoices/{vehicleId}` | closed rows included; + `classification`, `display_status`, `no_charge: true`; `total_balance` 0 | as today |
| `POST /api/work-orders/invoices/estimate` + estimate/invoice PDFs | + `classification`, `no_charge_category`, `no_charge`; stamp and category line; no-charge lines at $0.00 with the category | as today |
| `GET /api/invoices/{workOrderId}/details`, `GET /api/invoices/{invoiceId}/view` | + `classification`, `category`, `is_closed`; statements + `no_charge_category` | as today |
| `POST /api/invoices/create` | non-billable work order → 409 `work_order_not_billable` ("This work order is internal or no charge. Close it in ShopView."); 409 `no_charge_line_original_required` `{line_id, line_title}` (S12-R9) | as today |
| `POST /api/invoices/reverse-invoice` | closed invoice → 409 `use_reopen_work_order` | as today |
| `GET /api/invoices/list`, Open API invoice lists | closed records excluded; `/v1/invoices/{id}` → 404 for closed | as today |
| `POST /api/work-orders/change-shop-supplies-charge` | closed non-billable → 409 `work_order_closed` | as today |
| Fee/discount add/change (`WorkOrderAdjustmentEditabilityGuard`) | non-billable → 409 `adjustments_not_available` | as today |
| Deposit create (work-order-linked) | non-billable → 409 `deposits_not_available` | as today |
| Line create / change | + optional `no_charge: {no_charge_category_key} & OriginalWorkOrderPayload \| null` (absent = unchanged); present without `ROLE_WORK_ORDER_CREATE_AND_EDIT` + `ROLE_PRICING_VIEW` → 403; `is_warranty` ignored; fixed price/total on a non-billable work order or a no-charge line → 422 `fixed_price_not_available` | today's line atoms |
| `GET /api/part-sales/{id}/list-credit-available-parts` (camel) | + `noChargeCategoryName: string\|null` per part (Q35 ✓, D60) | as today |
| Credit memo create (Issue Credit) | parts of a no-charge line listed at a fixed $0.00; any other amount → 422 `no_charge_line_credit_fixed` (Q35 ✓) | as today |
| Receive view (`DbalOrderReceiveViewFetcher`) | items (camel) + `sellPriceSuppressed: 'internal'|'no_charge'|'no_charge_line'|null` (the FE picks the notice text from it); vendor-invoice item view the same field and values (Q48 ✓) | as today |
| Notes list | system notes: `source: system`, author name "ShopView", `metadata.type` (`classification_changed`, `line_no_charge_changed`, `work_order_closed`, `work_order_reopened`), `metadata.actor`, `metadata.work_order_refs: [{id, number, is_deleted}]` | as today |
| `GET /api/bookkeeping/integration` (camel) | Accounts group gains one row per category after `costOfPartsId`: `key` `workOrderCategory_<category_key>`, `subcategory` `internal_category\|no_charge_category`, `categoryKey`, `archived`, `isDefault`, `selected`, `issues`; empty rows for every connected location (D54) | as today |
| `PUT /api/bookkeeping/settings` | items `{key: "workOrderCategory_<key>", id, sectionKey: "settings_group_account"}` accepted; unknown keys still 422; `issues` checked live as for other rows | `ROLE_ORGANIZATION_VIEW` + `ROLE_ORGANIZATION_CREATE_AND_EDIT` (as today) |
| `GET /api/bookkeeping/unexported-items` | labels "Internal Work Order Close", "Internal Work Order Reopen", "No Charge line"; reference = WO number; subject = classification + category; withdrawn rows without actions, with `withdrawn_reason` (`reopened` \| `invoice_reversed` \| `category_changed`) | as today |
| `GET /api/reporting/technician-efficiency/{dateRange}`, `…-completed/{dateRange}`, expanded variants, PDFs | + `internal_work_orders=all\|hide\|only` (default `all`) | `ROLE_REPORT_VIEW` |
| `GET /api/reporting/reports/work-in-progress` (+ export) | rows + `classification`; value 0 for non-billable | as today |
| `GET /api/reporting/export/customer_invoice` | + `include_non_billable=0\|1` (default 0; ignored until the marker is set); with 1: rows of closed records at 0.00 + columns `Classification`, `Category`; no-charge lines always as 0.00 rows with the category | `ROLE_INVOICE_VIEW` |

#### 4.2 New endpoints

**N1 `POST /api/organizations/settings/internal-work-orders/enable`** (S1-R2 Save and "Do this later")
- Auth: `ROLE_ORGANIZATION_CREATE_AND_EDIT` (S1-N2: no customer atom needed).
- Body `{ "internal_customer_ids": [uuid, …] }` (0..50; empty = "Do this later").
- 200 `{ "data": { "internal_work_orders": true, "first_enable": bool, "flagged_customer_ids": [uuid] } }`. Idempotent re-call: flags stay; `first_enable` false.
- Errors: gate closed 409 `internal_work_orders_not_available`; an id outside the organization → 422 `invalid_customer_ids` (nothing saved); > 50 ids → 400 (the modal caps the picker at 50: "Pick up to 50 customers here. Flag more from Edit Customer.", S1-R2 v1.0, Q64 ✓).

**N2 `GET /api/customers/{companyId}/make-internal-candidates`** (S1-R11)
- Auth `ROLE_WORK_ORDER_VIEW`. Company outside the organization → 404; not flagged → 409 `customer_not_internal`.
- 200 `{ "data": { "company_id", "company_name", "total", "inaccessible_count", "can_make_internal": bool, "work_orders": [ { "id", "number", "display_number", "location_name", "unit", "status", "has_deposit", "has_vendor_bill" } ] } }` — ≤ 10 rows, newest first; `total` over every workplace the caller can access (D36); `can_make_internal` = `ROLE_WORK_ORDER_CREATE_AND_EDIT` (S1-N6).

**N3 `GET /api/customers/internal/make-internal-candidates`** (S1-R10 sweep after re-enable)
- Auth `ROLE_WORK_ORDER_VIEW`. 200 `{ "data": { "customers": [ <N2 payload> … ] } }`, flagged customers with `total > 0`, ≤ 50, by name.

**N4 `POST /api/work-orders/make-internal`**
- Auth `ROLE_WORK_ORDER_CREATE_AND_EDIT`. Body `{ "company_id", "all_open": true, "exclude_ids": [uuid]? }`; the server re-queries the candidates (D24, D36), converts at most 500 per call, resolves each category.
- 200 `{ "data": { "changed": [uuid], "skipped": [ { "id", "number", "reason": "deposit"|"not_open"|"not_billable" } ], "failed": [ { "id", "number" } ], "remaining": int } }`. Company not flagged or setting off → 409.

**N5 `POST /api/work-orders/{workOrderId}/convert-to-no-charge`**
- Auth `ROLE_WORK_ORDER_CREATE_AND_EDIT` + `ROLE_PRICING_VIEW`. Body `{ "no_charge_category_key" } & OriginalWorkOrderPayload` (missing key → 400 field "Pick a category").
- 200 `{ "data": { "work_order_id", "classification": "no_charge", "no_charge_category", "shop_supplies_amount" } }`.
- 409: `classification_locked`, `deposit_exists` ("Reverse the deposit first."), `customer_is_internal`, `not_billable`, `internal_work_orders_off`, `part_sale_not_supported`. 422: `category_archived`, `invalid_category`, `invalid_original_work_order`.

**N6 `POST /api/work-orders/{workOrderId}/convert-to-billable`** — auth as N5; body `{}`; allowed with the setting off (S2-N1); 200 `{ "data": { "work_order_id", "classification": "billable" } }`; 409 `classification_locked`, `not_no_charge`.

**N7 `POST /api/work-orders/{workOrderId}/change-category`** — auth as N5; body as N5; saves when the category **or** the original reference differs (Q36 ✓), else 409 `category_unchanged`; a category that does not require the original clears it; allowed with the setting off; 200 as N5; 409 `classification_locked`, `not_no_charge`.

**N8 `GET /api/work-orders/{workOrderId}/vendor-bill-cost-moves?target=billable|internal|no_charge&category_key=&moment=closed|invoiced&line_id=`** (S2-R8 dialog; `moment=invoiced` also feeds the billable Create invoice confirmation, S7-R8)
- Auth `ROLE_WORK_ORDER_VIEW`; amounts null without `ROLE_PRICING_VIEW`.
- 200 `{ "data": { "integration": "quickbooks"|"accounting_hub"|"both"|null, "bills": [ { "part_name", "line_title", "amount": int|null } ], "total": int|null, "from": { "kind": "cost_of_parts"|"category", "category_key", "label" }, "to": { … }, "moves": [ { "from": {…}, "to": {…}, "amount": int|null, "bills": [ … ] } ], "moves_when": "invoiced"|"closed" } }`. `moves` has one entry per distinct from → to pair (S7-R8 v1.0); for a single target it holds one entry equal to the top-level `from` / `to`, which the dialogs before Convert, a customer change and a line action keep reading; with more than one move the top-level `from` / `to` are the first move's, and the Create invoice dialog reads `moves[]` only. `target` is optional with `moment=invoiced` and no `line_id`: omitted = the current state. `line_id` (optional) narrows the bills to one line, for Mark as No Charge, Change category and Mark as Billable on a line (D60, S2-R8 v1.0, Q62 ✓). Empty `bills` or null `integration` → no dialog.

**N9 `GET /api/work-orders/{workOrderId}/close-preview`** (S3-R2, S3-N4, S3-E1…E4)
- Auth `InvoiceCreateVoter::INVOICE_CREATE` + `ROLE_PRICING_VIEW`.
```json
{ "data": {
  "work_order_id": "uuid", "classification": "no_charge",
  "category": { "key": "warranty", "name": "Warranty", "archived": false },
  "original_required_missing": true,
  "is_complete": true, "posting_date_default": "2026-11-09",
  "stock_parts_cost": 12345, "stock_parts_core_cost": 0, "parts_with_no_cost": [ { "part_request_id": "uuid", "name": "..." } ],
  "special_orders": [ { "state": "already_posted"|"reclassed_at_close"|"not_billed", "amount": 0, "from_label": "Cost of Parts"|null } ],
  "labor_hours": 3.5, "shop_supplies_amount": 2500,
  "quickbooks": { "inventory_accounts_mapped": true, "category_account_name": "Warranty Expense"|null, "uses_review_account": false,
                  "shop_supplies_account_name": "Shop Supplies Income"|null, "shop_supplies_uses_review_account": false },
  "accounting_hub": { "category_row_mapped": true, "category_account_label": "6430 Warranty & Goodwill Expense"|null,
                      "shop_supplies_row_mapped": true, "shop_supplies_account_label": "5100 Shop Supplies COGS"|null },
  "fingerprint": "sha256-hex"
} }
```
- `quickbooks` null when not connected at the location (S3-E4); `inventory_accounts_mapped` false → the S7-N5 note (D35). `accounting_hub` null when the hub is not enabled or the RPC read fails (D26).
- 409 `work_order_not_closable` (billable).

**N10 `POST /api/work-orders/{workOrderId}/close`**
- Auth as N9. Body `{ "posting_date": <format of invoices/create created_on>|null, "fingerprint": "sha256-hex", "complete_first": bool = false } & OriginalWorkOrderPayload`. `complete_first` runs the existing completion command inside the Close transaction (D42), so a refused or failed Close leaves the work order where it was.
- 201 `{ "data": { "invoice_id", "work_order_id", "classification", "display_status": "closed", "closed_on" } }`.
- 409: `work_order_changed` ("This work order changed. Review and close again.", S3-E5), `work_order_not_closable`, `invoice_already_exists`, `work_order_not_complete`, `incomplete_lines` / `blocking_parts` / `unresolved_cores` (the Create invoice messages). 422: `original_work_order_required`, `invalid_original_work_order`.
- Accounting failures never fail the request.

**N11 `POST /api/work-orders/{workOrderId}/reopen`** — auth `ROLE_WORK_ORDER_DELETE`; body `{}`; 200 `{ "data": { "work_order_id", "status": "complete", "classification" } }`; 409 `not_closed`.

**N12 `GET /api/reporting/reports/internal-work-orders`** and **`…/internal-work-orders/export`**
- Auth `ROLE_REPORT_VIEW`; money null without `ROLE_PRICING_VIEW`. Reader connection.
- Query: `tab=by_line|by_technician`; the date params of `ReportListRequestDto` (as Sales By Customer; posting/invoice date; ≤ 366 days else 400 "Date range cannot exceed 366 days."; default this month); `location_id` (one, or absent = all accessible; scope-validated, D45); `classification=all|internal|no_charge|no_charge_line`; `category_key` (archived accepted); `original_technician_id=<uuid>|unassigned`; pagination (`#[Pagination]`, by_line only).
- `by_line` 200: `{ "data": { "collection": [ { "row_type": "work_order"|"line", "work_order_id", "work_order_number", "line_id", "line_number", "line_title", "customer_id", "customer_name", "classification": "internal"|"no_charge"|"no_charge_line", "category": {key,name,archived}, "original_work_order": {id,number,is_deleted}|null, "original_not_in_shopview", "original_line_number", "original_technicians": [{staff_id,name}], "date", "parts_cost": int|null, "shop_supplies": int|null, "hours" } ], "pagination": {…}, "totals": { "work_order_count", "line_count", "parts_cost", "shop_supplies", "hours" }, "summary": [ { "category", "parts_cost", "work_order_count", "line_count", "hours" } ] } }`, newest first; totals and summary over the filtered range.
- `by_technician` 200: `{ "data": { "collection": [ { "technician": {id,name}|null, "completed_lines", "comeback_lines", "warranty_lines", "comeback_rate", "redo_hours", "redo_parts_cost": int|null } ], "totals": {…} } }` (null technician = Unassigned; one row per technician in scope).
- Before the first-close marker: empty collection, zero totals (S9-R4, Q31 ✓).
- Export `format=csv&tab=` (one CSV of the open tab) or `format=pdf` (both tabs as sections) (S9-R2); 10,000 rows → 400 `ReportExportTooLargeError`.

**N13 `GET /api/internal-work-orders/categories?list=internal|no_charge&archived=0|1`** (S1-R13)
- Auth `WorkOrderCategorySettingsVoter::VIEW` (`settingsService` + `ROLE_WORK_ORDER_VIEW`).
- 200 `{ "data": { "categories": [ { "key", "list", "name", "is_default", "requires_original_work_order", "archived", "internal_customers_count", "work_orders_count", "quickbooks_accounts": [ { "workplace_id", "workplace_name", "account_id", "account_name", "account_state": "active"|"inactive"|"missing" } ], "accounting_hub_account_label" } ], "meta": { "archived_count", "active_count" } } }`. Unpaginated (≤ 100 active per list); `active_count` is the list's active total whichever rows are shown, so the page disables New and Restore at 100 while it lists archived rows too. `quickbooks_accounts` lists the connected locations the user can access (Q41 ✓); `accounting_hub_account_label` via the RPC client, null on failure or without the hub.

**N14 `GET /api/internal-work-orders/categories/options?list=&include_archived=0|1`** — auth: any user with `ROLE_WORK_ORDER_VIEW` (dialogs, Edit Customer, Edit Asset) or `ROLE_REPORT_VIEW` (report filter); `include_archived=1` only for the report; 200 `{ "data": { "options": [ { "key", "name", "requires_original_work_order", "archived", "is_default" } ] } }`, active first.

**N15 `POST /api/internal-work-orders/categories`** — auth MANAGE (`settingsService` + `ROLE_ORGANIZATION_CREATE_AND_EDIT`); body `{ "list", "name", "is_default"?, "requires_original_work_order"?, "quickbooks_accounts"?: [ { "workplace_id", "account_id"|null } ] }`; `quickbooks_accounts` additionally needs MANAGE_ACCOUNTS (`settingsIntegrations`) → else 403; 201 `{ "data": { "key" } }`; 422 `name_taken` (incl. archived names, Q39 ✓), `name_too_long`, `category_limit_reached` ("You can have up to 100 active categories in this list. Archive one to add another.", S1-R13 v1.0, Q64 ✓), `invalid_workplace_ids` (not an accessible connected workplace); records D49 (Phase 9).

**N16 `PUT /api/internal-work-orders/categories/{categoryKey}`** — as N15, all fields optional; 409 `category_archived` for fields other than the accounts (accounts stay editable on archived categories, Q40 ✓); 404 for another organization's key.

**N17 `GET /api/internal-work-orders/categories/{categoryKey}/archive-impact`** — auth VIEW; 200 `{ "data": { "customer_count", "asset_count", "next_in_line_name" } }` (S1-R16 message).

**N18 `POST /api/internal-work-orders/categories/{categoryKey}/archive`** and **`/restore`** — auth MANAGE; 409 `default_category_cannot_be_archived`; restore at 100 active categories in the list → 422 `category_limit_reached` (the N15 copy, S1-R13 v1.0); 200 the category row.

**N19 `GET /api/internal-work-orders/quickbooks-accounts?workplace_id=`** — auth MANAGE_ACCOUNTS; the workplace must be accessible and connected (422 otherwise); 200 `{ "data": { "accounts": [ { "id", "name", "number", "type", "active" } ] } }` from the local options snapshot, accounts with the QuickBooks classification Expense — types Expense, Other Expense and Cost of Goods Sold (D46, Q52 ✓). Fetched lazily per picker.

**N20 `GET /api/work-orders/internal-category-preview?company_id=&vehicle_id=`** (S2-R1 tooltip) — auth `ROLE_WORK_ORDER_CREATE_AND_EDIT`; 200 `{ "data": { "internal": bool, "category": {key,name}|null, "source": "asset"|"customer"|"organization_default"|null } }`.

**N21 `GET /api/work-orders/original-candidates?company_id=&vehicle_id=&search=&exclude_work_order_id=&limit=20`** (S2-R2) — auth `ROLE_WORK_ORDER_VIEW`; 200 `{ "data": { "work_orders": [ … ] } }`, ≤ 25 rows: the customer's invoiced, paid and closed work orders at accessible locations (Q38 ✓), same asset first, then newest; `{ "id", "number", "display_number", "date", "first_line_title", "same_asset" }`; search on the number.

**N22 `GET /api/work-orders/{workOrderId}/original-line-candidates`** — auth `ROLE_WORK_ORDER_VIEW`; 200 `{ "data": { "lines": [ … ], "work_order_technicians": [{staff_id,name}] } }`, ≤ 200 lines `{ "line_id", "number", "title", "technicians": [{staff_id,name}] }`; `work_order_technicians` (so the dialog shows "Original technician: [names]" before save, S2-R2; rule §2.5, Q42 ✓).

**N23 `GET /api/work-orders/{workOrderId}/lines/{lineId}/no-charge-preview`** — auth `ROLE_WORK_ORDER_CREATE_AND_EDIT` + `ROLE_PRICING_VIEW`; 200 `{ "data": { "line_price_cents", "new_total_cents", "deposit_total_cents", "all_lines_no_charge": bool } }` (S12-R2 summary, S12-R4 deposit sentence, S12-R10 hint). Called before Mark as No Charge from the line menu and from Edit Line; the N24-N26 and line-change responses do not repeat these values (D60).

**N24 `POST /api/work-orders/{workOrderId}/lines/{lineId}/mark-no-charge`** — auth as N23; body `{ "no_charge_category_key" } & OriginalWorkOrderPayload`; 200 the refreshed line; 409 `work_order_invoiced` (S12-N3), `work_order_not_billable` (S12-N2), `line_declined`, `line_has_return_or_credit` (S12-E8), `internal_work_orders_off` (S12-N1); 422 `no_charge_category_required`, `category_archived`, `invalid_original_work_order`.

**N25 `POST /api/work-orders/{workOrderId}/lines/{lineId}/change-no-charge-category`** — as N24; saves when category or original differs, else 409 `category_unchanged`; 409 `not_no_charge`; allowed with the setting off (Q37 ✓).

**N26 `POST /api/work-orders/{workOrderId}/lines/{lineId}/mark-billable`** — as N24; body `{}`; reprices the line (D34); 409 `not_no_charge`, `work_order_invoiced`; allowed with the setting off (Q37 ✓).

Every N5–N7 and N24–N26 write: one transaction under the work-order row lock, a system note and audit rows. No estimate is re-sent: the portal reads the live classification and line state when an estimate is opened (Appendix D P4, Q54 ✓).

#### 4.3 Work-order log events and system notes

Log events (FE labels from `getNameById()`): `work_order.classification.converted_to_no_charge`, `.converted_to_billable`, `.made_internal`, `.changed_by_customer`, `work_order.category.changed`, `work_order.line.marked_no_charge`, `work_order.line.no_charge_category_changed`, `work_order.line.marked_billable`, `work_order.closed` (payload: posting date), `work_order.reopened`. Close and Reopen also keep today's `invoice.created` / `invoice.reversed` entries (S3-R4). Shop supplies changes keep `work_order.shop_supplies.overridden`. Customer flag changes go to `audit_log` automatically.

System notes (S2-R18, S12-R6), `Source::SYSTEM`, never customer-visible, author name "ShopView", text from `ClassificationNoteComposer` with the PRD wording: Convert to No Charge ("Converted to No Charge by [user]. Category [name], original work order [number]. Prices, fees and discounts removed; costs and hours kept." + the S2-R20 removal summary + the lines whose own no-charge categories were replaced, by line and former category, S2-R5), Change category (from, to, original kept or cleared), Convert to Billable, Close (posting date, account names), Reopen, Mark as No Charge / Change category / Mark as Billable on a line (S12-R6 texts), the part move of S12-E6. Work order numbers travel in `metadata.work_order_refs` so the client links them.

---

### 5. Consumer table: every caller of `Status::getNotVoidStatuses()` / `NonVoidInvoicePredicate`

Source: `grep -rn "getNotVoidStatuses\|NonVoidInvoicePredicate::" src`, re-run 2026-11-09. 19 consumer files (63 matching lines: most sites call `sql()`, `PARAMETER` and `statuses()` together), plus `Status.php` itself, the predicate and one doc mention. Migrated in Phase 1.

| # | File:line | Purpose | Class | Rationale |
|---|---|---|---|---|
| 1 | `Invoicing/Invoice/Domain/Service/InvoiceFetcher.php:169` `getActive()` | freeze pricing/tax/shop supplies on an invoiced work order | **LIVE** | a closed work order stays frozen (snapshot values, S3-R5) |
| 2 | `InvoiceFetcher.php:179` `invoiceForWorkOrderExists()` | duplicate-invoice guard | **LIVE** | no second invoice or Close on a closed work order |
| 3 | `VehicleService/WorkOrders/Domain/Service/WorkOrderDeletionValidator.php:99` | refuse delete with a live invoice | **LIVE** | a closed work order is not deletable (Reopen first) |
| 4 | `VehicleService/WorkOrders/Infrastructure/Persistence/PartSaleListPricing/DoctrinePartSaleListPricingPreloader.php:261` | part-sale list mirror of #1 | **LIVE** | must equal #1; part sales are never closed |
| 5 | `Accounting/Outbox/Infrastructure/Doctrine/AccountingOnboardingSourceFetcher.php:364` | opening AR (open invoices + payments) | **REVENUE** | no receivable |
| 6 | `AccountingOnboardingSourceFetcher.php:1096` `countInvoicesInWindow()` | preview count of the window replay | **LIVE** | `WindowReplaySourceFetcher::windowInvoices()` replays all invoices, so closed ones are published (as v4 Closed); the count must match |
| 7 | `AccountingOnboardingSourceFetcher.php:1227,1235` `openInvoicesQuery()` | opening balances | **REVENUE** | no receivable; rewrite the `:1227` docblock that assumed auto-inclusion |
| 8 | `Accounting/Outbox/Infrastructure/Doctrine/OpeningBalanceCheckFetcher.php:95` | receivable tie-out | **REVENUE** | total 0 anyway; excluded for clarity |
| 9 | `Accounting/Reconciliation/Infrastructure/Persistence/Query/Dbal/ReconciliationSummaryFetcher.php:126,137` | invoice bucket vs hub | **REVENUE** | "the receivable the accounting service books"; the hub excludes Closed from the same bucket |
| 10 | `Reporting/Shared/Infrastructure/Persistence/SalesRevenuePopulation.php:43,114,232` | the sales revenue population (Sales report + dashboard Revenue) | **REVENUE** | S9-R1 |
| 11 | `Reporting/Dashboard/Infrastructure/Controller/SalesTaxReport/SalesTaxReportRequestDto.php:87` | Sales Tax Collected | **REVENUE** | S9-R5 |
| 12 | `…/SalesTaxReport/SalesTaxReportExportRequestDto.php:53` | Sales Tax export | **REVENUE** | S9-R5 |
| 13 | `Reporting/Dashboard/Infrastructure/Persistence/DbalServiceAdvisorAnalysisQueryRepository.php:87-91,138-144,168,214-222` | Advisor Analysis (incl. `earlier.status`) | **REVENUE** | S9-R1; the four sites move together |
| 14 | `Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalInvoicedTechnicianTimesheetQueryRepository.php:176-178` (`i` and `newer`) | Technician Efficiency Invoiced tab, dashboard card, PDF | **LIVE** + chip | S9-R3 (C24) |
| 15 | `…/DbalSalesByRepresentativeFetcher.php:424,448,484,748` | Sales By Representative | **REVENUE** | S9-R1 |
| 16 | `…/DbalPartsVelocityFetcher.php:479-480,908,1122` | Parts Velocity billed pass | **REVENUE** | S9-R7; units come from `inventory_changes` and include internal picks |
| 17 | `…/DbalSalesReportDataFetcher.php:92,135-139,184-190` | Sales report (+ credit memos) | **REVENUE** | S9-R1 |
| 18 | `…/DbalSalesByCustomerFetcher.php:233,255,291,310,588,612,761,1203` | Sales By Customer (all levels, export) | **REVENUE** | S9-R1 |
| 19 | `Dashboard/Tiles/Infrastructure/Persistence/Query/Dbal/DbalSalesByCustomerCountFetcher.php:98,114-115` | Sales by Customer / Top Customers count | **REVENUE** | S9-R1, D37 |
| 20 | `…/DbalBillingEfficiencyBucketFetcher.php:247,253-254` | Billing tiles | **REVENUE** | S9-R1 |
| 21 | `…/DbalSalesRevenueBucketFetcher.php:273,345-346` | Revenue KPI/series, Invoices card | **REVENUE** | S9-R1, D37 |
| 22 | `…/DbalAtRiskCustomerHistoryFetcher.php:185-186` | At-Risk Customers | **REVENUE** | S9-R1 |
| — | `Invoicing/Invoice/Infrastructure/Doctrine/Invoice.orm.xml:129` | docblock | n/a | wording only |

**Invoice-status readers outside the predicate** (behavior noted; changes in the phases):

| Reader | Today | With `closed` | Action |
|---|---|---|---|
| `VehicleService/WorkOrders/Domain/Service/WorkOrderStatusRefresher.php:155-191` | invoiced arm = any invoice; paid = `status = 'paid'` | closed ⇒ invoiced ✓ (D2) | none |
| `Application/Line/Create/CreateCommandHandler.php:152-212` | spawn on SENT/PAID | falls through ✗ | add CLOSED (Phase 5) |
| `WorkOrderListingCriteriaApplier.php:165`, `WorkOrderDetailsFetcher`, `LinesDetailProvider:290`, `LinesStatsFetcher:187` (`!= void` joins) | live invoice join | closed joins ✓ | none |
| Search providers `WorkOrderDocumentProvider:524,530`, `PartSaleDocumentProvider:355`, `PurchaseOrderDocumentProvider:272` | `!= void` | closed included ✓ | + classification (Phase 4) |
| `InvoiceFetcher::getInvoicedHoursForPeriod()` `:60-88` (Shop Efficiency) | no status filter | closed hours counted ✓ S9-R8 | + `NoChargeLinePredicate` (Phase 1); comment |
| `Reporting/Export/Service/InvoiceGenerator.php:129` | no status filter | would export closed ✗ | explicit exclusion + opt-in (Phase 10) |
| `Reporting/Dashboard/Application/CustomersSpending/CustomersSpendingQueryHandler.php:75-90` | no status filter (void included) | would count closed at $0 | classification predicate only (Phase 10, C14) |
| `External/CustomerPortal/Http/Controllers/InvoicesQueryBuilder.php` | all invoices | would list closed ✗ | exclude (Phase 5) |
| `OpenApi/Invoice/Infrastructure/Query/OpenApiInvoiceQueryRepository.php` | all statuses | would list closed ✗ | exclude permanently (Phase 5, D37) |
| `Invoicing/Invoice/Application/HTTP/Listing/ListingQueryHandler.php` | `GET /api/invoices/list` | would list closed ✗ | exclude (Phase 5, D37) |
| A/R aging, collections, statements, credit limit (`customer_transaction` INNER JOIN `invoice`) | ct-driven | no ct written ⇒ excluded ✓ | test only |
| IBS batches | payment-driven | excluded ✓ | none |
| Repair CLIs (C21) | rewrite status/payment status | could rewrite closed ✗ | `i.status <> 'closed'` (Phase 5) |
| `Status::getApiArray()` | invoice status options | unchanged | closed never offered (D37) |

---

#### 5.1 Readers of `invoice.payment_status` (a closed invoice stores `paid`, C21)

Re-run 2026-11-09 (`grep -rn payment_status src`). Customer balance, AR aging and the unpaid list read `customer_transaction` or balances, not this column.

| Reader | Use | Closed invoice |
|---|---|---|
| `Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php:253,439,496,573` + `SalesByRepresentativePaymentStatusMapper` | Paid / Partially Paid / Unpaid bucket | excluded by `NonVoidInvoicePredicate` (`:424,484`); `closed` is not added to `getNotVoidStatuses()` |
| `Accounting/Outbox/Infrastructure/Doctrine/AccountingOnboardingSourceFetcher.php:1222-1243` | open AR at go-live | excluded (`status IN getNotVoidStatuses()`) |
| `Accounting/Outbox/Application/Service/ReopenedDocumentMirror.php:319-323` | an invoice reopened by a payment reversal | never reached: a closed invoice has no payments |
| `OpenApi/Invoice/Infrastructure/Query/OpenApiInvoiceQueryRepository.php:54,242` + `ListController.php:54-61` | public `payment_status` filter | closed invoices removed from every Open API list (Phase 5, S3-R4) |
| `External/CustomerPortal/Http/Controllers/InvoicesQueryBuilder.php:60` | portal payload | closed excluded (Phase 5; the portal's own lists, Appendix D P1) |
| `Invoicing/Invoice/Application/HTTP/Listing/ListingQueryHandler.php:132,203` | `GET /api/invoices/list` label | closed excluded (D37) |
| `VehicleService/Vehicles/Application/HTTP/ListVehicleInvoices/ListingQueryHandler.php:51,144` | asset Invoices tab label | closed rows shown with `display_status: closed`; the FE renders "Closed", never the payment label |
| `Invoicing/Invoice/Application/Service/InvoiceViewService.php:79`, `PrepareIbsCustomerInvoicesService.php:85` | display | the invoice view shows the NO CHARGE document; IBS never lists a closed invoice (non-billable) |
| `Invoicing/Invoice/Application/CLI/ReconcileInvoicePaymentStatusCommand.php:289-310,419-445`, `ReconcileInvoicePaidBalanceCommand.php:176-211` | rewrite `payment_status` from payments | **would flip `paid` → `unpaid`**: add `i.status <> 'closed'` (C21) |
| `FixInvoicePaymentStatusCommand.php:72-77`, `FixSendCorruptedPaidInvoicesCommand.php:185-192`, `FixCrossWorkplaceLabourTypesCommand.php:238,262,527` | status-keyed repairs | do not match `closed`; add the explicit guard anyway (C21) |
| `ChangePaymentController` (`POST /api/invoices/change-payment`) | manual writer | refuses a closed invoice with 409 `use_reopen_work_order` |

### 6. Performance and security summary per phase

| Phase | Volume / query shape | Index | Tenant scoping | Authorization | Reader / writer | Part-sale safety (NFR-008) |
|---|---|---|---|---|---|---|
| 1 | INSTANT column adds on `work_order` (busiest write table), `work_order_line`, `invoice`, `invoice_statement`, `company`, `vehicle`, `setting`, `inventory_changes`; 1 INPLACE index on `company` | `<company>__organization_id_internal_idx`; none on `work_order.classification` | n/a (no new reads) | n/a | n/a | defaults keep every row billable; the predicates are no-ops |
| 2 | none (refactor) | — | unchanged | unchanged | — | create path order unchanged |
| 2C | category lists ≤ 100 per list; counts one grouped query per list; options snapshot one realm | unique keys on both tables; `wo__organization_id_category_id_idx` only if Q21 says so | `OrganizationDecorator` on categories; workplace ids checked against accessible connected workplaces; realm from the workplace's own `bookkeeping` row | `WorkOrderCategorySettingsVoter` (bundle + atom); 403 on account fields without `settingsIntegrations` | writer (small) | categories never touch part sales |
| 3 | candidates ≤ 10 rows + counts; Make internal ≤ 500 per call, one transaction + row lock per work order; ≤ 50 customers; category resolution one batch read | `wo__workplace_type_company_id_idx` serves candidates | accessible workplaces via `ReportLocationsScopeResolverInterface` + `OrganizationDecorator`; ids count-asserted; inaccessible only counted | atoms per §4 | writer | part sales are not candidates (`type = service`) |
| 4 | conversions per work order under a row lock; de-pricing deletes adjustments by `work_order_id`; re-pricing O(lines) with one batch read; original candidates ≤ 25, line candidates ≤ 200; category re-resolution over one customer's or asset's open internal work orders | existing | `WorkplaceDecorator` + `OrganizationDecorator`; original work order checked for same customer and accessible workplace | `ROLE_PRICING_VIEW` on No Charge actions and creation; sell-price policy server-side | writer | every new branch starts with `isService()` / `isNonBillableService()` |
| 4B | line actions one line under the row lock; pricing read +1 column; snapshot +1 predicate | existing | line resolved through the workplace-scoped work order | WO C&E + `ROLE_PRICING_VIEW` on every line write and on the line-door block | writer | line marks refused on part sales (not service) |
| 5 | Close = one work order's rows in one transaction; preview per work order + one bounded hub read; QuickBooks after commit | `inv__work_order_id_idx`, `ic__work_order_id` | `MapEntity` through the workplace-scoped `findById`; preview reads decorated | `InvoiceCreateVoter` + `ROLE_PRICING_VIEW`; Reopen `ROLE_WORK_ORDER_DELETE` | writer | Close refuses billable; `processCreate` guard is a no-op for part sales |
| 6 | planner reads per invoice / delivery; routing lookup one query per delivery; one claim row per posted entry | unique claim keys | rows carry organization + workplace; realm and bookkeeping from the server-side workplace | sync independent of the user's integrations atom (S7-R7) | writer | billable bills, credits and JEs unchanged unless a category is involved |
| 9 | payloads + a few small members; JE v3 for every JE (null block on ordinary ones) | n/a | outbox per organization | n/a | n/a | part-sale invoices: `work_order_id`/`cycle` null, no category |
| 10 | report: two legs over ≤ 366 days, each a range on `invoice (organization_id, created_on)` + PK joins; totals/summary one aggregate each; by-technician: completed lines range on `wol__end_date_idx` + clocks; exports ≤ 10,000 rows per tab | existing (measure; add `(organization_id, status, created_on)` only if needed) | `OrganizationDecorator` on `invoice`, joins pinned to `i.organization_id`, locations through `ReportLocationsScopeResolverInterface` | `ROLE_REPORT_VIEW`; money masked without `ROLE_PRICING_VIEW` | **reader** (heavy report; no write precedes it; no refetch after a user mutation on the page) | the report reads closed and no-charge rows only |
| 13 | seeding one transaction per organization; emit backfill one upsert per category | unique key makes reruns no-ops | per organization | CLI | writer | n/a |

**Golden Rule departures:** none. Make internal spans the user's accessible workplaces with the report pattern, never others (D36). The two legacy classes touched in place (`DeliveryItemModifier` — delegate to a WorkOrders port; `CustomersSpendingQueryHandler` — one predicate) carry SV-12051 follow-ups; no new violator is introduced.

---

### 7. Risks

1. **Rule zero (S9-R14).** The line predicate enters ~10 report queries and the snapshot. *Mitigation:* Phase 1 lands both predicates as NULL-safe no-ops with a byte-compare fixture; the snapshot option defaults off; Customers Spending gets the classification predicate, never the revenue list (C14); SV-12297 runs before launch.
2. **Status fork regression.** Deleting `getNotVoidStatuses()` touches 19 files. *Mitigation:* Phase 1 ships alone with no behavior change, the ratchet test and §5 as the review checklist.
3. **Billable invoice path changes** (statement branch, snapshot option, relabel and reversal stamps, cycle increment, `InvoiceData` 0.00 rows, cost-entry planner hook, S12-R9 eligibility). All are no-ops without a marked line; each has a "billable byte-identical" regression test.
4. **Postings before their integration phase.** A Close or a no-charge-line invoice before Phase 6 would post the parts to Cost of Parts in QuickBooks; before Phase 9 it would reach the hub as v3 with `cogs_parts`, and replay re-sends stored payloads unchanged. *Mitigation:* the release gate (§2.15) — nothing can be enabled until both are live.
5. **Three contract changes** (v4, JE v3, the category upsert) need hub support before core raises any number; JE v3 changes every JE core emits. *Mitigation:* one emission PR raising all three, after hub Release B in production; the three existing gates enforce it.
6. **Category emission backfill.** Categories seeded in Phase 2C are not emitted until Phase 9. *Mitigation:* `--emit-accounting` is a runbook step with a verify query; the hub self-heals an unknown key (H7) and seeds the four starting keys itself.
7. **Seven sell-price writers in two contexts** (C11). A missed one writes a price onto internal work: invisible on screen (read mask), visible to raw-column readers (WIP, Parts Velocity, search). *Mitigation:* one policy, a functional test per site, the mask as backstop.
8. **De-pricing misses an entry path** (canned line, inspection build, ShopCoach drafter `ShopCoachInspectionLineDrafter`, copy hydrator `WorkOrderPartsAndLinesHydrator`, `MovePartToLine`). *Mitigation:* the read chokepoint makes a missed write cosmetic; tests cover canned line, inspection build and copy.
9. **QuickBooks JE posted, claim not updated** (process death between the QuickBooks 200 and the save). *Mitigation:* the claim is saved `pending` before the call; SV-11375 already reports a claim without an external id instead of re-sending it (`JournalEntrySyncService.php:79-99`); cost claims follow the same rule.
10. **Bills synced before the release have no stored line account.** The reclass treats the account as today's resolution; if the mapping changed since, the accountant reclasses the residue. Documented.
11. **Report UNION pagination** over closed invoices and no-charge statements: correct with ORDER BY date, id; both legs scan the range. *Mitigation:* ≤ 366 days, reader connection, FE debounce; measure on the replica before adding an index.
12. **Search reindex** of `work_orders` is a release step; without it only search results miss the badge.
13. **Concurrency.** Close vs line edit: row lock + fingerprint. Double Close: row lock + LIVE guard. First-close marker: COALESCE update. Make internal vs Close: both take the row lock. Line mark vs Create invoice: both take the row lock; S12-R9 is checked inside the create transaction.
14. **Existing $0 corpus** (work orders paid with $0 invoices) stays billable (S9-E2); nothing touches it.
15. **`payment_status` of closed invoices.** `paid` with balance 0 and no due date is "nothing owed" to every payment-status reader; the implementer spot-checks the Sales By Representative payment mapper, `ListVehicleInvoices`, `WorkOrderDetailsFetcher` and the portal.
16. **409 means logout in the FE** unless the call opts out (C27). Every new conflict code is listed in §4 so the FE wires `handlesConflictLocally`.

#### Regression scenarios for modified shared code (callers to verify)

| Modified | Other features depending on it | Verify |
|---|---|---|
| `CreateCommandHandler::processCreate()` + extraction | in-app invoice, Open API create (disabled), sandbox `InvoiceSeeder`, part-sale invoicing | billable service invoice, $0 billable invoice (auto-paid + webhooks), part-sale invoice, deposit auto-apply, carry credit |
| `InvoiceReversalService` | Reverse, Remove | billable reverse + customer-transaction removal unchanged; rows without a category get no `reversesInventoryChangeId` |
| `WorkOrderPricing`, `WorkOrderLinePricingDto`, `getLinesData()` | every work-order read, invoice build, carry credit, `forInvoiceRebuild` subscribers, part-sale list preloader | billable totals identical; parity test green |
| `InvoiceBuilder::addStatements()` | invoice create, pending-invoice rebuild (`UpdateTotalWhen*`) | billable statements identical |
| `WorkOrderStatsFetcher` / `LinesStatsFetcher` | detail stats, Financial Info, snapshot | default call unchanged |
| `WorkOrderShopSuppliesCalculator` | work-order display, invoice build, QuickBooks invoice sync | billable %/min/max unchanged |
| `PricingCalculator::sellPrice()` + the seven sell-price sites | part create/update, canned lines, receive (3 screens), vendor-invoice edit, core charge, part dialog | billable and part-sale prices unchanged (SV-9965, SV-10082 behaviors) |
| `ApplyDefaultAdjustmentsOnWorkOrderCreatedSubscriber` | work-order and part-sale creation | templates and customer defaults still applied on billable and part sales |
| `WorkOrderListingCriteriaApplier` | list (all tabs), board, mobile | `invoiced`/`paid` filters unchanged on billable-only data; Completed tab unaffected |
| `Line\Create\CreateCommandHandler`, `Line\Change\*` | line add/edit on part sales and service, Line Builder, canned lines | SENT/PAID spawn unchanged; absent `no_charge` block → identical; `is_warranty` input ignored |
| `ChangeCustomer\ChangeCommandHandler` | service + part-sale customer change | deposit refusal, part-sale lock, authorizer clear unchanged |
| `SplitWorkOrderCommandHandler`, `MovePartToLineCommandHandler` | split, move part | billable split/move unchanged |
| `PerLineCogsAccountResolver`, vendor bill/credit sync services | vendor bills and credits | billable bills/credits post to the same accounts; `line_class_ids` unchanged |
| `JournalEntrySyncService` | invoice create, reverse, adjustments, manual stock JEs | rows without a category resolve exactly as today |
| `InvoiceGenerator` / `InvoiceData` | Customer Invoice CSV **and** QuickBooks invoice sync | billable rows byte-identical; option off = today's file |
| `DbalInvoicedTechnicianTimesheetQueryRepository` / `DataProvider` | report, PDF, dashboard card | identical numbers on billable-only data |
| `JournalEntryRequestedPayloadBuilder`, `InvoiceCreatedPayloadBuilder` | invoice create, reverse, manual adjustments, onboarding, window replay | ordinary entries carry `work_order: null`; billable v4 = v3 + defaults |
| `SettingsHydrator` + bookkeeping key guard | QuickBooks page, `QuickBooksReferenceField` | unknown key still 422; existing rows unchanged |
| Credit memo create | Issue Credit | billable credits unchanged |
| `CustomersSpendingQueryHandler` | dashboard customer transactions | void invoices still counted |

---

### 8. Engineering decisions (resolved; same user-visible behavior either way)

| Topic | Decision | Why |
|---|---|---|
| Release gating | deploy-time env parameter on the enable paths (D21, D43) | the PRD rejects a product flag; `database.md` forbids seeding DB flags; phases stay independently mergeable |
| Who completes the work order before Close | the FE runs the existing completion steps, then Close (D42) | parity with Create invoice; no duplicated completion rules |
| Persist the stock vs special split on the closed invoice | no; `parts_cost` total only | nothing reads the split after Close |
| Closed invoice `payment_status` | `paid`, balance 0, due date null, + CLI exclusions | "nothing owed" for every payment-status reader |
| QuickBooks idempotency strength | claim saved before the call; a claim without an external id is reported, never re-sent (SV-11375 rule) | no duplicate window |
| Where an inventory row's category survives a deleted invoice | `inventory_changes.expense_category_id` + `work_order_cycle`, copied to reversal rows | replay-safe; no join through a deleted invoice |
| Hub shop-supplies and reclass postings | core emits them as `journal_entry_requested` v3 family entries from `work_order_cost_entry` (D14, D47) | one computation for both integrations |
| Reconciliation bucket | closed excluded on both sides (REVENUE) | no receivable |
| Make internal sync vs queued | synchronous, 500 per call with `remaining` (D12) | re-check with prod query Q20 |
| `NonVoidInvoicePredicate` | rename to `RevenueInvoicePredicate` + `LiveInvoicePredicate` | no reader can misread "non-void" |
| QuickBooks category rows | virtual empty rows, stored on first save (D54) | one write path instead of three |
| Category identity across systems | `category_key` (D50) | the hub seeds its four rows without waiting for core; survives rename |
| Category reference in JEs | JE v3 entry-level `work_order` block (D47) | versioned and CI-gated; a dynamic key would stall the FIFO on an unknown value |
| Original references | side table + technicians table (D55) | keeps `work_order` and `work_order_line` narrow; one shape for work order and line |
| No-charge statement rate | `labour_rate` 0, real rate in `no_charge_labor_rate` | every rate × hours reader stays correct by construction (C3) |
| Vendor-bill line account (D7) | `bookkeeping_vendor_bill.line_account_ids` JSON | same write site and resolver pattern as `line_class_ids` |
| JE claims (D6) | extend `bookkeeping_journal_entry`; sibling `bookkeeping_cost_journal_entry` | no migration of SV-11375's live claims |
| Cost entries | `work_order_cost_entry` in `Accounting/CostEntry` | an organization can run the hub without QuickBooks, so the hub's source ids cannot live in a `bookkeeping_*` table |
| Setting names | `internal_work_orders_*` / `internalWorkOrders*`; chip `internal_work_orders` (D56) | "no charge" names one of two classifications |
| Starting categories | CLI + `OrganizationRegistered` subscriber | per-organization isolation and a failure list (S13-N1) are impossible inside one migration |
| Categories page count | measure (Q21) before indexing `work_order (organization_id, category_id)` | busiest write table |
| Report line leg | join statements on the range-scanned invoices | same shape as the Sales report |
| No-charge line prices | write-time zero on every path + read mask | S2-R19 forbids a stored price; the mask keeps a missed path cosmetic |
| Line no-charge writes | dedicated endpoints + optional block on line create/change; absent = unchanged (D57) | the dialog door and the menu share one service |

---

### 9. Open items

**Round 3 Product answers (all answered in PRD v0.22, page 36; markers removed):**
Q30 hub hold scope — only the line's cost entries are Held (§2.12 H4). Q31 the first invoice carrying a no-charge line also sets the report marker (Phase 1, 4B, 10). Q32 editing an asset's or customer's category re-resolves their open internal work orders (§2.4). Q33 a whole no-charge Comeback/Warranty work order counts as one line in By technician (Phase 10). Q34 export: PDF with both tabs, the CSV carries the open tab (N12; changed by Product in v0.22). Q35 Issue Credit lists a no-charge line's parts at a fixed $0.00 (§2.10). Q36 work-order Change category saves when only the original changes (N7). Q37 line Change category and Mark as Billable stay available with the setting off (N25, N26). Q38 original candidates from accessible locations (N21). Q39 an archived name blocks a new category with the same name (§2.4, N15). Q40 archived categories' QuickBooks and hub rows stay editable (N16). Q41 the category dialog lists only accessible connected locations (N13). Q42 shift-derived roster technicians count as assigned (§2.5). Q43 the categories page count includes billable work orders with a no-charge line (Phase 2C). Q44 derived Warranty flag also on the lines of a whole Warranty work order (§2.4). Q46 "Sales Follow Up" does not exist — nothing built (C13). Q48 the vendor-invoice item view gets `sellPriceSuppressed` (§2.9). Q49 deposit-overflow copy (C10; no backend change). Q52 QuickBooks category pickers list expense-type accounts (N19). Q47, Q50, Q51, Q53 are copy or FE-only; no backend change.

**Hub owner** (not built here): HQ1 Comeback default number, HQ2 suitability rule, HQ3 free-number policy, HQ4 operator command, HQ5 6430 in legacy charts, HQ6 withdrawn never replayable, HQ7 Held stays family-only.

**Prod measurements owed by the engineer running the plan** (neither blocks implementation): **Q20** open billable work orders per $0-workaround customer (Make internal stays synchronous with the 500 cap unless customers sit far above 500); **Q21** table sizes (whether the classification filter needs a trailing index column, whether the categories count needs `wo__organization_id_category_id_idx`, whether the report needs `(organization_id, status, created_on)` on `invoice`).

---

Round 4 (posted 2026-11-09 against v0.22; answered in v0.23 and v0.24, PRD v1.0 page 39): Q62 ✓ the Create invoice confirmation for cost moves (S7-R8, FE-D); Q63 ✓ no IBS call (S2-E6, S12-R4, D67); Q64 ✓ the copy (limits, QB Unexported labels, the portal refusal and changed-after-sent notice, no restocking fee on the $0.00 credit, the Open API single-invoice 404, the QuickBooks column only while connected); Q65 ✓ with a change: the Close row names the core amount (S2-E7, S3-R2, D66 amended); Q66 ✓ and Q67 ✓ (S9-R15 and the User Feedback row updated); HQ8 ✓ with the Q30 addition (S8-R3, S8-N2; the Held move's lifecycle and its source link, D70). No merge gate remains.

### 10. Implementation order (dependency-ordered PRs)

1. **Phase 1** — schema, status fork, predicates, DTO exposure. Ships alone.
2. **Phase 2** — extraction refactor. Ships alone.
3. **Phase 2C** — categories, QuickBooks rows, seeding subscriber + CLI.
4. **Phase 3** — Story 1.
5. **Phase 4** — Stories 2 and 10.
6. **Phase 4B** — Story 12 core.
7. **Phase 5** — Close, Reopen, documents, surfaces.
8. **Phase 6** — QuickBooks and cost entries.
9. **Phase 9a schema PR** — ships right after Phase 1 (the shapes are fixed by D47–D49 and the vendor-bill decision; emits nothing new); hub Phase 7 waits for it, not for 9b (D65). Numbers in this list are positions; phase numbers are named.
10. Hub Releases A and B deployed to production.
11. **Phase 9 emission PR**.
12. **Phase 10** (whole-work-order half after Phase 5; line half after Phases 4B and 6).
13. **Phase 13** release run.

**DoD per PR:** scoped cs-fix / phpstan (files) / pest; schema PRs (1, 2C, 4, 6): `doctrine:migrations:migrate` + `doctrine:migrations:diff --allow-empty-diff` = "No changes detected"; `bin/smoke-test.sh` + log check; the E2E coverage pass for every PR touching a `*Controller.php` (1 and 2 have none); Phase 9: the contracts CI gate + the hub alignment check.

### 11. Files

Existing files modified (relative to `api/`): `src/Invoicing/Invoice/Domain/{Status,Invoice,Statement}.php`, `src/Invoicing/Invoice/Infrastructure/Doctrine/{Invoice,Statement}.orm.xml`, `src/Invoicing/Invoice/Application/HTTP/Create/{CreateCommand,CreateCommandHandler}.php`, `src/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilder.php`, `src/Invoicing/Invoice/Application/Service/{InvoiceReversalService,InvoiceFinancialSnapshotService}.php`, `src/Invoicing/Invoice/Domain/Service/InvoiceFetcher.php`, `src/Invoicing/Invoice/Application/HTTP/Listing/ListingQueryHandler.php`, `src/Invoicing/Invoice/Application/CLI/{FixInvoicePaymentStatusCommand,ReconcileInvoicePaymentStatusCommand,ReconcileInvoicePaidBalanceCommand,FixSendCorruptedPaidInvoicesCommand}.php`, `src/Reporting/Shared/Domain/NonVoidInvoicePredicate.php` (renamed), the 19 consumer files of §5, `src/VehicleService/WorkOrders/Domain/{WorkOrder,PayedWorkOrderReopenedSubscriber,UpdateWorkOrdersOnVehicleChange,WorkOrderVinChanged}.php`, `src/VehicleService/WorkOrders/Domain/Line/Line.php`, `src/VehicleService/WorkOrders/Infrastructure/Doctrine/{WorkOrder.orm.xml,Line/Line.orm.xml}`, `src/VehicleService/WorkOrders/Domain/DTO/WorkOrderPricing/WorkOrderLinePricingDto.php`, `src/VehicleService/WorkOrders/Domain/Service/{WorkOrderPricing,WorkOrderShopSuppliesCalculator,WorkOrderStatsFetcher}.php`, `src/VehicleService/WorkOrders/Domain/Line/Service/LinesStatsFetcher.php`, `src/VehicleService/WorkOrders/Domain/PartRequest/{PricingCalculator,SpecialPartsGetsReceived,UpdatePartRequestFromOrderItemSubscriber}.php`, `src/VehicleService/WorkOrders/Domain/PartsManager/PartsManager.php`, `src/VehicleService/WorkOrders/Domain/Part/UpdateCoreChargePart.php`, `src/VehicleService/WorkOrders/Infrastructure/Persistence/PartSaleListPricing/DoctrinePartSaleListPricingPreloader.php`, `src/VehicleService/WorkOrders/Application/{Create/CreateCommandHandler,ChangeCustomer/ChangeCommandHandler,SplitWorkOrder/SplitWorkOrderCommandHandler,ChangeShopSuppliesCharge/ChangeCommandHandler}.php`, `src/VehicleService/WorkOrders/Application/Line/Create/{CreateController,CreateCommand,CreateCommandHandler}.php`, `src/VehicleService/WorkOrders/Application/Line/Change/{ChangeController,ChangeCommand,ChangeCommandHandler}.php`, `src/VehicleService/WorkOrders/Application/HTTP/{VehicleSwitch/VehicleSwitchCommandHandler,ChangeVin/ChangeVinCommandHandler}.php`, `src/VehicleService/WorkOrders/Application/Handler/Part/MovePartToLineCommandHandler.php`, `src/VehicleService/WorkOrders/Application/Service/Part/Request/UpdatePartRequestDataResolver.php`, `src/VehicleService/WorkOrders/Application/Service/Adjustment/WorkOrderAdjustmentEditabilityGuard.php`, `src/VehicleService/WorkOrders/Application/Subscriber/ApplyDefaultAdjustmentsOnWorkOrderCreatedSubscriber.php`, `src/VehicleService/WorkOrders/Application/Service/InternalNoteWriter.php`, `src/VehicleService/WorkOrders/Domain/Event/WorkOrder/WorkOrderHistoryEvents.php`, `src/VehicleService/WorkOrders/Application/Service/WorkOrder/WorkOrderEventDispatcher.php`, `src/VehicleService/WorkOrders/Application/View/ViewDetails/WorkOrderDetails.php`, `src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/WorkOrderListingCriteriaApplier.php`, `src/VehicleService/Vehicles/Domain/Vehicle.php`, `src/VehicleService/Vehicles/Infrastructure/Doctrine/Vehicle.orm.xml`, `src/VehicleService/Vehicles/Application/HTTP/Change/{ChangeCommand,ChangeCommandHandler}.php`, `src/VehicleService/Vehicles/Application/HTTP/ListVehicleInvoices/ListingQueryHandler.php`, `src/Organization/LabourTypes/Application/Change/LaborRateChangeCascade.php`, `src/Organization/Setting/Domain/Setting.php`, `src/Organization/Setting/Infrastructure/Doctrine/Setting.orm.xml`, `src/Organization/Setting/{UI/HTTP/DTO/ChangeSettingRequestDto,UI/HTTP/ChangeSettingController,Application/Command/ChangeSettingCommand,Application/Handler/ChangeSettingCommandHandler,Application/Dto/SettingDto}.php`, `src/Customer/Customers/Domain/Company.php`, `src/Customer/Customers/Infrastructure/Doctrine/Company.orm.xml`, `src/Customer/Customers/Application/Change/{ChangeCommand,ChangeCommandHandler}.php`, `src/Customer/Customers/UI/HTTP/CreditMemo/Create/CreateController.php` (+ handler), `src/Inventory/Parts/Domain/InventoryActions/InventoryChanges.php`, `src/Inventory/Parts/Infrastructure/Doctrine/InventoryActions/InventoryChanges.orm.xml`, `src/Inventory/Deliveries/Domain/Service/DeliveryItemModifier.php`, `src/Inventory/Orders/Infrastructure/Persistence/Query/Dbal/DbalOrderReceiveViewFetcher.php`, `src/Bookkeeping/Domain/Service/Settings/SettingsHydrator.php`, `src/Bookkeeping/Application/Service/BookkeepingSettingKeyGuard.php`, `src/Bookkeeping/Domain/QuickBooksOptions/QuickBooksReferenceField.php`, `src/Bookkeeping/Application/Service/{FallbackAccountResolver,BookkeepingRetryService}.php`, `src/Bookkeeping/Application/Service/Sync/{JournalEntrySyncService,VendorBillCreateSyncService,VendorBillUpdateSyncService,VendorCreditSyncService}.php`, `src/Bookkeeping/Application/BookkeepingVendorBill/Service/PerLineCogsAccountResolver.php`, `src/Bookkeeping/Domain/BookkeepingJournalEntry/BookkeepingJournalEntry.php`, `src/Bookkeeping/Infrastructure/Doctrine/BookkeepingJournalEntry/{BookkeepingJournalEntry.orm.xml,BookkeepingJournalEntryRepository.php}`, `src/Bookkeeping/Domain/BookkeepingVendorBill/BookkeepingVendorBill.php`, `src/Bookkeeping/Infrastructure/Doctrine/BookkeepingVendorBill/BookkeepingVendorBill.orm.xml`, `src/Bookkeeping/Application/UnexportedItem/ListUnexportedItemsQueryHandler.php`, `src/Bookkeeping/Domain/BookkeepingLog/BookkeepingLog.php`, `src/Bookkeeping/Infrastructure/Doctrine/QuickBooksOptions/DbalQuickBooksOptionSnapshotRepository.php`, `src/Accounting/Outbox/Application/Service/PayloadBuilder/{InvoiceCreatedPayloadBuilder,JournalEntryRequestedPayloadBuilder}.php`, `src/Accounting/Outbox/Domain/Model/{AccountingEventType,BackfillPhase}.php`, `src/Accounting/Outbox/Application/Service/AccountingOnboarder.php`, `src/External/CustomerPortal/Http/Controllers/{InvoicesQueryBuilder,VehiclesQueryBuilder}.php`, `src/OpenApi/Invoice/Infrastructure/Query/OpenApiInvoiceQueryRepository.php`, `src/Search/Infrastructure/DocumentProvider/WorkOrderDocumentProvider.php`, `src/Search/Infrastructure/OpenSearch/mappings/work_orders.json`, `src/Reporting/Export/Service/InvoiceGenerator.php`, `src/Reporting/Export/Application/CustomerInvoiceExport/{CustomerInvoiceExportController,CustomerInvoiceExportQueryHandler,CustomerInvoiceExportDetails/InvoiceData}.php`, `src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/{DbalInvoicedTechnicianTimesheetQueryRepository,DbalWorkInProgressFetcher}.php`, `src/Reporting/Domain/TechnicianEfficiency/Service/DataProvider.php`, `src/Reporting/Dashboard/Application/CustomersSpending/CustomersSpendingQueryHandler.php`, `templates/invoices/invoice.html.twig`, `templates/invoices/legacy/invoice.html.twig`, `docs/integration/{emitted-versions.json,composer.json,MANIFEST.sha256,accounting-events/*}`.

New (relative to `api/src/`): `VehicleService/WorkOrders/{Domain/Classification.php,Domain/ClassificationTransition.php,Domain/Category/,Domain/OriginalReference/,Domain/Service/WorkOrderClassificationResolver.php,Domain/Service/SellPriceWritePolicy.php,Application/Category/,Application/Classification/,Application/Line/NoCharge/,Application/Service/Classification/,Application/Service/Line/LineNoChargeMarker.php,Application/Service/OriginalWork/,UI/HTTP/Category/,UI/HTTP/Classification/,UI/HTTP/Line/NoCharge/,UI/HTTP/MakeInternal/,UI/HTTP/Original/,UI/CLI/SeedWorkOrderCategoriesCommand.php,Infrastructure/Security/WorkOrderCategorySettingsVoter.php,Infrastructure/Persistence/Query/Dbal/{DbalWorkOrderCategoryQueryRepository,DbalOriginalCandidatesQueryRepository,WorkOrderDisplayStatusFilterRewriter}.php}`, `Invoicing/Invoice/{Domain/InvoiceClassification.php,Domain/Service/InvoiceIssuanceEligibility.php,Application/Service/Issue/,Application/Close/,Application/Reopen/,UI/HTTP/Close/,UI/HTTP/Reopen/}`, `Organization/Setting/UI/HTTP/InternalWorkOrders/`, `Accounting/CostEntry/`, `Accounting/Outbox/Application/Service/PayloadBuilder/WorkOrderCategoryUpsertedPayloadBuilder.php`, `Bookkeeping/{Domain/WorkOrderCategoryAccount/,Domain/BookkeepingCostJournalEntry/,Domain/Service/WorkOrderCostRoutingLookupInterface.php,Application/WorkOrderCategoryAccount/,Application/Service/WorkOrderCategoryAccountResolver.php,Application/Service/Sync/CostJournalEntrySyncService.php,Application/BookkeepingVendorBill/Service/OriginalBillLineAccountResolver.php,UI/Http/WorkOrderCategoryAccounts/}`, `Communication/Notes/Domain/SourceMetadata/{ClassificationChangedMetadata,LineNoChargeChangedMetadata}.php`, `Reporting/Shared/Domain/{RevenueInvoicePredicate,LiveInvoicePredicate,BillableWorkOrderPredicate,NoChargeLinePredicate}.php`, `Reporting/Reports/{UI/HTTP,Application}/InternalWorkOrders/`, `Reporting/Reports/Application/Query/InternalWorkOrders/`, `Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalInternalWorkOrdersQueryRepository.php`; migrations as listed per phase in `migrations/`; accounting schemas `docs/integration/accounting-events/{invoice_created.v4,journal_entry_requested.v3,work_order_category_upserted.v1}.schema.json` + fixtures.


**Portal-driven additions (Appendix D):** the HTML that Send to Portal posts for a no-charge work order carries no price (functional test); estimate and invoice snapshot tests per design (modern and legacy) for the stamp, category line and the $0.00 no-charge line; a deposit refused by `deposits_not_available` after a portal checkout is recorded with a distinct activity reason so the admin's existing refund action applies (no auto-refund in this release).


---

# Appendix B — Frontend plan (`app/`)


## Internal Work Orders: frontend (`app/`) implementation plan

**Scope:** PRD v1.0 (Confluence page version 39, final for build), Stories 1–10 and 12–13, frontend only, including the AccountingHub Quasar port (`app/src/components/ts/accounting/**`, the live accounting UI). Story 11 (Open API) is out of scope. Story 13 has no FE code beyond the release gate (D43).
**Design:** Internal Work Orders, All flows v6.1. Where a frame and the PRD text disagree, the text wins. Known divergences, all built per the text: the categories page stays editable while the setting is off (frame 2e draws it read-only); the starting categories exist from the release (frames 2a/2b say "seeded when the setting is first turned on"); the S2-R1 / S2-R2 tooltip copy (frames 2a/2e show retired wording); "No account set for [category]" in the Close confirmation (frame 7b says "internal work orders"); the By technician row "Unassigned" (frame 4/6 says "Not in ShopView / no technician"); Held reason "[Category] row not mapped" (frame 5/4 says "expense account is not mapped").
**Decisions:** Section 3 of the plan (D1–D70) is authoritative; this appendix cites them. Rounds 3 and 4 are answered (PRD v0.22 and v0.23; v1.0, page 39, is final for build), so no `⏸` marker remains (§9).

All paths are relative to `app/` unless they start with `api/` (backend) or `hub:` (`shopview-accounting`). Line numbers were checked on `develop` on 2026-11-09 unless marked otherwise. Every touched component is already `<script lang="ts" setup>` (`WorkOrder.vue` has an allowed companion `<script lang="ts">`); no touch-it-migrate-it conversions are needed. Nothing of this feature exists in `app/src` yet.

---

### 0. Corrections first (read before the phases)

Each row is a place where the PRD or a planning input assumes something the code does not do.

| # | Assumption | Reality (evidence) | Consequence |
|---|---|---|---|
| F1 | One casing for every endpoint | `GET/POST organizations/settings` is camelCase (`src/api/administration/AdministrationModel.ts:67-76`). WO list / Tech View / board rows are camelCase (`src/api/work-orders/LeadBoardModel.ts:49-70`, `WorkOrderTableRow.vue` reads `row.totalPrice`). Search documents (`item.fields.assetLabel`, `components/ts/navigation/search/searchRowVariants.ts`), schedule wires (`src/api/schedule/ScheduleModel.ts:572+`), the QuickBooks integration payload (`AdministrationModel.ts:891-911`), the receive view (`src/api/orders/OrdersModel.ts:163-205`) and the credit-available parts (`src/api/part-sale/PartSaleModel.ts:116`) are camelCase. WO detail, lines, customers, vehicles, reports, hub API and every new endpoint are snake_case | Every new field is typed in its endpoint's convention (§3, D22). A snake key on a camel endpoint reads `undefined` and everything silently stays billable — the worst failure mode, because nothing errors |
| F2 | Locks must learn the status "closed" | A closed work order stays raw `invoiced`/`paid` (D2), so every lock reading the raw status already locks it. Sites: `components/ts/work-orders/WorkOrder.vue:1244`, `components/ts/parts/part-sale/PartSale.vue:234`, `components/ts/shared/FinancialInfoCard.vue:376`, `components/work-orders/ts/WorkOrderLineContextMenuList.vue:268-269`, `components/ts/work-orders/work-order-lines/WorkOrderLines.vue:1596`, `components/ts/work-orders/WorkOrderNavBar.vue:18`; comments `components/shared/OrderStatusCard.vue:493`, `components/ts/work-orders/adjustments/WorkOrderAdjustmentsCard.vue:49`. `LOCKED_LEAD_STATUSES` (`components/ts/work-orders/leadAssignmentRules.ts:17-20`) also lists `declined` and stays separate | Keep every lock on the raw status; one `WORK_ORDER_LOCKED_STATUSES` constant (with `closed` defensively) for the six code sites (E-2). The danger is the reverse: never feed `display_status` into a lock |
| F3 | The Close confirmation completes the work order after it opens | Completion happens inside N10 (`complete_first`, D42): the wizard opened by Close does not call `simple-complete`, and the header path without the wizard does not call `completeAndGoToInvoice`; completing moves every line's status. The fingerprint therefore excludes raw line status and carries a per-line declined flag (D23); it includes the category, and the original work order picked inside the dialog travels in the N10 body | The dialog completes, then posts with the fingerprint from the preview it showed; no re-read |
| F4 | "Close opens the confirmation where Create invoice is" and S7-R8's "Create invoice confirmation" | Create invoice has **no** confirmation: every surface funnels into `WorkOrder.vue runCreateInvoice()` (`:2455-2515`), and the confirmation that once stood in front of it was removed in SV-10312 (`:2433-2440`, `:2519`) | Close gets its own dialog, reached from the same choke point; it does not use the invoice-creation intent. The S7-R8 "Moved from [account] to [account]" information gets a confirmation in front of Create invoice shown only when a cost move happens at invoicing (FE-D, S7-R8 v1.0, Q62 ✓); the S2-R8 cost-move dialog also runs before the line actions |
| F5 | PRD error copy as "alert toast that must be dismissed" | The axios interceptor toasts every 4xx/5xx (`src/boot/axios.ts`); the opt-outs `handlesFailureLocally` / `handlesConflictLocally` exist (`src/axios.d.ts`); a must-dismiss toast is `showErrorNotification({ message, timeout: 0 })` | Every new mutation sets both flags and shows the PRD toast with `timeout: 0`. Exceptions: N10 `work_order_changed` is inline (S3-E5); category-name conflicts show on the Name field |
| F6 | Lines can show "no prices but cost" | The lines table's only pricing switch is `seeFinancialData()` (`WorkOrderLines.vue:1738-1745`, `WorkOrderLineRow.vue:208-230`, `WorkOrderLineParts.vue:400-437`, colspans `work-order-lines/constants.ts:120-128`): all prices or none | A third mode `costOnly` for non-billable WOs (D28, E-1) |
| F7 | A no-charge line "shows $0.00" from its data | The Rate cell shows `row.labour_rate` for a labour line (`WorkOrderLineRow.vue:773-779`); a no-charge line keeps its rate for the record (S12-R7; stored separately per D48) | The FE renders `$0.00` in the Rate cell and blanks Margin for a no-charge line itself (D28 per-line override) |
| F8 | S2-R20 "fixed-price fields hidden" is a field toggle | Fixed pricing is a pseudo labour type: `labour_type_id === 'fixed_line_total' \| 'fixed_labour_price'` (`components/ts/work-orders/LineDialog.vue:761-766`), fields `:182-283` with `validateRequired('Fixed Line Total')` (`:189`); also `WorkOrderLines.vue:1371-1372`, `work-order-lines/helpers.ts:700`, `components/administration/CannedLines.vue:152-154`, `components/ts/work-orders/CannedLineSelect.vue:192-194`. The BE command refuses a line with neither labour type nor fixed price (`api/src/VehicleService/WorkOrders/Application/Line/Change/ChangeCommand.php:77-80`) | Hide every fixed field and filter both pseudo options on non-billable WOs and no-charge lines; the BE removes the fixed price and, when a fixed line stores no labour type, gives it the customer's labour type, else the location's default, when it de-prices (§3 row 31, D62) |
| F9 | S2-R22: "the warranty toggle in the line dialog", "Print Work Order printed Warranty" | No warranty control exists: `is_warranty` is only state + payload (`LineDialog.vue:479`, `:505`, `:1563`; `components/ts/work-orders/dialogs/AddLabourDialog.vue:134`; `WorkOrderLines.vue:1386`; `components/ts/shopcoach/ShopCoachVehicleLineBuilder.vue:662`; `src/store/ts/work-orders/mutations.ts:113`). `components/ts/work-orders/print/buildPrintModel.ts:127` maps it but `print/WorkOrderPrintView.vue` never renders it | Nothing to remove from the line dialog; the FE stops sending `is_warranty` (D57); the print chip "No Charge · [category]" is new print content (Q44 ✓) |
| F10 | S12-R1 "the Line Builder's line dialog" | The Line Builder is the ShopCoach panel opened from New Line (`LineDialog.vue:20-33` button, `ShopCoachVehicleLineBuilder.vue`); it has no line dialog and creates lines directly | The No Charge block lives in Edit Line / New Line (`LineDialog.vue`) only (Q47 ✓) |
| F11 | S2-R19 "replace the notice on the receive and vendor-invoice screens" | One constant `COST_MARGIN_NOTICE` (`components/ts/parts/receive/MultiVendorReceiveModel.ts:114-115`) shown by `components/ts/work-orders/receive/ReceivePartsModal.vue:18-24`, `components/ts/parts/receive/PurchaseOrderReceive.vue:108-115`, `components/ts/parts/receive/MultiVendorReceive.vue:69`. The vendor-invoice item edit (`components/ts/parts/vendor-invoices/DeliveryItemEditDialog.vue:62-67`) has no notice. The Sell column preview mirrors the BE derivation (`resolveSellPreview`, `MultiVendorReceiveModel.ts:166+`) | Notice per last-edited row; preview learns suppression; the vendor-invoice dialog gains the cost-only notice for affected items (Q48 ✓) |
| F12 | QuickBooks category rows can join the Accounts list | Validation keys are split on `':'` (`components/ts/integrations/quickbooks/QuickBooks.vue:615`, `:683`; `quickBooksIntegrationAdapter.ts:337`). `QuickBooksMapping.vue` groups every row by `subcategory` as soon as one row has one (`:454-494`), so a category row in the Accounts list would regroup all Accounts rows under "Other" | Category row keys never contain `':'` (`workOrderCategory_<category_key>`, D50); the adapter peels category rows out like the customer-money / fees panels (`quickBooksIntegrationAdapter.ts:258-268`) and the page renders them between the two halves of the Accounts list (D54). This ships as FE-K2 in the same batch as BE Phase 2C, which emits the rows (D61) |
| F13 | Account Mappings rows come from the hub list | `AccountingSystemAccounts.vue` renders only keys of the static `ACCOUNTING_SYSTEM_ACCOUNT_FIELDS` that the hub lists, and computes dirty / seed / save from the static `ACCOUNTING_SYSTEM_ACCOUNT_KEYS` (`components/ts/accounting/settings/Model.ts:72-252`) | Category rows are a second, dynamic set from the hub's `category_accounts` bag with their own draft and save (D53) |
| F14 | A colliding helper name | `isWorkOrderLocked` already exists in `MultiVendorReceiveModel.ts:78` (raw invoiced/paid) | The shared helper is `isWorkOrderStatusLocked` in `src/utils/workOrderStatus.ts` |
| F15 | The report's Category filter has an "Archived" heading | `FilterOption.group` renders only in multi-select panels (`components/ts/shared/filters/Model.ts:1-9`, `FilterOptionListPanel.vue`); `FilterSingleSelectPanel.vue` has no headings | Additive group rendering in `FilterSingleSelectPanel.vue` |
| F16 | S12-E7 "Issue Credit does not offer the parts of a no-charge line" vs returns | Issue Credit's part picker (`components/ts/credits/PartsReturnPicker.vue`) shows the sell price read-only and an editable restocking fee per part (`:101-110`) | No-charge parts are listed at $0.00 with the restocking fee disabled (Q35 ✓) |
| F17 | Hub "Held" can reuse the status map | `ACCOUNTING_STATUS_META.held` is blue for customer deposits (`components/ts/accounting/shared/Model.ts:58`); `closed` already exists, grey (`:97`) | Event rows map `held` → scoped key `event_held` (amber) (E-6); invoices reuse `closed` |

---

### 1. Shared building blocks

Land in FE-A (types, utils, composable, badges) and FE-K (category pieces). Every later phase uses them.

| Piece | Path (new unless noted) | What it is |
|---|---|---|
| Classification and category types | `src/api/work-orders/WorkOrdersModel.ts` (modify) | `Classification = 'billable' \| 'internal' \| 'no_charge'`; `WorkOrderDisplayStatus = WOStatus \| 'closed'`; `WorkOrderCategoryRef { key; name; archived }` (categories are identified by `key`, never an id, D60); `OriginalWorkOrderFields { original_work_order: { id: UUID; number } \| null; original_not_in_shopview: boolean; original_line: { id: UUID; number; title } \| null; original_technicians: { staff_id: UUID; name: string }[] }` (the four original fields of the WO detail and of each line); `OriginalWorkOrderPayload { original_work_order_id: UUID \| null; original_not_in_shopview: boolean; original_line_id: UUID \| null }` (the flat request fields); `NoChargeBlockedReason = 'declined' \| 'return_or_credit' \| 'invoiced' \| 'not_billable' \| 'setting_off'`; `LineNoChargeFields = OriginalWorkOrderFields & { no_charge: boolean; no_charge_category: (WorkOrderCategoryRef & { requires_original_work_order: boolean }) \| null; no_charge_blocked_reason: NoChargeBlockedReason \| null }` (GR#4) |
| Category API module | `src/api/internal-work-orders/` (`index.ts`, `keys.ts`, `queries.ts`, `InternalWorkOrdersModel.ts`) + `export * from './internal-work-orders';` in `src/api/index.ts` | §3 rows 1–8; layout of `src/api/adjustment-templates/` |
| Feature-state composable | `src/composables/useInternalWorkOrdersSetting.ts` | Reads `useWorkOrderSettingsQuery()` (`src/api/administration/queries.ts:130`). Returns `{ isEnabled, isAvailable, hasFirstClose, firstEnabledAt, hasInternalCustomers, quickbooksConnectedAnyLocation, accountingHubEnabled }`. The only reader of those settings fields |
| Classification utils | `src/utils/workOrderClassification.ts` | `isNonBillable(c?)` (missing → false); `classificationBadgeLabel(c)` → `'Internal' \| 'No Charge' \| null`; `displayStatusOf(row)` (label and color only, never locks); `lineIsNoCharge(line, woClassification)` = `line.no_charge === true && woClassification === 'billable'`; `NO_CHARGE_DEPOSIT_TOOLTIP = 'Reverse the deposit first'`; `hasWorkOrderDeposits(wo)` (extracted from `components/ts/shared/customer-info/CustomerCard.vue:432-435`); `showMustDismissError(message)` |
| Lock constant | `src/utils/workOrderStatus.ts` (modify) | `WORK_ORDER_LOCKED_STATUSES = ['invoiced', 'paid', 'closed']`, `isWorkOrderStatusLocked(status)` (F14); `WORK_ORDER_STATUS_LABELS.closed = 'Closed'` |
| Status color | `src/utils/helpers.ts` (modify) | `STATUS_COLOR_MAP.closed = ['grey-10', 'grey-2']` + text map (neutral; orange belongs to the badge and header) |
| WO badge | `src/components/ts/shared/ClassificationBadge.vue` | `defineProps<{ classification?: Classification \| null; dataTestId: string; dense?: boolean }>()`. Nothing for billable. "Internal" filled `orange-2/orange-10`; "No Charge" outlined `orange-8` (S2-R3 "a different style"). Pattern `badge_over_limit`, `components/shared/OrderStatusCard.vue:22-38` |
| Customer badge | `src/components/ts/shared/InternalCustomerBadge.vue` | "Internal" pill for customers (S1-R8), only while `isEnabled` |
| Line chip | `src/components/ts/work-orders/no-charge/LineNoChargeChip.vue` | "No Charge · [category]" (S12-R3), rendered only when `lineIsNoCharge` |
| QuickBooks mark | `src/components/ts/shared/QuickBooksMark.vue` | `assets/images/quickbooks/quickbooks-logo.svg` (today inlined in `components/ts/parts/Categories.vue:53-60` and `components/ts/administration/LabourTypes.vue`; those two stay as they are) |
| Category + original fields | `src/components/ts/work-orders/no-charge/NoChargeCategoryFields.vue` | v-model `NoChargeDraft` (prop `modelValue`, emit `update:modelValue`, GR#7). Props `customerId`, `vehicleId`, `excludeWorkOrderId`, `mode: 'full' \| 'originalOnly'`, `originalRequired`, `originalHelper: 'creation' \| 'beforeInvoice'`. Renders the Category `Select` (active No Charge options, empty default, rule "Pick a category"), then — when the category requires it — `OriginalWorkOrderSelect`, the Original line `Select` (N22) and `text_original_technician` "Original technician: [names]" / "Original technician: none". A category that does not require the original clears both. A stored original stays displayed even when the current customer's candidates do not contain it (S12-E2) |
| Original work order select | `src/components/ts/work-orders/no-charge/OriginalWorkOrderSelect.vue` | base `Select` `use-input` with debounced N21 search (pattern: `components/work-orders/ts/WorkOrderDialog.vue:14-30`); headers "Same asset" / "Other work orders" / "Other"; option "number · date · first line"; "Not in ShopView" under Other (`option_original_not_in_shopview`) |
| Original technician rule | `src/components/ts/work-orders/no-charge/originalTechnicians.ts` | Display mirror of D55: picked line's technicians, else N22 `work_order_technicians`, else none. The BE stores the authority |
| Draft types | `src/components/ts/work-orders/no-charge/Model.ts` | `NoChargeDraft { categoryKey: string \| null; originalWorkOrder: { id: UUID; label: string } \| null; originalNotInShopview: boolean; originalLineId: UUID \| null }`, `toOriginalPayload(draft)` → `OriginalWorkOrderPayload`, `draftFromRead(noChargeCategory, originalFields)` |
| WO classification context | `src/components/ts/work-orders/useWorkOrderClassificationContext.ts` | `provide` from `WorkOrder.vue` beside its existing provides (`:2863-2866`): `{ classification, isBillable, isInvoiced, isEnabled }`; injected by the line menu, row, card and dialogs |
| Line pricing mode | `src/components/ts/work-orders/useLinePricingMode.ts` | `'full' \| 'costOnly' \| 'none'` provided from `WorkOrder.vue`; `inject` fallback = today's behavior (`PartSale.vue`, imported WOs) |
| Header style | `src/css/app.scss` (modify) | `.order-status-card--non-billable` with `var(--sv-warning-border)` / `var(--sv-warning-fill)` (`src/css/tokens.scss:113-122`, `:287-290`); beats the global `.q-card:not(...)` rule (`app.scss:1405-1414`) with the modifier-on-same-element escape of `components/ts/work-orders/displays/board/WorkOrderBoardCard.vue:9-11` |

---

### 2. Phases

Order: **FE-A → FE-C1 → FE-K → FE-K2 → FE-B1 → FE-B2 → FE-B3 / FE-B4 → FE-C → FE-L1 / FE-L2 → FE-D → FE-M → FE-E → FE-F → FE-G**. FE-C1 has no BE dependency and can run beside FE-A. FE-K2 ships in the same batch as BE Phase 2C, which emits the QuickBooks category rows (D61). FE-L1 can merge ahead of its BE phase (a missing `no_charge` reads as a billable line). FE-G can run any time after FE-B1. FE-E never merges before the hub release that serves `category_accounts` is live in that environment.

Every phase is mergeable on its own; a missing field is billable / uncategorized. Until the release switch flips, `internalWorkOrdersAvailable` is false and no new surface renders (D43).

**Gates per PR:** `npx eslint --max-warnings=0 <files>`; `npx vitest run --maxWorkers=2 <specs>` (one run at a time); `npx vitest related --run --maxWorkers=2 <files>` for shared components; `npx vue-tsc --noEmit`; the compile gate; a browser-walk (`QUICK_LOGIN_USERS` in `api/.env.local`: `admin`, `tech`; roles the seed lacks — no See Financial Data, no Work Orders — Create & Edit, no Work Orders — Delete, no Settings — Integrations — are custom roles on a local/QA org); then `/e2e-after-change`. Every touched `.vue` gets touch-it-add-it test ids (GR#5); every dialog is `BaseFormDialog` / `BaseDialog`, lazy-loaded (GR#6, GR#9); every mutating control uses `Button :async-click`, `:async-confirm` or `useAsyncAction`; no new Vuex action (SV-6324).

#### FE-A: Types, vocabulary, read exposure (depends on BE Phase 1 + 2C schema)

No user-visible change.

**Files**
- `src/api/work-orders/WorkOrdersModel.ts`: the §1 types. WO detail (snake): `classification?`, `display_status?`, `closed_on?`, `can_reopen?`, `shop_supplies_amount?`, `internal_category?: WorkOrderCategoryRef \| null`, `no_charge_category?: WorkOrderCategoryRef \| null`, and the four `OriginalWorkOrderFields` (D60). `Line` (`:334-391`, snake; the detail lines and `GET /api/work-orders/lines/{workOrderId}`): `Partial<LineNoChargeFields>`; `is_warranty` stays readable. List row and `LeadBoardModel.ts` `LeadBoardItem`: `classification?`, `displayStatus?` (camel). All optional until each BE phase ships.
- `src/components/ts/work-orders/work-order-lines/Model.ts`: `WorkOrderLineRowView` carries the `LineNoChargeFields`, including `no_charge_blocked_reason`.
- `src/api/administration/AdministrationModel.ts`: `SettingsData` (`:67-76`) + `internalWorkOrders`, `internalWorkOrdersFirstEnabledAt`, `internalWorkOrdersFirstClosedAt`, `internalWorkOrdersAvailable`, `hasInternalCustomers`, `quickbooksConnectedAnyLocation`, `accountingHubEnabled`; `ChangeSettingsPayload = Omit<SettingsData, read-only fields>` for `updateOrganizationSettings` (`src/api/administration/index.ts:340-345`) and `useSaveWorkOrderSettingsMutation` (`queries.ts:277-290`). `CollectionOption` (`:891-911`): `categoryKey?`, `archived?`, `isDefault?`; category rows carry `subcategory` `'internal_category' \| 'no_charge_category'` (D60).
- `src/api/companies/CompaniesModel.ts`: `Customer` (`:11`) and `CustomerCompanyView` (`:139`) + `internal?: boolean`, `default_internal_category?: WorkOrderCategoryRef \| null`; `CustomerCompanyView` also `open_internal_work_orders_count?`; `CustomerCompanyVehicle` (`:94`) + `internal_category?`, `internal_category_applicable?`, `customer_default_internal_category?`.
- `src/api/orders/OrdersModel.ts` `ReceiveViewItem`: `sellPriceSuppressed?: 'internal' \| 'no_charge' \| 'no_charge_line' \| null`.
- `src/api/notes/NotesModel.ts` `NoteMetadata` (`:396`): `work_order_refs?: { id: UUID; number; is_deleted: boolean }[]`.
- `src/api/billing` invoice detail: `classification`, `category`, `is_closed`.
- `src/components/ts/customers/CustomerCardMobile.vue`: its local `Customer` interface (`:42-51`) becomes `Pick<Customer, …>` from the API model (GR#4).
- The §1 utils, composable, badges, lock constant, label/color entries, `useWorkOrderClassificationContext`, `useLinePricingMode` skeleton.

**MSW:** default handlers for `organizations/settings`, WO detail, WO lines, WO list, `customers`, the vehicle view at billable / uncategorized defaults ("stubs are code").

**Vitest:** `src/utils/tests/workOrderStatus.spec.ts` (extend: `closed` label; `isWorkOrderStatusLocked` for invoiced/paid/closed/complete); `src/utils/tests/workOrderClassification.spec.ts` (new: `displayStatusOf`, `isNonBillable(undefined)`, `lineIsNoCharge` false on non-billable WOs); `src/composables/tests/useInternalWorkOrdersSetting.spec.ts` (new); `src/components/ts/shared/tests/ClassificationBadge.spec.ts` (new).

**Browser-walk:** `/workorders` and one WO detail as `admin`: nothing looks different, console clean.

#### FE-C1: Finish-action seam, pure refactor (no BE dependency)

The finish action is decided in five places: header (`components/ts/work-orders/WorkOrderNavBar.vue:102-131`, `button_create_invoice_header`), menu (`components/work-orders/ts/WorkOrderNavBarMenu.vue:64-81` via `showCreateInvoiceInMenu`, `WorkOrderNavBar.vue:400-412`), Finance toolbar (`components/ts/billing/InvoiceActionBar.vue:364-397`), bulk bar (`work-order-lines/useBulkActions.ts:192-194, 565-585`), wizard CTA (`components/ts/work-orders/complete/CompletionWizard.vue:1791-1799`).

- New `src/components/ts/work-orders/useWorkOrderFinishAction.ts`: `{ kind: ComputedRef<'invoice' \| 'close'>; label; mobileIcon; testIds: { header, menu, finance, bulk }; canRun }`. Here `kind` is always `'invoice'` and every value equals today's literal.
- The five surfaces read label, test id and permission from it; test ids unchanged.
- **Vitest:** `src/components/ts/work-orders/tests/useWorkOrderFinishAction.spec.ts` (new). `useCreateInvoiceGate.spec.ts`, `useBulkActions.spec.ts`, `WorkOrderNavBarMenu.spec.ts`, `InvoiceActionBar.spec.ts`, `CompletionWizard.spec.ts` pass **unchanged** (acceptance criterion).
- **Browser-walk:** Create invoice from header, menu, bulk bar and Finance tab on a billable WO: identical behavior.

#### FE-K: Internal Work Orders categories page + category building blocks (depends on BE Phase 2C: N13–N19)

**API** (`src/api/internal-work-orders/`)
- Paths under `/api/internal-work-orders/categories`, addressed by `categoryKey` (D60): `fetchCategories(list, archived)` N13; `fetchCategoryOptions(list, includeArchived)` N14; `createCategory(body)` N15 (POST, returns `{ key }`); `updateCategory(categoryKey, body)` N16 (PUT); `fetchArchiveImpact(categoryKey)` N17; `archiveCategory(categoryKey)` / `restoreCategory(categoryKey)` N18; `fetchQuickBooksAccountOptions(workplaceId)` N19 (`/api/internal-work-orders/quickbooks-accounts?workplace_id=`). Mutations with both local-failure flags.
- Queries: `useCategoryOptionsQuery(list, { includeArchived })` (`staleTime` 5 min; backs every select), `useCategoryAdminListQuery(list, archived)`, `useQuickBooksAccountOptionsQuery(workplaceId, enabled)` (fired on picker `@popup-show`, `staleTime` 5 min, E-13).
- Every category mutation invalidates `internalWorkOrderKeys.all` **and** `administrationKeys.quickBooksIntegration()` (the ShopView Accounts page shows the same mapping, S5-R3).

**Registration** (the 4 touches of every admin tab)
- `src/router/routes.ts`: child of `administration` (pattern `:955-962`), path `internal-work-orders`, name `InternalWorkOrderCategories`, `meta.requiredCheck: () => permissionService.has('settingsService') && isInternalWorkOrdersAvailable()` (D43).
- `src/components/ts/administration/AdminLeftMenuNav.vue`: `q-route-tab` in the Service group (`:123-224`) after Fees & Discounts, `data-test-id="link_internal_work_orders_tab"`, `trackNav('internal_work_orders')`.
- `src/pages/Administration.vue`: `defineAsyncComponent` import, `componentMap` (`:181-206`), `routeNameToTab` (`:222-256`), `components[]` entry "Internal Work Orders".

**Components** (`src/components/ts/administration/internal-work-orders/`)
- `InternalWorkOrderCategories.vue` (S1-R13):
  - Title "Internal Work Orders"; q-tabs "Internal categories" / "No Charge categories" (`tab_internal_categories`, `tab_no_charge_categories`).
  - While the setting is off: `InfoNotice` "Internal Work Orders is off. Turn it on in Settings > Work Orders." (`InfoNotice` suffix `iwo_categories_setting_off` → `banner_iwo_categories_setting_off`); the lists stay editable.
  - Buttons "New Internal Category" (`button_new_internal_category`) / "New No Charge Category" (`button_new_no_charge_category`), each disabled once its list holds 100 active categories (N13 `meta.active_count`), with "You can have up to 100 active categories in this list. Archive one to add another." shown beside it (`text_iwo_category_limit_<list>`, S1-R13 v1.0); Restore on an archived row is disabled the same way.
  - `Table` (`table_internal_categories`, `table_no_charge_categories`). Internal columns: Category (+ "Default" badge), QuickBooks expense account (header with `QuickBooksMark`), Internal customers using it, Work orders. No Charge columns: Category, QuickBooks expense account, Original work order ("Required" / "Not asked"), Work orders. The QuickBooks column shows the current location's entry of `quickbooks_accounts` (matched on the active location id) and is rendered when the current location is connected, as parts Categories does (`components/ts/parts/Categories.vue:48-62`, `:169-178`); an empty account reads "Not set" with a warning icon (`text_category_qb_not_set_<key>`). Work orders counts billable WOs carrying a no-charge line of the category too (Q43 ✓).
  - Row menu (`button_category_menu_<key>`): Edit (`menu_item_edit_category_<key>`), Archive (`menu_item_archive_category_<key>`). Archive on the default category is disabled with the tooltip "One default at a time; it cannot be archived."
  - "Show archived (n)" (`link_show_archived_categories`, n = N13 `meta.archived_count`) switches the table to the archived rows with Restore (`button_restore_category_<key>`); "Show active" returns.
  - Archive / restore flow follows `components/ts/maintenance/settings/MaintenanceSchedules.vue:207-215`, `:396-420` (archive dialog, `useAsyncAction` restore).
- `InternalWorkOrderCategoryDialog.vue` (`BaseFormDialog`, suffix `iwo_category`; titles "New Internal Category" / "New No Charge Category" / "Edit Category") (S1-R14):
  - Name (`Input`, suffix `iwo_category_name`, required, max 60). 422 `name_taken` shows the server message on the field, including the archived variant "A category with this name is archived. Restore it instead." (Q39 ✓).
  - "QuickBooks expense account": one `CategoryQuickBooksAccountPicker` per entry of `quickbooks_accounts` (the connected locations the user can access, Q41 ✓) with the S1-R14 helper. Without Settings — Integrations each picker is read-only with "Set in Integrations > QuickBooks" (`text_iwo_category_qb_read_only`) and the request omits `quickbooks_accounts`. Hidden when no location is connected.
  - No Charge: checkbox "Requires the original work order" (`checkbox_iwo_category_requires_original`) + S1-R14 helper. Internal: checkbox "Default category" (`checkbox_iwo_category_default`) + helper; it cannot be unticked on the current default.
  - AccountingHub: read-only line from `accounting_hub_account_label` when the hub is enabled (`text_iwo_category_hub_account`).
  - Failure → `showMustDismissError('Could not save the category. Try again.')`; the dialog stays open.
- `CategoryQuickBooksAccountPicker.vue`: wraps `components/ts/integrations/quickbooks/QuickBooksSelect.vue` with options from N19 loaded on open (`{ accounts: [{ id, name, number, type, active }] }`, expense-type accounts only), `account-type-filter` = `CATEGORY_EXPENSE_ACCOUNT_TYPES` (Expense, Other Expense, Cost of Goods Sold; D46, Q52 ✓; a currently mapped account of another type stays visible from N13 `quickbooks_accounts[].account_name`), suffix `select_iwo_category_qb_<workplaceId>`, row states from `account_state` (`active` / `inactive` / `missing`, the QuickBooks page's own states).
- `ArchiveCategoryDialog.vue` (`BaseDialog`, suffix `archive_category`): reads N17 on open (`customer_count`, `asset_count`, `next_in_line_name`); with counts shows "[n] internal customers and [m] assets use this category as their default. Their new work orders will use the next category in line." (S1-R16), else "Archive [name]? It stays on the work orders and lines that used it."
- `Model.ts`: page and dialog draft types; `CATEGORY_EXPENSE_ACCOUNT_TYPES`.
- The shared pieces of §1: `QuickBooksMark`, `NoChargeCategoryFields`, `OriginalWorkOrderSelect`, `originalTechnicians.ts`, `no-charge/Model.ts`, `LineNoChargeChip` (rendered from FE-L1).

**Vitest:** `internal-work-orders/tests/InternalWorkOrderCategories.spec.ts` (tabs, columns per list, Default badge, Not set, QB column only when the current location is connected, New and Restore disabled at 100 active with the message, archived count, restore, setting-off notice, still editable), `InternalWorkOrderCategoryDialog.spec.ts` (60 chars, name conflict on the field, read-only pickers and no `quickbooks_accounts` without Settings — Integrations, default lock, hub line), `ArchiveCategoryDialog.spec.ts`, `CategoryQuickBooksAccountPicker.spec.ts` (lazy load, type filter keeps current), `src/components/ts/work-orders/no-charge/tests/{NoChargeCategoryFields,OriginalWorkOrderSelect,originalTechnicians}.spec.ts` (requires/clears, technician line from line or WO, stored original shown, `originalOnly` mode, Not in ShopView), `AdminLeftMenuNav` spec (tab hidden without `settingsService` or while unavailable), queries spec (both invalidations).

**Browser-walk:** `/administration/internal-work-orders` as `admin` on a QuickBooks-connected location: both tabs, a new category, edit with two connected locations, archive a category that is a customer's default, Show archived, restore; a role with Settings — Service but not Settings — Integrations; setting off (notice, still editable); a direct link while the release switch is off (redirect).

#### FE-K2: QuickBooks ShopView Accounts, one row per category (Story 5; depends on BE Phase 2C rows inside `bookkeeping/integration`, D54, D61)

The backend adds the category rows to the Accounts group from Phase 2C, only where the release gate is open (D61), so this batch ships with BE Phase 2C and right after FE-K; no QuickBooks page regroups before it can render them.

- `components/ts/integrations/quickbooks/quickBooksIntegrationAdapter.ts` (`buildQuickBooksForm`, `:231-292`): peel rows whose `subcategory` is `internal_category` or `no_charge_category` (D60) out of `settings_group_account` into `categoryExpenseRows` (modeled on the customer-money / fees-and-discounts peel at `:258-268`, which today runs only for the Products & Services group: the Accounts group returns early at `:249-255`, so this is a new branch in front of that return), and split the Accounts rows into `accountsBefore` (through `costOfPartsId`) and `accountsAfter`. `allFormRows` (`:210-213`) includes the new rows so dirty tracking, baseline and issues cover them.
- `components/ts/integrations/quickbooks/QuickBooks.vue` (`:208-261`): inside the Accounts `QuickBooksMappingSection`, render `QuickBooksMapping(accountsBefore)`, then `CategoryExpenseMappingPanel`, then `QuickBooksMapping(accountsAfter)`, so the rows sit directly under Cost of Parts and above Cost of Goods (tax) (S5-R1). `isRenderedValidationKey` (`:610-640`) recognizes category rows (key `workOrderCategory_<category_key>`, no `':'`, F12).
- New `components/ts/integrations/quickbooks/CategoryExpenseMappingPanel.vue`: headers "Internal work orders" (`text_quickbooks_category_header_internal`) and "No Charge work orders" (`text_quickbooks_category_header_no_charge`); each row named after its category with `QuickBooksMark` and, on the default Internal category (`isDefault`), a "Default" badge; archived rows greyed (`quickbooks_category_row_archived_<key>`) and still editable (Q40 ✓); passes the **same** row objects to `QuickBooksMapping` (the rule documented at `FeesAndDiscountsMappingPanel.vue:20-40`); under the rows `text_quickbooks_shop_supplies_note` "Shop supplies on internal and no-charge work orders are credited to the income account of your Shop supplies item in Products And Services; nothing to map here."
- `QuickBooksMapping.vue`: `accountTypeFilterFor` returns `CATEGORY_EXPENSE_ACCOUNT_TYPES` for category rows (Q52 ✓); `emptyHintFor` returns "Not set. Parts cost of [category] work orders posts to the ShopView Review account until you pick one." for an empty category row while `isEnabled`, and nothing while the setting is off (S5-R4, S5-R5); an `archived` row class. Existing rows are unaffected.
- Saving is the existing `PUT bookkeeping/settings` item `{ key: 'workOrderCategory_<category_key>', id, sectionKey: 'settings_group_account' }`; the 422 per-field errors and the live inactive / deleted states apply to these rows as to any other (S5-E1).

**Vitest:** `quickbooks/tests/quickBooksIntegrationAdapter.spec.ts` (peel, split, dirty, issues), `CategoryExpenseMappingPanel.spec.ts` (headers, order, default badge, archived class, hint only while on, note), `QuickBooks.spec.ts` (rows under Cost of Parts, save item, dirty, validation and scroll-to-problem on a category row), `QuickBooksMapping` spec (type filter and hint only for category rows).

**Browser-walk:** Settings > Integrations > QuickBooks as `admin` on a QB-connected location with the release gate open: category rows under Cost of Parts, no existing Accounts row regrouped, no empty hint while the setting is off (the hints with the setting on are walked once FE-B1 can turn it on), map and save, the same account visible in the category dialog; an archived category row.

#### FE-B1: Setting, first-enable modal, customer flag and default category, asset category, Make internal (Story 1; depends on BE Phase 3 + FE-K)

**API** (`src/api/administration/`): `enableInternalWorkOrders({ internal_customer_ids })` → `POST organizations/settings/internal-work-orders/enable` (N1), result `{ internal_work_orders, first_enable, flagged_customer_ids }`; `useEnableInternalWorkOrdersMutation` patches the cached `SettingsData` (`internalWorkOrders: true`, `internalWorkOrdersFirstEnabledAt ??= now`) with `setQueryData` and invalidates `companyKeys.lists()` — never invalidate-and-reseed (the settings page posts its whole draft and reseeds it from the query, `components/ts/administration/WorkOrderSettings.vue:230-236`; a reseed would wipe the user's other unsaved toggles).

**API** (`src/api/work-orders/`): `fetchMakeInternalCandidates(companyId)` (N2), `fetchAllMakeInternalCandidates()` (N3), `makeInternal({ company_id, all_open: true, exclude_ids })` (N4, repeated while `remaining > 0`, D12/D24). Types `MakeInternalCandidates { company_id; company_name; total; inaccessible_count; can_make_internal; work_orders: MakeInternalCandidateRow[] }`, `MakeInternalCandidateRow { id; number; display_number; location_name; unit; status; has_deposit; has_vendor_bill }`, `MakeInternalResult { changed; skipped; failed; remaining }`. Candidates are imperative reads (`queryClient.fetchQuery`, `staleTime: 0`); `useMakeInternalMutation` invalidates `workOrderKeys.all`.

**API** (`src/api/companies`): update request + `internal?: boolean`, `default_internal_category_key?: string \| null` (update only; D60). Vehicles change: `internal_category_key?: string \| null` in `components/customers/ts/VehicleModel.ts:49` `VehiclePayload` (edit only).

**Components**
- `components/ts/administration/WorkOrderSettings.vue` (Workflow group, `:5`):
  - Toggle row `<h5 class="setting-name">Internal Work Orders</h5>` + description verbatim from S1-R1 + `q-toggle :model-value="settings.internalWorkOrders" @update:model-value="onInternalWorkOrdersToggle" data-test-id="input_internal_work_orders"`; rendered only while `isAvailable` (D43).
  - `onInternalWorkOrdersToggle(on)`: first turn-on (`!internalWorkOrdersFirstEnabledAt`) → draft on + `InternalWorkOrdersFirstEnableDialog`; otherwise flip the draft (saved with Save settings). After a save whose saved value went off → on, run the S1-R10 sweep (N3 → `useMakeInternalQueue`).
  - Hint lines from the **saved** value (E-9), each with an info icon:
    - Line 1: "Manage categories in **Internal Work Orders** (Administration > Service). Their expense accounts are set on each category." (`text_iwo_hint_categories`, link `link_iwo_hint_categories` → `InternalWorkOrderCategories`). While `!hasInternalCustomers` it reads instead "No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer > Internal customer. No Charge on customer work orders works now." (`text_iwo_hint_no_internal_customer`, S1-R4).
    - Line 2 (`text_iwo_hint_accounts`): `QuickBooksMark` + "Map their expense accounts in Integrations > QuickBooks." ("QuickBooks" = `link_iwo_hint_quickbooks` → `QuickBooks`) when `quickbooksConnectedAnyLocation`; names "Accounting > Account Mappings" (`link_iwo_hint_account_mappings` → `AccountingSystemAccounts`) when `accountingHubEnabled`; both when both; omitted when neither.
- New `components/ts/administration/InternalWorkOrdersFirstEnableDialog.vue` (`BaseFormDialog`, suffix `iwo_first_enable`, default `persistent`): title "Which customers are your own company?"; body verbatim S1-R2; customer picker = base `Select multiple use-chips use-input emit-value map-options @filter` (pattern `components/ts/notifications/TagGroupDialog.vue:22-41`), suffix `iwo_internal_customers`, at most 50 picks (a 51st is not added) with the hint "Pick up to 50 customers here. Flag more from Edit Customer." under the picker (`text_iwo_first_enable_limit`, S1-R2 v1.0); line "You can change this any time: Customers > Edit Customer > Internal customer." (`text_iwo_first_enable_change_later`); `#action-buttons`: "Do this later" (`:async-click`, suffix `iwo_do_this_later`) and "Save" (`:disable="!picked.length"`, suffix `iwo_save_internal_customers`). The X (`@close`) runs Do this later; Esc and outside click do nothing (GR#9). Failure → "Could not save the internal customer. Try again." (must dismiss), dialog stays open with the picks. Success emits `saved(flaggedIds)` → the parent queues N2 per id with `total > 0`.
- New `components/ts/customers/MakeInternalDialog.vue` (`BaseDialog`, suffix `make_internal`): body "[n] open work orders for [customer] are billable. Make them internal? Prices, fees and discounts are removed; costs and hours are kept." (`text_make_internal_body`); rows `row_make_internal_<id>` "number · location · unit · status" (up to 10); notes `text_make_internal_note_deposit_<id>` "Deposit: stays billable", `text_make_internal_note_vendor_bill_<id>` "Vendor bill: cost moves at Close"; `text_make_internal_more` "and [n] more"; `text_make_internal_inaccessible` "[n] more at locations you don't have access to." (from `inaccessible_count`). With `can_make_internal`: "Keep billable" (`button_keep_billable`) + "Make internal" (`button_make_internal`, `:async-confirm`, N4 `{ company_id, all_open: true }` looped); otherwise one "OK" (`button_make_internal_ok`, `closeDialog`). `failed.length > 0` → "[n] work orders could not be made internal. Open Edit Customer and save to try again." (must dismiss).
- New `components/ts/customers/useMakeInternalQueue.ts`: FIFO, one dialog at a time (S1-R2, S1-R10); used by `WorkOrderSettings.vue` and `CustomerDialog.vue`.
- New `components/ts/customers/RemoveInternalFlagDialog.vue` (`BaseDialog`, suffix `remove_internal_flag`, `type="warning"`): title "Remove the Internal flag from [customer]?"; body (`text_remove_internal_flag_body`) "[n] open internal work orders for [customer] stay internal and close without an invoice. New work orders for [customer] will be billable." (first sentence omitted when `open_internal_work_orders_count` is 0); Cancel / "Remove flag".
- `components/ts/customers/CustomerDialog.vue` (Edit only):
  - After "PO is required" / "Pin notes?" (`:283-297`): `q-checkbox v-model="company.internal" label="Internal customer" data-test-id="checkbox_customer_internal"`, `v-if="editMode && isAvailable && (isEnabled || initialInternal)"`, `:disable="!isEnabled"`, helper `text_customer_internal_helper` verbatim S1-R7; while off `text_customer_internal_setting_off` "Turn on Internal Work Orders in Settings to change this." with "Settings" as `router-link` `link_customer_internal_settings`.
  - When ticked (setting on): `Select` "Default internal category" (suffix `customer_default_internal_category`), active Internal options of N14, preselected with the option whose `is_default` is true when the customer has none. A stored archived value displays "[name] (archived)" with `text_customer_default_category_archived` "Archived. Pick an active category." (Q51 ✓).
  - Untick when `initialInternal` → `RemoveInternalFlagDialog`; Cancel re-ticks (S1-R6).
  - `createInitialFormData()` (`:390-410`) and the request literal carry `internal` and `default_internal_category_key` on update only.
  - After a successful update with the flag on → N2 → queue if `total > 0` (S1-R11).
  - Touch-it-add-it: suffixes on the three shop-supplies `CurrencyInput`s (`customer_shop_supplies_percent`, `customer_min_shop_supplies`, `customer_max_shop_supplies`), `StateSelect`, `CountrySelect`, `LabourTypeSelect`, `TaxSelect`.
- `components/customers/ts/VehicleDialog.vue` (Edit Asset; consumers `components/work-orders/ts/WorkOrderDialog.vue:122`, `components/shared/vehicle-info/VehicleCard.vue:290`, `components/ts/customers/VehicleInvoices.vue:378`, `components/ts/customers/Customer.vue:239`, `components/ts/work-orders/dialogs/ChangeWorkOrderAssetDialog.vue:48`):
  - After "Pin notes?" (`:162-169`): `q-separator` + `Select` "Internal category" (suffix `asset_internal_category`, clearable; empty = the customer's default), active Internal options; helper led by `QuickBooksMark`: "Categories are mapped to QuickBooks expense accounts. This one is where the asset's internal work orders post. Leave it empty to use the customer's category, [customer's default]." (`text_asset_internal_category_helper`, name from `customer_default_internal_category`).
  - Rendered only `isEditMode && internal_category_applicable && isEnabled && isAvailable`; a stored value on an asset of a non-flagged customer stays hidden (S12-E8). Archived stored value as on Edit Customer.
  - `buildVehiclePayload` (`:488-512`) adds `internal_category_key` in edit mode only; 409 `asset_not_internal` → generic save failure toast.
- Badges (S1-R8, only while `isEnabled`): `src/pages/Customers.vue` new `#body-cell-customer` slot with `InternalCustomerBadge data-test-id="badge_customer_internal"`; `components/ts/customers/CustomerCardMobile.vue` (`:9-13`) + `card_customer_mobile`, `text_customer_mobile_name`; `components/ts/customers/CustomerLeftSection.vue` (`:9-29`) badge + `data-test-id-suffix="edit_customer"` on the pencil.

**Permissions:** toggle and modal on the Settings route (`settingsApp`; the modal flags customers without a customer atom, S1-N2). The checkbox and the default category are inside Edit Customer (`canEdit('customers')`). Make internal by N2 `can_make_internal` (WO Create & Edit). The asset field follows Edit Asset's own permission.

**Vitest:** `components/ts/administration/tests/WorkOrderSettings.spec.ts` (first turn-on opens the modal, later turn-on does not, unsaved toggles survive N1, both hint lines and every link variant, S1-R4 variant, off→on sweep, hidden while unavailable); `InternalWorkOrdersFirstEnableDialog.spec.ts` (Save disabled, the 50-pick cap and its hint, X = Do this later, failure toast `timeout: 0` + stays open, double press posts once); `components/ts/customers/tests/{MakeInternalDialog,useMakeInternalQueue,RemoveInternalFlagDialog}.spec.ts`; `CustomerDialog.spec.ts` (hidden on New; read-only + link while off; default category appears on tick with the default preselected; archived display; untick → Remove flag, Cancel re-ticks; create payload byte-identical); `components/customers/ts/tests/VehicleDialog.spec.ts` (field only on applicable assets in edit mode with the setting on; payload); `CustomerLeftSection.spec.ts`, `src/pages/tests/Customers.spec.ts` (badge only while on).

**Browser-walk** (`admin`, local org with `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED=true`): toggle → modal → pick two customers → Save → Make internal per customer → hints and links; toggle off, save; on, save (no modal, sweep dialogs); customers list badge, 390 px card, header badge; Edit Customer tick + default category, untick → Remove flag; setting off → read-only checkbox + link; Edit Asset on an internal customer's forklift and on a regular customer's truck; a role without Work Orders — Create & Edit → OK-only dialog.

#### FE-B2: Creation, Convert, Change category, customer change, system notes (Stories 2 and 10; depends on BE Phase 4 + FE-K)

**API** (`src/api/work-orders`)
- `WorkOrderForm` (`src/components/work-orders/ts/Model.ts:47-66`) + create payload: `no_charge: boolean; no_charge_category_key: string \| null` & `OriginalWorkOrderPayload` (flat `original_work_order_id`, `original_not_in_shopview`, `original_line_id`; D60). A missing key with `no_charge` → 400 on field `no_charge_category_key`.
- `convertToNoCharge(workOrderId, { no_charge_category_key, ...OriginalWorkOrderPayload })` (N5 `POST /api/work-orders/{workOrderId}/convert-to-no-charge`), `convertToBillable(workOrderId)` (N6 `…/convert-to-billable`, body `{}`), `changeCategory(workOrderId, { no_charge_category_key, ...OriginalWorkOrderPayload })` (N7 `…/change-category`). Result `ClassificationChangeResult { work_order_id; classification; no_charge_category?; shop_supplies_amount? }`.
- `fetchInternalCategoryPreview({ company_id, vehicle_id })` (N20 `GET /api/work-orders/internal-category-preview`) → `{ internal: boolean; category: { key; name } \| null; source: 'asset' \| 'customer' \| 'organization_default' \| null }`.
- `fetchOriginalCandidates({ company_id, vehicle_id, search, limit: 25, exclude_work_order_id })` (N21 `GET /api/work-orders/original-candidates`) and `fetchOriginalLineCandidates(workOrderId)` (N22 `GET /api/work-orders/{workOrderId}/original-line-candidates`) — consumed by `NoChargeCategoryFields`.
- `fetchVendorBillCostMoves(workOrderId, { target, category_key?, moment, line_id? })` (N8; `moment` = `closed` \| `invoiced`): `{ integration: 'quickbooks' \| 'accounting_hub' \| 'both' \| null; bills: { part_name; line_title; amount: number \| null }[]; total: number \| null; from: { kind: 'cost_of_parts' \| 'category'; category_key; label }; to: { kind; category_key; label }; moves: { from; to; amount: number \| null; bills: … }[]; moves_when: 'invoiced' \| 'closed' }`; `target` optional for the invoice variant (cents; `label` is the mapping-row name: "Cost of Parts" or the category name).
- `fetchChangeCustomerPreview(workOrderId, companyId)` (D25, `GET /api/work-orders/{workOrderId}/change-customer-preview?company_id=`): `{ classification_after; category_after: { key; name } \| null; shop_supplies_reset_amount: number \| null }`.
- Mutations invalidate `workOrderKeys.all`; the caller re-runs the injected `fetchWorkOrder()` and the lines refetch (the WO detail is still Vuex).

**Components**
- `components/work-orders/ts/WorkOrderDialog.vue` (New only; Edit mode untouched), after "Asset Here?" (`:61-69`), inside `<template v-if="!isEditMode && isEnabled && isAvailable">`:
  - Internal customer: `ClassificationBadge classification="internal" data-test-id="badge_wo_dialog_internal_customer"` + info icon `icon_wo_dialog_internal_info` whose tooltip (`tooltip_wo_dialog_internal`) reads "Internal customer: no prices, no invoice. Posts to [category], from the asset." / "… from the customer." from N20 (source `organization_default` → "… from the customer.", Q51 ✓). N20 re-runs in `handleVehicleChange`. No checkbox, no category select (S2-R1).
  - Regular customer selected and `seeFinancialData()`: `q-separator`, `q-checkbox v-model="workOrder.no_charge" label="No Charge" data-test-id="checkbox_wo_no_charge"`, info icon `icon_wo_no_charge_info` with "Warranty, goodwill or comeback work. Closes without an invoice; parts cost posts to the expense account of the category."; when ticked `NoChargeCategoryFields` (Category suffix `wo_no_charge_category`, `originalHelper="creation"`).
  - The internal flag of the selected customer comes from the customer option row (`Customer.internal`) or the preselected option; a watch on `company_id` clears the No Charge draft when the customer is internal.
  - Submit (`:635`) sends `no_charge`, `no_charge_category_key` and the three flat original fields only when the block is rendered; otherwise `no_charge: false`, `no_charge_category_key: null`, `original_work_order_id: null`, `original_not_in_shopview: false`, `original_line_id: null`.
- `components/work-orders/ts/WorkOrderNavBarMenu.vue` (next to Add Work Order Fee / Discount, `:39-51`):
  - "Convert to No Charge" (`menu_item_convert_to_no_charge`): `isEnabled && classification === 'billable' && type === 'service' && !company.internal && !isWorkOrderStatusLocked(status_value) && canEdit('workOrders') && seeFinancialData()`; `:disable="hasWorkOrderDeposits(workOrder)"` + tooltip "Reverse the deposit first" (`tooltip_convert_to_no_charge_deposit`).
  - "Change category" (`menu_item_change_no_charge_category`) and "Convert to Billable" (`menu_item_convert_to_billable`): `classification === 'no_charge' && !isWorkOrderStatusLocked(...) && canEdit('workOrders') && seeFinancialData()`; **not** gated on `isEnabled` (S2-N1).
  - `shouldRenderAddAdjustmentAction` (`:168-174`) + `&& !isNonBillable(classification)` (S2-R15). `hasAnyMenuItems` (`:187-195`) includes the three new conditions, or the trigger is `v-if`-ed away.
- Dialogs in `src/components/ts/work-orders/dialogs/`, mounted from `WorkOrderNavBar.vue`, lazy:
  - `ConvertToNoChargeDialog.vue` (`BaseFormDialog`, suffix `convert_to_no_charge`, `:async-submit`): title "Convert work order [number] to No Charge?"; body verbatim S2-R5; `NoChargeCategoryFields` (suffix `convert_no_charge_category`); confirm "Convert to No Charge".
  - `ChangeNoChargeCategoryDialog.vue` (`BaseFormDialog`, suffix `change_no_charge_category`): title "Change category for work order [number]"; `NoChargeCategoryFields` seeded from `no_charge_category` + the four original fields; Save enabled once the category, the original work order or the original line differs (Q36 ✓); 409 `category_unchanged` → field message.
  - `ConvertToBillableDialog.vue` (`BaseDialog`, suffix `convert_to_billable`): title "Convert work order [number] to billable?"; body "Every line is priced as a new line would be today. You can convert it to no charge again until it is invoiced." — second sentence dropped while the setting is off (S2-N1); confirm "Convert to Billable".
  - `VendorBillCostMoveDialog.vue` (`BaseDialog`, suffix `vendor_bill_cost_move`): title "Change where the cost is posted?"; body (`text_vendor_bill_cost_move_body`) one bill "The vendor bill for [part] ($[amount]) was posted to [account]. If you continue, that cost moves to [account] when this work order is [invoiced / closed]." / several "The vendor bills for [n] parts ($[total]) were posted to [account]. …" (accounts from N8 `from.label` / `to.label`); amounts omitted when `null` (no See Financial Data); Cancel / "Continue". Shown only when `bills.length > 0 && integration !== null` (S2-R8).
  - All four: failure → "Could not change the work order. Try again." (must dismiss); dialog stays open. Convert / Change category / customer change run N8 first.
- `components/ts/work-orders/dialogs/ChangeWorkOrderCustomerDialog.vue`: under `copy.summary` / `copy.detail`, `text_change_customer_classification_effect` from the preview: to internal "Prices are removed; costs and hours are kept."; to billable "Lines are priced as a new line would be today."; staying non-billable `text_change_customer_shop_supplies_reset` "Shop supplies resets to [customer]'s minimum ($[amount])." (amount omitted without See Financial Data). Part sales show none of it. With a vendor bill, N8 first.
- `components/ts/shared/customer-info/CustomerCard.vue`: on a closed internal / no-charge WO the Change Customer button stays **rendered, disabled** with "Reopen the work order to change the customer." — `shouldShowChangeCustomerAction` (`:510`) hides it today for raw `invoiced`/`paid`, so the closed non-billable case becomes an exception that keeps it; billable invoiced WOs keep today's hidden control (D33). Test id `customer_card_change_action`.
- **System notes** (S2-R18, S12-R6): `components/ts/note/NoteCard.vue` gets `isClassificationNote` (`source === 'system'` and `metadata.type` ∈ `classification_changed` / `line_no_charge_changed`, same shape as `:750-761`) and renders the content through new `components/ts/note/classificationNoteLinks.ts`, which splits the content on each `metadata.work_order_refs[].number` and renders `router-link`s to `WorkOrder` (deleted refs as plain text), with the markup of `:278-294`. System notes are already read-only (the edit/delete menu is gated on `isUserSource`, `:160`); the author name ("ShopView") comes from the note.

**Permissions:** checkbox, Convert, Change category: `canEdit('workOrders') && seeFinancialData()` (S2-N2); the BE refuses with 403 (D57 / rule 1). Change Customer keeps `CustomerCard`'s gate.

**Vitest:** `components/work-orders/ts/tests/WorkOrderDialog.spec.ts` (new: internal tooltip variants from N20, re-run on asset change, checkbox hidden for internal / no See Financial Data / setting off / Edit mode, "Pick a category", original fields only for requiring categories, payload); `WorkOrderNavBarMenu.spec.ts` (visibility matrix setting × classification × permission × locked × part sale; deposit tooltip; Fee/Discount hidden; `hasAnyMenuItems`); `dialogs/tests/{ConvertToNoChargeDialog,ChangeNoChargeCategoryDialog,ConvertToBillableDialog,VendorBillCostMoveDialog,ChangeWorkOrderCustomerDialog}.spec.ts`; `CustomerCard` spec (disabled + tooltip on closed non-billable, hidden on billable invoiced); `components/ts/note/tests/classificationNoteLinks.spec.ts`; `NoteCard.spec.ts` (links, deleted ref, no menu).

**Browser-walk** (`admin`): New WO from the list toolbar, a customer, an asset "New" and a schedule cell, with a regular and an internal customer (tooltip names the asset's category, then the customer's); No Charge without a category (blocked); Warranty with and without an original; Convert → badge; Change category to Goodwill (original cleared); Convert back; customer change to the internal customer and back; Notes tab after each action. A role without See Financial Data: no checkbox, no actions.

#### FE-B3: Prices hidden, fixed price, locks and refusals (Story 2 S2-R4/R11/R15/R20/R22/N5, Story 10 field; depends on BE Phase 4)

The full surface list is §5. Script changes:
- `useLinePricingMode.ts`: `full` = billable + See Financial Data; `costOnly` = non-billable + See Financial Data; `none` = no See Financial Data.
- `work-order-lines/constants.ts`: `EXCLUDED_PRICING_COLUMNS` stays; `COST_ONLY_COLUMNS` (drops `labour_type` / `margin`, relabels the third column "Cost"); `partRowColspanAfterCaption(mode)` with `PART_ROW_FINANCIAL_CELL_COUNT` 3 / 1 / 0.
- **Fixed price (S2-R20, F8):** `LineDialog.vue` hides the four fixed fields and filters `fixed_line_total` / `fixed_labour_price` out of `laborTypeOptionsWithCurrentLaborType` when `mode === 'costOnly'` or the line is no-charge; the 422 `fixed_price_not_available` is the backstop. Same rule in `WorkOrderLines.vue:1371-1386` (inline save) and `dialogs/AddLabourDialog.vue` (Edit Labor).
- **Warranty (S2-R22, F9):** `is_warranty` leaves the write payloads of `LineDialog.vue:1563`, `AddLabourDialog.vue:134`, `WorkOrderLines.vue:1386` and `ShopCoachVehicleLineBuilder.vue:662` (D57); reads stay.
- `components/ts/shared/FinancialInfoCard.vue` `financialDataMapped` (`:260-324`): non-billable → only `['Shop Supplies', shop_supplies]`; no Fees & Discounts, Payments, Balance. `canEditCard` (`:369-400`) keeps See Financial Data + Invoicing & Payments — Create & Edit and the raw-status lock (closed = invoiced).
- `components/ts/billing/InvoiceActionBar.vue`: `button_new_deposit` hidden on non-billable (S2-N5); `button_send_to_portal` hidden on internal, and on no-charge once closed (S2-R11); `button_request_ibs_approval` hidden on non-billable; Customer PO not required (S3-R5); the discount/tax Settings button hidden on non-billable.
- `WorkOrderLineContextMenuList.vue`: line fee/discount entries hidden on non-billable (S2-R15).
- `app/src/components/work-orders/RequestCustomerApprovalDialog.vue` (Send to Portal): on a whole no-charge work order the per-line amounts are hidden and nothing priced is sent; a no-charge line's `cost` is 0 (it follows the masked `total_cost`); spec added (Appendix D).

**Vitest:** `WorkOrderLines` column selection per mode (extract `linesColumnsFor(mode)` + spec); `work-order-lines/tests/constants.spec.ts` (colspans per mode); `WorkOrderLineRow` / `WorkOrderLineParts` cells per mode; `components/ts/work-orders/tests/{PartDialog,LineDialog}.spec.ts` (sell/margin/rate/fixed hidden and not required in `costOnly`, Cost shown; pseudo options filtered; no `is_warranty` in any payload); `AddLabourDialog` spec; `FinancialInfoCard.spec.ts`; `InvoiceActionBar.spec.ts`; `Statistics` spec.

**Browser-walk:** an internal and a no-charge WO as `admin` (cost, no prices) and as a role without See Financial Data (hours only); a 390 px line card; a canned line and an inspection line added (no price shows); edit the Shop supplies amount; a core part (no price on the core row); a line that had a Fixed Line Total before Convert (Edit Line saves).

#### FE-B4: Lists, badges, filters, search, board, schedule, tabs (S2-R3, S2-R10, S2-R14; depends on BE Phase 4 list/board/search/schedule fields)

See §4 for every surface.
- `components/ts/work-orders/displays/composables/useWorkOrdersViewState.ts` (`:391-430`): `FilterDef { key: 'classification', label: 'Classification', type: 'single-select', options: All / Billable / Internal / No Charge, defaultValue: ['all'], required: true, visible: () => isEnabled.value }`. Status options (`:177-182`) gain `{ label: 'Closed', value: 'closed' }` when `hasFirstClose || isEnabled` (E-7).
- `displays/constants.ts` `SYNC_KEYS` + `'classification'`; `workOrdersFilters.ts` maps `classification !== 'all'` → `{ field: 'classification', value }` on every tab and the board. The Completed tab (`requestStatusFiltersFor`, `workOrdersFilters.ts:28-36`) already excludes closed rows (raw `invoiced`).
- `components/ts/customers/CustomerWorkOrderTab.vue` (`:301-316`, `:360-380`) and `components/ts/customers/VehicleWorkOrdersTab.vue` (`:493-508`, `:538`): the synthetic Closed option.
- A billable WO with no-charge lines is listed as billable: no badge, stored total (S12-R12).

**Vitest:** `workOrdersFilters.spec.ts`; `useWorkOrdersViewState` spec; `WorkOrderTableRow.spec.ts` (badge, "Closed", Total price "No Charge"); `WorkOrderCardMobile.spec.ts`; `BoardCardStatus.spec.ts`; `searchRowVariants.spec.ts`; `CustomerWorkOrderTab.spec.ts`, `VehicleWorkOrdersTab.spec.ts`; schedule `SidebarWorkOrderCard` / `ScheduleBlock` specs; `OrderStatusCard.spec.ts` / `OrderStatusCardMobile.spec.ts` (badge, orange modifier, `data-classification`).

**Browser-walk:** `/workorders` All / Estimates / Work Orders / Completed tabs, Tech View, Board, mobile list + filter sheet at 390 px; ⌘K search for an internal WO; schedule sidebar + grid block; customer and asset Work Orders tabs; Classification chip on each tab.

#### FE-C: Close and Reopen (Stories 3 and 4; depends on BE Phase 5: N9, N10, N11, detail `display_status` / `closed_on` / `can_reopen`, invoice `is_closed`)

**API** (`src/api/billing`): `fetchCloseWorkOrderPreview(id)` (N9, `handlesConflictLocally` for `work_order_not_closable`) typed `CloseWorkOrderPreview` (§3 row 22); `closeWorkOrder(workOrderId, { posting_date, fingerprint, complete_first, ...OriginalWorkOrderPayload })` (N10); `reopenWorkOrder(id)` (N11); `useCloseWorkOrderPreviewQuery(id, enabled)` (`staleTime: 0`, refetch on open); `useCloseWorkOrderMutation`, `useReopenWorkOrderMutation` invalidate `workOrderKeys.all` + invoice keys; the caller refetches the Vuex detail.

**Finish action** (`useWorkOrderFinishAction.ts`): `kind = isNonBillable(classification) ? 'close' : 'invoice'`; label "Close Work Order"; mobile icon `task_alt` with tooltip "Close Work Order"; ids `button_close_work_order_header`, `menu_item_close_work_order`, `button_close_work_order`, `button_bulk_close_work_order`; `canRun = canCreateInvoice()` (S3-N3).

**`components/ts/work-orders/WorkOrder.vue`** — `runCreateInvoice()` keeps its guards; `kind === 'close'` with wizard steps → open the wizard with `headingToClose: true`, then `openCloseDialog()`; without steps → `openCloseDialog()` directly (one press, S3-R1). Success → `showSuccessNotification({ message: 'Work order [number] is Closed · Internal.' | '… is Closed · No Charge.' })`, refetch, route to `finance`.

**`components/ts/work-orders/complete/CompletionWizard.vue`:** run flag `headingToClose`; `primaryCtaLabel` (`:1791-1799`) → "Close Work Order"; resolve-cores step hides `text_core_charge_<key>` amounts on non-billable (S2-E7); `title` (`:1812-1818`) has no "invoice" wording.

**New `components/ts/work-orders/dialogs/CloseWorkOrderDialog.vue`** (`BaseDialog`, suffix `close_work_order`, `size="md"`, `:async-confirm`, confirm "Close Work Order" / `button_confirm_close_work_order`, `:disable-confirm-button="isChanged \|\| isPreviewLoading \|\| originalMissing"`):
- Title "Close work order [number]?".
- **Original work order required (S3-R2):** when N9 `original_required_missing` is true, above the rows `NoChargeCategoryFields mode="originalOnly" originalRequired` with the label "Original work order *" and the warning "[Category] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView." (`banner_close_original_required`); Close stays disabled until a work order or Not in ShopView is picked. Never shown for categories that do not require it.
- `DateInput` "Posting date" (`input_close_work_order_posting_date`), default today, same mask and `formatDateLocalToUTC` as Invoice Date (`InvoiceActionBar.vue:42-53`, `components/ts/billing/Invoice.vue:1316`).
- Rows (`row_close_<key>`, `text_close_<key>_amount`, `text_close_<key>_note`): `stock_parts` "Stock parts $[amount]" + "Posted to [category's account]" (S3-R2), with the amount reading "$[amount], includes $[core amount] core cost" when N9 `stock_parts_core_cost` > 0 (D66; S2-E7, S3-R2 v1.0, Q65 ✓); with no parts at all, one row `parts_cost` "Parts cost $0.00" instead of the stock and special-order rows (S3-E1); `special_orders_<state>` "Special orders and sublet $[amount]" with "Already posted to [account] at the vendor bill" / "Moved from [account] to [account]" / "Posts to [account] when the vendor bill is entered" (hidden when none); `labor` "Labor [hours] h" + "Hours only, nothing posted"; `shop_supplies` (hidden at $0.00) "Shop supplies $[amount]" + "Posted to [category's account], credited to [shop supplies account]"; `parts_no_cost` "Parts with no cost" + names.
- Account names: QuickBooks `quickbooks.category_account_name` / shop supplies; hub `accounting_hub.category_account_label` / `shop_supplies_account_label` (D26). With both integrations each note names both.
- No account mapped (S3-N4), warning `InfoNotice tone="warning"`: QuickBooks `banner_close_no_account_quickbooks` "No account set for [category]. The entry posts to the ShopView Review account until you set one." + `link_close_set_account_quickbooks` "Set account" (only with `settingsIntegrations`); hub `banner_close_no_account_hub` "No account set for [category]. The entry is held in Accounting Events until you set one." + `link_close_account_mappings` (only with `accountingSettingsAccess`). Shop supplies row the same when the Shop supplies item is unmapped (S10-N2). QuickBooks without Inventory Asset or Cost of Parts: both parts rows carry "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped." (S7-N5, D35).
- `components/ts/shared/InfoNotice.vue` gains `tone?: 'info' \| 'warning'` (default `info`) and a default slot for the link.
- Summary `text_close_summary`: complete "This posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later."; not complete "This completes the work order, posts the parts cost and shop supplies to your books and marks it Closed · Internal. You can reopen it later."; no integration (S3-E4) "This marks the work order Closed · Internal. Parts cost, shop supplies and hours are available in the Internal Work Orders report." / "This completes the work order and marks it Closed · Internal. …". "Closed · No Charge" on a no-charge WO in every variant; no account notes without an integration.
- Money is integer cents (D27).
- `onConfirm`: POST N10 with the preview fingerprint, the picked original as the flat `OriginalWorkOrderPayload` and `complete_first: true` when the work order is not yet Complete (the server completes and closes in one transaction, D42, so a failed Close leaves it where it was; the wizard's earlier steps saved their data as today). With `headingToClose` the `CompletionWizard` skips its `simple-complete` call (`CompletionWizard.vue:2421`) and the Close path never calls `completeAndGoToInvoice` (`WorkOrder.vue:2832-2848`); with review required the Close button sends the work order to review as Create invoice does today. Vitest: `simple-complete` is never called on the Close path; (3) 409 `work_order_changed` → inline `error_close_work_order_changed` "This work order changed. Review and close again.", confirm disabled until reopened, throw to keep the dialog open; (4) 422 `original_work_order_required` / `invalid_original_work_order` → the original field's error; (5) other failure → "Could not close the work order. Try again." (must dismiss).
- Loading `loading_base_dialog_close_work_order`.

**Reopen:** `InvoiceActionBar.vue` WO menu (`:253-320`) on `invoice.is_closed` holds only `menu_item_reopen_work_order` "Reopen Work Order" (`canDelete('workOrders') && can_reopen`, S4-N1); no Reverse, no Issue Credit. New `components/ts/billing/ReopenWorkOrderDialog.vue` (`BaseDialog`, suffix `reopen_work_order`): title "Reopen work order [number]?"; body "The work order leaves Closed · Internal and goes back to Complete. The parts cost and shop supplies entries are reversed in your books." (No Charge variant); Cancel / "Reopen Work Order"; failure "Could not reopen the work order. Try again." (must dismiss); success → refetch, stay on Finance.

**Closed display:** `components/shared/OrderStatusCard.vue` / `components/ts/shared/OrderStatusCardMobile.vue`: label from the FE map on `displayStatusOf` (the BE label for every existing status; D29), `ClassificationBadge` (`badge_wo_classification`, mobile `badge_wo_classification_mobile`, `badge_wo_status_mobile`), root `q-card :class="{ 'order-status-card--non-billable': isNonBillable }" :data-classification`, note `text_wo_closed_on` "Closed on [posting date]. To change it, reopen it from the Finance tab." Finance tab of a closed record: Download / Print / Email unchanged; the Email recipient starts empty (S3-R5); no New Payment, Add Deposit, Issue Credit, Create invoice. The document is BE HTML (`components/ts/billing/InvoiceDisplay.vue`); the no-charge template keeps the Modern root marker (`LEGACY_SHEET_MARKER` sniffing, `:151-166`). Asset Invoices tab `components/ts/customers/VehicleInvoices.vue` (`:248-331`, `:530-656`): `#body-cell-status` "Closed" + `badge_vehicle_invoice_classification_<id>` (`cell_vehicle_invoice_status_<id>`), `#body-cell-total_balance` "No Charge" (`cell_vehicle_invoice_total_<id>`), Discount and Tax rate empty.

- **Credit hold (S3-N5).** For `kind === 'close'`, `useWorkOrderFinishAction` skips the credit-hold refusal on every surface: the gate's refusal (`components/ts/work-orders/useCreateInvoiceGate.ts:101`; message constant `:18-19`), the Finance toolbar's disable through the gate (`components/ts/billing/InvoiceActionBar.vue:600,631`) and its unscoped credit-hold tooltip (`:764`, scoped to Create invoice), and the handoff refusal (`components/ts/billing/Invoice.vue:2347`) — header, menu, Finance toolbar, bulk bar, wizard CTA; Create invoice on a billable work order keeps it. Credit hold is an FE-only guard today, so N10 needs no change. Vitest: a Credit Hold customer's internal or no-charge WO offers an enabled "Close Work Order" (header, `InvoiceActionBar` with no credit-hold tooltip on Close); a billable one still shows "Cannot invoice this customer. Customer is on Credit Hold".

**Vitest:** `dialogs/tests/CloseWorkOrderDialog.spec.ts` (every row/note variant from N9 fixtures; required-original state from `original_required_missing`, disabled until picked, Not in ShopView satisfies, never for non-requiring categories, body carries the flat original fields; category account names; S3-N4 per integration and link gating; S7-N5; summary × complete × integration × classification; 409 inline; failure toast; completes first; double press); `components/ts/billing/tests/ReopenWorkOrderDialog.spec.ts`; `useWorkOrderFinishAction.spec.ts` (close kind); `CompletionWizard.spec.ts`; `InvoiceActionBar.spec.ts`; `OrderStatusCard*.spec.ts`; `VehicleInvoices.spec.ts`; `components/ts/work-orders/tests/WorkOrder.spec.ts` (close branch with and without wizard steps); `InfoNotice` spec (tone default unchanged).

**Browser-walk** (`admin`): Close from header, menu (open lines, review off), bulk bar, Finance tab, wizard (unresolved core); every confirmation variant (QB disconnected → no-integration copy); a Warranty WO without original (picker in the dialog); edit a line in a second tab → inline "changed"; success alert, header note, document download, asset Invoices row; Reopen and close again; roles without Work Orders — Delete (no Reopen) and without Invoicing & Payments — Create & Edit (no Close); 390 px header icon.

#### FE-L1: A no-charge line on a billable work order — display (Story 12; reads BE Phase 4B line fields; can merge ahead)

- `LineNoChargeChip` "No Charge · [category]" (`chip_line_no_charge_<lineId>`) next to the line title, shown when `lineIsNoCharge(row, classification)` — never on a whole internal / no-charge WO (S2-R3, S12-N2) — and without See Financial Data too (S12-R12):
  - `components/ts/work-orders/work-order-lines/WorkOrderLineRow.vue` after `line_title` (`:109-116`): desktop and Tech View (same row; `woTechViewMode`, `:692`).
  - `components/ts/work-orders/work-order-lines/WorkOrderLineCard.vue` after `line_title` (`:88-90`): mobile.
  - An archived category keeps its name on the chip (S12-E4).
- Prices (mode `full`, F7): `WorkOrderLineRow.vue` Rate cell (`:208-213`) shows `$0.00` on a no-charge line, Margin (`:214-218`) blank, Total from data (`$0.00`). `WorkOrderLineParts.vue` part margin cells blank on a no-charge line (part sell prices arrive as 0, S2-R19). `WorkOrderLineCard.vue` Rate / Margin / Total block the same. Mode `none` hides prices as today.
- The WO carries no badge and no header style (S12-R4); Financial Info, totals and the Finance tab render server values unchanged.
- Print Work Order: `components/ts/work-orders/print/buildPrintModel.ts` maps `no_charge_category.name` onto `WorkOrderPrintLineGroup` (`print/Model.ts:31`); `print/WorkOrderPrintView.vue:71` prints "No Charge · [category]" beside the line name (`work_order_print_line_no_charge_<id>`) (S2-R22, S12-E8).
- Completion wizard: a core on a no-charge line shows its data-driven `$0.00` (S12-E3).

**Vitest:** `work-order-lines/tests/{WorkOrderLineRow,WorkOrderLineCard,WorkOrderLineParts}.spec.ts` (chip; `$0.00` rate with a non-zero `labour_rate`; blank margin; chip hidden on a non-billable WO; chip shown in `none` mode; billable rows unchanged); `print/tests/{buildPrintModel,WorkOrderPrintView}.spec.ts`.

**Browser-walk:** a billable WO with one no-charge line (fixture) on desktop, as a Tech View role, at 390 px; Print Work Order.

#### FE-L2: A no-charge line — actions (Story 12; depends on BE Phase 4B: N23–N26, line create/change `no_charge` block, invoice-create 409)

**API** (`src/api/work-orders`; every path under `/api/work-orders/{workOrderId}/lines/{lineId}/…`, D60)
- `fetchLineNoChargePreview(workOrderId, lineId)` (N23 `GET …/no-charge-preview`) → `{ line_price_cents; new_total_cents; deposit_total_cents; all_lines_no_charge: boolean }`; an imperative read (`staleTime: 0`) before Mark as No Charge from the line menu and from Edit Line.
- `markLineNoCharge(workOrderId, lineId, { no_charge_category_key, ...OriginalWorkOrderPayload })` (N24 `POST …/mark-no-charge`) → the refreshed line; `changeLineNoChargeCategory(workOrderId, lineId, body)` (N25 `POST …/change-no-charge-category`, same body); `markLineBillable(workOrderId, lineId)` (N26 `POST …/mark-billable`, body `{}`). The write responses carry no deposit or all-lines values (D60). Mutations invalidate `workOrderKeys.all`; the caller refetches lines + the Vuex detail.
- Line create / change payloads gain the optional `no_charge: ({ no_charge_category_key } & OriginalWorkOrderPayload) \| null` block (null = billable, absent = unchanged, D57).

**Line menu** (`components/work-orders/ts/WorkOrderLineContextMenuList.vue`)
- Root `v-if` (`:2-3`) also admits `canMarkNoCharge` (`canEdit('workOrders') && seeFinancialData()`), or a user with those atoms but no line-edit / note / move-labor atom sees no menu.
- After the Edit labor … Decline block, before the Delete separator (`:162`):
  - "Mark as No Charge" (`menu-item_mark_no_charge_<lineId>`): the line is not no-charge, `no_charge_blocked_reason === null` (D60; the reason covers a declined line, a return or credit on the line, an invoiced or non-billable WO and the setting off, S12-E8), and `canMarkNoCharge`. Hidden for any non-null reason except `invoiced` (below).
  - On a no-charge line: "Change category" (`menu-item_change_line_category_<lineId>`) and "Mark as Billable" (`menu-item_mark_billable_<lineId>`), offered while the setting is off too (Q37 ✓).
  - On an invoiced WO (`no_charge_blocked_reason === 'invoiced'` for Mark as No Charge) all three render disabled with the tooltip "Reverse the invoice first." in the disabled-wrapper pattern of `:153-160` (S12-N3); the wrapper keeps the test id on the item.
- New emits `onMarkNoCharge`, `onChangeLineCategory`, `onMarkBillable`, handled by `WorkOrderLines.vue`, which mounts the dialogs lazily.

**New dialogs** (`src/components/ts/work-orders/dialogs/`)
- `MarkLineNoChargeDialog.vue` (`BaseFormDialog`, suffix `mark_line_no_charge`, `mode: 'mark' \| 'change'`):
  - Mark: reads N23 on open; title "Mark this line as No Charge?"; line summary (title, hours, parts, technician, current price from N23 `line_price_cents`) `text_mark_no_charge_line_summary`; body verbatim S12-R2; `NoChargeCategoryFields` (`originalHelper="beforeInvoice"`, Category suffix `mark_line_no_charge_category`); confirm "Mark as No Charge".
  - Hint `text_mark_no_charge_all_lines` "All lines are No Charge. To close without an invoice and get the NO CHARGE document, convert the work order instead." when N23 `all_lines_no_charge` is true (S12-R10).
  - Change: same fields seeded from `no_charge_category` + the four original fields; Save enabled once the category, the original work order or the original line differs (S12-R5); 409 `category_unchanged` → field message.
  - When the N23 preview shows `deposit_total_cents` above `new_total_cents`, a successful mark leaves the dialog open in an info state (the values come from the preview, not from the N24 response, D60): "Deposit $[deposit] exceeds the new total $[total]. The difference stays on the customer's account as a deposit when the invoice is created." (`text_mark_no_charge_deposit_exceeds`, Q49 ✓) with one "OK" (`button_mark_no_charge_ok`) bound to `closeDialog`.
  - Before Mark / Change, when N8 for the line (`moment=invoiced`, `line_id`) returns bills and an integration exists, `VendorBillCostMoveDialog` runs first with "when this work order is invoiced" (S2-R8 v1.0 per line, Q62 ✓).
  - Failure → "Could not change the line. Try again." (must dismiss); the dialog stays open and the line is unchanged.
- `MarkLineBillableDialog.vue` (`BaseDialog`, suffix `mark_line_billable`): title "Mark line as billable?"; body "The line is priced as a new line would be today. You can mark it No Charge again until the work order is invoiced."; Cancel / "Mark as Billable"; same cost-move pre-step and failure toast.

**Edit Line / New Line** (`components/ts/work-orders/LineDialog.vue`, mounted only from `WorkOrderLines.vue:649`)
- After "Parts authorized" (`:296-303`): `q-separator`, `q-checkbox "No Charge"` (`checkbox_line_no_charge`), helper `text_line_no_charge_helper` "This line shows $0.00 on the invoice. Hours and parts stay; the parts cost posts to the category's expense account.", then `NoChargeCategoryFields` when ticked (Category suffix `line_no_charge_category`).
- Shown when the WO is billable and not invoiced, the setting is on, the user has `canEdit('workOrders') && seeFinancialData()`, and the line is not declined; never on an internal / no-charge WO (S12-N2) or while the setting is off (S12-N1).
- Ticking hides the fixed-price fields (FE-B3). The `no_charge` block is sent only when the checkbox or its fields changed (D57). When the `no_charge` block changes on an existing line that has a posted vendor bill (ticked, unticked, or its category changed) and the location has an integration, Edit Line first calls N8 (`moment=invoiced`, `line_id`, the new target and category) and shows `VendorBillCostMoveDialog` before saving, as the line menu does (S2-R8 v1.0; S12-R1: both doors write the same fields). When the checkbox is newly ticked on an existing line, Edit Line reads N23 before saving; when the preview shows the deposit above the new total, the same sentence shows as a must-dismiss info notification after the save (the line-change response does not carry it, D60). New Line needs no preview: the new line adds $0.00.

**S12-R9 Create invoice refusal**
- `WorkOrder.vue runCreateInvoice()` (`:2455-2515`), after the contact refusal and before any completion: find the first line with `lineIsNoCharge && no_charge_category.requires_original_work_order && original_work_order === null && !original_not_in_shopview`; show "Line '[title]' needs its original work order (or Not in ShopView) before the invoice." (5 s, like the other refusals in that function) and open Edit Line on it through `lineDialogs.openLine(payload)` (the bridge at `:2031`).
- Backstop: `components/ts/billing/Invoice.vue createInvoice()` handles 409 `no_charge_line_original_required` (`{ line_id, line_title }`) with the same message.
- A work order whose lines are all No Charge invoices at $0.00 through today's path (S12-R10).

**Issue Credit** (S12-E7, Q35 ✓): `components/ts/credits/PartsReturnPicker.vue` lists parts of a no-charge line at $0.00 with "No Charge · [category]" under the name (from `noChargeCategoryName`, `text_parts_return_no_charge_<workOrderPartId>`) and the restocking fee disabled (`:101-110`); the credit amount is 0.

**Vitest:** `components/work-orders/ts/tests/WorkOrderLineContextMenuList.spec.ts` (matrix: setting × WO classification × permissions × each `no_charge_blocked_reason` × invoiced tooltip; root `v-if`); `dialogs/tests/{MarkLineNoChargeDialog,MarkLineBillableDialog}.spec.ts` (copy, all-lines hint and deposit info state from the N23 preview, change-mode Save rule, cost-move pre-step, failure toast, re-entrancy); `components/ts/work-orders/tests/LineDialog.spec.ts` (gates, block only on change, fixed fields hidden when ticked, N23 read before a newly ticked block is saved, the cost-move dialog before saving a changed block on a line with a posted bill); `WorkOrder.spec.ts` (`runCreateInvoice` refusal names the line and opens Edit Line, no completion runs); `Invoice` 409 backstop; `components/ts/credits/tests/PartsReturnPicker.spec.ts`.

**Browser-walk** (`admin`): mark, change category, mark billable on a billable WO; a Warranty line without original → Create invoice from header, bulk bar and Finance tab (refused, Edit Line opens); deposit larger than the remaining total; all lines no-charge hint; the New Line door; Issue Credit on an invoiced WO with a no-charge line; a role without See Financial Data (no items, chip visible).

#### FE-D: QuickBooks Close notes and QB Unexported (Story 7; depends on BE Phase 6)

The QuickBooks page rows moved to FE-K2 (D61).

- `CloseWorkOrderDialog` QuickBooks notes consume N9 (FE-C); verified here against a connected company.
- **Create invoice confirmation for cost moves (S7-R8 v1.0, Q62 ✓).** `WorkOrder.vue runCreateInvoice()` (`:2455-2515`, the one choke point every Create invoice surface uses): when the location has an accounting integration, call N8 with `moment=invoiced` (no `line_id`, no `target`) before creating; if it returns bills, show `VendorBillCostMoveDialog` in its invoice variant, title "Create invoice [number]?", one row per `moves[]` entry "Moved from [account] to [account]" with its amount (hidden without 'See Financial Data'), buttons Cancel / Create invoice. With no bills or no integration nothing is shown and Create invoice runs as today (the general confirmation removed in SV-10312 stays removed). Vitest: shown only with bills and an integration; two moves in opposite directions render two rows; Cancel creates nothing.
- QB Unexported (`components/ts/reporting/unexported-items/UnexportedItemsTable.vue`): the BE supplies type label, reference and subject (classification and category); the No. column renders `referenceId` (`:129`). A withdrawn row shows its reason from `withdrawn_reason` ("Withdrawn: work order reopened", "Withdrawn: invoice [number] reversed" or "Withdrawn: category changed") with no Export / Mark as Exported (D38). No new interactions.

**Vitest:** `UnexportedItemsTable` spec (withdrawn row, one per `withdrawn_reason`).

**Browser-walk:** close a work order on a QB-connected location as `admin` (the Close dialog's QuickBooks notes against the live mapping); QB Unexported with a failed and a withdrawn entry (QA org).

#### FE-M: Cost-only notices on receive and vendor invoice (S2-R19; depends on BE Phase 4 `sellPriceSuppressed`)

- `components/ts/parts/receive/MultiVendorReceiveModel.ts`: `resolveSellPreview` (`:166+`, the mirror of `SpecialPartsGetsReceived::resolveCostAndSellPrice()`) returns `STORED_SELL` when `sellPriceSuppressed` is set, so the Sell column never previews a price the receive will not write. New `costNoticeFor(row)`: `COST_MARGIN_NOTICE` (`:114-115`) for billable rows; "Internal work order: cost only, no sell price" (`internal`); "No Charge work order: cost only, no sell price" (`no_charge`, Q51 ✓); "No Charge line: cost only" (`no_charge_line`).
- `components/ts/work-orders/receive/ReceivePartsModal.vue:18-24`, `components/ts/parts/receive/PurchaseOrderReceive.vue:108-115`, `components/ts/parts/receive/MultiVendorReceive.vue:69`: the sticky notice shows `costNoticeFor` of the **last edited row** (a purchase order can mix billable, internal and no-charge rows).
- `components/ts/parts/vendor-invoices/DeliveryItemEditDialog.vue` (cost input `:62-67`): an `InfoNotice` with the same cost-only text under the Cost field for an item on internal / no-charge work or a no-charge line (`InfoNotice` suffix `delivery_item_cost_only`, Q48 ✓); billable items show nothing new.

**Vitest:** `parts/receive/tests/{MultiVendorReceiveModel,MultiVendorReceive,PurchaseOrderReceive}.spec.ts`, `ReceivePartsModal` spec, `DeliveryItemEditDialog` spec.

**Browser-walk:** receive a special order on an internal WO, on a no-charge line and on a billable WO from one purchase order (notice follows the row; Sell column shows no derived price on the first two); edit a vendor invoice cost for an internal WO item.

#### FE-E: AccountingHub port (Stories 6 and 8; depends on the hub release serving `category_accounts`, the Closed record and the No Charge lines block, and on core emission)

None of this is visible until the hub answers with the new members, and, like every other surface of the feature, only where the release gate is open: the Account Mappings category rows, the Closed pill and filter on Sales ▸ Invoices and the Closed record page all read `internalWorkOrdersAvailable` (D64). Checked in this repo only; the hub side is `shopview-accounting` (Appendix C). Report which side was checked.

- **Account Mappings** (S6-R1, D53): `components/ts/accounting/settings/AccountingSystemAccounts.vue` + `Model.ts`.
  - The static `ACCOUNTING_SYSTEM_ACCOUNT_FIELDS` / `ACCOUNTING_SYSTEM_ACCOUNT_KEYS` (`Model.ts:72-252`) do not change.
  - New `components/ts/accounting/settings/categoryMappingRows.ts` builds rows from the hub's `category_accounts` bag in the server's order, labeled "Internal: [name]" / "No Charge: [name]", archived rows greyed and editable (Q40 ✓), spliced directly after the `cogs_parts` row.
  - A separate category draft keyed by `category_key` + `kind` drives dirty state and save; save sends `category_mappings: [{ category_key, kind, account_id \| null }]` beside `mappings` (only changed rows of each). For category rows `null` clears the account and keeps the row — the opposite of system keys — so an emptied category row is saved, not deleted. 422 `category_mappings.N.*` errors land on the row.
  - Test ids `text_current_category_account_<key>`, `select_category_account_<key>`, `error_category_account_<key>`.
  - Merge only after the hub accepts `category_mappings` in that environment (an unknown member 422s every save).
- **Accounting Events** (S8-N2):
  - `components/ts/accounting/reports/eventLogView.ts`: status `held` → scoped `event_held` (`components/ts/accounting/shared/Model.ts` new entry `{ label: 'Held', color: 'amber-3', textColor: 'amber-10' }`); a reason column (`hold_message` verbatim, `text_hold_message_<id>`) shown when the page holds a Held row; event label "Work order closed · [number] · [classification]" from `work_order`; Dismissed rows show `dismissal_reason` verbatim ("Withdrawn: work order reopened", or the invoice-reversal and vendor-bill variants, D70); no Retry on Dismissed (`can_retry`).
  - `components/ts/accounting/reports/AccountingEventDetail.vue`: `hold_message` + `held_at`; Retry keys on `can_retry` (`:14-18`); a Retry that answers Held again shows the new message.
  - `src/api/accounting/**` event type: `hold_reason?`, `hold_message?`, `held_at?`, `work_order?: { number: string; classification: Classification } \| null`, `source_document?: AccountingSourceDocument \| null`, `source_line?: { position: number; description: string } \| null` (D70).
  - A deferred move (S8-R3 v1.0, HQ8 ✓, D70): when the event carries `source_document` (kind `vendor_bill` or `vendor_credit`), `buildAccountingEventRows` labels the row "Cost move to [Category] · Vendor bill [number], line [n]" (or "Vendor credit …") and `buildAccountingEventResultFields` adds a "Source document" field with `to: accountingSourceDocumentRoute(event.source_document)` and the line's description, the same shared helper `ledger/journalEntryView.ts:212` uses (`components/ts/accounting/shared/sourceDocument.ts`, so no cross-area import). Its Held and Dismissed states render like any work-order entry's.
- **Invoices** (S8-R1, S8-R6, S8-R7):
  - `src/api/accounting/sales/Model.ts`: `AccountingInvoiceStatus` (`:122`) + `'closed'`; invoice + `classification?`, `work_order_number?`, `asset?: { shopview_id; display } \| null`, `category?: { category_key; list; name } \| null`, `original_work_order?: { shopview_id \| null; number \| null; not_in_shopview: boolean } \| null`, `original_line?`, `original_technicians?: { shopview_staff_id \| null; name }[]`, `no_charge_line_count?`; detail + `is_closed?`, `closed_summary?: { posted_parts_cost; posted_shop_supplies; journal_entry_ids }`, `no_charge_lines?: AccountingInvoiceNoChargeLine[]` (`work_order_line_id`, `line_number`, `title`, `category`, `original`, `hours`, `parts_cost` decimal strings, `expense_accounts: { id; number; name }[]`, `posting_status: 'posted' \| 'held' \| 'withdrawn' \| 'pending'`, `hold_message`).
  - `components/ts/accounting/sales/Model.ts`: Status filter option "Closed" (default All).
  - `components/ts/accounting/sales/invoiceView.ts` (`:199-237`): a `badge` slot on the `status` cell kind (`{ kind: 'status', status, badge?: { label, tone } }`), `badge_accounting_invoice_classification_<id>` ("Internal" / "No Charge"); `total` cell "No Charge" when `status === 'closed'`; the closed pill reuses `ACCOUNTING_STATUS_META.closed` (`shared/Model.ts:97`).
  - `components/ts/accounting/sales/AccountingInvoiceDetail.vue`: Closed record (D39) = header with the ShopView link, summary (number, customer, asset, classification, category, original work order when set, posting date, "No Charge", posted Parts cost and Shop supplies from `closed_summary`) and the journal entry section; no lines, no payment / credit memo / write-off tabs, no Void. Billable record with `no_charge_lines`: new `AccountingInvoiceNoChargeLines.vue` section after Lines (`:157-194`), `table_accounting_invoice_no_charge_lines`, columns Line (number and title), Category, Original work order (and line), Original technician, Hours, Parts cost, Expense account, and a Held / Withdrawn state with `hold_message` when not posted (Q30 ✓).
  - Reports > Invoice List: `components/ts/accounting/reports/reportParams.ts:618` option "Closed", **not** in the default selection (S8-R6); `reportView.ts:1372` `INVOICE_STATUS_LABELS.closed = 'Closed'`.
- **JE source labels**: `components/ts/accounting/ledger/journalEntryView.ts:93`, `ledger/register/registerGridView.ts:96`, `reports/reportView.ts:614`, `banking/bankingView.ts:437`: `internal_work_order` "Internal work order", `no_charge_work_order` "No-charge work order" (S8-R2), `no_charge_line` "No Charge line" (Q50 ✓); register short codes `IWO`, `NCWO`, `NCL`.

**Vitest:** `accounting/settings/tests/AccountingSystemAccounts.spec.ts` (category rows after `cogs_parts`, labels, archived editable, dirty and save through `category_mappings`, null keeps the row, static rows unchanged), `categoryMappingRows.spec.ts`; `accounting/reports/tests/AccountingEventLog.spec.ts` (Held tone, reason column, work-order label, Dismissed without Retry, a deferred move's label and source-document link), `AccountingEventDetail` spec; `accounting/sales/tests/{AccountingInvoices,AccountingInvoiceDetail,invoiceView}.spec.ts` (Closed summary, No Charge lines block incl. Held state); `reportParams` / `reportView` specs (Closed unselected by default); JE label specs.

**Browser-walk:** `make dev-full` joint stack (`docs/local-dev-joint-stack.md`), `admin` with accounting permissions: Account Mappings shows the four starting rows mapped; add a category in core → its empty row appears; close a WO on it → Accounting Events Held "[Category] row not mapped" → map → auto-retry; Sales > Invoices Closed row and record page; a billable invoice with one no-charge line → No Charge lines block; Invoice List filter. Report which side was checked (root AGENTS.md accounting rule).

#### FE-F: Reports, dashboard, exports (Story 9; depends on BE Phase 10: N12)

- **Internal Work Orders report** (new, `src/components/ts/reporting/internal-work-orders/`: `InternalWorkOrdersReport.vue`, `InternalWorkOrdersByLineTable.vue`, `InternalWorkOrdersByTechnicianTable.vue`, `InternalWorkOrdersSummaryStrip.vue`, `Model.ts`, `tests/`):
  - API `src/api/reporting/index.ts`: `fetchInternalWorkOrdersReport({ tab: 'by_line' \| 'by_technician', ...filters })` (N12 `GET /api/reporting/reports/internal-work-orders`, one endpoint for both tabs; response `data.collection`, `data.pagination` (by_line only), `data.totals`, and `data.summary` on by_line), `exportInternalWorkOrdersReport(params)` (N12 `…/internal-work-orders/export`, blob; `format=csv&tab=<open tab>` returns one CSV of the open tab (S9-R2 v0.22), `format=pdf` one PDF with both tabs as sections, Q34 ✓); `keys.ts`, `queries.ts` via `useReportTableQuery`; types in `ReportingModel.ts` (§3 rows 40–42). Add the export path to `silentFailEndpoints` `TOASTS_ONLY` (`src/boot/axios.ts:231`).
  - Filters (`FilterBar`): `range` (`preset-date-range`, `PRESET_DATE_RANGE_OPTIONS_WITH_LAST_12_MONTHS`, default this month, `maxRangeDays: 366`, posting or invoice date); `location_id` single with "All locations" (D45, accessible locations only, S9-R16); `classification` single (All / Internal / No Charge / No Charge line); `category_key` single from N14 `include_archived=1` with an "Archived" heading (F15); `original_technician_id` single (All, technicians, "Unassigned" = `unassigned`).
  - Summary strip above the tabs (`row_iwo_summary`, one `card_iwo_summary_<categoryKey>` per category in range: parts cost, "[n] work orders, [m] lines", hours), from `data.summary` (`[{ category, parts_cost, work_order_count, line_count, hours }]`).
  - Tabs "By work order and line" / "By technician" (`tab_iwo_by_line`, `tab_iwo_by_technician`; q-tabs pattern of `components/ts/reporting/technician-efficiency/TechnicianEfficiency.vue:56-101`).
  - By work order and line columns: Work order (link to `WorkOrder`), Line ("Whole work order" or number + title), Customer, Classification, Category, Original work order (link with line number; plain text when deleted, S12-E5), Original technician, Closed / invoiced, Parts cost, Shop supplies (empty on a line), Hours; rows keyed on `row_type` (`work_order` \| `line`); totals row `row_iwo_totals` over the range from `data.totals`; newest first.
  - By technician columns: Original technician ("Unassigned" for `technician === null`), Completed lines, Comeback lines, Warranty lines, Comeback rate, Redo hours, Redo parts cost; totals row; note under the table `text_iwo_by_technician_note`: "A line with several technicians counts once for each of them; the totals row counts every line once."
  - Parts cost, Shop supplies, Redo parts cost and the strip's money are omitted without `seeFinancialData()` (columns and export keys; pattern `components/ts/customers/VehicleWorkOrdersTab.vue:392`).
  - Empty state `FilteredTableEmptyState` (`text_iwo_empty`), also on a direct link before the report is listed (no route guard).
  - Export `SubActionsDropDown` suffix `iwo_export` with `iwo_export_csv` and `iwo_export_pdf`.
  - Registration: route `internal-work-orders` name `InternalWorkOrdersReport` under `reports` (`src/router/routes.ts`); `src/pages/Reporting.vue` async import (`:145-147` pattern), `componentMap` (`:224-234`), `components[]` (`:310`), `routeNameToTabName` (`:384-394`); nav `q-route-tab data-test-id="report_nav_internal_work_orders"` in the Performance group directly after Sales By Representative (`components/ts/reporting/ReportLeftMenuNav.vue:156-160`, D32), `v-if="hasFirstClose"` (S9-R4; the first invoice carrying a no-charge line counts too, Q31 ✓).
- **Technician Efficiency chip** (`technician-efficiency/TechnicianEfficiency.vue:154-228`): `SYNC_KEYS` + `'internal_work_orders'`; `DEFAULT_FILTERS` + `internal_work_orders: ['all']`; `FilterDef { key: 'internal_work_orders', label: 'Internal work orders', type: 'single-select', required: true, defaultValue: ['all'], options: Hide / Only internal / Show all (`hide` / `only` / `all`), tooltip: 'Internal and no-charge work orders', visible: () => hasFirstClose.value }`, passed to both tabs as the `internal_work_orders` param (`src/api/reporting/index.ts:100,109,120,131,399`). `FilterDef` gains optional `tooltip` (`components/ts/shared/filters/Model.ts:78`) rendered by `FilterChip.vue`.
- **Export option** (`components/ts/reporting/ExportReportsDialog.vue:29-68`, `:182-237`): `q-checkbox v-model="dataExport.includeNonBillable" label="Include internal and no-charge work orders" data-test-id="checkbox_include_non_billable"` + helper `text_include_non_billable_helper` "For your records only. Do not import these rows as invoices.", `v-if="dataExport.report === 'customer_invoice' && hasFirstClose"`; `include_non_billable: 1` only when ticked (off → byte-identical request). The Classification / Category columns and the $0.00 no-charge-line rows are BE. Touch-it-add-it: `DateRangePicker` suffixes.
- **WIP** (`work-in-progress/WorkInProgressReport.vue` + `Model.ts`): `badge_wip_classification_<key>` next to the WO number; value cells "—" on non-billable rows (S9-R9).
- **Dashboard:** no FE change (BE-side numbers; regression check only).

**Vitest:** report specs (filters → params, archived heading, summary strip, totals from the server, financial columns hidden, both tabs, Unassigned, empty state, export params per format); `components/ts/shared/filters/tests/FilterSingleSelectPanel.spec.ts` (headings render; lists without groups unchanged); `TechnicianEfficiency.spec.ts` (chip hidden before the marker, label/options/tooltip, param on both tabs); `ExportReportsDialog.spec.ts`; `ReportLeftMenuNav.spec.ts`; WIP spec; `FilterChip` spec (tooltip).

**Browser-walk:** Reports as `admin` before and after the first close; each filter including a category archived after use; By technician with a shared line; CSV (the open tab) and PDF (both tabs) export; Technician Efficiency both tabs with each chip value; Export Reports → Customer Invoice with the option; WIP with an open internal WO; Dashboard numbers unchanged for a billable-only org.

#### FE-G: Shop supplies on flagged customers (Story 10; depends on BE Phase 3)

- `components/ts/customers/CustomerDialog.vue:157-203`: Min `:disable="company.shop_supplies_charge === null && !(isEnabled && company.internal)"` (no tooltip in that case); `onShopSuppliesChange` (`:714`) does not null Min on a flagged customer while the setting is on (S10-R1). Max keeps today's gate. Min and Max show only with 'See A/P & A/R data', as today.
- A no-charge WO takes the customer's Min if set, else $0.00, editable on the WO (BE).
- **Vitest:** `CustomerDialog.spec.ts` (extend). **Browser-walk:** Edit Customer on a flagged customer: Min without %; save; create a WO → Shop supplies = Min.

---

### 3. Contract (every endpoint and field the FE consumes)

Legend: ✅ agreed in the backend / hub plans · ⚠️ FE requirement the backend plan must add or change. Paths, field names, error codes and endpoint numbers (N1–N26) are Appendix A §4's, which is canonical (D60): categories travel as `category_key` and come back as `{ key, name, archived }`; originals travel as the flat `OriginalWorkOrderPayload` `{ original_work_order_id, original_not_in_shopview, original_line_id }`. Casing per endpoint (F1, D22). Money: integer cents on core endpoints unless the column says dollars; decimal strings on the hub API. Every write answers 403 without its atom (Key Decisions rule 1).

| # | Endpoint | FE reads / sends | Verdict |
|---|---|---|---|
| 1 | N13 `GET /api/internal-work-orders/categories?list=internal\|no_charge&archived=0\|1` (`WorkOrderCategorySettingsVoter::VIEW`) | `{ data: { categories: [{ key, list, name, is_default, requires_original_work_order, archived, internal_customers_count, work_orders_count, quickbooks_accounts: [{ workplace_id, workplace_name, account_id, account_name, account_state }], accounting_hub_account_label }], meta: { archived_count } } }`; unpaginated | ✅ (D60). `account_state` ∈ `active \| inactive \| missing`; `quickbooks_accounts` = connected locations the user can access (Q41 ✓) |
| 2 | N15 `POST /api/internal-work-orders/categories` | `{ list, name, is_default?, requires_original_work_order?, quickbooks_accounts?: [{ workplace_id, account_id \| null }] }` → 201 `{ key }`; 422 `name_taken` (incl. archived names, Q39 ✓), `name_too_long`, `category_limit_reached`, `invalid_workplace_ids`; 403 when `quickbooks_accounts` is sent without Settings — Integrations | ✅ (D60) |
| 3 | N16 `PUT /api/internal-work-orders/categories/{categoryKey}` | same fields, all optional; 422 `name_taken`; 409 `category_archived` for fields other than the accounts (accounts stay editable on archived categories, Q40 ✓); 404 for another organization's key | ✅ (D60) |
| 4 | N17 `GET /api/internal-work-orders/categories/{categoryKey}/archive-impact` | `{ customer_count, asset_count, next_in_line_name }` (S1-R16) | ✅ (D60) |
| 5 | N18 `POST /api/internal-work-orders/categories/{categoryKey}/archive`, `…/{categoryKey}/restore` | the category row; 409 `default_category_cannot_be_archived`; restore → 422 `category_limit_reached` at 100 active (S1-R13 v1.0) | ✅ (D60) |
| 6 | N14 `GET /api/internal-work-orders/categories/options?list=&include_archived=0\|1` | `{ data: { options: [{ key, name, requires_original_work_order, archived, is_default }] } }`, active first; `include_archived=1` only for the report filter | ✅ (D60; `is_default` lets Edit Customer preselect the default Internal category, S1-R7) |
| 7 | N19 `GET /api/internal-work-orders/quickbooks-accounts?workplace_id=` | `{ data: { accounts: [{ id, name, number, type, active }] } }` for one accessible, connected location (422 otherwise), expense-type accounts only (D46), loaded when its picker opens (E-13) | ✅ (D60; Q52 ✓) |
| 8 | Category key format | `key` matches `^[a-z][a-z0-9_]*$`; starting keys `general_internal`, `warranty`, `goodwill`, `comeback` (D50) | ✅ |
| 9 | `GET organizations/settings` (camel) | `internalWorkOrders`, `internalWorkOrdersFirstEnabledAt`, `internalWorkOrdersFirstClosedAt`, `internalWorkOrdersAvailable`, `hasInternalCustomers`, `quickbooksConnectedAnyLocation`, `accountingHubEnabled` (D56, D43, D25) | ✅. `internalWorkOrdersFirstClosedAt` is also set by the first invoice carrying a no-charge line (Q31 ✓) |
| 10 | `POST organizations/settings/change` (camel) | body `internalWorkOrders`; 409 `internal_work_orders_first_enable_required`, `internal_work_orders_not_available`; refuses only false→true (D30) | ✅ |
| 11 | N1 `POST organizations/settings/internal-work-orders/enable` (snake) | `{ internal_customer_ids }` → `{ internal_work_orders, first_enable, flagged_customer_ids }` | ✅ |
| 12 | N2 / N3 / N4 Make internal | N2 `customers/{id}/make-internal-candidates` (rows incl. `location_name`, `inaccessible_count`, `can_make_internal`), N3 `customers/internal/make-internal-candidates`, N4 `work-orders/make-internal` `{ company_id, all_open: true, exclude_ids }` → `{ changed, skipped, failed, remaining }` | ✅ (D12, D24, D36) |
| 13 | `POST /api/customers/change`; customer view + `GET /api/customers` rows | `internal` (409 `internal_work_orders_off` when it differs while the setting is off), `default_internal_category_key` (update only; 422 `invalid_category`); reads `internal`, `default_internal_category { key, name, archived } \| null`, and on the customer view `open_internal_work_orders_count` | ✅ (D60) |
| 14 | `POST /api/vehicles/change`; vehicle view | `internal_category_key` (409 `asset_not_internal`, `internal_work_orders_off`; 422 `invalid_category`); reads `internal_category { key, name, archived } \| null`, `internal_category_applicable: boolean` (an owner in `vehicle_company` is flagged), `customer_default_internal_category { key, name, archived } \| null` (helper text) | ✅ (D60) |
| 15 | `POST /api/work-orders/create` (snake) | `no_charge`, `no_charge_category_key`, `original_work_order_id`, `original_not_in_shopview`, `original_line_id`; 400 field `no_charge_category_key` "Pick a category"; 403 without `ROLE_PRICING_VIEW` when `no_charge`; 422 `category_archived`; ignored for a flagged customer or with the setting off | ✅ (D60) |
| 16 | N20 `GET /api/work-orders/internal-category-preview?company_id=&vehicle_id=` | `{ internal, category: { key, name } \| null, source: 'asset' \| 'customer' \| 'organization_default' \| null }` (S2-R1 tooltip; E-14) | ✅ (D60) |
| 17 | N21 `GET /api/work-orders/original-candidates?company_id=&vehicle_id=&search=&exclude_work_order_id=&limit=` | ≤ 25 rows `{ id, number, display_number, date, first_line_title, same_asset }`, same asset first, then newest; search on the number; accessible locations only (Q38 ✓) | ✅ (D60; `exclude_work_order_id` for Convert / Change category / Close on the WO itself) |
| 18 | N22 `GET /api/work-orders/{workOrderId}/original-line-candidates` | ≤ 200 lines `{ line_id, number, title, technicians: [{ staff_id, name }] }` + `work_order_technicians: [{ staff_id, name }]` (D55, Q42 ✓) | ✅ (D60) |
| 19 | WO detail `GET /api/work-orders/view/{workOrderId}` (snake) | `classification`, `display_status`, `closed_on`, `can_reopen`, `shop_supplies_amount`, `internal_category { key, name, archived } \| null`, `no_charge_category { key, name, archived } \| null`, `original_work_order { id, number, is_deleted } \| null`, `original_not_in_shopview`, `original_line { id, number, title } \| null`, `original_technicians [{ staff_id, name }]`; lines as row 20; raw `status_value` stays `invoiced` for closed (D2) | ✅ (D60) |
| 20 | Lines `GET /api/work-orders/lines/{workOrderId}` (snake) | per line `no_charge: boolean`, `no_charge_category { key, name, archived, requires_original_work_order } \| null`, the four original fields, `no_charge_blocked_reason` (`declined \| return_or_credit \| invoiced \| not_billable \| setting_off \| null`), derived `is_warranty` | ✅ (D60: the block is on the lines endpoint; `requires_original_work_order` feeds the S12-R9 pre-check; the menu hides Mark as No Charge while `no_charge_blocked_reason` is not null, S12-E8) |
| 21 | N5 `POST /api/work-orders/{workOrderId}/convert-to-no-charge` / N6 `…/convert-to-billable` / N7 `…/change-category` | N5, N7 `{ no_charge_category_key } & OriginalWorkOrderPayload` (missing key → 400 "Pick a category") → `{ work_order_id, classification, no_charge_category, shop_supplies_amount }`; N6 `{}` → `{ work_order_id, classification: 'billable' }`; 409 `classification_locked`, `deposit_exists`, `customer_is_internal`, `not_billable`, `internal_work_orders_off`, `part_sale_not_supported`, `not_no_charge`, `category_unchanged` (only when neither category nor original differs, Q36 ✓); 422 `category_archived`, `invalid_category`, `invalid_original_work_order` | ✅ (D60) |
| 22 | N9 `GET /api/work-orders/{workOrderId}/close-preview` | `classification`, `category { key, name, archived }`, `original_required_missing`, `is_complete`, `posting_date_default`, rows (`stock_parts_cost`, `stock_parts_core_cost` (D66), `special_orders [{ state, amount, from_label }]`, `labor_hours`, `shop_supplies_amount`, `parts_with_no_cost [{ part_request_id, name }]`), `fingerprint`, `quickbooks { inventory_accounts_mapped, category_account_name, uses_review_account, shop_supplies_account_name, shop_supplies_uses_review_account } \| null` (null when not connected at the location), `accounting_hub { category_row_mapped, category_account_label, shop_supplies_row_mapped, shop_supplies_account_label } \| null` (null when the hub is not enabled or the read fails, D26), money in cents (D27); 409 `work_order_not_closable` | ✅ (D60) |
| 23 | N10 `POST /api/work-orders/{workOrderId}/close` | `{ posting_date, fingerprint, complete_first } & OriginalWorkOrderPayload` (409 `work_order_review_required`, 403 without 'Work Orders — Create & Edit' when `complete_first`) → 201 `{ invoice_id, work_order_id, classification, display_status, closed_on }`; 409 `work_order_changed`, `work_order_not_closable`, `invoice_already_exists`, `work_order_not_complete`, `incomplete_lines` / `blocking_parts` / `unresolved_cores`; 422 `original_work_order_required`, `invalid_original_work_order` | ✅ (D23, D60) |
| 24 | N11 `POST /api/work-orders/{workOrderId}/reopen` | `{}` → `{ work_order_id, status: 'complete', classification }`; 409 `not_closed` | ✅ |
| 25 | N8 `GET /api/work-orders/{workOrderId}/vendor-bill-cost-moves?target=billable\|internal\|no_charge&category_key=&moment=closed\|invoiced&line_id=` | `{ integration, bills: [{ part_name, line_title, amount \| null }], total \| null, from: { kind: 'cost_of_parts' \| 'category', category_key, label }, to: { … }, moves: [{ from, to, amount \| null, bills }], moves_when }`; `moment=invoiced` + `line_id` for line actions (S2-R8 v1.0, Q62 ✓); `moment=invoiced` without `target` for Create invoice, one `moves[]` entry per row (S7-R8 v1.0) | ✅ (D60: `line_id` added) |
| 26 | Change-customer preview `GET /api/work-orders/{workOrderId}/change-customer-preview?company_id=` (D25) | `{ classification_after, category_after { key, name } \| null, shop_supplies_reset_amount }` (amount null without `ROLE_PRICING_VIEW`) | ✅ (D60) |
| 27 | N23 `GET /api/work-orders/{workOrderId}/lines/{lineId}/no-charge-preview` | `{ line_price_cents, new_total_cents, deposit_total_cents, all_lines_no_charge }` (S12-R2 summary, S12-R4 deposit sentence, S12-R10 hint); read before Mark as No Charge from the line menu and before a newly ticked No Charge block is saved in Edit Line | ✅ (D60: the write responses do not carry these values) |
| 28 | N24 `POST /api/work-orders/{workOrderId}/lines/{lineId}/mark-no-charge`, N25 `…/change-no-charge-category`, N26 `…/mark-billable` | N24, N25 `{ no_charge_category_key } & OriginalWorkOrderPayload` → the refreshed line; N24 409 `work_order_invoiced`, `work_order_not_billable`, `line_declined`, `line_has_return_or_credit`, `internal_work_orders_off`, 422 `no_charge_category_required`, `category_archived`, `invalid_original_work_order`; N25 409 `category_unchanged` (neither category nor original differs), `not_no_charge`; N26 `{}` (409 `not_no_charge`, `work_order_invoiced`); N25 and N26 allowed while the setting is off (Q37 ✓); 403 without the atoms | ✅ (D60) |
| 29 | Line create / change (existing) | optional `no_charge: ({ no_charge_category_key } & OriginalWorkOrderPayload) \| null` (null = billable, absent = unchanged); present without `ROLE_WORK_ORDER_CREATE_AND_EDIT` + `ROLE_PRICING_VIEW` → 403; `is_warranty` not sent (D57; ignored); 422 `fixed_price_not_available` | ✅ (D60: the Edit Line deposit sentence comes from N23, not from the change response) |
| 30 | `POST invoices/create` | 409 `no_charge_line_original_required` `{ line_id, line_title }` | ✅ |
| 31 | De-pricing of fixed-price lines (S2-R20) | after de-pricing, a fixed-price line that stored no labour type carries the customer's labour type, else the location's default, never `fixed_line_total` / `fixed_labour_price` (F8) | ✅ (D62, Appendix A §2.9) |
| 32 | WO list rows, Tech View, mobile, board (camel) | `classification`, `displayStatus`; filter `classification` eq, `status=closed`; invoiced/paid billable-only | ✅ |
| 33 | Search documents (camel) / schedule sidebar + grid (camel) | `classification`, `displayStatus` / `classification` | ✅ (needs the `work_orders` reindex) |
| 34 | `GET vehicle/invoices/{vehicleId}` | `classification`, `display_status`, `no_charge`, `created_on` = posting date | ✅ |
| 35 | Invoice details/view | `classification`, `category`, `is_closed` | ✅ |
| 36 | `POST invoices/reverse-invoice` | 409 `use_reopen_work_order` (never reached: the menu shows Reopen) | ✅ |
| 37 | `GET bookkeeping/integration` (camel) | category rows inside `settings_group_account` directly after `costOfPartsId`: `key` `workOrderCategory_<category_key>` (no `':'`, F12), `subcategory: 'internal_category' \| 'no_charge_category'`, `categoryKey`, `archived`, `isDefault`, `selected`, `issues`; empty rows for every connected location (D54); emitted from BE Phase 2C, only where the release gate is open (FE-K2) | ✅ (D60, D61) |
| 38 | `PUT bookkeeping/settings` | items `{ key: 'workOrderCategory_<category_key>', id, sectionKey: 'settings_group_account' }`; unknown keys still 422; 422 per-field errors as today | ✅ |
| 39 | `GET bookkeeping/unexported-items` | type label, reference, subject (classification + category), withdrawn state + `withdrawn_reason` | ✅ |
| 40 | N12 `GET /api/reporting/reports/internal-work-orders?tab=by_line` | query `tab`, the date params of `ReportListRequestDto` (as Sales By Customer; ≤ 366 days), `location_id`, `classification=all\|internal\|no_charge\|no_charge_line`, `category_key` (archived accepted), `original_technician_id` (uuid or `unassigned`), pagination; `data.collection` rows `{ row_type: 'work_order' \| 'line', work_order_id, work_order_number, line_id, line_number, line_title, customer_id, customer_name, classification, category { key, name, archived }, original_work_order { id, number, is_deleted } \| null, original_not_in_shopview, original_line_number, original_technicians: [{ staff_id, name }], date, parts_cost \| null, shop_supplies \| null, hours }`; `data.totals { work_order_count, line_count, parts_cost, shop_supplies, hours }` and `data.summary: [{ category, parts_cost, work_order_count, line_count, hours }]` over the filtered range | ✅ (D60; `is_deleted` renders a deleted original as plain text, S12-E5) |
| 41 | N12 `…/internal-work-orders?tab=by_technician` | `data.collection` rows `{ technician { id, name } \| null, completed_lines, comeback_lines, warranty_lines, comeback_rate, redo_hours, redo_parts_cost \| null }` + `data.totals` (null technician = Unassigned; Q33 ✓) | ✅ (D60) |
| 42 | N12 `…/internal-work-orders/export?format=csv\|pdf&tab=` | csv = one file of the open tab (the FE sends `tab`), pdf = both tabs as sections (S9-R2 v0.22); 10,000 rows → 400 | ✅ |
| 43 | Technician Efficiency endpoints | `internal_work_orders=all\|hide\|only` (D56) | ✅ |
| 44 | WIP rows | `classification`, value 0 | ✅ |
| 45 | Customer Invoice export | `include_non_billable=0\|1` | ✅ |
| 46 | Receive view (camel) | per item `sellPriceSuppressed: 'internal' \| 'no_charge' \| 'no_charge_line' \| null` (F11) | ✅ (D60; values stated in Appendix A §4.1) |
| 47 | Vendor-invoice delivery item | the same flag on the item the edit dialog opens (Q48 ✓) | ✅ (values as row 46) |
| 48 | Credit-available parts `GET part-sales/{id}/list-credit-available-parts` (camel) | `noChargeCategoryName: string \| null` per part (Q35 ✓) | ✅ (D60) |
| 49 | Notes list | system notes `source: 'system'`, author "ShopView", `metadata.type` ∈ `classification_changed`, `line_no_charge_changed` (also `work_order_closed`, `work_order_reopened`), `metadata.actor`, `metadata.work_order_refs: [{ id, number, is_deleted }]` | ✅ (D60, E-17) |
| 50 | Hub `GET/PUT /system-accounts` (through core's proxy) | `category_accounts: [{ category_key, list, name, is_archived, is_default, kind, account_id, account_number, account_name }]` in server order; PUT `category_mappings: [{ category_key, kind, account_id \| null }]` (null clears and keeps the row); 422 `category_mappings.N.*` (D53) | ✅ |
| 51 | Hub `GET /accounting-events` + retry | `hold_reason`, `hold_message`, `held_at`, `work_order { number, classification } \| null`, `can_retry` (never on Dismissed), `dismissal_reason` | ✅ |
| 52 | Hub `GET /invoices`, `/invoices/{id}` | §2 FE-E fields; `closed` status; `no_charge_lines[].posting_status`, `hold_message`, `expense_accounts` | ✅ |
| 53 | Hub JE sources | `internal_work_order`, `no_charge_work_order`, `no_charge_line` | ✅ |
| 54 | WO log labels | from the BE `getNameById()` | ✅ (no FE change) |

---

### 4. The "Closed" display

#### 4.1 Every surface that renders WO status

Rule: **label and color** read `displayStatusOf(row)` (= `display_status ?? status`); **locks** read the raw status; the badge reads `classification`. A billable WO with no-charge lines shows none of this (S12-R12).

| Surface | File(s) | Data source | Change |
|---|---|---|---|
| WO list (all tabs) | `components/ts/work-orders/displays/shared/WorkOrderTableRow.vue:48-115` (`badge_work_order_status`), `:194-203` Total price | `GET /api/work-orders` row | label/color from the display status; `ClassificationBadge data-test-id="badge_work_order_classification"`; Total price "No Charge" on non-billable rows (`cell_total_price_<id>`). The footer total (`WorkOrdersListDisplay.vue:60-61,137`) already sums `totalPrice` = 0 |
| Tech View | `displays/tech-view/WorkOrdersTechViewDisplay.vue` (renders `WorkOrderTableRow`) | same | the status-width sizer (`tech_view_status_sizer`, `:72`) measures the label **plus** the badge |
| Mobile card | `components/ts/work-orders/WorkOrderCardMobile.vue:26-31` | same | label/color; badge; `data-test-id="badge_work_order_status"` |
| Board | `displays/board/BoardCardStatus.vue` via `WorkOrderBoardCard.vue:56-78` | `LeadBoardItem` | label/color; badge inside `.board-card__status` (`board_card_classification`); placement by raw status (closed sits with invoiced) |
| Schedule sidebar | `components/ts/schedule-next/sidebar/SidebarWorkOrderCard.vue` | `SidebarWorkOrder` | badge next to the number (`sidebar_card_classification`) |
| Schedule grid block | `schedule-next/calendar/renderers/ScheduleBlock.vue` + `calendar/adapters.ts` | `ShiftWorkOrder` | badge in the full variant; " · Internal" / " · No Charge" appended to the compact label |
| Global search | `navigation/search/searchRowVariants.ts:182-254` → `SearchResultRow.vue` | search doc `item.fields` | `statusBadge(displayStatus, label)`; `badges: [{ label: 'Internal' \| 'No Charge', tone: 'warning' }]` |
| Customer Work Orders tab | `components/ts/customers/CustomerWorkOrderTab.vue:100-108` | list endpoint | label/color; badge; `badge_work_order_status`; Closed filter option |
| Asset Work Orders tab | `components/ts/customers/VehicleWorkOrdersTab.vue:132-140` | list endpoint | same |
| Detail header desktop / mobile | `components/shared/OrderStatusCard.vue:13-20` / `components/ts/shared/OrderStatusCardMobile.vue:8-13` | WO detail (Vuex) | FE label map (D29), badge, orange modifier, `data-classification`, Closed-on note |
| Asset Invoices tab | `components/ts/customers/VehicleInvoices.vue:248-331` | `GET vehicle/invoices/{id}` | status "Closed" + badge; Total balance "No Charge"; Discount and Tax rate empty |
| WIP report | `components/ts/reporting/work-in-progress/WorkInProgressReport.vue` | WIP rows | badge, "—" values |

#### 4.2 Lock literal sites

| # | File:line | Change |
|---|---|---|
| 1 | `components/ts/work-orders/WorkOrder.vue:1244` `restrictActionStatuses` (provided to the detail tree; consumers `WorkOrderNavBarMenu.vue`, `OrderStatusCard.vue`, `VehicleCard.vue`, `Invoice.vue`, `WorkOrderAdjustmentsCard.vue`) | `= [...WORK_ORDER_LOCKED_STATUSES]` |
| 2 | `components/ts/parts/part-sale/PartSale.vue:234` | same constant (part sales never close; harmless) |
| 3 | `components/ts/shared/FinancialInfoCard.vue:376` | `isWorkOrderStatusLocked(status_value)` |
| 4 | `components/work-orders/ts/WorkOrderLineContextMenuList.vue:268-269` | `!isWorkOrderStatusLocked(...)` |
| 5 | `components/ts/work-orders/work-order-lines/WorkOrderLines.vue:1596` | `['complete','declined'].includes(s) \|\| isWorkOrderStatusLocked(s)` |
| 6 | `components/ts/work-orders/WorkOrderNavBar.vue:18` | `isWorkOrderStatusLocked(s) \|\| ['complete','void'].includes(s)` |
| 7 | `components/shared/OrderStatusCard.vue:493`, `adjustments/WorkOrderAdjustmentsCard.vue:49` (comments) | reword to name the constant |
| — | `components/ts/work-orders/leadAssignmentRules.ts:17-20` `LOCKED_LEAD_STATUSES` (also `declined`) | no change (raw statuses; its own rule) |

Specs to update with the constant: `WorkOrderNavBarMenu.spec.ts`, `VehicleCard.spec.ts`, `OrderStatusCard.spec.ts`. Behavior is unchanged for every existing status. The implementer runs `rg "'invoiced'" src --glob '!**/tests/**'` and records each hit as "raw → no change" or "switch to the helper".

---

### 5. Surfaces that hide prices, the shop supplies field, and the no-charge line

`mode` = `useLinePricingMode()`; `ncl` = a no-charge line on a billable WO (`lineIsNoCharge`). Today's `none` behavior is unchanged.

| Surface | File:line | `costOnly` (non-billable + See Financial Data) | `ncl` in `full` mode |
|---|---|---|---|
| Lines table columns | `WorkOrderLines.vue:63, 1738-1745`, `work-order-lines/constants.ts:21-87` | drop Rate and Margin; third column "Cost" | columns unchanged |
| Line row cells | `WorkOrderLineRow.vue:201-230` (`line_rate_<id>`, `line_margin_<id>`, `line_total_cost_<id>`), colspans `:816,819` | cost cell only, `line_cost_<id>` | Rate `$0.00`, Margin blank, Total `$0.00`; chip after `line_title` |
| Part sub-rows | `WorkOrderLineParts.vue:400-437` | one cell, `part_cost_total_<id>` | sell price `$0.00` (data), margin blank |
| Part row colspans | `constants.ts:120-128` | `PART_ROW_FINANCIAL_CELL_COUNT` = 1 | unchanged |
| Inline add/edit part row | `work-order-lines/InlinePartRow.vue` | no sell price / margin inputs; cost under See Financial Data | sell price not required, not editable |
| Line adjustment rows | `LineAdjustmentRows.vue` | not rendered | not rendered (line discount removed, S12-R4) |
| Core row | `WorkOrderLineParts.vue` core rows; `components/work-orders/ts/CorePartLineSection.vue` | no core amount | `$0.00` (S12-E3) |
| Mobile line card | `WorkOrderLineCard.vue:185-212` | Cost only | `$0.00` / blank margin; chip |
| Line dialog | `LineDialog.vue:105-300` | Labor rate (`LabourTypeSelect`, suffix `line_labor_rate`), Fixed Line Total, Fixed Labor, Labor / Parts Portion hidden, none required | fixed fields hidden, fixed pseudo options removed |
| Edit Labor | `dialogs/AddLabourDialog.vue` | fixed fields hidden | fixed fields hidden |
| Part dialog | `PartDialog.vue:160-240, 758-760` | `canViewCost` (See Financial Data) vs `canViewSellPricing` (`mode === 'full'` and not `ncl`); Core charge, Sell price (+ its rule and "lower than cost" badge), Margin hidden | sell price read-only `$0.00` |
| Totals block | `components/ts/shared/FinancialInfoCard.vue:260-324` | only "Shop Supplies" | unchanged (server totals on billable lines) |
| Shop supplies field | `FinancialInfoCard.vue:87-100` (`input_shop_supplies_cost`), `button_edit_financial_info`, `button_save_financial_info` | same control and mutation (`useUpdateWorkOrderShopSuppliesCostMutation`); See Financial Data + Invoicing & Payments — Create & Edit; locked when closed; hidden without See Financial Data | unchanged |
| WO fees/discounts card | `adjustments/WorkOrderAdjustmentsCard.vue`, `AdjustmentsSummaryCard.vue` | not mounted | unchanged (fees on billable amounts) |
| Stats tab | `components/ts/work-orders/Statistics.vue:93,150,210-301` | "No Charge" in the work-order total cell (S2-R4 v0.22); sell, margin and rate cells hidden; cost and hours stay under 'See Financial Data' | server values |
| Finance toolbar | `components/ts/billing/InvoiceActionBar.vue` | discount/tax Settings, Add Deposit, New Payment, Issue Credit, IBS hidden; Send to Portal per S2-R11; Customer PO optional | unchanged |
| Completion wizard | `complete/CompletionWizard.vue:309-316` | no core amount, no "invoice" wording | `$0.00` core |
| Documents | `components/ts/billing/InvoiceDisplay.vue:21-22` (BE HTML) | none (BE stamp + category line) | none (BE prints the category under the title) |
| Shop-floor print | `print/WorkOrderPrintView.vue` | unchanged (no prices today) | "No Charge · [category]" beside the line |
| WO list Total price | `WorkOrderTableRow.vue:194-203` | "No Charge" (column only with See Financial Data) | stored billable total |
| Board total | `displays/board/boardFields.ts` | "No Charge" (S2-R4 v0.22) | stored billable total |
| Asset Invoices tab | `VehicleInvoices.vue` | "No Charge" in Total balance | unchanged |
| Issue Credit | `components/ts/credits/PartsReturnPicker.vue:57-122` | — (no invoice) | `$0.00`, restocking fee disabled (Q35 ✓) |

---

### 6. data-test-ids (for the E2E pass)

Settings: `input_internal_work_orders`, `text_iwo_hint_categories`, `link_iwo_hint_categories`, `text_iwo_hint_no_internal_customer`, `text_iwo_hint_accounts`, `link_iwo_hint_quickbooks`, `link_iwo_hint_account_mappings`.
First-enable modal: `dialog_iwo_first_enable`, `select_iwo_internal_customers`, `button_iwo_do_this_later`, `button_iwo_save_internal_customers`, `text_iwo_first_enable_change_later`.
Make internal: `dialog_make_internal`, `text_make_internal_body`, `row_make_internal_<id>`, `text_make_internal_note_deposit_<id>`, `text_make_internal_note_vendor_bill_<id>`, `text_make_internal_more`, `text_make_internal_inaccessible`, `button_keep_billable`, `button_make_internal`, `button_make_internal_ok`.
Remove flag: `dialog_remove_internal_flag`, `text_remove_internal_flag_body`.
Customers and assets: `checkbox_customer_internal`, `text_customer_internal_helper`, `text_customer_internal_setting_off`, `link_customer_internal_settings`, `select_customer_default_internal_category`, `text_customer_default_category_archived`, `badge_customer_internal`, `card_customer_mobile`, `text_customer_mobile_name`, `button_edit_customer`, `input_customer_shop_supplies_percent`, `input_customer_min_shop_supplies`, `input_customer_max_shop_supplies`, `select_asset_internal_category`, `text_asset_internal_category_helper`.
Categories page: `link_internal_work_orders_tab`, `tab_internal_categories`, `tab_no_charge_categories`, `banner_iwo_categories_setting_off`, `button_new_internal_category`, `button_new_no_charge_category`, `table_internal_categories`, `table_no_charge_categories`, `category_row_<key>`, `text_category_qb_not_set_<key>`, `button_category_menu_<key>`, `menu_item_edit_category_<key>`, `menu_item_archive_category_<key>`, `link_show_archived_categories`, `button_restore_category_<key>`; dialog `dialog_iwo_category`, `input_iwo_category_name`, `select_iwo_category_qb_<workplaceId>`, `text_iwo_category_qb_read_only`, `checkbox_iwo_category_requires_original`, `checkbox_iwo_category_default`, `text_iwo_category_hub_account`; `dialog_archive_category`.
Category and original fields (shared, prefixed by the host's suffix): `select_<host>_category`, `select_<host>_original_work_order`, `option_original_not_in_shopview`, `select_<host>_original_line`, `text_original_technician`.
New WO: `badge_wo_dialog_internal_customer`, `icon_wo_dialog_internal_info`, `tooltip_wo_dialog_internal`, `checkbox_wo_no_charge`, `icon_wo_no_charge_info`, `select_wo_no_charge_category`.
WO menu: `menu_item_convert_to_no_charge`, `tooltip_convert_to_no_charge_deposit`, `menu_item_convert_to_billable`, `menu_item_change_no_charge_category`, `menu_item_close_work_order`.
WO dialogs: `dialog_convert_to_no_charge`, `select_convert_no_charge_category`, `dialog_convert_to_billable`, `dialog_change_no_charge_category`, `select_change_no_charge_category`, `dialog_vendor_bill_cost_move`, `text_vendor_bill_cost_move_body`, `text_change_customer_classification_effect`, `text_change_customer_shop_supplies_reset`, `customer_card_change_action`.
Badges and header: `badge_wo_classification`, `badge_wo_classification_mobile`, `badge_wo_status_mobile`, `text_wo_closed_on`, attribute `data-classification`, `badge_work_order_classification`, `cell_total_price_<id>`, `board_card_classification`, `sidebar_card_classification`, `badge_vehicle_invoice_classification_<id>`, `cell_vehicle_invoice_status_<id>`, `cell_vehicle_invoice_total_<id>`, `badge_wip_classification_<key>`; `badge_work_order_status` on `WorkOrderCardMobile`, `CustomerWorkOrderTab`, `VehicleWorkOrdersTab`.
Filters: `filter_chip_classification` (+ `filter_option_classification_<value>`), `filter_option_status_closed`.
Lines (whole WO): `line_cost_<id>`, `part_cost_total_<id>`, `select_line_labor_rate`.
No-charge line: `chip_line_no_charge_<lineId>`, `menu-item_mark_no_charge_<lineId>`, `menu-item_change_line_category_<lineId>`, `menu-item_mark_billable_<lineId>`, `dialog_mark_line_no_charge`, `text_mark_no_charge_line_summary`, `select_mark_line_no_charge_category`, `text_mark_no_charge_all_lines`, `text_mark_no_charge_deposit_exceeds`, `button_mark_no_charge_ok`, `dialog_mark_line_billable`, `checkbox_line_no_charge`, `text_line_no_charge_helper`, `select_line_no_charge_category`, `work_order_print_line_no_charge_<id>`, `text_parts_return_no_charge_<workOrderPartId>`.
Close: `button_close_work_order_header`, `button_close_work_order`, `button_bulk_close_work_order`, `dialog_close_work_order`, `banner_close_original_required`, `input_close_work_order_posting_date`, `row_close_stock_parts`, `row_close_special_orders_<state>`, `row_close_labor`, `row_close_shop_supplies`, `row_close_parts_no_cost`, `text_close_<row>_amount`, `text_close_<row>_note`, `banner_close_no_account_quickbooks`, `banner_close_no_account_hub`, `link_close_set_account_quickbooks`, `link_close_account_mappings`, `text_close_summary`, `error_close_work_order_changed`, `button_confirm_close_work_order`, `loading_base_dialog_close_work_order`.
Reopen: `menu_item_reopen_work_order`, `dialog_reopen_work_order`.
QuickBooks: `text_quickbooks_category_header_internal`, `text_quickbooks_category_header_no_charge`, `quickbooks_option_workOrderCategory_<key>` (existing pattern), `quickbooks_empty_hint_workOrderCategory_<key>`, `quickbooks_category_row_archived_<key>`, `text_quickbooks_shop_supplies_note`.
Receive / vendor invoice: `banner_cost_margin_notice` (existing `InfoNotice` id, `components/ts/shared/InfoNotice.vue:8`; its text now varies by row), `banner_delivery_item_cost_only`.
Notes: classification notes render links inside the existing note card ids (`note_sender_<id>` reads "ShopView").
Accounting: `text_current_category_account_<key>`, `select_category_account_<key>`, `error_category_account_<key>`, `text_hold_message_<id>`, `badge_accounting_invoice_classification_<id>`, `table_accounting_invoice_no_charge_lines`.
Reports: `report_nav_internal_work_orders`, `page_internal_work_orders_report`, `row_iwo_summary`, `card_iwo_summary_<categoryKey>`, `tab_iwo_by_line`, `tab_iwo_by_technician`, `table_iwo_by_line`, `table_iwo_by_technician`, `header_iwo_<col>`, `row_iwo_totals`, `text_iwo_by_technician_note`, `text_iwo_empty`, `btn_dropdown_iwo_export`, `action_iwo_export_csv`, `action_iwo_export_pdf`, `filter_chip_classification`, `filter_chip_category_key`, `filter_chip_original_technician_id`, `filter_chip_internal_work_orders`, `checkbox_include_non_billable`, `text_include_non_billable_helper`.

No shipped id is renamed. The finish-action ids keep today's values for billable WOs. E2E page objects that reference touched components: `e2e/src/pages/work-orders/lines.page.ts`, `work-order-adjustments.page.ts`, `wo-adjustments-card.page.ts`, `wo-line-adjustments.page.ts`, `e2e/src/pages/finance/finance.page.ts`, `e2e/src/utils/imported-status-filter.ts` (Status options gain Closed), `e2e/src/api/factories/work-order.factory.ts` (create payload gains optional fields).

---

### 7. Risks

1. **Silent casing mismatch (F1)** across ~40 new fields in seven endpoint families. Mitigation: §3 signed off per phase; one Vitest per endpoint whose MSW fixture is copied from a real BE response (recorded from the BE functional test), not hand-written.
2. **Locks unlocked by the display status (F2).** Mitigation: `displayStatusOf()` is the only reader of the display status; a unit test asserts `isWorkOrderStatusLocked('closed')`; reviewers grep for `display_status` / `displayStatus` reaching any `includes(` lock.
3. **Story 12 blast radius.** The line components (`work-order-lines/`: `WorkOrderLines.vue` 4061 lines, `InlinePartRow.vue` 3174, `WorkOrderLineParts.vue` 1398, `WorkOrderLineRow.vue` 1017, `WorkOrderLineCard.vue` 770), `LineDialog.vue` (1670) and the line menu are shared by part sales, imported WOs, inspections and ShopCoach rows. Mitigation: one predicate (`lineIsNoCharge`), one chip component, the `inject` fallback for the pricing mode; regression specs with `no_charge` absent; browser-walk a part sale and an imported WO.
4. **One line-write endpoint, four writers** (Edit Line, Edit Labor, inline row save, ShopCoach builder). If an absent `no_charge` block were read as "clear", Edit Labor would silently un-mark a line. D57 makes absent = unchanged; the FE sends the block only from Edit Line / New Line and only on change; specs assert no other writer sends it.
5. **Fixed-price leftovers (F8, §3 row 31).** A de-priced line left on a fixed pseudo labour type cannot be saved in Edit Line. Mitigation: FE hides the fields and filters the pseudo options; the BE assigns the customer's labour type, else the location's default (D62); browser-walk a converted fixed-price line.
6. **QuickBooks page (F12).** A category row key containing `':'` breaks issue mapping and scroll-to-problem; leaving category rows in the Accounts list regroups every Accounts row. Mitigation: §3 row 37, the adapter peel and split, `quickBooksIntegrationAdapter` specs; FE-K2 ships in the same batch as BE Phase 2C, which emits the rows only where the release gate is open (D61).
7. **Accounting port (F13).** Category rows would vanish or never save if they went through the static key list; a null on a category row must not be treated as a delete. Mitigation: a separate draft and the `category_mappings` member; FE-E merges only after the hub accepts it.
8. **Release gate coverage (D43).** The gate now covers the categories route and nav, Edit Customer's default category, Edit Asset's field, the line controls and the QuickBooks / hub category rows. A surface that forgets `isAvailable` leaks the feature before launch. Mitigation: one composable, one spec per surface, the route `requiredCheck`.
9. **Pricing-mode refactor across ~10.5k lines** (part sales and imported WOs share the components). Mitigation as risk 3.
10. **Settings draft clobbered after N1.** Mitigation: `setQueryData` patch + spec.
11. **Mixed receive pages (F11).** One notice for rows of different work orders. Mitigation: `costNoticeFor` of the last edited row; spec with mixed rows.
12. **Shared components changed:** `InfoNotice` (tone + slot), `FilterDef` / `FilterChip` (tooltip), `FilterSingleSelectPanel` (group headings), `STATUS_COLOR_MAP` (new key), accounting `ACCOUNTING_STATUS_META` (new key) and the list-row status cell (badge), `NoteCard` (link rendering), the QuickBooks adapter / page / `QuickBooksMapping`, `WorkOrderLineContextMenuList` (root `v-if`), `VehicleDialog` (five consumers), `PartsReturnPicker`. Every change is additive with defaults; run each component's specs plus `npx vitest related --run --maxWorkers=2 <file>`.
13. **Search reindex** (release step) not run → badges missing in search only.
14. **The Total price column exists only with See Financial Data**, so "No Charge" is invisible to those users in the list; E2E for a non-financial role must not expect it.
15. **Original-work-order select scale.** A fleet customer can have thousands of invoiced WOs; N21 stays search-driven and capped at 25, never a full list.
16. **Completion failure inside Close** uses the completion error toast, not the Close copy (as Create invoice today).

#### Regression scenarios for modified shared code

| Modified | Other features depending on it | Verify |
|---|---|---|
| `WorkOrder.vue` `runCreateInvoice` / finish action | Create invoice from header, menu, bulk bar, Finance tab, wizard; Mark Reviewed | billable WOs invoice exactly as today on all five; a WO without no-charge lines never hits the S12-R9 check |
| `CompletionWizard.vue` | every completion entry | CTA labels unchanged for billable |
| `OrderStatusCard.vue` (also part sales) | WO + part-sale header, lead / advisor / sales-rep locks | part-sale header unchanged; every existing status label matches today |
| `FinancialInfoCard.vue` | WO, part sale, imported WO | part-sale and imported cards unchanged |
| Lines components, `LineDialog.vue`, `AddLabourDialog.vue` | part sales, imported WOs, inspections, ShopCoach rows | part-sale lines show prices as today; Edit Labor on a billable line sends the same payload minus `is_warranty` |
| `WorkOrderLineContextMenuList.vue` | every line menu item | items for billable lines unchanged; root menu still renders for today's roles |
| `InvoiceActionBar.vue` (WO + part-sale arm `:181-252`) | payments, deposits, reverse, credit, IBS, portal | part-sale menu untouched; billable WO toolbar unchanged |
| `WorkOrderNavBarMenu.vue` | Audit Log, Timesheets, Fee/Discount, Print, Delete | billable WO menu unchanged |
| `ChangeWorkOrderCustomerDialog.vue`, `CustomerCard.vue` | change customer on service + part sale | part sale: no classification copy; billable invoiced WO: button still hidden |
| `CustomerDialog.vue`, `VehicleDialog.vue` | New / Edit customer; New / Edit asset from five hosts | New Customer and New Asset requests byte-identical; shop supplies validation unchanged for non-flagged customers |
| `WorkOrderSettings.vue` | the existing toggles, the confirm dialog | each saves as today |
| `useWorkOrdersViewState` / `workOrdersFilters` | all tabs, board, mobile, saved filters | URL state without `classification` restores as today |
| `QuickBooks.vue`, adapter, `QuickBooksMapping.vue` | every ShopView Accounts row, customer-money and fees panels | save payload byte-identical with no category rows; validation banner unchanged |
| `MultiVendorReceiveModel.ts` and the three receive surfaces | every receive | billable rows: same notice, same Sell preview |
| `NoteCard.vue` | every note type, inbox variant | non-classification notes render as today |
| `PartsReturnPicker.vue` | Issue Credit on part sales and WOs | billable parts unchanged |
| `STATUS_COLOR_MAP`, `WORK_ORDER_STATUS_LABELS` | `colorCoding` callers | no existing key changed |
| `InfoNotice.vue`, `FilterChip.vue` / `FilterDef`, `FilterSingleSelectPanel.vue` | every consumer | default rendering unchanged |
| Accounting `shared/Model.ts`, list-row status cell, `AccountingSystemAccounts.vue` | every accounting list; Account Mappings | existing pills unchanged; `held` deposits still blue; static mappings save as today |
| `boot/axios.ts` `silentFailEndpoints` | all requests | one additive entry |

---

### 8. Engineering decisions (same user-visible result)

- **E-1 Price hiding:** a `LinePricingMode` provided once from `WorkOrder.vue`, plus the per-line no-charge override; new test ids for cost cells (`line_cost_<id>`, `part_cost_total_<id>`) so price and cost never share an id.
- **E-2 Lock literal:** one `WORK_ORDER_LOCKED_STATUSES` including `closed`; same behavior today, fails safe if a display status ever reaches a lock.
- **E-3 Where Close lives:** a dialog in `WorkOrder.vue` reached from `runCreateInvoice`, not the invoice-creation intent.
- **E-4 Make internal queue:** one `useMakeInternalQueue` shared by Settings and Edit Customer.
- **E-5 Change-customer outcome:** from the BE preview (D25), no FE mirror of the rule.
- **E-6 Hub Held tone:** scoped `event_held` key; the shared `held` stays blue for deposits.
- **E-7 "Closed" in the Status filter:** appended by the FE beside Declined / Imported.
- **E-8 Header status label:** FE label map from the display status (D29).
- **E-9 Settings hints:** from the saved value, not the draft.
- **E-10 QuickBooks category rows:** peeled out of the Accounts group by the adapter and rendered between the two halves of the Accounts list in the same section; saved through the existing settings save (D54).
- **E-11 Category rows in Account Mappings:** a dynamic second set from `category_accounts` with its own draft (D53).
- **E-12 Category key:** opaque to the FE; never parsed (D50).
- **E-13 QuickBooks options in the category dialog:** loaded per location when its picker opens.
- **E-14 S2-R1 category resolution:** read from the BE (N20), never mirrored.
- **E-15 Line no-charge writes:** dedicated endpoints for the menu actions, an optional block on line create/change for the dialog door, sent only on change (D57).
- **E-16 `is_warranty`:** the FE stops sending it; reads stay (D57).
- **E-17 Note links:** `metadata.work_order_refs` + FE linkify on the WO number; the content stays plain text for every other consumer.
- **E-18 Report location filter:** single select with "All locations" (D45); parameter `location_id`, absent = all accessible.
- **E-19 Setting and chip naming:** `internalWorkOrders*` DTO keys and the `internal_work_orders` chip parameter (D56).

---

### 9. Questions

#### PRODUCT — rounds 3 and 4, answered in PRD v0.22 and v0.23 (✓)

| Id | Question | Built as |
|---|---|---|
| Q30 ✓ | S8-R7: when a no-charge line's category row is empty, what is held? | Only that line's cost entries are Held; the record shows the line's Held state and reason in the No Charge lines block (FE-E) |
| Q31 ✓ | S9-R4: a shop that only marks lines never closes a WO | The first invoice carrying a no-charge line also lists the report, the chip and the export option |
| Q33 ✓ | S9-R2 By technician: a whole no-charge Comeback / Warranty WO | Counts as one line |
| Q34 ✓ (changed) | S9-R2 v0.22 | PDF with both tabs as sections; the CSV carries the open tab |
| Q35 ✓ | S12-E7: Issue Credit and no-charge parts | Listed at $0.00, restocking fee disabled; the part returns to stock and its cost reverses to the category account |
| Q36 ✓ | S2-R6: WO-level Change category Save rule | Save once the category, the original work order or the original line differs (as S12-R5) |
| Q37 ✓ | S12-N1: line Change category / Mark as Billable while the setting is off | Both stay available (as S2-N1) |
| Q38 ✓ | S2-R2: where original-work-order candidates come from | Locations the user can access; Not in ShopView covers the rest |
| Q39 ✓ | S1-R14: does an archived name block a new category? | Yes, "A category with this name is archived. Restore it instead." on the Name field |
| Q40 ✓ | S5-R1 / S6-R1: archived category rows | Greyed, still editable, on both the QuickBooks page and Account Mappings |
| Q41 ✓ | S1-R14: connected locations the user cannot access | The category dialog lists only accessible connected locations |
| Q42 ✓ | S2-R17: shift-derived roster technicians | Count as assigned (the roster as the line shows it) |
| Q43 ✓ | S1-R13: the categories page Work orders count | Includes billable WOs carrying a no-charge line of that category |
| Q44 ✓ | S2-R22: derived Warranty flag; premise | Derived also on the lines of a whole Warranty WO; nothing to remove from the line dialog (no toggle exists); the print chip is new content (F9) |
| Q47 ✓ | S12-R1: "the Line Builder's line dialog" | The No Charge block lives in Edit Line / New Line only (F10) |
| Q48 ✓ | S2-R19: the vendor-invoice screen has no sell-price notice to replace | The cost-only notice is added to the vendor-invoice item edit for affected items |
| Q49 ✓ | S12-R4 copy: overflow becomes a deposit on the customer's account | "Deposit $[amount] exceeds the new total $[total]. The difference stays on the customer's account as a deposit when the invoice is created." |
| Q50 ✓ | Hub copy | Held reason "No Charge: Warranty row not mapped" (rendered verbatim from the hub), "Waiting for an earlier held entry of work order [n]", JE source "No Charge line" |
| Q51 ✓ | Copy gaps | (a) S2-R1 tooltip when the org default applies: "… from the customer."; (b) the hint beside "[name] (archived)": "Archived. Pick an active category."; (c) receive notice on a whole No Charge WO: "No Charge work order: cost only, no sell price" |
| Q52 ✓ | S1-R14 / S5-R1 vs S5-R2: which accounts the category pickers list | Expense-type accounts (Expense, Other Expense, Cost of Goods Sold), a currently mapped account of another type kept visible |
| Q62 ✓ | S7-R8: "each case shows in the Create invoice confirmation", but Create invoice has no confirmation (F4) | A confirmation in front of Create invoice, shown only when a cost move happens at invoicing (FE-D); the "Moved from [account] to [account]" information shows in the "Change where the cost is posted?" dialog before Mark as No Charge, line Change category and Mark as Billable when the line has a posted vendor bill and the location has an integration. Answered as proposed in v0.23 (S7-R8, S2-R8, two §8 rows) |
| Q63 ✓ | S2-E6, S12-R4: no IBS cancel exists | No IBS call on Convert to No Charge; the IBS card is hidden on internal and no-charge work orders; after a line mark the advisor re-requests approval with the new amount (D67) |
| Q64 ✓ | Copy where the PRD had none | New button disabled at 100 active categories with "You can have up to 100 active categories in this list. Archive one to add another."; the first-time modal's 50-customer hint; QB Unexported type labels; the categories page's QuickBooks column only while the current location is connected (S1-R2, S1-R13, S7-N3 v1.0) |
| Q65 ✓ (changed) | S2-E7 vs S3-R5: core cost | The Close row reads "Stock parts $[amount], includes $[core amount] core cost · Posted to [account]" from N9 `stock_parts_core_cost`; the NO CHARGE document and the report show Parts cost without cores (D66) |
| Q67 ✓ | §8 'Change category' row vs S2-R6 | Save enabled once the category, the original work order or the original line changes (the §8 row now says so) |

Questions Q32, Q46 and Q53 have no FE work: Q32 (re-resolution of open internal WOs when an asset's or customer's category is edited) is BE-only; Q46 (Sales Follow Up) is BE-only; Q53 (wording slips in S4-E1, S8-N2, S8-R7, S2-N1 and the §8 AccountingHub row) changes no FE string — the FE uses "category" throughout and renders hub dismissal / hold strings verbatim.

#### PRODUCT — carried items, answered in v0.22

- **P-4 ✓** A customer on credit hold does not block Close (S3-N5, v0.22); FE-C skips the credit-hold refusal for Close.
- **P-8 ✓** The success alert keeps the X every alert has (S3-R3 v0.22).
- **P-12 ✓** Board cards and the Statistics total show "No Charge" (S2-R4 v0.22).


---

# Appendix C — AccountingHub plan (`shopview-accounting`)


## Internal Work Orders: AccountingHub backend plan for PRD v1.0

This appendix covers Stories 6 and 8, the hub halves of Stories 4, 10, 12 and 13, and S4-R3.

**Repo and conventions.** The repo is `shopview-accounting` (Laravel 13, PHP 8.5, Pest 4). Work lands on `develop`. Conventions come from that repo's `CLAUDE.md`:
- thin controllers in `app/Api`, logic in `app/Services`
- Spatie Data DTOs
- UUIDv7 `char(36)` ids
- expand/contract migrations
- gates `sail composer lint:fix`, `analyse` and `test`

**Inputs:**
- PRD v1.0 (Confluence page version 39): Stories 6, 8, 12 (S12-R7, S12-R8), 13 (S13-R3 to S13-R5, S13-N1, S13-E2), plus S1-R16, S3-N4, S4-R3, S4-E1, S4-E2, S10-R4 and S10-N2.
- Decisions D14 (as amended for the PRD v0.21 Key Decision on part cost), D21, D26, D37, D38, D39, D43, D44 and D47–D53 (Section 3).
- Design All flows v6.1, Flow 5 frames 3, 3b, 3c and 4.

**Checked against:** hub `origin/develop` at f302de49 (2026-11-05) and core `origin/develop` at 733f03c6 (2026-11-09).

**Path notation.** Paths without a prefix are in `shopview-accounting`. Paths prefixed `core:` are in the core repo. Line numbers refer to those commits.

**Contract state.** Core publishes `shopview/accounting-contracts` **1.11.0**. The hub locks **1.9.0**. None of `invoice_created` v4, `journal_entry_requested` v3, `vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4 exists yet. This work publishes at the next free MINOR (expected 1.12.0, D52).

---

### 0. Facts to know before reading the phases

1. **A Closed record without a journal entry is not new.**
   - `InvoiceCreatedProcessor` §ZERO-VALUE already mirrors a $0 invoice with no journal entry (`app/Services/AccountingEvents/Processors/InvoiceCreatedProcessor.php:141-160, 284-304`).
   - `InvoiceVoider::postedNothing()` already voids one cleanly (`app/Services/Invoices/InvoiceVoider.php:239`).
   - What is new is skipping **revenue resolution**. Today's path resolves revenue before it checks for zero: labor at `:461`, parts at `:507`, the zero checks at `:484` and `:531`. A missing revenue mapping therefore throws even for a $0 invoice.
2. **Category rows cannot live in `account_mappings`.**
   - Its `account_id` is NOT NULL (`database/schema/mysql-schema.sql:28-40`), so an empty row cannot exist.
   - `mapping_key` is cast to the closed `AccountMappingKey` enum (`app/Models/AccountMapping.php:47-52`).
   - `AccountMappingManager::list()` loads every row through that cast (`app/Services/Workspace/AccountMappingManager.php:40-47`), so one row with a dynamic key would throw on read.
   - Category rows therefore get their own tables, following the part-category model: a catalog mirrored from core events plus a per-row mapping (`app/Services/AccountingEvents/Processors/PartCategoryUpserter.php:62-94`, `app/Services/Settings/PartCategoryMappingGrid.php:14-36`). `AccountMappingKey` gains no case.
3. **`journal_entry_requested` v2 cannot name a category.**
   - A line names its account by an `account_key` that resolves through `account_mappings` (`JournalEntryRequestedProcessor.php:548-595`).
   - An unknown key resolves to null and throws a transient "Account not found" (`:159-168`). That is redelivered five times, dead-lettered, and **stalls the organization's whole FIFO stream**.
   - So the family travels on **v3** (D47), and the three version gates order it.
   - Vendor-bill lines and vendor credits of a work order or line that is already internal or no charge (S7-R3, S7-R3a) cannot name a category today either:
     - A bill item carries no account key. The hub routes every work-order delivery line to the part category's COGS (`BillCreatedProcessor.php:94-118, 419-432`), and the items schema is closed (`additionalProperties: false`, `core:api/docs/integration/accounting-events/vendor_bill_created.v3.schema.json:89`).
     - A vendor credit carries no lines at all. The hub lands its parts amount whole on Parts Inventory (`VendorCreditCreatedProcessor.php:54-73, 231-240`; `app/Services/Parts/CogsAccountResolver.php:30-33`).
     - So the per-line category travels on **`vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4**, and the line posts straight to the category row at bill or credit time (T4, B2b). Reclass entries remain only for S7-R4 and D47 moves (C4, C6).
4. **A contract type is supported in the release that pins its schema, or the build fails.** The hub's contract catalogue is closed:
   - Every schema in the pinned package must be supported or listed as published-not-yet-consumed (`tests/Contracts/ContractSchemaTest.php:217-300`).
   - Every type needs an enum case and a registered processor (`tests/Feature/AccountingEvents/ContractConsumerCoverageTest.php:49-70`).
   - A case without a support entry throws (`app/Enums/AccountingEventType.php:164-176`).
   - Consequence: the release that adopts the package also ships the `work_order_category_upserted` processor (Release A, §2).
   - Before that, the hub must adopt the contract versions core published after 1.9.0 (up to 1.11.0: Portal Sync, vendor hub-commands), which fall under the same rule.
5. **Transport order is per organization, and timestamps are seconds.**
   - `MessageGroupId` is the organization id (`core:api/docs/integration/accounting-events/README.md:56-57`). Causally dependent events commit in order (`core:api/src/Accounting/Outbox/Application/Service/AccountingOutboxRelay.php:35-40`).
   - The consumer applies a batch strictly in order and blocks the rest of a group after a failure (`app/Services/AccountingEvents/Sqs/SqsAccountingEventConsumer.php:52-77`).
   - The envelope's `occurred_at` is `Y-m-d\TH:i:s\Z` (`core:api/src/Accounting/Outbox/Application/Service/AccountingEventEnvelopeSerializer.php:41`).
   - Once a Held event is parked out of band, the hub cannot order one work order's Close and Reopen from timestamps. The payload carries the work order's finish **cycle** instead (D51).
6. **The parts cost never rides on `invoice_created`.**
   - It posts as one `journal_entry_requested` per inventory change (`core:api/src/Accounting/Outbox/Application/Service/PayloadBuilder/JournalEntryRequestedPayloadBuilder.php:12-23`). The hub's invoice processor books no COGS.
   - Design frame 5/3c draws a billable invoice's revenue and parts cost as one entry (INV-7731). The hub produces separate entries: the invoice's revenue entry, plus one cost entry per part.
7. **6430 Warranty & Goodwill Expense is in the v2 chart only.**
   - It is seeded only when `ACCOUNTING_CHART_V2_WRITERS` is on (`app/Services/Workspace/Seeders/ChartOfAccountsSeeder.php:212-214`, `config/chart_of_accounts.php:32`, `app/Services/Workspace/Seeders/ShopExpenseAccountsSeeder.php:20`).
   - Otherwise it comes from the operator-run chart upgrade, which is never called by a migration (`app/Services/Accounts/ChartUpgrade.php:20, 39-65`).
   - Most existing workspaces therefore do not have it. 6500 Vehicle Expenses is in both charts (`ChartOfAccountsSeeder.php:111`).
8. **A mapped account cannot be deactivated through the hub UI.**
   - `AccountUsageInspector` refuses an account any mapping row points at (`app/Services/Accounts/AccountUsageInspector.php:75-76, 180-200`). Phase A3 adds the category mapping rows to that check.
   - So S6-E1 is a defensive path for direct-DB data and needs no "on reactivation" trigger.
9. **"Held" already means something in the hub.**
   - `accounting:reprocess-held` (`app/Console/Commands/ReprocessHeldAccountingEvents.php`) replays **gate rejections** in `accounting_event_rejections`.
   - The new `AccountingEventStatus::Held` sits on `accounting_events`. Runbooks and log lines keep the two apart (R9).
10. **A Dismissed event can be brought back today.**
    - `AccountingEventReplayer::replay()` resets a Dismissed row to Pending and clears the dismissal (`app/Services/AccountingEvents/AccountingEventReplayer.php:44-77`).
    - The Retry API accepts only Failed (`app/Api/AccountingEventController.php:145-147`).
    - A core resend and an SQS redelivery already leave Dismissed rows alone (`app/Services/AccountingEvents/EventIngestor.php:139-144`, `SqsAccountingEventConsumer.php:621, 664-676`).
    - S4-R3's "a Dismissed event is never retried" needs a marker and a refusal (B5).
11. **A vendor bill or a vendor credit can never be parked.**
    - A vendor payment that applies an unmirrored bill or draws an unmirrored credit throws a transient error (`app/Services/AccountingEvents/Processors/VendorPaymentSentProcessor.php:228-232, 288-292`), which stalls the organization's stream.
    - A void of an unmirrored bill is a permanent refusal (`BillVoidedProcessor.php:74`), so the books would stay wrong after the bill posted.
    - So a bill or credit line whose category row is empty or inactive still posts, on today's routing, and only the move to the category is Held (B2b, HQ8 ✓, S8-R3 v1.0).

---

### 1. Scope (hub side)

| PRD | What the hub does |
|---|---|
| S6-R1, S1-R16 | One mapping row per category under "Parts cost of goods sold", fed by `work_order_category_upserted` (D49). A new category gets an empty row at once. Rename keeps the row and its account. Archive greys the row and keeps it, and restore brings it back untouched. There is no fallback between rows. Served inside `GET/PUT /system-accounts` (D53). |
| S6-R2, S13-R3–R5, S13-N1, S13-E2 | The four starting categories are mapped automatically: General Internal to 6500, Warranty and Goodwill to 6430, Comeback to Comeback Expense. Suitable accounts are reused, missing ones created, a number conflict is resolved at a free number and mapped, valid mappings are preserved, and every run is idempotent. New workspaces get the same set from the chart seeder. Existing ones get it from an operator command with per-workspace isolation and a `--verify` mode. |
| S6-R3 | Nothing new: category rows take any account, like every row. |
| S6-R4, S8-N2 | Saving a mapping, or opening or creating a fiscal period, re-runs held events automatically. |
| S6-E1 | Defensive inactive-account hold (§0.8). |
| S8-R1, S8-R5 | `invoice_created` v4 Closed path: an `Invoice` with status `closed`, no entry, no lines, no tax and **no revenue resolution**. It stores classification, category, original work order, line and technicians, work order number, asset, work-order id and cycle. A v1–v3 replay keeps its old behavior. |
| S8-R2, S8-R3, S10-R4 | Parts-cost, reclass and shop-supplies entries post from `journal_entry_requested` v3 with the category row as the expense leg. Source "Internal work order" or "No-charge work order", linked to the record by core ids. Vendor bill and credit lines of a work order or line that is already internal or no charge post straight to the category row inside the bill or credit's own entry (`vendor_bill_created` v4, `vendor_bill_updated` v3, `vendor_credit_created` v4; T4), linked to the record by work order and cycle. |
| S8-R7, S12-R7, S12-R8 | A billable v4 invoice posts as today and stores a "No Charge lines" block. Each no-charge line's parts cost posts from v3 entries (scope `line`) to that category's row. An empty row holds those entries; the invoice, revenue and receivable still post (Q30 ✓). Source "No Charge line" (Q50 ✓). |
| S8-R4, S4-E1, S8-E2, S4-E2 | Reversal by reference through `reverses_source_id`. A reversal whose original is Held withdraws it (Dismissed, "Withdrawn: work order reopened", D38). A reversal dated into a closed or missing period is Held. |
| S4-R3 | One work order's entries are serialized and ordered by cycle. A later Close waits while an earlier cycle's entry is Held. Withdrawn rows are never retried. |
| S8-N2 | New status `AccountingEventStatus::Held` with reason and message. The message is acknowledged and parked, so the organization's stream keeps flowing. Retry covers Held. |
| S8-R6 | `InvoiceStatus::Closed` stays out of the Invoice List default, which is already a whitelist. The Sales Invoices Status filter offers Closed. No Classification filter in this version. |
| S8-E1 | Already covered by `ProcessedEventLedger` plus the mirror-by-`shopview_id` check. Tests only. |

**Out of scope:** Story 11, everything QuickBooks, and core's emission code. What the hub needs from core is listed in §7.

---

### 2. Release shape (expand/contract)

The hub casts each of these columns to a PHP enum:
- `Invoice.status`
- `AccountingEvent.status`
- `AccountingEvent.event_type` (`app/Models/AccountingEvent.php:109`)
- `JournalEntry.source_type`

An image that does not know a value throws a `ValueError` as soon as it reads a row carrying it, for example on the event log, which loads every status and type. A rollback is a redeploy of the previous image (`CLAUDE.md`, Migrations). So the first rows carrying a new value must be written by a release whose **predecessor already knows it**.

**Release A, "expand".** No behavior change for core traffic.
- Adopts the contracts package that carries the six new schema versions (§0.4, §7 C1).
- Adds the enum cases and every schema migration (new tables, nullable columns).
- Ships the category catalog processor.
- Core emits nothing new while A is the newest release in production, so A rolls back cleanly.

**Release B, "writers".** Supports `invoice_created` v4, `journal_entry_requested` v3, `vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4. Ships the Closed path, the cost-entry family, direct bill and credit lines with their deferred moves, Held, ordering, withdraw, auto-release, the read side and seeding. Rolling B back to A is safe, because A knows every value B writes.

Core raises the six emitted versions together, and only after B is in production (D52, §7). T5 covers the single-release alternative.

---

### 3. Phases

#### Phase A0 — contract adoption (Release A)

**Prerequisite:** the hub has adopted the core contract versions published after 1.9.0, up to 1.11.0 (other teams' work).

1. `composer update shopview/accounting-contracts` to the Internal Work Orders version (expected 1.12.0, published by core PR-C1, §7). `composer.lock` names the commit, and `ContractsPackageTest` guards `vendor/`.
2. `resources/accounting-contract-support.json`: add `"work_order_category_upserted": [1]`.
3. `tests/Contracts/ContractSchemaTest.php` `PUBLISHED_NOT_YET_CONSUMED` (currently at `:88-93`): add `'invoice_created' => [4]`, `'journal_entry_requested' => [3]`, `'vendor_bill_created' => [4]`, `'vendor_bill_updated' => [3]` and `'vendor_credit_created' => [4]`.

#### Phase A1 — enums (Release A)

**`app/Enums/InvoiceStatus.php`**: add `case Closed = 'closed';`. Docblock: "Closed: an internal or no-charge work order's record. Nothing posted, nothing owed, never payable. Voided on Reopen like any invoice."

Every existing consumer is a positive whitelist, so Closed drops out with no edit:

| Consumer | Effect on Closed |
|---|---|
| `app/Services/Reports/InvoiceListReport.php:48` (default Posted, PartiallyPaid, Paid) | Excluded |
| `app/Services/Dashboard/DashboardSummary.php:327-329`, `app/Services/Reports/CustomerRevenueContributionQuery.php:74`, `app/Services/Reports/CollectionsReport.php:43`, `app/Services/Parties/PartyActivitySummary.php:66` | Excluded |
| `app/Services/CustomerPayments/CustomerPaymentApplier.php:170`, `app/Api/CustomerPaymentController.php:160` | Not payable |
| `app/Services/Reports/HistoricalOpenItems.php:143` (`!= draft` and open balance) | Balance is 0, so excluded |
| `app/Console/Commands/CheckDocumentJournalEntries.php:106` (`total <> 0`) | Not reported as an orphan |

Explicit guards are still added in B7, because they state intent.

**`app/Enums/AccountingEventStatus.php`**: add `case Held = 'held';` (fits `status varchar(16)`). State-machine docblock:

```
processing → held       (a holdable refusal on a work-order cost entry: unmapped/inactive row, closed/missing period,
                         or an earlier cycle of the same work order still held)
held → processing       (Retry, auto-release, a resend from core)
held → dismissed        (withdrawn by its reversal, S4-E1 — failure_code 'withdrawn'; never retried, S4-R3)
```

**`app/Enums/JournalEntrySource.php`**:
- Add `case InternalWorkOrder = 'internal_work_order';`, `case NoChargeWorkOrder = 'no_charge_work_order';` and `case NoChargeLine = 'no_charge_line';`.
- Add a helper `public static function shopviewJournalFamily(): array` that returns `[ShopviewJournal, InternalWorkOrder, NoChargeWorkOrder, NoChargeLine]`. The idempotency and reverse-by-reference lookups span all four.
- `JournalEntrySourceGroup::System` derives from `cases()`, so the entry list tabs pick the new cases up.

**`app/Enums/AccountingEventType.php`**:
- Add `case WorkOrderCategoryUpserted = 'work_order_category_upserted';`.
- Add it to `isCatalogData()` (`:231-247`). The gate then admits it for a workspace that exists but has not gone live, so accountants can map ahead, as for the other catalogs.

**New `app/Enums/AccountingEventHoldReason.php`**. Stored as a plain string and **not cast**, like `failure_code` (`app/Models/AccountingEvent.php:120-121`), so it survives a rollback. The message is rendered at read time, so a renamed category shows its current name.

```php
enum AccountingEventHoldReason: string
{
    case CategoryUnmapped = 'category_unmapped';         // context: {category_key, list, name, kind}
    case CategoryInactive = 'category_inactive';         // context: {category_key, list, name, kind, account_id}
    case MappingMissing = 'mapping_missing';             // context: {mapping_key} — inventory_asset | cogs_parts | expense_shop_supplies
    case MappingInactive = 'mapping_inactive';           // context: {mapping_key, account_id}
    case PeriodClosed = 'period_closed';                 // context: {fiscal_period_id, period_name}
    case PeriodMissing = 'period_missing';               // context: {date}
    case WaitingOnEarlierCycle = 'waiting_on_earlier_cycle'; // context: {work_order_number, blocking_event_id}

    /** The S8-N2 sentence the Accounting Events page shows verbatim. */
    public function message(array $context, ?string $currentCategoryName = null): string
    {
        return match ($this) {
            // Q50 ✓ — the row label of S6-R1 ("No Charge: Warranty row not mapped"), because names are unique only within a list.
            self::CategoryUnmapped, self::CategoryInactive => self::rowLabel($context, $currentCategoryName).' row not mapped',
            self::MappingMissing, self::MappingInactive => self::keyLabel($context['mapping_key']).' is not mapped',
            self::PeriodClosed => "Period {$context['period_name']} is closed",
            self::PeriodMissing => "No open fiscal period covers {$context['date']}.",   // the hub's existing wording
            // Q50 ✓
            self::WaitingOnEarlierCycle => "Waiting for an earlier held entry of work order {$context['work_order_number']}",
        };
    }
    // rowLabel(): "Internal: <name>" | "No Charge: <name>"
    // keyLabel(): inventory_asset → "Inventory asset", cogs_parts → "Parts cost of goods sold",
    //             expense_shop_supplies → "Shop supplies expense"
}
```

The inactive cases show the "not mapped" reason: S8-N2 (v0.22) gives one reason list for an account that is "missing or inactive", and §0.8 makes the state unreachable through the UI.

**`app/Enums/AccountingEventFailureCode.php`**. Uncast on the model.
- `case ContractInvariant = 'contract_invariant';`: a schema-valid v4 or category payload can still break an invariant (B1, A3).
- `case Withdrawn = 'withdrawn';`: a Dismissed row withdrawn by its reversal (B5).

**New `app/Enums/WorkOrderCategoryList.php`** (`internal`, `no_charge`) and **`app/Enums/CostKind.php`** (`parts`; a later `labor` adds a case and rows, not a contract change). Both are cast only on the new tables, which no older image reads.

#### Phase A2 — migrations (Release A)

All additive: new tables or nullable columns, written by nothing until B except the A3 processor. MySQL 8.4 adds nullable columns INSTANT, and secondary indexes build online. Take the next free date prefix at implementation time.

1. **`database/migrations/2026_11_xx_000001_create_work_order_categories_table.php`**: the catalog mirror (D49, D53).

   ```php
   Schema::create('work_order_categories', function (Blueprint $t): void {
       $t->uuid('id')->primary();
       $t->foreignUuid('workspace_id')->constrained()->cascadeOnDelete();
       $t->string('category_key', 64);             // D50: general_internal|warranty|goodwill|comeback, or c_<32 hex>
       $t->string('shopview_category_id', 64)->nullable();   // core id; null for a row seeded before core's upsert arrived
       $t->string('list', 16);                     // internal | no_charge — immutable per key
       $t->string('name', 100);
       $t->boolean('is_archived')->default(false);
       $t->boolean('is_default')->default(false);
       $t->boolean('requires_original_work_order')->default(false);
       $t->timestamp('source_changed_at')->nullable();   // stale guard for replayed upserts
       $t->timestamps();
       $t->unique(['workspace_id', 'category_key']);
       $t->index(['workspace_id', 'list', 'is_archived']);
   });
   ```

2. **`…_000002_create_work_order_category_account_mappings_table.php`**: one row per category per kind. A null `account_id` **is** the empty row. Rows are never deleted.

   ```php
   Schema::create('work_order_category_account_mappings', function (Blueprint $t): void {
       $t->uuid('id')->primary();
       $t->foreignUuid('workspace_id')->constrained()->cascadeOnDelete();
       $t->foreignUuid('work_order_category_id')->constrained('work_order_categories')->cascadeOnDelete();
       $t->string('category_key', 64);
       $t->string('kind', 16)->default('parts');
       $t->foreignUuid('account_id')->nullable()->constrained('accounts')->nullOnDelete();   // part-category precedent
       $t->timestamps();
       $t->unique(['workspace_id', 'category_key', 'kind']);
   });
   ```

3. **`…_000003_add_work_order_fields_to_invoices.php`**

   ```php
   Schema::table('invoices', function (Blueprint $t): void {
       $t->string('classification', 9)->nullable()->after('status');        // billable|internal|no_charge; NULL = pre-v4, read as billable
       $t->string('work_order_number', 64)->nullable()->after('customer_po');
       $t->string('shopview_work_order_id', 64)->nullable()->after('work_order_number');
       $t->unsignedSmallInteger('work_order_cycle')->nullable()->after('shopview_work_order_id');
       $t->string('shopview_asset_id', 64)->nullable()->after('work_order_cycle');   // core vehicle id
       $t->string('asset_display', 255)->nullable()->after('shopview_asset_id');
       $t->string('category_key', 64)->nullable()->after('asset_display');
       $t->string('category_name', 100)->nullable()->after('category_key');   // snapshot at Close; read side prefers the current name
       $t->json('work_order_context')->nullable()->after('category_name');     // original work order / line / technicians — display only
       $t->index(['workspace_id', 'shopview_work_order_id', 'work_order_cycle'], 'invoices_ws_wo_cycle_idx');
   });
   ```

   `shopview_*` columns are exempt from the identifier check (`tests/Unit/Architecture/IdentifierConventionTest.php:190-197`). No backfill: there is nothing to derive these from for pre-v4 rows.

4. **`…_000004_create_invoice_no_charge_lines_table.php`**: the S8-R7 block. The hub writes no `invoice_lines` row for a $0 statement or item (`InvoiceCreatedProcessor.php:480-485, 531`), so the block needs its own rows.

   ```php
   Schema::create('invoice_no_charge_lines', function (Blueprint $t): void {
       $t->uuid('id')->primary();
       $t->foreignUuid('workspace_id')->constrained()->cascadeOnDelete();
       $t->foreignUuid('invoice_id')->constrained('invoices')->cascadeOnDelete();
       $t->string('shopview_work_order_line_id', 64);
       $t->string('line_number', 16);
       $t->string('title', 255);
       $t->string('category_key', 64);
       $t->string('category_name', 100);
       $t->json('original')->nullable();
       $t->decimal('hours', 10, 2);
       $t->decimal('parts_cost', 15, 2);
       $t->timestamps();
       $t->unique(['invoice_id', 'shopview_work_order_line_id']);
   });
   ```

5. **`…_000005_create_work_order_cost_entries_table.php`**: links each cost entry to its work order, cycle, record and line by **core ids**. A deferred move (B2b) can post before any record exists, so there is no FK to `invoices`. The hot `journal_entries` table stays untouched (T3).

   ```php
   Schema::create('work_order_cost_entries', function (Blueprint $t): void {
       $t->uuid('id')->primary();
       $t->foreignUuid('workspace_id')->constrained()->cascadeOnDelete();
       $t->foreignUuid('journal_entry_id')->unique()->constrained('journal_entries')->restrictOnDelete();
       $t->string('shopview_work_order_id', 64);
       $t->unsignedSmallInteger('work_order_cycle');
       $t->string('shopview_invoice_id', 64)->nullable();
       $t->string('shopview_work_order_line_id', 64)->nullable();
       $t->string('scope', 16);         // work_order | line
       $t->string('entry_kind', 24);    // stock_parts | shop_supplies | bill_reclass | billable_back | credit_reclass | credit_back | credit_return (Issue Credit restock of a no-charge line's part, core D69: Dr inventory_asset / Cr the category)
                                        // | deferred_bill_line | deferred_credit_line (hub-originated, B2b; not in core's JE v3 enum: never passed through PayloadContractValidator, which runs only in SqsAccountingEventConsumer; Replay and Retry never revalidate them)
       $t->string('category_key', 64);
       $t->string('cost_kind', 16);
       $t->timestamps();
       $t->index(['workspace_id', 'shopview_work_order_id', 'work_order_cycle'], 'woce_ws_wo_cycle_idx');
       $t->index(['workspace_id', 'shopview_invoice_id'], 'woce_ws_invoice_idx');
   });
   ```

6. **`…_000006_add_hold_columns_to_accounting_events.php`**

   ```php
   $t->string('hold_reason', 32)->nullable()->after('failure_code');
   $t->json('hold_context')->nullable()->after('hold_reason');
   $t->timestamp('held_at')->nullable()->after('hold_context');
   // The payload source_id of the held entry, so a reversal finds a held original without a JSON scan (B5).
   $t->string('hold_subject', 64)->nullable()->after('held_at');
   $t->index(['workspace_id', 'status', 'hold_reason']);
   $t->index(['workspace_id', 'hold_subject']);
   ```

   - **Invariant**, stated in the docblock like the lease migration's: the hold columns are non-null **iff** `status = held`.
   - The per-work-order chain uses the existing `source_type`/`source_id` pair and the existing index `events_ws_type_source_idx (workspace_id, event_type, source_type, source_id)` (`database/schema/mysql-schema.sql:136`), filled in B3.
   - `accounting_events_archive` needs nothing: `AccountingEventArchiver` copies an explicit column list and archives only Completed rows (`app/Services/AccountingEvents/AccountingEventArchiver.php:14-20, 53`).

7. **`…_000007_add_work_order_fields_to_vendor_document_lines.php`**: which work order, cycle and line a bill or credit line belongs to (T4(b)), so the record's journal entry section and `closed_summary` find direct lines (B6). Both tables already store the account each line posted to (`account_id` NOT NULL, `database/schema/mysql-schema.sql:3326, 3454`).

   ```php
   foreach (['vendor_bill_lines', 'vendor_credit_lines'] as $table) {
       Schema::table($table, function (Blueprint $t) use ($table): void {
           $t->string('shopview_work_order_id', 64)->nullable();
           $t->unsignedSmallInteger('work_order_cycle')->nullable();
           $t->string('shopview_work_order_line_id', 64)->nullable();
           $t->string('category_key', 64)->nullable();   // set only when the line posted to the category row; a deferred line keeps NULL (B2b)
           $t->index(['workspace_id', 'shopview_work_order_id', 'work_order_cycle'], "{$table}_ws_wo_cycle_idx");
       });
   }
   ```

**Models:**
- `app/Models/WorkOrderCategory.php`, `WorkOrderCategoryAccountMapping.php` (casts `kind` to `CostKind`), `InvoiceNoChargeLine.php`, `WorkOrderCostEntry.php`: each with `BelongsToWorkspace` and `HasUuids`.
- `app/Models/Invoice.php`: `#[Fillable]` gains the new columns, plus `@property` lines and `isClosed(): bool`.
- `app/Models/VendorBillLine.php`, `VendorCreditLine.php`: `#[Fillable]` and `@property` gain the A2.7 columns.

#### Phase A3 — category catalog (Release A)

**New `app/Services/AccountingEvents/Processors/WorkOrderCategoryUpsertedProcessor.php`**, registered in `app/Services/AccountingEvents/EventProcessorRegistry.php`.

```php
/**
 * Mirrors one core category (D49) and guarantees its mapping row exists.
 * Full state every time; never touches account_id — the accountant owns it.
 *
 *  - upsert work_order_categories by (workspace, category_key): name, flags, shopview_category_id
 *  - ignore the payload when changed_at < source_changed_at (a replay must not revert a rename)
 *  - a different `list` for an existing key → WorkOrderCategoryContractError (Permanent, contract_invariant)
 *  - ensure work_order_category_account_mappings (category_key, 'parts') exists, account_id NULL when new
 *  - archive/restore flip is_archived only; the mapping row and its account stay (S6-R1, S1-R16)
 */
```

- New exception `app/Exceptions/Accounting/WorkOrderCategoryContractError.php` (a subclass of `PermanentEventProcessingError`, `reasonCode() = 'contract_invariant'`).
- **`app/Services/Reconciliation/ReconciliationEventCategories.php`**: the exhaustive match (`:28-35, 60-100`) gets `WorkOrderCategoryUpserted => null`, like the other catalogs.
- **`app/Services/Accounts/AccountUsageInspector.php`** (`:75-76, 180-200`): category mapping rows block deactivation with "category mapping '<list>: <name>'", keeping S6-E1 unreachable through the UI (§0.8).

**Tests (A):**
- `tests/Feature/Migrations/InternalWorkOrderSchemaTest.php`: the tables, columns and indexes exist, and the new enum values round-trip through the casts.
- `tests/Feature/AccountingEvents/WorkOrderCategoryUpsertedProcessorTest.php`:
  - a create gives a catalog row plus an empty `parts` row;
  - a rename keeps the account;
  - archive, then restore, keeps the account;
  - a stale `changed_at` is ignored;
  - a `list` change gives Failed `contract_invariant`, and the consumer acknowledges it;
  - the event is admitted for a workspace that has not gone live;
  - a foreign workspace is untouched.
- `tests/Feature/AccountingEvents/ContractConsumerCoverageTest.php` and `tests/Contracts/ContractSchemaTest.php`: green with the new package.
- `tests/Feature/Api/AccountingEventEndpointsTest.php`: `status_options` contains `held`.
- An `AccountUsageInspector` test: deactivating an account a category row maps is refused with the category label.

#### Phase B0 — contract support (Release B, first commit)

`resources/accounting-contract-support.json`: `"invoice_created": [1, 2, 3, 4]`, `"journal_entry_requested": [1, 2, 3]`, `"vendor_bill_created": [1, 2, 3, 4]`, `"vendor_bill_updated": [1, 2, 3]` and `"vendor_credit_created": [1, 2, 3, 4]`. Empty `PUBLISHED_NOT_YET_CONSUMED` of all five. `ContractVersionRegistryTest` and `ContractSchemaTest` then require the processors below (B1, B2, B2b).

#### Phase B1 — `invoice_created` v4 (S8-R1, S8-R5, S8-R7)

File: `app/Services/AccountingEvents/Processors/InvoiceCreatedProcessor.php` (`processWithinWorkspace()` at `:246`, `persistInvoiceMirror()` at `:1325`).

**Version detection by shape**, following the v2 `customer_po` and v3 `adjustments` precedent, because the event row stores no version: `array_key_exists('classification', $payload)` means v4.

**New value object `app/Services/AccountingEvents/Processors/InvoiceV4Fields.php`** (readonly, `fromPayload(): ?self`). It reads `classification`, `status`, `work_order_number`, `work_order_id`, `work_order_cycle`, `asset`, `posting_date`, `category`, `original` and `no_charge_lines`. All are null or empty on v1–v3.

Insert after `upsertLocationSnapshot()`, **before** the opening-balance branch and before `deriveTotals()` / `resolveLines()`:

```php
$v4 = InvoiceV4Fields::fromPayload($payload);

if ($v4?->isClosed()) {
    return $this->processAsClosedRecord($payload, $v4, $customer, $location);
}
```

```php
/**
 * §CLOSED RECORD (Internal Work Orders, S8-R1). A closed internal or
 * no-charge work order: a record, not a sale. NO journal entry, NO lines,
 * NO tax — and, unlike §ZERO-VALUE, NO revenue resolution, so a workspace
 * with an unmapped revenue row still mirrors it. Its cost reaches the ledger
 * as journal_entry_requested v3 entries (JournalEntryRequestedProcessor
 * §WORK ORDER COST), found by (work_order_id, cycle).
 *
 * Replays: a v1–v3 payload has no `classification` and takes the ordinary
 * path, byte-identical to before (S8-R5 holds because core never emits an
 * internal invoice below v4 — §7 C5).
 */
private function processAsClosedRecord(array $payload, InvoiceV4Fields $v4, Customer $customer, ?Location $location): ?JournalEntry
{
    $this->assertV4Invariant($payload, $v4);   // throws ClosedInvoiceContractError (Permanent, contract_invariant)
    $this->categories->ensureFromSnapshot($v4->category);   // self-heal, see B2

    $this->persistInvoiceMirror(
        $payload, InvoiceTotals::zero(), $customer, $location,
        resolved: [], entry: null, resolvedTaxes: [],
        status: InvoiceStatus::Closed, v4: $v4,
    );

    return null;   // the EventProcessor contract allows it; the job marks Completed
}
```

**`assertV4Invariant`** (D48). Anything else is `app/Exceptions/Accounting/ClosedInvoiceContractError.php` (a `PermanentEventProcessingError` subclass, `reasonCode() = 'contract_invariant'`). The message is acknowledged on its first receive, the row is Failed and visible, and the stream is not blocked. Booking it silently would turn free work into revenue. The invariant:
- `status = closed` ⇔ `classification ≠ billable` ⇔ `category ≠ null`;
- on Closed, `is_opening_balance` is false, and `total_balance`, `subtotal_with_tax` and `shop_supplies_charge` are all `"0.00"` (bccomp), with `no_charge_lines = []`;
- `no_charge_lines ≠ []` only when `classification = billable`, and each line's category is on the `no_charge` list.

**`persistInvoiceMirror()`** gains `InvoiceStatus $status = InvoiceStatus::Posted` and `?InvoiceV4Fields $v4 = null`.
- For **every** v4 invoice, billable included, it writes the §A2.3 columns. `work_order_context` holds `{original_work_order, original_line, original_technicians}` from `original`.
- On Closed it writes `total = subtotal = tax_total = balance_due = amount_paid = 0.00`.

**A billable v4** takes the existing path unchanged, plus the columns. When `no_charge_lines` is non-empty it writes one `invoice_no_charge_lines` row per line, in the same transaction, and self-heals each line's category.
- The line's statement arrives priced `"0.00"` with `labor_rate "0.00"` (D48), so the existing zero-line handling drops it from the entry.
- The revenue-resolution precondition for $0 lines is unchanged from today (§0.1).

**Unchanged behavior:**
- Idempotency (`Invoice::whereShopviewId()->first()`, S8-E1).
- Ghost-number freeing: re-closing after Reopen creates a new core invoice id, and FIFO delivers the old record's `invoice_voided` first, so `VoidedInvoiceNumberSuffixer` frees the number.

**Tests:**
- `tests/Feature/AccountingEvents/InvoiceClosedRecordTest.php`:
  - A v4 internal fixture (from the package: `coreContractSchemasDir()/../fixtures/invoice_created.v4.json`, classification set to `internal`) gives one Closed invoice carrying classification, category, work-order id and cycle, number, asset and `work_order_context`, with `journal_entry_id = null`, zero lines and zero taxes. The event is Completed and the processed-events row is written.
  - The same with **no revenue mappings**: still Completed.
  - The period is closed: still Completed (nothing posts).
  - `no_charge` with a `warranty` category.
  - An unknown category key self-heals the catalog row and an empty mapping row.
  - Each invariant breach gives Failed `contract_invariant`, no `Invoice` row, and the message acknowledged (consumer harness as in `UnmirroredDocumentRejectionTest`).
  - Redelivery and a replay under a new event id create no second row.
  - **S8-R5:** a v3 payload with zero totals on a fresh workspace gives `status = posted`, `classification = null`.
  - A billable v4 posts exactly the entry the same v3 payload posts (snapshot-compare lines) and writes its `invoice_no_charge_lines`.
- `tests/Feature/AccountingEvents/InvoiceVoidedProcessorTest.php`: voiding a Closed record sets Void, posts nothing, returns null and frees the number. Voiding a billable record keeps its no-charge block.
- `tests/Contracts/ContractSchemaTest.php`: v4 consumed; the fixture validates.

#### Phase B2 — work-order cost entries, `journal_entry_requested` v3 (S6-R1, S8-R2, S8-R3, S8-R7, S10-R4)

**New `app/Services/AccountingEvents/WorkOrderCostEntries.php`**: one policy class, used by the processor and the hold machinery.

```php
final class WorkOrderCostEntries
{
    public const string CATEGORY_KEY = 'work_order_category_expense';   // reserved line key (D47); never an AccountMappingKey

    /** A core entry belongs to the family when it carries the `work_order` block. */
    public static function isFamily(array $payload): bool { return is_array($payload['work_order'] ?? null); }

    /** The source it posts under: scope line → NoChargeLine; otherwise by the category's list. */
    public static function sourceFor(array $payload): JournalEntrySource
    {
        $wo = $payload['work_order'];
        return match (true) {
            $wo['scope'] === 'line' => JournalEntrySource::NoChargeLine,
            $wo['category']['list'] === 'internal' => JournalEntrySource::InternalWorkOrder,
            default => JournalEntrySource::NoChargeWorkOrder,
        };
    }
}
```

**New `app/Services/Settings/WorkOrderCategoryAccountResolver.php`**

```php
/**
 * S6-R1: the account of one category row, or null when the row is empty.
 * No fallback to another row (S6-R1 "there is no fallback to another row").
 */
public function resolve(string $categoryKey, CostKind $kind): ?Account;

/** Self-heal (D49): an event naming a category this workspace has not seen yet
 *  creates its catalog row and an empty mapping row from the payload snapshot. */
public function ensureFromSnapshot(?array $category): void;
```

**`app/Services/AccountingEvents/Processors/JournalEntryRequestedProcessor.php`** changes:

1. A class-docblock section **§WORK ORDER COST**: the v3 block, the reserved key, source types, the cost-entry link, holds, the chain, and withdraw.
2. In `run()`:
   - Compute `$family = WorkOrderCostEntries::isFamily($payload)`.
   - The idempotency guard (`:127-133`) and `reverseReferencedEntry()` (`:263-267`) use `whereIn('source_type', JournalEntrySource::shopviewJournalFamily())`. `source_id` is a core UUID; the widened guard plus `ProcessedEventLedger` stay authoritative, because the `(workspace_id, source_type, source_id)` unique no longer spans the family. Say so in the comment.
   - For a forward family entry (`reverses_source_id = null`), call `WorkOrderCostChain::assertNoEarlierHeld()` first (B3).
   - Call `$this->categories->ensureFromSnapshot($payload['work_order']['category'])` before resolution.
   - `sourceType:` becomes `$family ? WorkOrderCostEntries::sourceFor($payload) : JournalEntrySource::ShopviewJournal`.
3. **`resolveAccountId()`** (`:548-595`):
   - A line keyed `work_order_category_expense` resolves through `WorkOrderCategoryAccountResolver::resolve($block['category']['category_key'], CostKind::from($block['cost_kind']))`.
   - For **family entries only**, an empty or inactive account on **any** leg throws `HoldableEventProcessingError`: `::categoryUnmapped(...)` / `::categoryInactive(...)` for the category leg, and `::mappingMissing($key)` / `::mappingInactive(...)` for `inventory_asset`, `cogs_parts` and `expense_shop_supplies`. This replaces the generic `RuntimeException("Account not found…")` (`:159-168`).
   - Non-family behavior is untouched; billable flows behave exactly as today.
   - `cogs_parts` on a reclass or back leg keeps `CogsAccountResolver::forParts()` with the payload's `part_category_id` (`:560-567`). These legs exist only for a line its bill or credit posted on today's routing (S7-R4) or for the out-and-in halves of a move (C4). `CogsAccountResolver` is the resolver `BillCreatedProcessor` used for such a line, so the leg hits the account the line posted to while that mapping is unchanged (R6).
   - A line naming an `account_id` resolves to it directly (`:550-552`). The hub-originated deferred move (B2b) uses this to name the exact account its line posted to.
4. **`writer->writeAndPost()` and `writer->reverse()`** (`app/Services/JournalEntries/JournalEntryWriter.php:395, 138`): for family entries, catch `FiscalPeriodError` and `InactiveAccountError` and rethrow them as `HoldableEventProcessingError::periodClosed(...)`, `::periodMissing(...)` or `::categoryInactive/mappingInactive(...)`.
   - `app/Exceptions/Accounting/FiscalPeriodError.php` gains readonly `kind` (`closed`|`missing`), `?string $periodId`, `?string $periodName` and `?CarbonInterface $date`, filled by `noPeriodForDate()` and `periodClosed()` (`:11, 19`).
   - `lockOpenPeriod()` (`JournalEntryWriter.php:338`) already holds the period.
4b. **`credit_return`** (core D69, S12-E7): the Issue Credit restock of a no-charge line's part arrives as a family JE (scope `line`, its category): post Dr `inventory_asset` / Cr the category row (Held "… row not mapped" when empty, like any family entry); its void arrives as a reversal by reference. It mirrors, in sign, the line's `stock_parts` entry — the same entry a return on internal work uses (S12-E7).
5. **Link** (S8-R2, S8-R7, T3), in the same transaction, after the write: create one `WorkOrderCostEntry` from the v3 block (`work_order_id`, `cycle`, `invoice_id`, `work_order_line_id`, `scope`, `entry_kind`, `category_key`, `cost_kind`).
   - The Closed record and the billable record find their entries by `(shopview_work_order_id, work_order_cycle)` and by `shopview_invoice_id`.
   - An entry with no record yet (a deferred move before Close, B2b) has `invoice_id = null` and is still found by work order and cycle.
   - A reversal is found through `reversal_of_id`, not by its own row.
6. **Memo:** `buildMemo()` already appends `WO {n}` from `work_order_number`. Family entries also append the category, and the line number when `scope = line`, so the ledger drill-down answers "which job, which category".

#### Phase B2b — vendor bill and credit lines, `vendor_bill_*` v4/v3 and `vendor_credit_created` v4 (S7-R3, S7-R3a, S7-R8, S8-R3)

T4(b): a bill or credit line of a work order or line that is already internal or no charge posts straight to its category row, inside the bill's or credit's own entry. That entry is the line's only entry, as the PRD asks ("one entry per part"), and no reclass follows.

**The per-item key.** Each item carries a required, nullable `work_order` block (§7 C6). It is the JE v3 block without `invoice_id` and `entry_kind`, plus `work_order_number` for the memo and the Events page:

```
work_order: { work_order_id, work_order_number, cycle, scope: work_order|line, work_order_line_id|null,
              category { category_key, list, name }, cost_kind: "parts" } | null
```

- `work_order.category.category_key` picks the row in `work_order_category_account_mappings` (`kind = cost_kind`). The key is known before the bill arrives: per-organization FIFO delivers the category's `work_order_category_upserted` first (C7).
- `null` means today's routing: `is_purchase_order`, then `part_category_id`.
- The snapshot feeds `ensureFromSnapshot()`, as on JE v3. An unknown key therefore creates its catalog row and an empty mapping row and takes the deferred path below. **It never throws**, so it never stalls the stream. The snapshot never overwrites an existing catalog row, so a `list` that disagrees cannot fail a bill.

**Version detection by shape**, as in B1:
- An item with the key `work_order` is `vendor_bill_created` v4 or `vendor_bill_updated` v3.
- A credit payload with the key `items` is `vendor_credit_created` v4.
- Older payloads take today's path byte for byte, so a replay of a stored v3 bill books exactly what it booked.

**`BillCreatedProcessor::resolveLines()`** (`:371-451`). `BillUpdatedProcessor` reuses it (`BillUpdatedProcessor.php:95`), so one seam covers both versions:
- **An item with a block on a PartsCogs delivery:**
  - Call `ensureFromSnapshot()`, then `WorkOrderCategoryAccountResolver::resolve()`. The resolver reads the mapping row with a shared lock, so a concurrent mapping save either commits first (the line posts directly) or waits and then releases the move recorded below (B4).
  - **Mapped and active** gives the line's account. The line posts there (S7-R3, S7-R8 per line). `ResolvedBillLine` carries the block, and `persistLines()` writes the A2.7 columns, `category_key` included.
  - **Empty or inactive:** the line takes today's account (`cogsResolver->forParts()`, `:427-432`) and is marked **deferred** with `category_unmapped` or `category_inactive`. The A2.7 columns are written with `category_key = null`.
- **Everything else** routes as today: a null block, and a PartsInventory delivery (the schema allows a block only when `is_purchase_order = false`).

**`VendorCreditCreatedProcessor::buildLines()`** (`:208-258`), v4. `items` lists only the returned lines S7-R3a governs; `[]` is v3 exactly.
- **One line per item:**
  - With a block, the line posts to the category row. When that row is empty or inactive, it falls back to the `cogs_parts` account for `part_category_id` and is marked deferred, as on bills.
  - Without a block, the line posts to `CogsAccountResolver::forParts($item['part_category_id'])`. That is the account its bill line posted to on today's routing, the one a work-order delivery line takes (S7-R3a, "so the credit lands where the cost did").
- **The remainder,** `amount − tax − Σ items.amount`, posts on today's single parts line (`:231-240`) when it is above zero. The tax posts as today.
- **`Σ items.amount + tax > amount`** is a new `app/Exceptions/Accounting/VendorCreditContractError.php`: Permanent, `contract_invariant`, as in B1.
- `vendor_credit_lines` gets the A2.7 columns per item line.

**New `app/Services/AccountingEvents/DeferredCategoryMoves.php`**

```php
/**
 * §DEFERRED MOVE (T4(b), S8-N2). A bill or credit line whose category row is empty
 * or inactive posts where today's routing puts it, because a bill or credit is never
 * parked (§0.11). This records the move that finishes the job: one hub-originated
 * journal_entry_requested event per such line, in the bill's own transaction, written
 * directly as Held with the reason the line met. The processor already knows that
 * reason, so no job is dispatched. A mapping save releases it (B4); posting it gives
 * the books a direct post gives, in two entries instead of one, and only while the
 * row was empty.
 *
 *  - idempotency_key = payload source_id = UUIDv5(the bill or credit event id, item_id)
 *  - caused_by_event_id = the bill or credit event; correlation_id copied
 *  - source_type/source_id = ['work_order', work_order_id], so the B3 lock and chain apply
 *  - queue_settled_at = now (it never rides SQS); hold_subject = its source_id
 *  - payload in v3 shape: work_order_number, entry_date = bill_date (credit_date), the
 *    item's work_order block with entry_kind deferred_bill_line (deferred_credit_line),
 *    lines Dr work_order_category_expense / Cr account_id = the line's posted account,
 *    swapped for a credit line. account_id is exact, so nothing re-resolves (R6).
 *
 * unwind(VendorBill): withdraws the bill's Held moves (HeldEventWithdrawer, found from
 * the bill's own events through events_caused_by_idx) and reverses its posted ones,
 * in the caller's transaction. A move being processed is InFlight: the bill event
 * retries transiently, as a reversal does in B5.
 */
```

- `BillUpdatedProcessor` calls `unwind()` before its reversal (`BillUpdatedProcessor.php:138`), then re-resolves. A row mapped in the meantime posts directly; a row still empty records a new move.
- `BillVoidedProcessor` calls `unwind()` before `voider->void()` (`BillVoidedProcessor.php:77`).
- Credits have no amend or void event, so they need no unwind.
- **Source reference (D70, S8-R3 v1.0).** The move's payload also carries `source_document {kind: vendor_bill|vendor_credit, document_id, number, item_id, line_position, line_description}`, taken from the bill or credit the processor has just written. The hub writes this payload itself, so no contract changes. B3 (`AccountingEventData`) and B6 (`SourceDocumentResolver`) read it, and a replacement move after an amend carries the updated bill's reference.
- A deferred move has no core counterpart, so nothing is matched against it. It still shows in reconciliation (S8-R3 v1.0): B3's category-free Held section lists it with its source bill or credit (D70).
- Core's later entries for the line all name the category (C4, C6), and so does the move. They release together once the row is mapped, so the total is right in every order. A Held move and a Held back entry on a row that is never mapped net to zero.

#### Phase B3 — Held machinery and per-work-order order (S8-N2, S4-R3; no head-of-line stall)

**New `app/Exceptions/Accounting/HoldableEventProcessingError.php`**. It is not a `PermanentEventProcessingError`, because its disposition differs.

```php
/**
 * A refusal the OPERATOR can fix in the hub and that blocks nothing behind it
 * (S8-N2): an empty or inactive row, a closed or missing period, or an earlier
 * cycle of the same work order still held, on a work-order cost entry only. The
 * job parks the row as Held with a reason instead of failing it; the consumer
 * acknowledges the message so the organization's stream keeps moving; a mapping
 * save / period reopen / Retry / withdraw re-runs it. See §HELD in
 * SqsAccountingEventConsumer for why parking is safe for THIS family only.
 */
final class HoldableEventProcessingError extends RuntimeException
{
    public function __construct(
        public readonly AccountingEventHoldReason $reason,
        public readonly array $context,
        public readonly ?string $subject,   // the entry's payload source_id
    ) { parent::__construct($reason->message($context)); }
    // named constructors: categoryUnmapped, categoryInactive, mappingMissing, mappingInactive,
    //                     periodClosed, periodMissing, waitingOnEarlierCycle
}
```

**Per-work-order key.** `app/Services/AccountingEvents/EventIngestor.php::documentSource()` (`:191-216`, today the vendor-bill seam) maps a `journal_entry_requested` whose payload has a `work_order` block to `['work_order', $payload['work_order']['work_order_id']]`.
- Every family event of one work order then shares `accounting_events.source_type/source_id`.
- `ProcessAccountingEventJob::lockKey()` (`app/Jobs/ProcessAccountingEventJob.php:125-157`) serializes them through `WithoutOverlapping`, whichever path runs them: consumer, Retry, auto-release or withdraw. That is S4-R3's "one at a time".

**New `app/Services/AccountingEvents/WorkOrderCostChain.php`**: S4-R3's "in order". The order key is `(cycle, forward before reversal)` from the payload (D51), never a timestamp (§0.5).

```php
/**
 * R3: a FORWARD family entry of cycle N waits (Held, waiting_on_earlier_cycle)
 * while any family event of the same work order with cycle < N is Held. Siblings
 * of one cycle never wait on each other. Reversals never wait: a reversal either
 * withdraws a held original (B5) or reverses a posted one (and may itself be Held
 * for its own period). Query: events_ws_type_source_idx on
 * (workspace, journal_entry_requested, 'work_order', work_order_id), status = held.
 */
public function assertNoEarlierHeld(AccountingEvent $event, array $payload): void;
```

**`app/Jobs/ProcessAccountingEventJob.php`:**
- The atomic claim (`:253-282`, today `whereIn('status', [Pending, Failed])` at `:257`) also admits `Held`. The same UPDATE clears `hold_reason`, `hold_context`, `held_at` and `hold_subject`. That gives single-winner semantics against withdraw (B5).
- A new catch, **before** `catch (Throwable $e)` (`:512`) and after `EventAlreadyProcessedError` (`:477`):

  ```php
  } catch (HoldableEventProcessingError $e) {
      // The transaction rolled back — the ledger claim included — so a later
      // attempt claims and posts cleanly. Builder, not $event->update(), for the
      // same rolled-back-model reason as the Throwable arm.
      AccountingEvent::withoutGlobalScope(WorkspaceScope::class)->where('id', $event->id)->update([
          'status' => AccountingEventStatus::Held,
          'error_message' => $e->getMessage(),
          'hold_reason' => $e->reason->value,
          'hold_context' => json_encode($e->context, JSON_THROW_ON_ERROR),
          'held_at' => now(),
          'hold_subject' => $e->subject,
          ...self::RELEASED_LEASE,
      ]);
      Log::warning('Accounting event held (status)', [...]);
      $this->audit->log('accounting_events', $event->id, AuditAction::Update, ['status' => 'held', 'hold_reason' => $e->reason->value]);
      return;   // a disposition, not a failure: must not burn $tries or reach failed()
  }
  ```

- A `CLEARED_HOLD` constant beside `RELEASED_LEASE` (`:94`), spread into every transition out of `processing`.

**`app/Services/AccountingEvents/Sqs/SqsAccountingEventConsumer.php`:**
- A class-docblock section **§HELD** as a second carve-out next to SV-9844 (`:99-110`), arguing against the "never parked" rule (`:79-97`). A held cost entry has exactly two kinds of dependents:
  - its reversal, which resolves by withdrawing it (B5);
  - later-cycle forward entries of the same work order, which wait for it (R3).

  A deferred move (B2b) also has its own bill's amend and void, which unwind it inside the bill's own processing. No invoice, payment or credit references a cost entry, and no other bill reaches one. Letting the group continue therefore cannot produce the "quietly wrong books" §3 warns about. The hold stays loud: Events page, metric, audit, reconciliation bucket.
- After `dispatchSync` and before the Completed guard:

  ```php
  if ($event->refresh()->status === AccountingEventStatus::Held) {
      $this->acknowledge($message, 'held — the event is parked as Held with its reason and re-runs locally when the cause is fixed', $result, $envelope->organizationId);
      $this->settle($event, AccountingEventStatus::Held);
      $result->held++;
      return;
  }
  ```

  This goes through the single `acknowledge()` site, so `tests/Unit/Architecture/SingleAckSiteTest.php` still counts one `queue->delete(` (`:856`). Its docblock's list of reasons (`:776`) grows from four to five. A Held message does **not** add its group to `$blockedGroups`.
- `settle()` (`:1217`) accepts Held. `app/Services/AccountingEvents/Sqs/AccountingEventBatchResult.php` gets `public int $held = 0;`. `app/Services/AccountingEvents/AccountingConsumerMetrics.php` emits the `held` disposition, tagged with `event_type` and `hold_reason`.

**Other files:**
- **`EventIngestor.php:139-144`**: `AccountingEventStatus::Held => true`, so a resend from core re-applies it, like Failed.
- **`AccountingEventReplayer.php`**: the Pending reset also nulls the hold columns; Held is an accepted start state; Processing and Completed are still refused. **A Dismissed row with `failure_code = withdrawn` is refused** ("withdrawn by its reversal; never retried", S4-R3; HQ6 ✓).
- **`app/Api/AccountingEventController.php::retry`** (`:145-147`) accepts Failed or Held. Anything else gets 422 "Only failed or held events can be retried." The answer is the refreshed event (Completed, or Held again with the latest reason), audited as today. `app/Console/Commands/ReplayAccountingEvent.php` accepts Held and refuses withdrawn rows.
- **`app/Data/AccountingEventData.php`**:
  - `can_retry` (`:56`) is `$canManage && in_array($status, [Failed, Held])`, never Dismissed.
  - New fields: `hold_reason`, `hold_message` (rendered at read time with the current category name), `held_at`, and `work_order {number, classification}|null` from the payload. Design frame 5/4 shows "Work order closed · S2-34918 · Internal".
  - For a deferred move only (D70, S8-R3 v1.0): `source_document` = the full `SourceDocumentData` shape built with `SourceDocumentData::owner()` (the shape the port's `AccountingSourceDocument` type and `accountingSourceDocumentRoute()` already take; label "Vendor bill [number], line [n]" / "Vendor credit [number], line [n]") and `source_line {position, description}|null`, from the payload's source reference. The list reads them with a JSON extract in the select, so the full payload stays show-only.
- **`app/Services/Reconciliation/ReconciliationRunner.php`** and **`ReconciliationRemediator.php`** (S8-N2; S8-R3 v1.0 "the move shows in reconciliation"; D70): every Held row is a `journal_entry_requested` family entry (HQ7), and `ReconciliationEventCategories::categoryFor()` gives that type no category (`:83`), so the per-category buckets (`blockingByCategory()` `:794-810`, `dismissedByCategory()` `:731`) never see it. A per-category `heldByCategory()` would always be empty. Instead the runner adds one category-free section, **`held_awaiting_operator`**, read straight from `status = held` (not through `blockingByCategory()`): counts by `hold_reason` and by kind (Close, reversal, no-charge line, vendor bill or credit move), a capped sample of event ids, and for a move its source document label ("Vendor bill [number], line [n]"). The same section counts the family's withdrawn rows (Dismissed, `failure_code = withdrawn`) with their `dismissal_reason`. It is recorded on the `ReconciliationRun` like the other sections, and the remediator never acts on it: an operator maps the row or opens the period, and B4 releases the entry. A Held row is neither in flight nor blocking.

#### Phase B4 — automatic release (S6-R4, S8-N2)

**New `app/Jobs/ReleaseHeldAccountingEventsJob.php`**: queued, dispatched `afterCommit` (precedent: `app/Jobs/ProcessObjectImportRunJob.php:76`), with `WithoutOverlapping("release-held:{$workspaceId}")`.

```php
public function __construct(public readonly string $workspaceId, public readonly HoldTrigger $trigger) {}

public function handle(AccountingEventReplayer $replayer): void
{
    $held = AccountingEvent::withoutGlobalScope(WorkspaceScope::class)
        ->where('workspace_id', $this->workspaceId)
        ->where('status', AccountingEventStatus::Held)
        ->whereIn('hold_reason', $this->trigger->reasons())                 // category_*|mapping_*|period_*|waiting_*
        ->when($this->trigger->periodId, fn ($q, $id) => $q->where('hold_context->fiscal_period_id', $id))
        ->when($this->trigger->workOrderId, fn ($q, $id) => $q->where('source_type', 'work_order')->where('source_id', $id))
        ->limit(self::BATCH)                                                 // 200; re-dispatch self when full
        ->get();

    // S4-R3: per work order, in chain order — (cycle, forward before reversal); then the rest by created_at, id.
    WorkOrderCostChain::orderForRelease($held)
        ->each(fn (AccountingEvent $e) => rescue(fn () => $replayer->replay($e)));   // still unfixable → Held again
}
```

**`app/Services/AccountingEvents/HoldTrigger.php`** is a readonly value object with `mappings()`, `period(FiscalPeriod)`, `periodCreated()` and `workOrder(string $workOrderId)`.
- Any mapping save releases every mapping and category hold of the workspace. That is cheap, and a row that still cannot post simply holds again.
- Waiting rows are included in every trigger, so a released earlier cycle lets later ones follow in the same run.

**Dispatch sites**, all after a successful commit:
- `app/Services/Settings/SystemAccountManager.php::apply()` (`:186`), when at least one system row **or category row** changed (B6).
- `app/Services/Workspace/AccountMappingManager.php::update()`.
- `app/Services/Workspace/FiscalPeriodManager.php::reopen()` (`:119`) with `HoldTrigger::period($period)`, plus the period-create path for `period_missing`.
- `HeldEventWithdrawer` (B5) and the job's success path for a family event whose work order still has later Held entries, with `HoldTrigger::workOrder($id)`.

#### Phase B5 — withdraw on Reopen and reversal (S4-E1, S4-R3, S8-E2, S8-R7, S4-E2)

In `JournalEntryRequestedProcessor::reverseReferencedEntry()` (`:257-305`), when no posted original exists (`$original === null`, `:269`), **before** the "posting its own lines" fallback (`:271-279`):

```php
$withdrawn = $this->withdrawer->withdrawUnposted($event, $reverses);   // HeldEventWithdrawer
if ($withdrawn === WithdrawOutcome::Withdrawn) {
    return null;   // S4-E1: nothing was posted, so nothing is reversed — this event completes as a no-op
}
if ($withdrawn === WithdrawOutcome::InFlight) {
    // The original is being posted right now (auto-release / Retry). Transient:
    // the next delivery finds it posted and reverses it normally.
    throw new RuntimeException("Original {$reverses} is being processed; retrying the reversal.");
}
// NotFound → pre-go-live original with no event at all: the existing fallback, unchanged
```

**New `app/Services/AccountingEvents/HeldEventWithdrawer.php`**. One conditional UPDATE, matched on `workspace_id`, `hold_subject = $reverses` and status in (`held`, or `failed` with a permanent `failure_code` for family entries), moving the row to `dismissed` with:
- `failure_code = 'withdrawn'`;
- `dismissal_reason` passed in by the caller (D70): "Withdrawn: work order reopened" for Reopen (S4-E1, D38), "Withdrawn: invoice [number] reversed" for an S8-R7 line entry when its billable invoice is reversed, "Withdrawn: vendor bill [number] amended" / "… voided" for a deferred move (B2b). The PRD gives copy only for Reopen; the other strings follow its pattern;
- `dismissed_by = null` (system) and `dismissed_at = now()`;
- the hold columns cleared;
- an audit row.

Then it dispatches `ReleaseHeldAccountingEventsJob(HoldTrigger::workOrder(...))`, so R3 waiters re-evaluate. Zero rows matched while a row with that subject is `processing` means InFlight. The same path withdraws an S8-R7 line entry when the billable invoice is reversed. It also serves `DeferredCategoryMoves::unwind()` (B2b), matched by the bill's events instead of by a reversal's subject.

Reusing Dismissed rather than a new status is T7. Dismissed rows already have `queue_settled_at` set; reconciliation counts the withdrawn ones in B3's category-free section, because its per-category buckets skip `journal_entry_requested`. The withdrawn marker is what keeps every retry path closed (B3).

**S4-E2** needs no extra code. When the original posted and the reversal date falls in a closed or missing period, `writer->reverse()` raises `FiscalPeriodError`, which becomes Held "Period [name] is closed" (B2.4). Reopening the period releases it, before any later-cycle entry (R3).

`invoice_voided` for a Closed record (S8-R4) needs no change: `InvoiceVoider::postedNothing()` sets Void, and the suffixer frees the number.

#### Phase B6 — read side

1. **`GET /api/v1/system-accounts`** (`app/Api/SystemAccountController.php:52-58`, `workspace.manage`; D53) returns a second bag next to `system_accounts`:

   ```json
   "category_accounts": [
     { "category_key": "general_internal", "list": "internal", "name": "General Internal",
       "is_archived": false, "is_default": true, "kind": "parts",
       "account_id": "…", "account_number": "6500", "account_name": "Vehicle Expenses" }
   ]
   ```

   - The server owns the order: `internal` first (the default first, then by name), then `no_charge` by name, with archived rows after active ones in each list.
   - New DTO `app/Data/WorkOrderCategoryAccountData.php`.
   - `SystemAccountManager::list()` gains a `categoryAccounts()` companion. The manager's docblock records that the category rows are a separate table, fed by core, and are not `AccountMappingKey` slots.

2. **`PUT /api/v1/system-accounts`** (`app/Http/Requests/Settings/UpdateSystemAccountsRequest.php`) accepts `category_mappings: [{category_key, kind, account_id|null}]`, max 500.
   - `mappings` changes from `required|min:1` (`:35`) to `required_without:category_mappings`.
   - Rules: `category_key` exists in the workspace (422 "Unknown category."); `kind` in `CostKind` (422 "Unknown kind."); `account_id` `present|nullable|uuid` with `WorkspaceScopedExists(Account::class, activeOnly: true)`.
   - **A null account clears the account and keeps the row**, unlike system keys, where null deletes the row (`SystemAccountManager.php:209-218`). Say so in both docblocks.
   - Archived categories stay editable (Q40 ✓), so a held entry of an archived category can always post. Its row exists, and S12-E8 still posts to it.
   - One transaction with the system keys. One audit row per changed category row. Both bags are echoed back (`jsonUpdated`). The release job is dispatched (B4).
   - No proxy allowlist change: `system-accounts` is a prefix already (`core:api/docs/integration/accounting-proxy/allowlist.json`).

3. **`app/Data/InvoiceData.php`** (`fromModel()` at `:45`). These are cheap columns, not relations, and every list gets them:
   - `classification`
   - `work_order_number`
   - `asset {shopview_id, display}`
   - `category {category_key, list, name}|null`: the current name by key, falling back to the snapshot
   - `original_work_order {shopview_id|null, number|null, not_in_shopview}|null`
   - `original_line {shopview_id, number, title}|null`
   - `original_technicians [{shopview_staff_id|null, name}]`
   - `no_charge_line_count`

   Assert the shape in `tests/Feature/Contract/ApiJsonContractTest.php`.

4. **`app/Api/InvoiceController.php::show()`** (`:189`) adds extras:
   - `is_closed`, so the port hides the payment, write-off and credit tabs without re-deriving the status.
   - `closed_summary {posted_parts_cost, posted_shop_supplies, journal_entry_ids[]}`: summed from non-reversed entries of `(shopview_work_order_id, work_order_cycle)` by `entry_kind` (D39). Direct vendor bill and credit lines of every cycle up to the current one also count (a cycle-1 bill line that Reopen never reversed still belongs to the record the NO CHARGE document shows): A2.7 `category_key` set, on a bill or credit that is not void. Their entries are listed with the rest. A deferred line counts through its move once posted (B2b).
   - `no_charge_lines [{line_number, title, category, original_work_order, original_line, original_technicians, hours, parts_cost, expense_accounts:[{id, number, name}], posting_status: posted|held|withdrawn|pending, hold_message|null}]`: the Expense account cell of S8-R7. It is read from the line's posted entries and its direct bill and credit lines (A2.7 `shopview_work_order_line_id`). A Held deferred move shows as `held`.
   - New DTO `app/Data/InvoiceNoChargeLineData.php`.

5. **`app/Http/Requests/Invoices/IndexInvoicesRequest.php`**: `Rule::enum(InvoiceStatus::class)` already admits `closed`. `GET /invoices` with no status lists Closed records with the others (S8-R6). No classification filter in this version.

6. **`app/Services/JournalEntries/SourceDocumentResolver.php`** (`:77`): the three new sources resolve through `work_order_cost_entries.shopview_invoice_id` to the record:
   - `SourceDocumentData::owner(SourceDocumentKind::Invoice, $invoiceId, "Internal work order {$wo}")`;
   - "No-charge work order …";
   - "No Charge line {$n} on {$invoiceNumber}" (Q50 ✓).

   A deferred move's entry (`entry_kind` `deferred_bill_line` / `deferred_credit_line` on its `work_order_cost_entries` row, B2b) resolves to its source document instead, from the payload's source reference: `SourceDocumentData::owner(SourceDocumentKind::VendorBill, $billId, "Vendor bill {$number}, line {$n}")`, or `VendorCredit` (the resolver already builds both owners, `:532-550`; D70, S8-R3 v1.0). It never reads as unlinked. Reversals hop through `reversal_of_id` (`resolveByHopping()`, `:228`). Keep the sources **out of** `JOURNALS` (`:142`).

7. **Invoice List report**: no hub change. The default whitelist already excludes Closed (`InvoiceListReport.php:48`). `statuses[]=closed` works on the JSON route (`app/Support/ReportOptions.php:204-212`) and on the export route (`app/Http/Requests/ReportExportRequest.php:125`).

#### Phase B7 — guards that state intent

- `app/Services/InvoiceWriteOffs/InvoiceWriteOffWriter.php:64-67`: refuse `Closed` ("A closed work order record has nothing owed.").
- `app/Services/Invoices/ManualInvoiceUpdater.php:65`: refuse `Closed`. It is already unreachable, because Closed records are core mirrors; the guard reads as intent.
- `app/Services/Reports/SalesTaxReport.php` and `SalesTaxDetailReport.php`: no change. A Closed record has no `invoice_lines`, so it adds nothing to any base (T6).

#### Phase B8 — seeding (S6-R2, S13-R3–R5, S13-N1, S13-E2)

**New `app/Services/Workspace/Seeders/WorkOrderCategoryDefaults.php`**, `forWorkspace(Workspace $workspace): WorkOrderCategorySeedResult`. It follows the reuse-by-name and free-number precedent of `PaymentProcessingFeesSeeder` (`app/Services/Workspace/Seeders/PaymentProcessingFeesSeeder.php:21-46`): one transaction, `Workspace::whereKey()->lockForUpdate()`, and an audit row for every account and mapping it writes.

1. **Catalog rows.** Ensure a row for each starting key (D50): `general_internal` (internal, default, "General Internal"), `warranty` (no_charge, requires the original, "Warranty"), `goodwill` (no_charge, "Goodwill") and `comeback` (no_charge, requires the original, "Comeback"). An existing row's name and flags are never overwritten; core's upsert is the authority.

2. **Account specs:**

   | Spec | Default number | Name | Used by |
   |---|---|---|---|
   | `vehicle_expenses` | 6500 | Vehicle Expenses | `general_internal` |
   | `warranty_goodwill` | 6430 | Warranty & Goodwill Expense | `warranty`, `goodwill` (shared) |
   | `comeback` | 6440 (HQ1 ✓) | Comeback Expense | `comeback` |

3. **Per starting row** (`kind = parts`), in order:
   - **Preserve** an account that is active and in the workspace ("preserve valid mappings").
   - **Leave empty** a row this provenance already populated once and the accountant has since cleared ("overwrites nothing a shop has changed").
   - **Otherwise resolve the spec:**
     - (a) the account provenance recorded for this spec, if still active;
     - (b) a **suitable** account: active, `type = expense`, and its name equal to the spec name after normalization (case-insensitive, trimmed, "&" equal to "and"), preferring the one at the default number. A number alone, or the `is_system` flag alone, never qualifies. A renamed seeded 6500 is therefore not reused (HQ2 ✓);
     - (c) otherwise **create** it at the default number, or, when that number is taken by an unsuitable account, at the first free number upward in the same hundred, then onward (HQ3 ✓). Account numbers are unique per workspace (`database/schema/mysql-schema.sql:195`).
   - Created accounts get `type=expense`, `sub_type=expense`, `normal_balance=debit`, `is_system=true` and parent null. These are the attributes the chart upgrade checks, so a later `accounting:upgrade-chart --plan` reports 6430 as `already_present` (`ChartUpgrade.php:39-59`), and `ShopExpenseAccountsSeeder` skips it by name (`ShopExpenseAccountsSeeder.php:32-34`) (HQ5 ✓).
   - Warranty and Goodwill share the resolved `warranty_goodwill` account.

4. **Provenance** goes in `chart_upgrade_actions` (`database/migrations/2026_10_23_000001_create_chart_upgrade_actions_table.php`, unique `(workspace_id, version, action_key)`), version `iwo-categories-2026-11`, with keys `create:<spec>` and `map:<category_key>:parts`. This is the precedent `ChartUpgrade` uses to adopt only accounts it created (`ChartUpgrade.php:192-197, 223-227`). It makes reruns idempotent: no duplicate account, mapping or catalog row.

**New workspaces (S13-E2).** `app/Services/Workspace/Seeders/ChartOfAccountsSeeder.php::seed()` calls `WorkOrderCategoryDefaults::forWorkspace()` after `seedMappings()` (`:215`). A workspace created at any time gets the four mapped rows; shop-added categories reach it through core's onboarding backfill (§7 C7).

**Existing workspaces.** New `app/Console/Commands/SeedWorkOrderCategories.php`, `accounting:seed-work-order-categories {--workspace=*} {--verify}`. This is an operator command, not a migration (HQ4 ✓); `ChartUpgrade` is the precedent for scoped chart writers that are never called by a schema migration (`ChartUpgrade.php:20`).
- Iterates `Workspace::cursor()`. Each workspace runs in its own transaction, and `Throwable` is caught **per workspace**, so one failure never stops the run (S13-N1).
- Prints passed and failed workspaces, and exits non-zero when any failed. `--workspace=` reruns the named ones.
- `--verify` checks S13-R5 for every workspace and changes nothing: four catalog rows, and four `parts` rows each mapped to an active account, Comeback included.
- It needs no core data, because the starting keys are fixed (D50), so it is safe to run at any time. It runs twice (S13-R3 v0.22): after Release B reaches each environment, and again at launch inside the Story 13 release run, after core's categories and QuickBooks steps — the launch run is the one that satisfies the S13-R4 order (§7).
- Runbook: a new section in `docs/runbooks/inbound-accounting-events.md` ("Internal Work Orders seeding and Held events", including how Held differs from `accounting:reprocess-held`, R9). Release notes for accountants: 6430 and Comeback Expense appear in charts that lacked them.

---

### 4. Migrations summary

| Release | File | Kind |
|---|---|---|
| A | `…_create_work_order_categories_table.php` | New table (catalog) |
| A | `…_create_work_order_category_account_mappings_table.php` | New table (rows, nullable account) |
| A | `…_add_work_order_fields_to_invoices.php` | 9 nullable columns and 1 index |
| A | `…_create_invoice_no_charge_lines_table.php` | New table |
| A | `…_create_work_order_cost_entries_table.php` | New table |
| A | `…_add_hold_columns_to_accounting_events.php` | 4 nullable columns and 2 indexes |
| A | `…_add_work_order_fields_to_vendor_document_lines.php` | 4 nullable columns and 1 index on each of `vendor_bill_lines` and `vendor_credit_lines` |

There is no backfill of `invoices.classification`: NULL means pre-v4 and reads as billable. Seeding is the B8 command plus the seeder, not a migration.

---

### 5. Quality gates (per the hub's `CLAUDE.md`)

```bash
./vendor/bin/sail composer lint:fix
./vendor/bin/sail composer analyse           # PHPStan level 6
./vendor/bin/sail pest tests/Feature/AccountingEvents tests/Feature/Api tests/Unit/Architecture \
     tests/Contracts tests/Feature/Migrations tests/Unit/Services/Workspace tests/Feature/Reconciliation \
     tests/Feature/Console tests/Feature/Scenarios
./vendor/bin/sail composer test              # full suite before each PR
```

- **Each release PR:** `Contracts aligned with core` must be green. Review with the hub's own `/pr-ship`, never core's `/pr-review`.
- **End-to-end:** the hub has no UI tier, so the end-to-end check is core's `e2e/joint/` against `make dev-full` (§9).

**Tests for B:**
- `tests/Feature/AccountingEvents/InternalWorkOrderJournalEntryTest.php`:
  - a stock-parts entry on `general_internal` posts 6500/1300 under `internal_work_order` and writes its cost-entry row, dated at the location's day of `entry_date`;
  - `warranty` posts to 6430 under `no_charge_work_order`;
  - `scope = line` posts under `no_charge_line` with the line id;
  - shop supplies posts category/5100;
  - a reclass credits the part category's COGS;
  - a back entry (`billable_back`, `credit_back`) moves between the category and the part category's COGS in the direction its lines name;
  - an empty row gives Held `category_unmapped`;
  - an unknown category self-heals, then holds;
  - redelivery and a new event id post nothing new;
  - a deferred move posts with `invoice_id = null` and is found by work order and cycle;
  - regression: a v3 entry with `work_order = null` posts exactly as v2, and a missing account there is still the old transient failure.
- `tests/Feature/AccountingEvents/WorkOrderVendorLinesTest.php` (B2b):
  - a v4 bill item on `general_internal` posts its line to 6500 inside the bill's one entry; AP, vendor and bill are as today; no family event is written;
  - a `scope = line` item on `warranty` posts to 6430 and writes the A2.7 columns with the line id;
  - an empty row: the line posts to the part category's COGS, the bill Completes, one deferred move is Held "Internal: [name] row not mapped", and a later message of the same group is applied in the same batch (no stall);
  - an unknown key self-heals, then takes the deferred path; it never throws;
  - mapping the row posts the move under the family source: Dr the category's account, Cr the line's posted account;
  - `vendor_bill_updated` v3 after a Held move withdraws it and, with the row now mapped, reposts the line directly; after a posted move it reverses the move;
  - `vendor_bill_reversed` unwinds the same way; a move being processed gives a transient retry of the bill event; the Dismissed move reads "Withdrawn: vendor bill [number] amended" (or "… voided"), never "work order reopened";
  - HQ8 lifecycle (S8-R3 v1.0): a bill amended while its move is Held and the row is still empty → the move is Dismissed and one new Held move carries the updated amount; voided while Held → Dismissed, nothing new; amended after the move posted → the ledger equals a fresh post of the updated bill (the bill and the move each reversed exactly once); a mapping save while the period is closed → Held again with the period reason;
  - the move's event exposes `source_document` (bill number, line position) on index and show, and its journal entry's source resolves to the bill or credit (D70);
  - credit v4: an item with a block posts to the category row, an item without one to the part category's COGS, and the remainder and tax post as today; `items: []` books exactly as v3; `Σ items + tax > amount` is Failed `contract_invariant` and acknowledged;
  - regression: v1–v3 `vendor_bill_created`, v1–v2 `vendor_bill_updated` and v1–v3 `vendor_credit_created` payloads book byte-identically.
- `tests/Contracts/ContractSchemaTest.php`: the three vendor versions consumed; their fixtures validate.
- `tests/Feature/AccountingEvents/HeldAccountingEventTest.php`:
  - each reason and message;
  - no `processed_events` row, `attempts = 1`, lease cleared;
  - inactive via raw DB (defensive);
  - R3: a cycle-2 forward entry is Held `waiting_on_earlier_cycle` behind a held cycle-1 reversal, while a cycle-1 sibling does not wait.
- `tests/Feature/AccountingEvents/SqsAccountingEventConsumerTest.php`: three messages of one group in one batch, `[held entry, invoice_created, payment_created]`. The first is acknowledged and settled; the second and third are applied in the same batch; `result->held === 1`.
- `tests/Feature/AccountingEvents/ReleaseHeldAccountingEventsTest.php`:
  - a category save dispatches the job `afterCommit`, and running it posts;
  - a period reopen releases that period only;
  - chain order: a held cycle-1 reversal posts before the cycle-2 forward entry;
  - an unchanged save dispatches nothing;
  - a save in workspace A never touches workspace B.
- `tests/Feature/AccountingEvents/HeldEventWithdrawalTest.php`:
  - a held Close, then its reversal: the Close is Dismissed `withdrawn`, the reversal Completes with no entry, the ledger is untouched, and a later mapping save posts nothing;
  - a waiting entry is withdrawn the same way;
  - Processing gives a transient error, and the next attempt reverses;
  - a posted original whose reversal date is closed gives Held, and reopening posts it linked by `reversal_of_id`;
  - Retry, `accounting:replay-event` and auto-release all refuse a withdrawn row;
  - a non-family reversal with no original still posts its own lines.
- `tests/Feature/AccountingEvents/EventIngestionFlowTest.php`: a resend of a Held event re-applies; a resend of a withdrawn one does not.
- `tests/Feature/Api/SystemAccountEndpointsTest.php`:
  - the category bag and its order;
  - PUT of a category row; null keeps the row;
  - unknown key, unknown kind and foreign account each give 422;
  - an archived row can be edited;
  - the release job is dispatched;
  - the system-key behavior is unchanged, including "covers every mapping key" (`:65-71`);
  - a foreign workspace gets 404.
- `tests/Feature/Api/InvoiceEndpointsTest.php`:
  - the index includes Closed with the new fields; `?status=closed` filters;
  - show gives `is_closed`, `closed_summary` (a direct bill line of the cycle included) and the no-charge block with posting status;
  - a write-off gives 422; payment application is refused;
  - cross-tenant gives 404.
- `tests/Feature/Api/AccountingEventEndpointsTest.php`:
  - Retry on Held with the row now mapped gives Completed; still unmapped gives Held with 200;
  - Retry on a Dismissed row (withdrawn included) gives 422;
  - `can_retry`, `hold_message` and `work_order` are present;
  - cross-tenant gives 404; no `accounting-events.manage` gives 403.
- `tests/Feature/Api/ReportEndpointsTest.php`: the invoice-list default excludes Closed; `statuses[]=closed` returns it; the export with it gives 200.
- `tests/Unit/Services/Workspace/Seeders/ChartOfAccountsSeederTest.php`: a fresh workspace gets four mapped rows and the accounts, in both chart modes; running twice is idempotent.
- `tests/Feature/Console/SeedWorkOrderCategoriesTest.php`, a matrix:
  - 6500 suitable, versus renamed (a new "Vehicle Expenses" at 6501);
  - 6430 present (reused), absent (created), or occupied by "Tow Fuel" (created at 6431 and mapped);
  - Warranty and Goodwill share one account;
  - an operator's mapping is preserved;
  - a cleared row is left empty on rerun;
  - an inactive mapped account is re-resolved;
  - a second run is a no-op with no duplicates;
  - one workspace throws, the others pass, and it is listed with exit code ≠ 0;
  - `--workspace` reruns;
  - `--verify` passes and fails correctly.
- `tests/Feature/Reconciliation/…` (the existing runner suite): a Held Close, a Held no-charge line entry and a Held vendor bill move each appear in the category-free `held_awaiting_operator` section with their `hold_reason` and kind, and the move with its bill label; a withdrawn family row is counted there with its `dismissal_reason`; no per-category bucket changes.

---

### 6. Scenario test (end to end, hub only)

`tests/Feature/Scenarios/InternalWorkOrderLifecycleScenarioTest.php`, through the consumer harness:

1. Seeded workspace with the `general_internal` row cleared. A v4 closed `invoice_created` (cycle 1), then two parts entries and a shop-supplies entry.
   - The record is Closed and the three entries are Held, "Internal: General Internal row not mapped".
   - A `payment_created` for another invoice in the same batch is applied (no stall).
2. `PUT /system-accounts` maps the row to 6500, and the release job runs.
   - The three entries post under `internal_work_order`, found by work order and cycle.
   - The P&L shows a 6500 debit and 1300/5100 credits. AR aging and the invoice-list default show nothing.
   - `closed_summary` gives the posted totals.
3. Reopen (`invoice_voided` plus three reversals by reference): the record is Void with its number freed, and three reversals are linked by `reversal_of_id`.
4. Re-close (cycle 2: new core invoice id, same number): a new Closed record with new entries. The old record stays Void.
5. Close held, then Reopen: the originals are Dismissed `withdrawn`, no reversals exist, a mapping save posts nothing, and Retry is refused.
6. Close posted, then the Reopen reversal is Held because the period is closed, then re-close (cycle 2): the cycle-2 entries are Held `waiting_on_earlier_cycle`. Reopening the period posts the reversal, then the cycle-2 entries, in that order.
7. A billable v4 with one Warranty line while the `warranty` row is empty:
   - revenue and receivable post;
   - the line's cost entry is Held "No Charge: Warranty row not mapped";
   - mapping the row posts it under `no_charge_line`;
   - the invoice block shows 6430 and `posted`.
8. Run the same as 7, but reverse the invoice while the line entry is Held: the entry is Dismissed `withdrawn` and the invoice is Void.
9. A `vendor_bill_created` v4 for a special-order part on an open internal work order:
   - on `general_internal` (mapped): one bill entry with the line on 6500, AP unchanged, nothing Held, no reclass;
   - a second item on a shop-added internal category with an empty row: the line posts to the part category's COGS and a deferred move is Held;
   - mapping the row posts the move; after Close, `closed_summary` counts both lines;
   - a v4 vendor credit for the first part posts to 6500.

---

### 7. Cross-repo requirements on core, and deploy order

These are hub preconditions. Each is decided in Section 3 (D14, D47–D53, D26) and is owned by the core plan.

- **C1, contracts (D14, D47–D49, D52).** Publish six schema versions with fixtures in `core:api/docs/integration/accounting-events/`, update `coverage-inventory.md`, and run `tools/accounting-contracts.sh manifest`. Package version: the next free MINOR (expected 1.12.0). `emitted-versions.json` is unchanged, and core's `AccountingQueueBoundaryTest::PUBLISHED_AHEAD_OF_EMITTER` (`core:api/tests/Unit/Accounting/Outbox/Domain/Model/AccountingQueueBoundaryTest.php:70`) lists all six.
  - **`work_order_category_upserted.v1`**: `{category_key ^[a-z][a-z0-9_]*$, category_id, list: internal|no_charge, name (≤60), is_archived, is_default, requires_original_work_order, changed_at}`. The envelope `workplace_id` is null.
  - **`invoice_created.v4`**: v3 plus `classification`, `status`, `work_order_number`, `asset {vehicle_id, display}|null`, `posting_date`, `work_order_id`, `work_order_cycle`, `category {category_key, list, name}|null`, `original {work_order_id|null, work_order_number|null, not_in_shopview, line {work_order_line_id, line_number, title}|null, technicians [{staff_id|null, name}]}|null` and `no_charge_lines[]`.
    - Each `no_charge_lines` item is `{work_order_line_id, line_number, title, category, original|null, hours, parts_cost}`.
    - The schema description states the B1 invariants.
    - A no-charge line's statement is priced `"0.00"` with `labor_rate "0.00"`.
    - Which technicians count is core's (D55, Q42 ✓).
  - **`journal_entry_requested.v3`**: v2 plus the required, nullable `work_order {work_order_id, cycle, invoice_id|null, scope: work_order|line, work_order_line_id|null, category {category_key, list, name}, cost_kind: parts, entry_kind: stock_parts|shop_supplies|bill_reclass|billable_back|credit_reclass|credit_back}`.
    - The reserved line key `work_order_category_expense` is legal only when `work_order ≠ null`.
  - **`vendor_bill_created.v4`** and **`vendor_bill_updated.v3`** (one builder, lockstep): v3 and v2 plus, on every item, the required, nullable `work_order {work_order_id, work_order_number, cycle, scope, work_order_line_id|null, category {category_key, list, name}, cost_kind: parts}` (B2b, C6).
    - Non-null only when `is_purchase_order = false` (an `if/then` in the schema).
    - Null means today's routing.
  - **`vendor_credit_created.v4`**: v3 plus a required `items [{item_id, description, amount, part_category_id|null, work_order {…}|null}]`, `[]` meaning today's routing for the whole credit (C6). `item_id` is the `vendor_return_item` id.
    - The schema description states `Σ items.amount + tax.amount ≤ amount`.
    - `amount` is tax-exclusive, a decimal string in dollars.
- **C2, Close and invoice emission.**
  - `invoice_created` v4 for every invoice. For a Close, in the **same outbox transaction**, one v3 entry per cost:

    | Entry | Debit | Credit |
    |---|---|---|
    | Stock part | `work_order_category_expense` | `inventory_asset` |
    | Shop supplies > $0 | category | `expense_shop_supplies` |
    | Bill reclass, only for a bill line its bill posted on today's routing (S7-R4) | category | `cogs_parts`, with `part_category_id` |
    | Credit reclass, only for a credit line posted on today's routing for such a bill line (S7-R3a, S7-R4) | `cogs_parts`, with `part_category_id` | category |

    A bill or credit line of a work order that was already internal or no charge sits on the category from the start (C6). It gets no entry at Close unless it moves (C4).

  - Every one carries `work_order_number`, a `source_id` unique **per cycle**, and an `entry_date` instant inside the posting date's local day at the location. The hub converts instants to the location's day, so UTC midnight of a US location's date would land on the previous day.
  - For a billable invoice with no-charge lines, the line's stock parts and reclasses go as `scope: line` entries; billable lines post as today.
- **C3, Reopen and Reverse.**
  - `invoice_voided` for the record, plus one entry with **`reverses_source_id` = the original's `source_id` for every cost entry**, including the reclass and shop-supplies ones. Each repeats its original's `work_order` block (same cycle).
  - Reversal by reference is what makes withdraw work, and what keeps a mapping change made in between harmless.
  - A bill or credit line posted straight to the category (C6) is a document line, not a cost entry. Reopen leaves it where it is; a later move follows C4 or C6.
- **C4, category moves (D47).** No entry ever names two categories.
  - A bill or credit line whose cost sits on one category when the work order closes under another (S7-R4) moves in two entries, at Close, or at billable invoice creation for a line.
  - The first entry moves it out of the old category:
    - the reversal by reference of the reclass that put it there;
    - or, when its bill or credit posted it there directly (C6), a `billable_back` (bill line) or `credit_back` (credit line).
  - The second entry moves it into the new category with a new `bill_reclass` or `credit_reclass`.
- **C5, no closed invoice below v4.** Close must be impossible while core emits `invoice_created` below 4: the same release, behind the release switch (D21/D43). A closed invoice emitted as v3 would mirror as a $0 Posted invoice that the hub cannot tell apart, and a replay re-sends the stored v3 payload, which breaks S8-R5 for good.
- **C6, vendor bills and credits post straight to the category (T4(b), D14 as amended, S7-R3, S7-R3a, S7-R8).**
  - **Bills.** `vendor_bill_created` v4 and `vendor_bill_updated` v3 come from one builder (`core:api/src/Accounting/Outbox/Application/Service/PayloadBuilder/VendorBillCreatedPayloadBuilder.php:18-19, 177-199`).
    - An item gets the `work_order` block when its part request belongs to a work order or no-charge line that is non-billable at the moment core first records the item on a bill.
    - Core freezes that decision on the delivery item and re-sends it unchanged on every amend and rebuild (window replay). The hub's repost then stays where core's cost entries assume the line sits.
    - A stock (PO) delivery and an opening bill always send null.
  - **Credits.** `vendor_credit_created` v4 lists one item per returned line whose bill line's cost this feature routed or moved.
    - `work_order` is read from core's `vendor_return_item` stamp written at credit creation (`category` → the block; `bill_line` → null), re-sent unchanged on replay; the items are exactly the stamped lines (S7-R3a). A credit line received without an item (v3, or `items: []`) sits on Parts Inventory, so a later `credit_reclass` for it debits `inventory_asset`.
    - Null means the bill line still sits on today's routing, and the hub credits the part category's COGS.
    - A manual credit or an opening credit sends `items: []`.
  - **No bill-time and no credit-time reclass.** Core emits a move only at the moments S7-R4 names:
    - `bill_reclass` / `credit_reclass`: at Close, or at billable invoice creation for a no-charge line (S7-R8), for a line its bill or credit posted on today's routing because the work order or line was billable then;
    - `billable_back` / `credit_back`: at billable invoice creation, for a line sitting on a category once the work order or line is billable (S7-R4 last sentence, S7-R8 Mark as Billable);
    - the two halves of a category move (C4);
    - reversals by reference at Reopen and Reverse (C3).
  - Bills emitted before the version raise carry no category, so Close reclasses them as S7-R4 bills. Nothing is lost across the cut-over.
- **C7, category events (D49).**
  - Every category write records `work_order_category_upserted` with `AccountingEventRecorder::recordForOrganization()` (`core:api/src/Accounting/Outbox/Application/Service/AccountingEventRecorder.php:215`) inside the write transaction. Per-organization FIFO then delivers it before any posting that names the category, vendor bills and credits included.
  - A new onboarding backfill phase, ordered before invoices and vendor bills, in `core:api/src/Accounting/Outbox/Application/Service/AccountingReferenceEventFactory.php` (part categories at `:156-200` are the precedent). The window phases come after it (`core:api/src/Accounting/Outbox/Domain/Model/BackfillPhase.php:44-72`).
  - A one-time emit step in the Story 13 release run.
  - The recorder records nothing for an organization without the Accounting flag (`AccountingEventRecorder.php:31-33`).
- **C8, fixed starting keys (D50).** `general_internal`, `warranty`, `goodwill` and `comeback`; shop-added categories use `c_` followed by 32 hex characters. This is what lets B8 seed without core data.
- **C9, cycle (D51).** One counter per work order, shared by Close and Create invoice: 1 at the first finish, +1 after each Reopen or Reverse. The hub orders one work order's entries by it (B3).

**Deploy order.** It is load-bearing. The three gates enforce steps 3–5: core's required `Accounting contracts gate`, which also covers new types (`core:.github/workflows/be-accounting-contracts.yml:223-231`); the hub's required `Contracts aligned with core`; and core's production `Preflight` against the live hub's `/contract-manifest`.

1. **Hub:** adopt the contract versions core published after 1.9.0 (up to 1.11.0). This is other teams' work and a hard predecessor (§0.4).
2. **Core PR-C1:** the six schema versions, package MINOR, nothing new emitted. Merging tags `v<version>` in `ShopView/accounting-contracts`.
3. **Hub Release A** (A0–A3) → `develop` → staging (`gh workflow run deploy-staging.yml --ref develop`) → production (`gh workflow run deploy-production.yml --ref <tag>`).
4. **Hub Release B** (B0–B8) → `develop` → staging → a production tag.
5. **Core PR-2.** It raises `invoice_created: 4`, `journal_entry_requested: 3`, `work_order_category_upserted: 1`, `vendor_bill_created: 4`, `vendor_bill_updated: 3` and `vendor_credit_created: 4` **together**, only after B is in production (D52). Today `core:api/docs/integration/emitted-versions.json` holds 3, 2, 3 for the three vendor types. It also ships:
   - the payload builders and C2–C4 and C6 emission;
   - C7 recording and the onboarding phase;
   - the seed CLI's one-time `--emit-accounting` option (the categories admin and the seed CLI itself ship earlier, in core Phase 2C);
   - the accounting UI port (§9).
   Raising the category type alone, earlier, would let a rollback of A meet an unknown cast `event_type`. Raising the vendor versions apart from JE v3 would break the books either way:
   - JE v3 without them: core sends no bill-time reclass, so a bill line of an already-internal work order stays on COGS;
   - them without JE v3: there are no family entries at all.
6. **Story 13 release run, in production** (S13-R4):
   1. core `app:work-order-categories:seed` (categories);
   2. the QuickBooks rows (virtual, D54);
   3. hub `accounting:seed-work-order-categories` again (accounts and mappings; it already ran once after Release B, S13-R3; keyed on the fixed starting keys, so it does not wait for core's emit) — the PRD order (S13-R4: categories, QuickBooks rows, hub accounts and mappings);
   4. core's emission deploy, then its one-time category emit (C7);
   5. `--verify` on both sides, organization by organization (S13-R5);
   6. the S9-R14 rule-zero check;
   7. flip `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED`.

   A failed organization is listed and rerun with `--workspace` (S13-N1). The release stays invisible until every organization passes.

**QA lanes.** The hub image for a QA environment must be at B before core's QA deploy for that environment emits the new versions. Core's `BE: QA - Deploy` takes the hub tag as an input, and a missing image silently deploys the previous one (hub `CLAUDE.md`), so check that an image exists for the B SHA.

**Jira.** Hub merges do not move Jira. Move SV-11763 (Story 6), SV-11765 (Story 8), SV-12295 (Story 13) and the hub half of SV-12226 (Story 12), or their hub sub-tickets, by hand.

---

### 8. Engineering trade-offs (with recommendation)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| T1 | How Held avoids the head-of-line stall | (a) Acknowledge the message and park the row as Held, a second carve-out beside SV-9844's permanent refusal. (b) Keep releasing the message: the stall S8-N2 forbids, then the DLQ. | **(a).** Safe because a held cost entry's only dependents are its reversal (withdraw, B5) and later-cycle entries of the same work order (wait, B3). A deferred move's own bill unwinds it on amend or void (B2b). Still loud: Events page, metric, audit, reconciliation bucket. |
| T2 | Scope of Held | (a) Only v3 entries carrying a `work_order` block. (b) Every event that hits a missing mapping or closed period. | **(a)** (HQ7 ✓). (b) would silently change behavior for every existing type, where "stuck beats wrong" exists for real ordering reasons (payments after invoices). |
| T3 | Source label and link to the record | (a) New `JournalEntrySource` cases, plus a `work_order_cost_entries` row keyed by the core ids JE v3 carries (work order, cycle, invoice, line). (b) Look the record up by work-order number. | **(a).** Ids are unambiguous across cycles and work before the record exists (a deferred move, B2b). The hot `journal_entries` table is untouched. |
| T4 | S7-R3/R3a in the hub (bill lines and credits on a work order or line that is already internal or no charge) | (a) The bill posts to COGS as today, then core sends a reclass entry, and a credit gets a mirror reclass. (b) `vendor_bill_created` v4, `vendor_bill_updated` v3 and `vendor_credit_created` v4 carry a per-item `work_order` block whose category picks the row, so the line posts to the category inside the bill or credit itself (B2b, C6). | **(b), decided by Product.** PRD v0.21 Key Decisions: "Part cost goes straight to the expense account, not to cost of goods sold first, one entry per part as invoicing posts today. … two entries where one is enough only adds noise to the books. … Vendor bill lines follow the same rule at bill time. Rejected: post to cost of goods sold at close and reclass afterwards; …" (a) is that rejected pattern. Reclasses remain only for S7-R4: a line posted before the work order or line became non-billable, the reverse at invoicing when it becomes billable, and the D47 halves (C4). Cost: three contract versions, and a deferred move in the rare case the row is empty or inactive when the bill arrives (HQ8 ✓, S8-R3 v1.0). |
| T5 | Release split | (a) A then B. (b) One release, plus a rollback runbook step that deletes new rows before redeploying the old image. | **(a).** It is the hub's stated rule and costs one extra tag deploy. (b) would delete ledger-adjacent data under pressure. |
| T6 | Lines on hub records | (a) No lines on a Closed record (the document of record is core's); a separate `invoice_no_charge_lines` block on a billable record. (b) Persist $0 `invoice_lines` with a nullable account. | **(a).** (b) needs a revenue account on a $0 line or a schema change, and puts $0 rows into the sales-tax and product reports. S8-R1 asks for no lines. |
| T7 | Withdrawn row | (a) Reuse Dismissed, with `failure_code = withdrawn`, a system reason and `dismissed_by = null`. (b) A new `Withdrawn` status. | **(a)** (HQ6 ✓). Dismissed already means "will never apply, explained on the record" to reconciliation, the ingestor, the consumer and the archiver. The marker closes every retry path. (b) fans out to all of them. |
| T8 | Auto-release execution | (a) Queued job, `afterCommit`, `WithoutOverlapping` per workspace, replaying in chain order. (b) Synchronous in the save request. | **(a).** A month of held entries could be hundreds; a settings save must not run them inline. |
| T9 | Where the hold sentence is rendered | (a) The hub sends `hold_message`, rendered at read time from reason, context and the current category name. (b) The port renders it from code and context. | **(a).** One source for the copy, reused in logs and the CLI; a renamed category shows its new name. |
| T10 | How the hub learns categories | (a) Catalog event `work_order_category_upserted`, full state, with a snapshot self-heal. (b) A created/updated/archived trio. (c) The category only inside posting events. (d) The hub reads core. (e) A synchronous core-to-hub write at save. | **(a)** (D49). (b) is three schemas for one state. (c) fails S6-R1's "appears immediately". (d) breaks the self-contained-payload rule and the move away from replica reads (`LaborTypeDeactivatedProcessor.php:20-27`). (e) couples category saves to hub availability. |
| T11 | Where category rows live and are edited | (a) Own tables, served inside `/system-accounts`. (b) `account_mappings` with dynamic keys. (c) A separate resource. | **(a)** (D53). (b) is impossible (§0.2). (c) adds an allowlist prefix and a second save on the same screen. |
| T12 | Per-work-order order | (a) The cycle from the payload, plus a work-order lock key through `documentSource()`. (b) The hub's own timestamps. | **(a)** (D51). Envelope time is seconds (§0.5); the lock and order seams already exist. |
| T13 | Rollout of seeding | (a) An operator command with per-workspace isolation, a failure list, `--workspace` and `--verify`. (b) A deploy-time data migration. | **(a)** (HQ4 ✓). A migration cannot both isolate one organization's failure and report it for a rerun (S13-N1); the chart upgrade is the precedent. |
| T14 | S8-R7 hold scope | (a) Hold only the no-charge line's cost entries; the invoice, revenue and receivable post. (b) Hold the whole invoice. | **(a)** (Q30 ✓). (b) parks a receivable that payments depend on, the exact case the consumer's "never park" rule protects. |

---

### 9. What the core UI port must render

Files are under `core:app/src/components/ts/accounting/`. This is the matched pair; nothing above is visible until it ships.

| Hub change | Port change |
|---|---|
| `GET/PUT /system-accounts`: `category_accounts` bag and `category_mappings` | `settings/AccountingSystemAccounts.vue` and `settings/Model.ts`: render the bag as rows under the `cogs_parts` row, labeled "Internal: [name]" / "No Charge: [name]", archived rows greyed, empty rows shown as empty. Save through `category_mappings`. The rows come from the hub; they are not merged with core's category list (D53). The read-only hub text in the category dialog (S1-R14) and the Close preview note (S3-N4) are computed server-side by core (D26). |
| `GET /accounting-events`: `held`, `hold_message`, `work_order`, `can_retry`, `source_document`, `source_line` (D70); withdrawn Dismissed rows | `reports/AccountingEventLog.vue`: a "Held" chip (scoped key `event_held`, amber), `hold_message` verbatim, "Work order closed · [n] · [classification]", Retry only where `can_retry`, and a Dismissed row with its `dismissal_reason`; a deferred move labelled "Cost move to [Category] · Vendor bill [number], line [n]" with the bill or credit as a link (`accountingSourceDocumentRoute()`). After a retry the answer can be Held again; show the new message. |
| `InvoiceStatus` `closed` | `shared/Model.ts:97` already has a grey `closed` pill; confirm it is the invoice map. `sales/Model.ts:89` (`ACCOUNTING_INVOICE_STATUS_OPTIONS`) gets "Closed". `reports/reportParams.ts:621-622` gets Closed in the Invoice List status option, **unselected by default**. `reports/reportView.ts:1375` gets the label. |
| `InvoiceData` fields and show extras | `sales/AccountingInvoices.vue`: the Internal or No Charge badge and "No Charge" in place of the total. `sales/AccountingInvoiceDetail.vue`, Closed record: summary with number, customer, asset, classification, category, original work order, posting date, "No Charge", posted Parts cost and Shop supplies, plus the journal entry section; no lines, tabs or Void (D39). Billable record: the "No Charge lines" block with the Expense account or the Held state (S8-R7). |
| `JournalEntrySource` `internal_work_order`, `no_charge_work_order`, `no_charge_line` | Labels "Internal work order", "No-charge work order" and "No Charge line" (Q50 ✓) in `ledger/journalEntryView.ts:93`, `ledger/register/registerGridView.ts:96` (short codes `IWO`, `NCWO`, `NCL`), `reports/reportView.ts:614` and `banking/bankingView.ts:425`. The entry detail links through `source_document`, kind `invoice`; a deferred move's entry links with kind `vendor_bill` or `vendor_credit` (B6, D70). |

---

### 10. Risks

- **R1, contract coupling.** Hub A cannot pin the Internal Work Orders package until the versions core published after 1.9.0 are supported (§0.4). Mitigation: an explicit predecessor ticket.
- **R2, a closed invoice emitted as v3.** It would become a permanent $0 Posted invoice (S8-R5 broken). Mitigation: C5; the hub cannot detect it, because v3 has no classification.
- **R3, withdraw racing auto-release or Retry.** Held is claimed by one conditional UPDATE (the job claim) and withdrawn by another (`held → dismissed`). Exactly one wins, and the InFlight loser retries transiently. The per-work-order lock serializes the rest. Test-covered.
- **R4, out-of-band replays.** Auto-release, Retry and withdraw run outside FIFO order. They are safe because a cost entry's only dependents are its reversal and later cycles of its work order (T1), plus, for a deferred move, its own bill's amend and void, which unwind it (B2b). Any future event that references a cost entry must revisit §HELD; write that sentence into the docblock.
- **R5, rollback hazards from enum casts.** Mitigation: the A/B split (T5) and raising all six emitted versions together after B (D52). Residual: a rollback below A after core started emitting. The rule is "roll back no further than A".
- **R6, re-resolution.** Under T4(b) the common case is never re-resolved: a bill on an already non-billable work order posts once, straight to the row. Three residues remain. Each stays inside P&L expense and is fixed by one entry the accountant posts:
  - an S7-R4 reclass re-resolves `cogs_parts` by part category at Close. If that category's COGS was re-pointed between the bill (posted while billable) and the Close, the reclass credits the new account while the bill sits on the old one;
  - a back or move-out entry (`billable_back`, `credit_back`) re-resolves the category row. A row re-pointed between a direct bill posting and that entry leaves the same kind of residue;
  - an amend reverses and reposts at the row's current account, as it already does for a part category's COGS (`BillUpdatedProcessor.php:26-29`).

  Deferred moves name their line's posted account by `account_id` and never re-resolve.
- **R7, live chart changes.** 6430 and Comeback Expense appear in charts that lacked them; a renamed 6500 gets a new "Vehicle Expenses" at a free number. Mitigations: audit rows, provenance, `--verify`, accountant release notes (HQ1 ✓, HQ2, HQ5).
- **R8, shop supplies credit.** The credit lands on the Shop supplies expense row (seeded 5100 Shop Supplies COGS), so the S10-R4 credit nets inside COGS while the debit sits in 6xxx operating expense. Gross and net profit match QuickBooks' income-side credit, S8-R3 says so, and the accountant can remap. Design frame 5/3b agrees.
- **R9, naming.** "Held" collides with `accounting:reprocess-held` (gate rejections). Mitigation: log lines say "Accounting event held (status)", and the runbook section distinguishes the two.
- **R10, chain pile-up.** One empty row, or a period closed at Reopen, holds every later-cycle entry of that work order. Each is visible, names the blocking work order, and releases in order. Accepted.
- **R11, posting-date day shift.** Core sends instants inside the local day (C2); a hub test pins a US-timezone location.
- **R12, Held entries unseen in reconciliation** if B3's category-free `held_awaiting_operator` section is missed: the hub's per-category buckets skip `journal_entry_requested`, so nothing else would list them (and they cause no category false alarm). It is in scope, not a follow-up.
- **R13, the cycle lives in core.** If Close and Create invoice do not share one counter, a work order that is invoiced, reversed, converted and then closed could be mis-ordered (C9). Core owns the test.
- **R14, starting keys.** If core ever gives starting categories per-organization ids instead of the fixed keys (C8), B8 cannot seed without core events. Fixed by D50.
- **R15, a bill line whose category row is empty, inactive or unknown when the bill arrives.** Typical cases: a shop-added category not yet mapped, or a category whose upsert the hub has not seen.
  - Per-organization FIFO delivers `work_order_category_upserted` before any bill naming the category (C7), and the item's snapshot self-heals the catalog otherwise. So an unknown key never throws and never stalls the stream.
  - The bill cannot be Held (§0.11). The line posts on today's routing, and a Held deferred move carries it to the category once the row is mapped (B2b).
  - That is two entries instead of one, only in this case, and loud: Held with the S8-N2 sentence (HQ8 ✓).
- **R16, a bill amended or voided after its deferred move.**
  - The amend or void unwinds the bill's own moves in the same transaction: a Held move is withdrawn, a posted one reversed (B2b).
  - A move being processed makes the bill event retry transiently, B5's InFlight rule. Test-covered.

---

### 11. Open questions (all answered by PRD v1.0; kept as the record)

**Product** (posted with the PRD round):
- **Q30 ✓, S8-R7 hold scope.** Only the no-charge line's cost entries are Held; the invoice, revenue and receivable post (T14).
  - Round 4 ✓ (v0.23, v0.24): the same principle for a vendor bill or credit line whose category row is empty — the bill, vendor and Accounts Payable post and only the line's move to the category is Held — is S8-R3 v1.0, and S8-N2's Held list now names it ("Close, reversal, no-charge line, and the move of a vendor bill or credit line to its category account"). No merge gate remains.
- **Q40 ✓, archived rows.** An archived category's hub row stays editable (B6).
- **Q50 ✓, hub copy.**
  - "No Charge: Warranty row not mapped" (the S6-R1 row label, since names are unique only within a list; design frame 5/4 says "…: expense account is not mapped");
  - "Waiting for an earlier held entry of work order [n]";
  - source label "No Charge line".
  - The inactive-account case uses the same "… row not mapped" / "… is not mapped" reason: settled by S8-N2 v0.22 ("missing or inactive").
- **Q53 ✓:** the wording slips in S8-N2 and S8-R7 from the reason-to-category rename. No hub behavior depends on them.

**AccountingHub owner:**
- **HQ1 ✓:** the Comeback Expense number is **6440**: free in the legacy and v2 charts, next to 6430 (`ChartOfAccountsSeeder.php:101-119`, `ShopExpenseAccountsSeeder.php:13-27`). Confirmed by the hub owner on 2026-11-09 (S6-R2 v0.22).
- **HQ2 ✓:** the suitability rule is an active expense account with a normalized name match, and a number or the `is_system` flag alone never qualifies. That includes a renamed seeded 6500, which is not reused; a new "Vehicle Expenses" is created at a free number. This also covers Product's PQ5.
- **HQ3 ✓:** the free-number policy walks upward within the same hundred, then onward.
- **HQ4 ✓:** the rollout is the operator command, run in the Story 13 release run and rerunnable, rather than a migration (T13).
- **HQ5 ✓:** 6430 is created in workspaces still on the legacy chart, with exactly the chart upgrade's attributes.
- **HQ6 ✓:** a withdrawn row is never replayable: no `--force`.
- **HQ7 ✓:** Held stays limited to work-order cost entries (T2).
- **HQ8 ✓** (confirmed by the hub owner on 2026-11-09; S8-R3 v0.24, unchanged in v1.0): a vendor bill or credit line whose category row is empty or inactive posts on today's routing, and only the line's move to the category is Held (B2b, R15). The confirmed lifecycle, each point already in B2b–B4 unless marked new:
  - the hub raises the move itself (its first self-raised event), Held "No Charge: [Category] row not mapped" or "Internal: …"; the bill itself is never Held (§0.11);
  - a mapping save retries it automatically, subject to every other posting check, an open period included (B4: still unfixable → Held again with the new reason);
  - amended while Held: Dismissed, the updated bill evaluated again, a replacement move only when one is still needed (B2b `unwind()`, then re-resolve); voided while Held: Dismissed, no replacement;
  - amended or voided after the move posted: the move is reversed and an updated one posted when needed, inside the bill's own processing, so the bill's reversal and the move's reversal are separate entries and no amount is reversed twice (B2b, R16);
  - Held moves can be retried, Dismissed ones never replayed (HQ6, S4-R3);
  - reconciliation shows a Held move in B3's category-free `held_awaiting_operator` section, with its source bill or credit (the hub's reconciliation gives `journal_entry_requested` no category, so a per-category bucket could not); **new (D70):** Accounting Events shows the move with its status and a link to the source vendor bill or credit and its line (B3 `AccountingEventData.source_document`), and the move's journal entry resolves to the same document (B6);
  - core sends no amend or void for a vendor credit, so the credit half of those two rules has nothing to act on (B2b).


---

# Appendix D — Customer portal plan (`shopview-portal`)

## Internal Work Orders: customer portal (`shopview-portal`) plan

Appendix to the Internal Work Orders tech plan. Scope: PRD v1.0 (Confluence page version 39) as it touches the customer portal: S2-R11, S2-R16, S2-E6 (estimate of a whole no-charge work order), S3-R4 and S3-R6 (a closed record is never shown as an invoice), and Story 12 / SV-12296 (S12-R4, S12-R7, S12-E3: a no-charge line on a billable work order). The PRD text wins over the design.

**Sources read**

- Portal: `ShopView/shopview-portal` at `origin/develop` `2f8d26ba` (2026-11-02). Read from `origin/develop`; implementers branch from a freshly fetched `origin/develop`. Portal paths below are relative to the portal repository root.
- Core: `ShopView/shopview` `develop` at `8a3ce526e4`. Core paths are relative to the core repository root.
- PRD v1.0 (page version 39), the backend appendix (Appendix A) and the frontend appendix (Appendix B) of this plan.
- Design: the v6.1 frame file `the design export` is **not in the v6.1 export**. Only its canvas entry exists: `canvas.json` board frame 7b, titled "7b Portal · no-charge estimate", with the note "The customer approves the work, not an amount. Cost is never shown on the portal." The frame's content was read from the v5.12 export (`design/all-flows-v512.txt:587-607`). It shows the customer, "Estimate S2-35102", the asset, a NO CHARGE stamp, "Reason: Warranty", and a table with Line, Description, Qty and Hours (line 01 "Replace turbo actuator" 2.0 h, part "Turbo actuator" qty 1). Each line has Decline and Approve. "Reason" is the v0.17 word; the PRD text says "Category: [name]".

Conventions: **[P]** = portal file, **[C]** = core file. `⚠` marks a finding that contradicts the PRD or the backend appendix.

---

### 1. Summary

1. **The portal does not render its own estimate or invoice documents.** Both are rendered by core's Twig templates. The estimate is an HTML snapshot that core posts to the portal at Send to Portal; the portal stores it in S3 and shows it as-is. The invoice is fetched from core on every view, as HTML plus a core-generated PDF. ⚠ S12-R4 says "The portal renders its own documents". That is not what the code does.
2. **The portal does render three things itself**, from its own direct reads of core's database (`core_db`), and these are where prices leak:
   - the approval line cards, which show `Cost:` (the line total core sent at Send to Portal);
   - the "Price Summary" card, a portal re-implementation of core pricing;
   - the approval emails.
3. **The portal lists invoices straight from core's `invoice` table.** It does not call core's External API for lists. So the backend appendix's only portal change, `i.status <> 'closed'` in `External/CustomerPortal/Http/Controllers/InvoicesQueryBuilder.php`, does **not** keep a closed record off the portal invoice list, the vehicle invoice tab or the customer filter. ⚠ The portal must exclude it itself (Phase P1).
4. **Core does not zero the stored labor rate.** The appendix masks labor at read time in `WorkOrderPricing` and zeroes only part sell prices and fixed amounts on write (Appendix A). The portal's price replica reads the raw rate (`wol.labour_type_cost AS rate`). So until the portal mirrors the mask, it would still show:
   - labor, shop supplies, tax and a total on a whole no-charge estimate;
   - the full price of a no-charge line, inside the billable totals.
5. ⚠ **Nothing re-sends an estimate after a price change today.** The PRD (S12-R4: "regenerated and re-sent, exactly as a price change on a sent estimate is today") assumes it does; Appendix A now follows the code (no automatic re-send, D67). In core, `approval_request` is insert-only and written only by the advisor's Send to Portal ([C] `api/src/VehicleService/WorkOrders/Domain/Approvals/ApprovalRequest.php:18-24`). S2-E6 needs a mechanism. Recommended: the portal reads the live state and suppresses a stale snapshot (§4 P4, Q54).
6. **Deploy order is a hard constraint.** The portal queries core's tables directly. A portal release that names the new columns before core's migrations have run in that environment fails with SQL errors on the approvals page. The order is:
   1. core schema;
   2. the portal release;
   3. the core deploy switch flips.

   Section 5 has the detail.

---

### 2. How the portal gets and renders estimates and invoices today

#### 2.1 Estimate (portal "Approvals")

| Step | Where | What happens |
|---|---|---|
| Advisor clicks Send to Portal | [C] `api/src/VehicleService/WorkOrders/Application/Approvals/CreateApprovalRequest/CreateApprovalRequestController.php:16-17` (`POST /api/work-orders/approvals/create-approval-request`, `ROLE_WORK_ORDER_CREATE_AND_EDIT`) | The FE sends `approvalRequestLines [{lineId, cost}]`. `cost` is the line's **sell total** (`total_cost`), shown in the dialog with `CurrencyText`: [C] `app/src/components/work-orders/RequestCustomerApprovalDialog.vue:40,118-135`. |
| Core builds the payload | [C] `CreateApprovalRequestCommandHandler.php:42-73` | Keeps lines with `isAuthorizationRequired()` (`:46-60`). Refuses a duplicate send by a hash of `lineId + cost` ([C] `Domain/Approvals/Sha256HashService.php:11-28`). |
| Core renders the estimate document | [C] `CreateApprovalRequestCommandHandler.php:120-132` | `InvoiceHtmlGenerator::generateHtml(InvoiceEstimateDataProvider(..., isEstimate: true, isHtml: true))`. This is the same Twig as the estimate PDF and the invoice ([C] `api/src/Invoicing/Invoice/Domain/Service/InvoiceFileGenerator.php:36-45`). The design is resolved per organization: modern `templates/invoices/invoice.html.twig` or legacy `templates/invoices/legacy/invoice.html.twig` ([C] `.../InvoiceSetting/Service/InvoiceTemplateResolver.php:34-40`). Prices follow the **sender's** pricing visibility ([C] `.../Domain/Service/InvoiceEstimateDataProvider.php:109`). |
| Core posts to the portal | [C] `api/src/External/CustomerPortal/Infrastructure/Http/CustomerPortalClient.php:17-40` | `POST /api/approvals` with `{customerId, organizationId, workplaceId, workOrderId, vehicleId, lines[{id,cost}], requestedBy, invoice: <HTML>, serviceAdvisor}`. |
| Portal receives | [P] `routes/api.php:10`; `app/Http/Controllers/Api/ApprovalsController.php:14-17`; `app/Http/Requests/Api/StoreApprovalRequest.php:20-34` | Validates. `authorize()` returns true by contract (`:11-15`). |
| Portal stores | [P] `app/Services/ApprovalCreationService.php:19-76` | Puts the HTML in S3 (`InvoiceStorageService::storeInvoice`, [P] `app/Services/InvoiceStorageService.php:22`). Marks older pending requests for the work order Obsolete (`:47-51`). Stores each line with its `cost` (`:67-73`). Dispatches the "Approval Required" email job (`:36-40`). |
| Email to the customer | [P] `app/Jobs/SendApprovalRequestNotifications.php:57-71`; `app/Mail/ApprovalRequestCreated.php:40-45`; `resources/views/emails/approval-request-created.blade.php:166-168` (per-line `$cost`), `:173-211` (Parts/Labor/Shop Supplies/Subtotal/Tax/Total), `:213-215` (estimate note) | Each line with its amount, then the portal-computed financial table. |
| Customer opens it | [P] `app/Http/Controllers/ApprovalsController.php:67-87` | Two sources: **live** data from core's DB (`ApprovalEnricherService::enrichApprovalRequest`, [P] `app/Services/ApprovalEnricherService.php:23-76`) and the **stored** HTML from S3 (`:76-80`). |
| Live work-order data | [P] `app/Services/Core/CoreWorkOrderService.php:18-53` (`fetchWorkOrders` `:55-107`, `fetchLines` `:109-130`) | Direct `core_db` reads. The work order has number, type, company, vehicle, workplace and service advisor. Each line has `line_name`, `description` and `status` only (no hours, no parts). |
| Live "Price Summary" | [P] `app/Services/ApprovalEnricherService.php:85-97` → `app/Services/Core/Pricing/WorkOrderFinancialsCalculator.php:38-113` over `CoreWorkOrderPricingRepository.php:20-360` | A portal **replica of core pricing** ("Faithful, not improved", `:9-24`). It reads the raw rate `wol.labour_type_cost AS rate` (`CoreWorkOrderPricingRepository.php:87`), mirroring [C] `WorkOrderPricing.php:211-237` (`:227`). It skips only declined lines (`:64,79-84`). |
| Page | [P] `resources/js/pages/Approvals/Show.vue` | Line cards with `Cost: {{ formatCurrency(line.cost) }}` (`:243-249`, the stored value). `FinancialInfoCard` "Price Summary" (`:293`; component `resources/js/components/approvals/FinancialInfoCard.vue:47-81`). The stored HTML in `InvoiceViewer` (`:343`). `InvoiceViewer` hides the document below the `md` breakpoint (`resources/js/components/invoice/InvoiceViewer.vue:10-11`), so **mobile users never see the core document**. Print uses `ApprovalsController::preview` (`:164-188`) → `resources/js/pages/invoices/PreviewInvoice.vue:29-50`, which calls `window.print()`. |
| Approve / Decline | [P] `ApprovalsController::update` `:89-162` → `app/Http/Integrations/ShopView/Requests/WorkOrder/Authorize.php:25-34` (`POST /work-orders/authorize`) | Unchanged by this feature. The shop is emailed with the line amounts ([P] `app/Jobs/SendApprovalReviewedNotification.php:58-71`; `app/Mail/ApprovalRequestReviewed.php:72-80`). |

#### 2.2 Invoice

| Surface | Where | Source |
|---|---|---|
| Invoices list | [P] `app/Http/Controllers/InvoicesController.php:60-101` → `app/Services/Core/InvoicesService.php:93-109,157-167` (select `:169-233`, joins `:235-244`, filters `:246-284`) → `app/Http/Resources/CoreInvoiceResource.php:16-68` | **Direct `core_db` query on `invoice`**. There is no status exclusion: `statuses` is an optional user filter (`:259-261`). `status` passes through raw (`CoreInvoiceResource.php:57`). |
| Customer and location filter options | [P] `InvoicesService.php:400-442` | Direct join on `invoice`. |
| Vehicle page invoices | [P] `app/Services/VehicleService.php:88` → `InvoicesService.php:111-155` | Direct query. It does not go through `applyFilters`. |
| Vehicle list stats | [P] `app/Services/Core/CoreVehicleService.php:87-105` | Direct query. The UI shows "Last Service" = `MAX(inv.created_on)`, "Completed", and the balance ([P] `resources/js/components/vehicle/VehicleCard.vue:48-56,60,70`; `resources/js/pages/vehicles/Index.vue:110-126`). |
| Invoice page | [P] `InvoicesController.php:103-187` → `InvoicesService.php:581-617` (access check on `core_db`: `userCanSeeTheInvoice` `:605-617`) → `app/Http/Integrations/ShopView/Requests/ShowInvoice.php:20-23` | Core `GET /invoices/{id}` ([C] `api/src/External/CustomerPortal/Http/Controllers/InvoicesController.php:70-108`) returns `{invoice, attachments, htmlContent}`. `htmlContent` is the core-rendered invoice ([C] `:101`, built by `resolveInvoicePreviewData` `:192-235` with `canSeePricingOverride: true` `:230`). The portal shows it with `v-html` ([P] `resources/js/components/invoice/InvoiceShowPage.vue:658`). Print uses `InvoicesController::preview` `:215-240` → `PreviewInvoice.vue`. |
| PDF | [P] `app/Services/InvoiceEmailService.php:229` → `app/Http/Integrations/ShopView/Requests/DownloadInvoicePdf.php:28-31` | Core `POST /invoices/{id}/pdf` ([C] `InvoicesController.php:110-164`). The portal has no PDF library. |
| "New invoice" email | [C] `api/src/External/CustomerPortal/CustomerPortalInvoiceCreatedNotifier.php:24-42` (called from [C] `Invoicing/Invoice/Application/HTTP/Create/CreateCommandHandler.php:240`) → [P] `app/Jobs/HandleWebhook.php:41` → `app/Jobs/Webhook/HandleInvoiceCreated.php:33-108` | Fetches via `ShowInvoice` and mails with the core PDF attached. |
| Overdue and late-fee reminders | [P] `app/Services/Core/OverdueInvoiceLookupService.php:55-93` | Already limited to pending, partially paid and sent (`:77-87`). Safe. |
| Payment | [P] `InvoicesService.php:658-757` | Refuses statuses that are not payable (`:691-698`). Safe. |

Dead code: [P] `app/Http/Integrations/ShopView/Requests/ListInvoices.php` and `.../WorkOrder/FindByIds.php` are not called anywhere. Core's `GET /invoices` list and External `VehiclesQueryBuilder` stats ([C] `.../Http/Controllers/VehiclesQueryBuilder.php:40-43`) are therefore not what the portal reads.

**Answer to (1):** the estimate is a **core-rendered HTML snapshot taken at Send to Portal**, framed by portal-rendered line cards, a portal-computed Price Summary and a portal email, all built from the portal's own `core_db` reads. The invoice document and PDF are **rendered by core per request** through `GET /invoices/{id}` and `POST /invoices/{id}/pdf`. Invoice lists and vehicle stats are the portal's own `core_db` queries.

---

### 3. Core: what `External/CustomerPortal` and the rest of core must provide

#### 3.1 What the backend appendix covers

| Need | Appendix | Reaches the portal through |
|---|---|---|
| Close never sends `invoice.created` to the portal (S3-R4) | Appendix A (Close skips `CustomerPortalInvoiceCreatedNotifier`) | No webhook, so no "new invoice" email. Covered. |
| Closed invoice → 404 on show, PDF and PO update | Appendix A (`InvoicesQueryBuilder` adds `i.status <> 'closed'`) | [C] `InvoicesController.php:70-185` all start from `InvoicesQueryBuilder::whereInvoiceId` (`:103-110`). Covered, as defense in depth (see 3.2 M1). |
| Send to Portal refused on an internal work order (S2-R11) | Appendix A | Core refuses. Covered. |
| Estimate document: NO CHARGE stamp, "Category: [name] · Original work order [n]", no prices on a whole no-charge work order; a no-charge line at $0.00 with its category under the title | Appendix A (estimate view DTO + `classification`, `no_charge_category`, `no_charge`), `:430` (Documents), `:508` | `CreateApprovalRequestCommandHandler::generateInvoice()` uses the same `InvoiceEstimateDataProvider` as `POST /api/work-orders/invoices/estimate` ([C] `Invoicing/Invoice/Application/Estimate/View/ViewController.php:16`), so the portal snapshot gets the change. Covered, subject to M4. |
| Invoice with a no-charge line: statement priced 0, items 0, category flag (S12-R7) | Appendix A | Core invoice HTML and PDF. Covered, subject to M4. |
| Deposit refused on non-billable (S2-N5) | Appendix A | Also applies to the portal's deposit path: [C] `api/src/External/Payment/Application/CreateDeposit/CreateDepositController.php:45-52` runs the in-app `CreateCommand`. Covered on the core side, **but only after Stripe has charged** (portal P5). |
| A closed invoice's `payment_status` reads `paid` with balance 0 | Appendix A (risk 15 names "the portal") | Portal readers of `payment_status`: `InvoicesService.php:203,228-231`, which force `leftToPayBalance` to 0. Harmless once P1 excludes the rows. |

#### 3.2 What the backend appendix misses or gets wrong

| # | Gap | Evidence | Fix (owner) |
|---|---|---|---|
| M1 | The portal does not use core's External list or stats endpoints. Excluding `closed` in `InvoicesQueryBuilder` and changing `VehiclesQueryBuilder` do not reach the portal list, the vehicle invoice tab or the filter options. | §2.2 table; dead Saloon requests | **Portal** P1. Core keeps its change as defense in depth for show, PDF and PO. |
| M2 | "Sent estimate regenerated through the existing price-change path" does not exist. Approval requests are insert-only, written only by the advisor's send. A price change today leaves the portal snapshot stale until the advisor re-sends. | Appendix A (Phases 4 and 4B); [C] `Domain/Approvals/ApprovalRequest.php:18-24`; `CreateApprovalRequestCommandHandler.php:62-72` | **Resolved** in Appendix A: no estimate is re-sent; the portal reads the live state on open (Q54 ✓). |
| M3 | §2.9 lists the raw-column readers that write-time zeroing protects (WIP, Parts Velocity, search). The portal's price replica is another raw-column reader, and the labor rate (`labour_type_cost`) is **not** zeroed. It must stay, because the statement keeps the real rate (`no_charge_labor_rate`, S12-R7). | Appendix A; [P] `CoreWorkOrderPricingRepository.php:87` | **Resolved** in Appendix A §2.9: the portal replica is named as a reader that must mirror the mask, backed by a shared fixture. |
| M4 | The Documents paragraph names `templates/invoices/modern/`. That folder holds only `payment-receipt.html.twig`. The modern invoice is `templates/invoices/invoice.html.twig`, and the legacy design (`templates/invoices/legacy/invoice.html.twig`) is not mentioned. The portal shows whichever design the organization uses. | Appendix A; [C] `InvoiceTemplateResolver.php:34-40` | **Resolved** in Appendix A: both `invoice.html.twig` and `legacy/invoice.html.twig` get the variants. |
| M5 | `work_order_original_reference.original_work_order_number` is a "number snapshot". The portal shows display numbers (`S4-6`, SV-10297) everywhere. | Appendix A; [P] `CoreWorkOrderService.php:60-61` | **Resolved** in Appendix A: `original_work_order_number` stores `COALESCE(display_number, number)`. |
| M6 | The Send to Portal dialog shows and sends `cost` per line. The FE appendix only changes the button's visibility. | [C] `RequestCustomerApprovalDialog.vue:40,118-135`; Appendix B FE-B3 | **Resolved** in Appendix B (FE-B3): `RequestCustomerApprovalDialog.vue` hides and sends no line amounts on a whole no-charge work order. |
| M7 | Deploy order relative to the portal is not stated. §2.15 and §10 cover only core and the hub. | Appendix A | Section 5 of this appendix. |
| M8 | S12-R4 "The portal renders its own documents" is wrong (§1). SV-12296's real scope is the core templates, plus portal line cards, the Price Summary and emails. | §2 | **Resolved** in v0.22: S12-R4 now says ShopView renders the estimate and invoice documents and the portal shows them. |

#### 3.3 Changes to core's External responses

- **No new External endpoint and no new field are required** under the recommended design. The portal reads classification, categories, originals and no-charge lines from core's DB, as it already reads lines and prices.
- `POST /api/approvals` payload (core to portal): unchanged.
  - Not needed (Q54 ✓ chose option A in v0.22); kept for reference — option C would add `classification` and `noChargeLineIds` so the snapshot's state is explicit. The portal can read the same values from core's DB at receive time; P4 does this.
- `GET /invoices/{id}`, `POST /invoices/{id}/pdf`, `PUT /invoices/{id}`: closed → 404 (covered). For an invoice with a no-charge line, nothing extra is masked in the JSON. The portal never renders statements, and the statement is already priced 0 at build time (Appendix A).
- `POST /work-orders/authorize`: unchanged. Approve and Decline work as today (S2-R11).
- Which lines and statements: the approval carries the lines that need authorization at send time, a no-charge line included (S12-R3: approval works as on any line), with `cost` 0. The estimate HTML carries every line as the core template prints it. On a whole no-charge work order every line carries no price.

---

### 4. Portal changes: phased plan

Every phase follows the portal's `AGENTS.md` and `CLAUDE.md`:

- thin controllers, logic in `app/Services`;
- every `core_db` query scoped to `Tenant::current()`'s organization;
- Form Requests for input;
- `<script setup lang="ts">`, `@/` imports, no `any`, the existing `ui/` components;
- Pest tests in the same PR.

Branch from a fresh `origin/develop` (a new worktree), not the stale local `develop`.

New portal tests use `useSqliteCoreDb()` ([P] `tests/Pest.php:76-94`) so they run in CI. CI runs `php artisan test --exclude-group=core-db` (`.github/workflows/ci.yml:136-139`), so nothing new may join the `core-db` group (`tests/Pest.php:30-41`). Where a query uses MySQL-only functions (`GREATEST`, `LEAST`, `CONVERT_TZ` in `InvoicesService.php:222-231,312-315`), register sqlite shims in `useSqliteCoreDb()`, next to the existing `BIN_TO_UUID` (`:93`).

#### P1: A closed record is never an invoice in the portal (S3-R4, S3-R6)

Depends only on the new `invoice.status` value `closed`, not on any new column. It is inert until the first Close, so it can ship at once and must be in production before the core switch flips.

| File | Change |
|---|---|
| `app/Enums/InvoiceStatus.php:6-34` | `case Closed = 'closed'` with label "Closed". **Not** added to `getAllStatuses()`, so the list filter keeps refusing it (`app/Http/Requests/GetCoreInvoicesRequest.php:23-24`), and not to the payable or paid lists. |
| `app/Services/Core/InvoicesService.php` | Exclude `invoices.status = closed` in `applyFilters()` `:246-284` (covers the list, `fetchAndValidateInvoices` and the overdue lookups), in `getVehicleInvoicesPaginated()` `:111-155`, in the joins of `getDistinctCustomers()` `:400-420` and `getDistinctWorkplaces()` `:422-442`, and in `userCanSeeTheInvoice()` `:605-617` and `getCustomerEmailForFetchingInvoice()` `:531-560`. The last two make show, preview, send-email and PO update return 404 before calling core. One private helper keeps the predicate in one place (`CLAUDE.md`: "Extract reusable logic"). |
| `app/Services/Core/CoreVehicleService.php:87-105` | No change recommended (Q61). A closed work order is a service on the asset: it counts in Completed and in "Last Service". Its `total_balance` is 0. Pin this with a test. |
| `app/Services/ServiceRequestsService.php:461-500` | No change. It only counts invoices as activity per location. |

Tests:
- `tests/Unit/InvoiceStatusTest.php`: Closed exists, is not in all, payable or paid, and is refused by the filter rule.
- New `tests/Feature/ClosedInvoiceHiddenFromPortalTest.php` (sqlite core):
  - a closed and a sent invoice for the same customer: the list shows only the sent one;
  - the vehicle tab, the customer filter and the location filter likewise;
  - `GET /invoices/{closed}` and `/preview` return 404, and Saloon's `MockClient` records no core call;
  - a batch checkout naming the closed id is refused;
  - a second organization's rows never appear.
- `tests/Feature/VehiclesControllerTest.php`: a closed work order adds $0.00 and counts as Completed.

#### P2: Read model for classification, categories, originals and no-charge lines

Requires core Phases 1, 2C and 4 migrated in the environment the portal's `CORE_DB_*` points to (`config/database.php:117-125`).

| File | Change |
|---|---|
| `app/Enums/WorkOrderClassification.php` (new) | `Billable`, `Internal`, `NoCharge` (`billable`/`internal`/`no_charge`). `fromCore(?string)` returns Billable for null. |
| `app/Services/Core/CoreWorkOrderService.php:55-107` (`fetchWorkOrders`) | Add `wo.classification`. LEFT JOIN `work_order_category woc ON woc.id = wo.category_id AND woc.organization_id = wo.organization_id` → `category {key, name}`. LEFT JOIN `work_order_original_reference` (the work-order subject, Appendix A) → `originalWorkOrderNumber`, `originalNotInShopView`. |
| `CoreWorkOrderService.php:109-130` (`fetchLines`) | Add `wol.no_charge_category_id` → LEFT JOIN `work_order_category` (organization-pinned through `work_order`) → `noChargeCategory {key, name} | null`. Add `hours` = `time_estimate / 60`, the same unit the replica uses (`WorkOrderFinancialsCalculator.php:143`). |
| `CoreWorkOrderService.php` (new `fetchLineWork(array $lineIds)`) | Show page of a whole no-charge work order only. Per line, part rows with description and quantity: `work_order_part` minus returns, declined skipped; plus unreceived `work_order_part_request`, received and core rows skipped. The skip rules are the ones the replica already uses (`WorkOrderFinancialsCalculator.php:151-186`). One query per table. Not run on the list pages. |
| `CoreWorkOrderService.php:142-162` (`findOwnershipByIds`) | Add `wo.classification` (for P4's internal exclusion). |
| `resources/js/types/index.d.ts:477-530` | `ApprovalRequestLine.line`: `noChargeCategory`, `hours`, `parts?`. `ApprovalRequest.workOrder`: `classification`, `category`, `originalWorkOrderNumber`, `originalNotInShopView`. |

Tests:
- New `tests/Feature/CoreWorkOrderServiceClassificationTest.php` (sqlite core): classification and category read; another organization's category id never joins; NULL classification maps to Billable; part rows skip declined, returned and core parts.
- Extend `tests/Unit/ApprovalEnricherServiceTest.php`.

#### P3: Price Summary replica parity with core's new mask

Must ship before the core switch flips.

| File | Change |
|---|---|
| `app/Services/Core/Pricing/CoreWorkOrderPricingRepository.php:33-64,71-94` | Select `wo.classification` and `wol.no_charge_category_id AS noChargeCategoryId`. |
| `app/Services/Core/Pricing/WorkOrderFinancialsCalculator.php:38-113` | A non-billable service work order returns **null**. The card and the email table then hide through the existing guards ([P] `Show.vue:293`; `approval-request-created.blade.php:173`). |
| `WorkOrderFinancialsCalculator.php:123-261` | A no-charge line gets labor 0, parts 0 and no labor or parts tax, as declined does. The check sits before the fixed-line-total branch. This mirrors core's `WorkOrderLinePricingDto::isNoCharge()` and `WorkOrderPricing` (Appendix A). The shop supplies percentage then uses billable labor only (`:270-297`), as S12-R4 requires. Update the class docblock (`:9-24`) to cite the core classes it now mirrors. |
| `CoreWorkOrderPricingRepository.php:280-296` | No change: the calculator returns before the invoiced branch for non-billable work orders. |

Tests: new `tests/Unit/WorkOrderFinancialsCalculatorNoChargeTest.php`, with the repository mocked.
- A billable work order with a no-charge line that still stores its real rate and a part with its sell price: totals, tax and the shop supplies percentage are computed on the billable line only.
- The same fixture numbers as core's `WorkOrderLinePricingNoChargeTest` (Appendix A), so the two repositories assert one result (PE-14).
- A whole no-charge or internal work order returns null.
- A fixture without no-charge lines gives today's numbers exactly.

#### P4: Approval page and emails (S2-R11, S2-R16, S2-E6, S12-R4, S12-E3)

| File | Change |
|---|---|
| `database/migrations/2026_11_<dd>_000000_add_estimate_state_to_approval_requests_table.php` (new, portal DB) | `approval_requests.work_order_classification` (string, nullable; null means billable for every request made before the release) and `no_charge_line_ids` (json, nullable). |
| `app/Models/ApprovalRequest.php` | Fillable and casts for both. |
| `app/Services/ApprovalCreationService.php:19-76` | Before `storeInvoice`, read the live estimate state from `core_db` (classification and no-charge line ids, through `CoreWorkOrderService`). Refuse an **internal** work order with 422 (defense in depth; core refuses first, S2-R11). Otherwise store the state. |
| `app/Services/ApprovalEnricherService.php:23-76` | Expose `workOrder.classification`, `category` and the original. Add a computed `estimateStale`: the stored state differs from the live state. For a whole no-charge work order on the show page, load hours and parts (P2 `fetchLineWork`). |
| `app/Http/Controllers/ApprovalsController.php:67-87,164-188` | When `estimateStale`, pass `invoiceHtml = null` so neither the page nor the print preview shows a snapshot with stale prices. Pass `estimateStale`. In `update()` `:89-162`, refuse (422 "This estimate is no longer available.") when the work order is now internal (Q57). Pass `workOrderInternal` (classification `internal`) to the page, which shows the obsolete banner for it (S1-R11 v1.0). |
| `app/Services/ApprovalRequestsService.php:125-162` | `isWorkOrderInvalid()` also treats `classification = internal` as invalid. It then drops out of both lists and the pending badge, with the existing 60 s cache (`:21`). |
| `resources/js/components/approvals/NoChargeEstimateHeader.vue` (new) | The NO CHARGE stamp and "Category: [name]", plus " · Original work order [number]" when set (S2-R16 v0.22: never "Not in ShopView"). Rendered on every breakpoint, because the core document is hidden on mobile (`InvoiceViewer.vue:10-11`). Built from `ui/badge`. |
| `resources/js/components/approvals/ApprovalLineWorkDetails.vue` (new) | Whole no-charge work order: per line, Hours and the parts with Qty (frame 7b, Q56), with no amount. |
| `resources/js/pages/Approvals/Show.vue` | Made internal (S1-R11 v1.0): the controller passes `workOrderInternal`, and `isObsolete` (`:63`) becomes `status === 'obsolete' \|\| workOrderInternal`, so the existing obsolete banner (`:212-214`) shows and Approve / Decline are hidden; the "estimate changed" notice is not shown in that case. Header: `NoChargeEstimateHeader` when classification is `no_charge`. Line card (`:226-250`): on a whole no-charge work order, `ApprovalLineWorkDetails` replaces `Cost:`. On a no-charge line, the category name sits under the title and `Cost:` reads $0.00 from live data whatever was stored (S12-R4). When `estimateStale`, a notice replaces `InvoiceViewer` (`:343-346`): "This estimate changed after it was sent. The lines above are current." The Price Summary needs no change (null hides it). |
| `app/Mail/ApprovalRequestCreated.php:31-47`; `resources/views/emails/approval-request-created.blade.php:154-215` | Whole no-charge work order: no per-line amount, no financial table, no "total above includes" note, and a "NO CHARGE · Category: [name]" line. No-charge line: the category under the name and $0.00 (Q55). The mailable is queued, so restart running workers per the portal's `AGENTS.md` "Queue Workers". |
| `app/Mail/ApprovalRequestReviewed.php:72-80`; `resources/views/emails/approval-request-reviewed.blade.php` | Shop-facing. Add the category under the line name. Amounts stay as stored. |

Tests:
- Extend `tests/Feature/ApprovalCreationTest.php`: the state is stored; internal → 422 with no S3 object left.
- New `tests/Feature/NoChargeApprovalPageTest.php` (Inertia assertions, sqlite core):
  - whole no-charge: no `financials`, no line amounts, stamp props, category and original;
  - billable to no-charge after the send: `invoiceHtml` is null and `estimateStale` is true;
  - a line marked after the send: that line shows $0.00 with its category, and the summary excludes it;
  - made internal after the send: the page gets `workOrderInternal`, `isObsolete` is true (the obsolete banner, no Approve / Decline, no "estimate changed" notice), and `update()` answers 422 "This estimate is no longer available.";
  - a billable approval's props are unchanged.
- Extend `tests/Feature/ApprovalsCountExclusionTest.php` (internal excluded from the list and the badge).
- New `tests/Feature/ApprovalEmailNoChargeTest.php` (`Mail::fake()` plus a rendered-HTML check: no `$` amount or "Total" on a whole no-charge estimate; $0.00 and the category on a no-charge line).
- `/write-tests` Playwright flow (portal `AGENTS.md`), desktop and 390 px: approve one line and decline one on a no-charge estimate; the decision reaches core.

- **Made internal after sending (S1-R11, Q57 ✓):** a pending estimate whose work order became internal shows the portal's existing obsolete-estimate banner (`Show.vue` treats `workOrderInternal` as obsolete; no Approve / Decline, no "estimate changed" notice; asserted in `NoChargeApprovalPageTest`) and refuses approval with 422 ("This estimate is no longer available.", S1-R11 v1.0, Q64 ✓).

#### P5: No deposit on internal or no-charge work orders (S2-N5)

Prevents charging a card for a deposit core will refuse.

| File | Change |
|---|---|
| `app/Services/Stripe/DepositCheckoutService.php:109-116` | `acceptsDeposit(type, status, classification)`: a service work order must be billable. Used by `fetchAndValidateWorkOrder` (`:345-361`) and the guard. |
| `app/Services/Core/DepositsService.php:136-190` | The picker SQL adds `wo.classification = 'billable'` for service work orders. |
| `app/Services/DepositCollectionStatusService.php:42-93` (`:76`) | Read the classification and refuse with a new reason. |
| `app/Enums/DepositCollectionGuardReason.php:36-45` | `WorkOrderNotBillable = 'work_order_not_billable'` with the message "Deposits are not available on internal or no-charge work orders." Core passes `reason` and `message` through verbatim ([C] `api/src/External/CustomerPortal/Domain/DepositCollection/DepositCollectionStatus.php:11-16`), so no core change. |

Tests: extend `tests/Feature/DepositRulesTest.php` and `tests/Feature/Deposits/InFlightDepositGuardTest.php` (a no-charge or internal work order is refused by the picker, the checkout and the guard; billable is unchanged).

#### P6: Invoice with a no-charge line (S12-R7, SV-12296): verification only

No portal code. Core renders the invoice HTML and PDF. The total, balance and payment come from core's billable figures (`invoice.total_balance`, `leftToPayBalance`).

QA checklist on a portal environment linked to a core environment with the switch on:
- the invoice page, print, PDF download, PDF email attachment and Pay now all show the line at $0.00, its parts at $0.00, "Warranty" under the title, and no stamp or "No Charge" wording;
- the amount paid equals the billable total;
- for a part with a core charge on the line (S12-E3): the core row shows at $0.00;
- when every line is no charge (S12-R10): a $0.00 invoice listed as Paid, as today.

#### Gates for every portal PR (the portal's own tooling)

1. `vendor/bin/sail bin pint --dirty`, matching CI `./vendor/bin/pint --test` (`ci.yml:54-55`).
2. `vendor/bin/sail artisan test <new and changed test files>`, then the CI command `vendor/bin/sail artisan test --exclude-group=core-db`.
3. `npx eslint .` and `npm run format:check` (`ci.yml:72-76`); `npm run build` (`ci.yml:133-134`). Run `npx vue-tsc --noEmit` locally if it passes on the `origin/develop` baseline (it is not a CI gate).
4. The `.githooks/pre-commit` gates mirror CI. Never bypass them.
5. Then:
   - the `code-simplifier` agent (portal `CLAUDE.md`);
   - `/code-review` before each commit and `/code-review PR` before the PR (portal `AGENTS.md`, mandatory);
   - `/write-tests` for the Playwright flow.
6. Do not run `wayfinder:generate`. No new routes are planned.
7. Runtime check:
   - a local portal against a core database migrated through Phases 1, 2C and 4;
   - seed one closed invoice, one no-charge work order with a pending approval, and one billable work order with a no-charge line;
   - walk Invoices, Vehicles and Approvals (show, print, approve) at desktop and 390 px, watching the console;
   - check the queued emails in the mail log.

---

### 5. Dependencies and deploy order versus the core release

The core release gate is the deploy parameter `app.internal_work_orders.enable_allowed` (env `NO_CHARGE_WORK_ORDERS_ENABLE_ALLOWED`, default false). It guards the enable paths and every new core surface (Appendix A §2.15, D64). While it is false, no organization can turn the setting on, so no internal or no-charge work order, no no-charge line and no `closed` invoice exists. The portal changes are inert on billable data: every new predicate is a no-op on the defaults (`classification = 'billable'`, NULL categories, no `closed` rows). The portal needs no switch of its own.

| Order | Step | Gate |
|---|---|---|
| 1 | **Portal P1** (closed exclusion) to production | None: no schema dependency. Ship first. |
| 2 | Core Phase 1 (`work_order.classification`, `work_order_line.no_charge_category_id`, `invoice` columns), Phase 2C (`work_order_category`) and Phase 4 (`work_order_original_reference`) **migrated** in the environment | Core §10 order. |
| 3 | **Portal P2 to P5** to the portal environment whose `CORE_DB_*` points at that core database (QA first, then staging, then production) | Hard: must follow step 2 in the same environment, or `findByIds` fails with unknown-column SQL errors and the approvals pages 500. Only the financials call is wrapped in a catch (`ApprovalEnricherService.php:85-97`). |
| 4 | Core QA verifies SV-11975 (Send to Portal on a no-charge work order, S2-R11) and SV-11976 (Close, S3-R4) against a portal QA environment running step 3 | The portal branch must be deployed there for those runs. |
| 5 | Core switch flips in staging, then production (after hub Release B and core emission, Appendix A) | Steps 1 and 3 must be in that environment's portal first. |
| 6 | Launch: core removes the switch (S13-R5) | Nothing to remove in the portal. |

**Rollback rule.** Once any organization has enabled the setting, rolling the portal back past P1, P3 or P4 re-exposes prices or closed records. Turning the core switch off does not remove existing no-charge work orders (S2-N1). So after the switch has flipped, the portal is rolled forward only.

---

### 6. Risks

1. **Price leak through the replica.** If P3 lags the switch, a whole no-charge estimate shows labor (stored rate × hours), flat shop supplies, tax and a total. A billable estimate also overstates totals by the no-charge line's labor. Mitigation: P3 is a gate on step 5; the parity fixture.
2. **Two pricing implementations drift.** Core's mask and the portal replica must change together. The portal header already warns about this ("Faithful, not improved"). Mitigation: shared fixture numbers (PE-14), and a core PR checklist line: "`WorkOrderPricing` changed → portal replica PR".
3. **Hard schema dependency** (step 3 before step 2 fails with a 500). Mitigation: release checklist; a portal smoke check after deploy (open one approval and the invoices list).
4. **Stale artifacts cannot be recalled.**
   - The "Approval Required" email sent before a conversion keeps its prices; the page is corrected on the next open.
   - The stored snapshot is suppressed, not regenerated.
   - The advisor can re-send. The line hash includes `cost`, so core accepts the re-send ([C] `Sha256HashService.php:11-28`).
5. **Expectation mismatch on S2-E6 and S12-R4.** QA following the PRD will look for an automatic re-send that does not exist today (M2). Mitigation: settle Q54 before the test cases are written.
6. **Legacy invoice design.** Shops on the legacy design would get portal estimates and invoices without the stamp, the category or the $0.00 line if only the modern template changes (M4).
7. **Deposit charged and then refused** (S2-N5) if P5 is missing. Also a race: a checkout is opened on a billable work order, the work order is converted to no charge, then the customer pays. Core rejects, the portal logs `core_sync_failed` ([P] `app/Services/DepositSyncService.php:112-118`), and the money stays in Stripe until an admin refunds (PE-12).
8. **Mobile parity.** The core document is hidden below `md`. Without the P4 header and line details, a mobile customer sees no stamp, no category and no hours.
9. **Cache lag.** A work order made internal can stay in the pending list and the badge for up to 60 s (`ApprovalRequestsService.php:21`). `update()` refuses regardless.
10. **Stale portal checkout.** Local `develop` is 312 commits behind. An implementer who branches from it would miss months of changes to the same files (for example SV-11663 and SV-10297).
11. **MySQL-only SQL in tests.** Without sqlite shims, the exclusion tests would have to live in the `core-db` group, which CI skips.

---

### 7. Questions

**All product questions here (Q54–Q61) were answered as recommended in PRD v0.22 (page 36); the recommendations below are now the requirements.**

Product questions carry the plan's ids (posted in round 3 as Q54–Q61). Engineering items PE-8 … PE-14 are decided: PE-8, PE-9 and PE-10 in Appendix A / B (display-number snapshot, both invoice template designs, the Send to Portal dialog), PE-11, PE-12 and PE-14 in D59, PE-13 in the verification tickets (Section 11).

**Q54. PRODUCT + ENGINEERING. How does a sent estimate get updated (S2-E6, S12-R4)?** No re-send happens today (M2). Options:
- (A) The portal reads the live state on open, suppresses a snapshot whose state differs, shows the stamp, category and lines itself, and the advisor re-sends for a fresh document. No new contract, no extra email, same link.
- (B) Core automatically re-sends after each classification or line write. This creates a new approval request, obsoletes the old link and emails the customer again. The call must be made after commit, and its failure must not fail the conversion.
- (C) Core pushes the regenerated HTML into the pending request through a new portal endpoint.

**Recommend A.** It meets "shows the updated estimate with the NO CHARGE stamp on its next open" on the same link, and never leaves a price on a no-charge estimate. Appendix A already says this (D67). S12-R4's "exactly as a price change on a sent estimate is today" is then literally true, because today nothing is regenerated.

**Q55. PRODUCT. Does the "Approval Required" email follow the page rule?** Recommend yes: no amounts or totals on a whole no-charge estimate, the stamp and category line in their place, and a no-charge line at $0.00 with its category. The email carries the same estimate as the page.

**Q56. PRODUCT. On a whole no-charge estimate, do the portal line cards show hours and parts with quantities, as frame 7b does?** The core document carries them but is hidden on mobile. Recommend yes, on no-charge estimates only. Billable cards stay as today ("the customer portal behave[s] exactly as [it does] today").

**Q57. PRODUCT. What happens to a pending estimate whose work order is later made internal (S1-R11 Make internal, same customer)?** Recommend treating it as no longer available: out of the pending list and the badge, the existing Obsolete banner on the page, and Submit refused. Internal work orders are never on the portal.

**Q58. PRODUCT. Convert to Billable after a no-charge estimate was sent.** Recommend: suppress the stale NO CHARGE snapshot and show the live Price Summary. Approve and Decline keep working, and the advisor re-sends. This is the same as today's price-change behavior, plus suppressing a now-false stamp.

**Q59. PRODUCT. Does the customer-facing category line show "Not in ShopView"?** Recommend omitting it and showing "Category: Warranty" only, on the portal and on core's customer-facing estimate. The phrase is shop vocabulary. Show "· Original work order [n]" only for a real work order.

**Q60. PRODUCT (design).** Frame 7b says "Reason: Warranty"; the text says "Category: [name]". The text wins. The v6.1 export lacks frame 7b. Please re-export the frame with the category wording, the original work order, and a no-charge line on a billable estimate, which is not drawn yet.

**PE-8. ENGINEERING (core).** Snapshot the original work order's **display** number (`COALESCE(display_number, number)`, SV-10297) in `work_order_original_reference.original_work_order_number`. Recommend yes. Otherwise the portal and the documents print `S-6` where every other surface prints `S4-6`.

**PE-9. ENGINEERING (core).** Correct the Documents path: the modern design is `templates/invoices/invoice.html.twig`, the legacy one is `templates/invoices/legacy/invoice.html.twig`. Add a snapshot test per design for the estimate (stamp, category line, no prices) and the invoice (the $0.00 line with its category). Include one functional test that the HTML posted to the portal by Send to Portal on a no-charge work order has no price.

**PE-10. ENGINEERING (core FE).** `RequestCustomerApprovalDialog.vue` hides line amounts on a whole no-charge work order. `cost` must be 0 for every no-charge line, which follows from the masked `total_cost`; add a spec. Recommend adding both to the FE appendix next to Appendix B FE-B3.

**PE-11. ENGINEERING. Deploy ordering versus a runtime schema check.** Recommend strict ordering (Section 5) plus a release checklist line. A `hasColumn` probe on every request adds load and hides real failures.

**PE-12. ENGINEERING. Deposit race (risk 7).** Recommend that core's `deposits_not_available` rejection is recorded with a distinct activity reason, with the existing refund action in front of the admin. Auto-refund is possible later; it is out of scope here.

**PE-13. ENGINEERING (process).** The ticket drafts have no portal ticket for S2-R11, S2-E6 and S3-R4; only SV-12296 (Story 12) names the portal. Recommend:
- one portal ticket for P1, which ships now;
- one for P2 to P4, widening SV-12296 or linking it;
- one for P5.

Also correct S12-R4's "The portal renders its own documents" (M8). The orchestrator files these; this appendix does not.

**PE-14. ENGINEERING. Parity fixture.** Recommend that core's `WorkOrderLinePricingNoChargeTest` and the portal's `WorkOrderFinancialsCalculatorNoChargeTest` assert the same inputs and outputs: the same lines, rates, parts, tax and shop supplies settings. A change to either then fails one side visibly.

**Q61. PRODUCT. Vehicle list "Last Service" and "Completed".** Recommend that a closed internal or no-charge work order counts: it is a service on the asset, not an invoice (S3-R4 is about invoices). It adds $0.00 to the balance.

---

### 8. File index

**Portal, modified:**
- `app/Enums/InvoiceStatus.php`
- `app/Services/Core/InvoicesService.php`
- `app/Services/Core/CoreWorkOrderService.php`
- `app/Services/Core/Pricing/CoreWorkOrderPricingRepository.php`
- `app/Services/Core/Pricing/WorkOrderFinancialsCalculator.php`
- `app/Services/ApprovalCreationService.php`
- `app/Services/ApprovalEnricherService.php`
- `app/Services/ApprovalRequestsService.php`
- `app/Http/Controllers/ApprovalsController.php`
- `app/Models/ApprovalRequest.php`
- `app/Mail/ApprovalRequestCreated.php`
- `app/Mail/ApprovalRequestReviewed.php`
- `resources/views/emails/approval-request-created.blade.php`
- `resources/views/emails/approval-request-reviewed.blade.php`
- `resources/js/pages/Approvals/Show.vue`
- `resources/js/types/index.d.ts`
- `app/Services/Stripe/DepositCheckoutService.php`
- `app/Services/Core/DepositsService.php`
- `app/Services/DepositCollectionStatusService.php`
- `app/Enums/DepositCollectionGuardReason.php`
- `tests/Pest.php` (sqlite shims)

**Portal, new:**
- `app/Enums/WorkOrderClassification.php`
- `database/migrations/2026_11_<dd>_000000_add_estimate_state_to_approval_requests_table.php`
- `resources/js/components/approvals/NoChargeEstimateHeader.vue`
- `resources/js/components/approvals/ApprovalLineWorkDetails.vue`
- `tests/Feature/ClosedInvoiceHiddenFromPortalTest.php`
- `tests/Feature/CoreWorkOrderServiceClassificationTest.php`
- `tests/Unit/WorkOrderFinancialsCalculatorNoChargeTest.php`
- `tests/Feature/NoChargeApprovalPageTest.php`
- `tests/Feature/ApprovalEmailNoChargeTest.php`

**Portal, extended tests:**
- `tests/Unit/InvoiceStatusTest.php`
- `tests/Unit/ApprovalEnricherServiceTest.php`
- `tests/Feature/ApprovalCreationTest.php`
- `tests/Feature/ApprovalsCountExclusionTest.php`
- `tests/Feature/VehiclesControllerTest.php`
- `tests/Feature/DepositRulesTest.php`
- `tests/Feature/Deposits/InFlightDepositGuardTest.php`

**Core follow-ups raised here:** all resolved in Appendix A / B — the two invoice template designs (M4, PE-9), the display-number snapshot (M5, PE-8), the Send to Portal dialog (M6, PE-10), no automatic re-send (M2, D67, Q54 ✓), the portal replica named in §2.9 (M3); the portal steps in core's release order (M7) are in Section 5.